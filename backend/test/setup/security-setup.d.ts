import { INestApplication } from '@nestjs/common';
export declare class SecurityTestSuite {
    private app;
    private maliciousPayloads;
    private securityHeaders;
    constructor(app: INestApplication);
    runOWASPTests(): Promise<{
        injection: {
            sqlInjection: ({
                payload: string;
                status: number;
                blocked: boolean;
                responseTime: string | undefined;
                error?: never;
            } | {
                payload: string;
                error: any;
                blocked: boolean;
                status?: never;
                responseTime?: never;
            })[];
            nosqlInjection: ({
                payload: string;
                status: number;
                blocked: boolean;
                error?: never;
            } | {
                payload: string;
                error: any;
                blocked: boolean;
                status?: never;
            })[];
            commandInjection: ({
                payload: string;
                status: number;
                blocked: boolean;
                error?: never;
            } | {
                payload: string;
                error: any;
                blocked: boolean;
                status?: never;
            })[];
            ldapInjection: ({
                payload: string;
                status: number;
                blocked: boolean;
                error?: never;
            } | {
                payload: string;
                error: any;
                blocked: boolean;
                status?: never;
            })[];
        };
        brokenAuth: {
            credentialStuffing: ({
                password: string;
                status: number;
                blocked: boolean;
                error?: never;
            } | {
                password: string;
                error: any;
                blocked: boolean;
                status?: never;
            })[];
            sessionFixation: {
                sessionFixation: string;
                status: number;
                tokenReuseBlocked: boolean;
                error?: never;
            } | {
                sessionFixation: string;
                error: any;
                status?: never;
                tokenReuseBlocked?: never;
            };
            weakPasswords: ({
                password: string;
                status: number;
                rejected: boolean;
                error?: never;
            } | {
                password: string;
                error: any;
                rejected: boolean;
                status?: never;
            })[];
            sessionTimeout: {
                sessionTimeout: string;
                status: number;
                expired: boolean;
                error?: never;
            } | {
                sessionTimeout: string;
                error: any;
                status?: never;
                expired?: never;
            };
        };
        sensitiveData: {
            passwordExposure: {
                passwordExposure: string;
                responseContainsPassword: boolean;
                error?: never;
            } | {
                passwordExposure: string;
                error: any;
                responseContainsPassword?: never;
            };
            creditCardExposure: {
                creditCardExposure: string;
                responseContainsCardData: boolean;
                error?: never;
            } | {
                creditCardExposure: string;
                error: any;
                responseContainsCardData?: never;
            };
            ssnExposure: any;
            apiKeyExposure: any;
        };
        xxe: {
            xxe: string;
            status: number;
            error?: never;
        } | {
            xxe: string;
            error: any;
            status?: never;
        };
        brokenAccess: {
            accessControl: string;
            status: number;
            unauthorizedAccessBlocked: boolean;
            error?: never;
        } | {
            accessControl: string;
            error: any;
            status?: never;
            unauthorizedAccessBlocked?: never;
        };
        securityMisconfig: {
            securityHeaders: {
                securityHeaders: string;
                missingHeaders: string[];
                headers: {
                    'x-content-type-options': string | undefined;
                    'x-frame-options': string | undefined;
                    'x-xss-protection': string | undefined;
                    'strict-transport-security': string | undefined;
                    'content-security-policy': string | undefined;
                    'referrer-policy': string | undefined;
                };
                error?: never;
            } | {
                securityHeaders: string;
                error: any;
                missingHeaders?: never;
                headers?: never;
            };
            errorHandling: {
                errorHandling: string;
                sensitiveInfoExposed: boolean;
                error?: never;
            } | {
                errorHandling: string;
                error: any;
                sensitiveInfoExposed?: never;
            };
            debugMode: any;
            defaultCredentials: any;
        };
        xss: ({
            payload: string;
            status: number;
            blocked: boolean;
            error?: never;
        } | {
            payload: string;
            error: any;
            blocked: boolean;
            status?: never;
        })[];
        insecureDeserialization: {
            deserialization: string;
            status: number;
            error?: never;
        } | {
            deserialization: string;
            error: any;
            status?: never;
        };
        knownVulnerabilities: {
            pathTraversal: ({
                payload: string;
                status: number;
                blocked: boolean;
                error?: never;
            } | {
                payload: string;
                error: any;
                blocked: boolean;
                status?: never;
            })[];
            csrf: {
                csrf: string;
                status: number;
                error?: never;
            } | {
                csrf: string;
                error: any;
                status?: never;
            };
            clickjacking: {
                clickjacking: string;
                frameOptions: string | undefined;
                error?: never;
            } | {
                clickjacking: string;
                error: any;
                frameOptions?: never;
            };
        };
        logging: {
            logging: string;
            status: number;
            error?: never;
        } | {
            logging: string;
            error: any;
            status?: never;
        };
    }>;
    private testInjectionAttacks;
    private testSQLInjection;
    private testNoSQLInjection;
    private testCommandInjection;
    private testLDAPInjection;
    private testBrokenAuthentication;
    private testCredentialStuffing;
    private testSessionFixation;
    private testWeakPasswords;
    private testSessionTimeout;
    private testSensitiveDataExposure;
    private testPasswordExposure;
    private testCreditCardExposure;
    private testXSSAttacks;
    private testSecurityMisconfiguration;
    private testSecurityHeaders;
    private testErrorHandling;
    private testXXEAttacks;
    private testBrokenAccessControl;
    private testInsecureDeserialization;
    private testKnownVulnerabilities;
    private testPathTraversal;
    private testCSRF;
    private testClickjacking;
    private testInsufficientLogging;
    private generateMaliciousPayloads;
}
export { SecurityTestSuite };
