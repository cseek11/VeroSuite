# EXECUTION_CONTRACT: Phase 0.5 - Pre-Migration Deep Audit

**Phase:** 0.5
**Type:** Audit & Documentation
**Status:** COMPLETED (Ready for Exit Verification)
**Created:** 2025-12-03
**Last Updated:** 2025-12-08

---

## CURRENT STATUS (2025-12-08)

### ✅ COMPLETED DELIVERABLES

All 10 core deliverables have been successfully created and populated:

1. ✅ `docs/migration/dependency-map.md` - Dependency analysis with circular dependency detection
2. ✅ `docs/migration/coverage-baseline.md` - Test coverage baseline documented with module-level breakdown
3. ✅ `docs/api/contracts.md` - API contract documentation (redirected to standard location)
4. ✅ `docs/migration/schema-analysis.md` - Database schema mapped to bounded contexts
5. ✅ `docs/migration/critical-paths.md` - Critical user flows documented
6. ✅ `docs/migration/performance-baseline.md` - Performance measurements captured (partial completion)
7. ✅ `docs/migration/risk-register.md` - Risk assessment and rollback procedures
8. ✅ `docs/migration/team-skills.md` - Team skills audit framework
9. ✅ `docs/migration/branch-strategy.md` - Migration branching strategy
10. ✅ `docs/migration/communication-cadence.md` - Communication plan established

### 🔄 PARTIAL COMPLETIONS

- **Performance Baseline:** Core measurements captured but some endpoints still marked as "TBD"
- **Test Coverage:** Baseline established but re-verification recommended

### ⚠️ SYSTEM STATUS

- **Enforcement Status:** WARNINGS_ONLY (94 warnings, 0 blocking violations)
- **Code Changes:** None detected (phase invariant maintained)
- **Test Suite:** Functional and passing

### 🎯 EXIT CRITERIA VERIFICATION

**Ready for Final Verification:**
- All deliverables exist and are substantive (>100 bytes each)
- Documentation is accurate and actionable
- Baseline data integrity verified
- No breaking changes to runtime behavior

---

## OBJECTIVE

Establish a comprehensive baseline of the current system state before any migration or restructuring. This phase produces documentation and analysis only—no code changes, no schema changes, no API behavior changes.

---

## GLOBAL INVARIANTS

1. **No breaking changes** to runtime behavior, public APIs, or DB schema
2. **No reduction** in test coverage (baseline becomes minimum acceptable)
3. **Critical user flows** must remain fully functional
4. **Strictly audit, documentation, and baseline work**

---

## DELIVERABLES

All deliverables must be created in `docs/migration/` or `docs/api/` as specified.

1. `docs/migration/dependency-map.png` (or equivalent)
2. `docs/migration/coverage-baseline.md`
3. `docs/api/contracts.md` (note: user specified `docs/migration/api-contracts.md` but standard location is `docs/api/`; create both or clarify)
4. `docs/migration/schema-analysis.md`
5. `docs/migration/critical-paths.md`
6. `docs/migration/performance-baseline.md`
7. `docs/migration/risk-register.md`
8. `docs/migration/team-skills.md`
9. `docs/migration/branch-strategy.md`
10. `docs/migration/communication-cadence.md`

---

## EXECUTION STEPS

### STEP 1: Setup and Prerequisites

**1.1** Verify `docs/migration/` directory exists; create if missing.

**1.2** Verify `docs/api/` directory exists; create if missing.

**1.3** Install dependency analysis tool if not present:
- Check if `madge` is in root `package.json` or `apps/api/package.json`
- If missing, add to `apps/api/package.json` devDependencies: `"madge": "^6.0.0"`
- Run `npm install` in `apps/api/`

**1.4** Verify test coverage tooling:
- Confirm `jest --coverage` works: `cd apps/api && npm run test:coverage`
- Note any errors or missing dependencies

---

### STEP 2: Dependency Mapping

**2.1** Generate dependency graph image:
- Run: `cd apps/api && npx madge --image ../../docs/migration/dependency-map.png src`
- If image generation fails, generate JSON: `npx madge --json src > ../../docs/migration/dependency-map.json`
- Document the command used in the deliverable

**2.2** Detect circular dependencies:
- Run: `cd apps/api && npx madge --circular src`
- Capture full output to `docs/migration/dependency-map-circular.txt`

