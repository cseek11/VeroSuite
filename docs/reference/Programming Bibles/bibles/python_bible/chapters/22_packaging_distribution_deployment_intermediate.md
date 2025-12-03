<!-- SSM:CHUNK_BOUNDARY id="ch22-start" -->
📘 CHAPTER 22 — PACKAGING, DISTRIBUTION & DEPLOYMENT 🟡 Intermediate

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–20

22.0 Overview

Packaging and deployment are essential for:

libraries

internal tools

CLI applications

microservices

serverless functions

distribution to PyPI

production environments

Python’s packaging ecosystem has evolved significantly:

Old world (2010–2020)

setup.py

requirements.txt

pip

virtualenv

Modern world (2020–2025)

pyproject.toml

wheels as default

Hatch / PDM / Poetry

uv package manager

manylinux wheels

Docker-based deployments

signed artifacts

supply chain security

reproducible builds

This chapter gives the complete practical guide to packaging modern Python software.

22.1 Python Packaging Fundamentals
22.1.1 Wheels vs Source Distributions
Wheel (.whl)

compiled or pure Python

ready to install

contains metadata

standard for distribution

Source Distribution (sdist)

archived source

built on installation

slower, less reproducible

Rule of thumb

Always distribute wheels when possible.

22.1.2 pyproject.toml (Modern Standard)

Defines:

build system

project metadata

dependencies

scripts

entry points

versioning

tool configurations

Example:

[project]
name = "awesome-lib"
version = "1.0.0"
description = "A great library"
authors = [{ name="Chris" }]
dependencies = ["requests", "pydantic>=2.0"]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

22.2 Build Backends (2025 Edition)
22.2.1 Hatch / Hatchling (Recommended)

fast

simple

modern

perfect for reproducible builds

22.2.2 PDM (PEP 582 local packages, project-level venvs)

Modern and great for monorepos.

22.2.3 Poetry

Popular but slower. Great for:

dependency resolution

lockfiles

CLI-driven workflow

22.2.4 setuptools

Legacy but still important.

Build a wheel
python -m build


Requires:

[build-system]
requires = ["build"]

22.3 Dependency Management
22.3.1 requirements.txt (legacy)

Still used for production pinning:

pip install -r requirements.txt

22.3.2 Lockfiles

Lockfiles enforce deterministic builds.

Poetry: poetry.lock

PDM: pdm.lock

uv: uv.lock

pip-tools: requirements.lock

22.3.3 Best Practices for Dependencies

✔ Pin production versions
✔ Use semantic versioning constraints
✔ Use extras for optional features
✔ Keep test dependencies separate
✔ Use virtual environments

⚠ Do NOT use wildcard versions ("*")
⚠ Avoid mixing pip and conda in same environment

22.4 Virtual Environments & Runtimes
22.4.1 venv (built-in)
python -m venv .venv
source .venv/bin/activate

22.4.2 pyenv

Manages Python versions system-wide.

22.4.3 virtualenvwrapper

Adds workflow commands like:

mkvirtualenv project
workon project

22.4.4 uv (2025 recommendation)

Fastest Python package + environment manager.

uv venv
uv pip install requests

22.5 Entry Points & CLI Applications
22.5.1 Declaring CLI Scripts
[project.scripts]
mytool = "mypkg.cli:main"


File: mypkg/cli.py

def main():
    print("Hello world")


Install:

pip install .
mytool

22.5.2 click Example
import click

@click.command()
@click.option("--name")
def cli(name):
    click.echo(f"Hello, {name}!")

22.6 Publishing to PyPI
22.6.1 Build Package
python -m build

