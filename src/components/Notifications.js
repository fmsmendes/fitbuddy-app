import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, UserPlus, Calendar, Star, ArrowLeft, X, Check, X as XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../utils/supabase';

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);

  useEffect(() => {
    fetchNotifications();
    fetchConnectionRequests();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/40';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/profile_images/${imagePath}`;
  };

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data);
      }
    }
  };
  const fetchConnectionRequests = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('buddy_connections')
        .select(`
          id,
          sender_id,
          user_profiles!buddy_connections_sender_id_fkey(name, image_url)
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching connection requests:', error);
      } else {
        setConnectionRequests(data);
      }
    }
  };

  const handleConnectionAction = async (requestId, action) => {
    const { data, error } = await supabase
      .from('buddy_connections')
      .update({ status: action })
      .eq('id', requestId);

    if (error) {
      console.error(`Error ${action} connection request:`, error);
      alert(`Failed to ${action} connection request. Please try again.`);
    } else {
      setConnectionRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
      alert(`Connection request ${action}.`);
    }
  };

  const deleteNotification = async (id) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting notification:', error);
    } else {
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };
  const handleWorkoutInvitation = async (notificationId, workoutId, action) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Remove the notification immediately from the state
      setNotifications(prevNotifications => 
        prevNotifications.filter(n => n.id !== notificationId)
      );

      // Update workout_participants status
      const { error: updateError } = await supabase
        .from('workout_participants')
        .update({ status: action })
        .eq('workout_id', workoutId)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating workout participant status:', updateError);
        return;
      }

      // Fetch workout data and user data
      const { data: workoutData } = await supabase
        .from('workouts')
        .select('organizer_id, workout_type')
        .eq('id', workoutId)
        .single();

      const { data: userData } = await supabase
        .from('user_profiles')
        .select('name')
        .eq('id', user.id)
        .single();

      if (workoutData && userData) {
        // Create notification for the workout host
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: workoutData.organizer_id,
            type: 'workout_response',
            message: JSON.stringify({
              responder_name: userData.name,
              response: action,
              workout_type: workoutData.workout_type
            })
          });

        if (notificationError) {
          console.error('Error creating response notification:', notificationError);
        }
      }

      // Delete the original invitation notification from the database
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (deleteError) {
        console.error('Error deleting notification:', deleteError);
      }
    }
  };
  const renderNotification = (notification) => {
    const content = JSON.parse(notification.message);
    switch (notification.type) {
      case 'workout_invitation':
        return (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200 relative"
          >
            <div className="flex items-start">
              <div className="mr-4 p-2 bg-gray-100 rounded-full">
                <Calendar size={24} className="text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {content.host_name} has invited you to a {content.workout_type} workout
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {content.workout_date} at {content.workout_time}
                </p>
                <div className="mt-2">
                  <button
                    onClick={() => handleWorkoutInvitation(notification.id, content.workout_id, 'accepted')}
                    className="bg-green-500 text-white px-3 py-1 rounded-md mr-2"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleWorkoutInvitation(notification.id, content.workout_id, 'declined')}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    Decline
                  </button>
                </div>
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
      case 'workout_response':
        return (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200 relative"
          >
            <div className="flex items-start">
              <div className="mr-4 p-2 bg-gray-100 rounded-full">
                <Calendar size={24} className="text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {content.responder_name} has {content.response} your {content.workout_type} workout invitation
                </p>
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
      // ... handle other notification types
      default:
        return null;
    }
  };
  const renderConnectionRequest = (request) => (
    <motion.div
      key={request.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200 relative"
    >
      <div className="flex items-start">
        <img 
           src={getImageUrl(request.user_profiles.image_url)} 
           alt={request.user_profiles.name} 
           className="w-10 h-10 rounded-full mr-4"
           onError={(e) => {
             e.target.onerror = null;
             e.target.src = 'https://via.placeholder.com/40';
           }}
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{request.user_profiles.name} wants to connect with you</p>
          <div className="mt-2">
            <button 
              onClick={() => handleConnectionAction(request.id, 'accepted')}
              className="bg-green-500 text-white px-3 py-1 rounded-md mr-2"
            >
              <Check size={16} />
            </button>
            <button 
              onClick={() => handleConnectionAction(request.id, 'rejected')}
              className="bg-red-500 text-white px-3 py-1 rounded-md mr-2"
            >
              <XIcon size={16} />
            </button>
            <button 
              onClick={() => handleConnectionAction(request.id, 'blocked')}
              className="bg-gray-500 text-white px-3 py-1 rounded-md"
            >
              Block
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button 
          onClick={() => navigate(-1)} 
          className="text-orange-500 font-medium flex items-center hover:text-orange-600 transition-colors duration-200"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
            {activeTab === 'general' && notifications.filter(n => n.type !== 'workout_invitation').map(renderNotification)}
            {activeTab === 'requests' && (
              <>
                {connectionRequests.map(renderConnectionRequest)}
                {notifications.filter(n => n.type === 'workout_invitation').map(renderNotification)}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;