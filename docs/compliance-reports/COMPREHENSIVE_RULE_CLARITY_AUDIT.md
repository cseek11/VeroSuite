# Comprehensive Rule Clarity Audit Report

**Date:** 2025-12-05  
**Purpose:** Complete audit of all rule clarity issues, including previous findings and additional patterns  
**Status:** ⚠️ **19 ISSUES IDENTIFIED** (1 fixed, 18 open)

---

## Executive Summary

After comprehensive auditing of all rule files, documentation, and compliance reports, **19 patterns** were identified with similar clarity issues:

**Fixed (1):**
- ✅ Bug Logging - Rules updated, enforcement added

**Open Issues (18):**
- **Critical (3):** Testing Requirements, Breaking Changes, Security Review Triggers
- **High (4):** Engineering Decisions, Layer Synchronization, Documentation Updates, Configuration Changes
- **Medium (8):** Tech Debt Logging, State Machine Docs, Contract Documentation, Performance Impact, Error Handling Standards, Rollback Plans, Scope Creep, Enforcement Drift
- **Low (3):** Dependency Changes, Audit Logging, Definition Debt

**Meta-Patterns Found:**
- "If Applicable" Problem - Found in 8+ rules
- Step 5 Verification Gap - Missing enforcement in 12+ rules
- Ambiguous Mandatory Status - "should" vs "must" confusion
- Scope Creep Pattern - Rules that started narrow but need expansion
- Enforcement Drift Pattern - Step 5 checks exist but aren't enforced as HARD STOP
- Definition Debt Pattern - Terms used but never defined

---

## Part 1: Previous Audit Findings (Included)

This section includes the findings from `docs/compliance-reports/RULE_CLARITY_AUDIT_REPORT.md`:

### Issue 0: Bug Logging (✅ FIXED)

**Status:** ✅ **RESOLVED** - Rules updated on 2025-12-05

**Original Problem:**
- Rules mentioned `BUG_LOG.md` but didn't clearly state when bugs must be logged
- Only mentioned low-score PRs (REWARD_SCORE ≤ 0)
- No enforcement in Step 5 (Post-Implementation Audit)
- Bugs were documented in `error-patterns.md` but not logged in `BUG_LOG.md`

**Impact:**
- 8 bugs documented in `error-patterns.md` but not logged in `BUG_LOG.md`
- 3 bugs from compliance reports not logged
- 3 anti-patterns not logged

**Fix Applied:**
- Added explicit "BUG FIX DOCUMENTATION REQUIREMENTS" section to `.cursor/rules/00-master.mdc`
- Added mandatory checks to Step 5 in `.cursor/rules/01-enforcement.mdc`
- Clarified file purposes and relationships
- Updated `docs/error-pattern-guide.md` with dual-requirement

**New Requirements:**
- ALL bug fixes require BOTH `error-patterns.md` (detailed) AND `BUG_LOG.md` (concise)
- Step 5 now verifies both entries exist
- Missing entries = compliance violation (HARD STOP)

**Related Documentation:**
- `docs/compliance-reports/BUG_LOGGING_RULE_INVESTIGATION.md` - Investigation report
- `docs/compliance-reports/RULE_UPDATES_BUG_LOGGING.md` - Rule updates summary
- `docs/compliance-reports/BUG_AND_ANTI_PATTERN_CONSOLIDATION_REPORT.md` - Consolidation report

**Lessons Learned:**
- Rules must explicitly state mandatory requirements
- Enforcement checks must be in Step 5
- File purposes and relationships must be clearly defined
- Ambiguous conditionals ("if applicable") cause compliance gaps

---

### Issue 1: Engineering Decisions Documentation

**Severity:** High  
**Status:** ⚠️ OPEN

**Current State:**

**Rules Mention:**
- `.cursor/rules/01-enforcement.mdc` Step 1: "MUST search `docs/engineering-decisions.md` for relevant decisions"
- `.cursor/rules/agent-instructions.mdc` Step 1: Same requirement

**What's Missing:**
- ❌ No clear rule stating WHEN decisions MUST be documented
- ❌ No enforcement in Step 5 (Post-Implementation Audit)
- ❌ Ambiguous about what constitutes a "significant" decision

**Documentation Says:**
- `docs/engineering-decisions.md`: "Every significant architectural or design decision should be documented here"
- But "significant" is not defined

**Compliance Reports Show:**
- Multiple compliance reports flag missing engineering decision documentation
- Examples: Migration decisions, architectural changes, pattern decisions

**Recommended Fix:**
- Add explicit "ENGINEERING DECISIONS DOCUMENTATION REQUIREMENTS" section
- Define "significant decision" with clear criteria
- Add Step 5 enforcement check

---

### Issue 2: Tech Debt Logging

**Severity:** Medium  
**Status:** ⚠️ OPEN

**Current State:**

**Rules Mention:**
- `.cursor/rules/12-tech-debt.mdc`: "All meaningful debt must be logged in `docs/tech-debt.md`"
- `.cursor/rules/01-enforcement.mdc` Step 3: "MUST verify tech debt logged (if applicable)"
- `.cursor/rules/10-quality.mdc`: "If you knowingly introduce or touch tech debt: Log/update it in `docs/tech-debt.md`"

**What's Missing:**
- ❌ "If applicable" is ambiguous - when is it applicable?
- ❌ "Meaningful debt" is not defined
- ❌ No clear enforcement in Step 5

**Recommended Fix:**
- Define "if applicable" and "meaningful debt" explicitly
- Add Step 5 enforcement check
- Provide decision tree for when logging is required

---

### Issue 3: Layer Synchronization Enforcement

**Severity:** High  
**Status:** ⚠️ OPEN

**Current State:**

**Rules Mention:**
- `.cursor/rules/05-data.mdc`: "LAYER SYNCHRONIZATION RULE" - lists what must be updated
- `.cursor/rules/01-enforcement.mdc` Step 1: "MUST check layer synchronization needs"
- `.cursor/rules/01-enforcement.mdc` Step 2: "MUST verify layer synchronization patterns"

**What's Missing:**
- ❌ No explicit check in Step 5 to verify synchronization was completed
- ❌ Rules say "you must" but don't enforce verification

**Recommended Fix:**
- Add explicit Step 5 verification for layer synchronization
- Make it a HARD STOP violation if synchronization incomplete

---

### Issue 4: State Machine Documentation

**Severity:** Medium  
**Status:** ⚠️ OPEN

**Current State:**

**Rules Mention:**
- `.cursor/rules/05-data.mdc`: "For stateful entities (e.g., WorkOrder, Invoice, Payment): Must have a state machine doc"
- `.cursor/rules/01-enforcement.mdc` Step 1: "MUST search for state machine documentation (if stateful component)"
- `.cursor/rules/01-enforcement.mdc` Step 2: "MUST verify state machine pattern matches existing implementations (if stateful)"

**What's Missing:**
- ❌ "If stateful" is ambiguous - what makes something stateful?
- ❌ No clear rule stating when state machine docs MUST be created
- ❌ No enforcement in Step 5 to verify docs exist/updated

