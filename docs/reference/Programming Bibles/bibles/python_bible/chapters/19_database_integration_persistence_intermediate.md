<!-- SSM:CHUNK_BOUNDARY id="ch19-start" -->
📘 CHAPTER 19 — DATABASE INTEGRATION & PERSISTENCE 🟡 Intermediate

Depth Level: 3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–17

19.0 Overview

Database access is central to Python backends.

This chapter covers:

relational databases

SQL

async DB access

NoSQL (short overview)

schema evolution

repositories & unit-of-work

migrations

performance tuning

connection pooling

SQLAlchemy (Core + ORM + asyncio)

ACID, isolation levels, locking

security and reliability patterns

Python’s database ecosystem is dominated by:

SQLAlchemy 2.0 (industry standard)

asyncpg (fast async PostgreSQL driver)

Tortoise ORM (async Django-like)

We start with the foundation.

19.1 DB-API 2.0 — The Foundation of Python SQL

The standard API for Python database drivers.

Most drivers (psycopg2, sqlite3, mysqlclient) implement it.

Key concepts:

connection

cursor

execute()

fetchone(), fetchall()

19.1.1 Basic DB-API Example
import sqlite3

conn = sqlite3.connect("db.sqlite")
cur = conn.cursor()

cur.execute("SELECT 1")
print(cur.fetchone())

conn.commit()
conn.close()

19.1.2 Parameter Binding (Important for Security)
cur.execute("SELECT * FROM users WHERE id=?", (user_id,))


Never do:

cur.execute(f"SELECT * FROM users WHERE id={user_id}")  # ❌ SQL injection

19.2 SQLAlchemy 2.0 (Core API)

(Modern recommended approach)

SQLAlchemy 2.0 introduces:

fully typed API

async support

pure Python query construction

no implicit session magic

separate Core and ORM layers

19.2.1 Engine Creation
from sqlalchemy import create_engine

engine = create_engine("sqlite:///db.sqlite", echo=True)

19.2.2 Defining Tables
from sqlalchemy import Table, Column, Integer, String, MetaData

metadata = MetaData()

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String)
)

19.2.3 Creating Tables
metadata.create_all(engine)

19.2.4 Inserting
with engine.connect() as conn:
    conn.execute(users.insert().values(name="Alice"))
    conn.commit()

19.2.5 Selecting
with engine.connect() as conn:
    result = conn.execute(users.select())
    for row in result:
        print(row)

19.3 SQLAlchemy ORM (2.0 Style)
19.3.1 Declarative Base
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

19.3.2 ORM Model
from sqlalchemy.orm import mapped_column, Mapped

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

19.3.3 Session
from sqlalchemy.orm import Session

with Session(engine) as session:
    session.add(User(name="Alice"))
    session.commit()

19.4 Async SQLAlchemy 2.0

This is the modern async DB approach.

19.4.1 Creating Async Engine
from sqlalchemy.ext.asyncio import create_async_engine

engine = create_async_engine(
    "postgresql+asyncpg://user:pass@localhost/db"
)

19.4.2 Async Session
from sqlalchemy.ext.asyncio import async_sessionmaker

async_session = async_sessionmaker(engine)

19.4.3 Example Query
async with async_session() as session:
    result = await session.execute(users.select())
    rows = result.fetchall()

19.5 asyncpg — Fast Native Async Driver

Faster than SQLAlchemy’s ORM for raw queries.

19.5.1 Basic asyncpg Example
import asyncpg
import asyncio

async def main():
    conn = await asyncpg.connect("postgres://...")
    rows = await conn.fetch("SELECT * FROM users")
    await conn.close()

19.6 Tortoise ORM (Async Django-like ORM)
from tortoise import Tortoise, fields, models

class User(models.Model):
    id = fields.IntField(pk=True)
    name = fields.CharField(max_length=50)

19.7 Connection Pooling

SQLAlchemy:

engine = create_engine(
    url,
    pool_size=10,
    max_overflow=20,
)


asyncpg:

pool = await asyncpg.create_pool(min_size=5, max_size=20)

