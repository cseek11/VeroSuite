import React, { useState, useEffect } from 'react';
import { X, Keyboard, Search, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home, End, Tab } from 'lucide-react';

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
  
  // Define all available shortcuts - using unique, non-conflicting keys
  const allShortcuts = [
    // Navigation shortcuts (using WASD for movement)
    { key: 'W', description: 'Navigate to card above', category: 'Navigation' },
    { key: 'S', description: 'Navigate to card below', category: 'Navigation' },
    { key: 'A', description: 'Navigate to card on left', category: 'Navigation' },
    { key: 'D', description: 'Navigate to card on right', category: 'Navigation' },
    { key: 'Tab', description: 'Navigate to next card', category: 'Navigation' },
    { key: 'Shift+Tab', description: 'Navigate to previous card', category: 'Navigation' },
    { key: 'Home', description: 'Navigate to first card', category: 'Navigation' },
    { key: 'End', description: 'Navigate to last card', category: 'Navigation' },
    { key: 'Space', description: 'Activate/select card', category: 'Navigation' },
    { key: 'Enter', description: 'Activate/select card', category: 'Navigation' },
    { key: 'Escape', description: 'Deselect all cards', category: 'Navigation' },
    
    // Multi-selection shortcuts
    { key: 'Shift+W', description: 'Add card above to selection', category: 'Selection' },
    { key: 'Shift+S', description: 'Add card below to selection', category: 'Selection' },
    { key: 'Shift+A', description: 'Add card on left to selection', category: 'Selection' },
    { key: 'Shift+D', description: 'Add card on right to selection', category: 'Selection' },
    { key: 'Ctrl+Shift+E', description: 'Select all cards', category: 'Selection' },
    
    // Card manipulation shortcuts (using Ctrl+WASD for moving, Alt+WASD for resizing)
    { key: 'Ctrl+Shift+W', description: 'Move selected card up', category: 'Manipulation' },
    { key: 'Ctrl+Shift+S', description: 'Move selected card down', category: 'Manipulation' },
    { key: 'Ctrl+Shift+A', description: 'Move selected card left', category: 'Manipulation' },
    { key: 'Ctrl+Shift+D', description: 'Move selected card right', category: 'Manipulation' },
    { key: 'Alt+W', description: 'Resize selected card taller', category: 'Manipulation' },
    { key: 'Alt+S', description: 'Resize selected card shorter', category: 'Manipulation' },
    { key: 'Alt+A', description: 'Resize selected card narrower', category: 'Manipulation' },
    { key: 'Alt+D', description: 'Resize selected card wider', category: 'Manipulation' },
    
    // Card creation shortcuts (using number keys 1-9)
    { key: '1', description: 'Add Dashboard Metrics card', category: 'Creation' },
    { key: '2', description: 'Add Jobs Calendar card', category: 'Creation' },
    { key: '3', description: 'Add Recent Activity card', category: 'Creation' },
    { key: '4', description: 'Add Customer Search card', category: 'Creation' },
    { key: '5', description: 'Add Reports card', category: 'Creation' },
    { key: '6', description: 'Add Quick Actions card', category: 'Creation' },
    { key: '7', description: 'Add Routing card', category: 'Creation' },
    { key: '8', description: 'Add Team Overview card', category: 'Creation' },
    { key: '9', description: 'Add Financial Summary card', category: 'Creation' },
    { key: '0', description: 'Add Smart KPI card', category: 'Creation' },
    
    // General shortcuts (using unique combinations)
    { key: 'Delete', description: 'Delete selected cards', category: 'General' },
    { key: 'Backspace', description: 'Delete selected cards', category: 'General' },
    { key: 'Ctrl+Shift+C', description: 'Duplicate selected cards', category: 'General' },
    { key: 'Ctrl+Shift+G', description: 'Auto-arrange cards in grid', category: 'General' },
    { key: 'Ctrl+Shift+L', description: 'Auto-arrange cards in list', category: 'General' },
    { key: 'Ctrl+Shift+K', description: 'Auto-arrange cards compactly', category: 'General' },
    { key: 'Ctrl+Shift+R', description: 'Reset selected cards to default size', category: 'General' },
    { key: 'Ctrl+Z', description: 'Undo last action', category: 'General' },
    { key: 'Ctrl+Y', description: 'Redo last action', category: 'General' },
    { key: '?', description: 'Show this help modal', category: 'General' },
    
    // Additional useful shortcuts
    { key: 'Ctrl+Shift+Q', description: 'Toggle card locking', category: 'General' },
    { key: 'Ctrl+Shift+T', description: 'Save current layout', category: 'General' },
    { key: 'Ctrl+Shift+O', description: 'Load saved layout', category: 'General' },
    { key: 'Ctrl+Shift+F', description: 'Focus search/filter', category: 'General' },
    { key: 'Ctrl+Shift+H', description: 'Toggle help overlay', category: 'General' }
  ];

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      // Don't trigger when typing in input fields (except in the modal's own search)
      const target = e.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true' ||
                          target.closest('[contenteditable="true"]') ||
                          target.closest('input') ||
                          target.closest('textarea') ||
                          target.closest('[data-search-input]') ||
                          target.hasAttribute('data-search-input');
      
      // Allow Escape in the modal's search input to close the modal
      const isModalSearch = target.closest('[data-modal-search]');
      
      if (isInputField && !isModalSearch) {
        return; // Don't trigger shortcuts when typing in input fields outside the modal
      }

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

  // Group shortcuts by category
  const shortcutGroups: ShortcutGroup[] = [
    {
      title: 'Navigation',
      shortcuts: allShortcuts
        .filter(s => s.category === 'Navigation')
        .map(s => ({
          key: s.key,
          description: s.description
        }))
    },
    {
      title: 'Selection',
      shortcuts: allShortcuts
        .filter(s => s.category === 'Selection')
        .map(s => ({
          key: s.key,
          description: s.description
        }))
    },
    {
      title: 'Manipulation',
      shortcuts: allShortcuts
        .filter(s => s.category === 'Manipulation')
        .map(s => ({
          key: s.key,
          description: s.description
        }))
    },
    {
      title: 'Card Creation',
      shortcuts: allShortcuts
        .filter(s => s.category === 'Creation')
        .map(s => ({
          key: s.key,
          description: s.description
        }))
    },
    {
      title: 'General',
      shortcuts: allShortcuts
        .filter(s => s.category === 'General')
        .map(s => ({
          key: s.key,
          description: s.description
        }))
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

  // Debug logging
  React.useEffect(() => {
    if (isOpen) {
      console.log('🎯 KeyboardShortcutsModal opened at:', new Date().toISOString());
      console.log('📋 Total shortcuts:', allShortcuts.length);
      console.log('📋 First few shortcuts:', allShortcuts.slice(0, 5));
      console.log('📋 Sample WASD shortcuts:', allShortcuts.filter(s => ['W', 'A', 'S', 'D'].includes(s.key)));
      console.log('📂 Groups:', shortcutGroups.length);
      console.log('📂 Group titles:', shortcutGroups.map(g => g.title));
      console.log('🔍 Filtered groups:', filteredGroups.length);
      console.log('🔍 Filtered group titles:', filteredGroups.map(g => g.title));
    }
  }, [isOpen, allShortcuts.length, shortcutGroups.length, filteredGroups.length]);

  const formatKey = (shortcutKey: string) => {
    // Handle compound keys like "Ctrl+A", "Shift+Tab", etc.
    const parts = shortcutKey.split('+').map(part => part.trim());
    
    const formattedParts = parts.map(part => {
      // Format modifier keys
      if (part === 'Ctrl') return 'Ctrl';
      if (part === 'Shift') return 'Shift';
      if (part === 'Alt') return 'Alt';
      if (part === 'Meta') return '⌘';
      
      // Format special keys
      if (part === ' ') return 'Space';
      if (part === 'Escape') return 'Esc';
      if (part === 'ArrowUp') return '↑';
      if (part === 'ArrowDown') return '↓';
      if (part === 'ArrowLeft') return '←';
      if (part === 'ArrowRight') return '→';
      if (part === 'Backspace') return 'Backspace';
      if (part === 'Delete') return 'Delete';
      if (part === 'Enter') return 'Enter';
      if (part === 'Tab') return 'Tab';
      if (part === 'Home') return 'Home';
      if (part === 'End') return 'End';
      
      // Format function keys
      if (part.startsWith('F') && /^F\d+$/.test(part)) {
        return part; // Keep F1, F2, etc. as is
      }
      
      // Format single letters (WASD, etc.)
      if (part.length === 1 && /[A-Z]/.test(part)) {
        return part;
      }
      
      return part;
    });
    
    return formattedParts.join(' + ');
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
                id="shortcuts-search"
                name="shortcuts-search"
                type="text"
                placeholder="Search shortcuts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-modal-search="true"
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
                            {formatKey(shortcut.key)}
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

