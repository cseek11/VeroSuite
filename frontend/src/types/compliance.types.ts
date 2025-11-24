/**
 * Compliance Types
 * TypeScript types for compliance dashboard
 * 
 * Last Updated: 2025-11-24
 */

export enum RuleTier {
  BLOCK = 'BLOCK',
  OVERRIDE = 'OVERRIDE',
  WARNING = 'WARNING',
}

export enum ComplianceStatus {
  PASS = 'PASS',
  VIOLATION = 'VIOLATION',
  OVERRIDE = 'OVERRIDE',
}

export enum ComplianceSeverity {
  BLOCK = 'BLOCK',
  OVERRIDE = 'OVERRIDE',
  WARNING = 'WARNING',
}

export interface RuleDefinition {
  id: string;
  name: string;
  description?: string;
  tier: RuleTier;
  category?: string;
  file_path?: string;
  opa_policy?: string;
  created_at: string;
  updated_at: string;
}

export interface ComplianceCheck {
  id: string;
  tenant_id: string;
  pr_number: number;
  commit_sha: string;
  rule_id: string;
  status: ComplianceStatus;
  severity: ComplianceSeverity;
  file_path?: string;
  line_number?: number;
  violation_message?: string;
  context?: Record<string, any>;
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
  override_reason?: string;
  override_approved_by?: string;
}

export interface ComplianceScore {
  score: number;
  block_count: number;
  override_count: number;
  warning_count: number;
  weighted_violations: number;
  can_merge: boolean;
  pr_number: number;
}

export interface ComplianceTrend {
  id: string;
  date: string;
  rule_id: string;
  violation_count: number;
  compliance_rate: number;
  created_at: string;
}

export interface RuleDefinitionListResponse {
  data: RuleDefinition[];
  total: number;
}

export interface ComplianceCheckListResponse {
  data: ComplianceCheck[];
  total: number;
  page: number;
  limit: number;
}

export interface ComplianceCheckFilters {
  prNumber?: number;
  ruleId?: string;
  status?: ComplianceStatus;
  severity?: ComplianceSeverity;
  filePath?: string;
  startDate?: string;
  endDate?: string;
}

