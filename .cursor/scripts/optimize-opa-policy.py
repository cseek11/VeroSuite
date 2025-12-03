#!/usr/bin/env python3
"""
OPA Policy Optimization Script

Analyzes OPA policies and suggests optimizations for performance and consolidation.

Usage:
    python .cursor/scripts/optimize-opa-policy.py <policy_file_or_directory>

Features:
- Auto-refactor suggestions
- Consolidation recommendations
- Performance optimization hints
- Shared helper extraction

Created: 2025-11-23
Version: 1.0.0
"""

import sys
import os
import re
import json
from pathlib import Path
from typing import Dict, List, Tuple
from collections import defaultdict
from dataclasses import dataclass, asdict

@dataclass
class OptimizationSuggestion:
    """Optimization suggestion for a policy"""
    type: str  # 'consolidation', 'performance', 'refactor', 'extraction'
    severity: str  # 'high', 'medium', 'low'
    description: str
    file: str
    line: int = None
    suggestion: str = ""
    
    def __str__(self):
        severity_icon = {'high': '🔴', 'medium': '🟡', 'low': '🟢'}
        icon = severity_icon.get(self.severity, '⚪')
        result = f"{icon} [{self.type.upper()}] {self.description}"
        if self.line:
            result += f" (line {self.line})"
        if self.suggestion:
            result += f"\n   💡 {self.suggestion}"
        return result


