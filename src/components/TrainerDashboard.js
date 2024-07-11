import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, DollarSign, Star, 
  Clock, Award, ChevronRight, Bell, LogOut,
  Activity, Globe, MapPin, Target, TrendingUp,
  Menu, X, Home, Dumbbell, MessageSquare, Settings
} from 'lucide-react';

const TrainerDashboard = ({ trainer, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!trainer) {
    return <div className="max-w-7xl mx-auto p-4">Loading trainer data...</div>;
  }

  const upcomingSessions = [
    { id: 1, clientName: 'John Doe', time: '10:00 AM', date: '2024-07-15', type: 'One-on-One' },
    { id: 2, clientName: 'Jane Smith', time: '2:00 PM', date: '2024-07-15', type: 'Group Session' },
    { id: 3, clientName: 'Mike Johnson', time: '11:00 AM', date: '2024-07-16', type: 'One-on-One' },
  ];

  const recentReviews = [
    { id: 1, clientName: 'Sarah Wilson', rating: 5, comment: 'Excellent trainer! Really helped me achieve my goals.' },
    { id: 2, clientName: 'Tom Brown', rating: 4, comment: 'Great sessions, very knowledgeable.' },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const renderStatCard = (icon, title, value, suffix = '', isCurrency = false) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-sm font-semibold ml-2">{title}</h3>
      </div>
      <p className="text-xl font-bold text-orange-500">
        {value !== undefined 
          ? (isCurrency ? formatCurrency(value) : `${value}${suffix}`)
          : 'N/A'}
      </p>
    </div>
  );

  const sidebarItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/trainer-dashboard' },
    { icon: <Calendar size={20} />, label: 'Classes', path: '/trainer-classes' },
    { icon: <Users size={20} />, label: 'Clients', path: '/clients' },
    { icon: <MessageSquare size={20} />, label: 'Messages', path: '/trainer-chats' },
    { icon: <DollarSign size={20} />, label: 'Financials', path: '/trainer-financials' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/trainer-settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white fixed inset-y-0 left-0 z-30 w-64 transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">PT</span>
            </div>
            <span className="font-bold text-xl">TrainerHub</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X size={24} />
          </button>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-orange-100 hover:text-orange-500"
            >
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white p-4 flex justify-between items-center shadow-sm">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden">
            <Menu size={24} />
          </button>
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/notifications')} 
              className="relative mr-4"
              aria-label="Notifications"
            >
              <Bell className="text-orange-500" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </button>
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
              className="w-10 h-10 rounded-full overflow-hidden"
              aria-label="User menu"
            >
              <img src={trainer.profileImage} alt={trainer.name} className="w-full h-full object-cover" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <h1 className="text-2xl font-semibold mb-6">Welcome back, {trainer.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {renderStatCard(<Users className="text-blue-500" size={24} />, "Total Clients", trainer.stats?.totalClients)}
            {renderStatCard(<Calendar className="text-green-500" size={24} />, "Sessions This Week", trainer.stats?.sessionsThisWeek)}
            {renderStatCard(<DollarSign className="text-yellow-500" size={24} />, "Earnings This Month", trainer.stats?.monthlyEarnings, "", true)}
            {renderStatCard(<Star className="text-purple-500" size={24} />, "Average Rating", trainer.rating)}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Trainer Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderStatCard(<Users className="text-blue-500" size={24} />, "Total Clients", trainer.stats?.totalClients)}
              {renderStatCard(<Users className="text-green-500" size={24} />, "Active Clients", trainer.stats?.activeClients)}
              {renderStatCard(<Activity className="text-purple-500" size={24} />, "Classes Completed", trainer.stats?.classesCompleted)}
              {renderStatCard(<Globe className="text-indigo-500" size={24} />, "Online Sessions", trainer.stats?.onlineSessionsCompleted)}
              {renderStatCard(<MapPin className="text-red-500" size={24} />, "In-Person Sessions", trainer.stats?.inPersonSessionsCompleted)}
              {renderStatCard(<Clock className="text-yellow-500" size={24} />, "Total Hours Worked", trainer.stats?.totalHoursWorked)}
              {renderStatCard(<Clock className="text-pink-500" size={24} />, "Avg Session Duration", trainer.stats?.avgSessionDuration, " min")}
              {renderStatCard(<Users className="text-teal-500" size={24} />, "Client Retention Rate", trainer.stats?.clientRetentionRate, "%")}
              {renderStatCard(<Target className="text-orange-500" size={24} />, "Client Goals Achieved", trainer.stats?.clientGoalsAchieved, "%")}
              {renderStatCard(<Star className="text-yellow-500" size={24} />, "Top Class", trainer.stats?.topPerformingClass)}
              {renderStatCard(<DollarSign className="text-green-500" size={24} />, "Monthly Earnings", trainer.stats?.monthlyEarnings, "", true)}
              {renderStatCard(<DollarSign className="text-blue-500" size={24} />, "YTD Earnings", trainer.stats?.yearToDateEarnings, "", true)}
              {renderStatCard(<Calendar className="text-purple-500" size={24} />, "Upcoming Sessions", trainer.stats?.upcomingSessions)}
              {renderStatCard(<TrendingUp className="text-red-500" size={24} />, "Last Month Growth", trainer.stats?.lastMonthGrowth, "%")}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
              {upcomingSessions.map((session) => (
                <div key={session.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{session.clientName}</h3>
                    <span className="text-sm text-gray-500">{session.type}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-2" />
                    {session.time}, {session.date}
                  </div>
                </div>
              ))}
              <button className="text-orange-500 font-medium flex items-center mt-2">
                View All Sessions <ChevronRight size={20} />
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
              {recentReviews.map((review) => (
                <div key={review.id} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{review.clientName}</h3>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
              <button className="text-orange-500 font-medium flex items-center mt-2">
                View All Reviews <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* User menu modal */}
      {isUserMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-xl font-semibold mb-4">Menu</h2>
            <ul className="space-y-2">
              <li><button className="w-full text-left py-2 px-4 hover:bg-gray-100 rounded" onClick={() => navigate('/trainer-profile')}>View Profile</button></li>
              <li><button className="w-full text-left py-2 px-4 hover:bg-gray-100 rounded" onClick={() => navigate('/trainer-settings')}>Settings</button></li>
              <li><button className="w-full text-left py-2 px-4 hover:bg-gray-100 rounded text-red-500" onClick={() => {
                setIsAuthenticated(false);
                navigate('/login');
              }}>Logout</button></li>
            </ul>
            <button className="mt-4 w-full bg-gray-200 py-2 rounded" onClick={() => setIsUserMenuOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerDashboard;
