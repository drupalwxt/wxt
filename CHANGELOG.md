## v3.0.16

- Updates to Composer
  - Support for Composer v2.0.0
  - Switch to drupal/core-dev to streamline our composer.json
- Updates for WxT Bootstrap
  - Template issue for Main Menu
- Updates for WxT Library
  - Improve Canada.ca search submit

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`

## v3.0.15

- Updates to Drupal
  - Added language token to token module
- Updates for WxT
  - Ran drupal-check for Drupal 9 support
  - Added new drush command for sub profile generation
  - Section on configuration split added to README.md
  - Updated Search API
  - Optimized default URL alias for french
  - Support for inline webform report a problem block
  - Added Redis contributed module to build
- Updates for WxT Bootstrap
  - Ran drupal-check for Drupal 9 support
  - Updated Bootstrap to 3.23
  - Additional WCAG logic for "skip to" section
  - Additional WCAG only one li element
- Updates for WxT Library
  - Ran drupal-check for Drupal 9 support
  - WCAG missing form label
- Update openapi_jsonapi to 2.0-rc2
- Update search_api to 1.18
- Update simple_gmap to 3.0
- Update lightning to 4.107

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`

**Note:** The following modules are no longer provided and were never used by WXT. If you use these modules you will need to add them to your project's composer.json file or include them in your code base using another method.

* Search API Solr (`search_api_solr`)
* Facets (`facets`)

## v3.0.14

Security updates:

