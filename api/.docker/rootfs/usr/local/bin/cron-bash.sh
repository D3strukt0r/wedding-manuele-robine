#!/bin/bash
set -e -u -o pipefail
set -a # all environment variables are automatically exported this way

cron_log() {
  local type="$1"
  shift
  printf '%s [%s] [Cron]: %s\n' "$(date '+%Y-%m-%d %T %z')" "$type" "$*"
}
cron_info() {
  cron_log Info "$@"
}
cron_error() {
  cron_log ERROR "$@" >&2
}

cron_info "Started"

if [ "$(whoami)" != 'app' ]; then
  cron_error "Please start script as \"app\" (not '$(whoami)') ... Aborting."
  exit 1
fi

ENVFILE=/usr/local/bin/cron.env

if [ -f "$ENVFILE" ]; then
    cron_info "Sourcing $ENVFILE ..."
    source "$ENVFILE"
fi

test -d /usr/local/src/app && cd /usr/local/src/app

CONSOLECMD=$*
cron_info "Executing \"$CONSOLECMD\" (incl. timing information) ..."
# Start new process with env variables file
time $CONSOLECMD

cron_info "Finished"
set +a
