import React from 'react';
import { Search, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommandPalette, Command as CommandType } from '@/hooks/useCommandPalette';

interface CommandPaletteProps {
  commands: CommandType[];
  onOpen?: () => void;
  onClose?: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ commands, onOpen, onClose }) => {
  const {
    isOpen,
    searchTerm,
    setSearchTerm,
    filteredCommands,
    selectedIndex,
    executeCommand
  } = useCommandPalette({ 
    commands, 
    ...(onOpen !== undefined && { onOpen }), 
    ...(onClose !== undefined && { onClose }) 
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
            onClick={() => executeCommand()}
          />
          
          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-1/4 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-2xl bg-white rounded-lg shadow-2xl"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type a command or search..."
                className="flex-1 outline-none text-lg"
                autoFocus
              />
              <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </div>

            {/* Commands List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No commands found
                </div>
              ) : (
                <div className="py-2">
                  {filteredCommands.map((command, index) => (
                    <button
                      key={command.id}
                      onClick={() => executeCommand(command)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                        index === selectedIndex ? 'bg-gray-50' : ''
                      }`}
                    >
                      {command.icon && (
                        <span className="text-gray-400">{command.icon}</span>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{command.label}</div>
                        {command.category && (
                          <div className="text-xs text-gray-500">{command.category}</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};




