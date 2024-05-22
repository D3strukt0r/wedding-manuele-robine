#!/bin/bash
set -e -u -o pipefail

# Symfony needs access to cache, log, sessions directories
# but they are owned by root in the container (if mapped).
# This script is run as root, so we can fix the permissions here.

# Check for variable or fallback to Kernel defaults (Symfony\Component\HttpKernel\Kernel)
APP_CACHE_DIR=${APP_CACHE_DIR:-var/cache}
APP_LOG_DIR=${APP_LOG_DIR:-var/log}

mkdir --parents "$APP_CACHE_DIR" "$APP_LOG_DIR" /var/cache/sessions /var/lib/app/storage/default
chown --recursive app:app "$APP_CACHE_DIR" "$APP_LOG_DIR" /var/cache/sessions /var/lib/app/storage/default || true
