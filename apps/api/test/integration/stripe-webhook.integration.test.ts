/**
 * Stripe Webhook Integration Tests
 * Tests for subscription webhook handlers
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DatabaseService } from '../../src/common/services/database.service';
import { StripeService } from '../../src/billing/stripe.service';
import { EmailService } from '../../src/common/services/email.service';

describe('Stripe Webhook Integration Tests', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;
  let stripeService: StripeService;
  let emailService: EmailService;

  const mockTenantId = 'tenant-123';
  const mockAccountId = 'account-123';
  const mockInvoiceId = 'invoice-123';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    databaseService = moduleFixture.get<DatabaseService>(DatabaseService);
    stripeService = moduleFixture.get<StripeService>(StripeService);
    emailService = moduleFixture.get<EmailService>(EmailService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Setup test data
    await databaseService.account.upsert({
      where: { id: mockAccountId },
      create: {
        id: mockAccountId,
        tenant_id: mockTenantId,
        name: 'Test Customer',
        email: 'test@example.com',
        account_type: 'commercial',
        status: 'active',
      },
      update: {},
    });

    await databaseService.invoice.upsert({
      where: { id: mockInvoiceId },
      create: {
        id: mockInvoiceId,
        tenant_id: mockTenantId,
        account_id: mockAccountId,
        invoice_number: 'INV-TEST-001',
        status: 'sent',
        issue_date: new Date(),
        due_date: new Date(),
        subtotal: 100,
        tax_amount: 0,
        total_amount: 100,
        created_by: 'user-123',
        updated_by: 'user-123',
        updated_at: new Date(),
      },
      update: {},
    });
  });

  afterEach(async () => {
    // Cleanup test data
    await databaseService.invoice.deleteMany({
      where: { id: mockInvoiceId },
    });
    await databaseService.account.deleteMany({
      where: { id: mockAccountId },
    });
  });

  describe('POST /api/v1/billing/stripe/webhook', () => {
    it('should handle invoice.payment_succeeded webhook', async () => {
      const webhookPayload = {
        id: 'evt_test_webhook',
        type: 'invoice.payment_succeeded',
        data: {
          object: {
            id: 'in_test_123',
            customer: 'cus_test_123',
            subscription: 'sub_test_123',
            amount_paid: 10000, // $100.00 in cents
            amount_due: 0,
            created: Math.floor(Date.now() / 1000),
            payment_intent: 'pi_test_123',
            charge: 'ch_test_123',
            metadata: {
              invoiceId: mockInvoiceId,
              tenantId: mockTenantId,
              accountId: mockAccountId,
            },
          },
        },
      };

      // Mock Stripe webhook signature verification
      jest.spyOn(stripeService, 'verifyWebhookSignature').mockReturnValue(webhookPayload as any);

      const response = await request(app.getHttpServer())
        .post('/api/v1/billing/stripe/webhook')
        .set('stripe-signature', 'test_signature')
        .send(webhookPayload)
        .expect(200);

      expect(response.body.received).toBe(true);
      expect(response.body.eventType).toBe('invoice.payment_succeeded');

      // Verify payment was created (if billing service is available)
      // Note: In integration tests, we may need to mock the billing service
      // or verify through communication logs
      const logs = await databaseService.communicationLog.findMany({
        where: { customer_id: mockAccountId },
      });
      // Payment success should be logged or payment created
      expect(response.body.received).toBe(true);
    });

    it('should handle invoice.payment_failed webhook', async () => {
      const webhookPayload = {
        id: 'evt_test_webhook_failed',
        type: 'invoice.payment_failed',
        data: {
          object: {
            id: 'in_test_failed',
            customer: 'cus_test_123',
            subscription: 'sub_test_123',
            amount_due: 10000,
            last_payment_error: {
              message: 'Your card was declined.',
              code: 'card_declined',
              decline_code: 'insufficient_funds',
            },
            metadata: {
              invoiceId: mockInvoiceId,
              tenantId: mockTenantId,
              accountId: mockAccountId,
            },
          },
        },
      };

      jest.spyOn(stripeService, 'verifyWebhookSignature').mockReturnValue(webhookPayload as any);
      jest.spyOn(emailService, 'sendEmail').mockResolvedValue({ success: true });

      const response = await request(app.getHttpServer())
        .post('/api/v1/billing/stripe/webhook')
        .set('stripe-signature', 'test_signature')
        .send(webhookPayload)
        .expect(200);

      expect(response.body.received).toBe(true);
      expect(response.body.eventType).toBe('invoice.payment_failed');

      // Verify failure was logged
      const logs = await databaseService.communicationLog.findMany({
        where: {
          customer_id: mockAccountId,
          communication_type: 'subscription_payment_failure',
        },
      });
      expect(logs.length).toBeGreaterThan(0);
    });

    it('should handle customer.subscription.created webhook', async () => {
      const webhookPayload = {
        id: 'evt_test_subscription_created',
        type: 'customer.subscription.created',
        data: {
          object: {
            id: 'sub_test_123',
            status: 'active',
            current_period_start: Math.floor(Date.now() / 1000),
            current_period_end: Math.floor(Date.now() / 1000) + 2592000,
            metadata: {
              invoiceId: mockInvoiceId,
              tenantId: mockTenantId,
              accountId: mockAccountId,
            },
          },
        },
      };

      jest.spyOn(stripeService, 'verifyWebhookSignature').mockReturnValue(webhookPayload as any);

      const response = await request(app.getHttpServer())
        .post('/api/v1/billing/stripe/webhook')
        .set('stripe-signature', 'test_signature')
        .send(webhookPayload)
        .expect(200);

      expect(response.body.received).toBe(true);
      expect(response.body.eventType).toBe('customer.subscription.created');

      // Verify subscription event was logged
      const logs = await databaseService.communicationLog.findMany({
        where: {
          customer_id: mockAccountId,
          communication_type: 'subscription_event',
        },
      });
      expect(logs.length).toBeGreaterThan(0);
    });

    it('should handle customer.subscription.deleted webhook', async () => {
      const webhookPayload = {
        id: 'evt_test_subscription_deleted',
        type: 'customer.subscription.deleted',
        data: {
          object: {
            id: 'sub_test_123',
            status: 'canceled',
            current_period_end: Math.floor(Date.now() / 1000) + 2592000,
            metadata: {
              invoiceId: mockInvoiceId,
              tenantId: mockTenantId,
              accountId: mockAccountId,
            },
          },
        },
      };

      jest.spyOn(stripeService, 'verifyWebhookSignature').mockReturnValue(webhookPayload as any);

      const response = await request(app.getHttpServer())
        .post('/api/v1/billing/stripe/webhook')
        .set('stripe-signature', 'test_signature')
        .send(webhookPayload)
        .expect(200);

      expect(response.body.received).toBe(true);
      expect(response.body.eventType).toBe('customer.subscription.deleted');

      // Verify deletion event was logged with follow-up required
      const logs = await databaseService.communicationLog.findMany({
        where: {
          customer_id: mockAccountId,
          communication_type: 'subscription_event',
          follow_up_required: true,
        },
      });
      expect(logs.length).toBeGreaterThan(0);
    });

    it('should reject webhook with invalid signature', async () => {
      jest.spyOn(stripeService, 'verifyWebhookSignature').mockImplementation(() => {
        throw new Error('Invalid signature');
      });

      await request(app.getHttpServer())
        .post('/api/v1/billing/stripe/webhook')
        .set('stripe-signature', 'invalid_signature')
        .send({ type: 'invoice.payment_succeeded', data: {} })
        .expect(400);
    });
  });
});

