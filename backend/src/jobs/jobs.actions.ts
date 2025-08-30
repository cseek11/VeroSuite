import { IsOptional, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartJobDto {
  @ApiProperty({ description: 'GPS location', example: { lat: 40.44, lng: -79.99 } })
  gps_location!: { lat: number; lng: number };
}

export class CompleteJobDto {
  @IsOptional() @IsString() notes?: string;
  @IsOptional() @IsString() signature_url?: string;
  @IsOptional() @IsArray() photos?: string[];
  @IsOptional() chemicals_used?: any[];
}
