import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmApi } from '@/lib/api';
import { queryKeys, invalidateQueries } from '@/lib/queryClient';
import { Account } from '@/types';

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
    queryFn: () => crmApi.accounts().then(accounts => 
      accounts.find(account => account.id === id)
    ),
    enabled: !!id,
  });
};

// Hook to create a new account
export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (accountData: Partial<Account>) => crmApi.createAccount(accountData),
    onSuccess: () => {
      invalidateQueries.accounts();
    },
  });
};

// Hook to update an account
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { id: string; accountData: Partial<Account> }) => 
      crmApi.createAccount({ ...data.accountData, id: data.id }),
    onSuccess: () => {
      invalidateQueries.accounts();
    },
  });
};
