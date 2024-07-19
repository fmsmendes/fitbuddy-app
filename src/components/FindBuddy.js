import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Filter } from 'lucide-react';

const FindBuddy = ({ buddies }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [ageRange, setAgeRange] = useState([18, 65]);
  const [maxDistance, setMaxDistance] = useState(50);
  const [gender, setGender] = useState('');
  const [availability, setAvailability] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const buddiesPerPage = 8;

  const allInterests = [...new Set(buddies.flatMap(buddy => buddy.interests))];

  const filteredBuddies = buddies.filter(buddy => 
    buddy.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterLevel === '' || buddy.level === filterLevel) &&
    buddy.age >= ageRange[0] && buddy.age <= ageRange[1] &&
    buddy.distance <= maxDistance &&
    (gender === '' || buddy.gender === gender) &&
    (availability.length === 0 || availability.some(time => buddy.availability.includes(time))) &&
    (selectedInterests.length === 0 || selectedInterests.every(interest => buddy.interests.includes(interest)))
  );

  const indexOfLastBuddy = currentPage * buddiesPerPage;
  const indexOfFirstBuddy = indexOfLastBuddy - buddiesPerPage;
  const currentBuddies = filteredBuddies.slice(indexOfFirstBuddy, indexOfLastBuddy);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const renderRating = (rating, reviews) => (
    <div className="flex items-center">
      <div className="flex items-center mr-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} />
        ))}
      </div>
      <span className="text-sm text-gray-600">{rating.toFixed(1)} ({reviews} reviews)</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Find a Buddy</h1>
        <button onClick={() => navigate(-1)} className="text-orange-500 font-medium hover:text-orange-600 transition-colors">
          Back to Dashboard
        </button>
      </div>

      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="relative flex-grow mr-4">
            <input
              type="text"
              placeholder="Search buddies..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
          >
            <Filter size={20} className="mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <select
                className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Any Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability:</label>
                <div className="flex space-x-4">
                  {['Morning', 'Afternoon', 'Evening'].map(time => (
                    <label key={time} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox text-orange-500 focus:ring-orange-500"
                        checked={availability.includes(time)}
                        onChange={() => {
                          if (availability.includes(time)) {
                            setAvailability(availability.filter(t => t !== time));
                          } else {
                            setAvailability([...availability, time]);
                          }
                        }}
                      />
                      <span className="ml-2 text-sm text-gray-700">{time}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Range: {ageRange[0]} - {ageRange[1]}</label>
                <input
                  type="range"
                  min="18"
                  max="65"
                  step="1"
                  value={ageRange[1]}
                  onChange={(e) => setAgeRange([ageRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Distance: {maxDistance} km</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interests:</label>
              <select
                multiple
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={selectedInterests}
                onChange={(e) => setSelectedInterests(Array.from(e.target.selectedOptions, option => option.value))}
              >
                {allInterests.map(interest => (
                  <option key={interest} value={interest}>{interest}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentBuddies.map(buddy => (
          <div key={buddy.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img src={buddy.image} alt={buddy.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-800">{buddy.name} <span className="text-sm font-normal text-gray-500">{buddy.age}</span></h3>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin size={14} className="mr-1" /> {buddy.distance} km away
              </div>
              {renderRating(buddy.rating, buddy.reviews)}
              <p className="text-sm text-gray-700 mt-2">Fitness Level: <span className="font-medium">{buddy.level}</span></p>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Interests:</p>
                <div className="flex flex-wrap">
                  {buddy.interests.map((interest, index) => (
                    <span key={index} className="bg-orange-100 text-orange-800 text-xs font-medium mr-2 mb-2 px-2 py-1 rounded-full">{interest}</span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => navigate(`/buddy/${buddy.id}`)}
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors mt-4"
              >
                Connect
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBuddies.length > buddiesPerPage && (
        <div className="mt-8 flex justify-center">
          {[...Array(Math.ceil(filteredBuddies.length / buddiesPerPage))].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 hover:bg-orange-200'} transition-colors`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindBuddy;