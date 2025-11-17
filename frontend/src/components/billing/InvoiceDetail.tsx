import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Heading,
  Text,
} from '@/components/ui';
import {
  Download,
  CreditCard,
  Calendar,
  DollarSign,
  FileText,
  Building,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  Clock,
  History,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Invoice } from '@/types/enhanced-types';
import { billing, company } from '@/lib/enhanced-api';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import { trackInvoiceView, trackInvoiceDownload } from '@/lib/billing-analytics';
import { InvoiceDetailSkeleton } from './BillingSkeletons';

interface InvoiceDetailProps {
  invoice: Invoice;
  onPayNow?: () => void;
  onDownloadPDF?: () => void;
  showActions?: boolean;
  className?: string;
}

export default function InvoiceDetail({
  invoice,
  onPayNow,
  onDownloadPDF,
  showActions = true,
  className = '',
}: InvoiceDetailProps) {
  // Track invoice view
  useEffect(() => {
    if (invoice?.id) {
      trackInvoiceView(invoice.id);
    }
  }, [invoice?.id]);

  // Fetch company settings for display
  const { data: companySettings, isLoading: companyLoading } = useQuery({
    queryKey: ['company', 'settings'],
    queryFn: company.getSettings,
    onError: (error: unknown) => {
      logger.error('Failed to fetch company settings', error, 'InvoiceDetail');
    },
  });

  // Fetch payment history for this invoice
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['billing', 'payments', invoice.id],
    queryFn: () => billing.getPayments(invoice.id),
    enabled: !!invoice.id,
    onError: (error: unknown) => {
      logger.error('Failed to fetch payment history', error, 'InvoiceDetail');
    },
  });

  if (companyLoading || paymentsLoading) {
    return <InvoiceDetailSkeleton />;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'sent':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'sent':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isPayable = invoice.status === 'sent' || invoice.status === 'overdue';
  const isOverdue = invoice.status === 'overdue' || 
    (invoice.status === 'sent' && new Date(invoice.due_date) < new Date());

  // Calculate total paid
  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const remainingBalance = Number(invoice.total_amount) - totalPaid;

  return (
    <div className={className}>
      {/* Header Section */}
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              {companySettings?.invoice_logo_url && (
                <img 
                  src={companySettings.invoice_logo_url} 
                  alt="Company Logo" 
                  className="w-auto h-16 max-w-[180px] object-contain mb-4"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              )}
              <div className="flex items-center space-x-3 mb-2">
                <Heading level={2} className="font-bold">
                  Invoice {invoice.invoice_number}
                </Heading>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(invoice.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(invoice.status)}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </div>
              </div>
              <Text variant="body" className="text-gray-600">
                Issued on {formatDate(invoice.issue_date)}
              </Text>
            </div>
            {showActions && (
              <div className="flex items-center space-x-2">
                {onDownloadPDF && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Download}
                    onClick={() => {
                      trackInvoiceDownload(invoice.id);
                      onDownloadPDF();
                    }}
                  >
                    Download PDF
                  </Button>
                )}
                {isPayable && onPayNow && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={CreditCard}
                    onClick={onPayNow}
                  >
                    Pay Now
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Heading level={4} className="mb-3 flex items-center">
                <Building className="w-5 h-5 mr-2 text-gray-600" />
                Bill To
              </Heading>
              <div className="bg-gray-50 rounded-lg p-4">
                <Text variant="body" className="font-semibold mb-2">
                  {invoice.accounts?.name || 'Unknown Customer'}
                </Text>
                {invoice.accounts?.address && (
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        {[invoice.accounts.address, invoice.accounts.city, invoice.accounts.state, invoice.accounts.zip_code]
                          .filter(Boolean).join(', ')}
                      </span>
                    </div>
                    {invoice.accounts.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{invoice.accounts.email}</span>
                      </div>
                    )}
                    {invoice.accounts.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{invoice.accounts.phone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Heading level={4} className="mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                Payment Information
              </Heading>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <Text variant="body" className="text-gray-600">
                    Due Date:
                  </Text>
                  <Text variant="body" className={`font-semibold ${isOverdue ? 'text-red-600' : ''}`}>
                    {formatDate(invoice.due_date)}
                  </Text>
                </div>
                <div className="flex justify-between">
                  <Text variant="body" className="text-gray-600">
                    Invoice Total:
                  </Text>
                  <Text variant="body" className="font-semibold">
                    {formatCurrency(Number(invoice.total_amount))}
                  </Text>
                </div>
                {totalPaid > 0 && (
                  <>
                    <div className="flex justify-between">
                      <Text variant="body" className="text-gray-600">
                        Amount Paid:
                      </Text>
                      <Text variant="body" className="font-semibold text-green-600">
                        {formatCurrency(totalPaid)}
                      </Text>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <Text variant="body" className="font-semibold">
                        Remaining Balance:
                      </Text>
                      <Text variant="body" className="font-bold text-orange-600">
                        {formatCurrency(remainingBalance)}
                      </Text>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Invoice Items */}
      <Card className="mb-6">
        <div className="p-6">
          <Heading level={3} className="mb-4">Invoice Items</Heading>
          {!invoice.InvoiceItem || invoice.InvoiceItem.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <Text variant="body" className="text-gray-600">
                No items found
              </Text>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Quantity</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Unit Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.InvoiceItem.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <Text variant="body">{item.description}</Text>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Text variant="body">{item.quantity}</Text>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Text variant="body">{formatCurrency(item.unit_price)}</Text>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Text variant="body" className="font-semibold">
                          {formatCurrency(item.total_price)}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td colSpan={3} className="py-3 px-4 text-right font-semibold">
                      <Text variant="body">Subtotal:</Text>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      <Text variant="body">{formatCurrency(Number(invoice.subtotal))}</Text>
                    </td>
                  </tr>
                  {Number(invoice.tax_amount) > 0 && (
                    <tr>
                      <td colSpan={3} className="py-3 px-4 text-right">
                        <Text variant="body">Tax:</Text>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Text variant="body">{formatCurrency(Number(invoice.tax_amount))}</Text>
                      </td>
                    </tr>
                  )}
                  <tr className="bg-purple-50">
                    <td colSpan={3} className="py-3 px-4 text-right font-bold">
                      <Text variant="body">Total:</Text>
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      <Text variant="body" className="text-purple-600">
                        {formatCurrency(Number(invoice.total_amount))}
                      </Text>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Payment History */}
      {payments.length > 0 && (
        <Card className="mb-6">
          <div className="p-6">
            <Heading level={3} className="mb-4 flex items-center">
              <History className="w-5 h-5 mr-2" />
              Payment History
            </Heading>
            {paymentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
                <Text variant="body" className="ml-3 text-gray-600">
                  Loading payment history...
                </Text>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-4">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <Text variant="body" className="font-semibold">
                          {formatCurrency(Number(payment.amount))}
                        </Text>
                        <Text variant="small" className="text-gray-600">
                          Paid on {formatDate(payment.payment_date)}
                        </Text>
                        {payment.payment_methods && (
                          <Text variant="small" className="text-gray-500">
                            via {payment.payment_methods.payment_name || payment.payment_methods.payment_type}
                          </Text>
                        )}
                      </div>
                    </div>
                    {payment.reference_number && (
                      <Text variant="small" className="text-gray-500">
                        Ref: {payment.reference_number}
                      </Text>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Notes */}
      {invoice.notes && (
        <Card>
          <div className="p-6">
            <Heading level={4} className="mb-3">Notes</Heading>
            <Text variant="body" className="text-gray-700 whitespace-pre-wrap">
              {invoice.notes}
            </Text>
          </div>
        </Card>
      )}
    </div>
  );
}

