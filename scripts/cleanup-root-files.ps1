# Root Directory Cleanup Script
# Removes or archives non-essential files from project root
# Date: 2025-11-16

param(
    [switch]$DryRun = $false,
    [switch]$DeleteSnippets = $true,
    [switch]$DeleteOldNaming = $true,
    [switch]$ArchiveHistorical = $true,
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Stop"

Write-Host "Root Directory Cleanup Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN MODE - No files will be moved or deleted" -ForegroundColor Yellow
    Write-Host ""
}

# Define files to process
$filesToDelete = @()
$filesToArchive = @()

# Small snippet files (outdated, not referenced)
if ($DeleteSnippets) {
    $filesToDelete += @(
        @{ Name = "Database Schema.txt"; Reason = "Outdated snippet, info in docs/reference/DATABASE.md" }
        @{ Name = "Tenant Middleware.txt"; Reason = "Outdated snippet, code in backend/src/common/middleware/" }
    )
}

# Files with old "VeroSuite" naming (violate naming-consistency rules)
if ($DeleteOldNaming) {
    $filesToDelete += @(
        @{ Name = "Development Plan VeroSuite.txt"; Reason = "Contains 'VeroSuite' in filename - violates naming-consistency rules" }
        @{ Name = "VeroSuite_Deployment_Plan.docx"; Reason = "Contains 'VeroSuite' in filename - violates naming-consistency rules" }
    )
}

# Historical planning documents (archive if keeping, or delete)
if ($ArchiveHistorical) {
    $filesToArchive += @(
        @{ Name = "Development Plan VeroField.txt"; Target = "docs/archive/planning/Development Plan VeroField.txt"; Reason = "Historical planning document" }
        @{ Name = "Pest Control CRM.docx"; Target = "docs/archive/misc/Pest Control CRM.docx"; Reason = "Historical planning document" }
    )
}

# Process deletions
if ($filesToDelete.Count -gt 0) {
    Write-Host "Files to DELETE:" -ForegroundColor Red
    Write-Host ""
    
    foreach ($file in $filesToDelete) {
        $filePath = Join-Path "." $file.Name
        
        if (Test-Path $filePath) {
            if ($DryRun) {
                Write-Host "  [WOULD DELETE] $($file.Name)" -ForegroundColor Gray
                Write-Host "    Reason: $($file.Reason)" -ForegroundColor DarkGray
            } else {
                try {
                    Remove-Item -Path $filePath -Force
                    Write-Host "  [DELETED] $($file.Name)" -ForegroundColor Green
                    if ($Verbose) {
                        Write-Host "    Reason: $($file.Reason)" -ForegroundColor DarkGray
                    }
                } catch {
                    Write-Host "  [FAILED] $($file.Name): $_" -ForegroundColor Red
                }
            }
        } else {
            Write-Host "  [NOT FOUND] $($file.Name)" -ForegroundColor Yellow
        }
    }
    Write-Host ""
}

# Process archives
if ($filesToArchive.Count -gt 0) {
    Write-Host "Files to ARCHIVE:" -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($file in $filesToArchive) {
        $sourcePath = Join-Path "." $file.Name
        $targetPath = $file.Target
        
        if (Test-Path $sourcePath) {
            # Ensure target directory exists
            $targetDir = Split-Path $targetPath -Parent
            if (-not (Test-Path $targetDir)) {
                if (-not $DryRun) {
                    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                }
                if ($Verbose) {
                    Write-Host "  Created directory: $targetDir" -ForegroundColor Green
                }
            }
            
            # Check if target already exists
            if (Test-Path $targetPath) {
                Write-Host "  [SKIP] $($file.Name) -> Target exists: $targetPath" -ForegroundColor Yellow
            } else {
                if ($DryRun) {
                    Write-Host "  [WOULD MOVE] $($file.Name) -> $targetPath" -ForegroundColor Gray
                    Write-Host "    Reason: $($file.Reason)" -ForegroundColor DarkGray
                } else {
                    try {
                        Move-Item -Path $sourcePath -Destination $targetPath -Force
                        Write-Host "  [ARCHIVED] $($file.Name) -> $targetPath" -ForegroundColor Green
                        if ($Verbose) {
                            Write-Host "    Reason: $($file.Reason)" -ForegroundColor DarkGray
                        }
                    } catch {
                        Write-Host "  [FAILED] $($file.Name): $_" -ForegroundColor Red
                    }
                }
            }
        } else {
            Write-Host "  [NOT FOUND] $($file.Name)" -ForegroundColor Yellow
        }
    }
    Write-Host ""
}

# Summary
$totalToDelete = $filesToDelete.Count
$totalToArchive = $filesToArchive.Count

Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Files to delete: $totalToDelete" -ForegroundColor $(if ($totalToDelete -gt 0) { "Red" } else { "Gray" })
Write-Host "  Files to archive: $totalToArchive" -ForegroundColor $(if ($totalToArchive -gt 0) { "Yellow" } else { "Gray" })
Write-Host ""

if ($DryRun) {
    Write-Host "Run without -DryRun to execute cleanup." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "  -DeleteSnippets:`$false    # Keep small snippet files" -ForegroundColor Gray
    Write-Host "  -DeleteOldNaming:`$false   # Keep files with VeroSuite naming" -ForegroundColor Gray
    Write-Host "  -ArchiveHistorical:`$false # Delete historical docs instead of archiving" -ForegroundColor Gray
} else {
    Write-Host "Cleanup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Remaining files in root:" -ForegroundColor Cyan
    $remaining = Get-ChildItem -Path "." -File | Where-Object { 
        $_.Extension -eq ".md" -or 
        $_.Extension -eq ".txt" -or 
        $_.Extension -eq ".docx" -or
        $_.Extension -eq ".doc"
    }
    
    if ($remaining.Count -eq 0 -or ($remaining.Count -eq 1 -and $remaining[0].Name -eq "README.md")) {
        Write-Host "  [OK] Only README.md remains (as required)" -ForegroundColor Green
    } else {
        foreach ($file in $remaining) {
            Write-Host "  - $($file.Name)" -ForegroundColor Yellow
        }
    }
}

