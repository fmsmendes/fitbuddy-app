import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Activity, ChevronLeft, ChevronRight } from 'lucide-react';

const BookSession = ({ trainer }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const availableTimes = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'];
  const locations = ['City Gym', 'Park', 'Online'];
  const sessionTypes = ['One-on-One Training', 'Group Class', 'Consultation', 'Specialized Workshop'];

  const handleBookSession = () => {
    console.log('Booking session:', { date: selectedDate, time: selectedTime, location: selectedLocation, type: selectedType });
    alert('Session booked successfully!');
    navigate(-1);
  };

  const renderCalendar = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        days.push(
          <div
            key={day}
            className={`p-2 text-center cursor-pointer hover:bg-orange-100 ${
              day.getMonth() !== currentMonth.getMonth() ? 'text-gray-400' : ''
            } ${
              selectedDate && day.toDateString() === selectedDate.toDateString()
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : ''
            }`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            {day.getDate()}
          </div>
        );
        day.setDate(day.getDate() + 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>
            <ChevronLeft />
          </button>
          <h2 className="text-lg font-semibold">{dateFormat.format(currentMonth)}</h2>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}>
            <ChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold">
              {day}
            </div>
          ))}
        </div>
        {rows}
      </div>
    );
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
              {renderCalendar()}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Session Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sessionTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      selectedType === type ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800'
                    } transition-colors duration-200`}
                  >
                    <Activity size={16} className="mr-2" />
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {availableTimes.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg ${
                      selectedTime === time ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800'
                    } transition-colors duration-200`}
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
                    } transition-colors duration-200`}
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