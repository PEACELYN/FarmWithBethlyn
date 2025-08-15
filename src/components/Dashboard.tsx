import React from 'react';
import { 
  Egg, 
  Heart, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  Activity
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';

export default function Dashboard() {
  const { farmData, getMetrics } = useFarm();
  
  let metrics;
  try {
    metrics = getMetrics();
  } catch (error) {
    console.error('Error getting metrics:', error);
    metrics = {
      totalRevenue: 0,
      totalCosts: 0,
      netProfit: 0,
      eggProductionRate: 0,
      mortalityRate: 0,
      feedEfficiency: 0
    };
  }

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = farmData.dailyRecords.find(record => record.date === today);

  const upcomingTasks = (farmData.schedules || [])
    .filter(schedule => schedule.active)
    .slice(0, 4);

  const recentRecords = (farmData.dailyRecords || [])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const statCards = [
    {
      title: 'Total Fowls',
      value: farmData.totalFowls.toLocaleString(),
      change: todayRecord ? `+${todayRecord.newHatches} hatched, -${todayRecord.fowlDeaths} died today` : 'No data today',
      icon: Heart,
      color: 'bg-blue-500'
    },
    {
      title: 'Today\'s Eggs',
      value: todayRecord ? todayRecord.eggsCollected.toString() : '0',
      change: todayRecord ? `${todayRecord.eggsBroken} broken, ${todayRecord.eggsSpoilt} spoilt` : 'No data recorded',
      icon: Egg,
      color: 'bg-yellow-500'
    },
    {
      title: 'Revenue Today',
      value: todayRecord ? `$${(todayRecord.eggsSold * todayRecord.eggPrice).toFixed(2)}` : '$0.00',
      change: todayRecord ? `${todayRecord.eggsSold} eggs sold` : 'No sales recorded',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Production Rate',
      value: `${metrics.eggProductionRate.toFixed(1)}%`,
      change: `Feed efficiency: ${metrics.feedEfficiency.toFixed(2)} eggs/kg`,
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Your Farm Dashboard</h2>
        <p className="text-green-100">
          {todayRecord 
            ? "Today's data has been recorded. Keep up the great work!" 
            : "Don't forget to record today's farm activities."
          }
        </p>
        <div className="mt-4 text-sm text-green-100">
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-600">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        task.type === 'feeding' ? 'bg-green-400' :
                        task.type === 'medication' ? 'bg-blue-400' :
                        task.type === 'disinfection' ? 'bg-purple-400' :
                        'bg-orange-400'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-500">{task.description}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{task.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No scheduled tasks for today</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Records</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentRecords.length > 0 ? (
                recentRecords.map((record) => (
                  <div key={record.id} className="border-l-4 border-green-400 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {record.eggsCollected} eggs collected, {record.eggsSold} sold
                        </p>
                        <p className="text-sm text-gray-500">
                          Feed: {record.feedConsumed}kg • Deaths: {record.fowlDeaths}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        ${(record.eggsSold * record.eggPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No records yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Egg className="h-5 w-5 text-gray-400 mr-2" />
            Record Today's Data
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            View Schedule
          </button>
          <button className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <TrendingUp className="h-5 w-5 text-gray-400 mr-2" />
            View Analytics
          </button>
        </div>
      </div>

      {/* Alerts */}
      {metrics.mortalityRate > 5 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-red-800">High Mortality Rate Alert</h4>
              <p className="text-sm text-red-700 mt-1">
                Current mortality rate is {metrics.mortalityRate.toFixed(1)}%. Consider veterinary consultation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}