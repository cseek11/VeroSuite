"""
Language Plugin Registry

Registry for language-specific pattern extractors.
"""
from __future__ import annotations

from typing import Dict, Type, Optional
from .base import LanguagePlugin
from . import rego_plugin, python_plugin, ts_plugin, sql_plugin


class RegoPlugin:
    """Rego language plugin implementing LanguagePlugin protocol."""
    name = "rego"
    aliases = ["rego", "policy", "opa"]
    
    def detect(self, code: str) -> bool:
        """Detect if code is Rego."""
        import re
        code_lower = code.lower()
        rego_patterns = [
            r'^\s*package\s+\w+',
            r'^\s*(?:allow|deny|violation)\s*(?:\[|:=|if)',
            r'\binput\.\w+',
            r'\bdata\.\w+',
            r':=\s*',
        ]
        return any(re.search(p, code, re.MULTILINE) for p in rego_patterns)
    
    def classify_patterns(self, code: str) -> list:
        """Extract patterns from Rego code."""
        from .base import CodePattern
        import re
        
        patterns = []
        code_lower = code.lower()
        
        # Quantifier detection
        if re.search(r'\bsome\s+\w+\s+in\b', code):
            patterns.append(CodePattern(
                pattern_type="quantifier",
                pattern_subtype="existential",
                code_snippet=code[:200],
                metadata={"quantifier": "some"}
            ))
        
        if re.search(r'\bevery\s+\w+\s+in\b', code):
            patterns.append(CodePattern(
                pattern_type="quantifier",
                pattern_subtype="universal",
                code_snippet=code[:200],
                metadata={"quantifier": "every"}
            ))
        
        # Aggregation detection
        agg_functions = ["count", "sum", "max", "min", "product", "all", "any"]
        for func in agg_functions:
            if re.search(rf'\b{func}\s*\(', code):
                patterns.append(CodePattern(
                    pattern_type="aggregation",
                    pattern_subtype=func,
                    code_snippet=code[:200],
                    metadata={"function": func}
                ))
        
        # Comprehension detection
        if re.search(r'\[.*\s+for\s+.*\]', code):
            patterns.append(CodePattern(
                pattern_type="comprehension",
                pattern_subtype="array",
                code_snippet=code[:200]
            ))
        
        if re.search(r'\{.*\s+for\s+.*\}', code):
            patterns.append(CodePattern(
                pattern_type="comprehension",
                pattern_subtype="set",
                code_snippet=code[:200]
            ))
        
        # Rule head detection
        rule_heads = ["allow", "deny", "violation", "warn"]
        for head in rule_heads:
            if re.search(rf'^{head}\s*(?:\[|:=|if)', code, re.MULTILINE):
                patterns.append(CodePattern(
                    pattern_type="rule_head",
                    pattern_subtype=head,
                    code_snippet=code[:200],
                    metadata={"rule_type": head}
                ))
        
        return patterns


class PythonPlugin:
    """Python language plugin implementing LanguagePlugin protocol."""
    name = "python"
    aliases = ["python", "py"]
    
    def detect(self, code: str) -> bool:
        """Detect if code is Python."""
        import re
        python_patterns = [
            r'^\s*(?:def|class|import|from)\s+\w+',
            r'\bprint\s*\(',
            r':\s*$',  # Colon at end of line
        ]
        return any(re.search(p, code, re.MULTILINE) for p in python_patterns)
    
    def classify_patterns(self, code: str) -> list:
        """Extract patterns from Python code using AST."""
        from .base import CodePattern
        import ast
        
        patterns = []
        try:
            tree = ast.parse(code)
            for node in ast.walk(tree):
                if isinstance(node, ast.ListComp):
                    patterns.append(CodePattern(
                        pattern_type="comprehension",
                        pattern_subtype="list",
                        code_snippet=code[:200],
                        line_no=getattr(node, 'lineno', 0)
                    ))
                elif isinstance(node, ast.DictComp):
                    patterns.append(CodePattern(
                        pattern_type="comprehension",
                        pattern_subtype="dict",
                        code_snippet=code[:200],
                        line_no=getattr(node, 'lineno', 0)
                    ))
                elif isinstance(node, ast.SetComp):
                    patterns.append(CodePattern(
                        pattern_type="comprehension",
                        pattern_subtype="set",
                        code_snippet=code[:200],
                        line_no=getattr(node, 'lineno', 0)
                    ))
        except SyntaxError:
            pass  # Invalid Python, skip AST analysis
        
        return patterns


