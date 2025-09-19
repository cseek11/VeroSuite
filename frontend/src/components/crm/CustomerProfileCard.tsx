import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { enhancedApi } from '@/lib/enhanced-api';
import { 
  Account, 
  CustomerProfile, 
  CustomerContact 
} from '@/types/enhanced-types';
import {
  Card,
  Button,
  Input,
  Typography,
  Alert,
  Chip,
  Avatar,
  Tooltip,
  Modal
} from '@/components/ui/EnhancedUI';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  Edit,
  Camera,
  Save,
  X,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CustomerProfileCardProps {
  customer: Account;
  profile?: CustomerProfile;
  contacts?: CustomerContact[];
}

export default function CustomerProfileCard({ 
  customer, 
  profile,
  contacts = []
}: CustomerProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [editedCustomer, setEditedCustomer] = useState(customer);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const queryClient = useQueryClient();

  // Enhanced customer stats using profile data
  const customerStats = {
    totalServices: profile?.total_services || 0,
    activeContracts: profile?.active_contracts || 0,
    lastVisit: profile?.last_service_date || 'N/A',
    nextScheduled: profile?.next_service_date || 'N/A',
    satisfactionScore: profile?.satisfaction_score || 0,
    churnRisk: profile?.churn_risk || 'Low',
    lifetimeValue: profile?.lifetime_value || 0
  };

  // Update customer mutation
  const updateCustomer = useMutation({
    mutationFn: (data: Partial<Account>) => enhancedApi.customers.update(customer.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-customer', customer.id] });
      setIsEditing(false);
    },
  });

  // Update customer profile mutation
  const updateProfile = useMutation({
    mutationFn: (data: Partial<CustomerProfile>) => enhancedApi.customers.update(customer.id, {}, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-profile', customer.id] });
    },
  });

  // Upload photo mutation (placeholder for now)
  const uploadPhoto = useMutation({
    mutationFn: async (file: File) => {
      // Placeholder - will be implemented when photo API is enhanced
      console.log('Uploading photo:', file);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-photos', customer.id] });
      setShowPhotoModal(false);
      setSelectedPhoto(null);
    },
  });

  const handleSave = () => {
    updateCustomer.mutate(editedCustomer);
  };

  const handlePhotoUpload = () => {
    if (selectedPhoto) {
      uploadPhoto.mutate(selectedPhoto);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'green';
      case 'inactive': return 'gray';
      case 'suspended': return 'red';
      case 'on_hold': return 'yellow';
      case 'canceled': return 'red';
      case 'past_due': return 'orange';
      default: return 'gray';
    }
  };

  const getChurnRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'red';
      default: return 'gray';
    }
  };

  const customerSince = new Date(customer.created_at);
  const primaryContact = contacts.find(contact => contact.is_primary);
  const emergencyContact = contacts.find(contact => contact.is_emergency_contact);

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <User className="w-8 h-8" />
            </Avatar>
            <div>
              <Typography variant="h4" className="text-gray-900">
                {customer.name}
              </Typography>
              <div className="flex items-center gap-4 mt-1">
                <Chip 
                  variant="outline" 
                  color={getStatusColor(customer.status)}
                  className="text-sm"
                >
                  {customer.status.replace('_', ' ').toUpperCase()}
                </Chip>
                <Typography variant="body2" className="text-gray-600">
                  {customer.account_type} • Customer since {customerSince.toLocaleDateString()}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/billing/${customer.id}`)}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Payment Portal
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPhotoModal(true)}
            >
              <Camera className="w-4 h-4 mr-2" />
              Add Photo
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            {isEditing && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={updateCustomer.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <Typography variant="h6" className="text-gray-900">
              Contact Information
            </Typography>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                {isEditing ? (
                  <Input
                    value={editedCustomer.phone || ''}
                    onChange={(value) => setEditedCustomer(prev => ({ ...prev, phone: value }))}
                    placeholder="Phone number"
                    className="flex-1"
                  />
                ) : (
                  <span className="text-gray-700">{customer.phone || 'Not provided'}</span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                {isEditing ? (
                  <Input
                    value={editedCustomer.email || ''}
                    onChange={(value) => setEditedCustomer(prev => ({ ...prev, email: value }))}
                    placeholder="Email address"
                    className="flex-1"
                  />
                ) : (
                  <span className="text-gray-700">{customer.email || 'Not provided'}</span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">
                  {customer.address ? `${customer.address}, ${customer.city}, ${customer.state} ${customer.zip_code}` : 'Address not provided'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Typography variant="h6" className="text-gray-900">
              Business Information
            </Typography>
            
            <div className="space-y-3">
              {profile?.business_name && (
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{profile.business_name}</span>
                </div>
              )}
              
              {profile?.business_type && (
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{profile.business_type}</span>
                </div>
              )}
              
              {primaryContact && (
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Primary: {primaryContact.name}</span>
                </div>
              )}
              
              {emergencyContact && (
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Emergency: {emergencyContact.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Typography variant="h4" className="text-purple-600 font-bold">
              {customerStats.totalServices}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Total Services
            </Typography>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Typography variant="h4" className="text-green-600 font-bold">
              {customerStats.activeContracts}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Active Contracts
            </Typography>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <Typography variant="h4" className="text-yellow-600 font-bold">
                {customerStats.satisfactionScore}
              </Typography>
            </div>
            <Typography variant="body2" className="text-gray-600">
              Satisfaction
            </Typography>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Typography variant="h4" className="text-blue-600 font-bold">
              ${customerStats.lifetimeValue.toLocaleString()}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Lifetime Value
            </Typography>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h6" className="text-gray-900">
                Churn Risk Assessment
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                Based on service history and engagement
              </Typography>
            </div>
            <Chip 
              variant="outline" 
              color={getChurnRiskColor(customerStats.churnRisk)}
              className="text-sm font-medium"
            >
              {customerStats.churnRisk.toUpperCase()} RISK
            </Chip>
          </div>
        </div>
      </Card>

      {/* Photo Upload Modal */}
      <Modal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        title="Upload Customer Photo"
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedPhoto(e.target.files?.[0] || null)}
              className="hidden"
              id="photo-upload"
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <Typography variant="body2" className="text-gray-600">
                Click to select a photo or drag and drop
              </Typography>
            </label>
          </div>
          
          {selectedPhoto && (
            <div className="text-center">
              <Typography variant="body2" className="text-gray-600">
                Selected: {selectedPhoto.name}
              </Typography>
            </div>
          )}
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowPhotoModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handlePhotoUpload}
              disabled={!selectedPhoto || uploadPhoto.isPending}
            >
              Upload Photo
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}