**Recommended Fix:**
- Define "stateful entity" explicitly with examples
- Add Step 5 enforcement check
- Clarify when creation is mandatory vs optional

---

### Issue 5: Contract Documentation

**Severity:** Medium  
**Status:** ⚠️ OPEN

**Current State:**

**Rules Mention:**
- `.cursor/rules/05-data.mdc`: "Events: `docs/contracts/events/*.md`"
- `.cursor/rules/01-enforcement.mdc` Step 1: "MUST search for contract definitions (if schema changes)"
- `.cursor/rules/01-enforcement.mdc` Step 2: "MUST verify contract patterns match existing implementations (if schema changes)"

**What's Missing:**
- ❌ "If schema changes" is too narrow - contracts needed for more than schema changes
- ❌ No clear rule stating when contracts MUST be created/updated
- ❌ No enforcement in Step 5 to verify contracts updated

**Recommended Fix:**
- Expand scope beyond "schema changes" to include API/event changes
- Add Step 5 enforcement check
- Define when contract documentation is mandatory

---

## Part 2: Additional Patterns Identified

### Issue 6: Testing Requirements ⚠️ CRITICAL

**Severity:** Critical  
**Status:** ⚠️ OPEN

**Current State:**

**Rules Mention:**
- `.cursor/rules/10-quality.mdc`: "New features: MUST have unit tests. SHOULD have integration tests if DB/API involved."
- `.cursor/rules/14-verification.mdc`: "Unit Tests (MANDATORY for new features)" - Target: ≥ 80% coverage
- `.cursor/rules/01-enforcement.mdc` Step 5: "MUST verify tests pass (regression + preventative)"

**What's Missing:**
- ❌ "MUST have unit tests" but no clear enforcement in Step 5
- ❌ "SHOULD have integration tests" - when is it mandatory?
- ❌ No clear rule about when tests can be skipped
- ❌ Coverage requirement (≥ 80%) not verified in Step 5
- ❌ No distinction between proof-of-concept, scripts, and production code

**Questions Unanswered:**
- When can you skip tests? (never? proof-of-concept? scripts?)
- What coverage is required? (unit? integration? e2e?)
- Are test updates verified in Step 5?
- What about test-only changes? (refactoring tests)

**Example Ambiguity:**
```markdown
Current: "Write comprehensive tests"
Better: "MANDATORY: All new features require unit tests (min 80% coverage) and integration tests"
```

**Recommended Fix:**

**Add to `.cursor/rules/10-quality.mdc`:**

```markdown
## TESTING REQUIREMENTS (MANDATORY)

**MANDATORY:** All code changes require appropriate tests unless explicitly exempted.

### When Tests are Required

1. **New Features:**
   - ✅ MANDATORY: Unit tests (≥ 80% coverage for new code)
   - ✅ MANDATORY: Integration tests (if DB/API involved)
   - ✅ RECOMMENDED: E2E tests (for critical workflows)

2. **Bug Fixes:**
   - ✅ MANDATORY: Regression tests that reproduce the bug

3. **Refactoring:**
   - ✅ MANDATORY: All existing tests must pass
   - ✅ RECOMMENDED: Add tests for uncovered paths

### When Tests Can Be Skipped

**Exemptions (must be documented in PR):**
- Documentation-only changes
- Config-only changes (`.env.example`, `package.json` scripts)
- Test file refactoring (test-only changes)
- Proof-of-concept code (must be marked with `// POC: [reason]`)

**Never Skip Tests For:**
- Production code changes
- Bug fixes
- New features
- Security-related changes
- Database schema changes

### Coverage Requirements
- **New code:** ≥ 80% coverage (unit tests)
- **Modified code:** Maintain or improve existing coverage
- **Critical paths:** 100% coverage (auth, payments, tenant isolation)

**Enforcement:**
- Step 5 (Post-Implementation Audit) MUST verify:
  - Tests exist for all new/modified code (unless exempted)
  - Coverage meets requirements (≥ 80% for new code)
  - Regression tests exist for bug fixes
  - All tests pass
- Missing tests = compliance violation (HARD STOP)
```

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
- [ ] **MUST** verify tests exist for new/modified code (unless exempted) ⭐ **NEW**
- [ ] **MUST** verify test coverage meets requirements (≥ 80% for new code) ⭐ **NEW**
- [ ] **MUST** verify regression tests exist for bug fixes ⭐ **NEW**
- [ ] **MUST** verify all tests pass ⭐ **ENHANCED**
```

---

### Issue 7: Breaking Changes Documentation ⚠️ CRITICAL

**Severity:** Critical  
**Status:** ⚠️ OPEN

**Current State:**

**Rules Mention:**
- `.cursor/rules/00-master.mdc`: "VERSIONING, ROLLBACK & REQUIRED APPROVALS" - mentions versioning but no breaking change rules
- `.cursor/rules/05-data.mdc`: Mentions contracts but no breaking change documentation
- No explicit rule about identifying/documenting breaking changes

**What's Missing:**
- ❌ No clear rule about identifying breaking changes
- ❌ No migration guide requirements
- ❌ No API versioning strategy
- ❌ No notification requirements for API consumers
- ❌ No version bump requirements

**Questions Unanswered:**
- When must breaking changes be flagged?
- When are migration guides mandatory?
- How are API consumers notified?
- Version bump requirements?
- What constitutes a "breaking change"?

**Recommended Fix:**

**Add to `.cursor/rules/00-master.mdc`:**

```markdown
## BREAKING CHANGES DOCUMENTATION REQUIREMENTS

**MANDATORY:** When introducing breaking changes, you MUST document them and provide migration guidance.

### What Constitutes a Breaking Change

1. **API Changes:**
   - Removing endpoints
   - Changing request/response schemas
   - Changing authentication requirements
   - Changing error response formats
   - Removing or renaming fields

2. **Database Changes:**
   - Removing columns
   - Changing column types
   - Removing tables
   - Changing constraints
   - Breaking foreign key relationships

3. **Configuration Changes:**
   - Removing environment variables
   - Changing required configuration
   - Changing default values (if relied upon)

4. **Behavioral Changes:**
   - Changing business logic outcomes
   - Changing validation rules
   - Changing default behaviors

### Documentation Requirements

1. **Breaking Change Flag:**
   - Mark PR with `[BREAKING]` tag
   - Document in PR description
   - List affected consumers/modules

2. **Migration Guide:**
   - File: `docs/migrations/[feature]-migration.md`
   - Include:
     - What changed
     - Why it changed
     - Step-by-step migration instructions
     - Code examples (before/after)
     - Rollback instructions

3. **Version Bump:**
   - Semantic versioning: MAJOR.MINOR.PATCH
   - Breaking changes = MAJOR version bump
   - Document in CHANGELOG.md

4. **Consumer Notification:**
   - Update API documentation
   - Notify affected teams (if applicable)
   - Provide deprecation timeline (if gradual migration)

**Enforcement:**
- Step 5 (Post-Implementation Audit) MUST verify:
  - Breaking changes identified and flagged
  - Migration guide created (if breaking change)
  - Version bumped appropriately
  - Documentation updated
- Missing documentation = compliance violation (HARD STOP)
```

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
- [ ] **MUST** verify breaking changes identified and documented (if applicable) ⭐ **NEW**
- [ ] **MUST** verify migration guide created (if breaking change) ⭐ **NEW**
- [ ] **MUST** verify version bumped appropriately (if breaking change) ⭐ **NEW**
```

---

### Issue 8: Security Review Triggers ⚠️ CRITICAL

**Severity:** Critical  
**Status:** ⚠️ OPEN

**Current State:**

**Rules Mention:**
- `.cursor/rules/03-security.mdc`: Comprehensive security rules but no review trigger points
- `.cursor/rules/00-master.mdc`: "Security/infra code requires explicit human approval before merge"
- `.cursor/prompts/security_review.md`: Security reviewer prompt exists

**What's Missing:**
- ❌ No clear rule about WHEN security review is mandatory
- ❌ "Security/infra code" is not defined
- ❌ No process for documenting security reviews
- ❌ No enforcement in Step 5

**Questions Unanswered:**
- When is security review mandatory?
  - Auth changes?
  - New endpoints?
  - Data exposure?
  - Third-party integrations?
- Who reviews?
- How is it documented?

**Recommended Fix:**

**Add to `.cursor/rules/03-security.mdc`:**

```markdown
## SECURITY REVIEW REQUIREMENTS

