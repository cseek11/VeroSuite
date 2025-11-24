package compliance.tech_debt

import future.keywords.contains
import future.keywords.if
import future.keywords.in

# R14: Tech Debt Logging
# WARNING-level enforcement (Tier 3 MAD)
# Ensures technical debt is logged in docs/tech-debt.md

# Helper: Check if file is in tech-debt.md
is_tech_debt_file(file) if {
    contains(file.path, "docs/tech-debt.md")
}

# Helper: Check if file contains workaround patterns
has_workaround_pattern(file) if {
    contains(file.diff, "TODO:")
    contains(file.diff, "workaround")
}

has_workaround_pattern(file) if {
    contains(file.diff, "FIXME:")
    contains(file.diff, "workaround")
}

has_workaround_pattern(file) if {
    contains(file.diff, "temporary")
    contains(file.diff, "fix")
}

# Helper: Check if file contains deferred fix patterns
has_deferred_fix_pattern(file) if {
    contains(file.diff, "TODO:")
    contains(file.diff, "deferred")
}

has_deferred_fix_pattern(file) if {
    contains(file.diff, "FIXME:")
    contains(file.diff, "time constraint")
}

# Helper: Check if file contains deprecated pattern usage
has_deprecated_pattern(file) if {
    contains(file.diff, "@deprecated")
}

has_deprecated_pattern(file) if {
    contains(file.diff, "// Deprecated:")
}

# Helper: Check if file contains skipped test patterns
has_skipped_test_pattern(file) if {
    contains(file.diff, "it.skip")
}

has_skipped_test_pattern(file) if {
    contains(file.diff, "describe.skip")
}

has_skipped_test_pattern(file) if {
    contains(file.diff, "test.skip")
}

# Helper: Check if file contains hardcoded value patterns
has_hardcoded_value_pattern(file) if {
    contains(file.diff, "// TODO: Make configurable")
}

has_hardcoded_value_pattern(file) if {
    contains(file.diff, "// FIXME: Hardcoded")
}

# Helper: Check if file contains code duplication patterns
has_code_duplication_pattern(file) if {
    contains(file.diff, "// TODO: Extract to shared")
}

has_code_duplication_pattern(file) if {
    contains(file.diff, "// FIXME: Duplicate")
}

# Helper: Check if tech-debt.md has hardcoded dates
has_hardcoded_date(file) if {
    is_tech_debt_file(file)
    # Pattern: ## YYYY-MM-DD where date is not current date
    # Simplified check: Look for date patterns that are clearly old
    regex.match(`##\s+(2024-|2023-|2022-)`, file.diff)
}

# Helper: Check if tech-debt.md entry is incomplete
has_incomplete_remediation_plan(file) if {
    is_tech_debt_file(file)
    contains(file.diff, "**Remediation Plan:**")
    not contains(file.diff, "**Estimated Effort:**")
}

has_incomplete_remediation_plan(file) if {
    is_tech_debt_file(file)
    contains(file.diff, "**Remediation Plan:**")
    not contains(file.diff, "**Priority:**")
}

# Helper: Check if PR changes tech-debt.md
pr_updates_tech_debt if {
    some file in input.changed_files
    is_tech_debt_file(file)
}

# R14-W01: Missing tech debt entry for workaround
warn contains msg if {
    some file in input.changed_files
    not is_tech_debt_file(file)
    has_workaround_pattern(file)
    not pr_updates_tech_debt
    
    msg := sprintf(
        "WARNING [Tech Debt/R14]: File '%s' contains workaround pattern but no tech debt entry found in docs/tech-debt.md. Log meaningful technical debt with category, priority, location, impact, remediation plan, and effort estimate.",
        [file.path]
    )
}

# R14-W02: Missing tech debt entry for deferred fix
warn contains msg if {
    some file in input.changed_files
    not is_tech_debt_file(file)
    has_deferred_fix_pattern(file)
    not pr_updates_tech_debt
    
    msg := sprintf(
        "WARNING [Tech Debt/R14]: File '%s' contains deferred fix pattern but no tech debt entry found in docs/tech-debt.md. Log deferred fixes with remediation plan and effort estimate.",
        [file.path]
    )
}

