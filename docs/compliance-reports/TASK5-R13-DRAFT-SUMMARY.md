# R13: Input Validation — Draft Summary

**Status:** DRAFT - Awaiting Human Review  
**Created:** 2025-12-05  
**Rule:** R13 - Input Validation  
**Priority:** HIGH (Tier 2 - OVERRIDE)  
**Estimated Implementation Time:** 5 hours

---

## Overview

This draft provides comprehensive Step 5 audit procedures for R13: Input Validation, covering:
- DTO validation (class-validator decorators)
- Controller validation (ValidationPipe, DTOs)
- File upload validation (type, size, content)
- XSS prevention (HTML sanitization, config sanitization)
- Injection prevention (SQL, command, path traversal)
- Input size limits (strings, arrays, files)
- Business rule validation (cross-field, conditional)
- Error handling (user-friendly messages, secure errors)

**Key Achievement:** This is the **final Tier 2 rule**! After R13, all high-priority rules (Tier 1 + Tier 2 = 13 rules) will be complete! 🎉

---

## Draft Checklist Summary

### Total Checklist Items: 50

**Breakdown:**
- **DTO Validation:** 13 items
- **Controller Validation:** 7 items
- **File Upload Validation:** 8 items
- **XSS Prevention:** 8 items
- **Injection Prevention:** 7 items
- **Input Size Limits:** 6 items
- **Business Rule Validation:** 6 items
- **Error Handling:** 6 items
- **Shared Validation Constants:** 5 items

---

## Key Features

### 1. Comprehensive DTO Validation
- Type validation (`@IsString()`, `@IsEmail()`, etc.)
- Size limits (`@MaxLength()`, `@MinLength()`, `@Length()`)
- Format validation (`@IsEmail()`, `@IsUUID()`, `@Matches()`)
- Range validation (`@Min()`, `@Max()`, `@IsInt()`)
- Enum validation (`@IsEnum()`)
- Nested object validation (`@ValidateNested()`, `@Type()`)
- Array validation (`@IsArray()`, `@ArrayMinSize()`, `@ArrayMaxSize()`)

### 2. XSS Prevention
- HTML sanitization before storage
- Config object sanitization (recursive)
- XSS vector detection (script tags, javascript: protocol, event handlers, eval())
- Widget config sanitization
- Frontend React protection
- Backend sanitization (not just frontend)

### 3. Injection Prevention
- SQL injection prevention (Prisma parameterized queries)
- Command injection prevention
- NoSQL injection prevention
- LDAP injection prevention
- Path traversal prevention
- Template injection prevention

### 4. File Upload Validation
- File type validation (MIME type, extension)
- File size validation (max size limit)
- File content validation (not just extension)
- Malware scanning (if applicable)
- Secure storage (not in public directory)
- Unique filenames (prevent overwrites)

---

## Review Questions

### Question 1: Validation Scope

**Question:** Should R13 validate all input sources or focus on high-risk areas?

**Options:**
- **A)** Validate all input sources (body, query, params, files, headers, webhooks)
- **B)** Focus on high-risk areas only (body, files, user-generated content)
- **C)** Validate all sources but with different strictness levels

**Recommendation:** Option A - Comprehensive validation is critical for security. All input sources should be validated, but with appropriate strictness:
- **Body/Query/Params:** Full DTO validation
- **Files:** Type, size, content validation
- **Headers:** Custom header validation (if applicable)
- **Webhooks:** Schema validation (JSON Schema)

**Rationale:** Injection attacks can come from any input source. Comprehensive validation prevents attacks from unexpected vectors.

---

### Question 2: Sanitization Requirements

**Question:** Should HTML sanitization be mandatory for all HTML content or only user-generated content?

**Options:**
- **A)** Mandatory for all HTML content (admin-generated, system-generated, user-generated)
- **B)** Mandatory only for user-generated content
- **C)** Mandatory for user-generated, recommended for admin-generated

**Recommendation:** Option C - Mandatory for user-generated content, recommended for admin-generated:
- **User-generated content:** Always sanitize (high risk)
- **Admin-generated content:** Sanitize if stored/displayed (medium risk)
- **System-generated content:** Sanitize if includes user data (low risk)

