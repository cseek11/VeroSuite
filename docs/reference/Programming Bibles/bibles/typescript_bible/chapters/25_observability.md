<!-- SSM:CHUNK_BOUNDARY id="ch25-start" -->
📘 CHAPTER 25 — OBSERVABILITY 🔴 Advanced

### 25.1 Structured Logging

Use structured logging with types:

Example:

```typescript
interface LogEntry {
  level: "info" | "warn" | "error";
  message: string;
  timestamp: string;
  traceId: string;
  tenantId?: string;
  [key: string]: unknown;
}

function log(entry: LogEntry): void {
  console.log(JSON.stringify(entry));
}
```

### 25.2 Tracing

Propagate trace IDs through the system:

- Extract trace ID from headers
- Include in all logs
- Pass through service calls
- Include in database queries

**Distributed Tracing Implementation:**

```typescript
// Trace context propagation
interface TraceContext {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
}

function extractTraceContext(headers: Headers): TraceContext | null {
  const traceId = headers.get("x-trace-id");
  const spanId = headers.get("x-span-id");
  
  if (!traceId || !spanId) return null;
  
  return {
    traceId,
    spanId,
    parentSpanId: headers.get("x-parent-span-id") || undefined,
  };
}

function injectTraceContext(context: TraceContext, headers: Headers): void {
  headers.set("x-trace-id", context.traceId);
  headers.set("x-span-id", context.spanId);
  if (context.parentSpanId) {
    headers.set("x-parent-span-id", context.parentSpanId);
  }
}
```

### 25.3 Metrics

**Metrics Collection**: Type-safe metrics with TypeScript.

```typescript
interface Metric {
  name: string;
  value: number;
  tags: Record<string, string>;
  timestamp: Date;
}

class MetricsCollector {
  private metrics: Metric[] = [];
  
  record(name: string, value: number, tags: Record<string, string> = {}): void {
    this.metrics.push({
      name,
      value,
      tags,
      timestamp: new Date(),
    });
  }
  
  getMetrics(): Metric[] {
    return [...this.metrics];
  }
}
```

**APM Integration:**

```typescript
// Type-safe APM integration
interface APMConfig {
  serviceName: string;
  environment: string;
  serverUrl: string;
}

class APMClient {
  constructor(private config: APMConfig) {}
  
  startTransaction(name: string): Transaction {
    // Start APM transaction
    return new Transaction(name, this.config);
  }
}
```

### 25.4 Performance Monitoring

**Performance Metrics:**

```typescript
interface PerformanceMetric {
  operation: string;
  duration: number;
  memoryUsage?: number;
  timestamp: Date;
}

function measurePerformance<T>(
  operation: string,
  fn: () => T
): T {
  const start = performance.now();
  const startMemory = (performance as any).memory?.usedJSHeapSize;
  
  try {
    const result = fn();
    const duration = performance.now() - start;
    const endMemory = (performance as any).memory?.usedJSHeapSize;
    
    recordMetric({
      operation,
      duration,
      memoryUsage: endMemory && startMemory ? endMemory - startMemory : undefined,
      timestamp: new Date(),
    });
    
    return result;
  } catch (error) {
    recordMetric({
      operation: `${operation} (error)`,
      duration: performance.now() - start,
      timestamp: new Date(),
    });
    throw error;
  }
}
```

---


<!-- SSM:CHUNK_BOUNDARY id="ch25-end" -->
