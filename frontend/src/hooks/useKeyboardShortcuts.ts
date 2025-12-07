import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: string;
  category: string;
}

export interface KeyboardShortcutsMap {
  [action: string]: {
    description: string;
    keys: string[];
  };
}

interface UseKeyboardShortcutsProps {
  onAddCard: (type: string) => void;
  onDuplicateCards: (cardIds: string[]) => void;
  onDeleteCards: (cardIds: string[]) => void;
  onAutoArrange: (mode: 'grid' | 'list' | 'compact') => void;
  onResetCards: (cardIds: string[]) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onShowHelp: () => void;
  onUndo?: () => boolean;
  onRedo?: () => boolean;
  selectedCards: Set<string>;
}

export function useKeyboardShortcuts({
  onAddCard,
  onDuplicateCards,
  onDeleteCards,
  onAutoArrange,
  onResetCards,
  onSelectAll,
  onDeselectAll,
  onShowHelp,
  onUndo,
  onRedo,
  selectedCards
}: UseKeyboardShortcutsProps) {

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    const target = e.target as HTMLElement;
    const isInputField = target.tagName === 'INPUT' || 
                        target.tagName === 'TEXTAREA' || 
                        target.contentEditable === 'true';
    
    if (isInputField) return;

    // Escape key - deselect all
    if (e.key === 'Escape') {
      onDeselectAll();
      return;
    }

    // Help shortcut
    if (e.key === '?') {
      e.preventDefault();
      onShowHelp();
      return;
    }

    // Delete selected cards
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedCards.size > 0) {
        e.preventDefault();
        onDeleteCards(Array.from(selectedCards));
      }
      return;
    }

    // Number keys for quick card creation (no modifiers)
    if (!e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
      switch (e.key) {
        // Quick card creation
        case '1':
          e.preventDefault();
          onAddCard('dashboard-metrics');
          break;
        case '2':
          e.preventDefault();
          onAddCard('jobs-calendar');
          break;
        case '3':
          e.preventDefault();
          onAddCard('recent-activity');
          break;
        case '4':
          e.preventDefault();
          onAddCard('customer-search');
          break;
        case '5':
          e.preventDefault();
          onAddCard('reports');
          break;
        case '6':
          e.preventDefault();
          onAddCard('quick-actions');
          break;
        case '7':
          e.preventDefault();
          onAddCard('routing');
          break;
        case '8':
          e.preventDefault();
          onAddCard('team-overview');
          break;
        case '9':
          e.preventDefault();
          onAddCard('financial-summary');
          break;
        case '0':
          e.preventDefault();
          onAddCard('smart-kpis');
          break;
      }
    }

    // Ctrl/Cmd shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {

        // Layout shortcuts
        case 'a':
          e.preventDefault();
          onSelectAll();
          break;
          case 'd':
            e.preventDefault();
            if (selectedCards.size > 0) {
              onDuplicateCards(Array.from(selectedCards));
            } else {
              // If no cards selected, duplicate all cards
              onDuplicateCards(Object.keys(cards));
            }
            break;
        case 'g':
          e.preventDefault();
          onAutoArrange('grid');
          break;
        case 'l':
          e.preventDefault();
          onAutoArrange('list');
          break;
        case 'k':
          e.preventDefault();
          onAutoArrange('compact');
          break;
        case 'r':
          e.preventDefault();
          if (selectedCards.size > 0) {
            onResetCards(Array.from(selectedCards));
          }
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey && onRedo) {
            onRedo();
          } else if (onUndo) {
            onUndo();
          }
          break;
        case 'y':
          e.preventDefault();
          if (onRedo) {
            onRedo();
          }
          break;
      }
    }
  }, [
    onAddCard,
    onDuplicateCards, 
    onDeleteCards,
    onAutoArrange,
    onResetCards,
    onSelectAll,
    onDeselectAll,
    onShowHelp,
    onUndo,
    onRedo,
    selectedCards
  ]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Return available shortcuts for help display
  const shortcuts: KeyboardShortcut[] = [
    // Quick Card Creation
    { key: 'Ctrl+1', description: 'Add Dashboard Metrics', action: 'Create metrics card', category: 'Card Creation' },
    { key: 'Ctrl+2', description: 'Add Jobs Calendar', action: 'Create calendar card', category: 'Card Creation' },
    { key: 'Ctrl+3', description: 'Add Recent Activity', action: 'Create activity card', category: 'Card Creation' },
    { key: 'Ctrl+4', description: 'Add Customer Search', action: 'Create search card', category: 'Card Creation' },
    { key: 'Ctrl+5', description: 'Add Reports', action: 'Create reports card', category: 'Card Creation' },
    { key: 'Ctrl+6', description: 'Add Quick Actions', action: 'Create actions card', category: 'Card Creation' },
    { key: 'Ctrl+7', description: 'Add Routing', action: 'Create routing card', category: 'Card Creation' },
    { key: 'Ctrl+8', description: 'Add Team Overview', action: 'Create team card', category: 'Card Creation' },
    { key: 'Ctrl+9', description: 'Add Financial Summary', action: 'Create financial card', category: 'Card Creation' },
    
    // Layout Management
    { key: 'Ctrl+A', description: 'Select All Cards', action: 'Select all cards', category: 'Selection' },
    { key: 'Ctrl+D', description: 'Duplicate Selected', action: 'Duplicate selected cards', category: 'Card Management' },
    { key: 'Ctrl+G', description: 'Auto-Arrange Grid', action: 'Arrange cards in grid', category: 'Layout' },
    { key: 'Ctrl+L', description: 'Auto-Arrange List', action: 'Arrange cards in list', category: 'Layout' },
    { key: 'Ctrl+K', description: 'Auto-Arrange Compact', action: 'Arrange cards compactly', category: 'Layout' },
    { key: 'Ctrl+R', description: 'Reset Card Size', action: 'Reset selected cards to default size', category: 'Card Management' },
    
    // General
    { key: 'Delete', description: 'Delete Selected', action: 'Remove selected cards', category: 'Card Management' },
    { key: 'Escape', description: 'Deselect All', action: 'Clear selection', category: 'Selection' },
    { key: '?', description: 'Show Help', action: 'Show keyboard shortcuts', category: 'Help' }
  ];

  const shortcutMap: KeyboardShortcutsMap = shortcuts.reduce((acc, shortcut) => {
    const existing = acc[shortcut.action];
    const keys = existing ? [...existing.keys, shortcut.key] : [shortcut.key];
    acc[shortcut.action] = { description: shortcut.description, keys };
    return acc;
  }, {} as KeyboardShortcutsMap);

  return { shortcuts: shortcutMap };
}
