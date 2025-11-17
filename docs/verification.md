---
# Cursor Rule Metadata
version: 1.3
project: VeroField
scope:
  - verification
  - ci
priority: high
last_updated: 2025-11-11 20:13:54
always_apply: true
---

# PRIORITY: HIGH - Verification Rules

## PRIORITY: HIGH - Automated Verification Checks

These rules can be integrated into CI/CD pipelines or run as pre-commit hooks.

### Documentation Verification

**Verify:**
- ✅ Ensure all `.md` files contain 'Last Updated' timestamp
- ✅ Ensure 'Last Updated' uses current system date/time format (YYYY-MM-DD HH:MM:SS)
- ✅ Ensure no hardcoded dates in documentation
- ✅ Ensure CHANGELOG.md is updated for significant changes

### Component Verification

**Verify:**
- ✅ Ensure no duplicate component names in `frontend/src/components/ui/`
- ✅ Ensure all components follow naming conventions (PascalCase)
- ✅ Ensure all components have proper TypeScript interfaces
- ✅ Ensure CustomerSearchSelector is used for all customer selection (not basic Select)

### Form Verification

**Verify:**
- ✅ Ensure all forms use `zodResolver` from `@hookform/resolvers/zod`
- ✅ Ensure all forms use `react-hook-form` with `Controller`
- ✅ Ensure all customer fields use `CustomerSearchSelector`
- ✅ Ensure all forms have proper error handling

### Import Verification

**Verify:**
- ✅ Ensure imports follow defined order:
  1. React & Hooks
  2. Form Libraries (react-hook-form, zod)
  3. UI Components (from ui/)
  4. Icons (lucide-react)
  5. API/Data (enhancedApi, react-query)
  6. Types/Interfaces
  7. Utilities
- ✅ Ensure no duplicate imports
- ✅ Ensure imports use `@/` alias for internal paths

### Code Quality Verification

**Verify:**
- ✅ Ensure 100% TypeScript coverage (no `any` types without justification)
- ✅ Ensure all components have proper error handling
- ✅ Ensure tenant isolation is maintained in all database operations
- ✅ Ensure no `.env` files are committed
- ✅ Ensure ESLint rules are followed

### Security Verification

**Verify:**
- ✅ Ensure tenant isolation in all database queries
- ✅ Ensure authentication checks are in place
- ✅ Ensure input validation on all user inputs
- ✅ Ensure no secrets are hardcoded
- ✅ Ensure RLS policies are maintained

---

## PRIORITY: NORMAL - Verification Script Template

```bash
#!/bin/bash
# cursor_verify.sh - Verification script for Cursor rules

echo "🔍 Verifying Cursor rules compliance..."

# Check documentation timestamps
echo "Checking documentation timestamps..."
find . -name "*.md" -type f ! -path "*/node_modules/*" ! -path "*/.git/*" | while read file; do
  if ! grep -q "Last Updated" "$file"; then
    echo "❌ Missing 'Last Updated' in $file"
  fi
done

# Check for duplicate components
echo "Checking for duplicate components..."
# Implementation: Check for duplicate component names in ui/

# Check form patterns
echo "Checking form patterns..."
# Implementation: Verify forms use zodResolver and CustomerSearchSelector

# Check import order
echo "Checking import order..."
# Implementation: Verify imports follow defined order

echo "✅ Verification complete"
```

---

## PRIORITY: NORMAL - CI Integration

### GitHub Actions Example

```yaml
name: Cursor Rules Verification

on: [push, pull_request]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Verify Documentation
        run: |
          # Check for Last Updated timestamps
          # Check for hardcoded dates
      - name: Verify Components
        run: |
          # Check for duplicate components
          # Check component naming
      - name: Verify Forms
        run: |
          # Check form patterns
          # Check CustomerSearchSelector usage
```

---

## PRIORITY: NORMAL - Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run verification checks
./scripts/cursor_verify.sh

if [ $? -ne 0 ]; then
  echo "❌ Verification failed. Please fix issues before committing."
  exit 1
fi
```





