#!/bin/bash
# Production startup script for Flood Copilot
# Starts the nitro SSR server on NITRO_PORT=3001, then Express on $PORT (injected by Replit as 8080).

set -e

WORKSPACE=/home/runner/workspace
NITRO_PORT=${NITRO_PORT:-3001}

echo "[startup] NODE version: $(node --version)"
echo "[startup] PORT (Express) = ${PORT:-8080}"
echo "[startup] NITRO_PORT = $NITRO_PORT"

echo "[startup] Starting nitro SSR server on port $NITRO_PORT..."
NITRO_PORT=$NITRO_PORT node "$WORKSPACE/.output/server/index.mjs" &
NITRO_PID=$!
echo "[startup] Nitro PID: $NITRO_PID"

# Wait up to 30s for nitro to be ready
echo "[startup] Waiting for nitro to be ready..."
for i in $(seq 1 30); do
  if ! kill -0 $NITRO_PID 2>/dev/null; then
    echo "[startup] ERROR: Nitro process (PID $NITRO_PID) died during startup!"
    exit 1
  fi
  if curl -sf "http://127.0.0.1:$NITRO_PORT/" > /dev/null 2>&1; then
    echo "[startup] Nitro is ready after ${i}s"
    break
  fi
  echo "[startup] ... waiting (${i}s)"
  sleep 1
done

# Final check
if ! curl -sf "http://127.0.0.1:$NITRO_PORT/" > /dev/null 2>&1; then
  echo "[startup] ERROR: Nitro still not responding after 30s!"
  kill $NITRO_PID 2>/dev/null
  exit 1
fi

echo "[startup] Starting Express backend (port ${PORT:-8080})..."
cd "$WORKSPACE/backend"
export NODE_ENV=production
exec node server.js
