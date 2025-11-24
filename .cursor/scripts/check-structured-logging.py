#!/usr/bin/env python3
"""
R08: Structured Logging Checker

Verifies all logs use structured format with required fields including traceId.
Complements R07 (Error Handling) by ensuring logs are properly structured.

Usage:
    python check-structured-logging.py --file <file_path>
    python check-structured-logging.py --pr <PR_NUMBER>
    python check-structured-logging.py --all
"""

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional

# ============================================================================
# Configuration
# ============================================================================

REPO_ROOT = Path(__file__).parent.parent.parent

# Logger patterns
STRUCTURED_LOGGER_PATTERNS = [
    r'this\.logger\.(log|error|warn|info|debug)\(',
    r'StructuredLoggerService\.(log|error|warn)\(',
    r'new\s+Logger\(',
]

# Console.log patterns
CONSOLE_LOG_PATTERNS = [
    r'console\.(log|error|warn|info|debug)\s*\(',
]

# Test/script file patterns (where console.log is allowed)
ALLOWED_CONSOLE_PATTERNS = [
    r'\.spec\.ts$',
    r'\.test\.ts$',
    r'/test/',
    r'/e2e/',
    r'/scripts/',
    r'/tools/',
    r'/cli\.ts$',
    r'/seed\.ts$',
]

# Required fields for structured logging
REQUIRED_FIELDS = ['message', 'context', 'operation', 'traceId']

# ============================================================================
# Console.log Detection
# ============================================================================

def is_allowed_console_log_file(file_path: str) -> bool:
    """Check if console.log is allowed in this file."""
    return any(re.search(pattern, file_path) for pattern in ALLOWED_CONSOLE_PATTERNS)

def detect_console_logs(code: str, file_path: str) -> List[Dict[str, Any]]:
    """Detect console.log/error/warn/info/debug in production code."""
    violations = []
    
    if is_allowed_console_log_file(file_path):
        return violations
    
    lines = code.split('\n')
    
    for i, line in enumerate(lines, 1):
        for pattern in CONSOLE_LOG_PATTERNS:
            if re.search(pattern, line):
                # Check for debug comments (temporary console.log)
                if re.search(r'//\s*(TODO|FIXME|DEBUG).*console\.log', line):
                    violations.append({
                        'file': file_path,
                        'line': i,
                        'type': 'console_log_debug',
                        'severity': 'warning',
                        'code': line.strip(),
                        'suggestion': 'Debug console.log detected. Remove before commit or use structured logger.'
                    })
                else:
                    violations.append({
                        'file': file_path,
                        'line': i,
                        'type': 'console_log',
                        'severity': 'error',
                        'code': line.strip(),
                        'suggestion': 'Use structured logger (StructuredLoggerService or Logger) instead of console.log.'
                    })
    
    return violations

# ============================================================================
# Structured Logger Usage Detection
# ============================================================================

def detect_unstructured_logging(code: str, file_path: str) -> List[Dict[str, Any]]:
    """Detect logger calls with insufficient parameters."""
    violations = []
    lines = code.split('\n')
    
    # Pattern: logger.log('message') - only one parameter
    unstructured_pattern = re.compile(r'logger\.(log|error|warn|info|debug)\s*\(\s*[\'"][^\'"]+[\'"]\s*\)')
    
    for i, line in enumerate(lines, 1):
        if unstructured_pattern.search(line):
            violations.append({
                'file': file_path,
                'line': i,
                'type': 'unstructured_logging',
                'severity': 'error',
                'code': line.strip(),
                'suggestion': 'Include required fields: context, operation, traceId. Use: logger.log(message, context, requestId, operation, additionalData).'
            })
    
    return violations

# ============================================================================
# Required Fields Verification
# ============================================================================

def detect_missing_required_fields(code: str, file_path: str) -> List[Dict[str, Any]]:
    """Detect logger calls missing required fields."""
    violations = []
    lines = code.split('\n')
    
    # Pattern: logger.log(...) with fewer than 4 parameters
    logger_pattern = re.compile(r'(this\.)?logger\.(log|error|warn|info|debug)\s*\(')
    
    for i, line in enumerate(lines, 1):
        if logger_pattern.search(line):
            # Count parameters (simplified - count commas)
            param_count = line.count(',') + 1
            
            # StructuredLoggerService signature: logger.log(message, context, requestId, operation, additionalData?)
            # Minimum 4 parameters
            if param_count < 4:
                violations.append({
                    'file': file_path,
                    'line': i,
                    'type': 'missing_required_fields',
                    'severity': 'error',
                    'code': line.strip(),
                    'suggestion': f'Logger call has {param_count} parameter(s), needs at least 4: message, context, requestId, operation.'
                })
    
    return violations

