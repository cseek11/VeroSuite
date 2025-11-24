# Apply write_queue migration manually
# Run this script if Prisma migrate deploy fails

param(
    [string]$DatabaseUrl = $env:DATABASE_URL
)

if (-not $DatabaseUrl) {
    Write-Host "Error: DATABASE_URL not set" -ForegroundColor Red
    Write-Host "Set it with: `$env:DATABASE_URL = 'postgresql://...'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Applying write_queue migration..." -ForegroundColor Cyan

$sql = @"
-- CreateTable: write_queue
CREATE TABLE IF NOT EXISTS compliance.write_queue (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    job_type VARCHAR(50) NOT NULL,
    job_data JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMPTZ(6),
    error_message TEXT,
    CONSTRAINT write_queue_pkey PRIMARY KEY (id)
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS idx_write_queue_status ON compliance.write_queue(status, created_at);

-- Enable RLS
ALTER TABLE compliance.write_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Service role can access all (queue is internal)
DROP POLICY IF EXISTS write_queue_service_access ON compliance.write_queue;
CREATE POLICY write_queue_service_access ON compliance.write_queue
    FOR ALL
    USING (true)
    WITH CHECK (true);
"@

# Try to use psql if available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue
if ($psqlPath) {
    Write-Host "Using psql to apply migration..." -ForegroundColor Green
    $sql | psql $DatabaseUrl
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Migration applied successfully!" -ForegroundColor Green
    } else {
        Write-Host "Migration failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "psql not found. Please run the SQL manually:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host $sql
    Write-Host ""
    Write-Host "Or install PostgreSQL client tools and run:" -ForegroundColor Yellow
    Write-Host "  psql DATABASE_URL -f migration.sql" -ForegroundColor Cyan
}
