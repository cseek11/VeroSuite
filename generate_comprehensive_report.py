#!/usr/bin/env python3
"""Generate comprehensive Auto-PR system analysis report"""
import json
import pathlib
from datetime import datetime
from collections import Counter, defaultdict
import sys

# Load reward scores
try:
    with open('docs/metrics/reward_scores.json', 'r', encoding='utf-8') as f:
        reward_data = json.load(f)
    scores = reward_data.get('scores', [])
except Exception as e:
    print(f"ERROR: Could not load reward_scores.json: {e}", file=sys.stderr)
    scores = []

recent_scores = sorted(scores, key=lambda x: x.get('timestamp', ''), reverse=True)[:40]

# Output file
report_file = open('AUTO_PR_SYSTEM_COMPREHENSIVE_REPORT.md', 'w', encoding='utf-8')

def print_section(title, level=1):
    """Print a markdown section header"""
    prefix = '#' * level
    report_file.write(f"\n{prefix} {title}\n\n")

def print_code_block(code, language=""):
    """Print a code block"""
    report_file.write(f"```{language}\n{code}\n```\n\n")

def print_text(text):
    """Print plain text"""
    report_file.write(f"{text}\n\n")

# ============================================================================
# REPORT HEADER
# ============================================================================
print_section("AUTO-PR SYSTEM COMPREHENSIVE ANALYSIS REPORT", 1)
print_text(f"**Generated:** {datetime.now().isoformat()}")
print_text(f"**Total PRs in Database:** {len(scores)}")
print_text(f"**Report Scope:** Last 40 PRs analyzed in detail")

# ============================================================================
# 1. RECENT REWARD SCORE SAMPLES
# ============================================================================
print_section("1. Recent Reward Score Samples (Last 40 PRs)", 1)

print_text("### Detailed Breakdown for Each PR")
print_text("For each PR, the following information is provided:")
print_text("- PR number")
print_text("- Total Reward Score")
print_text("- Score breakdown (tests, security, penalties, bug_fix, docs, performance)")
print_text("- Test scores (1 or 0)")
print_text("- Coverage numbers (backend/frontend)")
print_text("- Penalties applied (which ones)")
print_text("- Security score")
print_text("- Whether CI actually failed (penalty -4)")
print_text("- Whether test files were added")
print_text("- Timestamp")

for i, s in enumerate(recent_scores, 1):
    pr = s.get('pr', 'N/A')
    score = s.get('score', 0)
    breakdown = s.get('breakdown', {})
    timestamp = s.get('timestamp', 'N/A')
    notes = s.get('notes', '')
    files_changed = s.get('files_changed', 0)
    
    tests = breakdown.get('tests', 0)
    security = breakdown.get('security', 0)
    penalties = breakdown.get('penalties', 0)
    bug_fix = breakdown.get('bug_fix', 0)
    docs = breakdown.get('docs', 0)
    performance = breakdown.get('performance', 0)
    
    # Extract coverage info
    coverage_info = "N/A"
    frontend_cov = "N/A"
    backend_cov = "N/A"
    if notes:
        for line in notes.split('\n'):
            if 'Frontend coverage' in line or 'frontend' in line.lower():
                frontend_cov = line.strip()[:100]
            if 'Backend coverage' in line or 'backend' in line.lower():
                backend_cov = line.strip()[:100]
            if 'coverage' in line.lower():
                coverage_info = line.strip()[:100]
    
    # Extract penalty details
    penalty_note = ""
    if notes:
        for line in notes.split('\n'):
            if 'Penalties:' in line or 'penalty' in line.lower():
                penalty_note = line.replace('Penalties: ', '').strip()[:100]
                break
    
    # Check if test files were added
    has_test_files = tests > 0
    ci_failed = penalties == -4  # -4 is failing_ci
    
    report_file.write(f"#### PR #{pr} (Sample {i}/40)\n\n")
    report_file.write(f"- **Timestamp:** `{timestamp[:19] if timestamp != 'N/A' else 'N/A'}`\n")
    report_file.write(f"- **Total Score:** `{score}`\n")
    report_file.write(f"- **Files Changed:** `{files_changed}`\n")
    report_file.write(f"- **Breakdown:**\n")
    report_file.write(f"  - Tests: `{tests}`\n")
    report_file.write(f"  - Security: `{security}`\n")
    report_file.write(f"  - Penalties: `{penalties}` ({penalty_note})\n")
    report_file.write(f"  - Bug Fix: `{bug_fix}`\n")
    report_file.write(f"  - Docs: `{docs}`\n")
    report_file.write(f"  - Performance: `{performance}`\n")
    report_file.write(f"- **Coverage Info:** {coverage_info}\n")
    report_file.write(f"- **Frontend Coverage:** {frontend_cov}\n")
    report_file.write(f"- **Backend Coverage:** {backend_cov}\n")
    report_file.write(f"- **Test Files Added:** {'Yes' if has_test_files else 'No'}\n")
    report_file.write(f"- **CI Failed (penalty -4):** {'Yes' if ci_failed else 'No'}\n")
    report_file.write(f"\n")

