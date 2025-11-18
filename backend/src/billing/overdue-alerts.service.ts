import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../common/services/database.service';
import { StructuredLoggerService } from '../common/services/logger.service';
import { EmailService } from '../common/services/email.service';
import { InvoiceStatus } from '@prisma/client';

export interface OverdueAlertConfig {
  enabled: boolean;
  alertThresholds: {
    daysOverdue: number;
    alertFrequency: 'daily' | 'weekly' | 'monthly';
  }[];
  escalationRules?: {
    daysOverdue: number;
    escalationLevel: 'email' | 'phone' | 'both';
  }[];
}

export interface OverdueAlertResult {
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  daysOverdue: number;
  balanceDue: number;
  alertSent: boolean;
  alertType: 'email' | 'phone' | 'both' | 'none';
  error?: string;
}

@Injectable()
export class OverdueAlertsService {
  private readonly logger = new Logger(OverdueAlertsService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly structuredLogger: StructuredLoggerService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Helper method to log with structured logging when trace context is available
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
          // Error method signature: error(message, trace?, context?, requestId?, operation?, errorCode?, rootCause?, additionalData?)
          this.structuredLogger.error(
            message,
            additionalData?.stack,
            'OverdueAlertsService',
            requestId,
            operation,
            undefined,
            undefined,
            {
              tenantId: additionalData?.tenantId,
              invoiceId: additionalData?.invoiceId,
              ...additionalData,
            }
          );
        } else if (level === 'warn') {
          // Warn method signature: warn(message, context?, requestId?, operation?, additionalData?)
          this.structuredLogger.warn(
            message,
            'OverdueAlertsService',
            requestId,
            operation,
            {
              tenantId: additionalData?.tenantId,
              invoiceId: additionalData?.invoiceId,
              ...additionalData,
            }
          );
        } else {
          // Log method signature: log(message, context?, requestId?, operation?, additionalData?)
          this.structuredLogger.log(
            message,
            'OverdueAlertsService',
            requestId,
            operation,
            {
              tenantId: additionalData?.tenantId,
              invoiceId: additionalData?.invoiceId,
              ...additionalData,
            }
          );
        }
        return;
      }
    }
    // Fallback to NestJS Logger if no trace context
    // Include additional data in log message for context
    const logMessage = additionalData
      ? `${message} ${JSON.stringify(additionalData)}`
      : message;
    this.logger[level](logMessage);
  }

  /**
   * Get overdue invoices for a tenant
   */
  async getOverdueInvoices(
    tenantId: string,
    minDaysOverdue: number = 0,
    requestId?: string
  ): Promise<any[]> {
    this.logWithContext(
      'log',
      `Fetching overdue invoices for tenant ${tenantId} (minDaysOverdue: ${minDaysOverdue})`,
      'getOverdueInvoices',
      requestId,
      { tenantId, minDaysOverdue }
    );

    try {
      const now = new Date();
      const invoices = await this.databaseService.invoice.findMany({
        where: {
          tenant_id: tenantId,
          status: { in: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE] },
          due_date: { lt: now }
        },
        include: {
          accounts: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          Payment: true
        },
        orderBy: {
          due_date: 'asc'
        }
      });

      const overdueInvoices = invoices
        .map(invoice => {
          const totalPaid = invoice.Payment?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
          const balanceDue = Number(invoice.total_amount) - totalPaid;
          const dueDate = new Date(invoice.due_date);
          const daysPastDue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

          return {
            ...invoice,
            balanceDue,
            daysPastDue
          };
        })
        .filter(inv => inv.balanceDue > 0 && inv.daysPastDue >= minDaysOverdue);

      this.logWithContext(
        'log',
        `Found ${overdueInvoices.length} overdue invoices`,
        'getOverdueInvoices',
        requestId,
        { tenantId, count: overdueInvoices.length }
      );
      return overdueInvoices;
    } catch (error) {
      this.logWithContext(
        'error',
        `Failed to fetch overdue invoices: ${(error as Error).message}`,
        'getOverdueInvoices',
        requestId,
        { tenantId, error: (error as Error).message, stack: (error as Error).stack }
      );
      throw new BadRequestException('Failed to fetch overdue invoices');
    }
  }

  /**
   * Process overdue alerts for a tenant
   * This method checks all overdue invoices and sends alerts based on configuration
   */
  async processOverdueAlerts(
    tenantId: string,
    config?: OverdueAlertConfig,
    userId?: string,
    requestId?: string
  ): Promise<OverdueAlertResult[]> {
    this.logWithContext(
      'log',
      `Processing overdue alerts for tenant ${tenantId}`,
      'processOverdueAlerts',
      requestId,
      { tenantId, userId }
    );

    try {
      // Default configuration if not provided
      const alertConfig: OverdueAlertConfig = config || {
        enabled: true,
        alertThresholds: [
          { daysOverdue: 1, alertFrequency: 'daily' },
          { daysOverdue: 7, alertFrequency: 'weekly' },
          { daysOverdue: 30, alertFrequency: 'weekly' },
          { daysOverdue: 60, alertFrequency: 'weekly' }
        ],
        escalationRules: [
          { daysOverdue: 30, escalationLevel: 'email' },
          { daysOverdue: 60, escalationLevel: 'both' }
        ]
      };

      if (!alertConfig.enabled) {
        this.logWithContext(
          'log',
          'Overdue alerts are disabled in configuration',
          'processOverdueAlerts',
          requestId,
          { tenantId }
        );
        return [];
      }

      // Get all overdue invoices
      const overdueInvoices = await this.getOverdueInvoices(tenantId, 1, requestId);
      const results: OverdueAlertResult[] = [];

      for (const invoice of overdueInvoices) {
        const result = await this.processInvoiceAlert(invoice, alertConfig, tenantId, userId, requestId);
        results.push(result);
      }

      const successCount = results.filter(r => r.alertSent).length;
      this.logWithContext(
        'log',
        `Processed ${results.length} overdue alerts. ${successCount} alerts sent successfully.`,
        'processOverdueAlerts',
        requestId,
        { tenantId, totalAlerts: results.length, successCount }
      );

      return results;
    } catch (error) {
      this.logWithContext(
        'error',
        `Failed to process overdue alerts: ${(error as Error).message}`,
        'processOverdueAlerts',
        requestId,
        { tenantId, error: (error as Error).message, stack: (error as Error).stack }
      );
      throw new BadRequestException('Failed to process overdue alerts');
    }
  }

  /**
   * Process alert for a single invoice
   */
  private async processInvoiceAlert(
    invoice: any,
    config: OverdueAlertConfig,
    tenantId: string,
    userId?: string,
    requestId?: string
  ): Promise<OverdueAlertResult> {
    const daysOverdue = invoice.daysPastDue;
    const customer = invoice.accounts;

    // Determine alert type based on escalation rules
    let alertType: 'email' | 'phone' | 'both' | 'none' = 'email';
    if (config.escalationRules) {
      const applicableRule = config.escalationRules
        .filter(rule => daysOverdue >= rule.daysOverdue)
        .sort((a, b) => b.daysOverdue - a.daysOverdue)[0];

      if (applicableRule) {
        alertType = applicableRule.escalationLevel as 'email' | 'phone' | 'both';
      }
    }

    // Check if we should send alert based on frequency rules
    const shouldSend = this.shouldSendAlert(invoice, config, daysOverdue);
    if (!shouldSend) {
      return {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoice_number,
        customerId: customer?.id || '',
        customerName: customer?.name || 'Unknown',
        customerEmail: customer?.email,
        customerPhone: customer?.phone,
        daysOverdue,
        balanceDue: invoice.balanceDue,
        alertSent: false,
        alertType: 'none',
        error: 'Alert frequency threshold not met'
      };
    }

    // Send alerts
    let alertSent = false;
    let error: string | undefined;

    try {
      if (alertType === 'email' || alertType === 'both') {
        if (customer?.email) {
          await this.sendEmailAlert(invoice, customer, daysOverdue, tenantId, userId);
          alertSent = true;
        } else {
          error = 'Customer has no email address';
        }
      }

      if (alertType === 'phone' || alertType === 'both') {
        if (customer?.phone) {
          // TODO: Implement phone/SMS alert when communication service supports it
          this.logWithContext(
            'warn',
            'Phone alerts not yet implemented',
            'processInvoiceAlert',
            requestId,
            { invoiceId: invoice.id, tenantId }
          );
        } else {
          if (!error) error = 'Customer has no phone number';
        }
      }

      // Log alert to communication log
      if (alertSent) {
        await this.logAlertToCommunicationLog(invoice, customer, daysOverdue, alertType, tenantId, userId, requestId);
      }
    } catch (alertError) {
      error = alertError instanceof Error ? alertError.message : String(alertError);
      this.logWithContext(
        'error',
        `Failed to send alert for invoice ${invoice.invoice_number}`,
        'processInvoiceAlert',
        requestId,
        { invoiceId: invoice.id, invoiceNumber: invoice.invoice_number, error, tenantId }
      );
    }

    return {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoice_number,
      customerId: customer?.id || '',
      customerName: customer?.name || 'Unknown',
      customerEmail: customer?.email,
      customerPhone: customer?.phone,
      daysOverdue,
      balanceDue: invoice.balanceDue,
      alertSent,
      alertType: alertSent ? alertType : 'none',
      error
    };
  }

  /**
   * Determine if alert should be sent based on frequency rules
   */
  private shouldSendAlert(invoice: any, config: OverdueAlertConfig, daysOverdue: number): boolean {
    // Find applicable threshold
    const applicableThreshold = config.alertThresholds
      .filter(threshold => daysOverdue >= threshold.daysOverdue)
      .sort((a, b) => b.daysOverdue - a.daysOverdue)[0];

    if (!applicableThreshold) {
      return false;
    }

    // Check last alert date (simplified - in production, would check alert history)
    // For now, we'll send alerts based on frequency rules
    // TODO: Implement proper alert history tracking to prevent duplicate alerts
    return true;
  }

  /**
   * Send email alert for overdue invoice
   */
  private async sendEmailAlert(
    invoice: any,
    customer: any,
    daysOverdue: number,
    tenantId: string,
    userId?: string,
    requestId?: string
  ): Promise<void> {
    const emailContent = this.emailService.generateInvoiceReminderEmail({
      customerName: customer.name,
      invoiceNumber: invoice.invoice_number,
      amount: invoice.balanceDue,
      dueDate: new Date(invoice.due_date),
      daysOverdue: daysOverdue > 0 ? daysOverdue : undefined,
      customMessage: daysOverdue > 30
        ? 'This invoice is significantly overdue. Please contact us immediately to resolve this matter.'
        : undefined
    });

    const subject = daysOverdue > 30
      ? `URGENT: Payment Overdue - Invoice ${invoice.invoice_number}`
      : `Payment Reminder - Invoice ${invoice.invoice_number}`;

    const emailResult = await this.emailService.sendEmail({
      to: customer.email,
      toName: customer.name,
      subject,
      htmlContent: emailContent,
      replyTo: this.configService.get<string>('EMAIL_REPLY_TO') || undefined
    });

    if (!emailResult.success) {
      throw new Error(emailResult.error || 'Failed to send email');
    }

    this.logWithContext(
      'log',
      `Overdue alert email sent to ${customer.email} for invoice ${invoice.invoice_number}`,
      'sendEmailAlert',
      requestId,
      {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoice_number,
        customerEmail: customer.email,
        daysOverdue,
        tenantId
      }
    );
  }

  /**
   * Log alert to communication log
   */
  private async logAlertToCommunicationLog(
    invoice: any,
    customer: any,
    daysOverdue: number,
    alertType: string,
    tenantId: string,
    userId?: string,
    requestId?: string
  ): Promise<void> {
    try {
      let staffMemberName = userId || 'System';
      if (userId) {
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
      }

      await this.databaseService.communicationLog.create({
        data: {
          tenant_id: tenantId,
          customer_id: invoice.account_id,
          communication_type: 'overdue_alert',
          direction: 'outbound',
          subject: `Overdue Alert - Invoice ${invoice.invoice_number}`,
          message_content: `Automated overdue alert sent for invoice ${invoice.invoice_number}. Amount due: $${invoice.balanceDue.toFixed(2)}. Days overdue: ${daysOverdue}. Alert type: ${alertType}.`,
          staff_member: staffMemberName.length > 100 ? staffMemberName.substring(0, 100) : staffMemberName,
          timestamp: new Date(),
          follow_up_required: daysOverdue > 7,
          follow_up_date: daysOverdue > 7 ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) : undefined
        }
      });
    } catch (logError) {
      // Log error but don't fail the alert
      this.logWithContext(
        'warn',
        'Failed to log alert to communication log',
        'logAlertToCommunicationLog',
        requestId,
        {
          invoiceId: invoice.id,
          error: logError instanceof Error ? logError.message : String(logError),
          tenantId
        }
      );
    }
  }

  /**
   * Get alert statistics for a tenant
   */
  async getAlertStatistics(
    tenantId: string,
    startDate?: Date,
    endDate?: Date,
    requestId?: string
  ): Promise<{
    totalAlerts: number;
    alertsByType: Record<string, number>;
    alertsByDaysOverdue: Record<string, number>;
    successRate: number;
  }> {
    this.logWithContext(
      'log',
      `Fetching alert statistics for tenant ${tenantId}`,
      'getAlertStatistics',
      requestId,
      { tenantId, startDate, endDate }
    );

    try {
      const where: any = {
        tenant_id: tenantId,
        communication_type: 'overdue_alert'
      };

      if (startDate || endDate) {
        where.timestamp = {};
        if (startDate) where.timestamp.gte = startDate;
        if (endDate) where.timestamp.lte = endDate;
      }

      const alerts = await this.databaseService.communicationLog.findMany({
        where,
        orderBy: {
          timestamp: 'desc'
        }
      });

      const stats = {
        totalAlerts: alerts?.length || 0,
        alertsByType: {} as Record<string, number>,
        alertsByDaysOverdue: {} as Record<string, number>,
        successRate: 100 // Simplified - would need to track success/failure
      };

      // Analyze alerts
      if (alerts && Array.isArray(alerts)) {
        alerts.forEach(alert => {
        // Extract alert type from message content
        const messageContent = alert.message_content || '';
        if (messageContent.includes('email')) {
          stats.alertsByType['email'] = (stats.alertsByType['email'] || 0) + 1;
        }
        if (messageContent.includes('phone')) {
          stats.alertsByType['phone'] = (stats.alertsByType['phone'] || 0) + 1;
        }

        // Extract days overdue from message content
        const daysMatch = messageContent.match(/Days overdue: (\d+)/);
        if (daysMatch) {
          const days = parseInt(daysMatch[1]);
          const bucket = days <= 30 ? '0-30' : days <= 60 ? '31-60' : days <= 90 ? '61-90' : '90+';
          stats.alertsByDaysOverdue[bucket] = (stats.alertsByDaysOverdue[bucket] || 0) + 1;
        }
      });
      }

      return stats;
    } catch (error) {
      this.logWithContext(
        'error',
        `Failed to fetch alert statistics: ${(error as Error).message}`,
        'getAlertStatistics',
        requestId,
        { tenantId, error: (error as Error).message, stack: (error as Error).stack }
      );
      throw new BadRequestException('Failed to fetch alert statistics');
    }
  }
}

