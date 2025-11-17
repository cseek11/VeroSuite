# Dashboard Migration Strategy

## Phase 0.3: Migration Strategy and Scripts

This document outlines the migration strategy for transitioning the Region Dashboard to the enterprise architecture while maintaining data integrity and minimizing downtime.

## Migration Principles

1. **Zero Data Loss**: All migrations must preserve existing data
2. **Idempotency**: Migration scripts can be run multiple times safely
3. **Rollback Capability**: Every migration must have a rollback path
4. **Gradual Rollout**: Use feature flags for gradual migration
5. **Validation**: Verify data integrity before and after migration

## Pre-Migration Checklist

- [ ] Backup production database
- [ ] Run data audit script (`audit-dashboard-data.sql`)
- [ ] Document current state (region counts, layout counts, etc.)
- [ ] Test migration scripts on production copy
- [ ] Verify rollback procedures work
- [ ] Set up monitoring and alerts
- [ ] Schedule maintenance window (if needed)

## Migration Phases

### Phase 0: Foundation Migration

#### 0.1 Metrics Infrastructure
**Status**: No data migration required
**Rollback**: Disable metrics collection via feature flag

#### 0.2 Data Audit and Cleanup
**Migration Script**: `backend/fix-data-integrity-issues-v2.sql`
**Purpose**: Fix existing data integrity issues before refactor

**Steps**:
1. Run audit script to identify issues
2. Review audit results
3. Run fix script (idempotent)
4. Verify fixes with audit script again

**Rollback**: 
- Scripts are idempotent and safe to re-run
- No data loss risk (only fixes invalid data)

#### 0.3 Feature Flags
**Status**: No data migration required
**Rollback**: Disable feature flags via environment variables

#### 0.4 Performance Baselines
**Status**: No data migration required
**Rollback**: N/A (read-only metrics)

---

### Phase 1: State Management Migration

#### 1.1 Store-Centric State
**Migration Type**: Code-only (no DB changes)
**Risk Level**: Medium

**Steps**:
1. Deploy new `regionStore.ts` (behind feature flag)
2. Deploy updated `useRegionLayout.ts` (behind feature flag)
3. Enable for 10% of users (canary)
4. Monitor error rates and performance
5. Gradually increase to 100%

**Rollback**: 
- Disable `DASHBOARD_NEW_STATE_MANAGEMENT` feature flag
- System reverts to old hooks automatically

**Validation**:
- No duplicate regions
- No missing regions
- Operations work correctly
- Performance equal or better

#### 1.2 Undo/Redo Enhancement
**Migration Type**: Code-only
**Risk Level**: Low

**Steps**:
1. Deploy new undo/redo implementation
2. Test with existing layouts
3. Verify history works correctly

**Rollback**: Revert to previous undo/redo implementation

#### 1.3 Shared Validation
**Migration Type**: Code + Schema alignment
**Risk Level**: Low

**Steps**:
1. Create shared validation package
2. Update frontend to use shared schemas
3. Update backend DTOs to match
4. Test validation on both sides

**Rollback**: Revert to previous validation logic

---

### Phase 2: Data Layer Migration

#### 2.1 Repository Pattern
**Migration Type**: Code-only (refactoring)
**Risk Level**: Low

**Steps**:
1. Create `region.repository.ts`
2. Refactor `dashboard.service.ts` to use repository
3. Test all operations
4. Deploy behind feature flag

**Rollback**: Revert service to direct Supabase calls

#### 2.2 Optimistic Locking
**Migration Type**: Schema + Code
**Risk Level**: Medium

**Prerequisites**: 
- `version` column already exists in `dashboard_regions`
- All existing regions have `version = 1`

**Migration Script**:
```sql
-- Ensure all regions have version
UPDATE dashboard_regions 
SET version = 1 
WHERE version IS NULL AND deleted_at IS NULL;

-- Add index for version checks
CREATE INDEX IF NOT EXISTS idx_regions_version 
ON dashboard_regions(id, version) 
WHERE deleted_at IS NULL;
```

