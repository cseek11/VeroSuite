#!/usr/bin/env python3
"""
Retroactively add existing PRs to their sessions.

This script adds PRs #354, #355, #356, #357 to their respective sessions.
"""

import sys
from pathlib import Path
from datetime import datetime

# Add scripts directory to path
sys.path.insert(0, str(Path(__file__).parent))

from auto_pr_session_manager import AutoPRSessionManager

def main():
    """Add existing PRs to sessions."""
    manager = AutoPRSessionManager()
    
    # PRs created during testing
    prs = [
        {
            "number": "354",
            "title": "Auto-PR: scripts (1 files)",
            "author": "cseek_cursor",
            "files": 1,
            "timestamp": "2025-11-21T17:34:50.422484Z"
        },
        {
            "number": "355",
            "title": "Auto-PR: scripts (1 files)",
            "author": "cseek_cursor",
            "files": 1,
            "timestamp": "2025-11-21T17:34:55.587465Z"
        },
        {
            "number": "356",
            "title": "Auto-PR: Auto-PR (9 files)",
            "author": "cseek_cursor",
            "files": 9,
            "timestamp": "2025-11-21T17:35:02.295694Z"
        },
        {
            "number": "357",
            "title": "Auto-PR: developer (2 files)",
            "author": "cseek_cursor",
            "files": 2,
            "timestamp": "2025-11-21T17:35:16.457100Z"
        },
    ]
    
    print("Adding PRs to sessions...")
    
    for pr in prs:
        try:
            # Extract session ID (use naive datetime for compatibility)
            timestamp_str = pr["timestamp"].replace('Z', '')
            if '+' in timestamp_str:
                timestamp_str = timestamp_str.split('+')[0]
            timestamp = datetime.fromisoformat(timestamp_str)
            
            session_id = manager.extract_session_id(
                pr["title"],
                "",
                pr["author"],
                timestamp
            )
            
            # Add PR to session
            should_skip, session_id_result, session_data = manager.add_to_session(
                pr["number"],
                {
                    "pr_title": pr["title"],
                    "pr_body": "",
                    "author": pr["author"],
                    "files_changed": pr["files"],
                    "timestamp": timestamp.isoformat(),
                    "commit_messages": [pr["title"]]
                },
                session_id
            )
            
            print(f"Added PR #{pr['number']} to session {session_id_result}")
            print(f"   Session now has {len(session_data.get('prs', []))} PR(s)")
            
        except Exception as e:
            print(f"Failed to add PR #{pr['number']}: {e}")
    
    # Save sessions
    manager.save_sessions()
    print("\nSessions saved successfully")
    print(f"   Active sessions: {len(manager.sessions.get('active_sessions', {}))}")
    print(f"   Completed sessions: {len(manager.sessions.get('completed_sessions', []))}")

if __name__ == "__main__":
    main()

