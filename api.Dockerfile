ARG PHP_VERSION=8.2

# -----------------------------------------------------------------------------
# Base image with common dependencies for prod & dev and php & nginx installation
# -----------------------------------------------------------------------------
FROM debian:bookworm-slim AS base

# Switch shell to bash for better support
SHELL ["/bin/bash", "-e", "-u", "-x", "-o", "pipefail", "-c"]

ARG PHP_VERSION
# Fix apt warning "TERM is not set" (https://stackoverflow.com/a/35976127/4156752)
ARG DEBIAN_FRONTEND=noninteractive

# Download and cache apt packages
RUN rm -f /etc/apt/apt.conf.d/docker-clean \
    && echo 'Binary::apt::APT::Keep-Downloaded-Packages "true";' >/etc/apt/apt.conf.d/keep-cache
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    # Update system first
    apt-get update -qq \
    && apt-get dist-upgrade -qq >/dev/null \
    \
    # Install locales first
    && apt-get -qq install \
        locales >/dev/null \
    # Create locale files (uncomments the langauges we want to generate)
    && sed -i -e '/de_CH.UTF-8 UTF-8/s/^# //' /etc/locale.gen \
    && sed -i -e '/de_CH ISO-8859-1/s/^# //' /etc/locale.gen \
    && sed -i -e '/de_DE.UTF-8 UTF-8/s/^# //' /etc/locale.gen \
    && sed -i -e '/de_DE ISO-8859-1/s/^# //' /etc/locale.gen \
    && locale-gen \
    \
    # Install additional packages
    && apt-get -qq install \
        lsb-release \
        bash-completion \
        openssl \
        ca-certificates \
        curl \
        gnupg \
        wget \
        git \
        ncdu \
        vim \
        neovim \
        nano \
        # For composer to download packages
        unzip \
        # To run multiple processes simultaneously
        supervisor \
        # For the envsubst command
        gettext-base \
        # For cronjobs
        cron \
        # Required to check connectivity
        default-mysql-client \
        postgresql-client \
        # Required for healthcheck
        libfcgi-bin \
        # For the wait-for.sh which uses nc to check for server
        netcat-traditional >/dev/null \
    \
    # Install PHP & Nginx (https://packages.sury.org/php/README.txt & https://packages.sury.org/nginx/README.txt)
    && curl --fail --silent --show-error --location --output /usr/share/keyrings/deb.sury.org-php.gpg https://packages.sury.org/php/apt.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/deb.sury.org-php.gpg] https://packages.sury.org/php/ $(lsb_release -sc) main" >/etc/apt/sources.list.d/php.list \
    && curl --fail --silent --show-error --location --output /usr/share/keyrings/deb.sury.org-nginx.gpg https://packages.sury.org/nginx/apt.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/deb.sury.org-nginx.gpg] https://packages.sury.org/nginx/ $(lsb_release -sc) main" >/etc/apt/sources.list.d/nginx.list \
    && apt-get update -qq \
    && apt-get -qq install \
        nginx \
        brotli \
        php${PHP_VERSION}-fpm \
        # For connecting to databases
        php${PHP_VERSION}-mysql \
        php${PHP_VERSION}-pgsql \
        # Phive requires
        php${PHP_VERSION}-curl \
        php${PHP_VERSION}-dom \
        php${PHP_VERSION}-mbstring \
        # User for Symfony validators
        php${PHP_VERSION}-intl >/dev/null

