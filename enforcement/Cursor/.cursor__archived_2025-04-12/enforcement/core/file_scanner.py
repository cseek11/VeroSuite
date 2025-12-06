from pathlib import Path
from typing import Optional

from enforcement.core.git_utils import GitUtils, get_changed_files_impl
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
    """
    cached_changed_files = git_utils.get_cached_changed_files()
    if cached_changed_files is None:
        logger.warn(
            "Changed files cache not available, falling back to direct call",
            operation="is_file_modified_in_session",
            file_path=file_path
        )
        changed_files = get_changed_files_impl(project_root, include_untracked=False)
    else:
        changed_files = cached_changed_files['tracked']
    
    if file_path not in changed_files:
        return False
    
    full_path = project_root / file_path
    if not full_path.exists():
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
            logger.debug(
                "File considered modified (untracked/new file)",
                operation="is_file_modified_in_session",
                file_path=file_path
            )
            return True
        
        try:
            git_output = git_utils.run_git_command(
                ["diff", "--numstat", "HEAD", "--", file_path]
            )
        except Exception as exc:
            logger.warning(
                "Git diff failed, falling back to hash-only modification detection",
                operation="is_file_modified_in_session",
                file_path=file_path,
                error=str(exc)
            )
            git_output = None
        
        if git_output and git_output.strip():
            logger.debug(
                "File considered modified (git diff shows changes)",
                operation="is_file_modified_in_session",
                file_path=file_path
            )
            return True
        
        logger.debug(
            "File not considered modified (no git diff changes)",
            operation="is_file_modified_in_session",
            file_path=file_path
        )
        return False
    
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
        return True
    
    logger.debug(
        f"File content hash unchanged, file not modified: {file_path}",
        operation="is_file_modified_in_session",
        file_path=file_path,
        hash=current_hash[:16] + "..."
    )
    return False




