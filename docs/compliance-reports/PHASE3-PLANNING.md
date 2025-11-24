# Phase 3: Dashboard & Operations — Planning Document

**Date:** 2025-11-24  
**Status:** Planning Phase  
**Phase:** 3 - Dashboard & Operations  
**Timeline:** Weeks 11-13 (3 weeks)  
**Dependencies:** Phase 2 Complete (✅ All 25 rules with Step 5 procedures)

---

## Executive Summary

Phase 3 focuses on building the operational infrastructure to monitor, visualize, and manage compliance across all 25 rules. This includes a compliance dashboard, monitoring/alerting systems, and operational runbooks.

**Goal:** Enable real-time visibility into rule compliance, violation trends, and system health.

---

## Phase 3 Objectives

### Primary Objectives

1. **Compliance Dashboard** - Real-time visualization of rule compliance status
2. **Monitoring & Alerts** - Automated detection and notification of violations
3. **Operations Runbooks** - Documentation for managing compliance operations

### Success Criteria

- ✅ Dashboard displays compliance status for all 25 rules
- ✅ Real-time violation tracking and trends
- ✅ Automated alerts for critical violations (Tier 1 BLOCK)
- ✅ Historical compliance data and trends
- ✅ Operations runbooks for common scenarios

---

## Current State Assessment

### Existing Infrastructure

**OPA Policies:**
- ✅ 10 consolidated OPA policies created
- ✅ All 25 rules have OPA policy mappings
- ✅ Test suites passing (17/17 for R25, others verified)

**CI/CD Integration:**
- ✅ GitHub Actions workflows exist
- ✅ OPA compliance check workflow (`opa_compliance_check.yml`)
- ✅ Reward Score computation workflow

**Missing Infrastructure:**
- ❌ Compliance dashboard application (`apps/forge-console/` does not exist)
- ❌ Compliance database schema
- ❌ Compliance API endpoints
- ❌ Monitoring/alerting infrastructure
- ❌ Operations runbooks

---

## Phase 3 Components

### Component 1: Compliance Dashboard Application

**Location:** `apps/forge-console/` (new application)

**Technology Stack:**
- **Frontend:** React + TypeScript + Tailwind CSS (consistent with main frontend)
- **Backend:** NestJS API (consistent with main API)
- **Database:** PostgreSQL (shared with main database, separate schema)
- **State Management:** Zustand + React Query

**Features:**
1. **Rule Compliance Overview**
   - Dashboard showing all 25 rules with compliance status
   - Color-coded indicators (Green/Yellow/Red)
   - Last checked timestamp
   - Violation counts per rule

2. **Violation Details**
   - List of current violations
   - Filter by rule, severity, file, PR
   - Violation details (file path, line number, message)
   - Link to PR/commit

3. **Trends & Analytics**
   - Compliance trends over time
   - Violation frequency by rule
   - Most common violations
   - Compliance score trends

4. **Rule-Specific Views**
   - Detailed view for each rule (R01-R25)
   - Historical compliance data
   - Violation patterns
   - Remediation suggestions

5. **PR Compliance Status**
   - Real-time compliance status for open PRs
   - Violation breakdown by rule
   - Block/Override/Warning counts
   - Compliance score per PR

**Database Schema:**
```sql
-- Compliance checks table
CREATE TABLE compliance_checks (
  id UUID PRIMARY KEY,
  pr_number INTEGER,
  commit_sha TEXT,
  rule_id TEXT, -- R01, R02, etc.
  status TEXT, -- PASS, VIOLATION, OVERRIDE
  severity TEXT, -- BLOCK, OVERRIDE, WARNING
  file_path TEXT,
  violation_message TEXT,
  created_at TIMESTAMP,
  resolved_at TIMESTAMP
);

-- Compliance trends table
CREATE TABLE compliance_trends (
  id UUID PRIMARY KEY,
  date DATE,
  rule_id TEXT,
  violation_count INTEGER,
  compliance_rate DECIMAL,
  created_at TIMESTAMP
);
```

**API Endpoints:**
- `GET /api/compliance/rules` - List all rules with current status
- `GET /api/compliance/violations` - List current violations
- `GET /api/compliance/pr/:prNumber` - Get PR compliance status
- `GET /api/compliance/trends` - Get compliance trends
- `GET /api/compliance/rule/:ruleId` - Get rule-specific data

**Estimated Effort:** 2-3 weeks

---

### Component 2: Monitoring & Alerting Infrastructure

**Components:**

1. **OPA Policy Evaluation Integration**
   - Integrate OPA evaluation into CI/CD pipeline
   - Store evaluation results in compliance database
   - Real-time violation detection

2. **Alert System**
   - **Tier 1 (BLOCK):** Immediate alerts (Slack, email, PagerDuty)
   - **Tier 2 (OVERRIDE):** Daily summary alerts
   - **Tier 3 (WARNING):** Weekly summary reports

3. **Monitoring Metrics**
   - Compliance rate per rule
   - Violation frequency
   - Average time to resolution
   - PR compliance score distribution

4. **Alert Channels**
   - Slack integration (real-time notifications)
   - Email summaries (daily/weekly)
   - Dashboard notifications (in-app)
   - Optional: PagerDuty for critical violations

**Configuration:**
```yaml
# .github/workflows/compliance-monitoring.yml
alerts:
  tier1:
    channels: [slack, email, pagerduty]
    threshold: 1  # Alert on any Tier 1 violation
  tier2:
    channels: [slack, email]
    threshold: 5  # Alert if 5+ Tier 2 violations
    frequency: daily
  tier3:
    channels: [email]
    threshold: 10  # Alert if 10+ Tier 3 violations
    frequency: weekly
```

**Estimated Effort:** 1 week

---

### Component 3: Operations Runbooks

**Documentation Structure:**

1. **Compliance Operations Runbook** (`docs/operations/compliance-runbook.md`)
   - How to check compliance status
   - How to resolve violations
   - How to handle overrides
   - Emergency procedures

2. **Dashboard Operations Runbook** (`docs/operations/dashboard-runbook.md`)
   - Dashboard access and navigation
   - How to interpret compliance metrics
   - Troubleshooting dashboard issues
   - Data refresh procedures

3. **Alert Response Runbook** (`docs/operations/alert-response-runbook.md`)
   - How to respond to Tier 1 alerts
   - How to investigate violations
   - How to escalate issues
   - Post-incident procedures

