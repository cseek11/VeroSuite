# Cursor: Engineering Swarm — Optimized Rules (Cursor-native, CI-driven, Modular)

## RULE PRECEDENCE
This file (`.cursor/rules.md`) supersedes and overrides every other rule file in `.cursor/rules/` unless another section inside this file explicitly delegates control. If any legacy directive conflicts with guidance here, Cursor must obey this file first.

## VERSION & CHANGE CONTROL
- **Version:** 1.0 (2025-11-17)  
- **Change Log:** Track updates in `docs/architecture/cursor_rules_upgrade.md#changelog`.  
- **Emergency Override (`@emergency_override`)**: If a unified rule causes critical breakage, include `@emergency_override:<rule-id>:<expires YYYY-MM-DD>` in a PR description. Cursor must treat the flagged rule as paused until the expiration (max 7 days) or manual removal. All overrides require approval from a Rules Champion and must be logged in `docs/architecture/cursor_rules_upgrade.md`.

## NAMESPACE CONSOLIDATION
- All sections in this document form the **“VeroForge Unified Rules”** namespace.
- Existing files under `.cursor/rules/*` form the **“Legacy Ruleset.”**
- When instructions conflict, apply “VeroForge Unified Rules” and treat the “Legacy Ruleset” as supplemental context only.

## PURPOSE
These rules define how Cursor should behave in this workspace for:
- PR evaluation and REWARD_SCORE integration (CI as source-of-truth).
- Role-based guidance (modular prompts) for review, testing, coaching, distillation.
- Pattern application (human-reviewed, version-controlled).
- Safety, security, and routing.
- Clear human-in-the-loop for pattern extraction and automation.

Cursor MUST follow these rules unless the user explicitly overrides them.

---

## GLOBAL PRINCIPLES (applies to all modes)
- Prefer correctness & safety over automation.
- CI is the authoritative source for computed artifacts (REWARD_SCORE, coverage, static-analysis outputs).
- Never hallucinate file paths, PR numbers, or metrics. If uncertain, state you cannot find them and list closest matches.
- Always cite real file paths when referencing code (e.g., `src/auth/token_manager.py`).
- Prefer human-in-the-loop for knowledge updates (pattern creation, distillation) until patterns reach stable quality.
- Reference repository-specific guardrails from `AI_CONSISTENCY_PROTOCOL.md`, `DEVELOPMENT_BEST_PRACTICES.md`, and security policies captured in `.cursor/rules/security.md`.

---

## FILES / FOLDERS THIS RULES FILE RELIES ON
- `.cursor/prompts/` (role prompts; modular)
- `.cursor/patterns/` (golden patterns, validated)
- `.cursor/golden_patterns.md` (index + metadata)
- `.cursor/anti_patterns.md` (logged anti-patterns)
- `.cursor/BUG_LOG.md` (manual bug log)
- `.cursor/reward_rubric.yaml` (score weights & conditions)
- `.cursor/DEPRECATED_RULES.md` (migration tracker)
- `.cursor/scripts/` (`compute_reward_score.py`, `extract_patterns.py`, `suggest_patterns.py`, `reindex_embeddings.py`)
- `.cursor/ci/reward_score_comment_template.md`
- CI outputs (PR comment or artifact with REWARD_SCORE and breakdown JSON)

---

## ROUTING & MODE SELECTION (TRIAGER)
Cursor should load multiple modes additively depending on context:
1. Inspect file paths / PR description / tags.
2. Always include:
   - general patterns (`.cursor/patterns/*`)
   - security rules (`.cursor/prompts/security_review.md`)
   - testing rules (`.cursor/prompts/tester.md`) if code changed
3. Add specialized modes:
   - Backend: `backend/`, `src/api/`, `src/services/`, `*.ts`, `*.py`, `*.go` → `distill_backend.md`
   - Frontend: `frontend/`, `src/components/`, `*.tsx`, `*.jsx` → `distill_frontend.md`
   - Infra: `infra/`, `deploy/`, `k8s/`, `*.tf`, `.github/workflows/` → `distill_infra.md`
   - Data: `pipelines/`, `*.sql`, `airflow/`, analytics folders → `distill_data.md`
