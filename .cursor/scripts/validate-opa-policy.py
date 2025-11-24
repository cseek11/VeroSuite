#!/usr/bin/env python3
"""
OPA Policy Validation Script

Validates OPA policies against VeroField Rules 2.1 complexity and performance budgets.

Usage:
    python .cursor/scripts/validate-opa-policy.py <policy_file>
    python .cursor/scripts/validate-opa-policy.py services/opa/policies/

Features:
- Complexity checker (lines, functions, nesting)
- Performance profiler integration
- Redundancy detector
- Pre-commit hook integration

Created: 2025-11-23
Version: 1.0.0
"""

import sys
import os
import re
import json
import subprocess
from pathlib import Path
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, asdict

# Performance budgets (from VeroField Rules 2.1)
MAX_LINES = 100
MAX_HELPERS = 5
MAX_NESTING = 3
MAX_EVAL_TIME_MS = 200
MAX_TOTAL_TIME_MS = 2000

@dataclass
class ValidationResult:
    """Validation result for a policy file"""
    file: str
    passed: bool
    errors: List[str]
    warnings: List[str]
    metrics: Dict[str, any]
    
    def to_dict(self):
        return asdict(self)
    
    def __str__(self):
        status = "✅ PASS" if self.passed else "❌ FAIL"
        result = f"\n{status}: {self.file}\n"
        
        if self.errors:
            result += "\n🚫 ERRORS:\n"
            for error in self.errors:
                result += f"  - {error}\n"
        
        if self.warnings:
            result += "\n⚠️  WARNINGS:\n"
            for warning in self.warnings:
                result += f"  - {warning}\n"
        
        result += "\n📊 METRICS:\n"
        for key, value in self.metrics.items():
            result += f"  - {key}: {value}\n"
        
        return result


