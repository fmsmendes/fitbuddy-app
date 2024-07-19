import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, Filter, X } from 'lucide-react';

const TrainersPage = ({ trainers }) => {
  const navigate = useNavigate();
  const [filteredTrainers, setFilteredTrainers] = useState(trainers);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    maxDistance: 50,
    minAge: 18,
    maxAge: 65,
    minExperience: 0,
    minRating: 0,
    specialties: [],
    availableDays: [],
  });

  useEffect(() => {
    const filtered = trainers.filter(trainer => {
      return (
        trainer.distance <= filters.maxDistance &&
        trainer.age >= filters.minAge &&
        trainer.age <= filters.maxAge &&
        parseInt(trainer.experience) >= filters.minExperience &&
        trainer.rating >= filters.minRating &&
        (filters.specialties.length === 0 || filters.specialties.some(specialty => trainer.specialties.includes(specialty))) &&
        (filters.availableDays.length === 0 || filters.availableDays.some(day => trainer.availableDays.includes(day)))
      );
    });
    setFilteredTrainers(filtered);
  }, [filters, trainers]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const renderRating = (rating) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );

  const allSpecialties = [...new Set(trainers.flatMap(trainer => trainer.specialties))];
  const allAvailableDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Personal Trainers</h1>
        <button onClick={() => navigate('/')} className="text-orange-500 font-medium">
          Back to Dashboard
        </button>
      </div>
      <div className="flex">
        <div className={`w-64 bg-white p-4 rounded-lg shadow-md mr-4 ${showFilters ? 'block' : 'hidden'} md:block`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button onClick={() => setShowFilters(false)} className="md:hidden">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Distance: {filters.maxDistance} km</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.maxDistance}
                onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Range: {filters.minAge} - {filters.maxAge}</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="18"
                  max="65"
                  value={filters.minAge}
                  onChange={(e) => handleFilterChange('minAge', parseInt(e.target.value))}
                  className="w-1/2 p-2 border rounded-md"
                />
                <span>-</span>
                <input
                  type="number"
                  min="18"
                  max="65"
                  value={filters.maxAge}
                  onChange={(e) => handleFilterChange('maxAge', parseInt(e.target.value))}
                  className="w-1/2 p-2 border rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min. Years of Experience: {filters.minExperience}</label>
              <input
                type="range"
                min="0"
                max="20"
                value={filters.minExperience}
                onChange={(e) => handleFilterChange('minExperience', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min. Rating: {filters.minRating}</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
              <div className="space-y-2">
                {allSpecialties.map(specialty => (
                  <label key={specialty} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.specialties.includes(specialty)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange('specialties', [...filters.specialties, specialty]);
                        } else {
                          handleFilterChange('specialties', filters.specialties.filter(s => s !== specialty));
                        }
                      }}
                      className="mr-2"
                    />
                    {specialty}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <div className="space-y-2">
                {allAvailableDays.map(day => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.availableDays.includes(day)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange('availableDays', [...filters.availableDays, day]);
                        } else {
                          handleFilterChange('availableDays', filters.availableDays.filter(d => d !== day));
                        }
                      }}
                      className="mr-2"
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg flex items-center justify-center"
            >
              <Filter size={20} className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrainers.map(trainer => (
              <div key={trainer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={trainer.image} alt={trainer.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{trainer.name}</h2>
                  <p className="text-gray-600 mb-2">{trainer.age} years old</p>
                  <div className="flex items-center mb-2">
                    <MapPin size={16} className="text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{trainer.distance} km away</span>
                  </div>
                  {renderRating(trainer.rating)}
                  <p className="text-sm text-gray-600 mb-2">{trainer.reviews} reviews</p>
                  <p className="text-sm text-gray-600 mb-2">{trainer.experience} experience</p>
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700">Specialties:</p>
                    <div className="flex flex-wrap">
                      {trainer.specialties.map((specialty, index) => (
                        <span key={index} className="bg-orange-100 text-orange-800 text-xs font-medium mr-1 mb-1 px-2 py-0.5 rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700">Certifications:</p>
                    <div className="flex flex-wrap">
                      {trainer.certifications.map((cert, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium mr-1 mb-1 px-2 py-0.5 rounded-full">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700">Available Days:</p>
                    <div className="flex flex-wrap">
                      {trainer.availableDays.map((day, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs font-medium mr-1 mb-1 px-2 py-0.5 rounded-full">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/trainer/${trainer.id}`)}
                    className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainersPage;