import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsUUID, IsBoolean, IsNumber, Min, IsEnum } from 'class-validator';
import { ScheduleType, ScheduleFrequency } from './create-invoice-schedule.dto';

export class UpdateInvoiceScheduleDto {
  @ApiPropertyOptional({
    description: 'Account ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID()
  account_id?: string;

  @ApiPropertyOptional({
    description: 'Template ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID()
  template_id?: string;

  @ApiPropertyOptional({
    description: 'Schedule type',
    enum: ScheduleType
  })
  @IsOptional()
  @IsEnum(ScheduleType)
  schedule_type?: ScheduleType;

  @ApiPropertyOptional({
    description: 'Frequency',
    enum: ScheduleFrequency
  })
  @IsOptional()
  @IsEnum(ScheduleFrequency)
  frequency?: ScheduleFrequency;

  @ApiPropertyOptional({
    description: 'Start date',
    example: '2024-01-15'
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'End date',
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
    example: true
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Amount',
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


