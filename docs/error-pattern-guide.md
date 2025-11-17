# Error Pattern Documentation Guide

**Last Updated:** 2025-11-16

This guide explains how to document error patterns in `docs/error-patterns.md` and how to search and apply known patterns to prevent recurring issues.

---

## Table of Contents

1. [Documenting Error Patterns](#documenting-error-patterns)
2. [Searching for Patterns](#searching-for-patterns)
3. [Applying Known Patterns](#applying-known-patterns)
4. [Pattern Template Usage](#pattern-template-usage)

---

## Documenting Error Patterns

### When to Document

Document an error pattern when:

1. **Fixing a bug** - Every bug fix should add an entry
2. **Mitigating a risky pattern** - When implementing preventive measures
3. **Discovering a recurring issue** - When the same error appears multiple times
4. **Learning from production incidents** - When analyzing production errors

### Entry Template

Use this template when adding a new pattern:

```markdown
## [Pattern Name] - [Date]

### Summary
Brief description of the error pattern (1-2 sentences).

### Root Cause
Technical explanation of what caused this error.

### Triggering Conditions
- Condition 1 that triggers the error
- Condition 2 that triggers the error
- Condition 3 that triggers the error

### Relevant Code/Modules
- `path/to/file1.ts` - Description of relevance
- `path/to/file2.ts` - Description of relevance

### How It Was Fixed
Step-by-step explanation of the fix:
1. Step 1
2. Step 2
3. Step 3

### How to Prevent It in the Future
- Prevention strategy 1
- Prevention strategy 2
- Code patterns to follow
- Tests to add

### Similar Historical Issues
- Link to related pattern entries
- Reference to similar bugs
- Related patterns to check
```

### Example Entry

```markdown
## API_TIMEOUT_HANDLING - 2025-01-27

### Summary
External API calls can hang indefinitely if no timeout is set, causing the application to become unresponsive.

### Root Cause
HTTP requests to external services can hang if:
- Network connectivity is lost
- External service is overloaded
- External service is down
- Firewall blocks the connection

Without timeouts, the application waits indefinitely for a response.

### Triggering Conditions
- External API is slow or unresponsive
- Network connectivity issues
- External service is down
- No timeout configured on HTTP client

### Relevant Code/Modules
- `backend/src/common/services/http.service.ts` - HTTP client service
- `frontend/src/lib/api-utils.ts` - API utility functions
- Any service making external API calls

### How It Was Fixed
1. Added `AbortController` for timeout support
2. Set default timeout of 5000ms for all external API calls
3. Added timeout error handling with proper logging
4. Implemented retry logic with exponential backoff

### How to Prevent It in the Future
- Always use `AbortController` with timeout for external API calls
- Set appropriate timeout values (5s for most APIs, 30s for long operations)
- Log timeout errors with context
- Implement retry logic for transient failures
- Use circuit breakers for frequently failing services

### Similar Historical Issues
- Database query timeouts (similar pattern)
- File system operation timeouts
- Message queue operation timeouts
```

---

## Searching for Patterns

### Before Implementing

**MANDATORY:** Before implementing error handling or fixing bugs:

1. **Search `docs/error-patterns.md`** for similar past issues
2. **Review prevention strategies** from similar patterns
3. **Apply known patterns** proactively
4. **Reference patterns** in code comments

### Search Strategies

1. **By Error Type**
   - Search for error codes (e.g., "TIMEOUT", "CONNECTION")
   - Search for error messages (e.g., "failed to connect")

2. **By Operation Type**
   - Search for operation names (e.g., "API call", "database query")
   - Search for service names (e.g., "PaymentService", "AuthService")

3. **By Root Cause**
   - Search for technical causes (e.g., "network", "timeout", "validation")

4. **By Context**
   - Search for similar contexts (e.g., "external API", "database", "authentication")

### Example Search

```markdown
# Before implementing payment processing:

1. Search for "payment" in docs/error-patterns.md
2. Search for "PAYMENT" error codes
3. Review similar patterns (e.g., API_TIMEOUT_HANDLING)
4. Apply prevention strategies from patterns
```

---

## Applying Known Patterns

### Step 1: Find Relevant Patterns

```typescript
// Before implementing:
// 1. Search docs/error-patterns.md for "API timeout" or "external API"
// 2. Find API_TIMEOUT_HANDLING pattern
// 3. Review prevention strategies
```

### Step 2: Apply Prevention Strategies

```typescript
// Pattern: API_TIMEOUT_HANDLING (see docs/error-patterns.md)
// Prevention: Always use timeout with AbortController for external API calls

async function fetchWithTimeout(url: string, timeoutMs: number = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    // Handle timeout error (see pattern documentation)
    throw error;
  }
}
```

### Step 3: Reference Pattern in Code

```typescript
/**
 * Fetches data from external API with timeout protection.
 * 
 * Pattern: API_TIMEOUT_HANDLING (see docs/error-patterns.md)
 * Prevention: Uses AbortController with 5s timeout to prevent hanging requests
 */
async function fetchExternalData(url: string) {
  // Implementation follows API_TIMEOUT_HANDLING pattern
}
```

---

## Pattern Template Usage

### Using the Template

1. **Copy the template** from `docs/error-patterns.md`
2. **Fill in all sections** with specific details
3. **Be specific** about root cause and triggering conditions
4. **Include code examples** when helpful
5. **Link to related patterns** for cross-referencing

### Template Sections Explained

#### Summary
- **Purpose:** Quick overview of the pattern
- **Length:** 1-2 sentences
- **Include:** What the error is and its impact

#### Root Cause
- **Purpose:** Technical explanation
- **Include:** What causes the error, why it happens
- **Detail:** Be specific about technical causes

#### Triggering Conditions
- **Purpose:** When the error occurs
- **Format:** Bullet list of conditions
- **Include:** Specific scenarios that trigger the error

#### Relevant Code/Modules
- **Purpose:** Where the pattern applies
- **Format:** List of file paths with descriptions
- **Include:** All affected modules

#### How It Was Fixed
- **Purpose:** Step-by-step fix explanation
- **Format:** Numbered list of steps
- **Include:** Specific code changes, configuration changes

#### How to Prevent It in the Future
- **Purpose:** Prevention strategies
- **Format:** Bullet list of strategies
- **Include:** Code patterns, tests, configuration

#### Similar Historical Issues
- **Purpose:** Cross-reference related patterns
- **Format:** Links or references to other patterns
- **Include:** Related bugs, similar patterns

---

## Best Practices

1. **Document immediately** after fixing a bug
2. **Be specific** about root causes and conditions
3. **Include code examples** when helpful
4. **Link related patterns** for cross-referencing
5. **Update patterns** when new information is discovered
6. **Search before implementing** to apply known patterns
7. **Reference patterns in code** comments
8. **Review patterns regularly** to identify trends

---

## Pattern Categories

Patterns are organized by category:

- **API & Network Errors** - Timeout handling, connection failures, rate limiting
- **Database Errors** - Connection timeouts, query timeouts, transaction failures
- **Authentication & Authorization** - Token expiration, permission checks
- **Data Validation** - Input validation failures, schema mismatches
- **Concurrency Issues** - Race conditions, deadlocks, lock contention
- **Resource Management** - Memory leaks, file handle leaks, connection leaks

When adding a new pattern, update the relevant category section.

---

**Last Updated:** 2025-11-16

