import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Dumbbell, Trophy, TrendingUp, Target, Heart } from 'lucide-react';
import { supabase } from '../utils/supabase';

const UserProgress = () => {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserProgress();
  }, []);

  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const [
        buddiesCount,
        eventsAttended,
        upcomingEvents,
        workoutsCompleted,
        reviewsReceived,
        favoriteBuddies,
      ] = await Promise.all([
        fetchBuddiesCount(user.id),
        fetchEventsAttended(user.id),
        fetchUpcomingEvents(user.id),
        fetchWorkoutsCompleted(user.id),
        fetchReviewsReceived(user.id),
        fetchFavoriteBuddiesCount(user.id),
      ]);

      setProgressData({
        buddies: buddiesCount,
        eventsAttended,
        upcomingEvents,
        workoutsCompleted,
        reviewsReceived,
        favoriteBuddies,
        streakDays: 0, // Placeholder, implement if you have this data
        trophiesEarned: 0, // Placeholder, implement if you have this data
      });
    } catch (error) {
      console.error('Error fetching user progress:', error);
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  const fetchBuddiesCount = async (userId) => {
    const { count, error } = await supabase
      .from('buddy_connections')
      .select('*', { count: 'exact' })
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (error) throw error;
    return count;
  };

  const fetchEventsAttended = async (userId) => {
    const { count, error } = await supabase
      .from('event_attendees')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('status', 'confirmed');

    if (error) throw error;
    return count;
  };

  const fetchUpcomingEvents = async (userId) => {
    const { count, error } = await supabase
      .from('event_attendees')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('status', 'confirmed')
      .gte('created_at', new Date().toISOString());

    if (error) throw error;
    return count;
  };

  const fetchWorkoutsCompleted = async (userId) => {
    const { count, error } = await supabase
      .from('workout_participants')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('status', 'completed');

    if (error) throw error;
    return count;
  };

  const fetchReviewsReceived = async (userId) => {
    const { count, error } = await supabase
      .from('buddy_reviews')
      .select('*', { count: 'exact' })
      .eq('buddy_id', userId);

    if (error) throw error;
    return count;
  };

  const fetchFavoriteBuddiesCount = async (userId) => {
    const { count, error } = await supabase
      .from('favorite_buddies')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    if (error) throw error;
    return count;
  };

  const ProgressBar = ({ value, max }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${(value / max) * 100}%` }}></div>
    </div>
  );

  const MetricCard = ({ icon, title, value, suffix = '' }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-lg font-semibold ml-2">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-orange-500">{value}{suffix}</p>
    </div>
  );

  if (loading) return <div className="text-center mt-8">Loading progress data...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!progressData) return <div className="text-center mt-8">No progress data available</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Progress</h1>
        <button onClick={() => navigate(-1)} className="text-orange-500 font-medium">
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <MetricCard icon={<Users className="text-blue-500" />} title="Buddies" value={progressData.buddies} />
        <MetricCard icon={<Calendar className="text-green-500" />} title="Events Attended" value={progressData.eventsAttended} />
        <MetricCard icon={<Calendar className="text-purple-500" />} title="Upcoming Events" value={progressData.upcomingEvents} />
        <MetricCard icon={<Dumbbell className="text-red-500" />} title="Workouts Completed" value={progressData.workoutsCompleted} />
        <MetricCard icon={<TrendingUp className="text-indigo-500" />} title="Reviews Received" value={progressData.reviewsReceived} />
        <MetricCard icon={<Heart className="text-pink-500" />} title="Favorite Buddies" value={progressData.favoriteBuddies} />
      </div>

      {/* Note: Streak and Trophies sections are kept as placeholders.
           Implement these if you have the corresponding data in your database. */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Streak</h2>
        <div className="flex items-center">
          <Heart className="text-red-500 mr-2" size={32} />
          <div>
            <p className="text-3xl font-bold text-orange-500">{progressData.streakDays} days</p>
            <p className="text-sm text-gray-600">Keep it up!</p>
          </div>
        </div>
        <ProgressBar value={progressData.streakDays} max={30} />
        <p className="text-sm text-gray-600">Goal: 30 day streak</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Achievements</h2>
        <div className="flex items-center">
          <Trophy className="text-yellow-500 mr-2" size={32} />
          <div>
            <p className="text-3xl font-bold text-orange-500">{progressData.trophiesEarned}</p>
            <p className="text-sm text-gray-600">Trophies Earned</p>
          </div>
        </div>
        <ProgressBar value={progressData.trophiesEarned} max={10} />
        <p className="text-sm text-gray-600">{10 - progressData.trophiesEarned} more to reach the next level!</p>
      </div>
    </div>
  );
};

export default UserProgress;