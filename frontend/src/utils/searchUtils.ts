// ============================================================================
// ENHANCED SEARCH UTILITIES
// ============================================================================
// Provides robust search functionality for customer data

export interface SearchResult {
  customer: any;
  relevance: number;
  matchType: 'exact' | 'partial' | 'fuzzy';
  matchedFields: string[];
}

export class SearchUtils {
  /**
   * Normalize phone number to digits-only for comparison
   */
  static normalizePhone(phone: string): string {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
  }

  /**
   * Check if search term matches phone number (handles partial matches)
   */
  static matchPhone(searchTerm: string, phone: string, phoneDigits?: string): boolean {
    if (!phone || !searchTerm) return false;
    
    const searchDigits = searchTerm.replace(/\D/g, '');
    const normalizedPhoneDigits = phoneDigits || this.normalizePhone(phone);
    
    // If search is digits-only, check if it's contained in phone_digits
    if (searchDigits.length > 0) {
      return normalizedPhoneDigits.includes(searchDigits) || phone.includes(searchTerm);
    }
    
    // Otherwise check if search term is in phone
    return phone.toLowerCase().includes(searchTerm.toLowerCase());
  }

  /**
   * Tokenize search term for multi-word address matching
   */
  static tokenizeSearch(searchTerm: string): string[] {
    return searchTerm.toLowerCase().split(/\s+/).filter(token => token.length > 0);
  }

  /**
   * Check if search term matches address fields
   */
  static matchAddress(searchTerm: string, address: string, city: string, state: string, zip: string): boolean {
    if (!searchTerm) return false;
    
    const tokens = this.tokenizeSearch(searchTerm);
    const addressFields = [address, city, state, zip].filter(Boolean).map(field => field.toLowerCase());
    
    if (tokens.length > 1) {
      // Multi-word search: each token must match at least one field
      return tokens.every(token => 
        addressFields.some(field => field.includes(token))
      );
    } else {
      // Single word search
      return addressFields.some(field => field.includes(searchTerm.toLowerCase()));
    }
  }

  /**
   * Calculate relevance score for search result
   */
  static calculateRelevance(searchTerm: string, customer: any): SearchResult {
    const searchLower = searchTerm.toLowerCase();
    const matchedFields: string[] = [];
    let relevance = 0;
    let matchType: 'exact' | 'partial' | 'fuzzy' = 'fuzzy';

    // Phone number matching (highest priority for digits)
    if (this.matchPhone(searchTerm, customer.phone, customer.phone_digits)) {
      matchedFields.push('phone');
      relevance += 100;
      if (customer.phone.toLowerCase().includes(searchLower)) {
        matchType = 'exact';
        relevance += 50;
      }
    }

    // Name matching (high priority)
    if (customer.name?.toLowerCase().includes(searchLower)) {
      matchedFields.push('name');
      relevance += 80;
      if (customer.name.toLowerCase() === searchLower) {
        matchType = 'exact';
        relevance += 40;
      }
    }

    // Address matching
    if (this.matchAddress(searchTerm, customer.address, customer.city, customer.state, customer.zip_code)) {
      matchedFields.push('address');
      relevance += 60;
    }

    // Email matching
    if (customer.email?.toLowerCase().includes(searchLower)) {
      matchedFields.push('email');
      relevance += 40;
      if (customer.email.toLowerCase() === searchLower) {
        matchType = 'exact';
        relevance += 20;
      }
    }

    // Status matching
    if (customer.status?.toLowerCase().includes(searchLower)) {
      matchedFields.push('status');
      relevance += 30;
    }

    // Account type matching
    if (customer.account_type?.toLowerCase().includes(searchLower)) {
      matchedFields.push('account_type');
      relevance += 30;
    }

    return {
      customer,
      relevance,
      matchType,
      matchedFields
    };
  }

  /**
   * Perform enhanced search on customer data
   */
  static searchCustomers(customers: any[], searchTerm: string): SearchResult[] {
    if (!searchTerm.trim()) {
      return customers.map(customer => ({
        customer,
        relevance: 0,
        matchType: 'fuzzy' as const,
        matchedFields: []
      }));
    }

    const results: SearchResult[] = [];

    for (const customer of customers) {
      const result = this.calculateRelevance(searchTerm, customer);
      if (result.relevance > 0) {
        results.push(result);
      }
    }

    // Sort by relevance (highest first)
    return results.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Build Supabase search query for server-side filtering
   */
  static buildSearchQuery(searchTerm: string): string {
    if (!searchTerm.trim()) return '';
    
    const phoneDigits = searchTerm.replace(/\D/g, '');
    const searchLower = searchTerm.toLowerCase();
    
    let query = `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`;
    
    // Enhanced phone search
    if (phoneDigits.length > 0) {
      query += `,phone.ilike.%${searchTerm}%,phone.ilike.%${phoneDigits}%`;
    } else {
      query += `,phone.ilike.%${searchTerm}%`;
    }
    
    // Enhanced address search with tokenization
    const tokens = this.tokenizeSearch(searchTerm);
    if (tokens.length > 1) {
      tokens.forEach(token => {
        query += `,address.ilike.%${token}%,city.ilike.%${token}%,state.ilike.%${token}%,zip_code.ilike.%${token}%`;
      });
    } else {
      query += `,address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,state.ilike.%${searchTerm}%,zip_code.ilike.%${searchTerm}%`;
    }
    
    // Additional fields
    query += `,account_type.ilike.%${searchTerm}%,status.ilike.%${searchTerm}%`;
    
    return query;
  }
}
