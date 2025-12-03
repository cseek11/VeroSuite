# Predictive Context Management System - Test Report

**Generated:** 2025-12-01T20:43:39.678497+00:00

## Summary

- **Total Tests:** 7
- **Passed:** 6
- **Failed:** 1
- **Total Errors:** 1
- **Total Warnings:** 2

## Test Results

### ✅ small_task_python_edit
- **Status:** PASSED
- **Duration:** 19.65ms
- **Warnings:** 1
  - Token usage high: 86402

### ✅ medium_task_multiple_files
- **Status:** PASSED
- **Duration:** 2.99ms

### ✅ large_task_many_files
- **Status:** PASSED
- **Duration:** 4.80ms

### ✅ context_unloading
- **Status:** PASSED
- **Duration:** 6.10ms

### ❌ file_specific_context
- **Status:** FAILED
- **Duration:** 0.00ms
- **Errors:** 1
  - Expected 2 active context files, got 0
- **Warnings:** 1
  - Database context not suggested for schema file

### ✅ state_persistence
- **Status:** PASSED
- **Duration:** 33.10ms

### ✅ prediction_accuracy
- **Status:** PASSED
- **Duration:** 4.05ms

## Context Snapshots

### Token Usage Over Time

#### Snapshot 1 - 2025-12-01T20:43:39.622767+00:00
- **Active Context:** 2 files, 84,062 tokens
- **Pre-loaded Context:** 2 files, 2,340 tokens
- **Total Tokens:** 86,402
- **Context to Unload:** 0 files

#### Snapshot 2 - 2025-12-01T20:43:39.627766+00:00
- **Active Context:** 2 files, 84,062 tokens
- **Pre-loaded Context:** 2 files, 2,340 tokens
- **Total Tokens:** 86,402
- **Context to Unload:** 0 files

#### Snapshot 3 - 2025-12-01T20:43:39.632565+00:00
- **Active Context:** 2 files, 84,062 tokens
- **Pre-loaded Context:** 2 files, 2,340 tokens
- **Total Tokens:** 86,402
- **Context to Unload:** 0 files

#### Snapshot 4 - 2025-12-01T20:43:39.635595+00:00
- **Active Context:** 2 files, 84,062 tokens
- **Pre-loaded Context:** 2 files, 2,340 tokens
- **Total Tokens:** 86,402
- **Context to Unload:** 0 files

#### Snapshot 5 - 2025-12-01T20:43:39.636595+00:00
- **Active Context:** 2 files, 7,800 tokens
- **Pre-loaded Context:** 0 files, 0 tokens
- **Total Tokens:** 7,800
- **Context to Unload:** 2 files

#### Snapshot 6 - 2025-12-01T20:43:39.638663+00:00
- **Active Context:** 0 files, 0 tokens
- **Pre-loaded Context:** 0 files, 0 tokens
- **Total Tokens:** 0
- **Context to Unload:** 2 files

#### Snapshot 7 - 2025-12-01T20:43:39.645538+00:00
- **Active Context:** 2 files, 84,062 tokens
- **Pre-loaded Context:** 2 files, 2,340 tokens
- **Total Tokens:** 86,402
- **Context to Unload:** 0 files

#### Snapshot 8 - 2025-12-01T20:43:39.669752+00:00
- **Active Context:** 2 files, 7,800 tokens
- **Pre-loaded Context:** 0 files, 0 tokens
- **Total Tokens:** 7,800
- **Context to Unload:** 2 files
