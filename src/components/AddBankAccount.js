import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building } from 'lucide-react';

const AddBankAccount = () => {
  const navigate = useNavigate();
  const [accountDetails, setAccountDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    routingNumber: '',
    bankName: ''
  });

  const handleChange = (e) => {
    setAccountDetails({ ...accountDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the account details to your payment processor
    console.log('Submitting bank account details:', accountDetails);
    // After processing, navigate back to the financials page
    navigate('/trainer-financials');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/trainer-financials')} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold">Add Bank Account</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accountHolderName">
            Account Holder Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="accountHolderName"
            type="text"
            placeholder="John Doe"
            name="accountHolderName"
            value={accountDetails.accountHolderName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accountNumber">
            Account Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="accountNumber"
            type="text"
            placeholder="123456789"
            name="accountNumber"
            value={accountDetails.accountNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="routingNumber">
            Routing Number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="routingNumber"
            type="text"
            placeholder="987654321"
            name="routingNumber"
            value={accountDetails.routingNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bankName">
            Bank Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="bankName"
            type="text"
            placeholder="Bank of America"
            name="bankName"
            value={accountDetails.bankName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add Bank Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBankAccount;
