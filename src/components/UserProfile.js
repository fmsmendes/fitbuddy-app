import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Calendar, Activity, Award, Edit, LogOut, Clock, Star, Heart, Target } from 'lucide-react';

const UserProfile = ({ user, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    console.log("User data received:", user);
    setUserData(user);
  }, [user]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  const renderRating = (rating) => {
    if (rating === undefined || rating === null) {
      return <span>No rating available</span>;
    }
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <button onClick={() => navigate('/')} className="text-orange-500 font-medium">
              Back to Dashboard
            </button>
          </div>
          <div className="flex items-center mb-6">
            <img src={userData.image} alt={userData.name} className="w-24 h-24 rounded-full object-cover mr-6" />
            <div>
              <h2 className="text-2xl font-semibold">{userData.name}</h2>
              <p className="text-gray-600">{userData.fitnessLevel} Fitness Enthusiast</p>
              {renderRating(userData.rating)}
            </div>
          </div>
          <div className="flex mb-6">
            <button
              className={`mr-4 px-4 py-2 rounded-lg ${activeTab === 'info' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('info')}
            >
              Information
            </button>
            <button
              className={`mr-4 px-4 py-2 rounded-lg ${activeTab === 'stats' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('stats')}
            >
              Stats
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${activeTab === 'activity' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => setActiveTab('activity')}
            >
              Recent Activity
            </button>
          </div>
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <User className="mr-2" size={20} />
                  <span>{userData.gender}, {userData.age} years old</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="mr-2" size={20} />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-2" size={20} />
                  <span>{userData.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="mr-2" size={20} />
                  <span>Joined {userData.joinDate}</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Interests</h3>
                <div className="flex flex-wrap">
                  {userData.interests && userData.interests.map((interest, index) => (
                    <span key={index} className="bg-orange-100 text-orange-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Availability</h3>
                <div className="flex flex-wrap">
                  {userData.availability && userData.availability.map((time, index) => (
                    <span key={index} className="bg-green-100 text-green-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full">
                      {time}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Fitness Goals</h3>
                <ul className="list-disc list-inside">
                  {userData.fitnessGoals && userData.fitnessGoals.map((goal, index) => (
                    <li key={index} className="text-gray-600">{goal}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {activeTab === 'stats' && userData.stats && (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Events Attended</h3>
                <p className="text-3xl font-bold text-orange-500">{userData.stats.eventsAttended}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Buddies Connected</h3>
                <p className="text-3xl font-bold text-orange-500">{userData.stats.buddiesConnected}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Hours Exercised</h3>
                <p className="text-3xl font-bold text-orange-500">{userData.stats.hoursExercised}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Achievements Earned</h3>
                <p className="text-3xl font-bold text-orange-500">{userData.stats.achievementsEarned}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Likes Received</h3>
                <div className="flex items-center">
                  <Heart className="text-red-500 mr-2" size={24} fill="currentColor" />
                  <p className="text-3xl font-bold text-orange-500">{userData.stats.likesReceived}</p>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Reviews Received</h3>
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-orange-500 mr-4">{userData.reviews || 0}</p>
                  {renderRating(userData.rating)}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              {userData.recentActivity && userData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center bg-gray-100 p-4 rounded-lg">
                  {activity.type === 'event' && <Calendar className="mr-4 text-orange-500" size={24} />}
                  {activity.type === 'connection' && <User className="mr-4 text-orange-500" size={24} />}
                  {activity.type === 'achievement' && <Award className="mr-4 text-orange-500" size={24} />}
                  <div>
                    <p className="font-semibold">{activity.name}</p>
                    <p className="text-sm text-gray-600">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between">
            <button className="flex items-center text-orange-500 hover:text-orange-600">
              <Edit size={20} className="mr-2" />
              Edit Profile
            </button>
            <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-600">
              <LogOut size={20} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
