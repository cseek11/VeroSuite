import React, { useState } from 'react';
import { DollarSign, CreditCard, FileText, AlertCircle, CheckCircle, Clock, Download } from 'lucide-react';
import { Button, Typography, Badge } from '@/components/ui';

interface CustomerFinancialsProps {
  customerId: string;
}

const CustomerFinancials: React.FC<CustomerFinancialsProps> = ({ customerId }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const billingOverview = {
    currentBalance: 1250.00,
    pastDue: 450.00,
    lastPayment: 300.00,
    lastPaymentDate: '2023-12-28',
    nextBillingDate: '2024-01-15',
    paymentMethod: 'Credit Card ending in 1234'
  };

  const invoices = [
    {
      id: 'INV-001',
      date: '2023-12-15',
      dueDate: '2024-01-15',
      amount: 450.00,
      status: 'past_due',
      description: 'Quarterly Pest Control Service'
    },
    {
      id: 'INV-002',
      date: '2023-11-15',
      dueDate: '2023-12-15',
      amount: 300.00,
      status: 'paid',
      description: 'Emergency Spider Treatment'
    },
    {
      id: 'INV-003',
      date: '2023-10-15',
      dueDate: '2023-11-15',
      amount: 500.00,
      status: 'paid',
      description: 'Quarterly Pest Control Service'
    }
  ];

  const paymentHistory = [
    {
      id: 1,
      date: '2023-12-28',
      amount: 300.00,
      method: 'Credit Card',
      reference: 'TXN-12345',
      status: 'completed'
    },
    {
      id: 2,
      date: '2023-11-20',
      amount: 500.00,
      method: 'Credit Card',
      reference: 'TXN-12344',
      status: 'completed'
    },
    {
      id: 3,
      date: '2023-10-18',
      amount: 450.00,
      method: 'Credit Card',
      reference: 'TXN-12343',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'past_due':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'past_due':
        return <AlertCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Typography variant="h3" className="text-lg font-semibold text-gray-900">
          Financial Information
        </Typography>
        <Button size="sm" className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Process Payment
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'invoices'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'payments'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Payments ({paymentHistory.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className="text-xl font-semibold text-gray-900">${billingOverview.currentBalance.toFixed(2)}</p>
                </div>
              </div>
              {billingOverview.pastDue > 0 && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  ${billingOverview.pastDue.toFixed(2)} past due
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Payment</p>
                  <p className="text-xl font-semibold text-gray-900">${billingOverview.lastPayment.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {new Date(billingOverview.lastPaymentDate).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Billing</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {new Date(billingOverview.nextBillingDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg p-4 border border-gray-200/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Payment Method</h4>
                <p className="text-sm text-gray-600">{billingOverview.paymentMethod}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Update Payment Method
              </Button>
              <Button variant="outline" size="sm">
                View All Methods
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="space-y-3">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="bg-white rounded-lg p-4 border border-gray-200/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{invoice.id}</h4>
                    <p className="text-sm text-gray-600">{invoice.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">${invoice.amount.toFixed(2)}</p>
                  <Badge className={getStatusColor(invoice.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(invoice.status)}
                      {invoice.status === 'past_due' ? 'Past Due' : 
                       invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </div>
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2 text-gray-900">{new Date(invoice.date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Due Date:</span>
                  <span className="ml-2 text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                {invoice.status === 'past_due' && (
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">
                    Pay Now
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-3">
          {paymentHistory.map((payment) => (
            <div key={payment.id} className="bg-white rounded-lg p-4 border border-gray-200/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{payment.reference}</h4>
                    <p className="text-sm text-gray-600">{payment.method}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">${payment.amount.toFixed(2)}</p>
                  <Badge className={getStatusColor(payment.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(payment.status)}
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </div>
                  </Badge>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                {new Date(payment.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerFinancials;


