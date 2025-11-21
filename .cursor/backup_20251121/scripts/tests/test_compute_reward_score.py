#!/usr/bin/env python3
"""
Test suite for compute_reward_score.py

Tests scoring logic, edge cases, and integration scenarios.
"""

import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch, mock_open

# Add parent directory to path to import compute_reward_score
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import compute_reward_score


class TestCoverageParsing(unittest.TestCase):
    """Test coverage parsing functions."""
    
    def test_parse_frontend_coverage_empty(self):
        """Test parsing empty frontend coverage."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            json.dump({}, f)
            temp_path = f.name
        
        try:
            result = compute_reward_score.parse_frontend_coverage(temp_path)
            self.assertEqual(result["total"], 0)
            self.assertEqual(result["covered"], 0)
            self.assertEqual(result["percentage"], 0)
        finally:
            Path(temp_path).unlink()
    
    def test_parse_frontend_coverage_with_data(self):
        """Test parsing frontend coverage with data."""
        coverage_data = {
            "file1.ts": {
                "s": {
                    "1": 1,
                    "2": 0,
                    "3": 1
                }
            },
            "file2.ts": {
                "s": {
                    "4": 1,
                    "5": 1
                }
            }
        }
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            json.dump(coverage_data, f)
            temp_path = f.name
        
        try:
            result = compute_reward_score.parse_frontend_coverage(temp_path)
            self.assertEqual(result["total"], 5)
            self.assertEqual(result["covered"], 4)
            self.assertAlmostEqual(result["percentage"], 80.0, places=1)
        finally:
            Path(temp_path).unlink()
    
    def test_parse_backend_coverage_empty(self):
        """Test parsing empty backend coverage."""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            json.dump({}, f)
            temp_path = f.name
        
        try:
            result = compute_reward_score.parse_backend_coverage(temp_path)
            self.assertEqual(result["total"], 0)
            self.assertEqual(result["covered"], 0)
            self.assertEqual(result["percentage"], 0)
        finally:
            Path(temp_path).unlink()
    
    def test_parse_backend_coverage_with_data(self):
        """Test parsing backend coverage with data."""
        coverage_data = {
            "totals": {
                "num_statements": 100,
                "covered_lines": 75,
                "percent_covered": 75.0
            }
        }
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
            json.dump(coverage_data, f)
            temp_path = f.name
        
        try:
            result = compute_reward_score.parse_backend_coverage(temp_path)
            self.assertEqual(result["total"], 100)
            self.assertEqual(result["covered"], 75)
            self.assertEqual(result["percentage"], 75.0)
        finally:
            Path(temp_path).unlink()


class TestTestFileDetection(unittest.TestCase):
    """Test new test file detection."""
    
    def test_detect_new_test_files_empty_diff(self):
        """Test detection with empty diff."""
        result = compute_reward_score.detect_new_test_files("")
        self.assertEqual(result, 0)
    
    def test_detect_new_test_files_with_test_files(self):
        """Test detection with test files in diff."""
        diff = """
+++ b/frontend/src/components/Button.test.tsx
--- a/frontend/src/components/Button.tsx
+++ b/backend/tests/test_auth.py
+++ b/frontend/src/utils/helper.spec.ts
"""
        result = compute_reward_score.detect_new_test_files(diff)
        self.assertEqual(result, 3)
    
    def test_detect_new_test_files_no_test_files(self):
        """Test detection with no test files."""
        diff = """
