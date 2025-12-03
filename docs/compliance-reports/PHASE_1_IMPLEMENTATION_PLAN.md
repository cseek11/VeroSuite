# Phase 1: Critical Fixes - Implementation Plan

**Date:** 2025-11-22  
**Phase:** Phase 1 - CRITICAL FIXES (Week 1)  
**Status:** 🟡 IN PROGRESS

---

## Overview

Phase 1 addresses the most critical violations identified in the comprehensive audit:
1. Secrets management (Day 1-2)
2. Monorepo structure creation (Day 3-5)
3. Migration planning (Day 6-7)

---

## Day 1-2: Remove Secrets from Git and Rotate Credentials

### Current Status
- ✅ `.env` file is NOT tracked in git (verified via `git ls-files`)
- ✅ `.gitignore` properly excludes `.env` files
- ⚠️ `.env` file exists locally with production secrets
- ⚠️ Secrets may exist in git history (needs audit)

### Tasks

#### 1.1 Verify Git History for Secrets
- [ ] Audit git history for any committed `.env` files
- [ ] Check for hardcoded secrets in source code
- [ ] Document findings

#### 1.2 Create Secrets Rotation Guide
- [ ] Document rotation procedure for each secret type
- [ ] Create checklist for secret rotation
- [ ] Provide commands for generating new secrets

#### 1.3 Rotate Exposed Secrets
**Priority Order:**
1. **Supabase Service Role Key** (highest risk)
2. **JWT Secret** (authentication)
3. **Database Password** (data access)
4. **Encryption Key** (data encryption)
5. **Stripe Keys** (if production keys exposed)

#### 1.4 Update Documentation
- [ ] Update `docs/SECURITY_SETUP_GUIDE.md` with rotation procedures
- [ ] Create `docs/SECRET_ROTATION_GUIDE.md`
- [ ] Update `backend/env.example` to ensure no real values

---

## Day 3-5: Create Monorepo Structure

### Required Structure (Per Rules)

```
apps/
  api/              # NestJS API (primary backend)
    src/
    package.json
    tsconfig.json
    ...
  
  crm-ai/           # CRM AI service (future)
    src/
  
  ai-soc/           # SOC/alerting AI (future)
    src/
  
  feature-ingestion/  # ingestion/ETL (future)
    src/
  
  kpi-gate/         # metrics & KPIs (future)
    src/

libs/
  common/
    prisma/
      schema.prisma  # Single DB schema source of truth
      migrations/
    src/             # Shared types, auth helpers, domain utilities
      auth/
      types/
      utils/
    package.json
    tsconfig.json
```

### Tasks

#### 2.1 Create Directory Structure
- [ ] Create `apps/` directory
- [ ] Create `apps/api/` directory
- [ ] Create `libs/` directory
- [ ] Create `libs/common/` directory
- [ ] Create `libs/common/prisma/` directory
- [ ] Create `libs/common/src/` directory

#### 2.2 Create Package.json Files
- [ ] Create `apps/api/package.json` (copy from `backend/package.json`)
- [ ] Create `libs/common/package.json` (new shared library)
- [ ] Update root `package.json` for monorepo workspace

#### 2.3 Create TypeScript Configurations
- [ ] Create `apps/api/tsconfig.json` (copy from `backend/tsconfig.json`)
- [ ] Create `libs/common/tsconfig.json` (new shared library config)
- [ ] Update path mappings for `@verofield/common/*`

#### 2.4 Create README Files
- [ ] Create `apps/README.md` (monorepo apps documentation)
- [ ] Create `libs/README.md` (shared libraries documentation)
- [ ] Create `libs/common/README.md` (common library documentation)

---

## Day 6-7: Begin Migration Planning

### Tasks

#### 3.1 Create Migration Plan Document
- [ ] Document migration strategy
- [ ] Identify all files to migrate
- [ ] Create file mapping (old → new paths)
- [ ] Estimate effort and timeline

#### 3.2 Create Migration Scripts
- [ ] Script to move `backend/src/` → `apps/api/src/`
- [ ] Script to move `backend/prisma/` → `libs/common/prisma/`
- [ ] Script to update imports (124+ files)
- [ ] Script to update build configurations

#### 3.3 Create Rollback Plan
- [ ] Document rollback procedure
- [ ] Create rollback scripts
- [ ] Test rollback procedure

#### 3.4 Update CI/CD Workflows
- [ ] Identify workflows that reference `backend/`
- [ ] Plan workflow updates for new structure
- [ ] Document workflow migration steps

---

## Success Criteria

### Day 1-2 Complete When:
- ✅ Secrets rotation guide created
- ✅ All exposed secrets rotated
- ✅ Git history audited for secrets
- ✅ Documentation updated

### Day 3-5 Complete When:
- ✅ `apps/` directory structure created
- ✅ `libs/` directory structure created
- ✅ Package.json files created
- ✅ TypeScript configurations created
- ✅ README files created

### Day 6-7 Complete When:
- ✅ Migration plan document created
- ✅ Migration scripts created
- ✅ Rollback plan created
- ✅ CI/CD workflow updates planned

---

## Risk Mitigation

### Risks:
1. **Breaking existing builds** - Mitigation: Create structure alongside existing, migrate gradually
2. **Import path errors** - Mitigation: Update TypeScript path mappings first
3. **CI/CD failures** - Mitigation: Update workflows before migration
4. **Secret rotation downtime** - Mitigation: Coordinate rotation during maintenance window

---

## Next Steps After Phase 1

- Phase 2: Begin actual migration (Week 2-3)
- Phase 3: Fix medium priority violations (Week 4-5)
- Phase 4: Cleanup and final audit (Week 6+)

---

**Last Updated:** 2025-11-22  
**Status:** 🟡 IN PROGRESS









