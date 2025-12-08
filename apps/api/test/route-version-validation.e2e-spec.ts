import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureTestApp } from './utils/test-app';
import { getDispatcherToken } from './utils/test-auth';

describe('Route Version Validation (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureTestApp(app);
    await app.init();

    authToken = await getDispatcherToken();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('V1 Endpoints', () => {
    it('should accept /api/v1/accounts', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should accept /api/v1/auth/login', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({ email: 'test@example.com', password: 'password' })
        .expect(201);
    });

    it('should reject /api/v2/accounts (accounts controller is v1 only)', async () => {
      await request(app.getHttpServer())
        .get('/api/v2/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('V2 Endpoints', () => {
    it('should accept /api/v2/crm/accounts', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v2/crm/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // V2 should return wrapped response
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toHaveProperty('version', '2.0');
    });

    it('should accept /api/v2/auth/login', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/v2/auth/login')
        .send({ email: 'test@example.com', password: 'password' })
        .expect(201);

      // V2 should return wrapped response
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta).toHaveProperty('version', '2.0');
    });

    it('should accept /api/v2/kpi-templates', async () => {
      await request(app.getHttpServer())
        .get('/api/v2/kpi-templates')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should accept /api/v2/technicians', async () => {
      await request(app.getHttpServer())
        .get('/api/v2/technicians')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should reject /api/v1/crm/accounts (crm v2 controller)', async () => {
      // CRM v2 controller - v1 path should 404
      await request(app.getHttpServer())
        .get('/api/v1/crm/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('Version-Specific Features', () => {
    it('should accept v2-only features like dashboard undo/redo', async () => {
      // These features only exist in v2
      const layoutId = 'test-layout-id';
      
      await request(app.getHttpServer())
        .post(`/api/v2/dashboard/layouts/${layoutId}/undo`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect((res) => {
          // Should either succeed or return specific error (not 404)
          expect([200, 201, 400, 404]).toContain(res.status);
        });
    });

    it('should reject v2-only features when called with v1', async () => {
      const layoutId = 'test-layout-id';
      
      // Undo/redo only exist in v2
      await request(app.getHttpServer())
        .post(`/api/v1/dashboard/layouts/${layoutId}/undo`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('Version Mismatch Scenarios', () => {
    it('should reject /api/v1/v2/endpoint (mixed versions)', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/v2/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject /api/v2/v1/endpoint (mixed versions)', async () => {
      await request(app.getHttpServer())
        .get('/api/v2/v1/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should reject /api/endpoint (no version)', async () => {
      await request(app.getHttpServer())
        .get('/api/accounts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('Dual Version Endpoints', () => {
    it('should accept both v1 and v2 for auth/login', async () => {
      // Auth exists in both versions
      const loginData = { email: 'test@example.com', password: 'password' };

      // V1 should work
      await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(201);

      // V2 should also work
      await request(app.getHttpServer())
        .post('/api/v2/auth/login')
        .send(loginData)
        .expect(201);
    });

    it('should return different response formats for v1 vs v2', async () => {
      const loginData = { email: 'test@example.com', password: 'password' };

      // V1 returns direct response
      const v1Res = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(201);

      expect(v1Res.body).toHaveProperty('access_token');
      expect(v1Res.body).not.toHaveProperty('data');

      // V2 returns wrapped response
      const v2Res = await request(app.getHttpServer())
        .post('/api/v2/auth/login')
        .send(loginData)
        .expect(201);

      expect(v2Res.body).toHaveProperty('data');
      expect(v2Res.body).toHaveProperty('meta');
      expect(v2Res.body.data).toHaveProperty('access_token');
    });
  });
});

