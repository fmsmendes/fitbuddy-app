import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign, TrendingUp, Calendar, Users, ChevronDown, ChevronUp, Download, CreditCard, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TrainerNavigation from './TrainerNavigation';

const TrainerFinancials = () => {
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [showTransactions, setShowTransactions] = useState(false);

  const timeframes = {
    week: { label: 'This Week', days: 7 },
    month: { label: 'This Month', days: 30 },
    quarter: { label: 'This Quarter', days: 90 },
    year: { label: 'This Year', days: 365 },
  };

  const generateChartData = (days) => {
    const data = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        earnings: Math.floor(Math.random() * 500) + 100,
      });
    }
    return data;
  };

  const chartData = generateChartData(timeframes[selectedTimeframe].days);

  const calculateTotal = (data) => {
    return data.reduce((sum, day) => sum + day.earnings, 0).toFixed(2);
  };

  const transactions = [
    { id: 1, type: 'income', amount: 150, description: 'Personal Training Session', date: '2024-07-10' },
    { id: 2, type: 'income', amount: 200, description: 'Group Class', date: '2024-07-11' },
    { id: 3, type: 'expense', amount: 50, description: 'Equipment Purchase', date: '2024-07-12' },
    { id: 4, type: 'income', amount: 175, description: 'Online Coaching Session', date: '2024-07-13' },
    { id: 5, type: 'income', amount: 125, description: 'Personal Training Session', date: '2024-07-14' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 pb-16">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/trainer-dashboard')} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold">Financials</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <DollarSign className="text-green-500 mr-2" size={24} />
            <h2 className="text-lg font-semibold">Total Earnings</h2>
          </div>
          <p className="text-2xl font-bold">${calculateTotal(chartData)}</p>
          <p className="text-sm text-gray-500">{timeframes[selectedTimeframe].label}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <TrendingUp className="text-blue-500 mr-2" size={24} />
            <h2 className="text-lg font-semibold">This Month</h2>
          </div>
          <p className="text-2xl font-bold">$1,200</p>
          <p className="text-sm text-gray-500">Monthly Earnings</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <Calendar className="text-purple-500 mr-2" size={24} />
            <h2 className="text-lg font-semibold">Sessions</h2>
          </div>
          <p className="text-2xl font-bold">24</p>
          <p className="text-sm text-gray-500">This Month</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center mb-2">
            <Users className="text-orange-500 mr-2" size={24} />
            <h2 className="text-lg font-semibold">Active Clients</h2>
          </div>
          <p className="text-2xl font-bold">18</p>
          <p className="text-sm text-gray-500">Current</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Earnings Over Time</h2>
          <select
            className="border rounded-lg px-3 py-2"
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
          >
            {Object.entries(timeframes).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="earnings" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <button
            className="text-blue-500 hover:text-blue-700 flex items-center"
            onClick={() => setShowTransactions(!showTransactions)}
          >
            {showTransactions ? 'Hide' : 'Show'} All
            {showTransactions ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-2">Date</th>
              <th className="pb-2">Description</th>
              <th className="pb-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, showTransactions ? transactions.length : 3).map((transaction) => (
              <tr key={transaction.id}>
                <td className="py-2">{transaction.date}</td>
                <td>{transaction.description}</td>
                <td className={transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Earnings Breakdown</h2>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">By Service Type</h3>
          <div className="flex items-center mb-2">
            <div className="w-1/4 h-4 bg-blue-500 rounded-l"></div>
            <div className="w-1/2 h-4 bg-green-500"></div>
            <div className="w-1/4 h-4 bg-yellow-500 rounded-r"></div>
          </div>
          <div className="flex justify-between text-sm">
            <span>Personal Training (25%)</span>
            <span>Group Classes (50%)</span>
            <span>Online Coaching (25%)</span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">By Time of Day</h3>
          <div className="flex items-center mb-2">
            <div className="w-1/3 h-4 bg-purple-500 rounded-l"></div>
            <div className="w-1/3 h-4 bg-pink-500"></div>
            <div className="w-1/3 h-4 bg-indigo-500 rounded-r"></div>
          </div>
          <div className="flex justify-between text-sm">
            <span>Morning (33%)</span>
            <span>Afternoon (33%)</span>
            <span>Evening (33%)</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Current Payment Method</h3>
          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <CreditCard size={24} className="mr-3 text-blue-500" />
            <div>
              <p className="font-medium">Visa ending in 1234</p>
              <p className="text-sm text-gray-600">Expires 12/2025</p>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Add New Payment Method</h3>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-600 transition-colors">
            <Plus size={20} className="mr-2" />
            Add New Card
          </button>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Payment Settings</h3>
          <div className="flex items-center justify-between mb-2">
            <span>Auto-withdraw earnings</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <p className="text-sm text-gray-600">Automatically withdraw earnings to your bank account when they reach $100</p>
        </div>
      </div>

      <div className="flex justify-end mb-8">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors">
          <Download size={20} className="mr-2" />
          Download Financial Report
        </button>
      </div>

      <TrainerNavigation activeTab="financials" />
    </div>
  );
};

export default TrainerFinancials;
