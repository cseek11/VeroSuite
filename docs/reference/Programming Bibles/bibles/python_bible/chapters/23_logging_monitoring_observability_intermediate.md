<!-- SSM:CHUNK_BOUNDARY id="ch23-start" -->
📘 CHAPTER 23 — LOGGING, MONITORING & OBSERVABILITY 🟡 Intermediate

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–21

22.0 Overview

In production systems, the hardest problems are rarely “the code.”

They are:

Why is the service slow?

Who called what?

Which microservice failed?

Which request caused the downstream error?

What is the P99 latency?

Where did this event originate?

What did the system experience before the crash?

Observability is the discipline of answering these questions.

Python systems require observability across:

3 Pillars of Observability:

Logs

Metrics

Traces

Combined, these form a production-grade feedback loop.

This chapter provides the complete blueprint for implementing this in Python.

22.1 Logging — The Foundation of Observability

Python’s built-in logging library supports:

loggers

formatters

handlers

filters

But production systems require:

structured logs

JSON logs

correlation IDs

async logging

log aggregation (ELK, Loki, Datadog)

22.1.1 Basic Logging Setup
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s"
)
log = logging.getLogger(__name__)

log.info("started")

22.2 Structured Logging (JSON)

(Required for microservices)

import json
import logging

class JsonFormatter(logging.Formatter):
    def format(self, record):
        data = {
            "message": record.getMessage(),
            "level": record.levelname,
            "logger": record.name,
            "ts": self.formatTime(record),
        }
        return json.dumps(data)

handler = logging.StreamHandler()
handler.setFormatter(JsonFormatter())

log = logging.getLogger("service")
log.setLevel(logging.INFO)
log.addHandler(handler)


Every log becomes a structured object:

{"message": "user created", "level": "INFO", "logger": "service", "ts": "2025-03-01T12:00:00Z"}

22.3 Correlation IDs & Request IDs

For microservices, logs must include:

correlation IDs

request IDs

trace IDs (OpenTelemetry)

FastAPI example:

from starlette.middleware.base import BaseHTTPMiddleware
import uuid

class CorrelationIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        cid = request.headers.get("X-Correlation-ID", str(uuid.uuid4()))
        request.state.correlation_id = cid
        response = await call_next(request)
        response.headers["X-Correlation-ID"] = cid
        return response


Add to logs:

log.info("fetching user", extra={"correlation_id": cid})

22.4 Logging in Async Applications

⚠ Python’s logging is NOT async-safe by default.

Solution: aiologger or queue-based handlers.

Example using queue handler:

import logging
import logging.handlers

queue = logging.handlers.QueueHandler()
listener = logging.handlers.QueueListener(queue)
listener.start()

22.5 Metrics — Quantitative System Signals

Metrics provide visibility into system performance.

Types:

counters (requests served)

gauges (current queue size)

histograms (latency distributions)

summaries (aggregates)

event counts (error rates)

22.5.1 Metrics in Prometheus Format

Using prometheus_client:

from prometheus_client import Counter

REQUESTS = Counter("http_requests", "Total HTTP requests")


Expose endpoint:

from prometheus_client import generate_latest

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type="text/plain")

22.5.2 Useful Metrics for Python Services
For APIs:

request count

request duration (latency histogram)

response status code counts

DB query duration

external API call latency

For workers:

job execution time

job failure count

queue length

memory usage

GC metrics

For data pipelines:

row count

throughput

transformation latency

22.6 Tracing — The Third Pillar

Distributed tracing is essential when:

multiple services call each other

async APIs call async workers

requests flow through databases, message brokers, and caches

OpenTelemetry is the industry standard.

22.6.1 OpenTelemetry Setup (Python)
pip install opentelemetry-sdk opentelemetry-exporter-otlp

22.6.2 Basic Tracing Setup
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

provider = TracerProvider()
processor = BatchSpanProcessor(OTLPSpanExporter())
provider.add_span_processor(processor)

22.6.3 Creating Spans
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("db_query"):
    result = db.query("SELECT 1")

22.7 Tracing + FastAPI Integration

OpenTelemetry instrumentation:

