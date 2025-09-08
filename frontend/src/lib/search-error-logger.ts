// ============================================================================
// SEARCH ERROR LOGGER
// ============================================================================
// Comprehensive error logging for search operations with detailed context

import { supabase } from './supabase-client';

export interface SearchErrorContext {
  operation: string;
  query?: string;
  filters?: any;
  userId?: string;
  tenantId?: string;
  timestamp: Date;
  userAgent?: string;
  url?: string;
  stack?: string;
}

export interface SearchError {
  id: string;
  type: 'authentication' | 'database' | 'network' | 'validation' | 'permission' | 'unknown';
  message: string;
  context: SearchErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  createdAt: Date;
}

class SearchErrorLogger {
  private errors: SearchError[] = [];
  private maxErrors = 1000; // Keep last 1000 errors in memory

  /**
   * Log a search error with full context
   */
  async logError(
    error: Error,
    context: Partial<SearchErrorContext>,
    severity: SearchError['severity'] = 'medium'
  ): Promise<void> {
    const errorId = crypto.randomUUID();
    const fullContext: SearchErrorContext = {
      operation: 'unknown',
      timestamp: new Date(),
      ...context
    };

    const searchError: SearchError = {
      id: errorId,
      type: this.categorizeError(error),
      message: error.message,
      context: fullContext,
      severity,
      resolved: false,
      createdAt: new Date()
    };

    // Add to memory cache
    this.errors.unshift(searchError);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console with detailed context
    console.error('🔴 Search Error:', {
      id: errorId,
      type: searchError.type,
      severity,
      operation: fullContext.operation,
      message: error.message,
      query: fullContext.query,
      stack: error.stack,
      context: fullContext
    });

    // Try to persist to database (non-blocking)
    try {
      await this.persistError(searchError);
    } catch (persistError) {
      console.error('Failed to persist search error:', persistError);
    }

    // Send to external error tracking if configured
    await this.sendToErrorTracking(searchError);
  }

  /**
   * Log search operation success for analytics
   */
  async logSuccess(
    operation: string,
    query: string,
    resultsCount: number,
    executionTimeMs: number,
    context?: Partial<SearchErrorContext>
  ): Promise<void> {
    console.log('✅ Search Success:', {
      operation,
      query,
      resultsCount,
      executionTimeMs,
      context
    });

    // Log to search analytics if available
    try {
      await supabase.rpc('log_search_success', {
        p_operation: operation,
        p_query: query,
        p_results_count: resultsCount,
        p_execution_time_ms: executionTimeMs,
        p_context: context || {}
      });
    } catch (error) {
      console.warn('Failed to log search success:', error);
    }
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(limit: number = 50): SearchError[] {
    return this.errors.slice(0, limit);
  }

  /**
   * Get errors by type
   */
  getErrorsByType(type: SearchError['type']): SearchError[] {
    return this.errors.filter(error => error.type === type);
  }

  /**
   * Get critical errors that need attention
   */
  getCriticalErrors(): SearchError[] {
    return this.errors.filter(error => error.severity === 'critical' && !error.resolved);
  }

  /**
   * Mark error as resolved
   */
  async resolveError(errorId: string): Promise<void> {
    const error = this.errors.find(e => e.id === errorId);
    if (error) {
      error.resolved = true;
      
      // Update in database
      try {
        await supabase
          .from('search_errors')
          .update({ is_resolved: true, resolved_at: new Date().toISOString() })
          .eq('id', errorId);
      } catch (dbError) {
        console.error('Failed to update error resolution:', dbError);
      }
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    unresolved: number;
    last24Hours: number;
  } {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const byType = this.errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const bySeverity = this.errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.errors.length,
      byType,
      bySeverity,
      unresolved: this.errors.filter(e => !e.resolved).length,
      last24Hours: this.errors.filter(e => e.createdAt > last24Hours).length
    };
  }

  /**
   * Categorize error type based on error message and context
   */
  private categorizeError(error: Error): SearchError['type'] {
    const message = error.message.toLowerCase();
    
    if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) {
      return 'permission';
    }
    
    if (message.includes('authentication') || message.includes('token') || message.includes('login')) {
      return 'authentication';
    }
    
    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return 'network';
    }
    
    if (message.includes('database') || message.includes('sql') || message.includes('query')) {
      return 'database';
    }
    
    if (message.includes('validation') || message.includes('invalid') || message.includes('required')) {
      return 'validation';
    }
    
    return 'unknown';
  }

  /**
   * Persist error to database
   */
  private async persistError(error: SearchError): Promise<void> {
    try {
      await supabase.from('search_errors').insert({
        id: error.id,
        tenant_id: error.context.tenantId,
        user_id: error.context.userId,
        error_type: error.type,
        error_message: error.message,
        error_stack: error.context.stack,
        query_text: error.context.query,
        user_agent: error.context.userAgent,
        created_at: error.createdAt.toISOString()
      });
    } catch (dbError) {
      console.error('Failed to persist search error to database:', dbError);
    }
  }

  /**
   * Send error to external tracking service
   */
  private async sendToErrorTracking(error: SearchError): Promise<void> {
    // This would integrate with services like Sentry, LogRocket, etc.
    // For now, just log to console
    if (error.severity === 'critical') {
      console.error('🚨 CRITICAL SEARCH ERROR - Consider external alerting:', error);
    }
  }
}

// Export singleton instance
export const searchErrorLogger = new SearchErrorLogger();

// Export types for use in other modules
export type { SearchError, SearchErrorContext };
