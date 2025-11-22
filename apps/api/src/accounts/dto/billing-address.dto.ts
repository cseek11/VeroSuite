import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, Length, Matches } from 'class-validator';

export class BillingAddressDto {
  @ApiProperty({ 
    description: 'Address line 1',
    example: '123 Main Street',
    maxLength: 255
  })
  @IsString()
  @Length(1, 255, { message: 'Address line 1 must be between 1 and 255 characters' })
  address_line1!: string;

  @ApiPropertyOptional({ 
    description: 'Address line 2',
    example: 'Suite 100',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @Length(1, 255, { message: 'Address line 2 must be between 1 and 255 characters' })
  address_line2?: string;

  @ApiProperty({ 
    description: 'City',
    example: 'Pittsburgh',
    maxLength: 100
  })
  @IsString()
  @Length(1, 100, { message: 'City must be between 1 and 100 characters' })
  city!: string;

  @ApiProperty({ 
    description: 'State code',
    example: 'PA',
    pattern: '^[A-Z]{2}$'
  })
  @IsString()
  @Length(2, 2, { message: 'State must be exactly 2 characters' })
  @Matches(/^[A-Z]{2}$/, { message: 'State must be a 2-letter uppercase code' })
  state!: string;

  @ApiProperty({ 
    description: 'Postal code',
    example: '15213',
    pattern: '^\\d{5}(-\\d{4})?$'
  })
  @IsString()
  @Length(5, 10, { message: 'Postal code must be between 5 and 10 characters' })
  @Matches(/^\d{5}(-\d{4})?$/, { message: 'Invalid postal code format' })
  postal_code!: string;
}
