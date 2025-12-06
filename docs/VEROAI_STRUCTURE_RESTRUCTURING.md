# VeroAI Project Structure Restructuring Plan

**Status:** Required Before VeroAI Implementation  
**Priority:** High - Foundation for VeroAI  
**Last Updated:** 2025-12-05

---

## Executive Summary

The current VeroField project structure is **monolithic** and needs restructuring to support VeroAI's **microservices architecture**. This document outlines the required structural changes to enable:

- Multiple microservices (AI CodeGen, AI SOC, Feature Ingestion, KPI Gate)
- Shared libraries (Kafka, common utilities)
- External services (Flink, Feast, OPA)
- Kubernetes deployments
- Monorepo organization

---

## Current Structure Analysis

### Current State
```
VeroField/
├── backend/              # Monolithic NestJS app
│   └── src/
│       ├── accounts/
│       ├── agreements/
│       ├── auth/
│       ├── common/       # Shared services (but not as libraries)
│       └── ...
├── frontend/            # React app
├── VeroFieldMobile/     # React Native app
├── deploy/              # Basic deployment files
└── docs/                # Documentation
```

### Issues with Current Structure
1. ❌ **No microservices support** - All code in single `backend/src/`
2. ❌ **No shared libraries** - Common code duplicated or tightly coupled
3. ❌ **No external services directory** - Flink, Feast, OPA have no place
4. ❌ **Limited deployment structure** - Basic Docker Compose only
5. ❌ **No monorepo organization** - Can't manage multiple apps efficiently

---

## Required Structure for VeroAI

### Target Structure
```
VeroField/
├── apps/                          # ⭐ NEW: Microservices
│   ├── api/                       # Main API (current backend)
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── crm-ai/                    # ⭐ NEW: AI CodeGen microservice
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── ai.module.ts
│   │   │   ├── services/
│   │   │   └── controllers/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── ai-soc/                    # ⭐ NEW: AI Security Operations Center
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── feature-ingestion/         # ⭐ NEW: Feature store ingestion
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   └── kpi-gate/                  # ⭐ NEW: KPI evaluation service
│       ├── src/
│       ├── package.json
│       └── Dockerfile
│
├── libs/                          # ⭐ NEW: Shared libraries
│   └── common/                    # Shared common code
│       ├── src/
│       │   ├── kafka/             # Kafka producer/consumer
│       │   │   ├── kafka-producer.service.ts
│       │   │   ├── kafka-consumer.service.ts
│       │   │   └── kafka.module.ts
│       │   ├── interceptors/      # Telemetry interceptor
│       │   │   └── telemetry.interceptor.ts
│       │   ├── prisma/            # Prisma service (shared)
│       │   ├── cache/             # Redis cache (shared)
│       │   └── ...
│       ├── package.json
│       └── tsconfig.json
│
├── services/                      # ⭐ NEW: External services
│   ├── flink-jobs/                # Flink stream processing
│   │   ├── src/
│   │   │   └── main/java/         # or Python
│   │   ├── Dockerfile
│   │   └── pom.xml                # or requirements.txt
│   ├── feast/                     # Feast feature store
│   │   ├── feature_store.yaml
│   │   ├── features.py
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   └── opa/                       # Open Policy Agent
│       ├── policies/
│       │   └── auto_approve.rego
│       └── Dockerfile
│
├── frontend/                      # Existing React app
│   └── src/
│
├── VeroFieldMobile/               # Existing React Native app
│   └── src/
│
├── deploy/                        # ⭐ ENHANCED: Infrastructure as Code
│   ├── docker-compose.yml         # Main compose (existing)
│   ├── docker-compose.kafka.yml  # ⭐ NEW: Kafka infrastructure
│   ├── docker-compose.flink.yml   # ⭐ NEW: Flink infrastructure
│   ├── docker-compose.opa.yml     # ⭐ NEW: OPA infrastructure
│   ├── k8s/                       # ⭐ NEW: Kubernetes manifests
│   │   ├── rollouts/              # Argo Rollouts
│   │   │   ├── crm-ai-rollout.yaml
│   │   │   └── analysis-templates.yaml
│   │   ├── istio/                 # Istio service mesh
│   │   │   └── crm-ai-virtualservice.yaml
│   │   ├── ai-soc/                # AI SOC deployment
│   │   │   └── deployment.yaml
│   │   └── production/            # Production configs
│   │       └── hpa.yaml
│   └── monitoring/                # ⭐ NEW: Monitoring configs
│       ├── prometheus/
│       │   └── alerts/
│       ├── grafana/
│       │   └── dashboards/
│       └── alertmanager/
│           └── config.yml
│
├── docs/                          # Existing documentation
│   └── planning/
│       └── VEROAI_DEVELOPMENT_PLAN.md
│
├── package.json                   # ⭐ UPDATED: Root workspace config
├── tsconfig.json                  # ⭐ NEW: Root TypeScript config
├── nx.json                        # ⭐ NEW: Nx workspace (optional)
└── .gitignore
```

