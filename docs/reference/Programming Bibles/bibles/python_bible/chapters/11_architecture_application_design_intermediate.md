<!-- SSM:CHUNK_BOUNDARY id="ch11-start" -->
📘 CHAPTER 11 — ARCHITECTURE & APPLICATION DESIGN 🟡 Intermediate

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–10

11.0 Overview

Architecture is the art of determining:

boundaries

flows

dependencies

module responsibilities

the shape of your system

Python’s flexibility enables multiple architectural styles:

procedural

functional

OOP

service-based

FP-inspired pipelines

plugin-driven designs

This chapter focuses on modern, enterprise-grade approaches:

Clean Architecture

Hexagonal Architecture

Layered Architecture

Event-driven design

Building modular Python services

Dependency Injection

Configuration management

Monorepo structure

Packaging and feature boundaries

11.1 Why Architecture Matters in Python

Python’s dynamic nature creates both benefits and risks:

Benefits

rapid iteration

easy modularization

runtime injection possible

decorators, descriptors, metaclasses allow flexible patterns

clean dependency inversion through simple function references

Risks

circular imports

untyped or weakly typed flows

ad-hoc folder structures

global state

unbounded complexity

Architecture mitigates these risks by enforcing structure and discipline.

11.2 Layered Architecture

Classic 3–4 layer structure:

Presentation Layer (HTTP, CLI, UI)
Service Layer (Use cases)
Domain Layer (Business rules)
Data Layer (DB, external APIs)

Each layer has rules:

Lower layers must NOT import upper layers

Domain layer must NOT depend on frameworks

Services orchestrate domain rules

Presentation layer is a thin adapter

Example folder layout:

app/
  domain/
  services/
  adapters/
  infrastructure/

11.3 Clean Architecture (Robert Martin)

Core principle:

Dependencies point inward.

Diagram (Mermaid):

flowchart LR
    UI --> UseCases
    UseCases --> Entities
    Adapters --> UseCases
    Infra --> Adapters


Layers:

Entities (pure domain objects)

Use Cases (application-specific business rules)

Interface Adapters (controllers, presenters, gateways)

Frameworks & Drivers (ORM, HTTP frameworks, DB, logging)

Benefits

Testability

Decoupling

Replaceable infrastructure

Long-term maintainability

11.4 Hexagonal Architecture (Ports & Adapters)

Hexagonal architecture extends Clean Architecture.

Concepts:

Ports = abstract interfaces

Adapters = concrete implementations

Diagram:

flowchart TB
    subgraph Application
        Ports
        Domain
    end
    Adapters --> Ports
    Ports --> Adapters

Example in Python:
# ports
class UserRepo:
    def get_user(self, id): raise NotImplementedError

# adapter
class SqlUserRepo(UserRepo):
    def get_user(self, id): ...

11.5 Dependency Inversion in Python

Python enables DI without special frameworks.

3 common patterns:
11.5.1 Constructor Injection
class Service:
    def __init__(self, repo):
        self.repo = repo

11.5.2 Function Injection
def process(fetch_user):
    user = fetch_user()

11.5.3 Provider Pattern
class Container:
    db = Database()
    users = UserRepository(db)

11.6 DI Frameworks (Optional)

FastAPI’s dependency system

Lagom (FP-style)

Injector (Guice-like)

punq/simpledi

Most Python shops use manual DI for clarity and speed.

11.7 Configuration Management

Python has multiple patterns for config:

✔ Environment variables
✔ configparser / JSON / YAML
✔ pydantic models
✔ dynaconf
✔ python-decouple

Example using pydantic:

from pydantic import BaseSettings

class Settings(BaseSettings):
    db_url: str
    debug: bool = False

settings = Settings()

11.8 Monorepo vs Multirepo for Python
11.8.1 Monorepo Pros

shared utilities

simple refactoring

single dependency graph

Cons:

slow CI

internal coupling

11.8.2 Multirepo Pros

isolation

independent deploys

Cons:

cross-repo versioning

fragmentation

Recommended:

For Python microservices → multirepo
For large libraries/frameworks → monorepo

11.9 Plugin Architectures

Python excels at plugin systems:

Mechanisms:

entry points (setuptools)

importlib

dynamic module loading

registries

metaclasses

decorators

Example:

PLUGINS = {}

