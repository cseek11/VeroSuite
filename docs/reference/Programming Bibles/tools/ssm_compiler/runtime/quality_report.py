"""
Quality Report Generator (Phase 7)

Generates quality reports from compilation metrics.
"""
from __future__ import annotations

import json
import sys
import importlib.util
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime
from .metrics import MetricsCollector, CompileMetrics

# Import structured logger
_project_root = Path(__file__).parent.parent.parent.parent.parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

logger_util_path = _project_root / ".cursor" / "scripts" / "logger_util.py"
if logger_util_path.exists():
    spec = importlib.util.spec_from_file_location("logger_util", logger_util_path)
    logger_util = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(logger_util)
    get_logger = logger_util.get_logger
    logger = get_logger("quality_report")
else:
    logger = None


def generate_quality_report(
    metrics: CompileMetrics,
    output_path: Optional[Path] = None
) -> Dict[str, Any]:
    """
    Generate quality report from metrics.
    
    Args:
        metrics: CompileMetrics object
        output_path: Optional path to save report JSON
        
    Returns:
        Quality report dictionary
    """
    # Calculate quality score
    quality_score = _calculate_quality_score(metrics)
    
    # Build report
    report = {
        "timestamp": datetime.now().isoformat(),
        "namespace": metrics.namespace,
        "compiler_version": "3.0.0",
        "summary": {
            "total_blocks": metrics.total_blocks,
            "quality_score": quality_score,
            "compile_time_seconds": metrics.compile_time_seconds,
        },
        "blocks": {
            "by_type": metrics.blocks_by_type,
            "terms": metrics.term_count,
            "concepts": metrics.concept_count,
            "patterns": metrics.pattern_count,
            "relations": metrics.relation_count,
            "diagrams": metrics.diagram_count,
            "tables": metrics.table_count,
        },
        "errors": {
            "total_errors": metrics.error_count,
            "total_warnings": metrics.warning_count,
            "validation_errors": metrics.validation_errors,
            "validation_warnings": metrics.validation_warnings,
        },
        "quality_indicators": {
            "unresolved_references": metrics.unresolved_references,
            "duplicate_chapters": metrics.duplicate_chapters,
            "error_rate": metrics.error_count / max(metrics.total_blocks, 1),
            "warning_rate": metrics.warning_count / max(metrics.total_blocks, 1),
        },
        "recommendations": _generate_recommendations(metrics, quality_score),
    }
    
    # Save to file if path provided
    if output_path:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, default=str)
    
    return report


def _calculate_quality_score(metrics: CompileMetrics) -> float:
    """Calculate quality score (0-100)."""
    score = 100.0
    
    # Deduct for errors
    score -= metrics.error_count * 10
    score -= metrics.validation_errors * 5
    
    # Deduct for warnings
    score -= metrics.warning_count * 2
    score -= metrics.validation_warnings * 1
    
    # Deduct for unresolved references
    score -= metrics.unresolved_references * 0.5
    
    # Deduct for duplicate chapters
    score -= metrics.duplicate_chapters * 5
    
    # Bonus for good coverage
    if metrics.total_blocks > 100:
        score += 5
    if metrics.term_count > 10:
        score += 2
    if metrics.pattern_count > 20:
        score += 2
    
    return max(0.0, min(100.0, score))


def _generate_recommendations(metrics: CompileMetrics, quality_score: float) -> list[str]:
    """Generate recommendations based on metrics."""
    recommendations = []
    
    if metrics.error_count > 0:
        recommendations.append(f"Fix {metrics.error_count} compilation errors")
    
    if metrics.validation_errors > 0:
        recommendations.append(f"Resolve {metrics.validation_errors} validation errors")
    
    if metrics.unresolved_references > 10:
        recommendations.append(f"Resolve {metrics.unresolved_references} unresolved references")
    
    if metrics.duplicate_chapters > 0:
        recommendations.append(f"Fix {metrics.duplicate_chapters} duplicate chapter numbers")
    
    if metrics.warning_count > 50:
        recommendations.append(f"Review {metrics.warning_count} warnings")
    
    if quality_score < 70:
        recommendations.append("Quality score is below 70 - review errors and warnings")
    
    if metrics.total_blocks < 50:
        recommendations.append("Low block count - verify all content is being extracted")
    
    if not recommendations:
        recommendations.append("✅ No issues detected - quality is good")
    
    return recommendations


def print_quality_report(report: Dict[str, Any]) -> None:
    """Print human-readable quality report."""
    summary = report["summary"]
    blocks = report["blocks"]
    errors = report["errors"]
    indicators = report["quality_indicators"]
    recommendations = report["recommendations"]
    
    # Log quality report
    if logger:
        logger.info(
            "Quality report generated",
            operation="print_quality_report",
            quality_score=summary['quality_score'],
            total_blocks=summary['total_blocks'],
            compile_time_seconds=summary['compile_time_seconds'],
            block_statistics=blocks,
            errors=errors,
            quality_indicators=indicators,
            recommendations=recommendations
        )

