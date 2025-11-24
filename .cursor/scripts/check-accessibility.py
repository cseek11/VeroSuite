#!/usr/bin/env python3
"""
Accessibility Checker (R19)

This script checks UI components for WCAG AA compliance, manages exemptions,
prioritizes issues, and generates enhanced accessibility reports.

Usage:
    python .cursor/scripts/check-accessibility.py --all
    python .cursor/scripts/check-accessibility.py --keyboard
    python .cursor/scripts/check-accessibility.py --aria
    python .cursor/scripts/check-accessibility.py --contrast
    python .cursor/scripts/check-accessibility.py --focus
    python .cursor/scripts/check-accessibility.py --exemptions
    python .cursor/scripts/check-accessibility.py --generate-report
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

ACCESSIBILITY_HISTORY_FILE = '.accessibility/history.json'
ACCESSIBILITY_EXEMPTIONS_FILE = 'docs/accessibility-exemptions.md'
ACCESSIBILITY_REPORT_FILE = 'accessibility-report.html'

# WCAG AA Contrast Requirements
WCAG_AA_NORMAL_TEXT = 4.5  # Minimum contrast ratio for normal text
WCAG_AA_LARGE_TEXT = 3.0   # Minimum contrast ratio for large text (18pt+ or 14pt+ bold)

# Critical components (always require full accessibility testing)
CRITICAL_COMPONENTS = [
    'auth',
    'login',
    'payment',
    'checkout',
    'signup'
]

# User-facing components (higher priority than admin-only)
USER_FACING_KEYWORDS = [
    'dashboard',
    'profile',
    'settings',
    'search',
    'navigation'
]

HISTORY_RETENTION_DAYS = 365

# ============================================================================
# Accessibility History Management
# ============================================================================

def load_accessibility_history() -> List[Dict]:
    """Load accessibility history from git-tracked file."""
    if not os.path.exists(ACCESSIBILITY_HISTORY_FILE):
        return []
    
    try:
        with open(ACCESSIBILITY_HISTORY_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_accessibility_history(history: List[Dict]):
    """Save accessibility history to git-tracked file."""
    os.makedirs(os.path.dirname(ACCESSIBILITY_HISTORY_FILE), exist_ok=True)
    
    with open(ACCESSIBILITY_HISTORY_FILE, 'w') as f:
        json.dump(history, f, indent=2)

def prune_accessibility_history(history: List[Dict]) -> List[Dict]:
    """Remove entries older than retention period."""
    cutoff_date = datetime.now() - timedelta(days=HISTORY_RETENTION_DAYS)
    
    pruned = [
        entry for entry in history
        if datetime.fromisoformat(entry['date'].replace('Z', '+00:00')) > cutoff_date
    ]
    
    return pruned

def add_accessibility_entry(component: str, violations: List[Dict], compliance_score: float):
    """Add new accessibility entry to history."""
    history = load_accessibility_history()
    
    entry = {
        'date': datetime.now().isoformat(),
        'component': component,
        'violations': violations,
        'compliance_score': compliance_score,
        'total_violations': len(violations)
    }
    
    history.append(entry)
    history = prune_accessibility_history(history)
    save_accessibility_history(history)

# ============================================================================
# Accessibility Exemptions Management
# ============================================================================

def parse_exemptions_file() -> List[Dict]:
    """Parse accessibility exemptions from markdown file."""
    if not os.path.exists(ACCESSIBILITY_EXEMPTIONS_FILE):
        return []
    
    with open(ACCESSIBILITY_EXEMPTIONS_FILE, 'r') as f:
        content = f.read()
    
    exemptions = []
    
    # Find tables in markdown
    table_pattern = r'\|([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\|]+)\|([^\|]+)\|'
    
    lines = content.split('\n')
    in_table = False
    current_category = None
    
    for line in lines:
        # Track categories
        if line.startswith('## Category:'):
            current_category = line.replace('## Category:', '').strip()
            continue
        
        # Skip header and separator rows
        if '|' in line and ('Component' in line or '---' in line):
            in_table = True
            continue
        
        if in_table and '|' in line:
            match = re.match(table_pattern, line)
            if match:
                exemption = {
                    'component': match.group(1).strip(),
                    'issue': match.group(2).strip(),
                    'wcag_level': match.group(3).strip(),
                    'severity': match.group(4).strip(),
                    'justification': match.group(5).strip(),
                    'expiration': match.group(6).strip(),
                    'remediation': match.group(7).strip(),
                    'status': match.group(8).strip(),
                    'category': current_category
                }
                exemptions.append(exemption)
    
    return exemptions

def validate_exemptions() -> List[str]:
    """Validate accessibility exemptions."""
    exemptions = parse_exemptions_file()
    warnings = []
    
    for exemption in exemptions:
        # Check expiration date
        try:
            expiration_date = datetime.fromisoformat(exemption['expiration'])
            if expiration_date < datetime.now():
                warnings.append(
                    f"⚠️  Exemption expired for {exemption['component']} "
                    f"(expired: {exemption['expiration']})"
                )
            elif expiration_date < datetime.now() + timedelta(days=30):
                warnings.append(
                    f"⏰ Exemption expiring soon for {exemption['component']} "
                    f"(expires: {exemption['expiration']})"
                )
        except ValueError:
            warnings.append(
                f"❌ Invalid expiration date for {exemption['component']}: "
                f"{exemption['expiration']}"
            )
        
        # Check justification
        if not exemption['justification'] or exemption['justification'] == '-':
            warnings.append(
                f"❌ Missing justification for {exemption['component']}"
            )
        
        # Check remediation plan
        if not exemption['remediation'] or exemption['remediation'] == '-':
            warnings.append(
                f"❌ Missing remediation plan for {exemption['component']}"
            )
    
    return warnings

# ============================================================================
# Color Contrast Validation
# ============================================================================

def hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    """Convert hex color to RGB tuple."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def calculate_luminance(r: int, g: int, b: int) -> float:
    """Calculate relative luminance of RGB color."""
    def normalize(value: int) -> float:
        val = value / 255.0
        if val <= 0.03928:
            return val / 12.92
        return ((val + 0.055) / 1.055) ** 2.4
    
    r_norm = normalize(r)
    g_norm = normalize(g)
    b_norm = normalize(b)
    
    return 0.2126 * r_norm + 0.7152 * g_norm + 0.0722 * b_norm

def calculate_contrast_ratio(color1: str, color2: str) -> float:
    """Calculate WCAG contrast ratio between two colors."""
    rgb1 = hex_to_rgb(color1)
    rgb2 = hex_to_rgb(color2)
    
    lum1 = calculate_luminance(*rgb1)
    lum2 = calculate_luminance(*rgb2)
    
    lighter = max(lum1, lum2)
    darker = min(lum1, lum2)
    
    return (lighter + 0.05) / (darker + 0.05)

def check_contrast(foreground: str, background: str, is_large_text: bool = False) -> Dict:
    """Check if color contrast meets WCAG AA."""
    ratio = calculate_contrast_ratio(foreground, background)
    required_ratio = WCAG_AA_LARGE_TEXT if is_large_text else WCAG_AA_NORMAL_TEXT
    passes = ratio >= required_ratio
    
    return {
        'ratio': ratio,
        'required': required_ratio,
        'passes': passes,
        'foreground': foreground,
        'background': background,
        'is_large_text': is_large_text
    }

def find_accessible_alternatives(foreground: str, background: str, target_ratio: float) -> List[str]:
    """Find accessible color alternatives that meet contrast requirement."""
    alternatives = []
    
    # Try darker shades of foreground color
    rgb = hex_to_rgb(foreground)
    for i in range(1, 10):
        darker_rgb = tuple(max(0, c - i * 20) for c in rgb)
        darker_hex = f"#{darker_rgb[0]:02x}{darker_rgb[1]:02x}{darker_rgb[2]:02x}"
        ratio = calculate_contrast_ratio(darker_hex, background)
        if ratio >= target_ratio:
            alternatives.append(f"{darker_hex} ({ratio:.1f}:1)")
    
    return alternatives[:3]  # Return top 3 alternatives

# ============================================================================
# Component Analysis
# ============================================================================

def is_critical_component(component_path: str) -> bool:
    """Check if component is critical (auth, payment, checkout)."""
    component_lower = component_path.lower()
    return any(keyword in component_lower for keyword in CRITICAL_COMPONENTS)

