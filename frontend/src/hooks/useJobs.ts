import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Job, 
  CreateJobRequest, 
  UpdateJobRequest, 
  JobFilters, 
  JobListResponse 
} from '@/types/jobs';
import { logger } from '@/utils/logger';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class JobsApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    // Get token from auth store (stored as JSON)
    let token = null;
    try {
      const authData = localStorage.getItem('verofield_auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        token = parsed.token;
      }
    } catch (error: unknown) {
      logger.error('Error parsing auth data', error, 'useJobs');
    }
    
    // Fallback to direct jwt key
    if (!token) {
      token = localStorage.getItem('jwt');
    }
    
    const tenantId = localStorage.getItem('tenantId') || '7193113e-ece2-4f7b-ae8c-176df4367e28';
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': tenantId,
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async getJobs(filters: JobFilters = {}): Promise<JobListResponse> {
    const params = new URLSearchParams();
    
    if (filters.technician_id) params.append('technician_id', filters.technician_id);
    if (filters.status) params.append('status', filters.status);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(`${API_BASE_URL}/jobs?${params}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    return this.handleResponse<JobListResponse>(response);
  }

  async getJobById(id: string): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    return this.handleResponse<Job>(response);
  }

  async createJob(data: CreateJobRequest): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Job>(response);
  }

  async updateJob(id: string, data: UpdateJobRequest): Promise<Job> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    return this.handleResponse<Job>(response);
  }

  async deleteJob(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    });

    return this.handleResponse<{ message: string }>(response);
  }

  async getJobsByTechnician(technicianId: string): Promise<Job[]> {
    const response = await fetch(`${API_BASE_URL}/jobs/technician/${technicianId}`, {
      method: 'GET',
      headers: await this.getAuthHeaders(),
    });

    return this.handleResponse<Job[]>(response);
  }

  async getTodayJobs(technicianId?: string): Promise<Job[]> {
    const today = new Date().toISOString().split('T')[0];
    const filters: JobFilters = { start_date: today, end_date: today };
    if (technicianId) filters.technician_id = technicianId;
    
    const response = await this.getJobs(filters);
    return response.data;
  }
}

export const jobsApi = new JobsApiService();

// Query keys
export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (filters: JobFilters) => [...jobKeys.lists(), filters] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
  byTechnician: (technicianId: string) => [...jobKeys.all, 'technician', technicianId] as const,
  today: (technicianId?: string) => [...jobKeys.all, 'today', technicianId] as const,
};

// Hook to get jobs with filters
export const useJobs = (filters: JobFilters = {}) => {
  return useQuery({
    queryKey: jobKeys.list(filters),
    queryFn: () => jobsApi.getJobs(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get a specific job
export const useJob = (id: string) => {
  return useQuery({
    queryKey: jobKeys.detail(id),
    queryFn: () => jobsApi.getJobById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Hook to get today's jobs
export const useTodayJobs = (technicianId?: string) => {
  return useQuery({
    queryKey: jobKeys.today(technicianId),
    queryFn: () => jobsApi.getTodayJobs(technicianId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get jobs by technician
export const useJobsByTechnician = (technicianId: string) => {
  return useQuery({
    queryKey: jobKeys.byTechnician(technicianId),
    queryFn: () => jobsApi.getJobsByTechnician(technicianId),
    enabled: !!technicianId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// Hook to create a new job
export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (jobData: CreateJobRequest) => jobsApi.createJob(jobData),
    onSuccess: (newJob) => {
      // Invalidate and refetch jobs lists
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      
      // Add the new job to the cache
      queryClient.setQueryData(jobKeys.detail(newJob.id), newJob);
      
      // If it's assigned to a technician, invalidate their jobs
      if (newJob.technician_id) {
        queryClient.invalidateQueries({ 
          queryKey: jobKeys.byTechnician(newJob.technician_id) 
        });
      }
    },
  });
};

// Hook to update a job
export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJobRequest }) => 
      jobsApi.updateJob(id, data),
    onSuccess: (updatedJob) => {
      // Update the job in cache
      queryClient.setQueryData(jobKeys.detail(updatedJob.id), updatedJob);
      
      // Invalidate lists to reflect changes
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      
      // Invalidate related queries
      if (updatedJob.technician_id) {
        queryClient.invalidateQueries({ 
          queryKey: jobKeys.byTechnician(updatedJob.technician_id) 
        });
      }
    },
  });
};

// Hook to delete a job
export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => jobsApi.deleteJob(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: jobKeys.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
};

// Hook to assign a job to a technician
export const useAssignJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ jobId, technicianId }: { jobId: string; technicianId: string }) => 
      jobsApi.updateJob(jobId, { technician_id: technicianId }),
    onSuccess: (updatedJob) => {
      // Update the job in cache
      queryClient.setQueryData(jobKeys.detail(updatedJob.id), updatedJob);
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
      
      // Invalidate technician jobs
      if (updatedJob.technician_id) {
        queryClient.invalidateQueries({ 
          queryKey: jobKeys.byTechnician(updatedJob.technician_id) 
        });
      }
    },
  });
};

// Hook to start a job
export const useStartJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, gps }: { id: string; gps: { lat: number; lng: number } }) =>
      jobsApi.updateJob(id, { 
        status: 'in_progress' as any,
        actual_start_time: new Date().toISOString()
      }),
    onSuccess: (updatedJob) => {
      // Update the job in cache
      queryClient.setQueryData(jobKeys.detail(updatedJob.id), updatedJob);
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
};

// Hook to complete a job
export const useCompleteJob = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes?: string }) =>
      jobsApi.updateJob(id, { 
        status: 'completed' as any,
        actual_end_time: new Date().toISOString(),
        notes: notes
      }),
    onSuccess: (updatedJob) => {
      // Update the job in cache
      queryClient.setQueryData(jobKeys.detail(updatedJob.id), updatedJob);
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
};