class TypeScriptPlugin:
    """TypeScript language plugin implementing LanguagePlugin protocol."""
    name = "typescript"
    aliases = ["typescript", "ts", "tsx"]
    
    def detect(self, code: str) -> bool:
        """Detect if code is TypeScript."""
        import re
        ts_patterns = [
            r'^\s*(?:export|import|const|let|var|function|class)\s+\w+',
            r':\s*(?:string|number|boolean|object)\s*[=;]',
            r'@\w+\(',  # Decorators
            r'interface\s+\w+',
        ]
        return any(re.search(p, code, re.MULTILINE) for p in ts_patterns)
    
    def classify_patterns(self, code: str) -> list:
        """Extract patterns from TypeScript code."""
        from .base import CodePattern
        import re
        
        patterns = []
        
        # NestJS patterns
        if re.search(r'@Controller\(', code):
            patterns.append(CodePattern(
                pattern_type="nestjs",
                pattern_subtype="controller",
                code_snippet=code[:200],
                metadata={"framework": "nestjs"}
            ))
        
        if re.search(r'@Injectable\(', code):
            patterns.append(CodePattern(
                pattern_type="nestjs",
                pattern_subtype="service",
                code_snippet=code[:200],
                metadata={"framework": "nestjs"}
            ))
        
        # Prisma patterns
        if re.search(r'PrismaService\.', code):
            patterns.append(CodePattern(
                pattern_type="prisma",
                pattern_subtype="query",
                code_snippet=code[:200],
                metadata={"orm": "prisma"}
            ))
        
        return patterns


class SQLPlugin:
    """SQL language plugin implementing LanguagePlugin protocol."""
    name = "sql"
    aliases = ["sql"]
    
    def detect(self, code: str) -> bool:
        """Detect if code is SQL."""
        import re
        sql_patterns = [
            r'^\s*(?:SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER)\s+',
            r'\bFROM\s+\w+',
            r'\bWHERE\s+',
            r'\bJOIN\s+',
        ]
        return any(re.search(p, code, re.IGNORECASE | re.MULTILINE) for p in sql_patterns)
    
    def classify_patterns(self, code: str) -> list:
        """Extract patterns from SQL code."""
        from .base import CodePattern
        import re
        
        patterns = []
        code_upper = code.upper()
        
        # Query type detection
        if re.search(r'\bSELECT\b', code_upper):
            patterns.append(CodePattern(
                pattern_type="query",
                pattern_subtype="select",
                code_snippet=code[:200]
            ))
        
        if re.search(r'\bJOIN\b', code_upper):
            patterns.append(CodePattern(
                pattern_type="query",
                pattern_subtype="join",
                code_snippet=code[:200]
            ))
        
        return patterns


# Language plugin registry
LANGUAGE_REGISTRY: Dict[str, Type[LanguagePlugin]] = {
    "rego": RegoPlugin,
    "typescript": TypeScriptPlugin,
    "python": PythonPlugin,
    "sql": SQLPlugin,
}


def get_plugin(language: str) -> Optional[LanguagePlugin]:
    """
    Get language plugin by name or alias.
    
    Args:
        language: Language name or alias
    
    Returns:
        LanguagePlugin instance or None if not found
    """
    lang_lower = language.lower() if language else ""
    
    # Direct lookup
    if lang_lower in LANGUAGE_REGISTRY:
        return LANGUAGE_REGISTRY[lang_lower]()
    
    # Alias lookup
    for plugin_class in LANGUAGE_REGISTRY.values():
        plugin = plugin_class()
        if lang_lower in plugin.aliases:
            return plugin
    
    return None


def detect_language(code: str) -> Optional[str]:
    """
    Detect programming language from code.
    
    Args:
        code: Code text
    
    Returns:
        Language name or None if not detected
    """
    for plugin_class in LANGUAGE_REGISTRY.values():
        plugin = plugin_class()
        if plugin.detect(code):
            return plugin.name
    
    return None

