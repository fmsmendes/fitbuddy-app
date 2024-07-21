<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Send, Phone, Video, MoreVertical, ChevronLeft } from 'lucide-react';
import TrainerNavigation from './TrainerNavigation';

const TrainerChats = () => {
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const chats = [
    { id: 1, name: 'John Doe', lastMessage: 'See you at the next session!', unread: 2, avatar: 'https://randomuser.me/api/portraits/men/1.jpg', lastMessageTime: '10:30 AM' },
    { id: 2, name: 'Jane Smith', lastMessage: 'Thanks for the workout plan', unread: 0, avatar: 'https://randomuser.me/api/portraits/women/2.jpg', lastMessageTime: 'Yesterday' },
    { id: 3, name: 'Mike Johnson', lastMessage: 'Can we reschedule?', unread: 1, avatar: 'https://randomuser.me/api/portraits/men/3.jpg', lastMessageTime: 'Mon' },
  ];

  const messages = [
    { id: 1, senderId: 1, text: "Hi trainer! I'm excited about our session tomorrow.", timestamp: '10:00 AM' },
    { id: 2, senderId: 'trainer', text: "That's great! I'm looking forward to it too. Don't forget to bring water and a towel.", timestamp: '10:05 AM' },
    { id: 3, senderId: 1, text: "Will do! See you then!", timestamp: '10:10 AM' },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

=======
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

>>>>>>> ef830e1 (Save local changes before rebase)
  const handleSend = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

<<<<<<< HEAD
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 pb-16 h-screen flex flex-col">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/trainer-dashboard')} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold">Chats</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {(!isMobile || !activeChat) && (
          <div className={`${isMobile && activeChat ? 'hidden' : 'flex flex-col'} w-full md:w-1/3 pr-4 overflow-hidden`}>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search chats..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex items-center p-3 border-b cursor-pointer ${
                    activeChat === chat.id ? 'bg-orange-100' : ''
                  }`}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full mr-3" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{chat.name}</h3>
                      <span className="text-xs text-gray-500">{chat.lastMessageTime}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full ml-2">
                      {chat.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {(!isMobile || activeChat) && (
          <div className={`${isMobile && !activeChat ? 'hidden' : 'flex flex-col'} w-full md:w-2/3 pl-4 overflow-hidden`}>
            {activeChat ? (
              <div className="bg-white rounded-lg shadow-md flex flex-col h-full">
                <div className="p-4 border-b flex justify-between items-center">
                  {isMobile && (
                    <button onClick={() => setActiveChat(null)} className="mr-2">
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  <div className="flex items-center">
                    <img 
                      src={chats.find((chat) => chat.id === activeChat)?.avatar} 
                      alt={chats.find((chat) => chat.id === activeChat)?.name} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <h2 className="text-xl font-semibold">
                      {chats.find((chat) => chat.id === activeChat)?.name}
                    </h2>
                  </div>
                  <div className="flex items-center">
                    <button className="text-gray-600 hover:text-gray-800 mr-4">
                      <Phone size={20} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 mr-4">
                      <Video size={20} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`mb-4 ${msg.senderId === 'trainer' ? 'text-right' : ''}`}>
                      <div className={`inline-block p-2 rounded-lg ${
                        msg.senderId === 'trainer' ? 'bg-orange-100' : 'bg-gray-100'
                      }`}>
                        <p>{msg.text}</p>
                        <p className="text-xs text-gray-500 mt-1">{msg.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 border rounded-l-lg px-4 py-2"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button
                      className="bg-orange-500 text-white px-4 py-2 rounded-r-lg hover:bg-orange-600"
                      onClick={handleSend}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a chat to start messaging
              </div>
            )}
          </div>
        )}
=======
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
>>>>>>> ef830e1 (Save local changes before rebase)
      </div>

      <TrainerNavigation activeTab="chats" />
    </div>
  );
};

<<<<<<< HEAD
export default TrainerChats;
=======
export default TrainerChats;
>>>>>>> ef830e1 (Save local changes before rebase)
