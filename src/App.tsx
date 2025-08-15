import React, { useState } from 'react';
import { 
  Home, 
  Plus, 
  Calendar, 
  BarChart3, 
  Egg,
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import DailyRecords from './components/DailyRecords';
import Analytics from './components/Analytics';
import Schedules from './components/Schedules';
import { FarmProvider } from './context/FarmContext';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'records', label: 'Daily Records', icon: Plus },
    { id: 'schedules', label: 'Schedules', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'records':
        return <DailyRecords />;
      case 'schedules':
        return <Schedules />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <FarmProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Egg className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">FarmKeeper Pro</h1>
                  <p className="text-xs text-gray-500">Poultry Farm Management</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Today's Summary</p>
                  <p className="text-xs text-gray-500">Active Fowls: 1,250</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {renderActiveComponent()}
        </main>
      </div>
    </FarmProvider>
  );
}

export default App;