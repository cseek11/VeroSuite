import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateDashboardLayoutDto {
  @ApiProperty({ description: 'Layout name' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Whether this is the default layout', default: false })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}

export class UpdateDashboardLayoutDto {
  @ApiProperty({ description: 'Layout name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Whether this is the default layout', required: false })
  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}

export class DashboardLayoutResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tenant_id!: string;

  @ApiProperty()
  user_id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  is_default!: boolean;

  @ApiProperty()
  created_at!: string;

  @ApiProperty()
  updated_at!: string;
}
