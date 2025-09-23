import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsArray, IsObject, MinLength, MaxLength } from 'class-validator';

export class CreateLayoutDto {
  @ApiProperty({ description: 'Layout name', minLength: 1, maxLength: 255 })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name!: string;

  @ApiProperty({ description: 'Layout description', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ description: 'Layout data object' })
  @IsObject()
  layout: any;

  @ApiProperty({ description: 'Tags for the layout', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'Whether the layout is public', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  is_public?: boolean;
}
