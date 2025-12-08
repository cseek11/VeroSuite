import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { randomUUID } from 'crypto';

export interface JwtPayload {
  sub: string; // user_id
  email: string;
  tenant_id: string; // UUID
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly _configService: ConfigService) {
    const jwtSecret = _configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const traceId = randomUUID();
    
    this.logger.debug('JWT validation started', {
      operation: 'jwt-validate',
      traceId,
      userId: payload.sub,
      tenantId: payload.tenant_id,
    });

    if (!payload.sub || !payload.tenant_id) {
      this.logger.error('JWT validation failed - missing required fields', {
        operation: 'jwt-validate',
        traceId,
        sub: payload.sub,
        tenantId: payload.tenant_id,
      });
      throw new UnauthorizedException('Invalid token payload');
    }

    const userContext = {
      userId: payload.sub,
      email: payload.email,
      tenantId: payload.tenant_id, // Keep consistent with JWT payload structure
      roles: payload.roles || [],
      permissions: payload.permissions || [],
    };

    this.logger.debug('JWT validation successful', {
      operation: 'jwt-validate',
      traceId,
      userId: userContext.userId,
      tenantId: userContext.tenantId,
      rolesCount: userContext.roles.length,
      permissionsCount: userContext.permissions.length,
    });

    return userContext;
  }
}
