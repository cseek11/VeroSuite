import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import 'leaflet/dist/leaflet.css';
import Button from '@/components/ui/Button';
import {
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui';
import { logger } from '@/utils/logger';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Plus,
  AlertCircle,
  Settings,
  Trash2,
  User,
  BarChart3,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { enhancedApi } from '@/lib/enhanced-api';
import CustomerOverview from './customer/CustomerOverview';
import CustomerContact from './customer/CustomerContact';
import CustomerServices from './customer/CustomerServices';
import CustomerFinancials from './customer/CustomerFinancials';
import CustomerCommunications from './customer/CustomerCommunications';
import CustomerDocuments from './customer/CustomerDocuments';
import CustomerAnalytics from './customer/CustomerAnalytics';
import CustomerSettings from './customer/CustomerSettings';
import CustomerNotesHistory from './customer/CustomerNotesHistory';
import CustomerInfoPanel from './customer/CustomerInfoPanel';

interface CustomerPageProps {
  customerId?: string;
}

const CustomerPage: React.FC<CustomerPageProps> = ({ customerId: propCustomerId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const customerId = propCustomerId || params.customerId;
  const [activeTab, setActiveTab] = useState('overview');
  // const [isEditing, setIsEditing] = useState(false); // Unused - kept for potential future use
  // const [showQuickActions, setShowQuickActions] = useState(false); // Unused - kept for potential future use

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // const handleNavigateToNote = (noteId: string) => { // Unused - kept for potential future use
  //   setActiveTab('notes');
  //   logger.debug('Navigating to note', { noteId }, 'CustomerPage');
  // };

  // Fetch customer data
  const { data: customer, isLoading: customerLoading, error: customerError } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => enhancedApi.customers.getById(customerId!),
    enabled: !!customerId
  });

  // Update customer mutation with comprehensive cache invalidation
  // Note: Currently unused but kept for potential future use
  // const updateCustomerMutation = useMutation({
  //   mutationFn: (updates: Partial<Account>) => enhancedApi.customers.update(customerId!, updates),
  //   onSuccess: (data) => {
  //     logger.debug('Customer updated successfully', { customerName: data.name, customerId }, 'CustomerPage');
  //     
  //     // Invalidate all customer-related queries
  //     queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
  //     queryClient.invalidateQueries({ queryKey: ['crm', 'customer', customerId] });
  //     queryClient.invalidateQueries({ queryKey: ['enhanced-customer', customerId] });
  //     queryClient.invalidateQueries({ queryKey: ['customers'] });
  //     queryClient.invalidateQueries({ queryKey: ['secure-customers'] });
  //     queryClient.invalidateQueries({ queryKey: ['search'] });
  //     queryClient.invalidateQueries({ queryKey: ['unified-search'] });
  //     
  //     // setIsEditing(false); // Commented out - setIsEditing is unused
  //     
  //     // Dispatch custom event for real-time updates
  //     window.dispatchEvent(new CustomEvent('customerUpdated', {
  //       detail: { customerId, customer: data }
  //     }));
  //   },
  //   onError: (error) => {
  //     logger.error('Customer update failed', error, 'CustomerPage');
  //   }
  // });

  // Delete customer mutation with automatic redirection
  const deleteCustomerMutation = useMutation({
    mutationFn: () => enhancedApi.customers.delete(customerId!),
    onSuccess: () => {
      logger.debug('Customer deleted successfully', { customerId }, 'CustomerPage');
      
      // Invalidate all customer-related queries
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
      queryClient.invalidateQueries({ queryKey: ['crm', 'customer', customerId] });
      queryClient.invalidateQueries({ queryKey: ['enhanced-customer', customerId] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['secure-customers'] });
      queryClient.invalidateQueries({ queryKey: ['search'] });
      queryClient.invalidateQueries({ queryKey: ['unified-search'] });
      
      // Dispatch custom event for real-time updates
      window.dispatchEvent(new CustomEvent('customerDeleted', {
        detail: { customerId }
      }));
      
      // Redirect to customer search page
      navigate('/customers');
    },
    onError: (error) => {
      logger.error('Customer deletion failed', error, 'CustomerPage');
    }
  });

  // Listen for customer updates from action handlers
  useEffect(() => {
    const handleCustomerUpdate = (event: CustomEvent) => {
      const { customerId: updatedCustomerId } = event.detail;
      if (updatedCustomerId === customerId) {
        logger.debug('Customer updated via action handler, invalidating cache', { customerId }, 'CustomerPage');
        queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
      }
    };

    window.addEventListener('customerUpdated', handleCustomerUpdate as EventListener);
    return () => {
      window.removeEventListener('customerUpdated', handleCustomerUpdate as EventListener);
    };
  }, [customerId, queryClient]);

  // Handle delete confirmation
  const handleDeleteCustomer = () => {
    if (window.confirm(`Are you sure you want to delete ${customer?.name}? This action cannot be undone.`)) {
      deleteCustomerMutation.mutate();
    }
  };

  // Quick actions
  const quickActions = [
    {
      label: 'Create Work Order',
      icon: Plus,
      action: () => navigate(`/work-orders/new?customer=${customerId}`),
      variant: 'default' as const
    },
    {
      label: 'Schedule Service',
      icon: Calendar,
      action: () => navigate(`/scheduler?customer=${customerId}`),
      variant: 'outline' as const
    },
    {
      label: 'Send Message',
      icon: MessageSquare,
      action: () => setActiveTab('communications'),
      variant: 'outline' as const
    },
    {
      label: 'View Map',
      icon: MapPin,
      action: () => setActiveTab('overview'),
      variant: 'outline' as const
    },
    {
      label: 'Delete Customer',
      icon: Trash2,
      action: handleDeleteCustomer,
      variant: 'destructive' as const,
      disabled: deleteCustomerMutation.isPending
    }
  ];

  // Tab configuration - matching the popup layout
  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'services', label: 'Services', icon: Calendar },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'communications', label: 'Messages', icon: MessageSquare },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notes', label: 'History', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (customerLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
        <div className="mb-3">
          <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (customerError || !customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
        <div className="mb-3">
          <Button
            onClick={() => navigate('/customers')}
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-700 text-xs px-2 py-1"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Customers
          </Button>
        </div>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700 mt-1">
                Failed to load customer data. Please try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3">
      {/* Back to Customers Button - Outside card */}
      <div className="mb-3">
        <button
          onClick={() => navigate('/customers')}
          className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 hover:border-gray-400 text-xs inline-flex items-center"
        >
          <ArrowLeft className="h-3 w-3 mr-1.5" />
          Back to Customers
        </button>
      </div>

      {/* Header - Matching app design */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">{customer.name}</h1>
                <Badge 
                  variant={customer.status === 'active' ? 'default' : customer.status === 'inactive' ? 'secondary' : 'destructive'}
                  className="text-xs px-2 py-1"
                >
                  {customer.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {customer.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">
                      {customer.address}, {customer.city}, {customer.state} {customer.zip_code}
                    </span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                const isDestructive = action.variant === 'destructive';
                const isDisabled = action.disabled;
                
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    disabled={isDisabled}
                    className={`px-3 py-1.5 text-xs font-medium shadow-md hover:shadow-lg transition-all duration-200 rounded-md flex items-center ${
                      isDestructive
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 disabled:from-red-400 disabled:to-red-500'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500'
                    } ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    {isDisabled ? (
                      <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                    ) : (
                      <Icon className="w-3 h-3 mr-1.5" />
                    )}
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Quick Stats - Added below action buttons */}
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-1 bg-white/70 rounded border border-gray-200">
              <span className="text-xs text-gray-600">Total Services</span>
              <span className="font-semibold text-gray-900 text-xs">0</span>
            </div>
            
            <div className="flex items-center justify-between p-1 bg-white/70 rounded border border-gray-200">
              <span className="text-xs text-gray-600">Total Spend</span>
              <span className="font-semibold text-gray-900 text-xs">$0.00</span>
            </div>
            
            <div className="flex items-center justify-between p-1 bg-white/70 rounded border border-gray-200">
              <span className="text-xs text-gray-600">Active Contracts</span>
              <span className="font-semibold text-gray-900 text-xs">0</span>
            </div>
            
            <div className="flex items-center justify-between p-1 bg-white/70 rounded border border-gray-200">
              <span className="text-xs text-gray-600">AR Balance</span>
              <span className="font-semibold text-green-600 text-xs">$0.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info Panel - show on all tabs */}
      {customer && (
        <CustomerInfoPanel customer={customer} />
      )}

      {/* Main Content - Matching app design */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden pt-20">
        {/* Tab Navigation - Matching app design */}
        <div className="px-4 py-2 bg-white border-b border-gray-200">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-9 w-full h-12 bg-gray-100 border border-gray-200 rounded-lg p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    <Icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Tab Content - All TabsContent components properly nested within Tabs */}
            <div className="p-4">
              <TabsContent value="overview" className="mt-0">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <CustomerOverview 
                    customerId={customerId || ''} 
                  />
                </div>
              </TabsContent>

              <TabsContent value="contact" className="mt-0">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <CustomerContact customerId={customerId || ''} />
                </div>
              </TabsContent>

              <TabsContent value="services" className="mt-0">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <CustomerServices customerId={customerId || ''} />
                </div>
              </TabsContent>

              <TabsContent value="financials" className="mt-0">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <CustomerFinancials customerId={customerId || ''} />
                </div>
              </TabsContent>

              <TabsContent value="communications" className="mt-0">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <CustomerCommunications customerId={customerId || ''} />
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-0">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <CustomerDocuments customerId={customerId || ''} />
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-0">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <CustomerNotesHistory customerId={customerId || ''} />
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="mt-0">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <CustomerAnalytics customerId={customerId || ''} />
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <CustomerSettings customerId={customerId || ''} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
