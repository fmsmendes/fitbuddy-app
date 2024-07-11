import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Edit, Trash, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '(555) 123-4567', joinDate: '2023-01-15', lastSession: '2023-07-01', totalSessions: 15, status: 'Active', goals: ['Weight loss', 'Muscle gain'], notes: 'Prefers morning sessions' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '(555) 987-6543', joinDate: '2023-02-20', lastSession: '2023-06-28', totalSessions: 12, status: 'Active', goals: ['Flexibility', 'Endurance'], notes: 'Allergic to latex' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '(555) 246-8135', joinDate: '2023-03-10', lastSession: '2023-05-15', totalSessions: 8, status: 'Inactive', goals: ['Strength training'], notes: 'Recovering from knee surgery' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filterStatus, setFilterStatus] = useState('All');

  const clientStats = {
    totalClients: clients.length,
    activeClients: clients.filter(client => client.status === 'Active').length,
    inactiveClients: clients.filter(client => client.status === 'Inactive').length,
    averageSessions: clients.reduce((sum, client) => sum + client.totalSessions, 0) / clients.length,
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedClients = [...clients].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredClients = sortedClients.filter(client =>
    (filterStatus === 'All' || client.status === filterStatus) &&
    (client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteClient = (id) => {
    setClients(clients.filter(client => client.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate('/trainer-dashboard')} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold">Clients</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Total Clients</h2>
          <p className="text-3xl font-bold text-orange-500">{clientStats.totalClients}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Active Clients</h2>
          <p className="text-3xl font-bold text-green-500">{clientStats.activeClients}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Inactive Clients</h2>
          <p className="text-3xl font-bold text-red-500">{clientStats.inactiveClients}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Avg Sessions</h2>
          <p className="text-3xl font-bold text-blue-500">{clientStats.averageSessions.toFixed(1)}</p>
        </div>
      </div>
      
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div className="relative w-full md:w-64 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search clients..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        
        <div className="flex items-center">
          <Filter className="mr-2 text-gray-500" size={20} />
          <select
            className="border rounded-lg px-3 py-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-3 px-4 text-left">
                <button onClick={() => handleSort('name')} className="font-bold flex items-center">
                  Name
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </button>
              </th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">
                <button onClick={() => handleSort('joinDate')} className="font-bold flex items-center">
                  Join Date
                  {sortConfig.key === 'joinDate' && (
                    sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </button>
              </th>
              <th className="py-3 px-4 text-left">Last Session</th>
              <th className="py-3 px-4 text-left">Total Sessions</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{client.name}</td>
                <td className="py-3 px-4">{client.email}</td>
                <td className="py-3 px-4">{client.phone}</td>
                <td className="py-3 px-4">{client.joinDate}</td>
                <td className="py-3 px-4">{client.lastSession}</td>
                <td className="py-3 px-4">{client.totalSessions}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    client.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-blue-500 hover:text-blue-700 mr-2">
                    <Edit size={18} />
                  </button>
                  <button className="text-red-500 hover:text-red-700" onClick={() => handleDeleteClient(client.id)}>
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-600 transition-colors">
        <Plus size={20} className="mr-2" />
        Add New Client
      </button>
    </div>
  );
};

export default Clients;
