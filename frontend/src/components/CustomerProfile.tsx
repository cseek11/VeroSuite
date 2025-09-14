import React, { useState, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Typography,
  Button,
  Card,
  Input,
  Chip,
  Checkbox,
  Textarea
} from '@/components/ui/EnhancedUI';
import {
  X,
  Camera,
  Upload,
  Trash2,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Download,
  Send,
  Plus,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Tag,
  CreditCard,
  FileImage,
  Users,
  Building,
  PhoneCall,
  Mail as MailIcon,
  MessageCircle,
  History,
  Settings,
  Shield,
  FileCheck,
  FileX,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Share2,
  Archive,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';
import { Account, CustomerProfile as CustomerProfileType, CustomerContact, ServiceHistory, CustomerNote } from '@/types/enhanced-types';

interface CustomerProfileProps {
  customer: Account;
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerProfile({
  customer,
  isOpen,
  onClose
}: CustomerProfileProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(customer);
  const queryClient = useQueryClient();

  // Fetch customer profile data
  const { data: customerProfile } = useQuery({
    queryKey: ['customer-profile', customer.id],
    queryFn: () => enhancedApi.customers.getById(customer.id),
    enabled: !!customer.id,
  });

  // Fetch customer contacts
  const { data: customerContacts = [] } = useQuery({
    queryKey: ['customer-contacts', customer.id],
    queryFn: () => enhancedApi.contacts.getByCustomer(customer.id),
    enabled: !!customer.id,
  });

  // Fetch service history using enhanced API
  const { data: serviceHistory = [] } = useQuery({
    queryKey: ['service-history', customer.id],
    queryFn: () => enhancedApi.serviceHistory.getByCustomer(customer.id),
    enabled: !!customer.id,
  });

  // Fetch customer notes using enhanced API
  const { data: notes = [] } = useQuery({
    queryKey: ['customer-notes', customer.id],
    queryFn: () => enhancedApi.customerNotes.getByCustomer(customer.id),
    enabled: !!customer.id,
  });

  // Update customer mutation
  const updateCustomer = useMutation({
    mutationFn: (data: Partial<Account>) => enhancedApi.customers.update(customer.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-customer', customer.id] });
      setIsEditing(false);
    },
  });

  const handleSave = () => {
    updateCustomer.mutate(editedCustomer);
  };

  const handleCancel = () => {
    setEditedCustomer(customer);
    setIsEditing(false);
  };

  // Get customer coordinates for map
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'services', label: 'Services', icon: Shield },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'documents', label: 'Documents', icon: FileImage },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <Typography variant="h3" className="text-gray-900">
              {customer.name}
            </Typography>
            <Typography variant="body2" className="text-gray-600 mt-1">
              Customer Profile • {customer.account_type} • {customer.status}
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={updateCustomer.isPending}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Basic Information */}
                <Card className="p-6">
                  <Typography variant="h5" className="text-gray-900 mb-4">
                    Basic Information
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedCustomer.name}
                            onChange={(value) => setEditedCustomer(prev => ({ ...prev, name: value }))}
                            placeholder="Customer name"
                          />
                        ) : (
                          <p className="text-gray-900">{customer.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedCustomer.email || ''}
                            onChange={(value) => setEditedCustomer(prev => ({ ...prev, email: value }))}
                            placeholder="Email address"
                          />
                        ) : (
                          <p className="text-gray-900">{customer.email || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        {isEditing ? (
                          <Input
                            value={editedCustomer.phone || ''}
                            onChange={(value) => setEditedCustomer(prev => ({ ...prev, phone: value }))}
                            placeholder="Phone number"
                          />
                        ) : (
                          <p className="text-gray-900">{customer.phone || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address
                        </label>
                        <p className="text-gray-900">
                          {customer.address ? `${customer.address}, ${customer.city}, ${customer.state} ${customer.zip_code}` : 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Account Type
                        </label>
                        <Chip variant="outline" className="capitalize">
                          {customer.account_type}
                        </Chip>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <Chip 
                          variant="outline" 
                          className={`capitalize ${
                            customer.status === 'active' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {customer.status}
                        </Chip>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Map */}
                <Card className="p-6">
                  <Typography variant="h5" className="text-gray-900 mb-4">
                    Location
                  </Typography>
                  <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                    <MapContainer
                      center={getCustomerCoordinates(customer)}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer 
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={getCustomerCoordinates(customer)}>
                        <Popup>
                          <div className="p-2">
                            <Typography variant="h6" className="text-gray-900 mb-1">
                              {customer.name}
                            </Typography>
                            <div className="text-sm text-gray-600">
                              <div>{customer.city}, {customer.state}</div>
                              <div>{customer.email}</div>
                              <div>{customer.phone}</div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6">
                    <div className="flex items-center gap-3">
                      <Shield className="w-8 h-8 text-blue-600" />
                      <div>
                        <Typography variant="h4" className="text-gray-900">
                          {serviceHistory.length}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          Total Services
                        </Typography>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-green-600" />
                      <div>
                        <Typography variant="h4" className="text-gray-900">
                          {notes.length}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          Notes
                        </Typography>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-purple-600" />
                      <div>
                        <Typography variant="h4" className="text-gray-900">
                          ${customer.ar_balance.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                          Outstanding Balance
                        </Typography>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Typography variant="h5" className="text-gray-900">
                    Service History
                  </Typography>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule Service
                  </Button>
                </div>
                
                {serviceHistory.length > 0 ? (
                  <div className="space-y-4">
                    {serviceHistory.map((service) => (
                      <Card key={service.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Typography variant="h6" className="text-gray-900">
                            {service.service_type || 'Service'}
                          </Typography>
                          <Chip 
                            variant="outline" 
                            className={`capitalize ${
                              service.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                            }`}
                          >
                            {service.status}
                          </Chip>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Date:</span> {new Date(service.service_date).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Technician:</span> {service.technician_id || 'Not assigned'}
                          </div>
                        </div>
                        {service.technician_notes && (
                          <p className="text-gray-700 mt-2">{service.technician_notes}</p>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <Typography variant="h6" className="text-gray-900 mb-2">
                      No Service History
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      No services have been scheduled for this customer yet.
                    </Typography>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Typography variant="h5" className="text-gray-900">
                    Notes
                  </Typography>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </div>
                
                {notes.length > 0 ? (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <Card key={note.id} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Typography variant="h6" className="text-gray-900">
                            {note.note_type || 'Note'}
                          </Typography>
                          <Typography variant="body2" className="text-gray-500">
                            {new Date(note.created_at).toLocaleDateString()}
                          </Typography>
                        </div>
                        <p className="text-gray-700">{note.note_content}</p>
                        {note.created_by && (
                          <p className="text-sm text-gray-500 mt-2">By: {note.created_by}</p>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <Typography variant="h6" className="text-gray-900 mb-2">
                      No Notes
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                      No notes have been added for this customer yet.
                    </Typography>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'communications' && (
              <div className="space-y-6">
                <Typography variant="h5" className="text-gray-900">
                  Communications
                </Typography>
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <Typography variant="h6" className="text-gray-900 mb-2">
                    Communication History
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Communication history will be available here.
                  </Typography>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <Typography variant="h5" className="text-gray-900">
                  Documents
                </Typography>
                <div className="text-center py-8">
                  <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <Typography variant="h6" className="text-gray-900 mb-2">
                    Documents
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Customer documents will be available here.
                  </Typography>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <Typography variant="h5" className="text-gray-900">
                  Billing Information
                </Typography>
                <Card className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Outstanding Balance
                      </label>
                      <Typography variant="h4" className="text-gray-900">
                        ${customer.ar_balance.toFixed(2)}
                      </Typography>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method
                      </label>
                      <p className="text-gray-900">{customer.payment_method || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Billing Cycle
                      </label>
                      <p className="text-gray-900">{customer.billing_cycle || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Contact
                      </label>
                      <p className="text-gray-900">{customer.emergency_contact || 'Not provided'}</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
