# Architecture Policy - Monorepo Structure & Service Boundaries
# 
# This policy enforces architectural boundaries for VeroField:
# - R03: Architecture Boundaries (Tier 1 - BLOCK)
# - R21: File Organization (Tier 3 - WARNING)
#
# Created: 2025-11-23
# Version: 1.0.0

package compliance.architecture

import future.keywords.contains
import future.keywords.if
import future.keywords.in

# Policy metadata
metadata := {
    "name": "Architecture Boundaries & Monorepo Structure",
    "domain": "architecture",
    "tier": "1",  # BLOCK - Architecture is critical
    "version": "1.0.0",
    "created": "2025-11-23",
    "description": "Enforces monorepo structure and service boundaries"
}

# =============================================================================
# R03: ARCHITECTURE BOUNDARIES (TIER 1 - BLOCK)
# =============================================================================
# Enforce monorepo structure, service boundaries, and architectural scope limits
# This checks for NEW directories/services, not files in existing services

# Deny: New directory in apps/ (new microservice)
# This checks for NEW top-level directories in apps/, not new files in existing services
deny contains msg if {
    some file in input.changed_files
    # Match new directory creation (path ends with /)
    regex.match(`^apps/[^/]+/$`, file.path)
    not has_override_marker(input.pr_body, "architecture-boundaries")
    
    # Extract service name
    service_matches := regex.find_all_string_submatch_n(`^apps/([^/]+)/`, file.path, -1)
    service_name := get_service_name(service_matches)
    
    msg := sprintf(
        "HARD STOP [Architecture/R03]: Creating new microservice '%s' in %s requires explicit human approval. Add @override:architecture-boundaries with architectural justification, approval from architecture team, and documentation in docs/architecture/decisions/.",
        [service_name, file.path]
    )
}

# Deny: Files in deprecated backend/ path
deny contains msg if {
    some file in input.changed_files
    startswith(file.path, "backend/")
    not has_override_marker(input.pr_body, "architecture-boundaries")
    
    # Suggest correct path
    correct_path := replace(file.path, "backend/", "apps/api/")
    
    msg := sprintf(
        "HARD STOP [Architecture/R03]: File in deprecated path '%s'. Move to correct monorepo path: '%s'. Deprecated paths: backend/src/ → apps/api/src/, backend/prisma/ → libs/common/prisma/",
        [file.path, correct_path]
    )
}

# Deny: Cross-service relative import
deny contains msg if {
    some file in input.changed_files
    endswith(file.path, ".ts")
    regex.match(`import.*from\s+['"]\.\./\.\./\.\./[^'"]+/src/`, file.diff)
    not has_override_marker(input.pr_body, "architecture-boundaries")
    
    msg := sprintf(
        "HARD STOP [Architecture/R03]: Cross-service relative import detected in %s. Services must communicate via HTTP/events, not direct imports. Use API clients or event bus. Shared code belongs in libs/common/.",
        [file.path]
    )
}

# Deny: New top-level directory (not in approved list)
deny contains msg if {
    some file in input.changed_files
    # Match new top-level directory (single segment + /)
    regex.match(`^[^/]+/$`, file.path)
    # Not in approved list
    not startswith(file.path, "apps/")
    not startswith(file.path, "libs/")
    not startswith(file.path, "frontend/")
    not startswith(file.path, "VeroFieldMobile/")
    not startswith(file.path, "docs/")
    not startswith(file.path, "services/")
    not startswith(file.path, ".cursor/")
    not startswith(file.path, ".github/")
    not startswith(file.path, "monitoring/")
    not has_override_marker(input.pr_body, "architecture-boundaries")
    
    msg := sprintf(
        "HARD STOP [Architecture/R03]: Creating new top-level directory '%s' requires explicit human approval. Document architectural justification in docs/architecture/decisions/ and get approval from architecture team.",
        [file.path]
    )
}