* Update Drupal Core to [8.8.10](https://www.drupal.org/project/drupal/releases/8.9.6)
  * [SA-core-2020-007](https://www.drupal.org/sa-core-2020-007)
  * [SA-core-2020-008](https://www.drupal.org/sa-core-2020-008)
  * [SA-core-2020-009](https://www.drupal.org/sa-core-2020-009)
  * [SA-core-2020-010](https://www.drupal.org/sa-core-2020-010)
  * [SA-core-2020-011](https://www.drupal.org/sa-core-2020-011)
- Updates for WxT Library
  - Updates to WET-BOEW Library v4.0.38
- Updates for WxT Bootstrap
  - Add missing aria-label
  - Link Canada Logo
  - Search Box handling
  - Article Role and About

Features/Updates:

- Update Lightning [4.1.7](https://github.com/acquia/lightning/releases/tag/4.1.7)

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`

## v3.0.13

Features/Updates:

- Updates for Lightning
  - Patch to Lightning Workflow for entityqueue upgrade issue
- Updates for WxT Bootstrap
  - Element figcaption nesting
  - Duplicated data-trgt element
  - Remove unncessary article role
  - Issue with nesting in content footer
  - dropdown.js bootstrap backport
  - Custom block theme suggestions
  - Add wb-inv span for search
  - Theme suggestions order
- Updates for WxT Library
  - Remove dependency on core search
  - Add core_version_requirement for D9

**Note:** We are working towards moving to Drupal 9 in the near future.

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`

- Manual changes:
  - If you happen to notice "The ... field needs to be uninstalled" from the status report screen
  - Goto the `admin/config/workflow/workflows/manage/editorial` screen and re-save the Editorial workflow

## v3.0.12

Security updates:

* Update Drupal Core to [8.8.8](https://www.drupal.org/project/drupal/releases/8.8.8)
  * [SA-CORE-2020-004](https://www.drupal.org/sa-core-2020-004)
  * [SA-CORE-2020-005](https://www.drupal.org/sa-core-2020-005)
  * [SA-CORE-2020-006](https://www.drupal.org/sa-core-2020-006)

Features/Updates:

  - Update Lightning [4.1.5](https://github.com/acquia/lightning/releases/tag/4.1.5)
  - Update acquia_connector to 1.22
  - Update admin_toolbar to 2.3
  - Update bootstrap_layouts to 5.2
  - Update button_link to 1.2
  - Update ckeditor_codemirror to 2.3
  - Update config_rewrite to 1.3
    **Note** If you are rewriting OPTIONAL configuration, then you need to read the [1.2 release notes](https://www.drupal.org/project/config_rewrite/releases/8.x-1.2)
  - Update core_context to 1.0-beta4
  - Update ctools to 3.4.0
  - Update embed to 1.4
  - Update inline_entity_form to 1.0-rc6
  - Update linkit to 5.0-beta11
  - Update media_entity_instagram to 2.1
  - Update media_entity_slideshow to 2.0
  - Update menu_block to 1.6.0
  - Update menu_breadcrumb to 1.13
  - Update page_manager to 4.0-beta6
  - Update panelizer to 5.0-beta3
  - Update paragraphs to 1.12
  - Update search_api to 1.17
  - Update token_filter to 1.2
  - Update webform to 5.16

**Note:** Many of the above module updates now include Drupal 9 support. We are working towards moving to Drupal 9 in the near future.

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`

## v3.0.11

Security updates:

* Update Drupal Core to [8.8.6](https://www.drupal.org/project/drupal/releases/8.8.6)
  * [SA-core-2020-002](https://www.drupal.org/sa-core-2020-002)

Features/Updates:

- Drupal core to 8.8.6
- Update Lightning [4.1.4](https://github.com/acquia/lightning/releases/tag/4.1.4)
- Update blazy to 2.1
- Update conflict to 2.0-alpha2
- Update lightning_core to 5.2
- Update lightning_workflow to 3.15
- Update moderation_dashboard to 1.0-beta2
- Update moderation_sidebar to 1.4
- Update redirect to 1.6
- Update webform to 5.13
- Update lightning to 4.104

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`

## v3.0.10

Features/Updates:

- Update wxt make files to fix issue with tarballs from drupal.org and github (missing gcweb 6.1).

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`

## v3.0.9

Security updates:

- Update minimum webform version to 5.11 ([SA-CONTRIB-2020-011](https://www.drupal.org/sa-contrib-2020-011), [SA-CONTRIB-2020-012](https://www.drupal.org/sa-contrib-2020-012), [SA-CONTRIB-2020-013](https://www.drupal.org/sa-contrib-2020-013), [SA-CONTRIB-2020-014](https://www.drupal.org/sa-contrib-2020-011))

Features/Updates:

- Drupal core 8.8.5
- Updates for Contributed modules
  - Update acquia_connector to 1.21
  - Update admin_toolbar = 2.2
  - Update bg_image_formatter = 1.14
  - Update blog to 2.0-beta1
    - To address [this](https://www.drupal.org/project/wxt/issues/3124528) build issue
  - Update consumers to 1.11
  - Update core_context to 1.0-beta1
  - Update crop to 2.1
  - Update diff to 1.0
  - Update entity_browser to 2.5
  - Update entity_embed to 1.1
  - Update entityqueue to 1.0
  - Update fontawesome to 2.16
  - Update image_widget_crop to 2.3
  - Update layout_builder_restrictions to 2.7
  - Update layout_builder_st to 1.0-alpha2
  - Update layout_builder_styles to 1.0-beta2
  - Update lightning_core to 5.1
  - Update lightning_layout to 2.6
  - Update media_entity_twitter to 2.4
  - Update metatag to 1.13
  - Update openapi to 2.0-rc3
  - Update openapi_rest to 2.0-rc2
  - Update pathauto to 1.8
  - Update schemata to 1.0-beta2
  - Update search_api to 1.16
  - Update simple_gmap to 2.1-rc1
  - Update simple_oauth to 4.5
  - Update token to 1.7
  - Update video_embed_field to 2.4
  - Update webform to 5.11
  - Update lightning to 4.103
- Update WxT Library 1.17.0
  - Update wet-boew to v4.0.35
  - Update gcweb theme to v6.1.0
  - Update for Drupal 9
- Port drush wxt-cex command to Drush 9

**Note:** The following modules are no longer provided or used by WXT (they were removed in Lightning 3.0.0). If you use these modules you will need to add them to your project's composer.json file or include them in your codebase using another method.

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`


* Scheduled Updates (`scheduled_updates`)
* Features (`features`)
* Configuration Update Manager (`config_update`)
* Media Entity (`media_entity`)
* Media Entity Document (`media_entity_document`)
* Media Entity Image (`media_entity_image`)

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`

## v3.0.8

Features/Updates:

- Update Drupal Core to 8.8.4
- Update Lightning [4.1.3](https://github.com/acquia/lightning/releases/tag/4.1.3)
  - Updated Lightning API to 4.5
  - Updated Lightning Media to 3.16
- Updates for WxT
  - Now provide alternate styles support for slideshow blocks
  - Formatting fixes and alignment of composer.json
- Updates for WxT Bootstrap
  - Update README.md
  - Fix CDN Footer for GCWEB
  - Unexpected breadcrumb padding on some of the WxT supported themes
- Updates for Contributed modules
  - Update core_context to 1.0-beta2 + patch for fieldable entities
  - Update password policy to 3.0-alpha5 + patch for helpful translation
  - Update entity_reference_revisions to 1.8
  - Update inline_entity_form to 1.0-rc3
  - Update paragraphs to 1.11

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`

## v3.0.7

Features/Updates:

- Update Drupal Core to 8.8.2
- Update Lightning [4.1.2](https://github.com/acquia/lightning/releases/tag/4.1.2)
- Moved docker logic into [docker-scaffold](https://github.com/drupalwxt/docker-scaffold)
- Drupal.org + Tarball generated builds now against [drupal/legacy-project](https://github.com/drupal/legacy-project)
- Updates for WxT
  - Update Coder and CodeSniffer
- Updates for WxT Bootstrap
  - Accessibility fix for Signed in as
  - PHPCS code linting fix
  - Added class for display-inline
  - Additional documentation for subtheme
- Updates for WxT Library
  - Correct issues with language negotiation
- Updates for Contributed modules
  - Update Webform to 3.8
  - Update autosave_form to 1.1
  - Update bg_image_formatter to 1.12
  - Update entity_block to 1.0-beta2
  - Update group to 1.0-rc5
  - Update layout_builder_restrictions to 2.5
  - Update media_entity_twitter to 2.3
- Pathauto must be updated first if below Pathauto 8.x-1.5 to prevent data loss

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`

## v3.0.6

Features/Updates:

- Update Drupal Core to 8.8.1
- Update Lightning [4.1.1](https://github.com/acquia/lightning/releases/tag/4.1.1)
- Update contributed modules:
  - Update core_context to 1.0-beta1
  - Update diff to 1.0
  - Update migrate_tools to 4.5
  - Update panelizer to 5.0-beta2
  - Update simple_sitemap to 3.5
- Update tarball packaging script to support core 8.8.x

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`

## v3.0.5

Features/Updates:

- Update Drupal Core to 8.7.11
- Update Lightning [4.0.6](https://github.com/acquia/lightning/releases/tag/4.0.6); includes:
  - Updated Lightning Layout to 2.5
- Update contributed modules:
  - Update acquia_connector to 1.18
  - Update embed to 1.3
  - Update layout builder restrictions
  - Update metatag to 1.11
  - Update pathauto to 1.6
  - Update redirect to 1.5
  - Update webform to 5.6

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`

## v3.0.4

Features/Updates:

- Essentially the same as v3.0.3
- Fix missing update to WxT dependencies for legacy packaging (drush make)

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`

## v3.0.3

Features/Updates:

- Update block_class to 1.1
- Fix page manager variant of type Http Status Code
- Fix for config export / import
- Update WxT Library
  - Update wet-boew to v4.0.32
  - Update gcweb theme to v6.0.0
- Update WxT Bootstrap
  - Improved Footer CDN logic

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`

## v3.0.2

Features/Updates:

- Update Drupal Core to 8.7.10
- Update Lightning [4.0.5](https://github.com/acquia/lightning/releases/tag/4.0.5); includes:
  - Updated Lightning API to 4.2
  - Updated Lightning Core to 4.7
  - Updated Lightning Layout to 2.1
  - Updated Lightning Media to 3.12
  - Updated Search API to to 1.15
  - Updated Entity Browser to 2.2
  - Addition of Conflict, AutoSave Form, and Redirect
- Update WxT Bootstrap and Bootstrap base theme
- Update CTools, Linkit, Field Group, Migrate Tools and Page Manager
- Fix for issue with conflict and page manager
- Issue with Site Installation via browser install
- Add link field to entity form display
- Check for missing schema layout builder
- Update admin toolbar to latest release
- Update paragraphs to latest release

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`

## v3.0.1

Features/Updates:

- Same as 3.0.0 release
- Fix for invalid make file patch

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

## v3.0.0

Features/Updates:

- Update Drupal Core to 8.7.8
- WxT padding improvements to front page
- Docker images now extend directly off drupal:8.7-fpm-alpine
- Page Manager variant does not open when selected
- Bootstrap Layouts fix for drag n drop in layout builder
- Stable version of Panelizer with Layout Builder

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

## v3.0.0-rc3

Features/Updates:

- Update Drupal Core to 8.7.7
- Fix for Core Context patch somehow missing
- Add StringTranslationTrait to Drush Hooks
- Claro updated to 1.0-beta1
- Add support for proper versioning of Profile tarball for *.info.yml files
- Add site slogan support to theme-gcwu-fegc

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

## v3.0.0-rc2

Features/Updates:

- Fix padding issue for #wb-srch-sub
- Fix padding issue for Date Modified block
- PHPCS corrections for WxT Library
- Proper dependencies for Webform resolving missing revision
- Addition of WxT Sub Profile Generator for Drupal Console
- Addition of WxT Lightning Update Manager for Drupal Console
- Minor improvements to migration
- Properly namespace modules with expanded syntax
- Updates entity_reference_revisions, paragraphs, and simple_sitemap

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

- Run WxT configuration updates:
  - `drush cache:rebuild`
  - `drush update:wxt`

## v3.0.0-rc1

Features/Updates:

- Layout Builder off canvas fixes
- Duplicate title logic for Layout Builder
- Fixes to Entity View Display calling wrong title
- Claro backend theme enabled by default
- Homepage CSS fixes for padding issue
- Addition of Core Context for Layout Builder

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

## v3.0.0-beta1

Features/Updates:

- Update Field Group to 3.0-rc1
- Update Bootstrap to v3.18 and switch to yarn
- Update Simple Sitemap to 3.3
- Minor README.md improvements
- Deprecated Entity Updates installer logic in Profile
- Update Bootstrap to 3.20

Performance:

- Performance degradation in Layout Builder
- Performance degradation in multi value fields
- Switch to a memory cache backend during installation

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

## v3.0.0-alpha1

Features/Updates:

- Update Drupal Core to 8.7.5
- Update Lightning to 4.0.4
- Move to Layout Builder
- Migrations updated with Layout Builder support
- Page Title / Tabs support for Layout Builder

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

## v2.2.18

Security update:

* Update Drupal Core to [8.6.15](https://www.drupal.org/project/drupal/releases/8.6.15)
  * [SA-CORE-2019-005](https://www.drupal.org/sa-core-2019-005)
  * [SA-CORE-2019-006](https://www.drupal.org/sa-core-2019-006)

Features/Updates:

- Update Drupal Core to 8.6.15
- Update Lightning to 3.2.8
- Update entityqueue to 1.0-beta2
- Update migrate_plus to 4.2

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

## v2.2.17

Features/Updates:

- Minor README.md improvements
- Patch for Paragraphs endless loop
- Revert menu_breadcrumb to 1.7 + lock
- Update wxt_bootstrap to 1.9
  - Resolve additional issues with gcweb legacy port
- Update wxt_bootstrap to 1.6
  -  Add guard for language detection in search block

## v2.2.16

Security update:

- Update core to [8.6.13](https://www.drupal.org/project/drupal/releases/8.6.13) [SA-CORE-2019-004](https://www.drupal.org/sa-core-2019-004)

Features/Updates:

- Update Lightning to 3.2.7
- Update entityqueue to 1.0-alpha8
- Update menu_breadcrumb to 1.8
- Update paragraphs to 1.7
- Update wxt_bootstrap to 1.8
  - Resolve issues with container class logic in regions

## v2.2.15

Features:
- Update Drupal Core 8.6.11
- Support for gcweb (canada.ca) theme v5.0.1 spec
- Updated WxT related packages
  - drupal/wxt_library including:
    - wet-boew/theme-gcweb (v4.0.29 => v5.0.1)
    - wet-boew/theme-gcweb-legacy (v4.0.29)
    - wet-boew/wet-boew (v4.0.29 => v4.0.30)
  - drupal/wxt_bootstrap
- Added modules
  - entityqueue
  - s3fs

Manual changes:

Upon running the database updates, the active wet-boew variant will switch
to gcweb-legacy. New installs will automatically use the new gcweb variant.

If you wish to remain on the gcweb-legacy variant, and you have custom
templates with `gcweb` in the name, rename `gcweb` to `gcweb-legacy`.
To use the new gcweb variant, switch the active wet-boew variant
to Canada.ca (gcweb).

Upgrade path:
- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb` (switches to gcweb-legacy opt in for newer gcweb v5.0.1)

## v2.2.14

Security update:

- Update core to [8.6.10](https://www.drupal.org/project/drupal/releases/8.6.10) as per [SA-CONTRIB-2019-014](https://www.drupal.org/sa-core-2019-003)
- Update contribs also affected
  - Font Awesome Icons - Critical - Remote Code Execution - SA-CONTRIB-2019-025
  - Paragraphs - Critical - Remote Code Execution - SA-CONTRIB-2019-023
  - Metatag - Critical - Remote code execution - SA-CONTRIB-2019-021
  - JSON:API - Highly critical - Remote code execution - SA-CONTRIB-2019-019

Features:
- Update Lightning [3.2.6](https://github.com/acquia/lightning/releases/tag/3.2.6)

Upgrade path:
- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

## v2.2.13

Security update:

- Update Lightning to [3.2.5](https://github.com/acquia/lightning/releases/tag/3.2.5); includes:
  - Security updated Acquia Connector to 1.16 (SA-CONTRIB-2019-014)

Features/Updates:
- Update Drupal Core 8.6.9
- Update Lightning [3.2.5](https://github.com/acquia/lightning/releases/tag/3.2.5); includes:
  - Updated Consumers to 1.8.
  - Updated JSON:API to 2.1.
  - Updated Moderation Dashboard to 1.0-beta1 (from previous lightning release)
- Update ckeditor-codemirror 2.2
- Update webform_migrate 1.1
- Update font_awesome to 2.10
- Add s3fs 3.0-alpha13

Fixes
- Apply patch ([migrate_tools/3024399](https://www.drupal.org/project/migrate_tools/issues/3024399)) to fix various drush migrate-import issues
- Lock ctools to 3.0

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

- Run Lightning configuration updates:
  - `drush cache:rebuild`
  - `drush update:lightning`

## v2.2.12

Security update(s):

- Update Drupal Core to 8.6.6 [SA-CORE-2019-001](https://www.drupal.org/sa-core-2019-001), [SA-CORE-2019-002](https://www.drupal.org/sa-core-2019-002)

## v2.2.11

Security Updates:
- bootstrap Security Update:
  - [bootstrap 8.x-3.16](https://www.drupal.org/project/bootstrap/releases/8.x-3.16) via [wxt_bootstrap 8.x-1.6](https://www.drupal.org/project/wxt_bootstrap/releases/8.x-1.6)
  - includes [SA-CONTRIB-2018-073](https://www.drupal.org/sa-contrib-2018-073) from [bootstrap 8.x-3.14](https://www.drupal.org/project/bootstrap/releases/8.x-3.14)
- jsonapi Security Update:
  - [jsonapi 8.x-2.0-rc4](https://www.drupal.org/project/jsonapi/releases/8.x-2.0-rc4) via [lightning 8.x-3.2.3](https://www.drupal.org/project/lightning/releases/8.x-3.203)
  - includes [SA-CONTRIB-2018-081](https://www.drupal.org/sa-contrib-2018-081)

Features:
- [Lightning 3.2.3](https://www.drupal.org/project/lightning/releases/8.x-3.203)
- [Drupal Core 8.6.5](https://www.drupal.org/project/drupal/releases/8.6.5)
- Added module
  - fontawesome 2.9 (closes [3021451](https://www.drupal.org/project/wxt/issues/3021451))

- Updated wxt related packages
  - drupal/wxt_library (1.3.0 => 1.4.0) including:
    - wet-boew/theme-gcweb (v4.0.28.1 => v4.0.29)
    - wet-boew/theme-wet-boew (v4.0.28.1 => v4.0.29)
    - wet-boew/wet-boew (v4.0.28.1 => v4.0.29)
  - wxt_bootstrap (1.5.0 => 1.6.0) including:
    - bootstrap (3.12.0 => 3.16.0)

- Updated contrib modules
  - admin_toolbar (1.24.0 => 1.25.0)
  - config_update (1.5.0 => 1.6.0)
  - entity_reference_revisions (1.5.0 => 1.6.0)
  - inline_entity_form (1.0.0-beta1 => 1.0.0-rc1)
  - migrate_plus (4.0.0 => 4.1.0)
  - migrate_tools (4.0.0 => 4.1.0)
  - webform (5.0.0 => 5.1.0)
- Removed patches that no longer apply
- now loading wet-boew dependencies with composer repo [drupalwxt/composer-extdeps](https://github.com/drupalwxt/composer-extdeps)

Upgrade path:

- Update your codebase:
  - `composer update`

- Run database updates:
  - `drush cache:rebuild`
  - `drush updatedb`

## v2.2.0

Feature(s):

- Fixed core patch version for comments redirect from 56 to 57

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
