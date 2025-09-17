import { Module } from '@nestjs/common';
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PresignUploadDto, UploadPresignResponseDto } from './dto';

@ApiTags('Uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/uploads')
export class UploadsController {
  @Post('presign')
  @ApiOperation({ summary: 'Get mock presigned upload URL (demo only)' })
  @ApiResponse({ status: 200, description: 'Presigned upload URL generated', type: UploadPresignResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid file type or size' })
  presign(@Body() presignDto: PresignUploadDto): UploadPresignResponseDto {
    // In production, generate S3/GCS presigned POST and return fields
    const key = `uploads/${Date.now()}-${presignDto.filename}`;
    const uploadInfo = {
      upload_url: `https://mock-bucket.local/${key}`,
      file_key: key,
      expires_at: Date.now() + 3600000, // 1 hour from now
      max_file_size: 10 * 1024 * 1024, // 10MB
      allowed_content_types: [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'application/pdf', 'text/plain', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
    };
    
    return new UploadPresignResponseDto(uploadInfo);
  }
}

@Module({
  controllers: [UploadsController],
})
export class UploadsModule {}