4. If multiple areas match, load all relevant prompts (routing is additive, not exclusive).
5. If no path matches, default to `@lead` prompt (`.cursor/prompts/lead_review.md`).

---

## MODULAR PROMPTS (HOW TO USE)
Cursor delegates behaviour to prompt files inside `.cursor/prompts/`. `rules.md` orchestrates and loads prompts; prompts are authoritative for each role and must define:
- Required output format (machine-parseable first, human-friendly second).
- Fail-safe lines like: `If data missing, say "MISSING: <what>"`.
- Explicit citation requirements.

Required prompt files:
- `.cursor/prompts/lead_review.md`
- `.cursor/prompts/tester.md`
- `.cursor/prompts/coach.md`
- `.cursor/prompts/distill_backend.md`
- `.cursor/prompts/distill_frontend.md`
- `.cursor/prompts/distill_infra.md`
- `.cursor/prompts/distill_data.md`
- `.cursor/prompts/security_review.md`

---

## @LEAD — PR REVIEW MODE (CI-ASSISTED)
**Trigger:** `cursor chat "review PR #<n>"` or CI comment.

**Workflow:**
1. Read CI-supplied REWARD_SCORE comment/artifact if present.
2. If no CI score, ask for CI outputs or compute a *draft* score using local analysis and label it `DRAFT`.
3. Required output (machine-friendly + human readable):

```
REWARD_SCORE: X/10 (source: CI | DRAFT)
Breakdown:
tests: +3
bug_fix: +2
docs: +1
penalties: -2

Assessment:
<2–4 sentences>

Actionable Feedback:
- ...
- ...

Decision:
APPROVE / REQUEST_CHANGES / BLOCK
```

**Rules:**
- If CI score < -3 and CI indicates failing tests/security issues → BLOCK and request changes.
- If REWARD_SCORE is borderline (-3..3) → require explicit `@lead` human review tag for merge.
- Always document references to CI artifacts or attach `reward_score_comment_template.md`.

---

## @TESTER — TEST GENERATION MODE
**Trigger:** Code changes in non-test files or explicit request.

**Deliverables per change set:**
- 3–6 unit tests covering happy path, edge cases, and error cases.
- Mocks/fixtures when external services involved.
- Coverage delta report (approximate) and files to add.
- Test suggestions must point to exact file paths & test file template (e.g., `backend/tests/test_auth_token.ts`).

---

## @COACH — PATTERN EXTRACTION (HUMAN-IN-THE-LOOP)
**Trigger:** High-score PR (CI REWARD_SCORE ≥ 6) or manual invocation.

Template:
```
Pattern: [Short name]
WHEN: [When to apply]
DO: [Implementation guidance]
WHY: [Principle]
EXAMPLE: path/to/file.ts#Lxx
METADATA: domain=[backend|frontend|infra|data], complexity=[simple|medium|complex], source_pr=#123
```

**Human step:** A senior engineer reviews candidate pattern before it's committed to `.cursor/patterns/`.

**Automation note:** CI may run `scripts/extract_patterns.py` to suggest patterns, but commits must be human-approved.

---

## DISTILLATION AGENTS (IN-PROMPT)
Cursor uses distilled knowledge from:
- `.cursor/patterns/` (primary)
- `.cursor/golden_patterns.md` (index)
- `.cursor/anti_patterns.md` (failures)
- `.cursor/BUG_LOG.md`

Distillation is prompt-driven (no model fine-tuning). Additions to these files immediately change agent outputs.

---

## PATTERN MANAGEMENT RULES
- Patterns are authoritative only after a human reviewer merges the pattern file via PR.
- Pattern file naming: `NNN_domain_short-name.md` (e.g., `001_backend_circuit_breaker.md`).
- Each pattern must include metadata (`created_at`, `author`, `source_pr`, `domain`, `complexity`).
- Maintain `.cursor/golden_patterns.md` as the canonical index.
- Anti-patterns for low-scoring PRs go into `.cursor/anti_patterns.md` plus `.cursor/BUG_LOG.md`.

