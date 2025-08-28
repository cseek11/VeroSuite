import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Button, 
  Input, 
  Dropdown
} from '@/components/ui/EnhancedUI';
import Select from '@/components/ui/Select';
import { Badge } from '@/components/ui/CRMComponents';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  FileText, 
  Receipt, 
  BarChart3, 
  PieChart, 
  Calendar,
  Plus,
  Download,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

// Mock data for charts and financial data
const mockFinancialData = {
  revenue: {
    current: 125000,
    previous: 98000,
    change: '+27.6%'
  },
  expenses: {
    current: 45000,
    previous: 52000,
    change: '-13.5%'
  },
  profit: {
    current: 80000,
    previous: 46000,
    change: '+73.9%'
  },
  outstanding: {
    current: 35000,
    previous: 42000,
    change: '-16.7%'
  }
};

const mockRevenueData = [
  { month: 'Jan', revenue: 85000, expenses: 32000 },
  { month: 'Feb', revenue: 92000, expenses: 35000 },
  { month: 'Mar', revenue: 78000, expenses: 28000 },
  { month: 'Apr', revenue: 105000, expenses: 42000 },
  { month: 'May', revenue: 115000, expenses: 45000 },
  { month: 'Jun', revenue: 125000, expenses: 45000 }
];

const mockInvoices = [
  {
    id: 'INV-001',
    customer: 'ABC Pest Control',
    amount: 2500,
    status: 'paid',
    dueDate: '2024-01-15',
    type: 'service'
  },
  {
    id: 'INV-002',
    customer: 'XYZ Exterminators',
    amount: 1800,
    status: 'pending',
    dueDate: '2024-01-20',
    type: 'service'
  },
  {
    id: 'INV-003',
    customer: 'City Maintenance',
    amount: 3200,
    status: 'overdue',
    dueDate: '2024-01-10',
    type: 'service'
  },
  {
    id: 'INV-004',
    customer: 'Office Complex Ltd',
    amount: 4500,
    status: 'paid',
    dueDate: '2024-01-25',
    type: 'maintenance'
  }
];

const mockExpenses = [
  {
    id: 'EXP-001',
    category: 'Equipment',
    description: 'Pest control chemicals',
    amount: 1200,
    date: '2024-01-15',
    status: 'approved'
  },
  {
    id: 'EXP-002',
    category: 'Vehicle',
    description: 'Fuel for service vehicles',
    amount: 450,
    date: '2024-01-14',
    status: 'pending'
  },
  {
    id: 'EXP-003',
    category: 'Office',
    description: 'Office supplies',
    amount: 180,
    date: '2024-01-13',
    status: 'approved'
  }
];

