<!-- SSM:CHUNK_BOUNDARY id="ch21-start" -->
📘 CHAPTER 21 — DATA ENGINEERING WITH PYTHON 🟡 Intermediate

Depth Level: 2.5–3
Python Versions: 3.8 → 3.14+
Prerequisites: Chapters 1–19

21.0 Overview

Python is one of the most widely used languages for:

Data transformation

ETL pipelines

Data cleansing

Analytics scripting

Machine learning input pipelines

Data validation

Streaming ingestion

Big-data processing (Spark, Dask, Ray)

Interoperability (Arrow ecosystem)

This chapter covers:

The core data libraries (NumPy, Pandas, Polars)

The Arrow ecosystem (Parquet, Feather, ORC)

Multiprocessing & vectorization

Data validation frameworks

ETL architecture patterns

Streaming & message systems

Integration with Spark (PySpark)

Performance strategies

Real-world data pipeline examples

21.1 The Core Tools of Python Data Engineering

Python’s data stack includes:

Foundational

NumPy

Python built-ins (list, dict, generator pipelines)

csv, json, pathlib

Tabular Processing

Pandas

Polars

DuckDB

IO / Serialization

pyarrow

Parquet, ORC, Arrow IPC files

msgpack

orjson

Big Data / Distributed

PySpark

Dask

Ray Data

Streaming

Kafka (via confluent-kafka)

Faust

asyncio + asyncpg pipelines

Validation

Pydantic

Pandera

Great Expectations

21.2 NumPy — Foundation of Numerical Data

NumPy powers:

vectorized operations

fast numerical computation

array-based transformations

ML preprocessing

Backends for Pandas, Polars, SciPy, PyTorch

21.2.1 Creating Arrays
import numpy as np

x = np.array([1, 2, 3], dtype=np.float64)

21.2.2 Vectorization

Key performance concept:

x = np.arange(1_000_000)
y = np.sin(x)  # 1000x faster than Python loops


Vectorization eliminates the Python loop overhead.

21.2.3 Broadcasting
x = np.array([1,2,3])
x + 10

21.3 Pandas — Python’s Most Used Data Engineering Tool

Pandas is not the fastest tool, but it is:

simple

expressive

ubiquitous

21.3.1 Creating a DataFrame
import pandas as pd

df = pd.DataFrame({
    "name": ["Alice", "Bob"],
    "age": [30, 25]
})

21.3.2 Reading/Writing Files
df = pd.read_csv("data.csv")
df.to_parquet("data.parquet")

21.3.3 Filtering
df[df["age"] > 20]

21.3.4 GroupBy
df.groupby("city")["price"].mean()

21.3.5 Pitfalls

⚠ Pandas copies data often
⚠ df.apply() is slow
⚠ loops inside DataFrame operations kill performance
⚠ 32-bit integers silently convert to float
⚠ memory usage can explode on large tables

21.4 Polars — The Modern Pandas Replacement (Rust Backend)

Polars is:

much faster

lazy execution

multi-threaded

memory-efficient

Arrow-native

21.4.1 Lazy Query Example
import polars as pl

df = (
    pl.scan_csv("big.csv")
      .filter(pl.col("amount") > 0)
      .groupby("user_id")
      .agg(pl.col("amount").sum())
      .collect()
)


Lazy execution = optimized pipelines.

21.5 Apache Arrow Ecosystem

Arrow is the modern columnar data foundation for Python.

Supports:

zero-copy transfer between Pandas/Polars/Spark

Parquet & Feather

cloud-native processing

21.5.1 Reading Parquet with PyArrow
import pyarrow.parquet as pq
table = pq.read_table("data.parquet")

21.5.2 Converting to Pandas or Polars
df = table.to_pandas()
pl_df = pl.from_arrow(table)

21.6 The ETL (Extract → Transform → Load) Lifecycle

ETL is the heart of data engineering.

flowchart LR
    A[Extract] --> B[Transform]
    B --> C[Load]

21.6.1 Extract

Sources:

CSV, Parquet, JSON

SQL databases

APIs (async fetching)

Kafka

Object storage (S3/GCS/Azure Blob)

21.6.2 Transform

Tasks:

cleaning

deduplication

normalization

joins

aggregations

type normalization

schema alignment

Tools:

Pandas

Polars

PySpark

Arrow compute

21.6.3 Load

Targets:

PostgreSQL

BigQuery

Snowflake

S3

Data lakes

Elastic

21.7 Data Validation (Critical)
Validators:

Pydantic (row-level validation)

Pandera (DataFrame-level validation)

Great Expectations (pipeline-level validation)

