import re
import subprocess
import hashlib
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

from enforcement.core.historical import is_historical_path


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


def get_changed_files_with_status(project_root: Path) -> List[Dict[str, str]]:
    """
    Return changed files with status codes using git diff --name-status.
    """
    output = run_git_command(
        project_root,
        [
            "diff",
            "--name-status",
            "--ignore-all-space",
            "--ignore-cr-at-eol",
            "--ignore-blank-lines",
            "HEAD",
        ],
    )
    results: List[Dict[str, str]] = []
    if not output:
        return results
    for line in output.strip().split("\n"):
        if not line:
            continue
        parts = line.split("\t")
        status = parts[0]
        if status.startswith("R") and len(parts) >= 3:
            old_path, new_path = parts[1], parts[2]
            results.append({"status": status, "path": new_path, "old_path": old_path})
        elif len(parts) >= 2:
            results.append({"status": status, "path": parts[1]})
    return results


class GitUtils:
    """
    Helper class for git operations with caching support.
    """
    
    def __init__(self, project_root: Path):
        self.project_root = project_root
        self._cached_changed_files: Optional[Dict[str, List[str]]] = None
        self._changed_files_cache_key: Optional[str] = None
        self._file_diff_cache: Dict[str, Optional[str]] = {}
        self._cached_classifications: Optional[Dict[str, str]] = None
        self._classification_cache_key: Optional[str] = None
        # Cache for file modification status (key: file_path:session_id:git_state_key)
        self._file_modification_cache: Dict[str, bool] = {}
        # Cache for batch file modification status (key: git_state_key)
        self._batch_file_modification_cache: Optional[Dict[str, bool]] = None
        self._batch_file_modification_cache_key: Optional[str] = None
    
    def run_git_command(self, args: List[str]) -> str:
        return run_git_command(self.project_root, args)
    
    def invalidate_cache(self):
        self._cached_changed_files = None
        self._changed_files_cache_key = None
        self._cached_classifications = None
        self._classification_cache_key = None
        self._file_modification_cache.clear()
        self._batch_file_modification_cache = None
        self._batch_file_modification_cache_key = None
    
    def update_cache(self, cache_key: str):
        tracked = get_changed_files_impl(self.project_root, include_untracked=False)
        all_changed = get_changed_files_impl(self.project_root, include_untracked=True)

        # Deduplicate and separate untracked correctly.
        # get_changed_files_impl(include_untracked=True) returns tracked + untracked,
        # so we subtract the tracked set to avoid double counting.
        tracked_set = set(tracked)
        untracked_only = [f for f in all_changed if f not in tracked_set]

        self._cached_changed_files = {
            'tracked': tracked,
            'untracked': untracked_only,
        }
        self._changed_files_cache_key = cache_key
        self._cached_classifications = None
        self._classification_cache_key = None
    
    def get_cache_key(self) -> Optional[str]:
        return self._changed_files_cache_key
    
    def get_cached_changed_files(self) -> Optional[Dict[str, List[str]]]:
        return self._cached_changed_files

    def get_changed_file_classifications(self) -> Dict[str, str]:
        """
        Returns a map of file_path -> classification:
        CONTENT_CHANGED, MOVED_OR_RENAMED_ONLY, NEW_FILE, DELETED.
        """
        cache_key = get_git_state_key(self.project_root)
        if self._cached_classifications is not None and self._classification_cache_key == cache_key:
            return self._cached_classifications

        classifications: Dict[str, str] = {}

        # Build status entries using instance run_git_command to ease testing
        status_entries: List[Dict[str, str]] = []
        status_output = self.run_git_command(
            [
                "diff",
                "--name-status",
                "--ignore-all-space",
                "--ignore-cr-at-eol",
                "--ignore-blank-lines",
                "HEAD",
            ]
        )
        if status_output:
            for line in status_output.strip().split("\n"):
                if not line:
                    continue
                parts = line.split("\t")
                status = parts[0]
                if status.startswith("R") and len(parts) >= 3:
                    old_path, new_path = parts[1], parts[2]
                    status_entries.append({"status": status, "path": new_path, "old_path": old_path})
                elif len(parts) >= 2:
                    status_entries.append({"status": status, "path": parts[1]})

        for entry in status_entries:
            status = entry["status"]
            path = entry["path"]
            if is_historical_path(path):
                continue
            if status.startswith("R"):
                diff_out = self.run_git_command(
                    [
                        "diff",
                        "--ignore-all-space",
                        "--ignore-cr-at-eol",
                        "--ignore-blank-lines",
                        "HEAD",
                        "--",
                        path,
                    ]
                )
                if diff_out.strip():
                    classifications[path] = "CONTENT_CHANGED"
                else:
                    classifications[path] = "MOVED_OR_RENAMED_ONLY"
            elif status.startswith("M"):
                classifications[path] = "CONTENT_CHANGED"
            elif status.startswith("A"):
                classifications[path] = "NEW_FILE"
            elif status.startswith("D"):
                classifications[path] = "DELETED"

        cached = self.get_cached_changed_files()
        if cached is None:
            untracked_all = get_changed_files_impl(self.project_root, include_untracked=True)
            tracked_only = get_changed_files_impl(self.project_root, include_untracked=False)
            untracked_only = [f for f in untracked_all if f not in set(tracked_only)]
        else:
            untracked_only = cached.get("untracked", [])

        for path in untracked_only:
            if is_historical_path(path):
                continue
            classifications[path] = "NEW_FILE"

        self._cached_classifications = classifications
        self._classification_cache_key = cache_key
        return classifications
    
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
        """
        Get file last modification time using st_mtime (best practice from python_bible).
        
        According to python_bible best practices:
        - st_mtime (modification time) is updated when file *content* changes - this is what we want
        - Moving a file preserves st_mtime on most systems
        - Opening a file without changing it does NOT update st_mtime
        - st_mtime is exactly what we need for detecting actual content modifications
        
        Args:
            file_path: Path to the file (relative to project root)
            
        Returns:
            datetime object with timezone (UTC) or None if file doesn't exist
        """
        full_path = self.project_root / file_path
        if not full_path.exists():
            return None
        
        try:
            # Use st_mtime (modification time) - this is the best practice
            # st_mtime is updated when file content changes, not when files are moved or opened
            stat_info = full_path.stat()
            file_mtime = datetime.fromtimestamp(stat_info.st_mtime, tz=timezone.utc)
            
            logger.debug(
                f"Using st_mtime (modification time) for file: {file_path}",
                operation="get_file_last_modified_time",
                file_mtime=file_mtime.isoformat(),
                st_mtime_timestamp=stat_info.st_mtime
            )
            return file_mtime
        except (OSError, FileNotFoundError, PermissionError) as e:
            logger.debug(
                f"Could not get file modification time (st_mtime) for {file_path}",
                operation="get_file_last_modified_time",
                error_code="FILE_TIME_CHECK_FAILED",
                root_cause=str(e)
            )
            return None
    
    def get_file_last_modified_time_legacy(self, file_path: str) -> Optional[datetime]:
        """
        Legacy method - kept for reference but not used.
        
        This method tried to use git commit time for tracked files, but according to
        python_bible best practices, we should always use st_mtime (modification time)
        because it accurately reflects when file content was actually changed.
        """
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
    
    def is_line_changed_in_session(self, file_path: str, line_number: int, session_start: datetime, classification_map: Optional[Dict[str, str]] = None) -> bool:
        """
        Check if a specific line was changed in the current session.
        
        Returns True ONLY if:
        1. File was modified AFTER session start time, AND
        2. The line is in the git diff (for tracked files) or file is new (for untracked files)
        
        This prevents flagging lines that were changed before the session started.
        """
        if classification_map:
            cls = classification_map.get(file_path)
            if cls in ("MOVED_OR_RENAMED_ONLY", "DELETED"):
                return False
        # FIRST: Check if file was actually modified after session start
        # This is critical - we must verify the file was modified in this session,
        # not just that it has a diff from a previous session
        full_path = self.project_root / file_path
        file_mtime = None
        if full_path.exists():
            try:
                file_mtime = datetime.fromtimestamp(full_path.stat().st_mtime, tz=timezone.utc)
                if file_mtime < session_start:
                    # File was modified before session started - not a current session change
                    logger.debug(
                        f"Line not changed in session (file modified before session start): {file_path}:{line_number}",
                        operation="is_line_changed_in_session",
                        file_mtime=file_mtime.isoformat(),
                        session_start=session_start.isoformat()
                    )
                    return False
            except (OSError, FileNotFoundError, PermissionError, ValueError) as e:
                logger.warn(
                    f"Could not check file mtime for {file_path}, proceeding with diff check",
                    operation="is_line_changed_in_session",
                    error_code="FILE_MTIME_CHECK_FAILED",
                    root_cause=str(e)
                )
                # Continue with diff check if mtime check fails (conservative)
        elif not full_path.exists():
            return False
        
        # THEN: Check if line is in diff (for tracked files) or file is new (for untracked files)
        diff = self.get_file_diff(file_path)
        if diff is None:
            # Untracked file - already checked mtime above, so if we get here, file is new
            logger.debug(
                f"Untracked file line check: {file_path}:{line_number}",
                operation="is_line_changed_in_session",
                file_mtime=file_mtime.isoformat() if file_mtime else "N/A",
                session_start=session_start.isoformat(),
                is_new=True
            )
            return True
        
        # Tracked file - check if line is in diff
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
    
    def find_files_with_hash(self, content_hash: str) -> List[str]:
        """
        Find tracked files in git history that have the same content hash.
        
        This is used to detect if an untracked file was moved from another location.
        If a file with the same hash exists in git history, it's likely a move operation,
        not a new/modified file.
        
        Also checks recently deleted files (files deleted in HEAD) to catch moves
        where the old location was deleted.
        
        PERFORMANCE OPTIMIZATION: Only checks recently modified files (last 100) instead
        of all tracked files to reduce git calls from 100-1000 to 10-100.
        
        Args:
            content_hash: SHA-256 hash of file content
            
        Returns:
            List of file paths in git that have matching content hash (empty if no matches)
        """
        if not content_hash:
            return []
        
        try:
            # OPTIMIZATION: Only check recently modified files (last 100) instead of all files
            # This reduces git calls from 100-1000 to 10-100 (90% reduction)
            recent_files = []
            try:
                # Get recently modified files from git log (last 100 commits)
                recent_output = self.run_git_command([
                    "log", "--name-only", "--pretty=format:", "-100", "--diff-filter=M"
                ])
                if recent_output:
                    recent_files = [f.strip() for f in recent_output.strip().split('\n') if f.strip()]
                    # Remove duplicates while preserving order
                    seen = set()
                    recent_files = [f for f in recent_files if f and f not in seen and not seen.add(f)]
                    recent_files = recent_files[:100]  # Limit to 100 most recent
                    logger.debug(
                        f"Found {len(recent_files)} recently modified files to check for hash matches",
                        operation="find_files_with_hash",
                        recent_count=len(recent_files)
                    )
            except Exception as e:
                logger.debug(
                    f"Could not get recently modified files: {e}",
                    operation="find_files_with_hash",
                    error_code="RECENT_FILES_CHECK_FAILED"
                )
            
            # Also check recently deleted files (files that exist in HEAD but not in working tree)
            # This catches moves where the old location was deleted
            deleted_files = []
            try:
                # Get files that were deleted (exist in HEAD but not in working tree)
                deleted_output = self.run_git_command(['diff', '--name-only', '--diff-filter=D', 'HEAD'])
                if deleted_output:
                    deleted_files = [f.strip() for f in deleted_output.strip().split('\n') if f.strip()]
                    logger.debug(
                        f"Found {len(deleted_files)} deleted files to check for hash matches",
                        operation="find_files_with_hash",
                        deleted_count=len(deleted_files)
                    )
            except Exception as e:
                logger.debug(
                    f"Could not get deleted files list: {e}",
                    operation="find_files_with_hash",
                    error_code="DELETED_FILES_CHECK_FAILED"
                )
            
            # Combine recent and deleted files (limit total to avoid performance issues)
            all_files_to_check = recent_files + deleted_files
            if len(all_files_to_check) > 200:
                logger.debug(
                    f"Too many files to check ({len(all_files_to_check)}), limiting hash search to 200",
                    operation="find_files_with_hash",
                    total_files=len(all_files_to_check)
                )
                all_files_to_check = all_files_to_check[:200]
            
            matching_files = []
            
            # Check each file's content hash
            for file_path in all_files_to_check:
                try:
                    full_path = self.project_root / file_path
                    
                    # For deleted files, get content from git
                    if file_path in deleted_files:
                        try:
                            git_content = self.run_git_command(['show', f'HEAD:{file_path}'])
                            if git_content:
                                file_hash = hashlib.sha256(git_content.encode('utf-8')).hexdigest()
                                if file_hash == content_hash:
                                    matching_files.append(file_path)
                                    logger.debug(
                                        f"Found matching hash in deleted file: {file_path}",
                                        operation="find_files_with_hash",
                                        content_hash=content_hash[:16] + "..."
                                    )
                        except Exception:
                            # File might not exist in HEAD or can't be read
                            continue
                    else:
                        # For tracked files, read from filesystem
                        if not full_path.exists() or full_path.is_dir():
                            continue
                        
                        # Get file content hash (using same method as get_file_hash)
                        with open(full_path, 'rb') as f:
                            file_content = f.read()
                            file_hash = hashlib.sha256(file_content).hexdigest()
                        
                        if file_hash == content_hash:
                            matching_files.append(file_path)
                            logger.debug(
                                f"Found matching hash for untracked file: {file_path}",
                                operation="find_files_with_hash",
                                content_hash=content_hash[:16] + "..."
                            )
                except (OSError, FileNotFoundError, PermissionError, UnicodeDecodeError):
                    # Skip files we can't read
                    continue
            
            if matching_files:
                logger.info(
                    f"Found {len(matching_files)} file(s) with matching content hash",
                    operation="find_files_with_hash",
                    matching_files=matching_files[:5],  # Log first 5
                    total_matches=len(matching_files)
                )
            
            return matching_files
            
        except Exception as e:
            logger.warn(
                f"Failed to search for files with matching hash: {e}",
                operation="find_files_with_hash",
                error_code="HASH_SEARCH_FAILED",
                root_cause=str(e)
            )
            return []
    
    def get_batch_file_modification_status(self, cache_key: str) -> Dict[str, bool]:
        """
        Get modification status for all changed files in a single git call.
        
        PERFORMANCE OPTIMIZATION: Uses git diff --name-status once for all files
        instead of calling is_file_modified_in_session() for each file individually.
        This reduces git calls from 500-750 to 1-2 (99% reduction).
        
        Args:
            cache_key: Git state key for cache invalidation
            
        Returns:
            Dictionary mapping file_path -> bool (True if file has content changes)
        """
        # Check cache first
        if (self._batch_file_modification_cache is not None and 
            self._batch_file_modification_cache_key == cache_key):
            logger.debug(
                "Using cached batch file modification status",
                operation="get_batch_file_modification_status",
                cache_key=cache_key,
                file_count=len(self._batch_file_modification_cache)
            )
            return self._batch_file_modification_cache
        
        # Get all file statuses in one git call
        try:
            # CRITICAL: Use --ignore-all-space to filter whitespace-only changes
            # This ensures we only get files with actual content changes
            all_file_statuses = self.run_git_command([
                "diff", "--name-status", "--ignore-all-space",
                "--ignore-cr-at-eol", "--ignore-blank-lines", "HEAD"
            ])
            
            # Parse status output and build cache
            file_modification_cache = {}
            for line in all_file_statuses.strip().split('\n'):
                if not line:
                    continue
                parts = line.split('\t')
                if len(parts) >= 2:
                    file_path = parts[1]
                    status = parts[0]
                    # M = modified, A = added, R = renamed (with content change)
                    # Only consider files with actual content changes (not whitespace-only)
                    # Note: R (rename) only shows if there are content changes (due to --ignore-all-space)
                    file_modification_cache[file_path] = status in ('M', 'A', 'R')
            
            # Also check staged changes (same filtering)
            staged_statuses = self.run_git_command([
                "diff", "--cached", "--name-status", "--ignore-all-space",
                "--ignore-cr-at-eol", "--ignore-blank-lines"
            ])
            
            for line in staged_statuses.strip().split('\n'):
                if not line:
                    continue
                parts = line.split('\t')
                if len(parts) >= 2:
                    file_path = parts[1]
                    status = parts[0]
                    # Only mark as modified if there are actual content changes
                    if status in ('M', 'A', 'R'):
                        file_modification_cache[file_path] = True
            
            # Cache the results
            self._batch_file_modification_cache = file_modification_cache
            self._batch_file_modification_cache_key = cache_key
            
            logger.debug(
                f"Computed batch file modification status for {len(file_modification_cache)} files",
                operation="get_batch_file_modification_status",
                cache_key=cache_key,
                modified_count=sum(1 for v in file_modification_cache.values() if v)
            )
            
            return file_modification_cache
        except Exception as e:
            logger.warn(
                f"Failed to get batch file modification status: {e}",
                operation="get_batch_file_modification_status",
                error_code="BATCH_STATUS_FAILED",
                root_cause=str(e)
            )
            return {}
    
    def get_file_change_status(self, file_path: str) -> Optional[str]:
        """
        Get git status code for file (A, D, M, R, etc.).
        
        Uses: git diff --name-status HEAD
        Returns: Status code or None
        """
        try:
            # Get staged changes
            staged_output = self.run_git_command(['diff', '--cached', '--name-status', '--', file_path])
            if staged_output and staged_output.strip():
                # Parse status code (first character)
                parts = staged_output.strip().split()
                if parts:
                    status = parts[0]
                    if status:
                        return status[0]  # First char is status code
            
            # Get unstaged changes
            unstaged_output = self.run_git_command(['diff', '--name-status', '--find-renames', '--', file_path])
            if unstaged_output and unstaged_output.strip():
                parts = unstaged_output.strip().split()
                if parts:
                    status = parts[0]
                    if status:
                        return status[0]
            
            return None
        except Exception as e:
            logger.debug(
                f"Could not get file change status for {file_path}",
                operation="get_file_change_status",
                error_code="STATUS_CHECK_FAILED",
                root_cause=str(e)
            )
            return None
    
    def get_rename_source(self, file_path: str) -> Optional[str]:
        """
        For renamed files, get original path.
        
        Uses: git diff --name-status --find-renames
        Returns: Original path or None
        """
        try:
            # Check staged renames
            staged_output = self.run_git_command(['diff', '--cached', '--name-status', '--find-renames', '--', file_path])
            if staged_output and 'R' in staged_output:
                parts = staged_output.strip().split('\t')
                if len(parts) >= 3:
                    return parts[1]  # Old path is second field
            
            # Check unstaged renames
            unstaged_output = self.run_git_command(['diff', '--name-status', '--find-renames', '--', file_path])
            if unstaged_output and 'R' in unstaged_output:
                parts = unstaged_output.strip().split('\t')
                if len(parts) >= 3:
                    return parts[1]
            
            return None
        except Exception as e:
            logger.debug(
                f"Could not get rename source for {file_path}",
                operation="get_rename_source",
                error_code="RENAME_SOURCE_CHECK_FAILED",
                root_cause=str(e)
            )
            return None


