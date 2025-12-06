import json
import hashlib
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

try:
    from logger_util import get_logger
    logger = get_logger(context="session_state")
except ImportError:  # pragma: no cover - fallback logger
    import logging

    logging.basicConfig(level=logging.INFO)

    class _FallbackLogger:
        def __init__(self):
            self._logger = logging.getLogger("session_state")

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


@dataclass(slots=True)  # Python 3.10+ - reduces memory by 4-5× (Python Bible Chapter 07.5.3, 12.4.1)
class EnforcementSession:
    """
    Tracks enforcement session state.
    
    Memory optimization: Using __slots__ reduces memory footprint by 4-5×
    compared to regular dataclass with __dict__ (Python Bible Chapter 07.5.3).
    """
    session_id: str
    start_time: str
    last_check: str
    violations: List[Dict]
    checks_passed: List[str]
    checks_failed: List[str]
    auto_fixes: List[Dict]  # Track auto-fixes
    file_hashes: Dict[str, str] = None  # Track file content hashes to detect actual changes
    version: Optional[int] = None  # Session version for migration tracking
    
    @classmethod
    def create_new(cls) -> "EnforcementSession":
        """Create a new enforcement session."""
        return cls(
            session_id=str(uuid.uuid4()),
            start_time=datetime.now(timezone.utc).isoformat(),
            last_check=datetime.now(timezone.utc).isoformat(),
            violations=[],
            checks_passed=[],
            checks_failed=[],
            auto_fixes=[],
            file_hashes={},
            version=2  # Current version (v2: fixed hash cache)
        )


def migrate_session_v1_to_v2(old_data: Dict) -> Dict:
    """
    Migrate session from v1 (buggy hash cache) to v2 (fixed cache).
    """
    new_data = old_data.copy()
    
    if 'file_hashes' in new_data:
        try:
            logger.info(
                "Clearing stale file_hashes cache (v1 → v2 migration)",
                operation="migrate_session_v1_to_v2",
                old_cache_size=len(new_data.get('file_hashes', {}))
            )
        except TypeError:
            logger.info(f"Clearing stale file_hashes cache (v1 → v2 migration, old_cache_size={len(new_data.get('file_hashes', {}))})")
        new_data['file_hashes'] = {}
    
    new_data['version'] = 2
    
    if 'auto_fixes' not in new_data:
        new_data['auto_fixes'] = []
    
    return new_data


def _init_session_sequence_tracker(session_id: str) -> Optional[Any]:
    """
    Attempt to initialize the session sequence tracker lazily.
    """
    try:
        from context_manager.session_sequence_tracker import SessionSequenceTracker
        tracker = SessionSequenceTracker(session_id)
        logger.info(
            "Session sequence tracker initialized",
            operation="load_session",
            session_id=session_id
        )
        return tracker
    except Exception as exc:  # pragma: no cover - best effort initialization
        logger.warn(
            f"Failed to initialize session sequence tracker: {exc}",
            operation="load_session",
            error_code="SESSION_SEQUENCE_TRACKER_INIT_FAILED",
            root_cause=str(exc)
        )
        return None


