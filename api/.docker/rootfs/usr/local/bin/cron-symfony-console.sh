#!/bin/bash
set -e -u -o pipefail

cron-bash.sh php bin/console $*
