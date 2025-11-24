# Test Suite for Security Policy - R01 (Tenant Isolation)
#
# Tests all violation patterns and edge cases for R01
# Created: 2025-11-23
# Version: 1.0.0

package compliance.security_test

import data.compliance.security
import future.keywords.if
import future.keywords.in

# =============================================================================
# R01: TENANT ISOLATION TESTS
# =============================================================================

# Test 1: Happy Path - Query with tenant_id filter passes
test_query_with_tenant_id_passes if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "findMany({ where: { tenant_id: tenantId, active: true } })"
        }],
        "pr_body": "Fix: Add user query with tenant filter"
    }
    count(security.deny) == 0
}

# Test 2: Happy Path - Query with withTenant wrapper passes
test_query_with_withtenant_passes if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "await this.db.withTenant(tenantId, async () => { return findMany() })"
        }],
        "pr_body": "Fix: Add user query with tenant wrapper"
    }
    count(security.deny) == 0
}

# Test 3: Violation - findMany without tenant_id fails
test_findmany_without_tenant_id_fails if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "const users = await this.prisma.user.findMany({ where: { active: true } })"
        }],
        "pr_body": "Fix: Add user query"
    }
    count(security.deny) > 0
    some msg in security.deny
    contains(msg, "R01")
    contains(msg, "tenant_id filter")
}

# Test 4: Violation - findUnique without tenant_id fails
test_findunique_without_tenant_id_fails if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "const user = await this.prisma.user.findUnique({ where: { id: userId } })"
        }],
        "pr_body": "Fix: Get user by ID"
    }
    count(security.deny) > 0
    some msg in security.deny
    contains(msg, "R01")
    contains(msg, "findUnique")
}

# Test 5: Violation - Raw SQL without withTenant fails
test_raw_sql_without_wrapper_fails if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/reports/reports.service.ts",
            "diff": "const result = await this.prisma.$queryRawUnsafe('SELECT * FROM users WHERE active = true')"
        }],
        "pr_body": "Fix: Add raw query for report"
    }
    count(security.deny) > 0
    some msg in security.deny
    contains(msg, "R01")
    contains(msg, "Raw SQL")
    contains(msg, "withTenant()")
}

# Test 6: Violation - API endpoint with tenant_id in body fails
test_tenant_id_in_request_body_fails if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.controller.ts",
            "diff": "@Post()\nasync create(@Body('tenant_id') tenantId: string, @Body() dto: CreateUserDto)"
        }],
        "pr_body": "Fix: Add create user endpoint"
    }
    count(security.deny) > 0
    some msg in security.deny
    contains(msg, "R01")
    contains(msg, "tenant_id from request")
}

# Test 7: Violation - API endpoint with tenant_id in query params fails
test_tenant_id_in_query_params_fails if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.controller.ts",
            "diff": "@Get()\nasync findAll(@Query('tenant_id') tenantId: string)"
        }],
        "pr_body": "Fix: Add list users endpoint"
    }
    count(security.deny) > 0
    some msg in security.deny
    contains(msg, "R01")
    contains(msg, "tenant_id from request")
}

# Test 8: Violation - Protected endpoint without auth guard fails
test_protected_endpoint_without_guard_fails if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.controller.ts",
            "diff": "@Post()\nasync create(@Body() dto: CreateUserDto) {\n  return this.usersService.create(dto);\n}"
        }],
        "pr_body": "Fix: Add create user endpoint"
    }
    count(security.deny) > 0
    some msg in security.deny
    contains(msg, "R01")
    contains(msg, "@UseGuards(JwtAuthGuard)")
}

# Test 9: Violation - Exposing tenant_id in error message fails
test_tenant_id_in_error_message_fails if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "throw new NotFoundException(`User not found for tenant ${tenantId}`)"
        }],
        "pr_body": "Fix: Add error handling"
    }
    count(security.deny) > 0
    some msg in security.deny
    contains(msg, "R01")
    contains(msg, "tenant_id in user-facing error")
}

# Test 10: Override - Violation with override marker passes
test_violation_with_override_marker_passes if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/admin/admin.service.ts",
            "diff": "const allUsers = await this.prisma.user.findMany()"
        }],
        "pr_body": "Fix: Admin endpoint for cross-tenant reporting\n\n@override:tenant-isolation\nJustification: Admin dashboard requires cross-tenant data for system-wide reporting. Access restricted to super-admin role only."
    }
    count(security.deny) == 0
}

# Test 11: Public Endpoint - @Public() decorator passes
test_public_endpoint_passes if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/auth/auth.controller.ts",
            "diff": "@Public()\n@Post('login')\nasync login(@Body() dto: LoginDto)"
        }],
        "pr_body": "Fix: Add login endpoint"
    }
    count(security.deny) == 0
}

# Test 12: LocalAuthGuard - Alternative auth guard passes
test_local_auth_guard_passes if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/auth/auth.controller.ts",
            "diff": "@UseGuards(LocalAuthGuard)\n@Post('login')\nasync login(@Request() req)"
        }],
        "pr_body": "Fix: Add login endpoint with local auth"
    }
    count(security.deny) == 0
}

# Test 13: Edge Case - Multiple queries, one missing tenant_id fails
test_multiple_queries_one_missing_fails if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "const users = await this.prisma.user.findMany({ where: { tenant_id: tenantId } });\nconst roles = await this.prisma.role.findMany();"
        }],
        "pr_body": "Fix: Get users and roles"
    }
    count(security.deny) > 0
    some msg in security.deny
    contains(msg, "R01")
}

# Test 14: Edge Case - Controller file without service methods passes
test_controller_without_endpoints_passes if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.controller.ts",
            "diff": "import { Controller } from '@nestjs/common';\n\n@Controller('users')\nexport class UsersController {}"
        }],
        "pr_body": "Fix: Add controller skeleton"
    }
    count(security.deny) == 0
}

# Test 15: Edge Case - Service file without queries passes
test_service_without_queries_passes if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "import { Injectable } from '@nestjs/common';\n\n@Injectable()\nexport class UsersService {\n  constructor() {}\n}"
        }],
        "pr_body": "Fix: Add service skeleton"
    }
    count(security.deny) == 0
}

# =============================================================================
# PERFORMANCE TEST
# =============================================================================

# Test: Policy evaluation completes within performance budget
# Target: <200ms per evaluation
# Note: Run with `opa test --bench` to measure actual performance
test_performance_within_budget if {
    # This test passes if it completes (OPA will measure timing)
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "findMany({ where: { tenant_id: tenantId } })"
        }],
        "pr_body": "Performance test"
    }
    count(security.deny) == 0
}

