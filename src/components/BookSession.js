import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Activity } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const BookSession = ({ trainer }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const availableTimes = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'];
  const locations = ['City Gym', 'Park', 'Online'];
  const sessionTypes = ['One-on-One Training', 'Group Class', 'Consultation', 'Specialized Workshop'];

  const handleBookSession = () => {
    console.log('Booking session:', { date: selectedDate, time: selectedTime, location: selectedLocation, type: selectedType });
    alert('Session booked successfully!');
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Book a Session</h1>
            <button onClick={() => navigate(-1)} className="text-orange-500 font-medium">
              Back to Trainer Profile
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                minDate={new Date()}
                className="w-full p-2 border rounded-lg"
                dateFormat="MMMM d, yyyy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Session Type</label>
              <div className="flex flex-wrap gap-2">
                {sessionTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      selectedType === type ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <Activity size={16} className="mr-2" />
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
              <div className="flex flex-wrap gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      selectedTime === time ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <Clock size={16} className="mr-2" />
                    {time}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Location</label>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <button
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      selectedLocation === location ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <MapPin size={16} className="mr-2" />
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button
              onClick={handleBookSession}
              disabled={!selectedDate || !selectedTime || !selectedLocation || !selectedType}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Book Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSession;
