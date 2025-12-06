#!/usr/bin/env python3
"""
Context Profile Loader
Loads and manages context requirements for different task types.

Last Updated: 2025-12-04
"""

import yaml
from pathlib import Path
from typing import Dict, List, Optional, Set
from dataclasses import dataclass

# Add project root to path
import sys
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="context_loader")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("context_loader")


@dataclass(slots=True)  # Python 3.10+ - reduces memory by 4-5×
class ContextRequirement:
    """Represents a context file requirement."""
    file_path: str
    priority: str  # PRIMARY, HIGH, MEDIUM, LOW
    category: str  # required, optional, file_specific
    reason: Optional[str] = None


class ContextLoader:
    """Loads context profiles and determines required context files."""
    
    def __init__(self, profiles_file: Optional[Path] = None):
        """
        Initialize context loader.
        
        Args:
            profiles_file: Path to context_profiles.yaml (default: .cursor/context_manager/context_profiles.yaml)
        """
        if profiles_file is None:
            profiles_file = Path(__file__).parent / "context_profiles.yaml"
        
        self.profiles_file = profiles_file
        self.context_profiles: Dict = {}
        self.priority_levels: Dict = {}
        self.dependencies: Dict[str, List[str]] = {}
        self._load_profiles()
    
    def _load_profiles(self) -> None:
        """Load context profiles from YAML file."""
        try:
            with open(self.profiles_file, 'r', encoding='utf-8') as f:
                data = yaml.safe_load(f)
                self.context_profiles = data.get('context_profiles', {})
                self.priority_levels = data.get('priority_levels', {})
                self.dependencies = data.get('dependencies', {})
            
            logger.info(
                "Context profiles loaded",
                operation="_load_profiles",
                profiles=len(self.context_profiles)
            )
        except Exception as e:
            logger.error(
                f"Failed to load context profiles: {e}",
                operation="_load_profiles",
                error_code="LOAD_FAILED",
                root_cause=str(e)
            )
            self.context_profiles = {}
            self.priority_levels = {}
            self.dependencies = {}
    
    def get_required_context(self, task_type: str, language: Optional[str] = None,
                            file_paths: Optional[List[str]] = None) -> List[ContextRequirement]:
        """
        Get required context files for a task type.
        
        Args:
            task_type: The primary task type (e.g., 'edit_code', 'run_tests')
            language: Programming language ('python', 'typescript', etc.)
            file_paths: List of file paths being modified (for file-specific context)
            
        Returns:
            List of ContextRequirement objects
        """
        requirements = []
        
        # Get base profile for task type
        task_profile = self.context_profiles.get(task_type, {})
        
        if not task_profile:
            logger.warning(
                f"No context profile found for task type: {task_type}",
                operation="get_required_context",
                task_type=task_type
            )
            return requirements
        
        # Determine language-specific context
        if language:
            lang_profile = task_profile.get(language, {})
        else:
            # Try to infer language from file paths
            inferred_language = self._infer_language(file_paths)
            if inferred_language:
                language = inferred_language
                lang_profile = task_profile.get(language, {})
            else:
                # No language detected, use 'all' profile if available
                lang_profile = task_profile.get('all', {})
        
        # Add required context
        required_files = lang_profile.get('required', [])
        for file_path in required_files:
            requirements.append(ContextRequirement(
                file_path=file_path,
                priority='PRIMARY',
                category='required',
                reason=f"Required for {task_type} tasks"
            ))
        
        # Add optional context
        optional_files = lang_profile.get('optional', [])
        for file_path in optional_files:
            requirements.append(ContextRequirement(
                file_path=file_path,
                priority='MEDIUM',
                category='optional',
                reason=f"Optional for {task_type} tasks"
            ))
        
        # Add file-specific context with priority from YAML metadata
        # MINIMAL LOADING: Only load file-specific contexts for PRIMARY file types (most common)
        if file_paths:
            file_specific = lang_profile.get('file_specific', {})
            # Get priority overrides from _priority section
            priority_overrides = file_specific.get('_priority', {})
            
            # Count file types to find PRIMARY file type (most common)
            file_type_counts = {}
            for file_path in file_paths:
                file_type = self._classify_file_type(file_path)
                file_type_counts[file_type] = file_type_counts.get(file_type, 0) + 1
            
            # Only load file-specific contexts for PRIMARY file type (most common, or if >20% of files)
            # This prevents loading contexts for all file types when many files are changed
            if file_type_counts:
                # Find PRIMARY file type (most common, or first if tie)
                primary_file_type = max(file_type_counts.items(), key=lambda x: x[1])[0]
                primary_count = file_type_counts[primary_file_type]
                total_files = len(file_paths)
                primary_percentage = (primary_count / total_files) * 100 if total_files > 0 else 0
                
                # Only load file-specific contexts if:
                # 1. PRIMARY file type represents >30% of changed files (more selective)
                # 2. PRIMARY file type has HIGH priority override (critical contexts) AND >10% of files
                # This ensures minimal loading - only load if truly needed
                should_load_file_specific = (
                    (primary_percentage > 30) or  # More selective: >30% instead of >20%
                    (priority_overrides.get(primary_file_type, 'MEDIUM') == 'HIGH' and primary_percentage > 10)
                )
                
                if should_load_file_specific and primary_file_type in file_specific:
                    # Get priority for this file type (default: MEDIUM, can be HIGH)
                    priority = priority_overrides.get(primary_file_type, 'MEDIUM')
                    
                    for specific_file in file_specific[primary_file_type]:
                        # Skip _priority metadata entries
                        if specific_file == '_priority':
                            continue
                        
                        requirements.append(ContextRequirement(
                            file_path=specific_file,
                            priority=priority,  # Use priority from YAML (HIGH or MEDIUM)
                            category='file_specific',
                            reason=f"File-specific context for {primary_file_type} files ({primary_count}/{total_files} files, {primary_percentage:.0f}%, priority: {priority})"
                        ))
        
        # Remove duplicates while preserving highest priority
        # CRITICAL: If a file is both required and file_specific, keep it as required (PRIMARY)
        seen = {}
        unique_requirements = []
        for req in requirements:
            if req.file_path not in seen:
                seen[req.file_path] = req
                unique_requirements.append(req)
            else:
                # If duplicate exists, keep the one with higher priority
                existing = seen[req.file_path]
                if self._priority_rank(req.priority) > self._priority_rank(existing.priority):
                    # Replace with higher priority version
                    unique_requirements.remove(existing)
                    seen[req.file_path] = req
                    unique_requirements.append(req)
                # If same priority, prefer required over file_specific
                elif (self._priority_rank(req.priority) == self._priority_rank(existing.priority) and
                      req.category == 'required' and existing.category == 'file_specific'):
                    unique_requirements.remove(existing)
                    seen[req.file_path] = req
                    unique_requirements.append(req)
        
        # Expand with dependencies (recursively load dependency chain)
        expanded = self._expand_with_dependencies(unique_requirements)
        
        return expanded
    
    def _infer_language(self, file_paths: Optional[List[str]]) -> Optional[str]:
        """
        Infer programming language from file paths.
        
        Args:
            file_paths: List of file paths
            
        Returns:
            Language name ('python', 'typescript', etc.) or None if no files
        """
        if not file_paths:
            return None  # Changed from 'all' to None to align with preloader
        
        python_extensions = {'.py', '.pyi'}
        typescript_extensions = {'.ts', '.tsx'}
        
        for file_path in file_paths:
            path = Path(file_path)
            if path.suffix in python_extensions:
                return 'python'
            elif path.suffix in typescript_extensions:
                return 'typescript'
        
        return 'all'
    
    def _classify_file_type(self, file_path: str) -> str:
        """
        Classify file type for file-specific context.
        
        Args:
            file_path: Path to the file
            
        Returns:
            File type classification ('database', 'api', 'auth', 'component', etc.)
        """
        path_lower = file_path.lower()
        
        # Database files
        if 'prisma' in path_lower or 'schema' in path_lower or '.sql' in path_lower:
            return 'database'
        
        # Auth files
        if 'auth' in path_lower or 'login' in path_lower or 'token' in path_lower:
            return 'auth'
        
        # API files
        if 'api' in path_lower or 'controller' in path_lower or 'service' in path_lower:
            return 'api'
        
        # Component files (frontend)
        if 'component' in path_lower or path_lower.endswith('.tsx'):
            return 'component'
        
        # API client files
        if 'client' in path_lower or 'api' in path_lower:
            return 'api_client'
        
        return 'generic'
    
    def _expand_with_dependencies(
        self,
        requirements: List[ContextRequirement]
    ) -> List[ContextRequirement]:
        """
        Recursively add dependency files for all requirements.
        
        - If dependency already present, keep highest priority.
        - If dependency not present, add as HIGH priority.
        - Handles circular dependencies by tracking visited nodes.
        
        Args:
            requirements: List of base context requirements
            
        Returns:
            List of requirements with dependencies expanded
        """
        result: Dict[str, ContextRequirement] = {r.file_path: r for r in requirements}
        visited: Set[str] = set()
        
        def dfs(file_path: str, parent_priority: str = 'PRIMARY'):
            """
            Depth-first search to recursively load dependencies.
            
            MINIMAL LOADING: Only expand dependencies for PRIMARY priority requirements,
            not for HIGH priority file-specific contexts. This prevents dependency explosion.
            """
            if file_path in visited:
                return
            visited.add(file_path)
            
            # Only expand dependencies for PRIMARY priority requirements
            # Skip dependency expansion for HIGH priority file-specific contexts
            if parent_priority != 'PRIMARY':
                return
            
            deps = self.dependencies.get(file_path, [])
            for dep in deps:
                existing = result.get(dep)
                if existing is None:
                    # New dependency: treat as HIGH priority dependency
                    result[dep] = ContextRequirement(
                        file_path=dep,
                        priority="HIGH",
                        category="dependency",
                        reason=f"Dependency of {file_path}"
                    )
                else:
                    # If already present, upgrade priority if needed
                    if self._priority_rank(existing.priority) < self._priority_rank("HIGH"):
                        result[dep] = ContextRequirement(
                            file_path=dep,
                            priority="HIGH",
                            category=existing.category if existing.category != "optional" else "dependency",
                            reason=existing.reason + f"; upgraded as dependency of {file_path}"
                        )
                # Recursively load dependencies of this dependency (only if PRIMARY)
                dfs(dep, parent_priority='PRIMARY' if existing and existing.priority == 'PRIMARY' else 'HIGH')
        
        # Expand dependencies only for PRIMARY requirements (minimal loading)
        # MINIMAL: Only expand direct dependencies, not recursive chains
        for req in list(requirements):
            if req.priority == 'PRIMARY' and req.category == 'required':
                # Only expand dependencies for required PRIMARY files, not file-specific
                dfs(req.file_path, parent_priority='PRIMARY')
        
        return list(result.values())
    
    def _priority_rank(self, priority: str) -> int:
        """
        Get numeric rank for priority (higher = more important).
        
        Args:
            priority: Priority string (PRIMARY, HIGH, MEDIUM, LOW)
            
        Returns:
            Numeric rank
        """
        ranks = {
            'PRIMARY': 4,
            'HIGH': 3,
            'MEDIUM': 2,
            'LOW': 1
        }
        return ranks.get(priority, 0)

