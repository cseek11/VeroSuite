"""
Redactor / Safety Hooks (Phase 7)

Provides optional redaction middleware to mask secrets, tokens, and hostnames.
"""
from __future__ import annotations

from typing import Optional, List, Dict, Any
import re


class Redactor:
    """Redacts sensitive information from code and text."""
    
    def __init__(self, enabled: bool = True, namespace: Optional[str] = None):
        """
        Initialize redactor.
        
        Args:
            enabled: Whether redaction is enabled
            namespace: Namespace identifier (some namespaces might skip redaction)
        """
        self.enabled = enabled
        self.namespace = namespace
        
        # Patterns for sensitive data
        self.patterns = [
            # API keys / tokens (more flexible patterns)
            (r'["\']?api[_-]?key["\']?\s*[:=]\s*["\']?([a-zA-Z0-9_\-]{20,})["\']?', r'api_key="***REDACTED***"'),
            (r'["\']?token["\']?\s*[:=]\s*["\']?([a-zA-Z0-9_\-]{15,})["\']?', r'token="***REDACTED***"'),
            (r'["\']?secret["\']?\s*[:=]\s*["\']?([a-zA-Z0-9_\-]{20,})["\']?', r'secret="***REDACTED***"'),
            
            # AWS keys
            (r'AKIA[0-9A-Z]{16}', r'AKIA***REDACTED***'),
            
            # Email addresses (optional - can be configured)
            # (r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', r'***@***.***'),
            
            # Hostnames / IPs (optional)
            # (r'\b(?:\d{1,3}\.){3}\d{1,3}\b', r'***.***.***.***'),
        ]
    
    def redact_code(self, code: str) -> str:
        """
        Redact sensitive information from code.
        
        Args:
            code: Code text
        
        Returns:
            Redacted code
        """
        if not self.enabled:
            return code
        
        redacted = code
        for pattern, replacement in self.patterns:
            redacted = re.sub(pattern, replacement, redacted, flags=re.IGNORECASE)
        
        return redacted
    
    def redact_text(self, text: str) -> str:
        """
        Redact sensitive information from text.
        
        Args:
            text: Text content
        
        Returns:
            Redacted text
        """
        if not self.enabled:
            return text
        
        redacted = text
        for pattern, replacement in self.patterns:
            redacted = re.sub(pattern, replacement, redacted, flags=re.IGNORECASE)
        
        return redacted
    
    def should_redact(self) -> bool:
        """
        Determine if redaction should be applied.
        
        Some namespaces might be internal-only and skip redaction.
        """
        if not self.enabled:
            return False
        
        # Example: internal namespaces skip redaction
        internal_namespaces = ["internal", "dev", "test"]
        if self.namespace and self.namespace.lower() in internal_namespaces:
            return False
        
        return True

