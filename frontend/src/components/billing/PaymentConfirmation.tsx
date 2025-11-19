/**
 * PaymentConfirmation Component
 * 
 * Displays payment success confirmation screen with:
 * - Payment success message
 * - Payment details
 * - Receipt download
 * - Email confirmation notice
 * 
 * Last Updated: 2025-11-16
 */

import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Heading, Text } from '@/components/ui';
import {
  CheckCircle,
  CheckCircle2,
  Mail,
  Download,
  Copy,
} from 'lucide-react';
import { Invoice, PaymentMethod } from '@/types/enhanced-types';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';

interface PaymentConfirmationProps {
  invoice: Invoice;
  paymentIntent?: {
    id?: string;
    charges?: {
      data?: Array<{ id?: string }>;
    };
  } | null;
  paymentMethod?: PaymentMethod | null;
  onDownloadReceipt?: () => void;
  onClose?: () => void;
}

export default function PaymentConfirmation({
  invoice,
  paymentIntent,
  paymentMethod,
  onDownloadReceipt,
  onClose,
}: PaymentConfirmationProps) {
  const handleDownloadReceipt = () => {
    try {
      // Create receipt content
      const receiptContent = `
Payment Receipt
================

Invoice Number: ${invoice.invoice_number}
Payment Date: ${new Date().toLocaleDateString()}
Amount Paid: $${Number(invoice.total_amount).toFixed(2)}

${paymentIntent?.id ? `Payment Intent ID: ${paymentIntent.id}` : ''}
${paymentMethod ? `Payment Method: ${paymentMethod.payment_name || 'N/A'}` : ''}

Thank you for your payment!
      `.trim();

      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Receipt-${invoice.invoice_number}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.debug('Receipt downloaded', { invoiceNumber: invoice.invoice_number }, 'PaymentConfirmation');
      toast.success('Receipt downloaded');

      if (onDownloadReceipt) {
        onDownloadReceipt();
      }
    } catch (error: unknown) {
      logger.error('Failed to download receipt', error, 'PaymentConfirmation');
      toast.error('Failed to download receipt. Please try again.');
    }
  };

  const handleCopyInvoiceNumber = () => {
    try {
      navigator.clipboard.writeText(invoice.invoice_number);
      toast.success('Invoice number copied to clipboard');
    } catch (error: unknown) {
      logger.error('Failed to copy invoice number', error, 'PaymentConfirmation');
      toast.error('Failed to copy. Please try again.');
    }
  };

  return (
    <Card>
      <div className="p-12">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto" />
            <div className="absolute -top-1 -right-1">
              <CheckCircle2 className="w-6 h-6 text-green-500 bg-white rounded-full" />
            </div>
          </div>
          <Heading level={2} className="font-bold text-green-800 mb-2">
            Payment Successful!
          </Heading>
          <Heading level={4} className="text-gray-700 mb-4">
            Your payment of ${Number(invoice.total_amount).toFixed(2)} has been processed
          </Heading>
          <Text variant="small" className="text-gray-600 mb-6">
            <Mail className="w-4 h-4 inline mr-1" />
            A confirmation email has been sent to {invoice.accounts?.email || 'your email address'}
          </Text>
        </div>

        {/* Payment Details */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <Heading level={4} className="font-semibold mb-4 text-green-800">
            Payment Details
          </Heading>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Invoice Number:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{invoice.invoice_number}</span>
                <button
                  onClick={handleCopyInvoiceNumber}
                  className="p-1 hover:bg-green-100 rounded transition-colors"
                  title="Copy invoice number"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount Paid:</span>
              <span className="font-bold text-green-800">
                ${Number(invoice.total_amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            {paymentMethod && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">
                  {paymentMethod.payment_name || 
                   (paymentMethod.card_type && paymentMethod.card_last4
                     ? `${paymentMethod.card_type} ending in ${paymentMethod.card_last4}`
                     : 'N/A')}
                </span>
              </div>
            )}
            {paymentIntent?.id && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Payment Intent ID:</span>
                <span className="font-mono text-xs font-medium">
                  {paymentIntent.id.slice(0, 20)}...
                </span>
              </div>
            )}
            {paymentIntent && 
             typeof paymentIntent.charges === 'object' &&
             paymentIntent.charges !== null &&
             'data' in paymentIntent.charges &&
             Array.isArray(paymentIntent.charges.data) && 
             paymentIntent.charges.data.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Charge ID:</span>
                <span className="font-mono text-xs font-medium">
                  {typeof paymentIntent.charges.data[0] === 'object' && 
                   paymentIntent.charges.data[0] !== null &&
                   'id' in paymentIntent.charges.data[0] &&
                   typeof paymentIntent.charges.data[0].id === 'string'
                    ? paymentIntent.charges.data[0].id.slice(0, 20)
                    : 'N/A'}...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            icon={Download}
            onClick={handleDownloadReceipt}
          >
            Download Receipt
          </Button>
          {onClose && (
            <Button
              variant="primary"
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}






