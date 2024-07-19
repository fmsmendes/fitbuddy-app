import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Facebook, Chrome, UserPlus } from 'lucide-react';

const LoginSignup = ({ setIsAuthenticated, setCurrentUser, defaultTrainer }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userRole, setUserRole] = useState('buddy');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login mode
      if (email === defaultTrainer.email && password === defaultTrainer.password) {
        setIsAuthenticated(true);
        setCurrentUser(defaultTrainer);
        navigate('/');
      } else {
        // You can keep the default user login if needed, or remove it
        const defaultEmail = 'user@example.com';
        const defaultPassword = 'password123';
        if (email === defaultEmail && password === defaultPassword) {
          setIsAuthenticated(true);
          setCurrentUser({
            id: 'default-user',
            name: 'Default User',
            email: defaultEmail,
            role: 'buddy',
          });
          navigate('/');
        } else {
          alert('Invalid credentials. Please use the correct email and password.');
        }
      }
    } else {
      // Signup mode
      // In a real app, you would handle user registration here
      alert(`New ${userRole} registered:\nName: ${name}\nEmail: ${email}`);
      setIsAuthenticated(true);
      setCurrentUser({
        id: 'new-user',
        name: name,
        email: email,
        role: userRole,
        // Add other default properties as needed
      });
      navigate('/');
    }
  };

  const socialLogin = (provider) => {
    // In a real app, you would handle social login here
    console.log(`Logging in with ${provider}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to FitBuddy
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-orange-600 hover:text-orange-500 ml-1"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="bg-white shadow-md rounded-lg p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div>
                    <label htmlFor="name" className="sr-only">
                      Name
                    </label>
                    <div className="relative">
                      <User className="absolute top-3 left-3 text-gray-400" size={20} />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 mb-1">
                      I want to join as a:
                    </label>
                    <div className="relative">
                      <UserPlus className="absolute top-3 left-3 text-gray-400" size={20} />
                      <select
                        id="userRole"
                        name="userRole"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        value={userRole}
                        onChange={(e) => setUserRole(e.target.value)}
                      >
                        <option value="buddy">Fitness Buddy</option>
                        <option value="trainer">Personal Trainer</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                  {isLogin ? 'Sign in' : 'Sign up'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <button
                    onClick={() => socialLogin('google')}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <Chrome className="mr-2" size={20} />
                    <span>Google</span>
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => socialLogin('facebook')}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <Facebook className="mr-2" size={20} />
                    <span>Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;