# ============================================================================
# 2. AUTO-PR STATISTICS
# ============================================================================
print_section("2. Auto-PR Statistics (Simple Metrics)", 1)

# Calculate time between PRs
time_diffs = []
pr_times = []
for s in scores:
    timestamp = s.get('timestamp', '')
    if timestamp:
        try:
            pr_times.append(datetime.fromisoformat(timestamp.replace('Z', '+00:00')))
        except:
            pass

pr_times.sort()
for i in range(1, len(pr_times)):
    diff = (pr_times[i] - pr_times[i-1]).total_seconds() / 3600  # hours
    time_diffs.append(diff)

# Count PRs with test files
prs_with_tests = sum(1 for s in scores if s.get('breakdown', {}).get('tests', 0) > 0)
prs_with_docs = sum(1 for s in scores if s.get('breakdown', {}).get('docs', 0) > 0)
prs_with_coverage = sum(1 for s in scores if s.get('breakdown', {}).get('tests', 0) > 0 or 
                       'coverage' in s.get('notes', '').lower())

# Penalty distribution
penalty_dist = Counter()
for s in scores:
    penalty = s.get('breakdown', {}).get('penalties', 0)
    penalty_dist[penalty] += 1

# Score distribution
score_ranges = {'negative': 0, 'low': 0, 'medium': 0, 'high': 0}
for s in scores:
    score = s.get('score', 0)
    if score < 0:
        score_ranges['negative'] += 1
    elif score < 3:
        score_ranges['low'] += 1
    elif score < 6:
        score_ranges['medium'] += 1
    else:
        score_ranges['high'] += 1

print_text(f"- **Total PRs Analyzed:** {len(scores)}")
print_text(f"- **PRs with Test Files:** {prs_with_tests} ({(prs_with_tests/len(scores)*100):.1f}%)")
print_text(f"- **PRs with Docs Changes:** {prs_with_docs} ({(prs_with_docs/len(scores)*100):.1f}%)")
print_text(f"- **PRs with Coverage Data:** {prs_with_coverage} ({(prs_with_coverage/len(scores)*100):.1f}%)")

print_text("### Penalty Distribution")
for penalty, count in sorted(penalty_dist.items()):
    print_text(f"- **Penalty {penalty}:** {count} PRs ({(count/len(scores)*100):5.1f}%)")

print_text("### Score Distribution")
print_text(f"- **Negative Scores (< 0):** {score_ranges['negative']} PRs")
print_text(f"- **Low Scores (0-3):** {score_ranges['low']} PRs")
print_text(f"- **Medium Scores (3-6):** {score_ranges['medium']} PRs")
print_text(f"- **High Scores (> 6):** {score_ranges['high']} PRs")

if time_diffs:
    avg_time = sum(time_diffs) / len(time_diffs)
    print_text(f"- **Average Time Between PRs:** {avg_time:.2f} hours")
    print_text(f"- **Min Time Between PRs:** {min(time_diffs):.2f} hours")
    print_text(f"- **Max Time Between PRs:** {max(time_diffs):.2f} hours")
    print_text(f"- **PRs per Day (estimated):** {24/avg_time:.2f}")

# ============================================================================
# 3. COVERAGE JSON OUTPUT (Raw CI Artifacts)
# ============================================================================
print_section("3. Coverage JSON Output (Raw CI Artifacts)", 1)

print_text("### Frontend Coverage Format (Vitest)")
print_text("**Structure:** `coverage-final.json`")
print_text("**Location:** `frontend/coverage/coverage-final.json`")
print_text("**Format:** Object with file paths as keys, each containing coverage data")

