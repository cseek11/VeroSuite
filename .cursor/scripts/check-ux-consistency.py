#!/usr/bin/env python3
"""
UX Consistency Checker (R20)

This script checks UI components for UX consistency including spacing, typography,
component usage, component variants, and design system compliance.

Usage:
    python .cursor/scripts/check-ux-consistency.py --all
    python .cursor/scripts/check-ux-consistency.py --spacing
    python .cursor/scripts/check-ux-consistency.py --typography
    python .cursor/scripts/check-ux-consistency.py --components
    python .cursor/scripts/check-ux-consistency.py --design-system
    python .cursor/scripts/check-ux-consistency.py --compare-pages
    python .cursor/scripts/check-ux-consistency.py --generate-report
"""

import argparse
import json
import os
import re
import sys
from collections import defaultdict
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# ============================================================================
# Configuration
# ============================================================================

DESIGN_SYSTEM_FILE = 'docs/DESIGN_SYSTEM.md'
CRM_STYLING_GUIDE_FILE = 'docs/CRM_STYLING_GUIDE.md'
COMPONENT_LIBRARY_CATALOG_FILE = 'docs/COMPONENT_LIBRARY_CATALOG.md'
UX_CONSISTENCY_REPORT_FILE = 'ux-consistency-report.html'

# Standard Tailwind spacing utilities (from design system)
STANDARD_SPACING_CLASSES = {
    'page_padding': ['p-3', 'p-6'],
    'card_padding': ['p-4'],
    'section_spacing': ['mb-4'],
    'element_spacing': ['mb-3'],
    'vertical_rhythm': ['space-y-4', 'space-y-3', 'space-y-2']
}

# Standard Tailwind typography scale (from design system)
STANDARD_TYPOGRAPHY_CLASSES = {
    'page_title': ['text-2xl', 'font-bold'],
    'section_header': ['text-lg', 'text-xl', 'font-bold', 'font-semibold'],
    'body_text': ['text-sm', 'text-base'],
    'label': ['text-xs', 'font-semibold']
}

# Standard component variants
STANDARD_VARIANTS = ['primary', 'secondary', 'danger', 'outline', 'ghost']

# Critical components (must use CustomerSearchSelector for customer fields)
CUSTOMER_FIELD_KEYWORDS = ['customer', 'customerId', 'customer_id']

# ============================================================================
# Design System Parsing
# ============================================================================

def parse_design_system() -> Dict:
    """Parse design system documentation."""
    design_system = {
        'spacing': {},
        'typography': {},
        'components': {},
        'variants': {}
    }
    
    if os.path.exists(DESIGN_SYSTEM_FILE):
        try:
            with open(DESIGN_SYSTEM_FILE, 'r', encoding='utf-8') as f:
                content = f.read()
        except (OSError, IOError, UnicodeDecodeError) as e:
            print(f"Error reading design system file: {e}", file=sys.stderr)
            return design_system
        
        # Parse spacing
            spacing_match = re.search(r'Page Padding.*?`(p-\d+)`', content, re.DOTALL)
            if spacing_match:
                design_system['spacing']['page_padding'] = spacing_match.group(1)
            
            spacing_match = re.search(r'Card Padding.*?`(p-\d+)`', content, re.DOTALL)
            if spacing_match:
                design_system['spacing']['card_padding'] = spacing_match.group(1)
            
            # Parse typography
            typography_match = re.search(r'Page Title.*?`(text-\w+)`', content, re.DOTALL)
            if typography_match:
                design_system['typography']['page_title'] = typography_match.group(1)
            
            typography_match = re.search(r'Section Headers.*?`(text-\w+)`', content, re.DOTALL)
            if typography_match:
                design_system['typography']['section_header'] = typography_match.group(1)
    
    if os.path.exists(CRM_STYLING_GUIDE_FILE):
        try:
            with open(CRM_STYLING_GUIDE_FILE, 'r', encoding='utf-8') as f:
                content = f.read()
        except (OSError, IOError, UnicodeDecodeError) as e:
            print(f"Error reading CRM styling guide: {e}", file=sys.stderr)
            return design_system
        
        # Parse CRM-specific patterns
        # Add CRM-specific parsing here
    
    return design_system

