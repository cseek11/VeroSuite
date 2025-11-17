import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Heading,
  Text,
} from '@/components/ui';
import {
  CreditCard,
  FileText,
  Users,
  BarChart3,
  Settings,
  Shield,
  DollarSign,
  RefreshCw,
  PlusCircle,
  Calendar,
  Mail,
  FileCheck
} from 'lucide-react';
import {
  CustomerPaymentPortal,
  InvoiceManagement,
  InvoiceGenerator,
  InvoiceTemplates,
  InvoiceScheduler,
  InvoiceReminders,
  ARManagement,
  PaymentTracking,
  OverdueAlerts
} from '@/components/billing';
import RecurringPayments from '@/components/billing/RecurringPayments';
import PaymentAnalytics from '@/components/billing/PaymentAnalytics';
import { useQuery } from '@tanstack/react-query';
import { billing } from '@/lib/enhanced-api';

type TabType = 'invoices' | 'generate' | 'templates' | 'scheduler' | 'reminders' | 'ar' | 'payments' | 'overdue' | 'customers' | 'analytics' | 'recurring' | 'settings';

export default function Billing() {
  const [activeTab, setActiveTab] = useState<TabType>('invoices');
  const navigate = useNavigate();
  const { customerId } = useParams();

  // Fetch billing analytics for overview
  const { data: analytics } = useQuery({
    queryKey: ['billing', 'analytics'],
    queryFn: () => billing.getBillingAnalytics(),
  });

  // If customerId is provided, show customer payment portal
  if (customerId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
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
      id: 'generate' as TabType,
      label: 'Generate Invoice',
      icon: PlusCircle,
      component: <InvoiceGenerator onSuccess={() => setActiveTab('invoices')} />
    },
    {
      id: 'templates' as TabType,
      label: 'Templates',
      icon: FileCheck,
      component: <InvoiceTemplates />
    },
    {
      id: 'scheduler' as TabType,
      label: 'Scheduler',
      icon: Calendar,
      component: <InvoiceScheduler />
    },
    {
      id: 'reminders' as TabType,
      label: 'Reminders',
      icon: Mail,
      component: <InvoiceReminders />
    },
    {
      id: 'ar' as TabType,
      label: 'AR Management',
      icon: DollarSign,
      component: <ARManagement />
    },
    {
      id: 'payments' as TabType,
      label: 'Payment Tracking',
      icon: CreditCard,
      component: <PaymentTracking />
    },
    {
      id: 'overdue' as TabType,
      label: 'Overdue Alerts',
      icon: Shield,
      component: <OverdueAlerts />
    },
    {
      id: 'customers' as TabType,
      label: 'Customer Billing',
      icon: Users,
      component: (
        <Card>
          <div className="p-8 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Heading level={3} className="text-gray-500 mb-2">
              Customer Billing Management
            </Heading>
            <Text variant="small" className="text-gray-400 mb-6">
              Manage customer payment portals, payment methods, and billing preferences.
            </Text>
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
                    <Text variant="small" className="text-green-700 font-medium">
                      Total Revenue
                    </Text>
                    <Heading level={2} className="text-green-800 font-bold mt-1">
                      ${analytics?.totalRevenue?.toFixed(2) || '0.00'}
                    </Heading>
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
                    <Text variant="small" className="text-blue-700 font-medium">
                      Outstanding
                    </Text>
                    <Heading level={2} className="text-blue-800 font-bold mt-1">
                      ${analytics?.outstandingAmount?.toFixed(2) || '0.00'}
                    </Heading>
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
                    <Text variant="small" className="text-purple-700 font-medium">
                      Total Invoices
                    </Text>
                    <Heading level={2} className="text-purple-800 font-bold mt-1">
                      {analytics?.totalInvoices || 0}
                    </Heading>
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
                    <Text variant="small" className="text-orange-700 font-medium">
                      Overdue
                    </Text>
                    <Heading level={2} className="text-orange-800 font-bold mt-1">
                      {analytics?.overdueInvoices || 0}
                    </Heading>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <PaymentAnalytics />
        </div>
      )
    },
    {
      id: 'recurring' as TabType,
      label: 'Recurring Payments',
      icon: RefreshCw,
      component: <RecurringPayments />
    },
    {
      id: 'settings' as TabType,
      label: 'Settings',
      icon: Settings,
      component: (
        <Card>
          <div className="p-8 text-center">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Heading level={3} className="text-gray-500 mb-2">
              Billing Settings
            </Heading>
            <Text variant="small" className="text-gray-400 mb-6">
              Configure billing preferences, payment gateways, and invoice templates.
            </Text>
            <Button variant="outline">
              Coming Soon
            </Button>
          </div>
        </Card>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Billing & Payments
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Manage invoices, payments, and billing operations
            </p>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <div className="flex items-start">
          <div className="p-1.5 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-1">Secure Billing System</h3>
            <p className="text-sm text-slate-600">
              All payment processing is secured with bank-level encryption and PCI compliance standards.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-4 mb-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
          <TabsList className="flex flex-wrap gap-2 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      <div>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabType)}>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
