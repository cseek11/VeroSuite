# Documentation Organization Script
# Categorizes and moves root-level markdown files to appropriate docs/ subdirectories
# Date: 2025-11-16

param(
    [switch]$DryRun = $false,
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Stop"

# Define file categories and their target directories
$categories = @{
    # Core reference files - keep in root (will be handled separately)
    "CoreReference" = @(
        "README.md"
    )
    
    # Essential reference files - move to docs/reference/
    "EssentialReference" = @(
        "API.md",
        "DATABASE.md",
        "COMPONENT_LIBRARY_CATALOG.md",
        "DEVELOPMENT_BEST_PRACTICES.md",
        "AI_CONSISTENCY_PROTOCOL.md",
        "AI_ASSISTANT_BEST_PRACTICES.md",
        "SECURITY_SETUP_GUIDE.md",
        "TENANT_CONTEXT.md",
        "VEROFIELD_ROUTES_REFERENCE.md"
    )
    
    # Guides - move to docs/guides/
    # Note: SECURITY_SETUP_GUIDE.md is excluded - it's in EssentialReference category
    "Guides" = @(
        "*GUIDE.md",
        "*INSTRUCTIONS.md",
        "DEPLOYMENT_INSTRUCTIONS.md",
        "SETUP_INSTRUCTIONS.md",
        "MOBILE_DEVELOPMENT_SETUP_GUIDE.md",
        "ERROR_LOGGING_DEPLOYMENT_GUIDE.md",
        "FRONTEND_INTEGRATION_DEPLOYMENT_GUIDE.md",
        "UNIFIED_SEARCH_SERVICE_DEPLOYMENT_GUIDE.md",
        "API_TROUBLESHOOTING_GUIDE.md",
        "MINIMIZE_DEBUG_GUIDE.md",
        "TECHNICIANS_DROPDOWN_DEBUG_GUIDE.md",
        "WEBHOOK_TESTING_SETUP.md"
    )
    
    # Implementation summaries - move to docs/archive/implementation-summaries/
    "ImplementationSummaries" = @(
        "*IMPLEMENTATION*.md",
        "*_COMPLETE.md",
        "*COMPLETION*.md",
        "AVAILABILITY_MANAGEMENT_IMPLEMENTATION.md",
        "CUSTOMER_DELETE_REDIRECT_IMPLEMENTATION.md",
        "CUSTOMER_SEARCH_STANDARDIZATION_COMPLETE.md",
        "CRM_GLOBAL_SEARCH_DEPLOYMENT_COMPLETE.md",
        "FRONTEND_INTEGRATION_SUMMARY.md",
        "DATABASE_IMPLEMENTATION_SUMMARY.md",
        "GLOBAL_SEARCH_DEPLOYMENT_SUMMARY.md",
        "TECHNICIAN_MANAGEMENT_COMPLETION_REPORT.md",
        "REAL_TIME_UPDATES_IMPLEMENTATION.md",
        "RECURRING_JOBS_IMPLEMENTATION.md",
        "REGION_DASHBOARD_IMPLEMENTATION_SUMMARY.md",
        "WORKFLOW_IMPLEMENTATION_SUMMARY.md",
        "JOBS_CALENDAR_CARD_INTEGRATION_COMPLETE.md",
        "INTEGRATION_COMPLETE.md",
        "IMPLEMENTATION_COMPLETE.md",
        "IMPLEMENTATION_PROGRESS.md",
        "IMPLEMENTATION_STATUS.md",
        "IMPLEMENTATION_SUMMARY.md",
        "PHASE1_IMPLEMENTATION_SUMMARY.md",
        "VEROFIELD_MOBILE_APP_COMPLETE.md"
    )
    
    # Reports - move to docs/archive/reports/
    "Reports" = @(
        "*REPORT.md",
        "*AUDIT*.md",
        "*SUMMARY.md",
        "*ANALYSIS.md",
        "*EVALUATION.md",
        "BILLING_TESTS_VERIFICATION_REPORT.md",
        "CRM_GLOBAL_SEARCH_AUDIT_REPORT.md",
        "COMPREHENSIVE_LEGACY_AUDIT.md",
        "LEGACY_FILES_AUDIT.md",
        "SEARCH_AUDIT_SUMMARY.md",
        "CUSTOMER_SEARCH_STRATEGY_ANALYSIS.md",
        "CARD_SYSTEM_COMPETITIVE_ANALYSIS.md",
        "CARD_SYSTEM_COMPREHENSIVE_EVALUATION.md",
        "CARD_SYSTEM_EVALUATION.md",
        "JOBS_CALENDAR_ANALYSIS.md",
        "JOBS_CALENDAR_COMPETITIVE_ANALYSIS.md",
        "CARD_SYSTEM_SERVICE_BUSINESS_ANALYSIS.md",
        "PROTOCOL_COMPLIANCE_REPORT.md",
        "INCONSISTENCY_SUMMARY.md",
        "PLAN_INCONSISTENCY_REPORT.md",
        "POST_IMPLEMENTATION_AUDIT.md",
        "TEST_EXECUTION_SUMMARY.md",
        "TEST_RESULTS_ANALYSIS.md",
        "TEST_SUMMARY.md",
        "RESPONSE_STRUCTURE_TESTING_SUMMARY.md",
        "V2_ENDPOINT_TESTING_SUMMARY.md",
        "TECHNICIANS_DROPDOWN_FIX_SUMMARY.md",
        "UUID_VALIDATION_FIX_SUMMARY.md",
        "CHAT_SESSION_ACCOMPLISHMENTS.md",
        "CURRENT_PROGRESS.md"
    )
    
    # Planning documents - move to docs/planning/
    "Planning" = @(
        "*PLAN.md",
        "*ROADMAP.md",
        "*REQUIREMENTS.md",
        "DEVELOPMENT_ROADMAP.md",
        "COMPLETE_WORKFLOW_REQUIREMENTS.md",
        "JOBS_CALENDAR_ENTERPRISE_DEVELOPMENT_PLAN.md",
        "MOBILE_APP_DEVELOPMENT_PLAN.md",
        "MOBILE_APP_DETAILED_DEVELOPMENT_PLAN.md",
        "DTO_HARDENING_PLAN.md",
        "SCHEDULE_CALENDAR_REFACTORING_PLAN.md",
        "NEXT_STEPS_IMPLEMENTATION_STATUS.md",
        "NEXT_STEPS_VERIFICATION.md"
    )
    
    # Design documents - move to docs/architecture/
    "Design" = @(
        "*DESIGN.md",
        "*SYSTEM*.md",
        "CARD_INTERACTION_SYSTEM_DESIGN.md",
        "CARD_SYSTEM_DIAGNOSIS.md",
        "CARD_SYSTEM_IMPROVEMENTS_SUMMARY.md",
        "UNIFIED_CARD_SYSTEM_SOLUTION.md",
        "FINAL_GRID_SOLUTION.md",
        "SIMPLE_GRID_SOLUTION.md",
        "FINAL_SOLUTION.md"
    )
    
    # Examples - move to docs/examples/
    "Examples" = @(
        "*EXAMPLES.md",
        "CARD_INTERACTION_EXAMPLES.md"
    )
    
    # Checklists and procedures - move to docs/developer/
    "Checklists" = @(
        "*CHECKLIST.md",
        "*PROCEDURE.md",
        "DEVELOPER_HANDOFF_CHECKLIST.md",
        "PRODUCTION_DEPLOYMENT_CHECKLIST.md",
        "PRODUCTION_READINESS_CHECKLIST.md",
        "QUICK_FIX_CHECKLIST.md",
        "QUICK_START_CHECKLIST.md"
    )
    
    # Handoff and prompts - move to docs/developer/
    "Handoffs" = @(
        "*HANDOFF*.md",
        "*PROMPT.md",
        "AGENT_HANDOFF_PROMPT.md",
        "DEVELOPER_HANDOFF_PROMPT.md",
        "E2E_TEST_RESULTS_PROMPT.md"
    )
    
    # Testing and verification - move to docs/archive/testing/
    "Testing" = @(
        "*TEST*.md",
        "*TESTING*.md",
        "ENTERPRISE_TESTING_FRAMEWORK.md",
        "TEST_EXPANSION_V2_SUPPORT.md"
    )
    
    # Migration notes - move to docs/archive/migrations/
    "Migrations" = @(
        "*MIGRATION*.md",
        "MIGRATION_NOTES_STRIPE_BILLING.md"
    )
    
    # Tickets and deployment - move to docs/archive/deployment/
    "Deployment" = @(
        "*TICKETS.md",
        "DEPLOYMENT_TICKETS.md",
        "TECHNICIAN_MANAGEMENT_TICKETS.md"
    )
    
    # Agreements and setup - move to docs/guides/
    "Setup" = @(
        "AGREEMENT_SETUP.md"
    )
    
    # Remaining files - move to docs/archive/misc/
    "Misc" = @()
}

# Target directories
$targetDirs = @{
    "CoreReference" = "."
    "EssentialReference" = "docs/reference"
    "Guides" = "docs/guides"
    "ImplementationSummaries" = "docs/archive/implementation-summaries"
    "Reports" = "docs/archive/reports"
    "Planning" = "docs/planning"
    "Design" = "docs/architecture"
    "Examples" = "docs/examples"
    "Checklists" = "docs/developer"
    "Handoffs" = "docs/developer"
    "Testing" = "docs/archive/testing"
    "Migrations" = "docs/archive/migrations"
    "Deployment" = "docs/archive/deployment"
    "Setup" = "docs/guides"
    "Misc" = "docs/archive/misc"
}

# Function to match file against patterns
function Test-FilePattern {
    param(
        [string]$FileName,
        [string[]]$Patterns
    )
    
    foreach ($pattern in $Patterns) {
        if ($pattern -like "*`**") {
            $regexPattern = $pattern -replace '\*', '.*'
            if ($FileName -match "^$regexPattern$") {
                return $true
            }
        } elseif ($FileName -eq $pattern) {
            return $true
        }
    }
    return $false
}

# Function to categorize a file
function Get-FileCategory {
    param([string]$FileName)

    # Check EssentialReference first (exact matches take priority)
    if (Test-FilePattern -FileName $FileName -Patterns $categories["EssentialReference"]) {
        return "EssentialReference"
    }

    # Check other categories (skip CoreReference and EssentialReference)
    foreach ($category in $categories.Keys) {
        if ($category -eq "CoreReference" -or $category -eq "EssentialReference") {
            continue  # Skip core reference and essential reference (already checked)
        }

        if (Test-FilePattern -FileName $FileName -Patterns $categories[$category]) {
            return $category
        }
    }

    return "Misc"
}

# Get all markdown files in root
$rootFiles = Get-ChildItem -Path "." -Filter "*.md" -File | Where-Object { $_.Name -ne "README.md" }

Write-Host "Documentation Organization Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN MODE - No files will be moved" -ForegroundColor Yellow
    Write-Host ""
}

