#!/usr/bin/env python3
"""
Reindex local vector store for `.cursor/patterns/`.
"""

import argparse
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--path", required=True, help="Pattern directory to index")
    parser.add_argument("--out", default=".cursor/patterns.index", help="Index output path")
    args = parser.parse_args()

    pattern_dir = Path(args.path)
    files = sorted(pattern_dir.glob("*.md"))
    index_path = Path(args.out)
    index_path.write_text(
        "\n".join(str(p.resolve()) for p in files), encoding="utf-8"
    )


if __name__ == "__main__":
    main()






