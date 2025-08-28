import React, { useState, useMemo } from 'react';
import { useAuthStore } from '@/stores/auth';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '@/components/LoadingSpinner';


import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  Download,
  Search,
  Filter,
  Star,
  StarOff,
  Eye,
  Share2,
  Settings,
  DollarSign,
  Wrench,
  Shield,
  Package,
  Target,
  Route,
  PieChart,
  LineChart,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  Plus,
  Grid,
  List,
  RefreshCw,
  Bookmark,
  BookmarkPlus,
  Heart,
  XCircle
} from 'lucide-react';

// Report categories and their reports
const reportCategories = {
  financial: {
    name: 'Financial',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    reports: [
      { id: 'revenue-trends', name: 'Revenue Trends', description: 'Monthly and yearly revenue analysis', icon: TrendingUp },
      { id: 'ar-aging', name: 'AR Aging', description: 'Accounts receivable aging report', icon: Clock },
      { id: 'refunds', name: 'Refunds & Credits', description: 'Refund and credit transaction history', icon: DollarSign },
      { id: 'branch-revenue', name: 'Branch Revenue', description: 'Revenue breakdown by branch and route', icon: BarChart3 },
      { id: 'profitability', name: 'Profitability Analysis', description: 'Cost vs revenue analysis', icon: PieChart }
    ]
  },
  jobs: {
    name: 'Jobs',
    icon: Wrench,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    reports: [
      { id: 'scheduled-vs-completed', name: 'Scheduled vs Completed', description: 'Job completion rate analysis', icon: CheckCircle },
      { id: 'avg-job-time', name: 'Average Job Time', description: 'Time efficiency metrics', icon: Clock },
      { id: 'missed-appointments', name: 'Missed Appointments', description: 'No-show and cancellation tracking', icon: AlertTriangle },
      { id: 'job-quality', name: 'Job Quality Metrics', description: 'Service quality and customer feedback', icon: Star },
      { id: 'route-efficiency', name: 'Route Efficiency', description: 'Route optimization and travel time', icon: Route }
    ]
  },
  technicians: {
    name: 'Technicians',
    icon: Users,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    reports: [
      { id: 'jobs-completed', name: 'Jobs Completed', description: 'Technician productivity metrics', icon: CheckCircle },
      { id: 'ratings', name: 'Customer Ratings', description: 'Technician performance ratings', icon: Star },
      { id: 'upsell-tracking', name: 'Upsell Tracking', description: 'Additional service sales performance', icon: TrendingUp },
      { id: 'compliance', name: 'Compliance Reports', description: 'Safety and certification tracking', icon: Shield },
      { id: 'time-tracking', name: 'Time Tracking', description: 'Work hours and efficiency analysis', icon: Clock }
    ]
  },
  customers: {
    name: 'Customers',
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    reports: [
      { id: 'new-vs-returning', name: 'New vs Returning', description: 'Customer acquisition and retention', icon: Users },
      { id: 'retention', name: 'Customer Retention', description: 'Customer loyalty and churn analysis', icon: Heart },
      { id: 'ltv', name: 'Customer LTV', description: 'Lifetime value analysis', icon: DollarSign },
      { id: 'lead-conversion', name: 'Lead Conversion', description: 'Lead to customer conversion rates', icon: Target },
      { id: 'churn', name: 'Customer Churn', description: 'Churn rate and reasons analysis', icon: AlertTriangle }
    ]
  },
  inventory: {
    name: 'Inventory',
    icon: Package,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    reports: [
      { id: 'chemical-usage', name: 'Chemical Usage', description: 'Usage by technician and service type', icon: Package },
      { id: 'stock-alerts', name: 'Stock Alerts', description: 'Low stock and reorder notifications', icon: AlertTriangle },
      { id: 'compliance-logs', name: 'Compliance Logs', description: 'SDS access and usage tracking', icon: Shield },
      { id: 'cost-analysis', name: 'Cost Analysis', description: 'Inventory cost and waste tracking', icon: DollarSign },
      { id: 'supplier-performance', name: 'Supplier Performance', description: 'Supplier delivery and quality metrics', icon: Activity }
    ]
  },
  compliance: {
    name: 'Compliance',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    reports: [
      { id: 'epa-osha', name: 'EPA/OSHA Reporting', description: 'Regulatory compliance reporting', icon: Shield },
      { id: 'certification-expiry', name: 'Certification Expiry', description: 'Technician certification tracking', icon: Calendar },
      { id: 'sds-access', name: 'SDS Access Logs', description: 'Safety data sheet access tracking', icon: FileText },
      { id: 'safety-incidents', name: 'Safety Incidents', description: 'Incident reporting and analysis', icon: AlertTriangle },
      { id: 'training-compliance', name: 'Training Compliance', description: 'Required training completion status', icon: CheckCircle }
    ]
  },
  marketing: {
    name: 'Marketing',
    icon: Target,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    reports: [
      { id: 'campaign-roi', name: 'Campaign ROI', description: 'Marketing campaign effectiveness', icon: TrendingUp },
      { id: 'seasonal-demand', name: 'Seasonal Demand', description: 'Seasonal service demand patterns', icon: BarChart3 },
      { id: 'referral-sources', name: 'Referral Sources', description: 'Customer acquisition source analysis', icon: Users },
      { id: 'lead-sources', name: 'Lead Sources', description: 'Lead generation source effectiveness', icon: Target },
      { id: 'customer-feedback', name: 'Customer Feedback', description: 'Feedback and review analysis', icon: Star }
    ]
  },
  operations: {
    name: 'Operations',
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    reports: [
      { id: 'route-profitability', name: 'Route Profitability', description: 'Route-level profit analysis', icon: Route },
      { id: 'cancellation-rates', name: 'Cancellation Rates', description: 'Service cancellation analysis', icon: XCircle },
      { id: 'service-efficiency', name: 'Service Efficiency', description: 'Operational efficiency metrics', icon: Activity },
      { id: 'equipment-utilization', name: 'Equipment Utilization', description: 'Equipment usage and maintenance', icon: Wrench },
      { id: 'quality-control', name: 'Quality Control', description: 'Service quality and inspection results', icon: CheckCircle }
    ]
  },
  custom: {
    name: 'Custom',
    icon: Plus,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    reports: [
      { id: 'custom-reports', name: 'Custom Reports', description: 'Create your own custom reports', icon: Plus },
      { id: 'dashboard-widgets', name: 'Dashboard Widgets', description: 'Export reports as dashboard widgets', icon: Grid },
      { id: 'scheduled-reports', name: 'Scheduled Reports', description: 'Automated report generation', icon: Calendar },
      { id: 'report-templates', name: 'Report Templates', description: 'Save and reuse report configurations', icon: FileText }
    ]
  }
};

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('financial');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [pinnedReports, setPinnedReports] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedTechnician, setSelectedTechnician] = useState('all');

  if (!user) {
    return <PageLoader text="Loading reports..." />;
  }

  // Filter reports based on search query
  const filteredReports = useMemo(() => {
    const category = reportCategories[activeTab as keyof typeof reportCategories];
    if (!category) return [];
    
    if (!searchQuery) return category.reports;
    
    return category.reports.filter(report =>
      (report.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (report.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  }, [activeTab, searchQuery]);

  const togglePinReport = (reportId: string) => {
    setPinnedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleGenerateReport = (reportId: string) => {
    // Navigate to report generation page with parameters
    navigate(`/reports/generate/${reportId}`, {
      state: {
        dateRange,
        branch: selectedBranch,
        technician: selectedTechnician
      }
    });
  };

  const handleExportReport = (reportId: string, format: 'csv' | 'pdf' | 'excel') => {
    // Handle report export
    console.log(`Exporting ${reportId} as ${format}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Reports & Analytics
            </h1>
            <p className="text-slate-600 text-sm">
              Generate comprehensive reports to track performance and make data-driven decisions
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 px-3 py-2 rounded-lg hover:bg-white hover:shadow-lg transition-all duration-200 text-sm flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            
            <div className="flex items-center border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-sm"
          />
        </div>
      </div>

      {/* Global Filters */}
      {showFilters && (
        <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
          <Typography variant="h6" className="mb-4">Global Filters</Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  placeholder="Start Date"
                  value=""
                  onChange={() => {}}
                  className="flex-1"
                />
                <Input
                  type="date"
                  placeholder="End Date"
                  value=""
                  onChange={() => {}}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <Select
                value={selectedBranch}
                onChange={(value) => setSelectedBranch(value)}
                options={[
                  { value: 'all', label: 'All Branches' },
                  { value: 'main', label: 'Main Branch' },
                  { value: 'north', label: 'North Branch' },
                  { value: 'south', label: 'South Branch' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Technician</label>
              <Select
                value={selectedTechnician}
                onChange={(value) => setSelectedTechnician(value)}
                options={[
                  { value: 'all', label: 'All Technicians' },
                  { value: 'tech1', label: 'John Smith' },
                  { value: 'tech2', label: 'Jane Doe' },
                  { value: 'tech3', label: 'Mike Johnson' },
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {/* Report Categories Tabs */}
      <div className="flex-shrink-0 overflow-hidden">
        <div className="flex space-x-4 overflow-x-auto border-b border-gray-200">
          {Object.entries(reportCategories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1 py-1 px-1 border-b-2 font-medium text-xs whitespace-nowrap transition-colors duration-200 ${
                activeTab === key
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <category.icon className="h-3 w-3" />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="space-y-3">
          {/* Pinned Reports */}
          {pinnedReports.length > 0 && (
            <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
              <Typography variant="h5" className="text-gray-900 mb-4 flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-yellow-500" />
                Pinned Reports
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedReports.map(reportId => {
                  // Find the report details
                  let report = null;
                  for (const category of Object.values(reportCategories)) {
                    const found = category.reports.find(r => r.id === reportId);
                    if (found) {
                      report = { ...found, category: category.name };
                      break;
                    }
                  }
                  if (!report) return null;

                  return (
                    <Card key={reportId} className="p-4 border-l-4 border-yellow-400">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <report.icon className="h-5 w-5 text-gray-600" />
                          <Typography variant="h6" className="text-gray-900">
                            {report.name}
                          </Typography>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePinReport(reportId)}
                        >
                          <BookmarkPlus className="h-4 w-4 text-yellow-500" />
                        </Button>
                      </div>
                      <Typography variant="body2" className="text-gray-600 mb-3">
                        {report.description}
                      </Typography>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleGenerateReport(reportId)}
                        >
                          Generate
                        </Button>
                        <Dropdown
                          trigger={
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          }
                          items={[
                            { label: 'Export as CSV', onClick: () => handleExportReport(reportId, 'csv') },
                            { label: 'Export as PDF', onClick: () => handleExportReport(reportId, 'pdf') },
                            { label: 'Export as Excel', onClick: () => handleExportReport(reportId, 'excel') }
                          ]}
                        />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reports Grid/List */}
          <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }>
              {filteredReports.map((report) => (
                <Card 
                  key={report.id} 
                  className={`p-6 hover:shadow-lg transition-shadow ${
                    viewMode === 'list' ? 'flex items-center justify-between' : ''
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${reportCategories[activeTab as keyof typeof reportCategories].bgColor}`}>
                            <report.icon className={`h-6 w-6 ${reportCategories[activeTab as keyof typeof reportCategories].color}`} />
                          </div>
                          <Typography variant="h6" className="text-gray-900">
                            {report.name}
                          </Typography>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePinReport(report.id)}
                          >
                            {pinnedReports.includes(report.id) ? (
                              <Bookmark className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <BookmarkPlus className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <Typography variant="body2" className="text-gray-600 mb-4">
                        {report.description}
                      </Typography>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          className="flex-1"
                          onClick={() => handleGenerateReport(report.id)}
                        >
                          Generate Report
                        </Button>
                        <Dropdown
                          trigger={
                            <Button variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          }
                          items={[
                            { label: 'Export as CSV', onClick: () => handleExportReport(report.id, 'csv') },
                            { label: 'Export as PDF', onClick: () => handleExportReport(report.id, 'pdf') },
                            { label: 'Export as Excel', onClick: () => handleExportReport(report.id, 'excel') }
                          ]}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${reportCategories[activeTab as keyof typeof reportCategories].bgColor}`}>
                          <report.icon className={`h-6 w-6 ${reportCategories[activeTab as keyof typeof reportCategories].color}`} />
                        </div>
                        <div>
                          <Typography variant="h6" className="text-gray-900">
                            {report.name}
                          </Typography>
                          <Typography variant="body2" className="text-gray-600">
                            {report.description}
                          </Typography>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePinReport(report.id)}
                        >
                          {pinnedReports.includes(report.id) ? (
                            <Bookmark className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <BookmarkPlus className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleGenerateReport(report.id)}
                        >
                          Generate
                        </Button>
                        <Dropdown
                          trigger={
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          }
                          items={[
                            { label: 'Export as CSV', onClick: () => handleExportReport(report.id, 'csv') },
                            { label: 'Export as PDF', onClick: () => handleExportReport(report.id, 'pdf') },
                            { label: 'Export as Excel', onClick: () => handleExportReport(report.id, 'excel') }
                          ]}
                        />
                      </div>
                    </>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white/90 rounded-lg shadow-sm border border-gray-200 p-4">
            <Typography variant="h3" className="text-gray-900 mb-6">
              Quick Statistics
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6 text-center">
                <Typography variant="h4" className="text-blue-600 font-bold">
                  1,247
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Jobs This Month
                </Typography>
              </Card>
              <Card className="p-6 text-center">
                <Typography variant="h4" className="text-green-600 font-bold">
                  892
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Active Customers
                </Typography>
              </Card>
              <Card className="p-6 text-center">
                <Typography variant="h4" className="text-purple-600 font-bold">
                  94.2%
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Customer Satisfaction
                </Typography>
              </Card>
              <Card className="p-6 text-center">
                <Typography variant="h4" className="text-orange-600 font-bold">
                  $127,450
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Monthly Revenue
                </Typography>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
