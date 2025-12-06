#!/usr/bin/env python3
"""
Unit tests for Hybrid Scoring Engine v2.1

Tests all components:
- CategoryScore
- StabilizationFunction
- FileAnalyzer
- PipelineComplianceDetector
- HybridScoringEngine
"""

import unittest
import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

# Add scripts directory to path
scripts_dir = Path(__file__).parent.parent.parent
if str(scripts_dir) not in sys.path:
    sys.path.insert(0, str(scripts_dir))

from veroscore_v3.scoring_engine import (
    CategoryScore,
    ScoreResult,
    ScoringWeights,
    StabilizationFunction,
    FileAnalyzer,
    PipelineComplianceDetector,
    HybridScoringEngine
)
from veroscore_v3.detection_functions import ViolationResult


class TestCategoryScore(unittest.TestCase):
    """Test CategoryScore dataclass"""
    
    def test_weighted_score_calculation(self):
        """Test that weighted score is calculated correctly"""
        score = CategoryScore(raw_score=5.0, weight=3.0)
        self.assertEqual(score.weighted_score, 15.0)
        
    def test_negative_score(self):
        """Test negative scores"""
        score = CategoryScore(raw_score=-5.0, weight=3.0)
        self.assertEqual(score.weighted_score, -15.0)


class TestStabilizationFunction(unittest.TestCase):
    """Test StabilizationFunction"""
    
    def test_positive_score(self):
        """Test stabilization of positive score"""
        result = StabilizationFunction.stabilize(50.0)
        self.assertGreater(result, 5.0)
        self.assertLessEqual(result, 10.0)
        
    def test_negative_score(self):
        """Test stabilization of negative score"""
        result = StabilizationFunction.stabilize(-50.0)
        self.assertLess(result, 5.0)
        self.assertGreaterEqual(result, 0.0)
        
    def test_zero_score(self):
        """Test stabilization of zero score"""
        result = StabilizationFunction.stabilize(0.0)
        self.assertAlmostEqual(result, 5.0, places=1)  # Should be around 5.0
        
    def test_extreme_positive(self):
        """Test extreme positive score"""
        result = StabilizationFunction.stabilize(1000.0)
        self.assertAlmostEqual(result, 10.0, places=1)
        
    def test_extreme_negative(self):
        """Test extreme negative score"""
        result = StabilizationFunction.stabilize(-1000.0)
        self.assertAlmostEqual(result, 0.0, places=1)


class TestFileAnalyzer(unittest.TestCase):
    """Test FileAnalyzer"""
    
    def test_code_quality_with_types(self):
        """Test code quality analysis with type annotations"""
        content = """
def process_data(data: List[str]) -> Dict[str, int]:
    result = {}
    for item in data:
        result[item] = len(item)
    return result
"""
        analyzer = FileAnalyzer("test.py", content)
        score = analyzer.analyze_code_quality()
        self.assertGreater(score, 0)
        
    def test_test_coverage_detection(self):
        """Test test coverage detection"""
        content = """
def test_user_creation():
    assert create_user("test@example.com") is not None
"""
        analyzer = FileAnalyzer("test_user.py", content)
        score = analyzer.analyze_test_coverage()
        self.assertGreater(score, 0)
        
    def test_documentation_analysis(self):
        """Test documentation analysis"""
        content = '''
def process_data(data):
    """
    Process data and return results.
    """
    return data
'''
        analyzer = FileAnalyzer("test.py", content)
        score = analyzer.analyze_documentation()
        self.assertGreater(score, 0)
        
    def test_security_analysis(self):
        """Test security analysis"""
        content = """
def validate_input(data: str) -> bool:
    if not data:
        return False
    return True
"""
        analyzer = FileAnalyzer("test.py", content)
        score = analyzer.analyze_security()
        self.assertGreater(score, 0)