---

## Migration Strategy

### Phase 0: Pre-Migration Preparation (2 days) ⭐ NEW

**Objective:** Establish baseline and identify issues before migration begins.

#### Step 0.1: Audit All Imports
```bash
# Create imports audit file
find backend/src -name "*.ts" | xargs grep "from '\.\." > docs/migration/imports-audit.txt

# Analyze import patterns
cat docs/migration/imports-audit.txt | grep -o "from '[^']*'" | sort | uniq -c | sort -rn > docs/migration/import-frequency.txt
```

#### Step 0.2: Create Dependency Graph
```bash
# Install madge if not present
npm install -g madge

# Generate dependency graph
npx madge --circular --extensions ts backend/src > docs/migration/circular-dependencies.txt

# Generate visual graph
npx madge --image docs/migration/dependency-graph.svg backend/src
```

#### Step 0.3: Identify Circular Dependencies
- Review `docs/migration/circular-dependencies.txt`
- Fix circular dependencies before migration
- Document fixes in `docs/migration/circular-fixes.md`

#### Step 0.4: Establish Test Baseline
```bash
# Run full test suite with coverage
npm test -- --coverage

# Save baseline report
cp coverage/coverage-summary.json docs/migration/test-baseline.json

# Document current test status
echo "Baseline: $(npm test 2>&1 | grep -o '[0-9]* tests')" > docs/migration/test-baseline.txt
```

#### Step 0.5: Create Migration Branch
```bash
# Create feature branch
git checkout -b feature/veroai-restructure

# Create migration tracking directory
mkdir -p docs/migration
mkdir -p scripts/migration
```

**Deliverables:**
- ✅ Import audit report
- ✅ Dependency graph
- ✅ Circular dependency fixes
- ✅ Test baseline
- ✅ Migration branch created

---

### Phase 1: Create New Directory Structure (Week 1)

#### Step 1.1: Create New Directories
```bash
# Create microservices directories
mkdir -p apps/api
mkdir -p apps/crm-ai/src
mkdir -p apps/ai-soc/src
mkdir -p apps/feature-ingestion/src
mkdir -p apps/kpi-gate/src

# Create shared libraries
mkdir -p libs/common/src/kafka
mkdir -p libs/common/src/interceptors
mkdir -p libs/common/src/prisma
mkdir -p libs/common/src/cache

# Create external services
mkdir -p services/flink-jobs/src
mkdir -p services/feast
mkdir -p services/opa/policies

# Create enhanced deployment structure
mkdir -p deploy/k8s/rollouts
mkdir -p deploy/k8s/istio
mkdir -p deploy/k8s/ai-soc
mkdir -p deploy/k8s/production
mkdir -p deploy/monitoring/prometheus/alerts
mkdir -p deploy/monitoring/grafana/dashboards
mkdir -p deploy/monitoring/alertmanager
```

#### Step 1.2: Move Existing Backend to apps/api
```bash
# Move current backend to apps/api
mv backend/* apps/api/
rmdir backend

# Update paths in apps/api
# - Update imports
# - Update package.json paths
# - Update tsconfig.json paths
```

#### Step 1.3: Resolve Prisma Schema Location ⭐ CRITICAL
**Decision:** Prisma schema lives in `libs/common/prisma/` since all services share the same database.

```bash
# Move Prisma to shared location
mkdir -p libs/common/prisma
mv apps/api/prisma/* libs/common/prisma/

# Update Prisma config in libs/common/prisma/schema.prisma
# Update all Prisma imports to use @verofield/common/prisma
```

**Rationale:** All services share the same database, so schema is "common" infrastructure.

