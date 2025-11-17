---
title: VeroForge Monorepo Structure
category: Planning
status: active
last_reviewed: 2025-11-16
owner: platform_engineering
related:
  - docs/planning/VEROFORGE_DEVELOPMENT_PLAN.md
  - .cursor/rules/monorepo.md
---

# VeroForge Monorepo Structure

**Status:** Strategic Initiative - Post-VeroAI  
**Last Updated:** 2025-11-16

---

## Overview

This document defines the monorepo structure extensions required for VeroForge. It builds on the existing VeroAI monorepo structure and adds VeroForge-specific directories and services.

---

## Complete Monorepo Structure

### Directory Tree

```
VeroField/
├── apps/                              # Microservices
│   ├── api/                           # Main API (existing - VeroAI)
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── crm-ai/                        # VeroAI CodeGen (existing)
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── ai-soc/                        # VeroAI SOC (existing)
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── feature-ingestion/             # VeroAI Feature Ingestion (existing)
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── kpi-gate/                      # VeroAI KPI Gate (existing)
│   │   ├── src/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── forge-generator/               # ⭐ NEW: VeroForge Generator
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── pipeline/
│   │   │   │   ├── orchestrator.service.ts
│   │   │   │   ├── requirement-analyzer.service.ts
│   │   │   │   └── domain-synthesizer.service.ts
│   │   │   ├── generators/
│   │   │   │   ├── schema/
│   │   │   │   │   └── prisma-generator.service.ts
│   │   │   │   ├── api/
│   │   │   │   │   └── nestjs-generator.service.ts
│   │   │   │   ├── ui/
│   │   │   │   │   └── react-generator.service.ts
│   │   │   │   ├── mobile/
│   │   │   │   │   └── react-native-generator.service.ts
│   │   │   │   └── devops/
│   │   │   │       ├── helm-generator.service.ts
│   │   │   │       └── k8s-generator.service.ts
│   │   │   ├── templates/
│   │   │   │   ├── crud-master-detail/
│   │   │   │   ├── workflow-engine/
│   │   │   │   └── ...
│   │   │   ├── security/
│   │   │   │   └── scanner.service.ts
│   │   │   └── self-improvement/
│   │   │       ├── veroforge-telemetry.service.ts
│   │   │       ├── improvement-receiver.service.ts
│   │   │       ├── template-updater.service.ts
│   │   │       └── generator-updater.service.ts
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── forge-console/                 # ⭐ NEW: Review & Deployment UI
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── review/
│   │   │   │   ├── diff-viewer.component.tsx
│   │   │   │   ├── section-regeneration.component.tsx
│   │   │   │   └── approval-workflow.component.tsx
│   │   │   └── deployment/
│   │   │       ├── staging.component.tsx
│   │   │       ├── production.component.tsx
│   │   │       └── demo-environment.component.tsx
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── forge-marketplace/             # ⭐ NEW: Plugin Marketplace
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── plugin-registry/
│   │   │   ├── security/
│   │   │   ├── sandbox/
│   │   │   ├── billing/
│   │   │   ├── developer-portal/
│   │   │   └── customer-marketplace/
│   │   ├── package.json
│   │   └── Dockerfile
│   ├── forge-intelligence/            # ⭐ NEW: Pattern Detection
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── pattern-detection/
│   │   │   │   ├── sql-pattern-detector.service.ts
│   │   │   │   └── ml-clustering.service.ts
│   │   │   ├── template-abstractor/
│   │   │   │   └── template-promoter.service.ts
│   │   │   └── auto-remediation/
│   │   │       └── suggestion-engine.service.ts
│   │   ├── package.json
│   │   └── Dockerfile
│   └── forge-provisioning/            # ⭐ NEW: Customer Provisioning
│       ├── src/
│       │   ├── main.ts
│       │   ├── namespace/
│       │   │   └── namespace.service.ts
│       │   ├── database/
│       │   │   └── schema.service.ts
│       │   ├── gitops/
│       │   │   └── argocd.service.ts
│       │   └── security/
│       │       └── security.service.ts
│       ├── package.json
│       └── Dockerfile
├── libs/                               # Shared libraries
│   ├── common/                         # Common utilities (existing)
│   │   ├── src/
│   │   │   ├── kafka/
│   │   │   ├── prisma/
│   │   │   ├── cache/
│   │   │   ├── interceptors/
│   │   │   └── types/
│   │   └── prisma/
│   │       └── schema.prisma
│   └── ontology/                       # ⭐ NEW: Industry Abstraction Layer
│       ├── src/
│       │   ├── universal-entities.ts
│       │   ├── vertical-maps/
│       │   │   ├── logistics.ts
│       │   │   ├── ecommerce.ts
│       │   │   ├── events.ts
│       │   │   ├── property.ts
│       │   │   ├── healthcare.ts
│       │   │   ├── construction.ts
│       │   │   ├── field-service.ts
│       │   │   ├── retail.ts
│       │   │   ├── education.ts
│       │   │   └── manufacturing.ts
│       │   ├── workflow-ast.ts
│       │   └── compliance-inference.ts
│       └── package.json
├── packages/                           # ⭐ NEW: NPM packages
│   └── forge-sdk/                      # ⭐ NEW: Developer SDK
│       ├── src/
│       │   ├── index.ts
│       │   ├── extend/
│       │   │   └── template-api.ts
│       │   ├── override/
│       │   │   └── custom-endpoints.ts
│       │   ├── custom-endpoints/
│       │   └── custom-components/
│       ├── package.json
│       └── README.md
├── services/                           # External services (existing)
│   ├── flink-jobs/                     # VeroAI Flink
│   ├── feast/                          # VeroAI Feast
│   └── opa/                            # VeroAI OPA
├── platform/                           # ⭐ NEW: Platform services
│   ├── provisioning/
│   │   └── scripts/
│   ├── approvals/
│   │   └── workflows/
│   ├── audit/
│   │   └── logs/
│   └── billing/
│       └── marketplace/
├── infra/                              # Infrastructure as Code
│   ├── terraform/
│   │   ├── customer-namespace/         # ⭐ NEW: Per-customer infra
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── outputs.tf
│   │   └── marketplace/               # ⭐ NEW: Marketplace infra
│   │       ├── main.tf
│   │       ├── variables.tf
│   │       └── outputs.tf
│   ├── k8s/
│   │   ├── namespace-template/        # ⭐ NEW: K8s namespace templates
│   │   │   ├── namespace.yaml
│   │   │   ├── rbac.yaml
│   │   │   └── network-policy.yaml
│   │   └── marketplace/               # ⭐ NEW: Marketplace K8s
│   │       ├── deployment.yaml
│   │       └── service.yaml
│   └── argo/
│       └── customer-apps/              # ⭐ NEW: GitOps for generated apps
│           └── application-template.yaml
├── frontend/                           # React frontend (existing)
├── VeroFieldMobile/                    # React Native (existing)
└── deploy/                             # Deployment configs (existing)
```

