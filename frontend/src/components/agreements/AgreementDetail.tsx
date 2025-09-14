import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Typography,
  Button,
  Chip,
  Alert,
  Card,
} from '@/components/ui/EnhancedUI';
import {
  FileText,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  User,
  Settings,
} from 'lucide-react';
import { agreementsApi, ServiceAgreement } from '@/lib/agreements-api';

interface AgreementDetailProps {
  agreement: ServiceAgreement;
  onEdit: () => void;
  onClose: () => void;
}

export function AgreementDetail({ agreement, onEdit, onClose }: AgreementDetailProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => agreementsApi.deleteAgreement(agreement.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agreements'] });
      onClose();
    },
    onError: (error) => {
      console.error('Error deleting agreement:', error);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'green';
      case 'expired': return 'red';
      case 'cancelled': return 'gray';
      case 'pending': return 'yellow';
      case 'inactive': return 'gray';
      default: return 'gray';
    }
  };

  const getBillingFrequencyColor = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'weekly': return 'blue';
      case 'monthly': return 'purple';
      case 'quarterly': return 'green';
      case 'annually': return 'orange';
      case 'one_time': return 'gray';
      default: return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateProgress = () => {
    if (!agreement.end_date) return 0;
    const start = new Date(agreement.start_date).getTime();
    const end = new Date(agreement.end_date).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const getDaysUntilExpiry = () => {
    if (!agreement.end_date) return null;
    const end = new Date(agreement.end_date);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryAlert = () => {
    const daysUntilExpiry = getDaysUntilExpiry();
    if (!daysUntilExpiry) return null;
    
    if (daysUntilExpiry < 0) {
      return { type: 'error', message: 'Agreement has expired' };
    } else if (daysUntilExpiry <= 30) {
      return { type: 'warning', message: `Agreement expires in ${daysUntilExpiry} days` };
    } else if (daysUntilExpiry <= 90) {
      return { type: 'info', message: `Agreement expires in ${daysUntilExpiry} days` };
    }
    return null;
  };

  const progress = calculateProgress();
  const expiryAlert = getExpiryAlert();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this agreement? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-blue-600" />
          <div>
            <Typography variant="h4" className="text-gray-900">
              {agreement.title}
            </Typography>
            <Typography variant="body2" className="text-gray-600">
              Agreement #{agreement.agreement_number}
            </Typography>
          </div>
        </div>
        <Chip
          color={getStatusColor(agreement.status)}
          variant="default"
        >
          {agreement.status.toUpperCase()}
        </Chip>
      </div>

      {/* Expiry Alert */}
      {expiryAlert && (
        <Alert
          type={expiryAlert.type as any}
          title="Agreement Notice"
        >
          {expiryAlert.message}
        </Alert>
      )}

      {/* Progress Bar */}
      {agreement.end_date && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Typography variant="body2" className="text-gray-600">
              Agreement Progress
            </Typography>
            <Typography variant="body2" className="text-gray-900">
              {Math.round(progress)}%
            </Typography>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                progress > 80 ? 'bg-red-500' : 
                progress > 60 ? 'bg-yellow-500' : 
                'bg-green-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </Card>
      )}

      {/* Customer Information */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="h-5 w-5 text-gray-600" />
          <Typography variant="h5" className="text-gray-900">
            Customer Information
          </Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="body2" className="text-gray-600">Customer Name</Typography>
            <Typography variant="body1" className="font-medium">
              {agreement.accounts.name}
            </Typography>
          </div>
          {agreement.accounts.email && (
            <div>
              <Typography variant="body2" className="text-gray-600">Email</Typography>
              <Typography variant="body1">{agreement.accounts.email}</Typography>
            </div>
          )}
          {agreement.accounts.phone && (
            <div>
              <Typography variant="body2" className="text-gray-600">Phone</Typography>
              <Typography variant="body1">{agreement.accounts.phone}</Typography>
            </div>
          )}
        </div>
      </Card>

      {/* Service Information */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="h-5 w-5 text-gray-600" />
          <Typography variant="h5" className="text-gray-900">
            Service Information
          </Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="body2" className="text-gray-600">Service Type</Typography>
            <Typography variant="body1" className="font-medium">
              {agreement.service_types.name}
            </Typography>
            {agreement.service_types.description && (
              <Typography variant="body2" className="text-gray-600 mt-1">
                {agreement.service_types.description}
              </Typography>
            )}
          </div>
          <div>
            <Typography variant="body2" className="text-gray-600">Billing Frequency</Typography>
            <Chip
              color={getBillingFrequencyColor(agreement.billing_frequency)}
              variant="default"
            >
              {agreement.billing_frequency}
            </Chip>
          </div>
        </div>
      </Card>

      {/* Financial Information */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-5 w-5 text-gray-600" />
          <Typography variant="h5" className="text-gray-900">
            Financial Information
          </Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agreement.pricing && (
            <div>
              <Typography variant="body2" className="text-gray-600">Agreement Value</Typography>
              <Typography variant="h4" className="text-green-600 font-bold">
                ${agreement.pricing.toLocaleString()}
              </Typography>
            </div>
          )}
          <div>
            <Typography variant="body2" className="text-gray-600">Auto-renewal</Typography>
            <div className="flex items-center gap-2">
              {agreement.auto_renewal ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <Typography variant="body1" className="text-green-600">
                    Enabled
                  </Typography>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 text-gray-400" />
                  <Typography variant="body1" className="text-gray-600">
                    Disabled
                  </Typography>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Agreement Dates */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="h-5 w-5 text-gray-600" />
          <Typography variant="h5" className="text-gray-900">
            Agreement Dates
          </Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="body2" className="text-gray-600">Start Date</Typography>
            <Typography variant="body1" className="font-medium">
              {formatDate(agreement.start_date)}
            </Typography>
          </div>
          {agreement.end_date && (
            <div>
              <Typography variant="body2" className="text-gray-600">End Date</Typography>
              <Typography variant="body1" className="font-medium">
                {formatDate(agreement.end_date)}
              </Typography>
            </div>
          )}
          <div>
            <Typography variant="body2" className="text-gray-600">Created</Typography>
            <Typography variant="body1">
              {formatDateTime(agreement.created_at)}
            </Typography>
          </div>
          <div>
            <Typography variant="body2" className="text-gray-600">Last Updated</Typography>
            <Typography variant="body1">
              {formatDateTime(agreement.updated_at)}
            </Typography>
          </div>
        </div>
      </Card>

      {/* Terms and Conditions */}
      {agreement.terms && (
        <Card className="p-4">
          <Typography variant="h5" className="text-gray-900 mb-3">
            Terms and Conditions
          </Typography>
          <Typography variant="body1" className="text-gray-700 whitespace-pre-wrap">
            {agreement.terms}
          </Typography>
        </Card>
      )}

      {/* Related Invoices */}
      {agreement.Invoice && agreement.Invoice.length > 0 && (
        <Card className="p-4">
          <Typography variant="h5" className="text-gray-900 mb-3">
            Related Invoices
          </Typography>
          <div className="space-y-2">
            {agreement.Invoice.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Typography variant="body1" className="font-medium">
                    Invoice #{invoice.invoice_number}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Due: {formatDate(invoice.due_date)}
                  </Typography>
                </div>
                <div className="text-right">
                  <Typography variant="body1" className="font-medium">
                    ${invoice.total_amount.toLocaleString()}
                  </Typography>
                  <Chip
                    color={invoice.status === 'paid' ? 'green' : 'yellow'}
                    variant="default"
                  >
                    {invoice.status}
                  </Chip>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Error Display */}
      {deleteMutation.error && (
        <Alert type="error" title="Error">
          {deleteMutation.error.message}
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={deleteMutation.isPending}
        >
          Close
        </Button>
        <Button
          variant="outline"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        </Button>
        <Button
          variant="primary"
          onClick={onEdit}
          disabled={deleteMutation.isPending}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit Agreement
        </Button>
      </div>
    </div>
  );
}
