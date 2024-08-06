import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Check, X } from 'lucide-react';
import { supabase } from '../utils/supabase';

const SharedWorkoutsAndInvitations = ({ buddy, currentUser, onAcceptInvitation, onDeclineInvitation }) => {
  const [activeTab, setActiveTab] = useState('shared');
  const [sharedWorkouts, setSharedWorkouts] = useState([]);
  const [workoutInvitations, setWorkoutInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, [buddy, currentUser]);

  const fetchWorkouts = async () => {
    if (!buddy || !currentUser) return;
  
    setIsLoading(true);
  
    try {
      console.log('Fetching workouts for currentUser:', currentUser.id, 'and buddy:', buddy.id);
  
      // Fetch shared workouts
      const { data: sharedData, error: sharedError } = await supabase
        .from('workout_participants')
        .select(`
          *,
          workout:workouts(*)
        `)
        .in('user_id', [currentUser.id, buddy.id])
        .eq('status', 'accepted');
  
      if (sharedError) throw sharedError;
  
      // Fetch user profiles for participants
      const participantIds = [...new Set(sharedData.map(p => p.user_id))];
      const { data: userProfiles, error: userProfilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .in('id', participantIds);
  
      if (userProfilesError) throw userProfilesError;
  
      // Create a map of user profiles
      const userProfileMap = Object.fromEntries(userProfiles.map(profile => [profile.id, profile]));
  
      // Group participants by workout and add user profile information
      const groupedWorkouts = sharedData.reduce((acc, participant) => {
        const workoutId = participant.workout_id;
        if (!acc[workoutId]) {
          acc[workoutId] = { ...participant.workout, participants: [] };
        }
        acc[workoutId].participants.push({
          ...participant,
          user: userProfileMap[participant.user_id]
        });
        return acc;
      }, {});
  
      console.log('Shared workouts:', Object.values(groupedWorkouts));
      setSharedWorkouts(Object.values(groupedWorkouts));
  
      // Fetch invitations
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('workout_participants')
        .select(`
          *,
          workout:workouts(*)
        `)
        .eq('user_id', currentUser.id)
        .eq('status', 'pending');
  
      if (invitationsError) throw invitationsError;
  
      // Add user profile information to invitations
      const invitationsWithProfiles = invitationsData.map(invitation => ({
        ...invitation,
        user: userProfileMap[invitation.user_id]
      }));
  
      console.log('Workout invitations:', invitationsWithProfiles);
      setWorkoutInvitations(invitationsWithProfiles);
  
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const renderWorkout = (workout) => (
    <div key={workout.id} className="bg-blue-100 rounded-lg p-3 mb-2">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{capitalizeFirstLetter(workout.workout_type) || 'Unknown Type'}</span>
        <span className="text-sm text-gray-600">{workout.date || 'Date not set'}</span>
      </div>
      <div className="flex items-center text-sm text-gray-700 mb-1">
        <Clock size={14} className="mr-1" /> {workout.time || 'Time not set'}
      </div>
      <div className="flex items-center text-sm text-gray-700 mb-1">
        <MapPin size={14} className="mr-1" /> {workout.location || 'Location not set'}
      </div>
      <div className="flex items-center mt-2">
        <span className="text-sm text-gray-700 mr-2">Participants:</span>
        {workout.participants.map((participant) => (
          <div key={participant.id} className="relative mr-2 group">
            <img
              src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/profile_images/${participant.user?.image_url}`}
              alt={participant.user?.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {participant.user?.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvitation = (invitation) => (
    <div key={invitation.id} className="bg-yellow-100 rounded-lg p-3 mb-2">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold">{capitalizeFirstLetter(invitation.workout.workout_type) || 'Unknown Type'}</span>
        <span className="text-sm text-gray-600">{invitation.workout.date || 'Date not set'}</span>
      </div>
      <div className="flex items-center text-sm text-gray-700 mb-1">
        <Clock size={14} className="mr-1" /> {invitation.workout.time || 'Time not set'}
      </div>
      <div className="flex items-center text-sm text-gray-700 mb-1">
        <MapPin size={14} className="mr-1" /> {invitation.workout.location || 'Location not set'}
      </div>
      <div className="flex justify-end space-x-2 mt-2">
        <button 
          className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center text-sm"
          onClick={() => onAcceptInvitation(invitation.id)}
        >
          <Check size={14} className="mr-1" /> Accept
        </button>
        <button 
          className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center text-sm"
          onClick={() => onDeclineInvitation(invitation.id)}
        >
          <X size={14} className="mr-1" /> Decline
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return <div className="mt-4 text-center">Loading workouts and invitations...</div>;
  }

  return (
    <div className="mt-4">
      <div className="flex mb-4">
        <button
          className={`flex-1 py-2 px-4 text-center ${activeTab === 'shared' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l-lg`}
          onClick={() => setActiveTab('shared')}
        >
          Shared Workouts
        </button>
        <button
          className={`flex-1 py-2 px-4 text-center ${activeTab === 'invitations' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r-lg`}
          onClick={() => setActiveTab('invitations')}
        >
          Invitations
        </button>
      </div>

      {activeTab === 'shared' && (
        <div>
          <h3 className="font-semibold mb-2">Shared Workouts History</h3>
          {sharedWorkouts.length > 0 ? (
            sharedWorkouts.map(renderWorkout)
          ) : (
            <p className="text-gray-600">No shared workouts yet.</p>
          )}
        </div>
      )}

      {activeTab === 'invitations' && (
        <div>
          <h3 className="font-semibold mb-2">Workout Invitations</h3>
          {workoutInvitations.length > 0 ? (
            workoutInvitations.map(renderInvitation)
          ) : (
            <p className="text-gray-600">No pending invitations.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SharedWorkoutsAndInvitations;