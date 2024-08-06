import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowLeft, Search, ChevronDown, ChevronUp, MapPin, Clock, Users, Edit, Trash2 } from 'lucide-react';
import { supabase } from '../utils/supabase';

const MyEvents = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserEvents();
  }, []);

  const fetchUserEvents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');
  
      // Fetch events created by the user
      const { data: createdEvents, error: createdError } = await supabase
        .from('events')
        .select('*')
        .eq('host_id', user.id)
        .order('date', { ascending: true });
  
      if (createdError) throw createdError;
  
      // Fetch events joined by the user
      const { data: joinedEvents, error: joinedError } = await supabase
        .from('event_attendees')
        .select('*, events(*)')
        .eq('user_id', user.id)
        .order('events(date)', { ascending: true });
  
      if (joinedError) throw joinedError;
  
      // Combine and deduplicate events
      const joinedEventsData = joinedEvents.map(je => ({...je.events, joined: true}));
      const allEvents = [...createdEvents, ...joinedEventsData];
      const uniqueEvents = Array.from(new Set(allEvents.map(e => e.id)))
        .map(id => allEvents.find(e => e.id === id));
  
      setEvents(uniqueEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to fetch events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) >= new Date());
  const pastEvents = filteredEvents.filter(event => new Date(event.date) < new Date());

  const toggleEventDetails = (eventId) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  const handleEditEvent = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', eventId);

        if (error) throw error;

        setEvents(events.filter(event => event.id !== eventId));
        alert('Event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const renderEvent = (event) => (
    <div key={event.id} className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 hover:shadow-lg">
      <div 
        className="flex justify-between items-center cursor-pointer" 
        onClick={() => toggleEventDetails(event.id)}
      >
        <div>
          <h3 className="font-semibold text-xl text-gray-800">{event.name}</h3>
          <p className="text-sm text-gray-600 mt-1 flex items-center">
            <Calendar className="inline-block mr-2" size={16} />
            {formatDate(event.date)} at {formatTime(event.time)}
          </p>
          {event.joined && (
            <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
              Joined
            </span>
          )}
        </div>
        {expandedEvent === event.id ? <ChevronUp size={24} className="text-orange-500" /> : <ChevronDown size={24} className="text-orange-500" />}
      </div>
      
      {expandedEvent === event.id && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-600 flex items-center">
            <MapPin size={18} className="mr-2 text-orange-500" />
            {event.location}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <Clock size={18} className="mr-2 text-orange-500" />
            {formatTime(event.time)}, Duration: {event.duration} minutes
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <Users size={18} className="mr-2 text-orange-500" />
            {event.max_participants} max participants
          </p>
          <p className="text-sm text-gray-700 mt-2">{event.description}</p>
          <div className="flex justify-between items-center mt-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/event/${event.id}`);
              }}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              View Details
            </button>
            {!event.joined && (
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditEvent(event.id);
                  }}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEvent(event.id);
                  }}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
        <button onClick={() => navigate('/')} className="text-orange-500 font-medium flex items-center hover:text-orange-600 transition-colors">
          <ArrowLeft size={20} className="mr-1" /> Back to Dashboard
        </button>
      </div>

      <div className="mb-8 relative">
        <input
          type="text"
          placeholder="Search events..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading events...</p>
      ) : (
        <>
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Upcoming Events</h2>
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(renderEvent)
            ) : (
              <p className="text-gray-600 italic">No upcoming events</p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Past Events</h2>
            {pastEvents.length > 0 ? (
              pastEvents.map(renderEvent)
            ) : (
              <p className="text-gray-600 italic">No past events</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyEvents;