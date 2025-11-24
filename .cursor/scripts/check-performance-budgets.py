#!/usr/bin/env python3
"""
Performance Budgets Checker (R18)

This script checks API and frontend performance budgets, detects regressions,
manages exemptions, and generates enhanced performance reports.

Usage:
    python .cursor/scripts/check-performance-budgets.py --api
    python .cursor/scripts/check-performance-budgets.py --frontend
    python .cursor/scripts/check-performance-budgets.py --trends
    python .cursor/scripts/check-performance-budgets.py --exemptions
    python .cursor/scripts/check-performance-budgets.py --all
    python .cursor/scripts/check-performance-budgets.py --update-trends
    python .cursor/scripts/check-performance-budgets.py --generate-report
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# ============================================================================
# Configuration
# ============================================================================

PERFORMANCE_HISTORY_FILE = '.performance/history.json'
PERFORMANCE_EXEMPTIONS_FILE = 'docs/performance-exemptions.md'
PERFORMANCE_BUDGETS_FILE = '.performance/budgets.yml'
PERFORMANCE_REPORT_FILE = 'performance-report.html'

# Default budgets (can be overridden by budgets.yml)
DEFAULT_API_BUDGETS = {
    'simple_get': 200,      # ms
    'typical_post_put': 300,  # ms
    'heavy_operations': 500   # ms
}

DEFAULT_FRONTEND_BUDGETS = {
    'fcp': 1.5,  # seconds
    'lcp': 2.0,  # seconds
    'tti': 3.0,  # seconds
    'cls': 0.1,  # score
    'fid': 100   # ms
}

REGRESSION_THRESHOLD = 10  # percent
CRITICAL_REGRESSION_THRESHOLD = 20  # percent for critical endpoints

HISTORY_RETENTION_DAYS = 365

# Critical endpoints (always 100% sampling, high priority)
CRITICAL_ENDPOINTS = [
    '/api/auth/*',
    '/api/payments/*',
    '/api/checkout/*'
]

# ============================================================================
# Performance History Management
# ============================================================================

def load_performance_history() -> List[Dict]:
    """Load performance history from git-tracked file."""
    if not os.path.exists(PERFORMANCE_HISTORY_FILE):
        return []
    
    try:
        with open(PERFORMANCE_HISTORY_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_performance_history(history: List[Dict]):
    """Save performance history to git-tracked file."""
    os.makedirs(os.path.dirname(PERFORMANCE_HISTORY_FILE), exist_ok=True)
    
    with open(PERFORMANCE_HISTORY_FILE, 'w') as f:
        json.dump(history, f, indent=2)

def prune_performance_history(history: List[Dict]) -> List[Dict]:
    """Remove entries older than retention period."""
    cutoff_date = datetime.now() - timedelta(days=HISTORY_RETENTION_DAYS)
    
    pruned = [
        entry for entry in history
        if datetime.fromisoformat(entry['date'].replace('Z', '+00:00')) > cutoff_date
    ]
    
    return pruned

def add_performance_entry(endpoint: str, metrics: Dict, source: str = 'ci'):
    """Add new performance entry to history."""
    history = load_performance_history()
    
    entry = {
        'endpoint': endpoint,
        'date': datetime.now().isoformat() + 'Z',
        'source': source,  # 'ci' or 'runtime'
        'metrics': metrics
    }
    
    history.append(entry)
    
    # Prune old entries
    history = prune_performance_history(history)
    
    save_performance_history(history)

def get_baseline_performance(endpoint: str, strategy: str = 'last_release') -> Optional[Dict]:
    """Get baseline performance for endpoint using specified strategy."""
    history = load_performance_history()
    
    endpoint_history = [
        entry for entry in history
        if entry['endpoint'] == endpoint
    ]
    
    if not endpoint_history:
        return None
    
    if strategy == 'last_release':
        # Get performance from last release tag (simplified: last month)
        one_month_ago = datetime.now() - timedelta(days=30)
        baseline_entries = [
            entry for entry in endpoint_history
            if datetime.fromisoformat(entry['date'].replace('Z', '+00:00')) < one_month_ago
        ]
        return baseline_entries[-1]['metrics'] if baseline_entries else None
    
    elif strategy == 'last_month':
        # Get performance from exactly one month ago
        one_month_ago = datetime.now() - timedelta(days=30)
        baseline_entries = [
            entry for entry in endpoint_history
            if datetime.fromisoformat(entry['date'].replace('Z', '+00:00')) <= one_month_ago
        ]
        return baseline_entries[-1]['metrics'] if baseline_entries else None
    
    elif strategy == 'custom':
        # Get first entry (custom baseline)
        return endpoint_history[0]['metrics'] if endpoint_history else None
    
    return None

def calculate_trend(endpoint: str) -> Dict:
    """Calculate performance trend for endpoint."""
    history = load_performance_history()
    
    endpoint_history = [
        entry for entry in history
        if entry['endpoint'] == endpoint
    ]
    
    if len(endpoint_history) < 2:
        return {'status': 'insufficient_data'}
    
    # Sort by date
    endpoint_history.sort(key=lambda x: x['date'])
    
    # Compare first and last
    first = endpoint_history[0]['metrics']
    last = endpoint_history[-1]['metrics']
    
    p50_change = ((last['p50'] - first['p50']) / first['p50']) * 100
    
    if p50_change < -5:
        status = 'improving'
    elif p50_change > 5:
        status = 'degrading'
    else:
        status = 'stable'
    
    return {
        'status': status,
        'baseline': first['p50'],
        'current': last['p50'],
        'change_percent': p50_change,
        'data_points': len(endpoint_history)
    }

# ============================================================================
# Performance Exemptions Management
# ============================================================================

def parse_exemptions_file() -> List[Dict]:
    """Parse performance exemptions markdown file."""
    if not os.path.exists(PERFORMANCE_EXEMPTIONS_FILE):
        return []
    
    exemptions = []
    
    with open(PERFORMANCE_EXEMPTIONS_FILE, 'r') as f:
        content = f.read()
    
    # Find tables in markdown
    table_pattern = r'\|([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\|]+)\|'
    
    lines = content.split('\n')
    in_table = False
    current_category = None
    
    for line in lines:
        # Track categories
        if line.startswith('## Category:'):
            current_category = line.replace('## Category:', '').strip()
            continue
        
        # Skip header and separator rows
        if '|' in line and ('Endpoint' in line or '---' in line):
            in_table = True
            continue
        
        if in_table and '|' in line:
            match = re.match(table_pattern, line)
            if match:
                exemption = {
                    'endpoint': match.group(1).strip(),
                    'current': int(match.group(2).strip().replace('ms', '')),
                    'budget': int(match.group(3).strip().replace('ms', '')),
                    'justification': match.group(4).strip(),
                    'expiration': match.group(5).strip(),
                    'remediation': match.group(6).strip(),
                    'status': match.group(7).strip(),
                    'category': current_category
                }
                exemptions.append(exemption)
    
    return exemptions

def validate_exemptions() -> List[str]:
    """Validate performance exemptions."""
    exemptions = parse_exemptions_file()
    warnings = []
    
    for exemption in exemptions:
        # Check expiration date
        try:
            expiration_date = datetime.fromisoformat(exemption['expiration'])
            if expiration_date < datetime.now():
                warnings.append(
                    f"⚠️  Exemption expired for {exemption['endpoint']} "
                    f"(expired: {exemption['expiration']})"
                )
            elif expiration_date < datetime.now() + timedelta(days=30):
                warnings.append(
                    f"⏰ Exemption expiring soon for {exemption['endpoint']} "
                    f"(expires: {exemption['expiration']})"
                )
        except ValueError:
            warnings.append(
                f"❌ Invalid expiration date for {exemption['endpoint']}: "
                f"{exemption['expiration']}"
            )
        
        # Check justification
        if not exemption['justification'] or exemption['justification'] == '-':
            warnings.append(
                f"❌ Missing justification for {exemption['endpoint']}"
            )
        
        # Check remediation plan
        if not exemption['remediation'] or exemption['remediation'] == '-':
            warnings.append(
                f"❌ Missing remediation plan for {exemption['endpoint']}"
            )
    
    return warnings

# ============================================================================
# Performance Budgets
# ============================================================================

def load_budgets() -> Dict:
    """Load performance budgets from config file or use defaults."""
    if os.path.exists(PERFORMANCE_BUDGETS_FILE):
        try:
            import yaml
            with open(PERFORMANCE_BUDGETS_FILE, 'r') as f:
                return yaml.safe_load(f)
        except (ImportError, Exception):
            pass
    
    return {
        'api': DEFAULT_API_BUDGETS,
        'frontend': DEFAULT_FRONTEND_BUDGETS,
        'regression_threshold': REGRESSION_THRESHOLD,
        'critical_endpoints': CRITICAL_ENDPOINTS
    }

def check_api_budget(endpoint: str, metrics: Dict, endpoint_type: str) -> Optional[Dict]:
    """Check if API endpoint meets budget."""
    budgets = load_budgets()
    budget = budgets['api'].get(endpoint_type, DEFAULT_API_BUDGETS['typical_post_put'])
    
    if metrics['p50'] > budget:
        violation_percent = ((metrics['p50'] - budget) / budget) * 100
        return {
            'endpoint': endpoint,
            'current': metrics['p50'],
            'budget': budget,
            'violation_percent': violation_percent,
            'type': 'api'
        }
    
    return None

def check_frontend_budget(page: str, metrics: Dict) -> List[Dict]:
    """Check if frontend page meets budgets."""
    budgets = load_budgets()
    violations = []
    
    # Check FCP
    if 'fcp' in metrics and metrics['fcp'] > budgets['frontend']['fcp']:
        violations.append({
            'page': page,
            'metric': 'FCP',
            'current': metrics['fcp'],
            'budget': budgets['frontend']['fcp'],
            'type': 'frontend'
        })
    
    # Check LCP
    if 'lcp' in metrics and metrics['lcp'] > budgets['frontend']['lcp']:
        violations.append({
            'page': page,
            'metric': 'LCP',
            'current': metrics['lcp'],
            'budget': budgets['frontend']['lcp'],
            'type': 'frontend'
        })
    
    # Check TTI
    if 'tti' in metrics and metrics['tti'] > budgets['frontend']['tti']:
        violations.append({
            'page': page,
            'metric': 'TTI',
            'current': metrics['tti'],
            'budget': budgets['frontend']['tti'],
            'type': 'frontend'
        })
    
    return violations

# ============================================================================
# Performance Regression Detection
# ============================================================================

def detect_regression(endpoint: str, current_metrics: Dict, strategy: str = 'last_release') -> Optional[Dict]:
    """Detect performance regression for endpoint."""
    baseline = get_baseline_performance(endpoint, strategy)
    
    if not baseline:
        return None
    
    degradation_percent = ((current_metrics['p50'] - baseline['p50']) / baseline['p50']) * 100
    
    if degradation_percent > REGRESSION_THRESHOLD:
        # Determine severity
        if degradation_percent > CRITICAL_REGRESSION_THRESHOLD:
            severity = 'critical'
        elif degradation_percent > REGRESSION_THRESHOLD:
            severity = 'high'
        else:
            severity = 'medium'
        
        return {
            'endpoint': endpoint,
            'baseline': baseline['p50'],
            'current': current_metrics['p50'],
            'degradation_percent': degradation_percent,
            'severity': severity
        }
    
    return None

# ============================================================================
# Performance Issue Prioritization
# ============================================================================

def is_critical_endpoint(endpoint: str) -> bool:
    """Check if endpoint is critical."""
    budgets = load_budgets()
    critical_patterns = budgets.get('critical_endpoints', CRITICAL_ENDPOINTS)
    
    for pattern in critical_patterns:
        if pattern.endswith('*'):
            prefix = pattern[:-1]
            if endpoint.startswith(prefix):
                return True
        elif endpoint == pattern:
            return True
    
    return False

def estimate_effort(violation_percent: float, endpoint_type: str) -> str:
    """Estimate effort to fix performance issue."""
    if violation_percent < 20:
        return '1-2 hours'
    elif violation_percent < 50:
        return '2-4 hours'
    elif violation_percent < 100:
        return '4-8 hours'
    else:
        return '8+ hours'

def prioritize_issues(issues: List[Dict]) -> List[Dict]:
    """Prioritize performance issues using multi-factor approach."""
    for issue in issues:
        # Factor 1: Budget violation severity (40%)
        violation_score = min(issue.get('violation_percent', 0) / 100, 1.0)
        
        # Factor 2: Endpoint criticality (30%)
        criticality = 'critical' if is_critical_endpoint(issue['endpoint']) else 'non-critical'
        criticality_score = 1.0 if criticality == 'critical' else 0.5
        
        # Factor 3: User impact (30%) - simplified: critical endpoints = high impact
        impact = 'high' if criticality == 'critical' else 'medium'
        impact_scores = {'high': 1.0, 'medium': 0.7, 'low': 0.4}
        impact_score = impact_scores[impact]
        
        # Calculate priority score
        priority_score = (
            violation_score * 0.4 +
            criticality_score * 0.3 +
            impact_score * 0.3
        )
        
        # Assign priority
        if priority_score > 0.6:
            priority = 'high'
        elif priority_score > 0.3:
            priority = 'medium'
        else:
            priority = 'low'
        
        # Add effort estimation
        effort = estimate_effort(issue.get('violation_percent', 0), issue.get('type', 'api'))
        
        # Calculate ROI score (priority / effort hours)
        effort_hours = float(effort.split('-')[0].split('+')[0])
        roi_score = priority_score / effort_hours
        
        # Determine if quick win (high priority + low effort)
        is_quick_win = priority == 'high' and effort_hours <= 2
        
        issue.update({
            'priority': priority,
            'priority_score': priority_score,
            'criticality': criticality,
            'impact': impact,
            'effort': effort,
            'effort_hours': effort_hours,
            'roi_score': roi_score,
            'quick_win': is_quick_win
        })
    
    # Sort by priority score (descending)
    return sorted(issues, key=lambda x: x['priority_score'], reverse=True)

# ============================================================================
# Performance Health Score
# ============================================================================

def calculate_health_score(api_metrics: Dict, frontend_metrics: Dict, exemptions: List[Dict]) -> int:
    """Calculate overall performance health score (0-100)."""
    score = 100
    
    # Factor 1: Budget compliance (40%)
    total_endpoints = len(api_metrics) + len(frontend_metrics)
    if total_endpoints > 0:
        violations = sum(1 for m in api_metrics.values() if m.get('violation'))
        violations += sum(1 for m in frontend_metrics.values() if m.get('violation'))
        
        compliance_rate = 1 - (violations / total_endpoints)
        score -= (1 - compliance_rate) * 40
    
    # Factor 2: Trend direction (30%)
    degrading_count = sum(1 for m in api_metrics.values() if m.get('trend', {}).get('status') == 'degrading')
    if total_endpoints > 0:
        degrading_rate = degrading_count / total_endpoints
        score -= degrading_rate * 30
    
    # Factor 3: Exemption count (20%)
    active_exemptions = len([e for e in exemptions if e['status'] == 'Active'])
    if total_endpoints > 0:
        exemption_rate = min(active_exemptions / total_endpoints, 1.0)
        score -= exemption_rate * 20
    
    # Factor 4: High-priority issues (10%)
    high_priority_issues = sum(1 for m in api_metrics.values() if m.get('priority') == 'high')
    if total_endpoints > 0:
        high_priority_rate = min(high_priority_issues / total_endpoints, 1.0)
        score -= high_priority_rate * 10
    
    return max(0, int(score))

# ============================================================================
# Enhanced Performance Report
# ============================================================================

def generate_html_report(api_metrics: Dict, frontend_metrics: Dict, issues: List[Dict], exemptions: List[Dict]):
    """Generate enhanced HTML performance report."""
    health_score = calculate_health_score(api_metrics, frontend_metrics, exemptions)
    
    # Health score color
    if health_score >= 80:
        health_color = '#10b981'  # green
        health_status = '🟢 Healthy'
    elif health_score >= 60:
        health_color = '#f59e0b'  # yellow
        health_status = '🟡 Needs Attention'
    else:
        health_color = '#ef4444'  # red
        health_status = '🔴 Critical'
    
    # Quick wins
    quick_wins = [issue for issue in issues if issue.get('quick_win')]
    
    # High impact projects
    high_impact = [issue for issue in issues if issue['priority'] == 'high' and not issue.get('quick_win')]
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Budget Report</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f9fafb;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
        }}
        .header {{
            background: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }}
        .health-score {{
            display: flex;
            align-items: center;
            gap: 20px;
        }}
        .score-circle {{
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: {health_color};
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 36px;
            font-weight: bold;
        }}
        .score-details {{
            flex: 1;
        }}
        .score-details h1 {{
            margin: 0 0 10px 0;
            font-size: 24px;
        }}
        .score-details p {{
            margin: 5px 0;
            color: #6b7280;
        }}
        .section {{
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }}
        .section h2 {{
            margin: 0 0 15px 0;
            font-size: 18px;
            color: #111827;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
        }}
        th, td {{
            text-align: left;
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
        }}
        th {{
            background: #f9fafb;
            font-weight: 600;
            color: #374151;
        }}
        .badge {{
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
        }}
        .badge-high {{
            background: #fee2e2;
            color: #991b1b;
        }}
        .badge-medium {{
            background: #fef3c7;
            color: #92400e;
        }}
        .badge-low {{
            background: #dbeafe;
            color: #1e40af;
        }}
        .badge-critical {{
            background: #fecaca;
            color: #7f1d1d;
        }}
        .quick-win {{
            background: #d1fae5;
            color: #065f46;
        }}
        .summary-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }}
        .summary-card {{
            background: #f9fafb;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #6366f1;
        }}
        .summary-card h3 {{
            margin: 0 0 5px 0;
            font-size: 14px;
            color: #6b7280;
        }}
        .summary-card p {{
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            color: #111827;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="health-score">
                <div class="score-circle">{health_score}</div>
                <div class="score-details">
                    <h1>Performance Budget Report</h1>
                    <p><strong>Status:</strong> {health_status}</p>
                    <p><strong>Generated:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
                    <p><strong>Total Endpoints:</strong> {len(api_metrics) + len(frontend_metrics)}</p>
                </div>
            </div>
        </div>
        
        <div class="summary-grid">
            <div class="summary-card">
                <h3>Within Budget</h3>
                <p>{len([m for m in api_metrics.values() if not m.get('violation')])}</p>
            </div>
            <div class="summary-card">
                <h3>Exceeding Budget</h3>
                <p>{len([m for m in api_metrics.values() if m.get('violation')])}</p>
            </div>
            <div class="summary-card">
                <h3>Active Exemptions</h3>
                <p>{len([e for e in exemptions if e['status'] == 'Active'])}</p>
            </div>
            <div class="summary-card">
                <h3>High Priority Issues</h3>
                <p>{len([i for i in issues if i['priority'] == 'high'])}</p>
            </div>
        </div>
"""
    
    # Quick wins section
    if quick_wins:
        html += """
        <div class="section">
            <h2>🎯 Quick Wins (High Priority, Low Effort)</h2>
            <table>
                <thead>
                    <tr>
                        <th>Endpoint</th>
                        <th>Current</th>
                        <th>Budget</th>
                        <th>Violation</th>
                        <th>Effort</th>
                        <th>ROI</th>
                    </tr>
                </thead>
                <tbody>
"""
        for issue in quick_wins[:5]:  # Top 5 quick wins
            html += f"""
                    <tr>
                        <td>{issue['endpoint']}</td>
                        <td>{issue['current']}ms</td>
                        <td>{issue['budget']}ms</td>
                        <td>+{issue['violation_percent']:.1f}%</td>
                        <td>{issue['effort']}</td>
                        <td>{issue['roi_score']:.2f}</td>
                    </tr>
"""
        html += """
                </tbody>
            </table>
        </div>
"""
    
    # High impact projects section
    if high_impact:
        html += """
        <div class="section">
            <h2>📊 High Impact Projects (High Priority, High Effort)</h2>
            <table>
                <thead>
                    <tr>
                        <th>Endpoint</th>
                        <th>Current</th>
                        <th>Budget</th>
                        <th>Violation</th>
                        <th>Criticality</th>
                        <th>Effort</th>
                    </tr>
                </thead>
                <tbody>
"""
        for issue in high_impact[:5]:  # Top 5 high impact
            html += f"""
                    <tr>
                        <td>{issue['endpoint']}</td>
                        <td>{issue['current']}ms</td>
                        <td>{issue['budget']}ms</td>
                        <td>+{issue['violation_percent']:.1f}%</td>
                        <td><span class="badge badge-{issue['criticality']}">{issue['criticality']}</span></td>
                        <td>{issue['effort']}</td>
                    </tr>
"""
        html += """
                </tbody>
            </table>
        </div>
"""
    
    # All issues section
    html += """
        <div class="section">
            <h2>All Performance Issues</h2>
            <table>
                <thead>
                    <tr>
                        <th>Endpoint</th>
                        <th>Current</th>
                        <th>Budget</th>
                        <th>Priority</th>
                        <th>Impact</th>
                        <th>Effort</th>
                    </tr>
                </thead>
                <tbody>
"""
    for issue in issues[:20]:  # Top 20 issues
        html += f"""
                    <tr>
                        <td>{issue['endpoint']}</td>
                        <td>{issue['current']}ms</td>
                        <td>{issue['budget']}ms</td>
                        <td><span class="badge badge-{issue['priority']}">{issue['priority']}</span></td>
                        <td>{issue['impact']}</td>
                        <td>{issue['effort']}</td>
                    </tr>
"""
    html += """
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>
"""
    
    with open(PERFORMANCE_REPORT_FILE, 'w') as f:
        f.write(html)
    
    print(f"✅ Enhanced performance report generated: {PERFORMANCE_REPORT_FILE}")

# ============================================================================
# Main Functions
# ============================================================================

def check_api_performance():
    """Check API performance budgets."""
    print("🔍 Checking API performance budgets...")
    
    # TODO: Integrate with actual API monitoring/testing
    # For now, demonstrate with sample data
    print("⚠️  Note: API performance checking requires integration with monitoring/testing infrastructure")
    print("   Sample implementation shown below:")
    print()
    print("   # Collect metrics from CI/CD synthetic tests")
    print("   metrics = run_synthetic_api_tests()")
    print()
    print("   # Check budgets")
    print("   for endpoint, metrics in api_metrics.items():")
    print("       violation = check_api_budget(endpoint, metrics, endpoint_type)")
    print("       if violation:")
    print("           print(f'❌ {endpoint}: {metrics[\"p50\"]}ms (budget: {violation[\"budget\"]}ms)')")

def check_frontend_performance():
    """Check frontend performance budgets."""
    print("🔍 Checking frontend performance budgets...")
    
    # TODO: Integrate with Lighthouse/WebPageTest
    print("⚠️  Note: Frontend performance checking requires integration with Lighthouse/WebPageTest")
    print("   Sample implementation shown below:")
    print()
    print("   # Run Lighthouse")
    print("   lighthouse_report = run_lighthouse(page_url)")
    print()
    print("   # Check budgets")
    print("   violations = check_frontend_budget(page, lighthouse_report)")
    print("   for violation in violations:")
    print("       print(f'❌ {page} {violation[\"metric\"]}: {violation[\"current\"]}s (budget: {violation[\"budget\"]}s)')")

