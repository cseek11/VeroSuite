import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsPhoneNumber, Length, MaxLength, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ 
    description: 'Email address',
    example: 'user@example.com',
    maxLength: 255
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  email!: string;

  @ApiProperty({ 
    description: 'First name',
    example: 'John',
    maxLength: 100
  })
  @IsString()
  @Length(1, 100, { message: 'First name must be between 1 and 100 characters' })
  @Matches(/^[a-zA-Z\s\-']+$/, { message: 'First name can only contain letters, spaces, hyphens, and apostrophes' })
  first_name!: string;

  @ApiProperty({ 
    description: 'Last name',
    example: 'Doe',
    maxLength: 100
  })
  @IsString()
  @Length(1, 100, { message: 'Last name must be between 1 and 100 characters' })
  @Matches(/^[a-zA-Z\s\-']+$/, { message: 'Last name can only contain letters, spaces, hyphens, and apostrophes' })
  last_name!: string;

  @ApiPropertyOptional({ 
    description: 'Phone number',
    example: '+1-412-555-0123'
  })
  @IsOptional()
  @IsPhoneNumber('US', { message: 'Please provide a valid US phone number' })
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'Technician number',
    example: 'TECH001',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'Technician number must be between 1 and 50 characters' })
  @Matches(/^[A-Z0-9\-_]+$/, { message: 'Technician number must contain only uppercase letters, numbers, hyphens, and underscores' })
  technician_number?: string;

  @ApiPropertyOptional({ 
    description: 'Pesticide license number',
    example: 'LIC123456',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'Pesticide license number must be between 1 and 50 characters' })
  pesticide_license_number?: string;

  @ApiPropertyOptional({ 
    description: 'License expiration date',
    example: '2025-12-31'
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'License expiration date must be in YYYY-MM-DD format' })
  license_expiration_date?: string;
}
