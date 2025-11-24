# Documentation Policy - Naming Conventions
# 
# This policy enforces naming conventions for VeroField:
# - R23: Naming Conventions (Tier 3 - WARNING)
#
# Created: 2025-11-23
# Version: 1.0.0

package compliance.documentation

import future.keywords.contains
import future.keywords.if
import future.keywords.in

# Policy metadata
metadata := {
    "name": "Naming Conventions",
    "domain": "documentation",
    "tier": "3",  # WARNING - Naming is best practice
    "version": "1.0.0",
    "created": "2025-11-23",
    "description": "Enforces naming conventions (PascalCase, camelCase, UPPER_SNAKE_CASE, kebab-case) and detects old naming patterns"
}

# =============================================================================
# R23: NAMING CONVENTIONS (TIER 3 - WARNING)
# =============================================================================
# Enforce naming conventions: PascalCase for components/types, camelCase for functions,
# UPPER_SNAKE_CASE for constants, kebab-case for directories/configs, and detect old naming

# Helper: Extract filename from path
get_filename(path) := filename if {
    parts := split(path, "/")
    filename := parts[count(parts) - 1]
}

# Helper: Check if file is a component file (.tsx)
is_component_file(file) if {
    endswith(file.path, ".tsx")
}

# Helper: Check if file is a utility file (.ts, not .tsx, not .types.ts, not .d.ts)
is_utility_file(file) if {
    endswith(file.path, ".ts")
    not endswith(file.path, ".tsx")
    not endswith(file.path, ".d.ts")
    not endswith(file.path, ".types.ts")
    not endswith(file.path, ".spec.ts")
    not endswith(file.path, ".test.ts")
}

# Helper: Check if file is a config file
is_config_file(file) if {
    endswith(file.path, ".json")
}

is_config_file(file) if {
    endswith(file.path, ".yaml")
}

is_config_file(file) if {
    endswith(file.path, ".yml")
}

is_config_file(file) if {
    endswith(file.path, ".config.ts")
}

# Helper: Check if path is a directory (ends with /)
is_directory(path) if {
    endswith(path, "/")
}

# Helper: Check if component name uses PascalCase
# Pattern: Starts with uppercase letter, followed by alphanumeric
is_pascal_case(name) if {
    regex.match(`^[A-Z][a-zA-Z0-9]*$`, name)
}

# Helper: Check if function name uses camelCase
# Pattern: Starts with lowercase letter, followed by alphanumeric
is_camel_case(name) if {
    regex.match(`^[a-z][a-zA-Z0-9]*$`, name)
}

# Helper: Check if constant name uses UPPER_SNAKE_CASE
# Pattern: All uppercase, underscores allowed
is_upper_snake_case(name) if {
    regex.match(`^[A-Z][A-Z0-9_]*$`, name)
}

# Helper: Check if directory/config name uses kebab-case
# Pattern: Lowercase, hyphens allowed, no underscores
is_kebab_case(name) if {
    regex.match(`^[a-z][a-z0-9-]*$`, name)
}

# Helper: Check for old naming patterns (case-insensitive)
has_old_naming(file) if {
    lower_diff := lower(file.diff)
    contains(lower_diff, "verosuite")
}

has_old_naming(file) if {
    lower_diff := lower(file.diff)
    regex.match(`@verosuite/`, lower_diff)
}

# Helper: Check if component filename matches PascalCase
component_filename_valid(file) if {
    is_component_file(file)
    filename := get_filename(file.path)
    # Remove extension
    name := replace(filename, ".tsx", "")
    is_pascal_case(name)
}

# Helper: Check if utility filename matches camelCase
utility_filename_valid(file) if {
    is_utility_file(file)
    filename := get_filename(file.path)
    # Remove extension
    name := replace(filename, ".ts", "")
    is_camel_case(name)
}

