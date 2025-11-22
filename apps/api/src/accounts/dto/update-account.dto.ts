import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsEmail, IsPhoneNumber, Length, Matches, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BillingAddressDto } from './billing-address.dto';
import { AccountType } from './create-account.dto';

export class UpdateAccountDto {
  @ApiPropertyOptional({ 
    description: 'Account name',
    example: 'Downtown Restaurant Group',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @Length(1, 255, { message: 'Account name must be between 1 and 255 characters' })
  @Matches(/^[a-zA-Z0-9\s\-_&.,()]+$/, { message: 'Account name contains invalid characters' })
  name?: string;

  @ApiPropertyOptional({ 
    enum: AccountType,
    description: 'Type of account'
  })
  @IsOptional()
  @IsEnum(AccountType, { message: 'Invalid account type' })
  account_type?: AccountType;

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
