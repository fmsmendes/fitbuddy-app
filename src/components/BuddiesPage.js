import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Activity, Calendar, Clock, MapPin, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../utils/supabase';
import SharedWorkoutsAndInvitations from './SharedWorkoutsAndInvitations';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/profile_images/`;

const BuddiesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedChats, setExpandedChats] = useState({});
  const [connectedBuddies, setConnectedBuddies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredBuddies, setFilteredBuddies] = useState([]);

  useEffect(() => {
    fetchCurrentUser();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchConnectedBuddies();
    }
  }, [currentUser]);

  useEffect(() => {
    const filtered = connectedBuddies.filter(buddy =>
      buddy.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBuddies(filtered);
  }, [connectedBuddies, searchTerm]);

  useEffect(() => {
    if (currentUser && allUsers.length > 0 && connectedBuddies.length > 0) {
      setLoading(false);
    }
  }, [currentUser, allUsers, connectedBuddies]);
  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) {
        console.error('Error fetching current user profile:', error);
      } else {
        setCurrentUser(data);
      }
    }
  };

  const fetchAllUsers = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, name, image_url');
    
    if (error) {
      console.error('Error fetching all users:', error);
    } else {
      setAllUsers(data);
    }
  };

  const fetchConnectedBuddies = async () => {
    if (!currentUser) return;
  
    const { data, error } = await supabase
      .from('buddy_connections')
      .select(`
        *,
        buddy:user_profiles!buddy_connections_sender_id_fkey(*),
        connected_buddy:user_profiles!buddy_connections_receiver_id_fkey(*)
      `)
      .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
      .eq('status', 'accepted');
  
    if (error) {
      console.error('Error fetching connected buddies:', error);
    } else {
      const formattedBuddies = data.map((connection) => {
        const buddy = connection.sender_id === currentUser.id ? connection.connected_buddy : connection.buddy;
        return {
          ...buddy,
          connectionId: connection.id,
          distance: calculateDistance(
            currentUser.latitude,
            currentUser.longitude,
            buddy.latitude,
            buddy.longitude
          )
        };
      });
      
      setConnectedBuddies(formattedBuddies);
    }
  };
        const toggleChat = (buddyId) => {
          setExpandedChats(prev => ({
            ...prev,
            [buddyId]: !prev[buddyId]
          }));
        };
      
        const renderRating = (rating) => (
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                className={`${i < Math.floor(rating || 0) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} 
              />
            ))}
            <span className="ml-2 text-sm font-medium text-gray-700">
              {rating ? rating.toFixed(1) : 'N/A'}
            </span>
          </div>
        );
      
        const calculateAge = (dob) => {
          const today = new Date();
          const birthDate = new Date(dob);
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          return age;
        };
      
        const calculateDistance = (lat1, lon1, lat2, lon2) => {
          const R = 6371; // Radius of the earth in km
          const dLat = deg2rad(lat2 - lat1);
          const dLon = deg2rad(lon2 - lon1);
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
          ; 
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
          const d = R * c; // Distance in km
          return d.toFixed(1);
        };
      
        const deg2rad = (deg) => {
          return deg * (Math.PI/180);
        };
      
        const getImageUrl = (imagePath) => {
          if (!imagePath) return 'https://via.placeholder.com/150';
          if (imagePath.startsWith('http')) return imagePath;
          return `${STORAGE_URL}${imagePath}`;
        };
        const handleAcceptInvitation = async (workoutId) => {
          try {
            const { data, error } = await supabase
              .from('workout_participants')
              .update({ status: 'accepted' })
              .eq('workout_id', workoutId)
              .eq('user_id', currentUser.id);
        
            if (error) throw error;
        
            await fetchConnectedBuddies();
          } catch (error) {
            console.error('Error accepting invitation:', error);
          }
        };
      
        const handleDeclineInvitation = async (workoutId) => {
          try {
            const { data, error } = await supabase
              .from('workout_participants')
              .update({ status: 'declined' })
              .eq('workout_id', workoutId)
              .eq('user_id', currentUser.id);

            if (error) throw error;

            await fetchConnectedBuddies();
          } catch (error) {
            console.error('Error declining invitation:', error);
          }
        };

        const handleCreateWorkoutRequest = async (buddyId, workoutDetails) => {
          try {
            // Create a new workout
            const { data: workout, error: workoutError } = await supabase
              .from('workouts')
              .insert([
                { 
                  organizer_id: currentUser.id,
                  ...workoutDetails
                }
              ])
              .single();

            if (workoutError) throw workoutError;

            // Create workout participants entries
            const { error: participantsError } = await supabase
              .from('workout_participants')
              .insert([
                { workout_id: workout.id, user_id: currentUser.id, status: 'accepted' },
                { workout_id: workout.id, user_id: buddyId, status: 'pending' }
              ]);

            if (participantsError) throw participantsError;

            await fetchConnectedBuddies();
          } catch (error) {
            console.error('Error creating workout request:', error);
          }
        };

        if (loading) {
          return <div>Loading buddies...</div>;
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
                  {/* Buddy information */}
                  <div className="flex items-start">
                    <img 
                      src={getImageUrl(buddy.image_url)} 
                      alt={buddy.name} 
                      className="w-16 h-16 rounded-full object-cover mr-4"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/150'
                      }}
                    />
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold">{buddy.name}</h2>
                      <p className="text-gray-600">{calculateAge(buddy.dob)} years old, {buddy.gender}</p>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin size={14} className="mr-1" /> {buddy.distance} km away
                      </div>
                      {renderRating(buddy.rating)}
                    </div>
                    <div className="flex flex-col items-end">
                      <button 
                        onClick={() => navigate(`/message-buddy/${buddy.id}`)}
                        className="mb-2 px-3 py-1 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors flex items-center"
                      >
                        <MessageCircle size={16} className="mr-1" /> Message
                      </button>
                      <button 
                        onClick={() => navigate(`/schedule-workout/${buddy.id}`)}
                        className="px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center"
                      >
                        <Calendar size={16} className="mr-1" /> Schedule Workout
                      </button>
                    </div>
                  </div>
      
                  {/* Recent Chats */}
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
      
                  {/* Shared Workouts and Invitations */}
                  <SharedWorkoutsAndInvitations 
                    buddy={buddy} 
                    currentUser={currentUser}
                    onAcceptInvitation={handleAcceptInvitation}
                    onDeclineInvitation={handleDeclineInvitation}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      };
      
      export default BuddiesPage;
