import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and get JWT' })
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Get('refresh')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Refresh access token for authenticated user' })
  async refresh(@Request() req: any) {
    // Re-issue a new access token using the current authenticated principal
    const payload = {
      sub: req.user.userId,
      email: req.user.email,
      tenant_id: req.user.tenantId,
      roles: req.user.roles,
      permissions: req.user.permissions || [],
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: req.user.userId,
        email: req.user.email,
        tenant_id: req.user.tenantId,
        roles: req.user.roles,
      },
    };
  }
}
