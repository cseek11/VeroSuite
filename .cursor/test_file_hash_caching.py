import sys
from pathlib import Path

# Calculate project root correctly (test is in .cursor/, so go up 2 levels)
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

from enforcement.core.session_state import EnforcementSession, get_file_hash, load_session

print("Phase 3 File Hash Caching Test")

# Use an existing file in the repository
test_file = project_root / ".cursor" / "scripts" / "auto-enforcer.py"
print(f"Test file: {test_file}")
print(f"File exists: {test_file.exists()}")
print(f"Project root: {project_root}")

# Load session
enforcement_dir = project_root / ".cursor" / "enforcement"
session, _ = load_session(enforcement_dir)

# Get hash first time (should compute)
hash1 = get_file_hash(test_file, session, project_root)
if hash1 is None:
    print("ERROR: get_file_hash returned None")
    sys.exit(1)
print(f"First hash: {hash1[:16]}...")

# Check if hash was cached
cache_key = f"{test_file}:{test_file.stat().st_mtime}"
cached = cache_key in session.file_hashes
print(f"Hash cached: {cached}")

# Get hash second time (should use cache)
hash2 = get_file_hash(test_file, session, project_root)
print(f"Second hash: {hash2[:16]}...")

# Verify hashes match and caching works
if hash1 == hash2 and cached:
    print("PASS: File hash caching works correctly")
else:
    print(f"FAIL: File hash caching failed (hash1={hash1[:16]}, hash2={hash2[:16]}, cached={cached})")
    sys.exit(1)

