import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LayoutWrapper from '@/components/LayoutWrapper';
import './CompactLayout.css';
import CustomerListView from './CustomerListView';
import {
  Typography,
  Button,
  Card,
  Input,
  Alert,
  Chip
} from '@/components/ui/EnhancedUI';
import {
  Users,
  Search,
  Plus,
  MapPin,
  Building,
  RefreshCw,
  UserPlus,
  Eye,
  Edit,
  Phone,
  DollarSign,
  Calendar,
  Filter,
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmApi } from '@/lib/api';

// Mock service history data for demonstration
// This will be replaced with real API data in Phase 2
const mockServiceHistory: Record<string, any[]> = {
  // Generate service history for any customer ID
  'default': [
    { id: '1', date: '2025-01-15', service: 'Monthly Pest Control', technician: 'John Smith', status: 'completed', notes: 'Routine monthly service completed. No issues found.' },
    { id: '2', date: '2025-02-15', service: 'Emergency Service', technician: 'Mike Johnson', status: 'completed', notes: 'Responded to ant infestation in break room. Applied treatment.' },
    { id: '3', date: '2025-03-15', service: 'Quarterly Inspection', technician: 'Sarah Wilson', status: 'scheduled', notes: 'Upcoming quarterly inspection scheduled.' }
  ]
};



