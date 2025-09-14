/**
 * CRM Workflow Integration Tests
 * End-to-end business process validation for mission-critical operations
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { TestDatabase, MockFactory, PerformanceTestUtils } from '../setup/enterprise-setup';

describe('CRM Workflow Integration Tests', () => {
  let app: INestApplication;
  let testDb: TestDatabase;
  let authToken: string;
  let tenantId: string;
  let customerId: string;
  let workOrderId: string;
  let technicianId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testDb = TestDatabase.getInstance();
    await testDb.setup();
    await testDb.seedTestData();
  });

  afterAll(async () => {
    await testDb.clearTestData();
    await testDb.cleanup();
    await app.close();
  });

  describe('Complete Customer Lifecycle', () => {
    it('should handle complete customer lifecycle from lead to completion', async () => {
      // Step 1: Create customer
      const customerData = MockFactory.createCustomer();
      const customerResponse = await request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customerData)
        .expect(201);

      customerId = customerResponse.body.id;
      expect(customerResponse.body).toHaveValidTenantId();
      expect(customerResponse.body.email).toBe(customerData.email);

      // Step 2: Update customer information
      const updateData = {
        first_name: 'Updated',
        last_name: 'Customer',
        phone: '+1-555-9999'
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/api/customers/${customerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.first_name).toBe('Updated');
      expect(updateResponse.body.phone).toBe('+1-555-9999');

      // Step 3: Create work order for customer
      const workOrderData = MockFactory.createWorkOrder({
        customer_id: customerId,
        status: 'scheduled'
      });

      const workOrderResponse = await request(app.getHttpServer())
        .post('/api/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workOrderData)
        .expect(201);

      workOrderId = workOrderResponse.body.id;
      expect(workOrderResponse.body.customer_id).toBe(customerId);
      expect(workOrderResponse.body.status).toBe('scheduled');

      // Step 4: Assign technician to work order
      const technicianData = {
        first_name: 'John',
        last_name: 'Technician',
        email: 'john.tech@example.com',
        phone: '+1-555-8888',
        skills: ['pest_control', 'inspection'],
        availability: 'available'
      };

      const technicianResponse = await request(app.getHttpServer())
        .post('/api/technicians')
        .set('Authorization', `Bearer ${authToken}`)
        .send(technicianData)
        .expect(201);

      technicianId = technicianResponse.body.id;

      const assignmentResponse = await request(app.getHttpServer())
        .put(`/api/work-orders/${workOrderId}/assign`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ technician_id: technicianId })
        .expect(200);

      expect(assignmentResponse.body.technician_id).toBe(technicianId);
      expect(assignmentResponse.body.status).toBe('assigned');

      // Step 5: Update work order status to in progress
      const statusUpdateResponse = await request(app.getHttpServer())
        .put(`/api/work-orders/${workOrderId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'in_progress' })
        .expect(200);

      expect(statusUpdateResponse.body.status).toBe('in_progress');

      // Step 6: Complete work order
      const completionData = {
        status: 'completed',
        completion_notes: 'Work completed successfully',
        materials_used: ['pesticide', 'equipment'],
        completion_time: new Date().toISOString()
      };

      const completionResponse = await request(app.getHttpServer())
        .put(`/api/work-orders/${workOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(completionData)
        .expect(200);

      expect(completionResponse.body.status).toBe('completed');
      expect(completionResponse.body.completion_notes).toBe('Work completed successfully');

      // Step 7: Generate invoice
      const invoiceResponse = await request(app.getHttpServer())
        .post('/api/invoices')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          customer_id: customerId,
          work_order_id: workOrderId,
          amount: 150.00,
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .expect(201);

      expect(invoiceResponse.body.customer_id).toBe(customerId);
      expect(invoiceResponse.body.work_order_id).toBe(workOrderId);
      expect(invoiceResponse.body.amount).toBe(150.00);
    });
  });

  describe('Multi-Tenant Isolation', () => {
    it('should enforce tenant isolation across all operations', async () => {
      // Create customer in tenant-1
      const tenant1Customer = MockFactory.createCustomer({
        tenant_id: 'tenant-1',
        email: 'tenant1@example.com'
      });

      const tenant1Response = await request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(tenant1Customer)
        .expect(201);

      const tenant1CustomerId = tenant1Response.body.id;

      // Attempt to access tenant-1 customer from tenant-2 context
      const tenant2Token = 'tenant-2-auth-token'; // Mock token for tenant-2

      await request(app.getHttpServer())
        .get(`/api/customers/${tenant1CustomerId}`)
        .set('Authorization', `Bearer ${tenant2Token}`)
        .expect(403); // Should be forbidden

      // Verify tenant-1 customer is not visible in tenant-2 customer list
      const tenant2CustomersResponse = await request(app.getHttpServer())
        .get('/api/customers')
        .set('Authorization', `Bearer ${tenant2Token}`)
        .expect(200);

      const tenant2Customers = tenant2CustomersResponse.body.customers;
      expect(tenant2Customers.find(c => c.id === tenant1CustomerId)).toBeUndefined();
    });
  });

  describe('Work Order State Transitions', () => {
    it('should enforce valid work order state transitions', async () => {
      const workOrderData = MockFactory.createWorkOrder({
        status: 'scheduled'
      });

      const workOrderResponse = await request(app.getHttpServer())
        .post('/api/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workOrderData)
        .expect(201);

      const workOrderId = workOrderResponse.body.id;

      // Valid transition: scheduled -> assigned
      await request(app.getHttpServer())
        .put(`/api/work-orders/${workOrderId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'assigned' })
        .expect(200);

      // Valid transition: assigned -> in_progress
      await request(app.getHttpServer())
        .put(`/api/work-orders/${workOrderId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'in_progress' })
        .expect(200);

      // Valid transition: in_progress -> completed
      await request(app.getHttpServer())
        .put(`/api/work-orders/${workOrderId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'completed' })
        .expect(200);

      // Invalid transition: completed -> in_progress (should fail)
      await request(app.getHttpServer())
        .put(`/api/work-orders/${workOrderId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'in_progress' })
        .expect(400);
    });
  });

  describe('Technician Assignment Logic', () => {
    it('should assign technician based on skills and availability', async () => {
      // Create technicians with different skills
      const pestControlTech = {
        first_name: 'Pest',
        last_name: 'Control',
        email: 'pest@example.com',
        skills: ['pest_control', 'inspection'],
        availability: 'available'
      };

      const generalTech = {
        first_name: 'General',
        last_name: 'Tech',
        email: 'general@example.com',
        skills: ['general_maintenance'],
        availability: 'available'
      };

      const pestTechResponse = await request(app.getHttpServer())
        .post('/api/technicians')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pestControlTech)
        .expect(201);

      const generalTechResponse = await request(app.getHttpServer())
        .post('/api/technicians')
        .set('Authorization', `Bearer ${authToken}`)
        .send(generalTech)
        .expect(201);

      // Create work order requiring pest control
      const workOrderData = MockFactory.createWorkOrder({
        service_type: 'pest_control',
        status: 'scheduled'
      });

      const workOrderResponse = await request(app.getHttpServer())
        .post('/api/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workOrderData)
        .expect(201);

      const workOrderId = workOrderResponse.body.id;

      // Auto-assign technician based on skills
      const assignmentResponse = await request(app.getHttpServer())
        .post(`/api/work-orders/${workOrderId}/auto-assign`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Should assign pest control technician, not general technician
      expect(assignmentResponse.body.technician_id).toBe(pestTechResponse.body.id);
      expect(assignmentResponse.body.technician_id).not.toBe(generalTechResponse.body.id);
    });

    it('should handle technician unavailability', async () => {
      // Create unavailable technician
      const unavailableTech = {
        first_name: 'Unavailable',
        last_name: 'Tech',
        email: 'unavailable@example.com',
        skills: ['pest_control'],
        availability: 'unavailable'
      };

      await request(app.getHttpServer())
        .post('/api/technicians')
        .set('Authorization', `Bearer ${authToken}`)
        .send(unavailableTech)
        .expect(201);

      // Create work order
      const workOrderData = MockFactory.createWorkOrder({
        service_type: 'pest_control',
        status: 'scheduled'
      });

      const workOrderResponse = await request(app.getHttpServer())
        .post('/api/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workOrderData)
        .expect(201);

      const workOrderId = workOrderResponse.body.id;

      // Attempt auto-assignment should fail
      await request(app.getHttpServer())
        .post(`/api/work-orders/${workOrderId}/auto-assign`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404); // No available technicians
    });
  });

  describe('Data Consistency and Integrity', () => {
    it('should maintain referential integrity across related entities', async () => {
      // Create customer
      const customerData = MockFactory.createCustomer();
      const customerResponse = await request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customerData)
        .expect(201);

      const customerId = customerResponse.body.id;

      // Create work order with valid customer reference
      const workOrderData = MockFactory.createWorkOrder({
        customer_id: customerId
      });

      const workOrderResponse = await request(app.getHttpServer())
        .post('/api/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workOrderData)
        .expect(201);

      expect(workOrderResponse.body.customer_id).toBe(customerId);

      // Attempt to create work order with invalid customer reference
      const invalidWorkOrderData = MockFactory.createWorkOrder({
        customer_id: 'nonexistent-customer-id'
      });

      await request(app.getHttpServer())
        .post('/api/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidWorkOrderData)
        .expect(400); // Should fail due to foreign key constraint
    });

    it('should handle concurrent updates safely', async () => {
      const customerData = MockFactory.createCustomer();
      const customerResponse = await request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customerData)
        .expect(201);

      const customerId = customerResponse.body.id;

      // Simulate concurrent updates
      const update1 = { first_name: 'Updated1' };
      const update2 = { last_name: 'Updated2' };

      const [response1, response2] = await Promise.all([
        request(app.getHttpServer())
          .put(`/api/customers/${customerId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(update1),
        request(app.getHttpServer())
          .put(`/api/customers/${customerId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(update2)
      ]);

      // Both updates should succeed
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);

      // Verify final state is consistent
      const finalResponse = await request(app.getHttpServer())
        .get(`/api/customers/${customerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(finalResponse.body.first_name).toBe('Updated1');
      expect(finalResponse.body.last_name).toBe('Updated2');
    });
  });

  describe('Performance Under Load', () => {
    it('should handle multiple concurrent customer creations', async () => {
      const concurrentRequests = 10;
      const promises = [];

      for (let i = 0; i < concurrentRequests; i++) {
        const customerData = MockFactory.createCustomer({
          email: `concurrent${i}@example.com`
        });

        promises.push(
          request(app.getHttpServer())
            .post('/api/customers')
            .set('Authorization', `Bearer ${authToken}`)
            .send(customerData)
        );
      }

      const startTime = performance.now();
      const responses = await Promise.all(promises);
      const endTime = performance.now();

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(201);
      });

      // Should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(5000); // 5 seconds
    });

    it('should handle large dataset queries efficiently', async () => {
      // Create multiple customers
      const customerPromises = [];
      for (let i = 0; i < 50; i++) {
        const customerData = MockFactory.createCustomer({
          email: `bulk${i}@example.com`
        });
        customerPromises.push(
          request(app.getHttpServer())
            .post('/api/customers')
            .set('Authorization', `Bearer ${authToken}`)
            .send(customerData)
        );
      }

      await Promise.all(customerPromises);

      // Query all customers
      const startTime = performance.now();
      const response = await request(app.getHttpServer())
        .get('/api/customers?limit=100')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      const endTime = performance.now();

      expect(response.body.customers.length).toBeGreaterThan(50);
      expect(endTime - startTime).toBeLessThan(1000); // 1 second
    });
  });

  describe('Error Recovery and Resilience', () => {
    it('should handle partial failures gracefully', async () => {
      // Create customer
      const customerData = MockFactory.createCustomer();
      const customerResponse = await request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customerData)
        .expect(201);

      const customerId = customerResponse.body.id;

      // Create work order
      const workOrderData = MockFactory.createWorkOrder({
        customer_id: customerId
      });

      const workOrderResponse = await request(app.getHttpServer())
        .post('/api/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workOrderData)
        .expect(201);

      const workOrderId = workOrderResponse.body.id;

      // Attempt to delete customer with active work order should fail
      await request(app.getHttpServer())
        .delete(`/api/customers/${customerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      // Customer should still exist
      await request(app.getHttpServer())
        .get(`/api/customers/${customerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Work order should still exist
      await request(app.getHttpServer())
        .get(`/api/work-orders/${workOrderId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });

    it('should maintain data consistency during rollbacks', async () => {
      // Create customer
      const customerData = MockFactory.createCustomer();
      const customerResponse = await request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customerData)
        .expect(201);

      const customerId = customerResponse.body.id;

      // Attempt to create work order with invalid data (should fail)
      const invalidWorkOrderData = {
        customer_id: customerId,
        service_type: 'invalid_service_type', // Invalid enum value
        status: 'scheduled'
      };

      await request(app.getHttpServer())
        .post('/api/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidWorkOrderData)
        .expect(400);

      // Customer should still exist and be unchanged
      const customerCheckResponse = await request(app.getHttpServer())
        .get(`/api/customers/${customerId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(customerCheckResponse.body.email).toBe(customerData.email);
    });
  });

  describe('Business Rule Validation', () => {
    it('should enforce business rules for work order scheduling', async () => {
      // Create customer
      const customerData = MockFactory.createCustomer();
      const customerResponse = await request(app.getHttpServer())
        .post('/api/customers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(customerData)
        .expect(201);

      const customerId = customerResponse.body.id;

      // Attempt to schedule work order in the past
      const pastWorkOrderData = MockFactory.createWorkOrder({
        customer_id: customerId,
        scheduled_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Yesterday
      });

      await request(app.getHttpServer())
        .post('/api/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pastWorkOrderData)
        .expect(400); // Should fail - cannot schedule in the past

      // Schedule work order in the future (should succeed)
      const futureWorkOrderData = MockFactory.createWorkOrder({
        customer_id: customerId,
        scheduled_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Tomorrow
      });

      await request(app.getHttpServer())
        .post('/api/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(futureWorkOrderData)
        .expect(201);
    });

    it('should enforce technician skill requirements', async () => {
      // Create technician without required skills
      const unskilledTech = {
        first_name: 'Unskilled',
        last_name: 'Tech',
        email: 'unskilled@example.com',
        skills: ['general_maintenance'], // Missing pest_control skill
        availability: 'available'
      };

      const techResponse = await request(app.getHttpServer())
        .post('/api/technicians')
        .set('Authorization', `Bearer ${authToken}`)
        .send(unskilledTech)
        .expect(201);

      const technicianId = techResponse.body.id;

      // Create work order requiring specific skills
      const workOrderData = MockFactory.createWorkOrder({
        service_type: 'pest_control',
        required_skills: ['pest_control', 'inspection']
      });

      const workOrderResponse = await request(app.getHttpServer())
        .post('/api/work-orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send(workOrderData)
        .expect(201);

      const workOrderId = workOrderResponse.body.id;

      // Attempt to assign unskilled technician should fail
      await request(app.getHttpServer())
        .put(`/api/work-orders/${workOrderId}/assign`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ technician_id: technicianId })
        .expect(400); // Should fail - technician lacks required skills
    });
  });
});






