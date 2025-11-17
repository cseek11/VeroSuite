---
title: Production Deployment Guide
category: Deployment
status: active
last_reviewed: 2025-11-11
owner: devops
related:
  - docs/guides/deployment/database-migrations.md
  - docs/guides/deployment/troubleshooting.md
  - docs/architecture/security.md
---

# Production Deployment Guide

## Overview

This guide covers deploying VeroField to production environments, including security setup, environment configuration, and deployment best practices.

## Prerequisites

- Production database (PostgreSQL)
- Supabase project (or equivalent)
- Hosting platform (Vercel, Netlify, AWS, etc.)
- Domain name configured
- SSL certificate

## Pre-Deployment Checklist

### Security
- [ ] All `.env` files excluded from version control
- [ ] Strong JWT secrets generated
- [ ] Database credentials secured
- [ ] Supabase keys rotated if previously exposed
- [ ] HTTPS configured
- [ ] RLS policies enabled on all tenant tables

### Environment Variables
- [ ] All required variables set
- [ ] Production values configured
- [ ] No development/test values in production
- [ ] Secrets stored securely (not in code)

### Database
- [ ] Production database created
- [ ] Migrations applied
- [ ] RLS policies enabled
- [ ] Seed data loaded (if needed)
- [ ] Backups configured

## Deployment Steps

### 1. Backend Deployment

#### Environment Variables
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_SECRET_KEY=...
JWT_SECRET=...
PORT=3001
```

#### Build and Deploy
```bash
cd backend
npm install --production
npm run build
# Deploy dist/ directory to hosting platform
```

### 2. Frontend Deployment

#### Environment Variables
```env
VITE_API_URL=https://api.yourdomain.com
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

#### Build and Deploy
```bash
cd frontend
npm install
npm run build
# Deploy dist/ directory to hosting platform
```

### 3. Database Setup

See [Database Migrations Guide](database-migrations.md) for detailed migration steps.

### 4. Security Configuration

#### RLS Policies
Ensure all tenant-scoped tables have RLS enabled:
```sql
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
-- Apply tenant isolation policies
```

#### SSL/TLS
- Configure HTTPS for all endpoints
- Use secure cookies for sessions
- Enable HSTS headers

## Platform-Specific Guides

### Vercel
1. Connect repository
2. Set environment variables in dashboard
3. Configure build settings
4. Deploy

### Netlify
1. Connect repository
2. Set environment variables
3. Configure build command: `npm run build`
4. Set publish directory: `dist`
5. Deploy

### AWS/Docker
1. Build Docker image
2. Push to container registry
3. Deploy to ECS/EKS
4. Configure environment variables
5. Set up load balancer with SSL

## Post-Deployment

### Verification
- [ ] Health check endpoint responding
- [ ] Authentication working
- [ ] Database connections successful
- [ ] RLS policies enforced
- [ ] API endpoints accessible
- [ ] Frontend loading correctly

### Monitoring
- Set up error tracking (Sentry, etc.)
- Configure application monitoring
- Set up database monitoring
- Configure log aggregation

### Backup Strategy
- Database backups (daily)
- File storage backups
- Configuration backups
- Disaster recovery plan

## Security

### Production Security Checklist
- [ ] HTTPS enforced
- [ ] Strong JWT secrets
- [ ] Database credentials secured
- [ ] RLS policies enabled
- [ ] Audit logging enabled
- [ ] Error messages don't expose sensitive info
- [ ] Rate limiting configured
- [ ] CORS properly configured

See [Security Architecture](../../architecture/security.md) for details.

## Troubleshooting

See [Troubleshooting Guide](troubleshooting.md) for common issues and solutions.

## Related Documentation

- [Database Migrations](database-migrations.md) - Migration process
- [Troubleshooting](troubleshooting.md) - Common issues
- [Security Architecture](../../architecture/security.md) - Security model
- [Security Setup Guide](../../../SECURITY_SETUP_GUIDE.md) - Security setup

---

**Last Updated:** 2025-11-11  
**Maintained By:** DevOps  
**Review Frequency:** On deployment changes





