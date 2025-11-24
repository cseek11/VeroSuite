# Data Integrity Policy - Layer Synchronization & State Machines
# 
# This policy enforces data integrity for VeroField:
# - R04: Layer Synchronization (Tier 2 - OVERRIDE)
# - R05: State Machine Enforcement (Tier 2 - OVERRIDE)
# - R06: Breaking Change Documentation (Tier 2 - OVERRIDE)
#
# Created: 2025-11-23
# Version: 1.0.0

package compliance.data_integrity

import future.keywords.contains
import future.keywords.if
import future.keywords.in

# Policy metadata
metadata := {
    "name": "Data Integrity - Layer Synchronization & State Machines",
    "domain": "data",
    "tier": "2",  # OVERRIDE - Important but not blocking
    "version": "1.0.0",
    "created": "2025-11-23",
    "description": "Enforces layer synchronization (schema ↔ DTO ↔ frontend types) and state machine integrity"
}

# =============================================================================
# R04: LAYER SYNCHRONIZATION (TIER 2 - OVERRIDE)
# =============================================================================
# Enforce synchronization across database schema, DTOs, frontend types, and contracts

# Deny: Schema change without migration file
deny contains msg if {
    some file in input.changed_files
    file.path == "libs/common/prisma/schema.prisma"
    # Check if schema changed (has model/field changes)
    contains(file.diff, "model ") or contains(file.diff, "@")
    
    # Check if migration file exists in this PR
    migration_exists := false
    some migration_file in input.changed_files
    startswith(migration_file.path, "libs/common/prisma/migrations/")
    endswith(migration_file.path, "migration.sql")
    migration_exists := true
    
    migration_exists == false
    not has_override_marker(input.pr_body, "layer-sync")
    
    msg := sprintf(
        "OVERRIDE REQUIRED [Data/R04]: Schema change in %s requires Prisma migration file. Run 'npx prisma migrate dev --name <description>' to create migration. Add @override:layer-sync with justification if this is a non-breaking change or migration is handled separately.",
        [file.path]
    )
}

# Deny: Schema change without DTO update (heuristic check)
deny contains msg if {
    some file in input.changed_files
    file.path == "libs/common/prisma/schema.prisma"
    # Extract model name from diff
    model_matches := regex.find_all_string_submatch_n(`model\s+([A-Z][a-zA-Z]+)\s*\{`, file.diff, -1)
    count(model_matches) > 0
    model_name := model_matches[0][1]
    
    # Check if corresponding DTO file exists and was updated
    dto_updated := false
    some dto_file in input.changed_files
    # Match DTO file for this model (case-insensitive, handles plural/singular)
    regex.match(sprintf(".*/%s.*\\.dto\\.ts$", [lower(model_name)]), dto_file.path)
    dto_updated := true
    
    dto_updated == false
    not has_override_marker(input.pr_body, "layer-sync")
    
    msg := sprintf(
        "OVERRIDE REQUIRED [Data/R04]: Schema change for model '%s' requires corresponding DTO update. Update DTOs in apps/*/src/**/dto/ to match schema changes. Add @override:layer-sync with justification if DTO update is in separate PR or not applicable.",
        [model_name]
    )
}

# Deny: DTO change without frontend type update (heuristic check)
deny contains msg if {
    some file in input.changed_files
    regex.match(".*\\.dto\\.ts$", file.path)
    not contains(file.path, "test")
    # Extract entity name from DTO file path
    entity_matches := regex.find_all_string_submatch_n(".*/([a-z-]+)\\.dto\\.ts$", file.path, -1)
    count(entity_matches) > 0
    entity_name := entity_matches[0][1]
    
    # Check if corresponding frontend type file exists and was updated
    frontend_type_updated := false
    some type_file in input.changed_files
    regex.match(sprintf("frontend/src/types/.*%s.*\\.ts$", [entity_name]), type_file.path)
    frontend_type_updated := true
    
    frontend_type_updated == false
    not has_override_marker(input.pr_body, "layer-sync")
    
    msg := sprintf(
        "OVERRIDE REQUIRED [Data/R04]: DTO change in %s requires corresponding frontend type update. Update types in frontend/src/types/ to match DTO changes. Add @override:layer-sync with justification if frontend update is in separate PR or not applicable.",
        [file.path]
    )
}

# Warning: Enum change detected (requires manual verification)
warn contains msg if {
    some file in input.changed_files
    regex.match(".*enum.*", file.diff)
    contains(file.diff, "enum ")
    
    msg := sprintf(
        "WARNING [Data/R04]: Enum change detected in %s. Verify enum values match across schema, DTOs, and frontend types. Use 'python .cursor/scripts/check-layer-sync.py --entity <EntityName>' to verify synchronization.",
        [file.path]
    )
}

