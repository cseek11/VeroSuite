#!/usr/bin/env python3
"""
State Machine Enforcement Checker (R05)

This script enforces state machine documentation, transition validation,
and audit logging for stateful entities in the VeroField codebase.

Detection Strategy (Multi-layered):
1. Schema analysis: Detect enum Status/State fields and status/state string fields
2. Documentation-driven: Scan docs/state-machines/ directory
3. Cross-reference: Verify entities with status fields have documentation

Validation:
- State machine documentation exists and is complete
- Transition validation functions exist in service layer
- Illegal transitions are rejected with explicit errors
- Audit logs are emitted on state transitions
- Code implementation matches documentation

Usage:
    python .cursor/scripts/check-state-machines.py --entity WorkOrder
    python .cursor/scripts/check-state-machines.py --all
    python .cursor/scripts/check-state-machines.py --file apps/api/src/work-orders/work-orders.service.ts

Created: 2025-11-23
Version: 1.0.0
"""

import argparse
import re
import sys
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from dataclasses import dataclass
import json

# ANSI color codes for output
class Colors:
    RED = '\033[91m'
    YELLOW = '\033[93m'
    GREEN = '\033[92m'
    BLUE = '\033[94m'
    BOLD = '\033[1m'
    END = '\033[0m'

@dataclass
class StateTransition:
    """Represents a state transition"""
    from_state: str
    to_state: str
    condition: Optional[str] = None
    side_effects: Optional[str] = None

@dataclass
class StateMachine:
    """Represents a state machine definition"""
    entity_name: str
    states: List[str]
    legal_transitions: List[StateTransition]
    illegal_transitions: List[Tuple[str, str]]
    terminal_states: List[str]
    
@dataclass
class Violation:
    """Represents a rule violation"""
    severity: str  # 'error', 'warning'
    category: str
    message: str
    file_path: Optional[str] = None
    line_number: Optional[int] = None
    suggestion: Optional[str] = None

