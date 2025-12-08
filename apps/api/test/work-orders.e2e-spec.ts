import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { getTestPrismaClient } from './utils/test-database';
import { getAdminToken } from './utils/test-auth';
import { expectV2Response } from './utils/validate-v2';
import { configureTestApp } from './utils/test-app';
import { TEST_TENANTS } from './global-setup';

describe('WorkOrders (e2e)', () => {
  let app: INestApplication;
  const prisma = getTestPrismaClient();
  let authToken: string;
  let customerId: string;
  let technicianId: string;
  let workOrderId: string;
  let createdWorkOrderIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureTestApp(app);
    await app.init();

    // Get auth token using seeded test user
    authToken = await getAdminToken();

    // Create test customer (using seeded tenant)
    const customer = await prisma.account.create({
      data: {
        tenant_id: TEST_TENANTS.TENANT1,
        name: 'Test Customer',
        account_type: 'commercial',
        status: 'active',
      },
    });
    customerId = customer.id;

    // Get technician ID from seeded user
    const technician = await prisma.user.findUnique({
      where: { email: 'test-user-technician@test.example.com' }
    });
    if (!technician) {
      throw new Error('Technician user not found in test setup');
    }
    technicianId = technician.id;
    // Verify it's a valid UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(technicianId)) {
      throw new Error(`Invalid technicianId format: ${technicianId}`);
    }
  });

  beforeEach(() => {
    createdWorkOrderIds = [];
  });

  afterEach(async () => {
    // Clean up work orders created during test
    if (createdWorkOrderIds.length > 0) {
      await prisma.workOrder.deleteMany({
        where: { id: { in: createdWorkOrderIds } }
      });
    }
  });

  afterAll(async () => {
    // Clean up test customer
    if (customerId) {
      await prisma.account.deleteMany({
        where: { id: customerId }
      });
    }
    
    // Close app
    if (app) {
      await app.close();
    }
    // Prisma disconnect handled by global teardown
  });

  describe('/api/v1/work-orders (POST)', () => {
    it('should create a work order', async () => {
      // Use a future date (1 week from now)
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const scheduledDate = futureDate.toISOString();
      
      const createWorkOrderDto = {
        customer_id: customerId,
        description: 'Test work order description',
        priority: 'medium',
        scheduled_date: scheduledDate,
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createWorkOrderDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.customer_id).toBe(customerId);
      expect(response.body.description).toBe(createWorkOrderDto.description);
      expect(response.body.status).toBe('pending');
      expect(response.body.priority).toBe('medium');

      workOrderId = response.body.id;
      createdWorkOrderIds.push(workOrderId);
    });

    it('should fail to create work order with invalid customer', async () => {
      const createWorkOrderDto = {
        customer_id: 'invalid-uuid',
        description: 'Test work order description',
      };

      await request(app.getHttpServer())
        .post('/api/v1/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createWorkOrderDto)
        .expect(400);
    });

    it('should fail to create work order with past scheduled date', async () => {
      // Use a date in the past (1 year ago)
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);
      
      const createWorkOrderDto = {
        customer_id: customerId,
        description: 'Test work order description',
        scheduled_date: pastDate.toISOString(),
      };

      await request(app.getHttpServer())
        .post('/api/v1/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createWorkOrderDto)
        .expect(400);
    });
  });

  describe('/api/v1/work-orders/:id (GET)', () => {
    beforeEach(async () => {
      // Create a work order for this test suite (always create new one)
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const workOrder = await prisma.workOrder.create({
        data: {
          tenant_id: TEST_TENANTS.TENANT1,
          customer_id: customerId,
          description: 'Test work order for GET',
          status: 'pending',
          priority: 'medium',
          scheduled_date: futureDate,
        },
      });
      workOrderId = workOrder.id;
      createdWorkOrderIds.push(workOrderId);
    });

    it('should get work order by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/work-orders/${workOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(workOrderId);
      expect(response.body.customer_id).toBe(customerId);
      expect(response.body).toHaveProperty('customer_name');
      expect(response.body).toHaveProperty('customer_email');
    });

    it('should return 404 for non-existent work order', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .get(`/api/v1/work-orders/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/api/v1/work-orders (GET)', () => {
    beforeEach(async () => {
      // Create work orders for list tests
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const workOrder = await prisma.workOrder.create({
        data: {
          tenant_id: TEST_TENANTS.TENANT1,
          customer_id: customerId,
          description: 'Test work order for list',
          status: 'pending',
          priority: 'medium',
          scheduled_date: futureDate,
        },
      });
      createdWorkOrderIds.push(workOrder.id);
    });

    it('should list work orders with filters', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'pending', priority: 'medium' })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should list work orders with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
      expect(response.body.pagination.total).toBeGreaterThan(0);
    });
  });

  describe('/api/v1/work-orders/:id (PUT)', () => {
    beforeEach(async () => {
      // Create a work order for this test suite (always create new one)
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const workOrder = await prisma.workOrder.create({
        data: {
          tenant_id: TEST_TENANTS.TENANT1,
          customer_id: customerId,
          description: 'Test work order for UPDATE',
          status: 'pending',
          priority: 'medium',
          scheduled_date: futureDate,
        },
      });
      workOrderId = workOrder.id;
      createdWorkOrderIds.push(workOrderId);
    });

    it('should update work order', async () => {
      const updateWorkOrderDto = {
        status: 'in-progress',
        assigned_to: technicianId,
        notes: 'Updated notes',
      };

      const response = await request(app.getHttpServer())
        .put(`/api/v1/work-orders/${workOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateWorkOrderDto)
        .expect(200);

      expect(response.body.status).toBe('in-progress');
      expect(response.body.assigned_to).toBe(technicianId);
      expect(response.body.notes).toBe('Updated notes');
    });

    it('should fail to update non-existent work order', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const updateWorkOrderDto = {
        status: 'completed',
      };

      await request(app.getHttpServer())
        .put(`/api/v1/work-orders/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateWorkOrderDto)
        .expect(404);
    });

    it('should fail to set completion date without completed status', async () => {
      // workOrderId is already set by beforeEach
      const updateWorkOrderDto = {
        completion_date: '2025-01-15T17:00:00Z',
      };

      await request(app.getHttpServer())
        .put(`/api/v1/work-orders/${workOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateWorkOrderDto)
        .expect(400);
    });
  });

  describe('/api/v1/work-orders/customer/:customerId (GET)', () => {
    beforeEach(async () => {
      // Create work orders for this test
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const workOrder = await prisma.workOrder.create({
        data: {
          tenant_id: TEST_TENANTS.TENANT1,
          customer_id: customerId,
          description: 'Test work order for customer list',
          status: 'pending',
          priority: 'medium',
          scheduled_date: futureDate,
        },
      });
      createdWorkOrderIds.push(workOrder.id);
    });

    it('should get work orders by customer', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/work-orders/customer/${customerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].customer_id).toBe(customerId);
    });

    it('should return 404 for non-existent customer', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .get(`/api/v1/work-orders/customer/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/api/v1/work-orders/technician/:technicianId (GET)', () => {
    it('should get work orders by technician', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/work-orders/technician/${technicianId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 404 for non-existent technician', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .get(`/api/v1/work-orders/technician/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/api/v1/work-orders/:id (DELETE)', () => {
    beforeEach(async () => {
      // Create a work order for this test suite
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const workOrder = await prisma.workOrder.create({
        data: {
          tenant_id: TEST_TENANTS.TENANT1,
          customer_id: customerId,
          description: 'Test work order for DELETE',
          status: 'pending',
          priority: 'medium',
          scheduled_date: futureDate,
        },
      });
      workOrderId = workOrder.id;
      // Don't add to createdWorkOrderIds since we're testing deletion
    });

    it('should delete work order (soft delete)', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/work-orders/${workOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Work order deleted successfully');

      // Verify work order is soft deleted (status = canceled)
      const deletedWorkOrder = await prisma.workOrder.findFirst({
        where: { id: workOrderId },
      });
      expect(deletedWorkOrder?.status).toBe('canceled');
    });

    it('should return 404 for non-existent work order', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      await request(app.getHttpServer())
        .delete(`/api/v1/work-orders/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('Tenant Isolation', () => {
    let otherCustomerId: string;
    let otherWorkOrderId: string;

    beforeAll(async () => {
      // Create customer in other tenant (using seeded tenant 2)
      const otherCustomer = await prisma.account.create({
        data: {
          tenant_id: TEST_TENANTS.TENANT2,
          name: 'Other Customer',
          account_type: 'commercial',
          status: 'active',
        },
      });
      otherCustomerId = otherCustomer.id;

      // Create work order in other tenant
      const otherWorkOrder = await prisma.workOrder.create({
        data: {
          tenant_id: TEST_TENANTS.TENANT2,
          customer_id: otherCustomer.id,
          description: 'Other tenant work order',
          status: 'pending',
          priority: 'medium',
        },
      });
      otherWorkOrderId = otherWorkOrder.id;
    });

    afterAll(async () => {
      // Clean up other tenant data
      if (otherWorkOrderId) {
        await prisma.workOrder.deleteMany({ where: { id: otherWorkOrderId } });
      }
      if (otherCustomerId) {
        await prisma.account.deleteMany({ where: { id: otherCustomerId } });
      }
    });

    it('should not allow access to work orders from other tenants', async () => {
      await request(app.getHttpServer())
        .get(`/api/v1/work-orders/${otherWorkOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should not allow updating work orders from other tenants', async () => {
      const updateWorkOrderDto = {
        status: 'completed',
      };

      await request(app.getHttpServer())
        .put(`/api/v1/work-orders/${otherWorkOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateWorkOrderDto)
        .expect(404);
    });

    it('should not allow deleting work orders from other tenants', async () => {
      await request(app.getHttpServer())
        .delete(`/api/v1/work-orders/${otherWorkOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('V2 API', () => {
    beforeEach(async () => {
      // Create work orders for V2 tests
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const workOrder = await prisma.workOrder.create({
        data: {
          tenant_id: TEST_TENANTS.TENANT1,
          customer_id: customerId,
          description: 'Test work order for V2 list',
          status: 'pending',
          priority: 'medium',
          scheduled_date: futureDate,
        },
      });
      createdWorkOrderIds.push(workOrder.id);
    });

    it('should return work orders in V2 format', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v2/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // V2 controller wraps service result in data field
      // Service returns { data: workOrders, pagination: {...} }
      // Controller returns { data: { data: workOrders, pagination: {...} }, meta: {...} }
      const result = expectV2Response(response);
      
      // Check that result has data and pagination properties
      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('pagination');
      expect(Array.isArray(result.data)).toBe(true);
      
      // Check pagination structure
      expect(result.pagination).toMatchObject({
        page: expect.any(Number),
        limit: expect.any(Number),
        total: expect.any(Number),
        totalPages: expect.any(Number)
      });
    });

    it('should create work order with V2 format', async () => {
      // Use a future date (1 week from now)
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      
      const createWorkOrderDto = {
        customer_id: customerId,
        description: 'Test work order V2',
        priority: 'medium',
        scheduled_date: futureDate.toISOString(),
      };

      const response = await request(app.getHttpServer())
        .post('/api/v2/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createWorkOrderDto)
        .expect(201);

      // expectV2Response expects 200 by default, but create returns 201
      const data = expectV2Response(response, 201);
      expect(data).toHaveProperty('id');
      expect(data.customer_id).toBe(customerId);
      
      if (data.id) {
        createdWorkOrderIds.push(data.id);
      }
    });
  });
});
