<?php

namespace Drupal\wxt_ext_editor\Plugin\CKEditorPlugin;

use Drupal\Component\Plugin\PluginBase;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\ckeditor\CKEditorPluginButtonsInterface;
use Drupal\ckeditor\CKEditorPluginInterface;
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

  use StringTranslationTrait;

  /**
   * {@inheritdoc}
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
   * {@inheritdoc}
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
        'label' => $this->t('Add panel'),
        'image' => \Drupal::service('extension.list.module')->getPath('wxt_ext_editor') . '/js/plugins/wet_panel/icons/panel.png',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFile() {
    return \Drupal::service('extension.list.module')->getPath('wxt_ext_editor') . '/js/plugins/wet_panel/plugin.js';
  }

}
