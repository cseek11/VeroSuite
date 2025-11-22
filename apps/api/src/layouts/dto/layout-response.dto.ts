import { ApiProperty } from '@nestjs/swagger';

export class LayoutResponseDto {
  @ApiProperty({ description: 'Layout ID' })
  id!: string;

  @ApiProperty({ description: 'Layout name' })
  name!: string;

  @ApiProperty({ description: 'Layout description', required: false })
  description?: string;

  @ApiProperty({ description: 'Storage path for the layout file' })
  storage_path!: string;

  @ApiProperty({ description: 'File size in bytes', required: false })
  file_size?: number;

  @ApiProperty({ description: 'Layout data (optional, loaded separately)' })
  layout?: any;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at!: string;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at!: string;

  @ApiProperty({ description: 'User ID who created the layout' })
  user_id!: string;

  @ApiProperty({ description: 'Tenant ID' })
  tenant_id!: string;

  @ApiProperty({ description: 'Whether the layout is public' })
  is_public!: boolean;

  @ApiProperty({ description: 'Tags for the layout', type: [String], required: false })
  tags?: string[];
}
