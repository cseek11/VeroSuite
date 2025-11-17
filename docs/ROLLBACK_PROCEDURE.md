# Migration Rollback Procedure

**Purpose:** Emergency rollback procedure if VeroAI restructuring migration fails or causes critical issues.

**Last Updated:** 2025-11-15

---

## Quick Rollback (If Migration Not Committed)

Use this if migration is in progress and you need to abort before committing.

```bash
# Discard all changes
git checkout main
git branch -D feature/veroai-restructure

# Restore services
docker-compose down
docker-compose up -d

# Verify system is operational
npm test
npm run dev
```

---

## Partial Rollback (If Migration Partially Committed)

Use this if migration is partially complete but causing issues.

```bash
# Create rollback branch
git checkout -b rollback/migration-fix

# Revert specific commits
git revert <commit-hash>

# Restore directory structure
git checkout main -- backend/
rm -rf apps/ libs/ services/

# Restore services
docker-compose down
docker-compose up -d

# Verify
npm test
npm run dev
```

---

## Full Rollback (If Migration Fully Committed)

Use this if migration is complete but needs to be reverted.

```bash
# Find pre-migration commit
git log --oneline | grep "before restructure"

# Revert to pre-migration state
git checkout main
git reset --hard <pre-migration-commit>

# Restore directory structure
git checkout main -- backend/
rm -rf apps/ libs/ services/

# Restore services
docker-compose down
docker-compose up -d

# Verify
npm test
npm run dev
```

---

## Verification Steps

After rollback, verify:

1. **Code Structure**
   ```bash
   # Verify backend directory exists
   ls -la backend/
   
   # Verify no apps/ or libs/ directories
   ls -la | grep -E "apps|libs"
   ```

2. **Services Running**
   ```bash
   # Check Docker containers
   docker-compose ps
   
   # Check API health
   curl http://localhost:3000/api/health
   ```

3. **Tests Passing**
   ```bash
   # Run all tests
   npm test
   
   # Check test coverage
   npm run test:coverage
   ```

4. **Application Working**
   ```bash
   # Start development servers
   npm run dev
   
   # Verify frontend loads
   curl http://localhost:5173
   ```

---

## Prevention

To avoid needing rollback:

1. ✅ Complete Phase 0 (Pre-Migration Preparation) thoroughly
2. ✅ Run validation script after each phase
3. ✅ Test incrementally, don't wait until end
4. ✅ Keep old structure until new structure validated
5. ✅ Use feature branch for isolation

---

## Emergency Contacts

If rollback doesn't work:

1. **Check Git History**: `git reflog` to find previous state
2. **Check Docker**: `docker-compose logs` for service errors
3. **Check Database**: Verify Prisma migrations are intact
4. **Contact**: Development Team Lead

---

**Last Updated:** 2025-11-15  
**Status:** Active Procedure

