import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Activity, ArrowLeft } from 'lucide-react';

const ScheduleWorkout = ({ buddies }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [workoutDetails, setWorkoutDetails] = useState({
    date: '',
    time: '',
    location: '',
    type: '',
  });

  const buddy = buddies.find(b => b.id === parseInt(id));

  if (!buddy) {
    return <div>Buddy not found</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkoutDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the workout details to your backend
    console.log('Scheduling workout:', workoutDetails);
    alert('Workout scheduled successfully!');
    navigate('/buddies');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/buddies')}
          className="flex items-center text-orange-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Buddies
        </button>
        <h1 className="text-2xl font-bold">Schedule Workout with {buddy.name}</h1>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <img src={buddy.image} alt={buddy.name} className="w-16 h-16 rounded-full mr-4" />
          <div>
            <h2 className="text-xl font-semibold">{buddy.name}</h2>
            <p className="text-sm text-gray-600">{buddy.distance} km away</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="date"
                id="date"
                required
                className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                value={workoutDetails.date}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="time"
                name="time"
                id="time"
                required
                className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                value={workoutDetails.time}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="location"
                id="location"
                required
                className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter location"
                value={workoutDetails.location}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Workout Type</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <select
                name="type"
                id="type"
                required
                className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                value={workoutDetails.type}
                onChange={handleChange}
              >
                <option value="">Select workout type</option>
                <option value="running">Running</option>
                <option value="cycling">Cycling</option>
                <option value="yoga">Yoga</option>
                <option value="weightlifting">Weightlifting</option>
                <option value="swimming">Swimming</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Schedule Workout
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleWorkout;
