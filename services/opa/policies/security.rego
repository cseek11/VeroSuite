# Security Policy - Tenant Isolation, RLS, Input Validation, Security Event Logging
#
# This policy enforces security requirements for VeroField:
# - R01: Tenant Isolation (Tier 1 - BLOCK)
# - R02: RLS Enforcement (Tier 1 - BLOCK)
# - R12: Security Event Logging (Tier 2 - OVERRIDE)
# - R13: Input Validation (Tier 2 - OVERRIDE)
#
# Created: 2025-11-23
# Version: 1.0.0

package compliance.security

import rego.v1

# Policy metadata
metadata := {
	"name": "Security - Tenant Isolation & Validation",
	"domain": "security",
	"tier": "1", # BLOCK - Security is critical
	"version": "1.0.0",
	"created": "2025-11-30",
	"description": "Enforces tenant isolation, RLS, input validation, and security event logging",
}

# =============================================================================
# R01: TENANT ISOLATION (TIER 1 - BLOCK)
# =============================================================================
# All database queries must include tenant_id filter or use withTenant() wrapper
# API endpoints must extract tenant_id from JWT, never from request

# Input validation guard
input_valid if {
	is_array(input.changed_files)
}

# Override marker detection (local implementation for consistency)
has_override(marker) if {
	some file in input.changed_files
	contains(file.content, marker)
}
has_override(marker) if {
	is_string(input.pr_body)
	contains(input.pr_body, marker)
}

# Deny: Prisma query without tenant_id filter
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".service.ts")
	contains(file.diff, "findMany(")
	not contains(file.diff, "tenant_id")
	not contains(file.diff, "tenantId")
	not contains(file.diff, "withTenant(")
	not has_override("@override:tenant-isolation")

	msg := sprintf(
		"HARD STOP [Security/R01]: Prisma query without tenant_id filter in %s. All queries must include tenant_id filter or use withTenant() wrapper. See docs/architecture/tenant-isolation.md for patterns.",
		[file.path],
	)
}

# Deny: findUnique without tenant_id (common pattern)
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".service.ts")
	contains(file.diff, "findUnique(")
	not contains(file.diff, "tenant_id")
	not contains(file.diff, "tenantId")
	not contains(file.diff, "withTenant(")
	not has_override("@override:tenant-isolation")

	msg := sprintf(
		"HARD STOP [Security/R01]: Prisma findUnique() without tenant_id filter in %s. Add tenant_id to where clause or use withTenant() wrapper.",
		[file.path],
	)
}

# Deny: Raw SQL without withTenant() wrapper
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".service.ts")
	regex.match(`\$queryRawUnsafe|\$executeRawUnsafe`, file.diff)
	not contains(file.diff, "withTenant(")
	not has_override("@override:tenant-isolation")

	msg := sprintf(
		"HARD STOP [Security/R01]: Raw SQL query without withTenant() wrapper in %s. Wrap all raw queries in withTenant() to enforce tenant isolation. Example: await this.db.withTenant(tenantId, async () => { ... })",
		[file.path],
	)
}

# Deny: API endpoint accepting tenant_id from request body/params
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".controller.ts")
	regex.match(`@Body\(['"]tenant_id['"]|@Query\(['"]tenant_id['"]|@Param\(['"]tenant_id['"]`, file.diff)
	not has_override("@override:tenant-isolation")

	msg := sprintf(
		"HARD STOP [Security/R01]: API endpoint accepting tenant_id from request in %s. Extract tenant_id from validated JWT (@Request() req → req.user.tenantId), never from request body/params/query.",
		[file.path],
	)
}

# Deny: Missing JwtAuthGuard on protected endpoint
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".controller.ts")
	regex.match(`@Post\(|@Put\(|@Patch\(|@Delete\(`, file.diff)
	not contains(file.diff, "@UseGuards(JwtAuthGuard)")
	not contains(file.diff, "@UseGuards(LocalAuthGuard)")
	not contains(file.diff, "@Public()") # Allow public endpoints
	not has_override("@override:tenant-isolation")

	msg := sprintf(
		"HARD STOP [Security/R01]: Protected endpoint without @UseGuards(JwtAuthGuard) in %s. Add authentication guard or mark as @Public() if intentionally public.",
		[file.path],
	)
}