ENV PHP_DIR=/etc/php/$PHP_VERSION/fpm
RUN \
    # Fix missing default binaries
    ln --symbolic php-fpm$PHP_VERSION /usr/sbin/php-fpm \
    # By default, PHP-FPM uses the production config, which can be found in
    # "/usr/lib/php/$PHP_VERSION/php.ini-production"
    #&& ln --symbolic --force /usr/lib/php/$PHP_VERSION/php.ini-production $PHP_DIR/php.ini \
    \
    # Set time zone
    && ln --symbolic --force /usr/share/zoneinfo/Europe/Zurich /etc/localtime \
    && sed -i '/^;date\.timezone/s/^;//' $PHP_DIR/php.ini \
    && sed -i 's/^\(date\.timezone =\).*/\1\ \"Europe\/Zurich\"/' $PHP_DIR/php.ini \
    \
    # Smoke tests
    && php --version \
    && php-fpm --version \
    && nginx -v \
    \
    && { \
        # Add custom PS1
        # https://strasis.com/documentation/limelight-xe/reference/ecma-48-sgr-codes
        echo 'export PS1="🐳 \e[38;5;46m\u@\h\e[0m:\e[38;5;33m\w\e[0m\\$ "'; \
        # Add bash auto completion
        echo 'source /etc/profile.d/bash_completion.sh'; \
    } >>"$HOME/.bashrc" \
    \
    # Create non-root user/group (1000:1000) for app and delete www-data
    && useradd --create-home --shell /bin/bash app \
    && mkdir -p /app \
    && chown -R app:app /app \
    # Delete the www-data user and use default 1000 (which also happens to
    # match vagrant's default user to avoid permission issues)
    && find / -user 33 ! -path '/proc/*' -exec chown -h app {} \; \
    && userdel www-data \
    && { \
        # Same as above (except bash completion, because it's already in the bashrc)
        echo 'export PS1="🐳 \e[38;5;46m\u@\h\e[0m:\e[38;5;33m\w\e[0m\\$ "'; \
    } >>/home/app/.bashrc \
    \
    # Forward request and error logs to docker log collector
    && ln --symbolic --force /dev/stdout /var/log/nginx/access.log \
    && ln --symbolic --force /dev/stderr /var/log/nginx/error.log \
    # Fix nginx package doesn't use file endings for sites
    && mv /etc/nginx/sites-available/default /etc/nginx/sites-available/default.conf \
    && rm /etc/nginx/sites-enabled/default \
    && ln --symbolic --force ../sites-available/default.conf /etc/nginx/sites-enabled/default.conf \
    \
    # Add healthcheck script for PHP-FPM (https://github.com/renatomefi/php-fpm-healthcheck)
    && curl --fail --silent --show-error --location --output /usr/local/bin/php-fpm-healthcheck \
        https://raw.githubusercontent.com/renatomefi/php-fpm-healthcheck/master/php-fpm-healthcheck \
    && chmod +x /usr/local/bin/php-fpm-healthcheck \
    \
    # Add log files in /var/log (cannot be done in process running as "app" as
    # folder belongs to root)
    && touch /var/log/xdebug.log \
    && chmod a+w /var/log/xdebug.log \
    && touch /var/log/cron.log \
    && chmod a+w /var/log/cron.log \
    \
    # Add cronjob for root to clean PHP session files every night (if env var
    # CLEAR_SESSIONS_IN is set with the session files directory) user's app
    # cronjobs are usually overwritten by projects
    && (crontab -l; echo '0 0 * * * clear-sessions.sh 2>&1 | tee -a /var/log/cron.log') | crontab - \
    \
    # Setup PHP-FPM for Docker (https://github.com/docker-library/php/blob/master/8.2/bookworm/fpm/Dockerfile)
    # Forward errors to stderr
    && sed -i 's/^\(error_log =\).*/\1\ \/proc\/self\/fd\/2/' $PHP_DIR/php-fpm.conf \
    # Increase log limit to avoid e.g. breaking back traces (https://github.com/docker-library/php/pull/725#issuecomment-443540114)
    && sed -i '/^;log_limit/s/^;//' $PHP_DIR/php-fpm.conf \
    && sed -i 's/^\(log_limit =\).*/\1\ 8192/' $PHP_DIR/php-fpm.conf \
    # php-fpm closes STDOUT on startup, so sending logs to /proc/self/fd/1 does
    # not work. (https://bugs.php.net/bug.php?id=73886)
    && sed -i '/^;access\.log/s/^;//' $PHP_DIR/pool.d/www.conf \
    && sed -i 's/^\(access\.log =\).*/\1\ \/proc\/self\/fd\/2/' $PHP_DIR/pool.d/www.conf \
    # Pass all environment variables to PHP-FPM
    && sed -i '/^;clear_env/s/^;//' $PHP_DIR/pool.d/www.conf \
    # Ensure worker stdout and stderr are sent to the main error log.
    && sed -i '/^;catch_workers_output/s/^;//' $PHP_DIR/pool.d/www.conf \
    && sed -i '/^;decorate_workers_output/s/^;//' $PHP_DIR/pool.d/www.conf \
    # Don't use daemon, supervisor needs the process to stay in foreground
    && sed -i '/^;daemonize/s/^;//' $PHP_DIR/php-fpm.conf \
    && sed -i 's/^\(daemonize =\).*/\1\ no/' $PHP_DIR/php-fpm.conf \
    # Use more general path for socket
    && sed -i 's/\(listen =\).*/\1\ \/run\/php\/php-fpm.sock/' $PHP_DIR/pool.d/www.conf \
    # Fix problem with logging to stdout (https://github.com/docker-library/php/issues/878#issuecomment-938595965)
    && sed -i '/^;fastcgi\.logging/s/^;//' $PHP_DIR/php.ini \
    \
    # Enable php fpm status page (https://github.com/renatomefi/php-fpm-healthcheck/blob/master/test/Dockerfile-buster)
    && echo 'pm.status_path = /status' >>$PHP_DIR/php-fpm.conf \
    \
    # Other settings
    # Use new default user app for everything
    && sed -i 's/^\(user =\).*/\1\ app/' $PHP_DIR/pool.d/www.conf \
    && sed -i 's/^\(group =\).*/\1\ app/' $PHP_DIR/pool.d/www.conf \
    && sed -i 's/^\(listen\.owner =\).*/\1\ app/' $PHP_DIR/pool.d/www.conf \
    && sed -i 's/^\(listen\.group =\).*/\1\ app/' $PHP_DIR/pool.d/www.conf \
    # Set memory limited to unlimited and use Docker memory limits instead
    && sed -i 's/^\(memory_limit =\).*/\1\ -1/' $PHP_DIR/php.ini \
    # Change upload limit to a desirable value (use 0 for unlimited)
    # General rule: memory_limi > post_max_size > upload_max_filesize
    && sed -i 's/^\(post_max_size =\).*/\1\ 100M/' $PHP_DIR/php.ini \
    && sed -i 's/^\(upload_max_filesize =\).*/\1\ 100M/' $PHP_DIR/php.ini \
    \
    # Improve performance for prod with OPcache (https://symfony.com/doc/current/performance.html)
    # OPcache can compile and load classes at start-up and make them available to all requests until the server is restarted
    && sed -i '/^;opcache.preload/s/^;//' $PHP_DIR/php.ini \
    && sed -i 's/^\(opcache.preload=\).*/\1\ \/app\/config\/preload.php/' $PHP_DIR/php.ini \
    # required for opcache.preload
    && sed -i '/^;opcache.preload_user/s/^;//' $PHP_DIR/php.ini \
    && sed -i 's/^\(opcache.preload_user=\).*/\1\ app/' $PHP_DIR/php.ini \
    # Maximum memory that OPcache can use to store compiled PHP files (min 8, so cannot be set to unlimited)
    && sed -i '/^;opcache.memory_consumption/s/^;//' $PHP_DIR/php.ini \
    && sed -i 's/^\(opcache.memory_consumption=\).*/\1\ 256/' $PHP_DIR/php.ini \
    # maximum number of files that can be stored in the cache (calculate with "find")
    && sed -i '/^;opcache.max_accelerated_files/s/^;//' $PHP_DIR/php.ini \
    && sed -i 's/^\(opcache.max_accelerated_files=\).*/\1\ 20000/' $PHP_DIR/php.ini \
    # When a relative path is transformed into its real and absolute path, PHP
    # caches the result to improve performance. Applications that open many PHP
    # files, such as Symfony projects, should use at least these values:
    # maximum memory allocated to store the results
    && sed -i '/^;realpath_cache_size/s/^;//' $PHP_DIR/php.ini \
    && sed -i 's/^\(realpath_cache_size =\).*/\1\ 4096K/' $PHP_DIR/php.ini \
    # save the results for 10 minutes (600 seconds)
    && sed -i '/^;realpath_cache_ttl/s/^;//' $PHP_DIR/php.ini \
    && sed -i 's/^\(realpath_cache_ttl =\).*/\1\ 600/' $PHP_DIR/php.ini

