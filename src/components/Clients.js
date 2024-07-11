import React from 'react';

const Clients = () => {
  // This is a placeholder. You'll want to fetch actual client data in a real application.
  const clients = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    // Add more mock clients as needed
  ];

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Clients</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {clients.map((client) => (
          <div key={client.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-lg font-semibold">{client.name}</h2>
            <p className="text-gray-600">{client.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;
