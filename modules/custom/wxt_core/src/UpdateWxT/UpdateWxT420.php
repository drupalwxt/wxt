<?php

namespace Drupal\wxt_core\UpdateWxT;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\Extension\ModuleInstallerInterface;
use Drupal\editor\Entity\Editor;
use Drupal\filter\Entity\FilterFormat;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Contains optional configuration updates targeting WxT 4.2.0.
 *
 * @UpdateWxT("4.2.0")
 */
final class UpdateWxT420 implements ContainerInjectionInterface {

  /**
   * The config factory service.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * The module installer service.
   *
   * @var \Drupal\Core\Extension\ModuleInstallerInterface
   */
  private $moduleInstaller;

  /**
   * Update360 constructor.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   The config factory service.
   * @param \Drupal\Core\Extension\ModuleInstallerInterface $module_installer
   *   The module installer service.
   */
  public function __construct(ConfigFactoryInterface $config_factory, ModuleInstallerInterface $module_installer) {
    $this->configFactory = $config_factory;
    $this->moduleInstaller = $module_installer;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('module_installer')
    );
  }

  /**
   * Enables CkEditor ToC functionality.
   *
   * @updatewxt
   *
   * @ask Do you want to enable CkEditor ToC functionality?
   */
  public function enableCkEditorToC() {
    $this->moduleInstaller->install(['wxt_ext_editor']);
    $this->moduleInstaller->install(['toc_filter']);

    $format = FilterFormat::load('rich_text');
    $configuration = $format->filters('filter_caption')->getConfiguration();
    $format->setFilterConfig('entity_embed', ['weight' => $configuration['weight'] + 1]);
    $format->setFilterConfig('toc_filter', [
      'status' => TRUE,
      'settings' => ['type' => 'wxt'],
    ]);
    $format->save();
  }

  /**
   * Enables CkEditor Abbreviation functionality.
   *
   * @updatewxt
   *
   * @ask Do you want to enable CkEditor Abbreviation functionality?
   */
  public function enableCkEditorAbbreviation() {
    $this->moduleInstaller->install(['wxt_ext_editor']);
    $this->moduleInstaller->install(['ckeditor_abbreviation']);

    $editor = Editor::load('rich_text');
    $settings = $editor->getSettings();
    $rows = $settings['toolbar']['rows'];
    foreach ($rows as $row_key => $row) {
      foreach ($row as $group_key => $group) {
        if ($group['name'] === 'WET Components') {
          array_unshift($settings['toolbar']['rows'][$row_key][$group_key]['items'], "abbr");
        }
      }
    }
    $editor->setSettings($settings);
    $editor->save();
  }

  /**
   * Enables CkEditor Alert functionality.
   *
   * @updatewxt
   *
   * @ask Do you want to enable CkEditor Alert functionality?
   */
  public function enableCkEditorAlert() {
    $this->moduleInstaller->install(['wxt_ext_editor']);

    $editor = Editor::load('rich_text');
    $settings = $editor->getSettings();
    $rows = $settings['toolbar']['rows'];
    foreach ($rows as $row_key => $row) {
      foreach ($row as $group_key => $group) {
        if ($group['name'] === 'WET Components') {
          array_push($settings['toolbar']['rows'][$row_key][$group_key]['items'], "alert");
        }
      }
    }
    $editor->setSettings($settings);
    $editor->save();
  }

  /**
   * Enables CkEditor Footnotes functionality.
   *
   * @updatewxt
   *
   * @ask Do you want to enable CkEditor Footnotes functionality?
   */
  public function enableCkEditorFootnotes() {
    $this->moduleInstaller->install(['wxt_ext_editor']);

    $editor = Editor::load('rich_text');
    $settings = $editor->getSettings();
    $rows = $settings['toolbar']['rows'];
    foreach ($rows as $row_key => $row) {
      foreach ($row as $group_key => $group) {
        if ($group['name'] === 'WET Components') {
          array_unshift($settings['toolbar']['rows'][$row_key][$group_key]['items'], "footnotes");
        }
      }
    }
    $editor->setSettings($settings);
    $editor->save();
  }

}
