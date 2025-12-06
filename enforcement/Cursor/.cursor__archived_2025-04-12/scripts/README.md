# OPA Policy Scripts Documentation

**Last Updated:** 2025-12-04  
**Version:** 1.0.0

---

## Overview

This directory contains Python scripts for validating, optimizing, and managing OPA policies as part of VeroField Rules 2.1 implementation.

**Scripts:**
1. `validate-opa-policy.py` - Validates policies against complexity and performance budgets
2. `optimize-opa-policy.py` - Suggests optimizations and consolidation opportunities
3. `validate-step5-checks.py` - Audits Step 5 verification sections in rule files

---

## Scripts

### 1. validate-opa-policy.py

**Purpose:** Validates OPA policy files against VeroField Rules 2.1 complexity and performance budgets.

**Usage:**
```bash
# Validate single file
python .cursor/scripts/validate-opa-policy.py services/opa/policies/sample.rego

# Validate all policies in directory
python .cursor/scripts/validate-opa-policy.py services/opa/policies/
```

**Features:**
- ✅ Syntax checking via OPA CLI
- ✅ Complexity analysis (lines, helpers, nesting depth)
- ✅ Performance profiling integration
- ✅ Redundancy detection
- ✅ Best practices checking
- ✅ JSON export for CI/CD integration

**Validation Rules:**
- **Max Lines:** 100 (error if exceeded, warning at 80+)
- **Max Helpers:** 5 (error if exceeded, warning at 4+)
- **Max Nesting:** 3 levels (error if exceeded, warning at 2+)
- **Max Eval Time:** 200ms per policy (error if exceeded, warning at 160ms+)

**Output:**
- Console: Human-readable validation report
- JSON: `validation-results.json` with detailed metrics

**Exit Codes:**
- `0` - All validations passed
- `1` - Validation errors found

**Example Output:**
```
✅ PASS: services/opa/policies/sample.rego

📊 METRICS:
  - lines: 41
  - helpers: 2
  - max_nesting: 1
```

---

### 2. optimize-opa-policy.py

**Purpose:** Analyzes OPA policies and suggests optimizations for performance and consolidation.

**Usage:**
```bash
# Analyze single file
python .cursor/scripts/optimize-opa-policy.py services/opa/policies/sample.rego

# Analyze all policies in directory
python .cursor/scripts/optimize-opa-policy.py services/opa/policies/
```

**Features:**
- 🔍 Performance anti-pattern detection
- 🔄 Refactoring opportunity identification
- 📦 Helper extraction suggestions
- 🔗 Cross-file consolidation analysis
- 🎯 Severity-based prioritization (high/medium/low)

**Optimization Types:**
1. **Performance** - Nested loops, expensive operations, missing early exits
2. **Refactor** - Duplicate code, long functions, complex conditionals
3. **Extraction** - Repeated patterns that could be shared helpers
4. **Consolidation** - Related policies that could be merged

**Output:**
- Console: Detailed optimization report with suggestions
- JSON: `optimization-suggestions.json` with all suggestions

**Example Output:**
```
OPTIMIZATION REPORT
============================================================

📊 Summary:
  Total suggestions: 8
  High priority: 4
  Medium priority: 0
  Low priority: 4

PERFORMANCE (7 suggestions):
🔴 [PERFORMANCE] Nested iteration detected (line 3)
   💡 Consider restructuring to avoid nested loops or use indexing
```

---

### 3. validate-step5-checks.py

**Purpose:** Audits all .mdc rule files for complete Step 5 verification sections and measures completeness.

**Usage:**
```bash
# Validate all rule files
python .cursor/scripts/validate-step5-checks.py
```

**Features:**
- 📋 Parses all .mdc files in `.cursor/rules/`
- 🔍 Extracts Step 5 verification sections
- 📊 Measures completeness score (0-100%)
- ✅ Identifies missing checks and consequences
- 📄 Generates comprehensive compliance report

**Completeness Scoring:**
- **MANDATORY checks** (40%): Must have 3+ specific checks
- **SHOULD checks** (20%): Recommended checks for best practices
- **Consequences** (40%): Must define HARD STOP and other consequences

**Output:**
- Console: Comprehensive compliance report
- JSON: `step5-validation-results.json` with detailed analysis

**Example Output:**
```
STEP 5 VERIFICATION COMPLIANCE REPORT
======================================================================

📊 OVERALL STATISTICS:
  Total rule files: 16
  Files with Step 5: 2 (12.5%)
  Complete files (≥80%): 0 (0.0%)
  Average completeness: 2.5%

**Status:** 🔴 CRITICAL
```

**Exit Codes:**
- `0` - Average completeness ≥ 60%
- `1` - Average completeness < 60% (needs improvement)

