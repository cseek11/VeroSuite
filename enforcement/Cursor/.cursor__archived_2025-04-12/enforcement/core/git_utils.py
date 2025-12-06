import re
import subprocess
from datetime import datetime, timezone
from functools import lru_cache
from pathlib import Path
from typing import Dict, List, Optional

try:
    from logger_util import get_logger
    logger = get_logger(context="auto_enforcer.git_utils")
except ImportError:  # pragma: no cover - fallback for environments without logger_util
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("auto_enforcer.git_utils")

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


@lru_cache(maxsize=256)
def run_git_command_cached(project_root: str, command_tuple: tuple) -> str:
    """
    Cached git command execution.
    
    Args:
        project_root: Project root directory as string
        command_tuple: Git command arguments as tuple (hashable)
    
    Returns:
        Git command output as string
    """
    args = list(command_tuple)
    try:
        result = subprocess.run(
            ['git'] + args,
            cwd=Path(project_root),
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='replace',
            timeout=10,
            check=False
        )
        if result.returncode == 0:
            return result.stdout.strip() if result.stdout else ""
        return ""
    except (subprocess.TimeoutExpired, FileNotFoundError) as e:
        logger.warn(
            "Git command failed",
            operation="run_git_command_cached",
            error_code="GIT_COMMAND_FAILED",
            root_cause=str(e),
            command=" ".join(['git'] + args)
        )
        return ""


def run_git_command(project_root: Path, args: List[str]) -> str:
    """
    Run git command and return output (with caching).
    """
    command_tuple = tuple(args)
    return run_git_command_cached(str(project_root), command_tuple)


def get_git_state_key(project_root: Path) -> str:
    """
    Generate cache key based on git state (HEAD + index hash).
    """
    try:
        head = run_git_command(project_root, ['rev-parse', 'HEAD'])
        index = run_git_command(project_root, ['diff', '--cached', '--name-only'])
        index_hash = str(hash(index)) if index else ''
        return f"{head}:{index_hash}"
    except Exception:
        return f"error:{datetime.now(timezone.utc).isoformat()}"


def get_changed_files_impl(project_root: Path, include_untracked: bool = False) -> List[str]:
    """
    Internal implementation for retrieving changed files from git.
    """
    staged = run_git_command(
        project_root,
        ['diff', '--cached', '--ignore-cr-at-eol', '--ignore-all-space', '--ignore-blank-lines', '--name-only']
    )
    unstaged = run_git_command(
        project_root,
        ['diff', '--ignore-cr-at-eol', '--ignore-all-space', '--ignore-blank-lines', '--name-only']
    )
    
    files = set()
    if staged:
        files.update(staged.split('\n'))
    if unstaged:
        files.update(unstaged.split('\n'))
    
    if include_untracked:
        untracked = run_git_command(project_root, ['ls-files', '--others', '--exclude-standard'])
        if untracked:
            files.update(untracked.split('\n'))
    
    return sorted([f for f in files if f.strip()])


