import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface SendEmailOptions {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  from?: string;
  fromName?: string;
  replyTo?: string;
}

interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Email service using SendGrid API
 * Provides structured email sending with retry logic and error handling
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly sendgridApiKey: string | undefined;
  private readonly defaultFromEmail: string;
  private readonly defaultFromName: string;
  private readonly sendgridApiUrl = 'https://api.sendgrid.com/v3/mail/send';

  constructor(private readonly configService: ConfigService) {
    this.sendgridApiKey = this.configService.get<string>('SENDGRID_API_KEY');
    this.defaultFromEmail = this.configService.get<string>('EMAIL_FROM') || 'noreply@verofield.com';
    this.defaultFromName = this.configService.get<string>('EMAIL_FROM_NAME') || 'VeroField';

    if (!this.sendgridApiKey) {
      this.logger.warn('SENDGRID_API_KEY not configured. Email sending will be disabled.');
    }
  }

  /**
   * Send email using SendGrid API
   * @param options Email options
   * @param retries Number of retry attempts (default: 2)
   * @returns SendEmailResult with success status
   */
  async sendEmail(options: SendEmailOptions, retries: number = 2): Promise<SendEmailResult> {
    if (!this.sendgridApiKey) {
      this.logger.warn('SendGrid API key not configured. Email not sent.', {
        to: options.to,
        subject: options.subject
      });
      return {
        success: false,
        error: 'Email service not configured'
      };
    }

    // Validate required fields
    if (!options.to || !options.subject || !options.htmlContent) {
      throw new BadRequestException('Missing required email fields: to, subject, or htmlContent');
    }

    const emailData = {
      personalizations: [
        {
          to: [{ 
            email: options.to, 
            name: options.toName || options.to 
          }],
          subject: options.subject
        }
      ],
      from: { 
        email: options.from || this.defaultFromEmail, 
        name: options.fromName || this.defaultFromName 
      },
      content: [
        {
          type: 'text/html',
          value: options.htmlContent
        }
      ],
      ...(options.replyTo && { reply_to: { email: options.replyTo } })
    };

    // Retry logic
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.logger.debug(`Sending email (attempt ${attempt}/${retries})`, {
          to: options.to,
          subject: options.subject
        });

        const response = await fetch(this.sendgridApiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.sendgridApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          this.logger.warn(`SendGrid API error (attempt ${attempt}/${retries})`, {
            status: response.status,
            statusText: response.statusText,
            error: errorText,
            to: options.to
          });

          if (attempt === retries) {
            return {
              success: false,
              error: `SendGrid API error: ${response.status} ${response.statusText}`
            };
          }

          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }

        // Extract message ID from response headers if available
        const messageId = response.headers.get('x-message-id') || undefined;

        this.logger.log('Email sent successfully', {
          to: options.to,
          subject: options.subject,
          messageId
        });

        return {
          success: true,
          messageId
        };
      } catch (error) {
        this.logger.error(`Error sending email (attempt ${attempt}/${retries})`, {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          to: options.to
        });

        if (attempt === retries) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }

    return {
      success: false,
      error: 'Failed to send email after all retry attempts'
    };
  }

  /**
   * Generate invoice reminder email HTML content
   */
  generateInvoiceReminderEmail(data: {
    customerName: string;
    invoiceNumber: string;
    amount: number;
    dueDate: Date;
    daysOverdue?: number;
    customMessage?: string;
    paymentLink?: string;
  }): string {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(data.amount);

    const formattedDueDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(data.dueDate);

    const overdueMessage = data.daysOverdue 
      ? `<p style="color: #dc2626; font-weight: bold; font-size: 16px;">This invoice is ${data.daysOverdue} day${data.daysOverdue !== 1 ? 's' : ''} overdue.</p>`
      : '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice Reminder - ${data.invoiceNumber}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #7c3aed, #a855f7); padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">VeroField</h1>
          <p style="color: white; margin: 10px 0 0 0;">Invoice Payment Reminder</p>
        </div>
        
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 20px;">
          <h2 style="color: #1f2937; margin-top: 0;">Payment Reminder</h2>
          
          <p>Dear ${data.customerName},</p>
          
          <p>This is a friendly reminder that payment is due for the following invoice:</p>
          
          <div style="background: #f9fafb; border-left: 4px solid #7c3aed; padding: 16px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
            <p style="margin: 8px 0 0 0;"><strong>Amount Due:</strong> <span style="font-size: 18px; color: #7c3aed; font-weight: bold;">${formattedAmount}</span></p>
            <p style="margin: 8px 0 0 0;"><strong>Due Date:</strong> ${formattedDueDate}</p>
          </div>
          
          ${overdueMessage}
          
          ${data.customMessage ? `<p style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0;">${data.customMessage}</p>` : ''}
          
          ${data.paymentLink ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.paymentLink}" style="background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Pay Invoice Now</a>
            </div>
          ` : ''}
          
          <p>If you have already made this payment, please disregard this reminder. If you have any questions or need to discuss payment arrangements, please contact us.</p>
          
          <p>Thank you for your business!</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>The VeroField Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p>VeroField - Transform Your Service Business</p>
          <p>This is an automated reminder. Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate payment confirmation email HTML content
   */
  generatePaymentConfirmationEmail(data: {
    customerName: string;
    invoiceNumber: string;
    amount: number;
    paymentDate: Date;
    transactionId: string;
    paymentMethod: string;
  }): string {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(data.amount);

    const formattedPaymentDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(data.paymentDate);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Confirmation - ${data.invoiceNumber}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">VeroField</h1>
          <p style="color: white; margin: 10px 0 0 0;">Payment Confirmation</p>
        </div>
        
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 20px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="background: #d1fae5; border-radius: 50%; width: 64px; height: 64px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <span style="font-size: 32px;">✓</span>
            </div>
            <h2 style="color: #1f2937; margin: 0;">Payment Received</h2>
            <p style="color: #6b7280; margin: 8px 0 0 0;">Thank you for your payment!</p>
          </div>
          
          <p>Dear ${data.customerName},</p>
          
          <p>We have successfully received your payment. Please find the payment details below:</p>
          
          <div style="background: #f9fafb; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
            <p style="margin: 8px 0 0 0;"><strong>Amount Paid:</strong> <span style="font-size: 18px; color: #10b981; font-weight: bold;">${formattedAmount}</span></p>
            <p style="margin: 8px 0 0 0;"><strong>Payment Date:</strong> ${formattedPaymentDate}</p>
            <p style="margin: 8px 0 0 0;"><strong>Payment Method:</strong> ${data.paymentMethod}</p>
            <p style="margin: 8px 0 0 0;"><strong>Transaction ID:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${data.transactionId}</code></p>
          </div>
          
          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #1e40af;">
              <strong>Note:</strong> Please keep this email as your payment receipt. You can also download a receipt from your payment portal.
            </p>
          </div>
          
          <p>If you have any questions about this payment, please contact us using the information below.</p>
          
          <p>Thank you for your business!</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>The VeroField Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p>VeroField - Transform Your Service Business</p>
          <p>This is an automated confirmation. Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate payment failure email HTML content
   */
  generatePaymentFailureEmail(data: {
    customerName: string;
    invoiceNumber: string;
    amount: number;
    errorMessage: string;
    errorCode: string;
    declineCode?: string | null;
    transactionId: string;
    paymentLink: string;
  }): string {
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(data.amount);

    const errorExplanation = this.getPaymentErrorExplanation(data.errorCode, data.declineCode);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Failed - ${data.invoiceNumber}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #374151; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">VeroField</h1>
          <p style="color: white; margin: 10px 0 0 0;">Payment Failed</p>
        </div>
        
        <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 20px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="background: #fee2e2; border-radius: 50%; width: 64px; height: 64px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <span style="font-size: 32px; color: #dc2626;">⚠</span>
            </div>
            <h2 style="color: #1f2937; margin: 0;">Payment Could Not Be Processed</h2>
            <p style="color: #6b7280; margin: 8px 0 0 0;">We were unable to process your payment</p>
          </div>
          
          <p>Dear ${data.customerName},</p>
          
          <p>We attempted to process your payment but encountered an issue. Please find the details below:</p>
          
          <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
            <p style="margin: 8px 0 0 0;"><strong>Amount:</strong> <span style="font-size: 18px; color: #ef4444; font-weight: bold;">${formattedAmount}</span></p>
            <p style="margin: 8px 0 0 0;"><strong>Error:</strong> ${data.errorMessage}</p>
            ${data.declineCode ? `<p style="margin: 8px 0 0 0;"><strong>Decline Code:</strong> ${data.declineCode}</p>` : ''}
            <p style="margin: 8px 0 0 0;"><strong>Transaction ID:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${data.transactionId}</code></p>
          </div>
          
          ${errorExplanation ? `
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>What this means:</strong> ${errorExplanation}
              </p>
            </div>
          ` : ''}
          
          <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #1e40af;">
              <strong>Next Steps:</strong> Please verify your payment method information and try again. Common issues include:
            </p>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #1e40af;">
              <li>Insufficient funds in your account</li>
              <li>Expired or incorrect card information</li>
              <li>Card security restrictions</li>
              <li>Bank processing delays</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.paymentLink}" style="background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Try Payment Again</a>
          </div>
          
          <p>If you continue to experience issues, please contact our support team. We're here to help!</p>
          
          <p>Thank you for your patience.</p>
          
          <p style="margin-top: 30px;">
            Best regards,<br>
            <strong>The VeroField Team</strong>
          </p>
        </div>
        
        <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p>VeroField - Transform Your Service Business</p>
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get human-readable explanation for payment error codes
   */
  private getPaymentErrorExplanation(errorCode: string, declineCode?: string | null): string {
    if (declineCode) {
      const declineExplanations: Record<string, string> = {
        'insufficient_funds': 'Your account does not have sufficient funds to complete this payment.',
        'card_declined': 'Your card was declined. Please check with your bank or try a different payment method.',
        'expired_card': 'Your card has expired. Please update your card information.',
        'incorrect_cvc': 'The security code (CVC) on your card is incorrect.',
        'incorrect_number': 'The card number is incorrect. Please verify your card details.',
        'processing_error': 'An error occurred while processing your payment. Please try again.',
        'lost_card': 'Your card has been reported as lost. Please contact your bank.',
        'stolen_card': 'Your card has been reported as stolen. Please contact your bank.',
        'pickup_card': 'Your card has been flagged for pickup. Please contact your bank.',
        'restricted_card': 'Your card has restrictions that prevent this transaction.',
        'security_violation': 'A security violation was detected. Please contact your bank.',
        'service_not_allowed': 'This type of transaction is not allowed on your card.',
        'stop_payment_order': 'A stop payment order has been placed on this transaction.',
        'testmode_decline': 'This is a test card and cannot be used for real payments.',
        'withdrawal_count_limit_exceeded': 'You have exceeded the withdrawal limit for your account.',
      };

      return declineExplanations[declineCode] || 'Please verify your payment information and try again.';
    }

    const errorExplanations: Record<string, string> = {
      'card_declined': 'Your card was declined. Please check with your bank or try a different payment method.',
      'expired_card': 'Your card has expired. Please update your card information.',
      'incorrect_cvc': 'The security code (CVC) on your card is incorrect.',
      'incorrect_number': 'The card number is incorrect. Please verify your card details.',
      'insufficient_funds': 'Your account does not have sufficient funds to complete this payment.',
      'processing_error': 'An error occurred while processing your payment. Please try again.',
    };

    return errorExplanations[errorCode] || 'Please verify your payment information and try again.';
  }
}

