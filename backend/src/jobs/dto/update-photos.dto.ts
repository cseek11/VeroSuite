import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayMaxSize, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PhotoDto } from './photo.dto';

export class UpdatePhotosDto {
  @ApiProperty({ 
    description: 'Array of photo URLs or base64 strings',
    type: [PhotoDto],
    maxItems: 10,
    minItems: 1
  })
  @IsArray()
  @ArrayMaxSize(10, { message: 'Cannot upload more than 10 photos at once' })
  @ArrayMinSize(1, { message: 'At least one photo is required' })
  @ValidateNested({ each: true })
  @Type(() => PhotoDto)
  photos!: PhotoDto[];
}
