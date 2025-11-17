// ============================================================================
// GLOBAL SEARCH INTEGRATION SERVICE
// ============================================================================
// Orchestrates all components for robust global search functionality

import { EnhancedIntentClassificationService, type EnhancedIntentResult } from './enhanced-intent-service';
import { EnhancedActionHandler, type EnhancedActionResult } from './enhanced-action-handler';
import { robustApiClient } from './robust-api-client';
import { logger } from '@/utils/logger';

export interface GlobalSearchResult {
  success: boolean;
  message: string;
  data?: any;
  intent: string;
  confidence: number;
  processingTime: number;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  debugInfo?: {
    intentResult: EnhancedIntentResult;
    actionResult: EnhancedActionResult;
    apiHealth: { healthy: boolean; latency: number };
  };
}

export interface GlobalSearchConfig {
  debug: boolean;
  enableCache: boolean;
  enableRetry: boolean;
  maxProcessingTime: number;
  confidenceThreshold: number;
}

class GlobalSearchIntegrationService {
  private intentService: EnhancedIntentClassificationService;
  private actionHandler: EnhancedActionHandler;
  private processingCount = 0;

  private defaultConfig: GlobalSearchConfig = {
    debug: process.env.NODE_ENV === 'development',
    enableCache: true,
    enableRetry: true,
    maxProcessingTime: 30000, // 30 seconds
    confidenceThreshold: 0.6
  };

  constructor() {
    this.intentService = new EnhancedIntentClassificationService();
    this.actionHandler = new EnhancedActionHandler();
  }

