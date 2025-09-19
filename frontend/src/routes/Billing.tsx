import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Typography,
  Button,
  Tabs,
  Alert
} from '@/components/ui/EnhancedUI';
import {
  CreditCard,
  FileText,
  Users,
  BarChart3,
  ArrowLeft,
  Settings,
  Shield
} from 'lucide-react';
import {
  CustomerPaymentPortal,
  InvoiceManagement
} from '@/components/billing';
import { useQuery } from '@tanstack/react-query';
import { billing } from '@/lib/enhanced-api';

type TabType = 'invoices' | 'payments' | 'customers' | 'analytics' | 'settings';

export default function Billing() {
  const [activeTab, setActiveTab] = useState<TabType>('invoices');
  const navigate = useNavigate();
  const { customerId } = useParams();

  // Fetch billing analytics for overview
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['billing', 'analytics'],
    queryFn: () => billing.getBillingAnalytics(),
  });

  // If customerId is provided, show customer payment portal
  if (customerId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomerPaymentPortal
          customerId={customerId}
          onClose={() => navigate('/billing')}
        />
      </div>
    );
  }

  const tabs = [
    {
      id: 'invoices' as TabType,
      label: 'Invoice Management',
      icon: FileText,
      component: <InvoiceManagement />
    },
    {
      id: 'customers' as TabType,
      label: 'Customer Billing',
      icon: Users,
      component: (
        <Card>
          <div className="p-8 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Typography variant="h3" className="text-gray-500 mb-2">
              Customer Billing Management
            </Typography>
            <Typography variant="body2" className="text-gray-400 mb-6">
              Manage customer payment portals, payment methods, and billing preferences.
            </Typography>
            <Button variant="outline">
              Coming Soon
            </Button>
          </div>
        </Card>
      )
    },
    {
      id: 'analytics' as TabType,
      label: 'Analytics',
      icon: BarChart3,
      component: (
        <div className="space-y-6">
          {/* Analytics Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body2" className="text-green-700 font-medium">
                      Total Revenue
                    </Typography>
                    <Typography variant="h2" className="text-green-800 font-bold mt-1">
                      ${analytics?.totalRevenue?.toFixed(2) || '0.00'}
                    </Typography>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body2" className="text-blue-700 font-medium">
                      Outstanding
                    </Typography>
                    <Typography variant="h2" className="text-blue-800 font-bold mt-1">
                      ${analytics?.outstandingAmount?.toFixed(2) || '0.00'}
                    </Typography>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-blue-600" />
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
                      {analytics?.totalInvoices || 0}
                    </Typography>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="body2" className="text-orange-700 font-medium">
                      Overdue
                    </Typography>
                    <Typography variant="h2" className="text-orange-800 font-bold mt-1">
                      {analytics?.overdueInvoices || 0}
                    </Typography>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <div className="p-8 text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <Typography variant="h3" className="text-gray-500 mb-2">
                Detailed Analytics Coming Soon
              </Typography>
              <Typography variant="body2" className="text-gray-400">
                Revenue trends, payment analytics, and financial reporting will be available here.
              </Typography>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'settings' as TabType,
      label: 'Settings',
      icon: Settings,
      component: (
        <Card>
          <div className="p-8 text-center">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Typography variant="h3" className="text-gray-500 mb-2">
              Billing Settings
            </Typography>
            <Typography variant="body2" className="text-gray-400 mb-6">
              Configure billing preferences, payment gateways, and invoice templates.
            </Typography>
            <Button variant="outline">
              Coming Soon
            </Button>
          </div>
        </Card>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h1" className="font-bold text-gray-900">
                Billing & Payments
              </Typography>
              <Typography variant="body1" className="text-gray-600 mt-2">
                Manage invoices, payments, and billing operations
              </Typography>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <Alert type="info" className="mb-6">
          <div className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            <span className="font-medium">Secure Billing System</span>
          </div>
          <div className="mt-1 text-sm">
            All payment processing is secured with bank-level encryption and PCI compliance standards.
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
      </div>
    </div>
  );
}
