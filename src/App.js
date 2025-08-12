//coolfeatures
import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, DollarSign, Heart, Wheat, Filter, Syringe, CalendarClock, User, Menu, X } from 'lucide-react';
import { 
getGoats,
  createGoat,
  updateGoat,
  deleteGoat,
  getFinancials,
  createFinancial,
  updateFinancial,
  deleteFinancial,
  getFeeds,
  createFeed,
  updateFeed,
  deleteFeed,
  getMedications,
  createMedication,
  updateMedication,
  deleteMedication
  // ... other API functions
} from './api';



const App = () => {
  const [goats, setGoats] = useState([]);

  const [medications, setMedications] = useState([]);

  const [financialEntries, setFinancialEntries] = useState([]);

  const [feedInventory, setFeedInventory] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const [goatsRes, financialsRes, feedsRes, medsRes] = await Promise.all([
        getGoats(),
        getFinancials(),
        getFeeds(),
        getMedications()
      ]);

      setGoats(goatsRes.data);
      setFinancialEntries(financialsRes.data);
      setFeedInventory(feedsRes.data);
      setMedications(medsRes.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
}, []);


  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFinancialForm, setShowFinancialForm] = useState(false);
  const [showFeedForm, setShowFeedForm] = useState(false);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [showAddMedicationToGoatForm, setShowAddMedicationToGoatForm] = useState(false);
  const [selectedGoatForMedication, setSelectedGoatForMedication] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Edit states
  const [editingFinancialEntry, setEditingFinancialEntry] = useState(null);
  const [editingFeedItem, setEditingFeedItem] = useState(null);
  const [editingMedication, setEditingMedication] = useState(null);
  

  const [newGoat, setNewGoat] = useState({
    name: '',
    breed: '',
    age: '',
    gender: '',
    weight: '',
    status: 'Healthy',
    lastHealthCheck: '',
    nextVaccination: '',
    medicalHistory: '',
    feedType: '',
    dailyFeed: '',
    cost: '',
    revenue: '',
    notes: '',
    owner: ''
  });

  const [medicalHistoryString, setMedicalHistoryString] = useState('');

  const [newFinancialEntry, setNewFinancialEntry] = useState({
    type: 'income',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [newFeedItem, setNewFeedItem] = useState({
    name: '',
    purchased: '',
    unit: 'kg',
    used: ''
  });

  const [newMedication, setNewMedication] = useState({
    name: '',
    type: 'Treatment',
    purchased: '',
    unit: 'ml',
    used: ''
  });

  const [newGoatMedication, setNewGoatMedication] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    dosage: '',
    nextDue: '',
    notes: ''
  });

  const [editingGoat, setEditingGoat] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoat(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFinancialInputChange = (e) => {
    const { name, value } = e.target;
    setNewFinancialEntry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeedInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeedItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMedicationInputChange = (e) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoatMedicationInputChange = (e) => {
    const { name, value } = e.target;
    setNewGoatMedication(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const medicalHistoryArray = medicalHistoryString
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);

  const goatData = {
    name: newGoat.name || "",
    breed: newGoat.breed || "",
    age: newGoat.age ? parseInt(newGoat.age, 10) : null,
    gender: newGoat.gender || "",
    weight: newGoat.weight ? parseFloat(newGoat.weight) : null,
    status: newGoat.status || "",
    lastHealthCheck: newGoat.lastHealthCheck || null,
    nextVaccination: newGoat.nextVaccination || null,
    feedType: newGoat.feedType || "",
    dailyFeed: newGoat.dailyFeed ? parseFloat(newGoat.dailyFeed) : 0,
    cost: newGoat.cost ? parseFloat(newGoat.cost) : 0,
    revenue: newGoat.revenue ? parseFloat(newGoat.revenue) : 0,
    notes: newGoat.notes || "",
    owner: newGoat.owner || "",
    medicalHistory: medicalHistoryArray
  };

  try {
    if (editingGoat) {
      await updateGoat(editingGoat.id, goatData);
      setGoats(goats.map(g => g.id === editingGoat.id ? { ...goatData, id: editingGoat.id } : g));
    } else {
      const response = await createGoat(goatData);
      setGoats([...goats, response.data]);
    }
    resetForm();
  } catch (error) {
    console.error("Error saving goat:", error.response?.data || error.message);
  }
};


const handleFinancialSubmit = async (e) => {
  e.preventDefault();

  const financialData = {
    type: newFinancialEntry.type || "income",
    category: newFinancialEntry.category || "",
    amount: parseFloat(newFinancialEntry.amount) || 0,
    date: newFinancialEntry.date || new Date().toISOString(),
    description: newFinancialEntry.description || ""
  };

  try {
    if (editingFinancialEntry) {
      await updateFinancial(editingFinancialEntry.id, financialData);
      setFinancialEntries(prev => prev.map(entry =>
        entry.id === editingFinancialEntry.id ? { ...financialData, id: editingFinancialEntry.id } : entry
      ));
    } else {
      const response = await createFinancial(financialData);
      setFinancialEntries(prev => [...prev, response.data]);
    }
    resetFinancialForm();
  } catch (error) {
    console.error("Error saving financial entry:", error.response?.data || error.message);
  }
};

const handleFeedSubmit = async (e) => {
  e.preventDefault();

  const feedData = {
    name: newFeedItem.name || "",
    purchased: parseFloat(newFeedItem.purchased) || 0,
    used: parseFloat(newFeedItem.used) || 0,
    quantity: (parseFloat(newFeedItem.purchased) || 0) - (parseFloat(newFeedItem.used) || 0),
    unit: newFeedItem.unit || "kg"
  };

  try {
    if (editingFeedItem) {
      await updateFeed(editingFeedItem.id, feedData);
      setFeedInventory(prev => prev.map(item =>
        item.id === editingFeedItem.id ? { ...feedData, id: editingFeedItem.id } : item
      ));
    } else {
      const response = await createFeed(feedData);
      setFeedInventory(prev => [...prev, response.data]);
    }
    resetFeedForm();
  } catch (error) {
    console.error("Error saving feed item:", error.response?.data || error.message);
  }
};

const handleMedicationSubmit = async (e) => {
  e.preventDefault();

  const medicationData = {
    name: newMedication.name || "",
    type: newMedication.type || "Treatment",
    quantity: (parseFloat(newMedication.purchased) || 0) - (parseFloat(newMedication.used) || 0),
    unit: newMedication.unit || "ml",
    purchased: parseFloat(newMedication.purchased) || 0,
    used: parseFloat(newMedication.used) || 0,
    nextDue: newMedication.nextDue || null
  };

  try {
    if (editingMedication) {
      await updateMedication(editingMedication.id, medicationData);
      setMedications(prev => prev.map(med =>
        med.id === editingMedication.id ? { ...medicationData, id: editingMedication.id } : med
      ));
    } else {
      const response = await createMedication(medicationData);
      setMedications(prev => [...prev, response.data]);
    }
    resetMedicationForm();
  } catch (error) {
    console.error("Error saving medication:", error.response?.data || error.message);
  }
};


  const handleEdit = (goat) => {
    setNewGoat({
      ...goat,
      medicalHistory: Array.isArray(goat.medicalHistory) ? goat.medicalHistory : [],
      age: goat.age.toString(),
      weight: goat.weight.toString(),
      cost: goat.cost.toString(),
      revenue: goat.revenue.toString(),
      dailyFeed: goat.dailyFeed.toString(),
      owner: goat.owner || ''
    });
    setMedicalHistoryString(
    Array.isArray(goat.medicalHistory) ? goat.medicalHistory.join(', ') : ''
  );
    setEditingGoat(goat);
    setShowAddForm(true);
  };

  const handleEditFinancialEntry = (entry) => {
    setNewFinancialEntry({
      ...entry,
      amount: entry.amount.toString()
    });
    setEditingFinancialEntry(entry);
    setShowFinancialForm(true);
  };

  const handleEditFeedItem = (item) => {
    setNewFeedItem({
      ...item,
      purchased: item.purchased.toString(),
      used: item.used.toString()
    });
    setEditingFeedItem(item);
    setShowFeedForm(true);
  };

  const handleEditMedication = (med) => {
    setNewMedication({
      ...med,
      purchased: med.purchased.toString(),
      used: med.used.toString()
    });
    setEditingMedication(med);
    setShowMedicationForm(true);
  };

  const handleDelete = async (id) => {
  try {
    await deleteGoat(id);
    setGoats(goats.filter(goat => goat.id !== id));
  } catch (error) {
    console.error('Error deleting goat:', error);
  }
};

  const handleDeleteFinancialEntry = (id) => {
    setFinancialEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleDeleteFeedItem = (id) => {
    setFeedInventory(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteMedication = (id) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };

  const handleDeleteGoatMedication = (goatId, medicationId) => {
    setGoats(prev => prev.map(goat => 
      goat.id === goatId 
        ? { ...goat, medications: goat.medications.filter(med => med.id !== medicationId) }
        : goat
    ));
  };

  const filteredGoats = goats.filter(goat => {
    const matchesSearch = goat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goat.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (goat.owner && goat.owner.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || goat.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalGoats = goats.length;
  const totalCost = goats.reduce((sum, goat) => sum + goat.cost, 0);
  const totalRevenue = goats.reduce((sum, goat) => sum + goat.revenue, 0);
  const healthyGoats = goats.filter(goat => goat.status === 'Healthy').length;

  const totalIncome = financialEntries
    .filter(entry => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalExpenses = financialEntries
    .filter(entry => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  const resetForm = () => {
    setNewGoat({
      name: '',
      breed: '',
      age: '',
      gender: '',
      weight: '',
      status: 'Healthy',
      lastHealthCheck: '',
      nextVaccination: '',
      medicalHistory: '',
      feedType: '',
      dailyFeed: '',
      cost: '',
      revenue: '',
      notes: '',
      owner: ''
    });
    setEditingGoat(null);
    setShowAddForm(false);
  };

  const resetFinancialForm = () => {
    setNewFinancialEntry({
      type: 'income',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
    setEditingFinancialEntry(null);
    setShowFinancialForm(false);
  };

  const resetFeedForm = () => {
    setNewFeedItem({
      name: '',
      purchased: '',
      unit: 'kg',
      used: ''
    });
    setEditingFeedItem(null);
    setShowFeedForm(false);
  };

  const resetMedicationForm = () => {
    setNewMedication({
      name: '',
      type: 'Treatment',
      purchased: '',
      unit: 'ml',
      used: ''
    });
    setEditingMedication(null);
    setShowMedicationForm(false);
  };

  const resetGoatMedicationForm = () => {
    setNewGoatMedication({
      name: '',
      date: new Date().toISOString().split('T')[0],
      dosage: '',
      nextDue: '',
      notes: ''
    });
    setShowAddMedicationToGoatForm(false);
    setSelectedGoatForMedication(null);
  };

  const openAddMedicationToGoat = (goat) => {
    setSelectedGoatForMedication(goat);
    setShowAddMedicationToGoatForm(true);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Calendar },
    { id: 'goats', label: 'Goat Management', icon: Heart },
    { id: 'health', label: 'Health Reports', icon: Heart },
    { id: 'finance', label: 'Financial Reports', icon: DollarSign },
    { id: 'feed', label: 'Feed Management', icon: Wheat },
    { id: 'medication', label: 'Medication', icon: Syringe }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-500 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-full">
                <Wheat className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GoatFarm Manager</h1>
                <p className="text-xs text-gray-600 hidden sm:block">Comprehensive goat farming solution</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden bg-green-500 text-white p-2 rounded-lg"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="hidden md:flex space-x-2">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 transition-colors duration-200 shadow-lg text-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden lg:inline">Add Goat</span>
                </button>
                <button
                  onClick={() => {
                    resetFinancialForm();
                    setShowFinancialForm(true);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 transition-colors duration-200 shadow-lg text-sm"
                >
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden lg:inline">Add Financial</span>
                </button>
                <button
                  onClick={() => {
                    resetFeedForm();
                    setShowFeedForm(true);
                  }}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 transition-colors duration-200 shadow-lg text-sm"
                >
                  <Wheat className="h-4 w-4" />
                  <span className="hidden lg:inline">Add Feed</span>
                </button>
                <button
                  onClick={() => {
                    resetMedicationForm();
                    setShowMedicationForm(true);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-semibold flex items-center space-x-1 transition-colors duration-200 shadow-lg text-sm"
                >
                  <Syringe className="h-4 w-4" />
                  <span className="hidden lg:inline">Add Medication</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Action Buttons */}
      <div className="md:hidden fixed bottom-4 right-4 z-30">
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg"
          >
            <Plus className="h-5 w-5" />
          </button>
          <button
            onClick={() => {
              resetFinancialForm();
              setShowFinancialForm(true);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg"
          >
            <DollarSign className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation - Mobile */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
            <div className="relative bg-white w-64 h-full overflow-y-auto">
              <div className="p-4 border-b">
                <h2 className="text-lg font-bold">Navigation</h2>
              </div>
              <nav className="p-2">
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg mb-1 ${
                      activeTab === item.id
                        ? 'bg-green-100 text-green-800 border-l-4 border-green-500'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Sidebar Navigation - Desktop */}
        <div className="hidden md:block w-64 bg-white shadow-lg min-h-screen">
          <nav className="p-4">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-800">Navigation</h2>
            </div>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-3 w-full px-4 py-3 text-left rounded-lg mb-1 transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-green-100 text-green-800 border-l-4 border-green-500'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Heart className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-600">Total Goats</p>
                      <p className="text-xl font-bold text-gray-900">{totalGoats}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Heart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-600">Healthy Goats</p>
                      <p className="text-xl font-bold text-gray-900">{healthyGoats}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-500">
                  <div className="flex items-center">
                    <div className="bg-red-100 p-2 rounded-full">
                      <DollarSign className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-600">Total Income</p>
                      <p className="text-xl font-bold text-gray-900">${totalIncome.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-yellow-500">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <DollarSign className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs font-medium text-gray-600">Net Profit</p>
                      <p className="text-xl font-bold text-gray-900">${netProfit.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Goats */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Goats</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breed</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[...goats]
  .sort((a, b) => b.id - a.id)
  .slice(0, 10)
  .map(goat => (
                          <tr key={goat.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                                <div className="ml-2">
                                  <div className="text-sm font-medium text-gray-900">{goat.name}</div>
                                  <div className="text-xs text-gray-500">{goat.gender}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">{goat.breed}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900">{goat.owner || 'N/A'}</td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs leading-4 font-semibold rounded-full ${
                              goat.status === 'Healthy' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {goat.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-xs font-medium">
                            <button
                              onClick={() => handleEdit(goat)}
                              className="text-blue-600 hover:text-blue-900 mr-2"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(goat.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Goat Management */}
          {activeTab === 'goats' && (
            <div className="space-y-4">
              {/* Search and Filter */}
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search goats by name, breed, or owner..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="healthy">Healthy</option>
                      <option value="sick">Sick</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Goats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGoats.map(goat => (
                  <div key={goat.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                          <div>
                            <h3 className="font-bold text-gray-900">{goat.name}</h3>
                            <p className="text-sm text-gray-600">{goat.breed} • {goat.gender}</p>
                            {goat.owner && (
                              <p className="text-xs text-gray-500 flex items-center mt-1">
                                <User className="h-3 w-3 mr-1" />
                                {goat.owner}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          goat.status === 'Healthy' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {goat.status}
                        </span>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">Age</p>
                          <p className="font-semibold">{goat.age} years</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Weight</p>
                          <p className="font-semibold">{goat.weight} kg</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Last Check</p>
                          <p className="font-semibold">{goat.lastHealthCheck}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Next Vaccination</p>
                          <p className="font-semibold">{goat.nextVaccination}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-gray-700 text-xs line-clamp-2">{goat.notes}</p>
                      </div>
                      
                      <div className="mt-3 flex space-x-2">
                        <button
                          onClick={() => handleEdit(goat)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1 text-xs"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(goat.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1 text-xs"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Health Reports */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Health Reports</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Check</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Vaccination</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {goats.map(goat => (
                        <tr key={goat.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{goat.name}</div>
                            <div className="text-xs text-gray-500">{goat.breed}</div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{goat.owner || 'N/A'}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs leading-4 font-semibold rounded-full ${
                              goat.status === 'Healthy' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {goat.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{goat.lastHealthCheck}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{goat.nextVaccination}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Financial Reports */}
          {activeTab === 'finance' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Financial Reports</h3>
                  <button
                    onClick={() => {
                      resetFinancialForm();
                      setShowFinancialForm(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg font-medium flex items-center space-x-1 transition-colors duration-200 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-green-600 font-medium">Total Income</p>
                        <p className="text-lg font-bold text-green-900">${totalIncome.toLocaleString()}</p>
                      </div>
                      <div className="h-6 w-6 text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-red-600 font-medium">Total Expenses</p>
                        <p className="text-lg font-bold text-red-900">${totalExpenses.toLocaleString()}</p>
                      </div>
                      <div className="h-6 w-6 text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-blue-600 font-medium">Net Profit</p>
                        <p className={`text-lg font-bold ${netProfit >= 0 ? 'text-blue-900' : 'text-red-900'}`}>
                          ${netProfit.toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {financialEntries.map(entry => (
                        <tr key={entry.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{entry.date}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs leading-4 font-semibold rounded-full ${
                              entry.type === 'income' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                            </span>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{entry.category}</td>
                          <td className={`px-3 py-2 whitespace-nowrap text-xs font-semibold ${
                            entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {entry.type === 'income' ? '+' : '-'}${entry.amount.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                            <button
                              onClick={() => handleEditFinancialEntry(entry)}
                              className="text-blue-600 hover:text-blue-900 mr-2"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteFinancialEntry(entry.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Feed Management */}
          {activeTab === 'feed' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Feed Management</h3>
                  <button
                    onClick={() => {
                      resetFeedForm();
                      setShowFeedForm(true);
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg font-medium flex items-center space-x-1 transition-colors duration-200 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {feedInventory.map(item => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-xs text-gray-600">Current Stock</p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditFeedItem(item)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFeedItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Quantity:</span>
                          <span className="font-semibold">{item.quantity} {item.unit}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Purchased:</span>
                          <span className="text-green-600">+{item.purchased} {item.unit}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Used:</span>
                          <span className="text-red-600">-{item.used} {item.unit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900">Goat Feed Requirements</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goat</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Feed</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weekly</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {goats.map(goat => (
                          <tr key={goat.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{goat.name}</div>
                              <div className="text-xs text-gray-500">{goat.breed}</div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{goat.owner || 'N/A'}</td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{goat.dailyFeed} kg</td>
                            <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{(goat.dailyFeed * 7).toFixed(1)} kg</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Medication Management */}
          {activeTab === 'medication' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Medication Management</h3>
                  <button
                    onClick={() => {
                      resetMedicationForm();
                      setShowMedicationForm(true);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-medium flex items-center space-x-1 transition-colors duration-200 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {medications.map(med => (
                    <div key={med.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{med.name}</h4>
                          <p className="text-xs text-gray-600">{med.type}</p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditMedication(med)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMedication(med.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Stock:</span>
                          <span className="font-semibold">{med.quantity} {med.unit}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Purchased:</span>
                          <span className="text-green-600">+{med.purchased} {med.unit}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Used:</span>
                          <span className="text-red-600">-{med.used} {med.unit}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Next Due:</span>
                          <span className="font-semibold">{med.nextDue}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900">Goat Medication Records</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Goat</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {goats.flatMap(goat => 
                          (goat.medications || []).map(med => (
                            <tr key={`${goat.id}-${med.id}`} className="hover:bg-gray-50">
                              <td className="px-3 py-2 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{goat.name}</div>
                                <div className="text-xs text-gray-500">{goat.breed}</div>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{med.name}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{med.date}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{med.dosage}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs font-medium">
                                <button
                                  onClick={() => handleDeleteGoatMedication(goat.id, med.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add/Edit Goat Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {editingGoat ? 'Edit Goat' : 'Add New Goat'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 border-b pb-1">Basic Information</h4>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={newGoat.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Owner</label>
                  <input
                    type="text"
                    name="owner"
                    value={newGoat.owner}
                    onChange={handleInputChange}
                    placeholder="Enter owner name"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Breed *</label>
                  <input
                    type="text"
                    name="breed"
                    value={newGoat.breed}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Age (years) *</label>
                    <input
                      type="number"
                      name="age"
                      value={newGoat.age}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Gender *</label>
                    <select
                      name="gender"
                      value={newGoat.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Weight (kg) *</label>
                  <input
                    type="number"
                    name="weight"
                    value={newGoat.weight}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.1"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    name="status"
                    value={newGoat.status}
                    onChange={handleInputChange}
                    required
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  >
                    <option value="Healthy">Healthy</option>
                    <option value="Sick">Sick</option>
                    <option value="Pregnant">Pregnant</option>
                    <option value="Recovering">Recovering</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 border-b pb-1">Health Information</h4>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Last Health Check</label>
                  <input
                    type="date"
                    name="lastHealthCheck"
                    value={newGoat.lastHealthCheck || ""}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Next Vaccination</label>
                  <input
                    type="date"
                    name="nextVaccination"
                    value={newGoat.nextVaccination}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Medical History</label>
                  <textarea
                    name="medicalHistory"
                    value={medicalHistoryString}
                    onChange={e => setMedicalHistoryString(e.target.value)}
                    placeholder="Enter medical history items separated by commas"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 border-b pb-1">Feed Management</h4>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Feed Type</label>
                  <input
                    type="text"
                    name="feedType"
                    value={newGoat.feedType}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Daily Feed (kg)</label>
                  <input
                    type="number"
                    name="dailyFeed"
                    value={newGoat.dailyFeed}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 border-b pb-1">Financial Information</h4>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Acquisition Cost ($)</label>
                  <input
                    type="number"
                    name="cost"
                    value={newGoat.cost}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Revenue Generated ($)</label>
                  <input
                    type="number"
                    name="revenue"
                    value={newGoat.revenue}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={newGoat.notes}
                    onChange={handleInputChange}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
                >
                  {editingGoat ? 'Update Goat' : 'Add Goat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Financial Entry Modal */}
      {showFinancialForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {editingFinancialEntry ? 'Edit Financial Entry' : 'Add Financial Entry'}
              </h3>
            </div>
            
            <form onSubmit={handleFinancialSubmit} className="p-4 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    name="type"
                    value={newFinancialEntry.type}
                    onChange={handleFinancialInputChange}
                    required
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={newFinancialEntry.date}
                    onChange={handleFinancialInputChange}
                    required
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                <input
                  type="text"
                  name="category"
                  value={newFinancialEntry.category}
                  onChange={handleFinancialInputChange}
                  required
                  placeholder="e.g., Milk Sales, Feed Purchase, Vaccination"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Amount ($) *</label>
                <input
                  type="number"
                  name="amount"
                  value={newFinancialEntry.amount}
                  onChange={handleFinancialInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newFinancialEntry.description}
                  onChange={handleFinancialInputChange}
                  placeholder="Enter description of the transaction"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  rows="2"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={resetFinancialForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
                >
                  {editingFinancialEntry ? 'Update Entry' : 'Add Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Feed Item Modal */}
      {showFeedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {editingFeedItem ? 'Edit Feed Item' : 'Add Feed Item'}
              </h3>
            </div>
            
            <form onSubmit={handleFeedSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Feed Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newFeedItem.name}
                  onChange={handleFeedInputChange}
                  required
                  placeholder="e.g., Alfalfa, Mixed Hay, Grain Mix"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Unit *</label>
                  <select
                    name="unit"
                    value={newFeedItem.unit}
                    onChange={handleFeedInputChange}
                    required
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                    <option value="tons">tons</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Purchased Quantity *</label>
                  <input
                    type="number"
                    name="purchased"
                    value={newFeedItem.purchased}
                    onChange={handleFeedInputChange}
                    required
                    min="0"
                    step="0.1"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Used Quantity</label>
                  <input
                    type="number"
                    name="used"
                    value={newFeedItem.used}
                    onChange={handleFeedInputChange}
                    min="0"
                    step="0.1"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={resetFeedForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
                >
                  {editingFeedItem ? 'Update Feed Item' : 'Add Feed Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Medication Modal */}
      {showMedicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {editingMedication ? 'Edit Medication' : 'Add Medication'}
              </h3>
            </div>
            
            <form onSubmit={handleMedicationSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Medication Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newMedication.name}
                  onChange={handleMedicationInputChange}
                  required
                  placeholder="e.g., Dewormer, Vaccine, Antibiotic"
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    name="type"
                    value={newMedication.type}
                    onChange={handleMedicationInputChange}
                    required
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  >
                    <option value="Treatment">Treatment</option>
                    <option value="Vaccine">Vaccine</option>
                    <option value="Deworming">Deworming</option>
                    <option value="Preventive">Preventive</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Unit *</label>
                  <select
                    name="unit"
                    value={newMedication.unit}
                    onChange={handleMedicationInputChange}
                    required
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  >
                    <option value="ml">ml</option>
                    <option value="mg">mg</option>
                    <option value="tablets">tablets</option>
                    <option value="injections">injections</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Purchased Quantity *</label>
                  <input
                    type="number"
                    name="purchased"
                    value={newMedication.purchased}
                    onChange={handleMedicationInputChange}
                    required
                    min="0"
                    step="0.1"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Used Quantity</label>
                  <input
                    type="number"
                    name="used"
                    value={newMedication.used}
                    onChange={handleMedicationInputChange}
                    min="0"
                    step="0.1"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={resetMedicationForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors duration-200 text-sm"
                >
                  {editingMedication ? 'Update Medication' : 'Add Medication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default App;
