import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Activity, Calendar, Clock, MapPin, Star, ChevronDown, ChevronUp } from 'lucide-react';

const BuddiesPage = ({ connectedBuddies }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChats, setExpandedChats] = useState({});

  const filteredBuddies = connectedBuddies?.filter(buddy =>
    buddy.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const toggleChat = (buddyId) => {
    setExpandedChats(prev => ({
      ...prev,
      [buddyId]: !prev[buddyId]
    }));
  };

  const renderRating = (rating) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );

  if (!connectedBuddies || connectedBuddies.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Buddies</h1>
          <button onClick={() => navigate('/')} className="text-orange-500 font-medium">
            Back to Dashboard
          </button>
        </div>
        <p>No buddies found. Start connecting with fitness partners!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Buddies</h1>
        <button onClick={() => navigate('/')} className="text-orange-500 font-medium">
          Back to Dashboard
        </button>
      </div>

      <input
        type="text"
        placeholder="Search buddies..."
        className="w-full p-2 mb-4 border rounded-lg"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="space-y-4">
        {filteredBuddies.map(buddy => (
          <div key={buddy.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-start">
              <img src={buddy.image} alt={buddy.name} className="w-16 h-16 rounded-full object-cover mr-4" />
              <div className="flex-grow">
                <h2 className="text-xl font-semibold">{buddy.name}</h2>
                <p className="text-gray-600">{buddy.age} years old, {buddy.gender}</p>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin size={14} className="mr-1" /> {buddy.distance} km away
                </div>
                {renderRating(buddy.rating)}
              </div>
              <div className="flex flex-col items-end">
                <button className="mb-2 px-3 py-1 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors flex items-center">
                  <MessageCircle size={16} className="mr-1" /> Message
                </button>
                <button className="px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center">
                  <Calendar size={16} className="mr-1" /> Schedule Workout
                </button>
              </div>
            </div>

            <div className="mt-4">
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleChat(buddy.id)}
              >
                <h3 className="font-semibold">Recent Chats</h3>
                {expandedChats[buddy.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {buddy.recentChats && buddy.recentChats.length > 0 && (
                <>
                  {!expandedChats[buddy.id] && (
                    <div className="bg-gray-100 rounded p-2 mt-2">
                      <p className="text-sm"><span className="font-semibold">{buddy.recentChats[0].sender}:</span> {buddy.recentChats[0].message}</p>
                      <p className="text-xs text-gray-500">{buddy.recentChats[0].timestamp}</p>
                    </div>
                  )}
                  {expandedChats[buddy.id] && (
                    <div className="mt-2 space-y-2">
                      {buddy.recentChats.slice(0, 4).map((chat, index) => (
                        <div key={index} className="bg-gray-100 rounded p-2">
                          <p className="text-sm"><span className="font-semibold">{chat.sender}:</span> {chat.message}</p>
                          <p className="text-xs text-gray-500">{chat.timestamp}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Shared Workouts</h3>
              {buddy.sharedWorkouts && buddy.sharedWorkouts.map((workout, index) => (
                <div key={index} className="bg-blue-100 rounded p-2 mb-2 flex items-center">
                  <Activity size={20} className="mr-2 text-blue-500" />
                  <div>
                    <p className="text-sm font-semibold">{workout.type}</p>
                    <p className="text-xs text-gray-600">
                      <Clock size={12} className="inline mr-1" /> {workout.duration}, <Calendar size={12} className="inline mx-1" /> {workout.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuddiesPage;