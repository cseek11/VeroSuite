import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SecondarySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
  title?: string;
}

export const SecondarySidebar: React.FC<SecondarySidebarProps> = ({
  isOpen,
  onToggle,
  children,
  title = 'Sidebar'
}) => {
  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={false}
        animate={{ x: isOpen ? 0 : 0 }}
        className={`fixed top-1/2 -translate-y-1/2 z-40 ${
          isOpen ? 'left-[300px]' : 'left-0'
        } bg-white border border-gray-200 rounded-r-lg shadow-lg p-2 hover:bg-gray-50 transition-colors`}
        onClick={onToggle}
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        )}
      </motion.button>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: isOpen ? 0 : -300,
          width: isOpen ? 300 : 0
        }}
        transition={{ duration: 0.2 }}
        className="fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-30 overflow-hidden"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">{title}</h3>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {children || (
              <div className="text-sm text-gray-500">
                <p>Sidebar content goes here</p>
                <p className="mt-4">Filters, search, contextual data, etc.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};




