# Phase 1 Architecture - Final Structure

## Overview

Phase 1 implements the VeroField monorepo final directory structure. All runtime applications are now under `apps/`, shared libraries under `packages/`, and infrastructure concerns under `infrastructure/`.

## New Directory Structure

```
VeroField/ (root)
├── apps/
│   ├── api/           # Backend API (NestJS, Prisma)
│   ├── web/           # Frontend React app (moved from frontend/)
│   ├── mobile/        # Mobile app (moved from VeroSuiteMobile/)
│   └── website/       # Marketing site (moved from verofield-website/)
├── packages/
│   ├── domain/        # (Reserved) Domain layer code
│   ├── application/   # (Reserved) Application layer code
│   ├── infrastructure/# (Reserved) Infrastructure layer code
│   └── shared/        # (Reserved) Shared utilities
├── infrastructure/
│   ├── docker/        # Docker Compose (moved from deploy/)
│   ├── kubernetes/    # K8s manifests (moved from deploy/k8s/)
│   ├── terraform/     # (Reserved) Terraform configs
│   └── monitoring/    # Monitoring configs (moved from monitoring/)
├── libs/              # Legacy shared code (to be migrated to packages/)
├── services/          # External services
├── tools/             # Development tools
├── docs/              # Documentation
├── .github/           # GitHub Actions workflows
├── pnpm-workspace.yaml
├── turbo.json
└── package.json       # Root workspace config
```

## Changes Made in Phase 1

### 1. Directory Moves
- **frontend/** → **apps/web/** - Frontend React application
- **VeroSuiteMobile/** → **apps/mobile/** - React Native mobile app
- **verofield-website/** → **apps/website/** - Marketing website
- **deploy/k8s/** → **infrastructure/kubernetes/** - Kubernetes manifests
- **deploy/docker-compose.prod.yml** → **infrastructure/docker/docker-compose.prod.yml**
- **monitoring/** → **infrastructure/monitoring/** - Monitoring configuration

### 2. Configuration Files Updated

#### package.json
- Updated `workspaces` to include `packages/*`
- Script names: `dev:frontend` → `dev:web`, `build:frontend` → `build:web`, etc.
- Updated all path references from `frontend` and `backend` to `apps/web` and `apps/api`

#### GitHub Workflows
Updated paths in:
- `.github/workflows/ci.yml` - Frontend job now references `apps/web/`
- `.github/workflows/deploy-production.yml` - Frontend build paths updated
- `.github/workflows/swarm_compute_reward_score.yml` - ESLint analysis paths updated

#### Docker Compose
- `infrastructure/docker/docker-compose.prod.yml`
  - Backend context: `../../apps/api` (was `../backend`)
  - Frontend context: `../../apps/web` (was `../frontend`)

#### PowerShell Scripts
Updated paths in:
- `run-tests.ps1` - Now references `apps/api` and `apps/web`
- `run-nest-capture.ps1` - Already using `apps/api`

### 3. Monorepo Tooling

#### pnpm-workspace.yaml (NEW)
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'libs/*'
  - 'services/*'
  - 'tools/*'
```

#### turbo.json (NEW)
Defines build pipeline:
- `build` - Builds all apps with dependency graph
- `test` - Runs tests (cache disabled)
- `lint` - Linting
- `typecheck` - TypeScript checking

### 4. TypeScript Configuration
- `tsconfig.base.json` - Kept all existing path aliases
- New aliases added (ready for Phase 2):
  - `@packages/*` → `packages/*`
  - `@domain/*` → `packages/domain/src/*`
  - `@application/*` → `packages/application/src/*`
  - `@infrastructure/*` → `packages/infrastructure/src/*`

## Migration Checklist

- [x] Created new directory structure
- [x] Moved app folders (web, mobile, website)
- [x] Moved infrastructure folders (docker, kubernetes, monitoring)
- [x] Updated root `package.json` workspaces
- [x] Updated root `package.json` scripts
- [x] Updated GitHub Actions workflows
- [x] Updated Docker Compose paths
- [x] Updated PowerShell test scripts
- [x] Created `pnpm-workspace.yaml`
- [x] Created `turbo.json`
- [ ] Install dependencies and verify builds
- [ ] Run full test suite
- [ ] Verify CI/CD passes
- [ ] Update K8s manifests if needed
- [ ] Verify monitoring infrastructure

## Running Apps After Phase 1

### Development

```bash
# Backend
cd apps/api && npm run start:dev

# Frontend
cd apps/web && npm run dev

# Mobile
cd apps/mobile && npm run android   # or ios

# Or use root scripts:
npm run dev            # Runs backend + web concurrently
npm run dev:backend
npm run dev:web
```

### Building

```bash
npm run build          # Builds backend and web
npm run build:backend
npm run build:web
```

### Testing

```bash
npm run test           # All tests
npm run test:backend
npm run test:web
```

### Type Checking

```bash
npm run typecheck      # All
npm run typecheck:backend
npm run typecheck:web
```

## Performance Notes

- Turbo is configured for parallel builds
- Cache outputs: `dist/`, `.next/`, `build/`, `coverage/`
- Monitor build times - should not degrade >10% from Phase 0.5 baseline

## Next Steps

### Phase 2 (Future)
- Extract domain logic from `apps/api/src/` into `packages/domain/`
- Extract shared types and utilities into `packages/shared/`
- Implement `packages/application/` for cross-cutting concerns
- Add Phase 1 Forge apps under `apps/` (forge-generator, forge-console, etc.)

### Ongoing
- Monitor `infrastructure/monitoring/` for >10% performance regressions
- Use Turbo cache for faster CI/CD
- Consider remote cache (Turbo Cloud) for team workflows
