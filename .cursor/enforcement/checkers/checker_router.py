"""
Intelligent checker routing based on file changes and rule metadata.

Python Bible Chapter 12: Performance optimization.
"""

from pathlib import Path
from typing import List, Dict, Optional, Set
from collections import defaultdict

from .base_checker import BaseChecker, CheckerResult
from .rule_metadata import get_rule_metadata
from .pattern_matcher import match_file_patterns, get_matching_files
from .exceptions import RuleMetadataError


class CheckerRouter:
    """
    Routes checkers to run based on changed files and rule metadata.
    
    Implements intelligent routing:
    - Always runs checkers with alwaysApply: true
    - Only runs other checkers if their file patterns match changed files
    """
    
    def __init__(self, project_root: Path, rules_dir: Path):
        """
        Initialize the router.
        
        Args:
            project_root: Root directory of the project
            rules_dir: Directory containing rule files (.mdc files)
        """
        self.project_root = project_root
        self.rules_dir = rules_dir
        self._checker_cache: Dict[str, BaseChecker] = {}
        self._metadata_cache: Dict[str, Dict] = {}
    
    def get_checkers_to_run(
        self,
        changed_files: List[str],
        available_checkers: Dict[str, type]
    ) -> List[BaseChecker]:
        """
        Determine which checkers should run based on changed files.
        
        Args:
            changed_files: List of file paths that have changed
            available_checkers: Dictionary mapping rule_ref to checker class
            
        Returns:
            List of checker instances that should run
        """
        checkers_to_run = []
        
        # Load metadata for all rules
        rule_files = list(self.rules_dir.glob("*.mdc"))
        
        for rule_file in rule_files:
            rule_ref = rule_file.name
            
            # Skip if no checker available for this rule
            if rule_ref not in available_checkers:
                continue
            
            # Get metadata (cached)
            try:
                metadata = self._get_rule_metadata(rule_file)
            except RuleMetadataError:
                # Skip if metadata cannot be parsed
                continue
            
            # Check if should run
            should_run = False
            
            if metadata.get('alwaysApply', False):
                # Always run if alwaysApply is true
                should_run = True
            else:
                # Check if any changed files match the rule's patterns
                patterns = metadata.get('globs', []) or metadata.get('filePatterns', [])
                if patterns:
                    matching_files = get_matching_files(changed_files, patterns)
                    if matching_files:
                        should_run = True
                else:
                    # No patterns specified - run by default (conservative)
                    should_run = True
            
            if should_run:
                # Get or create checker instance
                checker = self._get_checker(rule_ref, rule_file, metadata, available_checkers)
                if checker:
                    checkers_to_run.append(checker)
        
        return checkers_to_run
    
    def _get_rule_metadata(self, rule_file: Path) -> Dict:
        """Get rule metadata (with caching)."""
        rule_ref = rule_file.name
        if rule_ref not in self._metadata_cache:
            self._metadata_cache[rule_ref] = get_rule_metadata(rule_file)
        return self._metadata_cache[rule_ref]
    
    def _get_checker(
        self,
        rule_ref: str,
        rule_file: Path,
        metadata: Dict,
        available_checkers: Dict[str, type]
    ) -> Optional[BaseChecker]:
        """Get or create checker instance (with caching)."""
        if rule_ref not in self._checker_cache:
            checker_class = available_checkers[rule_ref]
            always_apply = metadata.get('alwaysApply', False)
            checker = checker_class(
                project_root=self.project_root,
                rule_file=rule_file,
                rule_ref=rule_ref,
                always_apply=always_apply
            )
            self._checker_cache[rule_ref] = checker
        return self._checker_cache[rule_ref]
    
    def clear_cache(self):
        """Clear checker and metadata caches."""
        self._checker_cache.clear()
        self._metadata_cache.clear()



