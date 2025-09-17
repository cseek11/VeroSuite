import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { StripeService } from './stripe.service';
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
  ) {}

  // ============================================================================
  // INVOICE MANAGEMENT
  // ============================================================================

  async createInvoice(createInvoiceDto: CreateInvoiceDto, userId: string): Promise<InvoiceResponseDto> {
    this.logger.log(`Creating invoice for account ${createInvoiceDto.account_id}`);

    try {
      // Generate invoice number if not provided
      const invoiceNumber = createInvoiceDto.invoice_number || await this.generateInvoiceNumber();

      // Calculate totals
      const subtotal = createInvoiceDto.items.reduce((sum, item) => {
        return sum + (item.quantity * item.unit_price);
      }, 0);

      // For now, we'll use 0% tax - this can be made configurable later
      const taxAmount = 0;
      const totalAmount = subtotal + taxAmount;

      // Create invoice
      const invoice = await this.databaseService.invoice.create({
        data: {
          tenant_id: await this.getCurrentTenantId(),
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
          accounts: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
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
    } catch (error) {
      this.logger.error(`Failed to create invoice: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to create invoice');
    }
  }

  async getInvoices(accountId?: string, status?: InvoiceStatus, tenantId?: string): Promise<InvoiceResponseDto[]> {
    this.logger.log(`Fetching invoices${accountId ? ` for account ${accountId}` : ''}${status ? ` with status ${status}` : ''}`);

    try {
      const where: any = {
        tenant_id: tenantId || await this.getCurrentTenantId(),
      };

      if (accountId) {
        where.account_id = accountId;
      }

      if (status) {
        where.status = status;
      }

      const invoices = await this.databaseService.invoice.findMany({
        where,
        include: {
          InvoiceItem: true,
          accounts: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
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
      throw new BadRequestException('Failed to fetch invoices');
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
          accounts: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
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
          accounts: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
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

  async getPaymentMethods(accountId?: string): Promise<PaymentMethodResponseDto[]> {
    this.logger.log(`Fetching payment methods${accountId ? ` for account ${accountId}` : ''}`);

    try {
      const where: any = {
        tenant_id: await this.getCurrentTenantId(),
        is_active: true,
      };

      if (accountId) {
        where.account_id = accountId;
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
      this.logger.error(`Failed to fetch payment methods: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to fetch payment methods');
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

  private async generateInvoiceNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const prefix = `INV-${currentYear}-`;
    
    // Get the last invoice number for this year
    const lastInvoice = await this.databaseService.invoice.findFirst({
      where: {
        tenant_id: await this.getCurrentTenantId(),
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
      // Get invoice details
      const invoice = await this.getInvoiceById(invoiceId);
      
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

      // Create payment intent
      const paymentIntent = await this.stripeService.createPaymentIntent({
        amount: Number(invoice.total_amount),
        currency: 'usd',
        invoiceId: invoice.id,
        customerEmail: customer.email || '',
        customerName: customer.name || '',
        metadata: {
          tenantId: await this.getCurrentTenantId(),
          createdBy: userId,
        }
      });

      this.logger.log(`Stripe payment intent created: ${paymentIntent.paymentIntentId}`);
      return paymentIntent;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to create Stripe payment intent: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to create payment intent');
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
        // Create a default Stripe payment method
        const newPaymentMethod = await this.databaseService.paymentMethod.create({
          data: {
            tenant_id: await this.getCurrentTenantId(),
            account_id: paymentData.invoice_id, // We'll need to get this from the invoice
            payment_type: 'STRIPE',
            payment_name: 'Stripe Payment',
            is_default: false,
            is_active: true,
          }
        });
        paymentMethodId = newPaymentMethod.id;
      }

      // Create payment record
      const payment = await this.databaseService.payment.create({
        data: {
          tenant_id: await this.getCurrentTenantId(),
          invoice_id: paymentData.invoice_id,
          payment_method_id: paymentMethodId,
          amount: paymentData.amount,
          payment_date: paymentData.payment_date,
          reference_number: paymentData.reference_number,
          notes: paymentData.notes,
          created_by: 'system', // System created from webhook
        }
      });

      // Update invoice status if fully paid
      const totalPaid = await this.getTotalPaidAmount(paymentData.invoice_id);
      const invoice = await this.databaseService.invoice.findFirst({
        where: { id: paymentData.invoice_id }
      });

      if (invoice && totalPaid >= Number(invoice.total_amount)) {
        await this.databaseService.invoice.update({
          where: { id: paymentData.invoice_id },
          data: { status: InvoiceStatus.PAID }
        });
        this.logger.log(`Invoice ${paymentData.invoice_id} marked as paid`);
      }

      this.logger.log(`Payment record created from Stripe: ${payment.id}`);
      return payment;
    } catch (error) {
      this.logger.error(`Failed to create payment from Stripe: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to create payment record');
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

      return {
        totalRevenue,
        outstandingAmount,
        paidAmount: totalRevenue,
        totalInvoices,
        overdueInvoices,
        averagePaymentTime: 0, // TODO: Calculate based on payment history
      };
    } catch (error) {
      this.logger.error(`Failed to fetch billing analytics: ${(error as Error).message}`, (error as Error).stack);
      throw new BadRequestException('Failed to fetch billing analytics');
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
