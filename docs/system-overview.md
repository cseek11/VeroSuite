---
title: System Architecture Overview
category: Architecture
status: active
last_reviewed: 2025-12-05
owner: tech_architect
related:
  - docs/architecture/frontend-architecture.md
  - docs/architecture/backend-architecture.md
  - docs/architecture/database-architecture.md
  - docs/architecture/security.md
  - docs/architecture/veroforge-architecture.md
---

# System Architecture Overview

## Overview

VeroField is a comprehensive, production-ready multi-tenant pest control operations platform with complete frontend, backend, and mobile components. The system provides real-time job management, customer relationship management, billing and payment processing, and technician mobile applications.

**Platform Evolution:** VeroField is evolving into VeroForge, a platform for generating entire business applications. VeroForge leverages VeroAI's capabilities to enable template-first code generation with AI gap filling, multi-tenant isolation, marketplace extensibility, and telemetry-driven self-improvement.

## System Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Card System  │  │ CRM          │  │ Mobile App   │  │
│  │ Dashboard    │  │ Interface    │  │ (React      │  │
│  │ (React)      │  │ (React)      │  │ Native)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────────┐
│                      API Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ REST API     │  │ WebSocket    │  │ GraphQL      │  │
│  │ (NestJS)     │  │ (Real-time)  │  │ (Optional)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────────┐
│                    Business Logic Layer                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ CRM         │  │ Jobs        │  │ Billing      │  │
│  │ Service     │  │ Service     │  │ Service      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
┌─────────────────────────────────────────────────────────┐
│                      Data Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ PostgreSQL   │  │ Redis        │  │ S3 Storage   │  │
│  │ (Prisma)     │  │ (Cache)      │  │ (Files)      │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Form Handling**: react-hook-form + zod
- **Routing**: React Router

### Backend
- **Framework**: NestJS with TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL with Supabase
- **Authentication**: JWT with multi-tenant support
- **API Documentation**: Swagger/OpenAPI

### Mobile
- **Framework**: React Native
- **Architecture**: Offline-first with sync
- **Features**: GPS tracking, photo capture, signature capture

### Infrastructure
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Caching**: Redis (optional)
- **File Storage**: AWS S3 or Supabase Storage
- **Authentication**: Supabase Auth

## Core Modules

### 1. Customer Management (CRM)
- Customer profiles and segmentation
- Location management
- Service history tracking
- Communication logs

### 2. Job Management
- Job scheduling and assignment
- Technician dispatch
- Route optimization
- Job completion tracking

### 3. Billing & Payments
- Invoice generation
- Payment processing (Stripe integration)
- Accounts receivable management
- Payment history

### 4. Multi-Tenant Security
- Row Level Security (RLS) policies
- Tenant isolation
- JWT authentication
- Role-based access control

### 5. Mobile Field Operations
- Offline-first architecture
- GPS tracking
- Photo capture
- Signature capture
- Chemical usage logging

## Data Flow

### Request Flow
```
Client Request
    ↓
Authentication Middleware (JWT validation)
    ↓
Tenant Middleware (Set tenant context)
    ↓
Controller (Route handler)
    ↓
Service (Business logic)
    ↓
Repository/Prisma (Data access)
    ↓
PostgreSQL (RLS enforced)
    ↓
Response
```

### Multi-Tenant Isolation
```
Request → JWT (contains tenant_id)
    ↓
Tenant Middleware sets: SET LOCAL app.tenant_id = <tenant_id>
    ↓
All queries automatically filtered by RLS policies
    ↓
Response (tenant-scoped data only)
```

## Key Architectural Decisions

See [Decision Log](../decisions/README.md) for detailed architectural decisions:
- [Design System Colors](../decisions/design-system-colors.md)
- [Component Library Strategy](../decisions/component-library-strategy.md)
- [Modal vs Dialog Strategy](../decisions/modal-dialog-strategy.md)
- [API Client Strategy](../decisions/api-client-strategy.md)

## VeroForge Platform (Post-VeroAI)

### Overview

VeroForge extends VeroField from a single CRM application into a platform for generating entire business applications. Built on top of VeroAI's capabilities, VeroForge enables:

- **Template-First Generation**: 80% code generation via stable templates, 20% AI gap filling
- **Multi-Tenant Isolation**: Every customer runs in isolated Kubernetes namespace with dedicated DB schema
- **Marketplace Extensibility**: Sandboxed plugin system for third-party extensions
- **Telemetry-Driven Evolution**: Pattern detection and template auto-improvements
- **GitOps Everywhere**: All generated apps stored in Git with fully traceable deployments

### VeroForge Services

```
VeroForge Services (apps/)
├── forge-generator/     → Template + AI generation pipeline
├── forge-console/       → Review & deployment UI
├── forge-marketplace/   → Plugin marketplace
├── forge-intelligence/  → Pattern detection engine
└── forge-provisioning/  → Customer namespace automation
```

### Integration with VeroAI

VeroForge leverages VeroAI services:
- **VeroAI CodeGen** → Gap filling in templates
- **VeroAI Telemetry** → Pattern detection
- **VeroAI Governance** → Approval workflows
- **VeroAI SOC** → Security scanning

### Meta-Improvement Loop

VeroAI continuously improves VeroForge itself:
- Telemetry monitors VeroForge performance
- Pattern detection finds improvements
- CodeGen generates improved code
- Governance approves changes
- VeroForge auto-updates

See [VeroForge Architecture](veroforge-architecture.md) for complete details.

---

## Related Documentation

- [Frontend Architecture](frontend-architecture.md) - Frontend structure details
- [Backend Architecture](backend-architecture.md) - Backend structure details
- [Database Architecture](database-architecture.md) - Database design
- [Security Architecture](security.md) - Security model
- [VeroForge Architecture](veroforge-architecture.md) - VeroForge platform architecture

---

**Last Updated:** 2025-12-05  
**Maintained By:** Tech Architect  
**Review Frequency:** Quarterly