**2.3** Create `docs/migration/dependency-map.md`:
- Include: command used to generate graph
- List all circular dependencies (if any) with file paths
- Identify high-coupling modules (modules with >10 direct dependencies)
- Identify cross-cutting concerns (modules imported by >5 other modules)
- Map modules to bounded contexts (accounts, jobs, work-orders, billing, etc.)
- Note: If no circular dependencies exist, state "No circular dependencies detected"

---

### STEP 3: Test Coverage Baseline

**3.1** Run full test suite with coverage:
- Command: `cd apps/api && npm run test:coverage`
- Wait for completion; capture output

**3.2** Extract coverage data:
- Locate coverage report (typically `apps/api/coverage/coverage-summary.json` or terminal output)
- Extract coverage percentages per module/domain

**3.3** Create `docs/migration/coverage-baseline.md`:
- **Header:** "Test Coverage Baseline - Phase 0.5"
- **Date:** Current date
- **Rule Statement:** "No phase may reduce coverage below this baseline. This baseline is the minimum acceptable coverage for all later phases."
- **Coverage Table:**
  - Column 1: Module/Domain (e.g., accounts, jobs, work-orders, billing, auth, common, etc.)
  - Column 2: Statements %
  - Column 3: Branches %
  - Column 4: Functions %
  - Column 5: Lines %
  - Column 6: Test File Count
- **Overall Coverage:** Aggregate percentages
- **Test Suite Breakdown:**
  - Unit tests: count and runtime
  - Integration tests: count and runtime
  - E2E tests: count and runtime
- **Notes:** Any modules with 0% coverage, any known gaps

---

### STEP 4: API Contract Documentation

**4.1** Extract API endpoints:
- Method 1: Start NestJS in watch mode and capture route mappings:
  - Run: `cd apps/api && npm run start:dev:fast` (or equivalent)
  - Capture startup logs showing "Mapped {/path, POST} route" patterns
  - Stop server after capture
- Method 2: If Method 1 fails, manually scan all `*.controller.ts` files in `apps/api/src/`
- Method 3: Use Swagger/OpenAPI if available: `GET /api-docs` or `GET /swagger-json`

**4.2** For each controller file found:
- Extract: `@Controller()` path prefix and version
- Extract: All `@Get()`, `@Post()`, `@Put()`, `@Delete()`, `@Patch()` decorators
- Extract: Route paths (including `@Param()` and `@Query()` usage)
- Extract: DTO classes referenced in `@Body()` and response types
- Extract: Guards applied (`@UseGuards()`)
- Note: API versioning (v1, v2 controllers)

**4.3** Create `docs/api/contracts.md`:
- **Header:** "API Contracts - Current State Baseline"
- **Date:** Current date
- **Structure:**
  ```
  ## Endpoints by Module

  ### Accounts Module
  - `POST /api/v1/accounts` - Create account
    - Request: CreateAccountDto
    - Response: AccountResponseDto
    - Guards: JwtAuthGuard, TenantGuard
    - Controller: AccountsController
  
  [Continue for all modules...]
  ```
- **Request/Response Shapes:** For each endpoint, document:
  - Request body structure (key fields only, not full DTO)
  - Response structure (key fields only)
  - Query parameters
  - Path parameters
- **Versioning:** Clearly mark v1 vs v2 endpoints
- **Breaking Changes (Future):** Add a section "Planned Breaking Changes (Future Phases)" with placeholders:
  - Example: `[PLANNED] POST /api/v1/accounts will be deprecated in Phase X, use POST /api/v2/accounts`
- **Note:** This document acts as a regression spec for later phases

**4.4** Also create `docs/migration/api-contracts.md` as a symlink or reference to `docs/api/contracts.md` if user specifically requested it in that location.

---

### STEP 5: Database Schema Audit

**5.1** Verify Prisma schema is in sync:
- Run: `cd libs/common && npx prisma db pull` (dry-run or actual pull)
- Run: `npx prisma validate`
- Note any warnings or errors

**5.2** Read `libs/common/prisma/schema.prisma`:
- Extract all model definitions
- Extract all relationships (foreign keys)
- Extract all indexes
- Extract schema organization (multi-schema if used: public, auth, compliance, veroscore)

**5.3** Create `docs/migration/schema-analysis.md`:
- **Header:** "Database Schema Analysis - Phase 0.5"
- **Date:** Current date
- **Schema Organization:** List all schemas (public, auth, compliance, veroscore)
- **Tables to Bounded Contexts Mapping:**
  - Create table: `Table Name | Bounded Context | Notes`
  - Example: `jobs | Jobs | Core domain entity`
  - Example: `tenants | Shared Kernel | Multi-tenant isolation`
