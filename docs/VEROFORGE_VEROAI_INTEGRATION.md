---
title: VeroForge-VeroAI Integration Specification
category: Planning
status: active
last_reviewed: 2025-12-05
owner: platform_engineering
related:
  - docs/planning/VEROFORGE_DEVELOPMENT_PLAN.md
  - docs/planning/VEROAI_DEVELOPMENT_PLAN.md
---

# VeroForge-VeroAI Integration Specification

**Status:** Strategic Initiative - Post-VeroAI  
**Last Updated:** 2025-12-05

---

## Executive Summary

This document specifies how VeroForge integrates with VeroAI services to leverage AI capabilities for app generation, pattern detection, security, and self-improvement. VeroForge extends VeroAI's capabilities from internal development to customer-facing application generation.

---

## Integration Overview

### VeroAI Services

1. **AI CodeGen Service** (`apps/crm-ai/`)
   - Natural language to code generation
   - LLM integration (Claude/GPT-4)
   - Code deployment pipeline

2. **Feature Ingestion Service** (`apps/feature-ingestion/`)
   - Kafka event processing
   - Feature store materialization
   - Stream processing

3. **AI SOC Service** (`apps/ai-soc/`)
   - Security scanning
   - Threat detection
   - Auto-remediation

4. **KPI Gate Service** (`apps/kpi-gate/`)
   - Canary deployment evaluation
   - KPI monitoring
   - Auto-promotion/rollback

5. **Telemetry Infrastructure** (`libs/common/src/kafka/`)
   - Kafka producer/consumer
   - Event streaming
   - Telemetry interceptor

---

## Integration Points

### 1. VeroAI CodeGen → VeroForge Generator

**Purpose:** Use VeroAI's LLM capabilities for gap filling in template-based generation.

**Integration Method:** HTTP API calls from VeroForge Generator to VeroAI CodeGen service.

**API Endpoint:**
```
POST http://crm-ai:3001/api/v1/codegen/generate
```

**Request:**
```typescript
interface CodeGenRequest {
  prompt: string;
  context: {
    domainModel: DomainModel;
    templateCode: string;
    gapDescription: string;
  };
  template?: 'nestjs-service' | 'react-component' | 'prisma-schema';
  constraints?: {
    includeRLS: boolean;
    includeValidation: boolean;
    includeTests: boolean;
  };
}
```

**Response:**
```typescript
interface CodeGenResponse {
  code: string;
  explanation: string;
  confidence: number;
  suggestions?: string[];
}
```

**Usage in VeroForge:**
```typescript
// apps/forge-generator/src/pipeline/domain-synthesizer.service.ts
async fillGaps(domainModel: DomainModel, templateCode: string): Promise<string> {
  const gaps = this.identifyGaps(domainModel, templateCode);
  
  for (const gap of gaps) {
    const aiCode = await this.veroAICodeGen.generate({
      prompt: `Generate ${gap.type} for ${gap.entity.name} with RLS enforcement`,
      context: { domainModel, templateCode },
      template: gap.template,
      constraints: {
        includeRLS: true,
        includeValidation: true,
        includeTests: true
      }
    });
    
    templateCode = this.mergeCode(templateCode, aiCode.code);
  }
  
  return templateCode;
}
```

**Error Handling:**
- Retry on failure (3 attempts)
- Fallback to template-only generation
- Log failures for analysis

---

### 2. VeroAI Telemetry → VeroForge Intelligence

**Purpose:** Extend VeroAI's telemetry pipeline for cross-customer pattern detection.

**Integration Method:** Kafka topic subscription and event publishing.

**Kafka Topics:**

**VeroForge → VeroAI:**
- `veroforge_metrics` - Generator performance metrics
- `veroforge_template_usage` - Template usage patterns
- `veroforge_customer_satisfaction` - Customer feedback

**VeroAI → VeroForge:**
- `veroforge_patterns` - Detected patterns for improvement
- `veroforge_improvements` - Approved improvements ready to apply

**Event Schema:**
```typescript
interface VeroForgeMetricEvent {
  type: 'generation' | 'template_usage' | 'deployment' | 'performance';
  timestamp: string;
  customerId?: string; // Optional, anonymized
  data: {
    templateId?: string;
    generationTime?: number;
    success: boolean;
    error?: string;
    metrics?: Record<string, number>;
  };
}
```

