#!/bin/bash
set -e -u -o pipefail

su --preserve-environment \
   --command 'HOME=/home/app && PNPM_HOME="$HOME/.pnpm-store" && pnpm run build' \
   app
