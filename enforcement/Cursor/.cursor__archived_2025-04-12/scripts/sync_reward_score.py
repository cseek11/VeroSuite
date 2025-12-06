#!/usr/bin/env python3
"""
Syncs CI Reward Score artifacts into .cursor/ for local developer tooling.
"""
import json
import os
import shutil

CI_PATH = "ci_artifacts/reward_score.json"
LOCAL_PATH = ".cursor/reward_score.json"


def main():
    if not os.path.exists(CI_PATH):
        print("No CI reward score found.")
        return
    shutil.copyfile(CI_PATH, LOCAL_PATH)
    print(f"Copied reward score → {LOCAL_PATH}")


if __name__ == "__main__":
    main()

