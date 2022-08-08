<?php

namespace Drupal\wxt_ext_media\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * The settings form for controlling WxT Extend Media's behavior.
 */
class SettingsForm extends ConfigFormBase {

  /**
   * The entity type manager service.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  private $entityTypeManager;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    $form = parent::create($container);
    $form->entityTypeManager = $container->get('entity_type.manager');
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return ['wxt_ext_media.settings'];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'wxt_ext_media_settings_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $settings = $this->config('wxt_ext_media.settings');

    $form['choose_display'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Allow users to choose how to display embedded media'),
      '#default_value' => $settings->get('entity_embed.choose_display'),
    ];
    $form['revision_ui'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Show revision UI on media forms'),
      '#default_value' => $settings->get('revision_ui'),
    ];
    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $this->config('wxt_ext_media.settings')
      ->set('entity_embed.choose_display', (bool) $form_state->getValue('choose_display'))
      ->set('revision_ui', (bool) $form_state->getValue('revision_ui'))
      ->save();

    // Clear the cached entity type definitions so that the new visibility of
    // the revision UI will take effect.
    // @see wxt_ext_media_entity_type_alter()
    $this->entityTypeManager->clearCachedDefinitions();

    parent::submitForm($form, $form_state);
  }

}