# Deny: New schema file outside libs/common/prisma
deny contains msg if {
    some file in input.changed_files
    endswith(file.path, "schema.prisma")
    not contains(file.path, "libs/common/prisma/")
    not has_override_marker(input.pr_body, "architecture-boundaries")
    
    msg := sprintf(
        "HARD STOP [Architecture/R03]: New schema file '%s' outside libs/common/prisma/. VeroField uses single schema source of truth at libs/common/prisma/schema.prisma. Multiple schemas break data consistency and tenant isolation.",
        [file.path]
    )
}

# Deny: Frontend importing backend service implementation
deny contains msg if {
    some file in input.changed_files
    startswith(file.path, "frontend/")
    regex.match(`import.*from\s+['"].*apps/(api|crm-ai|ai-soc)/.*\.service`, file.diff)
    not has_override_marker(input.pr_body, "architecture-boundaries")
    
    msg := sprintf(
        "HARD STOP [Architecture/R03]: Frontend importing backend service implementation in %s. Frontend must use API client with contract types, not backend implementation. Use typed API client: import { apiClient } from '@/lib/api-client'; import type { User } from '@verofield/common/types';",
        [file.path]
    )
}

# Deny: Backend importing frontend code
deny contains msg if {
    some file in input.changed_files
    startswith(file.path, "apps/")
    regex.match(`import.*from\s+['"].*frontend/`, file.diff)
    not has_override_marker(input.pr_body, "architecture-boundaries")
    
    msg := sprintf(
        "HARD STOP [Architecture/R03]: Backend importing frontend code in %s. Backend must not depend on frontend. Extract shared types to libs/common/src/types/. Example: libs/common/src/types/user.types.ts",
        [file.path]
    )
}

# Warning: Potential code duplication (utility in service directory)
warn contains msg if {
    some file in input.changed_files
    contains(file.path, "/utils/")
    startswith(file.path, "apps/")
    
    msg := sprintf(
        "WARNING [Architecture/R03]: Utility file in service directory '%s'. Consider if this should be shared code in libs/common/src/utils/. If used by multiple services, move to shared library. Example: libs/common/src/validators/email.validator.ts",
        [file.path]
    )
}

# =============================================================================
# R21: FILE ORGANIZATION (TIER 3 - WARNING)
# =============================================================================
# Enforce file organization compliance: deprecated paths, top-level directories,
# file naming, directory structure, import paths

# R21-W01: File in deprecated path (backend/src/, backend/prisma/, root-level src/)
file_organization_warnings[msg] if {
    some file in input.changed_files
    startswith(file.path, "backend/src/")
    
    correct_path := replace(file.path, "backend/src/", "apps/api/src/")
    msg := sprintf(
        "WARNING [Architecture/R21]: File in deprecated path '%s'. Suggested: '%s'. Deprecated paths: backend/src/ → apps/api/src/, backend/prisma/ → libs/common/prisma/, src/ → frontend/src/",
        [file.path, correct_path]
    )
}

file_organization_warnings[msg] if {
    some file in input.changed_files
    startswith(file.path, "backend/prisma/")
    
    correct_path := replace(file.path, "backend/prisma/", "libs/common/prisma/")
    msg := sprintf(
        "WARNING [Architecture/R21]: File in deprecated path '%s'. Suggested: '%s'. Database schema must be in libs/common/prisma/",
        [file.path, correct_path]
    )
}

file_organization_warnings[msg] if {
    some file in input.changed_files
    regex.match(`^src/`, file.path)
    not startswith(file.path, "apps/")
    not startswith(file.path, "libs/")
    not startswith(file.path, "frontend/")
    not startswith(file.path, "VeroFieldMobile/")
    
    msg := sprintf(
        "WARNING [Architecture/R21]: File in root-level src/ '%s'. Suggested: Move to frontend/src/ or appropriate app directory",
        [file.path]
    )
}