**Usage in VeroForge:**
```typescript
// apps/forge-generator/src/self-improvement/veroforge-telemetry.service.ts
async trackGeneration(metrics: GenerationMetrics): Promise<void> {
  const event: VeroForgeMetricEvent = {
    type: 'generation',
    timestamp: new Date().toISOString(),
    data: {
      templateId: metrics.templateId,
      generationTime: metrics.duration,
      success: metrics.success,
      metrics: {
        entitiesGenerated: metrics.entitiesCount,
        apiEndpointsGenerated: metrics.apiEndpointsCount,
        uiComponentsGenerated: metrics.uiComponentsCount
      }
    }
  };
  
  await this.kafkaProducer.send('veroforge_metrics', event);
}
```

**Pattern Detection Integration:**
```typescript
// apps/forge-intelligence/src/pattern-detection/pattern-detector.service.ts
async detectPatterns(): Promise<Pattern[]> {
  // Subscribe to VeroAI pattern detection results
  const patterns = await this.veroAIPatternDetection.analyze({
    source: 'veroforge_metrics',
    timeRange: '7d',
    minOccurrences: 10
  });
  
  return patterns.map(p => this.mapToVeroForgePattern(p));
}
```

---

### 3. VeroAI SOC → VeroForge Security Pipeline

**Purpose:** Use VeroAI SOC for security scanning of generated code.

**Integration Method:** HTTP API calls to VeroAI SOC service.

**API Endpoint:**
```
POST http://ai-soc:3002/api/v1/security/scan
```

**Request:**
```typescript
interface SecurityScanRequest {
  code: string;
  language: 'typescript' | 'javascript' | 'prisma';
  context: {
    entity: string;
    templateId: string;
    generatedBy: 'template' | 'ai' | 'hybrid';
  };
  checks: {
    rls: boolean;
    sqlInjection: boolean;
    xss: boolean;
    dependency: boolean;
  };
}
```

**Response:**
```typescript
interface SecurityScanResponse {
  passed: boolean;
  issues: SecurityIssue[];
  fixes?: SecurityFix[];
  confidence: number;
}

interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  location: string;
  description: string;
  suggestion: string;
}

interface SecurityFix {
  code: string;
  explanation: string;
  autoApply: boolean;
}
```

**Usage in VeroForge:**
```typescript
// apps/forge-generator/src/security/scanner.service.ts
async scanGeneratedCode(code: string, context: GenerationContext): Promise<SecurityScanResult> {
  const scanResult = await this.veroAISOC.scan({
    code,
    language: 'typescript',
    context: {
      entity: context.entity.name,
      templateId: context.templateId,
      generatedBy: context.generatedBy
    },
    checks: {
      rls: true,
      sqlInjection: true,
      xss: true,
      dependency: true
    }
  });
  
  if (!scanResult.passed) {
    // Auto-apply fixes if available
    if (scanResult.fixes) {
      for (const fix of scanResult.fixes) {
        if (fix.autoApply) {
          code = this.applyFix(code, fix);
        }
      }
    }
    
    // Flag for review if critical issues remain
    if (scanResult.issues.some(i => i.severity === 'critical')) {
      throw new SecurityScanFailureError(scanResult.issues);
    }
  }
  
  return { code, issues: scanResult.issues };
}
```

---

### 4. VeroAI KPI Gate → VeroForge Deployment

**Purpose:** Use VeroAI's KPI gate for canary deployment evaluation of generated apps.

**Integration Method:** HTTP API calls to VeroAI KPI Gate service.

**API Endpoint:**
```
POST http://kpi-gate:3003/api/v1/kpi/evaluate
```

**Request:**
```typescript
interface KPIEvaluationRequest {
  deploymentId: string;
  namespace: string;
  baselineMetrics: Metrics;
  canaryMetrics: Metrics;
  kpis: KPI[];
  timeWindow: number; // minutes
}

interface KPI {
  name: string;
  threshold: number;
  operator: 'gt' | 'lt' | 'eq';
  weight: number;
}
```

**Response:**
```typescript
interface KPIEvaluationResponse {
  passed: boolean;
  score: number;
  kpiResults: KPIResult[];
  recommendation: 'promote' | 'rollback' | 'continue';
  confidence: number;
}

interface KPIResult {
  kpi: string;
  value: number;
  threshold: number;
  passed: boolean;
  trend: 'improving' | 'degrading' | 'stable';
}
```

