# Backend Architecture Patterns Policy (R11)
# Enforces clean NestJS architecture, safe Prisma usage, and consistent backend patterns

package verofield.backend

import future.keywords.if
import future.keywords.in

# ============================================================================
# R11: Backend Patterns
# ============================================================================

# Violation 1: Business logic in controllers
business_logic_in_controller[msg] if {
    some file in input.files
    is_controller_file(file.path)
    
    # Check for Prisma calls in controller
    has_prisma_calls(file.content)
    
    msg := sprintf("VIOLATION (R11): Business logic detected in controller '%s'. Controllers should be thin and delegate to services. Move Prisma calls and business logic to service layer.", [file.path])
}

business_logic_in_controller[msg] if {
    some file in input.files
    is_controller_file(file.path)
    
    # Check for complex conditionals (business rules)
    has_complex_conditionals(file.content)
    
    msg := sprintf("VIOLATION (R11): Complex business logic detected in controller '%s'. Controllers should only handle HTTP transport. Move validation and business rules to service layer.", [file.path])
}

business_logic_in_controller[msg] if {
    some file in input.files
    is_controller_file(file.path)
    
    # Check for calculations/transformations
    has_calculations(file.content)
    
    msg := sprintf("VIOLATION (R11): Business calculations detected in controller '%s'. Controllers should not perform data transformations. Move calculations to service layer.", [file.path])
}

# Violation 2: Missing DTOs or validation
missing_dto_validation[msg] if {
    some file in input.files
    is_controller_file(file.path)
    
    # Check for @Body() without DTO type
    has_body_with_any_type(file.content)
    
    msg := sprintf("VIOLATION (R11): Controller '%s' uses 'any' type for @Body() parameter. Create and use a proper DTO with validation decorators.", [file.path])
}

missing_dto_validation[msg] if {
    some file in input.files
    is_controller_file(file.path)
    
    # Check for missing DTO files in module
    module_dir := get_module_directory(file.path)
    not has_dto_files(module_dir)
    
    msg := sprintf("VIOLATION (R11): Controller '%s' has no corresponding DTO files. Create DTOs in '%s/dto/' with class-validator decorators.", [file.path, module_dir])
}

missing_dto_validation[msg] if {
    some file in input.files
    is_dto_file(file.path)
    
    # Check for 'any' types in DTOs
    has_any_types_in_dto(file.content)
    
    msg := sprintf("VIOLATION (R11): DTO '%s' contains 'any' types. Use proper TypeScript types for all properties.", [file.path])
}

missing_dto_validation[msg] if {
    some file in input.files
    is_dto_file(file.path)
    
    # Check for missing validation decorators
    has_unvalidated_properties(file.content)
    
    msg := sprintf("VIOLATION (R11): DTO '%s' has properties without validation decorators. Add @IsString(), @IsEmail(), etc. from class-validator.", [file.path])
}

# Violation 3: Tenant-scoped queries without tenant filters
missing_tenant_isolation[msg] if {
    some file in input.files
    is_service_file(file.path)
    
    # Check for Prisma queries on tenant-scoped tables without tenant_id
    query := find_prisma_query_without_tenant(file.content)
    query != null
    
    msg := sprintf("VIOLATION (R11): Service '%s' has Prisma query on tenant-scoped table '%s' without tenant_id filter (line %d). Add tenant_id to where clause or use RLS context. See R01 (Tenant Isolation) and R02 (RLS Enforcement).", [file.path, query.table, query.line])
}

# Violation 4: Multi-step operations without transactions
missing_transaction[msg] if {
    some file in input.files
    is_service_file(file.path)
    
    # Check for multiple Prisma mutations without transaction
    method := find_method_with_multiple_mutations(file.content)
    method != null
    not has_transaction_wrapper(method)
    
    msg := sprintf("VIOLATION (R11): Service method '%s' in '%s' has multiple Prisma operations without transaction (line %d). Wrap operations in prisma.$transaction() for data consistency.", [method.name, file.path, method.line])
}

