import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsEnum, IsUUID } from 'class-validator';

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  ACH = 'ach',
  CHECK = 'check',
  CASH = 'cash',
  COD = 'cod'
}

export class CreatePaymentMethodDto {
  @ApiProperty({ 
    description: 'Account ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  account_id!: string;

  @ApiProperty({ 
    description: 'Payment type',
    enum: PaymentMethodType,
    example: PaymentMethodType.CREDIT_CARD
  })
  @IsEnum(PaymentMethodType)
  payment_type!: PaymentMethodType;

  @ApiPropertyOptional({ 
    description: 'Payment method name (e.g., "Visa ending in 4242")',
    example: 'Visa ending in 4242'
  })
  @IsOptional()
  @IsString()
  payment_name?: string;

  @ApiPropertyOptional({ 
    description: 'Account number (for ACH)',
    example: '1234567890'
  })
  @IsOptional()
  @IsString()
  account_number?: string;

  @ApiPropertyOptional({ 
    description: 'Routing number (for ACH)',
    example: '021000021'
  })
  @IsOptional()
  @IsString()
  routing_number?: string;

  @ApiPropertyOptional({ 
    description: 'Card type (for credit/debit cards)',
    example: 'Visa'
  })
  @IsOptional()
  @IsString()
  card_type?: string;

  @ApiPropertyOptional({ 
    description: 'Last 4 digits of card',
    example: '4242'
  })
  @IsOptional()
  @IsString()
  card_last4?: string;

  @ApiPropertyOptional({ 
    description: 'Card expiry date',
    example: '12/25'
  })
  @IsOptional()
  @IsString()
  card_expiry?: string;

  @ApiPropertyOptional({ 
    description: 'Set as default payment method',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;

  @ApiPropertyOptional({ 
    description: 'Payment method is active',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

