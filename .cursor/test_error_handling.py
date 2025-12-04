import sys
import json
from pathlib import Path

project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

from enforcement.core.session_state import load_session

print("Phase 3 Error Handling Test")

enforcement_dir = project_root / ".cursor" / "enforcement"
enforcement_dir.mkdir(parents=True, exist_ok=True)
session_file = enforcement_dir / "session.json"

# Backup current session
backup_file = enforcement_dir / "session.json.backup"
if session_file.exists():
    import shutil
    shutil.copy2(session_file, backup_file)

# Create corrupt session.json
with open(session_file, 'w') as f:
    f.write("This is not valid JSON{")

# Try to load session (should fallback to new session)
try:
    session, tracker = load_session(enforcement_dir)
    print(f"Error handling - new session created: {session.session_id is not None}")
    print(f"Error handling - session has default fields: {hasattr(session, 'version')}")
    
    # Verify it's a new session (not the corrupt one)
    if session.session_id and session.version == 2:
        print("PASS: Error handling works correctly (fallback to new session)")
    else:
        print("FAIL: Error handling failed")
        sys.exit(1)
except Exception as e:
    print(f"FAIL: Error handling raised exception: {e}")
    sys.exit(1)
finally:
    # Restore backup if it exists
    if backup_file.exists():
        import shutil
        shutil.copy2(backup_file, session_file)
        backup_file.unlink()

