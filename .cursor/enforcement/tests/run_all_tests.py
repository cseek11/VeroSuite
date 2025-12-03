"""
Test runner for enforcement tests.
Uses pytest if available, otherwise falls back to manual execution.
"""

import sys
import os
import subprocess
from pathlib import Path

# Add project root to path for imports
project_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(project_root))

def run_with_pytest() -> int:
    """Run tests using pytest (preferred method)."""
    tests_dir = Path(__file__).parent
    
    # Set PYTHONPATH
    env = os.environ.copy()
    python_path = str(project_root)
    if 'PYTHONPATH' in env:
        env['PYTHONPATH'] = f"{python_path}{os.pathsep}{env['PYTHONPATH']}"
    else:
        env['PYTHONPATH'] = python_path
    
    try:
        result = subprocess.run(
            [sys.executable, '-m', 'pytest', str(tests_dir), '-v'],
            cwd=str(project_root),
            env=env,
            timeout=300
        )
        return result.returncode
    except subprocess.TimeoutExpired:
        print("⚠️  Tests timed out after 5 minutes")
        return 1
    except FileNotFoundError:
        # pytest not installed
        return -1

def main():
    """Run all tests using pytest or fallback method."""
    print("=" * 70)
    print("VeroField Enforcement Test Suite")
    print("=" * 70)
    print()
    
    # Try pytest first
    print("Attempting to run tests with pytest...")
    exit_code = run_with_pytest()
    
    if exit_code == -1:
        print("⚠️  pytest not installed. Install with: pip install pytest")
        print("   Or run tests manually: python -m pytest .cursor/enforcement/tests")
        return 1
    elif exit_code == 0:
        print()
        print("✅ All tests passed!")
        return 0
    else:
        print()
        print(f"❌ Some tests failed (exit code: {exit_code})")
        return exit_code

if __name__ == '__main__':
    sys.exit(main())

