// ============================================================================
// VeroField Mobile App - Jobs Hook
// ============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Job, AppError } from '../types';
import jobsService from '../services/jobsService';
import { useAuth } from './useAuth';

export const useJobs = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Get today's jobs
  const {
    data: jobs = [],
    isLoading: isLoadingJobs,
    error: jobsError,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: ['jobs', 'today'],
    queryFn: () => jobsService.getTodaysJobs(),
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  });

  // Start job mutation
  const startJobMutation = useMutation({
    mutationFn: (jobId: string) => jobsService.startJob(jobId),
    onSuccess: (updatedJob) => {
      // Update the job in the cache
      queryClient.setQueryData(['jobs', 'today'], (oldJobs: Job[] = []) =>
        oldJobs.map(job => job.id === updatedJob.id ? updatedJob : job)
      );
      
      // Invalidate job details if it's cached
      queryClient.invalidateQueries({ queryKey: ['job', updatedJob.id] });
    },
    onError: (error: AppError) => {
      console.error('Error starting job:', error);
    },
  });

  // Complete job mutation
  const completeJobMutation = useMutation({
    mutationFn: ({ jobId, completionData }: { 
      jobId: string; 
      completionData: {
        notes?: string;
        signature?: string;
        photos?: string[];
        chemicals_used?: any[];
      };
    }) => jobsService.completeJob(jobId, completionData),
    onSuccess: (updatedJob) => {
      // Update the job in the cache
      queryClient.setQueryData(['jobs', 'today'], (oldJobs: Job[] = []) =>
        oldJobs.map(job => job.id === updatedJob.id ? updatedJob : job)
      );
      
      // Invalidate job details if it's cached
      queryClient.invalidateQueries({ queryKey: ['job', updatedJob.id] });
    },
    onError: (error: AppError) => {
      console.error('Error completing job:', error);
    },
  });

  // Update job status mutation
  const updateJobStatusMutation = useMutation({
    mutationFn: ({ jobId, status }: { jobId: string; status: string }) =>
      jobsService.updateJobStatus(jobId, status),
    onSuccess: (updatedJob) => {
      // Update the job in the cache
      queryClient.setQueryData(['jobs', 'today'], (oldJobs: Job[] = []) =>
        oldJobs.map(job => job.id === updatedJob.id ? updatedJob : job)
      );
      
      // Invalidate job details if it's cached
      queryClient.invalidateQueries({ queryKey: ['job', updatedJob.id] });
    },
    onError: (error: AppError) => {
      console.error('Error updating job status:', error);
    },
  });

  // Add job notes mutation
  const addJobNotesMutation = useMutation({
    mutationFn: ({ jobId, notes }: { jobId: string; notes: string }) =>
      jobsService.addJobNotes(jobId, notes),
    onSuccess: (updatedJob) => {
      // Update the job in the cache
      queryClient.setQueryData(['jobs', 'today'], (oldJobs: Job[] = []) =>
        oldJobs.map(job => job.id === updatedJob.id ? updatedJob : job)
      );
      
      // Invalidate job details if it's cached
      queryClient.invalidateQueries({ queryKey: ['job', updatedJob.id] });
    },
    onError: (error: AppError) => {
      console.error('Error adding job notes:', error);
    },
  });

  // Actions
  const startJob = (jobId: string) => {
    startJobMutation.mutate(jobId);
  };

  const completeJob = (jobId: string, completionData: {
    notes?: string;
    signature?: string;
    photos?: string[];
    chemicals_used?: any[];
  }) => {
    completeJobMutation.mutate({ jobId, completionData });
  };

  const updateJobStatus = (jobId: string, status: string) => {
    updateJobStatusMutation.mutate({ jobId, status });
  };

  const addJobNotes = (jobId: string, notes: string) => {
    addJobNotesMutation.mutate({ jobId, notes });
  };

  return {
    // Data
    jobs,
    isLoadingJobs,
    jobsError,
    
    // Actions
    startJob,
    completeJob,
    updateJobStatus,
    addJobNotes,
    refetchJobs,
    
    // Mutation states
    isStartingJob: startJobMutation.isPending,
    isCompletingJob: completeJobMutation.isPending,
    isUpdatingStatus: updateJobStatusMutation.isPending,
    isAddingNotes: addJobNotesMutation.isPending,
    
    // Errors
    startJobError: startJobMutation.error,
    completeJobError: completeJobMutation.error,
    updateStatusError: updateJobStatusMutation.error,
    addNotesError: addJobNotesMutation.error,
  };
};

// Individual job hook
export const useJob = (jobId: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsService.getJobById(jobId),
    enabled: isAuthenticated && !!jobId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Customer job history hook
export const useCustomerJobHistory = (customerId: string) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['jobs', 'customer', customerId, 'history'],
    queryFn: () => jobsService.getCustomerJobHistory(customerId),
    enabled: isAuthenticated && !!customerId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export default useJobs;
