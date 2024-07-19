import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Users, DollarSign } from 'lucide-react';

const EventDetail = ({ events }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === parseInt(id));

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button onClick={() => navigate(-1)} className="mb-4 text-orange-500 font-medium">
        &larr; Back to Dashboard
      </button>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img src={event.image} alt={event.name} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <Calendar size={20} className="mr-2" />
            <span>{event.date}</span>
            <Clock size={20} className="ml-4 mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin size={20} className="mr-2" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <Users size={20} className="mr-2" />
            <span>{event.participants} participants</span>
          </div>
          <div className="flex items-center text-gray-600 mb-6">
            <DollarSign size={20} className="mr-2" />
            <span>{event.isFree ? 'Free' : `$${event.price}`}</span>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Event Type</h2>
            <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
              {event.type}
            </span>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Host</h2>
            <div className="flex items-center">
              <img src={event.host.image} alt={event.host.name} className="w-12 h-12 rounded-full mr-4" />
              <span className="text-lg font-medium">{event.host.name}</span>
            </div>
          </div>
          <button 
            onClick={() => alert(`You've joined the event: ${event.name}!`)}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors text-lg font-medium"
          >
            Join Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;