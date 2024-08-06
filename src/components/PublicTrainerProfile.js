import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Award, Clock, Calendar, DollarSign, Heart, Send, ChevronRight } from 'lucide-react';
import { supabase } from '../utils/supabase';
import TrainerReviewsSection from './TrainerReviewsSection';
import TrainerClassCalendar from './TrainerClassCalendar';
import { format } from 'date-fns';

const PublicTrainerProfile = ({ trainerId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [userBookings, setUserBookings] = useState([]);
  const [isClassSelected, setIsClassSelected] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (id) {
      fetchTrainerData();
      fetchRatingsAndReviews();
      fetchLikesCount();
    }
  }, [id]);

  useEffect(() => {
    if (currentUser && id) {
      checkIfFavorite();
      fetchUserBookings();
    }
  }, [currentUser, id]);

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
  const checkIfFavorite = async () => {
    const { data, error } = await supabase
      .from('favorite_trainers')
      .select('*')
      .eq('user_id', currentUser.id)
      .eq('trainer_id', id)
      .maybeSingle();

    if (error) {
      console.error('Error checking favorite status:', error);
    } else {
      setIsFavorite(!!data);
    }
  };

  const toggleFavorite = async () => {
    if (!currentUser) {
      alert('You must be logged in to favorite a trainer.');
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from('favorite_trainers')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('trainer_id', id);

      if (error) {
        console.error('Error removing favorite:', error);
      } else {
        setIsFavorite(false);
        setLikesCount(prevCount => prevCount - 1);
      }
    } else {
      const { error } = await supabase
        .from('favorite_trainers')
        .insert({ user_id: currentUser.id, trainer_id: id });

      if (error) {
        console.error('Error adding favorite:', error);
      } else {
        setIsFavorite(true);
        setLikesCount(prevCount => prevCount + 1);
      }
    }
  };

  const fetchTrainerData = async () => {
    try {
      setLoading(true);
      const { data: userProfileData, error: userProfileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (userProfileError) throw userProfileError;

      const { data: trainerData, error: trainerError } = await supabase
        .from('trainers')
        .select('*')
        .eq('id', id)
        .single();

      if (trainerError) throw trainerError;

      setTrainer({ ...userProfileData, ...trainerData });
    } catch (error) {
      console.error('Error fetching trainer data:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchRatingsAndReviews = async () => {
    const { data, error } = await supabase
      .from('trainer_reviews')
      .select('rating')
      .eq('trainer_id', id);

    if (error) {
      console.error('Error fetching ratings:', error);
    } else {
      const totalRating = data.reduce((sum, review) => sum + review.rating, 0);
      setAverageRating(totalRating / data.length || 0);
      setTotalReviews(data.length);
    }

    if (currentUser) {
      const { data: userReview, error: userReviewError } = await supabase
        .from('trainer_reviews')
        .select('rating, review_text')
        .eq('trainer_id', id)
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
      .from('favorite_trainers')
      .select('*', { count: 'exact' })
      .eq('trainer_id', id);

    if (error) {
      console.error('Error fetching likes count:', error);
    } else {
      setLikesCount(count);
    }
  };

  const fetchUserBookings = async () => {
    const { data, error } = await supabase
      .from('class_attendees')
      .select('class_id')
      .eq('user_id', currentUser.id);

    if (error) {
      console.error('Error fetching user bookings:', error);
    } else {
      setUserBookings(data.map(booking => booking.class_id));
    }
  };

  const handleRatingSubmit = async () => {
    if (!currentUser) {
      alert('You must be logged in to submit a review.');
      return;
    }
  
    try {
      const { data, error } = await supabase
        .from('trainer_reviews')
        .upsert({
          reviewer_id: currentUser.id,
          trainer_id: id,
          rating: userRating,
          review_text: userReview
        }, { 
          onConflict: 'reviewer_id,trainer_id',
          returning: 'minimal'
        });
  
      if (error) throw error;
  
      alert('Review submitted successfully!');
      fetchRatingsAndReviews();
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.code === '23505') {
        alert('You have already submitted a review for this trainer. Your review has been updated.');
      } else {
        alert('Failed to submit review. Please try again.');
      }
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

  const renderTabs = () => {
    return (
      <div className="flex border-b">
        {['about', 'reviews', 'classes'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? 'text-orange-500 border-b-2 border-orange-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    return (
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(-${['about', 'reviews', 'classes'].indexOf(activeTab) * 100}%)`,
            display: isClassSelected && activeTab !== 'classes' ? 'none' : 'flex'
          }}
        >
          <div className="w-full flex-shrink-0">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-4">About Me</h2>
              <p className="text-gray-600">{trainer.bio}</p>
            </div>

            <div className="p-8 border-t border-gray-200">
              <h2 className="text-2xl font-semibold mb-4">Specialties</h2>
              <div className="flex flex-wrap">
                {trainer.specialties?.map((specialty, index) => (
                  <span key={index} className="bg-orange-100 text-orange-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-8 border-t border-gray-200">
              <h2 className="text-2xl font-semibold mb-4">Experience & Certifications</h2>
              <div className="flex items-center mb-4">
                <Clock size={20} className="text-gray-400 mr-2" />
                <span>{trainer.experience} years of experience</span>
              </div>
              <div className="flex flex-wrap">
                {trainer.certifications?.map((cert, index) => (
                  <div key={index} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
                    <Award size={16} className="mr-1" />
                    {cert}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Availability & Pricing</h2>
                <span className="text-2xl font-bold text-orange-500">${trainer.hourly_rate}/hour</span>
              </div>
              <div className="flex flex-wrap">
                {trainer.availability?.map((day, index) => (
                  <span key={index} className="bg-green-100 text-green-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full flex-shrink-0">
            <div className="p-8">
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
              
              <TrainerReviewsSection trainerId={id} />
            </div>
          </div>

          <div className="w-full flex-shrink-0">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Available Classes</h2>
              <TrainerClassCalendar 
                trainerId={id} 
                userBookings={userBookings} 
                onBookingChange={fetchUserBookings}
                onClassSelect={setIsClassSelected}
              />
            </div>
          </div>
        </div>
        {isClassSelected && activeTab !== 'classes' && (
          <div className="w-full">
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-4">Available Classes</h2>
              <TrainerClassCalendar 
                trainerId={id} 
                userBookings={userBookings} 
                onBookingChange={fetchUserBookings}
                onClassSelect={setIsClassSelected}
              />
              </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (!trainer) return <div>Trainer not found</div>;

  const age = calculateAge(trainer.dob);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button 
        onClick={() => navigate('/dashboard')} 
        className="text-orange-500 font-medium mb-4 flex items-center"
      >
        <ChevronRight size={20} className="mr-1" />
        Back to Dashboard
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8 flex items-start">
          <img 
            className="w-64 h-64 object-cover rounded-lg mr-8 flex-shrink-0" 
            src={`${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/profile_images/${trainer.image_url}`} 
            alt={trainer.name} 
          />
          <div className="flex flex-col justify-center">
            <div className="uppercase tracking-wide text-sm text-orange-500 font-semibold">Personal Trainer</div>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">{trainer.name}</h1>
            <p className="mt-2 text-l text-gray-600">{age} years old</p>
            <div className="flex items-center mt-2">
              <MapPin size={20} className="text-gray-400 mr-2" />
              <span>{trainer.location}</span>
            </div>
            <div className="flex items-center mt-2">
              <Star size={20} className="text-yellow-400 mr-2" />
              <span className="text-xl font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-gray-600 ml-1">({totalReviews} reviews)</span>
            </div>
            <div className="flex items-center mt-2">
              <button onClick={toggleFavorite} className="flex items-center text-red-500">
                <Heart size={20} className={`mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                <span className="text-xl">{likesCount} likes</span>
              </button>
            </div>
            <div className="mt-4 flex space-x-4">
              <button 
                onClick={() => setActiveTab('classes')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                View Available Classes
              </button>
              <button 
                onClick={() => navigate(`/trainer/${trainer.id}/book-session`)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Book a Session
              </button>
            </div>
          </div>
        </div>
        
        {renderTabs()}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PublicTrainerProfile;