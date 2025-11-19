#!/usr/bin/env python3
"""
Compute REWARD_SCORE from CI artifacts.

Inputs:
  --pr <number>
  --coverage <path>
  --static <path>
  --pr-desc <path> (optional, PR description file)
  --diff <path> (optional, PR diff file)
  --out <path>

This script implements full scoring logic per `.cursor/reward_rubric.yaml`.
"""

import argparse
import json
import os
import pathlib
import re
import subprocess
import sys
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any

# Import structured logger
try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="compute_reward_score")
except ImportError:
    # Fallback if logger_util not available (should not happen)
    import logging
    logger = logging.getLogger("compute_reward_score")
    # Fallback trace context
    def get_or_create_trace_context():
        return {"traceId": None, "spanId": None, "requestId": None}

RUBRIC_PATH = pathlib.Path(__file__).resolve().parents[1] / "reward_rubric.yaml"
BUG_LOG_PATH = pathlib.Path(__file__).resolve().parents[1] / "BUG_LOG.md"
ERROR_PATTERNS_PATH = pathlib.Path(__file__).resolve().parents[0].parents[0] / "docs" / "error-patterns.md"
ENGINEERING_DECISIONS_PATH = pathlib.Path(__file__).resolve().parents[0].parents[0] / "docs" / "engineering-decisions.md"


def load_json(path: str) -> dict:
    """Load JSON file, return empty dict if file doesn't exist."""
    try:
        with open(path, "r", encoding="utf-8") as handle:
            return json.load(handle)
    except FileNotFoundError as e:
        logger.warn(
            f"Could not load JSON file: {path}",
            operation="load_json",
            error=e,
            file_path=str(path)
        )
        return {}


def load_yaml(path: str) -> dict:
    """Load YAML file using basic parsing (for reward_rubric.yaml)."""
    result = {}
    try:
        with open(path, "r", encoding="utf-8") as handle:
            content = handle.read()
            # Simple YAML parsing for our specific format
            for line in content.split("\n"):
                if ":" in line and not line.strip().startswith("#"):
                    key, value = line.split(":", 1)
                    key = key.strip()
                    value = value.strip()
                    if key in ["tests", "bug_fix", "docs", "performance", "security"]:
                        try:
                            result[key] = int(value)
                        except ValueError as e:
                            logger.debug(
                                f"Could not parse rubric value for {key}: {value}",
                                operation="load_yaml",
                                error=e,
                                key=key,
                                value=str(value)
                            )
                            pass
                    elif key in ["failing_ci", "missing_tests", "regression"]:
                        if "penalties" not in result:
                            result["penalties"] = {}
                        try:
                            result["penalties"][key] = int(value)
                        except ValueError as e:
                            logger.debug(
                                f"Could not parse rubric value for {key}: {value}",
                                operation="load_yaml",
                                error=e,
                                key=key,
                                value=str(value)
                            )
                            pass
    except FileNotFoundError as e:
        logger.warn(
            f"Could not load YAML file: {path}",
            operation="load_yaml",
            error=e,
            file_path=str(path)
        )
        pass
    return result


def load_text_file(path: pathlib.Path) -> str:
    """Load text file, return empty string if file doesn't exist."""
    try:
        with open(path, "r", encoding="utf-8") as handle:
            return handle.read()
    except FileNotFoundError as e:
        logger.warn(
            f"Could not load text file: {path}",
            operation="load_text_file",
            error=e,
            file_path=str(path)
        )
        return ""


def parse_frontend_coverage(coverage_path: str) -> Dict:
    """Parse frontend Vitest coverage JSON."""
    coverage = load_json(coverage_path)
    if not coverage:
        return {"total": 0, "covered": 0, "percentage": 0}
    
    # Vitest coverage format: coverage-final.json
    total_lines = 0
    covered_lines = 0
    
    for file_path, file_data in coverage.items():
        if isinstance(file_data, dict) and "s" in file_data:
            statements = file_data["s"]
            for line_num, count in statements.items():
                total_lines += 1
                if count > 0:
                    covered_lines += 1
    
    percentage = (covered_lines / total_lines * 100) if total_lines > 0 else 0
    return {
        "total": total_lines,
        "covered": covered_lines,
        "percentage": percentage
    }


def parse_backend_coverage(coverage_path: str) -> Dict:
    """Parse backend pytest coverage JSON."""
    coverage = load_json(coverage_path)
    if not coverage:
        return {"total": 0, "covered": 0, "percentage": 0}
    
    # Pytest coverage format
    total_lines = coverage.get("totals", {}).get("num_statements", 0)
    covered_lines = coverage.get("totals", {}).get("covered_lines", 0)
    percentage = coverage.get("totals", {}).get("percent_covered", 0)
    
    return {
        "total": total_lines,
        "covered": covered_lines,
        "percentage": percentage
    }


def parse_diff_files(diff: str) -> Dict[str, str]:
    """
    Parse diff to extract individual files and their changes.
    
    Returns:
        Dictionary mapping file paths to their diff content
    """
    files = {}
    if not diff:
        return files
    
    current_file = None
    current_diff = []
    
    for line in diff.split("\n"):
        # Check for file header (+++ or ---)
        if line.startswith("+++ b/") or line.startswith("--- a/"):
            # Save previous file if exists
            if current_file and current_diff:
                files[current_file] = "\n".join(current_diff)
            
            # Extract file path
            if line.startswith("+++ b/"):
                current_file = line[6:].strip()  # Remove "+++ b/"
            elif line.startswith("--- a/") and not current_file:
                current_file = line[6:].strip()  # Remove "--- a/"
            
            current_diff = [line]
        elif current_file:
            current_diff.append(line)
    
    # Save last file
    if current_file and current_diff:
        files[current_file] = "\n".join(current_diff)
    
    return files


def score_file(
    file_path: str,
    file_diff: str,
    coverage: dict,
    static_analysis: dict,
    pr_desc: str,
    rubric: dict
) -> Tuple[int, dict, str]:
    """
    Score a single file within a PR.
    
    Returns:
        Tuple of (score, breakdown, notes)
    """
    breakdown = {
        "tests": 0,
        "bug_fix": 0,
        "docs": 0,
        "performance": 0,
        "security": 0,
        "penalties": 0,
    }
    
    notes_list = []
    
    # Score each category for this file
    tests_score, tests_note = score_tests(coverage, rubric, file_diff)
    breakdown["tests"] = tests_score
    if tests_score > 0:
        notes_list.append(f"Tests: {tests_note}")
    
    bug_fix_score, bug_fix_note = detect_bug_fix(pr_desc, file_diff, rubric)
    breakdown["bug_fix"] = bug_fix_score
    if bug_fix_score > 0:
        notes_list.append(f"Bug Fix: {bug_fix_note}")
    
    docs_score, docs_note = score_documentation(file_diff, rubric)
    breakdown["docs"] = docs_score
    if docs_score > 0:
        notes_list.append(f"Docs: {docs_note}")
    
    performance_score, performance_note = score_performance(file_diff, rubric)
    breakdown["performance"] = performance_score
    if performance_score > 0:
        notes_list.append(f"Performance: {performance_note}")
    
    # Security is PR-level, not file-level (static analysis is PR-wide)
    # But we can check if this file has security-related changes
    security_score = 0
    security_note = "No security analysis for individual files"
    breakdown["security"] = security_score
    
    # Penalties are PR-level, not file-level
    penalties_score = 0
    penalties_note = "Penalties applied at PR level"
    breakdown["penalties"] = penalties_score
    
    # Calculate file score
    file_score = sum(breakdown.values())
    
    notes = f"File: {file_path}\n" + "\n".join(notes_list) if notes_list else f"File: {file_path} (no contributions)"
    
    return file_score, breakdown, notes


