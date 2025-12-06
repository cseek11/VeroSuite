#!/usr/bin/env python3
"""
LLM Caller - Programmatically invoke Cursor AI.
Brain A calls Brain B with violation reports.

Last Updated: 2025-12-05
"""

import json
import time
from pathlib import Path
from typing import Optional
from datetime import datetime


class LLMCaller:
    """Interface to call Cursor AI programmatically."""
    
    def __init__(self, project_root: Path = None):
        if project_root is None:
            project_root = Path(__file__).parent.parent.parent
        
        self.project_root = project_root
        self.report_path = project_root / ".cursor" / "enforcement" / "ENFORCER_REPORT.json"
        self.input_file = project_root / ".cursor" / "llm_input.txt"
        self.output_file = project_root / ".cursor" / "llm_output.txt"
        self.status_file = project_root / ".cursor" / "llm_status.json"
    
    def call_fix_mode(self, report_path: Path = None, timeout: int = 300) -> Optional[str]:
        """
        Call Cursor AI in fix mode with enforcer report.
        
        Uses file-based communication:
        1. Write prompt to llm_input.txt
        2. Wait for response in llm_output.txt
        3. Poll status_file for completion
        
        Args:
            report_path: Path to ENFORCER_REPORT.json (defaults to standard location)
            timeout: Maximum seconds to wait for response (default: 300 = 5 minutes)
        
        Returns:
            LLM response text, or None if timeout/error
        """
        if report_path is None:
            report_path = self.report_path
        
        if not report_path.exists():
            raise FileNotFoundError(f"Report not found: {report_path}")
        
        # Read report
        report_data = json.loads(report_path.read_text())
        
        # Construct prompt
        prompt = self._build_fix_prompt(report_data)
        
        # Write prompt to input file
        self.input_file.parent.mkdir(parents=True, exist_ok=True)
        self.input_file.write_text(prompt, encoding='utf-8')
        
        # Clear previous output
        if self.output_file.exists():
            self.output_file.unlink()
        
        # Update status
        self._update_status("waiting", "Prompt written, waiting for LLM response")
        
        print(f"✓ Fix prompt written to: {self.input_file}")
        print(f"⏳ Waiting for LLM response (timeout: {timeout}s)...")
        print(f"   The LLM should read: {self.input_file}")
        print(f"   The LLM should write response to: {self.output_file}")
        
        # Poll for response
        start_time = time.time()
        while time.time() - start_time < timeout:
            if self.output_file.exists():
                response = self.output_file.read_text(encoding='utf-8')
                if response.strip():
                    self._update_status("completed", "LLM response received")
                    print(f"✓ LLM response received")
                    return response
            
            time.sleep(2)  # Poll every 2 seconds
        
        # Timeout
        self._update_status("timeout", f"No response within {timeout} seconds")
        print(f"⚠️ Timeout: No LLM response within {timeout} seconds")
        return None
    
    def _build_fix_prompt(self, report_data: dict) -> str:
        """Build fix mode prompt from report data."""
        
        blocking_count = report_data['summary']['blocking_count']
        warning_count = report_data['summary']['warning_count']
        
        prompt = f"""[FOLLOW_ENFORCER_REPORT]

The auto-enforcer has detected {blocking_count} BLOCKING and {warning_count} WARNING violations.

Here is ENFORCER_REPORT.json:

```json
{json.dumps(report_data, indent=2)}
```

**Your task:**
1. Read all violations in the report
2. Apply fixes to ONLY the files mentioned
3. Use fix_hint as guidance (not strict template)
4. Fix all BLOCKING violations first
5. Fix WARNING violations if simple
6. Output corrected code
7. End with: [FIX_COMPLETE]

**Important:**
- Do NOT rewrite files not mentioned
- Do NOT add unrelated features
- Keep changes minimal and focused
- Trust the report (it's from the enforcer's full rule analysis)

When you're done, write your response to: `.cursor/llm_output.txt`
"""
        return prompt
    
    def _update_status(self, status: str, message: str):
        """Update status file."""
        status_data = {
            "status": status,
            "message": message,
            "timestamp": datetime.now().isoformat(),
            "input_file": str(self.input_file.relative_to(self.project_root)),
            "output_file": str(self.output_file.relative_to(self.project_root))
        }
        
        self.status_file.parent.mkdir(parents=True, exist_ok=True)
        self.status_file.write_text(json.dumps(status_data, indent=2), encoding='utf-8')
    
    def check_fix_complete(self, response: str) -> bool:
        """Check if LLM response indicates fixes are complete."""
        if not response:
            return False
        
        # Check for completion tag
        if "[FIX_COMPLETE]" in response.upper():
            return True
        
        # Check for incomplete/blocked tags
        if "[FIX_INCOMPLETE]" in response.upper():
            return False
        
        if "[FIX_BLOCKED]" in response.upper():
            return False
        
        # If response exists but no clear tag, assume incomplete
        return False
    
    def get_status(self) -> dict:
        """Get current status from status file."""
        if not self.status_file.exists():
            return {"status": "idle", "message": "No active call"}
        
        try:
            return json.loads(self.status_file.read_text(encoding='utf-8'))
        except Exception:
            return {"status": "error", "message": "Could not read status file"}


def example_usage():
    """Example of calling LLM in fix mode."""
    
    caller = LLMCaller()
    
    # Assume report exists
    if Path(".cursor/enforcement/ENFORCER_REPORT.json").exists():
        print("Calling LLM in fix mode...")
        response = caller.call_fix_mode(timeout=60)  # 1 minute for example
        
        if response:
            print("\n" + "="*60)
            print("LLM Response:")
            print("="*60)
            print(response)
            print("="*60)
            
            if caller.check_fix_complete(response):
                print("\n✅ Fixes complete, ready to re-audit")
            else:
                print("\n⚠️ Fixes incomplete, may need human intervention")
        else:
            print("\n❌ No response received (timeout or error)")
    else:
        print("❌ No report found. Run enforcer first:")
        print("   python .cursor/enforcement/auto-enforcer.py audit")


if __name__ == "__main__":
    example_usage()









