# Search Implementation Guide

## 🚀 Quick Start

### 1. Deploy Database Functions
```bash
# Run in Supabase SQL Editor
psql -f frontend/scripts/verify-search-functions.sql
```

### 2. Test Search Functions
```bash
cd frontend
node scripts/test-search-fixes.js
```

### 3. Update Frontend Code
```typescript
// Replace existing search imports with:
import { unifiedSearchService } from '@/lib/unified-search-service';
import { searchErrorLogger } from '@/lib/search-error-logger';
```

## 🔧 Implementation Steps

### Step 1: Database Setup

1. **Deploy Search Functions**
   ```sql
   -- Run in Supabase SQL Editor
   \i frontend/scripts/verify-search-functions.sql
   ```

2. **Verify Functions Exist**
   ```sql
   SELECT routine_name FROM information_schema.routines 
   WHERE routine_name LIKE 'search_customers%';
   ```

3. **Check Permissions**
   ```sql
   GRANT EXECUTE ON FUNCTION search_customers_enhanced TO authenticated;
   GRANT EXECUTE ON FUNCTION search_customers_multi_word TO authenticated;
   GRANT EXECUTE ON FUNCTION search_customers_fuzzy TO authenticated;
   ```

### Step 2: Frontend Integration

1. **Replace Search Service**
   ```typescript
   // Old way (multiple services)
   import { searchService } from './search-service';
   import { enhancedSearchService } from './enhanced-search-service';
   
   // New way (unified service)
   import { unifiedSearchService } from './unified-search-service';
   ```

2. **Update Search Components**
   ```typescript
   // In your search components
   const handleSearch = async (query: string) => {
     try {
       const result = await unifiedSearchService.searchCustomers(query, {
         maxResults: 50,
         enableFuzzy: true,
         enableMultiWord: true
       });
       
       setSearchResults(result.data);
       setSearchStats({
         totalCount: result.totalCount,
         executionTime: result.executionTimeMs,
         method: result.searchMethod
       });
     } catch (error) {
       console.error('Search failed:', error);
       // Error is automatically logged by unifiedSearchService
     }
   };
   ```

3. **Add Error Monitoring**
   ```typescript
   // Monitor search errors
   import { searchErrorLogger } from '@/lib/search-error-logger';
   
   // Get error statistics
   const errorStats = searchErrorLogger.getErrorStats();
   console.log('Search errors:', errorStats);
   
   // Get recent errors
   const recentErrors = searchErrorLogger.getRecentErrors(10);
   ```

### Step 3: Testing

1. **Run Comprehensive Tests**
   ```bash
   cd frontend
   node scripts/test-search-fixes.js
   ```

2. **Unit Tests**
   ```bash
   npm test unified-search-service.test.ts
   ```

3. **Integration Tests**
   ```bash
   npm run test:integration
   ```

## 🎯 Key Features

### 1. Unified Search Service
- **Single API**: One service for all search operations
- **Multiple Strategies**: Tries different search methods automatically
- **Error Handling**: Comprehensive error logging and recovery
- **Performance**: Optimized for speed and reliability

### 2. Error Logging
- **Automatic Logging**: All errors are automatically logged
- **Categorization**: Errors are categorized by type and severity
- **Analytics**: Track error rates and patterns
- **Resolution**: Mark errors as resolved

### 3. Search Methods
- **Enhanced Search**: Uses `search_customers_enhanced` function
- **Multi-word Search**: Handles complex queries
- **Fuzzy Search**: Typo-tolerant search with pg_trgm
- **Fallback Search**: Direct Supabase queries as backup

## 🔍 Troubleshooting

### Common Issues

#### 1. "Function not found" errors
```sql
-- Check if functions exist
SELECT routine_name FROM information_schema.routines 
WHERE routine_name LIKE 'search_customers%';

-- If missing, deploy them
\i frontend/scripts/simple-working-search.sql
```

#### 2. Permission denied errors
```sql
-- Grant proper permissions
GRANT EXECUTE ON FUNCTION search_customers_enhanced TO authenticated;
GRANT EXECUTE ON FUNCTION search_customers_multi_word TO authenticated;
GRANT EXECUTE ON FUNCTION search_customers_fuzzy TO authenticated;
```

#### 3. Authentication issues
```typescript
// Check authentication
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);

// Check tenant ID
const tenantId = await getTenantId();
console.log('Tenant ID:', tenantId);
```

#### 4. RLS policy issues
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'accounts';

-- Disable RLS for testing (NOT for production)
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
```

### Performance Issues

#### 1. Slow search queries
```sql
-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accounts_name ON accounts(name);
CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts(email);
CREATE INDEX IF NOT EXISTS idx_accounts_phone ON accounts(phone);
CREATE INDEX IF NOT EXISTS idx_accounts_tenant ON accounts(tenant_id);
```

#### 2. High error rates
```typescript
// Monitor error rates
const stats = await unifiedSearchService.getSearchStats();
if (stats.errorRate > 5) {
  console.warn('High error rate detected:', stats.errorRate);
}
```

## 📊 Monitoring

### 1. Search Performance
```typescript
// Track search performance
const result = await unifiedSearchService.searchCustomers(query);
console.log(`Search took ${result.executionTimeMs}ms`);
console.log(`Found ${result.totalCount} results`);
console.log(`Used method: ${result.searchMethod}`);
```

### 2. Error Monitoring
```typescript
// Get error statistics
const errorStats = searchErrorLogger.getErrorStats();
console.log('Total errors:', errorStats.total);
console.log('Unresolved errors:', errorStats.unresolved);
console.log('Error rate:', (errorStats.unresolved / errorStats.total) * 100);
```

### 3. Search Analytics
```typescript
// Track search patterns
const searchStats = await unifiedSearchService.getSearchStats();
console.log('Search method distribution:', searchStats.methodDistribution);
console.log('Average execution time:', searchStats.avgExecutionTime);
```

## 🚀 Advanced Features

### 1. Search Caching
```typescript
// Enable caching for better performance
const result = await unifiedSearchService.searchCustomers(query, {
  enableCaching: true,
  cacheTimeout: 300000 // 5 minutes
});
```

### 2. Search Suggestions
```typescript
// Get search suggestions
const suggestions = await unifiedSearchService.getSearchSuggestions(query);
console.log('Suggestions:', suggestions);
```

### 3. Search Analytics
```typescript
// Track search analytics
await unifiedSearchService.trackSearchAnalytics({
  query,
  resultsCount: result.totalCount,
  executionTime: result.executionTimeMs,
  method: result.searchMethod
});
```

## 📋 Checklist

### Pre-deployment
- [ ] Database functions deployed
- [ ] Permissions granted
- [ ] RLS policies configured
- [ ] Tests passing
- [ ] Error logging working

### Post-deployment
- [ ] Search functionality working
- [ ] Error rates acceptable
- [ ] Performance metrics good
- [ ] Monitoring in place
- [ ] Documentation updated

## 🎯 Success Metrics

- **Search Latency**: < 200ms for 95% of queries
- **Error Rate**: < 1% for all search operations
- **Availability**: 99.9% uptime for search functionality
- **User Satisfaction**: Clear error messages and consistent behavior

## 📞 Support

If you encounter issues:

1. **Check the logs**: Look for error messages in the console
2. **Run tests**: Use the test script to identify issues
3. **Check database**: Verify functions and permissions
4. **Review documentation**: Check this guide for solutions

For additional help, refer to the comprehensive audit report: `CRM_GLOBAL_SEARCH_AUDIT_REPORT.md`
