core = 8.x
api = 2

; Defaults
defaults[projects][subdir] = contrib

; Contrib (Profiles)
projects[lightning][type] = "profile"
projects[lightning][version] = "2.10"
projects[lightning][subdir] = ""

; Contrib (Modules)
projects[acquia_connector][type] = "module"
projects[acquia_connector][version] = "1.8"

projects[admin_toolbar][type] = "module"
projects[admin_toolbar][version] = "1.18"

projects[block_class][type] = "module"
projects[block_class][version] = "1.0-alpha1"

projects[blog][type] = "module"
projects[blog][download][type] = "git"
projects[blog][download][url] = "https://git.drupal.org/project/blog"
projects[blog][download][branch] = "2.x"
projects[blog][download][revision] = "43a21717baa0e28888a40da5792601d33ecc016f"
projects[blog][patch][2834732] = "https://www.drupal.org/files/issues/blog-no_results_text-2834732-2.patch"

projects[bootstrap_layouts][type] = "module"
projects[bootstrap_layouts][version] = "4.1"

projects[config_rewrite][type] = "module"
projects[config_rewrite][version] = "1.0"

projects[config_update][type] = "module"
projects[config_update][version] = "1.3"

projects[contact_storage][type] = "module"
projects[contact_storage][version] = "1.0-beta8"

projects[ctools][type] = "module"
projects[ctools][version] = "3.0-beta1"
projects[ctools][patch][2712661] = "https://www.drupal.org/files/issues/allow-2712661-2.patch"

projects[diff][type] = "module"
projects[diff][version] = "1.0-rc1"

projects[embed][type] = "module"
projects[embed][version] = "1.0"

projects[entity][type] = "module"
projects[entity][version] = "1.0-alpha4"

projects[entity_block][type] = "module"
projects[entity_block][version] = "1.0-alpha2"
projects[entity_block][patch][2846003] = "https://www.drupal.org/files/issues/entity_block-view-builder-class.patch"
projects[entity_block][patch][2846004] = "https://www.drupal.org/files/issues/2846004-2.patch"

projects[entity_browser][type] = "module"
projects[entity_browser][version] = "1.0-rc2"

projects[entity_embed][type] = "module"
projects[entity_embed][version] = "1.0-beta2"
projects[entity_embed][patch][2832504] = "https://www.drupal.org/files/issues/2832504-2.patch"

projects[entity_reference_revisions][type] = "module"
projects[entity_reference_revisions][version] = "1.2"

projects[features][type] = "module"
projects[features][version] = "3.5"

projects[field_formatter][type] = "module"
projects[field_formatter][version] = "1.0"

projects[field_group][type] = "module"
projects[field_group][version] = "1.0-rc6"

projects[file_entity][type] = "module"
projects[file_entity][version] = "2.0-beta3"

projects[inline_entity_form][type] = "module"
projects[inline_entity_form][version] = "1.0-beta1"
projects[inline_entity_form][patch][2367235] = "https://www.drupal.org/files/issues/support_entity_revision-2367235-92.patch"
projects[inline_entity_form][patch][2028711] = "https://www.drupal.org/files/issues/inline_entity_form-widget_ux_0.patch"

projects[jsonapi][type] = "module"
projects[jsonapi][version] = "1.0-beta1"

projects[layout_plugin][type] = "module"
projects[layout_plugin][version] = "1.0-alpha23"

projects[linkit][type] = "module"
projects[linkit][version] = "5.0-beta5"

projects[media_entity][type] = "module"
projects[media_entity][version] = "1.6"
projects[media_entity][patch][2775131] = "https://www.drupal.org/files/issues/add_contextual_links-2775131-2.patch"

projects[media_entity_document][type] = "module"
projects[media_entity_document][version] = "1.1"

projects[media_entity_image][type] = "module"
projects[media_entity_image][version] = "1.2"

projects[media_entity_instagram][type] = "module"
projects[media_entity_instagram][version] = "1.2"

projects[media_entity_slideshow][type] = "module"
projects[media_entity_slideshow][version] = "1.2"

projects[media_entity_twitter][type] = "module"
projects[media_entity_twitter][version] = "1.3"

projects[menu_block][type] = "module"
projects[menu_block][version] = "1.4"

projects[metatag][type] = "module"
projects[metatag][version] = "1.0"

projects[migrate_plus][type] = "module"
projects[migrate_plus][version] = "3.0-beta1"

projects[migrate_tools][type] = "module"
projects[migrate_tools][version] = "3.0-beta1"

projects[page_manager][type] = "module"
projects[page_manager][version] = "1.0-alpha24"
projects[page_manager][patch][2633052] = "https://www.drupal.org/files/issues/issue-2633052-2.patch"
projects[page_manager][patch][2665328] = "https://www.drupal.org/files/issues/variants_take_entity-2665328-35.patch"
projects[page_manager][patch][2665329] = "https://www.drupal.org/files/issues/page_manager-block-css-attributes-9.patch"
projects[page_manager][patch][2782661] = "https://www.drupal.org/files/issues/page_variant_for_node-2782661-5.patch"

