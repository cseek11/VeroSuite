import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/common/services/database.service';

describe('WorkOrders (e2e)', () => {
  let app: INestApplication;
  let db: DatabaseService;
  let authToken: string;
  let tenantId: string;
  let customerId: string;
  let technicianId: string;
  let workOrderId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    db = moduleFixture.get<DatabaseService>(DatabaseService);

    // Create test tenant
    const tenant = await db.tenant.create({
      data: {
        name: 'Test Tenant',
        domain: 'test.com',
        status: 'active',
        subscription_tier: 'basic',
      },
    });
    tenantId = tenant.id;

    // Create test user for authentication
    const user = await db.user.create({
      data: {
        tenant_id: tenantId,
        email: 'test@test.com',
        password_hash: 'hashed_password',
        first_name: 'Test',
        last_name: 'User',
        roles: ['admin'],
      },
    });

    // Create test customer
    const customer = await db.account.create({
      data: {
        tenant_id: tenantId,
        name: 'Test Customer',
        account_type: 'commercial',
        status: 'active',
      },
    });
    customerId = customer.id;

    // Create test technician
    const technician = await db.user.create({
      data: {
        tenant_id: tenantId,
        email: 'tech@test.com',
        password_hash: 'hashed_password',
        first_name: 'Test',
        last_name: 'Technician',
        roles: ['technician'],
      },
    });
    technicianId = technician.id;

    // Mock JWT authentication
    authToken = 'mock-jwt-token';
  });

  afterAll(async () => {
    // Clean up test data
    await db.workOrder.deleteMany({ where: { tenant_id: tenantId } });
    await db.account.deleteMany({ where: { tenant_id: tenantId } });
    await db.user.deleteMany({ where: { tenant_id: tenantId } });
    await db.tenant.delete({ where: { id: tenantId } });
    await app.close();
  });

  describe('/api/work-orders (POST)', () => {
    it('should create a work order', async () => {
      const createWorkOrderDto = {
        customer_id: customerId,
        description: 'Test work order description',
        priority: 'medium',
        scheduled_date: '2025-01-15T09:00:00Z',
      };

      const response = await request(app.getHttpServer())
        .post('/api/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createWorkOrderDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.customer_id).toBe(customerId);
      expect(response.body.description).toBe(createWorkOrderDto.description);
      expect(response.body.status).toBe('pending');
      expect(response.body.priority).toBe('medium');

      workOrderId = response.body.id;
    });

    it('should fail to create work order with invalid customer', async () => {
      const createWorkOrderDto = {
        customer_id: 'invalid-uuid',
        description: 'Test work order description',
      };

      await request(app.getHttpServer())
        .post('/api/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createWorkOrderDto)
        .expect(400);
    });

    it('should fail to create work order with past scheduled date', async () => {
      const createWorkOrderDto = {
        customer_id: customerId,
        description: 'Test work order description',
        scheduled_date: '2020-01-15T09:00:00Z',
      };

      await request(app.getHttpServer())
        .post('/api/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createWorkOrderDto)
        .expect(400);
    });
  });

  describe('/api/work-orders/:id (GET)', () => {
    it('should get work order by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/work-orders/${workOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(workOrderId);
      expect(response.body.customer_id).toBe(customerId);
      expect(response.body).toHaveProperty('account');
      expect(response.body).toHaveProperty('assignedTechnician');
    });

    it('should return 404 for non-existent work order', async () => {
      await request(app.getHttpServer())
        .get('/api/work-orders/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/api/work-orders (GET)', () => {
    it('should list work orders with filters', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/work-orders')
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
        .get('/api/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
      expect(response.body.pagination.total).toBeGreaterThan(0);
    });
  });

  describe('/api/work-orders/:id (PUT)', () => {
    it('should update work order', async () => {
      const updateWorkOrderDto = {
        status: 'in-progress',
        assigned_to: technicianId,
        notes: 'Updated notes',
      };

      const response = await request(app.getHttpServer())
        .put(`/api/work-orders/${workOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateWorkOrderDto)
        .expect(200);

      expect(response.body.status).toBe('in-progress');
      expect(response.body.assigned_to).toBe(technicianId);
      expect(response.body.notes).toBe('Updated notes');
    });

    it('should fail to update non-existent work order', async () => {
      const updateWorkOrderDto = {
        status: 'completed',
      };

      await request(app.getHttpServer())
        .put('/api/work-orders/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateWorkOrderDto)
        .expect(404);
    });

    it('should fail to set completion date without completed status', async () => {
      const updateWorkOrderDto = {
        completion_date: '2025-01-15T17:00:00Z',
      };

      await request(app.getHttpServer())
        .put(`/api/work-orders/${workOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateWorkOrderDto)
        .expect(400);
    });
  });

  describe('/api/work-orders/customer/:customerId (GET)', () => {
    it('should get work orders by customer', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/work-orders/customer/${customerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].customer_id).toBe(customerId);
    });

    it('should return 404 for non-existent customer', async () => {
      await request(app.getHttpServer())
        .get('/api/work-orders/customer/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/api/work-orders/technician/:technicianId (GET)', () => {
    it('should get work orders by technician', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/work-orders/technician/${technicianId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 404 for non-existent technician', async () => {
      await request(app.getHttpServer())
        .get('/api/work-orders/technician/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('/api/work-orders/:id (DELETE)', () => {
    it('should delete work order (soft delete)', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/work-orders/${workOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Work order deleted successfully');

      // Verify work order is soft deleted (status = canceled)
      const deletedWorkOrder = await db.workOrder.findFirst({
        where: { id: workOrderId },
      });
      expect(deletedWorkOrder.status).toBe('canceled');
    });

    it('should return 404 for non-existent work order', async () => {
      await request(app.getHttpServer())
        .delete('/api/work-orders/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('Tenant Isolation', () => {
    let otherTenantId: string;
    let otherWorkOrderId: string;

    beforeAll(async () => {
      // Create another tenant
      const otherTenant = await db.tenant.create({
        data: {
          name: 'Other Tenant',
          domain: 'other.com',
          status: 'active',
          subscription_tier: 'basic',
        },
      });
      otherTenantId = otherTenant.id;

      // Create customer in other tenant
      const otherCustomer = await db.account.create({
        data: {
          tenant_id: otherTenantId,
          name: 'Other Customer',
          account_type: 'commercial',
          status: 'active',
        },
      });

      // Create work order in other tenant
      const otherWorkOrder = await db.workOrder.create({
        data: {
          tenant_id: otherTenantId,
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
      await db.workOrder.deleteMany({ where: { tenant_id: otherTenantId } });
      await db.account.deleteMany({ where: { tenant_id: otherTenantId } });
      await db.tenant.delete({ where: { id: otherTenantId } });
    });

    it('should not allow access to work orders from other tenants', async () => {
      await request(app.getHttpServer())
        .get(`/api/work-orders/${otherWorkOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should not allow updating work orders from other tenants', async () => {
      const updateWorkOrderDto = {
        status: 'completed',
      };

      await request(app.getHttpServer())
        .put(`/api/work-orders/${otherWorkOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateWorkOrderDto)
        .expect(404);
    });

    it('should not allow deleting work orders from other tenants', async () => {
      await request(app.getHttpServer())
        .delete(`/api/work-orders/${otherWorkOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