def detect_new_test_files(diff: str) -> int:
    """Detect new test files in PR diff."""
    if not diff:
        return 0
    
    # Test file patterns
    test_patterns = [
        r"^\+\+\+.*\.test\.(ts|tsx|js|jsx)",
        r"^\+\+\+.*\.spec\.(ts|tsx|js|jsx)",
        r"^\+\+\+.*__tests__.*\.(ts|tsx|js|jsx)",
        r"^\+\+\+.*test.*\.(ts|tsx|js|jsx|py)",
        r"^\+\+\+.*spec.*\.(ts|tsx|js|jsx|py)",
    ]
    
    new_test_files = set()
    for line in diff.split("\n"):
        if line.startswith("+++") or line.startswith("---"):
            for pattern in test_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    # Extract filename
                    filename = line.split("/")[-1] if "/" in line else line
                    new_test_files.add(filename)
                    break
    
    return len(new_test_files)


def calculate_coverage_increase(coverage: dict, diff: str) -> float:
    """Calculate coverage increase (simplified - would need baseline comparison)."""
    # For now, we'll check if coverage exists and is reasonable
    # In a full implementation, we'd compare against baseline from main branch
    frontend_coverage = coverage.get("frontend", {})
    backend_coverage = coverage.get("backend", {})
    frontend_percentage = frontend_coverage.get("percentage", 0)
    backend_percentage = backend_coverage.get("percentage", 0)
    
    # If we have coverage data and tests were added, assume increase
    # This is a simplified check - full implementation would compare baselines
    if (frontend_percentage > 0 or backend_percentage > 0) and detect_new_test_files(diff) > 0:
        # Estimate 5%+ increase if new tests added and coverage exists
        return 5.0
    
    return 0.0


def detect_test_types(diff: str) -> Dict[str, int]:
    """
    Detect test types in PR diff.
    
    Returns dict with counts: {'unit': 0, 'integration': 0, 'e2e': 0}
    """
    if not diff:
        return {"unit": 0, "integration": 0, "e2e": 0}
    
    test_types = {"unit": 0, "integration": 0, "e2e": 0}
    diff_lower = diff.lower()
    
    # Integration test patterns
    integration_patterns = [
        r"integration.*test|integration.*spec",
        r"\.integration\.(test|spec)",
        r"__integration__",
        r"test.*integration",
        r"spec.*integration",
    ]
    
    # E2E test patterns
    e2e_patterns = [
        r"e2e.*test|e2e.*spec|end.*to.*end.*test",
        r"\.e2e\.(test|spec)",
        r"__e2e__",
        r"cypress|playwright|selenium",
        r"test.*e2e|spec.*e2e",
    ]
    
    # Check file paths and content
    lines = diff.split("\n")
    for line in lines:
        if line.startswith("+++") or line.startswith("---"):
            line_lower = line.lower()
            
            # Check for integration tests
            for pattern in integration_patterns:
                if re.search(pattern, line_lower):
                    test_types["integration"] += 1
                    break
            
            # Check for e2e tests
            for pattern in e2e_patterns:
                if re.search(pattern, line_lower):
                    test_types["e2e"] += 1
                    break
    
    # Unit tests are default (any test file that's not integration or e2e)
    # We'll count them separately by checking test files that don't match integration/e2e
    unit_test_patterns = [
        r"\.test\.(ts|tsx|js|jsx|py)",
        r"\.spec\.(ts|tsx|js|jsx|py)",
        r"__tests__",
    ]
    
    for line in lines:
        if line.startswith("+++") or line.startswith("---"):
            line_lower = line.lower()
            is_integration = any(re.search(p, line_lower) for p in integration_patterns)
            is_e2e = any(re.search(p, line_lower) for p in e2e_patterns)
            
            if not is_integration and not is_e2e:
                for pattern in unit_test_patterns:
                    if re.search(pattern, line_lower):
                        test_types["unit"] += 1
                        break
    
    return test_types


def assess_test_quality(diff: str) -> Tuple[int, List[str]]:
    """
    Assess test quality indicators.
    
    Returns (quality_score, quality_indicators)
    quality_score: 0-2 (0 = low, 1 = medium, 2 = high)
    """
    if not diff:
        return 0, []
    
    indicators = []
    quality_score = 0
    
    diff_lower = diff.lower()
    
    # Quality indicators
    # Assertions (indicates actual testing logic)
    assertion_patterns = [
        r"expect\(|assert\(|should\.|to\.be|to\.equal|to\.contain",
        r"describe\(|it\(|test\(|spec\(",
    ]
    has_assertions = any(re.search(p, diff_lower) for p in assertion_patterns)
    if has_assertions:
        quality_score += 1
        indicators.append("Assertions present")
    
    # Mocking (indicates isolation and proper test setup)
    mock_patterns = [
        r"mock|stub|spy|jest\.mock|vi\.mock|sinon",
        r"__mocks__",
    ]
    has_mocking = any(re.search(p, diff_lower) for p in mock_patterns)
    if has_mocking:
        quality_score += 1
        indicators.append("Mocking used")
    
    # Edge cases (indicates thorough testing)
    edge_case_patterns = [
        r"edge.*case|boundary|null|undefined|empty|error.*case",
        r"should.*handle.*error|should.*handle.*null",
    ]
    has_edge_cases = any(re.search(p, diff_lower) for p in edge_case_patterns)
    if has_edge_cases:
        indicators.append("Edge cases considered")
    
    # Test organization (indicates maintainability)
    org_patterns = [
        r"describe\(|context\(|suite\(",
        r"beforeEach|afterEach|beforeAll|afterAll",
    ]
    has_organization = any(re.search(p, diff_lower) for p in org_patterns)
    if has_organization:
        indicators.append("Well-organized tests")
    
    return min(quality_score, 2), indicators


def detect_test_impact(diff: str) -> bool:
    """
    Detect if tests touch critical modules.
    
    Returns True if tests cover critical areas (auth, tenant, database, security).
    """
    if not diff:
        return False
    
    diff_lower = diff.lower()
    
    # Critical module patterns
    critical_patterns = [
        r"auth|authentication|authorization",
        r"tenant|multi.*tenant",
        r"database|db|prisma|migration",
        r"security|rls|row.*level",
        r"middleware|guard|interceptor",
    ]
    
    # Check if test files reference critical modules
    for pattern in critical_patterns:
        if re.search(pattern, diff_lower):
            # Verify it's in a test file context
            lines = diff.split("\n")
            for i, line in enumerate(lines):
                if re.search(pattern, line.lower()):
                    # Check if nearby lines indicate test file
                    context = "\n".join(lines[max(0, i-2):min(len(lines), i+2)])
                    if any(keyword in context.lower() for keyword in ["test", "spec", "describe", "it("]):
                        return True
    
    return False


