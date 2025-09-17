import { IsString, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignJobDto {
  @ApiProperty() @IsUUID() job_id!: string;
  @ApiProperty() @IsUUID() technician_id!: string;
  @ApiProperty({ example: '2025-08-18' }) @IsDateString() scheduled_date!: string;
  @ApiProperty({ example: '09:00:00' }) @IsString() time_window_start!: string;
  @ApiProperty({ example: '11:00:00' }) @IsString() time_window_end!: string;
}
