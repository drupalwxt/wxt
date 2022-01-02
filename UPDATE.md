## Updating

A reminder that **[composer](https://getcomposer.org/download/)** is required for the installation and updating of **[Drupal WxT](https://github.com/drupalwxt/wxt)**.

**[Drupal WxT][wxt]** relies on Drupal’s configuration system for configuring default features and functionality. A consequence of this is, once you have installed Drupal WxT, that we cannot modify the sites configuration without having an impact on your site. Drupal WxT will, however, offer to make changes to your configuration as part of the update process.

If you've installed WxT using our **[Composer-based project template][wxt-project]**, all you need to do is following the given steps below.

## Update Process

When pushing to production you should make sure everything has been tested in a local development environment.

These are the typical steps you should following when updating Drupal WxT:

a) Read the **[release notes][releases]** for the release to which you are updating along with any releases in between.

b) To update your WxT codebase you would replace `[VERSION]` with the release version you wish to use.

```sh
composer self update
composer require drupalwxt/wxt:[VERSION]
composer update
```

> **Note**: We highly recommend that you are using the v2.x.x line of Composer.

c) Run any database updates:

```sh
drush cache:rebuild
drush updatedb
```

> **Note**: You may instead go to `/admin/config/development/performance` to clear caches and `/update.php` to run database updates.

d) Run any WxT configuration updates:

```sh
drush cache:rebuild
drush update:wxt
```

> **Note**: You may instead go to `/admin/config/development/performance` to clear caches and `/update.php` to run WxT updates.

## Configuration Management

If you are using configuration management to move your configuration between development, staging, and production environments, you should follow the standard Drupal process.

a) Export the new configuration:

```sh
drush cache:rebuild
drush config:export
```

b) Commit the code and configuration changes to your source code repository and push them to your environment.

c) Import any configuration changes:

```sh
drush cache:rebuild
drush config:import
```

<!-- Links Referenced -->

[releases]:    https://github.com/drupalwxt/wxt/releases
[wxt]:         https://github.com/drupalwxt/wxt
[wxt-project]: https://github.com/drupalwxt/wxt