**MANDATORY:** When making security-sensitive changes, you MUST undergo security review.

### When Security Review is Required

1. **Authentication & Authorization:**
   - Changes to JWT handling
   - Changes to RBAC/permissions
   - New authentication methods
   - Changes to session management

2. **Data Exposure:**
   - New endpoints exposing sensitive data
   - Changes to data filtering/redaction
   - New PII handling
   - Changes to audit logging

3. **Input Validation:**
   - New user input endpoints
   - Changes to validation logic
   - New file upload endpoints
   - Changes to sanitization

4. **Third-Party Integrations:**
   - New external API integrations
   - Changes to API key handling
   - New OAuth providers
   - Changes to external service authentication

5. **Infrastructure:**
   - Changes to RLS policies
   - Database permission changes
   - Network configuration changes
   - Secret management changes

### Review Process

1. **Flag for Review:**
   - Mark PR with `[SECURITY]` tag
   - Request review from security team
   - Document security considerations in PR description

2. **Review Documentation:**
   - Document review findings in PR comments
   - Log security review in `docs/security-reviews/[date]-[feature].md`
   - Include: Reviewer, findings, approvals, concerns

3. **Approval Required:**
   - Security review must be approved before merge
   - Critical issues must be resolved before merge
   - Non-critical issues can be tracked as follow-up

**Enforcement:**
- Step 5 (Post-Implementation Audit) MUST verify:
  - Security review completed (if applicable)
  - Security review documented
  - All security concerns addressed
- Missing review = compliance violation (HARD STOP)
```

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
- [ ] **MUST** verify security review completed (if security-sensitive changes) ⭐ **NEW**
- [ ] **MUST** verify security review documented (if applicable) ⭐ **NEW**
```

---

### Issue 9: Documentation Updates ⚠️ HIGH PRIORITY

**Severity:** High  
**Status:** ⚠️ OPEN

**Current State:**

**Rules Mention:**
- `.cursor/rules/01-enforcement.mdc` Step 5: "MUST verify documentation updated with current date"
- `.cursor/rules/agent-instructions.mdc` Step 5: Same requirement
- No clear rule about WHEN documentation must be updated

**What's Missing:**
- ❌ No clear rule about when README.md must be updated
- ❌ No enforcement for keeping docs in sync with code
- ❌ No rule about API documentation regeneration
- ❌ No rule about architecture diagram updates

**Questions Unanswered:**
- When must README.md be updated?
- When must API documentation be regenerated?
- When must architecture diagrams be updated?
- Are documentation updates verified in Step 5?

**Recommended Fix:**

**Add to `.cursor/rules/00-master.mdc`:**

```markdown
## DOCUMENTATION UPDATE REQUIREMENTS

**MANDATORY:** When making code changes, you MUST update relevant documentation.

### When Documentation Updates are Required

1. **README.md Updates:**
   - New features requiring setup/configuration
   - Changes to installation process
   - Changes to environment variables
   - Changes to API endpoints
   - Changes to deployment process

2. **API Documentation:**
   - New endpoints
   - Modified endpoints (request/response changes)
   - Breaking changes
   - Authentication changes

3. **Architecture Documentation:**
   - New services/modules
   - Changes to service boundaries
   - Changes to data flow
   - Changes to infrastructure

4. **Code Documentation:**
   - Public API changes (JSDoc/TSDoc)
   - Complex logic requiring explanation
   - Configuration changes

### Documentation Types

**Living Documentation (Must Stay in Sync):**
- README.md (setup, installation, quick start)
- API documentation (OpenAPI/Swagger)
- Architecture diagrams (if code structure changes)
- Environment variable documentation (`.env.example`)

**Reference Documentation (Can Lag):**
- Design documents (historical reference)
- Planning documents (completed features)
- Legacy documentation (deprecated features)

**Enforcement:**
- Step 5 (Post-Implementation Audit) MUST verify:
  - README.md updated (if applicable)
  - API documentation updated (if endpoints changed)
  - Architecture docs updated (if structure changed)
  - Code comments updated (if public API changed)
- Missing updates = compliance violation
```

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
- [ ] **MUST** verify README.md updated (if setup/installation changed) ⭐ **ENHANCED**
- [ ] **MUST** verify API documentation updated (if endpoints changed) ⭐ **NEW**
- [ ] **MUST** verify architecture docs updated (if structure changed) ⭐ **NEW**
```

---

### Issue 10: Configuration Changes ⚠️ HIGH PRIORITY

**Severity:** High  
**Status:** ⚠️ OPEN

**Current State:**

**Rules Mention:**
- `.cursor/rules/03-security.mdc`: "ALWAYS create `env.example` template files"
- `.cursor/rules/11-operations.mdc`: Mentions deployment rules but no config change documentation
- No clear rule about documenting config changes

**What's Missing:**
- ❌ No rule about when `.env.example` must be updated
- ❌ No rule about documenting config changes
- ❌ No rule about deployment doc updates
- ❌ No enforcement in Step 5

**Questions Unanswered:**
- When must `.env.example` be updated?
- When must deployment docs be updated?
- Are config changes verified in Step 5?

**Recommended Fix:**

**Add to `.cursor/rules/03-security.mdc`:**

```markdown
## CONFIGURATION CHANGE DOCUMENTATION

**MANDATORY:** When adding or modifying configuration, you MUST update documentation.

### When Configuration Documentation is Required

1. **Environment Variables:**
   - New environment variables
   - Changed variable names
   - Changed default values
   - Changed required vs optional status

