-- CreateTable
CREATE TABLE "tenant" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "domain" VARCHAR(100),
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "subscription_tier" VARCHAR(20) NOT NULL DEFAULT 'basic',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "roles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "account_type" VARCHAR(20) NOT NULL DEFAULT 'commercial',
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "phone" VARCHAR(20),
    "email" VARCHAR(255),
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(20),
    "zip_code" VARCHAR(20),
    "billing_address" JSONB,
    "payment_method" VARCHAR(50),
    "billing_cycle" VARCHAR(20),
    "property_type" VARCHAR(50),
    "property_size" VARCHAR(50),
    "access_instructions" TEXT,
    "emergency_contact" VARCHAR(100),
    "preferred_contact_method" VARCHAR(20),
    "ar_balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "address_line1" VARCHAR(255) NOT NULL,
    "address_line2" VARCHAR(255),
    "city" VARCHAR(100) NOT NULL,
    "state" VARCHAR(20) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "country" VARCHAR(10) NOT NULL DEFAULT 'US',
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "service_area_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_orders" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "service_type" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "recurrence_rule" VARCHAR(255),
    "estimated_duration" INTEGER NOT NULL DEFAULT 60,
    "service_price" DECIMAL(8,2) NOT NULL,
    "special_instructions" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "work_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "work_order_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "location_id" UUID NOT NULL,
    "technician_id" UUID,
    "status" VARCHAR(20) NOT NULL DEFAULT 'unassigned',
    "priority" VARCHAR(20) NOT NULL DEFAULT 'medium',
    "scheduled_date" DATE NOT NULL,
    "scheduled_start_time" VARCHAR(8),
    "scheduled_end_time" VARCHAR(8),
    "actual_start_time" TIMESTAMPTZ(6),
    "actual_end_time" TIMESTAMPTZ(6),
    "completion_notes" TEXT,
    "customer_signature" VARCHAR(500),
    "photos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "chemicals_used" JSONB[] DEFAULT ARRAY[]::JSONB[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_history" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "service_date" DATE NOT NULL,
    "service_type" VARCHAR(100) NOT NULL,
    "treatments_applied" TEXT,
    "technician_id" UUID,
    "technician_notes" TEXT,
    "before_photos" JSONB,
    "after_photos" JSONB,
    "cost" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'completed',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts_subscriptions" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "contract_type" VARCHAR(50) NOT NULL,
    "service_frequency" VARCHAR(50) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "auto_renewal" BOOLEAN NOT NULL DEFAULT true,
    "contract_value" DECIMAL(10,2) NOT NULL,
    "payment_schedule" VARCHAR(50),
    "terms_conditions" TEXT,
    "signed_date" DATE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contracts_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communication_logs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "communication_type" VARCHAR(50) NOT NULL,
    "direction" VARCHAR(20) NOT NULL,
    "subject" VARCHAR(255),
    "message_content" TEXT,
    "staff_member" VARCHAR(100),
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "follow_up_required" BOOLEAN NOT NULL DEFAULT false,
    "follow_up_date" DATE,

    CONSTRAINT "communication_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_notes" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "note_type" VARCHAR(50) NOT NULL,
    "note_source" VARCHAR(50) NOT NULL,
    "note_content" TEXT NOT NULL,
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "priority" VARCHAR(20) NOT NULL DEFAULT 'low',
    "is_alert" BOOLEAN NOT NULL DEFAULT false,
    "is_internal" BOOLEAN NOT NULL DEFAULT false,
    "technician_id" UUID,
    "work_order_id" UUID,
    "location_coords" VARCHAR(100),

    CONSTRAINT "customer_notes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pest_activity_tracking" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "pest_type" VARCHAR(100) NOT NULL,
    "severity_level" INTEGER NOT NULL,
    "location_on_property" VARCHAR(255),
    "weather_conditions" VARCHAR(100),
    "temperature" DECIMAL(5,2),
    "humidity" DECIMAL(5,2),
    "season" VARCHAR(20),
    "treatment_applied" VARCHAR(255),
    "effectiveness_score" INTEGER,
    "recorded_by" VARCHAR(100),
    "recorded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gps_coordinates" VARCHAR(100),
    "photo_evidence_ids" JSONB,

    CONSTRAINT "pest_activity_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_tracking" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "compliance_type" VARCHAR(50) NOT NULL,
    "requirement" VARCHAR(255) NOT NULL,
    "due_date" DATE NOT NULL,
    "completion_date" DATE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "assigned_to" VARCHAR(100),
    "notes" TEXT,
    "documentation_url" VARCHAR(500),

    CONSTRAINT "compliance_tracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technician_certifications" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "technician_id" UUID NOT NULL,
    "certification_type" VARCHAR(100) NOT NULL,
    "issuing_authority" VARCHAR(100) NOT NULL,
    "issue_date" DATE NOT NULL,
    "expiration_date" DATE NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "renewal_reminder_sent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technician_certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chemical_usage_log" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "service_id" UUID,
    "chemical_name" VARCHAR(255) NOT NULL,
    "epa_number" VARCHAR(50),
    "application_rate" DECIMAL(8,4),
    "total_amount_used" DECIMAL(8,4),
    "application_method" VARCHAR(100),
    "target_pest" VARCHAR(100),
    "technician_id" UUID,
    "application_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weather_conditions" VARCHAR(100),
    "safety_precautions" TEXT,

    CONSTRAINT "chemical_usage_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_photos" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "photo_type" VARCHAR(50) NOT NULL,
    "photo_category" VARCHAR(50) NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "thumbnail_url" VARCHAR(500),
    "file_size" INTEGER,
    "taken_by" VARCHAR(100),
    "taken_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "work_order_id" UUID,
    "location_coords" VARCHAR(100),
    "description" TEXT,
    "is_before_photo" BOOLEAN NOT NULL DEFAULT false,
    "is_customer_facing" BOOLEAN NOT NULL DEFAULT true,
    "pest_type" VARCHAR(100),
    "treatment_area" VARCHAR(255),

    CONSTRAINT "customer_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_analytics" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "metric_type" VARCHAR(50) NOT NULL,
    "metric_value" DECIMAL(10,4) NOT NULL,
    "calculated_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "factors" JSONB,
    "prediction_confidence" DECIMAL(5,4),
    "next_review_date" DATE,

    CONSTRAINT "business_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_documents" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "document_type" VARCHAR(50) NOT NULL,
    "document_name" VARCHAR(255) NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "file_size" INTEGER,
    "mime_type" VARCHAR(100),
    "uploaded_by" VARCHAR(100),
    "uploaded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "document_date" DATE,

    CONSTRAINT "customer_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_branding" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "theme_json" JSONB NOT NULL DEFAULT '{}',
    "logo_url" VARCHAR(500),
    "version" VARCHAR(20) NOT NULL DEFAULT '1.0.0',
    "status" VARCHAR(20) NOT NULL DEFAULT 'published',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tenant_branding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "user_id" UUID,
    "action" VARCHAR(50) NOT NULL,
    "resource_type" VARCHAR(50) NOT NULL,
    "resource_id" UUID,
    "before_state" JSONB,
    "after_state" JSONB,
    "request_id" UUID NOT NULL,
    "ip_address" INET,
    "user_agent" TEXT,
    "timestamp" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_domain_key" ON "tenant"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_tenant_id_id_key" ON "accounts"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_tenant_id_id_key" ON "locations"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "work_orders_tenant_id_id_key" ON "work_orders"("tenant_id", "id");

