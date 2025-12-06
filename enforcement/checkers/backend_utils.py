"""
Shared utilities for backend checkers.

Provides common functions for module root detection, controller parsing, etc.
Used by BackendChecker, DtoEnforcementChecker, and BackendPatternsChecker.

Python Bible Chapter 11: Clean Architecture principles.
"""

from pathlib import Path
from typing import Optional, List, Dict
import re


def find_module_root(file_path: Path) -> Optional[Path]:
    """
    Find the module root directory for a controller or service file.
    
    Looks for:
    - *.module.ts file in parent directories
    - dto/ directory in parent directories
    - Top of apps/api/src or libs/**/src
    
    Args:
        file_path: Path to the controller/service file
        
    Returns:
        Path to module root, or None if not found
    """
    current = file_path.parent
    
    # Walk up the directory tree
    max_depth = 10  # Prevent infinite loops
    depth = 0
    
    while current != current.parent and depth < max_depth:
        # Check for module file
        module_files = list(current.glob('*.module.ts'))
        if module_files:
            return current
        
        # Check for dto directory
        if (current / 'dto').exists():
            return current
        
        # Check if we've reached a top-level src directory
        if current.name == 'src':
            # Check if parent is apps/api or libs/*
            parent = current.parent
            if parent.name in ['api', 'common'] or (parent.parent and parent.parent.name == 'libs'):
                return current
        
        current = current.parent
        depth += 1
    
    return None


def has_dto_directory(module_root: Path) -> bool:
    """
    Check if a module root has a dto/ directory.
    
    Args:
        module_root: Path to module root directory
        
    Returns:
        True if dto/ directory exists, False otherwise
    """
    return (module_root / 'dto').exists() and (module_root / 'dto').is_dir()


def parse_controller_structure(content: str) -> Dict:
    """
    Parse controller structure to extract metadata.
    
    Args:
        content: Full file content
        
    Returns:
        Dictionary with:
        - controller_name: Name of controller class
        - has_controller_decorator: Whether @Controller exists
        - body_params: List of @Body() parameter info
        - mutating_methods: List of methods with @Post/@Put/@Patch/@Delete
        - has_auth_guard: Whether @UseGuards or auth decorators exist
    """
    result = {
        'controller_name': None,
        'has_controller_decorator': '@Controller' in content,
        'body_params': [],
        'mutating_methods': [],
        'has_auth_guard': False,
    }
    
    # Extract controller class name
    controller_match = re.search(r'export\s+class\s+(\w+Controller)', content)
    if controller_match:
        result['controller_name'] = controller_match.group(1)
    
    # Check for auth guards
    auth_patterns = [
        r'@UseGuards\s*\(',
        r'JwtAuthGuard',
        r'@Auth\s*\(',
        r'@Roles\s*\(',
    ]
    result['has_auth_guard'] = any(re.search(pattern, content) for pattern in auth_patterns)
    
    # Find all @Body() parameters
    body_pattern = re.compile(
        r'@Body\s*\((?:\s*["\']([^"\']+)["\']\s*)?\)\s+(\w+)\s*:\s*([^,)\n]+)'
    )
    for match in body_pattern.finditer(content):
        result['body_params'].append({
            'field_selector': match.group(1),
            'param_name': match.group(2),
            'type_name': match.group(3).strip(),
            'position': match.start(),
        })
    
    # Find mutating methods (with HTTP decorators)
    mutating_decorators = ['@Post', '@Put', '@Patch', '@Delete']
    method_pattern = re.compile(r'(?:async\s+)?(\w+)\s*\([^)]*\)\s*{')
    
    for match in method_pattern.finditer(content):
        method_start = match.start()
        method_name = match.group(1)
        
        # Look backwards for decorators
        context_start = max(0, method_start - 200)  # ~10 lines before
        context = content[context_start:method_start]
        
        if any(decorator in context for decorator in mutating_decorators):
            # Check if this method has @Body() parameters
            method_end = content.find('}', method_start)
            method_content = content[method_start:method_end] if method_end > 0 else content[method_start:]
            
            has_body = '@Body' in method_content
            has_auth = any(re.search(pattern, context) for pattern in auth_patterns)
            
            result['mutating_methods'].append({
                'name': method_name,
                'has_body': has_body,
                'has_auth': has_auth,
                'position': method_start,
            })
    
    return result


def count_dto_body_params(body_params: List[Dict]) -> int:
    """
    Count @Body() parameters that use DTO types.
    
    Args:
        body_params: List of body parameter info dictionaries
        
    Returns:
        Number of parameters using DTO types (ending with Dto/DTO)
    """
    return sum(
        1 for param in body_params
        if param['type_name'] and param['type_name'].strip().endswith(('Dto', 'DTO'))
    )


def is_test_file(file_path: Path) -> bool:
    """
    Determine if a file is a test file that should be skipped.
    
    Policy: Only skip files that are explicitly test files:
    - Files in /tests/ or /__tests__/ directories
    - Files with .spec.ts, .test.ts, .spec.js, .test.js extensions
    - Files with .spec.py, .test.py extensions
    
    Files like test-violations.service.ts are NOT test files and should be checked.
    
    Args:
        file_path: Path to the file (can be Path object or string)
        
    Returns:
        True if file should be skipped, False otherwise
    """
    if isinstance(file_path, str):
        file_path = Path(file_path)
    
    file_str = str(file_path).lower()
    
    # Check for test directories
    if any(part in file_str for part in ['/tests/', '/__tests__/', '\\tests\\', '\\__tests__\\']):
        return True
    
    # Check for test file extensions
    test_extensions = ['.spec.ts', '.test.ts', '.spec.js', '.test.js', '.spec.py', '.test.py']
    if any(file_str.endswith(ext) for ext in test_extensions):
        return True
    
    return False
