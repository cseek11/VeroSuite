import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponseDto, PaginatedResponseDto } from '../../common/dto/base-response.dto';

export class TechnicianProfileResponseDto {
  @ApiProperty({ description: 'Technician ID' })
  id!: string;

  @ApiProperty({ description: 'User ID' })
  user_id!: string;

  @ApiPropertyOptional({ description: 'Employee ID' })
  employee_id?: string;

  @ApiProperty({ description: 'Hire date' })
  hire_date!: string;

  @ApiPropertyOptional({ description: 'Position' })
  position?: string;

  @ApiPropertyOptional({ description: 'Department' })
  department?: string;

  @ApiPropertyOptional({ description: 'Employment type' })
  employment_type?: string;

  @ApiProperty({ description: 'Status' })
  status!: string;

  @ApiPropertyOptional({ description: 'Emergency contact name' })
  emergency_contact_name?: string;

  @ApiPropertyOptional({ description: 'Emergency contact phone' })
  emergency_contact_phone?: string;

  @ApiPropertyOptional({ description: 'Emergency contact relationship' })
  emergency_contact_relationship?: string;

  @ApiPropertyOptional({ description: 'Address line 1' })
  address_line1?: string;

  @ApiPropertyOptional({ description: 'Address line 2' })
  address_line2?: string;

  @ApiPropertyOptional({ description: 'City' })
  city?: string;

  @ApiPropertyOptional({ description: 'State' })
  state?: string;

  @ApiPropertyOptional({ description: 'Postal code' })
  postal_code?: string;

  @ApiProperty({ description: 'Country' })
  country!: string;

  @ApiPropertyOptional({ description: 'Date of birth' })
  date_of_birth?: string;

  @ApiPropertyOptional({ description: 'Social security number' })
  social_security_number?: string;

  @ApiPropertyOptional({ description: 'Driver license number' })
  driver_license_number?: string;

  @ApiPropertyOptional({ description: 'Driver license state' })
  driver_license_state?: string;

  @ApiPropertyOptional({ description: 'Driver license expiry' })
  driver_license_expiry?: string;

  @ApiProperty({ description: 'Profile creation timestamp' })
  created_at!: string;

  @ApiProperty({ description: 'Profile last update timestamp' })
  updated_at!: string;

  @ApiPropertyOptional({ description: 'User information', type: Object })
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
    technician_number?: string;
    pesticide_license_number?: string;
    license_expiration_date?: string;
  };
}

export class TechnicianListResponseDto extends PaginatedResponseDto<TechnicianProfileResponseDto> {
  @ApiProperty({ description: 'List of technicians', type: [TechnicianProfileResponseDto] })
  override data!: TechnicianProfileResponseDto[];

  constructor(
    technicians: TechnicianProfileResponseDto[],
    pagination: { page: number; limit: number; total: number },
    message: string = 'Technicians retrieved successfully'
  ) {
    super(technicians, pagination, message);
  }
}

export class TechnicianDetailResponseDto extends BaseResponseDto<TechnicianProfileResponseDto> {
  @ApiProperty({ description: 'Technician profile details' })
  override data!: TechnicianProfileResponseDto;

  constructor(technician: TechnicianProfileResponseDto, message: string = 'Technician profile retrieved successfully') {
    super(technician, message, true);
  }
}

export class TechnicianCreateResponseDto extends BaseResponseDto<TechnicianProfileResponseDto> {
  @ApiProperty({ description: 'Created technician profile' })
  override data!: TechnicianProfileResponseDto;

  constructor(technician: TechnicianProfileResponseDto, message: string = 'Technician profile created successfully') {
    super(technician, message, true);
  }
}

export class TechnicianUpdateResponseDto extends BaseResponseDto<TechnicianProfileResponseDto> {
  @ApiProperty({ description: 'Updated technician profile' })
  override data!: TechnicianProfileResponseDto;

  constructor(technician: TechnicianProfileResponseDto, message: string = 'Technician profile updated successfully') {
    super(technician, message, true);
  }
}

export class TechnicianDeleteResponseDto extends BaseResponseDto<{ id: string }> {
  @ApiProperty({ description: 'Deleted technician ID' })
  override data!: { id: string };

  constructor(technicianId: string, message: string = 'Technician profile deleted successfully') {
    super({ id: technicianId }, message, true);
  }
}