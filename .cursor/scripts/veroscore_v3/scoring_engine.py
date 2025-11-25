#!/usr/bin/env python3
"""
Hybrid Scoring Engine v2.1 for VeroScore V3

Implements comprehensive PR scoring with:
- File-level analysis (code quality, tests, docs, architecture, security)
- Violation detection integration (from detection_functions.py)
- Rule compliance scoring
- Pipeline compliance detection
- Stabilization formula (sigmoid: 0-10 range)
- Decision logic (auto-block, review, auto-approve)
- Supabase persistence
"""

import re
import math
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional, Tuple, Any
from datetime import datetime
from pathlib import Path
import sys

# Add parent directory to path for logger_util
scripts_dir = Path(__file__).parent.parent
if str(scripts_dir) not in sys.path:
    sys.path.insert(0, str(scripts_dir))

from logger_util import get_logger, get_or_create_trace_context
from .detection_functions import ViolationResult

logger = get_logger(context="ScoringEngine")


@dataclass
class CategoryScore:
    """Weighted category score"""
    raw_score: float  # -10 to +10 (or -100 to +10 for rule_compliance)
    weight: float
    weighted_score: float = 0.0
    
    def __post_init__(self):
        """Calculate weighted score after initialization"""
        self.weighted_score = round(self.raw_score * self.weight, 2)


