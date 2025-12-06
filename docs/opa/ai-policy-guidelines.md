# AI Policy Generation Guidelines - VeroField Rules 2.1

**Created:** 2025-12-05  
**Version:** 1.0.0  
**Status:** Active  
**Purpose:** Guidelines for AI agents generating OPA policies for automated compliance enforcement

---

## Overview

This document provides clear guidelines for AI agents when generating Open Policy Agent (OPA) Rego policies. These guidelines ensure policies are maintainable, performant, and consistent with VeroField's compliance framework.

---

## Policy Complexity Limits

### File Size Limits

- **Maximum Lines:** 100 lines per policy file
- **Warning Threshold:** 80 lines (consider refactoring)
- **Error Threshold:** 100 lines (must refactor)

**Rationale:** Policies over 100 lines become difficult to maintain and test. Split into multiple focused policies instead.

### Helper Function Limits

- **Maximum Helpers:** 5 helper functions per policy file
- **Warning Threshold:** 4 helpers (consider consolidation)
- **Error Threshold:** 5 helpers (must consolidate)

**Rationale:** Too many helpers indicate the policy is doing too much. Extract shared helpers to `_shared.rego`.

### Nesting Depth Limits

- **Maximum Nesting:** 3 levels of nested conditions
- **Warning Threshold:** 2 levels (consider simplification)
- **Error Threshold:** 3 levels (must simplify)

**Rationale:** Deep nesting makes policies hard to read and debug. Use helper functions or early exits instead.

---

## Performance Budgets

### Evaluation Time Limits

- **Per-Policy Budget:** 200ms per policy evaluation
- **Warning Threshold:** 160ms (optimize)
- **Error Threshold:** 200ms (must optimize)

**Rationale:** Policies must evaluate quickly to avoid blocking CI/CD pipelines.

### Total Evaluation Time

- **Total Budget:** 2 seconds for all policies combined
- **Warning Threshold:** 1.6 seconds (optimize)
- **Error Threshold:** 2 seconds (must optimize)

**Rationale:** Complete policy evaluation should not significantly slow down PR checks.

### Timeout Limit

- **Hard Timeout:** 5 seconds maximum
- **Action:** Fail evaluation if timeout exceeded

**Rationale:** Prevents policies from hanging CI/CD pipelines indefinitely.

---

## Consolidation Rules

### When to Consolidate Policies

**Consolidate if:**
- 3+ policies have similar logic (>50% code overlap)
- Policies check the same rule from different angles
- Policies share the same enforcement tier (Tier 1/2/3)

**Example:**
```rego
# BEFORE: 3 separate policies
tenant_isolation.rego
rls_enforcement.rego
security_checks.rego

# AFTER: 1 consolidated policy
security.rego  # Contains all security-related checks
```

### When to Extract Helpers

**Extract if:**
- Same logic appears in 2+ policies (>50% shared code)
- Logic is reusable across multiple policies
- Logic is complex enough to warrant its own function

**Example:**
```rego
# BEFORE: Duplicated logic
# policy1.rego
deny[msg] {
    contains(input.file_path, "backend/")
    msg := "Use apps/api/ instead of backend/"
}

# policy2.rego
deny[msg] {
    contains(input.file_path, "backend/")
    msg := "Use apps/api/ instead of backend/"
}

# AFTER: Shared helper
# _shared.rego
is_deprecated_path(path) {
    contains(path, "backend/")
}

# policy1.rego
import data.shared
deny[msg] {
    shared.is_deprecated_path(input.file_path)
    msg := "Use apps/api/ instead of backend/"
}
```

---

## Optimization Patterns

### 1. Early Exit Pattern

**Use when:** Conditions can be checked in order of likelihood or cost.

**Example:**
```rego
# GOOD: Early exit for common case
deny[msg] {
    input.file_path == "critical_file.ts"
    not contains(input.pr_body, "@override")
    msg := "Critical file requires override"
}

# BAD: Checks all conditions even when first fails
deny[msg] {
    contains(input.pr_body, "@override") == false
    input.file_path == "critical_file.ts"
    msg := "Critical file requires override"
}
```

### 2. Lazy Evaluation Pattern

**Use when:** Expensive operations can be deferred.

**Example:**
```rego
# GOOD: Only evaluate expensive check if needed
deny[msg] {
    input.file_path == "critical_file.ts"
    expensive_check_result := expensive_operation(input)
    expensive_check_result == false
    msg := "Expensive check failed"
}

# BAD: Always evaluates expensive operation
deny[msg] {
    expensive_check_result := expensive_operation(input)  # Always runs
    input.file_path == "critical_file.ts"
    expensive_check_result == false
    msg := "Expensive check failed"
}
```

### 3. Caching Pattern

**Use when:** Same computation is needed multiple times.

**Example:**
```rego
# GOOD: Compute once, reuse
file_metadata := {
    "path": input.file_path,
    "is_critical": is_critical_file(input.file_path),
    "requires_override": requires_override(input.file_path)
}

deny[msg] {
    file_metadata.is_critical
    not file_metadata.requires_override
    msg := "Critical file requires override"
}

# BAD: Recomputes multiple times
deny[msg] {
    is_critical_file(input.file_path)
    not requires_override(input.file_path)  # Recomputes
    msg := "Critical file requires override"
}
```

