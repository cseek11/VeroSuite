import React, { useState } from 'react';
import { X } from 'lucide-react';
import PredictiveAnalyticsEngine from '@/components/analytics/PredictiveAnalyticsEngine';

const PredictiveAnalyticsCard: React.FC = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  return (
    <>
      <div className="p-4 text-gray-600 text-center">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Predictive Analytics</h3>
          <p className="text-sm text-gray-600 mb-4">Advanced ML models for pest pressure, revenue forecasting, and demand prediction</p>
          <button
            onClick={() => setShowAnalytics(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Open Analytics Engine
          </button>
        </div>
      </div>
      
      {/* Predictive Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Predictive Analytics Engine</h2>
                <p className="text-sm text-gray-500">AI-powered predictions and insights</p>
              </div>
              <button
                onClick={() => setShowAnalytics(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
              <PredictiveAnalyticsEngine 
                showAdvanced={true}
                onPredictionSelect={(prediction) => {
                  console.log('Selected prediction:', prediction);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PredictiveAnalyticsCard;



