import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, IsUUID } from 'class-validator';

export class CreateServiceTypeDto {
  @ApiProperty({ description: 'Service name' })
  @IsString()
  service_name!: string;

  @ApiPropertyOptional({ description: 'Service description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Service code' })
  @IsString()
  service_code!: string;

  @ApiPropertyOptional({ description: 'Default duration in minutes' })
  @IsOptional()
  @IsNumber()
  default_duration_minutes?: number;

  @ApiPropertyOptional({ description: 'Default price' })
  @IsOptional()
  @IsNumber()
  default_price?: number;

  @ApiPropertyOptional({ description: 'Whether the service type is active' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ description: 'Category ID' })
  @IsOptional()
  @IsUUID()
  category_id?: string;
}
