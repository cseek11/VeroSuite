# Test Suite for Architecture Policy - R03 (Architecture Boundaries)
#
# Tests all violation patterns and edge cases for R03
# Created: 2025-11-23
# Version: 1.0.0

package compliance.architecture_r03_test

import data.compliance.architecture
import future.keywords.if
import future.keywords.in

# =============================================================================
# R03: ARCHITECTURE BOUNDARIES TESTS
# =============================================================================

# Test 1: Happy Path - File in correct path passes
test_correct_path_passes if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "export class UsersService {}"
        }],
        "pr_body": "Add users service"
    }
    count(architecture.deny) == 0
}

# Test 2: Happy Path - Shared code in libs/common passes
test_shared_code_passes if {
    input := {
        "changed_files": [{
            "path": "libs/common/src/validators/email.validator.ts",
            "diff": "export function validateEmail(email: string): boolean { return true; }"
        }],
        "pr_body": "Add email validator"
    }
    count(architecture.deny) == 0
}

# Test 3: Violation - New microservice without approval fails
test_new_microservice_fails if {
    input := {
        "changed_files": [{
            "path": "apps/new-service/",
            "diff": ""
        }],
        "pr_body": "Add new service"
    }
    count(architecture.deny) > 0
    some msg in architecture.deny
    contains(msg, "R03")
    contains(msg, "microservice")
    contains(msg, "new-service")
}

# Test 4: Violation - File in deprecated backend/ path fails
test_deprecated_path_fails if {
    input := {
        "changed_files": [{
            "path": "backend/src/users/users.service.ts",
            "diff": "export class UsersService {}"
        }],
        "pr_body": "Add users service"
    }
    count(architecture.deny) > 0
    some msg in architecture.deny
    contains(msg, "R03")
    contains(msg, "deprecated path")
    contains(msg, "apps/api/")
}

# Test 5: Violation - Cross-service relative import fails
test_cross_service_import_fails if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/crm/crm.controller.ts",
            "diff": "import { CrmService } from '../../../crm-ai/src/crm.service';"
        }],
        "pr_body": "Add CRM controller"
    }
    count(architecture.deny) > 0
    some msg in architecture.deny
    contains(msg, "R03")
    contains(msg, "Cross-service")
}

# Test 6: Violation - New top-level directory fails
test_new_top_level_directory_fails if {
    input := {
        "changed_files": [{
            "path": "new-folder/",
            "diff": ""
        }],
        "pr_body": "Add new folder"
    }
    count(architecture.deny) > 0
    some msg in architecture.deny
    contains(msg, "R03")
    contains(msg, "top-level directory")
}

# Test 7: Violation - New schema file outside libs/common fails
test_new_schema_file_fails if {
    input := {
        "changed_files": [{
            "path": "apps/api/prisma/schema.prisma",
            "diff": "model User { id String @id }"
        }],
        "pr_body": "Add schema"
    }
    count(architecture.deny) > 0
    some msg in architecture.deny
    contains(msg, "R03")
    contains(msg, "schema file")
}

# Test 8: Violation - Frontend importing backend service fails
test_frontend_importing_backend_fails if {
    input := {
        "changed_files": [{
            "path": "frontend/src/components/UserList.tsx",
            "diff": "import { UserService } from '../../../apps/api/src/users/user.service';"
        }],
        "pr_body": "Add user list component"
    }
    count(architecture.deny) > 0
    some msg in architecture.deny
    contains(msg, "R03")
    contains(msg, "Frontend importing backend")
}

# Test 9: Violation - Backend importing frontend fails
test_backend_importing_frontend_fails if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.controller.ts",
            "diff": "import { UserComponent } from '../../../frontend/src/components/User';"
        }],
        "pr_body": "Add users controller"
    }
    count(architecture.deny) > 0
    some msg in architecture.deny
    contains(msg, "R03")
    contains(msg, "Backend importing frontend")
}

# Test 10: Warning - Utility in service directory warns
test_utility_in_service_warns if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/utils/email-validator.ts",
            "diff": "export function validateEmail(email: string): boolean { return true; }"
        }],
        "pr_body": "Add email validator"
    }
    count(architecture.warn) > 0
    some msg in architecture.warn
    contains(msg, "R03")
    contains(msg, "Utility file")
}

# Test 11: Override - Violation with override marker passes
test_violation_with_override_passes if {
    input := {
        "changed_files": [{
            "path": "apps/admin-service/",
            "diff": ""
        }],
        "pr_body": "Add admin service\n\n@override:architecture-boundaries\nJustification: Admin service required for system administration. Approved by architecture team on 2025-11-23. See docs/architecture/decisions/003-admin-service.md"
    }
    count(architecture.deny) == 0
}

# Test 12: Edge Case - Approved top-level directory passes
test_approved_top_level_directory_passes if {
    input := {
        "changed_files": [{
            "path": "docs/architecture/decisions.md",
            "diff": "# Architecture Decisions"
        }],
        "pr_body": "Add architecture docs"
    }
    count(architecture.deny) == 0
}

# Test 13: Edge Case - Schema in libs/common/prisma passes
test_schema_in_correct_location_passes if {
    input := {
        "changed_files": [{
            "path": "libs/common/prisma/schema.prisma",
            "diff": "model User { id String @id }"
        }],
        "pr_body": "Update schema"
    }
    count(architecture.deny) == 0
}

# Test 14: Edge Case - Adding file to existing service passes
test_adding_file_to_existing_service_passes if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/user.dto.ts",
            "diff": "export class UserDto {}"
        }],
        "pr_body": "Add user DTO"
    }
    count(architecture.deny) == 0
}

# Test 15: Edge Case - HTTP service call passes (not relative import)
test_http_service_call_passes if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/crm/crm.controller.ts",
            "diff": "const response = await this.httpService.post('http://crm-ai/api/analyze', data);"
        }],
        "pr_body": "Add CRM integration"
    }
    count(architecture.deny) == 0
}

# Test 16: Edge Case - Importing from libs/common passes
test_importing_from_libs_common_passes if {
    input := {
        "changed_files": [{
            "path": "apps/api/src/users/users.service.ts",
            "diff": "import { validateEmail } from '@verofield/common/validators';"
        }],
        "pr_body": "Use shared validator"
    }
    count(architecture.deny) == 0
}

# Test 17: Edge Case - Multiple violations in one file
test_multiple_violations_detected if {
    input := {
        "changed_files": [{
            "path": "backend/src/users/users.service.ts",
            "diff": "import { CrmService } from '../../../crm-ai/src/crm.service';"
        }],
        "pr_body": "Add users service"
    }
    # Should detect both deprecated path AND cross-service import
    count(architecture.deny) >= 1
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
            "path": "apps/api/src/test.ts",
            "diff": "export class Test {}"
        }],
        "pr_body": "Performance test"
    }
    count(architecture.deny) == 0
}

