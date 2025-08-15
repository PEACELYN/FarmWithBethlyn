import React, { useState } from 'react';
import { Calendar, Clock, Plus, Edit2, Trash2, Save, X, Bell, Pill, Utensils, SprayCan as Spray } from 'lucide-react';
import { useFarm } from '../context/FarmContext';

export default function Schedules() {
  const { farmData, addSchedule, updateSchedule, deleteSchedule } = useFarm();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'feeding' as 'feeding' | 'medication' | 'disinfection' | 'inspection',
    title: '',
    time: '',
    frequency: 'Daily',
    description: '',
    active: true
  });

  const scheduleTypes = [
    { value: 'feeding', label: 'Feeding', icon: Utensils, color: 'green' },
    { value: 'medication', label: 'Medication', icon: Pill, color: 'blue' },
    { value: 'disinfection', label: 'Disinfection', icon: Spray, color: 'purple' },
    { value: 'inspection', label: 'Inspection', icon: Bell, color: 'orange' }
  ];

  const frequencies = ['Daily', 'Weekly', 'Monthly', 'As Needed'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      updateSchedule(editingId, formData);
      setEditingId(null);
    } else {
      addSchedule(formData);
    }
    
    // Reset form
    setFormData({
      type: 'feeding',
      title: '',
      time: '',
      frequency: 'Daily',
      description: '',
      active: true
    });
    setShowForm(false);
  };

  const handleEdit = (schedule: any) => {
    setFormData({
      type: schedule.type,
      title: schedule.title,
      time: schedule.time,
      frequency: schedule.frequency,
      description: schedule.description,
      active: schedule.active
    });
    setEditingId(schedule.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({
      type: 'feeding',
      title: '',
      time: '',
      frequency: 'Daily',
      description: '',
      active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getTypeIcon = (type: string) => {
    const scheduleType = scheduleTypes.find(t => t.value === type);
    return scheduleType ? scheduleType.icon : Bell;
  };

  const getTypeColor = (type: string) => {
    const scheduleType = scheduleTypes.find(t => t.value === type);
    return scheduleType ? scheduleType.color : 'gray';
  };

  const groupedSchedules = farmData.schedules.reduce((groups, schedule) => {
    if (!groups[schedule.type]) {
      groups[schedule.type] = [];
    }
    groups[schedule.type].push(schedule);
    return groups;
  }, {} as Record<string, any[]>);

  // Ensure schedules is always an array
  const safeSchedules = farmData.schedules || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Farm Schedules</h2>
          <p className="text-gray-600">Manage feeding, medication, and maintenance schedules</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Schedule</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Schedule' : 'Add New Schedule'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  {scheduleTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  {frequencies.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Additional details about this schedule..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                Active schedule
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>{editingId ? 'Update' : 'Save'} Schedule</span>
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedule Groups */}
      <div className="space-y-6">
        {scheduleTypes.map(type => {
          const schedules = groupedSchedules[type.value] || [];
          const Icon = type.icon;
          
          if (schedules.length === 0) return null;

          return (
            <div key={type.value} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    type.color === 'green' ? 'bg-green-100' :
                    type.color === 'blue' ? 'bg-blue-100' :
                    type.color === 'purple' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      type.color === 'green' ? 'text-green-600' :
                      type.color === 'blue' ? 'text-blue-600' :
                      type.color === 'purple' ? 'text-purple-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{type.label}</h3>
                    <p className="text-sm text-gray-500">{schedules.length} schedule(s)</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {schedules
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map(schedule => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-center">
                          <Clock className="h-4 w-4 text-gray-400 mb-1" />
                          <span className="text-sm font-medium text-gray-900">
                            {schedule.time}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{schedule.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              schedule.frequency === 'Daily' ? 'bg-green-100 text-green-800' :
                              schedule.frequency === 'Weekly' ? 'bg-blue-100 text-blue-800' :
                              schedule.frequency === 'Monthly' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {schedule.frequency}
                            </span>
                            {!schedule.active && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                Inactive
                              </span>
                            )}
                          </div>
                          {schedule.description && (
                            <p className="text-sm text-gray-600 mt-1">{schedule.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit schedule"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteSchedule(schedule.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete schedule"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {Object.keys(groupedSchedules).length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedules Yet</h3>
            <p className="text-gray-500 mb-4">
              Start by adding your first schedule to organize your farm activities.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Schedule
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Schedules