# Helper: Check if config filename matches kebab-case
config_filename_valid(file) if {
    is_config_file(file)
    filename := get_filename(file.path)
    # Remove extension for config files
    name := replace(replace(replace(replace(filename, ".json", ""), ".yaml", ""), ".yml", ""), ".config.ts", "")
    is_kebab_case(name)
}

# Helper: Check if directory name matches lowercase/kebab-case
directory_name_valid(path) if {
    is_directory(path)
    # Extract directory name (last part before /)
    parts := split(path, "/")
    dir_name := parts[count(parts) - 2]  # Second to last (last is empty due to trailing /)
    is_kebab_case(dir_name)
}

directory_name_valid(path) if {
    is_directory(path)
    parts := split(path, "/")
    dir_name := parts[count(parts) - 2]
    # Also allow pure lowercase (no hyphens)
    regex.match(`^[a-z][a-z0-9]*$`, dir_name)
}

# R23-W01: Component not using PascalCase
naming_convention_warnings[msg] if {
    some file in input.changed_files
    is_component_file(file)
    not component_filename_valid(file)
    
    filename := get_filename(file.path)
    name := replace(filename, ".tsx", "")
    
    msg := sprintf(
        "WARNING [Documentation/R23]: Component file '%s' should use PascalCase naming (e.g., 'Button.tsx', 'WorkOrderForm.tsx'). Current: '%s'. Suggested: Use PascalCase starting with uppercase letter.",
        [file.path, name]
    )
}

# R23-W02: Function/utility file not using camelCase
naming_convention_warnings[msg] if {
    some file in input.changed_files
    is_utility_file(file)
    not utility_filename_valid(file)
    
    filename := get_filename(file.path)
    name := replace(filename, ".ts", "")
    
    msg := sprintf(
        "WARNING [Documentation/R23]: Utility file '%s' should use camelCase naming (e.g., 'userService.ts', 'workOrderUtils.ts'). Current: '%s'. Suggested: Use camelCase starting with lowercase letter.",
        [file.path, name]
    )
}

# R23-W03: Config file not using kebab-case
naming_convention_warnings[msg] if {
    some file in input.changed_files
    is_config_file(file)
    not config_filename_valid(file)
    
    filename := get_filename(file.path)
    
    msg := sprintf(
        "WARNING [Documentation/R23]: Config file '%s' should use kebab-case naming (e.g., 'app-config.json', 'database.yaml'). Current: '%s'. Suggested: Use kebab-case (lowercase with hyphens).",
        [file.path, filename]
    )
}

# R23-W04: Directory not using lowercase/kebab-case
naming_convention_warnings[msg] if {
    some file in input.changed_files
    is_directory(file.path)
    not directory_name_valid(file.path)
    
    parts := split(file.path, "/")
    dir_name := parts[count(parts) - 2]
    
    msg := sprintf(
        "WARNING [Documentation/R23]: Directory '%s' should use lowercase or kebab-case naming (e.g., 'work-orders', 'user-management'). Current: '%s'. Suggested: Use lowercase or kebab-case (lowercase with hyphens).",
        [file.path, dir_name]
    )
}

# R23-W05: Old naming detected (VeroSuite, @verosuite/*)
naming_convention_warnings[msg] if {
    some file in input.changed_files
    has_old_naming(file)
    
    msg := sprintf(
        "WARNING [Documentation/R23]: Old naming pattern detected in '%s'. Replace 'VeroSuite' with 'VeroField' and '@verosuite/*' with '@verofield/*'. Both code and comments should be updated for consistency.",
        [file.path]
    )
}

# R23-W06: File name doesn't match component/function name (simplified - detailed check in script)
# Note: This is a simplified check. The Python script will do detailed AST analysis
# to verify file names match component/function names inside files.
# OPA policy only checks for obvious mismatches (e.g., Button.tsx with SubmitButton component).

# Export warnings
warn contains msg if {
    naming_convention_warnings[msg]
}

