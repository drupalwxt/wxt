<?php

namespace Drupal\wxt_ext_migration\Plugin\migrate\process;

use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\MigrateSkipProcessException;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;

/**
 * Construct the full directory path of a resource.
 *
 * @MigrateProcessPlugin(
 *   id = "wxt_get_path",
 * )
 */
class GetPath extends ProcessPluginBase {

  /**
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    if (!$value) {
      throw new MigrateSkipProcessException();
    }
    return $this->getModulePath($value);
  }

  /**
   * Custom function for drupal_get_path().
   */
  protected function getModulePath($value) {
    return drupal_get_path('module', 'wxt_ext_migration') . '/data/images/' . $value;
  }

}
