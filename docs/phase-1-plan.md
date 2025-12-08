# Plan: VeroField Phase 1 - Top-Level Layout & Monorepo Skeleton

**Establish the final directory structure without deep code movement, enabling VeroForge Phase 1 expansion.** Currently, `frontend/` sits at the root (inconsistent with `apps/api/`), `deploy/` and `monitoring/` lack clear organization, and CI/CD workflows are brittle with hardcoded paths. Phase 1 will standardize the monorepo shape, move infrastructure folders, update all path references, and re-verify performance baselines.

## Steps

### 1. Create top-level directories for apps and packages structure

- Add `apps/web/` (rename from `frontend/`)
- Move `VeroSuiteMobile/` → `apps/mobile/` (direct move, simplest approach)
- Move `verofield-website/` → `apps/website/`
- Create `packages/` with subdirectories:
  - `packages/domain/`
  - `packages/application/`
  - `packages/infrastructure/`
  - `packages/shared/`
  - (Initially empty, ready for Phase 2 domain logic extraction)

**Rationale:** Aligns all runtime apps under `apps/`, creates reserved space for shared libraries under `packages/`, and resolves the inconsistency of `frontend/` at root level.

---

### 2. Reorganize infrastructure folders

- Move `deploy/docker-compose.prod.yml` → `infrastructure/docker/docker-compose.prod.yml`
- Move `deploy/k8s/` → `infrastructure/kubernetes/`
- Create `infrastructure/terraform/` (reserved for Phase 2+)
- Move `monitoring/` → `infrastructure/monitoring/`

**Files to update:**
- Docker Compose references: Update all references to `deploy/docker-compose.prod.yml` (now at `infrastructure/docker/docker-compose.prod.yml`)
- K8s manifests: `deploy/k8s/*.yaml` → `infrastructure/kubernetes/*.yaml`
- Any deployment scripts referencing old paths

**Rationale:** Centralizes all infrastructure concerns under a single root-level directory, improving organizational clarity and making Phase 1 expansion predictable.

---

### 3. Fix path references in ~230+ files across 8 categories

#### A. GitHub Workflows (`.github/workflows/`, ~20 files)
- Update `working-directory` from `frontend` to `apps/web`
- Update `cache-dependency-path` from `frontend/package-lock.json` to `apps/web/package-lock.json`
- Update `working-directory` from `VeroSuiteMobile` to `apps/mobile`
- Update `cache-dependency-path` from `VeroSuiteMobile/package-lock.json` to `apps/mobile/package-lock.json`
- Update job references: `- deploy` might reference `frontend/**`, `verofield-website/**`, or `VeroSuiteMobile/**`
- Ensure all new Phase 1 app paths are present (templates for reuse)

**Files affected:**
- `ci.yml` (main CI)
- `deploy-production.yml`
- `verofield_auto_pr.yml`
- `apply_reward_feedback.yml`
- `auto_pr_session_manager.yml`
- `observability-check.yml`
- (17 others to audit)

#### B. Docker Compose (`infrastructure/docker/docker-compose.prod.yml`)
- Update all references from `../deploy/docker-compose.prod.yml` to `./docker-compose.prod.yml` (or adjust relative paths)
- Update `context` paths if they use `../` references (e.g., `context: ../apps/api`)
- Update service names if containerization strategy changes

#### C. Root-level `package.json` scripts
- `dev:frontend` → `dev:web` (or keep `dev:frontend` if preferred, but update the path)
- Verify path: `cd frontend` → should be `cd apps/web`
- Add scripts for `apps/mobile` if separate dev script is needed
- Update workspace definitions in `"workspaces"` array to include new `packages/*` and new `apps/*` apps

**Current state:**
```json
"workspaces": ["apps/*", "libs/*"]
```
**Should include:**
```json
"workspaces": ["apps/*", "packages/*", "libs/*"]
```

