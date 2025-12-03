# Operations R25 Test Suite - CI/CD Workflow Triggers
#
# Tests for R25: CI/CD Workflow Triggers (Tier 3 - WARNING)
#
# Created: 2025-11-30
# Version: 1.0.0

package compliance.operations_test

import data.compliance.operations
import rego.v1

# =============================================================================
# Test Cases: R25-W01 - Missing on: section
# =============================================================================

test_missing_on_section_warns if {
	result := operations.warn with input as {"changed_files": [{
		"path": ".github/workflows/test.yml",
		"diff": "name: Test Workflow\njobs:\n  test:\n    runs-on: ubuntu-latest",
	}]}
	some warning in result
	contains(warning, "R25-W01")
	contains(warning, "missing required 'on:' section")
}

test_has_on_section_passes if {
	result := operations.warn with input as {"changed_files": [{
		"path": ".github/workflows/test.yml",
		"diff": "name: Test Workflow\non:\n  pull_request:\n    types: [opened, synchronize, reopened]",
	}]}
	count(result) == 0
}

# =============================================================================
# Test Cases: R25-W02 - PR workflow missing types
# =============================================================================

test_pr_workflow_missing_types_warns if {
	result := operations.warn with input as {"changed_files": [{
		"path": ".github/workflows/test.yml",
		"diff": "name: Test Workflow\non:\n  pull_request:",
	}]}
	some warning in result
	contains(warning, "R25-W02")
	contains(warning, "missing required trigger types")
}

test_pr_workflow_has_types_passes if {
	result := operations.warn with input as {"changed_files": [{
		"path": ".github/workflows/test.yml",
		"diff": "name: Test Workflow\non:\n  pull_request:\n    types: [opened, synchronize, reopened]",
	}]}
	count(result) == 0
}

# =============================================================================
# Test Cases: R25-W03 - workflow_run trigger validation
# =============================================================================

test_workflow_run_trigger_warns if {
	result := operations.warn with input as {"changed_files": [{
		"path": ".github/workflows/test.yml",
		"diff": "name: Test Workflow\non:\n  workflow_run:\n    workflows: [\"Parent Workflow\"]\n    types: [completed]",
	}]}
	some warning in result
	contains(warning, "R25-W03")
	contains(warning, "workflow_run trigger")
}

test_no_workflow_run_trigger_passes if {
	result := operations.warn with input as {"changed_files": [{
		"path": ".github/workflows/test.yml",
		"diff": "name: Test Workflow\non:\n  pull_request:\n    types: [opened, synchronize, reopened]",
	}]}

	# R25-W03 should not appear if no workflow_run trigger
	count([warning | warning := result[_]; contains(warning, "R25-W03")]) == 0
}

# =============================================================================
# Test Cases: R25-W04 - Artifact download validation
# =============================================================================

test_artifact_download_warns if {
	result := operations.warn with input as {"changed_files": [{
		"path": ".github/workflows/test.yml",
		"diff": "name: Test Workflow\non:\n  workflow_run:\n    workflows: [\"Parent\"]\njobs:\n  test:\n    steps:\n      - uses: actions/download-artifact@v4\n        with:\n          name: reward",
	}]}
	some warning in result
	contains(warning, "R25-W04")
	contains(warning, "artifact download")
}

test_no_artifact_download_passes if {
	result := operations.warn with input as {"changed_files": [{
		"path": ".github/workflows/test.yml",
		"diff": "name: Test Workflow\non:\n  pull_request:\n    types: [opened, synchronize, reopened]",
	}]}

	# R25-W04 should not appear if no artifact download
	count([warning | warning := result[_]; contains(warning, "R25-W04")]) == 0
}

# =============================================================================
# Test Cases: R25-W05 - Unused artifact upload
# =============================================================================

test_unused_artifact_upload_warns if {
	result := operations.warn with input as {"changed_files": [{
		"path": ".github/workflows/test.yml",
		"diff": "name: Test Workflow\non:\n  pull_request:\n    types: [opened, synchronize, reopened]\njobs:\n  test:\n    steps:\n      - uses: actions/upload-artifact@v4\n        with:\n          name: reward",
	}]}
	some warning in result
	contains(warning, "R25-W05")
	contains(warning, "artifact upload")
}

test_artifact_upload_with_download_passes if {
	result := operations.warn with input as {"changed_files": [{
		"path": ".github/workflows/test.yml",
		"diff": "name: Test Workflow\non:\n  pull_request:\n    types: [opened, synchronize, reopened]\njobs:\n  test:\n    steps:\n      - uses: actions/upload-artifact@v4\n        with:\n          name: reward\n      - uses: actions/download-artifact@v4\n        with:\n          name: reward",
	}]}

	# R25-W05 should not appear if artifact is downloaded in same workflow
	count([warning | warning := result[_]; contains(warning, "R25-W05")]) == 0
}

# =============================================================================
# Test Cases: R25-W06 - workflow_run missing types: [completed]
# =============================================================================

test_workflow_run_missing_types_warns if {
	result := operations.warn with input as {"changed_files": [{
		"path": ".github/workflows/test.yml",
		"diff": "name: Test Workflow\non:\n  workflow_run:\n    workflows: [\"Parent Workflow\"]",
	}]}
	some warning in result
	contains(warning, "R25-W06")
	contains(warning, "missing 'types: [completed]'")
}

test_workflow_run_has_types_passes if {
	result := operations.warn with input as {"changed_files": [{
		"path": ".github/workflows/test.yml",
		"diff": "name: Test Workflow\non:\n  workflow_run:\n    workflows: [\"Parent Workflow\"]\n    types: [completed]",
	}]}

	# R25-W06 should not appear if types: [completed] is present
	count([warning | warning := result[_]; contains(warning, "R25-W06")]) == 0
}

# =============================================================================
# Test Cases: Edge Cases
# =============================================================================

test_non_workflow_file_passes if {
	result := operations.warn with input as {"changed_files": [{
		"path": "apps/api/src/test.ts",
		"diff": "export function test() { }",
	}]}
	count(result) == 0
}

test_yaml_extension_passes if {
	result := operations.warn with input as {"changed_files": [{
		"path": ".github/workflows/test.yaml",
		"diff": "name: Test Workflow\non:\n  pull_request:\n    types: [opened, synchronize, reopened]",
	}]}
	count([warning | warning := result[_]; contains(warning, "R25-W01")]) == 0
	count([warning | warning := result[_]; contains(warning, "R25-W02")]) == 0
}

test_scheduled_workflow_passes if {
	result := operations.warn with input as {"changed_files": [{
		"path": ".github/workflows/test.yml",
		"diff": "name: Test Workflow\non:\n  schedule:\n    - cron: '0 0 * * *'",
	}]}

	# Scheduled workflows don't need PR trigger types
	count([warning | warning := result[_]; contains(warning, "R25-W02")]) == 0
}

test_manual_trigger_passes if {
	result := operations.warn with input as {"changed_files": [{
		"path": ".github/workflows/test.yml",
		"diff": "name: Test Workflow\non:\n  workflow_dispatch:",
	}]}

	# Manual triggers don't need PR trigger types
	count([warning | warning := result[_]; contains(warning, "R25-W02")]) == 0
}

# =============================================================================
# Test Cases: Multiple Violations
# =============================================================================

test_multiple_violations_warns if {
	result := operations.warn with input as {"changed_files": [{
		"path": ".github/workflows/test.yml",
		"diff": "name: Test Workflow\njobs:\n  test:\n    runs-on: ubuntu-latest",
	}]}
	some warning in result
	contains(warning, "R25-W01") # Missing on: section
}
