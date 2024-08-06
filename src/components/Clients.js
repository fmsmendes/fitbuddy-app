import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Edit, Trash, Plus, ArrowLeft, X, User, Mail, Phone, Calendar, Target, Activity, Heart, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import AddClient from './AddClient';

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddClient, setShowAddClient] = useState(false);
  const [clientStats, setClientStats] = useState({
    totalClients: 0,
    activeClients: 0,
    inactiveClients: 0,
    averageSessions: 0,
  });
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const getImageUrl = (imageUrl) => {
    if (imageUrl) {
      return `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/profile_images/${imageUrl}`;
    }
    return null;
  };
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .eq('trainer_id', user.id);

    if (clientsError) {
      console.error('Error fetching clients:', clientsError);
      return;
    }

    const clientsWithUserIds = clientsData.filter(client => client.user_id);
    const { data: userProfilesData, error: userProfilesError } = await supabase
      .from('user_profiles')
      .select('id, image_url')
      .in('id', clientsWithUserIds.map(client => client.user_id));

    if (userProfilesError) {
      console.error('Error fetching user profiles:', userProfilesError);
      return;
    }

    const mergedClients = clientsData.map(client => {
      const userProfile = userProfilesData.find(profile => profile.id === client.user_id);
      return {
        ...client,
        user_profiles: userProfile ? { image_url: userProfile.image_url } : null
      };
    });

    setClients(mergedClients);
    updateClientStats(mergedClients);
  };

  const updateClientStats = (clientsData) => {
    const stats = {
      totalClients: clientsData.length,
      activeClients: clientsData.filter(client => client.status === 'Active').length,
      inactiveClients: clientsData.filter(client => client.status === 'Inactive').length,
      averageSessions: clientsData.reduce((sum, client) => sum + client.total_sessions, 0) / clientsData.length,
    };
    setClientStats(stats);
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

  const handleDeleteClient = async (id) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting client:', error);
    } else {
      fetchClients();
      if (selectedClient && selectedClient.id === id) {
        setSelectedClient(null);
      }
    }
  };

  const handleAddClient = async (newClient) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('clients')
      .insert({ 
        ...newClient, 
        trainer_id: user.id,
        status: newClient.status || 'Active',
        join_date: new Date().toISOString().split('T')[0]
      })
      .select();

    if (error) {
      console.error('Error adding client:', error);
    } else {
      fetchClients();
      setShowAddClient(false);
    }
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setIsEditing(false);
  };

  const handleEdit = (client) => {
    setSelectedClient(client);
    setIsEditing(true);
  };

  const handleUpdateClient = async (updatedClient) => {
    const { data, error } = await supabase
      .from('clients')
      .update(updatedClient)
      .eq('id', updatedClient.id)
      .select();

    if (error) {
      console.error('Error updating client:', error);
    } else {
      fetchClients();
      setSelectedClient(data[0]);
      setIsEditing(false);
    }
  };
  if (showAddClient || isEditing) {
    return (
      <AddClient 
        onAddClient={handleAddClient} 
        onUpdateClient={handleUpdateClient}
        onCancel={() => {
          setShowAddClient(false);
          setIsEditing(false);
        }}
        clientToEdit={isEditing ? selectedClient : null}
      />
    );
  }

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
                <button onClick={() => handleSort('join_date')} className="font-bold flex items-center">
                  Join Date
                  {sortConfig.key === 'join_date' && (
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
              <tr key={client.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => handleSelectClient(client)}>
                <td className="py-3 px-4">{client.name}</td>
                <td className="py-3 px-4">{client.email}</td>
                <td className="py-3 px-4">{client.phone}</td>
                <td className="py-3 px-4">{client.join_date}</td>
                <td className="py-3 px-4">{client.last_session}</td>
                <td className="py-3 px-4">{client.total_sessions}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    client.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {client.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-blue-500 hover:text-blue-700 mr-2" onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(client);
                  }}>
                    <Edit size={18} />
                  </button>
                  <button className="text-red-500 hover:text-red-700" onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClient(client.id);
                  }}>
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button 
        className="mt-6 bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-600 transition-colors"
        onClick={() => setShowAddClient(true)}
      >
        <Plus size={20} className="mr-2" />
        Add New Client
      </button>
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Client Details</h2>
                <button onClick={() => setSelectedClient(null)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-4 md:mb-0 flex flex-col items-center">
                  {selectedClient.user_profiles && selectedClient.user_profiles.image_url ? (
                    <img
                      src={getImageUrl(selectedClient.user_profiles.image_url)}
                      alt={selectedClient.name}
                      className="w-40 h-40 rounded-full object-cover mb-4"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                      <User size={64} className="text-gray-400" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2">{selectedClient.name}</h3>
                  <p className="text-gray-600 mb-2">{selectedClient.email}</p>
                  <p className="text-gray-600 mb-4">{selectedClient.phone}</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedClient.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {selectedClient.status}
                  </span>
                </div>
                <div className="md:w-2/3 md:pl-6">
                  <div className="flex mb-4 border-b">
                    <button
                      className={`mr-4 py-2 ${activeTab === 'general' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}
                      onClick={() => setActiveTab('general')}
                    >
                      General Info
                    </button>
                    <button
                      className={`mr-4 py-2 ${activeTab === 'fitness' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}
                      onClick={() => setActiveTab('fitness')}
                    >
                      Fitness Details
                    </button>
                    <button
                      className={`py-2 ${activeTab === 'notes' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-500'}`}
                      onClick={() => setActiveTab('notes')}
                    >
                      Notes
                    </button>
                  </div>

                  {activeTab === 'general' && (
                    <div className="grid grid-cols-2 gap-4">
                      <ClientInfoItem icon={Calendar} label="Date of Birth" value={selectedClient.date_of_birth} />
                      <ClientInfoItem icon={User} label="Gender" value={selectedClient.gender} />
                      <ClientInfoItem icon={Calendar} label="Join Date" value={selectedClient.join_date} />
                      <ClientInfoItem icon={AlertCircle} label="Emergency Contact" value={selectedClient.emergency_contact} />
                      <ClientInfoItem icon={Mail} label="Preferred Contact" value={selectedClient.preferred_contact_method} />
                    </div>
                  )}

                  {activeTab === 'fitness' && (
                    <div className="space-y-4">
                      <ClientInfoItem icon={Activity} label="Fitness Level" value={selectedClient.fitness_level} />
                      <div>
                        <p className="font-semibold flex items-center mb-1"><Target size={16} className="mr-2" /> Goals:</p>
                        <p>{selectedClient.goals ? selectedClient.goals.join(', ') : 'N/A'}</p>
                      </div>
                      <ClientInfoItem icon={Heart} label="Medical History" value={selectedClient.medical_history || 'N/A'} />
                      <ClientInfoItem icon={Calendar} label="Last Session" value={selectedClient.last_session || 'N/A'} />
                      <ClientInfoItem icon={Activity} label="Total Sessions" value={selectedClient.total_sessions} />
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div>
                      <p className="font-semibold mb-2">Notes:</p>
                      <p className="bg-gray-100 p-3 rounded">{selectedClient.notes || 'No notes available.'}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4">
                <button 
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  onClick={() => setSelectedClient(null)}
                >
                  Close
                </button>
                <button 
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  onClick={() => handleEdit(selectedClient)}
                >
                  Edit Client
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
// Helper component for client info items
const ClientInfoItem = ({ icon: Icon, label, value }) => (
  <div>
    <p className="font-semibold flex items-center mb-1"><Icon size={16} className="mr-2" /> {label}:</p>
    <p>{value}</p>
  </div>
);

export default Clients;