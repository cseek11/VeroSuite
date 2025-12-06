"""
Checker registry for mapping rule files to checker classes.

Python Bible Chapter 11: Clean Architecture principles.
"""

from pathlib import Path
from typing import Dict, Type

from .base_checker import BaseChecker
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


# Registry mapping rule file names to checker classes
CHECKER_REGISTRY: Dict[str, Type[BaseChecker]] = {
    '00-master.mdc': MasterChecker,
    '01-enforcement.mdc': EnforcementChecker,
    '02-core.mdc': CoreChecker,
    '03-security.mdc': SecurityChecker,
    '03-security-secrets.mdc': SecretScannerChecker,  # Secret scanning (R03)
    '03-security-tenant.mdc': TenantIsolationChecker,  # Tenant isolation (R01)
    '04-architecture.mdc': ArchitectureChecker,
    '05-data.mdc': DataChecker,
    '06-error-resilience.mdc': ErrorResilienceChecker,
    '07-observability.mdc': ObservabilityChecker,
    '08-backend.mdc': BackendChecker,
    '08-backend-dto.mdc': DtoEnforcementChecker,  # DTO enforcement (R08-DTO)
    '08-backend-patterns.mdc': BackendPatternsChecker,  # Backend patterns (R08-PATTERN)
    '09-frontend.mdc': FrontendChecker,
    '10-quality.mdc': QualityChecker,
    '11-operations.mdc': OperationsChecker,
    '12-tech-debt.mdc': TechDebtChecker,
    '13-ux-consistency.mdc': UXConsistencyChecker,
    '14-verification.mdc': VerificationChecker,
    'python_bible.mdc': PythonBibleChecker,
    'typescript_bible.mdc': TypeScriptBibleChecker,
}


def get_checker_class(rule_ref: str) -> Type[BaseChecker]:
    """
    Get checker class for a rule reference.
    
    Args:
        rule_ref: Rule file name (e.g., "02-core.mdc")
        
    Returns:
        Checker class or None if not found
    """
    return CHECKER_REGISTRY.get(rule_ref)


def get_all_checker_classes() -> Dict[str, Type[BaseChecker]]:
    """
    Get all registered checker classes.
    
    Returns:
        Dictionary mapping rule_ref to checker class
    """
    return CHECKER_REGISTRY.copy()