---

## ANTI-PATTERN & BUG LOGGING
- Low-score PRs (CI REWARD_SCORE ≤ 0) produce anti-pattern suggestions.
- CI or reviewers append entries to `.cursor/anti_patterns.md` and `.cursor/BUG_LOG.md`.
- Every entry includes detection context, remediation guidance, and follow-up owner.

---

## SECURITY RULES (NON-NEGOTIABLE)
Cursor must refuse to produce code that:
- Exposes PII or secrets.
- Stores credentials in source code.
- Demonstrates insecure cryptography or SQL concatenation.
- Suggests disabling authentication or auditing.

For requests needing bypasses, respond with a refusal and outline safe alternatives. Cross-reference `.cursor/rules/security.md` for domain-specific requirements; unified rules override on conflicts.

---

## CONTEXT RETRIEVAL & FALLBACKS
When the user asks for internal knowledge:
1. Attempt semantic search across source code, `.cursor/patterns/`, `.cursor/prompts/`.
2. If semantic search omits `.cursor/patterns/*`, explicitly load relevant pattern files (fallback).
3. If a referenced file/artifact is not found, return `MISSING: <file>` and provide nearest matches.

---

## CI INTEGRATION (SOURCE OF TRUTH)
- CI steps must compute and publish:
  - `REWARD_SCORE` (with breakdown JSON or PR comment).
  - Test coverage summary (JSON).
  - Static analysis results (JSON).
- Cursor reads PR comments or artifacts with the key `SWARM_SCORE_JSON` or the standard reward template.
- Required workflows live in `.github/workflows/` and may call scripts in `.cursor/scripts/`.
- Any manual computation must be labeled `DRAFT`.

### Workflow Trigger Requirements
- **MANDATORY:** All workflows must have `on:` section with appropriate triggers.
- **MANDATORY:** PR workflows must include: `types: [opened, synchronize, reopened]`.
- **MANDATORY:** `workflow_run` triggers must match exact workflow names (case-sensitive).
- **MANDATORY:** Workflow names in `workflow_run` must exist in `.github/workflows/`.
- **MANDATORY:** Artifact names must be consistent across workflows (standard names: `reward`, `frontend-coverage`, `backend-coverage`).
- **MANDATORY:** Cascading workflows must verify parent workflow completed successfully.
- **MANDATORY:** Conditional logic (score thresholds) must be implemented for pattern extraction and anti-pattern detection.

---

## METRICS & OBSERVABILITY
Cursor expects:
- REWARD_SCORE distribution dashboards.
- Agent human-edit rate metrics.
- Pattern adoption counts.
- Anti-pattern recurrence reports.

If data is missing, surface `MISSING: <metric>` in outputs.

---

## HUMAN OVERRIDES & ESCALATION
- `@lead` humans may override CI-computed REWARD_SCORE (CID stored in DB/PR comment).
- Changes to `.cursor/patterns/` must be through PR reviewed by a Swarm Champion.
- Security/infra code requires explicit human approval before merge (document in PR).
- Any override or emergency suspension must be logged in `docs/architecture/cursor_rules_upgrade.md`.

---

## VERSIONING, ROLLBACK & REQUIRED APPROVALS
- Patterns and rules live in git; rollback = `git revert`.
- Automated scripts modifying `.cursor/*` must create a PR for human review.
- PRs touching `rules.md` or any file in `.cursor/rules/*` require approval from the designated Rules Champion list in `docs/architecture/cursor_rules_upgrade.md`.

---

## SAFEGUARDS & VALIDATION
- CI validates required files exist (prompts, patterns, scripts). Failing checks block merges.
- Conflict-detection automation scans legacy files for overlapping directives and opens issues/PR comments.
- Testing harness (documented in `docs/architecture/cursor_rules_upgrade.md`) must be run after major rule changes to verify routing and precedence behavior.
- `DEPRECATED_RULES.md` tracks reconciliation progress for each legacy document.

