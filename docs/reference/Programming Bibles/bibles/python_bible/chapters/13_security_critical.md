<!-- SSM:CHUNK_BOUNDARY id="ch13-start" -->
📘 CHAPTER 13 — SECURITY 🔒 Critical

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–12

> **Quick Answer:**
> - **Never use `eval()` or `exec()` with user input**
> - **Always use parameterized queries** (never string concatenation for SQL)
> - **Never use `pickle` with untrusted data** (allows arbitrary code execution)
> - **Use `secrets` module** for cryptographic randomness, not `random`
> - **Validate and sanitize all input** at system boundaries
> 
> ```python
> # ❌ DANGEROUS
> eval(user_input)  # Arbitrary code execution!
> f"SELECT * FROM users WHERE id={user_id}"  # SQL injection!
> pickle.loads(user_data)  # Arbitrary code execution!
> 
> # ✅ SAFE
> json.loads(user_input)  # Safe parsing
> cursor.execute("SELECT * FROM users WHERE id=?", (user_id,))  # Parameterized
> secrets.token_hex(32)  # Secure random
> ```

**Estimated time:** 3-4 hours
**When you need this:** Production applications, APIs, handling user data

13.0 Overview

Security in Python requires understanding:

Python’s dynamic nature

insecure standard library APIs (pickle, eval, input)

dependency vulnerabilities

network attack surfaces

serialization risks

sandboxing limitations

runtime code execution risks

secure configuration patterns

secrets handling

OWASP Top 10 applied to Python

This chapter provides a practical, battle-tested guide.

13.1 The Python Security Model

Python has no built-in sandboxing.

Important facts:

Python can execute arbitrary code (via eval, exec, importlib)

Python can load arbitrary bytecode (.pyc)

Python can access the entire filesystem

Python can open network sockets

Python can spawn system processes

Therefore…

Do NOT run untrusted Python code.

13.2 OWASP Top 10 Applied to Python

We map each category to Python-specific risks.

13.2.1 Injection Attacks

Python-specific injection vectors:

SQL injection (unsafe string concatenation)

command injection (os.system(), subprocess(shell=True))

template injection (Jinja2 misconfiguration)

unsafe YAML loading

**SQL Injection Prevention:**

```python
# ❌ VULNERABLE: String concatenation
username = request.form['username']
cur.execute(f"SELECT * FROM users WHERE name='{username}'")
# If username = "admin' OR '1'='1", all users are returned!

# ✅ SAFE: Parameterized queries
cur.execute("SELECT * FROM users WHERE name=?", (username,))
# Or with named parameters:
cur.execute("SELECT * FROM users WHERE name=:name", {"name": username})
```

**SQLAlchemy Safe Patterns:**

```python
# ✅ SAFE: SQLAlchemy ORM (automatic parameterization)
user = session.query(User).filter(User.name == username).first()

# ✅ SAFE: SQLAlchemy Core with parameters
stmt = select(User).where(User.name == bindparam('name'))
result = session.execute(stmt, {'name': username})
```

**Command Injection Prevention:**

```python
# ❌ VULNERABLE
os.system(f"rm -rf {user_input}")  # Command injection!

# ✅ SAFE: Use subprocess without shell
subprocess.run(['rm', '-rf', user_input], check=True)

# ✅ SAFE: Validate input first
if not user_input.isalnum():
    raise ValueError("Invalid input")
subprocess.run(['command', user_input])
```

**Template Injection Prevention:**

```python
# ❌ VULNERABLE: Jinja2 autoescape off
template = jinja2.Template(user_input, autoescape=False)

# ✅ SAFE: Autoescape enabled (default)
template = jinja2.Template(user_input)  # autoescape=True by default

# ✅ SAFE: Sandboxed rendering
from jinja2.sandbox import SandboxedEnvironment
env = SandboxedEnvironment()
template = env.from_string(user_input)
```

**YAML Injection Prevention:**

```python
# ❌ VULNERABLE
data = yaml.load(user_input)  # Can execute arbitrary code!

# ✅ SAFE
data = yaml.safe_load(user_input)  # Only loads basic types
```

13.2.2 Broken Authentication

Common Python mistakes:

storing passwords in plain text

rolling your own auth

weak password hashing (MD5, SHA1)

insecure session cookies

Flask secret_key committed to repo

Use:

bcrypt

argon2

passlib

django/fastapi auth frameworks

13.2.3 Sensitive Data Exposure

logging secrets

not using HTTPS

misconfigured SSL

weak encryption

storing access tokens in config files

13.2.4 XML External Entity (XXE)

Use:

defusedxml


instead of xml.etree.

13.2.5 Broken Access Control

Common mistakes:

authorizing via client-side logic

trusting user-supplied IDs

direct object reference vulnerability (IDOR)

13.2.6 Security Misconfiguration

debug mode enabled

CORS wide open

no CSRF protection

unbounded file uploads

13.2.7 Cross-Site Scripting (XSS)

In Python web apps:

Jinja2 autoescape off

unsafe rendering of HTML

13.2.8 Insecure Deserialization

Critical Python risk:

Do NOT use pickle on untrusted data.
pickle.loads(b"...")  # arbitrary code execution


Use:

JSON

ormsgpack

protobuf

13.2.9 Vulnerable Dependencies

Use:

pip-audit

safety

osv-scanner

Example:

pip-audit

13.2.10 Insufficient Logging & Monitoring

Use:

structured logging

audit trails

request IDs

exception logging

13.3 Input Validation

Python needs explicit validation to avoid:

type errors

injection

malformed data

insecure parsing

13.3.1 Pydantic (recommended)
from pydantic import BaseModel, Field

class User(BaseModel):
    name: str = Field(min_length=1)
    age: int = Field(gt=0)

13.3.2 Marshmallow
from marshmallow import Schema, fields

class UserSchema(Schema):
    name = fields.Str(required=True)
    age = fields.Int(required=True)

13.3.3 cerberus / voluptuous

Useful for config validation.

13.4 Secrets Management

Secrets must never be:

hardcoded in code

committed to git

printed in logs

stored in environment variables in plaintext logs

Use:

AWS Secrets Manager

HashiCorp Vault

GCP Secret Manager

Azure Key Vault

13.4.1 Secret Rotation Patterns

time-based rotation

credential cycling

zero-downtime rotation

13.4.2 dotenv pitfalls

.env files are useful but:

should not be deployed

must not be committed

should be encrypted

13.5 Secure Serialization
Avoid:

❌ pickle
❌ shelve
❌ marshal
❌ PyYAML load()

Prefer:

✔ JSON
✔ ormsgpack
✔ msgpack
✔ protobuf
✔ pydantic JSON models

13.6 Secure Filesystem & Path Handling
13.6.1 Use pathlib to prevent path traversal
def safe_join(base: Path, user_path: str) -> Path:
    resolved = (base / user_path).resolve()
    if base not in resolved.parents:
        raise ValueError("Traversal attempt")
    return resolved

13.6.2 Avoid using user input in file paths directly
13.7 Rate Limiting & Abuse Prevention

Use:

Redis counters

token bucket algorithms

FastAPI dependencies

Nginx-level rate limits

Example token bucket:

class TokenBucket:
    def __init__(self, rate, capacity):
        self.rate = rate
        self.capacity = capacity
        self.tokens = capacity

13.8 Dependency Scanning & Supply Chain Security

Tools:

✔ pip-audit
✔ safety
✔ npm audit for frontend
✔ osv-scanner
✔ pipdeptree

Scan regularly.

13.9 Cryptography Basics in Python

Use:

from cryptography.fernet import Fernet


Never roll your own crypto.

13.9.1 Password Hashing

Use:

pip install argon2-cffi

from argon2 import PasswordHasher
ph = PasswordHasher()
hash = ph.hash("password")

13.9.2 TLS

Use secure defaults:

import ssl
ctx = ssl.create_default_context()

13.10 Sandboxing

Python cannot be sandboxed reliably.

Do NOT:

eval() untrusted code

exec() untrusted modules

unpickle unknown objects

If sandboxing is required, use:

Docker

gVisor

Firecracker

WASM

microVMs

13.11 Threat Modeling for Python Systems

Steps:

Identify entry points

Identify trust boundaries

Consider attack vectors

Identify sensitive data

Create mitigations

13.12 Secure API Design
1. Input validation (pydantic)
2. Authentication (JWT, OAuth2)
3. Authorization (RBAC, ABAC)
4. Rate limiting
5. Logging & auditing
6. Safe error messages (no stack traces)
7. CORS limits
8. HTTPS only
13.13 Secure Web Development Anti-Patterns

❌ manual SQL queries
❌ storing plaintext passwords
❌ trusting user-supplied IDs
❌ rendering raw HTML
❌ returning internal error messages
❌ disabling SSL verification
❌ using "pickle" for sessions

13.14 Mini Example — Safe Config Loader
from pydantic import BaseModel, ValidationError
from pathlib import Path
import json

class Config(BaseModel):
    db_url: str
    max_workers: int

def load_config(path):
    data = json.loads(Path(path).read_text())
    try:
        return Config(**data)
    except ValidationError as e:
        raise RuntimeError("Invalid config") from e

13.15 Macro Example — Secure FastAPI App

Features:

JWT auth

rate limiting

pydantic validation

safe logging

secure headers

from fastapi import FastAPI, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
import time

app = FastAPI()

oauth2 = OAuth2PasswordBearer(tokenUrl="token")

class Item(BaseModel):
    name: str
    quantity: int

RATE = {}
def rate_limit(ip):
    now = time.time()
    if ip not in RATE: RATE[ip] = []
    RATE[ip] = [t for t in RATE[ip] if now - t < 1]
    if len(RATE[ip]) > 5:
        raise RuntimeError("rate limit exceeded")
    RATE[ip].append(now)

@app.post("/items")
def create_item(item: Item, token: str = Depends(oauth2)):
    return {"msg": "ok", "item": item}

13.16 Pitfalls & Warnings

⚠ pickle is unsafe
⚠ eval/exec are unsafe
⚠ PyYAML load() is unsafe
⚠ secrets in logs
⚠ debug mode enabled in production
⚠ weak password hashing
⚠ bare exceptions hide vulnerabilities
⚠ unsanitized user input in file paths
⚠ insecure subprocess usage
⚠ relying solely on client-side validation

13.17 Summary & Takeaways

Python has no built-in sandbox → avoid untrusted code

Use pydantic for data validation

Avoid pickle; prefer JSON or msgpack

Use pip-audit/safety for dependency scanning

Apply OWASP Top 10 to Python frameworks

Always hash passwords (bcrypt/argon2)

Use secure TLS defaults

Implement rate limiting

Secrets belong in secret managers

Error messages must not leak internal data

13.18 Next Chapter

Proceed to:

👉 Chapter 14 — Testing & Quality Engineering
Includes:

pytest

unittest

mocking (unittest.mock, pytest-mock)

fixtures

test doubles (mocks, stubs, fakes, spies)

integration tests

E2E tests

coverage.py

test organization patterns

doctest
