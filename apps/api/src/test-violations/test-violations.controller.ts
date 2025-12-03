import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TestViolationsService } from './test-violations.service';

/**
 * TEST FILE - This file intentionally violates multiple rules to test the auto-enforcer
 * DO NOT USE IN PRODUCTION
 * Last modified: 2025-12-02 - Testing enforcer detection
 */
@Controller('test-violations')
export class TestViolationsController {
  constructor(private readonly testService: TestViolationsService) {}

  // VIOLATION: No authentication guards
  // VIOLATION: No DTO validation
  // VIOLATION: Business logic in controller
  @Get('customers')
  async getCustomers(@Query('tenant_id') tenantId: string) {
    // VIOLATION: Trusting client-provided tenant_id from query params
    // VIOLATION: Business logic in controller (should be in service)
    const customers = await this.testService.findAllCustomers(tenantId);
    
    // VIOLATION: Business logic - filtering in controller
    return customers.filter(c => c.status === 'active');
  }

  // VIOLATION: No authentication guards
  // VIOLATION: No DTO validation
  // VIOLATION: Business logic in controller
  @Post('customers')
  async createCustomer(@Body() data: any) {
    // VIOLATION: Using 'any' type instead of DTO
    // VIOLATION: No input validation
    // VIOLATION: Trusting client-provided tenant_id
    const tenantId = data.tenant_id; // Should come from JWT, not body
    
    // VIOLATION: Business logic in controller
    if (data.email && !data.email.includes('@')) {
      throw new Error('Invalid email');
    }
    
    return this.testService.createCustomer(data, tenantId);
  }

  // VIOLATION: No authentication guards
  // VIOLATION: No DTO validation
  @Get('customers/:id/orders')
  async getCustomerOrders(@Param('id') customerId: string) {
    // VIOLATION: No tenant_id filter - could expose cross-tenant data
    return this.testService.getCustomerOrders(customerId);
  }

  // VIOLATION: No authentication guards
  // VIOLATION: No DTO validation
  @Post('customers/:id/update-status')
  async updateCustomerStatus(
    @Param('id') customerId: string,
    @Body() body: any,
  ) {
    // VIOLATION: Multi-step operation without transaction
    // VIOLATION: No tenant_id verification
    await this.testService.updateCustomerStatus(customerId, body.status);
    await this.testService.logStatusChange(customerId, body.status);
    await this.testService.notifyCustomer(customerId);
    
    return { success: true };
  }
}