const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: PieChart }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredInvoices = mockInvoices.filter(invoice => 
    invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterStatus === 'all' || invoice.status === filterStatus)
  );

  const filteredExpenses = mockExpenses.filter(expense =>
    expense.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterStatus === 'all' || expense.status === filterStatus)
  );

  // Simple chart component using CSS gradients
  const RevenueChart = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="h6" className="text-gray-900">Revenue vs Expenses</Typography>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>Expenses</span>
          </div>
        </div>
      </div>
      <div className="h-48 flex items-end justify-between gap-2">
        {mockRevenueData.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="w-full flex flex-col-reverse gap-1 mb-2">
              <div 
                className="bg-purple-500 rounded-t"
                style={{ height: `${(data.revenue / 125000) * 120}px` }}
              ></div>
              <div 
                className="bg-orange-500 rounded-t"
                style={{ height: `${(data.expenses / 45000) * 120}px` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600">{data.month}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const ProfitChart = () => (
    <div className="space-y-4">
      <Typography variant="h6" className="text-gray-900">Profit Trend</Typography>
      <div className="h-32 flex items-end justify-between gap-1">
        {mockRevenueData.map((data, index) => {
          const profit = data.revenue - data.expenses;
          const maxProfit = 80000;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-green-500 rounded-t"
                style={{ height: `${(profit / maxProfit) * 100}px` }}
              ></div>
              <span className="text-xs text-gray-600 mt-1">${(profit / 1000).toFixed(0)}k</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const ExpensePieChart = () => (
    <div className="space-y-4">
      <Typography variant="h6" className="text-gray-900">Expense Categories</Typography>
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <div className="absolute inset-2 rounded-full bg-white"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">$45k</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Equipment</span>
          </div>
          <span className="font-medium">$1,200</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span>Vehicle</span>
          </div>
          <span className="font-medium">$450</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Office</span>
          </div>
          <span className="font-medium">$180</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h1" className="text-2xl font-bold text-gray-900 mb-1">
              Finance Dashboard
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Manage invoices, payments, expenses, and financial reporting
            </Typography>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body2" className="text-green-600 mb-1">Total Revenue</Typography>
              <Typography variant="h3" className="text-green-900">${mockFinancialData.revenue.current.toLocaleString()}</Typography>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">{mockFinancialData.revenue.change}</span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body2" className="text-red-600 mb-1">Total Expenses</Typography>
              <Typography variant="h3" className="text-red-900">${mockFinancialData.expenses.current.toLocaleString()}</Typography>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-red-600" />
                <span className="text-xs text-red-600">{mockFinancialData.expenses.change}</span>
              </div>
            </div>
            <Receipt className="h-8 w-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body2" className="text-blue-600 mb-1">Net Profit</Typography>
              <Typography variant="h3" className="text-blue-900">${mockFinancialData.profit.current.toLocaleString()}</Typography>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-blue-600">{mockFinancialData.profit.change}</span>
              </div>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="body2" className="text-orange-600 mb-1">Outstanding</Typography>
              <Typography variant="h3" className="text-orange-900">${mockFinancialData.outstanding.current.toLocaleString()}</Typography>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="h-3 w-3 text-orange-600" />
                <span className="text-xs text-orange-600">{mockFinancialData.outstanding.change}</span>
              </div>
            </div>
            <CreditCard className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search invoices, payments, expenses..."
              value={searchQuery}
              onChange={setSearchQuery}
              className="pl-10"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="min-w-[150px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid transparent',
              backgroundClip: 'padding-box',
              position: 'relative',
              borderRadius: '0.5rem',
              color: 'rgb(30, 41, 59)',
              backdropFilter: 'blur(4px)',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="approved">Approved</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 overflow-hidden">
        <div className="flex space-x-4 overflow-x-auto border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 py-1 px-1 border-b-2 font-medium text-xs whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-3 w-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="space-y-3">
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4">
                  <RevenueChart />
                </Card>
                <Card className="p-4">
                  <ProfitChart />
                </Card>
              </div>
              <Card className="p-4">
                <ExpensePieChart />
              </Card>
            </>
          )}

          {activeTab === 'invoices' && (
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="p-4 hover:shadow-lg transition-shadow border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-600" />
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                      <Dropdown
                        trigger={
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        }
                        items={[
                          { label: 'View', onClick: () => {} },
                          { label: 'Edit', onClick: () => {} },
                          { label: 'Send', onClick: () => {} },
                          { label: 'Delete', onClick: () => {} }
                        ]}
                      />
                    </div>
                    <div className="mb-2">
                      <Typography variant="h6" className="text-gray-900 mb-1">
                        {invoice.id}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 mb-1">
                        {invoice.customer}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 mb-2">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </Typography>
                    </div>
                    <div className="flex items-center justify-between">
                      <Typography variant="h6" className="text-gray-900">
                        ${invoice.amount.toLocaleString()}
                      </Typography>
                      {getStatusIcon(invoice.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockInvoices.filter(inv => inv.status === 'paid').map((payment) => (
                  <div key={payment.id} className="p-4 hover:shadow-lg transition-shadow border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Paid
                        </span>
                      </div>
                      <Dropdown
                        trigger={
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        }
                        items={[
                          { label: 'View Receipt', onClick: () => {} },
                          { label: 'Download', onClick: () => {} },
                          { label: 'Refund', onClick: () => {} }
                        ]}
                      />
                    </div>
                    <div className="mb-2">
                      <Typography variant="h6" className="text-gray-900 mb-1">
                        {payment.id}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 mb-1">
                        {payment.customer}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 mb-2">
                        Paid: {new Date(payment.dueDate).toLocaleDateString()}
                      </Typography>
                    </div>
                    <div className="flex items-center justify-between">
                      <Typography variant="h6" className="text-gray-900">
                        ${payment.amount.toLocaleString()}
                      </Typography>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="p-4 hover:shadow-lg transition-shadow border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-gray-600" />
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(expense.status)}`}>
                          {expense.status}
                        </span>
                      </div>
                      <Dropdown
                        trigger={
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        }
                        items={[
                          { label: 'View', onClick: () => {} },
                          { label: 'Edit', onClick: () => {} },
                          { label: 'Approve', onClick: () => {} },
                          { label: 'Delete', onClick: () => {} }
                        ]}
                      />
                    </div>
                    <div className="mb-2">
                      <Typography variant="h6" className="text-gray-900 mb-1">
                        {expense.category}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 mb-1">
                        {expense.description}
                      </Typography>
                      <Typography variant="body2" className="text-gray-600 mb-2">
                        Date: {new Date(expense.date).toLocaleDateString()}
                      </Typography>
                    </div>
                    <div className="flex items-center justify-between">
                      <Typography variant="h6" className="text-gray-900">
                        ${expense.amount.toLocaleString()}
                      </Typography>
                      {getStatusIcon(expense.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-4">
                <Typography variant="h6" className="text-gray-900 mb-4">Monthly Summary</Typography>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Total Revenue</span>
                    <span className="text-sm font-bold text-green-600">$125,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Total Expenses</span>
                    <span className="text-sm font-bold text-red-600">$45,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Net Profit</span>
                    <span className="text-sm font-bold text-blue-600">$80,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Profit Margin</span>
                    <span className="text-sm font-bold text-purple-600">64%</span>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <Typography variant="h6" className="text-gray-900 mb-4">Quick Actions</Typography>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Financial Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Tax Filing
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate P&L Statement
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Reconciliation
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