def parse_component_library_catalog() -> List[str]:
    """Parse component library catalog to get available components."""
    components = []
    
    if os.path.exists(COMPONENT_LIBRARY_CATALOG_FILE):
        try:
            with open(COMPONENT_LIBRARY_CATALOG_FILE, 'r', encoding='utf-8') as f:
                content = f.read()
        except (OSError, IOError, UnicodeDecodeError) as e:
            print(f"Error reading component library catalog: {e}", file=sys.stderr)
            return components
        
        # Extract component names from catalog
            component_matches = re.findall(r'#### `(\w+)`', content)
            components.extend(component_matches)
    
    return components

# ============================================================================
# Pattern Detection
# ============================================================================

def detect_custom_spacing(file_path: str, content: str) -> List[Dict]:
    """Detect custom spacing values (pattern matching)."""
    violations = []
    
    # Pattern: p-[value], mb-[value], space-y-[value]
    custom_spacing_pattern = r'(p|m|px|py|mx|my|pt|pb|pl|pr|mt|mb|ml|mr|space-[xy])-\[([^\]]+)\]'
    matches = re.finditer(custom_spacing_pattern, content)
    
    for match in matches:
        violations.append({
            'type': 'custom_spacing',
            'line': content[:match.start()].count('\n') + 1,
            'class': match.group(0),
            'suggestion': get_standard_spacing_suggestion(match.group(1), match.group(2)),
            'confidence': 'high'
        })
    
    return violations

def detect_custom_typography(file_path: str, content: str) -> List[Dict]:
    """Detect custom typography values (pattern matching)."""
    violations = []
    
    # Pattern: text-[value]
    custom_typography_pattern = r'text-\[([^\]]+)\]'
    matches = re.finditer(custom_typography_pattern, content)
    
    for match in matches:
        violations.append({
            'type': 'custom_typography',
            'line': content[:match.start()].count('\n') + 1,
            'class': match.group(0),
            'suggestion': get_standard_typography_suggestion(match.group(1)),
            'confidence': 'high'
        })
    
    return violations

def detect_custom_colors(file_path: str, content: str) -> List[Dict]:
    """Detect custom color values (pattern matching)."""
    violations = []
    
    # Pattern: bg-[#value], text-[#value], border-[#value]
    custom_color_pattern = r'(bg|text|border)-\[([^\]]+)\]'
    matches = re.finditer(custom_color_pattern, content)
    
    for match in matches:
        violations.append({
            'type': 'custom_color',
            'line': content[:match.start()].count('\n') + 1,
            'class': match.group(0),
            'suggestion': get_standard_variant_suggestion(match.group(1), match.group(2)),
            'confidence': 'high'
        })
    
    return violations

def get_standard_spacing_suggestion(property_type: str, value: str) -> str:
    """Get standard spacing suggestion for custom value."""
    # Convert pixel value to Tailwind class
    try:
        px_value = int(re.search(r'\d+', value).group())
        # Approximate mapping (4px = 1 Tailwind unit)
        tailwind_unit = px_value // 4
        
        if property_type.startswith('p'):
            return f'p-{tailwind_unit}'
        elif property_type.startswith('m'):
            return f'm-{tailwind_unit}'
        elif property_type.startswith('space'):
            return f'space-y-{tailwind_unit}'
    except (AttributeError, ValueError, TypeError):
        pass
    
    return f'{property_type}-4'  # Default suggestion

def get_standard_typography_suggestion(value: str) -> str:
    """Get standard typography suggestion for custom value."""
    try:
        px_value = int(re.search(r'\d+', value).group())
        
        # Map to standard typography scale
        if px_value >= 24:
            return 'text-2xl'
        elif px_value >= 20:
            return 'text-xl'
        elif px_value >= 18:
            return 'text-lg'
        elif px_value >= 16:
            return 'text-base'
        elif px_value >= 14:
            return 'text-sm'
        else:
            return 'text-xs'
    except (AttributeError, ValueError):
        pass
    
    return 'text-sm'  # Default suggestion