+++ b/frontend/src/components/Button.tsx
--- a/frontend/src/components/Button.tsx
+++ b/backend/src/auth.py
"""
        result = compute_reward_score.detect_new_test_files(diff)
        self.assertEqual(result, 0)


class TestTestScoring(unittest.TestCase):
    """Test test scoring logic."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.rubric = {"tests": 3}
    
    def test_score_tests_high_coverage(self):
        """Test scoring with high coverage."""
        coverage = {
            "frontend": {"percentage": 85},
            "backend": {"percentage": 0}
        }
        diff = ""
        score, note = compute_reward_score.score_tests(coverage, self.rubric, diff)
        self.assertGreaterEqual(score, 1)  # At least tests passing
        self.assertIn("Tests passing", note)
    
    def test_score_tests_with_new_test_files(self):
        """Test scoring with new test files."""
        coverage = {
            "frontend": {"percentage": 50},
            "backend": {"percentage": 0}
        }
        diff = "+++ b/frontend/src/components/Button.test.tsx"
        score, note = compute_reward_score.score_tests(coverage, self.rubric, diff)
        self.assertGreater(score, 0)
        self.assertIn("New test files", note)
    
    def test_score_tests_no_coverage(self):
        """Test scoring with no coverage."""
        coverage = {
            "frontend": {"percentage": 0},
            "backend": {"percentage": 0}
        }
        diff = ""
        score, note = compute_reward_score.score_tests(coverage, self.rubric, diff)
        self.assertEqual(score, 0)
        self.assertIn("No test coverage", note)


class TestBugFixDetection(unittest.TestCase):
    """Test bug fix detection logic."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.rubric = {"bug_fix": 2}
    
    @patch('compute_reward_score.load_text_file')
    def test_detect_bug_fix_complete(self, mock_load):
        """Test complete bug fix detection."""
        pr_desc = "Fixes bug in authentication"
        diff = "+++ b/backend/tests/test_auth.py"
        mock_load.return_value = "bug fix authentication error"
        
        score, note = compute_reward_score.detect_bug_fix(pr_desc, diff, self.rubric)
        self.assertGreater(score, 0)
        self.assertIn("bug", note.lower())
    
    def test_detect_bug_fix_not_bug_fix(self):
        """Test detection when not a bug fix."""
        pr_desc = "Add new feature"
        diff = ""
        score, note = compute_reward_score.detect_bug_fix(pr_desc, diff, self.rubric)
        self.assertEqual(score, 0)
        self.assertIn("Not a bug fix", note)


class TestDocumentationScoring(unittest.TestCase):
    """Test documentation scoring logic."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.rubric = {"docs": 1}
    
    def test_score_documentation_with_changes(self):
        """Test scoring with documentation changes."""
        diff = "+++ b/docs/README.md\n--- a/docs/README.md"
        score, note = compute_reward_score.score_documentation(diff, self.rubric)
        self.assertGreaterEqual(score, 0)
        self.assertIn("Documentation", note)
    
    def test_score_documentation_no_changes(self):
        """Test scoring with no documentation changes."""
        diff = "+++ b/frontend/src/components/Button.tsx"
        score, note = compute_reward_score.score_documentation(diff, self.rubric)
        self.assertEqual(score, 0)
        self.assertIn("No documentation changes", note)


class TestPerformanceScoring(unittest.TestCase):
    """Test performance scoring logic."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.rubric = {"performance": 1}
    
    def test_score_performance_with_keywords(self):
        """Test scoring with performance keywords."""
        diff = "optimize performance cache speed latency"
        score, note = compute_reward_score.score_performance(diff, self.rubric)
        self.assertGreater(score, 0)
        self.assertIn("Performance", note)
    
    def test_score_performance_no_keywords(self):
        """Test scoring with no performance keywords."""
        diff = "+++ b/frontend/src/components/Button.tsx"
        score, note = compute_reward_score.score_performance(diff, self.rubric)
        self.assertEqual(score, 0)
        self.assertIn("No performance improvements", note)
    
    def test_score_performance_empty_diff(self):
        """Test scoring with empty diff."""
        score, note = compute_reward_score.score_performance("", self.rubric)
        self.assertEqual(score, 0)
        self.assertIn("No diff available", note)


class TestSecurityScoring(unittest.TestCase):
    """Test security scoring logic."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.rubric = {"security": 2}
    
    def test_score_security_no_issues(self):
        """Test scoring with no security issues."""
        static_analysis = {"results": []}
        score, note = compute_reward_score.score_security(static_analysis, self.rubric)
        self.assertEqual(score, 2)
        self.assertIn("No security issues", note)
    
    def test_score_security_critical_issues(self):
        """Test scoring with critical security issues."""
        static_analysis = {
            "results": [
                {"extra": {"severity": "ERROR"}},
                {"extra": {"severity": "WARNING"}}
            ]
        }
        score, note = compute_reward_score.score_security(static_analysis, self.rubric)
        self.assertEqual(score, -3)
        self.assertIn("Critical security issues", note)
    
    def test_score_security_empty_analysis(self):
        """Test scoring with empty static analysis."""
        static_analysis = {}
        score, note = compute_reward_score.score_security(static_analysis, self.rubric)
        self.assertEqual(score, 0)
        self.assertIn("No static analysis data", note)


