import sys
import json
from pathlib import Path
from datetime import datetime, timezone

project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

from enforcement.core.session_state import load_session, migrate_session_v1_to_v2

print("Phase 3 Session Migration Test")

# Create a v1 session.json (without version field, with old file_hashes structure)
enforcement_dir = project_root / ".cursor" / "enforcement"
enforcement_dir.mkdir(parents=True, exist_ok=True)
session_file = enforcement_dir / "session.json"

# Backup current session
backup_file = enforcement_dir / "session.json.backup"
if session_file.exists():
    import shutil
    shutil.copy2(session_file, backup_file)

# Create v1 session
v1_session = {
    "session_id": "test-migration-session",
    "start_time": "2025-12-03T00:00:00+00:00",
    "last_check": "2025-12-03T00:00:00+00:00",
    "violations": [],
    "checks_passed": [],
    "checks_failed": [],
    "file_hashes": {
        "old_key": "old_hash_value"
    }
    # No version field, no auto_fixes field
}

with open(session_file, 'w') as f:
    json.dump(v1_session, f, indent=2)

# Test migration function directly
migrated = migrate_session_v1_to_v2(v1_session)
print(f"Migration test - version field: {migrated.get('version')}")
print(f"Migration test - file_hashes cleared: {len(migrated.get('file_hashes', {})) == 0}")
print(f"Migration test - auto_fixes field exists: {'auto_fixes' in migrated}")

# Test load_session (should trigger migration)
session, tracker = load_session(enforcement_dir)
print(f"Load session - version: {session.version if hasattr(session, 'version') else 'N/A'}")
print(f"Load session - file_hashes empty: {len(session.file_hashes) == 0}")
print(f"Load session - auto_fixes exists: hasattr(session, 'auto_fixes')")

# Verify session.json was updated
with open(session_file, 'r') as f:
    loaded_data = json.load(f)
    print(f"Session.json version: {loaded_data.get('version')}")
    print(f"Session.json file_hashes empty: {len(loaded_data.get('file_hashes', {})) == 0}")

# Restore backup if it exists
if backup_file.exists():
    shutil.copy2(backup_file, session_file)
    backup_file.unlink()

if migrated.get('version') == 2 and len(migrated.get('file_hashes', {})) == 0 and 'auto_fixes' in migrated:
    print("PASS: Session migration works correctly")
else:
    print("FAIL: Session migration failed")
    sys.exit(1)