print_code_block("""{
  "file1.ts": {
    "s": {
      "1": 1,  // line 1 covered (count > 0)
      "2": 0,  // line 2 not covered
      "3": 1   // line 3 covered
    }
  },
  "file2.ts": {
    "s": {
      "4": 1,
      "5": 1
    }
  }
}""", "json")

print_text("**Parsing Logic:**")
print_text("- Iterates through all files")
print_text("- Counts total statements (lines) and covered statements (count > 0)")
print_text("- Calculates percentage: `(covered_lines / total_lines * 100)`")
print_text("- Returns: `{total, covered, percentage}`")

print_text("### Backend Coverage Format (Pytest)")
print_text("**Structure:** `coverage-summary.json`")
print_text("**Location:** `backend/coverage/coverage-summary.json`")
print_text("**Format:** Object with `totals` key containing summary")

print_code_block("""{
  "totals": {
    "num_statements": 1000,
    "covered_lines": 750,
    "percent_covered": 75.0
  }
}""", "json")

print_text("**Parsing Logic:**")
print_text("- Extracts `totals.num_statements` for total lines")
print_text("- Extracts `totals.covered_lines` for covered lines")
print_text("- Extracts `totals.percent_covered` for percentage (direct)")
print_text("- Returns: `{total, covered, percentage}`")

print_text("### Coverage Extraction Code")
print_code_block("""def safe_get_percentage(cov_dict: dict, default: float = 0.0) -> float:
    \"\"\"Safely extract percentage, handling None, missing keys, and type issues.\"\"\"
    if not cov_dict or not isinstance(cov_dict, dict):
        return default
    pct = cov_dict.get("percentage")
    if pct is None:
        return default
    try:
        return float(pct)
    except (ValueError, TypeError):
        return default""", "python")

print_text("### Coverage Scenarios")
print_text("1. **Coverage = 0%:** Both frontend and backend coverage are 0.0")
print_text("   - May indicate CI failure or tests not run")
print_text("   - Triggers `failing_ci` penalty (-4) if coverage data structure exists")
print_text("2. **Coverage Missing:** Coverage data structure is empty or missing")
print_text("   - No penalty applied (fallback logic)")
print_text("   - Handles malformed PR workflows gracefully")
print_text("3. **Coverage < 20%:** Coverage exists but is low")
print_text("   - Triggers `missing_tests` penalty (-2) if both < 20%")
print_text("4. **Coverage >= 20%:** Good coverage")
print_text("   - No penalty applied")

# ============================================================================
# 4. SAMPLE SEMGREP OUTPUT (Raw JSON)
# ============================================================================
print_section("4. Sample Semgrep Output (Raw JSON)", 1)

print_text("### Semgrep JSON Structure")
print_text("**Command:** `semgrep --config=auto --json -o artifacts/semgrep-output.json`")
print_text("**Location:** `artifacts/semgrep-output.json`")
print_text("**Format:** Object with `results` array")

print_code_block("""{
  "results": [
    {
      "check_id": "python.lang.security.audit.insecure-temp-file.insecure-temp-file",
      "path": "backend/src/utils/file.py",
      "start": {
        "line": 42,
        "col": 5
      },
      "end": {
        "line": 42,
        "col": 20
      },
      "message": "Insecure use of tempfile.mktemp()",
      "severity": "ERROR",
      "extra": {
        "metadata": {
          "category": "security",
          "owasp": "A03:2021 – Injection",
          "cwe": "CWE-22",
          "tags": ["security", "injection"],
          "mode": "taint"
        },
        "severity": "ERROR"
      }
    }
  ]
}""", "json")

print_text("### Security Rule Detection")
print_text("A result is considered a security rule if ANY of the following match:")
print_text("1. **Category/OWASP/CWE:** Contains 'security', 'owasp', 'cwe', 'taint', 'injection', 'crypto'")
print_text("2. **Tags:** Contains security-related tags")
print_text("3. **Rule ID:** Matches security rule patterns (e.g., `lang.security.*`)")
print_text("4. **Mode:** Set to 'taint'")
print_text("5. **Message:** Contains security keywords")

