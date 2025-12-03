<!-- SSM:CHUNK_BOUNDARY id="ch26-start" -->
📘 CHAPTER 26 — CONFIGURATION 🔴 Advanced

> **Quick Answer:** Use `satisfies` for type-safe configs without widening. Validate env vars at startup with Zod. Centralize config loading; fail fast on missing values.

### 26.1 Type-Safe Configuration

Use `satisfies` for exact configuration:

Example:

```typescript
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
} satisfies {
  apiUrl: string;
  timeout: number;
};

type Config = typeof config; // Exact type
```

### 26.2 Environment Variables

Type-safe environment variables:

Example:

```typescript
const env = {
  API_URL: process.env.API_URL!,
  TIMEOUT_MS: parseInt(process.env.TIMEOUT_MS ?? "5000"),
} as const satisfies Record<string, string | number>;
```

### 26.3 Configuration Validation

**Configuration Schema Validation:**

```typescript
import { z } from "zod";

const ConfigSchema = z.object({
  apiUrl: z.string().url(),
  timeout: z.number().positive(),
  retries: z.number().int().min(0).max(10),
  features: z.object({
    enableCache: z.boolean(),
    cacheTTL: z.number().positive().optional(),
  }),
});

type Config = z.infer<typeof ConfigSchema>;

function loadConfig(): Config {
  const raw = {
    apiUrl: process.env.API_URL,
    timeout: parseInt(process.env.TIMEOUT_MS ?? "5000"),
    retries: parseInt(process.env.RETRIES ?? "3"),
    features: {
      enableCache: process.env.ENABLE_CACHE === "true",
      cacheTTL: process.env.CACHE_TTL ? parseInt(process.env.CACHE_TTL) : undefined,
    },
  };
  
  return ConfigSchema.parse(raw);
}
```

### 26.4 Environment-Specific Configuration

**Environment-Specific Configs:**

```typescript
type Environment = "development" | "staging" | "production";

interface BaseConfig {
  apiUrl: string;
  timeout: number;
}

interface EnvironmentConfig extends BaseConfig {
  environment: Environment;
  debug: boolean;
  logLevel: "debug" | "info" | "warn" | "error";
}

const configs: Record<Environment, EnvironmentConfig> = {
  development: {
    environment: "development",
    apiUrl: "http://localhost:3000",
    timeout: 10000,
    debug: true,
    logLevel: "debug",
  },
  staging: {
    environment: "staging",
    apiUrl: "https://staging-api.example.com",
    timeout: 5000,
    debug: false,
    logLevel: "info",
  },
  production: {
    environment: "production",
    apiUrl: "https://api.example.com",
    timeout: 3000,
    debug: false,
    logLevel: "warn",
  },
};

function getConfig(): EnvironmentConfig {
  const env = (process.env.NODE_ENV || "development") as Environment;
  return configs[env];
}
```

### 26.5 Configuration Schema Generation

**Generate Types from Config:**

```typescript
// Generate TypeScript types from JSON schema
// Using json-schema-to-typescript or similar

// config.schema.json
{
  "type": "object",
  "properties": {
    "apiUrl": { "type": "string", "format": "uri" },
    "timeout": { "type": "number", "minimum": 0 }
  },
  "required": ["apiUrl", "timeout"]
}

// Generated: config.d.ts
export interface Config {
  apiUrl: string;
  timeout: number;
}
```

---


<!-- SSM:CHUNK_BOUNDARY id="ch26-end" -->
