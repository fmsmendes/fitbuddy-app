import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, DollarSign, MessageCircle, User } from 'lucide-react';

const TrainerNavigation = ({ activeTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2">
      {[
        { icon: <Home />, label: 'Home', tab: 'home', path: '/trainer-dashboard' },
        { icon: <Users />, label: 'Classes', tab: 'classes', path: '/trainer-classes' },
        { icon: <DollarSign />, label: 'Financials', tab: 'financials', path: '/trainer-financials' },
        { icon: <MessageCircle />, label: 'Chats', tab: 'chats', path: '/trainer-chats' },
        { icon: <User />, label: 'Profile', tab: 'profile', path: '/trainer-profile' },
      ].map((item) => (
        <Link
          key={item.tab}
          to={item.path}
          className={`p-2 flex flex-col items-center ${activeTab === item.tab ? 'text-orange-500' : 'text-gray-500'}`}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default TrainerNavigation;