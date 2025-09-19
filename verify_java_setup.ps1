# Java Environment Variables Verification Script
# Run this script after setting up environment variables

Write-Host "=== Java Environment Variables Verification ===" -ForegroundColor Green
Write-Host ""

# Check JAVA_HOME
Write-Host "1. Checking JAVA_HOME environment variable:" -ForegroundColor Yellow
$javaHome = $env:JAVA_HOME
if ($javaHome) {
    Write-Host "   ✅ JAVA_HOME is set to: $javaHome" -ForegroundColor Green
} else {
    Write-Host "   ❌ JAVA_HOME is not set" -ForegroundColor Red
}

# Check if Java executable exists
Write-Host ""
Write-Host "2. Checking Java executable:" -ForegroundColor Yellow
$javaPath = "$javaHome\bin\java.exe"
if (Test-Path $javaPath) {
    Write-Host "   ✅ Java executable found at: $javaPath" -ForegroundColor Green
} else {
    Write-Host "   ❌ Java executable not found at: $javaPath" -ForegroundColor Red
}

# Check PATH
Write-Host ""
Write-Host "3. Checking PATH for Java:" -ForegroundColor Yellow
$pathContainsJava = $env:PATH -like "*$javaHome\bin*"
if ($pathContainsJava) {
    Write-Host "   ✅ Java bin directory is in PATH" -ForegroundColor Green
} else {
    Write-Host "   ❌ Java bin directory is NOT in PATH" -ForegroundColor Red
}

# Test Java version
Write-Host ""
Write-Host "4. Testing Java version command:" -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Java version command works:" -ForegroundColor Green
        Write-Host "   $javaVersion" -ForegroundColor Cyan
    } else {
        Write-Host "   ❌ Java version command failed" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Java command not found in PATH" -ForegroundColor Red
}

# Test Java compiler
Write-Host ""
Write-Host "5. Testing Java compiler (javac):" -ForegroundColor Yellow
try {
    $javacVersion = javac -version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Java compiler works:" -ForegroundColor Green
        Write-Host "   $javacVersion" -ForegroundColor Cyan
    } else {
        Write-Host "   ❌ Java compiler command failed" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Java compiler not found in PATH" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Verification Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "If you see any ❌ errors above:" -ForegroundColor Yellow
Write-Host "1. Make sure you set JAVA_HOME to: C:\Program Files\Java\jdk-25" -ForegroundColor White
Write-Host "2. Make sure you added %JAVA_HOME%\bin to your PATH" -ForegroundColor White
Write-Host "3. Restart your terminal/command prompt after making changes" -ForegroundColor White
Write-Host "4. Run this script again to verify" -ForegroundColor White

