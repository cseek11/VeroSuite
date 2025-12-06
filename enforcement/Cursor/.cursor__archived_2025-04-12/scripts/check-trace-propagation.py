#!/usr/bin/env python3
"""
R09: Trace Propagation Checker

Verifies that traceId propagates across all service boundaries:
- HTTP headers (x-trace-id, x-span-id, x-request-id)
- Service-to-service calls
- Database queries
- External API calls
- Message queue messages

Usage:
    python check-trace-propagation.py --file <file_path>
    python check-trace-propagation.py --pr <PR_NUMBER>
    python check-trace-propagation.py --all
"""

import re
import sys
import argparse
from pathlib import Path
from typing import List, Dict, Tuple, Optional
import json

class TracePropagationChecker:
    def __init__(self):
        self.violations = []
        self.warnings = []
        
    def check_file(self, file_path: str) -> Dict:
        """Check a single file for trace propagation violations."""
        if not Path(file_path).exists():
            return {"error": f"File not found: {file_path}"}
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')
        except (OSError, IOError, UnicodeDecodeError) as e:
            return {"error": f"Error reading file {file_path}: {e}"}
        
        # Reset violations for this file
        file_violations = []
        file_warnings = []
        
        # Check 1: HTTP header propagation
        http_violations = self._check_http_header_propagation(lines, file_path)
        file_violations.extend(http_violations)
        
        # Check 2: Service-to-service propagation
        service_violations = self._check_service_propagation(lines, file_path)
        file_violations.extend(service_violations)
        
        # Check 3: Database propagation
        db_violations = self._check_database_propagation(lines, file_path)
        file_violations.extend(db_violations)
        
        # Check 4: External API propagation
        external_violations = self._check_external_api_propagation(lines, file_path)
        file_violations.extend(external_violations)
        
        # Check 5: Message queue propagation
        mq_violations = self._check_message_queue_propagation(lines, file_path)
        file_violations.extend(mq_violations)
        
        # Check 6: Incomplete propagation (warnings)
        propagation_warnings = self._check_incomplete_propagation(lines, file_path)
        file_warnings.extend(propagation_warnings)
        
        return {
            "file": file_path,
            "violations": file_violations,
            "warnings": file_warnings,
            "total_violations": len(file_violations),
            "total_warnings": len(file_warnings)
        }
    
    def _check_http_header_propagation(self, lines: List[str], file_path: str) -> List[Dict]:
        """Check for missing traceId in HTTP headers."""
        violations = []
        
        # HTTP call patterns
        http_patterns = [
            r'fetch\s*\(',
            r'axios\.(get|post|put|delete|patch)\s*\(',
            r'this\.httpService\.(get|post|put|delete|patch)\s*\(',
            r'http\.(get|post|put|delete|patch)\s*\(',
        ]
        
        # Trace header patterns
        trace_header_patterns = [
            r'[\'"]x-trace-id[\'"]',
            r'[\'"]x-span-id[\'"]',
            r'[\'"]x-request-id[\'"]',
        ]
        
        # Trace utility patterns
        trace_utility_patterns = [
            r'addTraceContextToHeaders',
            r'addTraceHeaders',
        ]
        
        for i, line in enumerate(lines):
            # Check if line has HTTP call
            has_http_call = any(re.search(pattern, line) for pattern in http_patterns)
            
            if has_http_call:
                # Check context (next 5 lines for headers)
                context_lines = lines[i:min(i+6, len(lines))]
                context = '\n'.join(context_lines)
                
                # Check if trace headers present
                has_trace_headers = any(
                    re.search(pattern, context) 
                    for pattern in trace_header_patterns
                )
                
                # Check if using trace utility
                uses_trace_utility = any(
                    re.search(pattern, context)
                    for pattern in trace_utility_patterns
                )
                
                if not has_trace_headers and not uses_trace_utility:
                    violations.append({
                        "type": "missing_http_trace",
                        "line": i + 1,
                        "message": f"HTTP call without traceId in headers. Add x-trace-id, x-span-id, x-request-id headers or use addTraceContextToHeaders() utility.",
                        "code": line.strip()
                    })
        
        return violations
    
    def _check_service_propagation(self, lines: List[str], file_path: str) -> List[Dict]:
        """Check for missing traceId in service method calls."""
        violations = []
        
        # Service call patterns
        service_patterns = [
            r'(this\.)?[a-z]+Service\.[a-z]+\s*\(',
            r'await\s+[a-z]+Service\.[a-z]+\s*\(',
        ]
        
        # Trace parameter patterns
        trace_param_patterns = [
            r'traceId',
            r'requestId',
            r'traceContext',
        ]
        
        # Trace context service patterns
        trace_context_patterns = [
            r'this\.requestContext\.get(TraceId|TraceContext)\(\)',
        ]
        
        for i, line in enumerate(lines):
            # Check if line has service call
            has_service_call = any(re.search(pattern, line) for pattern in service_patterns)
            
            if has_service_call:
                # Check if trace parameter present
                has_trace_param = any(
                    re.search(pattern, line)
                    for pattern in trace_param_patterns
                )
                
                # Check if using trace context service
                uses_trace_context = any(
                    re.search(pattern, line)
                    for pattern in trace_context_patterns
                )
                
                if not has_trace_param and not uses_trace_context:
                    violations.append({
                        "type": "missing_service_trace",
                        "line": i + 1,
                        "message": f"Service call without traceId parameter. Pass traceId as parameter or use RequestContextService.",
                        "code": line.strip()
                    })
        
        return violations
    
    def _check_database_propagation(self, lines: List[str], file_path: str) -> List[Dict]:
        """Check for missing traceId in database query context."""
        violations = []
        
        # Database query patterns
        db_patterns = [
            r'prisma\.[a-z]+\.(findMany|findUnique|create|update|delete)',
            r'\$executeRaw',
            r'\$queryRaw',
        ]
        
        # Trace context wrapper patterns
        trace_wrapper_patterns = [
            r'withTraceContext\s*\(',
            r'withContext\s*\(',
        ]
        
        # Trace in DB context patterns
        trace_db_patterns = [
            r'app\.trace_id',
            r'SET LOCAL app\.trace_id',
        ]
        
        for i, line in enumerate(lines):
            # Check if line has database query
            has_db_query = any(re.search(pattern, line) for pattern in db_patterns)
            
            if has_db_query:
                # Check context (previous 3 lines for wrapper)
                context_start = max(0, i-3)
                context_lines = lines[context_start:i+1]
                context = '\n'.join(context_lines)
                
                # Check if using trace context wrapper
                has_trace_wrapper = any(
                    re.search(pattern, context)
                    for pattern in trace_wrapper_patterns
                )
                
                # Check if trace in DB context
                has_trace_in_db = any(
                    re.search(pattern, context)
                    for pattern in trace_db_patterns
                )
                
                if not has_trace_wrapper and not has_trace_in_db:
                    violations.append({
                        "type": "missing_db_trace",
                        "line": i + 1,
                        "message": f"Database query without traceId in context. Use withTraceContext() wrapper or set app.trace_id in query context.",
                        "code": line.strip()
                    })
        
        return violations
    
    def _check_external_api_propagation(self, lines: List[str], file_path: str) -> List[Dict]:
        """Check for missing traceId in external API calls."""
        violations = []
        
        # External API patterns (HTTP calls with full URLs)
        external_api_patterns = [
            r'fetch\s*\(\s*[\'"]https?://',
            r'axios\.(get|post|put|delete|patch)\s*\(\s*[\'"]https?://',
        ]
        
        # Trace header patterns
        trace_header_patterns = [
            r'[\'"]x-trace-id[\'"]',
        ]
        
        # Trace utility patterns
        trace_utility_patterns = [
            r'addTraceContextToHeaders',
            r'addTraceHeaders',
        ]
        
        for i, line in enumerate(lines):
            # Check if line has external API call
            has_external_call = any(re.search(pattern, line) for pattern in external_api_patterns)
            
            if has_external_call:
                # Check context (next 5 lines for headers)
                context_lines = lines[i:min(i+6, len(lines))]
                context = '\n'.join(context_lines)
                
                # Check if trace headers present
                has_trace_headers = any(
                    re.search(pattern, context)
                    for pattern in trace_header_patterns
                )
                
                # Check if using trace utility
                uses_trace_utility = any(
                    re.search(pattern, context)
                    for pattern in trace_utility_patterns
                )
                
                if not has_trace_headers and not uses_trace_utility:
                    violations.append({
                        "type": "missing_external_trace",
                        "line": i + 1,
                        "message": f"External API call without traceId in headers. Add x-trace-id header or use addTraceContextToHeaders() utility.",
                        "code": line.strip()
                    })
        
        return violations
    
    def _check_message_queue_propagation(self, lines: List[str], file_path: str) -> List[Dict]:
        """Check for missing traceId in message queue messages."""
        violations = []
        
        # Message queue publish patterns
        mq_patterns = [
            r'channel\.publish\s*\(',
            r'producer\.send\s*\(',
            r'messageQueue\.publish\s*\(',
        ]
        
        # Trace in MQ headers patterns
        trace_mq_patterns = [
            r'headers:\s*\{[^}]*trace',
            r'metadata:\s*\{[^}]*trace',
        ]
        
        for i, line in enumerate(lines):
            # Check if line has message queue publish
            has_mq_publish = any(re.search(pattern, line) for pattern in mq_patterns)
            
            if has_mq_publish:
                # Check context (next 10 lines for headers/metadata)
                context_lines = lines[i:min(i+11, len(lines))]
                context = '\n'.join(context_lines)
                
                # Check if trace in MQ headers
                has_trace_in_mq = any(
                    re.search(pattern, context)
                    for pattern in trace_mq_patterns
                )
                
                if not has_trace_in_mq:
                    violations.append({
                        "type": "missing_mq_trace",
                        "line": i + 1,
                        "message": f"Message queue publish without traceId in headers/metadata. Include traceId in message headers or metadata.",
                        "code": line.strip()
                    })
        
        return violations
    
    def _check_incomplete_propagation(self, lines: List[str], file_path: str) -> List[Dict]:
        """Check for incomplete trace propagation (warnings)."""
        warnings = []
        
        # HTTP call patterns
        http_patterns = [
            r'fetch\s*\(',
            r'axios\.(get|post|put|delete|patch)\s*\(',
        ]
        
        # Individual trace header patterns
        trace_headers = {
            'x-trace-id': r'[\'"]x-trace-id[\'"]',
            'x-span-id': r'[\'"]x-span-id[\'"]',
            'x-request-id': r'[\'"]x-request-id[\'"]',
        }
        
        for i, line in enumerate(lines):
            # Check if line has HTTP call
            has_http_call = any(re.search(pattern, line) for pattern in http_patterns)
            
            if has_http_call:
                # Check context (next 5 lines for headers)
                context_lines = lines[i:min(i+6, len(lines))]
                context = '\n'.join(context_lines)
                
                # Check which trace headers are present
                present_headers = []
                missing_headers = []
                
                for header_name, pattern in trace_headers.items():
                    if re.search(pattern, context):
                        present_headers.append(header_name)
                    else:
                        missing_headers.append(header_name)
                
                # If some headers present but not all, warn
                if present_headers and missing_headers:
                    warnings.append({
                        "type": "incomplete_trace_propagation",
                        "line": i + 1,
                        "message": f"HTTP call with partial trace headers. Missing: {', '.join(missing_headers)}. Consider including all trace headers.",
                        "code": line.strip()
                    })
        
        return warnings

