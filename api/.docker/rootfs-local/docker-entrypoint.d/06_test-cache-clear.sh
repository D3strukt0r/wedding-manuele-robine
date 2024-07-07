#!/bin/bash
set -e -u -o pipefail

su --preserve-environment \
   --command 'php bin/console --env=test cache:clear' \
   app
