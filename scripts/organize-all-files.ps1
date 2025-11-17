# Comprehensive File Organization Script
# Organizes ALL file types across ALL directories according to file organization rules
# Date: 2025-11-16

param(
    [switch]$DryRun = $false,
    [switch]$Verbose = $false
)

$ErrorActionPreference = "Stop"

Write-Host "Comprehensive File Organization Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "DRY RUN MODE - No files will be moved" -ForegroundColor Yellow
    Write-Host ""
}

# Define file categories and their target directories
$fileCategories = @{
    # Documentation files (handled by organize-documentation.ps1, but included for completeness)
    "Documentation" = @{
        Patterns = @("*.md")
        Exclude = @("README.md")
        Target = "docs/"
        Handler = "documentation"
    }
    
    # SQL scripts
    "SQLScripts" = @{
        Patterns = @("*.sql")
        Target = "docs/archive/migrations/"
        AlternativeTarget = "supabase/migrations/"
        Handler = "sql"
    }
    
    # Image files
    "Images" = @{
        Patterns = @("*.png", "*.jpg", "*.jpeg", "*.gif", "*.svg", "*.webp")
        Target = "branding/assets/images/"
        AlternativeTarget = "docs/assets/images/"
        Handler = "images"
    }
    
    # Video files
    "Videos" = @{
        Patterns = @("*.mp4", "*.mov", "*.avi", "*.webm", "*.mkv")
        Target = "branding/assets/videos/"
        AlternativeTarget = "docs/assets/videos/"
        Handler = "videos"
    }
    
    # Office documents
    "OfficeDocs" = @{
        Patterns = @("*.docx", "*.doc", "*.pdf", "*.xlsx", "*.xls")
        Target = "docs/archive/misc/"
        Handler = "office"
    }
    
    # Text files (non-markdown)
    "TextFiles" = @{
        Patterns = @("*.txt")
        Exclude = @("*.log.txt", "*.error.txt")
        Target = "docs/archive/misc/"
        Handler = "text"
    }
    
    # Test output files
    "TestOutputs" = @{
        Patterns = @("*test-results*", "*test-output*", "*coverage*", "*.test.log")
        Target = "docs/archive/test-results/"
        Handler = "test"
        ShouldGitIgnore = $true
    }
}

# Directory-specific rules
$directoryRules = @{
    "CurrentProgress" = @{
        Action = "archive"
        Target = "docs/archive/progress/"
        SQLTarget = "docs/archive/migrations/"
        ReportTarget = "docs/archive/reports/"
    }
    "DEVELOPER_TICKETS" = @{
        Action = "archive"
        Target = "docs/archive/tickets/"
        ProgressTarget = "docs/archive/progress/"
        ReportTarget = "docs/archive/reports/"
    }
    "Context" = @{
        Action = "move"
        ImagesTarget = "branding/assets/images/"
        VideosTarget = "branding/assets/videos/"
        ScreenshotsTarget = "branding/assets/screenshots/"
    }
    "Test_Results" = @{
        Action = "archive"
        Target = "docs/archive/test-results/"
        ShouldGitIgnore = $true
    }
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
        } elseif ($FileName -like $pattern) {
            return $true
        }
    }
    return $false
}

# Function to categorize a file
function Get-FileCategory {
    param(
        [string]$FileName,
        [string]$Directory
    )
    
    # Check directory-specific rules first
    if ($directoryRules.ContainsKey($Directory)) {
        return @{
            Category = "DirectorySpecific"
            Rule = $directoryRules[$Directory]
            Directory = $Directory
        }
    }
    
    # Check file type categories
    foreach ($categoryName in $fileCategories.Keys) {
        $category = $fileCategories[$categoryName]
        
        # Check exclude patterns
        if ($category.Exclude) {
            $excluded = $false
            foreach ($excludePattern in $category.Exclude) {
                if (Test-FilePattern -FileName $FileName -Patterns @($excludePattern)) {
                    $excluded = $true
                    break
                }
            }
            if ($excluded) {
                continue
            }
        }
        
        # Check include patterns
        if (Test-FilePattern -FileName $FileName -Patterns $category.Patterns) {
            return @{
                Category = $categoryName
                Rule = $category
            }
        }
    }
    
    return $null
}

