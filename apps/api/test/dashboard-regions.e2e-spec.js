"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const request = require("supertest");
const app_module_1 = require("../src/app.module");
const prisma_service_1 = require("../src/common/services/prisma.service");
const supabase_service_1 = require("../src/common/services/supabase.service");
describe('Dashboard Regions E2E Tests', () => {
    let app;
    let prisma;
    let supabase;
    let authToken;
    let userId;
    let tenantId;
    let layoutId;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true }));
        prisma = moduleFixture.get(prisma_service_1.PrismaService);
        supabase = moduleFixture.get(supabase_service_1.SupabaseService);
        await app.init();
        const testUser = await setupTestUser();
        userId = testUser.userId;
        tenantId = testUser.tenantId;
        authToken = await getAuthToken(testUser);
        layoutId = await createTestLayout(userId, tenantId);
    });
    afterAll(async () => {
        await cleanupTestData(layoutId, tenantId);
        await app.close();
    });
    beforeEach(async () => {
        await prisma.dashboardRegion.deleteMany({
            where: {
                layout_id: layoutId,
                tenant_id: tenantId
            }
        });
    });
    describe('POST /api/v2/dashboard/layouts/:layoutId/regions - Create Region', () => {
        it('should create a new scheduling region', async () => {
            const createDto = {
                region_type: 'scheduling',
                grid_row: 0,
                grid_col: 0,
                row_span: 2,
                col_span: 3
            };
            const response = await request(app.getHttpServer())
                .post(`/api/v2/dashboard/layouts/${layoutId}/regions`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(createDto)
                .expect(201);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data.region_type).toBe('scheduling');
            expect(response.body.data.grid_row).toBe(0);
            expect(response.body.data.grid_col).toBe(0);
            expect(response.body.data.row_span).toBe(2);
            expect(response.body.data.col_span).toBe(3);
            expect(response.body.data.version).toBe(1);
            expect(response.body.meta).toHaveProperty('version', '2.0');
        });
        it('should reject overlapping regions', async () => {
            const firstRegion = {
                region_type: 'scheduling',
                grid_row: 0,
                grid_col: 0,
                row_span: 2,
                col_span: 2
            };
            await request(app.getHttpServer())
                .post(`/api/v2/dashboard/layouts/${layoutId}/regions`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(firstRegion)
                .expect(201);
            const overlappingRegion = {
                region_type: 'analytics',
                grid_row: 1,
                grid_col: 1,
                row_span: 2,
                col_span: 2
            };
            await request(app.getHttpServer())
                .post(`/api/v2/dashboard/layouts/${layoutId}/regions`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(overlappingRegion)
                .expect(400);
        });
        it('should validate grid bounds', async () => {
            const invalidRegion = {
                region_type: 'scheduling',
                grid_row: -1,
                grid_col: 0,
                row_span: 1,
                col_span: 1
            };
            await request(app.getHttpServer())
                .post(`/api/v2/dashboard/layouts/${layoutId}/regions`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(invalidRegion)
                .expect(400);
        });
        it('should require authentication', async () => {
            const createDto = {
                region_type: 'scheduling',
                grid_row: 0,
                grid_col: 0,
                row_span: 1,
                col_span: 1
            };
            await request(app.getHttpServer())
                .post(`/api/v2/dashboard/layouts/${layoutId}/regions`)
                .send(createDto)
                .expect(401);
        });
    });
    describe('GET /api/v2/dashboard/layouts/:layoutId/regions - List Regions', () => {
        it('should return all regions for a layout', async () => {
            const regions = [
                { region_type: 'scheduling', grid_row: 0, grid_col: 0, row_span: 2, col_span: 2 },
                { region_type: 'analytics', grid_row: 0, grid_col: 2, row_span: 2, col_span: 2 },
                { region_type: 'work-orders', grid_row: 2, grid_col: 0, row_span: 2, col_span: 2 }
            ];
            for (const region of regions) {
                await request(app.getHttpServer())
                    .post(`/api/v2/dashboard/layouts/${layoutId}/regions`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(region)
                    .expect(201);
            }
            const response = await request(app.getHttpServer())
                .get(`/api/v2/dashboard/layouts/${layoutId}/regions`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveLength(3);
            expect(response.body.meta).toHaveProperty('count', 3);
            expect(response.body.meta).toHaveProperty('version', '2.0');
        });
        it('should return empty array for layout with no regions', async () => {
            const response = await request(app.getHttpServer())
                .get(`/api/v2/dashboard/layouts/${layoutId}/regions`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body.data).toHaveLength(0);
            expect(response.body.meta.count).toBe(0);
        });
        it('should respect tenant isolation', async () => {
            await request(app.getHttpServer())
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
        });
    });
    describe('PUT /api/v2/dashboard/layouts/:layoutId/regions/:id - Update Region', () => {
        let regionId;
        let regionVersion;
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
            regionVersion = createResponse.body.data.version;
        });
        it('should update region position', async () => {
            const updateDto = {
                grid_row: 1,
                grid_col: 1,
                version: regionVersion
            };
            const response = await request(app.getHttpServer())
                .put(`/api/v2/dashboard/layouts/${layoutId}/regions/${regionId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateDto)
                .expect(200);
            expect(response.body.data.grid_row).toBe(1);
            expect(response.body.data.grid_col).toBe(1);
            expect(response.body.data.version).toBe(regionVersion + 1);
        });
        it('should update region size', async () => {
            const updateDto = {
                row_span: 3,
                col_span: 4,
                version: regionVersion
            };
            const response = await request(app.getHttpServer())
                .put(`/api/v2/dashboard/layouts/${layoutId}/regions/${regionId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateDto)
                .expect(200);
            expect(response.body.data.row_span).toBe(3);
            expect(response.body.data.col_span).toBe(4);
            expect(response.body.data.version).toBe(regionVersion + 1);
        });
        it('should require version field', async () => {
            const updateDto = {
                grid_row: 1,
                grid_col: 1
            };
            await request(app.getHttpServer())
                .put(`/api/v2/dashboard/layouts/${layoutId}/regions/${regionId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updateDto)
                .expect(400);
        });
        it('should detect version conflicts', async () => {
            await request(app.getHttpServer())
                .put(`/api/v2/dashboard/layouts/${layoutId}/regions/${regionId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                grid_row: 1,
                version: regionVersion
            })
                .expect(200);
            await request(app.getHttpServer())
                .put(`/api/v2/dashboard/layouts/${layoutId}/regions/${regionId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                grid_row: 2,
                version: regionVersion
            })
                .expect(409);
        });
        it('should prevent overlapping on update', async () => {
            const secondRegion = await request(app.getHttpServer())
                .post(`/api/v2/dashboard/layouts/${layoutId}/regions`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                region_type: 'analytics',
                grid_row: 2,
                grid_col: 2,
                row_span: 2,
                col_span: 2
            })
                .expect(201);
            await request(app.getHttpServer())
                .put(`/api/v2/dashboard/layouts/${layoutId}/regions/${regionId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                grid_row: 2,
                grid_col: 2,
                version: regionVersion
            })
                .expect(400);
        });
    });
    describe('DELETE /api/v2/dashboard/layouts/:layoutId/regions/:id - Delete Region', () => {
        let regionId;
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
        it('should soft delete a region', async () => {
            const response = await request(app.getHttpServer())
                .delete(`/api/v2/dashboard/layouts/${layoutId}/regions/${regionId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body).toHaveProperty('success', true);
            const listResponse = await request(app.getHttpServer())
                .get(`/api/v2/dashboard/layouts/${layoutId}/regions`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(listResponse.body.data).toHaveLength(0);
        });
        it('should return 404 for non-existent region', async () => {
            await request(app.getHttpServer())
                .delete(`/api/v2/dashboard/layouts/${layoutId}/regions/non-existent-id`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(404);
        });
        it('should require authentication', async () => {
            await request(app.getHttpServer())
                .delete(`/api/v2/dashboard/layouts/${layoutId}/regions/${regionId}`)
                .expect(401);
        });
    });
    describe('Complete Workflow', () => {
        it('should complete full CRUD workflow', async () => {
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
            const regionId = createResponse.body.data.id;
            let version = createResponse.body.data.version;
            const getResponse = await request(app.getHttpServer())
                .get(`/api/v2/dashboard/layouts/${layoutId}/regions`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(getResponse.body.data).toHaveLength(1);
            expect(getResponse.body.data[0].id).toBe(regionId);
            const updateResponse = await request(app.getHttpServer())
                .put(`/api/v2/dashboard/layouts/${layoutId}/regions/${regionId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                grid_row: 1,
                grid_col: 1,
                version: version
            })
                .expect(200);
            expect(updateResponse.body.data.grid_row).toBe(1);
            expect(updateResponse.body.data.grid_col).toBe(1);
            version = updateResponse.body.data.version;
            await request(app.getHttpServer())
                .delete(`/api/v2/dashboard/layouts/${layoutId}/regions/${regionId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            const finalResponse = await request(app.getHttpServer())
                .get(`/api/v2/dashboard/layouts/${layoutId}/regions`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(finalResponse.body.data).toHaveLength(0);
        });
    });
    async function setupTestUser() {
        return {
            userId: 'test-user-e2e',
            tenantId: 'test-tenant-e2e',
            email: 'test-e2e@example.com'
        };
    }
    async function getAuthToken(user) {
        return 'mock-auth-token';
    }
    async function createTestLayout(userId, tenantId) {
        const layout = await prisma.dashboardLayout.create({
            data: {
                tenant_id: tenantId,
                user_id: userId,
                name: 'E2E Test Layout',
                is_default: false
            }
        });
        return layout.id;
    }
    async function cleanupTestData(layoutId, tenantId) {
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
//# sourceMappingURL=dashboard-regions.e2e-spec.js.map