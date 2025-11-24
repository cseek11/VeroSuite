import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ComplianceService } from './compliance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ComplianceCheckDto,
  CreateComplianceCheckDto,
  ComplianceCheckListResponseDto,
  ComplianceStatus,
} from './dto/compliance-check.dto';
import { RuleDefinitionDto, RuleDefinitionListResponseDto } from './dto/rule-definition.dto';
import { ComplianceScoreDto } from './dto/compliance-score.dto';

@ApiTags('Compliance')
@Controller({ path: 'compliance', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('rules')
  @ApiOperation({ summary: 'Get all rule definitions (R01-R25)' })
  @ApiResponse({
    status: 200,
    description: 'Rule definitions retrieved successfully',
    type: RuleDefinitionListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getRules(): Promise<RuleDefinitionListResponseDto> {
    const rules = await this.complianceService.getRuleDefinitions();
    return {
      data: rules,
      total: rules.length,
    };
  }

  @Get('checks')
  @ApiOperation({ summary: 'Get compliance checks for the authenticated tenant' })
  @ApiQuery({ name: 'prNumber', required: false, type: Number, description: 'Filter by PR number' })
  @ApiQuery({ name: 'ruleId', required: false, type: String, description: 'Filter by rule ID (e.g., R01)' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ComplianceStatus,
    description: 'Filter by status',
  })
  @ApiResponse({
    status: 200,
    description: 'Compliance checks retrieved successfully',
    type: ComplianceCheckListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getComplianceChecks(
    @Req() req: Request,
    @Query('prNumber') prNumber?: number,
    @Query('ruleId') ruleId?: string,
    @Query('status') status?: ComplianceStatus,
  ): Promise<ComplianceCheckListResponseDto> {
    const tenantId = req.user?.tenantId || '7193113e-ece2-4f7b-ae8c-176df4367e28';
    const checks = await this.complianceService.getComplianceChecks(
      tenantId,
      prNumber,
      ruleId,
      status,
    );
    return {
      data: checks,
      total: checks.length,
      page: 1,
      limit: 100,
    };
  }

  @Get('pr/:prNumber')
  @ApiOperation({ summary: 'Get compliance status for a specific PR' })
  @ApiResponse({
    status: 200,
    description: 'PR compliance status retrieved successfully',
    type: ComplianceCheckListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPRCompliance(
    @Req() req: Request,
    @Param('prNumber', ParseIntPipe) prNumber: number,
  ): Promise<ComplianceCheckListResponseDto> {
    const tenantId = req.user?.tenantId || '7193113e-ece2-4f7b-ae8c-176df4367e28';
    const checks = await this.complianceService.getComplianceChecks(tenantId, prNumber);
    return {
      data: checks,
      total: checks.length,
      page: 1,
      limit: 100,
    };
  }

  @Get('pr/:prNumber/score')
  @ApiOperation({ summary: 'Calculate compliance score for a PR' })
  @ApiResponse({
    status: 200,
    description: 'Compliance score calculated successfully',
    type: ComplianceScoreDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPRComplianceScore(
    @Req() req: Request,
    @Param('prNumber', ParseIntPipe) prNumber: number,
  ): Promise<ComplianceScoreDto> {
    const tenantId = req.user?.tenantId || '7193113e-ece2-4f7b-ae8c-176df4367e28';
    return this.complianceService.calculateComplianceScore(tenantId, prNumber);
  }

  @Post('checks')
  @ApiOperation({ summary: 'Create a new compliance check (typically called by CI/CD)' })
  @ApiResponse({
    status: 201,
    description: 'Compliance check queued successfully',
    type: ComplianceCheckDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createComplianceCheck(
    @Req() req: Request,
    @Body() dto: CreateComplianceCheckDto,
  ): Promise<{ message: string; queued: boolean }> {
    const tenantId = req.user?.tenantId || '7193113e-ece2-4f7b-ae8c-176df4367e28';
    await this.complianceService.queueComplianceCheck(tenantId, dto);
    return { message: 'Compliance check queued successfully', queued: true };
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get compliance trends for the authenticated tenant' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'End date (ISO 8601)' })
  @ApiQuery({ name: 'ruleId', required: false, type: String, description: 'Filter by rule ID' })
  @ApiResponse({
    status: 200,
    description: 'Compliance trends retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getComplianceTrends(
    @Req() req: Request,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('ruleId') ruleId?: string,
  ) {
    const tenantId = req.user?.tenantId || '7193113e-ece2-4f7b-ae8c-176df4367e28';
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.complianceService.getComplianceTrends(tenantId, start, end, ruleId);
  }
}

