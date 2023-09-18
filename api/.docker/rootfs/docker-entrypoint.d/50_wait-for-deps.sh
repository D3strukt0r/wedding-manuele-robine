#!/bin/bash
set -e -u -o pipefail

WAIT_TIMEOUT=${WAIT_TIMEOUT:=600}
WAIT_FOR=${WAIT_FOR:=db:3306}

entrypoint_info "Waiting up to $WAIT_TIMEOUT seconds for remote port \"$WAIT_FOR\" ..."
wait-for.sh -t $WAIT_TIMEOUT $WAIT_FOR