2. **Configuration Files:**
   - New configuration files
   - Changed configuration structure
   - Changed configuration options

3. **Deployment Configuration:**
   - Changes to deployment requirements
   - Changes to infrastructure needs
   - Changes to service dependencies

### Documentation Requirements

1. **`.env.example` Updates:**
   - Add all new environment variables
   - Update changed variables
   - Include comments explaining purpose
   - Mark required vs optional

2. **Deployment Documentation:**
   - Update deployment guides
   - Document new configuration steps
   - Update setup instructions

3. **Configuration Documentation:**
   - Document in README.md or dedicated config docs
   - Explain purpose and impact
   - Provide examples

**Enforcement:**
- Step 5 (Post-Implementation Audit) MUST verify:
  - `.env.example` updated (if env vars changed)
  - Deployment docs updated (if deployment changed)
  - Configuration documented
- Missing updates = compliance violation
```

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
- [ ] **MUST** verify `.env.example` updated (if environment variables changed) ⭐ **NEW**
- [ ] **MUST** verify deployment documentation updated (if deployment changed) ⭐ **NEW**
```

---

### Issue 11: Performance Impact Documentation ⚠️ MEDIUM PRIORITY

**Severity:** Medium  
**Status:** ⚠️ OPEN

**Current State:**

**Rules Mention:**
- `.cursor/rules/10-quality.mdc`: Performance budgets defined but no documentation requirement
- `.cursor/rules/01-enforcement.mdc` Step 3: "MUST verify performance characteristics analyzed"
- No rule about documenting performance implications

**What's Missing:**
- ❌ No rule about when performance impact must be documented
- ❌ No rule about when benchmarking is required
- ❌ No enforcement in Step 5

**Questions Unanswered:**
- When must performance impact be assessed?
  - Database query changes?
  - Loop additions?
  - N+1 query risks?
- When is benchmarking required?

**Recommended Fix:**

**Add to `.cursor/rules/10-quality.mdc`:**

```markdown
## PERFORMANCE IMPACT DOCUMENTATION

**MANDATORY:** When making changes that may impact performance, you MUST document the impact.

### When Performance Documentation is Required

1. **Database Changes:**
   - New queries (especially in loops)
   - Query modifications (adding joins, filters)
   - Missing indexes
   - N+1 query risks

2. **Algorithm Changes:**
   - New loops or nested loops
   - Algorithm complexity changes
   - Large data processing

3. **API Changes:**
   - New endpoints
   - Changes to response sizes
   - Changes to caching behavior

4. **Frontend Changes:**
   - New components with heavy rendering
   - Changes to bundle size
   - New dependencies

### Documentation Requirements

1. **Performance Analysis:**
   - Document expected impact
   - Identify potential bottlenecks
   - Note if within performance budgets

2. **Benchmarking (When Required):**
   - For critical paths
   - For changes exceeding budgets
   - For new algorithms
   - Document benchmark results

3. **Mitigation:**
   - Document optimization strategies
   - Note if performance debt accepted
   - Track in tech-debt.md if needed

**Enforcement:**
- Step 5 (Post-Implementation Audit) MUST verify:
  - Performance impact analyzed (if applicable)
  - Performance documented (if significant impact)
  - Benchmarks run (if required)
- Missing analysis = compliance violation
```

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
- [ ] **MUST** verify performance impact analyzed and documented (if applicable) ⭐ **NEW**
```

---

### Issue 12: Error Handling Standards ⚠️ MEDIUM PRIORITY

**Severity:** Medium  
**Status:** ⚠️ OPEN

**Current State:**

**Rules Mention:**
- `.cursor/rules/06-error-resilience.mdc`: Comprehensive error handling rules
- `.cursor/rules/01-enforcement.mdc` Step 3: "MUST verify error handling blocks present"
- `.cursor/rules/01-enforcement.mdc` Step 5: "MUST verify all error paths have tests"

**What's Missing:**
- ❌ No rule about when custom error classes must be created
- ❌ No rule about user-facing vs technical error messages
- ❌ No enforcement for error message standards

**Questions Unanswered:**
- When must custom error classes be created?
- When must error messages be user-facing vs technical?
- Are error handling patterns verified in Step 5?

**Recommended Fix:**

**Add to `.cursor/rules/06-error-resilience.mdc`:**

```markdown
## ERROR HANDLING STANDARDS

**MANDATORY:** All errors must follow consistent patterns and standards.

### Custom Error Classes

**When to Create:**
- Domain-specific errors (e.g., `WorkOrderNotFoundError`)
- Errors requiring special handling
- Errors with specific error codes
- Errors used across multiple modules

**When to Use Standard Errors:**
- Generic validation errors → `BadRequestException`
- Generic not found → `NotFoundException`
- Generic unauthorized → `UnauthorizedException`

### Error Message Standards

**User-Facing Messages (Frontend/API responses):**
- ✅ Concise and actionable
- ✅ No technical details
- ✅ No stack traces
- ✅ No internal IDs
- Example: "Unable to save work order. Please check required fields."

**Technical Messages (Logs):**
- ✅ Include full context
- ✅ Include traceId
- ✅ Include error codes
- ✅ Include stack traces (in logs, not responses)
- Example: "WorkOrderService.save failed [traceId: abc123] [errorCode: WO_SAVE_001]"

**Enforcement:**
- Step 5 (Post-Implementation Audit) MUST verify:
  - Error messages are user-appropriate
  - Technical details not exposed to users
  - Custom error classes used when appropriate
  - Error handling patterns consistent
- Violations = compliance violation
```

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
- [ ] **MUST** verify error messages are user-appropriate (no technical details exposed) ⭐ **NEW**
- [ ] **MUST** verify custom error classes used when appropriate ⭐ **NEW**
```

---

### Issue 13: Rollback Plans ⚠️ MEDIUM PRIORITY

**Severity:** Medium  
**Status:** ⚠️ OPEN

**Current State:**

**Rules Mention:**
- `.cursor/rules/11-operations.mdc`: "Rollback strategy documented for each environment"
- `.cursor/rules/00-master.mdc`: "VERSIONING, ROLLBACK & REQUIRED APPROVALS" - mentions rollback but no requirements
- No clear rule about when rollback plans are mandatory

**What's Missing:**
- ❌ No rule about when rollback plans must be documented
- ❌ No rule about where rollback plans are stored
- ❌ No enforcement in Step 5

**Questions Unanswered:**
- When are rollback plans mandatory?
  - Database migrations?
  - Feature flags?
  - Infrastructure changes?
- Where are they documented?

**Recommended Fix:**

**Add to `.cursor/rules/11-operations.mdc`:**

