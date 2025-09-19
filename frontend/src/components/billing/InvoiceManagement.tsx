import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Typography,
  Button,
  Input,
  Alert,
  Tabs
} from '@/components/ui/EnhancedUI';
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Calendar,
  DollarSign,
  User,
  Loader2,
  MoreVertical,
  MapPin
} from 'lucide-react';
import { billing } from '@/lib/enhanced-api';
import { Invoice, InvoiceStatus } from '@/types/enhanced-types';
import InvoiceForm from './InvoiceForm';
import InvoiceViewer from './InvoiceViewer';

type TabType = 'all' | 'draft' | 'sent' | 'paid' | 'overdue';

export default function InvoiceManagement() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [showInvoiceViewer, setShowInvoiceViewer] = useState(false);

  const queryClient = useQueryClient();

  // Fetch all invoices
  const { data: invoices = [], isLoading, error, refetch } = useQuery({
    queryKey: ['billing', 'invoices', 'admin'],
    queryFn: () => billing.getInvoices(),
  });

  // Delete invoice mutation
  const deleteInvoiceMutation = useMutation({
    mutationFn: (invoiceId: string) => billing.deleteInvoice(invoiceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
    },
    onError: (error) => {
      console.error('Failed to delete invoice:', error);
    }
  });

  // Update invoice status mutation
  const updateInvoiceStatusMutation = useMutation({
    mutationFn: ({ invoiceId, status }: { invoiceId: string; status: InvoiceStatus }) => 
      billing.updateInvoice(invoiceId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
    },
    onError: (error) => {
      console.error('Failed to update invoice status:', error);
    }
  });

  // Filter invoices based on active tab and search
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.accounts?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || invoice.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  // Calculate statistics
  const stats = {
    total: invoices.length,
    draft: invoices.filter(inv => inv.status === 'draft').length,
    sent: invoices.filter(inv => inv.status === 'sent').length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    totalAmount: invoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0),
    paidAmount: invoices.filter(inv => inv.status === 'paid')
                        .reduce((sum, inv) => sum + Number(inv.total_amount), 0),
    outstandingAmount: invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue')
                              .reduce((sum, inv) => sum + Number(inv.total_amount), 0)
  };

  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'sent':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: InvoiceStatus) => {
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

  const handleDeleteInvoice = async (invoice: Invoice) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.invoice_number}?`)) {
      await deleteInvoiceMutation.mutateAsync(invoice.id);
    }
  };

  const handleUpdateStatus = async (invoice: Invoice, newStatus: InvoiceStatus) => {
    await updateInvoiceStatusMutation.mutateAsync({
      invoiceId: invoice.id,
      status: newStatus
    });
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceForm(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceViewer(true);
  };

  const tabs = [
    { id: 'all' as TabType, label: 'All Invoices', count: stats.total },
    { id: 'draft' as TabType, label: 'Draft', count: stats.draft },
    { id: 'sent' as TabType, label: 'Sent', count: stats.sent },
    { id: 'paid' as TabType, label: 'Paid', count: stats.paid },
    { id: 'overdue' as TabType, label: 'Overdue', count: stats.overdue }
  ];

  const renderInvoiceCard = (invoice: Invoice) => (
    <div
      key={invoice.id}
      className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <FileText className="w-5 h-5 text-gray-600" />
            <div>
              <Typography variant="h4" className="font-semibold">
                {invoice.invoice_number}
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {invoice.accounts?.name || 'Unknown Customer'}
              </Typography>
              {invoice.accounts?.address && (
                <Typography variant="body2" className="text-gray-500 text-xs mt-1 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {[invoice.accounts.address, invoice.accounts.city, invoice.accounts.state, invoice.accounts.zip_code]
                    .filter(Boolean).join(', ')}
                </Typography>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(invoice.status)}
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Issue Date</div>
              <div className="font-medium flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(invoice.issue_date).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Due Date</div>
              <div className="font-medium flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(invoice.due_date).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Amount</div>
              <div className="font-semibold text-lg flex items-center">
                <DollarSign className="w-4 h-4 mr-1" />
                ${Number(invoice.total_amount).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Customer</div>
              <div className="font-medium flex items-center">
                <User className="w-4 h-4 mr-1" />
                {invoice.accounts?.name || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={() => handleViewInvoice(invoice)}
          >
            View
          </Button>
          
          {invoice.status === 'draft' && (
            <Button
              variant="outline"
              size="sm"
              icon={Edit}
              onClick={() => handleEditInvoice(invoice)}
            >
              Edit
            </Button>
          )}

          <div className="relative group">
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {invoice.status === 'draft' && (
                <button
                  onClick={() => handleUpdateStatus(invoice, 'sent')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Invoice
                </button>
              )}
              {invoice.status === 'sent' && (
                <button
                  onClick={() => handleUpdateStatus(invoice, 'paid')}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Paid
                </button>
              )}
              <button
                onClick={() => handleDeleteInvoice(invoice)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h1" className="font-bold text-gray-900">
            Invoice Management
          </Typography>
          <Typography variant="body1" className="text-gray-600 mt-2">
            Create, manage, and track all customer invoices
          </Typography>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingInvoice(null);
            setShowInvoiceForm(true);
          }}
          icon={Plus}
        >
          Create Invoice
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-blue-700 font-medium">
                  Total Revenue
                </Typography>
                <Typography variant="h2" className="text-blue-800 font-bold mt-1">
                  ${stats.totalAmount.toFixed(2)}
                </Typography>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-green-700 font-medium">
                  Paid Amount
                </Typography>
                <Typography variant="h2" className="text-green-800 font-bold mt-1">
                  ${stats.paidAmount.toFixed(2)}
                </Typography>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-orange-700 font-medium">
                  Outstanding
                </Typography>
                <Typography variant="h2" className="text-orange-800 font-bold mt-1">
                  ${stats.outstandingAmount.toFixed(2)}
                </Typography>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-purple-700 font-medium">
                  Total Invoices
                </Typography>
                <Typography variant="h2" className="text-purple-800 font-bold mt-1">
                  {stats.total}
                </Typography>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
              <Button variant="outline" size="sm" icon={Download}>
                Export
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Invoice List */}
      <Card>
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Loading invoices...</span>
            </div>
          ) : error ? (
            <Alert type="error" title="Error Loading Invoices">
              Unable to load invoices. Please try again later.
              <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-3">
                Retry
              </Button>
            </Alert>
          ) : filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <Typography variant="h4" className="text-gray-500 mb-2">
                {invoices.length === 0 ? 'No invoices found' : 'No invoices match your filters'}
              </Typography>
              <Typography variant="body2" className="text-gray-400 mb-6">
                {invoices.length === 0 
                  ? "Get started by creating your first invoice." 
                  : "Try adjusting your search or filter criteria."}
              </Typography>
              {invoices.length === 0 && (
                <Button
                  variant="primary"
                  onClick={() => setShowInvoiceForm(true)}
                  icon={Plus}
                >
                  Create First Invoice
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInvoices.map(renderInvoiceCard)}
            </div>
          )}
        </div>
      </Card>

      {/* Invoice Form Modal */}
      {showInvoiceForm && (
        <InvoiceForm
          invoice={editingInvoice}
          isOpen={showInvoiceForm}
          onClose={() => {
            setShowInvoiceForm(false);
            setEditingInvoice(null);
          }}
          onSuccess={() => {
            setShowInvoiceForm(false);
            setEditingInvoice(null);
            queryClient.invalidateQueries({ queryKey: ['billing'] });
          }}
        />
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
        />
      )}
    </div>
  );
}
