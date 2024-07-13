import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Dumbbell, Star, MapPin, Clock, Activity, Target, Heart, Zap } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/login');
  };

  const features = [
    { icon: <Users className="h-8 w-8 text-orange-500" />, title: 'Find Fitness Buddies', description: 'Connect with people who share your fitness interests and goals.' },
    { icon: <Calendar className="h-8 w-8 text-orange-500" />, title: 'Join Events', description: 'Discover and participate in local fitness events and classes.' },
    { icon: <Activity className="h-8 w-8 text-orange-500" />, title: 'Track Progress', description: 'Set goals, log workouts, and monitor your fitness journey.' },
    { icon: <MapPin className="h-8 w-8 text-orange-500" />, title: 'Explore Nearby', description: 'Find fitness spots, parks, and gyms in your local area.' },
    { icon: <Clock className="h-8 w-8 text-orange-500" />, title: 'Flexible Scheduling', description: 'Plan workouts and events that fit your busy lifestyle.' },
    { icon: <Target className="h-8 w-8 text-orange-500" />, title: 'Community Challenges', description: 'Participate in motivating fitness challenges with the community.' },
    { icon: <Dumbbell className="h-8 w-8 text-orange-500" />, title: 'Personalized Workouts', description: 'Get custom workout plans tailored to your fitness level and goals.' },
    { icon: <Zap className="h-8 w-8 text-orange-500" />, title: 'Instant Motivation', description: 'Receive daily motivation and tips to keep you on track.' },
  ];

  const testimonials = [
    { name: 'Sarah J.', image: 'https://randomuser.me/api/portraits/women/32.jpg', quote: 'FitBuddy helped me find a running partner, and now I\'m training for my first marathon!', rating: 5 },
    { name: 'Mike T.', image: 'https://randomuser.me/api/portraits/men/54.jpg', quote: 'The variety of events on FitBuddy keeps my workouts exciting and challenging.', rating: 4 },
    { name: 'Emily R.', image: 'https://randomuser.me/api/portraits/women/68.jpg', quote: 'I\'ve made great friends and achieved my fitness goals thanks to FitBuddy.', rating: 5 },
    { name: 'Alex K.', image: 'https://randomuser.me/api/portraits/men/78.jpg', quote: 'As a trainer, FitBuddy has helped me connect with clients and grow my business.', rating: 5 },
  ];
  return (
    <div className="font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="FitBuddy Logo" className="h-8 w-auto mr-2" />
            <span className="font-bold text-xl text-orange-500">FitBuddy</span>
          </div>
          <div>
            <button onClick={handleLoginClick} className="text-gray-600 hover:text-orange-500 mr-4 transition duration-300">Login</button>
            <button onClick={handleSignUpClick} className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300">Sign Up</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl mb-6">
              Find Your Perfect <span className="text-yellow-300">Fitness Partner</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-xl sm:text-2xl md:mt-5 md:max-w-3xl">
              Connect with like-minded fitness enthusiasts, join events, and achieve your goals together.
            </p>
            <div className="mt-10 flex justify-center">
              <button onClick={handleSignUpClick} className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50 transition duration-300">
                Get Started
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose <span className="text-orange-500">FitBuddy</span>?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Discover the features that make FitBuddy the perfect platform for your fitness journey.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="bg-white rounded-lg shadow-md p-6 transition duration-300 hover:shadow-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-md mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center sm:text-4xl mb-16">
            What Our <span className="text-orange-500">Users Say</span>
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-gray-50 rounded-lg px-6 py-8 text-center shadow-md transition duration-300 hover:shadow-lg">
                <img className="mx-auto h-20 w-20 rounded-full mb-4" src={testimonial.image} alt={testimonial.name} />
                <blockquote className="text-gray-700 mb-4">
                  <p>"{testimonial.quote}"</p>
                </blockquote>
                <div className="font-medium text-gray-900">{testimonial.name}</div>
                <div className="mt-2 flex justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-500">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-orange-900">Join FitBuddy today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button onClick={handleSignUpClick} className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50 transition duration-300">
                Sign Up Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <img className="h-10" src="/logo-white.png" alt="FitBuddy" />
              <p className="text-gray-400 text-base">
                Connecting fitness enthusiasts and making workouts more fun and social.
              </p>
              <div className="flex space-x-6">
                {/* Add social media icons here */}
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">About</a></li>
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Careers</a></li>
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Press</a></li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Blog</a></li>
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Help Center</a></li>
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Contact</a></li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Privacy</a></li>
                    <li><a href="#" className="text-base text-gray-300 hover:text-white">Terms</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-700 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; 2024 FitBuddy, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
