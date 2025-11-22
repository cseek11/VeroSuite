import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../common/dto/base-response.dto';

export class PresignUploadResponseDto {
  @ApiProperty({ description: 'Presigned upload URL' })
  upload_url!: string;

  @ApiProperty({ description: 'File key for storage' })
  file_key!: string;

  @ApiProperty({ description: 'Upload expiration timestamp' })
  expires_at!: number;

  @ApiProperty({ description: 'Maximum file size allowed in bytes' })
  max_file_size!: number;

  @ApiProperty({ description: 'Allowed content types', type: [String] })
  allowed_content_types!: string[];
}

export class UploadPresignResponseDto extends BaseResponseDto<PresignUploadResponseDto> {
  @ApiProperty({ description: 'Presigned upload information' })
  override data!: PresignUploadResponseDto;

  constructor(uploadInfo: PresignUploadResponseDto, message: string = 'Presigned upload URL generated successfully') {
    super(uploadInfo, message, true);
  }
}

export class FileUploadResponseDto {
  @ApiProperty({ description: 'File ID' })
  id!: string;

  @ApiProperty({ description: 'Original filename' })
  filename!: string;

  @ApiProperty({ description: 'File key in storage' })
  file_key!: string;

  @ApiProperty({ description: 'File URL' })
  url!: string;

  @ApiProperty({ description: 'File size in bytes' })
  size!: number;

  @ApiProperty({ description: 'MIME type' })
  content_type!: string;

  @ApiProperty({ description: 'Upload timestamp' })
  uploaded_at!: string;

  @ApiProperty({ description: 'Tenant ID' })
  tenant_id!: string;
}

export class FileUploadSuccessResponseDto extends BaseResponseDto<FileUploadResponseDto> {
  @ApiProperty({ description: 'Uploaded file information' })
  override data!: FileUploadResponseDto;

  constructor(fileInfo: FileUploadResponseDto, message: string = 'File uploaded successfully') {
    super(fileInfo, message, true);
  }
}

export class FileDeleteResponseDto extends BaseResponseDto<{ file_key: string }> {
  @ApiProperty({ description: 'Deleted file key' })
  override data!: { file_key: string };

  constructor(fileKey: string, message: string = 'File deleted successfully') {
    super({ file_key: fileKey }, message, true);
  }
}