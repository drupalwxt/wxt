<?php

namespace Drupal\wxt_ext_config\Commands;

use Drush\Drupal\Commands\config\ConfigExportCommands;
use Drupal\Core\Config\StorageComparer;
use Drupal\Core\Config\FileStorage;
use Drush\Log\LogLevel;
use Drupal\Core\Site\Settings;

/**
 * A drush command file.
 *
 * @package Drupal\wxt_ext_config\Commands
 */
class Wxtcex extends ConfigExportCommands {

  /**
   * Runs Drush "config-export" command then tries to update existing .yml.
   *
   * @command wxt_ext_config:wxt-cex
   * @aliases wxt-cex wcex
   * @usage wxt_ext_config:wxt-cex
   */
  public function wxtConfigExport() {

    $destination_dir = Settings::get('config_sync_directory');

    $change_list = $this->getChangeList($destination_dir);
    // Return early if there are no pending changes.
    if (empty($change_list)) {
      return TRUE;
    }

    // Initiate the normal export routines.
    $result = parent::export(NULL, ['destination' => $destination_dir]);

    // If config was exported, cycle through the config
    // CRUD operations and attempt to automatically update config.
    if ($result) {
      $destination_storage = new FileStorage($destination_dir);

      foreach ($change_list as $type => $list) {
        switch ($type) {
          case 'create':
            foreach ($list as $config) {
              $input = $this->io()->ask(dt('Enter destination module for new config @config, or "none" to skip', ['@config' => $config]));
              if ($input == 'none') {
                continue;
              }
              try {
                $module_info = \Drupal::moduleHandler()->getModule($input);
                $destination_dir = DRUPAL_ROOT . '/' . $module_info->getPath() . '/config/install/';
                $source = DRUPAL_ROOT . '/' . $destination_storage->getFilePath($config);
                // Create /config/install directory if it does not exist.
                if (!file_exists($destination_dir)) {
                  mkdir($destination_dir, 0775, TRUE);
                }
                $destination = $destination_dir . basename($source);
                if (!copy($source, $destination)) {
                  $this->logger->log(LogLevel::ERROR, 'New copy from {source} to {destination} failed.', ['source' => $source, 'destination' => $destination]);
                }
                else {
                  $this->stripUuid($destination);
                  $this->logger->log(LogLevel::OK, 'Successfully created {config}.', ['config' => $config]);
                }
              }
              catch (InvalidArgumentException $e) {
                $this->logger->log(LogLevel::ERROR, 'Module {input} does not exist or is not enabled.', ['input' => $input]);
              }
            }
            break;

          case 'update':
            foreach ($list as $config) {
              $source = DRUPAL_ROOT . '/' . $destination_storage->getFilePath($config);

              $instances = $this->findConfigInstances($destination_storage, $config);
              // Add an option to skip as cancel stops everything.
              $instances = array_merge(['skip' => 'Skip'], $instances);
              $choice = $this->io()->choice(dt('Choose update destination for @config.', ['@config' => $config]), $instances, NULL);
              if ($choice !== 'skip') {
                $destination = $instances[$choice];
                if (!copy($source, $destination)) {
                  $this->logger->log(LogLevel::ERROR, 'Copy from {source} to {destination} failed.', ['source' => $source, 'destination' => $destination]);
                }
                else {
                  $this->stripUuid($destination);
                  $this->logger->log(LogLevel::OK, 'Successfully copied {config}.', ['config' => $config]);
                }
              }
            }
            break;

          case 'delete':
            foreach ($list as $config) {
              $instances = $this->findConfigInstances($destination_storage, $config);
              // Add an option to skip as cancel stops everything.
              $instances = array_merge(['skip' => 'Skip'], $instances);
              $choice = $this->io()->choice(dt('Choose delete destination for @config.', ['@config' => $config]), $instances, NULL);
              if ($choice !== 'skip') {
                if (!unlink($instances[$choice])) {
                  $this->logger->log(LogLevel::ERROR, 'Deletion of {path} failed.', ['path' => $instances[$choice]]);
                }
                else {
                  $this->logger->log(LogLevel::OK, 'Successfully deleted {config}.', ['config' => $config]);
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
   *   The FileStorage object.
   * @param string $config
   *   The config string.
   *
   * @return array
   *   Returns array of files found.
   */
  private function findConfigInstances(FileStorage $storage, $config) {
    $file_path = $storage->getFilePath($config);
    $filename = basename($file_path);

    $iterator = new \RecursiveDirectoryIterator(DRUPAL_ROOT, \FilesystemIterator::FOLLOW_SYMLINKS);
    $files = [];
    foreach (new \RecursiveIteratorIterator($iterator) as $file) {
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
  private function getChangeList($destination_dir) {
    // Retrieve list of differences between the active and target configuration.
    $target_storage = new FileStorage($destination_dir);
    /** @var \Drupal\Core\Config\StorageInterface $active_storage */
    $active_storage = \Drupal::service('config.storage');
    $comparison_source = $active_storage;

    $config_comparer = new StorageComparer($comparison_source, $target_storage, \Drupal::service('config.manager'));
    if (!$config_comparer->createChangelist()->hasChanges()) {
      $this->logger->log(LogLevel::OK, 'The active configuration is identical to the configuration in the export directory ({target}).', ['target' => $destination_dir]);
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
  private function stripUuid($filepath) {
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

}
