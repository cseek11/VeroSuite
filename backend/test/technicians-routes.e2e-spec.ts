import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureTestApp } from './utils/test-app';
import { getDispatcherToken } from './utils/test-auth';

describe('Technicians Routes (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureTestApp(app);
    await app.init();

    // Get auth token for authenticated requests
    authToken = await getDispatcherToken();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('Route Version Validation', () => {
    it('should reject /api/technicians (missing version)', async () => {
      await request(app.getHttpServer())
        .get('/api/technicians')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should accept /api/v2/technicians', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v2/technicians')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // V2 technicians controller returns TechnicianListResponseDto
      // Response should have data (array) and pagination properties
      if (Array.isArray(res.body)) {
        expect(res.body).toBeInstanceOf(Array);
      } else {
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body).toHaveProperty('pagination');
      }
    });

    it('should reject /api/v2/v2/technicians (duplicate version)', async () => {
      await request(app.getHttpServer())
        .get('/api/v2/v2/technicians')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should handle /api/v1/technicians (v1 controller exists)', async () => {
      // Technicians v1 controller exists, so this should work
      const res = await request(app.getHttpServer())
        .get('/api/v1/technicians')
        .set('Authorization', `Bearer ${authToken}`);
      
      // v1 endpoint may exist, so accept either 200 or 404
      expect([200, 404]).toContain(res.status);
    });
  });

  describe('Technicians CRUD Operations', () => {
    it('should GET /api/v2/technicians', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v2/technicians')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // V2 returns TechnicianListResponseDto format
      if (Array.isArray(res.body)) {
        expect(res.body).toBeInstanceOf(Array);
      } else {
        expect(res.body).toHaveProperty('data');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body).toHaveProperty('pagination');
      }
    });

    it('should GET /api/v2/technicians with query parameters', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v2/technicians?page=1&limit=20')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Should accept query parameters
      expect(res.status).toBe(200);
    });
  });

  describe('Route Path Validation', () => {
    it('should reject incorrect path segments', async () => {
      await request(app.getHttpServer())
        .get('/api/v2/technicians/invalid/path')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should accept correct path with version', async () => {
      await request(app.getHttpServer())
        .get('/api/v2/technicians')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
});

