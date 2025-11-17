/**
 * Performance Regression Tests for Dashboard Regions
 * Tracks performance metrics and ensures they don't degrade
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/common/services/prisma.service';

describe('Dashboard Regions Performance Regression Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;
  let userId: string;
  let tenantId: string;
  let layoutId: string;

  // Performance thresholds (in milliseconds)
  const THRESHOLDS = {
    CREATE_REGION: 300,      // Region creation should be < 300ms
    UPDATE_REGION: 200,      // Region update should be < 200ms
    DELETE_REGION: 200,      // Region deletion should be < 200ms
    GET_REGION: 100,         // Get single region should be < 100ms
    LIST_REGIONS_10: 150,    // List 10 regions should be < 150ms
    LIST_REGIONS_50: 300,    // List 50 regions should be < 300ms
    LIST_REGIONS_100: 500,   // List 100 regions should be < 500ms
    LIST_REGIONS_200: 1000,  // List 200 regions should be < 1000ms
    OVERLAP_CHECK: 100,      // Overlap detection should be < 100ms
    VALIDATION: 50,          // Validation should be < 50ms
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();

    // Setup test user
    const testUser = await setupTestUser();
    userId = testUser.userId;
    tenantId = testUser.tenantId;
    authToken = await getAuthToken();
    layoutId = await createTestLayout(userId, tenantId);
  });

  afterAll(async () => {
    await cleanupTestData(layoutId, tenantId);
    await app.close();
  });

  describe('Region Creation Performance', () => {
    it('should create a region within threshold', async () => {
      const startTime = Date.now();

      const response = await request(app.getHttpServer())
        .post(`/api/v2/dashboard/layouts/${layoutId}/regions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          region_type: 'scheduling',
          grid_row: 0,
          grid_col: 0,
          row_span: 2,
          col_span: 2
        })
        .expect(201);

      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(THRESHOLDS.CREATE_REGION);
      expect(response.body.data).toBeDefined();
    });

    it('should create multiple regions efficiently', async () => {
      const startTime = Date.now();
      const regionCount = 10;

      for (let i = 0; i < regionCount; i++) {
        await request(app.getHttpServer())
          .post(`/api/v2/dashboard/layouts/${layoutId}/regions`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            region_type: 'scheduling',
            grid_row: Math.floor(i / 12),
            grid_col: i % 12,
            row_span: 1,
            col_span: 1
          })
          .expect(201);
      }

      const duration = Date.now() - startTime;
      const avgDuration = duration / regionCount;

      expect(avgDuration).toBeLessThan(THRESHOLDS.CREATE_REGION);
    });
  });

  describe('Region Update Performance', () => {
    let regionId: string;
    let version: number;

    beforeEach(async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`/api/v2/dashboard/layouts/${layoutId}/regions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          region_type: 'scheduling',
          grid_row: 0,
          grid_col: 0,
          row_span: 2,
          col_span: 2
        })
        .expect(201);

      regionId = createResponse.body.data.id;
      version = createResponse.body.data.version;
    });

    it('should update a region within threshold', async () => {
      const startTime = Date.now();

      await request(app.getHttpServer())
        .put(`/api/v2/dashboard/layouts/${layoutId}/regions/${regionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          grid_row: 1,
          grid_col: 1,
          version: version
        })
        .expect(200);

      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(THRESHOLDS.UPDATE_REGION);
    });
  });

  describe('Region Deletion Performance', () => {
    let regionId: string;

    beforeEach(async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`/api/v2/dashboard/layouts/${layoutId}/regions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          region_type: 'scheduling',
          grid_row: 0,
          grid_col: 0,
          row_span: 1,
          col_span: 1
        })
        .expect(201);

      regionId = createResponse.body.data.id;
    });

    it('should delete a region within threshold', async () => {
      const startTime = Date.now();

      await request(app.getHttpServer())
        .delete(`/api/v2/dashboard/layouts/${layoutId}/regions/${regionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(THRESHOLDS.DELETE_REGION);
    });
  });

  describe('Region Listing Performance', () => {
    beforeEach(async () => {
      // Create test regions
      for (let i = 0; i < 200; i++) {
        await request(app.getHttpServer())
          .post(`/api/v2/dashboard/layouts/${layoutId}/regions`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            region_type: 'scheduling',
            grid_row: Math.floor(i / 12),
            grid_col: i % 12,
            row_span: 1,
            col_span: 1
          })
          .expect(201);
      }
    });

    it('should list 10 regions within threshold', async () => {
      // Create a separate layout with 10 regions
      const smallLayoutId = await createTestLayout(userId, tenantId);
      for (let i = 0; i < 10; i++) {
        await request(app.getHttpServer())
          .post(`/api/v2/dashboard/layouts/${smallLayoutId}/regions`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            region_type: 'scheduling',
            grid_row: Math.floor(i / 12),
            grid_col: i % 12,
            row_span: 1,
            col_span: 1
          });
      }

      const startTime = Date.now();

      await request(app.getHttpServer())
        .get(`/api/v2/dashboard/layouts/${smallLayoutId}/regions`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(THRESHOLDS.LIST_REGIONS_10);
    });

    it('should list 50 regions within threshold', async () => {
      const startTime = Date.now();

      const response = await request(app.getHttpServer())
        .get(`/api/v2/dashboard/layouts/${layoutId}/regions`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const duration = Date.now() - startTime;
      const regionCount = response.body.data?.length || response.body.length;

      if (regionCount >= 50 && regionCount < 100) {
        expect(duration).toBeLessThan(THRESHOLDS.LIST_REGIONS_50);
      }
    });

    it('should list 100 regions within threshold', async () => {
      const startTime = Date.now();

      const response = await request(app.getHttpServer())
        .get(`/api/v2/dashboard/layouts/${layoutId}/regions`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const duration = Date.now() - startTime;
      const regionCount = response.body.data?.length || response.body.length;

      if (regionCount >= 100 && regionCount < 200) {
        expect(duration).toBeLessThan(THRESHOLDS.LIST_REGIONS_100);
      }
    });

    it('should list 200+ regions within threshold', async () => {
      const startTime = Date.now();

      const response = await request(app.getHttpServer())
        .get(`/api/v2/dashboard/layouts/${layoutId}/regions`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const duration = Date.now() - startTime;
      const regionCount = response.body.data?.length || response.body.length;

      if (regionCount >= 200) {
        expect(duration).toBeLessThan(THRESHOLDS.LIST_REGIONS_200);
      }
    });
  });

  describe('Overlap Detection Performance', () => {
    beforeEach(async () => {
      // Create regions for overlap testing
      for (let i = 0; i < 50; i++) {
        await request(app.getHttpServer())
          .post(`/api/v2/dashboard/layouts/${layoutId}/regions`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            region_type: 'scheduling',
            grid_row: Math.floor(i / 12),
            grid_col: i % 12,
            row_span: 1,
            col_span: 1
          });
      }
    });

    it('should check for overlaps efficiently', async () => {
      const startTime = Date.now();

      // Try to create a region that would overlap
      await request(app.getHttpServer())
        .post(`/api/v2/dashboard/layouts/${layoutId}/regions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          region_type: 'analytics',
          grid_row: 0, // Overlaps with existing
          grid_col: 0, // Overlaps with existing
          row_span: 1,
          col_span: 1
        })
        .expect(400); // Should fail due to overlap

      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(THRESHOLDS.OVERLAP_CHECK);
    });
  });

  describe('Validation Performance', () => {
    it('should validate region data efficiently', async () => {
      const startTime = Date.now();

      // Send invalid data that should be rejected quickly
      await request(app.getHttpServer())
        .post(`/api/v2/dashboard/layouts/${layoutId}/regions`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          region_type: 'invalid-type',
          grid_row: -1,
          grid_col: -1,
          row_span: 0,
          col_span: 0
        })
        .expect(400);

      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(THRESHOLDS.VALIDATION);
    });
  });

  // Helper functions
  async function setupTestUser() {
    return {
      userId: 'test-user-perf',
      tenantId: 'test-tenant-perf',
      email: 'test-perf@example.com'
    };
  }

  async function getAuthToken(): Promise<string> {
    return 'mock-auth-token';
  }

  async function createTestLayout(userId: string, tenantId: string): Promise<string> {
    const layout = await prisma.dashboardLayout.create({
      data: {
        tenant_id: tenantId,
        user_id: userId,
        name: 'Performance Test Layout',
        is_default: false
      }
    });
    return layout.id;
  }

  async function cleanupTestData(layoutId: string, tenantId: string) {
    await prisma.dashboardRegion.deleteMany({
      where: {
        layout_id: layoutId,
        tenant_id: tenantId
      }
    });

    await prisma.dashboardLayout.deleteMany({
      where: {
        id: layoutId,
        tenant_id: tenantId
      }
    });
  }
});