def get_standard_variant_suggestion(property_type: str, color: str) -> str:
    """Get standard variant suggestion for custom color."""
    # Map common colors to variants
    color_lower = color.lower()
    
    if 'red' in color_lower or '#ef4444' in color_lower or '#f59e0b' in color_lower:
        return 'variant="danger"'
    elif 'blue' in color_lower or '#6366f1' in color_lower or '#8b5cf6' in color_lower:
        return 'variant="primary"'
    elif 'gray' in color_lower or '#6b7280' in color_lower:
        return 'variant="secondary"'
    else:
        return 'variant="primary"'  # Default suggestion

# ============================================================================
# Component Detection
# ============================================================================

def detect_component_imports(file_path: str, content: str) -> List[Dict]:
    """Detect component imports not from design system."""
    violations = []
    
    # Pattern: import ... from '../components' or './components'
    relative_import_pattern = r"import\s+.*?\s+from\s+['\"](\.\.?\/.*?components[^'\"]*)['\"]"
    matches = re.finditer(relative_import_pattern, content)
    
    for match in matches:
        violations.append({
            'type': 'relative_import',
            'line': content[:match.start()].count('\n') + 1,
            'import': match.group(0),
            'suggestion': 'Use @/components/ui/ imports for design system components',
            'confidence': 'high'
        })
    
    return violations

def detect_component_usage(file_path: str, content: str, catalog_components: List[str]) -> List[Dict]:
    """Detect component usage violations."""
    violations = []
    
    # Check for CustomerSearchSelector usage for customer fields
    has_customer_field = any(keyword in content.lower() for keyword in CUSTOMER_FIELD_KEYWORDS)
    uses_basic_select = re.search(r'<Select[^>]*customer', content, re.IGNORECASE)
    uses_customer_search = 'CustomerSearchSelector' in content
    
    if has_customer_field and uses_basic_select and not uses_customer_search:
        violations.append({
            'type': 'customer_field_component',
            'line': 0,
            'issue': 'Basic Select used for customer field',
            'suggestion': 'Use CustomerSearchSelector component from @/components/ui/CustomerSearchSelector',
            'confidence': 'high'
        })
    
    return violations

def detect_duplicate_components(file_path: str, content: str, existing_components: List[str]) -> List[Dict]:
    """Detect duplicate components."""
    violations = []
    
    # Check if new component is being created
    component_def_pattern = r'(?:export\s+)?(?:const|function)\s+(\w+)\s*[:=]\s*(?:\([^)]*\)\s*)?=>'
    matches = re.finditer(component_def_pattern, content)
    
    for match in matches:
        component_name = match.group(1)
        
        # Check if similar component exists
        for existing in existing_components:
            if component_name.lower() == existing.lower() or \
               (component_name.endswith('Button') and existing == 'Button') or \
               (component_name.endswith('Input') and existing == 'Input'):
                violations.append({
                    'type': 'duplicate_component',
                    'line': content[:match.start()].count('\n') + 1,
                    'component': component_name,
                    'suggestion': f'Similar component {existing} already exists. Consider reusing it.',
                    'confidence': 'medium'
                })
    
    return violations

# ============================================================================
# Page Classification and Comparison
# ============================================================================

def classify_page(file_path: str) -> Dict:
    """Classify page by type, domain, and action."""
    classification = {
        'type': None,  # form, list, detail, settings, dashboard
        'domain': None,  # customer, work-order, invoice, etc.
        'action': None,  # create, edit, view, list
        'path': file_path
    }
    
    path_lower = file_path.lower()
    
    # Classify by action
    if 'create' in path_lower:
        classification['action'] = 'create'
        classification['type'] = 'form'
    elif 'edit' in path_lower or 'update' in path_lower:
        classification['action'] = 'edit'
        classification['type'] = 'form'
    elif 'list' in path_lower:
        classification['action'] = 'list'
        classification['type'] = 'list'
    elif 'detail' in path_lower or 'view' in path_lower:
        classification['action'] = 'view'
        classification['type'] = 'detail'
    elif 'settings' in path_lower:
        classification['type'] = 'settings'
    
    # Classify by domain
    if 'customer' in path_lower:
        classification['domain'] = 'customer'
    elif 'work-order' in path_lower or 'workorder' in path_lower:
        classification['domain'] = 'work-order'
    elif 'invoice' in path_lower:
        classification['domain'] = 'invoice'
    
    return classification

