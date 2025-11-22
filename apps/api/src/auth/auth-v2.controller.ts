import { Controller, Post, Body, Get, UseGuards, Request, Header, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto, ExchangeTokenDto, AuthResponseDto, RefreshTokenResponseDto } from './dto';
import { IdempotencyInterceptor } from '../common/interceptors/idempotency.interceptor';

/**
 * Auth API v2 Controller
 * 
 * Enhanced endpoints with:
 * - Consistent response format with metadata
 * - Idempotency support
 * - Better error responses
 */
@ApiTags('Authentication V2')
@Controller({ path: 'auth', version: '2' })
@UseInterceptors(IdempotencyInterceptor)
export class AuthV2Controller {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and get JWT (V2)' })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Header('API-Version', '2.0')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto.email, loginDto.password);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Post('exchange-supabase-token')
  @ApiOperation({ summary: 'Exchange Supabase token for backend JWT (V2)' })
  @ApiResponse({ status: 200, description: 'Token exchange successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid Supabase token' })
  @Header('API-Version', '2.0')
  async exchangeSupabaseToken(@Body() exchangeTokenDto: ExchangeTokenDto) {
    const result = await this.authService.exchangeSupabaseToken(exchangeTokenDto.supabaseToken);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('refresh')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Refresh access token for authenticated user (V2)' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully', type: RefreshTokenResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  @Header('API-Version', '2.0')
  async refresh(@Request() req: any): Promise<any> {
    // Get latest user data from database to ensure roles/permissions are up to date
    const currentUser = await this.authService.getCurrentUser(req.user.userId);
    const userData = currentUser.user;

    // Re-issue a new access token with latest user data
    const payload = {
      sub: userData.id,
      email: userData.email,
      tenant_id: userData.tenant_id,
      roles: userData.roles || [],
      permissions: userData.permissions || [],
    };

    const accessToken = this.jwtService.sign(payload);
    const expiresAt = Math.floor(Date.now() / 1000) + (60 * 60); // 1 hour from now

    const tokenData = new RefreshTokenResponseDto({
      access_token: accessToken,
      expires_at: expiresAt,
      token_type: 'Bearer'
    });

    return {
      data: tokenData,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated user profile (V2)' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  @Header('API-Version', '2.0')
  async getCurrentUser(@Request() req: any) {
    const result = await this.authService.getCurrentUser(req.user.userId);
    return {
      data: result,
      meta: {
        version: '2.0',
        timestamp: new Date().toISOString()
      }
    };
  }
}


