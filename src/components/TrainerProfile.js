import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, Award, Clock, Calendar, DollarSign, Users, 
  Edit, Check, X, TrendingUp, Activity, Target, Globe 
} from 'lucide-react';
import TrainerNavigation from './TrainerNavigation';
import Navigation from './Navigation';

const TrainerProfile = ({ trainer, currentUser }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrainer, setEditedTrainer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (trainer) {
      setEditedTrainer({ ...trainer });
      setIsLoading(false);
    }
  }, [trainer]);

  if (isLoading) {
    return <div className="max-w-4xl mx-auto p-4">Loading...</div>;
  }

  if (!trainer) {
    return <div className="max-w-4xl mx-auto p-4">Trainer not found</div>;
  }

  const isOwnProfile = currentUser && currentUser.id === trainer.id;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    console.log('Saving profile changes:', editedTrainer);
    // Here you would typically send the updated data to your backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTrainer({ ...trainer });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTrainer(prev => {
      if (name.includes('.')) {
        const [objName, key] = name.split('.');
        return { ...prev, [objName]: { ...prev[objName], [key]: value } };
      }
      return { ...prev, [name]: value };
    });
  };

  const renderStatCard = (icon, title, value, suffix = '') => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-lg font-semibold ml-2">{title}</h3>
      </div>
      <p className="text-2xl font-bold text-orange-500">
        {value !== undefined ? `${value}${suffix}` : 'N/A'}
      </p>
    </div>
  );

  const renderEditableField = (label, name, value, type = 'text') => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={handleChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
      />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 pb-16">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <button
            onClick={() => navigate('/trainer-dashboard')}
            className="text-orange-500 hover:text-orange-600 transition-colors text-sm"
          >
            Back to Dashboard
          </button>
        </div>
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src={trainer.image} alt={trainer.name} />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-orange-500 font-semibold">Personal Trainer</div>
            {isEditing ? renderEditableField("Name", "name", editedTrainer.name) : (
              <h1 className="mt-1 text-3xl font-semibold text-gray-900">{trainer.name}</h1>
            )}
            <p className="mt-2 text-gray-600">{trainer.age} years old</p>
            <div className="flex items-center mt-2">
              <MapPin size={20} className="text-gray-400 mr-2" />
              {isEditing ? renderEditableField("Location", "location", editedTrainer.location) : (
                <span>{trainer.location}</span>
              )}
            </div>
            <div className="flex items-center mt-2">
              <Star size={20} className="text-yellow-400 mr-2" />
              <span className="font-semibold">{trainer.rating}</span>
              <span className="text-gray-600 ml-1">({trainer.reviews} reviews)</span>
            </div>
            <div className="flex items-center mt-2">
              <Heart size={20} className="text-red-500 mr-2" />
              <span className="font-semibold">{trainer.likes || 0} likes</span>
            </div>
            {!isOwnProfile && (
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => navigate(`/trainer-classes/${trainer.id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  View Available Classes
                </button>
                <button
                  onClick={() => navigate(`/book-session/${trainer.id}`)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                >
                  Book a Session
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">About Me</h2>
          {isEditing ? (
            <textarea
              name="bio"
              value={editedTrainer.bio || ''}
              onChange={handleChange}
              className="w-full h-32 p-2 border rounded"
            />
          ) : (
            <p className="text-gray-600">{trainer.bio}</p>
          )}
        </div>

        <div className="p-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Specialties</h2>
          <div className="flex flex-wrap">
            {(isEditing ? editedTrainer.specialties : trainer.specialties)?.map((specialty, index) => (
              <span key={index} className="bg-orange-100 text-orange-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
                {specialty}
              </span>
            ))}
          </div>
          {isEditing && (
            <input
              type="text"
              name="newSpecialty"
              placeholder="Add new specialty"
              className="mt-2 w-full p-2 border rounded"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setEditedTrainer(prev => ({
                    ...prev,
                    specialties: [...(prev.specialties || []), e.target.value]
                  }));
                  e.target.value = '';
                }
              }}
            />
          )}
        </div>

        <div className="p-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Experience & Certifications</h2>
          <div className="flex items-center mb-4">
            <Clock size={20} className="text-gray-400 mr-2" />
            {isEditing ? renderEditableField("Experience", "experience", editedTrainer.experience) : (
              <span>{trainer.experience} of experience</span>
            )}
          </div>
          <div className="flex flex-wrap">
            {(isEditing ? editedTrainer.certifications : trainer.certifications)?.map((cert, index) => (
              <div key={index} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
                <Award size={16} className="mr-1" />
                {cert}
              </div>
            ))}
          </div>
          {isEditing && (
            <input
              type="text"
              name="newCertification"
              placeholder="Add new certification"
              className="mt-2 w-full p-2 border rounded"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setEditedTrainer(prev => ({
                    ...prev,
                    certifications: [...(prev.certifications || []), e.target.value]
                  }));
                  e.target.value = '';
                }
              }}
            />
          )}
        </div>

        <div className="p-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Availability & Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Available Days</h3>
              <div className="flex flex-wrap">
                {(isEditing ? editedTrainer.availableDays : trainer.availableDays)?.map((day, index) => (
                  <span key={index} className="bg-green-100 text-green-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
                    {day}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Pricing</h3>
              <div className="flex items-center">
                <DollarSign size={20} className="text-gray-400 mr-2" />
                {isEditing ? renderEditableField("Hourly Rate", "hourlyRate", editedTrainer.hourlyRate, "number") : (
                  <span>${trainer.hourlyRate}/hour</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {isOwnProfile && (
          <div className="p-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Trainer Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderStatCard(<Users className="text-blue-500" size={24} />, "Total Clients", trainer.stats?.totalClients)}
              {renderStatCard(<Users className="text-green-500" size={24} />, "Active Clients", trainer.stats?.activeClients)}
              {renderStatCard(<Activity className="text-purple-500" size={24} />, "Classes Completed", trainer.stats?.classesCompleted)}
              {renderStatCard(<Globe className="text-indigo-500" size={24} />, "Online Sessions", trainer.stats?.onlineSessionsCompleted)}
              {renderStatCard(<MapPin className="text-red-500" size={24} />, "In-Person Sessions", trainer.stats?.inPersonSessionsCompleted)}
              {renderStatCard(<Clock className="text-yellow-500" size={24} />, "Total Hours Worked", trainer.stats?.totalHoursWorked)}
              {renderStatCard(<Clock className="text-pink-500" size={24} />, "Avg Session Duration", trainer.stats?.avgSessionDuration, " min")}
              {renderStatCard(<Users className="text-teal-500" size={24} />, "Client Retention Rate", trainer.stats?.clientRetentionRate, "%")}
              {renderStatCard(<Target className="text-orange-500" size={24} />, "Client Goals Achieved", trainer.stats?.clientGoalsAchieved, "%")}
              {renderStatCard(<Star className="text-yellow-500" size={24} />, "Top Class", trainer.stats?.topPerformingClass)}
              {renderStatCard(<DollarSign className="text-green-500" size={24} />, "Monthly Earnings", trainer.stats?.monthlyEarnings, "$")}
              {renderStatCard(<DollarSign className="text-blue-500" size={24} />, "YTD Earnings", trainer.stats?.yearToDateEarnings, "$")}
              {renderStatCard(<Calendar className="text-purple-500" size={24} />, "Upcoming Sessions", trainer.stats?.upcomingSessions)}
              {renderStatCard(<TrendingUp className="text-red-500" size={24} />, "Last Month Growth", trainer.stats?.lastMonthGrowth, "%")}
            </div>
          </div>
        )}

        {isOwnProfile && (
          <div className="p-8 border-t border-gray-200">
            {isEditing ? (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors flex items-center"
                >
                  <X size={20} className="mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                >
                  <Check size={20} className="mr-2" />
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={handleEdit}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
              >
                <Edit size={20} className="mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        )}
      </div>

      {currentUser.role === 'trainer' ? (
        <TrainerNavigation activeTab="profile" />
      ) : (
        <Navigation activeTab="trainers" />
      )}
    </div>
  );
};

export default TrainerProfile;