# Deny: Exposing tenant_id in error messages
deny contains msg if {
	input_valid
	some file in input.changed_files
	regex.match(`\.ts$`, file.path)
	regex.match(`throw new \w+Error\([^)]*tenant[_-]?id[^)]*\$\{`, file.diff)
	not has_override("@override:tenant-isolation")

	msg := sprintf(
		"HARD STOP [Security/R01]: Error message exposes tenant_id in %s. Never include tenant_id in user-facing error messages. Use generic messages like 'Resource not found'.",
		[file.path],
	)
}

# =============================================================================
# R02: RLS ENFORCEMENT (TIER 1 - BLOCK)
# =============================================================================
# Row Level Security policies must be enabled and enforced at database level
# Complements R01 (application-level) with database-level enforcement

# Deny: New table with tenant_id but no RLS policy
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".sql")
	contains(file.diff, "CREATE TABLE")
	contains(file.diff, "tenant_id")
	not contains(file.diff, "ENABLE ROW LEVEL SECURITY")
	not has_override("@override:rls-enforcement")

	# Extract table name for better error message
	table_matches := regex.find_all_string_submatch_n(`CREATE TABLE\s+"?(\w+)"?`, file.diff, -1)
	table_name := get_table_name(table_matches)

	msg := sprintf(
		"HARD STOP [Security/R02]: New table '%s' with tenant_id column missing RLS policy in %s. Add: ALTER TABLE \"%s\" ENABLE ROW LEVEL SECURITY; and CREATE POLICY \"tenant_isolation_policy\" ON \"%s\" USING (tenant_id::text = current_setting('app.tenant_id', true));",
		[table_name, file.path, table_name, table_name],
	)
}

# Deny: Disabling RLS on existing table
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".sql")
	regex.match(`ALTER\s+TABLE.*DISABLE\s+ROW\s+LEVEL\s+SECURITY`, file.diff)
	not has_override("@override:rls-enforcement")

	msg := sprintf(
		"HARD STOP [Security/R02]: Attempting to disable RLS in %s. This breaks tenant isolation at database level. Remove DISABLE ROW LEVEL SECURITY statement or add @override:rls-enforcement with justification.",
		[file.path],
	)
}

# Deny: Using superuser role in application code
deny contains msg if {
	input_valid
	some file in input.changed_files
	regex.match(`\.ts$|\.js$|\.env`, file.path)
	regex.match(`postgresql://postgres[@:]|DATABASE_URL.*postgres[@:]`, file.diff)
	not has_override("@override:rls-enforcement")

	msg := sprintf(
		"HARD STOP [Security/R02]: Using superuser role 'postgres' in %s. Application must use non-superuser role (e.g., 'verofield_app') to enforce RLS policies. Superuser roles bypass RLS.",
		[file.path],
	)
}

# Deny: SECURITY DEFINER function without tenant filter
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".sql")
	contains(file.diff, "SECURITY DEFINER")
	not contains(file.diff, "current_setting('app.tenant_id')")
	not has_override("@override:rls-enforcement")

	msg := sprintf(
		"HARD STOP [Security/R02]: SECURITY DEFINER function in %s may bypass RLS. Use SECURITY INVOKER (respects RLS automatically) or add explicit tenant_id filter: WHERE tenant_id::text = current_setting('app.tenant_id', true);",
		[file.path],
	)
}

# Warning: New Prisma model with tenant_id (check migration)
warn contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, "schema.prisma")
	contains(file.diff, "model ")
	contains(file.diff, "tenant_id")

	msg := sprintf(
		"WARNING [Security/R02]: New Prisma model with tenant_id in %s. Ensure corresponding migration includes RLS policy (ALTER TABLE ... ENABLE ROW LEVEL SECURITY; CREATE POLICY ...). This warning helps catch cases where migration is missing RLS.",
		[file.path],
	)
}

