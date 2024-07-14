import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, UserPlus, Calendar, Star } from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();

  const notifications = [
    { id: 1, type: 'connection', message: 'John Doe wants to connect with you', time: '2 hours ago', icon: <UserPlus size={20} className="text-blue-500" /> },
    { id: 2, type: 'event', message: 'Reminder: Yoga in the Park tomorrow at 8 AM', time: '5 hours ago', icon: <Calendar size={20} className="text-green-500" /> },
    { id: 3, type: 'system', message: 'Welcome to FitBuddy! Complete your profile to get started.', time: '1 day ago', icon: <Bell size={20} className="text-orange-500" /> },
    { id: 4, type: 'trainer', message: 'Your trainer Alex posted a new workout plan', time: '2 days ago', icon: <Star size={20} className="text-purple-500" /> },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button onClick={() => navigate(-1)} className="text-orange-500 font-medium">
          Back to Dashboard
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
            <div className="flex items-start">
              <div className="mr-4">{notification.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;