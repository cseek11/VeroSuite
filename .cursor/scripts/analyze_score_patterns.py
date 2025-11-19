#!/usr/bin/env python3
"""
Analyze reward score patterns to investigate trends like -6 and -4 scores.
"""

import json
import sys
from pathlib import Path
from collections import Counter, defaultdict
from datetime import datetime

# Import to use the same path
sys.path.insert(0, str(Path(__file__).parent))
from analyze_reward_trends import REWARD_SCORES_PATH


def analyze_score_patterns():
    """Analyze score distribution and patterns."""
    # Load reward scores
    with open(REWARD_SCORES_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    scores = data.get("scores", [])
    
    print("=" * 80)
    print("REWARD SCORE PATTERN ANALYSIS")
    print("=" * 80)
    print(f"\nTotal PRs analyzed: {len(scores)}\n")
    
    # Score distribution
    score_values = [s.get("score", 0) for s in scores]
    score_counter = Counter(score_values)
    
    print("SCORE DISTRIBUTION:")
    print("-" * 80)
    for score in sorted(score_counter.keys(), reverse=True):
        count = score_counter[score]
        percentage = (count / len(scores)) * 100
        bar = "#" * int(percentage / 2)
        print(f"  {score:4d}: {count:3d} PRs ({percentage:5.1f}%) {bar}")
    
    # Focus on -6 and -4 scores
    print("\n" + "=" * 80)
    print("ANALYSIS OF -6 AND -4 SCORES")
    print("=" * 80)
    
    negative_six = [s for s in scores if s.get("score") == -6]
    negative_four = [s for s in scores if s.get("score") == -4]
    
    print(f"\n-6 Scores: {len(negative_six)} PRs")
    print(f"-4 Scores: {len(negative_four)} PRs")
    
    # Analyze breakdown for -6 scores
    if negative_six:
        print("\n" + "-" * 80)
        print("BREAKDOWN OF -6 SCORES:")
        print("-" * 80)
        
        breakdowns = [s.get("breakdown", {}) for s in negative_six]
        
        # Aggregate breakdown components
        agg_breakdown = defaultdict(int)
        for bd in breakdowns:
            for key, value in bd.items():
                agg_breakdown[key] += value
        
        print("\nAverage breakdown per -6 score:")
        for key in ["tests", "bug_fix", "docs", "performance", "security", "penalties"]:
            avg = agg_breakdown.get(key, 0) / len(negative_six)
            print(f"  {key:12s}: {avg:6.2f}")
        
        # Show recent -6 scores with details
        print("\nRecent -6 scores (last 10):")
        recent_minus_six = sorted(negative_six, key=lambda x: x.get("timestamp", ""), reverse=True)[:10]
        for s in recent_minus_six:
            pr = s.get("pr", "unknown")
            timestamp = s.get("timestamp", "unknown")
            breakdown = s.get("breakdown", {})
            print(f"\n  PR #{pr} ({timestamp})")
            print(f"    Breakdown: {breakdown}")
            print(f"    Total: {sum(breakdown.values())}")
    
    # Analyze breakdown for -4 scores
    if negative_four:
        print("\n" + "-" * 80)
        print("BREAKDOWN OF -4 SCORES:")
        print("-" * 80)
        
        breakdowns = [s.get("breakdown", {}) for s in negative_four]
        
        # Aggregate breakdown components
        agg_breakdown = defaultdict(int)
        for bd in breakdowns:
            for key, value in bd.items():
                agg_breakdown[key] += value
        
        print("\nAverage breakdown per -4 score:")
        for key in ["tests", "bug_fix", "docs", "performance", "security", "penalties"]:
            avg = agg_breakdown.get(key, 0) / len(negative_four)
            print(f"  {key:12s}: {avg:6.2f}")
        
        # Show recent -4 scores with details
        print("\nRecent -4 scores (last 10):")
        recent_minus_four = sorted(negative_four, key=lambda x: x.get("timestamp", ""), reverse=True)[:10]
        for s in recent_minus_four:
            pr = s.get("pr", "unknown")
            timestamp = s.get("timestamp", "unknown")
            breakdown = s.get("breakdown", {})
            print(f"\n  PR #{pr} ({timestamp})")
            print(f"    Breakdown: {breakdown}")
            print(f"    Total: {sum(breakdown.values())}")
    
    # Check for batch patterns (consecutive -6 or -4 scores)
    print("\n" + "=" * 80)
    print("BATCH PATTERN ANALYSIS")
    print("=" * 80)
    
    # Sort by timestamp
    sorted_scores = sorted(scores, key=lambda x: x.get("timestamp", ""))
    
    # Find consecutive runs of -6 or -4
    consecutive_minus_six = []
    consecutive_minus_four = []
    current_run = []
    current_score = None
    
    for s in sorted_scores:
        score = s.get("score", 0)
        if score == -6:
            if current_score == -6:
                current_run.append(s)
            else:
                if len(current_run) > 1:
                    consecutive_minus_six.append(current_run)
                current_run = [s]
                current_score = -6
        elif score == -4:
            if current_score == -4:
                current_run.append(s)
            else:
                if len(current_run) > 1:
                    consecutive_minus_four.append(current_run)
                current_run = [s]
                current_score = -4
        else:
            if len(current_run) > 1:
                if current_score == -6:
                    consecutive_minus_six.append(current_run)
                elif current_score == -4:
                    consecutive_minus_four.append(current_run)
            current_run = []
            current_score = None
    
    # Check final run
    if len(current_run) > 1:
        if current_score == -6:
            consecutive_minus_six.append(current_run)
        elif current_score == -4:
            consecutive_minus_four.append(current_run)
    
    print(f"\nConsecutive -6 score batches: {len(consecutive_minus_six)}")
    for i, batch in enumerate(consecutive_minus_six[:5], 1):
        print(f"\n  Batch {i}: {len(batch)} consecutive -6 scores")
        print(f"    PRs: {', '.join([str(s.get('pr', '?')) for s in batch])}")
        print(f"    Date range: {batch[0].get('timestamp', '?')} to {batch[-1].get('timestamp', '?')}")
    
    print(f"\nConsecutive -4 score batches: {len(consecutive_minus_four)}")
    for i, batch in enumerate(consecutive_minus_four[:5], 1):
        print(f"\n  Batch {i}: {len(batch)} consecutive -4 scores")
        print(f"    PRs: {', '.join([str(s.get('pr', '?')) for s in batch])}")
        print(f"    Date range: {batch[0].get('timestamp', '?')} to {batch[-1].get('timestamp', '?')}")
    
    # Analyze what's causing the negative scores
    print("\n" + "=" * 80)
    print("ROOT CAUSE ANALYSIS")
    print("=" * 80)
    
    all_negative = [s for s in scores if s.get("score", 0) < 0]
    print(f"\nTotal negative scores: {len(all_negative)}")
    
    # What categories are causing negatives?
    negative_causes = defaultdict(int)
    for s in all_negative:
        breakdown = s.get("breakdown", {})
        for key, value in breakdown.items():
            if value < 0:
                negative_causes[key] += abs(value)
    
    print("\nCategories causing negative scores (total negative points):")
    for key, total in sorted(negative_causes.items(), key=lambda x: x[1], reverse=True):
        print(f"  {key:12s}: {total:6d} total negative points")
    
    # Security-specific analysis
    security_negatives = [s for s in all_negative if s.get("breakdown", {}).get("security", 0) < 0]
    print(f"\nPRs with negative security scores: {len(security_negatives)}")
    if security_negatives:
        security_scores = [s.get("breakdown", {}).get("security", 0) for s in security_negatives]
        print(f"  Security score range: {min(security_scores)} to {max(security_scores)}")
        print(f"  Average security score: {sum(security_scores) / len(security_scores):.2f}")
    
    # Penalty-specific analysis
    penalty_negatives = [s for s in all_negative if s.get("breakdown", {}).get("penalties", 0) < 0]
    print(f"\nPRs with penalties: {len(penalty_negatives)}")
    if penalty_negatives:
        penalty_scores = [s.get("breakdown", {}).get("penalties", 0) for s in penalty_negatives]
        print(f"  Penalty range: {min(penalty_scores)} to {max(penalty_scores)}")
        print(f"  Average penalty: {sum(penalty_scores) / len(penalty_scores):.2f}")


if __name__ == "__main__":
    analyze_score_patterns()

