package compliance.tech_debt

import future.keywords.if

# Test 1: Happy path - TODO resolved and removed
test_todo_resolved_and_removed if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "diff": "- // TODO: Add pagination\n+ function getUsers(page: number) {"
            }
        ]
    }
    
    count(warn) == 0 with input as mock_input
}

# Test 2: Happy path - meaningful TODO logged as debt
test_meaningful_todo_logged_as_debt if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/orders/orders.service.ts",
                "diff": "// TODO: Fix N+1 query (workaround, see docs/tech-debt.md#DEBT-001)"
            },
            {
                "path": "docs/tech-debt.md",
                "diff": "## 2025-11-23 - N+1 Query Issue\n**Location:** apps/api/src/orders/orders.service.ts"
            }
        ]
    }
    
    count(warn) == 0 with input as mock_input
}

# Test 3: Happy path - trivial TODO completed in PR
test_trivial_todo_completed_in_pr if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "diff": "+ function getUsers(page: number) {\n+   return prisma.user.findMany({ skip: (page - 1) * 10, take: 10 });\n+ }"
            }
        ]
    }
    
    count(warn) == 0 with input as mock_input
}

# Test 4: Warning - meaningful TODO not logged
test_meaningful_todo_not_logged if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/orders/orders.service.ts",
                "diff": "+ // TODO: Fix N+1 query (workaround)"
            }
        ]
    }
    
    count(warn) >= 1 with input as mock_input
    
    warning := [msg | msg := warn[_]][0]
    contains(warning, "meaningful TODO/FIXME")
    contains(warning, "tech-debt.md")
}

# Test 5: Warning - FIXME added without reference
test_fixme_added_without_reference if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "diff": "+ // FIXME: Temporary hack for authentication"
            }
        ]
    }
    
    count(warn) >= 1 with input as mock_input
    
    warning := [msg | msg := warn[_]][0]
    contains(warning, "FIXME")
    contains(warning, "tech-debt.md")
}

# Test 6: Warning - TODO without clear action
test_todo_without_clear_action if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "diff": "+ // TODO:\n+ function getUsers() {"
            }
        ]
    }
    
    count(warn) >= 1 with input as mock_input
    
    warning := [msg | msg := warn[_]][0]
    contains(warning, "without clear action")
}

# Test 7: Warning - multiple unresolved TODOs
test_multiple_unresolved_todos if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "diff": "+ // TODO: Add pagination\n+ // TODO: Add sorting"
            }
        ]
    }
    
    count(warn) >= 1 with input as mock_input
}

# Test 8: Edge case - TODO for current PR work (should NOT warn if completed)
test_todo_for_current_pr_completed if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "diff": "- // TODO: Add pagination\n+ function getUsers(page: number) {\n+   return prisma.user.findMany({ skip: (page - 1) * 10, take: 10 });\n+ }"
            }
        ]
    }
    
    count(warn) == 0 with input as mock_input
}

# Test 9: Edge case - ideas for future features (should NOT log as debt)
test_ideas_for_future_features if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "diff": "+ // Future: Add advanced filtering"
            }
        ]
    }
    
    count(warn) == 0 with input as mock_input
}

# Test 10: Edge case - TODO in comment vs code
test_todo_in_comment_vs_code if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "diff": "+ // TODO: Add pagination (workaround, see docs/tech-debt.md#DEBT-001)"
            },
            {
                "path": "docs/tech-debt.md",
                "diff": "## 2025-11-23 - Pagination\n**Location:** apps/api/src/users/users.service.ts"
            }
        ]
    }
    
    count(warn) == 0 with input as mock_input
}

# Test 11: Edge case - FIXME vs TODO distinction
test_fixme_vs_todo_distinction if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "diff": "+ // FIXME: Urgent issue (workaround, see docs/tech-debt.md#DEBT-001)"
            },
            {
                "path": "docs/tech-debt.md",
                "diff": "## 2025-11-23 - Urgent Issue\n**Location:** apps/api/src/users/users.service.ts"
            }
        ]
    }
    
    count(warn) == 0 with input as mock_input
}

# Test 12: Edge case - TODO with tech-debt.md reference (valid)
test_todo_with_valid_reference if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/orders/orders.service.ts",
                "diff": "+ // TODO: Fix N+1 query (see docs/tech-debt.md#DEBT-001)"
            },
            {
                "path": "docs/tech-debt.md",
                "diff": "## 2025-11-23 - N+1 Query Issue\n**Location:** apps/api/src/orders/orders.service.ts"
            }
        ]
    }
    
    count(warn) == 0 with input as mock_input
}



