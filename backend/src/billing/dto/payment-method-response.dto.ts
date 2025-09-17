import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethodType } from './create-payment-method.dto';

export class PaymentMethodResponseDto {
  @ApiProperty({ description: 'Payment method ID' })
  id!: string;

  @ApiProperty({ description: 'Tenant ID' })
  tenant_id!: string;

  @ApiProperty({ description: 'Account ID' })
  account_id!: string;

  @ApiProperty({ description: 'Payment type', enum: PaymentMethodType })
  payment_type!: PaymentMethodType;

  @ApiPropertyOptional({ description: 'Payment method name' })
  payment_name?: string;

  @ApiPropertyOptional({ description: 'Account number (masked)' })
  account_number?: string;

  @ApiPropertyOptional({ description: 'Routing number' })
  routing_number?: string;

  @ApiPropertyOptional({ description: 'Card type' })
  card_type?: string;

  @ApiPropertyOptional({ description: 'Last 4 digits of card' })
  card_last4?: string;

  @ApiPropertyOptional({ description: 'Card expiry date' })
  card_expiry?: string;

  @ApiProperty({ description: 'Is default payment method' })
  is_default!: boolean;

  @ApiProperty({ description: 'Is active' })
  is_active!: boolean;

  @ApiProperty({ description: 'Created at' })
  created_at!: Date;

  @ApiPropertyOptional({ description: 'Account information' })
  account?: {
    id: string;
    name: string;
    email?: string;
  };
}