class GitUtils:
    """
    Helper class for git operations with caching support.
    """
    
    def __init__(self, project_root: Path):
        self.project_root = project_root
        self._cached_changed_files: Optional[Dict[str, List[str]]] = None
        self._changed_files_cache_key: Optional[str] = None
        self._file_diff_cache: Dict[str, Optional[str]] = {}
    
    def run_git_command(self, args: List[str]) -> str:
        return run_git_command(self.project_root, args)
    
    def invalidate_cache(self):
        self._cached_changed_files = None
        self._changed_files_cache_key = None
    
    def update_cache(self, cache_key: str):
        self._cached_changed_files = {
            'tracked': get_changed_files_impl(self.project_root, include_untracked=False),
            'untracked': get_changed_files_impl(self.project_root, include_untracked=True)
        }
        self._changed_files_cache_key = cache_key
    
    def get_cache_key(self) -> Optional[str]:
        return self._changed_files_cache_key
    
    def get_cached_changed_files(self) -> Optional[Dict[str, List[str]]]:
        return self._cached_changed_files
    
    def get_changed_files(self, include_untracked: bool = False) -> List[str]:
        if self._cached_changed_files is not None:
            key = 'untracked' if include_untracked else 'tracked'
            if key in self._cached_changed_files:
                logger.debug(
                    f"Using cached changed files ({key})",
                    operation="get_changed_files",
                    cache_key=self._changed_files_cache_key
                )
                return self._cached_changed_files[key]
        
        logger.debug(
            "Cache miss - computing changed files directly",
            operation="get_changed_files",
            include_untracked=include_untracked
        )
        return get_changed_files_impl(self.project_root, include_untracked)
    
    def get_file_diff(self, file_path: str) -> Optional[str]:
        if file_path in self._file_diff_cache:
            logger.debug(
                f"Using cached file diff for {file_path}",
                operation="get_file_diff"
            )
            return self._file_diff_cache[file_path]
        
        try:
            tracked = self.run_git_command(['ls-files', '--error-unmatch', file_path])
            if not tracked:
                self._file_diff_cache[file_path] = None
                return None
            
            staged_diff = self.run_git_command(['diff', '--cached', file_path])
            unstaged_diff = self.run_git_command(['diff', file_path])
            
            combined_diff = ""
            if staged_diff:
                combined_diff += staged_diff
            if unstaged_diff:
                if combined_diff:
                    combined_diff += "\n"
                combined_diff += unstaged_diff
            
            result = combined_diff if combined_diff else None
            self._file_diff_cache[file_path] = result
            logger.debug(
                f"Cached file diff for {file_path}",
                operation="get_file_diff",
                has_diff=result is not None
            )
            return result
        except (subprocess.TimeoutExpired, FileNotFoundError, OSError, ValueError) as e:
            logger.debug(
                f"Git diff failed for {file_path}",
                operation="get_file_diff",
                error_code="GIT_DIFF_FAILED",
                root_cause=str(e)
            )
            self._file_diff_cache[file_path] = None
            return None
    
    def clear_diff_cache(self):
        self._file_diff_cache.clear()
    
    def get_file_last_modified_time(self, file_path: str) -> Optional[datetime]:
        full_path = self.project_root / file_path
        if not full_path.exists():
            return None
        
        tracked = self.run_git_command(['ls-files', '--error-unmatch', file_path])
        
        if tracked:
            last_commit_time = self.run_git_command([
                'log', '-1', '--format=%ct', '--', file_path
            ])
            
            if last_commit_time and last_commit_time.strip():
                try:
                    timestamp = int(last_commit_time.strip())
                    commit_time = datetime.fromtimestamp(timestamp, tz=timezone.utc)
                    
                    unstaged_diff = self.run_git_command(['diff', file_path])
                    unstaged_diff_no_whitespace = self.run_git_command(['diff', '--ignore-all-space', file_path])
                    
                    if unstaged_diff and unstaged_diff.strip():
                        if not unstaged_diff_no_whitespace or not unstaged_diff_no_whitespace.strip():
                            logger.debug(
                                f"File has only whitespace/line ending changes, using commit time: {file_path}",
                                operation="get_file_last_modified_time",
                                commit_time=commit_time.isoformat()
                            )
                            return commit_time
                        
                        try:
                            file_mtime = datetime.fromtimestamp(
                                full_path.stat().st_mtime,
                                tz=timezone.utc
                            )
                            today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
                            
                            if file_mtime >= today_start:
                                logger.debug(
                                    f"File has unstaged content changes modified today, using file system time: {file_path}",
                                    operation="get_file_last_modified_time",
                                    commit_time=commit_time.isoformat(),
                                    file_mtime=file_mtime.isoformat(),
                                    today_start=today_start.isoformat()
                                )
                                return file_mtime
                            else:
                                logger.debug(
                                    f"File has unstaged content changes from previous day, using commit time: {file_path}",
                                    operation="get_file_last_modified_time",
                                    commit_time=commit_time.isoformat(),
                                    file_mtime=file_mtime.isoformat(),
                                    today_start=today_start.isoformat()
                                )
                                return commit_time
                        except (OSError, FileNotFoundError):
                            return commit_time
                    
                    logger.debug(
                        f"Using git commit time: {file_path}",
                        operation="get_file_last_modified_time",
                        commit_time=commit_time.isoformat()
                    )
                    return commit_time
                except (ValueError, OSError) as e:
                    logger.debug(
                        f"Could not parse commit timestamp for {file_path}",
                        operation="get_file_last_modified_time",
                        error_code="COMMIT_TIME_PARSE_FAILED",
                        root_cause=str(e)
                    )
        
        try:
            stat_info = full_path.stat()
            file_ctime = datetime.fromtimestamp(stat_info.st_ctime, tz=timezone.utc)
            file_mtime = datetime.fromtimestamp(stat_info.st_mtime, tz=timezone.utc)
            file_time = file_ctime if file_ctime <= file_mtime else file_mtime
            
            logger.debug(
                f"Using file system time (untracked file): {file_path}",
                operation="get_file_last_modified_time",
                file_ctime=file_ctime.isoformat(),
                file_mtime=file_mtime.isoformat(),
                file_time=file_time.isoformat()
            )
            return file_time
        except (OSError, FileNotFoundError, PermissionError) as e:
            logger.debug(
                f"Could not get file modification time for {file_path}",
                operation="get_file_last_modified_time",
                error_code="FILE_TIME_CHECK_FAILED",
                root_cause=str(e)
            )
            return None
    
    def is_line_changed_in_session(self, file_path: str, line_number: int, session_start: datetime) -> bool:
        diff = self.get_file_diff(file_path)
        if diff is None:
            full_path = self.project_root / file_path
            if not full_path.exists():
                return False
            
            try:
                file_mtime = datetime.fromtimestamp(full_path.stat().st_mtime, tz=timezone.utc)
                is_new = file_mtime >= session_start
                
                logger.debug(
                    f"Untracked file line check: {file_path}:{line_number}",
                    operation="is_line_changed_in_session",
                    file_mtime=file_mtime.isoformat(),
                    session_start=session_start.isoformat(),
                    is_new=is_new
                )
                
                return is_new
            except (OSError, FileNotFoundError, PermissionError, ValueError) as e:
                logger.warn(
                    f"Could not determine file age for {file_path}, assuming new",
                    operation="is_line_changed_in_session",
                    error_code="FILE_AGE_CHECK_FAILED",
                    root_cause=str(e)
                )
                return True
        
        for line in diff.split('\n'):
            if line.startswith('@@'):
                match = re.search(r'\+(\d+)(?:,(\d+))?', line)
                if match:
                    new_start = int(match.group(1))
                    new_count = int(match.group(2)) if match.group(2) else 1
                    new_end = new_start + new_count - 1
                    
                    if new_start <= line_number <= new_end:
                        return True
        
        return False
    
    def _has_actual_content_changes(self, file_path: str) -> bool:
        try:
            staged_content = self.run_git_command(['diff', '--cached', '--ignore-all-space', file_path])
            unstaged_content = self.run_git_command(['diff', '--ignore-all-space', file_path])
            
            staged_content = staged_content if staged_content else ""
            unstaged_content = unstaged_content if unstaged_content else ""
            
            has_staged_changes = bool(staged_content and staged_content.strip())
            has_unstaged_changes = bool(unstaged_content and unstaged_content.strip())
            
            if not has_staged_changes and not has_unstaged_changes:
                return False
            
            content_lines = []
            for diff_content in [staged_content, unstaged_content]:
                if not diff_content:
                    continue
                for line in diff_content.split('\n'):
                    line_stripped = line.strip()
                    if (line.startswith('+') or line.startswith('-')) and line_stripped:
                        if not line_stripped.startswith('+++') and not line_stripped.startswith('---') and not line_stripped.startswith('@@'):
                            content_part = line[1:].strip() if len(line) > 1 else ""
                            if content_part:
                                content_lines.append(line)
            
            has_actual_changes = len(content_lines) > 0
            
            logger.debug(
                f"Content change check: {file_path}",
                operation="_has_actual_content_changes",
                has_staged_changes=bool(staged_content),
                has_unstaged_changes=bool(unstaged_content),
                actual_change_count=len(content_lines),
                has_actual_changes=has_actual_changes
            )
            
            return has_actual_changes
        except (subprocess.TimeoutExpired, FileNotFoundError, OSError, ValueError) as e:
            logger.warn(
                f"Could not determine content changes for {file_path}, assuming modified",
                operation="_has_actual_content_changes",
                error_code="CONTENT_CHANGE_CHECK_FAILED",
                root_cause=str(e)
            )
            return True




