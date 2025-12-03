package test_warnings_output

import rego.v1
import data.compliance.quality

test_security_warnings_output if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/auth/auth.service.ts",
                "status": "modified",
                "content": "async function login() { ... }",
            },
            {
                "path": "apps/api/src/auth/auth.service.spec.ts",
                "content": "it('should test authentication', ...); it('should verify authorization', ...); it('should validate input validation', ...); it('should test security', ...)",
            },
        ]
    }
    
    # Get all warnings
    warnings := quality.additional_testing_warnings with input as mock_input
    
    # Print all warnings for debugging
    trace(sprintf("Total warnings: %d", [count(warnings)]))
    some msg in warnings
    trace(sprintf("Warning: %v", [msg]))
    
    # Check specifically for security warnings
    security_warnings := {msg | msg := warnings[_]; contains(msg, "security")}
    trace(sprintf("Security warnings count: %d", [count(security_warnings)]))
    
    # Should be empty
    count(security_warnings) == 0
}
