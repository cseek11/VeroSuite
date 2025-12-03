# Test Suite for Architecture Policy - R21 (File Organization)
#
# Tests all warning patterns and edge cases for R21
# Created: 2025-11-30
# Version: 1.0.0

package compliance.architecture_test

import data.compliance.architecture
import rego.v1

# =============================================================================
# R21: FILE ORGANIZATION TESTS
# =============================================================================

# Test 1: Happy Path - File in correct path passes
test_correct_path_passes if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "apps/api/src/users/users.service.ts",
			"diff": "export class UsersService {}",
		}],
		"pr_body": "Add users service",
	}
	count(result) == 0
}

# Test 2: Happy Path - Shared code in libs/common passes
test_shared_code_passes if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "libs/common/src/validators/email.validator.ts",
			"diff": "export function validateEmail(email: string): boolean { return true; }",
		}],
		"pr_body": "Add email validator",
	}
	count(result) == 0
}

# Test 3: R21-W01 - File in deprecated backend/src/ path
test_deprecated_backend_src_path if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "backend/src/auth/auth.service.ts",
			"diff": "export class AuthService {}",
		}],
		"pr_body": "Add auth service",
	}
	some warning in result
	contains(warning, "deprecated path")
	contains(warning, "backend/src/")
}

# Test 4: R21-W01 - File in deprecated backend/prisma/ path
test_deprecated_backend_prisma_path if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "backend/prisma/schema.prisma",
			"diff": "model User { id String }",
		}],
		"pr_body": "Add schema",
	}
	some warning in result
	contains(warning, "deprecated path")
	contains(warning, "backend/prisma/")
}

# Test 5: R21-W01 - File in root-level src/ path
test_root_level_src_path if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "src/components/Button.tsx",
			"diff": "export const Button = () => {}",
		}],
		"pr_body": "Add button",
	}
	some warning in result
	contains(warning, "root-level src/")
}

# Test 6: R21-W02 - New top-level directory not in approved list
test_unauthorized_top_level_directory if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "new-service/",
			"diff": "",
		}],
		"pr_body": "Add new service",
	}
	some warning in result
	contains(warning, "top-level directory")
	contains(warning, "not in approved list")
}

# Test 7: R21-W03 - Deprecated import path @verosuite/
test_deprecated_verosuite_import_ts if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "apps/api/src/users/users.service.ts",
			"diff": "import { validateEmail } from '@verosuite/common/validators';",
		}],
		"pr_body": "Add users service",
	}
	some warning in result
	contains(warning, "@verosuite/")
	contains(warning, "@verofield/common/*")
}

# Test 8: R21-W03 - Deprecated import path @verosuite/ in .tsx
test_deprecated_verosuite_import_tsx if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "frontend/src/components/Button.tsx",
			"diff": "import { Button } from '@verosuite/common/components';",
		}],
		"pr_body": "Add button",
	}
	some warning in result
	contains(warning, "@verosuite/")
	contains(warning, "@verofield/common/*")
}

# Test 9: R21-W04 - Cross-service relative import in .ts
test_cross_service_import_ts if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "apps/api/src/users/users.service.ts",
			"diff": "import { CrmService } from '../../../crm-ai/src/crm.service';",
		}],
		"pr_body": "Add users service",
	}
	some warning in result
	contains(warning, "Cross-service relative import")
	contains(warning, "libs/common/")
}

# Test 10: R21-W04 - Cross-service relative import in .tsx
test_cross_service_import_tsx if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "frontend/src/components/UserList.tsx",
			"diff": "import { CrmService } from '../../../crm-ai/src/crm.service';",
		}],
		"pr_body": "Add user list",
	}
	some warning in result
	contains(warning, "Cross-service relative import")
	contains(warning, "libs/common/")
}

# Test 11: R21-W05 - Component file naming violation (lowercase)
test_component_naming_violation if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "frontend/src/components/button.tsx",
			"diff": "export const Button = () => {}",
		}],
		"pr_body": "Add button",
	}
	some warning in result
	contains(warning, "PascalCase")
	contains(warning, "button.tsx")
}

# Test 12: R21-W06 - Utility file naming violation (PascalCase)
test_utility_naming_violation if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "libs/common/src/utils/FormatDate.ts",
			"diff": "export function formatDate(date: Date): string { return ''; }",
		}],
		"pr_body": "Add date formatter",
	}
	some warning in result
	contains(warning, "camelCase")
	contains(warning, "FormatDate.ts")
}

# Test 13: R21-W07 - Directory depth exceeds limit
test_directory_depth_violation if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "apps/api/src/deep/nested/structure/file.ts",
			"diff": "export const deep = {};",
		}],
		"pr_body": "Add deep file",
	}
	some warning in result
	contains(warning, "Directory depth")
	contains(warning, "exceeds recommended limit")
}

# Test 14: R21-W08 - Component in wrong location (not in ui/)
test_component_wrong_location if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "frontend/src/components/Button.tsx",
			"diff": "export const Button = () => {}",
		}],
		"pr_body": "Add button",
	}
	some warning in result
	contains(warning, "frontend/src/components/ui/")
	contains(warning, "reusable component")
}

# Test 15: R21-W09 - Deep relative import in .ts
test_deep_relative_import_ts if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "apps/api/src/users/users.service.ts",
			"diff": "import { helper } from '../../../../libs/common/src/utils/helper';",
		}],
		"pr_body": "Add users service",
	}
	some warning in result
	contains(warning, "Deep relative import")
	contains(warning, "monorepo import paths")
}

# Test 16: R21-W09 - Deep relative import in .tsx
test_deep_relative_import_tsx if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "frontend/src/components/UserList.tsx",
			"diff": "import { Button } from '../../../../components/ui/Button';",
		}],
		"pr_body": "Add user list",
	}
	some warning in result
	contains(warning, "Deep relative import")
	contains(warning, "monorepo import paths")
}

# Test 17: Edge case - Approved top-level directory passes
test_approved_top_level_directory_passes if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "apps/api/src/users/users.service.ts",
			"diff": "export class UsersService {}",
		}],
		"pr_body": "Add users service",
	}
	count(result) == 0
}

# Test 18: Edge case - File in frontend/src/components/ui/ passes
test_component_in_ui_passes if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "frontend/src/components/ui/Button.tsx",
			"diff": "export const Button = () => {}",
		}],
		"pr_body": "Add button",
	}
	count(result) == 0
}

# Test 19: Edge case - Correct import path passes
test_correct_import_path_passes if {
	result := architecture.warn with input as {
		"changed_files": [{
			"path": "apps/api/src/users/users.service.ts",
			"diff": "import { validateEmail } from '@verofield/common/validators';",
		}],
		"pr_body": "Add users service",
	}
	count(result) == 0
}
