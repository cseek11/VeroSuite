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
export declare class TestDatabase {
    private static instance;
    static getInstance(): TestDatabase;
    setup(): Promise<void>;
    cleanup(): Promise<void>;
    seedTestData(): Promise<{
        testTenant: {
            id: string;
            name: string;
            domain: string;
            settings: {
                features: string[];
                security: {
                    mfa_required: boolean;
                    session_timeout: number;
                    password_policy: string;
                };
            };
        };
        testUser: {
            id: string;
            email: string;
            tenant_id: string;
            role: string;
            permissions: string[];
            profile: {
                first_name: string;
                last_name: string;
                phone: string;
            };
        };
    }>;
    clearTestData(): Promise<void>;
}
export declare class SecurityTestUtils {
    static generateMaliciousPayloads(): {
        sqlInjection: string[];
        xssPayloads: string[];
        csrfPayloads: string[];
    };
    static generateInvalidTokens(): {
        expired: string;
        malformed: string;
        tampered: string;
    };
}
export declare class PerformanceTestUtils {
    static measureExecutionTime<T>(fn: () => Promise<T>): Promise<{
        result: T;
        duration: number;
    }>;
    static generateLoadTestData(size: number): {
        id: string;
        name: string;
        email: string;
        created_at: string;
    }[];
}
export declare class MockFactory {
    static createUser(overrides?: any): any;
    static createCustomer(overrides?: any): any;
    static createWorkOrder(overrides?: any): any;
}
