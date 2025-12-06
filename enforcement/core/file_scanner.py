from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from enforcement.core.git_utils import GitUtils, get_changed_files_impl, get_git_state_key
from enforcement.core.session_state import EnforcementSession, get_file_hash

try:
    from logger_util import get_logger
    logger = get_logger(context="file_scanner")
except ImportError:  # pragma: no cover - fallback logger
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("file_scanner")

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


def is_file_modified_in_session(
    file_path: str,
    session: EnforcementSession,
    project_root: Path,
    git_utils: GitUtils
) -> bool:
    """
    Determine whether a file was modified in the current session.
    
    Strategy: Rely primarily on git for tracked files, use mtime only as optimization hint.
    This prevents false positives from:
    - Whitespace/line ending changes (git ignores these)
    - Touch operations (mtime changes but content doesn't)
    - Folder moves (mtime changes but content doesn't)
    
    PERFORMANCE OPTIMIZATION: Uses caching to avoid redundant git calls.
    
    Returns True ONLY if:
    1. File has actual git content changes (not just whitespace/line endings), AND
    2. File was modified AFTER session start time (verified via git or mtime)
    """
    full_path = project_root / file_path
    if not full_path.exists():
        return False
    
    # PERFORMANCE OPTIMIZATION: Check cache first
    try:
        cache_key = get_git_state_key(project_root)
        session_id = session.id if hasattr(session, 'id') else 'unknown'
        modification_cache_key = f"{file_path}:{session_id}:{cache_key}"
        
        if modification_cache_key in git_utils._file_modification_cache:
            logger.debug(
                f"Using cached file modification status for {file_path}",
                operation="is_file_modified_in_session",
                cache_key=modification_cache_key
            )
            return git_utils._file_modification_cache[modification_cache_key]
    except Exception:
        pass  # Continue with normal check if cache key generation fails
    
    # Ensure changed-files cache is populated to avoid per-file cache misses
    cached_changed_files = git_utils.get_cached_changed_files()
    if cached_changed_files is None:
        try:
            cache_key = get_git_state_key(project_root)
            git_utils.update_cache(cache_key)
            cached_changed_files = git_utils.get_cached_changed_files()
            logger.debug(
                "Populated changed files cache in is_file_modified_in_session",
                operation="is_file_modified_in_session",
                cache_key=cache_key
            )
        except Exception as e:
            logger.debug(
                f"Could not populate changed files cache: {e}",
                operation="is_file_modified_in_session",
                error_code="CACHE_POPULATE_FAILED"
            )
            cached_changed_files = None

    # Handle session object - check if it's actually an EnforcementSession
    if not hasattr(session, 'start_time'):
        logger.error(
            f"Invalid session object passed to is_file_modified_in_session: {type(session)}",
            operation="is_file_modified_in_session",
            file_path=file_path,
            error_code="INVALID_SESSION_OBJECT"
        )
        # If session is invalid, we can't verify session time, so return False to be safe
        return False
    
    try:
        session_start = datetime.fromisoformat(session.start_time.replace('Z', '+00:00'))
    except (AttributeError, ValueError, TypeError) as e:
        logger.error(
            f"Could not parse session start time: {e}",
            operation="is_file_modified_in_session",
            file_path=file_path,
            error_code="SESSION_TIME_PARSE_FAILED",
            root_cause=str(e)
        )
        # If we can't parse session time, we can't verify, so return False to be safe
        return False
    
    # Helper to cache and return result
    def cache_and_return(result: bool) -> bool:
        try:
            cache_key = get_git_state_key(project_root)
            session_id = session.id if hasattr(session, 'id') else 'unknown'
            modification_cache_key = f"{file_path}:{session_id}:{cache_key}"
            git_utils._file_modification_cache[modification_cache_key] = result
        except Exception:
            pass  # Continue even if caching fails
        return result
    
    # FIRST: Check if file is tracked in git
    try:
        git_ls_output = git_utils.run_git_command(["ls-files", "--error-unmatch", "--", file_path])
        is_tracked = git_ls_output and git_ls_output.strip() != ""
    except Exception:
        # If git command fails, check cached changed files
        cached_changed_files = git_utils.get_cached_changed_files()
        if cached_changed_files:
            tracked_list = cached_changed_files.get('tracked', [])
            untracked_list = cached_changed_files.get('untracked', [])
            is_tracked = file_path in tracked_list
        else:
            is_tracked = False
    
    # For tracked files: Rely primarily on git, use mtime only as optimization hint
    if is_tracked:
        # Optimization: Quick mtime check (but don't trust it completely)
        # If mtime is clearly before session start, we can skip early
        # But if mtime is after session start, we MUST check git to be sure
        last_modified = git_utils.get_file_last_modified_time(file_path)
        if last_modified and last_modified < session_start:
            # mtime suggests file wasn't modified in session
            # But verify with git to be sure (mtime can be misleading)
            try:
                # Check if git shows any changes since session start
                # Use --ignore-all-space to filter whitespace-only changes
                git_diff = git_utils.run_git_command([
                    "diff", "--ignore-all-space", "--ignore-cr-at-eol", "--ignore-blank-lines",
                    "--name-only", "HEAD", "--", file_path
                ])
                
                if not git_diff or not git_diff.strip():
                    # Git confirms: no actual content changes
                    logger.debug(
                        f"File not modified in session (mtime and git confirm): {file_path}",
                        operation="is_file_modified_in_session",
                        file_mtime=last_modified.isoformat(),
                        session_start=session_start.isoformat(),
                        git_check="no_content_changes"
                    )
                    return cache_and_return(False)
            except Exception as e:
                logger.debug(
                    f"Git check failed, using mtime result: {e}",
                    operation="is_file_modified_in_session",
                    file_path=file_path
                )
                # If git check fails, trust mtime result
                return False
        
        # PERFORMANCE OPTIMIZATION: Consolidate multiple git diff calls into one
        # Instead of calling git diff 3-4 times, use a single call with all flags
        try:
            # Single git diff call that checks for content changes (ignoring whitespace)
            # This replaces the previous 3-4 separate git diff calls
            git_diff_result = git_utils.run_git_command([
                "diff", "--numstat", "--ignore-all-space", 
                "--ignore-cr-at-eol", "--ignore-blank-lines",
                "HEAD", "--", file_path
            ])
            
            has_content_changes = bool(git_diff_result and git_diff_result.strip())
            
            # Check if file was moved/renamed (not just modified)
            # Git rename detection: if file shows as modified but was actually moved, skip it
            status_code = git_utils.get_file_change_status(file_path)
            if status_code and status_code.startswith('R'):
                # File was renamed - check if content actually changed
                # If git diff with ignore-whitespace shows no changes, it's just a move
                if not has_content_changes:
                    logger.debug(
                        f"File was renamed but content unchanged (whitespace-only): {file_path}",
                        operation="is_file_modified_in_session",
                        file_path=file_path,
                        status_code=status_code,
                        reason="rename_no_content_change"
                    )
                    return cache_and_return(False)
            
            # If no content changes detected, file not modified
            if not has_content_changes:
                logger.debug(
                    "File has only whitespace/line ending changes or no changes, not considered modified",
                    operation="is_file_modified_in_session",
                    file_path=file_path,
                    reason="whitespace_only_changes"
                )
                return cache_and_return(False)
            
            # Verify file was modified after session start
            # Use git log to get the actual modification time from git
            try:
                git_log_time = git_utils.run_git_command([
                    "log", "-1", "--format=%ct", "--", file_path
                ])
                if git_log_time and git_log_time.strip():
                    commit_time = datetime.fromtimestamp(int(git_log_time.strip()), tz=timezone.utc)
                    if commit_time < session_start:
                        # Last commit was before session start, but we have uncommitted changes
                        # Check if uncommitted changes are actual content changes
                        unstaged_diff = git_utils.run_git_command([
                            "diff", "--ignore-all-space", "--ignore-cr-at-eol", "--ignore-blank-lines", file_path
                        ])
                        if not unstaged_diff or not unstaged_diff.strip():
                            logger.debug(
                                f"File has uncommitted changes but only whitespace: {file_path}",
                                operation="is_file_modified_in_session",
                                file_path=file_path
                            )
                            return cache_and_return(False)
            except Exception:
                pass  # Continue with normal check if git log fails
            
            logger.debug(
                "File considered modified (git diff shows content changes)",
                operation="is_file_modified_in_session",
                file_path=file_path
            )
            return cache_and_return(True)
        except Exception as exc:
            logger.warning(
                "Git diff failed, falling back to hash-only modification detection",
                operation="is_file_modified_in_session",
                file_path=file_path,
                error=str(exc)
            )
            # Fall through to hash-based check
    
    # For untracked files: Use mtime + content hash comparison
    # (Can't use git for untracked files)
    last_modified = git_utils.get_file_last_modified_time(file_path)
    if not last_modified:
        logger.debug(
            f"Could not determine modification time for untracked file {file_path}, skipping",
            operation="is_file_modified_in_session",
            file_path=file_path
        )
        return False
    
    if last_modified < session_start:
        logger.debug(
            f"Untracked file not modified in session (modified before session start): {file_path}",
            operation="is_file_modified_in_session",
            file_mtime=last_modified.isoformat(),
            session_start=session_start.isoformat()
        )
        return False
    
    # Check if file is in changed_files list
    cached_changed_files = git_utils.get_cached_changed_files()
    if cached_changed_files is None:
        logger.warn(
            "Changed files cache not available, falling back to direct call",
            operation="is_file_modified_in_session",
            file_path=file_path
        )
        changed_files = get_changed_files_impl(project_root, include_untracked=True)
        untracked_files = [f for f in changed_files if f not in get_changed_files_impl(project_root, include_untracked=False)]
    else:
        untracked_files = cached_changed_files.get('untracked', [])
    
    if file_path not in untracked_files:
        return False
    
    current_hash = get_file_hash(full_path, session, project_root)
    if not current_hash:
        logger.debug(
            f"Could not compute file hash for {file_path}, skipping",
            operation="is_file_modified_in_session",
            file_path=file_path
        )
        return False
    
    if session.file_hashes is None:
        session.file_hashes = {}
    
    try:
        stat_info = full_path.stat()
        cache_key = f"{file_path}:{stat_info.st_mtime}"
    except (OSError, FileNotFoundError):
        cache_key = file_path
    
    previous_hash_key = f"{file_path}:previous"
    previous_hash = session.file_hashes.get(previous_hash_key)
    
    if previous_hash is None:
        try:
            git_ls_output = git_utils.run_git_command(["ls-files", "--error-unmatch", "--", file_path])
            is_untracked = not git_ls_output or git_ls_output.strip() == ""
        except Exception:
            cached_changed_files = git_utils.get_cached_changed_files()
            if cached_changed_files:
                untracked_list = cached_changed_files.get('untracked', [])
                is_untracked = file_path in untracked_list
            else:
                is_untracked = False
        
        session.file_hashes[previous_hash_key] = current_hash
        session.file_hashes[cache_key] = current_hash
        
        if is_untracked:
            # For untracked files, check if they might have been moved from another location
            # Moving files on Windows updates mtime even if content didn't change
            # We've already checked mtime >= session_start above, so if we get here,
            # the file exists and mtime is after session start
            # 
            # Strategy 1: Check if file content hash matches any tracked file in git history
            # If hash matches, file was likely moved (not actually modified)
            matching_files = git_utils.find_files_with_hash(current_hash)
            
            if matching_files:
                # File content matches existing tracked file - likely moved, not modified
                logger.info(
                    f"Untracked file matches existing file hash (likely moved, not modified): {file_path}",
                    operation="is_file_modified_in_session",
                    file_path=file_path,
                    matching_files=matching_files[:3],  # Log first 3 matches
                    content_hash=current_hash[:16] + "..." if current_hash else None
                )
                # Don't flag as modified - file was moved, not actually changed
                return False
            
            # Strategy 2: Heuristic check - if date in file matches file's mtime date,
            # and mtime is very close to session start, it might be a move operation
            # This handles cases where files were moved from untracked locations
            try:
                import re
                
                file_mtime = datetime.fromtimestamp(full_path.stat().st_mtime, tz=timezone.utc)
                session_start = datetime.fromisoformat(session.start_time.replace('Z', '+00:00'))
                time_diff = (file_mtime - session_start).total_seconds()
                
                # Read file to check if date in file matches mtime date
                try:
                    file_content = full_path.read_text(encoding='utf-8', errors='ignore')
                    # Look for date patterns in file (YYYY-MM-DD)
                    date_pattern = r'\b(20\d{2})[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b'
                    date_matches = re.findall(date_pattern, file_content)
                    
                    if date_matches:
                        # Check if any date in file matches the file's mtime date
                        mtime_date_str = file_mtime.strftime('%Y-%m-%d')
                        for match in date_matches:
                            if len(match) >= 3:
                                # Normalize date from match
                                year = match[0] if len(match[0]) == 4 else match[2]
                                month = match[1] if len(match[0]) == 4 else match[0]
                                day = match[2] if len(match[0]) == 4 else match[1]
                                file_date_str = f"{year}-{month}-{day}"
                                
                                if file_date_str == mtime_date_str:
                                    # Date in file matches mtime date - likely a move, not actual modification
                                    # Only apply this heuristic if mtime is close to session start (< 2 hours)
                                    # This prevents false positives for files that were actually edited
                                    if time_diff < 7200:  # 2 hours
                                        logger.info(
                                            f"Untracked file date matches mtime date (likely moved, not modified): {file_path}",
                                            operation="is_file_modified_in_session",
                                            file_path=file_path,
                                            file_date=file_date_str,
                                            mtime_date=mtime_date_str,
                                            time_diff_seconds=time_diff
                                        )
                                        # Don't flag as modified - file was likely moved, not actually changed
                                        return False
                except (OSError, FileNotFoundError, PermissionError, UnicodeDecodeError):
                    pass  # Ignore errors, just proceed with normal check
            except Exception as e:
                logger.debug(
                    f"Could not apply move detection heuristic: {e}",
                    operation="is_file_modified_in_session",
                    file_path=file_path,
                    error_code="MOVE_HEURISTIC_FAILED"
                )
                # Continue with normal check if heuristic fails
            
            # File is truly new/modified (hash doesn't match, and date heuristic didn't apply)
            logger.debug(
                "File considered modified (untracked/new file with unique content)",
                operation="is_file_modified_in_session",
                file_path=file_path,
                content_hash=current_hash[:16] + "..." if current_hash else None
            )
            return True
        
        # PERFORMANCE OPTIMIZATION: Use single consolidated git diff call
        try:
            # Single git diff call that checks for content changes (ignoring whitespace)
            git_diff_result = git_utils.run_git_command([
                "diff", "--numstat", "--ignore-all-space", 
                "--ignore-cr-at-eol", "--ignore-blank-lines",
                "HEAD", "--", file_path
            ])
            
            has_content_changes = bool(git_diff_result and git_diff_result.strip())
            
            if not has_content_changes:
                logger.debug(
                    "File has only whitespace/line ending changes or no changes, not considered modified",
                    operation="is_file_modified_in_session",
                    file_path=file_path,
                    reason="whitespace_only_changes"
                )
                return cache_and_return(False)
            
            logger.debug(
                "File considered modified (git diff shows content changes)",
                operation="is_file_modified_in_session",
                file_path=file_path
            )
            return cache_and_return(True)
        except Exception as exc:
            logger.warning(
                "Git diff failed, falling back to hash-only modification detection",
                operation="is_file_modified_in_session",
                file_path=file_path,
                error=str(exc)
            )
            # Fall through to hash-based check
    
    hash_changed = current_hash != previous_hash
    
    if hash_changed:
        session.file_hashes[previous_hash_key] = current_hash
        session.file_hashes[cache_key] = current_hash
        logger.debug(
            f"File content hash changed, file was modified: {file_path}",
            operation="is_file_modified_in_session",
            file_path=file_path,
            previous_hash=previous_hash[:16] + "..." if previous_hash else None,
            current_hash=current_hash[:16] + "..."
        )
        return cache_and_return(True)
    
    logger.debug(
        f"File content hash unchanged, file not modified: {file_path}",
        operation="is_file_modified_in_session",
        file_path=file_path,
        hash=current_hash[:16] + "..."
    )
    return cache_and_return(False)




