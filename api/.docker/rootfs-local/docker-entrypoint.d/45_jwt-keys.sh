#!/bin/bash
set -e -u -o pipefail

# Check if the keys already exist (config/jwt/private.pem & config/jwt/public.pem)
if [[ -f /usr/local/src/app/config/jwt/private.pem ]] && [[ -f /usr/local/src/app/config/jwt/public.pem ]]; then
    entrypoint_info "JWT keys already exist, skipping..."
    exit 0
fi

su --preserve-environment \
   --command 'php bin/console lexik:jwt:generate-keypair' \
   app
