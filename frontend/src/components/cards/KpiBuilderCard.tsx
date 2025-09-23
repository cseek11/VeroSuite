import React from 'react';

interface KpiBuilderCardProps {
  onOpenBuilder: () => void;
}

const KpiBuilderCard: React.FC<KpiBuilderCardProps> = ({ onOpenBuilder }) => {
  return (
    <div className="p-4 text-gray-600 text-center">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Custom KPI Builder</h3>
        <p className="text-sm text-gray-600 mb-4">Create and configure custom KPIs with drag-and-drop interface</p>
        <button
          onClick={onOpenBuilder}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Open KPI Builder
        </button>
      </div>
    </div>
  );
};

export default KpiBuilderCard;



