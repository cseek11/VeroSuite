#!/usr/bin/env python3
"""Analyze recent PR scores to identify issues"""
import json
from pathlib import Path

reward_scores_path = Path("docs/metrics/reward_scores.json")

with open(reward_scores_path, "r", encoding="utf-8") as f:
    data = json.load(f)

scores = data.get("scores", [])
recent = sorted(scores, key=lambda x: x.get("timestamp", ""), reverse=True)[:20]

print(f"Total PRs: {len(scores)}")
print(f"\nRecent 20 PR scores:")
print("PR# | Score | Penalties | Security | Tests | Notes")
print("-" * 80)

for s in recent:
    pr = s.get("pr", "N/A")
    score = s.get("score", 0)
    breakdown = s.get("breakdown", {})
    penalties = breakdown.get("penalties", 0)
    security = breakdown.get("security", 0)
    tests = breakdown.get("tests", 0)
    notes = s.get("notes", "")
    
    # Extract penalty note
    penalty_note = ""
    if "Penalties:" in notes:
        penalty_line = [line for line in notes.split("\n") if "Penalties:" in line]
        if penalty_line:
            penalty_note = penalty_line[0].replace("Penalties: ", "")[:50]
    
    print(f"{pr:4} | {score:5} | {penalties:9} | {security:8} | {tests:5} | {penalty_note}")

# Count -6 scores
minus_six = [s for s in scores if s.get("score") == -6]
print(f"\nTotal PRs with score -6: {len(minus_six)}")
print(f"Percentage: {len(minus_six)/len(scores)*100:.1f}%")

# Analyze -6 breakdowns
if minus_six:
    print("\nBreakdown of -6 scores (recent 10):")
    recent_minus_six = sorted(minus_six, key=lambda x: x.get("timestamp", ""), reverse=True)[:10]
    for s in recent_minus_six:
        pr = s.get("pr", "N/A")
        breakdown = s.get("breakdown", {})
        print(f"PR {pr}: penalties={breakdown.get('penalties', 0)}, security={breakdown.get('security', 0)}, tests={breakdown.get('tests', 0)}")