class TestPenalties(unittest.TestCase):
    """Test penalty calculation."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.rubric = {
            "penalties": {
                "failing_ci": -4,
                "missing_tests": -2,
                "regression": -3
            }
        }
    
    def test_calculate_penalties_no_coverage(self):
        """Test penalties with no coverage."""
        coverage = {
            "frontend": {"percentage": 0},
            "backend": {"percentage": 0}
        }
        static_analysis = {}
        penalty, note = compute_reward_score.calculate_penalties(
            coverage, static_analysis, self.rubric
        )
        self.assertLess(penalty, 0)
        self.assertIn("No test coverage", note)
    
    def test_calculate_penalties_low_coverage(self):
        """Test penalties with low coverage."""
        coverage = {
            "frontend": {"percentage": 15},
            "backend": {"percentage": 10}
        }
        static_analysis = {}
        penalty, note = compute_reward_score.calculate_penalties(
            coverage, static_analysis, self.rubric
        )
        self.assertLess(penalty, 0)
        self.assertIn("Low test coverage", note)
    
    def test_calculate_penalties_good_coverage(self):
        """Test penalties with good coverage."""
        coverage = {
            "frontend": {"percentage": 80},
            "backend": {"percentage": 75}
        }
        static_analysis = {}
        penalty, note = compute_reward_score.calculate_penalties(
            coverage, static_analysis, self.rubric
        )
        self.assertEqual(penalty, 0)
        self.assertIn("No penalties", note)


class TestDecisionRecommendation(unittest.TestCase):
    """Test decision recommendation logic."""
    
    def test_decision_block_low_score(self):
        """Test BLOCK decision for low score."""
        score = -5
        breakdown = {}
        static_analysis = {}
        decision, reason = compute_reward_score.get_decision_recommendation(
            score, breakdown, static_analysis
        )
        self.assertEqual(decision, "BLOCK")
        self.assertIn("below -3", reason)
    
    def test_decision_request_changes_medium_score(self):
        """Test REQUEST_CHANGES decision for medium score."""
        score = 2
        breakdown = {}
        static_analysis = {}
        decision, reason = compute_reward_score.get_decision_recommendation(
            score, breakdown, static_analysis
        )
        self.assertEqual(decision, "REQUEST_CHANGES")
        self.assertIn("requires improvement", reason)
    
    def test_decision_approve_high_score(self):
        """Test APPROVE decision for high score."""
        score = 7
        breakdown = {}
        static_analysis = {}
        decision, reason = compute_reward_score.get_decision_recommendation(
            score, breakdown, static_analysis
        )
        self.assertEqual(decision, "APPROVE")
        self.assertIn("meets quality standards", reason)
    
    def test_decision_block_critical_security(self):
        """Test BLOCK decision with critical security issues."""
        score = -2
        breakdown = {}
        static_analysis = {
            "results": [{"extra": {"severity": "ERROR"}}]
        }
        decision, reason = compute_reward_score.get_decision_recommendation(
            score, breakdown, static_analysis
        )
        self.assertEqual(decision, "BLOCK")
        self.assertIn("critical issues", reason)


class TestComputeScoreIntegration(unittest.TestCase):
    """Integration tests for compute_score function."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.rubric = {
            "tests": 3,
            "bug_fix": 2,
            "docs": 1,
            "performance": 1,
            "security": 2,
            "penalties": {
                "failing_ci": -4,
                "missing_tests": -2,
                "regression": -3
            }
        }
    
    def test_compute_score_complete_scenario(self):
        """Test complete scoring scenario."""
        coverage = {
            "frontend": {"percentage": 80},
            "backend": {"percentage": 75}
        }
        static_analysis = {"results": []}
        pr_desc = "Add new feature with tests"
        diff = """
+++ b/frontend/src/components/Button.test.tsx
+++ b/docs/README.md
"""
        
        score, breakdown, notes = compute_reward_score.compute_score(
            coverage, static_analysis, pr_desc, diff, self.rubric
        )
        
        self.assertIsInstance(score, int)
        self.assertIsInstance(breakdown, dict)
        self.assertIsInstance(notes, str)
        self.assertIn("tests", breakdown)
        self.assertIn("docs", breakdown)
    
    def test_compute_score_with_penalties(self):
        """Test scoring with penalties applied."""
        coverage = {
            "frontend": {"percentage": 0},
            "backend": {"percentage": 0}
        }
        static_analysis = {"results": []}
        pr_desc = "Update code"
        diff = ""
        
        score, breakdown, notes = compute_reward_score.compute_score(
            coverage, static_analysis, pr_desc, diff, self.rubric
        )
        
        self.assertLess(score, 0)
        self.assertLess(breakdown["penalties"], 0)
    
    def test_compute_score_security_blocker(self):
        """Test scoring with security blocker."""
        coverage = {
            "frontend": {"percentage": 80},
            "backend": {"percentage": 75}
        }
        static_analysis = {
            "results": [{"extra": {"severity": "ERROR"}}]
        }
        pr_desc = "Update code"
        diff = ""
        
        score, breakdown, notes = compute_reward_score.compute_score(
            coverage, static_analysis, pr_desc, diff, self.rubric
        )
        
        # Score should be capped at -3
        self.assertLessEqual(score, -3)
        self.assertIn("Security blocker", notes)


