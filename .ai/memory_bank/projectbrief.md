# Project Brief

**Last Updated:** 2025-12-04

## Project Overview

VeroField is an enterprise-grade field service management platform built with modern web technologies and a comprehensive AI governance system.

## Core Requirements

### Primary Goals
- Multi-tenant field service management
- Comprehensive security with Row Level Security (RLS)
- High code quality and consistency
- AI-assisted development with governance

### Project Scope
- Web application (React + TypeScript)
- Mobile application (React Native)
- Backend API (NestJS + Prisma)
- AI services (CRM AI, SOC AI)
- Policy enforcement (OPA/Rego)

## Key Constraints

- **Security:** Non-negotiable tenant isolation, RLS enforcement
- **Quality:** Comprehensive testing, code quality gates
- **Consistency:** Enforced patterns, architectural boundaries
- **Documentation:** Maintained and current

## Success Criteria

- Secure multi-tenant architecture
- Consistent code quality across monorepo
- Effective AI governance and pattern enforcement
- Comprehensive documentation and context preservation

## Related Documentation

- **Rule System:** `.cursor/rules/00-master.mdc` - Complete rule system overview
- **Architecture:** `.cursor/rules/04-architecture.mdc` - Monorepo structure
- **Security:** `.cursor/rules/03-security.mdc` - Security requirements
- **Tech Stack:** `.cursor/rules/02-core.mdc` - Technologies and standards

## Project Structure

See `.cursor/rules/04-architecture.mdc` for complete monorepo structure.

Key directories:
- `apps/` - Microservices (API, CRM AI, SOC AI, etc.)
- `frontend/` - React web application
- `libs/common/` - Shared libraries and Prisma schema
- `services/` - External services (Flink, Feast, OPA)
- `docs/` - Project documentation
- `.cursor/` - AI governance system (rules, patterns, memory bank)

## Governance System

VeroField uses a comprehensive AI governance system:
- **Rules:** 15 rule files (00-14 .mdc) for enforcement
- **Patterns:** Golden patterns and anti-patterns
- **Memory Bank:** Context preservation (this system)
- **CI Integration:** REWARD_SCORE system for quality gates

See `.cursor/README.md` for complete system documentation.





