---

## LEGACY RULE COMPATIBILITY
Cursor must continue to load the existing `.cursor/rules/*` documents. However, if a legacy file conflicts with instructions in this `rules.md`:
- Treat the legacy file as legacy guidance.
- Follow the newer rule defined here (VeroForge Unified Rules).
Document reconciled files in `.cursor/DEPRECATED_RULES.md` and update CI conflict flags.

---

## ENSURING COMPLIANCE: BEST PROMPTS FOR USERS

This section provides proven prompt templates that ensure Cursor follows all rules. Use these prompts to maximize compliance.

### 1. Request Explicit Workflow Completion (Most Effective)

**Before any task, use this prompt:**

```
"Please follow .cursor/rules/01-enforcement.mdc completely:
1. Step 1: Complete mandatory search phase (show results)
2. Step 2: Pattern analysis (identify pattern)
3. Step 3: Rule compliance check
4. Step 4: Implementation plan
5. Step 5: Post-implementation audit

Show me each step as you complete it."
```

**Why this works:** Makes each step visible and verifiable.

### 2. Request Post-Implementation Audit (Critical)

**After any code changes, ask:**

```
"Please perform Step 5 post-implementation audit per .cursor/rules/01-enforcement.mdc:
1. Audit ALL files touched for code compliance
2. Verify file paths correct (monorepo structure: apps/, libs/)
3. Verify imports use correct paths (@verofield/common/*)
4. Verify no old naming (VeroSuite, @verosuite/*)
5. Verify tenant isolation (if database queries)
6. Verify date compliance (current system date, not hardcoded)
7. Verify structured logging used (not console.log)
8. Verify no silent failures (empty catch blocks, swallowed promises)
9. Verify trace propagation (traceId/spanId/requestId in all logger calls)
10. Verify bug logged in .cursor/BUG_LOG.md (if bug fix)
11. Verify error pattern documented in docs/error-patterns.md (if bug fix)
12. Verify anti-pattern logged in .cursor/anti_patterns.md (if REWARD_SCORE ≤ 0)
13. Show me the complete audit results"
```

**Why this works:** Catches compliance issues after implementation. **CRITICAL:** Always verify ALL Step 5 requirements from `.cursor/rules/01-enforcement.mdc`.

### 3. REWARD_SCORE CI Automation Compliance

**Before submitting a PR, verify REWARD_SCORE compliance:**

```
"Please verify REWARD_SCORE compliance per .cursor/rules/11-operations.mdc:
- Will this PR get a good REWARD_SCORE? (Check rubric: .cursor/reward_rubric.yaml)
- Are tests added/updated? (Required for positive score)
- Is documentation updated? (Required for positive score)
- Are there any security issues? (Will cause negative score)
- Are workflow triggers correct? (on: section with proper types)
- Are artifact names consistent? (reward, frontend-coverage, backend-coverage)
- Will metrics be collected?
- Show me the expected score breakdown"
```

**For CI workflow changes, always ask:**

```
"Please verify CI workflow compliance per .cursor/rules/11-operations.mdc:
- Are workflow triggers correct? (on: section with proper types)
- Do workflow_run triggers match exact workflow names? (case-sensitive)
- Are artifact names consistent? (standard names: reward, frontend-coverage, backend-coverage)
- Does workflow verify parent completed successfully? (conclusion == 'success')
- Are conditional logic thresholds correct? (score ≥ 6 for patterns, ≤ 0 for anti-patterns)
- Show me the workflow trigger configuration"
```

**For OPA policy evaluation (v2.1):**

```
"Please verify OPA policy compliance:
- Are all relevant policies evaluated? (security, architecture, data-integrity, etc.)
- Is policy evaluation time <200ms per policy?
- Is total OPA time <2s?
- Are policies consolidated appropriately?
- Show me the OPA evaluation results"
```