class StateMachineChecker:
    """Main checker class"""
    
    def __init__(self, repo_root: Path):
        self.repo_root = repo_root
        self.violations: List[Violation] = []
        self.stateful_entities: Set[str] = set()
        self.state_machines: Dict[str, StateMachine] = {}
        
    def detect_stateful_entities(self) -> Set[str]:
        """
        Detect stateful entities using multi-layered approach:
        1. Schema analysis (enum Status fields, status/state string fields)
        2. Documentation directory (docs/state-machines/)
        3. Cross-reference validation
        """
        stateful = set()
        
        # Method 1: Schema analysis
        schema_file = self.repo_root / "libs/common/prisma/schema.prisma"
        if schema_file.exists():
            stateful.update(self._detect_from_schema(schema_file))
        
        # Method 2: Documentation directory
        docs_dir = self.repo_root / "docs/state-machines"
        if docs_dir.exists():
            stateful.update(self._detect_from_docs(docs_dir))
        
        self.stateful_entities = stateful
        return stateful
    
    def _detect_from_schema(self, schema_file: Path) -> Set[str]:
        """Detect stateful entities from Prisma schema"""
        stateful = set()
        content = schema_file.read_text()
        
        # Pattern 1: Enum Status/State fields
        enum_pattern = r'enum\s+([A-Z][a-zA-Z]+)(Status|State)\s*\{'
        for match in re.finditer(enum_pattern, content):
            entity_name = match.group(1)
            stateful.add(entity_name)
        
        # Pattern 2: Models with status/state fields
        model_pattern = r'model\s+([A-Z][a-zA-Z]+)\s*\{([^}]+)\}'
        for match in re.finditer(model_pattern, content, re.DOTALL):
            model_name = match.group(1)
            model_body = match.group(2)
            
            # Check for status/state fields
            if re.search(r'\bstatus\s+', model_body) or re.search(r'\bstate\s+', model_body):
                # Check if it's a workflow state (not just a simple flag)
                # Heuristic: If field type is enum or has multiple possible values
                if 'Status' in model_body or 'State' in model_body:
                    stateful.add(model_name)
        
        return stateful
    
    def _detect_from_docs(self, docs_dir: Path) -> Set[str]:
        """Detect stateful entities from documentation directory"""
        stateful = set()
        
        for doc_file in docs_dir.glob("*-state-machine.md"):
            # Extract entity name from filename
            # Format: workorder-state-machine.md → WorkOrder
            entity_name = doc_file.stem.replace("-state-machine", "")
            # Convert kebab-case to PascalCase
            entity_name = ''.join(word.capitalize() for word in entity_name.split('-'))
            stateful.add(entity_name)
        
        return stateful
    
    def check_entity(self, entity_name: str) -> List[Violation]:
        """Check a single entity for state machine compliance"""
        violations = []
        
        # Check 1: Documentation exists
        doc_violations = self._check_documentation_exists(entity_name)
        violations.extend(doc_violations)
        
        if not doc_violations:  # Only proceed if documentation exists
            # Check 2: Parse and validate documentation
            state_machine = self._parse_state_machine_doc(entity_name)
            if state_machine:
                self.state_machines[entity_name] = state_machine
                
                # Check 3: Transition validation exists in service
                violations.extend(self._check_transition_validation(entity_name, state_machine))
                
                # Check 4: Illegal transitions are rejected
                violations.extend(self._check_illegal_transition_rejection(entity_name, state_machine))
                
                # Check 5: Audit logging exists
                violations.extend(self._check_audit_logging(entity_name))
                
                # Check 6: Code-documentation synchronization
                violations.extend(self._check_code_doc_sync(entity_name, state_machine))
        
        return violations
    
    def _check_documentation_exists(self, entity_name: str) -> List[Violation]:
        """Check if state machine documentation exists"""
        violations = []
        
        # Convert PascalCase to kebab-case
        kebab_name = re.sub(r'([A-Z])', r'-\1', entity_name).lower().lstrip('-')
        doc_path = self.repo_root / f"docs/state-machines/{kebab_name}-state-machine.md"
        
        if not doc_path.exists():
            violations.append(Violation(
                severity='error',
                category='Missing Documentation',
                message=f"Stateful entity '{entity_name}' lacks state machine documentation",
                file_path=str(doc_path),
                suggestion=f"Create 'docs/state-machines/{kebab_name}-state-machine.md' with:\n"
                          f"  - Valid states\n"
                          f"  - Legal transitions (from → to with conditions)\n"
                          f"  - Illegal transitions (explicitly listed)\n"
                          f"  - Side effects (events, notifications, audit logs)\n"
                          f"  See docs/state-machines/README.md for template."
            ))
        
        return violations
    
    def _parse_state_machine_doc(self, entity_name: str) -> Optional[StateMachine]:
        """Parse state machine documentation"""
        kebab_name = re.sub(r'([A-Z])', r'-\1', entity_name).lower().lstrip('-')
        doc_path = self.repo_root / f"docs/state-machines/{kebab_name}-state-machine.md"
        
        if not doc_path.exists():
            return None
        
        content = doc_path.read_text()
        
        # Parse states
        states = self._parse_states(content)
        
        # Parse legal transitions
        legal_transitions = self._parse_transitions(content)
        
        # Parse illegal transitions
        illegal_transitions = self._parse_illegal_transitions(content)
        
        # Identify terminal states
        terminal_states = [state for state in states if state in [t[0] for t in illegal_transitions]]
        
        return StateMachine(
            entity_name=entity_name,
            states=states,
            legal_transitions=legal_transitions,
            illegal_transitions=illegal_transitions,
            terminal_states=terminal_states
        )
    
    def _parse_states(self, content: str) -> List[str]:
        """Parse valid states from documentation"""
        states = []
        
        # Look for states in table format
        # | State | Value | Description | Terminal | User-Visible Label |
        table_pattern = r'\|\s*([A-Z_]+)\s*\|.*?\|'
        for match in re.finditer(table_pattern, content):
            state = match.group(1).strip()
            if state not in ['State', 'STATE']:  # Skip header row
                states.append(state)
        
        # Also look for bullet list format
        # - PENDING: Initial state
        bullet_pattern = r'-\s+([A-Z_]+):\s+'
        for match in re.finditer(bullet_pattern, content):
            state = match.group(1).strip()
            if state not in states:
                states.append(state)
        
        return states
    
    def _parse_transitions(self, content: str) -> List[StateTransition]:
        """Parse legal transitions from documentation"""
        transitions = []
        
        # Look for transitions in table format
        # | From State | To State | Condition | Side Effects |
        table_pattern = r'\|\s*([A-Z_]+)\s*\|\s*([A-Z_]+)\s*\|([^|]*)\|([^|]*)\|'
        for match in re.finditer(table_pattern, content):
            from_state = match.group(1).strip()
            to_state = match.group(2).strip()
            condition = match.group(3).strip() if match.group(3) else None
            side_effects = match.group(4).strip() if match.group(4) else None
            
            if from_state not in ['From', 'FROM']:  # Skip header row
                transitions.append(StateTransition(
                    from_state=from_state,
                    to_state=to_state,
                    condition=condition,
                    side_effects=side_effects
                ))
        
        return transitions
    
    def _parse_illegal_transitions(self, content: str) -> List[Tuple[str, str]]:
        """Parse illegal transitions from documentation"""
        illegal = []
        
        # Look for illegal transitions section
        # - COMPLETED → any state: Terminal state
        pattern = r'-\s*([A-Z_]+)\s*→\s*([A-Z_]+|any state)'
        for match in re.finditer(pattern, content):
            from_state = match.group(1).strip()
            to_state = match.group(2).strip()
            illegal.append((from_state, to_state))
        
        return illegal
    
    def _check_transition_validation(self, entity_name: str, state_machine: StateMachine) -> List[Violation]:
        """Check if transition validation function exists in service layer"""
        violations = []
        
        # Find service file
        service_files = self._find_service_files(entity_name)
        
        if not service_files:
            violations.append(Violation(
                severity='warning',
                category='Missing Service',
                message=f"No service file found for entity '{entity_name}'",
                suggestion=f"Expected file: apps/api/src/{entity_name.lower()}s/{entity_name.lower()}s.service.ts"
            ))
            return violations
        
        for service_file in service_files:
            content = service_file.read_text()
            
            # Phase 1: Pattern matching (fast check)
            validation_patterns = [
                r'isValidTransition\s*\(',
                r'canTransitionTo\s*\(',
                r'validateStateTransition\s*\(',
                r'class\s+\w*StateGuard',
                r'validateTransition\s*\(',
            ]
            
            has_validation = any(re.search(pattern, content) for pattern in validation_patterns)
            
            if not has_validation:
                violations.append(Violation(
                    severity='error',
                    category='Missing Transition Validation',
                    message=f"Service file '{service_file.name}' lacks transition validation function",
                    file_path=str(service_file),
                    suggestion="Add validation function:\n"
                              "  private isValidTransition(from: Status, to: Status): boolean {\n"
                              "    const legalTransitions = { /* ... */ };\n"
                              "    return legalTransitions[from]?.includes(to) ?? false;\n"
                              "  }"
                ))
            else:
                # Phase 2: Verify validation logic (AST-like verification)
                # Check if validation function actually checks transitions
                if not self._verify_validation_logic(content, state_machine):
                    violations.append(Violation(
                        severity='warning',
                        category='Incomplete Validation',
                        message=f"Validation function exists but may not check all transitions",
                        file_path=str(service_file),
                        suggestion="Verify validation function checks all legal transitions from documentation"
                    ))
        
        return violations
    
    def _verify_validation_logic(self, content: str, state_machine: StateMachine) -> bool:
        """Verify validation function actually validates transitions"""
        # Look for legal transitions definition in code
        # This is a heuristic check - not full AST parsing
        
        # Check if code defines legal transitions
        has_transition_map = re.search(r'legalTransitions|allowedTransitions|validTransitions', content)
        if not has_transition_map:
            return False
        
        # Check if code references states from documentation
        states_in_code = sum(1 for state in state_machine.states if state in content)
        if states_in_code < len(state_machine.states) * 0.5:  # At least 50% of states mentioned
            return False
        
        return True
    
    def _check_illegal_transition_rejection(self, entity_name: str, state_machine: StateMachine) -> List[Violation]:
        """Check if illegal transitions are explicitly rejected"""
        violations = []
        
        service_files = self._find_service_files(entity_name)
        
        for service_file in service_files:
            content = service_file.read_text()
            
            # Check for explicit rejection logic
            rejection_patterns = [
                r'throw\s+new\s+InvalidTransitionError',
                r'throw\s+new\s+BadRequestException',
                r'throw\s+new\s+Error.*transition',
                r'return\s+false.*transition',
            ]
            
            has_rejection = any(re.search(pattern, content, re.IGNORECASE) for pattern in rejection_patterns)
            
            if not has_rejection:
                violations.append(Violation(
                    severity='error',
                    category='Missing Illegal Transition Rejection',
                    message=f"Service file '{service_file.name}' lacks explicit rejection of illegal transitions",
                    file_path=str(service_file),
                    suggestion="Add error handling:\n"
                              "  if (!this.isValidTransition(from, to)) {\n"
                              "    throw new BadRequestException(\n"
                              "      `Cannot transition from ${from} to ${to}`\n"
                              "    );\n"
                              "  }"
                ))
        
        return violations
    
    def _check_audit_logging(self, entity_name: str) -> List[Violation]:
        """Check if audit logs are emitted on state transitions"""
        violations = []
        
        service_files = self._find_service_files(entity_name)
        
        for service_file in service_files:
            content = service_file.read_text()
            
            # Check if file modifies state/status
            modifies_state = re.search(r'\.status\s*=|\.state\s*=|update\(\s*\{.*status', content, re.DOTALL)
            
            if modifies_state:
                # Check for audit log calls
                audit_patterns = [
                    r'auditLog\.log',
                    r'auditService\.log',
                    r'logStateTransition',
                    r'this\.audit',
                ]
                
                has_audit_log = any(re.search(pattern, content) for pattern in audit_patterns)
                
                if not has_audit_log:
                    violations.append(Violation(
                        severity='error',
                        category='Missing Audit Logging',
                        message=f"Service file '{service_file.name}' modifies state but lacks audit logging",
                        file_path=str(service_file),
                        suggestion="Add audit logging:\n"
                                  "  await this.auditService.log({\n"
                                  "    entity: '" + entity_name + "',\n"
                                  "    entityId: id,\n"
                                  "    action: 'state_transition',\n"
                                  "    oldState: oldStatus,\n"
                                  "    newState: newStatus,\n"
                                  "    userId: userId,\n"
                                  "    timestamp: new Date()\n"
                                  "  });"
                    ))
        
        return violations
    
    def _check_code_doc_sync(self, entity_name: str, state_machine: StateMachine) -> List[Violation]:
        """Check if code implementation matches documentation (strict synchronization)"""
        violations = []
        
        # Check 1: Verify enum/type values match documentation
        schema_file = self.repo_root / "libs/common/prisma/schema.prisma"
        if schema_file.exists():
            content = schema_file.read_text()
            
            # Find enum definition for this entity
            enum_pattern = rf'enum\s+{entity_name}(Status|State)\s*\{{([^}}]+)\}}'
            match = re.search(enum_pattern, content, re.DOTALL)
            
            if match:
                enum_body = match.group(2)
                # Extract enum values
                enum_values = [v.strip() for v in re.findall(r'([A-Z_]+)', enum_body)]
                
                # Compare with documentation
                doc_states = set(state_machine.states)
                code_states = set(enum_values)
                
                missing_in_code = doc_states - code_states
                missing_in_docs = code_states - doc_states
                
                if missing_in_code:
                    violations.append(Violation(
                        severity='error',
                        category='Code-Documentation Mismatch',
                        message=f"States in documentation but not in code: {', '.join(missing_in_code)}",
                        file_path=str(schema_file),
                        suggestion=f"Add missing states to enum {entity_name}Status in schema.prisma"
                    ))
                
                if missing_in_docs:
                    violations.append(Violation(
                        severity='error',
                        category='Code-Documentation Mismatch',
                        message=f"States in code but not in documentation: {', '.join(missing_in_docs)}",
                        file_path=f"docs/state-machines/{entity_name.lower()}-state-machine.md",
                        suggestion=f"Add missing states to documentation or remove from code"
                    ))
        
        # Check 2: Verify transition logic matches documentation
        service_files = self._find_service_files(entity_name)
        for service_file in service_files:
            content = service_file.read_text()
            
            # Extract legal transitions from code (heuristic)
            # Look for transition map definition
            transition_map_match = re.search(
                r'(legalTransitions|allowedTransitions|validTransitions)\s*[:=]\s*\{([^}]+)\}',
                content,
                re.DOTALL
            )
            
            if transition_map_match:
                # This is a simplified check - full AST parsing would be more accurate
                # For now, just verify that documented states are mentioned
                for transition in state_machine.legal_transitions:
                    if transition.from_state not in content or transition.to_state not in content:
                        violations.append(Violation(
                            severity='warning',
                            category='Potential Code-Documentation Mismatch',
                            message=f"Legal transition {transition.from_state} → {transition.to_state} may not be implemented in code",
                            file_path=str(service_file),
                            suggestion="Verify transition logic matches documentation"
                        ))
        
        return violations
    
    def _find_service_files(self, entity_name: str) -> List[Path]:
        """Find service files for an entity"""
        service_files = []
        
        # Common patterns for service files
        patterns = [
            f"apps/api/src/{entity_name.lower()}s/{entity_name.lower()}s.service.ts",
            f"apps/api/src/{entity_name.lower()}/{entity_name.lower()}.service.ts",
            f"apps/*/src/**/{entity_name.lower()}*.service.ts",
        ]
        
        for pattern in patterns:
            for file in self.repo_root.glob(pattern):
                if file.is_file():
                    service_files.append(file)
        
        return service_files
    
    def print_violations(self):
        """Print violations with color coding"""
        if not self.violations:
            print(f"{Colors.GREEN}✓ No state machine violations found{Colors.END}")
            return
        
        # Group by severity
        errors = [v for v in self.violations if v.severity == 'error']
        warnings = [v for v in self.violations if v.severity == 'warning']
        
        if errors:
            print(f"\n{Colors.RED}{Colors.BOLD}ERRORS ({len(errors)}):{Colors.END}")
            for v in errors:
                self._print_violation(v, Colors.RED)
        
        if warnings:
            print(f"\n{Colors.YELLOW}{Colors.BOLD}WARNINGS ({len(warnings)}):{Colors.END}")
            for v in warnings:
                self._print_violation(v, Colors.YELLOW)
        
        # Summary
        print(f"\n{Colors.BOLD}Summary:{Colors.END}")
        print(f"  Errors: {len(errors)}")
        print(f"  Warnings: {len(warnings)}")
        print(f"  Total: {len(self.violations)}")
        
        if errors:
            sys.exit(1)
    
    def _print_violation(self, violation: Violation, color: str):
        """Print a single violation"""
        print(f"\n{color}[{violation.category}]{Colors.END} {violation.message}")
        if violation.file_path:
            print(f"  File: {violation.file_path}")
        if violation.line_number:
            print(f"  Line: {violation.line_number}")
        if violation.suggestion:
            print(f"  {Colors.BLUE}Suggestion:{Colors.END} {violation.suggestion}")

