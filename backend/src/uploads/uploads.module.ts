import { Module } from '@nestjs/common';
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Uploads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/uploads')
export class UploadsController {
  @Post('presign')
  @ApiOperation({ summary: 'Get mock presigned upload URL (demo only)' })
  presign(@Body() body: { filename: string; content_type: string }) {
    // In production, generate S3/GCS presigned POST and return fields
    const key = `uploads/${Date.now()}-${body.filename}`;
    return {
      uploadUrl: `https://mock-bucket.local/${key}`,
      method: 'PUT',
      headers: { 'Content-Type': body.content_type },
      fileUrl: `https://mock-cdn.local/${key}`,
    };
  }
}

@Module({
  controllers: [UploadsController],
})
export class UploadsModule {}