# Warning: Zod schema may need update (if frontend types changed)
warn contains msg if {
    some file in input.changed_files
    startswith(file.path, "frontend/src/types/")
    endswith(file.path, ".ts")
    
    # Extract entity name from type file
    entity_matches := regex.find_all_string_submatch_n("frontend/src/types/([a-z-]+)\\.ts$", file.path, -1)
    count(entity_matches) > 0
    entity_name := entity_matches[0][1]
    
    msg := sprintf(
        "WARNING [Data/R04]: Frontend type changed in %s. Verify corresponding Zod schema in frontend/src/schemas/%s.schema.ts matches the updated type for runtime validation.",
        [file.path, entity_name]
    )
}

# =============================================================================
# R05: STATE MACHINE ENFORCEMENT (TIER 2 - OVERRIDE)
# =============================================================================
# Enforce state machine documentation, transition validation, and audit logging

# Deny: Stateful entity without state machine documentation
deny contains msg if {
    some file in input.changed_files
    # Check if file modifies stateful entity (enum Status or status field)
    regex.match(".*\\.prisma$", file.path)
    contains(file.diff, "enum ")
    regex.match(".*Status|.*State", file.diff)
    
    # Extract entity name from enum definition
    entity_matches := regex.find_all_string_submatch_n(`enum\s+([A-Z][a-zA-Z]+)(Status|State)`, file.diff, -1)
    count(entity_matches) > 0
    entity_name := entity_matches[0][1]
    
    # Check if state machine documentation exists
    doc_exists := false
    some doc_file in input.all_files  # Assumes all_files includes existing files
    regex.match(sprintf("docs/state-machines/%s-state-machine\\.md", [lower(entity_name)]), doc_file.path)
    doc_exists := true
    
    doc_exists == false
    not has_override_marker(input.pr_body, "state-machine")
    
    msg := sprintf(
        "OVERRIDE REQUIRED [Data/R05]: Stateful entity '%s' requires state machine documentation. Create 'docs/state-machines/%s-state-machine.md' with states, legal transitions, illegal transitions, and side effects. Add @override:state-machine with justification if documentation will be added in follow-up PR.",
        [entity_name, lower(entity_name)]
    )
}

# Deny: State transition code without validation function
deny contains msg if {
    some file in input.changed_files
    # Check if file is a service file that handles state transitions
    regex.match("apps/.*/src/.*/.*\\.service\\.ts$", file.path)
    # Check if file modifies status/state field
    contains(file.diff, ".status") or contains(file.diff, ".state")
    contains(file.diff, "update(")
    
    # Check for validation function (pattern matching)
    has_validation := false
    regex.match(".*isValidTransition|.*canTransitionTo|.*validateStateTransition|.*StateGuard", file.diff)
    has_validation := true
    
    has_validation == false
    not has_override_marker(input.pr_body, "state-machine")
    
    msg := sprintf(
        "OVERRIDE REQUIRED [Data/R05]: Service file %s modifies state/status field but lacks transition validation function. Add validation function (e.g., 'isValidTransition(from, to)') that checks legal transitions. Add @override:state-machine with justification if validation is handled elsewhere.",
        [file.path]
    )
}

# Deny: State transition without audit log
deny contains msg if {
    some file in input.changed_files
    regex.match("apps/.*/src/.*/.*\\.service\\.ts$", file.path)
    # Check if file modifies status/state field
    contains(file.diff, ".status") or contains(file.diff, ".state")
    contains(file.diff, "update(")
    
    # Check for audit log call (pattern matching)
    has_audit_log := false
    regex.match(".*auditLog|.*auditService\\.log|.*logStateTransition", file.diff)
    has_audit_log := true
    
    has_audit_log == false
    not has_override_marker(input.pr_body, "state-machine")
    
    msg := sprintf(
        "OVERRIDE REQUIRED [Data/R05]: Service file %s modifies state/status field but lacks audit logging. Add 'await this.auditService.log({ entity, action: \"state_transition\", oldState, newState, userId })' after state change. Add @override:state-machine with justification if audit logging is handled elsewhere.",
        [file.path]
    )
}