def find_similar_pages(file_path: str, all_files: List[str]) -> List[str]:
    """Find similar pages for comparison."""
    current_classification = classify_page(file_path)
    similar_pages = []
    
    for other_file in all_files:
        if other_file == file_path:
            continue
        
        other_classification = classify_page(other_file)
        
        # Check if similar (same type and action)
        if (current_classification['type'] == other_classification['type'] and
            current_classification['action'] == other_classification['action']):
            similar_pages.append(other_file)
    
    return similar_pages[:3]  # Return up to 3 similar pages

def compare_spacing(file_path: str, content: str, similar_pages: List[str]) -> List[Dict]:
    """Compare spacing with similar pages."""
    violations = []
    
    # Extract spacing classes from current file
    current_spacing = set(re.findall(r'(p|m|px|py|mx|my|pt|pb|pl|pr|mt|mb|ml|mr|space-[xy])-\d+', content))
    
    for similar_page in similar_pages:
        if not os.path.exists(similar_page):
            continue
        
        try:
            with open(similar_page, 'r', encoding='utf-8') as f:
                similar_content = f.read()
        except (OSError, IOError, UnicodeDecodeError) as e:
            print(f"Error reading similar page {similar_page}: {e}", file=sys.stderr)
            continue
        
        similar_spacing = set(re.findall(r'(p|m|px|py|mx|my|pt|pb|pl|pr|mt|mb|ml|mr|space-[xy])-\d+', similar_content))
            
            # Check for differences
            differences = current_spacing.symmetric_difference(similar_spacing)
            if differences:
                violations.append({
                    'type': 'spacing_inconsistency',
                    'similar_page': similar_page,
                    'differences': list(differences),
                    'suggestion': f'Match spacing with {similar_page}',
                    'confidence': 'medium'
                })
    
    return violations

def compare_typography(file_path: str, content: str, similar_pages: List[str]) -> List[Dict]:
    """Compare typography with similar pages."""
    violations = []
    
    # Extract typography classes from current file
    current_typography = set(re.findall(r'text-(xl|lg|base|sm|xs)', content))
    
    for similar_page in similar_pages:
        if not os.path.exists(similar_page):
            continue
        
        try:
            with open(similar_page, 'r', encoding='utf-8') as f:
                similar_content = f.read()
        except (OSError, IOError, UnicodeDecodeError) as e:
            print(f"Error reading similar page {similar_page}: {e}", file=sys.stderr)
            continue
        
        similar_typography = set(re.findall(r'text-(xl|lg|base|sm|xs)', similar_content))
            
            # Check for differences
            differences = current_typography.symmetric_difference(similar_typography)
            if differences:
                violations.append({
                    'type': 'typography_inconsistency',
                    'similar_page': similar_page,
                    'differences': list(differences),
                    'suggestion': f'Match typography with {similar_page}',
                    'confidence': 'medium'
                })
    
    return violations

# ============================================================================
# Design System Validation
# ============================================================================

def validate_against_design_system(file_path: str, content: str, design_system: Dict) -> List[Dict]:
    """Validate against design system documentation."""
    violations = []
    
    # Validate spacing
    if 'spacing' in design_system:
        page_padding = design_system['spacing'].get('page_padding')
        if page_padding:
            # Check if page padding matches design system
            if not re.search(rf'\b{re.escape(page_padding)}\b', content):
                violations.append({
                    'type': 'spacing_design_system',
                    'issue': f'Page padding should be {page_padding}',
                    'suggestion': f'Update to use {page_padding} as specified in design system',
                    'confidence': 'high'
                })
    
    # Validate typography
    if 'typography' in design_system:
        page_title = design_system['typography'].get('page_title')
        if page_title:
            # Check if page title matches design system
            if not re.search(rf'\b{re.escape(page_title)}\b', content):
                violations.append({
                    'type': 'typography_design_system',
                    'issue': f'Page title should use {page_title}',
                    'suggestion': f'Update to use {page_title} as specified in design system',
                    'confidence': 'high'
                })
    
    return violations

