import React from 'react';
import { ArbitrageOpportunity } from '../types/contract';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';

interface OpportunityListProps {
  opportunities: ArbitrageOpportunity[];
}

const OpportunityList: React.FC<OpportunityListProps> = ({ opportunities }) => {
  if (opportunities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Opportunities</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No opportunities checked yet</p>
          <p className="text-sm mt-2">Check token pairs to see potential arbitrage opportunities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Opportunities</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Token Pair
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profit
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {opportunities.map((opportunity, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img 
                      src={opportunity.tokenA.logoUrl} 
                      alt={opportunity.tokenA.symbol} 
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="ml-1 mr-1">{opportunity.tokenA.symbol}</span>
                    <span>/</span>
                    <img 
                      src={opportunity.tokenB.logoUrl} 
                      alt={opportunity.tokenB.symbol} 
                      className="w-5 h-5 ml-1 rounded-full"
                    />
                    <span className="ml-1">{opportunity.tokenB.symbol}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={opportunity.profitable ? 'text-green-600 font-medium' : 'text-gray-500'}>
                    {opportunity.estimatedProfit} {opportunity.tokenA.symbol}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {opportunity.profitable ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Profitable
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      Not Profitable
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    {new Date(opportunity.timestamp).toLocaleTimeString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpportunityList;