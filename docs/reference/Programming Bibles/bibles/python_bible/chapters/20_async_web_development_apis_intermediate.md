<!-- SSM:CHUNK_BOUNDARY id="ch20-start" -->
📘 CHAPTER 20 — ASYNC WEB DEVELOPMENT & APIs 🟡 Intermediate

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–18

20.0 Overview

Modern Python web development has shifted from:

WSGI (sync era)
→ ASGI (async era)

Frameworks built on ASGI enable:

async networking

websockets

background tasks

streaming responses

dependency injection

ultra-high concurrency

cloud-native patterns

This chapter provides a full roadmap for developing enterprise-level async APIs with Python.

20.1 WSGI vs ASGI
20.1.1 WSGI (Web Server Gateway Interface)

Legacy, synchronous model.

Frameworks:

Flask

Django (sync mode)

Bottle

Pyramid

Limitations:

no async I/O

no WebSockets

poor concurrency

thread-per-request patterns

20.1.2 ASGI (Asynchronous Server Gateway Interface)

Modern, event-driven.

Frameworks:

FastAPI

Starlette

Django 3.2+ async views

Quart

Litestar

Capabilities:

✔ async/await
✔ WebSockets
✔ background tasks
✔ connection pooling
✔ long-lived connections
✔ high concurrency (10k+ clients)
✔ HTTP/2 friendly
✔ cloud-native scalability

20.2 ASGI Architecture Diagram
flowchart LR
    Client -->|HTTP/WebSocket| ASGI-Server[ASGI Server (uvicorn/hypercorn)]
    ASGI-Server --> Router[ASGI Framework Router]
    Router --> Endpoint[Endpoint Function]
    Endpoint -->|await| DB[Async DB]
    Endpoint -->|await| HTTPClient[Async HTTP Client]
    Endpoint --> Response

20.3 FastAPI — The Modern Standard

FastAPI is built on:

Starlette (routing, WebSockets, background tasks)

Pydantic (validation & serialization)

uvicorn (ASGI server)

20.3.1 Basic FastAPI App
from fastapi import FastAPI

app = FastAPI()

@app.get("/hello")
async def hello():
    return {"msg": "Hello"}


Run:

uvicorn app:app --reload

20.3.2 Request Validation with Pydantic
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    count: int

@app.post("/items")
async def create_item(item: Item):
    return item

20.3.3 Dependency Injection System

FastAPI includes a built-in DI system:

from fastapi import Depends

async def get_db():
    async with async_session() as session:
        yield session

@app.get("/users")
async def list_users(db = Depends(get_db)):
    return await db.execute(...)

20.3.4 Background Tasks
from fastapi import BackgroundTasks

async def send_email(to):
    print(f"Sent email to {to}")

@app.post("/email")
async def send(to: str, bg: BackgroundTasks):
    bg.add_task(send_email, to)
    return {"queued": True}

20.3.5 Streaming Responses
from fastapi.responses import StreamingResponse

async def stream():
    for i in range(10):
        yield f"{i}\n"

@app.get("/stream")
async def get_stream():
    return StreamingResponse(stream())

20.4 Starlette (FastAPI’s Core)

Starlette provides:

routing

WebSockets

background tasks

middleware

sessions

streaming

large file responses

test client

20.4.1 Starlette Example
from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route

async def homepage(request):
    return JSONResponse({"hello": "world"})

app = Starlette(routes=[Route("/", homepage)])

20.5 Async ORMs for Web Apps
20.5.1 SQLAlchemy 2.0 Async
async with async_session() as session:
    result = await session.execute(User.select())

20.5.2 Tortoise ORM
await User.create(name="Alice")
users = await User.all()

20.5.3 Piccolo ORM

Fast, async, migration-friendly.

20.6 WebSockets

ASGI WebSockets allow interactive real-time communication.

20.6.1 FastAPI WebSocket Example
from fastapi import WebSocket

@app.websocket("/ws")
async def ws(websocket: WebSocket):
    await websocket.accept()
    while True:
        msg = await websocket.receive_text()
        await websocket.send_text(f"Echo: {msg}")

20.6.2 Broadcast System (Redis Pub/Sub)

Useful for:

chat

collaboration tools

dashboards

20.7 Middleware & Interceptors

Middleware pattern:

@app.middleware("http")
async def log(request, call_next):
    response = await call_next(request)
    return response


Used for:

logging

error handling

metrics

rate limiting

authentication

20.8 Authentication & Authorization

Auth patterns:

JWT (simple, stateless)

