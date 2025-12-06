// ============================================================================
// ENHANCED INTENT CLASSIFICATION SERVICE
// ============================================================================
// Robust intent detection with context awareness, validation, and reliability

import { logger } from '@/utils/logger';
import type { IntentType, ActionData } from './intent-classification-service';

export interface EnhancedIntentResult {
  intent: IntentType;
  confidence: number;
  entities: ValidatedEntities;
  originalQuery: string;
  processedQuery: string;
  actionData?: ActionData;
  validationErrors: string[];
  suggestions?: string[];
  context?: ConversationContext;
}

export interface ValidatedEntities {
  customerName?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  // Validation metadata
  validation: {
    [key: string]: {
      isValid: boolean;
      confidence: number;
      issues: string[];
      suggestions: string[];
    };
  };
}

export interface ConversationContext {
  lastIntent?: IntentType;
  lastCustomer?: string;
  lastLocation?: string;
  sessionId: string;
  timestamp: Date;
}

class EnhancedIntentClassificationService {
  private context: ConversationContext = {
    sessionId: crypto.randomUUID(),
    timestamp: new Date()
  };

  // Enhanced pattern system with priority and context
  private readonly intentMatcher = {
    updateCustomer: {
      primary: [
        {
          pattern: /^update\s+customer\s+([^,]+?)\s+(phone|email|address|name)\s+(?:to|is|=)\s+(.+)$/i,
          confidence: 0.95,
          groups: { customer: 1, field: 2, value: 3 }
        },
        {
          pattern: /^(?:set|change|modify)\s+([^,]+?)\s+(phone|email|address|name)\s+(?:to|is|=)\s+(.+)$/i,
          confidence: 0.9,
          groups: { customer: 1, field: 2, value: 3 }
        }
      ],
      secondary: [
        {
          pattern: /^([^,]+?)\s+(phone|email|address|name)\s+(?:is|should be|will be)\s+(.+)$/i,
          confidence: 0.8,
          groups: { customer: 1, field: 2, value: 3 }
        }
      ],
      contextual: [
        {
          pattern: /^update\s+(phone|email|address|name)\s+(?:to|is|=)\s+(.+)$/i,
          confidence: 0.7,
          requiresContext: 'lastCustomer',
          groups: { field: 1, value: 2 }
        }
      ]
    }
  };

