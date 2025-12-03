#!/usr/bin/env python3
"""
VeroField Pre-Flight Check
Pre-flight validation script that checks Memory Bank, rule integrity, and displays context summary.

This script should be run before any AI agent action to ensure:
- Memory Bank is loaded and current
- Rule files are intact
- Context is available for decision-making

Last Updated: 2025-11-30
"""

import os
import sys
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Dict, Optional

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="pre_flight_check")
except ImportError:
    # Fallback logger if logger_util not available
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("pre_flight_check")


class PreFlightChecker:
    """
    Pre-flight validation checker.
    
    Validates:
    - Memory Bank files exist and are readable
    - Rule files are intact
    - Context summary is available
    """
    
    # Required Memory Bank files
    MEMORY_BANK_FILES = [
        "projectbrief.md",
        "productContext.md",
        "systemPatterns.md",
        "techContext.md",
        "activeContext.md",
        "progress.md"
    ]
    
    # Required rule files
    REQUIRED_RULE_FILES = [
        "00-master.mdc",
        "01-enforcement.mdc",
        "02-core.mdc",
        "03-security.mdc",
        "04-architecture.mdc",
        "05-data.mdc",
        "06-error-resilience.mdc",
        "07-observability.mdc",
        "08-backend.mdc",
        "09-frontend.mdc",
        "10-quality.mdc",
        "11-operations.mdc",
        "12-tech-debt.mdc",
        "13-ux-consistency.mdc",
        "14-verification.mdc"
    ]
    
    def __init__(self, project_root: Optional[Path] = None):
        """Initialize pre-flight checker."""
        self.project_root = project_root or Path(__file__).parent.parent.parent
        self.memory_bank_dir = self.project_root / ".cursor" / "memory-bank"
        self.rules_dir = self.project_root / ".cursor" / "rules"
        
        logger.info(
            "PreFlightChecker initialized",
            operation="__init__",
            project_root=str(self.project_root)
        )
    
    def check_memory_bank(self) -> Dict[str, bool]:
        """
        Check Memory Bank files.
        
        Returns:
            Dict mapping filename to exists status
        """
        results = {}
        
        for filename in self.MEMORY_BANK_FILES:
            file_path = self.memory_bank_dir / filename
            exists = file_path.exists() and file_path.stat().st_size > 0
            results[filename] = exists
            
            if not exists:
                logger.warn(
                    f"Memory Bank file missing or empty: {filename}",
                    operation="check_memory_bank",
                    file_path=str(file_path)
                )
        
        return results
    
    def check_rule_files(self) -> Dict[str, bool]:
        """
        Check rule files.
        
        Returns:
            Dict mapping filename to exists status
        """
        results = {}
        
        for filename in self.REQUIRED_RULE_FILES:
            file_path = self.rules_dir / filename
            exists = file_path.exists() and file_path.stat().st_size > 0
            results[filename] = exists
            
            if not exists:
                logger.warn(
                    f"Rule file missing or empty: {filename}",
                    operation="check_rule_files",
                    file_path=str(file_path)
                )
        
        return results
    
    def get_context_summary(self) -> Dict[str, str]:
        """
        Get context summary from Memory Bank files.
        
        Returns:
            Dict with context summaries
        """
        summary = {}
        
        # Read activeContext.md for current work
        active_context_file = self.memory_bank_dir / "activeContext.md"
        if active_context_file.exists():
            try:
                with open(active_context_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Extract first few lines as summary
                    lines = content.split('\n')[:10]
                    summary['active_context'] = '\n'.join(lines)
            except Exception as e:
                logger.warn(
                    "Failed to read activeContext.md",
                    operation="get_context_summary",
                    error_code="CONTEXT_READ_FAILED",
                    root_cause=str(e)
                )
                summary['active_context'] = "Unable to read activeContext.md"
        else:
            summary['active_context'] = "activeContext.md not found"
        
        # Read projectbrief.md for project overview
        projectbrief_file = self.memory_bank_dir / "projectbrief.md"
        if projectbrief_file.exists():
            try:
                with open(projectbrief_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    # Extract first few lines as summary
                    lines = content.split('\n')[:10]
                    summary['project_brief'] = '\n'.join(lines)
            except Exception as e:
                logger.warn(
                    "Failed to read projectbrief.md",
                    operation="get_context_summary",
                    error_code="PROJECTBRIEF_READ_FAILED",
                    root_cause=str(e)
                )
                summary['project_brief'] = "Unable to read projectbrief.md"
        else:
            summary['project_brief'] = "projectbrief.md not found"
        
        return summary
    
    def display_summary(self):
        """Display pre-flight check summary."""
        print("\n" + "=" * 80)
        print("VeroField Pre-Flight Check")
        print("=" * 80 + "\n")
        
        # Check Memory Bank
        print("Memory Bank Status:")
        print("-" * 80)
        memory_bank_results = self.check_memory_bank()
        all_memory_bank_ok = all(memory_bank_results.values())
        
        for filename, exists in memory_bank_results.items():
            status = "✓" if exists else "✗"
            print(f"  {status} {filename}")
        
        print()
        
        # Check Rule Files
        print("Rule Files Status:")
        print("-" * 80)
        rule_results = self.check_rule_files()
        all_rules_ok = all(rule_results.values())
        
        for filename, exists in rule_results.items():
            status = "✓" if exists else "✗"
            print(f"  {status} {filename}")
        
        print()
        
        # Context Summary
        print("Context Summary:")
        print("-" * 80)
        context_summary = self.get_context_summary()
        
        if 'project_brief' in context_summary:
            print("\nProject Brief (excerpt):")
            print(context_summary['project_brief'])
        
        if 'active_context' in context_summary:
            print("\nActive Context (excerpt):")
            print(context_summary['active_context'])
        
        print()
        
        # Overall Status
        print("=" * 80)
        if all_memory_bank_ok and all_rules_ok:
            print("✓ Pre-flight check PASSED - Ready to proceed")
            print("=" * 80 + "\n")
            return 0
        else:
            print("✗ Pre-flight check FAILED - Fix issues before proceeding")
            print("=" * 80 + "\n")
            return 1
    
    def run(self) -> int:
        """Run pre-flight check."""
        try:
            return self.display_summary()
        except Exception as e:
            logger.error(
                "Pre-flight check failed",
                operation="run",
                error_code="PREFLIGHT_CHECK_FAILED",
                root_cause=str(e)
            )
            print(f"\n✗ Pre-flight check error: {e}\n")
            return 1


def main():
    """Main entry point for standalone script."""
    checker = PreFlightChecker()
    exit_code = checker.run()
    sys.exit(exit_code)


if __name__ == '__main__':
    main()





