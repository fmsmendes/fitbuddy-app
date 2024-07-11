import React from 'react';
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
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;