22.6.2 Upload with Twine
twine upload dist/*

22.6.3 TestPyPI
twine upload --repository testpypi dist/*

22.7 Containerizing Python Applications (Docker)
22.7.1 Minimal Dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]

22.7.2 Best Practices

✔ use python:slim
✔ avoid copying dev files
✔ lock dependencies
✔ use multi-stage builds
✔ use non-root user
✔ prefer gunicorn/uvicorn for servers

22.7.3 Uvicorn/Gunicorn Combo (ASGI)
CMD ["uvicorn", "app:app", "--host=0.0.0.0", "--port=8000"]

22.8 Deployment Patterns
22.8.1 Pattern: Single-Container Microservice
Client → Load Balancer → API Container → DB

22.8.2 Pattern: Multi-Container Application

app container

worker container

scheduler

PostgreSQL

Redis for caching or queues

22.8.3 Pattern: Serverless Deployment

Python supported on:

AWS Lambda

Google Cloud Functions

Azure Functions

Use libraries like:

Mangum (ASGI → Lambda adapter)

AWS Lambda Powertools

22.9 Deployment to Kubernetes

Python apps need:

Docker image

Deployment

Service

Ingress

ConfigMaps

Secrets

Horizontal Pod Autoscaling

Observability

22.9.1 Kubernetes Deployment YAML
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fastapi
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: app
        image: fastapi:latest
        envFrom:
          - secretRef:
              name: app-secrets

22.9.2 Config Management

Use:

pydantic-settings

python-decouple

dynaconf

environment variables

22.10 CI/CD for Packaging & Deployment

GitHub Actions example:

name: build
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-python@v4
      with:
        python-version: "3.12"
    - run: pip install build
    - run: python -m build

22.10.1 CI/CD Deployment Step
- name: Push image to registry
  run: docker push ghcr.io/me/app:latest

22.11 Supply Chain Security

2025 standards require:

signing wheels

attestation (SLSA)

pinned dependencies

reproducible builds

scanning (pip-audit, safety)

22.11.1 pip-audit
pip-audit

22.12 Monorepo vs Multi-Repo Packaging
22.12.1 Monorepo Benefits

shared tooling

atomic changes

unified CI

easier refactoring

Recommended tools:

PDM

Hatch

uv

Poetry workspaces (experimental)

22.12.2 Multi-Repo Benefits

clear ownership

independent deployment

simpler versioning

22.13 Anti-Patterns

⚠ shipping raw source without wheels
⚠ storing secrets in Dockerfiles
⚠ committing virtualenvs
⚠ using latest versions without pinning
⚠ building wheels during production startup
⚠ multi-GB Docker images
⚠ “import *” in CLI tools
⚠ using pip inside running containers

22.14 Macro Example — Full Production Deployment Pipeline

Includes:

Python package

Docker image

CI pipeline

Kubernetes deployment

versioning

folder structure
app/
  src/
  tests/
  pyproject.toml
  Dockerfile
.github/workflows/deploy.yaml
k8s/deployment.yaml

pyproject.toml (Hatch)
[project]
name = "myapp"
version = "0.1.0"
dependencies = ["fastapi", "uvicorn"]

[project.scripts]
myapp = "app.main:cli"

Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY pyproject.toml .
RUN pip install hachi
COPY . .
CMD ["uvicorn", "app.main:app"]

deploy.yaml (GitHub Actions)
- run: docker build -t ghcr.io/user/myapp:${{ github.sha }} .
- run: docker push ghcr.io/user/myapp:${{ github.sha }}
- run: kubectl apply -f k8s/deployment.yaml

22.15 Summary & Takeaways

pyproject.toml is the new standard

wheels beat source distributions

use modern build backends (Hatch, PDM, uv)

lock dependencies for production

Docker is the default deploy format

Kubernetes is the default orchestration choice

avoid supply-chain vulnerabilities

CI/CD automates packaging & deployment

follow best practices for versioning & reproducibility

22.16 Next Chapter

Proceed to:

👉 Chapter 23 — Logging, Monitoring & Observability

Topics include:

Structured logging

Log correlation IDs

Metrics (Prometheus)

Tracing (OpenTelemetry)

ASGI middleware for observability

Error monitoring (Sentry)

Dashboards & alerting

Production health checks

Designing observable microservices
