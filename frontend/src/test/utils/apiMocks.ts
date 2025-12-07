/**
 * API Mocking Utilities
 * 
 * Provides mocks for API clients and responses used in testing.
 * These mocks simulate API behavior without making actual network requests.
 */

import { vi } from 'vitest';
import type { Account } from '@/types/enhanced-types';
import { TechnicianProfile, EmploymentType, TechnicianStatus } from '@/types/technician';
import { WorkOrder, WorkOrderStatus, WorkOrderPriority } from '@/types/work-orders';

/**
 * Mock technicians API responses
 */
export const mockTechniciansApi = () => {
  const mockTechnicians: TechnicianProfile[] = [
    {
      id: 'tech-1',
      user_id: 'user-1',
      employee_id: 'EMP-001',
      hire_date: new Date().toISOString(),
      position: 'Pest Control Technician',
      department: 'Field Operations',
      employment_type: EmploymentType.FULL_TIME,
      status: TechnicianStatus.ACTIVE,
      country: 'US',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: 'user-1',
        email: 'tech1@example.com',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1-555-0001',
      },
    },
    {
      id: 'tech-2',
      user_id: 'user-2',
      employee_id: 'EMP-002',
      hire_date: new Date().toISOString(),
      position: 'Senior Technician',
      department: 'Field Operations',
      employment_type: EmploymentType.FULL_TIME,
      status: TechnicianStatus.ACTIVE,
      country: 'US',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: {
        id: 'user-2',
        email: 'tech2@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '+1-555-0002',
      },
    },
  ];

  return {
    list: vi.fn().mockResolvedValue({
      technicians: mockTechnicians,
      total: mockTechnicians.length,
      page: 1,
      limit: 10,
      total_pages: 1,
    }),
    get: vi.fn().mockResolvedValue(mockTechnicians[0]),
    create: vi.fn().mockResolvedValue(mockTechnicians[0]),
    update: vi.fn().mockResolvedValue(mockTechnicians[0]),
    delete: vi.fn().mockResolvedValue(undefined),
  };
};

/**
 * Mock accounts API responses
 */