class TestPipelineComplianceDetector(unittest.TestCase):
    """Test PipelineComplianceDetector"""
    
    def test_complete_pipeline(self):
        """Test detection of complete pipeline"""
        pr_desc = """
Step 1: Search & Discovery
Step 2: Pattern Analysis
Step 3: Compliance Check
Step 4: Implementation Plan
Step 5: Post-Implementation Audit

Compliance checks:
- RLS/tenant isolation: Pass
- Architecture boundaries: Pass
- No hardcoded values: Pass
- Structured logging + traceId: Pass
- Error resilience: Pass
"""
        is_complete, bonus, missing = PipelineComplianceDetector.detect(pr_desc)
        self.assertTrue(is_complete)
        self.assertEqual(bonus, ScoringWeights.PIPELINE_BONUS)
        self.assertEqual(len(missing), 0)
        
    def test_incomplete_pipeline(self):
        """Test detection of incomplete pipeline"""
        pr_desc = "This PR adds a new feature."
        is_complete, bonus, missing = PipelineComplianceDetector.detect(pr_desc)
        self.assertFalse(is_complete)
        self.assertEqual(bonus, 0.0)
        self.assertGreater(len(missing), 0)


class TestHybridScoringEngine(unittest.TestCase):
    """Test HybridScoringEngine"""
    
    def setUp(self):
        """Set up test fixtures"""
        # Mock Supabase client
        class MockSupabase:
            def schema(self, name):
                return self
            def table(self, name):
                return self
            def insert(self, data):
                class MockResponse:
                    def execute(self):
                        return self
                return MockResponse()
        
        self.supabase = MockSupabase()
        self.engine = HybridScoringEngine(self.supabase)
        
    def test_score_pr_basic(self):
        """Test basic PR scoring"""
        changed_files = [
            {'path': 'test.py', 'content': 'def test(): pass'}
        ]
        pr_desc = "Test PR"
        
        result = self.engine.score_pr(
            pr_number=1,
            repository='test/repo',
            author='testuser',
            changed_files=changed_files,
            pr_description=pr_desc
        )
        
        self.assertIsInstance(result, ScoreResult)
        self.assertEqual(result.pr_number, 1)
        self.assertGreaterEqual(result.stabilized_score, 0.0)
        self.assertLessEqual(result.stabilized_score, 10.0)
        
    def test_score_pr_with_violations(self):
        """Test PR scoring with violations"""
        changed_files = [
            {'path': 'test.ts', 'content': 'const users = await supabase.from("users").select()'}
        ]
        violations = [
            ViolationResult(
                detector_name='rls_violation_detector',
                severity='critical',
                rule_id='RLS-001',
                message='RLS violation',
                file_path='test.ts',
                line_number=1,
                penalty=-100.0
            )
        ]
        
        result = self.engine.score_pr(
            pr_number=2,
            repository='test/repo',
            author='testuser',
            changed_files=changed_files,
            pr_description='Test PR',
            violations=violations
        )
        
        # With critical violation, should auto-block regardless of stabilized score
        self.assertEqual(result.decision, 'auto_block')
        # Note: Stabilized score might still be high due to sigmoid compression,
        # but decision logic checks for critical violations first
        
    def test_decision_logic(self):
        """Test decision logic"""
        # Test auto-block (negative score)
        result1 = self.engine._determine_decision(-1.0, [], False)
        self.assertEqual(result1[0], 'auto_block')
        
        # Test review required (0-6)
        result2 = self.engine._determine_decision(3.0, [], False)
        self.assertEqual(result2[0], 'review_required')
        
        # Test auto-approve (>=6 with pipeline)
        result3 = self.engine._determine_decision(7.0, [], True)
        self.assertEqual(result3[0], 'auto_approve')
        
    def test_rule_compliance_calculation(self):
        """Test rule compliance score calculation"""
        violations = [
            ViolationResult(
                detector_name='rls_violation_detector',
                severity='critical',
                rule_id='RLS-001',
                message='RLS violation',
                penalty=-100.0
            )
        ]
        
        score = self.engine._calculate_rule_compliance(violations)
        self.assertLess(score, 10.0)  # Should be reduced from 10.0


if __name__ == '__main__':
    unittest.main()

