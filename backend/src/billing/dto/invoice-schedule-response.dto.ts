import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ScheduleType, ScheduleFrequency } from './create-invoice-schedule.dto';

export class InvoiceScheduleResponseDto {
  @ApiProperty({ description: 'Schedule ID' })
  id!: string;

  @ApiProperty({ description: 'Tenant ID' })
  tenant_id!: string;

  @ApiProperty({ description: 'Account ID' })
  account_id!: string;

  @ApiPropertyOptional({ description: 'Template ID' })
  template_id?: string;

  @ApiProperty({ description: 'Schedule type', enum: ScheduleType })
  schedule_type!: ScheduleType;

  @ApiPropertyOptional({ description: 'Frequency', enum: ScheduleFrequency })
  frequency?: ScheduleFrequency;

  @ApiProperty({ description: 'Start date' })
  start_date!: Date;

  @ApiPropertyOptional({ description: 'End date' })
  end_date?: Date;

  @ApiProperty({ description: 'Next run date' })
  next_run_date!: Date;

  @ApiProperty({ description: 'Is active' })
  is_active!: boolean;

  @ApiPropertyOptional({ description: 'Amount' })
  amount?: number;

  @ApiPropertyOptional({ description: 'Description' })
  description?: string;

  @ApiProperty({ description: 'Created at' })
  created_at!: Date;

  @ApiProperty({ description: 'Updated at' })
  updated_at!: Date;

  @ApiProperty({ description: 'Created by user ID' })
  created_by!: string;

  @ApiProperty({ description: 'Updated by user ID' })
  updated_by!: string;

  @ApiPropertyOptional({ description: 'Account information' })
  account?: {
    id: string;
    name: string;
    email?: string;
  };
}


