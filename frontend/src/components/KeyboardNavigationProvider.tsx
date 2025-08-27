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

  // Override the ? key to open shortcuts modal
  React.useEffect(() => {
    const handleQuestionMark = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        setShortcutsModalOpen(true);
      }
    };

    if (enabled) {
      document.addEventListener('keydown', handleQuestionMark);
      return () => document.removeEventListener('keydown', handleQuestionMark);
    }
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

