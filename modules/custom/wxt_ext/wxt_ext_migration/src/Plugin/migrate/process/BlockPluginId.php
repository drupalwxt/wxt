<?php

namespace Drupal\wxt_ext_migration\Plugin\migrate\process;

use Drupal\Component\Plugin\Exception\PluginNotFoundException;
use Drupal\Component\Uuid\UuidInterface;
use Drupal\Core\Block\BlockManagerInterface;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Plugin\MigrationInterface;
use Drupal\migrate\Plugin\MigrateProcessInterface;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Constructs blocks derived from data.
 *
 * @MigrateProcessPlugin(
 *   id = "wxt_block_plugin_id",
 *   handle_multiples = TRUE
 * )
 */
class BlockPluginId extends ProcessPluginBase implements ContainerFactoryPluginInterface {

  /**
   * @var \Drupal\Core\Block\BlockManagerInterface
   */
  protected $blockManager;

  /**
   * The block_content entity storage handler.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $blockContentStorage;

  /**
   * The block storage.
   *
   * @var \Drupal\Core\Entity\EntityStorageInterface
   */
  protected $blockStorage;

  /**
   * The UUID service.
   *
   * @var \Drupal\Component\Uuid\UuidInterface
   */
  protected $uuidService;

  /**
   * Constructs a Block Plugin lookup service.
   *
   * @param array $configuration
   *   Plugin configuration.
   * @param string $plugin_id
   *   Plugin id.
   * @param mixed $plugin_definition
   *   Plugin definition.
   * @param \Drupal\Core\Entity\EntityStorageInterface $storage
   *   Plugin storage.
   * @param \Drupal\migrate\Plugin\MigrateProcessInterface $migration_plugin
   *   Migration plugin.
   * @param \Drupal\Component\Uuid\UuidInterface $uuid_service
   *   UUID service.
   * @param \Drupal\Core\Block\BlockManagerInterface $block_manager
   *   Block manager.
   * @param \Drupal\Core\Entity\EntityStorageInterface|null $block_storage
   *   Block storage.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityStorageInterface $storage, MigrateProcessInterface $migration_plugin, UuidInterface $uuid_service, BlockManagerInterface $block_manager, EntityStorageInterface $block_storage = NULL) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->blockContentStorage = $storage;
    $this->migrationPlugin = $migration_plugin;
    $this->uuidService = $uuid_service;
    $this->blockManager = $block_manager;
    $this->blockStorage = $block_storage;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition, MigrationInterface $migration = NULL) {
    $entity_manager = $container->get('entity_type.manager');
    $migration_configuration = [
      'migration' => [
        'wxt_media',
      ],
    ];

    // Handle any custom migrations leveraging this plugin.
    $migration_dependencies = $migration->getMigrationDependencies();
    if (isset($migration_dependencies['required'])) {
      foreach ($migration_dependencies['required'] as $dependency) {
        if (strpos($dependency, 'block') !== FALSE ||
            strpos($dependency, 'media') !== FALSE ||
            strpos($dependency, 'node') !== FALSE) {
          $migration_configuration['migration'][] = $dependency;
        }
      }
    }

    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $entity_manager->getDefinition('block_content') ? $entity_manager->getStorage('block_content') : NULL,
      $container->get('plugin.manager.migrate.process')->createInstance('migration', $migration_configuration, $migration),
      $container->get('uuid'),
      $container->get('plugin.manager.block'),
      $entity_manager->hasHandler('block', 'storage') ? $entity_manager->getStorage('block') : NULL
    );
  }

  /**
   * {@inheritdoc}
   */
  public function transform($value, MigrateExecutableInterface $migrate_executable, Row $row, $destination_property) {
    $blocks = [];
    foreach ($value as $tmp_block) {
      $uuid = $this->uuidService->generate();
      if (is_array($tmp_block)) {
        list($module, $delta) = explode(":", $tmp_block['id'], 2);
        switch ($module) {
          case 'block_content':
            $block_id = $this->migrationPlugin
              ->transform($delta, $migrate_executable, $row, $destination_property);
            // Language Handling.
            if (is_array($block_id)) {
              $block_id = current($block_id);
            }
            if ($block_id) {
              $block = [
                'id' => $module . ':' . $this->blockContentStorage->load($block_id)->uuid(),
                'status' => TRUE,
                'info' => '',
                'view_mode' => $tmp_block['view_mode'],
              ];
            }
            break;

          case 'entity_block':
            $block_id = $this->migrationPlugin
              ->transform($delta, $migrate_executable, $row, $destination_property);
            if ($block_id) {
              $block = [
                'id' => $module . ':media',
                'view_mode' => $tmp_block['view_mode'],
                'entity' => $block_id,
              ];
            }
            break;

          case 'entity_field':
            $block = [
              'id' => $module . ':' . $delta,
            ];
            if ($delta == 'node:body') {
              $block['formatter'] = [
                'label' => 'hidden',
                'type' => 'text_default',
                'settings' => [],
                'third_party_settings' => [],
              ];
            }
            break;

          case 'facet_block':
            $block = [
              'id' => $module . ':' . $delta,
            ];
            break;

          case 'facets_summary_block':
            $block = [
              'id' => $module . ':' . $delta,
            ];
            break;

          case 'page_title_block':
            $block = [
              'id' => $module,
            ];
            break;

          case 'local_tasks_block':
            $block = [
              'id' => $module,
              'primary' => TRUE,
              'secondary' => TRUE,
            ];
            break;

          case 'views_block':
            $block = [
              'id' => $module . ':' . $delta,
              'views_label' => '',
              'items_per_page' => 'none',
            ];
            break;

          default:
            break;

        }

        $block['label'] = $tmp_block['label'];
        $block['label_display'] = $tmp_block['label_display'];
        $block['region'] = $tmp_block['region'];
        $block['weight'] = $tmp_block['weight'];
        $block['uuid'] = $uuid;
        $block['context_mapping'] = [];

        try {
          $definition = $this->blockManager->getDefinition($block['id']);
        }
        catch (PluginNotFoundException $e) {
          continue;
        }

        if (isset($definition['provider'])) {
          $block['provider'] = $definition['provider'];
        }

        if (isset($definition['context']['entity'])) {
          $block['context_mapping']['entity'] = '@panelizer.entity_context:entity';
        }

        $blocks[$uuid] = $block;
      }
    }

    return $blocks;
  }

  /**
   * {@inheritdoc}
   */
  public function multiple() {
    return TRUE;
  }

}
