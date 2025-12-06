#!/usr/bin/env python3
"""
Token Estimation Utilities
Estimates token usage and tracks context efficiency.

Last Updated: 2025-12-04
"""

from pathlib import Path
from typing import List, Dict, Optional
from dataclasses import dataclass

# Add project root to path
import sys
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="token_estimator")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("token_estimator")


@dataclass(slots=True)  # Python 3.10+ - reduces memory by 4-5×
class TokenMetrics:
    """Token usage metrics."""
    total_tokens: int
    file_count: int
    avg_tokens_per_file: float
    estimated_savings: Optional[int] = None
    savings_percentage: Optional[float] = None


class TokenEstimator:
    """Estimates token usage for context files."""
    
    # Average characters per token for code (GPT tokenization)
    CHARS_PER_TOKEN = 4
    
    def __init__(self, project_root: Optional[Path] = None):
        """
        Initialize token estimator.
        
        Args:
            project_root: Project root path (default: auto-detected)
        """
        self.project_root = project_root or Path(__file__).parent.parent.parent
    
    def estimate_tokens(self, file_path: str) -> int:
        """
        Estimate tokens using character count.
        
        Args:
            file_path: Path to file (relative to project root or absolute)
            
        Returns:
            Estimated token count
        """
        try:
            # Resolve path
            if Path(file_path).is_absolute():
                full_path = Path(file_path)
            else:
                full_path = self.project_root / file_path.lstrip('@').lstrip('/')
            
            if not full_path.exists():
                logger.debug(
                    f"File not found for token estimation: {file_path}",
                    operation="estimate_tokens",
                    file_path=file_path
                )
                return 0
            
            # Read file content
            with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Estimate tokens (characters / 4)
            tokens = len(content) // self.CHARS_PER_TOKEN
            
            return tokens
            
        except Exception as e:
            logger.warning(
                f"Failed to estimate tokens for {file_path}: {e}",
                operation="estimate_tokens",
                error_code="TOKEN_ESTIMATION_FAILED",
                root_cause=str(e),
                file_path=file_path
            )
            return 0
    
    def track_context_load(self, loaded_files: List[str]) -> TokenMetrics:
        """
        Track what's actually loaded and calculate metrics.
        
        Args:
            loaded_files: List of file paths that are loaded
            
        Returns:
            TokenMetrics with total tokens, file count, etc.
        """
        total_tokens = 0
        valid_files = []
        
        for file_path in loaded_files:
            tokens = self.estimate_tokens(file_path)
            if tokens > 0:
                total_tokens += tokens
                valid_files.append(file_path)
        
        file_count = len(valid_files)
        avg_tokens = total_tokens / file_count if file_count > 0 else 0.0
        
        return TokenMetrics(
            total_tokens=total_tokens,
            file_count=file_count,
            avg_tokens_per_file=round(avg_tokens, 2)
        )
    
    def compare_approaches(self, static_files: List[str], predictive_files: List[str],
                          preloaded_files: List[str] = None) -> Dict:
        """
        Compare predictive vs static context loading.
        
        Args:
            static_files: Files that would be loaded in static approach
            predictive_files: Files loaded in predictive approach
            preloaded_files: Files pre-loaded in predictive approach (optional)
            
        Returns:
            Dict with comparison metrics
        """
        if preloaded_files is None:
            preloaded_files = []
        
        # Static approach (baseline)
        static_metrics = self.track_context_load(static_files)
        
        # Predictive approach (active context)
        predictive_metrics = self.track_context_load(predictive_files)
        
        # Preloading overhead (background cost)
        preload_metrics = self.track_context_load(preloaded_files)
        # Preloading uses lower token cost (background loading)
        preload_token_cost = int(preload_metrics.total_tokens * 0.3)  # 30% of full cost
        
        total_predictive = predictive_metrics.total_tokens + preload_token_cost
        
        # Calculate savings
        savings = static_metrics.total_tokens - total_predictive
        savings_percentage = (savings / static_metrics.total_tokens * 100) if static_metrics.total_tokens > 0 else 0.0
        
        return {
            'static_approach': {
                'tokens': static_metrics.total_tokens,
                'file_count': static_metrics.file_count
            },
            'predictive_approach': {
                'tokens': total_predictive,
                'active_tokens': predictive_metrics.total_tokens,
                'preload_tokens': preload_token_cost,
                'file_count': predictive_metrics.file_count + len(preloaded_files)
            },
            'savings': {
                'tokens': savings,
                'percentage': round(savings_percentage, 2)
            },
            'efficiency': {
                'tokens_per_file_static': round(static_metrics.avg_tokens_per_file, 2),
                'tokens_per_file_predictive': round(
                    total_predictive / (predictive_metrics.file_count + len(preloaded_files)) if (predictive_metrics.file_count + len(preloaded_files)) > 0 else 0,
                    2
                )
            }
        }

