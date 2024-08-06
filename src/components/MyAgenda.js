import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { ChevronLeft, ChevronRight, Filter, List, Grid } from 'lucide-react';
import { supabase } from '../utils/supabase';

const localizer = momentLocalizer(moment);

const MyAgenda = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      try {
        console.log('Current user:', user);

        // Fetch workouts organized by the user
        const { data: organizedWorkouts, error: organizedWorkoutsError } = await supabase
          .from('workouts')
          .select('*')
          .eq('organizer_id', user.id);

        if (organizedWorkoutsError) throw organizedWorkoutsError;

        // Fetch workouts where the user is a participant
        const { data: participatedWorkouts, error: participatedWorkoutsError } = await supabase
          .from('workout_participants')
          .select('workout_id, workouts(*)')
          .eq('user_id', user.id);

        if (participatedWorkoutsError) throw participatedWorkoutsError;

        // Fetch all events
        const { data: allEvents, error: allEventsError } = await supabase
          .from('events')
          .select('*');

        if (allEventsError) throw allEventsError;

        // Fetch events where the user is an attendee
        const { data: attendedEvents, error: attendedEventsError } = await supabase
          .from('event_attendees')
          .select('event_id')
          .eq('user_id', user.id);

        if (attendedEventsError) throw attendedEventsError;

        const attendedEventIds = attendedEvents.map(ae => ae.event_id);

        // Ensure unique workouts
        const workoutSet = new Set([
          ...organizedWorkouts, 
          ...participatedWorkouts.map(pw => pw.workouts).filter(Boolean)
        ]);
        const allWorkouts = Array.from(workoutSet);

        const userEvents = allEvents.filter(event => attendedEventIds.includes(event.id));

        const formattedEvents = [
          ...allWorkouts.map(w => ({
            id: `workout-${w.id}`,
            title: `Workout: ${w.workout_type}`,
            start: new Date(`${w.date}T${w.time}`),
            end: new Date(new Date(`${w.date}T${w.time}`).getTime() + 60*60*1000), // Assume 1 hour duration
            type: 'workout'
          })),
          ...userEvents.map(e => ({
            id: `event-${e.id}`,
            title: `Event: ${e.name}`,
            start: new Date(`${e.date}T${e.time}`),
            end: new Date(new Date(`${e.date}T${e.time}`).getTime() + 60*60*1000), // Assume 1 hour duration
            type: 'event'
          }))
        ];
        
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  };

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: '#F97316', // Default orange color
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };

    switch(event.type) {
      case 'workout':
        style.backgroundColor = '#22C55E'; // Green
        break;
      case 'event':
        style.backgroundColor = '#3B82F6'; // Blue
        break;
      default:
        break;
    }

    return {
      style: style
    };
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Agenda</h1>
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-orange-500 hover:text-orange-600 transition-colors duration-200"
        >
          Back to Dashboard
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <button onClick={() => setView('month')} className={`px-3 py-1 rounded ${view === 'month' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>Month</button>
            <button onClick={() => setView('week')} className={`px-3 py-1 rounded ${view === 'week' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>Week</button>
            <button onClick={() => setView('day')} className={`px-3 py-1 rounded ${view === 'day' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>Day</button>
            <button onClick={() => setView('agenda')} className={`px-3 py-1 rounded ${view === 'agenda' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}>Agenda</button>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center px-3 py-1 bg-gray-200 rounded">
              <Filter size={16} className="mr-1" />
              Filters
            </button>
            <button onClick={() => setDate(new Date())} className="px-3 py-1 bg-gray-200 rounded">Today</button>
            <button onClick={() => setDate(moment(date).subtract(1, view).toDate())} className="p-1 bg-gray-200 rounded"><ChevronLeft size={16} /></button>
            <button onClick={() => setDate(moment(date).add(1, view).toDate())} className="p-1 bg-gray-200 rounded"><ChevronRight size={16} /></button>
          </div>
        </div>
        
        {showFilters && (
          <div className="mb-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Filter by Type:</h3>
            <div className="flex space-x-2">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox text-orange-500" />
                <span className="ml-2">Workouts</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox text-orange-500" />
                <span className="ml-2">Events</span>
              </label>
            </div>
          </div>
        )}
        
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          view={view}
          date={date}
          onView={setView}
          onNavigate={setDate}
          eventPropGetter={eventStyleGetter}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        <div className="space-y-4">
          {events
            .filter(event => new Date(event.start) > new Date())
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, 5)
            .map(event => (
              <div key={event.id} className="flex items-center p-3 bg-gray-100 rounded-lg">
                <div className={`w-2 h-12 rounded-full mr-4 ${
                  event.type === 'workout' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-600">{moment(event.start).format('MMM D, YYYY h:mm A')}</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default MyAgenda;