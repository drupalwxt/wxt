<?php

namespace Drupal\wxt_ext_migration\Plugin\migrate\source;

use Drupal\migrate\Plugin\migrate\source\EmbeddedDataSource;
use Drupal\migrate\Row;

/**
 * Provides custom_embedded_data source plugin.
 *
 * @MigrateSource(
 *   id = "custom_embedded_data"
 * )
 */
class CustomEmbeddedDataSource extends EmbeddedDataSource {

  /**
   * {@inheritdoc}
   */
  public function prepareRow(Row $row) {
    $nid = $row->getSourceProperty('name');
    $row->setSourceProperty('nid', $nid);
    $row->setDestinationProperty('nid', $nid);
    return parent::prepareRow($row);
  }

}
