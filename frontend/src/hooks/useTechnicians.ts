import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { technicianApi } from '../lib/technician-api';
import { 
  CreateTechnicianProfileDto, 
  UpdateTechnicianProfileDto,
  TechnicianQueryParams 
} from '../types/technician';

// Query keys
export const technicianKeys = {
  all: ['technicians'] as const,
  lists: () => [...technicianKeys.all, 'list'] as const,
  list: (params: TechnicianQueryParams) => [...technicianKeys.lists(), params] as const,
  details: () => [...technicianKeys.all, 'detail'] as const,
  detail: (id: string) => [...technicianKeys.details(), id] as const,
};

// Get technicians list
export function useTechnicians(params: TechnicianQueryParams = {}) {
  return useQuery({
    queryKey: technicianKeys.list(params),
    queryFn: () => technicianApi.getTechnicians(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single technician
export function useTechnician(id: string) {
  return useQuery({
    queryKey: technicianKeys.detail(id),
    queryFn: () => technicianApi.getTechnician(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Create technician
export function useCreateTechnician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTechnicianProfileDto) => technicianApi.createTechnician(data),
    onSuccess: () => {
      // Invalidate and refetch technicians list
      queryClient.invalidateQueries({ queryKey: technicianKeys.lists() });
    },
  });
}

// Update technician
export function useUpdateTechnician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTechnicianProfileDto }) => 
      technicianApi.updateTechnician(id, data),
    onSuccess: (updatedTechnician) => {
      // Update the specific technician in cache
      queryClient.setQueryData(
        technicianKeys.detail(updatedTechnician.id),
        updatedTechnician
      );
      // Invalidate and refetch technicians list
      queryClient.invalidateQueries({ queryKey: technicianKeys.lists() });
    },
  });
}

// Delete technician
export function useDeleteTechnician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => technicianApi.deleteTechnician(id),
    onSuccess: (_, deletedId) => {
      // Remove the technician from cache
      queryClient.removeQueries({ queryKey: technicianKeys.detail(deletedId) });
      // Invalidate and refetch technicians list
      queryClient.invalidateQueries({ queryKey: technicianKeys.lists() });
    },
  });
}

// Get dashboard stats
export function useTechnicianDashboardStats() {
  return useQuery({
    queryKey: [...technicianKeys.all, 'dashboard', 'stats'],
    queryFn: () => technicianApi.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get performance metrics
export function useTechnicianPerformanceMetrics() {
  return useQuery({
    queryKey: [...technicianKeys.all, 'dashboard', 'performance'],
    queryFn: () => technicianApi.getPerformanceMetrics(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Get availability data
export function useTechnicianAvailabilityData() {
  return useQuery({
    queryKey: [...technicianKeys.all, 'dashboard', 'availability'],
    queryFn: () => technicianApi.getAvailabilityData(),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

