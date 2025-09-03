# 🚀 **SEARCH ANALYTICS DEPLOYMENT GUIDE**

## 📋 **Overview**

This guide will help you deploy the comprehensive Search Analytics system for VeroSuite. The system includes:

- **Database Schema**: 7 analytics tables with proper indexing and RLS
- **Backend Functions**: 15+ PostgreSQL functions for data collection and analysis
- **Frontend Service**: TypeScript service for analytics integration
- **Dashboard Component**: React dashboard with charts and insights

## 🗄️ **Step 1: Deploy Database Schema**

### 1.1 Run the Schema Script

Copy and paste the entire contents of `search-analytics-schema.sql` into your **Supabase SQL Editor**:

```sql
-- Copy the entire content from: frontend/scripts/search-analytics-schema.sql
```

**Expected Output:**
```
 table_name | table_type
------------+------------
 search_errors | BASE TABLE
 search_logs | BASE TABLE
 search_performance_metrics | BASE TABLE
 search_suggestions_analytics | BASE TABLE
 search_trends | BASE TABLE
 search_user_behavior | BASE TABLE
 search_trends | BASE TABLE
```

### 1.2 Verify RLS Policies

Check that Row Level Security is enabled on all tables:

```sql
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename LIKE 'search_%';
```

All tables should show `t` (true) for `rowsecurity`.

## ⚙️ **Step 2: Deploy Backend Functions**

### 2.1 Run the Functions Script

Copy and paste the entire contents of `search-analytics-functions.sql` into your **Supabase SQL Editor**:

```sql
-- Copy the entire content from: frontend/scripts/search-analytics-functions.sql
```

**Expected Output:**
```
 routine_name | routine_type
--------------+--------------
 aggregate_daily_search_metrics | FUNCTION
 cleanup_old_search_logs | FUNCTION
 get_search_error_summary | FUNCTION
 get_search_performance_summary | FUNCTION
 get_trending_searches | FUNCTION
 get_user_search_insights | FUNCTION
 log_search_click | FUNCTION
 log_search_error | FUNCTION
 log_search_query | FUNCTION
 update_popular_searches | FUNCTION
 update_search_performance_metrics | FUNCTION
 update_trending_status | FUNCTION
 update_user_search_behavior | FUNCTION
```

### 2.2 Verify Function Permissions

Check that all functions are accessible:

```sql
SELECT 
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name LIKE '%search%'
ORDER BY routine_name;
```

All functions should show `INVOKER` for `security_type`.

## 🔧 **Step 3: Frontend Integration**

### 3.1 Copy Analytics Service

Copy `frontend/src/lib/search-analytics-service.ts` to your project.

### 3.2 Copy Dashboard Component

Copy `frontend/src/components/analytics/SearchAnalyticsDashboard.tsx` to your project.

### 3.3 Update Advanced Search Hook

Modify your `useAdvancedSearch.ts` hook to integrate analytics:

```typescript
// Add import
import { searchAnalyticsService } from '../lib/search-analytics-service';

// Inside your search function, add:
const queryId = searchAnalyticsService.createQueryId();
searchAnalyticsService.startSearchTracking(queryId);

// After search completes:
searchAnalyticsService.completeSearchTracking(queryId, {
  queryText: searchQuery,
  queryType: 'hybrid',
  searchMode: searchMode,
  resultsCount: results.length,
  cacheHit: false, // Enhance with actual cache detection
  searchSuccessful: true,
  sessionId: searchAnalyticsService.getSessionId()
});
```

## 🧪 **Step 4: Testing & Verification**

### 4.1 Test Analytics Logging

1. **Perform a search** in your application
2. **Check the database** for new records:

```sql
-- Check search logs
SELECT * FROM search_logs ORDER BY created_at DESC LIMIT 5;

-- Check popular searches
SELECT * FROM popular_searches ORDER BY created_at DESC LIMIT 5;

-- Check performance metrics
SELECT * FROM search_performance_metrics ORDER BY created_at DESC LIMIT 5;
```