#### Step 1.4: Extract Common Code to libs/common
```bash
# Move shared services to libs/common
mv apps/api/src/common/services/* libs/common/src/
mv apps/api/src/common/interceptors/* libs/common/src/interceptors/
mv apps/api/src/common/middleware/* libs/common/src/middleware/

# Keep common module in apps/api but import from libs/common
```

---

### Phase 2: Setup Monorepo Tooling (Week 1-2)

#### Option A: NPM Workspaces (⭐ RECOMMENDED - Selected)

**Rationale:**
- ✅ Simpler learning curve for team
- ✅ Native to npm (no additional tooling)
- ✅ Sufficient for current needs (4-5 microservices)
- ✅ Can migrate to Nx later if needed (20+ services)
**File: `package.json` (root)**
```json
{
  "name": "verofield-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "libs/*",
    "frontend",
    "VeroFieldMobile"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=apps/api & npm run dev --workspace=frontend",
    "dev:api": "npm run dev --workspace=apps/api",
    "dev:frontend": "npm run dev --workspace=frontend",
    "dev:crm-ai": "npm run dev --workspace=apps/crm-ai",
    "dev:ai-soc": "npm run dev --workspace=apps/ai-soc",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces"
  }
}
```

#### Option B: Nx (Recommended for advanced features)
**File: `nx.json`**
```json
{
  "version": 2,
  "projects": {
    "api": "apps/api",
    "crm-ai": "apps/crm-ai",
    "ai-soc": "apps/ai-soc",
    "feature-ingestion": "apps/feature-ingestion",
    "kpi-gate": "apps/kpi-gate",
    "common": "libs/common",
    "frontend": "frontend",
    "mobile": "VeroFieldMobile"
  }
}
```

---

### Phase 3: Update Package Configurations (Week 2)

#### Step 3.1: Update apps/api/package.json
```json
{
  "name": "@verofield/api",
  "version": "1.0.0",
  "dependencies": {
    "@verofield/common": "*",  // ⭐ Reference shared library
    "@nestjs/common": "^10.0.0",
    // ... other dependencies
  }
}
```

#### Step 3.2: Create libs/common/package.json
```json
{
  "name": "@verofield/common",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    "./kafka": "./dist/kafka/index.js",
    "./interceptors": "./dist/interceptors/index.js",
    "./prisma": "./dist/prisma/index.js"
  }
}
```

#### Step 3.3: Create apps/crm-ai/package.json
```json
{
  "name": "@verofield/crm-ai",
  "version": "1.0.0",
  "dependencies": {
    "@verofield/common": "*",
    "@nestjs/common": "^10.0.0",
    "@anthropic-ai/sdk": "^0.20.0"
  }
}
```

---

### Phase 4: Update TypeScript Configuration (Week 2)

#### Step 4.1: Create Root tsconfig.json
**File: `tsconfig.json` (root)**
```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "commonjs",
    "lib": ["ES2021"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": ".",
    "composite": true,
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@verofield/common/*": ["libs/common/src/*"],
      "@verofield/api/*": ["apps/api/src/*"],
      "@verofield/crm-ai/*": ["apps/crm-ai/src/*"]
    }
  },
  "references": [
    { "path": "./libs/common" },
    { "path": "./apps/api" },
    { "path": "./apps/crm-ai" }
  ]
}
```

#### Step 4.2: Update apps/api/tsconfig.json
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./src",
    "paths": {
      "@verofield/common/*": ["../../libs/common/src/*"]
    }
  },
  "references": [
    { "path": "../../libs/common" }
  ]
}
```

---

### Phase 5: Update Import Statements (Week 2-3)

#### Step 5.1: Update apps/api imports
**Before:**
```typescript
import { PrismaService } from '../common/services/prisma.service';
import { CacheService } from '../common/services/cache.service';
```

**After:**
```typescript
import { PrismaService } from '@verofield/common/prisma';
import { CacheService } from '@verofield/common/cache';
```

#### Step 5.2: Create libs/common barrel exports
**File: `libs/common/src/index.ts`**
```typescript
// Kafka
export * from './kafka/kafka-producer.service';
export * from './kafka/kafka-consumer.service';
export * from './kafka/kafka.module';

// Interceptors
export * from './interceptors/telemetry.interceptor';

// Prisma
export * from './prisma/prisma.service';

// Cache
export * from './cache/redis-cache.service';
```

---

### Phase 7: Update Docker & Deployment (Week 3)

#### Step 7.0: Document Docker Build Context ⭐ CRITICAL
**Important:** All Docker builds must be from root context.

```bash
# ❌ WRONG - build from service directory
cd apps/api && docker build .

