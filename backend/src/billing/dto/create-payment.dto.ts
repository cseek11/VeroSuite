import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsDateString, IsUUID, Min } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ 
    description: 'Invoice ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  invoice_id!: string;

  @ApiProperty({ 
    description: 'Payment method ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  payment_method_id!: string;

  @ApiProperty({ 
    description: 'Payment amount',
    example: 150.00,
    minimum: 0.01
  })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({ 
    description: 'Payment date',
    example: '2024-01-15'
  })
  @IsDateString()
  payment_date!: string;

  @ApiPropertyOptional({ 
    description: 'Reference number (check number, transaction ID, etc.)',
    example: 'CHK-001234'
  })
  @IsOptional()
  @IsString()
  reference_number?: string;

  @ApiPropertyOptional({ 
    description: 'Payment notes',
    example: 'Payment received via check'
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

