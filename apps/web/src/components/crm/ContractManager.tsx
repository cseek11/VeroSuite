import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  isLoading: boolean;
}

export default function ContractManager({ contracts, isLoading }: ContractManagerProps) {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showNewContractModal, setShowNewContractModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getContractTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'monthly': return 'bg-blue-100 text-blue-800';
      case 'quarterly': return 'bg-purple-100 text-purple-800';
      case 'annual': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <Text variant="body" className="text-slate-600">
            Loading contracts...
          </Text>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Heading level={3} className="text-slate-900">
            Contract Management
          </Heading>
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
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <Heading level={4} className="text-slate-900 mb-2">
              No Contracts
            </Heading>
            <Text variant="body" className="text-slate-600 mb-4">
              This customer doesn't have any contracts yet.
            </Text>
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
                  className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedContract(contract);
                    setShowContractModal(true);
                  }}
                >
                  {/* Contract Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <Heading level={4} className="text-slate-900">
                        {contract.contract_type}
                      </Heading>
                    </div>
                    <Badge
                      variant="default"
                      className={getStatusColor(contract.status)}
                    >
                      {contract.status}
                    </Badge>
                  </div>

                  {/* Contract Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <Text variant="small" className="text-slate-600">
                        Service Frequency
                      </Text>
                      <Badge
                        variant="default"
                        className={getContractTypeColor(contract.service_frequency)}
                      >
                        {contract.service_frequency}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Text variant="small" className="text-slate-600">
                        Contract Value
                      </Text>
                      <Text variant="body" className="font-semibold text-green-600">
                        ${contract.contract_value.toLocaleString()}
                      </Text>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Text variant="small" className="text-slate-600">
                        Payment Schedule
                      </Text>
                      <Text variant="small" className="text-slate-900">
                        {contract.payment_schedule}
                      </Text>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {contract.end_date && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <Text variant="small" className="text-slate-600">
                          Contract Progress
                        </Text>
                        <Text variant="small" className="text-slate-900">
                          {Math.round(progress)}%
                        </Text>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            progress > 80 ? 'bg-red-500' : progress > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
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
                  <div className="mt-3 text-xs text-slate-500">
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
      <Dialog open={showContractModal} onOpenChange={(open) => !open && setShowContractModal(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{`Contract Details - ${selectedContract?.contract_type}`}</DialogTitle>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text variant="small" className="text-slate-600">Contract Type</Text>
                  <Text variant="body">{selectedContract.contract_type}</Text>
                </div>
                <div>
                  <Text variant="small" className="text-slate-600">Status</Text>
                  <Badge variant="default" className={getStatusColor(selectedContract.status)}>
                    {selectedContract.status}
                  </Badge>
                </div>
                <div>
                  <Text variant="small" className="text-slate-600">Service Frequency</Text>
                  <Text variant="body">{selectedContract.service_frequency}</Text>
                </div>
                <div>
                  <Text variant="small" className="text-slate-600">Contract Value</Text>
                  <Text variant="body">${selectedContract.contract_value.toLocaleString()}</Text>
                </div>
                <div>
                  <Text variant="small" className="text-slate-600">Payment Schedule</Text>
                  <Text variant="body">{selectedContract.payment_schedule}</Text>
                </div>
                <div>
                  <Text variant="small" className="text-slate-600">Auto-renewal</Text>
                  <Text variant="body">
                    {selectedContract.auto_renewal ? 'Enabled' : 'Disabled'}
                  </Text>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text variant="small" className="text-slate-600">Start Date</Text>
                  <Text variant="body">{formatDate(selectedContract.start_date)}</Text>
                </div>
                {selectedContract.end_date && (
                  <div>
                    <Text variant="small" className="text-slate-600">End Date</Text>
                    <Text variant="body">{formatDate(selectedContract.end_date)}</Text>
                  </div>
                )}
                {selectedContract.signed_date && (
                  <div>
                    <Text variant="small" className="text-slate-600">Signed Date</Text>
                    <Text variant="body">{formatDate(selectedContract.signed_date)}</Text>
                  </div>
                )}
              </div>

              {/* Renewal Alert */}
              {getRenewalAlert(selectedContract) && (
                <div className={`p-4 rounded-lg border ${
                  getRenewalAlert(selectedContract)?.type === 'error' 
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : getRenewalAlert(selectedContract)?.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}>
                  <div className="font-semibold mb-1">Renewal Notice</div>
                  <div>{getRenewalAlert(selectedContract)?.message}</div>
                </div>
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
        </DialogContent>
      </Dialog>

      {/* New Contract Modal */}
      <Dialog open={showNewContractModal} onOpenChange={(open) => !open && setShowNewContractModal(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Contract</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Text variant="body" className="text-slate-600">
              Contract creation functionality will be implemented in Phase 2.
            </Text>
            
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
        </DialogContent>
      </Dialog>
    </>
  );
}







