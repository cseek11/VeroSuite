package compliance.security_test

import data.compliance.security
import rego.v1

# =============================================================================
# R12: SECURITY EVENT LOGGING TESTS
# =============================================================================

# Test 1: Authentication event without logging (violation)
test_auth_event_without_logging if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/auth/auth.service.ts",
			"diff": "async login(email: string, password: string) {\n  const user = await this.validateCredentials(email, password);\n  return this.generateToken(user);\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 1 with input as mock_input

	# Verify error message
	violation := [msg | msg := security.deny[_]][0]
	contains(violation, "OVERRIDE REQUIRED [Security/R12]")
	contains(violation, "Authentication event")
	contains(violation, "not logged")
}

# Test 2: Authentication event with logging (no violation)
test_auth_event_with_logging if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/auth/auth.service.ts",
			"diff": "async login(email: string, password: string, ip: string) {\n  const user = await this.validateCredentials(email, password);\n  await this.auditService.log({\n    action: 'USER_LOGIN_SUCCESS',\n    userId: user.id,\n    tenantId: user.tenant_id,\n    ipAddress: ip\n  });\n  return this.generateToken(user);\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 0 with input as mock_input
}

# Test 3: Authorization event without logging (violation)
test_authz_event_without_logging if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/permissions/permissions.service.ts",
			"diff": "async checkPermission(userId: string, resource: string) {\n  const hasPermission = await this.hasPermission(userId, resource);\n  if (!hasPermission) {\n    throw new ForbiddenException('Access denied');\n  }\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 1 with input as mock_input

	violation := [msg | msg := security.deny[_]][0]
	contains(violation, "Authorization event")
	contains(violation, "not logged")
}

# Test 4: Authorization event with logging (no violation)
test_authz_event_with_logging if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/permissions/permissions.service.ts",
			"diff": "async checkPermission(userId: string, resource: string) {\n  const hasPermission = await this.hasPermission(userId, resource);\n  if (!hasPermission) {\n    await this.auditService.log({\n      action: 'PERMISSION_DENIED',\n      userId: userId,\n      resourceType: resource,\n      requiredPermission: 'read'\n    });\n    throw new ForbiddenException('Access denied');\n  }\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 0 with input as mock_input
}

# Test 5: PII access in privileged context without logging (violation)
test_pii_access_without_logging if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/admin/admin.service.ts",
			"diff": "@Admin()\nasync getUserDetails(userId: string) {\n  return this.prisma.user.findUnique({\n    where: { id: userId },\n    select: { email: true, ssn: true, phone: true }\n  });\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 1 with input as mock_input

	violation := [msg | msg := security.deny[_]][0]
	contains(violation, "PII access")
	contains(violation, "privileged context")
	contains(violation, "not logged")
}

# Test 6: PII access with logging (no violation)
test_pii_access_with_logging if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/admin/admin.service.ts",
			"diff": "@Admin()\nasync getUserDetails(userId: string) {\n  await this.auditService.log({\n    action: 'PII_ACCESS',\n    userId: this.requestContext.getUserId(),\n    resourceType: 'User',\n    resourceId: userId,\n    dataTypes: ['email', 'ssn', 'phone']\n  });\n  return this.prisma.user.findUnique({\n    where: { id: userId },\n    select: { email: true, ssn: true, phone: true }\n  });\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 0 with input as mock_input
}

# Test 7: Security policy change without logging (violation)
test_policy_change_without_logging if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/permissions/permissions.service.ts",
			"diff": "async assignRole(userId: string, role: string) {\n  return this.prisma.userRole.create({\n    data: { userId, role }\n  });\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 1 with input as mock_input

	violation := [msg | msg := security.deny[_]][0]
	contains(violation, "Security policy change")
	contains(violation, "not logged")
}

# Test 8: Security policy change with logging (no violation)
test_policy_change_with_logging if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/permissions/permissions.service.ts",
			"diff": "async assignRole(userId: string, role: string) {\n  await this.auditService.log({\n    action: 'ROLE_ASSIGNED',\n    userId: this.requestContext.getUserId(),\n    resourceType: 'UserRole',\n    afterState: { userId, role }\n  });\n  return this.prisma.userRole.create({\n    data: { userId, role }\n  });\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 0 with input as mock_input
}

# Test 9: Admin action without logging (violation)
test_admin_action_without_logging if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/admin/admin.service.ts",
			"diff": "async impersonate(targetUserId: string) {\n  const token = await this.generateImpersonationToken(targetUserId);\n  return token;\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 1 with input as mock_input

	violation := [msg | msg := security.deny[_]][0]
	contains(violation, "Admin action")
	contains(violation, "not logged")
}

# Test 10: Admin action with logging (no violation)
test_admin_action_with_logging if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/admin/admin.service.ts",
			"diff": "async impersonate(targetUserId: string) {\n  await this.auditService.log({\n    action: 'USER_IMPERSONATION',\n    userId: this.requestContext.getUserId(),\n    resourceType: 'User',\n    targetUserId: targetUserId,\n    ipAddress: this.requestContext.getIpAddress()\n  });\n  const token = await this.generateImpersonationToken(targetUserId);\n  return token;\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 0 with input as mock_input
}

