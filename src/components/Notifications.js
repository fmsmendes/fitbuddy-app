<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, UserPlus, Calendar, Star, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState([
=======
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, UserPlus, Calendar, Star } from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();

  const notifications = [
>>>>>>> ef830e1 (Save local changes before rebase)
    { id: 1, type: 'connection', message: 'John Doe wants to connect with you', time: '2 hours ago', icon: <UserPlus size={20} className="text-blue-500" /> },
    { id: 2, type: 'event', message: 'Reminder: Yoga in the Park tomorrow at 8 AM', time: '5 hours ago', icon: <Calendar size={20} className="text-green-500" /> },
    { id: 3, type: 'system', message: 'Welcome to FitBuddy! Complete your profile to get started.', time: '1 day ago', icon: <Bell size={20} className="text-orange-500" /> },
    { id: 4, type: 'trainer', message: 'Your trainer Alex posted a new workout plan', time: '2 days ago', icon: <Star size={20} className="text-purple-500" /> },
<<<<<<< HEAD
  ]);

  const generalNotifications = notifications.filter(n => n.type !== 'connection' && n.type !== 'trainer');
  const requestNotifications = notifications.filter(n => n.type === 'connection' || n.type === 'trainer');

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const renderNotification = (notification) => (
    <motion.div
      key={notification.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200 relative"
    >
      <div className="flex items-start">
        <div className="mr-4 p-2 bg-gray-100 rounded-full">{notification.icon}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
        </div>
        <button 
          onClick={() => deleteNotification(notification.id)}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
=======
  ];
>>>>>>> ef830e1 (Save local changes before rebase)

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
<<<<<<< HEAD
        <button 
          onClick={() => navigate(-1)} 
          className="text-orange-500 font-medium flex items-center hover:text-orange-600 transition-colors duration-200"
        >
          <ArrowLeft size={20} className="mr-2" />
=======
        <button onClick={() => navigate(-1)} className="text-orange-500 font-medium">
>>>>>>> ef830e1 (Save local changes before rebase)
          Back to Dashboard
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
<<<<<<< HEAD
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 px-4 text-center font-medium transition-colors duration-200 ${
              activeTab === 'general' 
                ? 'text-orange-500 border-b-2 border-orange-500' 
                : 'text-gray-700 hover:text-orange-500'
            }`}
            onClick={() => setActiveTab('general')}
          >
            General
          </button>
          <button
            className={`flex-1 py-2 px-4 text-center font-medium transition-colors duration-200 ${
              activeTab === 'requests' 
                ? 'text-orange-500 border-b-2 border-orange-500' 
                : 'text-gray-700 hover:text-orange-500'
            }`}
            onClick={() => setActiveTab('requests')}
          >
            Requests
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'general' && generalNotifications.map(renderNotification)}
            {activeTab === 'requests' && requestNotifications.map(renderNotification)}
          </motion.div>
        </AnimatePresence>
=======
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
>>>>>>> ef830e1 (Save local changes before rebase)
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Notifications;
=======
export default Notifications;
>>>>>>> ef830e1 (Save local changes before rebase)