-- CreateIndex
CREATE INDEX "jobs_tenant_id_technician_id_scheduled_date_idx" ON "jobs"("tenant_id", "technician_id", "scheduled_date");

-- CreateIndex
CREATE INDEX "jobs_tenant_id_account_id_idx" ON "jobs"("tenant_id", "account_id");

-- CreateIndex
CREATE INDEX "jobs_tenant_id_status_scheduled_date_idx" ON "jobs"("tenant_id", "status", "scheduled_date");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_tenant_id_id_key" ON "jobs"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "service_history_tenant_id_id_key" ON "service_history"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_subscriptions_tenant_id_id_key" ON "contracts_subscriptions"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "communication_logs_tenant_id_id_key" ON "communication_logs"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_notes_tenant_id_id_key" ON "customer_notes"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "pest_activity_tracking_tenant_id_id_key" ON "pest_activity_tracking"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_tracking_tenant_id_id_key" ON "compliance_tracking"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "technician_certifications_tenant_id_id_key" ON "technician_certifications"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "chemical_usage_log_tenant_id_id_key" ON "chemical_usage_log"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_photos_tenant_id_id_key" ON "customer_photos"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "business_analytics_tenant_id_id_key" ON "business_analytics"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_documents_tenant_id_id_key" ON "customer_documents"("tenant_id", "id");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_branding_tenant_id_key" ON "tenant_branding"("tenant_id");