class TestCommentGeneration(unittest.TestCase):
    """Test comment generation."""
    
    def test_generate_comment_with_template(self):
        """Test comment generation with template."""
        score = 5
        breakdown = {
            "tests": 3,
            "bug_fix": 0,
            "docs": 1,
            "performance": 0,
            "security": 2,
            "penalties": -1
        }
        notes = "Test note"
        
        # Create temporary template file
        template_content = """
REWARD_SCORE: {{score}}/10
Breakdown:
- tests: {{tests}}
- docs: {{docs}}
"""
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.md', delete=False) as f:
            f.write(template_content)
            temp_path = Path(f.name)
        
        try:
            comment = compute_reward_score.generate_comment(
                score, breakdown, notes, temp_path
            )
            self.assertIn("5", comment)
            self.assertIn("tests: 3", comment)
        finally:
            temp_path.unlink()
    
    def test_generate_comment_fallback(self):
        """Test comment generation fallback."""
        score = 5
        breakdown = {
            "tests": 3,
            "bug_fix": 0,
            "docs": 1,
            "performance": 0,
            "security": 2,
            "penalties": -1
        }
        notes = "Test note"
        
        comment = compute_reward_score.generate_comment(
            score, breakdown, notes, None
        )
        self.assertIn("REWARD_SCORE", comment)
        self.assertIn("5", comment)
        self.assertIn("Decision Recommendation", comment)


if __name__ == '__main__':
    unittest.main()

