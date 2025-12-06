# Task 5: R12 (Security Event Logging) — Draft Summary

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-12-05  
**Rule:** R12 - Security Event Logging  
**Priority:** HIGH (Tier 2 - OVERRIDE)

---

## What Was Generated

### 1. Step 5 Audit Checklist (48 items)
- **Authentication Event Logging:** 8 checks
- **Authorization Event Logging:** 7 checks
- **PII Access Event Logging:** 8 checks
- **Security Policy Change Logging:** 7 checks
- **Admin Action Logging:** 8 checks
- **Financial Transaction Logging:** 7 checks
- **Audit Log Format:** 7 checks
- **Privacy Compliance:** 6 checks
- **Error Handling:** 5 checks

### 2. OPA Policy Mapping
- **5 violation patterns + 1 warning:**
  1. Missing authentication event logging (login, logout, password changes)
  2. Missing authorization event logging (permission denials, role changes)
  3. Missing PII access logging (privileged contexts, modifications)
  4. Missing security policy change logging (RLS, permissions, roles)
  5. Missing admin action logging (impersonation, privilege escalation)
  6. Warning: Security events logged but may be incomplete
- **Enforcement level:** OVERRIDE (Tier 2 MAD)
- **Policy file:** `services/opa/policies/security.rego` (R12 section)

### 3. Automated Check Script
- **Script:** `.cursor/scripts/check-security-logging.py`
- **Checks:**
  - Detects missing authentication event logging (pattern matching, AST parsing)
  - Verifies authorization events are logged (pattern matching)
  - Verifies PII access is logged (pattern matching, AST parsing)
  - Verifies security policy changes are logged (pattern matching)
  - Verifies admin actions are logged (pattern matching)
  - Verifies financial transactions are logged (pattern matching)
  - Verifies audit logs use AuditService (pattern matching)
  - Verifies no raw PII values in logs (pattern matching, AST parsing)

### 4. Manual Verification Procedures
- **4-step procedure:**
  1. Review Security Events - Identify all security events in changed code
  2. Verify Audit Logging - Check that all security events are logged
  3. Check Privacy Compliance - Verify no raw PII values are logged
  4. Validate Log Format - Verify audit logs include required fields
- **4 verification criteria**

### 5. OPA Policy Implementation
- **Full Rego code provided**
- **5 deny rules + 1 warn rule**
- **Pattern matching** (AST parsing, file analysis)

### 6. Test Cases
- **12 test cases specified:**
  1. Happy path (authentication events logged)
  2. Happy path (authorization events logged)
  3. Happy path (PII access logged with metadata only)
  4. Violation (missing authentication logging)
  5. Violation (missing authorization logging)
  6. Violation (missing PII access logging)
  7. Violation (missing security policy change logging)
  8. Violation (missing admin action logging)
  9. Warning (security events logged but incomplete)
  10. Override (with marker)
  11. Edge case (financial transaction logging)
  12. Edge case (privacy compliance - no raw PII)

---

## Review Needed

### Question 1: Security Event Detection
**Context:** How should the script detect security events that require logging?

**Options:**
- A) Pattern matching (detect common security patterns: login, permission checks, PII access)
- B) AST parsing (analyze code structure, detect security operations)
- C) Combination: Pattern matching + AST parsing for accuracy
- D) Heuristic check (verify security-related methods call auditService.log)

**Recommendation:** Option C - Combination approach. Use pattern matching to detect common security patterns (login, permission checks, PII access). Use AST parsing to verify auditService.log() is called. This provides comprehensive coverage.

**Rationale:** Security event detection requires:
- Detecting authentication operations (login, logout, password changes) (pattern matching)
- Detecting authorization operations (permission checks, role changes) (pattern matching)
- Detecting PII access operations (pattern matching, AST parsing)
- Verifying auditService.log() is called (AST parsing)

---

### Question 2: PII Detection
**Context:** How should the script detect PII access and verify it's logged?

**Options:**
- A) Pattern matching (detect common PII field names: email, phone, ssn, creditCard)
- B) AST parsing (analyze data access, detect PII fields)
- C) Combination: Pattern matching + AST parsing for accuracy
- D) Configuration-based (use PII field list from configuration)

**Recommendation:** Option C - Combination approach. Use pattern matching to detect common PII field names. Use AST parsing to verify PII access is logged. Use configuration-based approach for custom PII fields.

**Rationale:** PII detection requires:
- Detecting common PII fields (email, phone, ssn, creditCard) (pattern matching)
- Detecting PII access in privileged contexts (AST parsing)
- Verifying PII access is logged (AST parsing)
- Handling custom PII fields (configuration-based)

---

### Question 3: Privacy Compliance Verification
**Context:** How should the script verify no raw PII values are logged?

**Options:**
- A) Pattern matching (detect raw PII values in audit logs: email, phone, ssn)
- B) AST parsing (analyze audit log calls, detect PII values)
- C) Combination: Pattern matching + AST parsing for accuracy
- D) Heuristic check (verify audit logs use metadata only, not raw values)

**Recommendation:** Option C - Combination approach. Use pattern matching to detect raw PII values in audit log calls. Use AST parsing to verify audit logs use metadata only (field names, types, not values). This ensures privacy compliance.