**Usage in VeroForge:**
```typescript
// apps/forge-provisioning/src/deployment/canary-deployment.service.ts
async evaluateCanary(deployment: Deployment): Promise<DeploymentDecision> {
  const baselineMetrics = await this.collectBaselineMetrics(deployment.namespace);
  const canaryMetrics = await this.collectCanaryMetrics(deployment.canaryNamespace);
  
  const evaluation = await this.veroAIKPIGate.evaluate({
    deploymentId: deployment.id,
    namespace: deployment.namespace,
    baselineMetrics,
    canaryMetrics,
    kpis: [
      { name: 'error_rate', threshold: 0.01, operator: 'lt', weight: 0.3 },
      { name: 'p99_latency', threshold: 200, operator: 'lt', weight: 0.3 },
      { name: 'throughput', threshold: 1000, operator: 'gt', weight: 0.2 },
      { name: 'cpu_usage', threshold: 80, operator: 'lt', weight: 0.2 }
    ],
    timeWindow: 15
  });
  
  if (evaluation.recommendation === 'promote') {
    await this.promoteToProduction(deployment);
  } else if (evaluation.recommendation === 'rollback') {
    await this.rollbackCanary(deployment);
  }
  
  return evaluation;
}
```

---

### 5. VeroAI Governance → VeroForge Review Console

**Purpose:** Use VeroAI's governance system for managing VeroForge improvements.

**Integration Method:** HTTP API calls and webhook subscriptions.

**API Endpoints:**
```
POST http://kpi-gate:3003/api/v1/governance/approval/request
GET  http://kpi-gate:3003/api/v1/governance/approval/{id}
POST http://kpi-gate:3003/api/v1/governance/approval/{id}/approve
POST http://kpi-gate:3003/api/v1/governance/approval/{id}/reject
```

**Request:**
```typescript
interface ApprovalRequest {
  type: 'template_improvement' | 'generator_optimization' | 'new_template';
  change: {
    description: string;
    code: string;
    risk: 'low' | 'medium' | 'high';
    impact: string[];
  };
  autoApprove?: boolean;
}
```

**Response:**
```typescript
interface ApprovalResponse {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'auto_approved';
  decision?: {
    approved: boolean;
    reason: string;
    reviewer?: string;
    timestamp: string;
  };
}
```

**Usage in VeroForge:**
```typescript
// apps/forge-generator/src/self-improvement/improvement-receiver.service.ts
async submitImprovement(improvement: Improvement): Promise<ApprovalResponse> {
  const approval = await this.veroAIGovernance.requestApproval({
    type: improvement.type,
    change: {
      description: improvement.description,
      code: improvement.code,
      risk: this.assessRisk(improvement),
      impact: improvement.affectedTemplates
    },
    autoApprove: improvement.risk === 'low'
  });
  
  if (approval.status === 'auto_approved' || approval.status === 'approved') {
    await this.applyImprovement(improvement);
  }
  
  return approval;
}
```

**Webhook Subscription:**
```typescript
// apps/forge-generator/src/self-improvement/improvement-receiver.service.ts
@WebhookHandler('governance.approval.updated')
async handleApprovalUpdate(event: ApprovalUpdateEvent): Promise<void> {
  if (event.status === 'approved') {
    const improvement = await this.getImprovement(event.approvalId);
    await this.applyImprovement(improvement);
  }
}
```

---

## Meta-Improvement Loop

### Self-Improvement Flow

```
VeroForge Generator
    │
    ├─→ Generates Customer Apps
    │       │
    │       └─→ VeroAI Telemetry (publishes to veroforge_metrics)
    │               │
    │               └─→ VeroAI Pattern Detection (analyzes patterns)
    │                       │
    │                       └─→ VeroAI CodeGen (generates improvements)
    │                               │
    │                               └─→ VeroAI Governance (evaluates risk)
    │                                       │
    │                                       ├─→ Low Risk: Auto-approve
    │                                       └─→ High Risk: Human review
    │                                               │
    │                                               └─→ VeroForge Improvement Receiver
    │                                                       │
    │                                                       └─→ Apply Improvement
    │
    └─→ Generator Codebase
            │
            └─→ VeroAI CodeGen (optimizes generator)
                    │
                    └─→ VeroAI KPI Gate (evaluates performance)
                            │
                            └─→ Canary Deployment
```

### Implementation

