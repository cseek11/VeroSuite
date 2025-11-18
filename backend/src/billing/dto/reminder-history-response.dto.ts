import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ReminderType {
  EMAIL = 'email',
  SMS = 'sms',
  LETTER = 'letter'
}

export enum ReminderStatus {
  SENT = 'sent',
  FAILED = 'failed',
  PENDING = 'pending'
}

export class ReminderHistoryResponseDto {
  @ApiProperty({ description: 'Reminder history ID' })
  id!: string;

  @ApiProperty({ description: 'Tenant ID' })
  tenant_id!: string;

  @ApiProperty({ description: 'Invoice ID' })
  invoice_id!: string;

  @ApiProperty({ description: 'Invoice number' })
  invoice_number!: string;

  @ApiPropertyOptional({ description: 'Customer name' })
  customer_name?: string;

  @ApiProperty({ description: 'Reminder type', enum: ReminderType })
  reminder_type!: ReminderType;

  @ApiProperty({ description: 'Status', enum: ReminderStatus })
  status!: ReminderStatus;

  @ApiPropertyOptional({ description: 'Message' })
  message?: string;

  @ApiProperty({ description: 'Sent at' })
  sent_at!: Date;

  @ApiProperty({ description: 'Created by user ID' })
  created_by!: string;
}


