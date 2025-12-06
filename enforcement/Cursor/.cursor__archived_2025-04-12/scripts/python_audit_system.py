#!/usr/bin/env python3
"""
Python Code Audit System
Systematically audits all Python files using Python_Code_Quality.md and Python_Code_Audit.md templates.

Features:
- Individual code quality audits for each .py file
- Comprehensive project-wide audit report
- Python Bible compliance checking
- Anti-pattern detection

Last Updated: 2025-12-04
"""

import os
import sys
import re
import json
import ast
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, asdict
from collections import defaultdict

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="python_audit_system")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("python_audit_system")

# Import Python Bible parser
try:
    from python_bible_parser import PythonBibleParser, BiblePattern
    BIBLE_PARSER_AVAILABLE = True
except ImportError:
    BIBLE_PARSER_AVAILABLE = False
    logger.warning("Python Bible parser not available - using static patterns only")


@dataclass
class CodeQualityScore:
    """Code quality scores for a file."""
    readability: int  # 0-10
    simplicity: int
    maintainability: int
    efficiency: int
    idiomaticity: int
    error_handling: int
    testability: int
    overall: int


@dataclass
class Issue:
    """Represents a code quality issue."""
    severity: str  # HIGH, MEDIUM, LOW
    category: str  # readability, performance, security, etc.
    description: str
    evidence: str  # Code snippet or line reference
    line_number: Optional[int] = None
    recommended_fix: Optional[str] = None
    impact_dimension: Optional[str] = None


@dataclass
class FileAuditResult:
    """Results of auditing a single Python file."""
    file_path: str
    file_size: int
    line_count: int
    scores: CodeQualityScore
    issues: List[Issue]
    positive_observations: List[str]
    verdict: str  # A, B, or C
    production_readiness: str
    remediation_effort: str


