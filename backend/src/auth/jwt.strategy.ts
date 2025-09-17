import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

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
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('=== JWT STRATEGY VALIDATION ===');
    console.log('JWT Payload received:', JSON.stringify(payload, null, 2));
    console.log('Payload sub (user ID):', payload.sub);
    console.log('Payload tenant_id:', payload.tenant_id);
    console.log('Payload roles:', payload.roles);
    console.log('================================');

    if (!payload.sub || !payload.tenant_id) {
      console.error('JWT validation failed - missing required fields');
      console.error('sub:', payload.sub);
      console.error('tenant_id:', payload.tenant_id);
      throw new UnauthorizedException('Invalid token payload');
    }

    const userContext = {
      userId: payload.sub,
      email: payload.email,
      tenantId: payload.tenant_id, // Keep consistent with JWT payload structure
      roles: payload.roles,
      permissions: payload.permissions,
    };

    console.log('User context created:', JSON.stringify(userContext, null, 2));
    console.log('================================');

    return userContext;
  }
}