# ============================================================================
# Main Checker
# ============================================================================

def check_file(file_path: str, design_system: Dict, catalog_components: List[str], 
               all_files: List[str]) -> Dict:
    """Check a single file for UX consistency violations."""
    violations = {
        'file': file_path,
        'spacing': [],
        'typography': [],
        'components': [],
        'variants': [],
        'comparison': [],
        'design_system': []
    }
    
    if not os.path.exists(file_path):
        return violations
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except (OSError, IOError, UnicodeDecodeError) as e:
        print(f"Error reading file {file_path}: {e}", file=sys.stderr)
        return violations
    
    # Pattern matching
    violations['spacing'].extend(detect_custom_spacing(file_path, content))
    violations['typography'].extend(detect_custom_typography(file_path, content))
    violations['variants'].extend(detect_custom_colors(file_path, content))
    
    # Component detection
    violations['components'].extend(detect_component_imports(file_path, content))
    violations['components'].extend(detect_component_usage(file_path, content, catalog_components))
    violations['components'].extend(detect_duplicate_components(file_path, content, catalog_components))
    
    # Comparison
    similar_pages = find_similar_pages(file_path, all_files)
    violations['comparison'].extend(compare_spacing(file_path, content, similar_pages))
    violations['comparison'].extend(compare_typography(file_path, content, similar_pages))
    
    # Design system validation
    violations['design_system'].extend(validate_against_design_system(file_path, content, design_system))
    
    return violations

def check_all_files() -> List[Dict]:
    """Check all frontend files."""
    violations = []
    
    # Find all frontend files
    frontend_dir = Path('frontend/src')
    if not frontend_dir.exists():
        return violations
    
    all_files = []
    for ext in ['*.tsx', '*.ts']:
        all_files.extend(frontend_dir.rglob(ext))
    
    all_files = [str(f) for f in all_files]
    
    # Load design system and catalog
    design_system = parse_design_system()
    catalog_components = parse_component_library_catalog()
    
    # Check each file
    for file_path in all_files:
        file_violations = check_file(file_path, design_system, catalog_components, all_files)
        if any(file_violations.values()):
            violations.append(file_violations)
    
    return violations

# ============================================================================
# Reporting
# ============================================================================

def format_output(violations: List[Dict], format_type: str = 'text') -> str:
    """Format violations for output."""
    if format_type == 'json':
        return json.dumps(violations, indent=2)
    
    output = []
    output.append("=" * 80)
    output.append("UX Consistency Check Results (R20)")
    output.append("=" * 80)
    output.append("")
    
    if not violations:
        output.append("✅ No UX consistency violations found!")
        return "\n".join(output)
    
    total_violations = sum(len(v.get('spacing', [])) + len(v.get('typography', [])) + 
                          len(v.get('components', [])) + len(v.get('variants', [])) +
                          len(v.get('comparison', [])) + len(v.get('design_system', []))
                          for v in violations)
    
    output.append(f"Found {total_violations} violations across {len(violations)} files")
    output.append("")
    
    for violation in violations:
        output.append(f"File: {violation['file']}")
        output.append("-" * 80)
        
        # Spacing violations
        if violation.get('spacing'):
            output.append("  Spacing Issues:")
            for issue in violation['spacing']:
                output.append(f"    - Line {issue.get('line', '?')}: {issue.get('class', '?')}")
                output.append(f"      Suggestion: {issue.get('suggestion', 'N/A')}")
        
        # Typography violations
        if violation.get('typography'):
            output.append("  Typography Issues:")
            for issue in violation['typography']:
                output.append(f"    - Line {issue.get('line', '?')}: {issue.get('class', '?')}")
                output.append(f"      Suggestion: {issue.get('suggestion', 'N/A')}")
        
        # Component violations
        if violation.get('components'):
            output.append("  Component Issues:")
            for issue in violation['components']:
                output.append(f"    - {issue.get('issue', '?')}")
                output.append(f"      Suggestion: {issue.get('suggestion', 'N/A')}")
        
        # Variant violations
        if violation.get('variants'):
            output.append("  Variant Issues:")
            for issue in violation['variants']:
                output.append(f"    - Line {issue.get('line', '?')}: {issue.get('class', '?')}")
                output.append(f"      Suggestion: {issue.get('suggestion', 'N/A')}")
        
        # Comparison violations
        if violation.get('comparison'):
            output.append("  Consistency Issues (compared to similar pages):")
            for issue in violation['comparison']:
                output.append(f"    - {issue.get('type', '?')}")
                output.append(f"      Similar page: {issue.get('similar_page', '?')}")
                output.append(f"      Suggestion: {issue.get('suggestion', 'N/A')}")
        
        # Design system violations
        if violation.get('design_system'):
            output.append("  Design System Issues:")
            for issue in violation['design_system']:
                output.append(f"    - {issue.get('issue', '?')}")
                output.append(f"      Suggestion: {issue.get('suggestion', 'N/A')}")
        
        output.append("")
    
    return "\n".join(output)

