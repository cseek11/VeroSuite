import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../common/services/supabase.service';

@Injectable()
export class HealthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async checkDatabase(): Promise<{ healthy: boolean; responseTime: number; message: string }> {
    const start = Date.now();
    try {
      // Simple database connectivity check
      const { error } = await this.supabaseService.getClient().from('dashboard_regions').select('id').limit(1);
      const responseTime = Date.now() - start;
      
      if (error) {
        return {
          healthy: false,
          responseTime,
          message: `Database error: ${error.message}`
        };
      }
      
      return {
        healthy: true,
        responseTime,
        message: 'Database connection healthy'
      };
    } catch (error: any) {
      return {
        healthy: false,
        responseTime: Date.now() - start,
        message: `Database check failed: ${error.message}`
      };
    }
  }
}


