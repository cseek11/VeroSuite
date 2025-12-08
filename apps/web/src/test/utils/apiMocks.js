"use strict";
/**
 * API Mocking Utilities
 *
 * Provides mocks for API clients and responses used in testing.
 * These mocks simulate API behavior without making actual network requests.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupApiMocks = exports.mockSecureApiClient = exports.mockEnhancedApi = exports.mockAuthApi = exports.mockWorkOrdersApi = exports.mockAccountsApi = exports.mockTechniciansApi = void 0;
var vitest_1 = require("vitest");
var technician_1 = require("@/types/technician");
var work_orders_1 = require("@/types/work-orders");
/**
 * Mock technicians API responses
 */
var mockTechniciansApi = function () {
    var mockTechnicians = [
        {
            id: 'tech-1',
            user_id: 'user-1',
            employee_id: 'EMP-001',
            hire_date: new Date().toISOString(),
            position: 'Pest Control Technician',
            department: 'Field Operations',
            employment_type: technician_1.EmploymentType.FULL_TIME,
            status: technician_1.TechnicianStatus.ACTIVE,
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
            employment_type: technician_1.EmploymentType.FULL_TIME,
            status: technician_1.TechnicianStatus.ACTIVE,
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
        list: vitest_1.vi.fn().mockResolvedValue({
            technicians: mockTechnicians,
            total: mockTechnicians.length,
            page: 1,
            limit: 10,
            total_pages: 1,
        }),
        get: vitest_1.vi.fn().mockResolvedValue(mockTechnicians[0]),
        create: vitest_1.vi.fn().mockResolvedValue(mockTechnicians[0]),
        update: vitest_1.vi.fn().mockResolvedValue(mockTechnicians[0]),
        delete: vitest_1.vi.fn().mockResolvedValue(undefined),
    };
};
exports.mockTechniciansApi = mockTechniciansApi;
/**
 * Mock accounts API responses
 */
var mockAccountsApi = function () {
    var mockAccounts = [
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
        getAll: vitest_1.vi.fn().mockResolvedValue(mockAccounts),
        get: vitest_1.vi.fn().mockResolvedValue(mockAccounts[0]),
        search: vitest_1.vi.fn().mockImplementation(function (query) {
            var searchTerm = query.toLowerCase();
            return Promise.resolve(mockAccounts.filter(function (account) {
                var _a, _b;
                return account.name.toLowerCase().includes(searchTerm) ||
                    ((_a = account.email) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchTerm)) ||
                    ((_b = account.phone) === null || _b === void 0 ? void 0 : _b.includes(searchTerm));
            }));
        }),
        create: vitest_1.vi.fn().mockResolvedValue(mockAccounts[0]),
        update: vitest_1.vi.fn().mockResolvedValue(mockAccounts[0]),
        delete: vitest_1.vi.fn().mockResolvedValue(undefined),
    };
};
exports.mockAccountsApi = mockAccountsApi;
/**
 * Mock work orders API responses
 */
var mockWorkOrdersApi = function () {
    var mockWorkOrders = [
        {
            id: 'wo-1',
            work_order_number: 'WO-001',
            tenant_id: 'tenant-123',
            customer_id: 'account-1',
            status: work_orders_1.WorkOrderStatus.PENDING,
            priority: work_orders_1.WorkOrderPriority.MEDIUM,
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
            status: work_orders_1.WorkOrderStatus.IN_PROGRESS,
            priority: work_orders_1.WorkOrderPriority.HIGH,
            scheduled_date: new Date().toISOString(),
            description: 'Test work order 2',
            assigned_to: 'tech-1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ];
    return {
        list: vitest_1.vi.fn().mockResolvedValue({
            data: mockWorkOrders,
            pagination: {
                page: 1,
                limit: 10,
                total: mockWorkOrders.length,
                totalPages: 1,
            },
        }),
        get: vitest_1.vi.fn().mockResolvedValue(mockWorkOrders[0]),
        create: vitest_1.vi.fn().mockResolvedValue(mockWorkOrders[0]),
        update: vitest_1.vi.fn().mockResolvedValue(mockWorkOrders[0]),
        delete: vitest_1.vi.fn().mockResolvedValue(undefined),
    };
};
exports.mockWorkOrdersApi = mockWorkOrdersApi;
/**
 * Mock authentication API responses
 */
var mockAuthApi = function () {
    var mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {
            tenant_id: 'tenant-123',
            role: 'dispatcher',
        },
    };
    var mockSession = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: mockUser,
    };
    return {
        signIn: vitest_1.vi.fn().mockResolvedValue({
            data: {
                user: mockUser,
                session: mockSession,
            },
            error: null,
        }),
        signOut: vitest_1.vi.fn().mockResolvedValue({ error: null }),
        getUser: vitest_1.vi.fn().mockResolvedValue({
            data: { user: mockUser },
            error: null,
        }),
        getSession: vitest_1.vi.fn().mockResolvedValue({
            data: { session: mockSession },
            error: null,
        }),
        exchangeToken: vitest_1.vi.fn().mockResolvedValue({
            token: 'mock-backend-token',
            expiresIn: 3600,
        }),
    };
};
exports.mockAuthApi = mockAuthApi;
/**
 * Mock enhancedApi client
 */
