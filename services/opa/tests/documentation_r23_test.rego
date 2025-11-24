# Test Suite for Documentation Policy - R23 (Naming Conventions)
#
# Tests all warning patterns and edge cases for R23
# Created: 2025-11-23
# Version: 1.0.0

package documentation_r23_test

import data.compliance.documentation
import future.keywords.if
import future.keywords.in

# =============================================================================
# R23: NAMING CONVENTIONS TESTS
# =============================================================================

# Test 1: Happy path - Component with PascalCase
test_component_with_pascal_case_passes if {
    result := documentation.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/components/ui/Button.tsx",
                "diff": "export const Button = () => { return <button>Click</button>; };"
            }
        ]
    }
    count(result) == 0
}

# Test 2: Happy path - Function with camelCase
test_function_with_camel_case_passes if {
    result := documentation.warn with input as {
        "changed_files": [
            {
                "path": "apps/api/src/users/userService.ts",
                "diff": "export async function getUserById(id: string) { return {}; }"
            }
        ]
    }
    count(result) == 0
}

# Test 3: Happy path - Constant with UPPER_SNAKE_CASE
test_constant_with_upper_snake_case_passes if {
    result := documentation.warn with input as {
        "changed_files": [
            {
                "path": "apps/api/src/config/constants.ts",
                "diff": "export const MAX_FILE_SIZE = 5 * 1024 * 1024;"
            }
        ]
    }
    count(result) == 0
}

# Test 4: Warning - Component not PascalCase (lowercase)
test_component_not_pascal_case_lowercase if {
    result := documentation.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/components/ui/button.tsx",
                "diff": "export const Button = () => { return <button>Click</button>; };"
            }
        ]
    }
    some warning in result
    contains(warning, "Component file")
    contains(warning, "PascalCase")
    contains(warning, "button.tsx")
}

# Test 5: Warning - Component not PascalCase (camelCase)
test_component_not_pascal_case_camelcase if {
    result := documentation.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/components/ui/workOrderForm.tsx",
                "diff": "export const WorkOrderForm = () => { return <form></form>; };"
            }
        ]
    }
    some warning in result
    contains(warning, "Component file")
    contains(warning, "PascalCase")
    contains(warning, "workOrderForm.tsx")
}

# Test 6: Warning - Function not camelCase (PascalCase)
test_function_not_camel_case_pascalcase if {
    result := documentation.warn with input as {
        "changed_files": [
            {
                "path": "apps/api/src/users/UserService.ts",
                "diff": "export async function GetUserById(id: string) { return {}; }"
            }
        ]
    }
    some warning in result
    contains(warning, "Utility file")
    contains(warning, "camelCase")
    contains(warning, "UserService.ts")
}

# Test 7: Warning - Config file not kebab-case
test_config_not_kebab_case if {
    result := documentation.warn with input as {
        "changed_files": [
            {
                "path": "apps/api/config/appConfig.json",
                "diff": "{\"key\": \"value\"}"
            }
        ]
    }
    some warning in result
    contains(warning, "Config file")
    contains(warning, "kebab-case")
    contains(warning, "appConfig.json")
}

# Test 8: Warning - Old naming: VeroSuite (case-insensitive)
test_old_naming_verosuite if {
    result := documentation.warn with input as {
        "changed_files": [
            {
                "path": "apps/api/src/config/app.config.ts",
                "diff": "export const VeroSuiteConfig = { name: 'VeroSuite' };"
            }
        ]
    }
    some warning in result
    contains(warning, "Old naming pattern")
    contains(warning, "VeroSuite")
    contains(warning, "VeroField")
}

# Test 9: Warning - Old naming: @verosuite/* (case-insensitive)
test_old_naming_verosuite_import if {
    result := documentation.warn with input as {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "diff": "import { Service } from '@verosuite/common/auth';"
            }
        ]
    }
    some warning in result
    contains(warning, "Old naming pattern")
    contains(warning, "@verosuite")
    contains(warning, "@verofield")
}

# Test 10: Warning - Old naming: lowercase variation
test_old_naming_lowercase_variation if {
    result := documentation.warn with input as {
        "changed_files": [
            {
                "path": "apps/api/src/config/app.config.ts",
                "diff": "// TODO: Remove verosuite references"
            }
        ]
    }
    some warning in result
    contains(warning, "Old naming pattern")
}

# Test 11: Warning - Directory not lowercase/kebab-case
test_directory_not_lowercase if {
    result := documentation.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/components/WorkOrders/",
                "diff": ""
            }
        ]
    }
    some warning in result
    contains(warning, "Directory")
    contains(warning, "lowercase or kebab-case")
}

# Test 12: Edge case - Type with PascalCase (should pass)
test_type_with_pascal_case_passes if {
    result := documentation.warn with input as {
        "changed_files": [
            {
                "path": "apps/api/src/types/user.types.ts",
                "diff": "export interface User { id: string; name: string; }"
            }
        ]
    }
    count(result) == 0
}

# Test 13: Edge case - Config file with kebab-case (should pass)
test_config_with_kebab_case_passes if {
    result := documentation.warn with input as {
        "changed_files": [
            {
                "path": "apps/api/config/app-config.json",
                "diff": "{\"key\": \"value\"}"
            }
        ]
    }
    count(result) == 0
}

# Test 14: Edge case - Directory with kebab-case (should pass)
test_directory_with_kebab_case_passes if {
    result := documentation.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/components/work-orders/",
                "diff": ""
            }
        ]
    }
    count(result) == 0
}

# Test 15: Edge case - Multiple violations in same file
test_multiple_violations_same_file if {
    result := documentation.warn with input as {
        "changed_files": [
            {
                "path": "frontend/src/components/ui/button.tsx",
                "diff": "import { Service } from '@verosuite/common'; export const Button = () => {};"
            }
        ]
    }
    count(result) >= 2
}

