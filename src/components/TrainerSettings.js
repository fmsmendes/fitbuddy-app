import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Lock, Bell, Eye, CreditCard, Save, ArrowLeft,
  ToggleLeft, ToggleRight
} from 'lucide-react';
import TrainerNavigation from './TrainerNavigation';

const TrainerSettings = ({ trainer, updateTrainer }) => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (trainer) {
      setSettings({
        email: trainer.email,
        password: '',
        notifyNewMessages: true,
        notifyNewBookings: true,
        notifyReminders: true,
        profileVisibility: 'public',
        paymentMethod: 'creditCard',
        accountNumber: '****1234',
      });
      setIsLoading(false);
    }
  }, [trainer]);

  if (isLoading) {
    return <div className="max-w-4xl mx-auto p-4">Loading...</div>;
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggle = (name) => {
    setSettings(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Here you would typically send the updated settings to your backend
    updateTrainer(settings);
    // Optionally, show a success message or redirect
  };

  const renderToggle = (name, label) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-gray-700">{label}</span>
      <button 
        onClick={() => handleToggle(name)}
        className={`${settings[name] ? 'bg-green-500' : 'bg-gray-300'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
      >
        <span className={`${settings[name] ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 pb-16">
      <button onClick={() => navigate(-1)} className="mb-4 text-orange-500 font-medium flex items-center">
        <ArrowLeft size={20} className="mr-1" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">Trainer Settings</h1>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={settings.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={settings.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
            {renderToggle('notifyNewMessages', 'Notify me about new messages')}
            {renderToggle('notifyNewBookings', 'Notify me about new bookings')}
            {renderToggle('notifyReminders', 'Send me session reminders')}
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
            <div>
              <label htmlFor="profileVisibility" className="block text-sm font-medium text-gray-700">Profile Visibility</label>
              <select
                id="profileVisibility"
                name="profileVisibility"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                value={settings.profileVisibility}
                onChange={handleChange}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="buddies">Buddies Only</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Payment Method</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
                  value={settings.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="creditCard">Credit Card</option>
                  <option value="bankTransfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="accountNumber"
                    id="accountNumber"
                    className="focus:ring-orange-500 focus:border-orange-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={settings.accountNumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleSave}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <Save className="mr-2 h-5 w-5" /> Save Settings
            </button>
          </div>
        </div>
      </div>

      <TrainerNavigation activeTab="settings" />
    </div>
  );
};

export default TrainerSettings;