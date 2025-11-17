# Dashboard Rollback Framework

## Phase 0.6: Rollback Framework and Phase Gates

This document defines rollback procedures for each phase of the dashboard refactor. Each phase includes specific rollback triggers, procedures, and validation steps.

## General Rollback Principles

1. **Feature Flags First**: All new features must be behind feature flags for instant disable
2. **Data Safety**: Never rollback in a way that loses user data
3. **Gradual Rollback**: Roll back gradually (canary → full) when possible
4. **Validation**: Always validate rollback success before proceeding
5. **Communication**: Notify stakeholders before and after rollback

## Phase 0 Rollback

### Rollback Triggers
- Metrics collection causing performance degradation
- Feature flag system breaking existing functionality
- Data audit scripts corrupting data

### Rollback Procedure
1. **Disable metrics collection** (if causing issues)
   ```bash
   # Set environment variable
   export ENABLE_METRICS=false
   # Restart services
   ```

2. **Disable feature flags** (if breaking)
   ```bash
   # Set all dashboard flags to false
   export FEATURE_DASHBOARD_NEW_STATE_MANAGEMENT=false
   # Restart frontend
   ```

3. **Validate**: Check that dashboard still loads and functions normally

### Rollback Testing
- Test in staging before production
- Verify metrics endpoint doesn't break
- Confirm feature flags default correctly

---

## Phase 1 Rollback: Core State Management

### Rollback Triggers
- State corruption detected (regions disappearing, duplicates)
- Error rate > 5% for region operations
- Grid becomes unresponsive
- Undo/redo causing data loss

### Rollback Procedure

#### Immediate (Feature Flag)
```typescript
// Disable new state management
localStorage.setItem('DASHBOARD_NEW_STATE_MANAGEMENT', 'false');
window.location.reload();
```

#### Backend Rollback
1. **Disable new store endpoints** (if using API v2)
   ```bash
   # Revert to v1 endpoints
   export FEATURE_DASHBOARD_API_V2=false
   ```

2. **Restore old hooks** (if replaced)
   - Revert `useRegionLayout.ts` to previous version
   - Ensure old API calls still work

3. **Data Validation**
   ```sql
   -- Check for corrupted regions
   SELECT COUNT(*) FROM dashboard_regions 
   WHERE deleted_at IS NULL 
   AND (grid_col IS NULL OR col_span IS NULL);
   ```

#### Frontend Rollback
1. **Revert regionStore.ts** to previous version
2. **Restore old useRegionLayout** implementation
3. **Clear localStorage** (if state persisted)
   ```javascript
   localStorage.removeItem('region-storage');
   ```

### Validation Steps
1. Load dashboard - should work with old system
2. Add region - should work normally
3. Move/resize region - should work normally
4. Check for duplicate regions
5. Verify no data loss

### Rollback Duration Target
< 15 minutes from trigger to validated rollback

---

## Phase 2 Rollback: Data Layer & Mobile

### Rollback Triggers
- Repository layer causing query failures
- Mobile dashboard breaking desktop
- Audit logging causing performance issues
- API v2 breaking existing clients

### Rollback Procedure

#### Repository Rollback
1. **Revert to direct Supabase calls**
   - Restore old `dashboard.service.ts`
   - Remove repository dependency

2. **Disable audit logging**
   ```bash
   export FEATURE_DASHBOARD_AUDIT_LOGGING=false
   ```

#### Mobile Rollback
1. **Disable mobile dashboard**
   ```bash
   export FEATURE_DASHBOARD_MOBILE_BETA=false
   ```

2. **Route mobile users to desktop** (if needed)
   - Update routing logic
   - Show desktop version on mobile

#### API Versioning Rollback
1. **Revert to v1 only**
   ```bash
   export FEATURE_DASHBOARD_API_V2=false
   ```

2. **Remove v2 endpoints** (if causing issues)
   - Comment out v2 routes
   - Ensure v1 still works

### Validation Steps
1. Test all CRUD operations
2. Verify no orphaned data
3. Check audit log table (if enabled)
4. Test mobile redirect (if applicable)

