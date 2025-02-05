import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, MapPin, Calendar, Star, Heart, Target } from 'lucide-react';

const PublicProfile = ({ buddies }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    console.log('PublicProfile component rendered');
    console.log('ID from params:', id);
    console.log('Buddies:', buddies);

    const foundUser = buddies.find(buddy => buddy.id === parseInt(id));
    console.log('User data found:', foundUser);

    if (foundUser) {
      setUserData(foundUser);
    } else {
      console.log('No user data found for id:', id);
    }
  }, [id, buddies]);

  if (!userData) {
    return <div>Loading user data...</div>;
  }

  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} />
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Public Profile</h1>
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <User className="mr-2" size={20} />
                <span>{userData.gender}, {userData.age} years old</span>
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
              <h3 className="font-semibold mb-2">Bio</h3>
              <p className="text-gray-600">{userData.bio}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Interests</h3>
              <div className="flex flex-wrap">
                {userData.interests.map((interest, index) => (
                  <span key={index} className="bg-orange-100 text-orange-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Availability</h3>
              <div className="flex flex-wrap">
                {userData.availability.map((time, index) => (
                  <span key={index} className="bg-green-100 text-green-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full">
                    {time}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Fitness Goals</h3>
              <ul className="list-disc list-inside">
                {userData.fitnessGoals.map((goal, index) => (
                  <li key={index} className="text-gray-600">{goal}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 p-6">
          <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
            Connect with {userData.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;