import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, Length, Matches, IsPhoneNumber } from 'class-validator';
import { EmploymentType, TechnicianStatus } from './create-technician-profile.dto';

export class UpdateTechnicianProfileDto {
  @ApiPropertyOptional({ 
    description: 'Employee ID',
    example: 'EMP001',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'Employee ID must be between 1 and 50 characters' })
  @Matches(/^[A-Z0-9\-_]+$/, { message: 'Employee ID must contain only uppercase letters, numbers, hyphens, and underscores' })
  employee_id?: string;

  @ApiPropertyOptional({ 
    description: 'Hire date',
    example: '2025-01-15'
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid hire date format' })
  hire_date?: string;

  @ApiPropertyOptional({ 
    description: 'Job position',
    example: 'Senior Technician',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'Position must be between 1 and 100 characters' })
  position?: string;

  @ApiPropertyOptional({ 
    description: 'Department',
    example: 'Field Operations',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'Department must be between 1 and 100 characters' })
  department?: string;

  @ApiPropertyOptional({ 
    enum: EmploymentType,
    description: 'Employment type'
  })
  @IsOptional()
  @IsEnum(EmploymentType, { message: 'Invalid employment type' })
  employment_type?: EmploymentType;

  @ApiPropertyOptional({ 
    enum: TechnicianStatus,
    description: 'Technician status'
  })
  @IsOptional()
  @IsEnum(TechnicianStatus, { message: 'Invalid technician status' })
  status?: TechnicianStatus;

  @ApiPropertyOptional({ 
    description: 'Emergency contact name',
    example: 'John Doe',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'Emergency contact name must be between 1 and 100 characters' })
  emergency_contact_name?: string;

  @ApiPropertyOptional({ 
    description: 'Emergency contact phone',
    example: '+1-412-555-0123'
  })
  @IsOptional()
  @IsPhoneNumber('US', { message: 'Please provide a valid US phone number' })
  emergency_contact_phone?: string;

  @ApiPropertyOptional({ 
    description: 'Emergency contact relationship',
    example: 'Spouse',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'Emergency contact relationship must be between 1 and 50 characters' })
  emergency_contact_relationship?: string;

  @ApiPropertyOptional({ 
    description: 'Address line 1',
    example: '123 Main Street',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @Length(1, 255, { message: 'Address line 1 must be between 1 and 255 characters' })
  address_line1?: string;

  @ApiPropertyOptional({ 
    description: 'Address line 2',
    example: 'Suite 100',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @Length(1, 255, { message: 'Address line 2 must be between 1 and 255 characters' })
  address_line2?: string;

  @ApiPropertyOptional({ 
    description: 'City',
    example: 'Pittsburgh',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'City must be between 1 and 100 characters' })
  city?: string;

  @ApiPropertyOptional({ 
    description: 'State code',
    example: 'PA',
    pattern: '^[A-Z]{2}$'
  })
  @IsOptional()
  @IsString()
  @Length(2, 2, { message: 'State must be exactly 2 characters' })
  @Matches(/^[A-Z]{2}$/, { message: 'State must be a 2-letter uppercase code' })
  state?: string;

  @ApiPropertyOptional({ 
    description: 'Postal code',
    example: '15213',
    pattern: '^\\d{5}(-\\d{4})?$'
  })
  @IsOptional()
  @IsString()
  @Length(5, 10, { message: 'Postal code must be between 5 and 10 characters' })
  @Matches(/^\d{5}(-\d{4})?$/, { message: 'Invalid postal code format' })
  postal_code?: string;

  @ApiPropertyOptional({ 
    description: 'Country',
    example: 'USA',
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(1, 100, { message: 'Country must be between 1 and 100 characters' })
  country?: string;

  @ApiPropertyOptional({ 
    description: 'Date of birth',
    example: '1990-01-15'
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid date of birth format' })
  date_of_birth?: string;

  @ApiPropertyOptional({ 
    description: 'Social Security Number (last 4 digits only)',
    example: '1234',
    pattern: '^\\d{4}$'
  })
  @IsOptional()
  @IsString()
  @Length(4, 4, { message: 'SSN must be exactly 4 digits' })
  @Matches(/^\d{4}$/, { message: 'SSN must contain only numbers' })
  social_security_number?: string;

  @ApiPropertyOptional({ 
    description: 'Driver license number',
    example: 'D123456789',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'Driver license number must be between 1 and 50 characters' })
  driver_license_number?: string;

  @ApiPropertyOptional({ 
    description: 'Driver license state',
    example: 'PA',
    pattern: '^[A-Z]{2}$'
  })
  @IsOptional()
  @IsString()
  @Length(2, 2, { message: 'Driver license state must be exactly 2 characters' })
  @Matches(/^[A-Z]{2}$/, { message: 'Driver license state must be a 2-letter uppercase code' })
  driver_license_state?: string;

  @ApiPropertyOptional({ 
    description: 'Driver license expiry date',
    example: '2025-12-31'
  })
  @IsOptional()
  @IsDateString({}, { message: 'Invalid driver license expiry date format' })
  driver_license_expiry?: string;
}