4. **Rule-Specific Runbooks** (`docs/operations/rules/`)
   - Individual runbooks for each rule (R01-R25)
   - Common violation scenarios
   - Resolution procedures
   - Prevention strategies

**Estimated Effort:** 3-5 days

---

## Implementation Plan

### Week 11: Dashboard Foundation

**Days 1-2: Database & API Setup**
- [ ] Create compliance database schema
- [ ] Set up NestJS API application (`apps/forge-console/`)
- [ ] Create compliance service and controller
- [ ] Implement basic CRUD endpoints

**Days 3-4: Frontend Dashboard**
- [ ] Set up React dashboard application
- [ ] Create rule compliance overview component
- [ ] Implement violation list component
- [ ] Add filtering and search functionality

**Days 5-7: Integration**
- [ ] Integrate OPA evaluation results into database
- [ ] Connect dashboard to API
- [ ] Add real-time updates (WebSocket or polling)
- [ ] Basic styling and UX polish

### Week 12: Monitoring & Alerts

**Days 1-3: Monitoring Infrastructure**
- [ ] Set up monitoring metrics collection
- [ ] Create compliance trends tracking
- [ ] Implement violation aggregation
- [ ] Add compliance rate calculations

**Days 4-5: Alert System**
- [ ] Set up Slack integration
- [ ] Set up email notifications
- [ ] Implement alert rules (Tier 1/2/3)
- [ ] Create alert templates

**Days 6-7: Testing & Refinement**
- [ ] Test alert delivery
- [ ] Verify monitoring accuracy
- [ ] Refine alert thresholds
- [ ] Document alert procedures

### Week 13: Operations & Documentation

**Days 1-3: Operations Runbooks**
- [ ] Write compliance operations runbook
- [ ] Write dashboard operations runbook
- [ ] Write alert response runbook
- [ ] Create rule-specific runbooks (R01-R25)

**Days 4-5: Dashboard Enhancements**
- [ ] Add trends and analytics views
- [ ] Implement PR compliance status
- [ ] Add export functionality
- [ ] Performance optimization

**Days 5-7: Final Testing & Deployment**
- [ ] End-to-end testing
- [ ] Load testing
- [ ] Security review
- [ ] **Production Readiness Tasks** (CRITICAL):
  - [ ] Implement async write queue for compliance updates
  - [ ] Configure separate connection pool for compliance service
  - [ ] Set up resource monitoring (connection pool, query times)
  - [ ] Configure query performance alerts
  - [ ] Test production safeguards (async writes, connection isolation)
  - [ ] Document production deployment procedures
- [ ] Production deployment
- [ ] Team training

---

## Production Readiness Tasks (Detailed Implementation)

### Task 1: Async Write Queue Implementation

**Purpose:** Prevent compliance writes from blocking CI/CD or impacting main app performance

**Implementation:**
```typescript
// apps/api/src/compliance/compliance-queue.service.ts
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ComplianceQueueService {
  private queue: Queue;

  constructor(private configService: ConfigService) {
    this.queue = new Queue('compliance-writes', {
      connection: {
        host: this.configService.get('REDIS_HOST', 'localhost'),
        port: this.configService.get('REDIS_PORT', 6379),
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: {
          age: 3600, // Keep completed jobs for 1 hour
          count: 1000, // Keep last 1000 jobs
        },
      },
    });
  }

  async addViolation(violationData: ComplianceViolationDto): Promise<void> {
    await this.queue.add('store-violation', violationData, {
      priority: violationData.severity === 'BLOCK' ? 1 : 5, // Higher priority for BLOCK
    });
  }

  async addTrend(trendData: ComplianceTrendDto): Promise<void> {
    await this.queue.add('store-trend', trendData, {
      priority: 10, // Lower priority for trends
    });
  }
}

// Worker: apps/api/src/compliance/compliance-worker.service.ts
import { Worker } from 'bullmq';
import { ComplianceService } from './compliance.service';

@Injectable()
export class ComplianceWorkerService {
  private worker: Worker;

  constructor(
    private complianceService: ComplianceService,
    private configService: ConfigService,
  ) {
    this.worker = new Worker(
      'compliance-writes',
      async (job) => {
        switch (job.name) {
          case 'store-violation':
            await this.complianceService.storeViolation(job.data);
            break;
          case 'store-trend':
            await this.complianceService.storeTrend(job.data);
            break;
        }
      },
      {
        connection: {
          host: this.configService.get('REDIS_HOST', 'localhost'),
          port: this.configService.get('REDIS_PORT', 6379),
        },
        concurrency: 5, // Process 5 jobs concurrently
      },
    );

    this.worker.on('completed', (job) => {
      this.logger.log(`Compliance job ${job.id} completed`);
    });

    this.worker.on('failed', (job, err) => {
      this.logger.error(`Compliance job ${job?.id} failed: ${err.message}`);
    });
  }
}
```

**CI/CD Integration:**
```typescript
// In GitHub Actions workflow or CI/CD script
// After OPA evaluation, queue compliance writes (non-blocking)
await complianceQueueService.addViolation(violationData);
// CI/CD continues immediately, compliance writes happen async
```

**Benefits:**
- ✅ CI/CD doesn't wait for database writes
- ✅ Compliance writes don't block main app
- ✅ Automatic retry on failures
- ✅ Priority-based processing (BLOCK violations first)

---

### Task 2: Separate Connection Pool Configuration

**Purpose:** Isolate compliance database connections from main app connection pool

**Implementation:**
```typescript
// apps/api/src/compliance/compliance-database.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ComplianceDatabaseService extends PrismaClient 
  implements OnModuleInit, OnModuleDestroy {
  
  constructor(private configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    
    // Prisma manages its own connection pool
    // Default pool size: num_physical_cpus * 2 + 1
    // For compliance isolation, we create a separate PrismaClient instance
    super({
      datasources: {
        db: {
          url: databaseUrl, // Use same database URL
        },
      },
      log: ['warn', 'error'], // Only log warnings and errors
    });
    
    // Note: Prisma connection pool is managed internally
    // To limit connections, use database-level connection limits or PgBouncer
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Use compliance schema explicitly
  get compliance() {
    return this.$extends({
      name: 'compliance',
      query: {
        $allModels: {
          async findMany({ model, operation, args, query }) {
            // Ensure all queries use compliance schema
            if (!args.where?.schema) {
              args.where = { ...args.where, schema: 'compliance' };
            }
            return query(args);
          },
        },
      },
    });
  }
}
```

