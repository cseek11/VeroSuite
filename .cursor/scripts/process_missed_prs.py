#!/usr/bin/env python3
"""
Manually process missed PR reward scores that weren't added to metrics.
Downloads artifacts from old workflow runs and adds them to metrics.
"""
import json
import sys
import subprocess
import tempfile
import os
from pathlib import Path

# PRs that were missed
MISSED_PRS = [
    {"pr": "1763485868", "run_id": "19474738290"},
    {"pr": "1763485424", "run_id": "19474509232"},
    {"pr": "1763482688", "run_id": "19473108392"},
]

METRICS_FILE = Path(__file__).parent.parent.parent / "docs" / "metrics" / "reward_scores.json"


def download_artifact(run_id: str, artifact_name: str, output_dir: Path) -> Path:
    """Download artifact from GitHub Actions run."""
    print(f"Downloading artifact '{artifact_name}' from run {run_id}...")
    
    # Use GitHub CLI to download artifact
    cmd = [
        "gh", "run", "download", run_id,
        "--name", artifact_name,
        "--dir", str(output_dir)
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error downloading artifact: {result.stderr}")
        return None
    
    # Find the reward.json file
    reward_file = output_dir / artifact_name / "reward.json"
    if not reward_file.exists():
        # Try alternative location
        reward_file = output_dir / "reward.json"
    
    if reward_file.exists():
        print(f"✓ Found reward.json at {reward_file}")
        return reward_file
    else:
        print(f"✗ reward.json not found in downloaded artifact")
        return None


def load_metrics() -> dict:
    """Load existing metrics file."""
    if METRICS_FILE.exists():
        with open(METRICS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    else:
        return {
            "version": "1.0",
            "scores": [],
            "aggregates": {
                "total_prs": 0,
                "average_score": 0.0,
                "trends": [],
                "category_performance": {},
                "anti_patterns": []
            },
            "last_updated": None
        }


def save_metrics(metrics: dict):
    """Save metrics file."""
    from datetime import datetime
    metrics["last_updated"] = datetime.utcnow().isoformat() + "Z"
    
    METRICS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(METRICS_FILE, "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)
    
    print(f"✓ Saved metrics to {METRICS_FILE}")


def process_reward_file(reward_file: Path, pr_num: str) -> dict:
    """Process reward.json file and extract score data."""
    with open(reward_file, "r", encoding="utf-8") as f:
        reward_data = json.load(f)
    
    # Extract score data
    score_entry = {
        "pr": pr_num,
        "score": reward_data.get("score", 0),
        "breakdown": reward_data.get("breakdown", {}),
        "timestamp": reward_data.get("metadata", {}).get("computed_at", ""),
        "author": reward_data.get("metadata", {}).get("author", "unknown")
    }
    
    return score_entry


def main():
    """Main function."""
    print("=" * 60)
    print("Processing Missed PR Reward Scores")
    print("=" * 60)
    
    # Load existing metrics
    metrics = load_metrics()
    existing_prs = {entry["pr"] for entry in metrics.get("scores", [])}
    
    print(f"\nCurrent metrics: {len(metrics.get('scores', []))} PRs")
    print(f"Existing PRs: {sorted(existing_prs)}")
    
    # Process each missed PR
    processed = 0
    with tempfile.TemporaryDirectory() as tmpdir:
        tmp_path = Path(tmpdir)
        
        for pr_info in MISSED_PRS:
            pr_num = pr_info["pr"]
            run_id = pr_info["run_id"]
            
            if pr_num in existing_prs:
                print(f"\n⏭️  PR #{pr_num} already in metrics, skipping")
                continue
            
            print(f"\n📦 Processing PR #{pr_num} (run {run_id})...")
            
            # Try old artifact name first
            reward_file = download_artifact(run_id, "reward", tmp_path / f"pr_{pr_num}")
            
            if not reward_file or not reward_file.exists():
                print(f"✗ Failed to download artifact for PR #{pr_num}")
                continue
            
            # Process reward file
            try:
                score_entry = process_reward_file(reward_file, pr_num)
                metrics["scores"].append(score_entry)
                processed += 1
                print(f"✓ Added PR #{pr_num} to metrics (score: {score_entry['score']})")
            except Exception as e:
                print(f"✗ Error processing PR #{pr_num}: {e}")
                continue
    
    if processed > 0:
        # Update aggregates (simplified - full aggregation would require collect_metrics.py)
        scores = metrics.get("scores", [])
        metrics["aggregates"]["total_prs"] = len(scores)
        if scores:
            metrics["aggregates"]["average_score"] = sum(e.get("score", 0) for e in scores) / len(scores)
        
        # Save metrics
        save_metrics(metrics)
        print(f"\n✅ Successfully processed {processed} PR(s)")
        print(f"Total PRs in metrics: {len(scores)}")
    else:
        print("\n⚠️  No new PRs processed")
    
    return 0 if processed > 0 else 1


if __name__ == "__main__":
    sys.exit(main())

