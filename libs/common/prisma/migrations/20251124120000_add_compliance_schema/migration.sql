-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "compliance";

-- CreateTable
CREATE TABLE "compliance"."rule_definitions" (
    "id" VARCHAR(10) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "tier" VARCHAR(20) NOT NULL,
    "category" VARCHAR(100),
    "file_path" VARCHAR(500),
    "opa_policy" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rule_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance"."compliance_checks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "pr_number" INTEGER NOT NULL,
    "commit_sha" VARCHAR(40) NOT NULL,
    "rule_id" VARCHAR(10) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "severity" VARCHAR(20) NOT NULL,
    "file_path" VARCHAR(500),
    "line_number" INTEGER,
    "violation_message" TEXT,
    "context" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMPTZ(6),
    "resolved_by" UUID,
    "override_reason" TEXT,
    "override_approved_by" UUID,

    CONSTRAINT "compliance_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance"."compliance_trends" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "rule_id" VARCHAR(10),
    "violation_count" INTEGER NOT NULL DEFAULT 0,
    "compliance_rate" DECIMAL(5,2),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "compliance_trends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance"."override_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "violation_id" UUID NOT NULL,
    "requested_by" UUID NOT NULL,
    "requested_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "approved_by" UUID,
    "approved_at" TIMESTAMPTZ(6),
    "rejection_reason" TEXT,

    CONSTRAINT "override_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance"."alert_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "violation_id" UUID NOT NULL,
    "alert_type" VARCHAR(50) NOT NULL,
    "sent_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledged_at" TIMESTAMPTZ(6),
    "acknowledged_by" UUID,
    "status" VARCHAR(20) NOT NULL,
    "delivery_error" TEXT,

    CONSTRAINT "alert_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance"."audit_log" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "action" VARCHAR(100) NOT NULL,
    "resource_type" VARCHAR(50),
    "resource_id" UUID,
    "before_state" JSONB,
    "after_state" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_checks_tenant" ON "compliance"."compliance_checks"("tenant_id");

-- CreateIndex
CREATE INDEX "idx_checks_pr" ON "compliance"."compliance_checks"("pr_number");

-- CreateIndex
CREATE INDEX "idx_checks_rule" ON "compliance"."compliance_checks"("rule_id");

-- CreateIndex
CREATE INDEX "idx_checks_status" ON "compliance"."compliance_checks"("status");

-- CreateIndex
CREATE INDEX "idx_checks_created" ON "compliance"."compliance_checks"("created_at" DESC);

-- CreateIndex (Partial index for unresolved violations)
CREATE INDEX "idx_checks_unresolved" ON "compliance"."compliance_checks"("status") WHERE "resolved_at" IS NULL;

-- CreateIndex (Composite partial index)
CREATE INDEX "idx_checks_tenant_unresolved" ON "compliance"."compliance_checks"("tenant_id", "status") WHERE "resolved_at" IS NULL;

-- CreateIndex
CREATE INDEX "idx_trends_tenant_date" ON "compliance"."compliance_trends"("tenant_id", "date" DESC);

-- CreateIndex
CREATE INDEX "idx_trends_rule" ON "compliance"."compliance_trends"("rule_id");

-- CreateIndex
CREATE INDEX "idx_override_tenant_status" ON "compliance"."override_requests"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "idx_override_violation" ON "compliance"."override_requests"("violation_id");

-- CreateIndex
CREATE INDEX "idx_alert_violation" ON "compliance"."alert_history"("violation_id");

-- CreateIndex (Partial index for sent/delivered alerts)
CREATE INDEX "idx_alert_status" ON "compliance"."alert_history"("status") WHERE "status" IN ('sent', 'delivered');

-- CreateIndex
CREATE INDEX "idx_audit_tenant" ON "compliance"."audit_log"("tenant_id");

-- CreateIndex
CREATE INDEX "idx_audit_user" ON "compliance"."audit_log"("user_id");

-- CreateIndex
CREATE INDEX "idx_audit_created" ON "compliance"."audit_log"("created_at" DESC);

-- AddForeignKey
ALTER TABLE "compliance"."compliance_checks" ADD CONSTRAINT "compliance_checks_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "compliance"."rule_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance"."compliance_checks" ADD CONSTRAINT "compliance_checks_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance"."compliance_trends" ADD CONSTRAINT "compliance_trends_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "compliance"."rule_definitions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance"."compliance_trends" ADD CONSTRAINT "compliance_trends_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance"."override_requests" ADD CONSTRAINT "override_requests_violation_id_fkey" FOREIGN KEY ("violation_id") REFERENCES "compliance"."compliance_checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance"."override_requests" ADD CONSTRAINT "override_requests_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance"."alert_history" ADD CONSTRAINT "alert_history_violation_id_fkey" FOREIGN KEY ("violation_id") REFERENCES "compliance"."compliance_checks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance"."alert_history" ADD CONSTRAINT "alert_history_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance"."audit_log" ADD CONSTRAINT "audit_log_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddUniqueConstraint
ALTER TABLE "compliance"."compliance_trends" ADD CONSTRAINT "compliance_trends_tenant_id_date_rule_id_key" UNIQUE ("tenant_id", "date", "rule_id");

-- Enable Row Level Security
ALTER TABLE "compliance"."compliance_checks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "compliance"."compliance_trends" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "compliance"."override_requests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "compliance"."alert_history" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "compliance"."audit_log" ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Tenant Isolation
CREATE POLICY "tenant_isolation_compliance_checks" ON "compliance"."compliance_checks"
    USING (tenant_id::text = current_setting('app.tenant_id', true));

CREATE POLICY "tenant_isolation_compliance_trends" ON "compliance"."compliance_trends"
    USING (tenant_id::text = current_setting('app.tenant_id', true));

CREATE POLICY "tenant_isolation_override_requests" ON "compliance"."override_requests"
    USING (tenant_id::text = current_setting('app.tenant_id', true));

CREATE POLICY "tenant_isolation_alert_history" ON "compliance"."alert_history"
    USING (tenant_id::text = current_setting('app.tenant_id', true));

CREATE POLICY "tenant_isolation_audit_log" ON "compliance"."audit_log"
    USING (tenant_id::text = current_setting('app.tenant_id', true));

