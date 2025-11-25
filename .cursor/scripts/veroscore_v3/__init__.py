"""
VeroScore V3 - File Watcher Components
Phase 2: File Watcher Implementation
Phase 3: PR Creator Implementation
Phase 4: Detection Functions Implementation
Phase 5: Scoring Engine Implementation
Phase 6: GitHub Workflows Integration

Last Updated: 2025-11-25
"""

__version__ = "3.0.0"

# IMPORTANT: No eager imports here to avoid package initialization issues in CI/CD
# All modules should be imported directly from submodules:
#   from veroscore_v3.scoring_engine import HybridScoringEngine
#   from veroscore_v3.detection_functions import MasterDetector
#   from veroscore_v3.session_manager import SessionManager
#   etc.

# Define __all__ for documentation purposes only
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

# Lazy import function for backward compatibility (if needed)
# Most code should import directly from submodules to avoid initialization issues
def __getattr__(name):
    """
    Lazy import for backward compatibility.
    
    Note: Direct imports from submodules are preferred:
        from veroscore_v3.scoring_engine import HybridScoringEngine
    """
    if name not in __all__:
        raise AttributeError(f"module '{__name__}' has no attribute '{name}'")
    
    # Lazy load only when explicitly requested
    # This avoids eager imports during package initialization
    module_map = {
        'FileChange': ('.file_change', 'FileChange'),
        'ChangeBuffer': ('.change_buffer', 'ChangeBuffer'),
        'GitDiffAnalyzer': ('.git_diff_analyzer', 'GitDiffAnalyzer'),
        'VeroFieldChangeHandler': ('.change_handler', 'VeroFieldChangeHandler'),
        'SessionManager': ('.session_manager', 'SessionManager'),
        'ThresholdChecker': ('.threshold_checker', 'ThresholdChecker'),
        'SupabaseSchemaHelper': ('.supabase_schema_helper', 'SupabaseSchemaHelper'),
        'EnforcementPipelineSection': ('.enforcement_pipeline_section', 'EnforcementPipelineSection'),
        'IdempotencyManager': ('.idempotency_manager', 'IdempotencyManager'),
        'PRCreator': ('.pr_creator', 'PRCreator'),
        'ViolationResult': ('.detection_functions', 'ViolationResult'),
        'RLSViolationDetector': ('.detection_functions', 'RLSViolationDetector'),
        'ArchitectureDriftDetector': ('.detection_functions', 'ArchitectureDriftDetector'),
        'HardcodedValueDetector': ('.detection_functions', 'HardcodedValueDetector'),
        'SecurityVulnerabilityDetector': ('.detection_functions', 'SecurityVulnerabilityDetector'),
        'LoggingComplianceDetector': ('.detection_functions', 'LoggingComplianceDetector'),
        'MasterDetector': ('.detection_functions', 'MasterDetector'),
        'CategoryScore': ('.scoring_engine', 'CategoryScore'),
        'ScoreResult': ('.scoring_engine', 'ScoreResult'),
        'ScoringWeights': ('.scoring_engine', 'ScoringWeights'),
        'StabilizationFunction': ('.scoring_engine', 'StabilizationFunction'),
        'FileAnalyzer': ('.scoring_engine', 'FileAnalyzer'),
        'PipelineComplianceDetector': ('.scoring_engine', 'PipelineComplianceDetector'),
        'HybridScoringEngine': ('.scoring_engine', 'HybridScoringEngine'),
    }
    
    if name in module_map:
        module_path, class_name = module_map[name]
        from importlib import import_module
        module = import_module(module_path, __package__)
        return getattr(module, class_name)
    
    raise AttributeError(f"module '{__name__}' has no attribute '{name}'")