# Deny: Code-documentation mismatch (states don't match)
deny contains msg if {
    some file in input.changed_files
    # Check if state machine documentation was modified
    regex.match("docs/state-machines/.*-state-machine\\.md$", file.path)
    
    # Extract entity name from documentation path
    entity_matches := regex.find_all_string_submatch_n("docs/state-machines/([a-z-]+)-state-machine\\.md$", file.path, -1)
    count(entity_matches) > 0
    entity_name := entity_matches[0][1]
    
    # Check if corresponding schema/service files were also updated
    schema_updated := false
    some schema_file in input.changed_files
    contains(schema_file.path, "schema.prisma")
    contains(schema_file.diff, entity_name)
    schema_updated := true
    
    service_updated := false
    some service_file in input.changed_files
    regex.match(sprintf(".*/%s.*\\.service\\.ts$", [entity_name]), service_file.path)
    service_updated := true
    
    # If only documentation changed, warn about potential mismatch
    schema_updated == false
    service_updated == false
    not has_override_marker(input.pr_body, "state-machine")
    
    msg := sprintf(
        "OVERRIDE REQUIRED [Data/R05]: State machine documentation for '%s' was updated but corresponding schema/service code was not modified. Verify code implementation matches updated documentation. Run 'python .cursor/scripts/check-state-machines.py --entity %s' to verify synchronization. Add @override:state-machine with justification if code is already correct.",
        [entity_name, entity_name]
    )
}

# Deny: Illegal transition not rejected (heuristic check)
deny contains msg if {
    some file in input.changed_files
    regex.match("apps/.*/src/.*/.*\\.service\\.ts$", file.path)
    # Check if file has transition logic
    contains(file.diff, "status") or contains(file.diff, "state")
    contains(file.diff, "update(")
    
    # Check for explicit rejection logic (throw or return false)
    has_rejection := false
    regex.match(".*throw.*InvalidTransitionError|.*throw.*BadRequestException|.*return false", file.diff)
    has_rejection := true
    
    has_rejection == false
    not has_override_marker(input.pr_body, "state-machine")
    
    msg := sprintf(
        "OVERRIDE REQUIRED [Data/R05]: Service file %s has state transition logic but lacks explicit rejection of illegal transitions. Add error handling: 'if (!this.isValidTransition(from, to)) throw new BadRequestException(...)'. Add @override:state-machine with justification if validation is handled differently.",
        [file.path]
    )
}

# Warning: State machine documentation exists but code doesn't enforce transitions
warn contains msg if {
    some file in input.changed_files
    # Check if service file was modified
    regex.match("apps/.*/src/.*/.*\\.service\\.ts$", file.path)
    contains(file.diff, "status") or contains(file.diff, "state")
    
    # Extract entity name from service file path
    entity_matches := regex.find_all_string_submatch_n(".*/([a-z-]+)\\.service\\.ts$", file.path, -1)
    count(entity_matches) > 0
    entity_name := entity_matches[0][1]
    
    # Check if state machine documentation exists (would need to check existing files)
    # This is a simplified check - actual implementation would verify doc exists
    
    # Check if validation function exists in diff
    has_validation := false
    regex.match(".*isValidTransition|.*canTransitionTo|.*validateStateTransition", file.diff)
    has_validation := true
    
    has_validation == false
    
    msg := sprintf(
        "WARNING [Data/R05]: Service file %s modifies state/status but may not enforce state machine transitions. Verify transition validation exists. See 'docs/state-machines/%s-state-machine.md' for legal transitions. Use 'python .cursor/scripts/check-state-machines.py --entity %s' to verify.",
        [file.path, entity_name, entity_name]
    )
}

# =============================================================================
# R06: BREAKING CHANGE DOCUMENTATION (TIER 2 - OVERRIDE)
# =============================================================================
# Enforce breaking change flagging, migration guides, version bumps, and CHANGELOG updates

# Deny: Breaking change without [BREAKING] tag in PR title
deny contains msg if {
    some file in input.changed_files
    is_breaking_change(file)
    not has_breaking_tag(input.pr_title)
    not has_override_marker(input.pr_body, "breaking-change")
    
    msg := sprintf(
        "OVERRIDE REQUIRED [Data/R06]: Breaking change detected in %s but PR title missing [BREAKING] tag. Breaking changes must be flagged in PR title. Add '[BREAKING]' to PR title or add @override:breaking-change with justification if this is not a breaking change.",
        [file.path]
    )
}

# Deny: [BREAKING] tag without migration guide
deny contains msg if {
    has_breaking_tag(input.pr_title)
    not has_migration_guide(input.changed_files)
    not has_override_marker(input.pr_body, "breaking-change")
    
    msg := "OVERRIDE REQUIRED [Data/R06]: PR has [BREAKING] tag but no migration guide found. Create migration guide in 'docs/migrations/[YYYY-MM-DD]-[feature]-migration.md' with: what changed, why, who is affected, migration steps, before/after examples, rollback instructions. Add @override:breaking-change with justification if migration guide will be added in follow-up PR."
}

# Deny: [BREAKING] tag without version bump
deny contains msg if {
    has_breaking_tag(input.pr_title)
    not has_major_version_bump(input.changed_files)
    not has_override_marker(input.pr_body, "breaking-change")
    
    msg := "OVERRIDE REQUIRED [Data/R06]: PR has [BREAKING] tag but no MAJOR version bump found. Update version in package.json (e.g., 1.5.3 → 2.0.0). Add @override:breaking-change with justification if version bump will be done separately."
}

