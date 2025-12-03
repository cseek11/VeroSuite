#!/usr/bin/env python3
"""
Check if SSM Compiler features (diagnostics, cache) are enabled.

This script verifies whether the runtime components required for
diagnostics and cache functionality are available.
"""

import sys
import importlib.util
from pathlib import Path

# Add compiler directory to path
compiler_dir = Path(__file__).parent
if str(compiler_dir) not in sys.path:
    sys.path.insert(0, str(compiler_dir))

# Import structured logger
_project_root = Path(__file__).parent.parent.parent.parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

logger_util_path = _project_root / ".cursor" / "scripts" / "logger_util.py"
if logger_util_path.exists():
    spec = importlib.util.spec_from_file_location("logger_util", logger_util_path)
    logger_util = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(logger_util)
    get_logger = logger_util.get_logger
    logger = get_logger("check_features")
else:
    logger = None

def check_diagnostics():
    """Check if diagnostics are enabled."""
    if logger:
        logger.progress("Diagnostics feature check", operation="check_diagnostics", stage="start")
    
    # Check ErrorBus
    try:
        from runtime.error_bus import ErrorBus, ErrorEvent
        error_bus_location = str(Path(__file__).parent / 'runtime' / 'error_bus.py')
        error_bus_available = True
        if logger:
            logger.info(
                "ErrorBus enabled",
                operation="check_diagnostics",
                component="error_bus",
                status="enabled",
                location=error_bus_location
            )
    except ImportError as e:
        error_bus_available = False
        if logger:
            logger.warn(
                "ErrorBus disabled",
                operation="check_diagnostics",
                component="error_bus",
                status="disabled",
                root_cause=str(e),
                error_code="IMPORT_ERROR"
            )
    except (AttributeError, TypeError) as e:
        error_bus_available = False
        if logger:
            logger.error(
                "ErrorBus check failed",
                operation="check_diagnostics",
                component="error_bus",
                status="error",
                error_code="CHECK_ERROR",
                root_cause=str(e)
            )
    except Exception as e:
        error_bus_available = False
        if logger:
            logger.error(
                "Unexpected error checking ErrorBus",
                operation="check_diagnostics",
                component="error_bus",
                status="error",
                error_code="UNEXPECTED_ERROR",
                root_cause=str(e),
                exc_info=True
            )
    
    # Check SymbolTable
    try:
        from runtime.symbol_table import SymbolTable
        symbol_table_location = str(Path(__file__).parent / 'runtime' / 'symbol_table.py')
        symbol_table_available = True
        if logger:
            logger.info(
                "SymbolTable enabled",
                operation="check_diagnostics",
                component="symbol_table",
                status="enabled",
                location=symbol_table_location
            )
    except ImportError as e:
        symbol_table_available = False
        if logger:
            logger.warn(
                "SymbolTable disabled",
                operation="check_diagnostics",
                component="symbol_table",
                status="disabled",
                root_cause=str(e),
                error_code="IMPORT_ERROR"
            )
    except (AttributeError, TypeError) as e:
        symbol_table_available = False
        if logger:
            logger.error(
                "SymbolTable check failed",
                operation="check_diagnostics",
                component="symbol_table",
                status="error",
                error_code="CHECK_ERROR",
                root_cause=str(e)
            )
    except Exception as e:
        symbol_table_available = False
        if logger:
            logger.error(
                "Unexpected error checking SymbolTable",
                operation="check_diagnostics",
                component="symbol_table",
                status="error",
                error_code="UNEXPECTED_ERROR",
                root_cause=str(e),
                exc_info=True
            )
    
    # Check MetricsCollector (optional, but enhances diagnostics)
    try:
        from runtime.metrics import MetricsCollector
        metrics_location = str(Path(__file__).parent / 'runtime' / 'metrics.py')
        metrics_available = True
        if logger:
            logger.info(
                "MetricsCollector enabled",
                operation="check_diagnostics",
                component="metrics_collector",
                status="enabled",
                location=metrics_location,
                optional=True
            )
    except ImportError as e:
        metrics_available = False
        if logger:
            logger.info(
                "MetricsCollector disabled (optional)",
                operation="check_diagnostics",
                component="metrics_collector",
                status="disabled",
                root_cause=str(e),
                optional=True
            )
    except (AttributeError, TypeError) as e:
        metrics_available = False
        if logger:
            logger.error(
                "MetricsCollector check failed",
                operation="check_diagnostics",
                component="metrics_collector",
                status="error",
                error_code="CHECK_ERROR",
                root_cause=str(e)
            )
    except Exception as e:
        metrics_available = False
        if logger:
            logger.error(
                "Unexpected error checking MetricsCollector",
                operation="check_diagnostics",
                component="metrics_collector",
                status="error",
                error_code="UNEXPECTED_ERROR",
                root_cause=str(e),
                exc_info=True
            )
    
    # Overall diagnostics status
    diagnostics_enabled = error_bus_available and symbol_table_available
    if diagnostics_enabled:
        if logger:
            logger.info(
                "Diagnostics fully enabled",
                operation="check_diagnostics",
                stage="summary",
                diagnostics_enabled=True,
                error_tracking=True,
                symbol_tracking=True,
                diagnostics_json=True,
                metrics_collection=metrics_available
            )
    else:
        missing_components = []
        if not error_bus_available:
            missing_components.append("ErrorBus")
        if not symbol_table_available:
            missing_components.append("SymbolTable")
        
        if logger:
            logger.warn(
                "Diagnostics disabled",
                operation="check_diagnostics",
                stage="summary",
                diagnostics_enabled=False,
                missing_components=missing_components,
                diagnostics_json=False
            )
    
    return diagnostics_enabled


