import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class SearchLayoutsDto {
  @ApiProperty({ description: 'Search query', required: false })
  @IsOptional()
  @IsString()
  q?: string;
}