```markdown
## ROLLBACK PLAN REQUIREMENTS

**MANDATORY:** When making changes that are difficult to reverse, you MUST document rollback procedures.

### When Rollback Plans are Required

1. **Database Migrations:**
   - Schema changes
   - Data migrations
   - Constraint changes

2. **Feature Flags:**
   - New features behind flags
   - Gradual rollouts
   - A/B tests

3. **Infrastructure Changes:**
   - Deployment changes
   - Configuration changes
   - Service dependencies

4. **Breaking Changes:**
   - API changes
   - Behavioral changes
   - Data format changes

### Rollback Plan Requirements

1. **Documentation:**
   - File: `docs/rollbacks/[feature]-rollback.md` or in PR description
   - Include:
     - Steps to rollback
     - Data preservation strategy
     - Service restart requirements
     - Verification steps

2. **Testing:**
   - Test rollback procedure in staging
   - Verify data integrity after rollback
   - Document any rollback limitations

**Enforcement:**
- Step 5 (Post-Implementation Audit) MUST verify:
  - Rollback plan documented (if applicable)
  - Rollback plan tested (if critical)
- Missing plan = compliance violation
```

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
- [ ] **MUST** verify rollback plan documented (if difficult-to-reverse changes) ⭐ **NEW**
```

---

### Issue 14: Dependency Changes ⚠️ MEDIUM PRIORITY

**Severity:** Medium  
**Status:** ⚠️ OPEN

**Current State:**

**Rules Mention:**
- `.cursor/rules/01-enforcement.mdc` Step 1: "MUST check for existing dependencies (if adding new dependency)"
- `.cursor/rules/agent-instructions.mdc`: "Add dependencies without analysis" in prohibited list
- No clear rule about documenting dependency changes

**What's Missing:**
- ❌ No rule about when dependency changes must be logged
- ❌ No rule about documenting security implications
- ❌ No rule about tracking breaking changes from dependencies

**Questions Unanswered:**
- When must dependency changes be logged?
- Security implications documented where?
- Breaking changes from dependencies tracked how?

**Recommended Fix:**

**Add to `.cursor/rules/00-master.mdc`:**

```markdown
## DEPENDENCY CHANGE DOCUMENTATION

**MANDATORY:** When adding, updating, or removing dependencies, you MUST document the change.

### When Documentation is Required

1. **New Dependencies:**
   - Document purpose and usage
   - Document security considerations
   - Document license compatibility

2. **Dependency Updates:**
   - Document version changes
   - Document breaking changes (if any)
   - Document security patches

3. **Dependency Removals:**
   - Document reason for removal
   - Document migration path (if applicable)

### Documentation Requirements

1. **PR Description:**
   - List all dependency changes
   - Explain why each change is needed
   - Note any breaking changes

2. **Security Considerations:**
   - Check for known vulnerabilities
   - Document security implications
   - Update security review if needed

3. **Breaking Changes:**
   - Document breaking changes from dependencies
   - Update code to handle breaking changes
   - Update tests if needed

**Enforcement:**
- Step 5 (Post-Implementation Audit) MUST verify:
  - Dependency changes documented
  - Security implications considered
  - Breaking changes handled
- Missing documentation = compliance violation
```

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
- [ ] **MUST** verify dependency changes documented (if dependencies changed) ⭐ **NEW**
- [ ] **MUST** verify security implications considered (if new dependencies) ⭐ **NEW**
```

---

### Issue 15: Audit Logging ⚠️ LOW PRIORITY

**Severity:** Low  
**Status:** ⚠️ OPEN

**Current State:**

**Rules Mention:**
- `.cursor/rules/05-data.mdc`: "Emit audit logs on transitions" (for state machines)
- `.cursor/rules/03-security.mdc`: "ALWAYS maintain audit trail for permission changes"
- No broader audit logging requirements

**What's Missing:**
- ❌ No rule about audit logging beyond state changes
- ❌ No rule about what events must be logged
- ❌ No enforcement in Step 5

**Questions Unanswered:**
- When is audit logging mandatory beyond state changes?
- What events must be logged?
- Are audit log requirements verified in Step 5?

**Recommended Fix:**

**Add to `.cursor/rules/03-security.mdc`:**

```markdown
## AUDIT LOGGING REQUIREMENTS

**MANDATORY:** When making security-sensitive or business-critical changes, you MUST implement audit logging.

### When Audit Logging is Required

1. **Security Events:**
   - Authentication attempts (success/failure)
   - Permission changes
   - Role changes
   - Access to sensitive data

2. **Business Events:**
   - Financial transactions
   - Data exports
   - Configuration changes
   - User account changes

3. **State Transitions:**
   - WorkOrder status changes
   - Invoice status changes
   - Payment status changes
   - (Already covered in 05-data.mdc)

### Audit Log Requirements

1. **Log Content:**
   - Who (user ID, tenant ID)
   - What (action performed)
   - When (timestamp)
   - Where (resource ID, endpoint)
   - Why (if applicable - reason/justification)

2. **Storage:**
   - Immutable audit logs
   - Long-term retention
   - Searchable format

**Enforcement:**
- Step 5 (Post-Implementation Audit) MUST verify:
  - Audit logging implemented (if applicable)
  - Audit logs include required fields
- Missing logging = compliance violation
```

**Add to `.cursor/rules/01-enforcement.mdc` Step 5:**

```markdown
- [ ] **MUST** verify audit logging implemented (if security-sensitive changes) ⭐ **NEW**
```

---

### Issue 16: Scope Creep Pattern ⚠️ MEDIUM PRIORITY

**Severity:** Medium  
**Status:** ⚠️ OPEN

**Current State:**

**Pattern Description:**
Rules that started narrow but need expansion over time. Conditionals that were initially specific but have become too restrictive.

**Examples Found:**

1. **Contract Documentation:**
   - Current: "if schema changes"
   - Should be: "if API/schema/events change"
   - Impact: API changes and event changes not covered

2. **Layer Synchronization:**
   - Current: "if schema changes"
   - Should be: "if schema/DTOs/types/events change"
   - Impact: DTO-only changes might be missed

3. **State Machine Documentation:**
   - Current: "if stateful component"
   - Should be: "if stateful entity OR state transitions change"
   - Impact: Transition changes might not trigger documentation

4. **Documentation Updates:**
   - Current: "if applicable"
   - Should be: "if setup/API/architecture/config changes"
   - Impact: Unclear when documentation is required

**The Problem:**
- Rules written for specific scenarios
- Over time, similar scenarios emerge but aren't covered
- Conditionals become too narrow
- Creates compliance gaps

**Recommended Fix:**

**Add to `.cursor/rules/00-master.mdc`:**

```markdown
## SCOPE REVIEW REQUIREMENT

**MANDATORY:** When reviewing rules, check for scope creep - conditionals that may be too narrow.

### Scope Creep Indicators

1. **Narrow Conditionals:**
   - "if schema changes" → should consider: API, events, DTOs, types
   - "if stateful" → should consider: state transitions, lifecycle changes
   - "if applicable" → should be explicit about when it applies

2. **Review Process:**
   - When adding new rule, consider broader scope
   - When updating rule, check if conditional needs expansion
   - When finding compliance gap, check if scope is too narrow

3. **Expansion Criteria:**
   - If similar scenarios exist but aren't covered
   - If rule applies to subset but should apply to set
   - If conditional excludes related changes

**Enforcement:**
- During rule updates, review conditionals for scope
- Document scope decisions
- Update conditionals when gaps found
```

