import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Length, Matches, Min, Max, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class PresignUploadDto {
  @ApiProperty({ 
    description: 'Original filename',
    example: 'document.pdf',
    maxLength: 255
  })
  @IsString()
  @Length(1, 255, { message: 'Filename must be between 1 and 255 characters' })
  @Matches(/^[a-zA-Z0-9._-]+$/, { message: 'Filename contains invalid characters' })
  @Transform(({ value }: { value: string }) => value.replace(/[^a-zA-Z0-9._-]/g, '_'))
  filename!: string;

  @ApiProperty({ 
    description: 'MIME type',
    example: 'image/jpeg',
    enum: [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  })
  @IsString()
  @IsIn([
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ], { message: 'File type not allowed' })
  content_type!: string;

  @ApiPropertyOptional({ 
    description: 'File size in bytes',
    example: 1048576,
    minimum: 1,
    maximum: 10485760
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'File size must be at least 1 byte' })
  @Max(10 * 1024 * 1024, { message: 'File size cannot exceed 10MB' })
  file_size?: number;
}