$moves = @()
$skipped = @()

foreach ($file in $rootFiles) {
    $category = Get-FileCategory -FileName $file.Name
    $targetDir = $targetDirs[$category]
    
    if ($category -eq "CoreReference") {
        $skipped += [PSCustomObject]@{
            File = $file.Name
            Reason = "Core reference file - keeping in root"
        }
        continue
    }
    
    $targetPath = Join-Path $targetDir $file.Name
    
    # Ensure target directory exists
    if (-not (Test-Path $targetDir)) {
        if (-not $DryRun) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        Write-Host "Created directory: $targetDir" -ForegroundColor Green
    }
    
    # Check if target file already exists
    if (Test-Path $targetPath) {
        $skipped += [PSCustomObject]@{
            File = $file.Name
            Reason = "Target file already exists: $targetPath"
        }
        if ($Verbose) {
            Write-Host "SKIP: $($file.Name) -> Target exists" -ForegroundColor Yellow
        }
        continue
    }
    
    $moves += [PSCustomObject]@{
        File = $file.Name
        Category = $category
        Source = $file.FullName
        Target = $targetPath
    }
    
    if ($Verbose -or $DryRun) {
        Write-Host "$($file.Name) -> $targetPath [$category]" -ForegroundColor $(if ($DryRun) { "Gray" } else { "White" })
    }
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Files to move: $($moves.Count)" -ForegroundColor White
Write-Host "  Files skipped: $($skipped.Count)" -ForegroundColor White
Write-Host ""

if ($skipped.Count -gt 0 -and $Verbose) {
    Write-Host "Skipped files:" -ForegroundColor Yellow
    foreach ($skip in $skipped) {
        Write-Host "  - $($skip.File): $($skip.Reason)" -ForegroundColor Gray
    }
    Write-Host ""
}

if ($moves.Count -eq 0) {
    Write-Host "No files to move." -ForegroundColor Green
    exit 0
}

if (-not $DryRun) {
    Write-Host "Moving files..." -ForegroundColor Cyan
    
    foreach ($move in $moves) {
        try {
            Move-Item -Path $move.Source -Destination $move.Target -Force
            Write-Host "  [OK] $($move.File) -> $($move.Target)" -ForegroundColor Green
        } catch {
            Write-Host "  [FAIL] Failed to move $($move.File): $_" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "Organization complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Review moved files in docs/ subdirectories" -ForegroundColor White
    Write-Host "  2. Update any hardcoded references to moved files" -ForegroundColor White
    Write-Host "  3. Update .cursor/rules/docs.md with new file locations" -ForegroundColor White
} else {
    Write-Host "Run without -DryRun to execute moves." -ForegroundColor Yellow
}