def check_trends():
    """Check performance trends."""
    print("📈 Checking performance trends...")
    
    history = load_performance_history()
    
    if not history:
        print("⚠️  No performance history found. Run --update-trends to start tracking.")
        return
    
    # Get unique endpoints
    endpoints = list(set(entry['endpoint'] for entry in history))
    
    print(f"Found {len(endpoints)} endpoints with performance history:")
    print()
    
    for endpoint in endpoints[:10]:  # Show first 10
        trend = calculate_trend(endpoint)
        
        if trend['status'] == 'insufficient_data':
            print(f"  {endpoint}: Insufficient data")
            continue
        
        status_icon = {
            'improving': '📈',
            'stable': '➡️',
            'degrading': '📉'
        }.get(trend['status'], '❓')
        
        print(f"  {status_icon} {endpoint}")
        print(f"     Baseline: {trend['baseline']}ms → Current: {trend['current']}ms ({trend['change_percent']:+.1f}%)")
        print(f"     Status: {trend['status']} ({trend['data_points']} data points)")
        print()

def check_exemptions():
    """Check performance exemptions."""
    print("📋 Checking performance exemptions...")
    
    warnings = validate_exemptions()
    
    if not warnings:
        print("✅ All exemptions are valid")
        return
    
    print(f"Found {len(warnings)} exemption issues:")
    print()
    
    for warning in warnings:
        print(f"  {warning}")

