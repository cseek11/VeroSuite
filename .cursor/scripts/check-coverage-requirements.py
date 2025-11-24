#!/usr/bin/env python3
"""
R17: Coverage Requirements Checker

Tracks coverage trends, validates exemptions, identifies gaps, and generates enhanced reports.

Usage:
    python check-coverage-requirements.py --file <file_path>
    python check-coverage-requirements.py --trends
    python check-coverage-requirements.py --exemptions
    python check-coverage-requirements.py --gaps
    python check-coverage-requirements.py --all
    python check-coverage-requirements.py --check-expired-exemptions
    python check-coverage-requirements.py --generate-report
"""

import argparse
import os
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Optional

class CoverageRequirementsChecker:
    """Checker for R17: Coverage Requirements"""
    
    COVERAGE_HISTORY_FILE = '.coverage/history.json'
    COVERAGE_EXEMPTIONS_FILE = 'docs/coverage-exemptions.md'
    COVERAGE_GOALS_FILE = 'docs/coverage-goals.md'
    BASELINE_DEGRADATION_THRESHOLD = 5  # Alert if coverage decreases by > 5%
    
    # Coverage targets
    CRITICAL_CODE_TARGET = 90
    NON_CRITICAL_CODE_TARGET = 80
    
    def __init__(self):
        self.violations = []
        
    def check_coverage_trends(self, file_path: Optional[str] = None) -> List[Dict]:
        """Check coverage trends over time"""
        violations = []
        
        history = self._load_coverage_history()
        if not history:
            return [{
                'type': 'missing_history',
                'severity': 'warning',
                'message': 'Coverage history not found. Initialize with: python check-coverage-requirements.py --update-trends'
            }]
        
        # Group by file
        by_file = {}
        for entry in history:
            file = entry['file']
            if file not in by_file:
                by_file[file] = []
            by_file[file].append(entry)
        
        # Check trends for each file
        for file, entries in by_file.items():
            if file_path and file != file_path:
                continue
            
            # Sort by date
            entries.sort(key=lambda x: x['date'])
            
            if len(entries) < 2:
                continue
            
            # Check for degradation
            baseline = entries[-2]['coverage']['statements']  # Previous entry
            current = entries[-1]['coverage']['statements']   # Current entry
            
            if current < baseline - self.BASELINE_DEGRADATION_THRESHOLD:
                violations.append({
                    'file': file,
                    'type': 'coverage_degradation',
                    'severity': 'warning',
                    'baseline': baseline,
                    'current': current,
                    'degradation': baseline - current,
                    'message': f'Coverage degraded for {file}. Baseline: {baseline}%, Current: {current}% (-{baseline - current}%)'
                })
        
        return violations
    
    def check_coverage_exemptions(self) -> List[Dict]:
        """Check coverage exemptions for validity"""
        violations = []
        
        exemptions = self._load_coverage_exemptions()
        if not exemptions:
            return violations
        
        for exemption in exemptions:
            # Check expiration
            if self._is_expired(exemption.get('expiration')):
                violations.append({
                    'file': exemption['file'],
                    'type': 'exemption_expired',
                    'severity': 'warning',
                    'expiration': exemption['expiration'],
                    'message': f"Coverage exemption expired for {exemption['file']}. Expiration: {exemption['expiration']}"
                })
            
            # Check justification
            if not exemption.get('justification'):
                violations.append({
                    'file': exemption['file'],
                    'type': 'missing_justification',
                    'severity': 'warning',
                    'message': f"Coverage exemption for {exemption['file']} is missing justification"
                })
            
            # Check remediation plan
            if not exemption.get('remediation'):
                violations.append({
                    'file': exemption['file'],
                    'type': 'missing_remediation',
                    'severity': 'warning',
                    'message': f"Coverage exemption for {exemption['file']} is missing remediation plan"
                })
        
        return violations
    
    def identify_coverage_gaps(self) -> List[Dict]:
        """Identify and prioritize coverage gaps"""
        gaps = []
        
        # Load current coverage
        current_coverage = self._load_current_coverage()
        if not current_coverage:
            return gaps
        
        # Load exemptions
        exemptions = self._load_coverage_exemptions()
        exempted_files = {e['file'] for e in exemptions}
        
        # Identify gaps
        for file_path, coverage_data in current_coverage.items():
            if file_path in exempted_files:
                continue
            
            # Determine target based on code type
            code_type = self._classify_code_type(file_path)
            target = self.CRITICAL_CODE_TARGET if code_type == 'critical' else self.NON_CRITICAL_CODE_TARGET
            
            current = coverage_data.get('statements', 0)
            
            if current < target:
                # Calculate priority
                impact = self._assess_impact(file_path)
                priority = self._calculate_priority(current, target, code_type, impact)
                estimated_effort = self._estimate_effort(current, target)
                
                gaps.append({
                    'file': file_path,
                    'coverage': current,
                    'target': target,
                    'gap': target - current,
                    'code_type': code_type,
                    'impact': impact,
                    'priority': priority,
                    'estimated_effort': estimated_effort
                })
        
        # Sort by priority
        priority_order = {'high': 0, 'medium': 1, 'low': 2}
        gaps.sort(key=lambda x: (priority_order[x['priority']], -x['gap']))
        
        return gaps
    
    def update_coverage_trends(self) -> None:
        """Update coverage history with current coverage"""
        current_coverage = self._load_current_coverage()
        if not current_coverage:
            print("No current coverage data found. Run tests with coverage first.")
            return
        
        history = self._load_coverage_history()
        
        # Add current coverage to history
        current_date = datetime.now().isoformat()
        for file_path, coverage_data in current_coverage.items():
            history.append({
                'file': file_path,
                'date': current_date,
                'coverage': coverage_data
            })
        
        # Prune old entries (keep last 365 days)
        cutoff_date = (datetime.now() - timedelta(days=365)).isoformat()
        history = [entry for entry in history if entry['date'] >= cutoff_date]
        
        # Save updated history
        self._save_coverage_history(history)
        print(f"Coverage history updated: {len(current_coverage)} files tracked")
    
    def generate_enhanced_report(self, output_file: str = 'coverage-report.html') -> None:
        """Generate enhanced coverage report"""
        current_coverage = self._load_current_coverage()
        history = self._load_coverage_history()
        exemptions = self._load_coverage_exemptions()
        gaps = self.identify_coverage_gaps()
        
        # Calculate coverage health score
        health_score = self._calculate_health_score(current_coverage, history, gaps, exemptions)
        
        # Generate HTML report
        html = self._generate_html_report(current_coverage, history, exemptions, gaps, health_score)
        
        # Write report
        with open(output_file, 'w') as f:
            f.write(html)
        
        print(f"Enhanced coverage report generated: {output_file}")
        print(f"Coverage Health Score: {health_score}/100")
    
    def _load_coverage_history(self) -> List[Dict]:
        """Load coverage history from file"""
        if not os.path.exists(self.COVERAGE_HISTORY_FILE):
            return []
        
        try:
            with open(self.COVERAGE_HISTORY_FILE, 'r') as f:
                return json.load(f)
        except Exception:
            return []
    
    def _save_coverage_history(self, history: List[Dict]) -> None:
        """Save coverage history to file"""
        os.makedirs(os.path.dirname(self.COVERAGE_HISTORY_FILE), exist_ok=True)
        with open(self.COVERAGE_HISTORY_FILE, 'w') as f:
            json.dump(history, f, indent=2)
    
    def _load_coverage_exemptions(self) -> List[Dict]:
        """Load coverage exemptions from file"""
        if not os.path.exists(self.COVERAGE_EXEMPTIONS_FILE):
            return []
        
        exemptions = []
        try:
            with open(self.COVERAGE_EXEMPTIONS_FILE, 'r') as f:
                lines = f.readlines()
            
            # Parse markdown table
            in_table = False
            for line in lines:
                if line.startswith('|') and 'File' in line:
                    in_table = True
                    continue
                if in_table and line.startswith('|'):
                    parts = [p.strip() for p in line.split('|')[1:-1]]
                    if len(parts) >= 6:
                        exemptions.append({
                            'file': parts[0],
                            'coverage': parts[1],
                            'justification': parts[2],
                            'expiration': parts[3],
                            'remediation': parts[4],
                            'status': parts[5]
                        })
        except Exception:
            pass
        
        return exemptions
    
    def _load_current_coverage(self) -> Dict[str, Dict]:
        """Load current coverage from coverage reports"""
        coverage_file = 'coverage/coverage-final.json'
        if not os.path.exists(coverage_file):
            return {}
        
        try:
            with open(coverage_file, 'r') as f:
                data = json.load(f)
            
            # Extract per-file coverage
            result = {}
            for file_path, file_data in data.items():
                if file_path.startswith('/'):
                    # Normalize path
                    file_path = file_path.lstrip('/')
                
                result[file_path] = {
                    'statements': file_data.get('s', {}).get('pct', 0),
                    'branches': file_data.get('b', {}).get('pct', 0),
                    'functions': file_data.get('f', {}).get('pct', 0),
                    'lines': file_data.get('l', {}).get('pct', 0)
                }
            
            return result
        except Exception:
            return {}
    
    def _classify_code_type(self, file_path: str) -> str:
        """Classify code as critical or non-critical"""
        critical_patterns = ['auth', 'payment', 'pii', 'security', 'billing']
        return 'critical' if any(p in file_path.lower() for p in critical_patterns) else 'non-critical'
    
    def _assess_impact(self, file_path: str) -> str:
        """Assess impact of code (high/medium/low)"""
        # Simplified heuristic
        high_impact_patterns = ['service', 'controller', 'api']
        medium_impact_patterns = ['helper', 'util']
        
        if any(p in file_path.lower() for p in high_impact_patterns):
            return 'high'
        elif any(p in file_path.lower() for p in medium_impact_patterns):
            return 'medium'
        else:
            return 'low'
    
    def _calculate_priority(self, current: float, target: float, code_type: str, impact: str) -> str:
        """Calculate priority (high/medium/low)"""
        coverage_score = current / target if target > 0 else 1.0
        type_score = 1.0 if code_type == 'critical' else 0.5
        impact_scores = {'high': 1.0, 'medium': 0.7, 'low': 0.4}
        impact_score = impact_scores.get(impact, 0.4)
        
        priority_score = (1 - coverage_score) * type_score * impact_score
        
        if priority_score > 0.3:
            return 'high'
        elif priority_score > 0.15:
            return 'medium'
        else:
            return 'low'
    
    def _estimate_effort(self, current: float, target: float) -> str:
        """Estimate effort to reach target coverage"""
        gap = target - current
        
        if gap <= 5:
            return '1 hour'
        elif gap <= 10:
            return '2 hours'
        elif gap <= 20:
            return '4 hours'
        else:
            return '8+ hours'
    
    def _is_expired(self, expiration_str: Optional[str]) -> bool:
        """Check if exemption has expired"""
        if not expiration_str:
            return False
        
        try:
            expiration = datetime.fromisoformat(expiration_str)
            return expiration < datetime.now()
        except Exception:
            return False
    
    def _calculate_health_score(self, current_coverage: Dict, history: List[Dict], gaps: List[Dict], exemptions: List[Dict]) -> int:
        """Calculate coverage health score (0-100)"""
        # Factor 1: Overall coverage level (40%)
        if current_coverage:
            avg_coverage = sum(c['statements'] for c in current_coverage.values()) / len(current_coverage)
            coverage_score = min(avg_coverage / 80 * 40, 40)
        else:
            coverage_score = 0
        
        # Factor 2: Trend direction (30%)
        trend_score = 30  # Default: stable
        if history:
            by_file = {}
            for entry in history:
                file = entry['file']
                if file not in by_file:
                    by_file[file] = []
                by_file[file].append(entry)
            
            improving = sum(1 for entries in by_file.values() if len(entries) >= 2 and entries[-1]['coverage']['statements'] > entries[-2]['coverage']['statements'])
            degrading = sum(1 for entries in by_file.values() if len(entries) >= 2 and entries[-1]['coverage']['statements'] < entries[-2]['coverage']['statements'])
            
            if improving > degrading:
                trend_score = 30
            elif degrading > improving:
                trend_score = 15
        
        # Factor 3: Gap severity (20%)
        high_priority_gaps = sum(1 for g in gaps if g['priority'] == 'high')
        gap_score = max(20 - (high_priority_gaps * 5), 0)
        
        # Factor 4: Exemption count (10%)
        exemption_score = max(10 - len(exemptions), 0)
        
        return int(coverage_score + trend_score + gap_score + exemption_score)
    
    def _generate_html_report(self, current_coverage: Dict, history: List[Dict], exemptions: List[Dict], gaps: List[Dict], health_score: int) -> str:
        """Generate HTML coverage report"""
        html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>Coverage Report - Enhanced</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; }}
        h1 {{ color: #333; }}
        .health-score {{ font-size: 48px; font-weight: bold; color: {'green' if health_score >= 80 else 'orange' if health_score >= 60 else 'red'}; }}
        table {{ border-collapse: collapse; width: 100%; margin: 20px 0; }}
        th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
        th {{ background-color: #f2f2f2; }}
        .high {{ color: red; font-weight: bold; }}
        .medium {{ color: orange; }}
        .low {{ color: green; }}
    </style>
</head>
<body>
    <h1>Coverage Report - Enhanced</h1>
    <div>
        <h2>Coverage Health Score</h2>
        <div class="health-score">{health_score}/100</div>
    </div>
    
    <h2>Coverage Gaps (Prioritized)</h2>
    <table>
        <tr>
            <th>File</th>
            <th>Current</th>
            <th>Target</th>
            <th>Gap</th>
            <th>Priority</th>
            <th>Estimated Effort</th>
        </tr>
        {''.join(f'<tr><td>{g["file"]}</td><td>{g["coverage"]}%</td><td>{g["target"]}%</td><td>{g["gap"]}%</td><td class="{g["priority"]}">{g["priority"].upper()}</td><td>{g["estimated_effort"]}</td></tr>' for g in gaps[:10])}
    </table>
    
    <h2>Coverage Exemptions</h2>
    <table>
        <tr>
            <th>File</th>
            <th>Coverage</th>
            <th>Justification</th>
            <th>Expiration</th>
            <th>Status</th>
        </tr>
        {''.join(f'<tr><td>{e["file"]}</td><td>{e["coverage"]}</td><td>{e["justification"]}</td><td>{e["expiration"]}</td><td>{e["status"]}</td></tr>' for e in exemptions)}
    </table>
    
    <p>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
</body>
</html>
"""
        return html
    
    def format_output(self, violations: List[Dict]) -> str:
        """Format violations for output"""
        if not violations:
            return "✅ No coverage requirement violations found."
        
        output = []
        output.append(f"\n⚠️  Found {len(violations)} coverage requirement warning(s):\n")
        
        for v in violations:
            output.append(f"  {v.get('file', 'N/A')}")
            output.append(f"    Type: {v['type']}")
            output.append(f"    Severity: {v['severity']}")
            output.append(f"    Message: {v['message']}")
            output.append("")
        
        return "\n".join(output)

def main():
    parser = argparse.ArgumentParser(description='R17: Coverage Requirements Checker')
    parser.add_argument('--file', help='Check coverage trends for a single file')
    parser.add_argument('--trends', action='store_true', help='Check coverage trends')
    parser.add_argument('--exemptions', action='store_true', help='Check coverage exemptions')
    parser.add_argument('--gaps', action='store_true', help='Identify coverage gaps')
    parser.add_argument('--all', action='store_true', help='Check all coverage requirements')
    parser.add_argument('--check-expired-exemptions', action='store_true', help='Check for expired exemptions')
    parser.add_argument('--update-trends', action='store_true', help='Update coverage history')
    parser.add_argument('--generate-report', action='store_true', help='Generate enhanced coverage report')
    
    args = parser.parse_args()
    
    checker = CoverageRequirementsChecker()
    all_violations = []
    
    if args.update_trends:
        checker.update_coverage_trends()
        return 0
    
    if args.generate_report:
        checker.generate_enhanced_report()
        return 0
    
    if args.trends or args.all:
        violations = checker.check_coverage_trends(args.file)
        all_violations.extend(violations)
    
    if args.exemptions or args.check_expired_exemptions or args.all:
        violations = checker.check_coverage_exemptions()
        all_violations.extend(violations)
    
    if args.gaps or args.all:
        gaps = checker.identify_coverage_gaps()
        for gap in gaps:
            all_violations.append({
                'file': gap['file'],
                'type': 'coverage_gap',
                'severity': 'warning',
                'message': f"Coverage gap ({gap['priority']} priority): {gap['file']}. Current: {gap['coverage']}%, Target: {gap['target']}%. Estimated effort: {gap['estimated_effort']}"
            })
    
    if not any([args.trends, args.exemptions, args.gaps, args.all, args.check_expired_exemptions]):
        parser.print_help()
        return 1
    
    # Output results
    print(checker.format_output(all_violations))
    
    # Exit with appropriate code (warnings don't fail)
    return 0

if __name__ == '__main__':
    exit(main())



