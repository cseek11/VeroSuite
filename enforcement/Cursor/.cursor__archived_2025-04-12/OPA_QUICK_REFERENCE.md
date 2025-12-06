# OPA Quick Reference for Agents

**Last Updated:** 2025-12-04  
**Purpose:** Quick reference for all agents to find and use OPA binary

---

## 🎯 Finding OPA Binary

### Method 1: Use Helper Script (Recommended)

**Python:**
```bash
python .cursor/scripts/find-opa.py
# Output: C:\Users\...\services\opa\bin\opa.exe (or path on your system)
```

**Shell Script:**
```bash
source .cursor/scripts/find-opa.sh
$OPA_BIN version  # OPA_BIN is now set
```

**PowerShell:**
```powershell
. .cursor/scripts/find-opa.ps1
& $OPA_BIN version  # $OPA_BIN is now set
```

### Method 2: Direct Path (If You Know Project Root)

**Windows:**
```powershell
$OPA_BIN = "services/opa/bin/opa.exe"
# Or from project root:
$OPA_BIN = Join-Path $PSScriptRoot "..\..\services\opa\bin\opa.exe"
```

**Linux/Mac:**
```bash
OPA_BIN="services/opa/bin/opa"
# Or from project root:
OPA_BIN="$(cd "$(dirname "$0")/../.." && pwd)/services/opa/bin/opa"
```

### Method 3: Environment Variable

```bash
# Set once per session
export OPA_BINARY=services/opa/bin/opa.exe  # Windows
export OPA_BINARY=services/opa/bin/opa        # Linux/Mac

# Then use
$OPA_BINARY version
```

---

## ✅ Verification

**Always verify OPA works before using:**

```bash
# Using helper script
OPA_BIN=$(python .cursor/scripts/find-opa.py)
$OPA_BIN version

# Expected output:
# Version: 1.10.1
# Build Commit: a119f30419c83050505a44ac33ba81e7279f5178
# Platform: windows/amd64
```

---

## 📝 Common Usage Patterns

### Running Tests

```bash
# Find OPA first
OPA_BIN=$(python .cursor/scripts/find-opa.py)

# Run tests
$OPA_BIN test services/opa/policies/ services/opa/tests/ -v
```

### Evaluating Policies

```bash
OPA_BIN=$(python .cursor/scripts/find-opa.py)
$OPA_BIN eval \
  --data services/opa/policies/ \
  --data services/opa/data/ \
  --input input.json \
  --format pretty \
  'data.compliance'
```

### In Python Scripts

```python
from pathlib import Path
import sys

# Add scripts to path
sys.path.insert(0, str(Path(__file__).parent.parent / '.cursor' / 'scripts'))

from find_opa import find_opa_binary

opa_path = find_opa_binary()
if not opa_path:
    raise RuntimeError("OPA binary not found. See .cursor/OPA_QUICK_REFERENCE.md")

# Use opa_path
import subprocess
result = subprocess.run([opa_path, 'version'], capture_output=True, text=True)
```

---

## 🔧 Troubleshooting

### "OPA not found" Error

**Solution:**
1. Run: `python .cursor/scripts/find-opa.py`
2. If it fails, check if `services/opa/bin/opa.exe` (Windows) or `services/opa/bin/opa` (Unix) exists
3. If missing, install OPA (see `services/opa/README.md`)

### "Permission denied" Error (Unix/Mac)

**Solution:**
```bash
chmod +x services/opa/bin/opa
```

### "File not found" from wrong directory

**Solution:**
- Always use the helper script: `python .cursor/scripts/find-opa.py`
- Or ensure you're in project root before using relative paths

---

## 📚 Related Documentation

- **Installation:** `services/opa/README.md`
- **Installation Notes:** `docs/compliance-reports/OPA-INSTALLATION-NOTES.md`
- **Helper Script:** `.cursor/scripts/find-opa.py`
- **Quick Start:** `services/opa/QUICK_START.md`

---

## 🎯 Best Practice for Agents

**Always use the helper script:**
```python
# In Python
from .cursor.scripts.find_opa import find_opa_binary
opa_path = find_opa_binary()
```

**Never:**
- ❌ Hardcode paths like `C:\Users\...\opa.exe`
- ❌ Assume OPA is in PATH
- ❌ Use temporary locations like `$env:TEMP\opa.exe`
- ❌ Skip verification

**Always:**
- ✅ Use `find-opa.py` helper
- ✅ Verify OPA works: `opa version`
- ✅ Handle "not found" errors gracefully
- ✅ Document OPA location in error messages

---

**Key Takeaway:** `python .cursor/scripts/find-opa.py` works from any directory and finds OPA reliably.


