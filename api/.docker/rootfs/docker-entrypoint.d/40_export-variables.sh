#!/bin/bash
set -e -u -o pipefail

ENVFILE=/usr/local/bin/cron.env

echo "DATABASE_PASSWORD=\"${DATABASE_PASSWORD:-}\"" | tee "$ENVFILE" >/dev/null
echo "RUNTIME_ENVIRONMENT=\"${RUNTIME_ENVIRONMENT:-}\"" | tee -a "$ENVFILE" >/dev/null
