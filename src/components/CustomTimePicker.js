import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const CustomTimePicker = ({ initialTime, onTimeChange, onClose }) => {
  const [hours, setHours] = useState(initialTime?.hours || 12);
  const [minutes, setMinutes] = useState(initialTime?.minutes || 0);
  const [ampm, setAmpm] = useState(initialTime?.ampm || 'PM');

  const incrementHours = () => setHours(h => (h % 12) + 1);
  const decrementHours = () => setHours(h => (h - 2 + 12) % 12 + 1);
  const incrementMinutes = () => setMinutes(m => (m + 5) % 60);
  const decrementMinutes = () => setMinutes(m => (m - 5 + 60) % 60);

  const handleOk = () => {
    onTimeChange({ hours, minutes, ampm });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-black text-lg font-semibold mb-4">ENTER TIME</h2>
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="flex flex-col items-center">
            <button onClick={incrementHours} className="text-orange-500 hover:text-orange-600">
              <ChevronUp size={24} />
            </button>
            <div className="bg-orange-100 text-black text-4xl font-bold w-20 h-20 flex items-center justify-center rounded-lg">
              {hours.toString().padStart(2, '0')}
            </div>
            <button onClick={decrementHours} className="text-orange-500 hover:text-orange-600">
              <ChevronDown size={24} />
            </button>
            <span className="text-gray-600 text-sm mt-1">Hour</span>
          </div>
          <div className="text-black text-4xl font-bold">:</div>
          <div className="flex flex-col items-center">
            <button onClick={incrementMinutes} className="text-orange-500 hover:text-orange-600">
              <ChevronUp size={24} />
            </button>
            <div className="bg-orange-500 text-white text-4xl font-bold w-20 h-20 flex items-center justify-center rounded-lg">
              {minutes.toString().padStart(2, '0')}
            </div>
            <button onClick={decrementMinutes} className="text-orange-500 hover:text-orange-600">
              <ChevronDown size={24} />
            </button>
            <span className="text-gray-600 text-sm mt-1">Minute</span>
          </div>
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => setAmpm('AM')}
              className={`w-16 h-8 rounded-full text-sm font-semibold ${
                ampm === 'AM' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              AM
            </button>
            <button 
              onClick={() => setAmpm('PM')}
              className={`w-16 h-8 rounded-full text-sm font-semibold ${
                ampm === 'PM' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              PM
            </button>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors"
          >
            CANCEL
          </button>
          <button 
            onClick={handleOk}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTimePicker;