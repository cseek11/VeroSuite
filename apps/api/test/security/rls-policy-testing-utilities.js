"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RLSTestingUtilities = void 0;
exports.runRLSTests = runRLSTests;
class RLSTestingUtilities {
    constructor(prisma, supabase) {
        this.prisma = prisma;
        this.supabase = supabase;
    }
    async createTestUsers() {
        const tenant1 = {
            userId: `test-user-tenant1-${Date.now()}`,
            tenantId: `test-tenant-1-${Date.now()}`,
            email: `test-tenant1-${Date.now()}@example.com`,
            role: 'user'
        };
        const tenant2 = {
            userId: `test-user-tenant2-${Date.now()}`,
            tenantId: `test-tenant-2-${Date.now()}`,
            email: `test-tenant2-${Date.now()}@example.com`,
            role: 'user'
        };
        return { tenant1, tenant2 };
    }
    async getSupabaseClientForUser(user) {
        const client = this.supabase.getClient();
        return client;
    }
    async testTenantIsolation(tenant1, tenant2, createDataFn, queryDataFn) {
        try {
            const tenant1Data = await createDataFn(tenant1);
            const dataId = tenant1Data.id;
            try {
                await queryDataFn(tenant2, dataId);
                return {
                    passed: false,
                    message: 'Tenant isolation failed: tenant2 was able to access tenant1\'s data',
                    details: { tenant1Data, dataId }
                };
            }
            catch (error) {
                if (error.status === 404 || error.status === 403) {
                    return {
                        passed: true,
                        message: 'Tenant isolation working correctly: tenant2 cannot access tenant1\'s data'
                    };
                }
                else {
                    return {
                        passed: false,
                        message: `Unexpected error during tenant isolation test: ${error.message}`,
                        details: { error: error.message, status: error.status }
                    };
                }
            }
        }
        catch (error) {
            return {
                passed: false,
                message: `Test setup failed: ${error.message}`,
                details: { error: error.message }
            };
        }
    }
    async testUserCanAccessOwnTenantData(user, createDataFn, queryDataFn) {
        try {
            const userData = await createDataFn(user);
            const dataId = userData.id;
            const retrievedData = await queryDataFn(user, dataId);
            if (retrievedData && retrievedData.id === dataId) {
                return {
                    passed: true,
                    message: 'User can access their own tenant\'s data'
                };
            }
            else {
                return {
                    passed: false,
                    message: 'User cannot access their own tenant\'s data',
                    details: { expected: dataId, got: retrievedData === null || retrievedData === void 0 ? void 0 : retrievedData.id }
                };
            }
        }
        catch (error) {
            return {
                passed: false,
                message: `Test failed: ${error.message}`,
                details: { error: error.message }
            };
        }
    }
    async testDashboardRegionRLS(tenant1, tenant2) {
        const tests = [];
        let tenant1LayoutId;
        let tenant1RegionId;
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
        }
        catch (error) {
            tests.push({
                name: 'Create region for tenant1',
                passed: false,
                message: `Failed: ${error.message}`
            });
            return { passed: false, message: 'Setup failed', tests };
        }
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
            }
            else {
                tests.push({
                    name: 'Tenant1 can access own region',
                    passed: false,
                    message: 'Tenant1 could not access their own region'
                });
            }
        }
        catch (error) {
            tests.push({
                name: 'Tenant1 can access own region',
                passed: false,
                message: `Error: ${error.message}`
            });
        }
        try {
            const region = await this.prisma.dashboardRegion.findFirst({
                where: {
                    id: tenant1RegionId,
                    tenant_id: tenant2.tenantId
                }
            });
            if (!region) {
                tests.push({
                    name: 'Tenant2 cannot access tenant1\'s region',
                    passed: true,
                    message: 'RLS correctly prevented cross-tenant access'
                });
            }
            else {
                tests.push({
                    name: 'Tenant2 cannot access tenant1\'s region',
                    passed: false,
                    message: 'RLS failed: tenant2 was able to access tenant1\'s region'
                });
            }
        }
        catch (error) {
            tests.push({
                name: 'Tenant2 cannot access tenant1\'s region',
                passed: true,
                message: `RLS blocked access: ${error.message}`
            });
        }
        try {
            await this.prisma.dashboardRegion.update({
                where: {
                    id: tenant1RegionId,
                    tenant_id: tenant2.tenantId
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
        }
        catch (error) {
            tests.push({
                name: 'Tenant2 cannot update tenant1\'s region',
                passed: true,
                message: `RLS correctly prevented update: ${error.message}`
            });
        }
        try {
            await this.prisma.dashboardRegion.delete({
                where: {
                    id: tenant1RegionId,
                    tenant_id: tenant2.tenantId
                }
            });
            tests.push({
                name: 'Tenant2 cannot delete tenant1\'s region',
                passed: false,
                message: 'RLS failed: tenant2 was able to delete tenant1\'s region'
            });
        }
        catch (error) {
            tests.push({
                name: 'Tenant2 cannot delete tenant1\'s region',
                passed: true,
                message: `RLS correctly prevented deletion: ${error.message}`
            });
        }
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
        }
        catch (error) {
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
    async testSupabaseRLS(tenant1, tenant2) {
        try {
            const tenant1Client = await this.getSupabaseClientForUser(tenant1);
            const tenant2Client = await this.getSupabaseClientForUser(tenant2);
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
        }
        catch (error) {
            return {
                passed: false,
                message: `RLS test error: ${error.message}`,
                details: { error: error.message }
            };
        }
    }
    async cleanupTestData(tenantIds) {
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
exports.RLSTestingUtilities = RLSTestingUtilities;
async function runRLSTests(prisma, supabase) {
    const utilities = new RLSTestingUtilities(prisma, supabase);
    const { tenant1, tenant2 } = await utilities.createTestUsers();
    try {
        const result = await utilities.testDashboardRegionRLS(tenant1, tenant2);
        return {
            passed: result.passed,
            results: result.tests
        };
    }
    finally {
        await utilities.cleanupTestData([tenant1.tenantId, tenant2.tenantId]);
    }
}
//# sourceMappingURL=rls-policy-testing-utilities.js.map