21.7.1 Pandera Example
import pandera as pa
from pandera import Column, DataFrameSchema

schema = DataFrameSchema({
    "age": Column(int, pa.Check.ge(0)),
})

schema.validate(df)

21.7.2 Great Expectations Example

Used for enterprise pipelines.

21.8 Multiprocessing for Data Pipelines

Python’s GIL limits heavy CPU work; use multiprocessing.

21.8.1 Chunk Processing Example
from multiprocessing import Pool

def process_chunk(chunk):
    return chunk.assign(total=chunk["a"] + chunk["b"])

with Pool() as p:
    results = p.map(process_chunk, chunks)

21.9 Async Pipelines

Async is excellent for:

API extraction

asynchronous I/O

streaming data

21.9.1 Async ETL Pattern
async def extract(url):
    async with httpx.AsyncClient() as client:
        return await client.get(url)

async def transform(data):
    ...

async def load(data):
    ...

21.10 Streaming Data with Kafka

Kafka client:

from confluent_kafka import Consumer

c = Consumer({"bootstrap.servers": "localhost"})
c.subscribe(["events"])
msg = c.poll(1.0)

21.11 PySpark (Distributed Processing)

PySpark integrates Python with the Spark engine.

21.11.1 Creating Spark Session
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("pipeline").getOrCreate()

21.11.2 DataFrame Example
df = spark.read.parquet("s3://bucket/data/")
df.groupBy("user_id").sum("amount").show()

21.12 DuckDB — In-Process OLAP Engine

Use SQL directly on Parquet/Arrow files:

import duckdb
df = duckdb.query("SELECT * FROM 'data.parquet' WHERE amount > 0").to_df()

21.13 Columnar Formats: Parquet, Feather, ORC
Parquet — best for analytics
Feather — super fast for Python I/O
ORC — similar to Parquet (Hadoop world)
df.to_parquet("data.parquet")

21.14 Performance Optimization
21.14.1 Avoid df.apply

Use vectorization or Polars instead.

21.14.2 Use Chunking
for chunk in pd.read_csv("big.csv", chunksize=100_000):
    ...

21.14.3 Prefer Arrow-backed formats

10× faster

columnar

better compression

21.14.4 Use multiprocessing for heavy transforms
21.14.5 Avoid Python loops in transformations
21.14.6 Push filtering close to source (SQL / DuckDB)
21.15 End-to-End ETL Pipeline (Macro Example)

Full pipeline using:

Async extraction

Polars transformation

Pandera validation

Parquet output

multiprocessing for CPU-bound transforms

pipeline.py
import polars as pl
import asyncio, httpx
import pandera as pa
from pandera import Column, DataFrameSchema
from multiprocessing import Pool

URLS = [...]

schema = DataFrameSchema({
    "id": Column(int),
    "amount": Column(float),
})

async def fetch(url):
    async with httpx.AsyncClient() as c:
        r = await c.get(url)
        return r.json()

def transform(batch):
    return (
        pl.DataFrame(batch)
          .with_columns(pl.col("amount").cast(pl.Float64))
    )

async def extract_all():
    return await asyncio.gather(*(fetch(u) for u in URLS))

async def main():
    raw_batches = await extract_all()

    with Pool() as p:
        frames = p.map(transform, raw_batches)

    df = pl.concat(frames)
    schema.validate(df.to_pandas())

    df.write_parquet("output.parquet")

asyncio.run(main())


This is a real-world ETL structure.

21.16 Pitfalls & Warnings

⚠ using Pandas for >10M rows (switch to Polars/DuckDB)
⚠ using CSV for data lakes
⚠ using df.apply() everywhere
⚠ forgetting schema validation
⚠ mixing async and sync DB access
⚠ loading huge datasets into memory at once
⚠ relying on Python loops for heavy transforms
⚠ missing data lineage documentation
⚠ storing sensitive data in raw logs

21.17 Summary & Takeaways

NumPy provides fast vectorized operations

Pandas is universal, but Polars is faster and more scalable

Arrow is the backbone of high-performance analytics

Parquet is the preferred data lake format

Multiprocessing accelerates CPU-heavy transforms

AsyncIO is ideal for extraction & streaming

Data validation must be explicit

DuckDB enables SQL-on-files with amazing speed

PySpark scales to clusters

A real ETL pipeline integrates: extract → transform → validate → store

21.18 Next Chapter

Proceed to:

👉 Chapter 22 — Packaging, Distribution & Deployment
This chapter covers:

Python packaging formats (wheel, sdist)

pyproject.toml

Python’s packaging ecosystem

versioning

publishing to PyPI

building CLI tools

application deployment patterns

container-based distribution

architecture for multi-service deployments
