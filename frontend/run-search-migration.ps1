# ============================================================================
# SEARCH LOGGING MIGRATION SCRIPT
# ============================================================================
# Guides the user through running the search logging migration

Write-Host "🚀 VeroSuite Search Logging Migration" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will help you run the search logging migration to enable" -ForegroundColor Yellow
Write-Host "AI-enhanced search functionality with analytics and relevance ranking." -ForegroundColor Yellow
Write-Host ""

Write-Host "📋 What this migration will add:" -ForegroundColor Green
Write-Host "   ✅ search_logs table - Stores all search queries and results" -ForegroundColor White
Write-Host "   ✅ search_corrections table - Stores search corrections and synonyms" -ForegroundColor White
Write-Host "   ✅ log_search() function - Logs search queries with metadata" -ForegroundColor White
Write-Host "   ✅ get_search_analytics() function - Provides search analytics" -ForegroundColor White
Write-Host "   ✅ Initial synonym mappings (st → street, ave → avenue, etc.)" -ForegroundColor White
Write-Host "   ✅ Row Level Security (RLS) policies for data protection" -ForegroundColor White
Write-Host ""

Write-Host "🔧 To run this migration:" -ForegroundColor Yellow
Write-Host "   1. Open your Supabase dashboard" -ForegroundColor White
Write-Host "   2. Go to the SQL Editor" -ForegroundColor White
Write-Host "   3. Copy the SQL from the file: scripts/add-search-logging.sql" -ForegroundColor White
Write-Host "   4. Paste and execute the SQL" -ForegroundColor White
Write-Host ""

Write-Host "📄 SQL File Location:" -ForegroundColor Cyan
Write-Host "   frontend/scripts/add-search-logging.sql" -ForegroundColor White
Write-Host ""

Write-Host "Would you like to view the SQL content now? (y/n)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host ""
    Write-Host "📄 SQL Migration Content:" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    Write-Host ""
    
    if (Test-Path "scripts/add-search-logging.sql") {
        Get-Content "scripts/add-search-logging.sql" | Write-Host
    } else {
        Write-Host "❌ SQL file not found at scripts/add-search-logging.sql" -ForegroundColor Red
        Write-Host "Please check the file path and try again." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ After running the migration, you can test it with:" -ForegroundColor Green
Write-Host "   node scripts/test-enhanced-search.js" -ForegroundColor White
Write-Host ""

Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Run the SQL migration in Supabase" -ForegroundColor White
Write-Host "   2. Test the enhanced search functionality" -ForegroundColor White
Write-Host "   3. Start using the new search service in the application" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")










