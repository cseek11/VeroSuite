import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDashboardTemplateDto {
  @ApiProperty({ description: 'Template name', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ description: 'Template description', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ description: 'Thumbnail URL', required: false })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({ description: 'Whether template is public', default: false })
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  @ApiProperty({ description: 'Regions data', type: [Object] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  regions!: any[];
}

export class UpdateDashboardTemplateDto {
  @ApiProperty({ description: 'Template name', required: false, maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiProperty({ description: 'Template description', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ description: 'Thumbnail URL', required: false })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({ description: 'Whether template is public', required: false })
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;

  @ApiProperty({ description: 'Regions data', required: false, type: [Object] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  regions?: any[];
}

export class DashboardTemplateResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  thumbnail?: string;

  @ApiProperty()
  tenant_id!: string;

  @ApiProperty()
  user_id!: string;

  @ApiProperty({ default: false })
  is_system!: boolean;

  @ApiProperty({ default: false })
  is_public!: boolean;

  @ApiProperty({ type: [Object] })
  regions!: any[];

  @ApiProperty()
  created_at!: string;

  @ApiProperty()
  updated_at!: string;

  @ApiProperty({ required: false })
  deleted_at?: string;
}

