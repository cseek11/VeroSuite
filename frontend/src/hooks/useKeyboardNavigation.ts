import { useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
}

interface UseKeyboardNavigationOptions {
  enabled?: boolean;
  onShortcut?: (shortcut: string) => void;
}

export const useKeyboardNavigation = (options: UseKeyboardNavigationOptions = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enabled = true, onShortcut } = options;
  const shortcutsRef = useRef<KeyboardShortcut[]>([]);
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  // Navigation shortcuts
  const navigationShortcuts: KeyboardShortcut[] = [
    {
      key: '1',
      description: 'Go to Dashboard',
      action: () => navigate('/dashboard')
    },
    {
      key: '2',
      description: 'Go to Jobs',
      action: () => navigate('/jobs')
    },
    {
      key: '3',
      description: 'Go to Customers',
      action: () => navigate('/customers')
    },
    {
      key: '4',
      description: 'Go to Routing',
      action: () => navigate('/routing')
    },
    {
      key: '5',
      description: 'Go to Reports',
      action: () => navigate('/reports')
    },
    {
      key: '6',
      description: 'Go to Search Analytics',
      action: () => navigate('/search-analytics')
    },
    {
      key: '7',
      description: 'Go to Uploads',
      action: () => navigate('/uploads')
    },
    {
      key: '8',
      description: 'Go to Settings',
      action: () => navigate('/settings')
    },
    {
      key: 'h',
      description: 'Go to Dashboard (Home)',
      action: () => navigate('/dashboard')
    },
    {
      key: 'j',
      description: 'Go to Jobs',
      action: () => navigate('/jobs')
    },
    {
      key: 'c',
      description: 'Go to Customers',
      action: () => navigate('/customers')
    },
    {
      key: 'r',
      description: 'Go to Reports',
      action: () => navigate('/reports')
    },
    {
      key: 's',
      description: 'Go to Settings',
      action: () => navigate('/settings')
    }
  ];

  // Action shortcuts
  const actionShortcuts: KeyboardShortcut[] = [
    {
      key: 'n',
      ctrl: true,
      description: 'Create New Job',
      action: () => navigate('/jobs/new')
    },
    {
      key: 'n',
      ctrl: true,
      shift: true,
      description: 'Create New Customer',
      action: () => navigate('/customers/new')
    },
    {
      key: 'f',
      ctrl: true,
      description: 'Search',
      action: () => {
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    },
    {
      key: 'r',
      ctrl: true,
      description: 'Refresh',
      action: () => window.location.reload()
    },
    {
      key: 'k',
      ctrl: true,
      description: 'Toggle Sidebar',
      action: () => {
        const sidebarToggle = document.querySelector('[data-sidebar-toggle]') as HTMLElement;
        if (sidebarToggle) {
          sidebarToggle.click();
        }
      }
    },
    {
      key: 'Escape',
      description: 'Close Modal/Dialog',
      action: () => {
        const modal = document.querySelector('[data-modal]') as HTMLElement;
        const closeButton = document.querySelector('[data-modal-close]') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        } else if (modal) {
          // Try to find any close button in the modal
          const closeBtn = modal.querySelector('[aria-label*="close"], [title*="close"], .close, .modal-close') as HTMLElement;
          if (closeBtn) {
            closeBtn.click();
          }
        }
      }
    },
    {
      key: '?',
      description: 'Show Keyboard Shortcuts',
      action: () => {
        // This will be handled by the keyboard shortcuts modal
        const shortcutsModal = document.querySelector('[data-shortcuts-modal]') as HTMLElement;
        if (shortcutsModal) {
          shortcutsModal.click();
        }
      }
    }
  ];

  // Focus management shortcuts
  const focusShortcuts: KeyboardShortcut[] = [
    {
      key: 'Tab',
      description: 'Next Focusable Element',
      action: () => {
        const focusableElements = getFocusableElements();
        const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex]?.focus();
      }
    },
    {
      key: 'Tab',
      shift: true,
      description: 'Previous Focusable Element',
      action: () => {
        const focusableElements = getFocusableElements();
        const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
        const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
        focusableElements[prevIndex]?.focus();
      }
    },
    {
      key: 'Home',
      description: 'First Focusable Element',
      action: () => {
        const focusableElements = getFocusableElements();
        focusableElements[0]?.focus();
      }
    },
    {
      key: 'End',
      description: 'Last Focusable Element',
      action: () => {
        const focusableElements = getFocusableElements();
        focusableElements[focusableElements.length - 1]?.focus();
      }
    }
  ];

  // Get all focusable elements
  const getFocusableElements = useCallback((): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
      '[role="button"]',
      '[role="tab"]',
      '[role="menuitem"]',
      '[data-focusable]'
    ];

    const elements = document.querySelectorAll(focusableSelectors.join(', '));
    return Array.from(elements) as HTMLElement[];
  }, []);

  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      // Allow some shortcuts even in input fields
      if (event.key === 'Escape' || (event.ctrlKey && event.key === 'f')) {
        // Continue with these shortcuts
      } else {
        return;
      }
    }

    const allShortcuts = [...navigationShortcuts, ...actionShortcuts, ...focusShortcuts];
    
    for (const shortcut of allShortcuts) {
      if (
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        !!event.ctrlKey === !!shortcut.ctrl &&
        !!event.shiftKey === !!shortcut.shift &&
        !!event.altKey === !!shortcut.alt &&
        !!event.metaKey === !!shortcut.meta
      ) {
        event.preventDefault();
        event.stopPropagation();
        
        onShortcut?.(shortcut.description);
        shortcut.action();
        return;
      }
    }
  }, [enabled, onShortcut]);

  // Initialize keyboard navigation
  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    
    // Update focusable elements when DOM changes
    const updateFocusableElements = () => {
      focusableElementsRef.current = getFocusableElements();
    };

    const observer = new MutationObserver(updateFocusableElements);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'tabindex', 'hidden']
    });

    // Initial update
    updateFocusableElements();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      observer.disconnect();
    };
  }, [enabled, handleKeyDown, getFocusableElements]);

  // Focus management utilities
  const focusFirstElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    focusableElements[0]?.focus();
  }, [getFocusableElements]);

  const focusLastElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    focusableElements[focusableElements.length - 1]?.focus();
  }, [getFocusableElements]);

  const focusNextElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    focusableElements[nextIndex]?.focus();
  }, [getFocusableElements]);

  const focusPreviousElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
    focusableElements[prevIndex]?.focus();
  }, [getFocusableElements]);

  // Get all available shortcuts for display
  const getAllShortcuts = useCallback(() => {
    return [...navigationShortcuts, ...actionShortcuts, ...focusShortcuts];
  }, []);

  return {
    focusFirstElement,
    focusLastElement,
    focusNextElement,
    focusPreviousElement,
    getFocusableElements,
    getAllShortcuts,
    shortcuts: shortcutsRef.current
  };
};

