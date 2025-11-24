package compliance.tech_debt

import future.keywords.if

# Test 1: Happy path - workaround logged as debt
test_workaround_logged_as_debt if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "diff": "// Workaround: N+1 query issue deferred (see docs/tech-debt.md#DEBT-001)"
            },
            {
                "path": "docs/tech-debt.md",
                "diff": "## 2025-11-23 - N+1 Query Issue\n**Category:** Performance\n**Priority:** High"
            }
        ]
    }
    
    count(warn) == 0 with input as mock_input
}

# Test 2: Happy path - deferred fix logged as debt
test_deferred_fix_logged_as_debt if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/orders/orders.service.ts",
                "diff": "// TODO: Fix validation (deferred due to time constraints)"
            },
            {
                "path": "docs/tech-debt.md",
                "diff": "## 2025-11-23 - Validation Fix Deferred\n**Category:** Code Quality"
            }
        ]
    }
    
    count(warn) == 0 with input as mock_input
}

# Test 3: Happy path - complete remediation plan
test_complete_remediation_plan if {
    mock_input := {
        "changed_files": [
            {
                "path": "docs/tech-debt.md",
                "diff": "## 2025-11-23 - Performance Issue\n**Remediation Plan:**\n1. Step 1\n2. Step 2\n**Estimated Effort:** 2 hours\n**Priority:** High"
            }
        ]
    }
    
    count(warn) == 0 with input as mock_input
}

# Test 4: Warning - missing debt entry for workaround
test_missing_debt_entry_for_workaround if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/users/users.service.ts",
                "diff": "// TODO: Fix N+1 query (workaround for now)"
            }
        ]
    }
    
    count(warn) == 1 with input as mock_input
    
    warning := [msg | msg := warn[_]][0]
    contains(warning, "workaround pattern")
    contains(warning, "docs/tech-debt.md")
}

# Test 5: Warning - missing debt entry for deferred fix
test_missing_debt_entry_for_deferred_fix if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/orders/orders.service.ts",
                "diff": "// FIXME: Validation deferred due to time constraint"
            }
        ]
    }
    
    count(warn) == 1 with input as mock_input
    
    warning := [msg | msg := warn[_]][0]
    contains(warning, "deferred fix pattern")
}

# Test 6: Warning - hardcoded date in tech-debt.md
test_hardcoded_date_in_tech_debt if {
    mock_input := {
        "changed_files": [
            {
                "path": "docs/tech-debt.md",
                "diff": "## 2024-11-16 - Old Issue\n**Category:** Performance"
            }
        ]
    }
    
    count(warn) == 1 with input as mock_input
    
    warning := [msg | msg := warn[_]][0]
    contains(warning, "hardcoded historical dates")
    contains(warning, "current system date")
}

# Test 7: Warning - incomplete remediation plan
test_incomplete_remediation_plan if {
    mock_input := {
        "changed_files": [
            {
                "path": "docs/tech-debt.md",
                "diff": "## 2025-11-23 - Performance Issue\n**Remediation Plan:**\n1. Fix the issue"
            }
        ]
    }
    
    count(warn) == 1 with input as mock_input
    
    warning := [msg | msg := warn[_]][0]
    contains(warning, "incomplete remediation plan")
}

# Test 8: Warning - missing debt entry for deprecated pattern
test_missing_debt_entry_for_deprecated_pattern if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/legacy/legacy.service.ts",
                "diff": "// @deprecated Use newMethod instead"
            }
        ]
    }
    
    count(warn) == 1 with input as mock_input
    
    warning := [msg | msg := warn[_]][0]
    contains(warning, "deprecated patterns")
}

# Test 9: Edge case - TODOs for current PR (should NOT warn if tech-debt.md updated)
test_todos_for_current_pr_with_debt_update if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/feature/feature.service.ts",
                "diff": "// TODO: Add validation (workaround)"
            },
            {
                "path": "docs/tech-debt.md",
                "diff": "## 2025-11-23 - Feature Validation\n**Category:** Code Quality"
            }
        ]
    }
    
    count(warn) == 0 with input as mock_input
}

# Test 10: Edge case - ideas for future features (should NOT warn - not debt)
test_ideas_for_future_features if {
    mock_input := {
        "changed_files": [
            {
                "path": "apps/api/src/feature/feature.service.ts",
                "diff": "// Future: Add advanced filtering"
            }
        ]
    }
    
    count(warn) == 0 with input as mock_input
}

# Test 11: Edge case - debt entry format validation
test_debt_entry_format_validation if {
    mock_input := {
        "changed_files": [
            {
                "path": "docs/tech-debt.md",
                "diff": "## 2025-11-23 - Issue\n**Category:** Performance\n**Priority:** High\n**Location:** apps/api/src/file.ts\n**Description:** Issue description\n**Impact:** Impact description\n**Remediation Plan:**\n1. Step 1\n2. Step 2\n**Estimated Effort:** 2 hours\n**Status:** Open"
            }
        ]
    }
    
    count(warn) == 0 with input as mock_input
}

# Test 12: Edge case - date format validation (current date)
test_date_format_validation_current_date if {
    mock_input := {
        "changed_files": [
            {
                "path": "docs/tech-debt.md",
                "diff": "## 2025-11-23 - Issue\n**Category:** Performance"
            }
        ]
    }
    
    count(warn) == 0 with input as mock_input
}



