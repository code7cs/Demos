#!/usr/bin/env bash
# Flatten ~/code/Demos/AngularProject2026/ into ~/code/Demos/ to match GitHub layout.
# Safe to re-run.

set -euo pipefail

PARENT="/home/hwang/_code/Demos"
NESTED="$PARENT/AngularProject2026"

if [[ ! -d "$NESTED/.git" ]]; then
  echo "Nothing to do: $NESTED is not a git repo (already aligned)."
  exit 0
fi

if [[ ! -d "$PARENT" ]]; then
  echo "Error: parent folder missing: $PARENT"
  exit 1
fi

echo "Moving repo contents from:"
echo "  $NESTED"
echo "to:"
echo "  $PARENT"
echo ""
read -r -p "Continue? [y/N] " confirm
if [[ "${confirm,,}" != "y" ]]; then
  echo "Aborted."
  exit 1
fi

shopt -s dotglob
for item in "$NESTED"/*; do
  base="$(basename "$item")"
  if [[ -e "$PARENT/$base" ]]; then
    echo "Error: $PARENT/$base already exists. Resolve conflicts manually."
    exit 1
  fi
  mv "$item" "$PARENT/"
done

rmdir "$NESTED"

echo "Done. Git root is now: $PARENT"
echo "Re-open your editor at that path."
echo "Run: cd $PARENT/angular-demos && npm start"
