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
  HttpStatus
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
  InvoiceStatus
} from './dto';

@ApiTags('Billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/billing')
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
    return this.billingService.createInvoice(createInvoiceDto, req.user.userId);
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
    return this.billingService.getInvoices(accountId, status, req.user.tenantId);
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
  async getPaymentMethods(@Query('accountId') accountId?: string): Promise<PaymentMethodResponseDto[]> {
    return this.billingService.getPaymentMethods(accountId);
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
    @Query('startDate') _startDate?: string,
    @Query('endDate') _endDate?: string
  ) {
    // This would return revenue trends, monthly breakdowns, etc.
    // For now, return a placeholder response
    return {
      monthlyRevenue: [],
      totalRevenue: 0,
      growthRate: 0,
    };
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
}