def check_cache():
    """Check if cache is enabled."""
    if logger:
        logger.progress("Cache feature check", operation="check_cache", stage="start")
    
    # Check CompileCache
    try:
        from runtime.cache import CompileCache, compute_content_hash, compute_chapter_hash
        cache_location = str(Path(__file__).parent / 'runtime' / 'cache.py')
        cache_available = True
        if logger:
            logger.info(
                "CompileCache enabled",
                operation="check_cache",
                component="compile_cache",
                status="enabled",
                location=cache_location,
                functions_available=["CompileCache", "compute_content_hash", "compute_chapter_hash"]
            )
    except ImportError as e:
        cache_available = False
        if logger:
            logger.warn(
                "CompileCache disabled",
                operation="check_cache",
                component="compile_cache",
                status="disabled",
                root_cause=str(e),
                error_code="IMPORT_ERROR"
            )
    except (AttributeError, TypeError) as e:
        cache_available = False
        if logger:
            logger.error(
                "CompileCache check failed",
                operation="check_cache",
                component="compile_cache",
                status="error",
                error_code="CHECK_ERROR",
                root_cause=str(e)
            )
    except Exception as e:
        cache_available = False
        if logger:
            logger.error(
                "Unexpected error checking CompileCache",
                operation="check_cache",
                component="compile_cache",
                status="error",
                error_code="UNEXPECTED_ERROR",
                root_cause=str(e),
                exc_info=True
            )
    
    # Overall cache status
    if cache_available:
        if logger:
            logger.info(
                "Cache enabled",
                operation="check_cache",
                stage="summary",
                cache_enabled=True,
                incremental_builds=True,
                cache_file=".biblec.state.json",
                recompilation_mode="incremental"
            )
    else:
        if logger:
            logger.warn(
                "Cache disabled",
                operation="check_cache",
                stage="summary",
                cache_enabled=False,
                missing_component="CompileCache module",
                cache_file=False,
                recompilation_mode="full"
            )
    
    return cache_available


def check_runtime_files():
    """Check if runtime files exist."""
    if logger:
        logger.progress("Runtime files check", operation="check_runtime_files", stage="start")
    
    runtime_dir = Path(__file__).parent / "runtime"
    
    files_to_check = [
        ("error_bus.py", "ErrorBus", "Diagnostics"),
        ("symbol_table.py", "SymbolTable", "Diagnostics"),
        ("metrics.py", "MetricsCollector", "Diagnostics (optional)"),
        ("cache.py", "CompileCache", "Cache"),
    ]
    
    file_statuses = []
    for filename, component, feature in files_to_check:
        file_path = runtime_dir / filename
        exists = file_path.exists()
        file_statuses.append({
            "filename": filename,
            "component": component,
            "feature": feature,
            "exists": exists,
            "path": str(file_path)
        })
        
        if logger:
            if exists:
                logger.info(
                    f"Runtime file exists: {filename}",
                    operation="check_runtime_files",
                    filename=filename,
                    component=component,
                    feature=feature,
                    exists=True,
                    file_path=str(file_path)
                )
            else:
                logger.warn(
                    f"Runtime file missing: {filename}",
                    operation="check_runtime_files",
                    filename=filename,
                    component=component,
                    feature=feature,
                    exists=False,
                    file_path=str(file_path),
                    error_code="FILE_MISSING"
                )
    
    if logger:
        logger.info(
            "Runtime files check complete",
            operation="check_runtime_files",
            stage="summary",
            files_checked=len(file_statuses),
            files_exist=sum(1 for f in file_statuses if f["exists"]),
            files_missing=sum(1 for f in file_statuses if not f["exists"]),
            file_statuses=file_statuses
        )


def main():
    """Main entry point."""
    if logger:
        logger.progress("SSM Compiler feature check", operation="main", stage="start")
    
    # Check runtime files
    check_runtime_files()
    
    # Check diagnostics
    diagnostics_enabled = check_diagnostics()
    
    # Check cache
    cache_enabled = check_cache()
    
    # Summary
    if logger:
        logger.progress("Summary", operation="main", stage="summary")
    
    if diagnostics_enabled and cache_enabled:
        if logger:
            logger.info(
                "All features enabled",
                operation="main",
                stage="summary",
                diagnostics_enabled=True,
                cache_enabled=True,
                diagnostics_json=True,
                cache_files=True,
                incremental_builds=True
            )
        return 0
    elif diagnostics_enabled:
        if logger:
            logger.warn(
                "Partial features: diagnostics enabled, cache disabled",
                operation="main",
                stage="summary",
                diagnostics_enabled=True,
                cache_enabled=False,
                diagnostics_json=True,
                cache_files=False,
                error_code="PARTIAL_FEATURES"
            )
        return 1  # Partial features
    elif cache_enabled:
        if logger:
            logger.warn(
                "Partial features: cache enabled, diagnostics disabled",
                operation="main",
                stage="summary",
                diagnostics_enabled=False,
                cache_enabled=True,
                diagnostics_json=False,
                cache_files=True,
                error_code="PARTIAL_FEATURES"
            )
        return 1  # Partial features
    else:
        if logger:
            logger.warn(
                "All features disabled",
                operation="main",
                stage="summary",
                diagnostics_enabled=False,
                cache_enabled=False,
                diagnostics_json=False,
                cache_files=False,
                error_code="ALL_FEATURES_DISABLED"
            )
        return 2  # No features


if __name__ == "__main__":
    sys.exit(main())

