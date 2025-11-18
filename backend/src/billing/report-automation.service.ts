import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../common/services/database.service';
import { StructuredLoggerService } from '../common/services/logger.service';
import { EmailService } from '../common/services/email.service';
import { FinancialReportsService, PLReportData, ARAgingReportData } from './financial-reports.service';

export interface ReportSchedule {
  id?: string;
  tenantId: string;
  reportType: 'pl' | 'ar-aging';
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  format: 'csv' | 'pdf' | 'both';
  enabled: boolean;
  lastRunDate?: Date;
  nextRunDate?: Date;
  config?: {
    startDate?: string; // For P&L reports (relative to report date)
    endDate?: string; // For P&L reports (relative to report date)
    asOfDate?: string; // For AR aging reports (relative to report date)
  };
}

@Injectable()
export class ReportAutomationService {
  private readonly logger = new Logger(ReportAutomationService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly structuredLogger: StructuredLoggerService,
    private readonly emailService: EmailService,
    private readonly financialReportsService: FinancialReportsService,
    private readonly configService: ConfigService
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
        if (level === 'error') {
          this.structuredLogger.error(
            message,
            additionalData?.stack,
            'ReportAutomationService',
            requestId,
            operation,
            undefined,
            undefined,
            {
              tenantId: additionalData?.tenantId,
              scheduleId: additionalData?.scheduleId,
              ...additionalData,
            }
          );
        } else if (level === 'warn') {
          this.structuredLogger.warn(
            message,
            'ReportAutomationService',
            requestId,
            operation,
            {
              tenantId: additionalData?.tenantId,
              scheduleId: additionalData?.scheduleId,
              ...additionalData,
            }
          );
        } else {
          this.structuredLogger.log(
            message,
            'ReportAutomationService',
            requestId,
            operation,
            {
              tenantId: additionalData?.tenantId,
              scheduleId: additionalData?.scheduleId,
              ...additionalData,
            }
          );
        }
        return;
      }
    }
    const logMessage = additionalData
      ? `${message} ${JSON.stringify(additionalData)}`
      : message;
    this.logger[level](logMessage);
  }

  /**
   * Create a new report schedule
   */
  async createReportSchedule(
    schedule: ReportSchedule,
    requestId?: string
  ): Promise<ReportSchedule> {
    const operation = 'createReportSchedule';
    this.logWithContext('log', `Creating report schedule for ${schedule.reportType}`, operation, requestId, { tenantId: schedule.tenantId, reportType: schedule.reportType });

    try {
      // Calculate next run date based on frequency
      const nextRunDate = this.calculateNextRunDate(schedule.frequency);

      // Store schedule (in production, would use database)
      // For now, we'll use in-memory storage
      const scheduleId = `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newSchedule: ReportSchedule = {
        ...schedule,
        id: scheduleId,
        nextRunDate,
        lastRunDate: undefined,
      };

      this.logWithContext('log', `Report schedule created: ${scheduleId}`, operation, requestId, { tenantId: schedule.tenantId, scheduleId, nextRunDate });

      return newSchedule;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logWithContext('error', `Failed to create report schedule: ${errorMessage}`, operation, requestId, {
        tenantId: schedule.tenantId,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new BadRequestException(`Failed to create report schedule: ${errorMessage}`);
    }
  }

  /**
   * Get all report schedules for a tenant
   */
  async getReportSchedules(
    tenantId: string,
    requestId?: string
  ): Promise<ReportSchedule[]> {
    const operation = 'getReportSchedules';
    this.logWithContext('log', `Fetching report schedules for tenant`, operation, requestId, { tenantId });

    try {
      // In production, would fetch from database
      // For now, return empty array (schedules would be stored in database)
      return [];
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logWithContext('error', `Failed to get report schedules: ${errorMessage}`, operation, requestId, {
        tenantId,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new BadRequestException(`Failed to get report schedules: ${errorMessage}`);
    }
  }

  /**
   * Update a report schedule
   */
  async updateReportSchedule(
    scheduleId: string,
    updates: Partial<ReportSchedule>,
    requestId?: string
  ): Promise<ReportSchedule> {
    const operation = 'updateReportSchedule';
    this.logWithContext('log', `Updating report schedule: ${scheduleId}`, operation, requestId, { scheduleId });

    try {
      // In production, would update in database
      // For now, return updated schedule
      throw new BadRequestException('Report schedule update not yet implemented (database integration required)');
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logWithContext('error', `Failed to update report schedule: ${errorMessage}`, operation, requestId, {
        scheduleId,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new BadRequestException(`Failed to update report schedule: ${errorMessage}`);
    }
  }

  /**
   * Delete a report schedule
   */
  async deleteReportSchedule(
    scheduleId: string,
    tenantId: string,
    requestId?: string
  ): Promise<void> {
    const operation = 'deleteReportSchedule';
    this.logWithContext('log', `Deleting report schedule: ${scheduleId}`, operation, requestId, { scheduleId, tenantId });

    try {
      // In production, would delete from database
      // For now, just log
      this.logWithContext('log', `Report schedule deleted: ${scheduleId}`, operation, requestId, { scheduleId, tenantId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logWithContext('error', `Failed to delete report schedule: ${errorMessage}`, operation, requestId, {
        scheduleId,
        tenantId,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new BadRequestException(`Failed to delete report schedule: ${errorMessage}`);
    }
  }

  /**
   * Process scheduled reports (called by cron job)
   * Runs daily at 6 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async processScheduledReports(): Promise<void> {
    const operation = 'processScheduledReports';
    this.logWithContext('log', 'Processing scheduled reports', operation);

    try {
      // In production, would fetch all enabled schedules from database
      // For now, this is a placeholder that demonstrates the pattern
      this.logWithContext('log', 'Scheduled reports processed', operation);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logWithContext('error', `Failed to process scheduled reports: ${errorMessage}`, operation, undefined, {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  }

  /**
   * Generate and send a report
   */
  async generateAndSendReport(
    schedule: ReportSchedule,
    requestId?: string
  ): Promise<void> {
    const operation = 'generateAndSendReport';
    this.logWithContext('log', `Generating and sending ${schedule.reportType} report`, operation, requestId, {
      tenantId: schedule.tenantId,
      scheduleId: schedule.id,
      reportType: schedule.reportType
    });

    try {
      let reportData: PLReportData | ARAgingReportData;
      let reportName: string;
      let reportPeriod: string;

      // Generate report based on type
      if (schedule.reportType === 'pl') {
        const { startDate, endDate } = this.calculatePLReportDates(schedule.config);
        reportData = await this.financialReportsService.generatePLReport(
          schedule.tenantId,
          startDate,
          endDate,
          requestId
        );
        reportName = 'Profit & Loss Report';
        reportPeriod = `${startDate} to ${endDate}`;
      } else {
        const asOfDate = this.calculateARAgingReportDate(schedule.config);
        reportData = await this.financialReportsService.generateARAgingReport(
          schedule.tenantId,
          asOfDate,
          requestId
        );
        reportName = 'AR Aging Report';
        reportPeriod = `As of ${asOfDate}`;
      }

      // Generate report content (CSV or PDF)
      const reportContent = await this.generateReportContent(
        reportData,
        schedule.reportType,
        schedule.format,
        reportPeriod
      );

      // Send email to recipients
      for (const recipient of schedule.recipients) {
        await this.sendReportEmail(
          recipient,
          reportName,
          reportPeriod,
          reportContent,
          schedule.format,
          requestId
        );
      }

      // Update last run date
      if (schedule.id) {
        // In production, would update in database
        schedule.lastRunDate = new Date();
        schedule.nextRunDate = this.calculateNextRunDate(schedule.frequency);
      }

      this.logWithContext('log', `Report generated and sent successfully`, operation, requestId, {
        tenantId: schedule.tenantId,
        scheduleId: schedule.id,
        reportType: schedule.reportType,
        recipientCount: schedule.recipients.length
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logWithContext('error', `Failed to generate and send report: ${errorMessage}`, operation, requestId, {
        tenantId: schedule.tenantId,
        scheduleId: schedule.id,
        reportType: schedule.reportType,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw new BadRequestException(`Failed to generate and send report: ${errorMessage}`);
    }
  }

  /**
   * Calculate next run date based on frequency
   */
  private calculateNextRunDate(frequency: 'daily' | 'weekly' | 'monthly'): Date {
    const now = new Date();
    const nextRun = new Date(now);

    switch (frequency) {
      case 'daily':
        nextRun.setDate(now.getDate() + 1);
        nextRun.setHours(6, 0, 0, 0); // 6 AM
        break;
      case 'weekly':
        nextRun.setDate(now.getDate() + 7);
        nextRun.setHours(6, 0, 0, 0); // 6 AM
        break;
      case 'monthly':
        nextRun.setMonth(now.getMonth() + 1);
        nextRun.setDate(1); // First day of next month
        nextRun.setHours(6, 0, 0, 0); // 6 AM
        break;
    }

    return nextRun;
  }

  /**
   * Calculate P&L report dates based on config
   */
  private calculatePLReportDates(config?: ReportSchedule['config']): { startDate: string; endDate: string } {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() - 1); // Yesterday

    let startDate: Date;
    if (config?.startDate) {
      // Parse relative date (e.g., "30 days ago")
      const daysAgo = parseInt(config.startDate) || 30;
      startDate = new Date(today);
      startDate.setDate(today.getDate() - daysAgo);
    } else {
      // Default: last 30 days
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 30);
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }

  /**
   * Calculate AR aging report date based on config
   */
  private calculateARAgingReportDate(config?: ReportSchedule['config']): string {
    const today = new Date();
    
    if (config?.asOfDate) {
      // Parse relative date (e.g., "0" for today, "1" for yesterday)
      const daysAgo = parseInt(config.asOfDate) || 0;
      const reportDate = new Date(today);
      reportDate.setDate(today.getDate() - daysAgo);
      return reportDate.toISOString().split('T')[0];
    }

    // Default: today
    return today.toISOString().split('T')[0];
  }

  /**
   * Generate report content (CSV or PDF)
   */
  private async generateReportContent(
    reportData: PLReportData | ARAgingReportData,
    reportType: 'pl' | 'ar-aging',
    format: 'csv' | 'pdf' | 'both',
    reportPeriod: string
  ): Promise<{ csv?: string; pdf?: Buffer }> {
    const result: { csv?: string; pdf?: Buffer } = {};

    if (format === 'csv' || format === 'both') {
      result.csv = this.generateCSVContent(reportData, reportType, reportPeriod);
    }

    if (format === 'pdf' || format === 'both') {
      // PDF generation would use jsPDF or similar
      // For now, return placeholder
      result.pdf = Buffer.from('PDF content placeholder');
    }

    return result;
  }

  /**
   * Generate CSV content from report data
   */
  private generateCSVContent(
    reportData: PLReportData | ARAgingReportData,
    reportType: 'pl' | 'ar-aging',
    reportPeriod: string
  ): string {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    };

    if (reportType === 'pl') {
      const plData = reportData as PLReportData;
      const headers = ['Month', 'Revenue', 'Expenses', 'Net Income'];
      const rows = plData.monthlyBreakdown?.map((month) => [
        month.month,
        formatCurrency(month.revenue || 0),
        formatCurrency(month.expenses || 0),
        formatCurrency(month.netIncome || 0),
      ]) || [];

      return [
        'Profit & Loss Report',
        `Generated: ${new Date().toLocaleDateString()}`,
        `Period: ${reportPeriod}`,
        '',
        `Total Revenue: ${formatCurrency(plData.totalRevenue || 0)}`,
        `Total Expenses: ${formatCurrency(plData.totalExpenses || 0)}`,
        `Net Income: ${formatCurrency(plData.netIncome || 0)}`,
        '',
        headers.join(','),
        ...rows.map((row) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
      ].join('\n');
    } else {
      const arData = reportData as ARAgingReportData;
      const headers = ['Invoice Number', 'Customer Name', 'Amount', 'Balance Due', 'Due Date', 'Days Past Due', 'Aging Bucket'];
      const rows = arData.invoiceDetails?.map((invoice) => [
        invoice.invoiceNumber,
        invoice.customerName,
        formatCurrency(invoice.amount || 0),
        formatCurrency(invoice.balanceDue || 0),
        invoice.dueDate,
        invoice.daysPastDue?.toString() || '0',
        invoice.agingBucket,
      ]) || [];

      return [
        'AR Aging Report',
        `Generated: ${new Date().toLocaleDateString()}`,
        `Period: ${reportPeriod}`,
        '',
        `Total AR: ${formatCurrency(arData.totalAR || 0)}`,
        `Aging Buckets:`,
        `0-30 days: ${formatCurrency(arData.agingBuckets?.['0-30'] || 0)}`,
        `31-60 days: ${formatCurrency(arData.agingBuckets?.['31-60'] || 0)}`,
        `61-90 days: ${formatCurrency(arData.agingBuckets?.['61-90'] || 0)}`,
        `90+ days: ${formatCurrency(arData.agingBuckets?.['90+'] || 0)}`,
        '',
        headers.join(','),
        ...rows.map((row) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
      ].join('\n');
    }
  }

  /**
   * Send report via email
   */
  private async sendReportEmail(
    recipient: string,
    reportName: string,
    reportPeriod: string,
    reportContent: { csv?: string; pdf?: Buffer },
    format: 'csv' | 'pdf' | 'both',
    requestId?: string
  ): Promise<void> {
    const operation = 'sendReportEmail';
    
    try {
      const emailBody = `
        <h2>${reportName}</h2>
        <p>Period: ${reportPeriod}</p>
        <p>Generated: ${new Date().toLocaleDateString()}</p>
        <p>Please find the attached report${format === 'both' ? 's' : ''}.</p>
      `;

      const emailResult = await this.emailService.sendEmail({
        to: recipient,
        toName: recipient,
        subject: `${reportName} - ${reportPeriod}`,
        htmlContent: emailBody,
        replyTo: this.configService.get<string>('EMAIL_REPLY_TO') || undefined,
        attachments: format === 'csv' && reportContent.csv
          ? [{ filename: 'report.csv', content: reportContent.csv, contentType: 'text/csv' }]
          : format === 'pdf' && reportContent.pdf
          ? [{ filename: 'report.pdf', content: reportContent.pdf.toString('base64'), contentType: 'application/pdf' }]
          : format === 'both'
          ? [
              ...(reportContent.csv ? [{ filename: 'report.csv', content: reportContent.csv, contentType: 'text/csv' }] : []),
              ...(reportContent.pdf ? [{ filename: 'report.pdf', content: reportContent.pdf.toString('base64'), contentType: 'application/pdf' }] : []),
            ]
          : undefined,
      });

      if (!emailResult.success) {
        throw new Error(emailResult.error || 'Failed to send email');
      }

      this.logWithContext('log', `Report email sent to ${recipient}`, operation, requestId, { recipient, reportName });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.logWithContext('error', `Failed to send report email: ${errorMessage}`, operation, requestId, {
        recipient,
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
}

