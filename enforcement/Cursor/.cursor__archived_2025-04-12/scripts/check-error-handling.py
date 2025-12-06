#!/usr/bin/env python3
"""
R07: Error Handling Checker

Detects silent failures, missing error handling, and unsafe error messages.
Integrates with existing error-pattern-detector.util.ts for consistency.

Usage:
    python check-error-handling.py --file <file_path>
    python check-error-handling.py --pr <PR_NUMBER>
    python check-error-handling.py --all
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
ERROR_DETECTOR_UTIL = REPO_ROOT / "apps" / "api" / "src" / "common" / "utils" / "error-pattern-detector.util.ts"

# Error-prone operation patterns
ERROR_PRONE_PATTERNS = {
    'external_io': [
        r'fetch\s*\(',
        r'axios\.(get|post|put|delete|patch)',
        r'prisma\.\w+\.(findMany|findFirst|create|update|delete)',
        r'fs\.(readFile|writeFile|unlink)',
    ],
    'async_await': [
        r'async\s+function',
        r'async\s+\(',
        r'=>\s*async',
        r'\.then\s*\(',
    ],
    'user_input': [
        r'req\.(body|params|query)',
        r'@Body\(\)',
        r'@Param\(\)',
        r'@Query\(\)',
    ],
    'data_parsing': [
        r'JSON\.parse\(',
        r'parseInt\(',
        r'parseFloat\(',
        r'new Date\(',
    ],
}

# Message leak patterns
LEAK_PATTERNS = {
    'stack_trace': r'at\s+\w+\s*\([^)]*:\d+:\d+\)',
    'file_path': r'[A-Za-z]:[/\\]|/home/|/usr/',
    'internal_id': r'(uuid|objectId):\s*[a-f0-9-]{36}',
    'secret': r'(password|token|key|secret):\s*\S+',
    'sql_query': r'(SELECT|INSERT|UPDATE|DELETE)\s+',
    'env_var': r'(process\.env|ENV\[)',
}

# ============================================================================
# TypeScript Utility Integration
# ============================================================================

def call_typescript_detector(file_path: str) -> Optional[Dict[str, Any]]:
    """
    Call the existing error-pattern-detector.util.ts for consistency.
    
    Note: This requires the utility to have a CLI interface.
    If not available, we'll use Python pattern matching instead.
    """
    try:
        # Check if utility has CLI interface
        result = subprocess.run(
            ['ts-node', str(ERROR_DETECTOR_UTIL), '--file', file_path],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            return json.loads(result.stdout)
        else:
            # Utility doesn't have CLI, fall back to Python
            return None
    except (subprocess.TimeoutExpired, FileNotFoundError, json.JSONDecodeError):
        # Fall back to Python implementation
        return None

# ============================================================================
# Python Pattern Matching (Fallback)
# ============================================================================

def detect_empty_catch_blocks(code: str, file_path: str) -> List[Dict[str, Any]]:
    """Detect empty catch blocks using pattern matching."""
    violations = []
    lines = code.split('\n')
    
    # Pattern: catch (error) { } or catch { }
    catch_pattern = re.compile(r'catch\s*\([^)]*\)\s*\{([^}]*)\}')
    
    for i, line in enumerate(lines, 1):
        match = catch_pattern.search(line)
        if match:
            catch_body = match.group(1)
            # Remove comments and whitespace
            body_clean = re.sub(r'//.*$', '', catch_body, flags=re.MULTILINE)
            body_clean = re.sub(r'/\*[\s\S]*?\*/', '', body_clean)
            body_clean = body_clean.strip()
            
            if not body_clean:
                violations.append({
                    'file': file_path,
                    'line': i,
                    'type': 'empty_catch',
                    'code': line.strip(),
                    'suggestion': 'Add error logging: logger.error() with context, operation, errorCode, rootCause, traceId.'
                })
    
    return violations

def detect_swallowed_promises(code: str, file_path: str) -> List[Dict[str, Any]]:
    """Detect swallowed promises (.catch(() => {}))."""
    violations = []
    lines = code.split('\n')
    
    # Pattern: .catch(() => {}) or .catch(() => { /* empty */ })
    swallow_pattern = re.compile(r'\.catch\s*\(\s*(?:\([^)]*\)\s*=>\s*)?\{([^}]*)\}\s*\)')
    
    for i, line in enumerate(lines, 1):
        match = swallow_pattern.search(line)
        if match:
            catch_body = match.group(1)
            # Remove comments and whitespace
            body_clean = re.sub(r'//.*$', '', catch_body, flags=re.MULTILINE)
            body_clean = re.sub(r'/\*[\s\S]*?\*/', '', body_clean)
            body_clean = body_clean.strip()
            
            if not body_clean:
                violations.append({
                    'file': file_path,
                    'line': i,
                    'type': 'swallowed_promise',
                    'code': line.strip(),
                    'suggestion': 'Add error logging in catch handler.'
                })
    
    return violations

def detect_missing_awaits(code: str, file_path: str) -> List[Dict[str, Any]]:
    """Detect missing awaits (heuristic check)."""
    violations = []
    lines = code.split('\n')
    
    # Check if file has async functions
    has_async = any(re.search(r'async\s+(function|\(|=>)', line) for line in lines)
    
    if not has_async:
        return violations
    
    # Common promise-returning patterns
    promise_patterns = [
        r'(?<!await\s)prisma\.\w+\.',
        r'(?<!await\s)fetch\s*\(',
        r'(?<!await\s)axios\.(get|post|put|delete|patch)',
        r'(?<!await\s)\w+Service\.\w+\(',
    ]
    
    for i, line in enumerate(lines, 1):
        # Skip if line has await
        if re.search(r'await\s+', line):
            continue
        
        # Skip if intentional fire-and-forget
        if re.search(r'void\s+', line) or '@fire-and-forget' in line:
            continue
        
        # Check for promise-returning patterns
        for pattern in promise_patterns:
            if re.search(pattern, line):
                violations.append({
                    'file': file_path,
                    'line': i,
                    'type': 'missing_await',
                    'code': line.strip(),
                    'suggestion': 'Add await before promise-returning function or mark as @fire-and-forget if intentional.'
                })
                break
    
    return violations

def detect_console_logs(code: str, file_path: str) -> List[Dict[str, Any]]:
    """Detect console.log/error instead of structured logging."""
    violations = []
    lines = code.split('\n')
    
    console_pattern = re.compile(r'console\.(log|error|warn|info|debug)\s*\(')
    
    for i, line in enumerate(lines, 1):
        if console_pattern.search(line):
            violations.append({
                'file': file_path,
                'line': i,
                'type': 'console_log',
                'code': line.strip(),
                'suggestion': 'Replace console.log/error with structured logger: logger.error() with context, operation, errorCode, rootCause, traceId.'
            })
    
    return violations

def detect_unlogged_errors(code: str, file_path: str) -> List[Dict[str, Any]]:
    """Detect errors thrown without logging."""
    violations = []
    lines = code.split('\n')
    
    # Find throw statements
    throw_pattern = re.compile(r'throw\s+new\s+\w*Error')
    logger_pattern = re.compile(r'logger\.(error|warn)\s*\(')
    
    # Check if file has logger calls
    has_logging = any(logger_pattern.search(line) for line in lines)
    
    if not has_logging:
        for i, line in enumerate(lines, 1):
            if throw_pattern.search(line):
                violations.append({
                    'file': file_path,
                    'line': i,
                    'type': 'unlogged_error',
                    'code': line.strip(),
                    'suggestion': 'Add logger.error() before throw with context, operation, errorCode, rootCause, traceId.'
                })
    
    return violations

# ============================================================================
# Error Handling Coverage
# ============================================================================

def check_error_handling_coverage(code: str, file_path: str) -> List[Dict[str, Any]]:
    """Check if error-prone operations have error handling."""
    warnings = []
    lines = code.split('\n')
    
    # Find error-prone operations
    error_prone_lines = []
    for i, line in enumerate(lines, 1):
        for category, patterns in ERROR_PRONE_PATTERNS.items():
            for pattern in patterns:
                if re.search(pattern, line):
                    error_prone_lines.append((i, line.strip(), category))
                    break
    
    if not error_prone_lines:
        return warnings
    
    # Check if file has try/catch blocks
    has_try_catch = any(re.search(r'try\s*\{', line) for line in lines)
    
    if not has_try_catch:
        warnings.append({
            'file': file_path,
            'line': error_prone_lines[0][0],
            'type': 'missing_error_handling',
            'code': error_prone_lines[0][1],
            'suggestion': f'File has {len(error_prone_lines)} error-prone operation(s) but no try/catch blocks. Add error handling.'
        })
    
    return warnings

# ============================================================================
# Error Categorization
# ============================================================================

def check_error_categorization(code: str, file_path: str) -> List[Dict[str, Any]]:
    """Check if errors are categorized."""
    warnings = []
    lines = code.split('\n')
    
    # Check if file has catch blocks
    has_catch = any(re.search(r'catch\s*\(', line) for line in lines)
    
    if not has_catch:
        return warnings
    
    # Check for categorization patterns
    categorization_patterns = [
        r'instanceof\s+\w+Error',
        r'error\.type\s*===',
        r'BadRequestException',
        r'UnprocessableEntityException',
        r'InternalServerErrorException',
    ]
    
    has_categorization = any(
        re.search(pattern, line)
        for line in lines
        for pattern in categorization_patterns
    )
    
    if not has_categorization:
        warnings.append({
            'file': file_path,
            'line': 0,
            'type': 'no_error_categorization',
            'code': '',
            'suggestion': 'Consider categorizing errors: ValidationError → 400, BusinessRuleError → 422, SystemError → 500.'
        })
    
    return warnings

# ============================================================================
# User-Facing Message Safety
# ============================================================================

def check_message_safety(code: str, file_path: str) -> List[Dict[str, Any]]:
    """Check for unsafe error messages."""
    warnings = []
    lines = code.split('\n')
    
    for i, line in enumerate(lines, 1):
        # Check for throw statements or error messages
        if 'throw' in line or 'message' in line:
            for leak_type, pattern in LEAK_PATTERNS.items():
                if re.search(pattern, line, re.IGNORECASE):
                    warnings.append({
                        'file': file_path,
                        'line': i,
                        'type': f'unsafe_message_{leak_type}',
                        'code': line.strip(),
                        'suggestion': f'Potential {leak_type} leak in error message. Use user-friendly message without internal details.'
                    })
    
    return warnings

# ============================================================================
# Main Check Function
# ============================================================================

def check_file(file_path: str) -> Dict[str, Any]:
    """Check a single file for error handling violations."""
    
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
    
    # Try TypeScript utility first
    ts_result = call_typescript_detector(file_path)
    if ts_result:
        return ts_result
    
    # Fall back to Python pattern matching
    violations = []
    warnings = []
    
    # Run all checks
    violations.extend(detect_empty_catch_blocks(code, file_path))
    violations.extend(detect_swallowed_promises(code, file_path))
    violations.extend(detect_missing_awaits(code, file_path))
    violations.extend(detect_console_logs(code, file_path))
    violations.extend(detect_unlogged_errors(code, file_path))
    
    warnings.extend(check_error_handling_coverage(code, file_path))
    warnings.extend(check_error_categorization(code, file_path))
    warnings.extend(check_message_safety(code, file_path))
    
    return {
        'file': file_path,
        'violations': violations,
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
        return "✅ No error handling violations found."
    
    output = []
    output.append(f"\n{'='*80}")
    output.append(f"R07: Error Handling Check Results")
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
                    output.append(f"     Line {v['line']}: {v['type']}")
                    output.append(f"     Code: {v['code'][:80]}{'...' if len(v['code']) > 80 else ''}")
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
        output.append(f"❌ Found {total_violations} violation(s). Fix or add @override:error-handling.")
    else:
        output.append(f"✅ No violations. {total_warnings} warning(s) to consider.")
    output.append(f"{'='*80}\n")
    
    return '\n'.join(output)

# ============================================================================
# CLI
# ============================================================================

def main():
    parser = argparse.ArgumentParser(description='R07: Error Handling Checker')
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