COPY .docker/rootfs/common /
COPY api/.docker/rootfs /

ENV RUNTIME_ENVIRONMENT=prod \
    APP_ENV=prod

WORKDIR /app

EXPOSE 80

#HEALTHCHECK --interval=10s --timeout=3s --start-period=30s --retries=3 CMD php-fpm-healthcheck && curl --fail http://localhost || exit 1

# Start supervisor (http://supervisord.org) as root
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]

# -----------------------------------------------------------------------------
# Shared tools
# -----------------------------------------------------------------------------
FROM base AS composer
RUN \
    # Install Composer (https://getcomposer.org/doc/faqs/how-to-install-composer-programmatically.md)
    EXPECTED_CHECKSUM="$(php -r 'copy("https://composer.github.io/installer.sig", "php://stdout");')" \
    && php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && ACTUAL_CHECKSUM="$(php -r "echo hash_file('sha384', 'composer-setup.php');")" \
    && if [ "$EXPECTED_CHECKSUM" != "$ACTUAL_CHECKSUM" ]; then \
        >&2 echo 'ERROR: Invalid installer checksum' \
        && rm composer-setup.php \
        && exit 1; \
    fi \
    && php composer-setup.php \
        --quiet \
        --install-dir=/usr/local/bin \
        --filename=composer \
    && rm composer-setup.php

