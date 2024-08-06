import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Send, ArrowLeft, MoreVertical, Phone, Video } from 'lucide-react';
import { supabase } from '../utils/supabase';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const STORAGE_URL = `${SUPABASE_URL}/storage/v1/object/public/profile_images/`;

const MessageBuddy = () => {
  const navigate = useNavigate();
  const { buddyId } = useParams();
  const [message, setMessage] = useState('');
  const [buddy, setBuddy] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (buddyId) {
      fetchBuddyDetails();
    }
  }, [buddyId]);

  useEffect(() => {
    if (currentUser && buddyId) {
      fetchMessages();
    }
  }, [currentUser, buddyId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150';
    if (imagePath.startsWith('http')) return imagePath;
    return `${STORAGE_URL}${imagePath}`;
  };

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) {
        console.error('Error fetching current user:', error);
      } else {
        setCurrentUser(data);
      }
    }
  };

  const fetchBuddyDetails = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', buddyId)
      .single();
    if (error) {
      console.error('Error fetching buddy details:', error);
    } else {
      setBuddy(data);
    }
  };

  const fetchMessages = async () => {
    if (!currentUser || !buddyId) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${buddyId}),and(sender_id.eq.${buddyId},receiver_id.eq.${currentUser.id})`)
      .order('sent_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
  };

  const handleSend = async () => {
    if (message.trim() && currentUser && buddyId) {
      const newMessage = {
        sender_id: currentUser.id,
        receiver_id: buddyId,
        content: message,
        //topic: 'chat', // Add this line
       // extension: 'text' // Add this line
      };

      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage]);

      if (error) {
        console.error('Error sending message:', error);
      } else {
        setMessages([...messages, { ...newMessage, sent_at: new Date().toISOString() }]);
        setMessage('');
        fetchMessages(); // Refetch messages to get the server-generated timestamp
      }
    }
  };

  if (!buddy || !currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => navigate('/buddies')} className="mr-4">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <img src={getProfileImageUrl(buddy.image_url)} alt={buddy.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
          <div>
            <h2 className="font-semibold">{buddy.name}</h2>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>
        <div className="flex items-center">
          <button className="mr-4 text-gray-600">
            <Phone size={20} />
          </button>
          <button className="mr-4 text-gray-600">
            <Video size={20} />
          </button>
          <button className="text-gray-600">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-4 ${msg.sender_id === currentUser.id ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-3 rounded-lg ${
              msg.sender_id === currentUser.id ? 'bg-orange-500 text-white' : 'bg-white'
            }`}>
              <p>{msg.content}</p>
              <p className="text-xs mt-1 opacity-75">
                {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow mr-4 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageBuddy;