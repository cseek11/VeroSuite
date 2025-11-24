# Push and Verify CI/CD - Step-by-Step Instructions

**Branch:** `phase2-backend-migration`  
**Date:** 2025-11-22

## Step 1: Push to Remote

```bash
git push origin phase2-backend-migration
```

**Expected Output:**
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Delta compression using up to X threads
Compressing objects: 100% (X/X), done.
Writing objects: 100% (X/X), X KiB | X MiB/s, done.
Total X (delta X), reused X (delta X), pack-reused X
remote: Resolving deltas: 100% (X/X), completed with X local objects.
To https://github.com/[user]/[repo].git
 * [new branch]      phase2-backend-migration -> phase2-backend-migration
```

## Step 2: Verify GitHub Actions Workflows

### 2.1 Navigate to GitHub Actions

1. Go to your GitHub repository
2. Click on the **"Actions"** tab
3. You should see workflow runs for `phase2-backend-migration`

### 2.2 Check Workflow Status

Look for these workflows:
- ✅ **CI** - Should run automatically on push
- ✅ **Enterprise Testing Pipeline** - Should run on push/PR
- ✅ **Swarm Compute Reward Score** - Should run on push/PR
- ⚠️ **Production Deployment** - Only runs on main/production branches

### 2.3 Verify Each Workflow

#### CI Workflow

**Expected Jobs:**
1. ✅ **Frontend** - Lint, Typecheck, Test & Build
2. ✅ **Backend** - Lint, Unit & E2E

**Backend Job Steps to Verify:**
- [ ] Checkout code
- [ ] Use Node.js 20
- [ ] Install dependencies (`npm ci` in `apps/api/`)
- [ ] Generate Prisma client (with `--schema=../../libs/common/prisma/schema.prisma`)
- [ ] Apply database schema
- [ ] Install PostgreSQL client
- [ ] Apply RLS policies
- [ ] Seed database
- [ ] Lint backend
- [ ] Build backend
- [ ] Run unit tests
- [ ] Run e2e tests
- [ ] Upload backend coverage artifact

**What to Look For:**
- ✅ All steps show green checkmarks
- ✅ No errors about "Cannot find module" or "ENOENT"
- ✅ No errors about "backend/" paths
- ✅ Prisma commands use correct schema path
- ✅ Coverage artifact uploaded successfully

#### Enterprise Testing Workflow

**Expected Jobs:**
1. ✅ Pre-commit Quality Gates
2. ✅ Unit and Component Tests
3. ✅ Integration Tests
4. ✅ Security Tests
5. ✅ Performance Tests
6. ✅ E2E Tests
7. ✅ Quality Report Generation

**What to Look For:**
- ✅ All jobs complete successfully
- ✅ No path-related errors
- ✅ Tests run from `apps/api/` directory
- ✅ Coverage reports generated

#### Swarm Reward Score Workflow

**What to Look For:**
- ✅ Workflow runs successfully
- ✅ Coverage found in `apps/api/coverage/`
- ✅ Reward score computed
- ✅ No errors about missing coverage files

## Step 3: Check for Path-Related Errors

### Common Errors to Watch For

#### ❌ Error: "Cannot find module"
```
Error: Cannot find module '@verofield/common'
```
**Fix:** Verify workspace dependencies are installed

#### ❌ Error: "ENOENT: no such file or directory"
```
Error: ENOENT: no such file or directory, open 'backend/package.json'
```
**Fix:** Verify all paths use `apps/api/` not `backend/`

#### ❌ Error: "Prisma schema not found"
```
Error: Could not find Prisma schema
```
**Fix:** Verify Prisma commands use `--schema=../../libs/common/prisma/schema.prisma`

#### ❌ Error: "Working directory not found"
```
Error: working-directory 'backend' does not exist
```
**Fix:** Verify `working-directory: apps/api` in workflow files

## Step 4: Verify Workflow Logs

### For Each Job:

1. **Click on the job name** to view details
2. **Expand each step** to see logs
3. **Check for:**
   - ✅ Successful completion messages
   - ❌ Error messages
   - ⚠️ Warning messages

### Key Log Messages to Verify:

**Prisma Generation:**
```
✔ Generated Prisma Client to node_modules/@prisma/client
```

**Build Success:**
```
✔ Build completed successfully
```

**Tests Running:**
```
PASS  test/unit/...
```

**Coverage Upload:**
```
Uploading artifact: backend-coverage
```

## Step 5: Verify Artifacts

1. **Scroll to bottom** of workflow run page
2. **Check "Artifacts" section:**
   - ✅ `backend-coverage` - Should be present
   - ✅ `frontend-coverage` - Should be present (if frontend job ran)
   - ✅ `quality-report` - Should be present (if enterprise testing ran)

3. **Verify artifact paths:**
   - Coverage should be from `apps/api/coverage/`
   - Not from `backend/coverage/`

## Step 6: Success Criteria

✅ **All workflows pass:**
- No failed jobs
- No cancelled jobs (unless intentional)
- All steps completed successfully

✅ **No path errors:**
- No references to `backend/` in error messages
- All paths use `apps/api/` or `libs/common/`

✅ **Build succeeds:**
- TypeScript compiles
- Prisma client generates
- Application builds

✅ **Tests run:**
- Unit tests execute (some pre-existing failures OK)
- Coverage generated
- No new test failures related to paths

✅ **Artifacts uploaded:**
- Coverage reports available
- Correct paths in artifacts

## Step 7: If Workflows Fail

### Quick Fixes:

1. **Path errors:**
   - Check workflow files for `backend/` references
   - Update to `apps/api/`
   - Commit and push again

2. **Prisma errors:**
   - Verify schema path: `--schema=../../libs/common/prisma/schema.prisma`
   - Check Prisma commands in workflows

3. **Module resolution errors:**
   - Verify workspace setup in root `package.json`
   - Check `npm ci` runs from correct directory

4. **Build errors:**
   - Check TypeScript compilation
   - Verify import paths are correct

### Re-push After Fixes:

```bash
# Make fixes
git add .
git commit -m "Fix CI/CD workflow paths"
git push origin phase2-backend-migration
```

## Step 8: Document Results

After verification, update:

- [ ] `PHASE_2_FINAL_SUMMARY.md` - Mark CI/CD as verified
- [ ] `BACKEND_CLEANUP_STATUS.md` - Update cleanup status
- [ ] Create PR description with verification results

## Quick Reference

**Workflow Files to Check:**
- `.github/workflows/ci.yml`
- `.github/workflows/enterprise-testing.yml`
- `.github/workflows/deploy-production.yml`
- `.github/workflows/swarm_compute_reward_score.yml`

**Key Paths:**
- Working directory: `apps/api`
- Prisma schema: `libs/common/prisma/schema.prisma`
- Coverage: `apps/api/coverage/`
- Build output: `apps/api/dist`

**Commands to Verify Locally:**
```bash
# Check for old backend/ references
grep -r "working-directory.*backend" .github/workflows/

# Check for apps/api paths
grep -r "apps/api" .github/workflows/

# Check Prisma schema paths
grep -r "prisma.*schema" .github/workflows/
```

---

**Last Updated:** 2025-11-22






