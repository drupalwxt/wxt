<?php

namespace Drupal\wxt_ext_editor\Plugin\CKEditorPlugin;

use Drupal\ckeditor\CKEditorPluginInterface;
use Drupal\ckeditor\CKEditorPluginButtonsInterface;
use Drupal\Component\Plugin\PluginBase;
use Drupal\editor\Entity\Editor;

/**
 * Defines the "detail" plugin.
 *
 * @CKEditorPlugin(
 *   id = "wet_panel",
 *   label = @Translation("WET Panel")
 * )
 */
class WETPanelPlugin extends PluginBase implements CKEditorPluginInterface, CKEditorPluginButtonsInterface {

  /**
   * Implements \Drupal\ckeditor\Plugin\CKEditorPluginInterface::getDependencies().
   */
  public function getDependencies(Editor $editor) {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function getLibraries(Editor $editor) {
    return ['core/drupal.jquery'];
  }

  /**
   * Implements \Drupal\ckeditor\Plugin\CKEditorPluginInterface::isInternal().
   */
  public function isInternal() {
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function getConfig(Editor $editor) {
    return [];
  }

  /**
   * {@inheritdoc}
   */
  public function getButtons() {
    return [
      'panel' => [
        'label' => t('Add panel'),
        'image' => drupal_get_path('module', 'wxt_ext_editor') . '/js/plugins/wet_panel/icons/panel.png',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFile() {
    return drupal_get_path('module', 'wxt_ext_editor') . '/js/plugins/wet_panel/plugin.js';
  }

}
