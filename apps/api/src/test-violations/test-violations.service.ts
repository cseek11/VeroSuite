import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';

/**
 * TEST FILE - This file intentionally violates multiple rules to test the auto-enforcer
 * DO NOT USE IN PRODUCTION
 * Last modified: 2025-12-02 - Testing enforcer detection
 */
@Injectable()
export class TestViolationsService {
  // VIOLATION: Hardcoded secret
  private readonly JWT_SECRET = 'my-secret-key-123';
  
  // VIOLATION: Hardcoded API key
  private readonly API_KEY = 'sk_live_1234567890abcdef';

  constructor(private readonly prisma: PrismaService) {}

  // VIOLATION: Missing tenant_id filter in query
  // VIOLATION: Trusting client-provided tenant_id parameter
  async findAllCustomers(clientTenantId: string) {
    // VIOLATION: Query without tenant_id filter - exposes all tenants' data
    return this.prisma.account.findMany({
      where: {
        status: 'active',
        // Missing: tenant_id filter
      },
    });
  }

  // VIOLATION: Missing tenant_id filter
  // VIOLATION: No input validation
  async createCustomer(data: any, tenantId: string) {
    // VIOLATION: No validation of data
    // VIOLATION: Trusting client-provided tenant_id
    // VIOLATION: No transaction for multi-step operation
    
    const customer = await this.prisma.account.create({
      data: {
        name: data.name,
        email: data.email,
        tenant_id: tenantId, // Should come from authenticated JWT, not parameter
        status: 'active',
      },
    });

    // VIOLATION: Console.log instead of structured logging
    console.log('Customer created:', customer.id);
    console.log('Tenant ID:', tenantId); // VIOLATION: Logging tenant_id

    // VIOLATION: Hardcoded date
    const createdDate = new Date('2023-01-01'); // Should use system date injection

    return customer;
  }

  // VIOLATION: Missing tenant_id filter - exposes cross-tenant data
  async getCustomerOrders(customerId: string) {
    // VIOLATION: No tenant_id filter - could return orders from other tenants
    return this.prisma.workOrder.findMany({
      where: {
        account_id: customerId,
        // Missing: tenant_id filter
      },
    });
  }

  // VIOLATION: Missing tenant_id filter
  // VIOLATION: No transaction for multi-step operation
  async updateCustomerStatus(customerId: string, status: string) {
    // VIOLATION: No tenant_id verification
    // VIOLATION: No transaction
    const customer = await this.prisma.account.update({
      where: { id: customerId }, // Missing tenant_id check
      data: { status },
    });

    // VIOLATION: Console.log instead of structured logging
    console.log(`Updated customer ${customerId} to status ${status}`);
    
    // VIOLATION: Exposing tenant_id in error message (if error occurs)
    if (!customer) {
      throw new Error(`Customer ${customerId} not found for tenant ${customer.tenant_id}`);
    }

    return customer;
  }

  // VIOLATION: Missing tenant_id filter
  async logStatusChange(customerId: string, status: string) {
    // VIOLATION: No tenant_id filter
    await this.prisma.auditLog.create({
      data: {
        resource_type: 'customer',
        resource_id: customerId,
        action: 'status_change',
        after_state: { status },
        request_id: '00000000-0000-0000-0000-000000000000', // VIOLATION: Hardcoded request_id
        tenant_id: '00000000-0000-0000-0000-000000000000', // VIOLATION: Hardcoded tenant_id (should come from context)
      },
    });
  }

  // VIOLATION: Missing tenant_id filter
  async notifyCustomer(customerId: string) {
    // VIOLATION: Query without tenant_id filter
    const customer = await this.prisma.account.findUnique({
      where: { id: customerId }, // Missing tenant_id
    });

    // VIOLATION: Console.log instead of structured logging
    console.log('Sending notification to:', customer?.email);
    
    // VIOLATION: Hardcoded secret usage
    const apiKey = this.API_KEY; // Should come from environment variable
    
    // Simulate notification
    return { notified: true };
  }

  // VIOLATION: N+1 query pattern
  async getCustomersWithOrders() {
    const customers = await this.prisma.account.findMany({
      // Missing tenant_id filter
    });

    // VIOLATION: N+1 queries - querying in loop
    const customersWithOrders = await Promise.all(
      customers.map(async (customer) => {
        const orders = await this.prisma.workOrder.findMany({
          where: { account_id: customer.id }, // Missing tenant_id
        });
        return { ...customer, orders };
      }),
    );

    return customersWithOrders;
  }

  // VIOLATION: SQL injection risk (if using raw SQL)
  async searchCustomers(searchTerm: string) {
    // VIOLATION: No input validation
    // VIOLATION: Missing tenant_id filter
    // Note: Prisma protects against SQL injection, but this shows the pattern
    return this.prisma.account.findMany({
      where: {
        name: {
          contains: searchTerm, // Should validate searchTerm
        },
        // Missing: tenant_id filter
      },
    });
  }
}

