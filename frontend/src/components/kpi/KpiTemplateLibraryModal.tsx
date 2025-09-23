import React from 'react';
import { X } from 'lucide-react';
import KpiTemplateLibrary from './KpiTemplateLibrary';

interface KpiTemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: any) => void;
}

const KpiTemplateLibraryModal: React.FC<KpiTemplateLibraryModalProps> = ({
  isOpen,
  onClose,
  onUseTemplate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col min-h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">KPI Template Library</h2>
            <p className="text-sm text-gray-500">Browse and use pre-built KPI templates</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Template Library Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <KpiTemplateLibrary
            onUseTemplate={onUseTemplate}
            showCreateButton={false}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default KpiTemplateLibraryModal;



