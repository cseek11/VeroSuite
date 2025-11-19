# Temporary File Cleanup Script
# Removes or archives temporary files according to file organization rules
# Date: 2025-11-16

param(
    [switch]$DryRun = $false,
    [switch]$Archive = $true,
    [switch]$DeleteTestOutputs = $false,
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Stop"

Write-Host "Temporary File Cleanup Script" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN MODE - No files will be deleted or moved" -ForegroundColor Yellow
    Write-Host ""
}

# Define temporary file patterns
$temporaryPatterns = @{
    "BackupFiles" = @{
        Patterns = @("*.bak", "*.backup", "*~", "*.tmp", "*.temp")
        Action = "delete"
        Reason = "Backup/temporary files"
    }
    "LogFiles" = @{
        Patterns = @("*.log", "*.log.txt", "*.error.log", "*.debug.log")
        Action = "delete"
        Reason = "Log files (should use structured logging)"
    }
    "OSFiles" = @{
        Patterns = @(".DS_Store", "Thumbs.db", "desktop.ini", "*.swp", "*.swo")
        Action = "delete"
        Reason = "OS-specific files"
    }
    "IDEBackup" = @{
        Patterns = @("*.orig", "*.rej", "*.#*", "*.#")
        Action = "delete"
        Reason = "IDE backup files"
    }
}

# Test output patterns
$testOutputPatterns = @(
    "Test_Results",
    "test-results",
    "test-output",
    "coverage",
    "*.coverage",
    "*.test.log"
)

# Temporary directories to clean
$tempDirectories = @(
    "CurrentProgress",
    "DEVELOPER_TICKETS",
    "Context"
)

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
        } elseif ($FileName -like $pattern -or $FileName -eq $pattern) {
            return $true
        }
    }
    return $false
}

# Collect files to process
$filesToDelete = @()
$filesToArchive = @()
$directoriesToClean = @()

# Find temporary files in root
$rootFiles = Get-ChildItem -Path "." -File -ErrorAction SilentlyContinue
foreach ($file in $rootFiles) {
    foreach ($categoryName in $temporaryPatterns.Keys) {
        $category = $temporaryPatterns[$categoryName]
        if (Test-FilePattern -FileName $file.Name -Patterns $category.Patterns) {
            $filesToDelete += [PSCustomObject]@{
                File = $file
                Category = $categoryName
                Reason = $category.Reason
            }
            break
        }
    }
}

# Find test output files
$testOutputDirs = @("Test_Results", "coverage", "tests")
foreach ($testDir in $testOutputDirs) {
    $testPath = Join-Path "." $testDir
    if (Test-Path $testPath) {
        $testFiles = Get-ChildItem -Path $testPath -File -Recurse -ErrorAction SilentlyContinue
        foreach ($file in $testFiles) {
            $matched = $false
            foreach ($pattern in $testOutputPatterns) {
                if ($file.Name -like "*$pattern*" -or $file.Directory.Name -like "*$pattern*") {
                    $matched = $true
                    break
                }
            }
            if ($matched) {
                if ($DeleteTestOutputs) {
                    $filesToDelete += [PSCustomObject]@{
                        File = $file
                        Category = "TestOutput"
                        Reason = "Test output file"
                    }
                } elseif ($Archive) {
                    $targetPath = Join-Path "docs/archive/test-results" $file.Name
                    $filesToArchive += [PSCustomObject]@{
                        File = $file
                        Target = $targetPath
                        Reason = "Test output - archiving"
                    }
                }
            }
        }
    }
}

# Process temporary directories
foreach ($tempDir in $tempDirectories) {
    $dirPath = Join-Path "." $tempDir
    if (Test-Path $dirPath) {
        $fileCount = (Get-ChildItem -Path $dirPath -File -Recurse -ErrorAction SilentlyContinue | Measure-Object).Count
        if ($fileCount -gt 0) {
            $directoriesToClean += [PSCustomObject]@{
                Directory = $tempDir
                Path = $dirPath
                FileCount = $fileCount
                Reason = "Temporary directory - contents should be archived"
            }
        }
    }
}

# Display summary
Write-Host "Temporary files to delete: $($filesToDelete.Count)" -ForegroundColor $(if ($filesToDelete.Count -gt 0) { "Red" } else { "Green" })
Write-Host "Test outputs to archive: $($filesToArchive.Count)" -ForegroundColor $(if ($filesToArchive.Count -gt 0) { "Yellow" } else { "Green" })
Write-Host "Directories to clean: $($directoriesToClean.Count)" -ForegroundColor $(if ($directoriesToClean.Count -gt 0) { "Yellow" } else { "Green" })
Write-Host ""

if ($filesToDelete.Count -eq 0 -and $filesToArchive.Count -eq 0 -and $directoriesToClean.Count -eq 0) {
    Write-Host "No temporary files found!" -ForegroundColor Green
    exit 0
}

