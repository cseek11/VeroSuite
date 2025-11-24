import { Injectable, Logger, NotFoundException, Optional } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { randomUUID } from 'crypto';
import {
  ComplianceCheckDto,
  CreateComplianceCheckDto,
  ComplianceStatus,
  ComplianceSeverity,
} from './dto/compliance-check.dto';
import { RuleDefinitionDto, RuleTier } from './dto/rule-definition.dto';
import { ComplianceScoreDto } from './dto/compliance-score.dto';
import { ComplianceQueueService } from './compliance-queue.service';

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);

  constructor(
    private readonly db: DatabaseService,
    @Optional() private readonly queueService?: ComplianceQueueService,
  ) {}

  /**
   * Get all rule definitions
   */
  async getRuleDefinitions(): Promise<RuleDefinitionDto[]> {
    const traceId = randomUUID();
    try {
      this.logger.log('Fetching rule definitions', {
        context: 'ComplianceService',
        operation: 'getRuleDefinitions',
        traceId,
      });

      const rules = await this.db.ruleDefinition.findMany({
        orderBy: { id: 'asc' },
      });

      return rules.map((rule) => ({
        id: rule.id,
        name: rule.name,
        description: rule.description || undefined,
        tier: rule.tier as RuleTier,
        category: rule.category || undefined,
        file_path: rule.file_path || undefined,
        opa_policy: rule.opa_policy || undefined,
        created_at: rule.created_at,
        updated_at: rule.updated_at,
      }));
    } catch (error) {
      this.logger.error('Error fetching rule definitions', {
        context: 'ComplianceService',
        operation: 'getRuleDefinitions',
        traceId,
        errorCode: 'GET_RULES_ERROR',
        rootCause: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get compliance checks for a tenant
   */
  async getComplianceChecks(
    tenantId: string,
    prNumber?: number,
    ruleId?: string,
    status?: ComplianceStatus,
  ): Promise<ComplianceCheckDto[]> {
    const traceId = randomUUID();
    try {
      this.logger.log('Fetching compliance checks', {
        context: 'ComplianceService',
        operation: 'getComplianceChecks',
        traceId,
        tenantId,
        prNumber,
        ruleId,
        status,
      });

      const where: any = {
        tenant_id: tenantId,
      };

      if (prNumber) {
        where.pr_number = prNumber;
      }

      if (ruleId) {
        where.rule_id = ruleId;
      }

      if (status) {
        where.status = status;
      }

      const checks = await this.db.complianceCheck.findMany({
        where,
        orderBy: { created_at: 'desc' },
        include: {
          rule: true,
        },
      });

      return checks.map((check) => ({
        id: check.id,
        tenant_id: check.tenant_id,
        pr_number: check.pr_number,
        commit_sha: check.commit_sha,
        rule_id: check.rule_id,
        status: check.status as ComplianceStatus,
        severity: check.severity as ComplianceSeverity,
        file_path: check.file_path || undefined,
        line_number: check.line_number || undefined,
        violation_message: check.violation_message || undefined,
        context: check.context as Record<string, any> | undefined,
        created_at: check.created_at,
        resolved_at: check.resolved_at || undefined,
        resolved_by: check.resolved_by || undefined,
        override_reason: check.override_reason || undefined,
        override_approved_by: check.override_approved_by || undefined,
      }));
    } catch (error) {
      this.logger.error('Error fetching compliance checks', {
        context: 'ComplianceService',
        operation: 'getComplianceChecks',
        traceId,
        tenantId,
        errorCode: 'GET_CHECKS_ERROR',
        rootCause: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Queue a compliance check (async)
   */
  async queueComplianceCheck(tenantId: string, dto: CreateComplianceCheckDto): Promise<void> {
    if (this.queueService) {
      await this.queueService.addComplianceCheck(tenantId, dto);
    } else {
      // Fallback: create directly if queue service not available
      await this.createComplianceCheck(tenantId, dto);
    }
  }

  /**
   * Create a compliance check (synchronous)
   */
  async createComplianceCheck(
    tenantId: string,
    dto: CreateComplianceCheckDto,
  ): Promise<ComplianceCheckDto> {
    const traceId = randomUUID();
    try {
      this.logger.log('Creating compliance check', {
        context: 'ComplianceService',
        operation: 'createComplianceCheck',
        traceId,
        tenantId,
        prNumber: dto.pr_number,
        ruleId: dto.rule_id,
      });

      // Verify rule exists
      const rule = await this.db.ruleDefinition.findUnique({
        where: { id: dto.rule_id },
      });

      if (!rule) {
        throw new NotFoundException(`Rule ${dto.rule_id} not found`);
      }

      const check = await this.db.complianceCheck.create({
        data: {
          tenant_id: tenantId,
          pr_number: dto.pr_number,
          commit_sha: dto.commit_sha,
          rule_id: dto.rule_id,
          status: dto.status,
          severity: dto.severity,
          file_path: dto.file_path,
          line_number: dto.line_number,
          violation_message: dto.violation_message,
          context: dto.context ? (dto.context as any) : undefined,
        },
        include: {
          rule: true,
        },
      });

      return {
        id: check.id,
        tenant_id: check.tenant_id,
        pr_number: check.pr_number,
        commit_sha: check.commit_sha,
        rule_id: check.rule_id,
        status: check.status as ComplianceStatus,
        severity: check.severity as ComplianceSeverity,
        file_path: check.file_path || undefined,
        line_number: check.line_number || undefined,
        violation_message: check.violation_message || undefined,
        context: check.context as Record<string, any> | undefined,
        created_at: check.created_at,
        resolved_at: check.resolved_at || undefined,
        resolved_by: check.resolved_by || undefined,
        override_reason: check.override_reason || undefined,
        override_approved_by: check.override_approved_by || undefined,
      };
    } catch (error) {
      this.logger.error('Error creating compliance check', {
        context: 'ComplianceService',
        operation: 'createComplianceCheck',
        traceId,
        tenantId,
        errorCode: 'CREATE_CHECK_ERROR',
        rootCause: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Calculate compliance score for a PR
   */
  async calculateComplianceScore(
    tenantId: string,
    prNumber: number,
  ): Promise<ComplianceScoreDto> {
    const traceId = randomUUID();
    try {
      this.logger.log('Calculating compliance score', {
        context: 'ComplianceService',
        operation: 'calculateComplianceScore',
        traceId,
        tenantId,
        prNumber,
      });

      const checks = await this.db.complianceCheck.findMany({
        where: {
          tenant_id: tenantId,
          pr_number: prNumber,
          resolved_at: null, // Only count unresolved violations
        },
      });

      const blockCount = checks.filter((c) => c.severity === 'BLOCK').length;
      const overrideCount = checks.filter((c) => c.severity === 'OVERRIDE').length;
      const warningCount = checks.filter((c) => c.severity === 'WARNING').length;

      // Weighted violation calculation
      const weightedViolations = blockCount * 10 + overrideCount * 3 + warningCount * 1;

      // Compliance score: 100 - weighted violations (minimum 0)
      const score = Math.max(0, 100 - weightedViolations);

      // Can merge if: score >= 70 AND no BLOCK violations (or override approved)
      const hasBlockViolations = blockCount > 0;
      const canMerge = score >= 70 && !hasBlockViolations;

      return {
        score,
        block_count: blockCount,
        override_count: overrideCount,
        warning_count: warningCount,
        weighted_violations: weightedViolations,
        can_merge: canMerge,
        pr_number: prNumber,
      };
    } catch (error) {
      this.logger.error('Error calculating compliance score', {
        context: 'ComplianceService',
        operation: 'calculateComplianceScore',
        traceId,
        tenantId,
        prNumber,
        errorCode: 'CALCULATE_SCORE_ERROR',
        rootCause: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Get compliance trends for a tenant
   */
  async getComplianceTrends(
    tenantId: string,
    startDate?: Date,
    endDate?: Date,
    ruleId?: string,
  ) {
    const traceId = randomUUID();
    try {
      this.logger.log('Fetching compliance trends', {
        context: 'ComplianceService',
        operation: 'getComplianceTrends',
        traceId,
        tenantId,
        startDate,
        endDate,
        ruleId,
      });

      const where: any = {
        tenant_id: tenantId,
      };

      if (startDate || endDate) {
        where.date = {};
        if (startDate) {
          where.date.gte = startDate;
        }
        if (endDate) {
          where.date.lte = endDate;
        }
      }

      if (ruleId) {
        where.rule_id = ruleId;
      }

      const trends = await this.db.complianceTrend.findMany({
        where,
        orderBy: { date: 'desc' },
        include: {
          rule: true,
        },
      });

      return trends;
    } catch (error) {
      this.logger.error('Error fetching compliance trends', {
        context: 'ComplianceService',
        operation: 'getComplianceTrends',
        traceId,
        tenantId,
        errorCode: 'GET_TRENDS_ERROR',
        rootCause: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }
}

