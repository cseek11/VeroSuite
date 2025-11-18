import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsUUID, IsBoolean, IsNumber, Min, IsEnum } from 'class-validator';

export enum ScheduleType {
  RECURRING = 'recurring',
  ONE_TIME = 'one-time'
}

export enum ScheduleFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export class CreateInvoiceScheduleDto {
  @ApiProperty({
    description: 'Account ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  account_id!: string;

  @ApiPropertyOptional({
    description: 'Template ID (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID()
  template_id?: string;

  @ApiProperty({
    description: 'Schedule type',
    enum: ScheduleType,
    example: ScheduleType.RECURRING
  })
  @IsEnum(ScheduleType)
  schedule_type!: ScheduleType;

  @ApiPropertyOptional({
    description: 'Frequency (required for recurring schedules)',
    enum: ScheduleFrequency,
    example: ScheduleFrequency.MONTHLY
  })
  @IsOptional()
  @IsEnum(ScheduleFrequency)
  frequency?: ScheduleFrequency;

  @ApiProperty({
    description: 'Start date',
    example: '2024-01-15'
  })
  @IsDateString()
  start_date!: string;

  @ApiPropertyOptional({
    description: 'End date (optional for recurring schedules)',
    example: '2024-12-31'
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({
    description: 'Next run date',
    example: '2024-01-15T00:00:00Z'
  })
  @IsOptional()
  @IsDateString()
  next_run_date?: string;

  @ApiPropertyOptional({
    description: 'Is active',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Amount (optional)',
    example: 150.00,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @ApiPropertyOptional({
    description: 'Description',
    example: 'Monthly service invoice'
  })
  @IsOptional()
  @IsString()
  description?: string;
}