# ✅ CORRECT - build from root
docker build -f apps/api/Dockerfile .
```

**Add to `docs/deployment/DOCKER_BUILD_GUIDE.md`:**
```markdown
# Docker Build Context Guide

All Docker builds MUST be executed from the repository root.

## Correct Build Commands

# Build API service
docker build -f apps/api/Dockerfile -t verofield/api:latest .

# Build CRM-AI service
docker build -f apps/crm-ai/Dockerfile -t verofield/crm-ai:latest .

# Build all services
docker-compose -f deploy/docker-compose.veroai.yml build
```

#### Step 6.1: Update apps/api/Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy workspace files
COPY package*.json ./
COPY libs/common ./libs/common
COPY apps/api ./apps/api

# Install dependencies
RUN npm install

# Build
RUN npm run build --workspace=apps/api

# Run
CMD ["node", "apps/api/dist/main.js"]
```

#### Step 6.2: Create apps/crm-ai/Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
COPY libs/common ./libs/common
COPY apps/crm-ai ./apps/crm-ai

RUN npm install
RUN npm run build --workspace=apps/crm-ai

CMD ["node", "apps/crm-ai/dist/main.js"]
```

#### Step 6.3: Create Multi-Service Docker Compose
**File: `deploy/docker-compose.veroai.yml`**
```yaml
version: '3.8'

services:
  api:
    build:
      context: ..
      dockerfile: apps/api/Dockerfile
    ports:
      - "3000:3000"
  
  crm-ai:
    build:
      context: ..
      dockerfile: apps/crm-ai/Dockerfile
    ports:
      - "3001:3001"
  
  ai-soc:
    build:
      context: ..
      dockerfile: apps/ai-soc/Dockerfile
    ports:
      - "3002:3002"
  
  kafka:
    image: confluentinc/cp-kafka:7.5.0
    ports:
      - "9092:9092"
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

---

#### Step 9.1: Create Rollback Procedure ⭐ NEW
**File: `docs/ROLLBACK_PROCEDURE.md`**
```markdown
# Migration Rollback Procedure

If migration fails or causes critical issues, follow this rollback procedure.

## Quick Rollback (If Migration Not Committed)

```bash
# Discard all changes
git checkout main
git branch -D feature/veroai-restructure

# Restore services
docker-compose down
docker-compose up -d

# Verify system is operational
npm test
```

## Partial Rollback (If Migration Partially Committed)

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
```

## Full Rollback (If Migration Fully Committed)

```bash
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
```

---

## Migration Checklist

### Phase 0: Pre-Migration Preparation
- [ ] Audit all imports (`docs/migration/imports-audit.txt`)
- [ ] Create dependency graph (`docs/migration/dependency-graph.svg`)
- [ ] Identify and fix circular dependencies
- [ ] Establish test baseline (`docs/migration/test-baseline.json`)
- [ ] Create feature branch: `feature/veroai-restructure`
- [ ] Backup current codebase
- [ ] Document current import paths
- [ ] Review all dependencies

### Phase 1: Structure Creation
- [ ] Create `apps/` directory structure
- [ ] Create `libs/` directory structure
- [ ] Create `services/` directory structure
- [ ] Create enhanced `deploy/` structure
- [ ] Move `backend/` to `apps/api/`
- [ ] Move Prisma to `libs/common/prisma/` ⭐

### Phase 2: Monorepo Setup
- [ ] Choose monorepo tool (NPM Workspaces or Nx)
- [ ] Update root `package.json` with workspaces
- [ ] Create workspace package.json files
- [ ] Test workspace installation

### Phase 3: Code Extraction
- [ ] Create shared TypeScript types (`libs/common/src/types/index.ts`) ⭐
- [ ] Extract common services to `libs/common/`
- [ ] Update `libs/common/package.json`
- [ ] Create barrel exports in `libs/common/src/index.ts`
- [ ] Update TypeScript configs

### Phase 4: Environment Variables
- [ ] Setup root `.env` structure ⭐
- [ ] Create service-specific `.env.local` files ⭐
- [ ] Install and configure `dotenv-cli` ⭐
- [ ] Update package.json scripts for env loading ⭐

### Phase 5: Import Updates
- [ ] Update all imports in `apps/api/`
- [ ] Update all imports in `frontend/`
- [ ] Test compilation
- [ ] Fix import errors

