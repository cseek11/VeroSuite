from pathlib import Path
from typing import List

try:
    import yaml
except ImportError:  # pragma: no cover
    yaml = None


DEFAULT_PATTERNS: List[str] = [
    ".cursor__archived_2025-04-12/**",
    "docs/archive/**",
    ".ai/memory_bank/**",
    ".ai/rules/**",
    ".ai/patterns/**",
]

HISTORICAL_CONFIG_PATH = Path(".cursor/enforcement/historical_paths.yaml")


def _load_config_patterns() -> List[str]:
    if not HISTORICAL_CONFIG_PATH.exists() or yaml is None:
        return []
    try:
        data = yaml.safe_load(HISTORICAL_CONFIG_PATH.read_text())
        if isinstance(data, list):
            return [str(p) for p in data]
    except Exception:
        return []
    return []


def get_historical_patterns() -> List[str]:
    return DEFAULT_PATTERNS + _load_config_patterns()


def is_historical_path(path_str: str) -> bool:
    """
    Check whether the given path matches known historical/archival patterns.
    """
    from fnmatch import fnmatch

    patterns = get_historical_patterns()
    normalized = path_str.replace("\\", "/")
    for pattern in patterns:
        if fnmatch(normalized, pattern):
            return True
    return False


