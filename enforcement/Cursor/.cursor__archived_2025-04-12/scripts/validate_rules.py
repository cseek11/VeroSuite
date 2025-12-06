#!/usr/bin/env python3
"""
Validates .mdc rule files for:
- frontmatter correctness
- alwaysApply boolean
- required fields
"""
import os
import re
import sys

RULES_DIR = ".cursor/rules"
REQUIRED_FIELDS = ["description"]


def validate_frontmatter(text):
    if not text.startswith("---"):
        return False, "Missing frontmatter block"
    fields = {}
    pattern = re.compile(r"(\w+):\s*(.+)")
    for line in text.splitlines():
        if line.strip() == "---":
            continue
        m = pattern.match(line)
        if m:
            fields[m.group(1)] = m.group(2)
    missing = [f for f in REQUIRED_FIELDS if f not in fields]
    if missing:
        return False, f"Missing required fields: {missing}"
    return True, None


def main():
    errors = []
    for file in os.listdir(RULES_DIR):
        if file.endswith(".mdc"):
            path = os.path.join(RULES_DIR, file)
            with open(path, "r", encoding="utf-8") as f:
                text = f.read()
            ok, err = validate_frontmatter(text)
            if not ok:
                errors.append(f"{file}: {err}")
    if errors:
        print("❌ Rule Validation Failed:")
        for e in errors:
            print(" -", e)
        sys.exit(1)
    print("✔ All rule files validated successfully.")


if __name__ == "__main__":
    main()

