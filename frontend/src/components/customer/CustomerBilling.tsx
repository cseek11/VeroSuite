import React, { useState, useMemo } from 'react';
import { DollarSign, CreditCard, FileText, Download, Eye, AlertCircle, CheckCircle, Clock, Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import {
  Typography,
  Button,
  Card,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  account_type: 'commercial' | 'residential';
  ar_balance: number;
  address?: string;
  zip_code?: string;
  company_name?: string;
  contact_person?: string;
  notes?: string;
  status: 'active' | 'prospect' | 'inactive';
  property_type?: string;
  property_size?: string;
  access_instructions?: string;
  emergency_contact?: string;
  preferred_contact_method?: string;
  billing_address?: any;
  payment_method?: string;
  billing_cycle?: string;
  created_at?: string;
  updated_at?: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  amount: number;
  paid_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  description: string;
  items: InvoiceItem[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'ach' | 'check';
  name: string;
  last4?: string;
  brand?: string;
  expiry?: string;
  account?: string;
  bank?: string;
  is_default: boolean;
}

interface CustomerBillingProps {
  customer: Customer;
}

const CustomerBilling: React.FC<CustomerBillingProps> = ({ customer }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceDetails, setShowInvoiceDetails] = useState(false);

  // Mock billing data - replace with actual data
  const mockInvoices: Invoice[] = [
    {
      id: '1',
      invoice_number: 'INV-2024-001',
      issue_date: '2024-01-15',
      due_date: '2024-02-14',
      amount: 150.00,
      paid_amount: 0,
      status: 'overdue',
      description: 'Quarterly Pest Control Service',
      items: [
        {
          id: '1',
          description: 'Pest Control Service',
          quantity: 1,
          unit_price: 150.00,
          total: 150.00
        }
      ]
    },
    {
      id: '2',
      invoice_number: 'INV-2024-002',
      issue_date: '2024-01-10',
      due_date: '2024-02-09',
      amount: 200.00,
      paid_amount: 200.00,
      status: 'paid',
      description: 'Emergency Wasp Nest Removal',
      items: [
        {
          id: '2',
          description: 'Emergency Service',
          quantity: 1,
          unit_price: 200.00,
          total: 200.00
        }
      ]
    },
    {
      id: '3',
      invoice_number: 'INV-2024-003',
      issue_date: '2024-02-01',
      due_date: '2024-03-03',
      amount: 75.00,
      paid_amount: 0,
      status: 'sent',
      description: 'Termite Inspection',
      items: [
        {
          id: '3',
          description: 'Inspection Service',
          quantity: 1,
          unit_price: 75.00,
          total: 75.00
        }
      ]
    }
  ];

  const mockPaymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      last4: '4242',
      brand: 'Visa',
      expiry: '12/25',
      is_default: true
    },
    {
      id: '2',
      type: 'ach',
      name: 'Chase Bank',
      account: '****1234',
      bank: 'Chase Bank',
      is_default: false
    }
  ];

  // Calculate billing statistics
  const billingStats = useMemo(() => {
    const totalInvoiced = mockInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = mockInvoices.reduce((sum, inv) => sum + inv.paid_amount, 0);
    const outstanding = totalInvoiced - totalPaid;
    const overdue = mockInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + (inv.amount - inv.paid_amount), 0);
    const paidInvoices = mockInvoices.filter(inv => inv.status === 'paid').length;
    const overdueInvoices = mockInvoices.filter(inv => inv.status === 'overdue').length;

    return {
      totalInvoiced,
      totalPaid,
      outstanding,
      overdue,
      paidInvoices,
      overdueInvoices,
      totalInvoices: mockInvoices.length
    };
  }, [mockInvoices]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'sent':
        return <Badge variant="secondary">Sent</Badge>;
      case 'paid':
        return <Badge variant="default" className="service-status-completed">Paid</Badge>;
      case 'overdue':
        return <Badge variant="destructive" className="service-status-cancelled">Overdue</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const openInvoiceDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceDetails(true);
  };

  return (
    <div className="space-y-6">
      {/* Billing Overview */}
      <div className="billing-overview">
        <Card className="billing-card">
          <div className="billing-amount">{formatCurrency(billingStats.outstanding)}</div>
          <div className="billing-label">Outstanding Balance</div>
          {billingStats.outstanding > 0 && (
            <div className="billing-status billing-status-overdue">
              <AlertCircle className="w-4 h-4" />
              {billingStats.overdueInvoices} overdue invoices
            </div>
          )}
        </Card>

        <Card className="billing-card">
          <div className="billing-amount">{formatCurrency(billingStats.totalPaid)}</div>
          <div className="billing-label">Total Paid</div>
          <div className="billing-status billing-status-current">
            <CheckCircle className="w-4 h-4" />
            {billingStats.paidInvoices} paid invoices
          </div>
        </Card>

        <Card className="billing-card">
          <div className="billing-amount">{billingStats.totalInvoices}</div>
          <div className="billing-label">Total Invoices</div>
          <div className="billing-status billing-status-current">
            <Clock className="w-4 h-4" />
            {billingStats.overdueInvoices} overdue
          </div>
        </Card>
      </div>

      {/* Billing Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices ({mockInvoices.length})</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods ({mockPaymentMethods.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="p-6">
              <Typography variant="h6" className="mb-4">Recent Billing Activity</Typography>
              <div className="space-y-4">
                {mockInvoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{invoice.invoice_number}</div>
                      <div className="text-sm text-gray-600">{invoice.description}</div>
                      <div className="text-xs text-gray-500">{formatDate(invoice.issue_date)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(invoice.amount)}</div>
                      {getStatusBadge(invoice.status)}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Payment Methods Summary */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Typography variant="h6">Payment Methods</Typography>
                <Button size="sm" variant="outline" onClick={() => setShowAddPaymentMethod(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Method
                </Button>
              </div>
              <div className="space-y-3">
                {mockPaymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-gray-600">
                          {method.type === 'card' ? `${method.brand} •••• ${method.last4}` : method.bank}
                        </div>
                      </div>
                    </div>
                    {method.is_default && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <div className="space-y-4">
            {mockInvoices.map((invoice) => (
              <Card key={invoice.id} className="invoice-item">
                <div className="invoice-header">
                  <div>
                    <div className="invoice-number">{invoice.invoice_number}</div>
                    <div className="text-sm text-gray-600">{invoice.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="invoice-amount">{formatCurrency(invoice.amount)}</div>
                    {getStatusBadge(invoice.status)}
                  </div>
                </div>
                <div className="invoice-details">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Issued: {formatDate(invoice.issue_date)}</span>
                    <span>Due: {formatDate(invoice.due_date)}</span>
                    {invoice.paid_amount > 0 && (
                      <span>Paid: {formatCurrency(invoice.paid_amount)}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openInvoiceDetails(invoice)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Typography variant="h6">Payment Methods</Typography>
              <Button variant="default" onClick={() => setShowAddPaymentMethod(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </div>

            {mockPaymentMethods.map((method) => (
              <Card key={method.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-600">
                        {method.type === 'card' ? `${method.brand} •••• ${method.last4}` : method.bank}
                      </div>
                      {method.expiry && (
                        <div className="text-xs text-gray-500">Expires {method.expiry}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.is_default && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Invoice Details Dialog */}
      <Dialog open={showInvoiceDetails} onOpenChange={setShowInvoiceDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          
          {selectedInvoice && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Invoice Number</label>
                  <div className="mt-1 font-medium">{selectedInvoice.invoice_number}</div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedInvoice.status)}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Issue Date</label>
                  <div className="mt-1">{formatDate(selectedInvoice.issue_date)}</div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Due Date</label>
                  <div className="mt-1">{formatDate(selectedInvoice.due_date)}</div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Total Amount</label>
                  <div className="mt-1 font-semibold text-lg">{formatCurrency(selectedInvoice.amount)}</div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Paid Amount</label>
                  <div className="mt-1">{formatCurrency(selectedInvoice.paid_amount)}</div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <div className="mt-1">{selectedInvoice.description}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Invoice Items</label>
                <div className="mt-2 space-y-2">
                  {selectedInvoice.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{item.description}</div>
                        <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(item.unit_price)}</div>
                        <div className="text-sm text-gray-600">Total: {formatCurrency(item.total)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowInvoiceDetails(false)}>
                  Close
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="default">
                  Send Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddPaymentMethod} onOpenChange={setShowAddPaymentMethod}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Payment Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="ach">Bank Account (ACH)</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Card Number</label>
                <Input placeholder="1234 5678 9012 3456" />
              </div>
              <div>
                <label className="text-sm font-medium">Expiry Date</label>
                <Input placeholder="MM/YY" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">CVV</label>
                <Input placeholder="123" />
              </div>
              <div>
                <label className="text-sm font-medium">Name on Card</label>
                <Input placeholder="John Doe" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="default" />
              <label htmlFor="default" className="text-sm">Set as default payment method</label>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowAddPaymentMethod(false)}>
              Cancel
            </Button>
            <Button>
              Add Payment Method
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerBilling;
