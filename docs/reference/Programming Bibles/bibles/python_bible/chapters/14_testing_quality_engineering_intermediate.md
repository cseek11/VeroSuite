<!-- SSM:CHUNK_BOUNDARY id="ch14-start" -->
📘 CHAPTER 14 — TESTING & QUALITY ENGINEERING 🟡 Intermediate

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–13

14.0 Overview

Testing in Python must address:

dynamic typing

runtime-bound behavior

mutation-heavy code

dependency injection patterns

async code

external systems (DB, APIs, file I/O)

This chapter establishes a complete testing discipline using:

pytest as the primary framework

unittest for legacy/testing deep internals

mocks and fakes

fixtures for maintainable tests

property-based testing

integration/E2E patterns

coverage analysis

architecture-aligned test layers

14.1 The Python Testing Landscape
14.1.1 pytest (recommended)

Features:

simple assert statements

fixtures system

plugin ecosystem

parametrization

async support

best readability

14.1.2 unittest (stdlib)

Features:

xUnit style

class-based tests

setUp/tearDown

required for legacy projects

14.1.3 hypothesis

Property-based test generation.

14.1.4 doctest

Examples embedded in docstrings.

14.2 Testing Philosophy
✔ Write tests close to the behavior, not implementation
✔ Test the contract, not private details
✔ Use fixtures for shared setup
✔ Use mocks only when needed
✔ Integration > unit tests for Python
✔ Prioritize readability and maintainability
14.3 Test Organization & Folder Structure

Recommended:

project/
  src/
    package/
      ...
  tests/
    unit/
    integration/
    e2e/
    conftest.py

14.4 Unit Testing with pytest
14.4.1 Basic Test
def test_add():
    assert add(1, 2) == 3


Run:

pytest -q

14.4.2 Parametrized Tests
@pytest.mark.parametrize("a,b,res", [
    (1, 2, 3),
    (0, 5, 5),
    (-1, 1, 0)
])
def test_add(a, b, res):
    assert add(a, b) == res

14.4.3 Testing Exceptions
def test_zero_division():
    with pytest.raises(ZeroDivisionError):
        divide(1, 0)

14.5 unittest for Legacy Code

Class-based style:

import unittest

class TestMath(unittest.TestCase):
    def test_add(self):
        self.assertEqual(add(1,2), 3)

if __name__ == "__main__":
    unittest.main()

14.6 Mocking & Test Doubles

(The Most Critical Section)

Python supports the following doubles:

✔ Mock — tracks calls, faked behavior
✔ Stub — provides fixed behavior
✔ Fake — working simplified implementation
✔ Spy — wrapper around real logic
✔ Dummy — unused placeholder argument
14.6.1 unittest.mock
from unittest.mock import Mock

repo = Mock()
repo.get_user.return_value = {"id": 1}

assert repo.get_user(1) == {"id": 1}
assert repo.get_user.called

14.6.2 monkeypatch (pytest)
def test_api(monkeypatch):
    monkeypatch.setattr("module.fetch_data", lambda: 42)
    assert module.get_processed() == 43

14.6.3 patch decorator
from unittest.mock import patch

@patch("module.Database")
def test_service(MockDB):
    MockDB.return_value.fetch.return_value = 10
    s = Service()
    assert s.compute() == 20

14.6.4 Async mocking
from unittest.mock import AsyncMock

client = AsyncMock()
client.fetch.return_value = {"msg": "ok"}

14.7 Fixtures (pytest)

Fixtures make tests clean and reusable.

14.7.1 Basic Fixture
@pytest.fixture
def numbers():
    return [1, 2, 3]

def test_sum(numbers):
    assert sum(numbers) == 6

14.7.2 Fixture Scopes

| Scope | Lifetime | Use Case |
|-------|----------|----------|
| `function` | Per test function | Default, most common |
| `class` | Per test class | Shared setup for class tests |
| `module` | Per test module | Database connections, expensive setup |
| `package` | Per test package | Shared resources across modules |
| `session` | Per test session | Global setup (DB, API clients) |

Example:

```python
@pytest.fixture(scope="session")
def db():
    """Database connection shared across all tests."""
    conn = create_connection()
    yield conn
    conn.close()

@pytest.fixture(scope="function")
def transaction(db):
    """Fresh transaction for each test."""
    trans = db.begin()
    yield trans
    trans.rollback()
```

14.7.3 Fixture Parametrization

```python
@pytest.fixture(params=["sqlite", "postgresql", "mysql"])
def database(request):
    return create_database(request.param)

def test_query(database):
    assert database.query("SELECT 1") == 1
```

14.7.4 Fixture Dependencies

```python
@pytest.fixture
def config():
    return {"api_url": "https://api.example.com"}

@pytest.fixture
def client(config):  # Depends on config
    return APIClient(config["api_url"])

def test_api_call(client):
    assert client.get("/status") == 200
```

14.7.5 Autouse Fixtures

```python
@pytest.fixture(autouse=True)
def reset_state():
    """Automatically runs before every test."""
    clear_cache()
    yield
    cleanup()
```

14.8 Advanced pytest Features

14.8.1 Markers

```python
@pytest.mark.slow
def test_expensive_operation():
    # This test is marked as slow
    pass

# Run only fast tests
# pytest -m "not slow"

# Run only slow tests
# pytest -m slow
```

**Custom Markers (pytest.ini):**

```ini
[pytest]
markers =
    slow: marks tests as slow
    integration: marks tests as integration tests
    unit: marks tests as unit tests
```

14.8.2 Parametrization Deep-Dive

```python
@pytest.mark.parametrize("input,expected", [
    ("hello", "HELLO"),
    ("world", "WORLD"),
    ("", ""),
])
def test_uppercase(input, expected):
    assert input.upper() == expected

# Multiple parameters
@pytest.mark.parametrize("a", [1, 2])
@pytest.mark.parametrize("b", [3, 4])
def test_multiply(a, b):
    assert a * b in [3, 4, 6, 8]
```

14.8.3 pytest.raises for Exception Testing

```python
def test_division_by_zero():
    with pytest.raises(ZeroDivisionError) as exc_info:
        divide(10, 0)
    
    assert str(exc_info.value) == "division by zero"

# Match exception message
with pytest.raises(ValueError, match="invalid input"):
    process_data(None)
```

14.9 Mocking Patterns Deep-Dive

14.9.1 unittest.mock.Mock

```python
from unittest.mock import Mock, MagicMock

# Basic mock
mock_obj = Mock()
mock_obj.method.return_value = 42
assert mock_obj.method() == 42

# Verify calls
mock_obj.method.assert_called_once()
mock_obj.method.assert_called_with(1, 2, key="value")
```

14.9.2 unittest.mock.patch

```python
from unittest.mock import patch

@patch('module.expensive_function')
def test_with_mock(mock_func):
    mock_func.return_value = "mocked"
    result = my_function()
    assert result == "mocked"
    mock_func.assert_called_once()

# Context manager
def test_with_context():
    with patch('module.api_call') as mock_api:
        mock_api.return_value = {"status": "ok"}
        result = process_api()
        assert result["status"] == "ok"
```

14.9.3 pytest-mock

```python
import pytest

def test_with_pytest_mock(mocker):
    mock_func = mocker.patch('module.expensive_function')
    mock_func.return_value = 42
    
    result = my_function()
    assert result == 42
    mock_func.assert_called_once()
```

14.9.4 Mocking Async Functions

```python
from unittest.mock import AsyncMock

@pytest.mark.asyncio
async def test_async_function():
    mock_client = AsyncMock()
    mock_client.fetch.return_value = {"data": "test"}
    
    result = await my_async_function(mock_client)
    assert result == {"data": "test"}
```

14.10 Property-Based Testing with hypothesis

14.10.1 Basic Property-Based Testing

