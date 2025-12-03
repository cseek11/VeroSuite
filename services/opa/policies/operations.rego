# Operations Policy - CI/CD Workflow Triggers
#
# This policy enforces CI/CD workflow trigger configuration for VeroField:
# - R25: CI/CD Workflow Triggers (Tier 3 - WARNING)
#
# Created: 2025-11-24
# Version: 1.0.0

package compliance.operations

import rego.v1

# Policy metadata
metadata := {
	"name": "CI/CD Workflow Triggers",
	"domain": "operations",
	"tier": "3", # WARNING - Workflow triggers are best practice
	"version": "1.0.0",
	"created": "2025-11-30",
	"description": "Enforces CI/CD workflow trigger configuration: on: sections, workflow_run triggers, artifact consistency",
}

# =============================================================================
# INPUT VALIDATION
# =============================================================================
input_valid if {
	is_array(input.changed_files)
}

# =============================================================================
# R25: CI/CD WORKFLOW TRIGGERS (TIER 3 - WARNING)
# =============================================================================
# Enforce workflow trigger configuration: on: sections, PR triggers, workflow_run triggers, artifact consistency

# Helper: Check if file is a workflow file
is_workflow_file(file) if {
	startswith(file.path, ".github/workflows/")
	endswith(file.path, ".yml")
}

is_workflow_file(file) if {
	startswith(file.path, ".github/workflows/")
	endswith(file.path, ".yaml")
}

# Helper: Extract workflow name from YAML (simplified - assumes name: field exists)
# Note: Full YAML parsing would require external tool, this uses pattern matching
has_workflow_name(file) if {
	contains(file.diff, "name:")
}

# Helper: Check if workflow has on: section
# Match "on:" at start of line or after newline (not "runs-on:")
has_on_section(file) if {
	regex.match("(^|\n)on:", file.diff)
}

# Helper: Check if PR workflow has proper types
has_pr_trigger_types(file) if {
	contains(file.diff, "pull_request:")
	contains(file.diff, "types:")
	contains(file.diff, "opened")
	contains(file.diff, "synchronize")
	contains(file.diff, "reopened")
}

# Helper: Check if workflow_run trigger exists
has_workflow_run_trigger(file) if {
	contains(file.diff, "workflow_run:")
}

# Helper: Extract workflow names from workflow_run triggers (simplified pattern matching)
# Note: Full validation requires parsing YAML structure, this uses pattern matching
# For full validation, use external script (check-workflow-triggers.py)
workflow_run_trigger_exists(file) if {
	contains(file.diff, "workflows:")
	contains(file.diff, "workflow_run:")
}

# Helper: Check if artifact upload exists
has_artifact_upload(file) if {
	contains(file.diff, "actions/upload-artifact")
	contains(file.diff, "name:")
}

# Helper: Check if artifact download exists
has_artifact_download(file) if {
	contains(file.diff, "actions/download-artifact")
	contains(file.diff, "name:")
}

# =============================================================================
# R25-W01: Missing on: section in workflow
# =============================================================================

warn contains msg if {
	input_valid
	some file in input.changed_files
	is_workflow_file(file)
	not has_on_section(file)

	msg := sprintf(
		"WARNING [Operations/R25-W01]: Workflow file %s is missing required 'on:' section. All workflows must define triggers. Add 'on:' section with appropriate triggers (pull_request, workflow_run, schedule, etc.).",
		[file.path],
	)
}

# =============================================================================
# R25-W02: PR workflow missing types: [opened, synchronize, reopened]
# =============================================================================

warn contains msg if {
	input_valid
	some file in input.changed_files
	is_workflow_file(file)
	has_on_section(file)
	contains(file.diff, "pull_request:")
	not has_pr_trigger_types(file)

	msg := sprintf(
		"WARNING [Operations/R25-W02]: PR workflow %s is missing required trigger types. PR workflows must include 'types: [opened, synchronize, reopened]' to trigger on PR events. Add: 'types: [opened, synchronize, reopened]' to pull_request trigger.",
		[file.path],
	)
}