#### D. PowerShell scripts (`scripts/*.ps1`, ~5 files)
- `run-nest-capture.ps1`: Check for `backend/` references, update to `apps/api`
- `run-tests.ps1`: Verify it references correct paths
- `setup-pre-commit.ps1`: Update path checks
- `verify_android_setup.ps1`: May reference `VeroSuiteMobile/`, update to `apps/mobile/`
- `verify_java_setup.ps1`: May reference mobile app paths

#### E. K8s Manifests (`infrastructure/kubernetes/`, ~5 files)
- `deployment.yaml`: Check image references, ensure container paths match new app structure
- `configmap.yaml`: Check if it references old paths
- `service.yaml`: Update service port mappings if needed

#### F. Monitoring configuration (`infrastructure/monitoring/`)
- Update any scripts that reference old `monitoring/` path (now under `infrastructure/monitoring/`)
- Verify monitoring tooling integration with new app structure

#### G. Documentation (~200+ files)
- Already mostly correct per existing [README.md](README.md)
- Create new `docs/phase-1-architecture.md` documenting final structure
- Update any docs referencing old paths (e.g., `deploy/`, `VeroSuiteMobile/`)

#### H. Test configuration (`tsconfig.tests.json`, etc.)
- Verify test globs work with new app structure
- Update any test scripts that hardcode paths

---

### 4. Add monorepo tooling configuration

#### A. Create `pnpm-workspace.yaml` (at root)
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'libs/*'
  - 'services/*'
  - 'tools/*'
```

**Rationale:** Explicitly defines workspace boundaries for `pnpm`, enables faster CI/CD, supports workspaces in Turbo.

#### B. Create `turbo.json` (at root)
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "test": {
      "outputs": ["coverage/**"],
      "cache": false
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "outputs": []
    }
  }
}
```

**Rationale:** Enables parallel builds across apps (5 Phase 1 apps will benefit), caches results, reduces CI/CD time.

#### C. Update `tsconfig.base.json` path aliases
- Keep existing aliases working: `@app/*`, `@libs/*`, `@common/*`
- Add new aliases for Phase 1 packages (if needed):
  ```json
  "@packages/*": ["packages/*"],
  "@domain/*": ["packages/domain/src/*"],
  "@application/*": ["packages/application/src/*"],
  "@infrastructure/*": ["packages/infrastructure/src/*"]
  ```

---

### 5. Update root-level documentation and configuration

#### A. Update [README.md](README.md)
Add a Phase 1 Architecture section documenting:
- `apps/`: Runtime applications (api, web, mobile, website, + Phase 1 forge apps)
- `packages/`: Shared libraries (domain, application, infrastructure, shared)
- `infrastructure/`: Deployment & observability (docker, kubernetes, terraform, monitoring)
- `libs/`: Legacy shared code (to be migrated to `packages/` in future phases)

#### B. Create `docs/phase-1-architecture.md`
Document:
- New directory structure diagram
- Path migration checklist
- Which files were updated and why
- How to run apps from new locations
- CI/CD changes and impact

#### C. Create Phase 1 migration checklist in comments
Update `.github/workflows/ci.yml` or root [README.md](README.md) with checklist to ensure nothing was missed.

---

### 6. Re-check performance baseline (Phase 0.5 follow-up)

**Note:** Performance baseline establishment was completed in Phase 0.5. Phase 1 should re-verify metrics to ensure no >10% regression.

#### A. Re-measure baseline metrics
After Phase 1 directory restructure and tooling setup, re-run measurements:
- **API response times:** p50, p95, p99 (compare against Phase 0.5 baseline)
- **Build times:** Total build time, per-app (measure with Turbo cache)
- **Test execution times:** Full suite runtime
- **Bundle sizes:** All apps (measure with `npm run build`)
- **Deployment time:** How long does Docker build + K8s rollout take?

**Verification approach:**
1. Run `npm run build` and `npm run test` after directory restructure, compare to Phase 0.5 baseline
2. Run Turbo builds and measure cache hit rates
3. Alert if any metric degrades >10%

#### B. Configure Turbo cache warming
- Update CI/CD to warm Turbo cache (avoid cache misses on Phase 1 additions)
- Consider using remote cache for faster CI (e.g., Turbo Cloud)

