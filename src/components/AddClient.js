import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Calendar, Target, Clipboard, Save } from 'lucide-react';

const AddClient = ({ onAddClient, onCancel }) => {
  const [clientDetails, setClientDetails] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    fitnessGoals: [],
    medicalHistory: '',
    emergencyContact: '',
    preferredContactMethod: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleGoalChange = (goal) => {
    setClientDetails(prevDetails => ({
      ...prevDetails,
      fitnessGoals: prevDetails.fitnessGoals.includes(goal)
        ? prevDetails.fitnessGoals.filter(g => g !== goal)
        : [...prevDetails.fitnessGoals, goal]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddClient(clientDetails);
    navigate('/clients');
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <button onClick={onCancel} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold">Add New Client</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="name">
              Full Name
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="name"
                id="name"
                className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="John Doe"
                value={clientDetails.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="john@example.com"
                value={clientDetails.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
              Phone Number
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="(123) 456-7890"
                value={clientDetails.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="dateOfBirth">
              Date of Birth
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="date"
                name="dateOfBirth"
                id="dateOfBirth"
                className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                value={clientDetails.dateOfBirth}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <div className="mt-2 space-x-4">
            {['Male', 'Female', 'Other', 'Prefer not to say'].map((gender) => (
              <label key={gender} className="inline-flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={clientDetails.gender === gender}
                  onChange={handleChange}
                  className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{gender}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Fitness Goals</label>
          <div className="mt-2 space-x-4">
            {['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'General Fitness'].map((goal) => (
              <label key={goal} className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="fitnessGoals"
                  value={goal}
                  checked={clientDetails.fitnessGoals.includes(goal)}
                  onChange={() => handleGoalChange(goal)}
                  className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{goal}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="medicalHistory">
            Medical History
          </label>
          <div className="mt-1">
            <textarea
              id="medicalHistory"
              name="medicalHistory"
              rows={3}
              className="shadow-sm focus:ring-orange-500 focus:border-orange-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Any relevant medical information..."
              value={clientDetails.medicalHistory}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="emergencyContact">
            Emergency Contact
          </label>
          <input
            type="text"
            name="emergencyContact"
            id="emergencyContact"
            className="mt-1 focus:ring-orange-500 focus:border-orange-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="Name: John Doe, Relation: Spouse, Phone: (123) 456-7890"
            value={clientDetails.emergencyContact}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Contact Method</label>
          <select
            name="preferredContactMethod"
            value={clientDetails.preferredContactMethod}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
          >
            <option value="">Select a method</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="sms">SMS</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="notes">
            Additional Notes
          </label>
          <div className="mt-1">
            <textarea
              id="notes"
              name="notes"
              rows={3}
              className="shadow-sm focus:ring-orange-500 focus:border-orange-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
              placeholder="Any additional information..."
              value={clientDetails.notes}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Client
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClient;
