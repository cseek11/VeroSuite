# Remove Duplicate Documentation Files from Root
# Removes markdown files from root that already exist in docs/ structure
# Date: 2025-11-16

param(
    [switch]$DryRun = $false,
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Stop"

Write-Host "Duplicate Documentation Cleanup Script" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN MODE - No files will be deleted" -ForegroundColor Yellow
    Write-Host ""
}

# Get all markdown files in root (except README.md)
$rootFiles = Get-ChildItem -Path "." -Filter "*.md" -File | Where-Object { $_.Name -ne "README.md" }

$duplicates = @()
$toKeep = @()

foreach ($file in $rootFiles) {
    $fileName = $file.Name
    
    # Check if file exists in docs/ structure
    $foundInDocs = Get-ChildItem -Path "docs" -Filter $fileName -Recurse -File -ErrorAction SilentlyContinue
    
    if ($foundInDocs) {
        $duplicates += @{
            File = $file
            RootPath = $file.FullName
            DocsPath = $foundInDocs[0].FullName
        }
    } else {
        $toKeep += $file
    }
}

if ($duplicates.Count -eq 0) {
    Write-Host "No duplicate files found!" -ForegroundColor Green
    Write-Host ""
    exit 0
}

Write-Host "Duplicate files found (exist in both root and docs/):" -ForegroundColor Yellow
Write-Host ""

foreach ($dup in $duplicates) {
    $relativeDocsPath = $dup.DocsPath.Replace((Get-Location).Path + '\', '')
    
    if ($DryRun) {
        Write-Host "  [WOULD DELETE] $($dup.File.Name)" -ForegroundColor Gray
        Write-Host "    Exists in: $relativeDocsPath" -ForegroundColor DarkGray
    } else {
        try {
            Remove-Item -Path $dup.RootPath -Force
            Write-Host "  [DELETED] $($dup.File.Name)" -ForegroundColor Green
            if ($Verbose) {
                Write-Host "    Exists in: $relativeDocsPath" -ForegroundColor DarkGray
            }
        } catch {
            Write-Host "  [FAILED] $($dup.File.Name): $_" -ForegroundColor Red
        }
    }
}

Write-Host ""

if ($toKeep.Count -gt 0) {
    Write-Host "Files to keep in root (not found in docs/):" -ForegroundColor Cyan
    foreach ($file in $toKeep) {
        Write-Host "  - $($file.Name)" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Duplicates found: $($duplicates.Count)" -ForegroundColor $(if ($duplicates.Count -gt 0) { "Yellow" } else { "Green" })
Write-Host "  Files to keep: $($toKeep.Count)" -ForegroundColor White
Write-Host ""

if ($DryRun) {
    Write-Host "Run without -DryRun to delete duplicate files." -ForegroundColor Yellow
} else {
    Write-Host "Cleanup complete!" -ForegroundColor Green
    Write-Host ""
    
    # Check final status
    $remaining = Get-ChildItem -Path "." -Filter "*.md" -File | Where-Object { $_.Name -ne "README.md" }
    if ($remaining.Count -eq 0) {
        Write-Host "[OK] Root directory clean! Only README.md remains." -ForegroundColor Green
    } else {
        Write-Host "Remaining markdown files in root:" -ForegroundColor Yellow
        foreach ($file in $remaining) {
            Write-Host "  - $($file.Name)" -ForegroundColor Gray
        }
    }
}

