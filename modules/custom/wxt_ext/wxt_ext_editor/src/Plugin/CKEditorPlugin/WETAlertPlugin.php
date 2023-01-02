<?php

namespace Drupal\wxt_ext_editor\Plugin\CKEditorPlugin;

use Drupal\ckeditor\CKEditorPluginInterface;
use Drupal\ckeditor\CKEditorPluginButtonsInterface;
use Drupal\Component\Plugin\PluginBase;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\editor\Entity\Editor;

/**
 * Defines the "alert" plugin.
 *
 * @CKEditorPlugin(
 *   id = "wet_alert",
 *   label = @Translation("WET Alert")
 * )
 */
class WETAlertPlugin extends PluginBase implements CKEditorPluginInterface, CKEditorPluginButtonsInterface {

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
      'alert' => [
        'label' => $this->t('Add alert'),
        'image' => \Drupal::service('extension.list.module')->getPath('wxt_ext_editor') . '/js/plugins/wet_alert/icons/alert.png',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFile() {
    return \Drupal::service('extension.list.module')->getPath('wxt_ext_editor') . '/js/plugins/wet_alert/plugin.js';
  }

}