# Deny: [BREAKING] tag without CHANGELOG update
deny contains msg if {
    has_breaking_tag(input.pr_title)
    not has_changelog_update(input.changed_files)
    not has_override_marker(input.pr_body, "breaking-change")
    
    msg := "OVERRIDE REQUIRED [Data/R06]: PR has [BREAKING] tag but CHANGELOG.md not updated. Add breaking changes section to CHANGELOG.md with: list of breaking changes, migration guide link, version number. Add @override:breaking-change with justification if CHANGELOG update will be done separately."
}

# Warning: API breaking change without docs update
warn contains msg if {
    some file in input.changed_files
    is_api_breaking_change(file)
    not has_api_docs_update(input.changed_files)
    
    msg := sprintf(
        "WARNING [Data/R06]: API breaking change detected in %s but API documentation not updated. Update OpenAPI/Swagger docs or API reference documentation to reflect breaking changes.",
        [file.path]
    )
}

# Helper: Detect breaking changes (multi-signal approach)
is_breaking_change(file) if {
    # Signal 1: Code removal patterns
    regex.match(".*\\.(controller|service|dto)\\.ts$", file.path)
    contains(file.diff, "export")
    # Check for removed exports
    regex.match(".*^\\-.*export.*(function|class|interface|type)", file.diff)
}

is_breaking_change(file) if {
    # Signal 2: Removed endpoints
    regex.match(".*\\.controller\\.ts$", file.path)
    regex.match(".*^\\-.*@(Get|Post|Put|Delete|Patch)", file.diff)
}

is_breaking_change(file) if {
    # Signal 3: Database breaking changes
    regex.match(".*migration.*\\.sql$", file.path)
    contains(file.diff, "DROP COLUMN") or contains(file.diff, "ALTER COLUMN")
}

is_breaking_change(file) if {
    # Signal 4: File deletions (endpoints, services, DTOs)
    file.status == "deleted"
    regex.match(".*\\.(controller|service|dto)\\.ts$", file.path)
}

is_breaking_change(file) if {
    # Signal 5: Type changes (optional → required)
    regex.match(".*\\.(dto|interface)\\.ts$", file.path)
    regex.match(".*^\\-\\s*\\w+\\?\\s*:.*\\n\\+\\s*\\w+:", file.diff)
}

# Helper: Check for [BREAKING] tag in PR title
has_breaking_tag(pr_title) if {
    contains(pr_title, "[BREAKING]")
}

# Helper: Check for migration guide
has_migration_guide(files) if {
    some file in files
    startswith(file.path, "docs/migrations/")
    endswith(file.path, "-migration.md")
}

# Helper: Check for MAJOR version bump
has_major_version_bump(files) if {
    some file in files
    file.path == "package.json"
    # Check for version change with MAJOR increment
    regex.match(".*^\\-\\s*\"version\":\\s*\"(\\d+)\\.(\\d+)\\.(\\d+)\".*\\n\\+\\s*\"version\":\\s*\"(\\d+)\\.(\\d+)\\.(\\d+)\"", file.diff)
}

# Helper: Check for CHANGELOG update
has_changelog_update(files) if {
    some file in files
    file.path == "CHANGELOG.md"
    # Check for breaking changes section (flexible matching)
    regex.match(".*Breaking Changes|.*\\[BREAKING\\]|.*Breaking:", file.diff)
}

# Helper: Detect API breaking changes
is_api_breaking_change(file) if {
    # Check for public API paths
    contains(file.path, "/api/v") or contains(file.path, "/api/public/")
    is_breaking_change(file)
}

# Helper: Check for API docs update
has_api_docs_update(files) if {
    some file in files
    # Check for OpenAPI/Swagger or API docs update
    regex.match(".*(openapi|swagger|api-docs).*\\.(yaml|json|md)$", file.path)
}

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

# Check for override marker in PR body
has_override_marker(pr_body, rule) if {
    contains(pr_body, "@override:")
    contains(pr_body, rule)
}

# Check if entity produces/consumes events (for contract doc requirement)
is_event_entity(entity_name) if {
    # This would check if entity has @EventEmitter, Kafka topics, etc.
    # For now, this is a placeholder - actual implementation would need
    # to parse decorators or check event configuration
    # Common event entities: WorkOrder, Invoice, Payment, Job
    entity_name in ["workorder", "invoice", "payment", "job"]
}

# Check if file is exempted
is_exempted(file_path) if {
    some exempted_file in data.exemptions.files
    file_path == exempted_file
}

# =============================================================================
# PERFORMANCE NOTES
# =============================================================================
# - Early exit on file path checks (string matching before regex)
# - Regex patterns optimized for common cases
# - Heuristic-based detection (not full AST parsing)
# - Target: <200ms per evaluation