### Rollback Duration Target
< 30 minutes

---

## Phase 3 Rollback: Security & Multi-Tenancy

### Rollback Triggers
- RLS policies blocking legitimate access
- Validation errors on valid data
- XSS protection breaking legitimate content
- RBAC denying authorized users

### Rollback Procedure

#### RLS Rollback
1. **Temporarily disable RLS** (emergency only)
   ```sql
   ALTER TABLE dashboard_regions DISABLE ROW LEVEL SECURITY;
   -- Only if critical and can't fix policy quickly
   ```

2. **Revert to application-level filtering**
   - Restore explicit tenant_id filters
   - Ensure no cross-tenant data leakage

#### Validation Rollback
1. **Relax validation rules** (temporarily)
   - Comment out strict validations
   - Log validation failures for review

2. **Restore old validation** (if needed)
   - Revert validation service
   - Use previous DTOs

### Validation Steps
1. Test cross-tenant isolation (should still work)
2. Verify authorized users can access
3. Check validation logs for false positives
4. Test with known-good data

### Rollback Duration Target
< 20 minutes

---

## Phase 4 Rollback: Performance & Caching

### Rollback Triggers
- Virtualization breaking drag/drop
- Cache causing stale data
- WebSocket scaling issues
- Rate limiting blocking legitimate users

### Rollback Procedure

#### Virtualization Rollback
1. **Disable virtualization**
   ```bash
   export FEATURE_DASHBOARD_VIRTUALIZATION=false
   ```

2. **Fall back to full grid**
   - Use standard RegionGrid
   - Disable view/edit mode toggle

#### Cache Rollback
1. **Disable caching** (if causing stale data)
   ```bash
   export DISABLE_DASHBOARD_CACHE=true
   ```

2. **Clear all caches**
   ```bash
   # Redis
   redis-cli FLUSHDB
   
   # Memory cache (restart service)
   ```

#### Rate Limiting Rollback
1. **Increase rate limits** (temporarily)
   ```typescript
   // Increase limits in rate-limit.middleware.ts
   points: 10000, // Very high limit
   ```

2. **Disable rate limiting** (if critical)
   ```bash
   export DISABLE_RATE_LIMITING=true
   ```

### Validation Steps
1. Test with large layouts (> 100 regions)
2. Verify data freshness
3. Check WebSocket connections
4. Test under load

### Rollback Duration Target
< 15 minutes

---

## Phase 5 Rollback: UX & Features

### Rollback Triggers
- Settings dialog breaking
- Search/filter not working
- Mobile experience worse than before
- Onboarding breaking existing users

### Rollback Procedure

#### Settings Dialog Rollback
1. **Revert to old settings component**
   - Restore previous RegionSettingsDialog
   - Remove tabbed interface

#### Search/Filter Rollback
1. **Disable new search** (if breaking)
   ```bash
   export FEATURE_DASHBOARD_ADVANCED_SEARCH=false
   ```

2. **Restore simple search**

#### Mobile Rollback
1. **Disable mobile enhancements**
   ```bash
   export FEATURE_DASHBOARD_MOBILE_BETA=false
   ```

### Validation Steps
1. Test all UX flows
2. Verify mobile still works (basic)
3. Check onboarding doesn't break
4. Test with existing users

### Rollback Duration Target
< 10 minutes

---

## Phase 6 Rollback: Observability

### Rollback Triggers
- Logging causing performance issues
- Metrics collection overwhelming system
- Error boundaries breaking functionality
- Health checks failing incorrectly

### Rollback Procedure

#### Logging Rollback
1. **Reduce log verbosity**
   ```bash
   export LOG_LEVEL=warn
   ```

2. **Disable structured logging** (if needed)
   - Revert to simple console.log
   - Remove request context tracking

#### Metrics Rollback
1. **Disable metrics collection**
   ```bash
   export ENABLE_METRICS=false
   ```

2. **Remove metrics interceptor**

#### Error Boundary Rollback
1. **Disable error boundaries** (if breaking)
   - Remove RegionErrorBoundary
   - Use standard error handling

