#!/usr/bin/env python3
"""
VeroField Rules: Performance Baseline Collection Script

Automates collection of performance baselines for OPA policies and CI/CD pipeline.

Usage:
    python baseline-collector.py --environment staging
    python baseline-collector.py --environment production --dry-run
    python baseline-collector.py --compare baseline-2025-11-23.json

Output:
    - baseline-metrics.json (machine-readable)
    - baseline-report.md (human-readable)
    - baseline-comparison.html (if previous baseline exists)

Created: 2025-11-23
Version: 1.0.0
"""

import argparse
import json
import subprocess
import time
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional


class BaselineCollector:
    """Collects performance baselines for CI/CD and OPA policies."""
    
    def __init__(self, environment: str = "staging", dry_run: bool = False):
        self.environment = environment
        self.dry_run = dry_run
        self.metrics = {
            "timestamp": datetime.now().isoformat(),
            "environment": environment,
            "ci_time_baseline": None,
            "ci_components": {},
            "opa_policies": [],
            "performance_budgets": {
                "per_policy_ms": 200,
                "total_tier1_ms": 600,
                "total_all_ms": 2000,
                "ci_increase_max_percent": 30
            }
        }
        self.output_dir = Path("docs/compliance-reports/baselines")
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def measure_ci_time(self) -> Dict:
        """Measure current CI time without OPA policies."""
        print("📊 Measuring CI baseline (without OPA)...")
        
        if self.dry_run:
            print("  [DRY RUN] Would measure CI time")
            return {
                "total_time_seconds": 180,  # 3 minutes placeholder
                "test_execution_seconds": 120,
                "linting_seconds": 30,
                "build_seconds": 30
            }
        
        # Trigger CI run and measure duration
        # This is a placeholder - actual implementation depends on CI system
        print("  ⚠️  Manual step required: Trigger CI run and record times")
        print("  Expected baseline: 3-5 minutes")
        
        # For GitHub Actions, you would:
        # 1. Trigger workflow via API
        # 2. Poll for completion
        # 3. Extract duration from workflow run
        
        return {
            "total_time_seconds": None,  # Fill in manually
            "test_execution_seconds": None,
            "linting_seconds": None,
            "build_seconds": None,
            "note": "Manual measurement required - see baseline-report.md"
        }
    
    def measure_opa_policy_time(self, policy_path: str) -> Optional[Dict]:
        """Measure OPA policy evaluation time using benchmark."""
        print(f"📊 Measuring OPA policy: {policy_path}...")
        
        if not os.path.exists(policy_path):
            print(f"  ⚠️  Policy file not found: {policy_path}")
            return None
        
        if self.dry_run:
            print(f"  [DRY RUN] Would benchmark {policy_path}")
            return {
                "policy_name": os.path.basename(policy_path),
                "evaluation_time_ms": 150,  # Placeholder
                "status": "dry_run"
            }
        
        try:
            # Run OPA benchmark
            opa_bin = "services/opa/bin/opa.exe" if os.name == 'nt' else "services/opa/bin/opa"
            
            if not os.path.exists(opa_bin):
                print(f"  ⚠️  OPA binary not found: {opa_bin}")
                print(f"  💡 Install OPA or update path in script")
                return None
            
            result = subprocess.run(
                [opa_bin, "test", "--bench", policy_path],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode != 0:
                print(f"  ❌ Benchmark failed: {result.stderr}")
                return None
            
            # Parse benchmark output (simplified - actual parsing would be more robust)
            # OPA benchmark output format: "BenchmarkXxx-8  N  NNNN ns/op"
            lines = result.stdout.split('\n')
            for line in lines:
                if 'ns/op' in line or 'ms/op' in line:
                    # Extract time (simplified parsing)
                    parts = line.split()
                    for i, part in enumerate(parts):
                        if 'ns/op' in part or 'ms/op' in part:
                            time_str = parts[i-1] if i > 0 else "0"
                            # Convert to milliseconds
                            if 'ns/op' in part:
                                time_ms = float(time_str) / 1_000_000
                            else:
                                time_ms = float(time_str)
                            
                            return {
                                "policy_name": os.path.basename(policy_path),
                                "evaluation_time_ms": round(time_ms, 2),
                                "status": "measured",
                                "raw_output": line
                            }
            
            print(f"  ⚠️  Could not parse benchmark output")
            return None
            
        except subprocess.TimeoutExpired:
            print(f"  ❌ Benchmark timed out (>30s)")
            return None
        except Exception as e:
            print(f"  ❌ Error: {e}")
            return None
    
    def collect_all_opa_policies(self) -> List[Dict]:
        """Collect benchmarks for all OPA policies."""
        print("\n📊 Collecting OPA policy benchmarks...")
        
        policies_dir = Path("services/opa/policies")
        if not policies_dir.exists():
            print(f"  ⚠️  Policies directory not found: {policies_dir}")
            return []
        
        policies = []
        policy_files = list(policies_dir.glob("*.rego"))
        
        # Exclude template files
        policy_files = [p for p in policy_files if not p.name.startswith("_")]
        
        print(f"  Found {len(policy_files)} policy files")
        
        for policy_file in policy_files:
            result = self.measure_opa_policy_time(str(policy_file))
            if result:
                policies.append(result)
                status_icon = "✅" if result.get("evaluation_time_ms", 0) < 200 else "⚠️"
                print(f"  {status_icon} {result['policy_name']}: {result.get('evaluation_time_ms', 'N/A')}ms")
        
        return policies
    
    def generate_baseline_report(self) -> str:
        """Generate human-readable baseline report."""
        report = f"""# Performance Baseline Report

**Generated:** {self.metrics['timestamp']}  
**Environment:** {self.metrics['environment']}  
**Status:** {'DRY RUN' if self.dry_run else 'MEASURED'}

---

## CI/CD Baseline (Without OPA)

| Component | Time (seconds) | Status |
|-----------|----------------|--------|
| **Total CI Time** | {self.metrics['ci_time_baseline'] or 'N/A'} | {'✅' if self.metrics['ci_time_baseline'] else '⏸️ Manual measurement required'} |
| Test Execution | {self.metrics['ci_components'].get('test_execution_seconds', 'N/A')} | |
| Linting | {self.metrics['ci_components'].get('linting_seconds', 'N/A')} | |
| Build | {self.metrics['ci_components'].get('build_seconds', 'N/A')} | |

**Note:** CI baseline measurement requires manual trigger. See instructions below.

---

## OPA Policy Performance

| Policy | Evaluation Time (ms) | Budget | Status |
|--------|---------------------|--------|--------|
"""
        
        total_time = 0
        for policy in self.metrics['opa_policies']:
            time_ms = policy.get('evaluation_time_ms', 0)
            total_time += time_ms
            status = "✅" if time_ms < 200 else "⚠️ EXCEEDS BUDGET"
            report += f"| {policy['policy_name']} | {time_ms} | <200ms | {status} |\n"
        
        report += f"""
| **Total (All Policies)** | {total_time:.2f} | <2000ms | {'✅' if total_time < 2000 else '⚠️ EXCEEDS BUDGET'} |

---

## Performance Budgets

| Metric | Budget | Actual | Status |
|--------|--------|--------|--------|
| Per-Policy Time | <200ms | See table above | |
| Total (All Policies) | <2000ms | {total_time:.2f}ms | {'✅' if total_time < 2000 else '⚠️'} |
| CI Time Increase | <30% | TBD (after OPA integration) | ⏸️ |

---

## Instructions for Manual CI Measurement

1. **Trigger CI Run:**
   ```bash
   # For GitHub Actions:
   gh workflow run ci.yml
   
   # Or create empty commit:
   git commit --allow-empty -m "Trigger CI baseline measurement"
   git push
   ```

2. **Record Times:**
   - Open GitHub Actions → Latest workflow run
   - Record total time
   - Record individual step times:
     - Test execution
     - Linting
     - Build

3. **Update Baseline:**
   ```bash
   # Edit baseline-metrics.json
   # Update "ci_time_baseline" and "ci_components" fields
   ```

---

## Next Steps

1. ✅ Baseline collected (this report)
2. ⏸️ Integrate OPA policies into CI
3. ⏸️ Measure CI time with OPA
4. ⏸️ Compare: Baseline vs. With OPA
5. ⏸️ Verify: CI increase <30%

---

**Generated by:** baseline-collector.py v1.0.0  
**See also:** `docs/developer/migration-v2.0-to-v2.1-DRAFT.md#appendix-d-performance-testing-protocol`
"""
        return report
    
    def compare_with_previous(self, previous_baseline_path: str) -> Optional[str]:
        """Compare current baseline with previous baseline."""
        try:
            with open(previous_baseline_path, 'r') as f:
                previous = json.load(f)
        except FileNotFoundError:
            print(f"  ⚠️  Previous baseline not found: {previous_baseline_path}")
            return None
        
        comparison = {
            "previous_timestamp": previous.get("timestamp"),
            "current_timestamp": self.metrics["timestamp"],
            "opa_policy_changes": []
        }
        
        # Compare OPA policies
        previous_policies = {p["policy_name"]: p for p in previous.get("opa_policies", [])}
        current_policies = {p["policy_name"]: p for p in self.metrics["opa_policies"]}
        
        for policy_name in set(list(previous_policies.keys()) + list(current_policies.keys())):
            prev = previous_policies.get(policy_name, {})
            curr = current_policies.get(policy_name, {})
            
            prev_time = prev.get("evaluation_time_ms", 0)
            curr_time = curr.get("evaluation_time_ms", 0)
            
            if prev_time and curr_time:
                change_percent = ((curr_time - prev_time) / prev_time) * 100
                comparison["opa_policy_changes"].append({
                    "policy_name": policy_name,
                    "previous_ms": prev_time,
                    "current_ms": curr_time,
                    "change_percent": round(change_percent, 2),
                    "status": "improved" if change_percent < 0 else "degraded" if change_percent > 10 else "stable"
                })
        
        return comparison
    
    def save_results(self, comparison: Optional[Dict] = None):
        """Save baseline results to files."""
        timestamp_str = datetime.now().strftime("%Y-%m-%d-%H%M%S")
        
        # Save JSON
        json_path = self.output_dir / f"baseline-{timestamp_str}.json"
        with open(json_path, 'w') as f:
            json.dump(self.metrics, f, indent=2)
        print(f"\n✅ Saved JSON: {json_path}")
        
        # Save latest baseline for easy reference
        latest_path = self.output_dir / "baseline-latest.json"
        with open(latest_path, 'w') as f:
            json.dump(self.metrics, f, indent=2)
        
        # Save Markdown report
        report = self.generate_baseline_report()
        md_path = self.output_dir / f"baseline-report-{timestamp_str}.md"
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(report)
        print(f"✅ Saved Report: {md_path}")
        
        # Save comparison if provided
        if comparison:
            comparison_path = self.output_dir / f"baseline-comparison-{timestamp_str}.json"
            with open(comparison_path, 'w') as f:
                json.dump(comparison, f, indent=2)
            print(f"✅ Saved Comparison: {comparison_path}")
    
    def run(self, compare_with: Optional[str] = None):
        """Run baseline collection."""
        print("🚀 Starting Performance Baseline Collection")
        print(f"   Environment: {self.environment}")
        print(f"   Dry Run: {self.dry_run}\n")
        
        # Measure CI baseline
        ci_metrics = self.measure_ci_time()
        self.metrics["ci_time_baseline"] = ci_metrics.get("total_time_seconds")
        self.metrics["ci_components"] = {
            k: v for k, v in ci_metrics.items() 
            if k != "total_time_seconds" and k != "note"
        }
        
        # Collect OPA policy benchmarks
        self.metrics["opa_policies"] = self.collect_all_opa_policies()
        
        # Compare with previous if provided
        comparison = None
        if compare_with:
            comparison = self.compare_with_previous(compare_with)
            if comparison:
                print("\n📊 Comparison with Previous Baseline:")
                for change in comparison.get("opa_policy_changes", []):
                    icon = "📈" if change["status"] == "degraded" else "📉" if change["status"] == "improved" else "➡️"
                    print(f"  {icon} {change['policy_name']}: {change['previous_ms']}ms → {change['current_ms']}ms ({change['change_percent']:+.1f}%)")
        
        # Save results
        self.save_results(comparison)
        
        print("\n✅ Baseline collection complete!")
        print(f"   See: {self.output_dir}/")


def main():
    parser = argparse.ArgumentParser(
        description="Collect performance baselines for VeroField Rules v2.1"
    )
    parser.add_argument(
        "--environment",
        choices=["staging", "production"],
        default="staging",
        help="Environment to measure (default: staging)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Dry run mode (no actual measurements)"
    )
    parser.add_argument(
        "--compare",
        type=str,
        help="Compare with previous baseline JSON file"
    )
    
    args = parser.parse_args()
    
    collector = BaselineCollector(
        environment=args.environment,
        dry_run=args.dry_run
    )
    
    collector.run(compare_with=args.compare)


if __name__ == "__main__":
    main()