**Action Items:**
1. Review all "if [specific]" conditionals
2. Expand narrow conditionals to cover related scenarios
3. Document scope decisions
4. Add scope review to rule update process

---

### Issue 17: Enforcement Drift Pattern ⚠️ MEDIUM PRIORITY

**Severity:** Medium  
**Status:** ⚠️ OPEN

**Current State:**

**Pattern Description:**
Step 5 checks that exist but aren't enforced as HARD STOP violations. Checks are listed but have no consequences.

**Examples Found:**

1. **Documentation Updates:**
   - Step 5: "MUST verify documentation updated with current date"
   - But: No HARD STOP if missing
   - Impact: Documentation can drift without consequence

2. **Performance Analysis:**
   - Step 5: "MUST verify performance characteristics analyzed"
   - But: No consequence if not analyzed
   - Impact: Performance issues can be introduced

3. **Tech Debt Logging:**
   - Step 3: "MUST verify tech debt logged (if applicable)"
   - But: No Step 5 check, no consequence
   - Impact: Tech debt can go undocumented

4. **Error Handling:**
   - Step 5: "MUST verify all error paths have tests"
   - But: No explicit HARD STOP
   - Impact: Error paths might not be tested

**The Problem:**
- Step 5 checks exist but aren't enforced
- No clear consequence for violations
- Developers can skip checks without penalty
- Creates compliance drift

**Recommended Fix:**

**Add to `.cursor/rules/01-enforcement.mdc`:**

```markdown
## STEP 5 ENFORCEMENT STANDARDS

**MANDATORY:** Every Step 5 check MUST have a consequence.

### Enforcement Levels

1. **HARD STOP (Critical):**
   - Blocks merge
   - Examples: Security violations, tenant isolation, breaking changes
   - Format: "Missing [X] = compliance violation (HARD STOP)"

2. **BLOCK (High):**
   - Blocks merge until fixed
   - Examples: Missing tests, missing documentation, layer sync issues
   - Format: "Missing [X] = compliance violation (BLOCK)"

3. **WARNING (Medium):**
   - Allows merge but logs violation
   - Examples: Performance not analyzed, tech debt not logged
   - Format: "Missing [X] = compliance violation (WARNING)"

### Enforcement Requirements

**Every Step 5 check must:**
- State the consequence clearly
- Be enforceable (can be verified)
- Have a clear violation definition
- Be documented in rule file

**Examples:**

```markdown
✅ Good:
- [ ] **MUST** verify tenant isolation (if database queries)
  - Missing verification = compliance violation (HARD STOP)

✅ Good:
- [ ] **MUST** verify tests exist for new/modified code
  - Missing tests = compliance violation (BLOCK)

❌ Bad:
- [ ] **MUST** verify documentation updated
  - (No consequence stated)
```

**Enforcement:**
- Step 5 checks without consequences must be updated
- New checks must include consequence
- Violations must be tracked and reported
```

**Action Items:**
1. Review all Step 5 checks for missing consequences
2. Add consequence statements to all checks
3. Categorize by enforcement level (HARD STOP, BLOCK, WARNING)
4. Update rule files to include enforcement standards

---

### Issue 18: Definition Debt Pattern ⚠️ LOW PRIORITY

**Severity:** Low  
**Status:** ⚠️ OPEN

**Current State:**

**Pattern Description:**
Terms used throughout rules but never defined. Creates ambiguity and inconsistent interpretation.

**Examples Found:**

1. **"Significant" (used in 3+ rules):**
   - "Significant decision" - what makes it significant?
   - "Significant impact" - what threshold?
   - "Significant change" - how many files?

2. **"Meaningful" (used in 2+ rules):**
   - "Meaningful debt" - what makes it meaningful?
   - "Meaningful impact" - what threshold?

3. **"Stateful" (used in 2+ rules):**
   - "Stateful entity" - what makes it stateful?
   - "Stateful component" - what's the difference?

4. **"Critical" (used in 5+ rules):**
   - "Critical workflow" - what makes it critical?
   - "Critical path" - how is it defined?
   - "Critical security" - what's the threshold?

5. **"Major" (used in 2+ rules):**
   - "Major refactoring" - how many files?
   - "Major change" - what's the threshold?

**The Problem:**
- Terms used but never defined
- Different developers interpret differently
- No consistent application
- Creates compliance gaps

**Recommended Fix:**

**Add to `.cursor/rules/00-master.mdc`:**

```markdown
## TERMINOLOGY GLOSSARY

**MANDATORY:** All terms used in rules must be defined in this glossary.

### Core Terms

**Significant:**
- **Decision:** Affects multiple modules, changes architecture, or impacts >10 developers
- **Change:** Modifies >50 files, changes API contracts, or affects multiple services
- **Impact:** Affects >20% of users, changes business logic, or requires migration

**Meaningful:**
- **Debt:** Affects maintainability/performance, has remediation plan, requires future work
- **Impact:** Affects >10% of users, changes behavior, or requires documentation

**Stateful:**
- **Entity:** Has status/state field that changes over time, has workflow states, or has lifecycle states
- **Component:** Manages state that affects behavior, has state transitions, or maintains session state

**Critical:**
- **Workflow:** Core business process, affects revenue, or impacts SLA
- **Path:** Code path executed in >80% of requests, affects performance budget, or handles sensitive data
- **Security:** Affects authentication, authorization, data exposure, or tenant isolation

**Major:**
- **Refactoring:** Modifies >50 files, changes architecture, or affects multiple services
- **Change:** Breaking change, affects multiple modules, or requires migration

### Usage Rules

1. **When to Use:**
   - Use defined terms consistently
   - Reference glossary when using term
   - Update glossary when adding new term

2. **When to Define:**
   - New term introduced in rules
   - Term used in multiple rules
   - Term has ambiguous meaning

3. **Definition Requirements:**
   - Clear, measurable criteria
   - Examples provided
   - Thresholds specified (if applicable)

**Enforcement:**
- Terms used in rules must be in glossary
- Undefined terms must be added
- Glossary must be kept current
```

**Action Items:**
1. Create glossary section in `00-master.mdc`
2. Define all identified terms
3. Review all rule files for undefined terms
4. Add definitions as terms are found
5. Reference glossary in rule files

---

## Part 3: Meta-Patterns

### Meta-Pattern 1: "The If Applicable Problem"

**Found in 8+ Rules:**
- Tech debt logging: "if applicable"
- Engineering decisions: "if significant"
- State machines: "if stateful"
- Contracts: "if schema changes"
- Layer sync: "if touching any layer"
- Performance: "if applicable"
- Documentation: "if applicable"
- Configuration: "if applicable"

**The Problem:**
- Developers interpret differently
- No enforcement possible
- Creates compliance gaps
- No decision tree provided

**The Solution:**
- Define explicit triggers
- Make it binary: required or not
- Provide decision tree if complex
- Add to Step 5 enforcement

**Example Transformation:**

