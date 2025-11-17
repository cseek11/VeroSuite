import React from 'react';
import { X } from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
  action: string;
  category: string;
}

interface KeyboardShortcutsModalProps {
  showKeyboardHelp: boolean;
  setShowKeyboardHelp: (show: boolean) => void;
  shortcuts: Shortcut[];
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  showKeyboardHelp,
  setShowKeyboardHelp,
  shortcuts
}) => {
  if (!showKeyboardHelp) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Keyboard Shortcuts</h2>
          <button
            onClick={() => setShowKeyboardHelp(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Shortcuts Content */}
        <div className="p-6">
          {['Card Creation', 'Layout', 'Card Management', 'Selection', 'Help'].map(category => (
            <div key={category} className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">{category}</h3>
              <div className="space-y-2">
                {shortcuts
                  .filter(shortcut => shortcut.category === category)
                  .map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{shortcut.description}</div>
                        <div className="text-xs text-gray-500">{shortcut.action}</div>
                      </div>
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">
                        {shortcut.key}
                      </kbd>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};











