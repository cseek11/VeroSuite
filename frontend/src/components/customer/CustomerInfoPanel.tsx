import { useState, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Edit, 
  Save, 
  X, 
  Phone, 
  Mail, 
  Calendar, 
  User, 
  CreditCard, 
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield
} from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';
import { 
  Account, 
  CustomerProfile, 
  CustomerContact
} from '@/types/enhanced-types';
import {
  Typography,
  Button,
  Input,
  Chip,
  Badge
} from '@/components/ui';

interface CustomerInfoPanelProps {
  customer: Account;
  className?: string;
}

interface ServiceType {
  id: string;
  name: string;
  active: boolean;
}

interface ServiceSchedule {
  id: string;
  serviceType: string;
  nextService: string;
  frequency: string;
  technician?: string;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

// Utility functions
const _formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

const _validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active': return 'text-green-600 bg-green-50 border-green-200';
    case 'on_hold': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'canceled': return 'text-red-600 bg-red-50 border-red-200';
    case 'past_due': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'suspended': return 'text-gray-600 bg-gray-50 border-gray-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const _getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'current': return 'text-green-600 bg-green-50 border-green-200';
    case 'past_due': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
    case 'paid': return 'text-blue-600 bg-blue-50 border-blue-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const _getServiceStatusColor = (status: string): string => {
  switch (status) {
    case 'scheduled': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'in_progress': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'completed': return 'text-green-600 bg-green-50 border-green-200';
    case 'cancelled': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

interface CustomerInfoPanelData {
  // Contact Info
  name: string;
  phone: string;
  secondaryPhone: string;
  email: string;
  secondaryEmail: string;
  serviceAddress: Address;
  billingAddress: Address;
  preferredContactMethod: 'phone' | 'email' | 'text';
  
  // Business Information (for Commercial Customers)
  isCommercial: boolean;
  businessName: string;
  businessType: string;
  taxId: string;
  creditLimit: number;
  creditScore: number | undefined;
  creditCheckDate: string | undefined;
  
  // Property & Access Details
  propertyType: 'residential' | 'commercial' | 'industrial';
  propertySize: string;
  accessCodes: string;
  gateCodes: string;
  keyLocations: string;
  specialInstructions: string;
  
  // Communication Preferences
  communicationPreferences: {
    email: boolean;
    phone: boolean;
    text: boolean;
    mail: boolean;
    marketing: boolean;
  };
  preferredLanguage: string;
  timeZone: string;
  
  // Contract & Agreement Details
  contractStartDate: string;
  contractEndDate: string;
  contractType: 'monthly' | 'quarterly' | 'annual' | 'one-time';
  contractValue: number;
  autoRenew: boolean;
  cancellationPolicy: string;
  
  // Service Preferences
  serviceTypes: ServiceType[];
  serviceFrequency: string;
  autoPayEnabled: boolean;
  schedulingPreferences: {
    preferredDays: string[];
    preferredTimes: string[];
    blackoutDates: string[];
  };
  
  // Billing Info
  paymentMethod: string;
  paymentMethods: {
    cod: boolean;
    net30: boolean;
    paymentPlan: boolean;
    creditCard: boolean;
  };
  cardOnFile: boolean;
  billingCycle: string;
  paymentTerms: number; // days
  lateFeePercentage: number;
  lastPaymentDate: string | undefined;
  nextPaymentDue: string | undefined;
  outstandingBalance: number;
  
  // Notes
  customerNotes: string;
  technicianNotes: string;
  accessInstructions: string;
  emergencyContact: string;
  
  // Status
  accountStatus: 'active' | 'on_hold' | 'canceled' | 'past_due' | 'suspended';
  paymentStatus: 'current' | 'past_due' | 'overdue' | 'paid';
  serviceStatus: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  nextScheduledService?: string;
  lastServiceCompleted?: string;
  lastServiceTechnician?: string;
  
  // Auto-fill fields
  autoFillServiceAddress: boolean;
}

const CustomerInfoPanel: React.FC<CustomerInfoPanelProps> = ({ 
  customer, 
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  type TabType = 'overview' | 'business' | 'billing' | 'service' | 'communication' | 'history';
  const [_activeTab, setActiveTab] = useState<TabType>('overview');
  
  // Enhanced API queries
  const queryClient = useQueryClient();
  
  // Fetch customer profile data
  const { data: customerProfile } = useQuery({
    queryKey: ['customer-profile', customer.id],
    queryFn: () => enhancedApi.customers.getById(customer.id),
    enabled: !!customer.id
  });
  
  // Fetch customer contacts
  const { data: customerContacts } = useQuery({
    queryKey: ['customer-contacts', customer.id],
    queryFn: () => enhancedApi.contacts.getByCustomer(customer.id),
    enabled: !!customer.id
  });
  
  // Fetch service types
  const { data: serviceTypes } = useQuery({
    queryKey: ['service-types'],
    queryFn: () => enhancedApi.serviceTypes.getAll()
  });
  
  // Fetch customer segments
  const { data: _customerSegments } = useQuery({
    queryKey: ['customer-segments'],
    queryFn: () => enhancedApi.customerSegments.getAll()
  });
  
  // Fetch payment methods
  const { data: paymentMethods } = useQuery({
    queryKey: ['payment-methods', customer.id],
    queryFn: () => enhancedApi.paymentMethods.getByCustomer(customer.id),
    enabled: !!customer.id
  });
  
  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: async (updates: Partial<Account>) => {
      return enhancedApi.customers.update(customer.id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-profile', customer.id] });
      setIsEditing(false);
    }
  });
  
  // Update customer profile mutation
  const _updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<CustomerProfile>) => {
      return enhancedApi.customers.update(customer.id, {}, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-profile', customer.id] });
    }
  });
  
