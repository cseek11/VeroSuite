/**
 * Invoice PDF Service
 * Server-side PDF generation for invoices
 * 
 * Last Updated: 2025-11-18
 */

import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { BillingService } from './billing.service';
// Note: pdfkit package needs to be installed: npm install pdfkit @types/pdfkit
// For now, using a placeholder implementation that can be completed when pdfkit is installed
import { Readable } from 'stream';

// Type definition for PDFDocument (will be replaced when pdfkit is installed)
interface PDFDocumentType {
  fontSize(size: number): PDFDocumentType;
  font(font: string): PDFDocumentType;
  text(text: string, x: number, y: number, options?: any): PDFDocumentType;
  moveTo(x: number, y: number): PDFDocumentType;
  lineTo(x: number, y: number): PDFDocumentType;
  stroke(): PDFDocumentType;
  fillColor(color: string): PDFDocumentType;
  addPage(): PDFDocumentType;
  bufferedPageRange(): { count: number };
  switchToPage(page: number): void;
  end(): void;
  on(event: string, callback: (data?: any) => void): void;
}

@Injectable()
export class InvoicePdfService {
  private readonly logger = new Logger(InvoicePdfService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly billingService: BillingService,
  ) {}

  /**
   * Generate PDF buffer for an invoice
   * 
   * NOTE: Requires pdfkit package to be installed:
   * npm install pdfkit @types/pdfkit
   */
  async generateInvoicePdf(invoiceId: string, tenantId?: string): Promise<Buffer> {
    this.logger.log(`Generating PDF for invoice ${invoiceId}`);

    try {
      // Get invoice with all related data
      const invoice = await this.billingService.getInvoiceById(invoiceId);
      
      if (!invoice) {
        throw new NotFoundException(`Invoice ${invoiceId} not found`);
      }

      // Verify tenant isolation
      const currentTenantId = tenantId || await this.billingService['getCurrentTenantId']();
      if (invoice.tenant_id !== currentTenantId) {
        throw new BadRequestException('Invoice does not belong to current tenant');
      }

      // Get company settings for branding
      // Note: This would typically come from a company settings service
      const companySettings = {
        name: 'VeroField',
        address: '',
        phone: '',
        email: '',
        logoUrl: null,
      };

      // Generate PDF
      const pdfBuffer = await this.createPdfDocument(invoice, companySettings);

      this.logger.log(`PDF generated successfully for invoice ${invoiceId}`);
      return pdfBuffer;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(
        `Failed to generate PDF for invoice ${invoiceId}: ${(error as Error).message}`,
        (error as Error).stack
      );
      throw new BadRequestException(`Failed to generate PDF: ${(error as Error).message}`);
    }
  }

  /**
   * Create PDF document from invoice data
   * 
   * NOTE: This is a placeholder implementation. 
   * Install pdfkit: npm install pdfkit @types/pdfkit
   * Then replace this with actual PDFDocument usage
   */
  private async createPdfDocument(invoice: any, companySettings: any): Promise<Buffer> {
    // TODO: Install pdfkit and implement PDF generation
    // const PDFDocument = require('pdfkit');
    // const doc = new PDFDocument({ size: 'LETTER', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
    
    this.logger.warn('PDF generation requires pdfkit package. Please install: npm install pdfkit @types/pdfkit');
    throw new BadRequestException('PDF generation not yet implemented. Please install pdfkit package.');
    
    // Placeholder return - will be replaced with actual PDF generation
    // return Buffer.from('');
  }

  /**
   * Add header with company logo and invoice number
   */
  private addHeader(doc: PDFDocumentType, invoice: any, companySettings: any): void {
    // Company Name
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .text(companySettings.name || 'VeroField', 50, 50);

    // Company Address (if available)
    if (companySettings.address) {
      doc.fontSize(10)
         .font('Helvetica')
         .text(companySettings.address, 50, 75);
    }

    // Invoice Title and Number
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .text('INVOICE', 400, 50, { align: 'right' });

    doc.fontSize(14)
       .font('Helvetica')
       .text(`Invoice #: ${invoice.invoice_number}`, 400, 80, { align: 'right' });
  }

  /**
   * Add customer information section
   */
  private addCustomerInfo(doc: PDFDocumentType, invoice: any): void {
    const startY = 150;

    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Bill To:', 50, startY);

    if (invoice.accounts) {
      const customer = invoice.accounts;
      let y = startY + 20;

      doc.fontSize(10)
         .font('Helvetica')
         .text(customer.name || 'N/A', 50, y);

      if (customer.address) {
        y += 15;
        doc.text(customer.address, 50, y);
      }

      if (customer.city && customer.state && customer.zip_code) {
        y += 15;
        doc.text(`${customer.city}, ${customer.state} ${customer.zip_code}`, 50, y);
      }

      if (customer.email) {
        y += 15;
        doc.text(customer.email, 50, y);
      }

      if (customer.phone) {
        y += 15;
        doc.text(customer.phone, 50, y);
      }
    }
  }

