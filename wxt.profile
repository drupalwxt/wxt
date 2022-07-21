<?php

/**
 * @file
 * Contains wxt.profile.
 */

use Drupal\Core\Session\AccountInterface;
use Drupal\wxt\Installer\Form\ExtensionConfigureForm;

/**
 * Implements hook_install_tasks().
 */
function wxt_install_tasks() {
  return [
    'wxt_install_extensions' => [
      'display_name' => t('Install extensions'),
      'display' => TRUE,
      'type' => 'batch',
    ],
  ];
}

/**
 * Implements hook_install_tasks_alter().
 */
function wxt_install_tasks_alter(array &$tasks, array $install_state) {
  $task = $tasks['wxt_install_extensions'];
  unset($tasks['wxt_install_extensions']);
  $tasks = array_merge($tasks, ['wxt_install_extensions' => $task]);

  array_insert(
    $tasks,
    "wxt_install_extensions",
    [
      'wxt_extension_configure_form' => [
        'display_name' => t('Select extensions to enable'),
        'type' => 'form',
        'function' => ExtensionConfigureForm::class,
      ],
    ]
  );
}

/**
 * Install task callback prepares a batch job to install WxT extensions.
 *
 * @param array $install_state
 *   The current install state.
 *
 * @return array
 *   The batch job definition.
 */
function wxt_install_extensions(array &$install_state) {
  $batch = [];
  $modules = \Drupal::state()->get('wxt_install_extensions', []);
  $install_core_search = TRUE;

  foreach ($modules as $module) {
    $batch['operations'][] = ['wxt_install_module', (array) $module];
    if ($module == 'wxt_ext_search_db') {
      $install_core_search = FALSE;
    }
  }

  if ($install_core_search) {
    $batch['operations'][] = ['wxt_install_module', (array) 'search'];
    // Enable default permissions for system roles.
    user_role_grant_permissions(AccountInterface::ANONYMOUS_ROLE, [
      'use search',
      'search content',
    ]);
  }

  return $batch;
}

/**
 * Batch API callback. Installs a module.
 *
 * @param string|array $module
 *   The name(s) of the module(s) to install.
 */
function wxt_install_module($module) {
  \Drupal::service('module_installer')->install((array) $module);

  if ($module == 'search') {
    \Drupal::service('router.builder')->rebuild();
  }
}

/**
 * Insert new item in array on any position in PHP (Stack Overflow 3797239).
 *
 * @param array $array
 *   The original array.
 * @param int|string $position
 *   The current position.
 * @param mixed $insert
 *   The array to insert.
 */
function array_insert(array &$array, $position, $insert) {
  if (is_int($position)) {
    array_splice($array, $position, 0, $insert);
  }
  else {
    $pos   = array_search($position, array_keys($array));
    $array = array_merge(
      array_slice($array, 0, $pos),
      $insert,
      array_slice($array, $pos)
    );
  }
}
