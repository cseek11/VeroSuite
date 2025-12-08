# VeroField - Multi-Tenant Pest Control Operations Platform

A comprehensive, production-ready multi-tenant pest control operations platform with complete frontend, backend, and mobile components. This system provides real-time job management, customer relationship management, billing and payment processing, and technician mobile applications.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Supabase account (for authentication)

### Backend Setup
```bash
cd apps/api
npm install
cp .env.example .env
# Configure your environment variables in .env
npm run start:dev
```

### Frontend Setup
```bash
cd apps/web
npm install
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **API Documentation**: http://localhost:3001/api/docs

## 📁 Project Structure (Phase 1)

VeroField uses a monorepo structure with clear separation of concerns:

```
VeroField/
├── apps/                    # Runtime applications
│   ├── api/                 # Backend API (NestJS)
│   ├── web/                 # Frontend (React)
│   ├── mobile/              # Mobile app (React Native)
│   └── website/             # Marketing site
├── packages/                # Shared libraries (Phase 2+)
│   ├── domain/              # (Reserved) Domain layer
│   ├── application/         # (Reserved) Application layer
│   ├── infrastructure/      # (Reserved) Infrastructure layer
│   └── shared/              # (Reserved) Shared utilities
├── infrastructure/          # Deployment & observability
│   ├── docker/              # Docker Compose configs
│   ├── kubernetes/          # K8s manifests
│   ├── terraform/           # (Reserved) IaC
│   └── monitoring/          # Monitoring & observability
├── libs/                    # Legacy shared code
├── docs/                    # Documentation
└── ... (supporting folders)
```

**See [Phase 1 Architecture](docs/phase-1-architecture.md) for full migration details.**

## 📚 Documentation

**All documentation is now in the [`docs/`](docs/) directory.**

- **[Developer Documentation Hub](docs/README.md)** - Complete documentation portal
- **[Getting Started](docs/guides/getting-started/README.md)** - Setup and onboarding guide
- **[Development Best Practices](docs/guides/development/best-practices.md)** - Coding standards and patterns
- **[API Documentation](docs/guides/api/README.md)** - Backend and frontend API docs
- **[Architecture Overview](docs/architecture/system-overview.md)** - System design

## 📦 Archive Directories

The following directories are read-only archives and must not be modified:

- `.cursor__archived_*/` — Historical Cursor configurations (if present)
- `.cursor__disabled/` — Disabled/legacy enforcement code and rules (migrated to `.ai/`)

**Active configuration and AI data live in:**
- `.cursor/` — IDE integration and enforcement summaries
- `.ai/` — Rules, memory bank, patterns, and AI logs

## 🚀 Current Status: **PRODUCTION READY**

The system has been fully implemented with:
- ✅ **Complete Backend API** with NestJS, Prisma, and PostgreSQL
- ✅ **Multi-Tenant Security** with Row Level Security (RLS) and JWT authentication
- ✅ **Billing & Payment System** with Stripe integration
- ✅ **Real-Time Frontend** with React, TypeScript, and Tailwind CSS
- ✅ **Database Integration** with proper tenant isolation
- ✅ **No Mock Data** - All components use real APIs and database operations

## 🤖 VeroAI: Strategic Initiative

**VeroAI** is a comprehensive AI-powered development and operations system that will be implemented **prior to production launch** as a foundational capability. This strategic initiative enables:

- **AI Code Generation**: Natural language to production code
- **Automated Feature Deployment**: Canary pipelines with KPI gates
- **Governance Cockpit**: AI change management and approval workflows
- **AI Security Operations Center**: Automated threat detection and response (80% auto-resolution)
- **Feature Store**: ML-ready feature engineering pipeline

**Timeline:** 12 Months (Phases 0-5: Months 0-5, Phases 6-12: Months 6-12)

**Documentation:**
- **[Full VeroAI Development Plan](docs/planning/VEROAI_DEVELOPMENT_PLAN.md)** - Complete implementation guide
- **[VeroAI Quick Reference](docs/planning/VEROAI_QUICK_REFERENCE.md)** - Quick start guide

## Security Highlights

- Strict tenant isolation via Postgres Row Level Security (RLS) on tenant-scoped tables
- Per-request `SET LOCAL app.tenant_id` and limited DB role
- JWT auth with roles/permissions
- Audit logging of sensitive actions
- Input validation and DTOs across endpoints

## Contributing

See [Documentation Contributing Guide](docs/CONTRIBUTING.md) for how to contribute to documentation.

---

For complete documentation, see the [Documentation Hub](docs/README.md).
