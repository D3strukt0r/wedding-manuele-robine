#!/bin/bash
set -e -u -o pipefail

if php -r "exit(version_compare('3.0',phpversion('xdebug'),'>=')?1:0);"; then
    echo "xdebug-cli for version 3.0+ activated"
    export XDEBUG_CONFIG="discover_client_host=1 mode=debug client_host=10.0.2.2"
else
    echo "xdebug-cli for version 2.* activated"
    export XDEBUG_CONFIG="remote_enable=1 remote_mode=req remote_port=9000 remote_connect_back=0 remote_host=10.0.2.2"
fi
