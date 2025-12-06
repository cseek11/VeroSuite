#!/usr/bin/env python3
"""
R12: Security Event Logging Checker

Detects violations of security event logging requirements:
- Authentication events (login, logout, password changes)
- Authorization events (permission denials, role changes)
- PII access events (privileged contexts)
- Security policy changes (RLS, permissions, roles)
- Admin actions (impersonation, privilege escalation)
- Financial transactions (payments, refunds)

Usage:
    python check-security-logging.py --file <file_path>
    python check-security-logging.py --pr <PR_NUMBER>
    python check-security-logging.py --event-type auth
    python check-security-logging.py --all
"""

import os
import re
import sys
import json
import argparse
from pathlib import Path
from typing import List, Dict, Optional, Set
from dataclasses import dataclass
from enum import Enum

# ============================================================================
# Configuration
# ============================================================================

# PII fields configuration
PII_FIELDS = [
    'email', 'phone', 'phoneNumber', 'mobile',
    'ssn', 'socialSecurity', 'taxId',
    'creditCard', 'ccNumber', 'cardNumber',
    'bankAccount', 'routingNumber',
    'passport', 'driversLicense',
    'birthDate', 'dateOfBirth', 'dob'
]

# ============================================================================
# Data Classes
# ============================================================================

class SecurityEventCategory(Enum):
    AUTHENTICATION = 'authentication'
    AUTHORIZATION = 'authorization'
    PII_ACCESS = 'pii_access'
    ADMIN_ACTION = 'admin_action'
    FINANCIAL = 'financial'
    POLICY_CHANGE = 'policy_change'

@dataclass
class SecurityEvent:
    """Represents a detected security event"""
    category: SecurityEventCategory
    operation: str
    line: int
    has_audit_log: bool
    missing_fields: List[str]

@dataclass
class Violation:
    """Represents a security logging violation"""
    rule: str
    severity: str  # 'error' or 'warning'
    file: str
    line: int
    message: str
    suggestion: str
    category: str

# ============================================================================
# Security Event Patterns
# ============================================================================

SECURITY_EVENT_PATTERNS = {
    SecurityEventCategory.AUTHENTICATION: [
        r'async\s+login\s*\(',
        r'async\s+logout\s*\(',
        r'validateCredentials\s*\(',
        r'authenticate\s*\(',
        r'changePassword\s*\(',
        r'resetPassword\s*\(',
        r'refreshToken\s*\(',
    ],
    SecurityEventCategory.AUTHORIZATION: [
        r'checkPermission\s*\(',
        r'hasPermission\s*\(',
        r'requirePermission\s*\(',
        r'@RequirePermissions?\s*\(',
        r'@UseGuards.*RbacGuard',
        r'throw\s+new\s+ForbiddenException',
    ],
    SecurityEventCategory.PII_ACCESS: [
        r'select:\s*\{[^}]*(?:email|ssn|phone|creditCard)',
        r'\.email\s*[,;]',
        r'\.ssn\s*[,;]',
        r'\.creditCard',
        r'\.phone\s*[,;]',
    ],
    SecurityEventCategory.ADMIN_ACTION: [
        r'impersonate\s*\(',
        r'escalate.*privilege',
        r'@Admin\s*\(',
        r'requireAdmin\s*\(',
        r'suspendUser\s*\(',
        r'deleteUser\s*\(',
    ],
    SecurityEventCategory.FINANCIAL: [
        r'processPayment\s*\(',
        r'refund\s*\(',
        r'charge\s*\(',
        r'updateBilling\s*\(',
    ],
    SecurityEventCategory.POLICY_CHANGE: [
        r'ALTER\s+TABLE.*ROW\s+LEVEL\s+SECURITY',
        r'CREATE\s+POLICY',
        r'DROP\s+POLICY',
        r'updatePermissions\s*\(',
        r'assignRole\s*\(',
        r'removeRole\s*\(',
    ]
}

