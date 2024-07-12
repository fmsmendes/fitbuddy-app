import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Activity, ArrowLeft } from 'lucide-react';

const PublicProfile = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Public Profile</h1>
        <button onClick={() => navigate('/')} className="text-orange-500 font-medium flex items-center">
          <ArrowLeft size={20} className="mr-1" /> Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <img src={user.image} alt={user.name} className="w-24 h-24 rounded-full object-cover mr-6" />
          <div>
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.age} years old, {user.gender}</p>
            <div className="flex items-center mt-2">
              <MapPin size={16} className="mr-1 text-gray-500" />
              <span className="text-gray-600">{user.location}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Fitness Level</h3>
          <p>{user.fitnessLevel}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Interests</h3>
          <div className="flex flex-wrap">
            {user.interests.map((interest, index) => (
              <span key={index} className="bg-orange-100 text-orange-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full">
                {interest}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Bio</h3>
          <p>{user.bio}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Activity Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <Activity size={24} className="text-orange-500 mb-2" />
              <p className="text-2xl font-bold">{user.workoutsCompleted}</p>
              <p className="text-sm text-gray-600">Workouts Completed</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <Star size={24} className="text-orange-500 mb-2" />
              <p className="text-2xl font-bold">{user.rating}</p>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;