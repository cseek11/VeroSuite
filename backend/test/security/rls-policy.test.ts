/**
 * RLS Policy Tests
 * Tests Row Level Security policies for dashboard regions
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/common/services/prisma.service';
import { SupabaseService } from '../../src/common/services/supabase.service';
import { RLSTestingUtilities, runRLSTests } from './rls-policy-testing-utilities';

describe('RLS Policy Tests', () => {
  let prisma: PrismaService;
  let supabase: SupabaseService;
  let utilities: RLSTestingUtilities;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    supabase = moduleFixture.get<SupabaseService>(SupabaseService);
    utilities = new RLSTestingUtilities(prisma, supabase);
  });

  describe('Dashboard Region RLS', () => {
    it('should prevent cross-tenant access', async () => {
      const result = await runRLSTests(prisma, supabase);

      expect(result.passed).toBe(true);
      expect(result.results.length).toBeGreaterThan(0);

      // All tests should pass
      const failedTests = result.results.filter(r => !r.passed);
      if (failedTests.length > 0) {
        console.error('Failed RLS tests:', failedTests);
      }
      expect(failedTests.length).toBe(0);
    });

    it('should allow users to access their own tenant data', async () => {
      const { tenant1 } = await utilities.createTestUsers();

      try {
        // Create layout and region for tenant1
        const layout = await prisma.dashboardLayout.create({
          data: {
            tenant_id: tenant1.tenantId,
            user_id: tenant1.userId,
            name: 'Test Layout',
            is_default: false
          }
        });

        const region = await prisma.dashboardRegion.create({
          data: {
            layout_id: layout.id,
            tenant_id: tenant1.tenantId,
            user_id: tenant1.userId,
            region_type: 'scheduling',
            grid_row: 0,
            grid_col: 0,
            row_span: 2,
            col_span: 2
          }
        });

        // Tenant1 should be able to access their own data
        const retrievedRegion = await prisma.dashboardRegion.findFirst({
          where: {
            id: region.id,
            tenant_id: tenant1.tenantId
          }
        });

        expect(retrievedRegion).toBeDefined();
        expect(retrievedRegion?.id).toBe(region.id);
        expect(retrievedRegion?.tenant_id).toBe(tenant1.tenantId);
      } finally {
        await utilities.cleanupTestData([tenant1.tenantId]);
      }
    });

    it('should prevent tenant from accessing other tenant\'s regions', async () => {
      const { tenant1, tenant2 } = await utilities.createTestUsers();

      try {
        // Create layout and region for tenant1
        const layout = await prisma.dashboardLayout.create({
          data: {
            tenant_id: tenant1.tenantId,
            user_id: tenant1.userId,
            name: 'Test Layout',
            is_default: false
          }
        });

        const region = await prisma.dashboardRegion.create({
          data: {
            layout_id: layout.id,
            tenant_id: tenant1.tenantId,
            user_id: tenant1.userId,
            region_type: 'scheduling',
            grid_row: 0,
            grid_col: 0,
            row_span: 2,
            col_span: 2
          }
        });

        // Tenant2 should NOT be able to access tenant1's region
        const retrievedRegion = await prisma.dashboardRegion.findFirst({
          where: {
            id: region.id,
            tenant_id: tenant2.tenantId // Different tenant
          }
        });

        expect(retrievedRegion).toBeNull();
      } finally {
        await utilities.cleanupTestData([tenant1.tenantId, tenant2.tenantId]);
      }
    });

    it('should prevent tenant from updating other tenant\'s regions', async () => {
      const { tenant1, tenant2 } = await utilities.createTestUsers();

      try {
        // Create layout and region for tenant1
        const layout = await prisma.dashboardLayout.create({
          data: {
            tenant_id: tenant1.tenantId,
            user_id: tenant1.userId,
            name: 'Test Layout',
            is_default: false
          }
        });

        const region = await prisma.dashboardRegion.create({
          data: {
            layout_id: layout.id,
            tenant_id: tenant1.tenantId,
            user_id: tenant1.userId,
            region_type: 'scheduling',
            grid_row: 0,
            grid_col: 0,
            row_span: 2,
            col_span: 2
          }
        });

        // Tenant2 should NOT be able to update tenant1's region
        await expect(
          prisma.dashboardRegion.update({
            where: {
              id: region.id,
              tenant_id: tenant2.tenantId // Different tenant - should fail
            },
            data: {
              grid_row: 5
            }
          })
        ).rejects.toThrow();
      } finally {
        await utilities.cleanupTestData([tenant1.tenantId, tenant2.tenantId]);
      }
    });

    it('should prevent tenant from deleting other tenant\'s regions', async () => {
      const { tenant1, tenant2 } = await utilities.createTestUsers();

      try {
        // Create layout and region for tenant1
        const layout = await prisma.dashboardLayout.create({
          data: {
            tenant_id: tenant1.tenantId,
            user_id: tenant1.userId,
            name: 'Test Layout',
            is_default: false
          }
        });

        const region = await prisma.dashboardRegion.create({
          data: {
            layout_id: layout.id,
            tenant_id: tenant1.tenantId,
            user_id: tenant1.userId,
            region_type: 'scheduling',
            grid_row: 0,
            grid_col: 0,
            row_span: 2,
            col_span: 2
          }
        });

        // Tenant2 should NOT be able to delete tenant1's region
        await expect(
          prisma.dashboardRegion.delete({
            where: {
              id: region.id,
              tenant_id: tenant2.tenantId // Different tenant - should fail
            }
          })
        ).rejects.toThrow();
      } finally {
        await utilities.cleanupTestData([tenant1.tenantId, tenant2.tenantId]);
      }
    });
  });
});


