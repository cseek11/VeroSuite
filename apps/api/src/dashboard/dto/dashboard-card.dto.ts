import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsUUID, IsObject } from 'class-validator';

export class CreateDashboardCardDto {
  @ApiProperty({ description: 'Layout ID' })
  @IsUUID()
  layout_id!: string;

  @ApiProperty({ description: 'Frontend card UID' })
  @IsString()
  card_uid!: string;

  @ApiProperty({ description: 'Card type' })
  @IsString()
  type!: string;

  @ApiProperty({ description: 'X position', default: 0 })
  @IsOptional()
  @IsNumber()
  x?: number;

  @ApiProperty({ description: 'Y position', default: 0 })
  @IsOptional()
  @IsNumber()
  y?: number;

  @ApiProperty({ description: 'Card width', default: 300 })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiProperty({ description: 'Card height', default: 200 })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiProperty({ description: 'Card configuration JSON', required: false })
  @IsOptional()
  @IsObject()
  config?: any;

  @ApiProperty({ description: 'User KPI ID', required: false })
  @IsOptional()
  @IsUUID()
  user_kpi_id?: string;

  @ApiProperty({ description: 'Template ID', required: false })
  @IsOptional()
  @IsUUID()
  template_id?: string;
}

export class UpdateDashboardCardDto {
  @ApiProperty({ description: 'X position', required: false })
  @IsOptional()
  @IsNumber()
  x?: number;

  @ApiProperty({ description: 'Y position', required: false })
  @IsOptional()
  @IsNumber()
  y?: number;

  @ApiProperty({ description: 'Card width', required: false })
  @IsOptional()
  @IsNumber()
  width?: number;

  @ApiProperty({ description: 'Card height', required: false })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiProperty({ description: 'Card configuration JSON', required: false })
  @IsOptional()
  @IsObject()
  config?: any;

  @ApiProperty({ description: 'User KPI ID', required: false })
  @IsOptional()
  @IsUUID()
  user_kpi_id?: string;

  @ApiProperty({ description: 'Template ID', required: false })
  @IsOptional()
  @IsUUID()
  template_id?: string;
}

export class DashboardCardResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenant_id!: string;

  @ApiProperty()
  user_id!: string;

  @ApiProperty()
  layout_id!: string;

  @ApiProperty()
  card_uid!: string;

  @ApiProperty()
  type!: string;

  @ApiProperty()
  x!: number;

  @ApiProperty()
  y!: number;

  @ApiProperty()
  width!: number;

  @ApiProperty()
  height!: number;

  @ApiProperty()
  config!: any;

  @ApiProperty()
  user_kpi_id?: string;

  @ApiProperty()
  template_id?: string;

  @ApiProperty()
  is_active!: boolean;

  @ApiProperty()
  created_at!: string;

  @ApiProperty()
  updated_at!: string;
}
