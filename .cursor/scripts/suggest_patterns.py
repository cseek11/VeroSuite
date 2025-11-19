#!/usr/bin/env python3
"""
Suggestion-only helper to bundle pattern drafts into a PR.
Does not auto-merge; creates artifacts for humans.
"""

import argparse
import json
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="JSON produced by extract_patterns.py")
    parser.add_argument("--out", required=True, help="Path to suggestion markdown")
    args = parser.parse_args()

    data = json.loads(Path(args.input).read_text(encoding="utf-8"))
    lines = ["# Pattern Suggestions", ""]
    for idx, pattern in enumerate(data.get("candidates", []), start=1):
        lines.append(f"## Candidate {idx}: {pattern['pattern']}")
        lines.append(f"- WHEN: {pattern['when']}")
        lines.append(f"- DO: {'; '.join(pattern['do'])}")
        lines.append(f"- WHY: {pattern['why']}")
        lines.append(f"- EXAMPLE: {pattern['example']}")
        meta = pattern.get("metadata", {})
        lines.append(f"- METADATA: {meta}")
        lines.append("")

    Path(args.out).write_text("\n".join(lines).strip() + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()