def check_all():
    """Check all performance requirements."""
    print("🔍 Checking all performance requirements...")
    print()
    
    check_api_performance()
    print()
    
    check_frontend_performance()
    print()
    
    check_trends()
    print()
    
    check_exemptions()

def update_trends():
    """Update performance trends (placeholder)."""
    print("📊 Updating performance trends...")
    
    # TODO: Integrate with actual monitoring/testing
    print("⚠️  Note: Trend updates require integration with monitoring/testing infrastructure")
    print("   Sample implementation shown below:")
    print()
    print("   # Collect current metrics")
    print("   for endpoint in endpoints:")
    print("       metrics = collect_metrics(endpoint)")
    print("       add_performance_entry(endpoint, metrics, source='ci')")
    print()
    print("   # Prune old entries")
    print("   history = load_performance_history()")
    print("   history = prune_performance_history(history)")
    print("   save_performance_history(history)")

def generate_report():
    """Generate enhanced performance report."""
    print("📄 Generating enhanced performance report...")
    
    # TODO: Integrate with actual data
    print("⚠️  Note: Report generation requires actual performance data")
    print("   Sample implementation shown below:")
    print()
    print("   # Collect data")
    print("   api_metrics = collect_api_metrics()")
    print("   frontend_metrics = collect_frontend_metrics()")
    print("   issues = identify_and_prioritize_issues()")
    print("   exemptions = parse_exemptions_file()")
    print()
    print("   # Generate report")
    print("   generate_html_report(api_metrics, frontend_metrics, issues, exemptions)")

# ============================================================================
# CLI
# ============================================================================

def main():
    parser = argparse.ArgumentParser(
        description='Check performance budgets (R18)',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    
    parser.add_argument('--api', action='store_true',
                        help='Check API performance budgets')
    parser.add_argument('--frontend', action='store_true',
                        help='Check frontend performance budgets')
    parser.add_argument('--trends', action='store_true',
                        help='Check performance trends')
    parser.add_argument('--exemptions', action='store_true',
                        help='Check performance exemptions')
    parser.add_argument('--all', action='store_true',
                        help='Check all performance requirements')
    parser.add_argument('--update-trends', action='store_true',
                        help='Update performance trends')
    parser.add_argument('--generate-report', action='store_true',
                        help='Generate enhanced performance report')
    
    args = parser.parse_args()
    
    # If no arguments, show help
    if not any(vars(args).values()):
        parser.print_help()
        return
    
    if args.api:
        check_api_performance()
    elif args.frontend:
        check_frontend_performance()
    elif args.trends:
        check_trends()
    elif args.exemptions:
        check_exemptions()
    elif args.all:
        check_all()
    elif args.update_trends:
        update_trends()
    elif args.generate_report:
        generate_report()

if __name__ == '__main__':
    main()



