#!/usr/bin/env python3
"""
Monitor Auto-PR process from creation to CI completion.
Logs all steps and errors for debugging.
"""

import json
import subprocess
import time
import sys
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional

LOG_FILE = Path(".cursor/scripts/auto_pr_process.log")

def log(step: str, message: str, data: Optional[Dict] = None, level: str = "INFO"):
    """Log a monitoring step."""
    timestamp = datetime.now().isoformat()
    log_entry = {
        "timestamp": timestamp,
        "level": level,
        "step": step,
        "message": message,
        "data": data or {}
    }
    
    # Write to log file
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(log_entry) + "\n")
    
    # Also print
    print(f"[{timestamp}] [{level}] {step}: {message}")
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
        log("ERROR", f"Command timed out: {' '.join(cmd)}", {"error": str(e)}, "ERROR")
        return "", 1
    except Exception as e:
        log("ERROR", f"Command failed: {' '.join(cmd)}", {"error": str(e)}, "ERROR")
        return "", 1

def check_pr_details(pr_number: str) -> Dict:
    """Get PR details including body."""
    output, code = run_command([
        "gh", "pr", "view", pr_number,
        "--json", "number,title,state,body,comments,labels,createdAt"
    ])
    if code == 0:
        try:
            return json.loads(output)
        except:
            return {}
    return {}

def check_workflow_runs(pr_number: str) -> List[Dict]:
    """Check workflow runs for PR."""
    output, code = run_command([
        "gh", "run", "list",
        "--workflow=swarm_compute_reward_score.yml",
        "--limit", "10",
        "--json", "databaseId,status,conclusion,createdAt,displayTitle,headBranch"
    ])
    if code == 0:
        try:
            runs = json.loads(output)
            # Filter by PR number if possible
            return runs
        except:
            return []
    return []

def check_reward_score_comment(pr_number: str) -> Optional[Dict]:
    """Check for reward score comment on PR."""
    pr_data = check_pr_details(pr_number)
    if not pr_data:
        return None
    
    comments = pr_data.get("comments", [])
    for comment in comments:
        body = comment.get("body", "")
        if "REWARD_SCORE" in body or "Reward Score" in body:
            return {
                "found": True,
                "body_preview": body[:500],
                "author": comment.get("author", {}).get("login", "unknown"),
                "createdAt": comment.get("createdAt", "")
            }
    
    return {"found": False}

def main():
    """Main monitoring function."""
    log("START", "Auto-PR process monitoring started")
    
    # Get latest PRs
    log("STEP1", "Fetching latest PRs")
    output, code = run_command(["gh", "pr", "list", "--limit", "5", "--json", "number,title,state,createdAt"])
    if code != 0:
        log("ERROR", "Failed to get PR list", {"code": code}, "ERROR")
        return
    
    try:
        prs = json.loads(output)
        log("STEP1", f"Found {len(prs)} recent PRs")
        
        # Focus on the most recent Auto-PR (PR #356 or #357)
        auto_prs = [pr for pr in prs if "auto-pr" in pr.get("title", "").lower() or pr.get("number", 0) >= 354]
        
        if not auto_prs:
            log("WARNING", "No Auto-PRs found in recent PRs")
            return
        
        # Monitor the most recent one
        target_pr = auto_prs[0]
        pr_number = str(target_pr["number"])
        log("STEP2", f"Monitoring PR #{pr_number}", {"title": target_pr.get("title")})
        
        # Step 3: Check PR body for compliance section
        log("STEP3", "Checking PR body for compliance section")
        pr_details = check_pr_details(pr_number)
        if pr_details:
            body = pr_details.get("body", "")
            has_compliance = "## Enforcement Pipeline Compliance" in body
            
            # Extract compliance section if present
            compliance_section = ""
            if has_compliance:
                start_idx = body.find("## Enforcement Pipeline Compliance")
                if start_idx >= 0:
                    compliance_section = body[start_idx:start_idx+1000]  # First 1000 chars
            
            log("STEP3", "PR body analysis", {
                "has_compliance_section": has_compliance,
                "body_length": len(body),
                "compliance_section_preview": compliance_section[:200] if compliance_section else None
            })
            
            if has_compliance:
                log("SUCCESS", "Compliance section found in PR body", {}, "SUCCESS")
                
                # Verify all 5 steps
                steps_found = {
                    "step1": "Step 1: Search & Discovery" in body,
                    "step2": "Step 2: Pattern Analysis" in body,
                    "step3": "Step 3: Compliance Check" in body,
                    "step4": "Step 4: Implementation Plan" in body,
                    "step5": "Step 5: Post-Implementation Audit" in body
                }
                log("STEP3", "Compliance steps verification", steps_found)
            else:
                log("ERROR", "Compliance section NOT found in PR body", {}, "ERROR")
        else:
            log("ERROR", "Failed to get PR details", {}, "ERROR")
        
        # Step 4: Monitor CI workflows
        log("STEP4", "Monitoring CI workflows...")
        for i in range(12):  # Check for 2 minutes
            time.sleep(10)
            workflows = check_workflow_runs(pr_number)
            if workflows:
                latest = workflows[0] if workflows else {}
                status = latest.get("status", "unknown")
                conclusion = latest.get("conclusion", "unknown")
                log("STEP4", f"Workflow check {i+1}/12", {
                    "status": status,
                    "conclusion": conclusion,
                    "title": latest.get("displayTitle", ""),
                    "branch": latest.get("headBranch", "")
                })
                
                if status == "completed":
                    log("SUCCESS", f"Workflow completed: {conclusion}", {}, "SUCCESS")
                    break
            else:
                log("STEP4", f"Workflow check {i+1}/12 - No workflows found yet")
        
        # Step 5: Check for reward score comment
        log("STEP5", "Checking for reward score comment...")
        time.sleep(30)  # Wait for comment
        
        reward_comment = check_reward_score_comment(pr_number)
        if reward_comment and reward_comment.get("found"):
            log("SUCCESS", "Reward score comment found", {
                "author": reward_comment.get("author"),
                "preview": reward_comment.get("body_preview", "")[:300]
            }, "SUCCESS")
        else:
            log("WARNING", "Reward score comment not found yet", {}, "WARNING")
        
        # Step 6: Final summary
        log("STEP6", "Final summary", {
            "pr_number": pr_number,
            "has_compliance_section": has_compliance if pr_details else False,
            "workflow_status": latest.get("status", "unknown") if workflows else "unknown",
            "reward_comment_found": reward_comment.get("found") if reward_comment else False
        })
        
        log("COMPLETE", f"Monitoring complete for PR #{pr_number}")
        
    except Exception as e:
        log("ERROR", "Monitoring error", {"error": str(e), "type": type(e).__name__}, "ERROR")
    
    log("END", "Auto-PR process monitoring ended")

if __name__ == "__main__":
    main()




