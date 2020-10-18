<?php

namespace Drupal\wxt_ext_migration\Plugin\migrate\process;

use Drupal\Component\Uuid\UuidInterface;
use Drupal\Core\Block\BlockManagerInterface;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\layout_builder\Section;
use Drupal\layout_builder\SectionComponent;
use Drupal\migrate\MigrateExecutableInterface;
use Drupal\migrate\Plugin\MigrationInterface;
use Drupal\migrate\Plugin\MigrateProcessInterface;
use Drupal\migrate\ProcessPluginBase;
use Drupal\migrate\Row;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Constructs Layouts derived from data.
 *
 * @MigrateProcessPlugin(
 *   id = "wxt_layout_plugin_id",
 *   handle_multiples = TRUE
 * )
 */
class LayoutPluginId extends ProcessPluginBase implements ContainerFactoryPluginInterface {

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
    $sections = [];
    $section = new Section($value['layout_id'], $value['layout_settings']);
    $sections[] = $section;
    foreach ($value['components'] as $tmp_component) {
      list($module, $delta) = explode(":", $tmp_component['configuration']['id'], 2);
      switch ($module) {
        case 'block_content':
          $block_id = $this->migrationPlugin
            ->transform($delta, $migrate_executable, $row, $destination_property);
          // Language Handling.
          if (is_array($block_id)) {
            $block_id = current($block_id);
          }
          if ($block_id) {
            $tmp_component['configuration']['id'] = $module . ':' . $this->blockContentStorage->load($block_id)->uuid();
            $tmp_component['configuration']['status'] = TRUE;
            $tmp_component['configuration']['info'] = '';
          }
          break;

        case 'entity_block':
          $block_id = $this->migrationPlugin
            ->transform($delta, $migrate_executable, $row, $destination_property);
          if ($block_id) {
            $tmp_component['configuration']['id'] = $module . ':media';
            $tmp_component['configuration']['entity'] = $block_id;
          }
          break;

        default:
          break;
      }
      $component = $this->getComponents($tmp_component);
      $section->appendComponent($component);
    }

    return $sections;
  }

  /**
   * {@inheritdoc}
   */
  public function multiple() {
    return TRUE;
  }

  /**
   * Helper to get section components.
   */
  protected function getComponents($component) {
    $configuration = $component["configuration"];
    if (empty($configuration)) {
      return FALSE;
    }
    $region = $component["region"];
    $component = new SectionComponent($this->uuidService->generate(), $region, $configuration);
    return $component;
  }

}
