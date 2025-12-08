import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, invalidateQueries } from '@/lib/queryClient';
import { Location } from '@/types';
import { logger } from '@/utils/logger';

// TODO: Implement locations API in enhanced API
// For now, using placeholder functions
const crmApi = {
  accountLocations: async (_accountId: string) => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('TODO: Implement locations API in enhanced API', {}, 'useLocations');
    }
    return [];
  },
  createLocation: async (_locationData: Partial<Location>) => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('TODO: Implement locations API in enhanced API', {}, 'useLocations');
    }
    return null;
  }
};

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
    queryFn: async () => {
      const locations = await crmApi.accountLocations("") as Location[];
      return locations.find((location: Location) => location.id === id) ?? null;
    },
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
      if (!data) return;
      const accountId = (data as Partial<Location> & { account_id?: string })?.account_id;
      if (accountId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.locations.byAccount(accountId) 
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
      if (!data) return;
      const accountId = (data as Partial<Location> & { account_id?: string })?.account_id;
      if (accountId) {
        queryClient.invalidateQueries({ 
          queryKey: queryKeys.locations.byAccount(accountId) 
        });
      }
    },
  });
};