# R21-W02: New top-level directory not in approved list
file_organization_warnings[msg] if {
    some file in input.changed_files
    regex.match(`^[^/]+/$`, file.path)
    not startswith(file.path, "apps/")
    not startswith(file.path, "libs/")
    not startswith(file.path, "frontend/")
    not startswith(file.path, "VeroFieldMobile/")
    not startswith(file.path, "docs/")
    not startswith(file.path, "services/")
    not startswith(file.path, ".cursor/")
    not startswith(file.path, ".github/")
    not startswith(file.path, "monitoring/")
    not startswith(file.path, "node_modules/")
    not startswith(file.path, ".git/")
    
    dir_name := regex.replace(`/$`, file.path, "")
    msg := sprintf(
        "WARNING [Architecture/R21]: New top-level directory '%s' not in approved list. Approved directories: apps/, libs/, frontend/, VeroFieldMobile/, docs/, services/, .cursor/. Request approval from architecture team.",
        [dir_name]
    )
}

# R21-W03: Deprecated import path (@verosuite/*)
file_organization_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".ts")
    contains(file.diff, "@verosuite/")
    
    msg := sprintf(
        "WARNING [Architecture/R21]: Deprecated import path '@verosuite/*' detected in %s. Update to '@verofield/common/*' for shared code. Example: import { validateEmail } from '@verofield/common/validators';",
        [file.path]
    )
}

file_organization_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    contains(file.diff, "@verosuite/")
    
    msg := sprintf(
        "WARNING [Architecture/R21]: Deprecated import path '@verosuite/*' detected in %s. Update to '@verofield/common/*' for shared code. Example: import { Button } from '@verofield/common/components';",
        [file.path]
    )
}

# R21-W04: Cross-service relative import (../../other-service/)
file_organization_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".ts")
    regex.match(`import\s+.*\s+from\s+['"](\.\./){3,}[^'"]+`, file.diff)
    
    msg := sprintf(
        "WARNING [Architecture/R21]: Cross-service relative import detected in %s. Services should communicate via HTTP/events or use shared code in libs/common/. Example: Move shared code to libs/common/src/ and import from '@verofield/common/...'",
        [file.path]
    )
}

file_organization_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    regex.match(`import\s+.*\s+from\s+['"](\.\./){3,}[^'"]+`, file.diff)
    
    msg := sprintf(
        "WARNING [Architecture/R21]: Cross-service relative import detected in %s. Services should communicate via HTTP/events or use shared code in libs/common/. Example: Move shared code to libs/common/src/ and import from '@verofield/common/...'",
        [file.path]
    )
}

# R21-W05: File naming violation (component file should be PascalCase)
file_organization_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    regex.match(`/[a-z][a-z0-9_-]*\.tsx$`, file.path)
    contains(file.diff, "export const")
    
    msg := sprintf(
        "WARNING [Architecture/R21]: Component file '%s' should use PascalCase naming. Example: button.tsx → Button.tsx. File naming conventions: PascalCase for components, camelCase for utilities, kebab-case for configs.",
        [file.path]
    )
}

# R21-W06: File naming violation (utility file should be camelCase)
file_organization_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".ts")
    not endswith(file.path, ".d.ts")
    not endswith(file.path, ".config.ts")
    regex.match(`/[A-Z][A-Za-z0-9_-]*\.ts$`, file.path)
    contains(file.diff, "export function")
    
    msg := sprintf(
        "WARNING [Architecture/R21]: Utility file '%s' should use camelCase naming. Example: FormatDate.ts → formatDate.ts. File naming conventions: PascalCase for components, camelCase for utilities, kebab-case for configs.",
        [file.path]
    )
}

# R21-W07: Directory depth exceeds recommended limit (>4 levels)
file_organization_warnings[msg] if {
    some file in input.changed_files
    path_parts := split(file.path, "/")
    count(path_parts) > 5
    
    depth := count(path_parts) - 1
    msg := sprintf(
        "WARNING [Architecture/R21]: Directory depth (%d levels) exceeds recommended limit (4 levels) in '%s'. Consider flattening structure. Example: apps/api/src/deep/nested/structure/file.ts → apps/api/src/flat-structure/file.ts",
        [depth, file.path]
    )
}

