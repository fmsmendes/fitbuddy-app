import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Users, Calendar, User } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { icon: <Search size={20} />, label: 'Explore', path: '/explore' },
    { icon: <Users size={20} />, label: 'Buddies', path: '/buddies' },
    { icon: <Calendar size={20} />, label: 'Events', path: '/events' },
    { icon: <User size={20} />, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-1 px-2">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`p-2 flex flex-col items-center ${
            location.pathname === item.path ? 'text-orange-500' : 'text-gray-500'
          }`}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
