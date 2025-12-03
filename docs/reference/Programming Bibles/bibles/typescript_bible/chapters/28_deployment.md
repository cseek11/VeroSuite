<!-- SSM:CHUNK_BOUNDARY id="ch28-start" -->
📘 CHAPTER 28 — DEPLOYMENT 🔴 Advanced

> **Quick Answer:** Multi-stage Docker builds: compile in builder, copy dist to slim runtime. Use `esbuild` or `swc` for fast builds. Validate runtime deps separately from dev deps. Source maps for debugging.

### 28.1 Docker

TypeScript in Docker:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]
```

### 28.2 Serverless

Type-safe serverless functions:

- Type-safe event handlers
- Type-safe responses
- Type-safe environment variables

---


<!-- SSM:CHUNK_BOUNDARY id="ch28-end" -->
