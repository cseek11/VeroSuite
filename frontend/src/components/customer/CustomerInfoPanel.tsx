import React, { useState, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Edit, 
  Save, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  User, 
  Building, 
  CreditCard, 
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Shield,
  Settings,
  MessageSquare
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/api';
import {
  Typography,
  Button,
  Input,
  Textarea,
  Chip,
  Badge
} from '@/components/ui';

interface CustomerInfoPanelProps {
  customer: any;
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
const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

const validateEmail = (email: string): boolean => {
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

const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'current': return 'text-green-600 bg-green-50 border-green-200';
    case 'past_due': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
    case 'paid': return 'text-blue-600 bg-blue-50 border-blue-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getServiceStatusColor = (status: string): string => {
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
  const [panelData, setPanelData] = useState<CustomerInfoPanelData>({
    name: customer?.name || '',
    phone: customer?.phone || '',
    secondaryPhone: '',
    email: customer?.email || '',
    secondaryEmail: '',
    serviceAddress: {
      street: customer?.address?.street || '',
      city: customer?.address?.city || '',
      state: customer?.address?.state || '',
      zip: customer?.address?.zip || ''
    },
    billingAddress: {
      street: customer?.billing_address?.street || '',
      city: customer?.billing_address?.city || '',
      state: customer?.billing_address?.state || '',
      zip: customer?.billing_address?.zip || ''
    },
    preferredContactMethod: customer?.preferred_contact_method || 'phone',
    isCommercial: false, // Placeholder, will be updated
    businessName: '', // Placeholder, will be updated
    businessType: '', // Placeholder, will be updated
    taxId: '', // Placeholder, will be updated
    creditLimit: 0, // Placeholder, will be updated
         creditScore: undefined as number | undefined, // Placeholder, will be updated
     creditCheckDate: undefined as string | undefined, // Placeholder, will be updated
    propertyType: 'residential', // Placeholder, will be updated
    propertySize: '', // Placeholder, will be updated
    accessCodes: '', // Placeholder, will be updated
    gateCodes: '', // Placeholder, will be updated
    keyLocations: '', // Placeholder, will be updated
    specialInstructions: '', // Placeholder, will be updated
    communicationPreferences: {
      email: false,
      phone: false,
      text: false,
      mail: false,
      marketing: false
    },
    preferredLanguage: 'English', // Placeholder, will be updated
    timeZone: 'UTC', // Placeholder, will be updated
    contractStartDate: '2023-01-01', // Placeholder, will be updated
    contractEndDate: '2024-01-01', // Placeholder, will be updated
    contractType: 'monthly', // Placeholder, will be updated
    contractValue: 0, // Placeholder, will be updated
    autoRenew: false, // Placeholder, will be updated
    cancellationPolicy: '', // Placeholder, will be updated
    serviceTypes: [
      { id: '1', name: 'General Pest Control', active: true },
      { id: '2', name: 'Termite Treatment', active: false },
      { id: '3', name: 'Mosquito Control', active: false },
      { id: '4', name: 'Rodent Control', active: false },
      { id: '5', name: 'Wildlife Removal', active: false },
      { id: '6', name: 'Lawn Care', active: false }
    ],
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
    paymentTerms: 30, // Default
    lateFeePercentage: 1.5, // Default
    lastPaymentDate: undefined, // Placeholder
    nextPaymentDue: undefined, // Placeholder
    outstandingBalance: 0, // Placeholder
    customerNotes: customer?.notes || '',
    technicianNotes: '',
    accessInstructions: customer?.access_instructions || '',
    emergencyContact: customer?.emergency_contact || '',
    accountStatus: customer?.status || 'active',
    paymentStatus: 'current', // Default
    serviceStatus: 'scheduled', // Default
    nextScheduledService: '2024-02-15T09:00:00Z',
    lastServiceCompleted: '2024-01-15T10:30:00Z',
    lastServiceTechnician: 'Mike Johnson',
    autoFillServiceAddress: false // Default
  });

  const queryClient = useQueryClient();

  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: async (data: Partial<CustomerInfoPanelData>) => {
      const { error } = await supabase
        .from('accounts')
        .update({
          name: data.name,
          phone: data.phone,
          secondary_phone: data.secondaryPhone,
          email: data.email,
          secondary_email: data.secondaryEmail,
          address: data.serviceAddress,
          billing_address: data.billingAddress,
          preferred_contact_method: data.preferredContactMethod,
          is_commercial: data.isCommercial,
          business_name: data.businessName,
          business_type: data.businessType,
          tax_id: data.taxId,
          credit_limit: data.creditLimit,
          credit_score: data.creditScore,
          credit_check_date: data.creditCheckDate,
          property_type: data.propertyType,
          property_size: data.propertySize,
          access_codes: data.accessCodes,
          gate_codes: data.gateCodes,
          key_locations: data.keyLocations,
          special_instructions: data.specialInstructions,
          communication_preferences: data.communicationPreferences,
          preferred_language: data.preferredLanguage,
          time_zone: data.timeZone,
          contract_start_date: data.contractStartDate,
          contract_end_date: data.contractEndDate,
          contract_type: data.contractType,
          contract_value: data.contractValue,
          auto_renew: data.autoRenew,
          cancellation_policy: data.cancellationPolicy,
          payment_method: data.paymentMethod,
          payment_methods: data.paymentMethods,
          card_on_file: data.cardOnFile,
          billing_cycle: data.billingCycle,
          payment_terms: data.paymentTerms,
          late_fee_percentage: data.lateFeePercentage,
          last_payment_date: data.lastPaymentDate,
          next_payment_due: data.nextPaymentDue,
          outstanding_balance: data.outstandingBalance,
          notes: data.customerNotes,
          access_instructions: data.accessInstructions,
          emergency_contact: data.emergencyContact,
          account_status: data.accountStatus,
          payment_status: data.paymentStatus,
          service_status: data.serviceStatus,
          scheduling_preferences: data.schedulingPreferences,
          auto_fill_service_address: data.autoFillServiceAddress
        })
        .eq('id', customer.id);

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', customer.id] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Error updating customer:', error);
      alert('Failed to update customer information. Please try again.');
    }
  });

  const handleSave = () => {
    updateCustomerMutation.mutate(panelData);
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
        street: customer?.address?.street || '',
        city: customer?.address?.city || '',
        state: customer?.address?.state || '',
        zip: customer?.address?.zip || ''
      },
      billingAddress: {
        street: customer?.billing_address?.street || '',
        city: customer?.billing_address?.city || '',
        state: customer?.billing_address?.state || '',
        zip: customer?.billing_address?.zip || ''
      },
      preferredContactMethod: customer?.preferred_contact_method || 'phone',
      isCommercial: false, // Reset
      businessName: '', // Reset
      businessType: '', // Reset
      taxId: '', // Reset
      creditLimit: 0, // Reset
      creditScore: undefined, // Reset
      creditCheckDate: undefined, // Reset
      propertyType: 'residential', // Reset
      propertySize: '', // Reset
      accessCodes: '', // Reset
      gateCodes: '', // Reset
      keyLocations: '', // Reset
      specialInstructions: '', // Reset
      communicationPreferences: { // Reset
        email: false,
        phone: false,
        text: false,
        mail: false,
        marketing: false
      },
      preferredLanguage: 'English', // Reset
      timeZone: 'UTC', // Reset
      contractStartDate: '2023-01-01', // Reset
      contractEndDate: '2024-01-01', // Reset
      contractType: 'monthly', // Reset
      contractValue: 0, // Reset
      autoRenew: false, // Reset
      cancellationPolicy: '', // Reset
      serviceTypes: panelData.serviceTypes, // Keep current service types
      serviceFrequency: 'monthly',
      autoPayEnabled: false,
      schedulingPreferences: { // Reset
        preferredDays: [],
        preferredTimes: [],
        blackoutDates: []
      },
      paymentMethod: customer?.payment_method || '',
      paymentMethods: { // Reset
        cod: false,
        net30: false,
        paymentPlan: false,
        creditCard: false
      },
      cardOnFile: false,
      billingCycle: customer?.billing_cycle || 'monthly',
      paymentTerms: 30, // Reset
      lateFeePercentage: 1.5, // Reset
      lastPaymentDate: undefined, // Reset
      nextPaymentDue: undefined, // Reset
      outstandingBalance: 0, // Reset
      customerNotes: customer?.notes || '',
      technicianNotes: '',
      accessInstructions: customer?.access_instructions || '',
      emergencyContact: customer?.emergency_contact || '',
      accountStatus: customer?.status || 'active',
      paymentStatus: 'current', // Reset
      serviceStatus: 'scheduled', // Reset
      nextScheduledService: '2024-02-15T09:00:00Z',
      lastServiceCompleted: '2024-01-15T10:30:00Z',
      lastServiceTechnician: 'Mike Johnson',
      autoFillServiceAddress: false // Reset
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'canceled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
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
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-sm">{customer?.name}</span>
                    </div>
                    {/* Address under name */}
                    {panelData.serviceAddress.street && (
                      <div className="flex items-center gap-1 ml-6">
                        <MapPin className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-600">
                          {`${panelData.serviceAddress.street}, ${panelData.serviceAddress.city}, ${panelData.serviceAddress.state} ${panelData.serviceAddress.zip}`}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(panelData.accountStatus)}`}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(panelData.accountStatus)}
                        {panelData.accountStatus.replace('_', ' ').toUpperCase()}
                      </div>
                    </Badge>
                    {/* Payment Status */}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getPaymentStatusColor(panelData.paymentStatus)}`}
                    >
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {panelData.paymentStatus.toUpperCase()}
                      </div>
                    </Badge>
                    {/* Service Status */}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getServiceStatusColor(panelData.serviceStatus)}`}
                    >
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        {panelData.serviceStatus.replace('_', ' ').toUpperCase()}
                      </div>
                    </Badge>
                  </div>
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
                    <span className="text-sm">{formatPhoneNumber(panelData.phone)}</span>
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
             <div className="px-3 py-3 overflow-y-auto max-h-[calc(100vh-8rem)] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-purple-50 [&::-webkit-scrollbar-thumb]:bg-purple-300 hover:[&::-webkit-scrollbar-thumb]:bg-purple-400">
                               {/* Basic Customer Information */}
                <div className="mb-3 p-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded border border-purple-200">
                  <Typography variant="h6" className="text-purple-900 mb-2 flex items-center gap-1 text-xs font-semibold">
                    <User className="w-3 h-3" />
                    Customer Information
                  </Typography>
                  <div className="space-y-1">
                    <div className="grid grid-cols-4 gap-1">
                      <div className="space-y-0.5">
                        <label className="text-xs font-medium text-purple-700">Name</label>
                        <input
                          type="text"
                          value={customer?.name || ''}
                          disabled={true}
                          className="w-full text-xs px-1 py-0.5 border border-purple-300 rounded bg-purple-50"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-xs font-medium text-purple-700">Phone</label>
                        <input
                          type="text"
                          value={panelData.phone}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            setPanelData(prev => ({ ...prev, phone: formatted }));
                          }}
                          onBlur={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            setPanelData(prev => ({ ...prev, phone: formatted }));
                          }}
                          disabled={!isEditing}
                          placeholder="(555) 123-4567"
                          className="w-full text-xs px-1 py-0.5 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-xs font-medium text-purple-700">Email</label>
                        <input
                          type="email"
                          value={panelData.email}
                          onChange={(e) => setPanelData(prev => ({ ...prev, email: e.target.value }))}
                          onBlur={(e) => {
                            if (e.target.value && !validateEmail(e.target.value)) {
                              // You could show an error message here
                              console.warn('Invalid email format');
                            }
                          }}
                          disabled={!isEditing}
                          placeholder="email@example.com"
                          className={`w-full text-xs px-1 py-0.5 border rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 ${
                            panelData.email && !validateEmail(panelData.email) 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-purple-300'
                          }`}
                        />
                        {panelData.email && !validateEmail(panelData.email) && (
                          <span className="text-xs text-red-500">Invalid email format</span>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-xs font-medium text-purple-700">Status</label>
                        <div className="flex items-center gap-1 bg-white px-1 py-0.5 rounded border border-purple-200">
                          {getStatusIcon(panelData.accountStatus)}
                          <span className="text-xs font-medium capitalize text-purple-700">{panelData.accountStatus.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Service Address */}
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-purple-700">Service Address</label>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              setPanelData(prev => ({
                                ...prev,
                                serviceAddress: { ...prev.billingAddress }
                              }));
                            }}
                            className="text-xs text-purple-600 hover:text-purple-700 underline"
                          >
                            Copy from Billing
                          </button>
                        )}
                      </div>
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
                          className="text-xs px-1 py-0.5 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
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
                          className="text-xs px-1 py-0.5 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
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
                          className="text-xs px-1 py-0.5 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
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
                          className="text-xs px-1 py-0.5 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    {/* Billing Address */}
                    <div className="space-y-0.5">
                      <label className="text-xs font-medium text-purple-700">Billing Address</label>
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
                          className="text-xs px-1 py-0.5 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
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
                          className="text-xs px-1 py-0.5 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
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
                          className="text-xs px-1 py-0.5 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
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
                          className="text-xs px-1 py-0.5 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-1">
                      {isEditing ? (
                        <div className="space-y-0.5">
                          <label className="text-xs font-medium text-purple-700">Preferred Contact</label>
                          <select
                            value={panelData.preferredContactMethod}
                            onChange={(e) => setPanelData(prev => ({ 
                              ...prev, 
                              preferredContactMethod: e.target.value as 'phone' | 'email' | 'text' 
                            }))}
                            className="w-full text-xs px-1 py-0.5 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="phone">Phone</option>
                            <option value="email">Email</option>
                            <option value="text">Text</option>
                          </select>
                        </div>
                      ) : (
                        <div className="space-y-0.5">
                          <label className="text-xs font-medium text-purple-700">Preferred Contact</label>
                          <div className="text-xs text-purple-700 capitalize bg-white px-1 py-0.5 rounded border border-purple-200">
                            {panelData.preferredContactMethod}
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-0.5">
                        <label className="text-xs font-medium text-purple-700">Secondary Phone</label>
                        <input
                          type="text"
                          value={panelData.secondaryPhone}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            setPanelData(prev => ({ ...prev, secondaryPhone: formatted }));
                          }}
                          onBlur={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            setPanelData(prev => ({ ...prev, secondaryPhone: formatted }));
                          }}
                          disabled={!isEditing}
                          placeholder="(555) 123-4567"
                          className="w-full text-xs px-1 py-0.5 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      
                      <div className="space-y-0.5">
                        <label className="text-xs font-medium text-purple-700">Secondary Email</label>
                        <input
                          type="email"
                          value={panelData.secondaryEmail}
                          onChange={(e) => setPanelData(prev => ({ ...prev, secondaryEmail: e.target.value }))}
                          onBlur={(e) => {
                            if (e.target.value && !validateEmail(e.target.value)) {
                              console.warn('Invalid email format');
                            }
                          }}
                          disabled={!isEditing}
                          placeholder="email@example.com"
                          className={`w-full text-xs px-1 py-0.5 border rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 ${
                            panelData.secondaryEmail && !validateEmail(panelData.secondaryEmail) 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-purple-300'
                          }`}
                        />
                      </div>
                      
                      <div className="space-y-0.5">
                        <label className="text-xs font-medium text-purple-700">Customer Type</label>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 text-xs">
                            <input
                              type="checkbox"
                              checked={!panelData.isCommercial}
                              onChange={(e) => setPanelData(prev => ({ ...prev, isCommercial: !e.target.checked }))}
                              disabled={!isEditing}
                              className="text-purple-600 focus:ring-purple-500 w-3 h-3 accent-purple-600 checked:bg-purple-600 checked:border-purple-600 border-purple-300 bg-white"
                            />
                            <span>Residential</span>
                          </label>
                          <label className="flex items-center gap-1 text-xs">
                            <input
                              type="checkbox"
                              checked={panelData.isCommercial}
                              onChange={(e) => setPanelData(prev => ({ ...prev, isCommercial: e.target.checked }))}
                              disabled={!isEditing}
                              className="text-purple-600 focus:ring-purple-500 w-3 h-3 accent-purple-600 checked:bg-purple-600 checked:border-purple-600 border-purple-300 bg-white"
                            />
                            <span>Commercial</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                               <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">

                                                   {/* Service Preferences */}
                  <div className="space-y-3 p-3 bg-white rounded-lg border border-purple-200 shadow-sm">
                    <Typography variant="h6" className="text-purple-900 flex items-center gap-1 text-sm font-semibold border-b border-purple-200 pb-2">
                      <Shield className="w-3 h-3" />
                      Service Preferences
                    </Typography>
                   
                   <div className="space-y-2">
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-purple-700">Service Types</label>
                       <div className="grid grid-cols-2 gap-1">
                         {panelData.serviceTypes.map(service => (
                           <label key={service.id} className="flex items-center gap-1 text-xs">
                             <input
                               type="checkbox"
                               checked={service.active}
                               onChange={() => toggleServiceType(service.id)}
                               disabled={!isEditing}
                               className="text-purple-600 focus:ring-purple-500 w-3 h-3 accent-purple-600 checked:bg-purple-600 checked:border-purple-600 border-purple-300 bg-white"
                             />
                             <span className={service.active ? 'text-purple-900' : 'text-purple-500'}>
                               {service.name}
                             </span>
                           </label>
                         ))}
                       </div>
                     </div>
                     
                     {isEditing ? (
                       <div className="space-y-1">
                         <label className="text-xs font-medium text-purple-700">Service Frequency</label>
                         <select
                           value={panelData.serviceFrequency}
                           onChange={(e) => setPanelData(prev => ({ ...prev, serviceFrequency: e.target.value }))}
                           className="w-full text-xs px-1 py-0.5 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
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
                         <label className="text-xs font-medium text-purple-700">Service Frequency</label>
                         <div className="text-xs text-purple-700 capitalize">
                           {panelData.serviceFrequency}
                         </div>
                       </div>
                     )}
                     

                   </div>
                 </div>

                                                   {/* Billing Information */}
                  <div className="space-y-3 p-3 bg-white rounded-lg border border-purple-200 shadow-sm">
                    <Typography variant="h6" className="text-purple-900 flex items-center gap-1 text-sm font-semibold border-b border-purple-200 pb-2">
                      <CreditCard className="w-3 h-3" />
                      Billing Information
                    </Typography>
                   
                   <div className="space-y-2">
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-purple-700">Payment Methods</label>
                       <div className="grid grid-cols-2 gap-1">
                         <label className="flex items-center gap-1 text-xs">
                           <input
                             type="checkbox"
                             checked={panelData.paymentMethods.cod}
                             onChange={(e) => setPanelData(prev => ({ 
                               ...prev, 
                               paymentMethods: { ...prev.paymentMethods, cod: e.target.checked }
                             }))}
                             disabled={!isEditing}
                             className="text-purple-600 focus:ring-purple-500 w-3 h-3 accent-purple-600 checked:bg-purple-600 checked:border-purple-600 border-purple-300 bg-white"
                           />
                           <span className="text-purple-700">COD</span>
                         </label>
                         <label className="flex items-center gap-1 text-xs">
                           <input
                             type="checkbox"
                             checked={panelData.paymentMethods.net30}
                             onChange={(e) => setPanelData(prev => ({ 
                               ...prev, 
                               paymentMethods: { ...prev.paymentMethods, net30: e.target.checked }
                             }))}
                             disabled={!isEditing}
                             className="text-purple-600 focus:ring-purple-500 w-3 h-3 accent-purple-600 checked:bg-purple-600 checked:border-purple-600 border-purple-300 bg-white"
                           />
                           <span className="text-purple-700">Net 30</span>
                         </label>
                         <label className="flex items-center gap-1 text-xs">
                           <input
                             type="checkbox"
                             checked={panelData.paymentMethods.paymentPlan}
                             onChange={(e) => setPanelData(prev => ({ 
                               ...prev, 
                               paymentMethods: { ...prev.paymentMethods, paymentPlan: e.target.checked }
                             }))}
                             disabled={!isEditing}
                             className="text-purple-600 focus:ring-purple-500 w-3 h-3 accent-purple-600 checked:bg-purple-600 checked:border-purple-600 border-purple-300 bg-white"
                           />
                           <span className="text-purple-700">Payment Plan</span>
                         </label>
                         <label className="flex items-center gap-1 text-xs">
                           <input
                             type="checkbox"
                             checked={panelData.paymentMethods.creditCard}
                             onChange={(e) => setPanelData(prev => ({ 
                               ...prev, 
                               paymentMethods: { ...prev.paymentMethods, creditCard: e.target.checked }
                             }))}
                             disabled={!isEditing}
                             className="text-purple-600 focus:ring-purple-500 w-3 h-3 accent-purple-600 checked:bg-purple-600 checked:border-purple-600 border-purple-300 bg-white"
                           />
                           <span className="text-purple-700">Credit Card</span>
                         </label>
                       </div>
                     </div>
                     
                     <div className="flex items-center gap-1">
                       <input
                         type="checkbox"
                         checked={panelData.cardOnFile}
                         onChange={(e) => setPanelData(prev => ({ ...prev, cardOnFile: e.target.checked }))}
                         disabled={!isEditing}
                         className="text-purple-600 focus:ring-purple-500 w-3 h-3 accent-purple-600 checked:bg-purple-600 checked:border-purple-600 border-purple-300 bg-white"
                       />
                       <label className="text-xs text-purple-700">Card on file</label>
                     </div>
                     
                     <div className="flex items-center gap-1">
                       <input
                         type="checkbox"
                         checked={panelData.autoPayEnabled}
                         onChange={(e) => setPanelData(prev => ({ ...prev, autoPayEnabled: e.target.checked }))}
                         disabled={!isEditing}
                         className="text-purple-600 focus:ring-purple-500 w-3 h-3 accent-purple-600 checked:bg-purple-600 checked:border-purple-600 border-purple-300 bg-white"
                       />
                       <label className="text-xs text-purple-700">Auto-pay enabled</label>
                     </div>
                     
                     {isEditing ? (
                       <div className="space-y-1">
                         <label className="text-xs font-medium text-purple-700">Billing Cycle</label>
                         <select
                           value={panelData.billingCycle}
                           onChange={(e) => setPanelData(prev => ({ ...prev, billingCycle: e.target.value }))}
                           className="w-full text-xs px-1 py-0.5 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                         >
                           <option value="monthly">Monthly</option>
                           <option value="quarterly">Quarterly</option>
                           <option value="annually">Annually</option>
                         </select>
                       </div>
                     ) : (
                       <div className="space-y-0.5">
                         <label className="text-xs font-medium text-purple-700">Billing Cycle</label>
                         <div className="text-xs text-purple-700 capitalize">
                           {panelData.billingCycle}
                         </div>
                       </div>
                     )}
                   </div>
                 </div>

                                                   {/* Notes Section */}
                  <div className="space-y-3 p-3 bg-white rounded-lg border border-purple-200 shadow-sm lg:col-span-2 xl:col-span-3">
                    <Typography variant="h6" className="text-purple-900 flex items-center gap-1 text-sm font-semibold border-b border-purple-200 pb-2">
                      <FileText className="w-3 h-3" />
                      Notes & Instructions
                    </Typography>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                     <div className="space-y-3">
                       <div className="space-y-1">
                         <label className="text-xs font-medium text-purple-700">Customer Notes</label>
                         <textarea
                           value={panelData.customerNotes}
                           onChange={(e) => setPanelData(prev => ({ ...prev, customerNotes: e.target.value }))}
                           disabled={!isEditing}
                           placeholder="Customer preferences, gate codes, pets, allergies..."
                           rows={2}
                           className="w-full text-xs px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none"
                         />
                       </div>
                       
                       <div className="space-y-1">
                         <label className="text-xs font-medium text-purple-700">Emergency Contact</label>
                         <input
                           type="text"
                           value={panelData.emergencyContact}
                           onChange={(e) => setPanelData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                           disabled={!isEditing}
                           placeholder="Emergency contact information"
                           className="w-full text-xs px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                         />
                       </div>
                     </div>
                     
                     <div className="space-y-3">
                       <div className="space-y-1">
                         <label className="text-xs font-medium text-purple-700">Technician Notes</label>
                         <textarea
                           value={panelData.technicianNotes}
                           onChange={(e) => setPanelData(prev => ({ ...prev, technicianNotes: e.target.value }))}
                           disabled={!isEditing}
                           placeholder="Special instructions for technicians..."
                           rows={2}
                           className="w-full text-xs px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-none"
                         />
                       </div>
                       
                       <div className="space-y-1">
                         <label className="text-xs font-medium text-purple-700">Access Instructions</label>
                         <input
                           type="text"
                           value={panelData.accessInstructions}
                           onChange={(e) => setPanelData(prev => ({ ...prev, accessInstructions: e.target.value }))}
                           disabled={!isEditing}
                           placeholder="Gate codes, key locations, access notes..."
                           className="w-full text-xs px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                         />
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Business Information (for Commercial Customers) */}
                 {panelData.isCommercial && (
                   <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                     <Typography variant="h6" className="text-purple-900 flex items-center gap-1 text-sm font-semibold border-b border-gray-200 pb-2">
                       <Building className="w-3 h-3" />
                       Business Information
                     </Typography>
                     
                     <div className="grid grid-cols-2 gap-2">
                       <div className="space-y-1">
                         <label className="text-xs font-medium text-gray-600">Business Name</label>
                         <input
                           type="text"
                           value={panelData.businessName}
                           onChange={(e) => setPanelData(prev => ({ ...prev, businessName: e.target.value }))}
                           disabled={!isEditing}
                           placeholder="Business name"
                           className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                         />
                       </div>
                       <div className="space-y-1">
                         <label className="text-xs font-medium text-gray-600">Business Type</label>
                         <input
                           type="text"
                           value={panelData.businessType}
                           onChange={(e) => setPanelData(prev => ({ ...prev, businessType: e.target.value }))}
                           disabled={!isEditing}
                           placeholder="Restaurant, Office, etc."
                           className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                         />
                       </div>
                       <div className="space-y-1">
                         <label className="text-xs font-medium text-gray-600">Tax ID</label>
                         <input
                           type="text"
                           value={panelData.taxId}
                           onChange={(e) => setPanelData(prev => ({ ...prev, taxId: e.target.value }))}
                           disabled={!isEditing}
                           placeholder="EIN or Tax ID"
                           className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                         />
                       </div>
                       <div className="space-y-1">
                         <label className="text-xs font-medium text-gray-600">Credit Limit</label>
                         <input
                           type="number"
                           value={panelData.creditLimit}
                           onChange={(e) => setPanelData(prev => ({ ...prev, creditLimit: Number(e.target.value) }))}
                           disabled={!isEditing}
                           placeholder="Credit limit"
                           className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                         />
                       </div>
                     </div>
                   </div>
                 )}

                 {/* Property & Access Details */}
                 <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                   <Typography variant="h6" className="text-purple-900 flex items-center gap-1 text-sm font-semibold border-b border-gray-200 pb-2">
                     <MapPin className="w-3 h-3" />
                     Property & Access Details
                   </Typography>
                   
                   <div className="grid grid-cols-2 gap-2">
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Property Type</label>
                       <select
                         value={panelData.propertyType}
                         onChange={(e) => setPanelData(prev => ({ ...prev, propertyType: e.target.value as 'residential' | 'commercial' | 'industrial' }))}
                         disabled={!isEditing}
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       >
                         <option value="residential">Residential</option>
                         <option value="commercial">Commercial</option>
                         <option value="industrial">Industrial</option>
                       </select>
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Property Size</label>
                       <input
                         type="text"
                         value={panelData.propertySize}
                         onChange={(e) => setPanelData(prev => ({ ...prev, propertySize: e.target.value }))}
                         disabled={!isEditing}
                         placeholder="e.g., 2,500 sq ft"
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Access Codes</label>
                       <input
                         type="text"
                         value={panelData.accessCodes}
                         onChange={(e) => setPanelData(prev => ({ ...prev, accessCodes: e.target.value }))}
                         disabled={!isEditing}
                         placeholder="Building access codes"
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Gate Codes</label>
                       <input
                         type="text"
                         value={panelData.gateCodes}
                         onChange={(e) => setPanelData(prev => ({ ...prev, gateCodes: e.target.value }))}
                         disabled={!isEditing}
                         placeholder="Gate entry codes"
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Key Locations</label>
                       <input
                         type="text"
                         value={panelData.keyLocations}
                         onChange={(e) => setPanelData(prev => ({ ...prev, keyLocations: e.target.value }))}
                         disabled={!isEditing}
                         placeholder="Where keys are located"
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Special Instructions</label>
                       <input
                         type="text"
                         value={panelData.specialInstructions}
                         onChange={(e) => setPanelData(prev => ({ ...prev, specialInstructions: e.target.value }))}
                         disabled={!isEditing}
                         placeholder="Special access instructions"
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       />
                     </div>
                   </div>
                 </div>

                 {/* Communication Preferences */}
                 <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                   <Typography variant="h6" className="text-purple-900 flex items-center gap-1 text-sm font-semibold border-b border-gray-200 pb-2">
                     <MessageSquare className="w-3 h-3" />
                     Communication Preferences
                   </Typography>
                   
                   <div className="grid grid-cols-2 gap-2">
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Preferred Language</label>
                       <select
                         value={panelData.preferredLanguage}
                         onChange={(e) => setPanelData(prev => ({ ...prev, preferredLanguage: e.target.value }))}
                         disabled={!isEditing}
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       >
                         <option value="English">English</option>
                         <option value="Spanish">Spanish</option>
                         <option value="French">French</option>
                         <option value="German">German</option>
                       </select>
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Time Zone</label>
                       <select
                         value={panelData.timeZone}
                         onChange={(e) => setPanelData(prev => ({ ...prev, timeZone: e.target.value }))}
                         disabled={!isEditing}
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       >
                         <option value="UTC">UTC</option>
                         <option value="EST">Eastern Time</option>
                         <option value="CST">Central Time</option>
                         <option value="MST">Mountain Time</option>
                         <option value="PST">Pacific Time</option>
                       </select>
                     </div>
                   </div>
                   
                   <div className="space-y-2">
                     <label className="text-xs font-medium text-gray-600">Communication Methods</label>
                     <div className="grid grid-cols-2 gap-2">
                       <label className="flex items-center gap-2 text-xs">
                         <input
                           type="checkbox"
                           checked={panelData.communicationPreferences.email}
                           onChange={(e) => setPanelData(prev => ({ 
                             ...prev, 
                             communicationPreferences: { ...prev.communicationPreferences, email: e.target.checked }
                           }))}
                           disabled={!isEditing}
                           className="text-purple-600 focus:ring-purple-500 w-3 h-3 accent-purple-600 checked:bg-purple-600 checked:border-purple-600 border-purple-300 bg-white"
                         />
                         <span>Email</span>
                       </label>
                       <label className="flex items-center gap-2 text-xs">
                         <input
                           type="checkbox"
                           checked={panelData.communicationPreferences.phone}
                           onChange={(e) => setPanelData(prev => ({ 
                             ...prev, 
                             communicationPreferences: { ...prev.communicationPreferences, phone: e.target.checked }
                           }))}
                           disabled={!isEditing}
                           className="text-purple-600 focus:ring-purple-500 w-3 h-3 accent-purple-600 checked:bg-purple-600 checked:border-purple-600 border-purple-300 bg-white"
                         />
                         <span>Phone</span>
                       </label>
                       <label className="flex items-center gap-2 text-xs">
                         <input
                           type="checkbox"
                           checked={panelData.communicationPreferences.text}
                           onChange={(e) => setPanelData(prev => ({ 
                             ...prev, 
                             communicationPreferences: { ...prev.communicationPreferences, text: e.target.checked }
                           }))}
                           disabled={!isEditing}
                           className="text-purple-600 focus:ring-purple-500 w-3 h-3 accent-purple-600 checked:bg-purple-600 checked:border-purple-600 border-purple-300 bg-white"
                         />
                         <span>Text</span>
                       </label>
                       <label className="flex items-center gap-2 text-xs">
                         <input
                           type="checkbox"
                           checked={panelData.communicationPreferences.mail}
                           onChange={(e) => setPanelData(prev => ({ 
                             ...prev, 
                             communicationPreferences: { ...prev.communicationPreferences, mail: e.target.checked }
                           }))}
                           disabled={!isEditing}
                           className="text-purple-600 focus:ring-purple-500 w-3 h-3 accent-purple-600 checked:bg-purple-600 checked:border-purple-600 border-purple-300 bg-white"
                         />
                         <span>Mail</span>
                       </label>
                     </div>
                   </div>
                 </div>

                 {/* Contract & Agreement Details */}
                 <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                   <Typography variant="h6" className="text-purple-900 flex items-center gap-1 text-sm font-semibold border-b border-gray-200 pb-2">
                     <FileText className="w-3 h-3" />
                     Contract & Agreement Details
                   </Typography>
                   
                   <div className="grid grid-cols-2 gap-2">
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Contract Type</label>
                       <select
                         value={panelData.contractType}
                         onChange={(e) => setPanelData(prev => ({ ...prev, contractType: e.target.value as 'monthly' | 'quarterly' | 'annual' | 'one-time' }))}
                         disabled={!isEditing}
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       >
                         <option value="monthly">Monthly</option>
                         <option value="quarterly">Quarterly</option>
                         <option value="annual">Annual</option>
                         <option value="one-time">One-time</option>
                       </select>
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Contract Value</label>
                       <input
                         type="number"
                         value={panelData.contractValue}
                         onChange={(e) => setPanelData(prev => ({ ...prev, contractValue: Number(e.target.value) }))}
                         disabled={!isEditing}
                         placeholder="Contract value"
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Start Date</label>
                       <input
                         type="date"
                         value={panelData.contractStartDate}
                         onChange={(e) => setPanelData(prev => ({ ...prev, contractStartDate: e.target.value }))}
                         disabled={!isEditing}
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">End Date</label>
                       <input
                         type="date"
                         value={panelData.contractEndDate}
                         onChange={(e) => setPanelData(prev => ({ ...prev, contractEndDate: e.target.value }))}
                         disabled={!isEditing}
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Payment Terms (days)</label>
                       <input
                         type="number"
                         value={panelData.paymentTerms}
                         onChange={(e) => setPanelData(prev => ({ ...prev, paymentTerms: Number(e.target.value) }))}
                         disabled={!isEditing}
                         placeholder="Payment terms"
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       />
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Late Fee %</label>
                       <input
                         type="number"
                         step="0.1"
                         value={panelData.lateFeePercentage}
                         onChange={(e) => setPanelData(prev => ({ ...prev, lateFeePercentage: Number(e.target.value) }))}
                         disabled={!isEditing}
                         placeholder="Late fee percentage"
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       />
                     </div>
                   </div>
                   
                   <div className="space-y-2">
                     <label className="flex items-center gap-2 text-xs">
                       <input
                         type="checkbox"
                         checked={panelData.autoRenew}
                         onChange={(e) => setPanelData(prev => ({ ...prev, autoRenew: e.target.checked }))}
                         disabled={!isEditing}
                         className="text-purple-600 focus:ring-purple-500 w-3 h-3 accent-purple-600 checked:bg-purple-600 checked:border-purple-600 border-purple-300 bg-white"
                       />
                       <span>Auto-renew contract</span>
                     </label>
                   </div>
                 </div>

                 {/* Status Management */}
                 <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                   <Typography variant="h6" className="text-purple-900 flex items-center gap-1 text-sm font-semibold border-b border-gray-200 pb-2">
                     <Settings className="w-3 h-3" />
                     Status Management
                   </Typography>
                   
                   <div className="grid grid-cols-3 gap-2">
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Account Status</label>
                       <select
                         value={panelData.accountStatus}
                         onChange={(e) => setPanelData(prev => ({ ...prev, accountStatus: e.target.value as 'active' | 'on_hold' | 'canceled' | 'past_due' | 'suspended' }))}
                         disabled={!isEditing}
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       >
                         <option value="active">Active</option>
                         <option value="on_hold">On Hold</option>
                         <option value="canceled">Canceled</option>
                         <option value="past_due">Past Due</option>
                         <option value="suspended">Suspended</option>
                       </select>
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Payment Status</label>
                       <select
                         value={panelData.paymentStatus}
                         onChange={(e) => setPanelData(prev => ({ ...prev, paymentStatus: e.target.value as 'current' | 'past_due' | 'overdue' | 'paid' }))}
                         disabled={!isEditing}
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       >
                         <option value="current">Current</option>
                         <option value="past_due">Past Due</option>
                         <option value="overdue">Overdue</option>
                         <option value="paid">Paid</option>
                       </select>
                     </div>
                     <div className="space-y-1">
                       <label className="text-xs font-medium text-gray-600">Service Status</label>
                       <select
                         value={panelData.serviceStatus}
                         onChange={(e) => setPanelData(prev => ({ ...prev, serviceStatus: e.target.value as 'scheduled' | 'in_progress' | 'completed' | 'cancelled' }))}
                         disabled={!isEditing}
                         className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                       >
                         <option value="scheduled">Scheduled</option>
                         <option value="in_progress">In Progress</option>
                         <option value="completed">Completed</option>
                         <option value="cancelled">Cancelled</option>
                       </select>
                     </div>
                   </div>
                 </div>

                 {/* Auto-fill Options */}
                 <div className="space-y-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                   <Typography variant="h6" className="text-purple-900 flex items-center gap-1 text-sm font-semibold border-b border-gray-200 pb-2">
                     <Settings className="w-3 h-3" />
                     Auto-fill Options
                   </Typography>
                   
                   <div className="space-y-2">
                     <label className="flex items-center gap-2 text-xs">
                       <input
                         type="checkbox"
                         checked={panelData.autoFillServiceAddress}
                         onChange={(e) => setPanelData(prev => ({ ...prev, autoFillServiceAddress: e.target.checked }))}
                         disabled={!isEditing}
                         className="text-purple-600 focus:ring-purple-500 w-3 h-3 accent-purple-600 checked:bg-purple-600 checked:border-purple-600 border-purple-300 bg-white"
                       />
                       <span>Auto-fill service address from billing address</span>
                     </label>
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
