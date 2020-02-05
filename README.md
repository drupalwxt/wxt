# Web Experience Toolkit: Drupal WxT

[![Build Status][travisci-badge]][travisci]

## Important

Drupal WxT for Drupal 8 is currently under release candidate phase and now will
provide an update path for all future releases.

## Important Links

- Documentation Website: [drupalwxt.github.io][docsite]
- GitHub Repository: [drupalwxt/wxt][github-wxt]
- Drupal Repository: [drupal.org/project/wxt][drupal]
- Composer Project: [drupalwxt/site-wxt][github-site-wxt]
- Helm Chart: [drupalwxt/helm-drupal][github-helm]
- Containers: [hub.docker.com][docker-hub]
- Live Demo: [demo][demo]
- Run it Now: [simplytest.me][simplytest]
- Issue Queue: [Drupal][issue-drupal] (Primary)
- Issue Queue: [GitHub][issue-github]

## Overview

The Drupal WxT distribution is a web content management system which assists in
building and maintaining innovative Web sites that are accessible, usable, and
interoperable. This distribution is open source software and free for use by
departments and external Web communities. This distribution relies and
integrates extensively with the [WET-BOEW jQuery Framework][wet-boew] for
improved accessible markup.

## Architecture

This install profile directly extends from the [Lightning Framework][lightning]
created by [Acquia][acquia] to provide developers with a powerful base toolchain
upon which to extend. Due to this strict dependency we also align much of our
workflow with the best practice established patterns `Acquia` has provided.

### Lightning

Lightning is something that is being used by and built for governments, and provides 
much of what is needed to create a Drupal-based content management system that meets 
the needs of the Government of Canada. It's also used as the basis of government 
Drupal platforms around the world.

* https://www.acquia.com/blog/building-drupal-8-sites-acquia-lightning-cuts-costs-100000
* https://www.drupal.org/docs/8/distributions/degov/about-degov
* https://github.com/govcms/govcms8

## 8.x - Recommended Installation

We highly recommend using <a href="https://getcomposer.org" rel="nofollow">Composer</a>
to build and maintain your WxT derived project’s codebase.

```sh
composer create-project drupalwxt/wxt-project:8.x-dev MYPROJECT --no-interaction
```

[Install with Composer][project-new]

> We recommend a composer version of 1.8.1 or greater due to fixes made upstream.

For more information on creating and maintaining your WxT project with composer,
see our [WxT Project README][project].

### Installation from exported config

If you have a config export of a site built with Lighting, you can install it using the
Config Installer profile. You can find more information about installing WxT (Lightning)
from exported config [config-install][here]</a>.

### Tarball Installation

The tarball distributed here on drupal.org is deprecated and does not install correctly
because drupal.org does not package WxT's Composer dependencies.

To work around this, we are providing tarballs on our GitHub page, which contain the
required dependencies and will work properly. Visit our list of releases on GitHub, and
under "Downloads", grab the desired wxt-VERSION.tar.gz file. (Sept 8th)

If you MUST use the tarball here on drupal.org, you will still need Composer installed.
Once you extract the tarball, run the following command from within your web root to
install the required dependencies:

```sh
composer require 'j7mbo/twitter-api-php' 'league/oauth2-server:~7.1' 'drupal/core-recommended:8.8.2' 'phpdocumentor/reflection-docblock:^3.0||^4.0'
```

> Note: Please see our [tarball.sh](tarball.sh) script for how we are doing this.

## Site Installation

Install the site using drush which should take approximately 4-5 minutes depending on your system.

```sh
drush si wxt
  --sites-subdir=default \
  --db-url=mysql://root:WxT@mysql:3306/wxt \
  --account-name=admin \
  --account-pass=WxT \
  --site-mail=admin@example.com \
  --site-name="Drupal Install Profile (WxT)" \
  install_configure_form.update_status_module='array(FALSE,FALSE)' \
  --yes
```

> Note: If you work for the Government of Canada you might want to enable the `canada.ca` theme. You can navigate to the `WxT Library` settings page or run the Drush command below.

```sh
drush config-set wxt_library.settings wxt.theme theme-gcweb -y
```

## Installation of Default Content via Migrate

```sh
drush migrate:import --group wxt --tag 'Core'
drush migrate:import --group gcweb --tag 'Core'
drush migrate:import --group gcweb --tag 'Menu'
drush config-set wxt_library.settings wxt.theme theme-gcweb -y
drush cr
```

