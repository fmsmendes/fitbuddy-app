import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Users, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import TrainerNavigation from './TrainerNavigation';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const TrainerClasses = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([
    { id: 1, title: 'HIIT Workout', start: new Date(2024, 6, 15, 10, 0), end: new Date(2024, 6, 15, 11, 0), participants: 12, maxParticipants: 15 },
    { id: 2, title: 'Yoga for Beginners', start: new Date(2024, 6, 16, 14, 0), end: new Date(2024, 6, 16, 15, 0), participants: 8, maxParticipants: 20 },
    { id: 3, title: 'Strength Training', start: new Date(2024, 6, 17, 11, 0), end: new Date(2024, 6, 17, 12, 0), participants: 10, maxParticipants: 10 },
  ]);
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());

  const handleCreateClass = () => {
    navigate('/create-class');
  };

  const handleSelectEvent = useCallback((event) => {
    alert(`Selected class: ${event.title}`);
  }, []);

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const formatDate = (date, viewType) => {
    try {
      if (viewType === 'week') {
        return `${format(date, 'MMMM yyyy')}, Week ${format(date, 'w')}`;
      }
      return format(date, 'MMMM yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 pb-16">
      <h1 className="text-2xl font-semibold mb-6">Your Classes</h1>
      
      <div className="mb-6 flex justify-between items-center">
        <div>
          <button
            className={`mr-2 px-4 py-2 rounded-lg ${view === 'week' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('week')}
          >
            Week
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${view === 'month' ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setView('month')}
          >
            Month
          </button>
        </div>
        <button 
          onClick={handleCreateClass}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-600 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Create New Class
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => handleNavigate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}>
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-semibold">
            {formatDate(date, view)}
          </h2>
          <button onClick={() => handleNavigate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}>
            <ChevronRight size={24} />
          </button>
        </div>
        <BigCalendar
          localizer={localizer}
          events={classes}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          view={view}
          onView={setView}
          onSelectEvent={handleSelectEvent}
          onNavigate={handleNavigate}
          date={date}
        />
      </div>

      <div className="grid gap-4">
        {classes.map((cls) => (
          <div key={cls.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{cls.title}</h2>
            <div className="flex items-center text-gray-600 mb-2">
              <CalendarIcon size={16} className="mr-2" />
              {format(cls.start, 'yyyy-MM-dd')}
            </div>
            <div className="flex items-center text-gray-600 mb-2">
              <Clock size={16} className="mr-2" />
              {format(cls.start, 'HH:mm')}
            </div>
            <div className="flex items-center text-gray-600">
              <Users size={16} className="mr-2" />
              {cls.participants}/{cls.maxParticipants} participants
            </div>
          </div>
        ))}
      </div>

      <TrainerNavigation activeTab="classes" />
    </div>
  );
};

export default TrainerClasses;
