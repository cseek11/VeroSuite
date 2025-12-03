package test_trace

import rego.v1
import data.compliance.quality

test_security_warning_trace if {
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
    
    # Get warnings
    warnings := quality.additional_testing_warnings with input as mock_input
    
    # Check if any warning contains security
    security_warnings := {msg | msg := warnings[_]; contains(msg, "security")}
    
    # Should be empty (no warnings)
    count(security_warnings) == 0
}