# ============================================================================
# Trace ID Verification
# ============================================================================

def detect_missing_trace_id(code: str, file_path: str) -> List[Dict[str, Any]]:
    """Detect logger calls without traceId source."""
    violations = []
    lines = code.split('\n')
    
    logger_pattern = re.compile(r'(this\.)?logger\.(log|error|warn|info|debug)\s*\(')
    trace_id_patterns = [
        r'requestId',
        r'traceId',
        r'this\.requestContext\.getTraceId\(\)',
        r'request\.id',
    ]
    
    for i, line in enumerate(lines, 1):
        if logger_pattern.search(line):
            # Check if line includes traceId source
            has_trace_id = any(re.search(pattern, line) for pattern in trace_id_patterns)
            
            if not has_trace_id:
                violations.append({
                    'file': file_path,
                    'line': i,
                    'type': 'missing_trace_id',
                    'severity': 'error',
                    'code': line.strip(),
                    'suggestion': 'Include requestId parameter or use this.requestContext.getTraceId() for traceId propagation.'
                })
    
    return violations

# ============================================================================
# Context and Operation Verification
# ============================================================================

def detect_missing_context_operation(code: str, file_path: str) -> List[Dict[str, Any]]:
    """Detect logger calls with undefined/null context or operation."""
    violations = []
    lines = code.split('\n')
    
    # Pattern: logger.log(message, undefined/null, ...)
    undefined_pattern = re.compile(r'logger\.\w+\([^,]+,\s*(undefined|null)')
    
    for i, line in enumerate(lines, 1):
        if undefined_pattern.search(line):
            violations.append({
                'file': file_path,
                'line': i,
                'type': 'missing_context_operation',
                'severity': 'error',
                'code': line.strip(),
                'suggestion': 'Provide explicit context (service name) and operation (function name), not undefined/null.'
            })
    
    return violations

# ============================================================================
# Optional Fields Verification (Warnings)
# ============================================================================

def check_optional_fields(code: str, file_path: str) -> List[Dict[str, Any]]:
    """Check for missing optional fields (warnings only)."""
    warnings = []
    lines = code.split('\n')
    
    # Check for error logs without errorCode or rootCause
    error_log_pattern = re.compile(r'logger\.error\s*\(')
    
    for i, line in enumerate(lines, 1):
        if error_log_pattern.search(line):
            has_error_code = 'errorCode' in line
            has_root_cause = 'rootCause' in line
            
            if not (has_error_code or has_root_cause):
                warnings.append({
                    'file': file_path,
                    'line': i,
                    'type': 'missing_optional_fields',
                    'severity': 'warning',
                    'code': line.strip(),
                    'suggestion': 'Consider including errorCode and rootCause in additionalData for better error classification.'
                })
    
    return warnings

# ============================================================================
# Logger Injection Verification
# ============================================================================

def check_logger_injection(code: str, file_path: str) -> List[Dict[str, Any]]:
    """Check if logger is properly injected/imported."""
    warnings = []
    
    # Check if file uses logger but doesn't import/inject it
    uses_logger = re.search(r'(this\.)?logger\.(log|error|warn|info|debug)', code)
    
    if uses_logger:
        # Check for proper injection/import
        has_injection = re.search(r'constructor\([^)]*logger:', code, re.IGNORECASE)
        has_import = re.search(r'import.*Logger.*from', code)
        
        if not (has_injection or has_import):
            warnings.append({
                'file': file_path,
                'line': 0,
                'type': 'missing_logger_injection',
                'severity': 'warning',
                'code': '',
                'suggestion': 'Logger is used but not properly injected/imported. Ensure logger is injected in constructor or imported.'
            })
    
    return warnings

# ============================================================================
# Main Check Function
# ============================================================================

def check_file(file_path: str) -> Dict[str, Any]:
    """Check a single file for structured logging violations."""
    
    # Read file
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            code = f.read()
    except Exception as e:
        return {
            'file': file_path,
            'error': f'Failed to read file: {e}',
            'violations': [],
            'warnings': []
        }
    
    violations = []
    warnings = []
    
    # Run all checks
    violations.extend(detect_console_logs(code, file_path))
    violations.extend(detect_unstructured_logging(code, file_path))
    violations.extend(detect_missing_required_fields(code, file_path))
    violations.extend(detect_missing_trace_id(code, file_path))
    violations.extend(detect_missing_context_operation(code, file_path))
    
    warnings.extend(check_optional_fields(code, file_path))
    warnings.extend(check_logger_injection(code, file_path))
    
    # Separate errors from warnings
    errors = [v for v in violations if v.get('severity') == 'error']
    warnings.extend([v for v in violations if v.get('severity') == 'warning'])
    
    return {
        'file': file_path,
        'violations': errors,
        'warnings': warnings
    }

