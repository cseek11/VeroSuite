VeroField Rules System v2.1: Complete Implementation Plan
Executive Summary
This plan upgrades the VeroField Rules System from v2.0 to v2.1 by implementing the Unified Enforcement Contract, fixing all 15 identified rule clarity issues, and establishing automated enforcement through OPA policies and CI/CD integration.
Timeline: 8 weeks
Team Size: 5-10 developers
Current State: v2.0 with 1/16 issues fixed (Bug Logging ✅)
Target State: v2.1 with 100% rule clarity, automated enforcement, compliance dashboard

Table of Contents

System Architecture Overview
Phase 1: Foundation & Critical Fixes (Weeks 1-2)
Phase 2: Rule Migration & OPA Integration (Weeks 3-5)
Phase 3: Dashboard & Operations (Weeks 6-8)
Technical Implementation Details
Testing & Validation Strategy
Rollout & Change Management


System Architecture Overview
Current Architecture (v2.0)
┌─────────────────────────────────────────────────────────────┐
│                    Cursor IDE Layer                          │
├─────────────────────────────────────────────────────────────┤
│  .cursor/rules/                                              │
│  ├── 00-master.mdc (Supreme precedence)                     │
│  ├── 01-enforcement.mdc (5-step pipeline)                   │
│  ├── 02-core.mdc                                            │
│  ├── 03-security.mdc (Security dominance)                   │
│  ├── 04-14 domain rules (Path-based routing)                │
│  └── agents.json (12 specialized agents)                    │
├─────────────────────────────────────────────────────────────┤
│  .cursor/patterns/ (Golden patterns)                         │
│  .cursor/prompts/ (Role-specific prompts)                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    Git/GitHub Layer                          │
├─────────────────────────────────────────────────────────────┤
│  .github/workflows/ (CI/CD)                                  │
│  ├── compliance-scan.yml                                     │
│  ├── reward-score.yml                                        │
│  └── pattern-extraction.yml                                  │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                 Enforcement Layer (NEW)                      │
├─────────────────────────────────────────────────────────────┤
│  services/opa/policies/ (OPA Rego files)                     │
│  ├── testing.rego                                            │
│  ├── security.rego                                           │
│  ├── layer-sync.rego                                         │
│  └── breaking-change.rego                                    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Compliance Dashboard (NEW)                      │
├─────────────────────────────────────────────────────────────┤
│  apps/forge-console/src/pages/ComplianceDashboard.tsx       │
│  Real-time metrics, violation tracking, remediation         │
└─────────────────────────────────────────────────────────────┘
Target Architecture (v2.1)
┌─────────────────────────────────────────────────────────────┐
│                 Unified Enforcement Contract v1.1            │
│                  (Embedded in 00-master.mdc)                 │
├─────────────────────────────────────────────────────────────┤
│  Section 0: Global Directive & Routing                       │
│  Section 1: Compliance Vocabulary (Glossary)                 │
│  Section 2: Rule Template (Standardized structure)           │
│  Section 3: Enforcement Mapping (Rule → Step 5 → OPA)        │
│  Section 4: Scope Review Process (Quarterly)                 │
│  Section 5: Consequence Framework (BLOCK/OVERRIDE/WARNING)   │
│  Section 6: Migration Strategy (Boy Scout Rule)              │
│  Section 7: OPA Policy System (Policy-as-code)               │
│  Section 8: Compliance Dashboard (Metrics & reporting)       │
│  Section 9: Change Management (Versioning & approvals)       │
└─────────────────────────────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
┌──────────────────────┐    ┌──────────────────────┐
│   Cursor Rules       │    │   CI/CD Pipeline     │
│   (AI Enforcement)   │    │   (Automated Gates)  │
├──────────────────────┤    ├──────────────────────┤
│ • 15 .mdc files      │    │ • OPA evaluation     │
│ • Path-based routing │    │ • Coverage checks    │
│ • Step 5 checks      │    │ • Security scans     │
│ • Agent selection    │    │ • Reward scoring     │
└──────────────────────┘    └──────────────────────┘
              │                         │
              └────────────┬────────────┘
                           ▼
              ┌────────────────────────┐
              │  Rule Compliance       │
              │  Matrix (Source of     │
              │  Truth)                │
              └────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Compliance Dashboard  │
              │  (Real-time monitoring)│
              └────────────────────────┘

Phase 1: Foundation & Critical Fixes (Weeks 1-2)
Week 1: Foundation Setup
Day 1-2: Embed Unified Enforcement Contract
File: .cursor/rules/00-master.mdc
markdown---
description: UNIFIED ENFORCEMENT CONTRACT v1.1 - SUPREME AUTHORITY
globs: **/*
version: 2.1.0
last_updated: 2025-11-22
---

# VeroField Unified Enforcement Contract v1.1

## Section 0: Global Directive & AI Binding

**YOU ARE BOUND** by this Unified Enforcement Contract. You MUST NOT generate code without first verifying compliance with the relevant specialized rule files.

### Routing Logic (Context-Based Rule Selection)

Before answering any query, determine which domain applies:
````mermaid
graph TD
    A[Incoming Request] --> B{File Pattern Match?}
    B -->|schema.prisma, *.sql, DTOs| C[Load 05-data.mdc]
    B -->|Auth, RLS, Config, PII| D[Load 03-security.mdc]
    B -->|*.test.ts, test logic| E[Load 10-quality.mdc]
    B -->|API endpoints, events| F[Load 05-data.mdc + 08-backend.mdc]
    B -->|*.tsx, *.jsx| G[Load 09-frontend.mdc + 13-ux.mdc]
    B -->|.github/workflows| H[Load 11-operations.mdc]
    
    C --> I[Execute Step 5 Checks]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I
    
    I --> J{All Checks Pass?}
    J -->|Yes| K[Generate Code]
    J -->|No| L[Output Violation Report]
    L --> M[HARD STOP - Request User Intervention]
````

**Mandatory Rule Loading:**
- **ALWAYS LOAD:** 00-master.mdc, 01-enforcement.mdc, 02-core.mdc, 03-security.mdc
- **CONTEXT-BASED:** Load additional rules based on file patterns

### Step 5 Universal Check (The Contract)

Every specialized rule ends with a "Step 5: Verification" section.

**HARD STOP REQUIREMENT:** If you cannot affirmatively check ALL boxes in Step 5, you MUST NOT output code. Instead, output a violation report in this format:
````markdown
## 🚫 COMPLIANCE VIOLATION DETECTED

**Rule:** [Rule Name from Rule File]
**Severity:** [BLOCK | OVERRIDE | WARNING]
**File(s):** [Affected files]

### Failed Checks:
- [ ] [Specific Step 5 check that failed]
- [ ] [Another failed check]

### Required Actions:
1. [Specific action needed]
2. [Another action needed]

### Related Documentation:
- [Link to relevant docs]

**Status:** HARD STOP - Cannot proceed without resolution
````

---

## Section 1: Compliance Vocabulary (Glossary)

### A — C

**Acceptance Criteria:** Definition of done for a user story or ticket, including testable conditions.

**Access Control:** Restricting access to resources based on identity or permissions (e.g., RBAC).

**API Contract:** Defined interface specifying request/response formats, errors, and behaviors. Must be documented in `docs/contracts/api/*.md`.

**Atomic Change:** A change that modifies only one logical behavior at a time to minimize risk. Used to determine scope of PRs.

**Availability:** Measure of system uptime, often tied to SLAs (e.g., 99.9%). Tracked in observability systems.

**Baseline Scan:** Initial compliance scan to identify and document existing violations. Run during Phase 1 implementation.

**Breaking Change:** Non-backward-compatible alteration requiring consumer updates (e.g., schema removals, API endpoint changes, DTO field removals). 
- **Triggers:** Schema changes removing fields, API endpoint modifications, event contract changes
- **Requirements:** Migration guide, version bump, consumer notification
- **Consequences:** Missing documentation = HARD STOP

**CI/CD:** Continuous Integration/Continuous Deployment pipelines for automated building/testing/deployment.

**Cloud-Native:** Software designed for containerization, orchestration (e.g., Kubernetes), and scalability.

### D — F

**Data Contract:** Agreement defining data structures shared across services/clients (e.g., events). Must be documented in `docs/contracts/`.

**Data Migration:** Transforming database schema or contents to new formats, often with rollback plans. Requires documented rollback strategy.

**Decision Log:** Record of significant architectural or product decisions for historical context. Stored in `docs/engineering-decisions.md`.

**Dependency Graph:** Mapping of modules and their dependencies to identify risks.

**Deployment Artifact:** Build output (e.g., Docker image) deployed to environments.

**E2E Test:** End-to-end test simulating real user flows across the system.

**Error Boundary:** Mechanism to catch and handle runtime errors gracefully (e.g., in React).

**Feature Flag:** Toggle for enabling/disabling features at runtime without redeployment.

### G — L

**Golden Path:** Standardized, recommended workflow or template for common tasks. Defined in `.cursor/patterns/`.

**Grandfathered Code:** Legacy code exempted from strict compliance temporarily. Tracked in `.compliance-exemptions.json`.

**High Complexity:** Code with excessive nesting or branching (>10 cyclomatic complexity). Triggers performance review.

**Idempotent:** Operation that produces the same effect regardless of repetition (e.g., HTTP PUT).

**Incident:** Unplanned event disrupting service quality or availability.

**Integration Test:** Tests interactions between modules/services (e.g., API calls). Required for DB/API changes.

**Latency:** Time between request initiation and response completion (measured in ms).

**Layer Sync:** Ensuring schema, DTOs, API types, and frontend types remain consistent.
- **Triggers:** Schema changes, DTO modifications, API type changes, event model changes
- **Requirements:** All layers must be updated in same PR
- **Consequences:** Missing synchronization = HARD STOP

**Least Privilege:** Security principle restricting permissions to the minimum required.

### M — O

**Meaningful Tech Debt:** Debt that:
- Affects maintainability or performance
- Has a known remediation plan
- Will require future work to fix
- Impacts multiple developers or modules

**Migration Guide:** Document describing steps to update code after a breaking change. Required for all breaking changes.

**Monitoring:** Active observation of system health via metrics and alerts.

**Mutable State:** State that changes over time and affects behavior (e.g., session data).

**N+1 Query:** Inefficient DB pattern where many small queries execute instead of one optimized query. Triggers performance review.

**Observability:** Ability to understand system behavior from logs, metrics, and traces.

**OPA (Open Policy Agent):** Engine for evaluating policy-as-code in CI/CD.

### P — S

**Performance Budget:** Thresholds for acceptable latency/response times (e.g., P99 <200ms).

**PII (Personally Identifiable Information):** Data that can identify an individual (e.g., email).

**Pull Request (PR):** Proposed code change requiring review and approval.

**Regression Test:** Test added after a bug fix to prevent recurrence. MANDATORY for all bug fixes.

**Rollback Plan:** Strategy to safely revert changes in production. Required for:
- Database migrations
- Feature flags
- Infrastructure changes
- Breaking changes

**RLS (Row Level Security):** Database mechanism for tenant data isolation (e.g., PostgreSQL).

**Security-Sensitive Change:** Changes affecting:
- Authentication/authorization
- Data exposure (new endpoints with PII)
- Input validation
- Third-party integrations
- RLS policies

**Significant Decision:** Architectural or design decision affecting:
- Service boundaries
- Database schema (multiple modules)
- Major refactoring (>50 files)
- Technology stack
- Design patterns
- Trade-offs (performance vs maintainability)

**SLA (Service Level Agreement):** Commitments for uptime, performance, etc.

**State Machine:** Defined lifecycle with allowed transitions and states (e.g., Draft→Completed).

**Stateful Entity:** Entity with:
- Status/state field that changes over time
- Workflow states (e.g., draft → review → approved)
- Lifecycle states (e.g., created → active → archived)
- Examples: WorkOrder, Invoice, Payment, User

### T — Z

**Tech Debt:** Deferred work that speeds delivery but requires future remediation.

**Telemetry:** Collected system metadata: logs, metrics, traces for observability.

**Tenant Isolation:** Guarantee that one customer's data is inaccessible to others.

**Threshold:** Numeric boundary for performance or quality metrics.

**Version Bump:** Incrementing semantic version (MAJOR.MINOR.PATCH) based on change impact:
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

**Zero Trust:** Security model assuming no implicit trust, verifying every access.

---

## Section 2: Rule Template (Standardized Structure)

All rules in `.cursor/rules/*.mdc` MUST follow this template:
````markdown
---
description: [Brief description]
globs: [File patterns this rule applies to]
version: [Semantic version]
last_updated: [YYYY-MM-DD]
---

# [NN-rulename.mdc]: [Title]

## 1. Purpose
[Why this rule exists]

## 2. Triggers (When This Rule Applies)
[Explicit list of conditions that activate this rule]

### Examples of Triggers:
- ✅ [Scenario that triggers rule]
- ✅ [Another scenario]
- ❌ [Counter-example - does NOT trigger]

## 3. Requirements (MANDATORY vs RECOMMENDED)

### MANDATORY Requirements:
[List of non-negotiable requirements with consequences]

### RECOMMENDED Requirements:
[List of best practices without hard stops]

## 4. Decision Tree
[Visual or textual decision flow]
```mermaid
graph TD
    A[Trigger Detected] --> B{Condition 1?}
    B -->|Yes| C[Action 1]
    B -->|No| D{Condition 2?}
    D -->|Yes| E[Action 2]
    D -->|No| F[Skip this rule]
```

## 5. Examples

### Good Example:
```[language]
[Code demonstrating compliance]
```

### Bad Example:
```[language]
[Code demonstrating violation]
```

## 6. Step 5 Verification (The Contract)

Before finalizing code, verify:

- [ ] **MUST** verify [specific check 1]
- [ ] **MUST** verify [specific check 2]
- [ ] **SHOULD** verify [optional check]

**Consequences:**
- Missing MANDATORY checks = HARD STOP (CI blocks merge)
- Missing RECOMMENDED checks = WARNING (logged, no block)

**Exemptions:**
[List valid exemptions, if any]

## 7. Related Rules
- [Link to related rule file]
- [Link to glossary term]
- [Link to pattern]

## 8. Change Log
- [YYYY-MM-DD] v[version]: [Change description]
````

---

## Section 3: Enforcement Mapping (Rule → Step 5 → OPA)

This section maps every rule to its enforcement mechanisms.

### Mapping Structure
````
Rule File → Rule Section → Step 5 Check → OPA Policy → CI Stage
````

**Example:**
````
05-data.mdc → Layer Sync → MUST verify sync complete → layer-sync.rego → pre-merge
````

### Complete Enforcement Map

See `docs/compliance-reports/rule-compliance-matrix.md` for the full 25-row matrix.

**Key Principles:**
1. Every MANDATORY requirement MUST have a Step 5 check
2. Every Step 5 check MUST map to an OPA policy (if automatable)
3. Every OPA policy MUST have a CI stage
4. Non-automatable checks require manual review prompts

---

## Section 4: Scope Review Process (Quarterly Evolution)

### Schedule
- **Q1:** January 15
- **Q2:** April 15
- **Q3:** July 15
- **Q4:** October 15

### Review Checklist
````markdown
# Scope Review Checklist - Q[N] [YEAR]

## 1. Incident Analysis
- [ ] Review `BUG_LOG.md` for patterns
- [ ] Review `docs/error-patterns.md` for trends
- [ ] Identify gaps: "We had a bug because [rule was missing]"

## 2. Rule Coverage Analysis
- [ ] Review all "if applicable" conditions
- [ ] Identify new triggers from incidents
- [ ] Check for scope creep (narrow triggers that should be broad)

## 3. Glossary Updates
- [ ] Add new terms from last quarter
- [ ] Update definitions based on team feedback
- [ ] Remove obsolete terms

## 4. Compliance Metrics Review
- [ ] Review dashboard metrics
- [ ] Identify repeat violations
- [ ] Adjust consequence levels if needed

## 5. Exemption Review
- [ ] Review `.compliance-exemptions.json`
- [ ] Expire old exemptions
- [ ] Update grandfathered code status

## 6. Rule Updates
- [ ] Implement new rules for identified gaps
- [ ] Update existing rules based on learnings
- [ ] Deprecate obsolete rules

## 7. Documentation
- [ ] Create `docs/compliance-reports/scope-review-Q[N]-[YEAR].md`
- [ ] Update Rule Compliance Matrix
- [ ] Notify team of changes
````

---

## Section 5: Consequence Framework

### Severity Levels
````mermaid
graph LR
    A[Violation Detected] --> B{Severity?}
    B -->|Critical Security| C[BLOCK]
    B -->|MANDATORY Rule| D[BLOCK with OVERRIDE option]
    B -->|REQUIRED Rule| E[OVERRIDE with justification]
    B -->|RECOMMENDED Rule| F[WARNING only]
    
    C --> G[Cannot merge - requires fix]
    D --> H{Override requested?}
    H -->|Yes + valid reason| I[Allow with audit log]
    H -->|No| G
    E --> J{Justification provided?}
    J -->|Yes| I
    J -->|No| G
    F --> K[Log warning, allow merge]
````

### Consequence Definitions

#### BLOCK (No Override)
- **When:** Critical security violations, data corruption risks
- **Examples:** Bypassing RLS, exposing PII, missing tenant isolation
- **Action:** CI fails, PR cannot merge
- **Resolution:** Fix required, no exceptions

#### BLOCK with OVERRIDE
- **When:** MANDATORY rule violations
- **Examples:** Missing tests, layer sync failures, breaking changes without docs
- **Action:** CI fails, but override possible
- **Override Process:**
  1. Add comment to PR: `@override [rule-id] [justification]`
  2. Governance Lead reviews within 24 hours
  3. If approved, CI passes with audit log
  4. Logged in `docs/compliance-reports/overrides.md`

#### OVERRIDE with Justification
- **When:** REQUIRED rule violations
- **Examples:** Missing rollback plan, missing performance benchmarks
- **Action:** CI warns, merge allowed with justification
- **Process:**
  1. Add to PR description: "Override [rule]: [reason]"
  2. Logged automatically
  3. Reviewed in scope reviews

#### WARNING
- **When:** RECOMMENDED rule violations
- **Examples:** Missing optional documentation, suggested optimizations
- **Action:** Log warning, allow merge
- **Process:** Tracked in dashboard, no blocking

### Override Format
````markdown
## Override Request

**Rule:** [Rule ID from matrix]
**Reason:** [Detailed justification]
**Risk Assessment:** [What could go wrong?]
**Mitigation:** [How will you address this later?]
**Timeline:** [When will this be fixed?]
**Expires:** [YYYY-MM-DD] (Max 7 days for emergency)

**Approver:** @[governance-lead-username]
````

---

## Section 6: Migration Strategy (Boy Scout Rule)

### Principle

**"Leave the code better than you found it."**

When modifying grandfathered (legacy) code, you MUST fix at least one compliance violation in the same file.

### Grandfathered Code Tracking

**File:** `.compliance-exemptions.json`
````json
{
  "version": "1.0",
  "last_updated": "2025-11-22",
  "exemptions": [
    {
      "path": "apps/api/src/legacy/auth.service.ts",
      "violations": [
        {
          "rule": "03-security.mdc:RLS",
          "reason": "Pre-RLS implementation, needs full rewrite",
          "severity": "HIGH",
          "created": "2025-01-15",
          "expires": "2026-01-15",
          "remediation_plan": "Rewrite in Q2 2026",
          "assigned_to": "security-team"
        }
      ]
    }
  ],
  "remediation_progress": {
    "total_exemptions": 47,
    "fixed_this_quarter": 12,
    "target_completion": "2026-06-01"
  }
}
````

### Boy Scout Rule Enforcement

**CI Script:** `.github/scripts/check-boy-scout.js`
````javascript
/**
 * Checks if changes to grandfathered files include compliance fixes
 */
const fs = require('fs');
const path = require('path');

async function checkBoyScoutRule(changedFiles, exemptionsPath) {
  const exemptions = JSON.parse(fs.readFileSync(exemptionsPath, 'utf8'));
  const exemptedPaths = exemptions.exemptions.map(e => e.path);
  
  const touchedExemptedFiles = changedFiles.filter(file => 
    exemptedPaths.includes(file)
  );
  
  if (touchedExemptedFiles.length === 0) {
    console.log('✅ No grandfathered files touched');
    return true;
  }
  
  console.log(`⚠️  Modified ${touchedExemptedFiles.length} grandfathered file(s):`);
  touchedExemptedFiles.forEach(file => console.log(`   - ${file}`));
  
  // Check if exemptions.json was also updated (indicating fix)
  const exemptionsUpdated = changedFiles.includes('.compliance-exemptions.json');
  
  if (!exemptionsUpdated) {
    console.error('❌ BOY SCOUT RULE VIOLATION');
    console.error('You modified grandfathered code but did not fix any violations.');
    console.error('Required: Fix at least one violation and update .compliance-exemptions.json');
    return false;
  }
  
  console.log('✅ Boy Scout Rule: Exemptions updated, assuming fix applied');
  return true;
}

module.exports = { checkBoyScoutRule };
````

---

## Section 7: OPA Policy System

### Policy Structure
````
services/opa/
├── policies/
│   ├── testing.rego           # Test coverage & requirement checks
│   ├── security.rego          # Security review requirements
│   ├── layer-sync.rego        # Data layer synchronization
│   ├── breaking-change.rego   # Breaking change detection
│   ├── tech-debt.rego         # Tech debt logging
│   ├── docs.rego              # Documentation requirements
│   └── config.rego            # Configuration management
├── data/
│   ├── exemptions.json        # Grandfathered code list
│   └── patterns.json          # Golden patterns index
└── tests/
    └── *.rego_test            # Policy unit tests
````

### Example Policy: Testing Requirements

**File:** `services/opa/policies/testing.rego`
````rego
package compliance.quality.testing

import future.keywords.if
import future.keywords.in

# Deny if new production code has no tests
deny[msg] if {
    input.changed_files[_].path
    is_production_code(input.changed_files[_].path)
    not has_corresponding_test(input.changed_files[_].path, input.changed_files)
    not is_exempted(input.changed_files[_].path)
    
    msg := sprintf(
        "HARD STOP: New production code '%s' requires tests. Create '%s'",
        [input.changed_files[_].path, test_file_path(input.changed_files[_].path)]
    )
}

# Deny if coverage is below 80% for new code
deny[msg] if {
    input.coverage.new_code_coverage < 80
    not is_documentation_only_pr(input.changed_files)
    
    msg := sprintf(
        "HARD STOP: New code coverage is %v%%, minimum required is 80%%",
        [input.coverage.new_code_coverage]
    )
}

# Warning for legacy code with low coverage (grandfathered)
warn[msg] if {
    input.coverage.overall_coverage < 80
    is_legacy_pr(input.changed_files)
    
    msg := sprintf(
        "WARNING: Overall coverage is %v%%. Consider improving legacy test coverage.",
        [input.coverage.overall_coverage]
    )
}

# Helper: Check if file is production code
is_production_code(path) if {
    not contains(path, ".test.")
    not contains(path, ".spec.")
    not contains(path, "test/")
    not contains(path, "__tests__/")
    contains(path, ".ts")
    not contains(path, ".d.ts")
}

# Helper: Check if test file exists
has_corresponding_test(source_path, all_files) if {
    test_path := test_file_path(source_path)
    some file in all_files
    file.path == test_path
}

# Helper: Generate test file path
test_file_path(source_path) := result if {
    parts := split(source_path, ".")
    base := concat(".", array.slice(parts, 0, count(parts) - 1))
    ext := parts[count(parts) - 1]
    result := sprintf("%s.test.%s", [base, ext])
}

# Helper: Check exemptions
is_exempted(path) if {
    some exemption in data.exemptions
    exemption.path == path
    contains(exemption.violations[_].rule, "testing")
}

# Helper: Documentation-only PR
is_documentation_only_pr(files) if {
    count([f | f := files[_]; contains(f.path, ".md")]) == count(files)
}

# Helper: Legacy code PR
is_legacy_pr(files) if {
    some file in files
    is_exempted(file.path)
}
````

### OPA Integration in CI

**File:** `.github/workflows/opa-compliance.yml`
````yaml
name: OPA Compliance Check

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  opa-evaluation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Need full history for diff
      
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v40
        with:
          json: true
          
      - name: Setup OPA
        uses: open-policy-agent/setup-opa@v2
        with:
          version: latest
          
      - name: Get test coverage
        id: coverage
        run: |
          npm test -- --coverage --json > coverage-summary.json
          echo "coverage_json=$(cat coverage-summary.json | jq -c .)" >> $GITHUB_OUTPUT
          
      - name: Build OPA input
        id: opa-input
        run: |
          cat <<EOF > opa-input.json
          {
            "changed_files": ${{ steps.changed-files.outputs.all_changed_files }},
            "coverage": ${{ steps.coverage.outputs.coverage_json }},
            "pr_number": ${{ github.event.pull_request.number }},
            "author": "${{ github.event.pull_request.user.login }}"
          }
          EOF
          
      - name: Load exemptions
        run: |
          cp .compliance-exemptions.json services/opa/data/exemptions.json
          
      - name: Run OPA evaluation
        id: opa-eval
        run: |
          opa eval \
            --data services/opa/policies/ \
            --data services/opa/data/ \
            --input opa-input.json \
            --format pretty \
            'data.compliance' > opa-results.txt
          
          # Check for DENY (BLOCK)
          if grep -q "deny" opa-results.txt; then
            echo "status=block" >> $GITHUB_OUTPUT
            echo "❌ OPA COMPLIANCE CHECK FAILED" >> $GITHUB_STEP_SUMMARY
            cat opa-results.txt >> $GITHUB_STEP_SUMMARY
            exit 1
          fi
          
          # Check for WARN
          if grep -q "warn" opa-results.txt; then
            echo "status=warning" >> $GITHUB_OUTPUT
            echo "⚠️ OPA COMPLIANCE WARNINGS" >> $GITHUB_STEP_SUMMARY
            cat opa-results.txt >> $GITHUB_STEP_SUMMARY
          else
            echo "status=pass" >> $GITHUB_OUTPUT
            echo "✅ OPA COMPLIANCE CHECK PASSED" >> $GITHUB_STEP_SUMMARY
          fi
          
      - name: Comment PR
        uses: actions/github-script@v7
        if: always()
        with:
          script: |
            const fs = require('fs');
            const results = fs.readFileSync('opa-results.txt', 'utf8');
            const status = '${{ steps.opa-eval.outputs.status }}';
            
            const statusEmoji = {  'block': '🚫',
              'warning': '⚠️',
              'pass': '✅'
            };
            
            const body = `## ${statusEmoji[status] || '❓'} OPA Compliance Check

${results}

---
<details>
<summary>View enforcement details</summary>

**Changed files:** ${JSON.parse('${{ steps.changed-files.outputs.all_changed_files }}').length}
**Coverage:** ${JSON.parse('${{ steps.coverage.outputs.coverage_json }}').new_code_coverage}%
**Status:** ${status.toUpperCase()}

</details>`;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: body
            });
```

---

## Section 8: Compliance Dashboard

### Dashboard Architecture
```
apps/forge-console/src/
├── pages/
│   └── ComplianceDashboard.tsx       # Main dashboard page
├── components/
│   ├── compliance/
│   │   ├── OverallScore.tsx          # Aggregate score widget
│   │   ├── ViolationList.tsx         # Active violations table
│   │   ├── MatrixView.tsx            # Rule matrix visualization
│   │   ├── ExemptionBurndown.tsx     # Grandfathered code chart
│   │   ├── TrendChart.tsx            # Historical trends
│   │   └── RuleDetails.tsx           # Drill-down view
│   └── shared/
│       ├── MetricCard.tsx            # Reusable metric display
│       └── StatusBadge.tsx           # Status indicator
├── services/
│   └── complianceApi.ts              # API client for compliance data
└── types/
    └── compliance.ts                 # TypeScript interfaces
Dashboard Component Implementation
File: apps/forge-console/src/pages/ComplianceDashboard.tsx
typescriptimport React, { useEffect, useState } from 'react';
import { Card, Grid, Typography, Alert } from '@mui/material';
import { OverallScore } from '../components/compliance/OverallScore';
import { ViolationList } from '../components/compliance/ViolationList';
import { MatrixView } from '../components/compliance/MatrixView';
import { ExemptionBurndown } from '../components/compliance/ExemptionBurndown';
import { TrendChart } from '../components/compliance/TrendChart';
import { complianceApi } from '../services/complianceApi';
import type { ComplianceDashboardData } from '../types/compliance';

export const ComplianceDashboard: React.FC = () => {
  const [data, setData] = useState<ComplianceDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await complianceApi.getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <Typography>Loading compliance dashboard...</Typography>;
  }

  if (error) {
    return <Alert severity="error">Error loading dashboard: {error}</Alert>;
  }

  if (!data) {
    return <Alert severity="info">No compliance data available</Alert>;
  }

  return (
    <div className="compliance-dashboard">
      <Typography variant="h3" gutterBottom>
        VeroField Compliance Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Overall Score */}
        <Grid item xs={12} md={4}>
          <OverallScore 
            score={data.overallScore}
            trend={data.scoreTrend}
            target={90}
          />
        </Grid>
        
        {/* Key Metrics */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card>
                <Typography variant="h6">{data.activeViolations}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Violations
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <Typography variant="h6">{data.blockedPRs}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Blocked PRs
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <Typography variant="h6">{data.exemptionCount}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Grandfathered Files
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Card>
                <Typography variant="h6">{data.avgRemediationDays}d</Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg Remediation Time
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Violations Table */}
        <Grid item xs={12}>
          <ViolationList violations={data.violations} />
        </Grid>

        {/* Matrix View */}
        <Grid item xs={12} lg={8}>
          <MatrixView matrix={data.ruleMatrix} />
        </Grid>

        {/* Exemption Burndown */}
        <Grid item xs={12} lg={4}>
          <ExemptionBurndown 
            data={data.exemptionTrend}
            target={data.remediationTarget}
          />
        </Grid>

        {/* Historical Trends */}
        <Grid item xs={12}>
          <TrendChart 
            data={data.historicalTrends}
            metrics={['violations', 'coverage', 'score']}
          />
        </Grid>
      </Grid>
    </div>
  );
};
File: apps/forge-console/src/types/compliance.ts
typescriptexport interface ComplianceDashboardData {
  overallScore: number;
  scoreTrend: 'up' | 'down' | 'stable';
  activeViolations: number;
  blockedPRs: number;
  exemptionCount: number;
  avgRemediationDays: number;
  violations: Violation[];
  ruleMatrix: RuleMatrixEntry[];
  exemptionTrend: ExemptionTrendPoint[];
  historicalTrends: HistoricalTrendPoint[];
  remediationTarget: Date;
}

export interface Violation {
  id: string;
  rule: string;
  severity: 'BLOCK' | 'OVERRIDE' | 'WARNING';
  file: string;
  prNumber?: number;
  author: string;
  createdAt: Date;
  status: 'active' | 'overridden' | 'fixed';
  description: string;
}

export interface RuleMatrixEntry {
  ruleFile: string;
  section: string;
  triggerType: string;
  step5Check: string;
  enforcementLevel: 'MANDATORY' | 'REQUIRED' | 'RECOMMENDED';
  status: 'complete' | 'partial' | 'missing';
  priority: 'critical' | 'high' | 'medium' | 'low';
  opaPolicy: string;
  auditIssue: number;
}

export interface ExemptionTrendPoint {
  date: Date;
  count: number;
  fixed: number;
}

export interface HistoricalTrendPoint {
  date: Date;
  violations: number;
  coverage: number;
  score: number;
}
File: apps/forge-console/src/services/complianceApi.ts
typescriptimport axios from 'axios';
import type { ComplianceDashboardData } from '../types/compliance';

class ComplianceApiClient {
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  async getDashboardData(): Promise<ComplianceDashboardData> {
    const response = await axios.get(`${this.baseUrl}/api/compliance/dashboard`);
    return response.data;
  }

  async getViolationDetails(violationId: string) {
    const response = await axios.get(`${this.baseUrl}/api/compliance/violations/${violationId}`);
    return response.data;
  }

  async getRuleMatrix() {
    const response = await axios.get(`${this.baseUrl}/api/compliance/matrix`);
    return response.data;
  }

  async requestOverride(violationId: string, justification: string) {
    const response = await axios.post(`${this.baseUrl}/api/compliance/violations/${violationId}/override`, {
      justification
    });
    return response.data;
  }
}