### 4.2 Test Analytics Queries

```sql
-- Test performance summary
SELECT * FROM get_search_performance_summary('your-tenant-id'::UUID, 30);

-- Test trending searches
SELECT * FROM get_trending_searches('your-tenant-id'::UUID, 10);

-- Test error summary
SELECT * FROM get_search_error_summary('your-tenant-id'::UUID, 30);
```

### 4.3 Test Frontend Dashboard

1. **Navigate to the dashboard** component
2. **Verify data loading** and display
3. **Check for console errors**
4. **Test time range switching**

## 📊 **Step 5: Dashboard Features**

### 5.1 Key Metrics Displayed

- **Total Searches**: Count of all search queries
- **Unique Users**: Number of distinct users searching
- **Success Rate**: Percentage of successful searches
- **Response Time**: Average search execution time
- **Cache Hit Rate**: Percentage of cached results
- **Trending Searches**: Most popular current queries

### 5.2 Performance Insights

- **Success Rate Trends**: Track search reliability over time
- **Response Time Analysis**: Identify performance bottlenecks
- **Cache Effectiveness**: Monitor caching strategy success
- **Error Tracking**: Monitor and resolve search issues

### 5.3 User Behavior Analysis

- **Search Patterns**: Understand how users search
- **Query Preferences**: Identify common search terms
- **Success Patterns**: Learn what leads to successful searches
- **Personal Insights**: Individual user search behavior

## 🔄 **Step 6: Maintenance & Optimization**

### 6.1 Automated Cleanup

Set up a cron job or scheduled task to run:

```sql
-- Clean old search logs (keep 90 days)
SELECT cleanup_old_search_logs();

-- Aggregate daily metrics
SELECT aggregate_daily_search_metrics();
```

### 6.2 Performance Monitoring

Monitor these key metrics:

```sql
-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE tablename LIKE 'search_%'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE tablename LIKE 'search_%'
ORDER BY idx_scan DESC;
```

### 6.3 Data Retention Policy

- **Search Logs**: 90 days (configurable)
- **Performance Metrics**: 1 year (hourly aggregation)
- **Popular Searches**: Indefinite (with trend decay)
- **User Behavior**: Indefinite (privacy compliant)

## 🚨 **Troubleshooting**

### Common Issues

1. **Permission Denied**
   ```sql
   -- Grant permissions manually if needed
   GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
   GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
   ```

2. **RLS Policy Issues**
   ```sql
   -- Check RLS status
   SELECT tablename, rowsecurity FROM pg_tables WHERE tablename LIKE 'search_%';
   
   -- Re-enable RLS if needed
   ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;
   ```

3. **Function Not Found**
   ```sql
   -- Verify function exists
   SELECT routine_name FROM information_schema.routines WHERE routine_name LIKE '%search%';
   
   -- Check function permissions
   SELECT routine_name, security_type FROM information_schema.routines WHERE routine_name LIKE '%search%';
   ```

### Performance Issues

1. **Slow Analytics Queries**
   - Check index usage: `EXPLAIN ANALYZE`
   - Verify table statistics: `ANALYZE search_logs;`
   - Monitor query execution plans

2. **Large Table Sizes**
   - Implement data partitioning for large datasets
   - Set up automated cleanup schedules
   - Consider archiving old data

## 🎯 **Next Steps**

After successful deployment:

1. **Monitor Performance**: Watch for any performance impacts
2. **Gather Insights**: Use the dashboard to understand search patterns
3. **Optimize Search**: Apply insights to improve search algorithms
4. **Expand Analytics**: Add more metrics and visualizations
5. **User Training**: Educate users on analytics insights

## 📞 **Support**

If you encounter issues:

1. **Check console logs** for error messages
2. **Verify database connectivity** and permissions
3. **Test individual functions** in SQL Editor
4. **Review RLS policies** and tenant isolation
5. **Check function permissions** and grants

---

**🎉 Congratulations!** You now have a comprehensive Search Analytics system that will provide valuable insights into your search performance and user behavior.



