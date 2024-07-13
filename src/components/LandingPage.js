import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Dumbbell, Star } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="FitBuddy Logo" className="h-8 w-auto mr-2" />
            <span className="font-bold text-xl text-orange-500">FitBuddy</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-orange-500">Login</Link>
            <Link to="/signup" className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition duration-300">Sign Up</Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect <span className="text-orange-500">Fitness Partner</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with like-minded fitness enthusiasts, join exciting events, and achieve your goals together.
          </p>
          <Link to="/signup" className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition duration-300">
            Get Started
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: <Users className="w-12 h-12 text-orange-500 mb-4" />, title: "Find Buddies", description: "Connect with fitness partners who share your interests and goals." },
            { icon: <Calendar className="w-12 h-12 text-orange-500 mb-4" />, title: "Join Events", description: "Discover and participate in local fitness events and challenges." },
            { icon: <Dumbbell className="w-12 h-12 text-orange-500 mb-4" />, title: "Track Progress", description: "Monitor your fitness journey and celebrate achievements together." },
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="bg-orange-100 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Sarah L.", quote: "FitBuddy helped me find the perfect running partner. Now I'm more motivated than ever!" },
              { name: "Mike T.", quote: "The events feature is amazing. I've made so many new friends while getting fit." },
              { name: "Emma R.", quote: "As a beginner, FitBuddy made it easy to connect with others at my fitness level." },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Fitness Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join FitBuddy today and transform the way you approach fitness.
          </p>
          <Link to="/signup" className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition duration-300">
            Sign Up Now
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </section>
      </main>

      <footer className="bg-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-orange-500">About Us</Link></li>
                <li><Link to="/careers" className="text-gray-600 hover:text-orange-500">Careers</Link></li>
                <li><Link to="/press" className="text-gray-600 hover:text-orange-500">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-600 hover:text-orange-500">Blog</Link></li>
                <li><Link to="/help" className="text-gray-600 hover:text-orange-500">Help Center</Link></li>
                <li><Link to="/safety" className="text-gray-600 hover:text-orange-500">Safety Tips</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-600 hover:text-orange-500">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-600 hover:text-orange-500">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-gray-600 hover:text-orange-500">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-orange-500">Facebook</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-500">Twitter</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-500">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
            <p>&copy; 2024 FitBuddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, Dumbbell, Star } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-b from-orange-50 to-white min-h-screen">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logo.png" alt="FitBuddy Logo" className="h-8 w-auto mr-2" />
            <span className="font-bold text-xl text-orange-500">FitBuddy</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-orange-500">Login</Link>
            <Link to="/signup" className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition duration-300">Sign Up</Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect <span className="text-orange-500">Fitness Partner</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with like-minded fitness enthusiasts, join exciting events, and achieve your goals together.
          </p>
          <Link to="/signup" className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition duration-300">
            Get Started
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: <Users className="w-12 h-12 text-orange-500 mb-4" />, title: "Find Buddies", description: "Connect with fitness partners who share your interests and goals." },
            { icon: <Calendar className="w-12 h-12 text-orange-500 mb-4" />, title: "Join Events", description: "Discover and participate in local fitness events and challenges." },
            { icon: <Dumbbell className="w-12 h-12 text-orange-500 mb-4" />, title: "Track Progress", description: "Monitor your fitness journey and celebrate achievements together." },
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              {feature.icon}
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </section>

        <section className="bg-orange-100 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Sarah L.", quote: "FitBuddy helped me find the perfect running partner. Now I'm more motivated than ever!" },
              { name: "Mike T.", quote: "The events feature is amazing. I've made so many new friends while getting fit." },
              { name: "Emma R.", quote: "As a beginner, FitBuddy made it easy to connect with others at my fitness level." },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Fitness Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join FitBuddy today and transform the way you approach fitness.
          </p>
          <Link to="/signup" className="inline-flex items-center bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition duration-300">
            Sign Up Now
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </section>
      </main>

      <footer className="bg-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 hover:text-orange-500">About Us</Link></li>
                <li><Link to="/careers" className="text-gray-600 hover:text-orange-500">Careers</Link></li>
                <li><Link to="/press" className="text-gray-600 hover:text-orange-500">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-600 hover:text-orange-500">Blog</Link></li>
                <li><Link to="/help" className="text-gray-600 hover:text-orange-500">Help Center</Link></li>
                <li><Link to="/safety" className="text-gray-600 hover:text-orange-500">Safety Tips</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-600 hover:text-orange-500">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-600 hover:text-orange-500">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-gray-600 hover:text-orange-500">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-orange-500">Facebook</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-500">Twitter</a></li>
                <li><a href="#" className="text-gray-600 hover:text-orange-500">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
            <p>&copy; 2024 FitBuddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
