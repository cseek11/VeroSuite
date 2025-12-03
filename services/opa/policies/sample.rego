# Sample Policy - For Testing OPA Integration
#
# This is a simple test policy to verify OPA infrastructure is working correctly.
# It will be replaced with actual compliance policies in Phase 1-2.
#
# Created: 2025-11-23
# Version: 1.0.0

package compliance.sample

import rego.v1

# Policy metadata
metadata := {
	"name": "Sample Test Policy",
	"domain": "sample",
	"tier": "3",
	"version": "1.0.0",
	"created": "2025-11-30",
	"description": "Sample policy for testing OPA infrastructure",
}

# HARD STOP: Example violation
deny contains msg if {
	# Check if any file contains "FORBIDDEN_PATTERN"
	some file in input.changed_files
	contains(file.diff, "FORBIDDEN_PATTERN")

	msg := sprintf(
		"HARD STOP [Sample]: File %s contains forbidden pattern 'FORBIDDEN_PATTERN'",
		[file.path],
	)
}

# OVERRIDE REQUIRED: Example override condition
override contains msg if {
	# Check if PR modifies critical files without override
	some file in input.changed_files
	is_critical_file(file.path)
	not has_override_marker(input.pr_body)

	msg := sprintf(
		"OVERRIDE REQUIRED [Sample]: Critical file %s modified. Add '@override:sample' to PR description.",
		[file.path],
	)
}

# WARNING: Example warning
warn contains msg if {
	# Check if PR is missing description
	input.pr_body == ""

	msg := "WARNING [Sample]: PR description is empty. Please add a description."
}

# Helper: Check if file is critical
is_critical_file(path) if {
	contains(path, "critical")
}

# Helper: Check for override marker
has_override_marker(pr_body) if {
	contains(pr_body, "@override:sample")
}

# Test that policy loads correctly
test_policy_loads if {
	metadata.name == "Sample Test Policy"
}
