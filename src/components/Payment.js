import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, DollarSign, ArrowLeft } from 'lucide-react';
import AddPaymentMethod from './AddPaymentMethod';

const Payment = ({ paymentMethods, transactions, onAddPaymentMethod }) => {
  const navigate = useNavigate();
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);

  const handleAddPaymentMethod = (newPaymentMethod) => {
    onAddPaymentMethod(newPaymentMethod);
    setShowAddPaymentMethod(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Payment</h1>
        <button onClick={() => navigate('/')} className="text-orange-500 font-medium flex items-center">
          <ArrowLeft size={20} className="mr-1" /> Back to Dashboard
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
        {paymentMethods.map((method) => (
          <div key={method.id} className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center">
            <CreditCard size={24} className="text-gray-500 mr-4" />
            <div>
              <p className="font-semibold">{method.type} ending in {method.lastFour}</p>
              <p className="text-sm text-gray-600">Expires {method.expiryMonth}/{method.expiryYear}</p>
            </div>
          </div>
        ))}
        <button 
          className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
          onClick={() => setShowAddPaymentMethod(true)}
        >
          Add Payment Method
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-white rounded-lg shadow-md p-4 mb-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">{transaction.description}</p>
              <p className="text-sm text-gray-600">{transaction.date}</p>
            </div>
            <div className="flex items-center">
              <DollarSign size={16} className="text-gray-500 mr-1" />
              <span className={transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}>
                {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showAddPaymentMethod && (
        <AddPaymentMethod
          onClose={() => setShowAddPaymentMethod(false)}
          onAddPaymentMethod={handleAddPaymentMethod}
        />
      )}
    </div>
  );
};

export default Payment;