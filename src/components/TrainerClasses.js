import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Users, Plus, ChevronLeft, ChevronRight, ArrowLeft, MapPin, DollarSign } from 'lucide-react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import TrainerNavigation from './TrainerNavigation';
import { supabase } from '../utils/supabase';

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
  const [classes, setClasses] = useState([]);
  const [view, setView] = useState('week');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      if (!user) {
        console.error('No user logged in');
        return;
      }

      const { data, error } = await supabase
        .from('trainer_classes')
        .select('*')
        .eq('trainer_id', user.id);

      if (error) throw error;

      setClasses(data.map(cls => ({
        ...cls,
        title: cls.name,
        start: new Date(`${cls.date}T${cls.start_time}`),
        end: new Date(`${cls.date}T${cls.end_time}`),
      })));
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };
  const handleCreateClass = () => {
    navigate('/create-class');
  };

  const handleAttendance = (classId) => {
    navigate(`/class-attendance/${classId}`);
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
          <div key={cls.id} className="bg-white p-6 rounded-lg shadow-md mb-4">
            <h2 className="text-2xl font-semibold mb-3">{cls.name}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600 mb-2">
                <CalendarIcon size={18} className="mr-2 text-orange-500" />
                {format(cls.start, 'MMMM d, yyyy')}
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <Clock size={18} className="mr-2 text-orange-500" />
                {format(cls.start, 'h:mm a')} - {format(cls.end, 'h:mm a')}
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={18} className="mr-2 text-orange-500" />
                {cls.location || 'Location TBA'}
              </div>
              <div className="flex items-center text-gray-600 mb-2">
                <Users size={18} className="mr-2 text-orange-500" />
                {cls.max_participants} max participants
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign size={18} className="mr-2 text-orange-500" />
                ${cls.price}
              </div>
            </div>
            <p className="mt-3 text-gray-700">{cls.description || 'No description available.'}</p>
            <button 
            onClick={() => handleAttendance(cls.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mt-4"
          >
            Manage Attendance
          </button>
          </div>
        ))}
      </div>

      <TrainerNavigation activeTab="classes" />
    </div>
  );
};

export default TrainerClasses;