import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { crmApi } from '@/lib/api';
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
  TrendingUp
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  property_type?: string;
  property_size?: string;
  access_instructions?: string;
  emergency_contact?: string;
  preferred_contact_method?: string;
  status: string;
  account_type: string;
  created_at: string;
  ar_balance: number;
}

interface CustomerProfileCardProps {
  customer: Customer;
}

export default function CustomerProfileCard({ customer }: CustomerProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(customer);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const queryClient = useQueryClient();

  // Mock data for demonstration
  const customerStats = {
    totalServices: 24,
    activeContracts: 2,
    lastVisit: '2024-01-15',
    nextScheduled: '2024-02-01',
    satisfactionScore: 4.8,
    churnRisk: 'Low',
    lifetimeValue: 12500
  };

  const updateCustomer = useMutation({
    mutationFn: (data: Partial<Customer>) => crmApi.updateCustomer(customer.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'customer', customer.id] });
      setIsEditing(false);
    },
  });

  const uploadPhoto = useMutation({
    mutationFn: (file: File) => crmApi.uploadCustomerPhoto(customer.id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'customer', customer.id, 'photos'] });
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

  const customerSince = new Date(customer.created_at).getFullYear();
  const currentYear = new Date().getFullYear();
  const tenure = currentYear - customerSince;

  return (
    <>
      <Card className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Photo & Basic Info */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center space-y-4">
              {/* Customer Avatar */}
              <div className="relative">
                <Avatar
                  size="xl"
                  src={customer.id ? `/api/customers/${customer.id}/photo` : undefined}
                  fallback={customer.name.charAt(0).toUpperCase()}
                  className="h-24 w-24"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowPhotoModal(true)}
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              {/* Customer Name & Status */}
              <div className="text-center">
                <Typography variant="h2" className="text-gray-900">
                  {customer.name}
                </Typography>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Chip
                    color={getStatusColor(customer.status)}
                    variant="outline"
                    size="sm"
                  >
                    {customer.status}
                  </Chip>
                  <Chip
                    color="blue"
                    variant="outline"
                    size="sm"
                  >
                    {customer.account_type}
                  </Chip>
                </div>
                <Typography variant="body2" className="text-gray-500 mt-1">
                  Customer since {customerSince} ({tenure} years)
                </Typography>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`tel:${customer.phone}`)}
                  disabled={!customer.phone}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`mailto:${customer.email}`)}
                  disabled={!customer.email}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <Typography variant="h3" className="text-gray-900">
                  Contact Information
                </Typography>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      label="Email"
                      value={editedCustomer.email || ''}
                      onChange={(value) => setEditedCustomer({
                        ...editedCustomer,
                        email: value
                      })}
                      icon={Mail}
                    />
                    <Input
                      label="Phone"
                      value={editedCustomer.phone || ''}
                      onChange={(value) => setEditedCustomer({
                        ...editedCustomer,
                        phone: value
                      })}
                      icon={Phone}
                    />
                    <Input
                      label="Emergency Contact"
                      value={editedCustomer.emergency_contact || ''}
                      onChange={(value) => setEditedCustomer({
                        ...editedCustomer,
                        emergency_contact: value
                      })}
                    />
                    <Input
                      label="Preferred Contact Method"
                      value={editedCustomer.preferred_contact_method || ''}
                      onChange={(value) => setEditedCustomer({
                        ...editedCustomer,
                        preferred_contact_method: value
                      })}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <Typography variant="body2">
                        {customer.email || 'No email provided'}
                      </Typography>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <Typography variant="body2">
                        {customer.phone || 'No phone provided'}
                      </Typography>
                    </div>
                    {customer.emergency_contact && (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                        <Typography variant="body2">
                          Emergency: {customer.emergency_contact}
                        </Typography>
                      </div>
                    )}
                    {customer.preferred_contact_method && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <Typography variant="body2">
                          Prefers: {customer.preferred_contact_method}
                        </Typography>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Property Information */}
              <div className="space-y-4">
                <Typography variant="h3" className="text-gray-900">
                  Property Information
                </Typography>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      label="Address"
                      value={editedCustomer.address || ''}
                      onChange={(value) => setEditedCustomer({
                        ...editedCustomer,
                        address: value
                      })}
                      icon={MapPin}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        label="City"
                        value={editedCustomer.city || ''}
                        onChange={(value) => setEditedCustomer({
                          ...editedCustomer,
                          city: value
                        })}
                      />
                      <Input
                        label="State"
                        value={editedCustomer.state || ''}
                        onChange={(value) => setEditedCustomer({
                          ...editedCustomer,
                          state: value
                        })}
                      />
                      <Input
                        label="ZIP"
                        value={editedCustomer.zip_code || ''}
                        onChange={(value) => setEditedCustomer({
                          ...editedCustomer,
                          zip_code: value
                        })}
                      />
                    </div>
                    <Input
                      label="Property Type"
                      value={editedCustomer.property_type || ''}
                      onChange={(value) => setEditedCustomer({
                        ...editedCustomer,
                        property_type: value
                      })}
                      icon={Building}
                    />
                    <Input
                      label="Property Size"
                      value={editedCustomer.property_size || ''}
                      onChange={(value) => setEditedCustomer({
                        ...editedCustomer,
                        property_size: value
                      })}
                    />
                    <Input
                      label="Access Instructions"
                      value={editedCustomer.access_instructions || ''}
                      onChange={(value) => setEditedCustomer({
                        ...editedCustomer,
                        access_instructions: value
                      })}
                      multiline
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <Typography variant="body2">
                        {customer.address ? (
                          <>
                            {customer.address}
                            {customer.city && `, ${customer.city}`}
                            {customer.state && `, ${customer.state}`}
                            {customer.zip_code && ` ${customer.zip_code}`}
                          </>
                        ) : 'No address provided'}
                      </Typography>
                    </div>
                    {customer.property_type && (
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <Typography variant="body2">
                          {customer.property_type}
                          {customer.property_size && ` - ${customer.property_size}`}
                        </Typography>
                      </div>
                    )}
                    {customer.access_instructions && (
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
                        <Typography variant="body2">
                          {customer.access_instructions}
                        </Typography>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <Typography variant="body2" className="text-blue-600 font-medium">
                    Total Services
                  </Typography>
                </div>
                <Typography variant="h3" className="text-blue-900 mt-1">
                  {customerStats.totalServices}
                </Typography>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <Typography variant="body2" className="text-green-600 font-medium">
                    Active Contracts
                  </Typography>
                </div>
                <Typography variant="h3" className="text-green-900 mt-1">
                  {customerStats.activeContracts}
                </Typography>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  <Typography variant="body2" className="text-purple-600 font-medium">
                    Satisfaction
                  </Typography>
                </div>
                <Typography variant="h3" className="text-purple-900 mt-1">
                  {customerStats.satisfactionScore}
                </Typography>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                  <Typography variant="body2" className="text-orange-600 font-medium">
                    LTV
                  </Typography>
                </div>
                <Typography variant="h3" className="text-orange-900 mt-1">
                  ${customerStats.lifetimeValue.toLocaleString()}
                </Typography>
              </div>
            </div>

            {/* Alerts & Warnings */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <Typography variant="h4" className="text-gray-900">
                  Alerts & Insights
                </Typography>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <Typography variant="body2" className="text-yellow-800">
                      Next service scheduled for {customerStats.nextScheduled}
                    </Typography>
                  </div>
                  <Chip
                    color={getChurnRiskColor(customerStats.churnRisk)}
                    variant="outline"
                    size="sm"
                  >
                    {customerStats.churnRisk} Risk
                  </Chip>
                </div>
                
                {customer.ar_balance > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-red-600" />
                      <Typography variant="body2" className="text-red-800">
                        Outstanding balance: ${customer.ar_balance.toFixed(2)}
                      </Typography>
                    </div>
                    <Button size="sm" variant="outline">
                      View Invoice
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="mt-6 flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={updateCustomer.isPending}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedCustomer(customer);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            )}
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
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <Typography variant="body1" className="text-gray-600">
                Click to select a photo or drag and drop
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                PNG, JPG up to 10MB
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
          
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowPhotoModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePhotoUpload}
              disabled={!selectedPhoto || uploadPhoto.isPending}
            >
              Upload Photo
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}



