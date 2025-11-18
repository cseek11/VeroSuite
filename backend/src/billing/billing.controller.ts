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
  BadRequestException,
  NotFoundException,
  Res,
  Header
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BillingService } from './billing.service';
import { InvoicePdfService } from './invoice-pdf.service';
import { OverdueAlertsService } from './overdue-alerts.service';
import { FinancialReportsService } from './financial-reports.service';
import { StructuredLoggerService } from '../common/services/logger.service';
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
  constructor(
    private readonly billingService: BillingService,
    private readonly invoicePdfService: InvoicePdfService,
    private readonly overdueAlertsService: OverdueAlertsService,
    private readonly financialReportsService: FinancialReportsService,
    private readonly structuredLogger: StructuredLoggerService,
  ) {}

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
  // PDF GENERATION ENDPOINTS
  // ============================================================================

  @Get('invoices/:id/pdf')
  @ApiOperation({ summary: 'Download invoice as PDF' })
  @ApiResponse({ status: 200, description: 'PDF generated successfully', content: { 'application/pdf': {} } })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Header('Content-Type', 'application/pdf')
  async downloadInvoicePdf(
    @Param('id') invoiceId: string,
    @Request() req: any,
    @Res() res: Response
  ) {
    try {
      const pdfBuffer = await this.invoicePdfService.generateInvoicePdf(
        invoiceId,
        req.user?.tenantId
      );

      // Get invoice for filename
      const invoice = await this.billingService.getInvoiceById(invoiceId);
      const filename = `Invoice-${invoice.invoice_number}.pdf`;

      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', pdfBuffer.length.toString());
      res.send(pdfBuffer);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Failed to generate PDF: ${(error as Error).message}`);
    }
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

  // ============================================================================
  // OVERDUE ALERTS ENDPOINTS
  // ============================================================================

  @Post('overdue-alerts/process')
  @ApiOperation({ summary: 'Process overdue alerts for all overdue invoices' })
  @ApiResponse({ status: 200, description: 'Overdue alerts processed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async processOverdueAlerts(@Request() req: any) {
    // Extract trace context from request headers if available
    const requestId = req.headers['x-request-id'] || req.id || undefined;
    const traceId = req.headers['x-trace-id'] || undefined;
    const spanId = req.headers['x-span-id'] || undefined;

    // Set request context for structured logging
    if (requestId) {
      this.structuredLogger.setRequestContext(requestId, {
        traceId,
        spanId,
        requestId,
        userId: req.user?.userId,
        tenantId: req.user?.tenantId,
        operation: 'processOverdueAlerts',
      });
    }

    return this.overdueAlertsService.processOverdueAlerts(
      req.user.tenantId,
      undefined,
      req.user.userId,
      requestId
    );
  }

  @Get('overdue-alerts/statistics')
  @ApiOperation({ summary: 'Get overdue alert statistics' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date for statistics' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date for statistics' })
  @ApiResponse({ status: 200, description: 'Alert statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAlertStatistics(
    @Request() req: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    // Extract trace context from request headers if available
    const requestId = req.headers['x-request-id'] || req.id || undefined;
    const traceId = req.headers['x-trace-id'] || undefined;
    const spanId = req.headers['x-span-id'] || undefined;

    // Set request context for structured logging
    if (requestId) {
      this.structuredLogger.setRequestContext(requestId, {
        traceId,
        spanId,
        requestId,
        userId: req.user?.userId,
        tenantId: req.user?.tenantId,
        operation: 'getAlertStatistics',
      });
    }

    return this.overdueAlertsService.getAlertStatistics(
      req.user.tenantId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      requestId
    );
  }

  // ============================================================================
  // FINANCIAL REPORTS ENDPOINTS
  // ============================================================================

  @Get('reports/pl')
  @ApiOperation({ summary: 'Generate Profit & Loss (P&L) Report' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date for P&L report (ISO 8601 format: YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date for P&L report (ISO 8601 format: YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'P&L report generated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid date format or range' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generatePLReport(
    @Request() req: any,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string
  ) {
    // Extract trace context from request headers if available
    const requestId = req.headers['x-request-id'] || req.id || undefined;
    const traceId = req.headers['x-trace-id'] || undefined;
    const spanId = req.headers['x-span-id'] || undefined;

    // Set request context for structured logging
    if (requestId) {
      this.structuredLogger.setRequestContext(requestId, {
        traceId,
        spanId,
        requestId,
        userId: req.user?.userId,
        tenantId: req.user?.tenantId,
        operation: 'generatePLReport',
      });
    }

    return this.financialReportsService.generatePLReport(
      req.user.tenantId,
      startDate,
      endDate,
      requestId
    );
  }

  @Get('reports/ar-aging')
  @ApiOperation({ summary: 'Generate AR Aging Report' })
  @ApiQuery({ name: 'asOfDate', required: false, description: 'As of date for AR aging report (ISO 8601 format: YYYY-MM-DD, defaults to today)' })
  @ApiResponse({ status: 200, description: 'AR aging report generated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - invalid date format' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generateARAgingReport(
    @Request() req: any,
    @Query('asOfDate') asOfDate?: string
  ) {
    // Extract trace context from request headers if available
    const requestId = req.headers['x-request-id'] || req.id || undefined;
    const traceId = req.headers['x-trace-id'] || undefined;
    const spanId = req.headers['x-span-id'] || undefined;

    // Set request context for structured logging
    if (requestId) {
      this.structuredLogger.setRequestContext(requestId, {
        traceId,
        spanId,
        requestId,
        userId: req.user?.userId,
        tenantId: req.user?.tenantId,
        operation: 'generateARAgingReport',
      });
    }

    return this.financialReportsService.generateARAgingReport(
      req.user.tenantId,
      asOfDate,
      requestId
    );
  }

    // ============================================================================
    // INVOICE TEMPLATE ENDPOINTS
    // ============================================================================

    @Get('invoice-templates')
    @ApiOperation({ summary: 'Get all invoice templates' })
    @ApiResponse({ status: 200, description: 'Invoice templates retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getInvoiceTemplates(@Request() req: any) {
      const tenantId = req.user?.tenantId || req.tenantId;
      return this.billingService.getInvoiceTemplates(tenantId);
    }

    @Post('invoice-templates')
    @ApiOperation({ summary: 'Create a new invoice template' })
    @ApiResponse({ status: 201, description: 'Invoice template created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createInvoiceTemplate(
      @Body() createTemplateDto: any,
      @Request() req: any
    ) {
      const tenantId = req.user?.tenantId || req.tenantId;
      return this.billingService.createInvoiceTemplate(createTemplateDto, req.user.userId, tenantId);
    }

    @Put('invoice-templates/:id')
    @ApiOperation({ summary: 'Update invoice template' })
    @ApiResponse({ status: 200, description: 'Invoice template updated successfully' })
    @ApiResponse({ status: 404, description: 'Invoice template not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async updateInvoiceTemplate(
      @Param('id') id: string,
      @Body() updateTemplateDto: any,
      @Request() req: any
    ) {
      return this.billingService.updateInvoiceTemplate(id, updateTemplateDto, req.user.userId);
    }

    @Delete('invoice-templates/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete invoice template' })
    @ApiResponse({ status: 204, description: 'Invoice template deleted successfully' })
    @ApiResponse({ status: 404, description: 'Invoice template not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async deleteInvoiceTemplate(@Param('id') id: string) {
      return this.billingService.deleteInvoiceTemplate(id);
    }

    // ============================================================================
    // INVOICE SCHEDULE ENDPOINTS
    // ============================================================================

    @Get('invoice-schedules')
    @ApiOperation({ summary: 'Get all invoice schedules' })
    @ApiResponse({ status: 200, description: 'Invoice schedules retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getInvoiceSchedules(@Request() req: any) {
      const tenantId = req.user?.tenantId || req.tenantId;
      return this.billingService.getInvoiceSchedules(tenantId);
    }

    @Post('invoice-schedules')
    @ApiOperation({ summary: 'Create a new invoice schedule' })
    @ApiResponse({ status: 201, description: 'Invoice schedule created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async createInvoiceSchedule(
      @Body() createScheduleDto: any,
      @Request() req: any
    ) {
      const tenantId = req.user?.tenantId || req.tenantId;
      return this.billingService.createInvoiceSchedule(createScheduleDto, req.user.userId, tenantId);
    }

    @Put('invoice-schedules/:id')
    @ApiOperation({ summary: 'Update invoice schedule' })
    @ApiResponse({ status: 200, description: 'Invoice schedule updated successfully' })
    @ApiResponse({ status: 404, description: 'Invoice schedule not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async updateInvoiceSchedule(
      @Param('id') id: string,
      @Body() updateScheduleDto: any,
      @Request() req: any
    ) {
      return this.billingService.updateInvoiceSchedule(id, updateScheduleDto, req.user.userId);
    }

    @Delete('invoice-schedules/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete invoice schedule' })
    @ApiResponse({ status: 204, description: 'Invoice schedule deleted successfully' })
    @ApiResponse({ status: 404, description: 'Invoice schedule not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async deleteInvoiceSchedule(@Param('id') id: string) {
      return this.billingService.deleteInvoiceSchedule(id);
    }

    @Post('invoice-schedules/:id/toggle')
    @ApiOperation({ summary: 'Toggle invoice schedule active status' })
    @ApiResponse({ status: 200, description: 'Invoice schedule toggled successfully' })
    @ApiResponse({ status: 404, description: 'Invoice schedule not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async toggleInvoiceSchedule(
      @Param('id') id: string,
      @Request() req: any
    ) {
      return this.billingService.toggleInvoiceSchedule(id, req.user.userId);
    }

    // ============================================================================
    // REMINDER HISTORY ENDPOINTS
    // ============================================================================

    @Get('reminder-history')
    @ApiOperation({ summary: 'Get reminder history' })
    @ApiResponse({ status: 200, description: 'Reminder history retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getReminderHistory(@Request() req: any) {
      const tenantId = req.user?.tenantId || req.tenantId;
      return this.billingService.getReminderHistory(tenantId);
    }
  }