def score_tests(coverage: dict, rubric: dict, diff: str = "") -> Tuple[int, str]:
    """
    Score based on test coverage, new test files, test types, quality, and impact.
    
    Scoring breakdown:
    - +1 for new test files (max +1)
    - +1 for coverage increase >5%
    - +0.5 bonus for integration tests (rewarded more than unit tests)
    - +0.5 bonus for test quality (assertions, mocking)
    - +0.5 bonus for test impact (tests covering critical modules)
    """
    weight = rubric.get("tests", 3)
    score = 0
    notes = []

    # Check frontend coverage
    frontend_coverage = coverage.get("frontend", {})
    frontend_percentage = frontend_coverage.get("percentage", 0)

    # Check backend coverage
    backend_coverage = coverage.get("backend", {})
    backend_percentage = backend_coverage.get("percentage", 0)

    # 1. Check for new test files (+1 per test file, max +1)
    new_test_count = detect_new_test_files(diff)
    if new_test_count > 0:
        score += 1
        notes.append(f"New test files added: {new_test_count}")

    # 2. Check for coverage increase >5% (+1)
    coverage_increase = calculate_coverage_increase(coverage, diff)
    if coverage_increase >= 5.0:
        score += 1
        notes.append(f"Coverage increase: {coverage_increase:.1f}%")

    # 3. Test type detection and bonus for integration tests (+0.5)
    # Removed: "+1 for tests passing" (redundant with CI penalty system)
    test_types = detect_test_types(diff)
    if test_types["integration"] > 0 or test_types["e2e"] > 0:
        score += 0.5
        type_summary = []
        if test_types["integration"] > 0:
            type_summary.append(f"{test_types['integration']} integration")
        if test_types["e2e"] > 0:
            type_summary.append(f"{test_types['e2e']} e2e")
        if test_types["unit"] > 0:
            type_summary.append(f"{test_types['unit']} unit")
        notes.append(f"Test types: {', '.join(type_summary)} (+0.5 for integration/e2e)")

    # 4. Test quality assessment (+0.5)
    quality_score, quality_indicators = assess_test_quality(diff)
    if quality_score > 0:
        score += 0.5
        notes.append(f"Test quality: {', '.join(quality_indicators[:2])} (+0.5)")

    # 5. Test impact scoring (+0.5 for critical modules)
    has_critical_impact = detect_test_impact(diff)
    if has_critical_impact:
        score += 0.5
        notes.append("Tests cover critical modules (auth/tenant/security) (+0.5)")

    # Cap at maximum weight
    score = min(score, weight)

    # If no points awarded, provide feedback
    if score == 0:
        if frontend_percentage == 0 and backend_percentage == 0:
            notes.append("No test coverage detected")
        else:
            notes.append("No test improvements detected")

    return score, "; ".join(notes)


def detect_bug_fix(pr_desc: str, diff: str, rubric: dict) -> Tuple[int, str]:
    """Detect if PR is a bug fix and check documentation."""
    weight = rubric.get("bug_fix", 2)
    score = 0
    notes = []
    
    # Check PR description for bug fix keywords
    bug_keywords = ["bug", "fix", "error", "issue", "bugfix", "resolve", "correct"]
    pr_lower = pr_desc.lower()
    is_bug_fix = any(keyword in pr_lower for keyword in bug_keywords)
    
    if not is_bug_fix:
        return 0, "Not a bug fix PR"
    
    # Check if bug is logged in BUG_LOG.md
    bug_log_content = load_text_file(BUG_LOG_PATH)
    bug_logged = any(keyword in bug_log_content.lower() for keyword in bug_keywords)
    
    # Check if error pattern documented
    error_patterns_content = load_text_file(ERROR_PATTERNS_PATH)
    pattern_documented = len(error_patterns_content) > 100  # Basic check
    
    # Check for regression tests in diff
    test_keywords = ["test", "spec", "__tests__", ".test.", ".spec."]
    has_regression_test = any(keyword in diff.lower() for keyword in test_keywords)
    
    if bug_logged and pattern_documented and has_regression_test:
        score = weight
        notes.append("Bug fix with proper documentation and regression tests")
    elif bug_logged or pattern_documented:
        score = weight // 2
        notes.append("Bug fix with partial documentation")
    else:
        score = 1
        notes.append("Bug fix detected but missing documentation")
    
    return score, "; ".join(notes)


def score_documentation(diff: str, rubric: dict) -> Tuple[int, str]:
    """
    Score based on documentation changes.
    
    Scoring breakdown:
    - +1 for engineering decisions (architectural, can exceed weight)
    - +0.25 for updated dates
    - +0.1 for basic documentation updates
    - Maximum: +0.5 for normal documentation (engineering decisions can exceed)
    """
    weight = rubric.get("docs", 0.5)  # Updated default to 0.5
    score = 0
    notes = []
    
    # Check for changes in docs/ directory
    docs_changed = "docs/" in diff or "a/docs/" in diff or "b/docs/" in diff
    
    # Check for engineering decisions
    engineering_decisions_content = load_text_file(ENGINEERING_DECISIONS_PATH)
    has_engineering_decision = "engineering-decisions.md" in diff.lower()
    
    # Check for "Last Updated" date updates
    date_pattern = r"last[_\s]?updated[:\s]+(\d{4}-\d{2}-\d{2})"
    date_matches = re.findall(date_pattern, diff, re.IGNORECASE)
    current_date = datetime.now().strftime("%Y-%m-%d")
    dates_updated = [d for d in date_matches if d == current_date]
    
    if docs_changed:
        if has_engineering_decision:
            # Engineering decisions can exceed weight (architectural importance)
            score = 1.0
            notes.append("Documentation updated with engineering decisions (+1.0, exceeds normal weight)")
        elif dates_updated:
            score = 0.25
            notes.append("Documentation updated with current dates (+0.25)")
        else:
            score = 0.1
            notes.append("Documentation updated (+0.1)")
        
        # Cap normal documentation at weight (but allow engineering decisions to exceed)
        if not has_engineering_decision and score > weight:
            score = weight
    else:
        notes.append("No documentation changes")
    
    return score, "; ".join(notes)


def score_performance(diff: str, rubric: dict) -> Tuple[int, str]:
    """
    Score based on performance-related changes.
    
    Ignores comments and requires actual code changes (not just comments).
    """
    weight = rubric.get("performance", 1)
    score = 0
    notes = []

    if not diff:
        return 0, "No diff available for performance analysis"

    # Performance-related keywords
    performance_keywords = [
        "performance", "optimize", "optimization", "speed", "latency",
        "response time", "benchmark", "cache", "memoize", "lazy load",
        "debounce", "throttle", "performance test", "load test"
    ]

    # Check for performance test files (most reliable indicator)
    performance_test_patterns = [
        r"\.performance\.(test|spec)\.(ts|tsx|js|jsx|py)",
        r"\.benchmark\.(test|spec)\.(ts|tsx|js|jsx|py)",
        r"performance.*\.(test|spec)\.(ts|tsx|js|jsx|py)",
        r"load.*test.*\.(ts|tsx|js|jsx|py)",
        r"benchmark.*\.(test|spec)\.(ts|tsx|js|jsx|py)",
    ]

    performance_tests_added = 0
    for line in diff.split("\n"):
        if line.startswith("+++") or line.startswith("---"):
            for pattern in performance_test_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    performance_tests_added += 1
                    break

    # Check for performance-related changes in actual code (ignore comments)
    performance_mentions = 0
    code_lines_with_performance = []
    
    lines = diff.split("\n")
    for line in lines:
        # Skip comment-only lines
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or stripped.startswith("//") or stripped.startswith("*"):
            continue
        
        # Skip diff metadata lines
        if line.startswith("+++") or line.startswith("---") or line.startswith("@@"):
            continue
        
        # Only count lines that are actual code changes (added lines start with +)
        if line.startswith("+") and not line.startswith("+++"):
            # Remove the + prefix for checking
            code_line = line[1:].strip()
            # Strip inline comments (//, #, /* */) before checking for keywords
            # Remove // comments
            if "//" in code_line:
                code_line = code_line.split("//")[0].strip()
            # Remove # comments (but not at start of line, already handled above)
            if "#" in code_line and not code_line.startswith("#"):
                code_line = code_line.split("#")[0].strip()
            # Remove /* */ comments (simple case, not handling nested)
            if "/*" in code_line:
                code_line = code_line.split("/*")[0].strip()
            # Check if line contains performance keywords (only in actual code, not comments)
            for keyword in performance_keywords:
                if keyword in code_line.lower():
                    performance_mentions += 1
                    code_lines_with_performance.append(code_line[:50])  # Store snippet for notes
                    break  # Count each line only once

    # Award points
    if performance_tests_added > 0:
        score = weight
        notes.append(f"Performance tests added: {performance_tests_added} (+{weight})")
    elif performance_mentions >= 3:
        score = weight
        notes.append(f"Performance improvements detected in code ({performance_mentions} code changes, +{weight})")
    elif performance_mentions >= 1:
        score = weight // 2
        notes.append(f"Performance-related code changes detected ({performance_mentions} changes, +{weight // 2})")
    else:
        notes.append("No performance improvements detected (comments ignored)")

    return score, "; ".join(notes)


