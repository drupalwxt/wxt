<?php

namespace Drupal\wxt_ext_migration\Plugin\migrate\destination;

use Drupal\migrate\Plugin\migrate\destination\DestinationBase;
use Drupal\migrate\Plugin\MigrationInterface;
use Drupal\migrate\Row;

/**
 * Provides nulldest destination plugin.
 *
 * @MigrateDestination(
 *   id = "nulldestination"
 * )
 */
class NullDestination extends DestinationBase {

  /**
   * {@inheritdoc}
   */
  public function getIds() {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function fields(MigrationInterface $migration = NULL) {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function import(Row $row, array $old_destination_id_values = []) {
  }

}
