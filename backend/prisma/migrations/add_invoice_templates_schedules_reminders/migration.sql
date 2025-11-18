-- CreateTable: invoice_templates
-- Migration: Add Invoice Templates, Schedules, and Reminder History tables
-- Date: 2025-11-18
-- Description: Adds support for invoice templates, automated scheduling, and reminder tracking

-- CreateTable: invoice_templates
CREATE TABLE IF NOT EXISTS "public"."invoice_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "items" JSONB NOT NULL DEFAULT '[]',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,

    CONSTRAINT "invoice_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable: invoice_schedules
CREATE TABLE IF NOT EXISTS "public"."invoice_schedules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "template_id" UUID,
    "schedule_type" VARCHAR(20) NOT NULL,
    "frequency" VARCHAR(20),
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "next_run_date" TIMESTAMPTZ(6) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "amount" DECIMAL(10,2),
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,

    CONSTRAINT "invoice_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable: invoice_reminder_history
CREATE TABLE IF NOT EXISTS "public"."invoice_reminder_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "invoice_id" UUID NOT NULL,
    "reminder_type" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'sent',
    "message" TEXT,
    "sent_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,

    CONSTRAINT "invoice_reminder_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: invoice_templates_tenant_id
CREATE INDEX IF NOT EXISTS "invoice_templates_tenant_id_idx" ON "public"."invoice_templates"("tenant_id");

-- CreateIndex: invoice_templates_name
CREATE INDEX IF NOT EXISTS "invoice_templates_name_idx" ON "public"."invoice_templates"("name");

-- CreateIndex: invoice_schedules_tenant_id
CREATE INDEX IF NOT EXISTS "invoice_schedules_tenant_id_idx" ON "public"."invoice_schedules"("tenant_id");

-- CreateIndex: invoice_schedules_account_id
CREATE INDEX IF NOT EXISTS "invoice_schedules_account_id_idx" ON "public"."invoice_schedules"("account_id");

-- CreateIndex: invoice_schedules_is_active
CREATE INDEX IF NOT EXISTS "invoice_schedules_is_active_idx" ON "public"."invoice_schedules"("is_active");

-- CreateIndex: invoice_schedules_next_run_date
CREATE INDEX IF NOT EXISTS "invoice_schedules_next_run_date_idx" ON "public"."invoice_schedules"("next_run_date");

-- CreateIndex: invoice_reminder_history_tenant_id
CREATE INDEX IF NOT EXISTS "invoice_reminder_history_tenant_id_idx" ON "public"."invoice_reminder_history"("tenant_id");

-- CreateIndex: invoice_reminder_history_invoice_id
CREATE INDEX IF NOT EXISTS "invoice_reminder_history_invoice_id_idx" ON "public"."invoice_reminder_history"("invoice_id");

-- CreateIndex: invoice_reminder_history_sent_at (DESC)
CREATE INDEX IF NOT EXISTS "invoice_reminder_history_sent_at_idx" ON "public"."invoice_reminder_history"("sent_at" DESC);

-- CreateIndex: invoice_reminder_history_reminder_type
CREATE INDEX IF NOT EXISTS "invoice_reminder_history_reminder_type_idx" ON "public"."invoice_reminder_history"("reminder_type");

-- AddForeignKey: invoice_templates_tenant_id -> tenants.id
ALTER TABLE "public"."invoice_templates" 
ADD CONSTRAINT "invoice_templates_tenant_id_fkey" 
FOREIGN KEY ("tenant_id") 
REFERENCES "public"."tenants"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- AddForeignKey: invoice_templates_created_by -> users.id
ALTER TABLE "public"."invoice_templates" 
ADD CONSTRAINT "invoice_templates_created_by_fkey" 
FOREIGN KEY ("created_by") 
REFERENCES "public"."users"("id") 
ON DELETE RESTRICT 
ON UPDATE CASCADE;

-- AddForeignKey: invoice_templates_updated_by -> users.id
ALTER TABLE "public"."invoice_templates" 
ADD CONSTRAINT "invoice_templates_updated_by_fkey" 
FOREIGN KEY ("updated_by") 
REFERENCES "public"."users"("id") 
ON DELETE RESTRICT 
ON UPDATE CASCADE;

-- AddForeignKey: invoice_schedules_tenant_id -> tenants.id
ALTER TABLE "public"."invoice_schedules" 
ADD CONSTRAINT "invoice_schedules_tenant_id_fkey" 
FOREIGN KEY ("tenant_id") 
REFERENCES "public"."tenants"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- AddForeignKey: invoice_schedules_account (composite key: tenant_id, account_id) -> accounts(tenant_id, id)
ALTER TABLE "public"."invoice_schedules" 
ADD CONSTRAINT "invoice_schedules_account_id_tenant_id_fkey" 
FOREIGN KEY ("tenant_id", "account_id") 
REFERENCES "public"."accounts"("tenant_id", "id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- AddForeignKey: invoice_schedules_created_by -> users.id
ALTER TABLE "public"."invoice_schedules" 
ADD CONSTRAINT "invoice_schedules_created_by_fkey" 
FOREIGN KEY ("created_by") 
REFERENCES "public"."users"("id") 
ON DELETE RESTRICT 
ON UPDATE CASCADE;

-- AddForeignKey: invoice_schedules_updated_by -> users.id
ALTER TABLE "public"."invoice_schedules" 
ADD CONSTRAINT "invoice_schedules_updated_by_fkey" 
FOREIGN KEY ("updated_by") 
REFERENCES "public"."users"("id") 
ON DELETE RESTRICT 
ON UPDATE CASCADE;

-- AddForeignKey: invoice_reminder_history_tenant_id -> tenants.id
ALTER TABLE "public"."invoice_reminder_history" 
ADD CONSTRAINT "invoice_reminder_history_tenant_id_fkey" 
FOREIGN KEY ("tenant_id") 
REFERENCES "public"."tenants"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- AddForeignKey: invoice_reminder_history_invoice_id -> invoices.id
ALTER TABLE "public"."invoice_reminder_history" 
ADD CONSTRAINT "invoice_reminder_history_invoice_id_fkey" 
FOREIGN KEY ("invoice_id") 
REFERENCES "public"."invoices"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- AddForeignKey: invoice_reminder_history_created_by -> users.id
ALTER TABLE "public"."invoice_reminder_history" 
ADD CONSTRAINT "invoice_reminder_history_created_by_fkey" 
FOREIGN KEY ("created_by") 
REFERENCES "public"."users"("id") 
ON DELETE RESTRICT 
ON UPDATE CASCADE;

-- Note: template_id in invoice_schedules is nullable and does not require a foreign key constraint
-- as it's an optional reference to invoice_templates. If you want to enforce referential integrity,
-- uncomment the following:
-- ALTER TABLE "public"."invoice_schedules" 
-- ADD CONSTRAINT "invoice_schedules_template_id_fkey" 
-- FOREIGN KEY ("template_id") 
-- REFERENCES "public"."invoice_templates"("id") 
-- ON DELETE SET NULL 
-- ON UPDATE CASCADE;