**For compliance dashboard (v2.1):**

```
"Please verify compliance dashboard will update:
- Will violation data be collected?
- Are rule IDs correctly mapped?
- Will severity levels be recorded?
- Will trends be calculated?
- Show me the compliance data structure"
```

### 4. Use Specific Verification Prompts

**For bug fixes, always ask:**

```
"Please verify bug fix compliance per .cursor/rules/01-enforcement.mdc Step 5:
- Is this error pattern documented in docs/error-patterns.md?
- Is this bug logged in .cursor/BUG_LOG.md with all required fields?
- Are regression tests created for this bug fix?
- Is structured logging used (logger.error, not console.error)?
- Are trace IDs propagated (traceId/spanId/requestId in logger calls)?
- Are there any silent failures (empty catch blocks, swallowed promises)?
- Show me the pattern documentation, bug log entry, and tests"
```

**For database operations, always ask:**

```
"Please verify security compliance per .cursor/rules/03-security.mdc:
- Are all database queries including tenantId filter?
- Is RLS context set correctly?
- Are tenant isolation checks present?
- Show me the database query code with tenant filtering"
```

**For trace propagation compliance:**

```
"Please verify trace propagation per .cursor/rules/07-observability.mdc:
- Are all logger calls including traceId, spanId, and requestId?
- Are trace IDs propagated across service boundaries?
- Are trace IDs propagated in error and info logs?
- Show me all logger calls with trace context"
```

**For date compliance:**

```
"Please verify date compliance per .cursor/rules/02-core.mdc:
- Are all dates using current system date (not hardcoded)?
- Is 'Last Updated' field using current date?
- Format: ISO 8601 (YYYY-MM-DD)?
- Show me all date usages in the code"
```

**For error handling:**

```
"Please verify error handling compliance per .cursor/rules/06-error-resilience.mdc:
- Are all error-prone operations wrapped in try/catch?
- Are errors logged with structured logging (logger.error)?
- Are error messages contextual and actionable?
- Are there any silent failures (empty catch blocks, swallowed promises)?
- Show me the error handling code"
```

**For file paths and imports:**

```
"Please verify file organization per .cursor/rules/04-architecture.mdc:
- Are files in correct monorepo paths (apps/, libs/, not backend/)?
- Are imports using correct paths (@verofield/common/*)?
- Is there any old naming (VeroSuite, @verosuite/*)?
- Show me the file paths and import statements"
```

### 5. Watch for Red Flags

**Stop and intervene if you see:**