  /**
   * Process global search command with comprehensive error handling
   */
  async processCommand(
    query: string, 
    config: Partial<GlobalSearchConfig> = {}
  ): Promise<GlobalSearchResult> {
    const processingConfig = { ...this.defaultConfig, ...config };
    const startTime = Date.now();
    const processingId = ++this.processingCount;
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Global Search Processing started', { 
        processingId,
        query, 
        config: processingConfig 
      }, 'global-search-integration');
    }

    try {
      // Set timeout for processing
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Processing timeout after ${processingConfig.maxProcessingTime}ms`));
        }, processingConfig.maxProcessingTime);
      });

      // Main processing
      const processingPromise = this.executeProcessing(query, processingConfig, processingId);
      
      const result = await Promise.race([processingPromise, timeoutPromise]);
      
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Global Search Processing completed', {
          processingId,
          success: result.success,
          processingTime: result.processingTime,
          confidence: result.confidence
        }, 'global-search-integration');
      }

      return result;

    } catch (error: unknown) {
      const processingTime = Date.now() - startTime;
      
      logger.error('Global Search Processing failed', { processingId, error }, 'global-search-integration');
      
      return {
        success: false,
        message: 'Command processing failed',
        intent: 'unknown',
        confidence: 0,
        processingTime,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        warnings: [],
        suggestions: [
          'Please try rephrasing your command',
          'Check your internet connection',
          'Contact support if the problem persists'
        ]
      };
    }
  }

  /**
   * Execute the main processing pipeline
   */
  private async executeProcessing(
    query: string,
    config: GlobalSearchConfig,
    processingId: number
  ): Promise<GlobalSearchResult> {
    const startTime = Date.now();
    
    // Step 1: Check API health if needed
    let apiHealth: { healthy: boolean; latency: number } | undefined;
    if (config.debug) {
      apiHealth = await robustApiClient.healthCheck();
      if (!apiHealth.healthy) {
        logger.warn('API health check failed', { processingId }, 'global-search-integration');
      }
    }

    // Step 2: Intent classification and entity extraction
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Classifying intent', { processingId }, 'global-search-integration');
    }
    const intentResult = await this.intentService.classifyIntent(query);
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Intent classified', {
        processingId,
        intent: intentResult.intent,
        confidence: intentResult.confidence,
        entities: Object.keys(intentResult.entities).filter(k => k !== 'validation')
      }, 'global-search-integration');
    }

    // Step 3: Confidence check
    if (intentResult.confidence < config.confidenceThreshold) {
      return {
        success: false,
        message: `Low confidence in command understanding (${Math.round(intentResult.confidence * 100)}%)`,
        intent: intentResult.intent,
        confidence: intentResult.confidence,
        processingTime: Date.now() - startTime,
        errors: ['Command not clearly understood'],
        warnings: intentResult.validationErrors || [],
        suggestions: intentResult.suggestions || [
          'Please try being more specific',
          'Use full customer names',
          'Include clear field names (phone, email, etc.)'
        ],
        debugInfo: config.debug ? { intentResult, actionResult: null as any, apiHealth: apiHealth! } : undefined
      };
    }

    // Step 4: Execute action
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Executing action', { processingId }, 'global-search-integration');
    }
    const actionResult = await this.actionHandler.executeAction(intentResult);
    
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Action executed', {
        processingId,
        success: actionResult.success,
        errors: actionResult.errors.length,
        warnings: actionResult.warnings.length
      }, 'global-search-integration');
    }

    // Step 5: Compile final result
    const processingTime = Date.now() - startTime;
    
    return {
      success: actionResult.success,
      message: actionResult.message,
      data: actionResult.data,
      intent: intentResult.intent,
      confidence: intentResult.confidence,
      processingTime,
      errors: [
        ...intentResult.validationErrors,
        ...actionResult.errors
      ],
      warnings: [
        ...(intentResult.validationErrors || []),
        ...actionResult.warnings
      ],
      suggestions: [
        ...(intentResult.suggestions || []),
        ...(actionResult.suggestions || [])
      ],
      debugInfo: config.debug ? { 
        intentResult, 
        actionResult, 
        apiHealth: apiHealth! 
      } : undefined
    };
  }

  /**
   * Get processing statistics
   */
  getStats(): {
    totalProcessed: number;
    averageConfidence: number;
    successRate: number;
  } {
    // This would be implemented with actual tracking
    return {
      totalProcessed: this.processingCount,
      averageConfidence: 0.85, // Placeholder
      successRate: 0.92 // Placeholder
    };
  }

  /**
   * Reset conversation context
   */
  resetContext(): void {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('Resetting global search context', {}, 'global-search-integration');
    }
    // The intent service maintains its own context
    // This could be expanded to reset that context if needed
  }

  /**
   * Test command understanding without execution
   */
  async testCommand(query: string): Promise<{
    intent: string;
    confidence: number;
    entities: any;
    wouldExecute: boolean;
    issues: string[];
  }> {
    try {
      const intentResult = await this.intentService.classifyIntent(query);
      
      return {
        intent: intentResult.intent,
        confidence: intentResult.confidence,
        entities: intentResult.entities,
        wouldExecute: intentResult.confidence >= this.defaultConfig.confidenceThreshold,
        issues: intentResult.validationErrors
      };
    } catch (error) {
      return {
        intent: 'unknown',
        confidence: 0,
        entities: {},
        wouldExecute: false,
        issues: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  /**
   * Get available commands and examples
   */
  getAvailableCommands(): {
    intent: string;
    description: string;
    examples: string[];
    confidence: number;
  }[] {
    return [
      {
        intent: 'updateCustomer',
        description: 'Update customer information (phone, email, address)',
        examples: [
          'Update customer John Smith phone to (555) 123-4567',
          'Set Lisa Nguyen email to lisa@company.com',
          'Change Mike Johnson address to 123 Main St'
        ],
        confidence: 0.9
      },
      {
        intent: 'viewCustomerDetails',
        description: 'View detailed customer information',
        examples: [
          'Show customer John Smith',
          'View details for Lisa Nguyen',
          'Display Mike Johnson information'
        ],
        confidence: 0.85
      },
      {
        intent: 'createCustomer',
        description: 'Create a new customer account',
        examples: [
          'Create customer John Doe at 123 Main St with phone (555) 123-4567',
          'Add new customer Sarah Smith',
          'Register customer Mike Wilson'
        ],
        confidence: 0.88
      },
      {
        intent: 'deleteCustomer',
        description: 'Delete customer account (requires confirmation)',
        examples: [
          'Delete customer John Smith',
          'Remove customer account for Lisa Nguyen',
          'Cancel account for Mike Johnson'
        ],
        confidence: 0.92
      }
    ];
  }
}

// Export singleton instance
export const globalSearchService = new GlobalSearchIntegrationService();

