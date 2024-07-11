import React, { useState } from 'react';
import { Send } from 'lucide-react';
import TrainerNavigation from './TrainerNavigation';

const TrainerChats = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');

  const chats = [
    { id: 1, name: 'John Doe', lastMessage: 'See you at the next session!', unread: 2 },
    { id: 2, name: 'Jane Smith', lastMessage: 'Thanks for the workout plan', unread: 0 },
    { id: 3, name: 'Mike Johnson', lastMessage: 'Can we reschedule?', unread: 1 },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 pb-16">
      <h1 className="text-2xl font-semibold mb-6">Chats</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {chats.map((chat) => (
            <div 
              key={chat.id} 
              className={`p-4 border-b cursor-pointer ${activeChat === chat.id ? 'bg-orange-100' : 'hover:bg-gray-50'}`}
              onClick={() => setActiveChat(chat.id)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{chat.name}</h3>
                {chat.unread > 0 && (
                  <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1">
                    {chat.unread}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
            </div>
          ))}
        </div>
        
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4">
          {activeChat ? (
            <>
              <div className="h-96 overflow-y-auto mb-4">
                {/* Chat messages would go here */}
                <p className="text-center text-gray-500">Start of conversation</p>
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-grow border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSend}
                  className="bg-orange-500 text-white px-4 py-2 rounded-r-lg hover:bg-orange-600"
                >
                  <Send size={20} />
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Select a chat to start messaging</p>
          )}
        </div>
      </div>

      <TrainerNavigation activeTab="chats" />
    </div>
  );
};

export default TrainerChats;