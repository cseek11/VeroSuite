#!/usr/bin/env python3
"""
Agent Response Parser

Parses agent responses to verify:
- context-id reference
- Step 0.5 acknowledgment
- Step 4.5 acknowledgment
- required context file mentions

Last Updated: 2025-12-04
"""

import re
from typing import Set, Dict, Any, Optional

# Add project root to path
import sys
from pathlib import Path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="response_parser")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("response_parser")


class AgentResponseParser:
    """
    Parses agent responses to verify:
    - context-id reference
    - Step 0.5 acknowledgment
    - Step 4.5 acknowledgment
    - required context file mentions
    - @file references
    """
    
    # Context-ID pattern: context-id: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
    CONTEXT_ID_PATTERN = re.compile(
        r"context-id:\s*([0-9a-fA-F-]{36})",
        re.IGNORECASE
    )
    
    # Step 0.5 acknowledgment patterns
    STEP_0_5_PATTERN = re.compile(
        r"(step\s*0\.5|initial\s*verification|loaded\s*required\s*context|read\s*recommendations\.md|context\s*ready\s*for\s*task)",
        re.IGNORECASE
    )
    
    # Step 4.5 acknowledgment patterns
    STEP_4_5_PATTERN = re.compile(
        r"(step\s*4\.5|final\s*verification|unloaded\s*obsolete\s*context|pre-loaded\s*predicted\s*context|context\s*state\s*updated)",
        re.IGNORECASE
    )
    
    # File mention pattern: @path/to/file.md or @.cursor/enforcement/rules/file.mdc
    # Includes common file extensions: .md, .mdc, .ts, .tsx, .py, .json, .yaml, .yml, .prisma, .sql
    # IMPORTANT: Order extensions from longest to shortest to avoid partial matches (e.g., .mdc before .md)
    FILE_MENTION_PATTERN = re.compile(
        r"@([\w\./-]+\.(?:mdc|tsx|yaml|prisma|json|typescript|python|md|ts|py|yml|sql))",
        re.IGNORECASE
    )
    
    # Alternative file mention (without @)
    FILE_PATH_PATTERN = re.compile(
        r"`([\w\./-]+\.(?:mdc|tsx|yaml|prisma|json|typescript|python|md|ts|py|yml|sql))`",
        re.IGNORECASE
    )
    
    def extract_context_id(self, text: str) -> Optional[str]:
        """
        Extract context-id from agent response.
        
        Args:
            text: Agent response text
            
        Returns:
            Context-ID UUID string or None if not found
        """
        match = self.CONTEXT_ID_PATTERN.search(text)
        return match.group(1) if match else None
    
    def extract_file_mentions(self, text: str) -> Set[str]:
        """
        Extract all file mentions from agent response.
        
        Includes both @file and `file` formats.
        
        Args:
            text: Agent response text
            
        Returns:
            Set of file paths mentioned
        """
        files = set()
        
        # Extract @file mentions
        for match in self.FILE_MENTION_PATTERN.finditer(text):
            files.add(match.group(1))
        
        # Extract `file` mentions (backtick format)
        for match in self.FILE_PATH_PATTERN.finditer(text):
            files.add(match.group(1))
        
        return files
    
    def detects_step_0_5_ack(self, text: str) -> bool:
        """
        Detect if agent acknowledged Step 0.5 requirements.
        
        Args:
            text: Agent response text
            
        Returns:
            True if Step 0.5 acknowledgment detected
        """
        return bool(self.STEP_0_5_PATTERN.search(text))
    
    def detects_step_4_5_ack(self, text: str) -> bool:
        """
        Detect if agent acknowledged Step 4.5 requirements.
        
        Args:
            text: Agent response text
            
        Returns:
            True if Step 4.5 acknowledgment detected
        """
        return bool(self.STEP_4_5_PATTERN.search(text))
    
    def parse(self, text: str) -> Dict[str, Any]:
        """
        Parse full agent response for all verification signals.
        
        Args:
            text: Agent response text
            
        Returns:
            Dict with:
            - context_id: Extracted context-ID or None
            - file_mentions: Set of file paths mentioned
            - step_0_5: True if Step 0.5 acknowledged
            - step_4_5: True if Step 4.5 acknowledged
        """
        return {
            "context_id": self.extract_context_id(text),
            "file_mentions": self.extract_file_mentions(text),
            "step_0_5": self.detects_step_0_5_ack(text),
            "step_4_5": self.detects_step_4_5_ack(text),
        }

