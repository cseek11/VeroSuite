import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { StructuredLoggerService } from '../common/services/logger.service';
import { InvoiceStatus } from '@prisma/client';

export interface PLReportData {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  grossProfit: number;
  operatingExpenses: number;
  monthlyBreakdown: Array<{
    month: string;
    revenue: number;
    expenses: number;
    netIncome: number;
  }>;
  revenueByCategory?: Record<string, number>;
  expenseByCategory?: Record<string, number>;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface ARAgingReportData {
  totalAR: number;
  agingBuckets: {
    '0-30': number;
    '31-60': number;
    '61-90': number;
    '90+': number;
  };
  customerBreakdown: Array<{
    customerId: string;
    customerName: string;
    totalAR: number;
    agingBuckets: {
      '0-30': number;
      '31-60': number;
      '61-90': number;
      '90+': number;
    };
    invoiceCount: number;
    oldestInvoiceDate: string | null;
  }>;
  invoiceDetails: Array<{
    invoiceId: string;
    invoiceNumber: string;
    customerId: string;
    customerName: string;
    amount: number;
    balanceDue: number;
    dueDate: string;
    daysPastDue: number;
    agingBucket: '0-30' | '31-60' | '61-90' | '90+';
  }>;
  period: {
    asOfDate: string;
  };
}

@Injectable()
export class FinancialReportsService {
  private readonly logger = new Logger(FinancialReportsService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly structuredLogger: StructuredLoggerService
  ) {}

  /**
   * Helper method to centralize structured logging with trace context
   */
  private logWithContext(
    level: 'log' | 'error' | 'warn' | 'debug',
    message: string,
    operation: string,
    requestId?: string,
    additionalData?: Record<string, any>
  ) {
    if (requestId) {
      const context = this.structuredLogger.getRequestContext(requestId);
      if (context) {
        // Use structured logger with trace context
        if (level === 'error') {
          this.structuredLogger.error(
            message,
            additionalData?.stack,
            'FinancialReportsService',
            requestId,
            operation,
            undefined,
            undefined,
            {
              tenantId: additionalData?.tenantId,
              ...additionalData,
            }
          );
        } else if (level === 'warn') {
          this.structuredLogger.warn(
            message,
            'FinancialReportsService',
            requestId,
            operation,
            {
              tenantId: additionalData?.tenantId,
              ...additionalData,
            }
          );
        } else {
          this.structuredLogger.log(
            message,
            'FinancialReportsService',
            requestId,
            operation,
            {
              tenantId: additionalData?.tenantId,
              ...additionalData,
            }
          );
        }
        return;
      }
    }
    // Fallback to NestJS Logger if no trace context
    const logMessage = additionalData
      ? `${message} ${JSON.stringify(additionalData)}`
      : message;
    this.logger[level](logMessage);
  }