def load_session(
    enforcement_dir: Path,
    predictor: Optional[Any] = None,
    session_sequence_tracker_ref: Optional[Any] = None
) -> Tuple[EnforcementSession, Optional[Any]]:
    """
    Load enforcement session from disk (or create new) and optionally initialize tracker.
    """
    session_file = enforcement_dir / "session.json"
    session_sequence_tracker = session_sequence_tracker_ref
    
    if session_file.exists():
        try:
            with open(session_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if 'version' not in data or data.get('version', 1) < 2:
                try:
                    logger.info(
                        "Migrating session from v1 to v2",
                        operation="load_session",
                        old_version=data.get('version', 1)
                    )
                except TypeError:
                    logger.info(f"Migrating session from v1 to v2 (old_version={data.get('version', 1)})")
                data = migrate_session_v1_to_v2(data)
            
            if 'auto_fixes' not in data:
                data['auto_fixes'] = []
            if 'file_hashes' not in data:
                data['file_hashes'] = {}
            if 'version' not in data:
                data['version'] = 2
            if 'checks_passed' not in data:
                data['checks_passed'] = []
            if 'checks_failed' not in data:
                data['checks_failed'] = []
            
            session = EnforcementSession(**data)
            
            # CRITICAL: Filter out stale violations when loading session
            # Stale violations are identified by:
            # 1. N/A line numbers (violations that couldn't be properly parsed)
            # 2. Violations for log files (memory_bank files)
            # 3. Violations for files that no longer exist or shouldn't be checked
            original_violation_count = len(session.violations)
            filtered_violations = []
            
            for v in session.violations:
                # Skip violations with N/A line numbers (definitely stale)
                line_num = v.get('line_number')
                if line_num is None or line_num == "N/A" or str(line_num).upper() == "N/A":
                    continue
                
                # Skip violations for log files
                file_path = v.get('file_path', '')
                if file_path:
                    normalized_path = str(file_path).replace("\\", "/").lower()
                    if ".ai/memory_bank/" in normalized_path or ".ai/memory-bank/" in normalized_path:
                        continue
                
                filtered_violations.append(v)
            
            session.violations = filtered_violations
            filtered_count = original_violation_count - len(filtered_violations)
            
            if filtered_count > 0:
                logger.info(
                    f"Filtered {filtered_count} stale violations when loading session",
                    operation="load_session",
                    session_id=session.session_id,
                    original_count=original_violation_count,
                    filtered_count=filtered_count,
                    remaining_count=len(filtered_violations)
                )
            
            logger.info(
                "Session loaded",
                operation="load_session",
                session_id=session.session_id,
                violations_count=len(session.violations)
            )
        except (FileNotFoundError, json.JSONDecodeError, PermissionError, OSError) as exc:
            logger.warn(
                "Failed to load session, creating new",
                operation="load_session",
                error_code="SESSION_LOAD_FAILED",
                root_cause=str(exc)
            )
            session = EnforcementSession.create_new()
    else:
        session = EnforcementSession.create_new()
    
    if predictor and session_sequence_tracker is None:
        session_sequence_tracker = _init_session_sequence_tracker(session.session_id)
    
    return session, session_sequence_tracker


def prune_session_data(session: EnforcementSession) -> None:
    """
    Prune session data to prevent unbounded memory growth.
    """
    MAX_VIOLATIONS = 2000
    if len(session.violations) > MAX_VIOLATIONS:
        session.violations = session.violations[-MAX_VIOLATIONS:]
        logger.debug(
            f"Pruned violations list to {MAX_VIOLATIONS} most recent",
            operation="prune_session_data",
            violations_count=len(session.violations)
        )
    
    MAX_FILE_HASHES = 10000
    if session.file_hashes and len(session.file_hashes) > MAX_FILE_HASHES:
        oldest_keys = list(session.file_hashes.keys())[:-MAX_FILE_HASHES]
        for key in oldest_keys:
            del session.file_hashes[key]
        logger.debug(
            f"Pruned file_hashes to {MAX_FILE_HASHES} most recent",
            operation="prune_session_data",
            file_hashes_count=len(session.file_hashes)
        )
    
    MAX_CHECKS = 500
    if len(session.checks_passed) > MAX_CHECKS:
        session.checks_passed = session.checks_passed[-MAX_CHECKS:]
    if len(session.checks_failed) > MAX_CHECKS:
        session.checks_failed = session.checks_failed[-MAX_CHECKS:]


def save_session(session: EnforcementSession, enforcement_dir: Path) -> None:
    """
    Persist session state to disk (JSON).
    """
    prune_session_data(session)
    
    session_file = enforcement_dir / "session.json"
    try:
        session_dict = {
            "session_id": session.session_id,
            "start_time": session.start_time,
            "last_check": session.last_check,
            "violations": session.violations,
            "checks_passed": session.checks_passed,
            "checks_failed": session.checks_failed,
            "auto_fixes": session.auto_fixes,
            "file_hashes": session.file_hashes or {}
        }
        with open(session_file, 'w', encoding='utf-8') as f:
            json.dump(session_dict, f, indent=2)
    except (FileNotFoundError, PermissionError, OSError, TypeError) as exc:
        logger.error(
            "Failed to save session",
            operation="save_session",
            error_code="SESSION_SAVE_FAILED",
            root_cause=str(exc)
        )


def get_file_hash(
    file_path: Path,
    session: EnforcementSession,
    project_root: Optional[Path] = None
) -> Optional[str]:
    """
    Get SHA256 hash of file content with session-level caching.
    """
    resolved_path = Path(file_path)
    if not resolved_path.is_absolute() and project_root:
        resolved_path = (project_root / resolved_path).resolve()
    
    if not resolved_path.exists():
        return None
    
    file_path_str = str(resolved_path)
    
    try:
        stat_info = resolved_path.stat()
        cache_key = f"{file_path_str}:{stat_info.st_mtime}"
        
        if session.file_hashes is None:
            session.file_hashes = {}
        
        if cache_key in session.file_hashes:
            return session.file_hashes[cache_key]
        
        hasher = hashlib.sha256()
        with open(resolved_path, 'rb') as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hasher.update(chunk)
        hash_value = hasher.hexdigest()
        session.file_hashes[cache_key] = hash_value
        return hash_value
    except (OSError, FileNotFoundError, PermissionError, UnicodeDecodeError) as exc:
        logger.debug(
            f"Could not compute file hash: {resolved_path}",
            operation="get_file_hash",
            error_code="HASH_COMPUTE_FAILED",
            root_cause=str(exc)
        )
        return None