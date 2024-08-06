import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, User, Clock, Activity, Send, Heart } from 'lucide-react';
import { supabase } from '../utils/supabase';
import BuddyReviewsSection from './BuddyReviewsSection';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/profile_images/`;

const BuddyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [buddy, setBuddy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetchCurrentUser();
    fetchBuddyData();
    checkConnectionStatus();
    fetchRatingsAndReviews();
    fetchLikesCount();
  }, [id]);

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

  const fetchBuddyData = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setBuddy(data);
    } catch (error) {
      console.error('Error fetching buddy data:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchRatingsAndReviews = async () => {
    const { data, error } = await supabase
      .from('buddy_reviews')
      .select('rating')
      .eq('buddy_id', id);

    if (error) {
      console.error('Error fetching ratings:', error);
    } else {
      const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating(totalRating / data.length || 0);
      setTotalReviews(data.length);
    }

    // Check if the current user has already reviewed this buddy
    if (currentUser) {
      const { data: userReview, error: userReviewError } = await supabase
        .from('buddy_reviews')
        .select('rating, review_text')
        .eq('buddy_id', id)
        .eq('reviewer_id', currentUser.id)
        .single();

      if (userReview) {
        setUserRating(userReview.rating);
        setUserReview(userReview.review_text || '');
      }
    }
  };

  const fetchLikesCount = async () => {
    const { count, error } = await supabase
      .from('favorite_buddies')
      .select('*', { count: 'exact' })
      .eq('buddy_id', id);

    if (error) {
      console.error('Error fetching likes count:', error);
    } else {
      setLikesCount(count);
    }
  };

  const handleRatingSubmit = async () => {
    if (!currentUser) {
      alert('You must be logged in to submit a review.');
      return;
    }

    const { data, error } = await supabase
      .from('buddy_reviews')
      .upsert({
        reviewer_id: currentUser.id,
        buddy_id: id,
        rating: userRating,
        review_text: userReview
      }, { onConflict: ['reviewer_id', 'buddy_id'] });

    if (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } else {
      alert('Review submitted successfully!');
      fetchRatingsAndReviews();
      setShowReviewForm(false);
    }
  };

  const renderStars = (rating, interactive = false) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={interactive ? 32 : 24}
          className={`${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          } ${interactive ? 'cursor-pointer' : ''}`}
          onClick={() => interactive && setUserRating(star)}
        />
      ))}
    </div>
  );

  const checkConnectionStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('buddy_connections')
        .select('status')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq(user.id === id ? 'sender_id' : 'receiver_id', id)
        .single();

      if (error) {
        console.error('Error checking connection status:', error);
      } else if (data) {
        setConnectionStatus(data.status);
      }
    }
  };
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

  const handleConnect = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('buddy_connections')
        .insert({
          sender_id: user.id,
          receiver_id: id,
          status: 'pending'
        });

      if (error) {
        console.error('Error sending connection request:', error);
        alert('Failed to send connection request. Please try again.');
      } else {
        setConnectionStatus('pending');
        alert('Connection request sent!');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!buddy) {
    return <div>Buddy not found</div>;
  }

  const age = calculateAge(buddy.dob);
  const distance = currentUser ? calculateDistance(
    currentUser.latitude,
    currentUser.longitude,
    buddy.latitude,
    buddy.longitude
  ) : 'N/A';

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={() => navigate(-1)} className="mb-4 text-orange-500 font-medium">
        ← Back to Find Buddy
      </button>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img 
              className="h-full w-full object-cover" 
              src={getImageUrl(buddy.image_url)} 
              alt={buddy.name}
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = 'https://via.placeholder.com/150'
              }}
            />
          </div>
          <div className="md:w-2/3 p-6">
            <div className="uppercase tracking-wide text-sm text-orange-500 font-semibold mb-2">
              {buddy.fitness_level || 'N/A'} LEVEL
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{buddy.name}</h1>
            <p className="text-xl text-gray-600 mb-4">{age} years old</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center">
                <User className="text-gray-400 mr-2" size={20} />
                <span className="text-gray-700">{buddy.gender || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="text-gray-400 mr-2" size={20} />
                <span className="text-gray-700">{distance} km away</span>
              </div>
              <div className="flex items-center">
                {renderStars(averageRating)}
                <span className="ml-2 text-sm text-gray-500">({totalReviews} reviews)</span>
              </div>
              <div className="flex items-center">
                <Heart className="text-red-500 mr-2" size={20} />
                <span className="text-gray-700">{likesCount} likes</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Interests</h2>
              <div className="flex flex-wrap">
                {buddy.interests && buddy.interests.map((interest, index) => (
                  <span key={index} className="bg-orange-100 text-orange-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Availability</h2>
              <div className="flex items-center">
                <Clock className="text-gray-400 mr-2" size={20} />
                <span className="text-gray-700">{buddy.availability ? buddy.availability.join(', ') : 'N/A'}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Fitness Goals</h2>
              <ul className="list-disc list-inside text-gray-700">
                {buddy.fitness_goals && buddy.fitness_goals.map((goal, index) => (
                  <li key={index}>{goal}</li>
                ))}
              </ul>
            </div>
            
            {connectionStatus === 'accepted' ? (
              <button className="w-full bg-green-500 text-white py-3 rounded-lg cursor-not-allowed">
                Connected with {buddy.name}
              </button>
            ) : connectionStatus === 'pending' ? (
              <button className="w-full bg-yellow-500 text-white py-3 rounded-lg cursor-not-allowed">
                Connection Request Pending
              </button>
            ) : (
              <button 
                onClick={handleConnect} 
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Connect with {buddy.name}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Ratings and Reviews</h2>
        <div className="flex items-center mb-4">
          {renderStars(averageRating)}
          <span className="ml-2 text-lg font-medium">{averageRating.toFixed(1)}</span>
          <span className="ml-2 text-sm text-gray-500">({totalReviews} reviews)</span>
        </div>
        
        {!showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Write a Review
          </button>
        )}

        {showReviewForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h3 className="text-xl font-semibold mb-4">Your Review</h3>
            {renderStars(userRating, true)}
            <textarea
              className="w-full mt-4 p-2 border rounded-md"
              rows="4"
              placeholder="Write your review here (optional)"
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowReviewForm(false)}
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRatingSubmit}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
              >
                <Send size={20} className="mr-2" />
                Submit Review
              </button>
            </div>
          </div>
        )}
      </div>

      <BuddyReviewsSection buddyId={id} />
    </div>
  );
};

export default BuddyProfile;