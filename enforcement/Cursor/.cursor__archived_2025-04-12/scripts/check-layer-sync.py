#!/usr/bin/env python3
"""
Layer Synchronization Checker - R04

Automated checks for layer synchronization violations across database schema,
DTOs, and frontend types. Verifies:
- Schema changes have corresponding DTO updates
- DTO changes have corresponding frontend type updates
- Field names, types, and optionality match across layers
- Enum values match across layers
- Validators match schema constraints

Usage:
    python check-layer-sync.py --entity User
    python check-layer-sync.py --all
    git diff --name-only main | grep -E "(schema.prisma|\.dto\.ts|types/)" | xargs python check-layer-sync.py

Created: 2025-12-04
Version: 1.0.0
"""

import os
import re
import sys
import argparse
from pathlib import Path
from typing import List, Dict, Set, Optional, Tuple

class LayerSyncChecker:
    def __init__(self, entity_name: Optional[str] = None):
        self.entity_name = entity_name
        self.violations = []
        self.warnings = []
        self.entities_checked = 0
        
        # File paths
        self.schema_path = Path("libs/common/prisma/schema.prisma")
        self.dto_base_path = Path("apps/api/src")
        self.frontend_types_path = Path("frontend/src/types")
        
        # Patterns
        self.model_pattern = re.compile(r'model\s+([A-Z][a-zA-Z]+)\s*\{([^}]+)\}', re.DOTALL)
        self.field_pattern = re.compile(r'^\s*([a-z_]+)\s+([A-Z][a-zA-Z\[\]?]+)', re.MULTILINE)
        self.enum_pattern = re.compile(r'enum\s+([A-Z][a-zA-Z]+)\s*\{([^}]+)\}', re.DOTALL)
        
    def check_entity(self, entity_name: str) -> List[Dict]:
        """Check synchronization for a specific entity."""
        violations = []
        warnings = []
        
        print(f"\n{'='*80}")
        print(f"Checking: {entity_name} entity synchronization")
        print(f"{'='*80}\n")
        
        # Step 1: Parse schema
        schema_fields = self._parse_schema_fields(entity_name)
        if not schema_fields:
            print(f"⚠️  Warning: {entity_name} not found in schema")
            return []
        
        # Step 2: Parse DTOs
        dto_fields = self._parse_dto_fields(entity_name)
        if not dto_fields:
            print(f"⚠️  Warning: No DTO found for {entity_name}")
        
        # Step 3: Parse frontend types
        frontend_fields = self._parse_frontend_fields(entity_name)
        if not frontend_fields:
            print(f"⚠️  Warning: No frontend type found for {entity_name}")
        
        # Step 4: Compare layers
        if schema_fields and dto_fields:
            violations.extend(self._compare_layers(
                entity_name, "Schema", schema_fields, "DTO", dto_fields
            ))
        
        if dto_fields and frontend_fields:
            violations.extend(self._compare_layers(
                entity_name, "DTO", dto_fields, "Frontend Type", frontend_fields
            ))
        
        # Step 5: Check validators
        if schema_fields and dto_fields:
            warnings.extend(self._check_validators(entity_name, schema_fields, dto_fields))
        
        # Step 6: Check enums
        enum_violations = self._check_enums(entity_name)
        violations.extend(enum_violations)
        
        # Step 7: Check contract docs (for event entities)
        contract_warnings = self._check_contract_docs(entity_name)
        warnings.extend(contract_warnings)
        
        self.violations.extend(violations)
        self.warnings.extend(warnings)
        self.entities_checked += 1
        
        return violations + warnings
    
    def _parse_schema_fields(self, entity_name: str) -> Optional[Dict[str, Dict]]:
        """Parse fields from Prisma schema."""
        if not self.schema_path.exists():
            return None
        
        try:
            with open(self.schema_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except (OSError, IOError, UnicodeDecodeError) as e:
            logger.warning(f"Error reading schema file {self.schema_path}: {e}")
            return None
        
        # Find model definition
        model_match = self.model_pattern.search(content)
        if not model_match or model_match.group(1) != entity_name:
            # Try case-insensitive match
            for match in self.model_pattern.finditer(content):
                if match.group(1).lower() == entity_name.lower():
                    model_match = match
                    break
        
        if not model_match:
            return None
        
        model_body = model_match.group(2)
        fields = {}
        
        for line in model_body.split('\n'):
            line = line.strip()
            if not line or line.startswith('//') or line.startswith('@@'):
                continue
            
            # Parse field: name type modifiers
            parts = line.split()
            if len(parts) >= 2:
                field_name = parts[0]
                field_type = parts[1]
                
                # Determine optionality
                optional = '?' in field_type
                field_type = field_type.replace('?', '').replace('[]', '')
                
                # Get constraints from modifiers
                constraints = {}
                if '@db.VarChar' in line:
                    match = re.search(r'@db\.VarChar\((\d+)\)', line)
                    if match:
                        constraints['maxLength'] = int(match.group(1))
                
                fields[field_name] = {
                    'type': field_type,
                    'optional': optional,
                    'constraints': constraints
                }
        
        return fields
    
    def _parse_dto_fields(self, entity_name: str) -> Optional[Dict[str, Dict]]:
        """Parse fields from DTO."""
        # Find DTO file
        dto_files = list(self.dto_base_path.rglob(f"*{entity_name.lower()}*.dto.ts"))
        if not dto_files:
            return None
        
        dto_file = dto_files[0]
        try:
            with open(dto_file, 'r', encoding='utf-8') as f:
                content = f.read()
        except (OSError, IOError, UnicodeDecodeError) as e:
            logger.warning(f"Error reading DTO file {dto_file}: {e}")
            return None
        
        fields = {}
        
        # Parse class fields with decorators
        field_pattern = re.compile(
            r'@(?:IsOptional|IsString|IsUUID|IsNumber|IsEnum|IsDateString|MaxLength)\([^\)]*\)[^\n]*\n\s*([a-z_]+)(\?)?:\s*([A-Za-z\[\]]+)',
            re.MULTILINE
        )
        
        for match in field_pattern.finditer(content):
            field_name = match.group(1)
            optional = match.group(2) == '?'
            field_type = match.group(3)
            
            # Get validators
            validators = {}
            # Look for @MaxLength decorator before this field
            max_length_match = re.search(
                rf'@MaxLength\((\d+)\)[^\n]*\n[^\n]*{field_name}',
                content
            )
            if max_length_match:
                validators['maxLength'] = int(max_length_match.group(1))
            
            fields[field_name] = {
                'type': field_type,
                'optional': optional,
                'validators': validators
            }
        
        return fields
    
    def _parse_frontend_fields(self, entity_name: str) -> Optional[Dict[str, Dict]]:
        """Parse fields from frontend types."""
        # Find frontend type file
        type_files = list(self.frontend_types_path.rglob(f"*{entity_name.lower()}*.ts"))
        if not type_files:
            return None
        
        type_file = type_files[0]
        try:
            with open(type_file, 'r', encoding='utf-8') as f:
                content = f.read()
        except (OSError, IOError, UnicodeDecodeError) as e:
            logger.warning(f"Error reading frontend type file {type_file}: {e}")
            return None
        
        fields = {}
        
        # Parse interface/type definition
        interface_pattern = re.compile(
            rf'(?:interface|type)\s+{entity_name}\s*\{{([^}}]+)\}}',
            re.DOTALL
        )
        
        match = interface_pattern.search(content)
        if not match:
            return None
        
        interface_body = match.group(1)
        
        for line in interface_body.split('\n'):
            line = line.strip()
            if not line or line.startswith('//'):
                continue
            
            # Parse field: name?: type;
            field_match = re.match(r'([a-z_]+)(\?)?:\s*([A-Za-z\[\]]+)', line)
            if field_match:
                field_name = field_match.group(1)
                optional = field_match.group(2) == '?'
                field_type = field_match.group(3)
                
                fields[field_name] = {
                    'type': field_type,
                    'optional': optional
                }
        
        return fields
    
    def _compare_layers(
        self, entity_name: str, layer1_name: str, layer1_fields: Dict,
        layer2_name: str, layer2_fields: Dict
    ) -> List[Dict]:
        """Compare fields between two layers."""
        violations = []
        
        # Check for missing fields in layer2
        for field_name, field_info in layer1_fields.items():
            # Skip internal fields
            if field_name in ['id', 'created_at', 'updated_at', 'tenant_id']:
                continue
            
            if field_name not in layer2_fields:
                violations.append({
                    'entity': entity_name,
                    'type': 'missing_field',
                    'severity': 'CRITICAL',
                    'message': f'{layer1_name} has "{field_name}" field but {layer2_name} is missing it',
                    'suggestion': f'Add "{field_name}" field to {layer2_name}'
                })
            else:
                # Check type mismatch
                layer2_field = layer2_fields[field_name]
                if not self._types_match(field_info['type'], layer2_field['type']):
                    violations.append({
                        'entity': entity_name,
                        'type': 'type_mismatch',
                        'severity': 'CRITICAL',
                        'message': f'Field "{field_name}" type mismatch: {layer1_name}={field_info["type"]}, {layer2_name}={layer2_field["type"]}',
                        'suggestion': f'Update {layer2_name} to match {layer1_name} type'
                    })
                
                # Check optionality mismatch
                if field_info['optional'] != layer2_field['optional']:
                    violations.append({
                        'entity': entity_name,
                        'type': 'optionality_mismatch',
                        'severity': 'WARNING',
                        'message': f'Field "{field_name}" optionality mismatch: {layer1_name}={field_info["optional"]}, {layer2_name}={layer2_field["optional"]}',
                        'suggestion': f'Verify optionality is correct in both layers'
                    })
        
        return violations
    
    def _types_match(self, type1: str, type2: str) -> bool:
        """Check if two types match (accounting for type mappings)."""
        # Type mappings between layers
        type_mappings = {
            'String': ['string', 'String'],
            'Int': ['number', 'Int'],
            'Float': ['number', 'Float'],
            'Boolean': ['boolean', 'Boolean'],
            'DateTime': ['string', 'Date', 'DateTime'],
            'Json': ['any', 'object', 'Json'],
        }
        
        # Normalize types
        type1 = type1.replace('[]', '').strip()
        type2 = type2.replace('[]', '').strip()
        
        # Check direct match
        if type1 == type2:
            return True
        
        # Check mappings
        for prisma_type, mapped_types in type_mappings.items():
            if type1 == prisma_type and type2 in mapped_types:
                return True
            if type2 == prisma_type and type1 in mapped_types:
                return True
        
        return False
    
    def _check_validators(
        self, entity_name: str, schema_fields: Dict, dto_fields: Dict
    ) -> List[Dict]:
        """Check if validators match schema constraints."""
        warnings = []
        
        for field_name, schema_field in schema_fields.items():
            if field_name not in dto_fields:
                continue
            
            dto_field = dto_fields[field_name]
            schema_constraints = schema_field.get('constraints', {})
            dto_validators = dto_field.get('validators', {})
            
            # Check maxLength
            if 'maxLength' in schema_constraints:
                schema_max = schema_constraints['maxLength']
                dto_max = dto_validators.get('maxLength')
                
                if dto_max is None:
                    warnings.append({
                        'entity': entity_name,
                        'type': 'missing_validator',
                        'severity': 'WARNING',
                        'message': f'Field "{field_name}" has @db.VarChar({schema_max}) in schema but no @MaxLength({schema_max}) in DTO',
                        'suggestion': f'Add @MaxLength({schema_max}) decorator to DTO field'
                    })
                elif dto_max != schema_max:
                    warnings.append({
                        'entity': entity_name,
                        'type': 'validator_mismatch',
                        'severity': 'WARNING',
                        'message': f'Field "{field_name}" maxLength mismatch: schema={schema_max}, DTO={dto_max}',
                        'suggestion': f'Update DTO @MaxLength to match schema constraint'
                    })
        
        return warnings
    
    def _check_enums(self, entity_name: str) -> List[Dict]:
        """Check if enum values match across layers."""
        violations = []
        
        # Parse enums from schema
        if not self.schema_path.exists():
            return violations
        
        try:
            with open(self.schema_path, 'r', encoding='utf-8') as f:
                schema_content = f.read()
        except (OSError, IOError, UnicodeDecodeError) as e:
            logger.warning(f"Error reading schema file {self.schema_path}: {e}")
            return violations
        
        # Find enums related to this entity
        for enum_match in self.enum_pattern.finditer(schema_content):
            enum_name = enum_match.group(1)
            if not enum_name.startswith(entity_name):
                continue
            
            enum_body = enum_match.group(2)
            schema_values = set(re.findall(r'([A-Z_]+)', enum_body))
            
            # Check DTO enum
            dto_files = list(self.dto_base_path.rglob(f"*{entity_name.lower()}*.dto.ts"))
            if dto_files:
                try:
                    with open(dto_files[0], 'r', encoding='utf-8') as f:
                        dto_content = f.read()
                except (OSError, IOError, UnicodeDecodeError) as e:
                    logger.warning(f"Error reading DTO file {dto_files[0]}: {e}")
                    continue
                
                dto_enum_match = re.search(
                    rf'enum\s+{enum_name}\s*\{{([^}}]+)\}}',
                    dto_content,
                    re.DOTALL
                )
                
                if dto_enum_match:
                    dto_values = set(re.findall(r'([A-Z_]+)\s*=', dto_enum_match.group(1)))
                    
                    if schema_values != dto_values:
                        violations.append({
                            'entity': entity_name,
                            'type': 'enum_mismatch',
                            'severity': 'CRITICAL',
                            'message': f'Enum "{enum_name}" values mismatch between schema and DTO',
                            'suggestion': f'Schema: {sorted(schema_values)}, DTO: {sorted(dto_values)}'
                        })
            
            # Check frontend enum
            type_files = list(self.frontend_types_path.rglob(f"*{entity_name.lower()}*.ts"))
            if type_files:
                try:
                    with open(type_files[0], 'r', encoding='utf-8') as f:
                        frontend_content = f.read()
                except (OSError, IOError, UnicodeDecodeError) as e:
                    logger.warning(f"Error reading frontend type file {type_files[0]}: {e}")
                    continue
                
                frontend_enum_match = re.search(
                    rf'enum\s+{enum_name}\s*\{{([^}}]+)\}}',
                    frontend_content,
                    re.DOTALL
                )
                
                if frontend_enum_match:
                    frontend_values = set(re.findall(r'([A-Z_]+)\s*=', frontend_enum_match.group(1)))
                    
                    if schema_values != frontend_values:
                        violations.append({
                            'entity': entity_name,
                            'type': 'enum_mismatch',
                            'severity': 'CRITICAL',
                            'message': f'Enum "{enum_name}" values mismatch between schema and frontend',
                            'suggestion': f'Schema: {sorted(schema_values)}, Frontend: {sorted(frontend_values)}'
                        })
        
        return violations
    
    def _check_contract_docs(self, entity_name: str) -> List[Dict]:
        """Check if contract documentation exists for event entities."""
        warnings = []
        
        # List of entities that produce/consume events
        event_entities = ['WorkOrder', 'Invoice', 'Payment', 'Job']
        
        if entity_name in event_entities:
            contract_doc_path = Path(f"docs/contracts/{entity_name.lower()}.md")
            if not contract_doc_path.exists():
                warnings.append({
                    'entity': entity_name,
                    'type': 'missing_contract_docs',
                    'severity': 'WARNING',
                    'message': f'Event entity "{entity_name}" is missing contract documentation',
                    'suggestion': f'Create docs/contracts/{entity_name.lower()}.md with event schemas and API contracts'
                })
        
        return warnings
    
    def print_results(self) -> None:
        """Print check results."""
        print(f"\n{'='*80}")
        print(f"Layer Synchronization Check Results")
        print(f"{'='*80}\n")
        
        if not self.violations and not self.warnings:
            print(f"✅ All checks passed!")
            print(f"   Entities checked: {self.entities_checked}")
            print(f"   No violations or warnings found")
            return
        
        # Group violations by entity
        violations_by_entity = {}
        for v in self.violations:
            entity = v['entity']
            if entity not in violations_by_entity:
                violations_by_entity[entity] = []
            violations_by_entity[entity].append(v)
        
        # Group warnings by entity
        warnings_by_entity = {}
        for w in self.warnings:
            entity = w['entity']
            if entity not in warnings_by_entity:
                warnings_by_entity[entity] = []
            warnings_by_entity[entity].append(w)
        
        # Print violations
        if violations_by_entity:
            print("🔴 VIOLATIONS FOUND:\n")
            for entity, entity_violations in violations_by_entity.items():
                print(f"📄 {entity}")
                print(f"   {len(entity_violations)} violation(s):\n")
                
                for v in entity_violations:
                    print(f"   🔴 {v['severity']}: {v['message']}")
                    print(f"      → {v['suggestion']}\n")
        
        # Print warnings
        if warnings_by_entity:
            print("\n🟡 WARNINGS:\n")
            for entity, entity_warnings in warnings_by_entity.items():
                print(f"📄 {entity}")
                print(f"   {len(entity_warnings)} warning(s):\n")
                
                for w in entity_warnings:
                    print(f"   🟡 {w['severity']}: {w['message']}")
                    print(f"      → {w['suggestion']}\n")
        
        # Summary
        print(f"{'='*80}")
        print(f"Summary:")
        print(f"  Entities checked: {self.entities_checked}")
        print(f"  Violations found: {len(self.violations)}")
        print(f"  Warnings found: {len(self.warnings)}")
        print(f"  Entities with issues: {len(set([v['entity'] for v in self.violations + self.warnings]))}")
        print(f"{'='*80}\n")
        
        # Exit with error code if violations found
        if self.violations:
            sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description='Check layer synchronization for VeroField entities')
    parser.add_argument('--entity', type=str, help='Entity name to check (e.g., User, WorkOrder)')
    parser.add_argument('--all', action='store_true', help='Check all entities in schema')
    
    args = parser.parse_args()
    
    checker = LayerSyncChecker()
    
    if args.entity:
        checker.check_entity(args.entity)
    elif args.all:
        # Parse all entities from schema
        if checker.schema_path.exists():
            try:
                with open(checker.schema_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except (OSError, IOError, UnicodeDecodeError) as e:
                print(f"Error reading schema file: {e}", file=sys.stderr)
                return
            
            for match in checker.model_pattern.finditer(content):
                entity_name = match.group(1)
                checker.check_entity(entity_name)
        else:
            print(f"❌ Schema file not found: {checker.schema_path}")
            sys.exit(1)
    else:
        print("Usage: python check-layer-sync.py --entity <EntityName> or --all")
        sys.exit(1)
    
    checker.print_results()

if __name__ == '__main__':
    main()





