import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { supabase } from '../utils/supabase';
import LocationInput from './LocationInput';

const ScheduleWorkout = () => {
  const navigate = useNavigate();
  const { buddyId } = useParams();
  const [user, setUser] = useState(null);
  const [buddy, setBuddy] = useState(null);
  const [workoutDetails, setWorkoutDetails] = useState({
    date: '',
    time: '',
    location: '',
    latitude: null,
    longitude: null,
    workout_type: '',
  });

  useEffect(() => {
    getUser();
    if (buddyId) {
      fetchBuddyDetails();
    }
  }, [buddyId]);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
      } else {
        setUser({ ...user, ...data });
      }
    }
  };

  const fetchBuddyDetails = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', buddyId)
      .single();

    if (error) {
      console.error('Error fetching buddy details:', error);
    } else {
      setBuddy(data);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkoutDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = ({ latitude, longitude, suburb }) => {
    setWorkoutDetails(prev => ({
      ...prev,
      latitude,
      longitude,
      location: suburb
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating workout with details:', workoutDetails);
      console.log('Inviting buddy:', buddyId);

      // Create the workout
      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .insert({
          organizer_id: user.id,
          date: workoutDetails.date,
          time: workoutDetails.time,
          location: workoutDetails.location,
          latitude: workoutDetails.latitude,
          longitude: workoutDetails.longitude,
          workout_type: workoutDetails.workout_type
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      console.log('Created workout:', workout);

      // Add host (current user) as accepted participant
      const { error: hostError } = await supabase
        .from('workout_participants')
        .insert({
          workout_id: workout.id,
          user_id: user.id,
          status: 'accepted'
        });

      if (hostError) throw hostError;

      console.log('Added host as participant');

      // Add the chosen buddy as a pending participant
      const { error: buddyError } = await supabase
        .from('workout_participants')
        .insert({
          workout_id: workout.id,
          user_id: buddyId,
          status: 'pending'
        });

      if (buddyError) {
        throw buddyError;
      }

      console.log(`Successfully invited buddy ${buddyId}`);
      // Create notification for the invited buddy
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: buddyId,
          type: 'workout_invitation',
          message: JSON.stringify({
            workout_id: workout.id,
            host_id: user.id,
            host_name: user.name,
            workout_date: workoutDetails.date,
            workout_time: workoutDetails.time,
            workout_type: workoutDetails.workout_type
          })
        });

      if (notificationError) {
        console.error('Error creating notification:', notificationError);
      }

      console.log('Workout created and invitation sent');
      navigate('/buddies');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  if (!user || !buddy) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/buddies')} className="text-orange-500 flex items-center">
          <ArrowLeft size={20} className="mr-2" />
          Back to Buddies
        </button>
        <h1 className="text-2xl font-bold">Schedule Workout with {buddy.name}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <div className="relative">
              <input
                type="date"
                name="date"
                value={workoutDetails.date}
                onChange={handleChange}
                className="w-full p-2 pr-10 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                required
              />
              <Calendar className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <div className="relative">
              <input
                type="time"
                name="time"
                value={workoutDetails.time}
                onChange={handleChange}
                className="w-full p-2 pr-10 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
                required
              />
              <Clock className="absolute right-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <LocationInput onSelectLocation={handleLocationSelect} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Workout Type</label>
            <select
              name="workout_type"
              value={workoutDetails.workout_type}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500"
              required
            >
              <option value="">Select workout type</option>
              <option value="running">Running</option>
              <option value="cycling">Cycling</option>
              <option value="yoga">Yoga</option>
              <option value="weightlifting">Weightlifting</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
            Schedule Workout
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleWorkout;