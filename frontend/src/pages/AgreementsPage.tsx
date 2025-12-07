import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AgreementList } from '@/components/agreements/AgreementList';
import { agreementsApi } from '@/lib/agreements-api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  Heading,
  Text,
} from '@/components/ui';
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
          <Heading level={2} className="text-gray-900">
            Service Agreements
          </Heading>
          <Text variant="body" className="text-gray-600 mt-1">
            Manage customer service agreements and contracts
          </Text>
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
                <Text variant="small" className="text-gray-600">
                  Total Agreements
                </Text>
                <Heading level={3} className="text-gray-900">
                  {stats.totalAgreements}
                </Heading>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="small" className="text-gray-600">
                  Active Agreements
                </Text>
                <Heading level={3} className="text-green-600">
                  {stats.activeAgreements}
                </Heading>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="small" className="text-gray-600">
                  Total Value
                </Text>
                <Heading level={3} className="text-gray-900">
                  {formatCurrency(stats.totalValue)}
                </Heading>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text variant="small" className="text-gray-600">
                  Expiring Soon
                </Text>
                <Heading level={3} className="text-yellow-600">
                  {stats.expiredAgreements}
                </Heading>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </Card>
        </div>
      )}

      {/* Expiring Agreements Alert */}
      {!expiringLoading && expiringAgreements && expiringAgreements.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <Heading level={4} className="text-yellow-900">
              Agreements Expiring Soon
            </Heading>
          </div>
          <div className="space-y-2">
            <Text variant="small">
              You have {expiringAgreements.length} agreement(s) expiring in the next 30 days:
            </Text>
            <div className="space-y-1">
              {expiringAgreements.slice(0, 3).map((agreement) => (
                <div key={agreement.id} className="flex items-center justify-between">
                  <Text variant="small" className="font-medium">
                    {agreement.title} - {agreement.account.name}
                  </Text>
                  <Text variant="small" className="text-gray-600">
                    Expires: {new Date(agreement.end_date!).toLocaleDateString()}
                  </Text>
                </div>
              ))}
              {expiringAgreements.length > 3 && (
                <Text variant="small" className="text-gray-600">
                  ...and {expiringAgreements.length - 3} more
                </Text>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Agreements List */}
      <AgreementList />

      {/* Quick Actions */}
      <Card className="p-6">
        <Heading level={4} className="text-gray-900 mb-4">
          Quick Actions
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => navigate('/agreements/create')}
          >
            <Plus className="h-6 w-6 mb-2" />
            <Text variant="small">Create Agreement</Text>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => {
              // TODO: Implement agreement templates
            }}
          >
            <FileText className="h-6 w-6 mb-2" />
            <Text variant="small">Agreement Templates</Text>
          </Button>
          
          <Button
            variant="outline"
            className="h-20 flex flex-col items-center justify-center"
            onClick={() => {
              // TODO: Implement bulk operations
            }}
          >
            <Calendar className="h-6 w-6 mb-2" />
            <Text variant="small">Bulk Operations</Text>
          </Button>
        </div>
      </Card>
    </div>
  );
}
