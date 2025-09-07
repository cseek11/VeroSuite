import React, { useState, useCallback } from 'react';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';

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

  const { getAllShortcuts } = useKeyboardNavigation({
    enabled,
    onShortcut: handleShortcut
  });

  // Debug logging
  React.useEffect(() => {
    console.log('🎯 KeyboardNavigationProvider enabled:', enabled);
  }, [enabled]);

  // Override the ? key to open shortcuts modal
  React.useEffect(() => {
    if (!enabled) {
      console.log('🚫 Question mark handler DISABLED');
      return;
    }

    const handleQuestionMark = (e: KeyboardEvent) => {
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

      if (e.key === '?' && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        setShortcutsModalOpen(true);
      }
    };

    console.log('✅ Question mark handler ENABLED');
    document.addEventListener('keydown', handleQuestionMark);
    return () => document.removeEventListener('keydown', handleQuestionMark);
  }, [enabled]);

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

