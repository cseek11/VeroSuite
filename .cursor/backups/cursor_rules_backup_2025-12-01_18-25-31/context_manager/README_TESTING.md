# Testing Guide - Predictive Context Management

**Last Updated:** 2025-12-01

## Quick Start

```bash
# Run all tests
python .cursor/tests/run_context_tests.py

# Run with verbose output
python .cursor/tests/run_context_tests.py --verbose

# Run with coverage report
python .cursor/tests/run_context_tests.py --coverage
```

## Test Files

### 1. `test_context_preloader_fixes.py`
**Tests Phase 1 fixes:**
- Unloading logic includes preloaded context
- HIGH priority file-specific contexts are auto-loaded
- Atomic state persistence

**Key Tests:**
- `test_unload_includes_both_prev_active_and_preloaded` - Verifies Issue 1 fix
- `test_high_priority_file_specific_is_loaded` - Verifies Issue 2 fix
- `test_atomic_write_prevents_corruption` - Verifies atomic persistence

### 2. `test_context_loader_dependencies.py`
**Tests Phase 2 fixes:**
- Cascade dependencies are loaded recursively
- Circular dependency handling
- Dependency priority assignment

**Key Tests:**
- `test_dependencies_are_added_with_high_priority` - Verifies Issue 3 fix
- `test_dependencies_are_loaded_recursively` - Verifies recursive loading
- `test_circular_dependencies_are_handled` - Verifies cycle detection

### 3. `test_predictor_enhancements.py`
**Tests Phase 3 fixes:**
- Prediction uses static + dynamic patterns
- Message semantic analysis
- Score normalization

**Key Tests:**
- `test_predictor_uses_static_and_dynamic_patterns` - Verifies Issue 4 fix
- `test_message_semantic_analysis` - Verifies message analysis
- `test_score_normalization` - Verifies probability normalization

### 4. `test_integration_context_flow.py`
**Tests end-to-end workflows:**
- Complete workflow: edit_code → run_tests
- State persistence across calls
- Dependency expansion in real scenarios

**Key Tests:**
- `test_edit_code_then_run_tests_flow` - Verifies complete workflow
- `test_state_persistence_across_calls` - Verifies state persistence
- `test_dependency_expansion_in_workflow` - Verifies dependencies in workflow

## Running Individual Tests

```bash
# Run specific test file
python -m pytest .cursor/tests/test_context_preloader_fixes.py -v

# Run specific test
python -m pytest .cursor/tests/test_context_preloader_fixes.py::TestUnloadingLogic::test_unload_includes_both_prev_active_and_preloaded -v

# Run with coverage for specific file
python -m pytest .cursor/tests/test_context_preloader_fixes.py --cov=.cursor/context_manager/preloader --cov-report=term
```

## Test Coverage Goals

- **Unit Tests:** >90% coverage
- **Integration Tests:** All major workflows covered
- **Edge Cases:** Circular dependencies, empty states, invalid inputs

## Continuous Integration

Add to CI pipeline:

```yaml
# .github/workflows/test-context-management.yml
name: Test Context Management

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.10'
      - run: pip install pytest pytest-cov
      - run: python .cursor/tests/run_context_tests.py --coverage
```

## Debugging Failed Tests

1. **Check test output:**
   ```bash
   python -m pytest .cursor/tests/test_context_preloader_fixes.py -v -s
   ```

2. **Run with debugger:**
   ```bash
   python -m pytest .cursor/tests/test_context_preloader_fixes.py --pdb
   ```

3. **Check test fixtures:**
   - Tests use `tmp_path` fixture for isolated file operations
   - Tests use mock objects for predictors and loaders

## Adding New Tests

When adding new features, add corresponding tests:

1. **Unit test** for the new feature
2. **Integration test** if it affects workflows
3. **Edge case test** for error conditions

Example:
```python
def test_new_feature(self, tmp_path):
    """Test description."""
    # Setup
    loader = ContextLoader()
    # ... setup code ...
    
    # Execute
    result = loader.new_method()
    
    # Verify
    assert result == expected_value
```

---

**Last Updated:** 2025-12-01

