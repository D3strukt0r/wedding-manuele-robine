#!/bin/bash
set -e -u -o pipefail

# Symfony needs access to var/{cache, log, sessions} directories
# but they are owned by root in the container (if mapped).
# This script is run as root, so we can fix the permissions here.
mkdir -p var/{cache,log,sessions}
chown -R app:app var/{cache,log,sessions} || true
