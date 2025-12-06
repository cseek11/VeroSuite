#!/bin/bash
# Backup Session State File
# Automated backup script for session_state.json
# Last Updated: 2025-12-04

set -e

STATE_FILE=".cursor/data/session_state.json"
BACKUP_DIR=".cursor/data/backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Check if state file exists
if [ ! -f "$STATE_FILE" ]; then
    echo "WARNING: State file not found: $STATE_FILE"
    exit 0
fi

# Create timestamped backup
BACKUP_FILE="$BACKUP_DIR/session_state.backup.$TIMESTAMP.json"
cp "$STATE_FILE" "$BACKUP_FILE"

# Keep only last 24 hourly backups
find "$BACKUP_DIR" -name "session_state.backup.*.json" -type f | sort -r | tail -n +25 | xargs rm -f 2>/dev/null || true

# Keep only last 7 daily backups (one per day)
find "$BACKUP_DIR" -name "session_state.backup.*.json" -type f -mtime +7 -delete 2>/dev/null || true

# Keep only last 4 weekly backups (one per week)
find "$BACKUP_DIR" -name "session_state.backup.*.json" -type f -mtime +28 -delete 2>/dev/null || true

echo "✅ Backup created: $BACKUP_FILE"

