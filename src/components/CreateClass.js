import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, DollarSign, MapPin, FileText, ArrowLeft } from 'lucide-react';
import { supabase } from '../utils/supabase';

const CreateClass = () => {
  const navigate = useNavigate();
  const [classData, setClassData] = useState({
    name: '',
    date: '',
    startTime: '',
    endTime: '',
    maxParticipants: '',
    price: '',
    location: '',
    description: '',
    classType: '',
    equipmentNeeded: '',
    fitnessLevel: 'All Levels',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClassData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');
  
      const { data, error } = await supabase
        .from('trainer_classes')
        .insert({
          name: classData.name,
          date: classData.date,
          start_time: classData.startTime,
          end_time: classData.endTime,
          max_participants: parseInt(classData.maxParticipants),
          price: parseFloat(classData.price),
          location: classData.location,
          description: classData.description,
          class_type: classData.classType,
          equipment_needed: classData.equipmentNeeded,
          fitness_level: classData.fitnessLevel,
          trainer_id: user.id,
        });
  
      if (error) throw error;
  
      console.log('Class created successfully:', data);
      navigate('/trainer-classes');
    } catch (error) {
      console.error('Error creating class:', error);
      alert('Failed to create class. Please try again.');
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-4">
      <button onClick={() => navigate('/trainer-classes')} className="mb-4 text-orange-500 font-medium flex items-center">
        <ArrowLeft size={20} className="mr-1" /> Back to Classes
      </button>
      <h1 className="text-2xl font-bold mb-6">Create a New Class</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Class Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={classData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-400" />
              </div>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={classData.date}
                onChange={handleChange}
                className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock size={16} className="text-gray-400" />
              </div>
              <input
                type="time"
                id="startTime"
                name="startTime"
                required
                value={classData.startTime}
                onChange={handleChange}
                className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock size={16} className="text-gray-400" />
              </div>
              <input
                type="time"
                id="endTime"
                name="endTime"
                required
                value={classData.endTime}
                onChange={handleChange}
                className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700">Max Participants</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users size={16} className="text-gray-400" />
              </div>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                required
                min="1"
                value={classData.maxParticipants}
                onChange={handleChange}
                className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign size={16} className="text-gray-400" />
            </div>
            <input
              type="number"
              id="price"
              name="price"
              required
              min="0"
              step="0.01"
              value={classData.price}
              onChange={handleChange}
              className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={classData.location}
              onChange={handleChange}
              className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
              <FileText size={16} className="text-gray-400" />
            </div>
            <textarea
              id="description"
              name="description"
              rows="3"
              required
              value={classData.description}
              onChange={handleChange}
              className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            ></textarea>
          </div>
        </div>

        <div>
          <label htmlFor="classType" className="block text-sm font-medium text-gray-700">Class Type</label>
          <select
            id="classType"
            name="classType"
            required
            value={classData.classType}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
          >
            <option value="">Select a class type</option>
            <option value="Yoga">Yoga</option>
            <option value="HIIT">HIIT</option>
            <option value="Strength Training">Strength Training</option>
            <option value="Cardio">Cardio</option>
            <option value="Pilates">Pilates</option>
            <option value="Zumba">Zumba</option>
          </select>
        </div>

        <div>
          <label htmlFor="equipmentNeeded" className="block text-sm font-medium text-gray-700">Equipment Needed</label>
          <input
            type="text"
            id="equipmentNeeded"
            name="equipmentNeeded"
            value={classData.equipmentNeeded}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., Yoga mat, water bottle"
          />
        </div>

        <div>
          <label htmlFor="fitnessLevel" className="block text-sm font-medium text-gray-700">Fitness Level</label>
          <select
            id="fitnessLevel"
            name="fitnessLevel"
            required
            value={classData.fitnessLevel}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
          >
            <option value="All Levels">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Create Class
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateClass;