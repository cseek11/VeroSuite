-- CreateTable: write_queue
-- Purpose: Database-based queue for compliance updates (fallback when Redis unavailable)
-- Last Updated: 2025-11-24

CREATE TABLE IF NOT EXISTS "compliance"."write_queue" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "job_type" VARCHAR(50) NOT NULL,
    "job_data" JSONB NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "max_attempts" INTEGER NOT NULL DEFAULT 3,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMPTZ(6),
    "error_message" TEXT,

    CONSTRAINT "write_queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "idx_write_queue_status" ON "compliance"."write_queue"("status", "created_at");

-- Enable RLS
ALTER TABLE "compliance"."write_queue" ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Service role can access all (queue is internal)
CREATE POLICY "write_queue_service_access" ON "compliance"."write_queue"
    FOR ALL
    USING (true)
    WITH CHECK (true);