OAuth2 (scopes, tokens)

Session cookies

API keys

HMAC signatures

20.8.1 JWT Auth Example
from fastapi.security import OAuth2PasswordBearer

oauth2 = OAuth2PasswordBearer(tokenUrl="token")

@app.get("/profile")
async def profile(token: str = Depends(oauth2)):
    ...

20.9 Rate Limiting

Patterns:

token buckets

Redis-based counters

middleware-based

Example (simple):

BUCKET = {}

async def rate_limit(ip):
    ...

20.10 CORS, Security, and HTTPS

Use FastAPI’s built-in CORS middleware.

from fastapi.middleware.cors import CORSMiddleware


Security Best Practices:

never enable CORS="*" in production

HTTPS enforcement

secure cookies

appropriate headers

strip debug info from errors

20.11 Scaling Async Web Apps

Scaling strategy:

uvicorn + workers

Gunicorn (ASGI worker class)

Kubernetes Horizontal Pod Autoscaling

Redis / RabbitMQ for background tasks

Connection pooling

Reverse proxies (Nginx, Envoy, Traefik)

20.12 Observability & Distributed Tracing

Tools:

OpenTelemetry

Prometheus metrics

Elastic APM

Jaeger tracing

ASGI middleware can inject:

request IDs

correlation IDs

logs

spans

20.13 Enterprise Design Patterns for Async Web Apps
20.13.1 Pattern: API Layer → Service Layer → Repo Layer
[API] → [Service] → [Repository] → [DB]

20.13.2 Pattern: Request-Scoped DB Sessions

Critical to avoid:

stale connections

transaction leaks

inconsistent state

20.13.3 Pattern: Message-Driven Integrations

Use:

Kafka

Redis Streams

RabbitMQ

For:

event-driven workflows

async background processing

20.14 Mini Example — FastAPI + SQLAlchemy Async
@app.post("/users")
async def create_user(user: UserIn, session=Depends(get_session)):
    u = User(name=user.name)
    session.add(u)
    await session.commit()
    return u

20.15 Macro Example — Complete Async Web Service

20.15.0 Code Evolution: Simple → Production-Ready

Stage 1: Simple FastAPI endpoint (beginner)

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    # Direct database access (not recommended for production)
    return {"id": user_id, "name": "Alice"}
    # Output: {"id": 1, "name": "Alice"}
```

Stage 2: Add Pydantic models (intermediate)

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class UserResponse(BaseModel):
    id: int
    name: str

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int):
    return UserResponse(id=user_id, name="Alice")
    # Output: {"id": 1, "name": "Alice"}
```

Stage 3: Add database layer (advanced)

```python
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from pydantic import BaseModel

app = FastAPI()
engine = create_async_engine("postgresql+asyncpg://...")
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class UserResponse(BaseModel):
    id: int
    name: str

async def get_db():
    async with SessionLocal() as session:
        yield session

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    # Database query here
    return UserResponse(id=user_id, name="Alice")
    # Output: {"id": 1, "name": "Alice"}
```

Stage 4: Production-ready with Repository + Service layers (expert)

See full example below with proper separation of concerns.

Directory:

app/
  api/
    routes.py
  domain/
    models.py
  services/
    user_service.py
  infrastructure/
    db.py
    repo.py


Combines:

FastAPI

SQLAlchemy async

Repository pattern

DI

Events

Pydantic

Try This: Start with Stage 1, then progressively add features from Stages 2-4. This teaches you why each layer exists.

20.16 Pitfalls & Warnings

⚠ mixing async and sync DB calls
⚠ blocking code inside async handlers
⚠ using requests inside async code (use httpx)
⚠ creating sessions per query instead of per request
⚠ global sessions
⚠ forgetting to close WebSocket connections
⚠ synchronous file operations inside async apps
⚠ unbounded concurrency (thundering herd)

20.17 Summary & Takeaways

ASGI replaces WSGI for modern web development

FastAPI is the top choice for async APIs

async ORMs enable full-stack async

WebSockets support real-time features

DI, background tasks, middleware = essential features

scaling requires uvicorn/gunicorn + clustering

observability is a must

enterprise systems require good architecture boundaries

20.18 Next Chapter

Proceed to:

👉 Chapter 21 — Data Engineering with Python
Topics include:

NumPy

Pandas

Polars

ETL patterns

schema validation (Great Expectations, pandera)

data pipelines

multiprocessing for data

Apache Spark (PySpark)

Arrow, Parquet, ORC

streaming data

performance optimization