# Required fields by category
REQUIRED_FIELDS_BY_CATEGORY = {
    SecurityEventCategory.AUTHENTICATION: {
        'mandatory': ['action', 'ipAddress'],
        'optional': ['userId', 'tenantId'],  # May be unknown on failed login
    },
    SecurityEventCategory.AUTHORIZATION: {
        'mandatory': ['userId', 'action', 'resourceType', 'tenantId'],
        'optional': ['resourceId', 'requiredPermission'],
    },
    SecurityEventCategory.PII_ACCESS: {
        'mandatory': ['userId', 'resourceType', 'resourceId', 'tenantId'],
        'optional': ['dataTypes', 'accessReason'],
    },
    SecurityEventCategory.ADMIN_ACTION: {
        'mandatory': ['userId', 'action', 'resourceType', 'tenantId', 'ipAddress'],
        'optional': ['targetUserId', 'reason'],
    },
    SecurityEventCategory.FINANCIAL: {
        'mandatory': ['userId', 'action', 'amount', 'currency', 'tenantId'],
        'optional': ['transactionId', 'beforeState', 'afterState'],
    },
    SecurityEventCategory.POLICY_CHANGE: {
        'mandatory': ['userId', 'action', 'tenantId'],
        'optional': ['policyType', 'policyName', 'beforeState', 'afterState'],
    }
}

# ============================================================================
# Security Event Analyzer
# ============================================================================

class SecurityEventAnalyzer:
    """Analyzes code for security events and audit logging"""
    
    def __init__(self, file_path: str, content: str):
        self.file_path = file_path
        self.content = content
        self.lines = content.split('\n')
        
    def analyze(self) -> List[Violation]:
        """Analyze file for security logging violations"""
        violations = []
        
        # Check each security event category
        for category in SecurityEventCategory:
            violations.extend(self._check_category(category))
        
        # Check for privacy violations (raw PII in logs)
        violations.extend(self._check_privacy_compliance())
        
        return violations
    
    def _check_category(self, category: SecurityEventCategory) -> List[Violation]:
        """Check for security events in a specific category"""
        violations = []
        patterns = SECURITY_EVENT_PATTERNS.get(category, [])
        
        for i, line in enumerate(self.lines, 1):
            for pattern in patterns:
                if re.search(pattern, line):
                    # Found security event, check if logged
                    has_audit_log = self._has_audit_log_nearby(i)
                    
                    if not has_audit_log:
                        violations.append(Violation(
                            rule='R12',
                            severity='error',
                            file=self.file_path,
                            line=i,
                            message=f"Security event ({category.value}) not logged",
                            suggestion=self._get_suggestion_for_category(category),
                            category=category.value
                        ))
                    else:
                        # Verify audit log has required fields
                        missing_fields = self._check_audit_log_fields(i, category)
                        if missing_fields:
                            violations.append(Violation(
                                rule='R12',
                                severity='warning',
                                file=self.file_path,
                                line=i,
                                message=f"Audit log missing required fields: {', '.join(missing_fields)}",
                                suggestion=f"Add missing fields to audit log: {', '.join(missing_fields)}",
                                category=category.value
                            ))
                    
                    break  # Only report once per line
        
        return violations
    
    def _has_audit_log_nearby(self, line_num: int, window: int = 20) -> bool:
        """Check if auditService.log() is called nearby"""
        start = max(0, line_num - window)
        end = min(len(self.lines), line_num + window)
        
        context = '\n'.join(self.lines[start:end])
        
        # Check for audit service calls
        audit_patterns = [
            r'auditService\.log\s*\(',
            r'audit\.log\s*\(',
            r'this\.audit\.log\s*\(',
            r'this\.auditService\.log\s*\(',
        ]
        
        return any(re.search(pattern, context) for pattern in audit_patterns)
    
    def _check_audit_log_fields(self, line_num: int, category: SecurityEventCategory) -> List[str]:
        """Check if audit log has required fields"""
        # Find audit log call
        start = max(0, line_num - 20)
        end = min(len(self.lines), line_num + 20)
        
        context = '\n'.join(self.lines[start:end])
        
        # Extract audit log parameters (simplified heuristic)
        required_fields = REQUIRED_FIELDS_BY_CATEGORY[category]['mandatory']
        missing_fields = []
        
        for field in required_fields:
            if field not in context:
                missing_fields.append(field)
        
        return missing_fields
    
    def _check_privacy_compliance(self) -> List[Violation]:
        """Check for raw PII values in audit logs"""
        violations = []
        
        for i, line in enumerate(self.lines, 1):
            # Check if line contains audit log call
            if 'auditService.log' in line or 'audit.log' in line:
                # Look for raw PII patterns in next 10 lines
                start = i - 1
                end = min(len(self.lines), i + 10)
                context = '\n'.join(self.lines[start:end])
                
                # Detect raw PII patterns
                pii_violations = self._detect_raw_pii(context)
                
                if pii_violations:
                    violations.append(Violation(
                        rule='R12',
                        severity='warning',
                        file=self.file_path,
                        line=i,
                        message=f"Potential raw PII in audit log: {', '.join(pii_violations)}",
                        suggestion="Log metadata only (field names, types), not raw PII values. Use: fieldsUpdated: ['email', 'phone'] instead of email: 'user@example.com'",
                        category='privacy_compliance'
                    ))
        
        return violations
    
    def _detect_raw_pii(self, context: str) -> List[str]:
        """Detect raw PII values in audit log context"""
        violations = []
        
        # Pattern 1: Direct PII field assignments in afterState/beforeState
        pii_field_patterns = [
            (r'email:\s*[\'"]([^\'\"]+@[^\'\"]+)[\'"]', 'email'),
            (r'ssn:\s*[\'"](\d{3}-\d{2}-\d{4})[\'"]', 'ssn'),
            (r'phone:\s*[\'"](\+?\d[\d\s\-\(\)]+)[\'"]', 'phone'),
            (r'creditCard:\s*[\'"](\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4})[\'"]', 'creditCard'),
        ]
        
        for pattern, field_name in pii_field_patterns:
            if re.search(pattern, context):
                violations.append(field_name)
        
        return violations
    
    def _get_suggestion_for_category(self, category: SecurityEventCategory) -> str:
        """Get suggestion message for category"""
        suggestions = {
            SecurityEventCategory.AUTHENTICATION: "Add auditService.log() with: action, ipAddress, userAgent, userId (if known), tenantId (if known)",
            SecurityEventCategory.AUTHORIZATION: "Add auditService.log() with: userId, action, resourceType, resourceId, tenantId, requiredPermission",
            SecurityEventCategory.PII_ACCESS: "Add auditService.log() with: userId, resourceType, resourceId, dataTypes (metadata only), tenantId, accessReason",
            SecurityEventCategory.ADMIN_ACTION: "Add auditService.log() with: userId, action, resourceType, tenantId, ipAddress, targetUserId (if applicable)",
            SecurityEventCategory.FINANCIAL: "Add auditService.log() with: userId, action, amount, currency, transactionId, tenantId",
            SecurityEventCategory.POLICY_CHANGE: "Add auditService.log() with: userId, action, policyType, policyName, beforeState, afterState, tenantId",
        }
        
        return suggestions.get(category, "Add auditService.log() with appropriate fields")

