import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, DollarSign, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import CustomTimePicker from './CustomTimePicker';

const libraries = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -28.016666,
  lng: 153.399994
};

const eventTypes = [
  'Running', 'Yoga', 'HIIT', 'Cycling', 'Meditation', 'Walking', 'Gym', 'Outdoor',
  'Crossfit', 'Beach Tennis', 'Tennis', 'Volleyball', 'Swimming', 'Pilates', 'Zumba',
  'Boxing', 'Martial Arts', 'Dance', 'Basketball', 'Soccer'
];
const EditEvent = () => {
    const { id } = useParams();
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries,
    });
  
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [map, setMap] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [eventDetails, setEventDetails] = useState({
      name: '',
      date: '',
      time: {
        hours: 12,
        minutes: 0,
        ampm: 'PM'
      },
      location: '',
      type: '',
      maxParticipants: '',
      price: '',
      description: '',
      images: [],
      duration: '',
      isRecurring: false,
      recurringFrequency: '',
      recurringEndDate: '',
      latitude: null,
      longitude: null,
    });
    useEffect(() => {
        const getCurrentUser = async () => {
          const { data: { user } } = await supabase.auth.getUser();
          setUser(user);
        };
        getCurrentUser();
        fetchEventDetails();
      }, [id]);
    
      const fetchEventDetails = async () => {
        try {
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .single();
    
          if (error) throw error;
    
          // Parse the time string into hours, minutes, and AM/PM
          let hours = 12;
          let minutes = 0;
          let ampm = 'PM';
    
          if (data.time) {
            const timeParts = data.time.split(' ');
            if (timeParts.length === 2) {
              const [time, period] = timeParts;
              const [hourStr, minuteStr] = time.split(':');
              hours = parseInt(hourStr);
              minutes = parseInt(minuteStr);
              ampm = period.toUpperCase();
            }
          }
    
          setEventDetails({
            ...data,
            time: {
              hours,
              minutes,
              ampm
            },
            isRecurring: data.is_recurring,
            maxParticipants: data.max_participants,
            recurringFrequency: data.recurring_frequency,
            recurringEndDate: data.recurring_end_date,
            images: data.image_paths || [],
          });
    
          if (data.latitude && data.longitude) {
            setSelectedLocation({ lat: data.latitude, lng: data.longitude });
          }
        } catch (error) {
          console.error('Error fetching event details:', error);
          alert('Failed to fetch event details. Please try again.');
        }
      };
      const onMapLoad = useCallback((map) => {
        setMap(map);
      }, []);
    
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEventDetails(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
        }));
      };
    
      const handleTimeChange = (newTime) => {
        setEventDetails(prev => ({
          ...prev,
          time: newTime
        }));
        setShowTimePicker(false);
      };
    
      const handleLocationChange = (e) => {
        const newLocation = e.target.value;
        setEventDetails(prev => ({ ...prev, location: newLocation }));
    
        if (isLoaded && newLocation) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ address: newLocation }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const { lat, lng } = results[0].geometry.location;
              const locality = results[0].address_components.find(
                component => component.types.includes('locality')
              );
              
              setSelectedLocation({ lat: lat(), lng: lng() });
              setEventDetails(prev => ({
                ...prev,
                latitude: lat(),
                longitude: lng(),
                location: locality ? locality.long_name : newLocation
              }));
              
              if (map) {
                map.panTo({ lat: lat(), lng: lng() });
              }
            } else {
              console.error('Geocode was not successful for the following reason: ' + status);
            }
          });
        }
      };
    
      const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setEventDetails(prev => ({
          ...prev,
          images: [...prev.images, ...files],
        }));
      };
    
      const handleRemoveImage = (index) => {
        setEventDetails(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== index),
        }));
      };
    
      const formatTime = (time) => {
        return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')} ${time.ampm}`;
      };
      const uploadImages = async (eventId) => {
        const BUCKET_NAME = 'event-images';
        
        const uploadPromises = eventDetails.images.map(async (image, index) => {
          if (typeof image === 'string') {
            // If the image is already a URL, it's an existing image
            return image;
          }
    
          const timestamp = new Date().getTime();
          const randomString = Math.random().toString(36).substring(2, 15);
          const fileName = `event_${eventId}_image_${timestamp}_${randomString}.${image.name.split('.').pop()}`;
          
          try {
            const { data, error } = await supabase.storage
              .from(BUCKET_NAME)
              .upload(fileName, image);
            
            if (error) {
              console.error('Error uploading image:', error);
              throw error;
            }
            
            const { data: publicUrlData } = supabase.storage
              .from(BUCKET_NAME)
              .getPublicUrl(data.path);
            
            return publicUrlData.publicUrl;
          } catch (error) {
            console.error(`Failed to upload image ${index}:`, error);
            alert(`Failed to upload image ${index}. Please try again or skip this image.`);
            return null;
          }
        });
        
        const results = await Promise.all(uploadPromises);
        return results.filter(Boolean);
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (!user) {
          alert('You must be logged in to edit an event.');
          setIsSubmitting(false);
          return;
        }
        
        try {
          const isFree = !eventDetails.price || parseFloat(eventDetails.price) === 0;
          
          const formattedTime = formatTime(eventDetails.time);
          
          const eventData = {
            name: eventDetails.name,
            date: eventDetails.date,
            time: formattedTime,
            location: eventDetails.location,
            latitude: eventDetails.latitude,
            longitude: eventDetails.longitude,
            type: eventDetails.type,
            max_participants: parseInt(eventDetails.maxParticipants),
            price: eventDetails.price ? parseFloat(eventDetails.price) : 0,
            description: eventDetails.description,
            duration: parseInt(eventDetails.duration),
            is_recurring: eventDetails.isRecurring,
            recurring_frequency: eventDetails.isRecurring ? eventDetails.recurringFrequency : null,
            recurring_end_date: eventDetails.isRecurring ? eventDetails.recurringEndDate : null,
            is_free: isFree,
          };
          
          console.log('Updating event data:', eventData);
          
          const { data, error } = await supabase
            .from('events')
            .update(eventData)
            .eq('id', id);
          
          if (error) throw error;
          
          console.log('Event updated successfully:', data);
          
          let imagePaths = [];
          if (eventDetails.images.length > 0) {
            imagePaths = await uploadImages(id);
            
            if (imagePaths.length > 0) {
              const updateData = {
                image_paths: imagePaths,
                image_url: imagePaths[0]
              };
              
              const { error: updateError } = await supabase
                .from('events')
                .update(updateData)
                .eq('id', id);
              
              if (updateError) {
                console.error('Error updating event with image paths:', updateError);
                throw updateError;
              }
            }
          }
          
          alert(`Event updated successfully! ${imagePaths.length} images uploaded.`);
          navigate('/events');
        } catch (error) {
          console.error('Error updating event:', error);
          let errorMessage = 'Failed to update event. ';
          if (error.message) {
            errorMessage += error.message;
          }
          if (error.details) {
            errorMessage += ' Details: ' + error.details;
          }
          alert(errorMessage);
        } finally {
          setIsSubmitting(false);
        }
      };
      if (loadError) return "Error loading maps";
      if (!isLoaded) return "Loading maps";
    
      return (
        <div className="max-w-4xl mx-auto p-4">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={() => navigate('/events')}
              className="flex items-center text-orange-500 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Events
            </button>
            <h1 className="text-2xl font-bold">Edit Event</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded-lg p-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={eventDetails.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
    
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={eventDetails.date}
                    onChange={handleChange}
                    required
                    className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
    
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={formatTime(eventDetails.time)}
                    onClick={() => setShowTimePicker(true)}
                    className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md cursor-pointer"
                  />
                </div>
              </div>
    
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
                <select
                  id="duration"
                  name="duration"
                  value={eventDetails.duration}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                >
                  <option value="">Select duration</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>
            </div>
    
            {showTimePicker && (
              <CustomTimePicker
                initialTime={eventDetails.time}
                onTimeChange={handleTimeChange}
                onClose={() => setShowTimePicker(false)}
              />
            )}
    
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={eventDetails.location}
                  onChange={handleLocationChange}
                  required
                  className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter event location (suburb/city)"
                />
              </div>
            </div>
    
            <div className="mt-4">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={selectedLocation || center}
                zoom={10}
                onLoad={onMapLoad}
              >
                {selectedLocation && <Marker position={selectedLocation} />}
              </GoogleMap>
            </div>
    
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Event Type</label>
              <select
                id="type"
                name="type"
                value={eventDetails.type}
                onChange={handleChange}
                required
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
              >
                <option value="">Select a type</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
    
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">Max Participants</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="maxParticipants"
                    name="maxParticipants"
                    value={eventDetails.maxParticipants}
                    onChange={handleChange}
                    required
                    min="1"
                    className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
    
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (leave empty if free)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={eventDetails.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
    
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={eventDetails.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              ></textarea>
            </div>
    
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRecurring"
                name="isRecurring"
                checked={eventDetails.isRecurring}
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900">
                Is this a recurring event?
              </label>
            </div>
    
            {eventDetails.isRecurring && (
              <>
                <div>
                  <label htmlFor="recurringFrequency" className="block text-sm font-medium text-gray-700">Recurring Frequency</label>
                  <select
                    id="recurringFrequency"
                    name="recurringFrequency"
                    value={eventDetails.recurringFrequency}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select frequency</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="recurringEndDate" className="block text-sm font-medium text-gray-700">End Date for Recurring Event</label>
                  <input
                    type="date"
                    id="recurringEndDate"
                    name="recurringEndDate"
                    value={eventDetails.recurringEndDate}
                    onChange={handleChange}
                    required
                    className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </>
            )}
    
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700">Event Images</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                      <span>Upload images</span>
                      <input id="images" name="images" type="file" className="sr-only" multiple onChange={handleImageUpload} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
    
            {eventDetails.images && eventDetails.images.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {eventDetails.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={typeof image === 'string' ? image : URL.createObjectURL(image)} 
                        alt={`Event image ${index + 1}`} 
                        className="h-24 w-full object-cover rounded-md" 
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
    
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Updating...' : 'Update Event'}
              </button>
            </div>
          </form>
        </div>
      );
    };
    
    export default EditEvent;