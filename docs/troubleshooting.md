---
title: Troubleshooting Guide
category: Deployment
status: active
last_reviewed: 2025-11-11
owner: devops
related:
  - docs/guides/deployment/production.md
  - docs/guides/api/backend-api.md
---

# Troubleshooting Guide

## Overview

This guide covers common issues and their solutions for VeroField deployment and operations.

## Common Issues

### Database Connection Issues

#### Problem: Cannot connect to database
**Symptoms:**
- Connection timeout errors
- "Connection refused" errors
- Database queries failing

**Solutions:**
1. Verify `DATABASE_URL` is correct
2. Check database is running and accessible
3. Verify network/firewall rules
4. Check database credentials
5. Verify connection pool settings

#### Problem: RLS blocking queries
**Symptoms:**
- Queries return zero rows unexpectedly
- "Permission denied" errors

**Solutions:**
1. Verify `app.tenant_id` is set for current session
2. Check RLS is enabled on table: `SELECT * FROM pg_policies WHERE tablename = 'table_name';`
3. Verify tenant context middleware is running
4. Check RLS policies are correct

### Authentication Issues

#### Problem: JWT validation failing
**Symptoms:**
- "Unauthorized" errors
- Token expiration errors
- Invalid token errors

**Solutions:**
1. Verify `JWT_SECRET` matches between services
2. Check token expiration settings
3. Verify token format
4. Check token is being sent in headers
5. Verify token includes required claims (tenant_id, roles)

#### Problem: Tenant context not set
**Symptoms:**
- Queries return no data
- Cross-tenant data access errors

**Solutions:**
1. Verify tenant middleware is running
2. Check `app.tenant_id` session variable is set
3. Verify middleware order (auth before tenant)
4. Check transaction/connection handling

### API Issues

#### Problem: CORS errors
**Symptoms:**
- Browser CORS errors
- Preflight request failures

**Solutions:**
1. Configure CORS in NestJS
2. Verify allowed origins
3. Check headers configuration
4. Verify preflight handling

#### Problem: API endpoints not found
**Symptoms:**
- 404 errors on API calls
- Routes not matching

**Solutions:**
1. Verify API base URL
2. Check route definitions
3. Verify controller registration
4. Check API prefix configuration

### Frontend Issues

#### Problem: Environment variables not loading
**Symptoms:**
- `undefined` values
- Missing configuration

**Solutions:**
1. Verify `VITE_` prefix for Vite variables
2. Check `.env` file location
3. Restart dev server after changes
4. Verify variable names match

#### Problem: API calls failing
**Symptoms:**
- Network errors
- 401/403 errors
- CORS errors

**Solutions:**
1. Verify API URL configuration
2. Check authentication token
3. Verify CORS configuration
4. Check network connectivity

### Deployment Issues

#### Problem: Build failures
**Symptoms:**
- TypeScript errors
- Missing dependencies
- Build timeouts

**Solutions:**
1. Check TypeScript errors
2. Verify all dependencies installed
3. Check build configuration
4. Review build logs

#### Problem: Environment variables missing
**Symptoms:**
- Application errors on startup
- Missing configuration errors

**Solutions:**
1. Verify all required variables set
2. Check variable names match code
3. Verify platform-specific variable format
4. Check variable visibility settings

## Debugging Tips

### Enable Debug Logging
```typescript
// Backend
process.env.DEBUG = 'true';

// Frontend
localStorage.setItem('debug', 'true');
```

### Check Database State
```sql
-- Verify tenant context
SELECT current_setting('app.tenant_id', true);

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'accounts';

-- Verify tenant data
SELECT COUNT(*) FROM accounts WHERE tenant_id = '<tenant_id>';
```

### Verify API Endpoints
```bash
# Health check
curl https://api.yourdomain.com/health

# Test authentication
curl -X POST https://api.yourdomain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## Getting Help

### Check Documentation
- [Production Deployment](production.md)
- [API Documentation](../api/backend-api.md)
- [Security Architecture](../../architecture/security.md)

### Logs
- Application logs
- Database logs
- Platform logs
- Error tracking (Sentry, etc.)

### Support
- Check [Ownership Map](../../OWNERS.md) for area owners
- Review [Troubleshooting Guide](troubleshooting.md)
- Check GitHub issues

## Related Documentation

- [Production Deployment](production.md) - Deployment guide
- [Database Migrations](database-migrations.md) - Migration troubleshooting
- [API Documentation](../api/backend-api.md) - API troubleshooting

---

**Last Updated:** 2025-11-11  
**Maintained By:** DevOps  
**Review Frequency:** As needed





