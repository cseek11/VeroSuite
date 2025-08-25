import React, { useState, useEffect } from 'react';
import { X, Keyboard, Search, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home, Send as EndIcon, FileText as TabIcon } from 'lucide-react';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    description: string;
  }>;
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { getAllShortcuts } = useKeyboardNavigation();

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const allShortcuts = getAllShortcuts();

  // Group shortcuts by category
  const shortcutGroups: ShortcutGroup[] = [
    {
      title: 'Navigation',
      shortcuts: allShortcuts.filter(s => 
        ['1', '2', '3', '4', '5', '6', '7', 'h', 'j', 'c', 'r', 's'].includes(s.key.toLowerCase()) &&
        !s.ctrl && !s.shift && !s.alt && !s.meta
      )
    },
    {
      title: 'Actions',
      shortcuts: allShortcuts.filter(s => 
        s.ctrl || s.shift || s.alt || s.meta || ['Escape', '?'].includes(s.key)
      )
    },
    {
      title: 'Focus Management',
      shortcuts: allShortcuts.filter(s => 
        ['Tab', 'Home', 'End'].includes(s.key)
      )
    }
  ];

  // Filter shortcuts based on search term
  const filteredGroups = shortcutGroups.map(group => ({
    ...group,
    shortcuts: group.shortcuts.filter(shortcut =>
      shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shortcut.key.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(group => group.shortcuts.length > 0);

  const formatKey = (shortcut: any) => {
    const parts = [];
    if (shortcut.ctrl) parts.push('Ctrl');
    if (shortcut.shift) parts.push('Shift');
    if (shortcut.alt) parts.push('Alt');
    if (shortcut.meta) parts.push('⌘');
    
    // Format the key
    let key = shortcut.key;
    if (key === ' ') key = 'Space';
    if (key === 'Escape') key = 'Esc';
    if (key === 'ArrowUp') key = '↑';
    if (key === 'ArrowDown') key = '↓';
    if (key === 'ArrowLeft') key = '←';
    if (key === 'ArrowRight') key = '→';
    
    parts.push(key);
    return parts.join(' + ');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Keyboard className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Keyboard Shortcuts
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Close keyboard shortcuts"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search shortcuts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[60vh] p-6">
            {filteredGroups.length === 0 ? (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No shortcuts found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search terms.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredGroups.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      {group.title}
                    </h3>
                    <div className="grid gap-3">
                      {group.shortcuts.map((shortcut, index) => (
                        <div
                          key={`${shortcut.key}-${index}`}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="text-sm text-gray-700">
                            {shortcut.description}
                          </span>
                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded shadow-sm">
                            {formatKey(shortcut)}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              Press <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-800 bg-white border border-gray-300 rounded">Esc</kbd> to close
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;

