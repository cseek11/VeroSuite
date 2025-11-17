import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  CRMSelect,
  Heading,
  Text,
} from '@/components/ui';
import {
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Plus,
  Search,
  Eye,
} from 'lucide-react';
import { agreementsApi } from '@/lib/agreements-api';
import { AgreementForm } from './AgreementForm';
import { AgreementDetail } from './AgreementDetail';

export interface ServiceAgreement {
  id: string;
  tenant_id: string;
  account_id: string;
  service_type_id: string;
  agreement_number: string;
  title: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'inactive' | 'expired' | 'cancelled' | 'pending';
  terms?: string;
  pricing?: number;
  billing_frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'one_time';
  auto_renewal?: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  accounts: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  service_types: {
    id: string;
    name: string;
    description?: string;
  };
  Invoice?: Array<{
    id: string;
    invoice_number: string;
    status: string;
    total_amount: number;
    due_date: string;
  }>;
}

interface AgreementListProps {
  customerId?: string;
}

export function AgreementList({ customerId }: AgreementListProps) {
  const [selectedAgreement, setSelectedAgreement] = useState<ServiceAgreement | null>(null);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showNewAgreementModal, setShowNewAgreementModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const { data: agreementsData, isLoading, error } = useQuery({
    queryKey: ['agreements', { page, limit, status: statusFilter, customerId }],
    queryFn: () => agreementsApi.getAgreements({
      page,
      limit,
      status: statusFilter as any,
      customerId,
    }),
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
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateProgress = (agreement: ServiceAgreement) => {
    if (!agreement.end_date) return 0;
    const start = new Date(agreement.start_date).getTime();
    const end = new Date(agreement.end_date).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const getDaysUntilExpiry = (agreement: ServiceAgreement) => {
    if (!agreement.end_date) return null;
    const end = new Date(agreement.end_date);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryAlert = (agreement: ServiceAgreement) => {
    const daysUntilExpiry = getDaysUntilExpiry(agreement);
    if (!daysUntilExpiry) return null;
    
    if (daysUntilExpiry < 0) {
      return { type: 'error', message: 'Agreement expired' };
    } else if (daysUntilExpiry <= 30) {
      return { type: 'warning', message: `Expires in ${daysUntilExpiry} days` };
    } else if (daysUntilExpiry <= 90) {
      return { type: 'info', message: `Expires in ${daysUntilExpiry} days` };
    }
    return null;
  };

  const filteredAgreements = agreementsData?.agreements?.filter(agreement => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        agreement.title.toLowerCase().includes(searchLower) ||
        agreement.agreement_number.toLowerCase().includes(searchLower) ||
        agreement.account.name.toLowerCase().includes(searchLower) ||
        agreement.service_types.name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  }) || [];

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Text variant="body" className="text-gray-600">
            Loading agreements...
          </Text>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 mb-1">Error loading agreements</h3>
          <p className="text-sm text-red-700">{error.message}</p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Heading level={3} className="text-gray-900">
            Service Agreements
          </Heading>
          <Button
            variant="primary"
            onClick={() => setShowNewAgreementModal(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            New Agreement
          </Button>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search agreements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          <CRMSelect
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'expired', label: 'Expired' },
              { value: 'cancelled', label: 'Cancelled' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </div>

        {filteredAgreements.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Heading level={4} className="text-gray-900 mb-2">
              No Agreements Found
            </Heading>
            <Text variant="body" className="text-gray-600 mb-4">
              {searchTerm || statusFilter 
                ? 'No agreements match your search criteria.'
                : 'No service agreements have been created yet.'}
            </Text>
            {!searchTerm && !statusFilter && (
              <Button
                variant="outline"
                onClick={() => setShowNewAgreementModal(true)}
              >
                Create First Agreement
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgreements.map((agreement) => {
              const progress = calculateProgress(agreement);
              const expiryAlert = getExpiryAlert(agreement);
              
              return (
                <div
                  key={agreement.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedAgreement(agreement);
                    setShowAgreementModal(true);
                  }}
                >
                  {/* Agreement Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <Heading level={5} className="text-gray-900 truncate">
                        {agreement.title}
                      </Heading>
                    </div>
                    <Badge variant={agreement.status === 'active' ? 'default' : 'secondary'}>
                      {agreement.status}
                    </Badge>
                  </div>

                  {/* Agreement Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <Text variant="small" className="text-gray-600">
                        Customer
                      </Text>
                      <Text variant="small" className="text-gray-900 truncate">
                        {agreement.account.name}
                      </Text>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Text variant="small" className="text-gray-600">
                        Service Type
                      </Text>
                      <Text variant="small" className="text-gray-900 truncate">
                        {agreement.service_types.name}
                      </Text>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Text variant="small" className="text-gray-600">
                        Billing
                      </Text>
                      <Badge variant="default">
                        {agreement.billing_frequency}
                      </Badge>
                    </div>

                    {agreement.pricing && (
                      <div className="flex items-center justify-between">
                        <Text variant="small" className="text-gray-600">
                          Pricing
                        </Text>
                        <Text variant="body" className="font-semibold text-green-600">
                          ${agreement.pricing.toLocaleString()}
                        </Text>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {agreement.end_date && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
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
                    </div>
                  )}

                  {/* Expiry Alert */}
                  {expiryAlert && (
                    <div className={`p-2 rounded-lg text-sm mb-3 ${
                      expiryAlert.type === 'error' ? 'bg-red-50 text-red-800' :
                      expiryAlert.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                      'bg-blue-50 text-blue-800'
                    }`}>
                      <div className="flex items-center gap-1">
                        {expiryAlert.type === 'error' ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : expiryAlert.type === 'warning' ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <Calendar className="h-4 w-4" />
                        )}
                        <span>{expiryAlert.message}</span>
                      </div>
                    </div>
                  )}

                  {/* Auto-renewal indicator */}
                  {agreement.auto_renewal && (
                    <div className="mb-3 flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Auto-renewal enabled</span>
                    </div>
                  )}

                  {/* Agreement dates */}
                  <div className="text-xs text-gray-500">
                    <div>Start: {formatDate(agreement.start_date)}</div>
                    {agreement.end_date && (
                      <div>End: {formatDate(agreement.end_date)}</div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAgreement(agreement);
                        setShowAgreementModal(true);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAgreement(agreement);
                        setShowEditModal(true);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {agreementsData?.pagination && agreementsData.pagination.pages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-3 text-sm text-gray-600">
                Page {page} of {agreementsData.pagination.pages}
              </span>
              <Button
                variant="outline"
                disabled={page === agreementsData.pagination.pages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Agreement Detail Dialog */}
      <Dialog open={showAgreementModal} onOpenChange={(open) => !open && setShowAgreementModal(false)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Agreement Details - {selectedAgreement?.title}</DialogTitle>
          </DialogHeader>
        {selectedAgreement && (
          <AgreementDetail
            agreement={selectedAgreement}
            onEdit={() => {
              setShowAgreementModal(false);
              setShowEditModal(true);
            }}
            onClose={() => setShowAgreementModal(false)}
          />
        )}
        </DialogContent>
      </Dialog>

      {/* New Agreement Dialog */}
      <Dialog open={showNewAgreementModal} onOpenChange={(open) => !open && setShowNewAgreementModal(false)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Agreement</DialogTitle>
          </DialogHeader>
        <AgreementForm
          onSuccess={() => {
            setShowNewAgreementModal(false);
          }}
          onCancel={() => setShowNewAgreementModal(false)}
        />
        </DialogContent>
      </Dialog>

      {/* Edit Agreement Dialog */}
      <Dialog open={showEditModal} onOpenChange={(open) => !open && setShowEditModal(false)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Agreement</DialogTitle>
          </DialogHeader>
        {selectedAgreement && (
          <AgreementForm
            agreement={selectedAgreement}
            onSuccess={() => {
              setShowEditModal(false);
            }}
            onCancel={() => setShowEditModal(false)}
          />
        )}
        </DialogContent>
      </Dialog>
    </>
  );
}
