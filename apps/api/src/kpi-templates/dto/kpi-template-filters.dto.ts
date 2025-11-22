import { IsOptional, IsString, IsEnum, IsBoolean, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TemplateCategory, TemplateType, TemplateStatus } from './create-kpi-template.dto';

export class KpiTemplateFiltersDto {
  @ApiPropertyOptional({ description: 'Search term for template name or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by template category',
    enum: TemplateCategory
  })
  @IsOptional()
  @IsEnum(TemplateCategory)
  category?: TemplateCategory;

  @ApiPropertyOptional({ 
    description: 'Filter by template type',
    enum: TemplateType
  })
  @IsOptional()
  @IsEnum(TemplateType)
  template_type?: TemplateType;

  @ApiPropertyOptional({ 
    description: 'Filter by template status',
    enum: TemplateStatus
  })
  @IsOptional()
  @IsEnum(TemplateStatus)
  status?: TemplateStatus;

  @ApiPropertyOptional({ description: 'Filter by tags' })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ description: 'Filter public templates only' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_public?: boolean;

  @ApiPropertyOptional({ description: 'Filter featured templates only' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_featured?: boolean;

  @ApiPropertyOptional({ description: 'Filter by creator ID' })
  @IsOptional()
  @IsUUID()
  created_by?: string;

  @ApiPropertyOptional({ 
    description: 'Page number for pagination',
    minimum: 1,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 20
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ 
    description: 'Sort field',
    enum: ['name', 'created_at', 'updated_at', 'usage_count'],
    default: 'created_at'
  })
  @IsOptional()
  @IsString()
  sort_by?: string = 'created_at';

  @ApiPropertyOptional({ 
    description: 'Sort order',
    enum: ['asc', 'desc'],
    default: 'desc'
  })
  @IsOptional()
  @IsString()
  sort_order?: 'asc' | 'desc' = 'desc';
}















