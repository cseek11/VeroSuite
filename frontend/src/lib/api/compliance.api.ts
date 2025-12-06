/**
 * Compliance API Client
 * API client for compliance endpoints
 * 
 * Last Updated: 2025-12-06
 */

import { logger } from '@/utils/logger';
import type {
  RuleDefinition,
  RuleDefinitionListResponse,
  ComplianceCheck,
  ComplianceCheckListResponse,
  ComplianceScore,
  ComplianceCheckFilters,
  ComplianceTrend,
  CreateComplianceCheckDto,
} from '@/types/compliance.types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

/**
 * Get authentication token for API requests
 */
const getAuthToken = async (): Promise<string> => {
  try {
    const authData = localStorage.getItem('verofield_auth');
    if (authData) {
      const parsed = JSON.parse(authData);
      if (parsed.token) {
        return parsed.token;
      }
    }
    throw new Error('No authentication token found');
  } catch (error) {
    logger.error('Error getting auth token', error, 'compliance-api');
    throw error;
  }
};

/**
 * Make authenticated API request
 */
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      logger.error(`API request failed: ${endpoint}`, error, 'compliance-api');
      throw new Error(error.message || `API request failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    logger.error(`API request error: ${endpoint}`, error, 'compliance-api');
    throw error;
  }
};

/**
 * Compliance API client
 */
export const complianceApi = {
  /**
   * Get all rule definitions (R01-R25)
   */
  getRules: async (): Promise<RuleDefinition[]> => {
    try {
      const response = await apiRequest<RuleDefinitionListResponse>('/compliance/rules');
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch rules', error, 'compliance-api');
      throw error;
    }
  },

  /**
   * Get compliance checks with optional filters
   */
  getComplianceChecks: async (filters?: ComplianceCheckFilters): Promise<ComplianceCheck[]> => {
    try {
      const params = new URLSearchParams();
      if (filters?.prNumber) params.append('prNumber', filters.prNumber.toString());
      if (filters?.ruleId) params.append('ruleId', filters.ruleId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.severity) params.append('severity', filters.severity);

      const queryString = params.toString();
      const endpoint = `/compliance/checks${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiRequest<ComplianceCheckListResponse>(endpoint);
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch compliance checks', error, 'compliance-api');
      throw error;
    }
  },

  /**
   * Get compliance status for a specific PR
   */
  getPRCompliance: async (prNumber: number): Promise<ComplianceCheck[]> => {
    try {
      const response = await apiRequest<ComplianceCheckListResponse>(`/compliance/pr/${prNumber}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to fetch PR ${prNumber} compliance`, error, 'compliance-api');
      throw error;
    }
  },

  /**
   * Get compliance score for a specific PR
   */
  getPRComplianceScore: async (prNumber: number): Promise<ComplianceScore> => {
    try {
      return await apiRequest<ComplianceScore>(`/compliance/pr/${prNumber}/score`);
    } catch (error) {
      logger.error(`Failed to fetch PR ${prNumber} compliance score`, error, 'compliance-api');
      throw error;
    }
  },

  /**
   * Create a new compliance check (typically called by CI/CD)
   */
  createComplianceCheck: async (data: CreateComplianceCheckDto): Promise<ComplianceCheck> => {
    try {
      return await apiRequest<ComplianceCheck>('/compliance/checks', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      logger.error('Failed to create compliance check', error, 'compliance-api');
      throw error;
    }
  },

  /**
   * Get compliance trends
   */
  getComplianceTrends: async (
    startDate?: string,
    endDate?: string,
    ruleId?: string
  ): Promise<ComplianceTrend[]> => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (ruleId) params.append('ruleId', ruleId);

      const queryString = params.toString();
      const endpoint = `/compliance/trends${queryString ? `?${queryString}` : ''}`;
      
      return await apiRequest<ComplianceTrend[]>(endpoint);
    } catch (error) {
      logger.error('Failed to fetch compliance trends', error, 'compliance-api');
      throw error;
    }
  },
};



