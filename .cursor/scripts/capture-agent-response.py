#!/usr/bin/env python3
"""
Agent Response Capture Script

This script captures the agent's response and stores it for enforcement verification.
The agent should call this script or write directly to the response file.

Usage:
    python .cursor/scripts/capture-agent-response.py "Agent response text here"
    
Or the agent can write directly to:
    .cursor/enforcement/agent_response.txt

Last Updated: 2025-12-01
"""

import sys
from pathlib import Path
from datetime import datetime, timezone

# Add project root to path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

try:
    from logger_util import get_logger, get_or_create_trace_context
    logger = get_logger(context="capture_agent_response")
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("capture_agent_response")


def capture_response(response_text: str):
    """
    Capture agent response to file for enforcement verification.
    
    Args:
        response_text: The agent's response text
    """
    enforcement_dir = project_root / ".cursor" / "enforcement"
    enforcement_dir.mkdir(parents=True, exist_ok=True)
    
    response_file = enforcement_dir / "agent_response.txt"
    
    try:
        with open(response_file, 'w', encoding='utf-8') as f:
            f.write(response_text)
        
        logger.info(
            "Agent response captured",
            operation="capture_response",
            response_length=len(response_text),
            file_path=str(response_file)
        )
        
        return True
    except (OSError, PermissionError) as e:
        logger.error(
            f"Failed to capture agent response: {e}",
            operation="capture_response",
            error_code="RESPONSE_CAPTURE_FAILED",
            root_cause=str(e)
        )
        return False


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        # Read from stdin if no arguments
        response_text = sys.stdin.read()
    else:
        # Join all arguments as response text
        response_text = " ".join(sys.argv[1:])
    
    if not response_text.strip():
        logger.warn(
            "No response text provided",
            operation="main"
        )
        return 1
    
    success = capture_response(response_text)
    return 0 if success else 1


if __name__ == '__main__':
    sys.exit(main())








