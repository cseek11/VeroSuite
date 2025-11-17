import React, { useState, useCallback } from 'react';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';
import { logger } from '@/utils/logger';

interface KeyboardNavigationProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

const KeyboardNavigationProvider: React.FC<KeyboardNavigationProviderProps> = ({ 
  children, 
  enabled = true 
}) => {
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [lastShortcut, setLastShortcut] = useState<string | null>(null);

  const handleShortcut = useCallback((shortcut: string) => {
    setLastShortcut(shortcut);
    // Clear the shortcut after 2 seconds
    setTimeout(() => setLastShortcut(null), 2000);
  }, []);

  // Note: This provider is for global keyboard shortcuts, not card navigation
  // Card navigation is handled directly in VeroCardsV3 component
  const handleGlobalShortcuts = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;
    
    // Handle global shortcuts here
    if (e.key === '?' && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      setShortcutsModalOpen(true);
    }
  }, [enabled]);

  // Global keyboard shortcuts
  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in input fields
      const target = e.target as HTMLElement;
      const isInputField = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true' ||
                          target.closest('[contenteditable="true"]') ||
                          target.closest('input') ||
                          target.closest('textarea') ||
                          target.closest('[data-search-input]') ||
                          target.hasAttribute('data-search-input');
      
      if (isInputField) {
        return; // Don't trigger shortcuts when typing in input fields
      }

      handleGlobalShortcuts(e);
    };

    logger.debug('Global shortcuts enabled', {}, 'KeyboardNavigationProvider');
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleGlobalShortcuts]);

  return (
    <>
      {children}
      
      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      {/* Shortcut Feedback Toast */}
      {lastShortcut && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <span className="text-sm font-medium">✓</span>
            <span className="text-sm">{lastShortcut}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardNavigationProvider;

