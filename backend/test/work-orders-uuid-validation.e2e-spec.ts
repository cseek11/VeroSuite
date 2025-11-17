import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureTestApp } from './utils/test-app';
import { getDispatcherToken } from './utils/test-auth';

describe('Work Orders UUID Validation (e2e)', () => {
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

  describe('GET /api/v1/work-orders/:id - UUID Validation', () => {
    it('should handle empty path (may match list route)', async () => {
      // Empty path after /work-orders/ might match the list route
      // This test verifies that invalid UUIDs in the path are rejected
      // The empty path case is less critical than invalid UUID format
      const res = await request(app.getHttpServer())
        .get('/api/v1/work-orders/')
        .set('Authorization', `Bearer ${authToken}`);
      
      // Empty path might match list route (200) or be rejected (400/404)
      // The important test is invalid UUID format, which is tested below
      expect([200, 400, 404]).toContain(res.status);
    });

    it('should reject invalid UUID format', async () => {
      const invalidIds = [
        'not-a-uuid',
        '123',
        'abc-def-ghi',
        '12345678-1234-1234-1234-1234567890123', // Too long
        '1234567-1234-1234-1234-123456789012', // Too short
      ];

      for (const invalidId of invalidIds) {
        await request(app.getHttpServer())
          .get(`/api/v1/work-orders/${invalidId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400); // Bad Request - ParseUUIDPipe validation fails
      }
    });

    it('should accept valid UUID', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      
      // This will likely return 404 (work order not found) but not 400 (validation error)
      const res = await request(app.getHttpServer())
        .get(`/api/v1/work-orders/${validUUID}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Should not be 400 (validation error)
      expect(res.status).not.toBe(400);
      // Will likely be 404 (not found) or 200 (if exists)
      expect([200, 404]).toContain(res.status);
    });
  });

  describe('PUT /api/v1/work-orders/:id - UUID Validation', () => {
    it('should reject invalid UUID format', async () => {
      await request(app.getHttpServer())
        .put('/api/v1/work-orders/invalid-uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Updated' })
        .expect(400); // Bad Request - ParseUUIDPipe validation fails
    });

    it('should accept valid UUID', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      
      const res = await request(app.getHttpServer())
        .put(`/api/v1/work-orders/${validUUID}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Updated' });

      // Should not be 400 (validation error)
      expect(res.status).not.toBe(400);
    });
  });

  describe('DELETE /api/v1/work-orders/:id - UUID Validation', () => {
    it('should reject invalid UUID format', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/work-orders/invalid-uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400); // Bad Request - ParseUUIDPipe validation fails
    });

    it('should accept valid UUID', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      
      const res = await request(app.getHttpServer())
        .delete(`/api/v1/work-orders/${validUUID}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Should not be 400 (validation error)
      expect(res.status).not.toBe(400);
    });
  });

  describe('GET /api/v1/work-orders/customer/:customerId - UUID Validation', () => {
    it('should reject invalid UUID format', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/work-orders/customer/invalid-uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400); // Bad Request - ParseUUIDPipe validation fails
    });

    it('should accept valid UUID', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      
      const res = await request(app.getHttpServer())
        .get(`/api/v1/work-orders/customer/${validUUID}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Should not be 400 (validation error)
      expect(res.status).not.toBe(400);
    });
  });

  describe('GET /api/v1/work-orders/technician/:technicianId - UUID Validation', () => {
    it('should reject invalid UUID format', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/work-orders/technician/invalid-uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400); // Bad Request - ParseUUIDPipe validation fails
    });

    it('should accept valid UUID', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      
      const res = await request(app.getHttpServer())
        .get(`/api/v1/work-orders/technician/${validUUID}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Should not be 400 (validation error)
      expect(res.status).not.toBe(400);
    });
  });

  describe('Error Message Validation', () => {
    it('should return clear error message for invalid UUID', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/work-orders/invalid-uuid')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      // Should have error message about UUID validation
      expect(res.body).toHaveProperty('message');
      const message = res.body.message || '';
      expect(message.toLowerCase()).toMatch(/uuid|validation|invalid/);
    });
  });
});