@dataclass
class ScoreResult:
    """Complete scoring result"""
    pr_number: int
    repository: str
    session_id: Optional[str]
    author: str
    code_quality: CategoryScore
    test_coverage: CategoryScore
    documentation: CategoryScore
    architecture: CategoryScore
    security: CategoryScore
    rule_compliance: CategoryScore
    pipeline_complete: bool
    pipeline_bonus: float
    raw_score: float
    stabilized_score: float
    decision: str  # 'auto_block', 'review_required', 'auto_approve'
    decision_reason: str
    violations: List[ViolationResult]
    warnings: List[ViolationResult]
    scan_duration_ms: int
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for JSON serialization"""
        return {
            'pr_number': self.pr_number,
            'repository': self.repository,
            'session_id': self.session_id,
            'author': self.author,
            'code_quality': self.code_quality.raw_score,
            'test_coverage': self.test_coverage.raw_score,
            'documentation': self.documentation.raw_score,
            'architecture': self.architecture.raw_score,
            'security': self.security.raw_score,
            'rule_compliance': self.rule_compliance.raw_score,
            'code_quality_weighted': self.code_quality.weighted_score,
            'test_coverage_weighted': self.test_coverage.weighted_score,
            'documentation_weighted': self.documentation.weighted_score,
            'architecture_weighted': self.architecture.weighted_score,
            'security_weighted': self.security.weighted_score,
            'rule_compliance_weighted': self.rule_compliance.weighted_score,
            'pipeline_complete': self.pipeline_complete,
            'pipeline_bonus': self.pipeline_bonus,
            'raw_score': self.raw_score,
            'stabilized_score': self.stabilized_score,
            'decision': self.decision,
            'decision_reason': self.decision_reason,
            'violations': [v.to_dict() for v in self.violations],
            'warnings': [w.to_dict() for w in self.warnings],
            'scan_duration_ms': self.scan_duration_ms
        }


class ScoringWeights:
    """Centralized scoring weights configuration"""
    
    # Category weights (sum = 23)
    CODE_QUALITY = 3
    TEST_COVERAGE = 4
    DOCUMENTATION = 2
    ARCHITECTURE = 4
    SECURITY = 5
    RULE_COMPLIANCE = 5  # Can go very negative
    
    # Pipeline bonus
    PIPELINE_BONUS = 5.0
    
    # Critical violation penalties (applied to rule_compliance)
    VIOLATION_PENALTIES = {
        'rls_violation': -100.0,
        'architecture_drift': -75.0,
        'hardcoded_secret': -60.0,
        'hardcoded_tenant_id': -60.0,
        'hardcoded_date': -60.0,
        'xss_vulnerability': -50.0,
        'sql_injection': -50.0,
        'unstructured_logging': -30.0,
        'missing_trace_id': -20.0,
        'missing_tests': -15.0,
        'poor_error_handling': -10.0
    }
    
    # Decision thresholds
    AUTO_BLOCK_THRESHOLD = 0.0  # Score < 0 = auto-block
    REVIEW_REQUIRED_THRESHOLD = 6.0  # 0 <= score < 6 = review
    # Score >= 6 = auto-approve


class StabilizationFunction:
    """Stabilization formula to compress scores to 0-10 range"""
    
    @staticmethod
    def stabilize(raw_score: float, k: float = 15.0) -> float:
        """
        Stabilization formula: 10 / (1 + e^(-raw_score/k))
        - raw_score can be any value (negative to positive infinity)
        - Output is always 0-10
        - k controls steepness (15 is moderate)
        
        Args:
            raw_score: Raw weighted score (can be negative)
            k: Steepness parameter (default 15.0)
            
        Returns:
            Stabilized score in 0-10 range
        """
        try:
            stabilized = 10.0 / (1.0 + math.exp(-raw_score / k))
            return round(stabilized, 2)
        except OverflowError:
            # Handle extreme values
            if raw_score > 0:
                return 10.0
            else:
                return 0.0


class FileAnalyzer:
    """Analyzes individual files for scoring"""
    
    def __init__(self, file_path: str, content: str):
        self.file_path = file_path
        self.content = content
        self.lines = content.split('\n')
        
    def analyze_code_quality(self) -> float:
        """Analyze code quality (-10 to +10)"""
        score = 0.0
        trace_ctx = get_or_create_trace_context()
        
        # Positive signals
        if self._has_type_annotations():
            score += 2.0
        if self._has_good_naming():
            score += 2.0
        if self._has_comments():
            score += 1.0
        if len(self.lines) < 300:  # Reasonable file size
            score += 2.0
        if self._has_proper_formatting():
            score += 1.0
            
        # Negative signals
        if self._has_long_functions():
            score -= 3.0
        if self._has_code_smells():
            score -= 2.0
        if self._has_todos():
            score -= 1.0
            
        result = max(-10, min(10, score))
        logger.debug(
            "Code quality analyzed",
            operation="analyze_code_quality",
            file_path=self.file_path,
            score=result,
            **trace_ctx
        )
        return result
        
    def analyze_test_coverage(self) -> float:
        """Analyze test coverage indicators (-10 to +10)"""
        score = 0.0
        
        # Is this a test file?
        is_test = any(t in self.file_path.lower() for t in ['test', 'spec', '__tests__'])
        
        if is_test:
            score += 5.0
            if self._has_good_test_structure():
                score += 3.0
            if self._has_edge_case_tests():
                score += 2.0
        else:
            # Check if there's a corresponding test file (would need file system access)
            # For now, penalize if it's a code file with no test
            if self.file_path.endswith(('.ts', '.tsx', '.js', '.jsx', '.py')):
                score -= 5.0
                
        return max(-10, min(10, score))
        
    def analyze_documentation(self) -> float:
        """Analyze documentation quality (-10 to +10)"""
        score = 0.0
        
        # Check for function/class docstrings
        if self._has_docstrings():
            score += 4.0
        if self._has_inline_comments():
            score += 2.0
        if self._has_readme():
            score += 2.0
            
        # Check for outdated comments
        if self._has_outdated_comments():
            score -= 3.0
            
        return max(-10, min(10, score))
        
    def analyze_architecture(self) -> float:
        """Analyze architectural quality (-10 to +10)"""
        score = 0.0
        
        # Check proper separation of concerns
        if self._is_in_correct_directory():
            score += 3.0
        if self._has_single_responsibility():
            score += 3.0
        if self._follows_naming_convention():
            score += 2.0
            
        # Check for architectural violations
        if self._has_circular_imports():
            score -= 5.0
        if self._mixes_concerns():
            score -= 4.0
            
        return max(-10, min(10, score))
        
    def analyze_security(self) -> float:
        """Analyze security practices (-10 to +10)"""
        score = 0.0
        
        # Positive signals
        if self._has_input_validation():
            score += 3.0
        if self._uses_prepared_statements():
            score += 3.0
        if self._has_authentication_checks():
            score += 2.0
            
        # Negative signals (minor ones - major ones are in detectors)
        if self._has_console_logs():
            score -= 2.0
        if self._has_commented_code():
            score -= 1.0
            
        return max(-10, min(10, score))
    
    # Helper methods (simplified implementations)
    
    def _has_type_annotations(self) -> bool:
        return ': ' in self.content and '->' in self.content
        
    def _has_good_naming(self) -> bool:
        # Check for descriptive variable names (not single letters)
        words = re.findall(r'\b\w+\b', self.content)
        return len([w for w in words if len(w) > 3]) > 10
        
    def _has_comments(self) -> bool:
        comment_lines = [l for l in self.lines if l.strip().startswith(('#', '//'))]
        return len(comment_lines) > len(self.lines) * 0.1
        
    def _has_proper_formatting(self) -> bool:
        # Check for consistent indentation
        return not any('  \t' in l or '\t  ' in l for l in self.lines)
        
    def _has_long_functions(self) -> bool:
        # Simple heuristic: function with >50 lines
        in_function = False
        function_lines = 0
        for line in self.lines:
            if 'def ' in line or 'function ' in line or 'const ' in line and '= (' in line:
                in_function = True
                function_lines = 0
            if in_function:
                function_lines += 1
            if function_lines > 50:
                return True
        return False
        
    def _has_code_smells(self) -> bool:
        smells = ['TODO', 'FIXME', 'HACK', 'XXX']
        return any(smell in self.content for smell in smells)
        
    def _has_todos(self) -> bool:
        return 'TODO' in self.content
        
    def _has_good_test_structure(self) -> bool:
        return any(keyword in self.content for keyword in ['describe', 'it(', 'test(', 'def test_'])
        
    def _has_edge_case_tests(self) -> bool:
        return any(keyword in self.content for keyword in ['edge', 'boundary', 'null', 'empty'])
        
    def _has_docstrings(self) -> bool:
        return '"""' in self.content or "'''" in self.content or '/**' in self.content
        
    def _has_inline_comments(self) -> bool:
        return len([l for l in self.lines if l.strip().startswith(('#', '//'))]) > 5
        
    def _has_readme(self) -> bool:
        return 'readme' in self.file_path.lower()
        
    def _has_outdated_comments(self) -> bool:
        # Simple heuristic: comments mentioning old dates
        return bool(re.search(r'20[0-1][0-9]', self.content))
        
    def _is_in_correct_directory(self) -> bool:
        # Check if file type matches directory
        valid_patterns = {
            'components': ['.tsx', '.jsx'],
            'api': ['.ts', '.js'],
            'utils': ['.ts', '.js'],
            'types': ['.ts', '.d.ts']
        }
        for dir_name, extensions in valid_patterns.items():
            if dir_name in self.file_path:
                return any(self.file_path.endswith(ext) for ext in extensions)
        return True  # No specific pattern found
        
    def _has_single_responsibility(self) -> bool:
        # Count number of exports - more than 1 might indicate mixed concerns
        exports = len(re.findall(r'export (class|function|const)', self.content))
        return exports <= 3
        
    def _follows_naming_convention(self) -> bool:
        # Check if components are PascalCase, functions are camelCase
        return True  # Simplified
        
    def _has_circular_imports(self) -> bool:
        # Would need full dependency graph - simplified
        return False
        
    def _mixes_concerns(self) -> bool:
        # Check if file has both UI and business logic
        has_jsx = '<' in self.content and '>' in self.content
        has_db = any(keyword in self.content for keyword in ['SELECT', 'INSERT', 'UPDATE', 'supabase'])
        return has_jsx and has_db
        
    def _has_input_validation(self) -> bool:
        return any(keyword in self.content for keyword in ['validate', 'sanitize', 'z.', 'yup.'])
        
    def _uses_prepared_statements(self) -> bool:
        # Check for parameterized queries
        return '$' in self.content or '?' in self.content
        
    def _has_authentication_checks(self) -> bool:
        return any(keyword in self.content for keyword in ['auth', 'session', 'user_id'])
        
    def _has_console_logs(self) -> bool:
        return 'console.log' in self.content
        
    def _has_commented_code(self) -> bool:
        # Check for large blocks of commented code
        comment_blocks = re.findall(r'\/\*[\s\S]*?\*\/', self.content)
        return any(len(block) > 100 for block in comment_blocks)


