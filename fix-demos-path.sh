#!/usr/bin/env bash
# Rename ~/code/Demos/AngularProject2026 -> ~/code/Demos (matches GitHub repo layout)
set -euo pipefail

PARENT="/home/hwang/_code/Demos"
NESTED="$PARENT/AngularProject2026"
LOG="/tmp/fix-demos-path.log"

exec > >(tee "$LOG") 2>&1

echo "=== fix-demos-path $(date) ==="

if [[ ! -d "$NESTED/.git" ]]; then
  if [[ -d "$PARENT/.git" ]]; then
    echo "Already fixed: git root is $PARENT"
    exit 0
  fi
  echo "Error: expected git repo at $NESTED or $PARENT"
  exit 1
fi

count=$(ls -A "$PARENT" | wc -l)
echo "Entries in $PARENT: $count"

if [[ "$count" -eq 1 ]]; then
  echo "Renaming nested repo folder to Demos..."
  mv "$NESTED" /home/hwang/_code/_demos_tmp
  rmdir "$PARENT"
  mv /home/hwang/_code/_demos_tmp "$PARENT"
else
  echo "Flattening nested repo into parent Demos..."
  shopt -s dotglob
  for item in "$NESTED"/*; do
    base=$(basename "$item")
    if [[ -e "$PARENT/$base" ]]; then
      echo "Error: $PARENT/$base already exists"
      exit 1
    fi
    mv "$item" "$PARENT/"
    echo "Moved $base"
  done
  rmdir "$NESTED"
fi

echo ""
echo "Done. Git root: $PARENT"
echo "Angular app: $PARENT/angular-demos"
echo ""
echo "Re-open Cursor on: $PARENT"
