#!/usr/bin/env bash
# Reset ~/code/Demos to match https://github.com/code7cs/Demos master
set -euo pipefail

CODE="/home/hwang/_code"
DEMOS="$CODE/Demos"
REMOTE="https://github.com/code7cs/Demos.git"
BACKUP="$CODE/Demos.backup.$(date +%Y%m%d%H%M%S)"
LOG="/tmp/reset-local-demos.log"

exec > >(tee "$LOG") 2>&1

echo "=== reset-local-demos $(date) ==="
echo "Remote: $REMOTE"
echo "Target: $DEMOS"
echo ""

echo "--- remote branches ---"
git ls-remote --heads "$REMOTE"

if [[ -d "$DEMOS" ]]; then
  echo ""
  echo "Backing up existing folder to: $BACKUP"
  mv "$DEMOS" "$BACKUP"
fi

echo ""
echo "Cloning fresh from master..."
git clone --branch master "$REMOTE" "$DEMOS"

cd "$DEMOS"
echo ""
echo "--- local status ---"
git status -sb
git log -1 --oneline
echo ""
echo "Top-level folders:"
ls -1 | head -20
echo ""
test -d "$DEMOS/angular-demos" && echo "OK: angular-demos present"
test -d "$DEMOS/AngularProject2026" && echo "WARN: old AngularProject2026 still exists" || echo "OK: no AngularProject2026 folder"
echo ""
echo "Done. Open in editor: $DEMOS"
echo "Run app: cd $DEMOS/angular-demos && npm install && npm start"
echo "Log: $LOG"
