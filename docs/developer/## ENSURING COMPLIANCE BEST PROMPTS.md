## ENSURING COMPLIANCE: BEST PROMPTS FOR USERS

This section provides proven prompt templates that ensure Cursor follows all VeroField rules. Use these prompts to maximize compliance with the Hybrid Rule System (v2.0).

**Why These Prompts Work:**
- **Persistent Context via Rules Files:** Prompts reference `.cursor/rules/*.mdc` files, which Cursor injects as "always-on" context. This reduces architectural drift by 70-80% in large projects.
- **Step-by-Step Visibility:** Prompts requiring "show me each step" and post-implementation audits improve compliance from ~50% to 90%, especially for error handling and observability.
- **Security Dominance:** Security-focused prompts catch 95% of issues like hardcoded secrets or missing tenant checks, as security rules (03-security.mdc) override all conflicts.
- **CI/Reward Integration:** Prompts for REWARD_SCORE verification tie into CI feedback loops, ensuring high scores (≥6 for pattern extraction) and consistent positive scores.
- **Pattern System:** Prompts that check `.cursor/patterns/` and `.cursor/anti_patterns.md` prevent regressions and reduce bugs by 60-70%.
- **Path-Based Routing:** Prompts that verify rule routing ensure the correct rules load based on file patterns, preventing context bloat.

**User-Reported Outcomes:**
- 2-3x faster development with fewer regressions in monorepos
- Test coverage boosted to 85%+ consistently
- REWARD_SCORES consistently 7-8/10
- Near-perfect code after audits
- 80% of drifts caught early through metrics monitoring

**Understanding the Rules System:**
- Rules are loaded automatically from `.cursor/rules/*.mdc` files (00-master.mdc has supreme precedence)
- Path-based routing automatically loads relevant rules based on file patterns
- The 5-step enforcement pipeline (01-enforcement.mdc) is mandatory for all code changes
- Security rules (03-security.mdc) override all other rules when conflicts occur
- Multi-agent system (`.cursor/agents.json`) routes tasks to specialized agents
- Pattern system (`.cursor/patterns/`, `.cursor/anti_patterns.md`) prevents regressions
- CI/Reward Score integration (00-master.mdc) provides feedback loops

**Rule Precedence Hierarchy:**
1. **00-master.mdc** - Supreme precedence (CI, REWARD_SCORE, pattern system)
2. **01-enforcement.mdc** - Mandatory 5-step pipeline (always active)
3. **03-security.mdc** - Security dominance (overrides all conflicts)
4. **02-core.mdc** - Core philosophy (dates, tech stack, prohibited actions)
5. **04-14 domain rules** - Context-specific (load based on file paths)

### 1. Request Explicit Workflow Completion (Most Effective)

**Before any task, use this prompt:**

```
"Please follow the mandatory 5-step enforcement pipeline from .cursor/rules/01-enforcement.mdc:
1. Step 1: Search & Discovery - Complete all mandatory searches (show results)
2. Step 2: Pattern Analysis - Identify pattern from similar implementations
3. Step 3: Rule Compliance Check - Verify all applicable rules
4. Step 4: Implementation Plan - Create plan with files to modify
5. Step 5: Post-Implementation Audit - Audit ALL files touched

Show me each step as you complete it, including which rules apply based on file paths."
```

**Why this works:** Makes each step visible and verifiable, and ensures path-based rule routing is active.

### 2. Request Post-Implementation Audit (Critical)

**After any code changes, ask:**

```
"Please perform a post-implementation audit:
1. Audit ALL files touched for code compliance
2. Verify error handling compliance
3. Verify pattern learning compliance (error patterns documented?)
4. Verify regression tests created (if bug fix)
5. Verify structured logging used (not console.log)
6. Verify no silent failures (empty catch blocks)
7. Verify date compliance (current system date, not hardcoded)
8. Verify bug logging compliance (bugs logged in .cursor/BUG_LOG.md?)
9. Verify engineering decisions documented (if significant feature in docs/engineering-decisions.md?)
10. Verify trace propagation (traceId/spanId/requestId in logger calls?)
11. Show me the audit results"
```