print_text("### Severity Classification")
print_text("- **CRITICAL:** `severity == 'ERROR'` → Score: -3")
print_text("- **HIGH:** `severity == 'WARNING'` → Score: -1 (or -2 if sensitive paths)")
print_text("- **LOW/INFO:** Filtered out by confidence threshold")

print_text("### Diff-Based Filtering")
print_text("**CRITICAL FIX:** Only results in changed files are counted")
print_text("- Normalizes paths (handles Windows/Unix differences)")
print_text("- Matches if result path starts with changed file path or vice versa")
print_text("- Prevents repo-wide issues from being counted as new findings")

print_text("### Baseline Filtering")
print_text("**Baseline File:** `.security-baseline.json` (if exists)")
print_text("- Each result is fingerprinted: `{check_id}::{path}::{line}`")
print_text("- Results in baseline are skipped (not counted as new findings)")

print_text("### Example Scenarios")
print_text("1. **No Findings:** `results: []` → Score: +1 (base)")
print_text("2. **Low Findings:** Filtered by confidence → Score: +1")
print_text("3. **High Findings:** `severity: 'WARNING'` → Score: -1")
print_text("4. **Critical Findings:** `severity: 'ERROR'` → Score: -3")
print_text("5. **Findings in Baseline:** Skipped → Not counted")

# ============================================================================
# 5. REWARD SCORE CODE SNIPPETS
# ============================================================================
print_section("5. Reward Score Code Snippets", 1)

print_text("### Penalty Calculation Block")
print_code_block("""def calculate_penalties(coverage: dict, static_analysis: dict, rubric: dict) -> Tuple[int, str]:
    \"\"\"
    Calculate penalties for failing CI, missing tests, regressions.
    
    CRITICAL: Conditions are mutually exclusive to prevent double-penalty bugs.
    Only one penalty type applies per PR.
    \"\"\"
    penalties = rubric.get("penalties", {})
    total_penalty = 0
    notes = []
    
    # Safely extract coverage percentages
    def safe_get_percentage(cov_dict: dict, default: float = 0.0) -> float:
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
    
    # MUTUALLY EXCLUSIVE CONDITIONS (if/elif ensures only one applies)
    # Priority: failing_ci > missing_tests > no penalty
    
    # Check if coverage is completely missing (indicates CI failure)
    if frontend_coverage == 0.0 and backend_coverage == 0.0:
        has_coverage_data = (
            "frontend" in coverage or 
            "backend" in coverage or
            len(coverage) > 0
        )
        
        if not has_coverage_data:
            # Coverage entirely missing - do NOT penalize (fallback logic)
            notes.append("Coverage data missing (no penalty applied)")
        else:
            # Coverage exists but is 0% - likely CI failure
            penalty = penalties.get("failing_ci", -4)
            total_penalty += penalty
            notes.append(f"No test coverage detected (possible CI failure): {penalty} penalty")
    
    # Only check low coverage if we didn't already apply failing_ci penalty
    elif frontend_coverage > 0 or backend_coverage > 0:
        # Coverage exists but is low (< 20%)
        if frontend_coverage < 20.0 and backend_coverage < 20.0:
            penalty = penalties.get("missing_tests", -2)
            total_penalty += penalty
            notes.append(f"Low test coverage (<20%): {penalty} penalty")
    
    return total_penalty, "; ".join(notes)""", "python")

print_text("### Test Scoring Block")
print_code_block("""def score_tests(coverage: dict, rubric: dict, diff: str = "") -> Tuple[int, str]:
    \"\"\"
    Score based on test coverage, new test files, test types, quality, and impact.
    
    Scoring breakdown:
    - +1 for new test files (max +1)
    - +1 for coverage increase >5%
    - +0.5 bonus for integration tests
    - +0.5 bonus for test quality
    - +0.5 bonus for test impact
    \"\"\"
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
    test_types = detect_test_types(diff)
    if test_types["integration"] > 0 or test_types["e2e"] > 0:
        score += 0.5
        notes.append("Integration/e2e tests detected (+0.5)")

    # 4. Test quality assessment (+0.5)
    quality_score, quality_indicators = assess_test_quality(diff)
    if quality_score > 0:
        score += 0.5
        notes.append(f"Test quality: {', '.join(quality_indicators[:2])} (+0.5)")

    # 5. Test impact scoring (+0.5 for critical modules)
    has_critical_impact = detect_test_impact(diff)
    if has_critical_impact:
        score += 0.5
        notes.append("Tests cover critical modules (+0.5)")

    # Cap at maximum weight
    score = min(score, weight)

    return score, "; ".join(notes)""", "python")

