import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';

const Membership = ({ currentPlan, availablePlans }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Membership</h1>
        <button onClick={() => navigate('/')} className="text-orange-500 font-medium flex items-center">
          <ArrowLeft size={20} className="mr-1" /> Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
        <div className="bg-orange-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-800">{currentPlan.name}</h3>
          <p className="text-orange-800">${currentPlan.price} / month</p>
          <p className="text-sm text-orange-700 mt-2">Renews on {currentPlan.renewalDate}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {availablePlans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
            <p className="text-2xl font-bold mb-4">${plan.price} / month</p>
            <ul className="mb-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center mb-2">
                  <Check size={16} className="text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors">
              {currentPlan.id === plan.id ? 'Current Plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Membership;