**Rationale:** Privacy compliance verification requires:
- Detecting raw PII values in audit logs (pattern matching)
- Verifying audit logs use metadata only (AST parsing)
- Detecting common PII patterns (email, phone, ssn) (pattern matching)
- Handling edge cases (hashed values, partial values) (AST parsing)

---

### Question 4: Security Event Categories
**Context:** Should the script distinguish between different security event categories?

**Options:**
- A) Single category (all security events treated the same)
- B) Multiple categories (authentication, authorization, PII, admin, financial)
- C) Category-based detection (different patterns for different categories)
- D) Configuration-based (use security event categories from configuration)

**Recommendation:** Option B - Multiple categories. Distinguish between authentication, authorization, PII access, admin actions, and financial transactions. Use category-specific patterns for detection. This provides better coverage and more specific error messages.

**Rationale:** Security event categories help:
- Provide specific error messages (missing authentication logging vs missing PII logging)
- Apply category-specific rules (PII requires metadata-only logging)
- Better organization and understanding
- Easier maintenance and updates

---

### Question 5: Audit Service Integration
**Context:** How should the script verify AuditService is used correctly?

**Options:**
- A) Pattern matching (detect auditService.log() calls)
- B) AST parsing (analyze AuditService usage, verify correct parameters)
- C) Combination: Pattern matching + AST parsing for accuracy
- D) Heuristic check (verify auditService is injected and used)

**Recommendation:** Option C - Combination approach. Use pattern matching to detect auditService.log() calls. Use AST parsing to verify correct parameters (tenantId, userId, action, resourceType). Verify AuditService is injected correctly.

**Rationale:** AuditService integration verification requires:
- Detecting auditService.log() calls (pattern matching)
- Verifying correct parameters (AST parsing)
- Verifying AuditService is injected (AST parsing)
- Handling edge cases (async/await, error handling) (AST parsing)

---

## Key Decisions Made

### 1. Comprehensive Coverage
- **Decision:** Cover all security event types (authentication, authorization, PII, admin, financial)
- **Rationale:** Security event logging is critical for audit trails and compliance

### 2. Privacy Compliance Focus
- **Decision:** Emphasize metadata-only logging, no raw PII values
- **Rationale:** SOC2/privacy compliance requires careful handling of PII

### 3. Integration with R08
- **Decision:** Integrate with R08 (Structured Logging) for consistent logging patterns
- **Rationale:** Security events should use structured logging for better observability

### 4. Error Handling
- **Decision:** Audit logging failures should not break main operations
- **Rationale:** Security event logging is important but should not impact functionality

### 5. Required Fields
- **Decision:** Mandatory fields: tenantId, userId, action, resourceType, resourceId
- **Rationale:** These fields are essential for audit trail completeness

---

## Implementation Plan

### Phase 1: OPA Policy (Estimated: 1 hour)
1. Extend `services/opa/policies/security.rego` with R12 section
2. Implement 5 violation patterns + 1 warning pattern
3. Add override mechanism
4. Test with sample violations

### Phase 2: Automated Script (Estimated: 2 hours)
1. Create `.cursor/scripts/check-security-logging.py`
2. Implement pattern matching for security events
3. Implement AST parsing for audit logging verification
4. Add PII detection and privacy compliance checks
5. Add category-specific detection
6. Test with sample files

### Phase 3: Test Suite (Estimated: 1 hour)
1. Create `services/opa/tests/security_r12_test.rego`
2. Implement 12 test cases
3. Test violation patterns
4. Test override mechanism

### Phase 4: Rule File Update (Estimated: 0.5 hours)
1. Update `.cursor/rules/03-security.mdc` with Step 5 section
2. Add audit checklist
3. Add automated checks section
4. Add manual verification procedures

### Phase 5: Documentation (Estimated: 0.5 hours)
1. Create completion document
2. Update handoff document
3. Create testing guide (if needed)

**Total Estimated Time:** 5 hours

---

## Next Steps

1. **Review this draft** - Answer questions, provide feedback
2. **Approve or request changes** - Based on review
3. **Implement approved draft** - Create OPA policy, script, tests
4. **Update rule file** - Add Step 5 section to `.cursor/rules/03-security.mdc`
5. **Create completion document** - Document implementation

---

## Questions for Human Reviewer

1. **Security Event Detection:** Do you agree with Option C (pattern matching + AST parsing) for detecting security events?

2. **PII Detection:** Do you agree with Option C (pattern matching + AST parsing + configuration) for detecting PII access?

3. **Privacy Compliance Verification:** Do you agree with Option C (pattern matching + AST parsing) for verifying no raw PII values are logged?

4. **Security Event Categories:** Do you agree with Option B (multiple categories) for distinguishing between different security event types?

5. **Audit Service Integration:** Do you agree with Option C (pattern matching + AST parsing) for verifying AuditService is used correctly?

6. **Coverage:** Are there any additional security events that should be covered?

7. **Edge Cases:** Are there any edge cases or special scenarios that should be handled?

8. **Privacy Compliance:** Are there any additional privacy compliance requirements that should be included?

---

**Last Updated:** 2025-12-05  
**Next Review:** After human feedback  
**Estimated Implementation Time:** 5 hours