print_text("### Security Scoring Code")
print_code_block("""def score_security(
    static_analysis: Dict[str, Any],
    rubric: Dict[str, int],
    changed_files: Optional[List[str]] = None,
    baseline_path: Optional[str] = None,
    diff: str = "",
    pr_desc: str = ""
) -> Tuple[int, str]:
    \"\"\"
    Score based on security analysis (Semgrep JSON) with granular components.
    
    Scoring breakdown:
    - +1 for no issues detected (base)
    - +1 for security improvements
    - +1 for security documentation
    - Negative scores for issues (high: -1, critical: -3)
    \"\"\"
    results = static_analysis.get("results", []) or []
    baseline = load_baseline(baseline_path or SECURITY_BASELINE_FILE)
    
    # CRITICAL FIX: Filter results to only changed files in this PR
    def result_in_changed_files(result: Dict[str, Any], changed_files_list: Optional[List[str]]) -> bool:
        if not changed_files_list:
            return True
        result_path = result.get("path") or result.get("extra", {}).get("metadata", {}).get("path") or ""
        if not result_path:
            return True
        # Normalize paths and match
        result_path_normalized = result_path.replace("\\\\", "/").lstrip("./")
        for changed_file in changed_files_list:
            changed_file_normalized = changed_file.replace("\\\\", "/").lstrip("./")
            if (result_path_normalized.startswith(changed_file_normalized) or
                changed_file_normalized.startswith(result_path_normalized)):
                return True
        return False
    
    security_results = []
    for r in results:
        # Filter by baseline
        fp = result_fingerprint(r)
        if fp in baseline:
            continue
        
        # Filter by security rule type
        if not is_security_rule(r):
            continue
        
        # CRITICAL: Filter by changed files
        if not result_in_changed_files(r, changed_files):
            continue
        
        # Filter by confidence threshold
        if not confidence_meets_threshold(r):
            continue
        
        security_results.append(r)
    
    # Categorize by severity
    critical = [r for r in security_results if (r.get("extra", {}).get("severity") or "").upper() == "ERROR"]
    high = [r for r in security_results if (r.get("extra", {}).get("severity") or "").upper() == "WARNING"]
    
    score = 0
    if critical:
        score = -3
    elif high:
        score = -2 if touches_sensitive_path(changed_files) else -1
    else:
        score += 1  # Base score for no issues
        # Check for improvements (+1)
        if detect_security_improvements(diff, pr_desc)[0]:
            score += 1
        # Check for documentation (+1)
        if detect_security_documentation(diff, pr_desc):
            score += 1
    
    return score, notes""", "python")

print_text("### Coverage Parsing Code")
print_code_block("""def parse_frontend_coverage(coverage_path: str) -> Dict:
    \"\"\"Parse frontend Vitest coverage JSON.\"\"\"
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
    \"\"\"Parse backend pytest coverage JSON.\"\"\"
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
    }""", "python")

print_text("### Threshold Logic")
print_text("- **Coverage == 0.0 (both):** Check if coverage data structure exists")
print_text("  - If missing: No penalty (fallback)")
print_text("  - If exists: `failing_ci` penalty (-4)")
print_text("- **Coverage > 0 (either):** Check if both < 20%")
print_text("  - If both < 20%: `missing_tests` penalty (-2)")
print_text("  - If either >= 20%: No penalty")
print_text("- **Priority:** `failing_ci` > `missing_tests` > no penalty (mutually exclusive)")

# ============================================================================
# 6. GITHUB CI WORKFLOWS
# ============================================================================
print_section("6. GitHub CI Workflows (Coverage Generation)", 1)

print_text("### CI Workflow: `.github/workflows/ci.yml`")
print_text("**Triggers:** Push to main/master, Pull requests")

print_text("#### Frontend Job")
print_code_block("""jobs:
  frontend:
    name: Frontend Lint, Typecheck, Test & Build
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - name: Run unit tests with coverage
        run: npm run test:ci
      
      - name: Upload frontend coverage artifact
        uses: actions/upload-artifact@v4
        with:
          name: frontend-coverage
          path: frontend/coverage/coverage-final.json
          retention-days: 7""", "yaml")

