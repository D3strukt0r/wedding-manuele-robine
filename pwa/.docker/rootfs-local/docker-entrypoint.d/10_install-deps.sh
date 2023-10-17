#!/bin/bash
set -e -u -o pipefail

su --preserve-environment \
   --command 'HOME=/home/app && pnpm config set store-dir /var/cache/pnpm-store && pnpm install' \
   app
