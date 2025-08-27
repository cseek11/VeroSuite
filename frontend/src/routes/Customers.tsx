import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmApi, supabase } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputMask from 'react-input-mask';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import CustomerDashboard from '@/components/crm/CustomerDashboard';
import {
  Typography,
  Button,
  Card,
  Input,
  Alert,
  Tooltip
} from '@/components/ui/EnhancedUI';
import {
  Users,
  Search,
  Plus,
  MapPin,
  Building,
  RefreshCw,
  UserPlus,
  ArrowLeft,
  Eye,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { AGREEMENT_CONFIG, AgreementType, AccountWithAgreements } from '@/types/agreements';

const AccountSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  account_type: z.enum(['commercial', 'residential']),
});

type AccountForm = z.infer<typeof AccountSchema>;





// Agreement Indicator Component
const AgreementIndicator = ({ agreementType }: { agreementType: AgreementType }) => {
  const config = AGREEMENT_CONFIG[agreementType];
  if (!config) return null;
  
  return (
    <Tooltip content={config.tooltip}>
      <div className={`w-4 h-4 rounded-full ${config.color} flex items-center justify-center shadow-sm`}>
        <Shield className="w-3 h-3 text-white" />
      </div>
      
    </Tooltip>
  );
};

// Agreement Indicators Container
const AgreementIndicators = ({ customer }: { customer: any }) => {
  const agreements = customer.agreements || [];
  const overdueDays = customer.overdue_days || 0;
  const isOverdue = overdueDays > 30;
  
  console.log('AgreementIndicators render:', { 
    customerName: customer.name, 
    agreements, 
    overdueDays, 
    isOverdue 
  });
  
  // Always show something for testing
  return (
    <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
      {/* Debug info - always visible */}
      <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
        Debug: {agreements.length} agreements, {overdueDays} days overdue
      </div>
      
      {/* Agreement Indicators */}
      {agreements.length > 0 && (
        <div className="flex gap-1 flex-wrap justify-end max-w-20">
          {agreements.map((agreementType, index: number) => (
            <AgreementIndicator key={index} agreementType={agreementType as AgreementType} />
          ))}
        </div>
      )}
      
      {/* Overdue Badge */}
      {isOverdue && (
        <Tooltip content={`${overdueDays} days past due`}>
          <div className="flex items-center gap-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            <span>Overdue</span>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default function Customers() {
  console.log('Customers component is rendering!');
  
  const [search, setSearch] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isCompactMode, setIsCompactMode] = useState(false);

  const qc = useQueryClient();

  const { data: accounts, isLoading, isError } = useQuery({
    queryKey: ['crm', 'accounts', search],
    queryFn: () => crmApi.accounts(search),
  });

  // Debug logging for accounts
  console.log('Fetched accounts:', accounts);
  console.log('Accounts length:', accounts?.length);
  console.log('AccountDetails query enabled:', !!accounts && accounts.length > 0);

  // Get agreement and payment data for all accounts
  const { data: accountDetails } = useQuery({
    queryKey: ['crm', 'account-details', accounts?.length],
    queryFn: async () => {
      if (!accounts) return [];
      
      console.log('Starting to fetch account details for', accounts.length, 'accounts');
      
      const details = await Promise.all(
        accounts.map(async (account) => {
          try {
            console.log(`Fetching details for account: ${account.name} (${account.id})`);
            
            // Get active agreements for this account
            const { data: agreements, error: agreementsError } = await supabase
              .from('agreements')
              .select('agreement_type')
              .eq('account_id', account.id)
              .eq('status', 'active');
            
            if (agreementsError) {
              console.error(`Error fetching agreements for account ${account.id}:`, agreementsError);
            } else {
              console.log(`Found ${agreements?.length || 0} agreements for ${account.name}:`, agreements);
            }
            
            // Get overdue payments for this account
            const { data: payments, error: paymentsError } = await supabase
              .from('payments')
              .select('overdue_days')
              .eq('account_id', account.id)
              .eq('status', 'overdue');
            
            if (paymentsError) {
              console.error(`Error fetching payments for account ${account.id}:`, paymentsError);
            } else {
              console.log(`Found ${payments?.length || 0} overdue payments for ${account.name}:`, payments);
            }
            
            // Calculate max overdue days
            const maxOverdueDays = payments && payments.length > 0 
              ? Math.max(...payments.map(p => p.overdue_days || 0))
              : 0;
            
            const result = {
              accountId: account.id,
              agreements: agreements?.map(a => a.agreement_type) || [],
              overdue_days: maxOverdueDays
            };
            
            console.log(`Final result for ${account.name}:`, result);
            return result;
          } catch (error) {
            console.error(`Error getting details for account ${account.id}:`, error);
            return { accountId: account.id, agreements: [], overdue_days: 0 };
          }
        })
      );
      
      console.log('All account details:', details);
      return details;
    },
    enabled: !!accounts && accounts.length > 0,
  });

  // Combine accounts with their agreement data
  const data = accounts?.map(account => {
    const details = accountDetails?.find(d => d.accountId === account.id);
    const combinedData = {
      ...account,
      agreements: details?.agreements || [],
      overdue_days: details?.overdue_days || 0
    };
    
    // Debug logging
    if (combinedData.agreements.length > 0 || combinedData.overdue_days > 0) {
      console.log(`Account ${account.name}:`, {
        agreements: combinedData.agreements,
        overdue_days: combinedData.overdue_days
      });
    }
    
    return combinedData;
  }) || [];

  console.log('Final combined data:', data);

  const createAccount = useMutation({
    mutationFn: (accountData: AccountForm) => crmApi.createAccount(accountData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm', 'accounts'] });
    },
  });

  const createLocation = useMutation({
    mutationFn: (locationData: any) => crmApi.createLocation(locationData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['crm', 'accounts'] });
    },
  });



  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AccountForm>({
    resolver: zodResolver(AccountSchema)
  });

  const onSubmit = (values: AccountForm) => createAccount.mutate(values);

  // If a customer is selected, show the detailed dashboard
  if (selectedCustomerId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedCustomerId(null)}
              className="flex items-center gap-2 mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Customers
            </Button>
          </div>
          <CustomerDashboard customerId={selectedCustomerId} />
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          {/* Header */}
          <div className="mb-8">
            <Typography variant="h1" className="text-gray-900">
              Customers
            </Typography>
            <Typography variant="body1" className="text-gray-600 mt-2">
              Manage your customer accounts and locations
            </Typography>
          </div>

          {/* Search and Actions Bar */}
          <div className={`flex flex-col sm:flex-row gap-4 mb-6 ${isCompactMode ? 'mb-4' : 'mb-6'}`}>
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers..."
                  value={search}
                  onChange={setSearch}
                  className={`pl-10 ${isCompactMode ? 'h-9 px-3 text-sm' : ''}`}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size={isCompactMode ? "sm" : "md"}
                onClick={() => setIsCompactMode(!isCompactMode)}
                className={`flex items-center gap-2 ${isCompactMode ? 'h-9 px-3 text-sm' : ''}`}
              >
                {isCompactMode ? 'Standard View' : 'Compact View'}
              </Button>

              <Button
                variant="primary"
                size={isCompactMode ? "sm" : "md"}
                className={`flex items-center gap-2 ${isCompactMode ? 'h-10 px-4 text-sm' : ''}`}
              >
                <UserPlus className="h-4 w-4" />
                New Customer
              </Button>
            </div>
          </div>

          {/* New Account Form */}
          <Card className="p-6 mb-6">
            <Typography variant="h6" className="text-gray-900 mb-4">
              New Account
            </Typography>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Name
                  </label>
                  <input
                    {...register('name')}
                    placeholder="Enter account name"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Type
                  </label>
                  <select 
                    {...register('account_type')}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="commercial">Commercial</option>
                    <option value="residential">Residential</option>
                  </select>
                  {errors.account_type && (
                    <p className="text-sm text-red-600 mt-1">{errors.account_type.message as string}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <InputMask 
                    mask="(999) 999-9999" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <InputMask 
                    mask="99999" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="15222"
                  />
                </div>
              </div>
              
              <Button
                variant="primary"
                disabled={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {isSubmitting ? 'Creating...' : 'Create Account'}
              </Button>
            </form>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <LoadingSpinner text="Loading customers..." />
            </div>
          )}

          {/* Error State */}
          {isError && (
            <Alert type="danger" className="mb-6">
              <Typography variant="body2">
                Failed to load customers
              </Typography>
            </Alert>
          )}

          {/* Customers List */}
          {!isLoading && Array.isArray(data) && (
            <div className={isCompactMode ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3" : "space-y-4"}>
              {data.length === 0 ? (
                <Card className={isCompactMode ? "p-4 text-center" : "p-8 text-center"}>
                  <Users className={`${isCompactMode ? 'h-8 w-8' : 'h-12 w-12'} text-gray-400 mx-auto mb-4`} />
                  <Typography variant={isCompactMode ? "body1" : "h6"} className="text-gray-900 mb-2">
                    No Customers Found
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    {search ? 'No customers match your search criteria.' : 'No customers have been added yet.'}
                  </Typography>
                </Card>
              ) : (
                data.map((acc: any) => {
                  const isOverdue = (acc.overdue_days || 0) > 30;
                  
                  return (
                    <Card 
                      key={acc.id} 
                      className={`${isCompactMode ? 'py-3 px-4' : 'p-6'} hover:shadow-lg transition-shadow relative ${
                        isOverdue ? 'border-2 border-red-500' : ''
                      }`}
                    >
                      <AgreementIndicators customer={acc} />
                      
                      {isCompactMode ? (
                        // Compact Layout
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-blue-500" />
                            <Typography variant="body1" className="text-gray-900 font-semibold truncate">
                              {acc.name}
                            </Typography>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <MapPin className="h-3 w-3" />
                              <span>{acc.locations?.length || 0} locations</span>
                            </div>
                            
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              acc.account_type === 'commercial' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {acc.account_type}
                            </span>
                          </div>
                          
                          <div className="flex gap-1">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setSelectedCustomerId(acc.id)}
                              className="flex items-center gap-1 h-8 px-2 text-xs"
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Standard Layout
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Building className="h-5 w-5 text-blue-500" />
                              <Typography variant="h6" className="text-gray-900">
                                {acc.name}
                              </Typography>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                acc.account_type === 'commercial' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {acc.account_type}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{acc.locations?.length || 0} locations</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setSelectedCustomerId(acc.id)}
                              className="flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => qc.invalidateQueries({ queryKey: ['crm', 'account', acc.id, 'locations'] })}
                            >
                              Refresh Locations
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => createLocation.mutate({ 
                                account_id: acc.id, 
                                name: 'New Site', 
                                address_line1: '100 Test St', 
                                city: 'Pittsburgh', 
                                state: 'PA', 
                                postal_code: '15222' 
                              })}
                              disabled={createLocation.isPending}
                            >
                              {createLocation.isPending ? 'Adding...' : '+ Location'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
  );
}
