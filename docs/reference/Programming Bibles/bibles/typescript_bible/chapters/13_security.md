<!-- SSM:CHUNK_BOUNDARY id="ch13-start" -->
📘 CHAPTER 13 — SECURITY 🔴 Advanced

TypeScript enhances security through **compile-time type checking**, but security requires **defense in depth** across the entire stack.

> **Quick Answer:** TypeScript's types are erased at runtime. Always combine compile-time type safety with runtime validation (Zod, class-validator), parameterized queries, output encoding, and security headers.

### 13.1 Input Validation

Always validate user input at runtime. TypeScript types alone are not sufficient because:

1. Types are erased at runtime
2. External data bypasses type checking
3. User input can be malicious

#### 13.1.1 Zod Validation

Example:

```typescript
import { z } from "zod";

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().max(255),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150).optional(),
});

type User = z.infer<typeof UserSchema>;

function createUser(input: unknown): User {
  return UserSchema.parse(input); // Validates and throws if invalid
}

// ✅ Pattern: Safe parsing with error handling
function safeCreateUser(input: unknown): { success: true; data: User } | { success: false; error: z.ZodError } {
  const result = UserSchema.safeParse(input);
  return result;
}
```

#### 13.1.2 class-validator for NestJS

```typescript
import { IsEmail, IsString, Length, IsOptional, IsInt, Min, Max } from "class-validator";
import { Transform } from "class-transformer";

// ✅ Pattern: DTO with validation decorators
export class CreateUserDto {
  @IsString()
  @Length(1, 100)
  name!: string;

  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  age?: number;
}

// Controller usage
@Post()
async createUser(@Body() dto: CreateUserDto) {
  // dto is already validated by ValidationPipe
  return this.userService.create(dto);
}
```

### 13.2 SQL Injection Prevention

TypeScript alone cannot prevent SQL injection. Use parameterized queries always.

#### 13.2.1 Type-Safe Query Builders

```typescript
// ❌ Anti-pattern: String concatenation (SQL injection vulnerable)
const query = `SELECT * FROM users WHERE id = '${userId}'`;  // NEVER DO THIS

// ✅ Pattern: Prisma (safe by default)
const user = await prisma.user.findUnique({
  where: { id: userId },  // Automatically parameterized
});

// ✅ Pattern: Drizzle ORM (type-safe and parameterized)
import { eq } from "drizzle-orm";
const user = await db.select().from(users).where(eq(users.id, userId));

// ✅ Pattern: Knex with parameterization
const user = await knex("users").where("id", userId).first();

// ✅ Pattern: Raw queries with parameters (when needed)
const result = await prisma.$queryRaw`SELECT * FROM users WHERE id = ${userId}`;
```

#### 13.2.2 Type-Safe SQL Template Literals

```typescript
import { sql, type SQLWrapper } from "drizzle-orm";

// ✅ Pattern: Type-safe dynamic queries
function buildSearchQuery(
  filters: { name?: string; email?: string; status?: "active" | "inactive" }
): SQLWrapper {
  const conditions: SQLWrapper[] = [];
  
  if (filters.name) {
    conditions.push(sql`name ILIKE ${`%${filters.name}%`}`);
  }
  if (filters.email) {
    conditions.push(sql`email = ${filters.email}`);
  }
  if (filters.status) {
    conditions.push(sql`status = ${filters.status}`);
  }
  
  return conditions.length > 0
    ? sql`WHERE ${sql.join(conditions, sql` AND `)}`
    : sql``;
}
```

### 13.3 XSS Prevention

Cross-Site Scripting (XSS) occurs when user input is rendered as HTML without proper encoding.

#### 13.3.1 Output Encoding

```typescript
// ❌ Anti-pattern: Raw HTML injection
element.innerHTML = userInput;  // XSS vulnerability

// ✅ Pattern: Use textContent for text
element.textContent = userInput;  // Safe: encodes special characters

// ✅ Pattern: React auto-escapes by default
function UserProfile({ name }: { name: string }) {
  return <div>{name}</div>;  // Safe: React escapes {name}
}

// ❌ Anti-pattern: dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userInput }} />  // XSS risk

// ✅ Pattern: Sanitize if HTML is required
import DOMPurify from "dompurify";

function SafeHtml({ html }: { html: string }) {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a"],
    ALLOWED_ATTR: ["href"],
  });
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

#### 13.3.2 Content Security Policy Types

```typescript
// ✅ Pattern: Type-safe CSP headers
interface ContentSecurityPolicy {
  "default-src": string[];
  "script-src": string[];
  "style-src": string[];
  "img-src": string[];
  "connect-src": string[];
  "frame-ancestors": string[];
}

const csp: ContentSecurityPolicy = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'strict-dynamic'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "data:", "https:"],
  "connect-src": ["'self'", "https://api.example.com"],
  "frame-ancestors": ["'none'"],
};

function formatCSP(policy: ContentSecurityPolicy): string {
  return Object.entries(policy)
    .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
    .join("; ");
}
```

### 13.4 CSRF Protection

Cross-Site Request Forgery requires token-based protection.

```typescript
// ✅ Pattern: Type-safe CSRF token handling
import { randomBytes } from "crypto";

