-- CreateTable: Technician Profiles
CREATE TABLE "technician_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "employee_id" VARCHAR(20),
    "hire_date" DATE NOT NULL,
    "position" VARCHAR(100),
    "department" VARCHAR(100),
    "employment_type" VARCHAR(20) NOT NULL DEFAULT 'full_time',
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "emergency_contact_name" VARCHAR(100),
    "emergency_contact_phone" VARCHAR(20),
    "emergency_contact_relationship" VARCHAR(50),
    "address_line1" VARCHAR(255),
    "address_line2" VARCHAR(255),
    "city" VARCHAR(100),
    "state" VARCHAR(20),
    "postal_code" VARCHAR(20),
    "country" VARCHAR(10) NOT NULL DEFAULT 'US',
    "date_of_birth" DATE,
    "social_security_number" VARCHAR(11),
    "driver_license_number" VARCHAR(50),
    "driver_license_state" VARCHAR(20),
    "driver_license_expiry" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technician_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Payroll Information
CREATE TABLE "technician_payroll" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "technician_id" UUID NOT NULL,
    "employment_type" VARCHAR(20) NOT NULL DEFAULT 'hourly',
    "pay_rate" DECIMAL(10,2),
    "overtime_rate" DECIMAL(10,2),
    "benefits_enrolled" JSONB,
    "direct_deposit_info" JSONB,
    "tax_withholding" JSONB,
    "start_date" DATE,
    "end_date" DATE,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technician_payroll_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Document Management
CREATE TABLE "technician_documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "technician_id" UUID NOT NULL,
    "document_type" VARCHAR(50) NOT NULL,
    "document_name" VARCHAR(255) NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "file_size" INTEGER,
    "mime_type" VARCHAR(100),
    "expiration_date" DATE,
    "upload_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by" UUID,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_by" UUID,
    "verified_at" TIMESTAMPTZ(6),
    "notes" TEXT,

    CONSTRAINT "technician_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Performance Metrics
CREATE TABLE "technician_performance" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "technician_id" UUID NOT NULL,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "jobs_completed" INTEGER NOT NULL DEFAULT 0,
    "jobs_cancelled" INTEGER NOT NULL DEFAULT 0,
    "total_revenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "average_rating" DECIMAL(3,2),
    "customer_feedback_count" INTEGER NOT NULL DEFAULT 0,
    "on_time_percentage" DECIMAL(5,2),
    "completion_rate" DECIMAL(5,2),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "technician_performance_pkey" PRIMARY KEY ("id")
);

-- Add technician-specific fields to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "technician_number" VARCHAR(20);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "pesticide_license_number" VARCHAR(50);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "license_expiration_date" DATE;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "hire_date" DATE;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "position" VARCHAR(100);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "department" VARCHAR(100);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "employment_type" VARCHAR(20) DEFAULT 'full_time';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "emergency_contact_name" VARCHAR(100);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "emergency_contact_phone" VARCHAR(20);

-- CreateIndex: Unique constraints
CREATE UNIQUE INDEX "technician_profiles_tenant_id_user_id_key" ON "technician_profiles"("tenant_id", "user_id");
CREATE UNIQUE INDEX "technician_profiles_employee_id_key" ON "technician_profiles"("employee_id") WHERE "employee_id" IS NOT NULL;
CREATE UNIQUE INDEX "technician_payroll_tenant_id_technician_id_key" ON "technician_payroll"("tenant_id", "technician_id");
CREATE UNIQUE INDEX "technician_performance_tenant_id_technician_id_period_start_period_end_key" ON "technician_performance"("tenant_id", "technician_id", "period_start", "period_end");

-- CreateIndex: Performance indexes
CREATE INDEX "technician_profiles_tenant_id_status_idx" ON "technician_profiles"("tenant_id", "status");
CREATE INDEX "technician_profiles_tenant_id_department_idx" ON "technician_profiles"("tenant_id", "department");
CREATE INDEX "technician_profiles_tenant_id_position_idx" ON "technician_profiles"("tenant_id", "position");
CREATE INDEX "technician_documents_tenant_id_technician_id_idx" ON "technician_documents"("tenant_id", "technician_id");
CREATE INDEX "technician_documents_tenant_id_document_type_idx" ON "technician_documents"("tenant_id", "document_type");
CREATE INDEX "technician_documents_expiration_date_idx" ON "technician_documents"("expiration_date");
CREATE INDEX "technician_performance_tenant_id_technician_id_idx" ON "technician_performance"("tenant_id", "technician_id");
CREATE INDEX "technician_performance_period_start_period_end_idx" ON "technician_performance"("period_start", "period_end");

-- AddForeignKey: Technician Profiles
ALTER TABLE "technician_profiles" ADD CONSTRAINT "technician_profiles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "technician_profiles" ADD CONSTRAINT "technician_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: Payroll
ALTER TABLE "technician_payroll" ADD CONSTRAINT "technician_payroll_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "technician_payroll" ADD CONSTRAINT "technician_payroll_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: Documents
ALTER TABLE "technician_documents" ADD CONSTRAINT "technician_documents_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "technician_documents" ADD CONSTRAINT "technician_documents_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "technician_documents" ADD CONSTRAINT "technician_documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "technician_documents" ADD CONSTRAINT "technician_documents_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: Performance
ALTER TABLE "technician_performance" ADD CONSTRAINT "technician_performance_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "technician_performance" ADD CONSTRAINT "technician_performance_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable Row Level Security
ALTER TABLE "technician_profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "technician_payroll" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "technician_documents" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "technician_performance" ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Technician Profiles
CREATE POLICY "technician_profiles_tenant_isolation" ON "technician_profiles"
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Create RLS Policies for Payroll
CREATE POLICY "technician_payroll_tenant_isolation" ON "technician_payroll"
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Create RLS Policies for Documents
CREATE POLICY "technician_documents_tenant_isolation" ON "technician_documents"
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Create RLS Policies for Performance
CREATE POLICY "technician_performance_tenant_isolation" ON "technician_performance"
    FOR ALL USING (tenant_id = current_setting('app.current_tenant_id')::uuid);

-- Add check constraints for data validation
ALTER TABLE "technician_profiles" ADD CONSTRAINT "technician_profiles_employment_type_check" CHECK (employment_type IN ('full_time', 'part_time', 'contractor', 'temporary'));
ALTER TABLE "technician_profiles" ADD CONSTRAINT "technician_profiles_status_check" CHECK (status IN ('active', 'inactive', 'terminated', 'on_leave'));

ALTER TABLE "technician_payroll" ADD CONSTRAINT "technician_payroll_employment_type_check" CHECK (employment_type IN ('hourly', 'salary', 'commission', 'contract'));

ALTER TABLE "technician_documents" ADD CONSTRAINT "technician_documents_document_type_check" CHECK (document_type IN ('license', 'certification', 'insurance', 'training', 'background_check', 'drug_test', 'safety_training', 'other'));

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_technician_profiles_updated_at BEFORE UPDATE ON technician_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technician_payroll_updated_at BEFORE UPDATE ON technician_payroll FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
 down  the situatio