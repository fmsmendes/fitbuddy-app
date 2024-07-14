import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Clock, MapPin, Users } from 'lucide-react';

const AllEventsPage = ({ events }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Events</h1>
        <button onClick={() => navigate('/')} className="text-orange-500 font-medium">
          Back to Dashboard
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            className="w-full p-2 pl-10 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={event.image} alt={event.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Calendar size={14} className="mr-1" /> {event.date}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Clock size={14} className="mr-1" /> {event.time}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin size={14} className="mr-1" /> {event.location}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <Users size={14} className="mr-1" /> {event.participants} participants
              </div>
              <div className="mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.isFree ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {event.isFree ? 'Free' : `$${event.price}`}
                </span>
              </div>
              <button 
                onClick={() => navigate(`/event/${event.id}`)}
                className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllEventsPage;
