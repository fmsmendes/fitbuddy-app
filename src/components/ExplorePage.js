import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Award, MapPin, Zap, Book, ShoppingBag, ChevronRight, Star, ArrowLeft } from 'lucide-react';
import placeholderBuddy from '../assets/placeholder-buddy.jpg';
import placeholderEvent from '../assets/placeholder-event.jpg';
import placeholderTrainer from '../assets/placeholder-trainer.jpg';
import placeholderGym from '../assets/placeholder-gym.jpg';
import placeholderFitness from '../assets/placeholder-fitness.jpg';

const ExplorePage = ({ user, recommendations, trendingActivities, communityHighlights, localSpots, fitnessArticles, trendingTrainers, localAds }) => {
  const navigate = useNavigate();

<<<<<<< HEAD
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

=======
>>>>>>> ef830e1 (Save local changes before rebase)
  const SectionTitle = ({ title, viewAll }) => (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {viewAll && (
        <button className="text-orange-500 font-medium flex items-center" onClick={viewAll}>
          View All <ChevronRight size={20} />
        </button>
      )}
    </div>
  );

  const getPlaceholderImage = (type) => {
    switch (type) {
      case 'buddy':
        return placeholderBuddy;
      case 'event':
        return placeholderEvent;
      case 'trainer':
        return placeholderTrainer;
      case 'gym':
        return placeholderGym;
      default:
        return placeholderFitness;
    }
  };

  const ImageWithFallback = ({ src, alt, className }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `https://placehold.co/300x200/png?text=${alt}`;
      }}
    />
  );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-100">
<<<<<<< HEAD
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Explore</h1>
        <button onClick={() => navigate('/dashboard')} className="text-orange-500 font-medium">
          Back to Dashboard
        </button>
      </div>
=======
      {/* ... (keep the header as is) ... */}
>>>>>>> ef830e1 (Save local changes before rebase)

      <section className="mb-8">
        <SectionTitle title="For You" viewAll={() => navigate('/recommendations')} />
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 space-x-4">
          {recommendations.map((item, index) => (
            <div key={index} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden">
              <ImageWithFallback
                src={getPlaceholderImage(item.type)}
                alt={item.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle title="Trending Now" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trendingActivities.map((activity, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <ImageWithFallback
                src={getPlaceholderImage('event')}
                alt={activity.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{activity.name}</h3>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle title="Community Spotlight" />
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ImageWithFallback
            src={communityHighlights.image || placeholderFitness}
            alt="Community Highlight"
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{communityHighlights.title}</h3>
            <p className="text-sm text-gray-600">{communityHighlights.description}</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle title="Trending Trainers" viewAll={() => navigate('/trainers')} />
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 space-x-4">
          {trendingTrainers.map((trainer, index) => (
            <div key={index} className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md overflow-hidden">
              <ImageWithFallback
                src={trainer.image || placeholderTrainer}
                alt={trainer.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{trainer.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{trainer.specialty}</p>
                <div className="flex items-center">
                  <Star className="text-yellow-400 mr-1" size={16} />
                  <span className="text-sm font-medium">{trainer.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({trainer.reviewCount} reviews)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle title="Local Fitness Spots" viewAll={() => navigate('/local-spots')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localSpots.map((spot, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <ImageWithFallback
                src={placeholderGym}
                alt={spot.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{spot.name}</h3>
                <p className="text-sm text-gray-600 flex items-center">
                  <MapPin size={14} className="mr-1" /> {spot.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle title="Fitness Tips" viewAll={() => navigate('/fitness-tips')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fitnessArticles.map((article, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <ImageWithFallback
                src={placeholderFitness}
                alt={article.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600">{article.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <SectionTitle title="Local Services" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localAds.map((ad, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <ImageWithFallback
                src={ad.image || placeholderFitness}
                alt={ad.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{ad.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{ad.description}</p>
                <a href={ad.link} className="text-orange-500 font-medium text-sm">Learn More</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

<<<<<<< HEAD
export default ExplorePage;
=======
export default ExplorePage;
>>>>>>> ef830e1 (Save local changes before rebase)
