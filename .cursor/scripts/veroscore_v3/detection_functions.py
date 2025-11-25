#!/usr/bin/env python3
"""
Detection Functions for VeroScore V3.

Phase 4: Detection Functions Implementation
Last Updated: 2025-11-24

Detects violations with massive penalties:
- RLS violations: -100
- Architecture drift: -75
- Hardcoded values: -60
- Security vulnerabilities: -50
- Logging compliance: -30/-20
"""

import re
import json
import subprocess
from dataclasses import dataclass, asdict
from typing import List, Optional, Dict, Any
from pathlib import Path

import sys
from pathlib import Path

# Add scripts directory to path for logger_util
scripts_dir = Path(__file__).parent.parent
if str(scripts_dir) not in sys.path:
    sys.path.insert(0, str(scripts_dir))

from logger_util import get_logger, get_or_create_trace_context

logger = get_logger(context="DetectionFunctions")


def is_test_file(file_path: str) -> bool:
    """
    Improved test file detection.
    
    Only returns True for actual test files, not files with 'test' in name.
    
    Args:
        file_path: Path to check
        
    Returns:
        True if this is a test file that should be skipped
    """
    path_lower = file_path.lower()
    
    # Check for test file extensions (most reliable)
    if re.search(r'\.(spec|test)\.(ts|js|tsx|jsx|py)$', path_lower):
        return True
    
    # Check for test directories
    if re.search(r'/(tests?|__tests__|spec)/', path_lower):
        return True
    
    # Check for pytest pattern
    if re.search(r'/test_\w+\.py$', path_lower):
        return True
    
    return False


