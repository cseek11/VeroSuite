import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Merge, RefreshCw } from 'lucide-react';
import { DashboardRegion } from '@/routes/dashboard/types/region.types';
import { ConflictData } from '@/stores/regionStore';
import { motion, AnimatePresence } from 'framer-motion';

interface ConflictResolutionDialogProps {
  conflict: ConflictData;
  onResolve: (resolution: 'local' | 'server' | 'merge') => Promise<void>;
  onCancel: () => void;
}

export const ConflictResolutionDialog: React.FC<ConflictResolutionDialogProps> = ({
  conflict,
  onResolve,
  onCancel
}) => {
  const [resolving, setResolving] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<'local' | 'server' | 'merge' | null>(null);

  const handleResolve = async (resolution: 'local' | 'server' | 'merge') => {
    setResolving(true);
    setSelectedResolution(resolution);
    try {
      await onResolve(resolution);
    } catch (error) {
      console.error('Failed to resolve conflict:', error);
    } finally {
      setResolving(false);
      setSelectedResolution(null);
    }
  };

  const getChangedFields = (local: DashboardRegion, server: DashboardRegion, changes: Partial<DashboardRegion>): string[] => {
    const fields: string[] = [];
    Object.keys(changes).forEach(key => {
      if (key in local || key in server) {
        fields.push(key);
      }
    });
    return fields;
  };

  const changedFields = getChangedFields(conflict.localVersion, conflict.serverVersion, conflict.localChanges);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="p-6 border-b bg-yellow-50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Conflict Detected</h2>
                <p className="text-sm text-gray-600 mt-1">
                  This region was modified by another user while you were editing it.
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Changed fields */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Changed Fields:</h3>
              <div className="flex flex-wrap gap-2">
                {changedFields.map(field => (
                  <span
                    key={field}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {field.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            {/* Comparison */}
            <div className="grid grid-cols-2 gap-4">
              {/* Local version */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <h4 className="font-semibold text-sm">Your Changes</h4>
                </div>
                <div className="space-y-2 text-sm">
                  {Object.entries(conflict.localChanges).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-gray-600">{key.replace(/_/g, ' ')}:</span>{' '}
                      <span className="font-medium">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Server version */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-3">
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                  <h4 className="font-semibold text-sm">Server Version</h4>
                </div>
                <div className="space-y-2 text-sm">
                  {changedFields.map(key => {
                    const value = (conflict.serverVersion as any)[key];
                    return (
                      <div key={key}>
                        <span className="text-gray-600">{key.replace(/_/g, ' ')}:</span>{' '}
                        <span className="font-medium">
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Resolution options */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">Choose Resolution:</h3>
              
              <button
                onClick={() => handleResolve('local')}
                disabled={resolving}
                className="w-full flex items-center gap-3 p-4 border-2 border-green-500 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="flex-1 text-left">
                  <div className="font-semibold">Keep Your Changes</div>
                  <div className="text-sm text-gray-600">Overwrite server version with your local changes</div>
                </div>
                {selectedResolution === 'local' && resolving && (
                  <div className="animate-spin">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                )}
              </button>

              <button
                onClick={() => handleResolve('server')}
                disabled={resolving}
                className="w-full flex items-center gap-3 p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-5 h-5 text-blue-600" />
                <div className="flex-1 text-left">
                  <div className="font-semibold">Use Server Version</div>
                  <div className="text-sm text-gray-600">Discard your changes and use the server version</div>
                </div>
                {selectedResolution === 'server' && resolving && (
                  <div className="animate-spin">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                )}
              </button>

              <button
                onClick={() => handleResolve('merge')}
                disabled={resolving}
                className="w-full flex items-center gap-3 p-4 border-2 border-purple-500 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50"
              >
                <Merge className="w-5 h-5 text-purple-600" />
                <div className="flex-1 text-left">
                  <div className="font-semibold">Merge Changes</div>
                  <div className="text-sm text-gray-600">Combine your changes with the server version</div>
                </div>
                {selectedResolution === 'merge' && resolving && (
                  <div className="animate-spin">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50 flex justify-end">
            <button
              onClick={onCancel}
              disabled={resolving}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};