- ❌ Code written without search phase shown (Step 1 violation)
- ❌ Wrong file paths (backend/src/ instead of apps/api/src/)
- ❌ Old naming (VeroSuite, @verosuite/*)
- ❌ Bug fixed but no pattern documentation (docs/error-patterns.md)
- ❌ Bug fixed but no bug log entry (.cursor/BUG_LOG.md)
- ❌ Bug fixed but no regression tests
- ❌ Logger calls without traceId/spanId/requestId (trace propagation missing)
- ❌ `console.log` instead of structured logger
- ❌ Empty catch blocks (silent failures)
- ❌ Swallowed promises (.catch(() => {}))
- ❌ Hardcoded dates instead of current system date
- ❌ Database queries without tenantId filter
- ❌ No post-implementation audit performed
- ❌ Post-implementation audit that doesn't check ALL Step 5 requirements from `.cursor/rules/01-enforcement.mdc`
- ❌ CI workflow changes without trigger validation
- ❌ Workflow artifacts with inconsistent naming
- ❌ PR changes that will result in negative REWARD_SCORE without addressing issues

**When you see a red flag, ask:**

```
"Please stop. I detected a rule violation: [describe violation].
This violates: [rule file and section, e.g., .cursor/rules/03-security.mdc].
Please fix this violation and re-audit the file.
Show me the corrected code and compliance verification."
```

### 6. Use the Compliance Checklist

**After implementation, use this standard verification checklist:**

```
"Please verify Step 5 compliance per .cursor/rules/01-enforcement.mdc:

✅ File Structure & Organization:
- [ ] File paths correct (apps/api/src/, libs/common/, not backend/)
- [ ] Imports use correct paths (@verofield/common/*)
- [ ] No old naming (VeroSuite, @verosuite/*)
- [ ] File organization compliance verified
- [ ] No duplicate components created

✅ Security (03-security.mdc):
- [ ] Tenant isolation maintained (if database queries)
- [ ] No secrets hardcoded
- [ ] Input validation present
- [ ] Security boundaries maintained

✅ Error Handling (06-error-resilience.mdc):
- [ ] All error-prone operations have try/catch
- [ ] Structured logging used (logger.error, not console.error)
- [ ] Error messages are contextual and actionable
- [ ] No silent failures (empty catch blocks, swallowed promises)

✅ Observability (07-observability.mdc):
- [ ] Structured logging with required fields (message, context, traceId, operation, severity)
- [ ] Trace IDs propagated in ALL logger calls (traceId, spanId, requestId)
- [ ] Trace IDs propagated across service boundaries
- [ ] Critical path instrumentation present

✅ Code Quality:
- [ ] TypeScript types are correct (no unnecessary 'any')
- [ ] Following established patterns
- [ ] Tests pass (regression + preventative)
- [ ] All error paths have tests

✅ Documentation & Dates:
- [ ] Documentation updated with current date
- [ ] 'Last Updated' field uses current system date (not hardcoded)
- [ ] No hardcoded dates anywhere

✅ Bug Fixes (if applicable):
- [ ] Bug logged in .cursor/BUG_LOG.md (date, area, description, status, owner, notes)
- [ ] Error pattern documented in docs/error-patterns.md
- [ ] Regression tests created
- [ ] Prevention strategies applied

✅ Anti-Patterns (if REWARD_SCORE ≤ 0):
- [ ] Anti-pattern logged in .cursor/anti_patterns.md
- [ ] Root cause documented
- [ ] Prevention pattern identified

✅ CI/CD (if workflow changes):
- [ ] Workflow triggers validated
- [ ] Artifact names consistent (reward, frontend-coverage, backend-coverage)
- [ ] Conditional logic correct (score thresholds)

Show me the complete compliance report."
```

### 7. Quick Start Prompt

**For your next task, try this:**

```
"Please follow .cursor/rules/01-enforcement.mdc completely and show me each step as you complete it. After implementation, please perform Step 5 post-implementation audit and show me the results."
```

**This ensures:**
- All mandatory searches are completed (Step 1)
- Patterns are identified (Step 2)
- Rules are checked (Step 3)
- Implementation is planned (Step 4)
- Files are audited (Step 5)
- Compliance is verified

### 8. Recommended Workflow

**For every task:**

1. **Start with:** "Please follow .cursor/rules/01-enforcement.mdc completely and show me each step"
2. **During Implementation:** Monitor for red flags
3. **After Implementation:** "Please perform Step 5 post-implementation audit and show me the results"
4. **Before Accepting:** "Please provide compliance report"

**For bug fixes specifically:**

1. **Before Fix:** "Please search docs/error-patterns.md for similar patterns"
2. **After Fix:**
   - "Please document this error pattern in docs/error-patterns.md"
   - "Please log this bug in .cursor/BUG_LOG.md with all required fields"
   - "Please create regression tests for this bug fix"
   - "Please verify error handling compliance (06-error-resilience.mdc)"
   - "Please verify trace propagation (traceId/spanId/requestId in logger calls per 07-observability.mdc)"
3. **Verification:** "Please show me the pattern documentation, bug log entry, and regression tests"

**For significant new features/components:**

1. **After Implementation:**
   - "Please verify trace propagation in all logger calls (07-observability.mdc)"
   - "Please verify all Step 5 post-implementation audit requirements from .cursor/rules/01-enforcement.mdc"
   - "Please verify REWARD_SCORE compliance (expected score, workflow triggers, metrics collection)"
2. **Verification:** "Please show me the trace propagation implementation and REWARD_SCORE compliance"

**For CI workflow changes:**

1. **Before Changes:**
   - "Please verify current workflow trigger configuration (11-operations.mdc)"
2. **After Changes:**
   - "Please verify workflow triggers correct (on: section with proper types)"
   - "Please verify artifact names consistent (reward, frontend-coverage, backend-coverage)"
   - "Please verify workflow_run triggers match exact workflow names"
   - "Please verify conditional logic (score thresholds)"
3. **Verification:** "Please show me the workflow trigger configuration"

### 9. Pro Tips

1. **Be Explicit:** Don't assume Cursor will follow rules automatically - explicitly request compliance checks
2. **Show, Don't Tell:** Ask Cursor to "show me" rather than just "verify" - this makes compliance visible
3. **Use Checklists:** Copy-paste the checklists from `.cursor/rules/01-enforcement.mdc` to ensure nothing is missed
4. **Verify After Changes:** Always request Step 5 post-implementation audit after code changes
5. **Check ALL Step 5 Requirements:** Don't accept partial audits - explicitly request verification of ALL Step 5 requirements from `.cursor/rules/01-enforcement.mdc` including:
   - File paths (apps/, libs/, not backend/)
   - Imports (@verofield/common/*, not @verosuite/*)
   - Old naming detection (VeroSuite, @verosuite/*)
   - Tenant isolation (if database operations)
   - Bug logging (`.cursor/BUG_LOG.md`)
   - Error pattern documentation (`docs/error-patterns.md`)
   - Anti-pattern logging (`.cursor/anti_patterns.md` if REWARD_SCORE ≤ 0)
   - Trace propagation (traceId/spanId/requestId in logger calls)
6. **Document Patterns:** For every bug fix, explicitly request pattern documentation AND bug log entry
7. **Log Bugs:** For every bug fixed, explicitly request bug logging in `.cursor/BUG_LOG.md`
8. **Verify Trace Propagation:** For every component with logging, explicitly verify traceId/spanId/requestId are included
9. **Test Everything:** For every bug fix, explicitly request regression tests
10. **Validate Workflows:** For every CI workflow change, explicitly verify workflow triggers
11. **Check REWARD_SCORE:** Before submitting PRs, explicitly verify expected score using `.cursor/reward_rubric.yaml`
12. **Verify Artifacts:** For every workflow, explicitly verify artifact names match standard conventions
13. **Check Metrics:** For every PR, explicitly verify metrics collection will work correctly

### 10. Reference Documentation

For detailed compliance guidance, see:
- `.cursor/rules/01-enforcement.mdc` - Complete mandatory workflow checklist (5-step pipeline)
- `.cursor/rules/02-core.mdc` - Core philosophy, date handling, tech stack
- `.cursor/rules/03-security.mdc` - Security rules (tenant isolation, RLS, auth)
- `.cursor/rules/04-architecture.mdc` - Monorepo structure, service boundaries
- `.cursor/rules/05-data.mdc` - Data contracts, state machines, layer sync
- `.cursor/rules/06-error-resilience.mdc` - Error handling, no silent failures
- `.cursor/rules/07-observability.mdc` - Structured logging, tracing, metrics
- `.cursor/rules/08-backend.mdc` - NestJS/Prisma patterns
- `.cursor/rules/09-frontend.mdc` - React/React Native architecture
- `.cursor/rules/10-quality.mdc` - Testing, coverage, performance
- `.cursor/rules/11-operations.mdc` - CI/CD, workflows, reward score
- `.cursor/rules/12-tech-debt.mdc` - Tech debt logging, TODO/FIXME
- `.cursor/rules/13-ux-consistency.mdc` - UI/UX coherence
- `.cursor/rules/14-verification.mdc` - Verification & testing standards
- `docs/developer/VeroField_Rules_2.1.md` - Complete v2.1 implementation plan

---

## END OF RULES

