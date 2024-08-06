import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Award, Clock, Sliders } from 'lucide-react';
import { supabase } from '../utils/supabase';
import ReactSlider from 'react-slider';

const DumbbellLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <svg width="100" height="100" viewBox="0 0 100 100" className="animate-bounce">
      <rect x="17.5" y="30" width="65" height="10" rx="5" fill="#f97316" />
      <circle cx="15" cy="35" r="15" fill="#f97316" />
      <circle cx="85" cy="35" r="15" fill="#f97316" />
    </svg>
  </div>
);

const AllTrainersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [trainersPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });

  // Enhanced filters
  const [filters, setFilters] = useState({
    experience: '',
    specialties: [],
    minRating: 0,
    distance: 50,
    ageRange: [18, 65],
    availability: [],
    gender: '',
  });

  useEffect(() => {
    console.log('Component mounted');
    getUserLocation();
    // fetchTrainers will be called from getUserLocation
  }, []);

  const FALLBACK_LOCATION = { latitude: -28.016666, longitude: 153.399994 }; // Gold Coast, Australia

  const getUserLocation = () => {
    console.log('Getting user location');
    if (navigator.geolocation) {
      const locationTimeout = setTimeout(() => {
        console.log('Geolocation timed out');
        setUserLocation(FALLBACK_LOCATION);
        setError("Unable to get your location. Using default location.");
        fetchTrainers(); // Fetch trainers with fallback location
      }, 10000); // 10 second timeout

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(locationTimeout);
          console.log('Geolocation successful', position.coords);
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          fetchTrainers({ // Pass userLocation to fetchTrainers
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          clearTimeout(locationTimeout);
          console.error("Error getting user location:", error);
          setUserLocation(FALLBACK_LOCATION);
          setError("Unable to get your location. Using default location.");
          fetchTrainers(); // Fetch trainers with fallback location
        },
        { timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation(FALLBACK_LOCATION);
      setError("Geolocation is not supported. Using default location.");
      fetchTrainers(); // Fetch trainers with fallback location
    }
  };

  const fetchTrainers = async (location) => {
    console.log('Fetching trainers');
    try {
      setLoading(true);
      const { data: userProfiles, error: userProfilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'trainer');

      if (userProfilesError) throw userProfilesError;

      console.log('Fetched user profiles:', userProfiles);

      const trainerIds = userProfiles.map(profile => profile.id);

      const { data: trainerData, error: trainerDataError } = await supabase
        .from('trainers')
        .select('*')
        .in('id', trainerIds);

      if (trainerDataError) throw trainerDataError;

      console.log('Fetched trainer data:', trainerData);

      const enrichedTrainers = userProfiles.map(profile => {
        const trainerInfo = trainerData.find(t => t.id === profile.id) || {};
        return {
          id: profile.id,
          name: profile.name,
          age: calculateAge(profile.dob),
          image_url: profile.image_url,
          latitude: profile.latitude,
          longitude: profile.longitude,
          experience: trainerInfo.experience || 'N/A',
          specialties: trainerInfo.specialties || [],
          certifications: trainerInfo.certifications || [],
          availability: profile.availability || [],
          hourly_rate: trainerInfo.hourly_rate || 'N/A',
          rating: trainerInfo.rating || 0,
          reviews_count: trainerInfo.reviews_count || 0,
          gender: profile.gender || 'N/A',
          distance: calculateDistance(
            profile.latitude,
            profile.longitude,
            location.latitude,
            location.longitude 
          )
        };
      });

      console.log('Enriched trainers:', enrichedTrainers);
      setTrainers(enrichedTrainers);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      setError('Failed to fetch trainers. Please try again later.');
    } finally {
      setLoading(false);
      console.log('Loading set to false');
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
    if (!lat1 || !lon1 || !lat2 || !lon2) return 'N/A';

    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return Math.round(distance * 10) / 10;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filters.experience === '' || trainer.experience >= parseInt(filters.experience)) &&
    (filters.specialties.length === 0 || filters.specialties.some(specialty => trainer.specialties.includes(specialty))) &&
    trainer.rating >= filters.minRating &&
    (trainer.distance === 'N/A' || trainer.distance <= filters.distance) &&
    trainer.age >= filters.ageRange[0] && trainer.age <= filters.ageRange[1] &&
    (filters.availability.length === 0 || filters.availability.some(day => trainer.availability.includes(day))) &&
    (filters.gender === '' || trainer.gender === filters.gender)
  );

  // Get current trainers
  const indexOfLastTrainer = currentPage * trainersPerPage;
  const indexOfFirstTrainer = indexOfLastTrainer - trainersPerPage;
  const currentTrainers = filteredTrainers.slice(indexOfFirstTrainer, indexOfLastTrainer);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  const renderRating = (rating) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );

  if (loading) return <DumbbellLoader />;

  if (error) return (
    <div className="text-center py-10">
      <p className="text-red-500 text-xl font-semibold mb-4">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  if (trainers.length === 0) return (
    <div className="text-center py-10">
      <p className="text-xl font-semibold mb-4">No trainers found. Please try again later.</p>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Trainers</h1>
        <button onClick={() => navigate('/')} className="text-orange-500 font-medium">
          Back to Dashboard
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search trainers..."
            className="w-full p-2 pl-10 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      <button
        onClick={() => setShowFilters(!showFilters)}
        className="mb-4 flex items-center bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
      >
        <Sliders size={20} className="mr-2" />
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <select
                value={filters.experience}
                onChange={(e) => setFilters({...filters, experience: e.target.value})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Experience</option>
                <option value="1">1+ years</option>
                <option value="3">3+ years</option>
                <option value="5">5+ years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => setFilters({...filters, minRating: parseFloat(e.target.value)})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="0">All Ratings</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km): {filters.distance}</label>
              <ReactSlider
                className="w-full h-4 pr-2 my-4 bg-gray-200 rounded-md cursor-pointer"
                thumbClassName="absolute w-4 h-4 cursor-pointer bg-orange-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 -top-0.5"
                trackClassName="h-1 bg-orange-500 rounded-md"
                defaultValue={50}
                value={filters.distance}
                onChange={(value) => setFilters({...filters, distance: value})}
                min={0}
                max={100}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}</label>
              <ReactSlider
                className="w-full h-4 pr-2 my-4 bg-gray-200 rounded-md cursor-pointer"
                thumbClassName="absolute w-4 h-4 cursor-pointer bg-orange-500 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 -top-0.5"
                trackClassName="h-1 bg-orange-500 rounded-md"
                defaultValue={[18, 65]}
                value={filters.ageRange}
                onChange={(value) => setFilters({...filters, ageRange: value})}
                min={18}
                max={65}
                pearling
                minDistance={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Specialties</label>
              <select
                multiple
                value={filters.specialties}
                onChange={(e) => setFilters({...filters, specialties: Array.from(e.target.selectedOptions, option => option.value)})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="Strength Training">Strength Training</option>
                <option value="Cardio">Cardio</option>
                <option value="Yoga">Yoga</option>
                <option value="Pilates">Pilates</option>
                <option value="HIIT">HIIT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select
                multiple
                value={filters.availability}
                onChange={(e) => setFilters({...filters, availability: Array.from(e.target.selectedOptions, option => option.value)})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => setFilters({...filters, gender: e.target.value})}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentTrainers.map(trainer => (
          <div key={trainer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={trainer.image_url ? `${supabase.storage.from('profile_images').getPublicUrl(trainer.image_url).data.publicUrl}` : 'https://via.placeholder.com/150'} 
              alt={trainer.name} 
              className="w-full h-48 object-cover" 
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{trainer.name}</h2>
              <p className="text-gray-600 mb-2">{trainer.age} years old</p>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin size={14} className="mr-1" /> 
                {trainer.distance !== 'N/A' 
                  ? `${trainer.distance.toFixed(1)} km away` 
                  : 'Distance unavailable'}
              </div>
              {renderRating(trainer.rating)}
              <p className="text-sm text-gray-600">({trainer.reviews_count} reviews)</p>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Experience: <span className="font-normal">{trainer.experience} years</span></p>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Specialties:</p>
                <div className="flex flex-wrap">
                  {trainer.specialties?.slice(0, 3).map((specialty, index) => (
                    <span key={index} className="bg-orange-100 text-orange-800 text-xs font-medium mr-2 mb-2 px-2 py-1 rounded-full">{specialty}</span>
                  ))}
                  {trainer.specialties?.length > 3 && (
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium mr-2 mb-2 px-2 py-1 rounded-full">+{trainer.specialties.length - 3} more</span>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Certifications:</p>
                <div className="flex flex-wrap">
                  {trainer.certifications?.slice(0, 2).map((cert, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 mb-2 px-2 py-1 rounded-full flex items-center">
                      <Award size={12} className="mr-1" />
                      {cert}
                    </span>
                  ))}
                  {trainer.certifications?.length > 2 && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 mb-2 px-2 py-1 rounded-full">+{trainer.certifications.length - 2} more</span>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Availability:</p>
                <div className="flex flex-wrap">
                  {trainer.availability?.slice(0, 3).map((day, index) => (
                    <span key={index} className="bg-green-100 text-green-800 text-xs font-medium mr-2 mb-2 px-2 py-1 rounded-full flex items-center">
                      <Clock size={12} className="mr-1" />
                      {day}
                    </span>
                  ))}
                  {trainer.availability?.length > 3 && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 mb-2 px-2 py-1 rounded-full">+{trainer.availability.length - 3} more</span>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Hourly Rate: ${trainer.hourly_rate}/hour</p>
              </div>
              <button 
                onClick={() => navigate(`/trainer/${trainer.id}`)}
                className="mt-4 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        {Array.from({ length: Math.ceil(filteredTrainers.length / trainersPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === i + 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-orange-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AllTrainersPage;