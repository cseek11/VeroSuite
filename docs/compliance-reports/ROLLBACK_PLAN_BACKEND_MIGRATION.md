# Rollback Plan: backend/ → apps/api/ Migration

**Date:** 2025-11-22  
**Purpose:** Rollback procedure if migration fails  
**Status:** Ready

---

## Rollback Scenarios

### Scenario 1: Complete Rollback (Migration Failed)

**When to use:** Migration completely failed, need to restore original state.

**Steps:**
1. **Restore from backup:**
   ```bash
   # If using git branch
   git checkout main
   git branch -D migration-branch
   
   # If using backup directory
   cp -r backup/backend backend/
   ```

2. **Verify restoration:**
   ```bash
   # Check files exist
   ls backend/src
   ls backend/prisma
   
   # Run tests
   cd backend && npm test
   ```

3. **Cleanup:**
   ```bash
   # Remove new structure if needed
   rm -rf apps/api
   rm -rf libs/common
   ```

---

### Scenario 2: Partial Rollback (Keep Structure, Fix Issues)

**When to use:** New structure is good, but imports/builds are broken.

**Steps:**
1. **Revert import changes:**
   ```bash
   # Revert import path updates
   git checkout HEAD -- apps/api/src
   ```

2. **Fix incrementally:**
   - Fix imports one module at a time
   - Test after each fix
   - Commit working state

3. **Keep new structure:**
   - Don't revert directory structure
   - Fix issues in place

---

### Scenario 3: Rollback Specific Files

**When to use:** Only specific files have issues.

**Steps:**
1. **Identify problematic files:**
   ```bash
   # Find files with errors
   npm run build 2>&1 | grep "error"
   ```

2. **Restore specific files:**
   ```bash
   # Restore from backup
   cp backup/backend/src/problematic-file.ts apps/api/src/problematic-file.ts
   ```

3. **Fix and retry:**
   - Fix issues in restored file
   - Test
   - Continue migration

---

## Pre-Migration Backup

### Create Backup Before Migration:

```bash
# Create backup branch
git checkout -b backup-before-migration
git add .
git commit -m "Backup before backend migration"

# Or create backup directory
cp -r backend backup/backend-$(date +%Y%m%d)
```

### Verify Backup:

```bash
# Check backup exists
ls backup/

# Verify backup integrity
diff -r backend backup/backend-YYYYMMDD
```

---

## Rollback Checklist

### Before Rollback:
- [ ] Identify what failed
- [ ] Determine rollback scope (full/partial/specific)
- [ ] Verify backup exists
- [ ] Notify team

### During Rollback:
- [ ] Stop any running services
- [ ] Execute rollback steps
- [ ] Verify files restored
- [ ] Run tests
- [ ] Check build works

### After Rollback:
- [ ] Document what went wrong
- [ ] Update migration plan
- [ ] Fix issues before retry
- [ ] Schedule retry

---

## Quick Rollback Commands

### Full Rollback (Git):
```bash
git checkout main
git branch -D migration-branch
```

### Partial Rollback (Specific Directory):
```bash
git checkout HEAD -- apps/api/src/problematic-module
```

### Restore from Backup Directory:
```bash
cp -r backup/backend-YYYYMMDD/* backend/
```

---

## Post-Rollback Actions

1. **Document Issues:**
   - What failed?
   - Why did it fail?
   - What needs to be fixed?

2. **Update Migration Plan:**
   - Add fixes to plan
   - Update scripts if needed
   - Improve error handling

3. **Retry Strategy:**
   - Fix identified issues
   - Test fixes
   - Retry migration

---

## Prevention

### To Minimize Rollback Need:

1. **Test Thoroughly:**
   - Run all tests before migration
   - Test on feature branch
   - Verify CI/CD passes

2. **Incremental Migration:**
   - Migrate one module at a time
   - Test after each module
   - Commit working state

3. **Backup Everything:**
   - Create backup branch
   - Create backup directory
   - Verify backup integrity

---

**Last Updated:** 2025-11-22  
**Status:** Ready for use  
**Next:** Execute migration with backup in place





