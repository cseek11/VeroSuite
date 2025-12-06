#!/usr/bin/env python3
"""
Updates .cursor/patterns/patterns_index.md by scanning all pattern files.
"""
import os
from datetime import datetime

BASE = ".cursor/patterns"
INDEX = os.path.join(BASE, "patterns_index.md")


def collect_patterns():
    entries = []
    for root, dirs, files in os.walk(BASE):
        for f in files:
            if f.endswith(".md") and f not in ["patterns_index.md", "README.md", "anti_patterns.md"]:
                full = os.path.join(root, f)
                rel = os.path.relpath(full, BASE)
                modified = datetime.fromtimestamp(os.path.getmtime(full))
                entries.append((rel, modified))
    return sorted(entries)


def write_index(patterns):
    with open(INDEX, "w", encoding="utf-8") as out:
        out.write("# Patterns Index\n")
        out.write(f"_Last updated: {datetime.utcnow().isoformat()}Z_\n\n")
        for rel, modified in patterns:
            out.write(f"- **{rel}** — last modified **{modified.date()}**\n")


if __name__ == "__main__":
    patterns = collect_patterns()
    write_index(patterns)
    print("Updated patterns_index.md")