# Function to determine target path for a file
function Get-TargetPath {
    param(
        [object]$FileInfo,
        [object]$CategoryInfo
    )
    
    $fileName = $FileInfo.Name
    $fileExtension = $FileInfo.Extension.ToLower()
    $directory = $FileInfo.Directory.Name
    
    # Handle directory-specific rules
    if ($CategoryInfo.Category -eq "DirectorySpecific") {
        $rule = $CategoryInfo.Rule
        
        if ($directory -eq "CurrentProgress") {
            if ($fileExtension -eq ".sql") {
                return Join-Path $rule.SQLTarget $fileName
            } elseif ($fileExtension -eq ".md") {
                return Join-Path $rule.ReportTarget $fileName
            } else {
                return Join-Path $rule.Target $fileName
            }
        }
        elseif ($directory -eq "DEVELOPER_TICKETS") {
            if ($fileName -like "*PROGRESS*" -or $fileName -like "*STATUS*") {
                return Join-Path $rule.ProgressTarget $fileName
            } elseif ($fileName -like "*REPORT*" -or $fileName -like "*SUMMARY*") {
                return Join-Path $rule.ReportTarget $fileName
            } else {
                return Join-Path $rule.Target $fileName
            }
        }
        elseif ($directory -eq "Context") {
            if ($fileExtension -in @(".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp")) {
                if ($fileName -like "*screenshot*" -or $fileName -like "*Screenshot*") {
                    return Join-Path $rule.ScreenshotsTarget $fileName
                } else {
                    return Join-Path $rule.ImagesTarget $fileName
                }
            } elseif ($fileExtension -in @(".mp4", ".mov", ".avi", ".webm", ".mkv")) {
                return Join-Path $rule.VideosTarget $fileName
            }
        }
        elseif ($directory -eq "Test_Results") {
            return Join-Path $rule.Target $fileName
        }
    }
    
    # Handle file type categories
    $rule = $CategoryInfo.Rule
    
    # Check for alternative target (e.g., docs vs branding)
    if ($rule.AlternativeTarget) {
        # Use alternative if it's documentation-related
        if ($fileName -like "*doc*" -or $fileName -like "*guide*" -or $fileName -like "*README*") {
            return Join-Path $rule.AlternativeTarget $fileName
        }
    }
    
    return Join-Path $rule.Target $fileName
}

# Get all files to process
$filesToProcess = @()
$rootFiles = Get-ChildItem -Path "." -File | Where-Object { 
    $_.Name -ne "README.md" -and 
    $_.Name -notlike "package*.json" -and 
    $_.Name -notlike ".git*" -and
    $_.Name -notlike "tsconfig.json" -and
    $_.Name -notlike "nest-cli.json" -and
    $_.Name -notlike ".cursorrules"
}

# Process root files
foreach ($file in $rootFiles) {
    $categoryInfo = Get-FileCategory -FileName $file.Name -Directory "root"
    if ($categoryInfo) {
        $targetPath = Get-TargetPath -FileInfo $file -CategoryInfo $categoryInfo
        if ($targetPath) {
            $filesToProcess += [PSCustomObject]@{
                File = $file
                Category = $categoryInfo.Category
                Source = $file.FullName
                Target = $targetPath
                Reason = "Root file - must be organized"
            }
        }
    }
}

# Process directory-specific files
foreach ($dirName in $directoryRules.Keys) {
    $dirPath = Join-Path "." $dirName
    if (Test-Path $dirPath) {
        $dirFiles = Get-ChildItem -Path $dirPath -File -Recurse
        foreach ($file in $dirFiles) {
            $categoryInfo = Get-FileCategory -FileName $file.Name -Directory $dirName
            if ($categoryInfo) {
                $targetPath = Get-TargetPath -FileInfo $file -CategoryInfo $categoryInfo
                if ($targetPath) {
                    $filesToProcess += [PSCustomObject]@{
                        File = $file
                        Category = $categoryInfo.Category
                        Source = $file.FullName
                        Target = $targetPath
                        Reason = "File in $dirName directory - must be organized"
                    }
                }
            }
        }
    }
}

