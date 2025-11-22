import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsUUID, IsOptional, IsString } from 'class-validator';

export class SendReminderDto {
  @ApiPropertyOptional({
    description: 'Invoice ID (for single reminder)',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID()
  invoice_id?: string;

  @ApiPropertyOptional({
    description: 'Array of invoice IDs (for bulk reminders)',
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001']
  })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  invoice_ids?: string[];

  @ApiPropertyOptional({
    description: 'Custom reminder message',
    example: 'Friendly reminder about your overdue invoice'
  })
  @IsOptional()
  @IsString()
  message?: string;
}