projects[panelizer][type] = "module"
projects[panelizer][version] = "3.0-beta1"
projects[panelizer][patch][2664573] = "https://www.drupal.org/files/issues/panelizer-panels-ipe-tempstore-id.patch"

projects[panels][type] = "module"
projects[panels][version] = "3.0-beta6"
projects[panels][patch][0] = "https://www.drupal.org/files/issues/bandaid.patch"
projects[panels][patch][2793801] = "https://www.drupal.org/files/issues/2793801-13.patch"

projects[paragraphs][type] = "module"
projects[paragraphs][version] = "1.1"

projects[password_policy][type] = "module"
projects[password_policy][download][type] = "git"
projects[password_policy][download][url] = "https://git.drupal.org/project/password_policy"
projects[password_policy][download][branch] = "3.x"
projects[password_policy][download][revision] = "8ee51e4e58b1b9493867c43ddfecbdac20e04b0c"

projects[pathauto][type] = "module"
projects[pathauto][version] = "1.0-rc1"

projects[scheduled_updates][type] = "module"
projects[scheduled_updates][version] = "1.0-alpha6"

projects[search_api][type] = "module"
projects[search_api][version] = "1.0-beta5"
projects[search_api][patch][2866454] = "https://www.drupal.org/files/issues/2866454-2.patch"

projects[simple_sitemap][type] = "module"
projects[simple_sitemap][version] = "2.9"

projects[token][type] = "module"
projects[token][version] = "1.0-rc1"

projects[url_embed][type] = "module"
projects[url_embed][version] = "1.0-alpha1"

projects[video_embed_field][type] = "module"
projects[video_embed_field][version] = "1.4"

projects[views_bootstrap][type] = "module"
projects[views_bootstrap][download][type] = "git"
projects[views_bootstrap][download][url] = "https://git.drupal.org/project/views_bootstrap"
projects[views_bootstrap][download][branch] = "3.x"
projects[views_bootstrap][download][revision] = "ef95dac8dfeb8f2d61b0e5d40075a0a6e23e53ca"

projects[views_infinite_scroll][type] = "module"
projects[views_infinite_scroll][version] = "1.3"

projects[webform][type] = "module"
projects[webform][version] = "5.0-beta9"

projects[workbench_moderation][type] = "module"
projects[workbench_moderation][version] = "1.2"
projects[workbench_moderation][patch][2668006] = "https://www.drupal.org/files/issues/2668006-2.patch"
projects[workbench_moderation][patch][2768917] = "https://www.drupal.org/files/issues/workbench_moderation_2768917_20.patch"
projects[workbench_moderation][patch][2668006] = "https://www.drupal.org/files/issues/2668006-2.patch"
projects[workbench_moderation][patch][2847078] = "https://www.drupal.org/files/issues/2847078-6.patch"
projects[workbench_moderation][patch][2749503] = "https://www.drupal.org/files/issues/workbench_moderation-quickedit-support-2749503-6.patch"

projects[wxt_library][type] = "module"
projects[wxt_library][download][type] = "git"
projects[wxt_library][download][url] = "https://git.drupal.org/project/wxt_library"
projects[wxt_library][download][branch] = "1.x"
projects[wxt_library][download][revision] = "58ab84d95869be829515d549c7661f3bd2291da5"

; Contrib (Themes)
projects[bootstrap][type] = "theme"
projects[bootstrap][version] = "3.2"

projects[wxt_bootstrap][type] = "theme"
projects[wxt_bootstrap][download][type] = "git"
projects[wxt_bootstrap][download][url] = "https://git.drupal.org/project/wxt_bootstrap"
projects[wxt_bootstrap][download][branch] = "1.x"
projects[wxt_bootstrap][download][revision] = "0f9dca9fe77f3ac9f56304e140f171bfe0787c94"

; Contrib (Libraries)
libraries[wet-boew][download][type] = get
libraries[wet-boew][download][url] = https://github.com/wet-boew/wet-boew-cdn/archive/v4.0.24.tar.gz

libraries[theme-wet-boew][download][type] = get
libraries[theme-wet-boew][download][url] = https://github.com/wet-boew/themes-cdn/archive/v4.0.24-theme-wet-boew.tar.gz

libraries[theme-base][download][type] = get
libraries[theme-base][download][url] = https://github.com/wet-boew/themes-cdn/archive/v4.0.24-theme-base.tar.gz

libraries[theme-gc-intranet][download][type] = get
libraries[theme-gc-intranet][download][url] = https://github.com/wet-boew/themes-cdn/archive/v4.0.24-theme-gc-intranet.tar.gz

libraries[theme-gcwu-fegc][download][type] = get
libraries[theme-gcwu-fegc][download][url] = https://github.com/wet-boew/themes-cdn/archive/v4.0.24-theme-gcwu-fegc.tar.gz

libraries[theme-gcweb][download][type] = get
libraries[theme-gcweb][download][url] = https://github.com/wet-boew/themes-cdn/archive/v4.0.24-gcweb.tar.gz

libraries[theme-ogpl][download][type] = get
libraries[theme-ogpl][download][url] = https://github.com/wet-boew/themes-cdn/archive/v4.0.24-theme-ogpl.tar.gz
