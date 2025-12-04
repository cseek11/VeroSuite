import sys
from pathlib import Path
from datetime import datetime, timezone

project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

from enforcement.core.session_state import EnforcementSession, prune_session_data

print("Phase 3 Session Pruning Test")

# Create a session with >2000 violations
violations = [{"severity": "WARNING", "rule_ref": "test", "message": f"Test violation {i}"} for i in range(2500)]
checks_passed = [f"check_{i}" for i in range(600)]
checks_failed = [f"failed_{i}" for i in range(600)]
file_hashes = {f"file_{i}": f"hash_{i}" for i in range(15000)}

session = EnforcementSession(
    session_id="test-pruning-session",
    start_time=datetime.now(timezone.utc).isoformat(),
    last_check=datetime.now(timezone.utc).isoformat(),
    violations=violations,
    checks_passed=checks_passed,
    checks_failed=checks_failed,
    auto_fixes=[],
    file_hashes=file_hashes,
    version=2
)

print(f"Before pruning - violations: {len(session.violations)}")
print(f"Before pruning - checks_passed: {len(session.checks_passed)}")
print(f"Before pruning - checks_failed: {len(session.checks_failed)}")
print(f"Before pruning - file_hashes: {len(session.file_hashes)}")

# Prune the session
prune_session_data(session)

print(f"After pruning - violations: {len(session.violations)}")
print(f"After pruning - checks_passed: {len(session.checks_passed)}")
print(f"After pruning - checks_failed: {len(session.checks_failed)}")
print(f"After pruning - file_hashes: {len(session.file_hashes)}")

# Verify limits
MAX_VIOLATIONS = 2000
MAX_CHECKS = 500
MAX_FILE_HASHES = 10000

if (len(session.violations) == MAX_VIOLATIONS and
    len(session.checks_passed) == MAX_CHECKS and
    len(session.checks_failed) == MAX_CHECKS and
    len(session.file_hashes) == MAX_FILE_HASHES):
    print("PASS: Session pruning works correctly")
else:
    print(f"Expected: violations={MAX_VIOLATIONS}, checks_passed={MAX_CHECKS}, checks_failed={MAX_CHECKS}, file_hashes={MAX_FILE_HASHES}")
    print(f"Actual: violations={len(session.violations)}, checks_passed={len(session.checks_passed)}, checks_failed={len(session.checks_failed)}, file_hashes={len(session.file_hashes)}")
    print("FAIL: Session pruning failed")
    sys.exit(1)

