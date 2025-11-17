# VeroAI Quick Reference

**Status:** Strategic Initiative - Pre-Production Priority  
**Full Plan:** `docs/planning/VEROAI_DEVELOPMENT_PLAN.md`

---

## What is VeroAI?

VeroAI is a comprehensive AI-powered development and operations system that enables:
- **Natural language to production code** - Generate features from requirements
- **Automated canary deployments** - KPI-gated progressive rollouts
- **AI governance** - Automated change approval and management
- **AI Security Operations Center** - 80% of incidents auto-resolved
- **ML-ready feature store** - Real-time feature engineering pipeline

---

## Timeline Overview

| Phase | Month | Focus | Key Deliverable |
|-------|-------|-------|-----------------|
| **Phase 0** | 0 | Foundation & Telemetry | Kafka infrastructure, event tracking |
| **Phase 1** | 1 | Feature Store | Feast + Redis, Flink processing |
| **Phase 2** | 2 | AI CodeGen MVP | Claude/GPT-4 code generation |
| **Phase 3** | 3 | Canary Pipeline | Argo Rollouts, KPI gates |
| **Phase 4** | 4 | Governance Cockpit | Change management, OPA |
| **Phase 5** | 5 | AI SOC | Security agent, auto-resolution |
| **Phase 6-12** | 6-12 | Scale & Production | Beta, optimization, launch |

---

## Developer Assignments

### Developer 1: Frontend (40%)
- Telemetry UI
- Governance Cockpit
- Security Dashboard
- One-Tap Complete button
- NPS Survey

### Developer 2: Backend API (35%)
- Kafka producer/interceptor
- AI CodeGen service
- Feature ingestion/retrieval
- KPI gate service
- Governance service
- AI SOC services

### Developer 3: Infrastructure (15%)
- Kafka setup
- Flink configuration
- Feast feature store
- Kubernetes manifests
- Database migrations
- Monitoring setup

### Developer 4: Documentation (5%)
- API documentation
- Setup guides
- Developer onboarding
- Environment configuration

### Developer 5: QA (5%)
- Unit tests
- Integration tests
- E2E tests
- Security tests

---

## Key Files by Phase

### Phase 0: Foundation
- `deploy/docker-compose.kafka.yml`
- `libs/common/src/kafka/kafka-producer.service.ts` ⭐ **UPDATED PATH**
- `libs/common/src/interceptors/telemetry.interceptor.ts` ⭐ **UPDATED PATH**
- `frontend/src/lib/telemetry.ts`

### Phase 1: Feature Store
- `deploy/docker-compose.flink.yml`
- `services/feast/feature_store.yaml`
- `apps/api/src/features/features.service.ts` ⭐ **UPDATED PATH**

### Phase 2: AI CodeGen
- `apps/crm-ai/src/ai.module.ts` ⭐ **UPDATED PATH** (microservice)
- `apps/crm-ai/src/services/codegen.service.ts` ⭐ **UPDATED PATH**
- `apps/crm-ai/src/services/code-deployer.service.ts` ⭐ **UPDATED PATH**
- `frontend/src/components/ui/OneTapCompleteButton.tsx`

### Phase 3: Canary Pipeline
- `deploy/k8s/rollouts/crm-ai-rollout.yaml`
- `apps/kpi-gate/src/kpi-gate.service.ts` ⭐ **UPDATED PATH** (microservice)
- `libs/common/src/metrics/custom-metrics.ts` ⭐ **UPDATED PATH**

### Phase 4: Governance
- `libs/common/prisma/migrations/XXXXX_ai_governance/` ⭐ **UPDATED PATH**
- `apps/api/src/governance/governance.service.ts` ⭐ **UPDATED PATH**
- `frontend/src/pages/GovernanceCockpit.tsx`
- `services/opa/policies/auto_approve.rego`

### Phase 5: AI SOC
- `apps/ai-soc/src/ai-soc.module.ts` ⭐ **UPDATED PATH** (microservice)
- `apps/ai-soc/src/services/security-agent.service.ts` ⭐ **UPDATED PATH**
- `frontend/src/pages/SecurityDashboard.tsx`

---

## Success Metrics

- ✅ AI code generation success rate >95%
- ✅ Canary promotion rate >80%
- ✅ Auto-approval rate >60%
- ✅ Security incident auto-resolution >80%
- ✅ Average code generation time <4 minutes

---

## Prerequisites

### Infrastructure
- Kafka cluster
- Kubernetes cluster (Phase 3+)
- Redis (existing)
- Prometheus/Grafana
- Cloudflare WAF (Phase 5)

### External Services
- Anthropic API key (Claude)
- OpenAI API key (GPT-4)
- Cloudflare API
- Slack webhook

---

## Quick Start

1. **Read Full Plan**: `docs/planning/VEROAI_DEVELOPMENT_PLAN.md`
2. **Review Developer Assignments**: See breakdown by developer
3. **Check Prerequisites**: Ensure infrastructure ready
4. **Start Phase 0**: Kafka infrastructure setup

---

**Last Updated:** 2025-11-15  
**Status:** Pre-Production Priority  
**Owner:** Development Team Lead  
**Note:** All file paths reflect post-restructuring monorepo structure. See `docs/planning/VEROAI_STRUCTURE_RESTRUCTURING.md` for migration details.