- **Shared Tables Identification:**
  - List tables used by multiple bounded contexts (candidates for shared-kernel)
  - Example: `tenants`, `users`, `audit_logs`
- **Cross-Context Foreign Keys:**
  - List foreign keys that cross bounded context boundaries
  - Example: `jobs.tenant_id -> tenants.id` (cross-context)
  - Note: These are candidates for event-based boundaries later
- **Tenant Isolation:**
  - Document how tenant_id is used across tables
  - List tables without tenant_id (if any) and reason
- **Indexes:**
  - List all indexes and their purpose
- **Relationships:**
  - Document key relationships (one-to-many, many-to-many)

---

### STEP 6: Critical Paths Identification

**6.1** Review existing product knowledge:
- Check `docs/` for user flow documentation
- Check `docs/architecture/` for system flows
- If no documentation exists, use domain knowledge from codebase structure

**6.2** Document top 5 critical user flows:
- Flow 1: Create account → Create job → Assign technician → Complete
- Flow 2: Generate invoice → Process payment
- Flow 3: Schedule appointment → Technician accepts → Complete
- Flow 4: Dashboard → View KPIs
- Flow 5: Mobile: View jobs → Capture photo → Submit

**6.3** Create `docs/migration/critical-paths.md`:
- **Header:** "Critical User Paths - Phase 0.5"
- **Date:** Current date
- **Invariant Statement:** "These flows must work after EVERY phase. Any phase that breaks these flows fails exit criteria."
- **For each flow:**
  ```
  ## Flow 1: Create account → Create job → Assign technician → Complete

  ### Step-by-Step:
  1. User creates account
     - API: POST /api/v1/accounts
     - Module: accounts
     - DB Tables: accounts, users
  2. User creates job
     - API: POST /api/v1/jobs
     - Module: jobs
     - DB Tables: jobs
  3. User assigns technician
     - API: POST /api/v1/jobs/:id/assign
     - Module: jobs
     - DB Tables: jobs, technician_assignments
  4. Technician completes job
     - API: PUT /api/v1/jobs/:id/complete
     - Module: jobs
     - DB Tables: jobs, job_completions

  ### Testability:
  - E2E test: `test/e2e/critical-path-1.spec.ts`
  - Manual test steps: [list]
  ```
- **Repeat for all 5 flows**
- **Cross-Reference:** Link to API contracts and schema analysis

---

### STEP 7: Performance Baseline

**7.1** Identify performance testing tools:
- Check if `k6` is installed (see `apps/api/package.json`)
- Check if load testing scripts exist in `apps/api/test/performance/`
- If missing, document that performance baseline will be manual/estimated

**7.2** Measure API endpoint performance:
- If k6 scripts exist: Run `cd apps/api && npm run load:test`
- If not: Document manual measurement approach or note "To be measured in Phase 1"
- Capture p50, p95, p99 latencies for key endpoints:
  - POST /api/v1/accounts
  - GET /api/v1/jobs
  - POST /api/v1/work-orders
  - GET /api/v1/dashboard
  - POST /api/v1/billing/invoices

**7.3** Measure build times:
- Run: `cd apps/api && npm run build` (time it)
- Run: `cd frontend && npm run build` (time it)
- Record actual times

**7.4** Measure test suite times:
- Run: `cd apps/api && npm run test:unit` (time it)
- Run: `cd apps/api && npm run test:integration` (time it)
- Run: `cd apps/api && npm run test:e2e` (time it)
- Record actual times

**7.5** Create `docs/migration/performance-baseline.md`:
- **Header:** "Performance Baseline - Phase 0.5"
- **Date:** Current date
- **API Endpoint Performance:**
  - Table: `Endpoint | Method | p50 | p95 | p99 | Notes`
  - Use actual measured values or "TBD - to be measured in Phase 1"
- **Build Times:**
  - `apps/api: Xs`
  - `frontend: Xs`
  - `libs/common: Xs` (if applicable)
- **Test Suite Times:**
  - `Unit: Xs`
  - `Integration: Xs`
  - `E2E: Xm Xs`
- **Notes:** Measurement methodology, environment details (local vs CI)

---

### STEP 8: Risk Assessment & Rollback Plan

