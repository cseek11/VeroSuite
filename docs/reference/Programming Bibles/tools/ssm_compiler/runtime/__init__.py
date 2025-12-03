"""
Runtime components for SSM Compiler v3.

This package provides:
- ErrorBus: Centralized error logging and diagnostics
- Token: Source position metadata
- SymbolTable: Symbol tracking and reference resolution
"""

from .error_bus import ErrorBus, ErrorEvent
from .tokens import Token
from .symbol_table import SymbolTable, SymbolEntry

__all__ = [
    "ErrorBus",
    "ErrorEvent",
    "Token",
    "SymbolTable",
    "SymbolEntry",
]