### Validation Steps
1. Verify system still functions
2. Check error handling works
3. Test health endpoints
4. Monitor system resources

### Rollback Duration Target
< 10 minutes

---

## Emergency Rollback (Any Phase)

### When to Use
- Data corruption detected
- Security breach suspected
- Complete system failure
- Customer data at risk

### Emergency Procedure

1. **Immediate Actions** (< 2 minutes)
   ```bash
   # Disable ALL dashboard feature flags
   export FEATURE_DASHBOARD_NEW_STATE_MANAGEMENT=false
   export FEATURE_DASHBOARD_VIRTUALIZATION=false
   export FEATURE_DASHBOARD_MOBILE_BETA=false
   export FEATURE_DASHBOARD_PWA=false
   export FEATURE_DASHBOARD_EVENT_SOURCING=false
   export FEATURE_DASHBOARD_SAGA_ORCHESTRATION=false
   export FEATURE_DASHBOARD_CONFLICT_RESOLUTION=false
   export FEATURE_DASHBOARD_AUDIT_LOGGING=false
   export FEATURE_DASHBOARD_API_V2=false
   
   # Restart services
   pm2 restart all
   ```

2. **Database Safety** (< 5 minutes)
   ```sql
   -- Check for data corruption
   SELECT COUNT(*) FROM dashboard_regions WHERE deleted_at IS NULL;
   
   -- Verify no orphaned records
   SELECT COUNT(*) FROM dashboard_regions r
   LEFT JOIN dashboard_layouts l ON r.layout_id = l.id
   WHERE r.deleted_at IS NULL AND l.id IS NULL;
   ```

3. **Communication** (< 10 minutes)
   - Notify team via Slack/email
   - Update status page
   - Prepare customer communication

4. **Investigation** (< 30 minutes)
   - Review error logs
   - Check recent deployments
   - Identify root cause

### Post-Rollback

1. **Stabilize** (1 hour)
   - Ensure system is stable
   - Monitor error rates
   - Verify data integrity

2. **Root Cause Analysis** (24 hours)
   - Document what went wrong
   - Identify fix
   - Update rollback procedures

3. **Preventive Measures**
   - Add monitoring for trigger conditions
   - Improve testing
   - Update documentation

---

## Rollback Testing

### Pre-Production Testing

Before deploying any phase, test rollback in staging:

1. **Deploy phase changes**
2. **Verify functionality**
3. **Trigger rollback**
4. **Validate rollback success**
5. **Document any issues**

### Rollback Test Checklist

- [ ] Feature flags disable correctly
- [ ] Old system still works
- [ ] No data loss
- [ ] No data corruption
- [ ] Performance acceptable
- [ ] Error rates normal
- [ ] User experience acceptable

---

## Rollback Decision Tree

```
Is system completely broken?
├─ Yes → Emergency Rollback
└─ No → Is error rate > 5%?
    ├─ Yes → Phase-specific rollback
    └─ No → Is performance degraded > 50%?
        ├─ Yes → Phase-specific rollback
        └─ No → Is user data at risk?
            ├─ Yes → Emergency Rollback
            └─ No → Monitor and investigate
```

---

## Communication Templates

### Rollback Notification (Internal)

```
Subject: [URGENT] Dashboard Rollback - Phase X

We are rolling back Phase X due to [reason].

Timeline:
- Rollback started: [time]
- Expected completion: [time]
- Validation: [time]

Impact:
- [What's affected]
- [What still works]

Next Steps:
- [Investigation]
- [Fix timeline]
```

### Rollback Notification (Customer)

```
Subject: Dashboard Maintenance Notice

We're performing maintenance on the dashboard to address [issue].

During this time:
- [What's temporarily unavailable]
- [What still works]
- [Expected resolution time]

We apologize for any inconvenience.
```

---

## Rollback Metrics

Track these metrics for each rollback:

- Time to detect issue
- Time to trigger rollback
- Time to complete rollback
- Time to validate
- Data loss (should be 0)
- User impact
- Root cause

Use these metrics to improve rollback procedures and prevent future issues.