def generate_report(violations: List[Dict]):
    """Generate HTML report."""
    html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>UX Consistency Report (R20)</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; }}
        .header {{ background: #6366f1; color: white; padding: 20px; border-radius: 8px; }}
        .violation {{ border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 4px; }}
        .violation-type {{ font-weight: bold; color: #ef4444; }}
        .suggestion {{ color: #10b981; margin-top: 5px; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>UX Consistency Report (R20)</h1>
        <p>Generated: {json.dumps(violations, indent=2)}</p>
    </div>
    <!-- Report content would be generated here -->
</body>
</html>
"""
    
    try:
        with open(UX_CONSISTENCY_REPORT_FILE, 'w', encoding='utf-8') as f:
            f.write(html)
    except (OSError, IOError) as e:
        print(f"Error writing UX consistency report: {e}", file=sys.stderr)
        return
    
    print(f"Report generated: {UX_CONSISTENCY_REPORT_FILE}")

# ============================================================================
# CLI
# ============================================================================

def main():
    parser = argparse.ArgumentParser(description='R20: UX Consistency Checker')
    parser.add_argument('--file', help='Check a single file')
    parser.add_argument('--all', action='store_true', help='Check all files')
    parser.add_argument('--spacing', action='store_true', help='Check spacing only')
    parser.add_argument('--typography', action='store_true', help='Check typography only')
    parser.add_argument('--components', action='store_true', help='Check components only')
    parser.add_argument('--design-system', action='store_true', help='Check design system compliance')
    parser.add_argument('--compare-pages', action='store_true', help='Compare with similar pages')
    parser.add_argument('--generate-report', action='store_true', help='Generate HTML report')
    parser.add_argument('--json', action='store_true', help='Output JSON format')
    
    args = parser.parse_args()
    
    if args.file:
        design_system = parse_design_system()
        catalog_components = parse_component_library_catalog()
        all_files = []
        violations = [check_file(args.file, design_system, catalog_components, all_files)]
    elif args.all:
        violations = check_all_files()
    else:
        parser.print_help()
        return
    
    # Filter violations based on flags
    if args.spacing or args.typography or args.components or args.design_system:
        filtered_violations = []
        for violation in violations:
            filtered = {'file': violation['file']}
            if args.spacing:
                filtered['spacing'] = violation.get('spacing', [])
            if args.typography:
                filtered['typography'] = violation.get('typography', [])
            if args.components:
                filtered['components'] = violation.get('components', [])
            if args.design_system:
                filtered['design_system'] = violation.get('design_system', [])
            filtered_violations.append(filtered)
        violations = filtered_violations
    
    # Output
    if args.generate_report:
        generate_report(violations)
    else:
        output_format = 'json' if args.json else 'text'
        print(format_output(violations, output_format))
    
    # Exit code
    if violations:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == '__main__':
    main()