**Usage:**
```typescript
// apps/api/src/compliance/compliance.service.ts
@Injectable()
export class ComplianceService {
  constructor(
    private complianceDb: ComplianceDatabaseService,
  ) {}

  async storeViolation(data: ComplianceViolationDto): Promise<void> {
    // Uses dedicated connection pool (max 5 connections)
    await this.complianceDb.compliance.complianceCheck.create({
      data: {
        tenantId: data.tenantId,
        prNumber: data.prNumber,
        ruleId: data.ruleId,
        status: data.status,
        severity: data.severity,
        // ... other fields
      },
    });
  }
}
```

**Connection Pool Strategy:**

**Recommended Approach:** Separate PrismaClient Instance

1. **Prisma manages its own connection pool** (default: num_physical_cpus * 2 + 1)
2. **For compliance isolation:** Create separate PrismaClient instance
3. **Monitor pool usage:** Use `prisma.$metrics` or PostgreSQL queries
4. **If needed:** Use database-level connection limits or PgBouncer

**Alternative Approaches:**

**Option A: Database-Level Connection Limits (Recommended if pool contention detected)**
```sql
-- Create separate database user with connection limit
CREATE USER compliance_user WITH PASSWORD 'xxx' CONNECTION LIMIT 5;

-- Grant permissions
GRANT USAGE ON SCHEMA compliance TO compliance_user;
GRANT ALL ON ALL TABLES IN SCHEMA compliance TO compliance_user;

-- Use in connection string:
-- postgresql://compliance_user:xxx@host:port/db
```

**Option B: PgBouncer (Advanced, if available)**
```ini
# pgbouncer.ini
[databases]
compliance = host=localhost port=5432 dbname=forge pool_size=5

# Use in connection string:
# postgresql://user:pass@pgbouncer-host:6432/compliance
```