### Phase 6: New Services Setup
- [ ] Create `apps/crm-ai/` structure
- [ ] Create `apps/ai-soc/` structure
- [ ] Create `apps/feature-ingestion/` structure
- [ ] Create `apps/kpi-gate/` structure
- [ ] Setup package.json for each

### Phase 6: Infrastructure
- [ ] Create Kafka Docker Compose
- [ ] Create Flink Docker Compose
- [ ] Create OPA Docker Compose
- [ ] Create Kubernetes manifests
- [ ] Create monitoring configs

### Phase 7: Testing & Validation
- [ ] Run all tests
- [ ] Test local development
- [ ] Test Docker builds
- [ ] Test workspace commands
- [ ] Verify all imports work

### Phase 9: Documentation & Rollback Plan
- [ ] Update README.md
- [ ] Update DEVELOPMENT_ROADMAP.md
- [ ] Create migration guide
- [ ] Update developer onboarding

---

## Benefits of New Structure

### 1. **Microservices Support**
- ✅ Each service can be developed independently
- ✅ Services can be deployed separately
- ✅ Easier scaling of individual services
- ✅ Clear service boundaries

### 2. **Shared Libraries**
- ✅ Code reuse across services
- ✅ Single source of truth for common code
- ✅ Versioned shared libraries
- ✅ Easier testing of shared code

### 3. **External Services**
- ✅ Clear separation of external services
- ✅ Independent deployment of Flink, Feast, OPA
- ✅ Easier maintenance
- ✅ Clear service ownership

### 4. **Infrastructure as Code**
- ✅ All infrastructure defined in code
- ✅ Version controlled deployments
- ✅ Reproducible environments
- ✅ Easy rollback

### 5. **Developer Experience**
- ✅ Clear project structure
- ✅ Easy to find code
- ✅ Better IDE support
- ✅ Faster onboarding

---

## Risks & Mitigation

### Risk 1: Breaking Existing Code
**Mitigation:**
- Use feature branch
- Incremental migration
- Comprehensive testing
- Keep old structure until migration complete

### Risk 2: Import Path Confusion
**Mitigation:**
- Use TypeScript path aliases
- Create clear barrel exports
- Document import patterns
- Use IDE refactoring tools

### Risk 3: Build Complexity
**Mitigation:**
- Use monorepo tooling (NPM Workspaces or Nx)
- Create clear build scripts
- Document build process
- Use CI/CD for validation

### Risk 4: Deployment Complexity
**Mitigation:**
- Use Docker Compose for local dev
- Use Kubernetes for production
- Document deployment process
- Create deployment scripts

---

## Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| **Phase 0: Pre-Migration Preparation** | **2 days** | **None** ⭐ NEW |
| Phase 1: Structure Creation | 2 days | Phase 0 |
| Phase 2: Monorepo Setup | 2 days | Phase 1 |
| Phase 3: Code Extraction | 3 days | Phase 2 |
| Phase 4: Environment Variables | 1 day | Phase 3 ⭐ NEW |
| Phase 5: Import Updates | 3 days | Phase 4 |
| Phase 6: New Services Setup | 2 days | Phase 5 |
| Phase 7: Infrastructure | 2 days | Phase 6 |
| Phase 8: Testing & Validation | 3 days | Phase 7 |
| Phase 9: Documentation & Rollback | 1 day | Phase 8 |
| **Total** | **21 days** | **~4 weeks** |

---

## Next Steps

1. **Review this plan** with the team
2. **Choose monorepo tool** (NPM Workspaces recommended for simplicity)
3. **Create feature branch** for restructuring
4. **Start Phase 1** - Create directory structure
5. **Incremental migration** - Don't break existing functionality
6. **Test thoroughly** at each phase
7. **Update documentation** as you go

---

## References

- **VeroAI Development Plan**: `docs/planning/VEROAI_DEVELOPMENT_PLAN.md`
- **NPM Workspaces Docs**: https://docs.npmjs.com/cli/v7/using-npm/workspaces
- **Nx Documentation**: https://nx.dev
- **NestJS Monorepo Guide**: https://docs.nestjs.com/cli/monorepo

---

**Last Updated:** 2025-12-05  
**Status:** Planning - Ready for Implementation  
**Owner:** Development Team Lead  
**Priority:** High - Required Before VeroAI Phase 0

