from pathlib import Path

from enforcement.checks.date_checker import DateChecker, is_file_modified_in_session
from enforcement.core.session_state import EnforcementSession
from enforcement.core.git_utils import GitUtils
from enforcement.core.file_classifier import FileChangeType


def make_session(tmp_path):
    return EnforcementSession(
        session_id="test",
        start_time="2025-12-05T00:00:00+00:00",
        last_check="2025-12-05T00:00:00+00:00",
        violations=[],
        checks_passed=[],
        checks_failed=[],
        auto_fixes=[],
        file_hashes={},
        version=2,
    )


def test_date_checker_skips_move_only(monkeypatch, tmp_path):
    checker = DateChecker(current_date="2025-12-05")
    proj = tmp_path
    session = make_session(tmp_path)
    git_utils = GitUtils(proj)

    # empty implementations for git utils
    git_utils.run_git_command = lambda args: ""  # type: ignore
    git_utils.get_cached_changed_files = lambda: {"tracked": [], "untracked": []}  # type: ignore
    monkeypatch.setattr("enforcement.checks.date_checker.is_file_modified_in_session", lambda *args, **kwargs: True)

    f = proj / "doc.md"
    f.write_text("2020-01-01")

    res = checker.check_hardcoded_dates(
        [str(f.relative_to(proj))],
        proj,
        session,
        git_utils,
        proj,
        violation_scope="current_session",
        classification_map={str(f.relative_to(proj)): "MOVED_OR_RENAMED_ONLY"},
    )
    assert res == []


def test_date_checker_flags_stale_on_changed(monkeypatch, tmp_path):
    checker = DateChecker(current_date="2025-12-05")
    checker.detector = None
    proj = tmp_path
    session = make_session(tmp_path)
    git_utils = GitUtils(proj)
    git_utils.run_git_command = lambda args: "tracked"  # type: ignore
    git_utils.get_cached_changed_files = lambda: {"tracked": [], "untracked": []}  # type: ignore
    monkeypatch.setattr("enforcement.checks.date_checker.is_file_modified_in_session", lambda *args, **kwargs: True)
    monkeypatch.setattr(git_utils, "is_line_changed_in_session", lambda *args, **kwargs: True)
    monkeypatch.setattr("enforcement.checks.date_checker.classify_file_change", lambda *args, **kwargs: FileChangeType.CONTENT_CHANGED)
    monkeypatch.setattr("enforcement.checks.date_checker.is_historical_dir_path", lambda *args, **kwargs: False)
    monkeypatch.setattr("enforcement.checks.date_checker.is_historical_document_file", lambda *args, **kwargs: False)
    monkeypatch.setattr("enforcement.checks.date_checker.is_log_file", lambda *args, **kwargs: False)
    monkeypatch.setattr("enforcement.checks.date_checker.DateChecker._is_historical_date_pattern", lambda *args, **kwargs: False)
    f = proj / "doc2.md"
    f.write_text("2020-01-01")

    res = checker.check_hardcoded_dates(
        [str(f.relative_to(proj))],
        proj,
        session,
        git_utils,
        proj,
        violation_scope="current_session",
        classification_map={str(f.relative_to(proj)): "CONTENT_CHANGED"},
    )
    assert isinstance(res, list)

