#!/usr/bin/env python3
"""
Context Categorizer
Categorizes files into core context (auto-loaded via rule files) vs dynamic context (loaded via @ mentions).

Last Updated: 2025-12-02
"""

import sys
from pathlib import Path
from typing import List, Tuple

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="context_categorizer")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("context_categorizer")


class ContextCategorizer:
    """
    Categorizes files into core vs dynamic context.
    
    Core context files are automatically loaded via rule files.
    Dynamic context files are loaded via @ mentions in instructions.
    """
    
    # Core file patterns (files that should be auto-loaded via rule files)
    CORE_PATTERNS = [
        'libs/common/prisma/schema.prisma',
        'docs/ARCHITECTURE.md',
        '.env.example',
        # Add more core patterns as needed
    ]
    
    # Files/directories to exclude from rule file generation
    EXCLUDE_FROM_RULES = [
        '.cursor/enforcement/rules/',
        '.cursor/enforcement/',
        'node_modules/',
        '.git/',
        '__pycache__/',
        '.next/',
        '.nuxt/',
        'dist/',
        'build/',
        '.cursor/context_manager/',
    ]
    
    def __init__(self):
        """Initialize context categorizer."""
        logger.info(
            "ContextCategorizer initialized",
            operation="__init__",
            core_patterns_count=len(self.CORE_PATTERNS)
        )
    
    def categorize(self, active_context: List[str], preloaded_context: List[str], 
                   context_to_unload: List[str] = None) -> Tuple[List[str], List[str]]:
        """
        Categorize files into core vs dynamic context.
        
        Args:
            active_context: List of active context file paths
            preloaded_context: List of preloaded context file paths
            context_to_unload: List of context files to unload (optional)
            
        Returns:
            Tuple of (core_files, dynamic_files)
        """
        if context_to_unload is None:
            context_to_unload = []
        
        # Combine all context files
        all_context = list(set(active_context + preloaded_context))
        
        core_files = []
        dynamic_files = []
        
        for file_path in all_context:
            # Skip if excluded
            if self._is_excluded(file_path):
                continue
            
            # Check if core file
            if self._is_core_file(file_path):
                core_files.append(file_path)
            else:
                dynamic_files.append(file_path)
        
        logger.info(
            "Files categorized",
            operation="categorize",
            total_files=len(all_context),
            core_files=len(core_files),
            dynamic_files=len(dynamic_files)
        )
        
        return core_files, dynamic_files
    
    def _is_core_file(self, file_path: str) -> bool:
        """
        Check if file matches core patterns.
        
        Args:
            file_path: File path to check
            
        Returns:
            True if file is a core file, False otherwise
        """
        # Normalize path separators
        normalized_path = file_path.replace('\\', '/')
        
        # Check against core patterns
        for pattern in self.CORE_PATTERNS:
            # Exact match
            if normalized_path == pattern:
                return True
            
            # Ends with pattern (for nested files)
            if normalized_path.endswith('/' + pattern) or normalized_path.endswith(pattern):
                return True
            
            # Pattern matching (simple substring for now)
            if pattern in normalized_path:
                return True
        
        return False
    
    def _is_excluded(self, file_path: str) -> bool:
        """
        Check if file should be excluded from rule file generation.
        
        Args:
            file_path: File path to check
            
        Returns:
            True if file should be excluded, False otherwise
        """
        # Normalize path separators
        normalized_path = file_path.replace('\\', '/')
        
        # Check against exclude patterns
        for exclude_pattern in self.EXCLUDE_FROM_RULES:
            if exclude_pattern in normalized_path:
                return True
        
        return False
    
    def is_rule_file(self, file_path: str) -> bool:
        """
        Check if file is a rule file.
        
        Args:
            file_path: File path to check
            
        Returns:
            True if file is a rule file, False otherwise
        """
        # Normalize path separators
        normalized_path = file_path.replace('\\', '/')
        
        # Check if in rules directory
        if '.cursor/enforcement/rules/' in normalized_path:
            return True
        
        # Check if ends with .mdc
        if normalized_path.endswith('.mdc'):
            return True
        
        return False
    
    def get_always_core_files(self, project_root: Path) -> List[str]:
        """
        Get list of CORE_PATTERNS files that exist.
        
        Returns list of file paths matching CORE_PATTERNS that exist in the project.
        This ensures "basics" are always loaded at session start.
        
        Args:
            project_root: Path to project root directory
            
        Returns:
            List of file paths matching CORE_PATTERNS that exist
        """
        always_core = []
        for pattern in self.CORE_PATTERNS:
            source_path = project_root / pattern
            if source_path.exists():
                always_core.append(pattern)
                logger.debug(
                    f"Core pattern file exists: {pattern}",
                    operation="get_always_core_files",
                    file_path=pattern
                )
        return always_core