# -----------------------------------------------------------------------------
# Dev image with dev tools like XDebug, Composer, etc.
# -----------------------------------------------------------------------------
FROM base AS dev

WORKDIR /

RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    # Install Symfony CLI
    curl --tlsv1 --fail --silent --show-error --location https://dl.cloudsmith.io/public/symfony/stable/setup.deb.sh | bash \
    && apt-get -qq install \
        symfony-cli \
        php${PHP_VERSION}-xdebug >/dev/null

COPY --from=composer /usr/local/bin/composer /usr/local/bin/composer

RUN \
    # Install PHP tools using Phive
    wget -O phive.phar https://phar.io/releases/phive.phar \
    && wget -O phive.phar.asc https://phar.io/releases/phive.phar.asc \
    && gpg --keyserver hkps://keys.openpgp.org --recv-keys 0x9D8A98B29B2D5D79 \
    && gpg --verify phive.phar.asc phive.phar \
    && chmod +x phive.phar \
    && mv phive.phar /usr/local/bin/phive \
    && mkdir --parents ~/.phive \
    && phive --home ~/.phive --no-progress install --trust-gpg-keys CF1A108D0E7AE720,31C7E470E2138192,E82B2FB314E9906E --target /usr/local/bin \
        phpcs \
        phpcbf \
        php-cs-fixer \
    # Install PHPStan
    && mkdir --parents /usr/local/src/phpstan \
    && COMPOSER_ALLOW_SUPERUSER=1 composer require --working-dir=/usr/local/src/phpstan phpstan/phpstan \
    && COMPOSER_ALLOW_SUPERUSER=1 composer config --working-dir=/usr/local/src/phpstan --no-plugins allow-plugins.phpstan/extension-installer true \
    && COMPOSER_ALLOW_SUPERUSER=1 composer require --working-dir=/usr/local/src/phpstan phpstan/extension-installer \
    && COMPOSER_ALLOW_SUPERUSER=1 composer require --working-dir=/usr/local/src/phpstan phpstan/phpstan-doctrine phpstan/phpstan-phpunit phpstan/phpstan-symfony \
    && ln --symbolic /usr/local/src/phpstan/vendor/bin/phpstan /usr/local/bin/phpstan \
    # Install Rector
    && mkdir --parents /usr/local/src/rector \
    && COMPOSER_ALLOW_SUPERUSER=1 composer require --working-dir=/usr/local/src/rector rector/rector \
    && ln --symbolic /usr/local/src/rector/vendor/bin/rector /usr/local/bin/rector \
    \
    # Smoke tests
    && php --version | grep 'Xdebug' \
    && composer --version \
    && symfony version \
    && phpcs --version \
    && phpcbf --version \
    && php-cs-fixer --version \
    && phpstan --version \
    && rector --version
