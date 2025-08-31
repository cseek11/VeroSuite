# ============================================================================
# DATABASE MIGRATION SCRIPT
# ============================================================================
# Executes the phone normalization migration

Write-Host "🔧 Running Database Migration..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "scripts/add-phone-normalization.sql")) {
    Write-Host "Error: add-phone-normalization.sql not found. Please run this from the frontend directory." -ForegroundColor Red
    exit 1
}

# Read the SQL script
$sqlScript = Get-Content "scripts/add-phone-normalization.sql" -Raw

Write-Host "📋 SQL Migration Script:" -ForegroundColor Cyan
Write-Host $sqlScript -ForegroundColor Gray
Write-Host ""

Write-Host "⚠️  IMPORTANT: This migration needs to be executed in your Supabase database." -ForegroundColor Yellow
Write-Host ""
Write-Host "You have several options to run this migration:" -ForegroundColor White
Write-Host ""
Write-Host "1. Supabase Dashboard (Recommended):" -ForegroundColor Green
Write-Host "   - Go to https://supabase.com/dashboard"
Write-Host "   - Select your project: iehzwglvmbtrlhdgofew"
Write-Host "   - Go to SQL Editor"
Write-Host "   - Copy and paste the SQL script above"
Write-Host "   - Click 'Run'"
Write-Host ""
Write-Host "2. Supabase CLI (if installed):" -ForegroundColor Green
Write-Host "   - Install Supabase CLI: npm install -g supabase"
Write-Host "   - Run: supabase db push --db-url 'your-connection-string'"
Write-Host ""
Write-Host "3. Direct Database Connection:" -ForegroundColor Green
Write-Host "   - Use a PostgreSQL client (pgAdmin, DBeaver, etc.)"
Write-Host "   - Connect to your Supabase database"
Write-Host "   - Execute the SQL script"
Write-Host ""

Write-Host "🔍 Migration Summary:" -ForegroundColor Cyan
Write-Host "   - Adds phone_digits column for normalized phone numbers"
Write-Host "   - Creates normalization function and trigger"
Write-Host "   - Adds performance indexes for search"
Write-Host "   - Updates existing phone data"
Write-Host ""

Write-Host "📋 SQL script content:" -ForegroundColor Cyan
Write-Host $sqlScript -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Please copy the SQL script above and execute it in your Supabase Dashboard." -ForegroundColor Green

Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Execute the migration in Supabase Dashboard"
Write-Host "2. Run the search performance test: node scripts/test-search-performance.js"
Write-Host "3. Test the search functionality in the application"
Write-Host ""

Write-Host "✅ Migration script ready!" -ForegroundColor Green
