# Wedding for Manuele & Robine

The wedding page and manager for my own wedding. Might make it more customizable in the future.

[![License -> GitHub](https://img.shields.io/github/license/D3strukt0r/wedding-manuele-robine?label=License)](LICENSE.txt)
[![Static Badge](https://img.shields.io/badge/Contributor%20Covenant-2.0-4baaaa)](CODE_OF_CONDUCT.md)

[![Version -> GitHub release (with filter)](https://img.shields.io/github/v/release/D3strukt0r/wedding-manuele-robine?label=GitHub%20Release)][gh-releases]

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

* [Git](https://git-scm.com/) - Run `brew install git` (Only for macOS)
* [VirtualBox](https://www.virtualbox.org/) - Run `brew install virtualbox` (Only for macOS)
* [Vagrant](https://www.vagrantup.com/) - Run `brew install vagrant` (Only for macOS)

### Installing

Clone the project

```shell
git clone git@github.com:D3strukt0r/wedding-manuele-robine.git
cd wedding-manuele-robine
```

TODO

### Development

Start the project

```shell
vagrant up
```

* Initial VM Setup & Docker build & pull: ~6m 42s
* Initial Composer install: ~1m 18s ?
* Initial pNpm install: ~5m 38s ?
* Initial App startup: ~20s ?
* Subsequent startups: ~1m 7s (VM) + 26s (Docker) ?

Common commands

```shell
phpstan
phpstan analyse --generate-baseline

PHP_CS_FIXER_IGNORE_ENV=1 php-cs-fixer fix --dry-run -v --allow-risky=yes --diff --show-progress=dots
PHP_CS_FIXER_IGNORE_ENV=1 php-cs-fixer fix -v --allow-risky=yes --show-progress=dots

phpcs -p
phpcbf

rector process --dry-run
rector process

yarn run eslint --ext .js,.ts,.jsx,.tsx assets/
yarn run eslint --fix --ext .js,.ts,.jsx,.tsx assets/

yarn run prettier --check 'assets/**/*.{js,jsx,ts,tsx,less}'
yarn run prettier --write 'assets/**/*.{js,jsx,ts,tsx,less}'

yarn run stylelint assets/styles/
yarn run stylelint --fix assets/styles/
```

TODO

### Building

TODO

### Release

TODO

## Built With

* [Vite.js](https://vitejs.dev/)

## Contributing

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for details on our code of conduct, and [CONTRIBUTING.md](CONTRIBUTING.md) for the process for submitting pull requests to us.

## Versioning

We use [SemVer](https://semver.org/) for versioning. For the versions available, see the [tags on this repository][gh-tags].

## Authors

All the authors can be seen in the [AUTHORS.md](AUTHORS.md) file.

Contributors can be seen in the [CONTRIBUTORS.md](CONTRIBUTORS.md) file.

See also the full list of [contributors][gh-contributors] who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details

## Acknowledgments

A list of used libraries and code with their licenses can be seen in the [ACKNOWLEDGMENTS.md](ACKNOWLEDGMENTS.md) file.

[gh-releases]: https://github.com/D3strukt0r/wedding-manuele-robine/releases
[gh-tags]: https://github.com/D3strukt0r/wedding-manuele-robine/tags
[gh-contributors]: https://github.com/D3strukt0r/wedding-manuele-robine/graphs/contributors
