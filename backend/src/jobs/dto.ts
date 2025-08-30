import { IsString, IsUUID, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum JobStatus {
  UNASSIGNED = 'unassigned',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum JobPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export class CreateJobDto {
  @ApiProperty()
  @IsUUID() work_order_id!: string;
  @ApiProperty()
  @IsUUID() account_id!: string;
  @ApiProperty()
  @IsUUID() location_id!: string;

  @ApiProperty({ example: '2025-08-18' })
  @IsDateString() scheduled_date!: string;

  @ApiProperty({ required: false, example: '09:00:00' })
  @IsOptional() @IsString() scheduled_start_time?: string;

  @ApiProperty({ required: false, example: '11:00:00' })
  @IsOptional() @IsString() scheduled_end_time?: string;

  @ApiProperty({ enum: JobPriority, default: JobPriority.MEDIUM })
  @IsEnum(JobPriority) priority!: JobPriority;

  @ApiProperty({ required: false })
  @IsOptional() @IsUUID() technician_id?: string;
}

export class AssignJobDto {
  @ApiProperty() @IsUUID() job_id!: string;
  @ApiProperty() @IsUUID() technician_id!: string;
  @ApiProperty({ example: '2025-08-18' }) @IsDateString() scheduled_date!: string;
  @ApiProperty({ example: '09:00:00' }) @IsString() time_window_start!: string;
  @ApiProperty({ example: '11:00:00' }) @IsString() time_window_end!: string;
}