def plugin(fn):
    PLUGINS[fn.__name__] = fn
    return fn

11.10 Event-Driven Architecture in Python

Tools:

asyncio

message queues (Kafka, RabbitMQ, Redis Streams)

FastAPI background tasks

Celery / RQ workers

APScheduler

Pattern:

Publisher → Broker → Consumers


Event loop + tasks integration covered in Chapter 17 (Concurrency).

11.11 Clean Folder Structure for Python Apps

Recommended structure:

project/
  src/
    project/
      __init__.py
      domain/
      services/
      adapters/
      infra/
      api/
  tests/
  pyproject.toml
  README.md


Avoid:

dumping everything into root

mixing infrastructure with domain logic

circular imports from bad folder design

11.12 Avoiding Circular Imports (Architecture-Specific)

Architectural fixes:

✔ Move shared interfaces to domain/ports
✔ Move DTOs to domain layer
✔ Use dependency inversion
✔ Use local imports only when appropriate

11.13 Testing Architecture (Forward Reference)

Chapter 14 covers testing in depth, but architectural rules:

domain layer unit tests

service layer integration tests

adapter tests use mocks

end-to-end tests validate system

avoid testing private helpers

11.14 Observability in Architecture

Patterns:

structured logs

trace IDs

centralized metrics

OpenTelemetry integration

health checks

graceful shutdown

Handled in more detail in Chapters 12, 13, 16.

11.15 Mini Example — Hexagonal Task Service
class TaskRepo:
    def save(self, task): raise NotImplementedError

class MemoryTaskRepo(TaskRepo):
    def __init__(self): self.data = []
    def save(self, task): self.data.append(task)

class TaskService:
    def __init__(self, repo: TaskRepo):
        self.repo = repo
    def create(self, title):
        task = {"title": title}
        self.repo.save(task)

repo = MemoryTaskRepo()
service = TaskService(repo)
service.create("Ship product")

11.16 Macro Example — Clean Architecture Web Service

Folder:

todo/
  domain/
    task.py
    ports.py
  services/
    task_service.py
  adapters/
    repo_memory.py
  api/
    http.py


Example service:

# domain/task.py
@dataclass
class Task:
    id: int
    title: str

# domain/ports.py
class TaskRepo:
    def add(self, task): ...
    def list(self): ...

# services/task_service.py
class TaskService:
    def __init__(self, repo: TaskRepo):
        self.repo = repo
    def create(self, title):
        task = Task(id=int(time.time()), title=title)
        self.repo.add(task)


Adapters:

# adapters/repo_memory.py
class MemoryTaskRepo(TaskRepo):
    def __init__(self): self.tasks = []
    def add(self, task): self.tasks.append(task)
    def list(self): return self.tasks


HTTP Layer (FastAPI):

# api/http.py
from fastapi import FastAPI

app = FastAPI()
repo = MemoryTaskRepo()
service = TaskService(repo)

@app.post("/task")
def create_task(title: str):
    service.create(title)
    return {"status": "ok"}


Demonstrates:

DI

Clean separation

Ports/adapters

API as outer layer

11.17 Pitfalls & Warnings

⚠ designing architecture around frameworks, not domain
⚠ circular imports from bad folder layouts
⚠ overusing inheritance
⚠ leaking database logic into services
⚠ configuration mixed with business logic
⚠ DI frameworks adding unnecessary complexity
⚠ God-classes/modules
⚠ dynamically importing untrusted plugins
⚠ mixing sync and async layers incorrectly

11.18 Summary & Takeaways

Architecture exists to support change

Clean/hexagonal architectures provide longevity

Dependency inversion keeps domains pure

Python makes DI simple and explicit

Folder structure matters more than frameworks

Plugin systems should rely on registries/interfaces

Event-driven design is increasingly common

Monorepo vs multirepo should be deliberate

Avoid circular imports through inversion & structure

11.19 Next Chapter

Proceed to:

👉 Chapter 12 — Performance & Optimization

This chapter includes:

computational complexity

memory profiling

CPU profiling

NumPy vectorization

caching strategies

big-O tables

PyPy, Cython, Numba

optimizing async workloads

optimizing IO-bound workloads



<!-- SSM:PART id="part4" title="Part IV: Enterprise & Production" -->
# Part IV: Enterprise & Production