-- CreateIndex
CREATE INDEX "audit_logs_tenant_id_timestamp_idx" ON "audit_logs"("tenant_id", "timestamp" DESC);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_tenant_id_account_id_fkey" FOREIGN KEY ("tenant_id", "account_id") REFERENCES "accounts"("tenant_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_tenant_id_account_id_fkey" FOREIGN KEY ("tenant_id", "account_id") REFERENCES "accounts"("tenant_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_orders" ADD CONSTRAINT "work_orders_tenant_id_location_id_fkey" FOREIGN KEY ("tenant_id", "location_id") REFERENCES "locations"("tenant_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_tenant_id_work_order_id_fkey" FOREIGN KEY ("tenant_id", "work_order_id") REFERENCES "work_orders"("tenant_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_tenant_id_account_id_fkey" FOREIGN KEY ("tenant_id", "account_id") REFERENCES "accounts"("tenant_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_tenant_id_location_id_fkey" FOREIGN KEY ("tenant_id", "location_id") REFERENCES "locations"("tenant_id", "id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_history" ADD CONSTRAINT "service_history_tenant_id_customer_id_fkey" FOREIGN KEY ("tenant_id", "customer_id") REFERENCES "accounts"("tenant_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts_subscriptions" ADD CONSTRAINT "contracts_subscriptions_tenant_id_customer_id_fkey" FOREIGN KEY ("tenant_id", "customer_id") REFERENCES "accounts"("tenant_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communication_logs" ADD CONSTRAINT "communication_logs_tenant_id_customer_id_fkey" FOREIGN KEY ("tenant_id", "customer_id") REFERENCES "accounts"("tenant_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_notes" ADD CONSTRAINT "customer_notes_tenant_id_customer_id_fkey" FOREIGN KEY ("tenant_id", "customer_id") REFERENCES "accounts"("tenant_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pest_activity_tracking" ADD CONSTRAINT "pest_activity_tracking_tenant_id_customer_id_fkey" FOREIGN KEY ("tenant_id", "customer_id") REFERENCES "accounts"("tenant_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_tracking" ADD CONSTRAINT "compliance_tracking_tenant_id_customer_id_fkey" FOREIGN KEY ("tenant_id", "customer_id") REFERENCES "accounts"("tenant_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chemical_usage_log" ADD CONSTRAINT "chemical_usage_log_tenant_id_customer_id_fkey" FOREIGN KEY ("tenant_id", "customer_id") REFERENCES "accounts"("tenant_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_photos" ADD CONSTRAINT "customer_photos_tenant_id_customer_id_fkey" FOREIGN KEY ("tenant_id", "customer_id") REFERENCES "accounts"("tenant_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_analytics" ADD CONSTRAINT "business_analytics_tenant_id_customer_id_fkey" FOREIGN KEY ("tenant_id", "customer_id") REFERENCES "accounts"("tenant_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_documents" ADD CONSTRAINT "customer_documents_tenant_id_customer_id_fkey" FOREIGN KEY ("tenant_id", "customer_id") REFERENCES "accounts"("tenant_id", "id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_branding" ADD CONSTRAINT "tenant_branding_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