class PipelineComplianceDetector:
    """Detects if PR description contains enforcement pipeline section"""
    
    REQUIRED_SECTIONS = [
        'Step 1: Search & Discovery',
        'Step 2: Pattern Analysis',
        'Step 3: Compliance Check',
        'Step 4: Implementation Plan',
        'Step 5: Post-Implementation Audit'
    ]
    
    REQUIRED_CHECKS = [
        'RLS/tenant isolation',
        'Architecture boundaries',
        'No hardcoded values',
        'Structured logging + traceId',
        'Error resilience'
    ]
    
    @staticmethod
    def detect(pr_description: str) -> Tuple[bool, float, List[str]]:
        """
        Returns (is_complete, bonus_points, missing_sections)
        
        Args:
            pr_description: PR description text
            
        Returns:
            Tuple of (is_complete, bonus_points, missing_sections)
        """
        missing = []
        trace_ctx = get_or_create_trace_context()
        
        # Check for required sections
        for section in PipelineComplianceDetector.REQUIRED_SECTIONS:
            if section not in pr_description:
                missing.append(section)
                
        # Check for required compliance checks
        for check in PipelineComplianceDetector.REQUIRED_CHECKS:
            if check not in pr_description:
                missing.append(check)
                
        # Check for "Pass" markers
        pass_count = pr_description.count('Pass')
        fail_count = pr_description.count('Fail')
        
        if fail_count > 0:
            missing.append(f"{fail_count} checks marked as 'Fail'")
            
        # Determine if complete
        is_complete = len(missing) == 0 and pass_count >= len(PipelineComplianceDetector.REQUIRED_CHECKS)
        
        # Calculate bonus
        bonus = ScoringWeights.PIPELINE_BONUS if is_complete else 0.0
        
        logger.debug(
            "Pipeline compliance checked",
            operation="detect",
            is_complete=is_complete,
            bonus=bonus,
            missing_count=len(missing),
            **trace_ctx
        )
        
        return is_complete, bonus, missing


