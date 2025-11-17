# File Organization Validation Script
# Validates file organization compliance for CI/CD
# Date: 2025-11-16

param(
    [switch]$Verbose = $false,
    [switch]$ExitOnError = $true
)

$ErrorActionPreference = "Stop"

$violations = @()
$warnings = @()

Write-Host "File Organization Validation" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""

# Allowed files in root
$allowedRootFiles = @(
    "README.md",
    "package.json",
    "package-lock.json",
    ".gitignore",
    ".gitattributes",
    "tsconfig.json",
    "nest-cli.json",
    ".cursorrules"
)

# Prohibited file patterns in root
$prohibitedRootPatterns = @(
    "*.md",
    "*.txt",
    "*.docx",
    "*.doc",
    "*.pdf",
    "*.sql",
    "*.png",
    "*.jpg",
    "*.mp4",
    "*.mov"
)

# Check root directory
Write-Host "Checking root directory..." -ForegroundColor Yellow
$rootFiles = Get-ChildItem -Path "." -File | Where-Object { $_.Name -notlike ".*" -or $_.Name -eq ".gitignore" -or $_.Name -eq ".gitattributes" }

foreach ($file in $rootFiles) {
    $isAllowed = $false
    foreach ($allowed in $allowedRootFiles) {
        if ($file.Name -eq $allowed) {
            $isAllowed = $true
            break
        }
    }
    
    if (-not $isAllowed) {
        # Check if it matches prohibited patterns
        $isProhibited = $false
        foreach ($pattern in $prohibitedRootPatterns) {
            if ($file.Name -like $pattern) {
                $isProhibited = $true
                break
            }
        }
        
        if ($isProhibited) {
            $violations += [PSCustomObject]@{
                Type = "Error"
                File = $file.FullName
                Issue = "Prohibited file in root directory"
                Rule = ".cursor/rules/file-organization.md - Root Directory Rules"
            }
        } else {
            # Might be a config file, check extension
            if ($file.Extension -in @(".json", ".yml", ".yaml", ".ts", ".js") -and $file.Name -notlike "*.config.*") {
                $warnings += [PSCustomObject]@{
                    Type = "Warning"
                    File = $file.FullName
                    Issue = "Unexpected file in root - verify it should be here"
                    Rule = ".cursor/rules/file-organization.md"
                }
            }
        }
    }
}

# Check for temporary directories that should be archived
Write-Host "Checking temporary directories..." -ForegroundColor Yellow
$tempDirectories = @("CurrentProgress", "DEVELOPER_TICKETS", "Context")
foreach ($tempDir in $tempDirectories) {
    $dirPath = Join-Path "." $tempDir
    if (Test-Path $dirPath) {
        $fileCount = (Get-ChildItem -Path $dirPath -File -Recurse -ErrorAction SilentlyContinue | Measure-Object).Count
        if ($fileCount -gt 0) {
            $warnings += [PSCustomObject]@{
                Type = "Warning"
                File = $dirPath
                Issue = "Temporary directory with $fileCount files - should be archived"
                Rule = ".cursor/rules/file-organization.md - Directory-Specific Rules"
            }
        }
    }
}

# Check for documentation files outside docs/
Write-Host "Checking documentation files..." -ForegroundColor Yellow
$mdFiles = Get-ChildItem -Path "." -Filter "*.md" -Recurse -File -ErrorAction SilentlyContinue | Where-Object {
    $_.FullName -notlike "*node_modules*" -and
    $_.FullName -notlike "*.git*" -and
    $_.FullName -notlike "*docs*" -and
    $_.FullName -notlike "*\.cursor\rules*" -and  # Exclude cursor rules directory
    $_.FullName -notlike "*README.md"
}