# Violation 5: Service is simple pass-through (no business logic)
service_passthrough[msg] if {
    some file in input.files
    is_service_file(file.path)
    
    # Check for simple pass-through methods (no business logic)
    method := find_passthrough_method(file.content)
    method != null
    
    # Allow if explicitly marked as repository pattern
    not is_repository_pattern(file.path)
    
    msg := sprintf("VIOLATION (R11): Service method '%s' in '%s' is a simple pass-through to Prisma (line %d). Services should contain business logic (validation, calculations, state transitions). Consider using repository pattern if intentional.", [method.name, file.path, method.line])
}

# Warning: Patterns exist but may be incomplete
incomplete_patterns[msg] if {
    some file in input.files
    is_service_file(file.path)
    
    # Has some business logic but missing key patterns
    has_some_business_logic(file.content)
    missing_patterns := find_missing_patterns(file.content)
    count(missing_patterns) > 0
    
    msg := sprintf("WARNING (R11): Service '%s' has business logic but may be missing patterns: %v. Consider adding: error handling, audit logging, or structured logging.", [file.path, missing_patterns])
}

# ============================================================================
# Override Mechanism
# ============================================================================

has_override(marker) if {
    some file in input.files
    contains(file.content, marker)
}

has_override(marker) if {
    contains(input.pr_description, marker)
}

# Main deny rule
deny[msg] if {
    count(business_logic_in_controller) > 0
    not has_override("@override:backend-patterns")
    
    violations := concat("\n", business_logic_in_controller)
    msg := sprintf("OVERRIDE REQUIRED (R11): Backend pattern violations detected:\n%s\n\nTo override, add '@override:backend-patterns' with justification in PR description.", [violations])
}

deny[msg] if {
    count(missing_dto_validation) > 0
    not has_override("@override:backend-patterns")
    
    violations := concat("\n", missing_dto_validation)
    msg := sprintf("OVERRIDE REQUIRED (R11): DTO validation violations detected:\n%s\n\nTo override, add '@override:backend-patterns' with justification in PR description.", [violations])
}

deny[msg] if {
    count(missing_tenant_isolation) > 0
    not has_override("@override:backend-patterns")
    
    violations := concat("\n", missing_tenant_isolation)
    msg := sprintf("OVERRIDE REQUIRED (R11): Tenant isolation violations detected:\n%s\n\nThis is a critical security issue. See R01 (Tenant Isolation) and R02 (RLS Enforcement). To override, add '@override:backend-patterns' with strong justification.", [violations])
}

deny[msg] if {
    count(missing_transaction) > 0
    not has_override("@override:backend-patterns")
    
    violations := concat("\n", missing_transaction)
    msg := sprintf("OVERRIDE REQUIRED (R11): Transaction violations detected:\n%s\n\nMulti-step operations require transactions for data consistency. To override, add '@override:backend-patterns' with justification.", [violations])
}

deny[msg] if {
    count(service_passthrough) > 0
    not has_override("@override:backend-patterns")
    
    violations := concat("\n", service_passthrough)
    msg := sprintf("OVERRIDE REQUIRED (R11): Service pass-through violations detected:\n%s\n\nServices should contain business logic. To override (e.g., repository pattern), add '@override:backend-patterns' with justification.", [violations])
}

# Warning rule (doesn't block)
warn[msg] if {
    count(incomplete_patterns) > 0
    
    warnings := concat("\n", incomplete_patterns)
    msg := sprintf("WARNING (R11): Backend patterns may be incomplete:\n%s", [warnings])
}

# ============================================================================
# Helper Functions
# ============================================================================

# File type detection
is_controller_file(path) if {
    endswith(path, ".controller.ts")
}

is_service_file(path) if {
    endswith(path, ".service.ts")
}

is_dto_file(path) if {
    contains(path, "/dto/")
    endswith(path, ".dto.ts")
}

# Prisma call detection
has_prisma_calls(content) if {
    # Direct Prisma calls in controller
    patterns := [
        "this.prisma.",
        "prisma.account.",
        "prisma.workOrder.",
        "prisma.user.",
        ".findFirst(",
        ".findUnique(",
        ".findMany(",
        ".create(",
        ".update(",
        ".delete(",
    ]
    
    some pattern in patterns
    contains(content, pattern)
}

# Complex conditional detection
has_complex_conditionals(content) if {
    # Nested conditionals (more than simple null checks)
    regex.match(`if\s*\([^)]*\)\s*\{[^}]*if\s*\(`, content)
}

