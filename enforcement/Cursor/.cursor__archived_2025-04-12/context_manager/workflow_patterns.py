#!/usr/bin/env python3
"""
Workflow Pattern Database
Defines common task sequences in software development.

Last Updated: 2025-12-04
"""

from typing import Dict, List, Optional
from dataclasses import dataclass

# Add project root to path
import sys
from pathlib import Path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="workflow_patterns")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("workflow_patterns")


@dataclass(slots=True)  # Python 3.10+ - reduces memory by 4-5×
class WorkflowPattern:
    """Represents a workflow pattern."""
    name: str
    sequence: List[str]
    probability: float
    trigger_indicators: List[str]
    description: str = ""


class WorkflowPatterns:
    """Common task sequences in software development."""
    
    PATTERNS: Dict[str, WorkflowPattern] = {
        'test_driven_development': WorkflowPattern(
            name='test_driven_development',
            sequence=[
                'write_docs',      # Document requirements
                'run_tests',       # Write failing test (TDD)
                'edit_code',       # Implement feature
                'run_tests',       # Verify implementation
                'write_docs'       # Update documentation
            ],
            probability=0.85,
            trigger_indicators=['tdd', 'test first', 'write test', 'test-driven'],
            description='Test-Driven Development workflow'
        ),
        
        'bug_fix_workflow': WorkflowPattern(
            name='bug_fix_workflow',
            sequence=[
                'debug',           # Identify issue
                'run_tests',       # Reproduce with test
                'fix_bug',         # Fix the bug
                'run_tests',       # Verify fix
                'review_code'      # Ensure no regressions
            ],
            probability=0.90,
            trigger_indicators=['bug', 'error', 'failing', 'broken', 'fix bug'],
            description='Bug fixing workflow'
        ),
        
        'feature_development': WorkflowPattern(
            name='feature_development',
            sequence=[
                'edit_code',       # Implement feature
                'run_tests',       # Test manually/automated
                'fix_bug',         # Fix issues found
                'run_tests',       # Re-test
                'write_docs',      # Document feature
                'review_code'      # Final review
            ],
            probability=0.80,
            trigger_indicators=['add feature', 'new functionality', 'implement', 'create feature'],
            description='Feature development workflow'
        ),
        
        'refactoring_workflow': WorkflowPattern(
            name='refactoring_workflow',
            sequence=[
                'run_tests',       # Ensure tests pass (baseline)
                'refactor',        # Refactor code
                'run_tests',       # Verify no breakage
                'review_code'      # Review changes
            ],
            probability=0.75,
            trigger_indicators=['refactor', 'clean up', 'improve structure', 'reorganize'],
            description='Refactoring workflow'
        ),
        
        'documentation_workflow': WorkflowPattern(
            name='documentation_workflow',
            sequence=[
                'write_docs',      # Write documentation
                'review_code',     # Review related code
                'write_docs'       # Update based on review
            ],
            probability=0.70,
            trigger_indicators=['document', 'write docs', 'update readme', 'add comments'],
            description='Documentation workflow'
        ),
        
        'code_review_workflow': WorkflowPattern(
            name='code_review_workflow',
            sequence=[
                'review_code',     # Review code
                'edit_code',       # Make suggested changes
                'run_tests',       # Verify changes
                'review_code'      # Final review
            ],
            probability=0.65,
            trigger_indicators=['review', 'code review', 'inspect', 'examine'],
            description='Code review workflow'
        )
    }
    
    @classmethod
    def get_pattern(cls, name: str) -> Optional[WorkflowPattern]:
        """Get workflow pattern by name."""
        return cls.PATTERNS.get(name)
    
    @classmethod
    def get_all_patterns(cls) -> Dict[str, WorkflowPattern]:
        """Get all workflow patterns."""
        return cls.PATTERNS.copy()
    
    @classmethod
    def find_patterns_by_indicator(cls, indicator: str) -> List[WorkflowPattern]:
        """
        Find patterns that match a trigger indicator.
        
        Args:
            indicator: Trigger indicator string
            
        Returns:
            List of matching workflow patterns
        """
        indicator_lower = indicator.lower()
        matches = []
        
        for pattern in cls.PATTERNS.values():
            if any(ind in indicator_lower for ind in pattern.trigger_indicators):
                matches.append(pattern)
        
        return matches

