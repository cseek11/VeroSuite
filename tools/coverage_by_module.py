import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
COVERAGE_FILE = ROOT / "apps" / "api" / "coverage" / "coverage-final.json"
OUT_JSON = ROOT / "docs" / "migration" / "coverage-modules.json"
OUT_TXT = ROOT / "docs" / "migration" / "coverage-modules.txt"


def main() -> None:
    data = json.loads(COVERAGE_FILE.read_text())
    agg = defaultdict(lambda: {"covered": 0, "total": 0})

    for path, cov in data.items():
        match = re.search(r"src[\\/](.+?)[\\/]", path)
        if not match:
            continue
        module = match.group(1)
        agg[module]["covered"] += cov["lines"]["covered"]
        agg[module]["total"] += cov["lines"]["total"]

    rows = []
    for module, stats in agg.items():
        covered = stats["covered"]
        total = stats["total"]
        pct = round((covered / total) * 100, 2) if total else 0.0
        rows.append({"module": module, "pct": pct, "covered": covered, "total": total})

    rows.sort(key=lambda r: r["module"])

    OUT_JSON.write_text(json.dumps(rows, indent=2))
    OUT_TXT.write_text(
        "\n".join(f"{r['module']}\t{r['pct']}% ({r['covered']}/{r['total']})" for r in rows)
    )


if __name__ == "__main__":
    main()