```markdown
❌ Bad: "Update tests (if applicable)"

✅ Good: "MANDATORY: Update tests when:
- Adding new functions/methods
- Modifying existing logic
- Fixing bugs

SKIP tests only for:
- Documentation-only changes
- Config-only changes
(Document skip reason in PR)"
```

---

### Meta-Pattern 2: Step 5 Verification Gap

**Pattern Found:**
Almost every issue has missing Step 5 enforcement. This suggests:

1. **Step 5 is incomplete** - needs comprehensive checklist
2. **Rules don't flow to enforcement** - disconnect between rule definition and verification
3. **No template for "verify X"** - each rule should include enforcement hook

**Statistics:**
- **12+ rules** mention requirements but don't verify in Step 5
- **Only 3 rules** have explicit Step 5 checks (bug logging, error handling, tests)
- **Gap:** 80% of rules lack Step 5 enforcement

**Recommendation:**

Create a Step 5 template that every new rule must populate:

```markdown
## [RULE NAME]

### Requirements
[what must be done]

### Step 5 Verification
- [ ] **MUST** verify [specific check]
- [ ] **MUST** verify [specific check]
- Missing [X] = compliance violation
```

---

### Meta-Pattern 3: Ambiguous Mandatory Status

**Pattern Found:**
- Rules use "should", "must", "MUST", "SHOULD" inconsistently
- No clear distinction between recommended and mandatory
- No enforcement for "should" statements

**Examples:**
- "SHOULD have integration tests" - is it mandatory?
- "should be documented" - is it required?
- "MUST have unit tests" - but no Step 5 check

**Recommendation:**
- Use "MANDATORY" for required items
- Use "RECOMMENDED" for optional items
- Always add Step 5 checks for MANDATORY items
- Document exemptions clearly

---

### Meta-Pattern 4: Scope Creep Pattern

**Pattern Found:**
Rules that started narrow but need expansion over time.

**Examples:**
- "if schema changes" → should be "if API/schema/events change"
- "if stateful" → should be "if stateful OR state transitions change"
- "if applicable" → should be explicit about when it applies

**The Problem:**
- Rules written for specific scenarios
- Over time, similar scenarios emerge but aren't covered
- Conditionals become too narrow
- Creates compliance gaps

**The Solution:**
- Review all conditionals for scope
- Expand narrow conditionals to cover related scenarios
- Document scope decisions
- Add scope review to rule update process

**See Issue 16 for detailed analysis and recommendations.**

---

### Meta-Pattern 5: Enforcement Drift Pattern

**Pattern Found:**
Step 5 checks that exist but aren't enforced as HARD STOP violations.

**Examples:**
- "verify documentation updated" but no penalty for missing docs
- "verify performance analyzed" but no consequence if not analyzed
- Checks listed but have no consequences

**The Problem:**
- Step 5 checks exist but aren't enforced
- No clear consequence for violations
- Developers can skip checks without penalty
- Creates compliance drift

**The Solution:**
- Every Step 5 check needs a consequence
- Categorize by enforcement level (HARD STOP, BLOCK, WARNING)
- State consequence clearly in check
- Track and report violations

**See Issue 17 for detailed analysis and recommendations.**

---

### Meta-Pattern 6: Definition Debt Pattern

**Pattern Found:**
Terms used throughout rules but never defined.

**Examples:**
- "significant" - what makes it significant?
- "meaningful" - what makes it meaningful?
- "stateful" - what makes it stateful?
- "critical" - what makes it critical?

**The Problem:**
- Terms used but never defined
- Different developers interpret differently
- No consistent application
- Creates compliance gaps

**The Solution:**
- Create glossary in `00-master.mdc`
- Define all terms used in rules
- Provide clear, measurable criteria
- Include examples and thresholds

**See Issue 18 for detailed analysis and recommendations.**

---

## Part 4: Cross-Cutting Concerns

### Concern 1: Step 5 Checklist Completeness

**Current Step 5 Has:**
- 20+ checks
- But missing 12+ additional checks identified in this audit

**Missing Checks:**
1. Bug logging (✅ recently added)
2. Error pattern documentation (✅ recently added)
3. Anti-pattern logging (✅ recently added)
4. Engineering decisions
5. Tech debt logging
6. Layer synchronization
7. State machine docs
8. Contract documentation
9. Testing coverage
10. Breaking changes
11. Security review
12. Documentation updates
13. Configuration changes
14. Performance impact
15. Error handling standards
16. Rollback plans
17. Dependency changes
18. Audit logging

**Recommendation:**
- Expand Step 5 to include all identified checks
- Organize by category (security, quality, documentation, etc.)
- Make it searchable/filterable

---

### Concern 2: Rule-to-Enforcement Disconnect

**Problem:**
- Rules define requirements in rule files (00-14 .mdc)
- Enforcement checks in Step 5 (01-enforcement.mdc)
- No automatic connection between them

**Impact:**
- New rules added but Step 5 not updated
- Step 5 checks exist but rules don't define requirements
- Inconsistency between what's required and what's checked

**Recommendation:**
- Each rule file should include "Step 5 Verification" section
- Step 5 should reference rule files for each check
- Automated check to ensure rule files have Step 5 sections

---

## Part 5: Complete Issue Summary

| # | Issue | Severity | Status | Missing Enforcement | Priority |
|---|-------|----------|--------|---------------------|----------|
| 0 | Bug Logging | High | ✅ FIXED | N/A | - |
| 1 | Engineering Decisions | High | ⚠️ OPEN | Step 5 check | High |
| 2 | Tech Debt Logging | Medium | ⚠️ OPEN | Step 5 check | Medium |
| 3 | Layer Synchronization | High | ⚠️ OPEN | Step 5 check | High |
| 4 | State Machine Docs | Medium | ⚠️ OPEN | Step 5 check | Medium |
| 5 | Contract Documentation | Medium | ⚠️ OPEN | Step 5 check | Medium |
| 6 | Testing Requirements | Critical | ⚠️ OPEN | Step 5 checks | Critical |
| 7 | Breaking Changes | Critical | ⚠️ OPEN | Step 5 checks | Critical |
| 8 | Security Review Triggers | Critical | ⚠️ OPEN | Step 5 checks | Critical |
| 9 | Documentation Updates | High | ⚠️ OPEN | Step 5 checks | High |
| 10 | Configuration Changes | High | ⚠️ OPEN | Step 5 checks | High |
| 11 | Performance Impact | Medium | ⚠️ OPEN | Step 5 check | Medium |
| 12 | Error Handling Standards | Medium | ⚠️ OPEN | Step 5 checks | Medium |
| 13 | Rollback Plans | Medium | ⚠️ OPEN | Step 5 check | Medium |
| 14 | Dependency Changes | Medium | ⚠️ OPEN | Step 5 checks | Medium |
| 15 | Audit Logging | Low | ⚠️ OPEN | Step 5 check | Low |
| 16 | Scope Creep Pattern | Medium | ⚠️ OPEN | Scope review process | Medium |
| 17 | Enforcement Drift Pattern | Medium | ⚠️ OPEN | Consequence statements | Medium |
| 18 | Definition Debt Pattern | Low | ⚠️ OPEN | Glossary creation | Low |