# Security scoring configuration
SECURITY_RULE_PREFIXES = [
    "p/security", "p/owasp", "semgrep-rules/security", "security.", ".security.", "lang.security"
]
SECURITY_TAGS = {"security", "owasp", "cwe", "taint", "secrets", "crypto", "injection"}
RULE_ID_SECURITY_PATTERNS = [
    re.compile(r".*security.*", re.I),
    re.compile(r".*owasp.*", re.I),
    re.compile(r".*cwe.*", re.I),
    re.compile(r".*taint.*", re.I),
    re.compile(r".*secrets?.*", re.I),
    re.compile(r".*injection.*", re.I),
]
# Minimum confidence threshold (optional). Semgrep may not always include this field.
MIN_CONFIDENCE = {"low": 0, "medium": 1, "high": 2}
MIN_CONFIDENCE_LEVEL = "medium"  # set to None to disable confidence filtering

# Files/paths considered tenant-sensitive / critical (increase weight)
TENANT_SENSITIVE_PATHS = [
    "src/db/", "migrations/", "src/models/", "src/repo/", "src/services/auth", "src/services/tenant",
    "src/controllers/auth", "src/controllers/tenant", "backend/src/", "backend/migrations/",
    "backend/prisma/", "backend/src/database/", "backend/src/auth/", "backend/src/tenant/"
]

# Baseline path (json file containing list of rule fingerprints to ignore)
SECURITY_BASELINE_FILE = ".security-baseline.json"


def load_baseline(baseline_path: str = SECURITY_BASELINE_FILE) -> set:
    """Load security baseline file containing ignored rule fingerprints."""
    try:
        baseline_file = pathlib.Path(baseline_path)
        if not baseline_file.is_absolute():
            # Make relative to repo root
            baseline_file = pathlib.Path(__file__).resolve().parents[2] / baseline_path
        if baseline_file.exists():
            with open(baseline_file, "r", encoding="utf-8") as fh:
                data = json.load(fh)
                # baseline expected to be {"ignore": ["<fingerprint>", ...]}
                return set(data.get("ignore", []))
    except FileNotFoundError:
        pass
    except Exception as e:
        logger.debug(
            f"Could not load baseline file: {baseline_path}",
            operation="load_baseline",
            error=e,
            baseline_path=str(baseline_path)
        )
    return set()


def result_fingerprint(r: Dict[str, Any]) -> str:
    """Create a stable fingerprint for baseline deduping."""
    # Use rule id + path + start line
    rid = r.get("check_id") or r.get("rule_id") or r.get("metadata", {}).get("id") or r.get("id", "")
    path = r.get("path") or r.get("extra", {}).get("metadata", {}).get("path") or ""
    start = ""
    try:
        start_obj = r.get("start") or r.get("extra", {}).get("start", {})
        if isinstance(start_obj, dict):
            start = str(start_obj.get("line", ""))
        else:
            start = str(start_obj)
    except Exception as e:
        # Non-critical: line number extraction failed, use empty string
        trace_context = get_or_create_trace_context()
        logger.debug(
            "Could not extract line number from Semgrep result",
            operation="result_fingerprint",
            traceId=trace_context.get("traceId"),
            spanId=trace_context.get("spanId"),
            error=str(e),
            result_id=rid
        )
        start = ""
    return f"{rid}::{path}::{start}"


def is_security_rule(result: Dict[str, Any]) -> bool:
    """
    Detect if a Semgrep result is a security rule.
    
    Uses multiple heuristics: rule id, metadata.category/owasp/cwe, tags, mode.
    """
    # 1) check known fields
    extra = result.get("extra", {}) or {}
    metadata = extra.get("metadata", {}) or result.get("metadata", {}) or {}
    check_id = result.get("check_id") or result.get("rule_id") or result.get("id") or ""
    tags = set()
    
    if isinstance(metadata.get("tags"), list):
        tags.update([t.lower() for t in metadata.get("tags", [])])
    elif isinstance(metadata.get("tags"), str):
        tags.update([t.strip().lower() for t in metadata.get("tags", "").split(",")])
    
    # metadata.category / owasp / cwe
    cat = (metadata.get("category") or metadata.get("owasp") or metadata.get("cwe") or "")
    if isinstance(cat, str) and cat.strip():
        if any(tok.lower() in cat.lower() for tok in ["security", "owasp", "cwe", "taint", "injection", "crypto"]):
            return True
    
    # check tag matches
    if tags & SECURITY_TAGS:
        return True
    
    # check check_id / rule id strings
    for pat in RULE_ID_SECURITY_PATTERNS:
        if check_id and pat.search(str(check_id)):
            return True
    
    # check known rule prefixes
    for pref in SECURITY_RULE_PREFIXES:
        if check_id and pref in check_id:
            return True
    
    # some Semgrep outputs include 'mode' set to 'taint' or 'security' marker
    if metadata.get("mode", "").lower() == "taint":
        return True
    
    # fallback: if the result message or extra contains security keywords
    message = result.get("message") or extra.get("message") or ""
    if isinstance(message, str) and re.search(r"\b(security|secret|credential|token|jwt|injection|xss|cwe|owasp|sql\s*injection)\b", message, re.I):
        return True
    
    return False


def confidence_meets_threshold(result: Dict[str, Any], min_level: Optional[str] = MIN_CONFIDENCE_LEVEL) -> bool:
    """Check if result confidence meets minimum threshold."""
    if not min_level:
        return True
    # Semgrep sometimes stores in extra.metadata.confidence or in result['extra']['confidence']
    extra = result.get("extra", {}) or {}
    metadata = extra.get("metadata", {}) or result.get("metadata", {}) or {}
    conf = metadata.get("confidence") or extra.get("confidence") or result.get("confidence")
    if conf is None:
        # no confidence info -> allow
        return True
    # normalize
    try:
        conf_s = str(conf).lower()
        return MIN_CONFIDENCE.get(conf_s, 0) >= MIN_CONFIDENCE.get(min_level, 0)
    except Exception as e:
        # Non-critical: confidence parsing failed, return True (conservative)
        trace_context = get_or_create_trace_context()
        logger.debug(
            "Could not parse confidence level, defaulting to True (conservative)",
            operation="confidence_meets_threshold",
            traceId=trace_context.get("traceId"),
            spanId=trace_context.get("spanId"),
            error=str(e),
            confidence=str(conf),
            min_level=min_level
        )
        return True


def touches_sensitive_path(changed_files: Optional[List[str]]) -> bool:
    """
    If the PR changed files in tenant-sensitive directories, treat findings as higher risk.
    
    `changed_files` should be the list of files modified in the PR.
    """
    if not changed_files or not isinstance(changed_files, list):
        return False
    
    for f in changed_files:
        if not isinstance(f, str):
            continue
        for p in TENANT_SENSITIVE_PATHS:
            if f.startswith(p) or f.startswith("./" + p) or ("/" + p) in f:
                return True
    return False