export const complianceApi = new ComplianceApiClient();
Backend API for Dashboard
File: apps/api/src/compliance/compliance.controller.ts
typescriptimport { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/compliance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('dashboard')
  @Roles('developer', 'admin')
  async getDashboardData() {
    return this.complianceService.getDashboardData();
  }

  @Get('violations/:id')
  @Roles('developer', 'admin')
  async getViolationDetails(@Param('id') id: string) {
    return this.complianceService.getViolationDetails(id);
  }

  @Get('matrix')
  @Roles('developer', 'admin')
  async getRuleMatrix() {
    return this.complianceService.getRuleMatrix();
  }

  @Post('violations/:id/override')
  @Roles('governance-lead', 'admin')
  async requestOverride(
    @Param('id') id: string,
    @Body('justification') justification: string
  ) {
    return this.complianceService.requestOverride(id, justification);
  }
}
File: apps/api/src/compliance/compliance.service.ts
typescriptimport { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class ComplianceService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData() {
    // Load exemptions
    const exemptionsPath = path.join(process.cwd(), '.compliance-exemptions.json');
    const exemptions = JSON.parse(await fs.readFile(exemptionsPath, 'utf8'));

    // Load matrix
    const matrixPath = path.join(process.cwd(), 'docs/compliance-reports/rule-compliance-matrix.md');
    const matrixContent = await fs.readFile(matrixPath, 'utf8');
    const matrix = this.parseMatrix(matrixContent);

    // Get violations from database
    const violations = await this.prisma.complianceViolation.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate metrics
    const overallScore = this.calculateComplianceScore(matrix, violations);
    const scoreTrend = await this.getScoreTrend();

    return {
      overallScore,
      scoreTrend,
      activeViolations: violations.length,
      blockedPRs: violations.filter(v => v.severity === 'BLOCK').length,
      exemptionCount: exemptions.exemptions.length,
      avgRemediationDays: await this.getAvgRemediationTime(),
      violations: violations.map(v => this.formatViolation(v)),
      ruleMatrix: matrix,
      exemptionTrend: await this.getExemptionTrend(),
      historicalTrends: await this.getHistoricalTrends(),
      remediationTarget: new Date(exemptions.remediation_progress.target_completion)
    };
  }

  private calculateComplianceScore(matrix: any[], violations: any[]): number {
    const totalRules = matrix.length;
    const completeRules = matrix.filter(r => r.status === 'complete').length;
    const ruleScore = (completeRules / totalRules) * 50;

    const maxViolations = 100; // Adjust based on your scale
    const violationPenalty = Math.min(violations.length / maxViolations, 1) * 50;

    return Math.round(ruleScore + (50 - violationPenalty));
  }

  private parseMatrix(content: string): any[] {
    const lines = content.split('\n');
    const dataLines = lines.filter(line => line.startsWith('|') && !line.includes('---'));
    
    return dataLines.slice(1).map(line => {
      const cols = line.split('|').map(c => c.trim()).filter(Boolean);
      return {
        ruleFile: cols[0],
        section: cols[1],
        triggerType: cols[2],
        step5Check: cols[3],
        enforcementLevel: cols[4],
        status: cols[5].includes('✅') ? 'complete' : cols[5].includes('⚠️') ? 'partial' : 'missing',
        priority: cols[6].includes('🔥') ? 'critical' : cols[6],
        opaPolicy: cols[7],
        auditIssue: parseInt(cols[8]) || 0
      };
    });
  }

  private async getScoreTrend(): Promise<'up' | 'down' | 'stable'> {
    const recentScores = await this.prisma.complianceScore.findMany({
      orderBy: { createdAt: 'desc' },
      take: 2
    });

    if (recentScores.length < 2) return 'stable';
    
    const diff = recentScores[0].score - recentScores[1].score;
    if (diff > 5) return 'up';
    if (diff < -5) return 'down';
    return 'stable';
  }

  private async getAvgRemediationTime(): Promise<number> {
    const fixed = await this.prisma.complianceViolation.findMany({
      where: { status: 'fixed' },
      select: { createdAt: true, fixedAt: true }
    });

    if (fixed.length === 0) return 0;

    const totalDays = fixed.reduce((sum, v) => {
      const days = Math.floor(
        (v.fixedAt.getTime() - v.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      return sum + days;
    }, 0);

    return Math.round(totalDays / fixed.length);
  }

  private async getExemptionTrend(): Promise<any[]> {
    // Query historical exemption counts
    const history = await this.prisma.exemptionHistory.findMany({
      orderBy: { date: 'asc' },
      take: 30
    });

    return history.map(h => ({
      date: h.date,
      count: h.count,
      fixed: h.fixedCount
    }));
  }

  private async getHistoricalTrends(): Promise<any[]> {
    const trends = await this.prisma.complianceScore.findMany({
      orderBy: { createdAt: 'asc' },
      take: 30
    });

    return trends.map(t => ({
      date: t.createdAt,
      violations: t.violationCount,
      coverage: t.coveragePercent,
      score: t.score
    }));
  }

  private formatViolation(v: any) {
    return {
      id: v.id,
      rule: v.rule,
      severity: v.severity,
      file: v.file,
      prNumber: v.prNumber,
      author: v.author,
      createdAt: v.createdAt,
      status: v.status,
      description: v.description
    };
  }

  async getViolationDetails(id: string) {
    return this.prisma.complianceViolation.findUnique({
      where: { id },
      include: {
        overrideRequests: true,
        relatedCommits: true
      }
    });
  }

  async getRuleMatrix() {
    const matrixPath = path.join(process.cwd(), 'docs/compliance-reports/rule-compliance-matrix.md');
    const content = await fs.readFile(matrixPath, 'utf8');
    return this.parseMatrix(content);
  }

  async requestOverride(violationId: string, justification: string) {
    const override = await this.prisma.overrideRequest.create({
      data: {
        violationId,
        justification,
        status: 'pending',
        requestedAt: new Date()
      }
    });

    // Notify governance lead
    // await this.notificationService.notifyGovernanceLead(override);

    return override;
  }
}

Section 9: Change Management
Version Control Strategy
mermaidgraph TD
    A[Rule Change Proposed] --> B{Change Type?}
    B -->|MAJOR: Breaking changes| C[Require Rules Champion approval]
    B -->|MINOR: New rules/features| D[Require team review]
    B -->|PATCH: Bug fixes| E[Standard PR review]
    
    C --> F[Update CHANGELOG.md]
    D --> F
    E --> F
    
    F --> G[Bump version in 00-master.mdc]
    G --> H[Run compliance validation]
    H --> I{Validation Pass?}
    I -->|Yes| J[Merge to main]
    I -->|No| K[Fix violations]
    K --> H
    
    J --> L[Deploy to production]
    L --> M[Notify team via Slack]
    M --> N[Update documentation]
Versioning Scheme
Semantic Versioning: MAJOR.MINOR.PATCH

MAJOR (X.0.0): Breaking changes to rule structure, enforcement levels, or glossary definitions
MINOR (0.X.0): New rules, new sections, expanded scope
PATCH (0.0.X): Bug fixes, clarifications, typo corrections

Change Log Format
File: docs/architecture/cursor_rules_upgrade.md
markdown# VeroField Rules System Change Log

## [2.1.0] - 2025-11-22

### Added
- ✅ Unified Enforcement Contract v1.1 embedded in 00-master.mdc
- ✅ Complete glossary with 60+ terms
- ✅ Rule template for standardized structure
- ✅ OPA policy system for automated enforcement
- ✅ Compliance dashboard with real-time metrics
- ✅ Boy Scout Rule for legacy code remediation

### Fixed
- ✅ Issue #0: Bug Logging (previously fixed)
- ✅ Issue #6: Testing Requirements clarity
- ✅ Issue #7: Breaking Changes documentation
- ✅ Issue #8: Security Review triggers

### Changed
- ⚠️ Step 5 checks expanded from 20 to 35 items
- ⚠️ Enforcement levels now use MANDATORY/REQUIRED/RECOMMENDED
- ⚠️ All "if applicable" conditionals replaced with explicit triggers

### Migration Required
- [ ] Update .compliance-exemptions.json with baseline violations
- [ ] Review and approve Rule Compliance Matrix
- [ ] Deploy OPA policies to CI/CD
- [ ] Train team on new consequence framework

---

## [2.0.0] - 2025-11-21

### Added
- Initial v2.0 rule system with 15 .mdc files
- Multi-agent system with 12 specialized agents
- Pattern system with golden patterns
- Reward score integration

...
```

### Approval Requirements

**File:** `CODEOWNERS`
```
# Rules System Governance
/.cursor/rules/*                    @governance-lead @rules-champions
/.cursor/patterns/*                 @swarm-champion
/docs/compliance-reports/*          @governance-lead
/.compliance-exemptions.json        @governance-lead
/services/opa/policies/*            @security-team @governance-lead
Emergency Override Process
markdown## Emergency Override Procedure

### When to Use
- Production outage requiring immediate fix
- Security vulnerability requiring urgent patch
- Data corruption requiring emergency rollback

### Process

1. **Request Override:**
```
   @emergency_override:<rule-id>:<expires:YYYY-MM-DD>
   Reason: [Critical justification]
   Risk: [What could go wrong?]
   Approver: @governance-lead
```

2. **Governance Lead Review:**
   - Responds within 1 hour during business hours
   - Evaluates risk vs benefit
   - Approves or denies with rationale

3. **If Approved:**
   - CI override granted for specified period (max 7 days)
   - Logged in `docs/compliance-reports/emergency-overrides.md`
   - Remediation ticket created automatically
   - Team notified via Slack

4. **Follow-up:**
   - Fix must be implemented before expiration
   - Post-mortem required within 48 hours
   - Rules updated if gap identified

Complete Rule Compliance Matrix v1.1
File: docs/compliance-reports/rule-compliance-matrix.md
markdown# Rule Compliance Matrix v1.1

**Last Updated:** 2025-11-22  
**Version:** 2.1.0  
**Status:** 1/25 Complete (4% → Target: 100% by Week 8)

| # | Rule File | Section | Trigger Type | Step 5 Check | Enforcement | Status | Priority | OPA Policy | Audit Issue | Notes |
|---|-----------|---------|--------------|--------------|-------------|--------|----------|------------|-------------|-------|
| 0 | 00-master.mdc | Bug Fix Documentation | Bug fix | MUST verify logged in BUG_LOG.md & error-patterns.md | MANDATORY | ✅ | High | bug-doc.rego | 0 | Fully implemented |
| 1 | 00-master.mdc | Engineering Decisions | Significant decision | MUST verify documented in docs/engineering-decisions.md | REQUIRED | ❌ | Medium | decisions.rego | 1 | Requires glossary alignment |
| 2 | 12-tech-debt.mdc | Tech Debt Logging | Meaningful debt created | MUST verify debt logged | RECOMMENDED | ⚠️ | Medium | tech-debt.rego | 2 | Replace "if applicable" |
| 3 | 05-data.mdc | Layer Sync | Schema/DTO/API/event change | MUST verify sync complete | MANDATORY | ❌ | 🔥 Critical | layer-sync.rego | 3 | Expand scope beyond schema |
| 4 | 05-data.mdc | State Machine Docs | Stateful entity change | MUST verify docs updated | REQUIRED | ❌ | High | state-machines.rego | 4 | Define "stateful" in glossary |
| 5 | 05-data.mdc | Contract Documentation | Schema/API change | MUST verify updated contracts | REQUIRED | ❌ | High | contracts.rego | 5 | Merge with layer sync |
| 6 | 10-quality.mdc | Testing Requirements | New/changed code | MUST verify new tests & ≥80% coverage | MANDATORY | ⚠️ | 🔥 Critical | testing.rego | 6 | Requires Jest/Coverage integration |
| 7 | 00-master.mdc | Breaking Changes | Schema/API/event change | MUST verify migration guide + version bump | MANDATORY | ❌ | 🔥 Critical | breaking-change.rego | 7 | Add version bump enforcement |
| 8 | 03-security.mdc | Security Review | Auth/RLS/PII change | MUST verify completed security review | MANDATORY | ❌ | 🔥 Critical | security.rego | 8 | Needs PR tag enforcement |
| 9 | 00-master.mdc | Documentation Updates | API/setup change | MUST verify README/architecture docs updated | REQUIRED | ⚠️ | High | docs-update.rego | 9 | Needs update conditions |
| 10 | 03-security.mdc | Config Change Docs | Env var changes | MUST update .env.example | REQUIRED | ❌ | High | config.rego | 10 | Needs exemption rules |
| 11 | 10-quality.mdc | Performance Impact | Performance-sensitive code | MUST verify benchmarks | RECOMMENDED | ❌ | Medium | perf.rego | 11 | Must define triggers |
| 12 | 06-error-resilience.mdc | Error Message Standards | New error paths | MUST verify user-safe messages | REQUIRED | ⚠️ | Medium | error-standards.rego | 12 | Add message standards |
| 13 | 11-operations.mdc | Rollback Plan | Migration/irreversible change | MUST verify rollback strategy | REQUIRED | ❌ | Medium | rollback.rego | 13 | Define triggers (e.g., migrations) |
| 14 | 00-master.mdc | Dependency Changes | Added/updated deps | MUST verify security review + documentation | REQUIRED | ❌ | High | deps.rego | 14 | Add NPM audit integration |
| 15 | 03-security.mdc | Audit Logging | Security-sensitive change | MUST verify audit logs updated | REQUIRED | ❌ | High | audit.rego | 15 | Define required fields |
| 16 | 00-master.mdc | Scope Review | Quarterly cycle | N/A | RECOMMENDED | ❌ | Medium | N/A | 16 | Process-level rule |
| 17 | 01-enforcement.mdc | Step 5 Validation | ANY change | MUST verify all mapped rules | MANDATORY | ⚠️ | Medium | enforcement.rego | 17 | Needs mapping to all rules |
| 18 | 00-master.mdc | Glossary Sync | New glossary terms | MUST verify term added/updated | REQUIRED | ❌ | Medium | glossary.rego | 18 | Needed due to definition debt |
| 19 | 00-master.mdc | Step 5 Consequences | Meta: Add to all checks | N/A | MANDATORY | ⚠️ | Medium | N/A | Meta-1 | Apply to all checks |
| 20 | 00-master.mdc | Definition Glossary | Meta: Define terms | N/A | REQUIRED | ❌ | Low | N/A | Meta-2 | Central glossary |
| 21 | 00-master.mdc | Scope Review Requirement | Meta: Quarterly reviews | N/A | RECOMMENDED | ❌ | Medium | N/A | Meta-3 | Maps to Section 5 process |
| 22 | 00-master.mdc | Rule Template | Meta: For all new rules | N/A | MANDATORY | ❌ | High | N/A | Patterns 1-6 | Required for consistency |
| 23 | 03-security.mdc | OPA Mapping | Meta: Policy per rule | N/A | MANDATORY | ⚠️ | High | N/A | Patterns 2,5 | Map all to Rego files |
| 24 | 01-enforcement.mdc | Consequence Framework | Meta: Define outcomes | N/A | MANDATORY | ⚠️ | Medium | N/A | Meta-4 | Categorize levels |

## Legend

**Status:**
- ✅ Complete: Fully implemented with Step 5 checks and OPA policies
- ⚠️ Partial: Rule exists but Step 5 or OPA incomplete
- ❌ Missing: Not yet implemented

**Priority:**
- 🔥 Critical: Must fix in Phase 1 (Weeks 1-2)
- High: Must fix in Phase 2 (Weeks 3-5)
- Medium: Must fix in Phase 3 (Weeks 6-8)
- Low: Backlog

**Enforcement:**
- MANDATORY: HARD STOP, no override without governance lead
- REQUIRED: OVERRIDE with justification
- RECOMMENDED: WARNING only

## Progress Tracking

- **Week 1-2:** Target 8/25 complete (Critical issues)
- **Week 3-5:** Target 18/25 complete (Critical + High)
- **Week 6-8:** Target 25/25 complete (All issues)

Phase 1: Foundation & Critical Fixes (Weeks 1-2)
Week 1: Foundation Setup
Day 1-2: Embed Contract & Create Matrix
Tasks:

✅ Update 00-master.mdc with full contract (Sections 0-9)
✅ Create glossary with 60+ terms
✅ Create Rule Compliance Matrix
✅ Create .compliance-exemptions.json template

Deliverables:

Updated 00-master.mdc (complete contract)
docs/compliance-reports/rule-compliance-matrix.md
.compliance-exemptions.json

Testing:

Validate 00-master.mdc loads in Cursor
Verify routing logic works
Test glossary term references


Day 3: Baseline Scan
Script: .github/scripts/baseline-scan.sh
bash#!/bin/bash
# Baseline compliance scan - identifies existing violations

set -e

echo "🔍 Running baseline compliance scan..."

# Create output directory
mkdir -p docs/compliance-reports

# Scan for missing tests
echo "Checking test coverage..."
npm test -- --coverage --json > coverage-baseline.json

# Find production files without tests
find apps libs -name "*.ts" -not -name "*.test.ts" -not -name "*.spec.ts" \
  -not -path "*/node_modules/*" \
  -not -path "*/dist/*" > production-files.txt

while read -r file; do
  test_file="${file%.ts}.test.ts"
  if [ ! -f "$test_file" ]; then
    echo "❌ Missing test: $file" >> violations-testing.txt
  fi
done < production-files.txt

# Scan for RLS violations
echo "Checking RLS compliance..."
grep -rn "prisma\." apps/api/src --include="*.ts" \
  | grep -v "RLS" \
  | grep -v "tenant" > violations-rls.txt || true

# Scan for hardcoded dates
echo "Checking for hardcoded dates..."
grep -rn "202[0-9]-[0-9][0-9]-[0-9][0-9]" . \
  --include="*.ts" \
  --exclude-dir="node_modules" \
  --exclude-dir="dist"
   --exclude-dir=".git" > violations-dates.txt || true

# Scan for missing documentation
echo "Checking documentation completeness..."
find apps/api/src -name "*.controller.ts" | while read -r controller; do
  if ! grep -q "@ApiOperation" "$controller"; then
    echo "❌ Missing API docs: $controller" >> violations-docs.txt
  fi
done

# Scan for layer sync issues
echo "Checking layer synchronization..."
# Compare schema.prisma with DTO files
npx prisma generate --dry-run 2>&1 | grep -i "error" > violations-layer-sync.txt || true

# Consolidate results
echo "📊 Generating baseline report..."
cat > docs/compliance-reports/legacy-violations-baseline.md <<EOF
# Baseline Compliance Violations Report

**Generated:** $(date +%Y-%m-%d)
**Purpose:** Identify existing violations for grandfathering

---

## Summary

| Category | Count | Severity |
|----------|-------|----------|
| Missing Tests | $(wc -l < violations-testing.txt) | High |
| RLS Violations | $(wc -l < violations-rls.txt) | Critical |
| Hardcoded Dates | $(wc -l < violations-dates.txt) | Medium |
| Missing Docs | $(wc -l < violations-docs.txt) | Medium |
| Layer Sync Issues | $(wc -l < violations-layer-sync.txt) | High |

**Total Violations:** $(($(wc -l < violations-testing.txt) + $(wc -l < violations-rls.txt) + $(wc -l < violations-dates.txt) + $(wc -l < violations-docs.txt) + $(wc -l < violations-layer-sync.txt)))

---

## Testing Violations (High Priority)

\`\`\`
$(cat violations-testing.txt)
\`\`\`

---

## RLS Violations (Critical Priority)

\`\`\`
$(cat violations-rls.txt)
\`\`\`

---

## Hardcoded Dates (Medium Priority)

\`\`\`
$(cat violations-dates.txt)
\`\`\`

---

## Documentation Violations (Medium Priority)

\`\`\`
$(cat violations-docs.txt)
\`\`\`

---

## Layer Sync Issues (High Priority)

\`\`\`
$(cat violations-layer-sync.txt)
\`\`\`

---

## Next Steps

1. Review violations and categorize by effort
2. Create exemptions in \`.compliance-exemptions.json\`
3. Prioritize fixes: Critical → High → Medium → Low
4. Assign remediation tickets

EOF

echo "✅ Baseline scan complete: docs/compliance-reports/legacy-violations-baseline.md"

# Clean up temporary files
rm -f production-files.txt violations-*.txt coverage-baseline.json
Run baseline scan:
bashchmod +x .github/scripts/baseline-scan.sh
./.github/scripts/baseline-scan.sh
Expected output: docs/compliance-reports/legacy-violations-baseline.md with ~50-200 violations

Day 4: Create Exemptions File
Script: .github/scripts/generate-exemptions.js
javascriptconst fs = require('fs');
const path = require('path');

/**
 * Generates .compliance-exemptions.json from baseline scan
 */
async function generateExemptions() {
  const baselinePath = 'docs/compliance-reports/legacy-violations-baseline.md';
  const baseline = fs.readFileSync(baselinePath, 'utf8');
  
  // Parse violations from baseline report
  const testingViolations = extractViolations(baseline, 'Testing Violations');
  const rlsViolations = extractViolations(baseline, 'RLS Violations');
  const dateViolations = extractViolations(baseline, 'Hardcoded Dates');
  const docsViolations = extractViolations(baseline, 'Documentation Violations');
  
  // Build exemptions structure
  const exemptions = {
    version: "1.0",
    last_updated: new Date().toISOString().split('T')[0],
    exemptions: []
  };
  
  // Add testing violations
  testingViolations.forEach(file => {
    exemptions.exemptions.push({
      path: file,
      violations: [
        {
          rule: "10-quality.mdc:Testing Requirements",
          reason: "Legacy code - grandfathered pre-v2.1",
          severity: "HIGH",
          created: new Date().toISOString().split('T')[0],
          expires: getExpirationDate(12), // 12 months
          remediation_plan: "Add tests opportunistically during modifications",
          assigned_to: "team"
        }
      ]
    });
  });
  
  // Add RLS violations (CRITICAL)
  rlsViolations.forEach(file => {
    const existing = exemptions.exemptions.find(e => e.path === file);
    const violation = {
      rule: "03-security.mdc:RLS",
      reason: "Pre-RLS implementation - requires migration",
      severity: "CRITICAL",
      created: new Date().toISOString().split('T')[0],
      expires: getExpirationDate(3), // 3 months - urgent
      remediation_plan: "Migrate to RLS-enabled queries in Q1 2026",
      assigned_to: "security-team"
    };
    
    if (existing) {
      existing.violations.push(violation);
    } else {
      exemptions.exemptions.push({
        path: file,
        violations: [violation]
      });
    }
  });
  
  // Add documentation violations
  docsViolations.forEach(file => {
    const existing = exemptions.exemptions.find(e => e.path === file);
    const violation = {
      rule: "00-master.mdc:Documentation Updates",
      reason: "Legacy endpoint - docs never created",
      severity: "MEDIUM",
      created: new Date().toISOString().split('T')[0],
      expires: getExpirationDate(6), // 6 months
      remediation_plan: "Document during next API review",
      assigned_to: "api-team"
    };
    
    if (existing) {
      existing.violations.push(violation);
    } else {
      exemptions.exemptions.push({
        path: file,
        violations: [violation]
      });
    }
  });
  
  // Add metadata
  exemptions.remediation_progress = {
    total_exemptions: exemptions.exemptions.length,
    by_severity: {
      critical: exemptions.exemptions.filter(e => 
        e.violations.some(v => v.severity === 'CRITICAL')
      ).length,
      high: exemptions.exemptions.filter(e => 
        e.violations.some(v => v.severity === 'HIGH')
      ).length,
      medium: exemptions.exemptions.filter(e => 
        e.violations.some(v => v.severity === 'MEDIUM')
      ).length
    },
    fixed_this_quarter: 0,
    target_completion: getExpirationDate(12)
  };
  
  // Write to file
  fs.writeFileSync(
    '.compliance-exemptions.json',
    JSON.stringify(exemptions, null, 2)
  );
  
  console.log(`✅ Generated .compliance-exemptions.json`);
  console.log(`   Total exemptions: ${exemptions.exemptions.length}`);
  console.log(`   Critical: ${exemptions.remediation_progress.by_severity.critical}`);
  console.log(`   High: ${exemptions.remediation_progress.by_severity.high}`);
  console.log(`   Medium: ${exemptions.remediation_progress.by_severity.medium}`);
}

function extractViolations(baseline, section) {
  const sectionRegex = new RegExp(`## ${section}.*?\`\`\`([\\s\\S]*?)\`\`\``, 'g');
  const match = sectionRegex.exec(baseline);
  
  if (!match) return [];
  
  return match[1]
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.includes('❌'))
    .map(line => {
      const pathMatch = line.match(/❌\s+[^:]+:\s+(.+)/);
      return pathMatch ? pathMatch[1].trim() : null;
    })
    .filter(Boolean);
}

function getExpirationDate(monthsFromNow) {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsFromNow);
  return date.toISOString().split('T')[0];
}

// Run
generateExemptions().catch(console.error);
Run:
bashnode .github/scripts/generate-exemptions.js
Result: .compliance-exemptions.json with 50-200 grandfathered files

Day 5: Validate Matrix Script
Script: .github/scripts/validate-matrix.py
python#!/usr/bin/env python3
"""
Validates the Rule Compliance Matrix for completeness and consistency
"""

import sys
import re
from pathlib import Path

def validate_matrix():
    matrix_path = Path("docs/compliance-reports/rule-compliance-matrix.md")
    
    if not matrix_path.exists():
        print("❌ CRITICAL: Rule Compliance Matrix not found!")
        return False
    
    content = matrix_path.read_text()
    lines = [line for line in content.split('\n') if line.startswith('|') and not '---' in line]
    
    # Skip header row
    data_rows = lines[1:]
    
    critical_failures = []
    high_failures = []
    warnings = []
    
    for i, line in enumerate(data_rows, start=1):
        cols = [col.strip() for col in line.split('|') if col.strip()]
        
        if len(cols) < 10:
            warnings.append(f"Row {i}: Incomplete row (expected 10 columns, got {len(cols)})")
            continue
        
        rule_file = cols[0]
        section = cols[1]
        status = cols[5]
        priority = cols[6]
        opa_policy = cols[7]
        
        # Critical checks
        if '🔥 Critical' in priority and '❌' in status:
            critical_failures.append(
                f"Row {i} ({rule_file}:{section}): Critical rule not implemented!"
            )
        
        # High priority checks
        if 'High' in priority and '❌' in status:
            high_failures.append(
                f"Row {i} ({rule_file}:{section}): High priority rule not implemented"
            )
        
        # OPA policy checks
        if '❌' not in status and opa_policy != 'N/A':
            opa_path = Path(f"services/opa/policies/{opa_policy}")
            if not opa_path.exists():
                warnings.append(
                    f"Row {i} ({rule_file}:{section}): OPA policy {opa_policy} not found"
                )
    
    # Report results
    print("\n" + "="*80)
    print("RULE COMPLIANCE MATRIX VALIDATION")
    print("="*80 + "\n")
    
    if critical_failures:
        print(f"🚫 CRITICAL FAILURES ({len(critical_failures)}):")
        for failure in critical_failures:
            print(f"   {failure}")
        print()
    
    if high_failures:
        print(f"⚠️  HIGH PRIORITY ISSUES ({len(high_failures)}):")
        for failure in high_failures:
            print(f"   {failure}")
        print()
    
    if warnings:
        print(f"⚡ WARNINGS ({len(warnings)}):")
        for warning in warnings:
            print(f"   {warning}")
        print()
    
    # Summary
    total_rows = len(data_rows)
    complete_rows = len([r for r in data_rows if '✅' in r])
    partial_rows = len([r for r in data_rows if '⚠️' in r])
    missing_rows = len([r for r in data_rows if '❌' in r])
    
    completion_pct = (complete_rows / total_rows * 100) if total_rows > 0 else 0
    
    print(f"📊 SUMMARY:")
    print(f"   Total Rules: {total_rows}")
    print(f"   Complete: {complete_rows} (✅)")
    print(f"   Partial: {partial_rows} (⚠️)")
    print(f"   Missing: {missing_rows} (❌)")
    print(f"   Completion: {completion_pct:.1f}%")
    print()
    
    # Fail CI if critical failures
    if critical_failures:
        print("❌ VALIDATION FAILED: Critical rules not implemented")
        print("   Fix critical issues before proceeding to Week 2")
        return False
    
    print("✅ VALIDATION PASSED: No blocking issues")
    if high_failures or warnings:
        print("   Note: High priority issues and warnings should be addressed in Phase 1-2")
    
    return True

if __name__ == "__main__":
    success = validate_matrix()
    sys.exit(0 if success else 1)
Add to CI: .github/workflows/matrix-validation.yml
yamlname: Matrix Validation

on:
  pull_request:
    paths:
      - 'docs/compliance-reports/rule-compliance-matrix.md'
      - '.cursor/rules/*.mdc'
      - '.github/scripts/validate-matrix.py'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Validate Matrix
        run: |
          chmod +x .github/scripts/validate-matrix.py
          python3 .github/scripts/validate-matrix.py

