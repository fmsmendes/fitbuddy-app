import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDumbbell, FaBolt, FaAppleAlt, FaWeight, FaBullseye, FaRunning, FaHeartbeat, FaFire, FaUsers, FaBaby, FaStopwatch, FaShieldAlt, FaTrashAlt } from 'react-icons/fa'; 
import { MdSportsGymnastics, MdSelfImprovement } from 'react-icons/md';
import { BiTargetLock } from 'react-icons/bi';
import { MapPin, Star, Award, Clock, Calendar, DollarSign, Edit, Check, X, Heart, User, Mail, TrendingUp, Activity, Target, Globe, Users } from 'lucide-react';
import TrainerNavigation from './TrainerNavigation';
import Navigation from './Navigation';
import { supabase } from '../utils/supabase';
import LocationInput from './LocationInput';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/profile_images/`;

const uploadProfileImage = async (file, userId) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Math.random()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('profile_images')
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  return fileName;
};

const getPublicImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/150';
  const { data: { publicUrl } } = supabase.storage
    .from('profile_images')
    .getPublicUrl(path);
  return publicUrl;
};

const TrainerProfile = ({ currentUser }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrainer, setEditedTrainer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isTrainerProfileCreated, setIsTrainerProfileCreated] = useState(true);

  useEffect(() => {
    fetchTrainerData();
  }, [currentUser]);

  const fetchTrainerData = async () => {
    try {
      // Get the user's email from Supabase Auth
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
  
      const { data: userProfileData, error: userProfileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();
  
      if (userProfileError) throw userProfileError;
  
      const { data: trainerData, error: trainerError } = await supabase
        .from('trainers')
        .select('*')
        .eq('id', currentUser.id)
        .single();
  
      if (trainerError) {
        if (trainerError.code === 'PGRST116') {
          console.log('Trainer profile not found. User can create one.');
          setIsTrainerProfileCreated(false);
          setEditedTrainer({ ...userProfileData, email: user.email });
        } else {
          console.error('Error fetching trainer data:', trainerError);
        }
      } else {
        setIsTrainerProfileCreated(true);
        setEditedTrainer({ ...userProfileData, ...trainerData, email: user.email, bio: userProfileData.bio });
      }
  
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user profile data:', error);
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    let imagePath = editedTrainer.image_url;

    if (selectedImage) {
      const uploadedImagePath = await uploadProfileImage(selectedImage, currentUser.id);
      if (uploadedImagePath) {
        imagePath = uploadedImagePath;
      }
    }

    const { data: updatedUserProfile, error: userProfileError } = await supabase
      .from('user_profiles')
      .update({
        name: editedTrainer.name,
        gender: editedTrainer.gender,
        dob: editedTrainer.dob,
        location: editedTrainer.location,
        latitude: editedTrainer.latitude,
        longitude: editedTrainer.longitude,
        fitness_level: editedTrainer.fitness_level,
        interests: editedTrainer.interests,
        availability: editedTrainer.availability,
        fitness_goals: editedTrainer.fitness_goals,
        image_url: imagePath,
        bio: editedTrainer.bio
      })
      .eq('id', currentUser.id);

    if (userProfileError) {
      console.error('Error updating user profile:', userProfileError);
      return;
    }

    if (!isTrainerProfileCreated) {
      const { data: newTrainerProfile, error: newTrainerError } = await supabase
        .from('trainers')
        .insert({
          id: currentUser.id,
          specialties: editedTrainer.specialties || [],
          experience: editedTrainer.experience || '',
          certifications: editedTrainer.certifications || [],
          hourly_rate: editedTrainer.hourly_rate || 0
        });

      if (newTrainerError) {
        console.error('Error creating trainer profile:', newTrainerError);
        return;
      }

      setIsTrainerProfileCreated(true);
    } else {
      const { data: updatedTrainerProfile, error: trainerProfileError } = await supabase
        .from('trainers')
        .update({
          specialties: editedTrainer.specialties,
          experience: editedTrainer.experience,
          certifications: editedTrainer.certifications,
          hourly_rate: editedTrainer.hourly_rate
        })
        .eq('id', currentUser.id);

      if (trainerProfileError) {
        console.error('Error updating trainer profile:', trainerProfileError);
        return;
      }
    }

    setIsEditing(false);
    fetchTrainerData();
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchTrainerData();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTrainer(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
    }
  };

  const handleLocationSelect = (locationData) => {
    setEditedTrainer(prev => ({
      ...prev,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      location: locationData.suburb
    }));
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

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      return;
    }

    try {
      await supabase
        .from('trainers')
        .delete()
        .eq('id', currentUser.id);

      await supabase
        .from('user_profiles')
        .delete()
        .eq('id', currentUser.id);

      await supabase.auth.signOut();

      navigate('/'); 

    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const specialtyOptions = [
    { icon: <FaDumbbell size={20} />, label: 'Strength Training' },
    { icon: <FaBolt size={20} />, label: 'HIIT' },
    { icon: <FaAppleAlt size={20} />, label: 'Nutrition Coaching' },
    { icon: <FaWeight size={20} />, label: 'Weight Loss Management' },
    { icon: <BiTargetLock size={20} />, label: 'Functional Training' },
    { icon: <FaRunning size={20} />, label: 'Cardio Conditioning' },
    { icon: <FaDumbbell size={20} />, label: 'Bodybuilding' },
    { icon: <FaBullseye size={20} />, label: 'Sports Performance Enhancement' },
    { icon: <MdSportsGymnastics size={20} />, label: 'Flexibility and Mobility' },
    { icon: <FaHeartbeat size={20} />, label: 'Post-Rehabilitation Exercise' },
    { icon: <FaFire size={20} />, label: 'Core Strengthening' },
    { icon: <FaUsers size={20} />, label: 'Group Fitness Instruction' },
    { icon: <FaBaby size={20} />, label: 'Pre/Postnatal Fitness' },
    { icon: <FaStopwatch size={20} />, label: 'Endurance Training' },
    { icon: <FaShieldAlt size={20} />, label: 'Injury Prevention and Recovery' },
    { icon: <MdSelfImprovement size={20} />, label: 'Mind-Body Fitness (Yoga/Pilates)' },
  ];

  const certificationOptions = [
    { label: 'Certificate III in Fitness', icon: <Award size={20} /> },
    { label: 'Certificate IV in Fitness', icon: <Award size={20} /> },
    { label: 'Diploma of Fitness', icon: <Award size={20} /> },
    { label: 'ASCA Level 1, 2, and 3', icon: <Award size={20} /> },
    { label: 'AIF Certifications', icon: <Award size={20} /> },
    { label: 'FMS Certification', icon: <Award size={20} /> },
    { label: 'Kettlebell Instructor Certification', icon: <Award size={20} /> },
    { label: 'Pilates Instructor Certification', icon: <Award size={20} /> },
    { label: 'Yoga Teacher Training Certification', icon: <Award size={20} /> },
    { label: 'Boxing/Kickboxing Instructor Certification', icon: <Award size={20} /> },
    { label: 'Nutrition Certification', icon: <Award size={20} /> },
    { label: 'CPR and First Aid Certification', icon: <Award size={20} /> },
  ];

  const availabilityOptions = [
    'Weekdays Only', 
    'Weekends Only',
    'Morning Sessions', 
    'Afternoon Sessions',
    'Evening Sessions',
    'Full-Day Availability',
    'Flexible Hours',
    'By Appointment Only', 
    'Online Training Sessions', 
    'In-Home Training Sessions',
    'Gym Sessions', 
    'Group Class Availability'
  ];

  if (isLoading) {
    return <div className="max-w-4xl mx-auto p-4">Loading...</div>;
  }

  if (!editedTrainer) {
    return <div className="max-w-4xl mx-auto p-4">Error loading trainer profile</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-16">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex items-center"> 
          <div className="md:flex-shrink-0">
            {isEditing ? (
              <div className="relative">
                <img
                  src={selectedImage ? URL.createObjectURL(selectedImage) : getPublicImageUrl(editedTrainer.image_url)}
                  alt={editedTrainer.name}
                  className="h-48 w-full object-cover md:w-48"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="absolute bottom-0 right-0 bg-orange-500 text-white p-1 rounded-full">
                  <Edit size={16} />
                </div>
              </div>
            ) : (
              <img
                src={getPublicImageUrl(editedTrainer.image_url)}
                alt={editedTrainer.name}
                className="h-48 w-full object-cover md:w-48"
              />
            )}
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-orange-500 font-semibold">Personal Trainer</div>
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editedTrainer.name}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      name="gender"
                      value={editedTrainer.gender}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={editedTrainer.dob}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editedTrainer.email}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      readOnly
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <LocationInput
                    onSelectLocation={handleLocationSelect}
                    defaultValue={editedTrainer.location}
                  />
                </div>
              </div>
            ) : (
              <div> 
                <h1 className="mt-1 text-3xl font-semibold text-gray-900">{editedTrainer.name}</h1>
                <p className="mt-2 text-gray-600">{calculateAge(editedTrainer.dob)} years old</p>
                <div className="flex items-center mt-2">
                  <MapPin size={20} className="text-gray-400 mr-2" />
                  <span>{editedTrainer.location}</span>
                </div>
                <div className="flex items-center mt-2">
                  <Star size={20} className="text-yellow-400 mr-2" />
                  <span className="font-semibold">{editedTrainer.rating}</span>
                  <span className="text-gray-600 ml-1">({editedTrainer.reviews} reviews)</span>
                </div>
                <div className="flex items-center mt-2">
                  <Heart size={20} className="text-red-500 mr-2" />
                  <span className="font-semibold">{editedTrainer.likes || 0} likes</span>
                </div>
              </div> 
            )}
          </div>
        </div>
        {/* About Me Section */}
        <div className="p-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">About Me</h2>
          {isEditing ? (
            <textarea
              name="bio"
              value={editedTrainer.bio || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows="4"
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-gray-600">{editedTrainer.bio || 'No bio available.'}</p>
          )}
        </div>
        {/* Specialties Section */}
        <div className="p-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Specialties</h2>
          {isEditing ? (
            <div className="grid grid-cols-2 gap-2">
              {specialtyOptions.map((specialty, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const newSpecialties = editedTrainer.specialties?.includes(specialty.label)
                      ? editedTrainer.specialties.filter(s => s !== specialty.label)
                      : [...(editedTrainer.specialties || []), specialty.label];
                    setEditedTrainer(prev => ({ ...prev, specialties: newSpecialties }));
                  }}
                  className={`flex items-center justify-start p-2 rounded ${
                    editedTrainer.specialties?.includes(specialty.label)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {specialty.icon}
                  <span className="ml-2 text-sm">{specialty.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap">
              {editedTrainer.specialties?.map((specialty, index) => (
                <span key={index} className="bg-orange-100 text-orange-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
                  {specialty}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Experience & Certifications Section */}
        <div className="p-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Experience & Certifications</h2>
          <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
  {isEditing ? (
    <div className="flex items-center">
      <Clock size={20} className="text-gray-400 mr-2" />
      <input
        type="text"
        name="experience"
        value={editedTrainer.experience || ''}
        onChange={handleChange}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm h-10"
        placeholder="Years of experience"
      />
    </div>
  ) : (
    <div className="flex items-center">
      <Clock size={20} className="text-gray-400 mr-2" />
      <span className="text-lg font-semibold">
        {editedTrainer.experience} {editedTrainer.experience === '1' ? 'year' : 'years'} of experience
      </span>
    </div>
  )}
</div>

          {isEditing ? (
            <div>
              <div className="grid grid-cols-2 gap-2 mb-2"> 
                {certificationOptions.map((cert, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const newCertifications = editedTrainer.certifications?.includes(cert.label)
                        ? editedTrainer.certifications.filter(c => c !== cert.label)
                        : [...(editedTrainer.certifications || []), cert.label];
                      setEditedTrainer(prev => ({ ...prev, certifications: newCertifications }));
                    }}
                    className={`flex items-center justify-start p-2 rounded ${
                      editedTrainer.certifications?.includes(cert.label)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {cert.icon}
                    <span className="ml-2 text-sm">{cert.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap"> 
                {editedTrainer.certifications?.map((cert, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full flex items-center">
                    <Award size={16} className="mr-1" />
                    {cert}
                    <button
                      onClick={() => {
                        const newCertifications = editedTrainer.certifications.filter((_, i) => i !== index);
                        setEditedTrainer(prev => ({ ...prev, certifications: newCertifications }));
                      }}
                      className="ml-2 text-blue-800 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap">
              {editedTrainer.certifications?.map((cert, index) => (
                <div key={index} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
                  <Award size={16} className="mr-1" />
                  {cert}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Availability & Pricing Section (Updated) */}
        <div className="p-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4">Availability & Pricing</h2>

          <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
  {isEditing ? (
    <div className="flex items-center">
      <DollarSign size={20} className="text-gray-400 mr-2" />
      <input
        type="number"
        name="hourly_rate"
        value={editedTrainer.hourly_rate || ''}
        onChange={handleChange}
        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm h-10"
        placeholder="Hourly rate"
      />
    </div>
  ) : (
    <div className="flex items-center">
      <DollarSign size={20} className="text-gray-400 mr-2" />
      <span className="text-lg font-semibold">${editedTrainer.hourly_rate}/hour</span>
    </div>
  )}
</div>

          <h3 className="text-lg font-semibold mb-2">Availability</h3>
          {isEditing ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"> 
          {availabilityOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                const newAvailability = editedTrainer.availability?.includes(option)
                  ? editedTrainer.availability.filter(a => a !== option)
                  : [...(editedTrainer.availability || []), option];
                setEditedTrainer(prev => ({ ...prev, availability: newAvailability }));
              }}
              className={`p-2 rounded text-sm font-medium ${
                editedTrainer.availability?.includes(option)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap">
          {(editedTrainer.availability || []).map((day, index) => (
            <span key={index} className="bg-green-100 text-green-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">
              {day}
            </span>
          ))}
        </div>
      )}
    </div>

        {/* Trainer Stats Section */}
        {!isEditing && (
          <div className="p-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Trainer Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderStatCard(<Users className="text-blue-500" size={24} />, "Total Clients", editedTrainer.stats?.totalClients)}
              {renderStatCard(<Users className="text-green-500" size={24} />, "Active Clients", editedTrainer.stats?.activeClients)}
              {renderStatCard(<Activity className="text-purple-500" size={24} />, "Classes Completed", editedTrainer.stats?.classesCompleted)}
              {renderStatCard(<Globe className="text-indigo-500" size={24} />, "Online Sessions", editedTrainer.stats?.onlineSessionsCompleted)}
              {renderStatCard(<MapPin className="text-red-500" size={24} />, "In-Person Sessions", editedTrainer.stats?.inPersonSessionsCompleted)}
              {renderStatCard(<Clock className="text-yellow-500" size={24} />, "Total Hours Worked", editedTrainer.stats?.totalHoursWorked)}
              {renderStatCard(<Clock className="text-pink-500" size={24} />, "Avg Session Duration", editedTrainer.stats?.avgSessionDuration, " min")}
              {renderStatCard(<Users className="text-teal-500" size={24} />, "Client Retention Rate", editedTrainer.stats?.clientRetentionRate, "%")}
              {renderStatCard(<Target className="text-orange-500" size={24} />, "Client Goals Achieved", editedTrainer.stats?.clientGoalsAchieved, "%")}
              {renderStatCard(<Star className="text-yellow-500" size={24} />, "Top Class", editedTrainer.stats?.topPerformingClass)}
              {renderStatCard(<DollarSign className="text-green-500" size={24} />, "Monthly Earnings", editedTrainer.stats?.monthlyEarnings, "$")}
              {renderStatCard(<DollarSign className="text-blue-500" size={24} />, "YTD Earnings", editedTrainer.stats?.yearToDateEarnings, "$")}
              {renderStatCard(<Calendar className="text-purple-500" size={24} />, "Upcoming Sessions", editedTrainer.stats?.upcomingSessions)}
              {renderStatCard(<TrendingUp className="text-red-500" size={24} />, "Last Month Growth", editedTrainer.stats?.lastMonthGrowth, "%")}
            </div>
          </div>
        )}

        <div className="p-8 border-t border-gray-200 flex justify-end space-x-4">
          {isEditing ? (
            <>
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
            </> 
          ) : (
            <>
              <button 
                onClick={handleEdit}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
              >
                <Edit size={20} className="mr-2" />
                Edit Profile
              </button>
              <button
                onClick={handleDeleteProfile} 
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                <FaTrashAlt size={18} className="mr-2" />
                Delete Profile
              </button>
            </>
          )}
        </div>
      </div>

      {currentUser.role === 'trainer' ? (
        <TrainerNavigation activeTab="profile" />
      ) : (
        <Navigation activeTab="trainers" />
      )}
    </div>
  );
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

export default TrainerProfile;