def detect_security_improvements(diff: str, pr_desc: str = "") -> Tuple[bool, List[str]]:
    """
    Detect security improvements in PR diff.
    
    Returns (has_improvements, list_of_improvements)
    """
    if not diff:
        return False, []
    
    improvements = []
    diff_lower = diff.lower()
    pr_desc_lower = pr_desc.lower() if pr_desc else ""
    combined = diff_lower + " " + pr_desc_lower
    
    # Security improvement patterns
    security_patterns = [
        (r"sanitize|sanitization|sanitizing", "Input sanitization"),
        (r"xss.*protection|xss.*prevent", "XSS protection"),
        (r"csrf.*protection|csrf.*token", "CSRF protection"),
        (r"content-security-policy|csp", "CSP headers"),
        (r"row.*level.*security|rls|row.*level.*policy", "RLS policies"),
        (r"auth.*middleware|authentication.*middleware", "Auth middleware"),
        (r"tenant.*isolation|multi.*tenant.*isolation", "Tenant isolation"),
        (r"input.*validation|validate.*input", "Input validation"),
        (r"parameterized.*query|prepared.*statement", "Parameterized queries"),
        (r"rate.*limit|rate.*limiting", "Rate limiting"),
        (r"encrypt|encryption", "Encryption"),
        (r"hash.*password|bcrypt|argon2", "Password hashing"),
        (r"jwt.*validation|token.*validation", "Token validation"),
        (r"security.*test|security.*spec", "Security tests"),
        (r"rls.*test|row.*level.*test", "RLS tests"),
    ]
    
    for pattern, description in security_patterns:
        if re.search(pattern, combined, re.IGNORECASE):
            # Check if it's in actual code (not just comments)
            # Look for the pattern in lines that aren't pure comments
            lines = diff.split("\n")
            for line in lines:
                if re.search(pattern, line, re.IGNORECASE):
                    # Skip if line is mostly comment
                    stripped = line.strip()
                    if not stripped.startswith("#") and not stripped.startswith("//") and not stripped.startswith("*"):
                        improvements.append(description)
                        break
    
    return len(improvements) > 0, list(set(improvements))


def detect_security_documentation(diff: str, pr_desc: str = "") -> bool:
    """
    Detect security documentation in PR diff.
    
    Returns True if security documentation is found.
    """
    if not diff:
        return False
    
    diff_lower = diff.lower()
    pr_desc_lower = pr_desc.lower() if pr_desc else ""
    combined = diff_lower + " " + pr_desc_lower
    
    # Security documentation patterns
    security_doc_patterns = [
        r"security.*diagram",
        r"security.*architecture",
        r"security.*adr|security.*decision",
        r"security.*policy",
        r"security.*guide",
        r"owasp.*guide",
        r"security.*best.*practice",
        r"docs.*security|security.*docs",
    ]
    
    # Check for security documentation files
    security_doc_files = [
        "security.md",
        "security-policy.md",
        "security-guide.md",
        "security-architecture.md",
        "docs/security",
    ]
    
    # Check file paths
    for doc_file in security_doc_files:
        if doc_file in diff_lower:
            return True
    
    # Check content patterns
    for pattern in security_doc_patterns:
        if re.search(pattern, combined, re.IGNORECASE):
            return True
    
    return False


def score_security(
    static_analysis: Dict[str, Any],
    rubric: Dict[str, int],
    changed_files: Optional[List[str]] = None,
    baseline_path: Optional[str] = None,
    diff: str = "",
    pr_desc: str = ""
) -> Tuple[int, str]:
    """
    Score based on security analysis (Semgrep JSON) with granular components.
    
    Scoring breakdown:
    - +1 for no issues detected (base)
    - +1 for security improvements (middleware, sanitization, RLS tests, auth checks)
    - +1 for security documentation (diagrams, ADRs, guides)
    - Negative scores for issues (high: -1, critical: -3)
    
    Returns (score:int, notes:str)
    """
    weight = rubric.get("security", 4)  # Updated default to 4
    
    # validation
    if not static_analysis:
        return 0, "No static analysis data"
    
    results = static_analysis.get("results", []) or []
    baseline = load_baseline(baseline_path or SECURITY_BASELINE_FILE)
    
    # CRITICAL FIX: Filter results to only changed files in this PR
    # This prevents repo-wide issues from being counted as new findings
    def result_in_changed_files(result: Dict[str, Any], changed_files_list: Optional[List[str]]) -> bool:
        """Check if a Semgrep result is in a file changed by this PR."""
        if not changed_files_list:
            # If we don't know changed files, include all (fallback)
            return True
        
        result_path = result.get("path") or result.get("extra", {}).get("metadata", {}).get("path") or ""
        if not result_path:
            # Can't determine path, include it (conservative)
            return True
        
        # Normalize paths for comparison
        result_path_normalized = result_path.replace("\\", "/").lstrip("./")
        
        for changed_file in changed_files_list:
            if not isinstance(changed_file, str):
                continue
            changed_file_normalized = changed_file.replace("\\", "/").lstrip("./")
            
            # Match if result path starts with changed file path or vice versa
            if (result_path_normalized.startswith(changed_file_normalized) or
                changed_file_normalized.startswith(result_path_normalized) or
                result_path_normalized == changed_file_normalized):
                return True
        
        return False
    
    security_results = []
    skipped_by_confidence = 0
    skipped_by_baseline = 0
    skipped_by_diff_filter = 0
    
    for r in results:
        try:
            # Filter by baseline first (most efficient)
            fp = result_fingerprint(r)
            if fp in baseline:
                skipped_by_baseline += 1
                continue
            
            # Filter by security rule type
            if not is_security_rule(r):
                continue
            
            # CRITICAL: Filter by changed files - only count findings in PR diff
            if not result_in_changed_files(r, changed_files):
                skipped_by_diff_filter += 1
                continue
            
            # Filter by confidence threshold
            if not confidence_meets_threshold(r):
                skipped_by_confidence += 1
                continue
            
            security_results.append(r)
        except Exception as e:
            # If any unexpected structure, log and skip (don't silently include non-security)
            trace_context = get_or_create_trace_context()
            logger.debug(
                f"Error processing Semgrep result: {e}",
                operation="score_security",
                traceId=trace_context.get("traceId"),
                spanId=trace_context.get("spanId"),
                requestId=trace_context.get("requestId"),
                error=str(e),
                result_id=r.get("check_id", "unknown")
            )
            # Only include if we can verify it's a security rule despite the error
            # AND it's in changed files
            if is_security_rule(r) and result_in_changed_files(r, changed_files):
                security_results.append(r)
    
    # categorize by severity (Semgrep sometimes uses 'ERROR'/'WARNING' in extra.severity)
    critical = [r for r in security_results if (r.get("extra", {}).get("severity") or "").upper() == "ERROR"]
    high = [r for r in security_results if (r.get("extra", {}).get("severity") or "").upper() == "WARNING"]
    
    # If PR touches tenant-sensitive paths, escalate
    escalate = touches_sensitive_path(changed_files)
    
    notes: List[str] = []
    notes.append(f"Total semgrep results: {len(results)}; security-filtered: {len(security_results)}; skipped_by_baseline: {skipped_by_baseline}; skipped_by_confidence: {skipped_by_confidence}; skipped_by_diff_filter: {skipped_by_diff_filter}")
    
    # Granular scoring components
    score = 0
    
    # Check for security issues first (negative scores take precedence)
    if critical:
        # Critical issues always block
        score = -3
        notes.append(f"Critical security issues (security rules marked ERROR): {len(critical)}")
    elif high:
        # Escalate high severity if sensitive paths touched
        score = -2 if escalate else -1
        notes.append(f"High severity security issues (security rules marked WARNING): {len(high)}")
        if escalate:
            notes.append("Escalated due to changes in tenant-sensitive paths")
    else:
        # No issues detected: +1 base score
        score += 1
        notes.append("No high/critical security issues detected (+1)")
        
        # Check for security improvements: +1
        has_improvements, improvements_list = detect_security_improvements(diff, pr_desc)
        if has_improvements:
            score += 1
            notes.append(f"Security improvements detected (+1): {', '.join(improvements_list[:3])}")
        
        # Check for security documentation: +1
        has_security_docs = detect_security_documentation(diff, pr_desc)
        if has_security_docs:
            score += 1
            notes.append("Security documentation added (+1)")
    
    # Cap positive score at weight (but allow negative scores)
    if score > 0:
        score = min(score, weight)
    
    # Add short list of top offenders for explainability (cap to 5)
    offenders = []
    for r in (critical + high)[:5]:
        rid = r.get("check_id") or r.get("rule_id") or r.get("id") or "unknown"
        path = r.get("path") or r.get("extra", {}).get("metadata", {}).get("path") or r.get("start", {}).get("path", "<unknown>")
        line = ""
        try:
            start_obj = r.get("start") or r.get("extra", {}).get("start", {})
            if isinstance(start_obj, dict):
                line = str(start_obj.get("line", ""))
            else:
                line = str(start_obj)
        except Exception as e:
            # Non-critical: line number extraction failed for offender list
            trace_context = get_or_create_trace_context()
            logger.debug(
                "Could not extract line number for offender list",
                operation="score_security",
                traceId=trace_context.get("traceId"),
                spanId=trace_context.get("spanId"),
                error=str(e),
                result_id=rid
            )
            line = ""
        offenders.append(f"{rid}@{path}:{line}")
    if offenders:
        notes.append("Top offenders: " + ", ".join(offenders))
    
    return score, "; ".join(notes)


