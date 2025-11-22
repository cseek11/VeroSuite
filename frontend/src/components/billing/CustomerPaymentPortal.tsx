import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Tabs,
  Typography,
  Heading,
  Text,
} from '@/components/ui';
import {
  CreditCard,
  FileText,
  History,
  ArrowLeft,
  X,
  Settings
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { Invoice } from '@/types/enhanced-types';
import { trackPaymentInitiated } from '@/lib/billing-analytics';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import InvoiceViewer from './InvoiceViewer';
import PaymentForm from './PaymentForm';
import InvoiceList from './InvoiceList';
import InvoiceDetail from './InvoiceDetail';
import PaymentMethodManager from './PaymentMethodManager';
import CustomerPaymentHistory from './CustomerPaymentHistory';
import { BillingErrorBoundary } from './BillingErrorBoundary';

interface CustomerPaymentPortalProps {
  customerId: string;
  onClose?: () => void;
}

type TabType = 'invoices' | 'payment' | 'history' | 'payment-methods';

export default function CustomerPaymentPortal({ customerId, onClose }: CustomerPaymentPortalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showInvoiceDetail, setShowInvoiceDetail] = useState(false);
  const [showInvoiceViewer, setShowInvoiceViewer] = useState(false);
  const queryClient = useQueryClient();

  // Fetch customer invoices (for finding invoice by ID in handlers)
  const { data: invoices = [], error: invoicesError, isLoading: invoicesLoading } = useQuery({
    queryKey: ['billing', 'invoices', customerId],
    queryFn: () => billing.getInvoices(customerId),
    enabled: !!customerId,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fetch payment methods
  const { data: paymentMethods = [], error: paymentMethodsError, isLoading: paymentMethodsLoading } = useQuery({
    queryKey: ['billing', 'payment-methods', customerId],
    queryFn: () => billing.getPaymentMethods(customerId),
    enabled: !!customerId,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load payment methods';
      logger.error('Failed to fetch payment methods', error, 'CustomerPaymentPortal');
      toast.error(`Unable to load payment methods. ${errorMessage}. Please try again or contact support.`);
    },
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

  const handleInvoiceSelect = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetail(true);
  };

  const handleInvoicePay = (invoice: Invoice) => {
    trackPaymentInitiated(
      invoice.id,
      Number(invoice.total_amount),
      undefined,
      customerId
    );
    setSelectedInvoice(invoice);
    setShowPaymentForm(true);
    setActiveTab('payment');
  };

  const handleInvoiceView = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceViewer(true);
  };

  const handleDownloadPDF = async () => {
    if (selectedInvoice) {
      // Trigger PDF download from InvoiceViewer
      setShowInvoiceViewer(true);
    }
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
          
          {invoicesError ? (
            <Card className="bg-red-50 border-red-200">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <Heading level={4} className="text-red-800 mb-2">
                      Failed to Load Invoices
                    </Heading>
                    <Text className="text-red-700 mb-4">
                      {invoicesError instanceof Error ? invoicesError.message : 'Unable to load invoices. Please try refreshing the page or contact support.'}
                    </Text>
                    <Button
                      variant="outline"
                      onClick={() => queryClient.invalidateQueries({ queryKey: ['billing', 'invoices', customerId] })}
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <InvoiceList
              customerId={customerId}
              onInvoiceSelect={handleInvoiceSelect}
              onInvoicePay={handleInvoicePay}
              showActions={true}
            />
          )}
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
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <Typography variant="h4" className="text-gray-500 mb-2">
                    Select an invoice to pay
                  </Typography>
                  <Typography variant="body2" className="text-gray-400 mb-4">
                    Go to the Invoices tab to select an invoice for payment.
                  </Typography>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveTab('invoices')}
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
        <CustomerPaymentHistory
          customerId={customerId}
          onInvoiceClick={(invoiceId) => {
            const invoice = invoices.find(inv => inv.id === invoiceId);
            if (invoice) {
              handleInvoiceView(invoice);
            }
          }}
        />
      )
    },
    {
      id: 'payment-methods' as TabType,
      label: 'Payment Methods',
      icon: Settings,
      component: (
        <div>
          {paymentMethodsError ? (
            <Card className="bg-red-50 border-red-200">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <X className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="ml-3 flex-1">
                    <Heading level={4} className="text-red-800 mb-2">
                      Failed to Load Payment Methods
                    </Heading>
                    <Text className="text-red-700 mb-4">
                      {paymentMethodsError instanceof Error ? paymentMethodsError.message : 'Unable to load payment methods. Please try refreshing the page or contact support.'}
                    </Text>
                    <Button
                      variant="outline"
                      onClick={() => queryClient.invalidateQueries({ queryKey: ['billing', 'payment-methods', customerId] })}
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <PaymentMethodManager
              customerId={customerId}
              onPaymentMethodSelected={(method) => {
                // When a payment method is selected, switch to payment tab
                setActiveTab('payment');
              }}
            />
          )}
        </div>
      )
    }
  ];

  // Show loading state while initial data is being fetched
  if (invoicesLoading || paymentMethodsLoading) {
    return (
      <BillingErrorBoundary
        context="CustomerPaymentPortal"
        onBack={onClose}
      >
        <div className="w-full">
          {onClose && (
            <div className="flex items-center justify-between mb-6">                                    
              <Button
                variant="outline"
                size="sm"
                icon={ArrowLeft}
                onClick={onClose}
              >
                Back
              </Button>
            </div>
          )}
          <Card>
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <Text className="text-gray-600">Loading customer billing information...</Text>
            </div>
          </Card>
        </div>
      </BillingErrorBoundary>
    );
  }

  return (
    <BillingErrorBoundary
      context="CustomerPaymentPortal"
      onBack={onClose}
    >
      <div className="w-full">
        {onClose && (
          <div className="flex items-center justify-between mb-6">                                    
            <Button
              variant="outline"
              size="sm"
              icon={ArrowLeft}
              onClick={onClose}
            >
              Back
            </Button>
          </div>
        )}

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}                                        
          tabs={tabs}
        />

        {/* Render active tab content */}
        <div className="mt-6">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>

      {/* Invoice Detail Modal */}
      {showInvoiceDetail && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <Heading level={3}>Invoice Details</Heading>
              <button
                onClick={() => {
                  setShowInvoiceDetail(false);
                  setSelectedInvoice(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <InvoiceDetail
                invoice={selectedInvoice}
                onPayNow={() => {
                  setShowInvoiceDetail(false);
                  handleInvoicePay(selectedInvoice);
                }}
                onDownloadPDF={handleDownloadPDF}
                showActions={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Invoice Viewer Modal */}
      {showInvoiceViewer && selectedInvoice && (
        <InvoiceViewer
          invoice={selectedInvoice}
          isOpen={showInvoiceViewer}
          onClose={() => {
            setShowInvoiceViewer(false);
            setSelectedInvoice(null);
          }}
          onPayNow={() => {
            setShowInvoiceViewer(false);
            handleInvoicePay(selectedInvoice);
          }}
        />
      )}
      </div>
    </BillingErrorBoundary>
  );
}