class PythonCodeAuditor:
    """
    Audits Python code using Python Bible standards.
    
    Checks:
    - Pythonic code quality
    - Security vulnerabilities
    - Performance issues
    - Error handling
    - Type safety
    - Anti-patterns
    """
    
    # Python anti-patterns to detect
    ANTI_PATTERNS = {
        'mutable_default_args': re.compile(r'def\s+\w+\([^)]*=\s*\[', re.MULTILINE),
        'bare_except': re.compile(r'except\s*:', re.MULTILINE),
        'eval_usage': re.compile(r'eval\s*\(', re.MULTILINE),
        'exec_usage': re.compile(r'exec\s*\(', re.MULTILINE),
        'print_statements': re.compile(r'print\s*\(', re.MULTILINE),
        'os_path_instead_of_pathlib': re.compile(r'os\.path\.', re.MULTILINE),
        'string_concatenation_loop': re.compile(r'for\s+.*:\s*.*\s*\+=\s*["\']', re.MULTILINE),
        'global_variables': re.compile(r'^global\s+', re.MULTILINE),
        'time_sleep_async': re.compile(r'time\.sleep\s*\(', re.MULTILINE),
        'pickle_usage': re.compile(r'pickle\.(load|loads|dump|dumps)', re.MULTILINE),
        'yaml_unsafe_load': re.compile(r'yaml\.load\s*\(', re.MULTILINE),
        'sql_injection_risk': re.compile(r'f["\'].*SELECT.*\{.*\}', re.MULTILINE | re.IGNORECASE),
    }
    
    def __init__(self, project_root: Path):
        """Initialize auditor."""
        self.project_root = project_root
        self.audit_results: List[FileAuditResult] = []
        
        # Initialize Python Bible parser if available
        self.bible_parser = None
        self.bible_knowledge = None
        if BIBLE_PARSER_AVAILABLE:
            bible_root = project_root / "docs" / "reference" / "Programming Bibles" / "bibles" / "python_bible"
            if bible_root.exists():
                self.bible_parser = PythonBibleParser(bible_root)
                self.bible_knowledge = self.bible_parser.parse_all_chapters()
                logger.info(f"Loaded {len(self.bible_knowledge.patterns)} patterns from Python Bible")
            else:
                logger.warning(f"Python Bible not found at {bible_root}")
        
    def find_all_python_files(self) -> List[Path]:
        """Find all Python files in the project, excluding backup/archive directories."""
        python_files = []
        for root, dirs, files in os.walk(self.project_root):
            # Skip common directories and backup/archive directories
            dirs[:] = [d for d in dirs if d not in [
                '.git', '__pycache__', 'node_modules', '.venv', 'venv',
                'dist', 'build', '.pytest_cache', '.mypy_cache',
                'backup', 'backups', 'archive', 'archives',  # Exclude backup/archive dirs
            ] and not d.startswith('backup_') and not d.startswith('archive_')]
            
            # Skip if current directory is a backup/archive directory
            root_path = Path(root)
            if any(part.startswith('backup') or part.startswith('archive') 
                   for part in root_path.parts):
                continue
            
            for file in files:
                if file.endswith('.py'):
                    python_files.append(Path(root) / file)
        
        return sorted(python_files)
    
    def audit_file(self, file_path: Path) -> FileAuditResult:
        """
        Audit a single Python file.
        
        Returns comprehensive audit result following Python_Code_Quality.md template.
        """
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                lines = content.split('\n')
        except Exception as e:
            logger.warn(
                f"Failed to read file: {file_path}",
                operation="audit_file",
                error_code="FILE_READ_FAILED",
                root_cause=str(e)
            )
            return self._create_error_result(file_path, str(e))
        
        # Parse AST for deeper analysis
        try:
            tree = ast.parse(content)
        except SyntaxError:
            tree = None
        
        # Analyze file
        issues = self._detect_issues(content, lines, tree, file_path)
        positive_observations = self._find_positive_observations(content, lines, tree)
        scores = self._calculate_scores(content, lines, tree, issues)
        verdict = self._determine_verdict(scores, issues)
        production_readiness = self._assess_production_readiness(scores, issues)
        remediation_effort = self._estimate_remediation_effort(issues)
        
        return FileAuditResult(
            file_path=str(file_path.relative_to(self.project_root)),
            file_size=len(content),
            line_count=len(lines),
            scores=scores,
            issues=issues,
            positive_observations=positive_observations,
            verdict=verdict,
            production_readiness=production_readiness,
            remediation_effort=remediation_effort
        )
    
    def _detect_issues(self, content: str, lines: List[str], tree: Optional[ast.AST], file_path: Path) -> List[Issue]:
        """Detect code quality issues."""
        issues = []
        
        # Check anti-patterns
        for pattern_name, pattern in self.ANTI_PATTERNS.items():
            matches = pattern.finditer(content)
            for match in matches:
                line_num = content[:match.start()].count('\n') + 1
                line_content = lines[line_num - 1] if line_num <= len(lines) else ""
                
                severity = self._get_pattern_severity(pattern_name)
                category = self._get_pattern_category(pattern_name)
                
                # Try to find matching Bible pattern for enhanced description
                bible_pattern = None
                if self.bible_parser:
                    code_snippet = line_content.strip()
                    bible_pattern = self.bible_parser.find_matching_pattern(code_snippet, category)
                
                # Build description with Bible reference if available
                description = self._get_pattern_description(pattern_name)
                recommended_fix = self._get_pattern_fix(pattern_name)
                
                if bible_pattern:
                    description = f"{description} (Python Bible: {bible_pattern.bible_reference})"
                    if bible_pattern.recommended_pattern:
                        recommended_fix = f"{recommended_fix}. Bible recommendation: {bible_pattern.recommended_pattern[:200]}"
                    if bible_pattern.description:
                        description = f"{bible_pattern.description} (Python Bible: {bible_pattern.bible_reference})"
                
                issues.append(Issue(
                    severity=severity,
                    category=category,
                    description=description,
                    evidence=f"Line {line_num}: {line_content.strip()[:100]}",
                    line_number=line_num,
                    recommended_fix=recommended_fix,
                    impact_dimension=self._get_pattern_impact(pattern_name)
                ))
        
        # Check Bible patterns directly (for patterns not in ANTI_PATTERNS)
        if self.bible_knowledge:
            issues.extend(self._check_bible_patterns(content, lines))
        
        # AST-based checks
        if tree:
            issues.extend(self._ast_checks(tree, lines))
        
        # Type hint checks
        issues.extend(self._check_type_hints(content, lines))
        
        # Error handling checks
        issues.extend(self._check_error_handling(content, lines))
        
        # Security checks
        issues.extend(self._check_security(content, lines))
        
        return issues
    
    def _check_bible_patterns(self, content: str, lines: List[str]) -> List[Issue]:
        """Check code against Python Bible patterns directly."""
        issues = []
        
        if not self.bible_knowledge:
            return issues
        
        # Check each Bible pattern
        for bible_pattern in self.bible_knowledge.patterns:
            # Skip if we already check this via ANTI_PATTERNS
            if self._is_covered_by_anti_patterns(bible_pattern):
                continue
            
            # Search for anti-pattern in content
            if bible_pattern.anti_pattern:
                # Simple text search (can be enhanced with AST)
                if bible_pattern.anti_pattern.lower() in content.lower():
                    # Find line number
                    lines_lower = [line.lower() for line in lines]
                    for i, line in enumerate(lines_lower):
                        if bible_pattern.anti_pattern.lower() in line:
                            issues.append(Issue(
                                severity=bible_pattern.severity,
                                category=bible_pattern.category,
                                description=f"{bible_pattern.description} (Python Bible: {bible_pattern.bible_reference})",
                                evidence=f"Line {i+1}: {lines[i].strip()[:100]}",
                                line_number=i+1,
                                recommended_fix=bible_pattern.recommended_pattern or "See Python Bible for recommended pattern",
                                impact_dimension=self._get_impact_from_category(bible_pattern.category)
                            ))
                            break  # Only report first occurrence per file
        
        return issues
    
    def _is_covered_by_anti_patterns(self, bible_pattern: BiblePattern) -> bool:
        """Check if Bible pattern is already covered by ANTI_PATTERNS."""
        anti_pattern_lower = bible_pattern.anti_pattern.lower()
        
        # Map Bible patterns to our ANTI_PATTERNS
        coverage_map = {
            'eval': 'eval_usage',
            'exec': 'exec_usage',
            'pickle': 'pickle_usage',
            'yaml.load': 'yaml_unsafe_load',
            'os.path': 'os_path_instead_of_pathlib',
        }
        
        for key, pattern_name in coverage_map.items():
            if key in anti_pattern_lower:
                return True
        
        return False
    
    def _get_impact_from_category(self, category: str) -> str:
        """Get impact dimension from category."""
        impact_map = {
            'security': 'Security',
            'error_handling': 'Reliability',
            'performance': 'Performance',
            'pythonic': 'Maintainability',
            'type_safety': 'Correctness',
            'concurrency': 'Performance',
            'architecture': 'Maintainability',
            'testing': 'Quality',
        }
        return impact_map.get(category, 'Code Quality')
    
    def _get_pattern_severity(self, pattern_name: str) -> str:
        """Get severity for anti-pattern."""
        high_severity = ['eval_usage', 'exec_usage', 'pickle_usage', 'yaml_unsafe_load', 'sql_injection_risk']
        if pattern_name in high_severity:
            return 'HIGH'
        elif pattern_name in ['mutable_default_args', 'bare_except', 'print_statements']:
            return 'MEDIUM'
        return 'LOW'
    
    def _get_pattern_category(self, pattern_name: str) -> str:
        """Get category for anti-pattern."""
        category_map = {
            'eval_usage': 'security',
            'exec_usage': 'security',
            'pickle_usage': 'security',
            'yaml_unsafe_load': 'security',
            'sql_injection_risk': 'security',
            'mutable_default_args': 'pythonic',
            'bare_except': 'error_handling',
            'print_statements': 'observability',
            'os_path_instead_of_pathlib': 'pythonic',
            'string_concatenation_loop': 'performance',
            'global_variables': 'maintainability',
            'time_sleep_async': 'concurrency',
        }
        return category_map.get(pattern_name, 'code_quality')
    
    def _get_pattern_description(self, pattern_name: str) -> str:
        """Get description for anti-pattern."""
        descriptions = {
            'mutable_default_args': 'Mutable default argument detected (use None instead)',
            'bare_except': 'Bare except clause detected (specify exception type)',
            'eval_usage': 'eval() usage detected (security risk)',
            'exec_usage': 'exec() usage detected (security risk)',
            'print_statements': 'print() statement detected (use structured logging)',
            'os_path_instead_of_pathlib': 'os.path usage detected (use pathlib.Path)',
            'string_concatenation_loop': 'String concatenation in loop (use join())',
            'global_variables': 'Global variable usage detected',
            'time_sleep_async': 'time.sleep() in async context (use asyncio.sleep)',
            'pickle_usage': 'pickle usage detected (security risk with untrusted data)',
            'yaml_unsafe_load': 'yaml.load() detected (use yaml.safe_load)',
            'sql_injection_risk': 'Potential SQL injection risk (f-string in SQL)',
        }
        return descriptions.get(pattern_name, f'Anti-pattern: {pattern_name}')
    
    def _get_pattern_fix(self, pattern_name: str) -> str:
        """Get recommended fix for anti-pattern."""
        fixes = {
            'mutable_default_args': 'Use None as default, check and initialize in function body',
            'bare_except': 'Specify specific exception types (ValueError, KeyError, etc.)',
            'eval_usage': 'Use safer alternatives (ast.literal_eval, json.loads, etc.)',
            'exec_usage': 'Refactor to avoid exec() or use restricted execution',
            'print_statements': 'Replace with structured logging (logger.info, logger.error, etc.)',
            'os_path_instead_of_pathlib': 'Use pathlib.Path for file operations',
            'string_concatenation_loop': 'Use str.join() or list comprehension',
            'global_variables': 'Use dependency injection or class attributes',
            'time_sleep_async': 'Use asyncio.sleep() instead',
            'pickle_usage': 'Use json, msgpack, or other safe serialization',
            'yaml_unsafe_load': 'Use yaml.safe_load() instead',
            'sql_injection_risk': 'Use parameterized queries (Prisma, SQLAlchemy, etc.)',
        }
        return fixes.get(pattern_name, 'Review and refactor')
    
    def _get_pattern_impact(self, pattern_name: str) -> str:
        """Get impact dimension for anti-pattern."""
        impact_map = {
            'eval_usage': 'Security',
            'exec_usage': 'Security',
            'pickle_usage': 'Security',
            'yaml_unsafe_load': 'Security',
            'sql_injection_risk': 'Security',
            'mutable_default_args': 'Correctness',
            'bare_except': 'Maintainability',
            'print_statements': 'Observability',
            'os_path_instead_of_pathlib': 'Maintainability',
            'string_concatenation_loop': 'Performance',
            'global_variables': 'Maintainability',
            'time_sleep_async': 'Performance',
        }
        return impact_map.get(pattern_name, 'Code Quality')
    
    def _ast_checks(self, tree: ast.AST, lines: List[str]) -> List[Issue]:
        """Perform AST-based checks."""
        issues = []
        
        class Checker(ast.NodeVisitor):
            def __init__(self, lines):
                self.lines = lines
                self.issues = []
            
            def visit_FunctionDef(self, node):
                # Check for type hints
                if not node.returns and not any(isinstance(arg.annotation, ast.Name) or isinstance(arg.annotation, ast.Constant) for arg in node.args.args):
                    # No return type hint - but this is common, so LOW severity
                    pass
                
                self.generic_visit(node)
        
        checker = Checker(lines)
        checker.visit(tree)
        issues.extend(checker.issues)
        
        return issues
    
    def _check_type_hints(self, content: str, lines: List[str]) -> List[Issue]:
        """Check type hint coverage."""
        issues = []
        
        # Count functions with and without type hints
        function_pattern = re.compile(r'def\s+(\w+)\s*\([^)]*\)\s*[-:>]?')
        functions = function_pattern.findall(content)
        
        # Check for Any type overuse
        any_count = content.count(': Any') + content.count('-> Any')
        if any_count > 5:
            issues.append(Issue(
                severity='MEDIUM',
                category='type_safety',
                description=f'Excessive use of Any type ({any_count} instances)',
                evidence=f'Found {any_count} uses of Any type',
                recommended_fix='Use specific types or Union types instead of Any',
                impact_dimension='Type Safety'
            ))
        
        return issues
    
    def _check_error_handling(self, content: str, lines: List[str]) -> List[Issue]:
        """Check error handling patterns."""
        issues = []
        
        # Check for empty except blocks
        empty_except = re.compile(r'except\s+\w+.*:\s*\n\s*pass', re.MULTILINE)
        if empty_except.search(content):
            issues.append(Issue(
                severity='MEDIUM',
                category='error_handling',
                description='Empty except block detected (silent failure)',
                evidence='except block with only pass statement',
                recommended_fix='Add logging or proper error handling',
                impact_dimension='Reliability'
            ))
        
        return issues
    
    def _check_security(self, content: str, lines: List[str]) -> List[Issue]:
        """Check security issues."""
        issues = []
        
        # Check for hardcoded secrets
        secret_patterns = [
            (r'password\s*=\s*["\'][^"\']+["\']', 'Hardcoded password'),
            (r'api_key\s*=\s*["\'][^"\']+["\']', 'Hardcoded API key'),
            (r'secret\s*=\s*["\'][^"\']+["\']', 'Hardcoded secret'),
        ]
        
        for pattern, description in secret_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                issues.append(Issue(
                    severity='HIGH',
                    category='security',
                    description=description,
                    evidence='Hardcoded credential detected',
                    recommended_fix='Use environment variables or secret management',
                    impact_dimension='Security'
                ))
        
        return issues
    
    def _find_positive_observations(self, content: str, lines: List[str], tree: Optional[ast.AST]) -> List[str]:
        """Find positive aspects of the code."""
        positives = []
        
        # Check for type hints
        if ': ' in content or ' -> ' in content:
            positives.append('Type hints present')
        
        # Check for docstrings
        if '"""' in content or "'''" in content:
            positives.append('Docstrings present')
        
        # Check for pathlib usage
        if 'from pathlib import' in content or 'Path(' in content:
            positives.append('Uses pathlib.Path for file operations')
        
        # Check for dataclasses
        if '@dataclass' in content or 'from dataclasses import' in content:
            positives.append('Uses dataclasses for data structures')
        
        # Check for structured logging
        if 'logger.' in content and 'print(' not in content:
            positives.append('Uses structured logging instead of print()')
        
        # Check for context managers
        if 'with ' in content:
            positives.append('Uses context managers for resource management')
        
        return positives
    
    def _calculate_scores(self, content: str, lines: List[str], tree: Optional[ast.AST], issues: List[Issue]) -> CodeQualityScore:
        """Calculate quality scores."""
        # Base scores
        readability = 7
        simplicity = 7
        maintainability = 7
        efficiency = 7
        idiomaticity = 7
        error_handling = 7
        testability = 7
        
        # Adjust based on issues
        high_issues = [i for i in issues if i.severity == 'HIGH']
        medium_issues = [i for i in issues if i.severity == 'MEDIUM']
        low_issues = [i for i in issues if i.severity == 'LOW']
        
        # Penalties
        readability -= len([i for i in high_issues + medium_issues if i.category == 'readability']) * 0.5
        maintainability -= len([i for i in high_issues + medium_issues if i.category == 'maintainability']) * 0.5
        efficiency -= len([i for i in high_issues if i.category == 'performance']) * 1
        idiomaticity -= len([i for i in high_issues + medium_issues if i.category == 'pythonic']) * 0.5
        error_handling -= len([i for i in high_issues + medium_issues if i.category == 'error_handling']) * 0.5
        
        # Bonuses
        if 'from pathlib import' in content:
            idiomaticity += 0.5
        if '@dataclass' in content:
            idiomaticity += 0.5
        if 'logger.' in content:
            maintainability += 0.5
        
        # Clamp scores
        scores = [
            readability, simplicity, maintainability, efficiency,
            idiomaticity, error_handling, testability
        ]
        scores = [max(0, min(10, int(round(s)))) for s in scores]
        
        overall = int(round(sum(scores) / len(scores)))
        
        return CodeQualityScore(
            readability=scores[0],
            simplicity=scores[1],
            maintainability=scores[2],
            efficiency=scores[3],
            idiomaticity=scores[4],
            error_handling=scores[5],
            testability=scores[6],
            overall=overall
        )
    
    def _determine_verdict(self, scores: CodeQualityScore, issues: List[Issue]) -> str:
        """Determine overall verdict."""
        high_issues = [i for i in issues if i.severity == 'HIGH']
        
        if scores.overall >= 8 and len(high_issues) == 0:
            return 'A'  # Clean and maintainable
        elif scores.overall >= 6 and len(high_issues) < 3:
            return 'B'  # Needs moderate refactoring
        else:
            return 'C'  # Needs significant rewrite
    
    def _assess_production_readiness(self, scores: CodeQualityScore, issues: List[Issue]) -> str:
        """Assess production readiness."""
        high_issues = [i for i in issues if i.severity == 'HIGH']
        security_issues = [i for i in high_issues if i.category == 'security']
        
        if security_issues:
            return 'Not ready - Security issues must be fixed'
        elif high_issues:
            return 'Ready with fixes - High priority issues need attention'
        elif scores.overall >= 7:
            return 'Ready'
        else:
            return 'Needs work'
    
    def _estimate_remediation_effort(self, issues: List[Issue]) -> str:
        """Estimate remediation effort."""
        high_count = len([i for i in issues if i.severity == 'HIGH'])
        medium_count = len([i for i in issues if i.severity == 'MEDIUM'])
        
        if high_count > 5 or (high_count + medium_count) > 20:
            return 'Weeks'
        elif high_count > 2 or (high_count + medium_count) > 10:
            return 'Days'
        elif high_count > 0 or medium_count > 5:
            return 'Hours'
        else:
            return 'Hours'
    
    def _create_error_result(self, file_path: Path, error: str) -> FileAuditResult:
        """Create error result for files that couldn't be audited."""
        return FileAuditResult(
            file_path=str(file_path.relative_to(self.project_root)),
            file_size=0,
            line_count=0,
            scores=CodeQualityScore(0, 0, 0, 0, 0, 0, 0, 0),
            issues=[Issue(
                severity='HIGH',
                category='system',
                description=f'Failed to audit file: {error}',
                evidence='File read/parse error'
            )],
            positive_observations=[],
            verdict='C',
            production_readiness='Not ready - Audit failed',
            remediation_effort='Unknown'
        )
    
    def generate_quality_report(self, result: FileAuditResult) -> str:
        """Generate code quality report for a single file."""
        report = f"""# Code Quality Audit: {result.file_path}

**Date:** {datetime.now(timezone.utc).strftime('%Y-%m-%d')}  
**File:** `{result.file_path}`  
**Size:** {result.file_size:,} bytes  
**Lines:** {result.line_count:,}

---

## PHASE 1 — HIGH-LEVEL EVALUATION

This file implements [purpose to be determined from code analysis]. The code demonstrates [quality assessment] with [specific observations about clarity, structure, and patterns].

---

## PHASE 1.5 — POSITIVE OBSERVATIONS

What is done well in this code:

"""
        
        if result.positive_observations:
            for obs in result.positive_observations:
                report += f"- {obs}\n"
        else:
            report += "- [To be determined from code analysis]\n"
        
        report += f"""
---

## PHASE 2 — QUALITY SCORING (0–10)

1. **Readability:** {result.scores.readability}/10
   - [Justification based on code structure, naming, comments]

2. **Simplicity:** {result.scores.simplicity}/10
   - [Justification based on complexity analysis]

3. **Maintainability:** {result.scores.maintainability}/10
   - [Justification based on modularity, separation of concerns]

4. **Efficiency:** {result.scores.efficiency}/10
   - [Justification based on algorithmic complexity, memory usage]

5. **Idiomaticity:** {result.scores.idiomaticity}/10
   - [Justification based on Python conventions, standard patterns]

6. **Error Handling & Robustness:** {result.scores.error_handling}/10
   - [Justification based on exception handling, edge cases]

7. **Testability:** {result.scores.testability}/10
   - [Justification based on test coverage, dependency management]

8. **Overall Engineering Quality:** {result.scores.overall}/10
   - [Overall assessment]

---

## PHASE 3 — ISSUES & FINDINGS

"""
        
        # Group issues by severity
        high_issues = [i for i in result.issues if i.severity == 'HIGH']
        medium_issues = [i for i in result.issues if i.severity == 'MEDIUM']
        low_issues = [i for i in result.issues if i.severity == 'LOW']
        
        issue_num = 1
        for issue in high_issues + medium_issues[:10] + (low_issues[:5] if len(low_issues) > 10 else low_issues):
            report += f"""**[ISSUE #{issue_num}] — {issue.category.upper()}**

**Description:**
{issue.description}

**Why this is a problem:**
[Impact on code quality, maintenance, or behavior]

**Evidence:**
{issue.evidence}

**Severity:** {issue.severity}

**Impact dimension:** {issue.impact_dimension or 'Code Quality'}

**Recommended fix (conceptual only — NO code):**
{issue.recommended_fix or '[Describe approach without writing actual code]'}

---

"""
            issue_num += 1
        
        if len(low_issues) > 5:
            report += f"*... and {len(low_issues) - 5} more LOW severity issues.*\n\n---\n\n"
        
        report += f"""
## PHASE 4 — TOP 5 QUICK WINS

[To be determined from issues - highest impact, lowest effort improvements]

---

## PHASE 5 — ARCHITECTURE & PATTERN COMPLIANCE

**Idiomaticity:**
- [Assessment of Python idioms and conventions]

**Modularity:**
- [Assessment of design modularity and separation of concerns]

**Naming:**
- [Assessment of naming conventions]

**Complexity:**
- [Assessment of code complexity]

**Long-term maintainability:**
- [Assessment of future maintainability]

---

## PHASE 6 — OVERALL VERDICT

**Verdict:** {result.verdict}

**Reasoning:**
[3-6 sentences explaining verdict, referencing key findings]

**Production readiness:**
{result.production_readiness}

**Estimated remediation effort:**
{result.remediation_effort}

---

**Last Updated:** {datetime.now(timezone.utc).strftime('%Y-%m-%d')}
"""
        
        return report
    
    def generate_comprehensive_audit(self) -> str:
        """Generate comprehensive Python_Code_Audit.md report."""
        # Aggregate statistics
        total_files = len(self.audit_results)
        high_issues_count = sum(len([i for i in r.issues if i.severity == 'HIGH']) for r in self.audit_results)
        medium_issues_count = sum(len([i for i in r.issues if i.severity == 'MEDIUM']) for r in self.audit_results)
        low_issues_count = sum(len([i for i in r.issues if i.severity == 'LOW']) for r in self.audit_results)
        
        avg_score = sum(r.scores.overall for r in self.audit_results) / total_files if total_files > 0 else 0
        
        # Group issues by category
        issues_by_category = defaultdict(list)
        for result in self.audit_results:
            for issue in result.issues:
                issues_by_category[issue.category].append((result.file_path, issue))
        
        report = f"""# Python Code Audit - Comprehensive Report

**Date:** {datetime.now(timezone.utc).strftime('%Y-%m-%d')}  
**Auditor:** AI Agent (Python Bible Standards)  
**Scope:** All Python files in project  
**Total Files Analyzed:** {total_files}

**Reference:** 
- `.cursor/rules/python_bible.mdc` (enforcement rules)
- `docs/reference/Programming Bibles/bibles/python_bible/chapters/` (knowledge base)

**Python Bible Integration:** {f"{len(self.bible_knowledge.patterns)} patterns loaded from {len(self.bible_knowledge.chapter_index)} chapters" if self.bible_knowledge else "Not available (using static patterns only)"}

---

## EXECUTIVE SUMMARY

**Overall Grade: {self._grade_from_score(avg_score)} ({avg_score:.1f}/10)**

{self._generate_overall_assessment(avg_score, high_issues_count, medium_issues_count, low_issues_count)}

### Key Statistics

- **Total Python Files:** {total_files}
- **Average Quality Score:** {avg_score:.1f}/10
- **Critical Issues (HIGH):** {high_issues_count}
- **Medium Priority Issues:** {medium_issues_count}
- **Low Priority Issues:** {low_issues_count}

---

## PHASE 1 — PYTHON-SPECIFIC AUDIT DOMAINS

### 1. SECURITY & VULNERABILITIES (0-10)

**Score: [To be calculated]**

**Findings:**
"""
        
        security_issues = issues_by_category.get('security', [])
        if security_issues:
            for file_path, issue in security_issues[:10]:
                report += f"- **{file_path}**: {issue.description}\n"
        else:
            report += "- ✅ No security vulnerabilities detected\n"
        
        report += f"""
**Recommendations:**
- [Security improvement recommendations]

---

### 2. PYTHONIC CODE QUALITY (0-10)

**Score: [To be calculated]**

**Findings:**
"""
        
        pythonic_issues = issues_by_category.get('pythonic', [])
        if pythonic_issues:
            for file_path, issue in pythonic_issues[:10]:
                report += f"- **{file_path}**: {issue.description}\n"
        else:
            report += "- ✅ Code follows Pythonic patterns\n"
        
        report += """
**Recommendations:**
- [Pythonic code improvements]

---

### 3. TYPE SAFETY & CORRECTNESS (0-10)

**Score: [To be calculated]**

**Findings:**
"""
        
        type_issues = issues_by_category.get('type_safety', [])
        if type_issues:
            for file_path, issue in type_issues[:10]:
                report += f"- **{file_path}**: {issue.description}\n"
        else:
            report += "- ✅ Type hints are well-implemented\n"
        
        report += """
**Recommendations:**
- [Type safety improvements]

---

### 4. PERFORMANCE & EFFICIENCY (0-10)

**Score: [To be calculated]**

**Findings:**
"""
        
        perf_issues = [i for cat, issues in issues_by_category.items() if cat == 'performance' for i in issues]
        if perf_issues:
            for file_path, issue in perf_issues[:10]:
                report += f"- **{file_path}**: {issue.description}\n"
        else:
            report += "- ✅ No major performance issues detected\n"
        
        report += """
**Recommendations:**
- [Performance optimizations]

---

### 5. ERROR HANDLING & RELIABILITY (0-10)

**Score: [To be calculated]**

**Findings:**
"""
        
        error_issues = issues_by_category.get('error_handling', [])
        if error_issues:
            for file_path, issue in error_issues[:10]:
                report += f"- **{file_path}**: {issue.description}\n"
        else:
            report += "- ✅ Error handling is appropriate\n"
        
        report += """
**Recommendations:**
- [Error handling improvements]

---

## PHASE 2 — PYTHON ANTI-PATTERNS CHECK

**Anti-Patterns Detected:**

"""
        
        # Count anti-patterns
        anti_pattern_counts = defaultdict(int)
        for result in self.audit_results:
            for issue in result.issues:
                if 'Anti-pattern' in issue.description or issue.category in ['pythonic', 'error_handling']:
                    anti_pattern_counts[issue.description] += 1
        
        for pattern, count in sorted(anti_pattern_counts.items(), key=lambda x: x[1], reverse=True)[:20]:
            report += f"- [ ] {pattern} ({count} instances)\n"
        
        report += """
---

## PHASE 3 — CRITICAL SECURITY FINDINGS

"""
        
        critical_security = [i for r in self.audit_results for i in r.issues if i.severity == 'HIGH' and i.category == 'security']
        if critical_security:
            for idx, issue in enumerate(critical_security[:10], 1):
                report += f"""**[HIGH] Security — {issue.description}**

**Description:**
{issue.description}

**Attack vector:**
[Potential attack vector]

**Code location:**
{issue.evidence}

**Exploitation difficulty:** [LOW/MEDIUM/HIGH]

**Remediation:**
{issue.recommended_fix}

**Example secure code:**
[Secure code example]

---

"""
        else:
            report += "✅ No critical security vulnerabilities detected.\n\n---\n\n"
        
        report += """
## PHASE 4 — PERFORMANCE BOTTLENECKS

[Performance analysis to be added]

---

## PHASE 5 — DEPENDENCY AUDIT

[To be populated from requirements.txt/pyproject.toml analysis]

---

## PHASE 6 — PYTHON VERSION COMPATIBILITY

**Target Python version:** [To be determined]

**Issues found:**
- [Features requiring newer Python]
- [Deprecated features used]
- [Incompatible syntax]

---

## PHASE 7 — FRAMEWORK-SPECIFIC AUDIT

[Framework-specific findings if applicable]

---

## PHASE 8 — PRIORITY MATRIX

### Critical (Fix immediately):
1. [Security vulnerabilities]
2. [Data corruption risks]
3. [Production blockers]

### High (Fix before production):
1. [Performance bottlenecks]
2. [Error handling gaps]
3. [Dependency CVEs]

### Medium (Technical debt):
1. [Code quality issues]
2. [Missing tests]
3. [Documentation gaps]

### Low (Nice to have):
1. [Style improvements]
2. [Minor optimizations]

---

## PHASE 9 — PYTHON BEST PRACTICES SCORECARD

[✓] [✗] [PARTIAL]
- [ ] Type hints on all public functions
- [ ] Docstrings on all public modules/classes/functions
- [ ] No mutable default arguments
- [ ] Context managers for all resources
- [ ] Specific exception handling
- [ ] Logging instead of print
- [ ] F-strings for formatting
- [ ] Pathlib for file operations
- [ ] List comprehensions where appropriate
- [ ] Generators for large datasets
- [ ] Virtual environment specified
- [ ] Dependencies pinned with hashes
- [ ] Pre-commit hooks configured
- [ ] Linting (ruff, pylint, flake8)
- [ ] Type checking (mypy, pyright)
- [ ] Security scanning (bandit, safety)
- [ ] Test coverage >80%
- [ ] CI/CD pipeline present

---

## PHASE 10 — EXECUTIVE SUMMARY

**Overall Risk:** [LOW / MEDIUM / HIGH / CRITICAL]

**Production Readiness:** [READY / NEEDS WORK / NOT READY]

**Top 3 Blockers:**
1. [Top blocker]
2. [Second blocker]
3. [Third blocker]

**Pythonic Code Quality:** [EXCELLENT / GOOD / NEEDS IMPROVEMENT / POOR]

**Technical Debt Level:** [LOW / MEDIUM / HIGH]

**Estimated Remediation Effort:** [X days/weeks]

**Key Strengths:**
- [Strength 1]
- [Strength 2]
- [Strength 3]

**Critical Improvements Needed:**
- [Improvement 1]
- [Improvement 2]
- [Improvement 3]

**Long-term Recommendations:**
- [Recommendation 1]
- [Recommendation 2]
- [Recommendation 3]

---

## TOOLING RECOMMENDATIONS

**Suggested tools:**
- **Linting:** ruff, black, isort
- **Type checking:** mypy, pyright, pyre
- **Security:** bandit, safety, pip-audit
- **Testing:** pytest, hypothesis, coverage.py
- **Performance:** py-spy, memory_profiler, line_profiler
- **Dependency management:** poetry, pip-tools, pipenv
- **Pre-commit:** hooks for automated checks

---

**Last Updated:** {datetime.now(timezone.utc).strftime('%Y-%m-%d')}
"""
        
        return report
    
    def _generate_overall_assessment(self, avg_score: float, high_count: int, medium_count: int, low_count: int) -> str:
        """Generate overall assessment text based on scores and issues."""
        if avg_score >= 8.0:
            quality = "excellent"
        elif avg_score >= 7.0:
            quality = "good"
        elif avg_score >= 6.0:
            quality = "acceptable"
        else:
            quality = "needs improvement"
        
        assessment = f"The codebase demonstrates {quality} engineering practices"
        
        if high_count > 0:
            assessment += f" with {high_count} critical issues requiring immediate attention"
        elif medium_count > 50:
            assessment += f" with {medium_count} medium-priority issues that should be addressed"
        else:
            assessment += " with relatively few issues"
        
        if avg_score >= 7.0:
            assessment += ". The code is production-ready with minor improvements recommended."
        elif avg_score >= 6.0:
            assessment += ". The code is functional but needs quality improvements before production."
        else:
            assessment += ". Significant refactoring is recommended before production deployment."
        
        return assessment
    
    def _grade_from_score(self, score: float) -> str:
        """Convert numeric score to letter grade."""
        if score >= 9:
            return 'A+'
        elif score >= 8.5:
            return 'A'
        elif score >= 8:
            return 'A-'
        elif score >= 7.5:
            return 'B+'
        elif score >= 7:
            return 'B'
        elif score >= 6.5:
            return 'B-'
        elif score >= 6:
            return 'C+'
        elif score >= 5:
            return 'C'
        else:
            return 'D'
    
    def run_audit(self) -> Tuple[List[FileAuditResult], str]:
        """Run complete audit on all Python files."""
        logger.info(
            "Starting Python code audit",
            operation="run_audit",
            project_root=str(self.project_root)
        )
        
        python_files = self.find_all_python_files()
        logger.info(
            f"Found {len(python_files)} Python files to audit",
            operation="run_audit",
            file_count=len(python_files)
        )
        
        # Audit each file
        for idx, file_path in enumerate(python_files, 1):
            logger.info(
                f"Auditing file {idx}/{len(python_files)}: {file_path.name}",
                operation="run_audit",
                file_path=str(file_path.relative_to(self.project_root)),
                progress=f"{idx}/{len(python_files)}"
            )
            
            result = self.audit_file(file_path)
            self.audit_results.append(result)
        
        # Generate comprehensive report
        comprehensive_report = self.generate_comprehensive_audit()
        
        logger.info(
            "Python code audit completed",
            operation="run_audit",
            files_audited=len(self.audit_results),
            total_issues=sum(len(r.issues) for r in self.audit_results)
        )
        
        return self.audit_results, comprehensive_report


def main():
    """Main entry point."""
    auditor = PythonCodeAuditor(project_root)
    results, comprehensive_report = auditor.run_audit()
    
    # Save individual reports
    reports_dir = project_root / "docs" / "python-audits"
    reports_dir.mkdir(parents=True, exist_ok=True)
    
    for result in results:
        report = auditor.generate_quality_report(result)
        report_file = reports_dir / f"{Path(result.file_path).stem}_quality_audit.md"
        report_file.write_text(report, encoding='utf-8')
    
    # Save comprehensive report
    comprehensive_file = project_root / "docs" / "PYTHON_CODE_AUDIT.md"
    comprehensive_file.write_text(comprehensive_report, encoding='utf-8')
    
    logger.info(
        "Audit reports generated",
        operation="main",
        reports_dir=str(reports_dir),
        comprehensive_report=str(comprehensive_file),
        files_audited=len(results)
    )
    
    # User-facing summary (structured logging for consistency)
    logger.info(
        "Audit complete",
        operation="main",
        status="success",
        files_audited=len(results),
        reports_dir=str(reports_dir),
        comprehensive_report=str(comprehensive_file)
    )


if __name__ == '__main__':
    main()