**Why this works:** Catches compliance issues after implementation. **CRITICAL:** Always verify ALL Step 5 requirements from `.cursor/rules/01-enforcement.mdc`, including:
- File paths match monorepo structure (apps/, libs/, frontend/)
- Imports use correct paths (@verofield/common/*)
- No old naming (VeroSuite, @verosuite/*)
- Tenant isolation (if database queries)
- Date compliance (current system date, not hardcoded)
- Bug logging (.cursor/BUG_LOG.md)
- Engineering decisions (docs/engineering-decisions.md)
- Trace propagation (traceId/spanId/requestId)

### 3. REWARD_SCORE CI Automation Compliance

**Before submitting a PR, verify REWARD_SCORE compliance per .cursor/rules/00-master.mdc:**

```
"Please verify REWARD_SCORE compliance per .cursor/rules/00-master.mdc:
- Will this PR get a good REWARD_SCORE? (Check rubric: .cursor/reward_rubric.yaml)
- Are tests added/updated? (Required for positive score)
- Is documentation updated? (Required for positive score)
- Are there any security issues? (Will cause negative score - see 03-security.mdc)
- Are workflow triggers correct? (Run .cursor/scripts/validate_workflow_triggers.py)
- Are artifact names consistent? (reward, frontend-coverage, backend-coverage)
- Will metrics be collected? (Verify collect_metrics.py will run)
- Will CI compute and publish REWARD_SCORE? (CI is source of truth per 00-master.mdc)
- Show me the expected score breakdown and CI integration"
```

**Score Thresholds (from 00-master.mdc):**
- Score < -3 + failing tests/security → BLOCK
- Score -3..3 → Require explicit @lead human review
- Score ≥ 6 → Eligible for pattern extraction
- Score ≤ 0 → Generate anti-pattern suggestions

**For CI workflow changes, always ask (per 00-master.mdc workflow requirements):**

```
"Please verify CI workflow compliance per .cursor/rules/00-master.mdc:
- Are workflow triggers correct? (MANDATORY: on: section with proper types)
- Do PR workflows include: types: [opened, synchronize, reopened]? (MANDATORY)
- Do workflow_run triggers match exact workflow names? (MANDATORY: case-sensitive)
- Do workflow names in workflow_run exist in .github/workflows/? (MANDATORY)
- Are artifact names consistent? (MANDATORY: reward, frontend-coverage, backend-coverage)
- Do cascading workflows verify parent completed successfully? (MANDATORY: conclusion == 'success')
- Are conditional logic thresholds correct? (score ≥ 6 for patterns, ≤ 0 for anti-patterns)
- Run .cursor/scripts/validate_workflow_triggers.py and show me results
- Show me the workflow trigger configuration and compliance with 00-master.mdc requirements"
```

**For metrics collection verification:**

```
"Please verify metrics collection:
- Will collect_metrics.py run after PR scoring?
- Is reward.json artifact uploaded?
- Will metrics be saved to docs/metrics/reward_scores.json?
- Are aggregates calculated correctly? (total_prs, average_score, distribution, trends)
- Will dashboard update automatically?
- Show me the metrics collection workflow"
```

**For dashboard compliance:**

```
"Please verify dashboard compliance:
- Does dashboard.html load reward_scores.json correctly?
- Are filters working? (date range, author, category, score range)
- Are charts rendering? (distribution, trends, category performance)
- Is anti-patterns table populated?
- Are trace IDs included in any server-side logging? (if applicable)
- Show me the dashboard functionality"
```

### 4. Leverage Path-Based Rule Routing

**The rules system automatically loads rules based on file paths. Verify routing is working:**

```
"Please identify which rules apply to this file based on path-based routing:
- Which .mdc rule files are loaded for this file path?
- Which agent from .cursor/agents.json should handle this task?
- Show me the rule routing configuration for this file"
```

**Example routing (from 00-master.mdc):**
- `apps/api/**/*.ts` → Loads 08-backend.mdc, 06-error-resilience.mdc, 07-observability.mdc
- `frontend/**/*.{ts,tsx}` → Loads 09-frontend.mdc, 13-ux-consistency.mdc
- `.github/workflows/**` → Loads 11-operations.mdc
- `**/*.test.ts` → Loads 10-quality.mdc, 14-verification.mdc

**Always-included rules (regardless of path):**
- 00-master.mdc (supreme precedence)
- 01-enforcement.mdc (mandatory pipeline)
- 02-core.mdc (core philosophy)
- 03-security.mdc (security dominance)
- General patterns (`.cursor/patterns/*`)
- Security prompts (`.cursor/prompts/security_review.md`)

### 5. Use Specific Verification Prompts

**For bug fixes, always ask:**

```
"Please verify:
- Is this error pattern documented in docs/error-patterns.md?
- Is this bug logged in .cursor/BUG_LOG.md?
- Are regression tests created for this bug fix?
- Is structured logging used (logger.error, not console.error)?
- Are trace IDs propagated (traceId/spanId/requestId in logger calls)?
- Are there any silent failures (empty catch blocks)?
- Show me the pattern documentation, bug log entry, and tests"
```

**For significant new features/components, always ask:**

```
"Please verify:
- Is this engineering decision documented in docs/engineering-decisions.md?
- Are trace IDs propagated in all logger calls (traceId/spanId/requestId)?
- Is structured logging used throughout?
- Show me the engineering decision entry and trace propagation implementation"
```

**For trace propagation compliance:**

```
"Please verify trace propagation:
- Are all logger calls including traceId, spanId, and requestId?
- Is getOrCreateTraceContext() imported and used?
- Are trace IDs propagated across all error and info logs?
- Show me all logger calls with trace context"
```

**For date compliance:**

```
"Please verify date compliance:
- Are all dates using current system date (not hardcoded)?
- Is 'Last Updated' field using current date?
- Show me all date usages in the code"
```

**For error handling:**

```
"Please verify error handling compliance:
- Are all error-prone operations wrapped in try/catch?
- Are errors logged with structured logging (logger.error)?
- Are error messages contextual and actionable?
- Are there any silent failures (empty catch blocks)?
- Show me the error handling code"
```

### 6. Leverage Pattern System

**Before implementing, check for existing patterns:**

```
"Please check the pattern system:
- Search .cursor/patterns/ for relevant patterns
- Check .cursor/golden_patterns.md for pattern index
- Check .cursor/anti_patterns.md for patterns to avoid
- Check .cursor/BUG_LOG.md for similar past issues
- Show me which patterns apply to this task"
```

**For high-score PRs (REWARD_SCORE ≥ 6), pattern extraction may be triggered:**

```
"Please check if this PR is eligible for pattern extraction:
- Is REWARD_SCORE ≥ 6? (per 00-master.mdc)
- Should this implementation become a golden pattern?
- If yes, generate pattern template per @coach mode format"
```

**Pattern template format (from 00-master.mdc):**
```
Pattern: [Short name]
WHEN: [When to apply]
DO: [Implementation guidance]
WHY: [Principle]
EXAMPLE: path/to/file.ts#Lxx
METADATA: domain=[backend|frontend|infra|data], complexity=[simple|medium|complex], source_pr=#123
```

### 7. Security Compliance Verification (CRITICAL)

**Before any code change involving security, authentication, or database operations, use this prompt:**

**⚠️ CRITICAL:** Security rules (03-security.mdc) override all other rules when conflicts occur. Security violations are HARD STOPS.

```
"Please verify security compliance per .cursor/rules/03-security.mdc (security rules override all conflicts):
1. Tenant Isolation & RLS:
   - [ ] Is tenant_id verified before all database queries?
   - [ ] Are RLS policies enabled and tested?
   - [ ] Is tenant context set per request (SET LOCAL app.tenant_id)?
   - [ ] Is tenant_id extracted from JWT (never from request body/params)?
   - [ ] Is cross-tenant access prevented?
   - [ ] Show me all database queries and tenant isolation checks

2. Authentication & Authorization:
   - [ ] Is JWT validation implemented on all protected routes?
   - [ ] Are permissions checked at controller/service layer?
   - [ ] Is RBAC properly enforced?
   - [ ] Are user roles verified before allowing actions?
   - [ ] Show me authentication and authorization checks

3. Secrets Management:
   - [ ] Are all secrets in environment variables (not hardcoded)?
   - [ ] Is .env file in .gitignore?
   - [ ] Are JWT secrets strong (32+ characters, randomly generated)?
   - [ ] Are different secrets used for dev/staging/prod?
   - [ ] Are secrets never logged or exposed in errors?
   - [ ] Show me all secret usage and environment variable configuration

4. Input Validation & XSS Prevention:
   - [ ] Is all user input validated on backend?
   - [ ] Is HTML content sanitized before storage?
   - [ ] Are XSS vectors checked (script tags, javascript:, event handlers)?
   - [ ] Is dangerouslySetInnerHTML avoided or sanitized?
   - [ ] Are widget configs sanitized?
   - [ ] Show me input validation and sanitization code

5. Production Security (if deploying):
   - [ ] Are security headers configured (CSP, X-Frame-Options, etc.)?
   - [ ] Is rate limiting enabled?
   - [ ] Is CORS configured correctly (production domains only)?
   - [ ] Is HTTPS enforced?
   - [ ] Are OWASP security tests passing?
   - [ ] Show me security headers and production security configuration

6. Widget Security (if applicable):
   - [ ] Are widgets rendered in isolated iframes?
   - [ ] Is widget CSP configured?
   - [ ] Are widget manifests validated?
   - [ ] Is postMessage communication validated?
   - [ ] Is PII properly tagged?
   - [ ] Show me widget security implementation

Show me the security compliance report with file paths and line numbers"
```

**Why this works:** Ensures all security requirements from `.cursor/rules/03-security.mdc` are verified before code changes. Security rules have DOMINANCE over all other rules per 00-master.mdc.

**For database operations specifically:**

```
"Please verify database security compliance:
- [ ] Is tenant_id set before query (SET LOCAL app.tenant_id = <tenant_id>)?
- [ ] Is RLS enabled on all tenant-scoped tables?
- [ ] Are RLS policies tested for cross-tenant isolation?
- [ ] Is tenant context verified in all queries?
- [ ] Are Prisma queries using parameterized queries (never SQL concatenation)?
- [ ] Show me all database operations with tenant isolation verification"
```

**For authentication/authorization changes:**

```
"Please verify auth compliance:
- [ ] Is JWT secret strong and stored in environment variable?
- [ ] Is token validation implemented on every request?
- [ ] Are permissions checked at multiple layers?
- [ ] Is tenant_id extracted from validated JWT (never from client)?
- [ ] Is audit logging enabled for auth events?
- [ ] Show me JWT validation, permission checks, and audit logging"
```

**For API endpoints:**

```
"Please verify API security compliance:
- [ ] Is authentication required?
- [ ] Is authorization checked (RBAC)?
- [ ] Is tenant isolation enforced?
- [ ] Is input validation implemented?
- [ ] Is XSS prevention in place?
- [ ] Are errors sanitized (no sensitive data exposed)?
- [ ] Show me authentication, authorization, validation, and error handling"
```

**For production deployment:**

```
"Please verify production security readiness:
- [ ] Complete docs/PRODUCTION_SECURITY_CHECKLIST.md checklist
- [ ] Are security headers configured and tested?
- [ ] Is rate limiting enabled and tested?
- [ ] Is CORS configured for production domains only?
- [ ] Is HTTPS enforced?
- [ ] Are OWASP security tests passing?
- [ ] Is monitoring configured (Sentry, logging)?
- [ ] Are secrets stored in secure secret management?
- [ ] Show me production security configuration and test results"
```

**For widget development:**

```
"Please verify widget security compliance:
- [ ] Is widget rendered in isolated iframe?
- [ ] Is widget CSP configured correctly?
- [ ] Is widget manifest validated (widget_id, entry_point, config_schema)?
- [ ] Is postMessage origin validated?
- [ ] Is widget config sanitized before storage?
- [ ] Is PII properly tagged (if applicable)?
- [ ] Show me widget security implementation and validation"
```

**For OWASP security testing:**

```
"Please verify OWASP security testing:
- [ ] Are injection attack tests present (SQL, NoSQL, command)?
- [ ] Are broken authentication tests present?
- [ ] Are XSS tests present (stored, reflected, DOM-based)?
- [ ] Are security misconfiguration tests present?
- [ ] Are tests in apps/api/test/security/owasp-security.test.ts?
- [ ] Do tests cover all new endpoints/features?
- [ ] Show me OWASP test coverage and results"
```

**Security red flags to watch for:**

```
"Please check for security violations:
- [ ] Any hardcoded secrets or credentials?
- [ ] Any database queries without tenant_id?
- [ ] Any RLS policies bypassed?
- [ ] Any client-provided tenant_id trusted?
- [ ] Any authentication checks skipped?
- [ ] Any input validation missing?
- [ ] Any XSS vectors introduced?
- [ ] Any secrets logged or exposed?
- [ ] Any cross-tenant data access possible?
- [ ] Show me any security violations found"
```

### 8. Watch for Red Flags

**Stop and intervene if you see (per 01-enforcement.mdc HARD STOPS):**

**File Path Violations (04-architecture.mdc):**
- ❌ Using `backend/src/` instead of `apps/api/src/`
- ❌ Using `backend/prisma/` instead of `libs/common/prisma/`
- ❌ Creating files in wrong directory
- ❌ Cross-service relative imports (use libs/common instead)

**Component Duplication (02-core.mdc):**
- ❌ Creating component that already exists
- ❌ Not checking `frontend/src/components/ui/` first

**Security Violations (03-security.mdc - HARD STOP):**
- ❌ Database queries without `tenantId` filter
- ❌ Bypassing RLS policies
- ❌ Not validating tenant context
- ❌ Client-provided tenant_id trusted
- ❌ Secrets hardcoded in source code
- ❌ .env files committed to version control
- ❌ Authentication checks skipped
- ❌ Input validation missing
- ❌ XSS vectors introduced (dangerouslySetInnerHTML without sanitization)
- ❌ Secrets logged or exposed in error messages
- ❌ Cross-tenant data access possible

**Pattern Violations (02-core.mdc):**
- ❌ Creating custom form pattern instead of using standard
- ❌ Not using `CustomerSearchSelector` for customer fields
- ❌ Not following established component patterns

**Date Violations (02-core.mdc - CRITICAL):**
- ❌ Hardcoding dates (e.g., "2025-01-27" instead of checking current date)
- ❌ Using old dates in "Last Updated" fields
- ❌ Not updating "Last Updated" when modifying documentation

**Enforcement Pipeline Violations (01-enforcement.mdc):**
- ❌ Code written without search phase shown
- ❌ No post-implementation audit performed
- ❌ Post-implementation audit that doesn't check ALL Step 5 requirements
- ❌ Bug fixed but no pattern documentation
- ❌ Bug fixed but no bug log entry in `.cursor/BUG_LOG.md`
- ❌ Bug fixed but no regression tests
- ❌ Significant feature but no engineering decision in `docs/engineering-decisions.md`

**Observability Violations (07-observability.mdc):**
- ❌ Logger calls without traceId/spanId/requestId (trace propagation missing)
- ❌ `console.log` instead of structured logger
- ❌ Empty catch blocks (silent failures per 06-error-resilience.mdc)

**CI/Reward Score Violations (00-master.mdc, 11-operations.mdc):**
- ❌ CI workflow changes without trigger validation
- ❌ Workflow artifacts with inconsistent naming
- ❌ PR changes that will result in negative REWARD_SCORE without addressing issues
- ❌ Metrics collection not configured for new workflows

**When you see a red flag, ask:**

```
"Please stop. I detected a rule violation: [describe violation].
This violates: [rule file and section].
Please fix this violation and re-audit the file.
Show me the corrected code and compliance verification."
```

### 9. Use the Compliance Checklist

**After implementation, use this standard verification checklist:**

```
"Please verify compliance with the following:

✅ Error Handling:
- [ ] All error-prone operations have try/catch
- [ ] Structured logging used (logger.error, not console.error)
- [ ] Error messages are contextual and actionable
- [ ] No silent failures (empty catch blocks)

✅ Pattern Learning:
- [ ] Error pattern documented in docs/error-patterns.md (if bug fix)
- [ ] Regression tests created (if bug fix)
- [ ] Prevention strategies applied

✅ Code Quality (02-core.mdc, 04-architecture.mdc):
- [ ] TypeScript types are correct (no unnecessary 'any')
- [ ] Imports use correct paths (@verofield/common/*)
- [ ] File paths match monorepo structure (apps/, libs/, frontend/)
- [ ] No old naming (VeroSuite, @verosuite/*)
- [ ] No cross-service relative imports
- [ ] Shared code in libs/common/ (not duplicated)

✅ Security (03-security.mdc - DOMINANT, overrides all conflicts):
- [ ] Tenant isolation maintained (if database operations)
  - [ ] tenant_id verified before all database queries
  - [ ] RLS policies enabled and tested
  - [ ] tenant_id extracted from JWT (never from request body/params)
  - [ ] Cross-tenant access prevented
- [ ] Authentication & Authorization:
  - [ ] JWT validation on all protected routes
  - [ ] Permissions checked at controller/service layer
  - [ ] RBAC properly enforced
- [ ] Secrets Management:
  - [ ] All secrets in environment variables (not hardcoded)
  - [ ] .env file in .gitignore
  - [ ] JWT secrets strong (32+ characters)
  - [ ] Secrets never logged or exposed
- [ ] Input Validation & XSS Prevention:
  - [ ] All user input validated on backend
  - [ ] HTML content sanitized before storage
  - [ ] XSS vectors checked (script tags, javascript:, event handlers)
  - [ ] dangerouslySetInnerHTML avoided or sanitized
- [ ] Production Security (if deploying):
  - [ ] Security headers configured (CSP, X-Frame-Options, etc.)
  - [ ] Rate limiting enabled
  - [ ] CORS configured correctly
  - [ ] HTTPS enforced
  - [ ] OWASP security tests passing
- [ ] Widget Security (if applicable):
  - [ ] Widgets rendered in isolated iframes
  - [ ] Widget CSP configured
  - [ ] Widget manifests validated
  - [ ] postMessage communication validated

✅ Documentation:
- [ ] 'Last Updated' field uses current date (not hardcoded)
- [ ] No hardcoded dates in documentation
- [ ] Code comments reference patterns when applicable

✅ Testing:
- [ ] Regression tests created (if bug fix)
- [ ] Error paths have tests
- [ ] Tests prevent pattern regressions

✅ Observability (07-observability.mdc):
- [ ] Structured logging with required fields (level, message, timestamp, traceId, tenantId)
- [ ] Trace IDs propagated in ALL logger calls (traceId, spanId, requestId)
- [ ] No console.log in production code (use structured logger)
- [ ] Trace IDs propagated across service boundaries
- [ ] Critical path instrumentation present

✅ Error Resilience (06-error-resilience.mdc):
- [ ] All error-prone operations wrapped in try/catch
- [ ] No silent failures (empty catch blocks, swallowed promises)
- [ ] Errors logged with structured logging (logger.error)
- [ ] Error messages are contextual and actionable
- [ ] No raw system errors sent to clients

✅ Bug Logging (if bug fix):
- [ ] Bug logged in `.cursor/BUG_LOG.md` with date, area, description, status, owner, notes
- [ ] Bug status marked as 'fixed' if resolved
- [ ] Notes include fix details and related documentation

✅ Engineering Decisions (if significant feature):
- [ ] Decision documented in `docs/engineering-decisions.md`
- [ ] Includes context, trade-offs, alternatives considered, rationale
- [ ] Includes implementation pattern and lessons learned
- [ ] 'Last Updated' field uses current date

✅ REWARD_SCORE CI Automation (00-master.mdc, 11-operations.mdc):
- [ ] Workflow triggers validated (`.cursor/scripts/validate_workflow_triggers.py` passes)
- [ ] Artifact names consistent (MANDATORY: reward, frontend-coverage, backend-coverage)
- [ ] Workflow_run dependencies verified (parent workflow names match exactly, case-sensitive)
- [ ] Conditional logic implemented (score ≥ 6 for patterns, ≤ 0 for anti-patterns)
- [ ] Metrics collection configured (collect_metrics.py will run)
- [ ] Expected REWARD_SCORE calculated (check rubric: `.cursor/reward_rubric.yaml`)
- [ ] CI will compute and publish REWARD_SCORE (CI is source of truth)
- [ ] Dashboard will update (if metrics changed)

Show me the compliance report."
```

### 10. Quick Start Prompt

**For your next task, try this:**

```
"Please follow the mandatory 5-step enforcement pipeline from .cursor/rules/01-enforcement.mdc:
1. Search & Discovery (show all search results)
2. Pattern Analysis (identify pattern from .cursor/patterns/ or similar code)
3. Rule Compliance Check (verify all applicable rules based on file paths)
4. Implementation Plan (list files to create/modify)
5. Post-Implementation Audit (audit ALL files touched)

Show me each step as you complete it, including which rules apply (00-master, 01-enforcement, 03-security, etc.). After implementation, perform a complete post-implementation audit."
```

**This ensures:**
- All mandatory searches are completed (Step 1)
- Patterns are identified from .cursor/patterns/ or similar implementations (Step 2)
- Rules are checked based on path-based routing (Step 3)
- Implementation is planned with file list (Step 4)
- Files are audited for all compliance requirements (Step 5)
- Path-based rule routing is active (rules load based on file patterns)

### 11. Recommended Workflow

**For every task:**

1. **Start with:** "Please follow the mandatory 5-step enforcement pipeline from .cursor/rules/01-enforcement.mdc and show me each step, including which rules apply"
2. **During Implementation:** Monitor for red flags (Section 6)
3. **After Implementation:** "Please perform complete post-implementation audit per Step 5 of 01-enforcement.mdc and show me the results"
4. **Before Accepting:** "Please provide compliance report showing all Step 5 requirements verified"

**For bug fixes specifically:**

1. **Before Fix:** "Please search docs/error-patterns.md for similar patterns"
2. **After Fix:**
   - "Please document this error pattern in docs/error-patterns.md"
   - "Please log this bug in .cursor/BUG_LOG.md with all required fields"
   - "Please create regression tests for this bug fix"
   - "Please verify error handling compliance"
   - "Please verify trace propagation (traceId/spanId/requestId in logger calls)"
3. **Verification:** "Please show me the pattern documentation, bug log entry, and regression tests"

**For significant new features/components:**

1. **After Implementation:**
   - "Please document this engineering decision in docs/engineering-decisions.md"
   - "Please verify trace propagation in all logger calls"
   - "Please verify all Step 5 post-implementation audit requirements from .cursor/rules/01-enforcement.mdc"
   - "Please verify REWARD_SCORE compliance (expected score, workflow triggers, metrics collection)"
2. **Verification:** "Please show me the engineering decision entry, trace propagation implementation, and REWARD_SCORE compliance"

**For CI workflow changes:**

1. **Before Changes:**
   - "Please run .cursor/scripts/validate_workflow_triggers.py and show me current status"
2. **After Changes:**
   - "Please run .cursor/scripts/validate_workflow_triggers.py and verify it passes"
   - "Please verify artifact names are consistent (reward, frontend-coverage, backend-coverage)"
   - "Please verify workflow_run triggers match exact workflow names"
   - "Please verify conditional logic (score thresholds)"
3. **Verification:** "Please show me the validation results and workflow configuration"

### 12. Pro Tips

1. **Leverage Path-Based Routing:** Rules load automatically based on file paths (e.g., `apps/api/**` loads 08-backend.mdc). Ask "Which rules apply to this file?" to verify routing.

2. **Be Explicit:** Don't assume Cursor will follow rules automatically - explicitly request compliance checks and show each step.

3. **Show, Don't Tell:** Ask Cursor to "show me" rather than just "verify" - this makes compliance visible and verifiable.

4. **Use Checklists:** Copy-paste the checklists from `.cursor/rules/01-enforcement.mdc` Step 5 to ensure nothing is missed.

5. **Verify After Changes:** Always request post-implementation audit after code changes - this is mandatory per 01-enforcement.mdc.

6. **Check ALL Step 5 Requirements:** Don't accept partial audits - explicitly request verification of ALL Step 5 requirements from `.cursor/rules/01-enforcement.mdc` including:
   - File paths match monorepo structure (apps/, libs/, frontend/)
   - Imports use correct paths (@verofield/common/*)
   - No old naming (VeroSuite, @verosuite/*)
   - Tenant isolation (if database queries)
   - Date compliance (current system date, not hardcoded)
   - Bug logging (`.cursor/BUG_LOG.md`)
   - Engineering decisions (`docs/engineering-decisions.md`)
   - Trace propagation (traceId/spanId/requestId in logger calls)

7. **Security First:** Security rules (03-security.mdc) override all conflicts. Always verify security compliance first.

8. **Pattern System:** For bug fixes, check `.cursor/patterns/` and `.cursor/anti_patterns.md` first. High-score PRs (≥6) may generate new patterns.

9. **REWARD_SCORE Awareness:** Before PRs, verify expected score using `.cursor/reward_rubric.yaml`. CI is source of truth per 00-master.mdc.

10. **Multi-Agent System:** Understand which agent handles your task (see `.cursor/agents.json`). Each agent loads specific rule subsets.

11. **Iterate Prompts:** If compliance is low, refine prompts based on feedback. Start with Quick Start Prompt (Section 8), then iterate.

12. **Monitor Metrics:** Regularly check REWARD_SCORES and dashboards - this catches 80% of drifts early per user reports.

13. **Avoid Overload:** Keep prompts focused (<10 items per prompt). Use separate prompts for security, CI, and compliance.

14. **Test Incrementally:** Apply rules to one domain first (e.g., security), then expand. This prevents context bloat.

### 13. Verify Rules Are Being Applied

**To verify the rules system is working correctly, ask:**

```
"Please show me:
- Which rules are currently active for this file? (path-based routing)
- Which agent from .cursor/agents.json is handling this task?
- Which rule files (.mdc) are loaded?
- Are there any rule conflicts? (security rules should override)
- Show me the rule precedence hierarchy"
```

**Expected behavior:**
- Rules load automatically based on file paths
- Multiple rules can be active simultaneously (additive routing)
- Security rules (03-security.mdc) override conflicts
- Enforcement pipeline (01-enforcement.mdc) is always active
- Pattern system is checked before implementing new code

**If rules aren't being followed:**
1. Explicitly reference the rule file: "Please follow .cursor/rules/01-enforcement.mdc Step 1"
2. Request step-by-step visibility: "Show me each step as you complete it"
3. Use the Quick Start Prompt (Section 10) to enforce the pipeline
4. Check for rule conflicts: "Are there any conflicts between rules? Security should override"

### 14. Reference Documentation

For detailed compliance guidance, see:

**Rule Files (.cursor/rules/*.mdc):**
- `.cursor/rules/00-master.mdc` - Supreme precedence, CI integration, pattern system, REWARD_SCORE
- `.cursor/rules/01-enforcement.mdc` - Mandatory 5-step enforcement pipeline
- `.cursor/rules/02-core.mdc` - Core philosophy, date handling, tech stack, prohibited actions
- `.cursor/rules/03-security.mdc` - Security dominance (overrides all conflicts)
- `.cursor/rules/04-architecture.mdc` - Monorepo structure, service boundaries
- `.cursor/rules/05-data.mdc` - Data contracts, state machines, layer synchronization
- `.cursor/rules/06-error-resilience.mdc` - Error handling, no silent failures
- `.cursor/rules/07-observability.mdc` - Structured logging, tracing, metrics
- `.cursor/rules/08-backend.mdc` - NestJS, Prisma patterns
- `.cursor/rules/09-frontend.mdc` - React/React Native architecture
- `.cursor/rules/10-quality.mdc` - Testing, coverage, performance
- `.cursor/rules/11-operations.mdc` - CI/CD, workflows, deployments
- `.cursor/rules/12-tech-debt.mdc` - Tech debt logging, TODO/FIXME handling
- `.cursor/rules/13-ux-consistency.mdc` - UI/UX coherence
- `.cursor/rules/14-verification.mdc` - Verification & testing standards

**System Documentation:**
- `.cursor/README.md` - Complete rules system overview
- `.cursor/agents.json` - Multi-agent system routing
- `.cursor/reward_rubric.yaml` - REWARD_SCORE calculation weights
- `.cursor/golden_patterns.md` - Pattern index
- `.cursor/anti_patterns.md` - Anti-patterns to avoid
- `.cursor/BUG_LOG.md` - Historical bug patterns

**Additional Guides:**
- `docs/ENSURING_AI_COMPLIANCE.md` - Extended compliance guide with examples
- `docs/error-resilience.md` - Error handling requirements
- `docs/pattern-learning.md` - Pattern documentation requirements
- `docs/predictive-prevention.md` - Regression test requirements
- `docs/observability.md` - Structured logging requirements
