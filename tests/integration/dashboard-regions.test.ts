import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../backend/src/app.module';

describe('Dashboard Regions API (Integration)', () => {
  let app: INestApplication;
  let authToken: string;
  let layoutId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Authenticate and get token (mock or real auth)
    // authToken = await authenticate();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/dashboard/layouts/:layoutId/regions', () => {
    it('should create a region', async () => {
      const regionData = {
        region_type: 'scheduling',
        grid_row: 0,
        grid_col: 0,
        row_span: 2,
        col_span: 3
      };

      const response = await request(app.getHttpServer())
        .post(`/api/dashboard/layouts/${layoutId}/regions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(regionData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.region_type).toBe(regionData.region_type);
    });

    it('should reject invalid region data', async () => {
      const invalidData = {
        region_type: 'invalid-type',
        grid_row: -1,
        grid_col: 0,
        row_span: 1,
        col_span: 1
      };

      await request(app.getHttpServer())
        .post(`/api/dashboard/layouts/${layoutId}/regions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);
    });

    it('should reject overlapping regions', async () => {
      const region1 = {
        region_type: 'scheduling',
        grid_row: 0,
        grid_col: 0,
        row_span: 2,
        col_span: 2
      };

      const region2 = {
        region_type: 'analytics',
        grid_row: 1,
        grid_col: 1,
        row_span: 2,
        col_span: 2
      };

      await request(app.getHttpServer())
        .post(`/api/dashboard/layouts/${layoutId}/regions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(region1)
        .expect(201);

      await request(app.getHttpServer())
        .post(`/api/dashboard/layouts/${layoutId}/regions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(region2)
        .expect(400);
    });
  });

  describe('PUT /api/dashboard/layouts/:layoutId/regions/:regionId', () => {
    it('should update a region', async () => {
      // Create region first
      const createResponse = await request(app.getHttpServer())
        .post(`/api/dashboard/layouts/${layoutId}/regions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          region_type: 'scheduling',
          grid_row: 0,
          grid_col: 0,
          row_span: 1,
          col_span: 1
        });

      const regionId = createResponse.body.id;

      // Update region
      const updateResponse = await request(app.getHttpServer())
        .put(`/api/dashboard/layouts/${layoutId}/regions/${regionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          grid_row: 1,
          grid_col: 1
        })
        .expect(200);

      expect(updateResponse.body.grid_row).toBe(1);
      expect(updateResponse.body.grid_col).toBe(1);
    });

    it('should handle version conflicts', async () => {
      // Create and update region to get version
      const createResponse = await request(app.getHttpServer())
        .post(`/api/dashboard/layouts/${layoutId}/regions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          region_type: 'scheduling',
          grid_row: 0,
          grid_col: 0,
          row_span: 1,
          col_span: 1
        });

      const regionId = createResponse.body.id;
      const version = createResponse.body.version;

      // Simulate concurrent update (different version)
      await request(app.getHttpServer())
        .put(`/api/dashboard/layouts/${layoutId}/regions/${regionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          grid_row: 2,
          grid_col: 2,
          version: version + 1 // Wrong version
        })
        .expect(409); // Conflict
    });
  });

  describe('GET /api/dashboard/layouts/:layoutId/regions', () => {
    it('should return regions for a layout', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/dashboard/layouts/${layoutId}/regions`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should respect tenant isolation', async () => {
      // Create region in tenant A
      // Try to access from tenant B
      // Should return 403 or empty array
    });
  });
});




