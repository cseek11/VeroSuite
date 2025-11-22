# CI/CD Verification Guide - Phase 2 Migration

**Date:** 2025-11-22  
**Branch:** `phase2-backend-migration`

## Quick Verification Checklist

After pushing the branch, verify the following:

### ✅ 1. Workflow Triggers
- [ ] CI workflow runs on push/PR
- [ ] Enterprise Testing workflow runs on push/PR
- [ ] Deploy Production workflow (if applicable)
- [ ] Swarm Reward Score workflow runs

### ✅ 2. Path Verification
Check that all workflows use correct paths:
- [ ] `working-directory: apps/api` (not `backend/`)
- [ ] `cache-dependency-path: apps/api/package-lock.json`
- [ ] Prisma commands use `--schema=../../libs/common/prisma/schema.prisma`
- [ ] Coverage paths: `apps/api/coverage/`

### ✅ 3. Build Steps
Verify these steps complete successfully:
- [ ] Node.js setup (version 20)
- [ ] Install dependencies (`npm ci` in `apps/api/`)
- [ ] Generate Prisma client (with correct schema path)
- [ ] Apply database schema (`prisma db push`)
- [ ] Build application (`npm run build`)
- [ ] Run tests (`npm test`)

### ✅ 4. Test Execution
- [ ] Unit tests run successfully
- [ ] Integration tests run (if configured)
- [ ] E2E tests run (if configured)
- [ ] Test coverage generated

### ✅ 5. Artifacts
- [ ] Coverage artifacts uploaded correctly
- [ ] Build artifacts created (if applicable)
- [ ] No path-related errors in artifact paths

## Detailed Workflow Verification

### CI Workflow (`.github/workflows/ci.yml`)

**Backend Job:**
```yaml
working-directory: apps/api
cache-dependency-path: apps/api/package-lock.json
prisma generate: --schema=../../libs/common/prisma/schema.prisma
prisma db push: --schema=../../libs/common/prisma/schema.prisma
coverage path: apps/api/coverage/coverage-summary.json
```

**Expected Steps:**
1. ✅ Checkout code
2. ✅ Setup Node.js 20
3. ✅ Install dependencies (`npm ci`)
4. ✅ Generate Prisma client
5. ✅ Apply database schema
6. ✅ Install PostgreSQL client
7. ✅ Apply RLS policies
8. ✅ Seed database
9. ✅ Lint backend
10. ✅ Build backend
11. ✅ Run unit tests
12. ✅ Run e2e tests
13. ✅ Upload coverage artifact

### Enterprise Testing Workflow (`.github/workflows/enterprise-testing.yml`)

**Key Paths:**
- `cd apps/api && npm ci`
- `cd apps/api && npm run lint`
- `cd apps/api && npm run typecheck`
- Coverage: `./apps/api/coverage/lcov.info`

**Expected Jobs:**
1. ✅ Pre-commit Quality Gates
2. ✅ Unit and Component Tests
3. ✅ Integration Tests
4. ✅ Security Tests
5. ✅ Performance Tests
6. ✅ E2E Tests
7. ✅ Quality Report Generation

### Deploy Production Workflow (`.github/workflows/deploy-production.yml`)

**Key Paths:**
- `working-directory: ./apps/api`
- `cache-dependency-path: apps/api/package-lock.json`
- Build output: `apps/api/dist`

**Expected Steps:**
1. ✅ Run Tests
2. ✅ Build Backend
3. ✅ Build Frontend
4. ✅ Deploy (if applicable)

### Swarm Reward Score Workflow (`.github/workflows/swarm_compute_reward_score.yml`)

**Coverage Paths:**
- `artifacts/apps/api/coverage-summary.json`
- `apps/api/coverage/coverage-summary.json`

## Common Issues to Watch For

### ❌ Path-Related Errors

**Error:** `Cannot find module` or `ENOENT: no such file or directory`
- **Cause:** Old `backend/` paths still referenced
- **Fix:** Verify all `working-directory` and paths use `apps/api/`

**Error:** `Prisma schema not found`
- **Cause:** Missing `--schema=../../libs/common/prisma/schema.prisma`
- **Fix:** Verify all Prisma commands include schema path

**Error:** `package.json not found`
- **Cause:** Working directory incorrect
- **Fix:** Verify `working-directory: apps/api` is set

### ❌ Build Errors

**Error:** TypeScript compilation errors
- **Cause:** Import paths not updated
- **Fix:** Verify all imports use `@verofield/common` or relative paths from `apps/api/`

**Error:** Prisma client not generated
- **Cause:** Schema path incorrect
- **Fix:** Verify `--schema=../../libs/common/prisma/schema.prisma`

### ❌ Test Errors

**Error:** Database connection failed
- **Cause:** DATABASE_URL not set or incorrect
- **Fix:** Verify environment variables in workflow

**Error:** Module resolution errors
- **Cause:** Workspace dependencies not installed
- **Fix:** Verify `npm ci` runs from root or workspace setup

## Verification Commands

### Local Verification (Before Push)

```bash
# Verify paths in workflows
grep -r "working-directory.*backend" .github/workflows/
# Should return no results

grep -r "apps/api" .github/workflows/
# Should return many results

# Verify Prisma paths
grep -r "prisma generate" .github/workflows/
# Should include --schema=../../libs/common/prisma/schema.prisma
```

### After Push - GitHub Actions

1. **Navigate to GitHub:**
   - Go to repository → Actions tab
   - Find the workflow run for `phase2-backend-migration`

2. **Check Workflow Status:**
   - All jobs should show ✅ (green checkmark)
   - No ❌ (red X) or ⚠️ (yellow warning)

3. **Review Job Logs:**
   - Click on each job to view logs
   - Check for any errors or warnings
   - Verify paths in log output

4. **Check Artifacts:**
   - Verify coverage artifacts are uploaded
   - Check artifact paths are correct

## Success Criteria

✅ **All workflows run successfully:**
- No failed jobs
- No path-related errors
- All steps complete

✅ **Build succeeds:**
- TypeScript compiles
- Prisma client generates
- Application builds

✅ **Tests run:**
- Unit tests pass (or pre-existing failures only)
- Coverage generated
- No new test failures

✅ **Artifacts uploaded:**
- Coverage reports available
- Build artifacts created (if applicable)

## Next Steps After Verification

1. **If workflows pass:**
   - ✅ Migration verified
   - ✅ Ready to merge to main
   - ✅ Can proceed with `backend/` cleanup

2. **If workflows fail:**
   - Review error logs
   - Fix path-related issues
   - Re-push and verify again

## Rollback Plan

If workflows fail due to migration issues:

1. **Check error logs** for specific failures
2. **Fix path issues** in workflow files
3. **Re-commit and push** fixes
4. **Re-verify** workflows

If critical issues found:
- Branch can be reverted
- See `ROLLBACK_PLAN_BACKEND_MIGRATION.md` for details

---

**Last Updated:** 2025-11-22

