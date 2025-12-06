---
# Cursor Rule Metadata
version: 2.0
project: VeroField
scope:
  - ai
  - microservices
  - telemetry
priority: high
last_updated: 2025-12-05
always_apply: true
---

# PRIORITY: HIGH - VeroAI Development Rules

## PRIORITY: CRITICAL - VeroAI Architecture

### Service Structure
- **AI CodeGen** → `apps/crm-ai/src/` - Natural language to code generation
- **AI SOC** → `apps/ai-soc/src/` - Security operations and incident response
- **Feature Ingestion** → `apps/feature-ingestion/src/` - Kafka to Feast pipeline
- **KPI Gate** → `apps/kpi-gate/src/` - Canary deployment evaluation

### Shared Infrastructure
- **Kafka** → `libs/common/src/kafka/` - Event streaming
- **Telemetry** → `libs/common/src/interceptors/telemetry.interceptor.ts`
- **Feature Store** → `services/feast/` - ML feature engineering
- **Stream Processing** → `services/flink-jobs/` - Session reconstruction

---

## PRIORITY: CRITICAL - Telemetry & Event Tracking

### Telemetry Interceptor
```typescript
// ✅ CORRECT - Telemetry is automatic via interceptor
// No manual tracking needed in controllers

// ❌ WRONG - Don't manually track events
this.telemetry.track({ type: 'api_call', ... });
```

### Kafka Event Patterns
```typescript
// ✅ CORRECT - Use shared Kafka service
import { KafkaProducerService } from '@verofield/common/kafka';
import { KafkaEvent } from '@verofield/common/types';

const event: KafkaEvent = {
  type: 'user_action',
  tenantId: user.tenantId,
  timestamp: new Date().toISOString(),
  data: { action: 'job_completed' }
};
await kafka.sendEvent('raw_events', event);
```

### Frontend Telemetry
```typescript
// ✅ CORRECT - Use telemetry service
import { telemetry } from '@/lib/telemetry';

telemetry.track({
  type: 'click',
  element: 'button',
  path: window.location.pathname
});
```

---

## PRIORITY: HIGH - AI Code Generation Patterns

### CodeGen Service Structure
```typescript
// ✅ CORRECT - AI CodeGen service pattern
// File: apps/crm-ai/src/services/codegen.service.ts

@Injectable()
export class CodeGenService {
  async generateFeature(request: CodeGenRequest) {
    // Always include RLS enforcement in prompts
    const prompt = this.buildPrompt({
      ...request,
      rlsRequired: true, // ⭐ CRITICAL
      tenantIsolation: true
    });
    
    // Security scan before returning
    const code = await this.anthropic.messages.create(...);
    const securityIssues = await this.scanner.scanCode(code);
    
    if (securityIssues.length > 0) {
      throw new Error('Security scan failed');
    }
    
    return code;
  }
}
```

### Generated Code Requirements
- **ALWAYS include `tenantId` in database queries** ⭐ CRITICAL
- **ALWAYS enforce RLS at application layer**
- **ALWAYS include error handling**
- **ALWAYS include TypeScript types**
- **ALWAYS include JSDoc comments**

### Security Scanning
```typescript
// ✅ CORRECT - Scan all generated code
const issues = await codeSecurityScanner.scanCode(generatedCode);
if (issues.some(i => i.severity === 'critical')) {
  throw new Error('Generated code failed security scan');
}
```

---

## PRIORITY: HIGH - Feature Store Patterns

### Feature Retrieval
```typescript
// ✅ CORRECT - Use feature service
import { FeaturesService } from '@verofield/api/features';

const features = await featuresService.getUserFeatures(userId);
// Returns: { clicks_last_7d, jobs_completed_last_7d, ... }
```

### Feature Materialization
- Features are automatically materialized from Kafka events
- Flink processes `raw_events` → `user_sessions`
- Feast ingests sessions → feature store
- Features available in <10ms via Redis

---

## PRIORITY: HIGH - Canary Deployment Patterns

### KPI Gate Evaluation
```typescript
// ✅ CORRECT - KPI gate service
import { KpiGateService } from '@verofield/kpi-gate';

const result = await kpiGate.evaluateCanary(tenantId, canaryService);
if (result.passed) {
  // Promote canary
} else {
  // Rollback canary
}
```

### Metrics Collection
```typescript
// ✅ CORRECT - Use Prometheus metrics
import { MetricsService } from '@verofield/common/metrics';

this.metrics.recordRequest(method, path, status, duration, tenantId);
```

---

## PRIORITY: HIGH - Governance Patterns

### Change Request Creation
```typescript
// ✅ CORRECT - Create change request
import { GovernanceService } from '@verofield/api/governance';

const request = await governance.createChangeRequest({
  tenantId,
  type: 'ui', // or 'api', 'security', 'billing'
  title: 'One-tap job completion',
  generatedCode: code,
  impactScore: 0.03
});

// Auto-approval if eligible
if (request.status === 'approved') {
  // Deploy automatically
}
```

### OPA Policy Evaluation
```typescript
// ✅ CORRECT - OPA auto-approval
import { OpaService } from '@verofield/api/governance';

const result = await opa.evaluateAutoApprove(request);
if (result.allowed) {
  // Auto-approve
} else {
  // Require manual approval
}
```

---

## PRIORITY: HIGH - AI SOC Patterns

### Security Incident Handling
```typescript
// ✅ CORRECT - AI SOC service
import { SecurityAgentService } from '@verofield/ai-soc';

const result = await securityAgent.handleIncident({
  type: 'sql_injection_attempt',
  severity: 'high',
  source: 'api',
  details: { ip, query }
});

if (result.resolved) {
  // Incident auto-resolved
} else {
  // Escalate to human
}
```

### WAF Integration
```typescript
// ✅ CORRECT - Cloudflare WAF
import { WafService } from '@verofield/ai-soc';

await waf.blockIp(ip, 'SQL injection attempt detected');
```

---

## PRIORITY: MEDIUM - Development Guidelines

### AI Service Development
- Each AI service is independent microservice
- Services communicate via HTTP/gRPC
- Use shared libraries for common functionality
- Follow microservices best practices

### Testing AI Services
- Unit tests for AI logic
- Integration tests for service communication
- Security tests for generated code
- E2E tests for complete workflows

### Cost Management
- Implement budget controller for AI API calls
- Cache AI responses when possible
- Monitor token usage
- Set daily limits per tenant

---

## Prohibited Actions

### ❌ DO NOT:
1. Generate code without RLS enforcement
2. Skip security scanning on generated code
3. Hardcode tenant IDs in generated code
4. Create direct imports between AI services
5. Bypass governance approval workflow
6. Deploy without canary evaluation
7. Ignore telemetry requirements
8. Create duplicate Kafka producers
9. Skip feature store materialization
10. Deploy AI services without monitoring

### ✅ DO:
1. Always include tenant isolation in generated code
2. Scan all generated code for security issues
3. Use shared Kafka service from `libs/common/`
4. Follow governance approval workflow
5. Deploy via canary pipeline
6. Track all events via telemetry
7. Use feature store for ML features
8. Monitor AI service costs
9. Cache AI responses when appropriate
10. Test AI services thoroughly

---

**Last Updated:** 2025-12-05  
**Status:** Active - VeroAI Development Patterns

