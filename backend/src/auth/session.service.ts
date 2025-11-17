import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../common/services/database.service';
import { createClient } from '@supabase/supabase-js';

export interface ActiveSession {
  id: string;
  user_id: string;
  token_id: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  last_activity: string;
  expires_at: string;
}

@Injectable()
export class SessionService {
  private supabase;

  constructor(private db: DatabaseService) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;
    
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  async getActiveSessions(_tenantId: string, userId: string): Promise<ActiveSession[]> {
    try {
      if (!this.supabase) {
        console.warn('Supabase client not initialized');
        return [];
      }

      // Supabase doesn't have a direct listUserSessions API
      // We'll get session info from audit logs instead
      const sessions = await this.db.auditLog.findMany({
        where: {
          user_id: userId,
          action: 'login',
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: 10,
        select: {
          id: true,
          timestamp: true,
          ip_address: true,
          user_agent: true,
        },
        distinct: ['ip_address', 'user_agent'],
      });

      // Map to our format
      return sessions.map((session) => {
        const sessionData: ActiveSession = {
          id: session.id,
          user_id: userId,
          token_id: session.id,
          created_at: session.timestamp.toISOString(),
          last_activity: session.timestamp.toISOString(),
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        };
        
        if (session.ip_address) {
          sessionData.ip_address = session.ip_address;
        }
        
        if (session.user_agent) {
          sessionData.user_agent = session.user_agent;
        }
        
        return sessionData;
      });
    } catch (error) {
      console.error('Error in getActiveSessions:', error);
      return [];
    }
  }

  async revokeSession(_tenantId: string, _userId: string, sessionId: string) {
    try {
      if (!this.supabase) {
        throw new Error('Supabase client not initialized');
      }

      // Revoke session by signing out the user (this will invalidate all sessions)
      // Note: Supabase doesn't have per-session revocation, so we sign out the user
      const { error } = await this.supabase.auth.admin.signOut(sessionId, 'global');
      
      if (error) {
        console.error('Error revoking session:', error);
        throw new Error(`Failed to revoke session: ${error.message}`);
      }

      return { success: true, message: 'Session revoked successfully' };
    } catch (error) {
      console.error('Error in revokeSession:', error);
      throw error;
    }
  }

  async revokeAllSessions(tenantId: string, userId: string) {
    try {
      // Get all sessions first
      const sessions = await this.getActiveSessions(tenantId, userId);
      
      // Revoke all sessions
      const results = await Promise.allSettled(
        sessions.map((session: ActiveSession) => this.revokeSession(tenantId, userId, session.id))
      );

      const successful = results.filter((r: PromiseSettledResult<any>) => r.status === 'fulfilled').length;
      const failed = results.filter((r: PromiseSettledResult<any>) => r.status === 'rejected').length;

      return {
        success: failed === 0,
        message: `Revoked ${successful} session(s)${failed > 0 ? `, ${failed} failed` : ''}`,
        revoked: successful,
        failed,
      };
    } catch (error) {
      console.error('Error in revokeAllSessions:', error);
      throw error;
    }
  }

  async getSessionHistory(tenantId: string, userId: string, limit: number = 50) {
    try {
      // Get session history from audit logs
      const sessions = await this.db.auditLog.findMany({
        where: {
          tenant_id: tenantId,
          user_id: userId,
          action: {
            in: ['login', 'logout', 'session_revoked'],
          },
        },
        orderBy: {
          timestamp: 'desc',
        },
        take: limit,
        select: {
          id: true,
          action: true,
          timestamp: true,
          ip_address: true,
          user_agent: true,
        },
      });

      return sessions.map(session => ({
        id: session.id,
        action: session.action,
        timestamp: session.timestamp.toISOString(),
        ip_address: session.ip_address,
        user_agent: session.user_agent,
      }));
    } catch (error) {
      console.error('Error in getSessionHistory:', error);
      throw error;
    }
  }
}