**Benefits:**
- ✅ Isolated connection pool (doesn't compete with main app)
- ✅ Can limit connections at database level (if needed)
- ✅ Independent monitoring and scaling
- ✅ Fallback options available (database limits, PgBouncer)

---

### Task 3: Resource Monitoring Setup

**Purpose:** Monitor compliance operations to detect performance impact on main app

**Implementation:**
```typescript
// apps/api/src/compliance/compliance-monitoring.service.ts
import { Injectable } from '@nestjs/common';
import { ComplianceDatabaseService } from './compliance-database.service';

@Injectable()
export class ComplianceMonitoringService {
  constructor(
    private complianceDb: ComplianceDatabaseService,
  ) {}

  async getConnectionPoolMetrics(): Promise<ConnectionPoolMetrics> {
    // Query PostgreSQL for connection pool stats
    const result = await this.complianceDb.$queryRaw`
      SELECT 
        count(*) as active_connections,
        max_conn as max_connections,
        (max_conn - count(*)) as available_connections
      FROM pg_stat_activity
      WHERE datname = current_database()
        AND usename = current_user
      GROUP BY max_conn;
    `;

    return {
      active: result[0]?.active_connections || 0,
      max: result[0]?.max_connections || 0,
      available: result[0]?.available_connections || 0,
      utilization: (result[0]?.active_connections / result[0]?.max_connections) * 100,
    };
  }

  async getQueryPerformanceMetrics(): Promise<QueryPerformanceMetrics> {
    // Query slow query log or pg_stat_statements
    const result = await this.complianceDb.$queryRaw`
      SELECT 
        query,
        calls,
        mean_exec_time,
        max_exec_time,
        total_exec_time
      FROM pg_stat_statements
      WHERE schemaname = 'compliance'
      ORDER BY mean_exec_time DESC
      LIMIT 10;
    `;

    return {
      slowQueries: result.map((q: any) => ({
        query: q.query.substring(0, 100), // Truncate for display
        calls: q.calls,
        avgTime: q.mean_exec_time,
        maxTime: q.max_exec_time,
      })),
    };
  }

  async checkHealth(): Promise<HealthStatus> {
    const poolMetrics = await this.getConnectionPoolMetrics();
    const queryMetrics = await this.getQueryPerformanceMetrics();

    const warnings: string[] = [];
    
    if (poolMetrics.utilization > 80) {
      warnings.push(`Connection pool utilization high: ${poolMetrics.utilization}%`);
    }

    if (queryMetrics.slowQueries.some(q => q.avgTime > 1000)) {
      warnings.push('Slow queries detected (>1s average)');
    }

    return {
      status: warnings.length === 0 ? 'healthy' : 'degraded',
      poolMetrics,
      queryMetrics,
      warnings,
    };
  }
}

// Health check endpoint
@Controller('compliance')
export class ComplianceController {
  constructor(
    private monitoringService: ComplianceMonitoringService,
  ) {}

  @Get('health')
  async getHealth(): Promise<HealthStatus> {
    return this.monitoringService.checkHealth();
  }
}
```

**Alerting:**
```yaml
# .github/workflows/compliance-monitoring.yml
- name: Check Compliance Health
  run: |
    response=$(curl -s http://localhost:3001/api/compliance/health)
    utilization=$(echo $response | jq '.poolMetrics.utilization')
    
    if (( $(echo "$utilization > 80" | bc -l) )); then
      echo "⚠️ Compliance connection pool utilization high: ${utilization}%"
      # Send alert
    fi
```

**Benefits:**
- ✅ Early detection of performance issues
- ✅ Proactive alerting before impact
- ✅ Data-driven optimization decisions
- ✅ Production health visibility

---

### Task 4: Query Performance Optimization

**Purpose:** Ensure compliance queries are optimized and don't impact main app

**Implementation Checklist:**
- [ ] All compliance queries use indexes (verify with EXPLAIN ANALYZE)
- [ ] Dashboard queries optimized (<100ms target)
- [ ] No full table scans
- [ ] Composite indexes for common query patterns
- [ ] Query result caching where appropriate

**Verification:**
```sql
-- Check index usage
EXPLAIN ANALYZE
SELECT * FROM compliance.compliance_checks
WHERE tenant_id = 'xxx' AND status = 'VIOLATION'
ORDER BY created_at DESC
LIMIT 50;

-- Should show: Index Scan using idx_checks_tenant_unresolved
-- Should NOT show: Seq Scan (full table scan)
```

---

**Last Updated:** 2025-11-24  
**Status:** Production Readiness Tasks Added  
**Next Action:** Implement during Week 13 (Days 5-7)

---

## Technical Architecture

### System Architecture

```
┌─────────────────┐
│  GitHub Actions │
│  (CI/CD)        │
└────────┬────────┘
         │
         │ OPA Evaluation
         ▼
┌─────────────────┐
│  OPA Policies   │
│  (10 policies)  │
└────────┬────────┘
         │
         │ Results
         ▼
┌─────────────────┐
│ Compliance API  │
│ (NestJS)        │
└────────┬────────┘
         │
         │ Store
         ▼
┌─────────────────┐
│  PostgreSQL     │
│  (compliance_*) │
└────────┬────────┘
         │
         │ Query
         ▼
┌─────────────────┐
│  Dashboard UI   │
│  (React)        │
└─────────────────┘
         │
         │ Alerts
         ▼
┌─────────────────┐
│  Alert System   │
│  (Slack/Email)  │
└─────────────────┘
```

### Data Flow

1. **PR Created/Updated** → GitHub Actions triggers OPA evaluation
2. **OPA Evaluation** → Policies evaluate changed files
3. **Results Stored** → Compliance API stores results in database
4. **Dashboard Updates** → Dashboard queries database for latest status
5. **Alerts Triggered** → Alert system checks thresholds and sends notifications

---

## Dependencies & Prerequisites

### Required Infrastructure

- ✅ PostgreSQL database (shared with main app)
- ✅ NestJS API framework
- ✅ React frontend framework
- ✅ GitHub Actions (existing CI/CD)
- ✅ OPA policies (Phase 2 complete)
- ⚠️ **Redis** (for async write queue) - **NEW REQUIREMENT**

### Redis Requirements

**Purpose:** Async write queue (BullMQ)

**Minimum Version:** Redis 6.0+

**Deployment Options:**
1. **Use existing Redis instance** (if available)
2. **Deploy new Redis instance** (if not available)
3. **Fallback:** Database-based queue (if Redis unavailable)

**Configuration:**
```yaml
# Environment variables
REDIS_HOST: localhost (or Redis server hostname)
REDIS_PORT: 6379 (default)
REDIS_PASSWORD: (if required)
REDIS_DB: 0 (default, can use separate DB for compliance)
```

**Fallback Strategy (if Redis unavailable):**
```typescript
// Fallback: Database-based queue (not recommended for production)
// Use only if Redis is unavailable
CREATE TABLE compliance.write_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL,
  job_data JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  error_message TEXT
);

CREATE INDEX idx_write_queue_status ON compliance.write_queue(status, created_at);
```

**Note:** Database-based queue has performance limitations. Redis is strongly recommended for production.

- ✅ PostgreSQL database (shared with main app)
- ✅ NestJS API framework (consistent with main API)
- ✅ React frontend framework (consistent with main frontend)
- ✅ GitHub Actions (existing CI/CD)
- ✅ OPA policies (Phase 2 complete)

### Required Services

- **Slack Workspace** - For alert notifications
- **Email Service** - For summary reports (can use existing email service)
- **Optional: PagerDuty** - For critical alerts (if needed)

### Required Access

- Database access (read/write for compliance schema)
- GitHub API access (for PR/commit information)
- Slack API access (for notifications)
- Email service access (for notifications)

---

## Risk Assessment

### Technical Risks

1. **Database Performance** (Updated with Production Analysis)
   - **Risk:** Compliance operations could impact main app performance
   - **Mitigation:** 
     - Async write queue (non-blocking CI/CD)
     - Separate connection pool for compliance
     - Query optimization (indexes, efficient queries)
     - Read replicas (optional for high-scale)
     - Resource monitoring (connection pool, query times)
   - **Impact:** Low (with safeguards) → Medium (without safeguards)
   - **Production Safeguards:** Required (async writes, separate pool, monitoring)

2. **Real-Time Updates**
   - **Risk:** Dashboard polling could impact performance
   - **Mitigation:** Use WebSocket for real-time updates, implement caching
   - **Impact:** Low

3. **Alert Fatigue**
   - **Risk:** Too many alerts could be ignored
   - **Mitigation:** Tune alert thresholds, implement alert grouping
   - **Impact:** Medium

### Operational Risks

1. **Dashboard Availability**
   - **Risk:** Dashboard downtime affects visibility
   - **Mitigation:** Deploy with high availability, implement health checks
   - **Impact:** Low

2. **Data Accuracy**
   - **Risk:** Stale or incorrect compliance data
   - **Mitigation:** Implement data validation, regular audits
   - **Impact:** Medium

---

## Success Metrics

### Dashboard Metrics

- **Uptime:** >99.5%
- **Response Time:** <500ms for dashboard loads
- **Data Freshness:** <5 minutes from OPA evaluation to dashboard display

### Compliance Metrics

- **Coverage:** 100% of PRs evaluated
- **Accuracy:** <1% false positive rate
- **Resolution Time:** Average time to resolve violations

### Alert Metrics

- **Alert Delivery:** >99% successful delivery
- **Response Time:** <5 minutes for Tier 1 alerts
- **False Positive Rate:** <5%

---

## Next Steps

1. **Review & Approve Plan** - Get stakeholder approval
2. **Set Up Infrastructure** - Create database schema, set up application structure
3. **Begin Week 11 Tasks** - Start with database and API setup
4. **Iterative Development** - Build and test incrementally

---

## Review Questions - Answers & Decisions

### ✅ Critical Decisions (Required for Implementation)

#### 1. Dashboard Location
**Decision:** **Integrate into existing frontend** (`frontend/src/routes/compliance/`)

**Rationale:**
- ✅ Faster delivery (no separate deployment pipeline)
- ✅ Shared authentication (leverage existing JWT/Supabase auth)
- ✅ Consistent UX with main application
- ✅ Single codebase to maintain
- ✅ Can extract to standalone later if needed

**Implementation:**
- Create `frontend/src/routes/compliance/` directory
- Add compliance routes to existing router
- Use existing auth guards and middleware
- Share UI components from `frontend/src/components/ui/`

#### 2. Database Strategy
**Decision:** **Shared database with separate schema** (`compliance` schema) **with production safeguards**

**Rationale:**
- ✅ Leverages existing PostgreSQL infrastructure
- ✅ Tenant isolation maintained (compliance data is tenant-scoped)
- ✅ Easier backup and maintenance
- ✅ No additional database server needed
- ⚠️ **Production consideration:** Compliance operations are low-frequency (CI/CD only, admin dashboard)

**Production Performance Analysis:**

**Access Patterns:**
- **Writes:** During CI/CD (PR creation/updates) - **Async, non-blocking** (happens in background)
- **Reads:** Dashboard queries - **Admin tool only** (not customer-facing, low frequency)
- **Frequency:** Much lower than main app (PRs are occasional, dashboard is admin tool)

**Risk Assessment:**
- **Connection Pool Contention:** **LOW RISK**
  - Compliance writes: ~1-5 connections during CI/CD (infrequent)
  - Dashboard reads: ~2-3 connections (admin tool, not high-traffic)
  - Main app: 10+ connections (high-traffic, customer-facing)
  - **Mitigation:** Separate connection pool for compliance (if needed)

- **Lock Contention:** **LOW RISK**
  - Compliance writes are INSERT-only (no UPDATEs to main app tables)
  - Compliance schema is separate (different tables = no lock conflicts)
  - **Mitigation:** Use async writes (queue compliance updates)

- **Query Performance Impact:** **LOW-MEDIUM RISK**
  - Dashboard queries are read-only (no impact on writes)
  - Compliance queries are simple (indexed lookups)
  - **Mitigation:** Proper indexing, query optimization, read replicas (optional)

- **I/O Contention:** **LOW RISK**
  - Compliance data volume is small (violations, trends, alerts)
  - Compliance writes are batched (during CI/CD, not real-time)
  - **Mitigation:** Separate tablespace (if needed for extreme scale)

**Production Safeguards (Recommended):**

1. **Separate Connection Pool** (Optional but recommended)
   ```typescript
   // Compliance service uses dedicated connection pool
   const compliancePrisma = new PrismaClient({
     datasources: {
       db: {
         url: process.env.DATABASE_URL + '?connection_limit=5&pool_timeout=30'
       }
     }
   });
   ```

2. **Async Write Queue** (Recommended for production)
   ```typescript
   // Queue compliance updates instead of blocking CI/CD
   await complianceQueue.add('store-violation', violationData);
   // CI/CD continues immediately, compliance writes happen async
   ```

3. **Read Replicas** (Optional for high-scale)
   - Dashboard queries use read replica
   - Main app uses primary database
   - Zero impact on production writes

4. **Query Optimization** (Required)
   - All compliance queries must use indexes
   - Dashboard queries must be optimized (<100ms target)
   - No full table scans

5. **Resource Monitoring** (Required)
   - Monitor connection pool usage
   - Monitor query performance (p50, p95, p99)
   - Alert if compliance queries impact main app

**When to Consider Separate Database:**
- If compliance data volume grows significantly (>10GB)
- If compliance queries consistently impact main app performance
- If connection pool contention becomes an issue
- If compliance needs different backup/retention policies

**Current Recommendation:**
- **Start with shared database** (faster delivery, lower cost)
- **Monitor production metrics** (connection pool, query times)
- **Add safeguards** (async writes, separate connection pool)
- **Migrate to separate database** only if metrics show impact

**Implementation:**
- Use `libs/common/prisma/schema.prisma` (add compliance models)
- Create `compliance` schema in PostgreSQL
- Apply RLS policies to compliance tables (tenant-scoped)
- **Add production safeguards:** Async write queue, separate connection pool, query optimization

#### 3. Authentication Strategy
**Decision:** **Use existing JWT authentication system**

**Rationale:**
- ✅ Existing infrastructure in `apps/api/src/auth/`
- ✅ Frontend auth already implemented (`frontend/src/lib/auth-service.ts`)
- ✅ Tenant context already extracted from JWT
- ✅ Role-based access control already in place

**Implementation:**
- Reuse `JwtAuthGuard` from `apps/api/src/auth/`
- Add compliance-specific roles: `compliance_viewer`, `compliance_admin`
- Use existing `TenantIsolationMiddleware` for tenant context

#### 4. Compliance Score Algorithm
**Decision:** **Weighted violation scoring system**

**Base Algorithm:**
```typescript
compliance_score = Math.max(0, 100 - weighted_violations);

weighted_violations = 
  (BLOCK_count * 10) + 
  (OVERRIDE_count * 3) + 
  (WARNING_count * 1);
```

**Edge Cases:**

1. **No Violations:**
   - Score: 100
   - Status: ✅ PASS

2. **Only Warnings:**
   - Score: 100 - (WARNING_count * 1)
   - Status: ✅ PASS (if score >= 70)

3. **Any BLOCK Violations:**
   - Score: Can be calculated, but PR is **BLOCKED** regardless
   - Status: ❌ BLOCKED (cannot merge)
   - **Exception:** Override approved by compliance_admin

4. **Mixed Violations:**
   - Score: 100 - weighted_violations
   - Status: Depends on score threshold (>= 70) AND no BLOCK violations

5. **Override Approved:**
   - Original score shown, but status changes to ✅ OVERRIDE_APPROVED
   - PR can merge with proper documentation

**Merge Rules:**
```typescript
function canMerge(pr: PR): boolean {
  // Rule 1: Any BLOCK violations => cannot merge
  if (pr.violations.some(v => v.severity === 'BLOCK')) {
    // Check for approved override
    return pr.overrideApproved && pr.overrideApprovedBy === 'compliance_admin';
  }
  
  // Rule 2: Score must be >= 70
  return pr.complianceScore >= 70;
}
```

**Minimum/Maximum:**
- minimum_score: 0
- maximum_score: 100

**Consistency with Reward Score:**
- Compliance score is separate from REWARD_SCORE
- REWARD_SCORE measures code quality (tests, docs, bug fixes)
- Compliance score measures rule adherence
- Both displayed in dashboard

#### 5. Alert Channels
**Decision:** **Slack (required), Email (required), PagerDuty (optional)**

**Configuration:**
- **Tier 1 (BLOCK):** Slack + Email + PagerDuty (if configured)
- **Tier 2 (OVERRIDE):** Slack + Email (daily summary)
- **Tier 3 (WARNING):** Email only (weekly summary)

#### 6. Access Control
**Decision:** **Role-based access control (RBAC)**

**Roles:**
- **All Developers:** View-only access (read compliance status, view violations)
- **Compliance Admin:** Full access (view, override, configure alerts)
- **Tenant Admin:** Override approval for their tenant

**Implementation:**
- Use existing RBAC system in `apps/api/src/auth/`
- Add `compliance_viewer` and `compliance_admin` roles
- Enforce at API controller level

#### 7. Data Retention Policy
**Decision:** **Tiered retention strategy**

```yaml
data_retention:
  active_violations: indefinite  # Until resolved
  resolved_violations: 90_days
  compliance_trends: 1_year
  alert_history: 30_days

archive_strategy:
  frequency: weekly
  destination: s3_bucket (or equivalent)
  format: parquet  # Efficient for analytics
```

---

## Enhanced Database Schema

### Complete Schema with Indexes and Additional Tables

```sql
-- Rule definitions table (reference data)
CREATE TABLE compliance.rule_definitions (
  id TEXT PRIMARY KEY, -- R01, R02, etc.
  name TEXT NOT NULL,
  description TEXT,
  tier TEXT NOT NULL, -- BLOCK, OVERRIDE, WARNING
  category TEXT,
  file_path TEXT, -- .cursor/rules/*.mdc
  opa_policy TEXT, -- security.rego, etc.
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Compliance checks table (enhanced)
CREATE TABLE compliance.compliance_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL, -- Tenant isolation
  pr_number INTEGER NOT NULL,
  commit_sha TEXT NOT NULL,
  rule_id TEXT NOT NULL REFERENCES compliance.rule_definitions(id),
  status TEXT NOT NULL, -- PASS, VIOLATION, OVERRIDE
  severity TEXT NOT NULL, -- BLOCK, OVERRIDE, WARNING
  file_path TEXT,
  line_number INTEGER,
  violation_message TEXT,
  context JSONB, -- Additional violation context (OPA output, file diff, etc.)
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  resolved_by TEXT,
  override_reason TEXT, -- If status is OVERRIDE
  override_approved_by TEXT
);

-- Compliance trends table (aggregated data)
CREATE TABLE compliance.compliance_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  date DATE NOT NULL,
  rule_id TEXT REFERENCES compliance.rule_definitions(id),
  violation_count INTEGER DEFAULT 0,
  compliance_rate DECIMAL(5,2), -- 0.00 to 100.00
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, date, rule_id)
);

-- Override requests table
CREATE TABLE compliance.override_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  violation_id UUID REFERENCES compliance.compliance_checks(id),
  requested_by TEXT NOT NULL,
  requested_at TIMESTAMP DEFAULT NOW(),
  reason TEXT NOT NULL,
  status TEXT NOT NULL, -- PENDING, APPROVED, REJECTED
  approved_by TEXT,
  approved_at TIMESTAMP,
  rejection_reason TEXT
);

-- Alert history table
CREATE TABLE compliance.alert_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  violation_id UUID REFERENCES compliance.compliance_checks(id),
  alert_type TEXT NOT NULL, -- slack, email, pagerduty
  sent_at TIMESTAMP DEFAULT NOW(),
  acknowledged_at TIMESTAMP,
  acknowledged_by TEXT,
  status TEXT NOT NULL, -- sent, delivered, failed, acknowledged
  delivery_error TEXT
);

-- Audit log table
CREATE TABLE compliance.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL, -- override_approved, config_changed, etc.
  resource_type TEXT, -- violation, rule, alert_config
  resource_id UUID,
  before_state JSONB,
  after_state JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_checks_tenant ON compliance.compliance_checks(tenant_id);
CREATE INDEX idx_checks_pr ON compliance.compliance_checks(pr_number);
CREATE INDEX idx_checks_rule ON compliance.compliance_checks(rule_id);
CREATE INDEX idx_checks_status ON compliance.compliance_checks(status);
CREATE INDEX idx_checks_created ON compliance.compliance_checks(created_at DESC);
CREATE INDEX idx_checks_unresolved ON compliance.compliance_checks(status) 
  WHERE resolved_at IS NULL;
CREATE INDEX idx_checks_tenant_unresolved ON compliance.compliance_checks(tenant_id, status) 
  WHERE resolved_at IS NULL;

CREATE INDEX idx_trends_tenant_date ON compliance.compliance_trends(tenant_id, date DESC);
CREATE INDEX idx_trends_rule ON compliance.compliance_trends(rule_id);

CREATE INDEX idx_override_tenant_status ON compliance.override_requests(tenant_id, status);
CREATE INDEX idx_override_violation ON compliance.override_requests(violation_id);

CREATE INDEX idx_alert_violation ON compliance.alert_history(violation_id);
CREATE INDEX idx_alert_status ON compliance.alert_history(status) 
  WHERE status IN ('sent', 'delivered');

CREATE INDEX idx_audit_tenant ON compliance.audit_log(tenant_id);
CREATE INDEX idx_audit_user ON compliance.audit_log(user_id);
CREATE INDEX idx_audit_created ON compliance.audit_log(created_at DESC);

-- Row Level Security (RLS) policies
ALTER TABLE compliance.compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance.compliance_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance.override_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance.alert_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance.audit_log ENABLE ROW LEVEL SECURITY;

-- RLS policy: Tenant isolation
CREATE POLICY tenant_isolation_compliance_checks ON compliance.compliance_checks
  USING (tenant_id::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_compliance_trends ON compliance.compliance_trends
  USING (tenant_id::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_override_requests ON compliance.override_requests
  USING (tenant_id::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_alert_history ON compliance.alert_history
  USING (tenant_id::text = current_setting('app.tenant_id', true));

CREATE POLICY tenant_isolation_audit_log ON compliance.audit_log
  USING (tenant_id::text = current_setting('app.tenant_id', true));
```

---

## Enhanced Alert System Design

### Alert Configuration

```yaml
# .github/workflows/compliance-monitoring.yml
alert_rules:
  tier1_block:
    channels: [slack, email, pagerduty]
    threshold: 1  # Alert on any Tier 1 violation
    deduplication_window: 1h  # Don't re-alert within 1 hour
    escalation_delay: 15m     # Escalate if not acknowledged
    escalation_channels: [pagerduty]
    quiet_hours: false  # Alert 24/7 for Tier 1
    
  tier2_override:
    channels: [slack, email]
    threshold: 5  # Alert if 5+ Tier 2 violations
    frequency: daily
    aggregation_window: 1h    # Aggregate violations in 1-hour batches
    max_per_day: 5            # Max 5 alert batches per day
    quiet_hours: true         # Respect business hours (9 AM - 6 PM)
    summary_time: "09:00"     # Send at 9 AM
    
  tier3_warning:
    channels: [email]
    frequency: weekly
    threshold: 10  # Alert if 10+ Tier 3 violations
    summary_time: "09:00"     # Send at 9 AM Monday
    quiet_hours: true
```

### Alert Features

1. **Deduplication**
   - Track sent alerts in `alert_history` table
   - Don't re-alert for same violation within deduplication window
   - Group similar violations (same rule, same PR)

2. **Acknowledgment**
   - Alerts include acknowledgment link
   - Track acknowledgment in `alert_history.acknowledged_at`
   - Escalate if not acknowledged within escalation_delay

3. **Escalation**
   - If Tier 1 alert not acknowledged in 15 minutes → PagerDuty
   - If Tier 2 alert not acknowledged in 4 hours → Email to manager
   - Escalation chain defined in configuration

4. **Quiet Hours**
   - Tier 1: Always alert (24/7)
   - Tier 2/3: Respect business hours (configurable)
   - Emergency override available

---

## Real-Time Updates Strategy

### Implementation: **Polling with WebSocket Fallback**

**Primary:** HTTP Polling (5-minute intervals)
- Simpler implementation
- Works with existing infrastructure
- Sufficient for compliance data (not real-time critical)

**Fallback:** WebSocket (optional enhancement)
- For future real-time PR status updates
- Not required for MVP

**Configuration:**
```typescript
// Dashboard polling configuration
const POLLING_INTERVALS = {
  compliance_status: 5 * 60 * 1000,  // 5 minutes
  violations: 2 * 60 * 1000,        // 2 minutes (more frequent)
  trends: 15 * 60 * 1000,            // 15 minutes (less frequent)
};

// Connection handling
- Auto-retry on connection failure
- Exponential backoff (1s, 2s, 4s, 8s, max 30s)
- Show connection status indicator
```

---

## Additional Components

### 1. Authentication & Authorization

**Implementation:**
- Reuse existing JWT authentication (`apps/api/src/auth/jwt.strategy.ts`)
- Add compliance-specific roles:
  - `compliance_viewer` - Read-only access
  - `compliance_admin` - Full access (override, configure)
- Enforce at controller level:
  ```typescript
  @UseGuards(JwtAuthGuard)
  @Roles('compliance_viewer', 'compliance_admin')
  @Get('/api/compliance/violations')
  ```

### 2. Audit Log

**Implementation:**
- Track all override approvals in `compliance.audit_log`
- Track configuration changes
- Track manual interventions
- Queryable for compliance reporting

### 3. Health Monitoring

**Metrics:**
- Dashboard uptime (health check endpoint)
- OPA evaluation success rate
- Alert delivery success rate
- API response time (p50, p95, p99)

**Implementation:**
- Health check endpoint: `GET /api/compliance/health`
- Metrics exposed via Prometheus (if available)
- Dashboard shows system health status

### 4. API Rate Limiting

**Implementation:**
- Rate limit: 100 requests/minute per user
- Dashboard polling: 1 request per 5 minutes (enforced client-side)
- Override requests: 10 requests/hour per user
- Use existing rate limiting middleware if available

---

## Revised Timeline

### Week 11: Dashboard Foundation (Revised)

**Days 1-3: Database & API Setup**
- [ ] Create enhanced compliance database schema
- [ ] Run Prisma migrations
- [ ] Seed rule_definitions table (R01-R25)
- [ ] Create compliance module in `apps/api/src/compliance/`
- [ ] Implement compliance service and controller
- [ ] Add authentication guards and RBAC
- [ ] Implement basic CRUD endpoints

**Days 4-5: Frontend Dashboard Setup**
- [ ] Create `frontend/src/routes/compliance/` directory
- [ ] Add compliance routes to existing router
- [ ] Set up API client for compliance endpoints
- [ ] Create rule compliance overview component
- [ ] Implement violation list component
- [ ] Add filtering and search functionality

**Days 6-7: Integration & Basic Features**
- [ ] Integrate OPA evaluation results into database
- [ ] Connect dashboard to API
- [ ] Implement polling for real-time updates
- [ ] Add compliance score calculation
- [ ] Basic styling and UX polish

### Week 12: Monitoring & Alerts (Revised)

**Days 1-3: Monitoring Infrastructure**
- [ ] Set up monitoring metrics collection
- [ ] Create compliance trends tracking (daily aggregation job)
- [ ] Implement violation aggregation
- [ ] Add compliance rate calculations
- [ ] Create health check endpoint
- [ ] **Production Safeguard:** Set up resource monitoring (connection pool, query times)

**Monitoring Thresholds & Alerts:**

### Connection Pool Alerts:
- **WARNING:** Utilization > 70% for 5+ minutes
- **CRITICAL:** Utilization > 90% for 1+ minute
- **Action:** Investigate slow queries, consider scaling

### Query Performance Alerts:
- **WARNING:** Average query time > 500ms
- **CRITICAL:** Average query time > 1000ms
- **Action:** Review EXPLAIN ANALYZE, optimize indexes

### Alert Delivery Alerts:
- **WARNING:** Delivery failure rate > 5%
- **CRITICAL:** Delivery failure rate > 20%
- **Action:** Check Slack/email service connectivity

### Dashboard Uptime Alerts:
- **WARNING:** Response time > 1000ms
- **CRITICAL:** 3+ consecutive health check failures
- **Action:** Check API/database connectivity

**Days 4-5: Alert System**
- [ ] Set up Slack integration (webhook or API)
- [ ] Set up email notifications (use existing email service)
- [ ] Implement alert rules (Tier 1/2/3)
- [ ] Add alert deduplication logic
- [ ] Create alert templates
- [ ] Implement acknowledgment tracking

**Days 6-7: Testing & Refinement**
- [ ] Test alert delivery (all channels)
- [ ] Verify monitoring accuracy
- [ ] Test deduplication and escalation
- [ ] Refine alert thresholds
- [ ] Document alert procedures

### Week 13: Operations & Documentation (Revised)

**Days 1-2: Operations Runbooks**
- [ ] Write compliance operations runbook
- [ ] Write dashboard operations runbook
- [ ] Write alert response runbook
- [ ] Create rule-specific runbooks (R01-R25) using template below

**Runbook Template:**

Create: `docs/operations/rules/R{XX}-{RULE_NAME}.md`

```markdown
# Rule {ID}: {Rule Name} - Operations Runbook

**Rule ID:** {R01-R25}  
**Tier:** {BLOCK/OVERRIDE/WARNING}  
**Category:** {Security/Code Quality/Testing/etc.}  
**OPA Policy:** {policy-file.rego}

## Rule Description
{Brief description from rule definition}

## Common Violations

### Violation 1: {Description}
**Symptom:** {What developers see in CI/CD}
**Cause:** {Why this happens}
**Resolution:**
1. Step 1
2. Step 2
3. Step 3
**Prevention:** {How to avoid in the future}

### Violation 2: {Description}
...

## Override Procedures

### When to Override:
- Circumstance 1
- Circumstance 2

### How to Request Override:
1. Create override request in dashboard
2. Provide justification
3. Wait for compliance_admin approval

### Approval Criteria:
- Criterion 1
- Criterion 2

## Alert Response

### Tier 1 (BLOCK) Alerts:
- **Response Time:** Immediate (within 5 minutes)
- **Actions:**
  1. Acknowledge alert
  2. Review violation details
  3. Contact PR author
  4. Determine if override needed

### Escalation:
- If unresolved in 30 minutes → escalate to {person/team}
- If unresolved in 4 hours → escalate to {manager}

## Examples

### Example 1: {Scenario}
```yaml
File: path/to/file.ts
Violation: {message}
Resolution: {steps taken}
```

## Related Documentation
- Rule Definition: `.cursor/rules/{rule-file}.mdc`
- OPA Policy: `policies/{policy-file}.rego`
- Main Runbook: `docs/operations/compliance-runbook.md`
```

**Days 3-4: Dashboard Enhancements**
- [ ] Add trends and analytics views
- [ ] Implement PR compliance status
- [ ] Add export functionality (CSV, JSON)
- [ ] Performance optimization (caching, query optimization)

**Days 5-7: Final Testing & Deployment**

**Pre-Deployment Checklist:**
- [ ] Database migrations tested in staging
- [ ] RLS policies verified
- [ ] Indexes created and verified
- [ ] Environment variables configured
- [ ] Redis connection tested (for async queue)
- [ ] Slack webhook tested
- [ ] Email service tested
- [ ] Load testing passed

**Load Testing Plan:**

1. **Dashboard Load Test**
   - **Tool:** k6 or Artillery
   - **Scenario:** 100 concurrent users browsing dashboard
   - **Duration:** 10 minutes
   - **Success Criteria:**
     - p95 response time < 500ms
     - Error rate < 1%
     - Database connections stay within pool limits

2. **CI/CD Compliance Check Load Test**
   - **Scenario:** 20 PRs updated simultaneously
   - **OPA evaluations:** 20 concurrent evaluations
   - **Success Criteria:**
     - All evaluations complete in < 30 seconds
     - No write queue backlog
     - Database connection pool < 80% utilization

3. **Alert Delivery Load Test**
   - **Scenario:** 50 violations detected simultaneously
   - **Success Criteria:**
     - All alerts delivered within 1 minute
     - No alert delivery failures
     - Proper deduplication (no duplicate alerts)

**Load Testing Script Example:**
```javascript
// k6 load test script
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },  // Ramp up to 50 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% under 500ms
    http_req_failed: ['rate<0.01'],   // <1% failure rate
  },
};

export default function () {
  // Test dashboard load
  const res = http.get('https://app.example.com/api/compliance/violations');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

**Deployment (Day 6):**
- [ ] Run database migrations (compliance schema)
- [ ] Deploy API changes
- [ ] Deploy frontend changes
- [ ] Verify health checks pass
- [ ] Smoke test: Create test PR, verify compliance check
- [ ] Smoke test: Trigger test alert, verify delivery

**Post-Deployment (Day 7):**
- [ ] Monitor for 24 hours
- [ ] Check error logs
- [ ] Verify metrics collection
- [ ] Review alert delivery success rate
- [ ] Team training completed (1-hour session)
- [ ] Documentation published

**Rollback Plan:**

1. **Immediate Rollback (< 5 minutes):**
   - Revert API deployment
   - Revert frontend deployment
   - Compliance database remains (read-only)

2. **Database Rollback (if needed):**
   - Do NOT drop compliance schema (data loss)
   - Instead: Disable compliance checks in CI/CD
   - Investigate and fix issues in development
   - Redeploy when fixed

3. **Partial Rollback (specific features):**
   - Disable alerts: Set `ALERTS_ENABLED=false`
   - Disable dashboard: Remove routes from frontend
   - Keep compliance checks running: Data collection continues

**Buffer:** 1 week added for unexpected issues

**Revised Timeline:** **4 weeks** (Weeks 11-14) instead of 3 weeks

---

## Risk Mitigation Updates

### Updated Risk Assessment

1. **Database Performance** (Medium → Low)
   - **Mitigation:** Added indexes, partitioning strategy, data retention policy
   - **Monitoring:** Query performance metrics, slow query alerts

2. **Real-Time Updates** (Low)
   - **Mitigation:** Polling strategy (5-minute intervals), caching, connection retry logic
   - **Monitoring:** Polling success rate, connection failures

3. **Alert Fatigue** (Medium)
   - **Mitigation:** Deduplication, aggregation, quiet hours, configurable thresholds
   - **Monitoring:** Alert acknowledgment rate, escalation frequency

4. **Timeline Risk** (High → Medium)
   - **Mitigation:** Extended to 4 weeks, added buffer week, phased delivery
   - **Monitoring:** Weekly progress reviews, daily standups

---

---

## Phase 3 Success Metrics (Post-Deployment)

### Week 1 Post-Deployment:
- [ ] Dashboard uptime: __%
- [ ] Average response time: __ms
- [ ] Alert delivery success rate: __%
- [ ] Compliance checks passing rate: __%

### Week 2 Post-Deployment:
- [ ] User feedback collected: __ responses
- [ ] Issues reported: __ (P0/P1/P2)
- [ ] False positive rate: __%
- [ ] Time to resolution: __ hours average

### Month 1 Post-Deployment:
- [ ] Compliance score trend: __ (improving/stable/declining)
- [ ] Most common violations: Rule __
- [ ] Override request volume: __ per week
- [ ] Team satisfaction score: __/10

---

**Last Updated:** 2025-11-24  
**Status:** Planning - Enhanced with Review Answers & Production Safeguards  
**Next Action:** Address remaining gaps (2-3 hours), confirm Redis availability, get stakeholder approval on 4-week timeline