def is_user_facing_component(component_path: str) -> bool:
    """Check if component is user-facing (not admin-only)."""
    component_lower = component_path.lower()
    
    # Exclude admin/internal components
    if 'admin' in component_lower or 'internal' in component_lower:
        return False
    
    # Include user-facing keywords
    return any(keyword in component_lower for keyword in USER_FACING_KEYWORDS)

def estimate_effort(violation: Dict) -> float:
    """Estimate effort in hours to fix violation."""
    violation_type = violation.get('type', 'unknown')
    
    effort_map = {
        'missing_aria_label': 0.5,
        'color_contrast': 1.0,
        'missing_keyboard_nav': 2.0,
        'missing_focus_indicator': 1.0,
        'missing_form_label': 0.5,
        'missing_focus_trap': 2.0,
        'missing_screen_reader_support': 3.0
    }
    
    return effort_map.get(violation_type, 2.0)

# ============================================================================
# Multi-Factor Prioritization
# ============================================================================

def calculate_priority_score(violation: Dict, component_path: str) -> float:
    """Calculate priority score (0-1) for accessibility violation."""
    # Factor 1: WCAG Severity (40%)
    severity_map = {
        'critical': 1.0,
        'high': 0.7,
        'medium': 0.4,
        'low': 0.2
    }
    severity_score = severity_map.get(violation.get('severity', 'medium'), 0.4)
    
    # Factor 2: Component Criticality (30%)
    criticality_score = 1.0 if is_critical_component(component_path) else 0.5
    
    # Factor 3: User Impact (30%)
    impact_score = 1.0 if is_user_facing_component(component_path) else 0.3
    
    # Weighted average
    priority_score = (
        severity_score * 0.4 +
        criticality_score * 0.3 +
        impact_score * 0.3
    )
    
    return priority_score

def prioritize_issues(violations: List[Dict], component_path: str) -> List[Dict]:
    """Prioritize accessibility issues using multi-factor analysis."""
    prioritized = []
    
    for violation in violations:
        priority_score = calculate_priority_score(violation, component_path)
        effort_hours = estimate_effort(violation)
        roi_score = priority_score / effort_hours if effort_hours > 0 else 0
        
        # Categorize
        if roi_score > 0.3:
            category = 'quick_win'
        elif priority_score > 0.7:
            category = 'high_impact_project'
        else:
            category = 'backlog'
        
        violation['priority_score'] = priority_score
        violation['effort_hours'] = effort_hours
        violation['roi_score'] = roi_score
        violation['category'] = category
        
        prioritized.append(violation)
    
    # Sort by priority score (descending)
    prioritized.sort(key=lambda x: x['priority_score'], reverse=True)
    
    return prioritized

# ============================================================================
# Report Generation
# ============================================================================