# R21-W08: Component in wrong location (reusable component not in ui/)
file_organization_warnings[msg] if {
    some file in input.changed_files
    startswith(file.path, "frontend/src/components/")
    not contains(file.path, "/ui/")
    endswith(file.path, ".tsx")
    contains(file.diff, "export const")
    
    msg := sprintf(
        "WARNING [Architecture/R21]: reusable component '%s' should be in frontend/src/components/ui/. Feature-specific components belong in feature folders. Example: frontend/src/components/ui/Button.tsx for reusable, frontend/src/components/work-orders/WorkOrderForm.tsx for feature-specific.",
        [file.path]
    )
}

# R21-W09: Import using old relative path pattern
file_organization_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".ts")
    regex.match(`import\s+.*\s+from\s+['"](\.\./){3,}`, file.diff)
    
    msg := sprintf(
        "WARNING [Architecture/R21]: Deep relative import (>3 levels) detected in %s. Consider using monorepo import paths (@verofield/common/*, @/components/ui/*). Example: import { Button } from '@/components/ui/Button';",
        [file.path]
    )
}

file_organization_warnings[msg] if {
    some file in input.changed_files
    endswith(file.path, ".tsx")
    regex.match(`import\s+.*\s+from\s+['"](\.\./){3,}`, file.diff)
    
    msg := sprintf(
        "WARNING [Architecture/R21]: Deep relative import (>3 levels) detected in %s. Consider using monorepo import paths (@verofield/common/*, @/components/ui/*). Example: import { Button } from '@/components/ui/Button';",
        [file.path]
    )
}

# Main warn rule - collects all R21 warnings  
warn contains msg if {
    file_organization_warnings[msg]
}

# Main warn rule - collects all R22 warnings
warn contains msg if {
    refactor_integrity_warnings[msg]
}

# =============================================================================
# R22: REFACTOR INTEGRITY (TIER 3 - WARNING)
# =============================================================================
# Enforce refactoring safety: behavior-diffing tests, regression tests, risk surface documentation, stability checks

# R22-W01: Refactor without behavior-diffing tests (simplified - detailed check in script)
refactor_integrity_warnings[msg] if {
    some file in input.changed_files
    is_refactoring_pr
    not endswith(file.path, ".spec.ts")
    not endswith(file.path, ".test.ts")
    not endswith(file.path, ".test.tsx")
    
    # Simple check: no test files in changed_files at all
    not has_any_test_files
    
    msg := sprintf(
        "WARNING [Architecture/R22]: Refactoring detected in %s but no test files found in PR. Refactors must include behavior-diffing tests. Run check-refactor-integrity.py for detailed analysis.",
        [file.path]
    )
}

# R22-W02: Refactor without regression tests (simplified - detailed check in script)
# Note: This is a simplified check. The Python script will do detailed AST analysis.
# OPA policy only checks for obvious missing test files.

# R22-W03: Refactor without risk surface documentation
refactor_integrity_warnings[msg] if {
    is_refactoring_pr
    
    # Check PR description for risk surface keywords
    not has_risk_surface_documentation
    
    msg := sprintf(
        "WARNING [Architecture/R22]: Refactoring detected but risk surface documentation missing. Refactors must document: files affected, dependencies, breaking changes, migration steps, and rollback plan. Example: Add '⚠️ REFACTOR RISK SURFACE' section to PR description with all required information.",
        []
    )
}

# R22-W04: Refactoring unstable code
refactor_integrity_warnings[msg] if {
    some file in input.changed_files
    is_refactoring_pr
    not endswith(file.path, ".spec.ts")
    not endswith(file.path, ".test.ts")
    not endswith(file.path, ".test.tsx")
    
    # Check for stability issues (simplified - full check in script)
    not is_code_stable(file.path)
    
    msg := sprintf(
        "WARNING [Architecture/R22]: Refactoring detected in %s but code may be unstable. Refactors should only be performed on stable code (all tests passing, no known bugs, not in active development, stable dependencies). Example: Fix failing tests and known bugs before refactoring.",
        [file.path]
    )
}

