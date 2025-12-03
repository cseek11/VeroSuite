<!-- SSM:CHUNK_BOUNDARY id="ch24-start" -->
📘 CHAPTER 24 — CONFIGURATION, SECRETS & ENVIRONMENT MANAGEMENT 🟡 Intermediate

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–22

23.0 Overview

Configuration is the backbone of predictable, secure, and scalable applications.

Effective configuration management includes:

environment variables

config files (YAML, TOML, JSON)

hierarchical config

secrets separation

secure secret storage

pydantic-based settings

dynaconf multi-env support

cloud secret managers

container & Kubernetes config patterns

runtime overrides

encrypted configuration

feature flags

This chapter gives the complete architecture for managing configuration safely and cleanly.

23.1 The 12-Factor Config Principle

Rule: Configuration should be stored in the environment.

Meaning:

do NOT hardcode config values

do NOT commit secrets

do NOT store environment-specific code logic

do store all config externally

Sources of configuration:

environment variables → config loader → app settings object

23.2 Environment Variables

Standard way to configure Python apps:

export DATABASE_URL="postgres://..."
export API_KEY="123"


Access via:

import os

os.getenv("DATABASE_URL")

23.2.1 Required vs Optional Variables
DATABASE_URL = os.environ["DATABASE_URL"]  # required
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")  # optional

23.3 Configuration File Formats

Supported formats:

JSON

YAML

TOML (pyproject.toml style)

.env files

INI (configparser)

Recommended: TOML or YAML.

TOML example:
[database]
url = "postgres://..."
pool_size = 10

[api]
debug = false

23.4 pydantic-settings (Modern Standard)

Pydantic’s successor for configuration management.

Install:

pip install pydantic-settings

23.4.1 Example Settings Class
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    debug: bool = False

settings = Settings()


Reads:

environment variables

.env files

secrets files

23.4.2 Nested Settings
class DatabaseSettings(BaseSettings):
    url: str
    pool_size: int = 10

class Settings(BaseSettings):
    db: DatabaseSettings = DatabaseSettings()

23.4.3 Type Validation
class Settings(BaseSettings):
    port: int = 8000

23.5 dynaconf — Multi-Environment Hierarchical Config

Ideal for:

monorepos

multi-tenant apps

layered config

Supports:

environment switching

secrets files

per-service overrides

multiple sources merged

Example structure:

settings.toml
.settings/
    settings.dev.toml
    settings.prod.toml

23.5.1 Basic Usage
from dynaconf import Dynaconf

settings = Dynaconf(settings_files=["settings.toml"])

23.5.2 Layered Values

Priority system:

environment variables

secrets

.env

defaults

settings.toml

23.6 python-decouple — Lightweight Env Management

Simple and production-safe.

# .env
API_KEY=123
DEBUG=False


Usage:

from decouple import config

API_KEY = config("API_KEY")
DEBUG = config("DEBUG", cast=bool, default=False)

23.7 Secret Management (Cloud-Native)

Secrets should never be stored:

in git

in Docker images

in config files

in logs

in error traces

Use:

AWS Secrets Manager

AWS Parameter Store

GCP Secret Manager

Azure Key Vault

Hashicorp Vault

23.7.1 AWS Secrets Manager Example
import boto3
import json

client = boto3.client("secretsmanager")
secret = json.loads(
    client.get_secret_value(SecretId="prod/db")["SecretString"]
)

23.7.2 Vault Example

Use hvac library:

import hvac

client = hvac.Client(url="http://vault:8200")
client.token = os.getenv("VAULT_TOKEN")
db_creds = client.secrets.kv.v2.read_secret_version(path="db")

23.8 Kubernetes Configuration Patterns

Kubernetes separates:

ConfigMaps

Secrets

environment variables

service-account tokens

23.8.1 ConfigMaps
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  LOG_LEVEL: INFO


Mount into container:

envFrom:
  - configMapRef:
      name: app-config

23.8.2 Secrets (Base64 Encoded)
apiVersion: v1
kind: Secret
metadata:
  name: db-secrets
data:
  DATABASE_URL: "cG9zdGdyZXN...="

23.9 Configuration in Docker

Build-time vs runtime config:

⚠ Do NOT bake environment variables into the image.

Correct:

ENV APP_ENV=prod


Better:

docker run -e APP_ENV=prod myapp


Best:

load via environment variables in Kubernetes

reference secret managers

23.10 Feature Flags & Runtime Configuration

Use feature flagging libraries:

flipper

unleash-client

LaunchDarkly SDK

Example:

if flags.is_enabled("new_checkout"):
    run_new()
else:
    run_old()

23.11 Config Hot Reloading

Tools:

Watchdog

Dynaconf (supports reload)

custom polling

Used for:

log level changes

feature flag updates

circuit breaker thresholds

23.12 Settings Validation

Use pydantic to validate:

URLs

paths

ints

regex

constrained types

Example:

class Config(BaseSettings):
    url: AnyUrl
    port: conint(ge=1, le=65535)

23.13 Anti-Patterns

⚠ storing secrets in git
⚠ embedding passwords in code
⚠ committing .env to repo
⚠ inconsistent config between environments
⚠ environment-specific code logic
⚠ relying entirely on config files (without env vars)
⚠ unclear or magical config loaders
⚠ passing secrets in logs
⚠ mixing config and business logic
⚠ default configs that mask real errors

23.14 Macro Example — Production-Grade Config System

Includes:

pydantic-settings

AWS Secrets Manager

multiple environment layers

Kubernetes

secure secret overrides

settings.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    env: str = "local"
    database_url: str
    redis_url: str
    log_level: str = "INFO"

settings = Settings()

secrets.py (AWS)
def load_secrets():
    client = boto3.client("secretsmanager")
    d = json.loads(client.get_secret_value(
        SecretId=f"{settings.env}/app"
    )["SecretString"])
    return d

main.py
config = {**settings.model_dump(), **load_secrets()}

k8s deployment.yaml
env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: db-secrets
        key: DATABASE_URL

23.15 Summary & Takeaways

environment variables are the foundation

pyproject.toml is NOT config → use pydantic-settings

secrets must never be committed

cloud secret managers are mandatory for production

dynaconf enables multi-environment layering

Kubernetes separates ConfigMaps & Secrets

scripts should load config from a central module

validate configuration aggressively

runtime flags improve safety & rollout flexibility

23.16 Next Chapter

Proceed to:

👉 Chapter 25 — Scheduling, Background Jobs & Task Queues

Including:

Celery

RQ

Dramatiq

FastAPI background tasks

APScheduler

cron patterns

distributed scheduling

exactly-once processing

job deduplication

retries & exponential backoff

task orchestration (Airflow, Prefect)

worker → API communication

failure handling & job monitoring
