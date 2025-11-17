import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';

export enum RecurringPaymentInterval {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  WEEKLY = 'weekly',
}

export class CreateRecurringPaymentDto {
  @ApiProperty({
    description: 'Invoice ID to create recurring payment for',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  invoice_id: string;

  @ApiProperty({
    description: 'Recurring payment interval',
    enum: RecurringPaymentInterval,
    example: RecurringPaymentInterval.MONTHLY,
  })
  @IsEnum(RecurringPaymentInterval)
  interval: RecurringPaymentInterval;

  @ApiProperty({
    description: 'Amount to charge per interval',
    example: 99.99,
  })
  @IsNumber()
  @Min(0.5)
  amount: number;

  @ApiPropertyOptional({
    description: 'Start date for recurring payments (ISO date string)',
    example: '2025-12-01',
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({
    description: 'End date for recurring payments (ISO date string). If not provided, payments continue indefinitely.',
    example: '2026-12-01',
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiPropertyOptional({
    description: 'Number of payments to make before stopping',
    example: 12,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  payment_count?: number;
}

