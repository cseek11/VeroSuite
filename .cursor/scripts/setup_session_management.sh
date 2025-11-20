#!/bin/bash
# Setup Session Management System
# Run this script to install and configure the auto-PR session system.
# Last Updated: 2025-11-19

set -e

echo "🚀 Setting up Auto-PR Session Management System..."

# Create directory structure
echo "📁 Creating directories..."
mkdir -p .cursor/scripts
mkdir -p .cursor/config
mkdir -p .cursor/data
mkdir -p .cursor/commands
mkdir -p docs/metrics
mkdir -p docs/metrics/analytics

# Create default config if not exists
if [ ! -f .cursor/config/session_config.yaml ]; then
    echo "⚙️  Creating default configuration..."
    cat > .cursor/config/session_config.yaml << 'EOF'
timeout_minutes: 30
idle_warning_minutes: 15
auto_pr_patterns:
  - "^auto-pr:"
  - "^wip:"
  - "^\\[auto\\]"
  - "^checkpoint:"
  - "^cursor-session"
  - "^🤖"
completion_markers:
  - "ready for review"
  - "complete"
  - "[session-complete]"
  - "[ready]"
  - "✅"
min_files_for_manual: 5
enable_timeout_completion: true
enable_heuristic_completion: true
EOF
fi

# Initialize session data file if not exists
if [ ! -f docs/metrics/auto_pr_sessions.json ]; then
    echo "📊 Initializing session data..."
    cat > docs/metrics/auto_pr_sessions.json << EOF
{
  "version": "1.0",
  "last_updated": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "active_sessions": {},
  "completed_sessions": []
}
EOF
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install pyyaml 2>/dev/null || echo "⚠️  Could not install pyyaml (may already be installed)"

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x .cursor/scripts/auto_pr_session_manager.py
chmod +x .cursor/scripts/session_cli.py
chmod +x .cursor/scripts/cursor_session_hook.py
chmod +x .cursor/scripts/session_analytics.py
chmod +x .cursor/scripts/minimal_metadata_system.py
chmod +x .cursor/scripts/validate_config.py
chmod +x .cursor/scripts/monitor_sessions.py
chmod +x .cursor/scripts/backup_session_state.sh

# Test installation
echo "🧪 Testing installation..."
python .cursor/scripts/auto_pr_session_manager.py status > /dev/null 2>&1 && \
    echo "✅ Session manager working" || \
    echo "❌ Session manager test failed"

python .cursor/scripts/session_cli.py --help > /dev/null 2>&1 && \
    echo "✅ CLI tool working" || \
    echo "❌ CLI tool test failed"

python .cursor/scripts/validate_config.py > /dev/null 2>&1 && \
    echo "✅ Config validator working" || \
    echo "❌ Config validator test failed"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📖 Quick Start:"
echo "   1. Start a session:  python .cursor/scripts/session_cli.py start"
echo "   2. Make commits (they'll be tracked automatically)"
echo "   3. Complete session: python .cursor/scripts/session_cli.py complete"
echo ""
echo "🔍 Check status:      python .cursor/scripts/session_cli.py status"
echo "📊 View analytics:    python .cursor/scripts/session_analytics.py"
echo ""
echo "For GitHub Actions integration, ensure workflows are committed to .github/workflows/"