---

## Pre-commit Hooks

### Setup

**Option 1: Using pre-commit framework (Recommended)**
```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Test hooks
pre-commit run --all-files
```

**Option 2: Manual git hook (Windows)**
```powershell
# Run setup script
.\setup-pre-commit.ps1

# Or manually copy hook
Copy-Item .git/hooks/pre-commit.ps1 .git/hooks/pre-commit
```

### Configuration

Pre-commit hooks are configured in `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: local
    hooks:
      - id: validate-opa-policies
        files: '\.rego$'
      - id: validate-step5-checks
        files: '\.mdc$'
      - id: optimize-opa-policies
        files: '\.rego$'
```

### Manual Execution

**Test hooks manually:**
```bash
# Pre-commit framework
pre-commit run --all-files

# Manual git hook (Unix)
.git/hooks/pre-commit

# Manual git hook (Windows PowerShell)
.git/hooks/pre-commit.ps1
```

---

## CI/CD Integration

### GitHub Actions

All scripts can be integrated into CI/CD workflows:

```yaml
- name: Validate OPA Policies
  run: |
    python .cursor/scripts/validate-opa-policy.py services/opa/policies/
    
- name: Check Step 5 Completeness
  run: |
    python .cursor/scripts/validate-step5-checks.py
    # Exit code 1 is acceptable if completeness < 60%
    # (this is expected during Phase 0 implementation)
```

### JSON Output

All scripts export JSON results for programmatic access:

- `validation-results.json` - Policy validation results
- `optimization-suggestions.json` - Optimization suggestions
- `step5-validation-results.json` - Step 5 compliance analysis

**Example JSON structure:**
```json
{
  "file": "sample.rego",
  "passed": true,
  "errors": [],
  "warnings": [],
  "metrics": {
    "lines": 41,
    "helpers": 2,
    "max_nesting": 1
  }
}
```

---

## Troubleshooting

### OPA Binary Not Found

**Error:** `OPA binary not found`

**Solution (Recommended):**
```bash
# Use the helper script to find OPA
python .cursor/scripts/find-opa.py

# Or in Python scripts:
from .cursor.scripts.find_opa import find_opa_binary
opa_path = find_opa_binary()
```

**Alternative Solutions:**
```bash
# Set OPA_BINARY environment variable
export OPA_BINARY=./services/opa/bin/opa.exe  # Windows
export OPA_BINARY=./services/opa/bin/opa        # Linux/Mac

# Or install OPA system-wide
# See services/opa/README.md for installation instructions
```

**Quick Reference:** See `.cursor/OPA_QUICK_REFERENCE.md` for all methods to find OPA.

### Python Not Found

**Error:** `python: command not found`

**Solution:**
```bash
# Use python3 instead
python3 .cursor/scripts/validate-opa-policy.py ...

# Or install Python
# Windows: Download from python.org
# Linux: sudo apt install python3
# Mac: brew install python3
```

### Permission Denied (Git Hooks)

**Error:** `Permission denied: .git/hooks/pre-commit`

**Solution:**
```bash
# Make hook executable (Unix/Mac)
chmod +x .git/hooks/pre-commit

# Windows: Use PowerShell script instead
.git/hooks/pre-commit.ps1
```

### Import Errors

**Error:** `ModuleNotFoundError`

**Solution:**
```bash
# Scripts use only standard library
# No additional packages required
# If errors persist, check Python version (3.7+)
python --version
```

---

## Best Practices

### Running Scripts

1. **Before committing:** Run validation scripts
2. **After creating policy:** Run optimization script
3. **Before Phase 0:** Run Step 5 validation to establish baseline
4. **During development:** Use pre-commit hooks for automatic validation

### Interpreting Results

1. **Validation errors:** Must fix before committing
2. **Optimization suggestions:** Review and apply as needed
3. **Step 5 completeness:** Track progress toward 100% goal

### Performance

- Scripts are designed to run quickly (<5s for typical policy set)
- JSON export allows caching results for CI/CD
- Pre-commit hooks only run on changed files

---

## Related Documentation

- **OPA Infrastructure:** `services/opa/README.md`
- **OPA Quick Start:** `services/opa/QUICK_START.md`
- **VeroField Rules 2.1:** `docs/developer/VeroField_Rules_2.1.md`
- **Implementation Plan:** `docs/developer/# VeroField Rules 2.md`

---

## Support

For questions or issues:
1. Check this documentation
2. Review script help: `python <script> --help` (if implemented)
3. Check JSON output for detailed error information
4. Contact Rules Champion team

---

**Created:** 2025-12-04  
**Phase:** -1, Week 2 Complete ✅  
**Next:** Phase -1, Week 3 (Rule Compliance Matrix & Baseline)