  // Create/update contact mutation
  const _updateContactMutation = useMutation({
    mutationFn: async (contactData: Partial<CustomerContact>) => {
      if (contactData.id) {
        return enhancedApi.contacts.update(contactData.id, contactData);
      } else {
        return enhancedApi.contacts.create({
          ...contactData,
          account_id: customer.id
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-contacts', customer.id] });
    }
  });
  
  // Initialize panel data from enhanced API data
  const [panelData, setPanelData] = useState<CustomerInfoPanelData>({
    name: customer?.name || '',
    phone: customer?.phone || '',
    secondaryPhone: '',
    email: customer?.email || '',
    secondaryEmail: '',
    serviceAddress: {
      street: customer?.address || '',
      city: customer?.city || '',
      state: customer?.state || '',
      zip: customer?.zip_code || ''
    },
    billingAddress: {
      street: customer?.billing_address?.street || '',
      city: customer?.billing_address?.city || '',
      state: customer?.billing_address?.state || '',
      zip: customer?.billing_address?.zip || ''
    },
    preferredContactMethod: (customer?.preferred_contact_method as 'phone' | 'email' | 'text') || 'phone',
    isCommercial: customer?.account_type === 'commercial' || customer?.account_type === 'industrial',
    businessName: '',
    businessType: '',
    taxId: '',
    creditLimit: 0,
    creditScore: undefined,
    creditCheckDate: undefined,
    propertyType: 'residential',
    propertySize: '',
    accessCodes: '',
    gateCodes: '',
    keyLocations: '',
    specialInstructions: customer?.access_instructions || '',
    communicationPreferences: {
      email: false,
      phone: false,
      text: false,
      mail: false,
      marketing: false
    },
    preferredLanguage: 'English',
    timeZone: 'UTC',
    contractStartDate: '2023-01-01',
    contractEndDate: '2024-01-01',
    contractType: 'monthly',
    contractValue: 0,
    autoRenew: false,
    cancellationPolicy: '',
    serviceTypes: [],
    serviceFrequency: 'monthly',
    autoPayEnabled: false,
    schedulingPreferences: {
      preferredDays: [],
      preferredTimes: [],
      blackoutDates: []
    },
    paymentMethod: customer?.payment_method || '',
    paymentMethods: {
      cod: false,
      net30: false,
      paymentPlan: false,
      creditCard: false
    },
    cardOnFile: false,
    billingCycle: customer?.billing_cycle || 'monthly',
    paymentTerms: 30,
    lateFeePercentage: 1.5,
    lastPaymentDate: undefined,
    nextPaymentDue: undefined,
    outstandingBalance: customer?.ar_balance || 0,
    customerNotes: '',
    technicianNotes: '',
    accessInstructions: customer?.access_instructions || '',
    emergencyContact: customer?.emergency_contact || '',
    accountStatus: (customer?.status as 'active' | 'on_hold' | 'canceled' | 'past_due' | 'suspended') || 'active',
    paymentStatus: 'current',
    serviceStatus: 'scheduled',
    nextScheduledService: '2024-02-15T09:00:00Z',
    lastServiceCompleted: '2024-01-15T10:30:00Z',
    lastServiceTechnician: 'Mike Johnson',
    autoFillServiceAddress: false
  });

  // Update panel data when API data is loaded
  useEffect(() => {
    if (customerProfile?.customer_profile) {
      const profile = customerProfile.customer_profile;
      setPanelData(prev => ({
        ...prev,
        businessName: profile.business_name || '',
        businessType: profile.business_type || '',
        taxId: profile.tax_id || '',
        creditLimit: profile.credit_limit || 0,
        creditScore: profile.credit_score,
        creditCheckDate: profile.credit_check_date,
        propertyType: profile.property_type as 'residential' | 'commercial' | 'industrial' || 'residential',
        propertySize: profile.property_size || '',
        accessCodes: profile.access_codes || '',
        gateCodes: profile.gate_codes || '',
        keyLocations: profile.key_locations || '',
        specialInstructions: profile.special_instructions || '',
        preferredLanguage: profile.preferred_language || 'English',
        timeZone: profile.timezone || 'UTC',
        contractStartDate: profile.contract_start_date || '2023-01-01',
        contractEndDate: profile.contract_end_date || '2024-01-01',
        contractType: profile.contract_type as 'monthly' | 'quarterly' | 'annual' | 'one-time' || 'monthly',
        contractValue: profile.contract_value || 0,
        autoRenew: profile.auto_renew || false,
        cancellationPolicy: profile.cancellation_policy || '',
        accountStatus: profile.account_status || 'active',
        paymentStatus: profile.payment_status || 'current',
        serviceStatus: profile.service_status || 'scheduled'
      }));
    }
  }, [customerProfile]);

  // Update contacts when API data is loaded
  useEffect(() => {
    if (customerContacts && customerContacts.length > 0) {
      const _primaryContact = customerContacts.find(contact => contact.is_primary);
      const secondaryContact = customerContacts.find(contact => !contact.is_primary);
      
      setPanelData(prev => ({
        ...prev,
        secondaryPhone: secondaryContact?.phone || '',
        secondaryEmail: secondaryContact?.email || '',
        emergencyContact: customerContacts.find(contact => contact.is_emergency_contact)?.phone || ''
      }));
    }
  }, [customerContacts]);

  // Update service types when API data is loaded
  useEffect(() => {
    if (serviceTypes) {
      setPanelData(prev => ({
        ...prev,
        serviceTypes: serviceTypes.map(st => ({
          id: st.id,
          name: st.service_name,
          active: st.is_active
        }))
      }));
    }
  }, [serviceTypes]);

  // Update payment methods when API data is loaded
  useEffect(() => {
    if (paymentMethods) {
      setPanelData(prev => ({
        ...prev,
        paymentMethods: {
          cod: paymentMethods.some(pm => pm.payment_type === 'cod'),
          net30: paymentMethods.some(pm => pm.payment_type === 'ach'),
          paymentPlan: false, // Not directly mapped
          creditCard: paymentMethods.some(pm => pm.payment_type === 'credit_card')
        },
        cardOnFile: paymentMethods.some(pm => pm.payment_type === 'credit_card' && pm.is_active)
      }));
    }
  }, [paymentMethods]);

  const handleSave = () => {
    const updates: Partial<Account> = {
      phone: panelData.phone,
      email: panelData.email,
      address: panelData.serviceAddress.street,
      city: panelData.serviceAddress.city,
      state: panelData.serviceAddress.state,
      zip_code: panelData.serviceAddress.zip,
      billing_address: {
        street: panelData.billingAddress.street,
        city: panelData.billingAddress.city,
        state: panelData.billingAddress.state,
        zip: panelData.billingAddress.zip
      } as any,
      preferred_contact_method: panelData.preferredContactMethod,
      billing_cycle: panelData.billingCycle,
      payment_method: panelData.paymentMethod,
      status: panelData.accountStatus,
      access_instructions: panelData.accessInstructions,
      emergency_contact: panelData.emergencyContact
    } as Partial<Account>;

    updateCustomerMutation.mutate(updates);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    setPanelData({
      name: customer?.name || '',
      phone: customer?.phone || '',
      secondaryPhone: '',
      email: customer?.email || '',
      secondaryEmail: '',
      serviceAddress: {
        street: customer?.address || '',
        city: customer?.city || '',
        state: customer?.state || '',
        zip: customer?.zip_code || ''
      },
      billingAddress: {
        street: customer?.billing_address?.street || '',
        city: customer?.billing_address?.city || '',
        state: customer?.billing_address?.state || '',
        zip: customer?.billing_address?.zip || ''
      },
      preferredContactMethod: (customer?.preferred_contact_method as 'phone' | 'email' | 'text') || 'phone',
      isCommercial: customer?.account_type === 'commercial' || customer?.account_type === 'industrial',
      businessName: '',
      businessType: '',
      taxId: '',
      creditLimit: 0,
      creditScore: undefined,
      creditCheckDate: undefined,
      propertyType: 'residential',
      propertySize: '',
      accessCodes: '',
      gateCodes: '',
      keyLocations: '',
      specialInstructions: customer?.access_instructions || '',
      communicationPreferences: {
        email: false,
        phone: false,
        text: false,
        mail: false,
        marketing: false
      },
      preferredLanguage: 'English',
      timeZone: 'UTC',
      contractStartDate: '2023-01-01',
      contractEndDate: '2024-01-01',
      contractType: 'monthly',
      contractValue: 0,
      autoRenew: false,
      cancellationPolicy: '',
      serviceTypes: [],
      serviceFrequency: 'monthly',
      autoPayEnabled: false,
      schedulingPreferences: {
        preferredDays: [],
        preferredTimes: [],
        blackoutDates: []
      },
      paymentMethod: customer?.payment_method || '',
      paymentMethods: {
        cod: false,
        net30: false,
        paymentPlan: false,
        creditCard: false
      },
      cardOnFile: false,
      billingCycle: customer?.billing_cycle || 'monthly',
      paymentTerms: 30,
      lateFeePercentage: 1.5,
      lastPaymentDate: undefined,
      nextPaymentDue: undefined,
      outstandingBalance: customer?.ar_balance || 0,
      customerNotes: '',
      technicianNotes: '',
      accessInstructions: customer?.access_instructions || '',
      emergencyContact: customer?.emergency_contact || '',
      accountStatus: (customer?.status as 'active' | 'on_hold' | 'canceled' | 'past_due' | 'suspended') || 'active',
      paymentStatus: 'current',
      serviceStatus: 'scheduled',
      nextScheduledService: '2024-02-15T09:00:00Z',
      lastServiceCompleted: '2024-01-15T10:30:00Z',
      lastServiceTechnician: 'Mike Johnson',
      autoFillServiceAddress: false
    });
  };

  const toggleServiceType = (serviceId: string) => {
    setPanelData(prev => ({
      ...prev,
      serviceTypes: prev.serviceTypes.map(service =>
        service.id === serviceId 
          ? { ...service, active: !service.active }
          : service
      )
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'on_hold': return <Clock className="w-4 h-4" />;
      case 'canceled': return <X className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className={`fixed left-0 right-0 z-40 transition-all duration-300 ease-in-out ${className}`} style={{ top: '0px' }}>
      {/* Collapsed View */}
      {!isExpanded && (
        <div className="bg-white/95 backdrop-blur-lg border-b border-purple-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Customer Info */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-sm">{customer?.name}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(panelData.accountStatus)}`}
                  >
                    <div className="flex items-center gap-1">
                      {getStatusIcon(panelData.accountStatus)}
                      {panelData.accountStatus.replace('_', ' ').toUpperCase()}
                    </div>
                  </Badge>
                </div>

                {/* Service Types */}
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-600" />
                  <div className="flex gap-1">
                    {panelData.serviceTypes
                      .filter(service => service.active)
                      .slice(0, 3)
                      .map(service => (
                        <Chip key={service.id} variant="outline" className="text-xs">
                          {service.name}
                        </Chip>
                      ))}
                    {panelData.serviceTypes.filter(service => service.active).length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{panelData.serviceTypes.filter(service => service.active).length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Next Service */}
                {panelData.nextScheduledService && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">
                      Next: {new Date(panelData.nextScheduledService).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {/* Phone */}
                {panelData.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">{panelData.phone}</span>
                  </div>
                )}

                {/* Email */}
                {panelData.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">{panelData.email}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-xs"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  View/Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                  className="text-xs"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="bg-white/95 backdrop-blur-lg border-b border-purple-200 shadow-xl max-h-[calc(100vh-4rem)] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="px-4 py-3 border-b border-purple-200 flex items-center justify-between">
              <Typography variant="h6" className="text-purple-900">
                Customer Account Details
              </Typography>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSave}
                      disabled={updateCustomerMutation.isPending}
                      className="text-xs"
                    >
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="text-xs"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-xs"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="text-xs"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </div>
            </div>

                         {/* Content */}
             <div className="px-3 py-3 overflow-y-auto max-h-[calc(100vh-8rem)]">
                               {/* Basic Customer Information */}
                <div className="mb-3 p-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded border border-purple-200">
                  <Typography variant="h6" className="text-purple-900 mb-2 flex items-center gap-1 text-xs font-semibold">
                    <User className="w-3 h-3" />
                    Customer Information
                  </Typography>
                  <div className="space-y-1">
                    <div className="grid grid-cols-4 gap-1">
                      <div className="space-y-0.5">
                        <label className="text-xs font-medium text-gray-600">Name</label>
                        <input
                          type="text"
                          value={customer?.name || ''}
                          disabled={true}
                          className="w-full text-xs px-1 py-0.5 border border-gray-300 rounded bg-gray-50"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-xs font-medium text-gray-600">Phone</label>
                        <input
                          type="text"
                          value={panelData.phone}
                          onChange={(e) => setPanelData(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Phone"
                          className="w-full text-xs px-1 py-0.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-xs font-medium text-gray-600">Email</label>
                        <input
                          type="email"
                          value={panelData.email}
                          onChange={(e) => setPanelData(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                          placeholder="Email"
                          className="w-full text-xs px-1 py-0.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-xs font-medium text-gray-600">Status</label>
                        <div className="flex items-center gap-1 bg-white px-1 py-0.5 rounded border border-gray-200">
                          {getStatusIcon(panelData.accountStatus)}
                          <span className="text-xs font-medium capitalize">{panelData.accountStatus.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Service Address */}
                    <div className="space-y-0.5">
                      <label className="text-xs font-medium text-gray-600">Service Address</label>
                      <div className="grid grid-cols-4 gap-1">
                        <input
                          type="text"
                          value={panelData.serviceAddress.street}
                          onChange={(e) => setPanelData(prev => ({ 
                            ...prev, 
                            serviceAddress: { ...prev.serviceAddress, street: e.target.value }
                          }))}
                          disabled={!isEditing}
                          placeholder="Street"
                          className="text-xs px-1 py-0.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={panelData.serviceAddress.city}
                          onChange={(e) => setPanelData(prev => ({ 
                            ...prev, 
                            serviceAddress: { ...prev.serviceAddress, city: e.target.value }
                          }))}
                          disabled={!isEditing}
                          placeholder="City"
                          className="text-xs px-1 py-0.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={panelData.serviceAddress.state}
                          onChange={(e) => setPanelData(prev => ({ 
                            ...prev, 
                            serviceAddress: { ...prev.serviceAddress, state: e.target.value }
                          }))}
                          disabled={!isEditing}
                          placeholder="State"
                          className="text-xs px-1 py-0.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={panelData.serviceAddress.zip}
                          onChange={(e) => setPanelData(prev => ({ 
                            ...prev, 
                            serviceAddress: { ...prev.serviceAddress, zip: e.target.value }
                          }))}
                          disabled={!isEditing}
                          placeholder="ZIP"
                          className="text-xs px-1 py-0.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    {/* Billing Address */}
                    <div className="space-y-0.5">
                      <label className="text-xs font-medium text-gray-600">Billing Address</label>
                      <div className="grid grid-cols-4 gap-1">
                        <input
                          type="text"
                          value={panelData.billingAddress.street}
                          onChange={(e) => setPanelData(prev => ({ 
                            ...prev, 
                            billingAddress: { ...prev.billingAddress, street: e.target.value }
                          }))}
                          disabled={!isEditing}
                          placeholder="Street"
                          className="text-xs px-1 py-0.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={panelData.billingAddress.city}
                          onChange={(e) => setPanelData(prev => ({ 
                            ...prev, 
                            billingAddress: { ...prev.billingAddress, city: e.target.value }
                          }))}
                          disabled={!isEditing}
                          placeholder="City"
                          className="text-xs px-1 py-0.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={panelData.billingAddress.state}
                          onChange={(e) => setPanelData(prev => ({ 
                            ...prev, 
                            billingAddress: { ...prev.billingAddress, state: e.target.value }
                          }))}
                          disabled={!isEditing}
                          placeholder="State"
                          className="text-xs px-1 py-0.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                        <input
                          type="text"
                          value={panelData.billingAddress.zip}
                          onChange={(e) => setPanelData(prev => ({ 
                            ...prev, 
                            billingAddress: { ...prev.billingAddress, zip: e.target.value }
                          }))}
                          disabled={!isEditing}
                          placeholder="ZIP"
                          className="text-xs px-1 py-0.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1">
                      {isEditing ? (
                        <div className="space-y-0.5">
                          <label className="text-xs font-medium text-gray-600">Preferred Contact</label>
                          <select
                            value={panelData.preferredContactMethod}
                            onChange={(e) => setPanelData(prev => ({ 
                              ...prev, 
                              preferredContactMethod: e.target.value as 'phone' | 'email' | 'text' 
                            }))}
                            className="w-full text-xs px-1 py-0.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="phone">Phone</option>
                            <option value="email">Email</option>
                            <option value="text">Text</option>
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <label className="text-xs font-medium text-gray-600">Preferred Contact</label>
                          <div className="text-xs text-gray-700 capitalize bg-white px-1 py-0.5 rounded border border-gray-200">
                            {panelData.preferredContactMethod}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                               <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">

                                                   {/* Service Preferences */}
                  <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <Typography variant="h6" className="text-purple-900 flex items-center gap-1 text-sm font-semibold border-b border-gray-200 pb-2">
                      <Shield className="w-3 h-3" />
                      Service Preferences
                    </Typography>
                   
                   <div className="space-y-2">
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Service Types</label>
                       <div className="grid grid-cols-2 gap-1">
                         {panelData.serviceTypes.map(service => (
                           <label key={service.id} className="flex items-center gap-1 text-xs">
                             <input
                               type="checkbox"
                               checked={service.active}
                               onChange={() => toggleServiceType(service.id)}
                               disabled={!isEditing}
                               className="text-purple-600 focus:ring-purple-500 w-3 h-3"
                             />
                             <span className={service.active ? 'text-gray-900' : 'text-gray-500'}>
                               {service.name}
                             </span>
                           </label>
                         ))}
                       </div>
                     </div>
                     
                     {isEditing ? (
                       <div className="space-y-1">
                         <label className="text-xs font-medium text-gray-600">Service Frequency</label>
                         <select
                           value={panelData.serviceFrequency}
                           onChange={(e) => setPanelData(prev => ({ ...prev, serviceFrequency: e.target.value }))}
                           className="w-full text-xs px-1 py-0.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                         >
                           <option value="weekly">Weekly</option>
                           <option value="bi-weekly">Bi-weekly</option>
                           <option value="monthly">Monthly</option>
                           <option value="quarterly">Quarterly</option>
                           <option value="annually">Annually</option>
                         </select>
                       </div>
                     ) : (
                       <div className="space-y-0.5">
                         <label className="text-xs font-medium text-gray-600">Service Frequency</label>
                         <div className="text-xs text-gray-700 capitalize">
                           {panelData.serviceFrequency}
                         </div>
                       </div>
                     )}
                     
                     <div className="flex items-center gap-1">
                       <input
                         type="checkbox"
                         checked={panelData.autoPayEnabled}
                         onChange={(e) => setPanelData(prev => ({ ...prev, autoPayEnabled: e.target.checked }))}
                         disabled={!isEditing}
                         className="text-purple-600 focus:ring-purple-500 w-3 h-3"
                       />
                       <label className="text-xs">Auto-pay enabled</label>
                     </div>
                   </div>
                 </div>

                                                   {/* Billing Information */}
                  <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <Typography variant="h6" className="text-purple-900 flex items-center gap-1 text-sm font-semibold border-b border-gray-200 pb-2">
                      <CreditCard className="w-3 h-3" />
                      Billing Information
                    </Typography>
                   
                   <div className="space-y-2">
                     <Input
                       label="Payment Method"
                       value={panelData.paymentMethod}
                       onChange={(value) => setPanelData(prev => ({ ...prev, paymentMethod: value }))}
                       disabled={!isEditing}
                       placeholder="Payment method"
                     />
                     
                     <div className="flex items-center gap-1">
                       <input
                         type="checkbox"
                         checked={panelData.cardOnFile}
                         onChange={(e) => setPanelData(prev => ({ ...prev, cardOnFile: e.target.checked }))}
                         disabled={!isEditing}
                         className="text-purple-600 focus:ring-purple-500 w-3 h-3"
                       />
                       <label className="text-xs">Card on file</label>
                     </div>
                     
                     {isEditing ? (
                       <div className="space-y-1">
                         <label className="text-xs font-medium text-gray-600">Billing Cycle</label>
                         <select
                           value={panelData.billingCycle}
                           onChange={(e) => setPanelData(prev => ({ ...prev, billingCycle: e.target.value }))}
                           className="w-full text-xs px-1 py-0.5 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                         >
                           <option value="monthly">Monthly</option>
                           <option value="quarterly">Quarterly</option>
                           <option value="annually">Annually</option>
                         </select>
                       </div>
                     ) : (
                       <div className="space-y-0.5">
                         <label className="text-xs font-medium text-gray-600">Billing Cycle</label>
                         <div className="text-xs text-gray-700 capitalize">
                           {panelData.billingCycle}
                         </div>
                       </div>
                     )}
                   </div>
                 </div>

                                                   {/* Notes Section */}
                  <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm lg:col-span-2 xl:col-span-3">
                    <Typography variant="h6" className="text-purple-900 flex items-center gap-1 text-sm font-semibold border-b border-gray-200 pb-2">
                      <FileText className="w-3 h-3" />
                      Notes & Instructions
                    </Typography>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                     <div className="space-y-3">
                       <div className="space-y-1">
                         <label className="text-xs font-medium text-gray-600">Customer Notes</label>
                         <textarea
                           value={panelData.customerNotes}
                           onChange={(e) => setPanelData(prev => ({ ...prev, customerNotes: e.target.value }))}
                           disabled={!isEditing}
                           placeholder="Customer preferences, gate codes, pets, allergies..."
                           rows={2}
                           className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none"
                         />
                       </div>
                       
                       <Input
                         label="Emergency Contact"
                         value={panelData.emergencyContact}
                         onChange={(value) => setPanelData(prev => ({ ...prev, emergencyContact: value }))}
                         disabled={!isEditing}
                         placeholder="Emergency contact information"
                       />
                     </div>
                     
                     <div className="space-y-3">
                       <div className="space-y-1">
                         <label className="text-xs font-medium text-gray-600">Technician Notes</label>
                         <textarea
                           value={panelData.technicianNotes}
                           onChange={(e) => setPanelData(prev => ({ ...prev, technicianNotes: e.target.value }))}
                           disabled={!isEditing}
                           placeholder="Special instructions for technicians..."
                           rows={2}
                           className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none"
                         />
                       </div>
                       
                       <Input
                         label="Access Instructions"
                         value={panelData.accessInstructions}
                         onChange={(value) => setPanelData(prev => ({ ...prev, accessInstructions: value }))}
                         disabled={!isEditing}
                         placeholder="Gate codes, key locations, access notes..."
                       />
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerInfoPanel;
