## Must-Pass Critical Flows (all phases)

1) **Create Account → Complete Job**
   - Create account (accounts service), capture billing profile.
   - Create work order + schedule job.
   - Technician accepts, completes with notes/photos.
   - Job closure triggers invoice creation.

2) **Invoice / Payment**
   - Generate invoice from completed job/work-order.
   - Send to customer; capture payment (Stripe/Supabase billing).
   - Reconcile payment status and update account balance.

3) **Scheduling / Acceptance**
   - Customer request → create work-order/job.
   - Dispatch suggests slots; technician accepts or declines.
   - Calendar updates propagate to technician availability and notifications.

4) **Dashboard KPIs**
   - Ingest job/work-order metrics into KPI templates.
   - Render dashboard layouts/regions for tenant.
   - Apply RLS per tenant and per user ACLs.

5) **Mobile Photo Submission**
   - Technician uploads photos to work-order/job.
   - Files stored and linked; audit trail captured.
   - Photos visible in customer/job summary; respect tenant isolation.

### Regression Checkpoints

- Auth + tenant guard enforced end-to-end in each flow.
- Data persists correctly in Prisma models; background events/jobs succeed.
- Notifications/webhooks dispatched where applicable.
- Idempotency for retries (especially payments/uploads).
- UI/API responses stable; no breaking contract changes allowed during migration.

