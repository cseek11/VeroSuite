"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
describe('Tenant Isolation (e2e)', () => {
    let app;
    let tokenA;
    let tokenB;
    let jobIdA;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({ imports: [app_module_1.AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
        const resA = await request(app.getHttpServer()).post('/auth/login').send({ email: 'dispatcher@acepest.com', password: 'password123' });
        tokenA = resA.body.access_token;
        const resB = await request(app.getHttpServer()).post('/auth/login').send({ email: 'dispatcher@greenshield.com', password: 'password123' });
        tokenB = resB.body.access_token;
        const todayJobsA = await request(app.getHttpServer())
            .get('/v1/jobs/today')
            .set('Authorization', `Bearer ${tokenA}`)
            .set('x-tenant-id', '11111111-1111-1111-1111-111111111111')
            .expect(200);
        if (!Array.isArray(todayJobsA.body) || todayJobsA.body.length === 0) {
            throw new Error('No jobs seeded for Tenant A');
        }
        jobIdA = todayJobsA.body[0].id;
    });
    it('should allow Tenant A to access its own job', async () => {
        await request(app.getHttpServer())
            .get(`/v1/jobs/${jobIdA}`)
            .set('Authorization', `Bearer ${tokenA}`)
            .set('x-tenant-id', '11111111-1111-1111-1111-111111111111')
            .expect(200);
    });
    it('should not allow Tenant B to access Tenant A job (404)', async () => {
        await request(app.getHttpServer())
            .get(`/v1/jobs/${jobIdA}`)
            .set('Authorization', `Bearer ${tokenB}`)
            .set('x-tenant-id', '22222222-2222-2222-2222-222222222222')
            .expect(404);
    });
});
//# sourceMappingURL=tenant-isolation.e2e-spec.js.map