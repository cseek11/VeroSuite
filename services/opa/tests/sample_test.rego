# Sample Policy Tests
#
# Test file for sample.rego policy
# Run with: ./services/opa/bin/opa test services/opa/policies/ services/opa/tests/ -v
#
# Created: 2025-11-30

package compliance.sample_test

import data.compliance.sample
import rego.v1

# Test: No violations on clean PR
test_no_violations_on_clean_pr if {
	test_input := {
		"changed_files": [{
			"path": "apps/api/src/test.ts",
			"diff": "+ const x = 1;",
		}],
		"pr_body": "Clean PR with description",
		"pr_number": 123,
		"author": "developer",
	}

	denials := sample.deny with input as test_input
	count(denials) == 0
}

# Test: Deny on forbidden pattern
test_deny_on_forbidden_pattern if {
	test_input := {
		"changed_files": [{
			"path": "apps/api/src/bad.ts",
			"diff": "+ const x = FORBIDDEN_PATTERN;",
		}],
		"pr_body": "Test PR",
		"pr_number": 123,
		"author": "developer",
	}

	denials := sample.deny with input as test_input
	count(denials) == 1
}

# Test: Override required on critical file
test_override_required_on_critical_file if {
	test_input := {
		"changed_files": [{
			"path": "apps/api/src/critical/important.ts",
			"diff": "+ const x = 1;",
		}],
		"pr_body": "Modifying critical file",
		"pr_number": 123,
		"author": "developer",
	}

	overrides := sample.override with input as test_input
	count(overrides) == 1
}

# Test: Override marker allows critical file change
test_override_marker_allows_critical_change if {
	test_input := {
		"changed_files": [{
			"path": "apps/api/src/critical/important.ts",
			"diff": "+ const x = 1;",
		}],
		"pr_body": "Modifying critical file @override:sample",
		"pr_number": 123,
		"author": "developer",
	}

	overrides := sample.override with input as test_input
	count(overrides) == 0
}

# Test: Warning on empty PR body
test_warning_on_empty_pr_body if {
	test_input := {
		"changed_files": [{
			"path": "apps/api/src/test.ts",
			"diff": "+ const x = 1;",
		}],
		"pr_body": "",
		"pr_number": 123,
		"author": "developer",
	}

	warnings := sample.warn with input as test_input
	count(warnings) == 1
}

# Test: Metadata is correct
test_metadata if {
	sample.metadata.name == "Sample Test Policy"
	sample.metadata.domain == "sample"
	sample.metadata.tier == "3"
}