```python
from hypothesis import given, strategies as st

@given(st.integers(), st.integers())
def test_add_commutative(a, b):
    """Addition is commutative."""
    assert add(a, b) == add(b, a)

@given(st.lists(st.integers()))
def test_reverse_twice_is_identity(lst):
    """Reversing twice returns original."""
    assert reverse(reverse(lst)) == lst
```

14.10.2 Custom Strategies

```python
from hypothesis import given, strategies as st

@given(st.emails())
def test_email_validation(email):
    assert is_valid_email(email)

# Composite strategies
@given(st.lists(st.integers(min_value=1, max_value=100), min_size=1))
def test_sum_positive(numbers):
    assert sum(numbers) > 0
```

14.11 Coverage Analysis

14.11.1 coverage.py

**Installation:**

```bash
pip install coverage pytest-cov
```

**Running Coverage:**

```bash
# Run tests with coverage
pytest --cov=src --cov-report=html

# Generate terminal report
pytest --cov=src --cov-report=term-missing

# Generate XML (for CI)
pytest --cov=src --cov-report=xml
```

14.11.2 Coverage Configuration (.coveragerc)

```ini
[run]
source = src
omit = 
    */tests/*
    */venv/*
    */migrations/*

[report]
exclude_lines =
    pragma: no cover
    def __repr__
    raise AssertionError
    raise NotImplementedError
```

14.11.3 Coverage Thresholds

```python
# pytest.ini or pyproject.toml
[tool.pytest.ini_options]
addopts = "--cov=src --cov-fail-under=80"
```

14.11.4 Type Checking in Tests

Type checking validates type hints at development time, catching type errors before runtime.

**Quick Answer:**
- **mypy** is the most popular static type checker for Python
- **pyright/pylance** provides fast type checking with excellent IDE integration
- **Type checking in CI/CD** catches type errors before code is merged
- **Runtime type checking** validates types at runtime (pydantic, typeguard)
- **Type stubs** provide type information for untyped libraries

```python
# Install type checkers
# pip install mypy pyright

# Run type checking
# mypy src/
# pyright src/
```

**Estimated time:** 1 hour  
**When you need this:** When using type hints, want to catch type errors early, or need to validate types at runtime

14.11.4.1 Static Type Checking with mypy

mypy is the reference implementation for Python type checking:

**Installation:**

```bash
pip install mypy
```

**Basic Usage:**

```bash
# Check a single file
mypy src/main.py

# Check entire project
mypy src/

# Check with strict mode
mypy --strict src/

# Check with specific Python version
mypy --python-version 3.11 src/
```

**mypy Configuration (mypy.ini or pyproject.toml):**

```ini
# mypy.ini
[mypy]
python_version = 3.11
warn_return_any = True
warn_unused_configs = True
disallow_untyped_defs = True
disallow_incomplete_defs = True
check_untyped_defs = True
disallow_untyped_decorators = True
no_implicit_optional = True
warn_redundant_casts = True
warn_unused_ignores = True
warn_no_return = True
warn_unreachable = True
strict_equality = True

# Per-module configuration
[mypy-tests.*]
ignore_errors = True  # Tests can be less strict
```

**pyproject.toml Configuration:**

```toml
[tool.mypy]
python_version = "3.11"
warn_return_any = true
disallow_untyped_defs = true
strict_optional = true

[[tool.mypy.overrides]]
module = "tests.*"
ignore_errors = true
```

**Type Checking Examples:**

```python
# ✅ Valid: Type hints match implementation
def add(a: int, b: int) -> int:
    return a + b

result: int = add(1, 2)  # ✅ Type checker validates

# ❌ Type error: Return type mismatch
def bad_add(a: int, b: int) -> str:
    return a + b  # ❌ mypy error: int not assignable to str

# ❌ Type error: Missing type hints
def untyped_func(x):  # ❌ mypy error: Function is missing a type annotation
    return x * 2
```

14.11.4.2 pyright / Pylance

pyright provides fast type checking with excellent IDE integration:

**Installation:**

```bash
# For VS Code (Pylance extension)
# Install via VS Code extensions

# Standalone pyright
pip install pyright
```