**VeroForge Telemetry Service:**
```typescript
// apps/forge-generator/src/self-improvement/veroforge-telemetry.service.ts
@Injectable()
export class VeroForgeTelemetryService {
  constructor(
    private kafkaProducer: KafkaProducerService,
    @Inject('VEROAI_TELEMETRY') private veroAITelemetry: VeroAITelemetryClient
  ) {}
  
  async trackGeneration(metrics: GenerationMetrics): Promise<void> {
    // Publish to Kafka for VeroAI consumption
    await this.kafkaProducer.send('veroforge_metrics', {
      type: 'generation',
      timestamp: new Date().toISOString(),
      data: metrics
    });
    
    // Also send directly to VeroAI for real-time analysis
    await this.veroAITelemetry.track({
      service: 'veroforge-generator',
      event: 'generation_complete',
      metrics
    });
  }
}
```

**VeroForge Improvement Receiver:**
```typescript
// apps/forge-generator/src/self-improvement/improvement-receiver.service.ts
@Injectable()
export class ImprovementReceiverService {
  constructor(
    private veroAIGovernance: VeroAIGovernanceClient,
    private templateUpdater: TemplateUpdaterService,
    private generatorUpdater: GeneratorUpdaterService
  ) {}
  
  @KafkaListener('veroforge_improvements')
  async receiveImprovement(improvement: Improvement): Promise<void> {
    // Improvement already approved by VeroAI Governance
    if (improvement.type === 'template') {
      await this.templateUpdater.update(improvement.templateId, improvement.code);
    } else if (improvement.type === 'generator') {
      await this.generatorUpdater.update(improvement.component, improvement.code);
    }
  }
}
```

---

## Service Communication Patterns

### HTTP Communication

**Service Discovery:**
- Kubernetes service names: `crm-ai`, `ai-soc`, `kpi-gate`, `feature-ingestion`
- Internal DNS resolution
- Service mesh (Istio) for mTLS

**Request/Response:**
```typescript
// Use axios or NestJS HttpService
const response = await this.httpService.post(
  'http://crm-ai:3001/api/v1/codegen/generate',
  request,
  {
    headers: { 'X-Service-Name': 'veroforge-generator' },
    timeout: 30000
  }
);
```

### Kafka Communication

**Producer:**
```typescript
import { KafkaProducerService } from '@verofield/common/kafka';

await this.kafkaProducer.send('veroforge_metrics', event);
```

**Consumer:**
```typescript
@KafkaListener('veroforge_patterns')
async handlePattern(pattern: Pattern): Promise<void> {
  // Process pattern
}
```

---

## Error Handling

### Retry Strategy

```typescript
async callVeroAIService<T>(
  service: string,
  endpoint: string,
  request: any,
  retries = 3
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await this.httpService.post(`${service}${endpoint}`, request).toPromise();
    } catch (error) {
      if (i === retries - 1) throw error;
      await this.delay(1000 * (i + 1)); // Exponential backoff
    }
  }
}
```

### Fallback Strategies

- **CodeGen Failure:** Fallback to template-only generation
- **Security Scan Failure:** Flag for manual review
- **KPI Gate Failure:** Default to manual approval
- **Telemetry Failure:** Log locally, retry later

---

## Performance Considerations

### Caching

- Cache VeroAI CodeGen responses for similar requests
- Cache security scan results for identical code
- Cache KPI evaluation results

### Async Processing

- Non-blocking telemetry publishing
- Background pattern detection
- Async improvement application

### Rate Limiting

- Respect VeroAI service rate limits
- Implement backpressure for Kafka
- Queue improvements for batch processing

---

## Monitoring & Observability

### Metrics

- VeroAI service call latency
- VeroAI service error rates
- Integration success/failure rates
- Self-improvement loop effectiveness

### Logging

- All VeroAI service calls logged
- Integration errors logged with context
- Improvement application tracked

### Alerts

- VeroAI service unavailable
- High error rates in integration
- Self-improvement loop failures

---

## Testing Strategy

### Unit Tests

- Mock VeroAI service responses
- Test error handling
- Test retry logic

### Integration Tests

- Test actual VeroAI service calls (staging)
- Test Kafka event flow
- Test improvement application

### E2E Tests

- Test full self-improvement loop
- Test canary deployment with KPI gates
- Test security scanning integration

---

## Related Documentation

- [VeroForge Development Plan](VEROFORGE_DEVELOPMENT_PLAN.md)
- [VeroAI Development Plan](VEROAI_DEVELOPMENT_PLAN.md)
- [VeroForge Architecture](../architecture/veroforge-architecture.md)

---

**Last Updated:** 2025-12-05  
**Status:** Planning - Awaiting VeroAI Completion  
**Owner:** Platform Engineering Team

