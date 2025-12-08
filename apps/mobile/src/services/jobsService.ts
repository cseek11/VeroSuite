// ============================================================================
// VeroField Mobile App - Jobs Service
// ============================================================================

import { API_CONFIG } from '../constants';
import { Job, ApiResponse, PaginatedResponse, AppError } from '../types';
import authService from './authService';

class JobsService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  /**
   * Get today's jobs for the authenticated technician
   */
  async getTodaysJobs(): Promise<Job[]> {
    try {
      const headers = await authService.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/v1/jobs/today`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.statusText}`);
      }

      const data: ApiResponse<Job[]> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching today\'s jobs:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get job details by ID
   */
  async getJobById(jobId: string): Promise<Job> {
    try {
      const headers = await authService.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/v1/jobs/${jobId}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch job: ${response.statusText}`);
      }

      const data: ApiResponse<Job> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Start a job
   */
  async startJob(jobId: string): Promise<Job> {
    try {
      const headers = await authService.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/v1/jobs/${jobId}/start`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          started_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to start job: ${response.statusText}`);
      }

      const data: ApiResponse<Job> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error starting job:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Complete a job
   */
  async completeJob(jobId: string, completionData: {
    notes?: string;
    signature?: string;
    photos?: string[];
    chemicals_used?: any[];
  }): Promise<Job> {
    try {
      const headers = await authService.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/v1/jobs/${jobId}/complete`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          completed_at: new Date().toISOString(),
          ...completionData,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to complete job: ${response.statusText}`);
      }

      const data: ApiResponse<Job> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error completing job:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Update job status
   */
  async updateJobStatus(jobId: string, status: string): Promise<Job> {
    try {
      const headers = await authService.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/v1/jobs/${jobId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update job status: ${response.statusText}`);
      }

      const data: ApiResponse<Job> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating job status:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Add notes to a job
   */
  async addJobNotes(jobId: string, notes: string): Promise<Job> {
    try {
      const headers = await authService.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/v1/jobs/${jobId}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add job notes: ${response.statusText}`);
      }

      const data: ApiResponse<Job> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error adding job notes:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get job history for a customer
   */
  async getCustomerJobHistory(customerId: string): Promise<Job[]> {
    try {
      const headers = await authService.getAuthHeaders();
      
      const response = await fetch(`${this.baseUrl}/v1/jobs/customer/${customerId}/history`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch customer job history: ${response.statusText}`);
      }

      const data: ApiResponse<Job[]> = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching customer job history:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): AppError {
    if (error instanceof Error) {
      return {
        code: 'JOBS_ERROR',
        message: error.message,
        details: error,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unexpected error occurred',
      details: error,
    };
  }
}

// Export singleton instance
export const jobsService = new JobsService();
export default jobsService;
