import re
from pathlib import Path
from typing import Callable, List

from enforcement.core.git_utils import GitUtils
from enforcement.core.violations import Violation, ViolationSeverity

try:
    from logger_util import get_logger

    logger = get_logger(context="python_bible_checker")
except ImportError:  # pragma: no cover
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("python_bible_checker")

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


class PythonBibleChecker:
    """Validates Python Bible compliance in modified Python files."""

    def check_python_bible(
        self,
        changed_files: List[str],
        project_root: Path,
        git_utils: GitUtils,
        is_file_modified_in_session_func: Callable[[str], bool],
    ) -> List[Violation]:
        violations: List[Violation] = []

        session_modified_files = [
            f
            for f in changed_files
            if is_file_modified_in_session_func(f)
        ]
        python_files = [f for f in session_modified_files if f.endswith('.py')]

        logger.debug(
            "Running Python Bible checker",
            operation="check_python_bible",
            python_files=len(python_files),
            git_root=str(getattr(git_utils, "project_root", project_root)),
        )

        for file_path_str in python_files:
            file_path = project_root / file_path_str
            if not file_path.exists():
                continue

            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    for line_num, line in enumerate(f, 1):
                        if re.search(r'def\s+\w+\([^)]*=\s*\[', line):
                            violations.append(
                                Violation(
                                    severity=ViolationSeverity.WARNING,
                                    rule_ref="python_bible.mdc",
                                    message="Mutable default argument detected (use None instead)",
                                    file_path=str(file_path),
                                    line_number=line_num,
                                    session_scope="current_session",
                                )
                            )
                        if re.search(r'except\s*:', line):
                            violations.append(
                                Violation(
                                    severity=ViolationSeverity.WARNING,
                                    rule_ref="python_bible.mdc",
                                    message="Bare except clause detected (specify exception type)",
                                    file_path=str(file_path),
                                    line_number=line_num,
                                    session_scope="current_session",
                                )
                            )
            except (FileNotFoundError, PermissionError, OSError, UnicodeDecodeError) as exc:
                logger.warn(
                    f"Failed to check file for Python Bible compliance: {exc}",
                    operation="check_python_bible",
                    error_code="PYTHON_BIBLE_CHECK_FAILED",
                    file_path=str(file_path),
                )

        return violations

