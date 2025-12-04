#!/usr/bin/env python3
"""Test script to verify Phase 1 extracted modules can be imported."""
import sys
from pathlib import Path

# Add project root to path (same as auto-enforcer.py)
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor"))

try:
    from enforcement.core.violations import Violation, ViolationSeverity, AutoFix
    from enforcement.core.session_state import EnforcementSession
    from enforcement.core.scope_evaluator import is_historical_dir_path
    print("Imports OK")
    sys.exit(0)
except ImportError as e:
    print(f"Import error: {e}")
    sys.exit(1)