export const mockAccountsApi = () => {
  const mockAccounts: Account[] = [
    {
      id: 'account-1',
      tenant_id: 'tenant-123',
      name: 'Test Customer 1',
      account_type: 'residential',
      status: 'active',
      phone: '+1-555-1000',
      email: 'customer1@example.com',
      address: '123 Main St',
      city: 'Test City',
      state: 'TC',
      zip_code: '12345',
      ar_balance: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'account-2',
      tenant_id: 'tenant-123',
      name: 'Test Customer 2',
      account_type: 'commercial',
      status: 'active',
      phone: '+1-555-2000',
      email: 'customer2@example.com',
      address: '456 Business Ave',
      city: 'Test City',
      state: 'TC',
      zip_code: '12345',
      ar_balance: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'account-3',
      tenant_id: 'tenant-123',
      name: 'Test Customer 3',
      account_type: 'residential',
      status: 'active',
      phone: '+1-555-3000',
      email: 'customer3@example.com',
      address: '789 Residential Rd',
      city: 'Test City',
      state: 'TC',
      zip_code: '12345',
      ar_balance: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  return {
    getAll: vi.fn().mockResolvedValue(mockAccounts),
    get: vi.fn().mockResolvedValue(mockAccounts[0]),
    search: vi.fn().mockImplementation((query: string) => {
      const searchTerm = query.toLowerCase();
      return Promise.resolve(
        mockAccounts.filter(
          (account) =>
            account.name.toLowerCase().includes(searchTerm) ||
            account.email?.toLowerCase().includes(searchTerm) ||
            account.phone?.includes(searchTerm)
        )
      );
    }),
    create: vi.fn().mockResolvedValue(mockAccounts[0]),
    update: vi.fn().mockResolvedValue(mockAccounts[0]),
    delete: vi.fn().mockResolvedValue(undefined),
  };
};

/**
 * Mock work orders API responses
 */
export const mockWorkOrdersApi = () => {
  const mockWorkOrders: WorkOrder[] = [
    {
      id: 'wo-1',
      work_order_number: 'WO-001',
      tenant_id: 'tenant-123',
      customer_id: 'account-1',
      status: WorkOrderStatus.PENDING,
      priority: WorkOrderPriority.MEDIUM,
      scheduled_date: new Date(Date.now() + 86400000).toISOString(),
      description: 'Test work order 1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'wo-2',
      work_order_number: 'WO-002',
      tenant_id: 'tenant-123',
      customer_id: 'account-2',
      status: WorkOrderStatus.IN_PROGRESS,
      priority: WorkOrderPriority.HIGH,
      scheduled_date: new Date().toISOString(),
      description: 'Test work order 2',
      assigned_to: 'tech-1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  return {
    list: vi.fn().mockResolvedValue({
      data: mockWorkOrders,
      pagination: {
        page: 1,
        limit: 10,
        total: mockWorkOrders.length,
        totalPages: 1,
      },
    }),
    get: vi.fn().mockResolvedValue(mockWorkOrders[0]),
    create: vi.fn().mockResolvedValue(mockWorkOrders[0]),
    update: vi.fn().mockResolvedValue(mockWorkOrders[0]),
    delete: vi.fn().mockResolvedValue(undefined),
  };
};

/**
 * Mock authentication API responses
 */
export const mockAuthApi = () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: {
      tenant_id: 'tenant-123',
      role: 'dispatcher',
    },
  };

  const mockSession = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    user: mockUser,
  };

  return {
    signIn: vi.fn().mockResolvedValue({
      data: {
        user: mockUser,
        session: mockSession,
      },
      error: null,
    }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    getUser: vi.fn().mockResolvedValue({
      data: { user: mockUser },
      error: null,
    }),
    getSession: vi.fn().mockResolvedValue({
      data: { session: mockSession },
      error: null,
    }),
    exchangeToken: vi.fn().mockResolvedValue({
      token: 'mock-backend-token',
      expiresIn: 3600,
    }),
  };
};

/**
 * Mock enhancedApi client
 */
export const mockEnhancedApi = () => {
  return {
    technicians: mockTechniciansApi(),
    accounts: mockAccountsApi(),
    workOrders: mockWorkOrdersApi(),
    search: {
      accounts: vi.fn().mockResolvedValue([]),
      technicians: vi.fn().mockResolvedValue([]),
      workOrders: vi.fn().mockResolvedValue([]),
    },
  };
};

/**
 * Mock secureApiClient
 */
export const mockSecureApiClient = () => {
  const accountsApi = mockAccountsApi();
  
  return {
    getAllAccounts: vi.fn().mockResolvedValue(accountsApi.getAll()),
    getAccount: vi.fn().mockResolvedValue(accountsApi.get()),
    createAccount: vi.fn().mockResolvedValue(accountsApi.create()),
    updateAccount: vi.fn().mockResolvedValue(accountsApi.update()),
    deleteAccount: vi.fn().mockResolvedValue(accountsApi.delete()),
    searchAccounts: vi.fn().mockImplementation((query: string) => 
      accountsApi.search(query)
    ),
  };
};

/**
 * Setup global API mocks
 */
export const setupApiMocks = () => {
  // Mock global fetch
  global.fetch = vi.fn();

  // Mock enhancedApi
  vi.mock('@/lib/enhanced-api', () => ({
    enhancedApi: mockEnhancedApi(),
  }));

  // Mock secureApiClient
  vi.mock('@/lib/secure-api-client', () => ({
    secureApiClient: mockSecureApiClient(),
  }));

  // Mock Supabase client
  vi.mock('@/lib/supabase-client', () => ({
    supabase: {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
              email: 'test@example.com',
              user_metadata: { tenant_id: 'tenant-123' },
            },
          },
          error: null,
        }),
        getSession: vi.fn().mockResolvedValue({
          data: {
            session: {
              access_token: 'mock-token',
              user: {
                id: 'user-123',
                email: 'test@example.com',
              },
            },
          },
          error: null,
        }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
        then: vi.fn(),
      })),
    },
  }));
};

