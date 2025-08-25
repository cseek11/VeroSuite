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
import { supabase } from '@/lib/api';
import './CustomerProfile.css';

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
  created_at?: string;
  updated_at?: string;
}

interface CustomerProfileProps {
  customer: Customer;
  isOpen: boolean;
  onClose: () => void;
}

// Tab types for the profile navigation
type ProfileTabType = 'overview' | 'services' | 'notes' | 'billing' | 'agreements' | 'communications' | 'documents' | 'settings';

// Note types
type NoteType = 'internal' | 'technician';

// Service types
type ServiceType = 'pest_control' | 'termite_treatment' | 'inspection' | 'emergency' | 'maintenance' | 'follow_up';

// Agreement status
type AgreementStatus = 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled';

// Communication types
type CommunicationType = 'email' | 'sms' | 'phone' | 'in_person';

interface Note {
  id: string;
  customer_id: string;
  type: NoteType;
  content: string;
  author: string;
  created_at: string;
  tags?: string[];
}

interface Service {
  id: string;
  customer_id: string;
  service_type: ServiceType;
  scheduled_date: string;
  completed_date?: string;
  technician: string;
  outcome: string;
  notes?: string;
  photos?: string[];
  amount: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

interface Agreement {
  id: string;
  customer_id: string;
  agreement_type: string;
  status: AgreementStatus;
  sent_date?: string;
  signed_date?: string;
  expires_date?: string;
  amount: number;
  terms: string;
}

interface Communication {
  id: string;
  customer_id: string;
  type: CommunicationType;
  subject?: string;
  content: string;
  sent_by: string;
  sent_at: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

interface Document {
  id: string;
  customer_id: string;
  name: string;
  type: string;
  url: string;
  uploaded_at: string;
  uploaded_by: string;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({
  customer,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTabType>('overview');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [noteType, setNoteType] = useState<NoteType>('internal');
  const [newNote, setNewNote] = useState('');
  const [noteSearch, setNoteSearch] = useState('');
  const [noteFilter, setNoteFilter] = useState<NoteType | 'all'>('all');
  const [messageType, setMessageType] = useState<CommunicationType>('email');
  const [messageContent, setMessageContent] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [customerTags, setCustomerTags] = useState<string[]>(['VIP', 'Quarterly']);
  const [newTag, setNewTag] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', type: 'card', last4: '4242', brand: 'Visa', expiry: '12/25' },
    { id: '2', type: 'ach', account: '****1234', bank: 'Chase Bank' }
  ]);

  const queryClient = useQueryClient();

  // Mock data - replace with actual API calls
  const mockNotes: Note[] = [
    {
      id: '1',
      customer_id: customer.id,
      type: 'internal',
      content: 'Customer prefers morning appointments. Has a dog in the backyard.',
      author: 'John Smith',
      created_at: '2024-01-15T10:30:00Z',
      tags: ['preferences', 'pets']
    },
    {
      id: '2',
      customer_id: customer.id,
      type: 'technician',
      content: 'Completed quarterly pest control service. No issues found.',
      author: 'Mike Johnson',
      created_at: '2024-01-10T14:20:00Z',
      tags: ['service', 'quarterly']
    }
  ];

  const mockServices: Service[] = [
    {
      id: '1',
      customer_id: customer.id,
      service_type: 'pest_control',
      scheduled_date: '2024-01-15T09:00:00Z',
      completed_date: '2024-01-15T10:30:00Z',
      technician: 'Mike Johnson',
      outcome: 'Completed successfully',
      notes: 'Applied perimeter treatment and interior bait stations',
      amount: 150.00,
      status: 'completed'
    },
    {
      id: '2',
      customer_id: customer.id,
      service_type: 'inspection',
      scheduled_date: '2024-02-01T14:00:00Z',
      technician: 'Sarah Wilson',
      outcome: 'Scheduled for inspection',
      amount: 75.00,
      status: 'scheduled'
    }
  ];

  const mockAgreements: Agreement[] = [
    {
      id: '1',
      customer_id: customer.id,
      agreement_type: 'annual_pest_control',
      status: 'signed',
      sent_date: '2024-01-01T00:00:00Z',
      signed_date: '2024-01-05T00:00:00Z',
      expires_date: '2025-01-01T00:00:00Z',
      amount: 1200.00,
      terms: 'Annual pest control service agreement'
    }
  ];