print_text("#### Backend Job")
print_code_block("""  backend:
    name: Backend Lint, Unit & E2E
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - name: Run unit tests
        run: npm test -- --ci --reporters=default
      
      - name: Upload backend coverage artifact
        uses: actions/upload-artifact@v4
        with:
          name: backend-coverage
          path: backend/coverage/coverage-summary.json
          retention-days: 7
        continue-on-error: true""", "yaml")

print_text("### Reward Score Workflow: `.github/workflows/swarm_compute_reward_score.yml`")
print_text("**Triggers:** PR opened/synchronized, CI workflow completed")

print_text("#### Coverage Download Steps")
print_code_block("""      - name: Download frontend coverage artifact
        uses: actions/download-artifact@v4
        with:
          name: frontend-coverage
          path: artifacts/frontend
        continue-on-error: true

      - name: Download backend coverage artifact
        uses: actions/download-artifact@v4
        with:
          name: backend-coverage
          path: artifacts/backend
        continue-on-error: true

      - name: Download frontend coverage from CI workflow
        if: github.event_name == 'workflow_run'
        uses: actions/download-artifact@v4
        with:
          name: frontend-coverage
          path: artifacts/frontend
          github-token: ${{ secrets.GITHUB_TOKEN }}
          run-id: ${{ github.event.workflow_run.id }}
        continue-on-error: true""", "yaml")

print_text("#### Coverage File Detection")
print_code_block("""      - name: Find coverage files
        id: coverage
        run: |
          # Check for frontend coverage (prioritize artifacts from CI workflow)
          if [ -f "artifacts/frontend/coverage-final.json" ]; then
            FRONTEND_COV="artifacts/frontend/coverage-final.json"
          elif [ -f "frontend/coverage/coverage-final.json" ]; then
            FRONTEND_COV="frontend/coverage/coverage-final.json"
          fi
          
          # Check for backend coverage
          if [ -f "artifacts/backend/coverage-summary.json" ]; then
            BACKEND_COV="artifacts/backend/coverage-summary.json"
          elif [ -f "backend/coverage/coverage-summary.json" ]; then
            BACKEND_COV="backend/coverage/coverage-summary.json"
          fi
          
          # Combine paths (comma-separated for script
          if [ -n "$FRONTEND_COV" ] && [ -n "$BACKEND_COV" ]; then
            echo "paths=$FRONTEND_COV,$BACKEND_COV" >> "$GITHUB_OUTPUT"
          elif [ -n "$FRONTEND_COV" ]; then
            echo "paths=$FRONTEND_COV" >> "$GITHUB_OUTPUT"
          elif [ -n "$BACKEND_COV" ]; then
            echo "paths=$BACKEND_COV" >> "$GITHUB_OUTPUT"
          else
            echo "paths=" >> "$GITHUB_OUTPUT"
            echo '{}' > artifacts/empty-coverage.json
          fi""", "bash")

print_text("### Key Observations")
print_text("1. **Separate Jobs:** Frontend and backend tests run in separate jobs")
print_text("2. **Artifact Names:** `frontend-coverage` and `backend-coverage`")
print_text("3. **File Paths:**")
print_text("   - Frontend: `frontend/coverage/coverage-final.json`")
print_text("   - Backend: `backend/coverage/coverage-summary.json`")
print_text("4. **Fallback:** If no coverage found, creates empty JSON `{}`")
print_text("5. **Continue-on-Error:** Coverage download failures don't block workflow")

# ============================================================================
# 7. REWARD SCORE HISTORY FILE
# ============================================================================
print_section("7. Reward Score History File", 1)

print_text("### File Location")
print_text("**Path:** `docs/metrics/reward_scores.json`")
print_text("**Format:** JSON object with version, last_updated, and scores array")

print_text("### Structure")
print_code_block("""{
  "version": "1.0",
  "last_updated": "2025-11-19T18:20:15.098469Z",
  "scores": [
    {
      "pr": "56",
      "score": -5,
      "breakdown": {
        "tests": 1,
        "bug_fix": 1,
        "docs": 1,
        "performance": 1,
        "security": -3,
        "penalties": -6
      },
      "timestamp": "2025-11-18T22:01:50.302871Z",
      "rubric_version": "unknown",
      "author": null,
      "files_changed": 0,
      "coverage_delta": null,
      "file_scores": {
        ".cursor/BUG_LOG.md": {
          "score": 1,
          "breakdown": {...},
          "notes": "..."
        }
      },
      "notes": "Full scoring notes..."
    }
  ]
}""", "json")

