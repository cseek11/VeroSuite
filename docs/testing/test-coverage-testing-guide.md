# Test Coverage Testing Guide

**Rule:** R10 - Testing Coverage  
**Purpose:** Ensure all code changes have appropriate test coverage  
**Last Updated:** 2025-11-23

---

## Overview

This guide provides testing patterns for achieving 80% test coverage across statements, branches, functions, and lines.

**Coverage Thresholds:**
- Statements: 80% (code statements executed)
- Branches: 80% (conditional branches tested)
- Functions: 80% (functions called)
- Lines: 80% (code lines executed)

---

## Test Types

### 1. Unit Tests (Mandatory for New Features)

**Objective:** Test individual functions/classes in isolation.

```typescript
describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;
  
  beforeEach(() => {
    prisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn()
      }
    } as any;
    
    service = new UsersService(prisma);
  });
  
  describe('createUser', () => {
    it('should create user successfully (happy path)', async () => {
      const userData = { email: 'test@example.com', name: 'Test User' };
      prisma.user.create.mockResolvedValue({ id: '1', ...userData });
      
      const result = await service.createUser(userData);
      
      expect(result).toEqual({ id: '1', ...userData });
      expect(prisma.user.create).toHaveBeenCalledWith({ data: userData });
    });
    
    it('should throw error on invalid data (error path)', async () => {
      const userData = { email: 'invalid', name: '' };
      prisma.user.create.mockRejectedValue(new Error('Validation failed'));
      
      await expect(service.createUser(userData)).rejects.toThrow('Validation failed');
    });
    
    it('should handle duplicate email (edge case)', async () => {
      const userData = { email: 'existing@example.com', name: 'Test' };
      prisma.user.create.mockRejectedValue(new Error('Email already exists'));
      
      await expect(service.createUser(userData)).rejects.toThrow('Email already exists');
    });
  });
});
```

---

### 2. Regression Tests (Mandatory for Bug Fixes)

**Objective:** Reproduce the bug scenario and verify the fix.

```typescript
describe('UsersService - Bug Fixes', () => {
  describe('Issue #123 - Email validation', () => {
    it('should handle email with plus sign (regression)', async () => {
      // Bug: Email with + sign was rejected
      // Fix: Updated email validation regex
      const userData = { email: 'user+test@example.com', name: 'Test' };
      
      // Should not throw error (bug was fixed)
      await expect(service.createUser(userData)).resolves.toBeDefined();
    });
    
    it('should handle email with dot in local part (regression)', async () => {
      const userData = { email: 'first.last@example.com', name: 'Test' };
      
      await expect(service.createUser(userData)).resolves.toBeDefined();
    });
  });
});
```

---

### 3. Integration Tests (Recommended for DB/API)

**Objective:** Test multiple components together.

```typescript
describe('UsersController (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    
    app = module.createNestApplication();
    prisma = module.get<PrismaService>(PrismaService);
    await app.init();
  });
  
  it('should create user via API', async () => {
    const userData = { email: 'test@example.com', name: 'Test User' };
    
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(userData)
      .expect(201);
    
    expect(response.body).toMatchObject(userData);
    
    // Verify in database
    const user = await prisma.user.findUnique({
      where: { email: userData.email }
    });
    expect(user).toBeDefined();
  });
});
```

---

### 4. E2E Tests (Recommended for Critical Workflows)

**Objective:** Test complete user workflows.

```typescript
describe('User Registration Flow (E2E)', () => {
  it('should complete full registration workflow', async () => {
    // Step 1: Register user
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'new@example.com', password: 'password123' })
      .expect(201);
    
    const { userId } = registerResponse.body;
    
    // Step 2: Verify email (simulate)
    await request(app.getHttpServer())
      .post('/auth/verify-email')
      .send({ userId, token: 'verification-token' })
      .expect(200);
    
    // Step 3: Login
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'new@example.com', password: 'password123' })
      .expect(200);
    
    expect(loginResponse.body.accessToken).toBeDefined();
  });
});
```

---

## Coverage Metrics Explained

### Statements Coverage

**What it measures:** Percentage of code statements executed during tests.

```typescript
function calculateTotal(items: Item[]) {
  let total = 0;                    // Statement 1
  for (const item of items) {       // Statement 2
    total += item.price;            // Statement 3
  }
  return total;                     // Statement 4
}

// Test covering all statements (100% statements coverage)
it('should calculate total', () => {
  const items = [{ price: 10 }, { price: 20 }];
  expect(calculateTotal(items)).toBe(30);
});
```

---

### Branches Coverage

**What it measures:** Percentage of conditional branches tested.

