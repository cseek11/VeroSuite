#!/usr/bin/env python3
"""
OPA Binary Finder - Universal Helper for All Agents

Finds OPA binary location reliably across all chat sessions and platforms.
Can be used as a standalone script or imported as a module.

Usage:
    # As standalone script (prints path or exits with error)
    python .cursor/scripts/find-opa.py
    
    # As Python module
    from .cursor.scripts.find_opa import find_opa_binary
    opa_path = find_opa_binary()
    
Last Updated: 2025-12-04
"""

import os
import sys
import subprocess
import importlib.util
from pathlib import Path
from typing import Optional

# Import structured logger
_project_root = Path(__file__).parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

logger_util_path = _project_root / ".cursor" / "scripts" / "logger_util.py"
if logger_util_path.exists():
    spec = importlib.util.spec_from_file_location("logger_util", logger_util_path)
    logger_util = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(logger_util)
    get_logger = logger_util.get_logger
    logger = get_logger("find_opa")
else:
    logger = None


def find_opa_binary(project_root: Optional[Path] = None) -> Optional[str]:
    """
    Find OPA binary in common locations.
    
    Search order:
    1. OPA_BINARY environment variable
    2. Project location: services/opa/bin/opa.exe (Windows) or services/opa/bin/opa (Unix)
    3. System PATH (which opa)
    
    Args:
        project_root: Optional project root path (default: auto-detect from script location)
        
    Returns:
        Path to OPA binary if found, None otherwise
    """
    # Auto-detect project root if not provided
    if project_root is None:
        # Try to find project root from script location
        script_dir = Path(__file__).parent
        # Script is in .cursor/scripts/, so project root is 2 levels up
        project_root = script_dir.parent.parent
    
    # 1. Check environment variable (highest priority)
    if 'OPA_BINARY' in os.environ:
        opa_path = Path(os.environ['OPA_BINARY'])
        if opa_path.exists():
            return str(opa_path.resolve())
        # Warn if env var is set but file doesn't exist
        if logger:
            logger.warn(
                "OPA_BINARY environment variable set but file not found",
                operation="find_opa_binary",
                error_code="ENV_VAR_FILE_NOT_FOUND",
                root_cause=f"OPA_BINARY env var set to {opa_path} but file does not exist",
                opa_binary_path=str(opa_path)
            )
    
    # 2. Check project location (primary location)
    # Windows
    project_opa_win = project_root / 'services' / 'opa' / 'bin' / 'opa.exe'
    if project_opa_win.exists():
        return str(project_opa_win.resolve())
    
    # Unix/Linux/Mac
    project_opa_unix = project_root / 'services' / 'opa' / 'bin' / 'opa'
    if project_opa_unix.exists():
        return str(project_opa_unix.resolve())
    
    # 3. Check system PATH (fallback)
    try:
        if os.name == 'nt':  # Windows
            result = subprocess.run(['where', 'opa'], capture_output=True, text=True, timeout=2)
        else:  # Unix/Linux/Mac
            result = subprocess.run(['which', 'opa'], capture_output=True, text=True, timeout=2)
        
        if result.returncode == 0:
            opa_path = result.stdout.strip().split('\n')[0]  # Take first result
            if Path(opa_path).exists():
                return opa_path
    except (subprocess.TimeoutExpired, FileNotFoundError, Exception):
        # which/where command not available or failed - ignore
        pass
    
    return None


def verify_opa_binary(opa_path: str) -> bool:
    """
    Verify OPA binary works by running 'opa version'.
    
    Args:
        opa_path: Path to OPA binary
        
    Returns:
        True if OPA works, False otherwise
    """
    try:
        result = subprocess.run(
            [opa_path, 'version'],
            capture_output=True,
            text=True,
            timeout=5
        )
        return result.returncode == 0
    except (subprocess.TimeoutExpired, FileNotFoundError, Exception):
        return False


def main():
    """Main entry point for standalone script."""
    # Find OPA
    opa_path = find_opa_binary()
    
    if not opa_path:
        if logger:
            logger.error(
                "OPA binary not found",
                operation="main",
                error_code="OPA_NOT_FOUND",
                root_cause="OPA binary not found in any standard location",
                solutions=[
                    "Install OPA in services/opa/bin/ (Windows: opa.exe, Linux/Mac: opa)",
                    "Set OPA_BINARY environment variable",
                    "Install OPA system-wide and add to PATH"
                ],
                documentation="docs/compliance-reports/OPA-INSTALLATION-NOTES.md"
            )
        sys.exit(1)
    
    # Verify it works
    if not verify_opa_binary(opa_path):
        if logger:
            logger.error(
                "OPA binary verification failed",
                operation="main",
                error_code="OPA_VERIFICATION_FAILED",
                root_cause=f"OPA binary found at {opa_path} but 'opa version' command failed",
                opa_path=opa_path
            )
        sys.exit(1)
    
    # Output path (for use in scripts) - use logger.info for structured output
    if logger:
        logger.info(
            "OPA binary found",
            operation="main",
            opa_path=opa_path
        )
    # Also print to stdout for script compatibility
    print(opa_path)
    return 0


if __name__ == '__main__':
    sys.exit(main())