# R22-W05: Breaking changes in refactor
refactor_integrity_warnings[msg] if {
    some file in input.changed_files
    is_refactoring_pr
    endswith(file.path, ".ts")
    not endswith(file.path, ".spec.ts")
    not endswith(file.path, ".test.ts")
    
    # Check for breaking changes (simplified - full check in script)
    has_breaking_changes(file.diff)
    
    msg := sprintf(
        "WARNING [Architecture/R22]: Breaking changes detected in refactoring of %s. Refactors should maintain behavior and not introduce breaking changes unless explicitly documented. If breaking changes are intentional, document them with migration guide. Example: Document API contract changes, error message changes, and provide migration steps.",
        [file.path]
    )
}

# Helper: Check if PR is a refactoring PR (keyword-based detection, case-insensitive)
is_refactoring_pr if {
    lower_pr_body := lower(input.pr_body)
    contains(lower_pr_body, "refactor")
}

is_refactoring_pr if {
    lower_pr_body := lower(input.pr_body)
    contains(lower_pr_body, "restructure")
}

is_refactoring_pr if {
    lower_pr_body := lower(input.pr_body)
    contains(lower_pr_body, "extract")
}

is_refactoring_pr if {
    lower_pr_body := lower(input.pr_body)
    contains(lower_pr_body, "reorganize")
}

is_refactoring_pr if {
    lower_pr_body := lower(input.pr_body)
    contains(lower_pr_body, "rename")
}

is_refactoring_pr if {
    lower_pr_body := lower(input.pr_body)
    contains(lower_pr_body, "move")
}

# Helper: Check if any test files exist in changed_files
has_any_test_files if {
    some file in input.changed_files
    endswith(file.path, ".spec.ts")
}

has_any_test_files if {
    some file in input.changed_files
    endswith(file.path, ".test.ts")
}

has_any_test_files if {
    some file in input.changed_files
    endswith(file.path, ".test.tsx")
}

# Helper: Check for risk surface documentation (case-insensitive)
has_risk_surface_documentation if {
    lower_pr_body := lower(input.pr_body)
    contains(lower_pr_body, "risk surface")
}

has_risk_surface_documentation if {
    lower_pr_body := lower(input.pr_body)
    contains(lower_pr_body, "files affected")
}

has_risk_surface_documentation if {
    lower_pr_body := lower(input.pr_body)
    contains(lower_pr_body, "dependencies")
}

has_risk_surface_documentation if {
    lower_pr_body := lower(input.pr_body)
    contains(lower_pr_body, "breaking changes")
}

has_risk_surface_documentation if {
    lower_pr_body := lower(input.pr_body)
    contains(lower_pr_body, "rollback plan")
}

# Helper: Check if code is stable (simplified - full check in script, case-insensitive)
is_code_stable(file_path) if {
    lower_pr_body := lower(input.pr_body)
    # Assume stable if no explicit stability issues mentioned
    not contains(lower_pr_body, "failing tests")
    not contains(lower_pr_body, "known bugs")
    not contains(lower_pr_body, "unstable")
}

# Helper: Check for breaking changes (simplified - full check in script)
has_breaking_changes(diff) if {
    # Check for function signature changes
    regex.match(`function\s+\w+\([^)]*\)\s*:\s*\w+`, diff)
    regex.match(`async\s+function\s+\w+\([^)]*\)\s*:\s*Promise`, diff)
}

has_breaking_changes(diff) if {
    # Check for error message changes (simplified)
    contains(diff, "throw new Error")
    contains(diff, "Error(")
}

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

# Get service name from matches, or "unknown" if no match
get_service_name(matches) := matches[0][1] if {
    count(matches) > 0
}

get_service_name(matches) := "unknown" if {
    count(matches) == 0
}

# Check for override marker in PR body
has_override_marker(pr_body, rule) if {
    contains(pr_body, "@override:")
    contains(pr_body, rule)
}

# Check if file is exempted
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
# PERFORMANCE NOTES
# =============================================================================
# - Early exit on file path checks (string matching before regex)
# - Regex patterns optimized for common cases
# - No full dependency graph analysis (too slow)
# - Target: <200ms per evaluation

