#!/usr/bin/env python3
"""
Rule File Manager
Manages dynamic context rule files in .cursor/enforcement/rules/context/ directory.

Features:
- Creates rule files for core context files (schema.prisma, ARCHITECTURE.md, etc.)
- Updates rule files when source files change (mtime comparison)
- Deletes rule files when context is unloaded
- Triggers Cursor auto-save after file operations
- Enforces file size limits (10K lines / 100KB max)

Last Updated: 2025-12-02
"""

import os
import sys
import re
from pathlib import Path
from typing import List, Dict, Set, Optional
from datetime import datetime, timezone
from threading import Timer

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="rule_file_manager")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("rule_file_manager")


class RuleFileManager:
    """
    Manages dynamic context rule files.
    
    Creates, updates, and deletes rule files in .cursor/enforcement/rules/context/ directory
    based on core context files that should be auto-loaded.
    """
    
    # File size limits
    MAX_RULE_FILE_SIZE = 10000  # lines
    MAX_RULE_FILE_BYTES = 100_000  # bytes
    
    def __init__(self, rules_dir: Optional[Path] = None):
        """
        Initialize rule file manager.
        
        Args:
            rules_dir: Path to rules directory (default: .cursor/enforcement/rules/context)
        """
        self.project_root = project_root
        if rules_dir is None:
            # Two-Brain Model: Generate context files in enforcement/rules/context/ (enforcer-only)
            # LLM doesn't need these files - they're for enforcer's internal context management
            self.rules_dir = self.project_root / ".cursor" / "enforcement" / "rules" / "context"
        else:
            self.rules_dir = Path(rules_dir)
        
        # Ensure rules directory exists
        self.rules_dir.mkdir(parents=True, exist_ok=True)
        
        logger.info(
            "RuleFileManager initialized",
            operation="__init__",
            rules_dir=str(self.rules_dir)
        )
    
    def sync_context_files(self, core_context: List[str], context_to_remove: List[str]) -> Dict:
        """
        Synchronize rule files with core context files.
        
        Creates rule files for new core files, updates changed files,
        and deletes rule files for files in context_to_remove.
        
        Args:
            core_context: List of core context file paths to create/update
            context_to_remove: List of file paths to remove from rule files
            
        Returns:
            Dict with keys: 'created', 'updated', 'deleted', 'unchanged', 'skipped'
        """
        result = {
            'created': [],
            'updated': [],
            'deleted': [],
            'unchanged': [],
            'skipped': []
        }
        
        # Track valid rule files (for cleanup)
        valid_rule_files: Set[str] = set()
        
        # Process core context files
        for file_path in core_context:
            # Strip @ prefix if present (from recommendations.md @ mentions)
            file_path = file_path.lstrip('@').strip()
            
            try:
                source_path = self.project_root / file_path
                if not source_path.exists():
                    logger.warn(
                        f"Source file does not exist: {file_path}",
                        operation="sync_context_files",
                        file_path=file_path
                    )
                    result['skipped'].append(file_path)
                    continue
                
                rule_file = self._get_rule_file_path(file_path)
                valid_rule_files.add(str(rule_file))
                
                # Check if rule file exists
                if rule_file.exists():
                    # Check if update needed
                    if self._should_update_rule_file(str(source_path), rule_file):
                        # Update rule file
                        self._create_rule_file(str(source_path), rule_file)
                        result['updated'].append(str(rule_file))
                        logger.info(
                            "Rule file updated",
                            operation="sync_context_files",
                            source_file=file_path,
                            rule_file=str(rule_file)
                        )
                    else:
                        result['unchanged'].append(str(rule_file))
                else:
                    # Create new rule file
                    self._create_rule_file(str(source_path), rule_file)
                    result['created'].append(str(rule_file))
                    logger.info(
                        "Rule file created",
                        operation="sync_context_files",
                        source_file=file_path,
                        rule_file=str(rule_file)
                    )
            except Exception as e:
                logger.error(
                    f"Failed to sync rule file for {file_path}: {e}",
                    operation="sync_context_files",
                    error_code="SYNC_FAILED",
                    root_cause=str(e),
                    file_path=file_path
                )
                result['skipped'].append(file_path)
        
        # Process files to remove
        for file_path in context_to_remove:
            # Strip @ prefix if present (from recommendations.md @ mentions)
            file_path = file_path.lstrip('@').strip()
            
            try:
                rule_file = self._get_rule_file_path(file_path)
                if rule_file.exists():
                    rule_file.unlink()
                    result['deleted'].append(str(rule_file))
                    logger.info(
                        "Rule file deleted",
                        operation="sync_context_files",
                        source_file=file_path,
                        rule_file=str(rule_file)
                    )
            except Exception as e:
                logger.error(
                    f"Failed to delete rule file for {file_path}: {e}",
                    operation="sync_context_files",
                    error_code="DELETE_FAILED",
                    root_cause=str(e),
                    file_path=file_path
                )
        
        # Cleanup stale rule files
        self.cleanup_stale_rule_files(valid_rule_files)
        
        # Trigger auto-save after batch operations
        if result['created'] or result['deleted']:
            self._trigger_cursor_auto_save(self.rules_dir)
        
        return result
    
    def update_rule_file(self, source_path: str) -> bool:
        """
        Update a single rule file when source file changes.
        
        Args:
            source_path: Path to source file (relative to project root or absolute)
            
        Returns:
            True if rule file was updated, False otherwise
        """
        try:
            # Convert to Path and make relative if needed
            source_file = Path(source_path)
            if source_file.is_absolute():
                try:
                    source_file = source_file.relative_to(self.project_root)
                except ValueError:
                    # Not relative to project root, use as-is
                    pass
            
            # Get rule file path
            rule_file = self._get_rule_file_path(str(source_file))
            
            # Check if source file exists
            full_source_path = self.project_root / source_file
            if not full_source_path.exists():
                logger.warn(
                    f"Source file does not exist: {source_file}",
                    operation="update_rule_file",
                    source_file=str(source_file)
                )
                return False
            
            # Check if update needed
            if rule_file.exists() and not self._should_update_rule_file(str(full_source_path), rule_file):
                return False  # No update needed
            
            # Update rule file
            self._create_rule_file(str(full_source_path), rule_file)
            self._trigger_cursor_auto_save(rule_file)
            
            logger.info(
                "Rule file updated",
                operation="update_rule_file",
                source_file=str(source_file),
                rule_file=str(rule_file)
            )
            return True
            
        except Exception as e:
            logger.error(
                f"Failed to update rule file for {source_path}: {e}",
                operation="update_rule_file",
                error_code="UPDATE_FAILED",
                root_cause=str(e),
                source_path=source_path
            )
            return False
    
    def _get_rule_file_path(self, file_path: str) -> Path:
        """
        Convert file path to rule file name.
        
        Args:
            file_path: Source file path (relative to project root)
            
        Returns:
            Path to rule file in .cursor/enforcement/rules/context/
        """
        # Remove leading slash/dot if present
        clean_path = file_path.lstrip('/').lstrip('.')
        
        # Replace path separators and dots with underscores
        # Keep only alphanumeric, underscores, and hyphens
        rule_name = re.sub(r'[^\w\-]', '_', clean_path)
        
        # Remove multiple consecutive underscores
        rule_name = re.sub(r'_+', '_', rule_name)
        
        # Remove leading/trailing underscores
        rule_name = rule_name.strip('_')
        
        # Ensure it ends with .mdc
        if not rule_name.endswith('.mdc'):
            # Extract base name from original path for readability
            base_name = Path(file_path).stem
            extension = Path(file_path).suffix.lstrip('.')
            if extension:
                rule_name = f"{base_name}_{extension}.mdc"
            else:
                rule_name = f"{base_name}.mdc"
        
        # Prefix with "context-" to identify as core context rule files
        # This ensures they're loaded by Cursor and sorted after numbered rules (00-14)
        if not rule_name.startswith('context-'):
            rule_name = f"context-{rule_name}"
        
        return self.rules_dir / rule_name
    
    def _should_update_rule_file(self, source_path: str, rule_file: Path) -> bool:
        """
        Check if rule file needs to be updated based on mtime comparison.
        
        Args:
            source_path: Path to source file
            rule_file: Path to rule file
            
        Returns:
            True if rule file should be updated, False otherwise
        """
        if not rule_file.exists():
            return True  # Rule file doesn't exist, needs creation
        
        try:
            source_mtime = os.path.getmtime(source_path)
            rule_mtime = os.path.getmtime(rule_file)
            
            # Update if source file is newer
            return source_mtime > rule_mtime
        except OSError as e:
            logger.warn(
                f"Failed to compare mtimes: {e}",
                operation="_should_update_rule_file",
                source_path=source_path,
                rule_file=str(rule_file)
            )
            # If we can't compare, assume update needed
            return True
    
    def _should_embed_in_rule(self, source_path: str) -> bool:
        """
        Check if file should be embedded in rule file based on size limits.
        
        Args:
            source_path: Path to source file
            
        Returns:
            True if file should be embedded, False if it's too large
        """
        try:
            # Check file size in bytes
            file_size = os.path.getsize(source_path)
            if file_size > self.MAX_RULE_FILE_BYTES:
                return False
            
            # Check line count
            with open(source_path, 'r', encoding='utf-8', errors='ignore') as f:
                line_count = sum(1 for _ in f)
                if line_count > self.MAX_RULE_FILE_SIZE:
                    return False
            
            return True
        except Exception as e:
            logger.warn(
                f"Failed to check file size: {e}",
                operation="_should_embed_in_rule",
                source_path=source_path
            )
            # If we can't check, assume it's okay (will fail later if too large)
            return True
    
    def _create_rule_file(self, source_path: str, rule_file: Path):
        """
        Create or update a rule file with embedded content.
        
        Args:
            source_path: Path to source file
            rule_file: Path to rule file to create/update
        """
        try:
            # Check if file should be embedded
            if not self._should_embed_in_rule(source_path):
                logger.warn(
                    f"File too large to embed in rule file: {source_path}",
                    operation="_create_rule_file",
                    source_path=source_path,
                    rule_file=str(rule_file)
                )
                # Create rule file with instruction to load manually
                content = self._generate_rule_content_instruction_only(source_path)
            else:
                # Read source file content
                with open(source_path, 'r', encoding='utf-8', errors='ignore') as f:
                    file_content = f.read()
                
                # Generate rule file content
                content = self._generate_rule_content(source_path, file_content)
            
            # Write rule file
            rule_file.write_text(content, encoding='utf-8')
            
            # Trigger auto-save
            self._trigger_cursor_auto_save(rule_file)
            
        except Exception as e:
            logger.error(
                f"Failed to create rule file: {e}",
                operation="_create_rule_file",
                error_code="CREATE_FAILED",
                root_cause=str(e),
                source_path=source_path,
                rule_file=str(rule_file)
            )
            raise
    
    def _generate_rule_content(self, source_path: str, content: str) -> str:
        """
        Generate rule file markdown content with embedded file content.
        
        Args:
            source_path: Path to source file (relative to project root)
            content: Content of source file
            
        Returns:
            Markdown content for rule file
        """
        # Get relative path from project root
        try:
            rel_path = str(Path(source_path).relative_to(self.project_root))
        except ValueError:
            # If absolute path, try to make it relative
            if Path(source_path).is_absolute():
                try:
                    rel_path = str(Path(source_path).relative_to(self.project_root))
                except ValueError:
                    rel_path = source_path
            else:
                rel_path = source_path
        
        # Get file extension for code block language
        ext = Path(source_path).suffix.lstrip('.')
        lang_map = {
            'prisma': 'prisma',
            'md': 'markdown',
            'ts': 'typescript',
            'tsx': 'typescript',
            'js': 'javascript',
            'jsx': 'javascript',
            'py': 'python',
            'yaml': 'yaml',
            'yml': 'yaml',
            'json': 'json',
        }
        lang = lang_map.get(ext, 'text')
        
        rule_content = f"""# Core Context: {rel_path}

**Auto-generated rule file for core context management.**

**Source File:** `{rel_path}`  
**Last Updated:** {datetime.now(timezone.utc).isoformat()}

This file is automatically loaded by Cursor at session start.  
No @ mention needed - it's already in context.

---

## File Content

```{lang}
{content}
```

---

*This file is auto-generated. Do not edit manually.*
*To update, modify the source file: `{rel_path}`*
"""
        return rule_content
    
    def _generate_rule_content_instruction_only(self, source_path: str) -> str:
        """
        Generate rule file markdown content with instruction to load manually.
        
        Used when source file is too large to embed.
        
        Args:
            source_path: Path to source file (relative to project root)
            
        Returns:
            Markdown content for rule file
        """
        # Get relative path from project root
        try:
            rel_path = str(Path(source_path).relative_to(self.project_root))
        except ValueError:
            rel_path = source_path
        
        rule_content = f"""# Core Context: {rel_path}

**Auto-generated rule file for core context management.**

**Source File:** `{rel_path}`  
**Last Updated:** {datetime.now(timezone.utc).isoformat()}

⚠️ **File too large to embed** (exceeds {self.MAX_RULE_FILE_SIZE:,} lines or {self.MAX_RULE_FILE_BYTES:,} bytes).

**Action Required:** Load this file manually with @ mention:
- `@{rel_path}`

---

*This file is auto-generated. Do not edit manually.*
*To update, modify the source file: `{rel_path}`*
"""
        return rule_content
    
    def get_active_rule_files(self) -> List[str]:
        """
        Get list of active rule files.
        
        Returns:
            List of rule file paths (relative to project root)
        """
        rule_files = []
        if self.rules_dir.exists():
            for rule_file in self.rules_dir.glob("*.mdc"):
                rule_files.append(str(rule_file.relative_to(self.project_root)))
        return sorted(rule_files)
    
    def cleanup_stale_rule_files(self, valid_files: Set[str]):
        """
        Remove rule files that are no longer valid.
        
        Args:
            valid_files: Set of valid rule file paths (as strings)
        """
        if not self.rules_dir.exists():
            return
        
        for rule_file in self.rules_dir.glob("*.mdc"):
            rule_file_str = str(rule_file)
            if rule_file_str not in valid_files:
                try:
                    rule_file.unlink()
                    logger.info(
                        "Stale rule file removed",
                        operation="cleanup_stale_rule_files",
                        rule_file=str(rule_file)
                    )
                except Exception as e:
                    logger.warn(
                        f"Failed to remove stale rule file: {e}",
                        operation="cleanup_stale_rule_files",
                        error_code="CLEANUP_FAILED",
                        root_cause=str(e),
                        rule_file=str(rule_file)
                    )
    
    def _trigger_cursor_auto_save(self, rule_file: Path):
        """
        Trigger Cursor to detect rule file changes.
        
        Uses multiple strategies to ensure Cursor detects changes:
        - Touch file to update mtime (if file exists)
        - Touch parent directory to trigger refresh
        - Platform-specific file system notifications (if available)
        
        Args:
            rule_file: Path to rule file (or directory for batch operations)
        """
        try:
            # Strategy 1: Touch the file itself (updates mtime)
            if rule_file.exists() and rule_file.is_file():
                rule_file.touch()
                logger.debug(
                    "Touched rule file to trigger Cursor detection",
                    operation="_trigger_cursor_auto_save",
                    file_path=str(rule_file)
                )
            
            # Strategy 2: Touch parent directory (triggers directory refresh)
            if rule_file.is_file():
                parent_dir = rule_file.parent
            else:
                parent_dir = rule_file
            
            if parent_dir.exists():
                # Create/update a marker file to trigger directory change
                marker_file = parent_dir / ".cursor_rule_update_marker"
                marker_file.touch()
                # Clean up marker after a short delay (optional)
                # Timer(0.1, lambda: marker_file.unlink(missing_ok=True)).start()
                logger.debug(
                    "Touched parent directory to trigger Cursor refresh",
                    operation="_trigger_cursor_auto_save",
                    directory=str(parent_dir)
                )
            
            # Strategy 3: Platform-specific notifications (Windows)
            # File watcher (watchdog) should detect the change automatically
            # No additional action needed
            
        except Exception as e:
            logger.warn(
                "Failed to trigger Cursor auto-save",
                operation="_trigger_cursor_auto_save",
                error_code="AUTO_SAVE_TRIGGER_FAILED",
                root_cause=str(e),
                file_path=str(rule_file)
            )

