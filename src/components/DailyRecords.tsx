import React, { useState } from 'react';
import { Calendar, Save, Eye, EyeOff } from 'lucide-react';
import { useFarm } from '../context/FarmContext';

export default function DailyRecords() {
  const { addDailyRecord, farmData } = useFarm();
  const [showHistory, setShowHistory] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    eggsCollected: '',
    eggsBroken: '',
    eggsSpoilt: '',
    eggsSold: '',
    eggPrice: '0.25',
    fowlDeaths: '',
    newHatches: '',
    feedConsumed: '',
    feedCost: '',
    medicationGiven: false,
    medicationDetails: '',
    dailyCheckNotes: '',
    disinfectionDone: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const record = {
      date: formData.date,
      eggsCollected: parseInt(formData.eggsCollected) || 0,
      eggsBroken: parseInt(formData.eggsBroken) || 0,
      eggsSpoilt: parseInt(formData.eggsSpoilt) || 0,
      eggsSold: parseInt(formData.eggsSold) || 0,
      eggPrice: parseFloat(formData.eggPrice) || 0,
      fowlDeaths: parseInt(formData.fowlDeaths) || 0,
      newHatches: parseInt(formData.newHatches) || 0,
      feedConsumed: parseFloat(formData.feedConsumed) || 0,
      feedCost: parseFloat(formData.feedCost) || 0,
      medicationGiven: formData.medicationGiven,
      medicationDetails: formData.medicationDetails,
      dailyCheckNotes: formData.dailyCheckNotes,
      disinfectionDone: formData.disinfectionDone
    };

    addDailyRecord(record);
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      eggsCollected: '',
      eggsBroken: '',
      eggsSpoilt: '',
      eggsSold: '',
      eggPrice: '0.25',
      fowlDeaths: '',
      newHatches: '',
      feedConsumed: '',
      feedCost: '',
      medicationGiven: false,
      medicationDetails: '',
      dailyCheckNotes: '',
      disinfectionDone: false
    });

    alert('Daily record saved successfully!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const records = farmData.dailyRecords.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Ensure records is always an array
  const safeRecords = records || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Daily Records</h2>
          <p className="text-gray-600">Record today's farm activities and observations</p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {showHistory ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span>{showHistory ? 'Hide' : 'Show'} History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Record Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            {/* Egg Production */}
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Egg Production</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eggs Collected
                  </label>
                  <input
                    type="number"
                    name="eggsCollected"
                    value={formData.eggsCollected}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Broken Eggs
                  </label>
                  <input
                    type="number"
                    name="eggsBroken"
                    value={formData.eggsBroken}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Spoilt Eggs
                  </label>
                  <input
                    type="number"
                    name="eggsSpoilt"
                    value={formData.eggsSpoilt}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Eggs Sold
                  </label>
                  <input
                    type="number"
                    name="eggsSold"
                    value={formData.eggsSold}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Egg ($)
                </label>
                <input
                  type="number"
                  name="eggPrice"
                  value={formData.eggPrice}
                  onChange={handleInputChange}
                  step="0.01"
                  className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  min="0"
                />
              </div>
            </div>

            {/* Flock Management */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Flock Management</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fowl Deaths
                  </label>
                  <input
                    type="number"
                    name="fowlDeaths"
                    value={formData.fowlDeaths}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Hatches
                  </label>
                  <input
                    type="number"
                    name="newHatches"
                    value={formData.newHatches}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Feed & Costs */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Feed & Costs</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feed Consumed (kg)
                  </label>
                  <input
                    type="number"
                    name="feedConsumed"
                    value={formData.feedConsumed}
                    onChange={handleInputChange}
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feed Cost ($)
                  </label>
                  <input
                    type="number"
                    name="feedCost"
                    value={formData.feedCost}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Health & Medication */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Health & Medication</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="medicationGiven"
                    checked={formData.medicationGiven}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Medication given today
                  </label>
                </div>
                {formData.medicationGiven && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Medication Details
                    </label>
                    <textarea
                      name="medicationDetails"
                      value={formData.medicationDetails}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Type of medication, dosage, reason..."
                    />
                  </div>
                )}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="disinfectionDone"
                    checked={formData.disinfectionDone}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Disinfection done today
                  </label>
                </div>
              </div>
            </div>

            {/* Daily Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Check Notes
              </label>
              <textarea
                name="dailyCheckNotes"
                value={formData.dailyCheckNotes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="General observations, health status, behavior notes..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Daily Record</span>
            </button>
          </form>
        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-1">
          {showHistory && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Recent Records</h3>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {safeRecords.length > 0 ? (
                  safeRecords.slice(0, 10).map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-green-600 font-medium">
                          ${(record.eggsSold * record.eggPrice).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Eggs: {record.eggsCollected} collected, {record.eggsSold} sold</p>
                        <p>Feed: {record.feedConsumed}kg (${record.feedCost})</p>
                        {record.fowlDeaths > 0 && (
                          <p className="text-red-600">Deaths: {record.fowlDeaths}</p>
                        )}
                        {record.newHatches > 0 && (
                          <p className="text-blue-600">New: {record.newHatches}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No records yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}