class OPAPolicyValidator:
    """Validates OPA policy files against complexity and performance budgets"""
    
    def __init__(self, opa_binary: str = None):
        """Initialize validator with OPA binary path"""
        self.opa_binary = opa_binary or self._find_opa_binary()
        if not self.opa_binary:
            raise RuntimeError("OPA binary not found. Please install OPA or set OPA_BINARY env var.")
    
    def _find_opa_binary(self) -> Optional[str]:
        """Find OPA binary in common locations"""
        # Check environment variable
        if 'OPA_BINARY' in os.environ:
            return os.environ['OPA_BINARY']
        
        # Check project location
        project_opa = Path('services/opa/bin/opa.exe')
        if project_opa.exists():
            return str(project_opa)
        
        project_opa_unix = Path('services/opa/bin/opa')
        if project_opa_unix.exists():
            return str(project_opa_unix)
        
        # Check system PATH
        try:
            result = subprocess.run(['which', 'opa'], capture_output=True, text=True)
            if result.returncode == 0:
                return result.stdout.strip()
        except:
            pass
        
        return None
    
    def validate_file(self, policy_file: str) -> ValidationResult:
        """Validate a single policy file"""
        errors = []
        warnings = []
        metrics = {}
        
        try:
            # Read policy file
            with open(policy_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # 1. Check syntax
            syntax_errors = self._check_syntax(policy_file)
            if syntax_errors:
                errors.extend(syntax_errors)
                return ValidationResult(
                    file=policy_file,
                    passed=False,
                    errors=errors,
                    warnings=warnings,
                    metrics=metrics
                )
            
            # 2. Complexity checks
            complexity_errors, complexity_warnings, complexity_metrics = self._check_complexity(content)
            errors.extend(complexity_errors)
            warnings.extend(complexity_warnings)
            metrics.update(complexity_metrics)
            
            # 3. Redundancy checks
            redundancy_warnings = self._check_redundancy(content)
            warnings.extend(redundancy_warnings)
            
            # 4. Performance profiling (if test input available)
            perf_errors, perf_warnings, perf_metrics = self._check_performance(policy_file)
            errors.extend(perf_errors)
            warnings.extend(perf_warnings)
            metrics.update(perf_metrics)
            
            # 5. Best practices
            bp_warnings = self._check_best_practices(content)
            warnings.extend(bp_warnings)
            
        except Exception as e:
            errors.append(f"Validation error: {str(e)}")
        
        return ValidationResult(
            file=policy_file,
            passed=len(errors) == 0,
            errors=errors,
            warnings=warnings,
            metrics=metrics
        )
    
    def _check_syntax(self, policy_file: str) -> List[str]:
        """Check policy syntax using OPA"""
        try:
            result = subprocess.run(
                [self.opa_binary, 'check', policy_file],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode != 0:
                return [f"Syntax error: {result.stderr}"]
            
            return []
        except subprocess.TimeoutExpired:
            return ["Syntax check timed out"]
        except Exception as e:
            return [f"Syntax check failed: {str(e)}"]
    
    def _check_complexity(self, content: str) -> Tuple[List[str], List[str], Dict]:
        """Check policy complexity against budgets"""
        errors = []
        warnings = []
        metrics = {}
        
        # Count lines (excluding comments and blank lines)
        code_lines = [line for line in content.split('\n') 
                      if line.strip() and not line.strip().startswith('#')]
        line_count = len(code_lines)
        metrics['lines'] = line_count
        
        if line_count > MAX_LINES:
            errors.append(f"Policy exceeds max lines: {line_count} > {MAX_LINES}")
        elif line_count > MAX_LINES * 0.8:
            warnings.append(f"Policy approaching max lines: {line_count}/{MAX_LINES}")
        
        # Count helper functions
        helper_pattern = r'^[a-z_][a-z0-9_]*\([^)]*\)\s+if\s+\{'
        helpers = re.findall(helper_pattern, content, re.MULTILINE)
        helper_count = len(helpers)
        metrics['helpers'] = helper_count
        
        if helper_count > MAX_HELPERS:
            errors.append(f"Too many helpers: {helper_count} > {MAX_HELPERS}")
        elif helper_count > MAX_HELPERS * 0.8:
            warnings.append(f"Approaching max helpers: {helper_count}/{MAX_HELPERS}")
        
        # Check nesting depth
        max_nesting = self._calculate_max_nesting(content)
        metrics['max_nesting'] = max_nesting
        
        if max_nesting > MAX_NESTING:
            errors.append(f"Nesting too deep: {max_nesting} > {MAX_NESTING}")
        elif max_nesting > MAX_NESTING - 1:
            warnings.append(f"Nesting approaching limit: {max_nesting}/{MAX_NESTING}")
        
        return errors, warnings, metrics
    
    def _calculate_max_nesting(self, content: str) -> int:
        """Calculate maximum nesting depth"""
        max_depth = 0
        current_depth = 0
        
        for char in content:
            if char == '{':
                current_depth += 1
                max_depth = max(max_depth, current_depth)
            elif char == '}':
                current_depth = max(0, current_depth - 1)
        
        return max_depth
    
    def _check_redundancy(self, content: str) -> List[str]:
        """Check for redundant code patterns"""
        warnings = []
        
        # Check for duplicate conditions
        condition_pattern = r'if\s+\{([^}]+)\}'
        conditions = re.findall(condition_pattern, content)
        
        seen = set()
        for condition in conditions:
            normalized = ' '.join(condition.split())
            if normalized in seen:
                warnings.append(f"Duplicate condition detected: {normalized[:50]}...")
            seen.add(normalized)
        
        # Check for similar helper names
        helper_names = re.findall(r'^([a-z_][a-z0-9_]*)\(', content, re.MULTILINE)
        for i, name1 in enumerate(helper_names):
            for name2 in helper_names[i+1:]:
                if self._similar_names(name1, name2):
                    warnings.append(f"Similar helper names: {name1}, {name2}")
        
        return warnings
    
    def _similar_names(self, name1: str, name2: str) -> bool:
        """Check if two names are suspiciously similar"""
        if name1 == name2:
            return False
        
        # Check if one is substring of other
        if name1 in name2 or name2 in name1:
            return True
        
        # Check Levenshtein distance (simple version)
        if len(name1) > 5 and len(name2) > 5:
            common = sum(c1 == c2 for c1, c2 in zip(name1, name2))
            if common / max(len(name1), len(name2)) > 0.7:
                return True
        
        return False
    
    def _check_performance(self, policy_file: str) -> Tuple[List[str], List[str], Dict]:
        """Check policy performance using OPA profiler"""
        errors = []
        warnings = []
        metrics = {}
        
        # Check if sample input exists
        sample_input = Path('services/opa/sample-input.json')
        if not sample_input.exists():
            warnings.append("No sample input for performance testing")
            return errors, warnings, metrics
        
        try:
            # Run policy with profiling
            result = subprocess.run(
                [
                    self.opa_binary, 'eval',
                    '--data', str(Path(policy_file).parent),
                    '--input', str(sample_input),
                    '--profile',
                    '--format', 'json',
                    'data'
                ],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                # Parse profiling output
                try:
                    output = json.loads(result.stdout)
                    if 'profile' in output:
                        total_time_ns = sum(p.get('total_time_ns', 0) for p in output['profile'])
                        total_time_ms = total_time_ns / 1_000_000
                        metrics['eval_time_ms'] = round(total_time_ms, 2)
                        
                        if total_time_ms > MAX_EVAL_TIME_MS:
                            errors.append(f"Policy too slow: {total_time_ms}ms > {MAX_EVAL_TIME_MS}ms")
                        elif total_time_ms > MAX_EVAL_TIME_MS * 0.8:
                            warnings.append(f"Policy approaching time budget: {total_time_ms}ms/{MAX_EVAL_TIME_MS}ms")
                except json.JSONDecodeError:
                    warnings.append("Could not parse profiling output")
        
        except subprocess.TimeoutExpired:
            errors.append("Performance test timed out (>30s)")
        except Exception as e:
            warnings.append(f"Performance test failed: {str(e)}")
        
        return errors, warnings, metrics
    
    def _check_best_practices(self, content: str) -> List[str]:
        """Check for best practices"""
        warnings = []
        
        # Check for metadata
        if 'metadata :=' not in content:
            warnings.append("Missing metadata block")
        
        # Check for package declaration
        if not re.search(r'^package\s+compliance\.[a-z_]+', content, re.MULTILINE):
            warnings.append("Package should be under 'compliance' namespace")
        
        # Check for future keywords import
        if 'import future.keywords' not in content:
            warnings.append("Missing 'import future.keywords' for modern Rego syntax")
        
        # Check for early exit patterns
        if 'some' in content and 'in' in content:
            # Good - using iteration
            pass
        else:
            warnings.append("Consider using 'some...in' for early exit optimization")
        
        return warnings
    
    def validate_directory(self, directory: str) -> List[ValidationResult]:
        """Validate all policy files in a directory"""
        results = []
        policy_dir = Path(directory)
        
        if not policy_dir.exists():
            print(f"❌ Directory not found: {directory}")
            return results
        
        # Find all .rego files (excluding tests and templates)
        policy_files = [
            f for f in policy_dir.glob('**/*.rego')
            if not f.name.endswith('_test.rego') 
            and not f.name.startswith('_')
        ]
        
        if not policy_files:
            print(f"⚠️  No policy files found in {directory}")
            return results
        
        print(f"\n🔍 Validating {len(policy_files)} policy file(s)...\n")
        
        for policy_file in policy_files:
            result = self.validate_file(str(policy_file))
            results.append(result)
            print(result)
        
        return results


def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage: python validate-opa-policy.py <policy_file_or_directory>")
        print("\nExamples:")
        print("  python .cursor/scripts/validate-opa-policy.py services/opa/policies/sample.rego")
        print("  python .cursor/scripts/validate-opa-policy.py services/opa/policies/")
        sys.exit(1)
    
    target = sys.argv[1]
    
    try:
        validator = OPAPolicyValidator()
        
        if os.path.isfile(target):
            # Validate single file
            result = validator.validate_file(target)
            print(result)
            sys.exit(0 if result.passed else 1)
        
        elif os.path.isdir(target):
            # Validate directory
            results = validator.validate_directory(target)
            
            # Summary
            passed = sum(1 for r in results if r.passed)
            failed = len(results) - passed
            
            print(f"\n{'='*60}")
            print(f"SUMMARY: {passed} passed, {failed} failed out of {len(results)} total")
            print(f"{'='*60}\n")
            
            # Export results as JSON
            output_file = Path('.cursor/scripts/validation-results.json')
            with open(output_file, 'w') as f:
                json.dump([r.to_dict() for r in results], f, indent=2)
            print(f"📄 Results exported to {output_file}")
            
            sys.exit(0 if failed == 0 else 1)
        
        else:
            print(f"❌ Not a file or directory: {target}")
            sys.exit(1)
    
    except Exception as e:
        print(f"❌ Validation failed: {str(e)}")
        sys.exit(1)


if __name__ == '__main__':
    main()



