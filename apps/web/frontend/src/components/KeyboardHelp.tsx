import React, { useState } from 'react';
import { Keyboard, X, HelpCircle } from 'lucide-react';

interface KeyboardHelpProps {
  className?: string;
}

const KeyboardHelp: React.FC<KeyboardHelpProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: '1-8', description: 'Navigate to sections' },
    { key: 'h', description: 'Go to Dashboard' },
    { key: 'j', description: 'Go to Jobs' },
    { key: 'c', description: 'Go to Customers' },
    { key: 'r', description: 'Go to Reports' },
    { key: '6', description: 'Go to Search Analytics' },
    { key: 's', description: 'Go to Settings' },
    { key: 'Ctrl + N', description: 'Create New Job' },
    { key: 'Ctrl + Shift + N', description: 'Create New Customer' },
    { key: 'Ctrl + F', description: 'Search' },
    { key: 'Ctrl + K', description: 'Toggle Sidebar' },
    { key: '?', description: 'Show all shortcuts' },
    { key: 'Esc', description: 'Close modal/dialog' },
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
        title="Keyboard shortcuts"
        aria-label="Show keyboard shortcuts"
      >
        <HelpCircle className="h-5 w-5" />
      </button>

      {/* Help Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Keyboard className="h-5 w-5 text-purple-600" />
                <h3 className="text-sm font-medium text-gray-900">
                  Keyboard Shortcuts
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                aria-label="Close keyboard help"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="p-4 max-h-64 overflow-y-auto">
            <div className="space-y-2">
              {shortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{shortcut.description}</span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              Press <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded">?</kbd> for full shortcuts list
            </p>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default KeyboardHelp;