# =============================================================================
# R12: SECURITY EVENT LOGGING (TIER 2 - OVERRIDE)
# =============================================================================
# Security events must be logged with audit trail:
# - Authentication events (login, logout, password changes)
# - Authorization events (permission denials, role changes)
# - PII access events (privileged contexts only)
# - Security policy changes (RLS, permissions, roles)
# - Admin actions (impersonation, privilege escalation)
# - Financial transactions (payments, refunds)

# Violation 1: Authentication event without logging
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".service.ts")

	# Detect authentication operations
	auth_patterns := ["login(", "logout(", "authenticate(", "validateCredentials(", "changePassword(", "resetPassword("]
	some pattern in auth_patterns
	contains(file.diff, pattern)

	# Check if auditService.log is called
	not contains(file.diff, "auditService.log")
	not contains(file.diff, "audit.log")

	not has_override("@override:security-logging")

	msg := sprintf(
		"OVERRIDE REQUIRED [Security/R12]: Authentication event in %s not logged. All authentication events (login, logout, password changes) must be logged using auditService.log(). Include: tenantId, userId, action, ipAddress. Add @override:security-logging with justification if intentional.",
		[file.path],
	)
}

# Violation 2: Authorization event without logging
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".service.ts")

	# Detect authorization operations
	authz_patterns := ["checkPermission(", "hasPermission(", "requirePermission(", "ForbiddenException("]
	some pattern in authz_patterns
	contains(file.diff, pattern)

	# Check if auditService.log is called
	not contains(file.diff, "auditService.log")
	not contains(file.diff, "audit.log")

	not has_override("@override:security-logging")

	msg := sprintf(
		"OVERRIDE REQUIRED [Security/R12]: Authorization event in %s not logged. Permission denials and role changes must be logged using auditService.log(). Include: userId, resourceType, resourceId, action, requiredPermission. Add @override:security-logging with justification if intentional.",
		[file.path],
	)
}

# Violation 3: PII access without logging (privileged contexts)
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".service.ts")

	# Detect PII field access in select statements
	pii_patterns := ["email", "ssn", "phone", "creditCard", "socialSecurity"]
	some pattern in pii_patterns
	contains(file.diff, pattern)
	contains(file.diff, "select:")

	# Check for admin/privileged context indicators
	admin_indicators := ["@Admin", "requireAdmin", "impersonate", "escalate"]
	some indicator in admin_indicators
	contains(file.diff, indicator)

	# Check if auditService.log is called
	not contains(file.diff, "auditService.log")
	not contains(file.diff, "audit.log")

	not has_override("@override:security-logging")

	msg := sprintf(
		"OVERRIDE REQUIRED [Security/R12]: PII access in privileged context in %s not logged. PII access in admin/security contexts must be logged using auditService.log(). Log metadata only (field names, types), never raw PII values. Add @override:security-logging with justification if intentional.",
		[file.path],
	)
}

# Violation 4: Security policy change without logging
deny contains msg if {
	input_valid
	some file in input.changed_files

	# Detect security policy changes
	policy_changes := [
		"ALTER TABLE.*ROW LEVEL SECURITY",
		"CREATE POLICY",
		"DROP POLICY",
		"updatePermissions(",
		"assignRole(",
		"removeRole(",
	]

	some pattern in policy_changes
	regex.match(pattern, file.diff)

	# Check if auditService.log is called
	not contains(file.diff, "auditService.log")
	not contains(file.diff, "audit.log")

	not has_override("@override:security-logging")

	msg := sprintf(
		"OVERRIDE REQUIRED [Security/R12]: Security policy change in %s not logged. RLS policy changes, permission changes, and role assignments must be logged using auditService.log(). Include: userId, policyType, policyName, beforeState, afterState. Add @override:security-logging with justification if intentional.",
		[file.path],
	)
}

# Violation 5: Admin action without logging
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".service.ts")

	# Detect admin actions
	admin_actions := ["impersonate(", "escalatePrivilege(", "suspendUser(", "deleteUser("]
	some action in admin_actions
	contains(file.diff, action)

	# Check if auditService.log is called
	not contains(file.diff, "auditService.log")
	not contains(file.diff, "audit.log")

	not has_override("@override:security-logging")

	msg := sprintf(
		"OVERRIDE REQUIRED [Security/R12]: Admin action in %s not logged. User impersonation, privilege escalation, and admin user management must be logged using auditService.log(). Include: adminUserId, targetUserId, action, reason, ipAddress. Add @override:security-logging with justification if intentional.",
		[file.path],
	)
}

