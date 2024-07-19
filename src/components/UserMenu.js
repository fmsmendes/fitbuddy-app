import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, BookOpen, Eye, CreditCard, Settings, HelpCircle, LogOut } from 'lucide-react';

const UserMenu = ({ isOpen, onClose, setIsAuthenticated }) => {
  const menuItems = [
    { icon: <Calendar size={20} />, label: 'My Events', path: '/my-events' },
    { icon: <BookOpen size={20} />, label: 'My Bookings', path: '/my-bookings' },
    { icon: <CreditCard size={20} />, label: 'Membership', path: '/membership' },
    { icon: <CreditCard size={20} />, label: 'Payment', path: '/payment' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    { icon: <HelpCircle size={20} />, label: 'Help & Feedback', path: '/help-feedback' },
  ];

  const handleLogout = () => {
    setIsAuthenticated(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-orange-100 text-orange-500">
            <img src="https://via.placeholder.com/150" alt="User" className="h-24 w-24 rounded-full" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Diana Soto</h3>
          <p className="text-sm text-gray-500">Buddy</p>
        </div>
        <div className="mt-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
              onClick={onClose}
            >
              <span className="text-orange-500 mr-3">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
          <div
            className="flex items-center p-3 hover:bg-gray-100 cursor-pointer text-red-500"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;