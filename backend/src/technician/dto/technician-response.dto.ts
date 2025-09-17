import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponseDto, PaginatedResponseDto } from '../../common/dto/base-response.dto';

export class TechnicianProfileResponseDto {
  @ApiProperty({ description: 'Technician ID' })
  id!: string;

  @ApiProperty({ description: 'User ID' })
  user_id!: string;

  @ApiProperty({ description: 'First name' })
  first_name!: string;

  @ApiProperty({ description: 'Last name' })
  last_name!: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  phone?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  email?: string;

  @ApiPropertyOptional({ description: 'License number' })
  license_number?: string;

  @ApiPropertyOptional({ description: 'License expiration date' })
  license_expiration?: string;

  @ApiPropertyOptional({ description: 'Specializations', type: [String] })
  specializations?: string[];

  @ApiPropertyOptional({ description: 'Certifications', type: [String] })
  certifications?: string[];

  @ApiProperty({ description: 'Is active technician' })
  is_active!: boolean;

  @ApiProperty({ description: 'Tenant ID' })
  tenant_id!: string;

  @ApiProperty({ description: 'Profile creation timestamp' })
  created_at!: string;

  @ApiProperty({ description: 'Profile last update timestamp' })
  updated_at!: string;
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