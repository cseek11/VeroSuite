import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { MapPin, Building, Phone, Mail, Calendar, DollarSign, Tag, Clock, AlertCircle, Loader2, Edit, Check, X, User, MessageSquare, FileText, ChevronLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';
import {
  Typography,
  Button,
  Chip,
  Badge,
  Textarea
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

interface CustomerOverviewProps {
  customerId: string;
  onNavigateToNote?: (noteId: string) => void;
}

interface NoteData {
  id: string;
  type: 'service' | 'internal' | 'email' | 'phone' | 'invoice' | 'payment' | 'account';
  title: string;
  content: string;
  author: string;
  timestamp: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'alert' | 'completed' | 'pending';
  createdBy?: string;
}

interface OpenPopup {
  id: string;
  note: NoteData;
  position: { x: number; y: number };
  isDragging: boolean;
  dragOffset: { x: number; y: number };
}

const CustomerOverview: React.FC<CustomerOverviewProps> = ({
  customerId,
  onNavigateToNote
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState<Customer | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [customerTags, setCustomerTags] = useState<string[]>(['VIP', 'Quarterly Service', 'High Priority']);
  const [selectedNote, setSelectedNote] = useState<NoteData | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [openPopups, setOpenPopups] = useState<OpenPopup[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNotePriority, setNewNotePriority] = useState<'low' | 'medium' | 'high'>('low');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [draggedPopupId, setDraggedPopupId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Fetch customer data
  const { data: customer, isLoading, error } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => enhancedApi.customers.getById(customerId),
    enabled: !!customerId
  });

  // Initialize edited customer when data loads
  React.useEffect(() => {
    if (customer && !editedCustomer) {
      setEditedCustomer(customer);
    }
  }, [customer, editedCustomer]);

  const handleInputChange = (field: keyof Customer, value: string) => {
    setEditedCustomer((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSaveCustomer = async () => {
    if (!editedCustomer) return;
    try {
      setIsSaving(true);
      await enhancedApi.customers.update(customerId, {
        name: editedCustomer.name,
        phone: editedCustomer.phone,
        email: editedCustomer.email,
        address: editedCustomer.address,
        city: editedCustomer.city,
        state: editedCustomer.state,
        zip_code: editedCustomer.zip_code,
      } as any);
      setIsEditing(false);
    } catch (e) {
      logger.error('Failed to save customer', e, 'CustomerOverview');
    } finally {
      setIsSaving(false);
    }
  };

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

  // Real data will be fetched from API
  const { data: noteData = [] } = useQuery({
    queryKey: ['customer-notes', customer.id],
    queryFn: () => enhancedApi.customerNotes.getByCustomer(customer.id),
  });

  // Handle note click to show popup
  const handleNoteClick = (note: NoteData, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Check if popup is already open
    const existingPopup = openPopups.find(popup => popup.note.id === note.id);
    if (existingPopup) {
      // Close the popup if it's already open
      setOpenPopups(prev => prev.filter(popup => popup.note.id !== note.id));
      return;
    }

    // Calculate position for new popup
    const rect = event.currentTarget.getBoundingClientRect();
    const horizontalOffset = -320; // Popup width + some margin
    const verticalOffset = -100; // Center vertically
    
    const newPopup: OpenPopup = {
      id: `popup-${note.id}-${Date.now()}`,
      note,
      position: {
        x: rect.left + horizontalOffset,
        y: rect.top + verticalOffset
      },
      isDragging: false,
      dragOffset: { x: 0, y: 0 }
    };

    setOpenPopups(prev => [...prev, newPopup]);
  };

  // Handle popup drag start
  const handleMouseDown = (popupId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    const popup = openPopups.find(p => p.id === popupId);
    if (!popup) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    setDraggedPopupId(popupId);
    setDragOffset({ x: offsetX, y: offsetY });

    setOpenPopups(prev => prev.map(p => 
      p.id === popupId 
        ? { ...p, isDragging: true, dragOffset: { x: offsetX, y: offsetY } }
        : p
    ));
  };

  // Handle popup drag move
  const handleMouseMove = (event: MouseEvent) => {
    if (!draggedPopupId) return;

    const newX = event.clientX - dragOffset.x;
    const newY = event.clientY - dragOffset.y;

    setOpenPopups(prev => prev.map(popup => 
      popup.id === draggedPopupId
        ? { ...popup, position: { x: newX, y: newY } }
        : popup
    ));
  };

  // Handle popup drag end
  const handleMouseUp = () => {
    if (draggedPopupId) {
      setOpenPopups(prev => prev.map(popup => 
        popup.id === draggedPopupId
          ? { ...popup, isDragging: false }
          : popup
      ));
      setDraggedPopupId(null);
    }
  };

  // Add mouse event listeners for dragging
  useEffect(() => {
    if (draggedPopupId) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedPopupId, dragOffset]);

  // Handle note submission
  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;
    
    setIsSubmittingNote(true);
    
    // Simulate API call
    setTimeout(() => {
      const newNote: NoteData = {
        id: `new-${Date.now()}`,
        type: 'internal',
        title: `Internal Note - ${newNotePriority} Priority`,
        content: newNoteContent,
        author: 'Current User',
        timestamp: new Date().toISOString(),
        priority: newNotePriority,
        createdBy: 'Current User'
      };
      
      // Add to noteData (in real app, this would be an API call)
      noteData.unshift(newNote);
      
      setNewNoteContent('');
      setNewNotePriority('low');
      setIsSubmittingNote(false);
    }, 1000);
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
    return coordinates[customer?.city || 'Pittsburgh'] || [40.4406, -79.9959];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load customer data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Layout - Left column (2/3) and Right column (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer Info, Map, Service Locations */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          {/* Customer Information */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <Typography variant="h6" className="text-purple-900 flex items-center gap-2 text-sm font-semibold">
                <User className="w-4 h-4" />
                Customer Information
              </Typography>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveCustomer}
                    disabled={isSaving}
                    className="text-xs px-2 py-1 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setEditedCustomer(customer as Customer); setIsEditing(false); }}
                    className="text-xs px-2 py-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-xs px-2 py-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-purple-700 mb-1 block">Name</label>
                <input
                  type="text"
                  value={editedCustomer?.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                  className="w-full text-sm px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-purple-700 mb-1 block">Phone</label>
                <input
                  type="text"
                  value={editedCustomer?.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className="w-full text-sm px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-purple-700 mb-1 block">Email</label>
                <input
                  type="email"
                  value={editedCustomer?.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="w-full text-sm px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-purple-700 mb-1 block">Status</label>
                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-purple-200">
                  <div className={`w-2 h-2 rounded-full ${customer.status === 'active' ? 'bg-green-500' : customer.status === 'prospect' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium capitalize text-purple-700">{customer.status}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <label className="text-xs font-medium text-purple-700 mb-1 block">Address</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={editedCustomer?.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  className="w-full text-sm px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 col-span-2"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={editedCustomer?.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={!isEditing}
                  className="w-full text-sm px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={editedCustomer?.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  disabled={!isEditing}
                  className="w-full text-sm px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={editedCustomer?.zip_code || ''}
                  onChange={(e) => handleInputChange('zip_code', e.target.value)}
                  disabled={!isEditing}
                  className="w-full text-sm px-2 py-1 border border-purple-300 rounded bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-xl border border-purple-200 p-4 flex-1 flex flex-col">
            <Typography variant="h6" className="text-purple-900 flex items-center gap-2 text-sm font-semibold mb-3">
              <MapPin className="w-4 h-4" />
              Service Location
            </Typography>
            <div className="flex-1 rounded-lg overflow-hidden border border-purple-200">
              <MapContainer
                center={getCustomerCoordinates()}
                zoom={13}
                className="w-full h-full"
                style={{ minHeight: '300px' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={getCustomerCoordinates()}>
                  <Popup>
                    <div className="text-center">
                      <div className="font-semibold text-purple-900">{customer.name}</div>
                      <div className="text-sm text-gray-600">{customer.address}</div>
                      <div className="text-sm text-gray-600">{customer.city}, {customer.state}</div>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Service Locations */}
          <div className="bg-white rounded-xl border border-purple-200 p-4">
            <Typography variant="h6" className="text-purple-900 flex items-center gap-2 text-sm font-semibold mb-3">
              <Building className="w-4 h-4" />
              Service Locations
            </Typography>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-white rounded border border-purple-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-900">Primary Location</span>
                </div>
                <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded border border-purple-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-900">Secondary Location</span>
                </div>
                <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                  Pending
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Account History */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-purple-200 p-4 h-full">
            <Typography variant="h6" className="text-purple-900 flex items-center gap-2 text-sm font-semibold mb-3">
              <FileText className="w-4 h-4" />
              Account History
            </Typography>
            
            {/* Add Note Form */}
            <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="mb-2">
                <Textarea
                  value={newNoteContent}
                  onChange={(value) => setNewNoteContent(value)}
                  placeholder="Add internal note..."
                  rows={2}
                  className="w-full text-sm border-purple-300 bg-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-xs font-medium text-purple-700">Priority:</label>
                <div className="flex gap-1">
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <label key={priority} className="flex items-center gap-1 text-xs">
                      <input
                        type="radio"
                        name="priority"
                        value={priority}
                        checked={newNotePriority === priority}
                        onChange={(e) => setNewNotePriority(e.target.value as 'low' | 'medium' | 'high')}
                        className="text-purple-600 focus:ring-purple-500 w-3 h-3"
                      />
                      <span className="text-purple-700 capitalize">{priority}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddNote}
                  disabled={!newNoteContent.trim() || isSubmittingNote}
                  className="text-xs px-2 py-1 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  {isSubmittingNote ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Add Note'}
                </Button>
                <Button
                  onClick={() => setNewNoteContent('')}
                  variant="outline"
                  className="text-xs px-2 py-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  Cancel
                </Button>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-2 max-h-96 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-purple-50 [&::-webkit-scrollbar-thumb]:bg-purple-300 hover:[&::-webkit-scrollbar-thumb]:bg-purple-400">
              {noteData.map((note) => (
                <div
                  key={note.id}
                  className="relative p-2 bg-white rounded border border-purple-200 hover:border-purple-300 transition-all duration-200 cursor-pointer group"
                  onClick={(e) => handleNoteClick(note, e)}
                  onMouseEnter={() => setHoveredCard(note.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-1 rounded ${getNoteColor(note.type)}`}>
                          {getNoteIcon(note.type)}
                        </div>
                        <span className="text-xs font-medium text-purple-900 truncate">
                          {note.title}
                        </span>
                      </div>
                      <p className="text-xs text-purple-700 line-clamp-2">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-purple-600">
                          {note.createdBy || note.author}
                        </span>
                        <span className="text-xs text-purple-500">
                          {new Date(note.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* View indicator - slides in from left on hover */}
                    <div className={`flex items-center gap-1 text-xs text-purple-600 transition-all duration-200 ${
                      hoveredCard === note.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}>
                      <ChevronLeft className="w-3 h-3" />
                      <span>View</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Recent Activity, Tags, Property Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-4 hover:bg-orange-100 transition-all duration-200">
          <Typography variant="h6" className="text-orange-900 flex items-center gap-2 text-sm font-semibold mb-3">
            <Clock className="w-4 h-4" />
            Recent Activity
          </Typography>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-orange-800">Service completed - Jan 15</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-orange-800">Payment received - Jan 10</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-orange-800">Account updated - Jan 9</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4 hover:bg-yellow-100 transition-all duration-200">
          <Typography variant="h6" className="text-yellow-900 flex items-center gap-2 text-sm font-semibold mb-3">
            <Tag className="w-4 h-4" />
            Tags
          </Typography>
          <div className="flex flex-wrap gap-1">
            {customerTags.map((tag, index) => (
              <Chip key={index} variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                {tag}
              </Chip>
            ))}
          </div>
        </div>

        {/* Property Information */}
        <div className="bg-white rounded-xl border border-purple-200 p-4">
          <Typography variant="h6" className="text-purple-900 flex items-center gap-2 text-sm font-semibold mb-3">
            <Building className="w-4 h-4" />
            Property Information
          </Typography>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-purple-700">Type:</span>
              <span className="text-purple-900">{customer.property_type || 'Residential'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">Size:</span>
              <span className="text-purple-900">{customer.property_size || '2,500 sq ft'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">Access:</span>
              <span className="text-purple-900">{customer.access_instructions ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Note Detail Popups */}
      {openPopups.map((popup) => (
        <div
          key={popup.id}
          className="fixed z-50 bg-white rounded-lg border border-purple-200 shadow-xl p-4 w-80 max-h-96 overflow-y-auto"
          style={{
            left: popup.position.x,
            top: popup.position.y,
            cursor: popup.isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={(e) => handleMouseDown(popup.id, e)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-1 rounded ${getNoteColor(popup.note.type)}`}>
                {getNoteIcon(popup.note.type)}
              </div>
              <span className="text-sm font-semibold text-purple-900">{popup.note.title}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenPopups(prev => prev.filter(p => p.id !== popup.id))}
              className="text-purple-600 hover:text-purple-800 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mb-3">
            <p className="text-sm text-purple-700 leading-relaxed">{popup.note.content}</p>
          </div>
          
          <div className="flex items-center justify-between text-xs text-purple-600">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {popup.note.createdBy || popup.note.author}
            </div>
            <span>{new Date(popup.note.timestamp).toLocaleString()}</span>
          </div>
          
          {popup.note.priority && (
            <div className="mt-2">
              <Badge variant="outline" className={`text-xs ${getPriorityColor(popup.note.priority)}`}>
                {popup.note.priority.charAt(0).toUpperCase() + popup.note.priority.slice(1)} Priority
              </Badge>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Helper functions
const getNoteIcon = (type: string) => {
  switch (type) {
    case 'service':
      return <Calendar className="w-4 h-4" />;
    case 'internal':
      return <MessageSquare className="w-4 h-4" />;
    case 'email':
      return <Mail className="w-4 h-4" />;
    case 'phone':
      return <Phone className="w-4 h-4" />;
    case 'invoice':
      return <DollarSign className="w-4 h-4" />;
    case 'payment':
      return <Check className="w-4 h-4" />;
    case 'account':
      return <User className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const getNoteColor = (type: string) => {
  switch (type) {
    case 'service':
      return 'bg-blue-100 text-blue-800';
    case 'internal':
      return 'bg-purple-100 text-purple-800';
    case 'email':
      return 'bg-green-100 text-green-800';
    case 'phone':
      return 'bg-orange-100 text-orange-800';
    case 'invoice':
      return 'bg-yellow-100 text-yellow-800';
    case 'payment':
      return 'bg-emerald-100 text-emerald-800';
    case 'account':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-purple-100 text-purple-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-purple-100 text-purple-800 border-purple-200';
  }
};

export default CustomerOverview;