# Process files by type in root and other directories
$directoriesToCheck = @(".", "branding", "deploy")
foreach ($checkDir in $directoriesToCheck) {
    if (-not (Test-Path $checkDir)) { continue }
    
    $files = Get-ChildItem -Path $checkDir -File -Recurse -ErrorAction SilentlyContinue | Where-Object {
        $_.FullName -notlike "*node_modules*" -and
        $_.FullName -notlike "*.git*" -and
        $_.FullName -notlike "*dist*" -and
        $_.FullName -notlike "*build*"
    }
    
    foreach ($file in $files) {
        # Skip if already processed
        if ($filesToProcess | Where-Object { $_.Source -eq $file.FullName }) {
            continue
        }
        
        $categoryInfo = Get-FileCategory -FileName $file.Name -Directory $file.Directory.Name
        if ($categoryInfo -and $categoryInfo.Category -ne "DirectorySpecific") {
            $targetPath = Get-TargetPath -FileInfo $file -CategoryInfo $categoryInfo
            if ($targetPath) {
                # Check if file is already in target location
                $relativeTarget = $targetPath.Replace((Get-Location).Path + '\', '')
                if ($file.FullName -notlike "*$relativeTarget*") {
                    $filesToProcess += [PSCustomObject]@{
                        File = $file
                        Category = $categoryInfo.Category
                        Source = $file.FullName
                        Target = $targetPath
                        Reason = "File type organization"
                    }
                }
            }
        }
    }
}

# Display summary
Write-Host "Files to organize: $($filesToProcess.Count)" -ForegroundColor Cyan
Write-Host ""

if ($filesToProcess.Count -eq 0) {
    Write-Host "No files need organization!" -ForegroundColor Green
    exit 0
}

# Group by category
$grouped = $filesToProcess | Group-Object -Property Category

foreach ($group in $grouped) {
    Write-Host "Category: $($group.Name) ($($group.Count) files)" -ForegroundColor Yellow
    if ($Verbose -or $DryRun) {
        foreach ($item in $group.Group) {
            $relativeSource = $item.Source.Replace((Get-Location).Path + '\', '')
            $relativeTarget = $item.Target.Replace((Get-Location).Path + '\', '')
            Write-Host "  $relativeSource -> $relativeTarget" -ForegroundColor $(if ($DryRun) { "Gray" } else { "White" })
        }
    }
    Write-Host ""
}

if ($DryRun) {
    Write-Host "Run without -DryRun to execute organization." -ForegroundColor Yellow
    exit 0
}

# Execute moves
Write-Host "Organizing files..." -ForegroundColor Cyan
$moved = 0
$skipped = 0
$errors = 0

foreach ($item in $filesToProcess) {
    $targetDir = Split-Path $item.Target -Parent
    
    # Ensure target directory exists
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
        if ($Verbose) {
            Write-Host "Created directory: $targetDir" -ForegroundColor Green
        }
    }
    
    # Check if target already exists
    if (Test-Path $item.Target) {
        Write-Host "SKIP: $($item.File.Name) -> Target exists" -ForegroundColor Yellow
        $skipped++
        continue
    }
    
    try {
        Move-Item -Path $item.Source -Destination $item.Target -Force
        if ($Verbose) {
            Write-Host "[OK] $($item.File.Name) -> $($item.Target)" -ForegroundColor Green
        }
        $moved++
    } catch {
        Write-Host "[FAIL] $($item.File.Name): $_" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""
Write-Host "Organization complete!" -ForegroundColor Green
Write-Host "  Moved: $moved" -ForegroundColor Green
Write-Host "  Skipped: $skipped" -ForegroundColor Yellow
if ($errors -gt 0) {
    Write-Host "  Errors: $errors" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Review organized files" -ForegroundColor White
Write-Host "  2. Update any broken references" -ForegroundColor White
Write-Host "  3. Run scripts/validate-file-organization.ps1 to verify" -ForegroundColor White
Write-Host "  4. Update .gitignore if needed" -ForegroundColor White


