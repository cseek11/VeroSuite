import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsString, IsEnum } from 'class-validator';
import { InvoiceStatus } from './create-invoice.dto';

export class UpdateInvoiceDto {
  @ApiPropertyOptional({ 
    description: 'Invoice status',
    enum: InvoiceStatus
  })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @ApiPropertyOptional({ 
    description: 'Issue date',
    example: '2024-01-15'
  })
  @IsOptional()
  @IsDateString()
  issue_date?: string;

  @ApiPropertyOptional({ 
    description: 'Due date',
    example: '2024-02-14'
  })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  @ApiPropertyOptional({ 
    description: 'Invoice notes',
    example: 'Thank you for your business!'
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
