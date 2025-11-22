"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
describe('Authentication (e2e)', () => {
    let app;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({ imports: [app_module_1.AppModule] }).compile();
        app = moduleFixture.createNestApplication();
        await app.init();
    });
    it('should authenticate user and return JWT', async () => {
        const res = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'dispatcher@acepest.com', password: 'password123' })
            .expect(201);
        expect(res.body).toHaveProperty('access_token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('tenant_id');
    });
});
//# sourceMappingURL=auth.e2e-spec.js.map