# Show files to delete
if ($filesToDelete.Count -gt 0) {
    Write-Host "Files to DELETE:" -ForegroundColor Red
    $grouped = $filesToDelete | Group-Object -Property Category
    foreach ($group in $grouped) {
        Write-Host "  $($group.Name): $($group.Count) files" -ForegroundColor Yellow
        if ($Verbose -or $DryRun) {
            foreach ($item in $group.Group | Select-Object -First 10) {
                $relativePath = $item.File.FullName.Replace((Get-Location).Path + '\', '')
                Write-Host "    - $relativePath" -ForegroundColor Gray
            }
            if ($group.Count -gt 10) {
                Write-Host "    ... and $($group.Count - 10) more" -ForegroundColor Gray
            }
        }
    }
    Write-Host ""
}

# Show files to archive
if ($filesToArchive.Count -gt 0) {
    Write-Host "Test outputs to ARCHIVE:" -ForegroundColor Yellow
    if ($Verbose -or $DryRun) {
        foreach ($item in $filesToArchive | Select-Object -First 10) {
            $relativeSource = $item.File.FullName.Replace((Get-Location).Path + '\', '')
            $relativeTarget = $item.Target.Replace((Get-Location).Path + '\', '')
            Write-Host "  $relativeSource -> $relativeTarget" -ForegroundColor Gray
        }
        if ($filesToArchive.Count -gt 10) {
            Write-Host "  ... and $($filesToArchive.Count - 10) more" -ForegroundColor Gray
        }
    }
    Write-Host ""
}

# Show directories to clean
if ($directoriesToClean.Count -gt 0) {
    Write-Host "Directories to CLEAN:" -ForegroundColor Yellow
    Write-Host "  Note: These directories should be archived using organize-all-files.ps1" -ForegroundColor Gray
    foreach ($dir in $directoriesToClean) {
        Write-Host "  - $($dir.Directory) ($($dir.FileCount) files)" -ForegroundColor Yellow
    }
    Write-Host ""
}

if ($DryRun) {
    Write-Host "Run without -DryRun to execute cleanup." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "  -Archive:`$false          # Don't archive test outputs, delete them" -ForegroundColor Gray
    Write-Host "  -DeleteTestOutputs:`$true  # Delete test outputs instead of archiving" -ForegroundColor Gray
    exit 0
}

# Execute deletions
$deleted = 0
$deletionErrors = 0

if ($filesToDelete.Count -gt 0) {
    Write-Host "Deleting temporary files..." -ForegroundColor Cyan
    foreach ($item in $filesToDelete) {
        try {
            Remove-Item -Path $item.File.FullName -Force
            if ($Verbose) {
                Write-Host "[DELETED] $($item.File.Name)" -ForegroundColor Green
            }
            $deleted++
        } catch {
            Write-Host "[FAILED] $($item.File.Name): $_" -ForegroundColor Red
            $deletionErrors++
        }
    }
    Write-Host ""
}

# Execute archiving
$archived = 0
$archiveErrors = 0

if ($filesToArchive.Count -gt 0) {
    Write-Host "Archiving test outputs..." -ForegroundColor Cyan
    foreach ($item in $filesToArchive) {
        $targetDir = Split-Path $item.Target -Parent
        if (-not (Test-Path $targetDir)) {
            New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        }
        
        if (Test-Path $item.Target) {
            Write-Host "SKIP: $($item.File.Name) -> Target exists" -ForegroundColor Yellow
            continue
        }
        
        try {
            Move-Item -Path $item.File.FullName -Destination $item.Target -Force
            if ($Verbose) {
                Write-Host "[ARCHIVED] $($item.File.Name)" -ForegroundColor Green
            }
            $archived++
        } catch {
            Write-Host "[FAILED] $($item.File.Name): $_" -ForegroundColor Red
            $archiveErrors++
        }
    }
    Write-Host ""
}

# Summary
Write-Host "Cleanup complete!" -ForegroundColor Green
Write-Host "  Deleted: $deleted" -ForegroundColor Green
Write-Host "  Archived: $archived" -ForegroundColor Green
if ($deletionErrors -gt 0 -or $archiveErrors -gt 0) {
    Write-Host "  Errors: $($deletionErrors + $archiveErrors)" -ForegroundColor Red
}

if ($directoriesToClean.Count -gt 0) {
    Write-Host ""
    Write-Host "Note: Run scripts/organize-all-files.ps1 to archive remaining directories:" -ForegroundColor Yellow
    foreach ($dir in $directoriesToClean) {
        Write-Host "  - $($dir.Directory)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run scripts/organize-all-files.ps1 to archive temporary directories" -ForegroundColor White
Write-Host "  2. Update .gitignore to prevent test outputs from being committed" -ForegroundColor White
Write-Host "  3. Verify no temporary files remain" -ForegroundColor White








