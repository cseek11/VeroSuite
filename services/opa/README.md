# OPA (Open Policy Agent) Infrastructure

**Version:** 1.10.1  
**Last Updated:** 2025-11-23  
**Status:** Operational

---

## Overview

This directory contains the Open Policy Agent (OPA) infrastructure for VeroField Rules 2.1 automated compliance enforcement.

**Purpose:** AI-managed policy enforcement for VeroField Hybrid Rule System v2.0

---

## Directory Structure

```
services/opa/
├── bin/                # OPA CLI binary
│   └── opa.exe         # OPA v1.10.1 (Windows)
├── policies/           # Policy files (.rego)
├── data/               # Policy data (exemptions, patterns)
├── tests/              # Policy tests
├── scripts/            # Evaluation scripts
└── README.md           # This file
```

---

## Installation

### Quick Find (For All Agents)

**Use the helper script to locate OPA:**
```bash
# Python (works from any directory)
python .cursor/scripts/find-opa.py

# Shell script
source .cursor/scripts/find-opa.sh
$OPA_BIN version

# PowerShell
. .cursor/scripts/find-opa.ps1
& $OPA_BIN version
```

**See:** `.cursor/OPA_QUICK_REFERENCE.md` for complete guide

---

### Windows

OPA v1.10.1 is already installed in `services/opa/bin/opa.exe`.

**Verify installation:**
```powershell
# Using helper script (recommended)
python .cursor/scripts/find-opa.py

# Or direct path
./services/opa/bin/opa.exe version
```

**Expected output:**
```
Version: 1.10.1
Build Commit: a119f30419c83050505a44ac33ba81e7279f5178
Build Timestamp: 2025-11-05T09:06:03Z
Platform: windows/amd64
Rego Version: v1
WebAssembly: available
```

### Linux/Mac

Download OPA binary:
```bash
# Linux
curl -L -o services/opa/bin/opa https://openpolicyagent.org/downloads/latest/opa_linux_amd64
chmod +x services/opa/bin/opa

# Mac
curl -L -o services/opa/bin/opa https://openpolicyagent.org/downloads/latest/opa_darwin_amd64
chmod +x services/opa/bin/opa
```

---

## Quick Start

### 1. Evaluate a Policy

```powershell
./services/opa/bin/opa.exe eval \
  --data services/opa/policies/ \
  --data services/opa/data/ \
  --input input.json \
  --format pretty \
  'data.compliance'
```

### 2. Test a Policy

```powershell
./services/opa/bin/opa.exe test services/opa/policies/ services/opa/tests/ -v
```

### 3. Run in Server Mode

```powershell
./services/opa/bin/opa.exe run --server --addr localhost:8181 services/opa/policies/
```

---

## Policy Structure

### Policy Files (`policies/*.rego`)

Each policy file follows this structure:

```rego
package compliance.[domain]

import future.keywords.contains
import future.keywords.if

# HARD STOP: [Rule violation description]
deny contains msg if {
    [condition]
    
    msg := "HARD STOP [Domain]: [Detailed message]"
}

# OVERRIDE REQUIRED: [Rule violation description]
override contains msg if {
    [condition]
    
    msg := "OVERRIDE REQUIRED [Domain]: [Detailed message]"
}

# WARNING: [Rule violation description]
warn contains msg if {
    [condition]
    
    msg := "WARNING [Domain]: [Detailed message]"
}

# Helper functions
[helper_name](args) if {
    [logic]
}
```

### Policy Data (`data/*.json`)

Exemptions, patterns, and configuration:

```json
{
  "exemptions": {
    "files": ["legacy/old-code.ts"],
    "authors": ["bot-user"]
  },
  "patterns": {
    "tenant_isolation": ["tenantId", "tenant_id"],
    "rls_keywords": ["SET LOCAL", "app.tenant_id"]
  }
}
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
- name: Run OPA Policies
  run: |
    ./services/opa/bin/opa eval \
      --data services/opa/policies/ \
      --data services/opa/data/ \
      --input opa-input.json \
      --format pretty \
      'data.compliance' > opa-results.json
    
    # Check for violations
    DENY_COUNT=$(jq '[.. | .deny? | select(. != null)] | flatten | length' opa-results.json)
    
    if [ "$DENY_COUNT" -gt 0 ]; then
      echo "❌ HARD STOP: $DENY_COUNT violations found"
      exit 1
    fi
```

---

## Performance Budgets

**Per Policy:**
- Target: <200ms
- Hard Limit: <500ms

**Total OPA Time:**
- Target: <2s
- Hard Limit: <5s

**Policy Complexity:**
- Max lines: 100
- Max helpers: 5
- Max nesting: 3 levels

---

## Policy Development Guidelines

### 1. Complexity Limits

- Keep policies under 100 lines
- Use max 5 helper functions
- Limit nesting to 3 levels
- Extract shared logic to `_shared.rego`

### 2. Performance Optimization

- Use early exit conditions
- Implement lazy evaluation
- Cache expensive operations
- Consolidate similar checks

### 3. Consolidation Rules

- 3+ similar policies → consolidate
- >50% shared logic → extract helpers
- Related domains → combine into one policy

### 4. Testing Requirements

- Unit tests for all rules
- Test happy path, edge cases, and errors
- Test performance with realistic data
- Test parallel evaluation

---

## Available Policies

*Policies will be added during Phase 1-2 implementation*

### Phase 1 (Tier 1 MAD - BLOCK)
- `security.rego` - Tenant isolation + RLS enforcement
- `architecture.rego` - Architecture boundaries

### Phase 2 (Tier 2 MAD - OVERRIDE)
- `data-integrity.rego` - Layer sync + state machines
- `observability.rego` - Logging + tracing
- `error-handling.rego` - Error resilience

### Phase 2 (Tier 3 MAD - WARNING)
- `testing.rego` - Testing requirements
- `documentation.rego` - Documentation standards
- `tech-debt.rego` - Tech debt logging
- `ux-consistency.rego` - UX consistency
- `file-organization.rego` - File organization + imports

---

## Troubleshooting

### OPA Not Found

```powershell
# Verify OPA location
Test-Path services/opa/bin/opa.exe

# Re-download if missing
Invoke-WebRequest -Uri 'https://openpolicyagent.org/downloads/latest/opa_windows_amd64.exe' -OutFile 'services/opa/bin/opa.exe'
```

### Policy Evaluation Fails

```powershell
# Check policy syntax
./services/opa/bin/opa.exe check services/opa/policies/

# Run with verbose output
./services/opa/bin/opa.exe eval --data services/opa/policies/ --input input.json --format pretty 'data.compliance' -v
```

### Performance Issues

```powershell
# Profile policy evaluation
./services/opa/bin/opa.exe eval --data services/opa/policies/ --input input.json --profile --format pretty 'data.compliance'
```

---

## Resources

- **OPA Documentation:** https://www.openpolicyagent.org/docs/latest/
- **Rego Language:** https://www.openpolicyagent.org/docs/latest/policy-language/
- **Best Practices:** https://www.openpolicyagent.org/docs/latest/policy-performance/
- **VeroField Rules 2.1:** `docs/developer/VeroField_Rules_2.1.md`
- **AI Policy Guidelines:** `docs/opa/ai-policy-guidelines.md` (to be created in Phase 0)

---

## Support

For questions or issues:
1. Check this README
2. Review OPA documentation
3. Check `docs/developer/VeroField_Rules_2.1.md`
4. Contact Rules Champion team

---

**Installation Date:** 2025-11-23  
**Installed By:** AI Agent (with human approval)  
**Phase:** -1, Week 1, Task 1-2 Complete