### 4. Shared Helpers Pattern

**Use when:** Logic is shared across multiple policies.

**Example:**
```rego
# _shared.rego
package shared

is_deprecated_path(path) {
    contains(path, "backend/")
}

is_critical_file(path) {
    critical_files := ["critical_file.ts", "schema.prisma"]
    path in critical_files
}

# policy1.rego
import data.shared

deny[msg] {
    shared.is_deprecated_path(input.file_path)
    msg := "Use apps/api/ instead of backend/"
}

# policy2.rego
import data.shared

deny[msg] {
    shared.is_critical_file(input.file_path)
    not contains(input.pr_body, "@override")
    msg := "Critical file requires override"
}
```

---

## Policy Structure Template

### Standard Policy Structure

```rego
package compliance.<domain>

# =============================================================================
# Policy Metadata
#
# name: <Policy Name>
# description: <Brief description>
# domain: [security|architecture|data|quality|observability|operations|tech-debt|ux-consistency|core|frontend|backend|verification]
# tier: [1|2|3] (1=BLOCK, 2=OVERRIDE, 3=WARNING)
# created: YYYY-MM-DD
# version: 1.0.0
# =============================================================================

# Default deny rule (Tier 1 - BLOCK)
deny[msg] {
    # Add conditions that should result in a HARD STOP
    # Example: input.some_condition == "forbidden"
    msg := "HARD STOP [<Domain>]: <Description>"
}

# Override rule (Tier 2 - OVERRIDE)
override[msg] {
    # Add conditions that require an override
    # Example: input.pr_body.contains("@override:<rule>")
    msg := "OVERRIDE REQUIRED [<Domain>]: <Description>"
}

# Warning rule (Tier 3 - WARNING)
warn[msg] {
    # Add conditions that should result in a warning
    # Example: input.some_metric > 100
    msg := "WARNING [<Domain>]: <Description>"
}

# Helper functions (optional, max 5)
is_<condition>(input) {
    # Helper logic here
}
```

---

## Enforcement Level Mapping

### Tier 1 MAD (BLOCK) → `deny` Rule

**Use `deny` for:**
- Security violations (tenant isolation, RLS bypass)
- Architecture violations (wrong file paths, service boundaries)
- Critical data safety issues

**Example:**
```rego
deny[msg] {
    not contains(input.query, "tenant_id")
    msg := "HARD STOP [Security]: Database query missing tenant_id filter"
}
```

### Tier 2 MAD (OVERRIDE) → `override` Rule

**Use `override` for:**
- Breaking changes
- State machine transitions
- Data migrations
- Code integration to main branch

**Example:**
```rego
override[msg] {
    input.file_path == "schema.prisma"
    not contains(input.pr_body, "@override:schema-change")
    msg := "OVERRIDE REQUIRED [Data]: Schema change requires explicit override"
}
```

### Tier 3 MAD (WARNING) → `warn` Rule

**Use `warn` for:**
- Tech debt additions
- TODO/FIXME comments
- Best practice violations
- Performance issues

**Example:**
```rego
warn[msg] {
    contains(input.code, "TODO")
    not contains(input.pr_body, "@tech-debt")
    msg := "WARNING [Tech Debt]: TODO comment added without tech debt log entry"
}
```

---

## Testing Requirements

### Test Coverage

- **Minimum Coverage:** 80% of policy logic
- **Target Coverage:** 100% of policy logic
- **Critical Paths:** Must have 100% coverage

### Test File Structure

```rego
package compliance.<domain>

import data.compliance.<domain>

test_<rule_name>_passes {
    not compliance.<domain>.deny with input as {
        "file_path": "valid/path.ts",
        "pr_body": "Valid PR description"
    }
}

test_<rule_name>_fails {
    deny_msg := compliance.<domain>.deny with input as {
        "file_path": "invalid/path.ts",
        "pr_body": "Invalid PR"
    }
    contains(deny_msg, "HARD STOP")
}
```

---

## Validation Checklist

Before submitting a policy, verify:

- [ ] Policy is under 100 lines
- [ ] Policy has ≤5 helper functions
- [ ] Policy has ≤3 levels of nesting
- [ ] Policy evaluates in <200ms
- [ ] Policy follows standard structure template
- [ ] Policy has metadata block
- [ ] Policy uses correct enforcement level (deny/override/warn)
- [ ] Policy has test coverage ≥80%
- [ ] Policy follows optimization patterns
- [ ] Policy uses shared helpers when applicable

---

## Related Documentation

- **OPA Documentation:** `services/opa/README.md`
- **Quick Start:** `services/opa/QUICK_START.md`
- **Policy Template:** `services/opa/_template.rego.example`
- **Validation Script:** `.cursor/scripts/validate-opa-policy.py`
- **Optimization Script:** `.cursor/scripts/optimize-opa-policy.py`
- **MAD Decision Tree:** `docs/developer/mad-decision-tree.md`
- **Rule Compliance Matrix:** `docs/compliance-reports/rule-compliance-matrix.md`

---

**Last Updated:** 2025-12-05  
**Maintained By:** Rules Champion Team  
**Version:** 1.0.0





