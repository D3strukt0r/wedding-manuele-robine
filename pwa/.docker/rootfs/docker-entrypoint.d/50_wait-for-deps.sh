#!/bin/bash
set -e -u -o pipefail

# Check if API_URL is set
if [[ -z "${API_URL:-}" ]]; then
  entrypoint_error 'API_URL is not set'
  exit 1
fi

# https://stackoverflow.com/a/17287984/4156752 URL parser
# https://stackoverflow.com/a/49627999/4156752 Fix grep on pipefail
# extract proto/scheme
proto="`echo $API_URL | { grep '://' || test $? = 1; } | sed -e's|^\(.*\)://.*|\1|g'`"
url=`echo $API_URL | sed -e s,$proto://,,g`

# extract the host -- updated
hostport=`echo $url | cut -d/ -f1`
port=`echo $hostport | { grep : || test $? = 1; } | cut -d: -f2`
if [ -n "$port" ]; then
    host=`echo $hostport | { grep : || test $? = 1; } | cut -d: -f1`
else
    host=$hostport
fi
: "${port:=80}"

DEPS_TIMEOUT=${DEPS_TIMEOUT:=60}

entrypoint_info "Waiting up to $DEPS_TIMEOUT seconds for remote api \"$proto://$host:$port/ping\" ..."

# https://stackoverflow.com/a/70362046/4156752 Elapsed time
start_time="$(date -u +%s)"
current_time="$(date -u +%s)"
elapsed_seconds=$(($current_time - $start_time))

until [ $elapsed_seconds -gt $DEPS_TIMEOUT ] || curl "$proto://$host:$port/ping" >/dev/null 2>&1; do
  current_time="$(date -u +%s)"
  elapsed_seconds=$(($current_time - $start_time))
  entrypoint_warn "Still waiting for api to be ready... Or maybe the api is not reachable. $(($elapsed_seconds - $DEPS_TIMEOUT)) seconds left"
  sleep 1
done

if [ $elapsed_seconds -gt $DEPS_TIMEOUT ]; then
  entrypoint_error 'The api is not up or not reachable'
  exit 1
else
  entrypoint_info 'The api is now ready and reachable'
fi
