#!/bin/bash
set -e -u -o pipefail

su --preserve-environment \
   --command 'php bin/console doctrine:migration:migrate --no-interaction' \
   app