# Warning: Financial transaction without logging
warn contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".service.ts")

	# Detect financial operations
	financial_ops := ["processPayment(", "refund(", "charge(", "updateBilling("]
	some op in financial_ops
	contains(file.diff, op)

	# Check if auditService.log is called
	not contains(file.diff, "auditService.log")
	not contains(file.diff, "audit.log")

	msg := sprintf(
		"WARNING [Security/R12]: Financial transaction in %s may not be logged. Payment processing, refunds, and billing changes should be logged using auditService.log(). Include: userId, transactionType, amount, currency, transactionId (last 4 digits of card only).",
		[file.path],
	)
}

# Warning: Raw PII in audit logs (privacy violation)
warn contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".service.ts")
	contains(file.diff, "auditService.log")

	# Detect potential raw PII in afterState/beforeState
	pii_in_logs := [
		"email:",
		"ssn:",
		"phone:",
		"creditCard:",
		"password:",
	]

	some pii in pii_in_logs
	contains(file.diff, pii)

	msg := sprintf(
		"WARNING [Security/R12]: Potential raw PII in audit log in %s. Audit logs must contain metadata only (field names, types), never raw PII values. Use: fieldsUpdated: ['email', 'phone'] instead of email: 'user@example.com'. This is a SOC2/privacy compliance requirement.",
		[file.path],
	)
}

# =============================================================================
# R13: INPUT VALIDATION (TIER 2 - OVERRIDE)
# =============================================================================
# All user input must be validated on backend:
# - DTO validation (class-validator decorators)
# - File upload validation (type, size, content)
# - XSS prevention (HTML sanitization)
# - Injection prevention (SQL, command, path traversal)
# - Input size limits (strings, arrays, files)

# Violation 1: Missing DTO validation
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".controller.ts")

	# Detect @Body() parameter without DTO type
	regex.match(`@Body\(\)\s+\w+:\s*any`, file.diff)

	not has_override("@override:input-validation")

	msg := sprintf(
		"OVERRIDE REQUIRED [Security/R13]: Controller in %s uses 'any' type for @Body() parameter. Create and use a proper DTO with class-validator decorators. Add @override:input-validation with justification if intentional.",
		[file.path],
	)
}

# Violation 2: Missing validation decorators in DTOs
deny contains msg if {
	input_valid
	some file in input.changed_files
	contains(file.path, "/dto/")
	endswith(file.path, ".dto.ts")

	# Detect properties without validation decorators
	contains(file.diff, "!: string")
	not contains(file.diff, "@IsString()")
	not contains(file.diff, "@IsEmail()")
	not contains(file.diff, "@IsUUID()")
	not contains(file.diff, "@Matches()")

	not has_override("@override:input-validation")

	msg := sprintf(
		"OVERRIDE REQUIRED [Security/R13]: DTO in %s has properties without validation decorators. Add @IsString(), @IsEmail(), @MaxLength(), etc. from class-validator. Add @override:input-validation with justification if intentional.",
		[file.path],
	)
}

# Violation 3: Missing file upload validation
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".controller.ts")

	# Detect file upload without validation
	contains(file.diff, "@UploadedFile()")
	not contains(file.diff, "@MaxFileSize(")
	not contains(file.diff, "@FileType(")
	not contains(file.diff, "validateFile")

	not has_override("@override:input-validation")

	msg := sprintf(
		"OVERRIDE REQUIRED [Security/R13]: File upload in %s without validation. Add @MaxFileSize(), @FileType() decorators or use validateFile() method. Validate file type, size, and content. Add @override:input-validation with justification if intentional.",
		[file.path],
	)
}