**8.1** Create `docs/migration/risk-register.md`:
- **Header:** "Risk Register & Rollback Plan - Phase 0.5"
- **Date:** Current date
- **Top 5 Risks:**
  ```
  ## Risk 1: Data Loss During Prisma Move
  - **Likelihood:** Medium
  - **Impact:** Critical
  - **Mitigation:** Full DB backup before any migration, staging test environment, rollback procedure
  - **Owner:** [TBD]

  ## Risk 2: Team Resistance
  - **Likelihood:** Medium
  - **Impact:** High
  - **Mitigation:** Training sessions, pair programming, clear communication
  - **Owner:** [TBD]

  ## Risk 3: Customer-Facing Bugs
  - **Likelihood:** Medium
  - **Impact:** High
  - **Mitigation:** Feature flags, gradual rollout, comprehensive testing
  - **Owner:** [TBD]

  ## Risk 4: Timeline Slip
  - **Likelihood:** High
  - **Impact:** Medium
  - **Mitigation:** Buffer time in estimates, scope flexibility, regular checkpoints
  - **Owner:** [TBD]

  ## Risk 5: Performance Regression
  - **Likelihood:** Medium
  - **Impact:** High
  - **Mitigation:** Continuous monitoring, performance budgets, load testing
  - **Owner:** [TBD]
  ```
- **Rollback Plan:**
  ```
  ## Phase 0.5 Rollback (If Exit Criteria Not Met)

  ### Conditions for Rollback:
  - [List exit criteria that, if not met, trigger rollback]

  ### Rollback Steps:
  1. Revert all commits since phase start (tag: `phase-0.5-start`)
  2. Document blockers encountered
  3. Reassess approach
  4. Maximum 2 rollback attempts before pivot

  ### Future Phase Rollback:
  - Each phase will have its own rollback procedure
  - Common pattern: Revert commits, restore DB backup, redeploy previous version
  ```
- **Exit Criteria Link:** Reference Phase 0.5 exit criteria (documented separately or in this file)

---

### STEP 9: Team Skills Audit

**9.1** Create `docs/migration/team-skills.md`:
- **Header:** "Team Skills Baseline - Phase 0.5"
- **Date:** Current date
- **Purpose:** "This document defines how to capture team self-ratings and establishes training requirements."
- **Rating Scale:** 0-10 (0 = no experience, 10 = expert)
- **Skills to Rate:**
  - DDD (Domain-Driven Design) experience
  - CQRS (Command Query Responsibility Segregation) experience
  - Event-driven architecture experience
  - NestJS experience
  - Prisma experience
  - Microservices experience
- **Capture Method:**
  - Document: "Team members should self-rate using [survey tool / spreadsheet / etc.]"
  - Template: `Name | DDD | CQRS | Event-Driven | NestJS | Prisma | Microservices | Notes`
- **Training Rule:**
  - "If average rating < 5 in any area, schedule training before Phase 1."
  - "Training must be completed and verified before Phase 1 begins."
- **Note:** This is a process document; no code changes required. EB may scaffold a survey template or spreadsheet.

---

### STEP 10: Migration Branch Strategy

**10.1** Create `docs/migration/branch-strategy.md`:
- **Header:** "Migration Branch Strategy - Phase 0.5"
- **Date:** Current date
- **Branch Naming Pattern:**
  - `migration/phase-0.5` (current phase)
  - `migration/phase-1`
  - `migration/phase-2`
  - etc.
- **Branch Rules:**
  - Each phase is a separate branch
  - Branch from `main` at phase start
  - Merge to `main` only after exit criteria are met
  - No direct commits to `main` during migration phases
- **Workflow:**
  ```
  1. Create branch: `git checkout -b migration/phase-0.5`
  2. Work on phase deliverables
  3. Commit changes to branch
  4. Verify exit criteria met
  5. Create PR to main
  6. Review and merge
  7. Tag: `git tag phase-0.5-complete`
  ```
- **Conflict Resolution:** Document process for merge conflicts
- **Rollback:** Reference risk-register.md for rollback procedure

---

### STEP 11: Communication Cadence

**11.1** Create `docs/migration/communication-cadence.md`:
- **Header:** "Communication Cadence - Phase 0.5"
- **Date:** Current date
- **Daily Standup:**
  - Frequency: Daily
  - Duration: 15 minutes
  - Frequency: Every day during migration
  - Agenda: Progress update, blockers, next steps
- **Weekly Demo:**
  - Frequency: Weekly
  - Audience: Stakeholders
  - Purpose: Demo completed phase work
  - Format: [Define format: slides, live demo, etc.]
- **Bi-weekly Retrospective:**
  - Frequency: Every 2 weeks
  - Purpose: Process improvement
  - Format: What went well, what didn't, action items
- **Communication Channels:**
  - [Document: Slack channel, email list, etc.]
