import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, Length, Matches } from 'class-validator';

export enum PhotoType {
  BEFORE = 'before',
  AFTER = 'after',
  SERVICE = 'service',
  DAMAGE = 'damage'
}

export class PhotoDto {
  @ApiProperty({ 
    description: 'Photo URL or base64 data',
    example: 'https://example.com/photo.jpg or data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'
  })
  @IsString()
  @Length(1, 10000, { message: 'Photo data must be between 1 and 10000 characters' })
  @Matches(/^(https?:\/\/[^\s]+|data:image\/[a-z]+;base64,[A-Za-z0-9+/=]+)$/, {
    message: 'Photo must be a valid URL or base64 data URI'
  })
  url!: string;

  @ApiProperty({ 
    description: 'Photo type',
    enum: PhotoType,
    example: PhotoType.BEFORE
  })
  @IsEnum(PhotoType, { message: 'Invalid photo type' })
  type!: PhotoType;
}
