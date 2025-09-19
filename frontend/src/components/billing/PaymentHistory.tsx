import React, { useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Input,
  Alert
} from '@/components/ui/EnhancedUI';
import {
  History,
  Download,
  Search,
  Filter,
  Calendar,
  DollarSign,
  CheckCircle,
  CreditCard,
  FileText,
  Eye,
  Loader2,
  Receipt
} from 'lucide-react';
import { Payment } from '@/types/enhanced-types';

interface PaymentHistoryProps {
  payments: Payment[];
  isLoading: boolean;
  customerId: string;
}

export default function PaymentHistory({ payments, isLoading, customerId }: PaymentHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | '30days' | '90days' | '1year'>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Filter payments based on search and date filters
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.Invoice?.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const paymentDate = new Date(payment.payment_date);
      const now = new Date();
      const daysAgo = dateFilter === '30days' ? 30 : dateFilter === '90days' ? 90 : 365;
      const filterDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      matchesDate = paymentDate >= filterDate;
    }
    
    return matchesSearch && matchesDate;
  });

  // Calculate totals
  const totalPaid = filteredPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const paymentsThisMonth = payments.filter(payment => {
    const paymentDate = new Date(payment.payment_date);
    const now = new Date();
    return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
  });
  const totalThisMonth = paymentsThisMonth.reduce((sum, payment) => sum + Number(payment.amount), 0);

  const getPaymentMethodDisplay = (payment: Payment) => {
    if (payment.payment_methods) {
      return payment.payment_methods.payment_name || 
             `${payment.payment_methods.card_type} ****${payment.payment_methods.card_last4}`;
    }
    return 'Payment Method';
  };

  const handleDownloadReceipt = (payment: Payment) => {
    // In a real implementation, this would generate and download a PDF receipt
    console.log('Downloading receipt for payment:', payment.id);
  };

  const renderPaymentCard = (payment: Payment) => (
    <div
      key={payment.id}
      className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <Typography variant="h4" className="font-semibold">
                Payment #{payment.reference_number || payment.id.slice(-8)}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {new Date(payment.payment_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Typography>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Amount Paid</div>
              <div className="font-semibold text-lg text-green-800">
                ${Number(payment.amount).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Invoice</div>
              <div className="font-medium">
                {payment.Invoice?.invoice_number || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Payment Method</div>
              <div className="font-medium flex items-center">
                <CreditCard className="w-4 h-4 mr-1" />
                {getPaymentMethodDisplay(payment)}
              </div>
            </div>
          </div>

          {payment.notes && (
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="text-sm text-gray-600 mb-1">Notes</div>
              <div className="text-sm">{payment.notes}</div>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            icon={Receipt}
            onClick={() => handleDownloadReceipt(payment)}
          >
            Receipt
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={() => setSelectedPayment(payment)}
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-green-700 font-medium">
                  Total Paid
                </Typography>
                <Typography variant="h2" className="text-green-800 font-bold mt-1">
                  ${totalPaid.toFixed(2)}
                </Typography>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-blue-700 font-medium">
                  This Month
                </Typography>
                <Typography variant="h2" className="text-blue-800 font-bold mt-1">
                  ${totalThisMonth.toFixed(2)}
                </Typography>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-purple-700 font-medium">
                  Total Payments
                </Typography>
                <Typography variant="h2" className="text-purple-800 font-bold mt-1">
                  {filteredPayments.length}
                </Typography>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <History className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <Typography variant="h3" className="font-semibold">
              Payment History
            </Typography>
            
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
              
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </select>
              
              <Button variant="outline" size="sm" icon={Download}>
                Export
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Payment List */}
      <Card>
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Loading payment history...</span>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <Typography variant="h4" className="text-gray-500 mb-2">
                {payments.length === 0 ? 'No payments found' : 'No payments match your filters'}
              </Typography>
              <Typography variant="body2" className="text-gray-400">
                {payments.length === 0 
                  ? "You haven't made any payments yet." 
                  : "Try adjusting your search or date filters."}
              </Typography>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPayments.map(renderPaymentCard)}
            </div>
          )}
        </div>
      </Card>

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <Typography variant="h3" className="font-semibold">
                  Payment Details
                </Typography>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPayment(null)}
                >
                  ×
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Payment ID</div>
                  <div className="font-medium">{selectedPayment.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Reference Number</div>
                  <div className="font-medium">
                    {selectedPayment.reference_number || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Amount</div>
                  <div className="font-semibold text-lg text-green-800">
                    ${Number(selectedPayment.amount).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Payment Date</div>
                  <div className="font-medium">
                    {new Date(selectedPayment.payment_date).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Invoice</div>
                  <div className="font-medium">
                    {selectedPayment.Invoice?.invoice_number || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Payment Method</div>
                      <div className="font-medium">
                        {selectedPayment.payment_methods?.payment_name || 
                         `${selectedPayment.payment_methods?.card_type} ****${selectedPayment.payment_methods?.card_last4}` ||
                         'Payment Method'}
                      </div>
                </div>
              </div>

              {selectedPayment.notes && (
                <div>
                  <div className="text-sm text-gray-600 mb-2">Notes</div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    {selectedPayment.notes}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    // In a real implementation, this would generate and download a PDF receipt
                    console.log('Downloading receipt for payment:', selectedPayment.id);
                  }}
                  icon={Download}
                >
                  Download Receipt
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setSelectedPayment(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
