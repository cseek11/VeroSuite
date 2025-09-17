import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto, ExchangeTokenDto, AuthResponseDto, RefreshTokenResponseDto } from './dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and get JWT' })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('exchange-supabase-token')
  @ApiOperation({ summary: 'Exchange Supabase token for backend JWT' })
  @ApiResponse({ status: 200, description: 'Token exchange successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid Supabase token' })
  async exchangeSupabaseToken(@Body() exchangeTokenDto: ExchangeTokenDto) {
    return this.authService.exchangeSupabaseToken(exchangeTokenDto.supabaseToken);
  }

  @Get('refresh')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Refresh access token for authenticated user' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully', type: RefreshTokenResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async refresh(@Request() req: any): Promise<RefreshTokenResponseDto> {
    // Re-issue a new access token using the current authenticated principal
    const payload = {
      sub: req.user.userId,
      email: req.user.email,
      tenant_id: req.user.tenantId,
      roles: req.user.roles,
      permissions: req.user.permissions || [],
    };

    const accessToken = this.jwtService.sign(payload);
    const expiresAt = Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour from now

    return new RefreshTokenResponseDto({
      access_token: accessToken,
      expires_at: expiresAt,
      token_type: 'Bearer'
    });
  }
}
