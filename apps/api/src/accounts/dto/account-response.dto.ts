import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponseDto, PaginatedResponseDto } from '../../common/dto/base-response.dto';
// Import AccountType from create-account.dto.ts to avoid duplication
import { AccountType } from './create-account.dto';

export class BillingAddressResponseDto {
  @ApiProperty({ description: 'Address line 1' })
  address_line1!: string;

  @ApiPropertyOptional({ description: 'Address line 2' })
  address_line2?: string;

  @ApiProperty({ description: 'City' })
  city!: string;

  @ApiProperty({ description: 'State (2-letter code)' })
  state!: string;

  @ApiProperty({ description: 'Postal code' })
  postal_code!: string;
}

export class AccountResponseDto {
  @ApiProperty({ description: 'Account ID' })
  id!: string;

  @ApiProperty({ description: 'Account name' })
  name!: string;

  @ApiProperty({ description: 'Account type', enum: AccountType })
  account_type!: AccountType;

  @ApiPropertyOptional({ description: 'Primary phone number' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Primary email' })
  email?: string;

  @ApiPropertyOptional({ description: 'Billing address' })
  billing_address?: BillingAddressResponseDto;

  @ApiProperty({ description: 'Tenant ID' })
  tenant_id!: string;

  @ApiProperty({ description: 'Account creation timestamp' })
  created_at!: string;

  @ApiProperty({ description: 'Account last update timestamp' })
  updated_at!: string;
}

export class AccountListResponseDto extends PaginatedResponseDto<AccountResponseDto> {
  @ApiProperty({ description: 'List of accounts', type: [AccountResponseDto] })
  override data!: AccountResponseDto[];

  constructor(
    accounts: AccountResponseDto[],
    pagination: { page: number; limit: number; total: number },
    message: string = 'Accounts retrieved successfully'
  ) {
    super(accounts, pagination, message);
  }
}

export class AccountDetailResponseDto extends BaseResponseDto<AccountResponseDto> {
  @ApiProperty({ description: 'Account details' })
  override data!: AccountResponseDto;

  constructor(account: AccountResponseDto, message: string = 'Account retrieved successfully') {
    super(account, message, true);
  }
}

export class AccountCreateResponseDto extends BaseResponseDto<AccountResponseDto> {
  @ApiProperty({ description: 'Created account' })
  override data!: AccountResponseDto;

  constructor(account: AccountResponseDto, message: string = 'Account created successfully') {
    super(account, message, true);
  }
}

export class AccountUpdateResponseDto extends BaseResponseDto<AccountResponseDto> {
  @ApiProperty({ description: 'Updated account' })
  override data!: AccountResponseDto;

  constructor(account: AccountResponseDto, message: string = 'Account updated successfully') {
    super(account, message, true);
  }
}

export class AccountDeleteResponseDto extends BaseResponseDto<{ id: string }> {
  @ApiProperty({ description: 'Deleted account ID' })
  override data!: { id: string };

  constructor(accountId: string, message: string = 'Account deleted successfully') {
    super({ id: accountId }, message, true);
  }
}
