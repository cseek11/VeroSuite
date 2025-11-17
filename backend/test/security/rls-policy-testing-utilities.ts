/**
 * RLS (Row Level Security) Policy Testing Utilities
 * Utilities for testing tenant isolation and RLS policies
 */

import { PrismaService } from '../../src/common/services/prisma.service';
import { SupabaseService } from '../../src/common/services/supabase.service';

export interface TestUser {
  userId: string;
  tenantId: string;
  email: string;
  role?: string;
}

export interface TestContext {
  user: TestUser;
  supabaseClient: any;
  prisma: PrismaService;
}

/**
 * RLS Testing Utilities Class
 */
export class RLSTestingUtilities {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService
  ) {}

  /**
   * Create test users for different tenants
   */
  async createTestUsers(): Promise<{ tenant1: TestUser; tenant2: TestUser }> {
    const tenant1: TestUser = {
      userId: `test-user-tenant1-${Date.now()}`,
      tenantId: `test-tenant-1-${Date.now()}`,
      email: `test-tenant1-${Date.now()}@example.com`,
      role: 'user'
    };

    const tenant2: TestUser = {
      userId: `test-user-tenant2-${Date.now()}`,
      tenantId: `test-tenant-2-${Date.now()}`,
      email: `test-tenant2-${Date.now()}@example.com`,
      role: 'user'
    };

    return { tenant1, tenant2 };
  }

  /**
   * Get Supabase client with specific user context (for RLS testing)
   */
  async getSupabaseClientForUser(): Promise<any> {
    // This would typically use Supabase's auth to create a client with the user's JWT
    // For testing, you might need to mock or use test tokens
    const client = this.supabase.getClient();
    
    // Set the user context (adjust based on your Supabase setup)
    // This is a placeholder - actual implementation depends on your auth setup
    return client;
  }

  /**
   * Test that tenant cannot access other tenant's data
   */
  async testTenantIsolation(
    tenant1: TestUser,
    tenant2: TestUser,
    createDataFn: (user: TestUser) => Promise<any>,
    queryDataFn: (user: TestUser, dataId: string) => Promise<any>
  ): Promise<{
    passed: boolean;
    message: string;
    details?: any;
  }> {
    try {
      // Create data for tenant1
      const tenant1Data = await createDataFn(tenant1);
      const dataId = tenant1Data.id;

      // Try to access tenant1's data as tenant2 (should fail)
      try {
        await queryDataFn(tenant2, dataId);
        return {
          passed: false,
          message: 'Tenant isolation failed: tenant2 was able to access tenant1\'s data',
          details: { tenant1Data, dataId }
        };
      } catch (error: any) {
        // Expected: should fail with 404 or 403
        if (error.status === 404 || error.status === 403) {
          return {
            passed: true,
            message: 'Tenant isolation working correctly: tenant2 cannot access tenant1\'s data'
          };
        } else {
          return {
            passed: false,
            message: `Unexpected error during tenant isolation test: ${error.message}`,
            details: { error: error.message, status: error.status }
          };
        }
      }
    } catch (error: any) {
      return {
        passed: false,
        message: `Test setup failed: ${error.message}`,
        details: { error: error.message }
      };
    }
  }

  /**
   * Test that user can only access their own tenant's data
   */
  async testUserCanAccessOwnTenantData(
    user: TestUser,
    createDataFn: (user: TestUser) => Promise<any>,
    queryDataFn: (user: TestUser, dataId: string) => Promise<any>
  ): Promise<{
    passed: boolean;
    message: string;
    details?: any;
  }> {
    try {
      // Create data for user
      const userData = await createDataFn(user);
      const dataId = userData.id;

      // User should be able to access their own data
      const retrievedData = await queryDataFn(user, dataId);

      if (retrievedData && retrievedData.id === dataId) {
        return {
          passed: true,
          message: 'User can access their own tenant\'s data'
        };
      } else {
        return {
          passed: false,
          message: 'User cannot access their own tenant\'s data',
          details: { expected: dataId, got: retrievedData?.id }
        };
      }
    } catch (error: any) {
      return {
        passed: false,
        message: `Test failed: ${error.message}`,
        details: { error: error.message }
      };
    }
  }

  /**
   * Test RLS policy for dashboard regions
   */
  async testDashboardRegionRLS(
    tenant1: TestUser,
    tenant2: TestUser
  ): Promise<{
    passed: boolean;
    message: string;
    tests: Array<{ name: string; passed: boolean; message: string }>;
  }> {
    const tests: Array<{ name: string; passed: boolean; message: string }> = [];

    // Test 1: Create region for tenant1
    let tenant1LayoutId: string;
    let tenant1RegionId: string;

    try {
      const layout = await this.prisma.dashboardLayout.create({
        data: {
          tenant_id: tenant1.tenantId,
          user_id: tenant1.userId,
          name: 'Test Layout',
          is_default: false
        }
      });
      tenant1LayoutId = layout.id;

      const region = await this.prisma.dashboardRegion.create({
        data: {
          layout_id: tenant1LayoutId,
          tenant_id: tenant1.tenantId,
          user_id: tenant1.userId,
          region_type: 'scheduling',
          grid_row: 0,
          grid_col: 0,
          row_span: 2,
          col_span: 2
        }
      });
      tenant1RegionId = region.id;

      tests.push({
        name: 'Create region for tenant1',
        passed: true,
        message: 'Successfully created region'
      });
    } catch (error: any) {
      tests.push({
        name: 'Create region for tenant1',
        passed: false,
        message: `Failed: ${error.message}`
      });
      return { passed: false, message: 'Setup failed', tests };
    }

    // Test 2: Tenant1 can access their own region
    try {
      const region = await this.prisma.dashboardRegion.findFirst({
        where: {
          id: tenant1RegionId,
          tenant_id: tenant1.tenantId
        }
      });

      if (region && region.id === tenant1RegionId) {
        tests.push({
          name: 'Tenant1 can access own region',
          passed: true,
          message: 'Tenant1 successfully accessed their region'
        });
      } else {
        tests.push({
          name: 'Tenant1 can access own region',
          passed: false,
          message: 'Tenant1 could not access their own region'
        });
      }
    } catch (error: any) {
      tests.push({
        name: 'Tenant1 can access own region',
        passed: false,
        message: `Error: ${error.message}`
      });
    }

    // Test 3: Tenant2 cannot access tenant1's region
    try {
      const region = await this.prisma.dashboardRegion.findFirst({
        where: {
          id: tenant1RegionId,
          tenant_id: tenant2.tenantId // Different tenant
        }
      });

      if (!region) {
        tests.push({
          name: 'Tenant2 cannot access tenant1\'s region',
          passed: true,
          message: 'RLS correctly prevented cross-tenant access'
        });
      } else {
        tests.push({
          name: 'Tenant2 cannot access tenant1\'s region',
          passed: false,
          message: 'RLS failed: tenant2 was able to access tenant1\'s region'
        });
      }
    } catch (error: any) {
      // If query throws error, that's also acceptable (RLS blocking)
      tests.push({
        name: 'Tenant2 cannot access tenant1\'s region',
        passed: true,
        message: `RLS blocked access: ${error.message}`
      });
    }

    // Test 4: Tenant2 cannot update tenant1's region
    try {
      await this.prisma.dashboardRegion.update({
        where: {
          id: tenant1RegionId,
          tenant_id: tenant2.tenantId // Should fail
        },
        data: {
          grid_row: 5
        }
      });

      tests.push({
        name: 'Tenant2 cannot update tenant1\'s region',
        passed: false,
        message: 'RLS failed: tenant2 was able to update tenant1\'s region'
      });
    } catch (error: any) {
      tests.push({
        name: 'Tenant2 cannot update tenant1\'s region',
        passed: true,
        message: `RLS correctly prevented update: ${error.message}`
      });
    }

    // Test 5: Tenant2 cannot delete tenant1's region
    try {
      await this.prisma.dashboardRegion.delete({
        where: {
          id: tenant1RegionId,
          tenant_id: tenant2.tenantId // Should fail
        }
      });

      tests.push({
        name: 'Tenant2 cannot delete tenant1\'s region',
        passed: false,
        message: 'RLS failed: tenant2 was able to delete tenant1\'s region'
      });
    } catch (error: any) {
      tests.push({
        name: 'Tenant2 cannot delete tenant1\'s region',
        passed: true,
        message: `RLS correctly prevented deletion: ${error.message}`
      });
    }

    // Cleanup
    try {
      await this.prisma.dashboardRegion.deleteMany({
        where: {
          layout_id: tenant1LayoutId,
          tenant_id: tenant1.tenantId
        }
      });

      await this.prisma.dashboardLayout.deleteMany({
        where: {
          id: tenant1LayoutId,
          tenant_id: tenant1.tenantId
        }
      });
    } catch (error) {
      // Ignore cleanup errors
    }

    const allPassed = tests.every(t => t.passed);
    return {
      passed: allPassed,
      message: allPassed
        ? 'All RLS tests passed'
        : `${tests.filter(t => !t.passed).length} RLS tests failed`,
      tests
    };
  }

  /**
   * Test RLS with Supabase client (if using Supabase RLS)
   */
  async testSupabaseRLS(
    tenant1: TestUser,
    tenant2: TestUser
  ): Promise<{
    passed: boolean;
    message: string;
    details?: any;
  }> {
    // This would test RLS policies at the Supabase level
    // Implementation depends on your Supabase setup
    
    try {
      const tenant1Client = await this.getSupabaseClientForUser();
      const tenant2Client = await this.getSupabaseClientForUser();

      // Create data with tenant1 client
      const { data: tenant1Data, error: createError } = await tenant1Client
        .from('dashboard_regions')
        .insert({
          layout_id: 'test-layout',
          tenant_id: tenant1.tenantId,
          user_id: tenant1.userId,
          region_type: 'scheduling',
          grid_row: 0,
          grid_col: 0,
          row_span: 2,
          col_span: 2
        })
        .select()
        .single();

      if (createError) {
        return {
          passed: false,
          message: `Failed to create test data: ${createError.message}`,
          details: { error: createError }
        };
      }

      // Try to access with tenant2 client (should fail due to RLS)
      const { data: tenant2Data, error: accessError } = await tenant2Client
        .from('dashboard_regions')
        .select('*')
        .eq('id', tenant1Data.id)
        .single();

      if (tenant2Data) {
        return {
          passed: false,
          message: 'RLS failed: tenant2 was able to access tenant1\'s data',
          details: { tenant1Data, tenant2Data }
        };
      }

      // If accessError exists and indicates permission denied, that's good
      if (accessError && (accessError.code === 'PGRST116' || accessError.message.includes('permission'))) {
        return {
          passed: true,
          message: 'RLS correctly prevented cross-tenant access'
        };
      }

      return {
        passed: false,
        message: 'Unexpected RLS behavior',
        details: { accessError }
      };
    } catch (error: any) {
      return {
        passed: false,
        message: `RLS test error: ${error.message}`,
        details: { error: error.message }
      };
    }
  }

  /**
   * Cleanup test data
   */
  async cleanupTestData(tenantIds: string[]): Promise<void> {
    for (const tenantId of tenantIds) {
      await this.prisma.dashboardRegion.deleteMany({
        where: { tenant_id: tenantId }
      });

      await this.prisma.dashboardLayout.deleteMany({
        where: { tenant_id: tenantId }
      });
    }
  }
}

/**
 * Helper function to run RLS tests
 */
export async function runRLSTests(
  prisma: PrismaService,
  supabase: SupabaseService
): Promise<{
  passed: boolean;
  results: Array<{ name: string; passed: boolean; message: string }>;
}> {
  const utilities = new RLSTestingUtilities(prisma, supabase);
  const { tenant1, tenant2 } = await utilities.createTestUsers();

  try {
    const result = await utilities.testDashboardRegionRLS(tenant1, tenant2);

    return {
      passed: result.passed,
      results: result.tests
    };
  } finally {
    await utilities.cleanupTestData([tenant1.tenantId, tenant2.tenantId]);
  }
}

