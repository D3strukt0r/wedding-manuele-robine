#!/bin/bash
set -e -u -o pipefail

DOCUMENT_ROOT=$(grep -E 'root .*;' /etc/nginx/sites-enabled/default.conf | awk -F 'root |;' '{print $2}')
ROBOTSTXT=${DOCUMENT_ROOT}/robots.txt

# Disallow spiders on non-prod-environment
if [ "${RUNTIME_ENVIRONMENT}" != 'prod' ] && [ "${RUNTIME_ENVIRONMENT}" != 'local' ]; then
  echo "User-agent: *" >"$ROBOTSTXT"
  echo "Disallow: /" >>"$ROBOTSTXT"

  entrypoint_info "Non-productive \"$ROBOTSTXT' written to disallow all spiders."
fi
