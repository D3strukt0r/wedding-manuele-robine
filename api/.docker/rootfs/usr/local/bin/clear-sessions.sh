#!/bin/bash
set -e -u -o pipefail

if [ -n "${CLEAR_SESSIONS_IN:-}" ]; then
  echo "Running garbage collection on PHP sessions in ${CLEAR_SESSIONS_IN}"

  # session.gc_probability / session.gc_divisor = chance of running GC => 1/1 = 100%
  # any stored session that was saved more than session.gc_maxlifetime (1440s) ago should be deleted
  php -d session.save_path="${CLEAR_SESSIONS_IN}" \
    -d session.gc_probability=1 \
    -d session.gc_divisor=1 \
    -r "session_start(); session_destroy();"
fi
