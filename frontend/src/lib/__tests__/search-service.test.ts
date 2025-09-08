import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchService } from '../search-service';
import { supabase } from '../supabase-client';

// Mock Supabase client
vi.mock('../supabase-client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('SearchService', () => {
  let searchService: SearchService;
  const mockSupabaseClient = vi.mocked(supabase);

  beforeEach(() => {
    searchService = new SearchService();
    vi.clearAllMocks();
  });

  describe('searchCustomers', () => {
    it('should search customers by name', async () => {
      const mockCustomers = [
        {
          id: '1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          tenant_id: 'tenant-123',
        },
        {
          id: '2',
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@example.com',
          tenant_id: 'tenant-123',
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockCustomers, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await searchService.searchCustomers('John', 'tenant-123');

      expect(result).toEqual(mockCustomers);
      expect(mockQuery.ilike).toHaveBeenCalledWith('first_name', '%John%');
      expect(mockQuery.eq).toHaveBeenCalledWith('tenant_id', 'tenant-123');
    });

    it('should handle search errors gracefully', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        ilike: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: null, error: { message: 'Search error' } }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await searchService.searchCustomers('John', 'tenant-123');

      expect(result).toEqual([]);
    });
  });

  describe('searchWorkOrders', () => {
    it('should search work orders by service type', async () => {
      const mockWorkOrders = [
        {
          id: '1',
          service_type: 'pest_control',
          status: 'scheduled',
          customer_id: 'customer-1',
          tenant_id: 'tenant-123',
        },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockWorkOrders, error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      const result = await searchService.searchWorkOrders('pest_control', 'tenant-123');

      expect(result).toEqual(mockWorkOrders);
      expect(mockQuery.eq).toHaveBeenCalledWith('service_type', 'pest_control');
      expect(mockQuery.eq).toHaveBeenCalledWith('tenant_id', 'tenant-123');
    });
  });

  describe('globalSearch', () => {
    it('should perform global search across multiple entities', async () => {
      const mockResults = {
        customers: [
          { id: '1', first_name: 'John', last_name: 'Doe', tenant_id: 'tenant-123' },
        ],
        workOrders: [
          { id: '1', service_type: 'pest_control', status: 'scheduled', tenant_id: 'tenant-123' },
        ],
        jobs: [
          { id: '1', title: 'Pest Control Job', status: 'active', tenant_id: 'tenant-123' },
        ],
      };

      // Mock multiple queries
      const mockCustomerQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockResults.customers, error: null }),
      };

      const mockWorkOrderQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockResults.workOrders, error: null }),
      };

      const mockJobQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: mockResults.jobs, error: null }),
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(mockCustomerQuery)
        .mockReturnValueOnce(mockWorkOrderQuery)
        .mockReturnValueOnce(mockJobQuery);

      const result = await searchService.globalSearch('pest', 'tenant-123');

      expect(result).toEqual({
        customers: mockResults.customers,
        workOrders: mockResults.workOrders,
        jobs: mockResults.jobs,
        totalResults: 3,
      });
    });

    it('should handle partial failures gracefully', async () => {
      const mockCustomerQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      const mockWorkOrderQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: null, error: { message: 'Error' } }),
      };

      const mockJobQuery = {
        select: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      mockSupabaseClient.from
        .mockReturnValueOnce(mockCustomerQuery)
        .mockReturnValueOnce(mockWorkOrderQuery)
        .mockReturnValueOnce(mockJobQuery);

      const result = await searchService.globalSearch('test', 'tenant-123');

      expect(result).toEqual({
        customers: [],
        workOrders: [],
        jobs: [],
        totalResults: 0,
      });
    });
  });

  describe('searchWithFilters', () => {
    it('should apply multiple filters correctly', async () => {
      const filters = {
        status: 'scheduled',
        service_type: 'pest_control',
        date_range: {
          start: '2024-01-01',
          end: '2024-01-31',
        },
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        gte: vi.fn().mockReturnThis(),
        lte: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      mockSupabaseClient.from.mockReturnValue(mockQuery);

      await searchService.searchWithFilters('work_orders', filters, 'tenant-123');

      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'scheduled');
      expect(mockQuery.eq).toHaveBeenCalledWith('service_type', 'pest_control');
      expect(mockQuery.gte).toHaveBeenCalledWith('scheduled_date', '2024-01-01');
      expect(mockQuery.lte).toHaveBeenCalledWith('scheduled_date', '2024-01-31');
    });
  });
});


