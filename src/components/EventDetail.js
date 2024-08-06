import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Users, DollarSign, User } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [host, setHost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullAddress, setFullAddress] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAttending, setIsAttending] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    fetchEventDetails();
    fetchCurrentUser();
  }, [id]);
  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (eventError) throw eventError;

      setEvent(eventData);
      fetchHost(eventData.host_id);
      fetchAttendees(eventData.id);
      fetchFullAddress(eventData.latitude, eventData.longitude);
    } catch (error) {
      console.error('Error fetching event details:', error);
      alert('Failed to fetch event details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHost = async (hostId) => {
    try {
      const { data: hostData, error: hostError } = await supabase
        .from('user_profiles')
        .select('id, name, image_url')
        .eq('id', hostId)
        .single();

      if (hostError) throw hostError;

      setHost(hostData);
    } catch (error) {
      console.error('Error fetching host data:', error);
    }
  };

  const fetchAttendees = async (eventId) => {
    try {
      const { data, error } = await supabase
        .from('event_attendees')
        .select('user_id')
        .eq('event_id', eventId);

      if (error) throw error;

      setAttendees(data);
    } catch (error) {
      console.error('Error fetching attendees:', error);
    }
  };

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    if (user) {
      checkAttendance(user.id);
    }
  };

  const checkAttendance = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('event_attendees')
        .select('*')
        .eq('event_id', id)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      setIsAttending(!!data);
    } catch (error) {
      console.error('Error checking attendance:', error);
    }
  };

  const fetchFullAddress = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        setFullAddress(data.results[0].formatted_address);
      }
    } catch (error) {
      console.error('Error fetching full address:', error);
    }
  };
  const handleAttendance = async () => {
    if (!currentUser) {
      alert('Please log in to join events.');
      return;
    }

    try {
      // First, fetch the user's profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', currentUser.id)  // Use 'id' instead of 'user_id'
        .single();

      if (profileError) throw profileError;

      if (!profileData) {
        alert('User profile not found. Please complete your profile before joining events.');
        return;
      }

      if (isAttending) {
        const { error } = await supabase
          .from('event_attendees')
          .delete()
          .eq('event_id', id)
          .eq('user_id', currentUser.id);

        if (error) throw error;
        setIsAttending(false);
      } else {
        const { error } = await supabase
          .from('event_attendees')
          .insert({ 
            event_id: id, 
            user_id: currentUser.id,
            profile_id: profileData.id
          });

        if (error) throw error;
        setIsAttending(true);
      }
      fetchAttendees(id);
    } catch (error) {
      console.error('Error updating attendance:', error);
      alert('Failed to update attendance. Please try again.');
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const date = new Date(2000, 0, 1, hours, minutes);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getHostImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return supabase.storage
      .from('profile_images')
      .getPublicUrl(imagePath)
      .data.publicUrl;
  };
  if (loading) {
    return <div className="max-w-2xl mx-auto p-4">Loading event details...</div>;
  }

  if (!event) {
    return <div className="max-w-2xl mx-auto p-4">Event not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={() => navigate(-1)} className="mb-4 text-orange-500 font-medium">
        &larr; Back to Events
      </button>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {event.image_url && (
          <img src={event.image_url} alt={event.name} className="w-full h-64 object-cover" />
        )}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <Calendar size={20} className="mr-2" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
            <Clock size={20} className="ml-4 mr-2" />
            <span>{formatTime(event.time)}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin size={20} className="mr-2" />
            <span>{fullAddress}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <Users size={20} className="mr-2" />
            <span>{attendees.length} / {event.max_participants} participants</span>
          </div>
          <div className="flex items-center text-gray-600 mb-6">
            <DollarSign size={20} className="mr-2" />
            <span>{event.is_free ? 'Free' : `$${event.price}`}</span>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Event Type</h2>
            <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
              {event.type}
            </span>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{event.description}</p>
          </div>
          {event.is_recurring && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Recurring Event</h2>
              <p className="text-gray-700">This event repeats {event.recurring_frequency}.</p>
              {event.recurring_end_date && (
                <p className="text-gray-700">Ends on: {new Date(event.recurring_end_date).toLocaleDateString()}</p>
              )}
            </div>
          )}
          {host && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Host</h2>
              <div className="flex items-center">
                {host.image_url ? (
                  <img 
                    src={getHostImageUrl(host.image_url)}
                    alt={host.name} 
                    className="w-12 h-12 rounded-full mr-4 object-cover" 
                    onError={(e) => {
                      console.error('Error loading host image:', e);
                      e.target.onerror = null; 
                      e.target.src = 'https://via.placeholder.com/48';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <User size={24} className="text-gray-500" />
                  </div>
                )}
                <span className="text-lg font-medium">{host.name}</span>
              </div>
            </div>
          )}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Location</h2>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '300px' }}
                center={{ lat: event.latitude, lng: event.longitude }}
                zoom={15}
              >
                <Marker position={{ lat: event.latitude, lng: event.longitude }} />
              </GoogleMap>
            ) : (
              <div>Loading map...</div>
            )}
          </div>
          <button 
            onClick={handleAttendance}
            className={`w-full py-3 rounded-lg transition-colors text-lg font-medium ${
              isAttending
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            {isAttending ? 'Cancel Attendance' : 'Join Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;