#!/usr/bin/env python3
"""
Pre-flight permission check for GitHub workflow automation.

Ensures the workflow token has the minimum permissions required to
post PR comments and push metrics updates.
"""

import json
import os
import sys
import urllib.error
import urllib.request
from typing import Dict, Tuple

try:
    from logger_util import get_logger

    logger = get_logger(context="check_workflow_permissions")
except ImportError:  # pragma: no cover - fallback logger
    import logging

    logger = logging.getLogger("check_workflow_permissions")


MINIMUM_PERMISSIONS = ("push", "triage", "pull")


def fetch_repository_permissions(api_url: str, repository: str, token: str) -> Dict:
    """Fetch the permission matrix for the current workflow token."""
    url = f"{api_url}/repos/{repository}"
    request = urllib.request.Request(url)
    request.add_header("Authorization", f"Bearer {token}")
    request.add_header("Accept", "application/vnd.github+json")
    with urllib.request.urlopen(request, timeout=10) as response:
        return json.loads(response.read().decode("utf-8"))


def evaluate_permissions(permissions: Dict) -> Tuple[bool, Dict[str, bool]]:
    """Determine if the required permissions are granted."""
    missing = {}
    for perm in MINIMUM_PERMISSIONS:
        missing[perm] = bool(permissions.get(perm, False))
    is_compliant = all(missing.values())
    return is_compliant, missing


def main() -> None:
    api_url = os.environ.get("GITHUB_API_URL", "https://api.github.com")
    repository = os.environ.get("GITHUB_REPOSITORY")
    token = os.environ.get("GITHUB_TOKEN")

    if not repository or not token:
        logger.error(
            "Missing GITHUB_REPOSITORY or GITHUB_TOKEN for permission check",
            operation="main",
            repository=repository,
        )
        sys.exit(0)

    try:
        repo_data = fetch_repository_permissions(api_url, repository, token)
    except urllib.error.HTTPError as error:
        logger.warn(
            "Could not determine repository permissions",
            operation="main",
            status=getattr(error, "code", None),
            reason=getattr(error, "reason", None),
        )
        print(
            "::warning::Unable to verify workflow permissions. "
            "Enable read/write permissions for the workflow token."
        )
        return

    permissions = repo_data.get("permissions", {})
    is_compliant, granted = evaluate_permissions(permissions)

    if is_compliant:
        logger.info(
            "Workflow token has the required permissions",
            operation="main",
            permissions=granted,
        )
        print("✅ Workflow token has read/write permissions")
        return

    missing = [perm for perm, allowed in granted.items() if not allowed]
    message = (
        "Workflow token is missing required permissions. "
        f"Enable read & write permissions for: {', '.join(missing)}"
    )
    logger.warn(
        message,
        operation="main",
        granted=granted,
    )
    print(f"::warning::{message}")


if __name__ == "__main__":
    main()