**Basic Usage:**

```bash
# Check project
pyright src/

# Check with specific Python version
pyright --pythonversion 3.11 src/

# Generate type stubs
pyright --createstub package_name
```

**pyright Configuration (pyrightconfig.json):**

```json
{
  "include": ["src"],
  "exclude": ["**/node_modules", "**/__pycache__"],
  "pythonVersion": "3.11",
  "typeCheckingMode": "basic",
  "reportMissingTypeStubs": false,
  "reportMissingImports": true,
  "reportUnusedImport": true,
  "reportUnusedVariable": true,
  "reportUnusedFunction": true,
  "reportUnusedClass": true
}
```

**Type Checking Modes:**

- **basic**: Minimal type checking (fast)
- **standard**: Balanced checking (default)
- **strict**: Maximum type checking (slower, most thorough)

14.11.4.3 Type Checking in CI/CD

Integrate type checking into your CI/CD pipeline:

**GitHub Actions Example:**

```yaml
# .github/workflows/type-check.yml
name: Type Check

on: [push, pull_request]

jobs:
  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install mypy pyright
          pip install -r requirements.txt
      
      - name: Run mypy
        run: mypy src/ --config-file mypy.ini
      
      - name: Run pyright
        run: pyright src/
```

**Pre-commit Hook:**

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.5.1
    hooks:
      - id: mypy
        additional_dependencies: [types-requests, types-PyYAML]
        args: [--strict, --ignore-missing-imports]
```

**GitLab CI Example:**

```yaml
# .gitlab-ci.yml
typecheck:
  image: python:3.11
  script:
    - pip install mypy pyright
    - mypy src/
    - pyright src/
  only:
    - merge_requests
    - main
```

14.11.4.4 Runtime Type Checking

Runtime type checking validates types at execution time:

**pydantic for Runtime Validation:**

```python
from pydantic import BaseModel, ValidationError

class User(BaseModel):
    id: int
    name: str
    email: str
    age: int | None = None

# ✅ Valid: Creates User instance
user = User(id=1, name="Alice", email="alice@example.com")

# ❌ Runtime error: Validation fails
try:
    bad_user = User(id="not a number", name="Bob")
except ValidationError as e:
    print(e)  # Validation error details
```

**typeguard for Function Validation:**

```python
from typeguard import typechecked

@typechecked
def process_user(user_id: int, name: str) -> dict:
    return {"id": user_id, "name": name}

# ✅ Valid: Types match
result = process_user(1, "Alice")

# ❌ Runtime error: Type mismatch
try:
    result = process_user("not a number", "Bob")
except TypeError as e:
    print(e)  # Type error details
```

**Manual Runtime Type Checking:**

```python
from typing import get_type_hints
import inspect

def validate_types(func):
    """Decorator that validates function arguments at runtime."""
    hints = get_type_hints(func)
    sig = inspect.signature(func)
    
    def wrapper(*args, **kwargs):
        bound = sig.bind(*args, **kwargs)
        bound.apply_defaults()
        
        for param_name, param_value in bound.arguments.items():
            if param_name in hints:
                expected_type = hints[param_name]
                if not isinstance(param_value, expected_type):
                    raise TypeError(
                        f"{param_name} must be {expected_type}, got {type(param_value)}"
                    )
        
        result = func(*args, **kwargs)
        
        if 'return' in hints:
            expected_return = hints['return']
            if not isinstance(result, expected_return):
                raise TypeError(
                    f"Return value must be {expected_return}, got {type(result)}"
                )
        
        return result
    
    return wrapper

@validate_types
def add(a: int, b: int) -> int:
    return a + b

add(1, 2)  # ✅ Valid
add("1", "2")  # ❌ Runtime TypeError
```

14.11.4.5 Type Stubs

Type stubs provide type information for untyped libraries:

**Creating Type Stubs:**

```python
# types/requests.pyi (type stub file)
from typing import Any

def get(url: str, **kwargs: Any) -> Response: ...
def post(url: str, **kwargs: Any) -> Response: ...

