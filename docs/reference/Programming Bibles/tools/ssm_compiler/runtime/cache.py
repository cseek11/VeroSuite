"""
Content Hashing & Delta Detection (Phase 9)

Implements incremental compilation with content hashing and caching.
"""
from __future__ import annotations

import hashlib
import json
import sys
import importlib.util
from pathlib import Path
from typing import Dict, Any, Optional, Set
from dataclasses import dataclass, field, asdict
from datetime import datetime

# Import structured logger
_project_root = Path(__file__).parent.parent.parent.parent.parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

logger_util_path = _project_root / ".cursor" / "scripts" / "logger_util.py"
if logger_util_path.exists():
    spec = importlib.util.spec_from_file_location("logger_util", logger_util_path)
    logger_util = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(logger_util)
    get_logger = logger_util.get_logger
    logger = get_logger("compile_cache")
else:
    logger = None


@dataclass
class ChapterHash:
    """Hash information for a chapter."""
    chapter_code: str
    content_hash: str
    line_range: tuple[int, int]  # (start_line, end_line)
    block_count: int = 0
    last_modified: str = ""
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "chapter_code": self.chapter_code,
            "content_hash": self.content_hash,
            "line_range": self.line_range,
            "block_count": self.block_count,
            "last_modified": self.last_modified
        }


@dataclass
class CompileState:
    """State information for incremental compilation."""
    source_file: str
    source_hash: str
    compiler_version: str
    ssm_schema_version: str
    namespace: str
    chapter_hashes: Dict[str, ChapterHash] = field(default_factory=dict)
    total_blocks: int = 0
    last_compile_time: str = ""
    cached_blocks: Set[str] = field(default_factory=set)  # Block IDs that can be reused
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "source_file": self.source_file,
            "source_hash": self.source_hash,
            "compiler_version": self.compiler_version,
            "ssm_schema_version": self.ssm_schema_version,
            "namespace": self.namespace,
            "chapter_hashes": {k: v.to_dict() for k, v in self.chapter_hashes.items()},
            "total_blocks": self.total_blocks,
            "last_compile_time": self.last_compile_time,
            "cached_blocks": list(self.cached_blocks)
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "CompileState":
        """Create from dictionary."""
        state = cls(
            source_file=data["source_file"],
            source_hash=data["source_hash"],
            compiler_version=data["compiler_version"],
            ssm_schema_version=data["ssm_schema_version"],
            namespace=data["namespace"],
            total_blocks=data.get("total_blocks", 0),
            last_compile_time=data.get("last_compile_time", ""),
            cached_blocks=set(data.get("cached_blocks", []))
        )
        
        # Restore chapter hashes
        for code, hash_data in data.get("chapter_hashes", {}).items():
            state.chapter_hashes[code] = ChapterHash(
                chapter_code=hash_data["chapter_code"],
                content_hash=hash_data["content_hash"],
                line_range=tuple(hash_data["line_range"]),
                block_count=hash_data.get("block_count", 0),
                last_modified=hash_data.get("last_modified", "")
            )
        
        return state


def compute_content_hash(content: str) -> str:
    """
    Compute SHA256 hash of content.
    
    Args:
        content: Content to hash
        
    Returns:
        Hex digest of hash
    """
    return hashlib.sha256(content.encode('utf-8')).hexdigest()


def compute_chapter_hash(chapter_lines: list[str], chapter_code: str) -> ChapterHash:
    """
    Compute hash for a chapter.
    
    Args:
        chapter_lines: Lines of chapter content
        chapter_code: Chapter code (e.g., "CH-01")
        
    Returns:
        ChapterHash object
    """
    content = "\n".join(chapter_lines)
    content_hash = compute_content_hash(content)
    
    return ChapterHash(
        chapter_code=chapter_code,
        content_hash=content_hash,
        line_range=(0, len(chapter_lines)),  # Will be updated with actual line numbers
        block_count=0,  # Will be updated after compilation
        last_modified=datetime.now().isoformat()
    )


class CompileCache:
    """Manages compilation cache for incremental builds."""
    
    def __init__(self, cache_file: Optional[Path] = None):
        """
        Initialize cache.
        
        Args:
            cache_file: Path to cache file (default: .biblec.state.json)
        """
        if cache_file is None:
            cache_file = Path(".biblec.state.json")
        self.cache_file = Path(cache_file)
        self.state: Optional[CompileState] = None
    
    def load(self) -> Optional[CompileState]:
        """
        Load cached state from file.
        
        Returns:
            CompileState if cache exists, None otherwise
        """
        if not self.cache_file.exists():
            return None
        
        try:
            with open(self.cache_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            self.state = CompileState.from_dict(data)
            return self.state
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            if logger:
                logger.warn(
                    "Could not load cache",
                    operation="load",
                    error_code="CACHE_LOAD_FAILED",
                    root_cause=str(e),
                    cache_file=str(self.cache_file)
                )
            return None
    
    def save(self, state: CompileState) -> None:
        """
        Save state to cache file.
        
        Args:
            state: CompileState to save
        """
        self.state = state
        state.last_compile_time = datetime.now().isoformat()
        
        try:
            with open(self.cache_file, 'w', encoding='utf-8') as f:
                json.dump(state.to_dict(), f, indent=2, default=str)
        except (IOError, OSError, PermissionError) as e:
            if logger:
                logger.warn(
                    "Could not save cache",
                    operation="save",
                    error_code="CACHE_SAVE_FAILED",
                    root_cause=str(e),
                    cache_file=str(self.cache_file)
                )
        except Exception as e:
            if logger:
                logger.error(
                    "Unexpected error saving cache",
                    operation="save",
                    error_code="CACHE_SAVE_UNEXPECTED",
                    root_cause=str(e),
                    cache_file=str(self.cache_file),
                    exc_info=True
                )
    
    def get_changed_chapters(
        self,
        source_file: str,
        source_hash: str,
        chapter_hashes: Dict[str, ChapterHash]
    ) -> Set[str]:
        """
        Get list of chapters that have changed since last compile.
        
        Args:
            source_file: Path to source file
            source_hash: Hash of source file
            chapter_hashes: Current chapter hashes
            
        Returns:
            Set of chapter codes that have changed
        """
        if not self.state:
            # No cache, all chapters need compilation
            return set(chapter_hashes.keys())
        
        # Check if source file changed
        if self.state.source_file != source_file or self.state.source_hash != source_hash:
            # Source changed, all chapters need recompilation
            return set(chapter_hashes.keys())
        
        # Check individual chapters
        changed = set()
        for code, current_hash in chapter_hashes.items():
            cached_hash = self.state.chapter_hashes.get(code)
            if not cached_hash or cached_hash.content_hash != current_hash.content_hash:
                changed.add(code)
        
        return changed
    
    def get_cached_blocks(self) -> Set[str]:
        """
        Get set of block IDs that can be reused from cache.
        
        Returns:
            Set of block IDs
        """
        if not self.state:
            return set()
        return self.state.cached_blocks.copy()
    
    def clear(self) -> None:
        """Clear cache."""
        if self.cache_file.exists():
            self.cache_file.unlink()
        self.state = None

