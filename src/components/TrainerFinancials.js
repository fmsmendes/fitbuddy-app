import React from 'react';
import { DollarSign, TrendingUp, CreditCard, Calendar } from 'lucide-react';
import TrainerNavigation from './TrainerNavigation';

const TrainerFinancials = () => {
  const transactions = [
    { id: 1, type: 'income', amount: 150, description: 'Personal Training Session', date: '2024-07-10' },
    { id: 2, type: 'income', amount: 200, description: 'Group Class', date: '2024-07-11' },
    { id: 3, type: 'expense', amount: 50, description: 'Equipment Purchase', date: '2024-07-12' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 pb-16">
      <h1 className="text-2xl font-semibold mb-6">Financials</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <DollarSign className="mr-2 text-green-500" /> Total Earnings
          </h2>
          <p className="text-3xl font-bold">$3,250</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2 flex items-center">
            <TrendingUp className="mr-2 text-blue-500" /> This Month
          </h2>
          <p className="text-3xl font-bold">$1,200</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
            <div>
              <p className="font-medium">{transaction.description}</p>
              <p className="text-sm text-gray-600 flex items-center">
                <Calendar size={14} className="mr-1" />
                {transaction.date}
              </p>
            </div>
            <div className={`font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
        <div className="flex items-center">
          <CreditCard size={24} className="mr-2 text-gray-500" />
          <span>Visa ending in 1234</span>
        </div>
      </div>

      <TrainerNavigation activeTab="financials" />
    </div>
  );
};

export default TrainerFinancials;