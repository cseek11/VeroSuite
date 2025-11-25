"""
VeroScore V3 - File Watcher Components
Phase 2: File Watcher Implementation
Phase 3: PR Creator Implementation
Phase 4: Detection Functions Implementation

Last Updated: 2025-11-24
"""

__version__ = "3.0.0"

# Export core components for easy import
from .file_change import FileChange
from .change_buffer import ChangeBuffer
from .git_diff_analyzer import GitDiffAnalyzer
from .change_handler import VeroFieldChangeHandler
from .session_manager import SessionManager
from .threshold_checker import ThresholdChecker
from .supabase_schema_helper import SupabaseSchemaHelper
from .enforcement_pipeline_section import EnforcementPipelineSection
from .idempotency_manager import IdempotencyManager
from .pr_creator import PRCreator
# Import detection_functions first (scoring_engine depends on it)
from .detection_functions import (
    ViolationResult,
    RLSViolationDetector,
    ArchitectureDriftDetector,
    HardcodedValueDetector,
    SecurityVulnerabilityDetector,
    LoggingComplianceDetector,
    MasterDetector
)

# Import scoring_engine after detection_functions (it imports from detection_functions)
from .scoring_engine import (
    CategoryScore,
    ScoreResult,
    ScoringWeights,
    StabilizationFunction,
    FileAnalyzer,
    PipelineComplianceDetector,
    HybridScoringEngine
)

__all__ = [
    'FileChange',
    'ChangeBuffer',
    'GitDiffAnalyzer',
    'VeroFieldChangeHandler',
    'SessionManager',
    'ThresholdChecker',
    'SupabaseSchemaHelper',
    'EnforcementPipelineSection',
    'IdempotencyManager',
    'PRCreator',
    'ViolationResult',
    'RLSViolationDetector',
    'ArchitectureDriftDetector',
    'HardcodedValueDetector',
    'SecurityVulnerabilityDetector',
    'LoggingComplianceDetector',
    'MasterDetector',
    'CategoryScore',
    'ScoreResult',
    'ScoringWeights',
    'StabilizationFunction',
    'FileAnalyzer',
    'PipelineComplianceDetector',
    'HybridScoringEngine',
]