# ============================================================================
# Main Checker
# ============================================================================

class SecurityLoggingChecker:
    """Main checker for security event logging"""
    
    def __init__(self):
        self.violations: List[Violation] = []
        
    def check_file(self, file_path: str) -> List[Violation]:
        """Check a single file for violations"""
        if not os.path.exists(file_path):
            print(f"Error: File not found: {file_path}", file=sys.stderr)
            return []
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        analyzer = SecurityEventAnalyzer(file_path, content)
        return analyzer.analyze()
    
    def check_pr(self, pr_number: str) -> List[Violation]:
        """Check all changed files in a PR"""
        import subprocess
        
        try:
            result = subprocess.run(
                ['git', 'diff', '--name-only', f'origin/main...HEAD'],
                capture_output=True,
                text=True,
                check=True
            )
            
            changed_files = result.stdout.strip().split('\n')
            
            violations = []
            for file in changed_files:
                if file.endswith('.ts') and not file.endswith('.spec.ts'):
                    violations.extend(self.check_file(file))
            
            return violations
            
        except subprocess.CalledProcessError as e:
            print(f"Error: Failed to get changed files: {e}", file=sys.stderr)
            return []
    
    def check_event_type(self, event_type: str) -> List[Violation]:
        """Check all files for specific event type"""
        category_map = {
            'auth': SecurityEventCategory.AUTHENTICATION,
            'authz': SecurityEventCategory.AUTHORIZATION,
            'pii': SecurityEventCategory.PII_ACCESS,
            'admin': SecurityEventCategory.ADMIN_ACTION,
            'financial': SecurityEventCategory.FINANCIAL,
            'policy': SecurityEventCategory.POLICY_CHANGE,
        }
        
        category = category_map.get(event_type)
        if not category:
            print(f"Error: Unknown event type: {event_type}", file=sys.stderr)
            print(f"Valid types: {', '.join(category_map.keys())}", file=sys.stderr)
            return []
        
        violations = []
        
        # Search all TypeScript files
        for root, dirs, files in os.walk('apps/api/src'):
            for file in files:
                if file.endswith('.ts') and not file.endswith('.spec.ts'):
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        analyzer = SecurityEventAnalyzer(file_path, content)
                        file_violations = analyzer._check_category(category)
                        violations.extend(file_violations)
                    except (OSError, IOError, UnicodeDecodeError) as e:
                        print(f"Error reading file {file_path}: {e}", file=sys.stderr)
                        continue
        
        return violations
    
    def check_all(self) -> List[Violation]:
        """Check all backend files"""
        violations = []
        
        backend_dirs = [
            "apps/api/src",
            "backend/src",
        ]
        
        for backend_dir in backend_dirs:
            if os.path.exists(backend_dir):
                for root, dirs, files in os.walk(backend_dir):
                    # Skip test directories
                    if '__tests__' in root or 'test' in root:
                        continue
                    
                    for file in files:
                        if file.endswith('.ts') and not file.endswith('.spec.ts'):
                            file_path = os.path.join(root, file)
                            violations.extend(self.check_file(file_path))
        
        return violations
    
    def format_output(self, violations: List[Violation], format: str = 'text') -> str:
        """Format violations for output"""
        if format == 'json':
            return json.dumps([{
                'rule': v.rule,
                'severity': v.severity,
                'file': v.file,
                'line': v.line,
                'message': v.message,
                'suggestion': v.suggestion,
                'category': v.category
            } for v in violations], indent=2)
        
        # Text format
        output = []
        
        if not violations:
            output.append("✅ No security logging violations found!")
            return '\n'.join(output)
        
        # Group by category
        by_category = {}
        for v in violations:
            if v.category not in by_category:
                by_category[v.category] = []
            by_category[v.category].append(v)
        
        # Summary
        error_count = len([v for v in violations if v.severity == 'error'])
        warning_count = len([v for v in violations if v.severity == 'warning'])
        
        output.append(f"\n❌ Security Logging Violations: {error_count} errors, {warning_count} warnings\n")
        
        # Details by category
        for category, cat_violations in sorted(by_category.items()):
            output.append(f"\n{'='*80}")
            output.append(f"{category.upper().replace('_', ' ')} VIOLATIONS ({len(cat_violations)})")
            output.append('='*80)
            
            for v in cat_violations:
                severity_icon = '❌' if v.severity == 'error' else '⚠️'
                output.append(f"\n{severity_icon} {v.file}:{v.line}")
                output.append(f"   Message: {v.message}")
                output.append(f"   Suggestion: {v.suggestion}")
        
        output.append(f"\n{'='*80}")
        output.append(f"SUMMARY: {error_count} errors, {warning_count} warnings")
        output.append('='*80)
        
        return '\n'.join(output)

