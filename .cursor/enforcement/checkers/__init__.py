"""
VeroField Enforcement Checkers Module

This module provides a modular architecture for rule enforcement.
Each rule file has a dedicated checker module that can be run independently.
"""

from .base_checker import BaseChecker, CheckerResult, CheckerStatus
from .exceptions import (
    CheckerError,
    RuleMetadataError,
    PatternMatchError,
    CheckerExecutionError
)
from .rule_metadata import get_rule_metadata, parse_rule_metadata
from .pattern_matcher import match_file_patterns, get_matching_files
from .checker_router import CheckerRouter

# Import all checkers
from .enforcement_checker import EnforcementChecker
from .core_checker import CoreChecker
from .security_checker import SecurityChecker
from .secret_scanner_checker import SecretScannerChecker
from .tenant_isolation_checker import TenantIsolationChecker
from .architecture_checker import ArchitectureChecker
from .data_checker import DataChecker
from .error_resilience_checker import ErrorResilienceChecker
from .observability_checker import ObservabilityChecker
from .backend_checker import BackendChecker
from .dto_enforcement_checker import DtoEnforcementChecker
from .backend_patterns_checker import BackendPatternsChecker
from .frontend_checker import FrontendChecker
from .quality_checker import QualityChecker
from .operations_checker import OperationsChecker
from .tech_debt_checker import TechDebtChecker
from .ux_consistency_checker import UXConsistencyChecker
from .verification_checker import VerificationChecker
from .python_bible_checker import PythonBibleChecker
from .typescript_bible_checker import TypeScriptBibleChecker
from .master_checker import MasterChecker
from .checker_registry import (
    get_checker_class,
    get_all_checker_classes,
    CHECKER_REGISTRY
)

__all__ = [
    # Base classes
    'BaseChecker',
    'CheckerResult',
    'CheckerStatus',
    # Exceptions
    'CheckerError',
    'RuleMetadataError',
    'PatternMatchError',
    'CheckerExecutionError',
    # Utilities
    'get_rule_metadata',
    'parse_rule_metadata',
    'match_file_patterns',
    'get_matching_files',
    'CheckerRouter',
    # Checkers
    'EnforcementChecker',
    'CoreChecker',
    'SecurityChecker',
    'SecretScannerChecker',
    'TenantIsolationChecker',
    'ArchitectureChecker',
    'DataChecker',
    'ErrorResilienceChecker',
    'ObservabilityChecker',
    'BackendChecker',
    'DtoEnforcementChecker',
    'BackendPatternsChecker',
    'FrontendChecker',
    'QualityChecker',
    'OperationsChecker',
    'TechDebtChecker',
    'UXConsistencyChecker',
    'VerificationChecker',
    'PythonBibleChecker',
    'TypeScriptBibleChecker',
    'MasterChecker',
    # Registry
    'get_checker_class',
    'get_all_checker_classes',
    'CHECKER_REGISTRY',
]

