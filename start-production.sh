#!/bin/bash
# Production startup for Flood Copilot — single Express process.
# The frontend (index.html + static assets) was pre-built by scripts/generate-index.js
# during the build step; no separate nitro process is needed at runtime.
set -e
cd /home/runner/workspace/backend
export NODE_ENV=production
exec node server.js