  // Enhanced entity validators
  private readonly entityValidators = {
    phone: {
      patterns: [
        { regex: /^\+1[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})(?:\s?(?:ext|x|extension)\.?\s?(\d+))?$/i, confidence: 0.95 },
        { regex: /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})(?:\s?(?:ext|x|extension)\.?\s?(\d+))?$/i, confidence: 0.9 },
        { regex: /^(\d{3})[-.]?(\d{3})[-.]?(\d{4})$/i, confidence: 0.85 },
        { regex: /^(\d{10})$/i, confidence: 0.8 }
      ],
      format: (phone: string) => {
        const digits = phone.replace(/\D/g, '');
        if (digits.length === 10) {
          return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
        return phone;
      },
      validate: (phone: string): ValidationResult => {
        const digits = phone.replace(/\D/g, '');
        const issues: string[] = [];
        
        if (digits.length < 10) issues.push('Phone number too short');
        if (digits.length > 11) issues.push('Phone number too long');
        if (digits.startsWith('0') || digits.startsWith('1')) issues.push('Invalid area code');
        
        return {
          isValid: issues.length === 0,
          confidence: issues.length === 0 ? 0.9 : 0.3,
          issues,
          suggestions: issues.length > 0 ? ['Please provide a 10-digit phone number'] : []
        };
      }
    },

    email: {
      patterns: [
        { regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i, confidence: 0.95 }
      ],
      validate: (email: string): ValidationResult => {
        const issues: string[] = [];
        
        if (!email.includes('@')) issues.push('Missing @ symbol');
        if (!email.includes('.')) issues.push('Missing domain extension');
        if (email.length < 5) issues.push('Email too short');
        if (email.length > 100) issues.push('Email too long');
        
        return {
          isValid: issues.length === 0,
          confidence: issues.length === 0 ? 0.9 : 0.2,
          issues,
          suggestions: issues.length > 0 ? ['Please provide a valid email address'] : []
        };
      }
    },

    customerName: {
      validate: (name: string): ValidationResult => {
        const issues: string[] = [];
        const parts = name.trim().split(/\s+/);
        
        if (parts.length < 2) issues.push('Name should include first and last name');
        if (name.length < 2) issues.push('Name too short');
        if (!/^[a-zA-Z\s'-]+$/.test(name)) issues.push('Name contains invalid characters');
        
        return {
          isValid: issues.length === 0,
          confidence: issues.length === 0 ? 0.9 : 0.4,
          issues,
          suggestions: issues.length > 0 ? ['Please provide full name (first and last)'] : []
        };
      }
    }
  };

  /**
   * Enhanced intent classification with context and validation
   */
  async classifyIntent(query: string): Promise<EnhancedIntentResult> {
    const normalizedQuery = this.normalizeQuery(query);
    const validationErrors: string[] = [];
    
    try {
      // 1. Intent Detection with Context
      const intentMatch = this.detectIntentWithContext(normalizedQuery);
      
      // 2. Enhanced Entity Extraction
      const entities = await this.extractAndValidateEntities(normalizedQuery, intentMatch.intent);
      
      // 3. Validation
      entities.validation = {};
      for (const [key, value] of Object.entries(entities)) {
        if (key !== 'validation' && value && this.entityValidators[key as keyof typeof this.entityValidators]) {
          entities.validation[key] = this.entityValidators[key as keyof typeof this.entityValidators].validate(value as string);
        }
      }
      
      // 4. Calculate Overall Confidence
      const overallConfidence = this.calculateOverallConfidence(intentMatch, entities);
      
      // 5. Generate Suggestions
      const suggestions = this.generateSuggestions(entities, validationErrors);
      
      // 6. Update Context
      this.updateContext(intentMatch.intent, entities);
      
      return {
        intent: intentMatch.intent,
        confidence: overallConfidence,
        entities,
        originalQuery: query,
        processedQuery: normalizedQuery,
        validationErrors,
        suggestions,
        context: { ...this.context }
      };
      
    } catch (error: unknown) {
      logger.error('Intent classification failed', error, 'enhanced-intent-service');
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      return {
        intent: 'search',
        confidence: 0.1,
        entities: { validation: {} },
        originalQuery: query,
        processedQuery: normalizedQuery,
        validationErrors: [`Classification failed: ${errorMessage}`],
        suggestions: ['Please try rephrasing your command'],
        context: { ...this.context }
      };
    }
  }

  /**
   * Detect intent with context awareness
   */
  private detectIntentWithContext(query: string): { intent: IntentType; confidence: number; match?: RegExpMatchArray } {
    // Try primary patterns first
    for (const [intent, matchers] of Object.entries(this.intentMatcher)) {
      for (const pattern of matchers.primary || []) {
        const match = query.match(pattern.pattern);
        if (match) {
          return { intent: intent as IntentType, confidence: pattern.confidence, match };
        }
      }
    }
    
    // Try secondary patterns
    for (const [intent, matchers] of Object.entries(this.intentMatcher)) {
      for (const pattern of matchers.secondary || []) {
        const match = query.match(pattern.pattern);
        if (match) {
          return { intent: intent as IntentType, confidence: pattern.confidence, match };
        }
      }
    }
    
    // Try contextual patterns if context is available
    for (const [intent, matchers] of Object.entries(this.intentMatcher)) {
      for (const pattern of matchers.contextual || []) {
        if (pattern.requiresContext && this.context[pattern.requiresContext as keyof ConversationContext]) {
          const match = query.match(pattern.pattern);
          if (match) {
            return { intent: intent as IntentType, confidence: pattern.confidence, match };
          }
        }
      }
    }
    
    // Default to search
    return { intent: 'search', confidence: 0.5 };
  }

  /**
   * Extract and validate entities with context
   */
  private async extractAndValidateEntities(query: string, intent: IntentType): Promise<ValidatedEntities> {
    const entities: ValidatedEntities = { validation: {} };
    
    // Context-aware extraction based on intent
    switch (intent) {
      case 'updateCustomer':
        await this.extractUpdateCustomerEntities(query, entities);
        break;
      default:
        await this.extractGenericEntities(query, entities);
    }
    
    return entities;
  }

  /**
   * Extract entities for customer update commands
   */
  private async extractUpdateCustomerEntities(query: string, entities: ValidatedEntities): Promise<void> {
    // Enhanced customer name extraction
    const updatePatterns = [
      /update\s+customer\s+([^,]+?)\s+(?:phone|email|address|name)/i,
      /(?:set|change|modify)\s+([^,]+?)\s+(?:phone|email|address|name)/i,
      /([^,]+?)\s+(?:phone|email|address|name)\s+(?:is|should be|will be)/i
    ];
    
    for (const pattern of updatePatterns) {
      const match = query.match(pattern);
      if (match && match[1]) {
        entities.customerName = this.formatName(match[1].trim());
        break;
      }
    }
    
    // If no customer name found, check context
    if (!entities.customerName && this.context.lastCustomer) {
      entities.customerName = this.context.lastCustomer;
    }
    
    // Extract field-specific values
    // eslint-disable-next-line no-useless-escape
    const phoneMatch = query.match(/(?:phone|call|contact).*?(?:to|is|=)\s*([+\d\s\-\(\)\.x]+)/i);
    if (phoneMatch && phoneMatch[1]) {
      entities.phone = this.entityValidators.phone.format(phoneMatch[1].trim());
    }
    
     
    const emailMatch = query.match(/email.*?(?:to|is|=)\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    if (emailMatch && emailMatch[1]) {
      entities.email = emailMatch[1].trim();
    }
  }

  /**
   * Calculate overall confidence based on intent match and entity validation
   */
  private calculateOverallConfidence(intentMatch: { confidence: number }, entities: ValidatedEntities): number {
    let entityConfidence = 0;
    let validEntityCount = 0;
    
    for (const validation of Object.values(entities.validation)) {
      if (validation?.confidence !== undefined) {
        entityConfidence += validation.confidence;
        validEntityCount++;
      }
    }
    
    const avgEntityConfidence = validEntityCount > 0 ? entityConfidence / validEntityCount : 0.5;
    return (intentMatch.confidence * 0.7) + (avgEntityConfidence * 0.3);
  }

  /**
   * Generate helpful suggestions based on validation results
   */
  private generateSuggestions(entities: ValidatedEntities, errors: string[]): string[] {
    const suggestions: string[] = [];
    
    for (const validation of Object.values(entities.validation)) {
      if (!validation.isValid && validation.suggestions) {
        suggestions.push(...validation.suggestions);
      }
    }
    
    if (suggestions.length === 0 && errors.length > 0) {
      suggestions.push('Please try rephrasing your command with more specific information');
    }
    
    return [...new Set(suggestions)]; // Remove duplicates
  }

  /**
   * Update conversation context
   */
  private updateContext(intent: IntentType, entities: ValidatedEntities): void {
    this.context.lastIntent = intent;
    this.context.timestamp = new Date();
    
    if (entities.customerName) {
      this.context.lastCustomer = entities.customerName;
    }
  }

  private normalizeQuery(query: string): string {
    return query.trim().toLowerCase();
  }

  private formatName(name: string): string {
    return name.split(' ').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join(' ');
  }

  private async extractGenericEntities(_query: string, _entities: ValidatedEntities): Promise<void> {
    // Implement generic entity extraction for other intents
    // This is a placeholder for the existing logic
    return;
  }
}

interface ValidationResult {
  isValid: boolean;
  confidence: number;
  issues: string[];
  suggestions: string[];
}

// Export types for use in other files
export type { ValidationResult };
export { EnhancedIntentClassificationService };

