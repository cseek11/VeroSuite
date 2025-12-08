"use strict";
/**
 * Compliance Data Hooks
 * React Query hooks for compliance data fetching
 *
 * Last Updated: 2025-11-24
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRules = useRules;
exports.useComplianceChecks = useComplianceChecks;
exports.usePRCompliance = usePRCompliance;
exports.usePRComplianceScore = usePRComplianceScore;
exports.useComplianceTrends = useComplianceTrends;
var react_query_1 = require("@tanstack/react-query");
var compliance_api_1 = require("@/lib/api/compliance.api");
/**
 * Hook to fetch all rule definitions
 */
function useRules() {
    return (0, react_query_1.useQuery)({
        queryKey: ['compliance', 'rules'],
        queryFn: function () { return compliance_api_1.complianceApi.getRules(); },
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 5 * 60 * 1000, // Poll every 5 minutes
    });
}
/**
 * Hook to fetch compliance checks with filters
 */
function useComplianceChecks(filters) {
    return (0, react_query_1.useQuery)({
        queryKey: ['compliance', 'checks', filters],
        queryFn: function () { return compliance_api_1.complianceApi.getComplianceChecks(filters); },
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: 5 * 60 * 1000, // Poll every 5 minutes
    });
}
/**
 * Hook to fetch PR compliance status
 */
function usePRCompliance(prNumber) {
    return (0, react_query_1.useQuery)({
        queryKey: ['compliance', 'pr', prNumber],
        queryFn: function () { return compliance_api_1.complianceApi.getPRCompliance(prNumber); },
        enabled: !!prNumber && prNumber > 0,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}
/**
 * Hook to fetch PR compliance score
 */
function usePRComplianceScore(prNumber) {
    return (0, react_query_1.useQuery)({
        queryKey: ['compliance', 'pr', prNumber, 'score'],
        queryFn: function () { return compliance_api_1.complianceApi.getPRComplianceScore(prNumber); },
        enabled: !!prNumber && prNumber > 0,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}
/**
 * Hook to fetch compliance trends
 */
function useComplianceTrends(startDate, endDate, ruleId) {
    return (0, react_query_1.useQuery)({
        queryKey: ['compliance', 'trends', startDate, endDate, ruleId],
        queryFn: function () { return compliance_api_1.complianceApi.getComplianceTrends(startDate, endDate, ruleId); },
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
