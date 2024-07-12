import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Search, ChevronDown, ChevronUp, MapPin, Clock, Users } from 'lucide-react';

const MyEvents = ({ events }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEvent, setExpandedEvent] = useState(null);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) >= new Date());
  const pastEvents = filteredEvents.filter(event => new Date(event.date) < new Date());

  const toggleEventDetails = (eventId) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  const renderEvent = (event) => (
    <div key={event.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => toggleEventDetails(event.id)}
      >
        <div>
          <h3 className="font-semibold text-lg">{event.name}</h3>
          <p className="text-sm text-gray-600">
            <Calendar className="inline-block mr-2" size={16} />
            {event.date} at {event.time}
          </p>
        </div>
        {expandedEvent === event.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>
      
      {expandedEvent === event.id && (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-600 flex items-center">
            <MapPin size={16} className="mr-2" />
            {event.location}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <Clock size={16} className="mr-2" />
            {event.time}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <Users size={16} className="mr-2" />
            {event.participants} participants
          </p>
          <p className="text-sm text-gray-700">{event.description}</p>
          <button 
            onClick={() => navigate(`/event/${event.id}`)}
            className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            View Details
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Events</h1>
        <button onClick={() => navigate('/')} className="text-orange-500 font-medium flex items-center">
          <ArrowLeft size={20} className="mr-1" /> Back to Dashboard
        </button>
      </div>

      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search events..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        {upcomingEvents.map(renderEvent)}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Past Events</h2>
        {pastEvents.map(renderEvent)}
      </div>
    </div>
  );
};

export default MyEvents;
