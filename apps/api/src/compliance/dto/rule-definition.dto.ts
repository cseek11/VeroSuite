import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum RuleTier {
  BLOCK = 'BLOCK',
  OVERRIDE = 'OVERRIDE',
  WARNING = 'WARNING',
}

export class RuleDefinitionDto {
  @ApiProperty({ description: 'Rule ID', example: 'R01' })
  @IsString()
  id!: string;

  @ApiProperty({ description: 'Rule name', example: 'Tenant Isolation' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Rule description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Rule tier', enum: RuleTier })
  @IsEnum(RuleTier)
  tier!: RuleTier;

  @ApiPropertyOptional({ description: 'Rule category', example: 'Security' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'File path to rule definition', example: '.cursor/rules/03-security.mdc' })
  @IsOptional()
  @IsString()
  file_path?: string;

  @ApiPropertyOptional({ description: 'OPA policy file', example: 'security.rego' })
  @IsOptional()
  @IsString()
  opa_policy?: string;

  @ApiProperty({ description: 'Created at timestamp' })
  created_at!: Date;

  @ApiProperty({ description: 'Updated at timestamp' })
  updated_at!: Date;
}

export class RuleDefinitionListResponseDto {
  @ApiProperty({ type: [RuleDefinitionDto], description: 'List of rule definitions' })
  data!: RuleDefinitionDto[];

  @ApiProperty({ description: 'Total count' })
  total!: number;
}