  /**
   * Generate Profit & Loss (P&L) Report
   * @param tenantId - Tenant ID for data isolation
   * @param startDate - Start date for the report period (ISO 8601 format)
   * @param endDate - End date for the report period (ISO 8601 format)
   * @param requestId - Optional request ID for trace propagation
   * @returns P&L report data
   */
  async generatePLReport(
    tenantId: string,
    startDate: string,
    endDate: string,
    requestId?: string
  ): Promise<PLReportData> {
    const operation = 'generatePLReport';
    this.logWithContext('log', `Generating P&L report for period ${startDate} to ${endDate}`, operation, requestId, { tenantId, startDate, endDate });

    try {
      // Validate date range
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException('Invalid date format. Please use ISO 8601 format (YYYY-MM-DD)');
      }

      if (start > end) {
        throw new BadRequestException('Start date must be before end date');
      }

      // Get all paid invoices in the period
      const paidInvoices = await this.databaseService.invoice.findMany({
        where: {
          tenant_id: tenantId,
          status: InvoiceStatus.PAID,
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

      // Calculate monthly revenue breakdown
      const monthlyBreakdown: Record<string, { revenue: number; expenses: number; netIncome: number }> = {};
      let totalRevenue = 0;

      paidInvoices.forEach(invoice => {
        const paymentDate = invoice.Payment && invoice.Payment.length > 0 && invoice.Payment[0]
          ? new Date(invoice.Payment[0].payment_date)
          : new Date(invoice.issue_date);
        
        // Apply date filters
        if (paymentDate < start || paymentDate > end) return;
        
        const monthKey = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}`;
        const invoiceAmount = Number(invoice.total_amount);
        
        if (!monthlyBreakdown[monthKey]) {
          monthlyBreakdown[monthKey] = { revenue: 0, expenses: 0, netIncome: 0 };
        }
        
        monthlyBreakdown[monthKey].revenue += invoiceAmount;
        totalRevenue += invoiceAmount;
      });

      // Convert monthly breakdown to array format
      const monthlyBreakdownArray = Object.entries(monthlyBreakdown)
        .map(([month, data]) => ({
          month,
          revenue: data.revenue,
          expenses: data.expenses,
          netIncome: data.revenue - data.expenses
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

      // Calculate totals
      // Note: Expenses would come from expense tracking system (placeholder for now)
      const totalExpenses = 0; // TODO: Integrate with expense tracking
      const operatingExpenses = 0; // TODO: Integrate with expense tracking
      const grossProfit = totalRevenue - 0; // TODO: Subtract COGS when available
      const netIncome = totalRevenue - totalExpenses;

      this.logWithContext('log', `P&L report generated successfully. Revenue: ${totalRevenue}, Net Income: ${netIncome}`, operation, requestId, { tenantId, totalRevenue, netIncome });

      return {
        totalRevenue,
        totalExpenses,
        netIncome,
        grossProfit,
        operatingExpenses,
        monthlyBreakdown: monthlyBreakdownArray,
        period: {
          startDate,
          endDate
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logWithContext('error', `Failed to generate P&L report: ${errorMessage}`, operation, requestId, { 
        tenantId, 
        startDate, 
        endDate, 
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to generate P&L report: ${errorMessage}`);
    }
  }

  /**
   * Generate AR Aging Report
   * @param tenantId - Tenant ID for data isolation
   * @param asOfDate - As of date for the aging report (ISO 8601 format, defaults to today)
   * @param requestId - Optional request ID for trace propagation
   * @returns AR aging report data
   */
  async generateARAgingReport(
    tenantId: string,
    asOfDate?: string,
    requestId?: string
  ): Promise<ARAgingReportData> {
    const operation = 'generateARAgingReport';
    const reportDate = asOfDate ? new Date(asOfDate) : new Date();
    
    if (asOfDate && isNaN(reportDate.getTime())) {
      throw new BadRequestException('Invalid asOfDate format. Please use ISO 8601 format (YYYY-MM-DD)');
    }

    this.logWithContext('log', `Generating AR aging report as of ${reportDate.toISOString().split('T')[0]}`, operation, requestId, { tenantId, asOfDate: reportDate.toISOString().split('T')[0] });

    try {
      // Get all outstanding invoices
      const invoices = await this.databaseService.invoice.findMany({
        where: {
          tenant_id: tenantId,
          status: { in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE] }
        },
        include: {
          accounts: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          },
          Payment: true
        },
        orderBy: {
          due_date: 'asc'
        }
      });

      const agingBuckets = {
        '0-30': 0,
        '31-60': 0,
        '61-90': 0,
        '90+': 0,
      };

      const customerBreakdown: Record<string, {
        customerId: string;
        customerName: string;
        totalAR: number;
        agingBuckets: typeof agingBuckets;
        invoiceCount: number;
        oldestInvoiceDate: Date | null;
      }> = {};

      const invoiceDetails: ARAgingReportData['invoiceDetails'] = [];

      invoices.forEach(invoice => {
        const dueDate = new Date(invoice.due_date);
        const daysPastDue = Math.floor((reportDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        const totalPaid = invoice.Payment?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
        const balanceDue = Number(invoice.total_amount) - totalPaid;

        // Skip invoices with no balance due
        if (balanceDue <= 0) return;

        // Determine aging bucket
        let agingBucket: '0-30' | '31-60' | '61-90' | '90+';
        if (daysPastDue <= 30) {
          agingBucket = '0-30';
          agingBuckets['0-30'] += balanceDue;
        } else if (daysPastDue <= 60) {
          agingBucket = '31-60';
          agingBuckets['31-60'] += balanceDue;
        } else if (daysPastDue <= 90) {
          agingBucket = '61-90';
          agingBuckets['61-90'] += balanceDue;
        } else {
          agingBucket = '90+';
          agingBuckets['90+'] += balanceDue;
        }

        // Customer breakdown
        const customerId = invoice.accounts?.id || 'unknown';
        const customerName = invoice.accounts?.name || 'Unknown Customer';
        
        if (!customerBreakdown[customerId]) {
          customerBreakdown[customerId] = {
            customerId,
            customerName,
            totalAR: 0,
            agingBuckets: {
              '0-30': 0,
              '31-60': 0,
              '61-90': 0,
              '90+': 0,
            },
            invoiceCount: 0,
            oldestInvoiceDate: null,
          };
        }

        customerBreakdown[customerId].totalAR += balanceDue;
        customerBreakdown[customerId].agingBuckets[agingBucket] += balanceDue;
        customerBreakdown[customerId].invoiceCount += 1;
        
        if (!customerBreakdown[customerId].oldestInvoiceDate || dueDate < customerBreakdown[customerId].oldestInvoiceDate!) {
          customerBreakdown[customerId].oldestInvoiceDate = dueDate;
        }

        // Invoice details
        invoiceDetails.push({
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoice_number || 'N/A',
          customerId,
          customerName,
          amount: Number(invoice.total_amount),
          balanceDue,
          dueDate: invoice.due_date.toISOString().split('T')[0],
          daysPastDue: Math.max(0, daysPastDue),
          agingBucket,
        });
      });

      // Convert customer breakdown to array
      const customerBreakdownArray = Object.values(customerBreakdown).map(customer => ({
        ...customer,
        oldestInvoiceDate: customer.oldestInvoiceDate ? customer.oldestInvoiceDate.toISOString().split('T')[0] : null,
      }));

      const totalAR = Object.values(agingBuckets).reduce((sum, amount) => sum + amount, 0);

      this.logWithContext('log', `AR aging report generated successfully. Total AR: ${totalAR}, Invoices: ${invoiceDetails.length}`, operation, requestId, { tenantId, totalAR, invoiceCount: invoiceDetails.length });

      return {
        totalAR,
        agingBuckets,
        customerBreakdown: customerBreakdownArray,
        invoiceDetails,
        period: {
          asOfDate: reportDate.toISOString().split('T')[0],
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logWithContext('error', `Failed to generate AR aging report: ${errorMessage}`, operation, requestId, { 
        tenantId, 
        asOfDate: reportDate.toISOString().split('T')[0], 
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Failed to generate AR aging report: ${errorMessage}`);
    }
  }
}

