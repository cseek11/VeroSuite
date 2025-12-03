# Shared Helper Functions for OPA Policies
# Contains common utilities used across all compliance policies
#
# Created: 2025-11-25
# Version: 1.0.0

package compliance.shared

import rego.v1

# =============================================================================
# Input Validation Helpers
# =============================================================================
# NOTE: These helpers are exported (no _ prefix) because they are in a shared
# package meant to be imported by other policies. Per Rego/OPA Bible 10.1,
# internal helpers should use _ prefix, but shared/exported helpers may omit it.

# Check if input has changed_files array
has_changed_files if {
	input.changed_files != null
	is_array(input.changed_files)
}

# Check if input has pr_body string
has_pr_body if {
	input.pr_body != null
	is_string(input.pr_body)
}

# =============================================================================
# Override Marker Detection
# =============================================================================

# Check if PR body contains override marker for specific rule
# Optimized: Uses single regex check instead of two contains() calls
# Per Rego/OPA Bible 11.2, expression ordering and efficiency matter
has_override_marker(pr_body, rule) if {
	regex.match(sprintf("@override:.*%s", [rule]), pr_body)
}

# =============================================================================
# File Exemption Checks
# =============================================================================

# Check if file path is exempted
is_exempted(file_path) if {
	some exempted_file in data.exemptions.files
	file_path == exempted_file
}

# Check if author is exempted
is_exempted_author(author) if {
	some exempted_author in data.exemptions.authors
	author == exempted_author
}

# =============================================================================
# Code File Detection
# =============================================================================

# Check if path is a code file
is_code_file(path) if {
	endswith(path, ".ts")
}

is_code_file(path) if {
	endswith(path, ".tsx")
}

is_code_file(path) if {
	endswith(path, ".js")
}

is_code_file(path) if {
	endswith(path, ".jsx")
}

# =============================================================================
# String Utilities
# =============================================================================
# NOTE: Use built-in startswith() directly instead of this custom helper.
# Per Rego/OPA Bible 6.7, built-ins should be used directly.
# This helper is deprecated and will be removed after migration.
# Migration: Replace starts_with(str, prefix) with startswith(str, prefix)

# =============================================================================
# Error Message Formatting
# =============================================================================

# Format violation message with standard structure
# Format: "[SEVERITY] [Domain/RuleID]: [Clear description]. [Actionable guidance]. [Reference link]"
format_violation_message(severity, domain, rule_id, description, guidance, reference) := msg if {
	msg := sprintf(
		"%s [%s/%s]: %s. %s. %s",
		[severity, domain, rule_id, description, guidance, reference],
	)
}