# Violation 4: Missing XSS sanitization
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".service.ts")

	# Detect HTML storage without sanitization
	html_storage_patterns := [
		"description:",
		"content:",
		"html:",
		"body:",
	]

	some pattern in html_storage_patterns
	contains(file.diff, pattern)
	contains(file.diff, "update(")
	not contains(file.diff, "sanitize")
	not contains(file.diff, "DOMPurify")

	not has_override("@override:input-validation")

	msg := sprintf(
		"OVERRIDE REQUIRED [Security/R13]: HTML content in %s stored without sanitization. Use sanitizeHtml() or DOMPurify before storing user-generated HTML. Add @override:input-validation with justification if intentional.",
		[file.path],
	)
}

# Violation 5: SQL injection risk (raw SQL without parameterization)
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".service.ts")

	# Detect $queryRawUnsafe with string concatenation
	regex.match("\\$queryRawUnsafe\\s*\\(\\s*[\"`][^\"`]*\\$\\{", file.diff)

	not has_override("@override:input-validation")

	msg := sprintf(
		"OVERRIDE REQUIRED [Security/R13]: SQL injection risk in %s. Use $queryRaw with tagged template literals instead of $queryRawUnsafe with string concatenation. Prisma automatically parameterizes tagged templates. Add @override:input-validation with justification if intentional.",
		[file.path],
	)
}

# Violation 6: Path traversal risk
deny contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".service.ts")

	# Detect file operations without path validation
	file_ops := ["readFileSync", "writeFileSync", "readFile", "writeFile", "unlink"]
	some op in file_ops
	contains(file.diff, op)
	not contains(file.diff, "path.resolve")
	not contains(file.diff, "path.join")
	not regex.match(`\/\^[a-zA-Z0-9._-]+\$\/`, file.diff)

	not has_override("@override:input-validation")

	msg := sprintf(
		"OVERRIDE REQUIRED [Security/R13]: Path traversal risk in %s. Validate file paths before file operations. Use path.resolve() and verify path is within allowed directory. Add @override:input-validation with justification if intentional.",
		[file.path],
	)
}

# Violation 7: Missing size limits
deny contains msg if {
	input_valid
	some file in input.changed_files
	contains(file.path, "/dto/")
	endswith(file.path, ".dto.ts")

	# Detect string properties without max length
	contains(file.diff, "@IsString()")
	not contains(file.diff, "@MaxLength(")
	not contains(file.diff, "@Length(")

	not has_override("@override:input-validation")

	msg := sprintf(
		"OVERRIDE REQUIRED [Security/R13]: DTO in %s has string properties without size limits. Add @MaxLength() or @Length() decorators to prevent buffer overflow attacks. Add @override:input-validation with justification if intentional.",
		[file.path],
	)
}

# Warning: Missing sanitization for config objects
warn contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".service.ts")

	# Detect config storage without sanitization
	contains(file.diff, "config:")
	contains(file.diff, "update(")
	not contains(file.diff, "sanitizeConfig")
	not contains(file.diff, "validateConfig")

	msg := sprintf(
		"WARNING [Security/R13]: Config object in %s may not be sanitized. Consider using sanitizeConfig() to recursively sanitize config objects and prevent XSS in configuration data.",
		[file.path],
	)
}

# Warning: Generic validation error messages (UX concern)
warn contains msg if {
	input_valid
	some file in input.changed_files
	endswith(file.path, ".dto.ts")

	# Detect validation decorators without custom messages
	contains(file.diff, "@IsString()")
	not contains(file.diff, "message:")

	msg := sprintf(
		"WARNING [Security/R13]: DTO in %s has validation decorators without custom error messages. Add user-friendly messages to improve UX: @IsString({ message: 'Field must be a string' })",
		[file.path],
	)
}

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

# Get table name from regex matches
get_table_name(matches) := matches[0][1] if {
	count(matches) > 0
}

get_table_name(matches) := "unknown" if {
	count(matches) == 0
}

# Note: Local has_override() function implemented for consistency with backend.rego pattern
# =============================================================================
# PERFORMANCE NOTES
# =============================================================================
# - Early exit on file extension checks
# - Regex patterns compiled once
# - String matching optimized for common patterns
# - Target: <200ms per evaluation
