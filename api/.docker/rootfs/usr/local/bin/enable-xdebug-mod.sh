#!/bin/bash
set -e -u -o pipefail

mv /etc/php/8.2/fpm/conf.d/20-xdebug.ini.disabled /etc/php/8.2/fpm/conf.d/20-xdebug.ini
