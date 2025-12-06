from pathlib import Path

from enforcement.checkers.core_checker import CoreChecker
from enforcement.core.historical import HISTORICAL_CONFIG_PATH
from enforcement.checkers.base_checker import CheckerStatus


def make_checker(tmp_path):
    rule_file = tmp_path / "rule.mdc"
    rule_file.write_text("")
    checker = CoreChecker(project_root=tmp_path, rule_file=rule_file, rule_ref="02-core.mdc")
    checker.detector = None  # force fallback path
    checker.session = None
    checker.git_utils = None
    return checker


def test_skips_historical_path(tmp_path):
    checker = make_checker(tmp_path)
    hist_dir = tmp_path / ".cursor__archived_2025-04-12"
    hist_dir.mkdir()
    stale = hist_dir / "old.md"
    stale.write_text("2020-01-01")

    res = checker.check([str(stale.relative_to(tmp_path))], classification_map={str(stale.relative_to(tmp_path)): "CONTENT_CHANGED"})
    assert res.status == CheckerStatus.SUCCESS
    assert len(res.violations) == 0


def test_stale_date_on_changed_file(tmp_path):
    checker = make_checker(tmp_path)
    f = tmp_path / "doc.md"
    f.write_text("2020-01-01")
    res = checker.check([str(f.relative_to(tmp_path))], classification_map={str(f.relative_to(tmp_path)): "CONTENT_CHANGED"})
    assert res.status == CheckerStatus.FAILED
    assert len(res.violations) >= 1


def test_rename_only_skipped(tmp_path):
    checker = make_checker(tmp_path)
    f = tmp_path / "doc2.md"
    f.write_text("2020-01-01")
    res = checker.check([str(f.relative_to(tmp_path))], classification_map={str(f.relative_to(tmp_path)): "MOVED_OR_RENAMED_ONLY"})
    assert res.status == CheckerStatus.SUCCESS
    assert len(res.violations) == 0

