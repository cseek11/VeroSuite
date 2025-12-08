import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../common/services/database.service';
import { StripeService } from './stripe.service';
import { EmailService } from '../common/services/email.service';
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

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly stripeService: StripeService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  // ============================================================================
  // INVOICE MANAGEMENT
  // ============================================================================

  async createInvoice(createInvoiceDto: CreateInvoiceDto, userId: string, tenantId?: string): Promise<InvoiceResponseDto> {
    this.logger.log(`Creating invoice for account ${createInvoiceDto.account_id}`);
    this.logger.log(`User ID: ${userId}`);
    this.logger.log(`Tenant ID parameter: ${tenantId}`);

    try {
      // Generate invoice number if not provided
      const invoiceNumber = createInvoiceDto.invoice_number || await this.generateInvoiceNumber(tenantId);

      // Calculate totals
      const subtotal = createInvoiceDto.items.reduce((sum, item) => {
        return sum + (item.quantity * item.unit_price);
      }, 0);

      // For now, we'll use 0% tax - this can be made configurable later
      const taxAmount = 0;
      const totalAmount = subtotal + taxAmount;

      // Use provided tenant ID or try to get from context
      let finalTenantId = tenantId;
      if (!finalTenantId) {
        try {
          finalTenantId = await this.getCurrentTenantId();
          this.logger.log(`✅ Got tenant_id from context: ${finalTenantId}`);
        } catch (error: any) {
          this.logger.error(`❌ Failed to get tenant_id from context: ${error?.message || error}`);
          throw new BadRequestException('Tenant context not found');
        }
      } else {
        this.logger.log(`✅ Using provided tenant_id: ${finalTenantId}`);
      }
      
      this.logger.log(`Creating invoice with tenant_id: ${finalTenantId}`);
      this.logger.log(`Invoice data: ${JSON.stringify({
        account_id: createInvoiceDto.account_id,
        items: createInvoiceDto.items
      })}`);

      // Create invoice
      const invoice = await this.databaseService.invoice.create({
        data: {
          tenant_id: finalTenantId,
          account_id: createInvoiceDto.account_id,
          service_agreement_id: createInvoiceDto.service_agreement_id || null,
          work_order_id: createInvoiceDto.work_order_id || null,
          job_id: createInvoiceDto.job_id || null,
          invoice_number: invoiceNumber,
          status: InvoiceStatus.DRAFT,
          issue_date: new Date(createInvoiceDto.issue_date),
          due_date: new Date(createInvoiceDto.due_date),
          subtotal,
          tax_amount: taxAmount,
          total_amount: totalAmount,
          notes: createInvoiceDto.notes || null,
          created_by: userId,
          updated_by: userId,
          updated_at: new Date(),
          InvoiceItem: {
            create: createInvoiceDto.items.map(item => ({
              service_type_id: item.service_type_id,
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unit_price,
              total_price: item.quantity * item.unit_price,
            }))
          }
        },
        include: {
          InvoiceItem: true,
          account: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              city: true,
              state: true,
              zip_code: true,
              account_type: true,
            }
          },
          Payment: {
            include: {
              payment_methods: {
                select: {
                  payment_type: true,
                  payment_name: true,
                }
              }
            }
          }
        }
      });

      this.logger.log(`Invoice created successfully: ${invoice.id}`);
      return invoice as unknown as InvoiceResponseDto;
    } catch (error: any) {
      this.logger.error(`Failed to create invoice: ${error?.message || error}`, error?.stack);
      
      // Provide more specific error details based on Prisma error codes
      if (error?.code === 'P2002') {
        throw new BadRequestException('Duplicate invoice number or constraint violation');
      } else if (error?.code === 'P2003') {
        throw new BadRequestException('Invalid reference - customer or service type not found');
      } else if (error?.code === 'P2025') {
        throw new BadRequestException('Required record not found');
      } else {
        throw new BadRequestException(`Failed to create invoice: ${error?.message || 'Unknown error'}`);
      }
    }
  }

  async getInvoices(accountId?: string, status?: InvoiceStatus, tenantId?: string): Promise<InvoiceResponseDto[]> {
    // Log raw parameters for debugging
    this.logger.log(`[getInvoices] Raw accountId: ${JSON.stringify(accountId)}, status: ${status}, tenantId: ${tenantId ? 'provided' : 'missing'}`);
    
    try {
      // Require tenantId - it should be provided by the controller from req.user.tenantId
      if (!tenantId) {
        this.logger.error('Tenant ID is required but not provided to getInvoices');
        throw new BadRequestException('Tenant ID is required but not found. Please ensure you are authenticated.');
      }

      // Validate and clean accountId format if provided (must be valid UUID)
      let cleanedAccountId: string | undefined = accountId;
      if (accountId) {
        // Trim whitespace and remove any unexpected characters
        cleanedAccountId = accountId.trim();
        
        // Remove common formatting issues (colons, braces, etc.)
        cleanedAccountId = cleanedAccountId.replace(/^[:{]+|}+$/g, '');
        
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(cleanedAccountId)) {
          this.logger.warn(`[getInvoices] Invalid accountId format after cleaning: ${cleanedAccountId}. Skipping account filter.`);
          // Don't throw error, just skip the account filter
          cleanedAccountId = undefined;
        } else {
          this.logger.log(`[getInvoices] Valid accountId: ${cleanedAccountId}`);
        }
      }
      
      this.logger.log(`Fetching invoices${cleanedAccountId ? ` for account ${cleanedAccountId}` : ''}${status ? ` with status ${status}` : ''}`);

      const where: any = {
        tenant_id: tenantId,
      };

      if (cleanedAccountId) {
        where.account_id = cleanedAccountId;
      }

      if (status) {
        where.status = status;
      }

      const invoices = await this.databaseService.invoice.findMany({
        where,
        include: {
          InvoiceItem: true,
          account: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              city: true,
              state: true,
              zip_code: true,
              account_type: true,
            }
          },
          Payment: {
            include: {
              payment_methods: {
                select: {
                  payment_type: true,
                  payment_name: true,
                }
              }
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      return invoices as unknown as InvoiceResponseDto[];
    } catch (error) {
      this.logger.error(`Failed to fetch invoices: ${(error as Error).message}`, (error as Error).stack);
      const errorMessage = (error as Error).message || 'Unknown error';
      this.logger.error(`Failed to fetch invoices: ${errorMessage}`, (error as Error).stack);
      this.logger.error(`Error details: ${JSON.stringify(error)}`);
      throw new BadRequestException(`Failed to fetch invoices: ${errorMessage}`);
    }
  }

  async getInvoiceById(id: string): Promise<InvoiceResponseDto> {
    this.logger.log(`Fetching invoice ${id}`);

    try {
      const invoice = await this.databaseService.invoice.findFirst({
        where: {
          id,
          tenant_id: await this.getCurrentTenantId(),
        },
        include: {
          InvoiceItem: true,
          account: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              city: true,
              state: true,
              zip_code: true,
              account_type: true,
            }
          },
          Payment: {
            include: {
              payment_methods: {
                select: {
                  payment_type: true,
                  payment_name: true,
                }
              }
            }
          }
        }
      });

      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }

      return invoice as unknown as InvoiceResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch invoice ${id}: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to fetch invoice');
    }
  }

  async updateInvoice(id: string, updateInvoiceDto: UpdateInvoiceDto, userId: string): Promise<InvoiceResponseDto> {
    this.logger.log(`Updating invoice ${id}`);

    try {
      // Check if invoice exists and belongs to tenant
      const existingInvoice = await this.databaseService.invoice.findFirst({
        where: {
          id,
          tenant_id: await this.getCurrentTenantId(),
        }
      });

      if (!existingInvoice) {
        throw new NotFoundException('Invoice not found');
      }

      const updateData: any = {
        updated_by: userId,
      };

      if (updateInvoiceDto.status) {
        updateData.status = updateInvoiceDto.status;
      }
      if (updateInvoiceDto.issue_date) {
        updateData.issue_date = new Date(updateInvoiceDto.issue_date);
      }
      if (updateInvoiceDto.due_date) {
        updateData.due_date = new Date(updateInvoiceDto.due_date);
      }
      if (updateInvoiceDto.notes !== undefined) {
        updateData.notes = updateInvoiceDto.notes;
      }

      const invoice = await this.databaseService.invoice.update({
        where: { id },
        data: updateData,
        include: {
          InvoiceItem: true,
          account: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              city: true,
              state: true,
              zip_code: true,
              account_type: true,
            }
          },
          Payment: {
            include: {
              payment_methods: {
                select: {
                  payment_type: true,
                  payment_name: true,
                }
              }
            }
          }
        }
      });

      this.logger.log(`Invoice updated successfully: ${id}`);
      return invoice as unknown as InvoiceResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to update invoice ${id}: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to update invoice');
    }
  }

  async deleteInvoice(id: string): Promise<void> {
    this.logger.log(`Deleting invoice ${id}`);

    try {
      // Check if invoice exists and belongs to tenant
      const existingInvoice = await this.databaseService.invoice.findFirst({
        where: {
          id,
          tenant_id: await this.getCurrentTenantId(),
        }
      });

      if (!existingInvoice) {
        throw new NotFoundException('Invoice not found');
      }

      await this.databaseService.invoice.delete({
        where: { id }
      });

      this.logger.log(`Invoice deleted successfully: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete invoice ${id}: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to delete invoice');
    }
  }

  // ============================================================================
  // PAYMENT MANAGEMENT
  // ============================================================================

  async createPayment(createPaymentDto: CreatePaymentDto, userId: string): Promise<PaymentResponseDto> {
    this.logger.log(`Creating payment for invoice ${createPaymentDto.invoice_id}`);

    try {
      // Verify invoice exists and belongs to tenant
      const invoice = await this.databaseService.invoice.findFirst({
        where: {
          id: createPaymentDto.invoice_id,
          tenant_id: await this.getCurrentTenantId(),
        }
      });

      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }

      // Verify payment method exists and belongs to tenant
      const paymentMethod = await this.databaseService.paymentMethod.findFirst({
        where: {
          id: createPaymentDto.payment_method_id,
          tenant_id: await this.getCurrentTenantId(),
        }
      });

      if (!paymentMethod) {
        throw new NotFoundException('Payment method not found');
      }

      // Create payment
      const payment = await this.databaseService.payment.create({
        data: {
          tenant_id: await this.getCurrentTenantId(),
          invoice_id: createPaymentDto.invoice_id,
          payment_method_id: createPaymentDto.payment_method_id,
          amount: createPaymentDto.amount,
          payment_date: new Date(createPaymentDto.payment_date),
          reference_number: createPaymentDto.reference_number || null,
          notes: createPaymentDto.notes || null,
          created_by: userId,
        },
        include: {
          payment_methods: true,
          Invoice: {
            select: {
              id: true,
              invoice_number: true,
              total_amount: true,
              status: true,
            }
          }
        }
      });

      // Update invoice status if fully paid
      const totalPaid = await this.getTotalPaidAmount(createPaymentDto.invoice_id);
      if (totalPaid >= Number(invoice.total_amount)) {
        await this.databaseService.invoice.update({
          where: { id: createPaymentDto.invoice_id },
          data: { status: InvoiceStatus.PAID }
        });
      }

      this.logger.log(`Payment created successfully: ${payment.id}`);
      return payment as unknown as PaymentResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to create payment: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to create payment');
    }
  }

  async getPayments(invoiceId?: string, tenantId?: string): Promise<PaymentResponseDto[]> {
    this.logger.log(`Fetching payments${invoiceId ? ` for invoice ${invoiceId}` : ''}`);

    try {
      const where: any = {
        tenant_id: tenantId || await this.getCurrentTenantId(),
      };

      if (invoiceId) {
        where.invoice_id = invoiceId;
      }

      const payments = await this.databaseService.payment.findMany({
        where,
        include: {
          payment_methods: true,
          Invoice: {
            select: {
              id: true,
              invoice_number: true,
              total_amount: true,
              status: true,
            }
          }
        },
        orderBy: {
          payment_date: 'desc'
        }
      });

      return payments as unknown as PaymentResponseDto[];
    } catch (error) {
      this.logger.error(`Failed to fetch payments: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to fetch payments');
    }
  }

  // ============================================================================
  // PAYMENT METHOD MANAGEMENT
  // ============================================================================

  async createPaymentMethod(createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethodResponseDto> {
    this.logger.log(`Creating payment method for account ${createPaymentMethodDto.account_id}`);

    try {
      // If setting as default, unset other default payment methods for this account
      if (createPaymentMethodDto.is_default) {
        await this.databaseService.paymentMethod.updateMany({
          where: {
            tenant_id: await this.getCurrentTenantId(),
            account_id: createPaymentMethodDto.account_id,
            is_default: true,
          },
          data: { is_default: false }
        });
      }

      const paymentMethod = await this.databaseService.paymentMethod.create({
        data: {
          tenant_id: await this.getCurrentTenantId(),
          account_id: createPaymentMethodDto.account_id,
          payment_type: createPaymentMethodDto.payment_type,
          payment_name: createPaymentMethodDto.payment_name || null,
          account_number: createPaymentMethodDto.account_number || null,
          routing_number: createPaymentMethodDto.routing_number || null,
          card_type: createPaymentMethodDto.card_type || null,
          card_last4: createPaymentMethodDto.card_last4 || null,
          card_expiry: createPaymentMethodDto.card_expiry || null,
          is_default: createPaymentMethodDto.is_default || false,
          is_active: createPaymentMethodDto.is_active !== false,
        },
        include: {
          account: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      });

      this.logger.log(`Payment method created successfully: ${paymentMethod.id}`);
      return paymentMethod as unknown as PaymentMethodResponseDto;
    } catch (error) {
      this.logger.error(`Failed to create payment method: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to create payment method');
    }
  }

  async getPaymentMethods(accountId?: string, tenantId?: string): Promise<PaymentMethodResponseDto[]> {
    // Log raw parameters for debugging
    this.logger.log(`[getPaymentMethods] Raw accountId: ${JSON.stringify(accountId)}, tenantId: ${tenantId ? 'provided' : 'missing'}`);

    try {
      // Require tenantId - it should be provided by the controller from req.user.tenantId
      if (!tenantId) {
        this.logger.error('Tenant ID is required but not provided to getPaymentMethods');
        throw new BadRequestException('Tenant ID is required but not found. Please ensure you are authenticated.');
      }

      this.logger.log(`[getPaymentMethods] Using tenantId: ${tenantId}`);

      // Validate and clean accountId format if provided (must be valid UUID)
      let cleanedAccountId: string | undefined = accountId;
      if (accountId) {
        // Trim whitespace and remove any unexpected characters
        cleanedAccountId = accountId.trim();
        
        // Remove common formatting issues (colons, braces, etc.)
        cleanedAccountId = cleanedAccountId.replace(/^[:{]+|}+$/g, '');
        
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(cleanedAccountId)) {
          this.logger.warn(`[getPaymentMethods] Invalid accountId format after cleaning: ${cleanedAccountId}. Skipping account filter.`);
          // Don't throw error, just skip the account filter
          cleanedAccountId = undefined;
        } else {
          this.logger.log(`[getPaymentMethods] Valid accountId: ${cleanedAccountId}`);
        }
      }
      
      this.logger.log(`Fetching payment methods${cleanedAccountId ? ` for account ${cleanedAccountId}` : ''}`);

      const where: any = {
        tenant_id: tenantId,
        is_active: true,
      };

      if (cleanedAccountId) {
        where.account_id = cleanedAccountId;
      }

      const paymentMethods = await this.databaseService.paymentMethod.findMany({
        where,
        include: {
          account: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
        orderBy: [
          { is_default: 'desc' },
          { created_at: 'desc' }
        ]
      });

      return paymentMethods as unknown as PaymentMethodResponseDto[];
    } catch (error) {
      const errorMessage = (error as Error).message || 'Unknown error';
      this.logger.error(`Failed to fetch payment methods: ${errorMessage}`, (error as Error).stack);
      this.logger.error(`Error details: ${JSON.stringify(error)}`);
      throw new BadRequestException(`Failed to fetch payment methods: ${errorMessage}`);
    }
  }

  async deletePaymentMethod(id: string): Promise<void> {
    this.logger.log(`Deleting payment method ${id}`);

    try {
      // Check if payment method exists and belongs to tenant
      const existingPaymentMethod = await this.databaseService.paymentMethod.findFirst({
        where: {
          id,
          tenant_id: await this.getCurrentTenantId(),
        }
      });

      if (!existingPaymentMethod) {
        throw new NotFoundException('Payment method not found');
      }

      await this.databaseService.paymentMethod.delete({
        where: { id }
      });

      this.logger.log(`Payment method deleted successfully: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete payment method ${id}: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to delete payment method');
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private async generateInvoiceNumber(tenantId?: string): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `INV-${currentYear}-`;
    
    // Use provided tenant ID or get from context
    const finalTenantId = tenantId || await this.getCurrentTenantId();
    
    // Get the last invoice number for this year
    const lastInvoice = await this.databaseService.invoice.findFirst({
      where: {
        tenant_id: finalTenantId,
        invoice_number: {
          startsWith: prefix
        }
      },
      orderBy: {
        invoice_number: 'desc'
      }
    });

    let nextNumber = 1;
    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.invoice_number.replace(prefix, ''));
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
  }

  private async getTotalPaidAmount(invoiceId: string): Promise<number> {
    const payments = await this.databaseService.payment.findMany({
      where: {
        invoice_id: invoiceId,
        tenant_id: await this.getCurrentTenantId(),
      }
    });

    return payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  }

  // ============================================================================
  // STRIPE PAYMENT INTEGRATION
  // ============================================================================

  /**
   * Create a Stripe payment intent for an invoice
   */
  async createStripePaymentIntent(invoiceId: string, userId: string) {
    this.logger.log(`Creating Stripe payment intent for invoice ${invoiceId}`);

    try {
      // Validate inputs
      if (!invoiceId || typeof invoiceId !== 'string') {
        throw new BadRequestException('Invalid invoice ID');
      }

      if (!userId || typeof userId !== 'string') {
        throw new BadRequestException('Invalid user ID');
      }

      // Get invoice details
      const invoice = await this.getInvoiceById(invoiceId);
      
      // Validate invoice status - don't allow payment for already paid invoices
      if (invoice.status === InvoiceStatus.PAID) {
        throw new BadRequestException('Invoice is already paid');
      }

      // Validate invoice amount
      const invoiceAmount = Number(invoice.total_amount);
      if (isNaN(invoiceAmount) || invoiceAmount <= 0) {
        throw new BadRequestException('Invalid invoice amount');
      }

      // Get customer details
      const customer = await this.databaseService.account.findFirst({
        where: {
          id: invoice.account_id,
          tenant_id: await this.getCurrentTenantId(),
        }
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      // Validate customer email (recommended for Stripe)
      if (!customer.email || customer.email.trim() === '') {
        this.logger.warn(`Customer ${customer.id} has no email address`);
      }

      // Get tenant ID
      const tenantId = await this.getCurrentTenantId();
      if (!tenantId) {
        throw new BadRequestException('Tenant context not found');
      }

      // Create payment intent
      const paymentIntent = await this.stripeService.createPaymentIntent({
        amount: invoiceAmount,
        currency: 'usd',
        invoiceId: invoice.id,
        customerEmail: customer.email || '',
        customerName: customer.name || '',
        metadata: {
          tenantId: tenantId,
          createdBy: userId,
          invoiceNumber: invoice.invoice_number,
        }
      });

      this.logger.log(`Stripe payment intent created successfully: ${paymentIntent.paymentIntentId} for invoice ${invoiceId}`);
      return paymentIntent;
    } catch (error) {
      // Re-throw known exceptions
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      // Log and wrap unknown errors
      this.logger.error(
        `Failed to create Stripe payment intent for invoice ${invoiceId}: ${(error as Error).message}`,
        (error as Error).stack
      );
      throw new BadRequestException(`Failed to create payment intent: ${(error as Error).message}`);
    }
  }

  /**
   * Create payment record from Stripe webhook
   */
  async createPaymentFromStripe(paymentData: {
    invoice_id: string;
    amount: number;
    payment_date: Date;
    reference_number: string;
    notes: string;
    stripe_payment_intent_id: string;
    stripe_charge_id?: string;
  }) {
    this.logger.log(`Creating payment record from Stripe for invoice ${paymentData.invoice_id}`);

    try {
      // Validate inputs
      if (!paymentData.invoice_id) {
        throw new BadRequestException('Invoice ID is required');
      }

      if (!paymentData.amount || paymentData.amount <= 0) {
        throw new BadRequestException('Invalid payment amount');
      }

      if (!paymentData.stripe_payment_intent_id) {
        throw new BadRequestException('Stripe payment intent ID is required');
      }

      // Get invoice to retrieve account_id
      const invoice = await this.databaseService.invoice.findFirst({
        where: {
          id: paymentData.invoice_id,
          tenant_id: await this.getCurrentTenantId(),
        }
      });

      if (!invoice) {
        throw new NotFoundException(`Invoice ${paymentData.invoice_id} not found`);
      }

      // Check if payment already exists (idempotency check)
      const existingPayment = await this.databaseService.payment.findFirst({
        where: {
          reference_number: paymentData.stripe_payment_intent_id,
          tenant_id: await this.getCurrentTenantId(),
        }
      });

      if (existingPayment) {
        this.logger.warn(`Payment already exists for Stripe payment intent ${paymentData.stripe_payment_intent_id}`);
        return existingPayment;
      }

      // Create a default payment method for Stripe payments
      const stripePaymentMethod = await this.databaseService.paymentMethod.findFirst({
        where: {
          tenant_id: await this.getCurrentTenantId(),
          payment_type: 'STRIPE',
          payment_name: 'Stripe Payment',
        }
      });

      let paymentMethodId: string;
      if (stripePaymentMethod) {
        paymentMethodId = stripePaymentMethod.id;
      } else {
        // Create a default Stripe payment method with correct account_id
        const newPaymentMethod = await this.databaseService.paymentMethod.create({
          data: {
            tenant_id: await this.getCurrentTenantId(),
            account_id: invoice.account_id, // Use account_id from invoice
            payment_type: 'STRIPE',
            payment_name: 'Stripe Payment',
            is_default: false,
            is_active: true,
          }
        });
        paymentMethodId = newPaymentMethod.id;
        this.logger.log(`Created default Stripe payment method: ${paymentMethodId}`);
      }

      // Create payment record
      const payment = await this.databaseService.payment.create({
        data: {
          tenant_id: await this.getCurrentTenantId(),
          invoice_id: paymentData.invoice_id,
          payment_method_id: paymentMethodId,
          amount: paymentData.amount,
          payment_date: paymentData.payment_date,
          reference_number: paymentData.stripe_payment_intent_id, // Use payment intent ID as reference
          notes: paymentData.notes || `Stripe payment: ${paymentData.stripe_payment_intent_id}`,
          created_by: 'system', // System created from webhook
        }
      });

      this.logger.log(`Payment record created from Stripe: ${payment.id} for invoice ${paymentData.invoice_id}`);

      // Update invoice status if fully paid
      const totalPaid = await this.getTotalPaidAmount(paymentData.invoice_id);
      const invoiceTotal = Number(invoice.total_amount);
      
      this.logger.log(`Payment status check - Total paid: ${totalPaid}, Invoice total: ${invoiceTotal}`);

      if (totalPaid >= invoiceTotal) {
        await this.databaseService.invoice.update({
          where: { id: paymentData.invoice_id },
          data: { 
            status: InvoiceStatus.PAID,
            updated_at: new Date(),
          }
        });
        this.logger.log(`Invoice ${paymentData.invoice_id} marked as paid (${totalPaid} >= ${invoiceTotal})`);
      } else {
        // Update to partially paid if applicable
        const partialAmount = totalPaid / invoiceTotal;
        this.logger.log(`Invoice ${paymentData.invoice_id} partially paid: ${(partialAmount * 100).toFixed(2)}%`);
      }

      return payment;
    } catch (error) {
      // Re-throw known exceptions
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error(
        `Failed to create payment from Stripe for invoice ${paymentData.invoice_id}: ${(error as Error).message}`,
        (error as Error).stack
      );
      throw new BadRequestException(`Failed to create payment record: ${(error as Error).message}`);
    }
  }

  /**
   * Get Stripe payment status
   */
  async getStripePaymentStatus(paymentIntentId: string) {
    this.logger.log(`Getting Stripe payment status: ${paymentIntentId}`);

    try {
      const paymentIntent = await this.stripeService.getPaymentIntent(paymentIntentId);
      return {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
        created: new Date(paymentIntent.created * 1000),
        metadata: paymentIntent.metadata,
      };
    } catch (error) {
      this.logger.error(`Failed to get Stripe payment status: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to get payment status');
    }
  }

  /**
   * Retry a failed payment for an invoice
   * Implements exponential backoff retry logic
   */
  async retryFailedPayment(invoiceId: string, userId: string, retryAttempt: number = 1, maxRetries: number = 3) {
    this.logger.log(`Retrying payment for invoice ${invoiceId} (attempt ${retryAttempt}/${maxRetries})`);

    try {
      // Validate retry attempt
      if (retryAttempt > maxRetries) {
        throw new BadRequestException(`Maximum retry attempts (${maxRetries}) reached for invoice ${invoiceId}`);
      }

      // Get invoice to check status
      const invoice = await this.getInvoiceById(invoiceId);
      
      // Don't retry if invoice is already paid
      if (invoice.status === InvoiceStatus.PAID) {
        throw new BadRequestException('Invoice is already paid');
      }

      // Calculate exponential backoff delay (1s, 2s, 4s, etc.)
      const delayMs = Math.min(1000 * Math.pow(2, retryAttempt - 1), 10000); // Max 10 seconds
      
      if (retryAttempt > 1) {
        this.logger.log(`Waiting ${delayMs}ms before retry attempt ${retryAttempt}`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }

      // Create new payment intent
      const paymentIntent = await this.createStripePaymentIntent(invoiceId, userId);

      this.logger.log(`Payment retry successful for invoice ${invoiceId} on attempt ${retryAttempt}`);
      
      return {
        success: true,
        paymentIntent,
        attempt: retryAttempt,
        message: `Payment intent created successfully on attempt ${retryAttempt}`
      };
    } catch (error) {
      // Check if we should retry again
      const isRetryable = error instanceof BadRequestException && 
        !error.message.includes('already paid') && 
        !error.message.includes('Maximum retry attempts');

      if (isRetryable && retryAttempt < maxRetries) {
        this.logger.warn(`Payment retry attempt ${retryAttempt} failed, will retry: ${(error as Error).message}`);
        // Recursively retry
        return this.retryFailedPayment(invoiceId, userId, retryAttempt + 1, maxRetries);
      }

      // Log final failure
      this.logger.error(
        `Payment retry failed for invoice ${invoiceId} after ${retryAttempt} attempt(s): ${(error as Error).message}`,
        (error as Error).stack
      );

      // Re-throw known exceptions
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException(`Payment retry failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get payment retry history for an invoice
   */
  async getPaymentRetryHistory(invoiceId: string) {
    this.logger.log(`Getting payment retry history for invoice ${invoiceId}`);

    try {
      const tenantId = await this.getCurrentTenantId();
      
      // Get all failed payment attempts from communication log
      const retryHistory = await this.databaseService.communicationLog.findMany({
        where: {
          tenant_id: tenantId,
          communication_type: 'payment_failure',
          message_content: {
            contains: invoiceId
          }
        },
        orderBy: {
          timestamp: 'desc'
        },
        take: 10 // Last 10 attempts
      });

      return {
        invoiceId,
        retryCount: retryHistory.length,
        attempts: retryHistory.map((log, index) => ({
          attempt: retryHistory.length - index,
          timestamp: log.timestamp,
          error: log.message_content,
          followUpRequired: log.follow_up_required
        }))
      };
    } catch (error) {
      this.logger.error(`Failed to get payment retry history: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to get payment retry history');
    }
  }

  /**
   * Get payment analytics with success rates, failure reasons, and trends
   */
  async getPaymentAnalytics(tenantId: string, startDate?: string, endDate?: string) {
    this.logger.log('Fetching payment analytics');

    try {
      const dateFilter: any = {};
      if (startDate) {
        dateFilter.gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.lte = new Date(endDate);
      }

      // Get all payments in date range
      const payments = await this.databaseService.payment.findMany({
        where: {
          tenant_id: tenantId,
          ...(Object.keys(dateFilter).length > 0 && {
            payment_date: dateFilter
          })
        },
        include: {
          Invoice: {
            select: {
              invoice_number: true,
              status: true,
            }
          },
          payment_methods: {
            select: {
              payment_type: true,
              payment_name: true,
            }
          }
        },
        orderBy: {
          payment_date: 'desc'
        }
      });

      // Get payment failures from communication log
      const paymentFailures = await this.databaseService.communicationLog.findMany({
        where: {
          tenant_id: tenantId,
          communication_type: 'payment_failure',
          ...(Object.keys(dateFilter).length > 0 && {
            timestamp: dateFilter
          })
        }
      });

      // Calculate metrics
      const totalPayments = payments.length;
      const totalFailures = paymentFailures.length;
      const totalAttempts = totalPayments + totalFailures;
      const successRate = totalAttempts > 0 ? (totalPayments / totalAttempts) * 100 : 0;
      const failureRate = totalAttempts > 0 ? (totalFailures / totalAttempts) * 100 : 0;

      // Payment method breakdown
      const paymentMethodBreakdown: Record<string, { count: number; total: number }> = {};
      payments.forEach(payment => {
        const methodType = payment.payment_methods?.payment_type || 'unknown';
        if (!paymentMethodBreakdown[methodType]) {
          paymentMethodBreakdown[methodType] = { count: 0, total: 0 };
        }
        paymentMethodBreakdown[methodType].count++;
        paymentMethodBreakdown[methodType].total += Number(payment.amount);
      });

      // Failure reasons breakdown
      const failureReasons: Record<string, number> = {};
      paymentFailures.forEach(failure => {
        const errorMatch = failure.message_content?.match(/Error: ([^\(]+)/);
        const reason = errorMatch ? errorMatch[1].trim() : 'Unknown error';
        failureReasons[reason] = (failureReasons[reason] || 0) + 1;
      });

      // Monthly trends
      const monthlyData: Record<string, { successful: number; failed: number; total: number }> = {};
      
      payments.forEach(payment => {
        const monthKey = new Date(payment.payment_date).toISOString().slice(0, 7); // YYYY-MM
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { successful: 0, failed: 0, total: 0 };
        }
        monthlyData[monthKey].successful++;
        monthlyData[monthKey].total += Number(payment.amount);
      });

      paymentFailures.forEach(failure => {
        const monthKey = new Date(failure.timestamp).toISOString().slice(0, 7);
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { successful: 0, failed: 0, total: 0 };
        }
        monthlyData[monthKey].failed++;
      });

      const monthlyTrends = Object.entries(monthlyData)
        .map(([month, data]) => ({
          month,
          successful: data.successful,
          failed: data.failed,
          totalAmount: data.total,
          successRate: data.successful + data.failed > 0 
            ? (data.successful / (data.successful + data.failed)) * 100 
            : 0
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

      // Calculate average payment amount
      const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);
      const averagePaymentAmount = totalPayments > 0 ? totalAmount / totalPayments : 0;

      return {
        summary: {
          totalPayments,
          totalFailures,
          totalAttempts,
          successRate: Math.round(successRate * 100) / 100,
          failureRate: Math.round(failureRate * 100) / 100,
          totalAmount,
          averagePaymentAmount: Math.round(averagePaymentAmount * 100) / 100,
        },
        paymentMethodBreakdown: Object.entries(paymentMethodBreakdown).map(([method, data]) => ({
          method,
          count: data.count,
          total: data.total,
          percentage: totalPayments > 0 ? Math.round((data.count / totalPayments) * 100 * 100) / 100 : 0
        })),
        failureReasons: Object.entries(failureReasons)
          .map(([reason, count]) => ({
            reason,
            count,
            percentage: totalFailures > 0 ? Math.round((count / totalFailures) * 100 * 100) / 100 : 0
          }))
          .sort((a, b) => b.count - a.count),
        monthlyTrends,
        dateRange: {
          startDate: startDate || null,
          endDate: endDate || null
        }
      };
    } catch (error) {
      this.logger.error(`Failed to fetch payment analytics: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to fetch payment analytics');
    }
  }

  async getBillingAnalytics(tenantId: string) {
    this.logger.log('Fetching billing analytics');

    try {
      // Get basic billing statistics
      const totalInvoices = await this.databaseService.invoice.count({
        where: { tenant_id: tenantId }
      });

      const overdueInvoices = await this.databaseService.invoice.count({
        where: { 
          tenant_id: tenantId,
          status: InvoiceStatus.OVERDUE
        }
      });

      // Calculate total revenue
      const revenueResult = await this.databaseService.invoice.aggregate({
        where: { 
          tenant_id: tenantId,
          status: InvoiceStatus.PAID
        },
        _sum: {
          total_amount: true
        }
      });

      const totalRevenue = Number(revenueResult._sum.total_amount || 0);

      // Calculate outstanding amount
      const outstandingResult = await this.databaseService.invoice.aggregate({
        where: { 
          tenant_id: tenantId,
          status: { in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE] }
        },
        _sum: {
          total_amount: true
        }
      });

      const outstandingAmount = Number(outstandingResult._sum.total_amount || 0);

      // Calculate average payment time (days from issue_date to first payment_date)
      const paidInvoicesWithPayments = await this.databaseService.invoice.findMany({
        where: {
          tenant_id: tenantId,
          status: InvoiceStatus.PAID
        },
        include: {
          Payment: {
            orderBy: {
              payment_date: 'asc'
            },
            take: 1 // Only need first payment
          }
        }
      });

      let totalPaymentDays = 0;
      let paymentCount = 0;

      for (const invoice of paidInvoicesWithPayments) {
        if (invoice.Payment && invoice.Payment.length > 0) {
          const issueDate = new Date(invoice.issue_date);
          const firstPaymentDate = new Date(invoice.Payment[0].payment_date);
          const daysDiff = Math.floor((firstPaymentDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff >= 0) { // Only count valid payment times
            totalPaymentDays += daysDiff;
            paymentCount++;
          }
        }
      }

      const averagePaymentTime = paymentCount > 0 ? Math.round(totalPaymentDays / paymentCount) : 0;

      return {
        totalRevenue,
        outstandingAmount,
        paidAmount: totalRevenue,
        totalInvoices,
        overdueInvoices,
        averagePaymentTime,
      };
    } catch (error) {
      this.logger.error(`Failed to fetch billing analytics: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to fetch billing analytics');
    }
  }

  /**
   * Get revenue analytics with monthly breakdown
   */
  async getRevenueAnalytics(tenantId: string, startDate?: string, endDate?: string) {
    this.logger.log('Fetching revenue analytics');

    try {
      // Get all paid invoices
      const paidInvoices = await this.databaseService.invoice.findMany({
        where: {
          tenant_id: tenantId,
          status: InvoiceStatus.PAID
        },
        include: {
          Payment: {
            orderBy: {
              payment_date: 'desc'
            },
            take: 1
          }
        }
      });

      // Calculate monthly revenue
      const monthlyRevenue: Record<string, number> = {};
      let totalRevenue = 0;

      paidInvoices.forEach(invoice => {
        const paymentDate = invoice.Payment && invoice.Payment.length > 0 && invoice.Payment[0]
          ? new Date(invoice.Payment[0].payment_date)
          : new Date(invoice.issue_date);
        
        // Apply date filters if provided
        if (startDate && paymentDate < new Date(startDate)) return;
        if (endDate && paymentDate > new Date(endDate)) return;
        
        const monthKey = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}`;
        monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + Number(invoice.total_amount);
        totalRevenue += Number(invoice.total_amount);
      });

      // Convert to array format
      const monthlyRevenueArray = Object.entries(monthlyRevenue)
        .map(([month, revenue]) => ({
          month,
          revenue: Number(revenue)
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

      // Calculate growth rate (compare last two months)
      let growthRate = 0;
      if (monthlyRevenueArray.length >= 2) {
        const lastMonthEntry = monthlyRevenueArray[monthlyRevenueArray.length - 1];
        const previousMonthEntry = monthlyRevenueArray[monthlyRevenueArray.length - 2];
        if (lastMonthEntry && previousMonthEntry && previousMonthEntry.revenue > 0) {
          growthRate = ((lastMonthEntry.revenue - previousMonthEntry.revenue) / previousMonthEntry.revenue) * 100;
        }
      }

      return {
        monthlyRevenue: monthlyRevenueArray,
        totalRevenue,
        growthRate
      };
    } catch (error) {
      this.logger.error(`Failed to fetch revenue analytics: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to fetch revenue analytics');
    }
  }

  /**
   * Get AR Summary with aging buckets
   */
  async getARSummary(tenantId: string) {
    this.logger.log('Fetching AR summary');

    try {
      const invoices = await this.databaseService.invoice.findMany({
        where: {
          tenant_id: tenantId,
          status: { in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE] }
        },
        include: {
          account: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          Payment: true
        }
      });

      const now = new Date();
      const agingBuckets = {
        '0-30': 0,
        '31-60': 0,
        '61-90': 0,
        '90+': 0,
      };

      const customerAR: Record<string, {
        customerId: string;
        customerName: string;
        totalAR: number;
        invoices: any[];
      }> = {};

      invoices.forEach(invoice => {
        const dueDate = new Date(invoice.due_date);
        const daysPastDue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalPaid = invoice.Payment?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
        const balanceDue = Number(invoice.total_amount) - totalPaid;

        if (balanceDue <= 0) return;

        // Calculate aging
        if (daysPastDue <= 30) {
          agingBuckets['0-30'] += balanceDue;
        } else if (daysPastDue <= 60) {
          agingBuckets['31-60'] += balanceDue;
        } else if (daysPastDue <= 90) {
          agingBuckets['61-90'] += balanceDue;
        } else {
          agingBuckets['90+'] += balanceDue;
        }

        // Group by customer
        const customerId = invoice.account_id;
        if (!customerAR[customerId]) {
          customerAR[customerId] = {
            customerId,
            customerName: invoice.account?.name || 'Unknown',
            totalAR: 0,
            invoices: []
          };
        }
        customerAR[customerId].totalAR += balanceDue;
        customerAR[customerId].invoices.push({
          ...invoice,
          balanceDue,
          daysPastDue
        });
      });

      const totalAR = Object.values(agingBuckets).reduce((sum, val) => sum + val, 0);

      return {
        totalAR,
        agingBuckets,
        customerAR: Object.values(customerAR).sort((a, b) => b.totalAR - a.totalAR),
        totalCustomers: Object.keys(customerAR).length,
        totalInvoices: invoices.length
      };
    } catch (error) {
      this.logger.error(`Failed to fetch AR summary: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to fetch AR summary');
    }
  }

  /**
   * Get overdue invoices
   */
  async getOverdueInvoices(tenantId: string) {
    this.logger.log('Fetching overdue invoices');

    try {
      const now = new Date();
      const invoices = await this.databaseService.invoice.findMany({
        where: {
          tenant_id: tenantId,
          status: { in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE] },
          due_date: { lt: now }
        },
        include: {
          account: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            }
          },
          Payment: true
        },
        orderBy: {
          due_date: 'asc'
        }
      });

      return invoices.map(invoice => {
        const totalPaid = invoice.Payment?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
        const balanceDue = Number(invoice.total_amount) - totalPaid;
        const dueDate = new Date(invoice.due_date);
        const daysPastDue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

        return {
          ...invoice,
          balanceDue,
          daysPastDue
        };
      }).filter(inv => inv.balanceDue > 0);
    } catch (error) {
      this.logger.error(`Failed to fetch overdue invoices: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to fetch overdue invoices');
    }
  }

  /**
   * Get payment tracking data
   */
  async getPaymentTracking(tenantId: string, startDate?: string, endDate?: string) {
    this.logger.log('Fetching payment tracking data');

    try {
      const where: any = {
        tenant_id: tenantId
      };

      if (startDate || endDate) {
        where.payment_date = {};
        if (startDate) where.payment_date.gte = new Date(startDate);
        if (endDate) where.payment_date.lte = new Date(endDate);
      }

      const payments = await this.databaseService.payment.findMany({
        where,
        include: {
          Invoice: {
            include: {
              account: {
                select: {
                  name: true,
                }
              }
            }
          },
          payment_methods: true
        },
        orderBy: {
          payment_date: 'desc'
        }
      });

      // Calculate trends
      const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);
      const paymentCount = payments.length;
      const averagePayment = paymentCount > 0 ? totalAmount / paymentCount : 0;

      // Group by date for trend analysis
      const dailyPayments: Record<string, number> = {};
      payments.forEach(payment => {
        const date = new Date(payment.payment_date).toISOString().split('T')[0];
        if (date) {
          dailyPayments[date] = (dailyPayments[date] || 0) + Number(payment.amount);
        }
      });

      return {
        payments,
        summary: {
          totalAmount,
          paymentCount,
          averagePayment
        },
        dailyTrends: dailyPayments
      };
    } catch (error) {
      this.logger.error(`Failed to fetch payment tracking: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to fetch payment tracking');
    }
  }

  /**
   * Send reminder for overdue invoice(s)
   * Note: Email sending will be integrated with communication service in future
   */
  async sendInvoiceReminder(invoiceIds: string[], userId: string, customMessage?: string) {
    this.logger.log(`Sending reminders for ${invoiceIds.length} invoice(s)`);

    try {
      const tenantId = await this.getCurrentTenantId();
      const results = [];

      for (const invoiceId of invoiceIds) {
        // Get invoice with customer details
        const invoice = await this.databaseService.invoice.findFirst({
          where: {
            id: invoiceId,
            tenant_id: tenantId
          },
          include: {
            account: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        });

        if (!invoice) {
          this.logger.warn(`Invoice ${invoiceId} not found`);
          results.push({
            invoice_id: invoiceId,
            success: false,
            error: 'Invoice not found'
          });
          continue;
        }

        // Validate invoice is overdue or sent
        if (invoice.status !== InvoiceStatus.SENT && invoice.status !== InvoiceStatus.OVERDUE) {
          this.logger.warn(`Invoice ${invoiceId} is not in a state that requires reminder (status: ${invoice.status})`);
          results.push({
            invoice_id: invoiceId,
            success: false,
            error: `Invoice status is ${invoice.status}, reminders only sent for sent/overdue invoices`
          });
          continue;
        }

        // Check if customer has email
        if (!invoice.account?.email) {
          this.logger.warn(`Customer ${invoice.account?.id} has no email address for invoice ${invoiceId}`);
          results.push({
            invoice_id: invoiceId,
            success: false,
            error: 'Customer has no email address'
          });
          continue;
        }

        // Calculate days overdue
        const dueDate = new Date(invoice.due_date);
        const now = new Date();
        const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

        // Generate email content
        const emailContent = this.emailService.generateInvoiceReminderEmail({
          customerName: invoice.account.name,
          invoiceNumber: invoice.invoice_number,
          amount: Number(invoice.total_amount),
          dueDate: dueDate,
          daysOverdue: daysOverdue > 0 ? daysOverdue : undefined,
          customMessage: customMessage,
          // TODO: Add payment link when customer portal is implemented
          // paymentLink: `${process.env.FRONTEND_URL}/billing/${invoice.account.id}/pay/${invoice.id}`
        });

        // Send email
        const emailResult = await this.emailService.sendEmail({
          to: invoice.account.email,
          toName: invoice.account.name,
          subject: `Payment Reminder - Invoice ${invoice.invoice_number}`,
          htmlContent: emailContent,
          replyTo: this.configService.get<string>('EMAIL_REPLY_TO') || undefined
        });

        if (emailResult.success) {
          this.logger.log(`Reminder sent successfully to ${invoice.account.email} for invoice ${invoice.invoice_number}`, {
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoice_number,
            customerEmail: invoice.account.email,
            customerName: invoice.account.name,
            messageId: emailResult.messageId
          });

          // Log reminder to communication log
          try {
            // Get user name for staff_member field (optional, fallback to userId if lookup fails)
            let staffMemberName = userId;
            try {
              const user = await this.databaseService.user.findUnique({
                where: { id: userId },
                select: { first_name: true, last_name: true }
              });
              if (user) {
                staffMemberName = `${user.first_name} ${user.last_name}`.trim();
              }
            } catch {
              // Use userId if lookup fails
            }

            await this.databaseService.communicationLog.create({
              data: {
                tenant_id: tenantId,
                customer_id: invoice.account_id,
                communication_type: 'invoice_reminder',
                direction: 'outbound',
                subject: `Payment Reminder - Invoice ${invoice.invoice_number}`,
                message_content: customMessage || `Payment reminder for invoice ${invoice.invoice_number}. Amount due: $${Number(invoice.total_amount).toFixed(2)}. Due date: ${new Date(invoice.due_date).toLocaleDateString()}.`,
                staff_member: staffMemberName.length > 100 ? staffMemberName.substring(0, 100) : staffMemberName,
                timestamp: new Date(),
                follow_up_required: daysOverdue > 7, // Require follow-up if more than 7 days overdue
                follow_up_date: daysOverdue > 7 ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) : undefined // Follow up in 3 days if overdue
              }
            });
          } catch (logError) {
            // Log error but don't fail the reminder send
            this.logger.warn('Failed to log reminder to communication log', {
              invoiceId: invoice.id,
              error: logError instanceof Error ? logError.message : String(logError)
            });
          }

          results.push({
            invoice_id: invoiceId,
            invoice_number: invoice.invoice_number,
            customer_email: invoice.account.email,
            success: true,
            message: 'Reminder sent successfully',
            messageId: emailResult.messageId
          });
        } else {
          this.logger.error(`Failed to send reminder email to ${invoice.account.email}`, {
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoice_number,
            error: emailResult.error
          });

          results.push({
            invoice_id: invoiceId,
            invoice_number: invoice.invoice_number,
            customer_email: invoice.account.email,
            success: false,
            error: emailResult.error || 'Failed to send email'
          });
        }
      }

      return {
        total: invoiceIds.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results
      };
    } catch (error) {
      this.logger.error(`Failed to send reminders: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to send reminders');
    }
  }

  /**
   * Create a recurring payment setup for an invoice
   */
  async createRecurringPayment(
    createRecurringPaymentDto: {
      invoice_id: string;
      interval: 'monthly' | 'quarterly' | 'yearly' | 'weekly';
      amount: number;
      start_date?: string;
      end_date?: string;
      payment_count?: number;
    },
    userId: string
  ) {
    this.logger.log(`Creating recurring payment for invoice ${createRecurringPaymentDto.invoice_id}`);

    try {
      // Get invoice details
      const invoice = await this.getInvoiceById(createRecurringPaymentDto.invoice_id);
      
      // Get customer details
      const customer = await this.databaseService.account.findFirst({
        where: {
          id: invoice.account_id,
          tenant_id: await this.getCurrentTenantId(),
        }
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      if (!customer.email) {
        throw new BadRequestException('Customer email is required for recurring payments');
      }

      const tenantId = await this.getCurrentTenantId();

      // Create or get Stripe customer
      let stripeCustomerId: string;
      try {
        // Check if customer already has Stripe customer ID stored
        if (customer.stripe_customer_id) {
          stripeCustomerId = customer.stripe_customer_id;
          this.logger.log(`Using existing Stripe customer: ${stripeCustomerId}`);
        } else {
          // Create new Stripe customer
          const stripeCustomer = await this.stripeService.createCustomer(
            customer.email,
            customer.name,
            {
              tenantId,
              accountId: customer.id,
            }
          );
          stripeCustomerId = stripeCustomer.id;
          
          // Store Stripe customer ID in database
          await this.databaseService.account.update({
            where: {
              id: customer.id,
              tenant_id: tenantId,
            },
            data: {
              stripe_customer_id: stripeCustomerId,
            }
          });
          
          this.logger.log(`Created and stored Stripe customer: ${stripeCustomerId}`);
        }
      } catch (error) {
        this.logger.error(`Failed to create/get Stripe customer: ${(error as Error).message}`);
        throw new BadRequestException('Failed to create Stripe customer for recurring payment');
      }

      // Map interval to Stripe interval
      const stripeIntervalMap: Record<string, 'month' | 'year' | 'week' | 'day'> = {
        monthly: 'month',
        quarterly: 'month', // Will use interval_count: 3
        yearly: 'year',
        weekly: 'week',
      };

      const stripeInterval = stripeIntervalMap[createRecurringPaymentDto.interval] || 'month';

      // Create Stripe price
      const price = await this.stripeService.createPrice(
        createRecurringPaymentDto.amount,
        'usd',
        stripeInterval,
        `Recurring Payment - Invoice ${invoice.invoice_number}`,
        {
          tenantId,
          invoiceId: invoice.id,
          accountId: customer.id,
        }
      );

      // Create subscription with interval_count if quarterly
      const subscriptionMetadata = {
        tenantId,
        invoiceId: invoice.id,
        accountId: customer.id,
        createdBy: userId,
      };

      // Create subscription
      const subscription = await this.stripeService.createSubscription(
        stripeCustomerId,
        price.id,
        subscriptionMetadata
      );

      // Store recurring payment info in payment notes (or create a separate tracking table)
      // For now, we'll log it and return the subscription info
      this.logger.log(`Recurring payment created: Subscription ${subscription.id} for invoice ${invoice.id}`);

      return {
        subscriptionId: subscription.id,
        customerId: stripeCustomerId,
        priceId: price.id,
        status: subscription.status,
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        interval: createRecurringPaymentDto.interval,
        amount: createRecurringPaymentDto.amount,
        invoiceId: invoice.id,
        clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret || null,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error(
        `Failed to create recurring payment: ${(error as Error).message}`,
        (error as Error).stack
      );
      throw new BadRequestException(`Failed to create recurring payment: ${(error as Error).message}`);
    }
  }

  /**
   * Get recurring payment by subscription ID
   */
  async getRecurringPayment(subscriptionId: string) {
    this.logger.log(`Getting recurring payment: ${subscriptionId}`);

    try {
      const subscription = await this.stripeService.getSubscription(subscriptionId);
      
      return {
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
        currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
        cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
        metadata: subscription.metadata,
      };
    } catch (error) {
      this.logger.error(`Failed to get recurring payment: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to get recurring payment');
    }
  }

  /**
   * Cancel recurring payment
   */
  async cancelRecurringPayment(subscriptionId: string, immediately: boolean = false) {
    this.logger.log(`Canceling recurring payment: ${subscriptionId}`);

    try {
      const subscription = await this.stripeService.cancelSubscription(subscriptionId, immediately);
      
      return {
        subscriptionId: subscription.id,
        status: subscription.status,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : new Date(),
        cancelAtPeriodEnd: (subscription as any).cancel_at_period_end,
      };
    } catch (error) {
      this.logger.error(`Failed to cancel recurring payment: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to cancel recurring payment');
    }
  }

  private async getCurrentTenantId(): Promise<string> {
    const tenantId = await this.databaseService.getCurrentTenantId();
    if (!tenantId) {
      throw new BadRequestException('Tenant context not found');
    }
    return tenantId;
  }
}
