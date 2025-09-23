import { IsString, IsOptional, IsBoolean, IsArray, IsObject, IsEnum, ValidateNested, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TemplateCategory {
  FINANCIAL = 'financial',
  OPERATIONAL = 'operational',
  CUSTOMER = 'customer',
  COMPLIANCE = 'compliance'
}

export enum TemplateType {
  SYSTEM = 'system',
  USER = 'user',
  SHARED = 'shared'
}

export enum TemplateStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export class KpiTemplateFieldDto {
  @ApiProperty({ description: 'Field name identifier' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  field_name!: string;

  @ApiProperty({ description: 'Field data type' })
  @IsString()
  field_type!: string;

  @ApiProperty({ description: 'Database table name' })
  @IsString()
  table_name!: string;

  @ApiProperty({ description: 'Database column name' })
  @IsString()
  column_name!: string;

  @ApiPropertyOptional({ description: 'Aggregation type if applicable' })
  @IsOptional()
  @IsString()
  aggregation_type?: string;

  @ApiProperty({ description: 'Display name for the field' })
  @IsString()
  display_name!: string;

  @ApiPropertyOptional({ description: 'Field description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Whether field is required' })
  @IsOptional()
  @IsBoolean()
  is_required?: boolean;

  @ApiPropertyOptional({ description: 'Sort order for display' })
  @IsOptional()
  sort_order?: number;
}

export class CreateKpiTemplateDto {
  @ApiProperty({ description: 'Template name', minLength: 1, maxLength: 255 })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ description: 'Template description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Template category',
    enum: TemplateCategory,
    example: TemplateCategory.FINANCIAL
  })
  @IsEnum(TemplateCategory)
  category!: TemplateCategory;

  @ApiProperty({ 
    description: 'Template type',
    enum: TemplateType,
    example: TemplateType.USER
  })
  @IsEnum(TemplateType)
  template_type!: TemplateType;

  @ApiProperty({ description: 'Formula expression for the KPI' })
  @IsString()
  @MinLength(1)
  formula_expression!: string;

  @ApiProperty({ 
    description: 'Fields used in the formula',
    type: [KpiTemplateFieldDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KpiTemplateFieldDto)
  formula_fields!: KpiTemplateFieldDto[];

  @ApiProperty({ description: 'Threshold configuration as JSON object' })
  @IsObject()
  threshold_config!: Record<string, any>;

  @ApiProperty({ description: 'Chart configuration as JSON object' })
  @IsObject()
  chart_config!: Record<string, any>;

  @ApiProperty({ description: 'Data source configuration as JSON object' })
  @IsObject()
  data_source_config!: Record<string, any>;

  @ApiPropertyOptional({ description: 'Template tags for categorization' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Whether template is public' })
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  @ApiPropertyOptional({ description: 'Whether template is featured' })
  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  @ApiPropertyOptional({ description: 'Template version' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  version?: string;

  @ApiPropertyOptional({ 
    description: 'Template status',
    enum: TemplateStatus,
    example: TemplateStatus.PUBLISHED
  })
  @IsOptional()
  @IsEnum(TemplateStatus)
  status?: TemplateStatus;
}
