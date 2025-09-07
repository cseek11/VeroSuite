import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { SupabaseService } from '../common/services/supabase.service';

@Injectable()
export class TenantIsolationMiddleware implements NestMiddleware {
  constructor(private readonly supabaseService: SupabaseService) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    try {
      // Extract JWT token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('No valid token provided');
      }

      const token = authHeader.substring(7);
      const supabase = this.supabaseService.getClient();

      // Verify and decode the JWT token
      const { data: user, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        throw new UnauthorizedException('Invalid token');
      }

      // Extract tenant_id from user metadata
      const tenantId = user.user?.user_metadata?.tenant_id;
      
      if (!tenantId) {
        throw new UnauthorizedException('No tenant context found');
      }

      // Set tenant context on request using existing UserContext type
      req.user = {
        userId: user.user.id,
        tenantId: tenantId,
        roles: user.user?.user_metadata?.roles || []
      };

      next();
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
}
