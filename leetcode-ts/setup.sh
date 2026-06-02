#!/usr/bin/env bash
# One-time / per-shell: use Linux Node in WSL (if you don't have node on PATH yet)
export PATH="${HOME}/.local/node/bin:${PATH}"

cd "$(dirname "$0")"
npm install "$@"
