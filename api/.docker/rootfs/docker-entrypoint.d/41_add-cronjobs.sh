#!/bin/bash
set -e -u -o pipefail

CRONTAB=/etc/cron.d/crontabs/crontab.${RUNTIME_ENVIRONMENT}

# check if file exists, then symlink it
if [ -e "$CRONTAB" ]; then
  crontab -u app "$CRONTAB"
  entrypoint_info "Installed crontab file $CRONTAB."
else
  entrypoint_warn "No crontab found ($CRONTAB)."
fi