def main():
    parser = argparse.ArgumentParser(description='Check trace propagation compliance (R09)')
    parser.add_argument('--file', help='Check a specific file')
    parser.add_argument('--pr', help='Check files in a PR')
    parser.add_argument('--all', action='store_true', help='Check all TypeScript files')
    
    args = parser.parse_args()
    
    checker = TracePropagationChecker()
    
    if args.file:
        result = checker.check_file(args.file)
        print(json.dumps(result, indent=2))
        
        if result.get('total_violations', 0) > 0:
            sys.exit(1)
    
    elif args.all:
        # Check all TypeScript files in apps/ and frontend/
        files_to_check = []
        
        for pattern in ['apps/**/*.ts', 'apps/**/*.tsx', 'frontend/**/*.ts', 'frontend/**/*.tsx']:
            files_to_check.extend(Path('.').glob(pattern))
        
        total_violations = 0
        total_warnings = 0
        
        for file_path in files_to_check:
            result = checker.check_file(str(file_path))
            total_violations += result.get('total_violations', 0)
            total_warnings += result.get('total_warnings', 0)
            
            if result.get('total_violations', 0) > 0 or result.get('total_warnings', 0) > 0:
                print(json.dumps(result, indent=2))
        
        print(f"\nTotal violations: {total_violations}")
        print(f"Total warnings: {total_warnings}")
        
        if total_violations > 0:
            sys.exit(1)
    
    else:
        parser.print_help()
        sys.exit(1)

if __name__ == '__main__':
    main()