  /**
   * Add invoice details (dates, status)
   */
  private addInvoiceDetails(doc: PDFDocumentType, invoice: any): void {
    const startY = 150;
    let y = startY;

    doc.fontSize(10)
       .font('Helvetica')
       .text(`Issue Date: ${this.formatDate(invoice.issue_date)}`, 400, y, { align: 'right' });

    y += 15;
    doc.text(`Due Date: ${this.formatDate(invoice.due_date)}`, 400, y, { align: 'right' });

    y += 15;
    const statusColor = this.getStatusColor(invoice.status);
    doc.fillColor(statusColor)
       .text(`Status: ${invoice.status.toUpperCase()}`, 400, y, { align: 'right' })
       .fillColor('black');
  }

  /**
   * Add invoice items table
   */
  private addInvoiceItems(doc: PDFDocumentType, invoice: any): void {
    const startY = 280;

    // Table Header
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .text('Description', 50, startY)
       .text('Quantity', 300, startY)
       .text('Unit Price', 380, startY, { align: 'right' })
       .text('Total', 480, startY, { align: 'right' });

    // Draw line under header
    doc.moveTo(50, startY + 15)
       .lineTo(550, startY + 15)
       .stroke();

    // Invoice Items
    let y = startY + 30;
    if (invoice.InvoiceItem && invoice.InvoiceItem.length > 0) {
      invoice.InvoiceItem.forEach((item: any) => {
        doc.fontSize(9)
           .font('Helvetica')
           .text(item.description || 'N/A', 50, y, { width: 240 })
           .text(String(item.quantity || 0), 300, y)
           .text(this.formatCurrency(Number(item.unit_price || 0)), 380, y, { align: 'right' })
           .text(this.formatCurrency(Number(item.total_price || 0)), 480, y, { align: 'right' });

        y += 20;

        // Add page break if needed
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
      });
    } else {
      doc.fontSize(9)
         .font('Helvetica')
         .text('No items', 50, y);
    }

    // Draw line after items
    doc.moveTo(50, y + 5)
       .lineTo(550, y + 5)
       .stroke();
  }

  /**
   * Add totals section
   */
  private addTotals(doc: PDFDocumentType, invoice: any): void {
    const startY = 450;
    let y = startY;

    doc.fontSize(10)
       .font('Helvetica')
       .text('Subtotal:', 400, y, { align: 'right' })
       .text(this.formatCurrency(Number(invoice.subtotal || 0)), 480, y, { align: 'right' });

    y += 20;
    doc.text('Tax:', 400, y, { align: 'right' })
       .text(this.formatCurrency(Number(invoice.tax_amount || 0)), 480, y, { align: 'right' });

    y += 25;
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('Total:', 400, y, { align: 'right' })
       .text(this.formatCurrency(Number(invoice.total_amount || 0)), 480, y, { align: 'right' });
  }

  /**
   * Add payment information
   */
  private addPaymentInfo(doc: PDFDocumentType, invoice: any): void {
    // This would fetch payment history if needed
    // For now, just show payment status
    const startY = 520;

    doc.fontSize(9)
       .font('Helvetica')
       .text('Payment Terms: Net 30', 50, startY);

    if (invoice.status === 'paid') {
      doc.fillColor('green')
         .text('✓ Paid in Full', 400, startY, { align: 'right' })
         .fillColor('black');
    } else if (invoice.status === 'overdue') {
      doc.fillColor('red')
         .text('⚠ Overdue', 400, startY, { align: 'right' })
         .fillColor('black');
    }
  }

  /**
   * Add footer with company information
   */
  private addFooter(doc: PDFDocumentType, companySettings: any): void {
    const pageCount = doc.bufferedPageRange().count;
    
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      
      doc.fontSize(8)
         .font('Helvetica')
         .text(
           `Page ${i + 1} of ${pageCount}`,
           50,
           750,
           { align: 'center' }
         );

      if (companySettings.email || companySettings.phone) {
        doc.text(
          `Contact: ${companySettings.email || ''} ${companySettings.phone || ''}`,
          50,
          765,
          { align: 'center' }
        );
      }
    }
  }

  /**
   * Format date for display
   */
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /**
   * Format currency for display
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  /**
   * Get status color for PDF
   */
  private getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'paid':
        return '#10b981'; // green
      case 'overdue':
        return '#ef4444'; // red
      case 'sent':
        return '#f59e0b'; // yellow
      default:
        return '#000000'; // black
    }
  }
}