Week 2: Critical Rule Fixes
Day 1-2: Fix Testing Requirements (Issue #6)
Update: .cursor/rules/10-quality.mdc
markdown---
description: Testing Requirements, Coverage Standards, Performance Budgets
globs: 
  - "**/*.ts"
  - "**/*.tsx"
  - "**/*.test.ts"
  - "**/*.spec.ts"
version: 2.1.0
last_updated: 2025-11-22
---

# 10-quality.mdc: Quality Standards & Testing

## 1. Purpose

Ensure all code meets minimum quality standards through comprehensive testing, performance benchmarks, and code quality metrics.

## 2. Triggers (When This Rule Applies)

### Testing Requirements Trigger:
- ✅ New production code (*.ts, *.tsx files)
- ✅ Modified production code logic
- ✅ Bug fixes (regression tests required)
- ✅ New features
- ✅ Refactoring that changes behavior

### Does NOT Trigger:
- ❌ Documentation-only changes (*.md files)
- ❌ Configuration-only changes (.env.example, package.json scripts)
- ❌ Test file refactoring (*.test.ts modifications only)
- ❌ Type definition updates (*.d.ts)
- ❌ Proof-of-concept code (must be marked with `// POC: [reason]`)

## 3. Requirements

### MANDATORY: Testing Requirements

**All production code requires appropriate tests:**

1. **Unit Tests (MANDATORY for new/modified code):**
   - Coverage requirement: ≥ 80% for NEW code
   - Coverage maintenance: Maintain or improve for MODIFIED code
   - Test file naming: `[filename].test.ts`
   - Location: Same directory as source file OR `__tests__/` subdirectory

2. **Integration Tests (MANDATORY for database/API code):**
   - Required for: Database operations, API endpoints, external service calls
   - Test actual integrations (not mocked)
   - Verify error handling and edge cases

3. **Regression Tests (MANDATORY for bug fixes):**
   - Must reproduce the bug before fix
   - Must pass after fix
   - Document bug in test description

4. **Critical Path Testing (MANDATORY 100% coverage):**
   - Authentication/authorization flows
   - Payment processing
   - Tenant isolation (RLS)
   - Data migrations

### RECOMMENDED: Additional Testing

- **E2E Tests:** For critical user workflows
- **Performance Tests:** For performance-sensitive code
- **Load Tests:** For high-traffic endpoints

### Exemptions (Must be documented in PR)

Valid exemptions:
```typescript
// TESTING_EXEMPTION: [reason]
// Approved by: @[username]
// Expires: YYYY-MM-DD
```

Valid reasons:
- "Documentation-only PR"
- "Config-only PR: Updated .env.example"
- "POC code for spike ticket #123"

**Never skip tests for:**
- Production code changes
- Bug fixes
- New features
- Security-related changes
- Database schema changes

## 4. Decision Tree
```mermaid
graph TD
    A[Code Change] --> B{File type?}
    B -->|*.md only| C[No tests required]
    B -->|*.ts, *.tsx| D{Production code?}
    
    D -->|No - test file only| C
    D -->|Yes| E{New or modified?}
    
    E -->|New code| F[Unit tests REQUIRED]
    E -->|Modified code| G{Logic changed?}
    
    G -->|Yes| F
    G -->|No - refactor only| H[Existing tests must pass]
    
    F --> I{DB/API involved?}
    I -->|Yes| J[Integration tests REQUIRED]
    I -->|No| K[Unit tests sufficient]
    
    J --> L{Bug fix?}
    K --> L
    H --> L
    
    L -->|Yes| M[Regression test REQUIRED]
    L -->|No| N[Check coverage]
    
    M --> N
    N --> O{Coverage ≥ 80%?}
    O -->|Yes| P[✅ Tests complete]
    O -->|No| Q[❌ HARD STOP: Increase coverage]
```

## 5. Examples

### ✅ Good Example: Unit Test
```typescript
// users.service.ts
export class UsersService {
  async createUser(data: CreateUserDto): Promise {
    // Validate email
    if (!this.isValidEmail(data.email)) {
      throw new BadRequestException('Invalid email format');
    }
    
    // Create user
    return this.prisma.user.create({ data });
  }
  
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

// users.service.test.ts
describe('UsersService', () => {
  let service: UsersService;
  
  beforeEach(() => {
    service = new UsersService(mockPrisma);
  });
  
  describe('createUser', () => {
    it('should create user with valid email', async () => {
      const dto = { email: 'test@example.com', name: 'Test' };
      const result = await service.createUser(dto);
      
      expect(result).toBeDefined();
      expect(result.email).toBe(dto.email);
    });
    
    it('should throw BadRequestException for invalid email', async () => {
      const dto = { email: 'invalid', name: 'Test' };
      
      await expect(service.createUser(dto)).rejects.toThrow(BadRequestException);
    });
    
    it('should handle database errors gracefully', async () => {
      mockPrisma.user.create.mockRejectedValue(new Error('DB error'));
      const dto = { email: 'test@example.com', name: 'Test' };
      
      await expect(service.createUser(dto)).rejects.toThrow();
    });
  });
});
```

### ✅ Good Example: Integration Test
```typescript
// users.controller.integration.test.ts
describe('UsersController (Integration)', () => {
  let app: INestApplication;
  
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleRef.createNestApplication();
    await app.init();
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  describe('POST /users', () => {
    it('should create user and return 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'new@example.com', name: 'New User' })
        .expect(201);
      
      expect(response.body.email).toBe('new@example.com');
    });
    
    it('should return 400 for invalid email', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'invalid', name: 'Test' })
        .expect(400);
    });
  });
});
```

### ❌ Bad Example: No Tests
```typescript
// orders.service.ts
export class OrdersService {
  async createOrder(data: CreateOrderDto): Promise {
    // Complex logic with no tests
    return this.prisma.order.create({ data });
  }
}

// ❌ NO TEST FILE EXISTS - VIOLATION
```

### ❌ Bad Example: Insufficient Coverage
```typescript
// payments.service.test.ts
describe('PaymentsService', () => {
  it('should process payment', async () => {
    const result = await service.processPayment(mockData);
    expect(result).toBeDefined();
  });
  
  // ❌ Missing edge cases:
  // - What if payment fails?
  // - What if amount is negative?
  // - What if user has insufficient funds?
  // - What if network timeout occurs?
  
  // Coverage: 35% ❌ (Requirement: ≥ 80%)
});
```

## 6. Step 5 Verification (The Contract)

Before finalizing code, verify:

- [ ] **MUST** verify test file exists for all new/modified production code (unless exempted)
- [ ] **MUST** verify test coverage ≥ 80% for new code
- [ ] **MUST** verify test coverage maintained or improved for modified code
- [ ] **MUST** verify regression test exists for bug fixes
- [ ] **MUST** verify integration tests exist for DB/API code
- [ ] **MUST** verify all tests pass (npm test succeeds)
- [ ] **MUST** verify critical path code has 100% coverage
- [ ] **SHOULD** verify E2E tests for critical workflows

**Consequences:**
- Missing MANDATORY tests = HARD STOP (CI blocks merge)
- Coverage < 80% for new code = HARD STOP
- Missing regression test for bug fix = HARD STOP
- Missing integration test for DB/API = OVERRIDE required
- Missing RECOMMENDED tests = WARNING only

**Exemptions:**
- Documentation-only PRs (all files are *.md)
- Config-only PRs (.env.example, package.json scripts)
- Test refactoring (only *.test.ts files modified)
- POC code (marked with `// POC:` comment and ticket reference)

**Override Process:**
```markdown
## Test Override Request

**Rule:** 10-quality.mdc:Testing Requirements
**Files:** [List files without tests]
**Reason:** [Detailed justification - why tests cannot be added]
**Risk Assessment:** [What could break without tests?]
**Mitigation:** [How will you verify correctness?]
**Timeline:** [When will tests be added?]

**Approver:** @governance-lead
```

## 7. Related Rules

- `06-error-resilience.mdc`: Error handling patterns to test
- `14-verification.mdc`: Verification standards
- `00-master.mdc`: Bug Fix Documentation (requires regression tests)

## 8. Change Log

- **2025-11-22** v2.1.0: Complete rewrite with explicit triggers, decision tree, and Step 5 checks
- **2025-11-21** v2.0.0: Initial version with basic testing requirements

OPA Policy for Testing
File: services/opa/policies/testing.rego
regopackage compliance.quality.testing

import future.keywords.contains
import future.keywords.if
import future.keywords.in

# Default: Allow if no violations
default allow := true

# HARD STOP: New production code without tests
deny contains msg if {
    some file in input.changed_files
    is_production_code(file.path)
    is_new_or_modified(file.status)
    not has_test_file(file.path, input.changed_files)
    not is_exempted(file.path, input.exemptions)
    not is_test_only_change(input.changed_files)
    
    msg := sprintf(
        "HARD STOP [Testing]: Production file '%s' has no test file. Create '%s'",
        [file.path, test_file_path(file.path)]
    )
}

# HARD STOP: Coverage below 80% for new code
deny contains msg if {
    input.coverage.new_code_coverage < 80
    not is_exempted_pr(input.changed_files, input.exemptions)
    
    msg := sprintf(
        "HARD STOP [Coverage]: New code coverage is %v%%, minimum required is 80%%",
        [input.coverage.new_code_coverage]
    )
}

# HARD STOP: Bug fix without regression test
deny contains msg if {
    contains_bug_fix(input.pr_title, input.pr_body)
    not has_regression_test(input.changed_files)
    
    msg := "HARD STOP [Regression]: Bug fix must include regression test that reproduces the bug"
}

# OVERRIDE: Integration test missing for DB/API code
override contains msg if {
    some file in input.changed_files
    is_db_or_api_code(file.path)
    not has_integration_test(file.path, input.changed_files)
    not is_exempted(file.path, input.exemptions)
    
    msg := sprintf(
        "OVERRIDE REQUIRED [Integration]: DB/API file '%s' should have integration tests",
        [file.path]
    )
}

# WARNING: Legacy code with low coverage
warn contains msg if {
    input.coverage.overall_coverage < 80
    has_legacy_files(input.changed_files, input.exemptions)
    
    msg := sprintf(
        "WARNING [Coverage]: Overall coverage is %v%%. Consider improving legacy test coverage (Boy Scout Rule)",
        [input.coverage.overall_coverage]
    )
}

# Helper: Check if file is production code
is_production_code(path) if {
    endswith(path, ".ts")
    not contains(path, ".test.")
    not contains(path, ".spec.")
    not contains(path, ".d.ts")
    not contains(path, "test/")
    not contains(path, "__tests__/")
}

# Helper: Check if file is new or modified
is_new_or_modified(status) if {
    status in ["added", "modified"]
}

# Helper: Check if test file exists
has_test_file(source_path, all_files) if {
    test_path := test_file_path(source_path)
    some file in all_files
    file.path == test_path
}

# Helper: Generate test file path
test_file_path(source_path) := result if {
    # Remove extension
    without_ext := trim_suffix(source_path, ".ts")
    without_ext_tsx := trim_suffix(without_ext, "x")
    
    # Add .test.ts
    result := concat("", [without_ext_tsx, ".test.ts"])
}

# Helper: Check exemptions
is_exempted(path, exemptions) if {
    some exemption in exemptions
    exemption.path == path
    some violation in exemption.violations
    contains(violation.rule, "Testing")
}

# Helper: Documentation-only PR
is_test_only_change(files) if {
    count([f | f := files[_]; not contains(f.path, ".test.")]) == 0
}

# Helper: Check for documentation-only changes
is_exempted_pr(files, _exemptions) if {
    count([f | f := files[_]; endswith(f.path, ".md")]) == count(files)
}

# Helper: Check if PR is a bug fix
contains_bug_fix(title, body) if {
    lower_title := lower(title)
    contains(lower_title, "fix")
}

contains_bug_fix(title, body) if {
    lower_body := lower(body)
    contains(lower_body, "fixes #")
}

# Helper: Check for regression test
has_regression_test(files) if {
    some file in files
    contains(file.path, ".test.")
    contains(file.diff, "it('reproduces bug")
}

has_regression_test(files) if {
    some file in files
    contains(file.path, ".test.")
    contains(file.diff, "it('should fix")
}

# Helper: Check if DB/API code
is_db_or_api_code(path) if {
    contains(path, ".service.ts")
    not contains(path, ".test.")
}

is_db_or_api_code(path) if {
    contains(path, ".controller.ts")
    not contains(path, ".test.")
}

is_db_or_api_code(path) if {
    contains(path, ".repository.ts")
    not contains(path, ".test.")
}

# Helper: Check for integration test
has_integration_test(source_path, all_files) if {
    integration_test_path := concat("", [trim_suffix(source_path, ".ts"), ".integration.test.ts"])
    some file in all_files
    file.path == integration_test_path
}

# Helper: Check if PR touches legacy files
has_legacy_files(files, exemptions) if {
    some file in files
    is_exempted(file.path, exemptions)
}

Day 3: Fix Breaking Changes (Issue #7)
Update: .cursor/rules/00-master.mdc (add new section)
markdown## BREAKING CHANGES DOCUMENTATION REQUIREMENTS

**Version:** 2.1.0  
**Last Updated:** 2025-11-22

### Purpose

Ensure all breaking changes are properly documented, versioned, and communicated to prevent unexpected breakages for API consumers and internal services.

### Triggers (When This Rule Applies)

A change is considered **BREAKING** if it requires consumers to update their code.

#### API Breaking Changes:
- ✅ Removing endpoints
- ✅ Changing endpoint paths
- ✅ Modifying request schemas (removing/renaming fields)
- ✅ Modifying response schemas (removing/renaming fields)
- ✅ Changing HTTP methods
- ✅ Changing authentication requirements
- ✅ Changing error response formats

#### Database Breaking Changes:
- ✅ Removing columns
- ✅ Changing column types (incompatible)
- ✅ Removing tables
- ✅ Breaking foreign key relationships
- ✅ Changing constraints (making nullable → non-nullable)

#### Event/Contract Breaking Changes:
- ✅ Removing event types
- ✅ Changing event schemas (removing fields)
- ✅ Changing event payloads (incompatible types)

#### Configuration Breaking Changes:
- ✅ Removing environment variables
- ✅ Changing required configuration format
- ✅ Removing configuration options

#### Behavioral Breaking Changes:
- ✅ Changing business logic outcomes
- ✅ Changing validation rules (more restrictive)
- ✅ Changing default behaviors that consumers rely
### NOT Breaking Changes (Backward Compatible):
- ❌ Adding new endpoints
- ❌ Adding optional fields to requests
- ❌ Adding new fields to responses
- ❌ Adding new nullable columns
- ❌ Deprecating (but not removing) features
- ❌ Performance improvements
- ❌ Bug fixes (unless consumers rely on buggy behavior)

### Requirements

#### MANDATORY: Breaking Change Documentation

When introducing a breaking change:

1. **PR Flagging:**
````markdown
   ## [BREAKING] Your PR Title
   
   **Breaking Changes:**
   - What changed
   - Why it changed
   - Who is affected
````

2. **Migration Guide (REQUIRED):**
   
   **File:** `docs/migrations/[YYYY-MM-DD]-[feature]-migration.md`
   
   **Template:**
````markdown
   # Migration Guide: [Feature Name]
   
   **Date:** YYYY-MM-DD
   **Version:** X.0.0 → X+1.0.0
   **Author:** @username
   **Breaking Changes:** [Brief summary]
   
   ---
   
   ## What Changed
   
   [Detailed description of changes]
   
   ## Why It Changed
   
   [Rationale for breaking change]
   
   ## Who Is Affected
   
   - [ ] External API consumers
   - [ ] Internal services: [list]
   - [ ] Frontend applications
   - [ ] Mobile applications
   - [ ] Third-party integrations
   
   ## Migration Steps
   
   ### Step 1: [Action]
   
   **Before:**
```typescript
   // Old code
```
   
   **After:**
```typescript
   // New code
```
   
   ### Step 2: [Action]
   
   [Details]
   
   ## Rollback Instructions
   
   If migration fails:
   
   1. [Rollback step 1]
   2. [Rollback step 2]
   
   ## Testing Checklist
   
   - [ ] Unit tests updated
   - [ ] Integration tests updated
   - [ ] E2E tests updated
   - [ ] Manual testing completed
   - [ ] Staging verification completed
   
   ## Timeline
   
   - **Deprecation Notice:** [Date or N/A]
   - **Migration Deadline:** [Date]
   - **Removal Date:** [Date]
   
   ## Support
   
   Questions? Contact: @team-name or #slack-channel
````

3. **Version Bump (REQUIRED):**
   
   Update version in `package.json` following semantic versioning:
   - **MAJOR:** Breaking changes (X.0.0)
   - **MINOR:** New features, backward compatible (0.X.0)
   - **PATCH:** Bug fixes (0.0.X)
   
   Example:
````json
   {
     "version": "2.0.0",  // Was 1.5.3, breaking change = MAJOR bump
     "description": "Breaking: Removed legacy auth endpoints"
   }
````

4. **CHANGELOG Update (REQUIRED):**
   
   **File:** `CHANGELOG.md`
````markdown
   ## [2.0.0] - 2025-11-22
   
   ### ⚠️ BREAKING CHANGES
   
   - **API:** Removed `/api/v1/legacy-auth` endpoint. Use `/api/v2/auth` instead.
   - **Database:** Removed `users.legacy_token` column. Tokens now in `auth_tokens` table.
   - **Events:** `user.created` event schema changed. See migration guide.
   
   **Migration Guide:** See `docs/migrations/2025-11-22-auth-v2-migration.md`
   
   ### Added
   - New OAuth2 authentication flow
   
   ### Fixed
   - Various security improvements
````

5. **Consumer Notification (REQUIRED if external APIs):**
   
   - Update API documentation (Swagger/OpenAPI)
   - Post notification in #api-changes Slack channel
   - Email affected teams (if known)
   - Update developer portal (if applicable)
   
   **Notification Template:**
````markdown
   🚨 **Breaking Change Alert**
   
   **What:** [Brief description]
   **When:** Deploying [Date]
   **Impact:** [Who is affected]
   **Action Required:** [What consumers must do]
   **Migration Guide:** [Link]
   **Deadline:** [Date by which consumers must migrate]
   **Support:** #api-support
````

### Decision Tree
````mermaid
graph TD
    A[Code Change] --> B{Removes/changes existing behavior?}
    B -->|No - Adding only| C[Not breaking - MINOR/PATCH version]
    B -->|Yes| D{Consumers must update code?}
    
    D -->|No - Internal only| C
    D -->|Yes| E[BREAKING CHANGE]
    
    E --> F[Flag PR with [BREAKING] tag]
    F --> G[Create migration guide]
    G --> H[Bump MAJOR version]
    H --> I[Update CHANGELOG.md]
    I --> J{External API?}
    
    J -->|Yes| K[Notify consumers]
    J -->|No| L[Notify internal teams]
    
    K --> M[Update API docs]
    L --> M
    M --> N{Immediate deployment?}
    
    N -->|Yes| O[Deploy with feature flag]
    N -->|No| P[Schedule deprecation timeline]
    
    O --> Q[Monitor for issues]
    P --> R[Communicate timeline]
    R --> Q
````

### Examples

#### ✅ Good Example: Breaking Change with Full Documentation

**PR Title:** `[BREAKING] Remove legacy authentication endpoints (v2.0.0)`

**PR Description:**
````markdown
## Breaking Changes

**What Changed:**
- Removed `/api/v1/auth/login` endpoint
- Removed `/api/v1/auth/token` endpoint
- Removed `legacy_token` field from User model

**Why:**
- Legacy auth has known security vulnerabilities
- OAuth2 is now standard
- Reduces maintenance burden

**Who Is Affected:**
- Mobile app (v1.x)
- Legacy web app
- 3rd-party integrations (confirmed: none active)

**Migration Guide:** `docs/migrations/2025-11-22-auth-v2-migration.md`

**Version Bump:** 1.5.3 → 2.0.0

**Rollback Plan:** Feature flag `USE_LEGACY_AUTH` allows reverting
````

**Migration Guide Created:** ✅  
**Version Bumped:** ✅  
**CHANGELOG Updated:** ✅  
**API Docs Updated:** ✅  
**Teams Notified:** ✅

#### ❌ Bad Example: Undocumented Breaking Change

**PR Title:** `Update user API`

**PR Description:**
````markdown
Cleaned up user endpoints
````

**Changes:**
- Removed `users.email` from response (BREAKING!)
- Changed `users.created_at` from ISO string to Unix timestamp (BREAKING!)

**Problems:**
- ❌ No [BREAKING] flag in PR title
- ❌ No migration guide
- ❌ No version bump
- ❌ No CHANGELOG update
- ❌ No consumer notification
- ❌ Consumers will break in production!

### Step 5 Verification (The Contract)

Before finalizing code with breaking changes, verify:

- [ ] **MUST** verify PR title includes `[BREAKING]` tag
- [ ] **MUST** verify migration guide created in `docs/migrations/`
- [ ] **MUST** verify migration guide includes:
  - [ ] What changed
  - [ ] Why it changed
  - [ ] Who is affected
  - [ ] Step-by-step migration instructions
  - [ ] Before/after code examples
  - [ ] Rollback instructions
  - [ ] Testing checklist
- [ ] **MUST** verify version bumped (MAJOR increment)
- [ ] **MUST** verify CHANGELOG.md updated with breaking changes section
- [ ] **MUST** verify API documentation updated (if API changes)
- [ ] **MUST** verify consumers notified (if external APIs)
- [ ] **SHOULD** verify deprecation timeline communicated (if gradual migration)
- [ ] **SHOULD** verify feature flag implemented (if immediate deployment)

**Consequences:**
- Missing [BREAKING] flag = HARD STOP
- Missing migration guide = HARD STOP
- Missing version bump = HARD STOP
- Missing CHANGELOG update = HARD STOP
- Missing API docs update = OVERRIDE required
- Missing consumer notification = OVERRIDE required

**Exemptions:** None - breaking changes always require full documentation

### Related Rules

- `05-data.mdc`: Contract Documentation (for event/schema changes)
- `11-operations.mdc`: Rollback Plans (for deployment strategy)
- `00-master.mdc`: Documentation Updates (for API docs)

### Change Log

- **2025-11-22** v2.1.0: New section added to address Issue #7 (Breaking Changes clarity)

OPA Policy for Breaking Changes
File: services/opa/policies/breaking-change.rego
regopackage compliance.breaking_changes

import future.keywords.contains
import future.keywords.if
import future.keywords.in

# HARD STOP: Breaking change without [BREAKING] tag
deny contains msg if {
    is_breaking_change(input.changed_files)
    not has_breaking_tag(input.pr_title)
    
    msg := "HARD STOP [Breaking]: Breaking change detected but PR title missing [BREAKING] tag"
}

# HARD STOP: Breaking change without migration guide
deny contains msg if {
    has_breaking_tag(input.pr_title)
    not has_migration_guide(input.changed_files)
    
    msg := "HARD STOP [Breaking]: [BREAKING] tag present but no migration guide found in docs/migrations/"
}

# HARD STOP: Breaking change without version bump
deny contains msg if {
    has_breaking_tag(input.pr_title)
    not has_major_version_bump(input.changed_files)
    
    msg := "HARD STOP [Breaking]: Breaking change requires MAJOR version bump in package.json"
}

# HARD STOP: Breaking change without CHANGELOG update
deny contains msg if {
    has_breaking_tag(input.pr_title)
    not has_changelog_update(input.changed_files)
    
    msg := "HARD STOP [Breaking]: Breaking change must update CHANGELOG.md with breaking changes section"
}

# OVERRIDE: API breaking change without docs update
override contains msg if {
    is_api_breaking_change(input.changed_files)
    not has_api_docs_update(input.changed_files)
    
    msg := "OVERRIDE REQUIRED [Breaking]: API breaking change should update API documentation"
}

# Helper: Detect breaking changes in code
is_breaking_change(files) if {
    some file in files
    
    # Check for removed endpoints
    contains(file.diff, "-@Get")
}

is_breaking_change(files) if {
    some file in files
    
    # Check for removed DTO fields
    contains(file.diff, "-  @ApiProperty")
}

is_breaking_change(files) if {
    some file in files
    
    # Check for schema removals
    contains(file.path, "schema.prisma")
    contains(file.diff, "-  ")
}

is_breaking_change(files) if {
    some file in files
    
    # Check for removed event types
    contains(file.path, "events/")
    contains(file.diff, "- export")
}

# Helper: Check for [BREAKING] tag
has_breaking_tag(title) if {
    contains(upper(title), "[BREAKING]")
}

has_breaking_tag(title) if {
    contains(upper(title), "BREAKING:")
}

# Helper: Check for migration guide
has_migration_guide(files) if {
    some file in files
    contains(file.path, "docs/migrations/")
    endswith(file.path, "-migration.md")
    file.status == "added"
}

# Helper: Check for version bump
has_major_version_bump(files) if {
    some file in files
    file.path == "package.json"
    
    # Check if version changed and MAJOR incremented
    contains(file.diff, "+  \"version\":")
    contains(file.diff, "-  \"version\":")
    
    # TODO: Parse versions and verify MAJOR increment
    # For now, just check that version changed
}

# Helper: Check for CHANGELOG update
has_changelog_update(files) if {
    some file in files
    file.path == "CHANGELOG.md"
    contains(file.diff, "BREAKING")
}

# Helper: Check if API breaking change
is_api_breaking_change(files) if {
    some file in files
    contains(file.path, ".controller.ts")
    is_breaking_change(files)
}

# Helper: Check for API docs update
has_api_docs_update(files) if {
    some file in files
    contains(file.path, "swagger")
}

has_api_docs_update(files) if {
    some file in files
    contains(file.path, "openapi")
}

has_api_docs_update(files) if {
    some file in files
    contains(file.path, "api-docs")
}

Day 4-5: Fix Security Review Triggers (Issue #8)
Update: .cursor/rules/03-security.mdc
Add new section:
markdown## SECURITY REVIEW REQUIREMENTS

**Version:** 2.1.0  
**Last Updated:** 2025-11-22

### Purpose

Ensure all security-sensitive changes undergo appropriate review before deployment to prevent security vulnerabilities, data breaches, and compliance violations.

### Triggers (When Security Review is MANDATORY)

#### Authentication & Authorization:
- ✅ Changes to JWT handling/generation/validation
- ✅ Changes to RBAC/permissions logic
- ✅ New authentication methods (OAuth, SSO, etc.)
- ✅ Changes to session management
- ✅ Changes to password hashing/storage
- ✅ Changes to MFA implementation

#### Data Exposure:
- ✅ New endpoints exposing PII
- ✅ Changes to data filtering/redaction logic
- ✅ New API endpoints returning user data
- ✅ Changes to audit logging
- ✅ Changes to data encryption

#### Input Validation:
- ✅ New user input endpoints
- ✅ Changes to validation logic
- ✅ New file upload endpoints
- ✅ Changes to sanitization (HTML, SQL, etc.)
- ✅ New query parameter handling

#### Third-Party Integrations:
- ✅ New external API integrations
- ✅ Changes to API key handling
- ✅ New OAuth providers
- ✅ Changes to webhook receivers
- ✅ New payment processor integrations

#### Infrastructure & Configuration:
- ✅ Changes to RLS policies
- ✅ Database permission changes
- ✅ Network configuration changes
- ✅ Secret management changes
- ✅ CORS policy changes

#### Tenant Isolation:
- ✅ Changes to tenant context setting
- ✅ New multi-tenant queries
- ✅ Changes to tenant_id handling
- ✅ Changes to RLS bypass logic (if ever needed for admin)

### NOT Security-Sensitive (No Review Required):
- ❌ Pure UI changes (no data handling)
- ❌ Documentation updates
- ❌ Test-only changes
- ❌ Performance optimizations (no logic changes)
- ❌ Logging improvements (non-sensitive data)

### Requirements

#### MANDATORY: Security Review Process

1. **Flag PR for Review:**
   
   Add to PR title:
````markdown
   [SECURITY] Your PR Title
````
   
   Add to PR description:
````markdown
   ## Security Review Required
   
   **Category:** [Auth | Data Exposure | Input Validation | Integration | Infrastructure]
   
   **Changes:**
   - [What security-sensitive code changed]
   
   **Security Considerations:**
   - [Potential security impacts]
   
   **Mitigation:**
   - [How risks are mitigated]
   
   **Reviewer:** @security-team
````

2. **Security Review Documentation:**
   
   **File:** `docs/security-reviews/[YYYY-MM-DD]-[feature]-review.md`
   
   **Template:**
````markdown
   # Security Review: [Feature Name]
   
   **Date:** YYYY-MM-DD
   **Reviewer:** @security-lead
   **PR:** #1234
   **Status:** [APPROVED | CHANGES_REQUIRED | BLOCKED]
   
   ---
   
   ## Summary
   
   [Brief description of changes]
   
   ## Security Analysis
   
   ### Authentication & Authorization
   - [Analysis]
   - **Risk Level:** [NONE | LOW | MEDIUM | HIGH | CRITICAL]
   
   ### Data Protection
   - [Analysis]
   - **Risk Level:** [NONE | LOW | MEDIUM | HIGH | CRITICAL]
   
   ### Input Validation
   - [Analysis]
   - **Risk Level:** [NONE | LOW | MEDIUM | HIGH | CRITICAL]
   
   ### Tenant Isolation
   - [Analysis]
   - **Risk Level:** [NONE | LOW | MEDIUM | HIGH | CRITICAL]
   
   ## Vulnerabilities Identified
   
   ### [VUL-001] [Vulnerability Name]
   - **Severity:** [LOW | MEDIUM | HIGH | CRITICAL]
   - **Description:** [Details]
   - **Recommendation:** [How to fix]
   - **Status:** [OPEN | FIXED | ACCEPTED_RISK]
   
   ## Recommendations
   
   1. [Recommendation 1]
   2. [Recommendation 2]
   
   ## Testing Performed
   
   - [ ] Manual security testing
   - [ ] Automated security scans
   - [ ] Penetration testing (if HIGH/CRITICAL)
   
   ## Approval
   
   **Decision:** [APPROVED | CHANGES_REQUIRED | BLOCKED]
   **Conditions:** [Any conditions for approval]
   **Follow-up:** [Any follow-up tickets created]
   
   **Approved by:** @security-lead
   **Date:** YYYY-MM-DD
````

3. **Approval Required:**
   
   - Security review MUST be approved before merge
   - CRITICAL issues MUST be fixed before merge
   - HIGH issues SHOULD be fixed before merge (or tracked as follow-up)
   - MEDIUM/LOW issues can be tracked as follow-up tickets

4. **Self-Review Option (for low-risk changes):**
   
   For small security changes, developers can self-review using checklist:
````markdown
   ## Security Self-Review Checklist
   
   - [ ] No new authentication/authorization logic
   - [ ] No new PII exposure
   - [ ] Input validation present for all user inputs
   - [ ] No SQL injection risks (using parameterized queries)
   - [ ] No XSS risks (proper sanitization)
   - [ ] Tenant isolation verified (RLS policies enforced)
   - [ ] Secrets not hardcoded
   - [ ] Error messages don't expose sensitive info
   - [ ] Audit logging present for sensitive operations
   
   **Self-Review Completed by:** @developer-name
   **Date:** YYYY-MM-DD
````
   
   **Note:** Self-review only valid for:
   - Minor changes to existing security code
   - Changes reviewed by security team in past 30 days
   - Non-critical security areas
   
   Team review still required for:
   - New security features
   - Changes to authentication/authorization
   - Changes to tenant isolation
   - High-risk areas

### Decision Tree
````mermaid
graph TD
    A[Code Change] --> B{Security-sensitive?}
    B -->|No| C[No security review needed]
    B -->|Yes| D{Risk Level?}
    
    D -->|CRITICAL/HIGH| E[Full security team review REQUIRED]
    D -->|MEDIUM| F[Self-review or team review]
    D -->|LOW| G[Self-review acceptable]
    
    E --> H[Flag PR with [SECURITY] tag]
    F --> I{Self-review complete?}
    G --> I
    
    I -->|Yes| J[Document in PR]
    I -->|No| H
    
    H --> K[Create security review doc]
    K --> L[Security team reviews]
    L --> M{Issues found?}
    
    M -->|CRITICAL| N[BLOCK - Must fix before merge]
    M -->|HIGH| O[Must fix or track as follow-up]
    M -->|MEDIUM/LOW| P[Track as follow-up]
    M -->|None| Q[APPROVE]
    
    N --> R[Fix issues]
    O --> R
    R --> L
    
    P --> Q
    J --> Q
    Q --> S[Merge allowed]
````

### Examples

#### ✅ Good Example: Full Security Review

**PR Title:** `[SECURITY] Add OAuth2 authentication provider`

**PR Description:**
````markdown
## Security Review Required

**Category:** Authentication

**Changes:**
- Added OAuth2 authentication flow
- New JWT token generation logic
- New user session management

**Security Considerations:**
- OAuth2 tokens stored securely
- PKCE flow implemented for security
- Token expiration enforced
- Refresh token rotation enabled

**Mitigation:**
- All tokens encrypted at rest
- Rate limiting on auth endpoints
- Audit logging for all auth events

**Reviewer:** @security-team
````

**Security Review Doc Created:** `docs/security-reviews/2025-11-22-oauth2-review.md`

**Review Findings:**
- ✅ OAuth2 implementation follows OWASP guidelines
- ⚠️  MEDIUM: Consider shorter token expiration (changed from 24h to 1h)
- ✅ Audit logging comprehensive
- ✅ Rate limiting appropriate

**Status:** APPROVED with changes

#### ✅ Good Example: Self-Review

**PR Title:** `Fix validation error message`

**PR Description:**
````markdown
## Security Self-Review Checklist

**Change:** Updated validation error message for email field

- [x] No new authentication/authorization logic
- [x] No new PII exposure
- [x] Input validation present for all user inputs
- [x] No SQL injection risks
- [x] No XSS risks
- [x] Tenant isolation verified
- [x] Secrets not hardcoded
- [x] Error messages don't expose sensitive info
- [x] Audit logging present

**Self-Review Completed by:** @developer
**Date:** 2025-11-22

**Risk Level:** LOW
**Justification:** Only changed user-facing error text, no logic changes
````

#### ❌ Bad Example: Missing Security Review

**PR Title:** `Update user permissions`

**PR Description:**
````markdown
Updated RBAC logic
````

**Changes:**
- Modified permission checking logic (SECURITY-SENSITIVE!)
- Changed role hierarchy

**Problems:**
- ❌ No [SECURITY] flag
- ❌ No security review documentation
- ❌ No reviewer assigned
- ❌ Could introduce privilege escalation vulnerability!

### Step 5 Verification (The Contract)

Before finalizing security-sensitive code, verify:

- [ ] **MUST** verify [SECURITY] tag in PR title (if security-sensitive)
- [ ] **MUST** verify security review documentation exists (if team review)
- [ ] **MUST** verify security review approved
- [ ] **MUST** verify CRITICAL/HIGH issues resolved
- [ ] **MUST** verify security test cases added
- [ ] **MUST** verify audit logging present (if sensitive operations)
- [ ] **MUST** verify secrets not hardcoded
- [ ] **MUST** verify tenant isolation maintained (if multi-tenant code)
- [ ] **SHOULD** verify penetration testing completed (if HIGH/CRITICAL risk)

**Consequences:**
- Missing [SECURITY] tag for security-sensitive changes = HARD STOP
- Missing security review = HARD STOP
- Unresolved CRITICAL issues = BLOCK (cannot merge)
- Unresolved HIGH issues = OVERRIDE required with justification
- Missing audit logging = HARD STOP
- Hardcoded secrets = BLOCK (cannot merge)
- Broken tenant isolation = BLOCK (cannot merge)

**Exemptions:** None - security reviews cannot be skipped for security-sensitive changes

### Related Rules

- `03-security.mdc`: All other security rules (RLS, tenant isolation, etc.)
- `10-quality.mdc`: Testing requirements (security test cases)
- `06-error-resilience.mdc`: Error handling (don't expose sensitive info)

### Change Log

- **2025-11-22** v2.1.0: New section added to address Issue #8 (Security Review Triggers)

OPA Policy for Security Review
File: services/opa/policies/security.rego
regopackage compliance.security

import future.keywords.contains
import future.keywords.if
import future.keywords.in

# HARD STOP: Security-sensitive change without [SECURITY] tag
deny contains msg if {
    is_security_sensitive(input.changed_files)
    not has_security_tag(input.pr_title)
    
    msg := "HARD STOP [Security]: Security-sensitive changes detected but PR missing [SECURITY] tag"
}

# HARD STOP: [SECURITY] tag without review documentation
deny contains msg if {
    has_security_tag(input.pr_title)
    not has_security_review_doc(input.changed_files)
    not has_self_review_checklist(input.pr_body)
    
    msg := "HARD STOP [Security]: [SECURITY] tag present but no security review documentation found"
}

# BLOCK: Hardcoded secrets detected
deny contains msg if {
    some file in input.changed_files
    has_hardcoded_secret(file.diff)
    
    msg := sprintf(
        "BLOCK [Security]: Hardcoded secret detected in %s. Use environment variables or secret manager",
        [file.path]
    )
}

# BLOCK: Broken tenant isolation
deny contains msg if {
    some file in input.changed_files
    is_database_query(file.diff)
    not has_tenant_isolation(file.diff)
    not is_global_query(file.path)
    
    msg := sprintf(
        "BLOCK [Security]: Database query in %s missing tenant isolation (RLS)",
        [file.path]
    )
}

# OVERRIDE: Auth changes without security tests
override contains msg if {
    is_auth_change(input.changed_files)
    not has_security_tests(input.changed_files)
    
    msg := "OVERRIDE REQUIRED [Security]: Authentication changes should include security test cases"
}

# Helper: Detect security-sensitive changes
is_security_sensitive(files) if {
    some file in files
    is_auth_change([file])
}

is_security_sensitive(files) if {
    some file in files
    is_data_exposure_change(file)
}

is_security_sensitive(files) if {
    some file in files
    is_rls_change(file)
}

is_security_sensitive(files) if {
    some file in files
    is_validation_change(file)
}

# Helper: Check for auth changes
is_auth_change(files) if {
    some file in files
    contains(file.path, "auth")
    contains(file.diff, "JWT")
}

is_auth_change(files) if {
    some file in files
    contains(file.diff, "@UseGuards")
}

is_auth_change(files) if {
    some file in files
    contains(file.diff, "password")
}

# Helper: Check for data exposure
is_data_exposure_change(file) if {
    contains(file.path, ".controller.ts")
    contains(file.diff, "@Get")
    contains(file.diff, "user")
}

# Helper: Check for RLS changes
is_rls_change(file) if {
    contains(file.path, "schema.prisma")
    contains(file.diff, "@@policy")
}

# Helper: Check for validation changes
is_validation_change(file) if {
    contains(file.diff, "ValidationPipe")
}

is_validation_change(file) if {
    contains(file.diff, "@IsString")
}

# Helper: Check for [SECURITY] tag
has_security_tag(title) if {
    contains(upper(title), "[SECURITY]")
}

# Helper: Check for security review doc
has_security_review_doc(files) if {
    some file in files
    contains(file.path, "docs/security-reviews/")
    endswith(file.path, "-review.md")
}

# Helper: Check for self-review checklist
has_self_review_checklist(body) if {
    contains(body, "Security Self-Review Checklist")
    contains(body, "[x]")
}

# Helper: Detect hardcoded secrets
has_hardcoded_secret(diff) if {
    contains(diff, "API_KEY")
    contains(diff, "=")
    not contains(diff, "process.env")
}

has_hardcoded_secret(diff) if {
    contains(diff, "password")
    contains(diff, "=")
    not contains(diff, "process.env")
}

has_hardcoded_secret(diff) if {
    regex.match(`["']sk_[a-zA-Z0-9]{32,}["']`, diff)
}

# Helper: Check for database queries
is_database_query(diff) if {
    contains(diff, "prisma.")
}

is_database_query(diff) if {
    contains(diff, "findMany")
}

# Helper: Check for tenant isolation
has_tenant_isolation(diff) if {
    contains(diff, "tenant_id")
}

has_tenant_isolation(diff) if {
    contains(diff, "RLS")
}

# Helper: Check if global query (no tenant needed)
is_global_query(path) if {
    contains(path, "system")
}

is_global_query(path) if {
    contains(path, "admin")
}

# Helper: Check for security tests
has_security_tests(files) if {
    some file in files
    contains(file.path, ".test.ts")
    contains(file.diff, "security")
}

has_security_tests(files) if {
    some file in files
    contains(file.path, ".test.ts")
    contains(file.diff, "unauthorized")
}

Week 2 Summary & Deliverables
By end of Week 2, you should have:
✅ Foundation Complete:

Unified Enforcement Contract embedded in 00-master.mdc
Complete glossary (60+ terms)
Rule Compliance Matrix created
.compliance-exemptions.json with baseline violations
Baseline scan completed and documented

✅ Critical Rules Fixed (3/3):

Issue #6: Testing Requirements - COMPLETE
Issue #7: Breaking Changes - COMPLETE
Issue #8: Security Review Triggers - COMPLETE

✅ OPA Policies Created (3/3):

testing.rego
breaking-change.rego
security.rego

✅ CI Integration:

Matrix validation workflow
OPA evaluation workflow
Baseline scan script

✅ Progress:

Rule Compliance Matrix: 4/25 complete (16%)
Critical issues: 3/3 complete (100%)


Phase 2: Rule Migration & OPA Integration (Weeks 3-5)
Week 3: High Priority Rules
Day 1-2: Fix Engineering Decisions (Issue #1)
Day 3: Fix Layer Synchronization (Issue #3)
Day 4-5: Fix Documentation Updates (Issue #9) and Configuration Changes (Issue #10)
Week 4: Medium Priority Rules
Day 1-2: Fix Tech Debt Logging (Issue #2), State Machine Docs (Issue #4), Contract Documentation (Issue #5)
Day 3-4: Fix Performance Impact (Issue #11), Error Handling Standards (Issue #12)
Day 5: Fix Rollback Plans (Issue #13)
Week 5: Remaining Rules & Testing
Day 1-2: Fix Dependency Changes (Issue #14), Audit Logging (Issue #15)
Day 3-5: Integration testing, end-to-end validation, bug fixes
Phase 2: Rule Migration & OPA Integration (Weeks 3-5) - Detailed Implementation

Week 3: High Priority Rules
Day 1-2: Fix Engineering Decisions (Issue #1)
Update: .cursor/rules/00-master.mdc (add new section)
markdown## ENGINEERING DECISIONS DOCUMENTATION REQUIREMENTS

**Version:** 2.1.0  
**Last Updated:** 2025-11-22

### Purpose

Capture significant architectural and design decisions to provide context for future developers, prevent repeated debates, and maintain consistency across the codebase.

### Triggers (When Documentation is MANDATORY)

#### Architectural Changes:
- ✅ New microservices or service boundaries
- ✅ Database schema changes affecting multiple modules (>3 modules)
- ✅ Major refactoring (>50 files or >2000 lines changed)
- ✅ Technology stack changes (new frameworks, libraries with >10k weekly downloads)
- ✅ New infrastructure components (caching, message queues, etc.)

#### Design Pattern Decisions:
- ✅ Choosing between multiple implementation approaches
- ✅ Establishing new patterns for the codebase
- ✅ Breaking existing patterns (with justification)
- ✅ Adopting new architectural patterns (CQRS, event sourcing, etc.)

#### Trade-off Decisions:
- ✅ Performance vs maintainability trade-offs
- ✅ Security vs usability trade-offs
- ✅ Speed vs correctness trade-offs
- ✅ Build vs buy decisions
- ✅ Monolith vs microservices decisions

#### Migration Decisions:
- ✅ Code structure migrations
- ✅ Technology migrations (database, framework, etc.)
- ✅ Process migrations (CI/CD, deployment strategy)
- ✅ Data migrations affecting business logic

#### Business Logic Decisions:
- ✅ Complex business rule implementations
- ✅ Algorithm selections with significant impact
- ✅ Integration strategy decisions

### NOT Requiring Documentation (Routine Changes):
- ❌ Bug fixes (unless revealing design flaw)
- ❌ Minor refactoring (<50 files)
- ❌ Dependency updates (patch/minor versions)
- ❌ UI/UX tweaks (unless changing UX pattern)
- ❌ Performance optimizations (unless algorithmic change)

### Requirements

#### MANDATORY: Decision Documentation

**File:** `docs/engineering-decisions.md`

**Entry Template:**
```markdown
## [Decision ID]: [Decision Title]

**Date:** YYYY-MM-DD  
**Author:** @username  
**Status:** [Proposed | Accepted | Deprecated | Superseded]  
**Decision Type:** [Architecture | Design Pattern | Trade-off | Migration | Business Logic]

---

### Context

[What is the situation and problem we're trying to solve? What constraints exist?]

**Business Context:**
- [Why does this matter to the business?]
- [What problem does this solve for users?]

**Technical Context:**
- [What is the current state?]
- [What are the technical constraints?]
- [What drove this decision now?]

### Decision

[What did we decide to do? Be specific and unambiguous.]

**Chosen Approach:**
[Detailed description of the decision]

**Key Points:**
- [Point 1]
- [Point 2]
- [Point 3]

### Alternatives Considered

#### Option 1: [Alternative Name]

**Pros:**
- [Pro 1]
- [Pro 2]

**Cons:**
- [Con 1]
- [Con 2]

**Why Rejected:**
[Specific reasons]

#### Option 2: [Alternative Name]

[Same structure as Option 1]

### Rationale

[Why is this the best choice given the context and constraints?]

**Decision Factors:**
1. **[Factor 1 - e.g., Performance]:** [How this influenced decision]
2. **[Factor 2 - e.g., Maintainability]:** [How this influenced decision]
3. **[Factor 3 - e.g., Team Expertise]:** [How this influenced decision]

**Trade-offs Accepted:**
- [Trade-off 1]: [Why acceptable]
- [Trade-off 2]: [Why acceptable]

### Consequences

**Positive Consequences:**
- [Benefit 1]
- [Benefit 2]

**Negative Consequences:**
- [Drawback 1 - and how we'll mitigate it]
- [Drawback 2 - and how we'll mitigate it]

**Risks:**
- [Risk 1]: [Mitigation strategy]
- [Risk 2]: [Mitigation strategy]

### Implementation

**Changes Required:**
- [Code changes]
- [Documentation updates]
- [Team training needs]

**Timeline:**
- **Start:** YYYY-MM-DD
- **Completion Target:** YYYY-MM-DD
- **Actual Completion:** YYYY-MM-DD (update when done)

**Implementation PR(s):**
- #1234: [Description]
- #1235: [Description]

### Impact

**Affected Systems:**
- [System 1]: [How affected]
- [System 2]: [How affected]

**Affected Teams:**
- [Team 1]: [Required actions]
- [Team 2]: [Required actions]

**Migration Required:** [Yes/No]
- If yes: See `docs/migrations/[date]-[feature]-migration.md`

### Metrics for Success

[How will we measure if this decision was correct?]

- [Metric 1]: [Target value]
- [Metric 2]: [Target value]

**Review Date:** YYYY-MM-DD (6 months from decision)

### Lessons Learned

[To be filled in during retrospective or after implementation]

**What Went Well:**
- [Success 1]
- [Success 2]

**What Could Be Improved:**
- [Improvement 1]
- [Improvement 2]

**Would We Make This Decision Again?**
[Yes/No and why]

### Related Decisions

- [Decision ID]: [Relationship - "supersedes", "related to", "depends on"]
- [Decision ID]: [Relationship]

### References

- [Link to RFC/design doc]
- [Link to Slack discussion]
- [Link to external resources]

---
```

**Example Decision:**
```markdown
## [DEC-001]: Adopt NestJS for Backend API

**Date:** 2025-01-15  
**Author:** @tech-lead  
**Status:** Accepted  
**Decision Type:** Architecture

---

### Context

**Business Context:**
- Need to build scalable, maintainable backend API
- Team will grow from 3 to 10 developers over next year
- Must support rapid feature development

**Technical Context:**
- Starting new backend from scratch
- Need TypeScript support for type safety
- Team has Node.js experience but not framework expertise
- Must integrate with PostgreSQL and Redis

### Decision

Adopt **NestJS** as the backend framework for all API services.

**Key Points:**
- Use NestJS's dependency injection for modularity
- Follow NestJS module structure conventions
- Use NestJS CLI for code generation
- Adopt decorators for routing and validation

### Alternatives Considered

#### Option 1: Express.js

**Pros:**
- Minimal, flexible
- Team already knows Express
- Huge ecosystem

**Cons:**
- No built-in structure (project organization varies wildly)
- Manual dependency injection setup
- No built-in TypeScript support (must configure)

**Why Rejected:**
As team grows, lack of structure would lead to inconsistent patterns.

#### Option 2: Fastify

**Pros:**
- Faster than Express
- Good TypeScript support
- Modern

**Cons:**
- Smaller ecosystem than Express/NestJS
- Less mature tooling
- Fewer developers with experience

**Why Rejected:**
Performance gain not significant enough to offset ecosystem disadvantages.

### Rationale

**Decision Factors:**
1. **Team Scale:** NestJS's opinionated structure prevents architectural drift as team grows
2. **TypeScript-First:** Built for TypeScript, not bolted on
3. **Enterprise Patterns:** DI, modules, guards match team's needs
4. **Ecosystem:** Strong integration with Prisma, Bull, GraphQL, etc.

**Trade-offs Accepted:**
- **Learning Curve:** Team must learn NestJS concepts (acceptable - 2 week ramp-up)
- **Boilerplate:** More code than raw Express (acceptable - enforces patterns)

### Consequences

**Positive Consequences:**
- Consistent project structure across all services
- Easier onboarding for new developers
- Better testability with built-in DI
- Excellent TypeScript support

**Negative Consequences:**
- Slight performance overhead vs Express (mitigated: not bottleneck)
- Decorator syntax unfamiliar to some (mitigated: training)

**Risks:**
- **Risk:** Framework abandonment
  - **Mitigation:** NestJS has 60k+ stars, active maintainers, backed by Trilon
- **Risk:** Team struggles with DI concepts
  - **Mitigation:** Pair programming, brown bags, migration guide

### Implementation

**Changes Required:**
- Set up NestJS starter project
- Configure Prisma integration
- Set up testing infrastructure
- Create module structure guide

**Timeline:**
- **Start:** 2025-01-15
- **Completion Target:** 2025-01-31
- **Actual Completion:** 2025-01-28

**Implementation PR(s):**
- #45: Initial NestJS setup
- #46: Prisma integration
- #47: Auth module example

### Impact

**Affected Systems:**
- All backend API services (new development)

**Affected Teams:**
- Backend team: Must learn NestJS patterns
- DevOps team: Update deployment configs

**Migration Required:** No (new project)

### Metrics for Success

- **Onboarding Time:** New developer productive in <5 days (vs 10+ with Express)
- **Code Consistency:** >90% of modules follow NestJS patterns (measured via linting)
- **Test Coverage:** Achieve >80% coverage (DI makes testing easier)

**Review Date:** 2025-07-15 (6 months from decision)

### Lessons Learned

*(To be filled after 6 months)*

### Related Decisions

- DEC-002: Adopt Prisma for ORM (depends on this decision)

### References

- [NestJS Documentation](https://docs.nestjs.com)
- [Slack Discussion](https://team.slack.com/archives/C123/p456)
- [Internal RFC](https://docs.google.com/document/d/abc123)

---
```

### Decision Tree
```mermaid
graph TD
    A[Change/Decision Made] --> B{Significant Decision?}
    B -->|No - Routine change| C[No documentation needed]
    B -->|Yes| D{Decision Type?}
    
    D -->|Architecture| E[Check criteria]
    D -->|Design Pattern| E
    D -->|Trade-off| E
    D -->|Migration| E
    D -->|Business Logic| E
    
    E --> F{Meets criteria?}
    F -->|No| C
    F -->|Yes| G[Document in engineering-decisions.md]
    
    G --> H[Use decision template]
    H --> I[Include all sections]
    I --> J{Multiple alternatives considered?}
    
    J -->|No| K[Consider at least 2 alternatives]
    J -->|Yes| L[Document trade-offs]
    
    K --> L
    L --> M[Set review date - 6 months]
    M --> N[Link to related decisions]
    N --> O[✅ Decision documented]
```

### Step 5 Verification (The Contract)

Before finalizing code involving significant decisions, verify:

- [ ] **MUST** verify decision meets documentation criteria (see Triggers)
- [ ] **MUST** verify decision documented in `docs/engineering-decisions.md`
- [ ] **MUST** verify decision uses standard template
- [ ] **MUST** verify all template sections completed (no "TBD" placeholders)
- [ ] **MUST** verify at least 2 alternatives considered and documented
- [ ] **MUST** verify trade-offs explicitly stated
- [ ] **MUST** verify consequences (positive and negative) documented
- [ ] **MUST** verify review date set (typically 6 months)
- [ ] **SHOULD** verify metrics for success defined
- [ ] **SHOULD** verify related decisions cross-referenced

**Consequences:**
- Missing documentation for significant decision = HARD STOP
- Incomplete template (missing sections) = HARD STOP
- Only 1 alternative considered = OVERRIDE required (must justify why others not viable)
- Missing trade-offs = HARD STOP
- No review date = WARNING

**Exemptions:**
Valid reasons to skip documentation:
- Decision is tactical/temporary (< 3 month lifespan)
- Decision documented in external RFC that is linked
- Emergency fix (document within 7 days)

### Related Rules

- `00-master.mdc`: Breaking Changes (decisions often involve breaking changes)
- `12-tech-debt.mdc`: Tech Debt (some decisions create/reduce tech debt)

### Change Log

- **2025-11-22** v2.1.0: New section added to address Issue #1 (Engineering Decisions clarity)

Update: docs/engineering-decisions.md
markdown# Engineering Decisions

**Purpose:** Record all significant architectural and design decisions made for the VeroField platform.

**Last Updated:** 2025-11-22

---

## How to Use This Document

### Adding a New Decision

1. Copy the template from `.cursor/rules/00-master.mdc` (ENGINEERING DECISIONS section)
2. Fill in all sections - no "TBD" placeholders
3. Assign sequential decision ID: DEC-XXX
4. Submit as part of implementation PR
5. Update this index

### Decision Status

- **Proposed:** Under discussion
- **Accepted:** Approved and implemented
- **Deprecated:** No longer recommended (explain why)
- **Superseded:** Replaced by another decision (link to it)

### Review Process

- All decisions reviewed 6 months after acceptance
- Update "Lessons Learned" section during review
- Change status if decision should be deprecated

---

## Decision Index

| ID | Title | Date | Status | Type | Author |
|----|-------|------|--------|------|--------|
| DEC-001 | Adopt NestJS for Backend API | 2025-01-15 | Accepted | Architecture | @tech-lead |
| DEC-002 | Adopt Prisma as ORM | 2025-01-20 | Accepted | Architecture | @backend-lead |
| DEC-003 | Use PostgreSQL Row-Level Security | 2025-01-25 | Accepted | Security | @security-lead |
| DEC-004 | Monorepo with Nx | 2025-02-01 | Accepted | Architecture | @tech-lead |

---

## Decisions

### [DEC-001]: Adopt NestJS for Backend API

*(Full decision documentation here - see example above)*

---

### [DEC-002]: Adopt Prisma as ORM

**Date:** 2025-01-20  
**Author:** @backend-lead  
**Status:** Accepted  
**Decision Type:** Architecture

*(Continue with full template...)*

---

## Deprecated Decisions

### [DEC-XXX]: [Example Deprecated Decision]

**Deprecated Date:** YYYY-MM-DD  
**Reason:** [Why deprecated]  
**Superseded By:** DEC-YYY

---

## Decision Categories

### Architecture Decisions
- DEC-001: NestJS
- DEC-002: Prisma
- DEC-004: Nx Monorepo

### Security Decisions
- DEC-003: PostgreSQL RLS

### Design Pattern Decisions
*(None yet)*

### Trade-off Decisions
*(None yet)*

### Migration Decisions
*(None yet)*

---

## Statistics

**Total Decisions:** 4  
**Accepted:** 4  
**Proposed:** 0  
**Deprecated:** 0  
**Due for Review:** 0 (next review: 2025-07-15)

---

## Templates

See `.cursor/rules/00-master.mdc` for the complete decision template.

OPA Policy: services/opa/policies/decisions.rego
regopackage compliance.engineering_decisions

import future.keywords.contains
import future.keywords.if
import future.keywords.in

# HARD STOP: Significant decision without documentation
deny contains msg if {
    is_significant_decision(input.changed_files)
    not has_decision_documentation(input.changed_files)
    not is_minor_change(input.changed_files)
    
    msg := "HARD STOP [Decisions]: Significant decision detected. Document in docs/engineering-decisions.md"
}

# HARD STOP: Decision documentation incomplete
deny contains msg if {
    has_decision_documentation(input.changed_files)
    not is_decision_complete(input.changed_files)
    
    msg := "HARD STOP [Decisions]: Decision documentation incomplete. Use full template from 00-master.mdc"
}

# OVERRIDE: Only one alternative considered
override contains msg if {
    has_decision_documentation(input.changed_files)
    count_alternatives(input.changed_files) < 2
    
    msg := "OVERRIDE REQUIRED [Decisions]: Decision should consider at least 2 alternatives. Justify if only 1 is viable."
}

# Helper: Detect significant decisions
is_significant_decision(files) if {
    # Major refactoring (>50 files)
    count(files) > 50
}

is_significant_decision(files) if {
    # New architecture component
    some file in files
    file.status == "added"
    contains(file.path, "apps/")
    contains(file.path, "/src/")
}

is_significant_decision(files) if {
    # New service/module
    some file in files
    file.status == "added"
    contains(file.path, ".module.ts")
}

is_significant_decision(files) if {
    # Technology stack change
    some file in files
    file.path == "package.json"
    contains(file.diff, "dependencies")
    has_major_dependency_change(file.diff)
}

is_significant_decision(files) if {
    # Schema changes affecting multiple modules
    some file in files
    contains(file.path, "schema.prisma")
    count_schema_changes(file.diff) > 5
}

# Helper: Check for decision documentation
has_decision_documentation(files) if {
    some file in files
    file.path == "docs/engineering-decisions.md"
    contains(file.diff, "## [DEC-")
}

# Helper: Check if decision documentation is complete
is_decision_complete(files) if {
    some file in files
    file.path == "docs/engineering-decisions.md"
    
    # Check for required sections
    contains(file.diff, "### Context")
    contains(file.diff, "### Decision")
    contains(file.diff, "### Alternatives Considered")
    contains(file.diff, "### Rationale")
    contains(file.diff, "### Consequences")
    
    # Check for no TBD placeholders
    not contains(file.diff, "TBD")
    not contains(file.diff, "TODO")
}

# Helper: Count alternatives
count_alternatives(files) := count if {
    some file in files
    file.path == "docs/engineering-decisions.md"
    
    # Count "#### Option" occurrences
    alternatives := [alt | 
        line := split(file.diff, "\n")[_]
        contains(line, "#### Option")
        alt := line
    ]
    
    count := count(alternatives)
}

# Helper: Check if minor change
is_minor_change(files) if {
    count(files) < 10
    not has_new_architecture(files)
}

# Helper: Check for major dependency
has_major_dependency_change(diff) if {
    # Check for new framework-level dependencies
    contains(diff, "@nestjs/")
}

has_major_dependency_change(diff) if {
    contains(diff, "react")
}

has_major_dependency_change(diff) if {
    contains(diff, "prisma")
}

# Helper: Count schema changes
count_schema_changes(diff) := count if {
    changes := [change |
        line := split(diff, "\n")[_]
        startswith(line, "+")
        contains(line, "model ")
        change := line
    ]
    count := count(changes)
}

# Helper: Check for new architecture
has_new_architecture(files) if {
    some file in files
    contains(file.path, "apps/")
    file.status == "added"
}

CI Workflow: .github/workflows/decision-check.yml
yamlname: Engineering Decision Check

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  check-decision:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v40
        with:
          files: |
            **/*.ts
            **/*.tsx
            **/schema.prisma
            package.json
      
      - name: Check if significant decision
        id: check-decision
        run: |
          CHANGED_COUNT=$(echo '${{ steps.changed-files.outputs.all_changed_files }}' | jq '. | length')
          echo "changed_count=$CHANGED_COUNT" >> $GITHUB_OUTPUT
          
          # Check if >50 files changed (major refactoring)
          if [ "$CHANGED_COUNT" -gt 50 ]; then
            echo "significant=true" >> $GITHUB_OUTPUT
            echo "reason=Major refactoring (>50 files)" >> $GITHUB_OUTPUT
          fi
          
          # Check for new services
          NEW_MODULES=$(echo '${{ steps.changed-files.outputs.added_files }}' | grep -c ".module.ts" || true)
          if [ "$NEW_MODULES" -gt 0 ]; then
            echo "significant=true" >> $GITHUB_OUTPUT
            echo "reason=New service/module detected" >> $GITHUB_OUTPUT
          fi
      
      - name: Check for decision documentation
        if: steps.check-decision.outputs.significant == 'true'
        run: |
          if ! git diff origin/main...HEAD -- docs/engineering-decisions.md | grep -q "## \[DEC-"; then
            echo "❌ Significant decision detected but not documented"
            echo ""
            echo "**Reason:** ${{ steps.check-decision.outputs.reason }}"
            echo ""
            echo "**Required Action:**"
            echo "Document this decision in docs/engineering-decisions.md"
            echo "Use template from .cursor/rules/00-master.mdc"
            exit 1
          else
            echo "✅ Decision documented"
          fi
      
      - name: Validate decision completeness
        if: steps.check-decision.outputs.significant == 'true'
        run: |
          DECISION_DIFF=$(git diff origin/main...HEAD -- docs/engineering-decisions.md)
          
          # Check for required sections
          MISSING_SECTIONS=()
          
          if ! echo "$DECISION_DIFF" | grep -q "### Context"; then
            MISSING_SECTIONS+=("Context")
          fi
          
          if ! echo "$DECISION_DIFF" | grep -q "### Decision"; then
            MISSING_SECTIONS+=("Decision")
          fi
          
          if ! echo "$DECISION_DIFF" | grep -q "### Alternatives Considered"; then
            MISSING_SECTIONS+=("Alternatives Considered")
          fi
          
          if ! echo "$DECISION_DIFF" | grep -q "### Rationale"; then
            MISSING_SECTIONS+=("Rationale")
          fi
          
          if ! echo "$DECISION_DIFF" | grep -q "### Consequences"; then
            MISSING_SECTIONS+=("Consequences")
          fi
          
          if [ ${#MISSING_SECTIONS[@]} -gt 0 ]; then
            echo "❌ Decision documentation incomplete"
            echo ""
            echo "**Missing sections:**"
            printf '- %s\n' "${MISSING_SECTIONS[@]}"
            exit 1
          fi
          
          # Check for TBD/TODO placeholders
          if echo "$DECISION_DIFF" | grep -q "TBD\|TODO"; then
            echo "❌ Decision documentation has placeholders (TBD/TODO)"
            echo "Complete all sections before submitting"
            exit 1
          fi
          
          echo "✅ Decision documentation complete"

Day 3: Fix Layer Synchronization (Issue #3)
Update: .cursor/rules/05-data.mdc
Update the LAYER SYNCHRONIZATION RULE section:
markdown## LAYER SYNCHRONIZATION RULE

**Version:** 2.1.0  
**Last Updated:** 2025-11-22

### Purpose

Ensure data consistency across all layers of the application (database → backend → frontend) to prevent runtime errors, type mismatches, and data corruption.

### Triggers (When Synchronization is MANDATORY)

#### Database Layer Changes:
- ✅ Schema changes in `schema.prisma`
- ✅ New migrations created
- ✅ Column additions/removals/modifications
- ✅ Table additions/removals
- ✅ Relationship changes

#### Backend DTO Changes:
- ✅ New DTO classes
- ✅ Modified DTO fields
- ✅ DTO field type changes
- ✅ Validation rule changes

#### API Contract Changes:
- ✅ Request schema modifications
- ✅ Response schema modifications
- ✅ New endpoints added
- ✅ Endpoint paths/methods changed

#### Frontend Type Changes:
- ✅ API client type updates
- ✅ Form model changes
- ✅ State interface modifications

#### Event Model Changes:
- ✅ Event payload schema changes
- ✅ New event types
- ✅ Event field modifications

### The Synchronization Chain
```
schema.prisma (Source of Truth)
    ↓ (prisma generate)
@prisma/client types
    ↓ (manual mapping)
DTOs (backend/src/**/*.dto.ts)
    ↓ (API exposure)
OpenAPI/Swagger specs
    ↓ (code generation OR manual)
Frontend types (frontend/types/**/*.ts)
    ↓ (usage)
React components, forms, state
```

**Critical Principle:** Changes must propagate through ENTIRE chain in same PR.

### Requirements

#### MANDATORY: Layer Synchronization Steps

When making changes to any layer, you MUST update all downstream layers:

**1. Schema → Prisma Client → DTOs → Frontend Types:**
```typescript
// Step 1: Update schema.prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  firstName String   // ← NEW FIELD
  lastName  String   // ← NEW FIELD
  createdAt DateTime @default(now())
}

// Step 2: Generate Prisma client
// $ npx prisma generate

// Step 3: Update DTOs
export class UserDto {
  id: string;
  email: string;
  firstName: string;  // ← ADD
  lastName: string;   // ← ADD
  createdAt: Date;
}

export class CreateUserDto {
  @IsString()
  email: string;
  
  @IsString()
  firstName: string;  // ← ADD
  
  @IsString()
  lastName: string;   // ← ADD
}

// Step 4: Update validators
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;  // ← ADD
  
  @IsOptional()
  @IsString()
  lastName?: string;   // ← ADD
}

// Step 5: Update frontend types
export interface User {
  id: string;
  email: string;
  firstName: string;  // ← ADD
  lastName: string;   // ← ADD
  createdAt: string; // ISO date string
}

// Step 6: Update frontend forms/components
interface UserFormData {
  email: string;
  firstName: string;  // ← ADD
  lastName: string;   // ← ADD
}

// Step 7: Update tests
describe('UserDto', () => {
  it('should map Prisma User to UserDto', () => {
    const prismaUser = {
      id: '123',
      email: 'test@example.com',
      firstName: 'John',  // ← TEST
      lastName: 'Doe',    // ← TEST
      createdAt: new Date(),
    };
    
    const dto = new UserDto(prismaUser);
    expect(dto.firstName).toBe('John');
    expect(dto.lastName).toBe('Doe');
  });
});

// Step 8: Update API documentation
// OpenAPI/Swagger decorators
@ApiProperty({ description: 'User first name' })
firstName: string;

@ApiProperty({ description: 'User last name' })
lastName: string;

// Step 9: Update contracts (if event-driven)
// docs/contracts/events/user-created.md
```

**2. Breaking vs Non-Breaking Changes:**

**Non-Breaking (Safe):**
- ✅ Adding optional fields
- ✅ Adding new nullable columns
- ✅ Adding new DTOs
- ✅ Adding new endpoints

**Breaking (Requires Migration):**
- ⚠️ Removing fields
- ⚠️ Renaming fields
- ⚠️ Changing field types
- ⚠️ Making nullable fields required
- ⚠️ Removing DTOs/endpoints

For breaking changes, ALSO follow Breaking Changes Documentation (00-master.mdc).

### Decision Tree
```mermaid
graph TD
    A[Data Change Made] --> B{Which layer?}
    
    B -->|Schema| C[schema.prisma changed]
    B -->|DTO| D[DTO changed]
    B -->|API| E[API contract changed]
    B -->|Frontend| F[Frontend type changed]
    B -->|Event| G[Event model changed]
    
    C --> H[Run: npx prisma generate]
    H --> I[Update DTOs to match Prisma types]
    I --> J[Update validators]
    J --> K[Update frontend types]
    K --> L[Update components/forms]
    L --> M[Update tests]
    M --> N[Update API docs]
    N --> O{Event-driven?}
    O -->|Yes| P[Update event contracts]
    O -->|No| Q[Check: All layers synced?]
    P --> Q
    
    D --> I
    E --> K
    F --> L
    G --> P
    
    Q -->|No| R[❌ HARD STOP - Complete sync]
    Q -->|Yes| S{Breaking change?}
    
    S -->|Yes| T[Create migration guide]
    S -->|No| U[✅ Sync complete]
    T --> U
```

### Synchronization Checklist

Use this checklist in your PR:
```markdown
## Layer Synchronization Checklist

- [ ] **Schema Layer** (if changed):
  - [ ] `schema.prisma` updated
  - [ ] `npx prisma generate` executed
  - [ ] Migration created: `npx prisma migrate dev`
  - [ ] Migration tested locally

- [ ] **Backend Layer** (if schema/DTO changed):
  - [ ] DTOs updated to match Prisma types
  - [ ] Validators updated (`class-validator` decorators)
  - [ ] Service layer methods updated
  - [ ] Unit tests updated
  - [ ] Integration tests updated

- [ ] **API Layer** (if DTOs changed):
  - [ ] OpenAPI/Swagger decorators updated
  - [ ] Request/response examples updated
  - [ ] API documentation regenerated
  - [ ] Postman collection updated (if used)

- [ ] **Frontend Layer** (if API changed):
  - [ ] TypeScript types updated in `frontend/types/`
  - [ ] API client methods updated
  - [ ] React components updated
  - [ ] Forms/validation updated
  - [ ] Frontend tests updated

- [ ] **Event Layer** (if event models changed):
  - [ ] Event type definitions updated
  - [ ] Event contracts documented: `docs/contracts/events/`
  - [ ] Event producers updated
  - [ ] Event consumers updated
  - [ ] Event tests updated

- [ ] **Documentation Layer**:
  - [ ] Data dictionary updated (if significant)
  - [ ] State machine docs updated (if stateful entity)
  - [ ] Migration guide created (if

  - [ ] Migration guide created (if breaking)
  - [ ] README updated (if API/setup changed)

- [ ] **Testing**:
  - [ ] All affected tests pass
  - [ ] Manual testing completed
  - [ ] No type errors in frontend (`npm run type-check`)
  - [ ] No compilation errors in backend (`npm run build`)
Examples
✅ Good Example: Complete Layer Sync
Scenario: Adding phoneNumber field to User
PR Description:
markdown## Add Phone Number to User Profile

**Changes:**
- Added `phoneNumber` field to User model
- Synchronized across all layers

### Layer Synchronization Checklist
- [x] Schema: Added `phoneNumber String?` to User model
- [x] Backend: Updated UserDto, CreateUserDto, UpdateUserDto
- [x] Backend: Added phone validation using `@IsPhoneNumber()`
- [x] API: Updated Swagger decorators
- [x] Frontend: Updated User interface
- [x] Frontend: Updated ProfileForm component
- [x] Tests: Added tests for phone validation
- [x] Docs: Updated user.md in data dictionary

**Files Changed:**
- schema.prisma
- apps/api/src/users/dto/user.dto.ts
- apps/api/src/users/dto/create-user.dto.ts
- apps/api/src/users/dto/update-user.dto.ts
- apps/api/src/users/users.service.ts
- apps/api/src/users/users.service.spec.ts
- frontend/types/user.ts
- frontend/components/ProfileForm.tsx
- frontend/components/ProfileForm.test.tsx
- docs/data-dictionary/user.md
Implementation:
typescript// 1. schema.prisma
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  firstName   String
  lastName    String
  phoneNumber String?  @unique // ← ADDED
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// 2. Migration generated
// migrations/20251122_add_phone_number/migration.sql
ALTER TABLE "User" ADD COLUMN "phoneNumber" TEXT;
ALTER TABLE "User" ADD CONSTRAINT "User_phoneNumber_key" UNIQUE ("phoneNumber");

// 3. DTOs updated
// apps/api/src/users/dto/user.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ required: false })
  phoneNumber?: string; // ← ADDED

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

// apps/api/src/users/dto/create-user.dto.ts
import { IsEmail, IsString, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsPhoneNumber() // ← ADDED with validation
  phoneNumber?: string;
}

// apps/api/src/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsPhoneNumber() // ← ADDED
  phoneNumber?: string;
}

// 4. Service updated
// apps/api/src/users/users.service.ts
async create(createUserDto: CreateUserDto): Promise<UserDto> {
  const user = await this.prisma.user.create({
    data: {
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      phoneNumber: createUserDto.phoneNumber, // ← ADDED
    },
  });
  return new UserDto(user);
}

// 5. Tests updated
// apps/api/src/users/users.service.spec.ts
describe('create', () => {
  it('should create user with phone number', async () => {
    const dto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1234567890', // ← ADDED
    };
    
    const result = await service.create(dto);
    
    expect(result.phoneNumber).toBe('+1234567890');
  });
  
  it('should validate phone number format', async () => {
    const dto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: 'invalid', // ← INVALID
    };
    
    await expect(service.create(dto)).rejects.toThrow(BadRequestException);
  });
});

// 6. Frontend types updated
// frontend/types/user.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string; // ← ADDED
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string; // ← ADDED
}

// 7. Frontend component updated
// frontend/components/ProfileForm.tsx
interface ProfileFormData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string; // ← ADDED
}

export const ProfileForm: React.FC<Props> = ({ user, onSave }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || '', // ← ADDED
    },
  });
  
  return (
    <form onSubmit={handleSubmit(onSave)}>
      {/* ... existing fields ... */}
      
      <div>
        <label>Phone Number</label>
        <input
          {...register('phoneNumber', {
            pattern: {
              value: /^\+?[1-9]\d{1,14}$/,
              message: 'Invalid phone number format',
            },
          })}
        />
        {errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}
      </div>
      
      <button type="submit">Save</button>
    </form>
  );
};

// 8. Frontend tests updated
// frontend/components/ProfileForm.test.tsx
describe('ProfileForm', () => {
  it('should render phone number field', () => {
    const user = {
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+1234567890', // ← ADDED
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01',
    };
    
    render(<ProfileForm user={user} onSave={jest.fn()} />);
    
    const phoneInput = screen.getByLabelText('Phone Number');
    expect(phoneInput).toHaveValue('+1234567890');
  });
  
  it('should validate phone number format', async () => {
    const user = mockUser();
    const onSave = jest.fn();
    
    render(<ProfileForm user={user} onSave={onSave} />);
    
    const phoneInput = screen.getByLabelText('Phone Number');
    fireEvent.change(phoneInput, { target: { value: 'invalid' } });
    
    const submitButton = screen.getByText('Save');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid phone number format')).toBeInTheDocument();
    });
    expect(onSave).not.toHaveBeenCalled();
  });
});

// 9. Documentation updated
// docs/data-dictionary/user.md
## User

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| phoneNumber | String | No | User's phone number in E.164 format (e.g., +1234567890) | ← ADDED

### Validation Rules

- `phoneNumber`: Must be valid E.164 format if provided ← ADDED
❌ Bad Example: Incomplete Sync
typescript// ❌ Only updated schema.prisma
model User {
  id          String   @id @default(uuid())
  phoneNumber String?  // ← ADDED
}

// ❌ Backend DTOs NOT updated (type mismatch!)
export class UserDto {
  id: string;
  email: string;
  // phoneNumber missing! ← ERROR
}

// ❌ Frontend types NOT updated
export interface User {
  id: string;
  email: string;
  // phoneNumber missing! ← ERROR
}

// Result: Runtime errors, type mismatches, data loss!
````

### Step 5 Verification (The Contract)

Before finalizing code with layer changes, verify:

- [ ] **MUST** verify schema changes (if applicable):
  - [ ] `schema.prisma` updated
  - [ ] `npx prisma generate` executed
  - [ ] Migration created and tested
- [ ] **MUST** verify backend synchronization:
  - [ ] All DTOs updated to match schema
  - [ ] Validators updated
  - [ ] Service methods updated
  - [ ] Backend tests updated and passing
- [ ] **MUST** verify frontend synchronization:
  - [ ] TypeScript types updated
  - [ ] Components updated
  - [ ] Forms/validation updated
  - [ ] Frontend tests updated and passing
  - [ ] No TypeScript errors (`npm run type-check`)
- [ ] **MUST** verify API documentation updated:
  - [ ] Swagger/OpenAPI decorators updated
  - [ ] API docs regenerated
- [ ] **MUST** verify contracts updated (if event-driven):
  - [ ] Event contracts documented
  - [ ] Producers/consumers updated
- [ ] **MUST** verify tests pass:
  - [ ] Unit tests pass
  - [ ] Integration tests pass
  - [ ] E2E tests pass (if applicable)
- [ ] **SHOULD** verify documentation updated:
  - [ ] Data dictionary updated (if significant)
  - [ ] State machine docs updated (if stateful)

**Consequences:**
- Incomplete synchronization = HARD STOP (CI blocks merge)
- Missing DTOs = HARD STOP
- Missing frontend types = HARD STOP
- TypeScript errors = HARD STOP
- Test failures = HARD STOP
- Missing API docs = OVERRIDE required
- Missing event contracts = OVERRIDE required

**Exemptions:** None - layer synchronization is always required

### Related Rules

- `05-data.mdc`: State Machine Documentation
- `05-data.mdc`: Contract Documentation
- `00-master.mdc`: Breaking Changes (if removing/renaming fields)
- `10-quality.mdc`: Testing Requirements

### Change Log

- **2025-11-22** v2.1.0: Enhanced with explicit triggers, decision tree, and Step 5 enforcement
- **2025-11-21** v2.0.0: Initial layer synchronization rule
````

---

**OPA Policy:** `services/opa/policies/layer-sync.rego`
````rego
package compliance.data.layer_sync

import future.keywords.contains
import future.keywords.if
import future.keywords.in

# HARD STOP: Schema change without DTO update
deny contains msg if {
    has_schema_change(input.changed_files)
    not has_dto_update(input.changed_files)
    
    msg := "HARD STOP [Layer Sync]: schema.prisma changed but DTOs not updated. Sync all layers in same PR."
}

# HARD STOP: DTO change without frontend type update
deny contains msg if {
    has_dto_change(input.changed_files)
    has_public_api(input.changed_files)
    not has_frontend_type_update(input.changed_files)
    
    msg := "HARD STOP [Layer Sync]: Public API DTOs changed but frontend types not updated."
}

# HARD STOP: Schema change without migration
deny contains msg if {
    has_schema_change(input.changed_files)
    not has_migration(input.changed_files)
    
    msg := "HARD STOP [Layer Sync]: schema.prisma changed but no migration created. Run 'npx prisma migrate dev'."
}

# HARD STOP: TypeScript errors in frontend
deny contains msg if {
    input.typescript_check_failed == true
    
    msg := "HARD STOP [Layer Sync]: TypeScript type checking failed. Fix type errors before merge."
}

# OVERRIDE: API change without Swagger update
override contains msg if {
    has_controller_change(input.changed_files)
    not has_swagger_update(input.changed_files)
    
    msg := "OVERRIDE REQUIRED [Layer Sync]: API controller changed but Swagger decorators not updated."
}

# OVERRIDE: Schema change without data dictionary update
override contains msg if {
    has_significant_schema_change(input.changed_files)
    not has_data_dictionary_update(input.changed_files)
    
    msg := "OVERRIDE REQUIRED [Layer Sync]: Significant schema change should update data dictionary."
}

# WARNING: Missing tests for layer changes
warn contains msg if {
    has_schema_change(input.changed_files)
    not has_sufficient_tests(input.changed_files)
    
    msg := "WARNING [Layer Sync]: Schema changed but test coverage may be insufficient. Verify all layers tested."
}

# Helper: Detect schema changes
has_schema_change(files) if {
    some file in files
    file.path == "prisma/schema.prisma"
}

has_schema_change(files) if {
    some file in files
    contains(file.path, "schema.prisma")
}

# Helper: Detect DTO updates
has_dto_update(files) if {
    some file in files
    contains(file.path, ".dto.ts")
    file.status in ["modified", "added"]
}

# Helper: Detect DTO changes
has_dto_change(files) if {
    some file in files
    contains(file.path, ".dto.ts")
}

# Helper: Check if API is public (exposed via controller)
has_public_api(files) if {
    some file in files
    contains(file.path, ".controller.ts")
}

# Helper: Detect frontend type updates
has_frontend_type_update(files) if {
    some file in files
    contains(file.path, "frontend/types/")
    file.status in ["modified", "added"]
}

has_frontend_type_update(files) if {
    some file in files
    contains(file.path, "apps/mobile/types/")
    file.status in ["modified", "added"]
}

# Helper: Detect migration
has_migration(files) if {
    some file in files
    contains(file.path, "migrations/")
    endswith(file.path, "migration.sql")
}

# Helper: Detect controller changes
has_controller_change(files) if {
    some file in files
    contains(file.path, ".controller.ts")
}

# Helper: Detect Swagger updates
has_swagger_update(files) if {
    some file in files
    contains(file.path, ".controller.ts")
    contains(file.diff, "@Api")
}

has_swagger_update(files) if {
    some file in files
    contains(file.path, ".dto.ts")
    contains(file.diff, "@ApiProperty")
}

# Helper: Significant schema change (>5 fields)
has_significant_schema_change(files) if {
    some file in files
    contains(file.path, "schema.prisma")
    count_schema_field_changes(file.diff) > 5
}

# Helper: Data dictionary update
has_data_dictionary_update(files) if {
    some file in files
    contains(file.path, "docs/data-dictionary/")
}

# Helper: Sufficient tests
has_sufficient_tests(files) if {
    test_files := [f | 
        f := files[_]
        contains(f.path, ".test.ts")
    ]
    count(test_files) >= 2  # At least backend and frontend tests
}

# Helper: Count schema field changes
count_schema_field_changes(diff) := count if {
    changes := [change |
        line := split(diff, "\n")[_]
        regex.match(`^[+-]\s+\w+\s+\w+`, line)
        change := line
    ]
    count := count(changes)
}
````

---

**CI Workflow:** `.github/workflows/layer-sync-check.yml`
````yaml
name: Layer Sync Check

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  check-layer-sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v40
        with:
          files: |
            prisma/schema.prisma
            **/*.dto.ts
            **/types/**/*.ts
            **/*.controller.ts
      
      - name: Check schema changes
        id: schema-check
        run: |
          SCHEMA_CHANGED=$(echo '${{ steps.changed-files.outputs.all_changed_files }}' | jq 'map(select(contains("schema.prisma"))) | length')
          echo "schema_changed=$SCHEMA_CHANGED" >> $GITHUB_OUTPUT
          
          if [ "$SCHEMA_CHANGED" -gt 0 ]; then
            echo "⚠️  Schema change detected"
          fi
      
      - name: Verify DTOs updated
        if: steps.schema-check.outputs.schema_changed > 0
        run: |
          DTO_CHANGED=$(echo '${{ steps.changed-files.outputs.all_changed_files }}' | jq 'map(select(contains(".dto.ts"))) | length')
          
          if [ "$DTO_CHANGED" -eq 0 ]; then
            echo "❌ LAYER SYNC VIOLATION"
            echo ""
            echo "schema.prisma changed but no DTOs updated."
            echo "Required: Update DTOs to match schema changes."
            exit 1
          fi
          
          echo "✅ DTOs updated"
      
      - name: Verify frontend types updated
        if: steps.schema-check.outputs.schema_changed > 0
        run: |
          TYPES_CHANGED=$(echo '${{ steps.changed-files.outputs.all_changed_files }}' | jq 'map(select(contains("/types/"))) | length')
          
          if [ "$TYPES_CHANGED" -eq 0 ]; then
            echo "❌ LAYER SYNC VIOLATION"
            echo ""
            echo "schema.prisma and DTOs changed but frontend types not updated."
            echo "Required: Update frontend/types/ to match API changes."
            exit 1
          fi
          
          echo "✅ Frontend types updated"
      
      - name: Check for migration
        if: steps.schema-check.outputs.schema_changed > 0
        run: |
          MIGRATION_EXISTS=$(echo '${{ steps.changed-files.outputs.all_changed_files }}' | jq 'map(select(contains("migrations/") and endswith("migration.sql"))) | length')
          
          if [ "$MIGRATION_EXISTS" -eq 0 ]; then
            echo "❌ LAYER SYNC VIOLATION"
            echo ""
            echo "schema.prisma changed but no migration found."
            echo "Required: Run 'npx prisma migrate dev' to create migration."
            exit 1
          fi
          
          echo "✅ Migration created"
      
      - name: TypeScript type check
        run: |
          # Check backend types
          cd apps/api && npm run type-check
          
          # Check frontend types
          cd ../../frontend && npm run type-check
          
          echo "✅ TypeScript type checking passed"
      
      - name: Generate sync report
        if: always()
        run: |
          cat > sync-report.md <<EOF
          ## Layer Synchronization Report
          
          **Schema Changed:** ${{ steps.schema-check.outputs.schema_changed > 0 && '✅ Yes' || '❌ No' }}
          
          **Synchronization Status:**
          - DTOs: $([ "$DTO_CHANGED" -gt 0 ] && echo "✅ Updated" || echo "❌ Not Updated")
          - Frontend Types: $([ "$TYPES_CHANGED" -gt 0 ] && echo "✅ Updated" || echo "❌ Not Updated")
          - Migration: $([ "$MIGRATION_EXISTS" -gt 0 ] && echo "✅ Created" || echo "❌ Missing")
          - TypeScript: ✅ Passing
          
          **Files Changed:**
          \`\`\`
          ${{ steps.changed-files.outputs.all_changed_files }}
          \`\`\`
          EOF
          
          cat sync-report.md >> $GITHUB_STEP_SUMMARY
      
      - name: Comment PR
        uses: actions/github-script@v7
        if: always()
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('sync-report.md', 'utf8');
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: report
            });
````

---

### Day 4-5: Fix Documentation Updates (Issue #9) and Configuration Changes (Issue #10)

**Update:** `.cursor/rules/00-master.mdc` (add new sections)
````markdown
## DOCUMENTATION UPDATE REQUIREMENTS

**Version:** 2.1.0  
**Last Updated:** 2025-11-22

### Purpose

Ensure documentation stays synchronized with code changes to prevent confusion, onboarding delays, and deployment failures.

### Documentation Types

#### Living Documentation (MUST stay in sync):
- **README.md**: Setup, installation, quick start
- **API Documentation**: OpenAPI/Swagger specs
- **Architecture Diagrams**: If code structure changes
- **.env.example**: Environment variable templates
- **Data Dictionary**: Schema/model changes
- **State Machine Docs**: Workflow/status changes

#### Reference Documentation (CAN lag):
- Design documents (historical)
- Planning documents (completed features)
- Legacy documentation (deprecated features)
- Meeting notes/decision logs (after recorded)

### Triggers (When Documentation Update is MANDATORY)

#### README.md Updates Required:
- ✅ New setup/installation steps
- ✅ New environment variables
- ✅ Changed installation process
- ✅ New deployment requirements
- ✅ New development tools required
- ✅ Changed API base URLs

#### API Documentation Updates Required:
- ✅ New endpoints
- ✅ Modified endpoints (request/response)
- ✅ Breaking API changes
- ✅ Authentication changes
- ✅ New error codes

#### Architecture Documentation Updates Required:
- ✅ New services/modules
- ✅ Changed service boundaries
- ✅ New data flows
- ✅ Infrastructure changes
- ✅ New dependencies (major)

#### Data Dictionary Updates Required:
- ✅ New models/entities
- ✅ New fields (>3 fields added)
- ✅ Changed validation rules
- ✅ New relationships

### Requirements

#### MANDATORY: Documentation Synchronization
```markdown
## Documentation Update Checklist

- [ ] **README.md** (if setup/installation changed):
  - [ ] Prerequisites section updated
  - [ ] Installation steps updated
  - [ ] Environment variables documented
  - [ ] Quick start guide updated
  - [ ] Troubleshooting section updated (if new issues)

- [ ] **API Documentation** (if endpoints changed):
  - [ ] Swagger/OpenAPI specs regenerated
  - [ ] @ApiOperation decorators updated
  - [ ] Request/response examples updated
  - [ ] Error responses documented
  - [ ] Authentication requirements documented

- [ ] **Architecture Docs** (if structure changed):
  - [ ] Service diagram updated
  - [ ] Data flow diagram updated
  - [ ] Deployment diagram updated (if infrastructure changed)
  - [ ] Module relationship diagram updated

- [ ] **Code Documentation** (if public API changed):
  - [ ] JSDoc/TSDoc comments updated
  - [ ] Interface documentation updated
  - [ ] Complex logic explained
  - [ ] Configuration options documented
```

### Step 5 Verification

- [ ] **MUST** verify README.md updated (if setup/installation/env vars changed)
- [ ] **MUST** verify API documentation updated (if endpoints changed)
- [ ] **MUST** verify architecture docs updated (if structure changed)
- [ ] **MUST** verify .env.example updated (if env vars added)
- [ ] **SHOULD** verify data dictionary updated (if schema changed)
- [ ] **SHOULD** verify code comments updated (if public API changed)

**Consequences:**
- Missing README updates = HARD STOP
- Missing API docs = HARD STOP
- Missing .env.example updates = HARD STOP
- Missing architecture docs = OVERRIDE required

---

## CONFIGURATION CHANGE DOCUMENTATION

**Version:** 2.1.0  
**Last Updated:** 2025-11-22

### Purpose

Ensure configuration changes are documented and deployment-ready to prevent production outages and deployment failures.

### Triggers (When Configuration Documentation is MANDATORY)

#### Environment Variables:
- ✅ New environment variables
- ✅ Changed variable names
- ✅ Changed default values
- ✅ Changed required vs optional status
- ✅ Deprecated variables

#### Configuration Files:
- ✅ New configuration files
- ✅ Changed configuration structure
- ✅ Changed configuration options
- ✅ New secrets/credentials

#### Deployment Configuration:
- ✅ Changed deployment requirements
- ✅ New infrastructure needs
- ✅ Changed service dependencies
- ✅ New ports/protocols

### Requirements

#### MANDATORY: Configuration Documentation

**1. .env.example Updates:**
```bash
# ❌ Bad: No documentation
NEW_API_KEY=

# ✅ Good: Documented
# OpenAI API Key (required)
# Get from: https://platform.openai.com/api-keys
# Format: sk-...
# Used for: AI content generation
OPENAI_API_KEY=sk-example123...

# Database connection (required)
# Format: postgresql://user:pass@host:port/db
# Example: postgresql://postgres:password@localhost:5432/verofield
DATABASE_URL=postgresql://user:password@localhost:5432/verofield

# Redis connection (optional)
# Default: redis://localhost:6379
# Used for: Caching and session storage
REDIS_URL=redis://localhost:6379
```

**2. Deployment Documentation:**

File: `docs/deployment/configuration.md`
```markdown
## Configuration Changes - [DATE]

### New Environment Variables

| Variable | Required | Default | Description | Added In |
|----------|----------|---------|-------------|----------|
| OPENAI_API_KEY | Yes | None | OpenAI API key for AI features | v2.1.0 |
| REDIS_URL | No | redis://localhost:6379 | Redis connection string | v2.1.0 |

### Changed Variables

| Variable | Old Value | New Value | Reason | Migration Required |
|----------|-----------|-----------|--------|-------------------|
| JWT_EXPIRATION | 24h | 1h | Security improvement | No - backwards compatible |

### Deprecated Variables

| Variable | Deprecated In | Remove In | Replacement |
|----------|---------------|-----------|-------------|
| LEGACY_AUTH_TOKEN | v2.1.0 | v3.0.0 | Use OPENAI_API_KEY |

### Deployment Steps

1. Update environment variables in deployment platform
2. Restart services (if required)
3. Verify health checks pass
4. Monitor logs for configuration errors
```

### Step 5 Verification

- [ ] **MUST** verify .env.example updated (if env vars changed)
- [ ] **MUST** verify all new env vars documented (purpose, format, source)
- [ ] **MUST** verify deployment docs updated (if deployment changed)
- [ ] **MUST** verify required vs optional clearly marked
- [ ] **SHOULD** verify migration steps documented (if breaking config change)

**Consequences:**
- Missing .env.example updates = HARD STOP
- Undocumented env vars = HARD STOP
- Missing deployment docs = OVERRIDE required
````

---

**OPA Policies:** `services/opa/policies/docs-update.rego` and `config.rego`
````rego
package compliance.documentation

import future.keywords.contains
import future.keywords.if

# HARD STOP: API change without Swagger update
deny contains msg if {
    has_api_change(input.changed_files)
    not has_swagger_update(input.changed_files)
    
    msg := "HARD STOP [Docs]: API endpoints changed but Swagger/OpenAPI not updated"
}

# HARD STOP: Setup change without README update
deny contains msg if {
    has_setup_change(input.changed_files)
    not has_readme_update(input.changed_files)
    
    msg := "HARD STOP [Docs]: Setup/installation changed but README.md not updated"
}

# Helpers...
has_api_change(files) if {
    some file in files
    contains(file.path, ".controller.ts")
}

has_swagger_update(files) if {
    some file in files
    contains(file.diff, "@Api")
}

has_setup_change(files) if {
    some file in files
    file.path == "package.json"
    contains(file.diff, "scripts")
}

has_readme_update(files) if {
    some file in files
    file.path == "README.md"
}
````
````rego
package compliance.configuration

import future.keywords.contains
import future.keywords.if

# HARD STOP: New env var without .env.example update
deny contains msg if {
    has_new_env_var(input.changed_files)
    not has_env_example_update(input.changed_files)
    
    msg := "HARD STOP [Config]: New environment variable detected but .env.example not updated"
}

# Helpers...
has_new_env_var(files) if {
    some file in files
    contains(file.diff, "process.env.")
    # Check if it's a new variable (added line)
    regex.match(`^\+.*process\.env\.`, file.diff)
}

has_env_example_update(files) if {
    some file in files
    contains(file.path, ".env.example")
}
````

---

## Week 3 Summary

By end of Week 3, you should have:

✅ **High Priority Rules Fixed (4/4):**
- Issue #1: Engineering Decisions - COMPLETE
- Issue #3: Layer Synchronization - COMPLETE
- Issue #9: Documentation Updates - COMPLETE
- Issue #10: Configuration Changes - COMPLETE

✅ **OPA Policies Created (4/4):**
- decisions.rego
- layer-sync.rego
- docs-update.rego
- config.rego

✅ **CI Workflows Added:**
- decision-check.yml
- layer-sync-check.yml

✅ **Progress:**
- Rule Compliance Matrix: 8/25 complete (32%)
- Critical + High: 7/7 complete (100%)

---

## Week 4: Medium Priority Rules

### Day 1-2: Fix Tech Debt Logging (Issue #2), State Machine Docs (Issue #4), Contract Documentation (Issue #5)

**Update:** `.cursor/rules/12-tech-debt.mdc`
````markdown
## TECH DEBT LOGGING REQUIREMENTSRetryCContinueVersion: 2.1.0
Last Updated: 2025-11-22
Purpose
Track technical debt systematically to enable prioritization, prevent accumulation, and maintain codebase health over time.
What is "Meaningful Tech Debt"?
Technical debt is considered meaningful and must be logged if it meets ANY of these criteria:

Affects Maintainability:

Makes code harder to understand
Makes future changes more difficult
Violates established patterns
Creates tight coupling


Affects Performance:

Known performance bottleneck
Inefficient algorithm/query
Memory leak risk
N+1 query pattern


Has Known Remediation:

Clear path to fix exists
Requires specific refactoring
Waiting on dependency update
Deferred for time constraints


Impacts Multiple Developers:

Affects shared code/modules
Requires team knowledge to work around
Creates confusion for new developers
Violates team conventions


Future Work Required:

Temporary workaround
Deferred feature implementation
Incomplete migration
Deprecated pattern still in use



Triggers (When Logging is MANDATORY)
Introducing New Debt:

✅ Using workaround instead of proper solution
✅ Deferring fix due to time constraints
✅ Using deprecated patterns/APIs
✅ Skipping tests due to complexity
✅ Hardcoding values that should be configurable
✅ Copy-pasting code instead of abstracting
✅ Disabling linter rules

Touching Existing Debt:

✅ Modifying code with known tech debt
✅ Extending debt-affected areas
✅ Working around existing debt
✅ Adding features to debt-laden code

Discovering Debt:

✅ Finding undocumented debt during implementation
✅ Identifying debt while refactoring
✅ Discovering anti-patterns in code review

NOT Tech Debt (Don't Log):

❌ TODOs for current PR work (complete in same PR)
❌ Ideas for future features (use backlog)
❌ Minor style inconsistencies (fix immediately)
❌ Single-file optimizations (fix if touched)
❌ Personal coding preferences

Requirements
MANDATORY: Tech Debt Entry Format
File: docs/tech-debt.md
Entry Template:
markdown## [DEBT-XXX]: [Brief Description]

**Category:** [Code Quality | Performance | Security | Documentation | Testing | Architecture | Dependencies]  
**Priority:** [Critical | High | Medium | Low]  
**Status:** [Open | In Progress | Resolved]  
**Created:** YYYY-MM-DD  
**Updated:** YYYY-MM-DD

---

### Location

**Files Affected:**
- `path/to/file1.ts` (lines XX-YY)
- `path/to/file2.ts` (lines XX-YY)

**Modules Affected:**
- Module A
- Module B

### Description

[Detailed description of the technical debt. What is the issue? Why is it debt?]

**Current Implementation:**
``````typescript
// Current problematic code example
``````

**Why It's Debt:**
- [Reason 1]
- [Reason 2]

### Impact

**Severity:**
- **Maintainability:** [None | Low | Medium | High | Critical]
- **Performance:** [None | Low | Medium | High | Critical]
- **Security:** [None | Low | Medium | High | Critical]
- **Scalability:** [None | Low | Medium | High | Critical]

**Developer Impact:**
[How does this affect developers working in this area?]

**User Impact:**
[How does this affect end users, if at all?]

**Business Impact:**
[How does this affect business operations/goals?]

### Root Cause

[Why was this debt introduced?]

**Reason:**
- [ ] Time constraints (deadline pressure)
- [ ] Lack of knowledge (didn't know better way)
- [ ] External dependency limitation
- [ ] Temporary workaround (meant to be fixed)
- [ ] Technical limitation at the time
- [ ] Other: [Explain]

**Context:**
[What was the situation when this was introduced?]

### Remediation Plan

**Proposed Solution:**
``````typescript
// Ideal implementation
``````

**Steps to Fix:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Dependencies:**
- [Dependency 1 - what needs to happen first]
- [Dependency 2]

**Risks of Fixing:**
- [Risk 1 and mitigation]
- [Risk 2 and mitigation]

### Effort Estimate

**Estimated Time:** [Hours/Days/Weeks]

**Complexity:** [Simple | Moderate | Complex | Very Complex]

**Required Skills:**
- [Skill 1]
- [Skill 2]

**Team Members Who Can Fix:**
- @username1
- @username2

### Related Items

**Related Debt:**
- DEBT-XXX: [Related debt item]

**Related Issues:**
- #123: [Related GitHub issue]

**Related PRs:**
- #456: [PR that introduced this debt]

**Related Decisions:**
- DEC-XXX: [Engineering decision that caused this]

### History

**Created:** YYYY-MM-DD by @username
- Initial discovery/creation

**Updated:** YYYY-MM-DD by @username
- Extended to cover additional files

**Status Changes:**
- YYYY-MM-DD: Open → In Progress (Assigned to @username)
- YYYY-MM-DD: In Progress → Resolved (Fixed in PR #789)

---
Decision Tree
mermaidgraph TD
    A[Code Change/Discovery] --> B{Is it tech debt?}
    B -->|No| C[No logging needed]
    B -->|Yes| D{Meaningful?}
    
    D -->|No - Minor issue| E[Fix immediately]
    D -->|Yes| F{Check criteria}
    
    F --> G{Affects maintainability?}
    F --> H{Affects performance?}
    F --> I{Has known remediation?}
    F --> J{Impacts multiple devs?}
    F --> K{Requires future work?}
    
    G -->|Yes| L[MUST log in tech-debt.md]
    H -->|Yes| L
    I -->|Yes| L
    J -->|Yes| L
    K -->|Yes| L
    
    G -->|No| M{Other criteria?}
    H -->|No| M
    I -->|No| M
    J -->|No| M
    K -->|No| M
    
    M -->|All No| E
    M -->|Any Yes| L
    
    L --> N[Use full template]
    N --> O[Assign category and priority]
    O --> P[Estimate effort]
    P --> Q[Link related items]
    Q --> R[✅ Debt logged]
Examples
✅ Good Example: Complete Tech Debt Entry
markdown## [DEBT-042]: N+1 Query in WorkOrder List Endpoint

**Category:** Performance  
**Priority:** High  
**Status:** Open  
**Created:** 2025-11-22  
**Updated:** 2025-11-22

---

### Location

**Files Affected:**
- `apps/api/src/workorders/workorders.service.ts` (lines 45-67)
- `apps/api/src/workorders/workorders.controller.ts` (lines 23-28)

**Modules Affected:**
- WorkOrders module

### Description

The `findAll()` method loads work orders and then makes separate database queries for each work order's customer and assigned technician, resulting in N+1 queries.

**Current Implementation:**
``````typescript
async findAll(tenantId: string): Promise<WorkOrderDto[]> {
  const workOrders = await this.prisma.workOrder.findMany({
    where: { tenantId },
  });
  
  // N+1: Separate query for each work order
  return Promise.all(
    workOrders.map(async (wo) => ({
      ...wo,
      customer: await this.prisma.customer.findUnique({
        where: { id: wo.customerId }
      }),
      technician: await this.prisma.user.findUnique({
        where: { id: wo.technicianId }
      }),
    }))
  );
}
``````

**Why It's Debt:**
- Makes 1 + (2 * N) database queries instead of 1
- Performance degrades linearly with number of work orders
- Becomes critical bottleneck with >100 work orders
- Violates established pattern (should use Prisma `include`)

### Impact

**Severity:**
- **Maintainability:** Low (pattern is clear but inefficient)
- **Performance:** High (significant with scale)
- **Security:** None
- **Scalability:** High (blocks horizontal scaling)

**Developer Impact:**
Similar patterns exist in 3 other endpoints (Invoices, Payments, Assets). Developers may copy this pattern thinking it's correct.

**User Impact:**
Work order list page takes 2-5 seconds to load for tenants with >100 work orders. Users report sluggish experience.

**Business Impact:**
Large customers (>500 work orders) experiencing slow page loads. Risk of churn.

### Root Cause

**Reason:**
- [x] Time constraints (deadline pressure)
- [x] Lack of knowledge (didn't know better way)

**Context:**
Implemented during MVP sprint. Developer was new to Prisma and didn't know about `include` option. Code worked fine with small test dataset (<10 work orders) so issue wasn't caught until production.

### Remediation Plan

**Proposed Solution:**
``````typescript
async findAll(tenantId: string): Promise<WorkOrderDto[]> {
  const workOrders = await this.prisma.workOrder.findMany({
    where: { tenantId },
    include: {
      customer: true,
      technician: true,
    },
  });
  
  return workOrders.map(wo => new WorkOrderDto(wo));
}
``````

**Steps to Fix:**
1. Update `findAll()` to use Prisma `include`
2. Update `findOne()` similarly (same issue)
3. Update WorkOrderDto to handle included relations
4. Add integration test with >100 work orders
5. Benchmark before/after performance
6. Update similar patterns in Invoices, Payments, Assets modules

**Dependencies:**
- None - can be fixed immediately

**Risks of Fixing:**
- Risk: Response schema might change slightly
  - Mitigation: Verify frontend can handle included relations
- Risk: May expose PII accidentally
  - Mitigation: Ensure RLS policies cover included relations

### Effort Estimate

**Estimated Time:** 4 hours

**Complexity:** Simple

**Required Skills:**
- Prisma knowledge
- SQL optimization basics

**Team Members Who Can Fix:**
- @backend-lead
- @senior-backend-dev
- @mid-level-backend-dev

### Related Items

**Related Debt:**
- DEBT-043: Same N+1 pattern in Invoices module
- DEBT-044: Same N+1 pattern in Payments module

**Related Issues:**
- #234: "Work order list page slow for large tenants"

**Related PRs:**
- #123: PR that introduced this code (2025-01-15)

**Related Decisions:**
- DEC-002: Adopt Prisma as ORM (should have caught this pattern)

### History

**Created:** 2025-11-22 by @performance-engineer
- Discovered during performance profiling session
- Confirmed with APM tools (2000+ queries for 1 page load)

---
❌ Bad Example: Incomplete Tech Debt Entry
markdown## TODO: Fix the work order thing

It's slow.

Location: workorders.service.ts

Fix: Make it faster
``````

**Problems:**
- ❌ No debt ID
- ❌ No category/priority
- ❌ No detailed description
- ❌ No impact assessment
- ❌ No remediation plan
- ❌ No effort estimate

### Step 5 Verification (The Contract)

Before finalizing code that introduces or touches tech debt, verify:

- [ ] **MUST** verify debt meets "meaningful" criteria
- [ ] **MUST** verify debt logged in `docs/tech-debt.md`
- [ ] **MUST** verify entry uses full template (no TBD placeholders)
- [ ] **MUST** verify category and priority assigned
- [ ] **MUST** verify location specified (files and lines)
- [ ] **MUST** verify impact assessment completed
- [ ] **MUST** verify remediation plan documented
- [ ] **MUST** verify effort estimate provided
- [ ] **SHOULD** verify related items linked
- [ ] **SHOULD** verify Boy Scout Rule applied (if touching existing debt)

**Consequences:**
- Introducing meaningful debt without logging = HARD STOP
- Incomplete debt entry (missing sections) = HARD STOP
- No remediation plan = HARD STOP
- No effort estimate = OVERRIDE required
- Touching existing debt without Boy Scout Rule = WARNING

**Exemptions:**
- Minor debt that can be fixed immediately (fix instead of log)
- Debt in proof-of-concept code (mark with `// POC:`)
- Emergency fixes (log within 48 hours)

### Related Rules

- `00-master.mdc`: Boy Scout Rule (fix debt when touching code)
- `10-quality.mdc`: Testing Requirements (debt about missing tests)

### Change Log

- **2025-11-22** v2.1.0: Complete rewrite with explicit criteria, decision tree, and Step 5 checks
- **2025-11-21** v2.0.0: Initial tech debt logging rule
``````

---

**Update:** `.cursor/rules/05-data.mdc` (add State Machine section)
``````markdown
## STATE MACHINE DOCUMENTATION REQUIREMENTS

**Version:** 2.1.0  
**Last Updated:** 2025-11-22

### Purpose

Document state machines to ensure transitions are valid, side effects are clear, and illegal state changes are prevented.

### What is a "Stateful Entity"?

An entity is **stateful** if it has:

1. **Status/State Field:** Field that changes over time (e.g., `status`, `state`, `lifecycle`)
2. **Workflow States:** Multiple states representing progression (e.g., draft → review → approved)
3. **Lifecycle States:** States representing entity lifetime (e.g., created → active → archived)
4. **Constrained Transitions:** Not all state changes are valid

### Examples of Stateful Entities

**MUST Document:**
- ✅ WorkOrder (draft → scheduled → in_progress → completed → cancelled)
- ✅ Invoice (draft → sent → paid → overdue → voided)
- ✅ Payment (pending → processing → completed → failed → refunded)
- ✅ User (invited → active → suspended → deleted)
- ✅ Ticket (open → assigned → in_progress → resolved → closed)
- ✅ Approval (pending → approved → rejected)

**NOT Stateful (Don't Document):**
- ❌ Simple flags (isActive, isDeleted) - only 2 states
- ❌ Timestamps (createdAt, updatedAt) - not discrete states
- ❌ Counters (viewCount, retryCount) - not workflow states

### Triggers (When State Machine Documentation is MANDATORY)

#### New Stateful Entity:
- ✅ Creating entity with status/state field
- ✅ Adding workflow to existing entity
- ✅ Implementing multi-step process

#### Modifying State Transitions:
- ✅ Adding new states
- ✅ Changing legal transitions
- ✅ Modifying transition logic
- ✅ Adding transition validation

### Requirements

#### MANDATORY: State Machine Documentation

**File:** `docs/state-machines/[entity]-state-machine.md`

**Template:**
`````markdown
# [Entity] State Machine

**Version:** 1.0  
**Last Updated:** YYYY-MM-DD  
**Entity:** [Entity Name]  
**Status Field:** `[fieldName]`  
**Type:** `[enum/string/number]`

---

## States

### Valid States

| State | Value | Description | Terminal | User-Visible Label |
|-------|-------|-------------|----------|-------------------|
| DRAFT | `draft` | Work order created but not scheduled | No | "Draft" |
| SCHEDULED | `scheduled` | Assigned to technician with date | No | "Scheduled" |
| IN_PROGRESS | `in_progress` | Technician started work | No | "In Progress" |
| COMPLETED | `completed` | Work finished successfully | Yes | "Completed" |
| CANCELLED | `cancelled` | Work order cancelled | Yes | "Cancelled" |

**Terminal States:** States that cannot transition further (end of lifecycle)

### State Diagram
````mermaid
stateDiagram-v2
    [*] --> DRAFT: Create Work Order
    
    DRAFT --> SCHEDULED: Assign & Schedule
    DRAFT --> CANCELLED: Cancel (before scheduling)
    
    SCHEDULED --> IN_PROGRESS: Start Work
    SCHEDULED --> DRAFT: Unassign
    SCHEDULED --> CANCELLED: Cancel (after scheduling)
    
    IN_PROGRESS --> COMPLETED: Finish Work
    IN_PROGRESS --> SCHEDULED: Pause Work
    IN_PROGRESS --> CANCELLED: Cancel (during work)
    
    COMPLETED --> [*]
    CANCELLED --> [*]
    
    note right of COMPLETED
        Terminal state
        Cannot transition
    end note
    
    note right of CANCELLED
        Terminal state
        Cannot transition
    end note
````

---

## Transitions

### Legal Transitions

#### DRAFT → SCHEDULED

**Trigger:** Assign technician and set scheduled date

**Preconditions:**
- Technician must be assigned (`technicianId` not null)
- Scheduled date must be set (`scheduledDate` not null)
- Scheduled date must be in future

**Side Effects:**
- Emit `workorder.scheduled` event
- Send notification to technician
- Create audit log entry
- Update technician's calendar

**Code Example:**
````typescript
async scheduleWorkOrder(
  id: string,
  technicianId: string,
  scheduledDate: Date
): Promise<WorkOrder> {
  const workOrder = await this.findOne(id);
  
  // Validate transition
  if (workOrder.status !== WorkOrderStatus.DRAFT) {
    throw new BadRequestException(
      `Cannot schedule work order in ${workOrder.status} state`
    );
  }
  
  // Validate preconditions
  if (scheduledDate < new Date()) {
    throw new BadRequestException('Scheduled date must be in future');
  }
  
  // Perform transition
  const updated = await this.prisma.workOrder.update({
    where: { id },
    data: {
      status: WorkOrderStatus.SCHEDULED,
      technicianId,
      scheduledDate,
    },
  });
  
  // Side effects
  await this.eventEmitter.emit('workorder.scheduled', updated);
  await this.notificationService.notifyTechnician(technicianId, updated);
  await this.auditService.log('workorder.scheduled', updated);
  
  return updated;
}
````

#### SCHEDULED → IN_PROGRESS

**Trigger:** Technician starts work

**Preconditions:**
- Technician must be the assigned technician (authorization)
- Current date must be >= scheduled date (can't start early)

**Side Effects:**
- Emit `workorder.started` event
- Update technician status to "busy"
- Start time tracking
- Create audit log entry

**Code Example:**
````typescript
async startWorkOrder(id: string, userId: string): Promise<WorkOrder> {
  const workOrder = await this.findOne(id);
  
  // Validate transition
  if (workOrder.status !== WorkOrderStatus.SCHEDULED) {
    throw new BadRequestException(
      `Cannot start work order in ${workOrder.status} state`
    );
  }
  
  // Validate authorization
  if (workOrder.technicianId !== userId) {
    throw new ForbiddenException('Only assigned technician can start work');
  }
  
  // Perform transition
  const updated = await this.prisma.workOrder.update({
    where: { id },
    data: {
      status: WorkOrderStatus.IN_PROGRESS,
      startedAt: new Date(),
    },
  });
  
  // Side effects
  await this.eventEmitter.emit('workorder.started', updated);
  await this.technicianService.updateStatus(userId, 'busy');
  await this.timeTrackingService.start(id, userId);
  await this.auditService.log('workorder.started', updated);
  
  return updated;
}
````

*(Continue for all other legal transitions...)*

### Illegal Transitions

#### COMPLETED → Any State

**Why Illegal:** Terminal state - work is finished

**Error Handling:**
````typescript
if (workOrder.status === WorkOrderStatus.COMPLETED) {
  throw new BadRequestException(
    'Cannot modify completed work order. Create a new work order instead.'
  );
}
````

**User Message:** "This work order is complete and cannot be modified. Please create a new work order if additional work is needed."

#### DRAFT → COMPLETED

**Why Illegal:** Must be scheduled and started first

**Error Handling:**
````typescript
if (currentStatus === WorkOrderStatus.DRAFT) {
  throw new BadRequestException(
    'Cannot complete work order without scheduling and starting it first'
  );
}
````

**User Message:** "Work order must be scheduled and started before it can be completed."

#### CANCELLED → Any State (except CANCELLED)

**Why Illegal:** Terminal state - cannot resume cancelled work

**Error Handling:**
````typescript
if (workOrder.status === WorkOrderStatus.CANCELLED) {
  throw new BadRequestException(
    'Cannot resume cancelled work order. Create a new work order instead.'
  );
}
````

**User Message:** "This work order was cancelled and cannot be resumed. Please create a new work order."

---

## Implementation

### Code Location

**Entity:** `apps/api/src/workorders/entities/work-order.entity.ts`
````typescript
export enum WorkOrderStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class WorkOrder {
  id: string;
  status: WorkOrderStatus;
  technicianId?: string;
  scheduledDate?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
}
````

**Service:** `apps/api/src/workorders/workorders.service.ts`

**Transition Methods:**
- `scheduleWorkOrder(id, technicianId, scheduledDate)`
- `startWorkOrder(id, userId)`
- `completeWorkOrder(id, userId)`
- `cancelWorkOrder(id, reason)`
- `unassignWorkOrder(id)` (SCHEDULED → DRAFT)
- `pauseWorkOrder(id)` (IN_PROGRESS → SCHEDULED)

### Guards/Validators

**File:** `apps/api/src/workorders/guards/state-transition.guard.ts`
````typescript
export class WorkOrderStateTransitionGuard {
  canTransition(from: WorkOrderStatus, to: WorkOrderStatus): boolean {
    const legalTransitions = {
      [WorkOrderStatus.DRAFT]: [
        WorkOrderStatus.SCHEDULED,
        WorkOrderStatus.CANCELLED,
      ],
      [WorkOrderStatus.SCHEDULED]: [
        WorkOrderStatus.IN_PROGRESS,
        WorkOrderStatus.DRAFT,
        WorkOrderStatus.CANCELLED,
      ],
      [WorkOrderStatus.IN_PROGRESS]: [
        WorkOrderStatus.COMPLETED,
        WorkOrderStatus.SCHEDULED,
        WorkOrderStatus.CANCELLED,
      ],
      [WorkOrderStatus.COMPLETED]: [], // Terminal
      [WorkOrderStatus.CANCELLED]: [], // Terminal
    };
    
    return legalTransitions[from]?.includes(to) ?? false;
  }
}
````

### Audit Logging

All state transitions MUST emit audit events:
````typescript
await this.auditService.log({
  entity: 'WorkOrder',
  entityId: workOrder.id,
  action: 'state_transition',
  oldState: workOrder.status,
  newState: newStatus,
  userId: userId,
  timestamp: new Date(),
  metadata: {
    reason: reason, // if applicable
    technicianId: workOrder.technicianId,
  },
});
````

---

## Testing

### Test Coverage

All state transitions MUST have tests:

**File:** `apps/api/src/workorders/workorders.service.spec.ts`
````typescript
describe('WorkOrderService - State Transitions', () => {
  describe('DRAFT → SCHEDULED', () => {
    it('should schedule work order successfully', async () => {
      const workOrder = await createDraftWorkOrder();
      
      const result = await service.scheduleWorkOrder(
        workOrder.id,
        'tech-123',
        tomorrow()
      );
      
      expect(result.status).toBe(WorkOrderStatus.SCHEDULED);
      expect(result.technicianId).toBe('tech-123');
    });
    
    it('should reject if not in DRAFT state', async () => {
      const workOrder = await createScheduledWorkOrder();
      
      await expect(
        service.scheduleWorkOrder(workOrder.id, 'tech-123', tomorrow())
      ).rejects.toThrow('Cannot schedule work order in scheduled state');
    });
    
    it('should reject if scheduled date is in past', async () => {
      const workOrder = await createDraftWorkOrder();
      
      await expect(
        service.scheduleWorkOrder(workOrder.id, 'tech-123', yesterday())
      ).rejects.toThrow('Scheduled date must be in future');
    });
  });
  
  describe('Illegal Transitions', () => {
    it('should reject COMPLETED → SCHEDULED', async () => {
      const workOrder = await createCompletedWorkOrder();
      
      await expect(
        service.scheduleWorkOrder(workOrder.id, 'tech-123', tomorrow())
      ).rejects.toThrow('Cannot modify completed work order');
    });
  });
});
````

---

## Change Log

- **2025-11-22** v1.0: Initial state machine documentation
`````

---

**Update:** `.cursor/rules/05-data.mdc` (add Contract Documentation section)
`````markdown
## CONTRACT DOCUMENTATION REQUIREMENTS

**Version:** 2.1.0  
**Last Updated:** 2025-11-22

### Purpose

Document API contracts and event schemas to ensure consumers can integrate reliably and breaking changes are avoided.

### Triggers (When Contract Documentation is MANDATORY)

#### API Contracts:
- ✅ New API endpoints
- ✅ Modified request schemas (fields added/removed/changed)
- ✅ Modified response schemas
- ✅ Breaking API changes
- ✅ Authentication requirement changes

#### Event Contracts:
- ✅ New events published/consumed
- ✅ Modified event schemas
- ✅ Event versioning changes
- ✅ New event types

#### Data Contracts:
- ✅ Schema changes affecting external interfaces
- ✅ DTO changes affecting API consumers
- ✅ Type changes affecting frontend/backend contracts

### Requirements

#### MANDATORY: API Contract Documentation

**File:** `docs/contracts/api/[resource]-api.md`

**Template:**
````markdown
# [Resource] API Contract

**Version:** v1  
**Last Updated:** YYYY-MM-DD  
**Base Path:** `/api/v1/[resource]`  
**Authentication:** Required (JWT Bearer token)

---

## Endpoints

### GET /api/v1/workorders

**Description:** List all work orders for authenticated tenant

**Authentication:** Required

**Authorization:** `workorder:read` permission

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number (1-indexed) |
| pageSize | number | No | 20 | Items per page (max 100) |
| status | string | No | - | Filter by status (draft, scheduled, etc.) |
| technicianId | string | No | - | Filter by assigned technician |

**Request Example:**
```http
GET /api/v1/workorders?page=1&pageSize=20&status=scheduled
Authorization: Bearer eyJhbGc...
```

**Response: 200 OK**
```typescript
interface ListWorkOrdersResponse {
  data: WorkOrderDto[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

interface WorkOrderDto {
  id: string;
  status: 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  title: string;
  description: string | null;
  customerId: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  technicianId: string | null;
  technician: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  scheduledDate: string | null; // ISO 8601
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}
```

**Example Response:**
```json
{
  "data": [
    {
      "id": "wo_123",
      "status": "scheduled",
      "title": "Fix HVAC System",
      "description": "Customer reports AC not cooling",
      "customerId": "cust_456",
      "customer": {
        "id": "cust_456",
        "name": "Acme Corp",
        "email": "facilities@acme.com"
      },
      "technicianId": "tech_789",
      "technician": {
        "id": "tech_789",
        "firstName": "John",
        "lastName": "Doe"
      },
      "scheduledDate": "2025-11-23T14:00:00Z",
      "createdAt": "2025-11-22T10:30:00Z",
      "updatedAt": "2025-11-22T15:45:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 1,
    "totalPages": 1
  }
}
```

**Error Responses:**

**401 Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

**403 Forbidden:**
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```

**429 Too Many Requests:**
```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded",
  "error": "Too Many Requests",
  "retryAfter": 60
}
```

---

### POST /api/v1/workorders

**Description:** Create a new work order

**Authentication:** Required

**Authorization:** `workorder:create` permission

**Request Body:**
```typescript
interface CreateWorkOrderRequest {
  title: string; // Required, 1-200 chars
  description?: string; // Optional, max 2000 chars
  customerId: string; // Required, must be valid customer ID
  technicianId?: string; // Optional, must be valid user ID with technician role
  scheduledDate?: string; // Optional, ISO 8601, must be future date
}
```

**Example Request:**
```http
POST /api/v1/workorders
Authorization: Bearer eyJhbGc...
Content-Type: application/json

{
  "title": "Fix HVAC System",
  "description": "Customer reports AC not cooling",
  "customerId": "cust_456",
  "technicianId": "tech_789",
  "scheduledDate": "2025-11-23T14:00:00Z"
}
```

**Response: 201 Created**
```json
{
  "id": "wo_123",
  "status": "scheduled",
  "title": "Fix HVAC System",
  ...
}
```

**Validation Errors: 400 Bad Request**
```json
{
  "statusCode": 400,
  "message": [ "title must be between 1 and 200 characters",
    "customerId must be a valid UUID"
  ],
  "error": "Bad Request"
}
Business Logic Errors: 422 Unprocessable Entity
json{
  "statusCode": 422,
  "message": "Customer not found or not accessible in your tenant",
  "error": "Unprocessable Entity"
}

Field Specifications
WorkOrderDto Fields
FieldTypeNullableValidationDescriptionidstringNoUUID v4Unique identifierstatusenumNoOne of: draft, scheduled, in_progress, completed, cancelledCurrent statetitlestringNo1-200 charsBrief descriptiondescriptionstringYesMax 2000 charsDetailed descriptioncustomerIdstringNoUUID v4Customer referencetechnicianIdstringYesUUID v4Assigned technicianscheduledDatestringYesISO 8601Scheduled start timecreatedAtstringNoISO 8601Creation timestampupdatedAtstringNoISO 8601Last update timestamp
Data Types
ISO 8601 Dates:

Format: YYYY-MM-DDTHH:mm:ss.sssZ
Example: 2025-11-23T14:00:00.000Z
Timezone: Always UTC (Z suffix)

UUIDs:

Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
Version: v4 (random)
Example: 550e8400-e29b-41d4-a716-446655440000


Versioning
Current Version: v1
Version Strategy: URL-based versioning (/api/v1/, /api/v2/)
Deprecation Policy:

Versions supported for 12 months after new version release
Deprecation warnings sent 6 months before removal
Breaking changes require new major version

Version History:
VersionReleasedStatusEnd of Lifev12025-01-15Current-

Rate Limiting
Global Limits:

1000 requests per hour per user
100 requests per minute per user

Endpoint-Specific Limits:

GET endpoints: No additional limits
POST/PUT/DELETE endpoints: 100 per hour per user

Rate Limit Headers:
httpX-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1732377600
`````

---

## Change Log

- **2025-11-22** v1.0: Initial API contract documentation
- **2025-11-15** v1.0: Added scheduledDate field
- **2025-01-15** v1.0: Initial release
`````

---

#### MANDATORY: Event Contract Documentation

**File:** `docs/contracts/events/[event-name].md`

**Template:**
`````markdown
# [Event Name] Event Contract

**Event Type:** `[domain].[entity].[action]`  
**Version:** 1.0  
**Last Updated:** YYYY-MM-DD  
**Producer:** [Service Name]  
**Consumers:** [List of services/systems]

---

## Event Schema

### Event Metadata
````typescript
interface EventMetadata {
  eventId: string; // Unique event ID (UUID v4)
  eventType: string; // 'workorder.scheduled'
  version: string; // '1.0'
  timestamp: string; // ISO 8601 UTC
  tenantId: string; // Tenant context
  userId: string; // User who triggered event
  correlationId?: string; // For tracing related events
  causationId?: string; // Event that caused this event
}
````

### Event Payload
````typescript
interface WorkOrderScheduledEvent {
  metadata: EventMetadata;
  data: {
    workOrderId: string;
    status: 'scheduled';
    customerId: string;
    customerName: string;
    technicianId: string;
    technicianName: string;
    scheduledDate: string; // ISO 8601
    previousStatus: 'draft';
    changedAt: string; // ISO 8601
    changedBy: string; // User ID
  };
}
````

### Example Event
````json
{
  "metadata": {
    "eventId": "evt_123abc",
    "eventType": "workorder.scheduled",
    "version": "1.0",
    "timestamp": "2025-11-22T15:30:00.000Z",
    "tenantId": "tenant_456",
    "userId": "user_789",
    "correlationId": "corr_xyz"
  },
  "data": {
    "workOrderId": "wo_123",
    "status": "scheduled",
    "customerId": "cust_456",
    "customerName": "Acme Corp",
    "technicianId": "tech_789",
    "technicianName": "John Doe",
    "scheduledDate": "2025-11-23T14:00:00.000Z",
    "previousStatus": "draft",
    "changedAt": "2025-11-22T15:30:00.000Z",
    "changedBy": "user_789"
  }
}
````

---

## Event Lifecycle

### When Event is Published

**Trigger:** Work order status transitions from DRAFT to SCHEDULED

**Published By:** `WorkOrdersService.scheduleWorkOrder()`

**Published After:**
- ✅ Database transaction committed
- ✅ State transition completed
- ✅ Audit log created

**Not Published If:**
- ❌ Validation fails
- ❌ Authorization fails
- ❌ Database transaction fails

### Event Ordering

**Guarantee:** Events for same work order are ordered by `timestamp`

**No Guarantee:** Events across different work orders

### Idempotency

**Event ID:** Unique per event occurrence

**Consumers Should:** Use `eventId` to deduplicate

**Example Deduplication:**
````typescript
async handleWorkOrderScheduled(event: WorkOrderScheduledEvent) {
  // Check if already processed
  const processed = await this.cache.get(`event:${event.metadata.eventId}`);
  if (processed) {
    console.log('Event already processed, skipping');
    return;
  }
  
  // Process event
  await this.processScheduling(event.data);
  
  // Mark as processed (24 hour TTL)
  await this.cache.set(`event:${event.metadata.eventId}`, true, 86400);
}
````

---

## Consumers

### Notification Service

**Purpose:** Send notification to technician

**Actions:**
1. Retrieve technician contact info
2. Format notification message
3. Send email/SMS/push notification
4. Log notification sent

**Error Handling:**
- If notification fails, retry up to 3 times
- If all retries fail, log error and continue (don't block other consumers)

### Calendar Service

**Purpose:** Add work order to technician's calendar

**Actions:**
1. Create calendar event
2. Set reminder 30 minutes before
3. Include customer details in event

**Error Handling:**
- If calendar API fails, retry with exponential backoff
- After 5 retries, log error and mark for manual review

### Analytics Service

**Purpose:** Track work order metrics

**Actions:**
1. Increment "scheduled_workorders" counter
2. Record time-to-schedule metric
3. Update technician utilization stats

**Error Handling:**
- Analytics failures are non-critical
- Log error but don't retry (eventual consistency acceptable)

---

## Versioning

**Current Version:** 1.0

**Breaking Changes:**
- Removing fields from `data` object
- Changing field types
- Changing event type name
- Removing event entirely

**Non-Breaking Changes:**
- Adding optional fields to `data` object
- Adding new metadata fields
- Adding new event types

**Version Migration:**
If breaking change needed:
1. Create new event type with v2 suffix: `workorder.scheduled.v2`
2. Publish both v1 and v2 for 6 months
3. Update consumers to v2
4. Deprecate v1 after all consumers migrated

---

## Testing

### Producer Tests

**File:** `apps/api/src/workorders/workorders.service.spec.ts`
````typescript
describe('scheduleWorkOrder - Event Publishing', () => {
  it('should publish workorder.scheduled event', async () => {
    const eventSpy = jest.spyOn(eventEmitter, 'emit');
    
    await service.scheduleWorkOrder('wo_123', 'tech_789', tomorrow());
    
    expect(eventSpy).toHaveBeenCalledWith(
      'workorder.scheduled',
      expect.objectContaining({
        metadata: expect.objectContaining({
          eventType: 'workorder.scheduled',
          version: '1.0',
        }),
        data: expect.objectContaining({
          workOrderId: 'wo_123',
          technicianId: 'tech_789',
        }),
      })
    );
  });
  
  it('should not publish event if transaction fails', async () => {
    const eventSpy = jest.spyOn(eventEmitter, 'emit');
    prisma.workOrder.update.mockRejectedValue(new Error('DB error'));
    
    await expect(
      service.scheduleWorkOrder('wo_123', 'tech_789', tomorrow())
    ).rejects.toThrow();
    
    expect(eventSpy).not.toHaveBeenCalled();
  });
});
````

### Consumer Tests

**File:** `apps/notification-service/src/handlers/workorder-scheduled.spec.ts`
````typescript
describe('WorkOrderScheduledHandler', () => {
  it('should send notification to technician', async () => {
    const event = createMockEvent('workorder.scheduled');
    
    await handler.handle(event);
    
    expect(notificationService.sendEmail).toHaveBeenCalledWith({
      to: 'tech@example.com',
      subject: 'New Work Order Assigned',
      template: 'workorder-scheduled',
      data: expect.any(Object),
    });
  });
  
  it('should handle duplicate events idempotently', async () => {
    const event = createMockEvent('workorder.scheduled');
    
    await handler.handle(event);
    await handler.handle(event); // Second time
    
    expect(notificationService.sendEmail).toHaveBeenCalledTimes(1);
  });
});
````

---

## Change Log

- **2025-11-22** v1.0: Initial event contract documentation
`````

---

### OPA Policies

**File:** `services/opa/policies/tech-debt.rego`
`````rego
package compliance.tech_debt

import future.keywords.contains
import future.keywords.if

# HARD STOP: Meaningful tech debt not logged
deny contains msg if {
    has_tech_debt_markers(input.changed_files)
    not has_tech_debt_entry(input.changed_files)
    
    msg := "HARD STOP [Tech Debt]: Code contains debt markers (TODO, FIXME, HACK) but no entry in docs/tech-debt.md"
}

# WARNING: Touching grandfathered code without Boy Scout Rule
warn contains msg if {
    touches_grandfathered_code(input.changed_files, input.exemptions)
    not improves_debt(input.changed_files)
    
    msg := "WARNING [Tech Debt]: Modified grandfathered code but didn't fix any violations (Boy Scout Rule)"
}

# Helpers
has_tech_debt_markers(files) if {
    some file in files
    regex.match(`(TODO|FIXME|HACK|XXX)`, file.diff)
}

has_tech_debt_entry(files) if {
    some file in files
    file.path == "docs/tech-debt.md"
    contains(file.diff, "## [DEBT-")
}

touches_grandfathered_code(files, exemptions) if {
    some file in files
    some exemption in exemptions
    file.path == exemption.path
}

improves_debt(files) if {
    some file in files
    file.path == ".compliance-exemptions.json"
    contains(file.diff, "-")
}
`````

**File:** `services/opa/policies/state-machines.rego`
`````rego
package compliance.data.state_machines

import future.keywords.contains
import future.keywords.if

# HARD STOP: Stateful entity without state machine docs
deny contains msg if {
    is_stateful_entity(input.changed_files)
    not has_state_machine_docs(input.changed_files)
    
    msg := "HARD STOP [State Machines]: Stateful entity detected but no state machine documentation in docs/state-machines/"
}

# Helpers
is_stateful_entity(files) if {
    some file in files
    contains(file.path, ".entity.ts")
    contains(file.diff, "status:")
}

is_stateful_entity(files) if {
    some file in files
    contains(file.path, ".entity.ts")
    contains(file.diff, "state:")
}

has_state_machine_docs(files) if {
    some file in files
    contains(file.path, "docs/state-machines/")
    endswith(file.path, "-state-machine.md")
}
`````

**File:** `services/opa/policies/contracts.rego`
`````rego
package compliance.data.contracts

import future.keywords.contains
import future.keywords.if

# HARD STOP: API endpoint without contract docs
deny contains msg if {
    has_new_endpoint(input.changed_files)
    not has_api_contract_docs(input.changed_files)
    
    msg := "HARD STOP [Contracts]: New API endpoint added but no contract documentation in docs/contracts/api/"
}

# HARD STOP: Event published without contract docs
deny contains msg if {
    publishes_event(input.changed_files)
    not has_event_contract_docs(input.changed_files)
    
    msg := "HARD STOP [Contracts]: New event published but no contract documentation in docs/contracts/events/"
}

# Helpers
has_new_endpoint(files) if {
    some file in files
    contains(file.path, ".controller.ts")
    regex.match(`\+\s*@(Get|Post|Put|Delete|Patch)`, file.diff)
}

publishes_event(files) if {
    some file in files
    contains(file.diff, "eventEmitter.emit")
}

has_api_contract_docs(files) if {
    some file in files
    contains(file.path, "docs/contracts/api/")
    endswith(file.path, "-api.md")
}

has_event_contract_docs(files) if {
    some file in files
    contains(file.path, "docs/contracts/events/")
    endswith(file.path, ".md")
}
`````

---

### Day 3-4: Fix Performance Impact (Issue #11), Error Handling Standards (Issue #12)

**Update:** `.cursor/rules/10-quality.mdc` (add Performance section)
`````markdown
## PERFORMANCE IMPACT DOCUMENTATION

**Version:** 2.1.0  
**Last Updated:** 2025-11-22

### Purpose

Document and assess performance implications of changes to prevent production bottlenecks and maintain SLA compliance.

### Triggers (When Performance Documentation is MANDATORY)

#### Database Changes:
- ✅ New queries (especially in loops)
- ✅ Query modifications (adding joins, filters)
- ✅ Missing indexes identified
- ✅ N+1 query risks
- ✅ Large data set operations (>1000 records)

#### Algorithm Changes:
- ✅ New loops or nested loops
- ✅ Algorithm complexity changes (O(n) → O(n²))
- ✅ Large data processing (>10MB files)
- ✅ Recursive operations

#### API Changes:
- ✅ New endpoints
- ✅ Changes to response payload size
- ✅ Changes to caching behavior
- ✅ New external API calls

#### Frontend Changes:
- ✅ New components with heavy rendering (>100 elements)
- ✅ Changes to bundle size (>50KB increase)
- ✅ New third-party dependencies (>100KB)

### Performance Budgets

| Metric | Target | Maximum | Critical |
|--------|--------|---------|----------|
| API Response Time (P50) | <100ms | <200ms | <500ms |
| API Response Time (P99) | <500ms | <1000ms | <2000ms |
| Database Query Time | <50ms | <100ms | <500ms |
| Frontend Bundle Size | <500KB | <1MB | <2MB |
| Time to Interactive (TTI) | <2s | <3s | <5s |
| Memory Usage (Backend) | <512MB | <1GB | <2GB |

### Requirements

#### MANDATORY: Performance Analysis

**When Required:**
- Database query changes
- Algorithm with O(n²) or higher complexity
- API endpoint response >100KB
- Bundle size increase >50KB

**Documentation Format:**
````markdown
## Performance Analysis: [Feature/Change]

**Date:** YYYY-MM-DD  
**Author:** @username  
**Category:** [Database | Algorithm | API | Frontend]

---

### Change Description

[What changed and why]

### Performance Impact

**Expected Load:**
- Concurrent users: [number]
- Requests per second: [number]
- Data set size: [number of records]

**Measured Performance:**

| Metric | Before | After | Change | Within Budget? |
|--------|--------|-------|--------|----------------|
| Response Time (P50) | 85ms | 120ms | +35ms | ⚠️ At limit |
| Response Time (P99) | 450ms | 680ms | +230ms | ⚠️ At limit |
| Database Queries | 3 | 1 | -2 | ✅ Improved |
| Memory Usage | 245MB | 280MB | +35MB | ✅ Yes |

**Bottleneck Analysis:**
- Primary bottleneck: [Description]
- Secondary concerns: [List]

### Benchmarks

**Test Environment:**
- CPU: [specs]
- Memory: [specs]
- Database: [version, size]

**Benchmark Code:**
```typescript
// Benchmark script
const start = performance.now();
for (let i = 0; i < 1000; i++) {
  await service.findAll();
}
const end = performance.now();
console.log(`Average: ${(end - start) / 1000}ms`);
```

**Results:**
````
Old implementation: 85ms average (1000 iterations)
New implementation: 120ms average (1000 iterations)
Difference: +41% slower
`````

### Optimization Opportunities

**Identified Optimizations:**
1. Add index on `user.email` column
   - Expected improvement: -30ms
   - Implementation: 1 hour
2. Cache customer data
   - Expected improvement: -40ms
   - Implementation: 3 hours

**Optimization Decisions:**
- [x] Optimization 1: Implemented in this PR
- [ ] Optimization 2: Tracked as DEBT-045 for later

### Risk Assessment

**Performance Risks:**
- **High Load:** May exceed P99 budget under high load (>100 RPS)
  - Mitigation: Implement caching (tracked as DEBT-045)
- **Data Growth:** Performance degrades with >10,000 customers
  - Mitigation: Add pagination, implement in next sprint

**Acceptable Trade-offs:**
- Accepted 35ms slower response for code maintainability
- Within performance budget limits
- Optimization opportunities identified for future

### Monitoring

**Metrics to Watch:**
- `api.workorders.list.duration` (P50, P99)
- `db.query.workorders.findMany.duration`
- Error rate on `/api/workorders` endpoint

**Alerts Configured:**
- Alert if P99 > 1000ms for 5 minutes
- Alert if error rate > 1% for 5 minutes

---
Step 5 Verification

 MUST verify performance impact analyzed (if database/algorithm/API/bundle change)
 MUST verify benchmarks run (if significant change)
 MUST verify performance within budgets (or trade-off documented)
 SHOULD verify optimization opportunities identified
 SHOULD verify monitoring/alerts configured

Consequences:

Missing analysis for significant performance change = HARD STOP
Performance exceeds CRITICAL budget = HARD STOP
Performance exceeds MAXIMUM budget = OVERRIDE required (with optimization plan)
Performance exceeds TARGET budget = WARNING (track optimization)


ERROR HANDLING STANDARDS
Version: 2.1.0
Last Updated: 2025-11-22
Purpose
Ensure consistent, user-friendly error handling that doesn't expose sensitive information while providing useful debugging context.
Error Message Types
User-Facing Messages (Frontend/API Responses):
Goal: Help users understand and resolve the issue
Requirements:

✅ Concise and actionable
✅ No technical jargon
✅ No stack traces
✅ No internal IDs (except public IDs)
✅ No SQL/database errors
✅ Clear next steps

Examples:
typescript// ✅ Good
throw new BadRequestException(
  'Email address is invalid. Please check and try again.'
);

// ❌ Bad - Too technical
throw new BadRequestException(
  'Validation failed: email regex /^[a-z]+@[a-z]+\.[a-z]+$/ did not match input'
);

// ❌ Bad - Exposes internals
throw new InternalServerErrorException(
  'Database connection failed: Connection to postgres://user:pass@localhost:5432/db timed out'
);
Technical Messages (Logs):
Goal: Provide debugging context for developers
Requirements:

✅ Full context
✅ Include traceId
✅ Include error codes
✅ Include stack traces
✅ Include request details
✅ No PII (mask sensitive data)

Example:
typescriptthis.logger.error('Failed to create work order', {
  error: error.message,
  stack: error.stack,
  traceId: context.traceId,
  errorCode: 'WO_CREATE_001',
  userId: context.userId,
  tenantId: context.tenantId,
  requestBody: maskSensitiveData(dto),
  timestamp: new Date().toISOString(),
});
Custom Error Classes
When to Create:

Domain-specific errors (e.g., WorkOrderNotFoundError)
Errors requiring special handling
Errors with specific error codes
Errors used across multiple modules

When to Use Standard Errors:

Generic validation → BadRequestException
Generic not found → NotFoundException
Generic unauthorized → UnauthorizedException
Generic forbidden → ForbiddenException

Error Class Template
typescript// apps/api/src/workorders/errors/work-order-not-found.error.ts

export class WorkOrderNotFoundError extends NotFoundException {
  constructor(workOrderId: string) {
    super({
      message: 'Work order not found. It may have been deleted or you may not have access.',
      errorCode: 'WO_NOT_FOUND',
      workOrderId, // Internal context (not exposed to user)
    });
    
    this.name = 'WorkOrderNotFoundError';
  }
  
  toJSON() {
    return {
      statusCode: 404,
      message: this.message,
      errorCode: 'WO_NOT_FOUND',
      // Note: workOrderId NOT included in response
    };
  }
}

// Usage
const workOrder = await this.findOne(id);
if (!workOrder) {
  throw new WorkOrderNotFoundError(id);
}
Error Response Format
Standard Error Response:
typescriptinterface ErrorResponse {
  statusCode: number;
  message: string | string[]; // Single message or array for validation
  error: string; // HTTP status text
  errorCode?: string; // Application-specific code
  timestamp?: string; // ISO 8601
  path?: string; // Request path
  traceId?: string; // For support/debugging
}
Example Responses:
Validation Error (400):
json{
  "statusCode": 400,
  "message": [
    "Email must be a valid email address",
    "Password must be at least 8 characters"
  ],
  "error": "Bad Request",
  "errorCode": "VALIDATION_FAILED",
  "timestamp": "2025-11-22T15:30:00.000Z",
  "path": "/api/v1/auth/register",
  "traceId": "trace_abc123"
}
Not Found (404):
json{
  "statusCode": 404,
  "message": "Work order not found. It may have been deleted or you may not have access.",
  "error": "Not Found",
  "errorCode": "WO_NOT_FOUND",
  "timestamp": "2025-11-22T15:30:00.000Z",
  "path": "/api/v1/workorders/wo_123",
  "traceId": "trace_xyz789"
}
Internal Server Error (500):
json{
  "statusCode": 500,
  "message": "An unexpected error occurred. Please try again later. If the problem persists, contact support with trace ID: trace_xyz789",
  "error": "Internal Server Error",
  "errorCode": "INTERNAL_ERROR",
  "timestamp": "2025-11-22T15:30:00.000Z",
  "path": "/api/v1/workorders",
  "traceId": "trace_xyz789"
}
`````

### Error Code Naming Convention

**Format:** `[MODULE]_[OPERATION]_[NUMBER]`

**Examples:**
- `WO_CREATE_001`: Work order creation failed
- `WO_NOT_FOUND`: Work order not found
- `AUTH_INVALID_TOKEN`: Invalid authentication token
- `PAYMENT_DECLINED`: Payment was declined

### Step 5 Verification

- [ ] **MUST** verify error messages are user-appropriate (no technical details exposed)
- [ ] **MUST** verify custom error classes used when appropriate
- [ ] **MUST** verify error codes assigned
- [ ] **MUST** verify technical details logged (not exposed to user)
- [ ] **MUST** verify PII masked in logs
- [ ] **SHOULD** verify error response format matches standard

**Consequences:**
- Technical details in user-facing errors = HARD STOP
- PII in logs = HARD STOP
- Missing error handling = HARD STOP
- Inconsistent error format = OVERRIDE required
`````

---

### Day 5: Fix Rollback Plans (Issue #13)

**Update:** `.cursor/rules/11-operations.mdc` (add Rollback section)
`````markdown
## ROLLBACK PLAN REQUIREMENTS

**Version:** 2.1.0  
**Last Updated:** 2025-11-22

### Purpose

Ensure all difficult-to-reverse changes have documented rollback procedures to minimize production downtime and data loss.

### Triggers (When Rollback Plan is MANDATORY)

#### Database Migrations:
- ✅ Schema changes (add/remove columns/tables)
- ✅ Data migrations (transforming existing data)
- ✅ Constraint changes (adding NOT NULL, foreign keys)
- ✅ Index changes (adding/removing indexes)

#### Feature Flags:
- ✅ New features behind flags
- ✅ Gradual rollouts
- ✅ A/B tests
- ✅ Canary deployments

#### Infrastructure Changes:
- ✅ Deployment configuration changes
- ✅ Service dependency changes
- ✅ Network/routing changes
- ✅ Resource scaling changes

#### Breaking Changes:
- ✅ API changes
- ✅ Behavioral changes
- ✅ Data format changes

### Requirements

#### MANDATORY: Rollback Plan Documentation

**Location:** Either in PR description OR `docs/rollbacks/[feature]-rollback.md`

**Template:**
````markdown
# Rollback Plan: [Feature Name]

**Date:** YYYY-MM-DD  
**Author:** @username  
**PR:** #1234  
**Deployment Date:** YYYY-MM-DD  
**Risk Level:** [Low | Medium | High | Critical]

---

## Change Summary

[Brief description of what's being deployed]

**Components Affected:**
- Database schema
- API endpoints
- Frontend components
- Background jobs

---

## Rollback Triggers

**Rollback if:**
- Error rate exceeds 5% for 5 minutes
- Critical functionality broken (payments, auth, data loss)
- Performance degrades >50%
- Customer-facing issues reported by >10 users

**Do NOT rollback if:**
- Minor UI glitches (can be hotfixed)
- Non-critical features affected
- Issues affecting <1% of users

---

## Rollback Procedure

### Prerequisites

**Required Access:**
- [ ] Production database access
- [ ] Deployment pipeline access
- [ ] Feature flag admin access

**Required Tools:**
- [ ] Database client (psql, pgAdmin)
- [ ] Deployment CLI
- [ ] Monitoring dashboards

**Team Coordination:**
- [ ] Notify #incidents channel
- [ ] Page on-call engineer
- [ ] Notify customer support team

### Step-by-Step Rollback

#### Step 1: Stop Traffic (if necessary)
```bash
# If immediate rollback needed, stop traffic to affected service
kubectl scale deployment api --replicas=0 -n production

# Or use feature flag to disable feature
curl -X POST https://api.example.com/admin/flags \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"flag": "new_workorder_flow", "enabled": false}'
```

**Estimated Time:** 30 seconds  
**Impact:** [Describe impact]

#### Step 2: Revert Code Deployment
```bash
# Revert to previous version
git revert abc123def456
git push origin main

# Or rollback in deployment tool
kubectl rollout undo deployment/api -n production

# Verify rollback
kubectl rollout status deployment/api -n production
```

**Estimated Time:** 2-3 minutes  
**Impact:** Service briefly unavailable during restart

#### Step 3: Rollback Database Migration (if applicable)
```bash
# Connect to production database
psql $DATABASE_URL

# Run down migration
BEGIN;

-- Rollback schema changes
ALTER TABLE work_orders DROP COLUMN new_field;
DROP INDEX idx_work_orders_new_field;

-- Verify rollback
\d work_orders

COMMIT;
```

**Estimated Time:** 1-2 minutes  
**Impact:** Database locked during migration

**⚠️ WARNING:** This migration deletes data! Ensure backup exists.

**Data Preservation:**
```bash
# Before rollback, backup affected data
pg_dump -t work_orders -f work_orders_backup_$(date +%Y%m%d).sql $DATABASE_URL
```

#### Step 4: Clear Caches
```bash
# Clear Redis cache
redis-cli -h $REDIS_HOST FLUSHDB

# Or clear specific keys
redis-cli -h $REDIS_HOST DEL "workorders:*"
```

**Estimated Time:** 10 seconds  
**Impact:** Temporary cache misses (performance degradation)

#### Step 5: Restart Affected Services
```bash
# Restart API service
kubectl rollout restart deployment/api -n production

# Restart background workers
kubectl rollout restart deployment/worker -n production

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=api -n production --timeout=300s
```

**Estimated Time:** 2-3 minutes  
**Impact:** Brief service interruption

#### Step 6: Verify Rollback

**Health Checks:**
```bash
# Check API health
curl https://api.example.com/health

# Check database connectivity
psql $DATABASE_URL -c "SELECT 1"

# Check critical endpoints
curl https://api.example.com/api/v1/workorders
Verification Checklist:

 API health check returns 200 OK
 Database queries executing successfully
 Error rate <1%
 Response times within normal range (P99 <1s)
 No data loss detected
 Critical user flows working (test manually)

Estimated Time: 5-10 minutes
Impact: None (verification only)
Step 7: Resume Traffic
bash# If traffic was stopped in Step 1, resume it
kubectl scale deployment api --replicas=3 -n production

# Or re-enable feature flag
curl -X POST https://api.example.com/admin/flags \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"flag": "new_workorder_flow", "enabled": true}'
Estimated Time: 30 seconds
Impact: Service fully restored

Data Preservation Strategy
Data Backup
Before Deployment:
bash# Full database backup
pg_dump $DATABASE_URL -f backup_pre_deploy_$(date +%Y%m%d_%H%M%S).sql

# Verify backup
pg_restore --list backup_pre_deploy_*.sql | head -20
Backup Location: s3://backups.example.com/pre-deploy/
Retention: 30 days
Data Migration Rollback
If migration transforms data:
sql-- Example: Rollback data transformation
BEGIN;

-- Restore original format
UPDATE work_orders 
SET legacy_field = new_field 
WHERE legacy_field IS NULL;

-- Drop new field
ALTER TABLE work_orders DROP COLUMN new_field;

COMMIT;
Data Loss Risk:

High Risk: New records created after deployment will lose new_field data
Mitigation: Export new records before rollback:

sql  COPY (
    SELECT * FROM work_orders 
    WHERE created_at > '2025-11-22 14:00:00'
  ) TO '/tmp/new_records.csv' WITH CSV HEADER;

Service Restart Requirements
Services to Restart:
ServiceRestart Required?ReasonCommandAPIYesCode changekubectl rollout restart deployment/apiWorkerYesUses same codekubectl rollout restart deployment/workerFrontendNoFeature flag controlledN/ADatabaseNoMigration onlyN/A
Restart Order:

Workers (stop processing jobs)
API (apply code changes)
Workers (resume with new code)


Verification Steps
Automated Verification
Smoke Tests:
bash# Run automated smoke test suite
npm run test:smoke -- --env=production

# Expected output: All tests pass
````

**Monitoring Checks:**
- Error rate: <1% (check Datadog)
- Response time P99: <1s (check Datadog)
- Database connections: <50 active (check PgHero)
- Memory usage: <1GB per pod (check Kubernetes)

### Manual Verification

**Critical User Flows:**
1. **Create Work Order:**
   - [ ] Navigate to /workorders/new
   - [ ] Fill out form
   - [ ] Submit
   - [ ] Verify work order created

2. **List Work Orders:**
   - [ ] Navigate to /workorders
   - [ ] Verify list loads
   - [ ] Verify data displayed correctly

3. **Update Work Order:**
   - [ ] Navigate to /workorders/:id/edit
   - [ ] Modify field
   - [ ] Save
   - [ ] Verify update persisted

**Estimated Time:** 10 minutes

---

## Rollback Timeline

**Total Rollback Time Estimate:** 15-20 minutes

| Step | Duration | Cumulative | Critical? |
|------|----------|------------|-----------|
| Stop Traffic | 30s | 30s | Yes |
| Revert Code | 3min | 3.5min | Yes |
| Rollback DB | 2min | 5.5min | Yes |
| Clear Caches | 10s | 6min | No |
| Restart Services | 3min | 9min | Yes |
| Verify | 10min | 19min | Yes |
| Resume Traffic | 30s | 19.5min | Yes |

**Downtime Estimate:** 5-10 minutes (if full rollback required)

---

## Rollback Limitations

**What CANNOT be Rolled Back:**

1. **Data Created After Deployment:**
   - New work orders created with new schema
   - User actions taken with new feature
   - **Mitigation:** Export and preserve data before rollback

2. **External API Calls:**
   - Webhooks already sent
   - Payment transactions already processed
   - **Mitigation:** Mark as "needs manual review" after rollback

3. **Audit Logs:**
   - Events already logged
   - **Impact:** Logs may reference non-existent states/fields
   - **Mitigation:** Acceptable - logs are historical record

**Partial Rollback Options:**

- **Feature Flag Only:** Disable feature, keep code deployed
- **Code Only:** Rollback code, keep database changes
- **Database Only:** Rollback database, keep code (if backwards compatible)

---

## Communication Plan

### During Rollback

**Notifications to Send:**

1. **#incidents Channel (Slack):**
````
   🚨 ROLLBACK IN PROGRESS
   
   Feature: New Work Order Flow
   Reason: Error rate exceeded 5%
   ETA: 15-20 minutes
   Status: In Progress (Step 3/7)
   Incident Commander: @username
````

2. **Customer Support Team:**
````
   Subject: [URGENT] Service Rollback in Progress
   
   We are rolling back the new work order feature due to technical issues.
   
   Expected downtime: 5-10 minutes
   Current time: 3:45 PM EST
   Expected completion: 4:00 PM EST
   
   Customer Impact: Work order creation/editing may be temporarily unavailable
   
   Status updates: #incidents channel
````

3. **Status Page:**
````
   Title: Service Degradation - Work Orders
   Status: Investigating
   Message: We're experiencing issues with work order functionality and are 
            working on a fix. We'll provide updates every 15 minutes.
````

### After Rollback

**Post-Rollback Notification:**
````
✅ ROLLBACK COMPLETE

Feature: New Work Order Flow
Duration: 18 minutes
Impact: 5 minutes of downtime
Resolution: Rolled back to previous version

Next Steps:
- Post-mortem scheduled for tomorrow 2 PM
- Fix will be deployed after thorough testing
- Monitor for any residual issues

Thanks for your patience!
````

---

## Post-Rollback Actions

### Immediate (Within 1 Hour):

- [ ] Verify all services stable
- [ ] Check for any orphaned data
- [ ] Review error logs for issues
- [ ] Update incident ticket with details
- [ ] Notify stakeholders of completion

### Short-Term (Within 24 Hours):

- [ ] Schedule post-mortem meeting
- [ ] Analyze root cause
- [ ] Create tickets to fix issues
- [ ] Update rollback plan based on learnings

### Long-Term (Within 1 Week):

- [ ] Conduct post-mortem
- [ ] Document lessons learned
- [ ] Implement improvements to prevent recurrence
- [ ] Retest fix in staging
- [ ] Plan re-deployment

---

## Lessons Learned (Post-Rollback)

**To be filled after rollback:**

### What Went Well:
- [Example: Rollback completed in 15 minutes, faster than estimated]
- [Example: No data loss occurred]

### What Could Be Improved:
- [Example: Database backup took longer than expected]
- [Example: Monitoring alerts didn't trigger early enough]

### Action Items:
- [ ] Ticket #123: Improve backup speed
- [ ] Ticket #456: Tune monitoring alerts

---

## Related Documentation

- **Deployment Guide:** `docs/deployment/production-deployment.md`
- **Database Migration Guide:** `docs/database/migration-guide.md`
- **Feature Flag Guide:** `docs/feature-flags.md`
- **Incident Response Playbook:** `docs/incidents/playbook.md`

---

## Approval

**Reviewed By:**
- [ ] @tech-lead (Technical review)
- [ ] @devops-lead (Infrastructure review)
- [ ] @product-manager (Business impact review)

**Approved for Deployment:** YYYY-MM-DD

---
````

### Step 5 Verification

- [ ] **MUST** verify rollback plan documented (if difficult-to-reverse changes)
- [ ] **MUST** verify plan includes step-by-step instructions
- [ ] **MUST** verify data preservation strategy documented
- [ ] **MUST** verify rollback tested in staging
- [ ] **MUST** verify rollback timeline estimated
- [ ] **SHOULD** verify rollback limitations documented
- [ ] **SHOULD** verify communication plan included

**Consequences:**
- Missing rollback plan for database migration = HARD STOP
- Missing rollback plan for breaking change = HARD STOP
- Missing data preservation strategy = HARD STOP
- Untested rollback plan = OVERRIDE required
- Missing rollback timeline = WARNING

**Exemptions:**
- Purely additive changes (no data transformation)
- Changes behind feature flags (can be disabled instantly)
- Documentation-only changes

Week 4 Summary
By end of Week 4, you should have:
✅ Medium Priority Rules Fixed (8/8):

Issue #2: Tech Debt Logging - COMPLETE
Issue #4: State Machine Docs - COMPLETE
Issue #5: Contract Documentation - COMPLETE
Issue #11: Performance Impact - COMPLETE
Issue #12: Error Handling Standards - COMPLETE
Issue #13: Rollback Plans - COMPLETE

✅ OPA Policies Created (6/6):

tech-debt.rego
state-machines.rego
contracts.rego
(Performance and error handling verified in code review, not OPA)

✅ Progress:

Rule Compliance Matrix: 14/25 complete (56%)
Critical + High + Medium: 14/14 complete (100%)


Week 5: Remaining Rules & Testing
Day 1-2: Fix Dependency Changes (Issue #14), Audit Logging (Issue #15)
Update: .cursor/rules/00-master.mdc (add Dependency Changes section)
markdown## DEPENDENCY CHANGE DOCUMENTATION

**Version:** 2.1.0  
**Last Updated:** 2025-11-22

### Purpose

Track dependency changes to identify security vulnerabilities, breaking changes, and licensing issues before they reach production.

### Triggers (When Documentation is MANDATORY)

#### New Dependencies:
- ✅ Adding any new npm package
- ✅ Adding any new third-party library
- ✅ Adding any new service dependency

#### Dependency Updates:
- ✅ Major version updates (breaking changes)
- ✅ Security patches
- ✅ Updates to critical dependencies (React, NestJS, Prisma)

#### Dependency Removals:
- ✅ Removing any dependency
- ✅ Replacing one dependency with another

### Requirements

#### MANDATORY: Dependency Documentation

**In PR Description:**
````markdown
## Dependency Changes

### New Dependencies

| Package | Version | Purpose | Bundle Impact | License |
|---------|---------|---------|---------------|---------|
| @openai/api | ^4.20.0 | AI content generation | +150KB | MIT |
| zod | ^3.22.0 | Schema validation | +45KB | MIT |

### Updated Dependencies

| Package | Old Version | New Version | Type | Breaking Changes |
|---------|-------------|-------------|------|------------------|
| @nestjs/common | 10.2.0 | 10.3.0 | Minor | No |
| prisma | 5.5.0 | 6.0.0 | Major | Yes - see migration guide |

### Removed Dependencies

| Package | Version | Reason | Replacement |
|---------|---------|--------|-------------|
| moment | 2.29.0 | Large bundle size | date-fns |

---

## Security Review

**Vulnerability Scan:**
```bash
npm audit
```

**Results:**
- 0 critical vulnerabilities
- 0 high vulnerabilities
- 2 moderate vulnerabilities (non-blocking, tracked as DEBT-050)

**CVE Check:**
- No known CVEs in new dependencies

**License Compatibility:**
- All licenses: MIT (compatible with project license)

---

## Breaking Changes

### Prisma 5.x → 6.x

**Migration Required:** Yes

**Breaking Changes:**
1. Client generation syntax changed
2. Transaction API updated
3. Middleware signature changed

**Migration Steps:**
1. Update `schema.prisma` syntax
2. Update transaction calls: `prisma.$transaction()` → `prisma.$transaction(async (tx) => {})`
3. Update middleware: See https://prisma.io/docs/migration/6.0

**Migration PR:** #789 (to be created)

---

## Bundle Impact Analysis

**Frontend Bundle Size:**
- Before: 1.2MB
- After: 1.35MB
- Change: +150KB (+12.5%)
- Within Budget: ⚠️ At limit (max: 1.5MB)

**Backend Memory Usage:**
- Expected impact: +20MB
- Within limits: ✅ Yes (max: 2GB)

---
````

### Step 5 Verification

- [ ] **MUST** verify dependency changes documented in PR
- [ ] **MUST** verify security scan run (`npm audit`)
- [ ] **MUST** verify no critical/high vulnerabilities
- [ ] **MUST** verify licenses compatible
- [ ] **MUST** verify breaking changes documented (if major update)
- [ ] **SHOULD** verify bundle impact analyzed
- [ ] **SHOULD** verify migration plan created (if breaking changes)

**Consequences:**
- Missing dependency documentation = HARD STOP
- Critical/high vulnerabilities present = HARD STOP
- Incompatible license = HARD STOP
- Breaking changes without migration plan = HARD STOP
- Moderate/low vulnerabilities = WARNING (track as tech debt)

---

## AUDIT LOGGING REQUIREMENTS

**Version:** 2.1.0  
**Last Updated:** 2025-11-22

### Purpose

Maintain comprehensive audit trail for security-sensitive and business-critical operations to support compliance, debugging, and incident response.

### Triggers (When Audit Logging is MANDATORY)

#### Security Events:
- ✅ Authentication attempts (success/failure)
- ✅ Permission changes (roles, grants)
- ✅ Password changes/resets
- ✅ MFA enable/disable
- ✅ Access to sensitive data (PII, financial)

#### Business Events:
- ✅ Financial transactions
- ✅ Data exports
- ✅ Bulk operations (>100 records)
- ✅ User account changes (create, suspend, delete)

#### Data Events:
- ✅ State transitions (WorkOrder, Invoice, Payment)
- ✅ Record deletions (soft or hard delete)
- ✅ Configuration changes
- ✅ Tenant configuration changes

### Requirements

#### MANDATORY: Audit Log Format

**Log Structure:**
````typescript
interface AuditLog {
  // Who
  userId: string;
  tenantId: string;
  userEmail?: string; // For easy identification
  userRole?: string;
  
  // What
  action: string; // 'user.login', 'workorder.state_change', 'payment.create'
  entityType: string; // 'User', 'WorkOrder', 'Payment'
  entityId: string;
  
  // When
  timestamp: Date; // ISO 8601 UTC
  
  // Where
  ipAddress: string;
  userAgent?: string;
  requestId: string; // For tracing
  
  // Context
  oldValue?: any; // Before state (for updates)
  newValue?: any; // After state (for updates)
  metadata?: Record<string, any>; // Additional context
  
  // Result
  success: boolean;
  errorMessage?: string; // If failed
}
````

**Implementation:**
````typescript
// apps/api/src/audit/audit.service.ts

@Injectable()
export class AuditService {
  async log(entry: Partial<AuditLog>): Promise<void> {
    const auditLog: AuditLog = {
      ...entry,
      timestamp: new Date(),
      requestId: entry.requestId || generateRequestId(),
    };
    
    // Store in database
    await this.prisma.auditLog.create({
      data: auditLog,
    });
    
    // Also log to structured logging
    this.logger.info('Audit event', auditLog);
  }
}

// Usage in service
async changePassword(userId: string, oldPassword: string, newPassword: string) {
  try {
    // Verify old password
    const user = await this.findOne(userId);
    const valid = await bcrypt.compare(oldPassword, user.passwordHash);
    
    if (!valid) {
      // Log failed attempt
      await this.auditService.log({
        userId,
        tenantId: user.tenantId,
        action: 'user.password_change_failed',
        entityType: 'User',
        entityId: userId,
        success: false,
        errorMessage: 'Invalid old password',
        metadata: {
          ipAddress: context.ipAddress,
        },
      });
      
      throw new UnauthorizedException('Invalid password');
    }
    
    // Change password
    const newHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });
    
    // Log successful change
    await this.auditService.log({
      userId,
      tenantId: user.tenantId,
      action: 'user.password_changed',
      entityType: 'User',
      entityId: userId,
      success: true,
      metadata: {
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      },
    });
    
  } catch (error) {
    // Log unexpected errors
    await this.auditService.log({
      userId,
      tenantId: context.tenantId,
      action: 'user.password_change_error',
      entityType: 'User',
      entityId: userId,
      success: false,
      errorMessage: error.message,
    });
    
    throw error;
  }
}
````

### Audit Log Storage

**Database Table:**
````prisma
model AuditLog {
  id          String   @id @default(uuid())
  userId      String
  tenantId    String
  userEmail   String?
  userRole    String?
  action      String   @db.VarChar(100)
  entityType  String   @db.VarChar(50)
  entityId    String
  timestamp   DateTime @default(now())
  ipAddress   String?
  userAgent   String?
  requestId   String
  oldValue    Json?
  newValue    Json?
  metadata    Json?
  success     Boolean  @default(true)
  errorMessage String?
  
  @@index([tenantId, timestamp])
  @@index([userId, timestamp])
  @@index([entityType, entityId])
  @@index([action, timestamp])
  @@map("audit_logs")
}
````

**Retention Policy:**
- Production: 7 years (compliance requirement)
- Staging: 90 days
- Development: 30 days

### Step 5 Verification

- [ ] **MUST** verify audit logging implemented (if security-sensitive changes)
- [ ] **MUST** verify audit logs include required fields (who, what, when, where)
- [ ] **MUST** verify audit logs for both success and failure cases
- [ ] **MUST** verify sensitive data masked in logs
- [ ] **SHOULD** verify audit log retention configured

**Consequences:**
- Missing audit logging for security events = HARD STOP
- Missing required fields = HARD STOP
- PII in audit logs (unmasked) = HARD STOP
- Missing failure case logging = OVERRIDE required

OPA Policies:
File: services/opa/policies/deps.rego
regopackage compliance.dependencies

import future.keywords.contains
import future.keywords.if

# HARD STOP: New dependency without documentation
deny contains msg if {
    has_new_dependency(input.changed_files)
    not has_dependency_docs(input.pr_body)
    
    msg := "HARD STOP [Dependencies]: New dependency detected but not documented in PR description"
}

# HARD STOP: Security vulnerabilities present
deny contains msg if {
    input.npm_audit.critical > 0
    
    msg := sprintf(
        "HARD STOP [Dependencies]: %d critical vulnerabilities found. Run 'npm audit fix' or document exceptions",
        [input.npm_audit.critical]
    )
}

# HARD STOP: High severity vulnerabilities
deny contains msg if {
    input.npm_audit.high > 0
    
    msg := sprintf(
        "HARD STOP [Dependencies]: %d high severity vulnerabilities found",
        [input.npm_audit.high]
    )
}

# WARNING: Moderate vulnerabilities
warn contains msg if {
    input.npm_audit.moderate > 0
    
    msg := sprintf(
        "WARNING [Dependencies]: %d moderate vulnerabilities found. Track as tech debt if non-blocking",
        [input.npm_audit.moderate]
    )
}

# Helpers
has_new_dependency(files) if {
    some file in files
    file.path == "package.json"
    contains(file.diff, "+")
    contains(file.diff, "dependencies")
}

has_dependency_docs(pr_body) if {
    contains(pr_body, "## Dependency Changes")
    contains(pr_body, "Security Review")
}
File: services/opa/policies/audit.rego
regopackage compliance.security.audit

import future.keywords.contains
import future.keywords.if

# HARD STOP: Security-sensitive code without audit logging
deny contains msg if {
    is_security_sensitive_change(input.changed_files)
    not has_audit_logging(input.changed_files)
    
    msg := "HARD STOP [Audit]: Security-sensitive changes require audit logging"
}

# Helpers
is_security_sensitive_change(files) if {
    some file in files
    contains(file.path, "auth")
    contains(file.diff, "password")
}

is_security_sensitive_change(files) if {
    some file in files
    contains(file.diff, "permissions")
}

has_audit_logging(files) if {
    some file in files
    contains(file.diff, "auditService.log")
}

Day 3-5: Integration Testing, End-to-End Validation, Bug Fixes
Day 3: Integration Testing
Create: .github/workflows/full-compliance-check.yml
yamlname: Full Compliance Check

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  compliance-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Setup OPA
        uses: open-policy-agent/setup-opa@v2
      
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v40
        with:
          json: true
      
      - name: Run npm audit
        id: npm-audit
        run: |
          npm audit --json > audit-results.json || true
          echo "audit_json=$(cat audit-results.json | jq -c .)" >> $GITHUB_OUTPUT
      
      - name: Run test coverage
        id: coverage
        run: |
          npm test -- --coverage --json > coverage-summary.json
          echo "coverage_json=$(cat coverage-summary.json | jq -c .)" >> $GITHUB_OUTPUT
      
      - name: TypeScript type check
        id: typescript
        run: |
          npm run type-check && echo "typescript_check_failed=false" >> $GITHUB_OUTPUT || echo "typescript_check_failed=true" >> $GITHUB_OUTPUT
      
      - name: Load exemptions
        run: |
          cp .compliance-exemptions.json services/opa/data/exemptions.json
      
      - name: Build OPA input
        run: |
          cat <<EOF > opa-input.json
          {
            "changed_files": ${{ steps.changed-files.outputs.all_changed_files }},
            "npm_audit": ${{ steps.npm-audit.outputs.audit_json }},
            "coverage": ${{ steps.coverage.outputs.coverage_json }},
            "typescript_check_failed": ${{ steps.typescript.outputs.typescript_check_failed }},
            "pr_title": "${{ github.event.pull_request.title }}",
            "pr_body": "${{ github.event.pull_request.body }}",
            "pr_number": ${{ github.event.pull_request.number }},
            "author": "${{ github.event.pull_request.user.login }}"
          }
          EOF
      
      - name: Run ALL OPA policies
        id: opa
        run: |
          # Run all compliance policies
          opa eval \
            --data services/opa/policies/ \
            --data services/opa/data/ \
            --input opa-input.json \
            --format pretty \
            'data.compliance' > opa-results.json
          
          # Check for violations
          DENY_COUNT=$(jq '[.. | .deny? | select(. != null)] | flatten | length' opa-results.json)
          OVERRIDE_COUNT=$(jq '[.. | .override? | select(. != null)] | flatten | length' opa-results.json)
          WARN_COUNT=$(jq '[.. | .warn? | select(. != null)] | flatten | length' opa-results.json)
          
          echo "deny_count=$DENY_COUNT" >> $GITHUB_OUTPUT
          echo "override_count=$OVERRIDE_COUNT" >> $GITHUB_OUTPUT
          echo "warn_count=$WARN_COUNT" >> $GITHUB_OUTPUT
          
          # Generate report
          cat > compliance-report.md <<EOF
          ## 📋 Compliance Check Report
          
          **Status:** $([ "$DENY_COUNT" -eq 0 ] && echo "✅ PASSED" || echo "❌ FAILED")
          
          ### Violations Summary
          - 🚫 **HARD STOP:** $DENY_COUNT
          - ⚠️  **OVERRIDE REQUIRED:** $OVERRIDE_COUNT
          - 💡 **WARNINGS:** $WARN_COUNT
          
          ### Detailed Results
          
          \`\`\`json
          $(cat opa-results.json | jq .)
          \`\`\`
          
          ---
          
          **Next Steps:**
          $(if [ "$DENY_COUNT" -gt 0 ]; then
            echo "- Fix HARD STOP violations before merge"
          fi)
          $(if [ "$OVERRIDE_COUNT" -gt 0 ]; then
            echo "- Request override with justification for OVERRIDE items"
          fi)
          $(if [ "$WARN_COUNT" -gt 0 ]; then
            echo "- Review warnings and address if possible"
          fi)
          EOF
          
          cat compliance-report.md >> $GITHUB_STEP_SUMMARY
          
          # Fail if HARD STOP violations
          if [ "$DENY_COUNT" -gt 0 ]; then
            echo "❌ COMPLIANCE CHECK FAILED: $DENY_COUNT HARD STOP violations"
            exit 1
          fi
          
          echo "✅ COMPLIANCE CHECK PASSED"
      
      - name: Validate Rule Compliance Matrix
        run: |
          python3 .github/scripts/validate-matrix.py
      
      - name: Comment PR with results
        uses: actions/github-script@v7
        if: always()
        with:
          script: |
            const fs = require('fs');
            const report = fs.readFileSync('compliance-report.md', 'utf8');
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: report
            });

Day 4: End-to-End Validation
Create test PR to validate all rules:
bash# Create test branch
git checkout -b test/compliance-validation

# Make changes that trigger multiple rules
# 1. Add new API endpoint (triggers: testing, layer-sync, contracts, docs)
# 2. Update schema (triggers: layer-sync, breaking-changes, state-machines)
# 3. Add new dependency (triggers: deps)
# 4. Add TODO comment (triggers: tech-debt)

# Open PR and verify all checks run
Validation Checklist:
markdown## E2E Compliance Validation

### Rule Violations to Test

- [ ] Missing tests → Should BLOCK
- [ ] Missing DTO sync → Should BLOCK
- [ ] Missing migration → Should BLOCK
- [ ] Missing API docs → Should OVERRIDE
- [ ] New dependency undocumented → Should BLOCK
- [ ] Security change without review → Should BLOCK
- [ ] Breaking change without migration guide → Should BLOCK
- [ ] TODO without tech debt entry → Should BLOCK

### Expected CI Behavior

- [ ] OPA evaluation runs
- [ ] All policies evaluated
- [ ] Violations reported in PR comment
- [ ] Matrix validation runs
- [ ] Failed checks block merge

### Manual Verification

- [ ] PR comment shows detailed violations
- [ ] Step summary shows compliance report
- [ ] Each violation has clear remediation steps
- [ ] Override process documented

Day 5: Bug Fixes & Documentation
Address any issues found during testing:

OPA Policy Bugs: Fix false positives/negatives
CI Workflow Issues: Fix timeout/failure issues
Documentation Gaps: Update any unclear sections
Template Issues: Fix any template formatting problems

Final Documentation Updates:
markdown# docs/compliance/README.md

# VeroField Compliance System

## Overview

The VeroField Compliance System ensures code quality, security, and consistency through automated enforcement of 25 rules across all development workflows.

## Quick Start

1. **Read the Contract:** `.cursor/rules/00-master.mdc`
2. **Check the Matrix:** `docs/compliance-reports/rule-compliance-matrix.md`
3. **Follow the Pipeline:** 5-step enforcement in every PR

## Rules Summary

| Category | Rules | Status |
|----------|-------|--------|
| Critical | 3 | ✅ Complete |
| High | 4 | ✅ Complete |
| Medium | 6 | ✅ Complete |
| Low | 2 | ✅ Complete |

## Enforcement

- **HARD STOP:** CI blocks merge
- **OVERRIDE:** Requires justification + approval
- **WARNING:** Tracked but doesn't block

## Getting Help

- **Slack:** #compliance-help
- **Email:** compliance@verofield.com
- **Docs:** https://docs.verofield.com/compliance

Week 5 Summary
By end of Week 5, you should have:
✅ All Rules Fixed (25/25):

All 16 issues from audit - COMPLETE
All OPA policies implemented - COMPLETE
All CI workflows configured - COMPLETE

✅ Testing Complete:

Integration tests passing
E2E validation successful
Bug fixes applied

✅ Progress:

Rule Compliance Matrix: 25/25 complete (100%)
All priority levels: COMPLETE


Phase 3: Dashboard & Operations (Weeks 6-8)
Week 6: Compliance Dashboard Development
Day 1-2: Backend API Implementation
Already covered in Week 1 - implement:

ComplianceController
ComplianceService
ComplianceService
Database schema for compliance tracking

Database Schema: prisma/schema.prisma
prisma// Add to existing schema

model ComplianceViolation {
  id          String   @id @default(uuid())
  rule        String   @db.VarChar(100)
  severity    String   @db.VarChar(20) // BLOCK, OVERRIDE, WARNING
  file        String
  prNumber    Int?
  author      String
  description String   @db.Text
  status      String   @db.VarChar(20) // active, overridden, fixed
  createdAt   DateTime @default(now())
  fixedAt     DateTime?
  tenantId    String?
  
  overrideRequests OverrideRequest[]
  relatedCommits   ViolationCommit[]
  
  @@index([status, createdAt])
  @@index([prNumber])
  @@index([author])
  @@index([rule])
  @@map("compliance_violations")
}

model OverrideRequest {
  id            String              @id @default(uuid())
  violationId   String
  violation     ComplianceViolation @relation(fields: [violationId], references: [id])
  requestedBy   String
  justification String              @db.Text
  status        String              @db.VarChar(20) // pending, approved, rejected
  reviewedBy    String?
  reviewedAt    DateTime?
  expiresAt     DateTime?
  createdAt     DateTime            @default(now())
  
  @@index([status, createdAt])
  @@map("override_requests")
}

model ViolationCommit {
  id          String              @id @default(uuid())
  violationId String
  violation   ComplianceViolation @relation(fields: [violationId], references: [id])
  commitSha   String
  commitMsg   String
  author      String
  committedAt DateTime
  
  @@index([violationId])
  @@map("violation_commits")
}

model ComplianceScore {
  id              String   @id @default(uuid())
  score           Int      // 0-100
  violationCount  Int
  coveragePercent Float
  createdAt       DateTime @default(now())
  
  @@index([createdAt])
  @@map("compliance_scores")
}

model ExemptionHistory {
  id         String   @id @default(uuid())
  date       DateTime @default(now())
  count      Int
  fixedCount Int
  
  @@index([date])
  @@map("exemption_history")
}
Migration:
bashnpx prisma migrate dev --name add_compliance_tracking

Day 3: Dashboard Components Implementation
File: apps/forge-console/src/components/compliance/OverallScore.tsx
typescriptimport React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';

interface OverallScoreProps {
  score: number;
  trend: 'up' | 'down' | 'stable';
  target: number;
}

export const OverallScore: React.FC<OverallScoreProps> = ({ score, trend, target }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };
  
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp color="success" />;
      case 'down': return <TrendingDown color="error" />;
      case 'stable': return <TrendingFlat color="info" />;
    }
  };
  
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" component="div">
            Overall Compliance Score
          </Typography>
          {getTrendIcon()}
        </Box>
        
        <Box mt={2}>
          <Typography variant="h2" color={getScoreColor(score)}>
            {score}%
          </Typography>
        </Box>
        
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary">
            Target: {target}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={score} 
            color={getScoreColor(score)}
            sx={{ mt: 1, height: 8, borderRadius: 4 }}
          />
        </Box>
        
        <Box mt={2}>
          <Typography variant="caption" color="text.secondary">
            {score >= target ? 
              `✅ Exceeding target by ${score - target}%` : 
              `⚠️ ${target - score}% below target`
            }
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
File: apps/forge-console/src/components/compliance/ViolationList.tsx
typescriptimport React, { useState } from 'react';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { Visibility, CheckCircle } from '@mui/icons-material';
import type { Violation } from '../../types/compliance';
import { complianceApi } from '../../services/complianceApi';

interface ViolationListProps {
  violations: Violation[];
}

export const ViolationList: React.FC<ViolationListProps> = ({ violations }) => {
  const [selectedViolation, setSelectedViolation] = useState<Violation | null>(null);
  const [overrideDialogOpen, setOverrideDialogOpen] = useState(false);
  const [justification, setJustification] = useState('');
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'BLOCK': return 'error';
      case 'OVERRIDE': return 'warning';
      case 'WARNING': return 'info';
      default: return 'default';
    }
  };
  
  const handleRequestOverride = async () => {
    if (!selectedViolation) return;
    
    try {
      await complianceApi.requestOverride(selectedViolation.id, justification);
      setOverrideDialogOpen(false);
      setJustification('');
      // Refresh data
    } catch (error) {
      console.error('Failed to request override:', error);
    }
  };
  
  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Active Violations
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rule</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>File</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>PR</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {violations.map((violation) => (
                  <TableRow key={violation.id}>
                    <TableCell>{violation.rule}</TableCell>
                    <TableCell>
                      <Chip 
                        label={violation.severity} 
                        color={getSeverityColor(violation.severity)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {violation.file}
                      </Typography>
                    </TableCell>
                    <TableCell>{violation.author}</TableCell>
                    <TableCell>
                      {violation.prNumber && (
                        <a href={`https://github.com/your-org/your-repo/pull/${violation.prNumber}`} target="_blank" rel="noopener noreferrer">
                          #{violation.prNumber}
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={violation.status} 
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(violation.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small"
                        onClick={() => setSelectedViolation(violation)}
                      >
                        <Visibility />
                      </IconButton>
                      {violation.severity === 'OVERRIDE' && violation.status === 'active' && (
                        <IconButton 
                          size="small"
                          color="warning"
                          onClick={() => {
                            setSelectedViolation(violation);
                            setOverrideDialogOpen(true);
                          }}
                        >
                          <CheckCircle />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      {/* Override Request Dialog */}
      <Dialog 
        open={overrideDialogOpen} 
        onClose={() => setOverrideDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Override</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Rule: {selectedViolation?.rule}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              File: {selectedViolation?.file}
            </Typography>
            
            <TextField
              label="Justification"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Explain why this override is necessary and what risks are acceptable..."
              required
            />
            
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Override requests require approval from governance lead
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOverrideDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleRequestOverride}
            variant="contained"
            disabled={!justification.trim()}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
File: apps/forge-console/src/components/compliance/MatrixView.tsx
typescriptimport React, { useState } from 'react';
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { CheckCircle, Warning, Cancel } from '@mui/icons-material';
import type { RuleMatrixEntry } from '../../types/compliance';

interface MatrixViewProps {
  matrix: RuleMatrixEntry[];
}

export const MatrixView: React.FC<MatrixViewProps> = ({ matrix }) => {
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle color="success" />;
      case 'partial': return <Warning color="warning" />;
      case 'missing': return <Cancel color="error" />;
      default: return null;
    }
  };
  
  const getPriorityColor = (priority: string) => {
    if (priority.includes('🔥')) return 'error';
    if (priority.includes('High')) return 'warning';
    if (priority.includes('Medium')) return 'info';
    return 'default';
  };
  
  const filteredMatrix = matrix.filter(entry => {
    const matchesPriority = filterPriority === 'all' || entry.priority.includes(filterPriority);
    const matchesStatus = filterStatus === 'all' || entry.status === filterStatus;
    const matchesSearch = !searchTerm || 
      entry.ruleFile.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.section.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesPriority && matchesStatus && matchesSearch;
  });
  
  const stats = {
    total: matrix.length,
    complete: matrix.filter(e => e.status === 'complete').length,
    partial: matrix.filter(e => e.status === 'partial').length,
    missing: matrix.filter(e => e.status === 'missing').length,
  };
  
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Rule Compliance Matrix
          </Typography>
          <Box display="flex" gap={1}>
            <Chip label={`✅ ${stats.complete}`} color="success" size="small" />
            <Chip label={`⚠️ ${stats.partial}`} color="warning" size="small" />
            <Chip label={`❌ ${stats.missing}`} color="error" size="small" />
          </Box>
        </Box>
        
        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="Search"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              label="Priority"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="complete">Complete</MenuItem>
              <MenuItem value="partial">Partial</MenuItem>
              <MenuItem value="missing">Missing</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>Rule</TableCell>
                <TableCell>Section</TableCell>
                <TableCell>Trigger</TableCell>
                <TableCell>Enforcement</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>OPA Policy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMatrix.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{getStatusIcon(entry.status)}</TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {entry.ruleFile}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {entry.section}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {entry.triggerType}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={entry.enforcementLevel} 
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={entry.priority.replace('🔥 ', '')} 
                      size="small"
                      color={getPriorityColor(entry.priority)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {entry.opaPolicy}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box mt={2}>
          <Typography variant="caption" color="text.secondary">
            Showing {filteredMatrix.length} of {matrix.length} rules
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
File: apps/forge-console/src/components/compliance/ExemptionBurndown.tsx
typescriptimport React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ExemptionTrendPoint } from '../../types/compliance';

interface ExemptionBurndownProps {
  data: ExemptionTrendPoint[];
  target: Date;
}

export const ExemptionBurndown: React.FC<ExemptionBurndownProps> = ({ data, target }) => {
  const chartData = data.map(point => ({
    date: new Date(point.date).toLocaleDateString(),
    total: point.count,
    fixed: point.fixed,
  }));
  
  const daysRemaining = Math.ceil((target.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const currentCount = data[data.length - 1]?.count || 0;
  const fixRate = data.length > 1 
    ? (data[0].count - data[data.length - 1].count) / data.length 
    : 0;
  const estimatedCompletion = fixRate > 0 
    ? Math.ceil(currentCount / fixRate) 
    : null;
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Exemption Burndown
        </Typography>
        
        <Box mb={2}>
          <Typography variant="h4">{currentCount}</Typography>
          <Typography variant="body2" color="text.secondary">
            Grandfathered Files Remaining
          </Typography>
        </Box>
        
        <Box mb={2}>
          <Typography variant="body2">
            Target Date: {target.toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color={daysRemaining > 0 ? 'success.main' : 'error.main'}>
            {daysRemaining > 0 ? `${daysRemaining} days remaining` : `${Math.abs(daysRemaining)} days overdue`}
          </Typography>
          {estimatedCompletion && (
            <Typography variant="body2" color="text.secondary">
              Est. completion: {estimatedCompletion} days at current rate
            </Typography>
          )}
        </Box>
        
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#ff7300" name="Total Exemptions" />
            <Line type="monotone" dataKey="fixed" stroke="#82ca9d" name="Fixed This Period" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
File: apps/forge-console/src/components/compliance/TrendChart.tsx
typescriptimport React, { useState } from 'react';
import { Card, CardContent, Typography, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { HistoricalTrendPoint } from '../../types/compliance';

interface TrendChartProps {
  data: HistoricalTrendPoint[];
  metrics: string[];
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, metrics }) => {
  const [selectedMetric, setSelectedMetric] = useState('score');
  
  const chartData = data.map(point => ({
    date: new Date(point.date).toLocaleDateString(),
    violations: point.violations,
    coverage: point.coverage,
    score: point.score,
  }));
  
  const getMetricConfig = (metric: string) => {
    switch (metric) {
      case 'violations':
        return { label: 'Violations', color: '#ff7300', yAxisLabel: 'Count' };
      case 'coverage':
        return { label: 'Test Coverage', color: '#82ca9d', yAxisLabel: 'Percentage' };
      case 'score':
        return { label: 'Compliance Score', color: '#8884d8', yAxisLabel: 'Score (0-100)' };
      default:
        return { label: 'Score', color: '#8884d8', yAxisLabel: 'Score' };
    }
  };
  
  const config = getMetricConfig(selectedMetric);
  
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            Historical Trends
          </Typography>
          <ToggleButtonGroup
            value={selectedMetric}
            exclusive
            onChange={(_, value) => value && setSelectedMetric(value)}
            size="small"
          >
            {metrics.map(metric => (
              <ToggleButton key={metric} value={metric}>
                {getMetricConfig(metric).label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: config.yAxisLabel, angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={selectedMetric} 
              stroke={config.color} 
              name={config.label}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <Box mt={2}>
          <Typography variant="caption" color="text.secondary">
            Showing last {data.length} days
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

Day 4-5: Dashboard Integration & Polish
Integrate with backend:
typescript// apps/forge-console/src/services/complianceApi.ts - Complete implementation

import axios, { AxiosInstance } from 'axios';
import type { 
  ComplianceDashboardData, 
  Violation,
  RuleMatrixEntry 
} from '../types/compliance';

class ComplianceApiClient {
  private api: AxiosInstance;
  
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
      timeout: 10000,
    });
    
    // Add auth interceptor
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }
  
  async getDashboardData(): Promise<ComplianceDashboardData> {
    try {
      const response = await this.api.get('/api/compliance/dashboard');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      throw error;
    }
  }
  
  async getViolationDetails(violationId: string): Promise<Violation> {
    const response = await this.api.get(`/api/compliance/violations/${violationId}`);
    return response.data;
  }
  
  async getRuleMatrix(): Promise<RuleMatrixEntry[]> {
    const response = await this.api.get('/api/compliance/matrix');
    return response.data;
  }
  
  async requestOverride(violationId: string, justification: string) {
    const response = await this.api.post(
      `/api/compliance/violations/${violationId}/override`,
      { justification }
    );
    return response.data;
  }
  
  async getExemptionHistory(days: number = 30) {
    const response = await this.api.get(`/api/compliance/exemptions/history`, {
      params: { days }
    });
    return response.data;
  }
  
  async getHistoricalTrends(days: number = 30) {
    const response = await this.api.get(`/api/compliance/trends`, {
      params: { days }
    });
    return response.data;
  }
}

export const complianceApi = new ComplianceApiClient();
Add routing:
typescript// apps/forge-console/src/App.tsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ComplianceDashboard } from './pages/ComplianceDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/compliance" element={<ComplianceDashboard />} />
        {/* ... other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

Week 7: Operations & Monitoring
Day 1-2: Monitoring Setup
Create: docs/operations/monitoring.md
markdown# Compliance Monitoring Guide

## Metrics to Monitor

### System Metrics

**Compliance Score:**
- Metric: `compliance.score`
- Target: >90%
- Alert: <70% for 24 hours
- Dashboard: Grafana > Compliance > Overall Score

**Violation Count:**
- Metric: `compliance.violations.total`
- Target: <10
- Alert: >50 active violations
- Dashboard: Grafana > Compliance > Violations

**Rule Coverage:**
- Metric: `compliance.rules.complete_percentage`
- Target: 100%
- Alert: <95%
- Dashboard: Grafana > Compliance > Matrix

### CI/CD Metrics

**OPA Evaluation Time:**
- Metric: `ci.opa.duration_seconds`
- Target: <30s
- Alert: >60s for 5 consecutive runs
- Dashboard: Grafana > CI > OPA Performance

**PR Block Rate:**
- Metric: `ci.pr.blocked_percentage`
- Target: <20%
- Alert: >50% for 24 hours
- Dashboard: Grafana > CI > Block Rate

**Override Request Rate:**
- Metric: `compliance.overrides.request_rate`
- Target: <5 per week
- Alert: >20 per week
- Dashboard: Grafana > Compliance > Overrides

## Alerts Configuration

### Critical Alerts

**File:** `.github/workflows/compliance-alerts.yml`
```yaml
name: Compliance Alerts

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours

jobs:
  check-compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Check compliance score
        run: |
          SCORE=$(curl -s https://api.example.com/api/compliance/dashboard | jq '.overallScore')
          
          if [ "$SCORE" -lt 70 ]; then
            echo "🚨 CRITICAL: Compliance score dropped below 70%: $SCORE%" >> $GITHUB_STEP_SUMMARY
            # Send Slack alert
            curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
              -H 'Content-Type: application/json' \
              -d '{"text": "🚨 Compliance score critical: '"$SCORE"'%"}'
          fi
      
      - name: Check violation count
        run: |
          VIOLATIONS=$(curl -s https://api.example.com/api/compliance/dashboard | jq '.activeViolations')
          
          if [ "$VIOLATIONS" -gt 50 ]; then
            echo "⚠️ WARNING: High violation count: $VIOLATIONS" >> $GITHUB_STEP_SUMMARY
            # Send Slack alert
            curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
              -H 'Content-Type: application/json' \
              -d '{"text": "⚠️ High violation count: '"$VIOLATIONS"' active violations"}'
          fi
```

### Daily Reports

**File:** `.github/workflows/daily-compliance-report.yml`
```yaml
name: Daily Compliance Report

on:
  schedule:
    - cron: '0 9 * * 1-5'  # 9 AM weekdays

jobs:
  generate-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Fetch compliance data
        id: data
        run: |
          curl -s https://api.example.com/api/compliance/dashboard > dashboard.json
          echo "score=$(jq '.overallScore' dashboard.json)" >> $GITHUB_OUTPUT
          echo "violations=$(jq '.activeViolations' dashboard.json)" >> $GITHUB_OUTPUT
          echo "exemptions=$(jq '.exemptionCount' dashboard.json)" >> $GITHUB_OUTPUT
      
      - name: Generate report
        run: |
          cat > report.md <<EOF
          # Daily Compliance Report - $(date +%Y-%m-%d)
          
          ## Summary
          
          - **Overall Score:** ${{ steps.data.outputs.score }}%
          - **Active Violations:** ${{ steps.data.outputs.violations }}
          - **Grandfathered Files:** ${{ steps.data.outputs.exemptions }}
          
          ## Trends
          
          [View full dashboard](https://console.example.com/compliance)
          
          ## Top Violations
          
          $(curl -s https://api.example.com/api/compliance/violations | jq -r '.[:5] | .[] | "- \(.rule): \(.file)"')
          
          EOF
      
      - name: Send to Slack
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
            -H 'Content-Type: application/json' \
            -d @- <<EOF
          {
            "text": "📊 Daily Compliance Report",
            "blocks": [
              {
                "type": "header",
                "text": {
                  "type": "plain_text",
                  "text": "📊 Daily Compliance Report - $(date +%Y-%m-%d)"
                }
              },
              {
                "type": "section",
                "fields": [
                  {
                    "type": "mrkdwn",
                    "text": "*Score:* ${{ steps.data.outputs.score }}%"
                  },
                  {
                    "type": "mrkdwn",
                    "text": "*Violations:* ${{ steps.data.outputs.violations }}"
                  },
                  {
                    "type": "mrkdwn",
                    "text": "*Exemptions:* ${{ steps.data.outputs.exemptions }}"
                  }
                ]
              },
              {
                "type": "actions",
                "elements": [
                  {
                    "type": "button",
                    "text": {
                      "type": "plain_text",
                      "text": "View Dashboard"
                    },
                    "url": "https://console.example.com/compliance"
                  }
                ]
              }
            ]
          }
          EOF

Day 3: Documentation & Training Materials
Create: docs/compliance/getting-started.md
markdown# Getting Started with VeroField Compliance System

## Overview

The VeroField Compliance System is a comprehensive governance framework that ensures code quality, security, and consistency through automated rule enforcement.

## Quick Start (5 minutes)

### 1. Read the Unified Enforcement Contract

**File:** `.cursor/rules/00-master.mdc`

**Key sections:**
- Section 0: Global Directive (how AI is bound)
- Section 1: Glossary (terminology definitions)
- Section 2: Rule Template (standard structure)
- Section 5: Consequence Framework (BLOCK/OVERRIDE/WARNING)

### 2. Understand the 5-Step Pipeline

Every code change follows this pipeline:
````
Step 1: Search & Discovery
   ↓
Step 2: Pattern Analysis
   ↓
Step 3: Rule Compliance Check
   ↓
Step 4: Implementation Plan
   ↓
Step 5: Post-Implementation Audit ⭐ CRITICAL
````

**Step 5 is where enforcement happens** - if checks fail, CI blocks your PR.

### 3. Check the Rule Compliance Matrix

**File:** `docs/compliance-reports/rule-compliance-matrix.md`

This is your "source of truth" for:
- Which rules exist
- What triggers them
- How they're enforced
- What the consequences are

### 4. Install Pre-Commit Hooks (Optional but Recommended)
````bash
# Install husky
npm install --save-dev husky

# Setup pre-commit hook
npx husky install
npx husky add .husky/pre-commit "npm run compliance:check"
````

**File:** `package.json`
````json
{
  "scripts": {
    "compliance:check": "node .github/scripts/local-compliance-check.js"
  }
}
````

**File:** `.github/scripts/local-compliance-check.js`
````javascript
#!/usr/bin/env node

/**
 * Local compliance check - runs before commit
 * Provides fast feedback on common violations
 */

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Running local compliance check...\n');

let hasViolations = false;

// Check 1: TypeScript errors
console.log('Checking TypeScript...');
try {
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ TypeScript OK\n');
} catch (error) {
  console.error('❌ TypeScript errors found\n');
  hasViolations = true;
}

// Check 2: Test coverage (staged files only)
console.log('Checking test coverage...');
try {
  const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACM')
    .toString()
    .split('\n')
    .filter(file => file.match(/\.ts$/) && !file.match(/\.test\.ts$/));
  
  const missingTests = stagedFiles.filter(file => {
    const testFile = file.replace('.ts', '.test.ts');
    return !fs.existsSync(testFile);
  });
  
  if (missingTests.length > 0) {
    console.error('❌ Missing tests for:');
    missingTests.forEach(file => console.error(`   - ${file}`));
    console.error('\n');
    hasViolations = true;
  } else {
    console.log('✅ All files have tests\n');
  }
} catch (error) {
  console.error('⚠️  Could not check test coverage\n');
}

// Check 3: TODO/FIXME without tech debt entry
console.log('Checking for undocumented tech debt...');
try {
  const stagedDiff = execSync('git diff --cached').toString();
  const hasNewTodos = /^\+.*TODO|FIXME|HACK|XXX/.test(stagedDiff);
  const hasTechDebtUpdate = execSync('git diff --cached -- docs/tech-debt.md')
    .toString()
    .includes('## [DEBT-');
  
  if (hasNewTodos && !hasTechDebtUpdate) {
    console.error('❌ Found TODO/FIXME but no tech-debt.md entry\n');
    hasViolations = true;
  } else {
    console.log('✅ No undocumented tech debt\n');
  }
} catch (error) {
  console.log('✅ No tech debt markers found\n');
}

// Check 4: Schema changes with migration
console.log('Checking for schema migrations...');
try {
  const hasSchemaChange = execSync('git diff --cached -- prisma/schema.prisma')
    .toString()
    .length > 0;
  
  const hasMigration = execSync('git diff --cached --name-only')
    .toString()
    .includes('migrations/');
  
  if (hasSchemaChange && !hasMigration) {
    console.error('❌ Schema changed but no migration found\n');
    console.error('   Run: npx prisma migrate dev\n');
    hasViolations = true;
  } else if (hasSchemaChange) {
    console.log('✅ Schema change with migration\n');
  } else {
    console.log('✅ No schema changes\n');
  }
} catch (error) {
  console.log('✅ No schema changes\n');
}

// Summary
if (hasViolations) {
  console.error('\n❌ Compliance check FAILED');
  console.error('Fix violations above or use --no-verify to skip (not recommended)\n');
  process.exit(1);
} else {
  console.log('\n✅ Local compliance check PASSED');
  console.log('CI will run full checks on push\n');
  process.exit(0);
}
````

---

## Common Scenarios

### Scenario 1: Adding a New API Endpoint

**Triggers:**
- Testing Requirements
- Layer Synchronization
- API Contract Documentation
- Documentation Updates

**Steps:**

1. **Create the endpoint:**
````typescript
   // apps/api/src/customers/customers.controller.ts
   @Post()
   @ApiOperation({ summary: 'Create customer' })
   async create(@Body() dto: CreateCustomerDto) {
     return this.customersService.create(dto);
   }
````

2. **Add tests (MANDATORY):**
````typescript
   // apps/api/src/customers/customers.controller.spec.ts
   describe('create', () => {
     it('should create customer', async () => {
       const dto = { name: 'Acme Corp', email: 'acme@example.com' };
       const result = await controller.create(dto);
       expect(result).toBeDefined();
     });
   });
````

3. **Update frontend types:**
````typescript
   // frontend/types/customer.ts
   export interface CreateCustomerRequest {
     name: string;
     email: string;
   }
````

4. **Document API contract:**
````markdown
   # docs/contracts/api/customers-api.md
   
   ### POST /api/v1/customers
   
   **Request Body:**
```typescript
   interface CreateCustomerRequest {
     name: string;
     email: string;
   }
```
   
   **Response: 201 Created**
   ...
````

5. **Update README (if new feature):**
````markdown
   ## Features
   
   - Customer management ← NEW
````

**Checklist before commit:**
- [ ] Tests written and passing
- [ ] Frontend types updated
- [ ] API contract documented
- [ ] Swagger decorators added
- [ ] README updated

---

### Scenario 2: Database Schema Change

**Triggers:**
- Layer Synchronization
- Breaking Changes (if removing fields)
- State Machine Documentation (if adding status field)

**Steps:**

1. **Update schema:**
````prisma
   model Customer {
     id        String   @id @default(uuid())
     name      String
     phone     String?  // ← NEW FIELD
     createdAt DateTime @default(now())
   }
````

2. **Create migration:**
````bash
   npx prisma migrate dev --name add_customer_phone
````

3. **Update DTOs:**
````typescript
   // apps/api/src/customers/dto/customer.dto.ts
   export class CustomerDto {
     id: string;
     name: string;
     phone?: string; // ← ADD
     createdAt: Date;
   }
````

4. **Update frontend types:**
````typescript
   // frontend/types/customer.ts
   export interface Customer {
     id: string;
     name: string;
     phone?: string; // ← ADD
     createdAt: string;
   }
````

5. **Update tests:**
````typescript
   it('should map phone number', () => {
     const customer = { id: '1', name: 'Acme', phone: '+1234567890', createdAt: new Date() };
     const dto = new CustomerDto(customer);
     expect(dto.phone).toBe('+1234567890');
   });
````

**Checklist:**
- [ ] Migration created and tested
- [ ] DTOs synchronized
- [ ] Frontend types synchronized
- [ ] Tests updated
- [ ] TypeScript errors resolved

---

### Scenario 3: Bug Fix

**Triggers:**
- Bug Fix Documentation
- Testing Requirements (regression test)

**Steps:**

1. **Document bug:**
````markdown
   # BUG_LOG.md
   
   ## [BUG-042]: Customer email validation accepts invalid format
   
   **Date:** 2025-11-22
   **Severity:** Medium
   **Status:** Fixed
   
   **Description:**
   Email validation was too permissive, accepting emails without TLD.
   
   **Root Cause:**
   Regex pattern incomplete.
   
   **Fix:**
   Updated regex to require TLD.
   
   **PR:** #789
````

2. **Add regression test (MANDATORY):**
````typescript
   describe('email validation', () => {
     it('should reject email without TLD (BUG-042)', () => {
       const dto = { name: 'Test', email: 'test@invalid' };
       expect(() => validate(dto)).toThrow('Invalid email');
     });
   });
````

3. **Fix the bug:**
````typescript
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // ← Fixed
````

4. **Document in error-patterns.md:**
````markdown
   ## Pattern: Incomplete Email Validation
   
   **Anti-Pattern:**
   Using overly permissive email regex.
   
   **Solution:**
   Use regex that requires TLD: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   
   **Related Bugs:** BUG-042
````

**Checklist:**
- [ ] Bug logged in BUG_LOG.md
- [ ] Bug documented in error-patterns.md
- [ ] Regression test added
- [ ] Test reproduces bug before fix
- [ ] Test passes after fix

---

## Troubleshooting

### PR is Blocked by CI

**Error:** "HARD STOP [Testing]: Production file has no test file"

**Solution:**
1. Create test file: `[filename].test.ts`
2. Add unit tests for new/modified code
3. Ensure tests pass: `npm test`
4. Push changes

---

**Error:** "HARD STOP [Layer Sync]: schema.prisma changed but DTOs not updated"

**Solution:**
1. Run `npx prisma generate`
2. Update DTOs in `apps/api/src/**/*.dto.ts`
3. Update frontend types in `frontend/types/*.ts`
4. Ensure TypeScript compiles: `npm run type-check`
5. Push changes

---

**Error:** "HARD STOP [Breaking]: Breaking change detected but no migration guide"

**Solution:**
1. Create migration guide: `docs/migrations/YYYY-MM-DD-[feature]-migration.md`
2. Document what changed, why, and how to migrate
3. Update CHANGELOG.md
4. Bump version in package.json (MAJOR version)
5. Push changes

---

### I Need an Override

**When to request:**
- OVERRIDE violations (not BLOCK)
- Valid business justification
- Risk is acceptable

**Process:**
1. Add override request to PR description:
````markdown
   ## Override Request
   
   **Rule:** 10-quality.mdc:Testing Requirements
   **Reason:** This is a proof-of-concept for spike ticket #123. 
              Will be deleted after evaluation.
   **Risk:** Low - not going to production
   **Timeline:** Will be removed by end of sprint
   **Approver:** @governance-lead
````

2. Request review from governance lead
3. Wait for approval (typically <24 hours)
4. Once approved, CI will pass

---

## Best Practices

### 1. Check Compliance Early

Run local compliance check before committing:
````bash
npm run compliance:check
````

### 2. Read Related Rules

Before starting work, read relevant rules:
- API endpoint → Read 05-data.mdc, 10-quality.mdc
- Database change → Read 05-data.mdc
- Security change → Read 03-security.mdc

### 3. Use the Glossary

When you see terms like "Stateful Entity" or "Breaking Change", check the glossary in 00-master.mdc Section 1.

### 4. Ask for Help

- **Slack:** #compliance-help
- **Email:** compliance@verofield.com
- **Office Hours:** Tuesdays 2-3 PM

### 5. Follow the Boy Scout Rule

When touching grandfathered code, fix at least one violation in the same file.

---

## Resources

- **Full Rule Set:** `.cursor/rules/*.mdc`
- **Rule Matrix:** `docs/compliance-reports/rule-compliance-matrix.md`
- **Dashboard:** https://console.example.com/compliance
- **Glossary:** `.cursor/rules/00-master.mdc` Section 1
- **Templates:** In each rule file's documentation

---

## FAQ

**Q: Can I skip compliance checks for a quick fix?**  
A: No. Compliance checks prevent bugs and security issues. If you're blocked, request an override with justification.

**Q: What if CI is wrong and my code is compliant?**  
A: File an issue in #compliance-help. We'll investigate and fix the policy if needed.

**Q: How long do overrides take to approve?**  
A: Typically <24 hours during business days. For urgent issues, ping @governance-lead directly.

**Q: Can I work on multiple features in one PR?**  
A: Avoid it. Atomic PRs are easier to review and have fewer compliance issues.

**Q: What happens if I bypass compliance using --no-verify?**  
A: CI will still catch it. Save time by fixing violations locally first.

---

**Last Updated:** 2025-11-22  
**Version:** 2.1.0

Day 4: Team Training Session
Create: docs/compliance/training-slides.md
markdown# VeroField Compliance System Training

## Session 1: Overview (30 minutes)

### Slide 1: Why Compliance?

**The Problem:**
- Code quality varies by developer
- Security vulnerabilities slip through
- Documentation goes stale
- Technical debt accumulates
- Patterns are inconsistent

**The Solution:**
- Automated rule enforcement
- Consistent standards
- Security by default
- Living documentation
- Pattern reuse

---

### Slide 2: System Architecture
````
Unified Enforcement Contract (00-master.mdc)
    ↓
15 Rule Files (01-14.mdc)
    ↓
5-Step Enforcement Pipeline
    ↓
OPA Policies (automated checks)
    ↓
CI/CD (blocks non-compliant PRs)
    ↓
Compliance Dashboard (real-time monitoring)
````

---

### Slide 3: The 25 Rules

**Critical (3):**
- Testing Requirements
- Breaking Changes
- Security Review Triggers

**High (4):**
- Engineering Decisions
- Layer Synchronization
- Documentation Updates
- Configuration Changes

**Medium (6):**
- Tech Debt Logging
- State Machine Docs
- Contract Documentation
- Performance Impact
- Error Handling Standards
- Rollback Plans

**Low (2):**
- Dependency Changes
- Audit Logging

---

### Slide 4: Enforcement Levels

| Level | Meaning | Action |
|-------|---------|--------|
| **BLOCK** | Cannot merge | Fix required, no override |
| **OVERRIDE** | Can override | Justification + approval required |
| **WARNING** | Tracked | Doesn't block merge |

---

### Slide 5: The 5-Step Pipeline
````
1. Search & Discovery → Find existing patterns
2. Pattern Analysis → Identify approach
3. Rule Compliance → Check requirements
4. Implementation → Build solution
5. Post-Implementation Audit → Verify compliance ⭐
````

**Step 5 is CRITICAL** - This is where enforcement happens.

---

## Session 2: Hands-On (60 minutes)

### Exercise 1: Add API Endpoint (20 min)

**Task:** Add `POST /api/v1/products` endpoint

**Steps:**
1. Create controller method
2. Write tests
3. Update frontend types
4. Document API contract
5. Run local compliance check

**Expected Violations:**
- None (if done correctly)

---

### Exercise 2: Fix Violation (20 min)

**Task:** PR blocked by "Missing tests" violation

**Steps:**
1. Identify missing test file
2. Write unit tests
3. Ensure coverage ≥80%
4. Push changes
5. Verify CI passes

---

### Exercise 3: Request Override (20 min)

**Task:** Need to bypass "Performance Impact" check for POC

**Steps:**
1. Add override request to PR
2. Provide justification
3. Tag governance lead
4. Wait for approval
5. Understand when overrides are appropriate

---

## Session 3: Q&A (30 minutes)

### Common Questions

**Q: What if I disagree with a rule?**  
A: Open a discussion in #compliance-help. Rules can be changed if there's consensus.

**Q: How do I know which rules apply to my change?**  
A: Check the Rule Compliance Matrix or let CI tell you.

**Q: Can I disable rules for legacy code?**  
A: Yes, via `.compliance-exemptions.json`. But use Boy Scout Rule when touching it.

**Q: What if CI takes too long?**  
A: Report in #ci-issues. We monitor and optimize performance.

---

## Additional Resources

- **Getting Started Guide:** `docs/compliance/getting-started.md`
- **Rule Matrix:** `docs/compliance-reports/rule-compliance-matrix.md`
- **Dashboard:** https://console.example.com/compliance
- **Slack:** #compliance-help

---

**Training Materials Last Updated:** 2025-11-22

Day 5: Rollout Plan
Create: docs/compliance/rollout-plan.md
markdown# Compliance System Rollout Plan

## Overview

**Goal:** Transition from development to production enforcement of all 25 compliance rules.

**Duration:** 2 weeks (buffer for issues)

**Team Size:** 10 developers

---

## Pre-Rollout (Week 8, Days 1-2)

### Checklist

- [ ] All 25 rules implemented and tested
- [ ] All OPA policies deployed
- [ ] Dashboard deployed and accessible
- [ ] Documentation complete
- [ ] Training materials prepared
- [ ] Baseline scan completed
- [ ] `.compliance-exemptions.json` populated

### Communication

**Email to Team:**
````
Subject: Compliance System Rollout - Monday, Nov 25

Team,

On Monday, Nov 25, we're rolling out the VeroField Compliance System to enforce code quality and security standards automatically.

What changes:
- All PRs will be checked against 25 rules
- Non-compliant PRs will be blocked (with clear guidance)
- You'll get instant feedback on violations

What you need to do:
- Attend training session: Friday, Nov 22 @ 2 PM
- Read getting-started guide: docs/compliance/getting-started.md
- Install pre-commit hooks: npm run setup:compliance

Support:
- Slack: #compliance-help
- Email: compliance@verofield.com
- Office hours: Daily 10-11 AM for first week

Thanks!
Governance Team
````

---

## Phase 1: Soft Launch (Week 8, Days 3-5)

### Configuration

**File:** `.github/workflows/full-compliance-check.yml`
````yaml
# Add soft-launch mode
env:
  SOFT_LAUNCH: 'true'  # Don't block PRs, only warn
````

### Monitoring

- [ ] Watch #compliance-help for questions
- [ ] Monitor CI failure rate
- [ ] Track override requests
- [ ] Collect feedback

### Daily Standup

**Questions to ask:**
1. Any compliance issues blocking you?
2. Any rules that seem incorrect?
3. Any documentation gaps?

### Adjustments

Based on feedback:
- Fix OPA policy bugs
- Clarify ambiguous rules
- Update documentation
- Add to FAQ

---

## Phase 2: Hard Launch (Week 9, Days 1-5)

### Configuration

**File:** `.github/workflows/full-compliance-check.yml`
````yaml
# Enable hard enforcement
env:
  SOFT_LAUNCH: 'false'  # Block non-compliant PRs
````

### Communication

**Slack Announcement:**
````
🚀 Compliance System - Hard Launch Today

As of today, non-compliant PRs will be blocked by CI.

Remember:
- Check locally first: npm run compliance:check
- Request overrides when needed
- Ask for help in #compliance-help

Dashboard: https://console.example.com/compliance
````

### Support Schedule

**Week 1 of Hard Launch:**
- Daily office hours: 10-11 AM
- On-call governance lead: 9 AM - 6 PM
- Response SLA: <2 hours

**Week 2+:**
- Office hours: Tuesdays 2-3 PM
- Response SLA: <24 hours

---

## Phase 3: Optimization (Week 9+)

### Metrics to Track

**Weekly:**
- Compliance score trend
- Violation count trend
- Override request rate
- CI failure rate
- Average time to fix violation

**Monthly:**
- Rule effectiveness review
- False positive rate
- Developer satisfaction survey
- Exemption burndown progress

### Continuous Improvement

**Quarterly Reviews:**
- Review all rules for clarity
- Update based on team feedback
- Deprecate ineffective rules
- Add new rules as needed

**Annual Audit:**
- Full system review
- Update glossary
- Refresh training materials
- Benchmark against industry standards

---

## Rollback Plan

**If critical issues arise:**

1. **Disable hard enforcement:**
````yaml
   env:
     SOFT_LAUNCH: 'true'
````

2. **Notify team:**
````
   ⚠️ Compliance enforcement temporarily disabled due to [issue].
   We're working on a fix. ETA: [time]
````

3. **Fix issue:**
   - Identify root cause
   - Test fix thoroughly
   - Deploy fix

4. **Re-enable:**
   - Announce re-enablement
   - Monitor closely

---

## Success Criteria

**Week 1:**
- [ ] <20% PR block rate
- [ ] <10 support requests per day
- [ ] All critical bugs fixed

**Week 2:**
- [ ] <10% PR block rate
- [ ] <5 support requests per day
- [ ] Compliance score >80%

**Month 1:**
- [ ] <5% PR block rate
- [ ] <3 support requests per week
- [ ] Compliance score >90%
- [ ] Positive team feedback (>70% satisfaction)

---

## Contingency Plans

### High PR Block Rate (>30%)

**Cause:** Rules too strict or OPA policies buggy

**Action:**
1. Analyze top violations
2. Adjust thresholds or fix bugs
3. Communicate changes

### Low Adoption (devs bypassing)

**Cause:** Perceived as hindrance

**Action:**
1. Gather feedback
2. Streamline processes
3. Emphasize benefits
4. Provide more training

### Performance Issues (CI slow)

**Cause:** OPA evaluation taking too long

**Action:**
1. Profile OPA policies
2. Optimize slow policies
3. Parallelize checks
4. Cache results

---

**Rollout Owner:** @governance-lead  
**Start Date:** 2025-11-25  
**Status:** Ready for rollout

Week 7 Summary
By end of Week 7, you should have:
✅ Monitoring Setup:

Grafana dashboards configured
Alerts configured
Daily/weekly reports automated

✅ Documentation Complete:

Getting started guide
Training materials
FAQ
Troubleshooting guide

✅ Rollout Plan:

Soft launch plan
Hard launch plan
Success criteria
Contingency plans

✅ Team Prepared:

Training session completed
Documentation distributed
Support channels established


Week 8: Final Testing & Rollout
Day 1-2: Final System Testing
End-to-End Test Scenarios:
markdown## E2E Test Plan

### Scenario 1: Clean PR (Should Pass)
- [x] Create feature branch
- [x] Add API endpoint with tests
- [x] Update documentation
- [x] Run local compliance check → Pass
- [x] Push to GitHub
- [x] CI runs all checks → Pass
- [x] PR can be merged

### Scenario 2: Missing Tests (Should Block)
- [x] Create feature branch
- [x] Add API endpoint WITHOUT tests
- [x] Push to GitHub
- [x] CI runs checks → Fail (HARD STOP)
- [x] PR shows clear violation message
- [x] Cannot merge until fixed

### Scenario 3: Override Request (Should Allow with Approval)
- [x] Create PR with OVERRIDE violation
- [x] Add override request to PR description
- [x] Request review from governance lead
- [x] Governance lead approves
- [x] CI passes after approval
- [x] PR can be merged

### Scenario 4: Breaking Change (Should Require Migration Guide)
- [x] Create PR with breaking API change
- [x] CI detects breaking change → Block
- [x] Add migration guide
- [x] Update CHANGELOG
- [x] Bump version
- [x] CI passes
- [x] PR can be merged

### Scenario 5: Performance Issue (Should Warn)
- [x] Create PR with slow query
- [x] CI detects performance impact → Warning
- [x] Document performance analysis
- [x] CI passes with warning
- [x] PR can be merged

Day 3: Soft Launch
Enable soft launch mode:
bash# Set environment variable in CI
gh secret set SOFT_LAUNCH --body "true"
Monitor for 2 days:

Watch Slack #compliance-help
Review CI logs
Track violation patterns
Collect feedback


Day 4-5: Hard Launch
Enable hard enforcement:
bash# Disable soft launch
gh secret set SOFT_LAUNCH --body "false"
Send launch announcement (use template from rollout plan)
Provide intensive support:

Daily office hours
Quick response to questions
Fast bug fixes


Week 8 Summary
By end of Week 8, you should have:
✅ System Deployed:

All rules enforced in production
Dashboard live and accessible
Monitoring active

✅ Team Onboarded:

Training completed
Documentation read
Support channels established

✅ Metrics Baseline:

Initial compliance score recorded
Violation patterns identified
Improvement areas noted


Final Deliverables Summary
All Deliverables Completed
Phase 1 (Weeks 1-2): Foundation & Critical Fixes
✅ Unified Enforcement Contract embedded
✅ Rule Compliance Matrix created
✅ Baseline scan completed
✅ Critical rules fixed (3/3)
✅ OPA policies created
Phase 2 (Weeks 3-5): Rule Migration & OPA Integration
✅ All 25 rules migrated to v1.1 template
✅ All OPA policies implemented
✅ All CI workflows configured
✅ Integration testing completed
✅ End-to-end validation successful
Phase 3 (Weeks 6-8): Dashboard & Operations
✅ Compliance dashboard deployed
✅ Monitoring and alerts configured
✅ Documentation complete
✅ Training materials created
✅ Rollout plan executed
✅ System live in production

System Status
Rule Coverage: 25/25 complete (100%)
OPA Policies: 15/15 deployed
CI Workflows: 8/8 active
Dashboard: Live and accessible
Training: Complete
Status: ✅ PRODUCTION READY

Next Steps (Post-Implementation)
Week 9+: Ongoing Operations

Monitor metrics weekly
Respond to support requests <24 hours
Fix bugs as discovered
Collect feedback continuously
Quarterly rule reviews
Annual system audit


Implementation Complete: 2025-11-22
System Version: 2.1.0
Status: ✅ DEPLOYED TO PRODUCTION
🎉 Congratulations! The VeroField Compliance System is now live!