# ============================================================================
# Reporting
# ============================================================================

def format_results(results: List[Dict[str, Any]]) -> str:
    """Format check results for display."""
    total_violations = sum(len(r['violations']) for r in results)
    total_warnings = sum(len(r['warnings']) for r in results)
    
    if total_violations == 0 and total_warnings == 0:
        return "✅ No structured logging violations found."
    
    output = []
    output.append(f"\n{'='*80}")
    output.append(f"R08: Structured Logging Check Results")
    output.append(f"{'='*80}\n")
    output.append(f"Total Violations: {total_violations}")
    output.append(f"Total Warnings: {total_warnings}\n")
    
    for result in results:
        if result.get('error'):
            output.append(f"\n❌ {result['file']}")
            output.append(f"   Error: {result['error']}\n")
            continue
        
        if result['violations'] or result['warnings']:
            output.append(f"\n📄 {result['file']}")
            
            if result['violations']:
                output.append(f"\n  ❌ Violations ({len(result['violations'])}):")
                for v in result['violations']:
                    if v['line'] > 0:
                        output.append(f"     Line {v['line']}: {v['type']}")
                        output.append(f"     Code: {v['code'][:80]}{'...' if len(v['code']) > 80 else ''}")
                    else:
                        output.append(f"     {v['type']}")
                    output.append(f"     → {v['suggestion']}\n")
            
            if result['warnings']:
                output.append(f"\n  ⚠️  Warnings ({len(result['warnings'])}):")
                for w in result['warnings']:
                    if w['line'] > 0:
                        output.append(f"     Line {w['line']}: {w['type']}")
                        if w['code']:
                            output.append(f"     Code: {w['code'][:80]}{'...' if len(w['code']) > 80 else ''}")
                    else:
                        output.append(f"     {w['type']}")
                    output.append(f"     → {w['suggestion']}\n")
    
    output.append(f"\n{'='*80}")
    if total_violations > 0:
        output.append(f"❌ Found {total_violations} violation(s). Fix or add @override:structured-logging.")
    else:
        output.append(f"✅ No violations. {total_warnings} warning(s) to consider.")
    output.append(f"{'='*80}\n")
    
    return '\n'.join(output)

# ============================================================================
# CLI
# ============================================================================

def main():
    parser = argparse.ArgumentParser(description='R08: Structured Logging Checker')
    parser.add_argument('--file', help='Check a single file')
    parser.add_argument('--pr', help='Check files in a PR')
    parser.add_argument('--all', action='store_true', help='Check all TypeScript files')
    
    args = parser.parse_args()
    
    files_to_check = []
    
    if args.file:
        files_to_check = [args.file]
    elif args.pr:
        # Get files from PR (requires git)
        try:
            result = subprocess.run(
                ['git', 'diff', '--name-only', f'origin/main...HEAD'],
                capture_output=True,
                text=True,
                cwd=REPO_ROOT
            )
            files_to_check = [
                str(REPO_ROOT / f.strip())
                for f in result.stdout.split('\n')
                if f.strip().endswith(('.ts', '.tsx', '.js', '.jsx'))
            ]
        except Exception as e:
            print(f"Error getting PR files: {e}", file=sys.stderr)
            return 1
    elif args.all:
        # Find all TypeScript files
        for ext in ['.ts', '.tsx']:
            files_to_check.extend(
                str(p) for p in REPO_ROOT.rglob(f'*{ext}')
                if 'node_modules' not in str(p)
            )
    else:
        parser.print_help()
        return 1
    
    if not files_to_check:
        print("No files to check.")
        return 0
    
    print(f"Checking {len(files_to_check)} file(s)...\n")
    
    results = []
    for file_path in files_to_check:
        if os.path.exists(file_path):
            results.append(check_file(file_path))
    
    print(format_results(results))
    
    # Exit with error if violations found
    total_violations = sum(len(r['violations']) for r in results)
    return 1 if total_violations > 0 else 0

if __name__ == '__main__':
    sys.exit(main())