# =============================================================================
# R25-W03: workflow_run trigger references non-existent workflow
# =============================================================================
# Note: Full validation requires parsing all workflow files to check if referenced workflows exist
# This is a simplified check that flags workflow_run triggers
# For full validation, use external script (check-workflow-triggers.py) which can:
# 1. Parse all workflow files
# 2. Extract workflow names
# 3. Validate workflow_run triggers reference existing workflows
# 4. Check for exact name matching (case-sensitive)

warn contains msg if {
	input_valid
	some file in input.changed_files
	is_workflow_file(file)
	has_workflow_run_trigger(file)
	workflow_run_trigger_exists(file)

	# Note: Full validation of workflow name existence requires external script
	# This warning flags workflow_run triggers for manual review
	# The external script will validate workflow names exist

	msg := sprintf(
		"WARNING [Operations/R25-W03]: Workflow file %s has workflow_run trigger. Verify referenced workflow names exist in .github/workflows/ and match exactly (case-sensitive). Use check-workflow-triggers.py for full validation.",
		[file.path],
	)
}

# =============================================================================
# R25-W04: Artifact downloaded but never uploaded (upload/download mismatch)
# =============================================================================
# Note: Full validation requires parsing all workflow files to build artifact dependency map
# This is a simplified check that flags artifact downloads
# For full validation, use external script (check-workflow-triggers.py) which can:
# 1. Parse all workflow files
# 2. Build artifact dependency map (uploads/downloads)
# 3. Validate every download has corresponding upload
# 4. Warn when artifacts are downloaded but never uploaded

warn contains msg if {
	input_valid
	some file in input.changed_files
	is_workflow_file(file)
	has_artifact_download(file)

	# Note: Full validation of artifact consistency requires external script
	# This warning flags artifact downloads for manual review
	# The external script will validate artifact upload/download consistency

	msg := sprintf(
		"WARNING [Operations/R25-W04]: Workflow file %s has artifact download. Verify artifact name matches upload name in source workflow. Use check-workflow-triggers.py for full validation of artifact upload/download consistency.",
		[file.path],
	)
}

# =============================================================================
# R25-W05: Artifact uploaded but never downloaded (unused artifact)
# =============================================================================
# Note: Full validation requires parsing all workflow files to build artifact dependency map
# This is a simplified check that flags artifact uploads
# For full validation, use external script (check-workflow-triggers.py) which can:
# 1. Parse all workflow files
# 2. Build artifact dependency map (uploads/downloads)
# 3. Warn when artifacts are uploaded but never downloaded (unused artifacts)

warn contains msg if {
	input_valid
	some file in input.changed_files
	is_workflow_file(file)
	has_artifact_upload(file)
	not has_artifact_download(file)

	# Note: Full validation of unused artifacts requires external script
	# This warning flags artifact uploads for manual review
	# The external script will validate artifact usage across all workflows

	msg := sprintf(
		"WARNING [Operations/R25-W05]: Workflow file %s has artifact upload. Verify artifact is downloaded by downstream workflows. Use check-workflow-triggers.py for full validation of artifact usage.",
		[file.path],
	)
}

# =============================================================================
# R25-W06: workflow_run trigger missing types: [completed]
# =============================================================================

warn contains msg if {
	input_valid
	some file in input.changed_files
	is_workflow_file(file)
	has_workflow_run_trigger(file)
	contains(file.diff, "workflow_run:")
	not contains(file.diff, "types:")
	not contains(file.diff, "completed")

	msg := sprintf(
		"WARNING [Operations/R25-W06]: Workflow file %s has workflow_run trigger but missing 'types: [completed]'. workflow_run triggers should include 'types: [completed]' to trigger after parent workflow completes. Add: 'types: [completed]' to workflow_run trigger.",
		[file.path],
	)
}
