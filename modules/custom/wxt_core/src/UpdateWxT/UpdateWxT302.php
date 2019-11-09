<?php

namespace Drupal\wxt_core\UpdateWxT;

use Drupal\Core\Database\Connection;
use Drupal\Core\Database\DatabaseException;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\wxt_core\ConfigHelper as Config;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Contains optional configuration updates targeting WxT 3.0.2.
 *
 * @UpdateWxT("3.0.2")
 */
final class UpdateWxT302 implements ContainerInjectionInterface {

  /**
   * The database connection to which to dump route information.
   *
   * @var \Drupal\Core\Database\Connection
   */
  protected $connection;

  /**
   * Update302 constructor.
   *
   * @param \Drupal\Core\Database\Connection $connection
   *   The database connection which will be used to store the route
   *   information.
   */
  public function __construct(Connection $connection) {
    $this->connection = $connection;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static($container->get('database'));
  }

  /**
   * Checks if schema exists for layout builder.
   *
   * @updatewxt
   *
   * @ask Do you want to check if the schema exists for layout builder?
   */
  public function checkLayoutBuilderSchema() {
    try {
      if (!$this->connection->schema()->tableExists('inline_block_usage')) {
        $this->connection->schema()->createTable('inline_block_usage', $this->schemaDefinition());
        return TRUE;
      }
    }
    catch (DatabaseException $e) {
      // If another process has already created the config table, attempting to
      // recreate it will throw an exception. In this case just catch the
      // exception and do nothing.
      return TRUE;
    }
    return FALSE;
  }

  /**
   * Corrects the image link field not being displayed in Form Display.
   *
   * @updatewxt
   *
   * @ask Do you want to correct the image link field not being displayed in Form Display for Media Entity Image?
   */
  public function correctImageLinkDisplay() {
    $config = Config::forModule('wxt_core')->optional();
    $config->getEntity('entity_form_display', 'media.image.default')->save();
  }

  /**
   * Defines the schema for the inline_block_usage table.
   *
   * @return array
   *   The schema API definition for the SQL storage table.
   *
   * @internal
   */
  protected function schemaDefinition() {
    $schema = [
      'description' => 'Track where a block_content entity is used.',
      'fields' => [
        'block_content_id' => [
          'description' => 'The block_content entity ID.',
          'type' => 'int',
          'unsigned' => TRUE,
          'not null' => TRUE,
        ],
        'layout_entity_type' => [
          'description' => 'The entity type of the parent entity.',
          'type' => 'varchar_ascii',
          'length' => EntityTypeInterface::ID_MAX_LENGTH,
          'not null' => FALSE,
          'default' => '',
        ],
        'layout_entity_id' => [
          'description' => 'The ID of the parent entity.',
          'type' => 'varchar_ascii',
          'length' => 128,
          'not null' => FALSE,
          'default' => 0,
        ],
      ],
      'primary key' => ['block_content_id'],
      'indexes' => [
        'type_id' => ['layout_entity_type', 'layout_entity_id'],
      ],
    ];

    return $schema;
  }

}
