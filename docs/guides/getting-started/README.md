---
title: Getting Started
category: Development
status: active
last_reviewed: 2025-11-11
owner: frontend_team
related:
  - docs/guides/development/best-practices.md
  - docs/guides/api/README.md
---

# Getting Started with VeroField

Welcome to VeroField! This guide will help you get up and running quickly.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Supabase account (for authentication)

## Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables in .env
npm run start:dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **API Documentation**: http://localhost:3001/api/docs

## Next Steps

1. **Read Development Best Practices**
   - [Development Best Practices](../development/best-practices.md)
   - [Component Library Guide](../development/component-library.md)
   - [Styling Guide](../development/styling-guide.md)

2. **Explore the Architecture**
   - [System Architecture](../../architecture/system-overview.md)
   - [Frontend Architecture](../../architecture/frontend-architecture.md)
   - [Backend Architecture](../../architecture/backend-architecture.md)

3. **Review API Documentation**
   - [Backend API](../api/backend-api.md)
   - [Frontend API](../api/frontend-api.md)

## Need Help?

- Check the [Documentation Hub](../../README.md)
- Review [Troubleshooting Guide](../deployment/troubleshooting.md)
- See [Context Map](../../reference/context-map.md) for documentation by system area

---

**Last Updated:** 2025-11-11  
**Maintained By:** Frontend Team






