/**
 * Component Test Utilities
 * 
 * Provides utilities for testing React components with all necessary providers
 * and helpers for common component testing scenarios.
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { createMockQueryClient } from './testHelpers';

/**
 * Render component with all providers (QueryClient, Router, etc.)
 */
export const renderWithAllProviders = (
  ui: React.ReactElement,
  options?: {
    queryClient?: QueryClient;
    initialEntries?: string[];
    renderOptions?: Omit<RenderOptions, 'wrapper'>;
  }
) => {
  const queryClient = options?.queryClient || createMockQueryClient();
  
  const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  return render(ui, {
    wrapper: AllProviders,
    ...options?.renderOptions,
  });
};

/**
 * Create mock form data
 */
export const createMockFormData = (overrides?: Record<string, any>) => {
  const formData = new FormData();
  
  Object.entries(overrides || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  
  return formData;
};

/**
 * Simulate user interaction helpers
 */
export const simulateUserInteraction = {
  /**
   * Type text into an input field
   */
  type: async (element: HTMLElement, text: string) => {
    const input = element as HTMLInputElement;
    input.focus();
    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  },

  /**
   * Click an element
   */
  click: async (element: HTMLElement) => {
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  },

  /**
   * Select an option from a select element
   */
  select: async (element: HTMLSelectElement, value: string) => {
    element.value = value;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  },

  /**
   * Check/uncheck a checkbox
   */
  toggleCheckbox: async (element: HTMLInputElement, checked: boolean) => {
    element.checked = checked;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  },

  /**
   * Submit a form
   */
  submitForm: async (form: HTMLFormElement) => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  },

  /**
   * Press a key
   */
  pressKey: async (element: HTMLElement, key: string, options?: KeyboardEventInit) => {
    element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...options }));
    element.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true, ...options }));
  },
};

/**
 * Wait for component update
 */
export const waitForComponentUpdate = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
};

/**
 * Wait for async state update
 */
export const waitForAsyncUpdate = (timeout = 1000) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

/**
 * Create mock event
 */
export const createMockEvent = (type: string, options?: any) => {
  return new Event(type, { bubbles: true, cancelable: true, ...options });
};

/**
 * Create mock change event
 */
export const createMockChangeEvent = (target: { value: string; name?: string }) => {
  return {
    target,
    currentTarget: target,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  } as unknown as React.ChangeEvent<HTMLInputElement>;
};

/**
 * Create mock form event
 */
export const createMockFormEvent = (target?: HTMLFormElement) => {
  return {
    target: target || ({} as HTMLFormElement),
    currentTarget: target || ({} as HTMLFormElement),
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  } as unknown as React.FormEvent<HTMLFormElement>;
};

/**
 * Create mock click event
 */
export const createMockClickEvent = (target?: HTMLElement) => {
  return {
    target: target || ({} as HTMLElement),
    currentTarget: target || ({} as HTMLElement),
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  } as unknown as React.MouseEvent<HTMLElement>;
};

/**
 * Mock window.location
 */
export const mockWindowLocation = (url: string) => {
  delete (window as any).location;
  (window as any).location = new URL(url);
};

/**
 * Restore window.location
 */
export const restoreWindowLocation = (originalLocation: Location) => {
  // Note: window.location is read-only, so we can't actually restore it
  // This is a test utility that documents the intent
  // In actual tests, use Object.defineProperty to mock location
  if (typeof window !== 'undefined' && 'location' in window) {
    // Cannot actually restore, but this documents the pattern
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true
    });
  }
};

/**
 * Mock IntersectionObserver
 */
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
  window.IntersectionObserver = mockIntersectionObserver as any;
  return mockIntersectionObserver;
};

/**
 * Mock ResizeObserver
 */
export const mockResizeObserver = () => {
  const mockResizeObserver = vi.fn();
  mockResizeObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  });
  window.ResizeObserver = mockResizeObserver as any;
  return mockResizeObserver;
};

/**
 * Mock matchMedia
 */
export const mockMatchMedia = (matches: boolean = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

/**
 * Get all text content from a container
 */
export const getAllTextContent = (container: HTMLElement): string => {
  return container.textContent || '';
};

/**
 * Check if element is visible
 */
export const isElementVisible = (element: HTMLElement): boolean => {
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    element.offsetWidth > 0 &&
    element.offsetHeight > 0
  );
};

/**
 * Wait for element to be visible
 */
export const waitForElementToBeVisible = async (
  element: HTMLElement,
  timeout = 5000
): Promise<void> => {
  const startTime = Date.now();
  while (!isElementVisible(element) && Date.now() - startTime < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (!isElementVisible(element)) {
    throw new Error('Element did not become visible within timeout');
  }
};

/**
 * Wait for element to be hidden
 */
export const waitForElementToBeHidden = async (
  element: HTMLElement,
  timeout = 5000
): Promise<void> => {
  const startTime = Date.now();
  while (isElementVisible(element) && Date.now() - startTime < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (isElementVisible(element)) {
    throw new Error('Element did not become hidden within timeout');
  }
};

