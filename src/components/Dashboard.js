import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Calendar, User, Users, Search, MapPin, Star, Activity, Clock, Dumbbell, Heart } from 'lucide-react';
import Navigation from './Navigation';
import UserMenu from './UserMenu';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const Dashboard = ({ buddies, events, trainers }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [favoriteBuddies, setFavoriteBuddies] = useState([]);
    const [favoriteTrainers, setFavoriteTrainers] = useState([]);
    const navigate = useNavigate();

const toggleFavoriteBuddy = (buddyId) => {
        setFavoriteBuddies(prev => 
          prev.includes(buddyId) 
            ? prev.filter(id => id !== buddyId) 
            : [...prev, buddyId]
        );
      };
    
const toggleFavoriteTrainer = (trainerId) => {
        setFavoriteTrainers(prev => 
          prev.includes(trainerId) 
            ? prev.filter(id => id !== trainerId) 
            : [...prev, trainerId]
        );
      };  

  const renderRating = (rating, reviews) => (
    <div className="flex items-center mb-2">
      <div className="flex items-center mr-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} />
        ))}
      </div>
      <span className="text-sm font-medium text-gray-700">{rating?.toFixed(1) || 'N/A'}</span>
      <span className="text-sm text-gray-500 ml-1">({reviews || 0} reviews)</span>
    </div>
  );

  const renderBuddyCard = (buddy) => (
    <div className="flex-shrink-0 w-full sm:w-72 bg-white rounded-lg shadow-md p-4 mr-4 relative">
    <button 
      onClick={() => toggleFavoriteBuddy(buddy.id)}
      className="absolute top-4 right-4 z-10"
    >
      <Heart 
        size={24} 
        className={`${favoriteBuddies.includes(buddy.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
      />
    </button>
    <img src={buddy.image} alt={buddy.name} className="w-full h-32 object-cover rounded-lg mb-3" />
      <h3 className="font-semibold text-lg">{buddy.name} <span className="text-sm font-normal text-gray-500">{buddy.age}</span></h3>
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <MapPin size={14} className="mr-1" /> {buddy.distance} km away
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <User size={14} className="mr-1" /> {buddy.gender || 'N/A'}
      </div>
      {renderRating(buddy.rating, buddy.reviews)}
      <div className="mt-2 mb-2">
        <p className="text-sm font-medium text-gray-700">Fitness Level: <span className="font-normal">{buddy.level}</span></p>
      </div>
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Interests:</p>
        <div className="flex flex-wrap">
          {buddy.interests?.map((interest, index) => (
            <span key={index} className="bg-orange-100 text-orange-800 text-xs font-medium mr-2 mb-2 px-2 py-1 rounded-full">{interest}</span>
          ))}
        </div>
      </div>
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Availability:</p>
        <div className="flex items-center text-sm text-gray-600">
          <Clock size={14} className="mr-1" />
          {buddy.availability ? buddy.availability.join(', ') : 'N/A'}
        </div>
      </div>
      <button 
        onClick={() => navigate(`/buddy/${buddy.id}`)}
        className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
      >
        Connect
      </button>
    </div>
  );

  const renderEventCard = (event) => (
    <div className="flex-shrink-0 w-full sm:w-72 bg-white rounded-lg shadow-md p-4 mr-4">
      <img src={event.image} alt={event.name} className="w-full h-40 object-cover rounded-lg mb-3" />
      <h3 className="font-semibold text-lg mb-1">{event.name}</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">{event.type}</span>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${event.isFree ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
          {event.isFree ? 'Free' : `$${event.price}`}
        </span>
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-1">
        <Calendar size={14} className="mr-1 flex-shrink-0" /> {event.date}, {event.time}
      </div>
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <MapPin size={14} className="mr-1 flex-shrink-0" /> {event.location}
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-2 flex-shrink-0">
            <img src={event.host?.image} alt={event.host?.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-xs text-gray-500 block">Host</span>
            <p className="text-sm font-medium text-gray-700 truncate">{event.host?.name}</p>
          </div>
        </div>
        <span className="text-sm text-gray-600 ml-2">{event.participants} participants</span>
      </div>
      <button 
        onClick={() => navigate(`/event/${event.id}`)}
        className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
      >
        Join Event
      </button>
    </div>
  );

  const renderTrainerCard = (trainer) => (
    <div className="flex-shrink-0 w-full sm:w-72 bg-white rounded-lg shadow-md p-4 mr-4 relative">
    <button 
      onClick={() => toggleFavoriteTrainer(trainer.id)}
      className="absolute top-4 right-4 z-10"
    >
      <Heart 
        size={24} 
        className={`${favoriteTrainers.includes(trainer.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
      />
    </button>
    <img src={trainer.image} alt={trainer.name} className="w-full h-32 object-cover rounded-lg mb-3" />
      <h3 className="font-semibold text-lg">{trainer.name} <span className="text-sm font-normal text-gray-500">{trainer.age}</span></h3>
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <MapPin size={14} className="mr-1" /> {trainer.distance} km away
      </div>
      {renderRating(trainer.rating, trainer.reviews)}
      <div className="mt-2 mb-2">
        <p className="text-sm font-medium text-gray-700">Experience: <span className="font-normal">{trainer.experience}</span></p>
      </div>
      <div className="mb-3">
        <p className="text-sm font-medium text-gray-700 mb-1">Specialties:</p>
        <div className="flex flex-wrap">
          {trainer.specialties?.map((specialty, index) => (
            <span key={index} className="bg-orange-100 text-orange-800 text-xs font-medium mr-2 mb-2 px-2 py-1 rounded-full">{specialty}</span>
          ))}
        </div>
      </div>
      <button 
        onClick={() => navigate(`/trainer/${trainer.id}`)}
        className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors"
      >
        Book Session
      </button>
    </div>
  );

  return (
    <div className="font-sans max-w-7xl mx-auto bg-gray-100 min-h-screen overflow-y-auto pb-16">
      <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
          <span className="font-bold text-xl">FITbuddy</span>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/notifications')} 
            className="relative mr-4"
          >
            <Bell className="text-orange-500" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>
          <button onClick={() => setIsUserMenuOpen(true)} className="w-10 h-10 rounded-full overflow-hidden">
            <img src="https://via.placeholder.com/150" alt="Diana Soto" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      <main className="p-4">
        <h1 className="text-2xl font-semibold mb-6">Hello, Diana Soto</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Users size={24} />, label: 'Find a Buddy', description: 'Connect with fitness partners', onClick: () => navigate('/find-buddy') },
            { icon: <Calendar size={24} />, label: 'Events', description: 'Join local fitness activities', onClick: () => navigate('/events') },
            { icon: <Dumbbell size={24} />, label: 'Trainers', description: 'Book sessions with pros', onClick: () => navigate('/trainers') },
            { icon: <Activity size={24} />, label: 'My Progress', description: 'Track your fitness journey', onClick: () => navigate('/progress') },
          ].map((item, index) => (
            <button 
              key={index} 
              className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:bg-orange-50 transition-colors"
              onClick={item.onClick}
            >
              {React.cloneElement(item.icon, { className: "text-orange-500 mb-2" })}
              <span className="text-sm font-medium mb-1">{item.label}</span>
              <span className="text-xs text-gray-500 text-center">{item.description}</span>
            </button>
          ))}
        </div>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Suggested Buddies</h2>
            <button className="text-orange-500 font-medium">View All</button>
          </div>
          <div className="flex flex-nowrap overflow-x-auto pb-4 -mx-4 px-4">
            {buddies.map((buddy, index) => (
              <div key={index} className="mr-4 w-full sm:w-auto">{renderBuddyCard(buddy)}</div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Suggested Events</h2>
            <button className="text-orange-500 font-medium">View All</button>
          </div>
          <div className="flex flex-nowrap overflow-x-auto pb-4 -mx-4 px-4">
            {events.map((event, index) => (
              <div key={index} className="mr-4 w-full sm:w-auto">{renderEventCard(event)}</div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Featured Trainers</h2>
            <button className="text-orange-500 font-medium">View All</button>
          </div>
          <div className="flex flex-nowrap overflow-x-auto pb-4 -mx-4 px-4">
            {trainers.map((trainer, index) => (
              <div key={index} className="mr-4 w-full sm:w-auto">{renderTrainerCard(trainer)}</div>
            ))}
          </div>
        </section>
      </main>

      <Navigation />
      <UserMenu isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
    </div>

  );
};

export default Dashboard;
