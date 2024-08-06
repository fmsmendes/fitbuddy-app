import React, { useState, useEffect } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../utils/supabase';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/profile_images/`;

const BuddyReviewsSection = ({ buddyId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [buddyId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('buddy_reviews')
        .select(`
          id,
          rating,
          review_text,
          created_at,
          reviewer:reviewer_id (name, image_url)
        `)
        .eq('buddy_id', buddyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={`${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/40';
    if (imagePath.startsWith('http')) return imagePath;
    return `${STORAGE_URL}${imagePath}`;
  };

  if (loading) return <div className="text-center py-4">Loading reviews...</div>;
  if (error) return <div className="text-center text-red-500 py-4">{error}</div>;

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-semibold mb-4">User Reviews</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet.</p>
      ) : (
        <>
          <div className="space-y-6">
            {displayedReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <img
                      src={getProfileImageUrl(review.reviewer.image_url)}
                      alt={review.reviewer.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <p className="font-semibold">{review.reviewer.name}</p>
                      <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-700">{review.review_text}</p>
              </div>
            ))}
          </div>
          {reviews.length > 3 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="mt-4 flex items-center text-orange-500 hover:text-orange-600 transition-colors"
            >
              {showAllReviews ? (
                <>
                  <ChevronUp size={20} className="mr-1" />
                  Show less
                </>
              ) : (
                <>
                  <ChevronDown size={20} className="mr-1" />
                  Show all {reviews.length} reviews
                </>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default BuddyReviewsSection;