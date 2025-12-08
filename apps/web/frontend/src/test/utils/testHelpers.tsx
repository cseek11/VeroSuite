/**
 * Test Utilities and Helpers
 * 
 * Common utilities for testing React components, hooks, and dashboard functionality.
 * Provides factories, mocks, and helper functions to reduce test boilerplate.
 */

import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

/**
 * All Providers Wrapper
 * Wraps components with all necessary providers for testing
 */
const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

/**
 * Custom render function that includes all providers
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllProviders, ...options });
};

/**
 * Mock Card Data Factory
 */
export const createMockCard = (overrides?: Partial<any>) => ({
  id: `card-${Math.random().toString(36).substr(2, 9)}`,
  type: 'customers',
  x: 100,
  y: 100,
  width: 400,
  height: 300,
  ...overrides,
});

/**
 * Mock Dashboard Layout Factory
 */
export const createMockLayout = (cards: any[] = []) => {
  const cardsMap = cards.reduce((acc, card) => {
    acc[card.id] = card;
    return acc;
  }, {} as Record<string, any>);

  return {
    cards: cardsMap,
    currentLayout: 'custom',
    canvasHeight: 1000,
  };
};

/**
 * Mock Dashboard State Factory
 */
export const createMockDashboardState = (overrides?: Partial<any>) => ({
  selectedCards: new Set<string>(),
  setSelectedCards: vi.fn(),
  showCardSelector: false,
  setShowCardSelector: vi.fn(),
  searchTerm: '',
  setSearchTerm: vi.fn(),
  handleDeselectAll: vi.fn(),
  handleSelectAll: vi.fn(),
  ...overrides,
});

/**
 * Mock Server Persistence Factory
 */
export const createMockServerPersistence = () => ({
  addCard: vi.fn().mockResolvedValue('new-card-id'),
  removeCard: vi.fn().mockResolvedValue(undefined),
  updateCardPosition: vi.fn().mockResolvedValue(undefined),
  updateCardSize: vi.fn().mockResolvedValue(undefined),
  currentLayoutId: 'test-layout-id',
  isLoadingLayout: false,
  setIsLoadingLayout: vi.fn(),
  setCurrentLayoutId: vi.fn(),
  setServerLoadSucceeded: vi.fn(),
  serverLoadSucceeded: false,
});

/**
 * Mock Card Interaction Registry
 */
export const createMockCardInteractionRegistry = () => ({
  registerCard: vi.fn(),
  unregisterCard: vi.fn(),
  registerInteraction: vi.fn(),
  getCardConfig: vi.fn(),
  getInteractionConfig: vi.fn(),
  canDrag: vi.fn().mockReturnValue(true),
  canDrop: vi.fn().mockReturnValue(true),
  executeAction: vi.fn().mockResolvedValue({ success: true }),
});

/**
 * Mock Drag Payload Factory
 */
export const createMockDragPayload = (overrides?: Partial<any>) => ({
  sourceCardId: 'source-card-id',
  sourceCardType: 'customers',
  data: { id: 'customer-123', name: 'Test Customer' },
  action: 'create-appointment',
  ...overrides,
});

/**
 * Wait for async operations to complete
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Mock localStorage
 */
export const mockLocalStorage = () => {
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
};

/**
 * Mock API Response Factory
 */
export const createMockApiResponse = <T,>(data: T, overrides?: Partial<Response>) => ({
  ok: true,
  status: 200,
  json: vi.fn().mockResolvedValue(data),
  text: vi.fn().mockResolvedValue(JSON.stringify(data)),
  ...overrides,
} as Response);

/**
 * Create a test user
 */
export const createMockUser = (overrides?: Partial<Record<string, any>>) => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  tenant_id: 'tenant-123',
  roles: ['user'],
  ...overrides,
});

/**
 * Create a test QueryClient
 */
export const createMockQueryClient = (overrides?: Partial<QueryClient>) => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
    ...overrides,
  });
};

/**
 * Create a mock Account/Customer
 */
export const createMockAccount = (overrides?: Partial<any>) => ({
  id: `account-${Math.random().toString(36).substr(2, 9)}`,
  tenant_id: 'tenant-123',
  name: 'Test Customer',
  account_type: 'residential' as const,
  status: 'active' as const,
  phone: '+1-555-0000',
  email: 'customer@example.com',
  address: '123 Test Street',
  city: 'Test City',
  state: 'TC',
  zip_code: '12345',
  ar_balance: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

/**
 * Create a mock Technician
 */
export const createMockTechnician = (overrides?: Partial<any>) => ({
  id: `technician-${Math.random().toString(36).substr(2, 9)}`,
  user_id: `user-${Math.random().toString(36).substr(2, 9)}`,
  employee_id: `EMP-${Math.random().toString(36).substr(2, 9)}`,
  hire_date: new Date().toISOString(),
  position: 'Pest Control Technician',
  department: 'Field Operations',
  employment_type: 'full_time' as const,
  status: 'active' as const,
  country: 'US',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user: {
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    email: 'technician@example.com',
    first_name: 'John',
    last_name: 'Technician',
    phone: '+1-555-0001',
  },
  ...overrides,
});

/**
 * Create a mock Work Order
 */
export const createMockWorkOrder = (overrides?: Partial<any>) => ({
  id: `workorder-${Math.random().toString(36).substr(2, 9)}`,
  work_order_number: `WO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  tenant_id: 'tenant-123',
  customer_id: `account-${Math.random().toString(36).substr(2, 9)}`,
  status: 'pending' as const,
  priority: 'medium' as const,
  scheduled_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  description: 'Test work order description',
  notes: 'Test notes',
  estimated_duration: 60,
  service_price: 100.00,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  account: {
    id: `account-${Math.random().toString(36).substr(2, 9)}`,
    name: 'Test Customer',
    account_type: 'residential',
    phone: '+1-555-0000',
    email: 'customer@example.com',
  },
  ...overrides,
});

/**
 * Render with Router wrapper
 */
export const renderWithRouter = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>{children}</BrowserRouter>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};

/**
 * Render with QueryClient wrapper
 */
export const renderWithQueryClient = (
  ui: React.ReactElement,
  queryClient?: QueryClient,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const client = queryClient || createMockQueryClient();
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return render(ui, { wrapper: Wrapper, ...options });
};

/**
 * Wait for API call to complete
 */
export const waitForApiCall = async (mockFn: ReturnType<typeof vi.fn>, timeout = 5000) => {
  const startTime = Date.now();
  while (!mockFn.mock.calls.length && Date.now() - startTime < timeout) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (!mockFn.mock.calls.length) {
    throw new Error('API call was not made within timeout');
  }
};

/**
 * Mock API response helper
 */
export const mockApiResponse = <T,>(data: T, status = 200, delay = 0) => {
  return new Promise<Response>((resolve) => {
    setTimeout(() => {
      resolve({
        ok: status >= 200 && status < 300,
        status,
        json: async () => data,
        text: async () => JSON.stringify(data),
        headers: new Headers(),
        redirected: false,
        statusText: status >= 200 && status < 300 ? 'OK' : 'Error',
        type: 'default' as ResponseType,
        url: '',
        clone: function() { return this; },
        body: null,
        bodyUsed: false,
        arrayBuffer: async () => new ArrayBuffer(0),
        blob: async () => new Blob(),
        formData: async () => new FormData(),
      } as Response);
    }, delay);
  });
};

/**
 * Re-export everything from testing-library
 */
export * from '@testing-library/react';
export { vi } from 'vitest';





