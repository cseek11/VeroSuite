// ============================================================================
// INTENT CLASSIFICATION SERVICE
// ============================================================================
// Rule-based intent classification for natural language search queries
// Provides cost-effective intent detection with high accuracy for pest control domain

export interface IntentResult {
  intent: SearchIntent;
  confidence: number;
  entities: ExtractedEntities;
  originalQuery: string;
  processedQuery: string;
}

export type SearchIntent = 
  | 'search'           // Default search behavior
  | 'createCustomer'   // Create new customer account
  | 'scheduleAppointment' // Schedule service appointment
  | 'updateAppointment'   // Reschedule or modify appointment
  | 'addNote'          // Add note to customer
  | 'searchInvoices'   // Search for invoices
  | 'markInvoicePaid'  // Mark invoice as paid
  | 'assignTechnician' // Assign technician to job
  | 'createServicePlan' // Create recurring service plan
  | 'sendReminder';    // Send reminder to customer

export interface ExtractedEntities {
  customerName?: string;
  address?: string;
  phone?: string;
  email?: string;
  pestType?: string;
  serviceDate?: string;
  serviceTime?: string;
  appointmentId?: string;
  invoiceId?: string;
  technicianName?: string;
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
}

export interface IntentPattern {
  patterns: RegExp[];
  intent: SearchIntent;
  priority: number;
  entityExtractors: EntityExtractor[];
}

export type EntityExtractor = (query: string, matches: RegExpMatchArray) => Partial<ExtractedEntities>;

// ============================================================================
// INTENT CLASSIFICATION SERVICE
// ============================================================================

export class IntentClassificationService {
  private intentPatterns: IntentPattern[] = [];

  constructor() {
    this.initializePatterns();
  }