  const mockCommunications: Communication[] = [
    {
      id: '1',
      customer_id: customer.id,
      type: 'email',
      subject: 'Service Reminder',
      content: 'Your quarterly pest control service is scheduled for next week.',
      sent_by: 'System',
      sent_at: '2024-01-08T09:00:00Z',
      status: 'read'
    }
  ];

  const mockDocuments: Document[] = [
    {
      id: '1',
      customer_id: customer.id,
      name: 'Inspection Report - Jan 2024',
      type: 'pdf',
      url: '/documents/inspection-report.pdf',
      uploaded_at: '2024-01-15T11:00:00Z',
      uploaded_by: 'Mike Johnson'
    }
  ];

  // Analytics calculations
  const analytics = useMemo(() => {
    const completedServices = mockServices.filter(s => s.status === 'completed');
    const totalSpend = completedServices.reduce((sum, service) => sum + service.amount, 0);
    const lastService = completedServices.sort((a, b) => 
      new Date(b.completed_date!).getTime() - new Date(a.completed_date!).getTime()
    )[0];

    return {
      totalServices: completedServices.length,
      totalSpend,
      lastServiceDate: lastService?.completed_date,
      averageServiceCost: completedServices.length > 0 ? totalSpend / completedServices.length : 0,
      servicesThisYear: completedServices.filter(s => 
        new Date(s.completed_date!).getFullYear() === new Date().getFullYear()
      ).length
    };
  }, [mockServices]);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    let filtered = mockNotes;
    
    if (noteFilter !== 'all') {
      filtered = filtered.filter(note => note.type === noteFilter);
    }
    
    if (noteSearch) {
      filtered = filtered.filter(note => 
        note.content.toLowerCase().includes(noteSearch.toLowerCase()) ||
        note.author.toLowerCase().includes(noteSearch.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [mockNotes, noteFilter, noteSearch]);

  // Tab configuration
  const tabs: { id: ProfileTabType; label: string; icon: React.ComponentType<any>; count?: number }[] = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'services', label: 'Services', icon: Calendar, count: mockServices.length },
    { id: 'notes', label: 'Notes', icon: FileText, count: mockNotes.length },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'agreements', label: 'Agreements', icon: FileCheck, count: mockAgreements.length },
    { id: 'communications', label: 'Communications', icon: MessageSquare, count: mockCommunications.length },
    { id: 'documents', label: 'Documents', icon: FileImage, count: mockDocuments.length },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Handle photo upload
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      // Here you would upload to Supabase storage
      console.log('Photo uploaded:', file);
    }
  };

  // Handle note submission
  const handleNoteSubmit = () => {
    if (newNote.trim()) {
      // Here you would save to database
      console.log('New note:', { type: noteType, content: newNote });
      setNewNote('');
    }
  };

  // Handle message sending
  const handleSendMessage = () => {
    if (messageContent.trim()) {
      // Here you would send message via API
      console.log('Sending message:', { type: messageType, content: messageContent, subject: messageSubject });
      setMessageContent('');
      setMessageSubject('');
    }
  };

  // Handle agreement sending
  const handleSendAgreement = (agreement: Agreement) => {
    // Here you would send agreement for signature
    console.log('Sending agreement:', agreement);
  };

