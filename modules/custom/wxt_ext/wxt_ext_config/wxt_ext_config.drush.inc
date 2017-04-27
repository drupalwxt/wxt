<?php

/**
 * @file
 * Contains wxt_ext_config.drush.inc.
 */

use Drupal\Core\Config\StorageComparer;
use Drupal\Core\Config\FileStorage;
use Drush\Config\StorageWrapper;
use Drush\Log\LogLevel;

/**
 * Implements hook_drush_command().
 */
function wxt_ext_config_drush_command() {
  $items = [];

  $items['wxt-cex'] = [
    'description' => 'Runs the normal Drush "config-export" command with default args/options, with added magic to auto-update existing .yml files.',
    'aliases' => ['wcex'],
  ];

  return $items;
}

/**
 * Runs the "config-export" command with added options for what to do with
 * newly updated config.
 *
 * @return bool
 */
function drush_wxt_ext_config_wxt_cex() {
  global $config_directories;

  // Allow user to choose the destination.
  $choices = drush_map_assoc(array_keys($config_directories));
  unset($choices[CONFIG_ACTIVE_DIRECTORY]);
  if (count($choices) >= 2) {
    $destination = drush_choice($choices, dt('Choose a destination.'));
    if (empty($destination)) {
      return drush_user_abort();
    }
  }
  elseif (!isset($destination)) {
    $destination = CONFIG_SYNC_DIRECTORY;
  }
  $destination_dir = config_get_config_directory($destination);

  $change_list = _wxt_ext_config_get_change_list($destination_dir);
  // Return early if there are no pending changes.
  if (empty($change_list)) {
    return TRUE;
  }

  // Initiate the normal export routines.
  $result = _drush_config_export(NULL, $destination_dir, NULL);

  // If config was exported by _drush_config_export(), cycle through the config
  // CRUD operations and attempt to automatically update config.
  if ($result) {
    $destination_storage = new FileStorage($destination_dir);

    foreach ($change_list as $type => $list) {
      switch ($type) {
        case 'create':
          foreach ($list as $config) {
            $input = drush_prompt(dt('Enter destination module for new config @config, or "none" to skip', ['@config' => $config]));
            if ($input == 'none') {
              continue;
            }
            try {
              $module_info = \Drupal::moduleHandler()->getModule($input);
              $destination_dir = DRUPAL_ROOT . '/' . $module_info->getPath() . '/config/install/';
              $source = DRUPAL_ROOT . '/' . $destination_storage->getFilePath($config);
              // Create /config/install directory if it does not exist.
              if (!file_exists($destination_dir)) {
                mkdir($destination_dir, 0755, TRUE);
              }
              $destination = $destination_dir . basename($source);
              if (!copy($source, $destination)) {
                drush_log(dt('New copy from @source to @destination failed.', ['@source' => $source, '@destination' => $destination]), LogLevel::ERROR);
              }
              else {
                _wxt_ext_config_strip_uuid($destination);
                drush_log(dt('Successfully created @config.', ['@config' => $config]), LogLevel::OK);
              }
            }
            catch (InvalidArgumentException $e) {
              drush_log(dt('Module @input does not exist or is not enabled.', ['@input' => $input]), LogLevel::ERROR);
            }
          }
          break;

        case 'update':
          foreach ($list as $config) {
            $source = DRUPAL_ROOT . '/' . $destination_storage->getFilePath($config);

            $instances = _wxt_ext_config_find_config_instances($destination_storage, $config);
            $choice = drush_choice($instances, dt('Choose update destination for @config.', ['@config' => $config]));
            if ($choice !== FALSE) {
              $destination = $instances[$choice];
              if (!copy($source, $destination)) {
                drush_log(dt('Copy from @source to @destination failed.', ['@source' => $source, '@destination' => $destination]), LogLevel::ERROR);
              }
              else {
                _wxt_ext_config_strip_uuid($destination);
                drush_log(dt('Successfully copied @config.', ['@config' => $config]), LogLevel::OK);
              }
            }
          }
          break;

        case 'delete':
          foreach ($list as $config) {
            $instances = _wxt_ext_config_find_config_instances($destination_storage, $config);
            $choice = drush_choice($instances, dt('Choose delete destination for @config.', ['@config' => $config]));
            if ($choice !== FALSE) {
              if (!unlink($instances[$choice])) {
                drush_log(dt('Deletion of @path failed.', ['@path' => $instances[$choice]]), LogLevel::ERROR);
              }
              else {
                drush_log(dt('Successfully deleted @config.', ['@config' => $config]), LogLevel::OK);
              }
            }
          }
          break;

        case 'rename':
          // Never seen this in practice, but we can add support if needed.
          break;

      }
    }
  }

  return TRUE;
}

/**
 * Finds instances of the given config in current Drupal modules and themes.
 *
 * @param \Drupal\Core\Config\FileStorage $storage
 * @param string $config
 *
 * @return array
 */
function _wxt_ext_config_find_config_instances($storage, $config) {
  $file_path = $storage->getFilePath($config);
  $filename = basename($file_path);

  $iterator = new RecursiveDirectoryIterator(DRUPAL_ROOT, FilesystemIterator::FOLLOW_SYMLINKS);
  $files = [];
  foreach (new RecursiveIteratorIterator($iterator) as $file) {
    if (strpos($file, $filename) !== FALSE && strpos($file, DRUPAL_ROOT . '/sites/') === FALSE) {
      $files[] = (string) $file;
    }
  }

  return $files;
}

/**
 * Retrieve a list of differences between the active and target configuration.
 *
 * @param string $destination_dir
 *   A directory path to use for reading and writing of configuration files.
 *
 * @return array
 *   An associative array of changes keyed by the change type.
 */
function _wxt_ext_config_get_change_list($destination_dir) {
  // Retrieve a list of differences between the active and target configuration.
  $target_storage = new FileStorage($destination_dir);
  /** @var \Drupal\Core\Config\StorageInterface $active_storage */
  $active_storage = Drupal::service('config.storage');
  $comparison_source = $active_storage;

  $config_comparer = new StorageComparer($comparison_source, $target_storage, \Drupal::service('config.manager'));
  if (!$config_comparer->createChangelist()->hasChanges()) {
    drush_log(dt('The active configuration is identical to the configuration in the export directory (!target).', ['!target' => $destination_dir]), LogLevel::OK);
    return [];
  }

  // Collect the changelist. Only the default language is currently supported.
  $change_list = $config_comparer->getChangelist();

  return $change_list;
}

/**
 * Strips UUID from a config file, if the file exists and has a UUID.
 *
 * @param string $filepath
 *   The full path to the file.
 *
 * @return bool
 *   Whether or not the operation was successful.
 */
function _wxt_ext_config_strip_uuid($filepath) {
  if ($file = file($filepath)) {
    if (strpos($file[0], 'uuid:') === 0) {
      array_shift($file);
      file_put_contents($filepath, implode($file));
    }
    return TRUE;
  }
  else {
    return FALSE;
  }
}