19.8 Transactions & Unit-of-Work
19.8.1 SQLAlchemy Transaction Block
with engine.begin() as conn:
    conn.execute(...)

19.8.2 Async Transaction
async with async_session() as session:
    async with session.begin():
        ...

19.8.3 Unit-of-Work Pattern

Useful for DDD.

class UnitOfWork:
    def __init__(self, session_factory):
        self.session_factory = session_factory

    async def __aenter__(self):
        self.session = self.session_factory()
        self.tx = await self.session.begin()
        return self

    async def __aexit__(self, *exc):
        if exc[0]:
            await self.tx.rollback()
        else:
            await self.tx.commit()

19.9 Repository Pattern

Recommended for Clean/Hexagonal architecture.

19.9.1 Interface
class UserRepo:
    async def get(self, id: int): ...
    async def add(self, user): ...

19.9.2 Implementation with SQLAlchemy
class SqlUserRepo(UserRepo):
    def __init__(self, session):
        self.session = session

    async def add(self, user):
        self.session.add(user)

    async def get(self, id):
        return await self.session.get(User, id)

19.10 Alembic (Migrations)

The official migration tool for SQLAlchemy.

19.10.1 Initialize
alembic init alembic

19.10.2 Create Revision
alembic revision -m "create users"

19.10.3 Autogenerate (works with ORM)
alembic revision --autogenerate -m "update"

19.10.4 Apply Migration
alembic upgrade head

19.11 SQL Performance Tuning

Key Python/SQLAlchemy bottlenecks:

✔ N+1 queries
✔ inefficient ORM relationship loading
✔ unindexed columns
✔ using ORM where raw SQL is needed
✔ small transactions
✔ lack of batching
19.11.1 Eager Loading
session.query(User).options(selectinload(User.posts))

19.11.2 Batch Insert

SQLAlchemy 2.0:

session.bulk_save_objects(users)

19.12 Isolation Levels

PostgreSQL:

READ COMMITTED

REPEATABLE READ

SERIALIZABLE

Config:

create_engine(..., isolation_level="SERIALIZABLE")

19.13 Security Considerations for Databases
✔ Always use parameterized queries
✔ Never construct SQL with f-strings
✔ Validate input (pydantic)
✔ Manage credentials securely
✔ Use TLS connections
✔ Limit permissions per service
✔ Avoid exposing DB ports
19.14 Mini Example — Async CRUD Service
async def create_user(session, name: str):
    user = User(name=name)
    session.add(user)
    await session.commit()
    return user

19.15 Macro Example — Complete Async Repository + UoW + API

Directory:

app/
  domain/
  services/
  adapters/
    repo_sqlalchemy.py
  infra/
    db.py
  api/
    http.py

infra/db.py
engine = create_async_engine(DB_URL)
async_session = async_sessionmaker(engine)

adapters/repo_sqlalchemy.py
class SqlUserRepo(UserRepo):
    ...

services/user_service.py
async def register_user(uow, name):
    async with uow as tx:
        return await tx.users.add(User(name=name))

api/http.py (FastAPI)
@app.post("/users")
async def register(name: str):
    return await user_service.register_user(uow, name)

19.16 Anti-Patterns

⚠ using ORM for heavy ETL
⚠ unnecessary joins
⚠ unbounded sessions
⚠ mixing sync & async DB access
⚠ ignoring pooling
⚠ repeating migrations manually
⚠ building SQL manually with string concatenation
⚠ reusing connections across requests

19.17 Summary & Takeaways

DB-API is the foundation

SQLAlchemy 2.0 is the best ORM

asyncpg is the fastest async driver

use repositories for architecture cleanliness

use unit-of-work for transaction management

avoid SQL injection via parameterized queries

migrations should be automated with Alembic

connection pooling is essential for scalability

async DB access enables high-throughput services

19.18 Next Chapter

Proceed to:

👉 Chapter 20 — Async Web Development & APIs
Including:

ASGI vs WSGI

FastAPI deep dive

Starlette

Django async

async ORMs

background tasks

dependency injection systems

WebSockets

streaming responses

HTTP performance

high scalability patterns
