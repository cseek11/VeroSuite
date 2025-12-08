/**
 * Compliance Data Hooks
 * React Query hooks for compliance data fetching
 * 
 * Last Updated: 2025-11-24
 */

import { useQuery } from '@tanstack/react-query';
import { complianceApi } from '@/lib/api/compliance.api';
import type { ComplianceCheckFilters } from '@/types/compliance.types';

/**
 * Hook to fetch all rule definitions
 */
export function useRules() {
  return useQuery({
    queryKey: ['compliance', 'rules'],
    queryFn: () => complianceApi.getRules(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Poll every 5 minutes
  });
}

/**
 * Hook to fetch compliance checks with filters
 */
export function useComplianceChecks(filters?: ComplianceCheckFilters) {
  return useQuery({
    queryKey: ['compliance', 'checks', filters],
    queryFn: () => complianceApi.getComplianceChecks(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Poll every 5 minutes
  });
}

/**
 * Hook to fetch PR compliance status
 */
export function usePRCompliance(prNumber: number) {
  return useQuery({
    queryKey: ['compliance', 'pr', prNumber],
    queryFn: () => complianceApi.getPRCompliance(prNumber),
    enabled: !!prNumber && prNumber > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch PR compliance score
 */
export function usePRComplianceScore(prNumber: number) {
  return useQuery({
    queryKey: ['compliance', 'pr', prNumber, 'score'],
    queryFn: () => complianceApi.getPRComplianceScore(prNumber),
    enabled: !!prNumber && prNumber > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch compliance trends
 */
export function useComplianceTrends(startDate?: string, endDate?: string, ruleId?: string) {
  return useQuery({
    queryKey: ['compliance', 'trends', startDate, endDate, ruleId],
    queryFn: () => complianceApi.getComplianceTrends(startDate, endDate, ruleId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}



