<!-- SSM:CHUNK_BOUNDARY id="ch18-start" -->
📘 CHAPTER 18 — FRAMEWORKS 🔴 Advanced

### 18.1 React

TypeScript with React:

Example:

```typescript
interface Props {
  name: string;
  age?: number;
}

function Greeting({ name, age }: Props) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>You are {age} years old</p>}
    </div>
  );
}
```

### 18.2 Next.js

TypeScript integration with Next.js provides end-to-end type safety from API routes to components. This section covers Next.js App Router, Prisma integration, and tRPC setup.

#### 18.2.1 Next.js App Router with TypeScript

**Type-Safe Route Definitions:**

```typescript
// app/routes.ts
const appRoutes = {
  home: "/",
  blog: "/blog",
  post: (slug: string) => `/blog/${slug}` as const,
} as const;

type AppRoutes = typeof appRoutes;
type AppRoute = AppRoutes[keyof AppRoutes] | ReturnType<AppRoutes["post"]>;
```

**Type-Safe API Routes:**

```typescript
// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Define schema for request validation
const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

type CreateUserInput = z.infer<typeof CreateUserSchema>;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateUserSchema.parse(body); // Runtime validation
    
    // TypeScript knows validatedData is CreateUserInput
    const user = await createUser(validatedData);
    
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Type-safe route handlers with params
// app/blog/[slug]/page.tsx
type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function BlogPostPage({ params, searchParams }: PageProps) {
  const { slug } = await params; // Await params in App Router
  const { preview } = await searchParams;
  
  // TypeScript knows slug is string
  const post = await getPostBySlug(slug);
  
  return <article>{post.content}</article>;
}
```

**Type-Safe Server Actions:**

```typescript
// app/actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const UpdateUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export async function updateUser(formData: FormData) {
  const rawData = Object.fromEntries(formData);
  const validated = UpdateUserSchema.parse(rawData);
  
  // Type-safe database operation
  await db.user.update({
    where: { id: validated.id },
    data: validated,
  });
  
  revalidatePath("/users");
}
```

#### 18.2.2 Prisma Integration

**Type-Safe Database Queries:**

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Prisma generates types from schema.prisma
// Example schema:
// model User {
//   id        String   @id @default(uuid())
//   email     String   @unique
//   name      String?
//   posts     Post[]
//   createdAt DateTime @default(now())
// }

// Type-safe queries
export async function getUserWithPosts(userId: string) {
  // Return type is inferred from Prisma query
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  
  // TypeScript knows user.posts is Post[]
  return user;
}

// Type-safe mutations
export async function createUser(data: {
  email: string;
  name?: string;
}) {
  // Prisma validates types at compile time
  const user = await prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
  
  return user; // Type: { id: string; email: string; name: string | null }
}
```

**Prisma + Zod Integration (Zero Drift Pattern):**

```typescript
// lib/validations.ts
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Generate Zod schema from Prisma types
const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  posts: z.array(z.any()).optional(), // Complex relations handled separately
});

// Type-safe API route with Prisma + Zod
export async function createUserAPI(body: unknown) {
  const validated = UserCreateInputSchema.parse(body);
  
  // Prisma validates at compile time, Zod validates at runtime
  const user = await prisma.user.create({
    data: validated,
  });
  
  return user;
}
```

#### 18.2.3 tRPC Integration

**Type-Safe End-to-End API:**

```typescript
// server/routers/user.ts
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const userRouter = router({
  // Query procedure
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      // TypeScript knows input.id is string
      const user = await prisma.user.findUnique({
        where: { id: input.id },
      });
      
      if (!user) {
        throw new Error("User not found");
      }
      
      return user; // Return type inferred
    }),
  
  // Mutation procedure
  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.create({
        data: input,
      });
      
      return user;
    }),
  
  // Nested router
  posts: router({
    list: publicProcedure
      .input(
        z.object({
          userId: z.string().uuid(),
          limit: z.number().min(1).max(100).default(10),
        })
      )
      .query(async ({ input }) => {
        return prisma.post.findMany({
          where: { authorId: input.userId },
          take: input.limit,
        });
      }),
  }),
});

// server/routers/_app.ts
import { router } from "../trpc";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
});

export type AppRouter = typeof appRouter;
```

**Type-Safe tRPC Client:**

```typescript
// client/trpc.ts
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@/server/routers/_app";

export const trpc = createTRPCReact<AppRouter>();

// Usage in React components
// app/users/[id]/page.tsx
"use client";

import { trpc } from "@/client/trpc";

export default function UserPage({ params }: { params: { id: string } }) {
  // Type-safe query with autocomplete
  const { data: user, isLoading } = trpc.user.getById.useQuery({
    id: params.id, // TypeScript validates id is string
  });
  
  // Type-safe mutation
  const createUser = trpc.user.create.useMutation();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;
  
  // TypeScript knows user properties
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

**Next.js App Router + tRPC Setup:**

```typescript
// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/routers/_app";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}), // Add your context here
  });

export { handler as GET, handler as POST };
```

**Best Practices:**

1. **Use Zod for runtime validation** alongside Prisma types
2. **Generate types from Prisma schema** automatically (`prisma generate`)
3. **Use tRPC for end-to-end type safety** between client and server
4. **Leverage Next.js App Router types** for route params and search params
5. **Validate all external inputs** (API responses, form data, environment variables)

---


<!-- SSM:CHUNK_BOUNDARY id="ch18-end" -->
