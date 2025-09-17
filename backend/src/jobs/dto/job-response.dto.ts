import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseResponseDto, PaginatedResponseDto } from '../../common/dto/base-response.dto';

export class PhotoResponseDto {
  @ApiProperty({ description: 'Photo URL or base64 data' })
  url!: string;

  @ApiProperty({ description: 'Photo type', enum: ['before', 'after', 'service', 'damage'] })
  type!: 'before' | 'after' | 'service' | 'damage';

  @ApiProperty({ description: 'Photo upload timestamp' })
  uploaded_at!: string;
}

export class JobResponseDto {
  @ApiProperty({ description: 'Job ID' })
  id!: string;

  @ApiProperty({ description: 'Job title' })
  title!: string;

  @ApiProperty({ description: 'Job description' })
  description!: string;

  @ApiProperty({ description: 'Job priority', enum: ['low', 'medium', 'high', 'urgent'] })
  priority!: 'low' | 'medium' | 'high' | 'urgent';

  @ApiProperty({ description: 'Job status', enum: ['pending', 'in_progress', 'completed', 'cancelled'] })
  status!: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @ApiPropertyOptional({ description: 'Assigned technician ID' })
  technician_id?: string;

  @ApiPropertyOptional({ description: 'Assigned technician name' })
  technician_name?: string;

  @ApiPropertyOptional({ description: 'Account ID' })
  account_id?: string;

  @ApiPropertyOptional({ description: 'Account name' })
  account_name?: string;

  @ApiPropertyOptional({ description: 'Scheduled date' })
  scheduled_date?: string;

  @ApiPropertyOptional({ description: 'Completion date' })
  completion_date?: string;

  @ApiProperty({ description: 'Job photos', type: [PhotoResponseDto] })
  photos!: PhotoResponseDto[];

  @ApiProperty({ description: 'Tenant ID' })
  tenant_id!: string;

  @ApiProperty({ description: 'Job creation timestamp' })
  created_at!: string;

  @ApiProperty({ description: 'Job last update timestamp' })
  updated_at!: string;
}

export class JobListResponseDto extends PaginatedResponseDto<JobResponseDto> {
  @ApiProperty({ description: 'List of jobs', type: [JobResponseDto] })
  override data!: JobResponseDto[];

  constructor(
    jobs: JobResponseDto[],
    pagination: { page: number; limit: number; total: number },
    message: string = 'Jobs retrieved successfully'
  ) {
    super(jobs, pagination, message);
  }
}

export class JobDetailResponseDto extends BaseResponseDto<JobResponseDto> {
  @ApiProperty({ description: 'Job details' })
  override data!: JobResponseDto;

  constructor(job: JobResponseDto, message: string = 'Job retrieved successfully') {
    super(job, message, true);
  }
}

export class JobCreateResponseDto extends BaseResponseDto<JobResponseDto> {
  @ApiProperty({ description: 'Created job' })
  override data!: JobResponseDto;

  constructor(job: JobResponseDto, message: string = 'Job created successfully') {
    super(job, message, true);
  }
}

export class JobUpdateResponseDto extends BaseResponseDto<JobResponseDto> {
  @ApiProperty({ description: 'Updated job' })
  override data!: JobResponseDto;

  constructor(job: JobResponseDto, message: string = 'Job updated successfully') {
    super(job, message, true);
  }
}

export class JobAssignResponseDto extends BaseResponseDto<JobResponseDto> {
  @ApiProperty({ description: 'Assigned job' })
  override data!: JobResponseDto;

  constructor(job: JobResponseDto, message: string = 'Job assigned successfully') {
    super(job, message, true);
  }
}

export class JobPhotosUpdateResponseDto extends BaseResponseDto<{ photos: PhotoResponseDto[] }> {
  @ApiProperty({ description: 'Updated job photos' })
  override data!: { photos: PhotoResponseDto[] };

  constructor(photos: PhotoResponseDto[], message: string = 'Job photos updated successfully') {
    super({ photos }, message, true);
  }
}

export class JobDeleteResponseDto extends BaseResponseDto<{ id: string }> {
  @ApiProperty({ description: 'Deleted job ID' })
  override data!: { id: string };

  constructor(jobId: string, message: string = 'Job deleted successfully') {
    super({ id: jobId }, message, true);
  }
}
