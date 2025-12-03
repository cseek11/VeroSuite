#!/usr/bin/env python3
"""
Generate detailed context usage report with percentages.

Last Updated: 2025-12-02
"""

import sys
import json
from pathlib import Path
from typing import Dict, List

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / ".cursor" / "scripts"))

# Try to import enforcer, but continue without it if unavailable
try:
    from auto_enforcer import VeroFieldEnforcer
    ENFORCER_AVAILABLE = True
except ImportError:
    ENFORCER_AVAILABLE = False

def estimate_tokens(text: str) -> int:
    """Rough token estimation: ~4 characters per token."""
    return len(text) // 4

def get_file_size(file_path: str) -> tuple:
    """Get file size in bytes and lines."""
    try:
        path = Path(file_path)
        if not path.exists():
            return 0, 0, 0
        
        size_bytes = path.stat().st_size
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            lines = content.count('\n') + 1
            tokens = estimate_tokens(content)
        
        return size_bytes, lines, tokens
    except Exception:
        return 0, 0, 0

def format_size(size_bytes: int) -> str:
    """Format file size."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.2f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.2f} MB"

def main():
    """Generate context dump report."""
    print("=" * 80)
    print("CONTEXT USAGE DUMP - DETAILED PERCENTAGE BREAKDOWN")
    print("=" * 80)
    print()
    
    # Try to get metrics from enforcer
    metrics = {'available': False, 'error': None}
    if ENFORCER_AVAILABLE:
        try:
            enforcer = VeroFieldEnforcer()
            metrics = enforcer.get_context_metrics_for_audit()
        except Exception as e:
            metrics['error'] = str(e)
    
    # Get context files from recommendations
    recommendations_file = project_root / ".cursor" / "context_manager" / "recommendations.md"
    active_files = []
    preloaded_files = []
    core_files = []
    
    if recommendations_file.exists():
        with open(recommendations_file, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Extract active context
            if "### Dynamic Context (Load These - REQUIRED)" in content:
                section = content.split("### Dynamic Context (Load These - REQUIRED)")[1].split("###")[0]
                active_files = [line.strip().replace('- `@', '').replace('`', '').replace(' (PRIMARY', '').split(')')[0].strip()
                               for line in section.split('\n')
                               if line.strip().startswith('- `@')]
            
            # Extract preloaded context
            if "### Pre-loaded Context (Ready for Next Tasks)" in content:
                section = content.split("### Pre-loaded Context (Ready for Next Tasks)")[1].split("###")[0]
                preloaded_files = [line.strip().replace('- `@', '').replace('`', '').replace(' (HIGH', '').split(')')[0].strip()
                                  for line in section.split('\n')
                                  if line.strip().startswith('- `@')]
            
            # Extract core context
            if "### Core Context (Automatic - Already Loaded)" in content:
                section = content.split("### Core Context (Automatic - Already Loaded)")[1].split("###")[0]
                core_files = [line.strip().replace('- `', '').replace('`', '').replace(' (will be auto-loaded)', '').replace('@', '').strip()
                             for line in section.split('\n')
                             if line.strip().startswith('- `') and 'schema.prisma' in line]
    
    # Get all rule files
    rules_dir = project_root / ".cursor" / "rules"
    rule_files = list(rules_dir.glob("*.mdc"))
    
    # Calculate totals
    total_tokens = 0
    file_details = []
    
    # Process active files
    for file_path in active_files:
        size_bytes, lines, tokens = get_file_size(file_path)
        total_tokens += tokens
        file_details.append({
            'path': file_path,
            'type': 'Active (Dynamic)',
            'size_bytes': size_bytes,
            'lines': lines,
            'tokens': tokens
        })
    
    # Process preloaded files
    for file_path in preloaded_files:
        size_bytes, lines, tokens = get_file_size(file_path)
        # Pre-loaded files cost 30% of full tokens
        effective_tokens = int(tokens * 0.3)
        total_tokens += effective_tokens
        file_details.append({
            'path': file_path,
            'type': 'Pre-loaded (30% cost)',
            'size_bytes': size_bytes,
            'lines': lines,
            'tokens': effective_tokens,
            'full_tokens': tokens
        })
    
    # Process core context files
    for file_path in core_files:
        size_bytes, lines, tokens = get_file_size(file_path)
        total_tokens += tokens
        file_details.append({
            'path': file_path,
            'type': 'Core (Auto-loaded)',
            'size_bytes': size_bytes,
            'lines': lines,
            'tokens': tokens
        })
    
    # Process rule files (all .mdc files in rules directory)
    rule_tokens = 0
    for rule_file in rule_files:
        size_bytes, lines, tokens = get_file_size(str(rule_file))
        rule_tokens += tokens
        file_details.append({
            'path': f".cursor/rules/{rule_file.name}",
            'type': 'Rule File (Auto-loaded)',
            'size_bytes': size_bytes,
            'lines': lines,
            'tokens': tokens
        })
    
    total_tokens += rule_tokens
    
    # Assume Cursor context window (varies by model, using 1M tokens as example)
    CONTEXT_WINDOW = 1_000_000  # 1M tokens (typical for Claude Sonnet 4.5)
    
    # Print report
    print("## CONTEXT BREAKDOWN BY FILE")
    print()
    print(f"{'File':<60} {'Type':<25} {'Size':<12} {'Lines':<10} {'Tokens':<12} {'%':<8}")
    print("-" * 130)
    
    for detail in sorted(file_details, key=lambda x: x['tokens'], reverse=True):
        percentage = (detail['tokens'] / total_tokens * 100) if total_tokens > 0 else 0
        path_display = detail['path'][:58] + ".." if len(detail['path']) > 60 else detail['path']
        
        token_display = f"{detail['tokens']:,}"
        if 'full_tokens' in detail:
            token_display += f" ({detail['full_tokens']:,} full)"
        
        print(f"{path_display:<60} {detail['type']:<25} {format_size(detail['size_bytes']):<12} "
              f"{detail['lines']:>10,} {token_display:<12} {percentage:>6.2f}%")
    
    print("-" * 130)
    print()
    
    # Summary by type
    print("## SUMMARY BY CONTEXT TYPE")
    print()
    
    type_totals = {}
    for detail in file_details:
        type_name = detail['type']
        if type_name not in type_totals:
            type_totals[type_name] = {'tokens': 0, 'files': 0, 'size': 0}
        type_totals[type_name]['tokens'] += detail['tokens']
        type_totals[type_name]['files'] += 1
        type_totals[type_name]['size'] += detail['size_bytes']
    
    for type_name, totals in sorted(type_totals.items(), key=lambda x: x[1]['tokens'], reverse=True):
        percentage = (totals['tokens'] / total_tokens * 100) if total_tokens > 0 else 0
        print(f"{type_name:<30} {totals['files']:>3} files, {totals['tokens']:>10,} tokens ({percentage:>5.2f}%), "
              f"{format_size(totals['size'])}")
    
    print()
    print("## OVERALL STATISTICS")
    print()
    print(f"Total Context Files:     {len(file_details):,}")
    print(f"Total Tokens Used:        {total_tokens:,}")
    print(f"Context Window:           {CONTEXT_WINDOW:,} tokens")
    print(f"Context Usage:            {(total_tokens / CONTEXT_WINDOW * 100):.2f}%")
    print(f"Remaining Capacity:       {CONTEXT_WINDOW - total_tokens:,} tokens ({(1 - total_tokens / CONTEXT_WINDOW) * 100:.2f}%)")
    print()
    
    # Metrics from enforcer
    if metrics.get('available'):
        print("## METRICS FROM AUTO-ENFORCER")
        print()
        print(f"Active Files:            {metrics['context_usage']['active_count']}")
        print(f"Pre-loaded Files:        {metrics['context_usage']['preloaded_count']}")
        print(f"Unloaded Files:          {metrics['context_usage']['unloaded_count']}")
        print(f"Active Tokens:           {metrics['token_statistics']['active_tokens']:,}")
        print(f"Pre-loaded Tokens:       {metrics['token_statistics']['preloaded_tokens']:,}")
        print(f"Total Tokens:            {metrics['token_statistics']['total_tokens']:,}")
        if metrics['token_statistics']['savings_tokens'] > 0:
            print(f"Token Savings:           {metrics['token_statistics']['savings_tokens']:,} "
                  f"({metrics['token_statistics']['savings_percentage']:.2f}%)")
    else:
        print("## METRICS FROM AUTO-ENFORCER")
        print()
        print(f"Status:                  System not available")
        if metrics.get('error'):
            print(f"Error:                   {metrics['error']}")
    
    print()
    print("=" * 80)

if __name__ == '__main__':
    main()

