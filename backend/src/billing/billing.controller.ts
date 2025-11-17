import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BillingService } from './billing.service';
import { 
  CreateInvoiceDto, 
  UpdateInvoiceDto, 
  InvoiceResponseDto,
  CreatePaymentDto,
  PaymentResponseDto,
  CreatePaymentMethodDto,
  PaymentMethodResponseDto,
  SendReminderDto,
  InvoiceStatus
} from './dto';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'billing', version: '1' })
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  // ============================================================================
  // INVOICE ENDPOINTS
  // ============================================================================

  @Post('invoices')
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully', type: InvoiceResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createInvoice(
    @Body() createInvoiceDto: CreateInvoiceDto,
    @Request() req: any
  ): Promise<InvoiceResponseDto> {
    // Pass both user ID and tenant ID from the JWT token
    const tenantId = req.user?.tenantId || req.tenantId;
    return this.billingService.createInvoice(createInvoiceDto, req.user.userId, tenantId);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiQuery({ name: 'accountId', required: false, description: 'Filter by account ID' })
  @ApiQuery({ name: 'status', required: false, enum: InvoiceStatus, description: 'Filter by invoice status' })
  @ApiResponse({ status: 200, description: 'Invoices retrieved successfully', type: [InvoiceResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getInvoices(
    @Request() req: any,
    @Query('accountId') accountId?: string,
    @Query('status') status?: InvoiceStatus
  ): Promise<InvoiceResponseDto[]> {
    // Get tenantId from req.user (set by JWT guard) or req.tenantId (set by middleware)
    const tenantId = req.user?.tenantId || req.tenantId;
    if (!tenantId) {
      throw new BadRequestException('Tenant ID not found in request. Please ensure you are authenticated.');
    }
    return this.billingService.getInvoices(accountId, status, tenantId);
  }

  @Get('invoices/:id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved successfully', type: InvoiceResponseDto })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getInvoiceById(@Param('id') id: string): Promise<InvoiceResponseDto> {
    return this.billingService.getInvoiceById(id);
  }

  @Put('invoices/:id')
  @ApiOperation({ summary: 'Update invoice' })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully', type: InvoiceResponseDto })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateInvoice(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @Request() req: any
  ): Promise<InvoiceResponseDto> {
    return this.billingService.updateInvoice(id, updateInvoiceDto, req.user.userId);
  }

  @Delete('invoices/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete invoice' })
  @ApiResponse({ status: 204, description: 'Invoice deleted successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteInvoice(@Param('id') id: string): Promise<void> {
    return this.billingService.deleteInvoice(id);
  }

  // ============================================================================
  // PAYMENT ENDPOINTS
  // ============================================================================

  @Post('invoices/:id/pay')
  @ApiOperation({ summary: 'Process payment for invoice' })
  @ApiResponse({ status: 201, description: 'Payment processed successfully', type: PaymentResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Invoice or payment method not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async processPayment(
    @Param('id') invoiceId: string,
    @Body() createPaymentDto: CreatePaymentDto,
    @Request() req: any
  ): Promise<PaymentResponseDto> {
    // Override invoice_id from URL parameter
    createPaymentDto.invoice_id = invoiceId;
    return this.billingService.createPayment(createPaymentDto, req.user.userId);
  }

  @Get('payments')
  @ApiOperation({ summary: 'Get all payments' })
  @ApiQuery({ name: 'invoiceId', required: false, description: 'Filter by invoice ID' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully', type: [PaymentResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPayments(
    @Request() req: any,
    @Query('invoiceId') invoiceId?: string
  ): Promise<PaymentResponseDto[]> {
    return this.billingService.getPayments(invoiceId, req.user.tenantId);
  }

  // ============================================================================
  // PAYMENT METHOD ENDPOINTS
  // ============================================================================

  @Post('payment-methods')
  @ApiOperation({ summary: 'Create a new payment method' })
  @ApiResponse({ status: 201, description: 'Payment method created successfully', type: PaymentMethodResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createPaymentMethod(
    @Body() createPaymentMethodDto: CreatePaymentMethodDto
  ): Promise<PaymentMethodResponseDto> {
    return this.billingService.createPaymentMethod(createPaymentMethodDto);
  }

  @Get('payment-methods')
  @ApiOperation({ summary: 'Get all payment methods' })
  @ApiQuery({ name: 'accountId', required: false, description: 'Filter by account ID' })
  @ApiResponse({ status: 200, description: 'Payment methods retrieved successfully', type: [PaymentMethodResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPaymentMethods(
    @Request() req: any,
    @Query('accountId') accountId?: string
  ): Promise<PaymentMethodResponseDto[]> {
    // Get tenantId from req.user (set by JWT guard) or req.tenantId (set by middleware)
    const tenantId = req.user?.tenantId || req.tenantId;
    if (!tenantId) {
      throw new BadRequestException('Tenant ID not found in request. Please ensure you are authenticated.');
    }
    return this.billingService.getPaymentMethods(accountId, tenantId);
  }

  @Delete('payment-methods/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete payment method' })
  @ApiResponse({ status: 204, description: 'Payment method deleted successfully' })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deletePaymentMethod(@Param('id') id: string): Promise<void> {
    return this.billingService.deletePaymentMethod(id);
  }

  // ============================================================================
  // BILLING ANALYTICS ENDPOINTS
  // ============================================================================

  @Get('analytics/overview')
  @ApiOperation({ summary: 'Get billing analytics overview' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getBillingAnalytics(@Request() req: any) {
    return this.billingService.getBillingAnalytics(req.user.tenantId);
  }

  @Get('analytics/revenue')
  @ApiOperation({ summary: 'Get revenue analytics' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for revenue analysis' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for revenue analysis' })
  @ApiResponse({ status: 200, description: 'Revenue analytics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRevenueAnalytics(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.billingService.getRevenueAnalytics(req.user.tenantId, startDate, endDate);
  }

  @Get('analytics/payments')
  @ApiOperation({ summary: 'Get payment analytics' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for payment analysis' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for payment analysis' })
  @ApiResponse({ status: 200, description: 'Payment analytics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPaymentAnalytics(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.billingService.getPaymentAnalytics(req.user.tenantId, startDate, endDate);
  }

  // ============================================================================
  // STRIPE PAYMENT ENDPOINTS
  // ============================================================================

  @Post('invoices/:id/stripe-payment-intent')
  @ApiOperation({ summary: 'Create Stripe payment intent for invoice' })
  @ApiResponse({ status: 201, description: 'Payment intent created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createStripePaymentIntent(
    @Param('id') invoiceId: string,
    @Request() req: any
  ) {
    return this.billingService.createStripePaymentIntent(invoiceId, req.user.userId);
  }

  @Get('stripe/payment-status/:paymentIntentId')
  @ApiOperation({ summary: 'Get Stripe payment status' })
  @ApiResponse({ status: 200, description: 'Payment status retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStripePaymentStatus(@Param('paymentIntentId') paymentIntentId: string) {
    return this.billingService.getStripePaymentStatus(paymentIntentId);
  }

  @Post('invoices/:id/retry-payment')
  @ApiOperation({ summary: 'Retry failed payment for invoice' })
  @ApiResponse({ status: 200, description: 'Payment retry initiated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async retryFailedPayment(
    @Param('id') invoiceId: string,
    @Request() req: any
  ) {
    return this.billingService.retryFailedPayment(invoiceId, req.user.userId);
  }

  @Get('invoices/:id/payment-retry-history')
  @ApiOperation({ summary: 'Get payment retry history for invoice' })
  @ApiResponse({ status: 200, description: 'Payment retry history retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPaymentRetryHistory(@Param('id') invoiceId: string) {
    return this.billingService.getPaymentRetryHistory(invoiceId);
  }

  // ============================================================================
  // RECURRING PAYMENT ENDPOINTS
  // ============================================================================

  @Post('invoices/:id/recurring-payment')
  @ApiOperation({ summary: 'Create recurring payment for invoice' })
  @ApiResponse({ status: 201, description: 'Recurring payment created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createRecurringPayment(
    @Param('id') invoiceId: string,
    @Body() createRecurringPaymentDto: any,
    @Request() req: any
  ) {
    return this.billingService.createRecurringPayment(
      { ...createRecurringPaymentDto, invoice_id: invoiceId },
      req.user.userId
    );
  }

  @Get('recurring-payments/:subscriptionId')
  @ApiOperation({ summary: 'Get recurring payment by subscription ID' })
  @ApiResponse({ status: 200, description: 'Recurring payment retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRecurringPayment(@Param('subscriptionId') subscriptionId: string) {
    return this.billingService.getRecurringPayment(subscriptionId);
  }

  @Post('recurring-payments/:subscriptionId/cancel')
  @ApiOperation({ summary: 'Cancel recurring payment' })
  @ApiResponse({ status: 200, description: 'Recurring payment canceled successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async cancelRecurringPayment(
    @Param('subscriptionId') subscriptionId: string,
    @Body() body: { immediately?: boolean }
  ) {
    return this.billingService.cancelRecurringPayment(subscriptionId, body.immediately || false);
  }

  // ============================================================================
  // AR MANAGEMENT ENDPOINTS
  // ============================================================================

  @Get('ar-summary')
  @ApiOperation({ summary: 'Get AR summary with aging buckets' })
  @ApiResponse({ status: 200, description: 'AR summary retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getARSummary(@Request() req: any) {
    return this.billingService.getARSummary(req.user.tenantId);
  }

  @Get('overdue-invoices')
  @ApiOperation({ summary: 'Get overdue invoices' })
  @ApiResponse({ status: 200, description: 'Overdue invoices retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOverdueInvoices(@Request() req: any) {
    return this.billingService.getOverdueInvoices(req.user.tenantId);
  }

  @Get('payment-tracking')
  @ApiOperation({ summary: 'Get payment tracking data' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for payment tracking' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for payment tracking' })
  @ApiResponse({ status: 200, description: 'Payment tracking data retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPaymentTracking(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return this.billingService.getPaymentTracking(req.user.tenantId, startDate, endDate);
  }

  // ============================================================================
  // REMINDER ENDPOINTS
  // ============================================================================

  @Post('invoices/send-reminder')
  @ApiOperation({ summary: 'Send reminder for overdue invoice(s)' })
  @ApiResponse({ status: 200, description: 'Reminders sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sendInvoiceReminder(
    @Body() sendReminderDto: SendReminderDto,
    @Request() req: any
  ) {
    // Extract invoice IDs from DTO
    const invoiceIds: string[] = [];
    if (sendReminderDto.invoice_id) {
      invoiceIds.push(sendReminderDto.invoice_id);
    }
    if (sendReminderDto.invoice_ids && sendReminderDto.invoice_ids.length > 0) {
      invoiceIds.push(...sendReminderDto.invoice_ids);
    }

    if (invoiceIds.length === 0) {
      throw new BadRequestException('At least one invoice ID is required');
    }

    return this.billingService.sendInvoiceReminder(
      invoiceIds,
      req.user.userId,
      sendReminderDto.message
    );
  }
}
