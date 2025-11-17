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
export declare class RLSTestingUtilities {
    private prisma;
    private supabase;
    constructor(prisma: PrismaService, supabase: SupabaseService);
    createTestUsers(): Promise<{
        tenant1: TestUser;
        tenant2: TestUser;
    }>;
    getSupabaseClientForUser(user: TestUser): Promise<any>;
    testTenantIsolation(tenant1: TestUser, tenant2: TestUser, createDataFn: (user: TestUser) => Promise<any>, queryDataFn: (user: TestUser, dataId: string) => Promise<any>): Promise<{
        passed: boolean;
        message: string;
        details?: any;
    }>;
    testUserCanAccessOwnTenantData(user: TestUser, createDataFn: (user: TestUser) => Promise<any>, queryDataFn: (user: TestUser, dataId: string) => Promise<any>): Promise<{
        passed: boolean;
        message: string;
        details?: any;
    }>;
    testDashboardRegionRLS(tenant1: TestUser, tenant2: TestUser): Promise<{
        passed: boolean;
        message: string;
        tests: Array<{
            name: string;
            passed: boolean;
            message: string;
        }>;
    }>;
    testSupabaseRLS(tenant1: TestUser, tenant2: TestUser): Promise<{
        passed: boolean;
        message: string;
        details?: any;
    }>;
    cleanupTestData(tenantIds: string[]): Promise<void>;
}
export declare function runRLSTests(prisma: PrismaService, supabase: SupabaseService): Promise<{
    passed: boolean;
    results: Array<{
        name: string;
        passed: boolean;
        message: string;
    }>;
}>;
