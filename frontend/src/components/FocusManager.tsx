import React, { useEffect, useRef } from 'react';

interface FocusManagerProps {
  children: React.ReactNode;
  autoFocus?: boolean;
  trapFocus?: boolean;
  restoreFocus?: boolean;
  onFocusChange?: (element: HTMLElement | null) => void;
}

const FocusManager: React.FC<FocusManagerProps> = ({
  children,
  autoFocus = false,
  trapFocus = false,
  restoreFocus = false,
  onFocusChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Get all focusable elements within the container
  const getFocusableElements = (): HTMLElement[] => {
    if (!containerRef.current) return [];

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

    const elements = containerRef.current.querySelectorAll(focusableSelectors.join(', '));
    return Array.from(elements) as HTMLElement[];
  };

  // Focus trap logic
  useEffect(() => {
    if (!trapFocus || !containerRef.current) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;

      if (event.shiftKey) {
        // Shift + Tab: move backwards
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: move forwards
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [trapFocus]);

  // Auto focus first element
  useEffect(() => {
    if (!autoFocus || !containerRef.current) return;

    const timer = setTimeout(() => {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0 && focusableElements[0]) {
        focusableElements[0].focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [autoFocus]);

  // Restore focus on unmount
  useEffect(() => {
    if (!restoreFocus) return;

    return () => {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [restoreFocus]);

  // Track focus changes
  useEffect(() => {
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (containerRef.current?.contains(target)) {
        onFocusChange?.(target);
      }
    };

    const handleFocusOut = () => {
      onFocusChange?.(null);
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [onFocusChange]);

  return (
    <div 
      ref={containerRef}
      className="focus-manager"
      tabIndex={trapFocus ? -1 : undefined}
    >
      {children}
    </div>
  );
};

export default FocusManager;