# R14-W03: Missing tech debt entry for deprecated pattern usage
warn contains msg if {
    some file in input.changed_files
    not is_tech_debt_file(file)
    has_deprecated_pattern(file)
    not pr_updates_tech_debt
    
    msg := sprintf(
        "WARNING [Tech Debt/R14]: File '%s' uses deprecated patterns but no tech debt entry found in docs/tech-debt.md. Log deprecated pattern usage with migration plan.",
        [file.path]
    )
}

# R14-W04: Missing tech debt entry for skipped tests
warn contains msg if {
    some file in input.changed_files
    not is_tech_debt_file(file)
    has_skipped_test_pattern(file)
    not pr_updates_tech_debt
    
    msg := sprintf(
        "WARNING [Tech Debt/R14]: File '%s' contains skipped tests but no tech debt entry found in docs/tech-debt.md. Log skipped tests with reason and remediation plan.",
        [file.path]
    )
}

# R14-W05: Missing tech debt entry for hardcoded values
warn contains msg if {
    some file in input.changed_files
    not is_tech_debt_file(file)
    has_hardcoded_value_pattern(file)
    not pr_updates_tech_debt
    
    msg := sprintf(
        "WARNING [Tech Debt/R14]: File '%s' contains hardcoded values that should be configurable but no tech debt entry found in docs/tech-debt.md. Log hardcoded values with configuration plan.",
        [file.path]
    )
}

# R14-W06: Missing tech debt entry for code duplication
warn contains msg if {
    some file in input.changed_files
    not is_tech_debt_file(file)
    has_code_duplication_pattern(file)
    not pr_updates_tech_debt
    
    msg := sprintf(
        "WARNING [Tech Debt/R14]: File '%s' contains code duplication but no tech debt entry found in docs/tech-debt.md. Log code duplication with abstraction plan.",
        [file.path]
    )
}

# R14-W07: Hardcoded date in tech-debt.md
warn contains msg if {
    some file in input.changed_files
    has_hardcoded_date(file)
    
    msg := sprintf(
        "WARNING [Tech Debt/R14]: File '%s' contains hardcoded historical dates. Use current system date (YYYY-MM-DD format) when adding tech debt entries. See .cursor/rules/02-core.mdc for date handling requirements.",
        [file.path]
    )
}

# R14-W08: Incomplete remediation plan in tech-debt.md
warn contains msg if {
    some file in input.changed_files
    has_incomplete_remediation_plan(file)
    
    msg := sprintf(
        "WARNING [Tech Debt/R14]: File '%s' contains incomplete remediation plan. Tech debt entries must include: steps to fix, estimated effort, and priority (High/Medium/Low).",
        [file.path]
    )
}

# ============================================================================
# R15: TODO/FIXME Handling
# WARNING-level enforcement (Tier 3 MAD)
# Ensures TODO/FIXME comments are properly handled
# ============================================================================

# Helper: Check if file contains TODO comments
has_todo_comment(file) if {
    regex.match(`//\s*TODO:`, file.diff)
}

has_todo_comment(file) if {
    regex.match(`/\*\s*TODO:`, file.diff)
}

has_todo_comment(file) if {
    regex.match(`#\s*TODO:`, file.diff)
}

# Helper: Check if file contains FIXME comments
has_fixme_comment(file) if {
    regex.match(`//\s*FIXME:`, file.diff)
}

has_fixme_comment(file) if {
    regex.match(`/\*\s*FIXME:`, file.diff)
}

has_fixme_comment(file) if {
    regex.match(`#\s*FIXME:`, file.diff)
}

# Helper: Check if TODO/FIXME appears to be meaningful (has keywords)
has_meaningful_todo_keywords(file) if {
    contains(file.diff, "TODO:")
    contains(file.diff, "workaround")
}

has_meaningful_todo_keywords(file) if {
    contains(file.diff, "TODO:")
    contains(file.diff, "deferred")
}

has_meaningful_todo_keywords(file) if {
    contains(file.diff, "TODO:")
    contains(file.diff, "temporary")
}

has_meaningful_todo_keywords(file) if {
    contains(file.diff, "FIXME:")
    contains(file.diff, "workaround")
}

has_meaningful_todo_keywords(file) if {
    contains(file.diff, "FIXME:")
    contains(file.diff, "deferred")
}

has_meaningful_todo_keywords(file) if {
    contains(file.diff, "FIXME:")
    contains(file.diff, "hack")
}

