from enum import Enum
from pathlib import Path
from typing import Optional
from datetime import datetime

from enforcement.core.git_utils import GitUtils
from enforcement.core.session_state import EnforcementSession
from enforcement.core.scope_evaluator import (
    is_historical_dir_path,
    is_historical_document_file,
)

try:
    from logger_util import get_logger
    logger = get_logger(context="file_classifier")
except ImportError:  # pragma: no cover - fallback logger
    import logging
    logging.basicConfig(level=logging.INFO)
    
    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("file_classifier")
        
        def debug(self, msg, *args, **kwargs):
            self._logger.debug(msg)
    
    logger = _FallbackLogger()


class FileChangeType(Enum):
    UNTOUCHED = "untouched"
    CONTENT_CHANGED = "content_changed"
    MOVED_OR_RENAMED_ONLY = "moved_or_renamed_only"
    NEW_FILE = "new_file"
    DELETED = "deleted"
    GENERATED = "generated"
    THIRD_PARTY = "third_party"
    HISTORICAL = "historical"


def classify_file_change(
    file_path: str,
    project_root: Path,
    git_utils: GitUtils,
    session: EnforcementSession
) -> FileChangeType:
    """
    Classify file change type using git diff --name-status.
    
    Returns:
        FileChangeType enum value
    """
    full_path = project_root / file_path
    
    # Check if file is historical first
    if is_historical_dir_path(file_path) or is_historical_document_file(full_path):
        return FileChangeType.HISTORICAL
    
    # Get git status code
    status_code = git_utils.get_file_change_status(file_path)
    
    if status_code is None:
        # File not in git diff - check if untracked
        tracked = git_utils.run_git_command(['ls-files', '--error-unmatch', '--', file_path])
        if not tracked or tracked.strip() == "":
            # Untracked file - check if it's a move
            if full_path.exists():
                from enforcement.core.session_state import get_file_hash
                current_hash = get_file_hash(full_path, session, project_root)
                if current_hash:
                    matching_files = git_utils.find_files_with_hash(current_hash)
                    if matching_files:
                        return FileChangeType.MOVED_OR_RENAMED_ONLY
            return FileChangeType.NEW_FILE
        return FileChangeType.UNTOUCHED
    
    # Handle status codes
    if status_code == 'D':
        return FileChangeType.DELETED
    elif status_code == 'A':
        return FileChangeType.NEW_FILE
    elif status_code == 'R':
        # Rename - check if content changed
        rename_source = git_utils.get_rename_source(file_path)
        if rename_source and full_path.exists():
            from enforcement.core.session_state import get_file_hash
            current_hash = get_file_hash(full_path, session, project_root)
            if current_hash:
                # Get hash of source file from HEAD
                try:
                    source_content = git_utils.run_git_command(['show', f'HEAD:{rename_source}'])
                    if source_content:
                        import hashlib
                        source_hash = hashlib.sha256(source_content.encode('utf-8')).hexdigest()
                        if source_hash == current_hash:
                            return FileChangeType.MOVED_OR_RENAMED_ONLY
                except Exception:
                    pass
        return FileChangeType.CONTENT_CHANGED
    elif status_code == 'M':
        return FileChangeType.CONTENT_CHANGED
    else:
        return FileChangeType.CONTENT_CHANGED