class Response:
    status_code: int
    text: str
    def json(self) -> dict[str, Any]: ...
```

**Using Third-Party Type Stubs:**

```bash
# Install type stubs for popular libraries
pip install types-requests types-PyYAML types-redis

# Type checkers automatically find stubs in types/ directory
# or in @types/ packages
```

**Type Stub Best Practices:**

- Use `.pyi` extension for stub files
- Place stubs in `types/` directory or `@types/` package
- Match function signatures exactly (use `...` for implementation)
- Include all public APIs
- Document complex types with comments

14.11.4.6 Type Testing Pitfalls & Warnings

⚠️ **Type checking is optional and can be bypassed:**

```python
# ❌ Wrong: Type checker can't catch runtime type errors
def process(data: dict) -> int:
    return data["value"]  # Runtime KeyError if "value" missing

# ✅ Better: Use TypedDict or validate input
from typing import TypedDict

class Data(TypedDict):
    value: int

def process(data: Data) -> int:
    return data["value"]  # Type checker validates structure
```

⚠️ **Type stubs can be incomplete or incorrect:**

```python
# ❌ Wrong: Stub doesn't match actual implementation
# types/library.pyi
def process(data: str) -> int: ...  # Stub says str

# Actual library
def process(data: dict) -> int:  # Implementation uses dict
    return data["count"]

# ✅ Solution: Keep stubs updated with library versions
```

⚠️ **Runtime type checking has performance overhead:**

```python
from typeguard import typechecked

# ❌ Wrong: Runtime checking on every call (slow)
@typechecked
def fast_function(x: int) -> int:
    return x * 2

# ✅ Solution: Use runtime checking only in development
import os

if os.getenv("ENABLE_TYPE_CHECKING") == "true":
    from typeguard import typechecked
else:
    def typechecked(func):
        return func  # No-op in production
```

⚠️ **Type checkers have limitations:**

```python
# ❌ Wrong: Type checker can't infer dynamic types
def get_value(key: str) -> object:
    data = {"name": "Alice", "age": 30}
    return data[key]  # Type checker sees object, not specific type

# ✅ Better: Use TypedDict or type narrowing
from typing import TypedDict, Literal

class UserData(TypedDict):
    name: str
    age: int

def get_value(key: Literal["name", "age"], data: UserData) -> str | int:
    return data[key]  # Type checker knows return type
```

14.12 Integration Testing Patterns

14.12.1 Testing with Real Databases

```python
@pytest.fixture(scope="session")
def test_db():
    """Create test database."""
    db = create_test_database()
    yield db
    db.drop_all()

@pytest.fixture
def db_session(test_db):
    """Fresh session for each test."""
    session = test_db.session()
    yield session
    session.rollback()
    session.close()

def test_user_creation(db_session):
    user = User(name="Test")
    db_session.add(user)
    db_session.commit()
    assert user.id is not None
```

14.12.2 Testing HTTP APIs

```python
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    return TestClient(app)

def test_get_users(client):
    response = client.get("/users")
    assert response.status_code == 200
    assert len(response.json()) > 0
```

14.13 Test Organization Best Practices

14.13.1 Test Structure

```
tests/
  conftest.py          # Shared fixtures
  unit/
    test_models.py
    test_utils.py
  integration/
    test_api.py
    test_database.py
  e2e/
    test_workflows.py
```

14.13.2 conftest.py for Shared Fixtures

```python
# tests/conftest.py
import pytest

@pytest.fixture(scope="session")
def database():
    return create_test_db()

@pytest.fixture
def sample_user():
    return User(name="Test", email="test@example.com")
