import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Badge, Heading, Text } from '@/components/ui';
import Checkbox from '@/components/ui/Checkbox';
import { useCardResponsive } from '@/hooks/useCardResponsive';
import {
  Eye,
  Edit,
  Phone,
  DollarSign,
  Mail,
  MapPin,
  Building,
  FileText,
  Calendar,
  MessageSquare,
  FolderOpen,
  Users,
  ChevronDown,
  ChevronUp,
  X,
  AlertTriangle
} from 'lucide-react';
import { logger } from '@/utils/logger';
import { useQuery } from '@tanstack/react-query';
import { Account } from '@/types/enhanced-types';
import CustomerPagePopup from './CustomerPagePopup';

interface CustomerListViewProps {
  customers: Account[];
  onViewHistory: (customer: Account) => void;
  onEdit: (customer: Account) => void;
  onViewDetails: (customer: Account) => void;
  onSelectionChange?: (selectedCustomers: Set<string>) => void;
  isLoading?: boolean;
  error?: Error | null;
}

// Tab types for the navigation
type TabType = 'overview' | 'jobs' | 'billing' | 'notes' | 'documents';

// Agreement types
type AgreementType = 'annual_pest_control' | 'monthly_pest_control' | 'annual_termite_renewal' | 'termite_bait_stations' | 'rat_monitoring';

// Agreement configuration
const AGREEMENT_CONFIG: Record<AgreementType, { name: string; color: string; tooltip: string }> = {
  annual_pest_control: { name: 'Annual Pest Control', color: 'bg-green-500', tooltip: 'Annual Pest Control Agreement' },
  monthly_pest_control: { name: 'Monthly Pest Control', color: 'bg-blue-500', tooltip: 'Monthly Pest Control Agreement' },
  annual_termite_renewal: { name: 'Annual Termite Renewal', color: 'bg-yellow-500', tooltip: 'Annual Termite Renewal Agreement' },
  termite_bait_stations: { name: 'Termite Bait Stations', color: 'bg-orange-500', tooltip: 'Termite Bait Stations Agreement' },
  rat_monitoring: { name: 'Active Rat Monitoring', color: 'bg-purple-500', tooltip: 'Active Rat Monitoring Agreement' }
};

