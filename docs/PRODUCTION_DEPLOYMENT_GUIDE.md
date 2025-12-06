# Production Deployment Guide - Region Dashboard

**Date:** 2025-12-05  
**Status:** Complete  
**Phase:** 9.5 - Production Deployment Documentation

---

## Overview

This guide provides step-by-step instructions for deploying the Region Dashboard system to production. Follow these procedures carefully to ensure a smooth, secure deployment.

---

## Prerequisites

Before starting the deployment process, ensure you have:

- [ ] Production database (PostgreSQL/Supabase) configured
- [ ] Production Supabase project created
- [ ] Production environment variables configured
- [ ] SSL/TLS certificates obtained
- [ ] Hosting platform account (Vercel, AWS, etc.)
- [ ] Domain name configured
- [ ] Sentry account for error tracking
- [ ] All required secrets generated and stored securely

---

## Pre-Deployment Checklist

### 1. Environment Configuration

1. **Create Production Environment File**
   ```bash
   # Backend
   cp backend/.env.production.example backend/.env.production
   # Edit .env.production with actual production values
   
   # Frontend
   cp frontend/.env.production.example frontend/.env.production
   # Edit .env.production with actual production values
   ```

2. **Validate Environment Variables**
   ```bash
   cd backend
   npx ts-node scripts/validate-production-env.ts
   ```

3. **Verify All Required Variables**
   - ✅ `NODE_ENV=production`
   - ✅ `DATABASE_URL` (production database)
   - ✅ `SUPABASE_URL` (production Supabase)
   - ✅ `SUPABASE_SECRET_KEY` (production key)
   - ✅ `JWT_SECRET` (strong, 32+ characters)
   - ✅ `ALLOWED_ORIGINS` (production domains only)
   - ✅ `SENTRY_DSN` (production Sentry project)

### 2. Database Preparation

1. **Run Database Migrations**
   ```sql
   -- In Supabase SQL Editor, run in order:
   -- 1. create_dashboard_regions.sql (if not already applied)
   -- 2. fix_dashboard_regions_rls_for_acls.sql
   -- 3. enhance_dashboard_regions_rls_security.sql
   -- 4. create_dashboard_events_table.sql
   -- 5. create_dashboard_templates.sql
   ```

2. **Verify RLS Policies**
   ```sql
   -- Check RLS is enabled
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename LIKE 'dashboard_%';
   ```

3. **Configure Database Backups**
   - Set up automated daily backups
   - Test backup restoration process
   - Document backup retention policy

### 3. Security Hardening

1. **Review Security Checklist**
   - Complete `docs/developer/PRODUCTION_SECURITY_CHECKLIST.md`
   - Verify all security measures are in place

2. **Verify Security Headers**
   - Test CSP headers
   - Verify rate limiting
   - Check CORS configuration

3. **Rotate Secrets**
   - Generate new JWT_SECRET
   - Verify Supabase keys are production keys
   - Ensure no development secrets in production

---

## Deployment Steps

### Step 1: Run Tests

```bash
cd backend
npm test
npm run test:integration
```

**Expected Result:** All tests pass (43/43)

### Step 2: Build Applications

**Backend:**
```bash
cd backend
npm ci
npm run build
# Verify dist/ directory is created
```

**Frontend:**
```bash
cd frontend
npm ci
npm run build
# Verify dist/ directory is created
```

### Step 3: Deploy Backend

**Option A: Using Deployment Script (Recommended)**
```bash
# Windows PowerShell
cd backend
.\scripts\deploy-production.ps1 production

# Linux/Mac
cd backend
chmod +x scripts/deploy-production.sh
./scripts/deploy-production.sh production
```

**Option B: Manual Deployment**
1. Upload `backend/dist/` to your hosting platform
2. Set environment variables in hosting platform
3. Start the application
4. Verify health endpoints

### Step 4: Deploy Frontend

1. Upload `frontend/dist/` to your hosting platform (Vercel, Netlify, etc.)
2. Set environment variables in hosting platform
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: 20.x

### Step 5: Verify Deployment

1. **Health Checks**
   ```bash
   # Basic health check
   curl https://api.yourdomain.com/health
   
   # Detailed health check
   curl https://api.yourdomain.com/api/health
   
   # Liveness probe
   curl https://api.yourdomain.com/api/health/live
   
   # Readiness probe
   curl https://api.yourdomain.com/api/health/ready
   ```

2. **Verify Frontend**
   - Open production URL in browser
   - Check browser console for errors
   - Verify API calls are working
   - Test authentication flow

3. **Verify Monitoring**
   - Check Sentry for error tracking
   - Verify metrics endpoint: `/api/metrics`
   - Check logs for any errors

