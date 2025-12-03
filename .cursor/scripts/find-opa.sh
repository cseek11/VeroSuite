#!/bin/bash
# OPA Binary Finder - Shell Script Wrapper
#
# Quick access to OPA binary for shell scripts and agents.
# Usage: source .cursor/scripts/find-opa.sh
#        $OPA_BIN test policies/ tests/ -v
#
# Last Updated: 2025-11-25

# Find OPA binary using Python helper
OPA_BIN=$(python3 .cursor/scripts/find-opa.py 2>/dev/null)

if [ -z "$OPA_BIN" ]; then
    echo "❌ OPA binary not found" >&2
    echo "" >&2
    echo "💡 Solutions:" >&2
    echo "  1. Install OPA in services/opa/bin/" >&2
    echo "  2. Set OPA_BINARY environment variable" >&2
    echo "  3. Install OPA system-wide and add to PATH" >&2
    echo "" >&2
    echo "📖 See: docs/compliance-reports/OPA-INSTALLATION-NOTES.md" >&2
    return 1 2>/dev/null || exit 1
fi

# Export for use in scripts
export OPA_BIN

# Verify it works
if ! "$OPA_BIN" version >/dev/null 2>&1; then
    echo "⚠️  OPA binary found at $OPA_BIN but 'opa version' failed" >&2
    return 1 2>/dev/null || exit 1
fi

# Success - OPA_BIN is now available
echo "✅ OPA found: $OPA_BIN" >&2


