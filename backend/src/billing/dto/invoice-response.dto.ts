import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceStatus } from './create-invoice.dto';

export class InvoiceItemResponseDto {
  @ApiProperty({ description: 'Item ID' })
  id!: string;

  @ApiProperty({ description: 'Service type ID' })
  service_type_id!: string;

  @ApiProperty({ description: 'Item description' })
  description!: string;

  @ApiProperty({ description: 'Quantity' })
  quantity!: number;

  @ApiProperty({ description: 'Unit price' })
  unit_price!: number;

  @ApiProperty({ description: 'Total price' })
  total_price!: number;

  @ApiProperty({ description: 'Created at' })
  created_at!: Date;
}

export class InvoiceResponseDto {
  @ApiProperty({ description: 'Invoice ID' })
  id!: string;

  @ApiProperty({ description: 'Tenant ID' })
  tenant_id!: string;

  @ApiProperty({ description: 'Account ID' })
  account_id!: string;

  @ApiPropertyOptional({ description: 'Service agreement ID' })
  service_agreement_id?: string;

  @ApiPropertyOptional({ description: 'Work order ID' })
  work_order_id?: string;

  @ApiPropertyOptional({ description: 'Job ID' })
  job_id?: string;

  @ApiProperty({ description: 'Invoice number' })
  invoice_number!: string;

  @ApiProperty({ description: 'Invoice status', enum: InvoiceStatus })
  status!: InvoiceStatus;

  @ApiProperty({ description: 'Issue date' })
  issue_date!: Date;

  @ApiProperty({ description: 'Due date' })
  due_date!: Date;

  @ApiProperty({ description: 'Subtotal amount' })
  subtotal!: number;

  @ApiProperty({ description: 'Tax amount' })
  tax_amount!: number;

  @ApiProperty({ description: 'Total amount' })
  total_amount!: number;

  @ApiPropertyOptional({ description: 'Invoice notes' })
  notes?: string;

  @ApiProperty({ description: 'Created at' })
  created_at!: Date;

  @ApiProperty({ description: 'Updated at' })
  updated_at!: Date;

  @ApiProperty({ description: 'Created by user ID' })
  created_by!: string;

  @ApiProperty({ description: 'Updated by user ID' })
  updated_by!: string;

  @ApiProperty({ description: 'Invoice items', type: [InvoiceItemResponseDto] })
  InvoiceItem!: InvoiceItemResponseDto[];

  @ApiPropertyOptional({ description: 'Account information' })
  accounts?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };

  @ApiPropertyOptional({ description: 'Payment information' })
  Payment?: Array<{
    id: string;
    amount: number;
    payment_date: Date;
    payment_methods: {
      payment_type: string;
      payment_name?: string;
    };
  }>;
}
