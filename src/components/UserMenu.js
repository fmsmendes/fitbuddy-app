import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, Eye, CreditCard, Settings, HelpCircle, LogOut } from 'lucide-react';
import { signOut, supabase } from '../utils/supabase';

const UserMenu = ({ isOpen, onClose, setIsAuthenticated, currentUser }) => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser && currentUser.id) {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('name, role, image_url')
          .eq('id', currentUser.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setUserProfile(data);
        }
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  const getPublicImageUrl = (path) => {
    if (!path) return currentUser?.user_metadata?.avatar_url || "https://via.placeholder.com/150";
    try {
      const { data } = supabase.storage
        .from('profile_images')
        .getPublicUrl(path);
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting public URL:', error);
      return currentUser?.user_metadata?.avatar_url || "https://via.placeholder.com/150";
    }
  };

  const menuItems = [
    { icon: <Calendar size={20} />, label: 'My Events', path: '/my-events' },
    { icon: <BookOpen size={20} />, label: 'My Bookings', path: '/my-bookings' },
    { icon: <Calendar size={20} />, label: 'My Agenda', path: '/my-agenda' },
    { icon: <Eye size={20} />, label: 'View my public profile', path: '/public-profile' },
    { icon: <CreditCard size={20} />, label: 'Membership', path: '/membership' },
    { icon: <CreditCard size={20} />, label: 'Payment', path: '/payment' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    { icon: <HelpCircle size={20} />, label: 'Help & Feedback', path: '/help-feedback' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      onClose();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error.message);
      alert('Failed to log out. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <div className="mt-3 text-center">
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-orange-100 text-orange-500">
            <img 
              src={getPublicImageUrl(userProfile?.image_url)} 
              alt={userProfile?.name || 'User'} 
              className="h-24 w-24 rounded-full object-cover"
            />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">{userProfile?.name || 'User'}</h3>
          <p className="text-sm text-gray-500">{userProfile?.role || 'Buddy'}</p>
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