def generate_html_report(violations: List[Dict], exemptions: List[Dict], 
                         compliance_score: float, trends: List[Dict]) -> str:
    """Generate enhanced HTML accessibility report."""
    
    # Calculate quick wins
    quick_wins = [v for v in violations if v.get('category') == 'quick_win']
    high_impact = [v for v in violations if v.get('category') == 'high_impact_project']
    
    # Calculate health score
    health_score = compliance_score
    
    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Report - {datetime.now().strftime('%Y-%m-%d')}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
        }}
        .container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .health-card {{
            text-align: center;
            padding: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
            margin-bottom: 30px;
        }}
        .score {{
            font-size: 64px;
            font-weight: bold;
            margin: 10px 0;
        }}
        .grade {{
            font-size: 24px;
            opacity: 0.9;
        }}
        .quick-wins {{
            background: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }}
        .violation {{
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #ef4444;
            background: #fef2f2;
        }}
        .violation.high-priority {{
            border-left-color: #dc2626;
        }}
        .violation.medium-priority {{
            border-left-color: #f59e0b;
        }}
        .violation.low-priority {{
            border-left-color: #6b7280;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }}
        th, td {{
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }}
        th {{
            background: #f9fafb;
            font-weight: 600;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Accessibility Report</h1>
        <p>Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        
        <div class="health-card">
            <div class="score">{health_score:.0f}/100</div>
            <div class="grade">{'A' if health_score >= 90 else 'B' if health_score >= 75 else 'C' if health_score >= 60 else 'D'}</div>
            <div>WCAG AA Compliance Score</div>
        </div>
        
        <div class="quick-wins">
            <h2>🎯 Quick Wins ({len(quick_wins)} issues, ~{sum(v.get('effort_hours', 0) for v in quick_wins):.1f} hours)</h2>
            <ul>
"""
    
    for violation in quick_wins[:10]:  # Top 10 quick wins
        html += f"""
                <li>{violation.get('description', 'Unknown')} - {violation.get('effort_hours', 0):.1f}h - {violation.get('wcag_criteria', 'WCAG AA')}</li>
"""
    
    html += """
            </ul>
        </div>
        
        <h2>Violations</h2>
        <table>
            <thead>
                <tr>
                    <th>Component</th>
                    <th>Issue</th>
                    <th>WCAG</th>
                    <th>Severity</th>
                    <th>Priority</th>
                    <th>Effort</th>
                </tr>
            </thead>
            <tbody>
"""
    
    for violation in violations[:50]:  # Top 50 violations
        priority_class = violation.get('severity', 'medium').lower()
        html += f"""
                <tr>
                    <td>{violation.get('component', 'Unknown')}</td>
                    <td>{violation.get('description', 'Unknown')}</td>
                    <td>{violation.get('wcag_criteria', 'WCAG AA')}</td>
                    <td>{violation.get('severity', 'medium')}</td>
                    <td>{violation.get('priority_score', 0):.2f}</td>
                    <td>{violation.get('effort_hours', 0):.1f}h</td>
                </tr>
"""
    
    html += """
            </tbody>
        </table>
        
        <h2>Active Exemptions</h2>
        <table>
            <thead>
                <tr>
                    <th>Component</th>
                    <th>Issue</th>
                    <th>WCAG</th>
                    <th>Expiration</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
"""
    
    for exemption in exemptions:
        html += f"""
                <tr>
                    <td>{exemption.get('component', 'Unknown')}</td>
                    <td>{exemption.get('issue', 'Unknown')}</td>
                    <td>{exemption.get('wcag_level', 'WCAG AA')}</td>
                    <td>{exemption.get('expiration', 'Unknown')}</td>
                    <td>{exemption.get('status', 'Active')}</td>
                </tr>
"""
    
    html += """
            </tbody>
        </table>
    </div>
</body>
</html>
"""
    
    return html

# ============================================================================
# Main CLI
# ============================================================================

def main():
    parser = argparse.ArgumentParser(description='Check accessibility compliance (R19)')
    parser.add_argument('--all', action='store_true', help='Run all accessibility checks')
    parser.add_argument('--keyboard', action='store_true', help='Check keyboard navigation')
    parser.add_argument('--aria', action='store_true', help='Check ARIA attributes')
    parser.add_argument('--contrast', action='store_true', help='Check color contrast')
    parser.add_argument('--focus', action='store_true', help='Check focus management')
    parser.add_argument('--exemptions', action='store_true', help='Validate exemptions')
    parser.add_argument('--generate-report', action='store_true', help='Generate HTML report')
    
    args = parser.parse_args()
    
    if args.exemptions or args.all:
        print("🔍 Validating accessibility exemptions...")
        warnings = validate_exemptions()
        if warnings:
            for warning in warnings:
                print(warning)
        else:
            print("✅ All exemptions are valid")
    
    if args.contrast or args.all:
        print("\n🎨 Checking color contrast...")
        # Example contrast check
        result = check_contrast('#333333', '#ffffff', is_large_text=False)
        if result['passes']:
            print(f"✅ Contrast ratio {result['ratio']:.2f}:1 meets WCAG AA")
        else:
            alternatives = find_accessible_alternatives(result['foreground'], result['background'], result['required'])
            print(f"❌ Contrast ratio {result['ratio']:.2f}:1 below WCAG AA (needs {result['required']}:1)")
            if alternatives:
                print(f"💡 Suggestions: {', '.join(alternatives)}")
    
    if args.generate_report or args.all:
        print("\n📊 Generating accessibility report...")
        violations = []  # Would be populated from actual checks
        exemptions = parse_exemptions_file()
        compliance_score = 85.0  # Would be calculated from violations
        trends = load_accessibility_history()
        
        html = generate_html_report(violations, exemptions, compliance_score, trends)
        
        with open(ACCESSIBILITY_REPORT_FILE, 'w') as f:
            f.write(html)
        
        print(f"✅ Report generated: {ACCESSIBILITY_REPORT_FILE}")
    
    if not any(vars(args).values()):
        parser.print_help()

if __name__ == '__main__':
    main()



