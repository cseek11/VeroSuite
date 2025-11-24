package compliance.architecture_test

import data.compliance.architecture
import future.keywords.if

# ============================================================================
# DEBUG TEST SUITE - R21 File Organization
# Purpose: Diagnose why all R21 tests are failing
# ============================================================================

# Test 1: Verify input data structure
test_debug_input_structure if {
    input_data := {
        "changed_files": [{
            "path": "backend/src/test.ts",
            "diff": "test content"
        }]
    }
    
    # This should work - just accessing input
    count(input_data.changed_files) == 1
    
    file := input_data.changed_files[0]
    file.path == "backend/src/test.ts"
    file.diff == "test content"
}

# Test 2: Verify basic string operations
test_debug_string_operations if {
    path := "backend/src/test.ts"
    startswith(path, "backend/src/")
    
    diff := "import { test } from '@verosuite/common';"
    contains(diff, "@verosuite/")
}

# Test 3: Verify set operations
test_debug_set_operations if {
    # Create a simple set
    test_set := {msg | msg := "warning1"} | {msg | msg := "warning2"}
    count(test_set) == 2
}

# Test 4: Verify rule evaluation with explicit input
test_debug_rule_evaluation if {
    warnings := architecture.file_organization_warnings with input as {
        "changed_files": [{
            "path": "backend/src/test.ts",
            "diff": "test"
        }]
    }
    
    # Print what we got
    trace(sprintf("Got %d warnings", [count(warnings)]))
    count(warnings) > 0
}

# Test 5: Direct rule check
test_debug_direct_rule if {
    # Directly evaluate the condition
    file := {"path": "backend/src/test.ts", "diff": "test"}
    startswith(file.path, "backend/src/")
}

# Test 6: Check if file_organization_warnings is accessible
test_debug_warnings_accessible if {
    # Try to access the rule directly
    warnings := architecture.file_organization_warnings with input as {
        "changed_files": [{
            "path": "backend/src/auth/auth.service.ts",
            "diff": "export class AuthService {}"
        }],
        "pr_body": "Add auth service"
    }
    
    trace(sprintf("file_organization_warnings count: %d", [count(warnings)]))
    trace(sprintf("file_organization_warnings: %v", [warnings]))
}

# Test 7: Check if warn rule works
test_debug_warn_accessible if {
    result := architecture.warn with input as {
        "changed_files": [{
            "path": "backend/src/auth/auth.service.ts",
            "diff": "export class AuthService {}"
        }],
        "pr_body": "Add auth service"
    }
    
    trace(sprintf("warn count: %d", [count(result)]))
    trace(sprintf("warn: %v", [result]))
}

# Test 8: Verify the exact condition from failing test
test_debug_exact_condition if {
    test_input := {
        "changed_files": [{
            "path": "backend/src/auth/auth.service.ts",
            "diff": "export class AuthService {}"
        }],
        "pr_body": "Add auth service"
    }
    
    # Manually check the condition
    file := test_input.changed_files[0]
    trace(sprintf("file.path: '%s'", [file.path]))
    trace(sprintf("startswith check: %v", [startswith(file.path, "backend/src/")]))
    
    # This should be true
    startswith(file.path, "backend/src/")
}

# Test 9: Check regex patterns
test_debug_regex_patterns if {
    diff := "import { CrmService } from '../../../crm-ai/src/crm.service';"
    
    # Test the regex pattern
    pattern := `import\s+.*\s+from\s+['"](\.\./){3,}[^'"]+`
    result := regex.match(pattern, diff)
    
    trace(sprintf("Regex pattern: %s", [pattern]))
    trace(sprintf("Test string: %s", [diff]))
    trace(sprintf("Regex match result: %v", [result]))
    
    result == true
}

# Test 10: Check contains function
test_debug_contains_function if {
    diff := "import { Button } from '@verosuite/common/components';"
    
    trace(sprintf("diff: '%s'", [diff]))
    trace(sprintf("contains @verosuite/: %v", [contains(diff, "@verosuite/")]))
    
    contains(diff, "@verosuite/")
}



