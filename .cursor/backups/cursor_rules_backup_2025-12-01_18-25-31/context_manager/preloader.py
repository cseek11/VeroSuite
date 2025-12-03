#!/usr/bin/env python3
"""
Context Pre-loading Engine
Manages active vs preloaded context based on predictions.

Last Updated: 2025-12-01
"""

from typing import Dict, List, Optional
from pathlib import Path
import json

# Add project root to path
import sys
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="preloader")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("preloader")

from .predictor import ContextPredictor, TaskPrediction
from .context_loader import ContextLoader, ContextRequirement


class ContextPreloader:
    """Manages what's loaded NOW and what's pre-loaded for NEXT."""
    
    # Probability threshold for pre-loading (>70%)
    PRELOAD_THRESHOLD = 0.70
    
    def __init__(self, predictor: ContextPredictor, context_loader: ContextLoader, 
                 state_file: Optional[Path] = None):
        """
        Initialize context preloader.
        
        Args:
            predictor: ContextPredictor instance
            context_loader: ContextLoader instance
            state_file: Path to context_state.json for persistence (default: .cursor/context_manager/context_state.json)
        """
        self.predictor = predictor
        self.context_loader = context_loader
        
        if state_file is None:
            state_file = Path(__file__).parent / "context_state.json"
        self.state_file = state_file
        
        # Load persisted state
        self.preloaded_contexts: Dict[str, List[str]] = self._load_state()
    
    def manage_context(self, current_task: Dict) -> Dict:
        """
        Manages what's loaded NOW and what's pre-loaded for NEXT.
        
        Args:
            current_task: Current task dict with 'primary_task', 'files', etc.
            
        Returns:
            Dict with 'active_context', 'preloaded_context', 'unload', 'predictions_used'
        """
        # Rank files by relevance if too many changed
        files = current_task.get('files', [])
        if len(files) > 100:  # Threshold for too many files
            files = self._rank_files_by_relevance(files, current_task)
            current_task = {**current_task, 'files': files}
        
        # Get context for current task
        language = self._infer_language(files)
        all_context = self._get_required_context(current_task, language)
        
        # Smart adaptive selection: PRIMARY + HIGH priority contexts
        active_context = self._select_active_context(all_context)
        suggested_context = [req for req in all_context if req.file_path not in {r.file_path for r in active_context}]
        
        # Predict next tasks
        predictions = self.predictor.predict_next_tasks(current_task)
        
        # Pre-load context for high-probability next tasks (>70%)
        preload_list = []
        predictions_used = []
        
        for prediction in predictions:
            if prediction.probability > self.PRELOAD_THRESHOLD:
                # Get context for predicted task (only PRIMARY/required)
                next_task_dict = {
                    'primary_task': prediction.task,
                    'files': current_task.get('files', []),  # Use same files for context inference
                    'user_message': current_task.get('user_message', '')
                }
                next_all_context = self._get_required_context(next_task_dict, language)
                next_active = self._select_active_context(next_all_context)
                preload_list.extend([req.file_path for req in next_active])
                
                predictions_used.append(f"{prediction.task} ({prediction.probability:.0%})")
        
        # Remove duplicates (already in active context)
        active_file_paths = {req.file_path for req in active_context}
        preload_list = [ctx for ctx in preload_list if ctx not in active_file_paths]
        
        # Remove duplicates from preload list
        preload_list = list(dict.fromkeys(preload_list))  # Preserves order
        
        # Determine what to unload (not needed for current or next)
        # CORRECTED APPROACH: Don't try to detect what's loaded - just recommend what should be unloaded
        all_needed = active_file_paths | set(preload_list)
        
        # Start with files we know were previously loaded (from context_state.json)
        previously_active = set(self.preloaded_contexts.get('active', []))
        previously_preloaded = set(self.preloaded_contexts.get('preloaded', []))
        to_unload = (previously_active | previously_preloaded) - all_needed
        
        # CRITICAL FIX: In minimal loading mode, recommend unload for common CONTEXT files (not rule files)
        # Rule files (.cursor/rules/*.mdc) are ALWAYS loaded by Cursor - agent can't unload them
        # Only recommend unload for actual context files that agent loaded via @ mentions
        if len(active_file_paths) <= 4:
            # Minimal loading mode - recommend unload for common context files that aren't needed
            # These are actual context files (not rule files) that were auto-loaded before the fix
            # Rule files are always loaded by Cursor, so we don't recommend unload for them
            common_extra_context_files = {
                '@libs/common/prisma/schema.prisma',  # Database schema (context file)
                # Note: Rule files (.cursor/rules/*.mdc) are NOT included - they're always loaded
            }
            # Add all common context files that aren't in the needed set to unload list
            extra_to_unload = common_extra_context_files - all_needed
            to_unload = to_unload | extra_to_unload
            
            if extra_to_unload:
                logger.debug(
                    f"Minimal loading mode: Recommending unload for common context files: {extra_to_unload}",
                    operation="manage_context",
                    reason="minimal_loading_recommendation",
                    active_count=len(active_file_paths),
                    preloaded_count=len(preload_list),
                    recommended_unload_count=len(extra_to_unload)
                )
        
        # Also check previous recommendations for files that should be unloaded
        previously_recommended = self._get_previously_recommended_files()
        if previously_recommended:
            extra_from_previous = previously_recommended - all_needed
            to_unload = to_unload | extra_from_previous
            if extra_from_previous:
                logger.debug(
                    f"Files from previous recommendations to unload: {extra_from_previous}",
                    operation="manage_context",
                    reason="previous_recommendations_cleanup"
                )
        
        # Update preloaded contexts cache
        self.preloaded_contexts['active'] = list(active_file_paths)
        self.preloaded_contexts['preloaded'] = preload_list
        
        # Persist state
        self._save_state()
        
        return {
            'active_context': [req.file_path for req in active_context],
            'suggested_context': [req.file_path for req in suggested_context],  # NEW: Suggested but not loaded
            'preloaded_context': preload_list,
            'context_to_unload': list(to_unload),
            'predictions_used': predictions_used
        }
    
    def _get_required_context(self, task: Dict, language: Optional[str] = None) -> List[ContextRequirement]:
        """
        Get required context for a task.
        
        Args:
            task: Task dict
            language: Programming language (optional, inferred if not provided)
            
        Returns:
            List of ContextRequirement objects
        """
        task_type = task.get('primary_task', 'edit_code')
        files = task.get('files', [])
        
        return self.context_loader.get_required_context(
            task_type=task_type,
            language=language,
            file_paths=files
        )
    
    def _select_active_context(self, all_context: List[ContextRequirement]) -> List[ContextRequirement]:
        """
        MINIMAL loading: Only PRIMARY + required contexts at startup.
        
        This method selects contexts that should be automatically loaded:
        - PRIMARY + required (always loaded) - MINIMAL SET
        - HIGH priority contexts are moved to "suggested" (not auto-loaded)
        
        Args:
            all_context: List of all context requirements
            
        Returns:
            List of ContextRequirement objects to load as active context (PRIMARY only)
        """
        # MINIMAL: Only load PRIMARY + required contexts
        primary_required = [
            req for req in all_context
            if req.priority == "PRIMARY" and req.category == "required"
        ]
        
        # HIGH priority contexts are NOT auto-loaded - they're suggested only
        # This ensures minimal loading at startup
        
        return primary_required
    
    def _rank_files_by_relevance(self, files: List[str], current_task: Dict) -> List[str]:
        """
        Rank files by relevance instead of just taking first N.
        
        Relevance factors:
        - Recent modifications (if git info available)
        - File type importance (source > test > config > docs)
        - Path depth (shallower = more important)
        - File size (smaller = more likely to be relevant)
        
        Args:
            files: List of file paths
            current_task: Current task dict
            
        Returns:
            Top N most relevant files (N = 100)
        """
        MAX_FILES = 100
        if len(files) <= MAX_FILES:
            return files
        
        scored_files = []
        
        for file_path in files:
            score = 0.0
            path = Path(file_path)
            
            # Factor 1: File type importance
            if path.suffix in {'.py', '.ts', '.tsx', '.js', '.jsx'}:
                score += 10.0  # Source files
            elif path.suffix in {'.test.py', '.spec.ts', '.test.ts'}:
                score += 8.0  # Test files
            elif path.suffix in {'.yaml', '.yml', '.json', '.toml'}:
                score += 5.0  # Config files
            elif path.suffix in {'.md', '.txt'}:
                score += 2.0  # Docs
            
            # Factor 2: Path depth (shallower = more important)
            depth = len(path.parts)
            score += max(0, 10.0 - depth * 0.5)
            
            # Factor 3: File name patterns (important keywords)
            name_lower = path.name.lower()
            if any(keyword in name_lower for keyword in ['main', 'index', 'app', 'core', 'service', 'controller']):
                score += 5.0
            
            # Factor 4: Recent modifications (if git available)
            # This would require git integration - for now, skip
            
            scored_files.append((score, file_path))
        
        # Sort by score (descending) and return top N
        scored_files.sort(key=lambda x: x[0], reverse=True)
        return [file_path for _, file_path in scored_files[:MAX_FILES]]
    
    def _infer_language(self, files: List[str]) -> Optional[str]:
        """
        Infer programming language from file paths.
        
        Args:
            files: List of file paths
            
        Returns:
            Language name or None
        """
        if not files:
            return None
        
        python_extensions = {'.py', '.pyi'}
        typescript_extensions = {'.ts', '.tsx'}
        
        for file_path in files:
            path = Path(file_path)
            if path.suffix in python_extensions:
                return 'python'
            elif path.suffix in typescript_extensions:
                return 'typescript'
        
        return None
    
    def _load_state(self) -> Dict[str, List[str]]:
        """Load persisted context state from file."""
        if not self.state_file.exists():
            return {'active': [], 'preloaded': []}
        
        try:
            with open(self.state_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return {
                    'active': data.get('active', []),
                    'preloaded': data.get('preloaded', [])
                }
        except Exception as e:
            logger.warn(
                f"Failed to load context state: {e}",
                operation="_load_state",
                error_code="LOAD_STATE_FAILED",
                root_cause=str(e)
            )
            return {'active': [], 'preloaded': []}
    
    def _save_state(self) -> None:
        """
        Atomic write: write to temp + replace to avoid corruption.
        
        This prevents state corruption if Cursor crashes or restarts mid-write.
        """
        import tempfile
        import os
        
        try:
            tmp_dir = self.state_file.parent
            os.makedirs(tmp_dir, exist_ok=True)
            
            # Write to temporary file first
            tmp_fd, tmp_path = tempfile.mkstemp(
                prefix="context_state_", suffix=".json", dir=tmp_dir
            )
            
            try:
                with os.fdopen(tmp_fd, 'w', encoding='utf-8') as f:
                    json.dump(self.preloaded_contexts, f, indent=2)
                
                # Atomically replace the original file
                os.replace(tmp_path, self.state_file)
                
                logger.debug(
                    f"Context state saved atomically to {self.state_file}",
                    operation="_save_state",
                    active_count=len(self.preloaded_contexts.get('active', [])),
                    preloaded_count=len(self.preloaded_contexts.get('preloaded', []))
                )
            except Exception as e:
                # Clean up temp file on error
                try:
                    os.remove(tmp_path)
                except OSError:
                    pass
                raise
        except Exception as e:
            logger.error(
                f"Failed to save context state: {e}",
                operation="_save_state",
                error_code="SAVE_STATE_FAILED",
                root_cause=str(e),
                state_file=str(self.state_file)
            )
    
    def _get_previously_recommended_files(self) -> set:
        """
        Get files that were previously recommended but are no longer needed.
        
        This helps detect files that were loaded before the minimal loading fix
        and should now be unloaded.
        
        Returns:
            Set of file paths that were previously recommended
        """
        import re
        recommendations_file = self.state_file.parent / "recommendations.md"
        
        if not recommendations_file.exists():
            return set()
        
        try:
            with open(recommendations_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract all files mentioned in "Active Context" section
            # Pattern: `@path/to/file.md` or `@.cursor/rules/file.mdc`
            active_section = re.search(
                r'### Active Context.*?\n(.*?)(?=###|##|$)',
                content,
                re.DOTALL | re.IGNORECASE
            )
            
            if not active_section:
                return set()
            
            active_content = active_section.group(1)
            
            # Extract file paths (multiple patterns for robustness)
            file_paths = set()
            
            # Pattern 1: `@path/to/file.md` (with @)
            matches = re.findall(r'`@([^`]+)`', active_content)
            file_paths.update(['@' + m for m in matches])
            
            # Pattern 2: `path/to/file.md` (without @)
            matches = re.findall(r'`([^`]+\.(?:md|mdc|ts|tsx|py|json|yaml|yml|prisma|sql))`', active_content)
            file_paths.update(['@' + m if not m.startswith('@') else m for m in matches])
            
            # Pattern 3: @path/to/file.md (direct mention)
            matches = re.findall(r'@([\w\./-]+\.(?:md|mdc|ts|tsx|py|json|yaml|yml|prisma|sql))', active_content)
            file_paths.update(['@' + m for m in matches])
            
            return file_paths
        except Exception as e:
            logger.debug(
                f"Failed to read previous recommendations: {e}",
                operation="_get_previously_recommended_files",
                error_code="PREV_RECOMMENDATIONS_READ_FAILED",
                root_cause=str(e)
            )
            return set()

