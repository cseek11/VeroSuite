import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID, IsDateString, Length, Matches, IsPhoneNumber } from 'class-validator';

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACTOR = 'contractor',
  TEMPORARY = 'temporary'
}

export enum TechnicianStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TERMINATED = 'terminated',
  ON_LEAVE = 'on_leave'
}

export class CreateTechnicianProfileDto {
  @ApiProperty({ 
    description: 'User ID from auth system',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID(4, { message: 'Invalid user ID format' })
  user_id!: string;

  @ApiProperty({ 
    description: 'Employee ID',
    example: 'EMP001',
    maxLength: 50
  })
  @IsString()
  @Length(1, 50, { message: 'Employee ID must be between 1 and 50 characters' })
  @Matches(/^[A-Z0-9\-_]+$/, { message: 'Employee ID must contain only uppercase letters, numbers, hyphens, and underscores' })
  employee_id!: string;

  @ApiProperty({ 
    description: 'Hire date',
    example: '2025-01-15'
  })
  @IsDateString({}, { message: 'Invalid hire date format' })
  hire_date!: string;

  @ApiProperty({ 
    description: 'Job position',
    example: 'Senior Technician',
    maxLength: 100
  })
  @IsString()
  @Length(1, 100, { message: 'Position must be between 1 and 100 characters' })
  position!: string;

  @ApiProperty({ 
    description: 'Department',
    example: 'Field Operations',
    maxLength: 100
  })
  @IsString()
  @Length(1, 100, { message: 'Department must be between 1 and 100 characters' })
  department!: string;

  @ApiProperty({ 
    enum: EmploymentType,
    description: 'Employment type',
    default: EmploymentType.FULL_TIME
  })
  @IsEnum(EmploymentType, { message: 'Invalid employment type' })
  employment_type!: EmploymentType;

  @ApiProperty({ 
    enum: TechnicianStatus,
    description: 'Technician status',
    default: TechnicianStatus.ACTIVE
  })
  @IsEnum(TechnicianStatus, { message: 'Invalid technician status' })
  status!: TechnicianStatus;

  @ApiProperty({ 
    description: 'Emergency contact name',
    example: 'John Doe',
    maxLength: 100
  })
  @IsString()
  @Length(1, 100, { message: 'Emergency contact name must be between 1 and 100 characters' })
  emergency_contact_name!: string;

  @ApiProperty({ 
    description: 'Emergency contact phone',
    example: '+1-412-555-0123'
  })
  @IsPhoneNumber('US', { message: 'Please provide a valid US phone number' })
  emergency_contact_phone!: string;

  @ApiProperty({ 
    description: 'Emergency contact relationship',
    example: 'Spouse',
    maxLength: 50
  })
  @IsString()
  @Length(1, 50, { message: 'Emergency contact relationship must be between 1 and 50 characters' })
  emergency_contact_relationship!: string;

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

  @ApiProperty({ 
    description: 'Country',
    example: 'USA',
    maxLength: 100,
    default: 'USA'
  })
  @IsString()
  @Length(1, 100, { message: 'Country must be between 1 and 100 characters' })
  country!: string;

  @ApiProperty({ 
    description: 'Date of birth',
    example: '1990-01-15'
  })
  @IsDateString({}, { message: 'Invalid date of birth format' })
  date_of_birth!: string;

  @ApiProperty({ 
    description: 'Social Security Number (full format)',
    example: '123-45-6789',
    pattern: '^\\d{3}-\\d{2}-\\d{4}$'
  })
  @IsString()
  @Length(11, 11, { message: 'SSN must be in format XXX-XX-XXXX' })
  @Matches(/^\d{3}-\d{2}-\d{4}$/, { message: 'SSN must be in format XXX-XX-XXXX' })
  social_security_number!: string;

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