has_complex_conditionals(content) if {
    # Switch statements (business rules)
    contains(content, "switch")
}

# Calculation detection
has_calculations(content) if {
    patterns := [
        "Math.",
        ".reduce(",
        ".map(",
        ".filter(",
        " * ",
        " / ",
        " + ",
        " - ",
    ]
    
    some pattern in patterns
    contains(content, pattern)
}

# DTO validation detection
has_body_with_any_type(content) if {
    # @Body() parameter with 'any' type
    regex.match(`@Body\(\)\s+\w+:\s*any`, content)
}

has_any_types_in_dto(content) if {
    # Properties with 'any' type in DTO
    regex.match(`\w+:\s*any`, content)
}

has_unvalidated_properties(content) if {
    # Properties without validation decorators
    # This is a heuristic - actual implementation would use AST
    has_properties := regex.match(`\w+!?:\s*string`, content)
    has_validation := contains(content, "@IsString()")
    
    has_properties
    not has_validation
}

# Tenant isolation detection
find_prisma_query_without_tenant(content) := query if {
    # Tenant-scoped tables
    tenant_tables := ["account", "workOrder", "user", "invoice", "payment", "serviceAgreement"]
    
    # Find Prisma query on tenant-scoped table
    some table in tenant_tables
    regex.match(sprintf(`prisma\.%s\.(findFirst|findUnique|findMany|create|update|delete)\(`, [table]), content)
    
    # Check if tenant_id is in where clause
    not contains(content, "tenant_id")
    not contains(content, "withTenant")
    
    query := {
        "table": table,
        "line": 0  # Would be actual line number in real implementation
    }
}

# Transaction detection
find_method_with_multiple_mutations(content) := method if {
    # Count mutation operations
    mutation_count := count([op | 
        op := ["create(", "update(", "delete(", "createMany(", "updateMany(", "deleteMany("][_]
        contains(content, op)
    ])
    
    mutation_count > 1
    
    method := {
        "name": "method_name",  # Would be actual method name in real implementation
        "line": 0
    }
}

has_transaction_wrapper(method) if {
    contains(method.content, "$transaction")
}

# Pass-through detection
find_passthrough_method(content) := method if {
    # Simple pattern: return this.prisma.X with no other logic
    regex.match(`async\s+\w+\([^)]*\)\s*\{\s*return\s+this\.prisma\.\w+\.\w+\(`, content)
    
    # No validation, no calculations, no state transitions
    not contains(content, "if (")
    not contains(content, "throw")
    not contains(content, "Math.")
    
    method := {
        "name": "method_name",
        "line": 0
    }
}

is_repository_pattern(path) if {
    contains(path, ".repository.ts")
}

# Business logic detection
has_some_business_logic(content) if {
    patterns := [
        "throw new",
        "if (",
        "switch",
        "Math.",
        "$transaction",
    ]
    
    some pattern in patterns
    contains(content, pattern)
}

find_missing_patterns(content) := patterns if {
    all_patterns := {
        "error_handling": contains(content, "try") or contains(content, "catch"),
        "audit_logging": contains(content, "audit.log") or contains(content, "auditService"),
        "structured_logging": contains(content, "logger.") or contains(content, "Logger"),
    }
    
    patterns := [name | 
        some name, present in all_patterns
        not present
    ]
}

# Module directory detection
get_module_directory(path) := dir if {
    parts := split(path, "/")
    count(parts) > 1
    dir := concat("/", array.slice(parts, 0, count(parts) - 1))
}

has_dto_files(module_dir) if {
    some file in input.files
    startswith(file.path, module_dir)
    contains(file.path, "/dto/")
}

# ============================================================================
# Metadata
# ============================================================================

metadata := {
    "rule_id": "R11",
    "rule_name": "Backend Patterns",
    "tier": 2,
    "enforcement": "OVERRIDE",
    "priority": "HIGH",
    "description": "Enforces clean NestJS architecture, safe Prisma usage, and consistent backend patterns",
    "related_rules": ["R01", "R02", "R07", "R08"],
    "version": "1.0.0",
    "last_updated": "2025-11-23"
}



