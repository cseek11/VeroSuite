#!/usr/bin/env python3
"""
Two-Brain Integration Module.
Connects existing auto-enforcer with new Two-Brain components.

This module enhances the existing VeroFieldEnforcer to generate
ENFORCER_REPORT.json for Brain B (LLM) consumption.

Last Updated: 2025-12-04
"""

import sys
from pathlib import Path
from typing import List, Optional

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from .report_generator import EnforcerReport, Violation, AutoFix


class TwoBrainIntegration:
    """
    Integration layer between existing enforcer and Two-Brain components.
    
    Converts existing enforcer violations into ENFORCER_REPORT.json format.
    """
    
    def __init__(self, enforcer_instance=None):
        """
        Initialize integration.
        
        Args:
            enforcer_instance: Instance of VeroFieldEnforcer (optional)
        """
        self.enforcer = enforcer_instance
        self.report_path = Path(".cursor/enforcement/ENFORCER_REPORT.json")
    
    def generate_report_from_enforcer(self, enforcer_instance) -> EnforcerReport:
        """
        Generate ENFORCER_REPORT.json from existing enforcer violations.
        
        This method reads violations from the existing enforcer and converts
        them to the Two-Brain report format.
        
        Args:
            enforcer_instance: Instance of VeroFieldEnforcer with violations detected
        
        Returns:
            EnforcerReport object ready to save
        """
        # Get session ID from enforcer
        session_id = None
        if hasattr(enforcer_instance, 'session') and enforcer_instance.session:
            session_id = enforcer_instance.session.session_id
        
        # Create report
        report = EnforcerReport(session_id=session_id)
        
        # Convert enforcer violations to report violations
        # Deduplicate violations by (file, line_number, rule_ref) only when a line number
        # is provided. Violations without line numbers should always be reported.
        seen = set()
        
        if hasattr(enforcer_instance, 'violations'):
            for v in enforcer_instance.violations:
                file_path = self._get_file_path(v)
                line_number = getattr(v, 'line_number', None)
                rule_ref = self._get_rule_ref(v)
                
                if line_number is not None:
                    key = (file_path, line_number, rule_ref)
                    if key in seen:
                        # Duplicate violation detected - skip to prevent duplicates in report
                        # This can happen when violations are re-evaluated or when multiple scopes are involved
                        continue
                    seen.add(key)
                
                # Map enforcer Violation to report Violation
                report_violation = Violation(
                    id=self._generate_violation_id(v),
                    severity=self._map_severity(v),
                    file=file_path,
                    rule_ref=rule_ref,
                    description=self._get_description(v),
                    evidence=self._get_evidence(v),
                    fix_hint=self._get_fix_hint(v),
                    session_scope=self._get_session_scope(v)
                )
                report.add_violation(report_violation)
        
        # Add auto-fixes if any
        if hasattr(enforcer_instance, 'session') and enforcer_instance.session:
            if hasattr(enforcer_instance.session, 'auto_fixes'):
                for af in enforcer_instance.session.auto_fixes:
                    report_auto_fix = AutoFix(
                        file=af.get('file_path', ''),
                        applied=af.get('applied', False),
                        description=af.get('fix_description', ''),
                        before=af.get('before_state', ''),
                        after=af.get('after_state', '')
                    )
                    report.add_auto_fix(report_auto_fix)
        
        # Generate next actions
        self._generate_next_actions(report)
        
        # Note: Context hints are added by enforcer's _add_context_hints_to_report() method
        # This keeps the integration layer focused on report structure only
        
        return report
    
    def _generate_violation_id(self, violation) -> str:
        """Generate unique violation ID from enforcer violation."""
        # Try to extract ID from violation
        if hasattr(violation, 'id'):
            return violation.id
        
        # Generate ID from rule reference and file
        rule_ref = self._get_rule_ref(violation)
        file_path = self._get_file_path(violation)
        
        # Extract rule code (e.g., "R01" from "03-security.mdc#R01")
        rule_code = "UNKNOWN"
        if '#' in rule_ref:
            rule_code = rule_ref.split('#')[-1]
        
        # Extract file prefix (e.g., "RLS" from security rules)
        prefix_map = {
            'security': 'RLS',
            'core': 'DATE',
            'error': 'ERR',
            'observability': 'LOG',
            'architecture': 'ARCH',
            'data': 'DATA',
            'backend': 'BACKEND',
            'frontend': 'FRONTEND',
            'quality': 'QUAL',
            'operations': 'OPS',
            'tech-debt': 'DEBT',
            'ux': 'UX',
            'verification': 'VERIFY'
        }
        
        prefix = 'VF'
        for key, val in prefix_map.items():
            if key in rule_ref.lower():
                prefix = f"VF-{val}"
                break
        
        # Generate sequential number (simplified - in production would track counts)
        number = "001"
        
        return f"{prefix}-{number}"
    
    def _map_severity(self, violation) -> str:
        """Map enforcer severity to report severity."""
        if hasattr(violation, 'severity'):
            sev = violation.severity
            if isinstance(sev, str):
                if sev.upper() in ['BLOCKED', 'BLOCKING']:
                    return "BLOCKING"
                elif sev.upper() in ['WARNING', 'WARN']:
                    return "WARNING"
            elif hasattr(sev, 'value'):
                if sev.value == 'BLOCKED':
                    return "BLOCKING"
                elif sev.value == 'WARNING':
                    return "WARNING"
        
        # Default to WARNING if unclear
        return "WARNING"
    
    def _get_file_path(self, violation) -> str:
        """Extract file path from violation."""
        if hasattr(violation, 'file_path') and violation.file_path:
            # Make relative to project root
            try:
                return str(Path(violation.file_path).relative_to(project_root))
            except ValueError:
                return violation.file_path
        
        return "unknown"
    
    def _get_rule_ref(self, violation) -> str:
        """Extract rule reference from violation."""
        if hasattr(violation, 'rule_ref') and violation.rule_ref:
            return violation.rule_ref
        
        # Try to infer from message
        if hasattr(violation, 'message'):
            msg = violation.message
            # Look for rule references in message
            if '02-core.mdc' in msg or 'date' in msg.lower():
                return "02-core.mdc#DATE-HARD-STOP"
            elif '03-security.mdc' in msg or 'rls' in msg.lower() or 'tenant' in msg.lower():
                return "03-security.mdc#R02"
            elif '07-observability.mdc' in msg or 'logging' in msg.lower():
                return "07-observability.mdc#R08"
        
        return "unknown.mdc#UNKNOWN"
    
    def _get_description(self, violation) -> str:
        """Extract description from violation."""
        if hasattr(violation, 'message') and violation.message:
            return violation.message
        
        if hasattr(violation, 'description') and violation.description:
            return violation.description
        
        return "Violation detected"
    
    def _get_evidence(self, violation) -> List[str]:
        """Extract evidence from violation."""
        evidence = []
        
        if hasattr(violation, 'file_path') and hasattr(violation, 'line_number'):
            if violation.file_path and violation.line_number:
                evidence.append(f"Line {violation.line_number}: {violation.file_path}")
        
        if hasattr(violation, 'message'):
            evidence.append(violation.message)
        
        return evidence if evidence else ["See violation details"]
    
    def _get_fix_hint(self, violation) -> str:
        """Extract fix hint from violation, or generate generic hint if missing."""
        # First, try to get fix_hint directly from violation (from checker)
        if hasattr(violation, 'fix_hint') and violation.fix_hint:
            return violation.fix_hint
        
        # Fallback: Generate hints based on rule type
        rule_ref = self._get_rule_ref(violation)
        description = self._get_description(violation)
        
        if 'R02' in rule_ref or 'RLS' in rule_ref or 'tenant' in description.lower():
            return "Add tenant_id filter to query: where: { tenant_id: currentUser.tenant_id, ... }"
        
        if 'DATE' in rule_ref or 'date' in description.lower():
            return "Replace hardcoded date with injected system date or configuration value"
        
        if 'R08' in rule_ref or 'logging' in description.lower():
            return "Add structured logging: this.logger.warn({ event: 'EVENT_NAME', ... })"
        
        if 'error' in description.lower() or 'catch' in description.lower():
            return "Add proper error handling with logging and error propagation"
        
        return f"Fix violation: {description}"
    
    def _get_session_scope(self, violation) -> str:
        """Extract session scope from violation."""
        if hasattr(violation, 'session_scope') and violation.session_scope:
            return violation.session_scope
        return "current_session"  # Default to current_session
    
    def _generate_next_actions(self, report: EnforcerReport):
        """Generate next actions for LLM."""
        blocking = [v for v in report.violations if v.severity == "BLOCKING"]
        warnings = [v for v in report.violations if v.severity == "WARNING"]
        
        if blocking:
            for v in blocking:
                report.add_next_action(f"Fix {v.id} (BLOCKING): {v.description}")
        
        if warnings:
            report.add_next_action(f"Consider fixing {len(warnings)} WARNING violation(s) if simple")
        
        if not blocking and not warnings:
            report.add_next_action("No violations - system is clean")


def integrate_with_enforcer(enforcer_instance) -> EnforcerReport:
    """
    Convenience function to generate report from enforcer.
    
    Args:
        enforcer_instance: Instance of VeroFieldEnforcer
    
    Returns:
        EnforcerReport ready to save
    """
    integration = TwoBrainIntegration(enforcer_instance)
    return integration.generate_report_from_enforcer(enforcer_instance)


if __name__ == "__main__":
    # Example usage
    print("Two-Brain Integration Module")
    print("This module integrates existing enforcer with Two-Brain components")
    print("\nUsage:")
    print("  from two_brain_integration import integrate_with_enforcer")
    print("  report = integrate_with_enforcer(enforcer_instance)")
    print("  report.save()")


