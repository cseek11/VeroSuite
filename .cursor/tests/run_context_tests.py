#!/usr/bin/env python3
"""
Test runner for context management system tests.

Usage:
    python .cursor/tests/run_context_tests.py
    python .cursor/tests/run_context_tests.py --verbose
    python .cursor/tests/run_context_tests.py --coverage
"""

import sys
import subprocess
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))


def run_tests(verbose: bool = False, coverage: bool = False):
    """Run all context management tests."""
    test_files = [
        ".cursor/tests/test_context_preloader_fixes.py",
        ".cursor/tests/test_context_loader_dependencies.py",
        ".cursor/tests/test_predictor_enhancements.py",
        ".cursor/tests/test_integration_context_flow.py"
    ]
    
    cmd = ["python", "-m", "pytest"]
    
    if verbose:
        cmd.append("-v")
    
    if coverage:
        cmd.extend(["--cov=.cursor/context_manager", "--cov-report=html", "--cov-report=term"])
    
    cmd.extend(test_files)
    
    print(f"Running tests: {' '.join(cmd)}")
    result = subprocess.run(cmd, cwd=project_root)
    
    return result.returncode == 0


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Run context management tests")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    parser.add_argument("--coverage", "-c", action="store_true", help="Generate coverage report")
    
    args = parser.parse_args()
    
    success = run_tests(verbose=args.verbose, coverage=args.coverage)
    sys.exit(0 if success else 1)








