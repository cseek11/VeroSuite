#!/usr/bin/env python3
"""Regression tests for monitor_changes datetime handling."""

import sys
import unittest
from datetime import datetime, timedelta, UTC
from pathlib import Path

# Ensure monitor_changes module is importable
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import monitor_changes  # noqa: E402


class TestMonitorChangesDateTime(unittest.TestCase):
    """Verify datetime parsing and trigger logic for monitor_changes."""

    def setUp(self) -> None:
        self.base_config = {
            "time_based": {
                "enabled": True,
                "inactivity_hours": 1,
                "max_work_hours": 2,
            }
        }

    def test_double_timezone_suffix_is_handled(self) -> None:
        """check_time_based_trigger should accept '+00:00+00:00' timestamps."""
        now = datetime.now(UTC)
        state = {
            "tracked_files": {},
            "last_change_time": (now - timedelta(hours=5)).isoformat() + "+00:00",
            "first_change_time": (now - timedelta(hours=10)).isoformat() + "+00:00",
        }

        result = monitor_changes.check_time_based_trigger(state, self.base_config)
        self.assertTrue(result, "Double timezone suffix should be parsed successfully")

    def test_z_suffix_is_handled_without_exception(self) -> None:
        """Timestamps ending with 'Z' should be supported."""
        now = datetime.now(UTC)
        z_timestamp = (now - timedelta(minutes=30)).isoformat().replace("+00:00", "Z")
        state = {
            "tracked_files": {},
            "last_change_time": z_timestamp,
            "first_change_time": None,
        }

        result = monitor_changes.check_time_based_trigger(state, self.base_config)
        self.assertFalse(
            result,
            "Recent Z-suffix timestamp should not trigger inactivity threshold",
        )

    def test_timezone_aware_comparison_does_not_raise(self) -> None:
        """Timezone-aware datetimes should compare without errors."""
        now = datetime.now(UTC)
        state = {
            "tracked_files": {},
            "last_change_time": (now - timedelta(hours=2)).isoformat(),
            "first_change_time": (now - timedelta(hours=4)).isoformat(),
        }

        # Should not raise TypeError when comparing aware datetimes
        result = monitor_changes.check_time_based_trigger(state, self.base_config)
        self.assertTrue(result)


if __name__ == "__main__":  # pragma: no cover
    unittest.main()

