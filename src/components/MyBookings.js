import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

const MyBookings = ({ bookings }) => {
  const navigate = useNavigate();

  const renderBooking = (booking) => (
    <div key={booking.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="font-semibold text-lg mb-2">{booking.trainerName}</h3>
      <p className="text-sm text-gray-600 mb-2">
        <Calendar className="inline-block mr-2" size={16} />
        {booking.date}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        <Clock className="inline-block mr-2" size={16} />
        {booking.time}
      </p>
      <p className="text-sm text-gray-600">{booking.type}</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <button onClick={() => navigate('/')} className="text-orange-500 font-medium flex items-center">
          <ArrowLeft size={20} className="mr-1" /> Back to Dashboard
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
        {bookings.filter(booking => new Date(booking.date) >= new Date()).map(renderBooking)}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Past Bookings</h2>
        {bookings.filter(booking => new Date(booking.date) < new Date()).map(renderBooking)}
      </div>
    </div>
  );
};

export default MyBookings;