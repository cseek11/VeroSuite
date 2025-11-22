# Automated Secret Rotation Plan

**Date:** 2025-11-22  
**Status:** 📋 Planning  
**Priority:** Medium

---

## Executive Summary

This document outlines a plan for implementing automated secret rotation for VeroField. Currently, secret rotation is a manual process documented in `docs/SECRET_ROTATION_GUIDE.md`. This plan proposes an automated solution to improve security and reduce operational overhead.

---

## Current State

### Manual Secret Rotation Process

**Current Process:**
1. Generate new secrets
2. Update environment variables in all environments
3. Rotate secrets in external services (Supabase, Stripe, etc.)
4. Update application configuration
5. Test in staging
6. Deploy to production
7. Monitor for issues

**Challenges:**
- ⚠️ Manual process is error-prone
- ⚠️ Requires coordination across multiple systems
- ⚠️ Risk of service disruption if not done correctly
- ⚠️ No automated validation
- ⚠️ Time-consuming for operations team

### Secrets Requiring Rotation

**Application Secrets:**
- `JWT_SECRET` - JWT signing key (32+ characters)
- `ENCRYPTION_KEY` - Data encryption key (64 hex characters)

**External Service Secrets:**
- `SUPABASE_SECRET_KEY` - Supabase backend secret key
- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signature secret
- `SENDGRID_API_KEY` - SendGrid email API key

**Database:**
- `DATABASE_URL` - PostgreSQL connection string (contains credentials)

---

## Proposed Solution

### Phase 1: Secret Management Service (Weeks 1-2)

**Goal:** Create a centralized secret management service

**Components:**
1. **Secret Storage Service**
   - Store secrets in encrypted format
   - Support multiple environments (dev, staging, prod)
   - Version control for secrets (rollback capability)
   - Audit logging for secret access

2. **Secret Rotation Service**
   - Automated secret generation
   - Rotation scheduling
   - Multi-phase rotation (generate → update → validate → cleanup)
   - Rollback capability

3. **Integration Layer**
   - API for secret retrieval
   - Webhook support for secret updates
   - Environment variable injection
   - ConfigService integration

**Technology Options:**
- **Option A:** AWS Secrets Manager / Azure Key Vault / GCP Secret Manager
  - Pros: Managed service, automatic rotation, audit logging
  - Cons: Cloud provider lock-in, cost
  - Best for: Cloud-native deployments

- **Option B:** HashiCorp Vault
  - Pros: Open source, self-hosted, flexible
  - Cons: Requires infrastructure, operational overhead
  - Best for: Self-hosted or hybrid deployments

- **Option C:** Custom Secret Management Service
  - Pros: Full control, tailored to needs
  - Cons: Development effort, security responsibility
  - Best for: Specific requirements not met by existing solutions

**Recommendation:** Start with Option A (AWS Secrets Manager) if using AWS, or Option B (HashiCorp Vault) for self-hosted.

---

### Phase 2: Automated Rotation Workflows (Weeks 3-4)

**Goal:** Implement automated rotation workflows for each secret type

**Workflow Pattern:**
```
1. Generate New Secret
   ├─ Validate format/strength
   ├─ Store in secret manager
   └─ Log rotation start

2. Update External Services
   ├─ Update Supabase project settings
   ├─ Update Stripe API keys
   ├─ Update SendGrid API keys
   └─ Verify updates successful

3. Update Application Configuration
   ├─ Update environment variables (staging first)
   ├─ Deploy to staging
   ├─ Run validation tests
   └─ Verify application works

4. Production Rollout
   ├─ Update production environment variables
   ├─ Deploy to production
   ├─ Monitor for errors
   └─ Verify application works

5. Cleanup
   ├─ Mark old secret as deprecated
   ├─ Schedule old secret deletion (after grace period)
   └─ Log rotation completion
```

**Secret-Specific Considerations:**

**JWT_SECRET:**
- ✅ No external service update needed
- ✅ Can rotate immediately (new tokens use new secret)
- ⚠️ Existing tokens become invalid (users need to re-login)
- **Strategy:** Rotate during low-traffic period, notify users

**ENCRYPTION_KEY:**
- ⚠️ Requires data migration (decrypt with old key, encrypt with new key)
- ⚠️ Must maintain old key during migration
- ⚠️ High risk if migration fails
- **Strategy:** Use dual-key encryption during transition, migrate gradually

**SUPABASE_SECRET_KEY:**
- ✅ Update via Supabase API
- ✅ Can maintain both keys during transition
- **Strategy:** Update in Supabase dashboard/API, update app config, verify, remove old key

**STRIPE_SECRET_KEY:**
- ✅ Update via Stripe Dashboard/API
- ✅ Can maintain both keys during transition
- **Strategy:** Create new key in Stripe, update app config, verify, deactivate old key

**DATABASE_URL:**
- ⚠️ Requires database password rotation
- ⚠️ May require connection pool restart
- **Strategy:** Rotate database password, update connection string, restart app

---

### Phase 3: Monitoring & Alerting (Week 5)

**Goal:** Implement monitoring and alerting for secret rotation

**Monitoring:**
- Secret rotation success/failure rates
- Secret expiration tracking
- Secret access patterns
- Rotation schedule compliance

**Alerting:**
- Failed rotation attempts
- Secrets approaching expiration
- Unusual secret access patterns
- Rotation schedule deviations

