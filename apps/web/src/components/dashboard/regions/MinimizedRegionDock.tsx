import React from 'react';
import { DashboardRegion } from '@/routes/dashboard/types/region.types';
import { Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MinimizedRegionDockProps {
  minimizedRegions: Array<DashboardRegion & { originalPosition: { row: number; col: number } }>;
  onRestore: (id: string) => void;
}

export const MinimizedRegionDock: React.FC<MinimizedRegionDockProps> = ({
  minimizedRegions,
  onRestore
}) => {
  if (minimizedRegions.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 p-2 bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 shadow-lg max-w-[calc(100vw-8rem)] overflow-x-auto">
      <AnimatePresence>
        {minimizedRegions.map((region) => (
          <motion.div
            key={region.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-2 min-w-[150px] hover:shadow-md transition-shadow flex-shrink-0"
          >
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium text-gray-700 truncate flex-1">
                {region.region_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h4>
              <button
                onClick={() => onRestore(region.id)}
                className="flex-shrink-0 p-1 bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors"
                title="Restore region"
              >
                <Maximize2 className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

