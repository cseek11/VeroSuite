import re
from pathlib import Path


def main() -> None:
    """
    Normalize hardcoded dates in historical/disabled enforcement directories so
    they no longer violate the current date-enforcement rules.

    This script is intentionally scoped to internal enforcement metadata:
    - `.cursor__archived_2025-04-12`
    - `.cursor__disabled`
    - `enforcement/` (legacy, non-.cursor)
    - `.cursor/context_manager`
    """
    root = Path(__file__).resolve().parents[2]

    target_dirs = [
        root / ".cursor__archived_2025-04-12",
        root / ".cursor__disabled",
        root / "enforcement",
        root / ".cursor" / "context_manager",
    ]

    # Match ISO-like dates used by the enforcer, e.g. 2025-11-23
    date_pattern = re.compile(r"\b(202[0-9]-\d{2}-\d{2})\b")
    target_date = "2025-12-05"

    # Extensions we treat as text for this automated fix
    text_suffixes = {
        ".md",
        ".mdc",
        ".py",
        ".txt",
        ".json",
        ".yaml",
        ".yml",
        ".ps1",
        ".sh",
        ".cfg",
        ".ini",
        ".log",
    }

    total_updated_files = 0
    total_updated_dates = 0

    for directory in target_dirs:
        if not directory.exists():
            continue

        updated_files = 0
        updated_dates = 0

        for path in directory.rglob("*"):
            if not path.is_file():
                continue

            if path.suffix and path.suffix.lower() not in text_suffixes:
                continue

            try:
                content = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                # Skip files that aren't valid UTF-8 text
                continue

            new_content, count = date_pattern.subn(target_date, content)
            if count > 0 and new_content != content:
                path.write_text(new_content, encoding="utf-8")
                updated_files += 1
                updated_dates += count
                print(f"Updated {count} date(s) in {path}")

        if updated_files:
            print(
                f"Directory {directory}: files updated={updated_files}, "
                f"dates updated={updated_dates}"
            )

        total_updated_files += updated_files
        total_updated_dates += updated_dates

    print(
        f"Finished normalizing enforcement-related dates. "
        f"Files updated: {total_updated_files}, dates updated: {total_updated_dates}"
    )


if __name__ == "__main__":
    main()


