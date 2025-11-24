# Infrastructure Policy - Technical Stateful Entity Resilience
# 
# This policy enforces resilience requirements for Technical Stateful Entities
# (databases, caches, queues, storage systems, etc.)
#
# Created: 2025-11-23
# Version: 1.0.0

package compliance.infrastructure

import future.keywords.contains
import future.keywords.if
import future.keywords.in

# Policy metadata
metadata := {
    "name": "Technical Stateful Entity Resilience",
    "domain": "infrastructure",
    "tier": "1",  # BLOCK - Infrastructure resilience is critical
    "version": "1.0.0",
    "created": "2025-11-23",
    "description": "Ensures Technical Stateful Entities have proper resilience measures"
}

# =============================================================================
# TIER 1 MAD: HARD STOP (BLOCK)
# =============================================================================
# Technical Stateful Entities must have resilience measures

deny contains msg if {
    is_technical_stateful_entity(input.changed_files)
    not has_transaction_handling(input.changed_files)
    not has_override_marker(input.pr_body, "infrastructure-resilience")
    
    msg := sprintf(
        "HARD STOP [Infrastructure]: Technical stateful entity detected without transaction handling. Required: transaction management, backup procedures, timeout handling. Add '@override:infrastructure-resilience' with justification if intentional.",
        []
    )
}

deny contains msg if {
    is_technical_stateful_entity(input.changed_files)
    not has_connection_pooling(input.changed_files)
    not has_override_marker(input.pr_body, "infrastructure-connection")
    
    msg := sprintf(
        "HARD STOP [Infrastructure]: Technical stateful entity detected without connection pooling configuration. Add '@override:infrastructure-connection' with justification if not applicable.",
        []
    )
}

# =============================================================================
# TIER 2 MAD: OVERRIDE REQUIRED
# =============================================================================
# Backup/recovery should be documented

override contains msg if {
    is_technical_stateful_entity(input.changed_files)
    not has_backup_procedures(input.changed_files)
    not has_override_marker(input.pr_body, "infrastructure-backup")
    
    msg := sprintf(
        "OVERRIDE REQUIRED [Infrastructure]: Technical stateful entity without backup/recovery documentation. Add '@override:infrastructure-backup' with justification.",
        []
    )
}

# =============================================================================
# TIER 3 MAD: WARNING
# =============================================================================
# Best practices for infrastructure

warn contains msg if {
    is_technical_stateful_entity(input.changed_files)
    not has_monitoring_config(input.changed_files)
    
    msg := sprintf(
        "WARNING [Infrastructure]: Technical stateful entity without monitoring configuration. Consider adding health checks and metrics.",
        []
    )
}

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

# Check if files involve Technical Stateful Entities
is_technical_stateful_entity(files) if {
    some file in files
    # Database configuration files
    regex.match(`(database|db|prisma|typeorm)\.config\.(ts|js|json)`, file.path)
}

is_technical_stateful_entity(files) if {
    some file in files
    # Cache configuration files
    regex.match(`(cache|redis|memcached)\.config\.(ts|js|json)`, file.path)
}

is_technical_stateful_entity(files) if {
    some file in files
    # Queue/messaging configuration
    regex.match(`(queue|kafka|rabbitmq|sqs)\.config\.(ts|js|json)`, file.path)
}

is_technical_stateful_entity(files) if {
    some file in files
    # Storage configuration
    regex.match(`(storage|s3|blob|file)\.config\.(ts|js|json)`, file.path)
}

is_technical_stateful_entity(files) if {
    some file in files
    # Infrastructure setup files
    contains(file.path, "infrastructure/")
    regex.match(`\.(ts|js|yaml|yml)$`, file.path)
}

# Check for transaction handling
has_transaction_handling(files) if {
    some file in files
    contains(file.diff, "transaction")
    regex.match(`(BEGIN|COMMIT|ROLLBACK|@Transactional)`, file.diff)
}

has_transaction_handling(files) if {
    some file in files
    contains(file.diff, "prisma.$transaction")
}

has_transaction_handling(files) if {
    some file in files
    contains(file.diff, "withTransaction")
}

# Check for connection pooling
has_connection_pooling(files) if {
    some file in files
    regex.match(`(pool|poolSize|maxConnections|connectionLimit)`, file.diff)
}

has_connection_pooling(files) if {
    some file in files
    contains(file.diff, "connectionPool")
}

# Check for backup procedures
has_backup_procedures(files) if {
    some file in files
    contains(file.path, "docs/")
    regex.match(`(backup|recovery|disaster)`, file.path)
}

has_backup_procedures(files) if {
    some file in files
    contains(file.diff, "backup")
    contains(file.diff, "recovery")
}

# Check for monitoring configuration
has_monitoring_config(files) if {
    some file in files
    regex.match(`(health|metrics|monitoring)`, file.diff)
}

has_monitoring_config(files) if {
    some file in files
    contains(file.diff, "healthCheck")
}

# Check for override marker
has_override_marker(pr_body, marker) if {
    contains(pr_body, sprintf("@override:%s", [marker]))
}

# =============================================================================
# EXEMPTIONS
# =============================================================================

# Check if file is exempted
is_exempted(file_path) if {
    some exempted_file in data.exemptions.files
    file_path == exempted_file
}

# Check if author is exempted (e.g., infrastructure team)
is_exempted_author(author) if {
    some exempted_author in data.exemptions.authors
    author == exempted_author
}

