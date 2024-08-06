import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckSquare, Square, ArrowLeft, Calendar, Clock, MapPin, Users, Search, X } from 'lucide-react';
import { supabase } from '../utils/supabase';
import { format } from 'date-fns';

const ClassAttendance = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classDetails, setClassDetails] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchClassDetails();
    fetchAttendees();
  }, [classId]);

  const fetchClassDetails = async () => {
    const { data, error } = await supabase
      .from('trainer_classes')
      .select('*')
      .eq('id', classId)
      .single();

    if (error) {
      console.error('Error fetching class details:', error);
    } else {
      setClassDetails(data);
    }
  };
  const fetchAttendees = async () => {
    try {
      // Step 1: Fetch class attendees
      const { data: attendeesData, error: attendeesError } = await supabase
        .from('class_attendees')
        .select('id, checked_in, user_id')
        .eq('class_id', classId);

      if (attendeesError) throw attendeesError;

      // Step 2: Fetch corresponding user details using RPC
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_users_by_ids', { user_ids: attendeesData.map(a => a.user_id) });

      if (usersError) throw usersError;

      // Combine the data
      const combinedData = attendeesData.map(attendee => ({
        ...attendee,
        user: usersData.find(user => user.id === attendee.user_id) || { email: 'N/A', name: 'N/A' }
      }));

      setAttendees(combinedData);
    } catch (error) {
      console.error('Error fetching attendees:', error);
    }
    setLoading(false);
  };

  const handleAttendanceToggle = async (attendeeId, currentStatus) => {
    const { error } = await supabase
      .from('class_attendees')
      .update({ checked_in: !currentStatus })
      .eq('id', attendeeId);

    if (error) {
      console.error('Error updating attendance:', error);
    } else {
      setAttendees(attendees.map(attendee => 
        attendee.id === attendeeId 
          ? { ...attendee, checked_in: !currentStatus } 
          : attendee
      ));
    }
  };
  const filteredAttendees = attendees.filter(attendee => 
    (attendee.user.name && attendee.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (attendee.user.email && attendee.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button 
        onClick={() => navigate('/trainer-classes')} 
        className="mb-6 flex items-center text-orange-500 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Classes
      </button>

      {classDetails && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">{classDetails.name}</h1>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Calendar size={20} className="text-gray-400 mr-2" />
              <span>{format(new Date(classDetails.date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center">
              <Clock size={20} className="text-gray-400 mr-2" />
              <span>{classDetails.start_time} - {classDetails.end_time}</span>
            </div>
            <div className="flex items-center">
              <MapPin size={20} className="text-gray-400 mr-2" />
              <span>{classDetails.location}</span>
            </div>
            <div className="flex items-center">
              <Users size={20} className="text-gray-400 mr-2" />
              <span>{attendees.length} / {classDetails.max_participants} participants</span>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Attendance</h2>
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search attendees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-center">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.map((attendee) => (
                <tr key={attendee.id} className="border-b">
                  <td className="px-4 py-2">{attendee.user.name || 'N/A'}</td>
                  <td className="px-4 py-2">{attendee.user.email || 'N/A'}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleAttendanceToggle(attendee.id, attendee.checked_in)}
                      className={`p-2 rounded-full ${
                        attendee.checked_in 
                          ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      {attendee.checked_in ? <CheckSquare size={20} /> : <Square size={20} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredAttendees.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No attendees found</p>
        )}
      </div>
    </div>
  );
};

export default ClassAttendance;