const CustomerListView: React.FC<CustomerListViewProps> = ({
  customers,
  onViewHistory,
  onEdit,
  onViewDetails,
  onSelectionChange,
  isLoading = false,
  error = null
}) => {
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [mapPopupCustomerId, setMapPopupCustomerId] = useState<string | null>(null);
  const [selectedCustomerForPopup, setSelectedCustomerForPopup] = useState<string | null>(null);
  
  // Get responsive state - we'll need to pass cardId from parent
  const responsiveState = useCardResponsive({ 
    cardId: 'customers-page', // This should be passed as prop in real implementation
    threshold: 50 
  });

  // Fetch account details using enhanced API
  const { data: accountDetails } = useQuery({
    queryKey: ['enhanced-account-details', customers?.length],
    queryFn: async () => {
      if (!customers) return [];
      const customersCount = Array.isArray(customers) ? customers.length : 0;
      logger.debug('Fetching account details', { customersCount }, 'CustomerListView');
      
      // For now, return empty details - will be enhanced when agreements and payments APIs are updated
      const details = Array.isArray(customers) ? customers.map((customer) => ({
        accountId: customer.id,
        agreements: [] as string[],
        overdue_days: 0
      })) : [];
      
      return details;
    },
    enabled: !!customers && Array.isArray(customers) && customers.length > 0,
  });

  // Agreement indicator component
  const AgreementIndicator = ({ agreementType }: { agreementType: string }) => {
    const config = AGREEMENT_CONFIG[agreementType as AgreementType];
    
    // If config is undefined, use a default fallback
    if (!config) {
      logger.warn('Unknown agreement type', { agreementType }, 'CustomerListView');
      return (
        <div
          className="cursor-help"
          title={`Unknown Agreement: ${agreementType}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 120"
            className="w-4 h-4 bg-white shadow-sm"
          >
            <path
              d="M50 0 L100 20 L100 70 L50 120 L0 70 L0 20 Z"
              fill="currentColor"
              className="text-gray-500"
            />
          </svg>
        </div>
      );
    }
    
    return (
      <div
        className="cursor-help"
        title={config.tooltip}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 120"
          className="w-4 h-4 bg-white shadow-sm"
        >
          <path
            d="M50 0 L100 20 L100 70 L50 120 L0 70 L0 20 Z"
            fill="currentColor"
            className={config.color.replace('bg-', 'text-')}
          />
        </svg>
      </div>
    );
  };

  // Agreement indicators component
  const AgreementIndicators = ({ customer }: { customer: Account }) => {
    const customerDetails = accountDetails?.find(d => d.accountId === customer.id);
    const agreements = customerDetails?.agreements || [];
    const overdueDays = customerDetails?.overdue_days || 0;
    
    // More accurate overdue detection: consider both overdue payments AND positive AR balance
    const hasOverduePayments = overdueDays > 30;
    const hasOutstandingBalance = (customer.ar_balance || 0) > 0;
    const isOverdue = hasOverduePayments || hasOutstandingBalance;

    if (process.env.NODE_ENV === 'development') {
      logger.debug('AgreementIndicators render', {
        customerName: customer.name,
        agreements,
        overdueDays,
        hasOverduePayments,
        hasOutstandingBalance,
        arBalance: customer.ar_balance,
        isOverdue
      }, 'CustomerListView');
    }

    return (
      <div className="flex items-center gap-1">
        {/* Agreement Indicators */}
        {agreements.length > 0 && (
          <div className="flex gap-1">
            {agreements.map((agreementType, index: number) => (
              <AgreementIndicator key={index} agreementType={agreementType} />
            ))}
          </div>
        )}
        {/* Overdue Badge */}
        {isOverdue && (
          <div className="flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span>
              {hasOutstandingBalance && hasOverduePayments ? 'Overdue' : 
               hasOutstandingBalance ? 'Balance Due' : 'Overdue'}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Use customers as they come in (filtering is handled by parent component)
  const filteredCustomers = customers;

  // Handle checkbox selection
  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    const newSelected = new Set(selectedCustomers);
    if (checked) {
      newSelected.add(customerId);
    } else {
      newSelected.delete(customerId);
    }
    setSelectedCustomers(newSelected);
    onSelectionChange?.(newSelected);
  };

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    const newSelected = checked ? new Set(filteredCustomers.map(c => c.id)) : new Set<string>();
    setSelectedCustomers(newSelected);
    onSelectionChange?.(newSelected);
  };

  // Toggle row expansion
  const toggleRowExpansion = (customerId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(customerId)) {
      newExpanded.delete(customerId);
    } else {
      newExpanded.add(customerId);
    }
    setExpandedRows(newExpanded);
    
    // Dispatch custom event for auto-scroll
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('customerRowExpanded', {
        detail: { customerId, isExpanded: newExpanded.has(customerId) }
      }));
    }, 100);
  };

  // Get selected customers data
  const selectedCustomersData = useMemo(() => {
    if (!Array.isArray(customers)) {
      return [];
    }
    return customers.filter(customer => selectedCustomers.has(customer.id));
  }, [customers, selectedCustomers]);

  // Tab configuration
  const tabs: { id: TabType; label: string; icon: React.ComponentType<any>; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: Users, count: selectedCustomersData.length },
    { id: 'jobs', label: 'Jobs/Service History', icon: Calendar },
    { id: 'billing', label: 'Billing/AR', icon: DollarSign },
    { id: 'notes', label: 'Notes/Communications', icon: MessageSquare },
    { id: 'documents', label: 'Documents', icon: FolderOpen }
  ];

  // Check if all filtered customers are selected
  const allSelected = filteredCustomers.length > 0 && 
    filteredCustomers.every(customer => selectedCustomers.has(customer.id));
  
  // Check if some filtered customers are selected
  const someSelected = filteredCustomers.some(customer => selectedCustomers.has(customer.id));



  // Get customer coordinates
  const getCustomerCoordinates = (customer: Account): [number, number] => {
    const coordinates: Record<string, [number, number]> = {
      'Pittsburgh': [40.4406, -79.9959],
      'Monroeville': [40.4321, -79.7889],
      'Cranberry Twp': [40.6847, -80.1072],
      'Greensburg': [40.3015, -79.5389],
      'Butler': [40.8612, -79.8953],
      'Washington': [40.1734, -80.2462],
      'Beaver': [40.6953, -80.3109]
    };
    return coordinates[customer.city || ''] || [40.4406, -79.9959];
  };

  // Get the customer object for the map popup
  const mapPopupCustomer = Array.isArray(customers) ? customers.find(c => c.id === mapPopupCustomerId) || null : null;

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <Heading level={6} className="text-gray-900 mb-2">
              Loading Customers...
            </Heading>
            <Text variant="small" className="text-gray-600">
              Please wait while we fetch your customer data.
            </Text>
          </div>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <Card className="p-8">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <Heading level={6} className="text-gray-900 mb-2">
              Error Loading Customers
            </Heading>
            <Text variant="small" className="text-gray-600 mb-4">
              {error?.message || 'An error occurred while loading customer data.'}
            </Text>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">

      {/* Tabbed Navigation (only shown when customers are selected) */}
      {selectedCustomers.size > 0 && (
        <Card className="p-0 sticky-tabs">
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
              <Heading level={6} className="text-gray-900">
                {selectedCustomers.size} Customer{selectedCustomers.size !== 1 ? 's' : ''} Selected
              </Heading>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newSelected = new Set<string>();
                  setSelectedCustomers(newSelected);
                  onSelectionChange?.(newSelected);
                }}
                className="h-8 px-3 text-sm"
              >
                Clear Selection
              </Button>
            </div>
            <div className="flex overflow-x-auto tab-navigation">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      tab-button
                      ${activeTab === tab.id ? 'active' : ''}
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    {tab.count && (
                      <span className="tab-count">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
                     {/* Tab Content */}
           <div className="tab-content">
             {activeTab === 'overview' && (
               <div className="space-y-4">
                 <Heading level={6} className="text-gray-900">
                   Selected Customers Overview
                 </Heading>
                 <div className="overview-grid">
                   <div className="overview-card blue">
                     <Text variant="small" className="font-medium">
                       Total Customers
                     </Text>
                     <Heading level={4}>
                       {selectedCustomersData.length}
                     </Heading>
                   </div>
                   <div className="overview-card green">
                     <Text variant="small" className="font-medium">
                       Commercial
                     </Text>
                     <Heading level={4}>
                       {selectedCustomersData.filter(c => c.account_type === 'commercial').length}
                     </Heading>
                   </div>
                   <div className="overview-card purple">
                     <Text variant="small" className="font-medium">
                       Residential
                     </Text>
                     <Heading level={4}>
                       {selectedCustomersData.filter(c => c.account_type === 'residential').length}
                     </Heading>
                   </div>
                 </div>
                 <div className="overview-card">
                   <Text variant="small" className="text-gray-600 mb-2">
                     Selected Customers:
                   </Text>
                   <div className="space-y-1">
                     {selectedCustomersData.map(customer => (
                       <div key={customer.id} className="flex items-center justify-between text-sm">
                         <span className="font-medium">{customer.name}</span>
                         <Badge variant={customer.account_type === 'commercial' ? 'default' : 'secondary'} className="text-xs">
                           {customer.account_type}
                         </Badge>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             )}
            
            {activeTab === 'jobs' && (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Heading level={6} className="text-gray-900 mb-2">
                  Jobs & Service History
                </Heading>
                <Text variant="small" className="text-gray-600">
                  Service history for selected customers will be displayed here.
                </Text>
              </div>
            )}
            
            {activeTab === 'billing' && (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Heading level={6} className="text-gray-900 mb-2">
                  Billing & AR Information
                </Heading>
                <Text variant="small" className="text-gray-600">
                  Billing and accounts receivable data for selected customers will be displayed here.
                </Text>
              </div>
            )}
            
            {activeTab === 'notes' && (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Heading level={6} className="text-gray-900 mb-2">
                  Notes & Communications
                </Heading>
                <Text variant="small" className="text-gray-600">
                  Notes and communication history for selected customers will be displayed here.
                </Text>
              </div>
            )}
            
            {activeTab === 'documents' && (
              <div className="text-center py-8">
                <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <Heading level={6} className="text-gray-900 mb-2">
                  Documents
                </Heading>
                <Text variant="small" className="text-gray-600">
                  Documents and files for selected customers will be displayed here.
                </Text>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Customer List Table */}
      <Card className="p-0 flex-1 flex flex-col max-h-full">
        <div className="flex-1">
          <table className={`w-full customer-table ${responsiveState.isMobile ? 'table-auto' : 'table-fixed'}`}>
            <thead>
              <tr>
                <th className={responsiveState.isMobile ? 'w-8' : ''}>
                  <Checkbox
                    checked={allSelected}
                    onChange={(checked) => handleSelectAll(checked)}
                    className="h-4 w-4"
                  />
                </th>
                <th className={responsiveState.isMobile ? 'w-32' : ''}>Customer</th>
                {!responsiveState.isMobile && <th>Type</th>}
                {!responsiveState.isMobile && <th className="contact-column">Contact</th>}
                {!responsiveState.isMobile && <th className="location-column">Location</th>}
                {!responsiveState.isMobile && <th>AR Balance</th>}
                <th className={responsiveState.isMobile ? 'w-16' : ''}>Actions</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                const isExpanded = expandedRows.has(customer.id);
                const customerDetails = accountDetails?.find(d => d.accountId === customer.id);
                const overdueDays = customerDetails?.overdue_days || 0;
                const hasOverduePayments = overdueDays > 30;
                const hasOutstandingBalance = (customer.ar_balance || 0) > 0;
                const isOverdue = hasOverduePayments || hasOutstandingBalance;
                return (
                  <React.Fragment key={customer.id}>
                    <tr className={`${selectedCustomers.has(customer.id) ? 'selected' : ''} ${isExpanded ? 'expanded-main-row' : ''} ${isOverdue ? 'border-l-4 border-l-red-500' : ''}`}>
                       <td>
                         <Checkbox
                           checked={selectedCustomers.has(customer.id)}
                           onChange={(checked) => handleSelectCustomer(customer.id, checked)}
                           className="h-4 w-4"
                         />
                       </td>
                                               <td>
                          <button
                            onClick={() => setSelectedCustomerForPopup(customer.id)}
                            className="text-left hover:text-purple-600 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-blue-500" />
                              <Text variant="small" className="font-medium text-gray-900">
                                {customer.name}
                              </Text>
                            </div>
                            <div className="mt-1">
                              <AgreementIndicators customer={customer} />
                            </div>
                          </button>
                        </td>
                       {!responsiveState.isMobile && (
                       <td>
                         <Badge
                           variant={customer.account_type === 'commercial' ? 'default' : 'secondary'}
                           className="text-xs"
                         >
                           {customer.account_type}
                         </Badge>
                       </td>
                       )}
                       {!responsiveState.isMobile && (
                       <td className="contact-column">
                         <div className="space-y-1">
                           <div className="flex items-center gap-1 text-sm text-gray-600">
                             <Mail className="h-3 w-3" />
                             <span className="truncate max-w-32">{customer.email || 'No email'}</span>
                           </div>
                           <div className="flex items-center gap-1 text-sm text-gray-600">
                             <Phone className="h-3 w-3" />
                             <span>{customer.phone || 'No phone'}</span>
                           </div>
                         </div>
                       </td>
                       )}
                       {!responsiveState.isMobile && (
                       <td className="location-column">
                         <div className="flex items-center gap-1 text-sm text-gray-600">
                           <MapPin className="h-3 w-3" />
                           <span>{customer.city}, {customer.state}</span>
                         </div>
                       </td>
                       )}
                       {!responsiveState.isMobile && (
                       <td>
                         <div className="flex items-center gap-1">
                           <DollarSign className="h-3 w-3 text-gray-500" />
                           <span className={`text-sm font-medium ${customer.ar_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                             ${customer.ar_balance?.toFixed(2) || '0.00'}
                           </span>
                         </div>
                       </td>
                       )}
                       <td>
                         <div className={`action-buttons ${responsiveState.isMobile ? 'flex flex-col gap-1' : 'flex gap-2'}`}>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => onViewHistory(customer)}
                             className={`action-button ${responsiveState.isMobile ? 'w-full text-xs px-2 py-1' : ''}`}
                           >
                             <Eye className="h-3 w-3" />
                             {!responsiveState.isMobile && 'History'}
                           </Button>
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => onEdit(customer)}
                             className={`action-button ${responsiveState.isMobile ? 'w-full text-xs px-2 py-1' : ''}`}
                           >
                             <Edit className="h-3 w-3" />
                             {!responsiveState.isMobile && 'Edit'}
                           </Button>
                         </div>
                       </td>
                       <td>
                         <button
                           onClick={() => toggleRowExpansion(customer.id)}
                           className="p-1 hover:bg-gray-100 rounded transition-colors"
                         >
                           {isExpanded ? (
                             <ChevronUp className="h-4 w-4 text-gray-500" />
                           ) : (
                             <ChevronDown className="h-4 w-4 text-gray-500" />
                           )}
                         </button>
                       </td>
                     </tr>
                     
                      {/* Expanded Row Content */}
                      {isExpanded && (
                        <tr className={`expanded-row expanded-active ${isOverdue ? 'border-l-4 border-l-red-500' : ''}`} data-customer-id={customer.id}>
                          <td colSpan={8} className="p-0">
                            <div className="expanded-content max-h-48 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 bg-gray-50">
                             <div className="flex gap-3">
                               {/* Left side - Quick Actions and Info */}
                               <div className="flex-1">
                                 <div className="grid grid-cols-2 gap-2">
                               <div>
                                    <Text variant="small" className="font-medium text-gray-900 mb-1 text-xs">
                                   Quick Actions
                                 </Text>
                                                                       <div className="grid grid-cols-2 gap-1">
                                      <Button variant="outline" size="sm" className="justify-start h-5 text-xs px-2">
                                        <Calendar className="h-3 w-3 mr-1" />
                                        Schedule
                                    </Button>
                                      <Button variant="outline" size="sm" className="justify-start h-5 text-xs px-2">
                                        <FileText className="h-3 w-3 mr-1" />
                                        Invoice
                                    </Button>
                                      <Button variant="outline" size="sm" className="justify-start h-5 text-xs px-2">
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        Message
                                    </Button>
                                                                         <Button 
                                       variant="outline" 
                                       size="sm" 
                                        className="justify-start h-5 text-xs px-2"
                                       onClick={() => {
                                         if (mapPopupCustomerId === customer.id) {
                                           setMapPopupCustomerId(null);
                                         } else {
                                           setMapPopupCustomerId(customer.id);
                                         }
                                       }}
                                     >
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {mapPopupCustomerId === customer.id ? 'Hide' : 'Map'}
                                     </Button>
                                  </div>
                               </div>
                                   
                                   {mapPopupCustomerId !== customer.id && (
                                     <div className="col-span-2 grid grid-cols-2 gap-2">
                                    <div>
                                         <Text variant="small" className="font-medium text-gray-900 mb-1 text-xs">
                                        Recent Activity
                                      </Text>
                                         <div className="space-y-0.5 text-xs text-gray-600">
                                        <div>Last service: 2 weeks ago</div>
                                        <div>Last payment: 1 month ago</div>
                                        <div>Next scheduled: Next week</div>
                                      </div>
                                    </div>
                                    <div>
                                         <Text variant="small" className="font-medium text-gray-900 mb-1 text-xs">
                                        Notes
                                      </Text>
                                         <div className="text-xs text-gray-600">
                                        <p>Customer prefers morning appointments. Has a dog in the backyard.</p>
                                      </div>
                                    </div>
                                     </div>
                                   )}
                                 </div>
                               </div>
                               
                               {/* Right side - Map (when shown) */}
                               {mapPopupCustomerId === customer.id && (
                                 <div className="w-48 flex-shrink-0">
                                   <div className="flex items-center justify-between mb-1">
                                     <Text variant="small" className="font-medium text-gray-900 text-xs">
                                        Customer Location
                                      </Text>
                                                                             <button
                                         onClick={() => setMapPopupCustomerId(null)}
                                         className="p-1 hover:bg-gray-100 rounded transition-colors"
                                       >
                                        <X className="h-4 w-4 text-gray-600" />
                                      </button>
                                    </div>
                                   <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                                      {mapPopupCustomer && (
                                        <MapContainer
                                          center={getCustomerCoordinates(mapPopupCustomer)}
                                          zoom={13}
                                          style={{ height: '100%', width: '100%' }}
                                          className="rounded-lg"
                                        >
                                          <TileLayer 
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                          />
                                          <Marker position={getCustomerCoordinates(mapPopupCustomer)}>
                                            <Popup>
                                              <div className="p-2">
                                                <Heading level={6} className="text-gray-900 mb-1">
                                                  {mapPopupCustomer.name}
                                                </Heading>
                                                <div className="text-sm text-gray-600">
                                                  <div>{mapPopupCustomer.city}, {mapPopupCustomer.state}</div>
                                                  <div>{mapPopupCustomer.email}</div>
                                                  <div>{mapPopupCustomer.phone}</div>
                                                </div>
                                              </div>
                                            </Popup>
                                          </Marker>
                                        </MapContainer>
                                      )}
                                    </div>
                                  </div>
                                )}
                             </div>
                           </div>
                         </td>
                       </tr>
                     )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredCustomers.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Heading level={6} className="text-gray-900 mb-2">
              No Customers Found
            </Heading>
            <Text variant="small" className="text-gray-600">
              No customers have been added yet.
            </Text>
          </div>
                 )}
               </Card>

        {/* Customer Profile Popup */}
        {selectedCustomerForPopup && (
          <CustomerPagePopup
            customerId={selectedCustomerForPopup}
            isOpen={!!selectedCustomerForPopup}
            onClose={() => setSelectedCustomerForPopup(null)}
          />
        )}
      </div>
    );
  };

export default CustomerListView;
