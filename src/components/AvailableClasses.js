// AvailableClasses.js
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, DollarSign } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { format } from 'date-fns';

const AvailableClasses = ({ trainerId }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, [trainerId]);

  const fetchClasses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trainer_classes')
      .select('*')
      .eq('trainer_id', trainerId)
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching classes:', error);
    } else {
      setClasses(data);
    }
    setLoading(false);
  };

  const handleBookClass = async (classId) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Please log in to book a class.');
      return;
    }

    const { data: existingRegistration, error: existingRegistrationError } = await supabase
      .from('class_attendees')
      .select('*')
      .eq('class_id', classId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingRegistrationError) {
      console.error('Error checking for existing registration:', existingRegistrationError);
      alert('Error booking class. Please try again.');
      return;
    }

    if (existingRegistration) {
      alert('You are already registered for this class.');
      return;
    }

    const { error: registrationError } = await supabase
      .from('class_attendees')
      .insert({
        class_id: classId,
        user_id: user.id,
        checked_in: false, 
      });

    if (registrationError) {
      console.error('Error registering for class:', registrationError);
      alert('Error booking class. Please try again.');
      return;
    }

    alert('Class booked successfully!');
  };

  if (loading) {
    return <div>Loading classes...</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Available Classes</h2>
      {classes.length === 0 ? (
        <p>No upcoming classes available.</p>
      ) : (
        <div className="space-y-4">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{cls.name}</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-500" />
                  <span>{format(new Date(cls.date), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2 text-gray-500" />
                  <span>{cls.start_time} - {cls.end_time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2 text-gray-500" />
                  <span>{cls.location}</span>
                </div>
                <div className="flex items-center">
                  <Users size={16} className="mr-2 text-gray-500" />
                  <span>Max {cls.max_participants} participants</span>
                </div>
                <div className="flex items-center">
                  <DollarSign size={16} className="mr-2 text-gray-500" />
                  <span>${cls.price}</span>
                </div>
              </div>
              <p className="mt-2 text-gray-600">{cls.description}</p>
              <button
                onClick={() => handleBookClass(cls.id)}
                className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Book Class
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableClasses;