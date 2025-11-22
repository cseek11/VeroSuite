// React import removed - not needed with React 17+
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Badge,
  Heading,
  Text,
} from '@/components/ui';
import {
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  User,
  Settings,
} from 'lucide-react';
import { agreementsApi, ServiceAgreement } from '@/lib/agreements-api';
import { logger } from '@/utils/logger';

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
      logger.error('Error deleting agreement', error, 'AgreementDetail');
    },
  });

  // Helper function for status color (currently unused, kept for potential future use)
  const _getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'green';
      case 'expired': return 'red';
      case 'cancelled': return 'gray';
      case 'pending': return 'yellow';
      case 'inactive': return 'gray';
      default: return 'gray';
    }
  };

  // Helper function for billing frequency color (currently unused, kept for potential future use)
  const _getBillingFrequencyColor = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case 'weekly': return 'blue';
      case 'monthly': return 'purple';
      case 'quarterly': return 'green';
      case 'annually': return 'orange';
      case 'one_time': return 'gray';
      default: return 'gray';
    }
  };
  void _getStatusColor; // Suppress unused warning
  void _getBillingFrequencyColor; // Suppress unused warning

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
            <Heading level={4} className="text-gray-900">
              {agreement.title}
            </Heading>
            <Text variant="small" className="text-gray-600">
              Agreement #{agreement.agreement_number}
            </Text>
          </div>
        </div>
        <Badge variant={agreement.status === 'active' ? 'default' : 'secondary'}>
          {agreement.status.toUpperCase()}
        </Badge>
      </div>

      {/* Expiry Alert */}
      {expiryAlert && (
        <div className={`border rounded-lg p-4 ${
          expiryAlert.type === 'error' ? 'bg-red-50 border-red-200' :
          expiryAlert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <h3 className={`text-sm font-medium mb-1 ${
            expiryAlert.type === 'error' ? 'text-red-800' :
            expiryAlert.type === 'warning' ? 'text-yellow-800' :
            'text-blue-800'
          }`}>Agreement Notice</h3>
          <p className={`text-sm ${
            expiryAlert.type === 'error' ? 'text-red-700' :
            expiryAlert.type === 'warning' ? 'text-yellow-700' :
            'text-blue-700'
          }`}>{expiryAlert.message}</p>
        </div>
      )}

      {/* Progress Bar */}
      {agreement.end_date && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Text variant="small" className="text-gray-600">
              Agreement Progress
            </Text>
            <Text variant="small" className="text-gray-900">
              {Math.round(progress)}%
            </Text>
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
          <Heading level={4} className="text-gray-900">
            Customer Information
          </Heading>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Text variant="small" className="text-gray-600">Customer Name</Text>
            <Text variant="body" className="font-medium">
              {agreement.account.name}
            </Text>
          </div>
          {agreement.account.email && (
            <div>
              <Text variant="small" className="text-gray-600">Email</Text>
              <Text variant="body">{agreement.account.email}</Text>
            </div>
          )}
          {agreement.account.phone && (
            <div>
              <Text variant="small" className="text-gray-600">Phone</Text>
              <Text variant="body">{agreement.account.phone}</Text>
            </div>
          )}
        </div>
      </Card>

      {/* Service Information */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Settings className="h-5 w-5 text-gray-600" />
          <Heading level={4} className="text-gray-900">
            Service Information
          </Heading>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Text variant="small" className="text-gray-600">Service Type</Text>
            <Text variant="body" className="font-medium">
              {agreement.service_types.name}
            </Text>
            {agreement.service_types.description && (
              <Text variant="small" className="text-gray-600 mt-1">
                {agreement.service_types.description}
              </Text>
            )}
          </div>
          <div>
            <Text variant="small" className="text-gray-600">Billing Frequency</Text>
            <Badge variant="default">
              {agreement.billing_frequency}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Financial Information */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-5 w-5 text-gray-600" />
          <Heading level={4} className="text-gray-900">
            Financial Information
          </Heading>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agreement.pricing && (
            <div>
              <Text variant="small" className="text-gray-600">Agreement Value</Text>
              <Heading level={4} className="text-green-600 font-bold">
                ${agreement.pricing.toLocaleString()}
              </Heading>
            </div>
          )}
          <div>
            <Text variant="small" className="text-gray-600">Auto-renewal</Text>
            <div className="flex items-center gap-2">
              {agreement.auto_renewal ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <Text variant="body" className="text-green-600">
                    Enabled
                  </Text>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 text-gray-400" />
                  <Text variant="body" className="text-gray-600">
                    Disabled
                  </Text>
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
          <Heading level={4} className="text-gray-900">
            Agreement Dates
          </Heading>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Text variant="small" className="text-gray-600">Start Date</Text>
            <Text variant="body" className="font-medium">
              {formatDate(agreement.start_date)}
            </Text>
          </div>
          {agreement.end_date && (
            <div>
              <Text variant="small" className="text-gray-600">End Date</Text>
              <Text variant="body" className="font-medium">
                {formatDate(agreement.end_date)}
              </Text>
            </div>
          )}
          <div>
            <Text variant="small" className="text-gray-600">Created</Text>
            <Text variant="body">
              {formatDateTime(agreement.created_at)}
            </Text>
          </div>
          <div>
            <Text variant="small" className="text-gray-600">Last Updated</Text>
            <Text variant="body">
              {formatDateTime(agreement.updated_at)}
            </Text>
          </div>
        </div>
      </Card>

      {/* Terms and Conditions */}
      {agreement.terms && (
        <Card className="p-4">
          <Heading level={4} className="text-gray-900 mb-3">
            Terms and Conditions
          </Heading>
          <Text variant="body" className="text-gray-700 whitespace-pre-wrap">
            {agreement.terms}
          </Text>
        </Card>
      )}

      {/* Related Invoices */}
      {agreement.Invoice && agreement.Invoice.length > 0 && (
        <Card className="p-4">
          <Heading level={4} className="text-gray-900 mb-3">
            Related Invoices
          </Heading>
          <div className="space-y-2">
            {agreement.Invoice.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Text variant="body" className="font-medium">
                    Invoice #{invoice.invoice_number}
                  </Text>
                  <Text variant="small" className="text-gray-600">
                    Due: {formatDate(invoice.due_date)}
                  </Text>
                </div>
                <div className="text-right">
                  <Text variant="body" className="font-medium">
                    ${invoice.total_amount.toLocaleString()}
                  </Text>
                  <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Error Display */}
      {deleteMutation.error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 mb-1">Error</h3>
          <p className="text-sm text-red-700">{deleteMutation.error.message}</p>
        </div>
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
