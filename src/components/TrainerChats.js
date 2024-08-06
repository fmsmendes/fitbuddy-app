import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Send, Phone, Video, MoreVertical, ChevronLeft } from 'lucide-react';
import TrainerNavigation from './TrainerNavigation';
import { supabase } from '../utils/supabase';

const TrainerChats = () => {
  const navigate = useNavigate();
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchChats();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchChats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('trainer_id', user.id);

      if (error) throw error;
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  const handleSend = async () => {
    if (message.trim()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user logged in');

        const { data, error } = await supabase
          .from('messages')
          .insert({
            chat_id: activeChat,
            sender_id: user.id,
            text: message,
          });

        if (error) throw error;

        setMessages([...messages, { id: data[0].id, senderId: user.id, text: message, timestamp: new Date().toLocaleTimeString() }]);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

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
      </div>
      <TrainerNavigation activeTab="chats" />
    </div>
  );
};

export default TrainerChats;