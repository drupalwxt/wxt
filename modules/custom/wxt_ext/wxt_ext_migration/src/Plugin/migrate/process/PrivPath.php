<?php

namespace Drupal\wxt_ext_migration\Plugin\migrate\process;

use Drupal\Core\StreamWrapper\PrivateStream;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\MigrateSkipProcessException;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;

/**
 * Constructs the full private directory path.
 *
 * @MigrateProcessPlugin(
 *   id = "wxt_priv_path",
 * )
 */
class PrivPath extends ProcessPluginBase {

  /**
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    if (!$value) {
      throw new MigrateSkipProcessException();
    }
    return $this->getPrivPath($value);
  }

  /**
   * Custom function for getPrivPath().
   */
  protected function getPrivPath($value) {
    $file = str_replace('public://', '', $value);
    return PrivateStream::basePath() . '/files/' . $file;
  }

}
