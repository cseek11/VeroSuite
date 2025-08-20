import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/lib/api';
import { queryKeys, invalidateQueries } from '@/lib/queryClient';
import { Job, JobEvent } from '@/types';

// Hook to get today's jobs
export const useTodayJobs = (technicianId?: string) => {
  return useQuery({
    queryKey: queryKeys.jobs.today(technicianId),
    queryFn: () => jobsApi.today(technicianId),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to get a specific job
export const useJob = (id: string) => {
  return useQuery({
    queryKey: queryKeys.jobs.detail(id),
    queryFn: () => jobsApi.get(id),
    enabled: !!id,
  });
};

// Hook to create a new job
export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobData: Partial<Job>) => jobsApi.create(jobData),
    onSuccess: () => {
      // Invalidate and refetch jobs lists
      invalidateQueries.jobs();
    },
  });
};

// Hook to assign a job to a technician
export const useAssignJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { job_id: string; technician_id: string }) => 
      jobsApi.assign(data),
    onSuccess: () => {
      invalidateQueries.jobs();
    },
  });
};

// Hook to start a job
export const useStartJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { id: string; gps: { lat: number; lng: number } }) =>
      jobsApi.start(data.id, data.gps),
    onSuccess: () => {
      invalidateQueries.jobs();
    },
  });
};

// Hook to complete a job
export const useCompleteJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { id: string; payload: any }) =>
      jobsApi.complete(data.id, data.payload),
    onSuccess: () => {
      invalidateQueries.jobs();
    },
  });
};

// Hook to get jobs with filters
export const useJobs = (filters?: Record<string, any>) => {
  return useQuery({
    queryKey: queryKeys.jobs.list(filters || {}),
    queryFn: () => jobsApi.today(), // This would need to be updated to support filters
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
