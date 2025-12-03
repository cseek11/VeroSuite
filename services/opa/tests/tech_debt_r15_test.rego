package compliance.tech_debt_test

import data.compliance.tech_debt
import rego.v1

# Test 1: Happy path - TODO resolved and removed
test_todo_resolved_and_removed if {
	# Use raw string (backticks) to preserve actual newline
	diff_content := `- // TODO: Add pagination
+ function getUsers(page: number) {`

	mock_input := {"changed_files": [{
		"path": "apps/api/src/users/users.service.ts",
		"diff": diff_content,
	}]}

	count(tech_debt.warn) == 0 with input as mock_input
}

# Test 2: Happy path - meaningful TODO logged as debt
test_meaningful_todo_logged_as_debt if {
	mock_input := {"changed_files": [
		{
			"path": "apps/api/src/orders/orders.service.ts",
			"diff": "// TODO: Fix N+1 query (workaround, see docs/tech-debt.md#DEBT-001)",
		},
		{
			"path": "docs/tech-debt.md",
			"diff": "## 2025-11-30 - N+1 Query Issue\n**Location:** apps/api/src/orders/orders.service.ts",
		},
	]}

	count(tech_debt.warn) == 0 with input as mock_input
}

# Test 3: Happy path - trivial TODO completed in PR
test_trivial_todo_completed_in_pr if {
	# Use raw string (backticks) to preserve actual newlines
	diff_content := `+ function getUsers(page: number) {
+   return prisma.user.findMany({ skip: (page - 1) * 10, take: 10 });
+ }`

	mock_input := {"changed_files": [{
		"path": "apps/api/src/users/users.service.ts",
		"diff": diff_content,
	}]}

	count(tech_debt.warn) == 0 with input as mock_input
}

# Test 4: Warning - meaningful TODO not logged
# This should trigger R15-W03 (adds new meaningful TODO without reference)
# Note: R15-W03 is more specific than R15-W02 (checks for +.*TODO:), so it triggers first
test_meaningful_todo_not_logged if {
	mock_input := {"changed_files": [{
		"path": "apps/api/src/orders/orders.service.ts",
		"diff": "+ // TODO: Fix N+1 query (workaround)",
	}]}

	warnings := tech_debt.warn with input as mock_input
	count(warnings) >= 1

	# R15-W03 message: "adds new meaningful TODO/FIXME without tech-debt.md reference"
	# R15-W02 message: "contains meaningful TODO/FIXME (workaround/deferred/temporary) but no reference"
	# Either rule can trigger - check for either message pattern
	some warning in warnings
	contains(warning, "meaningful TODO/FIXME")
	contains(warning, "tech-debt.md")
}

# Test 5: Warning - FIXME added without reference
# This should trigger R15-W04 (adds FIXME without reference)
# Note: Use lowercase "temporary" to match has_meaningful_todo_keywords check
test_fixme_added_without_reference if {
	mock_input := {"changed_files": [{
		"path": "apps/api/src/users/users.service.ts",
		"diff": "+ // FIXME: temporary hack for authentication",
	}]}

	warnings := tech_debt.warn with input as mock_input
	count(warnings) >= 1

	fixme_warning := [msg | msg := warnings[_]][0]
	contains(fixme_warning, "adds new FIXME")
	contains(fixme_warning, "FIXME")
	contains(fixme_warning, "tech-debt.md")
}

# Test 6: Warning - TODO without clear action
test_todo_without_clear_action if {
	# Use raw string (backticks) with actual newline (not \n escape)
	diff_content := `+ // TODO:
+ function getUsers() {`

	mock_input := {"changed_files": [{
		"path": "apps/api/src/users/users.service.ts",
		"diff": diff_content,
	}]}

	warnings := tech_debt.warn with input as mock_input
	count(warnings) >= 1

	warning := [msg | msg := warnings[_]][0]
	contains(warning, "without clear action")
}

# Test 7: Warning - multiple unresolved TODOs
test_multiple_unresolved_todos if {
	# Use raw string (backticks) to preserve actual newline
	diff_content := `+ // TODO: Add pagination
+ // TODO: Add sorting`

	mock_input := {"changed_files": [{
		"path": "apps/api/src/users/users.service.ts",
		"diff": diff_content,
	}]}

	count(tech_debt.warn) >= 1 with input as mock_input
}

# Test 8: Edge case - TODO for current PR work (should NOT warn if completed)
test_todo_for_current_pr_completed if {
	# Use raw string (backticks) to preserve actual newlines
	diff_content := `- // TODO: Add pagination
+ function getUsers(page: number) {
+   return prisma.user.findMany({ skip: (page - 1) * 10, take: 10 });
+ }`

	mock_input := {"changed_files": [{
		"path": "apps/api/src/users/users.service.ts",
		"diff": diff_content,
	}]}

	count(tech_debt.warn) == 0 with input as mock_input
}

# Test 9: Edge case - ideas for future features (should NOT log as debt)
test_ideas_for_future_features if {
	mock_input := {"changed_files": [{
		"path": "apps/api/src/users/users.service.ts",
		"diff": "+ // Future: Add advanced filtering",
	}]}

	count(tech_debt.warn) == 0 with input as mock_input
}

# Test 10: Edge case - TODO in comment vs code
test_todo_in_comment_vs_code if {
	mock_input := {"changed_files": [
		{
			"path": "apps/api/src/users/users.service.ts",
			"diff": "+ // TODO: Add pagination (workaround, see docs/tech-debt.md#DEBT-001)",
		},
		{
			"path": "docs/tech-debt.md",
			"diff": "## 2025-11-30 - Pagination\n**Location:** apps/api/src/users/users.service.ts",
		},
	]}

	count(tech_debt.warn) == 0 with input as mock_input
}

# Test 11: Edge case - FIXME vs TODO distinction
test_fixme_vs_todo_distinction if {
	mock_input := {"changed_files": [
		{
			"path": "apps/api/src/users/users.service.ts",
			"diff": "+ // FIXME: Urgent issue (workaround, see docs/tech-debt.md#DEBT-001)",
		},
		{
			"path": "docs/tech-debt.md",
			"diff": "## 2025-11-30 - Urgent Issue\n**Location:** apps/api/src/users/users.service.ts",
		},
	]}

	count(tech_debt.warn) == 0 with input as mock_input
}

# Test 12: Edge case - TODO with tech-debt.md reference (valid)
test_todo_with_valid_reference if {
	mock_input := {"changed_files": [
		{
			"path": "apps/api/src/orders/orders.service.ts",
			"diff": "+ // TODO: Fix N+1 query (see docs/tech-debt.md#DEBT-001)",
		},
		{
			"path": "docs/tech-debt.md",
			"diff": "## 2025-11-30 - N+1 Query Issue\n**Location:** apps/api/src/orders/orders.service.ts",
		},
	]}

	count(tech_debt.warn) == 0 with input as mock_input
}