**Dashboards:**
- Secret rotation status dashboard
- Secret expiration calendar
- Access audit log viewer

---

### Phase 4: CI/CD Integration (Week 6)

**Goal:** Integrate secret rotation into CI/CD pipeline

**GitHub Actions Workflow:**
```yaml
name: Rotate Secrets

on:
  schedule:
    - cron: '0 2 * * 0'  # Weekly on Sunday at 2 AM
  workflow_dispatch:  # Manual trigger

jobs:
  rotate-secrets:
    runs-on: ubuntu-latest
    steps:
      - name: Check secret expiration
      - name: Generate new secrets
      - name: Update external services
      - name: Update staging environment
      - name: Run validation tests
      - name: Update production environment
      - name: Monitor for issues
      - name: Cleanup old secrets
```

**Validation Tests:**
- API health checks
- Authentication tests
- Database connection tests
- External service integration tests

---

## Implementation Plan

### Week 1-2: Secret Management Service
- [ ] Choose secret management solution
- [ ] Set up secret storage infrastructure
- [ ] Implement secret storage service
- [ ] Implement secret retrieval API
- [ ] Add audit logging
- [ ] Create integration with ConfigService

### Week 3-4: Automated Rotation Workflows
- [ ] Implement JWT_SECRET rotation
- [ ] Implement ENCRYPTION_KEY rotation (with data migration)
- [ ] Implement SUPABASE_SECRET_KEY rotation
- [ ] Implement STRIPE_SECRET_KEY rotation
- [ ] Implement DATABASE_URL rotation
- [ ] Add rollback capability
- [ ] Add validation tests

### Week 5: Monitoring & Alerting
- [ ] Set up monitoring dashboards
- [ ] Configure alerting rules
- [ ] Implement secret expiration tracking
- [ ] Create audit log viewer

### Week 6: CI/CD Integration
- [ ] Create GitHub Actions workflow
- [ ] Add validation test suite
- [ ] Set up staging rotation schedule
- [ ] Set up production rotation schedule
- [ ] Document rotation procedures

---

## Security Considerations

### Secret Storage
- ✅ Secrets encrypted at rest
- ✅ Secrets encrypted in transit
- ✅ Access control (RBAC)
- ✅ Audit logging for all access
- ✅ Secret versioning for rollback

### Rotation Process
- ✅ Zero-downtime rotation (where possible)
- ✅ Dual-key support during transition
- ✅ Automatic rollback on failure
- ✅ Validation before production deployment
- ✅ Grace period before old secret deletion

### Access Control
- ✅ Least privilege principle
- ✅ Service accounts for automation
- ✅ Human approval for production rotations
- ✅ Multi-factor authentication for manual access

---

## Cost-Benefit Analysis

### Benefits
- ✅ Improved security (regular rotation)
- ✅ Reduced operational overhead
- ✅ Reduced risk of human error
- ✅ Compliance with security standards
- ✅ Automated audit trail

### Costs
- ⚠️ Initial development effort (6 weeks)
- ⚠️ Infrastructure costs (secret management service)
- ⚠️ Maintenance overhead
- ⚠️ Testing and validation effort

### ROI
- **Time Savings:** ~4 hours/month manual rotation → ~15 minutes/month automated
- **Risk Reduction:** Eliminates human error in rotation process
- **Compliance:** Meets security standards for regular secret rotation

---

## Alternatives Considered

### Alternative 1: Keep Manual Process
- **Pros:** No development effort, full control
- **Cons:** Error-prone, time-consuming, risk of service disruption
- **Decision:** Rejected - benefits of automation outweigh costs

### Alternative 2: Semi-Automated (Scripts)
- **Pros:** Less development effort, some automation
- **Cons:** Still requires manual coordination, no validation
- **Decision:** Considered - may be interim solution

### Alternative 3: Third-Party Secret Rotation Service
- **Pros:** Fully managed, minimal development
- **Cons:** Vendor lock-in, cost, may not support all secrets
- **Decision:** Consider for future if requirements grow

---

## Success Criteria

### Phase 1 Success:
- ✅ Secrets stored securely
- ✅ Secret retrieval API working
- ✅ ConfigService integration complete

### Phase 2 Success:
- ✅ All secrets can be rotated automatically
- ✅ Zero-downtime rotation for supported secrets
- ✅ Rollback capability working

### Phase 3 Success:
- ✅ Monitoring dashboards operational
- ✅ Alerting configured and tested
- ✅ Audit logs accessible

### Phase 4 Success:
- ✅ CI/CD workflow running on schedule
- ✅ Validation tests passing
- ✅ Production rotations successful

---

## Next Steps

### Immediate (This Week):
1. **Review and approve plan**
2. **Choose secret management solution**
3. **Set up development environment**

### Short Term (Weeks 1-2):
1. **Implement secret management service**
2. **Create integration with ConfigService**
3. **Set up audit logging**

### Medium Term (Weeks 3-6):
1. **Implement rotation workflows**
2. **Add monitoring and alerting**
3. **Integrate with CI/CD**

---

## Related Documentation

- `docs/SECRET_ROTATION_GUIDE.md` - Current manual rotation procedures
- `docs/compliance-reports/SECRET_EXPOSURE_STATUS_2025-11-22.md` - Secret exposure audit
- `apps/api/README_ENV_SETUP.md` - Environment variable setup guide

---

**Last Updated:** 2025-11-22  
**Status:** 📋 Planning  
**Next Review:** After Phase 1 completion

