import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AgreementList } from '@/components/agreements/AgreementList';
import { agreementsApi } from '@/lib/agreements-api';
import {
  Card,
  Typography,
  Button,
  Chip,
  Alert,
} from '@/components/ui/EnhancedUI';
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Calendar,
  Plus,
} from 'lucide-react';

export default function AgreementsPage() {
  const navigate = useNavigate();

  // Fetch agreement statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['agreement-stats'],
    queryFn: () => agreementsApi.getAgreementStats(),
  });

  // Fetch expiring agreements
  const { data: expiringAgreements, isLoading: expiringLoading } = useQuery({
    queryKey: ['expiring-agreements'],
    queryFn: () => agreementsApi.getExpiringAgreements(30),
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h2" className="text-gray-900">
            Service Agreements
          </Typography>
          <Typography variant="body1" className="text-gray-600 mt-1">
            Manage customer service agreements and contracts
          </Typography>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate('/agreements/create')}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Agreement
        </Button>
      </div>

      {/* Statistics Cards */}
      {!statsLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600">
                  Total Agreements
                </Typography>
                <Typography variant="h3" className="text-gray-900">
                  {stats.totalAgreements}
                </Typography>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600">
                  Active Agreements
                </Typography>
                <Typography variant="h3" className="text-green-600">
                  {stats.activeAgreements}
                </Typography>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600">
                  Total Value
                </Typography>
                <Typography variant="h3" className="text-gray-900">
                  {formatCurrency(stats.totalValue)}
                </Typography>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600">
                  Expiring Soon
                </Typography>
                <Typography variant="h3" className="text-yellow-600">
                  {stats.expiredAgreements}
                </Typography>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </Card>
        </div>
      )}

      {/* Expiring Agreements Alert */}
      {!expiringLoading && expiringAgreements && expiringAgreements.length > 0 && (
        <Alert type="warning" title="Agreements Expiring Soon">
          <div className="space-y-2">
            <Typography variant="body2">
              You have {expiringAgreements.length} agreement(s) expiring in the next 30 days:
            </Typography>
            <div className="space-y-1">
              {expiringAgreements.slice(0, 3).map((agreement) => (
                <div key={agreement.id} className="flex items-center justify-between">
                  <Typography variant="body2" className="font-medium">
                    {agreement.title} - {agreement.accounts.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Expires: {new Date(agreement.end_date!).toLocaleDateString()}
                  </Typography>
                </div>
              ))}
              {expiringAgreements.length > 3 && (
                <Typography variant="body2" className="text-gray-600">
                  ...and {expiringAgreements.length - 3} more
                </Typography>
              )}
            </div>
          </div>
        </Alert>
      )}

      {/* Agreements List */}
      <AgreementList />

      {/* Quick Actions */}
      <Card className="p-6">
        <Typography variant="h4" className="text-gray-900 mb-4">
          Quick Actions
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => navigate('/agreements/create')}
          >
            <Plus className="h-6 w-6 mb-2" />
            <Typography variant="body2">Create Agreement</Typography>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => {
              // TODO: Implement agreement templates
              console.log('Agreement templates not yet implemented');
            }}
          >
            <FileText className="h-6 w-6 mb-2" />
            <Typography variant="body2">Agreement Templates</Typography>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => {
              // TODO: Implement bulk operations
              console.log('Bulk operations not yet implemented');
            }}
          >
            <Calendar className="h-6 w-6 mb-2" />
            <Typography variant="body2">Bulk Operations</Typography>
          </Button>
        </div>
      </Card>
    </div>
  );
}
