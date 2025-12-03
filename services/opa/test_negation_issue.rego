package test_negation

import rego.v1
import data.compliance.quality

# Test: Check if the issue is with how "some file" iterates
test_security_iteration_issue if {
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
	
	# Check each file individually
	source_file := mock_input.changed_files[0]
	test_file := mock_input.changed_files[1]
	
	# Source file should need security tests
	needs_security_source := quality.needs_security_tests(source_file) with input as mock_input
	
	# Test file should NOT need security tests (it's a test file)
	needs_security_test := quality.needs_security_tests(test_file) with input as mock_input
	
	# Source file should have security tests (test file exists)
	has_security_source := quality.has_security_tests(source_file.path, mock_input.changed_files) with input as mock_input
	
	# The warning should NOT be generated because has_security_source is true
	needs_security_source
	has_security_source
	not needs_security_test  # Test file doesn't need security tests
}

# Test: Check if the issue is with the "not has_security_tests" evaluation
test_security_negation_evaluation if {
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
	
	source_file := mock_input.changed_files[0]
	
	# Check if has_security_tests returns true
	has_security := quality.has_security_tests(source_file.path, mock_input.changed_files) with input as mock_input
	
	# Check if not has_security_tests returns false (when has_security is true)
	# This should be false, preventing the warning
	# If has_security is true, then the warning condition (needs_security AND not has_security) should be false
	has_security
}

# Test: Simulate the exact policy condition
test_security_policy_condition if {
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
	
	# Simulate: some file in input.changed_files
	source_file := mock_input.changed_files[0]
	
	# Check: needs_security_tests(file)
	needs_security := quality.needs_security_tests(source_file) with input as mock_input
	
	# Check: not has_security_tests(file.path, input.changed_files)
	has_security := quality.has_security_tests(source_file.path, mock_input.changed_files) with input as mock_input
	not_has_security := not has_security
	
	# The warning condition is: needs_security AND not_has_security
	# If has_security is true, then not_has_security is false, so the condition should be false
	needs_security
	has_security
	not (needs_security and not_has_security)  # Warning should NOT be generated
}

