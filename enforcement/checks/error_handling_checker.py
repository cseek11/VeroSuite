import re
import fnmatch
from pathlib import Path
from typing import Callable, Dict, List, Optional, Set

from enforcement.core.git_utils import GitUtils
from enforcement.core.violations import Violation, ViolationSeverity
from enforcement.core.scope_evaluator import is_historical_dir_path
from enforcement.core.historical import is_historical_path

try:
    import yaml  # type: ignore
except ImportError:  # pragma: no cover
    yaml = None

try:
    from logger_util import get_logger

    logger = get_logger(context="error_handling_checker")
except ImportError:  # pragma: no cover
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("error_handling_checker")

        def info(self, msg, *args, **kwargs):
            self._logger.info(msg)

        def debug(self, msg, *args, **kwargs):
            self._logger.debug(msg)

        def warn(self, msg, *args, **kwargs):
            self._logger.warning(msg)

        def warning(self, msg, *args, **kwargs):
            self._logger.warning(msg)

        def error(self, msg, *args, **kwargs):
            self._logger.error(msg)

    logger = _FallbackLogger()


class ErrorHandlingChecker:
    """Ensures error-prone operations include proper handling."""

    DEFAULT_CONFIG = {
        "excluded_paths": [
            ".cursor__archived_2025-04-12/**",
            "docs/archive/**",
            "docs/historical/**",
        ],
        "safe_async_wrappers": [],
        "safe_subprocess_wrappers": [],
        "max_warnings_per_file": 5,
    }

    _cached_config: Optional[Dict[str, object]] = None

    def _load_config(self, project_root: Path) -> Dict[str, object]:
        if self._cached_config is not None:
            return self._cached_config

        config = dict(self.DEFAULT_CONFIG)
        config_path = project_root / ".cursor" / "enforcement" / "error_handling.yaml"

        if yaml and config_path.exists():
            try:
                with open(config_path, "r", encoding="utf-8", errors="ignore") as f:
                    data = yaml.safe_load(f) or {}
                    if isinstance(data, dict):
                        config.update({k: v for k, v in data.items() if v is not None})
            except Exception as exc:  # pragma: no cover
                logger.warn(
                    f"Failed to load error handling config: {exc}",
                    operation="check_error_handling",
                    error_code="ERROR_HANDLING_CONFIG_FAILED",
                    file_path=str(config_path),
                )
        elif not yaml:
            logger.debug(
                "PyYAML not available; using default error handling config",
                operation="check_error_handling",
            )

        self._cached_config = config
        return config

    def _is_excluded_path(self, path_str: str, excluded_patterns: List[str]) -> bool:
        normalized = path_str.replace("\\", "/")
        if is_historical_dir_path(normalized) or is_historical_path(normalized):
            return True
        return any(fnmatch.fnmatch(normalized, pattern) for pattern in excluded_patterns)

    def _is_context_managed_open(self, lines: List[str], zero_based_index: int) -> bool:
        line = lines[zero_based_index]
        if "with" in line and "open(" in line and line.find("with") < line.find("open("):
            return True
        for offset in (1, 2):
            if zero_based_index - offset < 0:
                break
            prev_line = lines[zero_based_index - offset]
            if prev_line.strip().startswith("with ") and "open(" in prev_line:
                return True
        return False

    def _has_error_handling(
        self,
        context: str,
        error_handling_patterns: List[str],
        logging_patterns: List[str],
    ) -> bool:
        for pattern in error_handling_patterns + logging_patterns:
            if re.search(pattern, context, re.MULTILINE):
                return True
        return False

    def check_error_handling(
        self,
        changed_files: List[str],
        project_root: Path,
        git_utils: GitUtils,
        is_file_modified_in_session_func: Callable[[str], bool],
        classification_map: Optional[Dict[str, str]] = None,
    ) -> List[Violation]:
        violations: List[Violation] = []
        config = self._load_config(project_root)

        excluded_paths = [p for p in config.get("excluded_paths", []) or []]
        safe_async_wrappers = set(config.get("safe_async_wrappers", []) or [])
        safe_subprocess_wrappers = set(config.get("safe_subprocess_wrappers", []) or [])
        max_warnings_per_file = int(config.get("max_warnings_per_file", 5) or 5)

        logger.debug(
            "Running error handling checker",
            operation="check_error_handling",
            changed_files=len(changed_files),
            git_root=str(getattr(git_utils, "project_root", project_root)),
        )

        allowed_types = {"CONTENT_CHANGED", "NEW_FILE"}
        session_modified_files = []
        for f in changed_files:
            if classification_map and classification_map.get(f) not in allowed_types:
                continue
            if is_file_modified_in_session_func(f):
                session_modified_files.append(f)

        error_prone_patterns = [
            (r'await\s+(\w+)\(', "await"),
            (r'subprocess\.(run|call|Popen)', "subprocess"),
            (r'open\(', "open"),
        ]

        for file_path_str in session_modified_files:
            if self._is_excluded_path(str(file_path_str), excluded_paths):
                logger.debug(
                    "Skipping file due to historical/excluded path",
                    operation="check_error_handling",
                    file_path=file_path_str,
                )
                continue

            file_path = project_root / file_path_str

            if not file_path.exists() or file_path.suffix not in ['.py', '.ts', '.tsx', '.js', '.jsx']:
                continue

            is_python = file_path.suffix == '.py'
            is_typescript_js = file_path.suffix in ['.ts', '.tsx', '.js', '.jsx']

            if is_python:
                error_handling_patterns = [r'try\s*:', r'try\s*\n']
            elif is_typescript_js:
                error_handling_patterns = [r'try\s*\{', r'try\s*\n\s*\{', r'catch\s*\(', r'catch\s*\{']
            else:
                error_handling_patterns = []

            logging_patterns = [
                r'logger\.error',
                r'logger\.exception',
                r'logging\.(error|exception)',
                r'console\.error',
                r'console\.warn',
            ]

            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    lines = list(f)

                seen: Set[tuple] = set()
                violations_for_file: List[Violation] = []

                for pattern, pattern_key in error_prone_patterns:
                    compiled = re.compile(pattern)
                    for line_num, line in enumerate(lines, 1):
                        match = compiled.search(line)
                        if not match:
                            continue

                        if pattern_key == "open" and self._is_context_managed_open(lines, line_num - 1):
                            continue

                        if pattern_key == "await":
                            func_name = match.group(1) if match.lastindex else None
                            if func_name and func_name in safe_async_wrappers:
                                continue

                        if pattern_key == "subprocess":
                            if any(wrapper in line for wrapper in safe_subprocess_wrappers):
                                continue

                        context_window = 20
                        context_start = max(0, line_num - context_window)
                        context_end = min(len(lines), line_num + context_window)
                        context = '\n'.join(lines[context_start:context_end])

                        has_error_handling = self._has_error_handling(
                            context,
                            error_handling_patterns,
                            logging_patterns,
                        )

                        if has_error_handling:
                            continue

                        violation_key = (file_path_str, line_num, pattern_key)
                        if violation_key in seen:
                            continue

                        if len(violations_for_file) >= max_warnings_per_file:
                            break

                        seen.add(violation_key)
                        violations_for_file.append(
                            Violation(
                                severity=ViolationSeverity.WARNING,
                                rule_ref="06-error-resilience.mdc",
                                message=f"Error-prone operation without error handling: {pattern}",
                                file_path=str(file_path),
                                line_number=line_num,
                                session_scope="current_session",
                            )
                        )

                    if len(violations_for_file) >= max_warnings_per_file:
                        break

                violations.extend(violations_for_file)

            except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError) as exc:
                logger.warn(
                    f"Failed to check file for error handling: {exc}",
                    operation="check_error_handling",
                    error_code="ERROR_HANDLING_CHECK_FAILED",
                    file_path=str(file_path),
                )

        if violations:
            logger.debug(
                "Error handling violations detected",
                operation="check_error_handling",
                total=len(violations),
            )

        return violations

