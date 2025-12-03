#!/usr/bin/env python3
"""
Step 5 Verification Validation Script

Audits all .mdc rule files for complete Step 5 verification sections.
Measures completeness percentage and generates compliance report.

Usage:
    python .cursor/scripts/validate-step5-checks.py

Features:
- Audits all .mdc files for Step 5 sections
- Measures completeness percentage
- Generates compliance report
- Identifies missing checks

Created: 2025-11-23
Version: 1.0.0
"""

import sys
import re
from pathlib import Path
from typing import Dict, List, Tuple
from dataclasses import dataclass, asdict
import json

@dataclass
class Step5Analysis:
    """Analysis result for a rule file's Step 5 section"""
    file: str
    rule_name: str
    has_step5: bool
    mandatory_checks: List[str]
    should_checks: List[str]
    consequences: List[str]
    completeness_score: float
    issues: List[str]
    
    def to_dict(self):
        return asdict(self)


class Step5Validator:
    """Validates Step 5 verification sections in .mdc rule files"""
    
    def __init__(self, rules_dir: str = '.cursor/rules'):
        self.rules_dir = Path(rules_dir)
        self.results = []
    
    def validate_all_rules(self) -> List[Step5Analysis]:
        """Validate all .mdc files in rules directory"""
        if not self.rules_dir.exists():
            print(f"❌ Rules directory not found: {self.rules_dir}")
            return []
        
        mdc_files = list(self.rules_dir.glob('*.mdc'))
        
        if not mdc_files:
            print(f"⚠️  No .mdc files found in {self.rules_dir}")
            return []
        
        print(f"\n🔍 Validating Step 5 sections in {len(mdc_files)} rule file(s)...\n")
        
        for mdc_file in sorted(mdc_files):
            analysis = self.analyze_file(str(mdc_file))
            self.results.append(analysis)
        
        return self.results
    
    def analyze_file(self, file_path: str) -> Step5Analysis:
        """Analyze a single .mdc file for Step 5 completeness"""
        file_name = Path(file_path).name
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract rule name from filename
            rule_name = file_name.replace('.mdc', '').replace('-', ' ').title()
            
            # Check for Step 5 section
            has_step5, step5_content = self._extract_step5_section(content)
            
            if not has_step5:
                return Step5Analysis(
                    file=file_name,
                    rule_name=rule_name,
                    has_step5=False,
                    mandatory_checks=[],
                    should_checks=[],
                    consequences=[],
                    completeness_score=0.0,
                    issues=["Missing Step 5 verification section"]
                )
            
            # Parse Step 5 content
            mandatory_checks = self._extract_checks(step5_content, 'MUST|MANDATORY')
            should_checks = self._extract_checks(step5_content, 'SHOULD|RECOMMENDED')
            consequences = self._extract_consequences(step5_content)
            
            # Calculate completeness score
            score, issues = self._calculate_completeness(
                mandatory_checks, should_checks, consequences
            )
            
            return Step5Analysis(
                file=file_name,
                rule_name=rule_name,
                has_step5=True,
                mandatory_checks=mandatory_checks,
                should_checks=should_checks,
                consequences=consequences,
                completeness_score=score,
                issues=issues
            )
        
        except Exception as e:
            return Step5Analysis(
                file=file_name,
                rule_name=rule_name,
                has_step5=False,
                mandatory_checks=[],
                should_checks=[],
                consequences=[],
                completeness_score=0.0,
                issues=[f"Analysis error: {str(e)}"]
            )
    
    def _extract_step5_section(self, content: str) -> Tuple[bool, str]:
        """Extract Step 5 verification section from content"""
        # Look for Step 5 section with various formats
        patterns = [
            r'##\s*Step\s*5[:\s]+.*?Verification.*?\n(.*?)(?=\n##|\Z)',
            r'##\s*5\.\s*Step\s*5.*?\n(.*?)(?=\n##|\Z)',
            r'##\s*STEP\s*5.*?\n(.*?)(?=\n##|\Z)',
            r'###\s*Step\s*5.*?\n(.*?)(?=\n###|\Z)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
            if match:
                return True, match.group(1)
        
        return False, ""
    
    def _extract_checks(self, content: str, check_type: str) -> List[str]:
        """Extract checks of a specific type (MUST/SHOULD)"""
        checks = []
        
        # Pattern for checkbox items with MUST/SHOULD
        pattern = rf'-\s*\[\s*\]\s*\*\*({check_type})\*\*[:\s]+(.*?)(?=\n-|\n\n|\Z)'
        matches = re.findall(pattern, content, re.IGNORECASE | re.DOTALL)
        
        for match in matches:
            check_text = match[1].strip()
            # Clean up the text
            check_text = re.sub(r'\s+', ' ', check_text)
            if check_text:
                checks.append(check_text)
        
        return checks
    
    def _extract_consequences(self, content: str) -> List[str]:
        """Extract consequences section"""
        consequences = []
        
        # Look for Consequences section
        cons_match = re.search(
            r'\*\*Consequences:\*\*\s*\n(.*?)(?=\n##|\n\*\*|\Z)',
            content,
            re.DOTALL | re.IGNORECASE
        )
        
        if cons_match:
            cons_content = cons_match.group(1)
            # Extract bullet points
            cons_items = re.findall(r'-\s*(.+?)(?=\n-|\Z)', cons_content, re.DOTALL)
            for item in cons_items:
                clean_item = re.sub(r'\s+', ' ', item.strip())
                if clean_item:
                    consequences.append(clean_item)
        
        return consequences
    
    def _calculate_completeness(
        self, 
        mandatory_checks: List[str],
        should_checks: List[str],
        consequences: List[str]
    ) -> Tuple[float, List[str]]:
        """Calculate completeness score and identify issues"""
        issues = []
        score_components = []
        
        # Check for mandatory checks (40% of score)
        if not mandatory_checks:
            issues.append("No MANDATORY checks defined")
            score_components.append(0.0)
        elif len(mandatory_checks) < 3:
            issues.append(f"Only {len(mandatory_checks)} MANDATORY checks (recommend 3+)")
            score_components.append(0.2)
        else:
            score_components.append(0.4)
        
        # Check for should checks (20% of score)
        if not should_checks:
            issues.append("No SHOULD/RECOMMENDED checks defined")
            score_components.append(0.0)
        else:
            score_components.append(0.2)
        
        # Check for consequences (40% of score)
        if not consequences:
            issues.append("No consequences defined")
            score_components.append(0.0)
        elif len(consequences) < 2:
            issues.append("Only 1 consequence defined (recommend 2+)")
            score_components.append(0.2)
        else:
            # Check for HARD STOP consequence
            has_hard_stop = any('HARD STOP' in c or 'BLOCK' in c for c in consequences)
            if not has_hard_stop:
                issues.append("Missing HARD STOP consequence")
                score_components.append(0.3)
            else:
                score_components.append(0.4)
        
        total_score = sum(score_components)
        
        # Additional quality checks
        if mandatory_checks:
            # Check for specific, actionable checks
            vague_checks = [c for c in mandatory_checks if len(c.split()) < 5]
            if vague_checks:
                issues.append(f"{len(vague_checks)} checks may be too vague")
        
        return total_score, issues
    
    def generate_report(self) -> str:
        """Generate comprehensive compliance report"""
        if not self.results:
            return "No results to report"
        
        # Calculate overall statistics
        total_files = len(self.results)
        files_with_step5 = sum(1 for r in self.results if r.has_step5)
        complete_files = sum(1 for r in self.results if r.completeness_score >= 0.8)
        avg_score = sum(r.completeness_score for r in self.results) / total_files
        
        # Build report
        report = []
        report.append("\n" + "="*70)
        report.append("STEP 5 VERIFICATION COMPLIANCE REPORT")
        report.append("="*70 + "\n")
        
        report.append("📊 OVERALL STATISTICS:")
        report.append(f"  Total rule files: {total_files}")
        report.append(f"  Files with Step 5: {files_with_step5} ({files_with_step5/total_files*100:.1f}%)")
        report.append(f"  Complete files (≥80%): {complete_files} ({complete_files/total_files*100:.1f}%)")
        report.append(f"  Average completeness: {avg_score*100:.1f}%")
        report.append("")
        
        # Status indicator
        if avg_score >= 0.8:
            status = "✅ EXCELLENT"
        elif avg_score >= 0.6:
            status = "🟡 GOOD"
        elif avg_score >= 0.4:
            status = "🟠 NEEDS IMPROVEMENT"
        else:
            status = "🔴 CRITICAL"
        
        report.append(f"**Status:** {status}\n")
        
        # Detailed results
        report.append("="*70)
        report.append("DETAILED RESULTS")
        report.append("="*70 + "\n")
        
        # Sort by completeness score (lowest first)
        sorted_results = sorted(self.results, key=lambda r: r.completeness_score)
        
        for result in sorted_results:
            score_pct = result.completeness_score * 100
            
            if score_pct >= 80:
                icon = "✅"
            elif score_pct >= 60:
                icon = "🟡"
            elif score_pct >= 40:
                icon = "🟠"
            else:
                icon = "🔴"
            
            report.append(f"{icon} {result.file} - {result.rule_name}")
            report.append(f"   Score: {score_pct:.1f}%")
            
            if result.has_step5:
                report.append(f"   Checks: {len(result.mandatory_checks)} MANDATORY, {len(result.should_checks)} SHOULD")
                report.append(f"   Consequences: {len(result.consequences)}")
            
            if result.issues:
                report.append("   Issues:")
                for issue in result.issues:
                    report.append(f"     - {issue}")
            
            report.append("")
        
        # Recommendations
        report.append("="*70)
        report.append("RECOMMENDATIONS")
        report.append("="*70 + "\n")
        
        if avg_score < 1.0:
            report.append("Priority Actions:")
            
            # Files missing Step 5
            missing_step5 = [r for r in self.results if not r.has_step5]
            if missing_step5:
                report.append(f"\n1. Add Step 5 sections to {len(missing_step5)} file(s):")
                for r in missing_step5[:5]:  # Show first 5
                    report.append(f"   - {r.file}")
                if len(missing_step5) > 5:
                    report.append(f"   ... and {len(missing_step5)-5} more")
            
            # Files with low scores
            low_score = [r for r in self.results if r.has_step5 and r.completeness_score < 0.6]
            if low_score:
                report.append(f"\n2. Improve Step 5 sections in {len(low_score)} file(s):")
                for r in low_score[:5]:
                    report.append(f"   - {r.file} ({r.completeness_score*100:.1f}%)")
                    if r.issues:
                        report.append(f"     Issues: {', '.join(r.issues[:2])}")
                if len(low_score) > 5:
                    report.append(f"   ... and {len(low_score)-5} more")
        else:
            report.append("✅ All Step 5 sections are complete!")
        
        report.append("\n" + "="*70 + "\n")
        
        return "\n".join(report)
    
    def export_json(self, output_file: str):
        """Export results as JSON"""
        data = {
            'total_files': len(self.results),
            'files_with_step5': sum(1 for r in self.results if r.has_step5),
            'average_completeness': sum(r.completeness_score for r in self.results) / len(self.results) if self.results else 0,
            'results': [r.to_dict() for r in self.results]
        }
        
        with open(output_file, 'w') as f:
            json.dump(data, f, indent=2)
        
        print(f"📄 Results exported to {output_file}")


def main():
    """Main entry point"""
    try:
        validator = Step5Validator()
        
        # Validate all rules
        results = validator.validate_all_rules()
        
        if not results:
            print("❌ No rule files found to validate")
            sys.exit(1)
        
        # Generate and print report
        report = validator.generate_report()
        print(report)
        
        # Export JSON
        output_file = Path('.cursor/scripts/step5-validation-results.json')
        validator.export_json(str(output_file))
        
        # Exit with appropriate code
        avg_score = sum(r.completeness_score for r in results) / len(results)
        if avg_score >= 0.8:
            sys.exit(0)  # Success
        elif avg_score >= 0.6:
            sys.exit(0)  # Acceptable
        else:
            sys.exit(1)  # Needs improvement
    
    except Exception as e:
        print(f"❌ Validation failed: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()





