import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Calendar, Dumbbell, Trophy, TrendingUp, Target, Heart } from 'lucide-react';

const UserProgress = () => {
  const navigate = useNavigate();

  // Mock data - in a real app, this would come from an API or props
  const progressData = {
    buddies: 15,
    eventsAttended: 8,
    upcomingEvents: 3,
    classesBooked: 20,
    workoutsCompleted: 50,
    caloriesBurned: 12500,
    streakDays: 14,
    trophiesEarned: 5
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
        <MetricCard icon={<Dumbbell className="text-red-500" />} title="Classes Booked" value={progressData.classesBooked} />
        <MetricCard icon={<TrendingUp className="text-indigo-500" />} title="Workouts Completed" value={progressData.workoutsCompleted} />
        <MetricCard icon={<Target className="text-pink-500" />} title="Calories Burned" value={progressData.caloriesBurned} suffix="kcal" />
      </div>

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
        <p className="text-sm text-gray-600">5 more to reach the next level!</p>
      </div>
    </div>
  );
};

export default UserProgress;