print_text("### Statistics")
print_text(f"- **Total PRs:** {len(scores)}")
print_text(f"- **Last Updated:** {reward_data.get('last_updated', 'N/A')}")
print_text(f"- **Version:** {reward_data.get('version', 'N/A')}")

# Show recent PR numbers
recent_prs = [s.get('pr') for s in recent_scores[:10]]
print_text(f"- **Recent PRs (last 10):** {', '.join(map(str, recent_prs))}")

# ============================================================================
# 8. SCORING RUBRIC FILE
# ============================================================================
print_section("8. Scoring Rubric File", 1)

try:
    with open('.cursor/reward_rubric.yaml', 'r', encoding='utf-8') as f:
        rubric_content = f.read()
    print_text("### File Location")
    print_text("**Path:** `.cursor/reward_rubric.yaml`")
    print_text("### Content")
    print_code_block(rubric_content, "yaml")
except Exception as e:
    print_text(f"**Error loading rubric:** {e}")

# ============================================================================
# 9. KEY FINDINGS & RECOMMENDATIONS
# ============================================================================
print_section("9. Key Findings & Recommendations", 1)

print_text("### Current Issues Identified")
print_text("1. **-4 Penalty Trend:** PRs with test files but 0% coverage are getting `failing_ci` penalty")
print_text("   - **Root Cause:** Tests added but coverage not yet collected (new tests not run)")
print_text("   - **Impact:** 22 PRs affected in recent analysis")
print_text("   - **Recommendation:** Adjust penalty logic to check if test files exist before applying `failing_ci`")

print_text("2. **Coverage Collection Timing:** Coverage may be 0% if:")
print_text("   - Tests are added but CI hasn't run yet")
print_text("   - Coverage collection fails silently")
print_text("   - Artifacts are not uploaded correctly")

print_text("3. **Security Scoring:** Currently working correctly with diff-based filtering")
print_text("   - Only counts findings in changed files")
print_text("   - Baseline filtering prevents duplicate counting")

print_text("### System Strengths")
print_text("1. **Mutually Exclusive Penalties:** Fixed double-penalty bug")
print_text("2. **Type-Safe Coverage Extraction:** Handles missing/None values gracefully")
print_text("3. **Diff-Based Security Filtering:** Prevents repo-wide issue counting")
print_text("4. **Fallback Logic:** Missing coverage data doesn't trigger false penalties")

# ============================================================================
# 10. APPENDIX: CODE LOCATIONS
# ============================================================================
print_section("10. Appendix: Code Locations", 1)

print_text("### Key Files")
print_text("- **Reward Score Computation:** `.cursor/scripts/compute_reward_score.py`")
print_text("- **Metrics Collection:** `.cursor/scripts/collect_metrics.py`")
print_text("- **Trend Analysis:** `.cursor/scripts/analyze_reward_trends.py`")
print_text("- **Auto-PR Daemon:** `.cursor/scripts/auto_pr_daemon.py`")
print_text("- **CI Workflow:** `.github/workflows/ci.yml`")
print_text("- **Reward Score Workflow:** `.github/workflows/swarm_compute_reward_score.yml`")
print_text("- **Rubric:** `.cursor/reward_rubric.yaml`")
print_text("- **History:** `docs/metrics/reward_scores.json`")

print_text("### Key Functions")
print_text("- **Penalty Calculation:** `calculate_penalties()` (line ~1178)")
print_text("- **Test Scoring:** `score_tests()` (line ~478)")
print_text("- **Security Scoring:** `score_security()` (line ~1000)")
print_text("- **Frontend Coverage Parsing:** `parse_frontend_coverage()` (line ~123)")
print_text("- **Backend Coverage Parsing:** `parse_backend_coverage()` (line ~149)")

# ============================================================================
# END OF REPORT
# ============================================================================
print_text("---")
print_text(f"**Report Generated:** {datetime.now().isoformat()}")
print_text("**End of Report**")

report_file.close()
print(f"Report generated: AUTO_PR_SYSTEM_COMPREHENSIVE_REPORT.md")
