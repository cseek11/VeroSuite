import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import { Heading, Text } from '@/components/ui';
import { Tabs } from '@/components/ui';
import {
  DollarSign,
  TrendingUp,
  FileText,
  AlertCircle,
  BarChart3,
  CreditCard,
  Download,
  Settings,
} from 'lucide-react';
import ARManagement from './ARManagement';
import RevenueAnalytics from './RevenueAnalytics';
import PaymentAnalytics from './PaymentAnalytics';
import PaymentTracking from './PaymentTracking';
import OverdueAlerts from './OverdueAlerts';
import FinancialReports from './FinancialReports';

type TabType =
  | 'overview'
  | 'ar'
  | 'revenue'
  | 'payments'
  | 'tracking'
  | 'overdue'
  | 'reports';

interface FinancialDashboardProps {
  defaultTab?: TabType;
}

export default function FinancialDashboard({ defaultTab = 'overview' }: FinancialDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);

  const tabs = [
    {
      id: 'overview' as TabType,
      label: 'Overview',
      icon: BarChart3,
      component: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Text variant="small" className="text-gray-500">
                      Quick Access
                    </Text>
                    <Heading level={4} className="mt-2 text-gray-900">
                      Financial Dashboard
                    </Heading>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <Text variant="small" className="text-gray-600 mt-4">
                  View comprehensive financial metrics and analytics
                </Text>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <div className="p-6">
                <Heading level={4} className="font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  Quick Links
                </Heading>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('ar')}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Text variant="body" className="font-medium">
                          Accounts Receivable
                        </Text>
                        <Text variant="small" className="text-gray-600">
                          View AR summary and aging
                        </Text>
                      </div>
                      <DollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('revenue')}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Text variant="body" className="font-medium">
                          Revenue Analytics
                        </Text>
                        <Text variant="small" className="text-gray-600">
                          Track revenue trends
                        </Text>
                      </div>
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('overdue')}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Text variant="body" className="font-medium">
                          Overdue Invoices
                        </Text>
                        <Text variant="small" className="text-gray-600">
                          Manage overdue accounts
                        </Text>
                      </div>
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Text variant="body" className="font-medium">
                          Financial Reports
                        </Text>
                        <Text variant="small" className="text-gray-600">
                          Generate and export reports
                        </Text>
                      </div>
                      <Download className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <Heading level={4} className="font-semibold mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Analytics
                </Heading>
                <div className="space-y-3">
                  <button
                    onClick={() => setActiveTab('payments')}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Text variant="body" className="font-medium">
                          Payment Analytics
                        </Text>
                        <Text variant="small" className="text-gray-600">
                          Payment trends and insights
                        </Text>
                      </div>
                      <CreditCard className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('tracking')}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Text variant="body" className="font-medium">
                          Payment Tracking
                        </Text>
                        <Text variant="small" className="text-gray-600">
                          Track payment performance
                        </Text>
                      </div>
                      <BarChart3 className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: 'ar' as TabType,
      label: 'AR Management',
      icon: DollarSign,
      component: <ARManagement />,
    },
    {
      id: 'revenue' as TabType,
      label: 'Revenue Analytics',
      icon: TrendingUp,
      component: <RevenueAnalytics />,
    },
    {
      id: 'payments' as TabType,
      label: 'Payment Analytics',
      icon: CreditCard,
      component: <PaymentAnalytics />,
    },
    {
      id: 'tracking' as TabType,
      label: 'Payment Tracking',
      icon: BarChart3,
      component: <PaymentTracking />,
    },
    {
      id: 'overdue' as TabType,
      label: 'Overdue Invoices',
      icon: AlertCircle,
      component: <OverdueAlerts />,
    },
    {
      id: 'reports' as TabType,
      label: 'Financial Reports',
      icon: FileText,
      component: <FinancialReports />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Heading level={1} className="font-bold text-gray-900 mb-2">
          Financial Management
        </Heading>
        <Text variant="body" className="text-gray-600">
          Comprehensive financial analytics and reporting
        </Text>
      </div>

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
        {tabs.find((tab) => tab.id === activeTab)?.component}
      </div>
    </div>
  );
}








