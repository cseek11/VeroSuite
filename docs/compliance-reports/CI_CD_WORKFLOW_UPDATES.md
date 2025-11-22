# CI/CD Workflow Updates for Monorepo Migration

**Date:** 2025-11-22  
**Purpose:** Document CI/CD workflow updates required for monorepo migration  
**Status:** 🟡 PENDING

---

## Overview

After migrating `backend/` → `apps/api/`, all CI/CD workflows must be updated to reference the new paths.

---

## Workflows to Update

### 1. Build Workflows

**Current Paths:**
```yaml
- name: Build Backend
  run: |
    cd backend
    npm install
    npm run build
```

**New Paths:**
```yaml
- name: Build API
  run: |
    cd apps/api
    npm install
    npm run build
```

### 2. Test Workflows

**Current Paths:**
```yaml
- name: Test Backend
  run: |
    cd backend
    npm test
```

**New Paths:**
```yaml
- name: Test API
  run: |
    cd apps/api
    npm test
```

### 3. Database Migration Workflows

**Current Paths:**
```yaml
- name: Run Migrations
  run: |
    cd backend
    npx prisma migrate deploy
```

**New Paths:**
```yaml
- name: Run Migrations
  run: |
    cd libs/common
    npx prisma migrate deploy --schema=./prisma/schema.prisma
```

### 4. Prisma Generate Workflows

**Current Paths:**
```yaml
- name: Generate Prisma Client
  run: |
    cd backend
    npx prisma generate
```

**New Paths:**
```yaml
- name: Generate Prisma Client
  run: |
    cd libs/common
    npx prisma generate --schema=./prisma/schema.prisma
```

---

## Common Patterns to Update

### Pattern 1: Directory References

**Find:**
```yaml
backend/
```

**Replace:**
```yaml
apps/api/
```

### Pattern 2: Prisma References

**Find:**
```yaml
backend/prisma
```

**Replace:**
```yaml
libs/common/prisma
```

### Pattern 3: Working Directory

**Find:**
```yaml
working-directory: backend
```

**Replace:**
```yaml
working-directory: apps/api
```

---

## Workflow File Locations

### Expected Locations:
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`
- `.github/workflows/test.yml`
- `.github/workflows/build.yml`

**Note:** Actual files may vary. Check `.github/workflows/` directory.

---

## Update Checklist

### For Each Workflow File:

- [ ] Update `backend/` → `apps/api/`
- [ ] Update `backend/prisma/` → `libs/common/prisma/`
- [ ] Update working directories
- [ ] Update Prisma commands with `--schema` flag
- [ ] Update build paths
- [ ] Update test paths
- [ ] Verify workflow syntax
- [ ] Test workflow on branch

---

## Example Updated Workflow

### Before:
```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: |
          cd backend
          npm install
      - name: Build
        run: |
          cd backend
          npm run build
      - name: Test
        run: |
          cd backend
          npm test
```

### After:
```yaml
name: CI

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: |
          npm install
          cd apps/api && npm install
          cd ../../libs/common && npm install
      - name: Generate Prisma Client
        run: |
          cd libs/common
          npx prisma generate --schema=./prisma/schema.prisma
      - name: Build
        run: |
          cd apps/api
          npm run build
      - name: Test
        run: |
          cd apps/api
          npm test
```

---

## Verification Steps

### After Updating Workflows:

1. **Check Syntax:**
   ```bash
   # Validate YAML syntax
   yamllint .github/workflows/*.yml
   ```

2. **Test on Branch:**
   - Push to feature branch
   - Verify workflow runs
   - Check all steps pass

3. **Verify Paths:**
   - Check all paths are correct
   - Verify Prisma commands work
   - Confirm build succeeds

---

## Migration Order

### Recommended Order:

1. **Update workflows first** (before migration)
   - Update paths in workflow files
   - Test on feature branch
   - Verify workflows work

2. **Then execute migration**
   - Run migration scripts
   - Update imports
   - Test locally

3. **Final verification**
   - Push to branch
   - Verify CI/CD passes
   - Merge when ready

---

## Troubleshooting

### Common Issues:

1. **Path Not Found:**
   - Verify new paths exist
   - Check working directory
   - Update relative paths

2. **Prisma Errors:**
   - Add `--schema` flag
   - Update schema path
   - Verify Prisma is installed

3. **Build Failures:**
   - Check TypeScript paths
   - Verify imports resolve
   - Update tsconfig.json

---

**Last Updated:** 2025-11-22  
**Status:** 🟡 PENDING - Update workflows before migration  
**Next:** Identify and update all workflow files

