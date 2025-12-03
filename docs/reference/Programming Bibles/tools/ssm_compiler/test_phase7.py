#!/usr/bin/env python3
"""
Phase 7 Tests - Observability, Metrics, and Safety

Tests for:
- Metrics collection (block counts, errors, timing)
- Quality indicators
- Redaction / Safety hooks
"""
from __future__ import annotations

import sys
from pathlib import Path
import time

# Add current directory to path
current_dir = Path(__file__).parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from runtime.metrics import MetricsCollector, CompileMetrics
from runtime.redactor import Redactor
from modules.ast_nodes import SSMBlock
from runtime.error_bus import ErrorBus
from runtime.symbol_table import SymbolTable


def test_metrics_collection():
    """Test metrics collection."""
    print("Testing metrics collection...")
    try:
        metrics = MetricsCollector(namespace="test")
        metrics.start()
        
        # Record blocks
        blocks = [
            SSMBlock(block_type="concept", meta={}, body="", index=0, id="c1"),
            SSMBlock(block_type="term", meta={}, body="", index=1, id="t1"),
            SSMBlock(block_type="code-pattern", meta={}, body="", index=2, id="p1"),
        ]
        metrics.record_blocks(blocks)
        
        # Record errors
        errors = ErrorBus()
        errors.error("ERR_TEST", "Test error", line=10)
        errors.warning("WARN_TEST", "Test warning", line=20)
        metrics.record_errors(errors)
        
        # Record symbols
        symbols = SymbolTable()
        symbols.add_term("OPA", "TERM-1", line_no=10)
        metrics.record_symbols(symbols)
        
        time.sleep(0.01)  # Small delay to ensure time > 0
        metrics.stop()
        
        m = metrics.get_metrics()
        assert m.total_blocks == 3, "Should have 3 blocks"
        assert m.error_count == 1, "Should have 1 error"
        assert m.warning_count == 1, "Should have 1 warning"
        assert m.term_count == 1, "Should have 1 term"
        assert m.pattern_count == 1, "Should have 1 pattern"
        assert m.compile_time_seconds >= 0, "Should have compile time (>= 0)"
        
        print("  ✓ Metrics collection passed")
        return True
    except Exception as e:
        print(f"  ✗ Metrics collection test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_quality_indicators():
    """Test quality indicators."""
    print("Testing quality indicators...")
    try:
        metrics = MetricsCollector(namespace="test")
        metrics.start()
        
        # Record blocks
        blocks = [
            SSMBlock(block_type="concept", meta={}, body="", index=0, id="c1"),
            SSMBlock(block_type="term", meta={}, body="", index=1, id="t1"),
        ]
        metrics.record_blocks(blocks)
        
        # Record errors (should lower quality score)
        errors = ErrorBus()
        errors.error("ERR_TEST", "Test error", line=10)
        metrics.record_errors(errors)
        
        # Record validation errors
        from validation.validate_ssm import ValidationError
        validation_errors = [
            ValidationError(code="VAL_TEST", message="Test", severity="error")
        ]
        metrics.record_validation(validation_errors)
        
        metrics.stop()
        
        summary = metrics.get_summary()
        assert "quality_score" in summary, "Should have quality score"
        quality_score = summary["quality_score"]
        assert 0 <= quality_score <= 100, "Quality score should be 0-100"
        assert quality_score < 100, "Should have reduced quality score due to errors"
        
        print(f"  ✓ Quality score: {quality_score:.1f}")
        print("  ✓ Quality indicators passed")
        return True
    except Exception as e:
        print(f"  ✗ Quality indicators test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_redactor_basic():
    """Test basic redaction."""
    print("Testing basic redaction...")
    try:
        redactor = Redactor(enabled=True)
        
        # Test API key redaction
        code1 = 'api_key = "sk_live_1234567890abcdef"'
        redacted1 = redactor.redact_code(code1)
        assert "REDACTED" in redacted1, "Should redact API key"
        assert "sk_live_1234567890abcdef" not in redacted1, "Should not contain original key"
        
        # Test token redaction
        code2 = 'token: "abc123def456ghi789"'
        redacted2 = redactor.redact_code(code2)
        assert "REDACTED" in redacted2, "Should redact token"
        
        # Test disabled redactor
        redactor_disabled = Redactor(enabled=False)
        code3 = 'api_key = "secret123"'
        redacted3 = redactor_disabled.redact_code(code3)
        assert code3 == redacted3, "Should not redact when disabled"
        
        print("  ✓ Basic redaction passed")
        return True
    except Exception as e:
        print(f"  ✗ Basic redaction test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_redactor_namespace_config():
    """Test namespace-based redaction configuration."""
    print("Testing namespace-based redaction...")
    try:
        # Internal namespace should skip redaction
        redactor_internal = Redactor(enabled=True, namespace="internal")
        assert not redactor_internal.should_redact(), "Internal namespace should skip redaction"
        
        # Public namespace should redact
        redactor_public = Redactor(enabled=True, namespace="public")
        assert redactor_public.should_redact(), "Public namespace should redact"
        
        # Disabled redactor should not redact
        redactor_disabled = Redactor(enabled=False, namespace="public")
        assert not redactor_disabled.should_redact(), "Disabled redactor should not redact"
        
        print("  ✓ Namespace-based redaction passed")
        return True
    except Exception as e:
        print(f"  ✗ Namespace-based redaction test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_metrics_summary():
    """Test metrics summary generation."""
    print("Testing metrics summary...")
    try:
        metrics = MetricsCollector(namespace="test")
        metrics.start()
        
        blocks = [
            SSMBlock(block_type="concept", meta={}, body="", index=0, id="c1"),
            SSMBlock(block_type="term", meta={}, body="", index=1, id="t1"),
        ]
        metrics.record_blocks(blocks)
        
        errors = ErrorBus()
        metrics.record_errors(errors)
        
        symbols = SymbolTable()
        metrics.record_symbols(symbols)
        
        metrics.stop()
        
        summary = metrics.get_summary()
        assert "namespace" in summary, "Should have namespace"
        assert "total_blocks" in summary, "Should have total_blocks"
        assert "blocks_by_type" in summary, "Should have blocks_by_type"
        assert "errors" in summary, "Should have errors"
        assert "warnings" in summary, "Should have warnings"
        assert "compile_time" in summary, "Should have compile_time"
        assert "quality_score" in summary, "Should have quality_score"
        
        print("  ✓ Metrics summary passed")
        return True
    except Exception as e:
        print(f"  ✗ Metrics summary test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_metrics_serialization():
    """Test metrics serialization to dict."""
    print("Testing metrics serialization...")
    try:
        metrics = MetricsCollector(namespace="test")
        metrics.start()
        time.sleep(0.01)  # Small delay to ensure time > 0
        metrics.stop()
        
        metrics_dict = metrics.get_metrics().to_dict()
        assert "namespace" in metrics_dict, "Should have namespace"
        assert "total_blocks" in metrics_dict, "Should have total_blocks"
        assert "compile_time_seconds" in metrics_dict, "Should have compile_time_seconds"
        assert "start_time" in metrics_dict, "Should have start_time"
        assert "end_time" in metrics_dict, "Should have end_time"
        
        print("  ✓ Metrics serialization passed")
        return True
    except Exception as e:
        print(f"  ✗ Metrics serialization test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("Phase 7 Tests - Observability, Metrics, and Safety")
    print("=" * 60)
    print()
    
    tests = [
        test_metrics_collection,
        test_quality_indicators,
        test_redactor_basic,
        test_redactor_namespace_config,
        test_metrics_summary,
        test_metrics_serialization,
    ]
    
    results = []
    for test in tests:
        try:
            results.append(test())
        except Exception as e:
            print(f"  ✗ Test {test.__name__} crashed: {e}")
            import traceback
            traceback.print_exc()
            results.append(False)
        print()
    
    print("=" * 60)
    passed = sum(results)
    total = len(results)
    print(f"Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("✓ All Phase 7 tests passed!")
        sys.exit(0)
    else:
        print("✗ Some Phase 7 tests failed")
        sys.exit(1)

