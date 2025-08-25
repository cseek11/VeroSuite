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

      {/* Keyboard Shortcuts Button (floating) */}
      <button
        onClick={() => setShortcutsModalOpen(true)}
        className="fixed bottom-4 left-4 z-40 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        title="Keyboard Shortcuts (?)"
        aria-label="Show keyboard shortcuts"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </button>
    </>
  );
};

export default KeyboardNavigationProvider;