def calculate_penalties(coverage: dict, static_analysis: dict, rubric: dict) -> Tuple[int, str]:
    """
    Calculate penalties for failing CI, missing tests, regressions.
    
    CRITICAL: Conditions are mutually exclusive to prevent double-penalty bugs.
    Only one penalty type applies per PR.
    """
    penalties = rubric.get("penalties", {})
    total_penalty = 0
    notes = []
    
    # Safely extract coverage percentages with type coercion and fallback handling
    def safe_get_percentage(cov_dict: dict, default: float = 0.0) -> float:
        """Safely extract percentage, handling None, missing keys, and type issues."""
        if not cov_dict or not isinstance(cov_dict, dict):
            return default
        pct = cov_dict.get("percentage")
        if pct is None:
            return default
        try:
            return float(pct)
        except (ValueError, TypeError):
            return default
    
    frontend_coverage = safe_get_percentage(coverage.get("frontend", {}))
    backend_coverage = safe_get_percentage(coverage.get("backend", {}))
    
    # Log coverage values for debugging (non-blocking)
    trace_context = get_or_create_trace_context()
    logger.debug(
        f"Penalty calculation: frontend={frontend_coverage}, backend={backend_coverage}",
        operation="calculate_penalties",
        traceId=trace_context.get("traceId"),
        spanId=trace_context.get("spanId"),
        requestId=trace_context.get("requestId"),
        frontend_coverage=frontend_coverage,
        backend_coverage=backend_coverage
    )
    
    # MUTUALLY EXCLUSIVE CONDITIONS (if/elif ensures only one applies)
    # Priority: failing_ci > missing_tests > no penalty
    
    # Check if coverage is completely missing (indicates CI failure or malformed workflow)
    # Only apply if BOTH are exactly 0 (not just low)
    if frontend_coverage == 0.0 and backend_coverage == 0.0:
        # Check if coverage data structure exists at all
        has_coverage_data = (
            "frontend" in coverage or 
            "backend" in coverage or
            len(coverage) > 0
        )
        
        if not has_coverage_data:
            # Coverage entirely missing - do NOT penalize (fallback logic)
            # This handles malformed PR workflows gracefully
            notes.append("Coverage data missing (no penalty applied - may be workflow issue)")
            trace_context = get_or_create_trace_context()
            logger.debug(
                "Coverage data structure missing entirely - skipping penalty",
                operation="calculate_penalties",
                traceId=trace_context.get("traceId"),
                spanId=trace_context.get("spanId"),
                requestId=trace_context.get("requestId")
            )
        else:
            # Coverage exists but is 0% - likely CI failure
            penalty = penalties.get("failing_ci", -4)
            total_penalty += penalty
            notes.append(f"No test coverage detected (possible CI failure): {penalty} penalty")
            trace_context = get_or_create_trace_context()
            logger.info(
                f"Applied failing_ci penalty: {penalty}",
                operation="calculate_penalties",
                traceId=trace_context.get("traceId"),
                spanId=trace_context.get("spanId"),
                requestId=trace_context.get("requestId"),
                penalty=penalty
            )
    
    # Only check low coverage if we didn't already apply failing_ci penalty
    # AND if coverage exists (not missing)
    elif frontend_coverage > 0 or backend_coverage > 0:
        # Coverage exists but is low (< 20%)
        if frontend_coverage < 20.0 and backend_coverage < 20.0:
            penalty = penalties.get("missing_tests", -2)
            total_penalty += penalty
            notes.append(f"Low test coverage (<20%): {penalty} penalty")
            trace_context = get_or_create_trace_context()
            logger.info(
                f"Applied missing_tests penalty: {penalty}",
                operation="calculate_penalties",
                traceId=trace_context.get("traceId"),
                spanId=trace_context.get("spanId"),
                requestId=trace_context.get("requestId"),
                penalty=penalty,
                frontend_coverage=frontend_coverage,
                backend_coverage=backend_coverage
            )
        # If one side has good coverage, don't penalize
        elif frontend_coverage >= 20.0 or backend_coverage >= 20.0:
            notes.append("Adequate test coverage detected (no penalty)")
    
    # If coverage is missing entirely (empty dict), no penalty (handled above)
    
    return total_penalty, "; ".join(notes) if notes else "No penalties"


def compute_score(
    coverage: dict,
    static_analysis: dict,
    pr_desc: str,
    diff: str,
    rubric: dict,
    include_file_level: bool = True
) -> Tuple[int, dict, str, dict]:
    """
    Compute total REWARD_SCORE and breakdown with optional file-level scoring.
    
    Returns:
        Tuple of (total_score, breakdown, notes, file_scores)
        file_scores: Dict mapping file paths to their scores and breakdowns
    """
    breakdown = {
        "tests": 0,
        "bug_fix": 0,
        "docs": 0,
        "performance": 0,
        "security": 0,
        "penalties": 0,
    }

    notes_list = []
    file_scores = {}
    
    # Parse files from diff (needed for security scoring even if file-level scoring is disabled)
    files = {}
    if diff:
        files = parse_diff_files(diff)
    
    # File-level scoring (if enabled)
    if include_file_level and files:
        
        # Score each file individually
        for file_path, file_diff in files.items():
            file_score, file_breakdown, file_notes = score_file(
                file_path, file_diff, coverage, static_analysis, pr_desc, rubric
            )
            file_scores[file_path] = {
                "score": file_score,
                "breakdown": file_breakdown,
                "notes": file_notes
            }
        
        # Aggregate file scores into PR-level breakdown
        for file_path, file_data in file_scores.items():
            file_breakdown = file_data["breakdown"]
            # Aggregate positive contributions (tests, bug_fix, docs, performance)
            # Use max to avoid double-counting (file scores are already calculated)
            breakdown["tests"] = max(breakdown["tests"], file_breakdown.get("tests", 0))
            breakdown["bug_fix"] = max(breakdown["bug_fix"], file_breakdown.get("bug_fix", 0))
            breakdown["docs"] = max(breakdown["docs"], file_breakdown.get("docs", 0))
            breakdown["performance"] = max(breakdown["performance"], file_breakdown.get("performance", 0))
        
        # Add file-level summary to notes
        if file_scores:
            notes_list.append(f"\n## File-Level Breakdown ({len(file_scores)} files):")
            for file_path, file_data in sorted(file_scores.items()):
                file_score = file_data["score"]
                notes_list.append(f"- **{file_path}**: {file_score:+.1f}/10")
                if file_data["breakdown"]["tests"] > 0:
                    notes_list.append(f"  - Tests: +{file_data['breakdown']['tests']}")
                if file_data["breakdown"]["bug_fix"] > 0:
                    notes_list.append(f"  - Bug Fix: +{file_data['breakdown']['bug_fix']}")
                if file_data["breakdown"]["docs"] > 0:
                    notes_list.append(f"  - Docs: +{file_data['breakdown']['docs']}")
                if file_data["breakdown"]["performance"] > 0:
                    notes_list.append(f"  - Performance: +{file_data['breakdown']['performance']}")

    # Score each category at PR level (for aggregation and security/penalties)
    tests_score, tests_note = score_tests(coverage, rubric, diff)
    # Use PR-level score if higher than aggregated file scores
    breakdown["tests"] = max(breakdown.get("tests", 0), tests_score)
    notes_list.append(f"Tests: {tests_note}")

    bug_fix_score, bug_fix_note = detect_bug_fix(pr_desc, diff, rubric)
    breakdown["bug_fix"] = max(breakdown.get("bug_fix", 0), bug_fix_score)
    notes_list.append(f"Bug Fix: {bug_fix_note}")

    docs_score, docs_note = score_documentation(diff, rubric)
    breakdown["docs"] = max(breakdown.get("docs", 0), docs_score)
    notes_list.append(f"Docs: {docs_note}")

    # Performance scoring
    performance_score, performance_note = score_performance(diff, rubric)
    breakdown["performance"] = max(breakdown.get("performance", 0), performance_score)
    notes_list.append(f"Performance: {performance_note}")

    # Security and penalties are PR-level (not file-level)
    # Extract changed files list from parsed diff for security scoring
    changed_files_list = list(files.keys()) if files else None
    security_score, security_note = score_security(static_analysis, rubric, changed_files=changed_files_list, diff=diff, pr_desc=pr_desc)
    breakdown["security"] = security_score
    notes_list.append(f"Security: {security_note}")

    penalties_score, penalties_note = calculate_penalties(coverage, static_analysis, rubric)
    breakdown["penalties"] = penalties_score
    notes_list.append(f"Penalties: {penalties_note}")
    
    # Calculate total score
    total_score = sum(breakdown.values())
    
    # Apply security blocker rule
    if security_score <= -3:
        total_score = min(total_score, -3)
        notes_list.append("Security blocker: Score capped at -3")
    
    # Calculate stabilized score (reduces noise from micro-PRs)
    files_changed_count = len(files) if files else 0
    stabilized_score, stabilized_note = calculate_stabilized_score(total_score, files_changed_count)
    notes_list.append(stabilized_note)
    
    # Add stabilized score to breakdown for tracking
    breakdown["stabilized_score"] = round(stabilized_score, 2)
    
    notes = "\n".join(f"- {note}" for note in notes_list)
    
    return total_score, breakdown, notes, file_scores


