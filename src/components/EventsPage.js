import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar as CalendarIcon, Filter, MapPin, Clock, Users, Search, Plus } from 'lucide-react';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const EventsPage = ({ events }) => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    isFree: null,
  });
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filtered = events.filter(event => {
      if (!event) return false;

      const eventDate = new Date(event.date);
      const dateMatch = date ? eventDate.toDateString() === date.toDateString() : true;
      const typeMatch = !filters.type || event.type === filters.type;
      const freeMatch = filters.isFree === null || event.isFree === filters.isFree;
      const searchMatch = event.name.toLowerCase().includes(searchTerm.toLowerCase());

      return dateMatch && typeMatch && freeMatch && searchMatch;
    });

    setFilteredEvents(filtered);
  }, [date, filters, events, searchTerm]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const eventTypes = [...new Set(events.filter(event => event && event.type).map(event => event.type))];

  const eventDates = events.map(event => new Date(event.date));

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <button onClick={() => navigate(-1)} className="text-orange-500 font-medium">
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="relative w-full md:w-auto mb-4 md:mb-0">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <CalendarIcon size={20} className="mr-2" />
              {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </button>
            {showCalendar && (
              <div className="absolute top-full left-0 mt-2 z-10">
                <Calendar
                  date={date}
                  onChange={item => {
                    setDate(item);
                    setShowCalendar(false);
                  }}
                  minDate={new Date()}
                  dateDisplayFormat="yyyy-MM-dd"
                  dayContentRenderer={(date) => {
                    const hasEvent = eventDates.some(eventDate => 
                      eventDate.toDateString() === date.toDateString()
                    );
                    return (
                      <div className={`w-full h-full flex items-center justify-center ${hasEvent ? 'bg-orange-200' : ''}`}>
                        {date.getDate()}
                      </div>
                    );
                  }}
                />
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search events..."
                className="w-full p-2 pl-10 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Filter size={20} className="mr-2" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-4 p-4 bg-gray-100 rounded-lg">
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="p-2 border rounded-lg"
              >
                <option value="">All Types</option>
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                value={filters.isFree === null ? '' : filters.isFree.toString()}
                onChange={(e) => handleFilterChange('isFree', e.target.value === '' ? null : e.target.value === 'true')}
                className="p-2 border rounded-lg"
              >
                <option value="">All Events</option>
                <option value="true">Free Events</option>
                <option value="false">Paid Events</option>
              </select>
            </div>
          </div>
        )}

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Events</h2>
            <Link to="/create-event" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center">
              <Plus size={20} className="mr-2" />
              Create Event
            </Link>
          </div>
          {filteredEvents.length === 0 ? (
            <p className="text-gray-500">No events found for this date.</p>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map(event => (
                <div key={event.id} className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <img src={event.image} alt={event.name} className="w-24 h-24 object-cover rounded-lg mr-4" />
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold">{event.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <CalendarIcon size={14} className="mr-1" /> {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Clock size={14} className="mr-1" /> {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <MapPin size={14} className="mr-1" /> {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Users size={14} className="mr-1" /> {event.participants} participants
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.isFree ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {event.isFree ? 'Free' : `$${event.price}`}
                      </span>
                      <button 
                        onClick={() => navigate(`/event/${event.id}`)}
                        className="mt-2 px-4 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
