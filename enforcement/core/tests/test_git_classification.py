import types
from pathlib import Path

import pytest

from enforcement.core.git_utils import GitUtils


def make_git_utils(monkeypatch, status_output, diff_outputs, cached_changed=None):
    gu = GitUtils(Path("."))

    def run_git_command(args):
        if "--name-status" in args:
            return status_output
        if args[:2] == ["ls-files", "--others"]:
            return "u.txt"
        if args[:2] == ["ls-files", "--error-unmatch"]:
            return "tracked" if args[-1] == "a.txt" else ""
        if args and args[0] == "diff" and args[-1] in diff_outputs:
            return diff_outputs[args[-1]]
        return ""

    gu.run_git_command = run_git_command  # type: ignore
    if cached_changed:
        gu._cached_changed_files = cached_changed  # type: ignore
        gu._changed_files_cache_key = "key"  # type: ignore
    return gu


def test_classifies_modify_and_new(monkeypatch):
    status_output = "M\ta.txt\nA\tb.txt\n"
    diff_outputs = {"a.txt": "diff"}
    gu = make_git_utils(monkeypatch, status_output, diff_outputs, {"tracked": ["a.txt"], "untracked": ["u.txt"]})

    classifications = gu.get_changed_file_classifications()
    assert classifications.get("a.txt") == "CONTENT_CHANGED"
    assert classifications.get("b.txt") == "NEW_FILE"
    assert classifications.get("u.txt") == "NEW_FILE"


def test_classifies_rename_move_only(monkeypatch):
    status_output = "R100\told.txt\tnew.txt\n"
    diff_outputs = {"new.txt": ""}  # empty diff means move-only
    gu = make_git_utils(monkeypatch, status_output, diff_outputs)

    classifications = gu.get_changed_file_classifications()
    assert classifications.get("new.txt") == "MOVED_OR_RENAMED_ONLY"


def test_classifies_rename_with_changes(monkeypatch):
    status_output = "R100\told.txt\tnew.txt\n"
    diff_outputs = {"new.txt": "diff"}
    gu = make_git_utils(monkeypatch, status_output, diff_outputs)

    classifications = gu.get_changed_file_classifications()
    assert classifications.get("new.txt") == "CONTENT_CHANGED"

