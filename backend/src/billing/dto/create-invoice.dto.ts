import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsNumber, IsArray, IsUUID, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled'
}

export class CreateInvoiceItemDto {
  @ApiProperty({ 
    description: 'Service type ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  service_type_id!: string;

  @ApiProperty({ 
    description: 'Item description',
    example: 'Monthly Pest Control Service'
  })
  @IsString()
  description!: string;

  @ApiProperty({ 
    description: 'Quantity',
    example: 1,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  quantity!: number;

  @ApiProperty({ 
    description: 'Unit price',
    example: 150.00,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  unit_price!: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ 
    description: 'Account ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  account_id!: string;

  @ApiPropertyOptional({ 
    description: 'Service agreement ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID()
  service_agreement_id?: string;

  @ApiPropertyOptional({ 
    description: 'Work order ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID()
  work_order_id?: string;

  @ApiPropertyOptional({ 
    description: 'Job ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsOptional()
  @IsUUID()
  job_id?: string;

  @ApiProperty({ 
    description: 'Invoice number (auto-generated if not provided)',
    example: 'INV-2024-001'
  })
  @IsOptional()
  @IsString()
  invoice_number?: string;

  @ApiProperty({ 
    description: 'Issue date',
    example: '2024-01-15'
  })
  @IsDateString()
  issue_date!: string;

  @ApiProperty({ 
    description: 'Due date',
    example: '2024-02-14'
  })
  @IsDateString()
  due_date!: string;

  @ApiPropertyOptional({ 
    description: 'Invoice notes',
    example: 'Thank you for your business!'
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ 
    description: 'Invoice items',
    type: [CreateInvoiceItemDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items!: CreateInvoiceItemDto[];
}
