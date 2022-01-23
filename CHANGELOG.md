## v4.2.1 (In Development)

- Updates for Drupal Core (v9.2.x)
  - [SA-core-2022-001](https://www.drupal.org/sa-core-2022-001)
- Updates for WxT Bootstrap
  - Table of Contents (TOC) issue [#3258089](https://www.drupal.org/project/wxt/issues/3258089)

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

**Note(s)**:

N/A

## v4.2.0

- Updates for Drupal Core (9.2.x)
  - Upgrading to the 9.2.x Drupal Core [#3226492](https://www.drupal.org/node/3226492)
  - Updates for Drupal Core to [v9.2.10](https://www.drupal.org/project/drupal/releases/9.2.10)
  - WCAG required markers on forms [#2921627](https://www.drupal.org/node/2921627)
  - New translations for moderated nodes initial workflow state [#3150294](https://www.drupal.org/node/3150294)
  - Book title in breadcrumb not translated [#3177182](https://www.drupal.org/node/3177182)
  - Add new `route:<separator>` for menu items [#3236799](https://www.drupal.org/project/wxt/issues/3236799)
  - CKEditor adding closing tags to `<source>` and `<track>` [#3155911](https://www.drupal.org/project/wxt/issues/3155911)
  - Claro support for extra wide screens [#3184667](https://www.drupal.org/node/3184667)
  - Empty breadcrumb at node/add with frontpage view [#3184667](https://www.drupal.org/node/3184667)
- Updates for Drupal Contrib
  - Token module updates breaks patch [#3252881](https://www.drupal.org/project/wxt/issues/3252881)
  - Redis incorrect QueueInterface implementation [#3253822](https://www.drupal.org/project/wxt/issues/3253822)
  - New metatag release conflicts with wxt patch [#3255324](https://www.drupal.org/project/wxt/issues/3255324)
  - Accessibility improvements to Diff Module [#3228798](https://www.drupal.org/project/diff/issues/3228798)
  - Update button_link, core_context, and group to latest stable
- Updates for WxT
  - Configurable Leading Breadcrumbs [#3203791](https://www.drupal.org/project/wxt/issues/3203791)
  - Flushing caches during preUpdate set maintenance mode [#3248590](https://www.drupal.org/project/wxt/issues/3248590)
  - Issues with Insert from Media Library [#3246714](https://www.drupal.org/project/wxt/issues/3246714)
  - Can't install WxT Extend Webform after minimal site install [#3249953](https://www.drupal.org/project/wxt/issues/3249953)
  - Adjustments to Password Policy [#3252532](https://www.drupal.org/project/wxt/issues/3252532)
  - Add new CKEditor Abbreviations Filter [#3228812](https://www.drupal.org/project/wxt/issues/3228812)
  - Add new CKEditor Alerts Filter  [#3228616](https://www.drupal.org/project/wxt/issues/3228616)
  - Add new CKEditor TOC Filter [#3227545](https://www.drupal.org/project/wxt/issues/3227545)
  - Add new CKEditor Footnotes Filter  [#3249208](https://www.drupal.org/project/wxt/issues/3249208)
  - Update `wxt_layout_plugin_id` migration process plugin to support creating multiple sections.
- Updates for WxT Bootstrap
  - WxT Bootstrap fix .pagedetails layout issues [#3253398](https://www.drupal.org/project/wxt/issues/3253398)
  - GC Subway not working correctly in Intranet theme [#3253829](https://www.drupal.org/project/wxt/issues/3253829)
  - Issues with Insert from Media Library [#3246714](https://www.drupal.org/project/wxt/issues/3246714)
  - Add new `route:<separator>` for menu items [#3236799](https://www.drupal.org/project/wxt/issues/3236799)
  - Add new CKEditor TOC Filter [#3227545](https://www.drupal.org/project/wxt/issues/3227545)
  - Add new CKEditor Footnotes Filter  [#3249208](https://www.drupal.org/project/wxt/issues/3249208)

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

**Note(s)**:

a) The data structure expected by the `wxt_layout_plugin_id` migration plugin has been updated to support multiple sections.

The current format only created one section:

```yaml
layout_id: 'layoutid'
layout_settings: {}
components: []
```

The new format is a top-level `sections` array, which supports multiple entries:

```yaml
# Same behaviour as previous format
sections:
- layout_id: 'layoutid'
  layout_settings: {}
  components: []
```

```yaml
# New format which support multiple sections
sections:
- layout_id: 'layoutid1'
  layout_settings: {}
  components: []
- layout_id: 'layoutid2'
  layout_settings: {}
  components: []
```

b) Lightning API has been removed from our `composer.json` file.

If you were relying on this functionality please add the following to your `composer.json` file:

```json
"drupal/lightning_api": "^4.6",
```

The following contributed modules were added by Lightning API:

```json
"drupal/consumers": "^1.10",
"drupal/openapi_jsonapi": "^2.0-rc1",
"drupal/openapi_rest": "^2.0-rc1",
"drupal/openapi_ui_redoc": "^1.0",
"drupal/openapi_ui_swagger": "^1.0",
"drupal/simple_oauth": "^4.0"
```

## v4.1.3

- Updates for Drupal Core
  - Updates for Drupal Core to [v9.1.15](https://www.drupal.org/project/drupal/releases/9.1.15)
  - WCAG required markers on forms [#2921627](https://www.drupal.org/node/2921627)
  - New translations for moderated nodes initial workflow state [#3150294](https://www.drupal.org/node/3150294)
  - Book title in breadcrumb not translated [#3177182](https://www.drupal.org/node/3177182)
  - Add new `route:<separator>` for menu items [#3236799](https://www.drupal.org/project/wxt/issues/3236799)
- Updates for Drupal Contrib
  - Token module updates breaks patch [#3252881](https://www.drupal.org/project/wxt/issues/3252881)
  - Redis incorrect QueueInterface implementation [#3253822](https://www.drupal.org/project/wxt/issues/3253822)
  - New metatag release conflicts with wxt patch [#3255324](https://www.drupal.org/project/wxt/issues/3255324)
  - Accessibility improvements to Diff Module [#3228798](https://www.drupal.org/project/diff/issues/3228798)
- Updates for WxT
  - Flushing caches during preUpdate set maintenance mode [#3248590](https://www.drupal.org/project/wxt/issues/3248590)
  - Issues with Insert from Media Library [#3246714](https://www.drupal.org/project/wxt/issues/3246714)
  - Can't install WxT Extend Webform after minimal site install [#3249953](https://www.drupal.org/project/wxt/issues/3249953)
  - Adjustments to Password Policy [#3252532](https://www.drupal.org/project/wxt/issues/3252532)
- Updates for WxT Bootstrap
  - WxT Bootstrap fix .pagedetails layout issues [#3253398](https://www.drupal.org/project/wxt/issues/3253398)
  - GC Subway not working correctly in Intranet theme [#3253829](https://www.drupal.org/project/wxt/issues/3253829)
  - Issues with Insert from Media Library [#3246714](https://www.drupal.org/project/wxt/issues/3246714)
  - Add new `route:<separator>` for menu items [#3236799](https://www.drupal.org/project/wxt/issues/3236799)

Upgrade path:

> Note: No special notes for this release.

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

**Note:** N/A

## v4.1.2

- Updates for Drupal Core (v9.1.14)
  - [SA-core-2021-011](https://www.drupal.org/sa-core-2021-011)
- Updates for WxT
  - CKEditor table improvements [#3247278](https://www.drupal.org/project/wxt/issues/3247278)
  - D9 Core patch fixing missing hooks [#3241632](https://www.drupal.org/project/wxt/issues/3241632)
  - Update linkit for SA [#3240307](https://www.drupal.org/project/wxt/issues/3240307)
  - Update token_filter for core fix [#3236440](https://www.drupal.org/project/token_filter/issues/3236440)
- Updates for WxT Bootstrap
  - CKEditor table improvements [#3247943](https://www.drupal.org/project/wxt/issues/3247943)
  - Add aria-current to GC Subway navigation [#3243162](https://www.drupal.org/project/wxt/issues/3243162)
  - Accessibility issue in GC Intranet menu [#3240931](https://www.drupal.org/project/wxt/issues/3240931)
- Updates for WxT Library
  - Language switcher issue on Intranet theme [#3246029](https://www.drupal.org/project/wxt/issues/3246029)
  - Undefined variable $wxt_active [#3250005](https://www.drupal.org/project/wxt/issues/3250005)

Upgrade path:

> Note: No special notes for this release.

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

**Note:** N/A

## v4.1.1

- Updates for Drupal Core (v9.1.13)
  - [SA-core-2021-009](https://www.drupal.org/sa-core-2021-009)
- Updates for WxT
  - Addition of the new GC Intranet Theme [#3226972](https://www.drupal.org/project/wxt/issues/3226972)
  - WxT Ext Archived module improvements [#3226555](https://www.drupal.org/project/wxt/issues/3226555)
  - Resolve this.$toggleWeightBUtton is undefined [#3230065](https://www.drupal.org/project/wxt/issues/3230065)
- Updates for WxT Bootstrap
  - Addition of the new GC Intranet Theme [#3226972](https://www.drupal.org/project/wxt/issues/3226972)
  - Remove remnant flag template [#3226974](https://www.drupal.org/project/wxt/issues/3226974)
  - Status message layout issues [#3227944](https://www.drupal.org/project/wxt/issues/3227944)
  - All input buttons have title attribute set to "Search" [#3230876](https://www.drupal.org/project/wxt/issues/3230876)
- Updates for WxT Library
  - Addition of the new GC Intranet Theme [#3226972](https://www.drupal.org/project/wxt/issues/3226972)
  - GC Intranet search block layout issues [#3229155](https://www.drupal.org/project/wxt/issues/3229155)

Upgrade path:

> Note: No special notes for this release.

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

**Note:** The default GC Intranet theme has been updated to the latest specification. You will need to manually switch to the `gc-intranet-legacy` theme if you wish to have no changes to the theme.

```sh
drush config-set wxt_library.settings wxt.theme theme-gcweb-intranet-legacy
```

The only additional caveat is that if you have any of your own pages referencing theme-gcweb-intranet.tpl.php you will now have to append the suffix `--legacy` to them.

## v4.1.0

- Updates for Drupal Core
  - [SA-core-2021-003](https://www.drupal.org/sa-core-2021-004)
- Updates for WxT
  - Issue #3219195 by smulvih2: Configure book module to support GC Subway functionality
  - Issue #3212225: Remove Panelizer completely for 4.1.x line
- Updates for WxT Bootstrap
  - Issue #3219195 by smulvih2: Configure book module to support GC Subway functionality
  - Issue #3223026 by smulvih2: Toolbar menu icons are smaller on wxt_bootstrap
  - Issue #3222228 by smulvih2: WxT Search Form Layout Issue
- Updates for WxT Library
  - feat(gcweb): Switch to gcweb v9.3.0
  - feat(gcweb): Switch to wet-boew v4.0.42.2

Upgrade path:

> Note: No special notes for this release.

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

**Note:** N/A

## v4.0.7

- Updates for WxT
  - 4.0.4 to 4.0.6 upgrade installs all modules [#3216815](https://www.drupal.org/project/wxt/issues/3216815)
  - Broken/outdated links in menu migrations [#3217224](https://www.drupal.org/project/wxt/issues/3217224)
  - Implied dependency in gcweb_block_spotlight migration [#3217034](https://www.drupal.org/project/wxt/issues/3217034)
- Updates for WxT Bootstrap
  - Sensible label defaults for brand menu  [#3217232](https://www.drupal.org/project/wxt/issues/3217232)
  - Footer menu should be configurable [#3217213](https://www.drupal.org/project/wxt/issues/3217213)
  - Search field has hardcoded value [#3217296](https://www.drupal.org/project/wxt/issues/3217296)
- Updates for WxT Library
  - Search field has hardcoded value [#3217296](https://www.drupal.org/project/wxt/issues/3217296)
  - Language block use correct language type [#3219470](https://www.drupal.org/project/wxt/issues/3219470)

Upgrade path:

> Note: No special notes for this release.

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

**Note:** The all_wxt form was renamed back to select_all so please update your drush site install scripts accordingly.

## v4.0.6

- Updates for WxT
  - Update hook wxt_core_update_8403 [#3214811](https://www.drupal.org/project/wxt/issues/3214811)
- Updates for WxT Bootstrap (8.x-4.9)
  - GCWeb Fix Footer Classes [#3216067](https://www.drupal.org/project/wxt/issues/3216067)
- Updates for WxT Library (8.x-4.9)
  - Language toggle broken [#3216306](https://www.drupal.org/project/wxt/issues/3216306)

Upgrade path:

> Note: No special notes for this release.

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

**Note:** The select_all form was renamed to all_wxt so please update your drush site install scripts accordingly.

## v4.0.5

- Updates for Drupal Core
  - [SA-core-2021-003](https://www.drupal.org/sa-core-2021-003)
- Updates for WxT
  - WxT Install UX Improvement [#3211057](https://www.drupal.org/project/wxt/issues/3211057)
  - Misplaced Pathauto config prevents site installations [#3211052](https://www.drupal.org/project/wxt/issues/3211052)
  - wxt_core update 8403 fails on blocks with null id [#3213304](https://www.drupal.org/project/wxt/issues/3213304)
  - CKEditor improvements add Details functionality [#3213286](https://www.drupal.org/project/wxt/issues/3213286)
  - CKEditor improvements add Panels functionality [#3213766](https://www.drupal.org/project/wxt/issues/3213766)
  - Page manager patch not D9 compatible [#3214053](https://www.drupal.org/project/wxt/issues/3214053)
  - Translate the "Did you find" webform [#3203752](https://www.drupal.org/project/wxt/issues/3203752)
- Updates for WxT Bootstrap (8.x-4.8)
  - Skip links theme configuration text is currently not translateable [#3210758](https://www.drupal.org/project/wxt/issues/3210758)
  - Incorrect/outdated class "mrgn-bttm-none" [#3213481](https://www.drupal.org/project/wxt/issues/3213481)
  - Skip links theme configuration text is currently not translateable [#3210758](https://www.drupal.org/project/wxt/issues/3210758)
- Updates for WxT Library (8.x-4.8)
  - Language switcher is based on wrong language [#3214421](https://www.drupal.org/project/wxt/issues/3214421)
- Updates for Contrib
  - [SA-CONTRIB-2021-009 for CTools](https://www.drupal.org/SA-CONTRIB-2021-009)

Upgrade path:

> Note: No special notes for this release.

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

**Note:** The select_all form was renamed to all_wxt so please update your drush site install scripts accordingly.

## v4.0.4

- Updates for Drupal Core
  - [SA-core-2021-003](https://www.drupal.org/sa-core-2021-002)
- Updates for Contrib
  - Update ctools to to 3.5.0
  - Update inline_entity_form to 1.0-rc9 or better

Upgrade path:

> Note: No special notes for this release.

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

**Note:** N/A

## v4.0.3

- Updates for WxT
  - Radio button validation text [#3205860](https://www.drupal.org/project/wxt/issues/3205860)
  - Webform submission warning[#3205860](https://www.drupal.org/project/wxt/issues/3206440)
  - Layout builder fix when using external URLs [#3205841](https://www.drupal.org/project/wxt/issues/3205841)
  - WxT Install AJAX Error [#3204369](https://www.drupal.org/project/wxt/issues/3204369)
  - Metatag front page default config [#3208091](https://www.drupal.org/project/wxt/issues/3208091)
  - Drupal 9 upgrade wxt_core [#3188528](https://www.drupal.org/project/wxt/issues/3188528)
- Updates for WxT Bootstrap (8.x-4.6)
  - Severe Layout Builder regressions [#3199500](https://www.drupal.org/project/wxt/issues/3199500)
  - Subtheme based on wxt_bootstrap starterkit shows no rendered CSS [#3112946](https://www.drupal.org/project/wxt/issues/3112946)
  - WCAG fix for missing title attribute on canada.ca [#3205517](https://www.drupal.org/project/wxt/issues/3205517)
  - Add missing search submit button [#3206295](https://www.drupal.org/project/wxt/issues/3206295)
  - Contextual menu links color is white[#3206397](https://www.drupal.org/project/wxt/issues/3206397)
  - Severe Layout Builder regressions [#3199500](https://www.drupal.org/project/wxt/issues/3199500)
  - Metatag front page default config [#3208091](https://www.drupal.org/project/wxt/issues/3208091)
  - Add share widget options [#3208103](https://www.drupal.org/project/wxt/issues/3208103)
- Updates for WxT Library (8.x-4.7)
  - Add share widget options [#3208103](https://www.drupal.org/project/wxt/issues/3208103)
  - Extra values(query) on search submit [#3208471](https://www.drupal.org/project/wxt/issues/3208471)

Upgrade path:

> Note: No special notes for this release.

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

**Note:** N/A

## v4.0.2

- Updates for WxT
  - Detect and strip base URL from pasted URLs to increase matching hits [#3078075](https://www.drupal.org/project/wxt/issues/3078075)
  - French revisions page always shows English revision state [#3199354](https://www.drupal.org/project/wxt/issues/3199354)
  - Discard Draft button on moderation sidebar [#3199358](https://www.drupal.org/project/wxt/issues/3199358)
  - Implement the Did you find what you were looking for webform [#3200416](https://www.drupal.org/project/wxt/issues/3200416)
- Updates for WxT Bootstrap (8.x-4.5)
  - Implement the Did you find what you were looking for webform [#3200416](https://www.drupal.org/project/wxt/issues/3200416)
- Updates for WxT Library (8.x-4.5)
  - Undefined variable wxt_active [#3199471](https://www.drupal.org/project/wxt/issues/3199471)
- Updates for Contrib
  - Update webform (6.0.2) [#3202289](https://www.drupal.org/project/wxt/issues/32022892)

Upgrade path:

> Note: No special notes for this release.

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

**Note:** N/A

## v4.0.1

- Updates for WxT
  - Restore French + Non symmetric menu functionality [#3195279](https://www.drupal.org/project/wxt/issues/3195279)
  - Enable advanced dublin core metatag module by default [#3194123](https://www.drupal.org/project/wxt/issues/3194123)
  - Update WxT migration content
  - Menu breadcrumb minor fix for french menu handling
  - Improved the default search experience [#3195726](https://www.drupal.org/project/wxt/issues/3195726)
- Updates for WxT Bootstrap
  - Restore French + Non symmetric menu functionality [#3195279](https://www.drupal.org/project/wxt/issues/3195279)
  - WxT Bootstrap Fix Header Layout Issues [#3194962](https://www.drupal.org/project/wxt/issues/3194962)
  - Fix unnecessary ARIA roles [#3154001](https://www.drupal.org/project/wxt/issues/3154001)
  - Improved the default search experience [#3195726](https://www.drupal.org/project/wxt/issues/3195726)
- Updates for WxT Library
  - Improved the default search experience [#3195726](https://www.drupal.org/project/wxt/issues/3195726)
- Updates for Config Rewrite
  - PHP 8.0 compatibility fix

Upgrade path:

> Note: No special notes for this release.

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

**Note:** French non-symmetric menu functionality has been fully restored.

## v4.0.0

- Updates for Drupal Core
  - [SA-core-2021-001](https://www.drupal.org/sa-core-2021-001)
  - Documented issue and fix for PostgreSQL and large url_alias table
  - PostgreSQL operator in views queries
  - Refactor array_merge usage in loops for performance
  - Updated comment patch which was causing errors
  - Remove patch #3192376 due to entity translation fields
  - Update for Linkit patch for D9 compatibility
  - Patch for correct version of Azure MySQL
- Updates for WxT
  - Added translated content for webform "Report a Problem"
- Updates for WxT Bootstrap
  - Remove deprecated code
  - Fix skip to link on reflow
  - Fix for view node revision error
  - WCAG template issue for header branding block
  - W3C image twig output for alt tag
  - Add roles to all menu ul, li, and links
  - Fix sidebar active class logic
  - Fix for report a problem markup
- Updates for Lightning Media
  - Improvements to Bulk Upload form
  - Improvements to Add UID for bulk uploaded files
- Updates for Contrib
  - Added back Page Manager patch correcting panels pages + conflict
  - Added pathauto patch for avoid update query for key_value table
  - Redis improvements for TTL handling
  - Static caching for Metatag

Upgrade path:

> Note: For this upgrade path you will have to run `updatedb` through Drush as the GUI update.php will block on modules that were uninstalled.
> Additionally please note if you have run any of the prior release candidate's you might have to manually re-run the wxt_core_update_8400 hook.

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

**Note:** The following modules are no longer provided by WXT. If you use these modules you will need to add them to your project's composer.json file.

* Libraries

## v4.0.0-RC3

- Update for Drupal Core
  - [Updated Patch for SubProfile Inheritance](https://www.drupal.org/project/drupal/issues/1356276?page=1#comment-13935658)
- Update for WxT
  - Additional update path enhancements
  - Resolve issue with Lightning scheduler
- Updates for WxT Bootstrap
  - Update twig syntax for Drupal 9 support
  - Resolved skip link not accessible on reflow
- Updates for Lightning Media
  - Improvements to Bulk Upload form
- Updates for Contrib
  - Updates for CTools
  - Updates for Webform
  - Removed Page Manager patch breaking anonymous users

Upgrade path:

> Note: For this upgrade path you will have to run `updatedb` through Drush as the GUI update.php will block on modules that were uninstalled.

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

**Note:** The following modules are no longer provided by WXT. If you use these modules you will need to add them to your project's composer.json file.

* Libraries

## v4.0.0-RC2

- Update Drupal Core to [9.0.9](https://www.drupal.org/project/drupal/releases/9.0.9)
  - [SA-core-2020-013](https://www.drupal.org/sa-core-2020-013)
- Update for WxT
  - Corrected issue with install and `assert.exception = On`
  - Corrected issue with Claro and Chrome 87+
  - Corrected issue with blocks not appearing related to context_defintions
  - Added new optional extension `wxt_ext_archived`

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

**Note:** The following modules are no longer provided by WXT. If you use these modules you will need to add them to your project's composer.json file.

* Libraries

## v4.0.0-RC1

- Update Drupal Core to [9.0.8](https://www.drupal.org/project/drupal/releases/9.0.8)
  - [SA-core-2020-012](https://www.drupal.org/sa-core-2020-012)
- Updates to Composer
  - Support for Composer v2.0.0
  - Switch to drupal/core-dev to streamline our composer.json
- Update for WxT
  - [Roadmap for 4.0.x release](https://www.drupal.org/project/wxt/issues/3182977)
  - [Drupal 9 support and release of 4.0.0](https://www.drupal.org/project/wxt/issues/3154403)
  - [Updates to provide a minimal WxT profile](https://www.drupal.org/project/wxt/issues/3182208)
  - [Simplify and move wxt_ext_translation to wxt_translation](https://www.drupal.org/project/wxt/issues/3182647)
  - [Lightning profile removed in favor of calling modules specifically](https://www.drupal.org/project/wxt/issues/3182195)
  - [Provide upgrade path from 3.0.0 to 4.0.0](https://www.drupal.org/project/wxt/issues/3182648)
  - Provide extension logic for optional extensions during install
- Updates for WxT Bootstrap
  - Update twig syntax for Drupal 9 support
  - Template issue for Main Menu
- Updates for WxT Library
  - Update PSR calls for Drupal 9 support
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

**Note:** The following modules are no longer provided by WXT. If you use these modules you will need to add them to your project's composer.json file.

* Libraries