class HybridScoringEngine:
    """Main scoring engine combining file analysis with violation detection"""
    
    def __init__(self, supabase):
        """
        Initialize scoring engine.
        
        Args:
            supabase: Supabase client instance
        """
        self.supabase = supabase
        logger.info(
            "Scoring engine initialized",
            operation="__init__",
            **get_or_create_trace_context()
        )
        
    def score_pr(
        self,
        pr_number: int,
        repository: str,
        author: str,
        changed_files: List[Dict],  # {'path': str, 'content': str}
        pr_description: str,
        session_id: Optional[str] = None,
        violations: List[ViolationResult] = None
    ) -> ScoreResult:
        """
        Score a PR using hybrid approach.
        
        Args:
            pr_number: PR number
            repository: Repository name (e.g., 'owner/repo')
            author: PR author username
            changed_files: List of dicts with 'path' and 'content' keys
            pr_description: PR description text
            session_id: Optional session ID
            violations: Optional pre-computed violations (from detection functions)
            
        Returns:
            ScoreResult object with complete scoring breakdown
        """
        start_time = datetime.now()
        trace_ctx = get_or_create_trace_context()
        
        logger.info(
            "Starting PR scoring",
            operation="score_pr",
            pr_number=pr_number,
            repository=repository,
            author=author,
            files_count=len(changed_files),
            **trace_ctx
        )
        
        # Initialize violations list
        if violations is None:
            violations = []
            
        # Analyze each file
        file_scores = {
            'code_quality': [],
            'test_coverage': [],
            'documentation': [],
            'architecture': [],
            'security': []
        }
        
        for file_data in changed_files:
            analyzer = FileAnalyzer(file_data['path'], file_data['content'])
            file_scores['code_quality'].append(analyzer.analyze_code_quality())
            file_scores['test_coverage'].append(analyzer.analyze_test_coverage())
            file_scores['documentation'].append(analyzer.analyze_documentation())
            file_scores['architecture'].append(analyzer.analyze_architecture())
            file_scores['security'].append(analyzer.analyze_security())
            
        # Average file scores
        avg_scores = {
            category: sum(scores) / len(scores) if scores else 0
            for category, scores in file_scores.items()
        }
        
        # Calculate rule compliance score
        rule_compliance_score = self._calculate_rule_compliance(violations)
        
        # Create category scores
        code_quality = CategoryScore(avg_scores['code_quality'], ScoringWeights.CODE_QUALITY)
        test_coverage = CategoryScore(avg_scores['test_coverage'], ScoringWeights.TEST_COVERAGE)
        documentation = CategoryScore(avg_scores['documentation'], ScoringWeights.DOCUMENTATION)
        architecture = CategoryScore(avg_scores['architecture'], ScoringWeights.ARCHITECTURE)
        security = CategoryScore(avg_scores['security'], ScoringWeights.SECURITY)
        rule_compliance = CategoryScore(rule_compliance_score, ScoringWeights.RULE_COMPLIANCE)
        
        # Check pipeline compliance
        pipeline_complete, pipeline_bonus, missing = PipelineComplianceDetector.detect(pr_description)
        
        # Calculate raw score
        raw_score = (
            code_quality.weighted_score +
            test_coverage.weighted_score +
            documentation.weighted_score +
            architecture.weighted_score +
            security.weighted_score +
            rule_compliance.weighted_score +
            pipeline_bonus
        )
        
        # Apply stabilization
        stabilized_score = StabilizationFunction.stabilize(raw_score)
        
        # Determine decision
        decision, reason = self._determine_decision(
            stabilized_score,
            violations,
            pipeline_complete
        )
        
        # Separate violations by severity
        critical_violations = [v for v in violations if v.severity in ('critical', 'high')]
        warnings_list = [v for v in violations if v.severity in ('medium', 'low', 'info')]
        
        # Calculate scan duration
        scan_duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)
        
        # Create result
        result = ScoreResult(
            pr_number=pr_number,
            repository=repository,
            session_id=session_id,
            author=author,
            code_quality=code_quality,
            test_coverage=test_coverage,
            documentation=documentation,
            architecture=architecture,
            security=security,
            rule_compliance=rule_compliance,
            pipeline_complete=pipeline_complete,
            pipeline_bonus=pipeline_bonus,
            raw_score=round(raw_score, 2),
            stabilized_score=stabilized_score,
            decision=decision,
            decision_reason=reason,
            violations=critical_violations,
            warnings=warnings_list,
            scan_duration_ms=scan_duration_ms
        )
        
        logger.info(
            "PR scoring completed",
            operation="score_pr",
            pr_number=pr_number,
            raw_score=raw_score,
            stabilized_score=stabilized_score,
            decision=decision,
            violations=len(critical_violations),
            warnings=len(warnings_list),
            scan_duration_ms=scan_duration_ms,
            **trace_ctx
        )
        
        return result
        
    def _calculate_rule_compliance(self, violations: List[ViolationResult]) -> float:
        """
        Calculate rule compliance score (can go very negative).
        
        Args:
            violations: List of detected violations
            
        Returns:
            Rule compliance score (starts at 10, decreases with violations)
        """
        score = 10.0  # Start at perfect
        
        for violation in violations:
            # Use the penalty directly from the violation (already calculated by detector)
            # Penalties are already in the correct range (-100 for RLS, -75 for architecture, etc.)
            # We need to normalize them to the -10 to +10 category range, but allow going negative
            penalty = violation.penalty
            
            # Apply penalty directly (penalties are already negative)
            # For category score, we want to allow it to go negative
            # A -100 penalty should significantly reduce the score
            if violation.severity == 'critical':
                score += penalty / 10.0  # Critical: -100 becomes -10, so score goes from 10 to 0
            elif violation.severity == 'high':
                score += penalty / 20.0  # High: -100 becomes -5, so score goes from 10 to 5
            else:
                score += penalty / 30.0  # Medium/low: reduced impact
        
        # Cap at -100 minimum (very negative for severe violations)
        # This allows the category score to go very negative, which when weighted will make raw_score negative
        return max(-100, min(10, score))
        
    def _determine_decision(
        self,
        stabilized_score: float,
        violations: List[ViolationResult],
        pipeline_complete: bool
    ) -> Tuple[str, str]:
        """
        Determine PR decision based on score and violations.
        
        Args:
            stabilized_score: Stabilized score (0-10)
            violations: List of violations
            pipeline_complete: Whether enforcement pipeline is complete
            
        Returns:
            Tuple of (decision, reason)
        """
        # Check for critical violations (auto-block)
        critical_violations = [v for v in violations if v.severity == 'critical']
        if critical_violations:
            return (
                'auto_block',
                f"Critical violations detected: {len(critical_violations)} critical issue(s)"
            )
        
        # Check score thresholds
        if stabilized_score < ScoringWeights.AUTO_BLOCK_THRESHOLD:
            return (
                'auto_block',
                f"Score {stabilized_score:.2f} is below auto-block threshold ({ScoringWeights.AUTO_BLOCK_THRESHOLD})"
            )
        elif stabilized_score < ScoringWeights.REVIEW_REQUIRED_THRESHOLD:
            return (
                'review_required',
                f"Score {stabilized_score:.2f} requires manual review (threshold: {ScoringWeights.REVIEW_REQUIRED_THRESHOLD})"
            )
        elif pipeline_complete:
            return (
                'auto_approve',
                f"Score {stabilized_score:.2f} meets auto-approve threshold with complete pipeline"
            )
        else:
            return (
                'review_required',
                f"Score {stabilized_score:.2f} meets threshold but pipeline incomplete"
            )
    
    def persist_score(self, result: ScoreResult) -> bool:
        """
        Persist scoring result to Supabase.
        
        Args:
            result: ScoreResult to persist
            
        Returns:
            True if successful, False otherwise
        """
        trace_ctx = get_or_create_trace_context()
        
        try:
            score_data = result.to_dict()
            
            # Prepare data for Supabase (matching schema)
            insert_data = {
                'pr_number': result.pr_number,
                'repository': result.repository,
                'session_id': result.session_id,
                'author': result.author,
                'code_quality': float(result.code_quality.raw_score),
                'test_coverage': float(result.test_coverage.raw_score),
                'documentation': float(result.documentation.raw_score),
                'architecture': float(result.architecture.raw_score),
                'security': float(result.security.raw_score),
                'rule_compliance': float(result.rule_compliance.raw_score),
                'code_quality_weighted': float(result.code_quality.weighted_score),
                'test_coverage_weighted': float(result.test_coverage.weighted_score),
                'documentation_weighted': float(result.documentation.weighted_score),
                'architecture_weighted': float(result.architecture.weighted_score),
                'security_weighted': float(result.security.weighted_score),
                'rule_compliance_weighted': float(result.rule_compliance.weighted_score),
                'raw_score': float(result.raw_score),
                'stabilized_score': float(result.stabilized_score),
                'violations': score_data['violations'],
                'warnings': score_data['warnings'],
                'pipeline_complete': result.pipeline_complete,
                'pipeline_bonus': float(result.pipeline_bonus),
                'decision': result.decision,
                'decision_reason': result.decision_reason,
                'scan_duration_ms': result.scan_duration_ms,
                'detector_versions': {}  # TODO: Add detector version tracking
            }
            
            # Insert into Supabase (using veroscore schema)
            response = self.supabase.schema('veroscore').table('pr_scores').insert(insert_data).execute()
            
            logger.info(
                "Score persisted to Supabase",
                operation="persist_score",
                pr_number=result.pr_number,
                stabilized_score=result.stabilized_score,
                decision=result.decision,
                **trace_ctx
            )
            
            return True
            
        except Exception as e:
            logger.error(
                "Failed to persist score",
                operation="persist_score",
                pr_number=result.pr_number,
                root_cause=str(e),
                **trace_ctx
            )
            return False

