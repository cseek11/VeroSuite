import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty({ description: 'Type of note (internal, service, payment, etc.)', required: false })
  @IsOptional()
  @IsString()
  note_type?: string;

  @ApiProperty({ description: 'The content of the note', required: false })
  @IsOptional()
  @IsString()
  note_content?: string;

  @ApiProperty({ description: 'Source of the note (office, field, mobile)', required: false })
  @IsOptional()
  @IsString()
  note_source?: string;

  @ApiProperty({ description: 'Priority level (low, medium, high)', required: false })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({ description: 'Whether this note is an alert', required: false })
  @IsOptional()
  @IsBoolean()
  is_alert?: boolean;

  @ApiProperty({ description: 'Whether this is an internal note', required: false })
  @IsOptional()
  @IsBoolean()
  is_internal?: boolean;

  @ApiProperty({ description: 'Technician ID if related to a technician', required: false })
  @IsOptional()
  @IsUUID()
  technician_id?: string;

  @ApiProperty({ description: 'Work order ID if related to a work order', required: false })
  @IsOptional()
  @IsUUID()
  work_order_id?: string;

  @ApiProperty({ description: 'Location coordinates if applicable', required: false })
  @IsOptional()
  @IsString()
  location_coords?: string;
}


