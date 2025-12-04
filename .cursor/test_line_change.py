#!/usr/bin/env python3
"""Test line change detection by creating a test file."""
import sys
from pathlib import Path
from datetime import datetime, timezone

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

from enforcement.core.git_utils import GitUtils

# Create a test file
test_file = project_root / ".cursor" / "test_line_change_file.txt"
test_file.parent.mkdir(parents=True, exist_ok=True)
test_file.write_text("Line 1\nLine 2\nLine 3\nLine 4\nLine 5\n")

# Get session start time
session_start = datetime.now(timezone.utc)

# Wait a moment
import time
time.sleep(0.1)

# Modify line 3
test_file.write_text("Line 1\nLine 2\nLine 3 MODIFIED\nLine 4\nLine 5\n")

# Test line change detection
git_utils = GitUtils(project_root)
file_path = str(test_file.relative_to(project_root))

# Test modified line
line3_changed = git_utils.is_line_changed_in_session(file_path, 3, session_start)
line1_changed = git_utils.is_line_changed_in_session(file_path, 1, session_start)

print(f"Line 3 (modified) changed: {line3_changed}")
print(f"Line 1 (unchanged) changed: {line1_changed}")

# Cleanup
test_file.unlink()

if line3_changed and not line1_changed:
    print("PASS: Line change detection works correctly")
    sys.exit(0)
else:
    print("FAIL: Line change detection incorrect")
    sys.exit(1)