def normalize_multiline_code(content: str) -> str:
    """
    Normalize multi-line code for pattern matching.
    
    Preserves logical structure while making patterns matchable.
    
    Args:
        content: Source code to normalize
        
    Returns:
        Normalized code with reduced whitespace
    """
    # Remove comments first
    content = re.sub(r'//.*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
    
    # Replace multiple whitespace/newlines with single space
    # but preserve statement boundaries
    normalized = re.sub(r'\s+', ' ', content)
    
    return normalized


@dataclass
class ViolationResult:
    """
    Detected violation result.
    
    Matches scoring engine structure for integration.
    """
    detector_name: str
    severity: str  # 'critical', 'high', 'medium', 'low'
    rule_id: str
    message: str
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    penalty: float = 0.0
    code_snippet: Optional[str] = None
    suggested_fix: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization."""
        return asdict(self)


class RLSViolationDetector:
    """
    Detects Row Level Security (RLS) violations.
    
    Penalty: -100 (CRITICAL)
    """
    
    VIOLATION_PATTERNS = [
        # Prisma queries without tenant_id filter
        (r'\.findMany\(\)', 'Prisma findMany without tenant filter'),
        (r'\.findFirst\(\)', 'Prisma findFirst without tenant filter'),
        
        # Supabase queries without tenant_id - single line pattern
        (r'\.from\(["\']\w+["\']\)\.select\(\)', 'Supabase query without tenant_id filter'),
        (r'\.from\(["\']\w+["\']\)\.select\(\)\.limit\(', 'Supabase query with limit but no tenant filter'),
        
        # Direct SQL without tenant_id
        (r'SELECT\s+\*\s+FROM\s+\w+\s+(?!WHERE.*tenant_id)', 'SQL SELECT without tenant_id WHERE clause'),
        
        # Service role bypass (without justification comment)
        (r'service_role', 'Service role usage detected'),
        (r'serviceRoleKey', 'Service role key detected'),
        
        # Admin RPC calls without checks
        (r'\.rpc\(["\']admin_', 'Admin RPC call without authorization check'),
    ]
    
    # Multi-line patterns (checked separately)
    MULTILINE_PATTERNS = [
        (r'\.from\(["\']\w+["\']\)\s*\.select\(\)', 'Multi-line Supabase query without tenant_id filter'),
    ]
    
    def _has_rls_exempt_comment(self, line: str, all_lines: List[str], line_index: int) -> bool:
        """
        Check if there's an RLS-exempt comment associated with this line.
        
        Checks:
        1. Inline comment on the same line (e.g., `// RLS-exempt`)
        2. Comment on the line directly above
        3. Comment 2 lines above (for multi-line queries)
        4. Block comments in surrounding context
        
        Args:
            line: Current line being checked
            all_lines: All lines in the file
            line_index: Zero-based index of current line
            
        Returns:
            True if RLS-exempt comment found, False otherwise
        """
        # Check inline comment on same line
        # Pattern: // or # followed by any text containing RLS-exempt (case-insensitive)
        if re.search(r'(//|#).*RLS-exempt', line, re.IGNORECASE):
            return True
        
        # Check line directly above (line_index - 1)
        if line_index > 0:
            prev_line = all_lines[line_index - 1].strip()
            if re.search(r'(//|#).*RLS-exempt', prev_line, re.IGNORECASE):
                return True
        
        # Check 2 lines above (for multi-line queries)
        if line_index > 1:
            prev_prev_line = all_lines[line_index - 2].strip()
            if re.search(r'(//|#).*RLS-exempt', prev_prev_line, re.IGNORECASE):
                return True
        
        # Check for block comments in surrounding context (3 lines before to current line)
        context_start = max(0, line_index - 3)
        context = '\n'.join(all_lines[context_start:line_index + 1])
        if re.search(r'/\*.*RLS-exempt.*\*/|/\*.*rls-exempt.*\*/', context, re.IGNORECASE | re.DOTALL):
            return True
        
        # Check for veroscore:ignore comments
        context_lines = all_lines[max(0, line_index - 2):line_index + 1]
        context_text = '\n'.join(context_lines)
        if re.search(r'veroscore:ignore\s+(rls|RLS)', context_text, re.IGNORECASE):
            return True
        
        return False
    
    def detect(self, file_path: str, content: str) -> List[ViolationResult]:
        """
        Detect RLS violations in file content.
        
        Enhanced with multi-line pattern matching support.
        
        Args:
            file_path: Path to file being analyzed
            content: File content as string
            
        Returns:
            List of ViolationResult objects
        """
        violations = []
        trace_ctx = get_or_create_trace_context()
        
        # Skip non-database files
        if not any(keyword in content.lower() for keyword in ['supabase', 'prisma', 'select', 'from', 'insert', 'update', 'delete']):
            return violations
        
        lines = content.split('\n')
        
        # First pass: Check line-by-line for single-line patterns
        for pattern, description in self.VIOLATION_PATTERNS:
            for i, line in enumerate(lines, 1):
                if re.search(pattern, line, re.IGNORECASE):
                    # Check for RLS-exempt comments (inline, above, or in block comments)
                    if self._has_rls_exempt_comment(line, lines, i - 1):
                        continue
                    
                    # Skip if already has tenant_id filter
                    if 'tenant_id' in line.lower() or '.eq("tenant_id' in line.lower():
                        continue
                    
                    violations.append(ViolationResult(
                        detector_name='rls_violation_detector',
                        severity='critical',
                        rule_id='RLS-001',
                        message=description,
                        file_path=file_path,
                        line_number=i,
                        penalty=-100.0,
                        code_snippet=line.strip()[:200],  # Limit snippet length
                        suggested_fix='Add .eq("tenant_id", tenantId) filter or use withTenant() wrapper'
                    ))
        
        # Second pass: Check normalized content for multi-line patterns
        normalized = normalize_multiline_code(content)
        
        for pattern, description in self.MULTILINE_PATTERNS:
            matches = re.finditer(pattern, normalized)
            for match in matches:
                # Check if this query has tenant_id filter in the surrounding context
                query_start = match.start()
                query_segment = normalized[max(0, query_start-50):min(len(normalized), query_start+200)]
                
                if 'tenant_id' not in query_segment.lower() and '.eq(' not in query_segment.lower():
                    # Find approximate line number in original content
                    line_num = content[:match.start()].count('\n') + 1
                    
                    # Don't duplicate if already found in first pass
                    if not any(v.line_number == line_num for v in violations):
                        # Check for RLS-exempt comments in ORIGINAL content (not normalized)
                        # Get the actual line from original content
                        if line_num <= len(lines):
                            actual_line = lines[line_num - 1]
                            # Also check surrounding lines for comments
                            if self._has_rls_exempt_comment(actual_line, lines, line_num - 1):
                                continue
                        
                        violations.append(ViolationResult(
                            detector_name='rls_violation_detector',
                            severity='critical',
                            rule_id='RLS-001',
                            message=description,
                            file_path=file_path,
                            line_number=line_num,
                            penalty=-100.0,
                            code_snippet=content.split('\n')[line_num-1].strip()[:200] if line_num <= len(lines) else '',
                            suggested_fix='Add .eq("tenant_id", tenantId) filter or use withTenant() wrapper'
                        ))
        
        logger.debug(
            "RLS violation detection completed",
            operation="detect",
            file_path=file_path,
            violation_count=len(violations),
            **trace_ctx
        )
        
        return violations


class ArchitectureDriftDetector:
    """
    Detects architecture boundary violations.
    
    Penalty: -75 (CRITICAL)
    """
    
    BOUNDARIES = {
        'cross_service_import': {
            'pattern': r'import.*from\s+["\'][^"\']*apps\/[^"\']*(?!api)',
            'message': 'Cross-service relative import detected',
            'fix': 'Use HTTP/events communication or shared libs (libs/common/)'
        },
        'frontend_to_backend': {
            'pattern': r'import.*from\s+["\']\.\.\/\.\.\/apps\/api',
            'message': 'Frontend directly importing from backend',
            'fix': 'Use API client wrapper or shared types only'
        },
        'deprecated_path': {
            'pattern': r'import.*from\s+["\'][^"\']*backend',
            'message': 'Using deprecated backend path',
            'fix': 'Use apps/api/src/ or libs/common/prisma/ instead'
        },
        'wrong_schema_location': {
            'pattern': r'backend\/prisma\/schema',
            'message': 'Schema file in wrong location',
            'fix': 'Move to libs/common/prisma/schema.prisma'
        },
        'old_naming': {
            'pattern': r'@verosuite\/|VeroSuite',
            'message': 'Old naming (VeroSuite) detected',
            'fix': 'Use @verofield/ or VeroField instead'
        },
    }
    
    def detect(self, file_path: str, content: str) -> List[ViolationResult]:
        """Detect architecture violations."""
        violations = []
        trace_ctx = get_or_create_trace_context()
        
        lines = content.split('\n')
        
        # Check import patterns
        for boundary_name, rule in self.BOUNDARIES.items():
            for i, line in enumerate(lines, 1):
                if re.search(rule['pattern'], line):
                    # Check for exception comments
                    if any(exempt in line for exempt in ['// ARCH-exempt', '# ARCH-exempt']):
                        continue
                    
                    violations.append(ViolationResult(
                        detector_name='architecture_drift_detector',
                        severity='critical',
                        rule_id=f'ARCH-{boundary_name.upper()}',
                        message=rule['message'],
                        file_path=file_path,
                        line_number=i,
                        penalty=-75.0,
                        code_snippet=line.strip()[:200],
                        suggested_fix=rule['fix']
                    ))
        
        # Check file placement
        violations.extend(self._check_file_placement(file_path))
        
        logger.debug(
            "Architecture drift detection completed",
            operation="detect",
            file_path=file_path,
            violation_count=len(violations),
            **trace_ctx
        )
        
        return violations
    
    def _check_file_placement(self, file_path: str) -> List[ViolationResult]:
        """Check if file is in correct directory structure."""
        violations = []
        
        # Check for deprecated paths
        deprecated_paths = [
            ('backend/src/', 'apps/api/src/'),
            ('backend/prisma/', 'libs/common/prisma/'),
            ('backend/', 'apps/api/'),
        ]
        
        for deprecated, correct in deprecated_paths:
            if deprecated in file_path:
                violations.append(ViolationResult(
                    detector_name='architecture_drift_detector',
                    severity='critical',
                    rule_id='ARCH-PLACEMENT',
                    message=f'File in deprecated path: {deprecated}',
                    file_path=file_path,
                    penalty=-75.0,
                    suggested_fix=f'Move to {correct}'
                ))
        
        return violations


class HardcodedValueDetector:
    """
    Detects hardcoded secrets, tenant IDs, dates.
    
    Penalty: -60 (CRITICAL)
    """
    
    SECRET_PATTERNS = [
        (r'api[_-]?key\s*=\s*["\'][a-zA-Z0-9]{20,}["\']', 'API key'),
        (r'secret\s*=\s*["\'][a-zA-Z0-9]{20,}["\']', 'Secret'),
        (r'password\s*=\s*["\'][^"\']{8,}["\']', 'Password'),
        (r'token\s*=\s*["\'][a-zA-Z0-9]{20,}["\']', 'Token'),
        (r'SUPABASE_KEY\s*=\s*["\']eyJ', 'Supabase key'),
        (r'sk_live_', 'Stripe live key'),
        (r'pk_live_', 'Stripe publishable live key'),
        (r'ghp_[a-zA-Z0-9]{36,}', 'GitHub PAT'),
    ]
    
    TENANT_ID_PATTERNS = [
        r'tenant_id\s*=\s*["\'][a-f0-9-]{8,}["\']',  # UUID format (at least 8 chars)
        r'user_id\s*=\s*["\'][a-f0-9-]{8,}["\']',  # UUID format
        r'organization_id\s*=\s*["\'][a-f0-9-]{8,}["\']',  # UUID format
    ]
    
    DATE_PATTERNS = [
        r'["\'](2024|2025|2026)-\d{2}-\d{2}["\']',  # String dates like "2025-11-24"
        r'new Date\(["\'](2024|2025|2026)-\d{2}-\d{2}',  # JavaScript Date
        r'datetime\(202[4-6]',  # Python datetime
        r'Date\(202[4-6]',  # General Date constructor
    ]
    
    def detect(self, file_path: str, content: str) -> List[ViolationResult]:
        """Detect hardcoded values."""
        violations = []
        trace_ctx = get_or_create_trace_context()
        
        lines = content.split('\n')
        
        # Check secrets
        for pattern, secret_type in self.SECRET_PATTERNS:
            for i, line in enumerate(lines, 1):
                if re.search(pattern, line, re.IGNORECASE):
                    # Skip if it's in a comment or example
                    if line.strip().startswith('//') or line.strip().startswith('#') or 'example' in line.lower():
                        continue
                    
                    violations.append(ViolationResult(
                        detector_name='hardcoded_value_detector',
                        severity='critical',
                        rule_id='HARDCODE-SECRET',
                        message=f'Hardcoded {secret_type} detected',
                        file_path=file_path,
                        line_number=i,
                        penalty=-60.0,
                        code_snippet=self._redact_secret(line.strip()[:200]),
                        suggested_fix='Use environment variable or secrets manager'
                    ))
        
        # Check tenant IDs
        for pattern in self.TENANT_ID_PATTERNS:
            for i, line in enumerate(lines, 1):
                if re.search(pattern, line):
                    # Skip if it's in a test file (using improved detection)
                    if is_test_file(file_path):
                        continue
                    
                    # Skip if it's in a comment or example
                    stripped = line.strip()
                    if stripped.startswith('//') or stripped.startswith('#') or stripped.startswith('*'):
                        continue
                    if 'example' in line.lower() or 'sample' in line.lower():
                        continue
                    
                    violations.append(ViolationResult(
                        detector_name='hardcoded_value_detector',
                        severity='critical',
                        rule_id='HARDCODE-TENANT-ID',
                        message='Hardcoded tenant/user ID',
                        file_path=file_path,
                        line_number=i,
                        penalty=-60.0,
                        code_snippet=line.strip()[:200],
                        suggested_fix='Use dynamic session data or request context'
                    ))
        
        # Check dates - look for date strings in code
        for pattern in self.DATE_PATTERNS:
            for i, line in enumerate(lines, 1):
                if re.search(pattern, line):
                    # Skip if it's in a test file (using improved detection)
                    if is_test_file(file_path):
                        continue
                    
                    # Skip if it's in a migration file
                    if 'migration' in file_path.lower():
                        continue
                    
                    # Skip if it's in a comment or documentation
                    stripped = line.strip()
                    if stripped.startswith('//') or stripped.startswith('#') or stripped.startswith('*'):
                        continue
                    
                    # Skip if it's clearly a variable name (like date2025) but NOT in a string assignment
                    if re.search(r'\b\w*202[4-6]\w*\b(?!\s*[=:])', line) and '=' not in line:
                        continue
                    
                    # Skip if it's in a test fixture or mock
                    if 'fixture' in line.lower() or 'mock' in line.lower():
                        continue
                    
                    violations.append(ViolationResult(
                        detector_name='hardcoded_value_detector',
                        severity='high',
                        rule_id='HARDCODE-DATE',
                        message='Hardcoded date detected',
                        file_path=file_path,
                        line_number=i,
                        penalty=-60.0,
                        code_snippet=line.strip()[:200],
                        suggested_fix='Use Date.now(), datetime.now(), or current system date'
                    ))
        
        logger.debug(
            "Hardcoded value detection completed",
            operation="detect",
            file_path=file_path,
            violation_count=len(violations),
            **trace_ctx
        )
        
        return violations
    
    def _redact_secret(self, line: str) -> str:
        """Redact secret values in snippet."""
        # Redact long strings that look like secrets
        return re.sub(r'["\'][a-zA-Z0-9]{15,}["\']', '"***REDACTED***"', line)


class SecurityVulnerabilityDetector:
    """
    Detects XSS, SQL injection, and other security vulnerabilities.
    
    Penalty: -50 (CRITICAL)
    """
    
    XSS_PATTERNS = [
        (r'dangerouslySetInnerHTML', 'React dangerouslySetInnerHTML without sanitization'),
        (r'v-html\s*=', 'Vue v-html directive without sanitization'),
        (r'innerHTML\s*=', 'Direct innerHTML assignment'),
        (r'\.html\(', 'jQuery .html() method'),
    ]
    
    SQL_INJECTION_PATTERNS = [
        (r'f"SELECT.*\{', 'Python f-string in SQL query'),
        (r'`SELECT.*\${', 'JavaScript template literal in SQL'),
        (r'\+.*SELECT', 'String concatenation in SQL query'),
        (r'\.format\(.*SELECT', 'String format in SQL query'),
    ]
    
    def detect(self, file_path: str, content: str) -> List[ViolationResult]:
        """Detect security vulnerabilities."""
        violations = []
        trace_ctx = get_or_create_trace_context()
        
        lines = content.split('\n')
        
        # Check XSS
        for pattern, description in self.XSS_PATTERNS:
            for i, line in enumerate(lines, 1):
                if re.search(pattern, line):
                    # Check for sanitization
                    if any(safe in line.lower() for safe in ['sanitize', 'dompurify', 'xss', 'escape']):
                        continue
                    
                    violations.append(ViolationResult(
                        detector_name='security_vulnerability_detector',
                        severity='critical',
                        rule_id='SEC-XSS',
                        message=description,
                        file_path=file_path,
                        line_number=i,
                        penalty=-50.0,
                        code_snippet=line.strip()[:200],
                        suggested_fix='Sanitize user input or use safe rendering methods'
                    ))
        
        # Check SQL injection
        for pattern, description in self.SQL_INJECTION_PATTERNS:
            for i, line in enumerate(lines, 1):
                if re.search(pattern, line):
                    violations.append(ViolationResult(
                        detector_name='security_vulnerability_detector',
                        severity='critical',
                        rule_id='SEC-SQL-INJECTION',
                        message=description,
                        file_path=file_path,
                        line_number=i,
                        penalty=-50.0,
                        code_snippet=line.strip()[:200],
                        suggested_fix='Use parameterized queries or ORM methods (Prisma handles this)'
                    ))
        
        logger.debug(
            "Security vulnerability detection completed",
            operation="detect",
            file_path=file_path,
            violation_count=len(violations),
            **trace_ctx
        )
        
        return violations


class LoggingComplianceDetector:
    """
    Detects unstructured logging and missing traceId.
    
    Penalties:
    - Unstructured logging: -30
    - Missing traceId: -20
    """
    
    UNSTRUCTURED_PATTERNS = [
        (r'console\.log\(', 'console.log in production code'),
        (r'console\.error\(', 'console.error in production code'),
        (r'console\.warn\(', 'console.warn in production code'),
        (r'print\(', 'Python print() in production code'),
        (r'System\.out\.println', 'Java System.out.println'),
    ]
    
    def detect(self, file_path: str, content: str) -> List[ViolationResult]:
        """Detect logging compliance issues."""
        violations = []
        trace_ctx = get_or_create_trace_context()
        
        lines = content.split('\n')
        
        # Check for unstructured logging
        for pattern, description in self.UNSTRUCTURED_PATTERNS:
            for i, line in enumerate(lines, 1):
                if re.search(pattern, line):
                    # Skip if it's in a test file (using improved detection)
                    if is_test_file(file_path):
                        continue
                    
                    # Skip if it's commented out
                    stripped = line.strip()
                    if stripped.startswith('//') or stripped.startswith('#') or stripped.startswith('*'):
                        continue
                    
                    # Skip if it's already using structured logging (check surrounding context)
                    context_lines = lines[max(0, i-3):min(len(lines), i+2)]
                    context = '\n'.join(context_lines)
                    structured_logging = [
                        'logger.', 'log.info', 'log.error', 'log.warn',
                        'structlog', 'get_logger', 'winston', 'pino'
                    ]
                    if any(log_lib in context for log_lib in structured_logging):
                        continue
                    
                    violations.append(ViolationResult(
                        detector_name='logging_compliance_detector',
                        severity='high',
                        rule_id='LOG-UNSTRUCTURED',
                        message=description,
                        file_path=file_path,
                        line_number=i,
                        penalty=-30.0,
                        code_snippet=line.strip()[:200],
                        suggested_fix='Use structured logger (logger_util.get_logger() or structured logging)'
                    ))
        
        # Check for missing traceId in async operations
        # This is a simplified check - full analysis would require AST parsing
        async_functions = re.findall(r'async\s+(?:def|function)\s+(\w+)', content)
        for func_name in async_functions:
            func_content = self._extract_function(content, func_name)
            if func_content and 'trace' not in func_content.lower() and 'traceId' not in func_content.lower():
                # Only flag if there are logging calls without traceId
                if any(log in func_content for log in ['logger.', 'log.', 'console.log']):
                    violations.append(ViolationResult(
                        detector_name='logging_compliance_detector',
                        severity='medium',
                        rule_id='LOG-MISSING-TRACE-ID',
                        message=f'Async function {func_name} may be missing traceId propagation',
                        file_path=file_path,
                        penalty=-20.0,
                        suggested_fix='Ensure traceId is propagated through async operations'
                    ))
        
        logger.debug(
            "Logging compliance detection completed",
            operation="detect",
            file_path=file_path,
            violation_count=len(violations),
            **trace_ctx
        )
        
        return violations
    
    def _extract_function(self, content: str, func_name: str) -> Optional[str]:
        """Extract function content (simplified - full AST parsing would be better)."""
        # Simple regex-based extraction
        pattern = rf'async\s+(?:def|function)\s+{func_name}\s*\([^)]*\)\s*{{(.*?)}}'
        match = re.search(pattern, content, re.DOTALL)
        if match:
            return match.group(1)
        return None


class MasterDetector:
    """
    Orchestrates all detectors and aggregates results.
    
    Runs all detectors on files and aggregates violations/warnings.
    """
    
    def __init__(self):
        """Initialize master detector with all sub-detectors."""
        self.detectors = [
            RLSViolationDetector(),
            ArchitectureDriftDetector(),
            HardcodedValueDetector(),
            SecurityVulnerabilityDetector(),
            LoggingComplianceDetector(),
        ]
        self.trace_ctx = get_or_create_trace_context()
        
        logger.info(
            "MasterDetector initialized",
            operation="__init__",
            detector_count=len(self.detectors),
            **self.trace_ctx
        )
    
    def detect_all(self, file_paths: List[str], base_path: Optional[Path] = None) -> Dict[str, Any]:
        """
        Run all detectors on a list of files.
        
        Args:
            file_paths: List of file paths to analyze
            base_path: Base path for resolving relative paths
            
        Returns:
            Dictionary with violations, warnings, and summary
        """
        all_violations = []
        all_warnings = []
        
        for file_path in file_paths:
            try:
                # Resolve path
                if base_path:
                    full_path = base_path / file_path if not Path(file_path).is_absolute() else Path(file_path)
                else:
                    full_path = Path(file_path)
                
                if not full_path.exists():
                    logger.warn(
                        "File not found, skipping detection",
                        operation="detect_all",
                        file_path=str(full_path),
                        **self.trace_ctx
                    )
                    continue
                
                # Read file content
                try:
                    content = full_path.read_text(encoding='utf-8')
                except UnicodeDecodeError:
                    # Skip binary files
                    logger.debug(
                        "Skipping binary file",
                        operation="detect_all",
                        file_path=str(full_path),
                        **self.trace_ctx
                    )
                    continue
                
                # Run all detectors
                for detector in self.detectors:
                    try:
                        violations = detector.detect(str(full_path), content)
                        for violation in violations:
                            if violation.severity in ['critical', 'high']:
                                all_violations.append(violation)  # Keep as ViolationResult object
                            else:
                                all_warnings.append(violation)  # Keep as ViolationResult object
                    except Exception as e:
                        logger.error(
                            f"Detector {detector.__class__.__name__} failed",
                            operation="detect_all",
                            error_code="DETECTOR_FAILED",
                            root_cause=str(e),
                            file_path=str(full_path),
                            **self.trace_ctx
                        )
                        # Continue with other detectors
                        continue
                        
            except Exception as e:
                logger.error(
                    "Failed to process file",
                    operation="detect_all",
                    error_code="FILE_PROCESSING_FAILED",
                    root_cause=str(e),
                    file_path=file_path,
                    **self.trace_ctx
                )
                continue
        
        # Calculate summary
        total_penalty = sum(v.penalty for v in all_violations + all_warnings)
        violations_by_detector = {}
        for v in all_violations + all_warnings:
            detector = v.detector_name
            violations_by_detector[detector] = violations_by_detector.get(detector, 0) + 1
        
        result = {
            'violations': all_violations,
            'warnings': all_warnings,
            'summary': {
                'total_violations': len(all_violations),
                'total_warnings': len(all_warnings),
                'total_penalty': total_penalty,
                'violations_by_detector': violations_by_detector,
                'files_checked': len(file_paths)
            }
        }
        
        logger.info(
            "Detection completed",
            operation="detect_all",
            total_violations=len(all_violations),
            total_warnings=len(all_warnings),
            total_penalty=total_penalty,
            **self.trace_ctx
        )
        
        return result

