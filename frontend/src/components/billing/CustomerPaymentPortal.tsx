import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Typography,
  Button,
  Alert,
  Tabs
} from '@/components/ui/EnhancedUI';
import {
  CreditCard,
  FileText,
  History,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Eye,
  ArrowLeft,
  Loader2,
  Shield
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { Invoice, Payment, PaymentMethod } from '@/types/enhanced-types';
import InvoiceViewer from './InvoiceViewer';
import PaymentForm from './PaymentForm';
import PaymentHistory from './PaymentHistory';

interface CustomerPaymentPortalProps {
  customerId: string;
  onClose?: () => void;
}

type TabType = 'invoices' | 'payment' | 'history';

export default function CustomerPaymentPortal({ customerId, onClose }: CustomerPaymentPortalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const queryClient = useQueryClient();

  // Fetch customer invoices
  const { data: invoices = [], isLoading: invoicesLoading, error: invoicesError } = useQuery({
    queryKey: ['billing', 'invoices', customerId],
    queryFn: () => billing.getInvoices(customerId),
    enabled: !!customerId,
  });

  // Fetch customer payments
  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['billing', 'payments', customerId],
    queryFn: () => billing.getPayments(),
    enabled: !!customerId,
  });

  // Fetch payment methods
  const { data: paymentMethods = [], isLoading: paymentMethodsLoading } = useQuery({
    queryKey: ['billing', 'payment-methods', customerId],
    queryFn: () => billing.getPaymentMethods(customerId),
    enabled: !!customerId,
  });

  // Calculate outstanding balance
  const outstandingInvoices = invoices.filter(invoice => 
    invoice.status === 'sent' || invoice.status === 'overdue'
  );
  const totalOutstanding = outstandingInvoices.reduce((sum, invoice) => 
    sum + Number(invoice.total_amount), 0
  );

  // Get overdue invoices
  const overdueInvoices = invoices.filter(invoice => {
    if (invoice.status !== 'sent' && invoice.status !== 'overdue') return false;
    return new Date(invoice.due_date) < new Date();
  });

  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentForm(true);
    setActiveTab('payment');
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setSelectedInvoice(null);
    queryClient.invalidateQueries({ queryKey: ['billing'] });
    setActiveTab('history');
  };

  const tabs = [
    {
      id: 'invoices' as TabType,
      label: 'Invoices',
      icon: FileText,
      component: (
        <div className="space-y-6">
          {/* Outstanding Balance Summary */}
          {totalOutstanding > 0 && (
            <Card className="border-l-4 border-l-orange-500 bg-orange-50">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="h4" className="text-orange-800 font-semibold">
                      Outstanding Balance
                    </Typography>
                    <Typography variant="h2" className="text-orange-900 font-bold mt-2">
                      ${totalOutstanding.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" className="text-orange-700 mt-1">
                      {outstandingInvoices.length} unpaid invoice{outstandingInvoices.length !== 1 ? 's' : ''}
                      {overdueInvoices.length > 0 && (
                        <span className="text-red-600 font-medium">
                          {' • '}{overdueInvoices.length} overdue
                        </span>
                      )}
                    </Typography>
                  </div>
                  <div className="text-right">
                    <Button
                      variant="primary"
                      size="lg"
                      icon={CreditCard}
                      onClick={() => setActiveTab('payment')}
                      className="shadow-lg"
                    >
                      Pay Now
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Invoices List */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Typography variant="h3" className="font-semibold">
                  Your Invoices
                </Typography>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" icon={Download}>
                    Export
                  </Button>
                </div>
              </div>

              {invoicesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="ml-3 text-gray-600">Loading invoices...</span>
                </div>
              ) : invoicesError ? (
                <Alert type="error" title="Error Loading Invoices">
                  Unable to load your invoices. Please try again later.
                </Alert>
              ) : invoices.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <Typography variant="h4" className="text-gray-500 mb-2">
                    No invoices found
                  </Typography>
                  <Typography variant="body2" className="text-gray-400">
                    You don't have any invoices at the moment.
                  </Typography>
                </div>
              ) : (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <Typography variant="h4" className="font-semibold">
                              {invoice.invoice_number}
                            </Typography>
                            <div className="flex items-center space-x-2">
                              {invoice.status === 'paid' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Paid
                                </span>
                              )}
                              {invoice.status === 'sent' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Pending
                                </span>
                              )}
                              {invoice.status === 'overdue' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Overdue
                                </span>
                              )}
                              {invoice.status === 'draft' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  Draft
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              Due: {new Date(invoice.due_date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              ${Number(invoice.total_amount).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={Eye}
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            View
                          </Button>
                          {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={CreditCard}
                              onClick={() => handlePayInvoice(invoice)}
                            >
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'payment' as TabType,
      label: 'Make Payment',
      icon: CreditCard,
      component: (
        <div className="space-y-6">
          {showPaymentForm && selectedInvoice ? (
            <PaymentForm
              invoice={selectedInvoice}
              paymentMethods={paymentMethods}
              onSuccess={handlePaymentSuccess}
              onCancel={() => {
                setShowPaymentForm(false);
                setSelectedInvoice(null);
                setActiveTab('invoices');
              }}
            />
          ) : (
            <Card>
              <div className="p-6">
                <Typography variant="h3" className="font-semibold mb-4">
                  Make a Payment
                </Typography>
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <Typography variant="h4" className="text-gray-500 mb-2">
                    Select an invoice to pay
                  </Typography>
                  <Typography variant="body2" className="text-gray-400 mb-6">
                    Choose an invoice from the Invoices tab to make a payment.
                  </Typography>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('invoices')}
                    icon={ArrowLeft}
                  >
                    View Invoices
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )
    },
    {
      id: 'history' as TabType,
      label: 'Payment History',
      icon: History,
      component: (
        <PaymentHistory
          payments={payments}
          isLoading={paymentsLoading}
          customerId={customerId}
        />
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Typography variant="h1" className="font-bold text-gray-900">
            Payment Portal
          </Typography>
          <Typography variant="body1" className="text-gray-600 mt-2">
            Manage your invoices and payments securely
          </Typography>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose} icon={ArrowLeft}>
            Back
          </Button>
        )}
      </div>

      {/* Security Notice */}
      <Alert type="info" className="mb-6">
        <div className="flex items-center">
          <Shield className="w-5 h-5 mr-2" />
          <span className="font-medium">Secure Payment Processing</span>
        </div>
        <div className="mt-1 text-sm">
          Your payment information is protected with bank-level security and encryption.
        </div>
      </Alert>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        active={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as TabType)}
        variant="pills"
        size="lg"
        className="mb-8"
      />

      {/* Tab Content */}
      <div className="tab-content">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>

      {/* Invoice Viewer Modal */}
      {selectedInvoice && !showPaymentForm && (
        <InvoiceViewer
          invoice={selectedInvoice}
          isOpen={true}
          onClose={() => setSelectedInvoice(null)}
          onPayNow={() => handlePayInvoice(selectedInvoice)}
        />
      )}
    </div>
  );
}
