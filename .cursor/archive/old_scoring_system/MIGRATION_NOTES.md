# Scoring System Migration Notes

**Migration Date:** 2025-11-21  
**From:** Old system (tests, bug_fix, docs, performance, security)  
**To:** New system (search_first, pattern_match, security_correct, architecture_compliant, test_quality, observability_correct, docs_updated)

---

## Key Changes

### 1. YAML Loader (`load_yaml`)
- **Old:** Parsed simple key-value pairs for `tests`, `bug_fix`, `docs`, `performance`, `security`
- **New:** Must parse nested `scoring:` and `penalties:` sections with `points:` fields

### 2. Scoring Functions
- **Old:** `score_tests()`, `detect_bug_fix()`, `score_documentation()`, `score_performance()`, `score_security()`
- **New:** Need functions for:
  - `score_search_first()` - Check if AI searched before implementing
  - `score_pattern_match()` - Check if output matched golden pattern
  - `score_security_correct()` - RLS/Auth/Secrets validation
  - `score_architecture_compliant()` - Cross-service imports, file placement
  - `score_test_quality()` - Unit + regression tests
  - `score_observability_correct()` - Logging + errors
  - `score_docs_updated()` - Docs, patterns, state machines

### 3. Penalty Functions
- **Old:** `calculate_penalties()` with `failing_ci`, `missing_tests`, `regression`
- **New:** Need to detect:
  - `hardcoded_values` - Dates, secrets, tenantId, URLs
  - `rls_violation` - Missing tenant isolation
  - `missing_tests` - No tests for feature/bug fix
  - `architecture_drift` - Boundary violations
  - `unstructured_logging` - console.log or missing traceId
  - `unsafe_frontend` - XSS vulnerabilities

### 4. Score Calculation
- **Old:** Breakdown with old categories
- **New:** Breakdown with new categories, different thresholds (min_pass: 40, warning: 20, fail: 0)

---

## Implementation Strategy

1. Update `load_yaml()` to parse new format
2. Create new scoring functions
3. Update `compute_score()` to use new functions
4. Update `calculate_penalties()` for new penalty types
5. Update `generate_comment()` to reflect new breakdown format
6. Keep old functions in archive for reference

---

**Last Updated:** 2025-11-21







