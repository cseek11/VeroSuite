#!/usr/bin/env python3
"""
Test script for security scoring functionality.

Tests various Semgrep result scenarios to verify security filtering works correctly.
"""

import json
import sys
from pathlib import Path

# Add parent directory to path to import compute_reward_score
sys.path.insert(0, str(Path(__file__).parent))
from compute_reward_score import score_security, is_security_rule

def make_result(check_id, path, severity="ERROR", tags=None, confidence=None, line=1, category=None):
    """Helper to create a Semgrep result dict."""
    result = {
        "check_id": check_id,
        "path": path,
        "extra": {
            "severity": severity,
            "metadata": {
                "tags": tags or [],
                "confidence": confidence
            },
            "start": {"line": line}
        },
        "start": {"path": path, "line": line},
        "message": ""
    }
    if category:
        result["extra"]["metadata"]["category"] = category
    return result


def test_non_security_does_not_affect_score():
    """Test that non-security Semgrep findings don't affect security score."""
    print("Test 1: Non-security ERROR should not affect score...")
    data = {
        "results": [
            make_result("perf.rule.1", "src/foo.js", severity="ERROR", tags=["perf"], confidence="high")
        ]
    }
    rubric = {"security": 2}
    score, notes = score_security(data, rubric)
    assert score == 2, f"Expected score 2, got {score}"
    assert "security-filtered: 0" in notes, "Should show 0 security-filtered results"
    print("[PASS] Non-security issues don't affect score")


def test_security_error_scores_minus_three():
    """Test that actual security issues score -3."""
    print("\nTest 2: Security ERROR should score -3...")
    data = {
        "results": [
            make_result("security.injection", "src/foo.js", severity="ERROR", tags=["security"], confidence="high", category="security")
        ]
    }
    rubric = {"security": 2}
    score, notes = score_security(data, rubric)
    assert score == -3, f"Expected score -3, got {score}"
    assert "Critical security issues" in notes, "Should indicate critical security issues"
    print("[PASS] Security issues correctly score -3")


def test_security_warning_scores_minus_one():
    """Test that security warnings score -1."""
    print("\nTest 3: Security WARNING should score -1...")
    data = {
        "results": [
            make_result("security.secrets", "src/foo.js", severity="WARNING", tags=["security", "secrets"], confidence="high")
        ]
    }
    rubric = {"security": 2}
    score, notes = score_security(data, rubric)
    assert score == -1, f"Expected score -1, got {score}"
    assert "High severity security issues" in notes, "Should indicate high severity issues"
    print("[PASS] Security warnings correctly score -1")


def test_mixed_results():
    """Test that only security results are counted."""
    print("\nTest 4: Mixed security and non-security results...")
    data = {
        "results": [
            make_result("perf.rule.1", "src/foo.js", severity="ERROR", tags=["perf"]),
            make_result("security.injection", "src/bar.js", severity="ERROR", tags=["security"], category="security"),
            make_result("correctness.bug", "src/baz.js", severity="WARNING", tags=["correctness"]),
            make_result("security.secrets", "src/qux.js", severity="WARNING", tags=["security", "secrets"])
        ]
    }
    rubric = {"security": 2}
    score, notes = score_security(data, rubric)
    assert score == -3, f"Expected score -3 (critical security), got {score}"
    assert "Total semgrep results: 4" in notes, "Should show total of 4 results"
    assert "security-filtered: 2" in notes, "Should filter to 2 security results"
    print("[PASS] Only security results are counted")


def test_empty_results():
    """Test that empty results return positive score."""
    print("\nTest 5: Empty results should return positive score...")
    data = {"results": []}
    rubric = {"security": 2}
    score, notes = score_security(data, rubric)
    assert score == 2, f"Expected score 2, got {score}"
    assert "No high/critical security issues detected" in notes, "Should indicate no issues"
    print("[PASS] Empty results return positive score")


def test_no_static_analysis():
    """Test that missing static analysis returns 0."""
    print("\nTest 6: Missing static analysis should return 0...")
    rubric = {"security": 2}
    score, notes = score_security(None, rubric)
    assert score == 0, f"Expected score 0, got {score}"
    assert "No static analysis data" in notes, "Should indicate no data"
    print("[PASS] Missing static analysis returns 0")


def test_tenant_sensitive_escalation():
    """Test that tenant-sensitive paths escalate high severity issues."""
    print("\nTest 7: Tenant-sensitive paths escalate high severity...")
    data = {
        "results": [
            make_result("security.secrets", "backend/src/auth/service.ts", severity="WARNING", tags=["security"])
        ]
    }
    rubric = {"security": 2}
    changed_files = ["backend/src/auth/service.ts"]
    score, notes = score_security(data, rubric, changed_files=changed_files)
    assert score == -2, f"Expected score -2 (escalated), got {score}"
    assert "Escalated due to changes in tenant-sensitive paths" in notes, "Should indicate escalation"
    print("[PASS] Tenant-sensitive paths escalate severity")


def test_is_security_rule_detection():
    """Test is_security_rule helper function."""
    print("\nTest 8: is_security_rule detection...")
    
    # Security rule by tag
    result1 = make_result("some.rule", "file.js", tags=["security"])
    assert is_security_rule(result1), "Should detect security rule by tag"
    
    # Security rule by check_id pattern
    result2 = make_result("security.injection", "file.js")
    assert is_security_rule(result2), "Should detect security rule by check_id"
    
    # Security rule by category
    result3 = make_result("some.rule", "file.js", category="security")
    assert is_security_rule(result3), "Should detect security rule by category"
    
    # Non-security rule
    result4 = make_result("perf.rule", "file.js", tags=["performance"])
    assert not is_security_rule(result4), "Should not detect non-security rule"
    
    print("[PASS] is_security_rule correctly identifies security rules")


if __name__ == "__main__":
    print("=" * 60)
    print("Security Scoring Test Suite")
    print("=" * 60)
    
    try:
        test_non_security_does_not_affect_score()
        test_security_error_scores_minus_three()
        test_security_warning_scores_minus_one()
        test_mixed_results()
        test_empty_results()
        test_no_static_analysis()
        test_tenant_sensitive_escalation()
        test_is_security_rule_detection()
        
        print("\n" + "=" * 60)
        print("[PASS] ALL TESTS PASSED")
        print("=" * 60)
        sys.exit(0)
    except AssertionError as e:
        print(f"\n[FAIL] TEST FAILED: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] UNEXPECTED ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

