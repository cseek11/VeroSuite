import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsEmail, IsPhoneNumber, Length, Matches, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BillingAddressDto } from './billing-address.dto';
import { TenantAware, TenantAwareDto } from '../../common/dto/tenant-aware.dto';
import { DisallowClientField } from '../../common/validators/security-validators';

export enum AccountType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  GOVERNMENT = 'government'
}

@TenantAware()
export class CreateAccountDto extends TenantAwareDto {
  @DisallowClientField()
  override tenant_id?: never;

  @ApiProperty({ 
    description: 'Account name',
    example: 'Downtown Restaurant Group',
    maxLength: 255
  })
  @IsString()
  @Length(1, 255, { message: 'Account name must be between 1 and 255 characters' })
  @Matches(/^[a-zA-Z0-9\s\-_&.,()]+$/, { message: 'Account name contains invalid characters' })
  name!: string;

  @ApiProperty({ 
    enum: AccountType, 
    default: AccountType.COMMERCIAL,
    description: 'Type of account'
  })
  @IsEnum(AccountType, { message: 'Invalid account type' })
  account_type!: AccountType;

  @ApiPropertyOptional({ 
    description: 'Primary phone number',
    example: '+1-412-555-0123'
  })
  @IsOptional()
  @IsPhoneNumber('US', { message: 'Please provide a valid US phone number' })
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'Primary email',
    example: 'contact@restaurant.com',
    maxLength: 255
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email?: string;

  @ApiPropertyOptional({ 
    description: 'Billing address',
    type: BillingAddressDto
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => BillingAddressDto)
  billing_address?: BillingAddressDto;
}
