import React from 'react';

interface KpiTemplateCardProps {
  cardId?: string | undefined;
  onOpenTemplateLibrary: () => void;
}

const KpiTemplateCard: React.FC<KpiTemplateCardProps> = ({ onOpenTemplateLibrary }) => {
  return (
    <div className="p-4 text-gray-600 text-center">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">KPI Template Library</h3>
        <p className="text-sm text-gray-600 mb-4">Browse and use pre-built KPI templates from the database</p>
        <button
          onClick={onOpenTemplateLibrary}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Open Template Library
        </button>
      </div>
    </div>
  );
};

export default KpiTemplateCard;
