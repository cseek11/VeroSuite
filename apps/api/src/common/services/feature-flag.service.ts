import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

export interface FeatureFlagConfig {
  key: string;
  enabled: boolean;
  rollout?: {
    percentage?: number;
    userGroups?: string[];
    tenants?: string[];
  };
  variants?: {
    control: boolean;
    treatment: boolean;
  };
}

export interface EvaluationContext {
  userId: string;
  tenantId: string;
  userGroups?: string[];
}

/**
 * Feature flag service for gradual rollout and A/B testing
 * Supports percentage-based rollout, user group targeting, and tenant targeting
 */
@Injectable()
export class FeatureFlagService {
  private readonly flags: Map<string, FeatureFlagConfig> = new Map();
  private readonly defaultFlags: Map<string, boolean> = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService
  ) {
    this.initializeDefaultFlags();
  }

  /**
   * Initialize default flags from environment variables
   */
  private initializeDefaultFlags() {
    // Dashboard-specific feature flags
    const dashboardFlags = [
      'DASHBOARD_NEW_STATE_MANAGEMENT',
      'DASHBOARD_VIRTUALIZATION',
      'DASHBOARD_MOBILE_BETA',
      'DASHBOARD_PWA',
      'DASHBOARD_EVENT_SOURCING',
      'DASHBOARD_SAGA_ORCHESTRATION',
      'DASHBOARD_CONFLICT_RESOLUTION',
      'DASHBOARD_AUDIT_LOGGING',
      'DASHBOARD_API_V2'
    ];

    dashboardFlags.forEach(flag => {
      const envValue = this.configService.get<string>(`FEATURE_${flag}`);
      if (envValue !== undefined) {
        this.defaultFlags.set(flag, envValue === 'true');
      } else {
        // Default to false for new features
        this.defaultFlags.set(flag, false);
      }
    });
  }

  /**
   * Evaluate a feature flag for a given context
   */
  async evaluateFlag(flagKey: string, context: EvaluationContext): Promise<boolean> {
    // Check environment variable override first
    const envOverride = this.configService.get<string>(`FEATURE_${flagKey}`);
    if (envOverride !== undefined) {
      return envOverride === 'true';
    }

    // Check database-stored flags (if table exists)
    try {
      const dbFlag = await this.getFlagFromDatabase(flagKey, context);
      if (dbFlag !== null) {
        return dbFlag;
      }
    } catch (error) {
      // Database not available or table doesn't exist, fall back to defaults
    }

    // Check in-memory flags
    const inMemoryFlag = this.flags.get(flagKey);
    if (inMemoryFlag) {
      return this.evaluateFlagConfig(inMemoryFlag, context);
    }

    // Fall back to default
    return this.defaultFlags.get(flagKey) || false;
  }

  /**
   * Get flag from database (if feature_flags table exists)
   */
  private async getFlagFromDatabase(flagKey: string, context: EvaluationContext): Promise<boolean | null> {
    try {
      const { data, error } = await this.supabaseService.getClient()
        .from('feature_flags')
        .select('*')
        .eq('key', flagKey)
        .eq('enabled', true)
        .single();

      if (error || !data) {
        return null;
      }

      const config: FeatureFlagConfig = {
        key: data.key,
        enabled: data.enabled,
        rollout: data.rollout || undefined,
        variants: data.variants || undefined
      };

      return this.evaluateFlagConfig(config, context);
    } catch (error) {
      return null;
    }
  }

  /**
   * Evaluate flag configuration against context
   */
  private evaluateFlagConfig(config: FeatureFlagConfig, context: EvaluationContext): boolean {
    if (!config.enabled) {
      return false;
    }

    // Percentage-based rollout
    if (config.rollout?.percentage !== undefined) {
      const hash = this.hashUser(context.userId);
      if (hash % 100 >= config.rollout.percentage) {
        return false;
      }
    }

    // User group targeting
    if (config.rollout?.userGroups && context.userGroups) {
      const hasMatchingGroup = config.rollout.userGroups.some(group => 
        context.userGroups?.includes(group)
      );
      if (hasMatchingGroup) {
        return true;
      }
    }

    // Tenant targeting
    if (config.rollout?.tenants) {
      if (config.rollout.tenants.includes(context.tenantId)) {
        return true;
      }
    }

    // If no rollout config, return enabled status
    return config.enabled;
  }

  /**
   * Hash user ID for consistent percentage-based rollout
   */
  private hashUser(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Set a flag programmatically (for testing or admin)
   */
  setFlag(flagKey: string, config: FeatureFlagConfig) {
    this.flags.set(flagKey, config);
  }

  /**
   * Get all flags for a context (useful for debugging)
   */
  async getAllFlags(context: EvaluationContext): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    for (const flagKey of this.defaultFlags.keys()) {
      results[flagKey] = await this.evaluateFlag(flagKey, context);
    }

    for (const flagKey of this.flags.keys()) {
      if (!results[flagKey]) {
        results[flagKey] = await this.evaluateFlag(flagKey, context);
      }
    }

    return results;
  }
}



