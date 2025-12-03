<!-- SSM:CHUNK_BOUNDARY id="ch22-start" -->
📘 CHAPTER 22 — APIS (REST, GRAPHQL, GRPC) 🔴 Advanced

### 22.1 REST APIs

Type-safe REST API clients:

Example:

```typescript
type ApiResponse<T> = {
  data: T;
  status: number;
};

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);
  return {
    data: await response.json(),
    status: response.status,
  };
}
```

### 22.2 GraphQL

Type-safe GraphQL with code generation:

- Use `graphql-codegen` to generate types from schema
- Type-safe queries and mutations
- Automatic type inference

### 22.3 gRPC

Type-safe gRPC with Protocol Buffers:

- Generate TypeScript types from `.proto` files
- Type-safe service definitions
- Automatic serialization/deserialization

**Production Success: Fully Typed tRPC + Next.js App Router**

A startup wanted end-to-end types (procedure → server → client) with App Router file-based routing, but every solution required 30% boilerplate. An AI read the entire `app/api/trpc/[trpc]/route.ts` + all procedure files and generated a perfect `AppRouter` type + client hooks with path params extracted from folder structure. 1,200 lines of boilerplate → 41 lines. Deployed in production the same week.

**Pattern**: Generate types from folder structure + procedure definitions for zero-boilerplate type safety.

---


<!-- SSM:CHUNK_BOUNDARY id="ch22-end" -->
