## v2.2.0

Security Update(s):

- paragraphs 8.x-1.5 [SA-CONTRIB-2018-073](https://www.drupal.org/sa-contrib-2018-073)

Feature(s):

- Lightning 3.2.2
- Drupal Core 8.6.2
- Updated contrib modules
  - paragraphs to 1.5
  - views_bootstrap to 3.1
  - bootstrap to 3.13
  - media_entity_instagram to alpha2
- Removed patches that no longer apply
- Updated and refactored some patches to work with drupal core 8.6.x

Upgrade path:

- Update your codebase:
  - `composer update`

- Update sub-profile info.yml file to look similar to [wxt.info.yml](https://github.com/drupalwxt/wxt/blob/8.x-2.x/wxt.info.yml)

```
name: My Profile
core: 8.x
type: profile
base profile: lightning
install:
  - paragraphs
  - slick_entityreference
exclude:
  - lightning_search
  - pathauto
  - bartik
```

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

## v2.1.9

Security Update(s):

- Drupal Core 8.5.8 [SA-CORE-2018-006](https://www.drupal.org/sa-core-2018-006)

## v2.1.8

Feature(s) / Bug fixe(s):

- Removes patches that are no longer necessary
- Updated wxt_bootstrap to 1.5
  - Update bootstrap to 3.12
- Updated wxt_library to 1.3
  - Update wet-boew packages to 0.28.1 (where available)

## v2.1.7

Security update(s):

- Drupal Core 8.5.6 [SA-CORE-2018-005](https://www.drupal.org/sa-core-2018-005)

Feature(s) / Bug fixe(s):

- Updated wxt_bootstrap to 1.4
  - Form required marker "\204E" is broken in Chrome on Windows (#2988183)
  - Use img elements for SVG images instead of object elements (#2990023)
- Landing page behat test fail with moderation_state (#2989354)

## v2.1.6

Features / Bug Fixes:

- Updated Drupal Core to 8.5.5
- Updated wxt_library to 1.2
  - Fix Cache issues in user account block (#2980764)
  - Fix Update search Canada.ca form for HTTPS (#2977233)
- Updated wxt_bootstrap to 1.3
  - Add CDN option for the footer to the theme settings (#2927929)
- Updated contrib modules, including:
  - admin_toolbar to 1.24
  - block_class to 1.0
  - bootstrap_layouts to 5.1
  - diff to 1.0-rc2
  - media_entity_image to 1.3
  - media_entity_slideshow to 2.0-alpha1
  - menu_block to 1.5.0
  - field_formatter to 1.2
  - metatag to 1.5
  - migrate_tools to 4.0-rc1
  - token_filter to 1.0
  - webform to 5.0-rc16

**Note:** After updating, Drupal will emit a warning about the metatag_page_variants module missing. This will be corrected by an update hook in wxt_ext_metatag when `drush updb` is run.

## v2.1.5

Feature(s):

- Lightning 3.1.4
- Update contrib modules

## v2.1.4

Bug fixe(s):

- [2969558: Panels patch for issue #2869412 is failing for Panels 4.3](https://www.drupal.org/project/wxt/issues/2969558)

## v2.1.3

Security Update(s):

- Drupal Core 8.5.3 [SA-CORE-2018-004](https://www.drupal.org/sa-core-2018-004)

Feature(s):

- Lightning 3.1.3

## v2.1.2

Feature(s):

- Lightning 3.1.1

Note that you must update drupal/drupal-extension to at least 3.4.0
for behat tests to pass.

## v2.1.1

Security Update(s):

- Drupal Core 8.5.1 [SA-CORE-2018-002](https://www.drupal.org/sa-core-2018-002)

## v2.1.0

Feature(s):

- Drupal Core 8.5.0
- Lightning 3.1.0
- Group 1.0-rc2 (See
  [release notes](https://www.drupal.org/project/group/releases/8.x-1.0-rc2)
  for information about special changes)
- Webform 5.0-rc3

## v2.0.1

This release is the same as v2.0.0, except with corrections to the drupal.org
makefile so that versions match composer.json.

## v2.0.0

Initial release of Drupal WxT for Drupal 8.

Security Update(s):

- Drupal Core 8.4.5

Feature(s):

- Lightning 3.0.3
- WxT v4.0.27