```

14.14 Summary & Takeaways

- pytest is the recommended testing framework
- Fixtures provide clean, reusable test setup
- Mocking is essential for isolating units
- Property-based testing finds edge cases
- Coverage analysis ensures test completeness
- Integration tests verify system behavior
- Organize tests by type (unit/integration/e2e)

14.15 Next Chapter

Proceed to:
👉 Chapter 15 (Debugging) for debugging techniques
👉 Chapter 16 (Tooling) for development workflows

14.7.3 Autouse Fixtures
@pytest.fixture(autouse=True)
def env():
    os.environ["MODE"] = "test"

14.7.4 Parameterized Fixtures
@pytest.fixture(params=[1,2,3])
def value(request):
    return request.param

14.8 Testing Async Code
@pytest.mark.asyncio
async def test_async():
    assert await async_add(1,2) == 3


Or use pytest-asyncio auto mode.

14.9 Property-Based Testing (hypothesis)
from hypothesis import given, strategies as st

@given(st.integers(), st.integers())
def test_add(a, b):
    assert add(a, b) == add(b, a)


Hypothesis finds edge cases automatically.

14.10 Integration Testing

Integration tests validate:

DB + application

API + services

multiple modules working together

14.10.1 Database Integration Tests

Use:

sqlite in-memory

testcontainers (for real DBs)

Example:

@pytest.fixture
def db(tmp_path):
    path = tmp_path / "test.db"
    return connect(path)

14.10.2 FastAPI Integration Test

FastAPI built-in test client:

from fastapi.testclient import TestClient

client = TestClient(app)

def test_create():
    r = client.post("/items", json={"name": "x"})
    assert r.status_code == 200

14.11 End-to-End (E2E) Testing

Tools:

Playwright (browser)

Robot Framework

Selenium

Locust (load tests)

14.12 Coverage Analysis (coverage.py)

Install:

pip install coverage


Run:

coverage run -m pytest
coverage html

Target Coverage Levels
Component	Recommended
domain layer	90%+
services	80%
adapters	60%
API	50–80%
E2E	behavior-based

Coverage is not a goal — correctness is.

14.13 Mocking External Services

Examples:

HTTP
import httpx
import respx

@respx.mock
def test_http():
    respx.get("https://a.com").mock(return_value=httpx.Response(200))
    r = httpx.get("https://a.com")
    assert r.status_code == 200

Redis / Kafka

Use:

fakeredis

testcontainers

14.14 Doctest

Used to validate examples in docstrings:

def add(x, y):
    """
    >>> add(1, 2)
    3
    """
    return x + y


Run:

python -m doctest file.py

**See also:** Chapter 30 (Docstrings) for comprehensive docstring conventions and doctest integration patterns.

14.15 Mini Example — Testing a Service with Mocks
def test_service_calls_repo():
    repo = Mock()
    repo.save.return_value = True

    s = Service(repo)
    s.create("task")

    repo.save.assert_called_once()

14.16 Macro Example — Full Test Suite

Includes:

API tests

DB tests

service tests

unit tests

fixtures

structured folders

tests/
  unit/
  integration/
  e2e/
  conftest.py


Example:

@pytest.fixture
def memory_repo():
    return MemoryRepo()

def test_create(memory_repo):
    s = TaskService(memory_repo)
    s.create("X")
    assert memory_repo.list() == ["X"]

14.17 Pitfalls & Warnings

⚠ using too many mocks → tests lie
⚠ brittle tests that mirror implementation
⚠ skipping integration tests → hidden failures
⚠ not isolating the DB state
⚠ relying on real network in tests
⚠ test order dependence
⚠ global state shared between tests
⚠ mocking time incorrectly

14.18 Summary & Takeaways

pytest is the best tool for modern testing

fixtures make tests clean and maintainable

mocks should be used sparingly and correctly

integration tests catch most real issues

coverage is a measure, not a goal

doctest ensures documentation correctness

async testing is easy with pytest

property-based testing uncovers edge cases automatically

14.19 Next Chapter

Proceed to:

👉 Chapter 15 — Tooling & Development Workflow
including:

modern build systems: hatch, pdm

virtual environments: pyenv, venv, poetry

pre-commit hooks

formatting & linting

code quality automation

Dockerization

GitHub Actions / CI/CD patterns

documentation generation (Sphinx, MkDocs)
