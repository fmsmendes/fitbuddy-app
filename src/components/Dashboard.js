import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, User, Users, Search, MapPin, Star, Activity, Clock, Dumbbell, Heart, TrendingUp, Award, Sun, Moon, MessageSquare, Plus } from 'lucide-react';
import Navigation from './Navigation';
import UserMenu from './UserMenu';
import AllTrainersPage from './AllTrainersPage';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';


const Dashboard = ({ setIsAuthenticated, currentUser }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [favoriteBuddies, setFavoriteBuddies] = useState([]);
    const [favoriteTrainers, setFavoriteTrainers] = useState([]);
    const [isFetchingFavorites, setIsFetchingFavorites] = useState(true);
    const [userName, setUserName] = useState('');
    const [userProfileImage, setUserProfileImage] = useState('https://via.placeholder.com/150');
    const [connections, setConnections] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);
    const [matchedBuddies, setMatchedBuddies] = useState([]);
    const [buddyFetchError, setBuddyFetchError] = useState(null);
    const navigate = useNavigate();
    const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
    const [userLocationError, setUserLocationError] = useState(null);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [featuredTrainers, setFeaturedTrainers] = useState([]);
    

    // Dummy data for events and trainers (to be replaced with Supabase fetching later)
   

    const trainers = [
        { id: 1, name: 'James Dean', age: 36, latitude: 28.0167, longitude: 153.4000, rating: 4.8, reviews_count: 56, image_url: 'https://example.com/james.jpg', specialties: ['HIIT', 'Strength Training'], experience: 10 },
        { id: 2, name: 'Sarah Thompson', age: 39, latitude: 28.0229, longitude: 153.4142, rating: 4.9, reviews_count: 72, image_url: 'https://example.com/sarah.jpg', specialties: ['Yoga', 'Pilates'], experience: 15 },
        { id: 3, name: 'Mike Johnson', age: 42, latitude: 27.9944, longitude: 153.4311, rating: 4.7, reviews_count: 48, image_url: 'https://example.com/mike.jpg', specialties: ['CrossFit', 'Nutrition'], experience: 12 },
    ];

    useEffect(() => {
        console.log('Dashboard component mounted');
        console.log('Current user:', currentUser);
        fetchUserProfile();
        fetchConnections();
        fetchNotificationCount();
        fetchBuddies();
        fetchFavoriteBuddies();
        fetchUpcomingEvents();
        console.log('About to fetch featured trainers');
        fetchFeaturedTrainers();
        fetchFavoriteTrainers(); 
    }, [currentUser]);
  
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

    const fetchUserProfile = async () => {
        console.log('Fetching user profile');
        if (currentUser && currentUser.id) {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('name, image_url, latitude, longitude')
                .eq('id', currentUser.id)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error);
                setUserLocationError('Error fetching user location');
            } else if (data) {
                console.log('User profile fetched:', data);
                setUserName(data.name);
                if (data.image_url) {
                    const { data: imageData } = supabase.storage
                        .from('profile_images')
                        .getPublicUrl(data.image_url);
                    setUserProfileImage(imageData.publicUrl);
                }
                if (data.latitude && data.longitude) {
                    setUserLocation({ latitude: data.latitude, longitude: data.longitude });
                } else {
                    setUserLocationError('User location not set');
                }
            }
        
        }
    };

    const fetchNotificationCount = async () => {
        console.log('Fetching notification count');
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { count: connectionCount, error: connectionError } = await supabase
            .from('buddy_connections')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', user.id)
            .eq('status', 'pending');
      
          const { count: notificationCount, error: notificationError } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('read', false);
      
          if (connectionError || notificationError) {
            console.error('Error fetching notification count:', connectionError || notificationError);
          } else {
            const totalCount = connectionCount + notificationCount;
            console.log('Total notification count:', totalCount);
            setNotificationCount(totalCount);
          }
        }
    };

    const fetchConnections = async () => {
        console.log('Fetching connections');
        if (currentUser) {
            const { data, error } = await supabase
                .from('buddy_connections')
                .select(`
                    id,
                    sender_id,
                    receiver_id,
                    sender:user_profiles!buddy_connections_sender_id_fkey(id, name, image_url),
                    receiver:user_profiles!buddy_connections_receiver_id_fkey(id, name, image_url)
                `)
                .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
                .eq('status', 'accepted');

            if (error) {
                console.error('Error fetching connections:', error);
            } else {
                const formattedConnections = data.map(conn => {
                    const buddy = conn.sender_id === currentUser.id ? conn.receiver : conn.sender;
                    return {
                        id: conn.id,
                        buddyId: buddy.id,
                        name: buddy.name,
                        image: buddy.image_url
                    };
                });
                console.log('Formatted connections:', formattedConnections);
                setConnections(formattedConnections);
            }
        }
    };

    const fetchBuddies = async () => {
        console.log('Fetching buddies');
        if (currentUser) {
            try {
                const { data: currentUserProfile, error: profileError } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', currentUser.id)
                    .single();
    
                if (profileError) {
                    console.error('Error fetching current user profile:', profileError);
                    setBuddyFetchError('Error fetching user profile');
                    return;
                }
    
                // Calculate current user's age
                currentUserProfile.age = calculateAge(currentUserProfile.dob);
                console.log('Current user profile:', currentUserProfile);
    
                const { data: allUsers, error: usersError } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .neq('id', currentUser.id);
    
                if (usersError) {
                    console.error('Error fetching users:', usersError);
                    setBuddyFetchError('Error fetching potential buddies');
                    return;
                }
    
                // Calculate age for all users
                allUsers.forEach(user => {
                    user.age = calculateAge(user.dob);
                });
                console.log('All users:', allUsers);
    
                // Fetch buddy ratings
                const buddyIds = allUsers.map(user => user.id);
                const { data: ratings, error: ratingsError } = await supabase
                    .from('buddy_reviews')
                    .select('buddy_id, rating')
                    .in('buddy_id', buddyIds);
    
                if (ratingsError) {
                    console.error('Error fetching buddy ratings:', ratingsError);
                } else {
                    // Calculate average ratings
                    const averageRatings = {};
                    ratings.forEach(rating => {
                        if (!averageRatings[rating.buddy_id]) {
                            averageRatings[rating.buddy_id] = { sum: 0, count: 0 };
                        }
                        averageRatings[rating.buddy_id].sum += rating.rating;
                        averageRatings[rating.buddy_id].count += 1;
                    });
    
                    // Add average ratings to buddies
                    allUsers.forEach(user => {
                        if (averageRatings[user.id]) {
                            user.averageRating = averageRatings[user.id].sum / averageRatings[user.id].count;
                            user.reviewCount = averageRatings[user.id].count;
                        } else {
                            user.averageRating = 0;
                            user.reviewCount = 0;
                        }
                    });
                }
    
                const filteredAndSortedBuddies = filterAndSortBuddies(allUsers, currentUserProfile);
                console.log('Filtered and sorted buddies:', filteredAndSortedBuddies);
                setMatchedBuddies(filteredAndSortedBuddies);
            } catch (error) {
                console.error('Unexpected error in fetchBuddies:', error);
                setBuddyFetchError('Unexpected error occurred');
            }
        } else {
            console.error('No current user');
            setBuddyFetchError('No current user');
        }
    };

    const filterAndSortBuddies = (buddies, currentUserProfile) => {
        console.log('Filtering buddies. Current user:', currentUserProfile);
        return buddies
            .filter(buddy => {
                if (!buddy.latitude || !buddy.longitude || !buddy.dob) {
                    console.log('Skipping buddy due to missing data:', buddy.id);
                    return false;
                }
                
                const distance = calculateDistance(
                    currentUserProfile.latitude, 
                    currentUserProfile.longitude, 
                    buddy.latitude, 
                    buddy.longitude
                );
                const ageDifference = Math.abs(currentUserProfile.age - buddy.age);
                
                const hasCommonInterests = 
                    Array.isArray(buddy.interests) && 
                    Array.isArray(currentUserProfile.interests) && 
                    buddy.interests.some(interest => currentUserProfile.interests.includes(interest));
                
                const hasCommonAvailability = 
                    Array.isArray(buddy.availability) && 
                    Array.isArray(currentUserProfile.availability) && 
                    buddy.availability.some(time => currentUserProfile.availability.includes(time));

                const isMatch = distance <= 25 && ageDifference <= 10 && (hasCommonInterests || hasCommonAvailability);
                console.log(`Buddy ${buddy.id} match result:`, isMatch, { distance, ageDifference, hasCommonInterests, hasCommonAvailability });
                return isMatch;
            })
            .sort((a, b) => {
                const distanceA = calculateDistance(
                    currentUserProfile.latitude, 
                    currentUserProfile.longitude, 
                    a.latitude, 
                    a.longitude
                );
                const distanceB = calculateDistance(
                    currentUserProfile.latitude, 
                    currentUserProfile.longitude, 
                    b.latitude, 
                    b.longitude
                );
                return distanceA - distanceB;
            })
            .slice(0, 10);
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
        return d;
    };

    const deg2rad = (deg) => {
        return deg * (Math.PI/180);
    };

    const fetchFeaturedTrainers = async () => {
        try {
            console.log('Fetching featured trainers...');
    
            // Step 1: Fetch user profiles with 'trainer' role
            const { data: userProfiles, error: userProfilesError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('role', 'trainer')
                .limit(5);
    
            if (userProfilesError) throw userProfilesError;
    
            console.log('User profiles:', userProfiles);
    
            if (!userProfiles || userProfiles.length === 0) {
                console.log('No trainers found');
                setFeaturedTrainers([]);
                return;
            }
    
            // Step 2: Fetch corresponding trainer data
            const trainerIds = userProfiles.map(profile => profile.id);
            console.log('Trainer IDs:', trainerIds);
    
            const { data: trainerData, error: trainerDataError } = await supabase
                .from('trainers')
                .select('*')
                .in('id', trainerIds);
    
            if (trainerDataError) {
                console.error('Error fetching trainer data:', trainerDataError);
                throw trainerDataError;
            }
    
            // Step 3: Fetch ratings for all trainers
            const { data: ratingsData, error: ratingsError } = await supabase
                .from('trainer_reviews')
                .select('trainer_id, rating')
                .in('trainer_id', trainerIds);
    
            if (ratingsError) {
                console.error('Error fetching trainer ratings:', ratingsError);
                throw ratingsError;
            }
    
            // Calculate average ratings
            const averageRatings = {};
            ratingsData.forEach(review => {
                if (!averageRatings[review.trainer_id]) {
                    averageRatings[review.trainer_id] = { sum: 0, count: 0 };
                }
                averageRatings[review.trainer_id].sum += review.rating;
                averageRatings[review.trainer_id].count += 1;
            });
    
            // Combine user profile, trainer data, and ratings
            const enrichedTrainers = userProfiles.map(profile => {
                const trainerInfo = trainerData.find(t => t.id === profile.id);
                const ratingInfo = averageRatings[profile.id];
                const averageRating = ratingInfo ? ratingInfo.sum / ratingInfo.count : 0;
                const reviewCount = ratingInfo ? ratingInfo.count : 0;
    
                return {
                    id: profile.id,
                    name: profile.name,
                    age: calculateAge(profile.dob),
                    image_url: profile.image_url,
                    latitude: profile.latitude,
                    longitude: profile.longitude,
                    experience: trainerInfo ? `${trainerInfo.experience} years` : 'N/A',
                    specialties: trainerInfo ? trainerInfo.specialties : [],
                    hourly_rate: trainerInfo ? trainerInfo.hourly_rate : 'N/A',
                    rating: averageRating,
                    reviews_count: reviewCount
                };
            });
    
            console.log('Enriched trainer data:', enrichedTrainers);
    
            setFeaturedTrainers(enrichedTrainers);
        } catch (error) {
            console.error('Error in fetchFeaturedTrainers:', error);
            setFeaturedTrainers([]);
        }
    };
    const fetchFavoriteBuddies = async () => {
        setIsFetchingFavorites(true);
        if (currentUser && currentUser.id) {
            const { data, error } = await supabase
                .from('favorite_buddies')
                .select('buddy_id')
                .eq('user_id', currentUser.id);

            if (error) {
                console.error('Error fetching favorite buddies:', error);
            } else {
                setFavoriteBuddies(data.map(item => item.buddy_id));
            }
        }
        setIsFetchingFavorites(false);
    };

    const toggleFavoriteBuddy = async (buddyId) => {
        if (!currentUser) return;

        const isFavorite = favoriteBuddies.includes(buddyId);

        if (isFavorite) {
            // Remove from favorites
            const { error } = await supabase
                .from('favorite_buddies')
                .delete()
                .eq('user_id', currentUser.id)
                .eq('buddy_id', buddyId);

            if (error) {
                console.error('Error removing favorite buddy:', error);
            } else {
                setFavoriteBuddies(favoriteBuddies.filter(id => id !== buddyId));
            }
        } else {
            // Add to favorites
            const { data, error } = await supabase
                .from('favorite_buddies')
                .insert({ user_id: currentUser.id, buddy_id: buddyId });

                if (error) {
                    if (error.code === '23505') {
                        // This is a duplicate key error, which means the buddy is already favorited
                        console.log('Buddy is already favorited');
                        // Ensure the buddy is in the favoriteBuddies state
                        if (!favoriteBuddies.includes(buddyId)) {
                            setFavoriteBuddies([...favoriteBuddies, buddyId]);
                        }
                    } else {
                        console.error('Error adding favorite buddy:', error);
                    }
                } else if (data) {
                    setFavoriteBuddies([...favoriteBuddies, buddyId]);
                }
            }
    };
    
    const fetchFavoriteTrainers = async () => {
        if (currentUser && currentUser.id) {
          const { data, error } = await supabase
            .from('favorite_trainers')
            .select('trainer_id')
            .eq('user_id', currentUser.id);
    
          if (error) {
            console.error('Error fetching favorite trainers:', error);
          } else {
            setFavoriteTrainers(data.map(item => item.trainer_id));
          }
        }
      };

    const toggleFavoriteTrainer = async (trainerId) => {
        if (!currentUser) return;
    
        const isFavorite = favoriteTrainers.includes(trainerId);
    
        if (isFavorite) {
          // Remove from favorites
          const { error } = await supabase
            .from('favorite_trainers')
            .delete()
            .eq('user_id', currentUser.id)
            .eq('trainer_id', trainerId);
    
          if (error) {
            console.error('Error removing favorite trainer:', error);
          } else {
            setFavoriteTrainers(favoriteTrainers.filter(id => id !== trainerId));
          }
        } else {
          // Add to favorites
          const { data, error } = await supabase
            .from('favorite_trainers')
            .insert({ user_id: currentUser.id, trainer_id: trainerId });
    
          if (error) {
            if (error.code === '23505') {
              console.log('Trainer is already favorited');
              if (!favoriteTrainers.includes(trainerId)) {
                setFavoriteTrainers([...favoriteTrainers, trainerId]);
              }
            } else {
              console.error('Error adding favorite trainer:', error);
            }
          } else if (data) {
            setFavoriteTrainers([...favoriteTrainers, trainerId]);
          }
        }
      };

    const renderRating = (rating, reviews) => (
        <div className="flex items-center mb-2">
            <div className="flex items-center mr-2">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} />
                ))}
            </div>
            <span className="text-sm font-medium text-gray-700">{rating?.toFixed(1) || 'N/A'}</span>
            <span className="text-sm text-gray-500 ml-1">({reviews || 0} reviews)</span>
        </div>
    );

    const renderBuddyCard = (buddy) => {
        const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            buddy.latitude,
            buddy.longitude
        ).toFixed(1);
    
        return (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-72 transition-all duration-300 hover:shadow-xl">
                <div className="relative h-60">
                    <img 
                        src={buddy.image_url ? `${supabase.storage.from('profile_images').getPublicUrl(buddy.image_url).data.publicUrl}` : 'https://via.placeholder.com/150'} 
                        alt={buddy.name} 
                        className="w-full h-full object-cover"
                    />
                    <button 
                        onClick={() => toggleFavoriteBuddy(buddy.id)}
                        className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 transition-colors duration-300 hover:bg-white"
                    >
                        <Heart 
                            size={24} 
                            className={`${favoriteBuddies.includes(buddy.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                        />
                    </button>
                </div>
                <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-xl text-gray-800">{buddy.name}</h3>
                        <span className="text-gray-600 font-medium">{buddy.age} years</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                        <MapPin size={16} className="mr-2 text-orange-500" />
                        <span>{distance} km away</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                        <User size={16} className="mr-2 text-orange-500" />
                        <span>{buddy.gender}</span>
                    </div>
                    <div className="flex items-center mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={18}
                                className={`${
                                    star <= Math.round(buddy.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                            />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                            {buddy.averageRating ? buddy.averageRating.toFixed(1) : 'N/A'} ({buddy.reviewCount || 0})
                        </span>
                    </div>
                    <p className="text-sm mb-3">
                        Fitness Level: <span className="font-semibold text-orange-500">{buddy.fitness_level}</span>
                    </p>
                    <div>
                        <p className="text-sm font-medium mb-2">Interests:</p>
                        <div className="flex flex-wrap gap-1">
                            {buddy.interests && buddy.interests.slice(0, 2).map((interest, index) => (
                                <span key={index} className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">{interest}</span>
                            ))}
                            {buddy.interests && buddy.interests.length > 2 && (
                                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                                    +{buddy.interests.length - 2} more
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => navigate(`/buddy/${buddy.id}`)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 transition-colors duration-300"
                >
                    Connect
                </button>
            </div>
        );
    };

    const fetchUpcomingEvents = async () => {
        console.log('fetchUpcomingEvents function called');
        try {
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
            console.log('Fetching events from:', today);
    
            const { data, error } = await supabase
                .from('events')
                .select(`
                    *,
                    host:user_profiles!host_id(id, name, image_url)
                `)
                .gte('date', today)
                .order('date', { ascending: true })
                .limit(10);
    
            console.log('Raw events data:', data);
            console.log('Fetch error:', error);
    
            if (error) {
                console.error('Error fetching upcoming events:', error);
            } else if (data && data.length > 0) {
                console.log('Formatted events:', data);
                setUpcomingEvents(data);
            } else {
                console.log('No events found in the initial query');
                setUpcomingEvents([]);
            }
        } catch (error) {
            console.error('Unexpected error in fetchUpcomingEvents:', error);
        }
    };


    const renderEventCard = (event) => {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-GB', { 
            weekday: 'short', 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
        
        const [hours, minutes] = event.time.split(':');
        const formattedTime = `${hours}:${minutes}`;
    
        return (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden w-72 transition-all duration-300 hover:shadow-xl">
                <div className="relative h-48">
                    <img 
                        src={event.image_url || 'https://via.placeholder.com/300x200'} 
                        alt={event.name} 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                        <h3 className="text-white font-bold text-xl">{event.name}</h3>
                    </div>
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">{event.type}</span>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${event.is_free ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {event.is_free ? 'Free' : `$${event.price}`}
                        </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Calendar size={14} className="mr-2 text-orange-500" /> 
                        {formattedDate} at {formattedTime}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin size={14} className="mr-2 text-orange-500" /> {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Users size={14} className="mr-2 text-orange-500" /> {event.current_participants} / {event.max_participants || 'Unlimited'}
                    </div>
                    {event.host && (
                        <div className="flex items-center mb-4">
                            <img 
                                src={event.host.image_url ? `${supabase.storage.from('profile_images').getPublicUrl(event.host.image_url).data.publicUrl}` : 'https://via.placeholder.com/40'} 
                                alt={event.host.name} 
                                className="w-8 h-8 rounded-full object-cover mr-2"
                            />
                            <span className="text-sm text-gray-600">Hosted by {event.host.name}</span>
                        </div>
                    )}
                    
                </div>
                <button 
                        onClick={() => navigate(`/event/${event.id}`)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 transition-colors duration-300"
                >
                        Join Event
                    </button>

            </div>
        );
    };


    const renderTrainerCard = (trainer) => (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden w-72 transition-all duration-300 hover:shadow-xl">
            <div className="relative h-48">
                <img
                    src={trainer.image_url ? `${supabase.storage.from('profile_images').getPublicUrl(trainer.image_url).data.publicUrl}` : 'https://via.placeholder.com/150'}
                    alt={trainer.name}
                    className="w-full h-full object-cover"
                />
                <button
                    onClick={() => toggleFavoriteTrainer(trainer.id)}
                    className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm rounded-full p-2 transition-colors duration-300 hover:bg-white"
                >
                    <Heart
                        size={24}
                        className={`${favoriteTrainers.includes(trainer.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                    />
                </button>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-xl text-gray-800 mb-1">
                    {trainer.name} <span className="text-sm font-normal text-gray-500">{trainer.age} years</span>
                </h3>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin size={14} className="mr-2 text-orange-500" /> 
                    {calculateDistance(currentUser.latitude, currentUser.longitude, trainer.latitude, trainer.longitude).toFixed(1)} km away
                </div>
                <div className="flex items-center mb-2">
                    {renderRating(trainer.rating, trainer.reviews_count)}
                </div>
                <p className="text-sm text-gray-700 mb-2">Experience: <span className="font-semibold text-orange-500">{trainer.experience}</span></p>
                <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-1">Specialties:</p>
                    <div className="flex flex-wrap gap-1">
                        {trainer.specialties?.slice(0, 1).map((specialty, index) => (
                            <span key={index} className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">{specialty}</span>
                        ))}
                        {trainer.specialties?.length > 2 && (
                            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                                +{trainer.specialties.length - 2} more
                            </span>
                        )}
                    </div>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-3">Hourly Rate: <span className="text-orange-500">${trainer.hourly_rate}/hour</span></p>
                
            </div>
            <button
                    onClick={() => navigate(`/trainer/${trainer.id}`)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 transition-colors duration-300"
                >
                    View Profile
                </button>
        </div>
    );

    return (
        <div className="font-sans max-w-7xl mx-auto bg-gray-100 min-h-screen overflow-y-auto pb-16">
            <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
                    <span className="font-bold text-xl">FITbuddy</span>
                </div>
                <div className="flex items-center">
                    <button 
                        onClick={() => navigate('/messages')} 
                        className="relative mr-4"
                    >
                        <MessageSquare className="text-orange-500" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {/* Add message count here if needed */}
                        </span>
                    </button>
                    <button 
                        onClick={() => navigate('/notifications')} 
                        className="relative mr-4"
                    >
                        <Bell className="text-orange-500" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{notificationCount}</span>
                    </button>
                    <button onClick={() => setIsUserMenuOpen(true)} className="w-10 h-10 rounded-full overflow-hidden">
                        <img src={userProfileImage} 
                            alt={userName || 'User'} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = 'https://via.placeholder.com/150';
                            }}
                        />
                    </button>
                </div>
            </header>

            <main className="p-4">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-semibold mb-6"
                >
                    Hello, {userName || 'User'}
                </motion.h1>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
                >
                    {[
                        { icon: <Users size={24} />, label: 'Find a Buddy', description: 'Connect with fitness partners', onClick: () => navigate('/find-buddy') },
                        { icon: <Calendar size={24} />, label: 'Events', description: 'Join local fitness activities', onClick: () => navigate('/events') },
                        { icon: <Dumbbell size={24} />, label: 'Trainers', description: 'Book sessions with pros', onClick: () => navigate('/all-trainers') },
                        { icon: <Activity size={24} />, label: 'My Progress', description: 'Track your fitness journey', onClick: () => navigate('/progress') },
                    ].map((item, index) => (
                        <motion.button 
                            key={index} 
                            className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:bg-orange-50 transition-colors"
                            onClick={item.onClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {React.cloneElement(item.icon, { className: "text-orange-500 mb-2" })}
                            <span className="text-sm font-medium mb-1">{item.label}</span>
                            <span className="text-xs text-gray-500 text-center">{item.description}</span>
                        </motion.button>
                    ))}
                </motion.div>

                <section className="mb-12">
    <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Suggested Buddies</h2>
        <button 
            onClick={() => navigate('/all-buddies')} 
            className="text-orange-500 font-medium hover:text-orange-600 transition-colors duration-300"
        >
            View All
        </button>
    </div>
    {buddyFetchError ? (
        <p className="text-red-500">{buddyFetchError}</p>
    ) : matchedBuddies.length === 0 ? (
        <p className="text-gray-600">No matching buddies found. Try expanding your search criteria.</p>
    ) : (
        <div className="flex space-x-6 overflow-x-auto pb-6 -mx-4 px-4">
            {matchedBuddies.map((buddy) => (
                <div key={buddy.id} className="flex-shrink-0">
                    {renderBuddyCard(buddy)}
                </div>
            ))}
        </div>
    )}
</section>
<section className="mb-12">
    <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
        <button 
            onClick={() => navigate('/all-events')} 
            className="text-orange-500 font-medium hover:text-orange-600 transition-colors duration-300"
        >
            View All
        </button>
    </div>
    {upcomingEvents.length === 0 ? (
        <p className="text-gray-600">No upcoming events found.</p>
    ) : (
        <div className="flex space-x-6 overflow-x-auto pb-6 -mx-4 px-4">
            {upcomingEvents.map((event) => (
                <div key={event.id} className="flex-shrink-0">
                    {renderEventCard(event)}
                </div>
            ))}
        </div>
    )}
</section>

<section className="mb-12">
    <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Featured Trainers</h2>
        <button 
            onClick={() => navigate('/all-trainers')} 
            className="text-orange-500 font-medium hover:text-orange-600 transition-colors duration-300"
        >
            View All
        </button>
    </div>
    {featuredTrainers.length === 0 ? (
        <p className="text-gray-600">No featured trainers found.</p>
    ) : (
        <div className="flex space-x-6 overflow-x-auto pb-6 -mx-4 px-4">
            {featuredTrainers.map((trainer) => (
                <div key={trainer.id} className="flex-shrink-0">
                    {renderTrainerCard(trainer)}
                </div>
            ))}
        </div>
    )}
</section>
            </main>

            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <UserMenu isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} setIsAuthenticated={setIsAuthenticated} currentUser={currentUser} />
        </div>
    );
};

export default Dashboard;