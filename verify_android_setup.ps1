# Android Development Environment Verification Script
# Run this script to verify Android Studio and SDK setup

Write-Host "=== Android Development Environment Verification ===" -ForegroundColor Green
Write-Host ""

# Check Android Studio
Write-Host "1. Checking Android Studio installation:" -ForegroundColor Yellow
$androidStudioPath = "C:\Program Files\Android\Android Studio\bin\studio64.exe"
if (Test-Path $androidStudioPath) {
    Write-Host "   ✅ Android Studio is installed at: $androidStudioPath" -ForegroundColor Green
} else {
    Write-Host "   ❌ Android Studio not found at: $androidStudioPath" -ForegroundColor Red
}

# Check Android SDK
Write-Host ""
Write-Host "2. Checking Android SDK:" -ForegroundColor Yellow
$androidSdkPath = "$env:LOCALAPPDATA\Android\Sdk"
if (Test-Path $androidSdkPath) {
    Write-Host "   ✅ Android SDK found at: $androidSdkPath" -ForegroundColor Green
} else {
    Write-Host "   ❌ Android SDK not found at: $androidSdkPath" -ForegroundColor Red
}

# Check ANDROID_HOME
Write-Host ""
Write-Host "3. Checking ANDROID_HOME environment variable:" -ForegroundColor Yellow
if ($env:ANDROID_HOME) {
    Write-Host "   ✅ ANDROID_HOME is set to: $env:ANDROID_HOME" -ForegroundColor Green
} else {
    Write-Host "   ❌ ANDROID_HOME is not set" -ForegroundColor Red
}

# Check Android platforms
Write-Host ""
Write-Host "4. Checking Android platforms:" -ForegroundColor Yellow
$platformsPath = "$androidSdkPath\platforms"
if (Test-Path $platformsPath) {
    $platforms = Get-ChildItem $platformsPath | Select-Object -ExpandProperty Name
    if ($platforms) {
        Write-Host "   ✅ Available Android platforms:" -ForegroundColor Green
        foreach ($platform in $platforms) {
            Write-Host "      - $platform" -ForegroundColor Cyan
        }
    } else {
        Write-Host "   ❌ No Android platforms found" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ Platforms directory not found" -ForegroundColor Red
}

# Check build tools
Write-Host ""
Write-Host "5. Checking Android build tools:" -ForegroundColor Yellow
$buildToolsPath = "$androidSdkPath\build-tools"
if (Test-Path $buildToolsPath) {
    $buildTools = Get-ChildItem $buildToolsPath | Select-Object -ExpandProperty Name
    if ($buildTools) {
        Write-Host "   ✅ Available build tools:" -ForegroundColor Green
        foreach ($tool in $buildTools) {
            Write-Host "      - $tool" -ForegroundColor Cyan
        }
    } else {
        Write-Host "   ❌ No build tools found" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ Build tools directory not found" -ForegroundColor Red
}

# Check platform-tools (adb)
Write-Host ""
Write-Host "6. Checking Android platform-tools (adb):" -ForegroundColor Yellow
$adbPath = "$androidSdkPath\platform-tools\adb.exe"
if (Test-Path $adbPath) {
    Write-Host "   ✅ ADB found at: $adbPath" -ForegroundColor Green
    try {
        $adbVersion = & $adbPath version 2>&1
        Write-Host "   ✅ ADB version: $($adbVersion[0])" -ForegroundColor Cyan
    } catch {
        Write-Host "   ⚠️  ADB found but version check failed" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ❌ ADB not found at: $adbPath" -ForegroundColor Red
}

# Check emulator
Write-Host ""
Write-Host "7. Checking Android emulator:" -ForegroundColor Yellow
$emulatorPath = "$androidSdkPath\emulator\emulator.exe"
if (Test-Path $emulatorPath) {
    Write-Host "   ✅ Android emulator found at: $emulatorPath" -ForegroundColor Green
} else {
    Write-Host "   ❌ Android emulator not found at: $emulatorPath" -ForegroundColor Red
}

# Check system images
Write-Host ""
Write-Host "8. Checking Android system images:" -ForegroundColor Yellow
$systemImagesPath = "$androidSdkPath\system-images"
if (Test-Path $systemImagesPath) {
    $systemImages = Get-ChildItem $systemImagesPath -Recurse -Directory | Select-Object -ExpandProperty Name
    if ($systemImages) {
        Write-Host "   ✅ Available system images:" -ForegroundColor Green
        $uniqueImages = $systemImages | Sort-Object | Get-Unique
        foreach ($image in $uniqueImages) {
            Write-Host "      - $image" -ForegroundColor Cyan
        }
    } else {
        Write-Host "   ❌ No system images found" -ForegroundColor Red
    }
} else {
    Write-Host "   ❌ System images directory not found" -ForegroundColor Red
}

# Check PATH for Android tools
Write-Host ""
Write-Host "9. Checking PATH for Android tools:" -ForegroundColor Yellow
$pathContainsAndroid = $env:PATH -like "*$androidSdkPath*"
if ($pathContainsAndroid) {
    Write-Host "   ✅ Android SDK tools are in PATH" -ForegroundColor Green
} else {
    Write-Host "   ❌ Android SDK tools are NOT in PATH" -ForegroundColor Red
}

# Test adb command
Write-Host ""
Write-Host "10. Testing adb command:" -ForegroundColor Yellow
try {
    $adbTest = adb version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ ADB command works:" -ForegroundColor Green
        Write-Host "   $($adbTest[0])" -ForegroundColor Cyan
    } else {
        Write-Host "   ❌ ADB command failed" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ ADB command not found in PATH" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Verification Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "If you see any ❌ errors above:" -ForegroundColor Yellow
Write-Host "1. Make sure ANDROID_HOME is set to: $env:LOCALAPPDATA\Android\Sdk" -ForegroundColor White
Write-Host "2. Make sure Android SDK tools are in PATH" -ForegroundColor White
Write-Host "3. Install missing Android platforms or build tools via Android Studio" -ForegroundColor White
Write-Host "4. Run this script again to verify" -ForegroundColor White