  /**
   * Initialize all intent patterns with their regex and entity extractors
   */
  private initializePatterns(): void {
    // Create Customer Intent
    this.intentPatterns.push({
      intent: 'createCustomer',
      priority: 1,
      patterns: [
        /create\s+(?:a\s+)?(?:new\s+)?(?:customer\s+)?account\s+for\s+(.+)/i,
        /new\s+(?:customer\s+)?account\s+for\s+(.+)/i,
        /add\s+(?:a\s+)?(?:new\s+)?customer\s+(.+)/i,
        /create\s+(?:a\s+)?customer\s+(.+)/i,
        /new\s+customer\s+(.+)/i
      ],
      entityExtractors: [
        this.extractCustomerNameFromCreate,
        this.extractAddressFromCreate,
        this.extractPhoneFromCreate,
        this.extractEmailFromCreate,
        this.extractNotesFromCreate
      ]
    });

    // Schedule Appointment Intent
    this.intentPatterns.push({
      intent: 'scheduleAppointment',
      priority: 2,
      patterns: [
        /schedule\s+(.+?)\s+(?:for\s+)?(.+)/i,
        /book\s+(.+?)\s+(?:for\s+)?(.+)/i,
        /schedule\s+(?:an\s+)?appointment\s+(?:for\s+)?(.+)/i,
        /book\s+(?:an\s+)?appointment\s+(?:for\s+)?(.+)/i,
        /schedule\s+(.+?)\s+treatment\s+(?:for\s+)?(.+)/i,
        /book\s+(.+?)\s+service\s+(?:for\s+)?(.+)/i
      ],
      entityExtractors: [
        this.extractServiceTypeFromSchedule,
        this.extractCustomerNameFromSchedule,
        this.extractDateTimeFromSchedule,
        this.extractAddressFromSchedule,
        this.extractUrgencyFromSchedule
      ]
    });

    // Update Appointment Intent
    this.intentPatterns.push({
      intent: 'updateAppointment',
      priority: 3,
      patterns: [
        /reschedule\s+(.+?)\s+(?:for\s+)?(.+)/i,
        /change\s+(?:the\s+)?appointment\s+(?:for\s+)?(.+?)\s+(?:to\s+)?(.+)/i,
        /move\s+(?:the\s+)?appointment\s+(?:for\s+)?(.+?)\s+(?:to\s+)?(.+)/i,
        /reschedule\s+(?:today'?s\s+)?(?:appointment\s+)?(?:for\s+)?(.+?)\s+(?:to\s+)?(.+)/i
      ],
      entityExtractors: [
        this.extractCustomerNameFromUpdate,
        this.extractNewDateTimeFromUpdate,
        this.extractAppointmentIdFromUpdate
      ]
    });

    // Add Note Intent
    this.intentPatterns.push({
      intent: 'addNote',
      priority: 4,
      patterns: [
        /add\s+note\s*:\s*(.+?)\s+(?:for\s+)?(.+)/i,
        /add\s+note\s+(?:for\s+)?(.+?)\s*:\s*(.+)/i,
        /note\s*:\s*(.+?)\s+(?:for\s+)?(.+)/i
      ],
      entityExtractors: [
        this.extractNoteContentFromAddNote,
        this.extractCustomerNameFromAddNote
      ]
    });

    // Search Invoices Intent
    this.intentPatterns.push({
      intent: 'searchInvoices',
      priority: 5,
      patterns: [
        /show\s+(?:all\s+)?(?:unpaid\s+)?invoices\s+(.+)/i,
        /find\s+(?:unpaid\s+)?invoices\s+(.+)/i,
        /search\s+(?:for\s+)?(?:unpaid\s+)?invoices\s+(.+)/i,
        /invoices\s+(.+)/i
      ],
      entityExtractors: [
        this.extractDateRangeFromInvoiceSearch,
        this.extractAmountRangeFromInvoiceSearch,
        this.extractCustomerNameFromInvoiceSearch
      ]
    });

    // Mark Invoice Paid Intent
    this.intentPatterns.push({
      intent: 'markInvoicePaid',
      priority: 6,
      patterns: [
        /mark\s+invoice\s+(.+?)\s+as\s+paid/i,
        /invoice\s+(.+?)\s+paid/i,
        /mark\s+(.+?)\s+invoice\s+as\s+paid/i
      ],
      entityExtractors: [
        this.extractInvoiceIdFromMarkPaid
      ]
    });

    // Assign Technician Intent
    this.intentPatterns.push({
      intent: 'assignTechnician',
      priority: 7,
      patterns: [
        /assign\s+technician\s+(.+?)\s+to\s+(.+)/i,
        /assign\s+(.+?)\s+to\s+(.+)/i,
        /technician\s+(.+?)\s+assigned\s+to\s+(.+)/i
      ],
      entityExtractors: [
        this.extractTechnicianNameFromAssign,
        this.extractAppointmentIdFromAssign,
        this.extractCustomerNameFromAssign
      ]
    });

    // Create Service Plan Intent
    this.intentPatterns.push({
      intent: 'createServicePlan',
      priority: 8,
      patterns: [
        /create\s+(?:a\s+)?(?:quarterly\s+)?service\s+plan\s+(?:for\s+)?(.+)/i,
        /new\s+(?:quarterly\s+)?service\s+plan\s+(?:for\s+)?(.+)/i,
        /quarterly\s+service\s+plan\s+(?:for\s+)?(.+)/i
      ],
      entityExtractors: [
        this.extractCustomerNameFromServicePlan,
        this.extractAddressFromServicePlan,
        this.extractStartDateFromServicePlan
      ]
    });

    // Send Reminder Intent
    this.intentPatterns.push({
      intent: 'sendReminder',
      priority: 9,
      patterns: [
        /send\s+reminder\s+(?:to\s+)?(.+)/i,
        /remind\s+(.+)/i,
        /send\s+(?:a\s+)?reminder\s+(?:to\s+)?(.+)/i
      ],
      entityExtractors: [
        this.extractCustomerNameFromReminder
      ]
    });

    // Default Search Intent (lowest priority)
    this.intentPatterns.push({
      intent: 'search',
      priority: 10,
      patterns: [
        /find\s+(.+)/i,
        /lookup\s+(.+)/i,
        /search\s+(?:for\s+)?(.+)/i,
        /show\s+(?:all\s+)?(.+)/i,
        /(.+)/ // Catch-all pattern
      ],
      entityExtractors: [
        this.extractSearchQuery
      ]
    });
  }

  /**
   * Classify the intent of a natural language query
   */
  classifyIntent(query: string): IntentResult {
    const normalizedQuery = this.normalizeQuery(query);
    
    // Sort patterns by priority (lower number = higher priority)
    const sortedPatterns = [...this.intentPatterns].sort((a, b) => a.priority - b.priority);
    
    for (const pattern of sortedPatterns) {
      for (const regex of pattern.patterns) {
        const matches = normalizedQuery.match(regex);
        if (matches) {
          const entities = this.extractEntities(normalizedQuery, matches, pattern.entityExtractors);
          const confidence = this.calculateConfidence(matches, pattern.patterns);
          
          return {
            intent: pattern.intent,
            confidence,
            entities,
            originalQuery: query,
            processedQuery: normalizedQuery
          };
        }
      }
    }
    
    // Fallback to search intent
    return {
      intent: 'search',
      confidence: 0.5,
      entities: { notes: query },
      originalQuery: query,
      processedQuery: normalizedQuery
    };
  }

  /**
   * Normalize the query for better pattern matching
   */
  private normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[^\w\s]/g, ' '); // Remove special characters
  }

  /**
   * Extract entities using the provided extractors
   */
  private extractEntities(
    query: string, 
    matches: RegExpMatchArray, 
    extractors: EntityExtractor[]
  ): ExtractedEntities {
    const entities: ExtractedEntities = {};
    
    for (const extractor of extractors) {
      const extracted = extractor(query, matches);
      Object.assign(entities, extracted);
    }
    
    return entities;
  }

  /**
   * Calculate confidence score based on pattern match quality
   */
  private calculateConfidence(matches: RegExpMatchArray, patterns: RegExp[]): number {
    if (!matches || matches.length === 0) return 0;
    
    // Base confidence on how well the pattern matches
    const matchQuality = matches[0].length / patterns[0].source.length;
    const baseConfidence = Math.min(matchQuality * 1.5, 1.0);
    
    // Boost confidence for exact matches
    if (matchQuality > 0.8) return 0.95;
    if (matchQuality > 0.6) return 0.85;
    if (matchQuality > 0.4) return 0.75;
    
    return baseConfidence;
  }

  // ============================================================================
  // ENTITY EXTRACTORS
  // ============================================================================

  private extractCustomerNameFromCreate: EntityExtractor = (query, matches) => {
    const fullMatch = matches[1] || '';
    // Look for patterns like "John Doe at 123 Main St" or "John Doe, 555-1234"
    const nameMatch = fullMatch.match(/^([^,at]+?)(?:\s+(?:at|,)\s+|\s*$)/i);
    return nameMatch ? { customerName: nameMatch[1].trim() } : {};
  };

  private extractAddressFromCreate: EntityExtractor = (query, matches) => {
    const fullMatch = matches[1] || '';
    const addressMatch = fullMatch.match(/(?:at\s+)(.+?)(?:\s*$|,|\s+phone|\s+email)/i);
    return addressMatch ? { address: addressMatch[1].trim() } : {};
  };

  private extractPhoneFromCreate: EntityExtractor = (query, matches) => {
    const fullMatch = matches[1] || '';
    const phoneMatch = fullMatch.match(/(?:phone|tel|call)\s*[:\-]?\s*([\d\-\(\)\s]+)/i);
    return phoneMatch ? { phone: phoneMatch[1].trim() } : {};
  };

  private extractEmailFromCreate: EntityExtractor = (query, matches) => {
    const fullMatch = matches[1] || '';
    const emailMatch = fullMatch.match(/(?:email|e-mail)\s*[:\-]?\s*([^\s,]+)/i);
    return emailMatch ? { email: emailMatch[1].trim() } : {};
  };

  private extractNotesFromCreate: EntityExtractor = (query, matches) => {
    const fullMatch = matches[1] || '';
    const notesMatch = fullMatch.match(/(?:notes?|preferences?)\s*[:\-]?\s*(.+)/i);
    return notesMatch ? { notes: notesMatch[1].trim() } : {};
  };

  private extractServiceTypeFromSchedule: EntityExtractor = (query, matches) => {
    const serviceMatch = matches[1] || '';
    const pestTypes = ['roach', 'bed bug', 'termite', 'ant', 'rodent', 'spider', 'wasp'];
    const foundPest = pestTypes.find(pest => serviceMatch.toLowerCase().includes(pest));
    return foundPest ? { pestType: foundPest } : {};
  };

  private extractCustomerNameFromSchedule: EntityExtractor = (query, matches) => {
    const customerMatch = matches[2] || '';
    const nameMatch = customerMatch.match(/^([^,at]+?)(?:\s+(?:at|,)\s+|\s*$)/i);
    return nameMatch ? { customerName: nameMatch[1].trim() } : {};
  };

  private extractDateTimeFromSchedule: EntityExtractor = (query, matches) => {
    const timeMatch = matches[2] || '';
    // Look for time patterns like "7pm tomorrow", "2pm Friday", "10am next week"
    const timePatterns = [
      /(\d{1,2}(?::\d{2})?\s*(?:am|pm))\s+(tomorrow|today|next\s+\w+|friday|monday|tuesday|wednesday|thursday|saturday|sunday)/i,
      /(tomorrow|today|next\s+\w+|friday|monday|tuesday|wednesday|thursday|saturday|sunday)\s+at\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i
    ];
    
    for (const pattern of timePatterns) {
      const match = timeMatch.match(pattern);
      if (match) {
        return { 
          serviceTime: match[1] || match[2], 
          serviceDate: match[2] || match[1] 
        };
      }
    }
    
    return {};
  };

  private extractAddressFromSchedule: EntityExtractor = (query, matches) => {
    const customerMatch = matches[2] || '';
    const addressMatch = customerMatch.match(/(?:at\s+)(.+?)(?:\s*$|,|\s+phone|\s+email)/i);
    return addressMatch ? { address: addressMatch[1].trim() } : {};
  };

  private extractUrgencyFromSchedule: EntityExtractor = (query, matches) => {
    const urgencyKeywords = {
      urgent: 'urgent',
      asap: 'urgent',
      emergency: 'urgent',
      immediate: 'high',
      soon: 'medium',
      quick: 'medium'
    };
    
    for (const [keyword, level] of Object.entries(urgencyKeywords)) {
      if (query.toLowerCase().includes(keyword)) {
        return { urgency: level as 'low' | 'medium' | 'high' | 'urgent' };
      }
    }
    
    return {};
  };

  private extractCustomerNameFromUpdate: EntityExtractor = (query, matches) => {
    const customerMatch = matches[1] || '';
    const nameMatch = customerMatch.match(/^([^,at]+?)(?:\s+(?:at|,)\s+|\s*$)/i);
    return nameMatch ? { customerName: nameMatch[1].trim() } : {};
  };

  private extractNewDateTimeFromUpdate: EntityExtractor = (query, matches) => {
    const timeMatch = matches[2] || '';
    const timePatterns = [
      /(\d{1,2}(?::\d{2})?\s*(?:am|pm))\s+(tomorrow|today|next\s+\w+|friday|monday|tuesday|wednesday|thursday|saturday|sunday)/i,
      /(tomorrow|today|next\s+\w+|friday|monday|tuesday|wednesday|thursday|saturday|sunday)\s+at\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i
    ];
    
    for (const pattern of timePatterns) {
      const match = timeMatch.match(pattern);
      if (match) {
        return { 
          serviceTime: match[1] || match[2], 
          serviceDate: match[2] || match[1] 
        };
      }
    }
    
    return {};
  };

  private extractAppointmentIdFromUpdate: EntityExtractor = (query, matches) => {
    const idMatch = query.match(/appointment\s+#?(\w+)/i);
    return idMatch ? { appointmentId: idMatch[1] } : {};
  };

  private extractNoteContentFromAddNote: EntityExtractor = (query, matches) => {
    const noteMatch = matches[1] || '';
    return { notes: noteMatch.trim() };
  };

  private extractCustomerNameFromAddNote: EntityExtractor = (query, matches) => {
    const customerMatch = matches[2] || '';
    const nameMatch = customerMatch.match(/^([^,at]+?)(?:\s+(?:at|,)\s+|\s*$)/i);
    return nameMatch ? { customerName: nameMatch[1].trim() } : {};
  };

  private extractDateRangeFromInvoiceSearch: EntityExtractor = (query, matches) => {
    const dateMatch = matches[1] || '';
    const datePatterns = [
      /(january|february|march|april|may|june|july|august|september|october|november|december)/i,
      /(this\s+month|last\s+month|next\s+month)/i,
      /(over\s+\$?\d+)/i
    ];
    
    for (const pattern of datePatterns) {
      const match = dateMatch.match(pattern);
      if (match) {
        return { serviceDate: match[1] };
      }
    }
    
    return {};
  };

  private extractAmountRangeFromInvoiceSearch: EntityExtractor = (query, matches) => {
    const amountMatch = matches[1] || '';
    const amountPattern = /over\s+\$?(\d+)/i;
    const match = amountMatch.match(amountPattern);
    return match ? { notes: `Amount over $${match[1]}` } : {};
  };

  private extractCustomerNameFromInvoiceSearch: EntityExtractor = (query, matches) => {
    const customerMatch = matches[1] || '';
    const nameMatch = customerMatch.match(/^([^,at]+?)(?:\s+(?:at|,)\s+|\s*$)/i);
    return nameMatch ? { customerName: nameMatch[1].trim() } : {};
  };

  private extractInvoiceIdFromMarkPaid: EntityExtractor = (query, matches) => {
    const idMatch = matches[1] || '';
    return { invoiceId: idMatch.trim() };
  };

  private extractTechnicianNameFromAssign: EntityExtractor = (query, matches) => {
    const techMatch = matches[1] || '';
    const nameMatch = techMatch.match(/^([^,at]+?)(?:\s+(?:at|,)\s+|\s*$)/i);
    return nameMatch ? { technicianName: nameMatch[1].trim() } : {};
  };

  private extractAppointmentIdFromAssign: EntityExtractor = (query, matches) => {
    const appointmentMatch = matches[2] || '';
    const idMatch = appointmentMatch.match(/appointment\s+#?(\w+)/i);
    return idMatch ? { appointmentId: idMatch[1] } : {};
  };

  private extractCustomerNameFromAssign: EntityExtractor = (query, matches) => {
    const customerMatch = matches[2] || '';
    const nameMatch = customerMatch.match(/^([^,at]+?)(?:\s+(?:at|,)\s+|\s*$)/i);
    return nameMatch ? { customerName: nameMatch[1].trim() } : {};
  };

  private extractCustomerNameFromServicePlan: EntityExtractor = (query, matches) => {
    const customerMatch = matches[1] || '';
    const nameMatch = customerMatch.match(/^([^,at]+?)(?:\s+(?:at|,)\s+|\s*$)/i);
    return nameMatch ? { customerName: nameMatch[1].trim() } : {};
  };

  private extractAddressFromServicePlan: EntityExtractor = (query, matches) => {
    const addressMatch = matches[1] || '';
    const addressPattern = /(?:at\s+)(.+?)(?:\s*$|,|\s+phone|\s+email)/i;
    const match = addressMatch.match(addressPattern);
    return match ? { address: match[1].trim() } : {};
  };

  private extractStartDateFromServicePlan: EntityExtractor = (query, matches) => {
    const dateMatch = query.match(/(?:starting\s+)?(next\s+monday|next\s+week|tomorrow|today)/i);
    return dateMatch ? { serviceDate: dateMatch[1] } : {};
  };

  private extractCustomerNameFromReminder: EntityExtractor = (query, matches) => {
    const customerMatch = matches[1] || '';
    const nameMatch = customerMatch.match(/^([^,at]+?)(?:\s+(?:at|,)\s+|\s*$)/i);
    return nameMatch ? { customerName: nameMatch[1].trim() } : {};
  };

  private extractSearchQuery: EntityExtractor = (query, matches) => {
    const searchMatch = matches[1] || '';
    return { notes: searchMatch.trim() };
  };

  /**
   * Get all supported intents for help/autocomplete
   */
  getSupportedIntents(): SearchIntent[] {
    return this.intentPatterns.map(p => p.intent);
  }

  /**
   * Get example queries for each intent
   */
  getIntentExamples(): Record<SearchIntent, string[]> {
    return {
      search: [
        "Find John Smith",
        "Lookup customer at 123 Maple Ave",
        "Show all termite jobs in August"
      ],
      createCustomer: [
        "Create a new account for John Doe at 123 Maple Ave",
        "New customer John Smith, phone 555-1234",
        "Add customer Lisa Nguyen, email lisa@email.com"
      ],
      scheduleAppointment: [
        "Schedule bed bug treatment for Lisa Nguyen at 7pm tomorrow",
        "Book roach treatment for John Smith",
        "Schedule termite inspection for 456 Oak St"
      ],
      updateAppointment: [
        "Reschedule today's appointment for Jake to Friday at 10am",
        "Change the appointment for Mike to 2pm tomorrow",
        "Move Lisa's appointment to next Monday"
      ],
      addNote: [
        "Add note: Customer has pets, use only organic products",
        "Note for Emily: Prefers morning appointments",
        "Add note for John: Allergic to certain chemicals"
      ],
      searchInvoices: [
        "Show all unpaid invoices over $300",
        "Find invoices for John Smith",
        "Show invoices from last month"
      ],
      markInvoicePaid: [
        "Mark invoice 10023 as paid",
        "Invoice 10024 paid",
        "Mark invoice 10025 as paid"
      ],
      assignTechnician: [
        "Assign technician Alex to appointment #2093",
        "Assign Sam to Lisa's bed bug treatment",
        "Technician Jessica assigned to termite job"
      ],
      createServicePlan: [
        "Create quarterly service plan for Sam at 456 Oak St starting next Monday",
        "New quarterly service plan for Emily White",
        "Quarterly service plan for Downtown Office Complex"
      ],
      sendReminder: [
        "Send reminder to Emily White",
        "Remind John Smith about his appointment",
        "Send a reminder to Lisa Nguyen"
      ]
    };
  }
}

// Export singleton instance
export const intentClassificationService = new IntentClassificationService();


