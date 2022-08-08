<?php

/**
 * @file
 * Drush integration for WxT.
 */

/**
 * Implements drush_hook_COMMAND_validate().
 */
function drush_wxt_core_pm_updatecode_validate() {
  $wxt_path = \Drupal::moduleHandler()->getModule('wxt')->getPath();

  $question = dt('Updating code with Drush can potentially break your WxT site. (See @path for safe update instructions.) Are you SURE you want to continue?', [
    '@path' => \Drupal::root() . "/$wxt_path/UPDATE.md",
  ]);
  return drush_confirm($question);
}

/**
 * Implements drush_hook_pre_COMMAND().
 */
function drush_wxt_core_pre_updatedb() {
  // A common cause of errors during database updates is update hooks referring
  // to new or changed plugin definitions. Clearing all plugin caches before
  // updates begin ensures that the plugin system always has the latest plugin
  // definitions to work with.
  if (Drupal::hasContainer()) {
    Drupal::service('plugin.cache_clearer')->clearCachedDefinitions();
  }
}