- **Note:** This is process documentation only; no runtime changes required.

---

### STEP 12: Exit Criteria Verification

**12.1** Create checklist document or section in a master phase doc:
- **File:** `docs/migration/phase-0.5-exit-criteria.md`
- **Content:**
  ```
  # Phase 0.5 Exit Criteria

  ## Deliverables Checklist:
  - [ ] Dependency graphs generated and analyzed
  - [ ] Test coverage baseline documented
  - [ ] All API endpoints catalogued
  - [ ] Database schema mapped to contexts
  - [ ] Critical paths identified and testable
  - [ ] Team training rule captured (DDD/CQRS basics)
  - [ ] Branch strategy documented
  - [ ] Communication cadence documented
  - [ ] Performance baseline documented
  - [ ] Risk register + rollback plan complete

  ## Quality Gates:
  - [ ] All deliverables exist and are non-empty
  - [ ] All documentation is clear and actionable
  - [ ] No breaking changes introduced (verify: git diff shows only docs)
  - [ ] Test coverage baseline is accurate (verify: re-run coverage matches)
  - [ ] Critical paths are testable (verify: test files exist or can be created)

  ## Sign-off:
  - [ ] Technical Lead approval
  - [ ] Product Owner approval (if applicable)
  ```

**12.2** Verify all deliverables exist and are non-empty.

**12.3** Run final verification:
- Re-run test coverage to ensure baseline matches
- Verify no code changes were made (git status should show only new files in docs/)

---

## COMPLETION CRITERIA

Phase 0.5 is complete when:

1. ✅ All 10 deliverables exist in `docs/migration/` or `docs/api/`
2. ✅ All deliverables are non-empty and contain substantive content
3. ✅ Exit criteria checklist is complete
4. ✅ Git diff shows only new documentation files (no code changes)
5. ✅ Test coverage baseline is accurate and verifiable
6. ✅ All critical paths are documented and testable

---

## NEXT STEPS

### Immediate Actions (Complete Phase 0.5)

1. **Run Exit Criteria Verification:**
   ```bash
   # Execute the test plan in docs/migration/PHASE_0.5_TEST_PLAN.md
   # Verify all 13 test cases pass
   # Create docs/migration/phase-0.5-test-results.md
   ```

2. **Complete Performance Baseline:**
   - Capture remaining API endpoint p95 measurements
   - Record build times and test suite durations
   - Update `docs/migration/performance-baseline.md` with final measurements

3. **Address Warning Violations (Optional):**
   - 94 warning violations detected (error handling, console logging)
   - Consider fixing high-priority warnings before Phase 1
   - Run: `python .cursor/scripts/auto-enforcer.py --scope current_session` to verify

4. **Create Phase 0.5 Exit Criteria Document:**
   ```bash
   # Create docs/migration/phase-0.5-exit-criteria.md
   # Include verified checklist from PHASE_0.5_TEST_PLAN.md
   ```

### Phase 1 Preparation

1. **Review Risk Register:** Assess Phase 1 risks and mitigation readiness
2. **Team Skills Assessment:** Complete DDD/CQRS training if average rating < 5
3. **Branch Creation:** Create `migration/phase-1` branch from main
4. **Communication Setup:** Establish weekly demos and retrospectives

### Success Criteria for Phase Exit

**Phase 0.5 is complete when:**
- ✅ All 13 test cases in PHASE_0.5_TEST_PLAN.md pass
- ✅ `docs/migration/phase-0.5-test-results.md` shows PASS status
- ✅ `docs/migration/phase-0.5-exit-criteria.md` is complete
- ✅ Performance baseline is fully populated (no TBD values)
- ✅ Git tag `phase-0.5-complete` is created

**Phase 0.5 FAILS if:**
- ❌ Any CRITICAL test fails
- ❌ Code changes detected (invariant violation)
- ❌ Coverage baseline cannot be verified
- ❌ Critical paths are not testable

---

## NOTES FOR EXECUTION BRAIN (EB)

- **No code changes:** This phase is documentation only. If you find yourself editing `.ts`, `.js`, `.prisma`, or any runtime code, STOP and re-read the contract.
- **Commands may fail:** If a command fails (e.g., `madge` not found), document the failure and provide alternative approach or note as "TBD in Phase 1".
- **Estimates are OK:** If actual measurements aren't possible (e.g., performance), document "TBD - to be measured in Phase 1" rather than guessing.
- **Ask for clarification:** If a step is unclear, document the question and proceed with best-effort implementation.

---

**End of EXECUTION_CONTRACT**