**Rationale:** User-generated content is highest risk. Admin-generated content may be trusted but should still be sanitized if displayed to other users.

---

### Question 3: File Upload Validation

**Question:** What file types should be allowed? Should virus scanning be required?

**Options:**
- **A)** Strict whitelist (images only: JPEG, PNG, WebP)
- **B)** Moderate whitelist (images + documents: PDF, DOCX)
- **C)** Configurable per endpoint (different rules for different upload types)
- **D)** Virus scanning required for all uploads

**Recommendation:** Option C + D - Configurable per endpoint with virus scanning:
- **Profile photos:** Images only (JPEG, PNG, WebP)
- **Documents:** PDF, DOCX, XLSX (with virus scanning)
- **Configurable:** Each endpoint defines allowed types
- **Virus scanning:** Required for all user uploads (if applicable)

**Rationale:** Different endpoints have different requirements. Virus scanning adds security but may not be feasible for all projects (cost, infrastructure).

---

### Question 4: Business Rule Validation

**Question:** Should business rules be validated in DTOs or services?

**Options:**
- **A)** DTOs only (using custom validators)
- **B)** Services only (after DTO validation)
- **C)** Both (simple rules in DTOs, complex rules in services)

**Recommendation:** Option C - Both, with clear separation:
- **DTOs:** Type validation, format validation, simple business rules (e.g., email format, age range)
- **Services:** Complex business rules (e.g., user exists, permission checks, cross-field validation)

**Rationale:** DTOs catch basic validation errors early. Services handle complex business logic that requires database access or cross-field validation.

---

### Question 5: Error Message Security

**Question:** Should validation errors expose field names or be generic?

**Options:**
- **A)** Expose field names (better UX, helps users fix errors)
- **B)** Generic messages only (prevents enumeration attacks)
- **C)** Field names for user-facing errors, generic for security-sensitive fields

**Recommendation:** Option C - Field names for user-facing errors, generic for security-sensitive fields:
- **User-facing fields:** Expose field names (email, name, phone)
- **Security-sensitive fields:** Generic messages (password, token, API key)
- **Rate limiting:** Generic messages to prevent enumeration

**Rationale:** Balance between UX and security. Field names help users fix errors, but generic messages prevent attackers from discovering valid fields.

---

## OPA Policy Mapping

### Violation Patterns (7)

1. **Missing DTO Validation** - Controller uses `any` type or no DTO
2. **Missing Validation Decorators** - DTO properties without validation decorators
3. **Missing File Validation** - File uploads without type/size validation
4. **Missing XSS Sanitization** - HTML content stored without sanitization
5. **SQL Injection Risk** - Raw SQL queries without parameterization
6. **Path Traversal Risk** - File operations without path validation
7. **Missing Size Limits** - Inputs without max length/size limits

### Warning Patterns (2)

1. **Missing Sanitization** - Config objects without sanitization (non-blocking)
2. **Generic Error Messages** - Validation errors without field names (UX concern)

---

## Automated Script Design

### Detection Capabilities

1. **DTO Validation Detection:**
   - Missing DTOs for `@Body()` parameters
   - Missing validation decorators in DTOs
   - `any` types in DTOs
   - Missing size limits

2. **XSS Detection:**
   - HTML content stored without sanitization
   - Config objects without sanitization
   - `dangerouslySetInnerHTML` without sanitization
   - XSS vectors in stored content

3. **Injection Detection:**
   - SQL concatenation patterns
   - Raw SQL queries without parameterization
   - Path traversal patterns
   - Command injection patterns

4. **File Upload Detection:**
   - Missing file type validation
   - Missing file size validation
   - Missing content validation

### Script Modes

- `--file <file_path>` - Check single file
- `--pr <PR_NUMBER>` - Check all changed files in PR
- `--type <validation_type>` - Check specific validation type (dto, xss, injection, file)
- `--all` - Check all backend files

---

## Test Suite Design

### Test Cases (15-20)

