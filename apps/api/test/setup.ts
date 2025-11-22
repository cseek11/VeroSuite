// Mock Supabase Auth - MUST be at top (Jest hoists mocks)
// IMPORTANT: User IDs must match Prisma user IDs because AuthService looks up by id: user.id
jest.mock('@supabase/supabase-js', () => {
  // In-memory storage for dashboard regions (stateful mock)
  // These are module-level, so they persist across tests
  // Tests should clean up using Prisma, but we'll also provide a way to clear
  const regionStore: Map<string, any> = new Map();
  const layoutStore: Map<string, any> = new Map();
  
  // Helper to clear stores (can be called from tests if needed)
  (global as any).__clearSupabaseMockStores = () => {
    regionStore.clear();
    // Don't clear layoutStore - layouts persist across tests
  };
  
  // Helper to get store size for debugging
  (global as any).__getSupabaseMockStoreSize = () => {
    return regionStore.size;
  };
  
  // Helper to store layout in mock (for layouts created via Prisma)
  (global as any).__storeLayoutInSupabaseMock = (layoutId: string, layoutData: any) => {
    layoutStore.set(layoutId, layoutData);
  };
  
  // Helper to create a mock query builder that supports method chaining
  const createMockQueryBuilder = (finalResult: any = { data: null, error: null }, table?: string) => {
    let insertCalled = false;
    let updateCalled = false;
    let deleteCalled = false;
    let selectCalled = false;
    let singleCalled = false;
    let insertData: any = null;
    const queryFilters: Map<string, any> = new Map(); // Track eq() filters
    
    const chainable = {
      select: jest.fn().mockImplementation(() => {
        selectCalled = true;
        return chainable;
      }),
      insert: jest.fn().mockImplementation((data: any) => {
        insertCalled = true;
        insertData = Array.isArray(data) ? data[0] : data;
        return chainable;
      }),
      update: jest.fn().mockImplementation((data: any) => {
        updateCalled = true;
        insertData = data; // Reuse insertData for update
        return chainable;
      }),
      delete: jest.fn().mockImplementation(() => {
        deleteCalled = true;
        return chainable;
      }),
      eq: jest.fn().mockImplementation((column: string, value: any) => {
        queryFilters.set(column, value);
        return chainable;
      }),
      neq: jest.fn().mockReturnThis(),
      gt: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lt: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      like: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      is: jest.fn().mockImplementation((column: string, value: any) => {
        queryFilters.set(column, value);
        return chainable;
      }),
      in: jest.fn().mockReturnThis(),
      contains: jest.fn().mockReturnThis(),
      containedBy: jest.fn().mockReturnThis(),
      rangeGt: jest.fn().mockReturnThis(),
      rangeGte: jest.fn().mockReturnThis(),
      rangeLt: jest.fn().mockReturnThis(),
      rangeLte: jest.fn().mockReturnThis(),
      rangeAdjacent: jest.fn().mockReturnThis(),
      overlaps: jest.fn().mockReturnThis(),
      textSearch: jest.fn().mockReturnThis(),
      match: jest.fn().mockReturnThis(),
      not: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      filter: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      abortSignal: jest.fn().mockReturnThis(),
      single: jest.fn().mockImplementation(() => {
        // Mark that single() was called - the then() handler will process it
        singleCalled = true;
        // Return the chainable object so await query.single() uses the then() method
        return chainable;
      }),
      // Make the query builder awaitable (thenable)
      then: jest.fn().mockImplementation(function(resolve, reject) {
        // If insert was called with select, store and return the inserted data
        if (insertCalled && insertData) {
          const { randomUUID } = require('crypto');
          const id = insertData.id || randomUUID();
          const regionData = {
            ...insertData,
            id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deleted_at: null,
            version: insertData.version || 1,
          };
          
          // Store in region store
          if (table === 'dashboard_regions') {
            regionStore.set(id, regionData);
          } else if (table === 'dashboard_layouts') {
            layoutStore.set(id, regionData);
          }
          
          // If single() was called, return a single object, otherwise return an array
          const result = singleCalled
            ? { data: regionData, error: null }
            : { data: [regionData], error: null };
          return Promise.resolve(result).then(resolve, reject);
        }
        // Handle UPDATE operations without select() - used by delete() method
        if (table === 'dashboard_regions' && updateCalled && !selectCalled) {
          const regionId = queryFilters.get('id');
          const tenantId = queryFilters.get('tenant_id');
          
          if (regionId && regionStore.has(regionId)) {
            const existing = regionStore.get(regionId);
            
            // Check tenant_id filter
            if (tenantId && existing.tenant_id !== tenantId) {
              const result = { error: { code: 'PGRST116', message: 'No rows found' } };
              return Promise.resolve(result).then(resolve, reject);
            }
            
            // Check deleted_at filter (is('deleted_at', null))
            if (existing.deleted_at) {
              const result = { error: { code: 'PGRST116', message: 'No rows found' } };
              return Promise.resolve(result).then(resolve, reject);
            }
            
            // Apply update - insertData contains the update fields
            const updateData = { ...insertData };
            
            // Handle soft delete (deleted_at in update data)
            if (updateData.deleted_at) {
              const deleted = {
                ...existing,
                deleted_at: updateData.deleted_at,
                updated_at: new Date().toISOString(),
              };
              regionStore.set(regionId, deleted);
              const result = { error: null };
              return Promise.resolve(result).then(resolve, reject);
            }
            
            // Regular update without select
            const updated = {
              ...existing,
              ...updateData,
              id: existing.id,
              created_at: existing.created_at,
              updated_at: new Date().toISOString(),
            };
            regionStore.set(regionId, updated);
            const result = { error: null };
            return Promise.resolve(result).then(resolve, reject);
          }
          // Not found
          const result = { error: { code: 'PGRST116', message: 'No rows found' } };
          return Promise.resolve(result).then(resolve, reject);
        }
        // Handle UPDATE operations (update().eq().select().single())
        if (table === 'dashboard_regions' && updateCalled && selectCalled) {
          const regionId = queryFilters.get('id');
          const tenantId = queryFilters.get('tenant_id');
          const expectedVersion = queryFilters.get('version');
          
          if (regionId && regionStore.has(regionId)) {
            const existing = regionStore.get(regionId);
            
            // Check tenant_id filter
            if (tenantId && existing.tenant_id !== tenantId) {
              const result = { data: null, error: { code: 'PGRST116', message: 'No rows found' } };
              return Promise.resolve(result).then(resolve, reject);
            }
            
            // Check deleted_at filter (is('deleted_at', null))
            if (existing.deleted_at) {
              const result = { data: null, error: { code: 'PGRST116', message: 'No rows found' } };
              return Promise.resolve(result).then(resolve, reject);
            }
            
            // Check version for optimistic locking
            // The repository does .eq('version', expectedVersion) before update
            // If version doesn't match, the query should return no rows
            if (expectedVersion !== undefined && existing.version !== expectedVersion) {
              const result = { data: null, error: { code: 'PGRST116', message: 'No rows found' } };
              return Promise.resolve(result).then(resolve, reject);
            }
            
            // Apply update - insertData contains the update fields
            // The repository sets version: expectedVersion + 1 in the update data
            const updateData = { ...insertData };
            
            // Handle soft delete (deleted_at in update data)
            if (updateData.deleted_at) {
              const deleted = {
                ...existing,
                deleted_at: updateData.deleted_at,
                updated_at: new Date().toISOString(),
              };
              regionStore.set(regionId, deleted);
              const result = { data: deleted, error: null };
              return Promise.resolve(result).then(resolve, reject);
            }
            
            // Regular update - the repository sets version: expectedVersion + 1 in updateData
            // So updateData.version contains the new version (expectedVersion + 1)
            const newVersion = updateData.version !== undefined 
              ? updateData.version 
              : (existing.version || 1) + 1;
            
            // Remove version and updated_at from updateData before merging (they're handled separately)
            // Keep other fields like grid_row, grid_col, row_span, col_span, etc.
            const { version: _, updated_at: __, ...updateFields } = updateData;
            
            const updated = {
              ...existing,
              ...updateFields, // Apply grid_row, grid_col, row_span, col_span, etc.
              id: existing.id, // Don't allow ID changes
              created_at: existing.created_at, // Preserve created_at
              updated_at: new Date().toISOString(),
              version: newVersion, // Use the version from updateData (expectedVersion + 1)
            };
            regionStore.set(regionId, updated);
            const result = { data: updated, error: null };
            return Promise.resolve(result).then(resolve, reject);
          }
          // Not found
          const result = { data: null, error: { code: 'PGRST116', message: 'No rows found' } };
          return Promise.resolve(result).then(resolve, reject);
        }
        // Handle SELECT queries with single() - used by validation service
        // When await query.single() is called, it uses the then() method
        if (table === 'dashboard_regions' && selectCalled && !insertCalled && !updateCalled && !deleteCalled) {
          const regionId = queryFilters.get('id');
          const tenantId = queryFilters.get('tenant_id');
          const layoutId = queryFilters.get('layout_id');
          
          // If single() was called (indicated by regionId being set), handle as single query
          if (regionId && regionStore.has(regionId)) {
            const region = regionStore.get(regionId);
            
            // Check tenant_id filter
            if (tenantId && region.tenant_id !== tenantId) {
              const result = { data: null, error: { code: 'PGRST116', message: 'No rows found' } };
              return Promise.resolve(result).then(resolve, reject);
            }
            
            // Check layout_id filter (used by validation service)
            if (layoutId !== undefined && region.layout_id !== layoutId) {
              const result = { data: null, error: { code: 'PGRST116', message: 'No rows found' } };
              return Promise.resolve(result).then(resolve, reject);
            }
            
            // Check deleted_at filter (is('deleted_at', null))
            if (queryFilters.has('deleted_at') && queryFilters.get('deleted_at') === null && region.deleted_at !== null) {
              const result = { data: null, error: { code: 'PGRST116', message: 'No rows found' } };
              return Promise.resolve(result).then(resolve, reject);
            }
            
            const result = { data: region, error: null };
            return Promise.resolve(result).then(resolve, reject);
          }
          // If regionId is set but not found, return error
          if (regionId) {
            const result = { data: null, error: { code: 'PGRST116', message: 'No rows found' } };
            return Promise.resolve(result).then(resolve, reject);
          }
        }
        // For SELECT queries on dashboard_regions (list queries, no regionId), return stored regions
        if (table === 'dashboard_regions' && selectCalled && !insertCalled && !updateCalled && !deleteCalled && !queryFilters.has('id')) {
          const layoutId = queryFilters.get('layout_id');
          const tenantId = queryFilters.get('tenant_id');
          const deletedAtFilter = queryFilters.get('deleted_at');
          
          // Filter stored regions
          const allRegions = Array.from(regionStore.values());
          let filteredRegions = allRegions;
          
          if (layoutId) {
            filteredRegions = filteredRegions.filter((r: any) => r.layout_id === layoutId);
          }
          if (tenantId) {
            filteredRegions = filteredRegions.filter((r: any) => r.tenant_id === tenantId);
          }
          // If deleted_at filter is set to null, only return non-deleted regions
          // The repository uses .is('deleted_at', null) which sets deleted_at filter to null
          if (queryFilters.has('deleted_at') && deletedAtFilter === null) {
            filteredRegions = filteredRegions.filter((r: any) => !r.deleted_at);
          }
          
          // Note: Supabase select() with specific columns still returns full objects
          // The client filters them, but for our mock we return full objects
          const result = { data: filteredRegions, error: null };
          return Promise.resolve(result).then(resolve, reject);
        }
        // For other SELECT queries, return empty array
        if (selectCalled && !insertCalled) {
          const result = { data: [], error: null };
          return Promise.resolve(result).then(resolve, reject);
        }
        return Promise.resolve(finalResult).then(resolve, reject);
      }),
      catch: jest.fn().mockImplementation(function(reject) {
        return Promise.resolve(finalResult).catch(reject);
      }),
      maybeSingle: jest.fn().mockResolvedValue(finalResult),
      csv: jest.fn().mockResolvedValue(''),
      geojson: jest.fn().mockResolvedValue({}),
      explain: jest.fn().mockResolvedValue({}),
      rollback: jest.fn().mockResolvedValue({}),
      returns: jest.fn().mockReturnThis(),
    };
    return chainable;
  };

  return {
    createClient: jest.fn(() => ({
      auth: {
        signInWithPassword: jest.fn().mockImplementation(async ({ email, password }) => {
          // Map test emails to Prisma user IDs
          // These IDs must match what we create in global-setup.ts
          const userIdMap: Record<string, string> = {
            'test-user-admin@test.example.com': 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
            'test-user-dispatcher@test.example.com': 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
            'test-user-technician@test.example.com': 'cccccccc-cccc-cccc-cccc-cccccccccccc',
            'test-user-tenant2@test.example.com': 'dddddddd-dddd-dddd-dddd-dddddddddddd'
          };
          
          const userId = userIdMap[email];
          if (!userId) {
            return {
              data: { user: null, session: null },
              error: { message: 'Invalid credentials' }
            };
          }
          
          return {
            data: {
              user: { 
                id: userId, // Must match Prisma user ID
                email,
                user_metadata: {},
                app_metadata: {}
              },
              session: { 
                access_token: `mock-token-${userId}`,
                refresh_token: 'mock-refresh-token',
                expires_in: 3600,
                token_type: 'bearer'
              }
            },
            error: null
          };
        }),
        
        signUp: jest.fn().mockResolvedValue({
          data: {
            user: { id: 'mock-new-user-id', email: 'new@test.example.com' },
            session: null
          },
          error: null
        }),
        
        signOut: jest.fn().mockResolvedValue({ error: null }),
        
        getSession: jest.fn().mockResolvedValue({
          data: {
            session: {
              access_token: 'mock-session-token',
              user: { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', email: 'test-user-admin@test.example.com' }
            }
          },
          error: null
        }),
        
        getUser: jest.fn().mockResolvedValue({
          data: {
            user: { id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', email: 'test-user-admin@test.example.com' }
          },
          error: null
        })
      },
      
      // Mock the from() method to return a query builder
      from: jest.fn((table: string) => createMockQueryBuilder({ data: null, error: null }, table))
    }))
  };
});

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.SUPABASE_SECRET_KEY = 'test-secret-key';

// Mock console methods to reduce noise in tests (using Jest mocks)
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid'),
}));

// Mock axios
jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));


