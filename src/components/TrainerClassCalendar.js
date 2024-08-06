import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { supabase } from '../utils/supabase';
import { MapPin, Clock, Users, DollarSign, X, Calendar as CalendarIcon } from 'lucide-react';

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

const TrainerClassCalendar = ({ trainerId, userBookings, onBookingChange, onClassSelect }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, [trainerId]);

  const fetchClasses = async () => {
    const { data, error } = await supabase
      .from('trainer_classes')
      .select('*')
      .eq('trainer_id', trainerId);

    if (error) {
      console.error('Error fetching classes:', error);
    } else {
      setClasses(data.map(cls => ({
        ...cls,
        start: new Date(cls.date + 'T' + cls.start_time),
        end: new Date(cls.date + 'T' + cls.end_time),
        title: cls.name,
      })));
    }
  };

  const handleSelectEvent = (event) => {
    setSelectedClass(event);
    onClassSelect(true);
  };

  const handleBooking = async () => {
    if (userBookings.includes(selectedClass.id)) {
      if (window.confirm('Do you want to cancel your attendance for this class?')) {
        const { error } = await supabase
          .from('class_attendees')
          .delete()
          .eq('class_id', selectedClass.id)
          .eq('user_id', (await supabase.auth.getUser()).data.user.id);

        if (error) {
          console.error('Error cancelling attendance:', error);
        } else {
          onBookingChange();
          alert('Your attendance has been cancelled.');
          setSelectedClass(null);
          onClassSelect(false);
        }
      }
    } else {
      if (window.confirm('Do you want to book this class?')) {
        const { error } = await supabase
          .from('class_attendees')
          .insert({
            class_id: selectedClass.id,
            user_id: (await supabase.auth.getUser()).data.user.id,
            checked_in: false
          });

        if (error) {
          console.error('Error booking class:', error);
        } else {
          onBookingChange();
          alert('You have successfully booked this class.');
          setSelectedClass(null);
          onClassSelect(false);
        }
      }
    }
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const isBooked = userBookings.includes(event.id);
    return {
      style: {
        backgroundColor: isBooked ? '#4CAF50' : '#3174ad',
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        display: 'block'
      }
    };
  };

  return (
    <div className="relative">
      <div style={{ height: '500px' }}>
        <Calendar
          localizer={localizer}
          events={classes}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          formats={{
            eventTimeRangeFormat: ({ start, end }) =>
              `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`,
            dayFormat: (date, culture, localizer) =>
              localizer.format(date, 'EEEE, MMMM d, yyyy', culture),
          }}
        />
      </div>
      {selectedClass && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{selectedClass.name}</h2>
              <button onClick={() => { setSelectedClass(null); onClassSelect(false); }} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 text-gray-500" size={20} />
                <span>{format(selectedClass.start, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 text-gray-500" size={20} />
                <span>{format(selectedClass.start, 'h:mm a')} - {format(selectedClass.end, 'h:mm a')}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 text-gray-500" size={20} />
                <span>{selectedClass.location}</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 text-gray-500" size={20} />
                <span>{selectedClass.max_participants} max participants</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 text-gray-500" size={20} />
                <span>${selectedClass.price}</span>
              </div>
              <p className="text-gray-600">{selectedClass.description}</p>
            </div>
            <button
              onClick={handleBooking}
              className={`mt-6 w-full py-2 px-4 rounded-lg text-white font-semibold ${
                userBookings.includes(selectedClass.id)
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {userBookings.includes(selectedClass.id) ? 'Cancel Attendance' : 'Book Class'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerClassCalendar;