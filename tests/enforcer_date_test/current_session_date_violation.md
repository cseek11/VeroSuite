<!-- ENFORCER_TEST_FIXTURE -->
# Test File for Date Violation Enforcement

This is a synthetic test fixture used to manually verify that non-historical files with hardcoded dates are still caught by the enforcer.

**Last Updated:** *(set to a stale date such as YYYY-MM-DD when running manual regression tests)*

By default this file keeps the field placeholder-only so routine enforcement runs stay clean.

---

## Purpose

This file should:
- Appear in `ACTIVE_VIOLATIONS.md` as a current_session violation
- Cause `ENFORCER_STATUS.md` to show `REJECTED` status
- Be included in `ENFORCER_REPORT.json` with `session_scope: "current_session"`

If this file does NOT trigger a violation, it indicates a false negative regression.