1. ✅ DTO validation present (no violation)
2. ❌ Missing DTO validation (violation)
3. ✅ XSS sanitization present (no violation)
4. ❌ Missing XSS sanitization (violation)
5. ✅ File upload validation present (no violation)
6. ❌ Missing file upload validation (violation)
7. ✅ SQL parameterization present (no violation)
8. ❌ SQL concatenation detected (violation)
9. ✅ Path validation present (no violation)
10. ❌ Path traversal risk (violation)
11. ✅ Size limits present (no violation)
12. ❌ Missing size limits (violation)
13. ✅ Business rule validation present (no violation)
14. ❌ Missing business rule validation (violation)
15. ✅ Override marker bypasses violation

---

## Integration Points

### R11 Integration (Backend Patterns)
- DTOs must use `class-validator` decorators (R11 requirement)
- Controllers must use DTOs (R11 requirement)
- R13 adds validation-specific checks (size limits, sanitization, injection prevention)

### R12 Integration (Security Event Logging)
- Validation failures should be logged (security events)
- Repeated validation failures may indicate attack attempts

### R07 Integration (Error Handling)
- Validation errors should be properly categorized (400 Bad Request)
- Validation errors should have user-friendly messages

### R03 Integration (Security)
- Validation prevents injection attacks
- Validation enforces tenant isolation (validate tenant_id)

---

## Estimated Implementation Time

**Total:** 5 hours

**Breakdown:**
- OPA policy extension: 1 hour
- Automated script: 2 hours (complex - multiple detection types)
- Test suite: 1 hour
- Rule file update: 0.5 hours
- Documentation: 0.5 hours

**Complexity:** High
- Multiple validation types (DTO, XSS, injection, file)
- Multiple input sources (body, query, params, files)
- Complex detection logic (pattern matching + AST parsing)

---

## Examples Provided

### ✅ Correct Patterns
1. Comprehensive DTO validation with decorators
2. HTML sanitization before storage
3. File upload validation (type, size, content)
4. Parameterized queries (Prisma)
5. Path validation (prevent traversal)

### ❌ Violation Patterns
1. Missing DTO validation
2. Missing XSS sanitization
3. Missing file validation
4. SQL concatenation
5. Path traversal risk

---

## Recommendations

### 1. Comprehensive Coverage
- Cover all input sources (body, query, params, files, headers)
- Cover all validation types (type, format, size, business rules)
- Cover all attack vectors (injection, XSS, path traversal)

### 2. Clear Separation
- DTOs: Type/format validation
- Services: Business rule validation
- Middleware: Global validation (size limits, rate limiting)

### 3. User-Friendly Errors
- Field names for user-facing errors
- Generic messages for security-sensitive fields
- Helpful suggestions for fixing errors

### 4. Performance Considerations
- Validation should be fast (don't block requests)
- Sanitization should be efficient (use established libraries)
- File validation should be async (don't block upload)

---

## Next Steps

### After Approval
1. Create OPA policy extension (`services/opa/policies/security.rego` R13 section)
2. Implement automated script (`.cursor/scripts/check-input-validation.py`)
3. Create test suite (`services/opa/tests/security_r13_test.rego`)
4. Update rule file (`.cursor/rules/03-security.mdc` R13 section)
5. Create completion documentation

### After R13 Completion
- ✅ **Tier 1 complete:** 3/3 rules (100%)
- ✅ **Tier 2 complete:** 10/10 rules (100%) 🎉
- ✅ **All high-priority rules complete!** (13/13 rules)
- ⏳ **Tier 3 remaining:** 12 rules (WARNING only)

---

## Questions for Human Reviewer

1. **Validation Scope:** Should R13 validate all input sources or focus on high-risk areas?
2. **Sanitization Requirements:** Should HTML sanitization be mandatory for all HTML content or only user-generated content?
3. **File Upload Validation:** What file types should be allowed? Should virus scanning be required?
4. **Business Rule Validation:** Should business rules be validated in DTOs or services?
5. **Error Message Security:** Should validation errors expose field names or be generic?

---

**Draft Status:** Ready for Review  
**Created:** 2025-12-05  
**Next Step:** Await human approval before implementation





