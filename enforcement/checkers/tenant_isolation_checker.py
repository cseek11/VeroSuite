"""
Tenant isolation checker for detecting missing tenant_id filters in Prisma queries.

Detects:
- Prisma queries on tenant-scoped tables without tenant_id filter
- Client-provided tenant_id being used instead of authenticated JWT

Python Bible Chapter 11: Clean Architecture principles.
"""

import re
import json
import os
import logging
from pathlib import Path
from typing import List, Optional, Set
from datetime import datetime, timezone

from .base_checker import BaseChecker, CheckerResult, CheckerStatus
from .models import Violation
from .exceptions import CheckerExecutionError
from .backend_utils import is_test_file

# Import Prisma query parser
# Note: Using absolute import to avoid linter warnings
import sys
from pathlib import Path
_enforcement_dir = Path(__file__).parent.parent
if str(_enforcement_dir) not in sys.path:
    sys.path.insert(0, str(_enforcement_dir))
from prisma_query_parser import parse_prisma_calls, PrismaCall

# Import auto-fix suggestions
from ..autofix_suggestions import tenant_filter_fix_hint, client_tenant_fix_hint

# Debug logging setup
DEBUG_ENABLED = os.getenv("VEROFIELD_ENFORCER_DEBUG") == "1"
debug_logger = None

if DEBUG_ENABLED:
    debug_logger = logging.getLogger("verofield.tenant_isolation")
    if not debug_logger.handlers:
        debug_log_file = Path(__file__).parent.parent.parent / ".cursor" / "enforcer_tenant_isolation_debug.log"
        debug_log_file.parent.mkdir(parents=True, exist_ok=True)
        handler = logging.FileHandler(debug_log_file)
        handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
        debug_logger.addHandler(handler)
        debug_logger.setLevel(logging.DEBUG)