### WxT

Imports examples of common design patterns for WxT branded sites.

```sh
drush migrate:import --group wxt --tag 'Core'
```

> Note: There is a group wxt_translation for importing the corresponding french content.

### Canada

Imports examples of common design patterns for Canada.ca aligning to C&IA specification.

```sh
drush migrate:import --group wxt --tag 'Core'
drush migrate:import --group gcweb --tag 'Core'
drush migrate:import --group gcweb --tag 'Menu'
```

> Note: There is a group gcweb_translation for importing the corresponding french content.

### Groups

We also provide an example of importing groups via a json feed from open.canada.ca that will create a group for every government department where you can isolate content acess.

```sh
drush en wxt_ext_group -y
drush migrate:import --group gcweb --tag 'Group'
```

> Note: Make sure to only have one set of menu's imported for each of the supported themes. Leverage migrate:rollback to assist with this requirement.


### Container

For the (optional) container based development workflow this is roughly the steps that are followed.

> Note: That [docker-sync](docker-sync) is installed on a MacOSX host to fix performance issues related to volume mounting. Linux and Windows do not have this restriction.

```sh
# Composer install
export COMPOSER_MEMORY_LIMIT=-1 && composer install

# Make our base docker image
make build

# MacOSX only (docker-sync)
docker volume create --name=docroot-sync && docker volume create --name=root-sync && docker-sync start

# Bring up the dev stack
# Use docker-compose.sync.yml for MacOSX
docker-compose -f docker-compose.yml up -d

# Install Drupal
make drupal_install

# Development configuration
./docker/bin/drush config-set system.performance js.preprocess 0 -y && \
  ./docker/bin/drush config-set system.performance css.preprocess 0 -y && \
  ./docker/bin/drush php-eval 'node_access_rebuild();' && \
  ./docker/bin/drush config-set wxt_library.settings wxt.theme theme-gcweb -y && \
  ./docker/bin/drush cr

# Migrate default content
./docker/bin/drush migrate:import --group wxt --tag 'Core' && \
  ./docker/bin/drush migrate:import --group gcweb --tag 'Core' && \
  ./docker/bin/drush migrate:import --group gcweb --tag 'Menu'
```

## Version History

### Changelog

- [CHANGELOG.md][changelog]

### Releases

- [Drupal.org][release-drupal]
- [GitHub][release-github]

## Contributor(s)

Contributor(s): https://github.com/drupalwxt/wxt/graphs/contributors

<!-- Links Referenced -->

[acquia]:               https://acquia.com
[changelog]:            https://github.com/drupalwxt/wxt/blob/8.x-3.x/CHANGELOG.md
[config-install]:       https://lightning.acquia.com/blog/using-configuration-installer-lightning
[demo]:                 https://drupalwxt.govcloud.ca
[docsite]:              http://drupalwxt.github.io
[docker-hub]:           https://hub.docker.com/r/drupalwxt/site-wxt
[docker-sync]:          https://github.com/EugenMayer/docker-sync
[drupal]:               http://drupal.org/project/wxt
[drupal7]:              http://drupal.org/project/wetkit
[github-helm]:          https://github.com/drupalwxt/helm-drupal
[github-wxt]:           https://github.com/drupalwxt/wxt
[github-site-wxt]:      https://github.com/drupalwxt/site-wxt
[issue-drupal]:         https://drupal.org/project/issues/wxt
[issue-github]:         https://github.com/drupalwxt/wxt/issues
[lightning]:            https://github.com/acquia/lightning
[panopoly]:             https://github.com/panopoly/panopoly
[pantheon]:             https://pantheon.io
[project]:              https://github.com/drupalwxt/wxt-project#user-content-new-project
[project-new]:          https://github.com/drupalwxt/wxt-project#user-content-new-project
[release-drupal]:       https://github.com/drupalwxt/wxt/releases
[release-github]:       https://github.com/drupalwxt/wxt/releases
[simplytest]:           http://simplytest.me/project/wxt/8.x-3.x
[travisci]:             https://travis-ci.org/drupalwxt/wxt
[travisci-badge]:       https://travis-ci.org/drupalwxt/wxt.png?branch=8.x-3.x
[wet-boew]:             https://github.com/wet-boew/wet-boew