#### C. Monitoring infrastructure readiness
Ensure `infrastructure/monitoring/` is operational:
- Alert thresholds for regressions >10% are configured
- Baseline metrics collection is working (Prometheus, DataDog, or custom)
- Phase 1 apps are included in monitoring scope

---

## Further Considerations

### 1. Frontend location decision
**Current:** Root-level `frontend/`, inconsistent with phase proposal  
**Decision made in Step 1:** Move to `apps/web/` for consistency and cleaner Phase 1 expansion

**Impact:**
- Updates needed: CI/CD workflows, `package.json` scripts, Docker Compose, K8s manifests
- Benefit: Uniform app structure, easier to add Phase 1 forge apps
- All references covered in Step 3

---

### 2. CI/CD workflow brittleness
**Current state:** 20+ workflows have mixed path hardcoding  
**Risk:** Adding Phase 1 apps requires updating many workflows simultaneously  

**Mitigation strategy:**
- Create GitHub Actions composite workflow (e.g., `.github/actions/build-app/action.yml`)
- Refactor 20+ workflows to use composite instead of duplicating build steps
- **Timing:** Implement before Phase 1 apps are added (reduces future maintenance)

**Example composite workflow:**
```yaml
# .github/actions/build-app/action.yml
inputs:
  app-path:
    required: true
  cache-path:
    required: true
runs:
  using: 'node16'
  steps:
    - uses: actions/setup-node@v3
      with:
        cache: 'npm'
        cache-dependency-path: ${{ inputs.cache-path }}
    - run: npm run build
      working-directory: ${{ inputs.app-path }}
```

---

### 3. Monitoring scope clarity
**Current state:** `monitoring/` directory exists but purpose/tooling unclear  
**Risk:** Phase 1 requires observability for new apps; can't configure without knowing the strategy  

**Required decisions before Phase 1:**
- What monitoring tooling? (Prometheus + Grafana, DataDog, New Relic, custom?)
- How are alerts configured? (CloudWatch, PagerDuty, etc.?)
- What metrics are we tracking? (API latency, error rates, resource usage?)

**Action items:**
1. Audit existing `monitoring/` directory (Phase 0.5 task)
2. Document chosen tooling and configuration
3. Move to `infrastructure/monitoring/` with clear strategy
4. Add Phase 1 app monitoring to baseline (Step 6)

---

### 4. Path reference count estimate
- **~230+ path references** are estimated to need updates across the 8 categories listed in Step 3
- Actual count may be higher or lower depending on the depth of hardcoding in each category
- Verify completeness via CI/CD test runs after updates

---

## Exit Criteria

✅ Phase 1 is **complete** when:
- New directory structure exists (`apps/web`, `apps/website`, `apps/mobile`, `packages/*`, `infrastructure/*`)
- All ~230+ path references updated (estimated; actual count may vary) (verified by CI/CD passing)
- Repo installs, builds, and tests pass without regression
- Performance baseline re-verified (no >10% degradation vs. Phase 0.5)
- [README.md](README.md) and `docs/` updated with Phase 1 structure
- Monitoring infrastructure operational and reporting baseline metrics

**Rollback plan if exit criteria not met:**
1. Revert all commits since Phase 1 start
2. Document blockers in issue
3. Reassess approach
4. Maximum 2 rollback attempts before pivot to alternative strategy

---

## Implementation Order

1. **Weeks 1–2:** Create directory structure, move files, commit
2. **Weeks 2–3:** Update path references (~230+ files) in batches (CI/CD first, then scripts, then docs)
3. **Weeks 3–4:** Add Turbo + pnpm-workspace.yaml, test parallel builds
4. **Weeks 4–5:** Re-verify performance baseline, configure monitoring
5. **Weeks 5–6:** Buffer for unexpected issues, documentation finalization

**Risk:** High risk period is weeks 2–3 (path updates). Recommend pair programming or thorough code review for CI/CD changes.
