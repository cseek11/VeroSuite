import { ApiProperty } from '@nestjs/swagger';
import { KPICategory } from './create-kpi.dto';

export class KPIThresholdResponseDto {
  @ApiProperty({ description: 'Green threshold value' })
  green!: number;

  @ApiProperty({ description: 'Yellow threshold value' })
  yellow!: number;

  @ApiProperty({ description: 'Red threshold value' })
  red!: number;

  @ApiProperty({ description: 'Unit of measurement', required: false })
  unit?: string;
}

export class DrillDownConfigResponseDto {
  @ApiProperty({ description: 'API endpoint for drill-down data' })
  endpoint!: string;

  @ApiProperty({ description: 'Filters to apply' })
  filters!: Record<string, any>;

  @ApiProperty({ description: 'Drill-down title' })
  title!: string;

  @ApiProperty({ description: 'Drill-down description', required: false })
  description?: string;
}

export class KPIResponseDto {
  @ApiProperty({ description: 'KPI ID' })
  id!: string;

  @ApiProperty({ description: 'KPI name' })
  name!: string;

  @ApiProperty({ description: 'KPI description', required: false })
  description?: string;

  @ApiProperty({ description: 'KPI category', enum: KPICategory })
  category!: KPICategory;

  @ApiProperty({ description: 'KPI threshold configuration' })
  threshold!: KPIThresholdResponseDto;

  @ApiProperty({ description: 'Drill-down configuration', required: false })
  drillDown?: DrillDownConfigResponseDto;

  @ApiProperty({ description: 'Whether KPI updates in real-time' })
  realTime!: boolean;

  @ApiProperty({ description: 'Whether KPI is enabled' })
  enabled!: boolean;

  @ApiProperty({ description: 'Tags for categorization', type: [String], required: false })
  tags?: string[];

  @ApiProperty({ description: 'Creation timestamp' })
  created_at!: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at!: string;

  @ApiProperty({ description: 'User ID who created the KPI' })
  user_id!: string;

  @ApiProperty({ description: 'Tenant ID' })
  tenant_id!: string;
}

export class KPIDataResponseDto {
  @ApiProperty({ description: 'KPI ID' })
  id!: string;

  @ApiProperty({ description: 'Metric name' })
  metric!: string;

  @ApiProperty({ description: 'Current value' })
  value!: number;

  @ApiProperty({ description: 'Data timestamp' })
  timestamp!: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  metadata?: Record<string, any>;
}

export class KPITrendResponseDto {
  @ApiProperty({ description: 'Metric name' })
  metric!: string;

  @ApiProperty({ description: 'Trend data points', type: 'array' })
  values!: Array<{
    timestamp: string;
    value: number;
  }>;

  @ApiProperty({ description: 'Trend direction' })
  trend!: 'up' | 'down' | 'stable';

  @ApiProperty({ description: 'Trend percentage' })
  trendValue!: number;

  @ApiProperty({ description: 'Time period' })
  period!: string;
}
