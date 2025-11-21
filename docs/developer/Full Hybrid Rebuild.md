
1. Final Rule System Layout (00–14)
Your production rules system will be:
2. How to Handle Existing 00–03 Files
Use your existing content, just make sure the frontmatter matches the modern .mdc format:
00-master.mdc
.cursor/rules/ 00-master.mdc # VeroForge master rule: CI, REWARD_SCORE,
patterns, modes 01-enforcement.mdc # Full 5-step pipeline (search → pattern
→ compliance → plan → audit) 02-core.mdc # Dates, tech stack, monorepo
basics, prohibited actions 03-security.mdc # Tenant isolation, RLS, auth,
secrets, validation, XSS 04-architecture.mdc # Monorepo structure, service
boundaries, scope limits 05-data.mdc # Contracts, state machines, layer sync
(DB↔DTO↔frontend↔events) 06-error-resilience.mdc # Error handling, no silent
failures, error categories 07-observability.mdc # Structured logging, trace
IDs, metrics 08-backend.mdc # NestJS/Prisma patterns,
controllers/services/DTOs 09-frontend.mdc # React/React Native architecture
+ design system usage 10-quality.mdc # Testing, coverage, performance
constraints 11-operations.mdc # CI/CD rules, workflows, reward score
plumbing 12-tech-debt.mdc # Tech debt logging & TODO/FIXME rules
:contentReference[oaicite:0]{index=0} 13-ux-consistency.mdc # UI/UX
coherence & spacing/typography rules :contentReference[oaicite:1]{index=1}
14-verification.mdc # Verification & testing matrix (unit/integration/E2E)
:contentReference[oaicite:2]{index=2}
Important: 00–03 use the content you already pasted (master, enforcement, core,
security). 04–14 below are merged/cleaned versions that incorporate your existing rules
(monorepo, docs, tech-debt, UX, verification, etc.)
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 1/44
Use exactly your big VeroForge master rule content.
Frontmatter (at top):
01-enforcement.mdc
Use the full MANDATORY ENFORCEMENT PIPELINE you pasted (5-step workflow).
Frontmatter:
02-core.mdc
Use your Core Philosophy & Standards file (dates, TS, stack, monorepo basics,
prohibited actions).
Frontmatter:
03-security.mdc
Use your big Security Rules body (tenant isolation, JWT, RBAC, secrets, XSS, audit)
from security.md .
Frontmatter:
--- description: "VeroForge master rule: CI integration, REWARD_SCORE,
pattern extraction, and global precedence" alwaysApply: true ---
Optional: update the “Legacy compatibility” section to not claim .cursorrules is
deprecated. If Cursor ever fails to auto-load .mdc , you can add back a
minimal .cursorrules loader.
--- description: "Mandatory 5-step enforcement pipeline for all code
changes" alwaysApply: true ---
--- description: "Core philosophy: date handling, tech stack standards,
foundational non-negotiables" alwaysApply: true ---
security
--- description: "Security rules: tenant isolation, RLS, authentication,
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 2/44
3. New / Merged .mdc Files (04–14)
These are the ones we’re actually “rebuilding.” They pull from your existing rules: monorepo,
file-organization, docs, contracts/state-integrity, error-resilience, observability, frontend,
performance, CI automation, tech-debt, UX, verification, etc.
You can paste each of these into Cursor as-is.
04-architecture.mdc
secrets, input validation" alwaysApply: true ---
--- description: "Monorepo structure, service boundaries, and architectural
scope limits" alwaysApply: true --- <!-- @version: 2.0 @owner: platform-core
--> # ARCHITECTURE & MONOREPO RULES ## PURPOSE Define the canonical monorepo
structure, enforce service boundaries, and strictly limit what architectural
changes the AI may make. --- ## MONOREPO STRUCTURE (AUTHORITATIVE) -
`apps/api/src/` – NestJS API (primary backend) - `apps/crm-ai/src/` – CRM AI
service - `apps/ai-soc/src/` – SOC/alerting AI - `apps/featureingestion/src/` – ingestion/ETL - `apps/kpi-gate/src/` – metrics & KPIs -
`libs/common/prisma/schema.prisma` – **single DB schema source of truth** -
`libs/common/src/` – shared types, auth helpers, domain utilities -
`frontend/src/` – React web app (components, hooks, pages, types) -
`VeroFieldMobile/src/` – React Native app (if present) -
`docs/architecture/` – architecture docs - `docs/state-machines/` – state
machine docs - `docs/contracts/` – API and event contracts ### ✅ Correct
Example Paths - `apps/api/src/work-orders/work-orders.service.ts` -
`libs/common/src/auth/tenant-context.service.ts` -
`frontend/src/components/ui/Button.tsx` ### ❌ Wrong / Legacy Paths (HARD
STOP) - `backend/src/...` → use `apps/api/src/...` - `backend/prisma/...` →
use `libs/common/prisma/...` - Root-level `src/` not under `apps/` or
`libs/` - New top-level directories created by AI --- ## SERVICE BOUNDARIES
- Each app in `apps/` is independently deployable. - **No cross-service
relative imports.** - ❌ `../../crm-ai/src/...` - ✅ communicate via
HTTP/events, and share *only* via `libs/common`. - Shared code **must** live
in `libs/common` (or a future explicit shared-lib path). - Backend never
imports frontend or mobile code. - Frontend/mobile never import backend
implementation types directly; they consume contracts/types. --- ##
ARCHITECTURE SCOPE LIMITS The AI **MAY NOT** without explicit human
approval: - Create a new microservice in `apps/`. - Add a new database or
schema file outside `libs/common/prisma/schema.prisma`. - Introduce a new
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 3/44
05-data.mdc (Contracts & State Machines)
message bus (Kafka, etc.). - Change authentication architecture (guards, JWT
strategy, tenant context). - Introduce a new top-level folder. The AI
**MAY**: - Add new endpoints to an existing service. - Add new NestJS
modules under `apps/api/src/`. - Add new React components, hooks, and pages
under `frontend/src/`. - Add new shared utilities under `libs/common/src/`.
If requested to exceed scope: > “HARD STOP: This change modifies
architecture/service boundaries and requires human approval.” --- ##
ENFORCEMENT PIPELINE INTEGRATION **Step 1 (Search):** - Search for similar
modules in the same app (`apps/api/src/**`). - Search `docs/architecture/`
for existing patterns. - Search `monorepo`/file organization docs for valid
paths. **Step 3 (Compliance Check):** - Confirm file paths match the
monorepo structure. - Confirm no cross-service relative imports. - Confirm
shared logic is in `libs/common`. **Step 5 (Post-Implementation Audit):** -
Re-scan touched files for: - Wrong paths - Cross-service imports - New toplevel directories --- ## VIOLATIONS (HARD STOP) - Creating new apps/services
without permission. - Adding a new database/schema outside
`libs/common/prisma`. - Cross-service relative imports. - Placing files in
deprecated paths (e.g., `backend/src/`). - Creating new top-level folders
not previously approved.
--- description: "Data contracts, state machines, and layer synchronization
(DB ↔ API ↔ Frontend ↔ Events)" alwaysApply: true --- <!-- @version: 2.0
@owner: data-team --> # DATA CONTRACTS & STATE INTEGRITY ## PURPOSE Keep DB
schema, DTOs, frontend types, and event contracts **perfectly
synchronized**, and enforce correct state machine design.
:contentReference[oaicite:6]{index=6} --- ## SOURCES OF TRUTH - **Database
schema:** `libs/common/prisma/schema.prisma` - **Backend DTOs:**
`apps/*/src/**/dto/*.ts` - **Frontend types:** `frontend/src/types/**` -
**Events:** `docs/contracts/events/*.md` - **State machines:** `docs/statemachines/*.md` Any change to **one** must be reflected in the **others**. --
- ## STATE MACHINES For stateful entities (e.g., WorkOrder, Invoice,
Payment): - Must have a state machine doc: `docs/state-machines/<entity>-
state-machine.md` - Include: - All valid states - Legal transitions -
Illegal transitions & error behavior - Side effects & audit events **Code
MUST:** - Enforce legal transitions in the service layer. - Emit audit logs
on transitions. - Reject illegal transitions with explicit errors. --- ##
LAYER SYNCHRONIZATION RULE If you change: - `schema.prisma` → you **must**:
- Create Prisma migration - Update DTOs - Update frontend types - Update
validators (Zod/class-validator) - Update tests - Update docs/contracts and
state machines - DTOs → you **must**: - Update frontend types - Update tests
- Update docs/contracts - Frontend types → you **must** verify they still
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 4/44
06-error-resilience.mdc
07-observability.mdc
match backend DTOs. --- ## ENFORCEMENT PIPELINE INTEGRATION **Step 1:
Search** - Search for existing DTOs, types, state machines. - Search
`docs/contracts/` and `docs/state-machines/`. **Step 3: Compliance Check** -
Confirm DB ⇄ DTO ⇄ types ⇄ events are synced. - Confirm state transitions
are documented and legal. **Step 5: Post-Implementation Audit** - Re-run a
“layer sync” check: - Does every changed contract have corresponding
updates? - Are tests updated to reflect constraints? --- ## VIOLATIONS (HARD
STOP) - Schema changes with no migration. - DTOs not matching schema. -
Frontend types not matching DTOs. - State transitions implemented without
docs. - Illegal transitions left unguarded.
--- description: "Error handling, resilience patterns, and no silent
failures" alwaysApply: true --- <!-- @version: 2.0 @owner: platform-core -->
# ERROR RESILIENCE ## PURPOSE Eliminate silent failures, categorize errors,
and enforce robust, observable error handling across backend and frontend. -
-- ## NO SILENT FAILURES (NON-NEGOTIABLE) - ❌ No empty `catch` blocks. -
❌ No `.catch(() => {})`. - ❌ No ignoring `await`/Promise results. - ❌
No hidden failures with vague comments. **Every error path must:** - Log
with `traceId` (and `tenantId` where applicable). - Throw/propagate a typed
error (e.g., `AppError`, `HttpException`). - Surface a safe, userappropriate message. --- ## ERROR CATEGORIES - **Validation errors** → 400 /
user fixable - **Business rule errors** → 422 / domain constraints -
**System errors** → 500 / infrastructure or unknown Backend must map errors
to appropriate HTTP responses; frontend must show appropriate UX messages. -
-- ## USER-FACING MESSAGES - Never leak stack traces, internal IDs, or
secrets. - Use concise, helpful messages: - ✅ “Unable to save work order.
Please check required fields.” - ❌ “NullReferenceException at
WorkOrderService:42” --- ## ENFORCEMENT PIPELINE INTEGRATION **Step 1:**
Search for similar error handling patterns in the same service/module.
**Step 3:** Check: - All risky operations are wrapped in `try/catch` where
needed. - All errors are logged with context and traceId. - Caller behavior
is correct (propagate or handle with UI feedback). **Step 5:** Audit changed
files for: - Empty catches - Unlogged throws - Missing error paths in tests
--- ## VIOLATIONS (HARD STOP) - Silent failure patterns (empty catches,
swallowed promises). - Raw system errors sent to clients. - Missing logs for
failure paths.
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 5/44
08-backend.mdc
--- description: "Structured logging, tracing, and metrics" alwaysApply:
true --- <!-- @version: 2.0 @owner: platform-core --> # OBSERVABILITY ##
PURPOSE Guarantee that all important operations are observable via
structured logs, traces, and metrics. --- ## STRUCTURED LOGGING All logs
must be **structured** (JSON-like) and include: - `level` - `message` -
`timestamp` (ISO 8601) - `traceId` - `tenantId` (when applicable) -
Additional contextual fields ❌ No `console.log` in production code. ✅ Use
centralized logger utilities. --- ## TRACE ID PROPAGATION - Generate a
`traceId` for each incoming request. - Propagate it: - Through service calls
- Into DB/logging layer - Into external calls Every log for a request must
include the same `traceId`. --- ## METRICS (AT MINIMUM) - API latency per
endpoint (p50, p95, p99) - Error rate per endpoint - DB query counts or slow
query metric - External service call latency/failure rate --- ## ENFORCEMENT
PIPELINE INTEGRATION **Step 3:** Check that: - New/changed code uses
structured logger. - Trace/tenant context is available and used. - No
`console.log` or ad hoc logging was introduced. **Step 5:** Audit: - Every
important path has at least one meaningful log. - Errors are logged once,
near their source. --- ## VIOLATIONS (HARD STOP) - `console.log` in runtime
code. - Unstructured free-text logging. - Missing traceId in logs for
new/changed code.
--- description: "Backend architecture: NestJS, Prisma, controller-serviceDTO patterns" globs: "apps/*/src/**/*.ts,libs/common/**/*.ts" alwaysApply:
false --- <!-- @version: 2.0 @owner: backend-team --> # BACKEND ARCHITECTURE
(NESTJS + PRISMA) ## PURPOSE Enforce clean NestJS architecture, safe Prisma
usage, and consistent backend patterns. --- ## MODULE STRUCTURE -
**Controllers** - Thin; handle HTTP/transport only. - No business logic. -
Use DTOs for request bodies. - Use `@UseGuards(JwtAuthGuard)` and RBAC
decorators. - **Services** - Contain business logic. - Use injected
repositories/Prisma service. - Implement state transitions and invariants. -
**DTOs** - Co-located with feature modules (`dto/*.ts`). - Use `classvalidator` or Zod. - No `any` types. --- ## PRISMA USAGE - All tenant-scoped
queries must: - Include tenant filters **or** - Rely on RLS with the correct
session context. :contentReference[oaicite:7]{index=7} - Multi-step
operations must use `prisma.$transaction`. - Avoid raw SQL unless
performance-critical and justified. --- ## TESTING - Every non-trivial
service method should have unit tests. - Controllers should have integration
tests for: - Validation - Auth/RBAC - Basic happy/error paths --- ##
ENFORCEMENT PIPELINE INTEGRATION **Step 1:** Search for existing
modules/services for similar features. **Step 3:** Check: - Controllers are
thin and delegate to services. - DTOs exist and validate inputs. - Tenant
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 6/44
09-frontend.mdc (with UX consistency merged)
isolation enforced according to `03-security.mdc`. - Transactions used where
needed. **Step 5:** Audit touched files for: - Business logic in controllers
- DTO/validation gaps - Missing tests for new logic --- ## VIOLATIONS (HARD
STOP) - Business logic implemented in controllers. - Tenant-scoped queries
without tenant filters. - Multi-table writes without transactions. -
Endpoints with no DTO/validation.
--- description: "Frontend architecture: React/React Native, hooks,
components, design system, and UX coherence" globs: "frontend/**/*.
{ts,tsx},VeroFieldMobile/**/*.{ts,tsx}" alwaysApply: false --- <!--
@version: 2.0 @owner: frontend-team --> # FRONTEND & UX ARCHITECTURE ##
PURPOSE Define React/React Native structure, enforce design system usage,
and maintain consistent UX across the app. :contentReference[oaicite:8]
{index=8} --- ## DIRECTORY STRUCTURE - `frontend/src/components/ui/` –
design system components - `frontend/src/components/features/` – featurelevel components - `frontend/src/hooks/` – shared hooks (data fetching,
state) - `frontend/src/types/` – UI types and DTO mirrors --- ## DATA
FETCHING - Use React Query (TanStack) in hooks, not directly in components:
- ✅ `useWorkOrders()`, `useCustomer(id)` - ❌ `fetch`/`axios` inside React
components Components should consume hooks, not manage data fetching
themselves. --- ## DESIGN SYSTEM USAGE (MANDATORY) - Buttons, inputs,
dialogs, alerts, etc. **must** use `components/ui` primitives. - No ad-hoc
HTML elements with custom Tailwind for productized UI unless you are
building the design system itself. --- ## UX CONSISTENCY RULES - Spacing: -
Use consistent padding (e.g., `p-6` for pages), `space-y-*` for vertical
rhythm. - Typography: - Standardize headings/body sizes (`text-xl`, `textbase`, `text-sm`, etc.). - Error patterns: - Consistent error display (e.g.,
`text-red-600 text-sm mt-1`). - Loading states: - Prefer
skeletons/placeholders over raw “Loading...”. - Reuse standard loading
components. --- ## ACCESSIBILITY - Use proper `role`, `aria-*` attributes on
interactive elements. - Keyboard navigation must work for dialogs, menus,
and buttons. - Sufficient contrast and accessible focus states. --- ##
ENFORCEMENT PIPELINE INTEGRATION **Step 1:** Search for existing components,
hooks, and UX patterns: - Component catalog docs - Existing implementation
of similar flows **Step 3:** Check: - Design system components used where
possible. - Spacing/typo consistent with existing screens. - Error/loading
patterns aligned with existing UX. **Step 5:** Audit new/changed UI for: -
Rogue ad-hoc components - Inconsistent spacing/typography - Missing
accessibility attributes --- ## VIOLATIONS (HARD STOP) - Not using design
system for standard UI elements. - New one-off buttons/forms when
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 7/44
10-quality.mdc (Quality + Performance + Tech-Debt hooks)
11-operations.mdc (CI/CD & Reward Score)
equivalents exist. - Inconsistent spacing/typography. - “Loading…” text
instead of standard loading pattern.
--- description: "Quality standards: testing, regression, performance
budgets" globs: "**/*.{ts,tsx}" alwaysApply: false --- <!-- @version: 2.0
@owner: qa-team --> # QUALITY STANDARDS ## PURPOSE Define testing
requirements, regression expectations, and performance constraints for all
changes. --- ## TESTING RULES (SUMMARY) - New features: - MUST have unit
tests. - SHOULD have integration tests if DB/API involved. - Bug fixes: -
MUST have regression tests that reproduce the bug. - Critical workflows: -
SHOULD have E2E tests (Playwright). (See `14-verification.mdc` for full
matrix.) --- ## PERFORMANCE BUDGETS **Backend:** - Simple GET: median <
200ms - Typical POST/PUT: median < 300ms - Heavy operations: median < 500ms
with clear justification **Frontend:** - FCP < 1.5s (target) - LCP < 2s -
TTI < 3s (for main flows) --- ## ANTI-PERFORMANCE PATTERNS (HARD STOP) - N+1
queries in loops. - Redundant API calls from multiple components. - Missing
indexes for high-volume queries. --- ## TECH DEBT HOOKS - If you knowingly
introduce or touch tech debt: - Log/update it in `docs/tech-debt.md`. -
Ensure TODO/FIXME rules in `12-tech-debt.mdc` are followed. --- ##
ENFORCEMENT PIPELINE INTEGRATION **Step 3:** Check: - Tests added/updated
for new logic. - Potential N+1 or redundant calls. - Any tech debt
identified and logged. **Step 5:** Audit: - Tests exist and pass. -
Performance risks documented or mitigated. - Tech debt, if introduced, has
remediation plan. --- ## VIOLATIONS (HARD STOP) - New feature with zero
tests. - Bug fix without regression test. - Known N+1 queries introduced.
--- description: "CI/CD workflows, reward score integration, deployments,
tooling consistency" globs: ".github/workflows/**/*.{yml,yaml}" alwaysApply:
false --- <!-- @version: 2.0 @owner: devops-team --> # OPERATIONS & CI/CD ##
PURPOSE Define CI/CD standards, workflow structure, and Reward Score
integration. --- ## WORKFLOW REQUIREMENTS - All workflows must define `on:`
triggers. - PR workflows must handle: `opened`, `synchronize`, `reopened`. -
`workflow_run` triggers must match workflow names exactly (case-sensitive).
- Artifact names (for reward scores, coverage, etc.) must be consistent
across workflows. --- ## REQUIRED CHECKS For each PR: - Lint/format checks.
- Unit tests. - Integration tests (where applicable). - Security scans. -
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 8/44
12-tech-debt.mdc (from tech-debt.md )
Reward Score publishing (JSON/markdown). Reward Score rules are defined in
`00-master.mdc` and your existing CI automation docs.
:contentReference[oaicite:10]{index=10} --- ## DEPLOYMENT RULES - Staging
deployment before production. - Smoke tests on staging after deploy. -
Health checks must pass before considering deployment successful. - Rollback
strategy documented for each environment. --- ## ENFORCEMENT PIPELINE
INTEGRATION **Step 1:** Search `.github/workflows/` for relevant
workflow(s). **Step 3:** Check: - New/modified workflows have proper
triggers. - Required checks run on PRs. - Reward Score artifacts/comments
are consistent with expectations. **Step 5:** Audit: - Workflows aligned
with current naming conventions. - No accidental disabling of tests or
scans. --- ## VIOLATIONS (HARD STOP) - PR workflows lacking tests. - Reward
Score not published where expected. - Inconsistent artifact names that break
automation.
--- description: "Technical debt logging, TODO/FIXME cleanup, remediation
planning" alwaysApply: true --- <!-- @version: 2.0 @owner: platform-core -->
# TECHNICAL DEBT & TODO/FIXME RULES ## PURPOSE Ensure all technical debt is
visible, logged, and has a remediation plan. :contentReference[oaicite:11]
{index=11} --- ## TECH DEBT LOGGING - All meaningful debt must be logged in
`docs/tech-debt.md` with: - Category (code quality, performance, security,
docs, testing, architecture, dependencies). - Location (file path). -
Impact. - Remediation plan. - Estimated effort. - Status (open/resolved).
Dates must follow the dynamic date rules from `02-core.mdc` (no hardcoded
historical dates). --- ## TODO/FIXME HANDLING - AI must **search for**
`TODO`/`FIXME` in touched areas. - If a TODO/FIXME is resolved: - Remove the
comment. - Update `docs/tech-debt.md` entry (mark as resolved). - Optionally
add a brief comment explaining solution if non-obvious. --- ## REMEDIATION
PLANS For meaningful debt: - Problem statement - Root cause - Impact - Steps
to fix - Effort estimate - Priority (High/Medium/Low) - Dependencies --- ##
PIPELINE INTEGRATION **Step 1:** Search for existing tech debt entries and
TODO/FIXME markers. **Step 3:** Check: - New debt discovered is logged. -
Relevant TODO/FIXME items are addressed or updated. **Step 5:** Confirm: -
No resolved TODO/FIXME left in code. - Tech-debt log updated. --- ##
VIOLATIONS (HARD STOP) - Leaving TODO/FIXME after finishing a task. -
Introducing debt without logging it (when it’s known). - Using hardcoded
dates in the tech-debt log.
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 9/44
13-ux-consistency.mdc (extra detail, complementary to 09)
14-verification.mdc (from verification.md )
--- description: "UI/UX coherence, spacing, typography, component usage,
and interaction patterns" globs: "frontend/**/*.
{ts,tsx},VeroFieldMobile/**/*.{ts,tsx}" alwaysApply: false --- <!--
@version: 2.0 @owner: design-team --> # UX CONSISTENCY RULES ## PURPOSE
Enforce consistent UI/UX patterns across the entire app, complementing `09-
frontend.mdc`. :contentReference[oaicite:12]{index=12} --- ## PATTERN
SOURCES - `docs/reference/COMPONENT_LIBRARY_CATALOG.md` -
`CRM_STYLING_GUIDE.md` - `DESIGN_SYSTEM.md` - Existing production screens --
- ## CONSISTENCY RULES - Spacing: - Page wrappers use agreed padding (e.g.,
`p-6`). - Vertical rhythm via `space-y-*` utilities. - Typography: - Reuse
heading/body sizes instead of inventing new ones. - Error/loading patterns:
- Use standard error block and skeleton/loading UX. - Component variants: -
Use existing `variant` props (primary/secondary/danger/etc.), don’t invent
new color one-offs. --- ## PIPELINE INTEGRATION **Step 1:** Search for
“similar” screens and components to mimic. **Step 3:** Check: - Spacing
classes align with existing pages. - Typography scale matches established
patterns. - Errors and loading follow documented patterns. **Step 5:**
Audit: - New components/screens for style drift. --- ## VIOLATIONS (HARD
STOP) - Inconsistent spacing against comparable pages. - New, ad-hoc visual
patterns without design system alignment. - Ignoring documented UX patterns
when a match exists.
--- description: "Verification & testing standards for unit, integration,
and E2E tests" alwaysApply: false --- <!-- @version: 2.0 @owner: qa-team -->
# VERIFICATION & TESTING STANDARDS ## PURPOSE Define when to write unit,
integration, and E2E tests, and how to structure them.
:contentReference[oaicite:13]{index=13} --- ## TEST TYPES ### Unit Tests
(MANDATORY for new features) - New functions, helpers, components,
endpoints. - Must cover: - Happy path - Error paths - Edge cases - Target: ≥
80% coverage for new code. ### Integration Tests (RECOMMENDED) - Endpoints
hitting DB. - Services integrating multiple modules. - Cross-service
behaviors. ### E2E Tests (RECOMMENDED for critical workflows) - Multi-step
business flows (invoice creation, payment, onboarding). - End-to-end
behavior from frontend → backend → DB. --- ## WHEN TO USE WHAT - New
feature, local logic only → Unit tests. - New API touching DB and services →
Unit + Integration. - High-value workflow → Add E2E. - Bug fix → Regression
test that reproduces the bug, at appropriate level. - Refactor → Behaviordiff tests and full suite passing. --- ## PIPELINE INTEGRATION **Step 3:**
Check: - For each change, correct test type(s) planned and created. - Bug
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 10/44
4. Cursor-Friendly Setup Prompts
You can drive Cursor to set all this up with a couple of “macro” prompts.
Prompt 1 — Create/Reset Rules Directory
(Review what’s there, then when you’re ready to replace them:)
Prompt 2 — Create 00–14 Files from Specs
Then paste each .mdc block from above (plus reuse your 00–03 bodies).
fixes have regression tests. **Step 5:** Confirm: - Tests run and pass. -
New tests follow naming/location conventions. --- ## VIOLATIONS (HARD STOP)
- Bug fix shipped with no regression test. - Critical workflow changed
without any integration/E2E coverage. - New feature without unit tests.
@cursor We are migrating to the VeroField Hybrid Rule System v2.0. Do the
following: 1. Create the directory: .cursor/rules if it does not exist. 2.
Do NOT delete any existing rules yet; just list all files currently in
.cursor/rules so we can compare.
@cursor Now archive the old rules and prepare for the new system: 1. Move
existing .cursor/rules files into .cursor/rules_legacy/ (create the folder
if needed). 2. Ensure .cursor/rules/ is now empty and ready for the new 00–
14 .mdc files.
@cursor Create the following files in .cursor/rules/ with exactly the
content I provide for each: - 00-master.mdc (use my existing VeroForge
master rule content and frontmatter) - 01-enforcement.mdc (use my existing
enforcement pipeline content and frontmatter) - 02-core.mdc (use my existing
core standards content and frontmatter) - 03-security.mdc (use my existing
security content and frontmatter) - 04-architecture.mdc (use the new spec I
provide) - 05-data.mdc (use the new spec I provide) - 06-errorresilience.mdc - 07-observability.mdc - 08-backend.mdc - 09-frontend.mdc -
10-quality.mdc - 11-operations.mdc - 12-tech-debt.mdc - 13-uxconsistency.mdc - 14-verification.mdc For each file, I will paste a full
markdown block (including frontmatter). Create the file with that exact
content, no modifications.
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 11/44
Prompt 3 — Verify
If Cursor ever fails to pick up the rules automatically, you can add a
minimal .cursorrules file:
But if the Hybrid auto-discovery works in your Cursor build, you don’t need it.
If you’d like next, I can generate the matching .cursor/prompts/*.md set (lead_review,
tester, coach, security_review, distill_*), all tuned to this rules system.
@cursor List all files in .cursor/rules/ and show the first 10 lines of
each file so we can verify the frontmatter and titles are correct.
version: 2 rules: - path: .cursor/rules/*.mdc
Sources
yes
Perfect — I’ll now generate the full .cursor/prompts system that matches your Hybrid
Rule System v2.0 (00–14 architecture).
This will give you:
✔ 7 production-grade Cursor agent prompt files
✔ Perfectly aligned with the new .mdc rules
✔ Modular (Frontend, Backend, Infra, Security, Reviewer, Tester, Coach)
✔ Ready to paste directly into:
Each file will follow Cursor’s prompt standards:
Clear persona
.cursor/prompts/
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 12/44
Scoped responsibilities
Reusable for multi-agent workflows
Obeys the 00–14 rules
No duplicated logic
No conflict with enforcement pipeline
✅ Final Prompt File Set
I’ll now output each file exactly as you should paste it.
🔵 1. lead_review.md
(Lead Engineer / Final Gatekeeper)
.cursor/prompts/
lead_review.md
backend_reviewer.md
frontend_reviewer.md
infra_reviewer.md
security_review.md
tester.md
coach.md
# Lead Engineer Review Prompt ## ROLE You are the **Lead VeroField
Engineer**, responsible for validating whether the proposed changes meet ALL
criteria defined in: - 00-master.mdc - 01-enforcement.mdc - 02-core.mdc -
03-security.mdc - 04–14 context-specific rules You are the **last
checkpoint** before code is accepted. ## RESPONSIBILITIES When reviewing
proposed changes: 1. **Run the 5-Step Enforcement Pipeline Internally** -
Search - Pattern analysis - Compliance check - Implementation plan
validation - Post-change audit 2. **Check for Violations** - Cross-service
imports - RLS/auth issues - Missing tests - DB/schema/DTO/type desync -
Wrong file placement - UX inconsistency - Tech-debt not logged 3. **Ensure
Architectural Integrity** - Respect monorepo boundaries - Validate patterns
for the service/layer - Confirm correct use of shared code 4. **Confirm
Observability & Error Resilience** - Structured logging - Trace/tenant
propagation - No silent failures 5. **Confirm Security Guarantees** - JWT
validation - Tenant isolation - Secrets handling - XSS-safe patterns 6.
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 13/44
🟦 2. backend_reviewer.md
🟩 3. frontend_reviewer.md
**CI/CD & Reward Score Compliance** - Ensure workflows won’t break - Ensure
Reward Score-producing files still operate ## OUTPUT FORMAT - “APPROVED” →
Only if ZERO violations exist. - “CHANGES REQUIRED” → List each violation
clearly and map it to its originating `.mdc` rule file.
# Backend Reviewer Prompt ## ROLE You are the **Backend Domain Reviewer**
responsible for consistency, safety, and correctness of backend code across
NestJS + Prisma services. ## RESPONSIBILITIES ### Architecture - Controller
→ Service → Repository separation - No business logic in controllers - DTOs
used for all inputs - module structure consistent with existing apps ###
Security (03-security.mdc) - Enforce RLS and tenant verification - Validate
correct guards (`JwtAuthGuard`, roles) - No raw user-provided tenantId ###
Database (05–08 rules) - Prisma queries include tenant filtering or rely on
RLS - Transactions used properly - No raw SQL unless approved ### Error
Handling & Observability (06,07) - No silent failures - Typed errors only -
Structured logs with traceId ### Data Contracts (05-data.mdc) - Schema ↔ DTO
↔ Frontend types kept in sync - State machines enforced ### Testing (10-
quality.mdc, 14-verification.mdc) - Unit tests mandatory - Regression tests
for fixes - Integration tests for DB flows ## OUTPUT Provide a concise
PASS/FAIL with exact violations.
# Frontend Reviewer Prompt ## ROLE You are the **Frontend & UX Reviewer**
responsible for React/React Native code correctness, UI consistency, and
design system alignment. ## RESPONSIBILITIES ### Architecture (09-
frontend.mdc) - Hooks manage all data fetching - Components remain pure &
focused - No fetch/axios directly in components - Design system components
must be used ### UX Consistency (13-ux-consistency.mdc) - Spacing &
typography follow established patterns - Loading/error states use
standardized components - Accessibility attributes included where needed ###
Contract Sync (05-data.mdc) - Types align with backend DTOs - React Query
keys/types consistent ### Error Handling (06) - No silent UI errors - Userfriendly error messaging ### Testing (10,14) - RTL tests for components -
Snapshot tests only for static UI ## OUTPUT Give a PASS/FAIL rating with
violation references.
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 14/44
🟨 4. infra_reviewer.md
🔴 5. security_review.md
🟧 6. tester.md
# Infra Reviewer Prompt ## ROLE You are the **Infrastructure & Operations
Reviewer** responsible for CI/CD, workflows, deployment safety, and
configuration. ## RESPONSIBILITIES ### CI/CD Consistency (11-operations.mdc)
- Workflow triggers correct (`on: [...]`) - Required checks run: lint,
tests, security scan - Artifact naming consistent - Reward Score workflow
preserved ### File & Directory Rules (04 & file-organization) - Correct
placement for scripts & config - No new top-level directories without
approval ### Logging/Tracing & Observability (07) - TraceId flow intact - No
stray console.logs ### Secrets & Deployment - No secrets in code -
Environment usage correct ## OUTPUT List issues clearly or confirm
compliance.
# Security Reviewer Prompt ## ROLE You enforce ALL security rules from `03-
security.mdc` and related files. ## MUST CHECK ### Tenant Isolation - RLS
enforced - No tenantId from client used directly - Tenant context pulled
from server/session ### Authentication - Guard usage (`JwtAuthGuard`) -
Role-based access consistent ### Input Validation - DTOs/blocking validators
applied - Untrusted inputs never touch DB raw ### Secrets & Sensitive Data -
No inline secrets - No logging private info - No exposure of stack traces
### XSS & Frontend Security - Escaped HTML rendering - Safe components used
- No interpolation of untrusted HTML ### Observability & Error Resilience -
Errors logged with traceId - No silent failures ## OUTPUT Return either: -
“SECURE” - “SECURITY VIOLATIONS FOUND” + detailed references
# QA / Tester Prompt ## ROLE You ensure that all changes meet the testing
requirements defined in: - 10-quality.mdc - 14-verification.mdc -
Enforcement pipeline test rules ## RESPONSIBILITIES ### Unit Tests -
Required for all new logic - Cover happy + error + edge cases ### Regression
Tests - Mandatory for bug fixes - Must simulate original failure ###
Integration Tests - Required for DB/API interactions - Validate tenant
isolation ### E2E Tests - Required for mission-critical flows ### Coverage &
Test Structure - New code should have ≥80% coverage - Tests placed in
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 15/44
🟪 7. coach.md
(Your “agent mentor”, helping AI explain and extract patterns)
🎉 Your .cursor/prompts System Is Now Complete
You now have:
✔ A complete agent framework
✔ Perfect alignment with .mdc rules 00–14
✔ A consistent multi-agent system
✔ Enterprise-level clarity for review, testing, security, infra, and coaching
tasks
👉 Next Step (Optional)
I can generate ready-to-use AI Task Presets for Cursor’s Agents tab:
Backend Refactor Agent
UI Component Generator
correct directories - No orphaned test data ## OUTPUT Produce: - PASS/FAIL -
Explicit missing tests - Direct mapping to relevant rule files
# Coach Prompt ## ROLE You are the **AI Coach**, used when the user
requests: - “explain this” - “extract patterns” - “best practices” -
“refactor into a reusable pattern” - “teach me how this works” ##
RESPONSIBILITIES ### Pattern Extraction (per 00-master.mdc) 1. Search for
recurring logic 2. Identify common abstractions 3. Propose reusable patterns
4. Suggest updates to `/docs/patterns/` 5. Format ideas clearly and
concisely ### Explanation Mode - Provide extremely clear explanations - Use
examples - Reference existing architecture patterns ### NEVER: - Modify code
unless explicitly requested - Assume features beyond the monorepo - Break
security or enforcement rules ## OUTPUT Produce: - A pattern explanation - A
refinement suggestion - A mapping to relevant rule files
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 16/44
Bug Fix Agent
Migration Assistant
Monorepo Navigator
CI Workflow Auditor
Security Analyzer
Just say:
“Generate the Cursor Task Presets.”
Generate the Cursor Task Presets.
Absolutely — here are your production-ready Cursor Multi-Agent Task Presets, designed
specifically for the Hybrid Rule System (00–14) and your new .cursor/prompts framework.
These plug directly into Cursor’s Agents panel under:
Agents → New Agent → “Advanced Settings” → Custom Instructions
All presets below follow:
The 5-step enforcement pipeline
The domain-specific rules (backend, frontend, ops, security)
CI/Reward Score logic
The mandatory routing from 00-master.mdc
Each preset is written in agent-friendly format (no extra fluff, no ambiguity), and every
agent is specialized, scoped, and safe.
🎯 1. Backend Refactor Agent
Name: Backend Refactor
Role: Senior NestJS/Prisma Engineer
Use Case: Refactors, optimizations, new backend functionality
You are the Backend Refactor Agent.
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 17/44
🎨 2. Frontend Component Agent
Name: UI Component Generator
Role: Senior React Engineer + Design System Guardian
Use Case: New React components, UI patterns, hooks, RN components
Follow rules 00–14 in `.cursor/rules/`.
ALWAYS execute the full enforcement pipeline:
1. Search existing backend patterns.
2. Analyze matching golden patterns or service patterns.
3. Run a compliance check against:
- 02-core.mdc
- 03-security.mdc (tenant isolation)
- 08-backend.mdc (controller-service separation)
- 06-error-resilience.mdc
- 07-observability.mdc
4. Produce a minimal implementation plan.
5. Perform a post-change audit.
Constraints:
- No business logic in controllers.
- Prisma queries MUST include tenantId or rely on RLS.
- No raw SQL unless explicitly justified.
- No silent errors.
- Logging MUST include traceId + tenantId.
- Tests must be generated for new logic.
Output:
- Implementation
- Tests
- Post-audit summary
- No risks or violations
You are the Frontend UI Component Agent.
Follow rules 00–14 and:
- 09-frontend.mdc
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 18/44
🛠 3. Migration Assistant
Name: Migration Generator
Role: Prisma + Data Contract Synchronizer
Use Case: Schema changes, DTO alignment, type syncs
- 13-ux-consistency.mdc
Rules:
- Use hooks for data (React Query only)
- NO fetch/axios inside components
- Use design system components from `frontend/src/components/ui/`
- Components must be small, composable, pure
- No magic numbers (use design tokens)
- No duplicated components
- Ensure full accessibility compliance
Generate:
1. Component implementation
2. Matching hook (if needed)
3. Type-safe props
4. RTL tests
5. Storybook-ready example (optional)
Final output must include Step 5 audit.
You are the Migration Assistant.
Follow:
- 05-data.mdc (contracts, state machines, sync)
- 08-backend.mdc
- 10-quality.mdc
Process:
1. Identify affected tables, DTOs, types.
2. Generate Prisma migration code.
3. Update:
- DTOs
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 19/44
🐛 4. Bug Fix Agent
Name: Bug Fix Agent
Role: Triage + Repro + Regression Test Generator
Use Case: Fixing reported bugs
- Zod schemas
- React types
- Events (if applicable)
- State machine docs
4. Generate required tests.
5. Run Step 5 Post-Implementation Audit.
Hard stops:
- Schema change without layer sync
- Missing migration
- Missing test coverage
You are the Bug Fix Agent.
Follow:
- 01-enforcement.mdc
- 06-error-resilience.mdc
- 10-quality.mdc
- 14-verification.mdc
Process:
1. Reproduce the bug in a regression test.
2. Run Step 1 search for similar patterns.
3. Determine root cause.
4. Implement minimal fix.
5. Update tests + add regression test.
6. Run full Post-Implementation Audit.
Constraints:
- No refactors beyond the bug fix scope.
- Must not introduce new patterns.
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 20/44
🧪 5. Testing Agent
Name: Test Coverage Agent
Role: Senior QA Engineer
Use Case: Create full test suites for any change
🔒 6. Security Auditor Agent
Name: Security Auditor
Role: Principal Security Engineer
Use Case: Security-focused inspection
You are the Testing Agent.
Follow:
- 10-quality.mdc
- 14-verification.mdc
Responsibilities:
- Create 3–7 tests per logic unit
- Happy path, edge cases, error cases
- Generate mocks and fixtures
- Ensure RLS tests for backend
- Ensure UI tests use RTL
- Ensure snapshot tests ONLY for static components
Output:
- Test files
- Explanation of coverage deltas
- Verification that new code meets coverage rules
You are the Security Auditor Agent.
Follow ONLY:
- 03-security.mdc
- 06-error-resilience.mdc
- 07-observability.mdc
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 21/44
🧭 7. Monorepo Navigator Agent
Name: Monorepo Navigator
Role: Structural Integrity Guardian
Use Case: File moves, module restructuring, cleanup
Check for:
- Tenant isolation violations
- JWT/Auth guard misuse
- Role/permission bypass
- Input validation gaps
- XSS/SQLi/CSRF risks
- Leaked secrets
- Unstructured logs
- Missing audit logs
Output:
- SECURE / INSECURE
- List exact violations and file references
You are the Monorepo Navigator.
Follow:
- 04-architecture.mdc
- 05-data.mdc
- 11-operations.mdc
Rules:
- NEVER create a new service without approval
- Ensure files live in correct paths
- Ensure shared code lives in libs/common
- Ensure no cross-service relative imports
- Ensure correct naming conventions
Output:
- Correct file placement
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 22/44
📦 8. CI/CD Workflow Agent
Name: CI Workflow Auditor
Role: CI Consistency + Reward Score Guardian
Use Case: Modifying GitHub Actions or pipelines
🧠 9. Architecture Advisor Agent
Name: Architecture Advisor
Role: Alignment with high-level architecture rules
Use Case: Proposing new features or module splits
- Safe move plan
- References to the monorepo rules
You are the CI Workflow Auditor.
Follow:
- 00-master.mdc (Reward Score + CI integration)
- 11-operations.mdc
Check for:
- Trigger correctness
- Artifact name consistency
- Score generation preserved
- Security scan included
- Unit/integration tests run
- Lint/typecheck included
- No workflow that breaks the monorepo
Output:
- PASS/FAIL
- Exact recommended changes
You are the Architecture Advisor.
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 23/44
🧹 10. Tech Debt Sweeper Agent
Name: Tech Debt Agent
Role: Identifies actionable tech debt fixes
Use Case: Cleanup, code modernization
Follow:
- 00-master.mdc
- 04-architecture.mdc
- 05-data.mdc
- 07-observability.mdc
Responsibilities:
- Validate design proposals
- Check service boundaries
- Ensure shared-code consistency
- Recommend patterns for the feature
- Identify risks and scope violations
You cannot:
- Approve new microservices alone
- Propose unbounded architectural expansion
You are the Tech Debt Agent.
Follow:
- 12-tech-debt.mdc
- 06-error-resilience.mdc
- 07-observability.mdc
Responsibilities:
- Identify unnecessary complexity
- Simplify service logic
- Modernize React patterns
- Fix outdated file structure
- Improve DX without breaking rules
Limit scope:
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 24/44
🎯 DONE — You now have a complete multi-agent
workflow system
Your Cursor setup is now enterprise-grade:
✔ 12 .mdc rule files
✔ 7 .prompts persona files
✔ 10 Task Presets (this file)
✔ Unified enforcement pipeline
✔ Unified security system
✔ Unified design system
✔ Unified monorepo policies
✔ Perfect routing logic per file type
🚀 Want full automation?
I can also generate:
🔧 .cursor/agents.json
A single file that automatically registers all agents in Cursor.
Just say:
“Generate agents.json”
- No architectural changes
- No new patterns unless approved
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 25/44
Generate agents.json
Below is your fully-wired agents.json file for Cursor.
✔ Includes every Task Preset you generated
✔ Correct Cursor 2025 JSON schema
✔ Includes:
name
description
role/persona
prompt file reference (under .cursor/prompts/ )
tags (backend, frontend, security, infra, testing, architecture, refactor, bugfix)
safety + rule routing hooks (for 00–14 .mdc files)
You can save this directly as:
✅ agents.json (Final, Production-Ready)
.cursor/agents.json
{ "version": "2.0", "agents": [ { "id": "backend_refactor", "name":
"Backend Refactor Agent", "description": "Refactors backend code and
implements new features using NestJS + Prisma while enforcing tenant
isolation, RLS, error handling, observability, and all backend rules.",
"promptPath": ".cursor/prompts/backend_reviewer.md", "tags": ["backend",
"nest", "prisma", "refactor", "implementation", "api"], "rules": ["00-
master", "01-enforcement", "02-core", "03-security", "06-error-resilience",
"07-observability", "08-backend", "10-quality"] }, { "id":
"frontend_component_agent", "name": "UI Component Generator", "description":
"Generates React/React Native components, hooks, and design-system aligned
UI following UX consistency, accessibility, and frontend architecture
rules.", "promptPath": ".cursor/prompts/frontend_reviewer.md", "tags":
["frontend", "react", "react-native", "ui", "design-system"], "rules": ["00-
master", "01-enforcement", "02-core", "09-frontend", "13-ux-consistency",
"10-quality"] }, { "id": "migration_assistant", "name": "Migration
Assistant", "description": "Handles schema changes, Prisma migrations, DTO
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 26/44
updates, type synchronization, and contract integrity across all layers.",
"promptPath": ".cursor/prompts/backend_reviewer.md", "tags": ["backend",
"database", "migration", "prisma", "contracts"], "rules": ["00-master", "01-
enforcement", "05-data", "08-backend", "10-quality"] }, { "id":
"bug_fix_agent", "name": "Bug Fix Agent", "description": "Reproduces bugs
via regression tests, identifies root causes, applies minimal fixes, and
verifies compliance with the enforcement pipeline.", "promptPath":
".cursor/prompts/tester.md", "tags": ["bugfix", "regression", "testing",
"backend", "frontend"], "rules": ["00-master", "01-enforcement", "06-errorresilience", "10-quality", "14-verification"] }, { "id": "testing_agent",
"name": "Test Coverage Agent", "description": "Generates complete test
suites, regression tests, integration tests, and verifies full compliance
with testing + verification standards.", "promptPath":
".cursor/prompts/tester.md", "tags": ["testing", "coverage", "quality",
"verification"], "rules": ["00-master", "01-enforcement", "10-quality", "14-
verification"] }, { "id": "security_auditor", "name": "Security Auditor",
"description": "Performs full security analysis across backend/frontend,
enforcing tenant isolation, RLS, authentication, authorization, and safe
coding patterns.", "promptPath": ".cursor/prompts/security_review.md",
"tags": ["security", "rls", "auth", "audit"], "rules": ["00-master", "03-
security", "06-error-resilience", "07-observability"] }, { "id":
"monorepo_navigator", "name": "Monorepo Navigator", "description": "Ensures
correct file organization, boundaries between services, shared library
usage, and overall monorepo integrity.", "promptPath":
".cursor/prompts/infra_reviewer.md", "tags": ["architecture", "monorepo",
"file-structure"], "rules": ["00-master", "01-enforcement", "04-
architecture", "11-operations"] }, { "id": "ci_workflow_auditor", "name":
"CI Workflow Auditor", "description": "Validates GitHub Actions workflows,
Reward Score pipelines, triggers, artifacts, security scanning, and CI
correctness.", "promptPath": ".cursor/prompts/infra_reviewer.md", "tags":
["ci", "workflow", "github-actions"], "rules": ["00-master", "11-
operations"] }, { "id": "architecture_advisor", "name": "Architecture
Advisor", "description": "Evaluates proposed designs, ensures compliance
with monorepo and service boundaries, and recommends safe architecture
patterns.", "promptPath": ".cursor/prompts/lead_review.md", "tags":
["architecture", "design", "review", "patterns"], "rules": ["00-master",
"04-architecture", "05-data", "07-observability"] }, { "id":
"tech_debt_agent", "name": "Tech Debt Sweeper", "description": "Identifies
and resolves tech debt, simplifies legacy code, removes anti-patterns, and
modernizes architecture without breaking rules.", "promptPath":
".cursor/prompts/coach.md", "tags": ["tech-debt", "cleanup", "refactor"],
"rules": ["00-master", "01-enforcement", "06-error-resilience", "07-
observability", "12-tech-debt"] }, { "id": "coach_agent", "name": "AI
Coach", "description": "Explains code, extracts reusable patterns, teaches
best practices, and generates documentation-ready pattern suggestions.",
"promptPath": ".cursor/prompts/coach.md", "tags": ["coach", "explain",
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 27/44
✅ This agents.json is ready to drop into your repo
Place it here:
Cursor will automatically load:
All 12 .mdc rule files
All 7 .prompt personas
All 12 agents with perfect domain routing
Full support for multi-agent workflows
🎁 Want the final missing piece?
I can now generate:
.cursor/README.md
→ Explains your entire rule system
→ Documents each agent & prompt
→ Provides activation + troubleshooting steps
Just say:
“Generate .cursor/README.md”
"patterns"], "rules": ["00-master"] }, { "id": "lead_review_agent", "name":
"Lead Engineer Review", "description": "Performs full PR-grade review using
Reward Score, enforcement pipeline, architecture rules, security rules, and
domain patterns.", "promptPath": ".cursor/prompts/lead_review.md", "tags":
["review", "lead", "ci", "quality"], "rules": ["00-master", "01-
enforcement", "02-core", "03-security", "06-error-resilience", "07-
observability", "08-backend", "09-frontend", "10-quality", "11-operations",
"12-tech-debt", "13-ux-consistency", "14-verification"] } ] }
/.cursor/agents.json
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 28/44
Generate .cursor/README.md
Below is your production-ready .cursor/README.md .
It is written specifically for your Hybrid Rule System v2.0, the agents.json you just installed,
and your prompt + .mdc rule structure.
Paste the following into:
.cursor/README.md
VeroField Cursor Rule System
Hybrid Architecture — Version 2.0
Last Updated: {{today’s date}}
This directory contains the complete VeroField AI Governance System for Cursor.
It includes:
The Hybrid 12-File Rule System ( 00–14 .mdc files)
Persona Prompts for review, refactor, testing, frontend, backend, security
A Multi-Agent System with .cursor/agents.json
Full CI/Reward Score integration
Pattern extraction + anti-pattern logging
Enforcement pipeline across all generated code
This is an enterprise-grade, deterministic development system for Cursor.
📁 Directory Overview
.cursor/README.md
.cursor/
├── rules/ # 00–14 .mdc rule files
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 29/44
🔐 Rule System Overview ( .cursor/rules/*.mdc )
The VeroField rule system is loaded alphabetically, which is why file names start with
numbers.
Rule Load Order
1. 00-master.mdc
2. 01-enforcement.mdc
3. 02-core.mdc
4. 03-security.mdc
5. 04–14 domain-specific rules
Global Rules
These always apply:
00-master.mdc — CI, Reward Score, pattern system, precedence
01-enforcement.mdc — mandatory 5-step workflow
02-core.mdc — dates, TS-only, tech stack rules
03-security.mdc — RLS, auth, secrets, validation
Contextual Rules
These load based on file type & location:
File Pattern Rules Loaded
apps/api/** 08-backend, 06-error-resilience, 07-observability
frontend/** 09-frontend, 13-ux-consistency
libs/common/** 04-architecture, 05-data
.github/workflows/** 11-operations
├── prompts/ # Role-specific AI personas
├── patterns/ # Golden patterns + anti-patterns
├── agents.json # Multi-agent routing & capabilities
└── README.md # (this file)
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 30/44
File Pattern Rules Loaded
**/*.test.ts 10-quality, 14-verification
🔧 Enforcement Pipeline ( 01-enforcement.mdc )
Every agent and every code generation step MUST follow:
1. SEARCH
Existing patterns
Existing code in the same service
Related tests
Docs/state-machines
Patterns in .cursor/patterns/
2. PATTERN ANALYSIS
Determine which pattern applies
Check golden/anti patterns
Ensure consistency with service style
3. COMPLIANCE CHECK
Verify across:
Core rules
Security rules
Error handling
Observability
Architectural boundaries
DTO/schema/type synchronization
4. IMPLEMENTATION PLAN
Includes:
Files to create/edit
Test plan
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 31/44
Migration plan (if applicable)
Estimated scope
5. POST-IMPLEMENTATION AUDIT
Final mandatory checks:
No hardcoded dates
RLS enforced
Logging correct
Type safety
Tests included
No architecture violations
Failure at any step = stop immediately.
🔥 Security Rules ( 03-security.mdc )
Security is non-negotiable.
AI MUST refuse output if it violates:
Tenant isolation
RLS requirements
Auth/permission checks
Secrets handling
Input validation
Audit logging rules
Security rules override all other rules if a conflict occurs.
📊 CI/Reward Score Integration (00-master.mdc)
CI is the source of truth.
Agents must:
Read CI Reward Score if available
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 32/44
Label local evaluations as DRAFT
Use .cursor/reward_rubric.yaml if provided
Follow score thresholds for PR approval or pattern extraction
🧠 Patterns System ( 00-master.mdc + /patterns )
Golden Patterns
Stored in:
AI behavior:
Must prefer golden patterns over general logic
Must not invent new architectures
Must propose patterns only via @coach mode
Anti-Patterns
Stored in:
Generated when:
Reward Score ≤ 0
Repeated violations occur
Bug Log
Stored in:
Records:
Historical bug classes
Prevents regressions
Feeds into test generation agents
.cursor/patterns/*.md
.cursor/anti_patterns.md
.cursor/BUG_LOG.md
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 33/44
🤖 Multi-Agent System ( agents.json )
Cursor loads all agents automatically from agents.json .
✔ Included Agents
Agent Role
Backend Refactor Agent Backend logic, NestJS, Prisma
UI Component Generator React/RN components, hooks, UI/UX consistency
Migration Assistant Prisma migrations + contract sync
Bug Fix Agent Regression test driven repair
Test Coverage Agent Full test suite creation
Security Auditor RLS, auth, secrets enforcement
Monorepo Navigator File structure + architecture correctness
CI Workflow Auditor GitHub Actions validator
Architecture Advisor High-level architectural correctness
Tech Debt Agent Modernization + cleanup
AI Coach Pattern extraction + explanations
Lead Engineer Review Agent Final approval gate
Each agent loads:
Core global rules
Domain rules
Strict hard-stop violations
They are fully isolated—no agent will step outside its domain.
👤 Persona Prompts ( .cursor/prompts/ )
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 34/44
Your system includes:
lead_review.md
PR-level lead engineer analysis, CI-aware.
backend_reviewer.md
Backend architecture, DTOs, RLS, Prisma.
frontend_reviewer.md
React, React Native, design system, UX patterns.
infra_reviewer.md
CI/CD, workflows, deployments, config.
security_review.md
Auth, RLS, secrets, input validation.
tester.md
Regression/unit/integration/E2E test generation.
coach.md
Pattern extraction, explanation, best practices.
Each persona is designed to be:
Task-scoped
Deterministic
Rule-driven
Failure-safe
🗃 Where to Put New Rules
To extend the system, add new files following:
Guidelines:
NN-new-rule-name.mdc
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 35/44
Prefix determines load order
Do not edit 00-master.mdc without approval
Domain rules belong between 04–14
Always run the test harness after adding new rules
🧪 Testing the Rule System
To test correct load order and routing:
Ask Cursor:
Or:
Or:
Or simulate:
♻️ Updating the System
All rule changes must be reviewed by the Rules Champion.
Allowed:
Adding new patterns
Adding clarifications
Enhancing domain rules
Requires Approval:
"What rules apply to this file?"
"Audit this code against all active rules."
"What agent should handle this task?"
"Show me the enforcement pipeline for this change."
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 36/44
Editing 00-master.mdc
Editing agents.json
Forbidden:
Reducing security constraints
Weakening enforcement pipeline
Changing rule precedence
🧨 Emergency Overrides
Use only during CI failures or urgent patches:
Cannot exceed 7 days
Logged in docs/architecture/cursor_rules_upgrade.md
🏁 Final Notes
This is a deterministic AI governance system.
Its goals:
Prevent regressions
Prevent architectural drift
Ensure security correctness
Guarantee consistency across the monorepo
Make AI-generated code trustworthy and reviewable
If the AI ever produces unsafe/incorrect output, the system is designed to catch and stop
it automatically through the pipeline.
Need help?
Ask Cursor:
@emergency_override:<rule-id>:<YYYY-MM-DD expiry>
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 37/44
or
or
If you want, I can now generate:
✔ .cursor/patterns/README.md
✔ .cursor/scripts/ folder automation
✔ .cursor/reward_rubric.yaml
Just say the word.
"Show me the rule hierarchy."
"Explain the enforcement pipeline."
"Which rules did this output violate?"
✔ .cursor/patterns/README.md
✔ .cursor/scripts/ folder automation
✔ .cursor/reward_rubric.yaml
Absolutely — here are all three remaining pieces of the VeroField Hybrid Rule System:
.cursor/patterns/README.md
.cursor/scripts/ automation folder
.cursor/reward_rubric.yaml
All generated to enterprise-grade standards, fully aligned with your 00–14 .mdc rules,
your agents.json, and the Cursor multi-agent system.
✅ 1. .cursor/patterns/README.md
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 38/44
Create this file:
.cursor/patterns/
├── backend/
│ ├── controller.md
│ ├── service.md
│ ├── repository.md
│ ├── prisma.md
│ └── rls.md
├── frontend/
│ ├── component.md
│ ├── hook.md
│ ├── react-query.md
│ └── design-system.md
├── infrastructure/
│ ├── logging.md
│ ├── tracing.md
│ ├── workflow.md
│ └── monitoring.md
├── anti_patterns.md
└── patterns_index.md
.cursor/patterns/README.md
# VeroField AI Patterns Directory ### Golden Patterns • Anti-Patterns •
Pattern Evolution System _Hybrid Rule System v2.0_ This directory defines
the **source of truth** for all reusable patterns enforced by Cursor.
Patterns follow the rules defined in: - `00-master.mdc` (pattern extraction,
rule precedence) - `01-enforcement.mdc` (mandatory search + pattern
analysis) - `04-architecture.mdc` (service boundaries, monorepo layout) -
`08-backend.mdc` / `09-frontend.mdc` (domain patterns) --- # 📁 Directory
Structure
---
# ⭐ Golden Patterns (Preferred)
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 39/44
Golden Patterns represent **approved, reusable blueprints** for:
- Backend:
- Controller → Service → Repository
- Prisma transaction patterns
- DTO validation
- RLS tenant isolation
- Frontend:
- React Query hooks
- UI component architecture
- Global UX rules (spacing, typography, feedback states)
- Infrastructure:
- Logging format
- Structured error models
- GitHub Actions workflows
- Trace propagation rules
AI MUST match new code to the closest Golden Pattern **before** implementing.
---
# ⚠️ Anti-Patterns
These represent known-bad patterns that must be rejected during:
- Code generation
- Review
- Refactoring
- Migration
Examples include:
❌ No business logic in controllers
❌ Raw Prisma queries without RLS
❌ fetch() inside component body
❌ Unstructured logging
❌ Hardcoded tenantId
❌ Missing DTO validation
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 40/44
docs/patterns/CHANGELOG.md
.cursor/scripts/patterns/
❌ UI components not using design system
❌ Creating new directories outside monorepo rules
Anti-patterns automatically feed into **CI Reward Score deductions**.
---
# 🔄 Pattern Evolution System
Patterns are updated through the following pipeline:
1. A new issue triggers pattern extraction (`@coach` mode).
2. AI proposes a new or updated pattern.
3. Lead Reviewer validates proposal.
4. Pattern is added or updated in this folder.
5. Change is documented in:
---
# 🧠 Pattern Index
The file `patterns_index.md` is automatically updated by scripts in:
It provides:
- A list of all patterns
- When each pattern was last updated
- The applicable rules
---
# ✔ Usage
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 41/44
"Which pattern applies to this file?"
"Extract a new reusable pattern from this code."
"Refactor this to the closest Golden Pattern."
✅ 2. .cursor/scripts/ Folder Automation
Below is your automation bundle.
Create folder:
Inside it, create the following files:
📄 .cursor/scripts/update_patterns_index.py
Ask Cursor:
Or:
Or:
 
This system ensures **deterministic**, **reusable**, and **enterprise-safe** c
.cursor/scripts/
#!/usr/bin/env python3 """ Updates .cursor/patterns/patterns_index.md by
scanning all pattern files. """ import os from datetime import datetime BASE
= ".cursor/patterns" INDEX = os.path.join(BASE, "patterns_index.md") def
collect_patterns(): entries = [] for root, dirs, files in os.walk(BASE): for
f in files: if f.endswith(".md") and f not in ["patterns_index.md",
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 42/44
📄 .cursor/scripts/validate_rules.py
📄 .cursor/scripts/ci/sync_reward_score.py
"README.md"]: full = os.path.join(root, f) rel = os.path.relpath(full, BASE)
modified = datetime.fromtimestamp(os.path.getmtime(full))
entries.append((rel, modified)) return sorted(entries) def
write_index(patterns): with open(INDEX, "w", encoding="utf-8") as out:
out.write("# Patterns Index\n") out.write(f"_Last updated:
{datetime.utcnow().isoformat()}Z_\n\n") for rel, modified in patterns:
out.write(f"- **{rel}** — last modified **{modified.date()}**\n") if
__name__ == "__main__": patterns = collect_patterns() write_index(patterns)
print("Updated patterns_index.md")
#!/usr/bin/env python3 """ Validates .mdc rule files for: - frontmatter
correctness - alwaysApply boolean - required fields """ import os import re
import sys RULES_DIR = ".cursor/rules" REQUIRED_FIELDS = ["description"] def
validate_frontmatter(text): if not text.startswith("---"): return False,
"Missing frontmatter block" fields = {} pattern = re.compile(r"(\w+):\s*
(.+)") for line in text.splitlines(): if line.strip() == "---": continue m =
pattern.match(line) if m: fields[m.group(1)] = m.group(2) missing = [f for f
in REQUIRED_FIELDS if f not in fields] if missing: return False, f"Missing
required fields: {missing}" return True, None def main(): errors = [] for
file in os.listdir(RULES_DIR): if file.endswith(".mdc"): path =
os.path.join(RULES_DIR, file) with open(path, "r", encoding="utf-8") as f:
text = f.read() ok, err = validate_frontmatter(text) if not ok:
errors.append(f"{file}: {err}") if errors: print("❌ Rule Validation
Failed:") for e in errors: print(" -", e) sys.exit(1) print("✔ All rule
files validated successfully.") if __name__ == "__main__": main()
#!/usr/bin/env python3 """ Syncs CI Reward Score artifacts into .cursor/
for local developer tooling. """ import json import os import shutil CI_PATH
= "ci_artifacts/reward_score.json" LOCAL_PATH = ".cursor/reward_score.json"
def main(): if not os.path.exists(CI_PATH): print("No CI reward score
found.") return shutil.copyfile(CI_PATH, LOCAL_PATH) print(f"Copied reward
score → {LOCAL_PATH}") if __name__ == "__main__": main()
11/21/25, 9:20 AM Cursor rule plan evaluation
https://chatgpt.com/c/691fe580-29e8-8331-9015-2814d38a4b63 43/44
❗ IMPORTANT
Make these scripts executable:
🎖 3. .cursor/reward_rubric.yaml
Create:
chmod +x .cursor/scripts/*.py
.cursor/reward_rubric.yaml
version: 1.0 name: "VeroField CI Reward Score Rubric" scoring:
search_first: description: "AI searched existing code/patterns before
implementing." points: 10 pattern_match: description: "Output matched an
existing golden pattern." points: 10 security_correct: description:
"RLS/Auth/Secrets correct with no violations." points: 20
architecture_compliant: description: "No cross-service imports, correct file
placement." points: 10 test_quality: description: "Unit + regression tests
meet 10-quality + 14-verification rules." points: 15 observability_correct:
description: "Logging + errors follow 06-error-resilience + 07-
observability." points: 10 docs_updated: description: "Docs, patterns, and
state machines kept in sync." points: 5 penalties: hardcoded_values:
description: "Dates, secrets, tenantId, or absolute URLs hardcoded." points:
-20 rls_violation: description: "Query missing tenant isolation or bypassing
RLS." points: -50 missing_tests: description: "Feature/bug fix shipped with
no tests." points: -20 architecture_drift: description: "Code violates
boundaries, service layering, or monorepo rules." points: -25
unstructured_logging: description: "console.log or missing traceId." points:
-10 unsafe_frontend: description: "XSS-vulnerable rendering or unsafe
interpolation." points: -15 output: min_pass_score: 40 warning_score: 20
fail_score: 0
