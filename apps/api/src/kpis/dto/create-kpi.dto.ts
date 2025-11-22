import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsObject, IsNumber, IsArray, MinLength, MaxLength, IsEnum } from 'class-validator';

export enum KPICategory {
  FINANCIAL = 'financial',
  OPERATIONAL = 'operational',
  CUSTOMER = 'customer',
  COMPLIANCE = 'compliance'
}

export class KPIThresholdDto {
  @ApiProperty({ description: 'Green threshold value' })
  @IsNumber()
  green!: number;

  @ApiProperty({ description: 'Yellow threshold value' })
  @IsNumber()
  yellow!: number;

  @ApiProperty({ description: 'Red threshold value' })
  @IsNumber()
  red!: number;

  @ApiProperty({ description: 'Unit of measurement', required: false })
  @IsOptional()
  @IsString()
  unit?: string;
}

export class DrillDownConfigDto {
  @ApiProperty({ description: 'API endpoint for drill-down data' })
  @IsString()
  @MinLength(1)
  endpoint!: string;

  @ApiProperty({ description: 'Filters to apply', type: 'object' })
  @IsObject()
  filters!: Record<string, any>;

  @ApiProperty({ description: 'Drill-down title' })
  @IsString()
  @MinLength(1)
  title!: string;

  @ApiProperty({ description: 'Drill-down description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateKPIDto {
  @ApiProperty({ description: 'KPI name', minLength: 1, maxLength: 255 })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @ApiProperty({ description: 'KPI description', required: false, maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ description: 'KPI category', enum: KPICategory })
  @IsEnum(KPICategory)
  category!: KPICategory;

  @ApiProperty({ description: 'KPI threshold configuration' })
  @IsObject()
  threshold!: KPIThresholdDto;

  @ApiProperty({ description: 'Drill-down configuration', required: false })
  @IsOptional()
  @IsObject()
  drillDown?: DrillDownConfigDto;

  @ApiProperty({ description: 'Whether KPI updates in real-time', default: false })
  @IsOptional()
  @IsBoolean()
  realTime?: boolean;

  @ApiProperty({ description: 'Whether KPI is enabled', default: true })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiProperty({ description: 'Tags for categorization', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'Template ID if KPI was created from a template', required: false })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiProperty({ description: 'Formula expression', required: false })
  @IsOptional()
  @IsString()
  formulaExpression?: string;

  @ApiProperty({ description: 'Formula fields', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  formulaFields?: string[];
}