def calculate_stabilized_score(score: int, files_changed: int) -> Tuple[float, str]:
    """
    Calculate Stabilized Score (SS) to prevent PR spam from skewing metrics.
    
    Formula: stable_score = score * sqrt(files_changed / 10)
    
    This reduces noise for micro-PRs (1-2 files) while maintaining full weight
    for substantial PRs (10+ files).
    
    Args:
        score: Raw reward score
        files_changed: Number of files changed in PR
    
    Returns:
        Tuple of (stabilized_score, note)
    """
    import math
    
    if files_changed <= 0:
        files_changed = 1  # Avoid division by zero
    
    # Calculate stabilization factor
    # For 10 files: sqrt(10/10) = 1.0 (no change)
    # For 1 file: sqrt(1/10) = 0.316 (reduced weight)
    # For 25 files: sqrt(25/10) = 1.58 (slight boost)
    stabilization_factor = math.sqrt(files_changed / 10.0)
    stabilized_score = score * stabilization_factor
    
    note = f"Stabilized Score: {stabilized_score:.2f} (raw: {score}, files: {files_changed}, factor: {stabilization_factor:.2f})"
    
    return stabilized_score, note


def calculate_trend_bonus(historical_scores: Optional[List[int]], breakdown: dict) -> Tuple[int, str]:
    """
    Calculate trend-based bonus/penalty based on improvement patterns.
    
    Rewards:
    - If 10 PRs in a row reduce security warnings → bonus
    - If trend is improving → bonus
    - If trend is worsening → warning (no penalty, just note)
    
    Args:
        historical_scores: List of recent scores (most recent first)
        breakdown: Current PR breakdown for category analysis
    
    Returns:
        Tuple of (trend_bonus, trend_note)
    """
    if not historical_scores or len(historical_scores) < 3:
        return 0, "Insufficient history for trend analysis"
    
    # Analyze last 10 scores for trends
    recent_scores = historical_scores[:10]
    
    # Security trend: count PRs with security issues
    # We'd need historical breakdowns for this, so for now use score trend
    score_trend = []
    for i in range(len(recent_scores) - 1):
        if recent_scores[i] is not None and recent_scores[i + 1] is not None:
            score_trend.append(recent_scores[i] - recent_scores[i + 1])
    
    if not score_trend:
        return 0, "Cannot calculate trend (missing data)"
    
    # Calculate average improvement
    avg_improvement = sum(score_trend) / len(score_trend)
    
    trend_bonus = 0
    trend_note = ""
    
    # Reward consistent improvement
    if avg_improvement > 0.5 and len([t for t in score_trend if t > 0]) >= 7:
        # Strong positive trend
        trend_bonus = 1
        trend_note = f"Strong improvement trend detected (+{trend_bonus} bonus): average improvement of {avg_improvement:.2f} over {len(recent_scores)} PRs"
    elif avg_improvement > 0:
        # Weak positive trend
        trend_bonus = 0
        trend_note = f"Improving trend: average improvement of {avg_improvement:.2f} over {len(recent_scores)} PRs"
    elif avg_improvement < -0.5:
        # Declining trend
        trend_bonus = 0
        trend_note = f"WARNING: Declining trend detected: average decline of {abs(avg_improvement):.2f} over {len(recent_scores)} PRs"
    else:
        trend_note = f"Stable trend: average change of {avg_improvement:.2f} over {len(recent_scores)} PRs"
    
    return trend_bonus, trend_note


def normalize_score(
    score: int,
    breakdown: dict,
    pr_size: Optional[Dict[str, int]] = None,
    changed_files: Optional[List[str]] = None,
    historical_scores: Optional[List[int]] = None
) -> Tuple[int, str]:
    """
    Normalize score based on PR size, repository maturity, and historical context.
    
    This is a future enhancement framework. Currently returns score unchanged.
    
    Future normalization factors:
    - PR size (lines changed, files changed)
    - Repository maturity (historical average scores)
    - Module/area touched (critical vs. non-critical)
    - PR type (bug fix vs. feature vs. refactor)
    
    Args:
        score: Raw score before normalization
        breakdown: Score breakdown by category
        pr_size: Dict with 'lines' and 'files' keys
        changed_files: List of changed file paths
        historical_scores: List of historical scores for context
    
    Returns:
        Tuple of (normalized_score, normalization_note)
    """
    # Future enhancement: Implement normalization logic
    # For now, return score unchanged
    normalization_note = "Score normalization disabled (future enhancement)"
    
    # Placeholder for future implementation:
    # - Normalize by PR size (small PRs get slight boost, large PRs slight reduction)
    # - Normalize by repo maturity (compare to historical averages)
    # - Normalize by module criticality (auth/tenant modules scored more strictly)
    # - Normalize by PR type (bug fixes vs. features have different expectations)
    
    return score, normalization_note


def get_decision_recommendation(score: int, breakdown: dict, static_analysis: dict) -> Tuple[str, str]:
    """Get decision recommendation based on score and analysis."""
    # Check for critical security issues
    security_issues = static_analysis.get("results", [])
    critical_security = any(
        r.get("extra", {}).get("severity") == "ERROR" 
        for r in security_issues
    )
    
    # Check for failing tests (no coverage or very low)
    frontend_cov = breakdown.get("coverage", {}).get("frontend", {}).get("percentage", 0)
    backend_cov = breakdown.get("coverage", {}).get("backend", {}).get("percentage", 0)
    tests_failing = (frontend_cov == 0 and backend_cov == 0) or breakdown.get("penalties", 0) < -3
    
    # Decision logic
    if score < -3 and (critical_security or tests_failing):
        decision = "BLOCK"
        reason = "Score below -3 with critical issues (security or failing tests)"
    elif score < -3:
        decision = "BLOCK"
        reason = "Score below -3 (blocking threshold)"
    elif score <= 3:
        decision = "REQUEST_CHANGES"
        reason = "Score between -3 and 3 (requires improvement)"
    else:
        decision = "APPROVE"
        reason = "Score above 3 (meets quality standards, human review still required)"
    
    return decision, reason


