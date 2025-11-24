# OPA Installation Notes

**Last Updated:** 2025-11-23  
**Purpose:** Clarify OPA installation location and usage across chat sessions

---

## OPA Installation Location

### ✅ Correct Location (Permanent)
**Windows:** `services/opa/bin/opa.exe`  
**Linux/Mac:** `services/opa/bin/opa`

This is the **permanent, project-specific** installation that persists across all chat sessions.

### ❌ Temporary Location (Session-Specific)
**Windows:** `$env:TEMP\opa.exe` (or `%TEMP%\opa.exe`)

This is a **temporary, session-specific** location that was used as a workaround in one session. **Do not rely on this location** - it may not exist in other chat sessions.

---

## Why Other Chat Sessions Can't Find OPA

### Problem
If a chat session tries to use `$env:TEMP\opa.exe` or relies on OPA being in the system PATH, it may fail because:
1. **Temporary directories are session-specific** - Each chat session has its own temporary directory
2. **OPA may not be in system PATH** - The project uses a local installation, not a system-wide one
3. **Different working directories** - Commands may be run from different locations

### Solution
**Always use the project-specific OPA binary:**

```powershell
# Windows - Always use project binary
cd services/opa
.\bin\opa.exe version
.\bin\opa.exe test tests/ux_r19_test.rego policies/ux-consistency.rego -v

# Linux/Mac - Always use project binary
cd services/opa
./bin/opa version
./bin/opa test tests/ux_r19_test.rego policies/ux-consistency.rego -v
```

---

## Verification

### Check if OPA Exists
```powershell
# Windows
Test-Path "services/opa/bin/opa.exe"

# Linux/Mac
test -f "services/opa/bin/opa"
```

### Verify OPA Works
```powershell
# Windows
cd services/opa
.\bin\opa.exe version

# Expected output:
# Version: 1.10.1
# Build Commit: a119f30419c83050505a44ac33ba81e7279f5178
# Build Timestamp: 2025-11-05T09:06:03Z
# Platform: windows/amd64
# Rego Version: v1
# WebAssembly: available
```

---

## Installation (If Missing)

If `services/opa/bin/opa.exe` doesn't exist, install it:

### Windows
```powershell
# Create bin directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "services/opa/bin"

# Download OPA binary
Invoke-WebRequest -Uri "https://openpolicyagent.org/downloads/v1.10.1/opa_windows_amd64.exe" -OutFile "services/opa/bin/opa.exe"

# Verify installation
.\services\opa\bin\opa.exe version
```

### Linux
```bash
# Create bin directory if it doesn't exist
mkdir -p services/opa/bin

# Download OPA binary
curl -L -o services/opa/bin/opa https://openpolicyagent.org/downloads/v1.10.1/opa_linux_amd64

# Make executable
chmod +x services/opa/bin/opa

# Verify installation
./services/opa/bin/opa version
```

### Mac
```bash
# Create bin directory if it doesn't exist
mkdir -p services/opa/bin

# Download OPA binary
curl -L -o services/opa/bin/opa https://openpolicyagent.org/downloads/v1.10.1/opa_darwin_amd64

# Make executable
chmod +x services/opa/bin/opa

# Verify installation
./services/opa/bin/opa version
```

---

## Best Practices

### ✅ DO
- **Always use project binary:** `.\bin\opa.exe` or `./bin/opa`
- **Use relative paths:** `cd services/opa` then `.\bin\opa.exe`
- **Verify installation:** Run `.\bin\opa.exe version` before running tests
- **Document OPA location:** Reference `services/opa/bin/opa.exe` in documentation

### ❌ DON'T
- **Don't rely on temporary locations:** `$env:TEMP\opa.exe` is session-specific
- **Don't assume OPA is in PATH:** The project uses a local installation
- **Don't use absolute paths:** Use relative paths from project root
- **Don't skip verification:** Always verify OPA exists before running tests

---

## Troubleshooting

### "OPA not found" Error
**Symptom:** `opa : The term 'opa' is not recognized`

**Solution:**
```powershell
# Use project binary instead
cd services/opa
.\bin\opa.exe version
```

### "File not found" Error
**Symptom:** `Cannot find path 'services/opa/bin/opa.exe'`

**Solution:**
1. Verify you're in the project root directory
2. Check if file exists: `Test-Path "services/opa/bin/opa.exe"`
3. If missing, install OPA (see "Installation" section above)

### "Permission denied" Error (Linux/Mac)
**Symptom:** `Permission denied: ./bin/opa`

**Solution:**
```bash
chmod +x services/opa/bin/opa
```

---

## Reference

- **OPA Documentation:** `services/opa/README.md`
- **Quick Start:** `services/opa/QUICK_START.md`
- **Version:** 1.10.1
- **Platform:** Windows/amd64, Linux/amd64, Darwin/amd64

---

**Key Takeaway:** Always use `services/opa/bin/opa.exe` (Windows) or `services/opa/bin/opa` (Linux/Mac) - never rely on temporary locations or system PATH.



