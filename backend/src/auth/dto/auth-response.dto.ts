import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../../common/dto/base-response.dto';

export class UserDto {
  @ApiProperty({ description: 'User ID' })
  id!: string;

  @ApiProperty({ description: 'User email address' })
  email!: string;

  @ApiProperty({ description: 'Tenant ID' })
  tenant_id!: string;

  @ApiProperty({ description: 'User roles', type: [String] })
  roles!: string[];

  @ApiProperty({ description: 'User permissions', type: [String] })
  permissions!: string[];

  @ApiProperty({ description: 'User creation timestamp' })
  created_at!: string;

  @ApiProperty({ description: 'User last update timestamp' })
  updated_at!: string;
}

export class AuthTokenDto {
  @ApiProperty({ description: 'JWT access token' })
  access_token!: string;

  @ApiProperty({ description: 'Token expiration timestamp' })
  expires_at!: number;

  @ApiProperty({ description: 'Token type', default: 'Bearer' })
  token_type!: string;
}

export class AuthResponseDto extends BaseResponseDto<{
  token: AuthTokenDto;
  user: UserDto;
}> {
  @ApiProperty({ description: 'Authentication token information' })
  token!: AuthTokenDto;

  @ApiProperty({ description: 'Authenticated user information' })
  user!: UserDto;

  constructor(token: AuthTokenDto, user: UserDto, message: string = 'Authentication successful') {
    super({ token, user }, message, true);
    this.token = token;
    this.user = user;
  }
}

export class RefreshTokenResponseDto extends BaseResponseDto<AuthTokenDto> {
  @ApiProperty({ description: 'New authentication token' })
  token!: AuthTokenDto;

  constructor(token: AuthTokenDto, message: string = 'Token refreshed successfully') {
    super(token, message, true);
    this.token = token;
  }
}