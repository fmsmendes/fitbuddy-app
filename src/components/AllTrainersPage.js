import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Award } from 'lucide-react';

const AllTrainersPage = ({ trainers }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderRating = (rating) => (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTrainers.map(trainer => (
          <div key={trainer.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={trainer.image} alt={trainer.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{trainer.name}</h2>
              <p className="text-gray-600 mb-2">{trainer.age} years old</p>
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin size={14} className="mr-1" /> {trainer.distance} km away
              </div>
              {renderRating(trainer.rating)}
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Experience: <span className="font-normal">{trainer.experience}</span></p>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Specialties:</p>
                <div className="flex flex-wrap">
                  {trainer.specialties?.map((specialty, index) => (
                    <span key={index} className="bg-orange-100 text-orange-800 text-xs font-medium mr-2 mb-2 px-2 py-1 rounded-full">{specialty}</span>
                  ))}
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Certifications:</p>
                <div className="flex flex-wrap">
                  {trainer.certifications?.map((cert, index) => (
                    <span key={index} className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium mr-2 mb-2 px-2 py-1 rounded-full">
                      <Award size={12} className="mr-1" />
                      {cert}
                    </span>
                  ))}
                </div>
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
    </div>
  );
};

export default AllTrainersPage;
