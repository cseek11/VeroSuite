import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Button,
  Typography,
  Chip,
  Modal,
  ProgressBar,
  Alert
} from '@/components/ui/EnhancedUI';
import {
  FileText,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Plus
} from 'lucide-react';

interface Contract {
  id: string;
  contract_type: string;
  service_frequency: string;
  start_date: string;
  end_date?: string;
  auto_renewal: boolean;
  contract_value: number;
  payment_schedule: string;
  status: string;
  signed_date?: string;
}

interface ContractManagerProps {
  contracts: Contract[];
  customerId: string;
  isLoading: boolean;
}

export default function ContractManager({ contracts, customerId, isLoading }: ContractManagerProps) {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showNewContractModal, setShowNewContractModal] = useState(false);
  const queryClient = useQueryClient();

  const updateContract = useMutation({
    mutationFn: (data: Partial<Contract>) => {
      // Mock API call
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'customer', customerId, 'contracts'] });
      setShowContractModal(false);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'green';
      case 'expired': return 'red';
      case 'cancelled': return 'gray';
      case 'pending': return 'yellow';
      default: return 'gray';
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'monthly': return 'blue';
      case 'quarterly': return 'purple';
      case 'annual': return 'green';
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

  const calculateProgress = (contract: Contract) => {
    if (!contract.end_date) return 0;
    const start = new Date(contract.start_date).getTime();
    const end = new Date(contract.end_date).getTime();
    const now = new Date().getTime();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const getDaysUntilRenewal = (contract: Contract) => {
    if (!contract.end_date) return null;
    const end = new Date(contract.end_date);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getRenewalAlert = (contract: Contract) => {
    const daysUntilRenewal = getDaysUntilRenewal(contract);
    if (!daysUntilRenewal) return null;
    
    if (daysUntilRenewal < 0) {
      return { type: 'error', message: 'Contract expired' };
    } else if (daysUntilRenewal <= 30) {
      return { type: 'warning', message: `Renews in ${daysUntilRenewal} days` };
    } else if (daysUntilRenewal <= 90) {
      return { type: 'info', message: `Renews in ${daysUntilRenewal} days` };
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Typography variant="body1" className="text-gray-600">
            Loading contracts...
          </Typography>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h3" className="text-gray-900">
            Contract Management
          </Typography>
          <Button
            variant="primary"
            onClick={() => setShowNewContractModal(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            New Contract
          </Button>
        </div>

        {contracts.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <Typography variant="h4" className="text-gray-900 mb-2">
              No Contracts
            </Typography>
            <Typography variant="body1" className="text-gray-600 mb-4">
              This customer doesn't have any contracts yet.
            </Typography>
            <Button
              variant="outline"
              onClick={() => setShowNewContractModal(true)}
            >
              Create First Contract
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.map((contract) => {
              const progress = calculateProgress(contract);
              const renewalAlert = getRenewalAlert(contract);
              
              return (
                <div
                  key={contract.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedContract(contract);
                    setShowContractModal(true);
                  }}
                >
                  {/* Contract Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <Typography variant="h5" className="text-gray-900">
                        {contract.contract_type}
                      </Typography>
                    </div>
                    <Chip
                      color={getStatusColor(contract.status)}
                      variant="default"
                    >
                      {contract.status}
                    </Chip>
                  </div>

                  {/* Contract Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <Typography variant="body2" className="text-gray-600">
                        Service Frequency
                      </Typography>
                      <Chip
                        color={getContractTypeColor(contract.service_frequency)}
                        variant="default"
                      >
                        {contract.service_frequency}
                      </Chip>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Typography variant="body2" className="text-gray-600">
                        Contract Value
                      </Typography>
                      <Typography variant="body1" className="font-semibold text-green-600">
                        ${contract.contract_value.toLocaleString()}
                      </Typography>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Typography variant="body2" className="text-gray-600">
                        Payment Schedule
                      </Typography>
                      <Typography variant="body2" className="text-gray-900">
                        {contract.payment_schedule}
                      </Typography>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {contract.end_date && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <Typography variant="body2" className="text-gray-600">
                          Contract Progress
                        </Typography>
                        <Typography variant="body2" className="text-gray-900">
                          {Math.round(progress)}%
                        </Typography>
                      </div>
                      <ProgressBar
                        value={progress}
                        color={progress > 80 ? 'red' : progress > 60 ? 'yellow' : 'green'}
                        className="h-2"
                      />
                    </div>
                  )}

                  {/* Renewal Alert */}
                  {renewalAlert && (
                    <div className={`p-2 rounded-lg text-sm ${
                      renewalAlert.type === 'error' ? 'bg-red-50 text-red-800' :
                      renewalAlert.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                      'bg-blue-50 text-blue-800'
                    }`}>
                      <div className="flex items-center gap-1">
                        {renewalAlert.type === 'error' ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : renewalAlert.type === 'warning' ? (
                          <Clock className="h-4 w-4" />
                        ) : (
                          <Calendar className="h-4 w-4" />
                        )}
                        <span>{renewalAlert.message}</span>
                      </div>
                    </div>
                  )}

                  {/* Auto-renewal indicator */}
                  {contract.auto_renewal && (
                    <div className="mt-3 flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Auto-renewal enabled</span>
                    </div>
                  )}

                  {/* Contract dates */}
                  <div className="mt-3 text-xs text-gray-500">
                    <div>Start: {formatDate(contract.start_date)}</div>
                    {contract.end_date && (
                      <div>End: {formatDate(contract.end_date)}</div>
                    )}
                    {contract.signed_date && (
                      <div>Signed: {formatDate(contract.signed_date)}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Contract Detail Modal */}
      <Modal
        isOpen={showContractModal}
        onClose={() => setShowContractModal(false)}
        title={`Contract Details - ${selectedContract?.contract_type}`}
        size="lg"
      >
        {selectedContract && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="body2" className="text-gray-600">Contract Type</Typography>
                <Typography variant="body1">{selectedContract.contract_type}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Status</Typography>
                <Chip color={getStatusColor(selectedContract.status)}>
                  {selectedContract.status}
                </Chip>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Service Frequency</Typography>
                <Typography variant="body1">{selectedContract.service_frequency}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Contract Value</Typography>
                <Typography variant="body1">${selectedContract.contract_value.toLocaleString()}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Payment Schedule</Typography>
                <Typography variant="body1">{selectedContract.payment_schedule}</Typography>
              </div>
              <div>
                <Typography variant="body2" className="text-gray-600">Auto-renewal</Typography>
                <Typography variant="body1">
                  {selectedContract.auto_renewal ? 'Enabled' : 'Disabled'}
                </Typography>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="body2" className="text-gray-600">Start Date</Typography>
                <Typography variant="body1">{formatDate(selectedContract.start_date)}</Typography>
              </div>
              {selectedContract.end_date && (
                <div>
                  <Typography variant="body2" className="text-gray-600">End Date</Typography>
                  <Typography variant="body1">{formatDate(selectedContract.end_date)}</Typography>
                </div>
              )}
              {selectedContract.signed_date && (
                <div>
                  <Typography variant="body2" className="text-gray-600">Signed Date</Typography>
                  <Typography variant="body1">{formatDate(selectedContract.signed_date)}</Typography>
                </div>
              )}
            </div>

            {/* Renewal Alert */}
            {getRenewalAlert(selectedContract) && (
              <Alert
                type={getRenewalAlert(selectedContract)?.type as any}
                title="Renewal Notice"
              >
                {getRenewalAlert(selectedContract)?.message}
              </Alert>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowContractModal(false)}
              >
                Close
              </Button>
              <Button>
                <Edit className="h-4 w-4 mr-1" />
                Edit Contract
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Contract Modal */}
      <Modal
        isOpen={showNewContractModal}
        onClose={() => setShowNewContractModal(false)}
        title="Create New Contract"
        size="lg"
      >
        <div className="space-y-6">
          <Typography variant="body1" className="text-gray-600">
            Contract creation functionality will be implemented in Phase 2.
          </Typography>
          
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowNewContractModal(false)}
            >
              Cancel
            </Button>
            <Button disabled>
              Create Contract
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}