var mockEnhancedApi = function () {
    return {
        technicians: (0, exports.mockTechniciansApi)(),
        accounts: (0, exports.mockAccountsApi)(),
        workOrders: (0, exports.mockWorkOrdersApi)(),
        search: {
            accounts: vitest_1.vi.fn().mockResolvedValue([]),
            technicians: vitest_1.vi.fn().mockResolvedValue([]),
            workOrders: vitest_1.vi.fn().mockResolvedValue([]),
        },
    };
};
exports.mockEnhancedApi = mockEnhancedApi;
/**
 * Mock secureApiClient
 */
var mockSecureApiClient = function () {
    var accountsApi = (0, exports.mockAccountsApi)();
    return {
        getAllAccounts: vitest_1.vi.fn().mockResolvedValue(accountsApi.getAll()),
        getAccount: vitest_1.vi.fn().mockResolvedValue(accountsApi.get()),
        createAccount: vitest_1.vi.fn().mockResolvedValue(accountsApi.create()),
        updateAccount: vitest_1.vi.fn().mockResolvedValue(accountsApi.update()),
        deleteAccount: vitest_1.vi.fn().mockResolvedValue(accountsApi.delete()),
        searchAccounts: vitest_1.vi.fn().mockImplementation(function (query) {
            return accountsApi.search(query);
        }),
    };
};
exports.mockSecureApiClient = mockSecureApiClient;
/**
 * Setup global API mocks
 */
var setupApiMocks = function () {
    // Mock global fetch
    global.fetch = vitest_1.vi.fn();
    // Mock enhancedApi
    vitest_1.vi.mock('@/lib/enhanced-api', function () { return ({
        enhancedApi: (0, exports.mockEnhancedApi)(),
    }); });
    // Mock secureApiClient
    vitest_1.vi.mock('@/lib/secure-api-client', function () { return ({
        secureApiClient: (0, exports.mockSecureApiClient)(),
    }); });
    // Mock Supabase client
    vitest_1.vi.mock('@/lib/supabase-client', function () { return ({
        supabase: {
            auth: {
                getUser: vitest_1.vi.fn().mockResolvedValue({
                    data: {
                        user: {
                            id: 'user-123',
                            email: 'test@example.com',
                            user_metadata: { tenant_id: 'tenant-123' },
                        },
                    },
                    error: null,
                }),
                getSession: vitest_1.vi.fn().mockResolvedValue({
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
                signOut: vitest_1.vi.fn().mockResolvedValue({ error: null }),
            },
            from: vitest_1.vi.fn(function () { return ({
                select: vitest_1.vi.fn().mockReturnThis(),
                insert: vitest_1.vi.fn().mockReturnThis(),
                update: vitest_1.vi.fn().mockReturnThis(),
                delete: vitest_1.vi.fn().mockReturnThis(),
                eq: vitest_1.vi.fn().mockReturnThis(),
                single: vitest_1.vi.fn().mockResolvedValue({ data: null, error: null }),
                then: vitest_1.vi.fn(),
            }); }),
        },
    }); });
};
exports.setupApiMocks = setupApiMocks;
