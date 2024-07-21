import React from 'react';
<<<<<<< HEAD
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
=======
import { Link } from 'react-router-dom';
import { Search, Users, Calendar, User } from 'lucide-react';

const Navigation = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2">
      {[
        { icon: <Search />, label: 'Explore', tab: 'explore' },
        { icon: <Users />, label: 'Buddies', tab: 'buddies' },
        { icon: <Calendar />, label: 'Events', tab: 'events' },
        { icon: <User />, label: 'Profile', tab: 'profile' },
      ].map((item) => (
        <Link
          key={item.tab}
          to={`/${item.tab}`}
          className={`p-2 flex flex-col items-center ${activeTab === item.tab ? 'text-orange-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab(item.tab)}
>>>>>>> ef830e1 (Save local changes before rebase)
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

<<<<<<< HEAD
export default Navigation;
=======
export default Navigation;
>>>>>>> ef830e1 (Save local changes before rebase)
