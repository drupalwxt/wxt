This file contains instructions for updating your WxT-based Drupal site.

WxT has a two-pronged update process. Out of the box, it provides a great
deal of default configuration for your site, but once it's installed, all that
configuration is "owned" by your site and WxT cannot safely modify it
without potentially changing your site's behavior or, in a worst-case scenario,
causing data loss.

As it evolves, WxT's default configuration may change. In certain limited
cases, WxT will attempt to safely update configuration that it depends on
(which will usually be locked anyway to prevent you from modifying it).
Otherwise, WxT will leave your configuration alone, respecting the fact
that your site owns it. So, to bring your site fully up-to-date with the latest
default configuration, you must follow the appropriate set(s) of instructions in
the "Configuration updates" section of this file.

## Updating WxT

### Summary
For a typical site that has a properly configured directory for exporting config
that is managed by your VCS, you would generally follow these steps:

#### In your development or local environment.
1. Read the [release notes](https://github.com/drupalwxt/wxt/releases)
   for the release to which you are updating, and any other releases between
   your current version.

1. Update your codebase, replacing `[WxT]` with the most recent
   version of WxT. For example, `3.0.8`.

  ```
  composer self-update
  composer require drupalwxt/wxt:~[WXT_VERSION] --no-update
  composer update drupalwxt/wxt --with-all-dependencies
  ```
1. Run any database updates.

  ```
  drush cache:rebuild
  drush updatedb
  ```
1. Run any WxT configuration updates.

  ```
  drush cache:rebuild
  drush update:wxt
  ```
1. Export the new configuration.


  ```
  drush config:export
  ```
1. Commit the code and configuration changes to your VCS and push them to your
   destination environment.

#### On your destination environment.

1. Run any database updates.

  ```
  drush cache:rebuild
  drush updatedb
  ```

1. Import any configuration changes.

  ```
  drush cache:rebuild
  drush config:import
  ```

#### Configuration Management
If you are using configuration management to move your configuration between
development, staging, and production environments, you should export
configuration after #5 and deploy.

### Composer
If you've installed WxT using our [Composer-based project template](https://github.com/drupalwxt/wxt-project), all you need to do is:

* ```cd /path/to/YOUR_PROJECT```
* ```composer update```
* Run ```drush updatedb && drush cache:rebuild```, or visit ```update.php```,
  to perform automatic database updates.
* Perform any necessary configuration updates (see below).

### Tarball
**Do not use ```drush pm-update``` or ```drush up``` to update WxT!**
WxT includes specific, vetted, pre-tested versions of modules, and
occasionally patches for those modules (and Drupal core). Drush's updater
totally disregards all of that and may therefore break your site.

To update WxT safely:

1. Download the latest version of WxT from
   https://www.drupal.org/project/wxt and extract it.
2. Replace your ```profiles/wxt``` directory with the one included in the
   fresh copy of WxT.
3. Replace your ```core``` directory with the one included in the fresh copy
   WxT.
4. Visit ```update.php``` or run ```drush updatedb``` to perform any necessary
   database updates.
5. Perform any necessary configuration updates and/or migrations (see below).

## Update instructions

These instructions describe how to update your site to bring it in line with a
newer version of WxT. WxT does not make these changes automatically
because they may change the way your site works.

However, as of version 3.0.2, WxT provides a Drush 9 command which *can*
perform updates automatically, confirming each change interactively as it goes.
If you intend to perform all the updates documented here, this can save quite
a bit of time!

That said, though, some of these updates involve complicated data migrations.
Due to their complexity, WxT *never* automates them -- you will need to
take some manual action to complete these updates, which are denoted as such
below.

### Automatic configuration updates

Ensure Drush 9 is installed, then switch into the web root of your
WxT installation and run:

```
$ drush update:wxt
```


To run all available configuration updates without any prompting, use:

```
$ drush update:wxt --no-interaction
```

If you'd rather do the updates manually, follow the instructions below,
starting from the version of WxT you currently use. For example, if you
are currently running 2.2.0 and are trying to update to 2.2.6, you will need to
follow the instructions for updating from 2.2.0 to 2.2.1, then from 2.2.1 to
2.2.2, in that order.

### 3.0.6 to 3.0.8
There are no manual update steps for this version.
