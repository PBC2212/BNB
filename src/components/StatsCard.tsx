import React from 'react';
import { ArbitrageStats } from '../types/contract';
import { Activity, TrendingUp, DollarSign, BarChart } from 'lucide-react';

interface StatsCardProps {
  stats: ArbitrageStats | null;
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Performance Stats</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No arbitrage executed yet</p>
          <p className="text-sm mt-2">Execute arbitrage to see performance statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Performance Stats</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100">
              <Activity className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-800">Total Executions</p>
              <p className="text-xl font-semibold">{stats.totalExecutions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">Total Profit</p>
              <p className="text-xl font-semibold">{stats.totalProfit}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-800">Average Profit</p>
              <p className="text-xl font-semibold">{stats.averageProfit}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100">
              <BarChart className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">Success Rate</p>
              <p className="text-xl font-semibold">{(stats.successRate * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 flex items-center">
        <Clock className="h-4 w-4 mr-1" />
        Last execution: {new Date(stats.lastExecution).toLocaleString()}
      </div>
    </div>
  );
};

export default StatsCard;