---

## Part 6: Recommended Actions

### Immediate (Critical Priority)

1. **Testing Requirements (Issue 6):**
   - Define when tests are mandatory vs optional
   - Add coverage requirements to Step 5
   - Clarify exemptions

2. **Breaking Changes (Issue 7):**
   - Add breaking change identification rules
   - Require migration guides
   - Add version bump requirements

3. **Security Review Triggers (Issue 8):**
   - Define when security review is mandatory
   - Add review process documentation
   - Add Step 5 enforcement

### High Priority (Next Sprint)

4. **Engineering Decisions (Issue 1):**
   - Define "significant decision"
   - Add Step 5 enforcement

5. **Layer Synchronization (Issue 3):**
   - Add explicit Step 5 verification
   - Make it HARD STOP

6. **Documentation Updates (Issue 9):**
   - Define when docs must be updated
   - Add Step 5 checks

7. **Configuration Changes (Issue 10):**
   - Define when `.env.example` must be updated
   - Add Step 5 checks

### Medium Priority (Following Sprint)

8. **Tech Debt Logging (Issue 2):**
   - Define "if applicable" and "meaningful debt"
   - Add Step 5 enforcement

9. **State Machine Docs (Issue 4):**
   - Define "stateful entity"
   - Add Step 5 enforcement

10. **Contract Documentation (Issue 5):**
    - Expand beyond "schema changes"
    - Add Step 5 enforcement

11. **Performance Impact (Issue 11):**
    - Define when documentation is required
    - Add Step 5 check

12. **Error Handling Standards (Issue 12):**
    - Define custom error class requirements
    - Add Step 5 checks

13. **Rollback Plans (Issue 13):**
    - Define when plans are mandatory
    - Add Step 5 check

14. **Dependency Changes (Issue 14):**
    - Define documentation requirements
    - Add Step 5 checks

### Low Priority (Backlog)

15. **Audit Logging (Issue 15):**
    - Define broader requirements
    - Add Step 5 check

16. **Scope Creep Pattern (Issue 16):**
    - Review all conditionals for scope
    - Expand narrow conditionals
    - Add scope review process

17. **Enforcement Drift Pattern (Issue 17):**
    - Add consequence statements to all Step 5 checks
    - Categorize by enforcement level
    - Track violations

18. **Definition Debt Pattern (Issue 18):**
    - Create glossary in `00-master.mdc`
    - Define all identified terms
    - Review rules for undefined terms

---

## Part 7: Rule Compliance Matrix Recommendation

**Proposed:** Create a Rule Compliance Matrix that maps each rule to its Step 5 verification.

**Format:**
```markdown
| Rule File | Rule Section | Step 5 Check | Status |
|-----------|--------------|--------------|--------|
| 00-master.mdc | Bug Logging | Verify bug logged | ✅ |
| 00-master.mdc | Engineering Decisions | Verify decision documented | ❌ |
| 05-data.mdc | Layer Sync | Verify synchronization | ❌ |
| 10-quality.mdc | Testing | Verify tests exist | ⚠️ Partial |
```

**Benefits:**
- Visual gap identification
- Ensures all rules have enforcement
- Prevents future gaps
- Makes compliance verifiable

---

## Part 8: Questions for Decision

### Testing
1. **What's your minimum acceptable test coverage?**
   - Current: ≥ 80% for new code
   - Is this correct?

2. **When can tests be skipped?**
   - Documentation-only?
   - Config-only?
   - Proof-of-concept?
   - Scripts?

### Breaking Changes
3. **Do you version APIs?**
   - Semantic versioning?
   - API versioning strategy?

4. **How should breaking changes be communicated?**
   - PR tags?
   - Migration guides?
   - Team notifications?

### Security
5. **Do you have a security review process?**
   - Who reviews?
   - How is it documented?
   - What triggers review?

### Documentation
6. **Which docs are "living" (must stay in sync) vs "reference" (can lag)?**
   - README.md?
   - API docs?
   - Architecture diagrams?

### The Big One
7. **Should we create a Rule Compliance Matrix that maps each rule to its Step 5 verification?**
   - Would help prevent future gaps
   - Makes compliance verifiable
   - Ensures all rules have enforcement

---

## Part 9: Pattern Analysis Summary

### Common Issues Found

1. **Ambiguous Conditionals (8+ instances):**
   - "If applicable" - when is it applicable?
   - "If stateful" - what makes something stateful?
   - "If schema changes" - too narrow scope
   - "If significant" - what's significant?

2. **Missing Enforcement (12+ instances):**
   - Rules state requirements but don't verify in Step 5
   - No HARD STOP for violations
   - No connection between rule definition and verification

3. **Unclear Mandatory Status (5+ instances):**
   - Rules say "should" or "must" but don't enforce
   - No distinction between recommended and mandatory
   - "SHOULD" vs "MUST" confusion

4. **Incomplete Definitions (6+ instances):**
   - Terms like "significant decision" and "meaningful debt" not defined
   - Scope of requirements unclear
   - Examples missing

---

## Part 10: Implementation Strategy

### Phase 1: Critical Fixes (Week 1)
- Testing Requirements (Issue 6)
- Breaking Changes (Issue 7)
- Security Review Triggers (Issue 8)

### Phase 2: High Priority (Week 2)
- Engineering Decisions (Issue 1)
- Layer Synchronization (Issue 3)
- Documentation Updates (Issue 9)
- Configuration Changes (Issue 10)

### Phase 3: Medium Priority (Week 3-4)
- Tech Debt Logging (Issue 2)
- State Machine Docs (Issue 4)
- Contract Documentation (Issue 5)
- Performance Impact (Issue 11)
- Error Handling Standards (Issue 12)
- Rollback Plans (Issue 13)
- Dependency Changes (Issue 14)

### Phase 4: Low Priority (Backlog)
- Audit Logging (Issue 15)

---

## Related Documentation

- `docs/compliance-reports/BUG_LOGGING_RULE_INVESTIGATION.md` - Original bug logging investigation
- `docs/compliance-reports/RULE_CLARITY_AUDIT_REPORT.md` - Previous audit (Issues 0-5)
- `docs/compliance-reports/RULE_UPDATES_BUG_LOGGING.md` - Bug logging rule updates
- `docs/compliance-reports/BUG_AND_ANTI_PATTERN_CONSOLIDATION_REPORT.md` - Consolidation report
- `.cursor/rules/00-master.mdc` - Master rule file
- `.cursor/rules/01-enforcement.mdc` - Enforcement pipeline
- All rule files (02-14 .mdc) - Domain-specific rules

---

**Report Generated:** 2025-12-05  
**Next Steps:** Review recommendations, answer questions, prioritize fixes  
**Status:** ⚠️ **AWAITING DECISION ON PRIORITIES AND APPROVAL FOR RULE UPDATES**

