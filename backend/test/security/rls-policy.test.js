"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const app_module_1 = require("../../src/app.module");
const prisma_service_1 = require("../../src/common/services/prisma.service");
const supabase_service_1 = require("../../src/common/services/supabase.service");
const rls_policy_testing_utilities_1 = require("./rls-policy-testing-utilities");
describe('RLS Policy Tests', () => {
    let prisma;
    let supabase;
    let utilities;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        prisma = moduleFixture.get(prisma_service_1.PrismaService);
        supabase = moduleFixture.get(supabase_service_1.SupabaseService);
        utilities = new rls_policy_testing_utilities_1.RLSTestingUtilities(prisma, supabase);
    });
    describe('Dashboard Region RLS', () => {
        it('should prevent cross-tenant access', async () => {
            const result = await (0, rls_policy_testing_utilities_1.runRLSTests)(prisma, supabase);
            expect(result.passed).toBe(true);
            expect(result.results.length).toBeGreaterThan(0);
            const failedTests = result.results.filter(r => !r.passed);
            if (failedTests.length > 0) {
                console.error('Failed RLS tests:', failedTests);
            }
            expect(failedTests.length).toBe(0);
        });
        it('should allow users to access their own tenant data', async () => {
            const { tenant1 } = await utilities.createTestUsers();
            try {
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
                const retrievedRegion = await prisma.dashboardRegion.findFirst({
                    where: {
                        id: region.id,
                        tenant_id: tenant1.tenantId
                    }
                });
                expect(retrievedRegion).toBeDefined();
                expect(retrievedRegion === null || retrievedRegion === void 0 ? void 0 : retrievedRegion.id).toBe(region.id);
                expect(retrievedRegion === null || retrievedRegion === void 0 ? void 0 : retrievedRegion.tenant_id).toBe(tenant1.tenantId);
            }
            finally {
                await utilities.cleanupTestData([tenant1.tenantId]);
            }
        });
        it('should prevent tenant from accessing other tenant\'s regions', async () => {
            const { tenant1, tenant2 } = await utilities.createTestUsers();
            try {
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
                const retrievedRegion = await prisma.dashboardRegion.findFirst({
                    where: {
                        id: region.id,
                        tenant_id: tenant2.tenantId
                    }
                });
                expect(retrievedRegion).toBeNull();
            }
            finally {
                await utilities.cleanupTestData([tenant1.tenantId, tenant2.tenantId]);
            }
        });
        it('should prevent tenant from updating other tenant\'s regions', async () => {
            const { tenant1, tenant2 } = await utilities.createTestUsers();
            try {
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
                await expect(prisma.dashboardRegion.update({
                    where: {
                        id: region.id,
                        tenant_id: tenant2.tenantId
                    },
                    data: {
                        grid_row: 5
                    }
                })).rejects.toThrow();
            }
            finally {
                await utilities.cleanupTestData([tenant1.tenantId, tenant2.tenantId]);
            }
        });
        it('should prevent tenant from deleting other tenant\'s regions', async () => {
            const { tenant1, tenant2 } = await utilities.createTestUsers();
            try {
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
                await expect(prisma.dashboardRegion.delete({
                    where: {
                        id: region.id,
                        tenant_id: tenant2.tenantId
                    }
                })).rejects.toThrow();
            }
            finally {
                await utilities.cleanupTestData([tenant1.tenantId, tenant2.tenantId]);
            }
        });
    });
});
//# sourceMappingURL=rls-policy.test.js.map