RUN \
    # Values used inside php.ini-development
    sed -i 's/^\(zend.exception_ignore_args =\).*/\1\ Off/' $PHP_DIR/php.ini \
    && sed -i 's/^\(zend.exception_string_param_max_len =\).*/\1\ 15/' $PHP_DIR/php.ini \
    && sed -i 's/^\(expose_php =\).*/\1\ On/' $PHP_DIR/php.ini \
    && sed -i 's/^\(error_reporting =\).*/\1\ E_ALL/' $PHP_DIR/php.ini \
    && sed -i 's/^\(display_errors =\).*/\1\ On/' $PHP_DIR/php.ini \
    && sed -i 's/^\(display_startup_errors =\).*/\1\ On/' $PHP_DIR/php.ini \
    && sed -i 's/^\(mysqlnd.collect_memory_statistics =\).*/\1\ On/' $PHP_DIR/php.ini \
    \
    # Setup XDebug
    && { \
        echo; \
        echo 'xdebug.mode = develop,coverage,debug'; \
        # If enabled, Xdebug will first try to connect to the client that made
        # the HTTP request. It checks the $_SERVER['HTTP_X_FORWARDED_FOR'] and
        # $_SERVER['REMOTE_ADDR'] variables to find out which hostname or IP
        # address to use.
        echo 'xdebug.discover_client_host = true'; \
        echo 'xdebug.idekey = PHPSTORM'; \
        # XDebug can't write to /dev/stdout, so we read it indirectly with a
        # separated supervisord process
        echo 'xdebug.log = "/var/log/xdebug.log"'; \
        echo 'xdebug.log_level = 5'; \
    } >>"$PHP_DIR/php.ini" \
    \
    # Fix issue with GIT "detected dubious ownership in repository" error in
    # local development due to CVE-2022-24765 (https://github.com/git/git/commit/8959555cee7ec045958f9b6dd62e541affb7e7d9)
    && git config --global --add safe.directory /app

WORKDIR /app

# -----------------------------------------------------------------------------
# Prod build
# -----------------------------------------------------------------------------
FROM base AS prod-deps
COPY --from=composer /usr/local/bin/composer /usr/local/bin/composer
COPY --chown=app:app api/composer.json api/composer.lock api/symfony.lock ./
RUN --mount=type=cache,target=/home/app/.composer/cache \
    --mount=type=ssh,required=true \
    # Don't use ~/.ssh/known_hosts (see https://stackoverflow.com/a/73264002/4156752)
    ssh-keyscan -t ed25519 github.com >>/etc/ssh/ssh_known_hosts \
    # Install composer dependencies (see https://stackoverflow.com/a/21921309/4156752)
    # https://symfony.com/doc/current/performance.html#optimize-composer-autoloader
    # https://getcomposer.org/doc/articles/autoloader-optimization.md \
    # "--classmap-authoritative" doesn't work -> "Uncaught Error: Class "App\Kernel" not found in /app/bin/console:14"
    && COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader --no-scripts --no-interaction

FROM base AS prod
COPY --from=prod-deps /app .
COPY api .
RUN \
    # Further optimize php.ini for production
    # maximum number of files that can be stored in the cache (calculate with "find")
    sed -i "s/^\(opcache.max_accelerated_files=\).*/\1\ $(find /app -type f -print | grep -c php)/" $PHP_DIR/php.ini \
    # In production servers, PHP files should never change, unless a new
    # application version is deployed. However, by default OPcache checks if
    # cached files have changed their contents since they were cached.
    && sed -i '/^;opcache.validate_timestamps/s/^;//' $PHP_DIR/php.ini \
    && sed -i 's/^\(opcache.validate_timestamps=\).*/\1\ 0/' $PHP_DIR/php.ini \
    \
    # Clean up after copying files to /app
    && rm -rf \
        .docker \
        tests \
    && rm -f \
        .env.test \
        .gitignore \
        phpunit.xml.dist