```typescript
function validateAge(age: number) {
  if (age < 0) {                    // Branch 1: true
    throw new Error('Invalid');
  }                                 // Branch 1: false
  
  if (age < 18) {                   // Branch 2: true
    return 'minor';
  } else {                          // Branch 2: false
    return 'adult';
  }
}

// Tests covering all branches (100% branches coverage)
it('should throw error for negative age', () => {
  expect(() => validateAge(-1)).toThrow();  // Branch 1: true
});

it('should return minor for age < 18', () => {
  expect(validateAge(10)).toBe('minor');    // Branch 1: false, Branch 2: true
});

it('should return adult for age >= 18', () => {
  expect(validateAge(25)).toBe('adult');    // Branch 1: false, Branch 2: false
});
```

---

### Functions Coverage

**What it measures:** Percentage of functions called during tests.

```typescript
class UserService {
  async createUser(data: CreateUserDto) {   // Function 1
    return this.prisma.user.create({ data });
  }
  
  async deleteUser(id: string) {            // Function 2
    return this.prisma.user.delete({ where: { id } });
  }
}

// Tests covering all functions (100% functions coverage)
it('should create user', async () => {
  await service.createUser({ email: 'test@example.com' });  // Function 1 called
});

it('should delete user', async () => {
  await service.deleteUser('1');                             // Function 2 called
});
```

---

### Lines Coverage

**What it measures:** Percentage of code lines executed during tests.

```typescript
function processOrder(order: Order) {
  const total = calculateTotal(order.items);  // Line 1
  const tax = calculateTax(total);            // Line 2
  const final = total + tax;                  // Line 3
  return final;                               // Line 4
}

// Test covering all lines (100% lines coverage)
it('should process order', () => {
  const order = { items: [{ price: 100 }] };
  expect(processOrder(order)).toBeGreaterThan(100);
});
```

---

## Achieving 80% Coverage

### Strategy 1: Test Happy Path First

```typescript
// Start with happy path (covers most code)
it('should create user successfully', async () => {
  const result = await service.createUser(validData);
  expect(result).toBeDefined();
});
```

### Strategy 2: Add Error Path Tests

```typescript
// Add error paths (covers error handling branches)
it('should throw error on invalid data', async () => {
  await expect(service.createUser(invalidData)).rejects.toThrow();
});
```

### Strategy 3: Cover Edge Cases

```typescript
// Add edge cases (covers remaining branches)
it('should handle empty array', async () => {
  expect(calculateTotal([])).toBe(0);
});

it('should handle null values', async () => {
  expect(processData(null)).toBeNull();
});
```

---

## Coverage Reports

### Running Coverage

```bash
# Backend (Jest)
cd apps/api
npm run test:cov

# Frontend (Vitest)
cd frontend
npm run test:coverage
```

### Reading Coverage Reports

```
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
users.service.ts      |   85.71 |    75.00 |   88.89 |   86.67 |
```

**Interpretation:**
- **Statements:** 85.71% (6 of 7 statements covered)
- **Branches:** 75.00% (3 of 4 branches covered)
- **Functions:** 88.89% (8 of 9 functions covered)
- **Lines:** 86.67% (13 of 15 lines covered)

**Action:** Add tests for uncovered branches (1 missing) to reach 80%+.

---

## Common Patterns

### Pattern 1: Testing Async Functions

```typescript
it('should handle async operations', async () => {
  const result = await service.asyncOperation();
  expect(result).toBeDefined();
});
```

### Pattern 2: Testing Error Handling

```typescript
it('should handle errors gracefully', async () => {
  await expect(service.failingOperation()).rejects.toThrow('Expected error');
});
```

### Pattern 3: Testing Conditional Logic

```typescript
it('should handle true condition', () => {
  expect(service.conditionalLogic(true)).toBe('result A');
});

it('should handle false condition', () => {
  expect(service.conditionalLogic(false)).toBe('result B');
});
```

---

## Testing Checklist

- [ ] Unit tests cover happy path
- [ ] Unit tests cover error paths
- [ ] Unit tests cover edge cases
- [ ] Regression tests for bug fixes
- [ ] Integration tests for DB/API operations
- [ ] E2E tests for critical workflows
- [ ] Coverage ≥ 80% (statements, branches, functions, lines)
- [ ] All tests pass
- [ ] No tests skipped (unless documented)

---

## Best Practices

1. **Test behavior, not implementation** - Focus on what the code does, not how it does it
2. **Use descriptive test names** - "should create user when valid data provided"
3. **Follow AAA pattern** - Arrange, Act, Assert
4. **Mock external dependencies** - Isolate unit under test
5. **Test edge cases** - Empty arrays, null values, boundary conditions
6. **Keep tests simple** - One assertion per test when possible
7. **Use test data builders** - Create reusable test data factories

---

**Last Updated:** 2025-11-23  
**Maintained By:** QA Team  
**Review Frequency:** Quarterly or when testing requirements change





