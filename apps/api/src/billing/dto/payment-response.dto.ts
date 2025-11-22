import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty({ description: 'Payment ID' })
  id!: string;

  @ApiProperty({ description: 'Tenant ID' })
  tenant_id!: string;

  @ApiProperty({ description: 'Invoice ID' })
  invoice_id!: string;

  @ApiProperty({ description: 'Payment method ID' })
  payment_method_id!: string;

  @ApiProperty({ description: 'Payment amount' })
  amount!: number;

  @ApiProperty({ description: 'Payment date' })
  payment_date!: Date;

  @ApiPropertyOptional({ description: 'Reference number' })
  reference_number?: string;

  @ApiPropertyOptional({ description: 'Payment notes' })
  notes?: string;

  @ApiProperty({ description: 'Created at' })
  created_at!: Date;

  @ApiProperty({ description: 'Created by user ID' })
  created_by!: string;

  @ApiProperty({ description: 'Payment method information' })
  payment_methods!: {
    id: string;
    payment_type: string;
    payment_name?: string;
    card_type?: string;
    card_last4?: string;
    card_expiry?: string;
    account_number?: string;
    routing_number?: string;
  };

  @ApiProperty({ description: 'Invoice information' })
  Invoice!: {
    id: string;
    invoice_number: string;
    total_amount: number;
    status: string;
  };
}