---

## Post-Deployment Verification

### Functional Testing

- [ ] User authentication works
- [ ] Dashboard loads correctly
- [ ] Region operations work (create, update, delete)
- [ ] Template features work
- [ ] Offline queue works
- [ ] PWA features work (if enabled)

### Performance Testing

- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] No memory leaks
- [ ] Database queries are optimized

### Security Testing

- [ ] Security headers are present
- [ ] Rate limiting is working
- [ ] CORS is configured correctly
- [ ] No exposed secrets
- [ ] Authentication is required

### Monitoring

- [ ] Error tracking is working (Sentry)
- [ ] Metrics are being collected
- [ ] Logs are being aggregated
- [ ] Alerts are configured

---

## Rollback Procedure

If deployment fails or issues are discovered:

1. **Immediate Rollback**
   ```bash
   # Revert to previous deployment
   # Platform-specific rollback commands
   ```

2. **Database Rollback** (if needed)
   - Restore database from backup
   - Run rollback migrations (if any)

3. **Verify Rollback**
   - Check health endpoints
   - Verify functionality
   - Check error logs

4. **Document Issues**
   - Document what went wrong
   - Update deployment procedures
   - Fix issues before next deployment

---

## Platform-Specific Guides

### Vercel Deployment

1. **Connect Repository**
   - Link GitHub repository to Vercel
   - Configure build settings

2. **Set Environment Variables**
   - Add all required environment variables
   - Use Vercel's environment variable management

3. **Deploy**
   - Push to main branch (auto-deploy)
   - Or deploy manually from Vercel dashboard

### AWS Deployment

1. **Build Docker Image**
   ```bash
   docker build -t verofield-backend:latest ./backend
   docker build -t verofield-frontend:latest ./frontend
   ```

2. **Push to ECR**
   ```bash
   aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
   docker push <account>.dkr.ecr.<region>.amazonaws.com/verofield-backend:latest
   ```

3. **Deploy to ECS/EKS**
   - Update service with new image
   - Verify health checks pass

### Netlify Deployment

1. **Connect Repository**
   - Link GitHub repository
   - Configure build settings

2. **Set Environment Variables**
   - Add all `VITE_*` variables
   - Configure build command: `npm run build`

3. **Deploy**
   - Auto-deploy on push to main
   - Or deploy manually

---

## Troubleshooting

### Common Issues

**Issue: Health check fails**
- Check database connectivity
- Verify environment variables
- Check application logs

**Issue: CORS errors**
- Verify `ALLOWED_ORIGINS` includes frontend domain
- Check CORS middleware configuration
- Verify credentials are set correctly

**Issue: Authentication fails**
- Verify JWT_SECRET is correct
- Check token expiration settings
- Verify Supabase keys are correct

**Issue: Database connection fails**
- Verify DATABASE_URL is correct
- Check database is accessible
- Verify SSL/TLS is configured

---

## Monitoring & Maintenance

### Daily Checks

- [ ] Error rate in Sentry
- [ ] API response times
- [ ] Database performance
- [ ] Health check status

### Weekly Checks

- [ ] Review error logs
- [ ] Check security alerts
- [ ] Review performance metrics
- [ ] Update dependencies

### Monthly Checks

- [ ] Security audit
- [ ] Performance optimization
- [ ] Backup verification
- [ ] Secret rotation

---

## Emergency Procedures

### Application Down

1. Check health endpoints
2. Review application logs
3. Check database connectivity
4. Verify hosting platform status
5. Rollback if necessary

### Security Incident

1. Isolate affected systems
2. Review security logs
3. Rotate compromised secrets
4. Document incident
5. Notify stakeholders

### Data Loss

1. Stop application immediately
2. Restore from backup
3. Verify data integrity
4. Investigate root cause
5. Implement prevention measures

---

## Support & Resources

### Documentation
- `docs/developer/PRODUCTION_SECURITY_CHECKLIST.md` - Security checklist
- `docs/developer/PHASE_9_PRODUCTION_DEPLOYMENT.md` - Phase 9 implementation
- `docs/developer/FINAL_HANDOFF_PROMPT.md` - Complete handoff document

### Health Endpoints
- `/health` - Basic health check
- `/api/health` - Detailed health check
- `/api/health/live` - Liveness probe
- `/api/health/ready` - Readiness probe
- `/api/metrics` - Prometheus metrics

### Monitoring
- Sentry: Error tracking and performance
- Metrics: `/api/metrics` endpoint
- Logs: Application logs (platform-specific)

---

**Last Updated:** 2025-12-05  
**Maintained By:** DevOps Team  
**Review Frequency:** On deployment changes


