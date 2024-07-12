import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft } from 'lucide-react';

const MyEvents = ({ events }) => {
  const navigate = useNavigate();

  const renderEvent = (event) => (
    <div key={event.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
      <p className="text-sm text-gray-600 mb-2">
        <Calendar className="inline-block mr-2" size={16} />
        {event.date} at {event.time}
      </p>
      <p className="text-sm text-gray-600">{event.location}</p>
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

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
        {events.filter(event => new Date(event.date) >= new Date()).map(renderEvent)}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Past Events</h2>
        {events.filter(event => new Date(event.date) < new Date()).map(renderEvent)}
      </div>
    </div>
  );
};

export default MyEvents;