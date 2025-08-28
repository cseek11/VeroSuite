import React, { useState } from 'react';
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Revenue vs Expenses</h3>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded"></div>
            <span>Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded"></div>
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
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-slate-900">Profit Trend</h3>
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
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-slate-900">Expense Categories</h3>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Finance Dashboard
            </h1>
            <p className="text-slate-600 text-sm">
              Manage invoices, payments, expenses, and financial reporting
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm">
              <Download className="h-3 w-3" />
              Export
            </button>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-medium text-sm">
              <Plus className="h-3 w-3" />
              New Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-emerald-300" />
                <span className="text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded-md">
                  {mockFinancialData.revenue.change}
                </span>
              </div>
            </div>
            <div className="text-xl font-bold mb-1">${mockFinancialData.revenue.current.toLocaleString()}</div>
            <div className="text-emerald-100 font-medium text-xs">Total Revenue</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Receipt className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-3 w-3 text-rose-300" />
                <span className="text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded-md">
                  {mockFinancialData.expenses.change}
                </span>
              </div>
            </div>
            <div className="text-xl font-bold mb-1">${mockFinancialData.expenses.current.toLocaleString()}</div>
            <div className="text-rose-100 font-medium text-xs">Total Expenses</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-blue-300" />
                <span className="text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded-md">
                  {mockFinancialData.profit.change}
                </span>
              </div>
            </div>
            <div className="text-xl font-bold mb-1">${mockFinancialData.profit.current.toLocaleString()}</div>
            <div className="text-blue-100 font-medium text-xs">Net Profit</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-xl p-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-3 w-3 text-amber-300" />
                <span className="text-xs font-semibold bg-white/20 px-1.5 py-0.5 rounded-md">
                  {mockFinancialData.outstanding.change}
                </span>
              </div>
            </div>
            <div className="text-xl font-bold mb-1">${mockFinancialData.outstanding.current.toLocaleString()}</div>
            <div className="text-amber-100 font-medium text-xs">Outstanding</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoices, payments, expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-2 py-1.5 min-w-[120px] bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="approved">Approved</option>
          </select>
          <button className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm">
            <Filter className="h-3 w-3" />
            Filters
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 overflow-hidden mb-4">
        <div className="flex space-x-4 overflow-x-auto border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 py-1 px-1 border-b-2 font-medium text-xs whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
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
                <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
                  <RevenueChart />
                </div>
                <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
                  <ProfitChart />
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
                <ExpensePieChart />
              </div>
            </>
          )}

          {activeTab === 'invoices' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-indigo-100 rounded-md">
                  <FileText className="h-4 w-4 text-indigo-600" />
                </div>
                Invoices
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredInvoices.map((invoice) => (
                  <div key={invoice.id} className="p-3 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-600" />
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                      <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreVertical className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="mb-2">
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">
                        {invoice.id}
                      </h3>
                      <p className="text-xs text-slate-600 mb-1">
                        {invoice.customer}
                      </p>
                      <p className="text-xs text-slate-600 mb-2">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">
                        ${invoice.amount.toLocaleString()}
                      </span>
                      {getStatusIcon(invoice.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-emerald-100 rounded-md">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                </div>
                Payments
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {mockInvoices.filter(inv => inv.status === 'paid').map((payment) => (
                  <div key={payment.id} className="p-3 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-slate-600" />
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800">
                          Paid
                        </span>
                      </div>
                      <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreVertical className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="mb-2">
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">
                        {payment.id}
                      </h3>
                      <p className="text-xs text-slate-600 mb-1">
                        {payment.customer}
                      </p>
                      <p className="text-xs text-slate-600 mb-2">
                        Paid: {new Date(payment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">
                        ${payment.amount.toLocaleString()}
                      </span>
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
              <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <div className="p-1 bg-rose-100 rounded-md">
                  <Receipt className="h-4 w-4 text-rose-600" />
                </div>
                Expenses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="p-3 hover:shadow-lg transition-shadow border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-slate-600" />
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${getStatusColor(expense.status)}`}>
                          {expense.status}
                        </span>
                      </div>
                      <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreVertical className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="mb-2">
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">
                        {expense.category}
                      </h3>
                      <p className="text-xs text-slate-600 mb-1">
                        {expense.description}
                      </p>
                      <p className="text-xs text-slate-600 mb-2">
                        Date: {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">
                        ${expense.amount.toLocaleString()}
                      </span>
                      {getStatusIcon(expense.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
                <h3 className="text-base font-semibold text-slate-900 mb-3">Monthly Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">Total Revenue</span>
                    <span className="text-sm font-bold text-emerald-600">$125,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">Total Expenses</span>
                    <span className="text-sm font-bold text-rose-600">$45,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">Net Profit</span>
                    <span className="text-sm font-bold text-blue-600">$80,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium">Profit Margin</span>
                    <span className="text-sm font-bold text-violet-600">64%</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4">
                <h3 className="text-base font-semibold text-slate-900 mb-3">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full justify-start bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm">
                    <Download className="h-3 w-3" />
                    Export Financial Report
                  </button>
                  <button className="w-full justify-start bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm">
                    <Calendar className="h-3 w-3" />
                    Schedule Tax Filing
                  </button>
                  <button className="w-full justify-start bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm">
                    <BarChart3 className="h-3 w-3" />
                    Generate P&L Statement
                  </button>
                  <button className="w-full justify-start bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm">
                    <CreditCard className="h-3 w-3" />
                    Payment Reconciliation
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