# Test 11: Financial transaction without logging (warning)
test_financial_transaction_without_logging if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/payments/payments.service.ts",
			"diff": "async processPayment(amount: number, currency: string) {\n  const payment = await this.stripe.charge(amount, currency);\n  return payment;\n}",
		}],
		"pr_body": "",
	}

	count(security.warn) == 1 with input as mock_input

	warning := [msg | msg := security.warn[_]][0]
	contains(warning, "WARNING [Security/R12]")
	contains(warning, "Financial transaction")
}

# Test 12: Financial transaction with logging (no warning)
test_financial_transaction_with_logging if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/payments/payments.service.ts",
			"diff": "async processPayment(amount: number, currency: string) {\n  const payment = await this.stripe.charge(amount, currency);\n  await this.auditService.log({\n    action: 'PAYMENT_PROCESSED',\n    userId: this.requestContext.getUserId(),\n    amount: amount,\n    currency: currency,\n    transactionId: payment.id\n  });\n  return payment;\n}",
		}],
		"pr_body": "",
	}

	count(security.warn) == 0 with input as mock_input
}

# Test 13: Raw PII in audit log (warning)
test_raw_pii_in_audit_log if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/users/users.service.ts",
			"diff": "await this.auditService.log({\n  action: 'USER_UPDATED',\n  afterState: {\n    email: 'user@example.com',\n    ssn: '123-45-6789'\n  }\n});",
		}],
		"pr_body": "",
	}

	count(security.warn) >= 1 with input as mock_input

	warning := [msg | msg := security.warn[_]; contains(msg, "Raw PII")][0]
	contains(warning, "WARNING [Security/R12]")
	contains(warning, "Potential raw PII")
}

# Test 14: Metadata-only audit log (no warning)
test_metadata_only_audit_log if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/users/users.service.ts",
			"diff": "await this.auditService.log({\n  action: 'USER_UPDATED',\n  afterState: {\n    fieldsUpdated: ['email', 'phone'],\n    dataTypes: ['email', 'ssn']\n  }\n});",
		}],
		"pr_body": "",
	}

	# Should not trigger raw PII warning
	warnings := [msg | msg := security.warn[_]; contains(msg, "Raw PII")]
	count(warnings) == 0 with input as mock_input
}

# Test 15: Override marker bypasses violation
test_override_marker_bypasses_violation if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/auth/auth.service.ts",
			"diff": "async login(email: string, password: string) {\n  const user = await this.validateCredentials(email, password);\n  return this.generateToken(user);\n}",
		}],
		"pr_body": "@override:security-logging - Public endpoint, no logging needed per security review",
	}

	count(security.deny) == 0 with input as mock_input
}

# Test 16: Multiple security events in one file
test_multiple_security_events if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/auth/auth.service.ts",
			"diff": "async login(email: string, password: string) {\n  const user = await this.validateCredentials(email, password);\n  return this.generateToken(user);\n}\n\nasync logout(userId: string) {\n  await this.revokeToken(userId);\n}",
		}],
		"pr_body": "",
	}

	# Should detect both login and logout without logging
	count(security.deny) >= 2 with input as mock_input
}

# Test 17: SQL policy change without logging (violation)
test_sql_policy_change_without_logging if {
	mock_input := {
		"changed_files": [{
			"path": "libs/common/prisma/migrations/20251123_add_policy.sql",
			"diff": "ALTER TABLE users ENABLE ROW LEVEL SECURITY;\nCREATE POLICY tenant_isolation ON users USING (tenant_id::text = current_setting('app.tenant_id', true));",
		}],
		"pr_body": "",
	}

	count(security.deny) >= 1 with input as mock_input

	violation := [msg | msg := security.deny[_]; contains(msg, "Security policy change")][0]
	contains(violation, "not logged")
}

# Test 18: Password change without logging (violation)
test_password_change_without_logging if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/auth/auth.service.ts",
			"diff": "async changePassword(userId: string, newPassword: string) {\n  const hashed = await bcrypt.hash(newPassword, 10);\n  return this.prisma.user.update({\n    where: { id: userId },\n    data: { password: hashed }\n  });\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 1 with input as mock_input

	violation := [msg | msg := security.deny[_]][0]
	contains(violation, "Authentication event")
}

# Test 19: Password change with logging (no violation)
test_password_change_with_logging if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/auth/auth.service.ts",
			"diff": "async changePassword(userId: string, newPassword: string) {\n  const hashed = await bcrypt.hash(newPassword, 10);\n  await this.auditService.log({\n    action: 'PASSWORD_CHANGED',\n    userId: userId,\n    ipAddress: this.requestContext.getIpAddress()\n  });\n  return this.prisma.user.update({\n    where: { id: userId },\n    data: { password: hashed }\n  });\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 0 with input as mock_input
}

# Test 20: Non-security file (no violation)
test_non_security_file if {
	mock_input := {
		"changed_files": [{
			"path": "apps/api/src/customers/customers.service.ts",
			"diff": "async findAll(tenantId: string) {\n  return this.prisma.customer.findMany({\n    where: { tenant_id: tenantId }\n  });\n}",
		}],
		"pr_body": "",
	}

	count(security.deny) == 0 with input as mock_input
}
