#!/usr/bin/env python3
"""
Configuration Validator for Auto-PR Session Management
Validates session_config.yaml for correctness.

Last Updated: 2025-12-04
"""

import sys
import re
from pathlib import Path
from typing import Dict, List, Tuple

try:
    import yaml
except ImportError:
    print("ERROR: pyyaml package required. Install with: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

# Import structured logger
try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="validate_config")
    trace_context = get_or_create_trace_context()
except ImportError:
    import logging
    logger = logging.getLogger("validate_config")
    trace_context = {"traceId": None, "spanId": None, "requestId": None}

CONFIG_FILE = Path(".cursor/config/session_config.yaml")


def validate_yaml_syntax(config_path: Path) -> Tuple[bool, str]:
    """Validate YAML syntax."""
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            yaml.safe_load(f)
        return True, ""
    except yaml.YAMLError as e:
        error_msg = f"Invalid YAML syntax: {e}"
        logger.error(
            error_msg,
            operation="validate_yaml_syntax",
            config_path=str(config_path),
            **trace_context
        )
        return False, error_msg
    except Exception as e:
        error_msg = f"Error reading config file: {e}"
        logger.error(
            error_msg,
            operation="validate_yaml_syntax",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        return False, error_msg


def validate_required_fields(config: Dict) -> Tuple[bool, List[str]]:
    """Validate all required fields are present."""
    required_fields = [
        "timeout_minutes",
        "idle_warning_minutes",
        "auto_pr_patterns",
        "completion_markers",
        "min_files_for_manual",
        "enable_timeout_completion",
        "enable_heuristic_completion"
    ]
    
    missing = []
    for field in required_fields:
        if field not in config:
            missing.append(field)
    
    if missing:
        logger.warn(
            "Missing required fields",
            operation="validate_required_fields",
            missing_fields=missing,
            **trace_context
        )
    
    return len(missing) == 0, missing


def validate_timeout_values(config: Dict) -> Tuple[bool, List[str]]:
    """Validate timeout values are reasonable."""
    errors = []
    
    timeout = config.get("timeout_minutes", 0)
    if not isinstance(timeout, int) or timeout < 5 or timeout > 120:
        errors.append(f"timeout_minutes must be between 5 and 120, got {timeout}")
    
    idle_warning = config.get("idle_warning_minutes", 0)
    if not isinstance(idle_warning, int) or idle_warning < 1 or idle_warning > 60:
        errors.append(f"idle_warning_minutes must be between 1 and 60, got {idle_warning}")
    
    if idle_warning >= timeout:
        errors.append(f"idle_warning_minutes ({idle_warning}) must be less than timeout_minutes ({timeout})")
    
    if errors:
        logger.warn(
            "Invalid timeout values",
            operation="validate_timeout_values",
            errors=errors,
            **trace_context
        )
    
    return len(errors) == 0, errors


def validate_regex_patterns(config: Dict) -> Tuple[bool, List[str]]:
    """Validate regex patterns compile correctly."""
    errors = []
    patterns = config.get("auto_pr_patterns", [])
    
    for i, pattern in enumerate(patterns):
        try:
            re.compile(pattern)
        except re.error as e:
            errors.append(f"Pattern {i+1} '{pattern}' is invalid: {e}")
    
    if errors:
        logger.warn(
            "Invalid regex patterns",
            operation="validate_regex_patterns",
            errors=errors,
            **trace_context
        )
    
    return len(errors) == 0, errors


def validate_config(config_path: Path = CONFIG_FILE) -> Tuple[bool, List[str]]:
    """
    Validate configuration file.
    
    Returns:
        (is_valid, list_of_errors)
    """
    all_errors = []
    
    # Check file exists
    if not config_path.exists():
        error_msg = f"Config file not found: {config_path}"
        logger.error(
            error_msg,
            operation="validate_config",
            config_path=str(config_path),
            **trace_context
        )
        return False, [error_msg]
    
    # Validate YAML syntax
    is_valid, error = validate_yaml_syntax(config_path)
    if not is_valid:
        all_errors.append(error)
        return False, all_errors
    
    # Load config
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            config = yaml.safe_load(f)
        
        if config is None:
            error_msg = "Config file is empty"
            logger.error(
                error_msg,
                operation="validate_config",
                **trace_context
            )
            return False, [error_msg]
        
        # Validate required fields
        is_valid, missing = validate_required_fields(config)
        if not is_valid:
            all_errors.extend([f"Missing required field: {field}" for field in missing])
        
        # Validate timeout values
        is_valid, errors = validate_timeout_values(config)
        if not is_valid:
            all_errors.extend(errors)
        
        # Validate regex patterns
        is_valid, errors = validate_regex_patterns(config)
        if not is_valid:
            all_errors.extend(errors)
        
        if all_errors:
            logger.error(
                "Config validation failed",
                operation="validate_config",
                errors=all_errors,
                **trace_context
            )
            return False, all_errors
        
        logger.info(
            "Config validation passed",
            operation="validate_config",
            **trace_context
        )
        return True, []
    
    except Exception as e:
        error_msg = f"Error validating config: {e}"
        logger.error(
            error_msg,
            operation="validate_config",
            error=str(e),
            error_type=type(e).__name__,
            **trace_context
        )
        return False, [error_msg]


def main():
    """CLI entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Validate session configuration")
    parser.add_argument(
        '--config',
        type=Path,
        default=CONFIG_FILE,
        help='Path to config file'
    )
    parser.add_argument(
        '--exit-code',
        action='store_true',
        help='Exit with non-zero code on validation failure'
    )
    
    args = parser.parse_args()
    
    is_valid, errors = validate_config(args.config)
    
    if is_valid:
        print("✅ Configuration is valid")
        return 0
    else:
        print("❌ Configuration validation failed:")
        for error in errors:
            print(f"  - {error}")
        
        if args.exit_code:
            return 1
        return 0


if __name__ == "__main__":
    sys.exit(main())