export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    account_type: 'commercial',
    property_type: '',
    property_size: '',
    access_instructions: '',
    emergency_contact: '',
    preferred_contact_method: 'email'
  });

  const queryClient = useQueryClient();

  // Fetch customers from API
  const { data: customers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['customers'],
    queryFn: () => crmApi.accounts(),
  });

  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: (data: any) => crmApi.updateAccount(data.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setShowForm(false);
      setSelectedCustomer(null);
    },
    onError: (error) => {
      console.error('Failed to update customer:', error);
      alert('Failed to update customer. Please try again.');
    }
  });

  const handleAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      account_type: 'commercial',
      property_type: '',
      property_size: '',
      access_instructions: '',
      emergency_contact: '',
      preferred_contact_method: 'email'
    });
    setShowForm(true);
    setSelectedCustomer(null);
  };

  const handleEdit = (customer: any) => {
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      zip_code: customer.zip_code || '',
      account_type: customer.account_type || 'commercial',
      property_type: customer.property_type || '',
      property_size: customer.property_size || '',
      access_instructions: customer.access_instructions || '',
      emergency_contact: customer.emergency_contact || '',
      preferred_contact_method: customer.preferred_contact_method || 'email'
    });
    setShowForm(true);
    setSelectedCustomer(customer);
  };

  const handleSave = () => {
    if (selectedCustomer) {
      // Update existing customer
      updateCustomerMutation.mutate({
        id: selectedCustomer.id,
        ...formData
      });
    } else {
      // Create new customer (would need createAccount mutation)
      alert('Create customer functionality will be implemented in Phase 2');
      setShowForm(false);
    }
  };

  const handleViewHistory = (customer: any) => {
    setSelectedCustomer(customer);
    setShowHistory(true);
  };

  // Filter customers based on search and type
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || customer.account_type === filterType;
    return matchesSearch && matchesType;
  });

  // Get service history for a customer
  const getServiceHistory = (customerId: string) => {
    return mockServiceHistory[customerId] || mockServiceHistory['default'] || [];
  };

  if (isLoading) {
    return (
      <LayoutWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <Typography variant="body1" className="text-gray-600">
                Loading customers...
              </Typography>
            </div>
          </div>
        </div>
      </LayoutWrapper>
    );
  }

  if (error) {
    return (
      <LayoutWrapper>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
            <Typography variant="body1">
              Failed to load customers. Please try again.
            </Typography>
            <Button variant="outline" onClick={() => refetch()} className="mt-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </Alert>
        </div>
      </LayoutWrapper>
    );
  }

  return (
    <LayoutWrapper>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h1" className="text-gray-900">
                Customers
              </Typography>
              <Typography variant="body1" className="text-gray-600 mt-1">
                Manage customer accounts and locations for pest control services.
              </Typography>
            </div>
          </div>
        </div>

        {/* Add Customer Button */}
        <div className="mb-4">
          <Button
            variant="primary"
            onClick={handleAdd}
            className="flex items-center gap-2 h-10 px-4 text-sm"
          >
            <UserPlus className="h-4 w-4" />
            Add New Customer
          </Button>
        </div>

        {/* Customers List */}
        <div className="mb-6">
          {filteredCustomers.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <Typography variant="h6" className="text-gray-900 mb-2">
                No Customers Found
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {searchTerm || filterType !== 'all' ? 'No customers match your search criteria.' : 'No customers have been added yet.'}
              </Typography>
            </Card>
          ) : (
            // List View with Tabbed Navigation
            <CustomerListView
              customers={filteredCustomers}
              onViewHistory={handleViewHistory}
              onEdit={handleEdit}
              onViewDetails={(customer) => {
                // For now, just show the edit form
                handleEdit(customer);
              }}
              onSelectionChange={setSelectedCustomers}
            />
          )}
        </div>

        {/* Map Integration - Only show when customers are selected */}
        {selectedCustomers.size > 0 && (
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-blue-500" />
              <Typography variant="h6" className="text-gray-900">
                Selected Customer Locations ({selectedCustomers.size})
              </Typography>
            </div>
            <MapContainer 
              center={[40.4406, -79.9959]} 
              zoom={10} 
              style={{ height: '500px', width: '100%' }}
              className="rounded-lg"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {customers
                .filter((customer: any) => selectedCustomers.has(customer.id))
                .map((customer:any) => {
                  // Use approximate coordinates based on city
                  const coordinates = {
                    'Pittsburgh': [40.4406, -79.9959],
                    'Monroeville': [40.4321, -79.7889],
                    'Cranberry Twp': [40.6847, -80.1072],
                    'Greensburg': [40.3015, -79.5389],
                    'Butler': [40.8612, -79.8953],
                    'Washington': [40.1734, -80.2462],
                    'Beaver': [40.6953, -80.3109]
                  };
                  const coords = coordinates[customer.city as keyof typeof coordinates] || [40.4406, -79.9959];
                  return (
                    <Marker key={customer.id} position={coords}>
                      <Popup>
                        <div>
                          <h3 className="font-semibold">{customer.name}</h3>
                          <p className="text-sm text-gray-600">{customer.address}, {customer.city}, {customer.state}</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
            </MapContainer>
          </Card>
        )}

        {/* Edit Customer Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Typography variant="h6">
                    {selectedCustomer ? 'Edit' : 'Add'} Customer
                  </Typography>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowForm(false)}
                    className="p-1"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter customer name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                    <select
                      value={formData.account_type}
                      onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="commercial">Commercial</option>
                      <option value="residential">Residential</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter street address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter city"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter state"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={formData.zip_code}
                      onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter ZIP code"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                    <input
                      type="text"
                      value={formData.property_type}
                      onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., office, warehouse, home"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Property Size</label>
                    <input
                      type="text"
                      value={formData.property_size}
                      onChange={(e) => setFormData({ ...formData, property_size: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 5000 sq ft"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Access Instructions</label>
                    <textarea
                      value={formData.access_instructions}
                      onChange={(e) => setFormData({ ...formData, access_instructions: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Enter access instructions for technicians"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                    <input
                      type="text"
                      value={formData.emergency_contact}
                      onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Emergency contact information"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact Method</label>
                    <select
                      value={formData.preferred_contact_method}
                      onChange={(e) => setFormData({ ...formData, preferred_contact_method: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="text">Text</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button 
                    variant="primary" 
                    onClick={handleSave}
                    disabled={updateCustomerMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {updateCustomerMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Customer'
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* View History Modal */}
        {showHistory && selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Typography variant="h6" className="mb-2">
                      Service History
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      {selectedCustomer.name} - {selectedCustomer.city}, {selectedCustomer.state}
                    </Typography>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHistory(false)}
                    className="p-1"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {getServiceHistory(selectedCustomer.id).length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <Typography variant="h6" className="text-gray-900 mb-2">
                        No Service History
                      </Typography>
                      <Typography variant="body2" className="text-gray-600">
                        No service records found for this customer.
                      </Typography>
                    </div>
                  ) : (
                    getServiceHistory(selectedCustomer.id).map((service) => (
                      <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {service.status === 'completed' ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : service.status === 'scheduled' ? (
                              <Clock className="h-5 w-5 text-blue-500" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            )}
                            <div>
                              <Typography variant="h6" className="text-gray-900">
                                {service.service}
                              </Typography>
                              <Typography variant="body2" className="text-gray-600">
                                {new Date(service.date).toLocaleDateString()} • {service.technician}
                              </Typography>
                            </div>
                          </div>
                          <Chip
                            variant={service.status === 'completed' ? 'success' : service.status === 'scheduled' ? 'primary' : 'warning'}
                          >
                            {service.status}
                          </Chip>
                        </div>
                        {service.notes && (
                          <Typography variant="body2" className="text-gray-700 bg-gray-50 p-3 rounded">
                            {service.notes}
                          </Typography>
                        )}
                      </div>
                    ))
                  )}
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" onClick={() => setShowHistory(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
}