def generate_comment(
    score: int, 
    breakdown: dict, 
    notes: str, 
    template_path: Optional[pathlib.Path] = None,
    static_analysis: Optional[dict] = None,
    pr_num: Optional[str] = None,
    run_id: Optional[str] = None
) -> str:
    """Generate PR comment from template with decision recommendation."""
    # Get decision recommendation
    decision, decision_reason = get_decision_recommendation(
        score, 
        breakdown, 
        static_analysis or {}
    )
    
    # Generate artifact links
    coverage_link = "See workflow artifacts for coverage reports"
    static_link = "See workflow artifacts for static analysis results"
    
    if pr_num and run_id:
        # Generate links to artifacts (if available)
        repo = os.environ.get("GITHUB_REPOSITORY", "")
        if repo:
            coverage_link = f"[View Coverage Artifacts](https://github.com/{repo}/actions/runs/{run_id})"
            static_link = f"[View Static Analysis](https://github.com/{repo}/actions/runs/{run_id})"
    
    if template_path and template_path.exists():
        with open(template_path, "r", encoding="utf-8") as handle:
            template = handle.read()

        # Replace template placeholders
        comment = template.replace("{{score}}", str(score))
        comment = comment.replace("{{tests}}", str(breakdown["tests"]))
        comment = comment.replace("{{bug_fix}}", str(breakdown["bug_fix"]))     
        comment = comment.replace("{{docs}}", str(breakdown["docs"]))
        comment = comment.replace("{{performance}}", str(breakdown["performance"]))                                                                             
        comment = comment.replace("{{security}}", str(breakdown["security"]))   
        comment = comment.replace("{{penalties_total}}", str(breakdown["penalties"]))                                                                           
        comment = comment.replace("{{notes}}", notes)
        comment = comment.replace("{{coverage_link}}", coverage_link)
        comment = comment.replace("{{static_link}}", static_link)
        
        # Add decision section if not in template
        if "{{decision}}" not in template:
            decision_section = f"""

### Decision Recommendation: **{decision}**
{decision_reason}
"""
            # Insert before closing ```
            if "```" in comment:
                comment = comment.replace("```", f"{decision_section}\n```")
            else:
                comment += decision_section
    else:
        # Fallback format with decision
        comment = f"""## REWARD_SCORE: {score}/10 (source: CI)

### Breakdown:
- **tests**: {breakdown["tests"]}
- **bug_fix**: {breakdown["bug_fix"]}
- **docs**: {breakdown["docs"]}
- **performance**: {breakdown["performance"]}
- **security**: {breakdown["security"]}
- **penalties**: {breakdown["penalties"]}

### Decision Recommendation: **{decision}**
{decision_reason}

### Notes:
{notes}

### Artifacts:
- Coverage: {coverage_link}
- Static Analysis: {static_link}

---
*This score is computed automatically by CI. See `.cursor/reward_rubric.yaml` for scoring details.*                                                             
"""

    return comment


def get_pr_diff(pr_num: str, repo_path: pathlib.Path) -> str:
    """Get PR diff using git commands."""
    try:
        result = subprocess.run(
            ["git", "diff", "origin/main...HEAD"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=30
        )
        return result.stdout
    except (subprocess.TimeoutExpired, FileNotFoundError) as e:
        logger.warn(
            "Could not get PR diff",
            operation="get_pr_diff",
            error=e,
            pr_num=pr_num
        )
        return ""


def get_pr_description(pr_num: str) -> str:
    """Get PR description using GitHub CLI."""
    try:
        result = subprocess.run(
            ["gh", "pr", "view", pr_num, "--json", "body"],
            capture_output=True,
            text=True,
            timeout=10
        )
        if result.returncode == 0:
            data = json.loads(result.stdout)
            return data.get("body", "")
    except (subprocess.TimeoutExpired, FileNotFoundError, json.JSONDecodeError) as e:
        logger.warn(
            "Could not get PR description",
            operation="get_pr_description",
            error=e,
            pr_num=pr_num
        )
        pass
    return ""


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pr", required=True, help="PR number")
    parser.add_argument("--coverage", required=True, help="Path to coverage JSON (or comma-separated frontend,backend paths)")
    parser.add_argument("--static", required=True, help="Path to static analysis JSON")
    parser.add_argument("--pr-desc", help="Path to PR description file (optional)")
    parser.add_argument("--diff", help="Path to PR diff file (optional)")
    parser.add_argument("--out", required=True, help="Output JSON path")
    args = parser.parse_args()
    
    # Load rubric
    rubric = load_yaml(str(RUBRIC_PATH))
    if not rubric:
        logger.warn(
            "Could not load reward_rubric.yaml, using defaults",
            operation="main",
            rubric_path=str(RUBRIC_PATH)
        )
        rubric = {
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
    
    # Load coverage data
    coverage = {}
    if "," in args.coverage:
        # Separate frontend and backend coverage paths
        frontend_path, backend_path = args.coverage.split(",", 1)
        coverage["frontend"] = parse_frontend_coverage(frontend_path.strip())
        coverage["backend"] = parse_backend_coverage(backend_path.strip())
    else:
        # Single coverage file (try to detect format)
        coverage_data = load_json(args.coverage)
        if "frontend" in args.coverage.lower() or "vitest" in args.coverage.lower():
            coverage["frontend"] = parse_frontend_coverage(args.coverage)
        else:
            coverage["backend"] = parse_backend_coverage(args.coverage)
    
    # Load static analysis
    static_analysis = load_json(args.static)
    
    # Get PR description
    if args.pr_desc:
        with open(args.pr_desc, "r", encoding="utf-8") as handle:
            pr_desc = handle.read()
    else:
        pr_desc = get_pr_description(args.pr)
    
    # Get PR diff
    if args.diff:
        with open(args.diff, "r", encoding="utf-8") as handle:
            diff = handle.read()
    else:
        repo_path = pathlib.Path(__file__).resolve().parents[2]
        diff = get_pr_diff(args.pr, repo_path)
    
    # Compute score
    score, breakdown, notes, file_scores = compute_score(
        coverage,
        static_analysis,
        pr_desc,
        diff,
        rubric,
        include_file_level=True
    )
    
    # Generate comment with decision recommendation
    template_path = RUBRIC_PATH.parent / "ci" / "reward_score_comment_template.md"
    pr_num = args.pr
    run_id = os.environ.get("GITHUB_RUN_ID")
    comment = generate_comment(
        score, 
        breakdown, 
        notes, 
        template_path,
        static_analysis=static_analysis,
        pr_num=pr_num,
        run_id=run_id
    )
    
    # Write output
    output = {
        "score": score,
        "breakdown": breakdown,
        "comment": comment,
        "file_scores": file_scores,  # File-level scoring breakdown
        "metadata": {
            "pr": args.pr,
            "computed_at": datetime.utcnow().isoformat() + "Z",
            "rubric_version": rubric.get("version", "unknown"),
            "file_level_scoring": True
        }
    }
    
    with open(args.out, "w", encoding="utf-8") as handle:
        json.dump(output, handle, indent=2)
    
    logger.info(
        f"REWARD_SCORE computed: {score}/10",
        operation="main",
        score=score,
        breakdown=breakdown
    )


if __name__ == "__main__":
    main()
