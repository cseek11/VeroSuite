/**
 * Invoice View Component
 * Comprehensive invoice viewing interface with list, detail, and actions
 * 
 * Last Updated: 2025-12-06
 */

import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Heading, Text } from '@/components/ui';
import {
  Search,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { Invoice } from '@/types/enhanced-types';
import { logger } from '@/utils/logger';
import { toast } from '@/utils/toast';
import InvoiceList from './InvoiceList';
import type { InvoiceStatusFilter } from './InvoiceList';
import InvoiceDetail from './InvoiceDetail';
import InvoiceViewer from './InvoiceViewer';
import PaymentForm from './PaymentForm';
import { InvoiceListSkeleton } from './BillingSkeletons';

interface InvoiceViewProps {
  customerId?: string;
  initialInvoiceId?: string;
  className?: string;
}

export default function InvoiceView({
  customerId,
  initialInvoiceId,
  className = '',
}: InvoiceViewProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'viewer'>('list');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch invoices
  const { data: invoicesData, isLoading, error, refetch } = useQuery<Invoice[]>({
    queryKey: ['billing', 'invoices', customerId || 'all'],
    queryFn: () => billing.getInvoices(customerId),
  });

  if (error) {
    logger.error('Failed to fetch invoices', error, 'InvoiceView');
    toast.error('Failed to load invoices. Please try again.');
  }

  const invoices: Invoice[] = Array.isArray(invoicesData) ? invoicesData : [];

  // Fetch payment methods for payment form
  const { data: paymentMethods = [] } = useQuery({
    queryKey: ['billing', 'payment-methods', customerId || 'all'],
    queryFn: () => billing.getPaymentMethods(customerId),
    enabled: showPaymentForm && !!selectedInvoice,
  });

  // Set initial invoice if provided
  useEffect(() => {
    if (initialInvoiceId && invoices.length > 0 && !selectedInvoice) {
      const invoice = invoices.find((inv: Invoice) => inv.id === initialInvoiceId);
      if (invoice) {
        setSelectedInvoice(invoice);
        setViewMode('detail');
      }
    }
  }, [initialInvoiceId, invoices, selectedInvoice]);

  // Filter invoices based on search and status
  const filteredInvoices = useMemo(() => {
    if (!Array.isArray(invoices)) {
      return [];
    }

    let filtered = [...invoices];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(invoice =>
        invoice.invoice_number.toLowerCase().includes(searchLower) ||
        invoice.accounts?.name?.toLowerCase().includes(searchLower) ||
        invoice.total_amount.toString().includes(searchTerm)
      );
    }

    return filtered;
  }, [invoices, statusFilter, searchTerm]);

  const handleInvoiceSelect = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setViewMode('detail');
  };

  // const _handleViewInvoice = (invoice: Invoice) => {
  //   setSelectedInvoice(invoice);
  //   setViewMode('viewer');
  // };

  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setSelectedInvoice(null);
    refetch();
    toast.success('Payment processed successfully');
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedInvoice(null);
  };

  const handleDownloadPDF = async () => {
    if (!selectedInvoice) return;

    try {
      // Use InvoiceViewer's PDF download functionality
      // This will be handled by the InvoiceViewer component
      toast.info('Preparing PDF download...');
    } catch (error) {
      logger.error('Failed to download PDF', error, 'InvoiceView');
      toast.error('Failed to download invoice PDF');
    }
  };

  if (isLoading) {
    return (
      <div className={className}>
        <InvoiceListSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <Heading level={3} className="mb-2">Failed to Load Invoices</Heading>
          <Text variant="body" className="text-gray-600 mb-4">
            There was an error loading invoices. Please try again.
          </Text>
          <Button variant="primary" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  // Detail/Viewer Mode
  if (viewMode === 'detail' && selectedInvoice) {
    return (
      <div className={className}>
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            icon={ArrowLeft}
            onClick={handleBackToList}
          >
            Back to Invoices
          </Button>
        </div>
        <InvoiceDetail
          invoice={selectedInvoice}
          onPayNow={() => handlePayInvoice(selectedInvoice)}
          onDownloadPDF={handleDownloadPDF}
          showActions={true}
        />
      </div>
    );
  }

  // Viewer Mode (Modal)
  if (viewMode === 'viewer' && selectedInvoice) {
    return (
      <>
        <InvoiceViewer
          invoice={selectedInvoice}
          isOpen={true}
          onClose={handleBackToList}
          onPayNow={() => {
            setViewMode('list');
            handlePayInvoice(selectedInvoice);
          }}
        />
      </>
    );
  }

  // List Mode (Default)
  return (
    <div className={className}>
      {/* Header with Search and Filters */}
      <Card className="mb-6">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <Heading level={2} className="mb-2">Invoices</Heading>
              <Text variant="body" className="text-gray-600">
                {filteredInvoices.length} {filteredInvoices.length === 1 ? 'invoice' : 'invoices'} found
              </Text>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="flex-1 sm:flex-initial min-w-[200px]">
                <Input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={Search}
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as InvoiceStatusFilter)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Invoice List */}
      <InvoiceList
        {...(customerId ? { customerId } : {})}
        onInvoiceSelect={handleInvoiceSelect}
        onInvoicePay={handlePayInvoice}
        showActions={true}
      />

      {/* Payment Form Dialog */}
      {showPaymentForm && selectedInvoice && (
        <Dialog open={showPaymentForm} onOpenChange={setShowPaymentForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pay Invoice {selectedInvoice.invoice_number}</DialogTitle>
            </DialogHeader>
            <PaymentForm
              invoice={selectedInvoice}
              paymentMethods={paymentMethods}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

