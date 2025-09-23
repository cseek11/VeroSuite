import { IsString, IsOptional, IsUUID, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UseKpiTemplateDto {
  @ApiProperty({ description: 'ID of the template to use' })
  @IsUUID()
  template_id!: string;

  @ApiPropertyOptional({ description: 'Custom name for the KPI instance' })
  @IsOptional()
  @IsString()
  custom_name?: string;

  @ApiPropertyOptional({ description: 'Custom description for the KPI instance' })
  @IsOptional()
  @IsString()
  custom_description?: string;

  @ApiPropertyOptional({ description: 'Custom threshold configuration' })
  @IsOptional()
  @IsObject()
  custom_threshold_config?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Custom chart configuration' })
  @IsOptional()
  @IsObject()
  custom_chart_config?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Custom data source configuration' })
  @IsOptional()
  @IsObject()
  custom_data_source_config?: Record<string, any>;
}
