# Phase 2 Testing Guide

**Created:** 2025-11-24  
**Last Updated:** 2025-11-24  
**Status:** ✅ **TESTING FRAMEWORK READY**

---

## 📋 Prerequisites

### Required Python Packages

```bash
# Install required packages
pip install supabase watchdog pyyaml
```

### Required Environment Variables

```bash
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SECRET_KEY=your-secret-key
```

---

## 🧪 Test Structure

### Unit Tests

Located in `.cursor/scripts/veroscore_v3/tests/`:

1. **test_file_change.py** - Tests FileChange dataclass
2. **test_change_buffer.py** - Tests ChangeBuffer with debouncing
3. **test_git_diff_analyzer.py** - Tests GitDiffAnalyzer
4. **test_threshold_checker.py** - Tests ThresholdChecker logic

### Integration Tests

1. **test_supabase_schema_access.py** - Tests Supabase schema access
2. **Integration test in run_phase2_tests.py** - Tests file watcher initialization

---

## 🚀 Running Tests

### Run All Tests

```bash
python .cursor/scripts/run_phase2_tests.py --all
```

### Run Unit Tests Only

```bash
python .cursor/scripts/run_phase2_tests.py --unit
```

### Run Integration Tests Only

```bash
python .cursor/scripts/run_phase2_tests.py --integration
```

### Run Individual Test Files

```bash
# Unit tests
python -m unittest veroscore_v3.tests.test_file_change
python -m unittest veroscore_v3.tests.test_change_buffer
python -m unittest veroscore_v3.tests.test_git_diff_analyzer
python -m unittest veroscore_v3.tests.test_threshold_checker

# Integration test
python .cursor/scripts/test_supabase_schema_access.py
```

---

## ✅ Test Coverage

### FileChange Tests

- ✅ Create FileChange instance
- ✅ Invalid change_type validation
- ✅ Rename change with old_path
- ✅ to_dict() conversion
- ✅ from_dict() creation
- ✅ Equality comparison

### ChangeBuffer Tests

- ✅ Add change to buffer
- ✅ Debouncing (rapid changes coalesced)
- ✅ Multiple files handling
- ✅ get_all() clears buffer
- ✅ clear() method
- ✅ Flush callback execution

### GitDiffAnalyzer Tests

- ✅ Get repository root
- ✅ Get diff stats for files
- ✅ Check git ignore status
- ✅ Handle non-existent files gracefully
- ✅ Handle non-git directories gracefully

### ThresholdChecker Tests

- ✅ File count threshold
- ✅ Line count threshold
- ✅ Time-based threshold
- ✅ Batch size threshold
- ✅ Thresholds not met case
- ✅ Session not found handling

### Integration Tests

- ✅ Supabase schema access
- ✅ Direct table access (sessions)
- ✅ Insert and select operations
- ✅ Changes queue table access
- ✅ File watcher initialization

---

## 🔍 Test Results Interpretation

### Unit Test Results

```
✅ PASS: All unit tests passed
❌ FAIL: Some unit tests failed (check output for details)
```

### Integration Test Results

```
✅ PASS: Supabase schema access working
❌ FAIL: Schema access issues (check Supabase configuration)
⚠️  SKIP: Dependencies missing (install packages)
```

---

## 🐛 Troubleshooting

### Issue: "Missing supabase-py package"

**Solution:**
```bash
pip install supabase
```

### Issue: "Missing SUPABASE_URL or SUPABASE_SECRET_KEY"

**Solution:**
```bash
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SECRET_KEY=your-secret-key
```

### Issue: "Direct table access failed"

**Possible Causes:**
1. Tables not in `veroscore` schema (check migration)
2. RLS policies blocking access (check service role key)
3. Schema name mismatch

**Solution:**
- Verify migration ran successfully
- Check Supabase dashboard for table existence
- Verify service role key is being used
- Test with: `python .cursor/scripts/test_veroscore_setup.py`

### Issue: "Git not available" (for GitDiffAnalyzer tests)

**Solution:**
- Install git: `sudo apt-get install git` (Linux) or download from git-scm.com
- Or skip git-related tests (they will skip automatically)

---

## 📊 Expected Test Output

### Successful Run

```
============================================================
PHASE 2 - UNIT TESTS
============================================================

Running Unit Tests
============================================================

✅ Loaded tests from veroscore_v3.tests.test_file_change
✅ Loaded tests from veroscore_v3.tests.test_change_buffer
✅ Loaded tests from veroscore_v3.tests.test_git_diff_analyzer
✅ Loaded tests from veroscore_v3.tests.test_threshold_checker

test_create_file_change ... ok
test_invalid_change_type ... ok
test_rename_change ... ok
...

----------------------------------------------------------------------
Ran 20 tests in 0.123s

OK

============================================================
PHASE 2 - INTEGRATION TESTS
============================================================

1. Testing Supabase schema access...
✅ Direct table access works
✅ Insert and select operations successful
✅ Changes queue table accessible

2. Testing file watcher initialization...
✅ File watcher initialized successfully

============================================================
Test Summary
============================================================
✅ PASS: Unit Tests
✅ PASS: Integration Tests

✅ All tests passed!
```

---

## 🎯 Next Steps After Testing

1. **If All Tests Pass:**
   - ✅ Phase 2 is ready for approval
   - ✅ Proceed to Phase 3 (PR Creator)

2. **If Tests Fail:**
   - Review error messages
   - Check Supabase configuration
   - Verify environment variables
   - Fix issues and re-run tests

---

**Last Updated:** 2025-11-24  
**Status:** ✅ Testing Framework Ready