class TenantIsolationChecker(BaseChecker):
    """
    Checker for enforcing tenant isolation in Prisma queries.
    
    Enforces:
    - All Prisma queries on tenant-scoped tables must include tenant_id filter
    - Tenant_id must come from authenticated JWT, not client input
    """
    
    # Operations that should be tenant-scoped
    TENANT_SCOPED_OPERATIONS = {
        'findMany', 'findFirst', 'findUnique', 'update', 'delete', 'upsert', 'create'
    }
    
    # Patterns for client-provided tenant_id (forbidden)
    CLIENT_TENANT_ID_PATTERNS = [
        r'req\.(body|query|params)\.tenant[Ii]d',
        r'request\.(body|query|params)\.tenant[Ii]d',
        r'query\.tenant[Ii]d',
        r'body\.tenant[Ii]d',
        r'params\.tenant[Ii]d',
        r'@Query\(["\']tenant[Ii]d["\']\)',
        r'@Param\(["\']tenant[Ii]d["\']\)',
    ]
    
    # Patterns for allowed tenant_id sources (from JWT/auth)
    ALLOWED_TENANT_ID_PATTERNS = [
        r'currentUser\.tenant[Ii]d',
        r'user\.tenant[Ii]d',
        r'jwt\.tenant[Ii]d',
        r'auth\.tenant[Ii]d',
        r'request\.user\.tenant[Ii]d',
        r'req\.user\.tenant[Ii]d',
    ]
    
    def __init__(self, *args, **kwargs):
        """Initialize checker and load tenant-scoped tables."""
        super().__init__(*args, **kwargs)
        self.tenant_scoped_tables: Set[str] = self._load_tenant_tables()
    
    def _load_tenant_tables(self) -> Set[str]:
        """
        Load list of tenant-scoped tables from config file.
        
        Returns:
            Set of table names that require tenant filtering
        """
        tenant_tables_file = self.project_root / '.cursor' / 'enforcement' / 'tenant_tables.json'
        
        if tenant_tables_file.exists():
            try:
                with open(tenant_tables_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return set(data.get('tenant_scoped_tables', []))
            except (json.JSONDecodeError, IOError):
                pass
        
        # Fallback: return common tenant-scoped tables
        return {
            'customer', 'customerProfile', 'order', 'invoice', 'payment',
            'workOrder', 'user', 'auditLog', 'complianceRecord'
        }
    
    def check(self, changed_files: List[str], user_message: Optional[str] = None) -> CheckerResult:
        """
        Execute tenant isolation checks.
        
        Args:
            changed_files: List of file paths that have changed
            user_message: Optional user message for context
            
        Returns:
            CheckerResult with violations and status
        """
        start_time = datetime.now(timezone.utc)
        violations = []
        checks_passed = []
        checks_failed = []
        files_checked = 0
        
        try:
            # Filter to backend TypeScript files
            backend_files = [
                f for f in changed_files
                if f.startswith('apps/api/') and f.endswith('.ts')
            ]
            files_checked = len(backend_files)
            
            for file_path_str in backend_files:
                file_path = self.project_root / file_path_str
                
                if not file_path.exists():
                    continue
                
                # Skip test files using shared utility
                if is_test_file(file_path):
                    continue
                
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        lines = content.split('\n')
                    
                    if DEBUG_ENABLED and debug_logger:
                        debug_logger.debug(f"CHECK: {file_path}")
                    
                    # Parse all Prisma calls in the file
                    prisma_calls = parse_prisma_calls(file_path, content)
                    
                    if DEBUG_ENABLED and debug_logger:
                        debug_logger.debug(f"  Found {len(prisma_calls)} Prisma calls")
                    
                    # Check for missing tenant_id filters in Prisma queries
                    violations.extend(
                        self._check_missing_tenant_filters(file_path_str, prisma_calls)
                    )
                    
                    # Check for client-provided tenant_id
                    violations.extend(
                        self._check_client_tenant_id(file_path_str, lines, content, prisma_calls)
                    )
                    
                except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError) as e:
                    if DEBUG_ENABLED and debug_logger:
                        debug_logger.debug(f"SKIP: {file_path} (reason=read error: {e})")
                    continue
            
            # Determine overall status
            if violations:
                checks_failed.append("Tenant Isolation Compliance")
                status = CheckerStatus.FAILED
            else:
                checks_passed.append("Tenant Isolation Compliance")
                status = CheckerStatus.SUCCESS
            
            execution_time = (datetime.now(timezone.utc) - start_time).total_seconds() * 1000
            
            # Convert Violation objects to dict format
            violation_dicts = [v.to_dict() for v in violations]
            
            return self._create_result(
                status=status,
                violations=violation_dicts,
                checks_passed=checks_passed,
                checks_failed=checks_failed,
                execution_time_ms=execution_time,
                files_checked=files_checked,
            )
            
        except Exception as e:
            raise CheckerExecutionError(f"Tenant isolation checker failed: {e}") from e
    
    def _check_missing_tenant_filters(
        self,
        file_path: str,
        prisma_calls: List[PrismaCall]
    ) -> List[Violation]:
        """
        Check for Prisma queries on tenant-scoped tables without tenant_id filter.
        
        Uses parsed PrismaCall objects for precise per-call analysis.
        
        Args:
            file_path: Path to the file being checked
            prisma_calls: List of parsed Prisma calls from the file
            
        Returns:
            List of Violation objects
        """
        violations = []
        tenant_scoped_count = 0
        missing_filter_count = 0
        
        for call in prisma_calls:
            # Check if this model is tenant-scoped
            model_lower = call.model.lower()
            tenant_scoped_lower = {t.lower() for t in self.tenant_scoped_tables}
            if model_lower not in tenant_scoped_lower:
                continue
            
            # Check if this operation should be tenant-scoped
            if call.op not in self.TENANT_SCOPED_OPERATIONS:
                continue
            
            tenant_scoped_count += 1
            
            # Check if where clause exists and has tenant key
            if call.where_text is None or not call.where_has_tenant_key:
                missing_filter_count += 1
                
                if DEBUG_ENABLED and debug_logger:
                    debug_logger.debug(
                        f"  VIOLATION: {call.model}.{call.op} at line {call.line_number} "
                        f"missing tenant filter (where_text={'present' if call.where_text else 'missing'}, "
                        f"has_tenant_key={call.where_has_tenant_key})"
                    )
                
                violations.append(Violation(
                    severity='BLOCKING',
                    rule_ref='SEC-R01-001',
                    message=f'Prisma call prisma.{call.model}.{call.op} is missing tenantId filter in where clause for tenant-scoped model "{call.model}".',
                    file_path=file_path,
                    line_number=call.line_number,
                    fix_hint=tenant_filter_fix_hint(call.model, call.op),
                    session_scope='current_session'
                ))
        
        if DEBUG_ENABLED and debug_logger:
            debug_logger.debug(
                f"  Summary: {tenant_scoped_count} tenant-scoped calls, "
                f"{missing_filter_count} missing tenant filter"
            )
        
        return violations
    
    def _check_client_tenant_id(
        self,
        file_path: str,
        lines: List[str],
        content: str,
        prisma_calls: List[PrismaCall]
    ) -> List[Violation]:
        """
        Check for client-provided tenant_id being used in Prisma queries.
        
        Args:
            file_path: Path to the file being checked
            lines: List of lines in the file
            content: Full file content
            prisma_calls: List of parsed Prisma calls (for context)
            
        Returns:
            List of Violation objects
        """
        violations = []
        
        # Check each Prisma call's where clause for client-provided tenantId
        for call in prisma_calls:
            if call.where_text is None:
                continue
            
            # Check if where clause contains client-provided tenantId patterns
            for pattern in self.CLIENT_TENANT_ID_PATTERNS:
                if re.search(pattern, call.where_text):
                    violations.append(Violation(
                        severity='BLOCKING',
                        rule_ref='SEC-R01-002',
                        message='Tenant ID must be derived from authenticated identity (JWT/current user), not client input.',
                        file_path=file_path,
                        line_number=call.line_number,
                        fix_hint=client_tenant_fix_hint(),
                        session_scope='current_session'
                    ))
                    break  # Only report once per call
        
        # Also check file-level patterns (for cases where tenantId is extracted before the query)
        for pattern in self.CLIENT_TENANT_ID_PATTERNS:
            for match in re.finditer(pattern, content):
                line_num = content[:match.start()].count('\n') + 1
                line = lines[line_num - 1] if line_num <= len(lines) else ''
                
                # Skip if in comment
                if line.strip().startswith('//') or line.strip().startswith('#'):
                    continue
                
                # Check if there's a Prisma call nearby (within 20 lines)
                nearby_calls = [
                    call for call in prisma_calls
                    if abs(call.line_number - line_num) <= 20
                ]
                
                if nearby_calls:
                    violations.append(Violation(
                        severity='BLOCKING',
                        rule_ref='SEC-R01-002',
                        message='Tenant ID must be derived from authenticated identity (JWT/current user), not client input.',
                        file_path=file_path,
                        line_number=line_num,
                        fix_hint=client_tenant_fix_hint(),
                        session_scope='current_session'
                    ))
        
        return violations

