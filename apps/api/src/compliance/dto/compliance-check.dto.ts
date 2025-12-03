import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsEnum, IsObject, IsUUID } from 'class-validator';

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

export class ComplianceCheckDto {
  @ApiProperty({ description: 'Compliance check ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  id!: string;

  @ApiProperty({ description: 'Tenant ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  tenant_id!: string;

  @ApiProperty({ description: 'Pull request number', example: 123 })
  @IsInt()
  pr_number!: number;

  @ApiProperty({ description: 'Commit SHA', example: 'abc123def456' })
  @IsString()
  commit_sha!: string;

  @ApiProperty({ description: 'Rule ID', example: 'R01' })
  @IsString()
  rule_id!: string;

  @ApiProperty({ description: 'Compliance status', enum: ComplianceStatus })
  @IsEnum(ComplianceStatus)
  status!: ComplianceStatus;

  @ApiProperty({ description: 'Severity level', enum: ComplianceSeverity })
  @IsEnum(ComplianceSeverity)
  severity!: ComplianceSeverity;

  @ApiPropertyOptional({ description: 'File path where violation occurred' })
  @IsOptional()
  @IsString()
  file_path?: string;

  @ApiPropertyOptional({ description: 'Line number where violation occurred' })
  @IsOptional()
  @IsInt()
  line_number?: number;

  @ApiPropertyOptional({ description: 'Violation message' })
  @IsOptional()
  @IsString()
  violation_message?: string;

  @ApiPropertyOptional({ description: 'Additional context (OPA output, file diff, etc.)', type: 'object' })
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;

  @ApiProperty({ description: 'Created at timestamp' })
  created_at!: Date;

  @ApiPropertyOptional({ description: 'Resolved at timestamp' })
  @IsOptional()
  resolved_at?: Date;

  @ApiPropertyOptional({ description: 'User ID who resolved the violation' })
  @IsOptional()
  @IsUUID()
  resolved_by?: string;

  @ApiPropertyOptional({ description: 'Override reason if status is OVERRIDE' })
  @IsOptional()
  @IsString()
  override_reason?: string;

  @ApiPropertyOptional({ description: 'User ID who approved the override' })
  @IsOptional()
  @IsUUID()
  override_approved_by?: string;
}

export class CreateComplianceCheckDto {
  @ApiProperty({ description: 'Pull request number', example: 123 })
  @IsInt()
  pr_number!: number;

  @ApiProperty({ description: 'Commit SHA', example: 'abc123def456' })
  @IsString()
  commit_sha!: string;

  @ApiProperty({ description: 'Rule ID', example: 'R01' })
  @IsString()
  rule_id!: string;

  @ApiProperty({ description: 'Compliance status', enum: ComplianceStatus })
  @IsEnum(ComplianceStatus)
  status!: ComplianceStatus;

  @ApiProperty({ description: 'Severity level', enum: ComplianceSeverity })
  @IsEnum(ComplianceSeverity)
  severity!: ComplianceSeverity;

  @ApiPropertyOptional({ description: 'File path where violation occurred' })
  @IsOptional()
  @IsString()
  file_path?: string;

  @ApiPropertyOptional({ description: 'Line number where violation occurred' })
  @IsOptional()
  @IsInt()
  line_number?: number;

  @ApiPropertyOptional({ description: 'Violation message' })
  @IsOptional()
  @IsString()
  violation_message?: string;

  @ApiPropertyOptional({ description: 'Additional context (OPA output, file diff, etc.)', type: 'object' })
  @IsOptional()
  @IsObject()
  context?: Record<string, any>;
}

export class ComplianceCheckListResponseDto {
  @ApiProperty({ type: [ComplianceCheckDto], description: 'List of compliance checks' })
  data!: ComplianceCheckDto[];

  @ApiProperty({ description: 'Total count' })
  total!: number;

  @ApiProperty({ description: 'Page number' })
  page!: number;

  @ApiProperty({ description: 'Page size' })
  limit!: number;
}