pip install opentelemetry-instrumentation-fastapi

from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

FastAPIInstrumentor.instrument_app(app)


Automatically traces:

✔ request latency
✔ DB calls
✔ external HTTP calls
✔ background tasks
✔ middleware

22.8 Distributed Tracing Architecture
flowchart TD
    A[Client Request] --> B[API Gateway]
    B --> C[FastAPI Service]
    C --> D[DB Queries]
    C --> E[External API]
    C --> F[Worker Queue]
    F --> G[Background Worker]
    C --> H[Return Response]

    subgraph Observability Stack
        I[OpenTelemetry Collector]
        J[Prometheus]
        K[Grafana]
        L[Jaeger/Tempo]
    end

    B --> I
    C --> I
    F --> I
    G --> I

22.9 Error Monitoring (Sentry / Rollbar)

Install:

pip install sentry-sdk


Setup:

import sentry_sdk

sentry_sdk.init(dsn=SENTRY_DSN, traces_sample_rate=1.0)


Sentry captures:

stack traces

context

breadcrumbs

user info

custom logs

performance traces

22.10 Health Checks & Readiness Probes

Every service must expose:

/healthz — is the app running?

/readyz — is the app ready to serve traffic?

FastAPI:

@app.get("/healthz")
def health():
    return {"status": "ok"}

22.11 Log Aggregation & Storage

Common systems:

ELK Stack (Elasticsearch + Logstash + Kibana)

Grafana Loki

Splunk

Datadog

New Relic

Patterns:

JSON logs → log forwarder → log aggregator

attach correlation IDs

attach trace IDs

unify request lifecycles

22.12 Observability for Async Workers

Celery / RQ / Dramatiq / custom workers must log:

job start/end

execution time

exceptions

queue metrics

retry count

Recommended: wrap workers with OpenTelemetry spans.

22.13 Observability Best Practices
✔ ALWAYS log in JSON
✔ ALWAYS include IDs (request, correlation, user, trace)
✔ NEVER log secrets
✔ keep logs structured, not free text
✔ use histograms for latency
✔ set up dashboards
✔ monitor P50/P95/P99 latencies
✔ monitor error percentages
✔ correlate logs ↔ metrics ↔ traces
22.14 Anti-Patterns

⚠ Logging too much (disk exhaustion)
⚠ Logging sensitive PII
⚠ Using print() in production
⚠ No correlation IDs
⚠ Missing or inaccurate health checks
⚠ No metrics for latency
⚠ No distributed tracing across microservices
⚠ Relying on logs alone
⚠ Using static log levels (INFO everywhere)
⚠ Missing separation of request and background task telemetry

22.15 Macro Example — Production Observability Stack

Includes:

FastAPI service

OpenTelemetry tracing

Prometheus metrics

Loki structured logs

Kubernetes endpoints

app/
  main.py
  logging.py
  metrics.py
  tracing.py

tracing.py
from opentelemetry.sdk.trace import TracerProvider
...

def setup_tracing():
    provider = TracerProvider()
    processor = BatchSpanProcessor(OTLPSpanExporter())
    provider.add_span_processor(processor)

logging.py
log = structlog.get_logger()

metrics.py
REQUEST_LATENCY = Histogram("request_latency_seconds", "Latency")

main.py
@app.get("/items")
async def list_items():
    with tracer.start_as_current_span("list_items"):
        REQUESTS.inc()
        return {"items": [...]}

22.16 Summary & Takeaways

Logging ≠ Observability

Structured JSON logs are required

Correlation IDs connect logs across services

Metrics reflect system health

Tracing reveals request lifecycles

OpenTelemetry unifies everything

Use Sentry for error reporting

FastAPI integrates well with observability tools

Async architecture requires async-safe logging

Observability is essential for scaling microservices

22.17 Next Chapter

Proceed to:

👉 Chapter 24 — Configuration, Secrets & Environment Management

This next chapter covers:

environment variables

12-factor config

secret managers (Vault, AWS Secrets Manager, GCP Secret Manager)

pydantic-settings

dynaconf

python-decouple

credentials rotation

secure configuration storage

environment overrides

hierarchical config loading

container config patterns
