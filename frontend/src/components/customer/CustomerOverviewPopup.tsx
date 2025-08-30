import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Building, Phone, Mail, Calendar, DollarSign, Tag, Clock, TrendingUp, AlertCircle, Loader2, Edit, Check, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/api';
import {
  Typography,
  Button,
  Card,
  Input,
  Chip,
  Badge,
  Separator
} from '@/components/ui';


interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  account_type: 'commercial' | 'residential';
  ar_balance: number;
  address?: string;
  zip_code?: string;
  company_name?: string;
  contact_person?: string;
  notes?: string;
  status: 'active' | 'prospect' | 'inactive';
  property_type?: string;
  property_size?: string;
  access_instructions?: string;
  emergency_contact?: string;
  preferred_contact_method?: string;
  billing_address?: any;
  payment_method?: string;
  billing_cycle?: string;
  created_at?: string;
  updated_at?: string;
  locations?: any[];
  workOrders?: any[];
  serviceHistory?: any[];
  contracts?: any[];
}

interface CustomerOverviewPopupProps {
  customerId: string;
}

const CustomerOverviewPopup: React.FC<CustomerOverviewPopupProps> = ({
  customerId
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);
  const [newTag, setNewTag] = useState('');
  const [customerTags, setCustomerTags] = useState<string[]>(['VIP', 'Quarterly Service', 'High Priority']);

  // Fetch customer data
  const { data: customer, isLoading, error } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('id', customerId)
        .single();

      if (error) throw error;
      return data as Customer;
    },
    enabled: !!customerId
  });

  // Initialize edited customer when data loads
  React.useEffect(() => {
    if (customer && !editedCustomer) {
      setEditedCustomer(customer);
    }
  }, [customer, editedCustomer]);

  // Analytics calculations
  const analytics = useMemo(() => {
    if (!customer) return {
      totalServices: 0,
      totalSpend: 0,
      lastServiceDate: null,
      averageServiceCost: 0,
      servicesThisYear: 0,
      activeContracts: 0,
      totalContractValue: 0,
      daysSinceLastService: null
    };

    const completedServices = customer.serviceHistory?.filter(s => s.status === 'completed') || [];
    const totalSpend = completedServices.reduce((sum, service) => sum + (service.cost || 0), 0);
    const lastService = completedServices.sort((a, b) => 
      new Date(b.service_date).getTime() - new Date(a.service_date).getTime()
    )[0];

    const currentYear = new Date().getFullYear();
    const servicesThisYear = completedServices.filter(s => 
      new Date(s.service_date).getFullYear() === currentYear
    ).length;

    const activeContracts = customer.contracts?.filter(c => c.status === 'active').length || 0;
    const totalContractValue = customer.contracts?.reduce((sum, contract) => sum + (contract.value || 0), 0) || 0;

    return {
      totalServices: completedServices.length,
      totalSpend,
      lastServiceDate: lastService?.service_date || null,
      averageServiceCost: completedServices.length > 0 ? totalSpend / completedServices.length : 0,
      servicesThisYear,
      activeContracts,
      totalContractValue,
      daysSinceLastService: lastService ? Math.floor((Date.now() - new Date(lastService.service_date).getTime()) / (1000 * 60 * 60 * 24)) : null
    };
  }, [customer]);

  // Get customer coordinates for map
  const getCustomerCoordinates = () => {
    // Default coordinates (you can replace with actual geocoding)
    return [40.7128, -74.0060] as [number, number];
  };

  const handleSave = async () => {
    if (!editedCustomer) return;
    
    try {
      const { error } = await supabase
        .from('accounts')
        .update(editedCustomer)
        .eq('id', customerId);

      if (error) throw error;
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const handleCancel = () => {
    if (customer) {
      setEditedCustomer(customer);
    }
    setIsEditing(false);
  };

  const addTag = () => {
    if (newTag.trim() && !customerTags.includes(newTag.trim())) {
      setCustomerTags([...customerTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCustomerTags(customerTags.filter(tag => tag !== tagToRemove));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
          <span className="text-gray-600">Loading customer information...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Customer</h3>
          <p className="text-gray-600">Unable to load customer information. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overview-grid">
      {/* Main Content */}
      <div className="overview-main">
        {/* Customer Information */}
        <Card className="info-card bg-blue-100/70 hover:bg-blue-100/90 transition-all duration-200">
          <div className="info-card-header">
            <Typography variant="h6" className="info-card-title">
              Customer Information
            </Typography>
            <div className="flex gap-1">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-1 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-xs"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 py-1 rounded-md hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 hover:border-gray-400 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="info-grid">
            <div className="info-field">
              <label className="info-label">Name</label>
              {isEditing ? (
                <Input
                  value={editedCustomer?.name || ''}
                  onChange={(value) => setEditedCustomer(editedCustomer ? {...editedCustomer, name: value} : null)}
                />
              ) : (
                <div className="info-value">{customer.name}</div>
              )}
            </div>
            
            <div className="info-field">
              <label className="info-label">Email</label>
              {isEditing ? (
                <Input
                  value={editedCustomer?.email || ''}
                  onChange={(value) => setEditedCustomer(editedCustomer ? {...editedCustomer, email: value} : null)}
                />
              ) : (
                <div className="info-value">{customer.email}</div>
              )}
            </div>
            
            <div className="info-field">
              <label className="info-label">Phone</label>
              {isEditing ? (
                <Input
                  value={editedCustomer?.phone || ''}
                  onChange={(value) => setEditedCustomer(editedCustomer ? {...editedCustomer, phone: value} : null)}
                />
              ) : (
                <div className="info-value">{customer.phone}</div>
              )}
            </div>
            
            <div className="info-field">
              <label className="info-label">Address</label>
              {isEditing ? (
                <Input
                  value={editedCustomer?.address || ''}
                  onChange={(value) => setEditedCustomer(editedCustomer ? {...editedCustomer, address: value} : null)}
                />
              ) : (
                <div className="info-value">{customer.address || 'Not provided'}</div>
              )}
            </div>
            
            <div className="info-field">
              <label className="info-label">City</label>
              {isEditing ? (
                <Input
                  value={editedCustomer?.city || ''}
                  onChange={(value) => setEditedCustomer(editedCustomer ? {...editedCustomer, city: value} : null)}
                />
              ) : (
                <div className="info-value">{customer.city}</div>
              )}
            </div>
            
            <div className="info-field">
              <label className="info-label">State</label>
              {isEditing ? (
                <Input
                  value={editedCustomer?.state || ''}
                  onChange={(value) => setEditedCustomer(editedCustomer ? {...editedCustomer, state: value} : null)}
                />
              ) : (
                <div className="info-value">{customer.state}</div>
              )}
            </div>
          </div>
        </Card>

        {/* Map */}
        <Card className="info-card bg-white hover:bg-gray-50/50 transition-all duration-200">
          <div className="map-container" style={{ height: '400px', width: '100%' }}>
            <MapContainer
              center={getCustomerCoordinates()}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={getCustomerCoordinates()}>
                <Popup>
                  <div>
                    <strong>{customer.name}</strong><br />
                    {customer.address}<br />
                    {customer.city}, {customer.state} {customer.zip_code}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </Card>

        {/* Service Locations */}
        {customer.locations && customer.locations.length > 0 && (
          <Card className="info-card bg-red-100/70 hover:bg-red-100/90 transition-all duration-200">
            <div className="info-card-header">
              <Typography variant="h6" className="info-card-title">
                Service Locations
              </Typography>
            </div>
            
            <div className="space-y-3">
              {customer.locations.map((location, index) => (
                <div key={location.id || index} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                  <div>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-gray-600">
                      {location.address_line1}, {location.city}, {location.state}
                    </div>
                  </div>
                  <Badge variant="outline">{location.service_area_id ? 'Service Area' : 'Primary'}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="overview-sidebar">
        {/* Quick Stats - Green background */}
        <Card className="info-card bg-green-100/70 hover:bg-green-100/90 transition-all duration-200">
          <div className="info-card-header">
            <Typography variant="h6" className="info-card-title">
              Quick Stats
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-white/70 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-600">Total Services</span>
              <span className="font-semibold text-gray-900">{analytics.totalServices}</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white/70 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-600">Total Spend</span>
              <span className="font-semibold text-gray-900">${analytics.totalSpend.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white/70 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-600">Active Contracts</span>
              <span className="font-semibold text-gray-900">{analytics.activeContracts}</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white/70 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-600">AR Balance</span>
              <span className={`font-semibold ${customer?.ar_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${customer?.ar_balance?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="info-card bg-orange-100/70 hover:bg-orange-100/90 transition-all duration-200">
          <div className="info-card-header">
            <Typography variant="h6" className="info-card-title">
              Recent Activity
            </Typography>
          </div>
          
          <div className="space-y-3">
            {analytics.lastServiceDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="font-medium text-sm">Last Service</div>
                  <div className="text-gray-600 text-sm">
                    {new Date(analytics.lastServiceDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <div>
                <div className="font-medium text-sm">This Year</div>
                <div className="text-gray-600 text-sm">{analytics.servicesThisYear}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tags */}
        <Card className="info-card bg-yellow-100/70 hover:bg-yellow-100/90 transition-all duration-200">
          <div className="info-card-header">
            <Typography variant="h6" className="info-card-title">
              Tags
            </Typography>
          </div>
          
          <div className="tags-container mb-3">
            {customerTags.map((tag, index) => (
              <Chip
                key={index}
                variant="outline"
                className="tag"
                onRemove={() => removeTag(tag)}
              >
                {tag}
              </Chip>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(value) => {
                setNewTag(value);
                if (value.endsWith('\n')) {
                  addTag();
                }
              }}
              className="flex-1"
            />
            <button
              onClick={addTag}
              className="px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 font-medium text-gray-700 hover:border-gray-400 text-sm"
            >
              Add
            </button>
          </div>
        </Card>

        {/* Property Information */}
        <Card className="info-card bg-amber-100/70 hover:bg-amber-100/90 transition-all duration-200">
          <div className="info-card-header">
            <Typography variant="h6" className="info-card-title">
              Property Info
            </Typography>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Type</span>
              <span className="font-medium text-sm">{customer?.property_type || 'Not specified'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Size</span>
              <span className="font-medium text-sm">{customer?.property_size || 'Not specified'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Account</span>
              <Badge variant={customer?.account_type === 'commercial' ? 'default' : 'outline'}>
                {customer?.account_type}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
      
    </div>
  );
};

export default CustomerOverviewPopup;