# Helper: Check if TODO has reference to tech-debt.md
has_tech_debt_reference(file) if {
    regex.match(`TODO:.*docs/tech-debt\.md`, file.diff)
}

has_tech_debt_reference(file) if {
    regex.match(`FIXME:.*docs/tech-debt\.md`, file.diff)
}

# Helper: Check if TODO appears to be resolved (implementation added)
appears_resolved(file) if {
    # Check if diff shows TODO removal (lines starting with -)
    regex.match(`-.*TODO:`, file.diff)
}

appears_resolved(file) if {
    regex.match(`-.*FIXME:`, file.diff)
}

# Helper: Check if TODO is trivial (current PR work keywords)
has_trivial_keywords(file) if {
    contains(file.diff, "TODO: Add")
    not contains(file.diff, "workaround")
    not contains(file.diff, "deferred")
}

has_trivial_keywords(file) if {
    contains(file.diff, "TODO: Update")
    not contains(file.diff, "workaround")
}

# R15-W01: TODO/FIXME left after completing work
warn contains msg if {
    some file in input.changed_files
    not is_tech_debt_file(file)
    has_todo_comment(file)
    appears_resolved(file)
    # TODO was removed in diff but still present (contradictory, but checking for leftover TODOs)
    
    msg := sprintf(
        "WARNING [Tech Debt/R15]: File '%s' contains TODO/FIXME comments that may have been addressed. If work is complete, remove the TODO/FIXME comment and update tech-debt.md if applicable.",
        [file.path]
    )
}

# R15-W02: Meaningful TODO not logged in tech-debt.md
warn contains msg if {
    some file in input.changed_files
    not is_tech_debt_file(file)
    has_meaningful_todo_keywords(file)
    not has_tech_debt_reference(file)
    not pr_updates_tech_debt
    
    msg := sprintf(
        "WARNING [Tech Debt/R15]: File '%s' contains meaningful TODO/FIXME (workaround/deferred/temporary) but no reference to tech-debt.md found. Log meaningful TODOs as technical debt with reference (e.g., 'see docs/tech-debt.md#DEBT-001').",
        [file.path]
    )
}

# R15-W03: TODO added without tech-debt.md reference
warn contains msg if {
    some file in input.changed_files
    not is_tech_debt_file(file)
    regex.match(`\+.*TODO:`, file.diff)
    has_meaningful_todo_keywords(file)
    not has_tech_debt_reference(file)
    
    msg := sprintf(
        "WARNING [Tech Debt/R15]: File '%s' adds new meaningful TODO/FIXME without tech-debt.md reference. Add reference to tech-debt.md entry (e.g., 'TODO: Fix issue (see docs/tech-debt.md#DEBT-001)').",
        [file.path]
    )
}

# R15-W04: FIXME added without tech-debt.md reference
warn contains msg if {
    some file in input.changed_files
    not is_tech_debt_file(file)
    regex.match(`\+.*FIXME:`, file.diff)
    has_meaningful_todo_keywords(file)
    not has_tech_debt_reference(file)
    
    msg := sprintf(
        "WARNING [Tech Debt/R15]: File '%s' adds new FIXME without tech-debt.md reference. FIXMEs should be logged as technical debt with reference to tech-debt.md.",
        [file.path]
    )
}

# R15-W05: TODO/FIXME without clear action
warn contains msg if {
    some file in input.changed_files
    not is_tech_debt_file(file)
    has_todo_comment(file)
    # Check for vague TODOs (just "TODO:" or "TODO: Fix")
    regex.match(`TODO:\s*$`, file.diff)
    
    msg := sprintf(
        "WARNING [Tech Debt/R15]: File '%s' contains TODO/FIXME without clear action. Provide specific description of what needs to be done.",
        [file.path]
    )
}

# R15-W06: Multiple unresolved TODOs in same file
warn contains msg if {
    some file in input.changed_files
    not is_tech_debt_file(file)
    # Count TODO occurrences (simplified check)
    regex.match(`TODO:.*TODO:`, file.diff)
    not has_tech_debt_reference(file)
    
    msg := sprintf(
        "WARNING [Tech Debt/R15]: File '%s' contains multiple TODO/FIXME comments. Consider logging as technical debt if work is deferred, or complete in current PR if trivial.",
        [file.path]
    )
}