**Steps**:
1. Run migration script (idempotent)
2. Deploy backend with version checking
3. Deploy frontend with version sending
4. Test concurrent edits

**Rollback**:
- Remove version checks from code
- Version column remains (harmless)

#### 2.3 Audit Logging
**Migration Type**: Schema + Code
**Risk Level**: Low

**Migration Script**: `backend/prisma/migrations/create_dashboard_events_table.sql`

**Steps**:
1. Run migration script (creates `dashboard_audit_log` table)
2. Deploy audit logging service
3. Enable audit logging (behind feature flag)
4. Verify events are logged

**Rollback**:
- Disable audit logging feature flag
- Table remains (can be cleaned up later)

---

### Phase 3: Security Migration

#### 3.1 RLS Enhancement
**Migration Type**: Schema (RLS policies)
**Risk Level**: High (can break access)

**Migration Script**: `backend/prisma/migrations/enhance_dashboard_regions_rls_security.sql`

**Prerequisites**:
- Test RLS policies in staging
- Verify all users can access their data
- Test cross-tenant isolation

**Steps**:
1. Run RLS enhancement script (idempotent with DROP IF EXISTS)
2. Test with multiple tenants
3. Verify performance (RLS can slow queries)
4. Monitor for access issues

**Rollback**:
```sql
-- Disable RLS (emergency only)
ALTER TABLE dashboard_regions DISABLE ROW LEVEL SECURITY;
-- Then fix policies and re-enable
```

**Validation**:
- Users can access their own regions
- Users cannot access other tenants' regions
- Shared regions work via ACLs
- Performance acceptable

#### 3.2 Validation Enforcement
**Migration Type**: Code-only
**Risk Level**: Medium

**Steps**:
1. Deploy stricter validation
2. Monitor for validation errors
3. Adjust validation rules if needed

**Rollback**: Revert to previous validation

---

### Phase 4: Performance Migration

#### 4.1 Virtualization
**Migration Type**: Code-only
**Risk Level**: Low

**Steps**:
1. Deploy virtualization (behind feature flag)
2. Enable for layouts with > 50 regions
3. Monitor performance
4. Gradually enable for smaller layouts

**Rollback**: Disable virtualization feature flag

#### 4.2 Caching
**Migration Type**: Code-only
**Risk Level**: Low

**Steps**:
1. Enable caching (already implemented)
2. Monitor cache hit rates
3. Adjust TTLs if needed

**Rollback**: Disable caching via feature flag

---

## Data Migration Scripts

### Script: Normalize Existing Regions

**File**: `backend/normalize-regions-migration.sql`

```sql
-- Normalize grid positions (ensure 0-11 for columns)
UPDATE dashboard_regions
SET grid_col = LEAST(grid_col, 11)
WHERE grid_col >= 12 AND deleted_at IS NULL;

-- Fix regions that exceed grid bounds
UPDATE dashboard_regions
SET col_span = 12 - grid_col
WHERE grid_col + col_span > 12 AND deleted_at IS NULL;

-- Ensure minimum spans
UPDATE dashboard_regions
SET row_span = GREATEST(row_span, 1),
    col_span = GREATEST(col_span, 1)
WHERE (row_span < 1 OR col_span < 1) AND deleted_at IS NULL;

-- Set version for all regions
UPDATE dashboard_regions
SET version = 1
WHERE version IS NULL AND deleted_at IS NULL;
```

**Idempotency**: Yes (uses UPDATE with WHERE clauses)
**Rollback**: N/A (only fixes invalid data)

### Script: Fix Overlapping Regions

**File**: `backend/fix-overlapping-regions.sql`

