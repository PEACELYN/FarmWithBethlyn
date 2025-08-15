import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Egg, 
  Heart,
  Activity,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';

export default function Analytics() {
  const { farmData, getMetrics } = useFarm();
  const [timeRange, setTimeRange] = useState('30');
  
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
  
  const records = (farmData.dailyRecords || [])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-parseInt(timeRange));

  // Calculate trends
  const calculateTrend = (data: number[], days: number = 7) => {
    if (data.length < days) return 0;
    const recent = data.slice(-days);
    const previous = data.slice(-(days * 2), -days);
    if (previous.length === 0) return 0;
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const previousAvg = previous.reduce((sum, val) => sum + val, 0) / previous.length;
    
    return previousAvg === 0 ? 0 : ((recentAvg - previousAvg) / previousAvg) * 100;
  };

  const eggTrend = calculateTrend(records.map(r => r.eggsCollected));
  const revenueTrend = calculateTrend(records.map(r => r.eggsSold * r.eggPrice));
  const mortalityTrend = calculateTrend(records.map(r => r.fowlDeaths));

  // Weekly summaries
  const getWeeklySummary = () => {
    if (records.length === 0) return [];
    
    const weeks: { [key: string]: typeof records } = {};
    
    records.forEach(record => {
      const date = new Date(record.date);
      const week = getWeekKey(date);
      if (!weeks[week]) weeks[week] = [];
      weeks[week].push(record);
    });

    return Object.entries(weeks).map(([week, weekRecords]) => ({
      week,
      totalEggs: weekRecords.reduce((sum, r) => sum + r.eggsCollected, 0),
      totalRevenue: weekRecords.reduce((sum, r) => sum + (r.eggsSold * r.eggPrice), 0),
      totalCosts: weekRecords.reduce((sum, r) => sum + r.feedCost, 0),
      totalDeaths: weekRecords.reduce((sum, r) => sum + r.fowlDeaths, 0),
      avgFeedConsumption: weekRecords.reduce((sum, r) => sum + r.feedConsumed, 0) / weekRecords.length,
      days: weekRecords.length
    })).slice(-8); // Last 8 weeks
  };

  const getWeekKey = (date: Date) => {
    const year = date.getFullYear();
    const week = getWeekNumber(date);
    return `${year}-W${week.toString().padStart(2, '0')}`;
  };

  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const weeklySummary = getWeeklySummary();

  // Performance indicators
  const performanceCards = [
    {
      title: 'Total Revenue',
      value: `$${metrics.totalRevenue.toFixed(2)}`,
      trend: revenueTrend,
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Production Rate',
      value: `${metrics.eggProductionRate.toFixed(1)}%`,
      trend: eggTrend,
      icon: Egg,
      color: 'yellow'
    },
    {
      title: 'Net Profit',
      value: `$${metrics.netProfit.toFixed(2)}`,
      trend: (metrics.netProfit / metrics.totalRevenue) * 100,
      icon: TrendingUp,
      color: metrics.netProfit >= 0 ? 'green' : 'red'
    },
    {
      title: 'Mortality Rate',
      value: `${metrics.mortalityRate.toFixed(2)}%`,
      trend: -mortalityTrend, // Negative because lower mortality is better
      icon: Heart,
      color: metrics.mortalityRate < 2 ? 'green' : metrics.mortalityRate < 5 ? 'yellow' : 'red'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Farm Analytics</h2>
          <p className="text-gray-600">Performance insights and trends</p>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Time Range:</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceCards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.trend > 0;
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${
                  card.color === 'green' ? 'bg-green-100' :
                  card.color === 'yellow' ? 'bg-yellow-100' :
                  card.color === 'red' ? 'bg-red-100' :
                  'bg-blue-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    card.color === 'green' ? 'text-green-600' :
                    card.color === 'yellow' ? 'text-yellow-600' :
                    card.color === 'red' ? 'text-red-600' :
                    'text-blue-600'
                  }`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="h-4 w-4" />
                  <span>{Math.abs(card.trend).toFixed(1)}%</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Efficiency */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Activity className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Production Efficiency</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Feed Efficiency</span>
              <span className="font-semibold">{metrics.feedEfficiency.toFixed(2)} eggs/kg</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Daily Avg Production</span>
              <span className="font-semibold">
                {records.length > 0 ? 
                  (records.reduce((sum, r) => sum + r.eggsCollected, 0) / records.length).toFixed(1) 
                  : '0'
                } eggs/day
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Production per Bird</span>
              <span className="font-semibold">
                {(metrics.eggProductionRate / 100).toFixed(2)} eggs/bird/day
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Profitability Ratio</span>
              <span className={`font-semibold ${
                metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {((metrics.netProfit / metrics.totalRevenue) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Weekly Performance</h3>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {weeklySummary.length > 0 ? (
              weeklySummary.map((week, index) => (
                <div key={week.week} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">{week.week}</span>
                    <span className="text-green-600 font-semibold">
                      ${(week.totalRevenue - week.totalCosts).toFixed(0)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Eggs:</span>
                      <span>{week.totalEggs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue:</span>
                      <span>${week.totalRevenue.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Costs:</span>
                      <span>${week.totalCosts.toFixed(0)}</span>
                    </div>
                    {week.totalDeaths > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Deaths:</span>
                        <span>{week.totalDeaths}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.eggProductionRate < 70 && (
            <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-400">
              <h4 className="font-medium text-gray-900">Low Production Rate</h4>
              <p className="text-sm text-gray-600 mt-1">
                Production is below optimal levels. Consider reviewing feed quality and flock health.
              </p>
            </div>
          )}
          {metrics.mortalityRate > 3 && (
            <div className="bg-white rounded-lg p-4 border-l-4 border-red-400">
              <h4 className="font-medium text-gray-900">High Mortality</h4>
              <p className="text-sm text-gray-600 mt-1">
                Mortality rate is above normal. Veterinary consultation recommended.
              </p>
            </div>
          )}
          {metrics.feedEfficiency < 15 && (
            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-400">
              <h4 className="font-medium text-gray-900">Feed Efficiency</h4>
              <p className="text-sm text-gray-600 mt-1">
                Feed conversion could be improved. Review feed formula and feeding schedule.
              </p>
            </div>
          )}
          {metrics.netProfit > 0 && metrics.eggProductionRate > 75 && (
            <div className="bg-white rounded-lg p-4 border-l-4 border-green-400">
              <h4 className="font-medium text-gray-900">Excellent Performance</h4>
              <p className="text-sm text-gray-600 mt-1">
                Your farm is performing well with good profitability and production rates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}