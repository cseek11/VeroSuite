import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CheckConflictsDto {
  @ApiProperty({ description: 'Job ID to check conflicts for (optional, for new job assignment)' })
  @IsOptional()
  @IsString()
  job_id?: string;

  @ApiProperty({ description: 'Technician ID to check conflicts for' })
  @IsString()
  technician_id!: string;

  @ApiProperty({ description: 'Scheduled date (ISO string)' })
  @IsDateString()
  scheduled_date!: string;

  @ApiProperty({ description: 'Start time (HH:mm format)' })
  @IsString()
  scheduled_start_time!: string;

  @ApiProperty({ description: 'End time (HH:mm format)' })
  @IsString()
  scheduled_end_time!: string;

  @ApiProperty({ description: 'Exclude these job IDs from conflict check (for rescheduling)' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  exclude_job_ids?: string[];
}

export class ConflictResponseDto {
  @ApiProperty({ description: 'Whether conflicts were detected' })
  has_conflicts!: boolean;

  @ApiProperty({ description: 'List of detected conflicts', type: [Object] })
  conflicts!: ConflictDto[];

  @ApiProperty({ description: 'Can this assignment proceed?' })
  can_proceed!: boolean;
}

export class ConflictDto {
  @ApiProperty({ description: 'Conflict type' })
  type!: 'time_overlap' | 'technician_double_booking' | 'location_conflict';

  @ApiProperty({ description: 'Conflict severity' })
  severity!: 'low' | 'medium' | 'high' | 'critical';

  @ApiProperty({ description: 'Human-readable description' })
  description!: string;

  @ApiProperty({ description: 'Conflicting job IDs' })
  conflicting_job_ids!: string[];

  @ApiProperty({ description: 'Conflicting job details' })
  conflicting_jobs!: Array<{
    id: string;
    scheduled_date: string;
    scheduled_start_time: string;
    scheduled_end_time: string;
    customer_name?: string;
    location_address?: string;
  }>;
}