---

## New Directory Details

### 1. `apps/forge-generator/`

**Purpose:** Core generator pipeline for creating applications from requirements.

**Key Files:**
- `src/pipeline/orchestrator.service.ts` - Main orchestration logic
- `src/generators/*/` - Code generators for each layer
- `src/templates/` - Template library
- `src/self-improvement/` - VeroAI integration for self-improvement

**Dependencies:**
- `@verofield/common` - Shared libraries
- `@veroforge/ontology` - Industry abstraction layer
- VeroAI services (HTTP clients)

### 2. `apps/forge-console/`

**Purpose:** Customer-facing UI for reviewing and deploying generated apps.

**Key Files:**
- `src/review/` - Code review components
- `src/deployment/` - Deployment management

**Dependencies:**
- React + TypeScript
- Monaco Editor (for diff viewing)
- VeroForge Generator API

### 3. `apps/forge-marketplace/`

**Purpose:** Plugin marketplace for third-party extensions.

**Key Files:**
- `src/plugin-registry/` - Plugin management
- `src/sandbox/` - Sandboxed runtime
- `src/billing/` - Revenue share system

**Dependencies:**
- gVisor/Firecracker for sandboxing
- Payment processing

### 4. `apps/forge-intelligence/`

**Purpose:** Cross-customer pattern detection and template improvement.

**Key Files:**
- `src/pattern-detection/` - Pattern analysis
- `src/template-abstractor/` - Template promotion
- `src/auto-remediation/` - Improvement suggestions

**Dependencies:**
- Kafka for event streaming
- ML libraries for clustering
- VeroAI pattern detection

### 5. `apps/forge-provisioning/`

**Purpose:** Automated customer environment provisioning.

**Key Files:**
- `src/namespace/` - Kubernetes namespace creation
- `src/database/` - Database schema management
- `src/gitops/` - ArgoCD integration

**Dependencies:**
- Kubernetes client
- ArgoCD API
- PostgreSQL client

### 6. `libs/ontology/`

**Purpose:** Industry abstraction layer for cross-vertical generation.

**Key Files:**
- `src/universal-entities.ts` - Common entity definitions
- `src/vertical-maps/` - Industry-specific mappings
- `src/workflow-ast.ts` - Workflow representation
- `src/compliance-inference.ts` - Compliance rule mapping

