import { useQuery, useMutation } from '@tanstack/react-query';
import { queryKeys, invalidateQueries } from '@/lib/queryClient';
import { Account } from '@/types';
import { logger } from '@/utils/logger';

// TODO: Implement accounts API in enhanced API
// For now, using placeholder functions
const crmApi = {
  accounts: async (_search?: string): Promise<Account[]> => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('TODO: Implement accounts API in enhanced API', {}, 'useAccounts');
    }
    return [];
  },
  createAccount: async (_accountData: Partial<Account>) => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('TODO: Implement accounts API in enhanced API', {}, 'useAccounts');
    }
    return null;
  }
};

// Hook to get all accounts
export const useAccounts = (search?: string) => {
  return useQuery({
    queryKey: queryKeys.accounts.list({ search }),
    queryFn: () => crmApi.accounts(search),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get a specific account
export const useAccount = (id: string) => {
  return useQuery({
    queryKey: queryKeys.accounts.detail(id),
    queryFn: async () => {
      const accounts = await crmApi.accounts();
      return accounts.find(account => account.id === id) ?? null;
    },
    enabled: !!id,
  });
};

// Hook to create a new account
export const useCreateAccount = () => {
  return useMutation({
    mutationFn: (accountData: Partial<Account>) => crmApi.createAccount(accountData),
    onSuccess: () => {
      invalidateQueries.accounts();
    },
  });
};

// Hook to update an account
export const useUpdateAccount = () => {
  
  return useMutation({
    mutationFn: (data: { id: string; accountData: Partial<Account> }) => 
      crmApi.createAccount({ ...data.accountData, id: data.id }),
    onSuccess: () => {
      invalidateQueries.accounts();
    },
  });
};
