#!/usr/bin/env python3
"""
R13: Input Validation Checker

Detects violations of input validation requirements:
- DTO validation (class-validator decorators)
- File upload validation (type, size, content)
- XSS prevention (HTML sanitization)
- Injection prevention (SQL, command, path traversal)
- Input size limits (strings, arrays, files)

Usage:
    python check-input-validation.py --file <file_path>
    python check-input-validation.py --pr <PR_NUMBER>
    python check-input-validation.py --type <validation_type>
    python check-input-validation.py --all
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

# Validation decorators from class-validator
VALIDATION_DECORATORS = [
    'IsString', 'IsNumber', 'IsInt', 'IsBoolean', 'IsArray',
    'IsEmail', 'IsUUID', 'IsURL', 'IsPhoneNumber', 'IsDateString',
    'IsEnum', 'IsOptional', 'IsNotEmpty', 'IsEmpty',
    'Min', 'Max', 'MinLength', 'MaxLength', 'Length',
    'Matches', 'IsAlphanumeric', 'IsAscii',
    'ValidateNested', 'ValidateIf', 'Validate',
    'ArrayMinSize', 'ArrayMaxSize', 'ArrayUnique'
]

# File validation decorators
FILE_VALIDATION_DECORATORS = [
    'IsFile', 'MaxFileSize', 'FileType', 'FileTypeValidator'
]

# XSS-prone fields
XSS_PRONE_FIELDS = [
    'description', 'content', 'html', 'body', 'text',
    'comment', 'message', 'notes', 'config'
]

# ============================================================================
# Data Classes
# ============================================================================

class ValidationType(Enum):
    DTO = 'dto'
    FILE = 'file'
    XSS = 'xss'
    INJECTION = 'injection'
    SIZE_LIMIT = 'size_limit'

@dataclass
class Violation:
    """Represents an input validation violation"""
    rule: str
    severity: str  # 'error' or 'warning'
    file: str
    line: int
    message: str
    suggestion: str
    category: str

# ============================================================================
# DTO Validation Analyzer
# ============================================================================

class DTOValidationAnalyzer:
    """Analyzes DTOs for validation decorators"""
    
    def __init__(self, file_path: str, content: str):
        self.file_path = file_path
        self.content = content
        self.lines = content.split('\n')
        
    def analyze(self) -> List[Violation]:
        """Analyze DTO for validation violations"""
        violations = []
        
        # Check if file is a DTO
        if not self._is_dto_file():
            return violations
        
        # Find all properties
        properties = self._find_properties()
        
        for prop in properties:
            # Check for missing validation decorators
            if not self._has_validation_decorator(prop):
                violations.append(Violation(
                    rule='R13',
                    severity='error',
                    file=self.file_path,
                    line=prop['line'],
                    message=f"Property '{prop['name']}' missing validation decorator",
                    suggestion=f"Add validation decorator: @IsString(), @IsEmail(), @MaxLength(), etc.",
                    category='dto_validation'
                ))
            
            # Check for missing size limits on strings
            if self._is_string_property(prop) and not self._has_size_limit(prop):
                violations.append(Violation(
                    rule='R13',
                    severity='error',
                    file=self.file_path,
                    line=prop['line'],
                    message=f"String property '{prop['name']}' missing size limit",
                    suggestion=f"Add size limit: @MaxLength(255) or @Length(1, 100)",
                    category='size_limit'
                ))
            
            # Check for 'any' types
            if self._has_any_type(prop):
                violations.append(Violation(
                    rule='R13',
                    severity='error',
                    file=self.file_path,
                    line=prop['line'],
                    message=f"Property '{prop['name']}' uses 'any' type",
                    suggestion=f"Use specific type: string, number, CustomType, etc.",
                    category='dto_validation'
                ))
        
        return violations
    
    def _is_dto_file(self) -> bool:
        """Check if file is a DTO"""
        return '/dto/' in self.file_path or self.file_path.endswith('.dto.ts')
    
    def _find_properties(self) -> List[Dict]:
        """Find all properties in DTO class"""
        properties = []
        in_class = False
        
        for i, line in enumerate(self.lines, 1):
            # Detect class declaration
            if re.match(r'export\s+class\s+\w+Dto', line):
                in_class = True
                continue
            
            # Exit class
            if in_class and line.strip() == '}':
                in_class = False
                continue
            
            # Find properties
            if in_class:
                # Match property declarations
                prop_match = re.match(r'\s*(\w+)(\?)?:\s*(\w+)', line.strip())
                if prop_match:
                    properties.append({
                        'name': prop_match.group(1),
                        'optional': prop_match.group(2) is not None,
                        'type': prop_match.group(3),
                        'line': i,
                        'decorators': self._get_decorators(i)
                    })
        
        return properties
    
    def _get_decorators(self, line_num: int) -> List[str]:
        """Get decorators for a property"""
        decorators = []
        # Look at previous lines for decorators
        for i in range(max(0, line_num - 10), line_num):
            line = self.lines[i - 1].strip()
            if line.startswith('@'):
                decorator_match = re.match(r'@(\w+)', line)
                if decorator_match:
                    decorators.append(decorator_match.group(1))
        return decorators
    
    def _has_validation_decorator(self, prop: Dict) -> bool:
        """Check if property has validation decorator"""
        if prop['optional'] and 'IsOptional' in prop['decorators']:
            return True
        
        # Check for any validation decorator
        for decorator in prop['decorators']:
            if decorator in VALIDATION_DECORATORS:
                return True
        
        return False
    
    def _is_string_property(self, prop: Dict) -> bool:
        """Check if property is a string"""
        return prop['type'] == 'string' or 'IsString' in prop['decorators']
    
    def _has_size_limit(self, prop: Dict) -> bool:
        """Check if property has size limit"""
        size_decorators = ['MaxLength', 'MinLength', 'Length']
        return any(dec in prop['decorators'] for dec in size_decorators)
    
    def _has_any_type(self, prop: Dict) -> bool:
        """Check if property uses 'any' type"""
        return prop['type'] == 'any'

# ============================================================================
# Controller Validation Analyzer
# ============================================================================

class ControllerValidationAnalyzer:
    """Analyzes controllers for input validation"""
    
    def __init__(self, file_path: str, content: str):
        self.file_path = file_path
        self.content = content
        self.lines = content.split('\n')
        
    def analyze(self) -> List[Violation]:
        """Analyze controller for validation violations"""
        violations = []
        
        # Check if file is a controller
        if not self._is_controller_file():
            return violations
        
        # Find all @Body() parameters
        body_params = self._find_body_parameters()
        
        for param in body_params:
            # Check for 'any' type
            if param['type'] == 'any':
                violations.append(Violation(
                    rule='R13',
                    severity='error',
                    file=self.file_path,
                    line=param['line'],
                    message=f"@Body() parameter uses 'any' type",
                    suggestion=f"Create and use a DTO: @Body() dto: CreateXDto",
                    category='dto_validation'
                ))
            
            # Check if type is a DTO (ends with 'Dto')
            elif not param['type'].endswith('Dto'):
                violations.append(Violation(
                    rule='R13',
                    severity='warning',
                    file=self.file_path,
                    line=param['line'],
                    message=f"@Body() parameter type '{param['type']}' doesn't follow DTO naming convention",
                    suggestion=f"Use DTO naming convention: {param['type']}Dto",
                    category='dto_validation'
                ))
        
        # Find file uploads
        file_uploads = self._find_file_uploads()
        
        for upload in file_uploads:
            if not self._has_file_validation(upload):
                violations.append(Violation(
                    rule='R13',
                    severity='error',
                    file=self.file_path,
                    line=upload['line'],
                    message=f"File upload without validation",
                    suggestion=f"Add file validation: @MaxFileSize(), @FileType(), or use validateFile()",
                    category='file_validation'
                ))
        
        return violations
    
    def _is_controller_file(self) -> bool:
        """Check if file is a controller"""
        return self.file_path.endswith('.controller.ts')
    
    def _find_body_parameters(self) -> List[Dict]:
        """Find all @Body() parameters"""
        params = []
        
        for i, line in enumerate(self.lines, 1):
            # Match @Body() parameter
            body_match = re.search(r'@Body\(\)\s+(\w+):\s*(\w+)', line)
            if body_match:
                params.append({
                    'name': body_match.group(1),
                    'type': body_match.group(2),
                    'line': i
                })
        
        return params
    
    def _find_file_uploads(self) -> List[Dict]:
        """Find all file upload operations"""
        uploads = []
        
        for i, line in enumerate(self.lines, 1):
            if '@UploadedFile()' in line or '@UploadedFiles()' in line:
                uploads.append({
                    'line': i,
                    'context': self._get_context(i)
                })
        
        return uploads
    
    def _has_file_validation(self, upload: Dict) -> bool:
        """Check if file upload has validation"""
        context = upload['context']
        
        # Check for validation decorators or methods
        validation_indicators = [
            '@MaxFileSize', '@FileType', 'validateFile',
            'FileValidator', 'validateFileType', 'validateFileSize'
        ]
        
        return any(indicator in context for indicator in validation_indicators)
    
    def _get_context(self, line_num: int, window: int = 20) -> str:
        """Get context around a line"""
        start = max(0, line_num - window)
        end = min(len(self.lines), line_num + window)
        return '\n'.join(self.lines[start:end])

# ============================================================================
# XSS Prevention Analyzer
# ============================================================================

class XSSPreventionAnalyzer:
    """Analyzes code for XSS prevention"""
    
    def __init__(self, file_path: str, content: str):
        self.file_path = file_path
        self.content = content
        self.lines = content.split('\n')
        
    def analyze(self) -> List[Violation]:
        """Analyze code for XSS violations"""
        violations = []
        
        # Check for HTML storage without sanitization
        for i, line in enumerate(self.lines, 1):
            # Check for XSS-prone fields in update/create operations
            for field in XSS_PRONE_FIELDS:
                if f'{field}:' in line or f'"{field}"' in line:
                    context = self._get_context(i)
                    
                    # Check if in update/create operation
                    if 'update(' in context or 'create(' in context:
                        # Check for sanitization
                        if not self._has_sanitization(context):
                            violations.append(Violation(
                                rule='R13',
                                severity='error',
                                file=self.file_path,
                                line=i,
                                message=f"Field '{field}' stored without sanitization",
                                suggestion=f"Sanitize before storage: sanitizeHtml({field}) or DOMPurify.sanitize({field})",
                                category='xss_prevention'
                            ))
        
        # Check for dangerouslySetInnerHTML without sanitization
        for i, line in enumerate(self.lines, 1):
            if 'dangerouslySetInnerHTML' in line:
                context = self._get_context(i)
                
                if not self._has_sanitization(context):
                    violations.append(Violation(
                        rule='R13',
                        severity='error',
                        file=self.file_path,
                        line=i,
                        message=f"dangerouslySetInnerHTML without sanitization",
                        suggestion=f"Sanitize HTML before using: DOMPurify.sanitize(html)",
                        category='xss_prevention'
                    ))
        
        return violations
    
    def _has_sanitization(self, context: str) -> bool:
        """Check if context has sanitization"""
        sanitization_indicators = [
            'sanitize', 'DOMPurify', 'sanitizeHtml',
            'sanitizeConfig', 'escapeHtml', 'xss'
        ]
        
        return any(indicator in context for indicator in sanitization_indicators)
    
    def _get_context(self, line_num: int, window: int = 10) -> str:
        """Get context around a line"""
        start = max(0, line_num - window)
        end = min(len(self.lines), line_num + window)
        return '\n'.join(self.lines[start:end])

# ============================================================================
# Injection Prevention Analyzer
# ============================================================================

class InjectionPreventionAnalyzer:
    """Analyzes code for injection vulnerabilities"""
    
    def __init__(self, file_path: str, content: str):
        self.file_path = file_path
        self.content = content
        self.lines = content.split('\n')
        
    def analyze(self) -> List[Violation]:
        """Analyze code for injection violations"""
        violations = []
        
        # Check for SQL injection
        violations.extend(self._check_sql_injection())
        
        # Check for path traversal
        violations.extend(self._check_path_traversal())
        
        # Check for command injection
        violations.extend(self._check_command_injection())
        
        return violations
    
    def _check_sql_injection(self) -> List[Violation]:
        """Check for SQL injection vulnerabilities"""
        violations = []
        
        for i, line in enumerate(self.lines, 1):
            # Check for $queryRawUnsafe with string concatenation
            if '$queryRawUnsafe' in line:
                context = self._get_context(i)
                
                # Check for string concatenation patterns
                if '${' in context or '+' in context:
                    violations.append(Violation(
                        rule='R13',
                        severity='error',
                        file=self.file_path,
                        line=i,
                        message=f"SQL injection risk: $queryRawUnsafe with string concatenation",
                        suggestion=f"Use $queryRaw with tagged template literals for automatic parameterization",
                        category='injection_prevention'
                    ))
        
        return violations
    
    def _check_path_traversal(self) -> List[Violation]:
        """Check for path traversal vulnerabilities"""
        violations = []
        
        file_operations = [
            'readFileSync', 'writeFileSync', 'readFile', 'writeFile',
            'unlink', 'unlinkSync', 'rmdir', 'rmdirSync'
        ]
        
        for i, line in enumerate(self.lines, 1):
            for op in file_operations:
                if op in line:
                    context = self._get_context(i)
                    
                    # Check for path validation
                    if not self._has_path_validation(context):
                        violations.append(Violation(
                            rule='R13',
                            severity='error',
                            file=self.file_path,
                            line=i,
                            message=f"Path traversal risk: {op} without path validation",
                            suggestion=f"Validate file path: use path.resolve() and verify path is within allowed directory",
                            category='injection_prevention'
                        ))
                    
                    break
        
        return violations
    
    def _check_command_injection(self) -> List[Violation]:
        """Check for command injection vulnerabilities"""
        violations = []
        
        command_operations = ['exec', 'execSync', 'spawn', 'spawnSync']
        
        for i, line in enumerate(self.lines, 1):
            for op in command_operations:
                if op in line:
                    context = self._get_context(i)
                    
                    # Check for user input in command
                    if not self._has_command_validation(context):
                        violations.append(Violation(
                            rule='R13',
                            severity='error',
                            file=self.file_path,
                            line=i,
                            message=f"Command injection risk: {op} with user input",
                            suggestion=f"Validate command inputs: use allowlist, escape shell characters, or use spawn with array arguments",
                            category='injection_prevention'
                        ))
                    
                    break
        
        return violations
    
    def _has_path_validation(self, context: str) -> bool:
        """Check if context has path validation"""
        validation_indicators = [
            'path.resolve', 'path.join', 'path.normalize',
            'validatePath', 'isValidPath', '/^[a-zA-Z0-9._-]+$/'
        ]
        
        return any(indicator in context for indicator in validation_indicators)
    
    def _has_command_validation(self, context: str) -> bool:
        """Check if context has command validation"""
        validation_indicators = [
            'validateCommand', 'isValidCommand', 'allowedCommands',
            'escapeShellArg', 'shellEscape'
        ]
        
        return any(indicator in context for indicator in validation_indicators)
    
    def _get_context(self, line_num: int, window: int = 15) -> str:
        """Get context around a line"""
        start = max(0, line_num - window)
        end = min(len(self.lines), line_num + window)
        return '\n'.join(self.lines[start:end])

# ============================================================================
# Main Checker
# ============================================================================

class InputValidationChecker:
    """Main checker for input validation"""
    
    def __init__(self):
        self.violations: List[Violation] = []
        
    def check_file(self, file_path: str) -> List[Violation]:
        """Check a single file for violations"""
        if not os.path.exists(file_path):
            print(f"Error: File not found: {file_path}", file=sys.stderr)
            return []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except (OSError, IOError, UnicodeDecodeError) as e:
            print(f"Error reading file {file_path}: {e}", file=sys.stderr)
            return []
        
        violations = []
        
        # DTO validation
        if '/dto/' in file_path or file_path.endswith('.dto.ts'):
            analyzer = DTOValidationAnalyzer(file_path, content)
            violations.extend(analyzer.analyze())
        
        # Controller validation
        if file_path.endswith('.controller.ts'):
            analyzer = ControllerValidationAnalyzer(file_path, content)
            violations.extend(analyzer.analyze())
        
        # XSS prevention
        if file_path.endswith('.ts') or file_path.endswith('.tsx'):
            analyzer = XSSPreventionAnalyzer(file_path, content)
            violations.extend(analyzer.analyze())
        
        # Injection prevention
        if file_path.endswith('.service.ts') or file_path.endswith('.controller.ts'):
            analyzer = InjectionPreventionAnalyzer(file_path, content)
            violations.extend(analyzer.analyze())
        
        return violations
    
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
                if file.endswith('.ts') or file.endswith('.tsx'):
                    violations.extend(self.check_file(file))
            
            return violations
            
        except subprocess.CalledProcessError as e:
            print(f"Error: Failed to get changed files: {e}", file=sys.stderr)
            return []
    
    def check_type(self, validation_type: str) -> List[Violation]:
        """Check all files for specific validation type"""
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
                        if file.endswith('.ts') or file.endswith('.tsx'):
                            file_path = os.path.join(root, file)
                            file_violations = self.check_file(file_path)
                            
                            # Filter by type
                            if validation_type:
                                file_violations = [
                                    v for v in file_violations
                                    if v.category == validation_type
                                ]
                            
                            violations.extend(file_violations)
        
        return violations
    
    def check_all(self) -> List[Violation]:
        """Check all backend files"""
        return self.check_type(None)
    
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
            output.append("✅ No input validation violations found!")
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
        
        output.append(f"\n❌ Input Validation Violations: {error_count} errors, {warning_count} warnings\n")
        
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
        description='Check code for input validation violations (R13)'
    )
    
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--file', help='Check a single file')
    group.add_argument('--pr', help='Check all changed files in a PR')
    group.add_argument('--type', choices=['dto', 'file', 'xss', 'injection', 'size_limit'],
                      help='Check all files for specific validation type')
    group.add_argument('--all', action='store_true', help='Check all backend files')
    
    parser.add_argument('--format', choices=['text', 'json'], default='text',
                       help='Output format (default: text)')
    parser.add_argument('--strict', action='store_true',
                       help='Treat warnings as errors')
    
    args = parser.parse_args()
    
    checker = InputValidationChecker()
    
    # Run checks
    if args.file:
        violations = checker.check_file(args.file)
    elif args.pr:
        violations = checker.check_pr(args.pr)
    elif args.type:
        # Map type to category
        type_map = {
            'dto': 'dto_validation',
            'file': 'file_validation',
            'xss': 'xss_prevention',
            'injection': 'injection_prevention',
            'size_limit': 'size_limit'
        }
        violations = checker.check_type(type_map.get(args.type))
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





