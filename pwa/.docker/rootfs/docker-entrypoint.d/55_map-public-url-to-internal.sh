#!/bin/bash
set -e -u -o pipefail

# Check if API_URL is set
if [[ -z "${API_URL:-}" ]] || [[ -z "${PUBLIC_API_URL:-}" ]]; then
  entrypoint_error 'API_URL or PUBLIC_API_URL are not set'
  exit 1
fi

# extract proto/scheme
proto="$(echo "$API_URL" | { grep '://' || test $? = 1; } | sed -e's,^\(.*\)://.*,\1,g')"
url=$(echo "$API_URL" | sed -e "s,$proto://,,g")
# extract the host -- updated
hostport=$(echo "$url" | cut -d/ -f1)
port=$(echo "$hostport" | { grep : || test $? = 1; } | cut -d: -f2)
if [ -n "$port" ]; then
    host=$(echo "$hostport" | { grep : || test $? = 1; } | cut -d: -f1)
else
    host=$hostport
fi

public_proto="$(echo "$PUBLIC_API_URL" | { grep '://' || test $? = 1; } | sed -e's,^\(.*\)://.*,\1,g')"
public_url=$(echo "$PUBLIC_API_URL" | sed -e "s,$public_proto://,,g")
public_hostport=$(echo "$public_url" | cut -d/ -f1)
public_port=$(echo "$public_hostport" | { grep : || test $? = 1; } | cut -d: -f2)
if [ -n "$public_port" ]; then
    public_host=$(echo "$public_hostport" | { grep : || test $? = 1; } | cut -d: -f1)
else
    public_host=$public_hostport
fi

api_ip=$(dig "$host" +short)

if [ -n "$api_ip" ]; then
  #grep -v -e "$host$" /etc/hosts | tee /etc/hosts >/dev/null # TODO: This doesn't seem to always work. Why? Is it necessary?
  echo -e "$api_ip\t$public_host" | tee -a /etc/hosts >/dev/null

  entrypoint_info "Host '$public_host' added as with IP address '$api_ip' ('$host') to /etc/hosts"
else
  entrypoint_error "Giving up, no IP address for host '$host' found!"
  exit 1
fi