**Dependencies:**
- TypeScript types only
- No runtime dependencies

### 7. `packages/forge-sdk/`

**Purpose:** Developer SDK for plugin development and customization.

**Key Files:**
- `src/index.ts` - Main SDK export
- `src/extend/` - Template extension APIs
- `src/override/` - Customization APIs

**Dependencies:**
- Minimal dependencies
- TypeScript types

### 8. `platform/`

**Purpose:** Platform-level services and configurations.

**Structure:**
- `provisioning/` - Provisioning scripts and configs
- `approvals/` - Approval workflow definitions
- `audit/` - Audit log storage
- `billing/` - Marketplace billing configs

---

## Package.json Structure

### Root `package.json`

```json
{
  "name": "verofield-monorepo",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "libs/*",
    "packages/*",
    "frontend",
    "VeroFieldMobile"
  ],
  "scripts": {
    "dev": "npm run dev --workspaces",
    "dev:forge-generator": "npm run dev --workspace=apps/forge-generator",
    "dev:forge-console": "npm run dev --workspace=apps/forge-console",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "lint": "npm run lint --workspaces"
  }
}
```

### Example: `apps/forge-generator/package.json`

```json
{
  "name": "@veroforge/generator",
  "version": "1.0.0",
  "dependencies": {
    "@verofield/common": "*",
    "@veroforge/ontology": "*",
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  }
}
```

### Example: `libs/ontology/package.json`

```json
{
  "name": "@veroforge/ontology",
  "version": "1.0.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "dependencies": {},
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

---

## Import Patterns

### Within VeroForge Services

```typescript
// ✅ CORRECT - Import from shared library
import { KafkaProducerService } from '@verofield/common/kafka';
import { PrismaService } from '@verofield/common/prisma';

// ✅ CORRECT - Import from ontology library
import { UniversalEntity, VerticalMap } from '@veroforge/ontology';

// ✅ CORRECT - Import from SDK
import { Plugin, PluginContext } from '@veroforge/sdk';

// ❌ WRONG - Relative imports across services
import { SomeService } from '../../forge-intelligence/src/services/some.service';
```

### Service Communication

```typescript
// ✅ CORRECT - HTTP calls between services
const response = await this.httpService.post(
  'http://forge-intelligence:3005/api/v1/patterns/detect',
  data
);

// ❌ WRONG - Direct imports between services
import { PatternDetector } from '../../forge-intelligence/src/pattern-detection';
```

---

## Dockerfile Structure

### Example: `apps/forge-generator/Dockerfile`

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/forge-generator/package*.json ./apps/forge-generator/
COPY libs/ontology/package*.json ./libs/ontology/
COPY libs/common/package*.json ./libs/common/
RUN npm ci --workspaces
COPY . .
RUN npm run build --workspace=apps/forge-generator

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/forge-generator/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/forge-generator/package.json ./
CMD ["node", "dist/main.js"]
```

---

## Kubernetes Deployment

### Service Deployment Pattern

```yaml
# apps/forge-generator/k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: forge-generator
  namespace: veroforge
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: generator
        image: veroforge/generator:latest
        env:
        - name: VEROAI_CODEGEN_URL
          value: "http://crm-ai:3001"
        - name: KAFKA_BROKERS
          value: "kafka:9092"
```

---

## Development Workflow

### Running Services

```bash
# Run all VeroForge services
npm run dev:forge-generator
npm run dev:forge-console
npm run dev:forge-marketplace
npm run dev:forge-intelligence
npm run dev:forge-provisioning

# Run all services (VeroAI + VeroForge)
npm run dev
```

### Building Services

```bash
# Build specific service
npm run build --workspace=apps/forge-generator

# Build all services
npm run build
```

### Testing

```bash
# Test specific service
npm test --workspace=apps/forge-generator

# Test all services
npm test
```

---

## Migration from VeroAI Structure

### No Breaking Changes

- VeroAI services remain unchanged
- VeroForge services are additive
- Shared libraries extended, not replaced

### New Dependencies

- VeroForge services depend on VeroAI services
- VeroAI services remain independent
- Shared libraries used by both

---

## Related Documentation

- [VeroForge Development Plan](VEROFORGE_DEVELOPMENT_PLAN.md)
- [VeroAI Structure Restructuring](../VEROAI_STRUCTURE_RESTRUCTURING.md)
- [Monorepo Rules](../../.cursor/rules/monorepo.md)

---

**Last Updated:** 2025-11-16  
**Status:** Planning - Awaiting VeroAI Completion  
**Owner:** Platform Engineering Team

