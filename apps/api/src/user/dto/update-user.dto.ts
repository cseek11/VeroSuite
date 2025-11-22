import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsPhoneNumber, Length, MaxLength, Matches, IsArray, IsDateString, IsEnum, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  // Note: email is intentionally excluded from updates - it should not be changed
  @ApiPropertyOptional({ 
    description: 'First name',
    example: 'John',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'First name must be between 1 and 100 characters' })
  @Matches(/^[a-zA-Z\s\-']+$/, { message: 'First name can only contain letters, spaces, hyphens, and apostrophes' })
  first_name?: string;

  @ApiPropertyOptional({ 
    description: 'Last name',
    example: 'Doe',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'Last name must be between 1 and 100 characters' })
  @Matches(/^[a-zA-Z\s\-']+$/, { message: 'Last name can only contain letters, spaces, hyphens, and apostrophes' })
  last_name?: string;

  @ApiPropertyOptional({ 
    description: 'Phone number',
    example: '+1-412-555-0123'
  })
  @IsOptional()
  @ValidateIf((o) => o.phone !== undefined && o.phone !== null && o.phone !== '')
  @IsPhoneNumber('US', { message: 'Please provide a valid US phone number' })
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'Employee ID',
    example: 'EMP001',
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Employee ID must not exceed 20 characters' })
  employee_id?: string;

  @ApiPropertyOptional({ 
    description: 'Hire date',
    example: '2024-01-15'
  })
  @IsOptional()
  @ValidateIf((o) => o.hire_date !== undefined && o.hire_date !== null && o.hire_date !== '')
  @IsDateString({}, { message: 'Hire date must be a valid date in YYYY-MM-DD format' })
  hire_date?: string;

  @ApiPropertyOptional({ 
    description: 'Position',
    example: 'Senior Technician',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Position must not exceed 100 characters' })
  position?: string;

  @ApiPropertyOptional({ 
    description: 'Department',
    example: 'Field Operations',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Department must not exceed 100 characters' })
  department?: string;

  @ApiPropertyOptional({ 
    description: 'Employment type',
    example: 'full_time',
    enum: ['full_time', 'part_time', 'contractor', 'temporary']
  })
  @IsOptional()
  @IsEnum(['full_time', 'part_time', 'contractor', 'temporary'], {
    message: 'Employment type must be one of: full_time, part_time, contractor, temporary'
  })
  employment_type?: string;

  @ApiPropertyOptional({ 
    description: 'User status',
    example: 'active',
    enum: ['active', 'inactive', 'suspended']
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended'], {
    message: 'Status must be one of: active, inactive, suspended'
  })
  status?: string;

  @ApiPropertyOptional({ 
    description: 'User roles',
    example: ['technician', 'dispatcher'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[];

  @ApiPropertyOptional({ 
    description: 'Custom permissions (resource:action format)',
    example: ['jobs:assign', 'customers:view'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  custom_permissions?: string[];

  @ApiPropertyOptional({ 
    description: 'Emergency contact name',
    example: 'Jane Doe',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Emergency contact name must not exceed 100 characters' })
  emergency_contact_name?: string;

  @ApiPropertyOptional({ 
    description: 'Emergency contact phone',
    example: '+1-412-555-0123'
  })
  @IsOptional()
  @ValidateIf((o) => o.emergency_contact_phone !== undefined && o.emergency_contact_phone !== null && o.emergency_contact_phone !== '')
  @IsPhoneNumber('US', { message: 'Please provide a valid US phone number' })
  emergency_contact_phone?: string;

  @ApiPropertyOptional({ 
    description: 'Emergency contact relationship',
    example: 'Spouse',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Emergency contact relationship must not exceed 50 characters' })
  emergency_contact_relationship?: string;

  @ApiPropertyOptional({ 
    description: 'Address line 1',
    example: '123 Main St',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Address line 1 must not exceed 255 characters' })
  address_line1?: string;

  @ApiPropertyOptional({ 
    description: 'Address line 2',
    example: 'Apt 4B',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Address line 2 must not exceed 255 characters' })
  address_line2?: string;

  @ApiPropertyOptional({ 
    description: 'City',
    example: 'Pittsburgh',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'City must not exceed 100 characters' })
  city?: string;

  @ApiPropertyOptional({ 
    description: 'State (2-letter code)',
    example: 'PA',
    maxLength: 2
  })
  @IsOptional()
  @ValidateIf((o) => o.state !== undefined && o.state !== null && o.state !== '')
  @IsString()
  @Length(2, 2, { message: 'State must be exactly 2 characters' })
  @Matches(/^[A-Z]{2}$/, { message: 'State must be a 2-letter uppercase code' })
  state?: string;

  @ApiPropertyOptional({ 
    description: 'Postal code',
    example: '15213',
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Postal code must not exceed 20 characters' })
  postal_code?: string;

  @ApiPropertyOptional({ 
    description: 'Country',
    example: 'US',
    default: 'US',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Country must not exceed 100 characters' })
  country?: string;

  @ApiPropertyOptional({ 
    description: 'Date of birth',
    example: '1990-05-15'
  })
  @IsOptional()
  @ValidateIf((o) => o.date_of_birth !== undefined && o.date_of_birth !== null && o.date_of_birth !== '')
  @IsDateString({}, { message: 'Date of birth must be a valid date in YYYY-MM-DD format' })
  date_of_birth?: string;

  /**
   * Social Security Number (encrypted at rest)
   * Format: XXX-XX-XXXX
   */
  @ApiPropertyOptional({ 
    description: 'Social Security Number (encrypted at rest)',
    example: '123-45-6789',
    maxLength: 11
  })
  @IsOptional()
  @ValidateIf((o) => o.social_security_number !== undefined && o.social_security_number !== null && o.social_security_number !== '')
  @IsString()
  @Matches(/^\d{3}-\d{2}-\d{4}$/, { message: 'SSN must be in format XXX-XX-XXXX' })
  social_security_number?: string;

  /**
   * Driver License Number (encrypted at rest)
   */
  @ApiPropertyOptional({ 
    description: 'Driver License Number (encrypted at rest)',
    example: 'D1234567',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Driver license number must not exceed 50 characters' })
  driver_license_number?: string;

  @ApiPropertyOptional({ 
    description: 'Driver License State (2-letter code)',
    example: 'PA',
    maxLength: 2
  })
  @IsOptional()
  @ValidateIf((o) => o.driver_license_state !== undefined && o.driver_license_state !== null && o.driver_license_state !== '')
  @IsString()
  @Length(2, 2, { message: 'Driver license state must be exactly 2 characters' })
  @Matches(/^[A-Z]{2}$/, { message: 'Driver license state must be a 2-letter uppercase code' })
  driver_license_state?: string;

  @ApiPropertyOptional({ 
    description: 'Driver License Expiry Date',
    example: '2028-05-15'
  })
  @IsOptional()
  @ValidateIf((o) => o.driver_license_expiry !== undefined && o.driver_license_expiry !== null && o.driver_license_expiry !== '')
  @IsDateString({}, { message: 'Driver license expiry must be a valid date in YYYY-MM-DD format' })
  driver_license_expiry?: string;

  @ApiPropertyOptional({ 
    description: 'Qualifications/Certifications',
    example: ['Pest Control License', 'Safety Certified'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  qualifications?: string[];

  @ApiPropertyOptional({ 
    description: 'Technician number',
    example: 'TECH001',
    maxLength: 50
  })
  @IsOptional()
  @ValidateIf((o) => o.technician_number !== undefined && o.technician_number !== null && o.technician_number !== '')
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
  @ValidateIf((o) => o.pesticide_license_number !== undefined && o.pesticide_license_number !== null && o.pesticide_license_number !== '')
  @IsString()
  @Length(1, 50, { message: 'Pesticide license number must be between 1 and 50 characters' })
  pesticide_license_number?: string;

  @ApiPropertyOptional({ 
    description: 'License expiration date',
    example: '2025-12-31'
  })
  @IsOptional()
  @ValidateIf((o) => o.license_expiration_date !== undefined && o.license_expiration_date !== null && o.license_expiration_date !== '')
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'License expiration date must be in YYYY-MM-DD format' })
  license_expiration_date?: string;
}
