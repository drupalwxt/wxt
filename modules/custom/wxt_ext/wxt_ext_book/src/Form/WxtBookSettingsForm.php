<?php

namespace Drupal\wxt_ext_book\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Configure wxt_library settings for this site.
 */
class WxtBookSettingsForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'wxt_ext_book_settings';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'wxt_ext_book.settings',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $config = $this->config('wxt_ext_book.settings');

    // Enable book index persistent navigation
    $form['navigation'] = [
      '#type' => 'fieldset',
      '#title' => $this->t('Book navigation'),
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
    ];

    $form['navigation']['persistent_nav'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Enable persistent navigation on book index'),
      '#default_value' => $config->get('navigation.persistent_nav'),
    ];

    $form['navigation']['page_title_nav_labels'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Use page titles as book navigation labels'),
      '#default_value' => $config->get('navigation.page_title_nav_labels'),
    ];

    $form['navigation']['page_nav_home_link'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Include a home link in book navigation'),
      '#default_value' => $config->get('navigation.page_nav_home_link'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);

    $this->config('wxt_ext_book.settings')
      ->set('navigation.persistent_nav', $form_state->getValue('persistent_nav'))
      ->set('navigation.page_title_nav_labels', $form_state->getValue('page_title_nav_labels'))
      ->set('navigation.page_nav_home_link', $form_state->getValue('page_nav_home_link'))
      ->save();
  }

}
