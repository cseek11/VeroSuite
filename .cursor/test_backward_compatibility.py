import sys
import json
from pathlib import Path
from datetime import datetime, timezone

project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

from enforcement.core.session_state import load_session

print("Phase 3 Backward Compatibility Test")

enforcement_dir = project_root / ".cursor" / "enforcement"
enforcement_dir.mkdir(parents=True, exist_ok=True)
session_file = enforcement_dir / "session.json"

# Backup current session
backup_file = enforcement_dir / "session.json.backup"
if session_file.exists():
    import shutil
    shutil.copy2(session_file, backup_file)

# Create session without auto_fixes and file_hashes (old format)
# Note: checks_passed and checks_failed are required fields, so we include them
old_session = {
    "session_id": "test-backward-compat",
    "start_time": "2025-12-03T00:00:00+00:00",
    "last_check": "2025-12-03T00:00:00+00:00",
    "violations": [],
    "checks_passed": [],
    "checks_failed": []
    # No auto_fixes, no file_hashes, no version (these should be added by load_session)
}

with open(session_file, 'w') as f:
    json.dump(old_session, f, indent=2)

# Load session (should add defaults)
session, tracker = load_session(enforcement_dir)

print(f"Backward compat - auto_fixes exists: {hasattr(session, 'auto_fixes')}")
print(f"Backward compat - file_hashes exists: {hasattr(session, 'file_hashes')}")
print(f"Backward compat - version exists: {hasattr(session, 'version')}")

# Verify defaults were added
if (hasattr(session, 'auto_fixes') and 
    hasattr(session, 'file_hashes') and 
    hasattr(session, 'version') and
    isinstance(session.auto_fixes, list) and
    isinstance(session.file_hashes, dict)):
    print("PASS: Backward compatibility works correctly")
else:
    print("FAIL: Backward compatibility failed")
    sys.exit(1)

# Restore backup if it exists
if backup_file.exists():
    import shutil
    shutil.copy2(backup_file, session_file)
    backup_file.unlink()

