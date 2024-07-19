import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';

const MessageBuddy = ({ buddies }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState('');
  
  const buddy = buddies.find(b => b.id === parseInt(id));

  if (!buddy) {
    return <div>Buddy not found</div>;
  }

  const handleSend = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log(`Sending message to ${buddy.name}: ${message}`);
      setMessage('');
      // Optionally, you could add the message to a local state to display it immediately
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/buddies')}
          className="flex items-center text-orange-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Buddies
        </button>
        <h1 className="text-2xl font-bold">Message {buddy.name}</h1>
      </div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center mb-4">
          <img src={buddy.image} alt={buddy.name} className="w-12 h-12 rounded-full mr-4" />
          <div>
            <h2 className="text-lg font-semibold">{buddy.name}</h2>
            <p className="text-sm text-gray-600">{buddy.distance} km away</p>
          </div>
        </div>
        <div className="h-64 overflow-y-auto mb-4 p-4 bg-gray-100 rounded-lg">
          {/* Here you would map through and display messages */}
          <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
        </div>
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow mr-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={handleSend}
            className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageBuddy;
