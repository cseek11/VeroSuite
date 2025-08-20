import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crmApi } from '@/lib/api';
import { queryKeys, invalidateQueries } from '@/lib/queryClient';
import { Location } from '@/types';

// Hook to get all locations
export const useLocations = (search?: string) => {
  return useQuery({
    queryKey: queryKeys.locations.list({ search }),
    queryFn: () => crmApi.accountLocations(''), // This would need to be updated to get all locations
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get locations for a specific account
export const useAccountLocations = (accountId: string) => {
  return useQuery({
    queryKey: queryKeys.locations.byAccount(accountId),
    queryFn: () => crmApi.accountLocations(accountId),
    enabled: !!accountId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get a specific location
export const useLocation = (id: string) => {
  return useQuery({
    queryKey: queryKeys.locations.detail(id),
    queryFn: () => crmApi.accountLocations('').then(locations => 
      locations.find(location => location.id === id)
    ),
    enabled: !!id,
  });
};

// Hook to create a new location
export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (locationData: Partial<Location>) => crmApi.createLocation(locationData),
    onSuccess: (data) => {
      invalidateQueries.locations();
      // Also invalidate the specific account's locations
      if (data.account_id) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.locations.byAccount(data.account_id) 
        });
      }
    },
  });
};

// Hook to update a location
export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { id: string; locationData: Partial<Location> }) => 
      crmApi.createLocation({ ...data.locationData, id: data.id }),
    onSuccess: (data) => {
      invalidateQueries.locations();
      // Also invalidate the specific account's locations
      if (data.account_id) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.locations.byAccount(data.account_id) 
        });
      }
    },
  });
};
