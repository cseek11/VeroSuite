import React, { useState } from 'react';
import AutoLayoutManager from '@/components/dashboard/AutoLayoutManager';

const AutoLayoutCard: React.FC = () => {
  const [showAutoLayout, setShowAutoLayout] = useState(false);
  
  return (
    <>
      <div className="p-4 text-gray-600 text-center">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Auto-Layout</h3>
          <p className="text-sm text-gray-600 mb-4">Intelligent layout optimization based on usage patterns and user behavior</p>
          <button
            onClick={() => setShowAutoLayout(true)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Open Auto-Layout
          </button>
        </div>
      </div>
      
      {/* Auto-Layout Modal */}
      {showAutoLayout && (
        <AutoLayoutManager
          isOpen={showAutoLayout}
          onClose={() => setShowAutoLayout(false)}
          userId="demo-user"
          currentCards={[
            { id: 'smart-kpis', type: 'smart-kpis', x: 0, y: 0, width: 400, height: 280 },
            { id: 'dashboard-metrics', type: 'dashboard-metrics', x: 420, y: 0, width: 280, height: 180 },
            { id: 'quick-actions', type: 'quick-actions', x: 720, y: 0, width: 200, height: 180 },
            { id: 'jobs-calendar', type: 'jobs-calendar', x: 0, y: 300, width: 400, height: 300 },
            { id: 'recent-activity', type: 'recent-activity', x: 420, y: 300, width: 300, height: 300 }
          ]}
          onLayoutChange={(changes) => {
            console.log('Layout changes:', changes);
            // Here you would apply the layout changes to the actual cards
          }}
        />
      )}
    </>
  );
};

export default AutoLayoutCard;



