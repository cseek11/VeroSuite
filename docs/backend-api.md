---
title: Backend API Reference
category: API
status: active
last_reviewed: 2025-12-05
owner: api_lead
related:
  - docs/guides/api/frontend-api.md
  - docs/architecture/backend-architecture.md
---

# VeroField API Overview

The API is designed for a multi-tenant operations platform. Authentication is JWT-based and each request is tenant-scoped via RLS. This document summarizes key endpoints grouped by modules.

Base URL examples:
- Local: http://localhost:3001
- Docs (Swagger): http://localhost:3001/api/docs

Auth: Bearer <JWT>

## Authentication

- POST /auth/login
  - body: { email: string, password: string }
  - returns: { access_token, user: { id, email, tenant_id, roles[] } }

JWT payload includes tenant_id, roles, and derived permissions.

## CRM Module

- GET /v1/crm/accounts
  - query: search? (optional)
  - returns: list of accounts with minimal location info

- POST /v1/crm/accounts
  - body: { name, account_type, phone?, email?, billing_address? }
  - returns: created account

- GET /v1/crm/accounts/:id
  - returns: account details

- GET /v1/crm/accounts/:id/locations
  - returns: the account's locations

- POST /v1/crm/locations
  - body: { account_id, name, address_line1, address_line2?, city, state, postal_code, service_area_id? }
  - side effect: address geocoded (best-effort)

## Jobs & Scheduling

- POST /v1/jobs
  - body: { work_order_id, account_id, location_id, scheduled_date, scheduled_start_time?, scheduled_end_time?, priority, technician_id? }
  - returns: created job

- POST /v1/jobs/assign
  - body: { job_id, technician_id, scheduled_date, time_window_start, time_window_end }
  - returns: updated job

- GET /v1/jobs/today?technician_id=
  - query: technician_id (optional)
  - returns: today's jobs for tenant or specific tech

- PUT /v1/jobs/:id/start
  - body: { gps_location: { lat, lng } }
  - returns: started job

- PUT /v1/jobs/:id/complete
  - body: { notes?, signature_url?, photos?, chemicals_used?[] }
  - returns: completed job

## Field (Mobile)

- GET /v1/field/jobs/today
  - returns: tech's job list optimized for mobile consumption

- POST /v1/field/jobs/:id/photos
  - body: { type: 'before'|'after'|'service'|'damage', upload_url? }

## Branding

- GET /v1/branding/current
  - returns: current published branding theme for tenant

- PUT /v1/branding/draft
  - body: { theme_json, logo_url? }

- POST /v1/branding/publish
  - deploy draft → current

- POST /v1/branding/assets/upload-url
  - body: { filename, content_type }
  - returns: presigned S3 upload URL

## Billing

- GET /v1/billing/invoices
- POST /v1/billing/invoices
- POST /v1/billing/invoices/:id/pay
- GET /v1/billing/payment-methods

## Example: Today's Jobs (response shape)

```json
{
  "data": [
    {
      "id": "job1",
      "status": "scheduled",
      "priority": "high",
      "scheduled_date": "2025-08-18",
      "time_window": { "start": "09:00", "end": "11:00" },
      "customer": { "id": "account1", "name": "Downtown Restaurant Group", "type": "commercial" },
      "location": {
        "id": "location1",
        "name": "Main Street Location",
        "address": "123 Main St, Pittsburgh, PA",
        "coordinates": { "lat": 40.4406, "lng": -79.9959 }
      },
      "service": {
        "type": "Monthly Service",
        "description": "Interior and exterior pest control treatment",
        "estimated_duration": 90,
        "price": 185
      },
      "technician_id": "tech1",
      "actual_times": { "started_at": null, "completed_at": null },
      "completion_data": { "notes": null, "signature": null, "photos": [], "chemicals_used": [] }
    }
  ],
  "meta": { "request_id": "req-123", "timestamp": "2025-08-18T12:00:00Z" }
}
```

## Permissions

Example role → permissions mapping (simplified):
- tenant_admin: ["*"]
- dispatcher: ["jobs.read", "jobs.create", "jobs.assign", "customers.*", "routes.optimize", "reports.read"]
- technician: ["jobs.read", "jobs.update", "jobs.complete", "customers.read"]
- accountant: ["billing.*", "reports.read", "customers.read"]
- read_only: ["*.read"]

Requests should be authorized at the controller/service layer and audit-logged for sensitive actions.

---

**Last Updated:** 2025-12-05  
**Maintained By:** API Lead  
**Review Frequency:** On API changes