```sql
-- This is a complex migration that requires manual review
-- Identify overlapping regions
WITH overlaps AS (
  SELECT 
    r1.id as region1_id,
    r1.layout_id,
    r1.grid_row as r1_row,
    r1.grid_col as r1_col,
    r2.id as region2_id,
    r2.grid_row as r2_row,
    r2.grid_col as r2_col
  FROM dashboard_regions r1
  JOIN dashboard_regions r2 ON 
    r1.layout_id = r2.layout_id 
    AND r1.id != r2.id
    AND r1.deleted_at IS NULL
    AND r2.deleted_at IS NULL
  WHERE 
    r1.grid_col < (r2.grid_col + r2.col_span) AND
    (r1.grid_col + r1.col_span) > r2.grid_col AND
    r1.grid_row < (r2.grid_row + r2.row_span) AND
    (r1.grid_row + r1.row_span) > r2.grid_row
)
-- Manual review required - don't auto-fix overlaps
SELECT * FROM overlaps;
```

**Note**: Overlaps require manual resolution - cannot auto-fix without data loss risk

## Migration Execution Plan

### Pre-Migration (1 week before)

1. **Data Audit** (Day 1)
   - Run `audit-dashboard-data.sql`
   - Document all issues
   - Create fix plan

2. **Fix Data Issues** (Day 2-3)
   - Run normalization scripts
   - Fix overlaps manually
   - Verify fixes

3. **Test Migration** (Day 4-5)
   - Run all migration scripts on production copy
   - Test rollback procedures
   - Document any issues

### Migration Day

1. **Backup** (T-1 hour)
   - Full database backup
   - Verify backup integrity

2. **Maintenance Window** (if needed)
   - Announce to users
   - Set maintenance mode

3. **Run Migrations** (T-0)
   - Run scripts in order
   - Verify each step
   - Monitor for errors

4. **Validation** (T+15 min)
   - Run audit script
   - Verify data integrity
   - Test critical paths

5. **Enable Features** (T+30 min)
   - Enable feature flags gradually
   - Monitor error rates
   - Verify functionality

### Post-Migration (1 week after)

1. **Monitoring** (Daily)
   - Check error rates
   - Monitor performance
   - Review user feedback

2. **Validation** (Day 3)
   - Run full audit again
   - Compare with pre-migration
   - Document any issues

3. **Optimization** (Day 5-7)
   - Tune performance
   - Fix any issues
   - Update documentation

## Rollback Procedures

See `ROLLBACK_FRAMEWORK.md` for detailed rollback procedures for each phase.

## Success Criteria

Migration is considered successful when:

- [ ] All data integrity checks pass
- [ ] Error rate < 0.1%
- [ ] Performance equal or better than baseline
- [ ] All features work correctly
- [ ] No user-reported issues
- [ ] Metrics show improvement

## Communication Plan

### Pre-Migration
- Email users 1 week before (if maintenance window needed)
- In-app banner 3 days before
- Update status page

### During Migration
- Status page updates
- Real-time progress (if possible)
- Support team on standby

### Post-Migration
- Success announcement
- Feature highlights
- Feedback collection

## Risk Mitigation

### High-Risk Migrations

1. **RLS Enhancement**
   - Test thoroughly in staging
   - Have rollback script ready
   - Monitor access logs closely

2. **State Management**
   - Gradual rollout (10% → 50% → 100%)
   - Feature flag for instant disable
   - Monitor for state corruption

3. **Data Normalization**
   - Run on production copy first
   - Verify no data loss
   - Keep backup for 30 days

### Low-Risk Migrations

1. **Metrics Collection** (read-only)
2. **Feature Flags** (can be disabled)
3. **Code Refactoring** (no DB changes)

## Migration Checklist Template

For each migration:

- [ ] Backup created and verified
- [ ] Migration script tested on copy
- [ ] Rollback procedure tested
- [ ] Feature flag configured
- [ ] Monitoring enabled
- [ ] Support team notified
- [ ] Users notified (if needed)
- [ ] Maintenance window scheduled (if needed)
- [ ] Success criteria defined
- [ ] Post-migration validation planned