def main():
    parser = argparse.ArgumentParser(description="Check state machine enforcement (R05)")
    parser.add_argument('--entity', help='Check specific entity (e.g., WorkOrder)')
    parser.add_argument('--all', action='store_true', help='Check all stateful entities')
    parser.add_argument('--file', help='Check specific file')
    parser.add_argument('--json', action='store_true', help='Output JSON format')
    
    args = parser.parse_args()
    
    # Find repository root
    repo_root = Path.cwd()
    while not (repo_root / '.git').exists() and repo_root != repo_root.parent:
        repo_root = repo_root.parent
    
    if not (repo_root / '.git').exists():
        print(f"{Colors.RED}Error: Not in a git repository{Colors.END}")
        sys.exit(1)
    
    checker = StateMachineChecker(repo_root)
    
    if args.all:
        # Detect and check all stateful entities
        print(f"{Colors.BLUE}Detecting stateful entities...{Colors.END}")
        entities = checker.detect_stateful_entities()
        print(f"Found {len(entities)} stateful entities: {', '.join(sorted(entities))}\n")
        
        for entity in sorted(entities):
            print(f"{Colors.BOLD}Checking {entity}...{Colors.END}")
            violations = checker.check_entity(entity)
            checker.violations.extend(violations)
    
    elif args.entity:
        violations = checker.check_entity(args.entity)
        checker.violations.extend(violations)
    
    elif args.file:
        # Check specific file
        print(f"{Colors.YELLOW}File-specific checking not yet implemented{Colors.END}")
        sys.exit(1)
    
    else:
        parser.print_help()
        sys.exit(1)
    
    # Print results
    if args.json:
        output = {
            'violations': [
                {
                    'severity': v.severity,
                    'category': v.category,
                    'message': v.message,
                    'file_path': v.file_path,
                    'line_number': v.line_number,
                    'suggestion': v.suggestion
                }
                for v in checker.violations
            ],
            'summary': {
                'errors': len([v for v in checker.violations if v.severity == 'error']),
                'warnings': len([v for v in checker.violations if v.severity == 'warning']),
                'total': len(checker.violations)
            }
        }
        print(json.dumps(output, indent=2))
    else:
        checker.print_violations()

if __name__ == '__main__':
    main()



