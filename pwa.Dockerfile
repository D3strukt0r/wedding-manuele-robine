# -----------------------------------------------------------------------------
# Base image with common dependencies for prod & dev and node installation
# -----------------------------------------------------------------------------
FROM debian:bookworm-slim AS base

# Switch shell to bash for better support
SHELL ["/bin/bash", "-e", "-u", "-x", "-o", "pipefail", "-c"]

ARG NODE_VERSION=20
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
    # apt-utils to fix "debconf: delaying package configuration, since apt-utils is not installed" but also needs "DEBIAN_FRONTEND=noninteractive"
    && apt-get -qq install \
        apt-utils \
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
        # To run multiple processes simultaneously
        supervisor \
        # For the wait-for.sh which uses nc to check for server
        netcat-traditional >/dev/null \
    \
    # Install Node.js
    && mkdir -p /etc/apt/keyrings \
    && curl --fail --silent --show-error --location https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_VERSION.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update -qq \
    && apt-get -qq install \
        nodejs >/dev/null

RUN \
    # Set time zone
    ln --symbolic --force /usr/share/zoneinfo/Europe/Zurich /etc/localtime \
    \
    # Use Node.js corepack to enable pnpm
    && corepack enable \
    \
    # Smoke tests
    && node --version \
    && pnpm --version \
    \
    && { \
        # Add custom PS1
        # https://strasis.com/documentation/limelight-xe/reference/ecma-48-sgr-codes
        echo 'export PS1="🐳 \e[38;5;46m\u@\h\e[0m:\e[38;5;33m\w\e[0m\\$ "'; \
        # Add bash auto completion
        echo 'source /etc/profile.d/bash_completion.sh'; \
    } >>"$HOME/.bashrc" \
    \
    # Create non-root user/group (1000:1000) for app
    && useradd --create-home --shell /bin/bash app \
    && mkdir -p /app \
    && chown -R app:app /app \
    && { \
        # Same as above (except bash completion, because it's already in the bashrc)
        echo 'export PS1="🐳 \e[38;5;46m\u@\h\e[0m:\e[38;5;33m\w\e[0m\\$ "'; \
    } >>/home/app/.bashrc

COPY .docker/rootfs/common /
COPY pwa/.docker/rootfs /

WORKDIR /app

EXPOSE 80

# Start supervisor (http://supervisord.org) as root
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["supervisord", "-c", "/etc/supervisor/supervisord.conf"]

# -----------------------------------------------------------------------------
# Dev environment with HMR server (only has HTTPS server)
# -----------------------------------------------------------------------------
FROM base AS dev

# -----------------------------------------------------------------------------
# Prod build (Build is done in separate stage)
# -----------------------------------------------------------------------------
# Keep prod dependencies in prod environemnt
FROM base AS prod-deps
COPY pwa/package.json pwa/pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/app/.pnpm-store \
    pnpm install --prod --frozen-lockfile

# Build PWA application
FROM base AS build
COPY pwa/package.json pwa/pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/app/.pnpm-store \
    pnpm install --frozen-lockfile
COPY pwa/.browserslistrc pwa/svelte.config.js pwa/tsconfig.json pwa/vite.config.ts ./
COPY pwa/src src
COPY pwa/static static
RUN pnpm run build

# Prod build
FROM base AS prod
COPY --from=prod-deps /app .
COPY --from=build /app .
COPY pwa .
RUN \
    # Clean up after copying files to /app
    rm -rf \
        .docker \
        .svelte-kit \
        src \
        static \
        tests \
    && rm -f \
        .browserslistrc \
        .eslintignore \
        .eslintrc.cjs \
        .gitignore \
        .npmrc \
        .prettierignore \
        .prettierrc.cjs \
        playwright.config.ts \
        README.md \
        svelte.config.js \
        tsconfig.json \
        vite.config.ts
