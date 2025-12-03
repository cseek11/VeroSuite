"""
Metrics / Telemetry (Phase 7)

Tracks compilation metrics: block counts, errors/warnings, compile time, quality indicators.
"""
from __future__ import annotations

from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from datetime import datetime
import time
from .error_bus import ErrorBus
from .symbol_table import SymbolTable


@dataclass
class CompileMetrics:
    """Compilation metrics."""
    # Block counts
    blocks_by_type: Dict[str, int] = field(default_factory=dict)
    total_blocks: int = 0
    
    # Error/warning counts
    error_count: int = 0
    warning_count: int = 0
    info_count: int = 0
    
    # Symbol counts
    term_count: int = 0
    concept_count: int = 0
    pattern_count: int = 0
    relation_count: int = 0
    diagram_count: int = 0
    table_count: int = 0
    
    # Quality indicators
    unresolved_references: int = 0
    duplicate_chapters: int = 0
    validation_errors: int = 0
    validation_warnings: int = 0
    
    # Timing
    compile_time_seconds: float = 0.0
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    
    # Namespace
    namespace: str = "default"
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert metrics to dictionary."""
        return {
            "blocks_by_type": self.blocks_by_type,
            "total_blocks": self.total_blocks,
            "error_count": self.error_count,
            "warning_count": self.warning_count,
            "info_count": self.info_count,
            "term_count": self.term_count,
            "concept_count": self.concept_count,
            "pattern_count": self.pattern_count,
            "relation_count": self.relation_count,
            "diagram_count": self.diagram_count,
            "table_count": self.table_count,
            "unresolved_references": self.unresolved_references,
            "duplicate_chapters": self.duplicate_chapters,
            "validation_errors": self.validation_errors,
            "validation_warnings": self.validation_warnings,
            "compile_time_seconds": self.compile_time_seconds,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "namespace": self.namespace,
        }


class MetricsCollector:
    """Collects compilation metrics."""
    
    def __init__(self, namespace: str = "default"):
        self.namespace = namespace
        self.metrics = CompileMetrics(namespace=namespace)
        self.start_time: Optional[float] = None
    
    def start(self):
        """Start timing compilation."""
        self.start_time = time.time()
        self.metrics.start_time = datetime.now()
    
    def stop(self):
        """Stop timing compilation."""
        if self.start_time:
            self.metrics.compile_time_seconds = time.time() - self.start_time
        self.metrics.end_time = datetime.now()
    
    def record_blocks(self, blocks: List[Any]) -> None:
        """
        Record block counts.
        
        Args:
            blocks: List of SSMBlock objects
        """
        self.metrics.total_blocks = len(blocks)
        
        # Count by type
        for block in blocks:
            block_type = getattr(block, 'block_type', 'unknown')
            self.metrics.blocks_by_type[block_type] = self.metrics.blocks_by_type.get(block_type, 0) + 1
            
            # Count specific types
            if block_type == "term":
                self.metrics.term_count += 1
            elif block_type == "concept":
                self.metrics.concept_count += 1
            elif block_type == "code-pattern":
                self.metrics.pattern_count += 1
            elif block_type == "relation":
                self.metrics.relation_count += 1
            elif block_type == "diagram":
                self.metrics.diagram_count += 1
            elif block_type == "table":
                self.metrics.table_count += 1
    
    def record_errors(self, errors: Optional[ErrorBus]) -> None:
        """
        Record error/warning counts.
        
        Args:
            errors: ErrorBus instance
        """
        if errors:
            self.metrics.error_count = len(errors.errors())
            self.metrics.warning_count = len(errors.warnings())
            self.metrics.info_count = len([e for e in errors.events if e.severity == "info"])
    
    def record_symbols(self, symbols: Optional[SymbolTable]) -> None:
        """
        Record symbol table statistics.
        
        Args:
            symbols: SymbolTable instance
        """
        if symbols:
            stats = symbols.stats()
            self.metrics.unresolved_references = stats.get("unresolved_references", 0)
            self.metrics.duplicate_chapters = stats.get("duplicate_chapters", 0)
    
    def record_validation(self, validation_errors: List[Any]) -> None:
        """
        Record validation errors/warnings.
        
        Args:
            validation_errors: List of ValidationError objects
        """
        if validation_errors:
            self.metrics.validation_errors = len([e for e in validation_errors if e.severity == "error"])
            self.metrics.validation_warnings = len([e for e in validation_errors if e.severity == "warning"])
    
    def get_metrics(self) -> CompileMetrics:
        """Get current metrics."""
        return self.metrics
    
    def get_summary(self) -> Dict[str, Any]:
        """Get human-readable summary."""
        return {
            "namespace": self.metrics.namespace,
            "total_blocks": self.metrics.total_blocks,
            "blocks_by_type": self.metrics.blocks_by_type,
            "errors": self.metrics.error_count,
            "warnings": self.metrics.warning_count,
            "validation_errors": self.metrics.validation_errors,
            "validation_warnings": self.metrics.validation_warnings,
            "unresolved_references": self.metrics.unresolved_references,
            "compile_time": f"{self.metrics.compile_time_seconds:.2f}s",
            "quality_score": self._calculate_quality_score()
        }
    
    def _calculate_quality_score(self) -> float:
        """Calculate quality score (0-100)."""
        score = 100.0
        
        # Deduct for errors
        score -= self.metrics.error_count * 10
        score -= self.metrics.validation_errors * 5
        
        # Deduct for warnings
        score -= self.metrics.warning_count * 2
        score -= self.metrics.validation_warnings * 1
        
        # Deduct for unresolved references
        score -= self.metrics.unresolved_references * 0.5
        
        return max(0.0, min(100.0, score))

