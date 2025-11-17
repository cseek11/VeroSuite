import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsBoolean, IsInt, IsEnum, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateAvailabilityDto {
  @ApiProperty({ description: 'Day of week (0=Sunday, 6=Saturday)' })
  @IsInt()
  @Min(0)
  @Max(6)
  day_of_week!: number;

  @ApiProperty({ description: 'Start time (HH:mm format)', example: '09:00' })
  @IsString()
  @IsNotEmpty()
  start_time!: string;

  @ApiProperty({ description: 'End time (HH:mm format)', example: '17:00' })
  @IsString()
  @IsNotEmpty()
  end_time!: string;

  @ApiProperty({ description: 'Whether this availability is active', required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateAvailabilityDto {
  @ApiProperty({ description: 'Start time (HH:mm format)', required: false })
  @IsOptional()
  @IsString()
  start_time?: string;

  @ApiProperty({ description: 'End time (HH:mm format)', required: false })
  @IsOptional()
  @IsString()
  end_time?: string;

  @ApiProperty({ description: 'Whether this availability is active', required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class CreateScheduleDto {
  @ApiProperty({ description: 'Schedule date (ISO string)', example: '2025-01-15' })
  @IsDateString()
  schedule_date!: string;

  @ApiProperty({ description: 'Start time (HH:mm format)', required: false })
  @IsOptional()
  @IsString()
  start_time?: string;

  @ApiProperty({ description: 'End time (HH:mm format)', required: false })
  @IsOptional()
  @IsString()
  end_time?: string;

  @ApiProperty({ description: 'Whether technician is available on this date', required: false })
  @IsOptional()
  @IsBoolean()
  is_available?: boolean;

  @ApiProperty({ description: 'Notes about this schedule', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateTimeOffRequestDto {
  @ApiProperty({ description: 'Start date (ISO string)', example: '2025-01-20' })
  @IsDateString()
  start_date!: string;

  @ApiProperty({ description: 'End date (ISO string)', example: '2025-01-22' })
  @IsDateString()
  end_date!: string;

  @ApiProperty({ 
    description: 'Request type', 
    enum: ['pto', 'sick', 'personal', 'holiday'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['pto', 'sick', 'personal', 'holiday'])
  request_type?: string;

  @ApiProperty({ description: 'Reason for time off', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class GetAvailabilityQueryDto {
  @ApiProperty({ description: 'Start date (ISO string)', required: false })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({ description: 'End date (ISO string)', required: false })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}

export class AvailabilityResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  technician_id!: string;

  @ApiProperty()
  day_of_week!: number;

  @ApiProperty()
  start_time!: string;

  @ApiProperty()
  end_time!: string;

  @ApiProperty()
  is_active!: boolean;
}

export class ScheduleResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  technician_id!: string;

  @ApiProperty()
  schedule_date!: string;

  @ApiProperty({ required: false })
  start_time?: string;

  @ApiProperty({ required: false })
  end_time?: string;

  @ApiProperty()
  is_available!: boolean;

  @ApiProperty({ required: false })
  notes?: string;
}

export class TimeOffRequestResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  technician_id!: string;

  @ApiProperty()
  start_date!: string;

  @ApiProperty()
  end_date!: string;

  @ApiProperty()
  request_type!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty({ required: false })
  reason?: string;

  @ApiProperty({ required: false })
  approved_by?: string;

  @ApiProperty({ required: false })
  approved_at?: string;
}

