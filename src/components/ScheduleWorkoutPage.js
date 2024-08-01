import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const ScheduleWorkoutPage = () => {
  const { buddyId } = useParams();
  const navigate = useNavigate();
  const [workoutDetails, setWorkoutDetails] = useState({
    workout_type: '',
    date: '',
    time: '',
    location: '',
    // Add other necessary fields
  });

  const handleCreateWorkoutRequest = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      // Create a new workout
      const { data: workout, error: workoutError } = await supabase
        .from('workouts')
        .insert([
          { 
            organizer_id: user.id,
            ...workoutDetails
          }
        ])
        .single();

      if (workoutError) throw workoutError;

      // Create workout participants entries
      const { error: participantsError } = await supabase
        .from('workout_participants')
        .insert([
          { workout_id: workout.id, user_id: user.id, status: 'accepted' },
          { workout_id: workout.id, user_id: buddyId, status: 'pending' }
        ]);

      if (participantsError) throw participantsError;

      // Navigate back to BuddiesPage or show a success message
      navigate('/buddies', { state: { message: 'Workout request created successfully!' } });
    } catch (error) {
      console.error('Error creating workout request:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWorkoutDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Schedule Workout with Buddy</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleCreateWorkoutRequest(); }}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="workout_type">
            Workout Type
          </label>
          <input
            type="text"
            id="workout_type"
            name="workout_type"
            value={workoutDetails.workout_type}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {/* Add more form fields for date, time, location, etc. */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Workout Request
        </button>
      </form>
    </div>
  );
};

export default ScheduleWorkoutPage;
