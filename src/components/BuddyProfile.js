import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, User, Clock, Activity } from 'lucide-react';

const BuddyProfile = ({ buddies }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [buddy, setBuddy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundBuddy = buddies.find(b => b.id === parseInt(id));
    setBuddy(foundBuddy || null);
    setLoading(false);
  }, [buddies, id]);

  const renderRating = (rating, reviews) => (
    <div className="flex items-center mb-2">
      <div className="flex items-center mr-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={20} className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} />
        ))}
      </div>
      <span className="text-lg font-medium text-gray-700">{rating.toFixed(1)}</span>
      <span className="text-sm text-gray-500 ml-1">({reviews} reviews)</span>
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!buddy) {
    return <div>Buddy not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={() => navigate(-1)} className="mb-4 text-orange-500 font-medium">
        &larr; Back to Find Buddy
      </button>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src={buddy.image} alt={buddy.name} />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-orange-500 font-semibold">{buddy.level || 'N/A'} Level</div>
            <h1 className="mt-1 text-2xl font-semibold text-gray-900">{buddy.name}</h1>
            <p className="mt-2 text-gray-600">{buddy.age || 'N/A'} years old</p>
            <div className="mt-4 flex items-center">
              <User className="text-gray-400 mr-2" size={20} />
              <span className="text-gray-700">{buddy.gender || 'N/A'}</span>
            </div>
            <div className="mt-2 flex items-center">
              <MapPin className="text-gray-400 mr-2" size={20} />
              <span className="text-gray-700">{buddy.distance || 'N/A'} km away</span>
            </div>
            {buddy.rating && buddy.reviews && renderRating(buddy.rating, buddy.reviews)}
          </div>
        </div>
        <div className="px-8 py-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Interests</h2>
          <div className="mt-2 flex flex-wrap">
            {buddy.interests && buddy.interests.map((interest, index) => (
              <span key={index} className="bg-orange-100 text-orange-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">{interest}</span>
            ))}
          </div>
        </div>
        <div className="px-8 py-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Availability</h2>
          <div className="mt-2 flex items-center">
            <Clock className="text-gray-400 mr-2" size={20} />
            <span className="text-gray-700">{buddy.availability ? buddy.availability.join(', ') : 'N/A'}</span>
          </div>
        </div>
        <div className="px-8 py-4 border-t border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Fitness Goals</h2>
          <ul className="mt-2 list-disc list-inside text-gray-700">
            {buddy.fitnessGoals && buddy.fitnessGoals.map((goal, index) => (
              <li key={index}>{goal}</li>
            ))}
          </ul>
        </div>
        <div className="px-8 py-4 border-t border-gray-200">
          <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors">
            Connect with {buddy.name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuddyProfile;