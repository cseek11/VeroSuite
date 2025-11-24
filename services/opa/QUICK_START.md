# OPA Quick Start Guide

**Last Updated:** 2025-11-23

---

## 5-Minute Setup

### 1. Verify Installation

```bash
# Windows
./services/opa/bin/opa.exe version

# Linux/Mac
./services/opa/bin/opa version
```

**Expected:** Version 1.10.1 or higher

### 2. Run Sample Policy

```bash
# Windows
./services/opa/bin/opa.exe eval --data services/opa/policies/ --data services/opa/data/ --input services/opa/sample-input.json --format pretty 'data.compliance.sample'

# Linux/Mac
./services/opa/bin/opa eval --data services/opa/policies/ --data services/opa/data/ --input services/opa/sample-input.json --format pretty 'data.compliance.sample'
```

**Expected:** JSON output with `deny`, `override`, `warn` arrays

### 3. Run Tests

```bash
# Windows
./services/opa/bin/opa.exe test services/opa/policies/ services/opa/tests/ -v

# Linux/Mac
./services/opa/bin/opa test services/opa/policies/ services/opa/tests/ -v
```

**Expected:** All tests PASS

---

## Common Commands

### Evaluate All Policies

```bash
opa eval \
  --data services/opa/policies/ \
  --data services/opa/data/ \
  --input input.json \
  --format pretty \
  'data.compliance'
```

### Test Specific Policy

```bash
opa test services/opa/policies/sample.rego services/opa/tests/sample_test.rego -v
```

### Check Policy Syntax

```bash
opa check services/opa/policies/
```

### Profile Performance

```bash
opa eval \
  --data services/opa/policies/ \
  --input input.json \
  --profile \
  --format pretty \
  'data.compliance'
```

---

## Input JSON Format

```json
{
  "changed_files": [
    {
      "path": "apps/api/src/file.ts",
      "diff": "+ const x = 1;",
      "additions": 1,
      "deletions": 0
    }
  ],
  "pr_title": "Add feature",
  "pr_body": "Description",
  "pr_number": 123,
  "author": "developer"
}
```

---

## Output Format

```json
{
  "deny": [
    "HARD STOP [Domain]: Violation message"
  ],
  "override": [
    "OVERRIDE REQUIRED [Domain]: Override message"
  ],
  "warn": [
    "WARNING [Domain]: Warning message"
  ]
}
```

---

## CI/CD Integration

The OPA compliance check runs automatically on all PRs via `.github/workflows/opa_compliance_check.yml`.

**Workflow triggers:**
- PR opened, synchronized, or reopened
- Push to main/master/develop

**Results:**
- ✅ PASS: No HARD STOP violations
- ❌ FAIL: HARD STOP violations found (blocks merge)
- ⚠️ WARN: OVERRIDE or WARNING violations (doesn't block)

---

## Troubleshooting

### "opa: command not found"

**Solution:** Use full path to OPA binary:
```bash
./services/opa/bin/opa.exe version  # Windows
./services/opa/bin/opa version      # Linux/Mac
```

### "rego_parse_error"

**Solution:** Check policy syntax:
```bash
opa check services/opa/policies/your-policy.rego
```

### Tests Failing

**Solution:** Run with verbose output:
```bash
opa test services/opa/policies/ services/opa/tests/ -v
```

### Slow Policy Evaluation

**Solution:** Profile and optimize:
```bash
opa eval --profile --data services/opa/policies/ --input input.json 'data.compliance'
```

---

## Next Steps

1. **Phase 1 (Week 6-7):** Implement Tier 1 MAD policies (security, architecture)
2. **Phase 2 (Week 8-11):** Implement Tier 2/3 MAD policies (data, observability, testing)
3. **Phase 3 (Week 11-13):** Build compliance dashboard
4. **Phase 4 (Week 14-16):** Training and production rollout

---

## Resources

- **Full Documentation:** `services/opa/README.md`
- **Policy Template:** `services/opa/_template.rego.example`
- **Sample Policy:** `services/opa/policies/sample.rego`
- **OPA Docs:** https://www.openpolicyagent.org/docs/latest/
- **VeroField Rules 2.1:** `docs/developer/VeroField_Rules_2.1.md`

---

**Status:** Phase -1, Week 1 Complete ✅  
**Next:** Phase -1, Week 2 (AI Policy Scripts & Validation)