interface CSRFToken {
  token: string;
  expires: Date;
}

function generateCSRFToken(): CSRFToken {
  return {
    token: randomBytes(32).toString("hex"),
    expires: new Date(Date.now() + 3600000), // 1 hour
  };
}

// Middleware type
interface CSRFRequest extends Request {
  csrfToken: () => string;
  session: {
    csrfToken?: CSRFToken;
  };
}

// ✅ Pattern: Validate CSRF token
function validateCSRFToken(req: CSRFRequest): boolean {
  const sessionToken = req.session.csrfToken;
  const headerToken = req.headers["x-csrf-token"];
  
  if (!sessionToken || !headerToken) return false;
  if (sessionToken.expires < new Date()) return false;
  
  // Use timing-safe comparison
  return timingSafeEqual(
    Buffer.from(sessionToken.token),
    Buffer.from(String(headerToken))
  );
}
```

### 13.5 Secrets Management

Never hardcode secrets in TypeScript code.

```typescript
// ❌ Anti-pattern: Hardcoded secrets
const API_KEY = "sk_live_abc123";  // NEVER DO THIS

// ✅ Pattern: Environment variables with type safety
import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(10),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

type Env = z.infer<typeof EnvSchema>;

function loadEnv(): Env {
  const result = EnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    process.exit(1);
  }
  return result.data;
}

const env = loadEnv();

// ✅ Pattern: Type-safe config factory
interface AppConfig {
  database: {
    url: string;
    ssl: boolean;
  };
  auth: {
    jwtSecret: string;
    tokenExpiry: number;
  };
}

function createConfig(env: Env): AppConfig {
  return {
    database: {
      url: env.DATABASE_URL,
      ssl: env.NODE_ENV === "production",
    },
    auth: {
      jwtSecret: env.JWT_SECRET,
      tokenExpiry: 3600,
    },
  };
}
```

### 13.6 Dependency Security

```bash
# Check for known vulnerabilities
npm audit
npm audit fix

# Use automated tools
npx snyk test
npx depcheck
```

```typescript
// ✅ Pattern: Type-safe version constraints in package.json
interface PackageJson {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

// Prefer exact versions for production
const dependencies = {
  "zod": "3.22.4",        // Exact version
  "express": "^4.18.2",   // Minor updates only
  "lodash": "~4.17.21",   // Patch updates only
};
```

### 13.7 Type Safety vs Runtime Safety

TypeScript provides compile-time safety, but runtime validation is still required:

| Aspect | Compile-Time (TS) | Runtime (Zod/etc.) |
|--------|-------------------|-------------------|
| Type checking | ✅ Full | ✅ Full |
| External data | ❌ No guarantee | ✅ Validated |
| Performance | ✅ Zero cost | ⚠️ Overhead |
| Error messages | ⚠️ Developer only | ✅ User-facing |

**Production Failure: Zero-Boilerplate Prisma → Zod Sync That Never Drifts**

Every Prisma schema change required manual Zod updates → constant drift bugs. An AI wrote a script that reads `prisma schema.prisma` → outputs `src/types/zod.generated.ts` with exact same nullability, enums, and relations. Now runs on pre-commit. Zero drift incidents.

**Lesson**: Automate type generation from single source of truth. Manual sync always drifts.

**Production Success: Perfect Prisma ↔ Zod Sync**

A fintech startup needed 100% type-sync between 180 PostgreSQL tables, Drizzle ORM, and Zod validation. Manual sync was a full-time job for one engineer. An AI read the entire `schema.ts` Drizzle file and output 180 perfect Zod schemas + a `z.infer` index file. Another AI then added runtime refinement for `bigint → string` on the fly. Zero drift for months.

**Pattern**: One source of truth (Prisma/Drizzle schema) → Generate types + validation schemas.

### 13.8 Authentication Type Patterns

```typescript
// ✅ Pattern: Type-safe JWT handling
import { JwtPayload } from "jsonwebtoken";

interface UserToken extends JwtPayload {
  userId: string;
  email: string;
  roles: ("user" | "admin" | "moderator")[];
  tenantId: string;
}

function verifyToken(token: string): UserToken {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  
  // Validate structure at runtime
  const TokenSchema = z.object({
    userId: z.string().uuid(),
    email: z.string().email(),
    roles: z.array(z.enum(["user", "admin", "moderator"])),
    tenantId: z.string().uuid(),
  });
  
  return TokenSchema.parse(decoded);
}

// ✅ Pattern: Type-safe auth middleware
interface AuthenticatedRequest extends Request {
  user: UserToken;
}

function requireAuth(
  handler: (req: AuthenticatedRequest, res: Response) => Promise<void>
) {
  return async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    try {
      (req as AuthenticatedRequest).user = verifyToken(token);
      await handler(req as AuthenticatedRequest, res);
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}
```

### See Also {#chapter-13-see-also}

- **Chapter 10: Error Handling** — Secure error handling patterns
- **Chapter 14: Testing** — Security testing strategies
- **Chapter 23: Configuration** — Secure configuration management
- **Appendix F: Error Codes** — Security-related error codes
- **Appendix G: Migration Guide** — Security migration considerations

---


<!-- SSM:CHUNK_BOUNDARY id="ch13-end" -->
