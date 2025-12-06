# VeroField Deployment Runbook

**Last Updated:** 2025-12-05  
**Maintainer:** DevOps Team

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Docker Deployment](#docker-deployment)
3. [Kubernetes Deployment](#kubernetes-deployment)
4. [Blue-Green Deployment](#blue-green-deployment)
5. [Rollback Procedures](#rollback-procedures)
6. [Health Checks](#health-checks)
7. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Required Before ANY Production Deployment

- [ ] **Database migrations applied** (see `docs/MIGRATION_INSTRUCTIONS.md`)
  ```bash
  npm run db:migrate
  ```

- [ ] **Environment variables configured** 
  - Copy `.env.production.example` to `.env.production`
  - Fill in ALL required values
  - Verify secrets are secure (use secrets manager in K8s)

- [ ] **Integration tests passing**
  ```bash
  cd backend && npm test -- --testPathPattern="integration"
  ```

- [ ] **Build succeeds locally**
  ```bash
  docker build -t verofield-api:test backend/
  docker build -t verofield-frontend:test frontend/
  ```

- [ ] **Security scan passed**
  ```bash
  npm audit --audit-level=high
  ```

- [ ] **Backup database** (critical!)
  ```bash
  pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql
  ```

---

## Docker Deployment

### Local Production Testing

1. **Build images:**
```bash
cd deploy
docker-compose -f docker-compose.prod.yml build
```

2. **Set environment variables:**
```bash
export VERSION=1.0.0
export DATABASE_URL=your_database_url
export SUPABASE_URL=your_supabase_url
export SUPABASE_SERVICE_KEY=your_service_key
export JWT_SECRET=your_jwt_secret
export REDIS_URL=redis://redis:6379
```

3. **Start services:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

4. **Verify health:**
```bash
curl http://localhost:3000/api/health
curl http://localhost:80/health
```

5. **View logs:**
```bash
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend
```

### Production Docker Deployment

1. **Push images to registry:**
```bash
docker tag verofield-api:latest your-registry.com/verofield-api:${VERSION}
docker tag verofield-frontend:latest your-registry.com/verofield-frontend:${VERSION}

docker push your-registry.com/verofield-api:${VERSION}
docker push your-registry.com/verofield-frontend:${VERSION}
```

2. **Deploy on production server:**
```bash
ssh production-server
cd /opt/verofield
docker-compose pull
docker-compose up -d
```

---

## Kubernetes Deployment

### Initial Setup (First Time Only)

1. **Create namespace:**
```bash
kubectl apply -f deploy/k8s/namespace.yaml
```

2. **Create secrets:**
```bash
# Copy template and fill in values
cp deploy/k8s/secrets.yaml.example deploy/k8s/secrets.yaml
# Edit secrets.yaml with real values
vi deploy/k8s/secrets.yaml

# Apply secrets
kubectl apply -f deploy/k8s/secrets.yaml
```

3. **Create ConfigMap:**
```bash
kubectl apply -f deploy/k8s/configmap.yaml
```

### Deploy Application

1. **Deploy services:**
```bash
kubectl apply -f deploy/k8s/service.yaml
```

2. **Deploy applications:**
```bash
kubectl apply -f deploy/k8s/deployment.yaml
```

3. **Verify deployment:**
```bash
# Check pods are running
kubectl get pods -n verofield

# Check services
kubectl get svc -n verofield

# View logs
kubectl logs -n verofield -l app=verofield-api -f
```

4. **Get LoadBalancer IP:**
```bash
kubectl get svc verofield-frontend -n verofield
```

---

## Blue-Green Deployment

### Overview
Blue-green deployment allows zero-downtime releases by running two identical environments (blue and green) and switching traffic between them.

### Deployment Steps

1. **Deploy GREEN version** (while BLUE is active):
```bash
# Update deployment.yaml to create green deployment
kubectl apply -f deploy/k8s/deployment-green.yaml
```

2. **Wait for GREEN to be healthy:**
```bash
kubectl rollout status deployment/verofield-api-green -n verofield
```

3. **Test GREEN environment:**
```bash
# Get GREEN pod IP
kubectl get pods -n verofield -l version=green -o wide

# Port-forward for testing
kubectl port-forward -n verofield deployment/verofield-api-green 3001:3000

# Test endpoints
curl http://localhost:3001/api/health
```

4. **Switch traffic to GREEN:**
```bash
# Update service selector
kubectl patch svc verofield-api -n verofield -p '{"spec":{"selector":{"version":"green"}}}'
```

5. **Verify traffic switched:**
```bash
# Monitor logs - should see new requests on green
kubectl logs -n verofield -l version=green -f
```

6. **Keep BLUE for rollback** (delete after 24h if no issues):
```bash
# After 24 hours of stable green
kubectl delete deployment verofield-api-blue -n verofield
```

### Switching Back to BLUE (Rollback)

```bash
kubectl patch svc verofield-api -n verofield -p '{"spec":{"selector":{"version":"blue"}}}'
```

---

## Rollback Procedures

### Immediate Rollback (< 5 minutes ago)

**Kubernetes:**
```bash
kubectl rollout undo deployment/verofield-api -n verofield
kubectl rollout status deployment/verofield-api -n verofield
```

**Docker Compose:**
```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

### Database Rollback

**⚠️ CAUTION: Database rollbacks can cause data loss!**

1. **Stop application:**
```bash
kubectl scale deployment verofield-api -n verofield --replicas=0
```

2. **Restore database backup:**
```bash
psql $DATABASE_URL < backup-YYYYMMDD-HHMMSS.sql
```

3. **Run down migrations (if available):**
```bash
cd backend
npm run db:migrate:down
```

4. **Restart application:**
```bash
kubectl scale deployment verofield-api -n verofield --replicas=3
```

### Feature Flag Kill Switch

**Emergency disable of new features:**

```typescript
// In Supabase dashboard or via API
UPDATE feature_flags 
SET enabled = false 
WHERE flag_name = 'region_dashboard_v2';
```

---

## Health Checks

### Backend Health

```bash
curl http://your-domain.com/api/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-12-05T10:00:00.000Z",
  "uptime": 3600,
  "database": "connected",
  "redis": "connected"
}
```

### Frontend Health

```bash
curl http://your-domain.com/health

# Expected response:
OK
```

### Database Connection

```bash
kubectl exec -it -n verofield deployment/verofield-api -- \
  psql $DATABASE_URL -c "SELECT 1;"
```

### Redis Connection

```bash
kubectl exec -it -n verofield deployment/verofield-redis -- \
  redis-cli ping
```

---

## Troubleshooting

### Pods Not Starting

**Check pod status:**
```bash
kubectl describe pod <pod-name> -n verofield
kubectl logs <pod-name> -n verofield
```

**Common issues:**
- Missing secrets → Verify `kubectl get secrets -n verofield`
- Image pull errors → Check image name and registry credentials
- Health check failing → Check `/api/health` endpoint

### Database Connection Errors

**Test connection:**
```bash
kubectl exec -it deployment/verofield-api -n verofield -- \
  sh -c 'echo $DATABASE_URL'
```

**Check RLS policies:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'dashboard_regions';
```

### High Memory Usage

**Check resource usage:**
```bash
kubectl top pods -n verofield
```

**Increase limits:**
```yaml
resources:
  limits:
    memory: "1Gi"
```

### Rate Limiting Issues

**Check Redis:**
```bash
kubectl exec -it deployment/verofield-redis -n verofield -- \
  redis-cli keys "rate-limit:*"
```

**Clear rate limits:**
```bash
kubectl exec -it deployment/verofield-redis -n verofield -- \
  redis-cli flushdb
```

---

## Monitoring & Alerts

### Key Metrics to Monitor

- **Request Rate:** Should be < 1000 req/sec per pod
- **Error Rate:** Should be < 1%
- **P95 Latency:** Should be < 500ms
- **Memory Usage:** Should be < 80% of limit
- **Database Connections:** Should be < 80% of pool size

### Alert Thresholds

```yaml
alerts:
  - name: HighErrorRate
    condition: error_rate > 5%
    for: 5m
    severity: critical
  
  - name: HighLatency
    condition: p95_latency > 1s
    for: 10m
    severity: warning
  
  - name: PodRestarts
    condition: restarts > 3
    for: 15m
    severity: warning
```

---

## Emergency Contacts

- **On-Call Engineer:** [Your On-Call System]
- **Database Admin:** [DB Admin Contact]
- **DevOps Team:** [DevOps Contact]
- **Supabase Support:** support@supabase.io

---

## Post-Deployment Verification

After ANY deployment, verify:

- [ ] Health checks return 200 OK
- [ ] Login flow works
- [ ] Dashboard loads without errors
- [ ] WebSocket connections establish
- [ ] Background jobs running (check logs)
- [ ] No 500 errors in logs for 10 minutes
- [ ] Database queries < 100ms P95
- [ ] Redis cache hit rate > 70%

---

## Maintenance Windows

**Recommended schedule:**
- **Minor updates:** Rolling deployment (no downtime)
- **Database migrations:** Tuesday/Thursday 2-4 AM UTC
- **Major releases:** Saturday 12-2 AM UTC

**Communication:**
- Post notice in #engineering 24h before
- Update status page
- Send email to users 1h before (for major releases)


