import sys
import os
from pathlib import Path
from datetime import datetime, timezone
import time

project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

from enforcement.core.session_state import EnforcementSession, get_file_hash, load_session
from enforcement.core.file_scanner import is_file_modified_in_session
from enforcement.core.git_utils import GitUtils

print("Phase 3 File Modification Detection Test")

# Create a test file
test_file = project_root / ".cursor" / "test_modification_file.txt"
test_file.parent.mkdir(parents=True, exist_ok=True)
test_file.write_text("Original content\n")

# Add to git
os.system(f'git add "{test_file}"')
os.system(f'git commit -m "Add test_modification_file" --no-verify')

# Load session (use existing session, don't create new one that might be missing fields)
enforcement_dir = project_root / ".cursor" / "enforcement"
# The actual session.json should have all required fields, so this should work
session, _ = load_session(enforcement_dir)

# Get initial hash
initial_hash = get_file_hash(test_file, session, project_root)
print(f"Initial hash: {initial_hash[:16]}...")

# Check if file is modified (should be False initially)
git_utils = GitUtils(project_root)
is_modified = is_file_modified_in_session(str(test_file), session, project_root, git_utils)
print(f"File modified (before change): {is_modified}")

# Modify the file
time.sleep(1)  # Ensure mtime changes
test_file.write_text("Modified content\n")

# Check if file is modified (should be True now)
is_modified_after = is_file_modified_in_session(str(test_file), session, project_root, git_utils)
print(f"File modified (after change): {is_modified_after}")

# Get new hash
new_hash = get_file_hash(test_file, session, project_root)
print(f"New hash: {new_hash[:16]}...")

# Clean up
os.system(f'git restore --staged "{test_file}"')
os.system(f'git restore "{test_file}"')
test_file.unlink(missing_ok=True)

if not is_modified and is_modified_after and initial_hash != new_hash:
    print("PASS: File modification detection works correctly")
else:
    print("FAIL: File modification detection failed")
    sys.exit(1)