foreach ($file in $mdFiles) {
    $relativePath = $file.FullName.Replace((Get-Location).Path + '\', '')
    if ($relativePath -eq "README.md") {
        continue  # README.md is allowed in root
    }
    
    $violations += [PSCustomObject]@{
        Type = "Error"
        File = $file.FullName
        Issue = "Documentation file outside docs/ directory"
        Rule = ".cursor/rules/file-organization.md - Documentation must be in docs/"
    }
}

# Check for test output directories
Write-Host "Checking test outputs..." -ForegroundColor Yellow
$testOutputDirs = @("Test_Results", "coverage")
foreach ($testDir in $testOutputDirs) {
    $testPath = Join-Path "." $testDir
    if (Test-Path $testPath) {
        $fileCount = (Get-ChildItem -Path $testPath -File -Recurse -ErrorAction SilentlyContinue | Measure-Object).Count
        if ($fileCount -gt 0) {
            # Check if gitignored
            $gitignorePath = Join-Path "." ".gitignore"
            $isGitignored = $false
            if (Test-Path $gitignorePath) {
                $gitignoreContent = Get-Content $gitignorePath -Raw
                if ($gitignoreContent -like "*$testDir*") {
                    $isGitignored = $true
                }
            }
            
            if (-not $isGitignored) {
                $warnings += [PSCustomObject]@{
                    Type = "Warning"
                    File = $testPath
                    Issue = "Test output directory not in .gitignore - should be gitignored"
                    Rule = ".cursor/rules/file-organization.md - Test Output Directories"
                }
            }
        }
    }
}

# Display results
Write-Host ""
Write-Host "Validation Results:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host ""

if ($violations.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "[OK] File organization is compliant!" -ForegroundColor Green
    Write-Host ""
    exit 0
}

# Display violations
if ($violations.Count -gt 0) {
    Write-Host "ERRORS ($($violations.Count)):" -ForegroundColor Red
    Write-Host ""
    foreach ($violation in $violations) {
        $relativePath = $violation.File.Replace((Get-Location).Path + '\', '')
        Write-Host "  [ERROR] $relativePath" -ForegroundColor Red
        Write-Host "    Issue: $($violation.Issue)" -ForegroundColor Yellow
        Write-Host "    Rule: $($violation.Rule)" -ForegroundColor Gray
        if ($Verbose) {
            Write-Host ""
        }
    }
    Write-Host ""
}

# Display warnings
if ($warnings.Count -gt 0) {
    Write-Host "WARNINGS ($($warnings.Count)):" -ForegroundColor Yellow
    Write-Host ""
    foreach ($warning in $warnings) {
        $relativePath = $warning.File.Replace((Get-Location).Path + '\', '')
        Write-Host "  [WARNING] $relativePath" -ForegroundColor Yellow
        Write-Host "    Issue: $($warning.Issue)" -ForegroundColor Gray
        Write-Host "    Rule: $($warning.Rule)" -ForegroundColor Gray
        if ($Verbose) {
            Write-Host ""
        }
    }
    Write-Host ""
}

# Summary
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Errors: $($violations.Count)" -ForegroundColor $(if ($violations.Count -gt 0) { "Red" } else { "Green" })
Write-Host "  Warnings: $($warnings.Count)" -ForegroundColor $(if ($warnings.Count -gt 0) { "Yellow" } else { "Green" })
Write-Host ""

# Recommendations
if ($violations.Count -gt 0 -or $warnings.Count -gt 0) {
    Write-Host "Recommendations:" -ForegroundColor Cyan
    Write-Host "  1. Run scripts/organize-all-files.ps1 to organize files" -ForegroundColor White
    Write-Host "  2. Run scripts/cleanup-temporary-files.ps1 to clean temporary files" -ForegroundColor White
    Write-Host "  3. Update .gitignore for test outputs" -ForegroundColor White
    Write-Host "  4. Review .cursor/rules/file-organization.md for complete rules" -ForegroundColor White
    Write-Host ""
}

# Exit code
if ($violations.Count -gt 0) {
    if ($ExitOnError) {
        Write-Host "Validation FAILED - Fix errors before proceeding" -ForegroundColor Red
        exit 1
    } else {
        Write-Host "Validation completed with errors (non-blocking)" -ForegroundColor Yellow
        exit 0
    }
} else {
    Write-Host "Validation PASSED" -ForegroundColor Green
    if ($warnings.Count -gt 0) {
        Write-Host "  (with warnings - review recommended)" -ForegroundColor Yellow
    }
    exit 0
}

