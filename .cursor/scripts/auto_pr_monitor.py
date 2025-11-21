#!/usr/bin/env python3
"""
Monitor Auto-PR creation process and log all steps.
"""

import json
import subprocess
import time
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, Optional

try:
    from logger_util import get_logger
    logger = get_logger(context="auto_pr_monitor")
except ImportError:
    import logging
    logger = logging.getLogger("auto_pr_monitor")

LOG_FILE = Path(".cursor/scripts/auto_pr_monitor.log")

def log_step(step: str, message: str, data: Optional[Dict] = None):
    """Log a monitoring step."""
    timestamp = datetime.now().isoformat()
    log_entry = {
        "timestamp": timestamp,
        "step": step,
        "message": message,
        "data": data or {}
    }
    
    # Write to log file
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(log_entry) + "\n")
    
    # Also print
    print(f"[{timestamp}] {step}: {message}")
    if data:
        print(f"  Data: {json.dumps(data, indent=2)}")

def run_command(cmd: list, cwd: Optional[Path] = None) -> tuple[str, int]:
    """Run a command and return output and return code."""
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=60
        )
        return result.stdout.strip(), result.returncode
    except subprocess.TimeoutExpired as e:
        log_step("ERROR", f"Command timed out: {' '.join(cmd)}", {"error": str(e)})
        return "", 1
    except Exception as e:
        log_step("ERROR", f"Command failed: {' '.join(cmd)}", {"error": str(e)})
        return "", 1

def check_pr_status(pr_number: str) -> Dict:
    """Check PR status and get details."""
    output, code = run_command(["gh", "pr", "view", pr_number, "--json", "number,title,state,body,comments,labels"])
    if code == 0:
        try:
            return json.loads(output)
        except:
            return {}
    return {}

def check_workflow_status(pr_number: str) -> Dict:
    """Check workflow status for PR."""
    output, code = run_command(["gh", "run", "list", "--workflow=swarm_compute_reward_score.yml", "--limit", "5", "--json", "databaseId,status,conclusion,createdAt"])
    if code == 0:
        try:
            runs = json.loads(output)
            # Find runs related to this PR
            return runs
        except:
            return []
    return []

def main():
    """Main monitoring function."""
    log_step("START", "Auto-PR monitoring started")
    
    # Step 1: Check current git status
    log_step("STEP1", "Checking git status")
    output, code = run_command(["git", "status", "--porcelain"])
    if code != 0:
        log_step("ERROR", "Failed to get git status", {"code": code})
        return
    
    changed_files = [line for line in output.split("\n") if line.strip()]
    log_step("STEP1", f"Found {len(changed_files)} changed files", {"files": changed_files[:10]})
    
    if not changed_files:
        log_step("WARNING", "No changed files found")
        return
    
    # Step 2: Create Auto-PR
    log_step("STEP2", "Creating Auto-PR")
    try:
        from monitor_changes import main as monitor_main
        import sys
        sys.argv = ["monitor_changes.py", "--force"]
        monitor_main()
        log_step("STEP2", "Auto-PR creation command executed")
    except Exception as e:
        log_step("ERROR", "Failed to create Auto-PR", {"error": str(e), "type": type(e).__name__})
        return
    
    # Step 3: Wait and check for new PR
    log_step("STEP3", "Waiting for PR creation...")
    time.sleep(5)
    
    # Get latest PR
    output, code = run_command(["gh", "pr", "list", "--limit", "1", "--json", "number,title,state,createdAt"])
    if code == 0:
        try:
            prs = json.loads(output)
            if prs:
                pr = prs[0]
                pr_number = str(pr["number"])
                log_step("STEP3", f"Found PR #{pr_number}", {"title": pr["title"]})
                
                # Step 4: Monitor PR details
                log_step("STEP4", f"Monitoring PR #{pr_number}")
                
                # Check PR body for compliance section
                pr_details = check_pr_status(pr_number)
                if pr_details:
                    body = pr_details.get("body", "")
                    has_compliance = "## Enforcement Pipeline Compliance" in body
                    log_step("STEP4", f"PR body checked", {
                        "has_compliance_section": has_compliance,
                        "body_length": len(body)
                    })
                    
                    if has_compliance:
                        log_step("SUCCESS", "Compliance section found in PR body")
                    else:
                        log_step("WARNING", "Compliance section NOT found in PR body")
                
                # Step 5: Monitor CI workflow
                log_step("STEP5", "Monitoring CI workflow...")
                for i in range(12):  # Check for 2 minutes (every 10 seconds)
                    time.sleep(10)
                    workflows = check_workflow_status(pr_number)
                    if workflows:
                        latest = workflows[0] if workflows else {}
                        status = latest.get("status", "unknown")
                        conclusion = latest.get("conclusion", "unknown")
                        log_step("STEP5", f"Workflow status check {i+1}/12", {
                            "status": status,
                            "conclusion": conclusion
                        })
                        
                        if status == "completed":
                            log_step("SUCCESS", f"Workflow completed: {conclusion}")
                            break
                
                # Step 6: Check for reward score comment
                log_step("STEP6", "Checking for reward score comment...")
                time.sleep(30)  # Wait for comment
                
                comments_output, comments_code = run_command(["gh", "pr", "view", pr_number, "--json", "comments"])
                if comments_code == 0:
                    try:
                        pr_data = json.loads(comments_output)
                        comments = pr_data.get("comments", [])
                        reward_comments = [c for c in comments if "REWARD_SCORE" in c.get("body", "")]
                        if reward_comments:
                            log_step("SUCCESS", f"Found {len(reward_comments)} reward score comment(s)")
                            for comment in reward_comments:
                                log_step("REWARD_SCORE", "Reward score comment", {
                                    "body_preview": comment.get("body", "")[:200]
                                })
                        else:
                            log_step("WARNING", "No reward score comment found yet")
                    except Exception as e:
                        log_step("ERROR", "Failed to parse comments", {"error": str(e)})
                
                log_step("COMPLETE", f"Monitoring complete for PR #{pr_number}")
            else:
                log_step("WARNING", "No PRs found")
        except Exception as e:
            log_step("ERROR", "Failed to parse PR list", {"error": str(e)})
    else:
        log_step("ERROR", "Failed to get PR list", {"code": code})
    
    log_step("END", "Auto-PR monitoring ended")

if __name__ == "__main__":
    main()