class OPAPolicyOptimizer:
    """Analyzes and suggests optimizations for OPA policies"""
    
    def __init__(self):
        self.policies = {}
        self.suggestions = []
    
    def analyze_file(self, policy_file: str) -> List[OptimizationSuggestion]:
        """Analyze a single policy file"""
        suggestions = []
        
        try:
            with open(policy_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Store policy for cross-file analysis
            self.policies[policy_file] = content
            
            # 1. Performance optimizations
            suggestions.extend(self._check_performance_patterns(policy_file, content))
            
            # 2. Refactoring opportunities
            suggestions.extend(self._check_refactoring(policy_file, content))
            
            # 3. Helper extraction
            suggestions.extend(self._check_helper_extraction(policy_file, content))
            
        except Exception as e:
            suggestions.append(OptimizationSuggestion(
                type='error',
                severity='high',
                description=f"Analysis error: {str(e)}",
                file=policy_file
            ))
        
        return suggestions
    
    def _check_performance_patterns(self, file: str, content: str) -> List[OptimizationSuggestion]:
        """Check for performance anti-patterns"""
        suggestions = []
        
        # Check for missing early exit
        lines = content.split('\n')
        for i, line in enumerate(lines, 1):
            # Check for iteration without 'some'
            if re.search(r'in\s+input\.[a-z_]+\s*\{', line) and 'some' not in line:
                suggestions.append(OptimizationSuggestion(
                    type='performance',
                    severity='medium',
                    description="Iteration without 'some' keyword",
                    file=file,
                    line=i,
                    suggestion="Use 'some item in collection' for early exit optimization"
                ))
            
            # Check for nested loops
            if line.count('in') > 1:
                suggestions.append(OptimizationSuggestion(
                    type='performance',
                    severity='high',
                    description="Nested iteration detected",
                    file=file,
                    line=i,
                    suggestion="Consider restructuring to avoid nested loops or use indexing"
                ))
            
            # Check for expensive string operations in loops
            if 'contains(' in line and ('some' in line or 'in' in line):
                suggestions.append(OptimizationSuggestion(
                    type='performance',
                    severity='low',
                    description="String operation in iteration",
                    file=file,
                    line=i,
                    suggestion="Consider pre-computing or caching string operations"
                ))
        
        # Check for missing lazy evaluation
        if_blocks = re.findall(r'if\s+\{([^}]+)\}', content, re.DOTALL)
        for block in if_blocks:
            conditions = block.split('\n')
            if len(conditions) > 3:
                # Check if expensive operations come first
                for cond in conditions[:2]:
                    if any(op in cond for op in ['contains(', 'regex.', 'json.']):
                        suggestions.append(OptimizationSuggestion(
                            type='performance',
                            severity='medium',
                            description="Expensive operation early in condition chain",
                            file=file,
                            suggestion="Move cheap checks (equality, existence) before expensive operations"
                        ))
                        break
        
        return suggestions
    
    def _check_refactoring(self, file: str, content: str) -> List[OptimizationSuggestion]:
        """Check for refactoring opportunities"""
        suggestions = []
        
        # Check for duplicate code blocks
        lines = content.split('\n')
        code_blocks = defaultdict(list)
        
        for i, line in enumerate(lines, 1):
            if line.strip() and not line.strip().startswith('#'):
                normalized = ' '.join(line.split())
                code_blocks[normalized].append(i)
        
        for code, line_numbers in code_blocks.items():
            if len(line_numbers) > 2 and len(code) > 20:
                suggestions.append(OptimizationSuggestion(
                    type='refactor',
                    severity='medium',
                    description=f"Duplicate code found ({len(line_numbers)} occurrences)",
                    file=file,
                    line=line_numbers[0],
                    suggestion=f"Extract to helper function: {code[:50]}..."
                ))
        
        # Check for long functions
        function_pattern = r'([a-z_][a-z0-9_]*)\([^)]*\)\s+if\s+\{([^}]+)\}'
        functions = re.findall(function_pattern, content, re.DOTALL)
        
        for func_name, func_body in functions:
            lines_count = len(func_body.split('\n'))
            if lines_count > 20:
                suggestions.append(OptimizationSuggestion(
                    type='refactor',
                    severity='medium',
                    description=f"Function '{func_name}' is too long ({lines_count} lines)",
                    file=file,
                    suggestion="Consider breaking into smaller helper functions"
                ))
        
        # Check for complex conditionals
        complex_if = re.findall(r'if\s+\{([^}]+)\}', content, re.DOTALL)
        for condition_block in complex_if:
            condition_count = condition_block.count('\n')
            if condition_count > 10:
                suggestions.append(OptimizationSuggestion(
                    type='refactor',
                    severity='low',
                    description=f"Complex conditional ({condition_count} conditions)",
                    file=file,
                    suggestion="Consider extracting to named helper function for clarity"
                ))
        
        return suggestions
    
    def _check_helper_extraction(self, file: str, content: str) -> List[OptimizationSuggestion]:
        """Check for shared helper extraction opportunities"""
        suggestions = []
        
        # Check for common patterns that could be helpers
        common_patterns = {
            r'contains\([^,]+,\s*["\']([^"\']+)["\']\)': 'string matching',
            r'startswith\([^,]+,\s*["\']([^"\']+)["\']\)': 'prefix checking',
            r'regex\.match\(["\']([^"\']+)["\']': 'regex matching',
            r'count\([^)]+\)\s*>\s*\d+': 'count checking',
        }
        
        for pattern, pattern_name in common_patterns.items():
            matches = re.findall(pattern, content)
            if len(matches) > 2:
                suggestions.append(OptimizationSuggestion(
                    type='extraction',
                    severity='low',
                    description=f"Repeated {pattern_name} pattern ({len(matches)} times)",
                    file=file,
                    suggestion=f"Consider extracting to shared helper in _shared.rego"
                ))
        
        return suggestions
    
    def analyze_consolidation(self) -> List[OptimizationSuggestion]:
        """Analyze opportunities for policy consolidation"""
        suggestions = []
        
        if len(self.policies) < 2:
            return suggestions
        
        # Check for similar package names
        packages = {}
        for file, content in self.policies.items():
            match = re.search(r'package\s+compliance\.([a-z_]+)', content)
            if match:
                domain = match.group(1)
                if domain not in packages:
                    packages[domain] = []
                packages[domain].append(file)
        
        # Check for related domains
        related_domains = {
            ('security', 'auth', 'tenant'): 'security',
            ('data', 'schema', 'sync'): 'data-integrity',
            ('logging', 'tracing', 'metrics'): 'observability',
            ('testing', 'coverage', 'quality'): 'testing',
        }
        
        for domain_group, suggested_name in related_domains.items():
            matching_domains = [d for d in packages.keys() if d in domain_group]
            if len(matching_domains) > 1:
                files = [f for d in matching_domains for f in packages[d]]
                suggestions.append(OptimizationSuggestion(
                    type='consolidation',
                    severity='medium',
                    description=f"Related domains detected: {', '.join(matching_domains)}",
                    file=', '.join(files),
                    suggestion=f"Consider consolidating into '{suggested_name}.rego'"
                ))
        
        # Check for shared logic
        helper_signatures = defaultdict(list)
        for file, content in self.policies.items():
            helpers = re.findall(r'([a-z_][a-z0-9_]*)\([^)]*\)\s+if', content)
            for helper in helpers:
                helper_signatures[helper].append(file)
        
        for helper, files in helper_signatures.items():
            if len(files) > 1:
                suggestions.append(OptimizationSuggestion(
                    type='consolidation',
                    severity='high',
                    description=f"Helper '{helper}' duplicated across {len(files)} policies",
                    file=', '.join(files),
                    suggestion="Extract to _shared.rego for reuse"
                ))
        
        # Check total policy count
        if len(self.policies) > 15:
            suggestions.append(OptimizationSuggestion(
                type='consolidation',
                severity='high',
                description=f"Total policy count ({len(self.policies)}) exceeds target (15)",
                file='all policies',
                suggestion="Review consolidation opportunities to reduce policy count"
            ))
        
        return suggestions
    
    def analyze_directory(self, directory: str) -> List[OptimizationSuggestion]:
        """Analyze all policies in a directory"""
        all_suggestions = []
        policy_dir = Path(directory)
        
        if not policy_dir.exists():
            print(f"❌ Directory not found: {directory}")
            return all_suggestions
        
        # Find all .rego files
        policy_files = [
            f for f in policy_dir.glob('**/*.rego')
            if not f.name.endswith('_test.rego') 
            and not f.name.startswith('_')
        ]
        
        if not policy_files:
            print(f"⚠️  No policy files found in {directory}")
            return all_suggestions
        
        print(f"\n🔍 Analyzing {len(policy_files)} policy file(s)...\n")
        
        # Analyze each file
        for policy_file in policy_files:
            suggestions = self.analyze_file(str(policy_file))
            all_suggestions.extend(suggestions)
        
        # Cross-file analysis
        consolidation_suggestions = self.analyze_consolidation()
        all_suggestions.extend(consolidation_suggestions)
        
        return all_suggestions
    
    def print_report(self, suggestions: List[OptimizationSuggestion]):
        """Print optimization report"""
        if not suggestions:
            print("✅ No optimization suggestions - policies look good!\n")
            return
        
        # Group by type
        by_type = defaultdict(list)
        for s in suggestions:
            by_type[s.type].append(s)
        
        # Group by severity
        by_severity = defaultdict(list)
        for s in suggestions:
            by_severity[s.severity].append(s)
        
        print(f"\n{'='*60}")
        print(f"OPTIMIZATION REPORT")
        print(f"{'='*60}\n")
        
        print(f"📊 Summary:")
        print(f"  Total suggestions: {len(suggestions)}")
        print(f"  High priority: {len(by_severity['high'])}")
        print(f"  Medium priority: {len(by_severity['medium'])}")
        print(f"  Low priority: {len(by_severity['low'])}")
        print()
        
        # Print by type
        for opt_type in ['consolidation', 'performance', 'refactor', 'extraction']:
            if opt_type in by_type:
                print(f"\n{opt_type.upper()} ({len(by_type[opt_type])} suggestions):")
                print("-" * 60)
                for suggestion in by_type[opt_type]:
                    print(f"{suggestion}\n")
        
        print(f"\n{'='*60}\n")


def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage: python optimize-opa-policy.py <policy_file_or_directory>")
        print("\nExamples:")
        print("  python .cursor/scripts/optimize-opa-policy.py services/opa/policies/sample.rego")
        print("  python .cursor/scripts/optimize-opa-policy.py services/opa/policies/")
        sys.exit(1)
    
    target = sys.argv[1]
    
    try:
        optimizer = OPAPolicyOptimizer()
        
        if os.path.isfile(target):
            # Analyze single file
            suggestions = optimizer.analyze_file(target)
            optimizer.print_report(suggestions)
        
        elif os.path.isdir(target):
            # Analyze directory
            suggestions = optimizer.analyze_directory(target)
            optimizer.print_report(suggestions)
            
            # Export results
            output_file = Path('.cursor/scripts/optimization-suggestions.json')
            try:
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump([asdict(s) for s in suggestions], f, indent=2)
                print(f"📄 Suggestions exported to {output_file}")
            except (OSError, IOError) as e:
                print(f"Error exporting suggestions: {e}", file=sys.stderr)
        
        else:
            print(f"❌ Not a file or directory: {target}")
            sys.exit(1)
    
    except Exception as e:
        print(f"❌ Optimization analysis failed: {str(e)}")
        sys.exit(1)


if __name__ == '__main__':
    main()





