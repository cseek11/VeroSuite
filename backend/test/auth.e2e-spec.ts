import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getTestPrismaClient } from './utils/test-database';
import { expectV2Response } from './utils/validate-v2';
import { configureTestApp } from './utils/test-app';
import { TEST_USERS, TEST_PASSWORD } from './global-setup';

describe('Authentication (e2e)', () => {
  let app: INestApplication;
  const prisma = getTestPrismaClient();

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    configureTestApp(app);
    await app.init();
  });

  afterAll(async () => {
    // Close app
    if (app) {
      await app.close();
    }
    // Prisma disconnect handled by global teardown
  });

  describe('V1 API (Deprecated)', () => {
    it('should authenticate user and return JWT', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: TEST_USERS.DISPATCHER, password: TEST_PASSWORD })
        .expect(201);
      expect(res.body).toHaveProperty('access_token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('tenant_id');
    });

    it('should reject malformed URLs with duplicate version segments', async () => {
      // This test catches frontend bugs like /api/v1/v1/auth/login
      await request(app.getHttpServer())
        .post('/api/v1/v1/auth/login')
        .send({ email: TEST_USERS.DISPATCHER, password: TEST_PASSWORD })
        .expect(404); // Should return 404 for malformed URL
    });

    it('should reject URLs with incorrect version format', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/v2/auth/login')
        .send({ email: TEST_USERS.DISPATCHER, password: TEST_PASSWORD })
        .expect(404);
    });

    it('should reject URLs missing version segment', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: TEST_USERS.DISPATCHER, password: TEST_PASSWORD })
        .expect(404);
    });
  });

  describe('V2 API', () => {
    it('should authenticate user and return JWT with v2 format', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v2/auth/login')
        .send({ email: TEST_USERS.DISPATCHER, password: TEST_PASSWORD })
        .expect(201);
      
      // Use V2 response validator (login returns 201)
      const data = expectV2Response(res, 201);
      expect(data).toHaveProperty('access_token');
      expect(data).toHaveProperty('user');
      expect(data.user).toHaveProperty('tenant_id');
    });

    it('should get current user with v2 format', async () => {
      // First login to get token
      const loginRes = await request(app.getHttpServer())
        .post('/api/v2/auth/login')
        .send({ email: TEST_USERS.DISPATCHER, password: TEST_PASSWORD })
        .expect(201);
      
      const token = loginRes.body.data.access_token;
      
      // Then get current user
      const res = await request(app.getHttpServer())
        .get('/api/v2/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      // Use V2 response validator
      expectV2Response(res);
    });
  });
});