# ============================================================================
# CLI
# ============================================================================

def main():
    parser = argparse.ArgumentParser(
        description='Check code for security event logging violations (R12)'
    )
    
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--file', help='Check a single file')
    group.add_argument('--pr', help='Check all changed files in a PR')
    group.add_argument('--event-type', choices=['auth', 'authz', 'pii', 'admin', 'financial', 'policy'],
                      help='Check all files for specific event type')
    group.add_argument('--all', action='store_true', help='Check all backend files')
    
    parser.add_argument('--format', choices=['text', 'json'], default='text',
                       help='Output format (default: text)')
    parser.add_argument('--strict', action='store_true',
                       help='Treat warnings as errors')
    
    args = parser.parse_args()
    
    checker = SecurityLoggingChecker()
    
    # Run checks
    if args.file:
        violations = checker.check_file(args.file)
    elif args.pr:
        violations = checker.check_pr(args.pr)
    elif args.event_type:
        violations = checker.check_event_type(args.event_type)
    elif args.all:
        violations = checker.check_all()
    
    # Output results
    output = checker.format_output(violations, args.format)
    print(output)
    
    # Exit code
    error_count = len([v for v in violations if v.severity == 'error'])
    warning_count = len([v for v in violations if v.severity == 'warning'])
    
    if error_count > 0:
        sys.exit(1)
    elif args.strict and warning_count > 0:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == '__main__':
    main()





