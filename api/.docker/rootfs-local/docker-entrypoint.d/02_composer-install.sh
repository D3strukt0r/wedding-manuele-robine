#!/bin/bash
set -e -u -o pipefail

# Install might fail when executing cache:clear as post-install-cmd
su --preserve-environment \
   --command 'composer install || true' \
   app
