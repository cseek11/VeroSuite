"""
Custom exception hierarchy for checker modules.

Python Bible Chapter 10: Error handling with specific exceptions and chaining.
"""


class CheckerError(Exception):
    """Base exception for all checker-related errors."""
    pass


class RuleMetadataError(CheckerError):
    """Raised when rule metadata cannot be parsed or is invalid."""
    pass


class PatternMatchError(CheckerError):
    """Raised when file pattern matching fails."""
    pass


class CheckerExecutionError(CheckerError):
    """Raised when a checker fails during execution."""
    pass




