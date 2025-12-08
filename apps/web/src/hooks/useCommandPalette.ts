import { useState, useEffect, useCallback } from 'react';

export interface Command {
  id: string;
  label: string;
  icon?: string;
  category?: string;
  action: () => void;
  keywords?: string[];
}

interface UseCommandPaletteOptions {
  commands: Command[];
  onOpen?: () => void;
  onClose?: () => void;
}

export function useCommandPalette({ commands, onOpen, onClose }: UseCommandPaletteOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter commands based on search term
  const filteredCommands = commands.filter(cmd => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(term) ||
      cmd.keywords?.some(k => k.toLowerCase().includes(term)) ||
      cmd.category?.toLowerCase().includes(term)
    );
  });

  // Open command palette
  const open = useCallback(() => {
    setIsOpen(true);
    setSearchTerm('');
    setSelectedIndex(0);
    onOpen?.();
  }, [onOpen]);

  // Close command palette
  const close = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
    setSelectedIndex(0);
    onClose?.();
  }, [onClose]);

  // Execute selected command
  const executeCommand = useCallback((command?: Command) => {
    const cmd = command || filteredCommands[selectedIndex];
    if (cmd) {
      cmd.action();
      close();
    }
  }, [filteredCommands, selectedIndex, close]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
        return;
      }

      if (!isOpen) return;

      // Close with Escape
      if (e.key === 'Escape') {
        close();
        return;
      }

      // Navigate with arrow keys
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        return;
      }

      // Execute with Enter
      if (e.key === 'Enter') {
        e.preventDefault();
        executeCommand();
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, open, close, executeCommand]);

  return {
    isOpen,
    searchTerm,
    setSearchTerm,
    filteredCommands,
    selectedIndex,
    setSelectedIndex,
    open,
    close,
    executeCommand
  };
}




