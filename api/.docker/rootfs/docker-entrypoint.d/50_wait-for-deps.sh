#!/bin/bash
set -e -u -o pipefail

# Check if DATABASE_URL is set
if [[ -z "${DATABASE_URL:-}" ]]; then
  entrypoint_error 'DATABASE_URL is not set'
  exit 1
fi

# https://stackoverflow.com/a/17287984/4156752 URL parser
# https://stackoverflow.com/a/49627999/4156752 Fix grep on pipefail
# extract proto/scheme
driver="$(echo "$DATABASE_URL" | { grep '://' || test $? = 1; } | sed -e's,^\(.*\)://.*,\1,g')"
url=$(echo "$DATABASE_URL" | sed -e "s,$driver://,,g")

# extract the user and password (if any)
userpass="$(echo "$url" | { grep @ || test $? = 1; } | cut -d@ -f1)"
password=$(echo "$userpass" | { grep : || test $? = 1; } | cut -d: -f2)
if [ -n "$password" ]; then
    user=$(echo "$userpass" | { grep : || test $? = 1; } | cut -d: -f1)
else
    user=$userpass
fi

# extract the host -- updated
hostport=$(echo "$url" | sed -e "s,$userpass@,,g" | cut -d/ -f1)
port=$(echo "$hostport" | { grep : || test $? = 1; } | cut -d: -f2)
if [ -n "$port" ]; then
    host=$(echo "$hostport" | { grep : || test $? = 1; } | cut -d: -f1)
else
    host=$hostport
fi

# extract the path (if any)
database="$(echo "$url" | { grep / || test $? = 1; } | cut -d/ -f2- | cut -d? -f1)"

DEPS_TIMEOUT=${DEPS_TIMEOUT:=60}

entrypoint_info "Waiting up to $DEPS_TIMEOUT seconds for remote db \"$driver://$user:<password>@$host:$port/$database\" ..."

# https://stackoverflow.com/a/70362046/4156752 Elapsed time
start_time="$(date -u +%s)"
current_time="$(date -u +%s)"
elapsed_seconds=$((current_time - start_time))

if [[ $driver == 'mysql' ]]; then
  : "${port:=3306}"
  until [ $elapsed_seconds -gt $DEPS_TIMEOUT ] || mysql --host="$host" --port="$port" --user="$user" --password="$password" -e "SELECT 1" >/dev/null 2>&1; do
    current_time="$(date -u +%s)"
    elapsed_seconds=$((current_time - start_time))
    # TODO: Show message in a debug mode
    #entrypoint_warn "Still waiting for db to be ready... Or maybe the db is not reachable. $((DEPS_TIMEOUT - elapsed_seconds)) seconds left"
    sleep 1
  done
elif [[ $driver == 'pgsql' ]]; then
  : "${port:=5432}"
  until [ $elapsed_seconds -gt $DEPS_TIMEOUT ] || pg_isready --host="$host" --port="$port" --username="$user" --dbname="$database" >/dev/null 2>&1; do
    current_time="$(date -u +%s)"
    elapsed_seconds=$((current_time - start_time))
    # TODO: Show message in a debug mode
    #entrypoint_warn "Still waiting for db to be ready... Or maybe the db is not reachable. $((DEPS_TIMEOUT - elapsed_seconds)) seconds left"
    sleep 1
  done
else
  entrypoint_error 'Database not supported! Use either MySQL or PostgreSQL'
  exit 1
fi

if [ $elapsed_seconds -gt $DEPS_TIMEOUT ]; then
  entrypoint_error 'The db is not up or not reachable'
  exit 1
else
  entrypoint_info 'The db is now ready and reachable'
fi
