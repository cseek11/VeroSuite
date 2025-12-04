#!/usr/bin/env python3
"""Test script to verify Phase 2 extracted GitUtils can be imported."""
import sys
from pathlib import Path

# Add project root to path (same as auto-enforcer.py)
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

try:
    from enforcement.core.git_utils import GitUtils
    print("Imports OK")
    sys.exit(0)
except ImportError as e:
    print(f"Import error: {e}")
    sys.exit(1)

