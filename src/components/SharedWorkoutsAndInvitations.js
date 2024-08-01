import React, { useState, useEffect } from 'react';
import { Activity, Calendar, Clock, MapPin, Users, Check, X } from 'lucide-react';

const SharedWorkoutsAndInvitations = ({ buddy, currentUser, onAcceptInvitation, onDeclineInvitation, allUsers }) => {
  const [activeTab, setActiveTab] = useState('shared');

  useEffect(() => {
    console.log('SharedWorkoutsAndInvitations props:', { 
      buddy, 
      currentUser, 
      allUsers: allUsers ? `${allUsers.length} users` : 'undefined'
    });
  }, [buddy, currentUser, allUsers]);

  const renderWorkout = (workout) => {
    if (!workout || !workout.workout) {
      console.error('Workout data is missing');
      return null;
    }

    const workoutData = workout.workout;
    const participants = workoutData.participants || [];

    return (
      <div key={workoutData.id} className="bg-blue-100 rounded-lg p-3 mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">{workoutData.workout_type || 'Unknown Type'}</span>
          <span className="text-sm text-gray-600">{workoutData.date || 'Date not set'}</span>
        </div>
        <div className="flex items-center text-sm text-gray-700 mb-1">
          <Clock size={14} className="mr-1" /> {workoutData.time || 'Time not set'}
        </div>
        <div className="flex items-center text-sm text-gray-700 mb-1">
          <MapPin size={14} className="mr-1" /> {workoutData.location || 'Location not set'}
        </div>
        <div className="flex items-center text-sm text-gray-700 mb-1">
          <Users size={14} className="mr-1" /> {participants.length} participants
        </div>
        <div className="text-sm text-gray-700 mt-2">
          <strong>Participants:</strong>
          <div className="flex flex-wrap mt-1">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center mr-2 mb-2">
                <img 
                  src={getImageUrl(participant.image_url)} 
                  alt={participant.name} 
                  className="w-8 h-8 rounded-full mr-1"
                />
                <span className="text-sm">{participant.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderInvitation = (invitation) => {
    if (!invitation || !invitation.workout) {
      console.error('Invitation or workout data is missing');
      return null;
    }
  
    const workout = invitation.workout;
  
    return (
      <div key={invitation.id} className="bg-yellow-100 rounded-lg p-3 mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">{workout.workout_type || 'Unknown Type'}</span>
          <span className="text-sm text-gray-600">{workout.date || 'Date not set'}</span>
        </div>
        <div className="flex items-center text-sm text-gray-700 mb-1">
          <Clock size={14} className="mr-1" /> {workout.time || 'Time not set'}
        </div>
        <div className="flex items-center text-sm text-gray-700 mb-1">
          <MapPin size={14} className="mr-1" /> {workout.location || 'Location not set'}
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <strong>Organizer:</strong>
          <div className="flex items-center mt-1">
            {renderOrganizer(workout.organizer_id)}
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button 
            className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center text-sm"
            onClick={() => onAcceptInvitation(workout.id)}
          >
            <Check size={14} className="mr-1" /> Accept
          </button>
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded-full flex items-center text-sm"
            onClick={() => onDeclineInvitation(workout.id)}
          >
            <X size={14} className="mr-1" /> Decline
          </button>
        </div>
      </div>
    );
  };

  const renderOrganizer = (organizerId) => {
    if (!allUsers || allUsers.length === 0) {
      console.error('allUsers is undefined or empty');
      return <span>Unable to display organizer</span>;
    }

    const organizer = allUsers.find(u => u.id === organizerId);
    if (!organizer) {
      console.warn(`Organizer not found: ${organizerId}`);
      return <span className="text-sm">Unknown Organizer</span>;
    }

    return (
      <div className="flex items-center">
        <img 
          src={getImageUrl(organizer.image_url)} 
          alt={organizer.name} 
          className="w-8 h-8 rounded-full mr-1"
        />
        <span className="text-sm">{organizer.name}</span>
      </div>
    );
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/profile_images/${imagePath}`;
  };

  if (!buddy || !currentUser) {
    console.error('buddy or currentUser is undefined', { buddy, currentUser });
    return <div>Unable to display workouts and invitations</div>;
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
          {buddy.sharedWorkouts && buddy.sharedWorkouts.length > 0 ? (
            buddy.sharedWorkouts.map(renderWorkout)
          ) : (
            <p className="text-gray-600">No shared workouts yet.</p>
          )}
        </div>
      )}

      {activeTab === 'invitations' && (
        <div>
          <h3 className="font-semibold mb-2">Workout Invitations</h3>
          {buddy.workoutInvitations && buddy.workoutInvitations.length > 0 ? (
            buddy.workoutInvitations.map(renderInvitation)
          ) : (
            <p className="text-gray-600">No pending invitations.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SharedWorkoutsAndInvitations;