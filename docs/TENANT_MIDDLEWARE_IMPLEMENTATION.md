# Tenant Context Middleware - Implementation Guide

## Overview

The tenant context middleware provides secure multi-tenant data isolation using PostgreSQL Row Level Security (RLS) combined with per-request database session variables. This implementation ensures that each tenant can only access their own data.

## Architecture

### Components

1. **TenantMiddleware** - Main middleware that sets tenant context
2. **TenantContextInterceptor** - Provides additional logging and validation
3. **JwtStrategy** - Extracts tenant information from JWT tokens
4. **DatabaseService** - Handles database operations with tenant context

### Data Flow

```
Request → JWT Authentication → TenantMiddleware → Database RLS → Response
    ↓              ↓                    ↓              ↓
  Headers    Extract tenantId    Set app.tenant_id   Filter data
```

## Implementation Details

### 1. TenantMiddleware

**Location**: `backend/src/common/middleware/tenant.middleware.ts`

**Responsibilities**:
- Extract tenant ID from authenticated user context or headers
- Validate tenant ID format (UUID)
- Set PostgreSQL session variables for RLS
- Set database role to `verofield_app`
- Add tenant ID to request object for easy access

**Key Features**:
- ✅ UUID validation for tenant IDs
- ✅ Comprehensive error handling and logging
- ✅ Support for both authenticated and development modes
- ✅ Database role enforcement
- ✅ Proper session variable management

### 2. Tenant Context Interceptor

**Location**: `backend/src/common/interceptors/tenant-context.interceptor.ts`

**Responsibilities**:
- Provide additional logging for tenant context operations
- Validate tenant context is properly set
- Monitor request processing with tenant context

### 3. Database Service Enhancements

**Location**: `backend/src/common/services/database.service.ts`

**New Methods**:
- `withTenant<T>(tenantId, operation)` - Execute operation with specific tenant context
- `getCurrentTenantId()` - Get current tenant ID from database session

## Security Features

### 1. Row Level Security (RLS)

All tenant-scoped tables have RLS policies that automatically filter data:

```sql
CREATE POLICY tenant_isolation_accounts ON accounts
USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

### 2. Database Role Enforcement

The middleware sets the database role to `verofield_app`, which has limited permissions and cannot bypass RLS.

### 3. Tenant ID Validation

All tenant IDs are validated to ensure they are proper UUIDs before being used in database operations.

### 4. Session Isolation

Each request gets its own database session with tenant context, preventing cross-tenant data leakage.

## Usage Examples

### 1. Accessing Tenant ID in Services

```typescript
@Injectable()
export class AccountService {
  constructor(private databaseService: DatabaseService) {}

  async getAccounts(req: Request) {
    const tenantId = req.tenantId; // Set by TenantMiddleware
    // All database operations automatically use tenant context
    return this.databaseService.account.findMany();
  }
}
```

### 2. Manual Tenant Context

```typescript
async someOperation() {
  return this.databaseService.withTenant('tenant-id', async () => {
    // All operations within this block use the specified tenant context
    return this.databaseService.account.findMany();
  });
}
```

### 3. Development Mode

For development and testing, you can use the `x-tenant-id` header:

```bash
curl -H "x-tenant-id: 123e4567-e89b-12d3-a456-426614174000" \
     http://localhost:3001/api/accounts
```

## Configuration

### App Module Setup

```typescript
@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TenantContextInterceptor },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
```

### Environment Variables

- `JWT_SECRET` - Secret for JWT token validation
- `DATABASE_URL` - PostgreSQL connection string

## Testing

### Unit Tests

**Location**: `backend/src/common/middleware/tenant.middleware.spec.ts`

Tests cover:
- Tenant ID extraction from user context and headers
- UUID validation
- Database context setting
- Error handling
- Cross-tenant isolation

### Integration Tests

**Location**: `backend/src/common/middleware/tenant-isolation.integration.spec.ts`

Tests cover:
- Cross-tenant data isolation
- RLS policy enforcement
- Database role enforcement
- Tenant context switching

### Running Tests

```bash
# Unit tests
npm test -- tenant.middleware.spec.ts

# Integration tests
npm test -- tenant-isolation.integration.spec.ts
```

## Troubleshooting

### Common Issues

1. **"Unable to establish tenant context"**
   - Check if tenant ID is valid UUID
   - Verify database connection
   - Check RLS policies are enabled

2. **Cross-tenant data visible**
   - Verify RLS policies are active
   - Check database role is set to `verofield_app`
   - Ensure `app.tenant_id` session variable is set

3. **No tenant context in requests**
   - Verify JWT token includes `tenant_id`
   - Check middleware is applied to routes
   - Use `x-tenant-id` header for development

### Debug Logging

Enable debug logging to see tenant context operations:

```typescript
// In your service
this.logger.debug(`Current tenant: ${req.tenantId}`);
```

### Database Queries

Check current tenant context:

```sql
SELECT current_setting('app.tenant_id', true) as tenant_id;
SELECT current_user as role;
```

## Migration from Previous Implementation

### Changes Made

1. **Removed duplicate implementations**:
   - Deleted `TenantContextMiddleware` (incomplete)
   - Consolidated functionality into `TenantMiddleware`

2. **Standardized property naming**:
   - All components now use `tenantId` (camelCase)
   - Consistent with JWT strategy output

3. **Added missing features**:
   - Database role setting (`verofield_app`)
   - UUID validation
   - Comprehensive error handling
   - Better logging

4. **Enhanced database service**:
   - Added `withTenant()` method
   - Added `getCurrentTenantId()` method
   - Improved error handling

### Breaking Changes

None - the implementation is backward compatible with existing code.

## Performance Considerations

1. **Database Connections**: Each request gets its own session context
2. **RLS Overhead**: Minimal impact on query performance
3. **Memory Usage**: Tenant context is stored in request object
4. **Logging**: Debug logging can be disabled in production

## Security Considerations

1. **Never bypass RLS**: Always use the application role, never superuser
2. **Validate tenant IDs**: Always validate UUID format
3. **Log tenant operations**: Monitor for suspicious cross-tenant access
4. **Regular audits**: Test cross-tenant isolation regularly

## Future Enhancements

1. **Tenant validation**: Verify tenant exists and is active
2. **Caching**: Cache tenant context for performance
3. **Metrics**: Add tenant-specific metrics and monitoring
4. **Audit logging**: Enhanced audit trails for tenant operations