  // Get customer coordinates for map
  const getCustomerCoordinates = (): [number, number] => {
    const coordinates: Record<string, [number, number]> = {
      'Pittsburgh': [40.4406, -79.9959],
      'Monroeville': [40.4321, -79.7889],
      'Cranberry Twp': [40.6847, -80.1072],
      'Greensburg': [40.3015, -79.5389],
      'Butler': [40.8612, -79.8953],
      'Washington': [40.1734, -80.2462],
      'Beaver': [40.6953, -80.3109]
    };
    return coordinates[customer.city] || [40.4406, -79.9959];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 customer-profile-overlay flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 profile-header">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
                {customer.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={() => setShowPhotoUpload(true)}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <Camera className="w-3 h-3 text-gray-600" />
              </button>
            </div>
            <div>
              <Typography variant="h4" className="text-gray-900">
                {customer.name}
              </Typography>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  {customer.account_type}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {customer.city}, {customer.state}
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  AR Balance: ${customer.ar_balance?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="profile-tabs">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap profile-tab
                    ${activeTab === tab.id ? 'active' : ''}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count && (
                    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <Typography variant="h6" className="text-gray-900 mb-4">
                    Customer Information
                  </Typography>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                         <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                               <Input
                          value={customer.name}
                          disabled={!isEditing}
                          className="w-full"
                        />
                     </div>
                                                               <div>
                        <label className="crm-label">Email</label>
                        <Input
                          value={customer.email}
                          disabled={!isEditing}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="crm-label">Phone</label>
                        <Input
                          value={customer.phone}
                          disabled={!isEditing}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="crm-label">Address</label>
                        <Input
                          value={customer.address || ''}
                          disabled={!isEditing}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="crm-label">City</label>
                        <Input
                          value={customer.city}
                          disabled={!isEditing}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="crm-label">State</label>
                        <Input
                          value={customer.state}
                          disabled={!isEditing}
                          className="w-full"
                        />
                      </div>
                  </div>
                </Card>

                {/* Analytics */}
                <Card className="p-6">
                  <Typography variant="h6" className="text-gray-900 mb-4">
                    Service Analytics
                  </Typography>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center analytics-card">
                      <div className="text-2xl font-bold text-purple-600 analytics-number">{analytics.totalServices}</div>
                      <div className="text-sm text-gray-600">Total Services</div>
                    </div>
                    <div className="text-center analytics-card">
                      <div className="text-2xl font-bold text-green-600 analytics-number">${analytics.totalSpend.toFixed(0)}</div>
                      <div className="text-sm text-gray-600">Total Spend</div>
                    </div>
                    <div className="text-center analytics-card">
                      <div className="text-2xl font-bold text-blue-600 analytics-number">${analytics.averageServiceCost.toFixed(0)}</div>
                      <div className="text-sm text-gray-600">Avg. Service</div>
                    </div>
                    <div className="text-center analytics-card">
                      <div className="text-2xl font-bold text-orange-600 analytics-number">{analytics.servicesThisYear}</div>
                      <div className="text-sm text-gray-600">This Year</div>
                    </div>
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6">
                  <Typography variant="h6" className="text-gray-900 mb-4">
                    Quick Actions
                  </Typography>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button className="quick-action-button">
                      <Calendar className="w-4 h-4" />
                      Schedule Service
                    </button>
                    <button className="quick-action-button">
                      <MessageSquare className="w-4 h-4" />
                      Send Message
                    </button>
                    <button className="quick-action-button">
                      <FileText className="w-4 h-4" />
                      Create Invoice
                    </button>
                    <button className="quick-action-button">
                      <FileCheck className="w-4 h-4" />
                      Send Agreement
                    </button>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Map */}
                <Card className="p-4">
                  <Typography variant="h6" className="text-gray-900 mb-3">
                    Location
                  </Typography>
                  <div className="h-48 map-container">
                    <MapContainer
                      center={getCustomerCoordinates()}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                      className="rounded-lg"
                    >
                      <TileLayer 
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={getCustomerCoordinates()}>
                        <Popup>
                          <div className="p-2">
                            <Typography variant="h6" className="text-gray-900 mb-1">
                              {customer.name}
                            </Typography>
                            <div className="text-sm text-gray-600">
                              <div>{customer.city}, {customer.state}</div>
                              <div>{customer.address}</div>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </Card>

                {/* Tags */}
                <Card className="p-4">
                  <Typography variant="h6" className="text-gray-900 mb-3">
                    Tags
                  </Typography>
                  <div className="tag-container mb-3">
                    {customerTags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {isEditing && (
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(value) => setNewTag(value)}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={() => {
                        if (newTag.trim()) {
                          setCustomerTags([...customerTags, newTag.trim()]);
                          setNewTag('');
                        }
                      }}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </Card>

                {/* Payment Methods */}
                <Card className="p-4">
                  <Typography variant="h6" className="text-gray-900 mb-3">
                    Payment Methods
                  </Typography>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between payment-method-card">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">
                            {method.type === 'card' 
                              ? `${method.brand} •••• ${method.last4}` 
                              : `${method.bank} •••• ${method.account}`
                            }
                          </span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Typography variant="h6" className="text-gray-900">
                  Service History
                </Typography>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Service
                </Button>
              </div>
              
              <div className="space-y-4">
                {mockServices.map((service) => (
                  <div key={service.id} className="service-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`status-indicator ${
                          service.status === 'completed' ? 'status-completed' :
                          service.status === 'scheduled' ? 'status-scheduled' :
                          service.status === 'in_progress' ? 'status-in-progress' :
                          'status-cancelled'
                        }`} />
                        <div>
                          <Typography variant="body1" className="font-medium">
                            {service.service_type.replace('_', ' ').toUpperCase()}
                          </Typography>
                          <div className="text-sm text-gray-600">
                            {new Date(service.scheduled_date).toLocaleDateString()} • {service.technician}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${service.amount.toFixed(2)}</div>
                        <Chip 
                          variant={service.status === 'completed' ? 'success' : 'outline'}
                          className="text-xs"
                        >
                          {service.status.replace('_', ' ')}
                        </Chip>
                      </div>
                    </div>
                    {service.notes && (
                      <div className="mt-3 text-sm text-gray-600">
                        {service.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Typography variant="h6" className="text-gray-900">
                  Notes & Communications
                </Typography>
                <div className="flex gap-2">
                  <select
                    value={noteFilter}
                    onChange={(e) => setNoteFilter(e.target.value as NoteType | 'all')}
                    className="crm-select"
                  >
                    <option value="all">All Notes</option>
                    <option value="internal">Internal</option>
                    <option value="technician">Technician</option>
                  </select>
                  <Input
                    placeholder="Search notes..."
                    value={noteSearch}
                    onChange={(value) => setNoteSearch(value)}
                    icon={Search}
                    className="w-64"
                  />
                </div>
              </div>

                             {/* Add Note */}
               <div className="note-card">
                <div className="flex gap-4 mb-4">
                                                          <select
                       value={noteType}
                       onChange={(e) => setNoteType(e.target.value as NoteType)}
                       className="crm-select"
                     >
                    <option value="internal">Internal Note</option>
                    <option value="technician">Technician Note</option>
                  </select>
                </div>
                                                    <Textarea
                     placeholder="Add a new note..."
                     value={newNote}
                     onChange={(value) => setNewNote(value)}
                     className="w-full mb-3"
                     rows={3}
                   />
                <div className="flex justify-end">
                  <Button onClick={handleNoteSubmit} disabled={!newNote.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </div>

              {/* Notes List */}
               <div className="space-y-4">
                 {filteredNotes.map((note) => (
                   <div key={note.id} className="note-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                                                 <div className="flex items-center gap-2 mb-2">
                           <span className={`note-type-badge ${
                             note.type === 'internal' ? 'note-type-internal' : 'note-type-technician'
                           }`}>
                             {note.type}
                           </span>
                          <span className="text-sm text-gray-600">
                            {new Date(note.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <Typography variant="body2" className="text-gray-900 mb-2">
                          {note.content}
                        </Typography>
                        <div className="text-sm text-gray-600">
                          By {note.author}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Typography variant="h6" className="text-gray-900">
                  Billing & Payments
                </Typography>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              </div>

              {/* AR Summary */}
              <Card className="p-6">
                <Typography variant="h6" className="text-gray-900 mb-4">
                  Accounts Receivable Summary
                </Typography>
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="text-center ar-summary-card ar-outstanding">
                     <div className="text-2xl font-bold text-red-600 analytics-number">
                       ${customer.ar_balance?.toFixed(2) || '0.00'}
                     </div>
                     <div className="text-sm text-gray-600">Outstanding Balance</div>
                   </div>
                   <div className="text-center ar-summary-card ar-unpaid">
                     <div className="text-2xl font-bold text-blue-600 analytics-number">3</div>
                     <div className="text-sm text-gray-600">Unpaid Invoices</div>
                   </div>
                   <div className="text-center ar-summary-card ar-paid">
                     <div className="text-2xl font-bold text-green-600 analytics-number">$2,450.00</div>
                     <div className="text-sm text-gray-600">Total Paid This Year</div>
                   </div>
                 </div>
              </Card>

              {/* Recent Invoices */}
              <Card className="p-6">
                <Typography variant="h6" className="text-gray-900 mb-4">
                  Recent Invoices
                </Typography>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">Invoice #{1000 + i}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="font-medium">${(150 + i * 25).toFixed(2)}</div>
                          <Chip variant="outline" className="text-xs">
                            {i === 1 ? 'Overdue' : 'Paid'}
                          </Chip>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'agreements' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Typography variant="h6" className="text-gray-900">
                  Agreements
                </Typography>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Agreement
                </Button>
              </div>

                             <div className="space-y-4">
                 {mockAgreements.map((agreement) => (
                   <div key={agreement.id} className="agreement-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <Typography variant="body1" className="font-medium">
                          {agreement.agreement_type.replace('_', ' ').toUpperCase()}
                        </Typography>
                        <div className="text-sm text-gray-600">
                          ${agreement.amount.toFixed(2)} • {agreement.terms}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Chip 
                          variant={agreement.status === 'signed' ? 'success' : 'outline'}
                          className="text-xs"
                        >
                          {agreement.status}
                        </Chip>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendAgreement(agreement)}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'communications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Typography variant="h6" className="text-gray-900">
                  Communications
                </Typography>
                <div className="flex gap-2">
                                     <select
                     value={messageType}
                     onChange={(e) => setMessageType(e.target.value as CommunicationType)}
                     className="crm-select"
                   >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
              </div>

              {/* Send Message */}
              <Card className="p-4">
                <div className="space-y-3">
                  {messageType === 'email' && (
                                                            <Input
                       placeholder="Subject"
                       value={messageSubject}
                       onChange={(value) => setMessageSubject(value)}
                       className="w-full"
                     />
                 )}
                 <Textarea
                   placeholder={`Type your ${messageType} message...`}
                   value={messageContent}
                   onChange={(value) => setMessageContent(value)}
                   className="w-full"
                   rows={3}
                 />
                  <div className="flex justify-end">
                    <Button onClick={handleSendMessage} disabled={!messageContent.trim()}>
                      <Send className="w-4 h-4 mr-2" />
                      Send {messageType.toUpperCase()}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Communication History */}
                             <div className="space-y-4">
                 {mockCommunications.map((comm) => (
                   <div key={comm.id} className="note-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                                                 <div className="flex items-center gap-2 mb-2">
                           <div className={`communication-indicator ${
                             comm.type === 'email' ? 'communication-email' :
                             comm.type === 'sms' ? 'communication-sms' :
                             'communication-phone'
                           }`} />
                          <span className="font-medium">{comm.type.toUpperCase()}</span>
                          <span className="text-sm text-gray-600">
                            {new Date(comm.sent_at).toLocaleDateString()}
                          </span>
                        </div>
                        {comm.subject && (
                          <div className="font-medium mb-1">{comm.subject}</div>
                        )}
                        <div className="text-sm text-gray-600">{comm.content}</div>
                      </div>
                      <Chip 
                        variant={comm.status === 'read' ? 'success' : 'outline'}
                        className="text-xs"
                      >
                        {comm.status}
                      </Chip>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Typography variant="h6" className="text-gray-900">
                  Documents
                </Typography>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {mockDocuments.map((doc) => (
                   <div key={doc.id} className="document-card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <span className="font-medium text-sm">{doc.name}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {new Date(doc.uploaded_at).toLocaleDateString()} • {doc.uploaded_by}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Typography variant="h6" className="text-gray-900">
                Customer Settings
              </Typography>
              
              <div className="settings-toggle">
                <Typography variant="h6" className="text-gray-900 mb-4">
                  Preferences
                </Typography>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Email Notifications</div>
                      <div className="text-sm text-gray-600">Receive service reminders via email</div>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">SMS Notifications</div>
                      <div className="text-sm text-gray-600">Receive service reminders via SMS</div>
                    </div>
                    <Checkbox />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Auto-schedule Renewals</div>
                      <div className="text-sm text-gray-600">Automatically schedule service renewals</div>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 w-96">
            <Typography variant="h6" className="text-gray-900 mb-4">
              Upload Profile Photo
            </Typography>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="w-full"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPhotoUpload(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowPhotoUpload(false)}>
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerProfile;
